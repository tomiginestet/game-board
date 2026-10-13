// Cacho: Último en pie, Calzador y Desconfiado, en clave heroica.
// Manda el marrón de la ficha del juego (#8D5524): el papel tostado del fondo y el cuero del cacho. El vaso no es el
// cubilete de la generala (cuero claro, costura dorada y guarda repujada): es el vaso del altiplano, de cuero oscuro
// y engrasado, cosido con tiento cruzado, con una faja de aguayo tejido y el fondo cosido a punto de látigo. Se juega
// boca abajo, tapando los dados, y así se lo dibuja. Los dados del cacho son de hueso.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El marrón de la ficha (#8D5524): el cuero del cacho, con su sombra y su luz. */
const CUERO = '#8D5524', CUERO_D = '#4E2A0E', CUERO_L = '#C58C57'
/** El papel tostado del fondo y su grano. */
const TOSTADO = '#E7C9A0', TOSTADO_G = '#C99A66'
/** El aguayo del altiplano: fucsia y verde, con el rojo, el dorado y la tinta de la paleta. */
const FUCSIA = '#C2346E', VERDE = '#3E9356'
/** El hueso de los dados y su sombra. */
const HUESO = '#F3E8CF', HUESO_D = '#CDB487'
/** El plomo. */
const PLOMO = '#7E869C', PLOMO_D = '#454C63'
/** El cuero crudo de la bota de potro. */
const BOTA = '#DDB585'
/** El negro tostado del lomo y la máscara del ovejero, y su gris. */
const OVE_D = '#2B1D14', OVE = '#5C4A3C'

/** Fondo del Cacho: el papel con el tostado granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(TOSTADO, 0.5, 0.46, 0.7, 0, 1), TOSTADO_G, 0.55)

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

// ── El vaso de cuero ─────────────────────────────────────────────────

/** Radio del vaso a la altura y (boca de 10.8 abajo, fondo de 8.6 arriba). */
const rAt = (y: number) => 8.6 + (2.2 * (y + 30)) / 27
/** Medio anillo de frente a la altura y: el arco que hace un aro alrededor del vaso visto desde arriba. */
const ring = (y: number, dx = 0) => {
  const r = rAt(y) + dx, ry = r * 0.27
  return { r, ry, d: `M${f(-r)} ${f(y)}C${f(-r)} ${f(y + ry * 1.33)} ${f(r)} ${f(y + ry * 1.33)} ${f(r)} ${f(y)}` }
}
/** Banda entre dos alturas, siguiendo la curva del vaso. */
const bandPath = (y0: number, y1: number, dx = 0) => {
  const a = ring(y0, dx), b = ring(y1, dx)
  return `M${f(-a.r)} ${y0}C${f(-a.r)} ${f(y0 + a.ry * 1.33)} ${f(a.r)} ${f(y0 + a.ry * 1.33)} ${f(a.r)} ${y0}L${f(b.r)} ${y1}C${f(b.r)} ${f(y1 + b.ry * 1.33)} ${f(-b.r)} ${f(y1 + b.ry * 1.33)} ${f(-b.r)} ${y1}Z`
}

/** Faja de aguayo entre y0 e y1: rayas de colores y una hilera de rombos en el medio. */
function aguayo(k: Kit, y0: number, y1: number) {
  const d = bandPath(y0, y1)
  const h = y1 - y0
  const rows: [number, number, string][] = [[0, 0.1, P.ink], [0.1, 0.24, FUCSIA], [0.24, 0.3, P.gold], [0.3, 0.38, VERDE], [0.38, 0.62, P.red], [0.62, 0.7, VERDE], [0.7, 0.76, P.gold], [0.76, 0.9, FUCSIA], [0.9, 1, P.ink]]
  const stripes = rows.map(([a, b, c]) => `<path d="${bandPath(y0 + a * h, y0 + b * h, 0.4)}" fill="${c}"/>`).join('')
  const ym = y0 + h / 2, rm = rAt(ym)
  const diamonds = Array.from({ length: 9 }, (_, i) => {
    const t = -1 + (i + 0.5) * (2 / 9), x = t * rm, sq = Math.sqrt(1 - t * t), y = ym + rm * 0.27 * sq, w = 1.05 * sq, hh = h * 0.11
    return `<path d="M${f(x - w)} ${f(y)}L${f(x)} ${f(y - hh)}L${f(x + w)} ${f(y)}L${f(x)} ${f(y + hh)}Z" fill="${i % 2 ? P.goldL : HUESO}" stroke="${P.ink}" stroke-width=".2"/>`
  }).join('')
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const t = -1 + (i + 0.5) * (2 / 13), x = t * rAt(y0 + 0.17 * h), sq = Math.sqrt(1 - t * t)
    return `<path d="M${f(x)} ${f(y0 + 0.12 * h + rAt(y0) * 0.27 * sq)}v${f(h * 0.1)}" stroke="${HUESO}" stroke-width=".35"/><path d="M${f(x)} ${f(y0 + 0.78 * h + rAt(y1) * 0.27 * sq)}v${f(h * 0.1)}" stroke="${HUESO}" stroke-width=".35"/>`
  }).join('')
  return k.clip(d, stripes + diamonds + ticks + k.sh('M2 -40H14V0H2Z', 0, 0, 1, 0, 0, 0.75, P.night, 0.35) + `<path d="M-14 -40H-5V0H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>`) +
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".45"/>`
}

/** Costura de tiento cruzada a lo largo de una línea (de (x0,y0) a (x1,y1)), puntada por puntada. */
function tiento(x0: number, y0: number, x1: number, y1: number, n: number, w = 1.6) {
  let s = ''
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, hh = ((y1 - y0) / n) * 0.42
    const a = `M${f(x - w)} ${f(y - hh)}L${f(x + w)} ${f(y + hh)}`, b = `M${f(x + w)} ${f(y - hh)}L${f(x - w)} ${f(y + hh)}`
    s += `<path d="${a}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="${a}" stroke="${HUESO}" stroke-width=".55" stroke-linecap="round"/>`
    s += `<path d="${b}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="${b}" stroke="#E2CDA3" stroke-width=".55" stroke-linecap="round"/>`
  }
  return s
}

/** El cacho boca abajo: la boca apoyada en (0,0) y el fondo arriba, en y=-30. */
const VASO = 'M-8.6 -30L-10.8 -3.2C-10.8 .6 10.8 .6 10.8 -3.2L8.6 -30Z'
const VASO_LIP = 'M-11.9 -4.8C-11.9 -1 11.9 -1 11.9 -4.8V-1.2C11.9 2.8 -11.9 2.8 -11.9 -1.2Z'
const VASO_TOP = ellipse(0, -30, 8.6, 2.4)
/** Silueta completa del vaso (para sombras proyectadas y recortes). */
const VASO_ALL = 'M-8.6 -30A8.6 2.4 0 0 1 8.6 -30L10.8 -4.4H11.9V-1.2C11.9 2.8 -11.9 2.8 -11.9 -1.2V-4.4H-10.8Z'

/** El vaso de cuero del altiplano, boca abajo, con todo su trabajo: cuero engrasado con pliegues y raspones, tiento
 * cruzado, faja de aguayo, ribete enrollado cosido a látigo y el fondo con la marca de fuego. */
function vaso(k: Kit, w = 0.7, opts: { brand?: boolean } = {}) {
  const whip = (y: number, n: number, dx: number) => {
    const r = rAt(y) + dx
    return Array.from({ length: n }, (_, i) => {
      const t = -1 + (i + 0.5) * (2 / n), x = t * r, yy = y + r * 0.27 * Math.sqrt(1 - t * t)
      return `<path d="M${f(x - 0.5)} ${f(yy - 0.9)}L${f(x + 0.5)} ${f(yy + 0.9)}" stroke="${HUESO}" stroke-width=".5" stroke-linecap="round"/>`
    }).join('')
  }
  const creases =
    hair(6.2, -27, 7.2, -22, 6.4, -18, 0.5, CUERO_D) + hair(7.4, -11, 8.4, -8, 7.8, -5.6, 0.5, CUERO_D) + hair(3, -26.6, 3.6, -24, 3.2, -21.4, 0.35, CUERO_D) +
    hair(-6.4, -26, -7, -23.4, -6.6, -21, 0.45, '#E9B98A', 0.7) + hair(-7.8, -10.6, -8.6, -8.2, -8, -6.2, 0.45, '#E9B98A', 0.7) +
    hair(1, -9, 3.4, -9.4, 5.4, -8.6, 0.35, CUERO_D) + hair(-1.4, -25.4, 0.8, -25.8, 2.6, -25, 0.3, '#E9B98A', 0.6)
  const brand = opts.brand === false ? '' :
    `<g transform="translate(0 -30) scale(1 .3)"><path d="M-3 -2.4L0 2.6L3 -2.4M-4 -.4H4" fill="none" stroke="${CUERO_D}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></g>`
  return (
    k.draw([
      {
        d: VASO, fill: CUERO,
        inner:
          k.sh('M1 -32H12V2H1Z', 0, 0, 1, 0, 0, 0.95, CUERO_D, 0.5) + `<path d="M-12 -32H-3V2H-12Z" fill="${k.lin('#F2C493', 0, 0, 1, 0, 0.55, 0)}"/>` +
          k.sh('M-12 -32H12V-24H-12Z', 0, 0, 0, 1, 0.45, 0, CUERO_D, 0.25) + creases +
          tiento(-3.4, -28.6, -3.9, -19.6, 4) + tiento(-4.3, -11.2, -4.6, -5.4, 2),
      },
    ], w) +
    aguayo(k, -19.6, -11.6) +
    k.draw([
      {
        d: VASO_LIP, fill: CUERO,
        inner: k.sh(VASO_LIP, 0, 0, 1, 0, 0, 0.9, CUERO_D, 0.45) + `<path d="M-11 -2.6C-7 -.4 -2 0 2 -.2" fill="none" stroke="#F2C493" stroke-width=".6" opacity=".7"/>` + whip(-3.6, 15, 1.1),
      },
      {
        d: VASO_TOP, fill: CUERO_L,
        inner: k.sh(VASO_TOP, 0, 0, 1, 1, 0, 0.8, CUERO, 0.45) + `<path d="${ellipse(0, -30, 7.2, 1.8)}" fill="none" stroke="${CUERO_D}" stroke-width=".35"/>` + brand,
      },
    ], w) +
    whip(-30.6, 11, -0.6)
  )
}

/** Dado de hueso en perspectiva, con la arista del frente arriba en (x,y) y lado s. `top` elige la cara de arriba. */
function dado(k: Kit, x: number, y: number, s: number, rot: number, top: 5 | 6 = 5) {
  const kk = f(s * 0.87), h = f(s / 2)
  const out = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}L${f(x - kk)} ${f(y - h)}Z`
  const right = `M${x} ${y}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}Z`
  const left = `M${f(x - kk)} ${f(y - h)}L${x} ${y}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}Z`
  const pips = (o: number[], a: number[], b: number[], pts: number[][]) =>
    `<g transform="matrix(${a[0]} ${a[1]} ${b[0]} ${b[1]} ${o[0]} ${o[1]})">${pts.map(([p, q]) => `<circle cx="${p}" cy="${q}" r=".1" fill="${P.ink}"/>`).join('')}</g>`
  const topPts = top === 6 ? [[0.25, 0.22], [0.25, 0.5], [0.25, 0.78], [0.75, 0.22], [0.75, 0.5], [0.75, 0.78]] : [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]]
  return (
    `<g transform="rotate(${rot} ${x} ${y})">` +
    k.draw([{ d: out, fill: HUESO, inner: k.sh(left, 0, 0, 0, 1, 0.2, 0.5, HUESO_D, 0.5) + k.sh(right, 0, 0, 1, 1, 0.35, 0.8, CUERO_L, 0.45) }], 0.6) +
    `<path d="M${f(x - kk)} ${f(y - h)}L${x} ${y}L${f(x + kk)} ${f(y - h)}M${x} ${y}V${f(y + s)}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
    pips([x - kk, y - h], [kk, -h], [kk, h], topPts) +
    pips([x - kk, y - h], [kk, h], [0, s], [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]]) +
    pips([x, y], [kk, -h], [0, s], [[0.3, 0.3], [0.7, 0.7]]) +
    `</g>`
  )
}

export const CACHO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Último en pie ──────────────────────────────────────────────────

  // Tres ganadas: el cacho de cuero, recién golpeado boca abajo sobre el estaño del bar, y un dado que se escapó.
  'Vaso de cuero': (u) => {
    const k = kit(u)
    const counter = 'M-2 74H122V130H-2Z'
    const cap = (x: number, y: number) => {
      let d = ''
      for (let i = 0; i < 21; i++) {
        const a = (i / 21) * Math.PI * 2, r = i % 2 ? 3.3 : 3.9
        d += (i ? 'L' : 'M') + f(x + Math.cos(a) * r) + ' ' + f(y + Math.sin(a) * r * 0.42)
      }
      return k.draw([{ d: d + 'Z', fill: P.red, inner: k.sh(d + 'Z', 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="${ellipse(x, y - 0.2, 2.4, 0.9)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.45)
    }
    return (
      fondo(k) +
      k.sun(60, 50, 17, 46, 28, false) +
      k.shade(ellipse(60, 56, 24, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.draw([{
        d: counter, fill: P.sky1,
        inner: k.sh(counter, 0, 0, 0, 1, 0, 0.75, P.blue, 0.35) + `<path d="M-2 74H122V76.2H-2Z" fill="#fff" opacity=".65"/>` +
          hair(24, 82, 32, 81.6, 40, 82, 0.5, '#fff', 0.9) + hair(80, 85, 88, 84.6, 96, 85, 0.5, '#fff', 0.9) + hair(32, 92, 40, 91.6, 46, 92, 0.4, P.blue, 0.6) +
          `<path d="${ellipse(85, 80, 6.4, 1.9)}" fill="none" stroke="${P.blue}" stroke-width=".7" opacity=".6"/><path d="${ellipse(85.5, 80.3, 5.8, 1.6)}" fill="none" stroke="#fff" stroke-width=".4" opacity=".7"/>`,
      }], 0.6) +
      cap(33, 81) +
      k.floor(61, 89.4, 19, 2.8, P.mid) +
      `<g transform="translate(59.6 88) scale(1.36)">` + k.cast([VASO_ALL], 1.4, 0.6, P.mid) + vaso(k, 0.52) + `</g>` +
      // El golpe contra el estaño y el olor a bar que sube.
      hair(40, 88, 36, 86.4, 32.4, 86.8, 0.7) + hair(41.6, 84.4, 38, 81.8, 34.6, 81, 0.6) + hair(79.2, 88, 83, 86.4, 86.6, 86.8, 0.7) + hair(77.6, 84.4, 81.2, 81.8, 84.6, 81, 0.6) +
      hair(53, 40, 50.6, 35, 53.4, 30, 0.75, CUERO_D) + hair(60, 38.6, 62.6, 33, 59.6, 27.6, 0.8, CUERO_D) + hair(67, 40, 69.4, 35, 66.6, 30, 0.75, CUERO_D) +
      dado(k, 80, 76.6, 4.4, 16) +
      sparkle(88, 40, 2.2) + sparkle(32, 56, 1.6) +
      k.defs()
    )
  },

  // Doce ganadas: el dado cortado deja ver la bala de plomo que tiene adentro. Siempre sale sena.
  'Dado cargado': (u) => {
    const k = kit(u)
    const x = 58, y = 58, s = 22, kk = s * 0.87, h = s / 2
    const at = (u0: number, v0: number) => [x + u0 * kk, y - u0 * h + v0 * s]
    const poly = (pts: number[][]) => 'M' + pts.map(([a, b]) => `${f(a)} ${f(b)}`).join('L') + 'Z'
    const win = [at(0.16, 0.18), at(0.86, 0.18), at(0.86, 0.88), at(0.16, 0.88)]
    const dep = 7.4, dv = [-0.87 * dep, -0.5 * dep]
    const back = win.map(([a, b]) => [a + dv[0], b + dv[1]])
    const floorD = poly([win[3], win[2], back[2], back[3]])
    const sideD = poly([win[0], win[3], back[3], back[0]])
    const out = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}L${f(x - kk)} ${f(y - h)}Z`
    const right = `M${x} ${y}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}Z`
    const left = `M${f(x - kk)} ${f(y - h)}L${x} ${y}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}Z`
    const top = `M${f(x - kk)} ${f(y - h)}L${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${x} ${y}Z`
    const pip = (o: number[], a: number[], b: number[], pts: number[][], r: number) =>
      `<g transform="matrix(${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(o[0])} ${f(o[1])})">${pts.map(([p, q]) => `<circle cx="${p}" cy="${q}" r="${r}" fill="${P.ink}"/>`).join('')}</g>`
    // La bala de plomo apoyada en el piso del hueco, contra el fondo.
    const bc = [(win[3][0] + win[2][0]) / 2 + dv[0] * 0.55, (win[3][1] + win[2][1]) / 2 + dv[1] * 0.55 - 5.4]
    const ball = ellipse(bc[0], bc[1], 5.4, 5.4)
    const shot = (sx: number, sy: number, r: number) => `<circle cx="${sx}" cy="${sy}" r="${r}" fill="${PLOMO}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(sx - r * 0.35)}" cy="${f(sy - r * 0.35)}" r="${f(r * 0.32)}" fill="#fff" opacity=".8"/>`
    return (
      fondo(k) +
      k.sun(60, 58, 20, 47, 28, false) +
      k.shade(ellipse(60, 58, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(61, 82.4, 25, 3.6, P.mid) +
      k.cast([out], 2.4, 2, P.mid) +
      k.draw([{
        d: out, fill: HUESO,
        inner:
          k.sh(left, 0, 0, 0, 1, 0.15, 0.5, HUESO_D, 0.5) + k.sh(right, 0, 0, 1, 1, 0.3, 0.75, CUERO_L, 0.45) + `<path d="${top}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.7, 0)}"/>` +
          // La veta del hueso.
          hair(42, 56, 44, 63, 43, 71, 0.35, HUESO_D) + hair(49, 64, 50.4, 70, 49.6, 76, 0.3, HUESO_D) + hair(46, 44, 52, 42, 58, 43, 0.3, HUESO_D) + hair(58, 72, 58.6, 76, 58.2, 79, 0.3, CUERO_L),
      }], 0.8) +
      `<path d="M${f(x - kk)} ${f(y - h)}L${x} ${y}L${f(x + kk)} ${f(y - h)}M${x} ${y}V${f(y + s)}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` +
      `<path d="M${f(x - kk + 1.4)} ${f(y - h + 0.3)}L${f(x - 0.4)} ${f(y - 0.8)}M${f(x - kk + 0.8)} ${f(y - h + 1.8)}V${f(y + h - 1)}" stroke="#fff" stroke-width=".7" opacity=".85"/>` +
      pip([x - kk, y - h], [kk, -h], [kk, h], [[0.24, 0.2], [0.24, 0.5], [0.24, 0.8], [0.76, 0.2], [0.76, 0.5], [0.76, 0.8]], 0.085) +
      pip([x - kk, y - h], [kk, h], [0, s], [[0.24, 0.24], [0.5, 0.5], [0.76, 0.76]], 0.085) +
      // El corte: la pared del costado, el piso, el fondo del hueco y la bala de plomo.
      `<path d="${poly(win)}" fill="#8A6A40"/>` +
      k.clip(poly(win),
        `<path d="${poly(back)}" fill="#A48558"/>` + `<path d="${sideD}" fill="${HUESO_D}"/>` + `<path d="${floorD}" fill="#C4A774"/>` +
        k.sh(poly(back), 0, 0, 1, 1, 0.2, 0.7, CUERO_D, 0.4) +
        hair(back[0][0] + 3, back[0][1] + 4, back[0][0] + 6, back[0][1] + 8, back[0][0] + 5, back[0][1] + 12, 0.4, CUERO_D) +
        k.floor(bc[0] + 1.2, bc[1] + 4.8, 6, 1.6, P.night) +
        k.draw([{ d: ball, fill: PLOMO, inner: k.sh(ball, 0, 0, 1, 1, 0, 0.95, PLOMO_D, 0.5) + `<ellipse cx="${f(bc[0] - 2)}" cy="${f(bc[1] - 2.2)}" rx="1.8" ry="1.1" fill="#fff" opacity=".9" transform="rotate(-35 ${f(bc[0] - 2)} ${f(bc[1] - 2.2)})"/>` }], 0.5) +
        `<text x="${f(bc[0] + 0.6)}" y="${f(bc[1] + 1.8)}" ${GEORGIA} font-weight="700" font-size="4.4" fill="${PLOMO_D}" text-anchor="middle">Pb</text>`) +
      `<path d="${poly(win)}" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linejoin="round"/>` +
      `<path d="M${f(win[0][0])} ${f(win[0][1] - 0.7)}L${f(win[1][0])} ${f(win[1][1] - 0.7)}M${f(win[3][0] - 0.6)} ${f(win[3][1])}L${f(win[0][0] - 0.6)} ${f(win[0][1])}" stroke="#fff" stroke-width=".5" opacity=".8"/>` +
      shot(38, 84, 1.7) + shot(42.6, 87, 1.4) + shot(34.8, 87.4, 1.2) + shot(84, 84.6, 1.4) +
      sparkle(36, 40, 2.4) + sparkle(87, 46, 1.8) +
      k.defs()
    )
  },

  // Treinta y cinco ganadas: el tricornio del pirata, con su parche y la pluma del loro, y los cinco dados de hueso en
  // la cubierta, sobre el Pacífico al atardecer.
  'Pirata del Pacífico': (u) => {
    const k = kit(u)
    const crown = 'M-11 -14C-11.4 -24.4 -6 -29.4 0 -29.4C6 -29.4 11.4 -24.4 11 -14Z'
    const back = 'M-28 -17C-22 -24.6 -12 -26.4 0 -24.6C12 -26.4 22 -24.6 28 -17C20 -12.4 9 -7 0 -2.4C-9 -7 -20 -12.4 -28 -17Z'
    const backLace = 'M-28 -17C-22 -24.6 -12 -26.4 0 -24.6C12 -26.4 22 -24.6 28 -17'
    const brim = 'M-28 -17C-20 -12.4 -9 -7 0 -2.4C9 -7 20 -12.4 28 -17C26 -8 15 2.4 0 8.4C-15 2.4 -26 -8 -28 -17Z'
    const wallR = 'M0 -2.4C9 -7 20 -12.4 28 -17C26 -8 15 2.4 0 8.4Z'
    const lace = 'M-28 -17C-20 -12.4 -9 -7 0 -2.4C9 -7 20 -12.4 28 -17'
    const patch = 'M-2.6 -1.6C-2.6 -4.2 2.6 -4.2 2.6 -1.6C2.6 1.6 1.2 3.2 0 3.2C-1.2 3.2 -2.6 1.6 -2.6 -1.6Z'
    const feather = 'M0 0C-3 -6 -4 -14 -1.6 -22C.2 -26 2.6 -27.6 4 -27.4C4 -22 3.6 -14 2.4 -8C1.8 -4.6 1 -2 0 0Z'
    const sea = 'M-2 62H122V76H-2Z'
    const deck = 'M-2 76H122V130H-2Z'
    const planks = [-60, -36, -12, 12, 36, 60].map((dx) => `<path d="M${60 + dx * 0.32} 76L${60 + dx * 1.6} 112" stroke="${CUERO_D}" stroke-width=".6"/>`).join('') +
      `<path d="M-2 84H122M-2 96H122" stroke="${CUERO_D}" stroke-width=".4" opacity=".6"/>`
    const coin = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${cx}" cy="${cy}" r="1.7" fill="none" stroke="${P.goldD}" stroke-width=".35"/><path d="${starPath(cx, cy, 1.2, 0.5, 5)}" fill="${P.goldD}"/>`
    return (
      fondo(k) +
      k.sun(60, 62, 12, 54, 32, false) +
      k.shade(ellipse(60, 56, 32, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      `<path d="M51 62A9 9 0 0 1 69 62Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="M54 62A6 6 0 0 1 66 62Z" fill="${P.goldL}"/>` +
      k.draw([{
        d: sea, fill: P.blue,
        inner: k.sh(sea, 0, 0, 0, 1, 0, 0.8, P.mid, 0.4) + `<path d="M-2 62H122V64H-2Z" fill="${P.sky}"/>` +
          hair(52, 65, 60, 64.6, 68, 65, 0.8, P.goldL) + hair(54, 68.4, 60, 68, 66, 68.4, 0.7, P.goldL) + hair(56, 71.6, 60, 71.4, 64, 71.6, 0.6, P.goldL) +
          hair(26, 67, 32, 66, 38, 67, 0.5, '#fff', 0.8) + hair(82, 69, 88, 68, 94, 69, 0.5, '#fff', 0.8) + hair(34, 72, 40, 71.2, 46, 72, 0.45, '#fff', 0.7),
      }], 0.5) +
      k.draw([{ d: deck, fill: CUERO_L, inner: k.sh(deck, 0, 0, 0, 1, 0, 0.8, CUERO, 0.45) + planks + `<path d="M-2 76H122V78H-2Z" fill="${CUERO_D}" opacity=".5"/>` }], 0.5) +
      `<g transform="translate(60 54) scale(.86)">` +
      k.cast([crown, back, brim], 1.2, 1.4, P.mid) +
      k.draw([{
        d: crown, fill: P.night,
        inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, '#0B1230', 0.5) + `<path d="M-14 -24H-4V-3H-14Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.95, 0)}"/>` +
          hair(-5, -24, -2, -27.6, 3, -28, 0.5, P.blue, 0.8),
      }], 0.7) +
      k.draw([{
        d: back, fill: P.night,
        inner: k.sh(back, 0, 1, 0, 0, 0, 0.8, '#0B1230', 0.5) + `<path d="M-28 -27H-6V-2H-28Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.7, 0)}"/>` +
          hair(-20, -20, -12, -22, -4, -21, 0.45, P.mid) + hair(4, -21, 12, -22, 20, -20, 0.45, '#0B1230') + hair(-14, -16, -6, -17.4, 2, -16, 0.35, P.mid, 0.8) +
          `<path d="M-18 -21.6C-10 -23.4 10 -23.4 18 -21.6" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray="1 1"/>`,
      }], 0.7) +
      k.draw([{
        d: brim, fill: P.mid,
        inner: k.sh(brim, 0, 0, 1, 1, 0, 0.6, P.night, 0.45) + `<path d="${wallR}" fill="${P.night}"/>` + k.sh(wallR, 0, 0, 1, 0, 0, 0.8, '#0B1230', 0.45) +
          `<path d="M-28 -17H0V8H-28Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.35, 0)}"/>` +
          hair(-22, -10, -14, -2, -4, 3.6, 0.45, P.night) + hair(-18, -12.4, -10, -6, -3, -2, 0.35, P.night, 0.7) + hair(20, -9, 12, -1, 3, 4, 0.45, P.mid) +
          `<path d="M0 -2.4V8.4" stroke="${P.ink}" stroke-width=".7"/>` + hair(-1, -1, -1.4, 3, -0.8, 7, 0.5, P.sky, 0.8),
      }], 0.75) +
      // El galón dorado del borde, con la trenza.
      [backLace].map((d) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="1.8"/><path d="${d}" fill="none" stroke="${P.goldD}" stroke-width="1.8" stroke-dasharray=".5 1.1"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".45" transform="translate(0 -.5)"/>`).join('') +
      `<path d="${lace}" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linejoin="round"/><path d="${lace}" fill="none" stroke="${P.gold}" stroke-width="2.2" stroke-linejoin="round"/>` +
      `<path d="${lace}" fill="none" stroke="${P.goldD}" stroke-width="2.2" stroke-dasharray=".5 1.1"/><path d="${lace}" fill="none" stroke="${P.goldL}" stroke-width=".5" transform="translate(0 -.6)"/>` +
      `<circle cx="-28" cy="-17" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="28" cy="-17" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="0" cy="8.4" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      // La pluma del loro: roja, con la punta azul y verde, tendida sobre el ala de atrás.
      `<g transform="translate(10 -26.4) rotate(-100) scale(1.1)">` + k.draw([{ d: feather, fill: P.red, inner: `<path d="M-4 -30H6V-19H-4Z" fill="${P.sky}"/><path d="M-4 -19H6V-15H-4Z" fill="${VERDE}"/>` + k.sh(feather, 0, 0, 1, 0, 0, 0.9, P.wine, 0.4) }], 0.45) +
      hair(0, 0, 1, -12, 2.6, -26, 0.5, P.goldL) + Array.from({ length: 7 }, (_, i) => hair(1 + i * 0.2, -4 - i * 3, -1 - i * 0.1, -6 - i * 3, -2.4 - i * 0.1, -6.4 - i * 3, 0.3, P.wine)).join('') + `</g>` +
      // La escarapela con un doblón, en el ala izquierda.
      `<g transform="translate(-13 -3.4)">` + `<circle r="4" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/>` + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${f(Math.cos(a) * 1.8)} ${f(Math.sin(a) * 1.8)}L${f(Math.cos(a) * 3.8)} ${f(Math.sin(a) * 3.8)}" stroke="${P.wine}" stroke-width=".4"/>` }).join('') + coin(0, 0) + `</g>` +
      // El parche, colgado de la punta derecha por su cordón.
      `<path d="M28 -17C27 -10 24.6 -3 22.4 1.4" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      `<g transform="translate(22 4.2) rotate(14)">` + k.draw([{ d: patch, fill: P.ink, inner: `<path d="M-2 -2.4C-1 -3.2 1 -3.2 1.8 -2.4" fill="none" stroke="${P.mid}" stroke-width=".5"/>` }], 0.35) + `</g>` +
      `</g>` +
      k.floor(60, 89.4, 26, 2.4, CUERO_D) +
      dado(k, 36, 82.4, 4.2, -14) + dado(k, 48, 86.2, 4.4, 8) + dado(k, 60, 87.4, 4.6, -4) + dado(k, 72, 86.2, 4.4, 12) + dado(k, 84, 82.4, 4.2, -10) +
      sparkle(31, 34, 2.4) + sparkle(90, 40, 1.8) + sparkle(86, 24, 1.3) +
      k.defs()
    )
  },

  // ── Calzador ───────────────────────────────────────────────────────

  // Tres calzadas: la ojota con la tira de aguayo, y el dado calzado justo debajo de las tiras.
  'Ojota': (u) => {
    const k = kit(u)
    const sole = 'M0 -28C8 -28 12.6 -22 12.4 -14C12.2 -6 9 -1 7.6 5C6.6 9.6 8.6 15 8.6 20C8.6 25.6 4.6 29 0 29C-4.6 29 -8.4 25.6 -8.4 20C-8.4 14 -7 9.6 -7.6 4C-8.2 -2 -11.6 -8 -11.4 -15C-11.2 -23 -7 -28 0 -28Z'
    const heel = ellipse(0, 19.4, 5.4, 6.6), ball = ellipse(0.4, -10, 8, 8.6)
    const toes = [[-4.2, -22.8, 2.4], [0.6, -24.4, 1.6], [4, -23.6, 1.4], [6.8, -21.6, 1.2], [8.8, -18.6, 1.1]]
    const strapL = 'M-2.6 -17.6C-6.4 -12 -9.4 -5 -10.4 1', strapR = 'M-2.6 -17.6C2 -12 6.4 -5.6 9 .8'
    const strap = (d: string) =>
      `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="5.2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${FUCSIA}" stroke-width="3.8" stroke-linecap="round"/>` +
      `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width="1.7" stroke-dasharray="1.1 .9"/><path d="${d}" fill="none" stroke="${VERDE}" stroke-width=".55"/>` +
      `<path d="${d}" fill="none" stroke="#fff" stroke-width=".5" opacity=".5" transform="translate(-1 -.6)"/>`
    const R = 'translate(60 60) rotate(-24) scale(.98)'
    return (
      fondo(k) +
      k.sun(60, 58, 16, 46, 28, false) +
      k.shade(ellipse(60, 58, 26, 30), k.rad('#FFFFFF', 0.5, 0.5, 0.5, 0.75, 0), '#FFFFFF', 0.5) +
      `<g transform="${R}">` +
      k.cast([sole], 3, 2.4, P.mid) +
      `<g transform="translate(1.1 1.7)">` + k.draw([{ d: sole, fill: CUERO, inner: k.sh(sole, 0, 0, 1, 0, 0, 0.8, CUERO_D, 0.5) + `<path d="${sole}" fill="none" stroke="${CUERO_D}" stroke-width="2" stroke-dasharray=".4 .9" transform="scale(.97)"/>` }], 0.75) + `</g>` +
      k.draw([{
        d: sole, fill: P.sky,
        inner:
          k.sh(sole, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M-14 -30H-3V30H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
          `<path d="${heel}" fill="${P.blue}" opacity=".55"/><path d="${ball}" fill="${P.blue}" opacity=".45"/>` +
          toes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.blue}" opacity=".6"/>`).join('') +
          `<path d="M-6.6 -2C-6 4 -6.4 10 -4.6 14" fill="none" stroke="${P.blue}" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>` +
          Array.from({ length: 10 }, (_, i) => `<path d="M-14 ${-26 + i * 6}l28 -6" stroke="${P.mid}" stroke-width=".3" opacity=".45"/>`).join('') +
          `<path d="${sole}" fill="none" stroke="#fff" stroke-width=".9" opacity=".85" transform="translate(-.3 -.3) scale(.93)"/>`,
      }], 0.6) +
      `</g>` +
      `<g transform="${R}">` + dado(k, -0.6, -6, 5.6, 6) + `</g>` +
      `<g transform="${R}">` +
      strap(strapL) + strap(strapR) +
      `<circle cx="-2.6" cy="-17.6" r="2.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-3.1" cy="-18.1" r=".6" fill="${P.goldL}"/>` +
      `</g>` +
      sparkle(86, 36, 2.2) + sparkle(34, 80, 1.6) +
      k.defs()
    )
  },

  // Doce calzadas: el mocasín de charol, brillante y de punta, con un dado en la ranura de la tira en lugar de la moneda.
  'Mocasín de charol': (u) => {
    const k = kit(u)
    const upper = 'M29.4 78.4C28.4 72 29.4 64.4 31.4 60.4C33 59.4 38 60 44 60.8C50 61.4 54.4 60 57 56.6C63 55 70 56.6 77 60.4C83 63.6 89.6 69 94.6 74C95.6 75.2 95 76.8 93.4 77.2C82 79.6 60 80.4 44 80.2C36 80.2 31 79.8 29.4 78.4Z'
    const opening = 'M33 61.2C33.6 58.6 38 58 44 58.6C50 59.2 53.8 58.2 56.2 56.6C55.2 60 50.6 62 44 62C38 62 34 62.2 33 61.2Z'
    const sole = 'M28.8 78.8C34 81.2 70 81.2 94.6 76.6L95 78.4C70 83.2 34 83.4 29.2 81.2Z'
    const heelB = 'M30 81H43.4L43 87.2H31Z'
    const strap = 'M54.8 57.2C58 55.6 62 55.2 65 56.2L62.6 70.4C59.6 69.6 56.6 69.8 53.6 70.6Z'
    const lip = 'M54.6 57.6C57.6 55.6 61.8 55 65.2 56.4L64.8 59.2C61.8 58 58.2 58.2 55 60Z'
    return (
      fondo(k) +
      k.sun(60, 60, 16, 46, 28, false) +
      k.shade(ellipse(62, 66, 30, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<g transform="translate(62 68) scale(.95) translate(-62 -68)">` +
      k.floor(62, 87.4, 32, 3.2, P.mid) +
      k.cast([upper], 2, 2, P.mid) +
      k.draw([
        { d: heelB, fill: CUERO, inner: k.sh(heelB, 0, 0, 1, 0, 0, 0.8, CUERO_D, 0.45) + [82.8, 84.4, 86].map((yy) => `<path d="M30 ${yy}H44" stroke="${CUERO_D}" stroke-width=".35"/>`).join('') },
        { d: sole, fill: CUERO_L, inner: k.sh(sole, 0, 0, 0, 1, 0, 0.8, CUERO, 0.45) + `<path d="M31 80.4C40 81.8 70 81.6 93 77.6" fill="none" stroke="${CUERO_D}" stroke-width=".4" stroke-dasharray="1 .7"/>` },
        {
          d: upper, fill: P.night,
          inner:
            k.sh(upper, 0, 0, 0, 1, 0.1, 0.95, '#070C22', 0.5) + `<path d="${upper}" fill="${k.lin(P.mid, 0, 0, 0, 1, 0.8, 0)}"/>` +
            // El reflejo del cielo en el charol y los brillos largos.
            `<path d="M36 72.4C46 74.4 66 74.8 88 74.4" fill="none" stroke="${P.sky}" stroke-width="1.8" stroke-linecap="round" opacity=".5"/>` +
            hair(66, 57.8, 80, 62, 92, 72, 1.4, '#fff') + hair(31.4, 64, 31, 70, 32, 76, 1, '#fff', 0.9) + hair(38, 63.4, 45, 64.2, 52, 63.2, 0.7, '#fff', 0.8) +
            hair(78, 66.6, 85, 69.4, 91, 74, 0.6, P.sky, 0.9) + hair(44, 76.2, 56, 77.6, 70, 77.2, 0.6, P.sky, 0.6) +
            // El delantero cosido del mocasín, en relieve.
            `<path d="M58 61.4C66 61 76 64.6 86.4 72.6" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M58 61.4C66 61 76 64.6 86.4 72.6" fill="none" stroke="${P.mid}" stroke-width=".9"/>` +
            `<path d="M58 61.4C66 61 76 64.6 86.4 72.6" fill="none" stroke="${P.sky}" stroke-width=".4" stroke-dasharray=".8 .7" transform="translate(0 -.3)"/>` +
            `<path d="M47.6 64.4C46 68 46 74 47 79.4" fill="none" stroke="${P.ink}" stroke-width=".6"/>`,
        },
        { d: opening, fill: P.wine, inner: k.sh(opening, 0, 0, 0, 1, 0.8, 0.1, '#2A0A14', 0.45) + `<path d="M36 61.4C42 60.8 50 60.4 55 58.6" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>` },
        {
          d: strap, fill: P.mid, line: 0.35,
          inner: k.sh(strap, 0, 0, 1, 0, 0, 0.9, P.night, 0.45) + hair(56, 60, 55.6, 64, 55, 69, 0.6, '#fff', 0.7) +
            `<path d="M56.2 58.8L55 69.6M63.4 57.4L61.4 69.6" fill="none" stroke="${P.sky}" stroke-width=".35" stroke-dasharray=".7 .6"/>`,
        },
      ], 0.75) +
      dado(k, 59.8, 54.2, 4.4, 6) +
      k.draw([{ d: lip, fill: P.mid, inner: k.sh(lip, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) + hair(56, 57.6, 60, 56, 64.4, 57, 0.6, '#fff', 0.9) }], 0.45) +
      `</g>` +
      sparkle(84, 64, 2.6, '#fff') + sparkle(38, 62, 1.6, '#fff') + sparkle(33, 40, 2) + sparkle(88, 40, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco calzadas: la bota de potro del gaucho, con los dedos afuera y la espuela nazarena, al sol de Mayo.
  'Bota de potro': (u) => {
    const k = kit(u)
    const boot =
      'M49.4 33C48.6 40 48 47 49.4 54C50.4 60 50 64 48 69C45.6 74 44.6 80 46 85C47.4 88.6 51 89.4 56 89.4H79.6' +
      'C83.6 89.4 85.6 87 84 84.4C80 80.6 74.4 79.6 71.6 75C69.8 71 70 66 70.6 60C71.6 52 72.8 42 72.6 33Z'
    // El borde de arriba doblado para afuera: el revés del cuero, más claro, con el canto crudo y desparejo.
    let rag = 'M47.6 28.6C54 30.6 68 30.6 74.4 28.6L74.2 34'
    for (let i = 0; i < 9; i++) { const x = 74.2 - (i + 1) * 2.9; rag += `L${f(x + 1.45)} ${f(35.6 + (i % 3) * 0.5)}L${f(x)} ${f(34 + (i % 2) * 0.6)}` }
    rag += 'L47.8 34Z'
    const cuff = rag
    const top = ellipse(61, 28.6, 13.4, 3.2)
    const hole = ellipse(61, 28.8, 10.8, 2.2)
    // Las manchas del potro overo: el pelo más oscuro, con el borde peludo.
    const patch = (d: string) => `<path d="${d}" fill="${CUERO}" opacity=".35"/>` + k.shade(d, k.rad(CUERO, 0.5, 0.5, 0.5, 0.9, 0.2), CUERO, 0.3)
    const garter = 'M49.2 38.4C55.8 40.8 66 40.8 72.6 38.4V43C66 45.4 55.8 45.4 49.2 43Z'
    const toe = (x: number, y: number, rx: number, ry: number) => {
      const d = ellipse(x, y, rx, ry)
      return k.draw([{ d, fill: P.skin, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.brown, 0.35) + `<path d="M${f(x + rx * 0.1)} ${f(y - ry * 0.7)}C${f(x + rx * 0.7)} ${f(y - ry * 0.6)} ${f(x + rx * 0.9)} ${f(y)} ${f(x + rx * 0.6)} ${f(y + ry * 0.4)}" fill="none" stroke="${P.brown}" stroke-width=".35"/>` }], 0.4)
    }
    // El pelo del potro: trazos cortos, en vetas que bajan por la caña.
    const furs = Array.from({ length: 44 }, (_, i) => {
      const col = i % 4, row = Math.floor(i / 4), xx = 51.4 + col * 4.8 + (row % 2) * 2, yy = 44 + row * 3.6
      return hair(xx, yy, xx + 1, yy + 1.2, xx + 0.6, yy + 2.8, 0.42, CUERO, 0.55)
    }).join('')
    const rowel = (cx: number, cy: number, R: number) => {
      const d = starPath(cx, cy, R, R * 0.26, 14, -90)
      return k.draw([{ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.45) +
        `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.34)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${cx}" cy="${cy}" r="${f(R * 0.22)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/><circle cx="${cx}" cy="${cy}" r="${f(R * 0.1)}" fill="${P.goldD}"/>` +
        `<circle cx="${f(cx - R * 0.12)}" cy="${f(cy - R * 0.14)}" r="${f(R * 0.07)}" fill="#fff"/>`
    }
    return (
      fondo(k) +
      k.sun(60, 54, 17, 47) +
      k.shade(ellipse(62, 58, 26, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<g transform="translate(62 60) scale(.92) translate(-62 -60)">` +
      k.floor(66, 90, 22, 2.8, P.mid) +
      k.cast([boot], 2.4, 2.2, P.mid) +
      // Los dedos que asoman por la punta abierta de la bota.
      toe(85.6, 87.2, 2.6, 1.9) + toe(85.4, 84.2, 2.2, 1.6) + toe(84.4, 81.6, 1.8, 1.3) +
      k.draw([{
        d: boot, fill: BOTA,
        inner:
          k.sh('M62 26C66 40 66 60 72 78L86 92H90V26Z', 0, 0, 1, 0, 0, 0.75, CUERO, 0.45) + `<path d="M44 26H56V92H44Z" fill="${k.lin('#FFF4E0', 0, 0, 1, 0, 0.7, 0)}"/>` +
          k.sh('M40 82H90V92H40Z', 0, 0, 0, 1, 0, 0.6, CUERO, 0.35) + furs +
          // Las manchas del potro, el garrón y los pliegues del tobillo.
          patch('M58 46C62 43.6 68 45 69.4 49.6C70.4 53.4 66.4 56.6 62.4 55.4C59.6 54.6 60.6 52 57.6 51C55.4 50 55.6 47.4 58 46Z') +
          patch('M64.6 82.6C68 80.6 74 81.4 76.4 84C77.4 86.6 73 88.4 68 87.6C64.6 87 62.6 84.6 64.6 82.6Z') +
          [58, 62.6, 67.2, 71.6].map((yy, i) => {
            const x0 = 49.6 - i * 0.6, x1 = 70.6 - i * 0.1
            const fold = `M${x0} ${yy}C${x0 + 6} ${f(yy + 2.6)} ${x1 - 7} ${f(yy + 2.6)} ${x1} ${yy}L${x1} ${f(yy + 2.6)}C${x1 - 7} ${f(yy + 5)} ${x0 + 6} ${f(yy + 5)} ${x0} ${f(yy + 2.6)}Z`
            return k.sh(fold, 0, 0, 0, 1, 0.75, 0, CUERO, 0.4) + hair(x0, yy, (x0 + x1) / 2, yy + 3.4, x1, yy, 0.7, CUERO_D) + hair(x0 + 2, yy - 0.9, (x0 + x1) / 2, yy + 2, x1 - 3, yy - 0.9, 0.45, '#FFF4E0', 0.8)
          }).join('') +
          hair(50.4, 60.6, 47, 68, 47.4, 76, 0.7, CUERO_D) + hair(64, 79.4, 70, 81.4, 77, 80.8, 0.55, CUERO_D) + hair(57, 85.8, 66, 86.6, 76, 86, 0.45, CUERO_D) + hair(54, 78, 58, 80, 63, 80.4, 0.45, CUERO_D) +
          hair(66, 46, 66.6, 52, 65.6, 57, 0.45, CUERO, 0.8),
      }], 0.8) +
      // La boca de la bota, con el hueco oscuro, y el borde doblado para afuera.
      k.draw([
        { d: cuff, fill: '#EBD3AE', inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, CUERO_L, 0.45) + hair(50, 31.4, 56, 32.6, 62, 32.6, 0.45, CUERO, 0.8) + hair(64, 32.4, 68, 32.4, 72, 31.4, 0.4, CUERO, 0.8) + `<path d="M48 29.6C54 31.6 68 31.6 74 29.6" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>` },
        { d: top, fill: '#EBD3AE', inner: `<path d="${hole}" fill="${CUERO_D}"/>` + k.sh(hole, 0, 0, 0, 1, 0.8, 0, '#000000', 0.35) + `<path d="M50.6 27.6C53 26.4 57 25.8 61 25.8" fill="none" stroke="#fff" stroke-width=".5" opacity=".7"/>` },
      ], 0.55) +
      // La liga tejida que la ata debajo de la rodilla, con las borlas.
      k.draw([{
        d: garter, fill: P.red,
        inner: k.sh(garter, 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) +
          `<path d="M49.2 39.3C55.8 41.7 66 41.7 72.6 39.3M49.2 42.1C55.8 44.5 66 44.5 72.6 42.1" fill="none" stroke="${P.gold}" stroke-width=".45"/>` +
          // La guarda pampa: escalones blancos y negros tejidos en la liga.
          Array.from({ length: 8 }, (_, i) => {
            const x = 51.6 + i * 2.7, y = 40.7 + 1.6 * (1 - ((x - 61) / 11.4) ** 2)
            return `<path d="M${f(x - 1)} ${f(y)}L${f(x)} ${f(y - 1)}L${f(x + 1)} ${f(y)}L${f(x)} ${f(y + 1)}Z" fill="${i % 2 ? HUESO : P.ink}"/>`
          }).join(''),
      }], 0.55) +
      rod('M72 42C74.6 44.4 75.4 48 75 51.4', P.red, 1) + rod('M72 42C76.4 43.4 78.6 46.4 79.2 49.6', P.red, 1) +
      `<path d="M73.6 50.8L76.4 51L76.2 55.6H73.8ZM77.8 49L80.6 49.2L80.6 53.8H78.2Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><path d="M74.4 51.8V55.4M75.4 51.8V55.4M78.6 50V53.6M79.6 50V53.6" stroke="${P.wine}" stroke-width=".3"/>` +
      // La espuela nazarena: el arco de plata en el talón, la correa, el pihuelo largo y la rodaja de púas.
      rod('M70.4 74.6C67 78 65 81 64.6 83', CUERO_D, 1.4) +
      rod('M47.4 78.4C53 80.6 60 82.2 64.6 83', P.sky1, 1.6, '#fff') +
      rod('M47.6 79L38.6 82.2', P.sky1, 2.1, '#fff') +
      `<circle cx="47.6" cy="79" r="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="64.6" cy="83" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      rowel(34.6, 83.6, 8.6) +
      `</g>` +
      sparkle(32, 40, 2.4) + sparkle(88, 44, 1.8) + sparkle(86, 64, 1.4) +
      k.defs()
    )
  },

  // ── Desconfiado ────────────────────────────────────────────────────

  // Cinco dudas: el sabueso de orejas largas baja la nariz y huele la mentira por debajo del vaso.
  'Nariz de sabueso': (u) => {
    const k = kit(u)
    const counter = 'M-2 80H122V130H-2Z'
    // La cabeza del sabueso de perfil, mirando a la derecha, con el cuello que sale del cuadro por la izquierda.
    const head =
      'M-16 -12C-10 -18 2 -19.4 8 -15.4C14 -11.6 20 -9.2 25 -7.4C27.6 -6.4 28.8 -4.4 28.6 -1.6C28.4 1.2 27.6 3 26.4 3.8' +
      'C27.4 7 27 11 24.4 13.6C21 16.4 15 16 11 14.4C8 17 3 19.4 -3 20C-12 21 -24 22 -34 22V-6C-26 -8 -20 -10 -16 -12Z'
    const nose = 'M24 -7C26.8 -7.8 29.8 -6 29.8 -2.8C29.8 0 28 2.2 25.6 2.4C23.2 2.6 21.8 .4 21.8 -2.2C21.8 -4.6 22.4 -6.4 24 -7Z'
    const ear = 'M0 0C4.4 -1.4 7.6 1.6 8 6.6C8.6 15 7.6 25 5 32C3.2 36 -1.4 36.4 -3 32.8C-5 26 -5.4 15 -4.8 8C-4.4 3.4 -3 .6 0 0Z'
    const brow = [[0, -14.2, 5, -16, 10, -13.4], [-1, -11.4, 4.6, -13, 9.4, -10.6], [12, -10.4, 15, -9, 17, -6.6]]
    const cheek = [[13, -4, 15.6, 2, 14.4, 9], [17.6, -5, 20.6, 1, 19.6, 8], [8.6, -2, 10, 5, 8.6, 12]]
    const rot = 'translate(35 64.6) rotate(32) scale(1.12)'
    return (
      fondo(k) +
      k.sun(66, 48, 16, 46, 28, false) +
      k.shade(ellipse(66, 52, 22, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.draw([{ d: counter, fill: P.sky1, inner: k.sh(counter, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M-2 80H122V82H-2Z" fill="#fff" opacity=".6"/>` + hair(66, 92, 76, 91.4, 86, 92, 0.5, '#fff', 0.9) }], 0.6) +
      k.floor(79, 88.6, 14, 2.2, P.mid) +
      // El vaso levantado de un lado: por la rendija se ve un dado y sale el olor de la mentira.
      `<path d="M67.6 88.4L69 84.2L75 88.4Z" fill="${P.night}"/>` + dado(k, 71, 85.4, 2.2, -8) +
      `<g transform="translate(80 88) rotate(9 11.9 0)">` + vaso(k, 0.6) + `</g>` +
      hair(66.4, 84.6, 64.4, 81, 65.2, 77.6, 0.7, VERDE) + hair(69, 83.4, 68, 80, 69.2, 76.6, 0.6, VERDE, 0.85) +
      `<g transform="${rot}">` +
      k.draw([{
        d: head, fill: CUERO_L,
        inner:
          k.sh(head, 0, 0, 0, 1, 0.1, 0.95, CUERO, 0.5) + `<path d="M-34 -22H20V-8C8 -14 -10 -12 -34 -2Z" fill="${k.lin('#F7D7AE', 0, 0, 0, 1, 0.75, 0)}"/>` +
          brow.map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.6, CUERO_D)).join('') + cheek.map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.55, CUERO_D)).join('') +
          // Los belfos caídos y la papada.
          hair(26, 3.4, 20, 8, 12, 14, 0.75, CUERO_D) + hair(10, 14.4, 4, 16, -4, 17, 0.55, CUERO_D) + hair(-2, 12, -8, 15, -16, 17, 0.5, CUERO, 0.8) +
          [[20, 1], [22.4, 3.4], [18, 4.4], [21, 6], [16.6, 7]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".45" fill="${CUERO_D}"/>`).join('') +
          // El ojo caído, de perro de verdad, bajo los pliegues de la frente.
          `<path d="M4.6 -8C6.2 -9.4 9.2 -9.4 10.6 -7.8C9 -6.8 6.2 -6.6 4.6 -8Z" fill="${CUERO_D}"/><circle cx="7.8" cy="-8" r=".7" fill="#120C08"/>` +
          hair(4, -9.6, 7.6, -11, 11.2, -8.6, 0.55, CUERO_D) + hair(4.6, -6.6, 7.8, -4.8, 11, -6.4, 0.45, CUERO_D),
      }], 0.8) +
      k.draw([{
        d: nose, fill: P.night,
        inner: k.sh(nose, 0, 0, 1, 1, 0, 0.8, '#000000', 0.4) + `<path d="M27 -1C28.4 -1.6 29.8 -.6 29.6 .8C28.6 1.6 27.2 1.2 27 -1Z" fill="#000"/>` +
          `<path d="M23.2 -5.2C24.4 -6.4 26.4 -6.6 27.8 -5.8" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".85"/>`,
      }], 0.5) +
      // La oreja larga cae a plomo, aunque la cabeza esté inclinada.
      `<g transform="translate(-6 -10) rotate(-32)">` +
      k.draw([{
        d: ear, fill: CUERO,
        inner: k.sh(ear, 0, 0, 1, 0, 0, 0.9, CUERO_D, 0.5) + `<path d="M-7 -2H0V38H-7Z" fill="${k.lin('#F2C493', 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(2, 4, 4.6, 18, 2.4, 32, 0.6, CUERO_D) + hair(6, 6, 7, 16, 5.4, 26, 0.45, CUERO_D) + hair(-2.4, 6, -3.4, 18, -1.6, 30, 0.45, '#F2C493', 0.7),
      }], 0.7) +
      `</g>` +
      `</g>` +
      // Los dos soplidos de la nariz que olfatea.
      hair(67.6, 74.6, 70.6, 76.4, 72.4, 79.6, 0.55, P.ink) + hair(69.6, 71.4, 73, 72.4, 75.4, 75, 0.5, P.ink) +
      sparkle(88, 34, 2.2) + sparkle(36, 34, 1.6) +
      k.defs()
    )
  },

  // Veinte dudas: el ovejero de la policía olfatea el cacho que llegó en el equipaje.
  'Perro policía': (u) => {
    const k = kit(u)
    const head =
      'M-30 -2.6C-30 -5.6 -28.4 -7.2 -26 -7.6C-20 -8.6 -14 -10 -8.4 -11.8C-5.4 -12.8 -3 -15.6 .4 -17.8C2.6 -19 4.4 -19.6 5.6 -19.6L11.6 -36L14.4 -35C17.4 -29 19.6 -23 20.4 -17.4' +
      'C23.6 -15.4 26.6 -11 28.6 -5C31 2 32 12 32 26H4.4C3.4 20 .4 15 -3.6 12C-9.6 10 -15.6 9 -20.6 7.4C-23.6 6.4 -25.4 4.6 -26.2 2.6C-28.6 2.2 -30 .2 -30 -2.6Z'
    const earF = 'M5.6 -19.6L11.6 -36L14.4 -35C17.4 -29 19.6 -23 20.4 -17.4C15.4 -16.4 9.6 -17 5.6 -19.6Z'
    const earB = 'M1 -17.6L3.6 -33.6L6.4 -32.6C8 -27.6 8.6 -22.6 8.2 -18.4Z'
    const mask = 'M-30 -2.6C-30 -5.6 -28.4 -7.2 -26 -7.6C-20 -8.6 -14 -10 -8.4 -11.8C-5.4 -12.8 -3 -15.6 .4 -17.8C3 -15 4.4 -11 2.6 -7.4C0 -4 -4.6 -3.6 -9 -3.4C-15 -2.6 -20.6 -.4 -26.2 2.6C-28.6 2.2 -30 .2 -30 -2.6Z'
    const saddle = 'M20.4 -17.4C23.6 -15.4 26.6 -11 28.6 -5C31 2 32 12 32 26H25C24 14 21 4 15 -4C12 -8 12 -13 14 -16.6Z'
    const throat = 'M-22 7C-14 6 -8 6 -4 12C0 15 3 20 4.4 26H-4C-6 16 -14 10 -22 7Z'
    const collar = 'M3.8 12.6C12 10.6 22 9.8 31 10.8L31.6 17C22.4 16 12.4 17.2 5 19.2Z'
    const badge = 'M0 0L4.4 1.4V5.8C4.4 8.6 2.4 10.2 0 11.2C-2.4 10.2 -4.4 8.6 -4.4 5.8V1.4Z'
    const fur = Array.from({ length: 8 }, (_, i) => hair(6 + i * 2.6, 0 + (i % 3) * 2, 7 + i * 2.6, 4 + (i % 3) * 2, 6.4 + i * 2.6, 8 + (i % 3) * 2, 0.45, CUERO, 0.7)).join('')
    const tag = 'M0 0H7.4L9.6 2.4L7.4 4.8H0Z'
    return (
      fondo(k) +
      k.sun(62, 54, 18, 46, 28, false) +
      k.shade(ellipse(64, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(51, 89.8, 13, 2, P.mid) +
      `<g transform="translate(50 88) scale(.92)">` + vaso(k, 0.62) + `</g>` +
      // La etiqueta del equipaje, atada al vaso con un hilo rojo.
      `<path d="M58.6 76C60 78 61.4 80.4 62.4 82.6" fill="none" stroke="${P.red}" stroke-width=".7"/>` +
      `<g transform="translate(61.6 82.4) rotate(34)">` + k.draw([{ d: tag, fill: HUESO, inner: `<path d="M1 1.4H6M1 2.6H5.4M1 3.8H4.4" stroke="${P.blue}" stroke-width=".4"/><circle cx="7.6" cy="2.4" r=".6" fill="${CUERO_D}"/>` }], 0.4) + `</g>` +
      hair(45.4, 57.6, 44, 54, 45.6, 50.6, 0.55, P.mid) + hair(50.4, 57, 51, 53.6, 50, 50.4, 0.5, P.mid) +
      `<g transform="translate(73 62.6) scale(.8)">` +
      k.draw([{ d: earB, fill: OVE_D, inner: `<path d="M2.6 -18.6L4.2 -29L6.6 -19Z" fill="${P.brown}"/>` }], 0.75) +
      k.draw([{
        d: head, fill: P.gold,
        inner:
          `<path d="${throat}" fill="${P.goldL}"/>` + `<path d="${saddle}" fill="${OVE_D}"/>` + `<path d="${mask}" fill="${OVE_D}"/>` +
          `<path d="M-30 -8H-8V2H-30Z" fill="${k.lin(OVE, 0, 0, 0, 1, 0, 0.6)}"/>` +
          k.sh(head, 0, 0, 1, 0, 0, 0.7, CUERO, 0.4) + `<path d="M-30 -20H-6V0H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` + fur +
          hair(-24, -6.6, -17, -8.6, -10, -9.6, 0.5, '#8B7A6A', 0.8) + hair(-2, -11, 2.6, -13, 7, -12, 0.45, P.goldL, 0.8) +
          hair(-14, 3, -6, 2, 2, -2, 0.5, P.goldD, 0.8) + hair(-6, 7, 0, 6, 6, 2, 0.45, P.goldD, 0.7),
      }], 0.75) +
      k.draw([{
        d: earF, fill: OVE_D,
        inner: `<path d="M8 -19.4L12.2 -32L17.6 -18.2Z" fill="${P.brown}"/>` + k.sh('M8 -36H20V-17H8Z', 0, 0, 1, 0, 0.2, 0.9, CUERO_D, 0.4) +
          hair(10, -21, 12.4, -26, 13, -31, 0.4, P.goldL, 0.8) + hair(13.4, -20, 15, -24, 15.4, -28, 0.35, P.goldL, 0.7),
      }], 0.6) +
      // La trufa, la boca y el ojo de perro de verdad, con la ceja clara del ovejero.
      `<path d="M-30.6 -4C-30.8 -6.6 -28.8 -8.2 -26.2 -7.8C-24.6 -7.4 -24.2 -5 -25.2 -3.2C-26.6 -1.4 -30.2 -1.6 -30.6 -4Z" fill="#120C08"/><path d="M-29.4 -6.2C-28.6 -7 -27.2 -7 -26.6 -6.4" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="M-28 2.6C-24 3.6 -18 4.2 -12.6 3.2" fill="none" stroke="#120C08" stroke-width="1" stroke-linecap="round"/>` +
      `<ellipse cx="-4.6" cy="-11.4" rx="2.2" ry="1" fill="${P.goldL}" transform="rotate(-18 -4.6 -11.4)"/>` +
      `<path d="M-8.4 -8.4C-7.2 -10.2 -4 -10.4 -2.4 -9C-3.8 -7 -6.6 -6.6 -8.4 -8.4Z" fill="${CUERO_D}" stroke="#120C08" stroke-width=".55"/><circle cx="-5.2" cy="-8.8" r=".9" fill="#000"/><circle cx="-5.6" cy="-9.2" r=".35" fill="#fff"/>` +
      k.draw([{ d: collar, fill: P.mid, inner: k.sh(collar, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) + [9, 15, 21, 27].map((x) => `<circle cx="${x}" cy="${f(14.4 - (x - 4) * 0.04)}" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('') }], 0.55) +
      `<g transform="translate(7 17.6)">` + k.draw([{ d: badge, fill: P.gold, inner: k.sh(badge, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${starPath(0, 5.6, 2.3, 0.95, 5)}" fill="${P.goldD}"/>` }], 0.45) + `<circle cx="0" cy="0" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      `</g>` +
      sparkle(32, 40, 2.2) + sparkle(36, 74, 1.4) +
      k.defs()
    )
  },

  // Sesenta dudas: la placa de comisario de pueblo, con el cacho en relieve. En tu mesa nadie miente dos veces.
  'Comisario de pueblo': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, R = 28, r0 = 15.6
    const star = starPath(cx, cy, R, r0, 6)
    const tips = Array.from({ length: 6 }, (_, i) => { const a = ((-90 + i * 60) * Math.PI) / 180; return [cx + Math.cos(a) * (R + 1.1), cy + Math.sin(a) * (R + 1.1)] })
    // Cada punta en dos caras: la que mira a la luz más clara, con el guilloché fino de la chapa.
    const facets = Array.from({ length: 6 }, (_, i) => {
      const a = ((-90 + i * 60) * Math.PI) / 180, b = a + Math.PI / 6, c = a - Math.PI / 6
      const T = [cx + Math.cos(a) * R, cy + Math.sin(a) * R], Vb = [cx + Math.cos(b) * r0, cy + Math.sin(b) * r0], Vc = [cx + Math.cos(c) * r0, cy + Math.sin(c) * r0]
      const lit = Math.cos(a + Math.PI * 0.75)
      const guil = Array.from({ length: 5 }, (_, j) => {
        const t = 0.45 + j * 0.1, px = cx + Math.cos(a) * R * t, py = cy + Math.sin(a) * R * t, w = (1 - t) * 6.6
        return `<path d="M${f(px - Math.sin(a) * w)} ${f(py + Math.cos(a) * w)}L${f(px + Math.sin(a) * w)} ${f(py - Math.cos(a) * w)}" stroke="${P.goldD}" stroke-width=".3" opacity=".7"/>`
      }).join('')
      return `<path d="M${cx} ${cy}L${f(T[0])} ${f(T[1])}L${f(Vb[0])} ${f(Vb[1])}Z" fill="${P.goldD}" opacity="${f(0.15 + 0.3 * (1 - lit))}"/>` +
        `<path d="M${cx} ${cy}L${f(T[0])} ${f(T[1])}L${f(Vc[0])} ${f(Vc[1])}Z" fill="#fff" opacity="${f(0.1 + (0.25 * (1 + lit)) / 2)}"/>` + guil +
        `<path d="M${cx} ${cy}L${f(T[0])} ${f(T[1])}" stroke="${P.goldD}" stroke-width=".5"/>`
    }).join('')
    const ringO = ellipse(cx, cy, 14.6, 14.6), ringI = ellipse(cx, cy, 10.2, 10.2)
    const tp = k.id('cm'), bp = k.id('cm')
    const beads = Array.from({ length: 34 }, (_, i) => { const a = (i / 34) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 15.6)}" cy="${f(cy + Math.sin(a) * 15.6)}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>` }).join('')
    return (
      fondo(k) +
      k.sun(cx, cy, 19, 48, 32, false) +
      k.shade(ellipse(cx, cy, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(51, 101, 29, 95, 25, 68, 8) + laurel(69, 101, 91, 95, 95, 68, 8, true) +
      k.cast([star], 2.4, 2.4, CUERO) +
      k.draw([{ d: star, fill: P.gold, inner: facets + k.sh(star, 0, 0, 1, 1, 0, 0.55, P.goldD, 0.35) }], 0.8) +
      tips.map(([x, y]) => k.draw([{ d: ellipse(x, y, 3, 3), fill: P.gold, inner: k.sh(ellipse(x, y, 3, 3), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) }], 0.5) + `<circle cx="${f(x - 1)}" cy="${f(y - 1)}" r=".85" fill="#fff" opacity=".9"/>`).join('') +
      // El anillo esmaltado con la leyenda y el medallón con el cacho en relieve.
      k.draw([{ d: ringO, fill: P.wine, inner: k.sh(ringO, 0, 0, 1, 1, 0, 0.8, '#3A0A16', 0.4) }], 0.6) +
      beads +
      `<path id="${tp}" d="M${cx - 12.2} ${cy}A12.2 12.2 0 0 1 ${cx + 12.2} ${cy}" fill="none"/><path id="${bp}" d="M${cx - 12.9} ${cy}A12.9 12.9 0 0 0 ${cx + 12.9} ${cy}" fill="none"/>` +
      `<text ${GEORGIA} font-weight="700" font-size="3.2" letter-spacing=".45" fill="${P.goldL}"><textPath href="#${tp}" startOffset="50%" text-anchor="middle">COMISARÍA</textPath></text>` +
      `<text ${GEORGIA} font-style="italic" font-size="2.9" fill="${P.goldL}"><textPath href="#${bp}" startOffset="50%" text-anchor="middle">del pueblo</textPath></text>` +
      `<path d="${starPath(cx - 12.1, cy + 0.2, 1, 0.4, 5)}" fill="${P.goldL}"/><path d="${starPath(cx + 12.1, cy + 0.2, 1, 0.4, 5)}" fill="${P.goldL}"/>` +
      k.draw([{ d: ringI, fill: P.gold, inner: k.sh(ringI, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${ellipse(cx, cy, 8.8, 8.8)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.5) +
      // El cacho repujado: la silueta en oro viejo, la faja y el tiento cruzado.
      `<g transform="translate(${cx} ${cy + 7.2}) scale(.48)">` +
      `<path d="${VASO_ALL}" fill="${P.brownD}" transform="translate(1 1)" opacity=".7"/><path d="${VASO_ALL}" fill="${P.goldL}"/>` +
      k.clip(VASO_ALL, k.sh('M0 -32H13V3H0Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="${bandPath(-19.6, -11.6)}" fill="${P.goldD}"/>` +
        `<path d="${ring(-15.6).d}" fill="none" stroke="${P.goldL}" stroke-width="1.1" stroke-dasharray="1.6 1.2"/>` +
        `<path d="M-11.9 -4.6C-11.9 -.8 11.9 -.8 11.9 -4.6" fill="none" stroke="${P.goldD}" stroke-width="1"/>` +
        `<path d="M-5.4 -28L-1.6 -25L-5.4 -22.4L-1.8 -19.8M-1.6 -28L-5.4 -25L-1.6 -22.4L-5.2 -19.8" fill="none" stroke="${P.goldD}" stroke-width="1"/>`) +
      `<path d="${VASO_ALL}" fill="none" stroke="${P.goldD}" stroke-width="1"/>` +
      `</g>` +
      `<path d="M41.6 40C44.4 36.8 48 34.4 52 33.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>` +
      sparkle(cx, 22, 3, '#fff') + sparkle(88, 36, 2) + sparkle(33, 44, 1.6) +
      k.defs()
    )
  },
}
