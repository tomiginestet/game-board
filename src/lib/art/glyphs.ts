// Dibujos genéricos para medallas sin ilustración propia (juegos agregados a mano o por la IA).
// Mismo lenguaje que las ilustraciones nuevas (ver docs/medallas-filosofia.md y ./kit.ts): una estampa con la paleta
// fija `P`, tinta azul con línea con peso, sombras con grano y un fondo que enmarca. El color del juego entra como
// acento, apagado para que no rompa la paleta, en una sola pieza (la joya, el techo, la ficha) o en el velo del fondo.
import type { Glyph } from '../games/schema'
import { f } from './helpers'
import { along, card, chessPiece, die, ellipse, flame, hair, kit, P, PAWN, roundRect, sparkle, starPath, taper, type Kit, type Piece } from './kit'

const rgb = (h: string) => {
  const m = h.trim().match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (!m) return null
  const x = m[1].length <= 4 ? m[1].slice(0, 3).replace(/./g, (d) => d + d) : m[1].slice(0, 6)
  return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16))
}
/** Mezcla un color hex con otro (t=0 → c, t=1 → o). Si alguno no es hex, devuelve `c`. */
const mix = (c: string, o: string, t: number) => {
  const a = rgb(c), b = rgb(o)
  if (!a || !b) return c
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
const hash = (s: string) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h }

/** Acento del juego: el color apagado hacia gris y papel, con su sombra (hacia la tinta) y su luz. */
function accent(color: string) {
  const c = rgb(color) ? mix(color, '#000', 0).slice(0, 7) : P.gold
  const [r, g, b] = rgb(c)!
  const l = Math.round(r * 0.3 + g * 0.59 + b * 0.11), grey = '#' + [l, l, l].map((v) => v.toString(16).padStart(2, '0')).join('')
  const a = mix(mix(c, grey, 0.22), P.paper, 0.14)
  return { a, d: mix(a, P.ink, 0.42), l: mix(a, P.white, 0.5) }
}
type Acc = ReturnType<typeof accent>

const glint = (x: number, y: number, rx: number, ry: number, rot = -35, op = 0.85) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`
/** Pieza con volumen: sombra del tono hacia abajo a la derecha, más lo que vaya adentro. */
const vol = (k: Kit, d: string, fill: string, dark: string, extra = '', line?: number): Piece => ({ d, fill, line, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.45) + extra })
/** Luz de la izquierda, recortada a la pieza. */
const lit = (k: Kit, x0: number, x1: number, a = 0.45) => `<path d="M${x0} 0H${x1}V130H${x0}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, a, 0)}"/>`

const DRAW: Record<Glyph, (k: Kit, c: Acc) => string> = {
  // Corona de oro con la joya del medio en el color del juego.
  crown: (k, c) => {
    const crown = 'M37 76L33 44L46.6 57L60 36L73.4 57L87 44L83 76Z'
    const band = roundRect(35, 67, 85, 79, 2.4)
    return (
      k.floor(61, 84, 26, 3) +
      k.draw([
        vol(k, crown, P.gold, P.goldD, lit(k, 30, 50) + `<path d="M46.6 57L48 67M73.4 57L72 67M60 36V67" stroke="${P.goldD}" stroke-width=".5"/>`, 0.4),
        vol(k, band, P.goldL, P.goldD, `<path d="M37 75.6H83" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`),
      ], 0.85) +
      [[33, 44], [60, 36], [87, 44]].map(([x, y]) => k.draw([vol(k, ellipse(x, y - 1.4, 3, 3), P.goldL, P.goldD)], 0.5)).join('') +
      k.draw([vol(k, 'M60 66.4L64.6 73L60 79.6L55.4 73Z', c.a, c.d, `<path d="M55.4 73L60 66.4V73Z" fill="#fff" opacity=".45"/>`)], 0.55) +
      [44, 76].map((x) => k.draw([vol(k, ellipse(x, 73, 2.6, 2.6), P.red, P.wine)], 0.45)).join('') +
      glint(43, 52, 3, 1.2, -60)
    )
  },

  // Copa de oro sobre un pedestal en el color del juego, con una estrella grabada.
  trophy: (k, c) => {
    const cup = 'M40 33H80C80.4 52 73 65 60 67C47 65 39.6 52 40 33Z'
    const stem = 'M56.4 66.4H63.6L65.6 76H54.4Z'
    const foot = 'M50 76H70L72.4 80H47.6Z'
    const base = roundRect(45, 80, 75, 92, 1.6)
    const handle = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="5.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="3.4" stroke-linecap="round"/>`
    return (
      k.floor(61, 92.4, 22, 2.4) +
      handle('M41.4 38C30 37 30 53 45 55.6') + handle('M78.6 38C90 37 90 53 75 55.6') +
      k.draw([
        vol(k, base, c.a, c.d, `<rect x="52" y="83.4" width="16" height="5.2" rx=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` + lit(k, 44, 52, 0.3)),
        vol(k, foot, P.gold, P.goldD),
        vol(k, stem, P.gold, P.goldD),
        vol(k, cup, P.gold, P.goldD, lit(k, 38, 52) + k.sh('M40 50H80V68H40Z', 0, 0, 0, 1, 0, 0.6, P.goldD, 0.3)),
      ], 0.85) +
      k.draw([vol(k, ellipse(60, 33, 20, 3.6), P.goldL, P.goldD, `<path d="${ellipse(60, 33.6, 16.6, 2.2)}" fill="${P.goldD}"/>`)], 0.6) +
      k.draw([vol(k, starPath(60, 48, 6.6, 2.8, 5), P.goldL, P.goldD)], 0.4) +
      `<path d="M45 39C45.4 46 47.6 52 51.4 56.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`
    )
  },

  // Estrella facetada de oro con dos estrellitas en el color del juego.
  star: (k, c) => {
    const R = 28, r = 12.4, cx = 60, cy = 58, pts = Array.from({ length: 10 }, (_, i) => {
      const a = ((-90 + i * 36) * Math.PI) / 180, rr = i % 2 ? r : R
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
    })
    const facets = pts.map((p, i) => (i % 2 ? '' : `M${cx} ${cy}L${f(p[0])} ${f(p[1])}L${f(pts[(i + 9) % 10][0])} ${f(pts[(i + 9) % 10][1])}Z`)).join('')
    const ridges = pts.map((p) => `M${cx} ${cy}L${f(p[0])} ${f(p[1])}`).join('')
    const s = starPath(cx, cy, R, r, 5)
    return (
      k.cast([s], 2.4, 2.4) +
      k.draw([{ d: s, fill: P.gold, inner: `<path d="${facets}" fill="${P.goldL}"/>` + k.sh(s, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ridges}" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.9) +
      k.draw([vol(k, starPath(31, 36, 6, 2.6, 5, -80), c.a, c.d), vol(k, starPath(88, 80, 4.6, 2, 5, -100), c.a, c.d)], 0.5) +
      glint(51, 45, 3, 1.3, -55)
    )
  },

  // Fuego en un brasero del color del juego.
  flame: (k, c) => {
    const bowl = 'M40 78H80C79 88 71 94 60 94C49 94 41 88 40 78Z'
    return (
      k.floor(61, 94, 18, 2.4) +
      flame(k, 'translate(60 81) scale(.6) translate(-60 -90)') +
      k.draw([
        vol(k, bowl, c.a, c.d, lit(k, 38, 50, 0.3) + `<path d="M43 84.6H77" stroke="${c.d}" stroke-width=".6"/>`),
        vol(k, roundRect(37, 75.4, 83, 80.4, 2.4), P.gold, P.goldD),
      ], 0.8) +
      sparkle(40, 50, 1.6, P.goldL) + sparkle(82, 56, 1.3, P.goldL)
    )
  },

  // Dos dados sobre un paño en el color del juego.
  dice: (k, c) => {
    const felt = ellipse(60, 82, 30, 8)
    return (
      k.draw([vol(k, felt, c.a, c.d, `<path d="${ellipse(60, 82, 25, 5.6)}" fill="none" stroke="${c.l}" stroke-width=".5" stroke-dasharray="1.2 1"/>`)], 0.7) +
      k.floor(52, 81, 16, 2.6, P.ink) + k.floor(78, 83, 9, 1.8, P.ink) +
      die(k, 50, 56, 17, -8) + die(k, 78, 70, 9, 14)
    )
  },

  // Abanico de cartas: el dorso en el color del juego y dos ases.
  cards: (k, c) => {
    const back = roundRect(-6.6, -19, 6.6, 0, 1.4)
    const inner = roundRect(-5, -17.4, 5, -1.6, 0.8)
    let lattice = ''
    for (let i = -5; i <= 5; i++) lattice += `M${i * 2.4 - 6} -19L${i * 2.4 + 6} 0M${i * 2.4 + 6} -19L${i * 2.4 - 6} 0`
    return (
      k.floor(60, 89, 22, 2.6) +
      `<g transform="translate(58 88) rotate(-24) scale(2)">` +
      k.draw([{ d: back, fill: c.a, inner: `<path d="${lattice}" stroke="${c.l}" stroke-width=".3" opacity=".7"/>` + k.sh(back, 0, 0, 1, 1, 0, 0.8, c.d, 0.4) + `<path d="${inner}" fill="none" stroke="${P.white}" stroke-width=".45"/>` }], 0.4) +
      `</g>` +
      card(k, 60, 89, -2, 's', 2) + card(k, 63, 90, 22, 'h', 2)
    )
  },

  // Corazón rojo grabado, con dos corazoncitos en el color del juego.
  heart: (k, c) => {
    const H = (x: number, y: number, s: number) =>
      `M${x} ${f(y + 28 * s)}C${f(x - 20 * s)} ${f(y + 14 * s)} ${f(x - 30 * s)} ${f(y + 2 * s)} ${f(x - 30 * s)} ${f(y - 12 * s)}C${f(x - 30 * s)} ${f(y - 22 * s)} ${f(x - 23 * s)} ${f(y - 28 * s)} ${f(x - 15 * s)} ${f(y - 28 * s)}` +
      `C${f(x - 8 * s)} ${f(y - 28 * s)} ${f(x - 3 * s)} ${f(y - 24 * s)} ${x} ${f(y - 18 * s)}C${f(x + 3 * s)} ${f(y - 24 * s)} ${f(x + 8 * s)} ${f(y - 28 * s)} ${f(x + 15 * s)} ${f(y - 28 * s)}` +
      `C${f(x + 23 * s)} ${f(y - 28 * s)} ${f(x + 30 * s)} ${f(y - 22 * s)} ${f(x + 30 * s)} ${f(y - 12 * s)}C${f(x + 30 * s)} ${f(y + 2 * s)} ${f(x + 20 * s)} ${f(y + 14 * s)} ${x} ${f(y + 28 * s)}Z`
    const h = H(60, 60, 1)
    return (
      k.cast([h], 2.4, 2.4) +
      k.draw([vol(k, h, P.red, P.wine, lit(k, 28, 46, 0.35) + `<path d="${H(60, 60, 0.8)}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`)], 0.9) +
      `<path d="M37 44C38 38 43 35.4 48 36" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>` +
      hair(66, 79, 74, 73, 80, 64, 0.7, P.wine) +
      k.draw([vol(k, H(30, 80, 0.2), c.a, c.d), vol(k, H(90, 34, 0.16), c.a, c.d)], 0.45)
    )
  },

  // Escudo con el campo en el color del juego, banda blanca y estrella de oro.
  shield: (k, c) => {
    const out = 'M35 32H85V56C85 72 75 83 60 92C45 83 35 72 35 56Z'
    const field = 'M40 37H80V56C80 69 72 78 60 85.6C48 78 40 69 40 56Z'
    const band = 'M40 47L50 37H58L40 55Z M80 63V71L62 85.6L56 82Z'
    return (
      k.cast([out], 2.4, 2.4) +
      k.draw([
        vol(k, out, P.gold, P.goldD, lit(k, 33, 44) + `<path d="${field}" fill="none" stroke="${P.goldD}" stroke-width="3.6"/>`),
        vol(k, field, c.a, c.d, `<path d="${band}" fill="${P.white}" opacity=".9"/>` + k.sh(field, 0, 0, 1, 1, 0, 0.6, c.d, 0.3), 0.4),
      ], 0.9) +
      k.draw([vol(k, starPath(60, 59, 10, 4.2, 5), P.gold, P.goldD, `<path d="${starPath(60, 59, 10, 4.2, 5)}" fill="${P.goldL}" opacity=".5" transform="translate(-1 -1)"/>`)], 0.5) +
      `<path d="M37.6 36V55" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/>`
    )
  },

  // Moneda de oro de canto, sobre una pila, con la piedra del medio en el color del juego.
  coin: (k, c) => {
    const edge = ellipse(59, 57, 24, 24), face = ellipse(56.6, 54.6, 24, 24), ring = ellipse(56.6, 54.6, 18, 18)
    const stack = [0, 1, 2].map((i) => ellipse(80, 88 - i * 4, 9, 3))
    let ridges = ''
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      ridges += `M${f(59 + Math.cos(a) * 21.6)} ${f(57 + Math.sin(a) * 21.6)}L${f(59 + Math.cos(a) * 24)} ${f(57 + Math.sin(a) * 24)}`
    }
    return (
      k.floor(60, 84, 22, 3) +
      stack.map((d) => k.draw([vol(k, d, P.gold, P.goldD, `<path d="${d}" fill="none" stroke="${P.goldD}" stroke-width=".4" transform="translate(0 -1)"/>`)], 0.55)).join('') +
      k.draw([vol(k, edge, P.goldD, P.brownD, `<path d="${ridges}" stroke="${P.brownD}" stroke-width=".6"/>`)], 0.85) +
      k.draw([vol(k, face, P.gold, P.goldD, lit(k, 30, 46) + `<path d="${ring}" fill="${P.goldL}" opacity=".35"/>`)], 0.6) +
      `<path d="${ring}" fill="none" stroke="${P.goldD}" stroke-width=".7" stroke-dasharray=".01 1.8" stroke-linecap="round"/>` +
      k.draw([vol(k, starPath(56.6, 54.6, 11, 4.6, 5), P.goldL, P.goldD)], 0.45) +
      k.draw([vol(k, ellipse(56.6, 55.4, 3.4, 3.4), c.a, c.d, glint(55.6, 54.2, 1.2, 0.6))], 0.4) +
      `<path d="M38 50C39 43 44 37.6 50.6 35.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".85"/>`
    )
  },

  // El jugador: un peón de juego en el color del juego y una ficha redonda caída al lado.
  meeple: (k, c) => {
    const chip = ellipse(83, 84, 9.4, 3.6), chipTop = ellipse(83, 82, 9.4, 3.6)
    return (
      k.floor(57, 83.6, 17, 2.6) + k.floor(84, 86.4, 11, 2) +
      k.draw([vol(k, chip, P.goldD, P.brownD), vol(k, chipTop, P.gold, P.goldD, `<path d="${ellipse(83, 82, 6, 2.2)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`)], 0.55) +
      chessPiece(k, PAWN, 57, 59.6, 2.9, c.a, { shade: c.d, rings: [-3.6, -.6, 4.6] }) +
      glint(52, 34, 2.4, 1.2, -50, 0.8)
    )
  },

  // Rayo de oro con chispas en el color del juego.
  bolt: (k, c) => {
    const b = 'M67 24L40 62H55.6L46 94L83 50H66.4L77 24Z'
    return (
      k.cast([b], 2.6, 2.4) +
      k.draw([vol(k, b, P.gold, P.goldD, `<path d="M67 24L40 62H48L71 28Z" fill="${P.goldL}"/>`)], 0.9) +
      hair(28, 44, 34, 42, 40, 44, 0.8, P.blue) + hair(26, 52, 32, 50, 38, 52, 0.6, P.blue) + hair(82, 64, 88, 62, 94, 64, 0.7, P.blue) +
      k.draw([vol(k, starPath(36, 78, 4.6, 1.2, 4), c.a, c.d), vol(k, starPath(88, 34, 4, 1, 4), c.a, c.d)], 0.45)
    )
  },

  // Calavera de estampa sobre dos huesos cruzados.
  skull: (k, c) => {
    const bone = (x0: number, y0: number, x1: number, y1: number) => {
      const a = Math.atan2(y1 - y0, x1 - x0), px = -Math.sin(a) * 2.6, py = Math.cos(a) * 2.6
      const knob = (x: number, y: number) => ellipse(x + px, y + py, 3.6, 3.6) + ellipse(x - px, y - py, 3.6, 3.6)
      return [
        vol(k, knob(x0, y0), P.skin, P.brown),
        vol(k, knob(x1, y1), P.skin, P.brown),
        vol(k, taper(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 4.6, 4.6), P.skin, P.brown),
      ]
    }
    const head = 'M60 28C44.6 28 36 39 36 51.6C36 59.6 39.6 64.8 45 67.4V74.6C45 77.4 47 78.6 49.6 78.6H70.4C73 78.6 75 77.4 75 74.6V67.4C80.4 64.8 84 59.6 84 51.6C84 39 75.4 28 60 28Z'
    const eye = (x: number, s: number) => `M${x} ${f(48.6)}C${f(x + 6 * s)} 48 ${f(x + 8 * s)} 52 ${f(x + 7.4 * s)} 56C${f(x + 6.6 * s)} 60 ${f(x + 1 * s)} 61 ${f(x - 2 * s)} 58.6C${f(x - 4 * s)} 56.6 ${f(x - 4 * s)} 49.4 ${x} 48.6Z`
    return (
      k.floor(60, 88, 26, 3) +
      k.draw([...bone(37, 87, 83, 64), ...bone(37, 64, 83, 87)], 0.6) +
      k.draw([vol(k, head, P.white, P.blue, lit(k, 34, 46, 0.4) + k.sh('M36 62H84V80H36Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3))], 0.9) +
      `<path d="${eye(49.4, 1)}" fill="${P.ink}"/><path d="${eye(70.6, -1)}" fill="${P.ink}"/>` +
      `<circle cx="51" cy="53.4" r="1.6" fill="${c.l}"/><circle cx="69" cy="53.4" r="1.6" fill="${c.l}"/>` +
      `<path d="M60 60.4L63 67H57Z" fill="${P.ink}"/>` +
      `<path d="M52.6 71.4V78.4M56.2 71.6V78.6M60 71.8V78.6M63.8 71.6V78.6M67.4 71.4V78.4M50 71.4C56 72.8 64 72.8 70 71.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(40, 44, 41, 37, 46, 33, 0.9, '#fff') + hair(72, 36, 77, 40, 80, 48, 0.6, P.blue)
    )
  },

  // Cohete despegando: la punta y las aletas en el color del juego.
  rocket: (k, c) => {
    const body = 'M60 22C70 30 74 45 72 66H48C46 45 50 30 60 22Z'
    const nose = 'M60 22C65.4 26.4 68.6 32 70.2 38H49.8C51.4 32 54.6 26.4 60 22Z'
    const finL = 'M49 52C42 56 38 64 38 74L49 67Z', finR = 'M71 52C78 56 82 64 82 74L71 67Z'
    const nozzle = 'M51 66H69L67 71H53Z'
    return (
      `<g transform="rotate(18 60 60)">` +
      flame(k, 'translate(60 69) scale(.3 -.34) translate(-60 -90)') +
      k.draw([
        vol(k, finL, c.a, c.d), vol(k, finR, c.a, c.d),
        vol(k, nozzle, P.mid, P.night),
        vol(k, body, P.white, P.blue, lit(k, 46, 55, 0.5) + `<path d="${nose}" fill="${c.a}"/>` + k.sh(nose, 0, 0, 1, 1, 0, 0.8, c.d, 0.4) + `<path d="M48 38.6H72" stroke="${P.ink}" stroke-width=".5"/>` +
          `<path d="M48 61H72" stroke="${P.blue}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>`),
        vol(k, taper(60, 52, 60, 62, 60, 72, 2.4, 2.4), c.a, c.d),
      ], 0.85) +
      k.draw([vol(k, ellipse(60, 47, 5.6, 5.6), P.gold, P.goldD), vol(k, ellipse(60, 47, 3.8, 3.8), P.sky, P.mid, glint(58.6, 45.6, 1.4, 0.7))], 0.5) +
      `</g>` +
      [[38, 92, 5], [30, 86, 3.6], [86, 92, 4]].map(([x, y, r]) => k.draw([vol(k, ellipse(x, y, r, r * 0.8), P.white, P.sky)], 0.5)).join('') +
      sparkle(34, 36, 2, P.goldL) + sparkle(88, 44, 1.6, P.goldL)
    )
  },

  // Cerebro de estampa, con la idea saltando en chispas del color del juego.
  brain: (k, c) => {
    const PINK = '#EBB4AA', PINK_D = '#B5625C'
    const b = 'M60 33C54 28 44 30 42 37C35 38 31.6 46 34.6 52C30.6 57.6 33 66 40 68C42 75 50 78.6 56 74.6L60 72L64 74.6C70 78.6 78 75 80 68C87 66 89.4 57.6 85.4 52C88.4 46 85 38 78 37C76 30 66 28 60 33Z'
    const folds =
      hair(60, 34, 58, 52, 60, 72, 0.9, PINK_D) +
      hair(43, 38, 50, 42, 48, 49, 0.7, PINK_D) + hair(36, 53, 44, 52, 48, 58, 0.7, PINK_D) + hair(41, 66, 47, 62, 53, 66, 0.7, PINK_D) +
      hair(77, 38, 70, 42, 72, 49, 0.7, PINK_D) + hair(84, 53, 76, 52, 72, 58, 0.7, PINK_D) + hair(79, 66, 73, 62, 67, 66, 0.7, PINK_D) +
      hair(50, 31.6, 54, 38, 52, 44, 0.6, PINK_D) + hair(70, 31.6, 66, 38, 68, 44, 0.6, PINK_D)
    return (
      k.floor(60, 84, 20, 2.4) +
      k.draw([vol(k, taper(60, 72, 61, 78, 63, 84, 6, 4), PINK, PINK_D)], 0.6) +
      k.draw([vol(k, b, PINK, PINK_D, lit(k, 30, 46, 0.4) + folds)], 0.9) +
      glint(44, 42, 3, 1.3, -40) +
      k.draw([vol(k, starPath(31, 34, 5, 1.3, 4), c.a, c.d), vol(k, starPath(89, 38, 4, 1, 4), c.a, c.d), vol(k, starPath(84, 24, 2.6, .7, 4), c.a, c.d)], 0.45)
    )
  },

  // El ojo que todo lo ve, con el iris en el color del juego.
  eye: (k, c) => {
    const al = 'M26 58C36 42 49 35 60 35C71 35 84 42 94 58C84 74 71 81 60 81C49 81 36 74 26 58Z'
    const lid = 'M26 58C36 42 49 35 60 35C71 35 84 42 94 58C84 47 72 42 60 42C48 42 36 47 26 58Z'
    const lashes = [-2, -1, 0, 1, 2].map((i) => { const x = 60 + i * 12, y = 35 + Math.abs(i) ** 1.6 * 2.4; return hair(x, f(y), x + i * 1.6, f(y - 4), x + i * 3, f(y - 7), 1, P.ink) }).join('')
    return (
      lashes +
      k.draw([vol(k, al, P.white, P.blue, k.sh('M20 60H100V84H20Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
        `<circle cx="60" cy="58" r="14" fill="${c.a}"/>` + k.shade(ellipse(60, 58, 14, 14), k.rad(c.d, 0.5, 0.5, 0.5, 0, 0.9), c.d, 0.4) +
        Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `M${f(60 + Math.cos(a) * 7.4)} ${f(58 + Math.sin(a) * 7.4)}L${f(60 + Math.cos(a) * 12.6)} ${f(58 + Math.sin(a) * 12.6)}` }).reduce((s, d) => s + d, `<path stroke="${c.l}" stroke-width=".5" opacity=".7" d="`) + `"/>` +
        `<circle cx="60" cy="58" r="14" fill="none" stroke="${P.ink}" stroke-width=".8"/>` +
        `<circle cx="60" cy="58" r="6.4" fill="${P.night}"/>` + glint(55.4, 53.2, 2.8, 1.8, -30, 0.95) + `<circle cx="65" cy="62" r="1" fill="#fff" opacity=".8"/>` +
        `<path d="${lid}" fill="${P.sky1}"/>` + k.sh(lid, 0, 0, 0, 1, 0.2, 0.8, P.blue, 0.4))], 0.95) +
      hair(30, 61, 46, 74, 60, 75, 0.7, P.blue)
    )
  },

  // Trébol de cuatro hojas con una cinta del color del juego en el tallo.
  clover: (k, c) => {
    const leaf = 'M0 0C-4 -4 -14 -8 -14 -16C-14 -22 -8 -25 -4 -23C-2 -22 -.6 -20 0 -18C.6 -20 2 -22 4 -23C8 -25 14 -22 14 -16C14 -8 4 -4 0 0Z'
    const cx = 60, cy = 52
    const leaves = [45, 135, 225, 315].map((r) => ({ ...vol(k, leaf, P.green, P.greenD, `<path d="M-30 -30H-4V4H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + hair(0, -1, 0, -9, 0, -17, 0.7, P.greenD)), t: `translate(${cx} ${cy}) rotate(${r}) translate(0 -1.4)` }))
    return (
      k.floor(62, 92, 16, 2.4) +
      k.draw([vol(k, taper(60, 54, 70, 72, 64, 92, 3.6, 2.4), P.green, P.greenD)], 0.6) +
      leaves.map((l) => k.draw([l], 0.8)).join('') +
      k.draw([vol(k, ellipse(cx, cy, 2.6, 2.6), P.greenD, P.greenD)], 0.4) +
      k.draw([vol(k, 'M65 79L61.4 89L64 88.4L65.6 91L67.4 79.6Z', c.a, c.d), vol(k, 'M66 79L69 88.4L71.4 87L69 79Z', c.a, c.d)], 0.45) +
      k.draw([{ ...vol(k, ellipse(0, 0, 4.4, 2.4), c.a, c.d), t: 'translate(61.4 77.4) rotate(-30)' }, { ...vol(k, ellipse(0, 0, 4.4, 2.4), c.a, c.d), t: 'translate(70.6 77) rotate(25)' }, vol(k, ellipse(66.2, 78, 2, 2), c.l, c.d)], 0.45) +
      glint(44, 38, 2.6, 1.2, -50, 0.7) + sparkle(88, 34, 2, P.goldL)
    )
  },

  // Piedra preciosa tallada en el color del juego.
  gem: (k, c) => {
    const out = 'M42 36H78L92 52L60 90L28 52Z'
    const lit2 = mix(c.a, P.white, 0.3)
    return (
      k.cast([out], 2.4, 2.4) +
      k.draw([{
        d: out, fill: c.a,
        inner:
          `<path d="M42 36L28 52H48Z" fill="${c.l}"/><path d="M42 36L48 52L60 36Z" fill="${lit2}"/><path d="M60 36L72 52L78 36Z" fill="${c.a}"/><path d="M78 36L72 52H92Z" fill="${c.d}"/>` +
          `<path d="M28 52L60 90L48 52Z" fill="${lit2}"/><path d="M48 52L60 90L72 52Z" fill="${c.a}"/><path d="M72 52L60 90L92 52Z" fill="${c.d}"/>` +
          k.sh(out, 0, 0, 1, 1, 0, 0.7, c.d, 0.4) +
          `<path d="M28 52H92M42 36L48 52L60 90L72 52L78 36M48 52L60 36L72 52" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>`,
      }], 0.9) +
      `<path d="M34 54L50 74" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".75"/>` +
      sparkle(46, 40, 2.6) + sparkle(88, 32, 2.6, P.goldL) + sparkle(30, 76, 1.8, P.goldL)
    )
  },

  // Espada en diagonal, con la empuñadura en el color del juego.
  sword: (k, c) => {
    const blade = 'M55.6 70V30L60 20L64.4 30V70Z'
    const guard = roundRect(43, 69, 77, 75, 3)
    const grip = 'M56.4 75H63.6V89H56.4Z'
    return (
      k.floor(60, 92, 16, 2.4) +
      `<g transform="rotate(38 60 58)">` +
      k.draw([
        vol(k, blade, P.white, P.blue, `<path d="M60 22V70" stroke="${P.sky}" stroke-width="1.2"/><path d="M60 22V70" stroke="${P.blue}" stroke-width=".4"/>` + lit(k, 54, 58.6, 0.6) + k.sh('M60 18H66V72H60Z', 0, 0, 1, 0, 0.2, 0.8, P.blue, 0.4)),
        vol(k, grip, c.a, c.d, `<path d="M56 78L64 76M56 82L64 80M56 86L64 84" stroke="${c.d}" stroke-width=".7"/>`),
        vol(k, guard, P.gold, P.goldD, lit(k, 42, 50, 0.4)),
        vol(k, ellipse(60, 92, 4.6, 4.6), P.gold, P.goldD),
      ], 0.85) +
      `<circle cx="60" cy="72" r="1.8" fill="${c.a}" stroke="${P.ink}" stroke-width=".4"/>` +
      hair(57.4, 34, 57, 50, 57.4, 66, 0.8, '#fff') +
      `</g>` +
      sparkle(40, 34, 3, P.goldL) + sparkle(30, 48, 1.6, P.white)
    )
  },

  // Casa con el techo de tejas en el color del juego.
  house: (k, c) => {
    const walls = 'M39 58H81V90H39Z'
    const roof = 'M31 62L60 35L89 62L85 65.4L60 42.6L35 65.4Z'
    const roofFull = 'M31 62L60 35L89 62Z'
    const chimney = 'M71 37H78V52L71 46Z'
    const door = 'M54 90V75C54 70.6 66 70.6 66 75V90Z'
    const win = (x: number) => roundRect(x, 64, x + 9, 73, 1)
    let tiles = ''
    for (let i = 1; i < 6; i++) tiles += `M${f(60 - i * 5.2)} ${f(35 + i * 4.8)}H${f(60 + i * 5.2)}`
    return (
      k.floor(61, 91, 28, 2.6) +
      hair(74.4, 34, 70, 28, 76, 22, 1, P.white) + hair(76, 24, 80, 18, 76, 12, 0.8, P.white) +
      k.draw([vol(k, chimney, P.brown, P.brownD)], 0.6) +
      k.draw([
        vol(k, walls, P.white, P.blue, k.sh('M64 56H84V92H64Z', 0, 0, 1, 0, 0, 0.7, P.blue, 0.4)),
        vol(k, roofFull, c.a, c.d, `<path d="${tiles}" stroke="${c.d}" stroke-width=".6"/>` + lit(k, 28, 50, 0.3)),
      ], 0.85) +
      k.draw([vol(k, roof, c.l, c.d)], 0.5) +
      k.draw([vol(k, door, P.brown, P.brownD, `<path d="M60 72V90" stroke="${P.brownD}" stroke-width=".5"/>`), vol(k, win(42), P.sky, P.mid), vol(k, win(69), P.sky, P.mid)], 0.55) +
      `<path d="M46.5 64V73M42 68.5H51M73.5 64V73M69 68.5H78" stroke="${P.ink}" stroke-width=".6"/>` +
      `<circle cx="63.6" cy="82" r=".9" fill="${P.gold}"/>` + glint(44.6, 66, 1.4, 0.7) + glint(71.6, 66, 1.4, 0.7)
    )
  },

  // Un camino que sube entre lomas hasta la bandera, en el color del juego.
  road: (k, c) => {
    const hills = 'M17 66C32 56 46 56 60 61C74 54 90 55 103 62V104H17Z'
    const far = 'M17 60C28 52 40 50 52 54C62 46 80 46 103 56V70H17Z'
    const road = taper(64, 52, 40, 70, 56, 100, 2.4, 30)
    const dashes = along(64, 52, 40, 70, 56, 100, [0.18, 0.36, 0.54, 0.72, 0.9]).map((q, i) => { const w = 0.4 + i * 0.35; return `<ellipse cx="${f(q.x)}" cy="${f(q.y)}" rx="${f(w)}" ry="${f(w * 2.6)}" fill="${P.white}" transform="rotate(${f((Math.atan2(q.dy, q.dx) * 180) / Math.PI - 90)} ${f(q.x)} ${f(q.y)})"/>` }).join('')
    const flag = 'M66 30L80 34.4L66 39Z'
    return (
      k.draw([vol(k, far, mix(P.green, P.sky2, 0.45), P.greenD)], 0.5) +
      k.draw([vol(k, hills, P.green, P.greenD, hair(78, 72, 86, 70, 94, 72, 0.6, P.greenD) + hair(24, 80, 30, 78, 36, 80, 0.6, P.greenD))], 0.7) +
      k.draw([vol(k, road, P.paper, P.brown, k.sh(road, 0, 0, 1, 0, 0, 0.6, P.brown, 0.3))], 0.6) +
      dashes +
      `<path d="M66 51V28" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M66 51V28" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([vol(k, flag, c.a, c.d)], 0.5) +
      k.floor(66, 52, 4, 1)
    )
  },
}

/** Glyphs que ya son dorados: sobre el sol se pierden, van con otro fondo. */
const GOLDEN = new Set<Glyph>(['crown', 'trophy', 'star', 'coin', 'bolt', 'flame'])

/** Dibujo genérico para una medalla sin ilustración propia. `u` hace únicos los ids (ver `kit`). */
export function glyphArt(glyph: Glyph, color: string, name: string, u = 0): string {
  const k = kit(u), c = accent(color), h = hash(name)
  let bg = h % 4
  if (bg === 0 && GOLDEN.has(glyph)) bg = 1 + ((h >>> 3) % 2)
  const back =
    bg === 0 ? k.day() + k.sun(60, 58, 20, 48, 28, false)
    : bg === 1 ? k.day() + k.stage(60, 60, 34)
    : bg === 2 ? k.day() + k.stage(60, 60, 34) + k.shade(ellipse(60, 60, 34, 34), k.rad(c.a, 0.5, 0.5, 0.5, 0, 0.42), c.a, 0.35)
    : k.night() + k.shade(ellipse(60, 58, 34, 34), k.rad(c.a, 0.5, 0.5, 0.5, 0.45, 0), c.a, 0.35)
  // Un par de destellos elegidos por el nombre, para que niveles distintos no se vean idénticos.
  const spots: [number, number][] = [[30, 40], [90, 40], [26, 62], [94, 62], [36, 28], [84, 28]]
  const twinkle = [0, 1].map((i) => { const [x, y] = spots[(h >>> (4 + i * 3)) % spots.length]; return sparkle(x, y, 1.4 + i * 0.6, bg === 3 ? P.goldL : P.white) }).join('')
  const art = (DRAW[glyph] ?? DRAW.star)(k, c)
  return back + twinkle + art + k.defs()
}
