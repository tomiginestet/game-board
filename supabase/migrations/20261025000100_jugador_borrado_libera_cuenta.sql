-- Borrar un jugador que tiene cuenta libera la cuenta.
--
-- La cuenta quedaba apuntando a un jugador borrado: la app la daba por "con jugador" y no le mostraba
-- "¿Quién sos en este club?", y el jugador ya no estaba en la lista para elegirse. Ahora, al borrarse el
-- jugador (por `push_changes` o cualquier otro camino), la cuenta vuelve a quedar sin jugador.

create function public._release_deleted_player()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.memberships set player_id = null
  where club_code = new.club_code and player_id = new.id;
  return new;
end;
$$;

revoke all on function public._release_deleted_player() from public, anon, authenticated;

create trigger entities_release_deleted_player
  after insert or update of deleted on public.entities
  for each row
  when (new.kind = 'player' and new.deleted)
  execute function public._release_deleted_player();

-- Las cuentas que ya quedaron con un jugador borrado.
update public.memberships m set player_id = null
where m.player_id is not null
  and exists (
    select 1 from public.entities e
    where e.club_code = m.club_code and e.kind = 'player' and e.id = m.player_id and e.deleted);
