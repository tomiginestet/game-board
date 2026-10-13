import { describe, expect, it } from 'vitest'
import type { LogEntry, Play } from '../types'
import { BUILTIN_GAMES } from '.'
import { hasPlanilla, planillaOf, planillaRound, planillaSummary } from './planilla'

const generala = BUILTIN_GAMES.find((g) => g.id === 'generala')!
const def = planillaOf(generala)!

type Entry = LogEntry extends infer E ? (E extends LogEntry ? Omit<E, 't'> : never) : never

const play = (log: Entry[], extra: Partial<Play> = {}): Play => ({
  id: 'g1',
  gameId: 'generala',
  createdAt: 0,
  status: 'finished',
  config: {},
  sides: [{ players: ['a'] }, { players: ['b'] }],
  log: log.map((e) => ({ ...e, t: 0 }) as LogEntry),
  ...extra,
})

describe('planilla final', () => {
  it('sólo los juegos por planilla la muestran', () => {
    expect(hasPlanilla(generala)).toBe(true)
    expect(hasPlanilla(BUILTIN_GAMES.find((g) => g.id === 'sushigo')!)).toBe(false)
    expect(planillaSummary(BUILTIN_GAMES.find((g) => g.id === 'truco')!, play([]))).toBeUndefined()
  })

  it('partida nueva: cada casilla en su fila según `_casilla`, con tachadas y libres', () => {
    const p = play(
      [
        planillaRound(def, [{ cell: 6, value: 20 }, { cell: 0, value: 3 }]),
        planillaRound(def, [{ cell: 9, value: 0 }, { cell: 9, value: 50 }]),
      ],
      { result: { places: [2, 1], scores: [20, 53] } },
    )
    const s = planillaSummary(generala, p)!
    expect(s.rows).toHaveLength(11)
    expect(s.rows[0]).toEqual({ label: '1', values: [null, 3] })
    expect(s.rows[6]).toEqual({ label: 'Escalera', values: [20, null] })
    expect(s.rows[9]).toEqual({ label: 'Generala', values: [0, 50] })
    expect(s.rows[1].values).toEqual([null, null])
    expect(s.totals).toEqual([20, 53])
    expect(s.leaders).toEqual([1])
  })

  it('partida vieja (sin casilla): las manos llenan en orden', () => {
    const p = play([
      { k: 'round', sc: [3, 2], in: { value: [3, 2] } },
      { k: 'round', sc: [8, 0], in: { value: [8, 0] } },
      { k: 'round', sc: [12, 15], in: { value: [12, 15] } },
    ])
    const s = planillaSummary(generala, p)!
    expect(s.rows.slice(0, 3).map((r) => r.values)).toEqual([
      [3, 2],
      [8, 0],
      [12, 15],
    ])
    expect(s.rows[3].values).toEqual([null, null])
    expect(s.totals).toEqual([23, 17])
    // Sin resultado guardado, la corona va al de más puntos.
    expect(s.leaders).toEqual([0])
  })

  it('generala servida: gana aunque tenga menos puntos, y los empates comparten corona', () => {
    const servida = play(
      [
        planillaRound(def, [{ cell: 6, value: 0 }, { cell: 7, value: 30 }]),
        planillaRound(def, [{ cell: 9, value: 50, instantWin: true }, null]),
      ],
      { result: { places: [1, 2] } },
    )
    expect(planillaSummary(generala, servida)!.leaders).toEqual([0])
    const empate = play([planillaRound(def, [{ cell: 0, value: 2 }, { cell: 1, value: 2 }])], { result: { places: [1, 1] } })
    expect(planillaSummary(generala, empate)!.leaders).toEqual([0, 1])
  })
})
