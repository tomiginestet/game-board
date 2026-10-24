import { ArrowsClockwiseIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TeamAvatar } from '../../components/Avatar'
import { sideName, sidePlayersOf } from '../../components/GameBits'
import { Medal } from '../../components/Medal'
import { MedalSheet } from '../../components/MedalSheet'
import { WinnerHero } from '../../components/WinnerHero'
import { isDraw, sidesByPlace, type LiveState } from '../../lib/engine'
import { toast } from '../../lib/feedback'
import { rematchConfig, rematchSides } from '../../lib/rematch'
import { findGame } from '../../lib/games'
import type { GameDef } from '../../lib/games/schema'
import { TIERS } from '../../lib/medalArt'
import { closestFirst, gameMedals, globalMedals, levelUps, medalsInReach, nextMedalHint, type MedalProgress } from '../../lib/medals'
import { computeBoard, gameStatsOf } from '../../lib/stats'
import { actions, useData } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { MedalDataCard } from './MedalDataCard'
import { PlanillaSummary } from './PlanillaSummary'
import { joinNames, stakeText } from './winnerText'
import { formatScore } from '../../lib/score'
import { setsLine } from '../../lib/sets'
import { PlayerLinesCard } from './PlayerLines'
import { mayCreateNow } from '../../lib/access'
import { say } from '../../skins/say'

/** Hasta cuánto después de terminarla se festeja como recién terminada (igual que las medallas). */
const FRESH_MS = 15 * 60 * 1000

export function Summary({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const data = useData()
  const navigate = useNavigate()
  const order = sidesByPlace(play)
  const draw = isDraw(play)
  const coop = play.result?.coopWin

  // Medallas que se ganaron con esta partida (las de este juego y las generales): comparamos el
  // historial con y sin ella. Con lo de después sale también la próxima medalla de la mesa.
  const { ups, hint, elo } = useMemo(() => {
    const before = computeBoard({ ...data, plays: data.plays.filter((p) => p.id !== play.id) })
    const after = computeBoard(data)
    const ids = play.sides.flatMap((s) => s.players)
    const out: { player: Player; medal: MedalProgress }[] = []
    for (const id of ids) {
      const p = players.get(id)
      if (!p) continue
      for (const m of levelUps(gameMedals(game, gameStatsOf(before, id, game.id)), gameMedals(game, gameStatsOf(after, id, game.id)))) out.push({ player: p, medal: m })
      const b = before.players.get(id)
      const a = after.players.get(id)
      if (a) for (const m of levelUps(b ? globalMedals(b) : [], globalMedals(a))) out.push({ player: p, medal: m })
    }
    const elo = after.eloDeltas.get(play.id)
    if (out.length) return { ups: out, hint: undefined, elo }
    // Sin medallas nuevas: la más cercana de quien ganó; si no tiene ninguna a tiro (o no hubo ganador), la de cualquiera de la mesa.
    const reachOf = (id: Id) => {
      const s = after.players.get(id)
      return s ? medalsInReach(s, (g) => findGame(data, g), { onlyGame: game.id }) : []
    }
    const near = (pool: Id[]) => closestFirst(pool.flatMap(reachOf))[0]
    const winnerIds = play.result?.coopWin === undefined ? play.sides.filter((_, i) => play.result?.places[i] === 1).flatMap((s) => s.players) : []
    const best = (winnerIds.length && !isDraw(play) ? near(winnerIds) : undefined) ?? near(ids)
    const who = best && players.get(best.playerId)
    return { ups: out, hint: best && who ? { text: nextMedalHint(who.name, best), progress: best.progress } : undefined, elo }
  }, [data, play, game, players])
  const [shownUp, setShownUp] = useState<number | null>(null)
  const shown = shownUp !== null ? ups[shownUp] : undefined
  // La misma medalla ganada por varios (un equipo) va una sola vez: "Ana y Beto".
  const medals = ups
    .map((u, k) => ({ ...u, k }))
    .filter((u, i, all) => all.findIndex((x) => x.medal.family.id === u.medal.family.id && x.medal.level === u.medal.level) === i)
    .map((u) => ({ ...u, who: ups.filter((x) => x.medal.family.id === u.medal.family.id && x.medal.level === u.medal.level).map((x) => x.player.name) }))
  // "Recién terminada" se decide al entrar: así la animación y el anuncio no se repiten al volver días después.
  const [fresh] = useState(() => !!play.finishedAt && Date.now() - play.finishedAt < FRESH_MS)

  const stake = stakeText(play, players)

  const eventSummary = game.events
    .map((e) => {
      const per = e.type === 'holder' ? play.sides.map((_, i) => (live.holders[e.id] === i ? 1 : 0)) : (live.counts[e.id] ?? [])
      return { e, per }
    })
    .filter((x) => x.per.some((v) => v > 0))

  const rematch = () => {
    // Mismos lados (los bandos por rol vuelven a ser uno por jugador), reglas y prenda, con opciones nuevas por defecto.
    if (!mayCreateNow()) return
    const p = actions.createPlay(game.id, rematchSides(play), rematchConfig(game, play), play.stake)
    navigate(`/partida/${p.id}`, { replace: true })
  }

  return (
    <div className="summary">
      <div className="card winner-card">
        <WinnerHero play={play} game={game} players={players} fresh={fresh} hint={hint} />
        <ol className="standings-list" aria-label="Posiciones">
          {order.map((i) => (
            <li key={i} className={play.result?.places[i] === 1 && !draw && coop === undefined ? 'first' : ''}>
              <span className="pick-pos">{coop !== undefined ? '' : `${play.result?.places[i]}°`}</span>
              <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={30} />
              <span className="grow ellipsis">
                {sideName(play.sides[i], players)}
              </span>
              {play.result?.scores?.[i] !== undefined && play.result.scores[i] !== null && <b className="num">{formatScore(game, play.result.scores[i]!)}</b>}
              {elo && coop === undefined && elo[i] !== undefined && (
                <span className={'elo-delta num ' + (elo[i] >= 0 ? 'up' : 'down')}>
                  {elo[i] >= 0 ? '+' : '−'}
                  {Math.abs(elo[i])} Elo
                </span>
              )}
            </li>
          ))}
        </ol>
        {live.sets && live.sets.done.length > 0 && (
          <p className="sets-final">
            <span className="muted small">Sets</span> <b className="num">{setsLine(live.sets, (play.result?.places[1] === 1 && play.result?.places[0] !== 1 ? 1 : 0))}</b>
          </p>
        )}
        {stake && (
          <p className="rs-stake">
            <span className="rs-stake-emoji" aria-hidden="true">{play.stake?.emoji ?? '🎁'}</span>
            <span>{stake}</span>
          </p>
        )}
        {/* La medalla nueva es el momento: grande, centrada, con su nombre y su chiste debajo. Si son varias, en fila. */}
        {medals.length > 0 && (
          <div className={'rs-medals' + (medals.length > 1 ? ' many' : '')} role="status">
            {medals.map(({ medal, k, who }) => (
              <button key={k} type="button" className="rs-medal" aria-haspopup="dialog" onClick={() => setShownUp(k)}>
                <Medal family={medal.family} level={medal.level} size={medals.length > 1 ? 64 : 104} />
                <span className="rs-medal-who">
                  {joinNames(who)} {medal.level === 0 ? (who.length > 1 ? 'desbloquearon' : 'desbloqueó') : `${who.length > 1 ? 'subieron' : 'subió'} a ${TIERS[medal.level].name.toLowerCase()}`}
                </span>
                <span className="rs-medal-name">{medal.family.levels[medal.level].name}</span>
                {medals.length === 1 && <span className="rs-medal-desc">{medal.family.levels[medal.level].description}</span>}
              </button>
            ))}
            {shown && (
              <MedalSheet
                family={shown.medal.family}
                level={shown.medal.level}
                mine={{ name: shown.player.name, value: shown.medal.value, level: shown.medal.level }}
                onClose={() => setShownUp(null)}
              />
            )}
          </div>
        )}
      </div>

      <div className="row">
        {play.cupId ? (
          <Link to={`/torneos/${play.cupId}`} className="btn primary grow">
            Volver al torneo
          </Link>
        ) : (
          <button className="btn primary grow" onClick={rematch}>
            <ArrowsClockwiseIcon /> Revancha
          </button>
        )}
        <button className="btn grow" onClick={() => actions.reopenPlay(play.id)}>
          Corregir
        </button>
      </div>
      {!play.cupId && (
        <Link to={`/juegos/${game.id}`} className="summary-secondary">
          Ver {game.name}
        </Link>
      )}
      {/* Después de los botones: completar los datos nunca empuja "Revancha" fuera de la primera pantalla. */}
      <PlayerLinesCard play={play} game={game} players={players} />
      <MedalDataCard play={play} game={game} players={players} />
      {/* Generala: la planilla completa queda a la vista al terminar (no rinde nada en otros juegos). */}
      <PlanillaSummary play={play} game={game} players={players} />

      {eventSummary.length > 0 && (
        <section className="card">
          <h2 className="summary-subtitle">Lo que pasó</h2>
          <div className="table-wrap">
            <table className="rounds-table">
              <thead>
                <tr>
                  <th>
                    <span className="sr-only">Evento</span>
                  </th>
                  {play.sides.map((s, i) => (
                    <th key={i} scope="col">
                      <span aria-hidden>{sidePlayersOf(s, players)[0]?.emoji}</span>
                      <span className="sr-only">{sideName(s, players)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventSummary.map(({ e, per }) => (
                  <tr key={e.id}>
                    <td className="small">{e.name}</td>
                    {play.sides.map((_, i) => (
                      <td key={i}>{e.type === 'holder' ? (per[i] ? '✔' : '') : per[i] || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!play.cupId && (
        <button
          className="link-btn danger-text small center-block"
          onClick={() => {
            // Se puede recuperar mientras dure el aviso: se borra sin preguntar y se ofrece deshacer.
            const removed = play
            if (!actions.deletePlay(play.id)) return
            navigate('/')
            toast(say('Borraste la partida.'), { label: 'Deshacer', run: () => actions.restorePlay(removed) })
          }}
        >
          <TrashIcon /> {say('Borrar partida')}
        </button>
      )}
    </div>
  )
}
