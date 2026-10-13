import { LockSimpleIcon, MinusIcon, PlusIcon, SkipForwardIcon } from '@phosphor-icons/react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { nextTurn, targetOf, type LiveState } from '../../lib/engine'
import { vibrate } from '../../lib/vibrate'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { LogList } from './CounterBoard'

export function TurnsBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const started = live.turnCount > 0
  const current = live.turn
  const pass = () => {
    vibrate(20)
    actions.log(play.id, { k: 'turn', s: nextTurn(play, live) })
  }
  const target = targetOf(game, play.config)
  const counts = game.events.filter((e) => e.type === 'count' && !e.global)
  const holders = game.events.filter((e) => e.type === 'holder')

  return (
    <>
      <div className="turn-banner" style={{ ['--pc' as string]: sideColor(play.sides[started ? current : 0], players) }}>
        {started ? (
          <>
            <span className="muted small">Turno {live.turnCount} · le toca a</span>
            <b className="turn-name">
              <TeamAvatar team={sidePlayersOf(play.sides[current], players)} size={34} /> {sideName(play.sides[current], players)}
            </b>
          </>
        ) : (
          <b>Empieza {sideName(play.sides[0], players)}</b>
        )}
        <button className="btn primary big" onClick={pass}>
          <SkipForwardIcon weight="fill" /> {started ? 'Pasar turno' : 'Arrancar'}
        </button>
      </div>

      {holders.length > 0 && (
        <div className="card holders">
          {holders.map((e) => {
            const h = live.holders[e.id]
            return (
              <div key={e.id} className="holder-row">
                <span className="grow">
                  {e.emoji} {e.name}
                  {e.points ? <span className="muted small"> ({e.points} pts)</span> : null}
                </span>
                <div className="chips">
                  {play.sides.map((side, i) => (
                    <button
                      key={i}
                      className={'chip' + (h === i ? ' active' : '')}
                      style={h === i ? { borderColor: sideColor(side, players) } : undefined}
                      onClick={() => actions.log(play.id, { k: 'ev', s: h === i ? -1 : i, e: e.id, n: 1 })}
                    >
                      {sidePlayersOf(side, players)[0]?.emoji} {sideName(side, players)}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="turn-sides">
        {play.sides.map((side, i) => (
          <div key={i} className={'card turn-side' + (started && i === current ? ' current' : '')} style={{ ['--pc' as string]: sideColor(side, players) }}>
            <div className="rf-head">
              <TeamAvatar team={sidePlayersOf(side, players)} size={30} />
              <b className="grow ellipsis">{sideName(side, players)}</b>
              <span className="ts-score" title="Puntos a la vista">
                {live.scores[i]}
                {target ? <span className="muted small">/{target}</span> : null}
              </span>
            </div>
            <div className="chips">
              {counts.map((e) => (
                <span key={e.id} className="ev-stepper" title={e.help}>
                  <span>
                    {e.emoji} {e.name}
                  </span>
                  <span className="stepper">
                    {/* Lo oculto no se deshabilita en 0: si no, se notaría si alguien ya tiene alguno. */}
                    <button
                      type="button"
                      onClick={() => actions.log(play.id, { k: 'ev', s: i, e: e.id, n: -1 })}
                      disabled={!e.hidden && !live.counts[e.id][i]}
                      aria-label={`Restar uno a ${e.name} (${sideName(side, players)})`}
                    >
                      <MinusIcon />
                    </button>
                    <span className="stepper-value">{e.hidden ? <LockSimpleIcon aria-label="Oculto" /> : live.counts[e.id][i]}</span>
                    <button type="button" onClick={() => actions.log(play.id, { k: 'ev', s: i, e: e.id, n: 1 })} aria-label={`Sumar uno a ${e.name} (${sideName(side, players)})`}>
                      <PlusIcon />
                    </button>
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {counts.some((e) => e.hidden) && (
        <p className="hint">
          <LockSimpleIcon className="inline-icon" /> Lo oculto no se muestra hasta el final, para no revelar estrategias.
        </p>
      )}
      <LogList play={play} game={game} players={players} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Fin de partida: puestos, puntajes, roles y datos finales.
