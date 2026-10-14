// Pádel: la pala agujereada (de madera, de carbono o de oro), la pelota de fieltro y la jaula (el vidrio y el
// alambrado). Los chistes salen de afuera de la cancha: el auto del estacionamiento, Marte, el reloj del turno,
// la milanesa de después y la topadora que pasa por el vidrio.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { CLAY, CLAY_D, CLAY_L, GLASS, label, NEGRA, pala, PALA, PINO, PINO_D, puff, stars, tennisBall, trail, voluta } from './_raquetas-piezas'

/** Verde del fieltro de la cancha. */
const TURF = '#4E8C8A', TURF_D = '#2F6466'
/** Milanesa y papas. */
const MILA = '#C99A55', MILA_D = '#94662F'

/** Paño de vidrio de la jaula, de x0 a x1 y de y0 a y1, con su reflejo y los tornillos. */
function glassPanel(k: Kit, x0: number, x1: number, y0: number, y1: number) {
  const d = `M${x0} ${y0}H${x1}V${y1}H${x0}Z`
  return (
    k.draw([{
      d, fill: GLASS,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) +
        `<path d="M${x0 + 4} ${y1}L${x0 + 18} ${y0}H${x0 + 24}L${x0 + 10} ${y1}Z" fill="#fff" opacity=".45"/>` +
        `<path d="M${x0 + 28} ${y1}L${x0 + 38} ${y0}H${x0 + 40}L${x0 + 30} ${y1}Z" fill="#fff" opacity=".4"/>`,
    }], 0.55) +
    [[x0 + 2, y0 + 2], [x1 - 2, y0 + 2], [x0 + 2, y1 - 2], [x1 - 2, y1 - 2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
  )
}

/** Alambrado romboidal recortado a `d`. */
function mesh(k: Kit, d: string, x0: number, y0: number, x1: number, y1: number, step: number, c: string = P.sky, op = 1) {
  let lines = ''
  for (let x = x0 - (y1 - y0); x < x1; x += step) lines += `M${f(x)} ${y0}L${f(x + (y1 - y0))} ${y1}M${f(x + (y1 - y0))} ${y0}L${f(x)} ${y1}`
  return k.clip(d, `<path d="${lines}" fill="none" stroke="${P.ink}" stroke-width=".9" opacity="${op}"/><path d="${lines}" fill="none" stroke="${c}" stroke-width=".4" opacity="${op}"/>`)
}

/** Auto viejito de perfil (tipo Fitito) mirando a la izquierda, apoyado en (0,0). */
function car(k: Kit, body: string, dark: string, o: { dent?: boolean } = {}) {
  const shell = 'M-17 -2.6C-17.6 -6.4 -16 -8.6 -12.6 -9.2C-10.4 -15.4 -6 -18 0 -18C6.4 -18 11 -15.4 13.4 -9.6C16.6 -9 18 -6.6 17.4 -2.6C17 -1 16 0 14 0H-14.6C-16 0 -16.8 -1 -17 -2.6Z'
  const win = 'M-10.4 -9.6C-8.6 -14.2 -5 -16 -.6 -16V-9.6ZM1 -16C5.2 -16 8.8 -14.2 11 -9.6H1Z'
  const wheelD = (x: number) => ellipse(x, 0, 3.8, 3.8)
  const dent = o.dent ? `<path d="M-3 -18C-1.6 -16.4 1.6 -16.4 3 -18" fill="${dark}" stroke="${P.ink}" stroke-width=".4"/>` : ''
  return (
    k.draw([{
      d: shell, fill: body,
      inner:
        k.sh(shell, 0, 0, 0, 1, 0.1, 0.85, dark, 0.45) + `<path d="M-18 -19H18V-10H-18Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.4, 0)}"/>` +
        `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + k.clip(win, `<path d="M-8 -9L-2 -17H1L-5 -9Z" fill="#fff" opacity=".7"/>`) +
        `<path d="M-17 -5.4H17.6" stroke="${dark}" stroke-width=".6"/><path d="M0 -9.6V-1.6" stroke="${dark}" stroke-width=".5"/>` +
        `<path d="M2.4 -6.4H5" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
        `<circle cx="-15.6" cy="-6.8" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
        dent,
    }], 0.7) +
    [-9.6, 9.6].map((x) => k.draw([{ d: wheelD(x), fill: P.night, inner: `<circle cx="${x}" cy="0" r="1.8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>` }], 0.5)).join('')
  )
}

/** Planeta rojo con sus cráteres, centrado en (x,y). */
function mars(k: Kit, x: number, y: number, r: number) {
  const d = ellipse(x, y, r, r)
  const craters = [[-0.4, -0.2, 0.18], [0.3, 0.3, 0.13], [0.1, -0.5, 0.1], [-0.2, 0.5, 0.09], [0.55, -0.15, 0.08]]
    .map(([dx, dy, rr]) => `<ellipse cx="${f(x + dx * r)}" cy="${f(y + dy * r)}" rx="${f(rr * r)}" ry="${f(rr * r * 0.75)}" fill="${CLAY_D}" stroke="${P.wine}" stroke-width=".35"/><path d="M${f(x + dx * r - rr * r * 0.7)} ${f(y + dy * r - rr * r * 0.3)}A${f(rr * r)} ${f(rr * r * 0.75)} 0 0 1 ${f(x + dx * r + rr * r * 0.7)} ${f(y + dy * r - rr * r * 0.3)}" fill="none" stroke="${CLAY_L}" stroke-width=".45"/>`).join('')
  return k.draw([{
    d, fill: CLAY,
    inner:
      `<path d="${d}" fill="${k.rad(CLAY_L, 0.32, 0.3, 0.6, 0.9, 0)}"/>` + craters +
      `<path d="M${f(x - r)} ${f(y - r * 0.1)}C${f(x - r * 0.3)} ${f(y + r * 0.1)} ${f(x + r * 0.3)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y)}" fill="none" stroke="${CLAY_D}" stroke-width="1.2" opacity=".5"/>` +
      k.sh(d, 0, 0, 1, 1, 0.1, 0.95, P.wine, 0.5),
  }], 0.75)
}

/** Reloj de pared con un sector pintado de `a0` a `a1` minutos. */
function clock(k: Kit, x: number, y: number, r: number, m1: number, wedge: string, wedgeD: string) {
  const d = ellipse(x, y, r, r), face = ellipse(x, y, r - 2.6, r - 2.6), rr = r - 2.6
  const ang = (m: number) => ((m / 60) * 360 - 90) * (Math.PI / 180)
  const px = (m: number, q: number) => f(x + Math.cos(ang(m)) * q), py = (m: number, q: number) => f(y + Math.sin(ang(m)) * q)
  const sector = `M${x} ${y}L${px(0, rr)} ${py(0, rr)}A${rr} ${rr} 0 ${m1 > 30 ? 1 : 0} 1 ${px(m1, rr)} ${py(m1, rr)}Z`
  const ticks = Array.from({ length: 12 }, (_, i) => `M${px(i * 5, rr - (i % 3 ? 1.6 : 3))} ${py(i * 5, rr - (i % 3 ? 1.6 : 3))}L${px(i * 5, rr - 0.4)} ${py(i * 5, rr - 0.4)}`).join('')
  return (
    k.draw([{ d, fill: P.mid, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + hair(x - r + 1.2, y + 4, x - r + 0.4, y - 6, x - r * 0.4, y - r + 1.2, 0.8, P.sky, 0.9) }], 0.75) +
    `<path d="${face}" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="${sector}" fill="${wedge}" opacity=".85"/>` + k.clip(sector, k.sh(face, 0, 0, 1, 1, 0, 0.7, wedgeD, 0.4)) +
    k.clip(face, k.sh(face, 0, 0, 1, 1, 0, 0.45, P.blue, 0.3)) +
    `<path d="${ticks}" stroke="${P.ink}" stroke-width=".7"/>` +
    `<path d="M${x} ${y}L${px(m1, rr - 3)} ${py(m1, rr - 3)}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="M${x} ${y}L${px(0, rr - 6)} ${py(0, rr - 6)}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${y}" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

/** Topadora de perfil mirando a la izquierda, apoyada en (0,0): pala adelante, cabina y orugas. */
function dozer(k: Kit, body: string, dark: string, light: string) {
  const track = roundRect(-13, -8.4, 19, 0, 4.2)
  const hull = 'M-11 -8.4V-16.6C-11 -17.6 -10.2 -18.4 -9.2 -18.4H4V-28.6C4 -29.6 4.8 -30.4 5.8 -30.4H15C16 -30.4 16.8 -29.6 16.8 -28.6V-8.4Z'
  const win = 'M6.4 -28H14.4V-20.4H6.4Z'
  const blade = 'M-24.6 1.2C-27 -6.6 -26.6 -14.8 -22.6 -21.4L-18.6 -20.6C-21.4 -14.6 -21.6 -6.6 -19.2 1.2Z'
  const arm = 'M-20.6 -13.4L-9 -11.4V-8.6L-20.6 -9.8Z'
  const pipe = roundRect(-6, -24.4, -3.6, -18.4, 0.8)
  const wheels = [-8.8, -2.4, 4, 10.4, 15].map((x) => `<circle cx="${x}" cy="-4.2" r="2.2" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="-4.2" r=".7" fill="${P.sky}"/>`).join('')
  const lugs = Array.from({ length: 16 }, (_, i) => `M${f(-11 + i * 1.9)} -8.4V-7.4M${f(-11 + i * 1.9)} 0V-1`).join('')
  return (
    k.draw([{ d: pipe, fill: P.night }], 0.45) +
    k.draw([
      { d: arm, fill: dark, inner: k.sh(arm, 0, 0, 0, 1, 0, 0.8, P.ink, 0.4) },
      { d: track, fill: P.night, inner: wheels + `<path d="${lugs}" stroke="${P.mid}" stroke-width=".7"/>` },
      {
        d: hull, fill: body,
        inner:
          k.sh(hull, 0, 0, 1, 1, 0, 0.85, dark, 0.45) + `<path d="M-12 -32H18V-24C10 -22 -2 -16 -12 -14Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.45, 0)}"/>` +
          `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + `<path d="M8 -20.4L12 -28H13.6L9.6 -20.4Z" fill="#fff" opacity=".8"/>` +
          `<path d="M-11 -14.6H4M4 -14.6V-8.4" stroke="${dark}" stroke-width=".55"/>` +
          [[-8.6, -16.4], [1.6, -16.4], [-8.6, -10.6], [14.6, -10.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${light}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
          hair(-9.6, -17.4, -3, -18, 3, -17.6, 0.6, light),
      },
      {
        d: blade, fill: body,
        inner: k.sh(blade, 0, 0, 1, 0, 0, 0.9, dark, 0.45) + `<path d="M-24 -10C-24.4 -6 -24 -2 -23 1M-22.6 -18C-23.6 -16 -24.2 -13 -24.2 -10.4" fill="none" stroke="${dark}" stroke-width=".5"/>` + hair(-24.4, -1, -25.6, -10, -22.4, -19, 0.6, light),
      },
    ], 0.7)
  )
}

/** Llave dorada cuya cabeza es una pala de pádel, con el cuello en (0,-6) y la paleta de dientes abajo. */
function palaKey(k: Kit) {
  const shaft = roundRect(-2.2, -7.4, 2.2, 26, 1.1)
  const bit = 'M2 15.6H8.6V18.4H6.4V20H8.6V25.4H2Z'
  const holes = [[-5.4, -34], [0, -36], [5.4, -34], [-7.6, -28], [-2.6, -30], [2.6, -30], [7.6, -28], [-5.4, -23], [0, -24.4], [5.4, -23]]
    .map(([x, y]) => ellipse(x, y, 1.1, 1.1)).join('')
  return k.draw([
    { d: bit, fill: P.gold, inner: k.sh(bit, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) },
    { d: shaft, fill: P.gold, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.2 -7H-.4V26H-2.2Z" fill="${P.goldL}" opacity=".8"/>` + `<path d="M-2.2 4H2.2M-2.2 6H2.2" stroke="${P.goldD}" stroke-width=".5"/>` },
    {
      d: PALA, fill: P.gold,
      inner:
        k.sh(PALA, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-15 -45H-4V-9H-15Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="M0 -41.6C8.4 -41.6 12 -35.4 12 -28C12 -20.8 8.6 -15.8 3.8 -12.6H-3.8C-8.6 -15.8 -12 -20.8 -12 -28C-12 -35.4 -8.4 -41.6 0 -41.6Z" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
        `<path d="${holes}" fill="${P.night}" stroke="${P.goldD}" stroke-width=".4"/>` +
        `<path d="M-6 -17C-3 -14.6 3 -14.6 6 -17" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
        `<path d="${starPath(0, -18.8, 2, 0.8, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` +
        hair(-12.6, -22, -13.4, -32, -8, -41.6, 0.7, '#fff', 0.85),
    },
  ], 0.7)
}

export const PADEL_ART: Record<string, (u: number) => string> = {
  // ── Pala de oro ────────────────────────────────────────────────────

  // Cinco ganados: la pala de madera, con el marco remendado de cinta de cuando le pegabas con el canto.
  // Ahora la pelota entra justo en el centro.
  'Pala de madera': (u) => {
    const k = kit(u)
    const tape = `<path d="M-15.6 -31L-11.6 -31.8L-11 -25.2L-15 -24.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M-15.2 -29.4L-11.4 -30M-14.8 -27.2L-11.2 -27.8" stroke="${P.sky2}" stroke-width=".35"/>` +
      `<path d="M10.8 -16.8L14.2 -14.4L11.6 -10.6L8.4 -13.2Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>`
    return (
      k.day() +
      k.sun(60, 52, 15, 44, 28, false) +
      k.floor(60, 96, 14, 2, P.mid) +
      `<g transform="translate(58 80) rotate(-10)">` + k.cast([PALA], 2, 2, P.mid) + `</g>` +
      pala(k, 58, 80, -10, { face: PINO, faceD: PINO_D, rim: P.brown, rimD: P.brownD, holes: P.brownD, grip: P.white, gripD: P.sky, top: tape }) +
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2 + 0.3; return hair(f(57 + Math.cos(a) * 9), f(52 + Math.sin(a) * 9), f(57 + Math.cos(a) * 11), f(52 + Math.sin(a) * 11), f(57 + Math.cos(a) * 13.4), f(52 + Math.sin(a) * 13.4), 0.8, P.ink) }).join('') +
      tennisBall(k, 57, 52, 6.4, { rot: 20 }) +
      sparkle(84, 40, 2.2) + sparkle(34, 70, 1.6) +
      k.defs()
    )
  },

  // Veinte ganados: la pala de carbono con su etiqueta de precio colgando, y al lado, chiquito, el primer auto.
  'Pala de carbono': (u) => {
    const k = kit(u)
    const tag = 'M0 0L4 -3.6H19.6C20.6 -3.6 21.4 -2.8 21.4 -1.8V1.8C21.4 2.8 20.6 3.6 19.6 3.6H4Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(46, 96, 14, 2, P.mid) + k.floor(80, 92, 14, 1.8, P.mid) +
      `<g transform="translate(46 82) rotate(-12)">` + k.cast([PALA], 2, 2, P.mid) + `</g>` +
      pala(k, 46, 82, -12, { face: NEGRA, faceD: P.mid, rim: P.night, rimD: '#0F1736', holes: P.sky1, carbon: true, grip: P.white, gripD: P.sky }) +
      `<path d="M47.4 78C54 74 60 70 64.4 66.6" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(64 66.6) rotate(-24)">` +
      k.draw([{ d: tag, fill: P.goldL, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.5) +
      `<circle cx="3.2" cy="0" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="12.6" y="2" font-family="Georgia, serif" font-weight="700" font-size="5.4" fill="${P.red}" text-anchor="middle">$$$</text>` +
      `</g>` +
      `<g transform="translate(80 89) scale(.68)">` + car(k, P.sky2, P.blue) + `</g>` +
      sparkle(32, 40, 2.2) + sparkle(76, 34, 1.8) + sparkle(30, 62, 1.4) +
      k.defs()
    )
  },

  // Sesenta ganados: de noche, con el alambrado de la jaula y los reflectores, la llave de oro con cabeza de pala.
  // El llavero dice el turno: las 21.
  'Dueño de la jaula': (u) => {
    const k = kit(u)
    const fence = 'M0 0H120V130H0Z'
    const tagD = roundRect(-6.4, 0, 6.4, 8.6, 1.6)
    return (
      k.night() +
      mesh(k, fence, 0, 0, 120, 130, 7, P.mid, 0.55) +
      k.shade(ellipse(60, 54, 32, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.gold, 0.4) +
      [[32, 26], [88, 26]].map(([x, y]) => k.shade(ellipse(x, y, 10, 10), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.9, 0), '#ffffff', 0.5) + `<rect x="${x - 3.4}" y="${y - 1.8}" width="6.8" height="3.6" rx=".8" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>`).join('') +
      laurel(50, 100, 31, 93, 27, 64, 8) + laurel(70, 100, 89, 93, 93, 64, 8, true) +
      `<g transform="translate(61 72) rotate(-18) scale(.92)">` + k.cast([PALA], 2.4, 2.4, '#0F1736') + palaKey(k) + `</g>` +
      `<path d="M60.6 69C64 68.2 68 67.6 72.6 68.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M60.6 69C64 68.2 68 67.6 72.6 68.4" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
      `<circle cx="60.6" cy="69" r="2" fill="none" stroke="${P.ink}" stroke-width="1.4"/><circle cx="60.6" cy="69" r="2" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      `<g transform="translate(77 67) rotate(-8)">` +
      k.draw([{ d: tagD, fill: P.white, inner: k.sh(tagD, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) }], 0.5) +
      `<circle cx="0" cy="1.6" r=".7" fill="${P.night}"/>` +
      `<text x="0" y="7" font-family="Georgia, serif" font-weight="700" font-size="4.6" fill="${P.red}" text-anchor="middle">21</text>` +
      `</g>` +
      voluta('M80 84C78 80 80.6 77.6 83 78.6C84.6 79.4 84 81.6 82.6 81.4', P.gold) +
      sparkle(86, 46, 2.4, P.goldL) + sparkle(36, 72, 1.8, P.goldL) + sparkle(46, 30, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Por tres ──────────────────────────────────────────────────────

  // El primer por tres: la pelota sale por arriba del vidrio como un cohete, con el humo del despegue.
  'Despegue': (u) => {
    const k = kit(u)
    const wake = 'M47.6 77C50.6 66 55.6 54 62.6 43.6L66.4 46.4C60.4 56 56.4 66.4 54 77Z'
    return (
      k.day() +
      k.sun(60, 50, 14, 42, 28, false) +
      `<path d="M22 72H98V100H22Z" fill="${TURF}"/>` +
      glassPanel(k, 24, 59, 72, 100) + glassPanel(k, 61, 96, 72, 100) +
      `<path d="${wake}" fill="${k.lin(P.white, 0, 1, 0, 0, 0.9, 0)}"/>` +
      trail(66.4, 40.4, 120, 20, 3, 3, P.mid, 0.8) +
      puff(k, 40, 72, 8.6) + puff(k, 54, 74.4, 7.4) + puff(k, 70, 73, 6) +
      tennisBall(k, 70, 35, 7.4, { rot: -10 }) +
      label(84, 54, 6, '¡fiu!', P.ink, -10) +
      sparkle(36, 40, 2.2) + sparkle(88, 34, 1.6) +
      k.defs()
    )
  },

  // Diez por tres: la pelota cae en el techo del auto del vecino y le deja la abolladura. El auto ya la conoce.
  'Pelota al estacionamiento': (u) => {
    const k = kit(u)
    const asphalt = 'M0 86H120V130H0Z'
    return (
      k.day() +
      k.sun(60, 50, 14, 42, 28, false) +
      `<path d="${asphalt}" fill="${P.sky2}"/>` + k.sh(asphalt, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) +
      `<path d="M28 90L22 104M92 90L98 104" stroke="${P.white}" stroke-width="1.6"/>` +
      k.floor(60, 89, 26, 2.6, P.mid) +
      `<g transform="translate(60 86.4) scale(1.3)">` + car(k, P.red, P.wine, { dent: true }) + `</g>` +
      `<path d="M58 62.6C54 50 58 40 66 36" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
      [[-0.9, 0.5], [0.9, 0.5], [-0.4, 1], [0.4, 1]].map(([dx, dy]) => hair(60 + dx * 3, 61 + dy, 60 + dx * 5, 59 + dy, 60 + dx * 8, 58 - dy * 2, 0.7, P.ink)).join('') +
      tennisBall(k, 70, 34.6, 6.4, { rot: 30 }) +
      label(34, 54, 5.4, '¡tonc!', P.ink, -12) +
      sparkle(88, 50, 2) + sparkle(30, 38, 1.4) +
      k.defs()
    )
  },

  // Treinta por tres: la pelota llegó a Marte y dejó la pala clavada como bandera. Oro: estrellas y la órbita.
  'Misión a Marte': (u) => {
    const k = kit(u)
    const orbit = ellipse(56, 72, 34, 10)
    return (
      k.night() +
      stars([[30, 34], [44, 24], [78, 24], [90, 40], [34, 52], [94, 60], [70, 30], [28, 70]]) +
      `<g transform="rotate(-16 56 72)"><path d="${orbit}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray="1.6 1.4" opacity=".8"/></g>` +
      `<g transform="translate(62 58) rotate(14)">` + pala(k, 0, 0, 0, { s: 0.72, face: P.gold, faceD: P.goldD, rim: P.goldD, rimD: P.brownD, holes: P.night }) + `</g>` +
      mars(k, 56, 80, 20) +
      `<path d="M58 61.6C60 60.6 62 61 63 62" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      tennisBall(k, 84, 56, 5, { rot: 10 }) +
      trail(80, 58.4, 160, 8, 3, 1.8, P.goldL, 0.6) +
      laurel(48, 100, 30, 93, 27, 64, 8) + laurel(72, 100, 90, 93, 93, 64, 8, true) +
      sparkle(40, 38, 2.6, P.goldL) + sparkle(86, 30, 2, '#fff') + sparkle(36, 84, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── En dos sets ───────────────────────────────────────────────────

  // Ganaste sin regalar un set: el reloj del turno marca veinte minutos y sobran cuarenta.
  'Pasaron y no saludaron': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 56, 33) +
      k.floor(60, 88, 18, 2.4, P.mid) +
      clock(k, 58, 58, 22, 20, P.gold, P.goldD) +
      trail(36, 46, 200, 8, 3, 3, P.mid, 0.8) + trail(34, 66, 160, 8, 3, 3, P.mid, 0.8) +
      tennisBall(k, 81, 78, 6, { rot: 30 }) +
      label(60, 92, 6, 'sobran 40’', P.ink) +
      sparkle(86, 36, 2.2) + sparkle(30, 82, 1.4) +
      k.defs()
    )
  },

  // Cinco en dos sets: la milanesa con papas, servida primero. La pelota llega a la mesa con estela.
  'Express del jueves': (u) => {
    const k = kit(u)
    const plate = ellipse(60, 70, 26, 11)
    const well = ellipse(60, 69.4, 18, 7.4)
    const mila = 'M42.6 68.6C42 64.6 46 62.6 50 63.2C52.6 61.4 57.6 61.2 61 62.4C65 62.2 68.6 64 68.2 67.4C69 70.4 65.6 72.8 60.6 72.8C56 74.2 49.6 74 46.4 72.4C43.8 71.6 42.6 70.4 42.6 68.6Z'
    const fries = [[71, 66.4, -24], [73.4, 69.4, -6], [70.4, 71.4, 18], [74.6, 66, 30]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${f(x - 4)}" y="${f(y - 1.1)}" width="8" height="2.2" rx=".5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(x - 3.4)} ${f(y + 0.5)}H${f(x + 3.4)}" stroke="${P.gold}" stroke-width=".5"/></g>`).join('') +
      `<path d="M50 60.4A5 5 0 0 1 58 62.2L54 64.6Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><path d="M51.4 61.2L54 64.4M54 60.4V64.4M56.6 61.2L54 64.4" stroke="${P.gold}" stroke-width=".35"/>`
    const fork = 'M27.6 56H29V62H27.6ZM29.8 56H31.2V62H29.8ZM32 56H33.4V62H32ZM27.6 61.4H33.4C33.4 64 32 65 31.2 65.6V80.4C31.2 81.4 29.8 81.4 29.8 80.4V65.6C29 65 27.6 64 27.6 61.4Z'
    const knife = 'M89.6 54C92.4 56 93 60 92.6 66H90.6ZM90.4 66H92.8V80.6C92.8 81.6 90.4 81.6 90.4 80.6Z'
    return (
      k.day() +
      k.sun(60, 52, 14, 44, 28, false) +
      k.floor(61, 73.4, 28, 4, P.mid) +
      k.draw([{ d: fork, fill: P.white, inner: k.sh(fork, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) }, { d: knife, fill: P.white, inner: k.sh(knife, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) }], 0.5) +
      k.draw([{ d: plate, fill: P.white, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="${well}" fill="none" stroke="${P.sky}" stroke-width=".6"/>` + `<path d="M36 70A24 9.6 0 0 0 84 70" fill="none" stroke="${P.mid}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` }], 0.7) +
      k.draw([{ d: mila, fill: MILA, inner: k.sh(mila, 0, 0, 1, 1, 0, 0.9, MILA_D, 0.5) + Array.from({ length: 14 }, (_, i) => `<circle cx="${f(45 + (i % 7) * 3.4)}" cy="${f(65.4 + Math.floor(i / 7) * 3.8 + (i % 2) * 0.8)}" r=".45" fill="${MILA_D}"/>`).join('') }], 0.55) +
      fries +
      `<path d="M46 65C48 63.8 51 63.6 53.4 63.8" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      trail(71.6, 36.6, 150, 18, 3, 3, P.mid, 0.8) +
      tennisBall(k, 76, 34, 6.2, { rot: 30 }) +
      label(60, 92.6, 5.8, 'jueves', P.ink) +
      sparkle(36, 40, 2) + sparkle(88, 50, 1.4) +
      k.defs()
    )
  },

  // Quince sin perder un set: la topadora de oro pasa por el vidrio de la jaula, y vuelan los vidrios.
  'Topadora de vidrio': (u) => {
    const k = kit(u)
    const pane = 'M22 30H42V90H22Z'
    const cracks = [[0, -8], [30, -6], [70, -9], [110, -7], [160, -8], [200, -9], [250, -6], [300, -8]]
      .map(([a, _]) => { const r = (a * Math.PI) / 180; return `M38 58L${f(38 + Math.cos(r) * 30)} ${f(58 + Math.sin(r) * 30)}` }).join('') +
      `M32 50L36 55L33 62L36 67M28 58L31 52L36 50`
    const shards = [[40, 44, 20], [34, 38, -30], [44, 70, 60], [30, 78, -10], [46, 34, 40]]
      .map(([x, y, r]) => `<path d="M${x} ${y}l2.6 -3.6l2 3.4z" transform="rotate(${r} ${x} ${y})" fill="${GLASS}" stroke="${P.ink}" stroke-width=".4"/>`).join('')
    return (
      k.day() +
      k.sun(64, 54, 15, 46) +
      k.shade(ellipse(66, 56, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<path d="M0 88H120V130H0Z" fill="${TURF}"/>` + k.sh('M0 88H120V130H0Z', 0, 0, 0, 1, 0, 0.6, TURF_D, 0.4) +
      k.draw([{ d: pane, fill: GLASS, inner: k.sh(pane, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M24 90L34 30H38L28 90Z" fill="#fff" opacity=".4"/>` + `<path d="${cracks}" fill="none" stroke="${P.ink}" stroke-width=".55"/><path d="${cracks}" fill="none" stroke="#fff" stroke-width=".3" transform="translate(-.35 -.35)"/>` }], 0.55) +
      shards +
      k.floor(70, 90, 22, 2.6, TURF_D) +
      `<g transform="translate(68 88) scale(1.34)">` + dozer(k, P.gold, P.goldD, P.goldL) + `</g>` +
      voluta('M46 98C44 94 46.6 91.6 49 92.6C50.6 93.4 50 95.6 48.6 95.4', P.goldL) + voluta('M88 96C90 92 87.4 89.6 85 90.6C83.4 91.4 84 93.6 85.4 93.4', P.goldL) +
      trail(96, 66, 0, 6, 3, 3, P.mid, 0.8) +
      sparkle(86, 34, 2.4, '#fff') + sparkle(52, 30, 1.6, '#fff') + sparkle(96, 82, 1.4) +
      k.defs()
    )
  },
}

