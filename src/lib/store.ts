import { useSyncExternalStore } from 'react'
import { applyEntities, diffData, type EntityChange, type RemoteEntity } from './diff'
import { autoResult, computeLive, defaultConfig } from './engine'
import { knockoutSeedsIdx, nextTables, roundRobinIdx, splitTables, tableRounds, cupStandings } from './cups'
import { findGame } from './games'
import type { CupFormat, GameDef, OptionValue } from './games/schema'
import { computeMatch } from './pingpong/scoring'
import { involves } from './pingpong/teams'
import { knockoutSeeds, roundRobin, shuffle } from './pingpong/tournament'
import type { MatchConfig, Side, TournamentFormat } from './pingpong/types'
import type {
  AppData,
  Cup,
  CupEntrant,
  CustomGame,
  Id,
  LogEntry,
  Play,
  PlayResult,
  PlaySide,
  Player,
  PPMatch as Match,
  PPTournament as Tournament,
} from './types'

const STORAGE_KEY = 'game-board-data-v1'
/** Datos de cada grupo, guardados aparte para cambiar entre grupos al instante (y sin conexión). */
const SCOPE_PREFIX = STORAGE_KEY + ':'
let storageKey = STORAGE_KEY

export const EMPTY: AppData = { version: 1, players: [], matches: [], tournaments: [], plays: [], cups: [], games: [] }

export const PLAYER_COLORS = ['#ff5a5f', '#ffb400', '#00a699', '#3b82f6', '#a855f7', '#ec4899', '#22c55e', '#f97316', '#14b8a6', '#eab308']
export const PLAYER_EMOJIS = ['🦊', '🐯', '🐼', '🐸', '🦁', '🐙', '🦄', '🐲', '🦅', '🐺', '🐻', '🐵', '🦈', '🐝', '🦖', '🐧', '🐨', '🐔', '🤖', '👽', '🔥', '⚡', '🌮', '🍕']

export function uid(): Id {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

function load(key = storageKey): AppData {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return EMPTY
    return validate(JSON.parse(raw))
  } catch {
    return EMPTY
  }
}

/** Acepta una copia de Game Board o del Ping Pong Club (que no tiene partidas de otros juegos). */
export function validate(input: unknown): AppData {
  const d = input as Partial<AppData> | null
  if (!d || typeof d !== 'object' || !Array.isArray(d.players) || !Array.isArray(d.matches) || !Array.isArray(d.tournaments)) {
    throw new Error('Formato de datos inválido')
  }
  const list = <T>(x: T[] | undefined): T[] => (Array.isArray(x) ? x : [])
  return {
    version: 1,
    players: d.players,
    matches: d.matches,
    tournaments: d.tournaments,
    plays: list(d.plays),
    cups: list(d.cups),
    games: list(d.games),
  }
}

let data: AppData = load()
const listeners = new Set<() => void>()
let changeListener: ((changes: EntityChange[]) => void) | undefined

/** Registra quién se entera de los cambios hechos localmente (la sincronización). */
export function onLocalChanges(fn: (changes: EntityChange[]) => void) {
  changeListener = fn
}

function commit(next: AppData, options: { remote?: boolean } = {}) {
  const prev = data
  data = next
  if (!options.remote && changeListener) {
    const changes = diffData(prev, next)
    if (changes.length) changeListener(changes)
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Sin espacio o modo privado: seguimos en memoria.
  }
  listeners.forEach((l) => l())
}

const keyFor = (scope: string | null) => (scope ? SCOPE_PREFIX + scope : STORAGE_KEY)

/**
 * Cambia de qué grupo son los datos que se muestran (`null`: los de este dispositivo, sin grupo).
 * No genera cambios para subir.
 */
export function switchScope(scope: string | null) {
  const key = keyFor(scope)
  if (key === storageKey) return
  storageKey = key
  data = load(key)
  listeners.forEach((l) => l())
}

export function hasScope(scope: string | null): boolean {
  try {
    return localStorage.getItem(keyFor(scope)) !== null
  } catch {
    return false
  }
}

/** Guarda una copia de los datos que se están mostrando en otro lugar (p. ej. al pasar los datos locales a un grupo). */
export function copyCurrentTo(scope: string | null) {
  try {
    localStorage.setItem(keyFor(scope), JSON.stringify(data))
  } catch {
    // ignorar
  }
}

/** Borra las copias de los grupos guardadas en este dispositivo (al cerrar sesión). */
export function clearScopes() {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith(SCOPE_PREFIX)) localStorage.removeItem(k)
  } catch {
    // ignorar
  }
}

if (typeof window !== 'undefined') {
  // Mantener sincronizadas varias pestañas abiertas.
  window.addEventListener('storage', (e) => {
    if (e.key === storageKey) {
      data = load()
      listeners.forEach((l) => l())
    }
  })
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useData(): AppData {
  return useSyncExternalStore(subscribe, () => data)
}

export function getData(): AppData {
  return data
}

/** Cambios que vienen del servidor: no se vuelven a marcar para subir. */
export function applyRemote(items: RemoteEntity[]) {
  if (items.length) commit(applyEntities(data, items), { remote: true })
}

/** Reemplaza todos los datos locales sin generar cambios para subir. */
export function replaceAllFromRemote(next: AppData) {
  commit(next, { remote: true })
}

function updateMatch(id: Id, fn: (m: Match) => Match) {
  commit({ ...data, matches: data.matches.map((m) => (m.id === id ? fn(m) : m)) })
}

/** Aplica un nuevo listado de puntos y actualiza estado/ganador del partido. */
function withPoints(m: Match, points: Side[]): Match {
  const state = computeMatch(points, m.config, m.firstServer)
  const next: Match = { ...m, points, status: state.finished ? 'finished' : 'live', startedAt: m.startedAt ?? Date.now() }
  if (state.finished) {
    next.finishedAt = m.status === 'finished' && m.finishedAt ? m.finishedAt : Date.now()
    next.winner = state.winner === 'a' ? m.playerA : state.winner === 'b' ? m.playerB : null
  } else {
    delete next.finishedAt
    delete next.winner
  }
  return next
}


// ---------------------------------------------------------------------------
// Partidas, torneos y juegos de Game Board (todo menos el ping pong)

function updatePlay(id: Id, fn: (p: Play) => Play) {
  commit({ ...data, plays: data.plays.map((p) => (p.id === id ? fn(p) : p)) })
}

function gameOf(gameId: string): GameDef | undefined {
  return findGame(data, gameId)
}

/** Si la partida llegó a su fin sola (objetivo alcanzado, todas las manos), la cierra. */
function settle(p: Play): Play {
  const game = gameOf(p.gameId)
  if (!game) return p
  const result = autoResult(game, p, computeLive(game, p))
  if (result) return { ...p, status: 'finished', result, finishedAt: p.status === 'finished' && p.finishedAt ? p.finishedAt : Date.now() }
  if (p.status === 'finished' && (game.mode === 'counter' || game.mode === 'rounds')) {
    // Se deshizo el punto que la terminaba: vuelve a estar en juego.
    const next: Play = { ...p, status: 'live' }
    delete next.result
    delete next.finishedAt
    return next
  }
  return p
}

function newPlay(gameId: string, sides: PlaySide[], config: Record<string, OptionValue>, extra: Partial<Play> = {}): Play {
  const live = extra.status !== 'pending'
  return {
    id: uid(),
    gameId,
    createdAt: Date.now(),
    ...(live ? { startedAt: Date.now() } : {}),
    status: 'live',
    config,
    sides,
    log: [],
    ...extra,
  }
}

const entrantSide = (e: CupEntrant): PlaySide => ({ players: e.players, ...(e.name ? { name: e.name } : {}) })

export interface NewCup {
  gameId: string
  name: string
  format: CupFormat
  entrants: CupEntrant[]
  config: Record<string, OptionValue>
  doubleRound?: boolean
  rounds?: number
  tableSize?: number
  final?: boolean
  prize?: string
}

const playActions = {
  createPlay(gameId: string, sides: PlaySide[], config?: Record<string, OptionValue>): Play {
    const game = gameOf(gameId)
    const p = newPlay(gameId, sides, config ?? (game ? defaultConfig(game) : {}))
    commit({ ...data, plays: [...data.plays, p] })
    return p
  },

  /** Anota algo en la partida (punto, evento, turno, mano). */
  log(playId: Id, entry: LogEntry | Omit<LogEntry, 't'>) {
    updatePlay(playId, (p) => {
      const e = { ...entry, t: Date.now() } as LogEntry
      return settle({ ...p, status: p.status === 'pending' ? 'live' : p.status, startedAt: p.startedAt ?? Date.now(), log: [...p.log, e] })
    })
  },

  /** Deshace lo último que se anotó. */
  undo(playId: Id) {
    updatePlay(playId, (p) => (p.log.length ? settle({ ...p, log: p.log.slice(0, -1) }) : p))
  },

  /** Borra una entrada puntual del registro (por ejemplo, una mano mal cargada). */
  removeLog(playId: Id, index: number) {
    updatePlay(playId, (p) => settle({ ...p, log: p.log.filter((_, i) => i !== index) }))
  },

  finishPlay(playId: Id, result: PlayResult) {
    updatePlay(playId, (p) => ({ ...p, status: 'finished', result, startedAt: p.startedAt ?? Date.now(), finishedAt: p.finishedAt ?? Date.now() }))
  },

  reopenPlay(playId: Id) {
    updatePlay(playId, (p) => {
      const next: Play = { ...p, status: 'live' }
      delete next.result
      delete next.finishedAt
      return next
    })
  },

  patchPlay(playId: Id, patch: Partial<Omit<Play, 'id'>>) {
    updatePlay(playId, (p) => ({ ...p, ...patch }))
  },

  deletePlay(playId: Id) {
    commit({ ...data, plays: data.plays.filter((p) => p.id !== playId) })
  },

  /** Vuelve a poner una partida borrada (para "Deshacer"). */
  restorePlay(play: Play) {
    if (data.plays.some((p) => p.id === play.id)) return
    commit({ ...data, plays: [...data.plays, play] })
  },

  saveGame(game: GameDef): CustomGame {
    const g: CustomGame = { ...game, id: game.id || uid(), createdAt: (game as CustomGame).createdAt ?? Date.now() }
    const exists = data.games.some((x) => x.id === g.id)
    commit({ ...data, games: exists ? data.games.map((x) => (x.id === g.id ? g : x)) : [...data.games, g] })
    return g
  },

  /** Borra un juego agregado. Sólo si no tiene partidas ni torneos. */
  deleteGame(id: Id): boolean {
    if (data.plays.some((p) => p.gameId === id) || data.cups.some((c) => c.gameId === id)) return false
    commit({ ...data, games: data.games.filter((g) => g.id !== id) })
    return true
  },

  createCup(input: NewCup): Cup {
    const id = uid()
    const now = Date.now()
    const cup: Cup = {
      id,
      name: input.name.trim(),
      gameId: input.gameId,
      createdAt: now,
      format: input.format,
      entrants: input.entrants,
      config: input.config,
      ...(input.prize?.trim() ? { prize: input.prize.trim() } : {}),
    }
    const plays: Play[] = []
    const order = shuffle(input.entrants.map((_, i) => i))
    const pending = (sides: PlaySide[], round: number, slot: number, i = 0) =>
      newPlay(input.gameId, sides, input.config, { status: 'pending', cupId: id, round, slot, createdAt: now + round * 100 + i })
    if (input.format === 'league') {
      cup.doubleRound = !!input.doubleRound
      roundRobinIdx(input.entrants.length, cup.doubleRound).forEach((round, r) =>
        round.forEach(([a, b], i) => plays.push(pending([entrantSide(input.entrants[order[a]]), entrantSide(input.entrants[order[b]])], r, i, i))),
      )
    } else if (input.format === 'knockout') {
      cup.seeds = knockoutSeedsIdx(order)
    } else if (input.format === 'tables') {
      cup.rounds = Math.max(1, input.rounds ?? 3)
      cup.tableSize = Math.max(2, input.tableSize ?? 4)
      cup.final = !!input.final
      splitTables(order, cup.tableSize).forEach((table, i) => plays.push(pending(table.map((e) => entrantSide(input.entrants[e])), 0, i, i)))
    } else {
      cup.rounds = Math.max(1, input.rounds ?? 3)
      for (let r = 0; r < cup.rounds; r++) plays.push(pending(input.entrants.map(entrantSide), r, 0))
    }
    commit({ ...data, cups: [...data.cups, cup], plays: [...data.plays, ...plays] })
    return cup
  },

  /** Crea (si no existe) la partida de una llave de eliminación directa. */
  ensureKnockoutPlay(cupId: Id, round: number, slot: number, a: number, b: number): Play {
    const cup = data.cups.find((c) => c.id === cupId)!
    const sides = [entrantSide(cup.entrants[a]), entrantSide(cup.entrants[b])]
    const existing = data.plays.find((p) => p.cupId === cupId && p.round === round && p.slot === slot)
    if (existing) {
      const same = (x: PlaySide, y: PlaySide) => x.players.join() === y.players.join()
      const ok = (same(existing.sides[0], sides[0]) && same(existing.sides[1], sides[1])) || (same(existing.sides[0], sides[1]) && same(existing.sides[1], sides[0]))
      if (ok || existing.log.length || existing.status === 'finished') return existing
      const fixed = { ...existing, sides }
      updatePlay(existing.id, () => fixed)
      return fixed
    }
    const p = newPlay(cup.gameId, sides, cup.config, { status: 'pending', cupId, round, slot })
    commit({ ...data, plays: [...data.plays, p] })
    return p
  },

  /** Mesas rotativas: arma la próxima ronda (o la mesa final con los mejores). */
  nextTablesRound(cupId: Id): boolean {
    const cup = data.cups.find((c) => c.id === cupId)
    if (!cup || cup.format !== 'tables') return false
    const plays = data.plays.filter((p) => p.cupId === cupId)
    if (plays.some((p) => p.status !== 'finished')) return false
    const done = tableRounds(cup, plays)
    const size = cup.tableSize ?? 4
    const now = Date.now()
    let created: Play[] = []
    if (done.length < (cup.rounds ?? 1)) {
      const r = done.length
      created = nextTables(cup.entrants.length, size, done).map((table, i) =>
        newPlay(cup.gameId, table.map((e) => entrantSide(cup.entrants[e])), cup.config, { status: 'pending', cupId, round: r, slot: i, createdAt: now + i }),
      )
    } else if (cup.final && !plays.some((p) => p.round === cup.rounds)) {
      const game = gameOf(cup.gameId)
      const top = cupStandings(cup, plays, game?.scoring.lowWins).slice(0, size)
      created = [newPlay(cup.gameId, top.map((r) => entrantSide(cup.entrants[r.entrant])), cup.config, { status: 'pending', cupId, round: cup.rounds, slot: 0 })]
    }
    if (!created.length) return false
    commit({ ...data, plays: [...data.plays, ...created] })
    return true
  },

  closeCup(cupId: Id, closed = true) {
    commit({ ...data, cups: data.cups.map((c) => (c.id === cupId ? { ...c, closedAt: closed ? Date.now() : undefined } : c)) })
  },

  deleteCup(cupId: Id) {
    commit({ ...data, cups: data.cups.filter((c) => c.id !== cupId), plays: data.plays.filter((p) => p.cupId !== cupId) })
  },
}

export const actions = {
  addPlayer(name: string, emoji: string, color: string): Player {
    const p: Player = { id: uid(), name: name.trim(), emoji, color, createdAt: Date.now() }
    commit({ ...data, players: [...data.players, p] })
    return p
  },

  updatePlayer(id: Id, patch: Partial<Omit<Player, 'id'>>) {
    commit({ ...data, players: data.players.map((p) => (p.id === id ? { ...p, ...patch } : p)) })
  },

  /** Borra un jugador. Sólo se permite si no jugó partidos. */
  deletePlayer(id: Id): boolean {
    if (data.matches.some((m) => involves(m, id))) return false
    if (data.tournaments.some((t) => t.playerIds.includes(id))) return false
    if (data.plays.some((p) => p.sides.some((s) => s.players.includes(id)))) return false
    if (data.cups.some((c) => c.entrants.some((e) => e.players.includes(id)))) return false
    commit({ ...data, players: data.players.filter((p) => p.id !== id) })
    return true
  },

  /** Crea un partido. Cada equipo tiene 1 jugador (singles) o 2 (dobles). */
  createMatch(teamA: Id[], teamB: Id[], config: MatchConfig, firstServer: Side): Match {
    const m: Match = {
      id: uid(),
      createdAt: Date.now(),
      startedAt: Date.now(),
      playerA: teamA[0],
      playerB: teamB[0],
      ...(teamA[1] && teamB[1] ? { partnerA: teamA[1], partnerB: teamB[1] } : {}),
      config,
      points: [],
      firstServer,
      status: 'live',
    }
    commit({ ...data, matches: [...data.matches, m] })
    return m
  },

  scorePoint(matchId: Id, side: Side) {
    updateMatch(matchId, (m) => (m.status === 'finished' ? m : withPoints(m, [...m.points, side])))
  },

  undoPoint(matchId: Id) {
    updateMatch(matchId, (m) => withPoints(m, m.points.slice(0, -1)))
  },

  /** Antes de empezar: cambiar quién saca primero. */
  setFirstServer(matchId: Id, side: Side) {
    updateMatch(matchId, (m) => (m.points.length ? m : { ...m, firstServer: side }))
  },

  /** Intercambia A y B (para que quede del lado correcto de la mesa). */
  swapSides(matchId: Id) {
    updateMatch(matchId, (m) => ({
      ...m,
      playerA: m.playerB,
      playerB: m.playerA,
      partnerA: m.partnerB,
      partnerB: m.partnerA,
      firstServer: m.firstServer === 'a' ? 'b' : 'a',
      points: m.points.map((p) => (p === 'a' ? 'b' : 'a')),
    }))
  },

  startMatch(matchId: Id) {
    updateMatch(matchId, (m) => (m.status === 'pending' ? { ...m, status: 'live', startedAt: Date.now() } : m))
  },

  /** Reinicia un partido (borra los puntos). */
  resetMatch(matchId: Id) {
    updateMatch(matchId, (m) => {
      const next: Match = { ...m, points: [], status: m.tournamentId ? 'pending' : 'live' }
      delete next.winner
      delete next.finishedAt
      return next
    })
  },

  deleteMatch(matchId: Id) {
    commit({ ...data, matches: data.matches.filter((m) => m.id !== matchId) })
  },

  /** Vuelve a poner un partido borrado (para "Deshacer"). */
  restoreMatch(match: Match) {
    if (data.matches.some((m) => m.id === match.id)) return
    commit({ ...data, matches: [...data.matches, match] })
  },

  createTournament(name: string, format: TournamentFormat, playerIds: Id[], config: MatchConfig, doubleRound: boolean): Tournament {
    const id = uid()
    const now = Date.now()
    const order = shuffle(playerIds)
    const t: Tournament = { id, name: name.trim(), createdAt: now, format, playerIds, config }
    const matches: Match[] = []
    if (format === 'league') {
      t.doubleRound = doubleRound
      roundRobin(order, doubleRound).forEach((round, r) =>
        round.forEach(([a, b], i) =>
          matches.push({
            id: uid(),
            createdAt: now + r * 100 + i,
            playerA: a,
            playerB: b,
            config,
            points: [],
            firstServer: Math.random() < 0.5 ? 'a' : 'b',
            status: 'pending',
            tournamentId: id,
            round: r,
          }),
        ),
      )
    } else {
      t.seeds = knockoutSeeds(order)
    }
    commit({ ...data, tournaments: [...data.tournaments, t], matches: [...data.matches, ...matches] })
    return t
  },

  /** Crea (si no existe) el partido de una llave de eliminación directa. */
  ensureKnockoutMatch(tournamentId: Id, round: number, slot: number, a: Id, b: Id): Match {
    const existing = data.matches.find((m) => m.tournamentId === tournamentId && m.round === round && m.slot === slot)
    if (existing) {
      const samePlayers = (existing.playerA === a && existing.playerB === b) || (existing.playerA === b && existing.playerB === a)
      // Si cambió quién llega a la llave (p. ej. se corrigió un resultado) y todavía no se jugó, se actualiza.
      if (samePlayers || existing.points.length) return existing
      const fixed = { ...existing, playerA: a, playerB: b }
      updateMatch(existing.id, () => fixed)
      return fixed
    }
    const t = data.tournaments.find((x) => x.id === tournamentId)!
    const m: Match = {
      id: uid(),
      createdAt: Date.now(),
      playerA: a,
      playerB: b,
      config: t.config,
      points: [],
      firstServer: Math.random() < 0.5 ? 'a' : 'b',
      status: 'pending',
      tournamentId,
      round,
      slot,
    }
    commit({ ...data, matches: [...data.matches, m] })
    return m
  },

  deleteTournament(id: Id) {
    commit({
      ...data,
      tournaments: data.tournaments.filter((t) => t.id !== id),
      matches: data.matches.filter((m) => m.tournamentId !== id),
    })
  },

  ...playActions,

  importData(next: AppData) {
    commit(validate(next))
  },

  resetAll() {
    commit(EMPTY)
  },
}
