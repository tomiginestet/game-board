-- Links cortos y clubes de lugar (un bar, un club, un complejo de canchas).
--
-- - `slug`: el nombre del link corto (`/c/lasartes`). Lo elige un admin. Quien conoce el slug llega al
--   código del club, así que un club con slug es, a efectos prácticos, un club con link público: es lo
--   que se imprime en el QR del bar. Sin slug, el código sigue siendo secreto como siempre.
-- - `venue`: si no es null, el club es de un lugar. Guarda la dirección y los juegos que tiene el lugar
--   (ids del catálogo): `{ "address": "...", "games": ["pingpong", "pool"] }`.
-- - En un club de lugar se anota con cuenta: sólo los integrantes pueden subir cambios. Así un admin
--   puede sacar a quien moleste. Ver el ranking sigue siendo con el código (o el slug), sin cuenta.
--   La regla va en un trigger para no reescribir `push_changes` (la usan las dos apps).

alter table public.clubs
  add column slug text check (char_length(slug) between 3 and 30 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  add column venue jsonb check (venue is null or (jsonb_typeof(venue) = 'object' and pg_column_size(venue) <= 4000));

create unique index clubs_slug_idx on public.clubs (slug) where slug is not null;

-- ---------------------------------------------------------------------------
-- Datos públicos de un club, para la vista previa de un link o un QR (sin cuenta).

create function public.club_card(p_code text)
returns table (code text, name text, emoji text, description text, slug text, venue jsonb, members integer)
language sql
stable
security definer
set search_path = ''
as $$
  select c.code, c.name, c.emoji, c.description, c.slug, c.venue,
         (select count(*)::integer from public.memberships m where m.club_code = c.code)
  from public.clubs c
  where c.code = p_code and c.kind = 'group';
$$;

-- Lo mismo, a partir del link corto.
create function public.club_by_slug(p_slug text)
returns table (code text, name text, emoji text, description text, slug text, venue jsonb, members integer)
language sql
stable
security definer
set search_path = ''
as $$
  select c.code, c.name, c.emoji, c.description, c.slug, c.venue,
         (select count(*)::integer from public.memberships m where m.club_code = c.code)
  from public.clubs c
  where c.slug = lower(trim(p_slug)) and c.kind = 'group';
$$;

-- ---------------------------------------------------------------------------
-- Ajustes (dueño o admins)

-- Pone, cambia o saca (null) el link corto.
create function public.set_club_slug(p_code text, p_slug text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  s text := nullif(lower(trim(coalesce(p_slug, ''))), '');
begin
  if not public._is_admin(p_code, me) then
    raise exception 'Sólo el dueño o un admin pueden cambiar el link del club';
  end if;
  if (select kind from public.clubs where code = p_code) <> 'group' then
    raise exception 'Este club no puede tener link corto';
  end if;
  if s is not null and (char_length(s) not between 3 and 30 or s !~ '^[a-z0-9]+(-[a-z0-9]+)*$') then
    raise exception 'El link lleva de 3 a 30 letras sin acentos, números o guiones';
  end if;
  if s in ('admin', 'api', 'app', 'club', 'clubes', 'grupo', 'grupos', 'juegos', 'ranking', 'unirse', 'ayuda', 'gameboard', 'game-board') then
    raise exception 'Ese link está reservado. Probá con otro';
  end if;
  if s is not null and exists (select 1 from public.clubs c where c.slug = s and c.code <> p_code) then
    raise exception 'Ese link ya lo usa otro club';
  end if;
  update public.clubs set slug = s where code = p_code;
  return s;
end;
$$;

-- Hace del club un club de lugar (o deja de serlo, con null).
create function public.set_club_venue(p_code text, p_venue jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  games jsonb := coalesce(p_venue -> 'games', '[]'::jsonb);
begin
  if not public._is_admin(p_code, me) then
    raise exception 'Sólo el dueño o un admin pueden cambiar el club';
  end if;
  if (select kind from public.clubs where code = p_code) <> 'group' then
    raise exception 'Este club no puede ser de un lugar';
  end if;
  if p_venue is not null and (jsonb_typeof(p_venue) <> 'object' or jsonb_typeof(games) <> 'array' or jsonb_array_length(games) > 40) then
    raise exception 'Datos del lugar inválidos';
  end if;
  update public.clubs
    set venue = case when p_venue is null then null else jsonb_build_object(
          'address', nullif(left(trim(coalesce(p_venue ->> 'address', '')), 120), ''),
          'games', (select coalesce(jsonb_agg(distinct left(g, 64)), '[]'::jsonb) from jsonb_array_elements_text(games) g)) end
  where code = p_code;
end;
$$;

-- ---------------------------------------------------------------------------
-- Mis grupos: suma el link corto y los datos del lugar.

drop function public.my_groups();
create function public.my_groups()
returns table (
  code text, id uuid, name text, kind text, emoji text, description text, is_public boolean,
  role text, player_id text, joined_at timestamptz, members integer, pending_requests integer,
  slug text, venue jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.code, c.id, c.name, c.kind, c.emoji, c.description, c.is_public,
         m.role, m.player_id, m.joined_at,
         (select count(*)::integer from public.memberships x where x.club_code = c.code),
         case when m.role in ('owner', 'admin')
           then (select count(*)::integer from public.join_requests r where r.club_code = c.code and r.status = 'pending')
           else 0 end,
         c.slug, c.venue
  from public.memberships m
  join public.clubs c on c.code = m.club_code
  where m.user_id = (select auth.uid())
  order by c.kind, m.joined_at;
$$;

-- ---------------------------------------------------------------------------
-- En un club de lugar, sólo los integrantes suben cambios.

create function public._venue_write_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  claims_role text := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '');
begin
  -- Sólo se controla lo que llega desde la app (anon o authenticated); el service role y las tareas internas pasan.
  if claims_role not in ('anon', 'authenticated') then
    return new;
  end if;
  if exists (select 1 from public.clubs c where c.code = new.club_code and c.venue is not null)
     and not exists (select 1 from public.memberships m where m.club_code = new.club_code and m.user_id = (select auth.uid())) then
    raise exception 'En este club se anota con cuenta: entrá y sumate al club';
  end if;
  return new;
end;
$$;

create trigger entities_venue_guard
  before insert or update on public.entities
  for each row execute function public._venue_write_guard();

-- ---------------------------------------------------------------------------
-- Permisos

revoke all on function public.club_card(text) from public;
revoke all on function public.club_by_slug(text) from public;
revoke all on function public.set_club_slug(text, text) from public, anon;
revoke all on function public.set_club_venue(text, jsonb) from public, anon;
revoke all on function public.my_groups() from public, anon;
revoke all on function public._venue_write_guard() from public, anon, authenticated;
grant execute on function public.club_card(text) to anon, authenticated;
grant execute on function public.club_by_slug(text) to anon, authenticated;
grant execute on function public.set_club_slug(text, text) to authenticated;
grant execute on function public.set_club_venue(text, jsonb) to authenticated;
grant execute on function public.my_groups() to authenticated;
