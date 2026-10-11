import type { AppData } from '../types'
import type { GameDef } from './schema'

// Todas las fichas de src/lib/games/catalog/ (una por archivo) se cargan solas.
const modules = import.meta.glob<Record<string, GameDef>>('./catalog/*.ts', { eager: true })

/** Juegos que vienen de fábrica, ordenados por nombre (el ping pong y los "pesados" primero no: alfabético). */
export const BUILTIN_GAMES: GameDef[] = Object.values(modules)
  .flatMap((m) => Object.values(m))
  .filter((g): g is GameDef => !!g && typeof g === 'object' && 'id' in g && 'mode' in g)
  .sort((a, b) => a.name.localeCompare(b.name, 'es'))

const BUILTIN_BY_ID = new Map(BUILTIN_GAMES.map((g) => [g.id, g]))

/** Juegos destacados en la pantalla de inicio. */
export const FEATURED = ['pingpong', 'truco', 'catan', 'buraco', 'skullking', 'impostor', 'pistascruzadas', 'tateti']

/** Todos los juegos disponibles: los de fábrica más los que agregó el grupo. */
export function allGames(data: Pick<AppData, 'games'>): GameDef[] {
  const custom = data.games.filter((g) => !BUILTIN_BY_ID.has(g.id))
  return [...BUILTIN_GAMES, ...custom].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function findGame(data: Pick<AppData, 'games'>, id: string): GameDef | undefined {
  return BUILTIN_BY_ID.get(id) ?? data.games.find((g) => g.id === id)
}

export function isBuiltin(id: string): boolean {
  return BUILTIN_BY_ID.has(id)
}

/** Ficha de reemplazo para partidas de un juego que ya no existe (borrado). */
export function missingGame(id: string): GameDef {
  return {
    id,
    name: 'Juego borrado',
    emoji: '❔',
    color: '#868E96',
    category: 'mesa',
    tagline: '',
    players: { min: 1, max: 20 },
    sides: 'individual',
    mode: 'result',
    weight: 1,
    scoring: {},
    options: [],
    events: [],
    stats: [],
    awards: [],
    formats: [],
    rules: [],
  }
}
