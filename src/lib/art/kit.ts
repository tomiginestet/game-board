// Kit de las ilustraciones de medallas (ver docs/medallas-filosofia.md).
//
// El lenguaje es el de una estampa impresa, simplificado:
// - Paleta fija `P`: tinta azul, papel crema, celestes y un solo acento dorado. Un color propio sólo si el
//   tema lo pide (la calabaza del mate, la rosa del capo).
// - Contorno de tinta sólo por fuera de cada figura, más pesado del lado de la sombra (abajo a la derecha);
//   adentro, líneas más finas (`line`) y trazos que se afinan en las puntas (`hair`) para pliegues y detalles.
// - Volumen con `shade`: un velo suave del tono y, encima, el mismo degradé hecho grano. Luz arriba a la izquierda.
// - Un solo protagonista, grande, con un fondo que lo enmarca: el sol (`sun`), un escenario (`stage`) o la noche.

import { f } from './helpers'

export const P = {
  paper: '#F4EFE4', white: '#FCFAF4', sky1: '#E1E8F4', sky: '#A9BFE6', sky2: '#B6C5E4', blue: '#7C90C8', mid: '#4F64A6',
  ink: '#25366F', night: '#1B2652', gold: '#F2B356', goldL: '#FADB9E', goldD: '#D27F2E', red: '#C9473D', green: '#8DA453',
  greenD: '#5E7434', brown: '#B47C50', brownD: '#7D4E2C', wine: '#6A1F31', skin: '#F7E9DA',
}

/** Una parte de una figura entintada. `inner` va recortado a su forma; `line` es el grosor de su línea interna. */
export interface Piece {
  d: string
  t?: string
  fill: string
  inner?: string
  line?: number
}

/** Elipse como path. */
export const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${cy}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${cy}Z`

/** Rectángulo redondeado como path. */
export const roundRect = (x0: number, y0: number, x1: number, y1: number, r: number) =>
  `M${x0} ${f(y0 + r)}A${r} ${r} 0 0 1 ${f(x0 + r)} ${y0}H${f(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${f(y0 + r)}V${f(y1 - r)}A${r} ${r} 0 0 1 ${f(x1 - r)} ${y1}H${f(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${f(y1 - r)}Z`

/** Polígono de estrella como path. */
export function starPath(cx: number, cy: number, R: number, r: number, n: number, rot = -90): string {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r : R
    d += (i ? 'L' : 'M') + f(cx + rr * Math.cos(a)) + ' ' + f(cy + rr * Math.sin(a))
  }
  return d + 'Z'
}

/** Punto de una curva cuadrática y su tangente. */
const quad = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) => {
  const a = 1 - t
  return {
    x: a * a * x0 + 2 * a * t * cx + t * t * x1,
    y: a * a * y0 + 2 * a * t * cy + t * t * y1,
    dx: 2 * a * (cx - x0) + 2 * t * (x1 - cx),
    dy: 2 * a * (cy - y0) + 2 * t * (y1 - cy),
  }
}

/** Contorno de una curva cuadrática con ancho variable `w(t)`. */
function ribbon(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: (t: number) => number, N = 18) {
  const L: string[] = [], R: string[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N, q = quad(x0, y0, cx, cy, x1, y1, t), len = Math.hypot(q.dx, q.dy) || 1, ww = w(t) / 2
    L.push(`${f(q.x - (q.dy / len) * ww)} ${f(q.y + (q.dx / len) * ww)}`)
    R.push(`${f(q.x + (q.dy / len) * ww)} ${f(q.y - (q.dx / len) * ww)}`)
  }
  return { L, R }
}

/** Trazo de tinta que se afina en las dos puntas (pliegues, vapor, nudillos). */
export function hair(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w = 0.7, c = P.ink, op = 1) {
  const { L, R } = ribbon(x0, y0, cx, cy, x1, y1, (t) => w * Math.pow(Math.sin(Math.PI * t), 0.55))
  return `<path d="M${L.join('L')}L${R.reverse().join('L')}Z" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''}/>`
}

/** Tubo que se afina de `w0` a `w1` con la punta redondeada (tentáculos, colas, sogas). */
export function taper(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1: number) {
  const { L, R } = ribbon(x0, y0, cx, cy, x1, y1, (t) => w0 + (w1 - w0) * t)
  const r = f(Math.max(w1 / 2, 0.1))
  return `M${L.join('L')}A${r} ${r} 0 0 0 ${R[R.length - 1]}L${R.reverse().join('L')}Z`
}

/** Puntos a lo largo de una curva cuadrática (para ventosas, botones, costuras). */
export const along = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, ts: number[]) =>
  ts.map((t) => quad(x0, y0, cx, cy, x1, y1, t))

/** Destello de cuatro puntas. */
export const sparkle = (x: number, y: number, r: number, c = P.white) => `<path d="${starPath(x, y, r, r * 0.17, 4)}" fill="${c}"/>`

/** Meeple de pie, con la base en y=26 y la cabeza (círculo de radio 9.6 en (0,-16.8)) arriba. */
export const MEEPLE =
  'M0 -26C5.4 -26 9.6 -21.9 9.6 -16.8C9.6 -14.1 8.5 -11.9 6.8 -10.5C11.8 -10.2 16.6 -9.6 20 -8.2C24.2 -6.6 24.2 .4 20 1.6C17 2.5 14.2 2.8 12 3.8C13.4 9.8 17.4 15.6 20 20.2C21.8 23.4 20.2 26 17 26L7 26C5.4 20.4 3 14.6 0 14.6' +
  'C-3 14.6 -5.4 20.4 -7 26L-17 26C-20.2 26 -21.8 23.4 -20 20.2C-17.4 15.6 -13.4 9.8 -12 3.8C-14.2 2.8 -17 2.5 -20 1.6C-24.2 .4 -24.2 -6.6 -20 -8.2C-16.6 -9.6 -11.8 -10.2 -6.8 -10.5C-8.5 -11.9 -9.6 -14.1 -9.6 -16.8C-9.6 -21.9 -5.4 -26 0 -26Z'

/** Herramientas de una ilustración. `u` hace únicos los ids cuando hay varias medallas en la página. */
export function kit(u: number) {
  const defs: string[] = []
  const memo = new Map<string, string>()
  let n = 0
  const id = (p: string) => `${p}${u}_${n++}`
  const once = (key: string, make: (i: string) => string) => {
    let i = memo.get(key)
    if (!i) {
      i = id('k')
      memo.set(key, i)
      defs.push(make(i))
    }
    return i
  }
  /** Pasa la opacidad de lo que se pinte a grano del color pedido (el filtro cubre sólo la forma). */
  const dith = (color: string) =>
    `url(#${once('d' + color, (i) =>
      `<filter id="${i}" color-interpolation-filters="sRGB">` +
      `<feTurbulence type="fractalNoise" baseFrequency="2.8" numOctaves="1" seed="5" result="n"/>` +
      `<feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -.25" result="na"/>` +
      `<feComposite in="SourceAlpha" in2="na" operator="arithmetic" k2="1" k3="-1" k4=".5" result="m"/>` +
      `<feComponentTransfer in="m" result="t"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>` +
      `<feFlood flood-color="${color}"/><feComposite in2="t" operator="in"/></filter>`)})`
  const stops = (c: string, a0: number, a1: number) => `<stop offset="0" stop-color="${c}" stop-opacity="${a0}"/><stop offset="1" stop-color="${c}" stop-opacity="${a1}"/>`
  /** Degradé lineal de un color, de opacidad `a0` a `a1` (en fracciones de la caja de la forma). */
  const lin = (c: string, x1: number, y1: number, x2: number, y2: number, a0: number, a1: number) =>
    `url(#${once(`l${c}${x1},${y1},${x2},${y2},${a0},${a1}`, (i) => `<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(c, a0, a1)}</linearGradient>`)})`
  /** Degradé radial de un color, de opacidad `a0` (centro) a `a1` (borde). */
  const rad = (c: string, cx: number, cy: number, r: number, a0: number, a1: number) =>
    `url(#${once(`r${c}${cx},${cy},${r},${a0},${a1}`, (i) => `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops(c, a0, a1)}</radialGradient>`)})`
  /** Sombra o luz: un velo suave del degradé y, encima, el mismo degradé hecho grano. */
  const shade = (d: string, g: string, color: string, soft = 0.4) =>
    `<path d="${d}" fill="${g}" opacity="${soft}"/><path d="${d}" fill="${g}" filter="${dith(color)}"/>`
  /** Atajo: sombra lineal de un color. */
  const sh = (d: string, x1: number, y1: number, x2: number, y2: number, a0: number, a1: number, c = P.blue, soft = 0.35) => shade(d, lin(c, x1, y1, x2, y2, a0, a1), c, soft)
  const clip = (d: string, inner: string) => {
    const c = id('c')
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><g clip-path="url(#${c})">${inner}</g>`
  }
  /** Figura entintada: contorno por fuera (más pesado abajo a la derecha), rellenos, sombreado y líneas internas finas. */
  const draw = (pieces: Piece[], w = 0.75) => {
    const g = (p: Piece, s: string) => (p.t ? `<g transform="${p.t}">${s}</g>` : s)
    return (
      pieces.map((p) => g(p, `<path d="${p.d}" fill="${P.ink}" transform="translate(${f(w * 0.7)} ${f(w * 0.85)})"/>`)).join('') +
      pieces.map((p) => g(p, `<path d="${p.d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 2)}" stroke-linejoin="round"/>`)).join('') +
      pieces
        .map((p) => g(p, `<path d="${p.d}" fill="${p.fill}"/>` + (p.inner ? clip(p.d, p.inner) : '') + (p.line ? `<path d="${p.d}" fill="none" stroke="${P.ink}" stroke-width="${p.line}" stroke-linejoin="round"/>` : '')))
        .join('')
    )
  }
  /** Sol con rayos rectos (y flamígeros alternados, si es el de Mayo), del naranja al dorado claro. */
  const sun = (cx: number, cy: number, r0: number, r1: number, count = 32, mayo = true) => {
    const gid = once(`sun${cx},${cy},${r0},${r1}`, (i) =>
      `<radialGradient id="${i}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r1}"><stop offset="${f(r0 / r1)}" stop-color="${P.goldD}"/><stop offset=".6" stop-color="${P.gold}"/><stop offset="1" stop-color="${P.goldL}" stop-opacity=".5"/></radialGradient>`)
    let rays = ''
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
      if (!mayo || i % 2 === 0) {
        const len = mayo ? r1 : i % 2 ? r0 + (r1 - r0) * 0.72 : r1, w = mayo ? 1.5 : i % 2 ? 1.1 : 1.6
        rays += `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
      } else {
        const L: string[] = [], R: string[] = [], N = 20, rr = r0 + (r1 - r0) * 0.86
        for (let j = 0; j <= N; j++) {
          const t = j / N, r = r0 + (rr - r0) * t, off = Math.sin(t * Math.PI * 3) * 1.3 * (1 - t * 0.3), w = 1.05 * (1 - t) + 0.1
          const x = cx + ux * r + px * off, y = cy + uy * r + py * off
          L.push(`${f(x + px * w)} ${f(y + py * w)}`)
          R.push(`${f(x - px * w)} ${f(y - py * w)}`)
        }
        rays += `M${L.join('L')}L${R.reverse().join('L')}Z`
      }
    }
    return (
      `<path d="${rays}" fill="url(#${gid})"/>` +
      `<path d="${rays}" fill="${rad(P.goldD, 0.5, 0.5, 0.5, 0.95, 0)}" filter="${dith(P.goldD)}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${f(r0 - 2)}" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-dasharray=".01 1.7" stroke-linecap="round"/>`
    )
  }
  const FULL = 'M0 0H120V130H0Z'
  /** Fondo de papel con el cielo granulado hacia los bordes. */
  const day = () => `<rect width="120" height="130" fill="${P.paper}"/>` + shade(FULL, rad(P.sky2, 0.5, 0.46, 0.7, 0, 1), '#9EB1DB', 0.5)
  /** Fondo de noche con un resplandor en el medio. */
  const night = () => `<rect width="120" height="130" fill="${P.night}"/>` + shade(FULL, rad(P.mid, 0.48, 0.42, 0.55, 0.85, 0), P.mid, 0.35)
  /** Escenario: un disco celeste con el borde granulado. */
  const stage = (cx: number, cy: number, r: number) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.sky1}"/>` + shade(ellipse(cx, cy, r, r), rad(P.sky2, 0.5, 0.5, 0.5, 0, 1), '#9EB1DB', 0.6) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${P.blue}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`
  /** Sombra proyectada de una figura sobre el fondo. */
  const cast = (ds: string[], dx = 2.6, dy = 2.2, color = P.blue) =>
    `<g transform="translate(${dx} ${dy})">${ds.map((d) => shade(d, lin(color, 0, 0, 0, 1, 0.55, 0.55), color, 0.25)).join('')}</g>`
  /** Sombra en el piso, debajo de algo. */
  const floor = (cx: number, cy: number, rx: number, ry: number, color = P.blue) => shade(ellipse(cx, cy, rx, ry), rad(color, 0.5, 0.5, 0.5, 0.9, 0), color, 0.4)
  return { id, lin, rad, shade, sh, clip, draw, sun, day, night, stage, cast, floor, defs: () => `<defs>${defs.join('')}</defs>` }
}
export type Kit = ReturnType<typeof kit>

/** Dado en perspectiva entintado, con la arista del frente arriba en (x,y) y lado s. */
export function die(k: Kit, x: number, y: number, s: number, rot: number) {
  const kk = f(s * 0.87), h = f(s / 2)
  const out = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}L${f(x - kk)} ${f(y - h)}Z`
  const right = `M${x} ${y}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}Z`
  const left = `M${f(x - kk)} ${f(y - h)}L${x} ${y}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}Z`
  const pips = (o: number[], a: number[], b: number[], pts: number[][]) =>
    `<g transform="matrix(${a[0]} ${a[1]} ${b[0]} ${b[1]} ${o[0]} ${o[1]})">${pts.map(([p, q]) => `<circle cx="${p}" cy="${q}" r=".1" fill="${P.ink}"/>`).join('')}</g>`
  return (
    `<g transform="rotate(${rot} ${x} ${y})">` +
    k.draw([{ d: out, fill: P.white, inner: k.sh(left, 0, 0, 0, 1, 0.3, 0.6, P.sky2, 0.5) + k.sh(right, 0, 0, 1, 1, 0.5, 1, P.blue, 0.4) }], 0.6) +
    `<path d="M${f(x - kk)} ${f(y - h)}L${x} ${y}L${f(x + kk)} ${f(y - h)}M${x} ${y}V${f(y + s)}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
    pips([x - kk, y - h], [kk, -h], [kk, h], [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]]) +
    pips([x - kk, y - h], [kk, h], [0, s], [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]]) +
    pips([x, y], [kk, -h], [0, s], [[0.3, 0.3], [0.7, 0.7]]) +
    `</g>`
  )
}

/** Carta de póker parada con la base en (0,0). */
export function card(k: Kit, x: number, y: number, rot: number, suit: 'h' | 's', s = 1) {
  const d = roundRect(-6.6, -19, 6.6, 0, 1.4)
  const c = suit === 'h' ? P.red : P.ink
  const mark =
    suit === 'h'
      ? 'M0 -5C-4.4 -7.8 -4.2 -11.8 -1.8 -11.8C-.8 -11.8 -.2 -11.2 0 -10.4C.2 -11.2 .8 -11.8 1.8 -11.8C4.2 -11.8 4.4 -7.8 0 -5Z'
      : 'M0 -12.4C-3.2 -9.6 -4.4 -8.4 -4 -6.8C-3.6 -5.2 -1.8 -5.2 -.8 -6.4L-1.6 -4.4H1.6L.8 -6.4C1.8 -5.2 3.6 -5.2 4 -6.8C4.4 -8.4 3.2 -9.6 0 -12.4Z'
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([{ d, fill: P.white, inner: k.sh('M0 -20H8V1H0Z', 0, 0, 1, 0, 0, 0.6) }], 0.5) +
    `<path d="${mark}" fill="${c}"/>` +
    `<text x="-4.1" y="-13.2" font-family="Georgia, serif" font-weight="700" font-size="5" fill="${c}" text-anchor="middle">A</text>` +
    `</g>`
  )
}

/** Meeple entintado centrado en (x,y). `under` va detrás (capas, capas de aura) y `over` encima, en coordenadas del meeple. */
export function meeple(k: Kit, x: number, y: number, s: number, fill: string, o: { shade?: string; under?: string; over?: string; rot?: number } = {}) {
  const dark = o.shade ?? P.mid
  return (
    `<g transform="translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})">` +
    (o.under ?? '') +
    k.draw(
      [{
        d: MEEPLE, fill,
        inner:
          k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.75, dark) + k.sh('M-30 14H30V30H-30Z', 0, 0, 0, 1, 0, 0.6, dark, 0.3) +
          `<path d="M-30 -30H-2V30H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.28, 0)}"/>` +
          `<ellipse cx="-4.4" cy="-21.6" rx="2.4" ry="1.4" fill="#fff" opacity=".9" transform="rotate(-35 -4.4 -21.6)"/>`,
      }],
      f(0.75 / s),
    ) +
    hair(-6, 6, -4.6, 11, -6.6, 17, 0.6, dark) + hair(6, 6, 4.6, 11, 6.6, 17, 0.6, dark) +
    (o.over ?? '') +
    `</g>`
  )
}

/** Llama de tres capas (rojo, naranja, dorado) desde una forma base. */
export const FLAME = 'M60 18C66 30 80 32 82 46C86 40 85 34 84 30C92 38 95 52 92 64C88 80 76 90 60 90C44 90 32 80 28 64C25 52 28 42 34 36C34 42 36 46 40 48C40 36 50 28 60 18Z'
export function flame(k: Kit, t: string) {
  const layer = (s: number, dy: number, fill: string, grain: string) =>
    `<g transform="translate(60 ${90 + dy}) scale(${s}) translate(-60 -90)"><path d="${FLAME}" fill="${fill}"/>${k.shade(FLAME, k.lin(grain, 0, 0, 0, 1, 0, 0.8), grain, 0.3)}</g>`
  return `<g transform="${t}">` + k.draw([{ d: FLAME, fill: P.red, inner: k.sh(FLAME, 0, 0, 1, 1, 0, 0.7, P.wine) }], 0.7) + layer(0.78, 0, P.goldD, P.red) + layer(0.56, 0, P.gold, P.goldD) + layer(0.32, 0, P.goldL, P.gold) + `</g>`
}
