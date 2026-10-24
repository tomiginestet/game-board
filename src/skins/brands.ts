// Las marcas de cada skin, sin nada más: es lo único del skin que importa `vite.config.ts`.

import { brand as gameboard } from './gameboard/brand.ts'

/**
 * La marca: datos puros, sin imports, porque también los lee `vite.config.ts` para armar el
 * `index.html` (título, pantalla de inicio, colores) y el manifest de la PWA.
 */
export interface SkinBrand {
  /** Clave del skin: `VITE_SKIN=gameboard`. */
  id: string
  /** "Game Board". */
  name: string
  /** Nombre bajo el ícono del teléfono (12 letras o menos). */
  shortName: string
  /** "Partidas, torneos y quién manda en cada juego." */
  tagline: string
  /** Para buscadores y para compartir. */
  description: string
  /** Fondo de la pantalla de inicio y color de la barra del sistema. Tiene que coincidir con `--bg` del tema. */
  background: string
  text: string
  /** Fuente de la marca (títulos, logo, medallas): familia y hoja de Google Fonts. */
  font: { family: string; href: string }
}

export const BRANDS: Record<string, SkinBrand> = { gameboard }

export const DEFAULT_SKIN = 'gameboard'

/** La marca del skin pedido; si no existe, falla (mejor que publicar una app con la marca equivocada). */
export function brandFor(id: string | undefined): SkinBrand {
  const key = id || DEFAULT_SKIN
  const found = BRANDS[key]
  if (!found) throw new Error(`VITE_SKIN="${key}" no existe. Skins: ${Object.keys(BRANDS).join(', ')}`)
  return found
}
