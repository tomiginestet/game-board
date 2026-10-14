-- Métricas de uso: cuántos clubes anotan, cuántas partidas, qué juegos y si los clubes vuelven.
--
-- - Se consultan desde el editor SQL de Supabase: `select * from metricas.resumen;`,
--   `metricas.semanal`, `metricas.juegos` y `metricas.retencion`.
-- - El esquema `metricas` no está en la API: ni la app ni nadie con la clave pública lo puede leer.
-- - Sólo cuentan las partidas que llegaron a la base (clubes sincronizados). Lo que se anota sin
--   cuenta ni club queda en el teléfono y no aparece acá.
-- - Las semanas empiezan el lunes, en hora de Buenos Aires.

create schema metricas;
revoke all on schema metricas from public, anon, authenticated;

-- Una fila por partida de cualquier juego (el ping pong incluido).
create view metricas.partidas with (security_invoker = true) as
select
  p.club_code,
  p.tipo_club,
  p.juego,
  p.terminada,
  p.fecha,
  date_trunc('week', p.fecha at time zone 'America/Argentina/Buenos_Aires')::date as semana
from (
  select
    e.club_code,
    -- 'group' (club) o 'duo' (mano a mano entre dos amigos)
    c.kind as tipo_club,
    case when e.kind = 'match' then 'pingpong' else e.data ->> 'gameId' end as juego,
    e.data ->> 'status' = 'finished' as terminada,
    -- Cuándo se anotó (en el teléfono); si el dato no está o no es una fecha, cuándo llegó a la base.
    case
      when e.data ->> 'createdAt' ~ '^\d{10,14}$' then to_timestamp((e.data ->> 'createdAt')::bigint / 1000.0)
      else e.updated_at
    end as fecha
  from public.entities e
  join public.clubs c on c.code = e.club_code
  where e.kind in ('play', 'match') and not e.deleted
) p;

-- Lo más importante, en una fila.
create view metricas.resumen with (security_invoker = true) as
select
  (select count(distinct club_code) from metricas.partidas
    where tipo_club = 'group' and fecha > now() - interval '7 days') as clubes_activos_7_dias,
  (select count(distinct club_code) from metricas.partidas
    where tipo_club = 'group' and fecha > now() - interval '28 days') as clubes_activos_28_dias,
  (select count(*) from metricas.partidas where fecha > now() - interval '7 days') as partidas_7_dias,
  (select count(*) from public.clubs where kind = 'group') as clubes,
  (select count(*) from auth.users) as cuentas,
  (select coalesce(sum(cost_usd), 0) from public.ai_usage
    where created_at >= date_trunc('month', now())) as gasto_ia_del_mes_usd;

-- Semana por semana (las más nuevas primero). "Activo" = anotó al menos una partida esa semana.
create view metricas.semanal with (security_invoker = true) as
with semanas as (
  select generate_series(
    date_trunc('week', least(
      (select min(created_at) from public.clubs),
      (select min(fecha) from metricas.partidas),
      now()
    ) at time zone 'America/Argentina/Buenos_Aires'),
    date_trunc('week', now() at time zone 'America/Argentina/Buenos_Aires'),
    interval '1 week'
  )::date as semana
),
partidas as (
  select
    semana,
    count(distinct club_code) filter (where tipo_club = 'group') as clubes_activos,
    count(distinct club_code) filter (where tipo_club = 'duo') as mano_a_mano_activos,
    count(*) as partidas
  from metricas.partidas
  group by semana
),
clubes as (
  select date_trunc('week', created_at at time zone 'America/Argentina/Buenos_Aires')::date as semana, count(*) as clubes_nuevos
  from public.clubs
  where kind = 'group'
  group by 1
),
cuentas as (
  select date_trunc('week', created_at at time zone 'America/Argentina/Buenos_Aires')::date as semana, count(*) as cuentas_nuevas
  from auth.users
  group by 1
),
ia as (
  select date_trunc('week', created_at at time zone 'America/Argentina/Buenos_Aires')::date as semana,
    count(*) as juegos_con_ia,
    sum(cost_usd) as gasto_ia_usd
  from public.ai_usage
  group by 1
)
select
  s.semana,
  coalesce(p.clubes_activos, 0) as clubes_activos,
  coalesce(p.mano_a_mano_activos, 0) as mano_a_mano_activos,
  coalesce(p.partidas, 0) as partidas,
  coalesce(cl.clubes_nuevos, 0) as clubes_nuevos,
  coalesce(cu.cuentas_nuevas, 0) as cuentas_nuevas,
  coalesce(ia.juegos_con_ia, 0) as juegos_con_ia,
  coalesce(ia.gasto_ia_usd, 0) as gasto_ia_usd
from semanas s
left join partidas p using (semana)
left join clubes cl using (semana)
left join cuentas cu using (semana)
left join ia using (semana)
order by s.semana desc;

-- Los juegos más anotados. Los agregados por un club muestran el nombre que les puso el club.
create view metricas.juegos with (security_invoker = true) as
select
  p.juego,
  coalesce(max(g.data ->> 'name'), p.juego) as nombre,
  count(*) as partidas,
  count(*) filter (where p.fecha > now() - interval '30 days') as partidas_30_dias,
  count(distinct p.club_code) as clubes,
  max(p.fecha) as ultima_partida
from metricas.partidas p
left join public.entities g on g.kind = 'game' and g.club_code = p.club_code and g.id = p.juego
group by p.juego
order by partidas desc;

-- ¿Los clubes vuelven? Cada fila es la semana en que los clubes anotaron su primera partida;
-- las columnas, cuántos de ellos anotaron algo 1, 2, 3 y 4 semanas después. Vacío = esa semana
-- todavía no llegó.
create view metricas.retencion with (security_invoker = true) as
with actividad as (
  select distinct club_code, semana from metricas.partidas where tipo_club = 'group'
),
inicio as (
  select club_code, min(semana) as cohorte from actividad group by club_code
),
hoy as (
  select date_trunc('week', now() at time zone 'America/Argentina/Buenos_Aires')::date as semana
)
select
  i.cohorte as semana_de_inicio,
  count(distinct i.club_code) as clubes,
  case when i.cohorte + 7 <= (select semana from hoy)
    then count(distinct a.club_code) filter (where a.semana = i.cohorte + 7) end as semana_1,
  case when i.cohorte + 14 <= (select semana from hoy)
    then count(distinct a.club_code) filter (where a.semana = i.cohorte + 14) end as semana_2,
  case when i.cohorte + 21 <= (select semana from hoy)
    then count(distinct a.club_code) filter (where a.semana = i.cohorte + 21) end as semana_3,
  case when i.cohorte + 28 <= (select semana from hoy)
    then count(distinct a.club_code) filter (where a.semana = i.cohorte + 28) end as semana_4
from inicio i
left join actividad a using (club_code)
group by i.cohorte
order by i.cohorte desc;

revoke all on all tables in schema metricas from public, anon, authenticated;
