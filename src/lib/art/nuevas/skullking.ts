// Medallas de Skull King, redibujadas (ver el kit en ../kit.ts).
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Verde agua de la cola de sirena. */
const TEAL = '#5E9F95'
const TEAL_D = '#336F69'
const FULL = 'M0 0H120V130H0Z'

type Pt = [number, number]

/** Mar: una banda con el borde de arriba ondulado (`n` ondas entre x0 y x1) que baja hasta y1. */
function sea(y: number, amp: number, n: number, x0 = -4, x1 = 124, y1 = 130) {
  const w = (x1 - x0) / n
  let d = `M${x0} ${y1}V${y}`
  for (let i = 0; i < n; i++) {
    const a = x0 + i * w
    d += `Q${f(a + w / 4)} ${f(y - amp)} ${f(a + w / 2)} ${y}Q${f(a + (3 * w) / 4)} ${f(y + amp)} ${f(a + w)} ${y}`
  }
  return d + `V${y1}Z`
}

/** Brillos en las crestas de un mar hecho con `sea` (mismos parámetros). */
function crests(y: number, amp: number, n: number, x0 = -4, x1 = 124, c: string = P.white, w = 0.6) {
  const wd = (x1 - x0) / n
  let s = ''
  for (let i = 0; i < n; i++) {
    const a = x0 + i * wd
    s += hair(a + wd * 0.08, y + 0.6, a + wd * 0.25, y - amp + 0.9, a + wd * 0.44, y + 0.2, w, c)
  }
  return s
}

/** Camino de tortuga: arranca en (x,y) mirando a `ang` grados y avanza por tramos [largo, giro en grados]. */
function walk(x: number, y: number, ang: number, segs: [number, number][], step = 1.1): Pt[] {
  const pts: Pt[] = [[x, y]]
  let a = (ang * Math.PI) / 180
  for (const [len, turn] of segs) {
    const n = Math.max(1, Math.round(len / step)), da = (turn * Math.PI) / 180 / n, ds = len / n
    for (let i = 0; i < n; i++) {
      a += da / 2
      x += Math.cos(a) * ds
      y += Math.sin(a) * ds
      a += da / 2
      pts.push([x, y])
    }
  }
  return pts
}

/** Tubo que se afina de w0 a w1 a lo largo de un camino, con la punta redondeada (tentáculos, algas). */
function strand(pts: Pt[], w0: number, w1: number) {
  const L: string[] = [], R: string[] = [], n = pts.length - 1
  pts.forEach(([x, y], i) => {
    const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(n, i + 1)]
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * Math.pow(i / n, 0.85)) / 2
    L.push(`${f(x - (dy / len) * w)} ${f(y + (dx / len) * w)}`)
    R.push(`${f(x + (dy / len) * w)} ${f(y - (dx / len) * w)}`)
  })
  const r = f(Math.max(w1 / 2, 0.1))
  return `M${L.join('L')}A${r} ${r} 0 0 0 ${R[R.length - 1]}L${R.reverse().join('L')}Z`
}

/** Calavera de frente con el centro del cráneo en (0,0); va de y=-14 a y=14.6. */
const SKULL = 'M0 -14C8.4 -14 13.6 -8.2 13.6 -1C13.6 3.6 11.8 6.6 9.4 8.2L9.2 11.6C9.2 13.4 8 14.6 6.4 14.6H-6.4C-8 14.6 -9.2 13.4 -9.2 11.6L-9.4 8.2C-11.8 6.6 -13.6 3.6 -13.6 -1C-13.6 -8.2 -8.4 -14 0 -14Z'
function skull(k: Kit, extra = '', w = 0.7) {
  const eye = 'M-9 .4C-9 -2.4 -7 -3.6 -4.9 -3.6C-2.6 -3.6 -1.3 -2 -1.3 .4C-1.3 3 -3 4.6 -5 4.6C-7.3 4.6 -9 2.8 -9 .4Z'
  return (
    k.draw([{
      d: SKULL, fill: P.white,
      inner:
        k.sh('M3 -16H16V16H3Z', 0, 0, 1, 0, 0, 0.85) + k.sh('M-16 6H16V16H-16Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
        `<ellipse cx="-6" cy="-8.6" rx="4" ry="2.2" fill="#fff" transform="rotate(-30 -6 -8.6)"/>` + extra,
    }], w) +
    `<path d="${eye}" fill="${P.night}"/><path d="${eye}" fill="${P.night}" transform="scale(-1 1)"/>` +
    `<path d="M0 5.4C.8 5.4 1.9 7.6 1.9 8.4C1.9 9 1.2 9.2 0 8.6C-1.2 9.2 -1.9 9 -1.9 8.4C-1.9 7.6 -.8 5.4 0 5.4Z" fill="${P.night}"/>` +
    `<path d="M-6.6 11.4Q0 12.6 6.6 11.4" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
    `<path d="M-3.6 10.4V13.6M-1.2 10.8V14.2M1.2 10.8V14.2M3.6 10.4V13.6" stroke="${P.ink}" stroke-width=".45" stroke-linecap="round"/>`
  )
}

/** Corona de cinco puntas con la base en (0,0) y la punta más alta en y=-15.4. */
const CROWN = 'M-10.6 0L-12.6 -11L-7.6 -5.8L-5.6 -13.6L-2.4 -6.6L0 -15.4L2.4 -6.6L5.6 -13.6L7.6 -5.8L12.6 -11L10.6 0Z'
function crown(k: Kit, w = 0.6) {
  const tips: Pt[] = [[-12.6, -11], [-5.6, -13.6], [0, -15.4], [5.6, -13.6], [12.6, -11]]
  return (
    tips.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/>`).join('') +
    k.draw([{
      d: CROWN, fill: P.gold,
      inner:
        k.sh(CROWN, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.45) + `<path d="M-14 -16H-3V1H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="M-11.3 -4.2H11.3" stroke="${P.goldD}" stroke-width=".7"/>`,
    }], w) +
    `<path d="M0 -4.2L1.6 -2.1L0 0L-1.6 -2.1Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35" transform="translate(0 -.1)"/>` +
    `<circle cx="-6" cy="-2.1" r="1.05" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/><circle cx="6" cy="-2.1" r="1.05" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Doblón de oro centrado en (x,y); `sq` < 1 lo pone de canto. */
function coin(k: Kit, x: number, y: number, r: number, rot = 0, sq = 1) {
  const d = ellipse(0, 0, r, r)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(1 ${sq})">` +
    k.draw([{ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.4) }], 0.45) +
    `<circle r="${f(r * 0.66)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
    `<path d="M0 ${f(-r * 0.38)}V${f(r * 0.38)}M${f(-r * 0.38)} 0H${f(r * 0.38)}" stroke="${P.goldD}" stroke-width=".55"/>` +
    `<ellipse cx="${f(-r * 0.36)}" cy="${f(-r * 0.42)}" rx="${f(r * 0.3)}" ry="${f(r * 0.15)}" fill="#fff" opacity=".85" transform="rotate(-35 ${f(-r * 0.36)} ${f(-r * 0.42)})"/>` +
    `</g>`
  )
}

/** Galeón de costado, con la proa a la izquierda y la línea de flotación en y≈6. `ghost` le rompe las velas. */
function ship(k: Kit, ghost = false) {
  const hull = 'M-33 -5Q-10 1 17 -1L18 -9H31L32 -7L30 1Q26 11 10 11H-14Q-27 10 -33 -5Z'
  const masts: [number, number, number][] = [[-14, -1, -38], [2, 0, -46], [22, -9, -34]]
  const sail = (x: number, y0: number, y1: number, w: number) => {
    const b = (y1 - y0) * 0.22
    if (!ghost) return `M${f(x - w)} ${y0}Q${x} ${f(y0 + b * 0.5)} ${f(x + w)} ${y0}Q${f(x + w + 2)} ${f((y0 + y1) / 2)} ${f(x + w)} ${y1}Q${x} ${f(y1 + b)} ${f(x - w)} ${y1}Q${f(x - w + 2)} ${f((y0 + y1) / 2)} ${f(x - w)} ${y0}Z`
    const jag = [0.15, 0.32, 0.5, 0.68, 0.85].map((t, i) => `L${f(x + w - t * 2 * w)} ${f(y1 + b * 0.6 - (i % 2 ? 3.4 : -0.4))}`).join('')
    return `M${f(x - w)} ${y0}Q${x} ${f(y0 + b * 0.5)} ${f(x + w)} ${y0}Q${f(x + w + 2)} ${f((y0 + y1) / 2)} ${f(x + w)} ${y1}${jag}L${f(x - w)} ${f(y1 - 2)}Q${f(x - w + 2)} ${f((y0 + y1) / 2)} ${f(x - w)} ${y0}Z`
  }
  const sails = [sail(-14, -35, -22, 8), sail(-14, -20, -6, 10), sail(2, -43, -29, 9.4), sail(2, -27, -7, 12), sail(22, -31, -15, 7)]
  const flag = 'M2 -46H11.6Q10.6 -44 12 -42Q8 -41.4 2 -41.6Z'
  const sailFill = ghost ? P.sky1 : P.white
  const holes = ghost ? [ellipse(-11, -14, 2.4, 1.8), ellipse(5.6, -18, 3, 2.2), ellipse(-1, -36, 1.8, 1.4), ellipse(20, -24, 1.6, 2.2)] : []
  return (
    `<path d="M-31 -5L-46 -13M-46 -13L-14 -38L2 -46L22 -34L31 -9" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
    masts.map(([x, y0, y1]) => `<path d="M${x} ${y0}V${y1}" stroke="${P.ink}" stroke-width="2.2"/><path d="M${x} ${y0}V${y1}" stroke="${ghost ? P.sky2 : P.brown}" stroke-width="1"/>`).join('') +
    `<path d="M-23 -35H-5M-24 -20H-4M-8 -43H12M-11 -27H15M14 -31H30" stroke="${P.ink}" stroke-width="1"/>` +
    k.draw(sails.map((d) => ({ d, fill: sailFill, inner: k.sh('M-30 -50H40V0H-30Z', 0, 0, 1, 1, 0, 0.75, ghost ? P.blue : P.sky2, 0.4) + holes.map((h) => `<path d="${h}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".3"/>`).join('') })), 0.5) +
    k.draw([{ d: flag, fill: P.night }], 0.4) +
    `<circle cx="6.4" cy="-44" r="1.1" fill="${P.paper}"/><path d="M4.6 -42.2L8.2 -45.8M4.6 -45.8L8.2 -42.2" stroke="${P.paper}" stroke-width=".45"/>` +
    k.draw([{
      d: hull, fill: ghost ? P.sky2 : P.brown,
      inner:
        k.sh(hull, 0, 0, 0, 1, 0, 0.95, ghost ? P.mid : P.brownD, 0.45) +
        `<path d="M-30 -1.6Q-8 4 30 -1.8" fill="none" stroke="${ghost ? P.sky1 : P.gold}" stroke-width="1"/>` +
        [-20, -11, -2, 7].map((x) => `<rect x="${x}" y="2.4" width="2.6" height="2.2" fill="${P.night}"/>`).join('') +
        `<rect x="21" y="-7.4" width="2" height="2.4" fill="${ghost ? P.goldL : P.night}"/><rect x="25.4" y="-7.4" width="2" height="2.4" fill="${ghost ? P.goldL : P.night}"/>`,
    }], 0.55)
  )
}

/** Silueta de meeple con la pierna derecha cortada en un muñón (para la pata de palo). */
const PEG_MEEPLE =
  'M0 -26C5.4 -26 9.6 -21.9 9.6 -16.8C9.6 -14.1 8.5 -11.9 6.8 -10.5C11.8 -10.2 16.6 -9.6 20 -8.2C24.2 -6.6 24.2 .4 20 1.6C17 2.5 14.2 2.8 12 3.8' +
  'C13 8 14.8 11.4 15.4 14.2C15.9 16.8 13.8 18 10.6 18C7.8 18 5 17.2 3.4 15.8C2.4 15 1.2 14.6 0 14.6' +
  'C-3 14.6 -5.4 20.4 -7 26L-17 26C-20.2 26 -21.8 23.4 -20 20.2C-17.4 15.6 -13.4 9.8 -12 3.8C-14.2 2.8 -17 2.5 -20 1.6C-24.2 .4 -24.2 -6.6 -20 -8.2' +
  'C-16.6 -9.6 -11.8 -10.2 -6.8 -10.5C-8.5 -11.9 -9.6 -14.1 -9.6 -16.8C-9.6 -21.9 -5.4 -26 0 -26Z'
const MEEPLE_D =
  'M0 -26C5.4 -26 9.6 -21.9 9.6 -16.8C9.6 -14.1 8.5 -11.9 6.8 -10.5C11.8 -10.2 16.6 -9.6 20 -8.2C24.2 -6.6 24.2 .4 20 1.6C17 2.5 14.2 2.8 12 3.8C13.4 9.8 17.4 15.6 20 20.2C21.8 23.4 20.2 26 17 26L7 26C5.4 20.4 3 14.6 0 14.6' +
  'C-3 14.6 -5.4 20.4 -7 26L-17 26C-20.2 26 -21.8 23.4 -20 20.2C-17.4 15.6 -13.4 9.8 -12 3.8C-14.2 2.8 -17 2.5 -20 1.6C-24.2 .4 -24.2 -6.6 -20 -8.2C-16.6 -9.6 -11.8 -10.2 -6.8 -10.5C-8.5 -11.9 -9.6 -14.1 -9.6 -16.8C-9.6 -21.9 -5.4 -26 0 -26Z'

/** Meeple pirata (camiseta a rayas, pañuelo con lunares, parche y arito), en coordenadas del meeple. */
function pirate(k: Kit, d: string, peg: boolean, s: number) {
  const bandana = 'M-9.9 -16.4C-10.8 -23.8 -5.8 -27.6 0 -27.6C5.8 -27.6 10.8 -23.8 9.9 -16.4C4 -19.8 -4 -19.8 -9.9 -16.4Z'
  const tails = 'M8.4 -18.4C11.8 -19 15.4 -21.4 17.8 -24C17.8 -20.4 15.8 -17.4 12.4 -16.2C14.8 -15.6 16.6 -13.6 17.6 -10.8C14.6 -11.6 11.4 -12.6 8.8 -14.8Z'
  const patch = 'M1.4 -17.6C1.4 -18.8 6 -18.8 6 -17.6V-15C6 -13 4.8 -12 3.7 -12C2.6 -12 1.4 -13 1.4 -15Z'
  const stripes = Array.from({ length: 7 }, (_, i) => `<path d="M-26 ${f(-5.4 + i * 4.8)}H26V${f(-3 + i * 4.8)}H-26Z" fill="${P.white}"/>`).join('')
  const dots = ([[-5.6, -22.4], [-1, -25], [3.8, -23.6], [7, -20.2], [-7.8, -19], [.6, -21], [-3.8, -19.8], [5, -20.4]] as Pt[])
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.white}"/>`).join('')
  const peggy = taper(10.4, 15.6, 10.6, 21, 11, 25.6, 4.6, 3.2)
  return (
    (peg ? k.draw([{ d: peggy, fill: P.brown, inner: k.sh(peggy, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + hair(9.8, 18, 10.1, 21, 10.4, 24.4, 0.4, P.goldL) }], f(0.7 / s)) +
      `<path d="M8.6 23.4H13.4" stroke="${P.ink}" stroke-width="1.6"/><path d="M8.6 23.4H13.4" stroke="${P.sky2}" stroke-width=".7"/>` : '') +
    k.draw([{
      d, fill: P.sky,
      inner:
        stripes + k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.75, P.mid) + k.sh('M-30 14H30V30H-30Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) +
        `<path d="M-30 -30H-2V30H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.28, 0)}"/>`,
    }], f(0.75 / s)) +
    hair(-6, 6, -4.6, 11, -6.6, 17, 0.6, P.mid) + (peg ? '' : hair(6, 6, 4.6, 11, 6.6, 17, 0.6, P.mid)) +
    k.draw([
      { d: tails, fill: P.red, inner: k.sh(tails, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) },
      { d: bandana, fill: P.red, inner: dots + k.sh(bandana, 0, 0, 1, 1, 0, 0.85, P.wine, 0.4) + `<path d="M-8 -21C-6.6 -24.6 -3.6 -26.2 -.6 -26.4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".5"/>` },
    ], f(0.65 / s)) +
    `<circle cx="9.6" cy="-17.4" r="1.9" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="M-9.4 -17.8L1.8 -16.4M5.8 -15.8L9.6 -14.2" stroke="${P.night}" stroke-width=".8" stroke-linecap="round"/>` +
    `<path d="${patch}" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M2.4 -16.6Q3.4 -17.4 4.6 -16.8" fill="none" stroke="${P.sky2}" stroke-width=".4" stroke-linecap="round"/>` +
    `<ellipse cx="-3.8" cy="-14.6" rx=".95" ry="1.25" fill="${P.ink}"/>` + hair(-6, -17, -3.8, -17.8, -1.6, -16.6, 0.6) +
    hair(-1.4, -10.6, 1.4, -9.8, 3.4, -11, 0.55) +
    `<circle cx="-9.2" cy="-11.4" r="1.7" fill="none" stroke="${P.ink}" stroke-width="1.3"/><circle cx="-9.2" cy="-11.4" r="1.7" fill="none" stroke="${P.gold}" stroke-width=".6"/>`
  )
}

/** Bocanada de humo blanca, centrada en (x,y). */
function puff(k: Kit, x: number, y: number, s: number) {
  const d = 'M-9 2C-11 2 -12 0 -10.6 -1.6C-11 -4.6 -7.6 -6 -5.6 -4.4C-4.6 -7.6 0 -8.2 1.6 -5.2C3.6 -7 7.4 -5.6 7 -2.6C9.6 -2.4 10.2 1.6 7.6 2Z'
  return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) }], f(0.45 / s)) + `</g>`
}

/** Corazoncito entintado. */
function heart(k: Kit, x: number, y: number, s: number, r = 0) {
  const d = 'M0 2.6C-3.4 .4 -3.6 -2.6 -1.6 -2.8C-.8 -2.8 -.2 -2.4 0 -1.6C.2 -2.4 .8 -2.8 1.6 -2.8C3.6 -2.6 3.4 .4 0 2.6Z'
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], f(0.4 / s)) + `</g>`
}

export const SKULLKING_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Cazador de reyes ───────────────────────────────────────────────

  // La primera sirena: el Skull King se hunde con la corona torcida y un beso de rouge en la frente.
  'Beso de sirena': (u) => {
    const k = kit(u)
    const lips = 'M-4.6 -.2C-3.6 -2 -1.6 -2.6 0 -1.2C1.6 -2.6 3.6 -2 4.6 -.2C2.8 .3 -2.8 .3 -4.6 -.2ZM-4.4 .5C-3 3 3 3 4.4 .5C2.6 1.1 -2.6 1.1 -4.4 .5Z'
    const kiss =
      `<g transform="translate(5.8 -7.2) rotate(16) scale(1.15)"><path d="${lips}" fill="${P.red}"/>` + k.shade(lips, k.lin(P.wine, 0, 0, 1, 1, 0, 0.9), P.wine, 0.3) +
      [-2.8, -1, 1, 2.8].map((x) => hair(x, -1.4, x + 0.2, 0.4, x, 2.2, 0.32, P.white)).join('') + `</g>`
    const tail = taper(81, 78, 81.4, 69, 88, 61, 6.8, 2.6)
    const fin = 'M0 1.6C-1.4 -1.6 -5 -4.8 -10 -5.8C-8.6 -2.4 -6.4 0 -2.6 2.8H2.6C6.4 0 8.6 -2.4 10 -5.8C5 -4.8 1.4 -1.6 0 1.6Z'
    const drop = (x: number, y: number, r: number, s: number) => `<path d="M0 -2.6C1 -1.2 1.6 -.2 1.6 .8C1.6 1.8 .8 2.4 0 2.4C-.8 2.4 -1.6 1.8 -1.6 .8C-1.6 -.2 -1 -1.2 0 -2.6Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${P.white}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/>`
    return (
      k.day() +
      `<path d="${sea(76, 2.6, 5)}" fill="${P.sky}"/>` + k.sh(sea(76, 2.6, 5), 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) +
      `<g transform="translate(57 57) rotate(-12) scale(1.25)">` +
      skull(k, kiss) +
      `<g transform="translate(-1.4 -11.4) rotate(18)">${crown(k, 0.5)}</g>` +
      `</g>` +
      `<path d="${sea(77, 2.2, 4, -6, 126)}" fill="${P.sky}" opacity=".72"/>` + crests(77, 2.2, 4, -6, 126) +
      hair(36, 82, 42, 80.6, 48, 82, 0.5, P.white) + hair(64, 83, 70, 81.8, 74, 83.4, 0.5, P.white) +
      `<path d="${ellipse(81.4, 77.4, 6.6, 1.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([{
        d: tail, fill: TEAL,
        inner: k.sh(tail, 0, 0, 1, 0, 0, 0.9, TEAL_D, 0.45) + [0.3, 0.52, 0.74].map((t) => {
          const x = 81 + (88 - 81) * t * t, y = 78 - 17 * t
          return `<path d="M${f(x - 2)} ${f(y - 0.6)}Q${f(x)} ${f(y + 1.4)} ${f(x + 2)} ${f(y - 0.8)}" fill="none" stroke="${TEAL_D}" stroke-width=".4"/>`
        }).join(''),
      }], 0.55) +
      `<g transform="translate(88.4 60.6) rotate(41)">` +
      k.draw([{ d: fin, fill: TEAL, inner: k.sh(fin, 0, 0, 1, 1, 0, 0.8, TEAL_D, 0.4) + hair(-1, 0, -4, -2.6, -7.6, -4.4, 0.4, TEAL_D) + hair(1, 0, 4, -2.6, 7.6, -4.4, 0.4, TEAL_D) }], 0.5) +
      `</g>` +
      drop(94, 66, 30, 1) + drop(96.4, 58, 60, 0.8) + drop(78, 66, -30, 0.8) +
      heart(k, 79, 40, 1.15, 12) + heart(k, 86.6, 31.6, 0.8, -10) +
      sparkle(32, 40, 2) + sparkle(36, 64, 1.4) +
      k.defs()
    )
  },

  // Tres reyes: en el fondo del mar ya hay dos coronas y cae la tercera.
  'Corona al agua': (u) => {
    const k = kit(u)
    const sand = 'M-4 88C14 82 30 86 46 85C62 84 78 80 96 84C106 86 114 84 124 82V130H-4Z'
    const weed = (x: number, h: number, s: number) => strand(walk(x, 98, -90, [[h * 0.34, 34 * s], [h * 0.36, -48 * s], [h * 0.3, 36 * s]]), 3.4, 1.1)
    const weeds = [weed(30, 40, 1), weed(35, 30, -1), weed(88, 36, -1), weed(92, 26, 1)]
    const bubble = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" fill-opacity=".35" stroke="${P.white}" stroke-width=".5"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff"/>`
    const star = starPath(0, 0, 3.6, 1.6, 5)
    return (
      `<rect width="120" height="130" fill="${P.sky}"/>` +
      k.shade(FULL, k.lin(P.mid, 0, 0, 0, 1, 0, 0.95), P.mid, 0.5) +
      k.shade('M44 0H56L46 98H22Z', k.lin(P.white, 0, 0, 0, 1, 0.6, 0), P.white, 0.3) +
      k.shade('M64 0H72L88 98H70Z', k.lin(P.white, 0, 0, 0, 1, 0.5, 0), P.white, 0.3) +
      k.draw(weeds.map((d) => ({ d, fill: P.green, inner: k.sh('M60 0H120V130H60Z', 0, 0, 1, 0, 0, 0.6, P.greenD, 0.4) + k.sh(FULL, 0, 0, 0, 1, 0.6, 0, P.greenD, 0.3) })), 0.5) +
      k.draw([{ d: sand, fill: P.goldL, inner: k.sh(sand, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.35) }], 0.6) +
      hair(30, 92, 40, 90.4, 50, 91.6, 0.5, P.goldD) + hair(62, 89, 72, 87.4, 82, 88.6, 0.5, P.goldD) + hair(50, 97, 58, 95.6, 66, 96.8, 0.45, P.goldD) +
      k.floor(44, 88.4, 10, 1.6, P.goldD) + k.floor(77, 87.4, 10, 1.6, P.goldD) +
      `<g transform="translate(43.6 88.4) rotate(-22) scale(.8)">${crown(k, 0.7)}</g>` +
      `<g transform="translate(77 87.4) rotate(16) scale(.8)">${crown(k, 0.7)}</g>` +
      `<g transform="translate(91 94) rotate(14)">` + k.draw([{ d: star, fill: P.red, inner: k.sh(star, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.4) + `</g>` +
      hair(54, 30, 53.6, 36, 54.4, 42, 0.5, P.white) + hair(66, 28, 66.4, 34, 65.6, 40, 0.5, P.white) +
      `<g transform="translate(60 62) rotate(12) scale(1.45)">${crown(k, 0.5)}</g>` +
      bubble(58, 32, 2) + bubble(63, 25, 1.4) + bubble(56.4, 21, 1) + bubble(68, 37, 1.2) + bubble(37, 56, 1.4) + bubble(34, 48, 0.9) +
      k.defs()
    )
  },

  // Ocho reyes: el kraken asoma de la tormenta con una corona enroscada en el tentáculo.
  'Leviatán': (u) => {
    const k = kit(u)
    const main = walk(68, 98, -96, [[22, -12], [14, 34], [10, 56], [12, 110], [10, 150]])
    const back1 = walk(34, 92, -84, [[16, -16], [10, -60], [7, -110]])
    const back2 = walk(93, 90, -98, [[14, 18], [9, 70], [6, 110]])
    const suck = (pts: Pt[], side: number, from: number, to: number, every: number, r0: number) => {
      let s = ''
      for (let i = from; i < Math.min(to, pts.length - 1); i += every) {
        const [x, y] = pts[i], [bx, by] = pts[i + 1], dx = bx - x, dy = by - y, len = Math.hypot(dx, dy) || 1
        const t = i / pts.length, r = r0 * (1 - t * 0.7), off = 4.4 * (1 - t * 0.75) * side
        s += `<circle cx="${f(x - (dy / len) * off)}" cy="${f(y + (dx / len) * off)}" r="${f(r)}" fill="${P.skin}" stroke="${P.wine}" stroke-width=".35"/>`
      }
      return s
    }
    const tent = (pts: Pt[], w0: number, w1: number, fill: string, dark: string) => {
      const d = strand(pts, w0, w1)
      return { d, fill, inner: k.sh(d, 0, 0, 1, 0, 0, 0.85, dark, 0.45) }
    }
    const tip = main[main.length - 1]
    const moon = ellipse(42, 38, 14, 14)
    return (
      k.night() +
      [[30, 56], [90, 30], [80, 52], [96, 64], [52, 24], [70, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.8), P.goldL, 0.3) +
      k.draw([tent(back1, 7, 1.6, P.wine, P.night), tent(back2, 6.4, 1.6, P.wine, P.night)], 0.5) +
      `<path d="${sea(84, 3, 5)}" fill="${P.mid}"/>` + k.sh(sea(84, 3, 5), 0, 0, 0, 1, 0, 0.95, P.night, 0.5) + crests(84, 3, 5, -4, 124, P.sky2, 0.55) +
      `<g transform="translate(36 78) rotate(-16) scale(.3)">${ship(k)}</g>` +
      k.draw([tent(main, 13, 2, P.red, P.wine)], 0.75) +
      suck(main, 1, 6, 60, 4, 1.6) +
      `<g transform="translate(${f(tip[0] - 4)} ${f(tip[1] + 1)}) rotate(-8) scale(.82)">${crown(k, 0.6)}</g>` +
      `<path d="${sea(90, 2.4, 4, -6, 126)}" fill="${P.mid}"/>` + k.sh(sea(90, 2.4, 4, -6, 126), 0, 0, 0, 1, 0, 0.9, P.night, 0.5) + crests(90, 2.4, 4, -6, 126, P.sky, 0.6) +
      `<path d="${ellipse(68, 90, 9, 1.8)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(88, 40, 2.2, P.goldL) + sparkle(26, 70, 1.4, P.paper) +
      k.defs()
    )
  },

  // ── Terror de piratas ──────────────────────────────────────────────

  // Tres piratas: el meeple ya tiene el look (pañuelo, parche, arito y rayas).
  'Parche en el ojo': (u) => {
    const k = kit(u)
    const s = 1.06
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(61.4, 92.4, 19, 2.4) +
      `<g transform="translate(60 64.4) scale(${s})">${pirate(k, MEEPLE_D, false, s)}</g>` +
      sparkle(86, 40, 2.4) + sparkle(33, 46, 1.6) +
      k.defs()
    )
  },

  // Doce piratas: pata de palo sobre la cubierta, toc, toc.
  'Pata de palo': (u) => {
    const k = kit(u)
    const s = 0.98
    const deck = 'M16 86H104V112H16Z'
    const planks = [90, 95, 101].map((y) => `<path d="M16 ${y}H104" stroke="${P.brownD}" stroke-width=".55"/>`).join('') +
      ([[30, 86, 90], [62, 86, 90], [46, 90, 95], [80, 90, 95], [36, 95, 101], [70, 95, 101]] as const).map(([x, a, b]) => `<path d="M${x} ${a}V${b}" stroke="${P.brownD}" stroke-width=".5"/>`).join('') +
      [[34, 88], [58, 88], [50, 92.6], [76, 92.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".4" fill="${P.brownD}"/>`).join('')
    return (
      k.day() +
      k.stage(60, 58, 33) +
      k.draw([{ d: deck, fill: P.brown, inner: planks + k.sh(deck, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M16 86.6H104" stroke="${P.goldL}" stroke-width=".6" opacity=".6"/>` }], 0.6) +
      k.floor(59, 87, 18, 1.8, P.brownD) +
      `<g transform="translate(57 61.4) scale(${s})">${pirate(k, PEG_MEEPLE, true, s)}</g>` +
      hair(64.6, 88.8, 63, 90.6, 61.6, 92.2, 0.5) + hair(70.6, 88.8, 72.2, 90.6, 73.6, 92.2, 0.5) + hair(67.6, 89.6, 67.6, 91.6, 67.6, 93.4, 0.5) +
      `<text x="84" y="73" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 84 73)">toc,</text>` +
      `<text x="88" y="82" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 88 82)">toc</text>` +
      sparkle(34, 40, 2) + sparkle(86, 36, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco piratas: barba negra trenzada, sombrero de tres picos y mechas que humean.
  'Barba Negra': (u) => {
    const k = kit(u)
    const s = 1.12
    const coatInner =
      k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M-30 -12H-4V30H-30Z" fill="${k.lin(P.red, 0, 0, 1, 0, 0.4, 0)}"/>` +
      `<path d="M-4.6 -10.6L-1.6 14.6M4.6 -10.6L1.6 14.6" stroke="${P.gold}" stroke-width="1.1"/>` +
      `<path d="M-20.6 -6.4C-14 -3.4 -10 -4.6 -6.4 -9.4M20.6 -6.4C14 -3.4 10 -4.6 6.4 -9.4" fill="none" stroke="${P.gold}" stroke-width=".9"/>`
    const head = ellipse(0, -16.8, 9.4, 9.4)
    const beard = 'M-9.6 -16.4C-10.4 -9 -9 -1.6 -5.6 3.6C-3.8 6.6 -1.6 8.6 0 10C1.6 8.6 3.8 6.6 5.6 3.6C9 -1.6 10.4 -9 9.6 -16.4C7.2 -13 3.6 -12.4 0 -12.4C-3.6 -12.4 -7.2 -13 -9.6 -16.4Z'
    const stache = 'M0 -13.4C-2 -15.4 -5.6 -15.2 -7.4 -13.4C-8.6 -12.2 -9.6 -12.6 -10 -13.6C-9.6 -11 -7.4 -10.2 -5 -10.8C-3 -11.2 -1.4 -12 0 -12.4C1.4 -12 3 -11.2 5 -10.8C7.4 -10.2 9.6 -11 10 -13.6C9.6 -12.6 8.6 -12.2 7.4 -13.4C5.6 -15.2 2 -15.4 0 -13.4Z'
    const hat = 'M-18.4 -21.4C-15 -23.2 -11.4 -24 -9.6 -29.6C-7.6 -35.6 7.6 -35.6 9.6 -29.6C11.4 -24 15 -23.2 18.4 -21.4C13 -18.6 6.4 -19.8 0 -17.4C-6.4 -19.8 -13 -18.6 -18.4 -21.4Z'
    const braid = (x: number) => [0, 1, 2].map((i) => `<ellipse cx="${x}" cy="${f(11 + i * 2.6)}" rx="1.5" ry="1.5" fill="${P.night}" stroke="${P.mid}" stroke-width=".35"/>`).join('') + `<path d="M${x - 1.6} ${f(18.4)}L${x + 1.6} 19.6M${x + 1.6} 18.4L${x - 1.6} 19.6" stroke="${P.red}" stroke-width="1.1" stroke-linecap="round"/>`
    const fuse = (x0: number, y0: number, x1: number, y1: number) =>
      `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="${starPath(x1, y1, 2.6, 0.8, 6)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="${x1}" cy="${y1}" r=".8" fill="${P.goldL}"/>`
    const embers = [[30, 52, 0.7], [90, 50, 0.6], [26, 72, 0.5], [94, 74, 0.5], [40, 30, 0.5], [82, 26, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.gold}"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.night}"/>` +
      k.shade(FULL, k.rad(P.gold, 0.5, 0.48, 0.5, 0.75, 0), P.goldD, 0.35) +
      puff(k, 36, 36, 1) + puff(k, 84, 32, 1.15) + puff(k, 30, 50, 0.7) +
      hair(38, 44, 33, 40, 37, 35, 0.6, P.sky2) + hair(82, 40, 88, 36, 84, 30, 0.6, P.sky2) +
      embers +
      `<g transform="translate(60 66) scale(${s})">` +
      k.draw([
        { d: MEEPLE_D, fill: P.wine, inner: coatInner },
        { d: head, fill: P.sky, inner: k.sh(head, 0.3, 0, 1, 0.6, 0, 0.6, P.mid, 0.35) },
      ], f(0.8 / s)) +
      `<circle cx="-11.6" cy="4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="-12.6" cy="9" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="11.6" cy="4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="12.6" cy="9" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      hair(-6, 6, -4.6, 11, -6.6, 17, 0.6, P.night) + hair(6, 6, 4.6, 11, 6.6, 17, 0.6, P.night) +
      braid(-3.4) + braid(3.4) +
      k.draw([{ d: beard, fill: P.night, inner: k.sh(beard, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) }], f(0.7 / s)) +
      hair(-6, -9, -6.4, -3, -3.6, 3, 0.5, P.mid) + hair(-2, -10, -2.4, -3, -1, 5, 0.5, P.mid) + hair(2.4, -10, 2.8, -3, 1.4, 5, 0.5, P.mid) + hair(6.4, -9, 6.6, -3, 3.8, 2.6, 0.5, P.mid) +
      k.draw([{ d: stache, fill: P.night }], f(0.5 / s)) +
      `<path d="M-6.4 -19.6L-2 -17.8M6.4 -19.6L2 -17.8" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/>` +
      `<circle cx="-3.8" cy="-16.2" r=".95" fill="${P.ink}"/><circle cx="3.8" cy="-16.2" r=".95" fill="${P.ink}"/>` +
      fuse(-7.6, -6, -12.6, -11.4) + fuse(7.8, -5, 13, -10) +
      k.draw([{
        d: hat, fill: P.night,
        inner: `<path d="M-18.4 -21.4C-13 -18.6 -6.4 -19.8 0 -17.4C6.4 -19.8 13 -18.6 18.4 -21.4" fill="none" stroke="${P.gold}" stroke-width="1.4"/>` + `<path d="M-6 -32.6C-4 -34 -1 -34.4 1.6 -34" fill="none" stroke="${P.sky2}" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`,
      }], f(0.75 / s)) +
      `<circle cx="0" cy="-26" r="2.4" fill="${P.paper}"/><circle cx="-.9" cy="-26.2" r=".6" fill="${P.night}"/><circle cx=".9" cy="-26.2" r=".6" fill="${P.night}"/>` +
      `<path d="M-3.6 -21.8L3.6 -23.8M-3.6 -23.8L3.6 -21.8" stroke="${P.paper}" stroke-width=".9" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(88, 60, 2, P.goldL) + sparkle(32, 64, 1.5, P.goldL) +
      k.defs()
    )
  },

  // ── Polizón ────────────────────────────────────────────────────────

  // Tres ceros: viajás escondido en un barril; sólo se te ven los ojos.
  'Polizón': (u) => {
    const k = kit(u)
    const body = 'M41.6 48C39.4 58 39.4 76 41.6 87C48 90.6 72 90.6 78.4 87C80.6 76 80.6 58 78.4 48C72 45 48 45 41.6 48Z'
    const hoop = (y: number, bulge: number) => `M${f(40 + bulge)} ${y}C${f(48)} ${f(y + 3)} ${72} ${f(y + 3)} ${f(80 - bulge)} ${y}L${f(80 - bulge)} ${f(y + 3.2)}C72 ${f(y + 6.2)} 48 ${f(y + 6.2)} ${f(40 + bulge)} ${f(y + 3.2)}Z`
    const staves = [46, 53, 60, 67, 74].map((x) => hair(x, 50, x + (x - 60) * 0.14, 68, x, 87, 0.45, P.brownD)).join('')
    const rim = ellipse(60, 47.6, 18.6, 3.6)
    const lid = ellipse(0, 0, 19, 3.8)
    const lidSide = 'M-19 0V2.4C-19 4.4 19 4.4 19 2.4V0C19 2 -19 2 -19 0Z'
    return (
      k.day() +
      k.stage(60, 60, 33) +
      k.floor(61, 89.6, 21, 2.6) +
      k.draw([
        { d: body, fill: P.brown, inner: staves + k.sh('M64 40C74 52 76 70 74 92H84V40Z', 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + k.sh('M36 80H84V92H36Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.3) + `<path d="M36 44H50V92H36Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.5, 0)}"/>` },
        { d: hoop(52, 0.6), fill: P.mid, inner: k.sh(hoop(52, 0.6), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: hoop(80, 0.8), fill: P.mid, inner: k.sh(hoop(80, 0.8), 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: rim, fill: P.night },
      ], 0.7) +
      [44, 76].map((x) => `<circle cx="${x}" cy="${53.8}" r=".5" fill="${P.sky2}"/><circle cx="${x}" cy="81.8" r=".5" fill="${P.sky2}"/>`).join('') +
      `<text x="60" y="71.6" ${GEORGIA} font-weight="700" font-size="7" letter-spacing=".8" fill="${P.brownD}" opacity=".85" text-anchor="middle">RON</text>` +
      `<ellipse cx="54.6" cy="47.6" rx="2.2" ry="1.6" fill="${P.white}"/><ellipse cx="61.6" cy="47.6" rx="2.2" ry="1.6" fill="${P.white}"/>` +
      `<circle cx="53.6" cy="47.8" r=".95" fill="${P.ink}"/><circle cx="60.6" cy="47.8" r=".95" fill="${P.ink}"/>` +
      `<g transform="translate(62 41.4) rotate(-9)">` +
      k.draw([
        { d: lidSide, fill: P.brownD },
        { d: lid, fill: P.brown, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M-12 -1.6H10M-15 .6H16" stroke="${P.brownD}" stroke-width=".4"/>` },
      ], 0.6) +
      `</g>` +
      `<text x="34" y="40" ${GEORGIA} font-style="italic" font-size="5.6" fill="${P.ink}" transform="rotate(-12 34 40)">shh…</text>` +
      sparkle(88, 44, 2) +
      k.defs()
    )
  },

  // Doce ceros: a la deriva en una botella, sin tocar una baza.
  'Botella al mar': (u) => {
    const k = kit(u)
    const glass = 'M-20 -8H6C10 -8 12 -3.4 15 -3.2H22V3.2H15C12 3.4 10 8 6 8H-20C-22.4 8 -23.4 6 -23.4 0C-23.4 -6 -22.4 -8 -20 -8Z'
    const lip = roundRect(21.4, -4, 24.4, 4, 1)
    const cork = 'M24.4 -2.8H29.4C30.2 -2.8 30.6 -2.2 30.6 -1.4V1.4C30.6 2.2 30.2 2.8 29.4 2.8H24.4Z'
    const scroll = roundRect(-18, -4.2, 4, 4.2, 2)
    const gull = (x: number, y: number, s: number) => `<path d="M${x - 3 * s} ${y}Q${x - 1.5 * s} ${y - 2 * s} ${x} ${y}Q${x + 1.5 * s} ${y - 2 * s} ${x + 3 * s} ${y}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linecap="round"/>`
    return (
      k.day() +
      k.sun(84, 38, 7, 16, 20, false) + `<circle cx="84" cy="38" r="6.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      gull(40, 38, 1.2) + gull(50, 32, 0.9) +
      `<path d="${sea(66, 2, 6)}" fill="${P.sky}"/>` + k.sh(sea(66, 2, 6), 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) + crests(66, 2, 6) +
      hair(30, 74, 36, 72.8, 42, 74, 0.5, P.white) + hair(78, 90, 84, 88.8, 90, 90, 0.5, P.white) +
      `<g transform="translate(58 68) rotate(-22)">` +
      k.draw([
        { d: glass, fill: P.sky1, inner: `<path d="${scroll}" fill="${P.paper}" stroke="${P.ink}" stroke-width=".4"/><path d="M-8 -4.2V4.2M-6.4 -4.2V4.2" stroke="${P.red}" stroke-width=".9"/>` + `<path d="${ellipse(-18, 0, 1.2, 4.2)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` + hair(-14, -2.4, -6, -3, 2, -2.4, 0.4, P.brown) + k.sh(glass, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-20 -5.4H8" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".85"/>` },
        { d: lip, fill: P.sky1, inner: k.sh(lip, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
        { d: cork, fill: P.brown, inner: k.sh(cork, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.4) + `<circle cx="27" cy="-1" r=".4" fill="${P.brownD}"/><circle cx="28.6" cy="1" r=".4" fill="${P.brownD}"/>` },
      ], 0.7) +
      `</g>` +
      `<path d="${sea(72, 1.6, 5, -2, 122)}" fill="${P.sky}" opacity=".7"/>` + crests(72, 1.6, 5, -2, 122) +
      `<path d="${ellipse(58, 73.4, 20, 2.6)}" fill="none" stroke="${P.white}" stroke-width=".6" stroke-dasharray="3 2.4"/>` +
      hair(28, 84, 33, 83, 38, 84, 0.5, P.white) + hair(44, 92, 52, 91, 60, 92, 0.5, P.white) +
      sparkle(32, 54, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco ceros: el barco fantasma; estás, pero se te ve la luna a través de las velas.
  'Barco fantasma': (u) => {
    const k = kit(u)
    const moon = ellipse(62, 46, 21, 21)
    return (
      k.night() +
      [[28, 40], [92, 34], [30, 66], [96, 62], [40, 26], [84, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.8), P.goldL, 0.3) +
      k.shade(ellipse(60, 62, 40, 30), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.5, 0), P.sky1, 0.3) +
      `<path d="${sea(84, 2.6, 5)}" fill="${P.mid}"/>` + k.sh(sea(84, 2.6, 5), 0, 0, 0, 1, 0, 0.95, P.night, 0.5) + crests(84, 2.6, 5, -4, 124, P.sky2, 0.5) +
      `<g transform="translate(62 78) scale(.86)" opacity=".9">${ship(k, true)}</g>` +
      k.shade('M10 76C30 72 50 80 70 76C86 73 100 78 112 76V90H10Z', k.lin(P.white, 0, 0, 0, 1, 0.65, 0.1), P.white, 0.4) +
      hair(40, 92, 52, 90.6, 64, 92, 0.6, P.sky2) + hair(58, 96, 68, 94.8, 78, 96, 0.5, P.sky2) +
      sparkle(90, 48, 2.2, P.paper) + sparkle(30, 52, 1.4, P.paper) +
      k.defs()
    )
  },

  // ── Navegante exacto ───────────────────────────────────────────────

  // Seis rondas: con el catalejo ves venir la baza desde el horizonte (el barco lleva una carta de vela).
  'Catalejo': (u) => {
    const k = kit(u)
    const brass = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.45) + `<path d="M-40 -10H40V-2H-40Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.55, 0)}"/>` })
    const ring = (x: number, r: number) => brass(roundRect(f(x - 1.2), -r, f(x + 1.2), r, 0.6))
    const leather = roundRect(-21, -6.4, -1, 6.4, 0.8)
    const lens = ellipse(-27.4, 0, 2.2, 6.6)
    const boat = 'M-7 0H7L5 3.6H-5Z'
    return (
      k.day() +
      `<path d="M-4 64H124V130H-4Z" fill="${P.sky}"/>` + k.sh('M-4 64H124V130H-4Z', 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) +
      `<path d="M-4 64H124" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(48, 70, 56, 69, 64, 70, 0.5, P.white) + hair(30, 78, 38, 77, 46, 78, 0.5, P.white) + hair(70, 76, 78, 75, 86, 76, 0.5, P.white) +
      `<g transform="translate(36 63.6) scale(.9)">` +
      k.draw([{ d: boat, fill: P.brown }], 0.4) + `<path d="M0 0V-12" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(-.4 -.4) rotate(4)">` + `<path d="${roundRect(-4.4, -12.6, 4.4, -1.6, 0.9)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M0 -5.4C-2.4 -7 -2.3 -9.2 -1 -9.3C-.4 -9.3 -.1 -9 0 -8.5C.1 -9 .4 -9.3 1 -9.3C2.3 -9.2 2.4 -7 0 -5.4Z" fill="${P.red}"/></g>` +
      `</g>` +
      `<g transform="translate(66 68) rotate(36)">` +
      k.cast([roundRect(-28, -7.2, 28, 7.2, 2)], 0, 4.6) +
      k.draw([
        brass(roundRect(23, -2.6, 28.4, 2.6, 0.8)),
        brass(roundRect(12.4, -3.6, 23.6, 3.6, 0.6)),
        brass(roundRect(-1.6, -4.8, 13, 4.8, 0.6)),
        { d: leather, fill: P.brown, inner: k.sh(leather, 0, 0, 0, 1, 0, 0.95, P.brownD, 0.45) + `<path d="M-21 -3.6H-1" stroke="${P.goldL}" stroke-width=".8" opacity=".45"/>` + [-17, -13, -9, -5].map((x) => `<path d="M${x} -6.4L${x + 2} 6.4" stroke="${P.brownD}" stroke-width=".5"/>`).join('') },
        brass(roundRect(-28, -7.2, -20.6, 7.2, 1)),
        ring(-1.4, 5.4), ring(12.6, 4.4), ring(23, 3.2),
      ], 0.6) +
      `<path d="${lens}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".55"/>` + `<path d="M-27.4 -4.6Q-26.2 -2 -27 1" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      `<path d="M41 52L37.6 56" stroke="${P.ink}" stroke-width=".4" stroke-dasharray=".8 1.2"/>` +
      sparkle(41.6, 49, 2.6) + sparkle(88, 36, 1.6) +
      k.defs()
    )
  },

  // Ocho rondas: la daga clavada justo en la cruz del mapa.
  'Mapa del tesoro': (u) => {
    const k = kit(u)
    const sheet = 'M37 38.4C48 37.2 72 37.2 83 38.4V81.6C72 82.8 48 82.8 37 81.6Z'
    const rollL = roundRect(32.6, 36, 39.4, 84, 3.4), rollR = roundRect(80.6, 36, 87.4, 84, 3.4)
    const island = 'M48 66C46 60 50 54 56 53C60 50 66 50 70 53C76 54 78 60 76 65C78 70 72 75 66 73C62 76 54 76 52 72C47 72 46 69 48 66Z'
    const trail = 'M44 76C50 74 50 69 55 68C60 67 60 62 64 60'
    const rose = starPath(46.6, 47.2, 5.4, 1.2, 4, -90)
    const blade = 'M-1.5 0L-1.9 -5V-15.6H1.9V-5L1.5 0Z'
    const guard = roundRect(-5.6, -17.6, 5.6, -15.6, 1)
    const grip = roundRect(-1.4, -24.8, 1.4, -17.6, 0.8)
    const pommel = ellipse(0, -26.4, 2, 2)
    const waves = ([[44, 58], [72, 44], [76, 77], [63, 45]] as Pt[]).map(([x, y]) => `<path d="M${x - 2.4} ${y}q1.2 -1.2 2.4 0t2.4 0" fill="none" stroke="${P.blue}" stroke-width=".45"/>`).join('')
    return (
      k.day() +
      k.stage(60, 60, 33) +
      `<g transform="rotate(-6 60 60)">` +
      k.cast([sheet, rollL, rollR], 2, 2.2) +
      k.draw([{
        d: sheet, fill: P.paper,
        inner:
          k.shade(sheet, k.rad(P.brown, 0.5, 0.5, 0.62, 0, 0.75), P.brown, 0.3) + waves +
          `<path d="${island}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/>` + `<path d="${island}" fill="none" stroke="${P.blue}" stroke-width=".4" transform="translate(62 63) scale(1.12) translate(-62 -63)" stroke-dasharray=".8 1"/>` +
          `<path d="M52 64C54 60 58 58 60 60" fill="none" stroke="${P.green}" stroke-width="1.4" stroke-linecap="round"/>` +
          `<path d="${trail}" fill="none" stroke="${P.red}" stroke-width=".8" stroke-dasharray="1.4 1.2"/>` +
          `<path d="${rose}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="${starPath(46.6, 47.2, 3, 0.8, 4, -45)}" fill="${P.goldD}"/>` +
          `<text x="46.6" y="40.6" ${GEORGIA} font-weight="700" font-size="3" fill="${P.ink}" text-anchor="middle">N</text>`,
      }], 0.6) +
      k.draw([
        { d: rollL, fill: P.paper, inner: k.sh(rollL, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) },
        { d: rollR, fill: P.paper, inner: k.sh(rollR, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) },
      ], 0.6) +
      `<path d="M61.6 57.6L68.4 64.4M68.4 57.6L61.6 64.4" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/><path d="M61.6 57.6L68.4 64.4M68.4 57.6L61.6 64.4" stroke="${P.red}" stroke-width="1.6" stroke-linecap="round"/>` +
      `</g>` +
      k.shade('M65 61L72 34L76 35L68 62Z', k.lin(P.ink, 0, 0, 0, 1, 0, 0.5), P.ink, 0.25) +
      `<g transform="translate(64.6 60.8) rotate(10)">` +
      k.draw([
        { d: blade, fill: P.white, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M0 -1V-15" stroke="${P.sky2}" stroke-width=".5"/>` },
        { d: grip, fill: P.brownD, inner: [-23, -21, -19].map((y) => `<path d="M-1.4 ${y}L1.4 ${y - 1}" stroke="${P.brown}" stroke-width=".5"/>`).join('') },
        { d: guard, fill: P.gold, inner: k.sh(guard, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
        { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) },
      ], 0.55) +
      `<circle cx="0" cy="-16.6" r=".7" fill="${P.red}"/>` +
      `</g>` +
      hair(58, 62.4, 60, 62, 61.6, 63, 0.4) + hair(67, 63, 69, 62.6, 71, 63, 0.4) +
      sparkle(88, 32, 2) + sparkle(30, 86, 1.4) +
      k.defs()
    )
  },

  // Diez de diez: el cofre abierto, desbordado de doblones que saltan para repartir.
  'Cofre del tesoro': (u) => {
    const k = kit(u)
    const lid = 'M37.4 63L39.4 41C44 34 76 34 80.6 41L82.6 63Z'
    const pile = 'M34 66C36 57 46 50.6 60 50.6C74 50.6 84 57 86 66Z'
    const front = 'M34 66H86V91C86 92.2 85.2 93 84 93H36C34.8 93 34 92.2 34 91Z'
    const rim = 'M32.6 63.6H87.4V68.4H32.6Z'
    const lock = 'M55.4 70H64.6V78.6C64.6 80.6 62.6 82 60 82C57.4 82 55.4 80.6 55.4 78.6Z'
    const band = (x: number) => `M${x - 1.8} 68.4H${x + 1.8}V93H${x - 1.8}Z`
    const pileCoins = ([[42, 63, 2.6], [48, 60.4, 2.8], [54.4, 58, 2.8], [61, 57.4, 2.8], [67.4, 58.6, 2.8], [73.6, 60.6, 2.8], [79, 63.4, 2.4], [51, 64.4, 2.6], [64, 63, 2.8], [57.6, 53.8, 2.4], [70.4, 54.6, 2.2], [45.6, 66, 2.2], [76, 66, 2.2]] as const)
      .map(([x, y, r]) => coin(k, x, y, r)).join('')
    const gem = (x: number, y: number, c: string, dk: string, s: number) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 -1.4L-1.6 -3H1.6L3 -1.4L0 3Z" fill="${c}" stroke="${P.ink}" stroke-width=".45"/><path d="M-3 -1.4H3M-1.6 -3L-.8 -1.4L0 3L.8 -1.4L1.6 -3" fill="none" stroke="${dk}" stroke-width=".3"/><path d="M-1.6 -2.4L-.9 -1.6" stroke="#fff" stroke-width=".4"/></g>`
    const pearls = along(36, 70, 42, 80, 50, 76.6, [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 1]).map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="1.15" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      k.day() +
      k.sun(60, 54, 18, 46, 28, false) +
      k.floor(61, 93.6, 30, 2.8) +
      k.draw([{ d: lid, fill: P.brownD, inner: k.sh(lid, 0, 0, 0, 1, 0.2, 0.9, P.night, 0.4) + `<path d="M44 38V63M76 38V63" stroke="${P.gold}" stroke-width="2.6"/><path d="M44 38V63M76 38V63" stroke="${P.goldD}" stroke-width=".5"/>` + `<path d="M39 46C46 41 74 41 81 46" fill="none" stroke="${P.brown}" stroke-width=".6"/>` }], 0.7) +
      k.draw([{ d: pile, fill: P.goldD, inner: k.sh(pile, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) }], 0.6) +
      pileCoins + gem(53, 54.4, P.red, P.wine, 1.1) + gem(74.6, 58.4, P.sky, P.mid, 1) + gem(62.6, 50.6, P.green, P.greenD, 0.9) +
      k.draw([
        { d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.45) + k.sh('M30 84H90V94H30Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) + `<path d="M34 76H86M34 84.4H86" stroke="${P.brownD}" stroke-width=".5"/>` + `<path d="${band(44)}${band(76)}" fill="${P.gold}"/>` + `<path d="${band(44)}${band(76)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` },
        { d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M33 64.6H66" stroke="#fff" stroke-width=".7" opacity=".6"/>` },
        { d: lock, fill: P.gold, inner: k.sh(lock, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) },
      ], 0.75) +
      `<path d="M60 72.6C61 72.6 61.6 73.3 61.6 74.1C61.6 74.7 61.3 75.1 60.9 75.4L61.4 78.6H58.6L59.1 75.4C58.7 75.1 58.4 74.7 58.4 74.1C58.4 73.3 59 72.6 60 72.6Z" fill="${P.ink}"/>` +
      [[44, 70], [76, 70], [44, 90.4], [76, 90.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.goldD}"/>`).join('') +
      pearls +
      coin(k, 30.6, 52, 3, -20, 0.55) + coin(k, 89.6, 48, 3, 24, 0.6) + coin(k, 36.4, 40, 2.6, 30, 0.5) + coin(k, 84.6, 36.4, 2.4, -18, 0.8) +
      hair(34, 56, 37, 59, 40, 60, 0.5) + hair(86, 52, 83, 56, 80, 57.6, 0.5) +
      coin(k, 72, 95, 2.8, 0, 0.42) + coin(k, 44, 95.6, 2.6, 0, 0.42) +
      sparkle(60, 42, 2.4) + sparkle(30, 70, 1.5) +
      k.defs()
    )
  },
}
