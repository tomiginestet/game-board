import { useSyncExternalStore } from 'react'
import { canChange, denialFor, getAccess, reportDenied, type Authored } from './access'
import { applyEntities, diffData, entityKey, KINDS, LISTS, listOf, type EntityChange, type RemoteEntity } from './diff'
import { autoResult, computeLive, defaultConfig } from './engine'
import { knockoutSeedsIdx, nextTables, roundRobinIdx, splitTables, tableRounds, cupStandings } from './cups'
import { findGame } from './games'
import type { CupFormat, GameDef, OptionValue } from './games/schema'
import { computeMatch } from './pingpong/scoring'
import { involves } from './pingpong/teams'
import { cleanStake } from './stake'
import { knockoutSeeds, roundRobin, shuffle } from './pingpong/tournament'
import type { MatchConfig, Side, TournamentFormat } from './pingpong/types'
import type {
  AppData,
  Cup,
  CupEntrant,
  CupSchedule,
  CustomGame,
  Id,
  LogEntry,
  Play,
  PlayResult,
  PlaySide,
  PlayStake,
  Player,
  PPMatch as Match,
  PPTournament as Tournament,
  Team,
} from './types'

const STORAGE_KEY = 'game-board-data-v1'
/** Datos de cada grupo, guardados aparte para cambiar entre grupos al instante (y sin conexión). */
const SCOPE_PREFIX = STORAGE_KEY + ':'
let storageKey = STORAGE_KEY

export const EMPTY: AppData = { version: 1, players: [], matches: [], tournaments: [], plays: [], cups: [], games: [], teams: [] }

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
    teams: list(d.teams),
  }
}

let data: AppData = load()
const listeners = new Set<() => void>()
let changeListener: ((changes: EntityChange[]) => void) | undefined

/** Registra quién se entera de los cambios hechos localmente (la sincronización). */
export function onLocalChanges(fn: (changes: EntityChange[]) => void) {
  changeListener = fn
}

/**
 * Cambios hechos acá: si alguno no está permitido (sin cuenta, o algo que no es tuyo) no se guarda
 * nada y se avisa. Lo nuevo queda a nombre de quien lo crea.
 */
function authorize(prev: AppData, next: AppData, changes: EntityChange[]): AppData | null {
  const access = getAccess()
  const uid = access.mode === 'guest' ? undefined : access.uid
  let out = next
  for (const c of changes) {
    const before = listOf(prev, c.kind).find((e) => e.id === c.id) as Authored | undefined
    const after = c.deleted ? undefined : listOf(next, c.kind).find((e) => e.id === c.id)
    if (!canChange(access, c.kind, before, after)) {
      reportDenied(denialFor(access))
      return null
    }
    if (!before && after && uid && !(after as Authored).createdBy) {
      const list = listOf(out, c.kind).map((e) => (e.id === c.id ? { ...e, createdBy: uid } : e))
      out = { ...out, [LISTS[c.kind]]: list }
    }
  }
  return out
}

/** Devuelve `false` si el cambio no estaba permitido (y no se guardó). */
function commit(next: AppData, options: { remote?: boolean } = {}): boolean {
  const prev = data
  if (!options.remote) {
    const changes = diffData(prev, next)
    const allowed = changes.length ? authorize(prev, next, changes) : next
    if (!allowed) return false
    next = allowed
    data = next
    if (changes.length && changeListener) changeListener(changes)
  } else {
    data = next
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Sin espacio o modo privado: seguimos en memoria.
  }
  listeners.forEach((l) => l())
  return true
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

/**
 * Pone `uid` como autor de lo que no tiene (o sólo de `only`, claves de `entityKey`), sin generar cambios
 * para subir: al pasar los datos de este dispositivo a un club, antes de subirlos.
 */
export function stampAuthor(uid: string, only?: Set<string>) {
  const next: AppData = { ...data }
  for (const kind of KINDS) {
    const list = listOf(data, kind) as Authored[]
    ;(next as unknown as Record<string, unknown>)[LISTS[kind]] = list.map((e) => (e.createdBy || (only && !only.has(entityKey(kind, e.id))) ? e : { ...e, createdBy: uid }))
  }
  commit(next, { remote: true })
}

/** Reemplaza todos los datos locales sin generar cambios para subir. */
export function replaceAllFromRemote(next: AppData) {
  commit(next, { remote: true })
}

function updateMatch(id: Id, fn: (m: Match) => Match) {
  commit({ ...data, matches: data.matches.map((m) => (m.id === id ? fn(m) : m)) })
}

/** Aplica un nuevo listado de puntos y actualiza estado/ganador del partido. */
/**
 * Horas de los puntos ya anotados, alineadas con `points`. Un partido que empezó antes de que se
 * guardaran (o que viene de otra app) completa los que faltan con 0: "hora desconocida".
 */
function timesOf(m: Match): number[] {
  const t = m.pointTimes ?? []
  return m.points.map((_, i) => t[i] ?? 0)
}

function withPoints(m: Match, points: Side[], pointTimes?: number[]): Match {
  const state = computeMatch(points, m.config, m.firstServer)
  const next: Match = { ...m, points, status: state.finished ? 'finished' : 'live', startedAt: m.startedAt ?? Date.now() }
  if (pointTimes) next.pointTimes = pointTimes
  else delete next.pointTimes
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
  if (p.status === 'finished' && (game.mode === 'counter' || game.mode === 'rounds' || game.mode === 'sets')) {
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

/** Lado de una partida de torneo: un equipo fijo juega con su plantel de ese momento. */
function entrantSide(e: CupEntrant): PlaySide {
  const team = e.teamId ? data.teams.find((t) => t.id === e.teamId) : undefined
  const players = team?.players.length ? [...team.players] : e.players
  return { players, ...(team || e.name ? { name: team?.name ?? e.name } : {}), ...(e.teamId ? { teamId: e.teamId } : {}) }
}

/**
 * Día, hora y cancha de cada partida de una fecha: la fecha `round` cae `everyDays` días después de la
 * anterior; los partidos de esa fecha se reparten entre las canchas y, si hay más partidos que canchas,
 * se juegan uno después del otro (cada `gapMinutes`).
 */
export function slotTime(schedule: CupSchedule | undefined, venues: string[] | undefined, round: number, index: number, perRound = 1): Pick<Play, 'scheduledAt' | 'venue'> {
  const out: Pick<Play, 'scheduledAt' | 'venue'> = {}
  const count = venues?.length ?? 0
  if (count) out.venue = venues![index % count]
  if (schedule) {
    let turn = Math.floor(index / Math.max(1, count))
    // Todo el mismo día: cada fecha empieza cuando termina la anterior.
    if (!schedule.everyDays) turn += round * Math.ceil(Math.max(1, perRound) / Math.max(1, count))
    const base = new Date(schedule.start)
    // Se suma por días de calendario (no por milisegundos) para que el cambio de horario no corra la hora.
    base.setDate(base.getDate() + round * schedule.everyDays)
    out.scheduledAt = base.getTime() + turn * (schedule.gapMinutes ?? 60) * 60_000
  }
  return out
}

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
  schedule?: CupSchedule
  venues?: string[]
}

const playActions = {
  createPlay(gameId: string, sides: PlaySide[], config?: Record<string, OptionValue>, stake?: PlayStake): Play {
    const game = gameOf(gameId)
    const clean = cleanStake(stake)
    const p = newPlay(gameId, sides, config ?? (game ? defaultConfig(game) : {}), clean ? { stake: clean } : {})
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

  deletePlay(playId: Id): boolean {
    return commit({ ...data, plays: data.plays.filter((p) => p.id !== playId) })
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
    return commit({ ...data, games: data.games.filter((g) => g.id !== id) })
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
      ...(input.schedule ? { schedule: input.schedule } : {}),
      ...(input.venues?.length ? { venues: input.venues } : {}),
    }
    const plays: Play[] = []
    const order = shuffle(input.entrants.map((_, i) => i))
    const perRound = input.format === 'series' ? 1 : Math.floor(input.entrants.length / 2)
    const pending = (sides: PlaySide[], round: number, slot: number, i = 0) =>
      newPlay(input.gameId, sides, input.config, {
        status: 'pending',
        cupId: id,
        round,
        slot,
        createdAt: now + round * 100 + i,
        ...slotTime(cup.schedule, cup.venues, round, slot, perRound),
      })
    if (input.format === 'league') {
      cup.doubleRound = !!input.doubleRound
      roundRobinIdx(input.entrants.length, cup.doubleRound).forEach((round, r) =>
        round.forEach(([a, b], i) => plays.push(pending([entrantSide(input.entrants[order[a]]), entrantSide(input.entrants[order[b]])], r, i, i))),
      )
    } else if (input.format === 'knockout') {
      cup.seeds = knockoutSeedsIdx(order)
      // Con fixture, la primera ronda queda armada desde el principio (con su día y su cancha).
      if (cup.schedule || cup.venues) {
        const seeds = cup.seeds
        let k = 0
        for (let slot = 0; slot < seeds.length / 2; slot++) {
          const a = seeds[2 * slot]
          const b = seeds[2 * slot + 1]
          if (a === null || b === null) continue
          plays.push(
            newPlay(input.gameId, [entrantSide(input.entrants[a]), entrantSide(input.entrants[b])], input.config, {
              status: 'pending',
              cupId: id,
              round: 0,
              slot,
              createdAt: now + slot,
              ...slotTime(cup.schedule, cup.venues, 0, k++, perRound),
            }),
          )
        }
      }
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
    const p = newPlay(cup.gameId, sides, cup.config, { status: 'pending', cupId, round, slot, ...slotTime(cup.schedule, cup.venues, round, slot, Math.floor(cup.entrants.length / 2)) })
    commit({ ...data, plays: [...data.plays, p] })
    return p
  },

  /** Cambia el día, la hora o la cancha de una partida (`null` borra el dato). */
  schedulePlay(playId: Id, when: { scheduledAt?: number | null; venue?: string | null }) {
    updatePlay(playId, (p) => {
      const next: Play = { ...p }
      if (when.scheduledAt === null) delete next.scheduledAt
      else if (when.scheduledAt !== undefined) next.scheduledAt = when.scheduledAt
      if (when.venue === null || when.venue === '') delete next.venue
      else if (when.venue !== undefined) next.venue = when.venue.trim()
      return next
    })
  },

  /** Suma a alguien a un lado de una partida (un refuerzo que llegó, un fichaje nuevo del equipo). */
  addToSide(playId: Id, side: number, playerId: Id) {
    updatePlay(playId, (p) =>
      p.sides[side] && !p.sides.some((s) => s.players.includes(playerId))
        ? { ...p, sides: p.sides.map((s, i) => (i === side ? { ...s, players: [...s.players, playerId] } : s)) }
        : p,
    )
  },

  /** Elige (o saca) la figura del partido. */
  setMvp(playId: Id, playerId: Id | null) {
    updatePlay(playId, (p) => {
      if (!p.result) return p
      const result = { ...p.result }
      if (playerId) result.mvp = playerId
      else delete result.mvp
      return { ...p, result }
    })
  },

  saveTeam(team: Omit<Team, 'id' | 'createdAt'> & { id?: Id; createdAt?: number }): Team {
    const t: Team = { ...team, name: team.name.trim(), id: team.id || uid(), createdAt: team.createdAt ?? Date.now() } as Team
    if (t.captain && !t.players.includes(t.captain)) delete t.captain
    const exists = data.teams.some((x) => x.id === t.id)
    commit({ ...data, teams: exists ? data.teams.map((x) => (x.id === t.id ? t : x)) : [...data.teams, t] })
    return t
  },

  /** Borra un equipo. Sus partidas quedan en el historial, con el nombre que tenían. */
  deleteTeam(id: Id): boolean {
    return commit({ ...data, teams: data.teams.filter((t) => t.id !== id) })
  },

  restoreTeam(team: Team) {
    if (data.teams.some((t) => t.id === team.id)) return
    commit({ ...data, teams: [...data.teams, team] })
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

  deleteCup(cupId: Id): boolean {
    return commit({ ...data, cups: data.cups.filter((c) => c.id !== cupId), plays: data.plays.filter((p) => p.cupId !== cupId) })
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
    const teams = data.teams.some((t) => t.players.includes(id))
      ? data.teams.map((t) => (t.players.includes(id) ? { ...t, players: t.players.filter((x) => x !== id), ...(t.captain === id ? { captain: undefined } : {}) } : t))
      : data.teams
    return commit({ ...data, players: data.players.filter((p) => p.id !== id), teams })
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
    updateMatch(matchId, (m) => (m.status === 'finished' ? m : withPoints(m, [...m.points, side], [...timesOf(m), Date.now()])))
  },

  undoPoint(matchId: Id) {
    updateMatch(matchId, (m) => withPoints(m, m.points.slice(0, -1), m.pointTimes?.slice(0, m.points.length - 1)))
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
      delete next.pointTimes
      return next
    })
  },

  deleteMatch(matchId: Id): boolean {
    return commit({ ...data, matches: data.matches.filter((m) => m.id !== matchId) })
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

  deleteTournament(id: Id): boolean {
    return commit({
      ...data,
      tournaments: data.tournaments.filter((t) => t.id !== id),
      matches: data.matches.filter((m) => m.tournamentId !== id),
    })
  },

  ...playActions,

  importData(next: AppData): boolean {
    return commit(validate(next))
  },

  resetAll(): boolean {
    return commit(EMPTY)
  },
}
