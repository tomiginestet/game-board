-- Game Board comparte la base de datos del Ping Pong Club.
--
-- - Los clubes y las entidades son los mismos: los jugadores, partidos y torneos de
--   ping pong se ven en las dos apps. Game Board agrega tres tipos de entidad:
--   `play` (partida de cualquier juego), `cup` (torneo) y `game` (juego agregado por el grupo).
-- - `pull_changes` (la que usa el Ping Pong Club) sigue devolviendo sólo lo de ping pong;
--   Game Board usa `pull_changes_all`.
-- - Cuentas (Supabase Auth, opcionales): cada usuario guarda sus clubes y puede decir
--   cuál de los jugadores de cada club es él. El acceso a los datos sigue siendo con el
--   código secreto del club, igual que antes.
-- - `ai_usage` registra lo que se gasta en generar fichas de juegos con IA, para cortar
--   al llegar al tope mensual. Sólo la escribe la función `generate-game` (service role).

alter table public.entities drop constraint entities_kind_check;
alter table public.entities add constraint entities_kind_check
  check (kind in ('player', 'match', 'tournament', 'play', 'cup', 'game'));

-- El Ping Pong Club sólo necesita lo suyo.
create or replace function public.pull_changes(p_code text, p_since timestamptz default null)
returns table (kind text, id text, data jsonb, deleted boolean, v bigint, updated_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.clubs c where c.code = p_code) then
    raise exception 'Club inexistente';
  end if;
  return query
    select e.kind, e.id, e.data, e.deleted, e.v, e.updated_at
    from public.entities e
    where e.club_code = p_code
      and e.kind in ('player', 'match', 'tournament')
      and (p_since is null or e.updated_at > p_since)
    order by e.updated_at;
end;
$$;

-- Game Board: todo.
create function public.pull_changes_all(p_code text, p_since timestamptz default null)
returns table (kind text, id text, data jsonb, deleted boolean, v bigint, updated_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.clubs c where c.code = p_code) then
    raise exception 'Club inexistente';
  end if;
  return query
    select e.kind, e.id, e.data, e.deleted, e.v, e.updated_at
    from public.entities e
    where e.club_code = p_code
      and (p_since is null or e.updated_at > p_since)
    order by e.updated_at;
end;
$$;

revoke all on function public.pull_changes_all(text, timestamptz) from public;
grant execute on function public.pull_changes_all(text, timestamptz) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Cuentas

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  emoji text check (char_length(emoji) <= 16),
  color text check (char_length(color) <= 16),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "perfil propio: ver" on public.profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "perfil propio: crear" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "perfil propio: editar" on public.profiles
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Clubes de cada usuario y qué jugador es en cada uno.
create table public.memberships (
  user_id uuid not null references auth.users (id) on delete cascade,
  club_code text not null references public.clubs (code) on delete cascade,
  player_id text check (char_length(player_id) <= 64),
  joined_at timestamptz not null default now(),
  primary key (user_id, club_code)
);

create unique index memberships_player_idx on public.memberships (club_code, player_id) where player_id is not null;
create index memberships_club_idx on public.memberships (club_code);

alter table public.memberships enable row level security;

create policy "membresías propias: ver" on public.memberships
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "membresías propias: salir" on public.memberships
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Guarda un club en la cuenta (hay que conocer su código).
create function public.link_club(p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  club_name text;
begin
  if (select auth.uid()) is null then
    raise exception 'Hay que iniciar sesión';
  end if;
  select c.name into club_name from public.clubs c where c.code = p_code;
  if club_name is null then
    raise exception 'Club inexistente';
  end if;
  insert into public.memberships (user_id, club_code)
  values ((select auth.uid()), p_code)
  on conflict (user_id, club_code) do nothing;
  return club_name;
end;
$$;

-- Clubes guardados en la cuenta.
create function public.my_clubs()
returns table (code text, name text, player_id text, joined_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select c.code, c.name, m.player_id, m.joined_at
  from public.memberships m
  join public.clubs c on c.code = m.club_code
  where m.user_id = (select auth.uid())
  order by m.joined_at;
$$;

-- "Este jugador soy yo" (o null para desvincular). Un jugador sólo puede ser de una cuenta.
create function public.claim_player(p_code text, p_player_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Hay que iniciar sesión';
  end if;
  if p_player_id is not null and exists (
    select 1 from public.memberships m
    where m.club_code = p_code and m.player_id = p_player_id and m.user_id <> (select auth.uid())
  ) then
    raise exception 'Ese jugador ya es de otra cuenta';
  end if;
  update public.memberships set player_id = p_player_id
  where user_id = (select auth.uid()) and club_code = p_code;
  if not found then
    raise exception 'Primero guardá el club en tu cuenta';
  end if;
end;
$$;

-- Jugadores del club que ya tienen cuenta (sin datos de la cuenta, sólo el id del jugador).
create function public.claimed_players(p_code text)
returns table (player_id text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.player_id from public.memberships m
  where m.club_code = p_code and m.player_id is not null;
$$;

revoke all on function public.link_club(text) from public;
revoke all on function public.my_clubs() from public;
revoke all on function public.claim_player(text, text) from public;
revoke all on function public.claimed_players(text) from public;
grant execute on function public.link_club(text) to authenticated;
grant execute on function public.my_clubs() to authenticated;
grant execute on function public.claim_player(text, text) to authenticated;
grant execute on function public.claimed_players(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Uso de la IA (para el tope de gasto mensual)

create table public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  model text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  cost_usd numeric(10, 5) not null
);

create index ai_usage_created_idx on public.ai_usage (created_at);
create index ai_usage_user_idx on public.ai_usage (user_id);

alter table public.ai_usage enable row level security;

-- Gasto del mes en curso (lo puede consultar cualquiera con sesión, para mostrar cuánto queda).
create function public.ai_spent_this_month()
returns numeric
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(cost_usd), 0) from public.ai_usage
  where created_at >= date_trunc('month', now());
$$;

revoke all on function public.ai_spent_this_month() from public;
grant execute on function public.ai_spent_this_month() to authenticated;

-- Supabase da EXECUTE a `anon` por defecto en las funciones nuevas: las de cuenta son sólo para usuarios con sesión.
revoke execute on function public.link_club(text) from anon;
revoke execute on function public.my_clubs() from anon;
revoke execute on function public.claim_player(text, text) from anon;
revoke execute on function public.ai_spent_this_month() from anon;
