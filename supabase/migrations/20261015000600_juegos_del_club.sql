-- Juegos del club: los que el club tiene o juega, elegidos por un admin. Salen destacados en la pantalla
-- del club, primero en "Para jugar hoy" y primero al anotar. `null`: el club todavía no eligió (la app
-- muestra los más jugados). Son ids del catálogo o de juegos agregados por el club, en el orden elegido.

alter table public.clubs
  add column if not exists games jsonb check (games is null or (jsonb_typeof(games) = 'array' and jsonb_array_length(games) <= 24));

-- Pone, cambia o saca (null) los juegos del club. En un club, sólo el dueño o un admin; en un mano a
-- mano, cualquiera de los dos.
create function public.set_club_games(p_code text, p_games jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  club_kind text := (select kind from public.clubs where code = p_code);
begin
  if club_kind is null then
    raise exception 'No encontramos el club';
  end if;
  if club_kind = 'duo' then
    if not exists (select 1 from public.memberships m where m.club_code = p_code and m.user_id = me) then
      raise exception 'Sólo los del mano a mano pueden elegir sus juegos';
    end if;
  elsif not public._is_admin(p_code, me) then
    raise exception 'Sólo el dueño o un admin pueden elegir los juegos del club';
  end if;
  if p_games is not null and (jsonb_typeof(p_games) <> 'array' or jsonb_array_length(p_games) > 24) then
    raise exception 'Se pueden elegir hasta 24 juegos';
  end if;
  update public.clubs
    set games = case when p_games is null then null else (
          -- Sin repetidos y en el orden elegido.
          select coalesce(jsonb_agg(g order by i), '[]'::jsonb)
          from (
            select left(g, 64) as g, min(i) as i
            from jsonb_array_elements_text(p_games) with ordinality as t(g, i)
            where char_length(trim(g)) > 0
            group by left(g, 64)
          ) x) end
  where code = p_code;
end;
$$;

-- Juegos de los clubes de la cuenta. Va aparte de `my_groups` y `my_group_links` para no tener que
-- borrarlas y crearlas de nuevo con otra columna.
create function public.my_club_games()
returns table (code text, games jsonb)
language sql
stable
security definer
set search_path = ''
as $$
  select c.code, c.games
  from public.memberships m
  join public.clubs c on c.code = m.club_code
  where m.user_id = (select auth.uid());
$$;

revoke all on function public.set_club_games(text, jsonb) from public, anon;
revoke all on function public.my_club_games() from public, anon;
grant execute on function public.set_club_games(text, jsonb) to authenticated;
grant execute on function public.my_club_games() to authenticated;
