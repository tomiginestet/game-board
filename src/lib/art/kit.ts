// Kit de las ilustraciones nuevas de medallas (ver docs/medallas-filosofia.md).
//
// Reglas:
// - Sin contornos ni filetes: las formas se separan sólo por color y por luz.
// - Una sola luz, arriba a la izquierda. Cada objeto tiene su lado en sombra, un brillo suave y, si apoya en
//   algo, una sombra proyectada difusa.
// - Fondos con degradé y un halo de luz detrás del protagonista; nada de rayas ni patrones.
// - Un solo símbolo por medalla, grande y con aire alrededor. Pocos colores, bien elegidos.
// - Encima de todo, un grano fino (`grain`) que le da textura de impresión.

import { f } from './helpers'

type Stop = [number, string, number?]

/** Herramientas de una ilustración. `u` hace únicos los ids cuando hay varias medallas en la página. */
export function kit(u: number) {
  const defs: string[] = []
  const seen = new Map<string, string>()
  let n = 0
  const id = (p: string) => `${p}${u}_${n++}`
  const stops = (s: Stop[]) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('')
  const def = (key: string, make: (i: string) => string) => {
    let i = seen.get(key)
    if (!i) {
      i = id('k')
      seen.set(key, i)
      defs.push(make(i))
    }
    return `url(#${i})`
  }
  /** Degradé lineal (en fracciones de la caja de la forma). */
  const lin = (s: Stop[], x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
    def(`l${JSON.stringify(s)}${x1},${y1},${x2},${y2}`, (i) => `<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`)
  /** Degradé radial (en fracciones de la caja de la forma). */
  const rad = (s: Stop[], cx = 0.5, cy = 0.5, r = 0.5) =>
    def(`r${JSON.stringify(s)}${cx},${cy},${r}`, (i) => `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`)
  /** Contenido recortado a una forma (para sombras y brillos que no se salen del objeto). */
  const clip = (d: string, inner: string) => {
    const c = id('c')
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><g clip-path="url(#${c})">${inner}</g>`
  }
  /** Halo de luz. */
  const glow = (x: number, y: number, r: number, color: string, a = 0.6) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${rad([[0, color, a], [0.55, color, a * 0.35], [1, color, 0]])}"/>`
  /** Sombra proyectada difusa. */
  const shadow = (x: number, y: number, rx: number, ry: number, a = 0.3, color = '#0B1020') =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${rad([[0, color, a], [1, color, 0]])}"/>`
  /** Grano de impresión sobre toda la ilustración. */
  const grain = (a = 0.16) => {
    const g = id('n')
    return (
      `<filter id="${g}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="${u % 97}" stitchTiles="stitch"/>` +
      `<feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.6 -.55"/></filter>` +
      `<rect x="0" y="0" width="120" height="130" filter="url(#${g})" opacity="${a}" style="mix-blend-mode:overlay"/>`
    )
  }
  return { id, lin, rad, clip, glow, shadow, grain, defs: () => (defs.length ? `<defs>${defs.join('')}</defs>` : '') }
}
export type Kit = ReturnType<typeof kit>

/** Elipse como path. */
export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${cy}Z`

/** Polígono de estrella como path. */
export function starPath(cx: number, cy: number, R: number, r: number, n: number, rot = -90): string {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r : R
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a))
  }
  return d + 'Z'
}

/**
 * Contorno de un tubo que se afina a lo largo de una curva cuadrática (de `w0` a `w1` de ancho), con la punta
 * redondeada. Sirve para colas, cintas y sogas.
 */
export function taper(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1: number): string {
  const N = 16, L: string[] = [], R: string[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = 1 - t
    const x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
    const dx = 2 * a * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * a * (cy - y0) + 2 * t * (y1 - cy)
    const len = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * t) / 2
    L.push(`${f(x - (dy / len) * w)} ${f(y + (dx / len) * w)}`)
    R.push(`${f(x + (dy / len) * w)} ${f(y - (dx / len) * w)}`)
  }
  const r = f(Math.max(w1 / 2, 0.1))
  return `M${L.join('L')}A${r} ${r} 0 0 0 ${R[N]}L${R.reverse().join('L')}Z`
}

/** Meeple de pie, con la base en y=26 y la cabeza en y=-26 (antes de escalar). */
export const MEEPLE =
  'M0 -26C5.4 -26 9.6 -21.9 9.6 -16.8C9.6 -14.1 8.5 -11.9 6.8 -10.5C11.8 -10.2 16.6 -9.6 20 -8.2C24.2 -6.6 24.2 .4 20 1.6C17 2.5 14.2 2.8 12 3.8C13.4 9.8 17.4 15.6 20 20.2C21.8 23.4 20.2 26 17 26L7 26C5.4 20.4 3 14.6 0 14.6' +
  'C-3 14.6 -5.4 20.4 -7 26L-17 26C-20.2 26 -21.8 23.4 -20 20.2C-17.4 15.6 -13.4 9.8 -12 3.8C-14.2 2.8 -17 2.5 -20 1.6C-24.2 .4 -24.2 -6.6 -20 -8.2C-16.6 -9.6 -11.8 -10.2 -6.8 -10.5C-8.5 -11.9 -9.6 -14.1 -9.6 -16.8C-9.6 -21.9 -5.4 -26 0 -26Z'
