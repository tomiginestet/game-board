// Estadísticas de todos los juegos: ELO por juego, puntos de gloria, rachas,
// cinturones y los números de los que salen las medallas.

import { cupChampion } from './cups'
import { computeLive, playerLines, winnerSides, type PlayerLine } from './engine'
import { findGame, missingGame } from './games'
import type { GameDef } from './games/schema'
import { computeMatch } from './pingpong/scoring'
import { tournamentChampion } from './pingpong/stats'
import { sidePlayers } from './pingpong/teams'
import type { AppData, Id, Play } from './types'

export const INITIAL_ELO = 1000
const K = 32

/** Una partida terminada de cualquier juego, en un formato común (incluye los partidos de ping pong). */
export interface PlayView {
  id: Id
  gameId: string
  at: number
  sides: Id[][]
  roles: (string | undefined)[]
  places: number[]
  scores?: (number | null)[]
  coopWin?: boolean
  /** Ganadores (índices de lado); vacío si fue empate o derrota cooperativa. */
  winners: number[]
  /** Por evento: cantidad por lado. */
  events: Record<string, number[]>
  /** Por evento `holder`: lado que lo tenía al terminar (-1 nadie) y veces que lo tuvo cada lado. */
  holders: Record<string, number>
  holderGains: Record<string, number[]>
  stats?: Record<string, (number | string | null)[]>
  cupId?: Id
  /** Lo que hizo cada jugador con nombre (goles, asistencias, eventos `byPlayer`). */
  lines?: Map<Id, PlayerLine>
  /** Figura del partido. */
  mvp?: Id
  /** Partida original (ausente en ping pong). */
  play?: Play
}

export function playView(game: GameDef, play: Play): PlayView | undefined {
  if (play.status !== 'finished' || !play.result) return undefined
  const live = computeLive(game, play)
  return {
    id: play.id,
    gameId: play.gameId,
    at: play.finishedAt ?? play.createdAt,
    sides: play.sides.map((s) => s.players),
    roles: play.sides.map((s) => s.role),
    places: play.result.places,
    scores: play.result.scores,
    coopWin: play.result.coopWin,
    winners: winnerSides(play),
    events: live.counts,
    holders: live.holders,
    holderGains: live.holderGains,
    stats: play.result.stats,
    cupId: play.cupId,
    lines: playerLines(play),
    ...(play.result.mvp ? { mvp: play.result.mvp } : {}),
    play,
  }
}

/** Todas las partidas terminadas, de todos los juegos, en orden cronológico. */
export function allPlayViews(data: AppData, filter?: { since?: number; gameId?: string }): PlayView[] {
  const out: PlayView[] = []
  if (!filter?.gameId || filter.gameId === 'pingpong') {
    for (const m of data.matches) {
      if (m.status !== 'finished') continue
      const state = computeMatch(m.points, m.config, m.firstServer)
      const places = state.winner === 'a' ? [1, 2] : state.winner === 'b' ? [2, 1] : [1, 1]
      out.push({
        id: m.id,
        gameId: 'pingpong',
        at: m.finishedAt ?? m.createdAt,
        sides: [sidePlayers(m, 'a'), sidePlayers(m, 'b')],
        roles: [undefined, undefined],
        places,
        scores: [state.gamesWon.a, state.gamesWon.b],
        winners: state.winner === 'a' ? [0] : state.winner === 'b' ? [1] : [],
        events: {},
        holders: {},
        holderGains: {},
        cupId: m.tournamentId,
      })
    }
  }
  for (const p of data.plays) {
    if (filter?.gameId && p.gameId !== filter.gameId) continue
    const v = playView(findGame(data, p.gameId) ?? missingGame(p.gameId), p)
    if (v) out.push(v)
  }
  return out.filter((v) => !filter?.since || v.at >= filter.since).sort((a, b) => a.at - b.at)
}

export interface EventTally {
  total: number
  max: number
  plays: number
  wins: number
}

export interface GameStats {
  playerId: Id
  gameId: string
  elo: number
  eloHistory: number[]
  played: number
  wins: number
  losses: number
  draws: number
  streak: number
  bestStreak: number
  podiums: number
  coopPlayed: number
  coopWins: number
  scoreMax: number
  marginMax: number
  shutoutWins: number
  biggestUpset: number
  cupsWon: number
  gloria: number
  lastAt: number
  events: Record<string, EventTally>
  statTotal: Record<string, number>
  statMax: Record<string, number>
  /** Victorias según el valor de un dato final de opciones: `"favResource:Trigo"`. */
  choiceWins: Record<string, number>
  roleWins: Record<string, number>
  rolePlayed: Record<string, number>
  /** Lo que anotó el jugador mismo (goles, puntos), en total y su mejor partida. */
  scored: number
  scoredMax: number
  /** Partidas en las que anotó al menos una vez. */
  scoredPlays: number
  assists: number
  /** Veces que fue la figura del partido. */
  mvps: number
}

export interface GlobalStats {
  playerId: Id
  played: number
  wins: number
  losses: number
  draws: number
  streak: number
  bestStreak: number
  gloria: number
  cupsWon: number
  coopWins: number
  /** Victorias en partidas de 4 lados o más. */
  bigTableWins: number
  biggestUpset: number
  /** Juegos distintos jugados / ganados. */
  gamesPlayed: number
  gamesWon: number
  lastAt: number
  perGame: Map<string, GameStats>
}

function emptyGame(playerId: Id, gameId: string): GameStats {
  return {
    playerId,
    gameId,
    elo: INITIAL_ELO,
    eloHistory: [INITIAL_ELO],
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    streak: 0,
    bestStreak: 0,
    podiums: 0,
    coopPlayed: 0,
    coopWins: 0,
    scoreMax: 0,
    marginMax: 0,
    shutoutWins: 0,
    biggestUpset: 0,
    cupsWon: 0,
    gloria: 0,
    lastAt: 0,
    events: {},
    statTotal: {},
    statMax: {},
    choiceWins: {},
    roleWins: {},
    rolePlayed: {},
    scored: 0,
    scoredMax: 0,
    scoredPlays: 0,
    assists: 0,
    mvps: 0,
  }
}

function emptyGlobal(playerId: Id): GlobalStats {
  return {
    playerId,
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    streak: 0,
    bestStreak: 0,
    gloria: 0,
    cupsWon: 0,
    coopWins: 0,
    bigTableWins: 0,
    biggestUpset: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    lastAt: 0,
    perGame: new Map(),
  }
}

export function expectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + 10 ** ((eloB - eloA) / 400))
}

/** Puntos de gloria de un lado en una partida: más por ganar, por mesas más grandes y por juegos más "pesados". */
export function gloriaPoints(weight: number, sides: number, places: number[], side: number, coopWin?: boolean): number {
  if (coopWin !== undefined) return coopWin ? 3 * weight + 1 : 1
  if (sides < 2) return 1
  const behind = places.filter((p) => p > places[side]).length
  return Math.round(5 * weight * (1 + (sides - 2) * 0.5) * (behind / (sides - 1))) + 1
}

export interface Board {
  /** Por jugador: totales de todos los juegos y el detalle de cada uno. */
  players: Map<Id, GlobalStats>
  /** Cambio de ELO por partida y lado. */
  eloDeltas: Map<Id, number[]>
  /** Puntos de gloria por partida y lado. */
  gloria: Map<Id, number[]>
  views: PlayView[]
}

/** Recorre todo el historial (o un período) y calcula las estadísticas de cada jugador en cada juego. */
export function computeBoard(data: AppData, filter?: { since?: number; gameId?: string }): Board {
  const players = new Map<Id, GlobalStats>()
  const eloDeltas = new Map<Id, number[]>()
  const gloria = new Map<Id, number[]>()
  const views = allPlayViews(data, filter)
  const g = (id: Id) => {
    let s = players.get(id)
    if (!s) {
      s = emptyGlobal(id)
      players.set(id, s)
    }
    return s
  }
  const pg = (id: Id, gameId: string) => {
    const s = g(id)
    let x = s.perGame.get(gameId)
    if (!x) {
      x = emptyGame(id, gameId)
      s.perGame.set(gameId, x)
    }
    return x
  }
  for (const p of data.players) g(p.id)

  for (const v of views) {
    const game = findGame(data, v.gameId) ?? missingGame(v.gameId)
    const n = v.sides.length
    const coop = v.coopWin !== undefined
    const teams = v.sides.map((ids) => ids.map((id) => pg(id, v.gameId)))

    // ELO: comparaciones de a pares entre lados; cada equipo usa el promedio de sus integrantes.
    const deltas = new Array<number>(n).fill(0)
    if (!coop && n >= 2) {
      const avg = teams.map((t) => (t.length ? t.reduce((sum, s) => sum + s.elo, 0) / t.length : INITIAL_ELO))
      const k = K / (n - 1)
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          if (i === j) continue
          const actual = v.places[i] < v.places[j] ? 1 : v.places[i] > v.places[j] ? 0 : 0.5
          deltas[i] += k * (actual - expectedScore(avg[i], avg[j]))
        }
      for (let i = 0; i < n; i++) deltas[i] = Math.round(deltas[i])
      teams.forEach((t, i) => {
        const strongest = Math.max(...avg.filter((_, j) => j !== i))
        for (const s of t) {
          s.elo += deltas[i]
          if (v.winners.includes(i)) s.biggestUpset = Math.max(s.biggestUpset, Math.round(strongest - avg[i]))
        }
      })
    }
    eloDeltas.set(v.id, deltas)

    const pts = v.sides.map((_, i) => gloriaPoints(game.weight, n, v.places, i, v.coopWin))
    const byPlayer = new Set(game.events.filter((e) => e.byPlayer).map((e) => e.id))
    gloria.set(v.id, pts)

    teams.forEach((team, i) => {
      const won = v.winners.includes(i)
      const drawn = !coop && !v.winners.length
      const own = v.scores?.[i] ?? null
      const others = (v.scores ?? []).filter((_, j) => j !== i).filter((x): x is number => x !== null && x !== undefined)
      for (const s of team) {
        const gs = g(s.playerId)
        s.played++
        gs.played++
        s.eloHistory.push(s.elo)
        s.lastAt = gs.lastAt = v.at
        s.gloria += pts[i]
        gs.gloria += pts[i]
        if (coop) {
          s.coopPlayed++
          if (v.coopWin) {
            s.coopWins++
            s.wins++
            gs.coopWins++
            gs.wins++
          } else {
            s.losses++
            gs.losses++
          }
        } else if (won) {
          s.wins++
          gs.wins++
          s.streak = s.streak > 0 ? s.streak + 1 : 1
          gs.streak = gs.streak > 0 ? gs.streak + 1 : 1
          s.bestStreak = Math.max(s.bestStreak, s.streak)
          gs.bestStreak = Math.max(gs.bestStreak, gs.streak)
          if (n >= 4) gs.bigTableWins++
          gs.biggestUpset = Math.max(gs.biggestUpset, s.biggestUpset)
          if (own !== null && others.length) {
            const second = game.scoring.lowWins ? Math.min(...others) : Math.max(...others)
            s.marginMax = Math.max(s.marginMax, Math.abs(own - second))
            if (others.every((o) => o === 0) && own > 0) s.shutoutWins++
          }
        } else if (drawn) {
          s.draws++
          gs.draws++
          s.streak = 0
          gs.streak = 0
        } else {
          s.losses++
          gs.losses++
          s.streak = s.streak < 0 ? s.streak - 1 : -1
          gs.streak = gs.streak < 0 ? gs.streak - 1 : -1
        }
        if (!coop && v.places[i] <= 3 && n >= 3) s.podiums++
        if (own !== null) s.scoreMax = Math.max(s.scoreMax, own)

        const role = v.roles[i]
        if (role) {
          s.rolePlayed[role] = (s.rolePlayed[role] ?? 0) + 1
          if (won) s.roleWins[role] = (s.roleWins[role] ?? 0) + 1
        }
        const line = v.lines?.get(s.playerId)
        if (line) {
          s.scored += line.scored
          s.scoredMax = Math.max(s.scoredMax, line.scored)
          if (line.scored > 0) s.scoredPlays++
          s.assists += line.assists
        }
        if (v.mvp === s.playerId) s.mvps++
        for (const [id, counts] of Object.entries(v.events)) {
          // Los eventos de un jugador (una tarjeta, un triple) cuentan sólo para quien los hizo.
          const c = byPlayer.has(id) ? (line?.events[id] ?? 0) : (counts[i] ?? 0)
          const t = (s.events[id] ??= { total: 0, max: 0, plays: 0, wins: 0 })
          t.total += c
          t.max = Math.max(t.max, c)
          if (c > 0) {
            t.plays++
            if (won) t.wins++
          }
        }
        for (const [id, holder] of Object.entries(v.holders)) {
          const t = (s.events[id] ??= { total: 0, max: 0, plays: 0, wins: 0 })
          const gains = v.holderGains[id]?.[i] ?? 0
          t.total += gains
          t.max = Math.max(t.max, gains)
          if (holder === i) {
            t.plays++
            if (won) t.wins++
          }
        }
        for (const [id, values] of Object.entries(v.stats ?? {})) {
          const x = values[i]
          if (typeof x === 'number') {
            s.statTotal[id] = (s.statTotal[id] ?? 0) + x
            s.statMax[id] = Math.max(s.statMax[id] ?? 0, x)
          } else if (typeof x === 'string' && x && won) {
            s.choiceWins[`${id}:${x}`] = (s.choiceWins[`${id}:${x}`] ?? 0) + 1
          }
        }
      }
    })
  }

  // Torneos ganados.
  const champs: { gameId: string; players: Id[] }[] = []
  if (!filter?.gameId || filter.gameId === 'pingpong') {
    for (const t of data.tournaments) {
      const c = tournamentChampion(t.id, data)
      if (c && (!filter?.since || t.createdAt >= filter.since)) champs.push({ gameId: 'pingpong', players: [c] })
    }
  }
  for (const cup of data.cups) {
    if (filter?.gameId && cup.gameId !== filter.gameId) continue
    if (filter?.since && cup.createdAt < filter.since) continue
    const game = findGame(data, cup.gameId)
    const c = cupChampion(
      cup,
      data.plays.filter((p) => p.cupId === cup.id),
      game?.scoring.lowWins,
    )
    if (c !== undefined && cup.entrants[c]) champs.push({ gameId: cup.gameId, players: cup.entrants[c].players })
  }
  for (const c of champs)
    for (const id of c.players) {
      pg(id, c.gameId).cupsWon++
      g(id).cupsWon++
    }

  for (const s of players.values()) {
    s.gamesPlayed = s.perGame.size
    s.gamesWon = [...s.perGame.values()].filter((x) => x.wins > 0).length
  }
  return { players, eloDeltas, gloria, views }
}

export function winRate(s: { wins: number; played: number }): number {
  return s.played ? s.wins / s.played : 0
}

export function gameStatsOf(board: Board, playerId: Id, gameId: string): GameStats {
  return board.players.get(playerId)?.perGame.get(gameId) ?? emptyGame(playerId, gameId)
}

export function globalStatsOf(board: Board, playerId: Id): GlobalStats {
  return board.players.get(playerId) ?? emptyGlobal(playerId)
}

/** Ranking de un juego: quienes lo jugaron, por Elo y después por victorias (el mismo orden que la ficha). */
export function gameRanking(board: Board, gameId: string): GameStats[] {
  return [...board.players.values()]
    .map((s) => s.perGame.get(gameId))
    .filter((s): s is GameStats => !!s && s.played > 0)
    .sort((a, b) => b.elo - a.elo || b.wins - a.wins)
}

export type FormResult = 'win' | 'loss' | 'draw'

/** Las últimas `n` partidas de un jugador en cualquier juego, de la más vieja a la más nueva. */
export function recentForm(board: Board, playerId: Id, n = 8): FormResult[] {
  const out: FormResult[] = []
  for (let k = board.views.length - 1; k >= 0 && out.length < n; k--) {
    const v = board.views[k]
    const i = v.sides.findIndex((side) => side.includes(playerId))
    if (i < 0) continue
    if (v.coopWin !== undefined) out.push(v.coopWin ? 'win' : 'loss')
    else out.push(v.winners.includes(i) ? 'win' : v.winners.length ? 'loss' : 'draw')
  }
  return out.reverse()
}

export interface Belt {
  holders: Id[]
  since: number
  defenses: number
}

/**
 * Cinturón de un juego, como en el boxeo: lo tiene el último que le ganó a quien lo tenía.
 * El primero en ganar una partida lo estrena.
 */
export function beltOf(views: PlayView[], gameId: string): Belt | undefined {
  let belt: Belt | undefined
  for (const v of views) {
    if (v.gameId !== gameId || v.coopWin !== undefined || v.winners.length !== 1 || v.sides.length < 2) continue
    const winners = v.sides[v.winners[0]]
    if (!belt) {
      belt = { holders: winners, since: v.at, defenses: 0 }
      continue
    }
    const holderIn = v.sides.findIndex((s) => s.some((id) => belt!.holders.includes(id)))
    if (holderIn < 0) continue
    if (holderIn === v.winners[0]) belt.defenses++
    else belt = { holders: winners, since: v.at, defenses: 0 }
  }
  return belt
}

export type LevelIconId = 'egg' | 'hatching' | 'paddle' | 'pepper' | 'lightning' | 'belt' | 'dragon'

export const LEVELS: { min: number; name: string; icon: LevelIconId }[] = [
  { min: -Infinity, name: 'Novato', icon: 'egg' },
  { min: 900, name: 'Aprendiz', icon: 'hatching' },
  { min: 975, name: 'Amateur', icon: 'paddle' },
  { min: 1050, name: 'Picante', icon: 'pepper' },
  { min: 1125, name: 'Crack', icon: 'lightning' },
  { min: 1200, name: 'Maestro', icon: 'belt' },
  { min: 1300, name: 'Leyenda', icon: 'dragon' },
]

export function levelFor(elo: number) {
  let level = LEVELS[0]
  for (const l of LEVELS) if (elo >= l.min) level = l
  return level
}

/** Inicio de un período para filtrar rankings. */
export function periodStart(period: 'all' | 'year' | 'month' | 'week', now = new Date()): number | undefined {
  if (period === 'all') return undefined
  if (period === 'year') return new Date(now.getFullYear(), 0, 1).getTime()
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.getTime()
}
