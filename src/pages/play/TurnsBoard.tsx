import { LockSimpleIcon, MinusIcon, PlusIcon, SkipForwardIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { nextTurn, targetOf, type LiveState } from '../../lib/engine'
import { vibrate } from '../../lib/vibrate'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { LogList } from './CounterBoard'
import { MiniScore } from './MiniScore'
import { usePlayToggle, useReducedMotion } from './playHooks'
import { KeyHint } from './KeyHint'
import { HelpToggle } from './shared'
import { undoLast, useScoreKeys } from './useScoreKeys'

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
  const [help, setHelp] = usePlayToggle(`help:${game.id}`)
  const anyHelp = game.events.some((e) => e.help && !e.global)
  const reduce = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  // Teclado (en la compu): N o Enter pasa el turno (igual que el botón); Z o Backspace deshace.
  useScoreKeys(play.status !== 'finished', (key) => {
    if (key === 'n' || key === 'enter') return (pass(), true)
    if (key === 'z' || key === 'backspace') return undoLast(play, game, players)
    return false
  })

  // Las tarjetas quedan siempre en el orden de la ronda (nada cambia de lugar); al pasar el turno,
  // la del que juega se acomoda a la vista, entre la franja fija de arriba y la barra de abajo.
  const seenTurn = useRef(live.turnCount)
  useEffect(() => {
    if (live.turnCount === seenTurn.current) return
    seenTurn.current = live.turnCount
    const card = cardRefs.current[current]
    if (!card || !live.turnCount) return
    const top = (barRef.current?.getBoundingClientRect().bottom ?? 0) + 8
    const dock = document.querySelector('.play-dock')
    const bottom = (dock ? dock.getBoundingClientRect().top : window.innerHeight) - 8
    const r = card.getBoundingClientRect()
    const delta = r.top < top || r.height > bottom - top ? r.top - top : r.bottom > bottom ? r.bottom - bottom : 0
    if (delta) window.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
  }, [live.turnCount, current, reduce])

  return (
    <>
      <div ref={barRef} className="turn-bar">
        <MiniScore play={play} players={players} totals={live.scores} suffix={target ? `/${target}` : undefined} current={started ? current : undefined}>
          <div className="turn-banner" style={{ ['--pc' as string]: sideColor(play.sides[started ? current : 0], players) }}>
            <span className="turn-who" aria-live="polite">
              {started ? (
                <>
                  <span className="muted small block">Turno {live.turnCount} · le toca a</span>
                  <b className="turn-name ellipsis">{sideName(play.sides[current], players)}</b>
                </>
              ) : (
                <b className="turn-name ellipsis">Empieza {sideName(play.sides[0], players)}</b>
              )}
            </span>
            <button className="btn primary turn-pass" onClick={pass} aria-keyshortcuts="N Enter">
              <SkipForwardIcon weight="fill" aria-hidden="true" /> {started ? 'Pasar turno' : 'Arrancar'}
            </button>
          </div>
        </MiniScore>
      </div>

      <div className="turn-sides">
        {play.sides.map((side, i) => {
          const isCurrent = started && i === current
          return (
            <section
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className={'card turn-side' + (isCurrent ? ' current' : '')}
              style={{ ['--pc' as string]: sideColor(side, players) }}
              aria-label={sideName(side, players) + (isCurrent ? ' (le toca)' : '')}
            >
              <div className="rf-head">
                <TeamAvatar team={sidePlayersOf(side, players)} size={30} />
                <b className="grow ellipsis">{sideName(side, players)}</b>
                {isCurrent && <span className="turn-now">Le toca</span>}
                <span className="ts-score">
                  {live.scores[i]}
                  {target ? <span className="muted small">/{target}</span> : null}
                  <span className="sr-only"> puntos a la vista</span>
                </span>
              </div>
              <ul className="ev-rows">
                {counts.map((e) => (
                  <li key={e.id} className="ev-row">
                    <span className="ev-row-label">
                      <span>
                        <span aria-hidden="true">{e.emoji}</span> {e.name}
                      </span>
                      {help && e.help && <span className="ev-row-help">{e.help}</span>}
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
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <KeyHint
        items={[
          { keys: ['N', 'Enter'], label: started ? 'pasa el turno' : 'arranca' },
          { keys: ['Z'], label: 'deshace' },
        ]}
      />

      {anyHelp && (
        <div className="board-tools">
          <HelpToggle on={help} onChange={setHelp} />
        </div>
      )}

      {holders.length > 0 && (
        <div className="card holders">
          {holders.map((e) => {
            const h = live.holders[e.id]
            return (
              <div key={e.id} className="holder-row">
                <span className="grow">
                  <span aria-hidden="true">{e.emoji}</span> {e.name}
                  {e.points ? <span className="muted small"> ({e.points} pts)</span> : null}
                  {help && e.help && <span className="ev-row-help">{e.help}</span>}
                </span>
                <div className="holder-chips" role="group" aria-label={e.name}>
                  {play.sides.map((side, i) => (
                    <button
                      key={i}
                      className={'chip' + (h === i ? ' active' : '')}
                      style={h === i ? { borderColor: sideColor(side, players) } : undefined}
                      onClick={() => actions.log(play.id, { k: 'ev', s: h === i ? -1 : i, e: e.id, n: 1 })}
                      aria-pressed={h === i}
                    >
                      <span aria-hidden="true">{sidePlayersOf(side, players)[0]?.emoji}</span> {sideName(side, players)}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
