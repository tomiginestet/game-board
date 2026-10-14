import { describe, expect, it } from 'vitest'
import { callPeople, goingIds, isCall, rsvpCounts, rsvpSummary } from './calls'
import { clockElapsed, clockRuleOf, formatClock, matchMinute, periodLabel } from './clock'
import { BUILTIN_GAMES } from './games'
import type { Play, Team } from './types'

const call = (extra: Partial<Play> = {}): Play => ({
  id: 'c',
  gameId: 'futbol5',
  createdAt: 0,
  status: 'pending',
  config: {},
  sides: [],
  log: [],
  invited: ['a', 'b', 'c', 'd'],
  rsvp: { a: 'yes', b: 'no', c: 'maybe' },
  ...extra,
})

describe('convocatorias', () => {
  it('cuenta quién va, quién no y quién no respondió', () => {
    const p = call()
    expect(isCall(p)).toBe(true)
    const c = rsvpCounts(p, callPeople(p))
    expect(c).toEqual({ yes: 1, maybe: 1, no: 1, pending: 1 })
    expect(rsvpSummary(c)).toBe('1 va · 1 capaz · 1 no · 1 sin responder')
    expect(goingIds(p, callPeople(p))).toEqual(['a'])
    expect(goingIds(p, callPeople(p), true)).toEqual(['a', 'c'])
  })

  it('en un partido del fixture pregunta a los planteles de los equipos', () => {
    const team: Team = { id: 't', name: 'Los Pibes', emoji: '⚽', color: '#000', players: ['a', 'z'], createdAt: 0 }
    const p = call({ invited: undefined, sides: [{ players: ['a'], teamId: 't' }, { players: ['b'] }] })
    expect(isCall(p)).toBe(false)
    expect(callPeople(p, [team])).toEqual(['a', 'z', 'b'])
  })
})

describe('cronómetro', () => {
  const futbol5 = BUILTIN_GAMES.find((g) => g.id === 'futbol5')!
  it('toma los minutos de la opción de la partida', () => {
    expect(clockRuleOf(futbol5, { half: 30 })).toMatchObject({ periods: 2, minutes: 30, ms: 1_800_000 })
    expect(clockRuleOf(futbol5, {})?.minutes).toBe(25)
    expect(periodLabel(clockRuleOf(futbol5, {})!, 1)).toBe('Segundo tiempo')
  })

  it('suma el tramo en marcha y calcula el minuto del partido', () => {
    const rule = clockRuleOf(futbol5, {})!
    const clock = { period: 1, elapsed: 60_000, runningSince: 1000 }
    expect(clockElapsed(clock, 1000 + 30_000)).toBe(90_000)
    // Segundo tiempo, 1:30 jugados: minuto 25 + 2 = 27.
    expect(matchMinute(clock, rule, 1000 + 30_000)).toBe(27)
    expect(matchMinute(undefined, rule)).toBeUndefined()
    expect(formatClock(90_500)).toBe('1:30')
  })
})
