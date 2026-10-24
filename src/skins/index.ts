// El skin de este build. Se elige con `VITE_SKIN` (por defecto, Game Board): cada skin es su propia app,
// con su dominio y su ícono, sobre el mismo motor y la misma base de datos. Ver docs/motor.md.

import { brandFor } from './brands'
import { futbol } from './futbol'
import { gameboard } from './gameboard'
import type { Skin } from './types'

export type { Skin, SkinBrand } from './types'

export const SKINS: Record<string, Skin> = { gameboard, futbol }

export const skin: Skin = SKINS[brandFor(import.meta.env.VITE_SKIN).id]
