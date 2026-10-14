import { describe, expect, it } from 'vitest'
import { balanceTeams, spread, winChance } from './balance'
import { entrantOfSide } from './cups'
import { autoResult, computeLive, playerLines } from './engine'
import { BUILTIN_GAMES } from './games'
import type { GameDef } from './games/schema'
import { gameMedals } from './medals'
import { computeBoard, gameStatsOf } from './stats'
import { slotTime } from './store'
import { teamRecord } from './teams'
import type { AppData, Cup, LogEntry, Play, Team } from './types'

const game = (id: string): GameDef => {
  const g = BUILTIN_GAMES.find((x) => x.id === id)
  if (!g) throw new Error(`falta ${id}`)
  return g
}

const data = (plays: Play[], teams: Team[] = []): AppData => ({ version: 1, players: [], matches: [], tournaments: [], plays, cups: [], games: [], teams })

const goal = (s: number, pl?: string, as?: string): LogEntry => ({ k: 'pt', s, n: 1, t: 0, ...(pl ? { pl } : {}), ...(as ? { as } : {}) })

function partido(id: string, log: LogEntry[], extra: Partial<Play> = {}): Play {
  return {
    id,
    gameId: 'futbol5',
    createdAt: 1,
    status: 'finished',
    finishedAt: 10,
    config: {},
    sides: [{ players: ['ana', 'beto'], teamId: 'pibes', name: 'Los Pibes' }, { players: ['caro', 'dani'] }],
    log,
    result: { places: [1, 2], scores: [3, 0] },
    ...extra,
  }
}

describe('estadísticas por jugador', () => {
  it('cuenta goles, asistencias y eventos de cada uno', () => {
    const play = partido('p1', [goal(0, 'ana', 'beto'), goal(0, 'ana'), goal(0, 'ana', 'beto'), { k: 'ev', s: 1, e: 'roja', n: 1, pl: 'dani', t: 0 }, goal(0)])
    const lines = playerLines(play)
    expect(lines.get('ana')).toMatchObject({ scored: 3, assists: 0 })
    expect(lines.get('beto')).toMatchObject({ scored: 0, assists: 2 })
    expect(lines.get('dani')?.events.roja).toBe(1)
  })

  it('alimenta las medallas de goleador, hat-trick, asistencias, figura y rojas', () => {
    const play = partido('p1', [goal(0, 'ana', 'beto'), goal(0, 'ana'), goal(0, 'ana', 'beto'), { k: 'ev', s: 1, e: 'roja', n: 1, pl: 'dani', t: 0 }], {
      result: { places: [1, 2], scores: [3, 0], mvp: 'ana' },
    })
    const board = computeBoard(data([play]))
    const ana = gameStatsOf(board, 'ana', 'futbol5')
    expect(ana).toMatchObject({ scored: 3, scoredMax: 3, mvps: 1, shutoutWins: 1 })
    expect(gameStatsOf(board, 'beto', 'futbol5').assists).toBe(2)
    // La roja es de Dani, no de Caro (que estaba en el mismo equipo).
    expect(gameStatsOf(board, 'dani', 'futbol5').events.roja.total).toBe(1)
    expect(gameStatsOf(board, 'caro', 'futbol5').events.roja.total).toBe(0)
    const medals = gameMedals(game('futbol5'), ana)
    expect(medals.find((m) => m.family.id === 'hattrick')?.level).toBe(0)
    expect(medals.find((m) => m.family.id === 'figura')?.level).toBe(0)
  })
})

describe('modo sets en el motor', () => {
  it('el pádel termina solo al ganar dos sets', () => {
    const g = game('padel')
    const games = (s: number, n: number) => Array.from({ length: n * 4 }, () => ({ k: 'pt', s, n: 1, t: 0 }) as LogEntry)
    const play: Play = { id: 'x', gameId: 'padel', createdAt: 0, status: 'live', config: { bestOf: 3 }, sides: [{ players: ['a'] }, { players: ['b'] }], log: [...games(0, 6), ...games(0, 5)] }
    expect(autoResult(g, play)).toBeUndefined()
    const done = { ...play, log: [...play.log, ...games(0, 1)] }
    expect(computeLive(g, done).scores).toEqual([2, 0])
    expect(autoResult(g, done)).toEqual({ scores: [2, 0], places: [1, 2] })
  })
})

describe('equipos parejos', () => {
  const elo: Record<string, number> = { a: 1300, b: 1200, c: 1100, d: 1000, e: 950, f: 900, g: 850, h: 800, i: 750, j: 700 }
  const rating = (id: string) => elo[id]

  it('arma equipos del mismo tamaño y bien parejos', () => {
    const teams = balanceTeams(Object.keys(elo), rating, 2, () => 0.5)
    expect(teams.map((t) => t.length)).toEqual([5, 5])
    expect(spread(teams, rating)).toBeLessThanOrEqual(10)
    const chance = winChance(teams[0], teams[1], rating)
    expect(Math.abs(chance - 0.5)).toBeLessThan(0.03)
  })

  it('con números impares, los tamaños difieren en uno', () => {
    const teams = balanceTeams(['a', 'b', 'c', 'd', 'e', 'f', 'g'], rating, 3, () => 0.5)
    expect(teams.map((t) => t.length).sort()).toEqual([2, 2, 3])
    expect(teams.flat().sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g'])
  })
})

describe('fixture con fecha y cancha', () => {
  const start = new Date(2026, 9, 17, 20, 0).getTime()

  it('cada fecha cae una semana después y los partidos se reparten entre canchas', () => {
    const s = { start, everyDays: 7, gapMinutes: 60 }
    expect(slotTime(s, ['Cancha 1', 'Cancha 2'], 0, 0)).toEqual({ scheduledAt: start, venue: 'Cancha 1' })
    expect(slotTime(s, ['Cancha 1', 'Cancha 2'], 0, 1)).toEqual({ scheduledAt: start, venue: 'Cancha 2' })
    // Tercer partido de la fecha: vuelve a la cancha 1, una hora después.
    expect(slotTime(s, ['Cancha 1', 'Cancha 2'], 0, 2)).toEqual({ scheduledAt: start + 3_600_000, venue: 'Cancha 1' })
    expect(new Date(slotTime(s, undefined, 2, 0).scheduledAt!).getDate()).toBe(31)
    expect(new Date(slotTime(s, undefined, 2, 0).scheduledAt!).getHours()).toBe(20)
  })

  it('todo el mismo día: cada fecha arranca cuando termina la anterior', () => {
    const s = { start, everyDays: 0, gapMinutes: 30 }
    // Dos partidos por fecha en una cancha: la fecha 2 empieza una hora después.
    expect(slotTime(s, ['A'], 1, 0, 2).scheduledAt).toBe(start + 60 * 60_000)
  })

  it('un equipo fijo se reconoce en el torneo aunque cambie el plantel', () => {
    const cup = { id: 'c', name: 'Liga', gameId: 'futbol5', createdAt: 0, format: 'league', config: {}, entrants: [{ players: ['ana'], teamId: 'pibes' }, { players: ['caro'] }] } as Cup
    const play = partido('p', [], { sides: [{ players: ['ana', 'nuevo'], teamId: 'pibes' }, { players: ['caro'] }] })
    expect(entrantOfSide(cup, play, 0)).toBe(0)
    expect(entrantOfSide(cup, play, 1)).toBe(1)
  })
})

describe('campaña de un equipo', () => {
  it('suma partidos, goles a favor y en contra, y su goleador', () => {
    const team: Team = { id: 'pibes', name: 'Los Pibes', emoji: '⚽', color: '#000', players: ['ana', 'beto'], createdAt: 0 }
    const won = partido('p1', [goal(0, 'ana'), goal(0, 'ana'), goal(0, 'beto')])
    const lost = partido('p2', [goal(1)], { result: { places: [2, 1], scores: [0, 1] }, finishedAt: 20 })
    const next = partido('p3', [], { status: 'pending', result: undefined, scheduledAt: 99 })
    const rec = teamRecord(data([won, lost, next]), team)
    expect(rec).toMatchObject({ played: 2, wins: 1, losses: 1, draws: 0, scoreFor: 3, scoreAgainst: 1 })
    expect(rec.form).toEqual(['P', 'G'])
    expect(rec.scorers[0]).toMatchObject({ id: 'ana', scored: 2 })
    expect(rec.upcoming.map((p) => p.id)).toEqual(['p3'])
  })
})
