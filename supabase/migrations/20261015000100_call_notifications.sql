-- Avisos de convocatorias: cuando te citan a un partido ("¿venís el jueves?") o cuando se libera un lugar
-- y pasás de la lista de espera al partido. Sólo a integrantes del club, y sólo estos dos tipos de aviso.

create function public.notify_players(p_code text, p_player_ids text[], p_kind text, p_data jsonb)
returns integer
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  me uuid := public._uid();
  sent integer := 0;
  m record;
  info jsonb;
begin
  if me is null or public._role(p_code, me) is null then
    raise exception 'No sos parte de ese grupo';
  end if;
  if p_kind not in ('call', 'call_in') then
    raise exception 'Aviso inválido';
  end if;
  if coalesce(array_length(p_player_ids, 1), 0) > 60 or pg_column_size(p_data) > 4000 then
    raise exception 'Aviso demasiado grande';
  end if;
  info := public._group_info(p_code) || jsonb_build_object(
    'from', public._who(me),
    'play_id', left(p_data ->> 'play_id', 64),
    'title', left(p_data ->> 'title', 80),
    'venue', left(p_data ->> 'venue', 60),
    'when', case when p_data ->> 'when' ~ '^[0-9]{1,15}$' then (p_data ->> 'when')::bigint end);
  for m in
    select distinct mm.user_id
    from public.memberships mm
    where mm.club_code = p_code and mm.player_id = any (p_player_ids) and mm.user_id <> me
  loop
    perform public._notify(m.user_id, p_kind, info);
    sent := sent + 1;
  end loop;
  return sent;
end;
$$;

revoke all on function public.notify_players(text, text[], text, jsonb) from public, anon;
grant execute on function public.notify_players(text, text[], text, jsonb) to authenticated;
