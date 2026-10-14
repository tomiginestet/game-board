// Medallas: familias con niveles (bronce, plata, oro...) como en el Ping Pong Club.
// Hay tres capas: generales (todos los juegos juntos), genéricas de cada juego
// (sirven aunque el juego se haya cargado a mano sin premios propios) y las propias de cada juego.

import type { AwardDef, AwardLevel, GameDef, Metric } from './games/schema'
import { ACHIEVEMENT_FAMILIES } from './pingpong/achievements'
import type { PlayerStats as PPStats } from './pingpong/stats'
import type { GameStats, GlobalStats } from './stats'

export interface MedalFamily {
  id: string
  name: string
  measures: string
  unit: (n: number) => string
  levels: AwardLevel[]
}

export interface MedalProgress {
  family: MedalFamily
  value: number
  /** Índice del nivel alcanzado, -1 si ninguno. */
  level: number
  next?: AwardLevel
  ratio: number
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function progressOf(family: MedalFamily, value: number): MedalProgress {
  let level = -1
  family.levels.forEach((l, i) => {
    if (value >= l.at) level = i
  })
  const next = family.levels[level + 1]
  return { family, value, level, next, ratio: next ? Math.min(1, value / next.at) : 1 }
}

// ---------------------------------------------------------------------------
// Generales: miran todos los juegos juntos.

interface GlobalFamily extends MedalFamily {
  value: (s: GlobalStats) => number
}

export const GLOBAL_FAMILIES: GlobalFamily[] = [
  {
    id: 'wins',
    name: 'Victorias',
    measures: 'Partidas ganadas, de cualquier juego',
    unit: (n) => plural(n, 'victoria', 'victorias'),
    value: (s) => s.wins,
    levels: [
      { at: 1, name: 'Primera ficha', description: 'La primera que ganaste. Se arranca de a una.' },
      { at: 10, name: 'Ya no sos turista', description: 'Diez ganadas: tirá la cámara y agarrá el mate, ya sos local.' },
      { at: 25, name: 'Pulpo de mesa', description: 'Veinticinco: tenés un tentáculo en cada juego.' },
      { at: 50, name: 'Dueño del tablero', description: 'Cincuenta victorias. El tablero ya viene con tu nombre.' },
      { at: 100, name: 'Capo di tutti capi', description: 'Cien ganadas. Te besan el anillo antes de repartir.' },
    ],
  },
  {
    id: 'streak',
    name: 'Racha',
    measures: 'Mejor racha de partidas ganadas seguidas, mezclando juegos',
    unit: (n) => plural(n, 'victoria seguida', 'victorias seguidas'),
    value: (s) => s.bestStreak,
    levels: [
      { at: 3, name: 'Se pasó el agua', description: 'Empezás a calentar: la pava ya silba.' },
      { at: 5, name: 'Está que arde', description: 'La racha está en la parrilla y larga humo.' },
      { at: 7, name: 'On fire', description: '"He\'s on fire!", como en el NBA Jam.' },
      { at: 10, name: 'D10S', description: 'Diez seguidas te ponen en el altar.' },
      { at: 15, name: 'Modo Saiyan', description: 'Quince al hilo: pasaste de nivel, como Goku.' },
      { at: 20, name: 'Barrilete cósmico', description: '"¿De qué planeta viniste?" Veinte seguidas no es de este mundo.', face: '#1E2B5C' },
    ],
  },
  {
    id: 'played',
    name: 'Habitué',
    measures: 'Partidas jugadas, ganadas o perdidas',
    unit: (n) => plural(n, 'partida', 'partidas'),
    value: (s) => s.played,
    levels: [
      { at: 10, name: 'Fichado', description: 'Diez partidas: ya marcás tarjeta.' },
      { at: 25, name: 'Silla con tu nombre', description: 'Veinticinco. Nadie se sienta en tu lugar.' },
      { at: 50, name: 'Llave de la casa', description: 'Cincuenta partidas: ya tenés copia de la llave.' },
      { at: 100, name: 'Patrimonio del grupo', description: 'Cien partidas. Te declararon monumento histórico.' },
      { at: 250, name: 'Mueble de living', description: 'Doscientas cincuenta. Ya sos parte del sillón.' },
      { at: 500, name: 'Viejo lobo', description: 'Quinientas partidas. Te gana sin mirar las cartas.' },
    ],
  },
  {
    id: 'allround',
    name: 'Todoterreno',
    measures: 'Juegos distintos en los que ganaste al menos una vez',
    unit: (n) => plural(n, 'juego', 'juegos'),
    value: (s) => s.gamesWon,
    levels: [
      { at: 3, name: 'Navaja suiza', description: 'Ganaste en tres juegos distintos. Servís para todo.' },
      { at: 5, name: 'Hombre orquesta', description: 'Cinco juegos: tocás todos los instrumentos a la vez.' },
      { at: 8, name: 'Enciclopedia Salvat', description: 'Ocho juegos. Tenés todos los tomos, hasta el del índice.' },
      { at: 12, name: 'Parque de diversiones', description: 'Doce juegos distintos ganados. Sos el Italpark entero.' },
    ],
  },
  {
    id: 'bigtable',
    name: 'Mesa larga',
    measures: 'Partidas ganadas contra 3 o más rivales',
    unit: (n) => plural(n, 'mesa ganada', 'mesas ganadas'),
    value: (s) => s.bigTableWins,
    levels: [
      { at: 1, name: 'Cabecera de mesa', description: 'Le ganaste a una mesa de cuatro. Te toca la cabecera.' },
      { at: 5, name: 'Mesa de Navidad', description: 'Cinco mesas grandes. Ni la tía que pregunta por la novia te para.' },
      { at: 15, name: 'Asado de 40 personas', description: 'Quince mesas llenas. Sos el asador del casamiento.' },
    ],
  },
  {
    id: 'giant',
    name: 'Matagigantes',
    measures: 'Diferencia de Elo con el rival más fuerte que venciste',
    unit: (n) => `+${n} de Elo`,
    value: (s) => s.biggestUpset,
    levels: [
      { at: 100, name: 'La gomera', description: 'David contra Goliat, con la gomera de cuando eras pibe.' },
      { at: 200, name: 'Hormiga Atómica', description: 'Chiquita, pero levanta una pelota gigante.' },
      { at: 300, name: 'Batacazo', description: 'Pagabas 50 a 1 y ganaste igual.' },
    ],
  },
  {
    id: 'champion',
    name: 'Campeón',
    measures: 'Torneos ganados, de cualquier juego',
    unit: (n) => plural(n, 'torneo', 'torneos'),
    value: (s) => s.cupsWon,
    levels: [
      { at: 1, name: 'Campeón', description: 'La primera copa. Se festeja con sidra.' },
      { at: 2, name: 'Dale campeón', description: 'El bombo de la hinchada ya tiene tu nombre.' },
      { at: 3, name: 'La tercera', description: 'Tres torneos, tres estrellas. Pura Qatar 2022.' },
      { at: 5, name: 'La Scaloneta', description: 'Cinco títulos y te reciben en el Obelisco.' },
    ],
  },
  {
    id: 'coop',
    name: 'Todos para uno',
    measures: 'Partidas cooperativas ganadas',
    unit: (n) => plural(n, 'victoria en equipo', 'victorias en equipo'),
    value: (s) => s.coopWins,
    levels: [
      { at: 1, name: 'Uno para todos', description: 'La primera ganada en equipo. Mano sobre mano.' },
      { at: 5, name: 'Equipo de rescate', description: 'Cinco rescates: el grupo te tira el salvavidas a vos.' },
      { at: 15, name: 'Los Increíbles', description: 'Quince victorias en equipo. Tienen traje y todo.' },
    ],
  },
]

export function globalMedals(s: GlobalStats): MedalProgress[] {
  return GLOBAL_FAMILIES.map((f) => progressOf(f, f.value(s)))
}

// ---------------------------------------------------------------------------
// Genéricas de cada juego (sirven para cualquier juego, aunque no tenga premios propios).

const SPECIALIST_LEVELS: AwardLevel[] = [
  { at: 1, name: 'Debut soñado', description: 'Tu primera victoria en este juego. Saludo al público.' },
  { at: 5, name: 'Le agarraste la mano', description: 'Cinco ganadas: ya no leés el reglamento.' },
  { at: 15, name: 'Especialista', description: 'Quince ganadas. Te consultan las dudas de reglas.' },
  { at: 30, name: 'Doctorado', description: 'Treinta victorias. Podés dar clases en la UBA.' },
  { at: 60, name: 'Leyenda viviente', description: 'Sesenta ganadas. Te hacen una estatua en la plaza.' },
]

function specialist(game: GameDef): MedalFamily {
  return {
    id: `specialist`,
    name: `Especialista`,
    measures: `Partidas ganadas de ${game.name}`,
    unit: (n) => plural(n, 'victoria', 'victorias'),
    levels: SPECIALIST_LEVELS,
  }
}

function streakFamily(game: GameDef): MedalFamily {
  return {
    id: 'gameStreak',
    name: 'Racha',
    measures: `Mejor racha de victorias seguidas en ${game.name}`,
    unit: (n) => plural(n, 'victoria seguida', 'victorias seguidas'),
    levels: GLOBAL_FAMILIES[1].levels.slice(0, 4),
  }
}

// ---------------------------------------------------------------------------
// Propias de cada juego.

export function awardFamily(a: AwardDef): MedalFamily {
  return {
    id: a.id,
    name: a.name,
    measures: a.measures,
    unit: (n) => (n === 1 && a.unitOne ? a.unitOne : a.unit.replace('{n}', String(n))),
    levels: a.levels,
  }
}

export function metricValue(m: Metric, s: GameStats): number {
  switch (m.type) {
    case 'wins':
      return s.wins
    case 'played':
      return s.played
    case 'bestStreak':
      return s.bestStreak
    case 'shutoutWins':
      return s.shutoutWins
    case 'scoreMax':
      return s.scoreMax
    case 'marginMax':
      return s.marginMax
    case 'coopWins':
      return s.coopWins
    case 'eventTotal':
      return s.events[m.event]?.total ?? 0
    case 'eventMax':
      return s.events[m.event]?.max ?? 0
    case 'playsWithEvent':
      return s.events[m.event]?.plays ?? 0
    case 'winsWithEvent':
      return s.events[m.event]?.wins ?? 0
    case 'statTotal':
      return s.statTotal[m.stat] ?? 0
    case 'statMax':
      return s.statMax[m.stat] ?? 0
    case 'winsWithChoice':
      return s.choiceWins[`${m.stat}:${m.value}`] ?? 0
    case 'winsAsRole':
      return s.roleWins[m.role] ?? 0
    case 'scored':
      return s.scored
    case 'scoredMax':
      return s.scoredMax
    case 'assists':
      return s.assists
    case 'mvp':
      return s.mvps
  }
}

/** Medallas de un jugador en un juego: las genéricas más las propias. Ping pong usa las del Ping Pong Club. */
export function gameMedals(game: GameDef, s: GameStats, ppStats?: PPStats): MedalProgress[] {
  if (game.id === 'pingpong') {
    return ACHIEVEMENT_FAMILIES.map((f) => progressOf({ ...f, levels: f.levels }, ppStats?.[f.stat] ?? 0))
  }
  const generic = [progressOf(specialist(game), s.wins)]
  if (game.mode !== 'coop') generic.push(progressOf(streakFamily(game), s.bestStreak))
  return [...game.awards.map((a) => progressOf(awardFamily(a), metricValue(a.metric, s))), ...generic]
}

export function unlockedCount(list: MedalProgress[]): number {
  return list.reduce((sum, p) => sum + p.level + 1, 0)
}

export function totalLevels(list: MedalProgress[]): number {
  return list.reduce((sum, p) => sum + p.family.levels.length, 0)
}

/** Medallas que subieron de nivel entre dos momentos (para festejar al terminar una partida). */
export function levelUps(before: MedalProgress[], after: MedalProgress[]): MedalProgress[] {
  return after.filter((a) => {
    const b = before.find((x) => x.family.id === a.family.id && x.family.name === a.family.name)
    return a.level > (b?.level ?? -1)
  })
}

/** Medallas con algo de avance que todavía no se ganaron, de la más cercana a la más lejana. */
export function closestFirst<T extends { progress: MedalProgress }>(list: T[]): T[] {
  const missing = (p: MedalProgress) => (p.next ? p.next.at - p.value : Infinity)
  return list
    .filter(({ progress: p }) => p.next && p.value > 0 && p.ratio < 1)
    .sort((a, b) => b.progress.ratio - a.progress.ratio || missing(a.progress) - missing(b.progress))
}

/**
 * "Faltan 3 victorias", "Faltan 55 de ELO", "Falta 1 caballero". Si la unidad no empieza con el número
 * ("ganó por 3", "nivel 2", "de 5 abajo"), queda sólo el número: "Faltan 3".
 */
export function missingLabel(family: Pick<MedalFamily, 'unit'>, missing: number): string {
  const verb = missing === 1 ? 'Falta' : 'Faltan'
  const m = family.unit(missing).match(/^\+?(\d+)\s+(.+)$/)
  return m && Number(m[1]) === missing ? `${verb} ${missing} ${m[2]}` : `${verb} ${missing}`
}

// ---------------------------------------------------------------------------
// Próximas medallas (para "Medallas a la vista" y para el resumen de una partida).

export interface MedalInReach {
  playerId: string
  /** Dónde se gana: el nombre del juego, o "General". */
  where: string
  /** Id del juego, o undefined si es general. */
  gameId?: string
  progress: MedalProgress
}

/**
 * Medallas por ganar de un jugador, de la más cercana a la más lejana: las generales y las de cada juego
 * que jugó (o sólo las de `onlyGame`, si se pide).
 */
export function medalsInReach(
  s: GlobalStats,
  gameOf: (gameId: string) => GameDef | undefined,
  opts: { onlyGame?: string; pp?: PPStats } = {},
): MedalInReach[] {
  const out: MedalInReach[] = globalMedals(s).map((progress) => ({ playerId: s.playerId, where: 'General', progress }))
  for (const [gameId, gs] of s.perGame) {
    if (opts.onlyGame && gameId !== opts.onlyGame) continue
    const game = gameOf(gameId)
    if (game) for (const progress of gameMedals(game, gs, opts.pp)) out.push({ playerId: s.playerId, where: game.name, gameId, progress })
  }
  return closestFirst(out)
}

/**
 * "A Caro le falta 1 victoria para «Ya no sos turista»", "… para «Le agarraste la mano» en Truco".
 * Para una medalla que todavía no se ganó (con `next`).
 */
export function nextMedalHint(name: string, near: Pick<MedalInReach, 'where' | 'gameId' | 'progress'>): string {
  const { family, next, value } = near.progress
  if (!next) return ''
  const label = missingLabel(family, next.at - value)
  const where = near.gameId ? ` en ${near.where}` : ''
  return `A ${name} le ${label.charAt(0).toLowerCase()}${label.slice(1)} para «${next.name}»${where}.`
}
