import { ArrowCounterClockwiseIcon, PauseIcon, PlayIcon, SkipForwardIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { clockElapsed, clockRuleOf, formatClock, periodLabel } from '../../lib/clock'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Play } from '../../lib/types'
import { vibrate } from '../../lib/vibrate'

/**
 * Cronómetro de los deportes por tiempo: período en curso, minutos jugados de los que tiene y pausa.
 * Al cumplirse el tiempo avisa (vibra y se pinta) pero sigue contando el agregado: el final lo decide la cancha.
 */
export function ClockBar({ play, game }: { play: Play; game: GameDef }) {
  const rule = clockRuleOf(game, play.config)
  const clock = play.clock
  const running = !!clock?.runningSince
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [running])
  const elapsed = clockElapsed(clock, running ? now : undefined)
  const over = !!rule && elapsed >= rule.ms
  // Avisa una sola vez por período, cuando se cumple el tiempo con el reloj andando.
  const warned = useRef<number | null>(null)
  useEffect(() => {
    if (over && running && warned.current !== (clock?.period ?? 0)) {
      warned.current = clock?.period ?? 0
      vibrate(400)
    }
  }, [over, running, clock?.period])
  if (!rule) return null
  const period = clock?.period ?? 0
  const last = period >= rule.periods - 1
  const started = !!clock && (running || elapsed > 0 || period > 0)

  return (
    <div className={'clock-bar' + (over ? ' over' : '') + (running ? ' running' : '')} role="group" aria-label="Cronómetro">
      <div className="clock-read">
        <span className="clock-period">{periodLabel(rule, period)}</span>
        <span className="clock-time num" aria-live="off">
          {over ? formatClock(rule.ms) : formatClock(elapsed)}
          {over && <small className="clock-extra"> +{formatClock(elapsed - rule.ms)}</small>}
          <small className="muted"> de {rule.minutes}:00</small>
        </span>
        {over && (
          <span className="clock-done" role="status">
            {last ? '¡Se cumplió el tiempo!' : `¡Terminó el ${periodLabel(rule, period).toLowerCase()}!`}
          </span>
        )}
      </div>
      <div className="clock-actions">
        <button type="button" className={'btn' + (running ? '' : ' primary')} onClick={() => (vibrate(), actions.toggleClock(play.id))}>
          {running ? <PauseIcon weight="fill" aria-hidden="true" /> : <PlayIcon weight="fill" aria-hidden="true" />} {running ? 'Pausar' : started ? 'Seguir' : 'Arrancar'}
        </button>
        {started && !last && (
          <button type="button" className="btn" onClick={() => actions.nextPeriod(play.id)}>
            <SkipForwardIcon aria-hidden="true" /> {periodLabel(rule, period + 1)}
          </button>
        )}
        {started && !running && elapsed > 0 && (
          <button type="button" className="icon-btn" onClick={() => actions.resetClock(play.id)} aria-label="Volver el reloj a cero" title="Volver el reloj a cero">
            <ArrowCounterClockwiseIcon />
          </button>
        )}
      </div>
    </div>
  )
}
