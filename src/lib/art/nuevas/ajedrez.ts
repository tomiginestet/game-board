// Ajedrez, en clave heroica. El nogal de la ficha del juego es el color propio: el fondo es madera oscura con un
// tablero de nogal y boj en perspectiva, y las piezas Staunton son de boj (o de marfil, la torre). Nada de caras en
// las piezas. A Najdorf no se lo dibuja: aparece por el café y la partida.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Nogal de la ficha del ajedrez (fondo y casillas oscuras), con su sombra y su luz. */
const WAL = '#5C4033', WAL_D = '#3A271E', WAL_L = '#8C6A50'
/** Boj de las piezas y de las casillas claras. */
const BOX = '#EBCF9F', BOX_D = '#B98A55', BOX_L = '#FFF4DC'
/** Marfil de la torre, uva de Mendoza y pelaje del ovejero. */
const IVORY = '#F6EFDF', IVORY_D = '#C9B48E'
const GRAPE = '#5E2B5C', GRAPE_L = '#9B5A93'
const TAN = '#C98E4E', TAN_D = '#8A5A2B', TAN_L = '#EDBE80', COAT = '#2E2421'
const FULL = 'M0 0H120V130H0Z'

interface Wood { fill: string; dark: string; light: string; grain: string }
const BOXW: Wood = { fill: BOX, dark: BOX_D, light: BOX_L, grain: BOX_D }
const IVW: Wood = { fill: IVORY, dark: IVORY_D, light: '#FFFFFF', grain: '#DCCDAE' }
const WALW: Wood = { fill: '#76503A', dark: WAL_D, light: '#B08A6C', grain: WAL_D }

/** Fondo de nogal con vetas y un resplandor cálido en el medio. */
const walnut = (k: Kit) =>
  `<rect width="120" height="130" fill="${WAL}"/>` + k.shade(FULL, k.rad(WAL_L, 0.5, 0.42, 0.55, 0.95, 0), WAL_L, 0.45) +
  [[8, 0.9], [20, -0.6], [34, 0.7], [86, -0.8], [100, 0.6], [112, -0.5]].map(([x, b]) => hair(x, 0, x + b * 10, 50, x - b * 4, 104, 0.7, WAL_D, 0.55)).join('')

/** Tablero de 8×8 en perspectiva (cerca abajo). `pt(u, w)`: columna u de −4 a 4, fila w de 0 (cerca) a 8 (lejos). */
const pt = (u: number, w: number) => { const z = 6 + w; return [60 + (u * 60) / z, 48 + 300 / z] }
const P2 = (u: number, w: number) => pt(u, w).map((n) => f(n)).join(' ')
function board(k: Kit) {
  let light = '', dark = ''
  for (let w = 0; w < 8; w++) for (let u = -4; u < 4; u++) {
    const q = `M${P2(u, w)}L${P2(u + 1, w)}L${P2(u + 1, w + 1)}L${P2(u, w + 1)}Z`
    if ((u + w) % 2) dark += q
    else light += q
  }
  const top = `M${P2(-4, 0)}L${P2(4, 0)}L${P2(4, 8)}L${P2(-4, 8)}Z`
  const frame = `M${P2(-4.5, -0.5)}L${P2(4.5, -0.5)}L${P2(4.5, 8.5)}L${P2(-4.5, 8.5)}Z`
  return (
    k.draw([{ d: frame, fill: WAL_D, inner: `<path d="${top}" fill="none" stroke="${P.gold}" stroke-width=".9"/>` }], 0.6) +
    `<path d="${light}" fill="${BOX}"/><path d="${dark}" fill="${WAL}"/>` +
    k.sh(top, 0, 1, 0, 0, 0, 0.75, WAL_D, 0.45) +
    `<path d="${top}" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0, 0.18)}"/>`
  )
}

/** Contorno esponjoso (lana, nubes): arquitos hacia afuera alrededor de una elipse. */
function fluff(cx: number, cy: number, rx: number, ry: number, n: number) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, x = f(cx + rx * Math.cos(a)), y = f(cy + ry * Math.sin(a))
    d += i ? `A${f((rx * 3.3) / n)} ${f((rx * 3.3) / n)} 0 0 1 ${x} ${y}` : `M${x} ${y}`
  }
  return d + 'Z'
}

/** Rulos de lana. */
const curls = (pts: number[][], c: string, w = 0.45) => pts.map(([x, y]) => hair(x - 1.6, y + 0.4, x - 0.2, y - 1.6, x + 1.6, y + 0.2, w, c) + hair(x - 0.8, y + 1.2, x + 0.6, y + 1.6, x + 1.2, y + 0.4, w * 0.8, c)).join('')

// ── Piezas Staunton, con la base en (0,0) ────────────────────────────

const PAWN =
  'M-11 0H11C11 -2.2 10 -3.2 8.4 -3.6C9 -4.4 8.6 -5.6 7 -6C5.4 -6.4 4.4 -7 4 -8C3.4 -12 3 -15 2.8 -17.6C5.4 -18 6.4 -19.2 6.4 -20C6.4 -20.8 5.4 -21.4 3.6 -21.6' +
  'A6 6 0 1 0 -3.6 -21.6C-5.4 -21.4 -6.4 -20.8 -6.4 -20C-6.4 -19.2 -5.4 -18 -2.8 -17.6C-3 -15 -3.4 -12 -4 -8C-4.4 -7 -5.4 -6.4 -7 -6C-8.6 -5.6 -9 -4.4 -8.4 -3.6C-10 -3.2 -11 -2.2 -11 0Z'
const KING =
  'M-12.4 0H12.4C12.4 -2.4 11.4 -3.4 9.6 -3.8C10.2 -4.8 9.6 -6 8 -6.4C6.8 -6.8 6 -7.6 5.8 -8.6C5.2 -16 4.4 -24 4 -28.6C6.6 -29 7.6 -30 7.6 -30.8C7.6 -31.6 6.6 -32.2 4.6 -32.4' +
  'C6 -34 7.2 -36.4 7.4 -38.6C4.8 -39.6 2 -40 1.4 -40V-41.6H4V-44.2H1.4V-47.4H-1.4V-44.2H-4V-41.6H-1.4V-40C-2 -40 -4.8 -39.6 -7.4 -38.6C-7.2 -36.4 -6 -34 -4.6 -32.4' +
  'C-6.6 -32.2 -7.6 -31.6 -7.6 -30.8C-7.6 -30 -6.6 -29 -4 -28.6C-4.4 -24 -5.2 -16 -5.8 -8.6C-6 -7.6 -6.8 -6.8 -8 -6.4C-9.6 -6 -10.2 -4.8 -9.6 -3.8C-11.4 -3.4 -12.4 -2.4 -12.4 0Z'
const QUEEN =
  'M-12.4 0H12.4C12.4 -2.4 11.4 -3.4 9.6 -3.8C10.2 -4.8 9.6 -6 8 -6.4C6.8 -6.8 6 -7.6 5.8 -8.6C5.2 -16 4.4 -24 4 -28.6C6.6 -29 7.6 -30 7.6 -30.8C7.6 -31.6 6.6 -32.2 4.6 -32.4' +
  'C6 -34 7.4 -36.6 8 -39.2L5.8 -37.4L3.8 -40L1.8 -37.6L0 -40.6L-1.8 -37.6L-3.8 -40L-5.8 -37.4L-8 -39.2C-7.4 -36.6 -6 -34 -4.6 -32.4' +
  'C-6.6 -32.2 -7.6 -31.6 -7.6 -30.8C-7.6 -30 -6.6 -29 -4 -28.6C-4.4 -24 -5.2 -16 -5.8 -8.6C-6 -7.6 -6.8 -6.8 -8 -6.4C-9.6 -6 -10.2 -4.8 -9.6 -3.8C-11.4 -3.4 -12.4 -2.4 -12.4 0Z'
const KNIGHT =
  'M-12 0H12C12 -2.4 11 -3.4 9.2 -3.8C9.8 -4.8 9.2 -6 7.6 -6.4C6.4 -6.8 5.6 -7.6 5.4 -8.6C8 -9 9 -10 9 -11C9 -11.8 8.2 -12.4 7 -12.6' +
  'C10.4 -18 11.4 -26 9.4 -33C8 -37 5.4 -40 2 -41.4L1 -45.2L-1.4 -40.8C-4 -40.2 -7 -38.6 -9.2 -36C-11.8 -33 -14 -29.6 -15.2 -27.6C-16 -26.2 -15.6 -24.6 -14.2 -24.2' +
  'C-12 -23.6 -10 -24 -8.8 -24.6C-8 -23.6 -7.4 -22 -7.6 -20.6C-8.6 -17.4 -9 -14.6 -7 -12.6C-8.2 -12.4 -9 -11.8 -9 -11C-9 -10 -8 -9 -5.4 -8.6' +
  'C-5.6 -7.6 -6.4 -6.8 -7.6 -6.4C-9.2 -6 -9.8 -4.8 -9.2 -3.8C-11 -3.4 -12 -2.4 -12 0Z'
/** Torre con el cuerpo hasta −h y las almenas arriba. */
const rookPath = (h: number) =>
  `M-12 0H12C12 -2.4 11 -3.4 9.2 -3.8C9.8 -4.8 9.2 -6 7.6 -6.4C6.4 -6.8 5.8 -7.6 5.6 -8.6L4.8 ${-h}C6.6 ${f(-h - 0.4)} 7.4 ${f(-h - 1.2)} 7.4 ${-h - 2}L7.8 ${-h - 3}V${-h - 11}H4.6V${f(-h - 8.4)}H1.6V${-h - 11}` +
  `H-1.6V${f(-h - 8.4)}H-4.6V${-h - 11}H-7.8V${-h - 3}L-7.4 ${-h - 2}C-7.4 ${f(-h - 1.2)} -6.6 ${f(-h - 0.4)} -4.8 ${-h}L-5.6 -8.6C-5.8 -7.6 -6.4 -6.8 -7.6 -6.4C-9.2 -6 -9.8 -4.8 -9.2 -3.8C-11 -3.4 -12 -2.4 -12 0Z`

/** Pieza torneada: volumen con luz a la izquierda, anillos del torno y veta. */
function piece(k: Kit, d: string, x: number, y: number, s: number, w: Wood, o: { rot?: number; rings?: number[]; h?: number; extra?: string; over?: string } = {}) {
  const h = o.h ?? 50
  return (
    `<g transform="translate(${x} ${y}) rotate(${o.rot ?? 0}) scale(${s})">` +
    k.draw([{
      d, fill: w.fill,
      inner:
        k.sh(`M1.4 ${-h}H18V2H1.4Z`, 0, 0, 1, 0, 0, 0.9, w.dark, 0.5) + `<path d="M-18 ${-h}H-3.4V2H-18Z" fill="${k.lin(w.light, 0, 0, 1, 0, 0.75, 0)}"/>` +
        k.sh('M-18 -6.6H18V1H-18Z', 0, 0, 0, 1, 0, 0.6, w.dark, 0.35) +
        (o.rings ?? []).map((r) => `<path d="M-14 ${r}Q0 ${f(r + 1.2)} 14 ${r}" fill="none" stroke="${w.dark}" stroke-width="${f(0.55 / s)}"/>`).join('') +
        hair(-1.6, -9, -2.6, -h * 0.35, -1.2, -h * 0.6, 0.35, w.grain, 0.7) + hair(2.4, -9, 2, -h * 0.3, 2.8, -h * 0.5, 0.3, w.grain, 0.6) +
        (o.extra ?? ''),
    }], f(0.8 / s)) +
    (o.over ?? '') +
    `</g>`
  )
}

/** Brillo vertical de una pieza torneada (sobre el lado de la luz). */
const shine = (x: number, y0: number, y1: number, w = 0.8) => hair(x, y0, x - 0.4, (y0 + y1) / 2, x, y1, w, '#fff', 0.85)

/** Hoja de parra (cinco lóbulos) con la base en (0,0), apuntando hacia arriba. */
const VINE_LEAF = 'M0 0C-1.6 -.6 -4.4 0 -6 -1.6C-5 -2.4 -5.6 -3.6 -7.2 -4.6C-5.6 -5.4 -4.4 -5.2 -3.6 -6.2C-4 -7.6 -3 -9.4 -1.4 -9.4C-1 -8.4 -.4 -8.6 0 -10.6C.4 -8.6 1 -8.4 1.4 -9.4C3 -9.4 4 -7.6 3.6 -6.2C4.4 -5.2 5.6 -5.4 7.2 -4.6C5.6 -3.6 5 -2.4 6 -1.6C4.4 0 1.6 -.6 0 0Z'
function vineLeaf(k: Kit, x: number, y: number, r: number, s: number) {
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: VINE_LEAF, fill: P.green, inner: k.sh(VINE_LEAF, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.5) + `<path d="M0 0V-9M0 -3L-5 -4.4M0 -3L5 -4.4M0 -5.6L-3 -8M0 -5.6L3 -8" fill="none" stroke="${P.greenD}" stroke-width="${f(0.4 / s)}"/>` }], f(0.45 / s)) + `</g>`
}
/** Racimo de uvas colgando desde (x,y). */
function grapes(x: number, y: number, s: number, rot = 0) {
  const pts = [[0, 1.6], [-2.2, 2.4], [2.2, 2.4], [-1.1, 4.4], [1.1, 4.4], [-3.2, 4.6], [3.2, 4.6], [0, 6.4], [-2.2, 6.6], [2.2, 6.6], [-1.1, 8.6], [1.1, 8.6], [0, 10.6]]
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="M0 -1.6C.4 0 0 1 0 2" stroke="${P.brownD}" stroke-width="${f(0.9 / s)}" fill="none"/>` +
    pts.slice().reverse().map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.45" fill="${GRAPE}" stroke="${P.ink}" stroke-width="${f(0.35 / s)}"/><circle cx="${f(px - 0.45)}" cy="${f(py - 0.45)}" r=".45" fill="${GRAPE_L}"/>`).join('') +
    `</g>`
}

export const AJEDREZ_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Jaque mate ─────────────────────────────────────────────────────

  // Tres mates: el caballo de boj ensartado en el caño dorado de la calesita, con el salto en L marcado en el tablero.
  'Caballito de madera': (u) => {
    const k = kit(u)
    // El caballo flota sobre la casilla (0,1); el salto en L va a (−2,2) y queda marcado en el tablero.
    const bx = f(pt(0.5, 1.5)[0]), ay = f(pt(0.5, 1.5)[1]), by = 79.6
    const sq = (u0: number, w0: number) => `M${P2(u0, w0)}L${P2(u0 + 1, w0)}L${P2(u0 + 1, w0 + 1)}L${P2(u0, w0 + 1)}Z`
    const lPath = [[0.5, 1.5], [-1.5, 1.5], [-1.5, 2.5]].map(([uu, ww]) => P2(uu, ww)).join('L')
    const [tx, ty] = pt(-1.5, 2.5)
    const pole = `M${f(bx - 1.3)} 10H${f(bx + 1.3)}V${f(ay + 0.6)}H${f(bx - 1.3)}Z`
    const twist = Array.from({ length: 34 }, (_, i) => `M${f(bx - 1.3)} ${f(12 + i * 2.2)}L${f(bx + 1.3)} ${f(10.4 + i * 2.2)}`).join('')
    const cloth = 'M2.4 -13.6C5.4 -14 8.6 -14.6 10.4 -15.6C11 -18.6 11 -21.6 10.6 -24.2C8 -22.8 5 -22 2.6 -21.8Z'
    const fringe = Array.from({ length: 6 }, (_, i) => `<path d="M${f(2.8 + i * 1.5)} ${f(-13.8 - i * 0.3)}v1.6" stroke="${P.gold}" stroke-width=".6"/>`).join('')
    return (
      walnut(k) +
      k.sun(60, 46, 14, 44, 32, false) +
      board(k) +
      `<path d="${sq(0, 1)}${sq(-1, 1)}${sq(-2, 1)}" fill="${P.gold}" opacity=".6"/><path d="${sq(-2, 2)}" fill="${P.gold}"/>` +
      `<path d="${sq(0, 1)}${sq(-1, 1)}${sq(-2, 1)}${sq(-2, 2)}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      `<path d="M${lPath}" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M${lPath}" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M${f(tx - 1.6)} ${f(ty + 1.6)}L${f(tx)} ${f(ty - 0.4)}L${f(tx + 1.6)} ${f(ty + 1.6)}" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M${f(tx - 1.6)} ${f(ty + 1.6)}L${f(tx)} ${f(ty - 0.4)}L${f(tx + 1.6)} ${f(ty + 1.6)}" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/>` +
      k.floor(bx, ay + 0.4, 10, 1.8, WAL_D) +
      `<path d="${pole}" fill="${P.ink}" transform="translate(.6 0)"/>` +
      k.draw([{ d: pole, fill: P.gold, inner: `<path d="${twist}" stroke="${P.goldL}" stroke-width=".9"/>` + `<path d="${twist}" stroke="${P.goldD}" stroke-width=".4" transform="translate(0 1.1)"/>` + k.sh(pole, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.5) +
      `<g transform="translate(${f(bx)} 30)">` + k.draw([{ d: 'M-3.4 0H3.4L2.6 3H-2.6Z', fill: P.gold, inner: k.sh('M-4 0H4V3H-4Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.4) + `</g>` +
      piece(k, KNIGHT, bx, by, 1.08, BOXW, {
        rings: [-3.8, -6.4, -11], h: 46,
        extra:
          hair(9.6, -16, 10, -26, 7.6, -35, 0.7, BOX_D) + hair(7.4, -15, 8, -24, 6, -33, 0.5, BOX_D) + hair(5, -36, 3, -38.6, 0, -39.6, 0.5, BOX_D) +
          `<path d="M-8.8 -24.6C-6 -26 -4.4 -29 -5 -32.4" fill="none" stroke="${BOX_D}" stroke-width=".55"/>` +
          `<circle cx="-13.8" cy="-26.8" r=".6" fill="${BOX_D}"/>` +
          `<path d="M-9.4 -33.6C-8.4 -34.8 -6.6 -35 -5.6 -34.2C-6.6 -33.2 -8.2 -33 -9.4 -33.6Z" fill="${BOX_D}"/>` +
          shine(-6.6, -11, -20, 0.7) + hair(-10, -36.4, -7, -39, -3, -40, 0.6, '#fff', 0.8),
        over:
          k.draw([{ d: cloth, fill: P.red, inner: k.sh(cloth, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M4 -15.6C6.4 -16 8.6 -16.6 9.8 -17.4" fill="none" stroke="${P.gold}" stroke-width=".5"/>` }], 0.5) + fringe +
          `<path d="M-3 -38.6C-3.4 -33 -5 -27.6 -7.6 -23.4M-4.4 -31C-1 -29.6 1.4 -26.4 2.8 -22" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>` +
          `<path d="M-3 -38.6C-3.4 -33 -5 -27.6 -7.6 -23.4M-4.4 -31C-1 -29.6 1.4 -26.4 2.8 -22" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>` +
          `<circle cx="-4.4" cy="-31" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`,
      }) +
      sparkle(36, 40, 2.2, P.goldL) + sparkle(88, 50, 1.6, P.goldL) + sparkle(84, 30, 1.2, BOX_L) +
      k.defs()
    )
  },

  // Doce mates: la torre de marfil por encima de las nubes, con el monóculo colgando de la almena.
  'Torre de marfil': (u) => {
    const k = kit(u)
    const H = 36, S = 1.18, X = 60, Y = 84
    const rook = rookPath(H)
    const cloud = (cx: number, cy: number, rx: number, ry: number) => {
      const d = fluff(cx, cy, rx, ry, 11)
      return k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0.1, 0.9, P.sky2, 0.5) + `<path d="M${f(cx - rx)} ${f(cy + ry * 0.3)}H${f(cx + rx)}" stroke="${P.sky2}" stroke-width=".5"/>` }], 0.5)
    }
    const mx = 77.4, my = 50
    const chain = `M68.4 ${f(Y - (H + 10) * S)}C72.6 ${f(Y - (H + 4) * S)} 76 42 ${mx} ${f(my - 4.4)}`
    const window = 'M-1.8 -26V-31A1.8 1.8 0 0 1 1.8 -31V-26Z'
    const masonry = `M-4.8 ${-H + 6}H4.8M-5 -20H5M-5.2 -14H5.2M0 ${-H + 6}V-26M-2.6 -20V-14M2.6 -14V-8.6`
    return (
      walnut(k) +
      k.sun(60, 42, 13, 46, 32, false) +
      k.shade(ellipse(60, 44, 22, 22), k.rad(BOX_L, 0.5, 0.5, 0.5, 0.6, 0), BOX_L, 0.4) +
      board(k) +
      k.floor(X, Y + 0.4, 15, 2.4, WAL_D) +
      piece(k, rook, X, Y, S, IVW, {
        rings: [-3.8, -6.4, -(H + 2.2)], h: H + 12,
        extra:
          `<path d="${masonry}" fill="none" stroke="${IVORY_D}" stroke-width=".4"/>` +
          `<path d="${window}" fill="${WAL_D}"/><path d="M-1.8 -31A1.8 1.8 0 0 1 1.8 -31" fill="none" stroke="${P.gold}" stroke-width=".4"/>` +
          shine(-3.2, -10, -32, 0.8) + hair(-6.4, -(H + 9), -6.6, -(H + 6), -6.2, -(H + 3.6), 0.6, '#fff') +
          hair(2, -12, 3.4, -18, 2.4, -24, 0.3, IVORY_D) + hair(-1, -36, 0.4, -38, 2.4, -38.6, 0.3, IVORY_D),
      }) +
      cloud(44, 70, 10, 3.6) + cloud(80, 66, 9, 3.2) + cloud(62, 74.6, 8, 2.6) +
      `<path d="${chain}" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="${chain}" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-dasharray=".9 .5"/>` +
      `<circle cx="${mx}" cy="${my}" r="4.6" fill="${P.sky1}" opacity=".45"/>` +
      `<circle cx="${mx}" cy="${my}" r="4.6" fill="none" stroke="${P.ink}" stroke-width="2.2"/><circle cx="${mx}" cy="${my}" r="4.6" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
      `<circle cx="${mx}" cy="${my}" r="4.6" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-dasharray="1 1.4"/>` +
      `<path d="M${f(mx - 2.6)} ${f(my - 1)}A3 3 0 0 1 ${f(mx - 0.4)} ${f(my - 3)}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      `<circle cx="${mx}" cy="${f(my - 4.8)}" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(40, 36, 2, BOX_L) + sparkle(88, 76, 1.4, P.goldL) + sparkle(mx + 2.4, my + 2, 1.6, '#fff') +
      k.defs()
    )
  },

  // Treinta y cinco mates: simultáneas en el bar. El cafecito humeante y el rey, bajo el sol de Mayo.
  'Najdorf en el café': (u) => {
    const k = kit(u)
    const saucer = 'M57.6 89.6C57.6 87.4 64 85.8 72 85.8C80 85.8 86.4 87.4 86.4 89.6C86.4 91.8 80 93.4 72 93.4C64 93.4 57.6 91.8 57.6 89.6Z'
    const cup = 'M62 74.6C62 82.6 65.4 88.6 72 88.6C78.6 88.6 82 82.6 82 74.6Z'
    const rim = ellipse(72, 74.6, 10, 2.8)
    const coffee = ellipse(72, 74.9, 8.6, 2)
    const handle = 'M81.6 77C85.6 76 88 77.6 87.6 80.4C87.2 83 84.4 84.4 80.4 84.2L80.8 82.4C83.6 82.4 85.4 81.6 85.6 80.2C85.8 78.8 84 78.2 81.4 79Z'
    const spoon = 'M60.6 88.4C61.8 87.2 63.8 87 64.8 87.8L76 87.4L76 88.2L64.8 88.8C63.8 89.8 61.6 89.6 60.6 88.4Z'
    const steam = hair(68, 70.6, 64, 64, 68.4, 57, 0.9, BOX_L, 0.8) + hair(72.4, 70.4, 76.4, 63, 72, 55, 0.8, BOX_L, 0.75) + hair(76.4, 71, 79.4, 66, 77.6, 60, 0.6, BOX_L, 0.6)
    return (
      walnut(k) +
      k.sun(60, 50, 15, 47) +
      k.shade(ellipse(60, 52, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.35) +
      laurel(48, 100, 28, 92, 25, 64, 8) + laurel(72, 100, 92, 92, 95, 64, 8, true) +
      board(k) +
      k.floor(50, 82.6, 13, 2.2, WAL_D) + k.floor(72.6, 92.6, 15, 2.4, WAL_D) +
      piece(k, KING, 49, 82.4, 1.04, BOXW, {
        rings: [-3.8, -6.4, -30.8, -32.4], h: 48,
        extra: shine(-3.4, -10, -27, 0.8) + `<path d="M-6.6 -37.4C-2 -38.6 2 -38.6 6.6 -37.4" fill="none" stroke="${BOX_D}" stroke-width=".45"/>`,
        over: `<path d="M-1.4 -40V-41.6H-4V-44.2H-1.4V-47.4H1.4V-44.2H4V-41.6H1.4V-40Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="0" cy="-42.9" r=".7" fill="${P.red}"/>` +
          `<path d="M-5.6 -30.8H5.6" stroke="${P.gold}" stroke-width=".9"/>`,
      }) +
      k.draw([
        { d: saucer, fill: P.white, inner: k.sh(saucer, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + `<path d="${ellipse(72, 89.2, 10.6, 2.4)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` },
        { d: handle, fill: P.white, inner: k.sh(handle, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.4) },
        {
          d: cup, fill: P.white,
          inner: k.sh('M72 70H84V90H72Z', 0, 0, 1, 0, 0, 0.85, P.sky2, 0.5) + k.sh('M60 82H84V90H60Z', 0, 0, 0, 1, 0, 0.6, P.sky2, 0.35) +
            `<path d="M62.4 78.6Q72 81.6 81.6 78.6" fill="none" stroke="${P.gold}" stroke-width=".7"/><path d="M62.8 80Q72 83 81.2 80" fill="none" stroke="${P.mid}" stroke-width=".45"/>` +
            `<path d="M63 79.3Q72 82.3 81 79.3" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
            `<path d="M71 83.4C70 82.4 70.4 81 71.6 81.2C72.4 81.4 72.4 82.6 71.6 82.8M73 83.4C74 82.4 73.6 81 72.4 81.2" fill="none" stroke="${P.gold}" stroke-width=".4"/>` +
            hair(64.6, 76.4, 64.8, 81, 67, 85.4, 0.9, '#fff', 0.9),
        },
        { d: rim, fill: P.white, inner: `<path d="${coffee}" fill="${WAL_D}"/><path d="${ellipse(71.2, 74.6, 6, 1.2)}" fill="#A9774C"/><path d="${ellipse(70.6, 74.4, 3.4, 0.6)}" fill="#D6A877"/>` },
      ], 0.6) +
      `<path d="${rim}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      k.draw([{ d: spoon, fill: P.sky1, inner: k.sh(spoon, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }], 0.35) +
      steam +
      sparkle(32, 44, 1.8, P.goldL) + sparkle(90, 42, 2, P.goldL) +
      k.defs()
    )
  },

  // ── Pastor ─────────────────────────────────────────────────────────

  // El primer mate del pastor: alguien cayó como un corderito. La ovejita echada sobre el tablero, con su cencerro.
  'Ovejita': (u) => {
    const k = kit(u)
    const body = fluff(64, 76, 19, 10.6, 18)
    const top = fluff(43.6, 63.4, 5.4, 3.6, 9)
    const head = 'M47 63.6C43 62 37.4 63 34.6 66.6C33 68.6 33.4 71 35.6 71.6C39.6 72.6 44.6 71.6 48 69.6Z'
    const ear = 'M45 64.4C47.6 62.2 51 61.8 52.8 62.6C51.4 64.4 48.4 65.6 46 65.8Z'
    const leg = (x: number) => `M${x} 84.6C${f(x - 2)} 84.6 ${f(x - 5)} 85.6 ${f(x - 5.6)} 87C${f(x - 5.8)} 88 ${f(x - 4.6)} 88.4 ${f(x - 3)} 88.2L${f(x + 1)} 87.4Z`
    const bell = 'M44.6 73.4C44.6 71.2 45.8 70 47.2 70C48.6 70 49.8 71.2 49.8 73.4L50.6 75.2H43.8Z'
    return (
      walnut(k) +
      k.sun(60, 64, 14, 44, 32, false) +
      board(k) +
      `<g transform="translate(60 80) scale(1.26) translate(-60 -80)">` +
      k.floor(62, 87.4, 26, 2.6, WAL_D) +
      k.draw([{ d: leg(46), fill: COAT }, { d: leg(56), fill: COAT }], 0.5) +
      k.draw([{
        d: body, fill: P.white,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, P.sky2, 0.55) + k.sh('M40 80H90V90H40Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) +
          curls([[52, 70], [60, 68.4], [68, 68.8], [76, 70.4], [56, 76], [64, 75], [72, 76], [80, 77], [60, 82], [70, 82], [48, 78]], P.sky2, 0.5) +
          curls([[54, 69], [62, 67.6], [70, 68]], '#fff', 0.45),
      }], 0.75) +
      k.draw([
        { d: ear, fill: COAT, inner: `<path d="M46.6 64.8C48.6 63.6 50.6 63.2 51.8 63.4" stroke="#6E5A50" stroke-width=".5" fill="none"/>` },
        { d: head, fill: '#3E322C', inner: `<path d="M34 60H46V68C42 66 38 66.4 34 68Z" fill="${k.lin('#8B7466', 0, 0, 0, 1, 0.8, 0)}"/>` + hair(36, 68.6, 40, 69.6, 45, 68.6, 0.4, '#000') },
      ], 0.55) +
      k.draw([{ d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.5) + curls([[43, 63]], P.sky2, 0.4) }], 0.45) +
      `<path d="M41.4 66.4C42 65.6 43.2 65.4 43.8 66C43.2 66.8 42 66.9 41.4 66.4Z" fill="#000"/><path d="M41.2 65.6C42 64.8 43.4 64.8 44.2 65.4" fill="none" stroke="#8B7466" stroke-width=".4"/>` +
      `<path d="M35 69.4C35.8 69 36.6 69.2 37 69.8" fill="none" stroke="#000" stroke-width=".5"/>` +
      `<path d="M46.4 67C46 69 46.6 71 47.6 71.6" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M46.4 67C46 69 46.6 71 47.6 71.6" fill="none" stroke="${P.red}" stroke-width=".9" stroke-linecap="round"/>` +
      k.draw([{ d: bell, fill: P.gold, inner: k.sh(bell, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.45) + `<circle cx="47.2" cy="75.6" r=".8" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M45.6 72.6C45.8 71.6 46.4 71 47 70.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      hair(36.4, 64.6, 39, 62.6, 42.4, 62.4, 0.5, '#9C8476') +
      `</g>` +
      sparkle(34, 40, 2, P.goldL) + sparkle(88, 44, 1.6, BOX_L) +
      k.defs()
    )
  },

  // Tres mates del pastor: ya mordés en la jugada cuatro. El ovejero alemán con el rey rival entre los dientes.
  'Pastor alemán': (u) => {
    const k = kit(u)
    const head =
      'M-27 -3C-26 -5.4 -24 -6 -21 -6.6C-17 -7.4 -13 -8.4 -10.6 -10.6C-8 -13 -5 -14.6 -2.6 -15L-.8 -29.6C-.4 -30.6 1 -30.6 1.4 -29.4L6.4 -15.6' +
      'C10 -13 13 -8 14.6 -1C16.4 7 17.6 16 17.6 26H-6.6C-7 20 -8.4 15 -9.6 11L-8 9.6L-10.4 8.6L-9 7L-11.4 6' +
      'C-12 5 -14 4 -16 3.6C-19 3.2 -22 2.4 -24.4 1.4C-25.8 .8 -26.8 -.2 -27.2 -1.2C-27.4 -2 -27.4 -2.6 -27 -3Z'
    const farEar = 'M2.6 -15.4C3.6 -20.4 5.4 -25 7.6 -28.2C8.4 -29.2 9.4 -28.8 9.6 -27.6L10.6 -13.4Z'
    const saddle = 'M3.4 -14.6C9 -11.4 13 -6 14.6 -1C16.4 7 17.6 16 17.6 26H8.6C9 18 8.4 10 6 4C4 -1 1 -6 -2 -9.4Z'
    const mask = 'M-27 -3C-26 -5.4 -24 -6 -21 -6.6C-17 -7.4 -13 -8.4 -10.6 -10.6C-9 -8 -9.6 -4.6 -11.6 -2.4C-15 -.4 -20 .8 -24.6 1.2C-26 .6 -26.8 -.2 -27.2 -1.2C-27.4 -2 -27.4 -2.6 -27 -3Z'
    const innerEar = 'M-1.4 -16.4L-.2 -26.8L4 -16.6Z'
    const collar = 'M-6.4 14.4C0 16.6 10 16.4 17.4 13.4L17.6 17.4C10 20.4 0 20.8 -6.2 18.6Z'
    const lip = 'M-26.6 -.6C-23 1.2 -19 2 -15.6 1.8C-14.8 3 -15.2 4.4 -16.4 4.8C-20 4.4 -24 3.2 -26.4 1.6Z'
    return (
      walnut(k) +
      k.sun(60, 52, 15, 46, 32, false) +
      k.shade(ellipse(60, 54, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.35) +
      `<g transform="translate(64.6 63.4) scale(1.14)">` +
      k.draw([{ d: farEar, fill: COAT, inner: `<path d="M4.2 -16L7.8 -26.4L9.6 -15Z" fill="#5A4636"/>` }], 0.6) +
      k.draw([{
        d: head, fill: TAN,
        inner:
          `<path d="${saddle}" fill="${COAT}"/>` + `<path d="${mask}" fill="${COAT}"/>` +
          k.sh('M4 -20H20V30H4Z', 0, 0, 1, 0, 0, 0.6, TAN_D, 0.4) + `<path d="M-28 -16H-4V-6H-28Z" fill="${k.lin(TAN_L, 0, 0, 0, 1, 0.7, 0)}"/>` +
          `<path d="${innerEar}" fill="${TAN_L}"/><path d="M-.4 -17.6L.4 -24.6M1.6 -17.2L1.8 -22" stroke="${TAN_D}" stroke-width=".5"/>` +
          hair(-9, -6, -5, -2, -3, 4, 0.6, TAN_D) + hair(-6, 10, -3, 15, -2, 22, 0.6, TAN_D) + hair(-1, 4, 2, 11, 3, 20, 0.5, TAN_D) + hair(-8, -11.4, -6, -13, -3.6, -13.4, 0.45, TAN_D) +
          hair(-9.6, 8, -7, 9, -4.6, 12, 0.5, TAN_L) + hair(-10.4, 6, -8, 6.4, -6, 8.4, 0.45, TAN_L) +
          hair(7, -8, 10, -4, 11.6, 2, 0.5, '#5A4636') + hair(10, 6, 12, 12, 12.6, 20, 0.5, '#5A4636') + hair(-23, -4.4, -19, -5.8, -14, -6.6, 0.45, '#5A4636'),
      }], 0.75) +
      `<path d="M-27.6 -2.4C-27.4 -4 -25.6 -4.6 -24.6 -3.6C-24 -2.8 -24.8 -1.4 -26.2 -1.2C-27 -1.2 -27.6 -1.6 -27.6 -2.4Z" fill="#000"/><circle cx="-26.4" cy="-3.4" r=".35" fill="#8B7466"/>` +
      `<path d="M-11.2 -11.2C-9.8 -12.4 -7.8 -12.6 -6.6 -11.8C-7.8 -10.8 -9.8 -10.6 -11.2 -11.2Z" fill="#1A120E"/><circle cx="-9" cy="-11.7" r=".35" fill="${TAN_L}"/>` +
      `<path d="M-11.8 -13C-9.8 -14.4 -7.4 -14.4 -5.8 -13.2" fill="none" stroke="${TAN_L}" stroke-width=".55" stroke-linecap="round"/>` +
      // El rey rival, de nogal, atravesado en la boca.
      `<g transform="translate(-18 2) rotate(-62) scale(.58) translate(0 23)">` +
      k.draw([{ d: KING, fill: WALW.fill, inner: k.sh('M1.4 -50H18V2H1.4Z', 0, 0, 1, 0, 0, 0.9, WAL_D, 0.5) + `<path d="M-18 -50H-3.4V2H-18Z" fill="${k.lin(WALW.light, 0, 0, 1, 0, 0.85, 0)}"/>` + `<path d="M-14 -3.8Q0 -2.6 14 -3.8M-14 -30.8Q0 -29.6 14 -30.8" fill="none" stroke="${WAL_D}" stroke-width="1"/>` + hair(-3, -10, -3.6, -18, -3, -26, 1.2, '#fff', 0.6) }], 1.3) +
      `<path d="M-1.4 -40V-41.6H-4V-44.2H-1.4V-47.4H1.4V-44.2H4V-41.6H1.4V-40Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".8"/>` +
      `</g>` +
      k.draw([{ d: lip, fill: COAT }], 0.5) +
      `<path d="M-22.4 2.6L-21.8 4.4L-21 2.8Z" fill="#fff" stroke="${P.ink}" stroke-width=".25"/>` +
      k.draw([{ d: collar, fill: P.red, inner: k.sh(collar, 0, 0, 0, 1, 0, 0.8, P.wine, 0.45) + `<path d="M-6.2 16.4C0 18.6 10 18.4 17.4 15.4" fill="none" stroke="${P.gold}" stroke-width=".4" stroke-dasharray="1 .8"/>` }], 0.5) +
      `<path d="M3 18.8V21" stroke="${P.ink}" stroke-width=".8"/>` +
      k.draw([{ d: starPath(3, 24, 3.4, 1.5, 5), fill: P.gold, inner: k.sh(starPath(3, 24, 3.4, 1.5, 5), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.4) +
      `</g>` +
      sparkle(34, 40, 2, P.goldL) + sparkle(88, 40, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Ocho mates del pastor: la estancia de rivales esquilados. El cayado de oro, la tijera de esquilar y el vellón.
  'Rebaño entero': (u) => {
    const k = kit(u)
    const staff = 'M64.2 36H69V96H64.2Z'
    const crook = 'M64.6 38C64.6 30 60 25.4 54 25.4C48 25.4 44 29.4 44 34.6C44 38.6 46.4 41.6 50 42.6L51 39.2C48.8 38.6 47.6 36.8 47.6 34.6C47.6 31.4 50.2 29 54 29C58 29 60.8 32 60.8 38Z'
    const knop = (y: number) => k.draw([{ d: `M63.6 ${y}C63.6 ${f(y - 1.6)} 64.6 ${f(y - 2.6)} 66.6 ${f(y - 2.6)}C68.6 ${f(y - 2.6)} 69.6 ${f(y - 1.6)} 69.6 ${y}C69.6 ${f(y + 1.6)} 68.6 ${f(y + 2.6)} 66.6 ${f(y + 2.6)}C64.6 ${f(y + 2.6)} 63.6 ${f(y + 1.6)} 63.6 ${y}Z`, fill: P.gold, inner: k.sh('M63 0H70V130H63Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M63.6 ${y}H69.6" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.45)
    const WOOL = '#F7F1E4'
    const fleece = fluff(60, 88, 26, 9.6, 20)
    const bladeT = 'M14 -3.8L35 -1.2C35.8 -1 35.8 -.2 35 0L14 -.4Z'
    const bladeB = 'M14 3.8L34 1.8C34.8 1.6 34.8 .8 34 .7L14 .4Z'
    const handles = 'M1.6 -4.4H14.6V-1.4H1.6ZM1.6 1.4H14.6V4.4H1.6Z'
    const bow = 'M2 -2.9C-3.6 -2.9 -6.4 -1.6 -6.4 0C-6.4 1.6 -3.6 2.9 2 2.9'
    const shears =
      `<g transform="translate(31.6 85.4) rotate(-32)">` +
      `<path d="${bow}" fill="none" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="${bow}" fill="none" stroke="${P.sky1}" stroke-width="1.6" stroke-linecap="round"/>` +
      k.draw([
        { d: handles, fill: P.sky2, inner: k.sh(handles, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + Array.from({ length: 5 }, (_, i) => `<path d="M${f(4 + i * 2.2)} -4.4L${f(5.4 + i * 2.2)} -1.4M${f(4 + i * 2.2)} 1.4L${f(5.4 + i * 2.2)} 4.4" stroke="${P.red}" stroke-width=".7"/>`).join('') },
        { d: bladeB, fill: P.sky1, inner: k.sh(bladeB, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) },
        { d: bladeT, fill: P.white, inner: k.sh(bladeT, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M15 -2.8L33 -.8" stroke="#fff" stroke-width=".6"/>` },
      ], 0.55) +
      `<circle cx="14.4" cy="-2.6" r=".55" fill="${P.ink}"/><circle cx="14.4" cy="2.6" r=".55" fill="${P.ink}"/>` +
      `</g>`
    const volute = `<path d="M54 25.4C48 25.4 44 29.4 44 34.6M54 29C50.2 29 47.6 31.4 47.6 34.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (1.0 + i * 0.16), x = 54 + Math.cos(a) * 8.2, y = 34 + Math.sin(a) * 7.4; return `<circle cx="${f(x)}" cy="${f(y)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    const crockets = [[60, 28.4, 30], [56, 25.2, -10], [50.6, 25.8, -50], [46.4, 28.8, -80]].map(([x, y, r]) => `<path d="M0 0C-.6 -1.6 .4 -3 1.8 -3.4C1.4 -2 1.6 -.8 2.4 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      walnut(k) +
      k.sun(60, 50, 15, 47, 32, false) +
      k.shade(ellipse(60, 50, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      laurel(46, 100, 26, 92, 23, 64, 8) + laurel(74, 100, 94, 92, 97, 64, 8, true) +
      `<g transform="translate(59 65.4) scale(1.12) translate(-60 -62)">` +
      k.cast([staff, crook], 2, 2, WAL_D) +
      k.draw([
        { d: staff, fill: P.gold, inner: k.sh(staff, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M65.4 38V96" stroke="${P.goldL}" stroke-width=".7"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M64.6 ${f(48 + i * 4)}L68.6 ${f(46 + i * 4)}" stroke="${P.goldD}" stroke-width=".45"/>`).join('') },
        { d: crook, fill: P.gold, inner: k.sh(crook, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + volute },
      ], 0.75) +
      crockets + knop(40) + knop(52) +
      `<circle cx="50.4" cy="40.8" r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="50" cy="40.4" r=".45" fill="#fff"/>` +
      `<path d="M66.6 52L66.6 57.4" stroke="${P.ink}" stroke-width=".7"/>` +
      k.draw([{ d: 'M64.2 61.4C64.2 58.6 65.2 57.2 66.6 57.2C68 57.2 69 58.6 69 61.4L69.8 63.2H63.4Z', fill: P.gold, inner: k.sh('M63 56H70V64H63Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.4) +
      `</g>` +
      k.floor(60, 97, 26, 3, WAL_D) +
      k.draw([{
        d: fleece, fill: WOOL,
        inner: k.sh(fleece, 0, 0, 1, 1, 0, 0.85, P.sky2, 0.5) + k.sh('M28 92H92V100H28Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) +
          curls([[42, 85], [50, 82], [58, 81], [66, 81.4], [74, 82.4], [80, 85.4], [46, 92], [54, 90], [62, 89.6], [70, 90], [78, 92]], P.sky2, 0.55) +
          curls([[48, 81.6], [56, 80], [64, 80]], '#fff', 0.5),
      }], 0.75) +
      `<path d="M37.6 86C46 89.6 58 90.4 70 89.4C76 88.8 80.6 87.6 83.6 86M49.4 79.6C50.4 84 50.6 90 49.8 97.4" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M37.6 86C46 89.6 58 90.4 70 89.4C76 88.8 80.6 87.6 83.6 86M49.4 79.6C50.4 84 50.6 90 49.8 97.4" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M37.6 86C46 89.6 58 90.4 70 89.4C76 88.8 80.6 87.6 83.6 86M49.4 79.6C50.4 84 50.6 90 49.8 97.4" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-dasharray=".6 1"/>` +
      shears +
      sparkle(54, 20.6, 2.2, '#fff') + sparkle(88, 44, 1.8, P.goldL) + sparkle(30, 50, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Coronador ──────────────────────────────────────────────────────

  // Tres peones coronados: de la fila de atrás al trono. El peón con una corona de papel de diario.
  'Corona de papel': (u) => {
    const k = kit(u)
    const S = 1.5
    const crown = 'M-7 -27.2L-8 -35.2L-4.6 -31.6L-2.3 -36.6L0 -32L2.3 -36.6L4.6 -31.6L8 -35.2L7 -27.2C2.6 -25.8 -2.6 -25.8 -7 -27.2Z'
    const print = Array.from({ length: 4 }, (_, i) => `<path d="M${f(-6.4 + (i % 2) * 0.6)} ${f(-28.4 - i * 1.2)}h${f(4.4 - (i % 3))}M${f(0.6 + (i % 2) * 0.4)} ${f(-28.4 - i * 1.2)}h${f(3.6 + (i % 2))}" stroke="${P.blue}" stroke-width=".35"/>`).join('')
    return (
      walnut(k) +
      k.sun(60, 48, 14, 44, 32, false) +
      k.shade(ellipse(60, 50, 24, 24), k.rad(BOX_L, 0.5, 0.5, 0.5, 0.5, 0), BOX_L, 0.35) +
      board(k) +
      k.floor(60, 84.4, 16, 2.4, WAL_D) +
      piece(k, PAWN, 60, 84, S, BOXW, {
        rings: [-3.6, -6, -20], h: 34,
        extra: shine(-2.4, -9, -16, 0.6) + `<path d="M-2.4 -29.6C-1.4 -30.8 0 -31.4 1.4 -31.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>`,
        over:
          `<g transform="rotate(8 0 -28)">` +
          k.draw([{ d: crown, fill: P.white, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.45) + print + `<path d="M-2.3 -36.6L-1.2 -26.8M2.3 -36.6L1.2 -26.8M-4.6 -31.6L-5.2 -27M4.6 -31.6L5.2 -27" stroke="${P.sky2}" stroke-width=".4"/>` }], 0.45 / S) +
          `<path d="M-7 -27.2C-2.6 -25.8 2.6 -25.8 7 -27.2" fill="none" stroke="${P.red}" stroke-width=".7"/>` +
          `<text x="0" y="-32.2" ${GEORGIA} font-weight="700" font-size="2" fill="${P.ink}" text-anchor="middle">DIARIO</text>` +
          `</g>`,
      }) +
      sparkle(36, 40, 2, P.goldL) + sparkle(86, 46, 1.6, BOX_L) + sparkle(80, 30, 1.2, P.goldL) +
      k.defs()
    )
  },

  // Diez coronaciones: tus peones ya salen con capa de terciopelo y cuello de armiño.
  'Peón con capa': (u) => {
    const k = kit(u)
    const S = 1.5
    const capeL = 'M-2.6 -18.6C-7.4 -16.6 -10.6 -10 -12.2 -2.4C-12.6 -.6 -11.6 .4 -10 .2C-8 0 -6.6 .8 -5 .4C-5.6 -6.4 -4.6 -13 -2 -17.6Z'
    const capeR = 'M2.6 -18.6C7.4 -16.6 10.6 -10 12.2 -2.4C12.6 -.6 11.6 .4 10 .2C8 0 6.6 .8 5 .4C5.6 -6.4 4.6 -13 2 -17.6Z'
    const ermine = 'M-7.6 -20.6C-4 -18 4 -18 7.6 -20.6C8.4 -17.6 4.6 -15.4 0 -15.4C-4.6 -15.4 -8.4 -17.6 -7.6 -20.6Z'
    const tails = [[-5, -17.8], [-1.6, -16.8], [2, -16.8], [5.2, -17.8]].map(([x, y]) => `<path d="M${x} ${y}l-.4 1.2l.4 -.2l.4 .2Z" fill="${P.ink}"/>`).join('')
    return (
      walnut(k) +
      k.sun(60, 48, 14, 46, 32, false) +
      k.shade(ellipse(60, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.35) +
      board(k) +
      k.floor(60, 84.4, 20, 2.6, WAL_D) +
      piece(k, PAWN, 60, 84, S, BOXW, {
        rings: [-3.6, -6, -20], h: 34,
        extra: shine(-2.4, -9, -16, 0.6) + `<path d="M-2.4 -29.6C-1.4 -30.8 0 -31.4 1.4 -31.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>`,
        over:
          k.draw([
            { d: capeL, fill: P.red, inner: k.sh(capeL, 0, 0, 1, 0, 0, 0.7, P.wine, 0.45) + `<path d="M-14 -20H-8V2H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + hair(-5, -15, -8, -8, -9.4, -1, 0.4, P.wine) + hair(-3.6, -14, -5.4, -7, -6.4, -.6, 0.35, P.wine) + hair(-8.4, -12, -10, -6, -11, -1, 0.35, '#E26A5E') },
            { d: capeR, fill: P.red, inner: k.sh(capeR, 0, 0, 1, 0, 0.3, 0.95, P.wine, 0.5) + hair(5, -15, 8, -8, 9.4, -1, 0.4, P.wine) + hair(3.6, -14, 5.4, -7, 6.4, -.6, 0.35, P.wine) },
          ], 0.6 / S) +
          `<path d="M-12.2 -1.6C-10 -.6 -7.4 -.4 -5 -.6M12.2 -1.6C10 -.6 7.4 -.4 5 -.6" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
          k.draw([{ d: ermine, fill: P.white, inner: k.sh(ermine, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.45) + tails }], 0.5 / S) +
          `<circle cx="0" cy="-15.8" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="-15.8" r=".7" fill="${P.red}"/><path d="M-3.4 -15.6H-1.4M1.4 -15.6H3.4" stroke="${P.gold}" stroke-width=".5"/>`,
      }) +
      sparkle(36, 40, 2.2, P.goldL) + sparkle(86, 44, 1.8, P.goldL) + sparkle(30, 70, 1.2, BOX_L) +
      k.defs()
    )
  },

  // Treinta coronaciones: te desfilan en carroza por Mendoza. La dama coronada de parra, con la banda de reina.
  'Reina de la vendimia': (u) => {
    const k = kit(u)
    const S = 1.14, X = 60, Y = 85
    const rid = k.id('sash')
    const sash = 'M-6.6 -30.6C-3 -30.2 3.4 -26 6.8 -20.4L5.8 -16C2.2 -21.6 -3 -25.6 -6 -26.4Z'
    const sashLow = 'M5.8 -16C5.2 -11 6.4 -6 9.4 -3.4L7.2 -2.2C4.4 -5.2 3.2 -10 3.8 -15Z'
    const pearls = [[-8, -39.6], [-3.8, -40.4], [0, -41], [3.8, -40.4], [8, -39.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    const branch = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` +
      `<path d="M50 99C36 94 28 84 27 68C26.4 58 29 50 33 44" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M50 99C36 94 28 84 27 68C26.4 58 29 50 33 44" fill="none" stroke="${P.brownD}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M28.4 58C25 56 24 52 26 50M30 78C26 78 24 75 25.4 72" fill="none" stroke="${P.greenD}" stroke-width=".55" stroke-linecap="round"/>` +
      vineLeaf(k, 33, 44.6, -20, 0.9) + vineLeaf(k, 28, 56, -60, 0.95) + vineLeaf(k, 27.4, 70, -80, 1) + vineLeaf(k, 31, 84, -110, 0.95) + vineLeaf(k, 40, 94, -140, 0.85) +
      grapes(31.6, 62, 0.85, 10) + grapes(34.4, 86.4, 0.8, -20) +
      `</g>`
    return (
      walnut(k) +
      k.sun(60, 50, 15, 47) +
      k.shade(ellipse(60, 52, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      board(k) +
      branch(1) + branch(-1) +
      k.floor(X, Y + 0.4, 16, 2.4, WAL_D) +
      piece(k, QUEEN, X, Y, S, BOXW, {
        rings: [-3.8, -6.4, -30.8, -32.4], h: 44,
        extra: shine(-3.4, -10, -27, 0.8) + `<path d="M-6.8 -36.8C-2 -38 2 -38 6.8 -36.8" fill="none" stroke="${BOX_D}" stroke-width=".45"/>`,
        over:
          k.draw([{ d: sash, fill: P.white, inner: k.sh(sash, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="M-6.4 -29.4C-3 -29 2.6 -25 6.2 -19.4" fill="none" stroke="${P.sky}" stroke-width=".5"/>` }, { d: sashLow, fill: P.white, inner: k.sh(sashLow, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) }], 0.5 / S) +
          `<path id="${rid}" d="M-6.2 -28.2C-2.6 -27.4 2.2 -24 5.4 -19.2" fill="none"/>` +
          `<text ${GEORGIA} font-style="italic" font-size="2.3" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">Vendimia</textPath></text>` +
          k.draw([{ d: starPath(7.6, -3.2, 2.2, 1, 8), fill: P.gold }], 0.4 / S) +
          `<path d="M-8 -39.2L-5.8 -37.4L-3.8 -40L-1.8 -37.6L0 -40.6L1.8 -37.6L3.8 -40L5.8 -37.4L8 -39.2" fill="none" stroke="${P.gold}" stroke-width="1"/>` + pearls +
          vineLeaf(k, -6, -38, -40, 0.5) + vineLeaf(k, 6, -38, 40, 0.5) + vineLeaf(k, 0, -40, 0, 0.45) +
          grapes(-7.4, -37.6, 0.38, 20) + grapes(7.4, -37.6, 0.38, -20) +
          `<circle cx="0" cy="-43.6" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-.7" cy="-44.3" r=".7" fill="${P.goldL}"/>`,
      }) +
      sparkle(60, 20.6, 2.4, '#fff') + sparkle(88, 40, 1.6, P.goldL) + sparkle(32, 38, 1.4, P.goldL) +
      k.defs()
    )
  },
}
