-- Un club nuevo no puede recibir los datos de otro club de quien lo crea.
--
-- Las versiones viejas de la app, al crear un club estando en otro, copiaban al nuevo todo lo del club
-- activo (jugadores, partidas…). La app ya no lo hace, pero una pestaña sin recargar sí: por eso el freno
-- va acá. `push_changes` rechaza crear (o revivir después de borrado) algo que ya existe, sin borrar, en otro
-- club de quien sube (salvo su propio jugador). Lo rechazado vuelve como siempre en la lista de rechazos.

create or replace function public.push_changes(p_code text, p_items jsonb)
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
  is_new boolean;
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
    is_new := not found;

    -- Algo nuevo acá (o que vuelve después de borrado) que ya existe, sin borrar, en otro club de quien sube
    -- es una copia de ese club: las versiones viejas de la app pasaban el club activo entero a uno recién
    -- creado. Se rechaza, salvo el jugador de la propia cuenta (el mismo en todos sus clubes).
    if not del and (is_new or cur.deleted) and exists (
      select 1
      from public.memberships m
      join public.entities e on e.club_code = m.club_code and e.kind = k and e.id = i
      where m.user_id = me and m.club_code <> p_code and not e.deleted
        and not (k = 'player' and (i = my_player or e.id = m.player_id))
    ) then
      rejected_kind := k;
      rejected_id := i;
      return next;
      continue;
    end if;

    if is_new then
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
