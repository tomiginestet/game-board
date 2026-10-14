// Torneos de cualquier juego: liga, eliminación directa, mesas rotativas y partida acumulada.
// Los inscriptos se identifican por su posición en `cup.entrants`.

import { winnerSides } from './engine'
import { shuffle } from './pingpong/tournament'
import type { Cup, Play } from './types'

/** Fixture de liga con el método del círculo (sobre índices de inscriptos). */
export function roundRobinIdx(count: number, doubleRound = false): [number, number][][] {
  const list: (number | null)[] = Array.from({ length: count }, (_, i) => i)
  if (list.length % 2 === 1) list.push(null)
  const n = list.length
  const rounds: [number, number][][] = []
  for (let r = 0; r < n - 1; r++) {
    const round: [number, number][] = []
    for (let i = 0; i < n / 2; i++) {
      const x = list[i]
      const y = list[n - 1 - i]
      if (x !== null && y !== null) round.push(r % 2 === 0 ? [x, y] : [y, x])
    }
    rounds.push(round)
    list.splice(1, 0, list.pop()!)
  }
  if (doubleRound) return [...rounds, ...rounds.map((round) => round.map(([x, y]) => [y, x] as [number, number]))]
  return rounds
}

/** Cuadro inicial de eliminación con BYEs (null), sin que dos BYEs se crucen. */
export function knockoutSeedsIdx(order: number[]): (number | null)[] {
  let size = 2
  while (size < order.length) size *= 2
  const seeds: (number | null)[] = new Array(size).fill(null)
  const half = size / 2
  order.forEach((id, i) => {
    if (i < half) seeds[2 * i] = id
    else seeds[2 * (i - half) + 1] = id
  })
  return seeds
}

/** Reparte inscriptos en mesas lo más parejas posible, de hasta `size` lugares. */
export function splitTables(order: number[], size: number): number[][] {
  const count = Math.max(1, Math.ceil(order.length / Math.max(2, size)))
  const tables: number[][] = Array.from({ length: count }, () => [])
  order.forEach((e, i) => tables[i % count].push(e))
  return tables
}

/** Mezcla para la próxima ronda de mesas tratando de no repetir compañeros de mesa. */
export function nextTables(entrants: number, size: number, previous: number[][][], random = Math.random): number[][] {
  const met = new Map<string, number>()
  for (const round of previous)
    for (const table of round)
      for (const a of table) for (const b of table) if (a < b) met.set(`${a}-${b}`, (met.get(`${a}-${b}`) ?? 0) + 1)
  let best: number[][] = []
  let bestCost = Infinity
  for (let attempt = 0; attempt < 60; attempt++) {
    const tables = splitTables(
      shuffle(
        Array.from({ length: entrants }, (_, i) => i),
        random,
      ),
      size,
    )
    let cost = 0
    for (const table of tables)
      for (const a of table) for (const b of table) if (a < b) cost += met.get(`${a}-${b}`) ?? 0
    if (cost < bestCost) {
      best = tables
      bestCost = cost
      if (!cost) break
    }
  }
  return best
}

export interface BracketSlot {
  round: number
  slot: number
  a: number | null | undefined
  b: number | null | undefined
  play?: Play
  /** Inscripto que pasa; `undefined` si todavía no se sabe; `null` si no pasa nadie. */
  winner?: number | null
  isBye: boolean
}

/** Índice de inscripto de un lado de una partida de torneo. */
export function entrantOfSide(cup: Cup, play: Play, side: number): number {
  // Un equipo fijo se reconoce por el equipo, aunque ese día hayan jugado otros del plantel.
  const teamId = play.sides[side]?.teamId
  if (teamId) {
    const byTeam = cup.entrants.findIndex((e) => e.teamId === teamId)
    if (byTeam >= 0) return byTeam
  }
  const ids = play.sides[side]?.players ?? []
  return cup.entrants.findIndex((e) => e.players.length === ids.length && e.players.every((p) => ids.includes(p)))
}

export function bracketRounds(cup: Cup, plays: Play[]): BracketSlot[][] {
  const rounds: BracketSlot[][] = []
  let entrants: (number | null | undefined)[] = cup.seeds ?? []
  let r = 0
  while (entrants.length >= 2) {
    const round: BracketSlot[] = []
    for (let s = 0; s < entrants.length / 2; s++) {
      const a = entrants[2 * s]
      const b = entrants[2 * s + 1]
      const play = plays.find((p) => p.round === r && p.slot === s)
      let winner: number | null | undefined
      const isBye = a === null || b === null
      if (a === null && b === null) winner = null
      else if (a === null) winner = b
      else if (b === null) winner = a
      else if (play?.status === 'finished') {
        const w = winnerSides(play)
        winner = w.length === 1 ? entrantOfSide(cup, play, w[0]) : undefined
      }
      round.push({ round: r, slot: s, a, b, play, winner, isBye })
    }
    rounds.push(round)
    entrants = round.map((x) => x.winner)
    r++
  }
  return rounds
}

export interface CupStanding {
  entrant: number
  played: number
  wins: number
  draws: number
  losses: number
  /** Puntos de tabla. */
  points: number
  /** Suma de puntajes del juego (si tiene). */
  score: number
  /** Diferencia de puntaje (ligas de a dos). */
  diff: number
  /** Puntaje en contra (goles en contra), en las partidas de a dos con puntaje. */
  against: number
}

/** Puntos por puesto en una mesa: uno por cada lado que quedó atrás. */
export function placePoints(places: number[], side: number): number {
  return places.filter((p) => p > places[side]).length
}

export function cupStandings(cup: Cup, plays: Play[], lowWins = false): CupStanding[] {
  const rows: CupStanding[] = cup.entrants.map((_, i) => ({ entrant: i, played: 0, wins: 0, draws: 0, losses: 0, points: 0, score: 0, diff: 0, against: 0 }))
  const isFinal = (p: Play) => cup.format === 'tables' && cup.final && p.round === (cup.rounds ?? 0)
  for (const play of plays) {
    if (play.status !== 'finished' || !play.result || isFinal(play)) continue
    const winners = winnerSides(play)
    const scores = play.result.scores
    play.sides.forEach((_, side) => {
      const e = entrantOfSide(cup, play, side)
      const row = rows[e]
      if (!row) return
      row.played++
      const won = winners.includes(side)
      const drawn = !winners.length
      if (won) row.wins++
      else if (drawn) row.draws++
      else row.losses++
      const own = scores?.[side] ?? null
      if (own !== null) row.score += own
      if (cup.format === 'league' || cup.format === 'knockout') {
        row.points += won ? 3 : drawn ? 1 : 0
        const other = scores?.[1 - side] ?? null
        if (own !== null && other !== null) {
          row.diff += own - other
          row.against += other
        }
      } else row.points += placePoints(play.result!.places, side)
    })
  }
  const byScore = cup.format === 'series'
  return rows.sort((x, y) => {
    if (byScore && (x.score || y.score)) return lowWins ? x.score - y.score : y.score - x.score
    return y.points - x.points || y.wins - x.wins || y.diff - x.diff || (lowWins ? x.score - y.score : y.score - x.score)
  })
}

/** Rondas de mesas ya generadas (la final no cuenta). */
export function tableRounds(cup: Cup, plays: Play[]): number[][][] {
  const out: number[][][] = []
  for (const p of plays) {
    if (p.round === undefined || p.round >= (cup.rounds ?? Infinity)) continue
    out[p.round] ??= []
    out[p.round][p.slot ?? 0] = p.sides.map((_, s) => entrantOfSide(cup, p, s))
  }
  return out.filter(Boolean)
}

/** Inscripto campeón, si el torneo ya terminó. */
export function cupChampion(cup: Cup, plays: Play[], lowWins = false): number | undefined {
  if (!plays.length) return undefined
  if (cup.format === 'knockout') {
    const rounds = bracketRounds(cup, plays)
    return rounds[rounds.length - 1]?.[0]?.winner ?? undefined
  }
  if (cup.format === 'tables' && cup.final) {
    const final = plays.find((p) => p.round === cup.rounds)
    if (!final || final.status !== 'finished') return undefined
    const w = winnerSides(final)
    return w.length === 1 ? entrantOfSide(cup, final, w[0]) : undefined
  }
  const expected = cup.format === 'tables' ? (cup.rounds ?? 1) : undefined
  const done = plays.every((p) => p.status === 'finished')
  const allRounds = expected === undefined || new Set(plays.map((p) => p.round)).size >= expected
  if (!cup.closedAt && (!done || !allRounds)) return undefined
  return cupStandings(cup, plays, lowWins)[0]?.entrant
}

export function cupEntrantName(cup: Cup, index: number, nameOf: (id: string) => string, teamName?: (id: string) => string | undefined): string {
  const e = cup.entrants[index]
  if (!e) return '—'
  return (e.teamId && teamName?.(e.teamId)) || e.name || e.players.map(nameOf).join(' & ')
}
