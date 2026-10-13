import { ArrowsClockwiseIcon, ConfettiIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TeamAvatar } from '../../components/Avatar'
import { sideName, sidePlayersOf } from '../../components/GameBits'
import { Medal } from '../../components/Medal'
import { MedalCelebration } from '../../components/MedalCelebration'
import { MedalSheet } from '../../components/MedalSheet'
import { isDraw, sidesByPlace, type LiveState } from '../../lib/engine'
import { toast } from '../../lib/feedback'
import type { GameDef } from '../../lib/games/schema'
import { TIERS } from '../../lib/medalArt'
import { gameMedals, levelUps, type MedalProgress } from '../../lib/medals'
import { computeBoard, gameStatsOf } from '../../lib/stats'
import { actions, useData } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'

export function Summary({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const data = useData()
  const navigate = useNavigate()
  const order = sidesByPlace(play)
  const draw = isDraw(play)
  const coop = play.result?.coopWin

  // Medallas que se ganaron con esta partida: comparamos el historial con y sin ella.
  const ups = useMemo(() => {
    const before = computeBoard({ ...data, plays: data.plays.filter((p) => p.id !== play.id) }, { gameId: game.id })
    const after = computeBoard(data, { gameId: game.id })
    const out: { player: Player; medal: MedalProgress }[] = []
    for (const id of play.sides.flatMap((s) => s.players)) {
      const p = players.get(id)
      if (!p) continue
      const b = gameMedals(game, gameStatsOf(before, id, game.id))
      const a = gameMedals(game, gameStatsOf(after, id, game.id))
      for (const m of levelUps(b, a)) out.push({ player: p, medal: m })
    }
    return out
  }, [data, play, game, players])
  const [shownUp, setShownUp] = useState<number | null>(null)
  const shown = shownUp !== null ? ups[shownUp] : undefined
  const fresh = useMemo(() => ups.map(({ player, medal }) => ({ who: player.name, family: medal.family, level: medal.level, value: medal.value })), [ups])

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
      <div className="card summary-hero">
        {coop !== undefined ? (
          <h2>{coop ? '🎉 ¡Ganaron todos!' : '😵 Perdieron contra el juego'}</h2>
        ) : draw ? (
          <h2>🤝 Empate</h2>
        ) : (
          <h2>🏆 {sideName(play.sides[order[0]], players)}</h2>
        )}
        <ol className="standings-list">
          {order.map((i) => (
            <li key={i} className={play.result?.places[i] === 1 && !draw && coop === undefined ? 'first' : ''}>
              <span className="pick-pos">{coop !== undefined ? '' : `${play.result?.places[i]}°`}</span>
              <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={30} />
              <span className="grow ellipsis">
                {sideName(play.sides[i], players)}
              </span>
              {play.result?.scores?.[i] !== undefined && play.result.scores[i] !== null && <b>{play.result.scores[i]}</b>}
            </li>
          ))}
        </ol>
      </div>

      <MedalCelebration id={play.id} finishedAt={play.finishedAt} medals={fresh} />
      {ups.length > 0 && (
        <section className="card new-achievements">
          <h3>
            <ConfettiIcon className="inline-icon" /> ¡Medallas nuevas!
          </h3>
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
          <h3>Lo que pasó</h3>
          <div className="table-wrap">
            <table className="rounds-table">
              <thead>
                <tr>
                  <th />
                  {play.sides.map((s, i) => (
                    <th key={i}>{sidePlayersOf(s, players)[0]?.emoji}</th>
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

      <div className="row">
        {!play.cupId && (
          <button className="btn primary grow" onClick={rematch}>
            <ArrowsClockwiseIcon /> Revancha
          </button>
        )}
        <button className="btn grow" onClick={() => actions.reopenPlay(play.id)}>
          Corregir
        </button>
      </div>
      {play.cupId ? (
        <Link to={`/torneos/${play.cupId}`} className="btn block mt">
          Volver al torneo
        </Link>
      ) : (
        <Link to={`/juegos/${game.id}`} className="btn block mt">
          Ver {game.name}
        </Link>
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
