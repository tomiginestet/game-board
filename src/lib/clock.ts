// Cronómetro de los deportes que se juegan por tiempo (fútbol, básquet, hockey): períodos, pausa y minuto
// de cada jugada.

import type { GameDef, OptionValue } from './games/schema'
import type { PlayClock } from './types'

export interface ResolvedClock {
  periods: number
  /** Duración de cada período en milisegundos. */
  ms: number
  minutes: number
  periodName: 'tiempo' | 'cuarto'
}

export function clockRuleOf(game: GameDef, config: Record<string, OptionValue>): ResolvedClock | undefined {
  const rule = game.scoring.clock
  if (!rule) return undefined
  const raw = rule.minutesOption ? (config[rule.minutesOption] ?? game.options.find((o) => o.id === rule.minutesOption)?.default) : undefined
  const minutes = typeof raw === 'number' && raw > 0 ? raw : typeof raw === 'string' && +raw > 0 ? +raw : rule.minutes
  return { periods: Math.max(1, rule.periods), minutes, ms: minutes * 60_000, periodName: rule.periodName ?? 'tiempo' }
}

/** Tiempo jugado del período en curso. */
export function clockElapsed(clock: PlayClock | undefined, now = Date.now()): number {
  if (!clock) return 0
  return clock.elapsed + (clock.runningSince ? Math.max(0, now - clock.runningSince) : 0)
}

/** Minuto del partido (contando los períodos anteriores completos), como se dice en la tele: 1 a N. */
export function matchMinute(clock: PlayClock | undefined, rule: ResolvedClock, now = Date.now()): number | undefined {
  if (!clock || (!clock.runningSince && !clock.elapsed && !clock.period)) return undefined
  return clock.period * rule.minutes + Math.floor(clockElapsed(clock, now) / 60_000) + 1
}

const ORDINAL = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto']

/** "Primer tiempo", "Tercer cuarto", "Alargue". */
export function periodLabel(rule: ResolvedClock, period: number): string {
  if (period >= rule.periods) return 'Alargue'
  return `${ORDINAL[period] ?? `${period + 1}.º`} ${rule.periodName}`
}

/** "12:34" (minutos y segundos). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
