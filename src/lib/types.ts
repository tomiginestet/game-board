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
  /** Equipo fijo del club que juega de este lado. */
  teamId?: Id
}

/** Lo que va pasando en una partida, en orden. Los índices de lado son posiciones en `Play.sides`. */
export type LogEntry =
  /** Puntos en el marcador en vivo; `e` si vienen de un evento. `pl`: quién lo anotó; `as`: quién dio el pase; `m`: minuto del partido. */
  | { k: 'pt'; s: number; n: number; e?: string; pl?: Id; as?: Id; m?: number; t: number }
  /**
   * Evento: `n` es +1/-1 para `count`; para `holder`, `s` es el nuevo dueño (-1 = nadie). `p`: puntos elegidos.
   * `pl`: el jugador que lo hizo (eventos `byPlayer`). `m`: minuto del partido, si corre el cronómetro.
   */
  | { k: 'ev'; s: number; e: string; n: number; p?: number; pl?: Id; m?: number; t: number }
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
  /** Figura del partido. */
  mvp?: Id
}

/** La prenda: por qué se juega ("el que pierde paga la próxima ronda"). Nunca plata. */
export interface PlayStake {
  /** Qué hay que hacer, en infinitivo: "pagar la próxima ronda". */
  text: string
  emoji?: string
  /** A quién le toca: al que pierde (el último, si son más de dos) o al que gana. */
  who: 'loser' | 'winner'
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
  /** Día y hora en que está programada (fixture de una liga). */
  scheduledAt?: number
  /** Dónde se juega ("Cancha 2", "Club Social de Villa Crespo"). */
  venue?: string
  /** Por qué se juega (no en torneos: ahí manda el premio o castigo del torneo). */
  stake?: PlayStake
  /**
   * Convocatoria: los citados a un partido que todavía no tiene equipos armados ("¿quién viene el jueves?").
   * Mientras está pendiente, `sides` puede estar vacío.
   */
  invited?: Id[]
  /** Quién confirmó que viene, que no viene o que capaz. */
  rsvp?: Record<Id, Rsvp>
  /** Equipo fijo al que se convocó (su plantel), si fue desde un equipo. */
  callTeamId?: Id
  /** Cronómetro del partido (deportes por tiempo). */
  clock?: PlayClock
  /** Modo sets: lado que saca primero (0 o 1). */
  firstServer?: number
}

/** Respuesta a una convocatoria. */
export type Rsvp = 'yes' | 'maybe' | 'no'

/** Reloj de juego: tiempo corrido del período en curso, con pausa. */
export interface PlayClock {
  /** Período en juego (0 = primer tiempo). */
  period: number
  /** Milisegundos ya jugados del período, sin contar el tramo en marcha. */
  elapsed: number
  /** Desde cuándo corre (si está en marcha). */
  runningSince?: number
}

/** Un equipo o jugador inscripto en un torneo. */
export interface CupEntrant {
  players: Id[]
  name?: string
  /** Equipo fijo del club (los partidos usan su plantel). */
  teamId?: Id
}

/** Cómo se reparten las fechas de un torneo en el calendario. */
export interface CupSchedule {
  /** Día y hora de la primera fecha. */
  start: number
  /** Días entre una fecha y la siguiente (7: todas las semanas). */
  everyDays: number
  /** Minutos entre dos partidos seguidos en la misma cancha. */
  gapMinutes?: number
}

/** Equipo fijo del club: un plantel con nombre que juega partidos, ligas y torneos. */
export interface Team {
  id: Id
  name: string
  emoji: string
  color: string
  players: Id[]
  /** Juego (deporte) que juega, si es de uno solo. */
  gameId?: string
  /** Capitán o capitana. */
  captain?: Id
  /** Dónde juega de local. */
  home?: string
  createdAt: number
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
  /** Fixture con fecha: cuándo se juega cada fecha. */
  schedule?: CupSchedule
  /** Canchas o lugares donde se juega; los partidos de una misma fecha se reparten entre ellas. */
  venues?: string[]
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
  /** Equipos fijos del club. */
  teams: Team[]
}
