// Kit de las ilustraciones nuevas de medallas: pines de esmalte duro (ver docs/medallas-filosofia.md).
//
// Reglas:
// - Campos de esmalte plenos de la paleta `ENAMEL` (la misma en toda la colección), sin degradés.
// - Cada cambio de color lleva un filete de metal (`wire`) del mismo grosor; los detalles finos, los números y
//   las estrellas son metal macizo (`solid`). El metal lo pone el marco según el nivel.
// - Un protagonista, centrado, con aire alrededor. Geometría exacta: curvas limpias, simetrías reales.
// - Los fondos grandes llevan el guilloché del nivel (`guil`), que aparece de oro para arriba.
// - El humor va en un detalle (un bigote, una boina, una rosa), nunca en caras de dibujito.

import { f } from './helpers'

/** Esmaltes de la colección. */
export const ENAMEL = {
  white: '#FBF7EF',
  ivory: '#F3E8D2',
  cream: '#E6D2AC',
  sky: '#8CC2E4',
  cobalt: '#2E5BA6',
  navy: '#1D2B53',
  midnight: '#141B38',
  crimson: '#C42E3B',
  wine: '#7E1A2C',
  coral: '#EB7A5C',
  blush: '#F0BBA5',
  mustard: '#E9B04B',
  ochre: '#BF8530',
  jade: '#3E9E78',
  forest: '#1E5A47',
  plum: '#4A2A63',
  lilac: '#B9A3DA',
  charcoal: '#2B2B33',
  slate: '#565F6E',
  gray: '#A4ABB5',
  leather: '#7A4424',
  tan: '#B9804F',
} as const

/** Herramientas de un pin. `u` es el mismo número que recibe la ilustración (ids únicos y metal del marco). */
export function pin(u: number) {
  const metal = `url(#mw${u})`, dark = `url(#md${u})`
  let n = 0
  const id = (p: string) => `${p}${u}p${n++}`
  /** Filete de metal en relieve sobre un trazo. */
  const wire = (d: string, w = 1.2) =>
    `<path d="${d}" fill="none" stroke="${dark}" stroke-width="${f(w + 0.6)}" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${metal}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`
  /** Campo de esmalte con su filete alrededor. */
  const cell = (d: string, color: string, w = 1.2, t = '') =>
    `<g${t ? ` transform="${t}"` : ''}><path d="${d}" fill="${color}"/>${wire(d, w)}</g>`
  /** Pieza de metal macizo. */
  const solid = (d: string, t = '') => `<path d="${d}" fill="${metal}" stroke="${dark}" stroke-width=".6" stroke-linejoin="round"${t ? ` transform="${t}"` : ''}/>`
  /** Guilloché del nivel recortado a un campo. */
  const guil = (d: string) => {
    const c = id('g')
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><use href="#mgu${u}" clip-path="url(#${c})"/>`
  }
  /** Aro (halos, anillos): de metal macizo o, con `color`, de esmalte con sus filetes. */
  const ring = (cx: number, cy: number, rx: number, ry: number, t: number, color?: string) => {
    const out = ellipse(cx, cy, rx, ry), inn = ellipse(cx, cy + t * 0.15, rx - t, ry - t * 0.6)
    return color
      ? `<path d="${out} ${inn}" fill-rule="evenodd" fill="${color}"/>` + wire(out, 0.7) + wire(inn, 0.7)
      : `<path d="${out} ${inn}" fill-rule="evenodd" fill="${metal}" stroke="${dark}" stroke-width=".6"/>`
  }
  /** Estrella de metal de cinco puntas. */
  const star = (x: number, y: number, r: number) => solid(starPath(x, y, r, r * 0.45, 5))
  return { metal, dark, id, wire, cell, solid, guil, ring, star }
}
export type Pin = ReturnType<typeof pin>

/** Polígono de estrella como path. */
export function starPath(cx: number, cy: number, R: number, r: number, n: number, rot = -90): string {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r : R
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a))
  }
  return d + 'Z'
}

/** Elipse como path (para filetes y campos). */
export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${cy}Z`

/** Meeple de pie, con la base en y=26 y la cabeza en y=-26 (antes de escalar). */
export const MEEPLE =
  'M0 -26C5.4 -26 9.6 -21.9 9.6 -16.8C9.6 -14.1 8.5 -11.9 6.8 -10.5C11.8 -10.2 16.6 -9.6 20 -8.2C24.2 -6.6 24.2 .4 20 1.6C17 2.5 14.2 2.8 12 3.8C13.4 9.8 17.4 15.6 20 20.2C21.8 23.4 20.2 26 17 26L7 26C5.4 20.4 3 14.6 0 14.6' +
  'C-3 14.6 -5.4 20.4 -7 26L-17 26C-20.2 26 -21.8 23.4 -20 20.2C-17.4 15.6 -13.4 9.8 -12 3.8C-14.2 2.8 -17 2.5 -20 1.6C-24.2 .4 -24.2 -6.6 -20 -8.2C-16.6 -9.6 -11.8 -10.2 -6.8 -10.5C-8.5 -11.9 -9.6 -14.1 -9.6 -16.8C-9.6 -21.9 -5.4 -26 0 -26Z'
