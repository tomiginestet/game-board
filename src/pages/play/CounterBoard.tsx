import { useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { Tally } from '../../components/Tally'
import { targetOf, type LiveState } from '../../lib/engine'
import { vibrate } from '../../lib/vibrate'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { PointsDialog } from './shared'

export function CounterBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const target = targetOf(game, play.config)
  const quick = game.scoring.quick?.length ? game.scoring.quick : [1]
  // Los eventos de flor sólo aparecen si se juega con flor.
  const events = game.events.filter((e) => !e.global && !(e.id.toLowerCase().includes('flor') && play.config.flor === false))
  const globals = game.events.filter((e) => e.global)
  const two = play.sides.length === 2
  const leader = Math.max(...live.scores)
  const [asking, setAsking] = useState<{ s: number; e: EventDef; suggestion?: number } | null>(null)

  const tap = (s: number, e?: EventDef) => {
    vibrate()
    if (!e) return actions.log(play.id, { k: 'pt', s, n: quick[0] })
    if (e.type === 'holder') return actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
    if (e.askPoints) {
      const suggestion = target !== undefined ? Math.max(1, target - leader) : undefined
      return setAsking({ s, e, suggestion: e.id.toLowerCase().includes('falta') ? suggestion : undefined })
    }
    actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
  }

  return (
    <>
      {asking && (
        <PointsDialog
          event={asking.e}
          suggestion={asking.suggestion}
          onCancel={() => setAsking(null)}
          onSubmit={(p) => {
            actions.log(play.id, { k: 'ev', s: asking.s, e: asking.e.id, n: 1, p })
            setAsking(null)
          }}
        />
      )}
      <div className={'counter-board' + (two ? ' two' : '')}>
        {play.sides.map((side, s) => {
          const color = sideColor(side, players)
          const malas = game.scoring.tally === 'matches' && target && target >= 20 ? target / 2 : undefined
          return (
            <div key={s} className="counter-side" style={{ ['--pc' as string]: color }}>
              <button className="counter-main" onPointerDown={(e) => e.button === 0 && tap(s)} onContextMenu={(e) => e.preventDefault()}>
                <span className="cs-name">
                  <TeamAvatar team={sidePlayersOf(side, players)} size={28} /> {sideName(side, players)}
                </span>
                <span key={live.scores[s]} className="cs-score">
                  {live.scores[s]}
                </span>
                {malas !== undefined && <span className="cs-sub">{live.scores[s] < malas ? 'en las malas' : 'en las buenas'}</span>}
                {game.scoring.tally === 'matches' && <Tally value={live.scores[s]} target={target ?? 30} />}
                <span className="cs-hint">
                  +{quick[0]} {game.scoring.quickLabel ?? ''}
                </span>
              </button>
              {(events.length > 0 || quick.length > 1) && (
                <div className="cs-events">
                  {quick.slice(1).map((n) => (
                    <button key={n} className="chip" onClick={() => actions.log(play.id, { k: 'pt', s, n })}>
                      +{n}
                    </button>
                  ))}
                  {events.map((e) => (
                    <button key={e.id} className="chip" onClick={() => tap(s, e)} title={e.help}>
                      {e.emoji} {e.name}
                      {e.points && !e.askPoints ? <span className="muted"> +{e.points}</span> : null}
                      {live.counts[e.id]?.[s] ? <b className="chip-count">{live.counts[e.id][s]}</b> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {globals.length > 0 && (
        <div className="chips center">
          {globals.map((e) => (
            <button key={e.id} className="chip" onClick={() => actions.log(play.id, { k: 'ev', s: -1, e: e.id, n: 1 })} title={e.help}>
              {e.emoji} {e.name} {live.globalCounts[e.id] ? <b className="chip-count">{live.globalCounts[e.id]}</b> : null}
            </button>
          ))}
        </div>
      )}
      <LogList play={play} game={game} players={players} />
    </>
  )
}

/** Últimas cosas anotadas (para saber qué se deshace). */
export function LogList({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const items = play.log.slice(-6).reverse()
  if (!items.length) return null
  const label = (i: number) => (i < 0 ? 'Mesa' : sideName(play.sides[i], players))
  return (
    <details className="log-list">
      <summary className="muted small">Lo último anotado</summary>
      <ul>
        {items.map((e, k) => {
          let text = ''
          if (e.k === 'pt') text = `${label(e.s)} +${e.n}`
          else if (e.k === 'ev') {
            const def = game.events.find((x) => x.id === e.e)
            text = `${def?.emoji ?? ''} ${def?.name ?? e.e}: ${label(e.s)}${e.p !== undefined ? ` (+${e.p})` : ''}${e.n < 0 ? ' (−1)' : ''}`
          } else if (e.k === 'turn') text = `Turno de ${label(e.s)}`
          else text = `Mano: ${e.sc.join(' / ')}`
          return <li key={k}>{text}</li>
        })}
      </ul>
    </details>
  )
}

// ---------------------------------------------------------------------------
// Por manos
