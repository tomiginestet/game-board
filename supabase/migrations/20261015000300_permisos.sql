-- Quién puede cambiar qué dentro de un club.
--
-- Hasta acá alcanzaba con el código del club para escribir cualquier cosa (con o sin cuenta).
-- Desde esta migración:
-- - Para guardar cambios hay que tener sesión y ser parte del club (`memberships`). Sin cuenta, la app
--   sólo lee: `pull_changes`, `pull_changes_all` y `get_club` siguen abiertos con el código.
-- - Cualquier integrante puede crear cosas nuevas (partidas, juegos, torneos, jugadores, equipos).
-- - Cambiar o borrar algo que ya existe lo pueden hacer:
--   - el dueño o un admin del club;
--   - quien lo creó (`entities.created_by`);
--   - en una partida (`play`) o partido de ping pong (`match`), los que juegan en ella (sólo cambiar, no borrar);
--   - en un jugador, la cuenta que dijo "este soy yo" (sólo cambiar, no borrar).
-- - Lo que se crea antes de esta migración no tiene autor: lo cambian los admins (y los que juegan, en las
--   partidas; y cada uno su jugador).
-- - `push_changes` devuelve lo que no se aceptó, para que la app lo vuelva a como está en el servidor.
-- - El Ping Pong Club (sin cuentas) queda en sólo lectura.
--
-- La app aplica las mismas reglas antes de guardar (`src/lib/access.ts`); estas son las que valen.

-- (El panel de admin ya puede haber agregado estas columnas.)
alter table public.clubs add column if not exists disabled_at timestamptz;
alter table public.entities
  add column if not exists created_by uuid references auth.users (id) on delete set null,
  add column if not exists updated_by uuid references auth.users (id) on delete set null;

-- Los jugadores ya reclamados son de su cuenta.
update public.entities e
  set created_by = m.user_id
from public.memberships m
where e.kind = 'player' and e.club_code = m.club_code and e.id = m.player_id and e.created_by is null;

-- La app lee el autor dentro de `data`: se copia (con versión nueva, para que los dispositivos lo bajen).
update public.entities e
  set data = e.data || jsonb_build_object('createdBy', e.created_by),
      v = greatest(e.v + 1, (extract(epoch from clock_timestamp()) * 1000)::bigint),
      updated_at = clock_timestamp()
where e.created_by is not null and not e.deleted and e.data is not null
  and e.data ->> 'createdBy' is distinct from e.created_by::text;

-- ¿Juega `p_player` en esta partida o partido (o está citado a la convocatoria)?
create or replace function public._plays_in(p_kind text, p_data jsonb, p_player text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_player is not null and p_data is not null and case p_kind
    when 'play' then exists (
      select 1
      from jsonb_array_elements(case when jsonb_typeof(p_data -> 'sides') = 'array' then p_data -> 'sides' else '[]'::jsonb end) s,
           jsonb_array_elements_text(case when jsonb_typeof(s -> 'players') = 'array' then s -> 'players' else '[]'::jsonb end) pl
      where pl = p_player)
      -- En una convocatoria, los citados también: responden si van.
      or (jsonb_typeof(p_data -> 'invited') = 'array' and p_data -> 'invited' ? p_player)
    when 'match' then p_player in (p_data ->> 'playerA', p_data ->> 'playerB', p_data ->> 'partnerA', p_data ->> 'partnerB')
    else false
  end;
$$;

revoke all on function public._plays_in(text, jsonb, text) from public, anon, authenticated;

-- Sube cambios: [{kind, id, data, deleted, v}, ...]. Gana la versión más alta, si quien sube puede hacer ese cambio.
-- Devuelve lo rechazado por permisos (no lo ignorado por versión vieja).
drop function public.push_changes(text, jsonb);
create function public.push_changes(p_code text, p_items jsonb)
returns table (rejected_kind text, rejected_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := (select auth.uid());
  my_role text;
  my_player text;
  is_admin boolean;
  it jsonb;
  k text;
  i text;
  del boolean;
  ver bigint;
  body jsonb;
  cur public.entities;
  author uuid;
begin
  if me is null then
    raise exception 'Hay que iniciar sesión para guardar cambios';
  end if;
  -- Un club desactivado desde el panel de admin es un club que no existe.
  if not exists (select 1 from public.clubs c where c.code = p_code and c.disabled_at is null) then
    raise exception 'Club inexistente';
  end if;
  select m.role, m.player_id into my_role, my_player
  from public.memberships m where m.club_code = p_code and m.user_id = me;
  if not found then
    raise exception 'No sos parte de este club';
  end if;
  is_admin := my_role in ('owner', 'admin');

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 1000 then
    raise exception 'Lote inválido';
  end if;
  if exists (select 1 from jsonb_array_elements(p_items) x where pg_column_size(x) > 200000) then
    raise exception 'Elemento demasiado grande';
  end if;

  for it in select x from jsonb_array_elements(p_items) x loop
    k := it ->> 'kind';
    i := it ->> 'id';
    del := coalesce((it ->> 'deleted')::boolean, false);
    ver := (it ->> 'v')::bigint;
    body := it -> 'data';
    if not del and jsonb_typeof(body) is distinct from 'object' then
      raise exception 'Elemento inválido';
    end if;

    select * into cur from public.entities e
    where e.club_code = p_code and e.kind = k and e.id = i
    for update;

    if not found then
      -- Nuevo: lo puede crear cualquier integrante, y queda a su nombre.
      insert into public.entities (club_code, kind, id, data, deleted, v, updated_at, created_by, updated_by)
      values (p_code, k, i, case when del then null else body || jsonb_build_object('createdBy', me) end, del, ver, clock_timestamp(), me, me);
      continue;
    end if;

    if cur.v >= ver then
      continue;
    end if;

    -- `coalesce`: sin autor o sin jugador las comparaciones dan null, y null tiene que ser "no".
    if not coalesce(
      cur.deleted
      or is_admin
      or cur.created_by = me
      or (not del and k = 'player' and i = my_player)
      or (not del and k in ('play', 'match') and public._plays_in(k, cur.data, my_player)),
      false
    ) then
      rejected_kind := k;
      rejected_id := i;
      return next;
      continue;
    end if;

    -- El autor no cambia (salvo al volver a crear algo borrado que no tenía autor).
    author := case when cur.deleted then coalesce(cur.created_by, me) else cur.created_by end;
    update public.entities e
      set data = case
                   when del then null
                   when author is null then body - 'createdBy'
                   else body || jsonb_build_object('createdBy', author)
                 end,
          deleted = del,
          v = ver,
          created_by = author,
          updated_by = me,
          updated_at = clock_timestamp()
    where e.club_code = p_code and e.kind = k and e.id = i;
  end loop;
end;
$$;

revoke all on function public.push_changes(text, jsonb) from public, anon;
grant execute on function public.push_changes(text, jsonb) to authenticated;

-- Crear clubes sin cuenta tampoco (Game Board crea grupos con `create_group`).
revoke execute on function public.create_club(text) from anon;
