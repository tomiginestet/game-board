import { describe, expect, it } from 'vitest'
import { computeSets, setsLine, type ResolvedSets } from './sets'
import { formatTime, parseTime } from './score'

const tennis: ResolvedSets = { kind: 'tennis', bestOf: 3, points: 21, winBy: 2, games: 6, golden: false, superTb: false, lastSetPoints: undefined, cap: undefined }
const volley: ResolvedSets = { kind: 'points', bestOf: 5, points: 25, lastSetPoints: 15, winBy: 2, games: 6, golden: false, superTb: false, cap: undefined }

/** Un game en blanco para el lado `s`. */
const game = (s: number) => [s, s, s, s]
const games = (s: number, n: number) => Array.from({ length: n }, () => game(s)).flat()

describe('sets', () => {
  it('canta los puntos como en el tenis, con iguales y ventaja', () => {
    expect(computeSets(tennis, [0]).call).toEqual(['15', '0'])
    expect(computeSets(tennis, [0, 0, 1]).call).toEqual(['30', '15'])
    expect(computeSets(tennis, [0, 0, 0, 1, 1, 1]).call).toEqual(['40', '40'])
    expect(computeSets(tennis, [0, 0, 0, 1, 1, 1, 1]).call).toEqual(['40', 'Ad'])
    expect(computeSets(tennis, [0, 0, 0, 1, 1, 1, 1, 0]).call).toEqual(['40', '40'])
    const won = computeSets(tennis, [0, 0, 0, 1, 1, 1, 1, 1])
    expect(won.current).toEqual([0, 1])
    expect(won.call).toEqual(['0', '0'])
  })

  it('con punto de oro, en 40 iguales define el próximo', () => {
    const st = computeSets({ ...tennis, golden: true }, [0, 0, 0, 1, 1, 1, 1])
    expect(st.current).toEqual([0, 1])
  })

  it('gana el set a 6 con dos de diferencia y va al tie-break en 6-6', () => {
    const six = computeSets(tennis, [...games(0, 5), ...games(1, 4), ...game(0)])
    expect(six.done[0].score).toEqual([6, 4])
    expect(six.won).toEqual([1, 0])
    const tb = computeSets(tennis, [...games(0, 5), ...games(1, 5), ...game(0), ...game(1)])
    expect(tb.tiebreak).toBe(true)
    // Tie-break 7-5.
    const after = computeSets(tennis, [...games(0, 5), ...games(1, 5), ...game(0), ...game(1), 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0])
    expect(after.done[0]).toEqual({ score: [7, 6], tb: [7, 5] })
    expect(setsLine(after)).toBe('7-6(5)')
  })

  it('termina al ganar los sets necesarios e ignora lo de después', () => {
    const st = computeSets(tennis, [...games(1, 6), ...games(1, 6), 0, 0])
    expect(st.winner).toBe(1)
    expect(st.won).toEqual([0, 2])
    expect(setsLine(st, 1)).toBe('6-0 6-0')
  })

  it('super tie-break a 10 en lugar del tercer set', () => {
    const base = [...games(0, 6), ...games(1, 6)]
    const st = computeSets({ ...tennis, superTb: true }, base)
    expect(st.superTb).toBe(true)
    const done = computeSets({ ...tennis, superTb: true }, [...base, ...Array(10).fill(0)])
    expect(done.winner).toBe(0)
    expect(setsLine(done)).toBe('6-0 0-6 [10-0]')
  })

  it('vóley: sets a 25 con dos de diferencia y el quinto a 15', () => {
    const set = (s: number, n = 25) => Array(n).fill(s)
    const st = computeSets(volley, [...set(0), ...set(1), ...set(0), ...set(1)])
    expect(st.won).toEqual([2, 2])
    const fifth = computeSets(volley, [...set(0), ...set(1), ...set(0), ...set(1), ...set(0, 14), ...set(1, 14), 0])
    expect(fifth.winner).toBeUndefined()
    const end = computeSets(volley, [...set(0), ...set(1), ...set(0), ...set(1), ...set(0, 14), ...set(1, 14), 0, 0])
    expect(end.winner).toBe(0)
    expect(end.done[4].score).toEqual([16, 14])
  })

  it('el tope cierra el set sin diferencia', () => {
    const capped = computeSets({ ...volley, bestOf: 3, points: 21, lastSetPoints: undefined, cap: 30 }, [...Array(29).fill(0).flatMap(() => [0, 1]).slice(0, 58), 0])
    expect(capped.done[0].score).toEqual([30, 29])
  })
})

describe('tiempos', () => {
  it('lee y escribe tiempos de reloj', () => {
    expect(parseTime('25:14')).toBe(1514)
    expect(parseTime('1:02:05')).toBe(3725)
    expect(parseTime('25')).toBe(1500)
    expect(parseTime('25:70')).toBeNull()
    expect(parseTime('hola')).toBeNull()
    expect(formatTime(1514)).toBe('25:14')
    expect(formatTime(3725)).toBe('1:02:05')
  })
})

describe('saque', () => {
  const game = (s: number) => [s, s, s, s]
  it('en tenis cambia en cada game y rota dentro de la pareja', () => {
    expect(computeSets(tennis, [], 1).server).toBe(1)
    const st = computeSets(tennis, [...game(0), ...game(0)], 0)
    expect(st.server).toBe(0)
    expect(st.serveTurns).toEqual([2, 1])
    expect(computeSets(tennis, game(1), 0).server).toBe(1)
  })

  it('en el tie-break saca uno y después dos y dos', () => {
    // 6-6: doce games, el que sacó primero en el partido vuelve a sacar el primer punto del tie-break.
    const sixAll = Array.from({ length: 6 }, () => [...game(0), ...game(1)]).flat()
    const servers = [0, 1, 1, 0, 0, 1].map((_, k) => computeSets(tennis, [...sixAll, ...Array(k).fill(0)], 0).server)
    expect(servers).toEqual([0, 1, 1, 0, 0, 1])
  })

  it('en vóley saca el que ganó el último punto', () => {
    expect(computeSets(volley, [1], 0).server).toBe(1)
    expect(computeSets(volley, [1, 0], 0).server).toBe(0)
  })
})
