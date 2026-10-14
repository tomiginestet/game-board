// Piezas de los deportes de raqueta (tenis, pádel, squash y pelota paleta), dibujadas con el kit (../kit.ts):
// las pelotas (de tenis con su costura, de squash con el punto amarillo, la de goma de la paleta), las raquetas
// encordadas, la pala de pádel agujereada y la paleta de madera maciza. No exporta ilustraciones (nada en _ART).
import { f } from '../helpers'
import { ellipse, hair, P, roundRect, type Kit } from '../kit'

export const GEORGIA = 'font-family="Georgia, serif"'
/** Fieltro de la pelota de tenis: amarillo verdoso apagado, de estampa. */
export const FELT = '#D8D466', FELT_D = '#A6A23A', FELT_L = '#EFECAE'
/** Polvo de ladrillo. */
export const CLAY = '#C76E4C', CLAY_D = '#97492F', CLAY_L = '#E3A487'
/** Goma negra (squash, paleta): una tinta azul casi negra, para no salir de la paleta. */
export const NEGRA = '#262B47', NEGRA_D = '#11152B'
/** Madera clara (pino, pala vieja) y su veta. */
export const PINO = '#E6C38E', PINO_D = '#B98A55'
/** Vidrio de la jaula. */
export const GLASS = '#CFE0EE'

/** Elipse dibujada al revés (para agujerear con la regla nonzero). */
export const ellipseRev = (cx: number, cy: number, rx: number, ry: number) =>
  `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 1 1 ${f(cx + rx)} ${cy}A${rx} ${ry} 0 1 1 ${f(cx - rx)} ${cy}Z`

/** Rótulo en cursiva Georgia. */
export const label = (x: number, y: number, s: number, txt: string, c: string = P.ink, rot = 0, extra = '') =>
  `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="${s}" fill="${c}" text-anchor="middle"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}${extra}>${txt}</text>`

/** Estelas de velocidad detrás de algo que va hacia (x,y) desde el ángulo `ang` (grados, hacia donde viene). */
export function trail(x: number, y: number, ang: number, len: number, n = 3, gap = 3.2, c: string = P.mid, w = 0.9) {
  const a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
  let out = ''
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * gap, l = len * (1 - Math.abs(i - (n - 1) / 2) * 0.25)
    const x0 = x + px * o + ux * 2, y0 = y + py * o + uy * 2, x1 = x0 + ux * l, y1 = y0 + uy * l
    out += hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, w, c, 0.85)
  }
  return out
}

/** Nube de vapor o de polvo: racimo de bollos, cada uno con su sombra. */
export const puff = (k: Kit, x: number, y: number, r: number, fill: string = P.white, dark: string = P.sky2) => {
  const balls: [number, number, number][] = [[-0.55, 0.18, 0.5], [0.5, 0.22, 0.48], [-0.15, -0.3, 0.62], [0.42, -0.2, 0.44], [0.05, 0.3, 0.52]]
  return k.draw(balls.map(([dx, dy, rr]) => {
    const d = ellipse(f(x + dx * r), f(y + dy * r), f(rr * r), f(rr * r))
    return { d, fill, inner: k.sh(d, 0, 0, 1, 1, 0.05, 0.8, dark, 0.45) }
  }), f(Math.min(0.55, r * 0.08)))
}

/** Brillo de pelota arriba a la izquierda. */
const gloss = (x: number, y: number, r: number, op = 0.9) =>
  `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" opacity="${op}" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`

// ── Pelotas ──────────────────────────────────────────────────────────

/** Pelota de tenis: fieltro amarillo con la costura blanca en dos curvas. `rot` gira la costura. */
export function tennisBall(k: Kit, x: number, y: number, r: number, o: { rot?: number; fill?: string; dark?: string; seam?: string } = {}) {
  const d = ellipse(x, y, r, r), fill = o.fill ?? FELT, dark = o.dark ?? FELT_D
  const seam = `M${f(x - r * 0.62)} ${f(y - r * 0.86)}C${f(x - r * 0.08)} ${f(y - r * 0.4)} ${f(x - r * 0.08)} ${f(y + r * 0.4)} ${f(x - r * 0.62)} ${f(y + r * 0.86)}` +
    `M${f(x + r * 0.62)} ${f(y - r * 0.86)}C${f(x + r * 0.08)} ${f(y - r * 0.4)} ${f(x + r * 0.08)} ${f(y + r * 0.4)} ${f(x + r * 0.62)} ${f(y + r * 0.86)}`
  const sw = Math.max(0.35, r * 0.11)
  return (
    k.draw([{
      d, fill,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.45) +
        `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.3, 0.55, 0.55, 0)}"/>` +
        `<g transform="rotate(${o.rot ?? -30} ${x} ${y})"><path d="${seam}" fill="none" stroke="${dark}" stroke-width="${f(sw * 1.9)}" stroke-linecap="round"/>` +
        `<path d="${seam}" fill="none" stroke="${o.seam ?? P.white}" stroke-width="${f(sw)}" stroke-linecap="round"/></g>`,
    }], f(Math.min(0.75, 0.3 + r * 0.04))) +
    gloss(x, y, r, 0.7)
  )
}

/** Pelota de squash: goma negra con uno o dos puntos amarillos. */
export function squashBall(k: Kit, x: number, y: number, r: number, o: { dots?: number; dot?: string; rot?: number } = {}) {
  const d = ellipse(x, y, r, r), dot = o.dot ?? P.gold, rot = ((o.rot ?? 20) * Math.PI) / 180
  const dots = (o.dots ?? 2) === 1
    ? [[x + r * 0.18, y + r * 0.12]]
    : [[x + Math.cos(rot) * r * 0.32, y + Math.sin(rot) * r * 0.32], [x - Math.cos(rot) * r * 0.32 + r * 0.1, y - Math.sin(rot) * r * 0.32 + r * 0.06]]
  return (
    k.draw([{
      d, fill: NEGRA,
      inner:
        `<path d="${d}" fill="${k.rad(P.mid, 0.34, 0.3, 0.6, 0.9, 0)}"/>` +
        k.sh(d, 0, 0, 1, 1, 0.2, 0.9, NEGRA_D, 0.5) +
        dots.map(([px, py]) => `<circle cx="${f(px)}" cy="${f(py)}" r="${f(r * 0.17)}" fill="${dot}"/>`).join(''),
    }], f(Math.min(0.75, 0.3 + r * 0.04))) +
    gloss(x, y, r, 0.75)
  )
}

/** Pelota de goma de la paleta (maciza, oscura). */
export function rubberBall(k: Kit, x: number, y: number, r: number, fill: string = NEGRA) {
  const d = ellipse(x, y, r, r)
  return (
    k.draw([{ d, fill, inner: `<path d="${d}" fill="${k.rad(P.blue, 0.34, 0.3, 0.6, 0.85, 0)}"/>` + k.sh(d, 0, 0, 1, 1, 0.2, 0.9, NEGRA_D, 0.5) }], f(Math.min(0.75, 0.3 + r * 0.04))) +
    gloss(x, y, r, 0.8)
  )
}

// ── Raquetas ─────────────────────────────────────────────────────────

interface RacketOpts {
  s?: number
  /** Squash: cabeza más angosta y garganta larga. */
  squash?: boolean
  /** Color del marco y su sombra. */
  frame?: string
  frameD?: string
  /** Encordado y cinta del mango. */
  strings?: string
  grip?: string
  gripD?: string
  /** Encima del encordado, recortado a la cabeza (marcas, vincha). */
  over?: string
  /** Encima de todo. */
  top?: string
  /** Detalles grabados en el marco (oro). */
  engrave?: boolean
}

/** Raqueta parada con el cuello en (x,y): cabeza ovalada encordada arriba, garganta y mango con cinta hacia abajo. */
export function racket(k: Kit, x: number, y: number, rot: number, o: RacketOpts = {}) {
  const s = o.s ?? 1
  const sq = !!o.squash
  const cy = sq ? -27 : -23.6, rx = sq ? 9.4 : 11.6, ry = sq ? 13.8 : 14.6, th = 2.2
  const frameC = o.frame ?? P.white, frameD = o.frameD ?? P.blue
  const ring = ellipse(0, cy, rx, ry) + ellipseRev(0, cy, rx - th, ry - th)
  const hole = ellipse(0, cy, rx - th, ry - th)
  const throat = sq
    ? `M-5.2 ${f(cy + ry - 2.6)}L-2 1H2L5.2 ${f(cy + ry - 2.6)}L3.4 ${f(cy + ry - 1.2)}L.7 -1.6H-.7L-3.4 ${f(cy + ry - 1.2)}Z`
    : 'M-7.4 -13.4L-2.3 1H2.3L7.4 -13.4L5.4 -11.8L.9 -1.4H-.9L-5.4 -11.8Z'
  const handle = roundRect(-2.4, 0, 2.4, 22, 1)
  const butt = roundRect(-2.9, 20.6, 2.9, 23.6, 1.2)
  let str = ''
  for (let i = -5; i <= 5; i++) str += `M${f(i * ((rx - th) / 5.6))} ${f(cy - ry)}V${f(cy + ry)}`
  for (let j = -7; j <= 7; j++) str += `M${f(-rx)} ${f(cy + j * ((ry - th) / 7.6))}H${rx}`
  const gripC = o.grip ?? P.white, gripD = o.gripD ?? P.sky
  const wraps = Array.from({ length: 8 }, (_, i) => `M-2.4 ${f(1.6 + i * 2.5)}L2.4 ${f(0.2 + i * 2.5)}`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="${hole}" fill="${P.white}" opacity=".18"/>` +
    k.clip(hole, `<path d="${str}" stroke="${P.ink}" stroke-width="${f(0.5 / Math.max(s, 0.6))}"/><path d="${str}" stroke="${o.strings ?? P.white}" stroke-width="${f(0.22 / Math.max(s, 0.6))}" transform="translate(-.15 -.15)"/>` + (o.over ?? '')) +
    k.draw([
      { d: throat, fill: frameC, inner: k.sh(throat, 0, 0, 1, 0, 0, 0.8, frameD, 0.4) },
      { d: handle, fill: gripC, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, gripD, 0.45) + `<path d="${wraps}" stroke="${gripD}" stroke-width=".55"/>` },
      { d: butt, fill: frameC, inner: k.sh(butt, 0, 0, 1, 0, 0, 0.8, frameD, 0.4) },
      {
        d: ring, fill: frameC,
        inner:
          k.sh(ellipse(0, cy, rx, ry), 0, 0, 1, 1, 0.1, 0.9, frameD, 0.45) +
          hair(-rx + 0.9, cy + 4, -rx + 0.4, cy - 4, -rx * 0.55, cy - ry + 1.6, 0.7, '#fff', 0.85) +
          (o.engrave ? Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * (rx - th / 2))}" cy="${f(cy + Math.sin(a) * (ry - th / 2))}" r=".38" fill="${P.goldL}"/>` }).join('') : ''),
      },
    ], f(0.7 / s)) +
    (o.top ?? '') +
    `</g>`
  )
}

// ── La pala de pádel ─────────────────────────────────────────────────

/** Cabeza de la pala (redonda, que se angosta en el cuello) con el cuello en (0,-6). */
export const PALA = 'M0 -44.4C10 -44.4 14.6 -37 14.6 -28C14.6 -19.6 10.4 -13.8 4.6 -10L3.2 -6H-3.2L-4.6 -10C-10.4 -13.8 -14.6 -19.6 -14.6 -28C-14.6 -37 -10 -44.4 0 -44.4Z'
const PALA_IN = 'M0 -42C8.6 -42 12.2 -35.6 12.2 -28C12.2 -20.6 8.6 -15.6 3.8 -12.4H-3.8C-8.6 -15.6 -12.2 -20.6 -12.2 -28C-12.2 -35.6 -8.6 -42 0 -42Z'
const PALA_HANDLE = roundRect(-2.7, -7.4, 2.7, 15, 1.2)

/** Agujeros de la pala, en tresbolillo dentro de la cara. */
const PALA_HOLES = (() => {
  const pts: [number, number][] = []
  for (let row = 0; row < 8; row++) {
    const yy = -38.6 + row * 3.4
    for (let i = -4; i <= 4; i++) {
      const xx = i * 3.2 + (row % 2 ? 1.6 : 0)
      const nx = xx / 11, ny = (yy + 28) / 13.4
      if (nx * nx + ny * ny < 0.78 && !(Math.abs(xx) < 4 && yy > -24)) pts.push([xx, yy])
    }
  }
  return pts
})()

interface PalaOpts {
  s?: number
  /** Cara, sombra y borde de la pala. */
  face?: string
  faceD?: string
  rim?: string
  rimD?: string
  /** Agujeros (color del fondo que se ve a través). */
  holes?: string
  /** Trama de carbono en la cara. */
  carbon?: boolean
  /** Encima de la cara, recortado a ella. */
  over?: string
  /** Mango y cordón. */
  grip?: string
  gripD?: string
  top?: string
}

/** Pala de pádel parada con el cuello en (x,y): cara agujereada, marco con protector y mango con cordón. */
export function pala(k: Kit, x: number, y: number, rot: number, o: PalaOpts = {}) {
  const s = o.s ?? 1
  const face = o.face ?? P.white, faceD = o.faceD ?? P.blue, rim = o.rim ?? P.night, rimD = o.rimD ?? '#0F1736'
  const holes = PALA_HOLES.map(([hx, hy]) => ellipse(hx, hy, 0.85, 0.85)).join('')
  const weave = o.carbon
    ? Array.from({ length: 16 }, (_, i) => { const yy = -44 + i * 2.2; return `M-14 ${f(yy)}L14 ${f(yy + 6)}` }).join('') + Array.from({ length: 16 }, (_, i) => { const yy = -44 + i * 2.2; return `M-14 ${f(yy + 6)}L14 ${f(yy)}` }).join('')
    : ''
  const gripC = o.grip ?? P.white, gripD = o.gripD ?? P.sky
  const wraps = Array.from({ length: 7 }, (_, i) => `M-2.7 ${f(-5 + i * 2.7)}L2.7 ${f(-6.4 + i * 2.7)}`).join('')
  const cord = 'M-1 14.6C-3.4 18 -2.6 21.6 0 22.4C2.6 21.6 3.4 18 1 14.6'
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="${cord}" fill="none" stroke="${P.ink}" stroke-width="${f(1.5 / s)}"/><path d="${cord}" fill="none" stroke="${o.rim ? rim : P.red}" stroke-width="${f(0.7 / s)}"/>` +
    k.draw([
      { d: PALA_HANDLE, fill: gripC, inner: k.sh(PALA_HANDLE, 0, 0, 1, 0, 0, 0.9, gripD, 0.45) + `<path d="${wraps}" stroke="${gripD}" stroke-width=".55"/>` + `<path d="M-2.7 12H2.7V15H-2.7Z" fill="${rim}"/>` },
      {
        d: PALA, fill: rim,
        inner:
          k.sh(PALA, 0, 0, 1, 1, 0, 0.9, rimD, 0.45) +
          `<path d="${PALA_IN}" fill="${face}"/>` +
          (weave ? k.clip(PALA_IN, `<path d="${weave}" stroke="${faceD}" stroke-width=".5" opacity=".7"/>`) : '') +
          k.clip(PALA_IN, k.sh(PALA_IN, 0, 0, 1, 1, 0, 0.8, faceD, 0.4) + `<path d="M-14 -44H-4V-10H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>`) +
          `<path d="${holes}" fill="${o.holes ?? P.night}"/>` +
          `<path d="M-1.8 -12.4L0 -17.6L1.8 -12.4Z" fill="${o.holes ?? P.night}"/>` +
          (o.over ?? '') +
          `<path d="${PALA_IN}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
          hair(-12.8, -22, -13.6, -32, -8, -42, 0.7, '#fff', 0.7),
      },
    ], f(0.75 / s)) +
    (o.top ?? '') +
    `</g>`
  )
}

// ── La paleta de frontón ─────────────────────────────────────────────

/** Paleta de madera maciza: cabeza de puntas redondas y lados casi rectos, el cuello en (0,-6). */
export const PALETA = 'M-10.6 -40C-11 -44.6 -7.6 -46.8 0 -46.8C7.6 -46.8 11 -44.6 10.6 -40L10.2 -18C10 -12.6 7.2 -9.6 3.4 -8L2.8 -6H-2.8L-3.4 -8C-7.2 -9.6 -10 -12.6 -10.2 -18Z'
const PALETA_HANDLE = roundRect(-2.6, -7.2, 2.6, 16.6, 1.4)

interface PaletaOpts {
  s?: number
  wood?: string
  woodD?: string
  /** Encima de la cara, recortado a ella. */
  over?: string
  grip?: string
  gripD?: string
  top?: string
}

/** Paleta de madera con el cuello en (x,y): veta, nudos y mango encintado. */
export function paleta(k: Kit, x: number, y: number, rot: number, o: PaletaOpts = {}) {
  const s = o.s ?? 1
  const wood = o.wood ?? PINO, woodD = o.woodD ?? PINO_D
  const grain =
    hair(-6.4, -44, -7.6, -28, -5.6, -10, 0.45, woodD) + hair(-2, -46, -3.2, -30, -1.2, -9, 0.4, woodD) +
    hair(3, -46, 4, -34, 2.4, -20, 0.4, woodD) + hair(7.2, -44, 8, -30, 6.4, -12, 0.45, woodD) +
    `<ellipse cx="4.4" cy="-24" rx="1.5" ry="2.6" fill="none" stroke="${woodD}" stroke-width=".45"/><ellipse cx="4.4" cy="-24" rx=".6" ry="1.1" fill="${woodD}"/>` +
    `<path d="M2.2 -20C3 -16 2.6 -13 1.8 -10M6.6 -20C6 -16 6.6 -13 6.2 -11" fill="none" stroke="${woodD}" stroke-width=".35"/>`
  const gripC = o.grip ?? P.red, gripD = o.gripD ?? P.wine
  const wraps = Array.from({ length: 8 }, (_, i) => `M-2.6 ${f(-5 + i * 2.6)}L2.6 ${f(-6.2 + i * 2.6)}`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([
      { d: PALETA, t: 'translate(1.1 .9)', fill: woodD },
      { d: PALETA_HANDLE, fill: gripC, inner: k.sh(PALETA_HANDLE, 0, 0, 1, 0, 0, 0.9, gripD, 0.45) + `<path d="${wraps}" stroke="${gripD}" stroke-width=".6"/>` + `<path d="M-2.6 14.2H2.6" stroke="${P.ink}" stroke-width=".5"/>` },
      {
        d: PALETA, fill: wood,
        inner:
          grain + k.sh(PALETA, 0, 0, 1, 1, 0, 0.55, woodD, 0.35) +
          `<path d="M-12 -47H-5V-6H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          (o.over ?? '') +
          hair(-9.4, -18, -10, -30, -8.6, -43, 0.7, '#fff', 0.75),
      },
    ], f(0.75 / s)) +
    (o.top ?? '') +
    `</g>`
  )
}

/** Cinta con las puntas en cola de golondrina y un texto en cursiva sobre su curva. */
export function banner(k: Kit, cx: number, cy: number, w: number, fill: string, dark: string, text: string, tc: string, fs = 4.4) {
  const x0 = cx - w / 2, x1 = cx + w / 2
  const band = `M${x0} ${f(cy - 3.6)}Q${cx} ${f(cy + 0.4)} ${x1} ${f(cy - 3.6)}V${f(cy + 3.4)}Q${cx} ${f(cy + 7.4)} ${x0} ${f(cy + 3.4)}Z`
  const tail = (x: number, s: number) => `M${f(x - s * 2)} ${f(cy - 1.6)}L${f(x + s * 7)} ${f(cy - 1.2)}L${f(x + s * 4.4)} ${f(cy + 2.4)}L${f(x + s * 7)} ${f(cy + 6)}L${f(x - s * 2)} ${f(cy + 5.6)}Z`
  const rid = k.id('ban')
  return (
    k.draw([{ d: tail(x0, -1), fill: dark }, { d: tail(x1, 1), fill: dark }], 0.5) +
    k.draw([{ d: band, fill, inner: k.sh(band, 0, 0, 0, 1, 0, 0.6, dark, 0.35) + `<path d="M${x0} ${f(cy - 2.4)}Q${cx} ${f(cy + 1.6)} ${x1} ${f(cy - 2.4)}M${x0} ${f(cy + 2.2)}Q${cx} ${f(cy + 6.2)} ${x1} ${f(cy + 2.2)}" fill="none" stroke="${P.goldL}" stroke-width=".35"/>` }], 0.55) +
    `<path id="${rid}" d="M${x0} ${f(cy + 1.4)}Q${cx} ${f(cy + 5.2)} ${x1} ${f(cy + 1.4)}" fill="none"/>` +
    `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="${fs}" fill="${tc}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`
  )
}

/** Volutas de grabado para el oro: una espiral dorada entintada. */
export function voluta(d: string, c: string = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" transform="translate(-.3 -.35)" opacity=".85"/>`
  )
}

/** Estrellitas del cielo de noche. */
export const stars = (pts: number[][], c: string = P.paper) => pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.65}" fill="${c}"/>`).join('')
