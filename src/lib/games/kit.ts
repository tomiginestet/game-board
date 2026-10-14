// Piezas repetidas de las fichas de deportes (opciones de sets, niveles de medallas).

import type { AwardLevel, GameOption } from './schema'

/** Nivel de medalla. Su ilustración va en `src/lib/art/nuevas/<juego>.ts`, con la clave igual al nombre. */
export const lv = (at: number, name: string, description: string): AwardLevel => ({ at, name, description })

/** "Al mejor de 3 / 5 sets". */
export const bestOfOption = (def: number, choices: number[] = [1, 3, 5]): GameOption => ({
  id: 'bestOf',
  label: 'Al mejor de',
  type: 'select',
  default: def,
  choices: choices.map((n) => ({ value: n, label: n === 1 ? 'Un set' : `${n} sets` })),
})

/** "Sets a 11, 15 o 21 puntos". */
export const setPointsOption = (def: number, choices: number[]): GameOption => ({
  id: 'setPoints',
  label: 'Cada set a',
  type: 'select',
  default: def,
  choices: choices.map((n) => ({ value: n, label: `${n} puntos` })),
})

export const goldenPointOption = (def = false): GameOption => ({
  id: 'goldenPoint',
  label: 'Punto de oro',
  type: 'boolean',
  default: def,
  help: 'En 40 iguales no hay ventaja: el próximo punto se lleva el game.',
})

export const superTiebreakOption = (def = false): GameOption => ({
  id: 'superTiebreak',
  label: 'Super tie-break en el tercero',
  type: 'boolean',
  default: def,
  help: 'Si quedan 1 a 1 en sets, se define con un tie-break a 10 en lugar de un tercer set.',
})
