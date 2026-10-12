-- Grupos, amigos, solicitudes, notificaciones y ranking global.
--
-- - Los "grupos" de Game Board son los mismos clubes de antes (y del Ping Pong Club):
--   se les agrega dueño, descripción, emoji y si aparecen en el buscador. El código
--   sigue siendo secreto: el buscador nunca lo devuelve. Para entrar a un grupo
--   público se pide permiso y el dueño (o un admin) acepta; al aceptar, el grupo
--   aparece en `my_groups` (con su código) para el que pidió.
-- - Una cuenta puede estar en varios grupos (`memberships`), con un rol en cada uno.
-- - Amigos: solicitud y aceptación. Para jugar un mano a mano con un amigo se crea
--   (una sola vez) un grupo de dos, de tipo `duo`, con un jugador para cada uno.
-- - Notificaciones: las escriben sólo las funciones de abajo; cada usuario lee las suyas.
-- - Ranking global: suma las partidas de todos los grupos de los jugadores que tienen cuenta.

-- ---------------------------------------------------------------------------
-- Grupos

alter table public.clubs
  add column id uuid not null default gen_random_uuid(),
  add column kind text not null default 'group' check (kind in ('group', 'duo')),
  add column owner_id uuid references auth.users (id) on delete set null,
  add column description text check (char_length(description) <= 200),
  add column emoji text check (char_length(emoji) <= 16),
  add column color text check (char_length(color) <= 16),
  add column is_public boolean not null default false;

create unique index clubs_id_idx on public.clubs (id);
create index clubs_public_idx on public.clubs (is_public) where is_public;

alter table public.memberships
  add column role text not null default 'member' check (role in ('owner', 'admin', 'member'));

-- ---------------------------------------------------------------------------
-- Perfiles: nombre de usuario (para buscar) y visibles para cualquiera con sesión.

alter table public.profiles
  add column username text check (username ~ '^[a-z0-9_.]{3,20}$');

create unique index profiles_username_idx on public.profiles (username);

-- (Se modifica la política existente en lugar de reemplazarla.)
alter policy "perfil propio: ver" on public.profiles using (true);
alter policy "perfil propio: ver" on public.profiles rename to "perfiles: ver";

-- ---------------------------------------------------------------------------
-- Amigos, solicitudes, invitaciones y notificaciones

create table public.friendships (
  user_low uuid not null references auth.users (id) on delete cascade,
  user_high uuid not null references auth.users (id) on delete cascade,
  requested_by uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  duo_code text references public.clubs (code) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  primary key (user_low, user_high),
  check (user_low < user_high)
);

create index friendships_high_idx on public.friendships (user_high);

create table public.join_requests (
  id bigint generated always as identity primary key,
  club_code text not null references public.clubs (code) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  message text check (char_length(message) <= 200),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users (id) on delete set null
);

create unique index join_requests_pending_idx on public.join_requests (club_code, user_id) where status = 'pending';

create table public.group_invites (
  id bigint generated always as identity primary key,
  club_code text not null references public.clubs (code) on delete cascade,
  invited_user uuid not null references auth.users (id) on delete cascade,
  invited_by uuid references auth.users (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

create unique index group_invites_pending_idx on public.group_invites (club_code, invited_user) where status = 'pending';

create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.friendships enable row level security;
alter table public.join_requests enable row level security;
alter table public.group_invites enable row level security;
alter table public.notifications enable row level security;

create policy "notificaciones propias: ver" on public.notifications
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "notificaciones propias: marcar" on public.notifications
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notificaciones propias: borrar" on public.notifications
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, update, delete on public.notifications to authenticated;
grant select on public.profiles to authenticated;

-- Avisos en tiempo real (si el proyecto tiene la publicación de Realtime).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Funciones internas (sin permisos para clientes)

create function public._uid()
returns uuid
language plpgsql
stable
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Hay que iniciar sesión';
  end if;
  return (select auth.uid());
end;
$$;

create function public._new_club_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'abcdefghjkmnpqrstuvwxyz23456789';
  bytes bytea;
  new_code text;
begin
  loop
    bytes := extensions.gen_random_bytes(12);
    new_code := '';
    for i in 0..11 loop
      new_code := new_code || substr(alphabet, (get_byte(bytes, i) % char_length(alphabet)) + 1, 1);
    end loop;
    exit when not exists (select 1 from public.clubs c where c.code = new_code);
  end loop;
  return new_code;
end;
$$;

create function public._now_ms()
returns bigint
language sql
volatile
set search_path = ''
as $$
  select (extract(epoch from clock_timestamp()) * 1000)::bigint;
$$;

create function public._notify(p_user uuid, p_kind text, p_data jsonb)
returns void
language sql
volatile
set search_path = ''
as $$
  insert into public.notifications (user_id, kind, data) values (p_user, p_kind, coalesce(p_data, '{}'::jsonb));
$$;

-- Datos públicos de un usuario, para adjuntar a las notificaciones.
create function public._who(p_user uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'user_id', p_user,
    'username', p.username,
    'display_name', coalesce(p.display_name, p.username, 'Alguien'),
    'emoji', coalesce(p.emoji, '🙂'),
    'color', coalesce(p.color, '#3b82f6'))
  from (select 1) x
  left join public.profiles p on p.user_id = p_user;
$$;

create function public._group_info(p_code text)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object('group_id', c.id, 'name', c.name, 'emoji', coalesce(c.emoji, '🎲'))
  from public.clubs c where c.code = p_code;
$$;

create function public._role(p_code text, p_user uuid)
returns text
language sql
stable
set search_path = ''
as $$
  select m.role from public.memberships m where m.club_code = p_code and m.user_id = p_user;
$$;

create function public._is_admin(p_code text, p_user uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(public._role(p_code, p_user) in ('owner', 'admin'), false);
$$;

-- Agrega al usuario al grupo (si no estaba).
create function public._add_member(p_code text, p_user uuid, p_role text default 'member')
returns void
language sql
volatile
set search_path = ''
as $$
  insert into public.memberships (user_id, club_code, role)
  values (p_user, p_code, p_role)
  on conflict (user_id, club_code) do nothing;
$$;

-- Crea (si hace falta) el jugador del usuario en el grupo, con los datos de su perfil,
-- y lo marca como suyo. Devuelve el id del jugador.
create function public._ensure_player(p_code text, p_user uuid)
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  pid text;
  prof public.profiles;
  now_ms bigint := public._now_ms();
begin
  select m.player_id into pid from public.memberships m where m.club_code = p_code and m.user_id = p_user;
  if not found then
    raise exception 'No sos parte de ese grupo';
  end if;
  if pid is not null then
    return pid;
  end if;
  select * into prof from public.profiles p where p.user_id = p_user;
  pid := 'u' || left(md5(p_user::text || ':' || p_code), 11);
  insert into public.entities as e (club_code, kind, id, data, deleted, v, updated_at)
  values (
    p_code, 'player', pid,
    jsonb_build_object(
      'id', pid,
      'name', coalesce(prof.display_name, prof.username, 'Yo'),
      'emoji', coalesce(prof.emoji, '🙂'),
      'color', coalesce(prof.color, '#3b82f6'),
      'createdAt', now_ms),
    false, now_ms, clock_timestamp())
  on conflict (club_code, kind, id) do update
    set deleted = false,
        data = excluded.data,
        v = greatest(e.v + 1, excluded.v),
        updated_at = clock_timestamp()
    where e.deleted;
  update public.memberships set player_id = pid where club_code = p_code and user_id = p_user;
  return pid;
end;
$$;

-- Borra los avisos de una solicitud ya respondida. `p_key` es la ruta dentro de `data` ("request_id", "from.user_id").
-- (Los borrados usan `delete ... using` en toda la migración.)
create function public._clear_notifications(p_user uuid, p_kind text, p_key text, p_value text)
returns void
language sql
volatile
set search_path = ''
as $$
  delete from public.notifications n
  using (select 1) x
  where (p_user is null or n.user_id = p_user) and n.kind = p_kind and n.data #>> string_to_array(p_key, '.') = p_value;
$$;

-- Borrados que usan las funciones de abajo (en SQL, separados de la lógica en plpgsql).
create function public._drop_join_request(p_code text, p_user uuid)
returns void
language sql
volatile
set search_path = ''
as $$
  delete from public.join_requests r using (select 1) x where r.club_code = p_code and r.user_id = p_user and r.status = 'pending';
$$;

create function public._drop_member(p_code text, p_user uuid)
returns void
language sql
volatile
set search_path = ''
as $$
  delete from public.memberships m using (select 1) x where m.club_code = p_code and m.user_id = p_user;
$$;

create function public._drop_friendship(p_a uuid, p_b uuid)
returns void
language sql
volatile
set search_path = ''
as $$
  delete from public.friendships f using (select 1) x where f.user_low = least(p_a, p_b) and f.user_high = greatest(p_a, p_b);
$$;

revoke all on function public._clear_notifications(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public._drop_join_request(text, uuid) from public, anon, authenticated;
revoke all on function public._drop_member(text, uuid) from public, anon, authenticated;
revoke all on function public._drop_friendship(uuid, uuid) from public, anon, authenticated;
revoke all on function public._uid() from public, anon, authenticated;
revoke all on function public._new_club_code() from public, anon, authenticated;
revoke all on function public._now_ms() from public, anon, authenticated;
revoke all on function public._notify(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public._who(uuid) from public, anon, authenticated;
revoke all on function public._group_info(text) from public, anon, authenticated;
revoke all on function public._role(text, uuid) from public, anon, authenticated;
revoke all on function public._is_admin(text, uuid) from public, anon, authenticated;
revoke all on function public._add_member(text, uuid, text) from public, anon, authenticated;
revoke all on function public._ensure_player(text, uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Perfil

-- Guarda el perfil y actualiza el nombre/emoji/color de tus jugadores en todos tus grupos.
create function public.save_profile(p_username text, p_display_name text, p_emoji text, p_color text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  uname text := lower(trim(p_username));
begin
  if uname !~ '^[a-z0-9_.]{3,20}$' then
    raise exception 'El usuario tiene que tener de 3 a 20 letras, números, puntos o guiones bajos';
  end if;
  if exists (select 1 from public.profiles p where p.username = uname and p.user_id <> me) then
    raise exception 'Ese nombre de usuario ya está usado';
  end if;
  if char_length(trim(coalesce(p_display_name, ''))) = 0 then
    raise exception 'Falta tu nombre';
  end if;
  insert into public.profiles (user_id, username, display_name, emoji, color, updated_at)
  values (me, uname, left(trim(p_display_name), 40), left(p_emoji, 16), left(p_color, 16), now())
  on conflict (user_id) do update
    set username = excluded.username,
        display_name = excluded.display_name,
        emoji = excluded.emoji,
        color = excluded.color,
        updated_at = now();

  update public.entities e
    set data = e.data || jsonb_build_object('name', left(trim(p_display_name), 40), 'emoji', left(p_emoji, 16), 'color', left(p_color, 16)),
        v = greatest(e.v + 1, public._now_ms()),
        updated_at = clock_timestamp()
  from public.memberships m
  where m.user_id = me and m.player_id is not null
    and e.club_code = m.club_code and e.kind = 'player' and e.id = m.player_id and not e.deleted;
end;
$$;

-- Busca usuarios por nombre o usuario (para sumar amigos o invitar a un grupo).
create function public.search_users(p_query text)
returns table (user_id uuid, username text, display_name text, emoji text, color text, friend_status text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  q text := lower(trim(coalesce(p_query, '')));
begin
  if char_length(q) < 2 then
    return;
  end if;
  return query
    select p.user_id, p.username, p.display_name, p.emoji, p.color,
           case
             when f.status = 'accepted' then 'friend'
             when f.status = 'pending' and f.requested_by = me then 'outgoing'
             when f.status = 'pending' then 'incoming'
             else null
           end
    from public.profiles p
    left join public.friendships f
      on f.user_low = least(me, p.user_id) and f.user_high = greatest(me, p.user_id)
    where p.user_id <> me
      and p.username is not null
      and (p.username like '%' || q || '%' or lower(p.display_name) like '%' || q || '%')
    order by (p.username = q) desc, p.username
    limit 20;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grupos

-- `p_with_player`: crear tu jugador con los datos del perfil (no hace falta si traés los datos de tu dispositivo y ya estás ahí).
create function public.create_group(p_name text, p_description text default null, p_emoji text default null, p_public boolean default false, p_with_player boolean default true)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  new_code text;
begin
  if p_name is null or char_length(trim(p_name)) = 0 then
    raise exception 'Nombre inválido';
  end if;
  new_code := public._new_club_code();
  insert into public.clubs (code, name, kind, owner_id, description, emoji, is_public)
  values (new_code, left(trim(p_name), 60), 'group', me, nullif(left(trim(coalesce(p_description, '')), 200), ''), nullif(left(p_emoji, 16), ''), coalesce(p_public, false));
  perform public._add_member(new_code, me, 'owner');
  if coalesce(p_with_player, true) then
    perform public._ensure_player(new_code, me);
  end if;
  return new_code;
end;
$$;

create function public.update_group(p_code text, p_name text, p_description text, p_emoji text, p_public boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
begin
  if not public._is_admin(p_code, me) then
    raise exception 'Sólo el dueño o un admin pueden editar el grupo';
  end if;
  if p_name is null or char_length(trim(p_name)) = 0 then
    raise exception 'Nombre inválido';
  end if;
  update public.clubs
    set name = left(trim(p_name), 60),
        description = nullif(left(trim(coalesce(p_description, '')), 200), ''),
        emoji = nullif(left(p_emoji, 16), ''),
        is_public = coalesce(p_public, false) and kind = 'group'
  where code = p_code;
end;
$$;

-- Guarda un club en la cuenta (hay que conocer su código). Si el club no tenía dueño, lo es quien lo guarda primero.
create or replace function public.link_club(p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  club_name text;
  club_owner uuid;
begin
  select c.name, c.owner_id into club_name, club_owner from public.clubs c where c.code = p_code;
  if club_name is null then
    raise exception 'Club inexistente';
  end if;
  if club_owner is null then
    update public.clubs set owner_id = me where code = p_code;
    perform public._add_member(p_code, me, 'owner');
    update public.memberships set role = 'owner' where club_code = p_code and user_id = me;
  else
    perform public._add_member(p_code, me, 'member');
  end if;
  return club_name;
end;
$$;

-- Grupos de la cuenta, con lo necesario para mostrarlos y cambiar entre ellos.
-- (`my_clubs` queda como estaba, por compatibilidad.)
create function public.my_groups()
returns table (
  code text, id uuid, name text, kind text, emoji text, description text, is_public boolean,
  role text, player_id text, joined_at timestamptz, members integer, pending_requests integer
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
           else 0 end
  from public.memberships m
  join public.clubs c on c.code = m.club_code
  where m.user_id = (select auth.uid())
  order by c.kind, m.joined_at;
$$;

-- Busca grupos públicos (sin devolver el código).
create function public.search_groups(p_query text default '')
returns table (id uuid, name text, emoji text, description text, members integer, my_status text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  q text := lower(trim(coalesce(p_query, '')));
begin
  return query
    select c.id, c.name, c.emoji, c.description,
           (select count(*)::integer from public.memberships x where x.club_code = c.code) as members,
           case
             when exists (select 1 from public.memberships m where m.club_code = c.code and m.user_id = me) then 'member'
             when exists (select 1 from public.join_requests r where r.club_code = c.code and r.user_id = me and r.status = 'pending') then 'pending'
             else null
           end
    from public.clubs c
    where c.is_public and c.kind = 'group'
      and (q = '' or lower(c.name) like '%' || q || '%' or lower(coalesce(c.description, '')) like '%' || q || '%')
    order by members desc, c.name
    limit 30;
end;
$$;

-- Pide entrar a un grupo público. Les llega un aviso al dueño y a los admins.
create function public.request_join(p_group_id uuid, p_message text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  g public.clubs;
  req_id bigint;
begin
  select * into g from public.clubs c where c.id = p_group_id and c.is_public and c.kind = 'group';
  if not found then
    raise exception 'Ese grupo no existe o no recibe solicitudes';
  end if;
  if exists (select 1 from public.memberships m where m.club_code = g.code and m.user_id = me) then
    raise exception 'Ya sos parte de este grupo';
  end if;
  if exists (select 1 from public.join_requests r where r.club_code = g.code and r.user_id = me and r.status = 'pending') then
    return;
  end if;
  insert into public.join_requests (club_code, user_id, message)
  values (g.code, me, nullif(left(trim(coalesce(p_message, '')), 200), ''))
  returning id into req_id;
  perform public._notify(m.user_id, 'join_request',
    public._group_info(g.code) || jsonb_build_object('request_id', req_id, 'from', public._who(me), 'message', p_message))
  from public.memberships m
  where m.club_code = g.code and m.role in ('owner', 'admin');
end;
$$;

create function public.cancel_join_request(p_group_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.join_requests r
  using public.clubs c
  where c.id = p_group_id and r.club_code = c.code and r.user_id = (select auth.uid()) and r.status = 'pending';
$$;

-- Solicitudes pendientes de un grupo (para el dueño y los admins).
create function public.group_requests(p_code text)
returns table (request_id bigint, user_id uuid, username text, display_name text, emoji text, color text, message text, created_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public._is_admin(p_code, public._uid()) then
    return;
  end if;
  return query
    select r.id, r.user_id, p.username, p.display_name, p.emoji, p.color, r.message, r.created_at
    from public.join_requests r
    left join public.profiles p on p.user_id = r.user_id
    where r.club_code = p_code and r.status = 'pending'
    order by r.created_at;
end;
$$;

create function public.decide_join_request(p_request_id bigint, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  r public.join_requests;
begin
  select * into r from public.join_requests x where x.id = p_request_id;
  if not found or r.status <> 'pending' then
    raise exception 'La solicitud ya no está pendiente';
  end if;
  if not public._is_admin(r.club_code, me) then
    raise exception 'Sólo el dueño o un admin pueden responder';
  end if;
  update public.join_requests
    set status = case when p_accept then 'accepted' else 'rejected' end, decided_at = now(), decided_by = me
  where id = r.id;
  if p_accept then
    perform public._add_member(r.club_code, r.user_id, 'member');
    perform public._notify(r.user_id, 'join_accepted', public._group_info(r.club_code) || jsonb_build_object('by', public._who(me)));
  else
    perform public._notify(r.user_id, 'join_rejected', public._group_info(r.club_code));
  end if;
  -- Los avisos de esa solicitud ya no hacen falta (para ningún admin).
  perform public._clear_notifications(null, 'join_request', 'request_id', r.id::text);
end;
$$;

-- Invita a un usuario a un grupo (cualquier miembro puede invitar).
create function public.invite_to_group(p_code text, p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  inv_id bigint;
begin
  if public._role(p_code, me) is null then
    raise exception 'No sos parte de ese grupo';
  end if;
  if (select kind from public.clubs where code = p_code) <> 'group' then
    raise exception 'A un mano a mano no se puede invitar';
  end if;
  if exists (select 1 from public.memberships m where m.club_code = p_code and m.user_id = p_user) then
    raise exception 'Ya es parte del grupo';
  end if;
  if exists (select 1 from public.group_invites i where i.club_code = p_code and i.invited_user = p_user and i.status = 'pending') then
    return;
  end if;
  insert into public.group_invites (club_code, invited_user, invited_by) values (p_code, p_user, me)
  returning id into inv_id;
  perform public._notify(p_user, 'group_invite', public._group_info(p_code) || jsonb_build_object('invite_id', inv_id, 'from', public._who(me)));
end;
$$;

create function public.respond_group_invite(p_invite_id bigint, p_accept boolean)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  i public.group_invites;
begin
  select * into i from public.group_invites x where x.id = p_invite_id and x.invited_user = me;
  if not found or i.status <> 'pending' then
    raise exception 'La invitación ya no está pendiente';
  end if;
  update public.group_invites set status = case when p_accept then 'accepted' else 'declined' end where id = i.id;
  perform public._clear_notifications(me, 'group_invite', 'invite_id', i.id::text);
  if not p_accept then
    return null;
  end if;
  perform public._add_member(i.club_code, me, 'member');
  -- Si había pedido entrar, la solicitud ya no hace falta.
  perform public._drop_join_request(i.club_code, me);
  if i.invited_by is not null then
    perform public._notify(i.invited_by, 'invite_accepted', public._group_info(i.club_code) || jsonb_build_object('from', public._who(me)));
  end if;
  return i.club_code;
end;
$$;

-- Integrantes con cuenta de un grupo (hay que ser parte).
create function public.group_members(p_code text)
returns table (user_id uuid, username text, display_name text, emoji text, color text, role text, player_id text, joined_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if public._role(p_code, public._uid()) is null then
    raise exception 'No sos parte de ese grupo';
  end if;
  return query
    select m.user_id, p.username, p.display_name, p.emoji, p.color, m.role, m.player_id, m.joined_at
    from public.memberships m
    left join public.profiles p on p.user_id = m.user_id
    where m.club_code = p_code
    order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, m.joined_at;
end;
$$;

create function public.set_member_role(p_code text, p_user uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
begin
  if public._role(p_code, me) <> 'owner' then
    raise exception 'Sólo el dueño puede cambiar roles';
  end if;
  if p_role not in ('admin', 'member') or p_user = me then
    raise exception 'Cambio inválido';
  end if;
  update public.memberships set role = p_role where club_code = p_code and user_id = p_user;
end;
$$;

create function public.remove_member(p_code text, p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
begin
  if not public._is_admin(p_code, me) or p_user = me then
    raise exception 'No podés sacar a esa persona';
  end if;
  if public._role(p_code, p_user) = 'owner' then
    raise exception 'Al dueño no se lo puede sacar';
  end if;
  perform public._drop_member(p_code, p_user);
  perform public._notify(p_user, 'removed', public._group_info(p_code));
end;
$$;

-- Salir de un grupo. Si sale el dueño, el grupo pasa al admin (o integrante) más antiguo.
create function public.leave_group(p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  was_owner boolean := public._role(p_code, me) = 'owner';
  heir uuid;
begin
  perform public._drop_member(p_code, me);
  if was_owner then
    select m.user_id into heir from public.memberships m
    where m.club_code = p_code
    order by (m.role = 'admin') desc, m.joined_at
    limit 1;
    update public.clubs set owner_id = heir where code = p_code;
    if heir is not null then
      update public.memberships set role = 'owner' where club_code = p_code and user_id = heir;
    end if;
  end if;
end;
$$;

-- Crea tu jugador en el grupo (con los datos de tu perfil) si todavía no tenés uno.
create function public.ensure_my_player(p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  return public._ensure_player(p_code, public._uid());
end;
$$;

-- ---------------------------------------------------------------------------
-- Amigos

create function public.send_friend_request(p_user uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  f public.friendships;
begin
  if p_user = me then
    raise exception 'No podés ser tu propio amigo (en la app)';
  end if;
  if not exists (select 1 from public.profiles p where p.user_id = p_user) then
    raise exception 'Usuario inexistente';
  end if;
  select * into f from public.friendships x where x.user_low = least(me, p_user) and x.user_high = greatest(me, p_user);
  if found then
    if f.status = 'accepted' then
      return 'friend';
    end if;
    if f.requested_by = me then
      return 'outgoing';
    end if;
    -- El otro ya me había pedido: aceptamos.
    update public.friendships set status = 'accepted', accepted_at = now()
    where user_low = f.user_low and user_high = f.user_high;
    perform public._clear_notifications(me, 'friend_request', 'from.user_id', p_user::text);
    perform public._notify(p_user, 'friend_accepted', jsonb_build_object('from', public._who(me)));
    return 'friend';
  end if;
  insert into public.friendships (user_low, user_high, requested_by) values (least(me, p_user), greatest(me, p_user), me);
  perform public._notify(p_user, 'friend_request', jsonb_build_object('from', public._who(me)));
  return 'outgoing';
end;
$$;

create function public.respond_friend_request(p_user uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
begin
  if not exists (
    select 1 from public.friendships x
    where x.user_low = least(me, p_user) and x.user_high = greatest(me, p_user) and x.status = 'pending' and x.requested_by = p_user
  ) then
    raise exception 'La solicitud ya no está pendiente';
  end if;
  if p_accept then
    update public.friendships set status = 'accepted', accepted_at = now()
    where user_low = least(me, p_user) and user_high = greatest(me, p_user);
    perform public._notify(p_user, 'friend_accepted', jsonb_build_object('from', public._who(me)));
  else
    perform public._drop_friendship(me, p_user);
  end if;
  perform public._clear_notifications(me, 'friend_request', 'from.user_id', p_user::text);
end;
$$;

-- Deja de ser amigo (o cancela la solicitud). El mano a mano queda guardado.
create function public.remove_friend(p_user uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.friendships f
  using (select 1) x
  where f.user_low = least((select auth.uid()), p_user) and f.user_high = greatest((select auth.uid()), p_user);
$$;

create function public.my_friends()
returns table (user_id uuid, username text, display_name text, emoji text, color text, status text, duo_code text, since timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select o.other, p.username, p.display_name, p.emoji, p.color,
         case when f.status = 'accepted' then 'friend' when f.requested_by = (select auth.uid()) then 'outgoing' else 'incoming' end,
         case when f.status = 'accepted' then f.duo_code end,
         coalesce(f.accepted_at, f.created_at)
  from public.friendships f
  cross join lateral (select case when f.user_low = (select auth.uid()) then f.user_high else f.user_low end as other) o
  left join public.profiles p on p.user_id = o.other
  where (select auth.uid()) in (f.user_low, f.user_high)
  order by f.status, p.display_name;
$$;

-- Grupo de dos para jugar mano a mano con un amigo. Se crea una sola vez.
create function public.ensure_duo(p_friend uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  f public.friendships;
  new_code text;
  my_name text;
  their_name text;
begin
  select * into f from public.friendships x
  where x.user_low = least(me, p_friend) and x.user_high = greatest(me, p_friend) and x.status = 'accepted'
  for update;
  if not found then
    raise exception 'Primero tienen que ser amigos';
  end if;
  if f.duo_code is not null and exists (select 1 from public.clubs c where c.code = f.duo_code) then
    perform public._add_member(f.duo_code, me, 'owner');
    perform public._ensure_player(f.duo_code, me);
    return f.duo_code;
  end if;
  select coalesce(display_name, username, 'Yo') into my_name from public.profiles where user_id = me;
  select coalesce(display_name, username, 'Amigo') into their_name from public.profiles where user_id = p_friend;
  new_code := public._new_club_code();
  insert into public.clubs (code, name, kind, owner_id, emoji)
  values (new_code, left(my_name || ' vs ' || their_name, 60), 'duo', me, '⚔️');
  perform public._add_member(new_code, me, 'owner');
  perform public._add_member(new_code, p_friend, 'owner');
  perform public._ensure_player(new_code, me);
  perform public._ensure_player(new_code, p_friend);
  update public.friendships set duo_code = new_code where user_low = f.user_low and user_high = f.user_high;
  return new_code;
end;
$$;

-- ---------------------------------------------------------------------------
-- Ranking global
--
-- Suma las partidas terminadas de todos los grupos, contando sólo a los jugadores
-- que tienen cuenta (los "este jugador soy yo"). Los puntos de gloria usan la misma
-- fórmula que la app; el peso de los juegos de fábrica lo manda la app en `p_weights`
-- ({"catan": 3, ...}); los juegos agregados por un grupo usan el suyo; si no, 2.

create function public.global_ranking(p_since timestamptz default null, p_game text default null, p_weights jsonb default '{}'::jsonb)
returns table (
  user_id uuid, username text, display_name text, emoji text, color text,
  played integer, wins integer, gloria integer, games_won integer, groups integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with since as (
    select case when p_since is null then 0::bigint else (extract(epoch from p_since) * 1000)::bigint end as ms
  ),
  -- Partidas de cualquier juego: un renglón por lado.
  play_sides as (
    select e.club_code, e.id as play_id, e.data ->> 'gameId' as game_id,
           (s.ord - 1)::int as side_idx, s.side -> 'players' as players,
           e.data -> 'result' -> 'places' as places,
           (e.data -> 'result' ->> 'coopWin')::boolean as coop_win
    from public.entities e
    cross join lateral jsonb_array_elements(e.data -> 'sides') with ordinality as s(side, ord)
    where e.kind = 'play' and not e.deleted
      and e.data ->> 'status' = 'finished'
      and jsonb_typeof(e.data -> 'result' -> 'places') = 'array'
      and coalesce((e.data ->> 'finishedAt')::bigint, (e.data ->> 'createdAt')::bigint, 0) >= (select ms from since)
      and (p_game is null or e.data ->> 'gameId' = p_game)
  ),
  -- Partidos de ping pong (formato del Ping Pong Club).
  match_sides as (
    select e.club_code, e.id as play_id, 'pingpong'::text as game_id, x.side_idx,
           x.players,
           case
             when e.data ->> 'winner' is null then '[1,1]'::jsonb
             when e.data ->> 'winner' = e.data ->> 'playerA' then '[1,2]'::jsonb
             else '[2,1]'::jsonb
           end as places,
           null::boolean as coop_win
    from public.entities e
    cross join lateral (values
      (0, jsonb_strip_nulls(jsonb_build_array(e.data -> 'playerA', e.data -> 'partnerA'))),
      (1, jsonb_strip_nulls(jsonb_build_array(e.data -> 'playerB', e.data -> 'partnerB')))
    ) as x(side_idx, players)
    where e.kind = 'match' and not e.deleted
      and e.data ->> 'status' = 'finished'
      and coalesce((e.data ->> 'finishedAt')::bigint, (e.data ->> 'createdAt')::bigint, 0) >= (select ms from since)
      and (p_game is null or p_game = 'pingpong')
  ),
  sides as (
    select * from play_sides
    union all
    select * from match_sides
  ),
  scored as (
    select s.*,
           jsonb_array_length(s.places) as n,
           (s.places ->> s.side_idx)::int as place,
           (select count(*) from jsonb_array_elements_text(s.places) q where q::int > (s.places ->> s.side_idx)::int) as behind,
           (select count(*) from jsonb_array_elements_text(s.places) q where q::int = 1) as firsts,
           coalesce(
             (p_weights ->> s.game_id)::numeric,
             (select (g.data ->> 'weight')::numeric from public.entities g
               where g.club_code = s.club_code and g.kind = 'game' and g.id = s.game_id and not g.deleted),
             2) as weight
    from sides s
  ),
  results as (
    select sc.*,
           case
             when sc.coop_win is not null then sc.coop_win and sc.place = 1
             else sc.place = 1 and not (sc.firsts = sc.n and sc.n > 1)
           end as won,
           case
             when sc.coop_win is not null then case when sc.coop_win then 3 * sc.weight + 1 else 1 end
             when sc.n < 2 then 1
             else round(5 * sc.weight * (1 + (sc.n - 2) * 0.5) * (sc.behind::numeric / (sc.n - 1))) + 1
           end as pts
    from scored sc
  ),
  per_user as (
    select m.user_id, r.club_code, r.play_id, r.game_id, r.won, r.pts
    from results r
    cross join lateral jsonb_array_elements_text(r.players) as pl(player_id)
    join public.memberships m on m.club_code = r.club_code and m.player_id = pl.player_id
  )
  select u.user_id, p.username, p.display_name, p.emoji, p.color,
         count(*)::integer as played,
         count(*) filter (where u.won)::integer as wins,
         sum(u.pts)::integer as gloria,
         count(distinct u.game_id) filter (where u.won)::integer as games_won,
         count(distinct u.club_code)::integer as groups
  from per_user u
  left join public.profiles p on p.user_id = u.user_id
  group by u.user_id, p.username, p.display_name, p.emoji, p.color
  order by gloria desc, wins desc
  limit 100;
$$;

-- ---------------------------------------------------------------------------
-- Permisos: todo esto es sólo para usuarios con sesión.

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.save_profile(text, text, text, text)',
    'public.search_users(text)',
    'public.create_group(text, text, text, boolean, boolean)',
    'public.update_group(text, text, text, text, boolean)',
    'public.link_club(text)',
    'public.my_groups()',
    'public.search_groups(text)',
    'public.request_join(uuid, text)',
    'public.cancel_join_request(uuid)',
    'public.group_requests(text)',
    'public.decide_join_request(bigint, boolean)',
    'public.invite_to_group(text, uuid)',
    'public.respond_group_invite(bigint, boolean)',
    'public.group_members(text)',
    'public.set_member_role(text, uuid, text)',
    'public.remove_member(text, uuid)',
    'public.leave_group(text)',
    'public.ensure_my_player(text)',
    'public.send_friend_request(uuid)',
    'public.respond_friend_request(uuid, boolean)',
    'public.remove_friend(uuid)',
    'public.my_friends()',
    'public.ensure_duo(uuid)',
    'public.global_ranking(timestamptz, text, jsonb)'
  ] loop
    execute format('revoke all on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated', fn);
  end loop;
end;
$$;
