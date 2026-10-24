// Un skin es una app armada con el motor de Game Board: su marca, su catálogo, qué partes del motor
// usa y cómo las nombra. Se elige al compilar con `VITE_SKIN` (ver `src/skins/index.ts`).

import type { GameDef } from '../lib/games/schema'
import type { SkinBrand } from './brands'

export type { SkinBrand }

export interface Skin extends SkinBrand {
  catalog: {
    /** Qué juegos de fábrica muestra el catálogo (sin esto, todos). Los demás se siguen reconociendo en partidas viejas. */
    include?: (game: GameDef) => boolean
    /** Estante "Destacados" del inicio. */
    featured: string[]
    /** Carrusel grande de arriba del inicio (5–6). */
    hero: string[]
  }
  /** Partes del motor que se prenden o se apagan. */
  modules: {
    tournaments: boolean
    ranking: boolean
  }
  /** Cómo se llaman las cosas en esta app (la navegación y los títulos de pestaña). */
  words: {
    games: string
    play: string
    tournaments: string
    ranking: string
    players: string
  }
  /**
   * Frases propias de este skin, con la frase de Game Board como clave (ver `say`). Lo que no está acá
   * se muestra como en Game Board.
   */
  copy?: Record<string, string>
}
