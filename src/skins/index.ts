// El skin de este build. Se elige con `VITE_SKIN` (por defecto, Game Board): cada skin es su propia app,
// con su dominio y su ícono, sobre el mismo motor y la misma base de datos. Ver docs/motor.md.

import { brandFor } from './brands'
import { gameboard } from './gameboard'
import type { Skin } from './types'

export type { Skin, SkinBrand } from './types'

const SKINS: Record<string, Skin> = { gameboard }

export const skin: Skin = SKINS[brandFor(import.meta.env.VITE_SKIN).id]
