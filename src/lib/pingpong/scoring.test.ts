import { describe, expect, it } from 'vitest'
import { computeMatch, formatElapsed, gameStartedAt, gameWinner, serverFor } from './scoring'
import type { MatchConfig, Side } from './types'

const cfg = (over: Partial<MatchConfig> = {}): MatchConfig => ({ pointsToWin: 11, winByTwo: true, bestOf: 3, serveEvery: 2, ...over })
const pts = (s: string) => s.split('') as Side[]
const repeat = (s: Side, n: number) => new Array<Side>(n).fill(s)

describe('gameWinner', () => {
  it('requiere llegar al objetivo', () => {
    expect(gameWinner(10, 5, cfg())).toBeUndefined()
    expect(gameWinner(11, 5, cfg())).toBe('a')
  })
  it('requiere diferencia de 2 si está activado', () => {
    expect(gameWinner(11, 10, cfg())).toBeUndefined()
    expect(gameWinner(12, 10, cfg())).toBe('a')
    expect(gameWinner(11, 10, cfg({ winByTwo: false }))).toBe('a')
  })
  it('funciona con objetivos chicos', () => {
    expect(gameWinner(2, 0, cfg({ pointsToWin: 2 }))).toBe('a')
    expect(gameWinner(0, 1, cfg({ pointsToWin: 1, winByTwo: false }))).toBe('b')
  })
})

describe('serverFor', () => {
  it('rota cada 2 saques', () => {
    const c = cfg()
    expect(serverFor(0, 0, c, 'a')).toBe('a')
    expect(serverFor(1, 0, c, 'a')).toBe('a')
    expect(serverFor(1, 1, c, 'a')).toBe('b')
    expect(serverFor(2, 1, c, 'a')).toBe('b')
    expect(serverFor(2, 2, c, 'a')).toBe('a')
  })
  it('alterna cada punto en deuce', () => {
    const c = cfg()
    const at1010 = serverFor(10, 10, c, 'a')
    expect(serverFor(11, 10, c, 'a')).not.toBe(at1010)
    expect(serverFor(11, 11, c, 'a')).toBe(at1010)
  })
  it('rota cada 5 a 21', () => {
    const c = cfg({ pointsToWin: 21, serveEvery: 5 })
    expect(serverFor(4, 0, c, 'b')).toBe('b')
    expect(serverFor(5, 0, c, 'b')).toBe('a')
  })
})

describe('computeMatch', () => {
  it('termina al mejor de 3 al ganar 2 juegos', () => {
    const s = computeMatch([...repeat('a', 11), ...repeat('a', 11)], cfg(), 'a')
    expect(s.finished).toBe(true)
    expect(s.winner).toBe('a')
    expect(s.gamesWon).toEqual({ a: 2, b: 0 })
  })

  it('ignora puntos después de terminado', () => {
    const s = computeMatch([...repeat('a', 2), 'b'], cfg({ pointsToWin: 2, bestOf: 1 }), 'a')
    expect(s.finished).toBe(true)
    expect(s.games).toEqual([{ a: 2, b: 0, winner: 'a' }])
  })

  it('al mejor de 10 se gana con 6 y puede empatar 5-5', () => {
    const c = cfg({ pointsToWin: 2, bestOf: 10, winByTwo: false })
    const six = computeMatch(pts('aa'.repeat(6)), c, 'a')
    expect(six.finished).toBe(true)
    expect(six.winner).toBe('a')

    const draw = computeMatch(pts('aabb'.repeat(5)), c, 'a')
    expect(draw.finished).toBe(true)
    expect(draw.winner).toBeNull()
    expect(draw.gamesWon).toEqual({ a: 5, b: 5 })
  })

  it('marca punto de juego y de partido', () => {
    const s = computeMatch([...repeat('a', 11), ...repeat('a', 10)], cfg(), 'a')
    expect(s.gamePoint).toBe('a')
    expect(s.matchPoint).toBe('a')
    const s2 = computeMatch(repeat('b', 10), cfg(), 'a')
    expect(s2.gamePoint).toBe('b')
    expect(s2.matchPoint).toBeUndefined()
  })

  it('alterna quién saca primero en cada juego', () => {
    const s = computeMatch(repeat('a', 11), cfg(), 'a')
    expect(s.games.length).toBe(2)
    expect(s.server).toBe('b')
  })
})

describe('formatElapsed', () => {
  it('muestra minutos y segundos, y horas cuando hacen falta', () => {
    expect(formatElapsed(0)).toBe('0:00')
    expect(formatElapsed(65_000)).toBe('1:05')
    expect(formatElapsed((23 * 60 + 41) * 1000 + 999)).toBe('23:41')
    expect(formatElapsed((3600 + 2 * 60 + 9) * 1000)).toBe('1:02:09')
    expect(formatElapsed(-5000)).toBe('0:00')
  })
})

describe('gameStartedAt', () => {
  const points = [...repeat('a', 11), 'b', 'a'] as Side[]
  const games = computeMatch(points, cfg(), 'a').games
  const pointTimes = points.map((_, i) => 1000 + i * 10)
  it('el primer juego arranca con el partido', () => {
    expect(gameStartedAt({ startedAt: 500, pointTimes }, computeMatch(points.slice(0, 3), cfg(), 'a').games)).toBe(500)
  })
  it('los siguientes arrancan con el punto que cerró el anterior', () => {
    expect(gameStartedAt({ startedAt: 500, pointTimes }, games)).toBe(1100)
  })
  it('sin horas guardadas no se sabe', () => {
    expect(gameStartedAt({ startedAt: 500 }, games)).toBeUndefined()
    expect(gameStartedAt({ startedAt: 500, pointTimes: pointTimes.map(() => 0) }, games)).toBeUndefined()
  })
})
