-- Equipos fijos del club (fútbol 5 de los jueves, la pareja de pádel): se guardan como entidades `team`.
-- Las fechas, canchas, goleadores y figuras viajan dentro de las partidas y torneos (no hace falta otra tabla).

alter table public.entities drop constraint entities_kind_check;
alter table public.entities add constraint entities_kind_check
  check (kind in ('player', 'match', 'tournament', 'play', 'cup', 'game', 'team'));
