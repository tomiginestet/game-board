// Ficha de un juego: las "piezas" con las que la app entiende cualquier juego.
//
// Todo juego (los que vienen de fábrica, los que se arman a mano y los que
// propone la IA) se describe con este mismo formato, que es JSON puro para
// poder guardarlo, sincronizarlo y pegarlo desde un chat.

/** Cómo se juega y se anota una partida. */
export type PlayMode =
  /** Ping pong: punto a punto con saque, juegos y "al mejor de" (usa el marcador del Ping Pong Club). */
  | 'rally'
  /** Marcador en vivo: cada lado suma puntos tocando botones (truco, ta-te-ti al mejor de N). */
  | 'counter'
  /** Por manos o rondas: al terminar cada mano se carga lo que hizo cada uno (buraco, Skull King, generala). */
  | 'rounds'
  /** Por turnos con puntaje oculto: se pasan los turnos y se registran eventos; el puntaje se confirma al final (Catán). */
  | 'turns'
  /** Sólo resultado: al terminar se elige quién ganó o el orden de llegada (impostor, FIFA, Mario Kart). */
  | 'result'
  /** Cooperativo: todos contra el juego; se gana o se pierde juntos, con un puntaje opcional (Pistas cruzadas). */
  | 'coop'

/** Cómo se arman los lados de una partida. */
export type SidesKind =
  /** Cada uno por su cuenta. */
  | 'individual'
  /** Por equipos (parejas en el truco). */
  | 'teams'
  /** Se puede jugar de las dos formas (ping pong singles o dobles). */
  | 'either'
  /** Todos en el mismo equipo contra el juego. */
  | 'coop'

export type Category = 'deporte' | 'mesa' | 'cartas' | 'fiesta' | 'clasico' | 'dados' | 'video' | 'cooperativo'

export const CATEGORIES: { id: Category; name: string; emoji: string }[] = [
  { id: 'mesa', name: 'Juegos de mesa', emoji: '🎲' },
  { id: 'cartas', name: 'Cartas', emoji: '🃏' },
  { id: 'fiesta', name: 'De fiesta', emoji: '🎉' },
  { id: 'cooperativo', name: 'Cooperativos', emoji: '🤝' },
  { id: 'clasico', name: 'Clásicos', emoji: '♟️' },
  { id: 'dados', name: 'Dados', emoji: '🎯' },
  { id: 'deporte', name: 'Deportes', emoji: '🏓' },
  { id: 'video', name: 'Videojuegos', emoji: '🎮' },
]

export type OptionValue = number | boolean | string

/** Algo que se elige al armar la partida (a cuánto se juega, con o sin flor...). */
export interface GameOption {
  id: string
  label: string
  type: 'number' | 'boolean' | 'select'
  default: OptionValue
  /** Para `select` (y como atajos para `number`). */
  choices?: { value: OptionValue; label: string }[]
  min?: number
  max?: number
  help?: string
}

/**
 * Algo que pasa durante la partida y vale la pena registrar: un poblado
 * construido, el camino más largo, un envido ganado, una canasta limpia.
 * Los eventos alimentan los premios propios del juego.
 */
export interface EventDef {
  id: string
  /** "Camino más largo". */
  name: string
  emoji: string
  /**
   * - `count`: se va sumando (poblados, caballeros jugados, envidos ganados).
   * - `holder`: lo tiene uno solo a la vez y pasa de mano (camino más largo, ejército más grande).
   */
  type: 'count' | 'holder'
  /**
   * Puntos que vale. En `counter` se suman al marcador del lado al tocarlo;
   * en `turns`, al tanteo público; en `rounds`, a la mano de ese lado (puede ser negativo).
   * Para `holder`, los tiene quien lo posee en ese momento.
   */
  points?: number
  /** Si el valor se elige al registrarlo (p. ej. "Bonus" en Skull King). Reemplaza a `points`. */
  askPoints?: boolean
  /** Oculto hasta el final para no revelar la estrategia (cartas de desarrollo jugadas). */
  hidden?: boolean
  /** Al sumar uno, se resta uno de este otro evento (una ciudad reemplaza un poblado). */
  replaces?: string
  /** Evento que no es de ningún lado en particular (un empate en el ta-te-ti). */
  global?: boolean
  /** Hacerlo gana la partida en el acto (cortar con chinchón). */
  winsGame?: boolean
  help?: string
}

/** Dato que se pregunta al final de la partida para cada lado. */
export interface StatDef {
  id: string
  label: string
  type: 'number' | 'choice'
  /** Opciones para `choice`. */
  choices?: string[]
  help?: string
}

/** Qué número mide un premio, calculado sobre el historial de un jugador en ese juego. */
export type Metric =
  /** Partidas ganadas. */
  | { type: 'wins' }
  /** Partidas jugadas. */
  | { type: 'played' }
  /** Mejor racha de victorias seguidas. */
  | { type: 'bestStreak' }
  /** Partidas ganadas sin que el rival sume un punto. */
  | { type: 'shutoutWins' }
  /** Mayor puntaje propio en una partida. */
  | { type: 'scoreMax' }
  /** Mayor diferencia con el segundo en una partida ganada. */
  | { type: 'marginMax' }
  /** Partidas ganadas en cooperativo. */
  | { type: 'coopWins' }
  /** Veces que pasó el evento, sumando todas las partidas. */
  | { type: 'eventTotal'; event: string }
  /** Máximo del evento en una sola partida. */
  | { type: 'eventMax'; event: string }
  /** Partidas en las que lo hizo al menos una vez (o, si es `holder`, lo tenía al terminar). */
  | { type: 'playsWithEvent'; event: string }
  /** Partidas GANADAS en las que lo hizo al menos una vez (o lo tenía al terminar). */
  | { type: 'winsWithEvent'; event: string }
  /** Suma de un dato final numérico. */
  | { type: 'statTotal'; stat: string }
  /** Máximo de un dato final numérico en una partida. */
  | { type: 'statMax'; stat: string }
  /** Partidas ganadas en las que un dato final de opciones valía `value` ("recurso estrella: trigo"). */
  | { type: 'winsWithChoice'; stat: string; value: string }
  /** Partidas ganadas jugando con un rol (impostor). */
  | { type: 'winsAsRole'; role: string }

/** Dibujos genéricos para las medallas que no tienen ilustración propia. */
export const GLYPHS = [
  'crown', 'trophy', 'star', 'flame', 'dice', 'cards', 'heart', 'shield', 'coin', 'meeple',
  'bolt', 'skull', 'rocket', 'brain', 'eye', 'clover', 'gem', 'sword', 'house', 'road',
] as const
export type Glyph = (typeof GLYPHS)[number]

export interface AwardLevel {
  /** Valor mínimo del número para alcanzar el nivel. */
  at: number
  /** Nombre del nivel; también es la clave de su ilustración. */
  name: string
  description: string
  /** Si no hay ilustración con ese nombre: dibujo genérico y color de fondo. */
  glyph?: Glyph
  color?: string
  /** Color de fondo de la ilustración, si no usa el del material. */
  face?: string
}

/** Familia de medallas (con niveles de bronce para arriba), como en el Ping Pong Club. */
export interface AwardDef {
  id: string
  name: string
  /** Qué mide, en una frase. */
  measures: string
  metric: Metric
  /** Cómo se lee un valor: "{n} caminos". `unitOne` para cuando n es 1. */
  unit: string
  unitOne?: string
  levels: AwardLevel[]
}

/** Formatos de torneo. */
export type CupFormat =
  /** Eliminación directa, de a dos lados por partida. */
  | 'knockout'
  /** Todos contra todos, de a dos lados por partida. */
  | 'league'
  /** Mesas rotativas: varias rondas con mesas de 3 a 6 que se mezclan; se suman puntos por puesto. */
  | 'tables'
  /** Partida acumulada: los mismos jugadores juegan N partidas y se suman los puntos. */
  | 'series'

export const CUP_FORMATS: { id: CupFormat; name: string; description: string }[] = [
  { id: 'knockout', name: 'Eliminación directa', description: 'El que pierde se va. Cuadro con BYEs automáticos.' },
  { id: 'league', name: 'Liga', description: 'Todos contra todos (opcional ida y vuelta).' },
  { id: 'tables', name: 'Mesas rotativas', description: 'Varias rondas con mesas mezcladas; se suman puntos por puesto.' },
  { id: 'series', name: 'Partida acumulada', description: 'Los mismos juegan varias partidas y se suman los puntos.' },
]

/** Cómo se calcula el puntaje de una mano en el modo `rounds`. */
export type RoundScorer =
  /** Se carga el número directamente (más los eventos que suman o restan). */
  | 'sum'
  /** Apuesta y bazas (Skull King): acertar suma 20 por baza (o 10 × ronda si apostó 0); errar resta. */
  | 'skullKing'
  /** Apuesta y bazas (La Podrida): acertar suma 10 + 5 por baza... (configurable con `bidHit`, `bidPerTrick`, `bidMiss`). */
  | 'bidTricks'

export interface Scoring {
  /** Puntos para ganar (o para quedar afuera si `eliminateAt`). */
  target?: number
  /** Opción de la partida que define `target` (p. ej. "a 15 o a 30"). */
  targetOption?: string
  /** Gana el que menos puntos tiene (chinchón, golf). */
  lowWins?: boolean
  /** El que llega a este puntaje queda eliminado; gana el último que queda (chinchón a 100). */
  eliminateAt?: number
  eliminateOption?: string
  /** Cantidad fija de manos/rondas (Skull King: 10). */
  rounds?: number
  roundsOption?: string
  /** Nombres de las rondas, si cada una es distinta (categorías de la generala). */
  roundLabels?: string[]
  /** Cómo se calcula una mano en `rounds`. */
  scorer?: RoundScorer
  bidHit?: number
  bidPerTrick?: number
  bidMiss?: number
  /** Puede terminar empatada. */
  allowDraw?: boolean
  /** Botones rápidos para sumar en `counter` (además de los eventos con puntos). */
  quick?: number[]
  /** Etiqueta del botón principal en `counter` ("Ganó la mano"). */
  quickLabel?: string
  /** En `turns`/`result`/`coop`: pedir el puntaje final de cada lado. */
  finalScores?: boolean
  /** Puntaje máximo posible (coop: 25 cartas en Pistas cruzadas). */
  maxScore?: number
  /** Nombre de los puntos: "porotos", "puntos de victoria"... */
  pointsName?: string
  /** Dibujo especial del marcador: fósforos del truco. */
  tally?: 'matches'
}

export interface GameDef {
  id: string
  name: string
  /** Emoji que lo representa en listas. */
  emoji: string
  /** Color del juego (botones, encabezados). */
  color: string
  category: Category
  /** Una línea con gracia, en argentino. */
  tagline: string
  players: { min: number; max: number }
  sides: SidesKind
  /** Jugadores por equipo cuando se juega por equipos. */
  teamSize?: number
  mode: PlayMode
  /** Cuánto "pesa" una partida para los puntos de gloria: 1 liviano (ta-te-ti), 2 medio (truco), 3 pesado (Catán). */
  weight: 1 | 2 | 3
  scoring: Scoring
  options: GameOption[]
  events: EventDef[]
  stats: StatDef[]
  /** Roles que puede tener un lado (Impostor / Tripulante). */
  roles?: string[]
  awards: AwardDef[]
  formats: CupFormat[]
  /** Resumen de las reglas en pocas líneas. */
  rules: string[]
  rulesUrl?: string
  /**
   * Carátula opcional: URL de una imagen (https:// o data:) que se muestra como
   * "caja" del juego en el catálogo. Si no hay (o no carga), la app dibuja una
   * carátula propia a partir del color, la categoría y el emoji (ver GameCover).
   */
  cover?: string
  /** De dónde salió la ficha. */
  source?: 'builtin' | 'custom' | 'ai'
  createdAt?: number
}
