import { describe, expect, it } from 'vitest'
import { BUILTIN_GAMES } from './games'
import type { GameDef } from './games/schema'
import { groupingOf, joinNames, lastPlayOf, planRematch, rematchSides, setupProblem, sidesPreview, soloMax, suggestGrouping } from './rematch'
import type { Play, PlaySide } from './types'

const game = (id: string): GameDef => {
  const g = BUILTIN_GAMES.find((x) => x.id === id)
  if (!g) throw new Error(`falta ${id}`)
  return g
}
const truco = game('truco')
const escoba = game('escoba')
const catan = game('catan')
const impostor = game('impostor')

let n = 0
const play = (over: Partial<Play> & Pick<Play, 'sides'>): Play => ({
  id: `play${++n}`,
  gameId: 'truco',
  createdAt: 1000 + n,
  status: 'finished',
  config: {},
  log: [],
  ...over,
})
const solo = (...ids: string[]): PlaySide[] => ids.map((id) => ({ players: [id] }))
const ALL = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']

describe('lastPlayOf', () => {
  it('toma la última jugada de ese juego e ignora las pendientes y las de otros juegos', () => {
    const old = play({ sides: solo('p1', 'p2'), finishedAt: 10 })
    const recent = play({ sides: solo('p3', 'p4'), finishedAt: 20 })
    const pending = play({ sides: solo('p5', 'p6'), status: 'pending', createdAt: 99 })
    const other = play({ sides: solo('p1', 'p2'), gameId: 'catan', finishedAt: 50 })
    expect(lastPlayOf([old, recent, pending, other], 'truco')?.id).toBe(recent.id)
    expect(lastPlayOf([other], 'truco')).toBeUndefined()
  })
})

describe('agrupamiento', () => {
  it('el truco de a uno es mano a mano; escoba admite hasta 4 solos', () => {
    expect(soloMax(truco)).toBe(2)
    expect(soloMax(escoba)).toBe(4)
  })

  it('reconoce si la última partida fue por equipos', () => {
    expect(groupingOf(truco, play({ sides: [{ players: ['p1', 'p2'] }, { players: ['p3', 'p4'] }] }))).toBe('teams')
    expect(groupingOf(truco, play({ sides: solo('p1', 'p2') }))).toBe('solo')
    expect(groupingOf(truco)).toBe('solo')
    expect(groupingOf(catan)).toBe('solo')
  })

  it('con 4 o 6 en el truco sugiere equipos; con 2 o 3 deja lo que venía', () => {
    expect(suggestGrouping(truco, 4, 'solo')).toBe('teams')
    expect(suggestGrouping(truco, 6, 'solo')).toBe('teams')
    expect(suggestGrouping(truco, 2, 'solo')).toBe('solo')
    expect(suggestGrouping(truco, 3, 'solo')).toBe('solo')
    expect(suggestGrouping(escoba, 4, 'solo')).toBe('solo')
  })
})

describe('setupProblem', () => {
  it('no deja arrancar un truco de a 4 cada uno solo', () => {
    expect(setupProblem(truco, 'solo', solo('p1', 'p2', 'p3', 'p4'))).toMatch(/Por equipos/)
    expect(setupProblem(truco, 'solo', solo('p1', 'p2'))).toBeUndefined()
  })

  it('pide equipos parejos en el truco', () => {
    expect(setupProblem(truco, 'teams', [{ players: ['p1', 'p2'] }, { players: ['p3', 'p4'] }])).toBeUndefined()
    expect(setupProblem(truco, 'teams', [{ players: ['p1', 'p2', 'p3'] }, { players: ['p4', 'p5', 'p6'] }])).toBeUndefined()
    expect(setupProblem(truco, 'teams', [{ players: ['p1', 'p2', 'p3'] }, { players: ['p4'] }])).toBe('Armá equipos parejos')
    expect(setupProblem(truco, 'teams', [{ players: ['p1', 'p2', 'p3', 'p4'] }])).toMatch(/al menos 2 equipos/)
  })

  it('en los de equipos, cada equipo llega al mínimo', () => {
    const codigo = game('codigosecreto')
    expect(setupProblem(codigo, 'teams', [{ players: ['p1', 'p2', 'p3', 'p4'] }, { players: ['p5', 'p6', 'p7', 'p8'] }])).toBeUndefined()
    expect(setupProblem(codigo, 'teams', [{ players: ['p1', 'p2', 'p3'] }, { players: ['p4'] }])).toBe('Armá equipos de al menos 2 jugadores')
  })

  it('pide el mínimo de jugadores del juego', () => {
    expect(setupProblem(catan, 'solo', solo('p1', 'p2'))).toBe('Elegí al menos 3 jugadores')
    expect(setupProblem(catan, 'solo', solo('p1', 'p2', 'p3'))).toBeUndefined()
  })
})

describe('textos', () => {
  it('arma la vista previa de los lados', () => {
    const name = (id: string) => ({ p1: 'Ana', p2: 'Beto', p3: 'Caro', p4: 'Dani' })[id] ?? '?'
    expect(sidesPreview([{ players: ['p1', 'p2'] }, { players: ['p3', 'p4'] }], 'teams', name)).toBe('Ana & Beto vs Caro & Dani')
    expect(sidesPreview(solo('p1', 'p2', 'p3'), 'solo', name)).toBe('Ana · Beto · Caro')
    expect(sidesPreview(solo('p1', 'p2'), 'solo', name)).toBe('Ana vs Beto')
    expect(sidesPreview([{ players: ['p1', 'p2', 'p3'] }], 'coop', name)).toBe('Ana, Beto y Caro')
  })

  it('une nombres con "y"', () => {
    expect(joinNames([])).toBe('')
    expect(joinNames(['Ana'])).toBe('Ana')
    expect(joinNames(['Ana', 'Beto', 'Caro', 'Dani'])).toBe('Ana, Beto, Caro y Dani')
  })
})

describe('revancha', () => {
  const twoVsTwo = play({ sides: [{ players: ['p1', 'p2'], name: 'Los del fondo' }, { players: ['p3', 'p4'] }], config: { target: 15 }, result: { places: [1, 2] }, finishedAt: 500 })

  it('repite equipos (con nombre) y reglas, completando las opciones que falten', () => {
    const plan = planRematch(truco, [twoVsTwo], ALL)
    expect(plan?.sides).toEqual([{ players: ['p1', 'p2'], name: 'Los del fondo' }, { players: ['p3', 'p4'] }])
    expect(plan?.config).toEqual({ target: 15, flor: false })
    expect(plan?.playerIds).toEqual(['p1', 'p2', 'p3', 'p4'])
  })

  it('sin partida previa o con jugadores borrados, pasa por el armado', () => {
    expect(planRematch(truco, [], ALL)).toBeUndefined()
    expect(planRematch(truco, [twoVsTwo], ['p1', 'p2', 'p3'])).toBeUndefined()
  })

  it('no repite un armado inválido (un truco viejo de a 4 cada uno solo)', () => {
    expect(planRematch(truco, [play({ sides: solo('p1', 'p2', 'p3', 'p4'), finishedAt: 600 })], ALL)).toBeUndefined()
  })

  it('saca los roles: los bandos del impostor vuelven a ser cada uno solo', () => {
    const roles = play({
      gameId: 'impostor',
      sides: [
        { players: ['p1'], name: 'Impostor', role: 'Impostor' },
        { players: ['p2', 'p3', 'p4'], name: 'Tripulante', role: 'Tripulante' },
      ],
      finishedAt: 700,
    })
    expect(rematchSides(roles)).toEqual(solo('p1', 'p2', 'p3', 'p4'))
    expect(planRematch(impostor, [roles], ALL)?.sides).toEqual(solo('p1', 'p2', 'p3', 'p4'))
  })
})
