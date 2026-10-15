-- Al entrar a un club, la cuenta queda con su jugador cuando no hay ninguno libre para reclamar.
--
-- Hasta acá, entrar (link, invitación o solicitud aceptada) sólo sumaba la cuenta: el jugador lo creaba la persona
-- desde "¿Quién sos en este club?". Si no lo hacía, aparecía en "Cuentas del club" pero no en "Integrantes" y sus
-- partidas no se le podían anotar. Si el club tiene jugadores sin cuenta, se sigue preguntando (puede ser uno de ellos).
-- Los clubes de lugar ya creaban el jugador desde la app; los mano a mano, en `ensure_duo`.

create or replace function public._add_member(p_code text, p_user uuid, p_role text default 'member')
returns void
language plpgsql
volatile
set search_path = ''
as $$
begin
  insert into public.memberships (user_id, club_code, role)
  values (p_user, p_code, p_role)
  on conflict (user_id, club_code) do nothing;
  if found and p_role = 'member'
     and (select c.kind from public.clubs c where c.code = p_code) = 'group'
     and not exists (
       select 1 from public.entities e
       where e.club_code = p_code and e.kind = 'player' and not e.deleted
         and not exists (select 1 from public.memberships m where m.club_code = p_code and m.player_id = e.id)) then
    perform public._ensure_player(p_code, p_user);
  end if;
end;
$$;

revoke all on function public._add_member(text, uuid, text) from public, anon, authenticated;

-- Los que ya entraron sin jugador a un club sin jugadores libres.
do $$
declare
  r record;
begin
  for r in
    select m.club_code, m.user_id
    from public.memberships m
    join public.clubs c on c.code = m.club_code and c.kind = 'group'
    where m.player_id is null and m.role = 'member'
      and not exists (
        select 1 from public.entities e
        where e.club_code = m.club_code and e.kind = 'player' and not e.deleted
          and not exists (select 1 from public.memberships mm where mm.club_code = e.club_code and mm.player_id = e.id))
  loop
    perform public._ensure_player(r.club_code, r.user_id);
  end loop;
end;
$$;
