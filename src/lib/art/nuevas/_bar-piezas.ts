// Piezas compartidas por los deportes de bar y de quinta (pool, dardos, sapo, tejo, cornhole, beer pong): el rótulo
// en cursiva, los resplandores, la madera, el paño, la arena, la cerveza y el disco de metal en perspectiva (la ficha
// del pool y del sapo, el tejo de la playa). No exporta nada terminado en _ART.
import { f } from '../helpers'
import { ellipse, hair, P, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
export const FULL = 'M0 0H120V130H0Z'

/** Madera de bar: clara, media, oscura y la veta. */
export const WOOD_L = '#EBC995', WOOD = '#C98D58', WOOD_D = '#8A5530', WOOD_G = '#6E3F20'
/** Paño de la mesa de pool, apagado como de estampa. */
export const FELT = '#5C8A55', FELT_D = '#33583A', FELT_L = '#8DB27A'
/** Arena de la playa. */
export const SAND = '#EBD8A8', SAND_D = '#C7A86C', SAND_L = '#F7ECCF'
/** Cerveza rubia y su espuma. */
export const BEER = '#E2A23B', BEER_D = '#AE6A1C', FOAM = '#F8F0DC'
/** Negro de la bola 8 y de la diana: una tinta casi negra, sin salir de la paleta. */
export const NEGRA = '#232842', NEGRA_D = '#10142A'

/** Resplandor suave de un color. */
export const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) =>
  k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Rótulo corto en cursiva Georgia. */
export const rotulo = (x: number, y: number, size: number, s: string, o: { rot?: number; c?: string; bold?: boolean; anchor?: string } = {}) =>
  `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic"${o.bold ? ' font-weight="700"' : ''} font-size="${size}" fill="${o.c ?? P.ink}" text-anchor="${o.anchor ?? 'middle'}"${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}>${s}</text>`

/** Estrellitas de la noche. */
export const stars = (pts: number[][], c = P.paper) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r ?? 0.5}" fill="${c}"/>`).join('')

/** Pseudoazar fijo (para que las texturas no cambien entre dibujos). */
export const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Polilínea suavizada (Chaikin). */
export function smooth(pts: number[][], it = 3) {
  let q = pts
  for (let n = 0; n < it; n++) {
    const out: number[][] = [q[0]]
    for (let i = 0; i < q.length - 1; i++) {
      const [a, b] = [q[i], q[i + 1]]
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    out.push(q[q.length - 1])
    q = out
  }
  return q
}

/** Cinta de ancho variable (de w0 a w1) a lo largo de una polilínea suavizada (mangueras, chalas, colas). */
export function stream(pts: number[][], w0: number, w1: number) {
  const q = smooth(pts), L: string[] = [], R: string[] = []
  q.forEach((p, i) => {
    const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * (i / (q.length - 1))) / 2
    L.push(`${f(p[0] - (dy / l) * w)} ${f(p[1] + (dx / l) * w)}`)
    R.push(`${f(p[0] + (dy / l) * w)} ${f(p[1] - (dx / l) * w)}`)
  })
  return `M${L.join('L')}L${R.reverse().join('L')}Z`
}

/** Costado de un cilindro (o de un disco) con la tapa elíptica en (x,y) de radios (rx,ry) y alto h hacia abajo. */
export const cylSide = (x: number, y: number, rx: number, ry: number, h: number) =>
  `M${f(x - rx)} ${y}V${f(y + h)}A${rx} ${ry} 0 0 0 ${f(x + rx)} ${f(y + h)}V${y}A${rx} ${ry} 0 0 1 ${f(x - rx)} ${y}Z`

interface DiscOpts {
  /** Color de la tapa, del canto y del sombreado. */
  c?: string
  edge?: string
  dark?: string
  /** Grabado de la tapa, recortado a ella (en coordenadas de la medalla). */
  top?: string
  w?: number
  /** Anillo grabado en la tapa. */
  ring?: boolean
}
/** Disco de metal acostado en perspectiva (ficha, tejo): la tapa en (x,y) y el canto de alto h. */
export function disc(k: Kit, x: number, y: number, rx: number, ry: number, h: number, o: DiscOpts = {}) {
  const c = o.c ?? P.gold, edge = o.edge ?? P.goldD, dark = o.dark ?? P.goldD
  const side = cylSide(x, y, rx, ry, h), top = ellipse(x, y, rx, ry)
  return k.draw([
    {
      d: side, fill: edge,
      inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, '#5A3412', 0.4) + `<path d="${side}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
        `<path d="M${f(x - rx)} ${f(y + h * 0.5)}A${rx} ${ry} 0 0 0 ${f(x + rx)} ${f(y + h * 0.5)}" fill="none" stroke="${dark}" stroke-width=".3" opacity=".8"/>`,
    },
    {
      d: top, fill: c,
      inner: k.sh(top, 0, 0, 1, 1, 0, 0.85, dark, 0.45) + `<path d="${top}" fill="${k.rad('#ffffff', 0.32, 0.3, 0.55, 0.75, 0)}"/>` +
        (o.ring === false ? '' : `<path d="${ellipse(x, y, f(rx * 0.72), f(ry * 0.72))}" fill="none" stroke="${dark}" stroke-width=".45"/><path d="${ellipse(x, f(y + 0.25), f(rx * 0.72), f(ry * 0.72))}" fill="none" stroke="#fff" stroke-width=".3" opacity=".6" stroke-dasharray="${f(rx * 1.4)} ${f(rx * 3)}"/>`) +
        (o.top ?? '') +
        hair(x - rx * 0.62, y - ry * 0.35, x - rx * 0.2, y - ry * 0.85, x + rx * 0.3, y - ry * 0.78, Math.max(0.5, ry * 0.18), '#fff', 0.85),
    },
  ], o.w ?? 0.6)
}
