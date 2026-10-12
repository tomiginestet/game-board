import type { CupFormat, GameDef, OptionValue } from './games/schema'
import type { Id, Match as PPMatch, Player, Tournament as PPTournament } from './pingpong/types'

export type { Id, Player, PPMatch, PPTournament }

/** Un lado de la partida: un jugador, una pareja o un equipo. */
export interface PlaySide {
  players: Id[]
  /** Nombre del equipo, si tiene ("Los del fondo"). */
  name?: string
  /** Rol en esta partida (Impostor / Tripulante). */
  role?: string
}

/** Lo que va pasando en una partida, en orden. Los índices de lado son posiciones en `Play.sides`. */
export type LogEntry =
  /** Puntos en el marcador en vivo; `e` si vienen de un evento. */
  | { k: 'pt'; s: number; n: number; e?: string; t: number }
  /** Evento: `n` es +1/-1 para `count`; para `holder`, `s` es el nuevo dueño (-1 = nadie). `p`: puntos elegidos. */
  | { k: 'ev'; s: number; e: string; n: number; p?: number; t: number }
  /** Empieza el turno de un lado. */
  | { k: 'turn'; s: number; t: number }
  /**
   * Una mano completa (modo `rounds`). `sc`: puntaje final de la mano por lado.
   * `in`: lo que se cargó (número directo, apuesta, bazas). `ev`: eventos de la mano (cantidad por lado).
   */
  | {
      k: 'round'
      sc: number[]
      in?: { value?: (number | null)[]; bid?: (number | null)[]; tricks?: (number | null)[] }
      ev?: Record<string, number[]>
      t: number
    }

export interface PlayResult {
  /** Puntaje final por lado (si el juego tiene puntaje). */
  scores?: (number | null)[]
  /** Puesto por lado: 1 = ganador. Los empatados comparten puesto. */
  places: number[]
  /** Cooperativo: si ganaron todos juntos. */
  coopWin?: boolean
  /** Datos finales por lado: `stats[statId][lado]`. */
  stats?: Record<string, (number | string | null)[]>
}

export type PlayStatus = 'pending' | 'live' | 'finished'

/** Una partida de cualquier juego (salvo el ping pong, que usa el formato del Ping Pong Club). */
export interface Play {
  id: Id
  gameId: string
  createdAt: number
  startedAt?: number
  finishedAt?: number
  status: PlayStatus
  config: Record<string, OptionValue>
  sides: PlaySide[]
  log: LogEntry[]
  result?: PlayResult
  /** Torneo al que pertenece. */
  cupId?: Id
  /** Ronda (o jornada) dentro del torneo. Empieza en 0. */
  round?: number
  /** Posición dentro de la ronda (llave o mesa). */
  slot?: number
  note?: string
}

/** Un equipo o jugador inscripto en un torneo. */
export interface CupEntrant {
  players: Id[]
  name?: string
}

/** Torneo de cualquier juego (salvo ping pong, que usa los torneos del Ping Pong Club). */
export interface Cup {
  id: Id
  name: string
  gameId: string
  createdAt: number
  format: CupFormat
  entrants: CupEntrant[]
  config: Record<string, OptionValue>
  /** Liga: ida y vuelta. */
  doubleRound?: boolean
  /** Eliminación: posiciones iniciales del cuadro (índice de inscripto o null = BYE). */
  seeds?: (number | null)[]
  /** Mesas rotativas: cantidad de rondas y jugadores por mesa. Partida acumulada: cantidad de partidas. */
  rounds?: number
  tableSize?: number
  /** Mesas rotativas: si se juega una mesa final con los mejores. */
  final?: boolean
  /** Premio o castigo, en texto libre ("el último lava los platos"). */
  prize?: string
  /** Terminado a mano (para formatos sin fin automático). */
  closedAt?: number
}

/** Juego agregado por el grupo (a mano o con IA). */
export type CustomGame = GameDef & { id: Id; createdAt: number }

export interface AppData {
  version: 1
  players: Player[]
  /** Partidos de ping pong (formato del Ping Pong Club). */
  matches: PPMatch[]
  /** Torneos de ping pong (formato del Ping Pong Club). */
  tournaments: PPTournament[]
  plays: Play[]
  cups: Cup[]
  games: CustomGame[]
}
