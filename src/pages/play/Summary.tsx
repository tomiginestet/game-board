import { ArrowsClockwiseIcon, ConfettiIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TeamAvatar } from '../../components/Avatar'
import { sideName, sidePlayersOf } from '../../components/GameBits'
import { Medal } from '../../components/Medal'
import { MedalCelebration } from '../../components/MedalCelebration'
import { MedalSheet } from '../../components/MedalSheet'
import { WinnerHero } from '../../components/WinnerHero'
import { isDraw, sidesByPlace, type LiveState } from '../../lib/engine'
import { toast } from '../../lib/feedback'
import { findGame } from '../../lib/games'
import type { GameDef } from '../../lib/games/schema'
import { TIERS } from '../../lib/medalArt'
import { closestFirst, gameMedals, globalMedals, levelUps, medalsInReach, nextMedalHint, type MedalProgress } from '../../lib/medals'
import { computeBoard, gameStatsOf } from '../../lib/stats'
import { actions, useData } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'

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
  const { ups, hint } = useMemo(() => {
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
    if (out.length) return { ups: out, hint: undefined }
    // Sin medallas nuevas: la más cercana de quien ganó; si no tiene ninguna a tiro (o no hubo ganador), la de cualquiera de la mesa.
    const reachOf = (id: Id) => {
      const s = after.players.get(id)
      return s ? medalsInReach(s, (g) => findGame(data, g), { onlyGame: game.id }) : []
    }
    const near = (pool: Id[]) => closestFirst(pool.flatMap(reachOf))[0]
    const winnerIds = play.result?.coopWin === undefined ? play.sides.filter((_, i) => play.result?.places[i] === 1).flatMap((s) => s.players) : []
    const best = (winnerIds.length && !isDraw(play) ? near(winnerIds) : undefined) ?? near(ids)
    const who = best && players.get(best.playerId)
    return { ups: out, hint: best && who ? { text: nextMedalHint(who.name, best), progress: best.progress } : undefined }
  }, [data, play, game, players])
  const [shownUp, setShownUp] = useState<number | null>(null)
  const shown = shownUp !== null ? ups[shownUp] : undefined
  const newMedals = useMemo(() => ups.map(({ player, medal }) => ({ who: player.name, family: medal.family, level: medal.level, value: medal.value })), [ups])
  const [celebrate, setCelebrate] = useState(0)
  // "Recién terminada" se decide al entrar: así la animación y el anuncio no se repiten al volver días después.
  const [fresh] = useState(() => !!play.finishedAt && Date.now() - play.finishedAt < FRESH_MS)

  const eventSummary = game.events
    .map((e) => {
      const per = e.type === 'holder' ? play.sides.map((_, i) => (live.holders[e.id] === i ? 1 : 0)) : (live.counts[e.id] ?? [])
      return { e, per }
    })
    .filter((x) => x.per.some((v) => v > 0))

  const rematch = () => {
    const p = actions.createPlay(game.id, play.sides.map((s) => ({ players: s.players, ...(s.name && !s.role ? { name: s.name } : {}) })), play.config)
    navigate(`/partida/${p.id}`, { replace: true })
  }

  return (
    <div className="summary">
      <div className="card winner-card">
        <WinnerHero play={play} game={game} players={players} fresh={fresh} newMedals={ups.length} onShowMedals={() => setCelebrate((n) => n + 1)} hint={hint} />
        <ol className="standings-list" aria-label="Posiciones">
          {order.map((i) => (
            <li key={i} className={play.result?.places[i] === 1 && !draw && coop === undefined ? 'first' : ''}>
              <span className="pick-pos">{coop !== undefined ? '' : `${play.result?.places[i]}°`}</span>
              <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={30} />
              <span className="grow ellipsis">
                {sideName(play.sides[i], players)}
              </span>
              {play.result?.scores?.[i] !== undefined && play.result.scores[i] !== null && <b className="num">{play.result.scores[i]}</b>}
            </li>
          ))}
        </ol>
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

      <MedalCelebration id={play.id} finishedAt={play.finishedAt} medals={newMedals} delay={2000} requested={celebrate} />
      {ups.length > 0 && (
        <section className="card new-achievements">
          <h2 className="summary-subtitle">
            <ConfettiIcon className="inline-icon" /> ¡Medallas nuevas!
          </h2>
          {ups.map(({ player, medal }, k) => (
            <button key={k} type="button" className="medal-up" aria-haspopup="dialog" onClick={() => setShownUp(k)}>
              <Medal family={medal.family} level={medal.level} size={56} />
              <div>
                <b>{medal.family.levels[medal.level].name}</b>
                <span className="muted small block">
                  {player.name} · {medal.family.name} · {TIERS[medal.level].name}
                </span>
                <span className="small">{medal.family.levels[medal.level].description}</span>
              </div>
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
        </section>
      )}

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
                    <td className="small">
                      {e.emoji} {e.name}
                    </td>
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
            actions.deletePlay(play.id)
            navigate('/')
            toast('Borraste la partida.', { label: 'Deshacer', run: () => actions.restorePlay(removed) })
          }}
        >
          <TrashIcon /> Borrar partida
        </button>
      )}
    </div>
  )
}
