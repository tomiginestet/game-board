-- Panel de administración (sólo para las cuentas de `app_admins`, con sesión de Google).
--
-- - Acceso: `is_app_admin()` exige que la cuenta esté en `app_admins` y que su sesión sea de
--   Google. Todas las funciones `admin_*` lo verifican antes de leer o tocar algo; esconder la
--   pantalla no alcanza.
-- - Borrar con "deshacer" por 30 días (`admin_trash`):
--   * juegos, partidas, jugadores y torneos: se marcan borrados (`deleted`, con una versión nueva)
--     igual que cuando se borran desde la app, así el borrado llega a todos los dispositivos. Un
--     DELETE común no sirve: el próximo celular que sincronice volvería a subirlos;
--   * clubes: se guarda una copia completa (club, datos, integrantes) y se borra el club. Los
--     dispositivos ven "Club inexistente" hasta que se recupera (con el mismo código);
--   * cuentas: se bloquea la cuenta, se cierran sus sesiones y se saca su perfil, sus clubes y
--     amistades. Sus jugadores quedan en los clubes como jugadores sin cuenta. A los 30 días se
--     borra la cuenta de verdad. Si era dueña de un club, el club pasa al admin (o integrante) más antiguo.
--   Lo vencido se borra solo cada vez que se abre el panel (`admin_overview`).
-- - Todo lo que se hace desde el panel queda en `admin_log`.
-- - `entities.created_by` / `updated_by`: quién subió cada cosa (null = sin cuenta o anterior a esto).
-- - Actividad (`user_activity`): un renglón por cuenta y día en que abrió la app, para personas activas.
-- - Reportes (`reports`): cualquiera con sesión puede reportar un usuario, un club o un juego.
-- - Interruptores (`app_settings`): IA encendida/apagada, topes, y un anuncio para todos.
--   La función `generate-game` los respeta, junto con el bloqueo de IA por persona (`user_flags`).
-- - La base es la misma del Ping Pong Club: lo que se borra acá también se borra allá.

-- ---------------------------------------------------------------------------
-- Tablas

create table public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

create table public.admin_trash (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('entity', 'club', 'member', 'user')),
  label text not null,
  ref jsonb not null,
  snapshot jsonb,
  reason text check (char_length(reason) <= 300),
  deleted_at timestamptz not null default now(),
  deleted_by uuid references auth.users (id) on delete set null,
  purge_after timestamptz not null default now() + interval '30 days',
  restored_at timestamptz,
  purged_at timestamptz
);

create index admin_trash_pending_idx on public.admin_trash (purge_after) where restored_at is null and purged_at is null;

create table public.admin_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  admin_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_kind text,
  target_id text,
  label text,
  details jsonb not null default '{}'::jsonb,
  trash_id bigint references public.admin_trash (id) on delete set null
);

create index admin_log_at_idx on public.admin_log (at desc);
create index admin_log_target_idx on public.admin_log (target_kind, target_id);

create table public.user_activity (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

create index user_activity_day_idx on public.user_activity (day);

create table public.reports (
  id bigint generated always as identity primary key,
  reporter uuid references auth.users (id) on delete set null,
  target_kind text not null check (target_kind in ('user', 'group', 'game')),
  target jsonb not null,
  reason text not null check (char_length(reason) between 1 and 500),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id) on delete set null
);

create index reports_open_idx on public.reports (created_at desc) where status = 'open';

create table public.app_settings (
  key text primary key check (key in ('ai', 'announcement')),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.user_flags (
  user_id uuid primary key references auth.users (id) on delete cascade,
  ai_blocked boolean not null default false,
  updated_at timestamptz not null default now()
);

-- RLS sin políticas: sólo las funciones de abajo (y el service role) las tocan.
alter table public.app_admins enable row level security;
alter table public.admin_trash enable row level security;
alter table public.admin_log enable row level security;
alter table public.user_activity enable row level security;
alter table public.reports enable row level security;
alter table public.app_settings enable row level security;
alter table public.user_flags enable row level security;

insert into public.app_settings (key, value) values
  ('ai', '{"enabled": true}'::jsonb),
  ('announcement', '{"text": null}'::jsonb);

-- El dueño de la app.
insert into public.app_admins (user_id)
select u.id from auth.users u where lower(u.email) = 'tomas.ginestet@gmail.com'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Quién sube cada cosa

alter table public.entities
  add column created_by uuid references auth.users (id) on delete set null,
  add column updated_by uuid references auth.users (id) on delete set null;

create index entities_created_by_idx on public.entities (created_by) where created_by is not null;
create index entities_kind_idx on public.entities (kind, updated_at desc);

-- Igual que antes, más quién sube (las dos apps la usan con la misma firma).
create or replace function public.push_changes(p_code text, p_items jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  applied integer;
  me uuid := (select auth.uid());
begin
  if not exists (select 1 from public.clubs c where c.code = p_code) then
    raise exception 'Club inexistente';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 1000 then
    raise exception 'Lote inválido';
  end if;
  if exists (select 1 from jsonb_array_elements(p_items) it where pg_column_size(it) > 200000) then
    raise exception 'Elemento demasiado grande';
  end if;

  insert into public.entities as e (club_code, kind, id, data, deleted, v, updated_at, created_by, updated_by)
  select p_code,
         it ->> 'kind',
         it ->> 'id',
         case when coalesce((it ->> 'deleted')::boolean, false) then null else it -> 'data' end,
         coalesce((it ->> 'deleted')::boolean, false),
         (it ->> 'v')::bigint,
         clock_timestamp(),
         me,
         me
  from jsonb_array_elements(p_items) it
  on conflict (club_code, kind, id) do update
    set data = excluded.data,
        deleted = excluded.deleted,
        v = excluded.v,
        updated_at = clock_timestamp(),
        updated_by = excluded.updated_by
    where e.v < excluded.v;

  get diagnostics applied = row_count;
  return applied;
end;
$$;

-- ---------------------------------------------------------------------------
-- Para todos: configuración pública, actividad y reportes

-- Lo que la app necesita saber al abrir: si hay un anuncio vigente y si la IA está encendida.
create function public.app_config()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'ai_enabled', coalesce((select (s.value ->> 'enabled')::boolean from public.app_settings s where s.key = 'ai'), true),
    'announcement', (
      select s.value from public.app_settings s
      where s.key = 'announcement'
        and nullif(trim(s.value ->> 'text'), '') is not null
        and (s.value ->> 'until' is null or (s.value ->> 'until')::timestamptz > now())
    ));
$$;

-- Un renglón por cuenta y día (hora de Buenos Aires). La app lo llama al abrir.
create function public.touch_activity()
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  insert into public.user_activity (user_id, day)
  select (select auth.uid()), (now() at time zone 'America/Argentina/Buenos_Aires')::date
  where (select auth.uid()) is not null
  on conflict do nothing;
$$;

create function public.report_content(p_kind text, p_target jsonb, p_reason text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
begin
  if p_kind not in ('user', 'group', 'game') or jsonb_typeof(p_target) <> 'object' or pg_column_size(p_target) > 2000 then
    raise exception 'Reporte inválido';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) = 0 then
    raise exception 'Contanos qué pasa';
  end if;
  if (select count(*) from public.reports r where r.reporter = me and r.created_at > now() - interval '1 day') >= 20 then
    raise exception 'Mandaste muchos reportes hoy. Probá mañana.';
  end if;
  insert into public.reports (reporter, target_kind, target, reason)
  values (me, p_kind, p_target, left(trim(p_reason), 500));
end;
$$;

-- ---------------------------------------------------------------------------
-- Acceso al panel

create function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.app_admins a where a.user_id = (select auth.uid()))
     and coalesce((select auth.jwt()) -> 'app_metadata' -> 'providers' ? 'google', false);
$$;

create function public._assert_app_admin()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_app_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  return (select auth.uid());
end;
$$;

create function public._admin_log(p_action text, p_kind text, p_id text, p_label text, p_details jsonb default '{}'::jsonb, p_trash bigint default null)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  insert into public.admin_log (admin_id, action, target_kind, target_id, label, details, trash_id)
  values ((select auth.uid()), p_action, p_kind, p_id, p_label, coalesce(p_details, '{}'::jsonb), p_trash);
$$;

-- Nombre para mostrar de una cuenta (en el panel).
create function public._admin_user_label(p_user uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select coalesce(p.display_name, p.username) || coalesce(' (@' || p.username || ')', '') from public.profiles p where p.user_id = p_user),
    (select u.email::text from auth.users u where u.id = p_user),
    p_user::text);
$$;

-- Si el club se queda sin dueño, pasa al admin (o integrante) más antiguo.
create function public._admin_heir(p_code text)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  heir uuid;
begin
  if exists (select 1 from public.memberships m where m.club_code = p_code and m.role = 'owner') then
    select m.user_id into heir from public.memberships m where m.club_code = p_code and m.role = 'owner' order by m.joined_at limit 1;
  else
    select m.user_id into heir from public.memberships m
    where m.club_code = p_code
    order by (m.role = 'admin') desc, m.joined_at
    limit 1;
    if heir is not null then
      update public.memberships set role = 'owner' where club_code = p_code and user_id = heir;
    end if;
  end if;
  update public.clubs set owner_id = heir where code = p_code;
  return heir;
end;
$$;

-- ---------------------------------------------------------------------------
-- Resumen y métricas

-- Borra de verdad lo que lleva más de 30 días en la papelera.
create function public._admin_purge_expired()
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  t public.admin_trash;
  n integer := 0;
begin
  for t in
    select * from public.admin_trash x
    where x.restored_at is null and x.purged_at is null and x.purge_after <= now()
    order by x.id
  loop
    perform public._admin_purge_one(t.id);
    n := n + 1;
  end loop;
  return n;
end;
$$;

create function public._admin_purge_one(p_id bigint)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  t public.admin_trash;
begin
  select * into t from public.admin_trash x where x.id = p_id and x.restored_at is null and x.purged_at is null for update;
  if not found then
    return;
  end if;
  if t.kind = 'user' then
    delete from auth.users u where u.id = (t.ref ->> 'user_id')::uuid;
  end if;
  -- Juegos, partidas y demás quedan marcados como borrados (lo necesita la sincronización);
  -- clubes e integrantes ya no están. Sólo se descarta la copia.
  update public.admin_trash set purged_at = now(), snapshot = null where id = t.id;
end;
$$;

create function public.admin_overview()
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  purged integer;
  today date := (now() at time zone 'America/Argentina/Buenos_Aires')::date;
begin
  perform public._assert_app_admin();
  purged := public._admin_purge_expired();
  return jsonb_build_object(
    'purged', purged,
    'totals', jsonb_build_object(
      'users', (select count(*) from auth.users),
      'users_7d', (select count(*) from auth.users u where u.created_at > now() - interval '7 days'),
      'profiles', (select count(*) from public.profiles),
      'active_1d', (select count(distinct a.user_id) from public.user_activity a where a.day = today),
      'active_7d', (select count(distinct a.user_id) from public.user_activity a where a.day > today - 7),
      'active_28d', (select count(distinct a.user_id) from public.user_activity a where a.day > today - 28),
      'groups', (select count(*) from public.clubs c where c.kind = 'group'),
      'duos', (select count(*) from public.clubs c where c.kind = 'duo'),
      'groups_7d', (select count(*) from public.clubs c where c.kind = 'group' and c.created_at > now() - interval '7 days'),
      'public_groups', (select count(*) from public.clubs c where c.is_public),
      'plays', (select count(*) from metricas.partidas),
      'plays_7d', (select count(*) from metricas.partidas p where p.fecha > now() - interval '7 days'),
      'active_groups_7d', (select count(distinct p.club_code) from metricas.partidas p where p.tipo_club = 'group' and p.fecha > now() - interval '7 days'),
      'active_groups_28d', (select count(distinct p.club_code) from metricas.partidas p where p.tipo_club = 'group' and p.fecha > now() - interval '28 days'),
      'custom_games', (select count(*) from public.entities e where e.kind = 'game' and not e.deleted),
      'ai_month_usd', (select coalesce(sum(a.cost_usd), 0) from public.ai_usage a where a.created_at >= date_trunc('month', now())),
      'ai_month_calls', (select count(*) from public.ai_usage a where a.created_at >= date_trunc('month', now())),
      'open_reports', (select count(*) from public.reports r where r.status = 'open'),
      'trash', (select count(*) from public.admin_trash t where t.restored_at is null and t.purged_at is null)
    ),
    -- Últimos 30 días, día por día.
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'day', d.day,
        'signups', (select count(*) from auth.users u where (u.created_at at time zone 'America/Argentina/Buenos_Aires')::date = d.day),
        'active', (select count(*) from public.user_activity a where a.day = d.day),
        'plays', (select count(*) from metricas.partidas p where (p.fecha at time zone 'America/Argentina/Buenos_Aires')::date = d.day),
        'groups', (select count(*) from public.clubs c where c.kind = 'group' and (c.created_at at time zone 'America/Argentina/Buenos_Aires')::date = d.day)
      ) order by d.day), '[]'::jsonb)
      from (select generate_series(today - 29, today, interval '1 day')::date as day) d
    ),
    'weekly', (select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) from (select * from metricas.semanal limit 12) s),
    'games', (select coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb) from (select * from metricas.juegos limit 15) g),
    'retention', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (select * from metricas.retencion limit 8) r)
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Personas

create function public._admin_users_json(p_query text, p_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  q text := lower(trim(coalesce(p_query, '')));
begin
  return (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
    from (
      select u.id as user_id,
             u.email::text as email,
             coalesce(u.raw_app_meta_data -> 'providers', '[]'::jsonb) as providers,
             u.created_at,
             u.last_sign_in_at,
             coalesce(u.banned_until > now(), false) as banned,
             exists (select 1 from public.admin_trash t
                     where t.kind = 'user' and t.ref ->> 'user_id' = u.id::text and t.restored_at is null and t.purged_at is null) as deleted,
             exists (select 1 from public.app_admins a where a.user_id = u.id) as is_admin,
             p.username, p.display_name, p.emoji, p.color,
             (select count(*) from public.memberships m where m.user_id = u.id) as clubs,
             (select count(*) from public.entities e where e.created_by = u.id and e.kind = 'game' and not e.deleted) as games_created,
             (select count(*) from public.entities e where e.created_by = u.id and e.kind in ('play', 'match') and not e.deleted) as plays_created,
             (select coalesce(sum(a.cost_usd), 0) from public.ai_usage a where a.user_id = u.id) as ai_usd,
             (select max(a.day) from public.user_activity a where a.user_id = u.id) as last_active,
             coalesce(f.ai_blocked, false) as ai_blocked
      from auth.users u
      left join public.profiles p on p.user_id = u.id
      left join public.user_flags f on f.user_id = u.id
      where (p_user is null or u.id = p_user)
        and (q = ''
         or lower(u.email) like '%' || q || '%'
         or p.username like '%' || q || '%'
         or lower(coalesce(p.display_name, '')) like '%' || q || '%')
      order by u.created_at desc
      limit 500
    ) x
  );
end;
$$;

create function public.admin_users(p_query text default '')
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return public._admin_users_json(p_query, null);
end;
$$;

create function public.admin_user(p_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  base jsonb;
begin
  perform public._assert_app_admin();
  base := public._admin_users_json('', p_user) -> 0;
  if base is null then
    raise exception 'Esa cuenta no existe';
  end if;
  return base || jsonb_build_object(
    'memberships', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'code', c.code, 'name', c.name, 'emoji', c.emoji, 'kind', c.kind,
        'role', m.role, 'player_id', m.player_id, 'joined_at', m.joined_at) order by m.joined_at), '[]'::jsonb)
      from public.memberships m join public.clubs c on c.code = m.club_code
      where m.user_id = p_user),
    'friends', (select count(*) from public.friendships f where p_user in (f.user_low, f.user_high) and f.status = 'accepted'),
    'games', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'code', e.club_code, 'club', c.name, 'id', e.id, 'name', e.data ->> 'name', 'emoji', e.data ->> 'emoji',
        'updated_at', e.updated_at) order by e.updated_at desc), '[]'::jsonb)
      from public.entities e join public.clubs c on c.code = e.club_code
      where e.created_by = p_user and e.kind = 'game' and not e.deleted),
    'ai', (
      select coalesce(jsonb_agg(jsonb_build_object('at', a.created_at, 'model', a.model, 'usd', a.cost_usd) order by a.created_at desc), '[]'::jsonb)
      from (select * from public.ai_usage a where a.user_id = p_user order by a.created_at desc limit 50) a),
    'activity_days', (select count(*) from public.user_activity a where a.user_id = p_user),
    'reports_about', (
      select coalesce(jsonb_agg(to_jsonb(r) order by r.created_at desc), '[]'::jsonb)
      from public.reports r where r.target_kind = 'user' and r.target ->> 'user_id' = p_user::text),
    'log', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.at desc), '[]'::jsonb)
      from (select * from public.admin_log l where l.target_kind = 'user' and l.target_id = p_user::text order by l.at desc limit 30) l)
  );
end;
$$;

-- Borra la cuenta (con 30 días para deshacer). Sus jugadores quedan en los clubes, sin cuenta.
create function public.admin_delete_user(p_user uuid, p_reason text default null)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
  snap jsonb;
  label text := public._admin_user_label(p_user);
  trash_id bigint;
  c record;
  transfers jsonb := '[]'::jsonb;
  heir uuid;
begin
  if p_user = me then
    raise exception 'No podés borrar tu propia cuenta desde el panel';
  end if;
  if not exists (select 1 from auth.users u where u.id = p_user) then
    raise exception 'Esa cuenta no existe';
  end if;
  if exists (select 1 from public.admin_trash t where t.kind = 'user' and t.ref ->> 'user_id' = p_user::text and t.restored_at is null and t.purged_at is null) then
    raise exception 'Esa cuenta ya está en la papelera';
  end if;

  snap := jsonb_build_object(
    'banned_until', (select u.banned_until from auth.users u where u.id = p_user),
    'profile', (select to_jsonb(p) from public.profiles p where p.user_id = p_user),
    'memberships', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.memberships m where m.user_id = p_user),
    'friendships', (select coalesce(jsonb_agg(to_jsonb(f)), '[]'::jsonb) from public.friendships f where p_user in (f.user_low, f.user_high)),
    'flags', (select to_jsonb(f) from public.user_flags f where f.user_id = p_user));

  -- Fuera de sus clubes (los clubes que eran suyos pasan a otro integrante).
  for c in select m.club_code, m.role from public.memberships m where m.user_id = p_user loop
    delete from public.memberships m using (select 1) x where m.club_code = c.club_code and m.user_id = p_user;
    if c.role = 'owner' or (select cl.owner_id from public.clubs cl where cl.code = c.club_code) = p_user then
      heir := public._admin_heir(c.club_code);
      transfers := transfers || jsonb_build_array(jsonb_build_object('code', c.club_code, 'to', heir));
    end if;
  end loop;
  update public.clubs set owner_id = null where owner_id = p_user;
  delete from public.friendships f using (select 1) x where p_user in (f.user_low, f.user_high);
  delete from public.join_requests r using (select 1) x where r.user_id = p_user and r.status = 'pending';
  delete from public.group_invites i using (select 1) x where i.invited_user = p_user and i.status = 'pending';
  delete from public.profiles p using (select 1) x where p.user_id = p_user;

  -- Bloqueada y sin sesiones abiertas.
  update auth.users set banned_until = now() + interval '100 years' where id = p_user;
  delete from auth.sessions s using (select 1) x where s.user_id = p_user;
  delete from auth.refresh_tokens r using (select 1) x where r.user_id = p_user::text;

  insert into public.admin_trash (kind, label, ref, snapshot, reason, deleted_by)
  values ('user', label, jsonb_build_object('user_id', p_user, 'email', (select u.email::text from auth.users u where u.id = p_user)),
          snap || jsonb_build_object('transfers', transfers), nullif(trim(coalesce(p_reason, '')), ''), me)
  returning id into trash_id;
  perform public._admin_log('delete_user', 'user', p_user::text, label, jsonb_build_object('reason', p_reason, 'transfers', transfers), trash_id);
  return trash_id;
end;
$$;

create function public.admin_set_banned(p_user uuid, p_banned boolean)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
begin
  if p_user = me then
    raise exception 'No podés bloquear tu propia cuenta';
  end if;
  update auth.users set banned_until = case when p_banned then now() + interval '100 years' else null end where id = p_user;
  if not found then
    raise exception 'Esa cuenta no existe';
  end if;
  if p_banned then
    delete from auth.sessions s using (select 1) x where s.user_id = p_user;
    delete from auth.refresh_tokens r using (select 1) x where r.user_id = p_user::text;
  end if;
  perform public._admin_log(case when p_banned then 'ban_user' else 'unban_user' end, 'user', p_user::text, public._admin_user_label(p_user));
end;
$$;

create function public.admin_set_ai_blocked(p_user uuid, p_blocked boolean)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  insert into public.user_flags (user_id, ai_blocked, updated_at) values (p_user, p_blocked, now())
  on conflict (user_id) do update set ai_blocked = excluded.ai_blocked, updated_at = now();
  perform public._admin_log(case when p_blocked then 'block_ai' else 'unblock_ai' end, 'user', p_user::text, public._admin_user_label(p_user));
end;
$$;

-- ---------------------------------------------------------------------------
-- Clubes

create function public.admin_clubs(p_query text default '')
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  q text := lower(trim(coalesce(p_query, '')));
begin
  perform public._assert_app_admin();
  return (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.last_activity desc nulls last), '[]'::jsonb)
    from (
      select c.code, c.id, c.name, c.kind, c.emoji, c.description, c.is_public, c.created_at,
             c.owner_id, case when c.owner_id is not null then public._admin_user_label(c.owner_id) end as owner,
             (select count(*) from public.memberships m where m.club_code = c.code) as members,
             (select count(*) from public.entities e where e.club_code = c.code and e.kind = 'player' and not e.deleted) as players,
             (select count(*) from public.entities e where e.club_code = c.code and e.kind in ('play', 'match') and not e.deleted) as plays,
             (select count(*) from public.entities e where e.club_code = c.code and e.kind = 'game' and not e.deleted) as games,
             (select count(*) from public.entities e where e.club_code = c.code and e.kind in ('cup', 'tournament') and not e.deleted) as cups,
             (select max(e.updated_at) from public.entities e where e.club_code = c.code) as last_activity,
             (select count(*) from public.reports r where r.status = 'open' and r.target_kind = 'group' and r.target ->> 'group_id' = c.id::text) as open_reports
      from public.clubs c
      where q = ''
         or lower(c.name) like '%' || q || '%'
         or lower(coalesce(c.description, '')) like '%' || q || '%'
         or c.code = q
      limit 500
    ) x
  );
end;
$$;

create function public.admin_club(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c public.clubs;
begin
  perform public._assert_app_admin();
  select * into c from public.clubs x where x.code = p_code;
  if not found then
    raise exception 'Ese club no existe';
  end if;
  return to_jsonb(c) || jsonb_build_object(
    'owner', case when c.owner_id is not null then public._admin_user_label(c.owner_id) end,
    'members', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'user_id', m.user_id, 'label', public._admin_user_label(m.user_id), 'email', u.email::text,
        'emoji', p.emoji, 'color', p.color, 'role', m.role, 'player_id', m.player_id, 'joined_at', m.joined_at)
        order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, m.joined_at), '[]'::jsonb)
      from public.memberships m
      join auth.users u on u.id = m.user_id
      left join public.profiles p on p.user_id = m.user_id
      where m.club_code = p_code),
    'players', (
      select coalesce(jsonb_agg(e.data || jsonb_build_object('id', e.id) order by e.data ->> 'name'), '[]'::jsonb)
      from public.entities e where e.club_code = p_code and e.kind = 'player' and not e.deleted),
    'games', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', e.id, 'name', e.data ->> 'name', 'emoji', e.data ->> 'emoji', 'createdAt', e.data -> 'createdAt',
        'created_by', e.created_by, 'author', case when e.created_by is not null then public._admin_user_label(e.created_by) end,
        'updated_at', e.updated_at,
        'plays', (select count(*) from public.entities p where p.club_code = p_code and p.kind = 'play' and not p.deleted and p.data ->> 'gameId' = e.id)
        ) order by e.updated_at desc), '[]'::jsonb)
      from public.entities e where e.club_code = p_code and e.kind = 'game' and not e.deleted),
    'plays', (
      select coalesce(jsonb_agg(x.item order by x.ts desc), '[]'::jsonb)
      from (
        select case when e.data ->> 'createdAt' ~ '^\d{1,15}$' then (e.data ->> 'createdAt')::bigint else 0 end as ts,
               jsonb_build_object(
                 'kind', e.kind, 'id', e.id,
                 'gameId', case when e.kind = 'match' then 'pingpong' else e.data ->> 'gameId' end,
                 'status', e.data ->> 'status', 'createdAt', e.data -> 'createdAt', 'finishedAt', e.data -> 'finishedAt',
                 'players', case when e.kind = 'match'
                   then jsonb_strip_nulls(jsonb_build_array(e.data -> 'playerA', e.data -> 'partnerA', e.data -> 'playerB', e.data -> 'partnerB'))
                   else coalesce((select jsonb_agg(pl) from jsonb_array_elements(e.data -> 'sides') s, jsonb_array_elements(s -> 'players') pl), '[]'::jsonb) end,
                 'places', e.data -> 'result' -> 'places',
                 'winner', e.data -> 'winner',
                 'author', case when e.created_by is not null then public._admin_user_label(e.created_by) end) as item
        from public.entities e
        where e.club_code = p_code and e.kind in ('play', 'match') and not e.deleted
        order by ts desc
        limit 200
      ) x),
    'cups', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'kind', e.kind, 'id', e.id, 'name', e.data ->> 'name', 'gameId', coalesce(e.data ->> 'gameId', 'pingpong'),
        'createdAt', e.data -> 'createdAt') order by e.updated_at desc), '[]'::jsonb)
      from public.entities e where e.club_code = p_code and e.kind in ('cup', 'tournament') and not e.deleted),
    'counts', (
      select coalesce(jsonb_object_agg(k.kind, k.n), '{}'::jsonb)
      from (select e.kind, count(*) as n from public.entities e where e.club_code = p_code and not e.deleted group by e.kind) k),
    'pending_requests', (select count(*) from public.join_requests r where r.club_code = p_code and r.status = 'pending'),
    'reports', (
      select coalesce(jsonb_agg(to_jsonb(r) order by r.created_at desc), '[]'::jsonb)
      from public.reports r where r.target_kind = 'group' and r.target ->> 'group_id' = c.id::text),
    'log', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.at desc), '[]'::jsonb)
      from (select * from public.admin_log l where l.target_kind in ('club', 'entity', 'member') and (l.target_id = p_code or l.target_id like p_code || '/%') order by l.at desc limit 30) l)
  );
end;
$$;

create function public.admin_update_club(p_code text, p_name text, p_description text, p_emoji text, p_public boolean)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  prev jsonb;
begin
  perform public._assert_app_admin();
  select jsonb_build_object('name', c.name, 'description', c.description, 'emoji', c.emoji, 'is_public', c.is_public)
    into prev from public.clubs c where c.code = p_code;
  if prev is null then
    raise exception 'Ese club no existe';
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
  perform public._admin_log('update_club', 'club', p_code, left(trim(p_name), 60), jsonb_build_object('before', prev));
end;
$$;

create function public.admin_set_club_owner(p_code text, p_user uuid)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  prev uuid;
begin
  perform public._assert_app_admin();
  select c.owner_id into prev from public.clubs c where c.code = p_code;
  if not found then
    raise exception 'Ese club no existe';
  end if;
  if not exists (select 1 from public.memberships m where m.club_code = p_code and m.user_id = p_user) then
    raise exception 'Tiene que ser parte del club';
  end if;
  update public.memberships set role = 'admin' where club_code = p_code and role = 'owner' and user_id <> p_user;
  update public.memberships set role = 'owner' where club_code = p_code and user_id = p_user;
  update public.clubs set owner_id = p_user where code = p_code;
  perform public._admin_log('set_owner', 'club', p_code, (select name from public.clubs where code = p_code),
    jsonb_build_object('before', prev, 'after', p_user, 'after_label', public._admin_user_label(p_user)));
end;
$$;

create function public.admin_remove_member(p_code text, p_user uuid)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
  m public.memberships;
  trash_id bigint;
  label text;
begin
  select * into m from public.memberships x where x.club_code = p_code and x.user_id = p_user;
  if not found then
    raise exception 'No es parte de ese club';
  end if;
  label := public._admin_user_label(p_user) || ' de ' || (select name from public.clubs where code = p_code);
  delete from public.memberships x using (select 1) y where x.club_code = p_code and x.user_id = p_user;
  if m.role = 'owner' then
    perform public._admin_heir(p_code);
  end if;
  insert into public.admin_trash (kind, label, ref, snapshot, deleted_by)
  values ('member', label, jsonb_build_object('code', p_code, 'user_id', p_user), to_jsonb(m), me)
  returning id into trash_id;
  perform public._admin_log('remove_member', 'member', p_code || '/' || p_user, label, '{}'::jsonb, trash_id);
  return trash_id;
end;
$$;

-- Borra un club (con 30 días para deshacer, con el mismo código).
create function public.admin_delete_club(p_code text, p_reason text default null)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
  c public.clubs;
  snap jsonb;
  trash_id bigint;
begin
  select * into c from public.clubs x where x.code = p_code;
  if not found then
    raise exception 'Ese club no existe';
  end if;
  snap := jsonb_build_object(
    'club', to_jsonb(c),
    'entities', (select coalesce(jsonb_agg(to_jsonb(e)), '[]'::jsonb) from public.entities e where e.club_code = p_code),
    'memberships', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.memberships m where m.club_code = p_code),
    'duo_of', (select coalesce(jsonb_agg(jsonb_build_object('user_low', f.user_low, 'user_high', f.user_high)), '[]'::jsonb)
               from public.friendships f where f.duo_code = p_code));
  delete from public.clubs x using (select 1) y where x.code = p_code;
  insert into public.admin_trash (kind, label, ref, snapshot, reason, deleted_by)
  values ('club', coalesce(c.emoji || ' ', '') || c.name, jsonb_build_object('code', p_code, 'group_id', c.id), snap,
          nullif(trim(coalesce(p_reason, '')), ''), me)
  returning id into trash_id;
  perform public._admin_log('delete_club', 'club', p_code, c.name, jsonb_build_object('reason', p_reason), trash_id);
  return trash_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Juegos agregados, partidas, jugadores y torneos

create function public.admin_games(p_query text default '')
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  q text := lower(trim(coalesce(p_query, '')));
begin
  perform public._assert_app_admin();
  return (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.updated_at desc), '[]'::jsonb)
    from (
      select e.club_code as code, c.name as club, c.emoji as club_emoji, e.id, e.data ->> 'name' as name, e.data ->> 'emoji' as emoji,
             e.data ->> 'category' as category, e.data -> 'createdAt' as "createdAt", e.updated_at,
             e.created_by, case when e.created_by is not null then public._admin_user_label(e.created_by) end as author,
             (select count(*) from public.entities p where p.club_code = e.club_code and p.kind = 'play' and not p.deleted and p.data ->> 'gameId' = e.id) as plays,
             (select count(*) from public.reports r where r.status = 'open' and r.target_kind = 'game' and r.target ->> 'code' = e.club_code and r.target ->> 'id' = e.id) as open_reports
      from public.entities e
      join public.clubs c on c.code = e.club_code
      where e.kind = 'game' and not e.deleted
        and (q = '' or lower(coalesce(e.data ->> 'name', '')) like '%' || q || '%' or lower(c.name) like '%' || q || '%')
      limit 500
    ) x
  );
end;
$$;

-- La ficha completa de un juego agregado (para revisarla).
create function public.admin_entity(p_code text, p_kind text, p_id text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return (
    select jsonb_build_object('data', e.data, 'deleted', e.deleted, 'v', e.v, 'updated_at', e.updated_at,
      'created_by', e.created_by, 'author', case when e.created_by is not null then public._admin_user_label(e.created_by) end)
    from public.entities e where e.club_code = p_code and e.kind = p_kind and e.id = p_id);
end;
$$;

-- Borra un juego, una partida, un jugador o un torneo como lo haría la app (llega a todos los dispositivos).
create function public.admin_delete_entity(p_code text, p_kind text, p_id text, p_reason text default null)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
  e public.entities;
  label text;
  trash_id bigint;
begin
  select * into e from public.entities x where x.club_code = p_code and x.kind = p_kind and x.id = p_id and not x.deleted for update;
  if not found then
    raise exception 'No existe (o ya está borrado)';
  end if;
  label := case p_kind when 'game' then 'Juego' when 'play' then 'Partida' when 'match' then 'Partido' when 'player' then 'Jugador'
                       when 'cup' then 'Torneo' when 'tournament' then 'Torneo' else p_kind end
           || ' ' || coalesce(e.data ->> 'name', e.data ->> 'gameId', e.id)
           || ' (' || (select name from public.clubs where code = p_code) || ')';
  update public.entities
    set deleted = true, data = null, v = greatest(e.v + 1, public._now_ms()), updated_at = clock_timestamp(), updated_by = me
  where club_code = p_code and kind = p_kind and id = p_id;
  insert into public.admin_trash (kind, label, ref, snapshot, reason, deleted_by)
  values ('entity', label, jsonb_build_object('code', p_code, 'kind', p_kind, 'id', p_id), jsonb_build_object('data', e.data, 'created_by', e.created_by),
          nullif(trim(coalesce(p_reason, '')), ''), me)
  returning id into trash_id;
  perform public._admin_log('delete_' || p_kind, 'entity', p_code || '/' || p_kind || '/' || p_id, label, jsonb_build_object('reason', p_reason), trash_id);
  return trash_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Papelera

create function public.admin_trash_list()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', t.id, 'kind', t.kind, 'label', t.label, 'ref', t.ref, 'reason', t.reason,
      'deleted_at', t.deleted_at, 'purge_after', t.purge_after, 'restored_at', t.restored_at, 'purged_at', t.purged_at,
      'deleted_by', case when t.deleted_by is not null then public._admin_user_label(t.deleted_by) end
    ) order by t.deleted_at desc), '[]'::jsonb)
    from (select * from public.admin_trash x order by x.deleted_at desc limit 300) t
  );
end;
$$;

create function public.admin_restore(p_id bigint)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  t public.admin_trash;
  s jsonb;
  uid uuid;
  item jsonb;
begin
  perform public._assert_app_admin();
  select * into t from public.admin_trash x where x.id = p_id for update;
  if not found or t.restored_at is not null or t.purged_at is not null then
    raise exception 'Ya no se puede recuperar';
  end if;
  s := t.snapshot;

  if t.kind = 'entity' then
    update public.entities
      set deleted = false, data = s -> 'data', v = greatest(v + 1, public._now_ms()), updated_at = clock_timestamp(), updated_by = (select auth.uid())
    where club_code = t.ref ->> 'code' and kind = t.ref ->> 'kind' and id = t.ref ->> 'id' and deleted;
    if not found then
      raise exception 'No se puede recuperar: el club ya no existe o se volvió a crear con otros datos';
    end if;

  elsif t.kind = 'club' then
    if exists (select 1 from public.clubs c where c.code = t.ref ->> 'code') then
      raise exception 'Ya hay un club con ese código';
    end if;
    -- Las cuentas que ya no existen (dueño, autores) quedan en null.
    insert into public.clubs
      select (jsonb_populate_record(null::public.clubs, s -> 'club' || jsonb_build_object(
        'owner_id', case when exists (select 1 from auth.users u where u.id::text = s -> 'club' ->> 'owner_id') then s -> 'club' -> 'owner_id' end))).*;
    insert into public.entities
      select (jsonb_populate_record(null::public.entities, it || jsonb_build_object(
        'updated_at', clock_timestamp(),
        'created_by', case when exists (select 1 from auth.users u where u.id::text = it ->> 'created_by') then it -> 'created_by' end,
        'updated_by', case when exists (select 1 from auth.users u where u.id::text = it ->> 'updated_by') then it -> 'updated_by' end))).*
      from jsonb_array_elements(s -> 'entities') it;
    insert into public.memberships
      select (jsonb_populate_record(null::public.memberships, it)).*
      from jsonb_array_elements(s -> 'memberships') it
      where exists (select 1 from auth.users u where u.id = (it ->> 'user_id')::uuid)
    on conflict do nothing;
    if (select c.owner_id from public.clubs c where c.code = t.ref ->> 'code') is null then
      perform public._admin_heir(t.ref ->> 'code');
    end if;
    for item in select * from jsonb_array_elements(s -> 'duo_of') loop
      update public.friendships set duo_code = t.ref ->> 'code'
      where user_low = (item ->> 'user_low')::uuid and user_high = (item ->> 'user_high')::uuid and duo_code is null;
    end loop;

  elsif t.kind = 'member' then
    if not exists (select 1 from public.clubs c where c.code = t.ref ->> 'code') then
      raise exception 'El club ya no existe';
    end if;
    insert into public.memberships
      select (jsonb_populate_record(null::public.memberships, s)).*
    on conflict do nothing;
    -- Si el club ya tiene otro dueño, vuelve como admin.
    update public.memberships m set role = 'admin'
    where m.club_code = t.ref ->> 'code' and m.user_id = (t.ref ->> 'user_id')::uuid and m.role = 'owner'
      and exists (select 1 from public.memberships o where o.club_code = m.club_code and o.role = 'owner' and o.user_id <> m.user_id);
    if (select role from public.memberships where club_code = t.ref ->> 'code' and user_id = (t.ref ->> 'user_id')::uuid) = 'owner' then
      update public.clubs set owner_id = (t.ref ->> 'user_id')::uuid where code = t.ref ->> 'code';
    end if;

  elsif t.kind = 'user' then
    uid := (t.ref ->> 'user_id')::uuid;
    if not exists (select 1 from auth.users u where u.id = uid) then
      raise exception 'La cuenta ya no existe';
    end if;
    update auth.users set banned_until = (s ->> 'banned_until')::timestamptz where id = uid;
    if s -> 'profile' is not null and jsonb_typeof(s -> 'profile') = 'object' then
      insert into public.profiles
        select (jsonb_populate_record(null::public.profiles,
          s -> 'profile' || case when exists (select 1 from public.profiles p where p.username = s -> 'profile' ->> 'username')
                                 then jsonb_build_object('username', null) else '{}'::jsonb end)).*
      on conflict (user_id) do nothing;
    end if;
    -- Vuelve a sus clubes (si el jugador no lo tomó otra cuenta). Si su club ya tiene otro dueño, vuelve como admin.
    for item in select * from jsonb_array_elements(s -> 'memberships') loop
      continue when not exists (select 1 from public.clubs c where c.code = item ->> 'club_code');
      insert into public.memberships (user_id, club_code, player_id, joined_at, role)
      values (uid, item ->> 'club_code',
              case when exists (select 1 from public.memberships o where o.club_code = item ->> 'club_code' and o.player_id = item ->> 'player_id')
                   then null else item ->> 'player_id' end,
              (item ->> 'joined_at')::timestamptz,
              case when item ->> 'role' = 'owner' and exists (select 1 from public.memberships o where o.club_code = item ->> 'club_code' and o.role = 'owner')
                   then 'admin' else item ->> 'role' end)
      on conflict do nothing;
      if item ->> 'role' = 'owner' and (select c.owner_id from public.clubs c where c.code = item ->> 'club_code') is null then
        update public.clubs set owner_id = uid where code = item ->> 'club_code';
        update public.memberships set role = 'owner' where club_code = item ->> 'club_code' and user_id = uid;
      end if;
    end loop;
    insert into public.friendships
      select (jsonb_populate_record(null::public.friendships, it || jsonb_build_object(
        'duo_code', case when exists (select 1 from public.clubs c where c.code = it ->> 'duo_code') then it -> 'duo_code' end))).*
      from jsonb_array_elements(s -> 'friendships') it
      where exists (select 1 from auth.users u where u.id = (it ->> 'user_low')::uuid)
        and exists (select 1 from auth.users u where u.id = (it ->> 'user_high')::uuid)
    on conflict do nothing;
  end if;

  update public.admin_trash set restored_at = now() where id = t.id;
  perform public._admin_log('restore_' || t.kind, t.kind, coalesce(t.ref ->> 'user_id', t.ref ->> 'code'), t.label, '{}'::jsonb, t.id);
end;
$$;

-- Borrar ya, sin esperar los 30 días.
create function public.admin_purge(p_id bigint)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  t public.admin_trash;
begin
  perform public._assert_app_admin();
  select * into t from public.admin_trash x where x.id = p_id;
  if not found or t.restored_at is not null or t.purged_at is not null then
    raise exception 'Ya no está en la papelera';
  end if;
  perform public._admin_purge_one(p_id);
  perform public._admin_log('purge_' || t.kind, t.kind, coalesce(t.ref ->> 'user_id', t.ref ->> 'code'), t.label, '{}'::jsonb, t.id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Auditoría, reportes, IA, interruptores, mensajes, salud y exportar

create function public.admin_log_list(p_limit integer default 200)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return (
    select coalesce(jsonb_agg(to_jsonb(l) || jsonb_build_object('admin', public._admin_user_label(l.admin_id)) order by l.at desc), '[]'::jsonb)
    from (select * from public.admin_log x order by x.at desc limit least(greatest(p_limit, 1), 1000)) l
  );
end;
$$;

create function public.admin_reports(p_status text default 'open')
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return (
    select coalesce(jsonb_agg(to_jsonb(r) || jsonb_build_object(
      'reporter_label', case when r.reporter is not null then public._admin_user_label(r.reporter) end,
      'target_label', case r.target_kind
        when 'user' then public._admin_user_label((r.target ->> 'user_id')::uuid)
        when 'group' then (select coalesce(c.emoji || ' ', '') || c.name from public.clubs c where c.id = (r.target ->> 'group_id')::uuid)
        when 'game' then (select coalesce(e.data ->> 'name', e.id) from public.entities e
                          where e.club_code = r.target ->> 'code' and e.kind = 'game' and e.id = r.target ->> 'id')
      end,
      'club_code', case r.target_kind
        when 'group' then (select c.code from public.clubs c where c.id = (r.target ->> 'group_id')::uuid)
        when 'game' then r.target ->> 'code'
      end
    ) order by r.created_at desc), '[]'::jsonb)
    from (select * from public.reports x where p_status = 'all' or x.status = p_status order by x.created_at desc limit 300) r
  );
end;
$$;

create function public.admin_resolve_report(p_id bigint, p_status text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._assert_app_admin();
begin
  if p_status not in ('open', 'resolved', 'dismissed') then
    raise exception 'Estado inválido';
  end if;
  update public.reports
    set status = p_status,
        resolved_at = case when p_status = 'open' then null else now() end,
        resolved_by = case when p_status = 'open' then null else me end
  where id = p_id;
  perform public._admin_log('report_' || p_status, 'report', p_id::text, null);
end;
$$;

create function public.admin_ai_usage()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return jsonb_build_object(
    'months', (
      select coalesce(jsonb_agg(jsonb_build_object('month', m.month, 'calls', m.calls, 'usd', m.usd) order by m.month desc), '[]'::jsonb)
      from (select date_trunc('month', a.created_at) as month, count(*) as calls, sum(a.cost_usd) as usd
            from public.ai_usage a group by 1 order by 1 desc limit 12) m),
    'by_user', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'user_id', b.user_id, 'label', case when b.user_id is not null then public._admin_user_label(b.user_id) else 'Cuenta borrada' end,
        'calls', b.calls, 'usd', b.usd,
        'ai_blocked', coalesce((select f.ai_blocked from public.user_flags f where f.user_id = b.user_id), false)) order by b.usd desc), '[]'::jsonb)
      from (select a.user_id, count(*) as calls, sum(a.cost_usd) as usd from public.ai_usage a
            where a.created_at >= date_trunc('month', now()) group by a.user_id) b),
    'recent', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', a.created_at, 'model', a.model, 'usd', a.cost_usd, 'input_tokens', a.input_tokens, 'output_tokens', a.output_tokens,
        'label', case when a.user_id is not null then public._admin_user_label(a.user_id) else 'Cuenta borrada' end) order by a.created_at desc), '[]'::jsonb)
      from (select * from public.ai_usage x order by x.created_at desc limit 50) a)
  );
end;
$$;

create function public.admin_settings()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return (select coalesce(jsonb_object_agg(s.key, s.value), '{}'::jsonb) from public.app_settings s);
end;
$$;

create function public.admin_save_setting(p_key text, p_value jsonb)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  prev jsonb;
begin
  perform public._assert_app_admin();
  if jsonb_typeof(p_value) <> 'object' or pg_column_size(p_value) > 4000 then
    raise exception 'Valor inválido';
  end if;
  select s.value into prev from public.app_settings s where s.key = p_key;
  insert into public.app_settings (key, value, updated_at, updated_by) values (p_key, p_value, now(), (select auth.uid()))
  on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by;
  perform public._admin_log('setting_' || p_key, 'setting', p_key, null, jsonb_build_object('before', prev, 'after', p_value));
end;
$$;

-- Mensaje a todas las cuentas, a las de un club o a una persona (llega a sus notificaciones).
create function public.admin_send_message(p_target text, p_ref text, p_title text, p_message text)
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  n integer;
  payload jsonb;
begin
  perform public._assert_app_admin();
  if char_length(trim(coalesce(p_title, ''))) = 0 then
    raise exception 'Falta el título';
  end if;
  payload := jsonb_build_object('title', left(trim(p_title), 120), 'message', nullif(left(trim(coalesce(p_message, '')), 1000), ''), 'emoji', '📣');
  insert into public.notifications (user_id, kind, data)
  select x.user_id, 'admin_message', payload
  from (
    select u.id as user_id from auth.users u where p_target = 'all' and (u.banned_until is null or u.banned_until < now())
    union
    select m.user_id from public.memberships m where p_target = 'club' and m.club_code = p_ref
    union
    select u.id from auth.users u where p_target = 'user' and u.id::text = p_ref
  ) x;
  get diagnostics n = row_count;
  perform public._admin_log('message', p_target, p_ref, left(trim(p_title), 120), payload || jsonb_build_object('sent', n));
  return n;
end;
$$;

-- Cosas para revisar: clubes abandonados, datos rotos, cuentas a medio armar.
create function public.admin_health()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return jsonb_build_object(
    'empty_clubs', (
      select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'name', c.name, 'kind', c.kind, 'created_at', c.created_at)), '[]'::jsonb)
      from public.clubs c
      where not exists (select 1 from public.entities e where e.club_code = c.code and not e.deleted)
        and c.created_at < now() - interval '7 days'),
    'abandoned_clubs', (
      select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'name', c.name, 'kind', c.kind, 'last', x.last)), '[]'::jsonb)
      from public.clubs c
      join (select e.club_code, max(e.updated_at) as last from public.entities e group by e.club_code) x on x.club_code = c.code
      where x.last < now() - interval '60 days'),
    'ownerless_clubs', (
      select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'name', c.name, 'kind', c.kind,
        'members', (select count(*) from public.memberships m where m.club_code = c.code))), '[]'::jsonb)
      from public.clubs c where c.owner_id is null),
    'no_profile', (
      select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'email', u.email::text, 'created_at', u.created_at)), '[]'::jsonb)
      from auth.users u
      where not exists (select 1 from public.profiles p where p.user_id = u.id)
        and not exists (select 1 from public.admin_trash t where t.kind = 'user' and t.ref ->> 'user_id' = u.id::text and t.restored_at is null and t.purged_at is null)),
    'broken_plays', (
      select coalesce(jsonb_agg(jsonb_build_object('code', e.club_code, 'club', c.name, 'id', e.id, 'gameId', e.data ->> 'gameId')), '[]'::jsonb)
      from public.entities e join public.clubs c on c.code = e.club_code
      where e.kind = 'play' and not e.deleted
        and (jsonb_typeof(e.data -> 'sides') is distinct from 'array' or jsonb_array_length(e.data -> 'sides') = 0 or e.data ->> 'gameId' is null)),
    'stale_live', (
      select coalesce(jsonb_agg(jsonb_build_object('code', e.club_code, 'club', c.name, 'id', e.id, 'gameId', e.data ->> 'gameId', 'updated_at', e.updated_at)), '[]'::jsonb)
      from public.entities e join public.clubs c on c.code = e.club_code
      where e.kind = 'play' and not e.deleted and e.data ->> 'status' = 'live' and e.updated_at < now() - interval '7 days'),
    'big_entities', (
      select coalesce(jsonb_agg(jsonb_build_object('code', e.club_code, 'kind', e.kind, 'id', e.id, 'bytes', pg_column_size(e.data))), '[]'::jsonb)
      from public.entities e where pg_column_size(e.data) > 100000),
    'pending_requests_old', (
      select count(*) from public.join_requests r where r.status = 'pending' and r.created_at < now() - interval '14 days')
  );
end;
$$;

create function public.admin_export_club(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  if not exists (select 1 from public.clubs c where c.code = p_code) then
    raise exception 'Ese club no existe';
  end if;
  return jsonb_build_object(
    'exported_at', now(),
    'club', (select to_jsonb(c) from public.clubs c where c.code = p_code),
    'members', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.memberships m where m.club_code = p_code),
    'entities', (select coalesce(jsonb_agg(jsonb_build_object('kind', e.kind, 'id', e.id, 'data', e.data, 'deleted', e.deleted, 'v', e.v, 'updated_at', e.updated_at, 'created_by', e.created_by)), '[]'::jsonb)
                 from public.entities e where e.club_code = p_code));
end;
$$;

create function public.admin_export_user(p_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public._assert_app_admin();
  return jsonb_build_object(
    'exported_at', now(),
    'account', (select jsonb_build_object('id', u.id, 'email', u.email::text, 'created_at', u.created_at, 'last_sign_in_at', u.last_sign_in_at,
                                          'providers', u.raw_app_meta_data -> 'providers') from auth.users u where u.id = p_user),
    'profile', (select to_jsonb(p) from public.profiles p where p.user_id = p_user),
    'memberships', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.memberships m where m.user_id = p_user),
    'friendships', (select coalesce(jsonb_agg(to_jsonb(f)), '[]'::jsonb) from public.friendships f where p_user in (f.user_low, f.user_high)),
    'created', (select coalesce(jsonb_agg(jsonb_build_object('club_code', e.club_code, 'kind', e.kind, 'id', e.id, 'data', e.data)), '[]'::jsonb)
                from public.entities e where e.created_by = p_user and not e.deleted),
    'ai_usage', (select coalesce(jsonb_agg(to_jsonb(a)), '[]'::jsonb) from public.ai_usage a where a.user_id = p_user),
    'activity', (select coalesce(jsonb_agg(a.day order by a.day), '[]'::jsonb) from public.user_activity a where a.user_id = p_user),
    'notifications', (select coalesce(jsonb_agg(to_jsonb(n)), '[]'::jsonb) from public.notifications n where n.user_id = p_user));
end;
$$;

-- ---------------------------------------------------------------------------
-- Permisos

do $$
declare
  fn text;
begin
  -- Internas: ningún cliente.
  foreach fn in array array[
    'public._assert_app_admin()',
    'public._admin_log(text, text, text, text, jsonb, bigint)',
    'public._admin_user_label(uuid)',
    'public._admin_users_json(text, uuid)',
    'public._admin_heir(text)',
    'public._admin_purge_expired()',
    'public._admin_purge_one(bigint)'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', fn);
  end loop;

  -- Con sesión (las admin_* además verifican que seas admin).
  foreach fn in array array[
    'public.touch_activity()',
    'public.report_content(text, jsonb, text)',
    'public.is_app_admin()',
    'public.admin_overview()',
    'public.admin_users(text)',
    'public.admin_user(uuid)',
    'public.admin_delete_user(uuid, text)',
    'public.admin_set_banned(uuid, boolean)',
    'public.admin_set_ai_blocked(uuid, boolean)',
    'public.admin_clubs(text)',
    'public.admin_club(text)',
    'public.admin_update_club(text, text, text, text, boolean)',
    'public.admin_set_club_owner(text, uuid)',
    'public.admin_remove_member(text, uuid)',
    'public.admin_delete_club(text, text)',
    'public.admin_games(text)',
    'public.admin_entity(text, text, text)',
    'public.admin_delete_entity(text, text, text, text)',
    'public.admin_trash_list()',
    'public.admin_restore(bigint)',
    'public.admin_purge(bigint)',
    'public.admin_log_list(integer)',
    'public.admin_reports(text)',
    'public.admin_resolve_report(bigint, text)',
    'public.admin_ai_usage()',
    'public.admin_settings()',
    'public.admin_save_setting(text, jsonb)',
    'public.admin_send_message(text, text, text, text)',
    'public.admin_health()',
    'public.admin_export_club(text)',
    'public.admin_export_user(uuid)'
  ] loop
    execute format('revoke all on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated', fn);
  end loop;

  -- Para todos (también sin cuenta).
  execute 'revoke all on function public.app_config() from public';
  execute 'grant execute on function public.app_config() to anon, authenticated';
end;
$$;
