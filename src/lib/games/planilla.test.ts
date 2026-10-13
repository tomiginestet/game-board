import { describe, expect, it } from 'vitest'
import { autoResult, computeLive } from '../engine'
import type { LogEntry, Play } from '../types'
import { BUILTIN_GAMES } from '.'
import { correctCell, PLANILLA_KEY, planillaGrid, planillaOf, planillaRound } from './planilla'

const generala = BUILTIN_GAMES.find((g) => g.id === 'generala')!
const def = planillaOf(generala)!

type Entry = LogEntry extends infer E ? (E extends LogEntry ? Omit<E, 't'> : never) : never

const play = (log: Entry[]): Play => ({
  id: 'g1',
  gameId: 'generala',
  createdAt: 0,
  status: 'live',
  config: {},
  sides: [{ players: ['a'] }, { players: ['b'] }],
  log: log.map((e) => ({ ...e, t: 0 }) as LogEntry),
})

describe('planilla de la generala', () => {
  it('sólo la generala se anota por planilla (otros juegos con nombres de mano siguen en orden)', () => {
    expect(def).toBeDefined()
    expect(planillaOf(BUILTIN_GAMES.find((g) => g.id === 'sushigo')!)).toBeUndefined()
    expect(planillaOf(BUILTIN_GAMES.find((g) => g.id === 'skullking')!)).toBeUndefined()
  })

  it('cada lado llena la casilla que quiere; la mano suma y marca los eventos', () => {
    // Ana: escalera servida (25). Beto: tacha la generala.
    const r = planillaRound(def, [
      { cell: 6, value: 25 },
      { cell: 9, value: 0 },
    ])
    expect(r.sc).toEqual([25, 0])
    expect(r.ev?.[PLANILLA_KEY]).toEqual([6, 9])
    expect(r.ev?.servido).toEqual([1, 0])
    expect(r.ev?.tachada).toEqual([0, 1])

    const p = play([r, planillaRound(def, [{ cell: 9, value: 50 }, { cell: 0, value: 3 }])])
    const live = computeLive(generala, p)
    expect(live.scores).toEqual([75, 3])
    expect(live.roundsPlayed).toBe(2)
    expect(live.counts.generala).toEqual([1, 0])

    const grid = planillaGrid(p.log, 11, 2)
    expect(grid.value[6]).toEqual([25, null])
    expect(grid.value[9]).toEqual([50, 0])
    expect(grid.value[0]).toEqual([null, 3])
    expect(grid.at[0][1]).toBe(1)
  })

  it('las manos viejas (sin casilla) se leen en orden', () => {
    const p = play([{ k: 'round', sc: [3, 2], in: { value: [3, 2] } }, { k: 'round', sc: [8, 0], in: { value: [8, 0] } }])
    const grid = planillaGrid(p.log, 11, 2)
    expect(grid.value[0]).toEqual([3, 2])
    expect(grid.value[1]).toEqual([8, 0])
  })

  it('generala servida gana en el acto aunque el otro no haya anotado', () => {
    const p = play([planillaRound(def, [{ cell: 9, value: 50, instantWin: true }, null])])
    const live = computeLive(generala, p)
    expect(live.instantWinner).toBe(0)
    expect(live.counts.generalaServida).toEqual([1, 0])
    expect(autoResult(generala, p)?.places[0]).toBe(1)
    expect(planillaGrid(p.log, 11, 2).value[0]).toEqual([null, null])
  })

  it('termina sola al llenar las 11 casillas', () => {
    const log = Array.from({ length: 11 }, (_, c) => planillaRound(def, [{ cell: 10 - c, value: 1 }, { cell: c, value: 2 }]))
    const p = play(log)
    expect(autoResult(generala, play(log.slice(0, 10)))).toBeUndefined()
    expect(autoResult(generala, p)?.places).toEqual([2, 1])
  })

  it('corregir una casilla cambia sólo ese lado y recalcula sus eventos', () => {
    const p = play([planillaRound(def, [{ cell: 9, value: 0 }, { cell: 6, value: 25 }])])
    const log = correctCell(def, p.log, 0, 0, 9, 50)
    const live = computeLive(generala, { ...p, log })
    expect(live.scores).toEqual([50, 25])
    expect(live.counts.tachada).toEqual([0, 0])
    expect(live.counts.generala).toEqual([1, 0])
    expect(live.counts.servido).toEqual([0, 1])
    expect(planillaGrid(log, 11, 2).value[9]).toEqual([50, null])
  })
})
