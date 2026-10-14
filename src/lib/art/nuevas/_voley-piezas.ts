// Piezas compartidas por las medallas de vóley y beach vóley (no exporta nada que termine en _ART): la pelota de
// gajos en tres aspas (tres bandas curvas por aspa, como las de cuero de toda la vida), la red con su faja blanca
// y los tonos de la arena y el mar.
import { f } from '../helpers'
import { ellipse, hair, P, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
export const FULL = 'M0 0H120V130H0Z'
/** Arena de playa: base, sombra, luz. */
export const ARENA = '#E9D3A0', ARENA_D = '#C29D5E', ARENA_L = '#F6EACB'
/** Mar apagado de estampa. */
export const MAR = '#7FA6C9', MAR_D = '#4F78A6'
/** Piel tostada (para brazos y manos). */
export const PIEL = '#EBC7A2', PIEL_D = '#C48F64'

type Pt = [number, number]
const qpt = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const s = 1 - t
  return [s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]]
}
const dir = (deg: number): Pt => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]

export interface VBallOpts {
  /** Giro de las aspas, en grados. */
  rot?: number
  /** Colores de las tres bandas de cada aspa (de la costura hacia afuera). */
  cols?: [string, string, string]
  /** Corrimiento del centro de las aspas (da volumen), en fracciones del radio. */
  off?: Pt
  shade?: string
  w?: number
  /** Encima de los gajos, recortado a la pelota (arena, pan rallado). */
  over?: string
}

/** Pelota de vóley en (cx,cy) de radio r: tres aspas de tres bandas curvas cada una. */
export function vball(k: Kit, cx: number, cy: number, r: number, o: VBallOpts = {}) {
  const rot = o.rot ?? -100
  const cols = o.cols ?? [P.white, P.gold, P.blue]
  const C: Pt = o.off ?? [0.1, -0.06]
  const P2 = (p: Pt) => `${f(cx + p[0] * r)} ${f(cy + p[1] * r)}`
  const seam = (a: number) => ({ a: C, c: [C[0] + dir(a - 40)[0] * 0.56, C[1] + dir(a - 40)[1] * 0.56] as Pt, b: dir(a) })
  const sample = (a: Pt, c: Pt, b: Pt, t0: number, t1: number, n = 12) => Array.from({ length: n + 1 }, (_, i) => qpt(a, c, b, t0 + ((t1 - t0) * i) / n))
  const ang = (p: Pt) => (Math.atan2(p[1], p[0]) * 180) / Math.PI
  let bands = '', lines = ''
  for (let i = 0; i < 3; i++) {
    const a = rot + i * 120, si = seam(a), sn = seam(a + 120)
    for (let j = 0; j < 3; j++) {
      // Cada banda es la costura del aspa corrida hasta un punto de la costura vecina (paralela a ella).
      const S = qpt(sn.a, sn.c, sn.b, j * 0.38), v: Pt = [S[0] - C[0], S[1] - C[1]]
      const dv = sample(si.a, si.c, si.b, 0, 1.6).map((p) => [p[0] + v[0], p[1] + v[1]] as Pt)
      const back = sample(sn.a, sn.c, sn.b, 1.6, j * 0.38)
      let a0 = ang(dv[dv.length - 1]), a1 = ang(back[0])
      while (a1 < a0) a1 += 360
      const far = Array.from({ length: 7 }, (_, q) => dir(a0 + ((a1 - a0) * q) / 6).map((x) => x * 2) as Pt)
      bands += `<path d="M${[...dv, ...far, ...back].map(P2).join('L')}Z" fill="${cols[j]}"/>`
      lines += 'M' + dv.map(P2).join('L')
    }
  }
  const d = ellipse(cx, cy, r, r)
  const sh = o.shade ?? P.blue
  return k.draw([{
    d, fill: P.white,
    inner:
      bands +
      `<path d="${lines}" fill="none" stroke="${P.ink}" stroke-width="${f(r * 0.045)}" stroke-linecap="round"/>` +
      `<path d="${lines}" fill="none" stroke="#fff" stroke-width="${f(r * 0.018)}" stroke-linecap="round" transform="translate(${f(-r * 0.035)} ${f(-r * 0.035)})" opacity=".55"/>` +
      (o.over ?? '') +
      k.shade(d, k.rad(sh, 0.32, 0.28, 0.85, 0, 0.7), sh, 0.32) +
      `<ellipse cx="${f(cx - r * 0.4)}" cy="${f(cy - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" opacity=".75" transform="rotate(-40 ${f(cx - r * 0.4)} ${f(cy - r * 0.42)})"/>`,
  }], o.w ?? f(Math.min(0.8, r * 0.06)))
}

/** Red de vóley de (x0,y0) a (x1,y1): malla de hilos, faja blanca arriba y cable abajo. */
export function vnet(k: Kit, x0: number, y0: number, x1: number, y1: number, step = 3.2, c = P.white) {
  const tape = `M${x0} ${y0}H${x1}V${f(y0 + 2.6)}H${x0}Z`
  let mesh = ''
  for (let x = x0; x <= x1 + 0.01; x += step) mesh += `M${f(x)} ${f(y0 + 2.6)}V${y1}`
  for (let y = y0 + 2.6 + step; y <= y1 + 0.01; y += step) mesh += `M${x0} ${f(y)}H${x1}`
  return (
    `<path d="${mesh}" stroke="${P.ink}" stroke-width=".95" fill="none"/><path d="${mesh}" stroke="${c}" stroke-width=".42" fill="none"/>` +
    `<path d="M${x0} ${y1}H${x1}" stroke="${P.ink}" stroke-width="1.2"/>` +
    k.draw([{ d: tape, fill: P.white, inner: k.sh(tape, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) }], 0.45)
  )
}

/** Suelo de arena desde y0 hacia abajo, con su grano y unas huellas. */
export function sand(k: Kit, y0: number, curve = 0) {
  const d = `M-2 ${y0}Q60 ${f(y0 - curve)} 122 ${y0}V132H-2Z`
  const dots = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 37.3) % 118 + 1, y = y0 + 2 + ((i * 13.7) % 30)
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 3 ? 0.28 : 0.4}" fill="${i % 2 ? ARENA_D : P.white}" opacity=".7"/>`
  }).join('')
  return `<path d="${d}" fill="${ARENA}"/>` + k.clip(d, dots) + k.sh(d, 0, 0, 0, 1, 0, 0.7, ARENA_D, 0.35)
}

/** Mar con su línea de horizonte entre y0 e y1, y unas olitas. */
export function sea(k: Kit, y0: number, y1: number) {
  const d = `M-2 ${y0}H122V${y1}H-2Z`
  return (
    `<path d="${d}" fill="${MAR}"/>` + k.sh(d, 0, 0, 0, 1, 0.5, 0, MAR_D, 0.35) +
    `<path d="M-2 ${y0}H122" stroke="${P.ink}" stroke-width=".6"/>` +
    hair(22, y0 + (y1 - y0) * 0.45, 30, y0 + (y1 - y0) * 0.3, 38, y0 + (y1 - y0) * 0.45, 0.5, P.white, 0.8) +
    hair(76, y0 + (y1 - y0) * 0.6, 84, y0 + (y1 - y0) * 0.45, 92, y0 + (y1 - y0) * 0.6, 0.5, P.white, 0.8)
  )
}

/** Resplandor suave de un color. */
export const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Rótulo en cursiva. */
export const label = (x: number, y: number, txt: string, size = 6.4, rot = 0, c = P.ink) =>
  `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="${size}" fill="${c}" text-anchor="middle"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${txt}</text>`
