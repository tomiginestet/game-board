-- Reiniciar los puntajes de un club: borra todas sus partidas (`play`) y partidos de ping pong (`match`).
-- El ranking, el Elo y las medallas salen de esas partidas, así que quedan en cero. Los jugadores, los juegos,
-- los equipos, las copas y los torneos se quedan (las copas y torneos, sin resultados).
--
-- Sólo el dueño o un admin del club. Se borra como borra la app (`deleted`, sin datos y con una versión más
-- nueva), así el borrado les llega a todos al sincronizar. Devuelve cuántas se borraron.

create function public.reset_club_scores(p_code text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  now_ms bigint := public._now_ms();
  n integer;
begin
  if not public._is_admin(p_code, me) then
    raise exception 'Sólo el dueño o un admin pueden reiniciar los puntajes del club';
  end if;
  update public.entities e
    set deleted = true, data = null, v = greatest(e.v + 1, now_ms), updated_at = clock_timestamp(), updated_by = me
  where e.club_code = p_code and e.kind in ('play', 'match') and not e.deleted;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.reset_club_scores(text) from public, anon;
grant execute on function public.reset_club_scores(text) to authenticated;
