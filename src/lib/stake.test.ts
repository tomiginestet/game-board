import { describe, expect, it } from 'vitest'
import { cleanStake, stakeLine, stakePreview, stakeSides, STAKE_MAX } from './stake'
import type { Play, PlaySide, PlayStake } from './types'

const ronda: PlayStake = { text: 'pagar la próxima ronda', emoji: '🍺', who: 'loser' }
const musica: PlayStake = { text: 'elegir la música', who: 'winner' }

const solo = (...ids: string[]): PlaySide[] => ids.map((id) => ({ players: [id] }))
const play = (sides: PlaySide[], places: number[] | undefined, stake: PlayStake | undefined = ronda, over: Partial<Play> = {}): Play => ({
  id: 'x',
  gameId: 'truco',
  createdAt: 1,
  status: places ? 'finished' : 'live',
  config: {},
  log: [],
  sides,
  ...(places ? { result: { places } } : {}),
  ...(stake ? { stake } : {}),
  ...over,
})
const names: Record<string, string> = { a: 'Ana', b: 'Beto', c: 'Caro', d: 'Dani' }
const namesOf = (s: PlaySide) => (s.name ? [s.name] : s.players.map((id) => names[id]))

describe('stakeSides', () => {
  it('mano a mano: le toca al que pierde, o al que gana si es un premio', () => {
    expect(stakeSides(play(solo('a', 'b'), [1, 2]))).toEqual([1])
    expect(stakeSides(play(solo('a', 'b'), [1, 2], musica))).toEqual([0])
  })

  it('entre varios: al último, y si empatan el último, a los dos', () => {
    expect(stakeSides(play(solo('a', 'b', 'c'), [2, 1, 3]))).toEqual([2])
    expect(stakeSides(play(solo('a', 'b', 'c'), [1, 2, 2]))).toEqual([1, 2])
  })

  it('empate entre todos, sin terminar, sin prenda o cooperativo: no le toca a nadie', () => {
    expect(stakeSides(play(solo('a', 'b'), [1, 1]))).toBe('draw')
    expect(stakeSides(play(solo('a', 'b'), undefined))).toBeUndefined()
    expect(stakeSides(play(solo('a', 'b'), [1, 2], null as unknown as undefined))).toBeUndefined()
    expect(stakeSides(play([{ players: ['a', 'b'] }], [1], ronda, { result: { places: [1], coopWin: false } }))).toBeUndefined()
  })
})

describe('stakeLine', () => {
  it('dice a quién le toca, en singular o en plural', () => {
    expect(stakeLine(play(solo('a', 'b'), [1, 2]), namesOf)).toBe('Le toca a Beto pagar la próxima ronda.')
    expect(stakeLine(play(solo('a', 'b', 'c'), [1, 2, 2]), namesOf)).toBe('Les toca a Beto y Caro pagar la próxima ronda.')
    expect(stakeLine(play([{ players: ['a', 'b'] }, { players: ['c', 'd'] }], [2, 1]), namesOf)).toBe('Les toca a Ana y Beto pagar la próxima ronda.')
    expect(stakeLine(play([{ players: ['a', 'b'], name: 'Los del fondo' }, { players: ['c', 'd'] }], [2, 1]), namesOf)).toBe(
      'Les toca a Los del fondo pagar la próxima ronda.',
    )
  })

  it('con empate, queda para la revancha', () => {
    expect(stakeLine(play(solo('a', 'b'), [1, 1]), namesOf)).toBe('Empate: lo de pagar la próxima ronda queda para la revancha.')
  })
})

describe('stakePreview', () => {
  it('antes del resultado: "el que pierde" entre dos, "el último" entre más', () => {
    expect(stakePreview(play(solo('a', 'b'), undefined))).toBe('El que pierde: pagar la próxima ronda')
    expect(stakePreview(play(solo('a', 'b', 'c'), undefined))).toBe('El último: pagar la próxima ronda')
    expect(stakePreview(play(solo('a', 'b'), undefined, musica))).toBe('El que gana: elegir la música')
  })
})

describe('cleanStake', () => {
  it('saca espacios de más, corta lo larguísimo y descarta lo vacío', () => {
    expect(cleanStake({ text: '  lavar   el auto ', who: 'loser' })).toEqual({ text: 'lavar el auto', who: 'loser' })
    expect(cleanStake({ text: 'x'.repeat(100), who: 'loser' })?.text).toHaveLength(STAKE_MAX)
    expect(cleanStake({ text: 'Lavar el auto.', who: 'loser' })?.text).toBe('lavar el auto')
    expect(cleanStake({ text: 'DJ toda la noche', who: 'winner' })?.text).toBe('DJ toda la noche')
    expect(cleanStake({ text: '   ', who: 'loser' })).toBeUndefined()
    expect(cleanStake(undefined)).toBeUndefined()
  })
})
