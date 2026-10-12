// Medallas del Chinchón, redibujadas (ver el kit en ../kit.ts): Chinchones, Menos diez, Cortador serial y Reenganchado.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'

// ── Naipe español ────────────────────────────────────────────────────

type Palo = 'oros' | 'copas' | 'espadas' | 'bastos'

/** Figura de un palo centrada en (x,y). Se dibuja en un espacio de ±12 y se escala por r/10 (r = radio del oro). */
function pip(palo: Palo, x: number, y: number, r: number, rot = 0): string {
  const s = r / 10
  const o = `stroke="${P.ink}" stroke-width="${f((0.2 + 0.08 * r) / s)}" stroke-linejoin="round"`
  let g = ''
  if (palo === 'oros') {
    const ticks = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return `M${f(Math.cos(a) * 7.4)} ${f(Math.sin(a) * 7.4)}L${f(Math.cos(a) * 9.2)} ${f(Math.sin(a) * 9.2)}`
    }).join('')
    g =
      `<circle r="10" fill="${P.gold}" ${o}/>` +
      `<path d="${ticks}" stroke="${P.goldD}" stroke-width="1.1"/>` +
      `<circle r="7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width="1"/>` +
      `<path d="${starPath(0, 0, 5.8, 3, 8, -90)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".8"/>` +
      `<circle r="2.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="M-7.6 -2.6A8 8 0 0 1 -2.6 -7.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>`
  } else if (palo === 'copas') {
    const bowl = 'M-9 -9.6C-9 -3.6 -6 -.6 0 -.4C6 -.6 9 -3.6 9 -9.6Z'
    const foot = 'M-1.2 5.2C-2 7.8 -5.2 8.8 -6.4 11.2H6.4C5.2 8.8 2 7.8 1.2 5.2Z'
    g =
      `<path d="${foot}" fill="${P.gold}" ${o}/>` +
      `<path d="M-1.4 -.6H1.4L1.2 5.4H-1.2Z" fill="${P.gold}" ${o}/>` +
      `<path d="${ellipse(0, 2.4, 2.8, 1.4)}" fill="${P.gold}" ${o}/>` +
      `<path d="${bowl}" fill="${P.gold}" ${o}/>` +
      `<path d="M-8.9 -6.8C-3 -5.6 3 -5.6 8.9 -6.8L8.6 -5C3 -3.8 -3 -3.8 -8.6 -5Z" fill="${P.red}"/>` +
      `<path d="${ellipse(0, -9.6, 9, 2.1)}" fill="${P.red}" ${o}/>` +
      `<path d="${ellipse(0, -9.2, 6.6, 1.2)}" fill="${P.wine}"/>` +
      `<path d="M-6.8 -4.4C-6 -2.8 -4.6 -1.8 -3 -1.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>` +
      `<path d="M6 7.6L4.4 10.8M2.6 1.4H-2.6" stroke="${P.goldD}" stroke-width=".7"/>`
  } else if (palo === 'espadas') {
    g =
      `<path d="M0 -13.6L1.9 -11L1.7 3.6H-1.7L-1.9 -11Z" fill="${P.sky}" ${o}/>` +
      `<path d="M0 -12.4V3" stroke="${P.blue}" stroke-width=".7"/><path d="M-.9 -10.4V2.6" stroke="#fff" stroke-width=".6" opacity=".7"/>` +
      `<path d="M-6.4 3C-4.2 5 4.2 5 6.4 3C7.8 2.2 8.6 3.8 7.4 4.8C5 7 -5 7 -7.4 4.8C-8.6 3.8 -7.8 2.2 -6.4 3Z" fill="${P.gold}" ${o}/>` +
      `<path d="M-1.2 6.4H1.2V10.4H-1.2Z" fill="${P.red}" ${o}/>` +
      `<circle cy="11.6" r="1.8" fill="${P.gold}" ${o}/>`
  } else {
    const body = 'M-1.6 12.4C-2 6 -3.2 -.4 -4 -6.2C-4.6 -10.4 -3 -12.8 0 -12.8C3 -12.8 4.6 -10.4 4 -6.2C3.2 -.4 2 6 1.6 12.4Z'
    g =
      `<path d="M-3.4 -2.6L-7.6 -5.6" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M-3.4 -2.6L-7.6 -5.6" stroke="${P.brown}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="M2.6 3.4L6 1.6" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M2.6 3.4L6 1.6" stroke="${P.brown}" stroke-width="1.5" stroke-linecap="round"/>` +
      `<path d="${body}" fill="${P.brown}" ${o}/>` +
      `<path d="M1.4 -11.6C3.6 -8 3.2 0 1.2 11" fill="none" stroke="${P.brownD}" stroke-width="1.6" opacity=".7"/>` +
      `<path d="M-1.6 -9C-2.2 -6 -1.6 -3 -2 0M-.4 2C-.8 5 -.6 8 -.8 10" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` +
      `<path d="${ellipse(0, -11.4, 3, 1.1)}" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".5"/>` +
      `<path d="M2 -9.4C4.4 -12 7.4 -11.8 8.2 -10C6 -8.4 3.6 -8.4 2 -9.4Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".6"/>`
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${f(s * 100) / 100})">${g}</g>`
}

const CARD = roundRect(-6.4, -9.8, 6.4, 9.8, 1.2)
const PINTA: Record<Palo, number> = { oros: 0, copas: 1, espadas: 2, bastos: 3 }
const SPOTS: number[][][] = [
  [],
  [[0, 0]],
  [[0, -4.6], [0, 4.6]],
  [[0, -5.2], [0, 0], [0, 5.2]],
  [[-2.4, -4.4], [2.4, -4.4], [-2.4, 4.4], [2.4, 4.4]],
  [[-2.4, -4.8], [2.4, -4.8], [0, 0], [-2.4, 4.8], [2.4, 4.8]],
  [[-2.4, -4.8], [2.4, -4.8], [-2.4, 0], [2.4, 0], [-2.4, 4.8], [2.4, 4.8]],
  [[-2.4, -5.2], [2.4, -5.2], [0, -2.6], [-2.4, 0.2], [2.4, 0.2], [-2.4, 5.2], [2.4, 5.2]],
]
const PIP_R = [0, 4, 1.9, 1.7, 1.6, 1.5, 1.4, 1.3]
const PIP_K: Record<Palo, number> = { oros: 1, copas: 1.15, espadas: 1.05, bastos: 1.1 }

/** Naipe español centrado en (0,0) (12.8 × 19.6): marco con la pinta del palo, número en las esquinas y las figuras. */
function naipe(k: Kit, palo: Palo, n: number, t: string, w = 0.5): string {
  const g = PINTA[palo]
  const gaps = Array.from({ length: g }, (_, i) => {
    const x = -2 + ((i + 1) * 7.4) / (g + 1)
    return `M${f(x - 0.6)} -8.8H${f(x + 0.6)}M${f(-x - 0.6)} 8.8H${f(-x + 0.6)}`
  }).join('')
  const idx = (rot: number) =>
    `<g transform="rotate(${rot})"><path d="M-6.4 -9.8H-2.6V-5.2H-6.4Z" fill="${P.white}"/>` +
    `<text x="-4.5" y="-5.9" ${GEORGIA} font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">${n}</text></g>`
  const r = PIP_R[n] * PIP_K[palo]
  const tilt = palo === 'espadas' || palo === 'bastos'
  const pips = SPOTS[n].map(([x, y], i) => pip(palo, x, y, r, tilt && n > 1 ? (i % 2 ? 22 : -22) : 0)).join('')
  return (
    `<g transform="${t}">` +
    k.draw([{
      d: CARD, fill: P.white,
      inner:
        `<path d="${roundRect(-5.4, -8.8, 5.4, 8.8, 0.5)}" fill="none" stroke="${P.ink}" stroke-width=".3"/>` +
        (gaps ? `<path d="${gaps}" stroke="${P.white}" stroke-width=".9"/>` : '') +
        idx(0) + idx(180) + pips +
        k.sh('M1 -11H8V11H1Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3),
    }], w) +
    `</g>`
  )
}

/** Pieza de madera con la sombra a la derecha. */
const wood = (k: Kit, d: string, c = P.brown, dk = P.brownD) => ({ d, fill: c, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, dk, 0.4) })

export const CHINCHON_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Chinchones ─────────────────────────────────────────────────────

  // El primer chinchón: la escalera de pintor de siete peldaños, con el tarro lleno arriba y ni una gota afuera.
  'Escalera de pintor': (u) => {
    const k = kit(u)
    const xl = (y: number) => 42 + (90 - y) * 0.17
    const xr = (y: number) => 72.6 - (90 - y) * 0.1
    const railL = `M${f(xl(90) - 2.4)} 90H${f(xl(90) + 2.4)}L${f(xl(38) + 1.8)} 38H${f(xl(38) - 1.8)}Z`
    const railR = `M${f(xr(90) - 2.4)} 90H${f(xr(90) + 2.4)}L${f(xr(38) + 1.8)} 38H${f(xr(38) - 1.8)}Z`
    const back = 'M66.4 37L69.6 36.4L84 86.4L80.6 87.2Z'
    const steps = [44, 51, 58, 65, 72, 79, 86].map((y) => {
      const a = f(xl(y) + 1), b = f(xr(y) - 1)
      const top = `M${a} ${y}L${f(a + 1.4)} ${f(y - 1.8)}H${f(b + 1.4)}L${b} ${y}Z`
      const front = `M${a} ${y}H${b}V${f(y + 2.4)}H${a}Z`
      return k.draw([{ d: top, fill: P.goldL, inner: k.sh(top, 0, 0, 1, 0, 0, 0.6, P.goldD, 0.4) }, wood(k, front)], 0.45)
    }).join('')
    const capF = 'M47.6 32.6H70V38H47.6Z', capT = 'M47.6 32.6L50.2 30.6H72.6L70 32.6Z', capS = 'M70 32.6L72.6 30.6V36L70 38Z'
    const can = 'M53.6 24.6V30.8C53.6 33 64.4 33 64.4 30.8V24.6Z'
    return (
      k.day() +
      k.sun(60, 54, 18, 46, 28, false) +
      k.floor(62, 90.4, 26, 2.6) +
      k.draw([wood(k, back, P.brownD, P.night)], 0.55) +
      `<path d="M69.6 63L77.4 64.4" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M69.6 63L77.4 64.4" stroke="${P.white}" stroke-width=".6" stroke-linecap="round"/>` +
      steps +
      k.draw([wood(k, railL), wood(k, railR)], 0.6) +
      hair(xl(84), 84, xl(70) - 0.4, 70, xl(52), 52, 0.5, P.goldL) + hair(xr(84) - 0.6, 84, xr(70) - 1, 70, xr(52) - 0.6, 52, 0.45, P.goldL) +
      [44, 51, 58, 65, 72, 79, 86].map((y) => `<circle cx="${f(xl(y))}" cy="${y + 1.2}" r=".55" fill="${P.ink}"/><circle cx="${f(xr(y))}" cy="${y + 1.2}" r=".55" fill="${P.ink}"/>`).join('') +
      k.draw([wood(k, capF), { d: capT, fill: P.goldL, inner: k.sh(capT, 0, 0, 1, 0, 0, 0.5, P.goldD, 0.3) }, wood(k, capS, P.brownD, P.night)], 0.6) +
      k.draw([
        {
          d: can, fill: P.white, line: 0.35,
          inner:
            `<path d="M53.6 26.4C53.6 28 64.4 28 64.4 26.4V29.6C64.4 31.2 53.6 31.2 53.6 29.6Z" fill="${P.sky}"/>` +
            k.sh('M60 22H66V34H60Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M55.2 25.6V31" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>`,
        },
        { d: ellipse(59, 24.6, 5.4, 1.5), fill: P.white, inner: `<path d="${ellipse(59, 24.8, 4.4, 1)}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>` },
      ], 0.5) +
      pip('oros', 59, 28.8, 1.25) +
      `<path d="M54 25.6C53.8 20.6 64.2 20.6 64 25.6" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M57 24.6L71 26.6" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M57 24.6L71 26.6" stroke="${P.red}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<path d="M60.4 24.2L63.4 24.6L63 26.8L60 26.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(33, 44, 2.4) + sparkle(88, 68, 1.6) + sparkle(84, 36, 1.4) +
      k.defs()
    )
  },

  // Tres chinchones: la escalera ya se arma sola, de tiras perforadas de Mecano con sus tuercas, delante de una rueda dentada.
  'Escalera Mecano': (u) => {
    const k = kit(u)
    const R = 2.7
    const strip = (x: number, y: number, L: number, rot: number, n: number, c: string, dk: string) => {
      const d = roundRect(-R, -R, f(L + R), R, R)
      const holes = Array.from({ length: n }, (_, i) => {
        const hx = f((i * L) / (n - 1))
        return `<circle cx="${hx}" cy="0" r="1.1" fill="${P.night}"/><path d="M${f(hx - 0.8)} .6A1.1 1.1 0 0 0 ${f(hx + 0.8)} .6" fill="none" stroke="#fff" stroke-width=".4" opacity=".55"/>`
      }).join('')
      return `<g transform="translate(${x} ${y}) rotate(${rot})">` +
        k.draw([{
          d, fill: c,
          inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, dk, 0.45) + `<path d="M-.6 -1.9H${f(L + 0.6)}" stroke="#fff" stroke-width=".55" stroke-linecap="round" opacity=".55"/>` +
            `<path d="M-1 2.1H${f(L + 1)}" stroke="${dk}" stroke-width=".5" opacity=".7"/>` + holes,
        }], 0.55) +
        `</g>`
    }
    const nut = (x: number, y: number) =>
      `<path d="${starPath(x, y, 2.1, 2.1, 6, 0)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<circle cx="${x}" cy="${y}" r="1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/><path d="M${f(x - 0.7)} ${f(y + 0.5)}L${f(x + 0.7)} ${f(y - 0.5)}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M${f(x - 1.4)} ${f(y - 1.2)}L${f(x - 0.2)} ${f(y - 1.9)}" stroke="${P.goldL}" stroke-width=".45" stroke-linecap="round"/>`
    const N = 15, L = 58, y0 = 88, gap = L / (N - 1), xa = 45, xb = 75
    const rungYs = [1, 3, 5, 7, 9, 11, 13].map((j) => f(y0 - j * gap))
    const gear = (() => {
      let d = ''
      const n = 18, Ro = 32, Ri = 28.2
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a = (Math.PI * 2) / n
        const pts: [number, number][] = [[Ri, a0], [Ro, a0 + a * 0.14], [Ro, a0 + a * 0.44], [Ri, a0 + a * 0.58]]
        d += pts.map(([rr, aa], j) => `${i || j ? 'L' : 'M'}${f(60 + Math.cos(aa) * rr)} ${f(56 + Math.sin(aa) * rr)}`).join('')
      }
      return d + 'Z' + ellipse(60, 56, 22, 22)
    })()
    const bolts = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.26
      return `<circle cx="${f(60 + Math.cos(a) * 25)}" cy="${f(56 + Math.sin(a) * 25)}" r="1.2" fill="${P.sky2}" stroke="${P.blue}" stroke-width=".35"/>`
    }).join('')
    const spanner = 'M-8 -1.5H8C8.6 -2.8 9.6 -3.4 11 -3.4C12.6 -3.4 14 -2.8 14.8 -1.6L11.8 -1V1L14.8 1.6C14 2.8 12.6 3.4 11 3.4C9.6 3.4 8.6 2.8 8 1.5H-8C-8.6 2.8 -9.6 3.4 -11 3.4C-12.6 3.4 -14 2.8 -14.8 1.6L-11.8 1V-1L-14.8 -1.6C-14 -2.8 -12.6 -3.4 -11 -3.4C-9.6 -3.4 -8.6 -2.8 -8 -1.5Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<path d="${gear}" fill="${P.sky1}" fill-rule="evenodd" stroke="${P.blue}" stroke-width=".6" stroke-linejoin="round"/>` + k.shade(gear, k.rad(P.sky2, 0.4, 0.4, 0.7, 0, 1), '#9EB1DB', 0.5) + bolts +
      k.floor(61, 89.8, 22, 2.4) +
      strip(xa, y0, L, -90, N, P.red, P.wine) + strip(xb, y0, L, -90, N, P.red, P.wine) +
      rungYs.map((y) => strip(xa, y, xb - xa, 0, 8, P.green, P.greenD)).join('') +
      rungYs.map((y) => nut(xa, y) + nut(xb, y)).join('') +
      nut(xa, y0) + nut(xb, y0) + nut(xa, f(y0 - L)) + nut(xb, f(y0 - L)) +
      `<g transform="translate(60 94.4) rotate(-5) scale(.8)">` + k.draw([{ d: spanner, fill: P.white, inner: k.sh(spanner, 0, 0, 0, 1, 0, 0.9, P.blue, 0.4) + `<path d="M-7.6 -.6H7.6" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.6) + `</g>` +
      sparkle(88, 40, 2.2) + sparkle(32, 44, 1.6) +
      k.defs()
    )
  },

  // Ocho chinchones: la escalera de siete de oros, naipe sobre naipe, sube desde las nubes hasta la gloria.
  'Escalera al cielo': (u) => {
    const k = kit(u)
    const S = 1.1, pos = Array.from({ length: 7 }, (_, i) => [f(42 + i * 5), f(81.6 - i * 7)])
    const CLOUD = 'M-22 5C-27 5 -28 -1 -23.6 -2.6C-25 -8.4 -18 -11.6 -13.6 -8.2C-12.4 -14.6 -3.4 -16.4 -.4 -10.6C2.6 -14.8 10.6 -13.6 10.8 -7.4C15 -10 21.8 -6.8 20.4 -1.8C25 -1.4 26 5 21 5Z'
    const cloud = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})">` +
      k.draw([{
        d: CLOUD, fill: P.white,
        inner: k.sh(CLOUD, 0, 0, 1, 1, 0, 0.75, P.sky2, 0.45) + k.sh('M-30 0H30V6H-30Z', 0, 0, 0, 1, 0, 0.8, P.sky, 0.4) +
          hair(-21, -1.4, -17.6, -5.6, -12.6, -4.6, 0.6, P.sky2) + hair(-9, -8, -4.6, -12, 0, -9.6, 0.6, P.sky2) + hair(4, -6, 8.6, -9.6, 12.4, -6, 0.55, P.sky2) + hair(13, -1.6, 17, -4.2, 20.6, -1.2, 0.5, P.sky2) +
          `<path d="M-19.6 -5.6C-17 -9 -13 -9.6 -10.6 -8" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>`,
      }], 0.6 / s) +
      `</g>`
    const beams = [[-60, 26], [-36, 32], [-12, 30], [150, 28], [176, 34], [200, 26]].map(([a, L]) => {
      const r = (a * Math.PI) / 180
      return hair(73 + Math.cos(r) * 15, 38 + Math.sin(r) * 15, 73 + Math.cos(r) * (15 + L / 2), 38 + Math.sin(r) * (15 + L / 2), 73 + Math.cos(r) * (15 + L), 38 + Math.sin(r) * (15 + L), 1.1, P.white, 0.9)
    }).join('')
    return (
      `<rect width="120" height="130" fill="${P.sky}"/>` + k.shade('M0 0H120V130H0Z', k.rad(P.mid, 0.6, 0.3, 0.8, 0, 1), P.mid, 0.55) +
      k.sun(73, 38, 12, 52, 36, false) +
      k.shade(ellipse(73, 38, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.6) +
      beams +
      cloud(90, 70, 0.66) +
      k.shade(ellipse(72, 40, 15, 17), k.rad(P.white, 0.5, 0.5, 0.5, 0.95, 0), P.white, 0.6) +
      k.cast(pos.map(([x, y]) => `M${f(x - 7)} ${f(y - 10.8)}H${f(x + 7)}V${f(y + 10.8)}H${f(x - 7)}Z`), 2.2, 2) +
      // Del siete (el más alto, detrás) al as (adelante); el siete lleva filete dorado.
      pos.map(([x, y], i) => [x, y, i] as const).reverse().map(([x, y, i]) =>
        naipe(k, 'oros', i + 1, `translate(${x} ${y}) scale(${S})`, 0.5) +
        (i === 6 ? `<path d="${roundRect(f(x - 6.5), f(y - 10.2), f(x + 6.5), f(y + 10.2), 1)}" fill="none" stroke="${P.gold}" stroke-width=".7"/>` : '')).join('') +
      
      cloud(44, 100.6, 1.05) +
      sparkle(36, 40, 2.4) + sparkle(28, 62, 1.6) + sparkle(56, 28, 1.6) + sparkle(94, 56, 1.4) +
      k.defs()
    )
  },

  // ── Menos diez ─────────────────────────────────────────────────────

  // Tres menos diez: el cubito de hielo se apoya en la planilla, que ya tiene tres "−10" anotados.
  'Cubito de hielo': (u) => {
    const k = kit(u)
    const sheet = roundRect(37, 29, 77, 86, 1.6)
    const rows = Array.from({ length: 8 }, (_, i) => `<path d="M39 ${f(39.4 + i * 6)}H75" stroke="${P.sky2}" stroke-width=".55"/>`).join('') + `<path d="M57 35.4V86" stroke="${P.sky2}" stroke-width=".55"/>`
    const minus = [44, 50, 56].map((y) => `<text x="46.4" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.red}" text-anchor="middle">−10</text>`).join('')
    const scrib = ([[44, '12'], [50, '27']] as const).map(([y, n]) => `<text x="66" y="${y}" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.mid}" text-anchor="middle">${n}</text>`).join('')
    // Cubo isométrico: arista 17.
    const T = [60, 49], Rr = [74.7, 57.5], F = [60, 66], Ll = [45.3, 57.5], h = 17
    const top = `M${T[0]} ${T[1]}L${Rr[0]} ${Rr[1]}L${F[0]} ${F[1]}L${Ll[0]} ${Ll[1]}Z`
    const left = `M${Ll[0]} ${Ll[1]}L${F[0]} ${F[1]}V${F[1] + h}L${Ll[0]} ${Ll[1] + h}Z`
    const right = `M${F[0]} ${F[1]}L${Rr[0]} ${Rr[1]}V${Rr[1] + h}L${F[0]} ${F[1] + h}Z`
    const cube = top + left.replace('M', 'L') + right.replace('M', 'L')
    const puddle = 'M41 80C43 76.4 52 78 58 81C65 84 76 78.6 82 80C87.6 81.4 86 85.4 80.6 86.8C73 88.8 60 89.4 50 88.2C43 87.2 38.4 84 41 80Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<g transform="rotate(-7 56 54)">` +
      k.cast([sheet], 2.2, 2) +
      k.draw([{
        d: sheet, fill: P.white, line: 0.4,
        inner: `<path d="M35 27H79V35.4H35Z" fill="${P.sky}"/>` + rows + minus + scrib + k.sh('M64 27H79V88H64Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
          `<text x="57" y="33.2" ${GEORGIA} font-weight="700" font-size="4.6" letter-spacing=".4" fill="${P.ink}" text-anchor="middle">CHINCHÓN</text>`,
      }]) +
      `</g>` +
      `<g transform="translate(3 2)">` +
      k.draw([{ d: puddle, fill: P.sky1, inner: k.sh(puddle, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M46 82Q52 80 58 83" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }], 0.4) +
      k.cast([cube], 2.6, 1.6) +
      k.draw([
        { d: left, fill: P.sky, inner: k.sh(left, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + `<path d="M47 66L58 72M47 70L58 76" stroke="${P.sky1}" stroke-width=".5" opacity=".8"/>` },
        { d: right, fill: P.blue, inner: k.sh(right, 0, 0, 1, 1, 0.1, 0.9, P.mid, 0.45) + `<path d="M62 74L73 67.6M62 78L73 71.6" stroke="${P.sky}" stroke-width=".5" opacity=".8"/>` },
        { d: top, fill: P.sky1, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, P.sky, 0.4) },
      ], 0.7) +
      `<path d="M47.6 57.6L60 50.4L72.4 57.6" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M47 60V71" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      hair(52, 62, 55, 66, 53.6, 71, 0.6, '#fff') + hair(66, 68, 68.6, 66, 70, 70, 0.55, '#fff') + hair(56, 54, 60, 56.4, 64, 54.6, 0.5, P.sky) +
      [[50, 75, 0.7], [53, 69, 0.5], [68, 76, 0.6], [71, 64, 0.45], [64, 58, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".9"/>`).join('') +
      hair(78, 70, 82, 74, 80, 79, 0.6, P.white) + hair(41, 70, 37, 74, 39, 79, 0.6, P.white) +
      `</g>` +
      sparkle(86, 44, 2.6) + sparkle(36, 88, 1.6) + sparkle(76, 46, 1.4) +
      k.defs()
    )
  },

  // Quince menos diez: el pingüino de vino del bodegón, sudando de frío sobre el mantel a cuadros.
  'Pingüino de vino': (u) => {
    const k = kit(u)
    const jug = 'M60 27.6C65.4 27.6 69.4 31.4 69.4 36.6C69.4 40 68.6 42.6 67.8 44.6C75 49.6 80.8 58.4 80.8 70C80.8 78.4 78.4 84.6 74.6 89H47.4C43.6 84.6 41.4 78.4 41.6 70.6C41.8 60.6 46 52.4 51.6 47C50.6 45 50 42.6 50.4 39.6C50.8 32.6 54.6 27.6 60 27.6Z'
    const belly = 'M51.6 47C46 52.4 41.8 60.6 41.6 70.6C41.4 78.4 43.6 84.6 47.4 89H61C58 82 57 70 58.4 60C59 54 56.6 49 51.6 47Z'
    const beak = 'M51.4 33.8L38.4 36.2C37 36.6 37 38.6 38.4 39L51 41.8Z'
    const wing = 'M65.4 52C71.6 56 75 66 73 78.4C70 74 66.6 66 64.4 58Z'
    const glass = 'M27.6 66H39.6L38.4 85.6H28.8Z'
    // Mantel a cuadros en perspectiva (fuga arriba, al centro).
    const vy = -40, X = [-12, 0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132], Y = [78, 81, 84.8, 89.6, 95.6, 103, 112, 123]
    const at = (x: number, y: number) => f(60 + (x - 60) * ((y - vy) / (130 - vy)))
    let checks = ''
    for (let j = 0; j < Y.length - 1; j++) for (let i = 0; i < X.length - 1; i++) if ((i + j) % 2 === 0) {
      const a = Y[j], b = Y[j + 1]
      checks += `M${at(X[i], a)} ${a}L${at(X[i + 1], a)} ${a}L${at(X[i + 1], b)} ${b}L${at(X[i], b)} ${b}Z`
    }
    const drops = [[71, 60, 1], [76, 70, 0.8], [68, 80, 0.9], [74, 50, 0.7], [64, 36, 0.7]].map(([x, y, s]) =>
      `<path d="M${x} ${y - 1.8 * s}C${f(x - s)} ${f(y - 0.4 * s)} ${f(x - s)} ${f(y + s)} ${x} ${f(y + s)}C${f(x + s)} ${f(y + s)} ${f(x + s)} ${f(y - 0.4 * s)} ${x} ${y - 1.8 * s}Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    return (
      k.day() +
      k.stage(60, 52, 32) +
      `<path d="M0 78H120V130H0Z" fill="${P.white}"/><path d="${checks}" fill="${P.red}" opacity=".85"/>` + k.shade('M0 78H120V130H0Z', k.lin(P.wine, 0, 0, 0, 1, 0, 0.7), P.wine, 0.3) +
      `<path d="M0 78H120" stroke="${P.ink}" stroke-width=".8"/>` +
      k.floor(61, 89, 21, 2.6, P.wine) + k.floor(34, 86, 7, 1.4, P.wine) +
      `<path d="M68.4 44.2C80 38.6 88.6 49 81.2 60.6" fill="none" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/><path d="M68.4 44.2C80 38.6 88.6 49 81.2 60.6" fill="none" stroke="${P.night}" stroke-width="4" stroke-linecap="round"/><path d="M71 43.6C78 41.4 83 45 83.4 50" fill="none" stroke="${P.sky2}" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` +
      k.draw([
        {
          d: jug, fill: P.night,
          inner:
            `<path d="${belly}" fill="${P.white}"/>` + k.sh(belly, 0, 0, 1, 0, 0, 0.7, P.sky2, 0.4) +
            `<path d="${wing}" fill="${P.ink}"/><path d="M65.6 53C70 57 72.6 64 72.4 72" fill="none" stroke="${P.mid}" stroke-width=".8"/>` +
            k.sh('M66 26H84V92H66Z', 0, 0, 1, 0, 0, 0.8, '#0E1533', 0.4) + `<path d="M53 36C54 31.4 57 29.4 60 29.2" fill="none" stroke="${P.mid}" stroke-width="1.4" stroke-linecap="round"/>` +
            k.sh('M40 80H82V92H40Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3),
        },
        { d: beak, fill: P.gold, inner: k.sh(beak, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.4) + `<path d="M39 37.4L50.6 37.8" stroke="${P.goldD}" stroke-width=".5"/>` },
      ], 0.75) +
      `<path d="${ellipse(38.2, 37.6, 0.7, 1.2)}" fill="${P.wine}"/>` +
      `<circle cx="59.6" cy="36.4" r="2.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><circle cx="58.8" cy="36.6" r="1.3" fill="${P.ink}"/><circle cx="58.4" cy="36" r=".45" fill="#fff"/>` +
      `<path d="M47 88.6C47 86.2 53.4 86.2 53.4 88.6ZM54.6 88.8C54.6 86.6 60.6 86.6 60.6 88.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      drops +
      k.draw([{ d: glass, fill: P.sky1, inner: `<path d="M27 72H40V87H27Z" fill="${P.wine}"/><path d="M27 72H40V74H27Z" fill="${P.red}"/>` + k.sh(glass, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + `<path d="M30 68V83" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` }], 0.5) +
      hair(86, 40, 89, 34, 86, 28, 0.6, P.white) + hair(34, 52, 31, 46, 34.4, 40, 0.6, P.white) +
      sparkle(88, 66, 2) + sparkle(32, 30, 1.6) +
      k.defs()
    )
  },

  // Cuarenta menos diez: la planilla vive en la Base Marambio, con la bandera al viento delante del sol de Mayo.
  'Base Marambio': (u) => {
    const k = kit(u)
    const peaks = 'M14 77L30 55L38 62L50 47L60 58L74 45L86 57L106 77Z'
    const caps = 'M30 55L34.4 60.4L31 59.4L27.6 61ZM50 47L55 53.4L51.4 52L48 54.8L45.6 53ZM74 45L79 51.6L75.4 50.4L71.6 52.6L69.6 50.4Z'
    const ground = 'M8 77C30 73 46 80 66 76C84 73 100 76 112 75V130H8Z'
    const front = 'M36 60H70V82H36Z'
    const side = 'M70 60L84 54V76L70 82Z'
    const snow =
      'M34.2 60.6C33.8 57.6 35.6 56.2 37.6 55.8L50 52.2H84.8C86.4 52.6 86.2 54.6 84.8 55.2L71.6 61.4C68.6 62.6 66.6 60.8 64.4 62C61.6 63.4 58.6 61.2 55.6 62.4' +
      'C52.6 63.6 49.6 61.4 46.6 62.6C43.6 63.8 40.6 61.8 37.6 62.8C35.8 63.2 34.4 62.2 34.2 60.6Z'
    const icicles = [39, 43, 47.6, 52, 56.6, 61, 65.4, 69].map((x, i) => `M${f(x - 0.9)} 62.4L${x} ${f(65.2 + (i % 3) * 1.3)}L${f(x + 0.9)} 62.4Z`).join('')
    const door = 'M50.4 66.4H57.6V82H50.4Z'
    const win = (x: number, y: number) => {
      const d = `M${x} ${y}H${f(x + 7.6)}V${f(y + 6.6)}H${x}Z`
      return k.draw([{
        d, fill: P.goldL,
        inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.gold, 0.4) + `<path d="M${f(x + 3.8)} ${y}V${f(y + 6.6)}M${x} ${f(y + 3.3)}H${f(x + 7.6)}" stroke="${P.white}" stroke-width=".8"/>` +
          hair(x + 0.3, y + 6.3, x + 1.6, y + 4.6, x + 3.2, y + 6.3, 0.6, P.white) + hair(x + 4.4, y + 0.3, x + 6, y + 1.8, x + 7.4, y + 0.3, 0.5, P.white),
      }], 0.5)
    }
    const ribs = Array.from({ length: 14 }, (_, i) => `M${f(37.2 + i * 2.4)} 63V82`).join('')
    const sideRibs = Array.from({ length: 5 }, (_, i) => {
      const x = 72.4 + i * 2.4, top = 60 - ((x - 70) * 6) / 14
      return `M${f(x)} ${f(top + 2)}V${f(top + 22)}`
    }).join('')
    const flag = 'M42.6 30.4C47 28.8 52 32 58 30.4V40.4C52 42 47 38.8 42.6 40.4Z'
    const sun = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return `M${f(50.4 + Math.cos(a) * 1.3)} ${f(35.4 + Math.sin(a) * 1.3)}L${f(50.4 + Math.cos(a) * 2.2)} ${f(35.4 + Math.sin(a) * 2.2)}`
    }).join('')
    return (
      k.day() +
      k.sun(60, 47, 15, 45) +
      k.draw([{ d: peaks, fill: P.sky1, inner: k.sh(peaks, 0, 0, 1, 0, 0.1, 0.85, P.sky2, 0.45) + `<path d="${caps}" fill="${P.white}"/>` + hair(50, 48, 47, 56, 44, 64, 0.5, P.sky2) + hair(74, 46, 77, 54, 80, 62, 0.5, P.blue) + hair(30, 56, 27, 64, 24, 72, 0.45, P.sky2) }], 0.5) +
      k.draw([{
        d: ground, fill: P.white,
        inner: k.sh(ground, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.4) + hair(18, 86, 30, 83, 42, 86, 0.6, P.sky2) + hair(72, 89, 86, 86, 100, 88, 0.6, P.sky2) + hair(26, 92, 40, 90, 52, 93, 0.5, P.sky2) + hair(64, 95, 76, 93, 88, 95, 0.5, P.sky2),
      }], 0.5) +
      k.floor(62, 83, 28, 2.4) +
      `<path d="M38 82V84.6M47 82V84.6M61 82V84.6M68.6 82V84.6M82.4 76.4V79" stroke="${P.ink}" stroke-width="1.5"/>` +
      `<path d="M78 54.6L79.6 33.4L81.2 54" fill="none" stroke="${P.ink}" stroke-width=".7"/><path d="M78.4 50L80.8 46L78.7 42L80.6 38" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M76.4 35H82.8" stroke="${P.ink}" stroke-width=".6"/><path d="${ellipse(76.4, 35.6, 0.9, 0.7)}${ellipse(82.8, 35.6, 0.9, 0.7)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="79.6" cy="32.6" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([
        { d: side, fill: P.wine, inner: `<path d="${sideRibs}" stroke="${P.night}" stroke-width=".5" opacity=".7"/>` + k.sh(side, 0, 0, 1, 0, 0, 0.7, P.night, 0.35) },
        { d: front, fill: P.red, line: 0.35, inner: `<path d="${ribs}" stroke="${P.wine}" stroke-width=".55"/>` + k.sh(front, 0, 0, 1, 1, 0, 0.6, P.wine, 0.4) + `<path d="M36 79H70V82H36Z" fill="${P.wine}"/>` },
      ], 0.75) +
      `<circle cx="77" cy="66" r="2.4" fill="${P.goldL}" stroke="${P.white}" stroke-width=".8"/><circle cx="77" cy="66" r="2.4" fill="none" stroke="${P.ink}" stroke-width=".3"/>` +
      win(39.4, 66.4) + win(60.8, 66.4) +
      k.draw([{ d: door, fill: P.wine, inner: k.sh(door, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<circle cx="54" cy="70.4" r="1.8" fill="${P.goldL}" stroke="${P.white}" stroke-width=".6"/>` + `<path d="M50.4 75H57.6" stroke="${P.night}" stroke-width=".4"/>` }], 0.5) +
      `<circle cx="56.2" cy="75.4" r=".5" fill="${P.gold}"/><path d="M48.6 82H59.4V84H48.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M42 57V29.6" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M42 57V29.6" stroke="${P.white}" stroke-width=".7"/><circle cx="42" cy="29" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{
        d: flag, fill: P.white,
        inner: `<path d="M42 30.4C47 28.8 52 32 58.6 30.4V33.8C52 35.4 47 32.2 42 33.8ZM42 37C47 35.4 52 38.6 58.6 37V41C52 42.6 47 39.4 42 41Z" fill="${P.sky}"/>` +
          k.sh(flag, 0, 0, 1, 0, 0, 0.45, P.blue, 0.3) + hair(47, 29.8, 47.6, 35, 47, 40, 0.5, P.blue, 0.6) + hair(53.4, 31.6, 54, 36, 53.4, 41.2, 0.5, P.blue, 0.6),
      }], 0.45) +
      `<path d="${sun}" stroke="${P.goldD}" stroke-width=".35"/><circle cx="50.4" cy="35.4" r="1.2" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>` +
      k.draw([{ d: snow, fill: P.white, inner: k.sh(snow, 0, 0, 0, 1, 0, 0.8, P.sky2, 0.4) + `<path d="M38 57.4L50.4 53.6H82" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }], 0.55) +
      `<path d="${icicles}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/>` +
      [[28, 44], [92, 46], [88, 36], [25, 66], [95, 66]].map(([x, y], i) => sparkle(x, y, i % 2 ? 1.3 : 1.9, P.white)).join('') +
      k.defs()
    )
  },

  // ── Cortador serial ────────────────────────────────────────────────

  // Diez cortes: la tijerita de punta redonda, de las del colegio, entra al naipe por la línea punteada.
  'Tijerita escolar': (u) => {
    const k = kit(u)
    const blade = 'M4 -2.1L-21 -1.5A1.6 1.6 0 0 0 -21 1.7L4 2Z'
    const hole = (cx: number, cy: number, rx: number, ry: number) => `M${f(cx - rx)} ${cy}A${rx} ${ry} 0 1 1 ${f(cx + rx)} ${cy}A${rx} ${ry} 0 1 1 ${f(cx - rx)} ${cy}Z`
    const ring = (cy: number) => ellipse(13, cy, 5.8, 4.6) + hole(13.4, cy, 3.4, 2.4)
    const shank = (s: number) => taper(0, 0, 5, s * 1.6, 9.4, s * 4.8, 4, 3.4)
    const plastic = (d: string) => ({ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` })
    const steel = (t: string) => ({
      d: blade, t, fill: P.white, line: 0.3,
      inner: k.sh('M-24 0H6V4H-24Z', 0, 0, 0, 1, 0.1, 0.9, P.blue, 0.45) + `<path d="M2 -1.3L-19.6 -.8" stroke="#fff" stroke-width=".6" stroke-linecap="round"/><path d="M2 .9L-19 .9" stroke="${P.sky2}" stroke-width=".4"/>`,
    })
    const sc = 'translate(71 70) rotate(37) scale(1.15)'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<g transform="translate(45 51) rotate(-14)">` + k.cast([roundRect(-10.9, -16.7, 10.9, 16.7, 2)], 2.4, 2.2) + `</g>` +
      naipe(k, 'oros', 1, 'translate(45 51) rotate(-14) scale(1.7)', 0.3) +
      `<g transform="${sc}"><path d="M-14.4 0H-40.6" stroke="${P.ink}" stroke-width=".65" stroke-dasharray="1.6 1.2"/><path d="M-10.4 0H-14.6" stroke="${P.ink}" stroke-width="1"/></g>` +
      `<g transform="${sc}">` +
      `<g transform="rotate(-16)">${k.cast([blade], 1.4, 1.4)}</g><g transform="rotate(16)">${k.cast([blade], 1.4, 1.4)}</g>` +
      k.draw([steel('rotate(-16)'), steel('rotate(16)')], 0.5) +
      k.draw([plastic(shank(1)), plastic(shank(-1)), plastic(ring(7)), plastic(ring(-7))], 0.55) +
      hair(9.4, -9.6, 12, -11.2, 15.6, -11, 0.6, '#fff') + hair(9.4, 4.4, 12, 2.8, 15.6, 3, 0.5, '#fff') +
      `<circle cx="0" cy="0" r="2.1" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/><path d="M-1.3 -.6L1.3 .6" stroke="${P.ink}" stroke-width=".55"/>` +
      `</g>` +
      sparkle(84, 38, 2.4) + sparkle(36, 86, 1.6) +
      k.defs()
    )
  },

  // Cuarenta cortes: el poste de la peluquería del barrio, y la radio que habla de fútbol de fondo.
  'Peluquero de barrio': (u) => {
    const k = kit(u)
    const glass = roundRect(46, 36, 66, 80, 1)
    let bands = ''
    for (let j = -4; j < 14; j++) {
      const y = 30 + j * 7, c = [P.red, P.sky][((j % 2) + 2) % 2]
      bands += `<path d="M45 ${y}L67 ${y - 13}V${y - 9.6}L45 ${y + 3.4}Z" fill="${c}"/>`
    }
    const capTop = 'M43.6 31H68.4V36.4H43.6Z', dome = 'M47 31C47 24.4 65 24.4 65 31Z', capBot = 'M43.6 80H68.4V85H43.6Z', foot = 'M46 85H66L64 90H48Z'
    const gold = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` })
    const radio = roundRect(71, 72, 92, 88, 2.4)
    const bubble = 'M73 35C73 29.6 78 27 83.6 27C89.2 27 93 30 93 35C93 40 89.2 43 85.6 43L83 48.6L81.4 42.8C76.4 42.4 73 39.6 73 35Z'
    const ball = ellipse(83.2, 35, 4.6, 4.6)
    const patch = Array.from({ length: 5 }, (_, i) => {
      const a = ((-54 + i * 72) * Math.PI) / 180
      return `<path d="${starPath(83.2 + Math.cos(a) * 4.9, 35 + Math.sin(a) * 4.9, 1.7, 1.7, 5, (a * 180) / Math.PI + 180)}" fill="${P.ink}"/>` +
        `<path d="M${f(83.2 + Math.cos(a) * 1.5)} ${f(35 + Math.sin(a) * 1.5)}L${f(83.2 + Math.cos(a) * 3.3)} ${f(35 + Math.sin(a) * 3.3)}" stroke="${P.ink}" stroke-width=".35"/>`
    }).join('')
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(57, 90.4, 13, 2) + k.floor(82, 88.6, 12, 1.8) +
      k.draw([{ d: glass, fill: P.white, inner: bands + k.sh(glass, 0, 0, 1, 0, 0.05, 0.85, P.night, 0.45) + `<path d="M45 36H51V80H45Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` }], 0.7) +
      `<path d="M49.8 38V78" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"/><path d="M62.8 38V78" stroke="${P.sky2}" stroke-width=".5" opacity=".6"/>` +
      k.draw([gold(dome), gold(capTop), gold(capBot), gold(foot)], 0.7) +
      `<circle cx="56" cy="23.2" r="2.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><circle cx="55.4" cy="22.6" r=".6" fill="#fff"/>` +
      `<path d="M43.6 33.6H68.4M43.6 82.6H68.4" stroke="${P.goldD}" stroke-width=".6"/><path d="M50 27.4C52 26 56 25.6 58 26" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` +
      `<path d="M89 72L94.4 55" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M89 72L94.4 55" stroke="${P.white}" stroke-width=".45" stroke-linecap="round"/><circle cx="94.4" cy="55" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M74.6 72C74.6 67 88.4 67 88.4 72" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="M74.6 72C74.6 67 88.4 67 88.4 72" fill="none" stroke="${P.brownD}" stroke-width="1"/>` +
      k.draw([{
        d: radio, fill: P.brown,
        inner: k.sh(radio, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<rect x="73" y="74.6" width="11" height="11" rx="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
          Array.from({ length: 16 }, (_, i) => `<circle cx="${f(74.8 + (i % 4) * 2.4)}" cy="${f(76.4 + Math.floor(i / 4) * 2.4)}" r=".55" fill="${P.brownD}"/>`).join('') +
          `<circle cx="88.2" cy="78" r="2.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M88.2 78L89.4 76.4" stroke="${P.ink}" stroke-width=".4"/><rect x="86" y="82.4" width="4.4" height="2.4" rx=".4" fill="${P.night}"/>` +
          `<path d="M72 73.6V86.6" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` + hair(72.4, 87.2, 82, 88, 91, 87, 0.5, P.brownD),
      }], 0.6) +
      k.draw([{ d: bubble, fill: P.white, inner: k.sh(bubble, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.5) +
      k.draw([{ d: ball, fill: P.white, inner: patch + `<path d="${starPath(83.2, 35, 1.7, 1.7, 5)}" fill="${P.ink}"/>` + k.sh(ball, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.45) +
      `<ellipse cx="81.6" cy="33" rx="1.3" ry=".8" fill="#fff" opacity=".8" transform="rotate(-35 81.6 33)"/>` +
      sparkle(34, 40, 2.2) + sparkle(30, 70, 1.4) +
      k.defs()
    )
  },

  // Ciento veinte cortes: la motosierra parte el ancho de espadas al medio; no queda nada para juntar.
  'Motosierra': (u) => {
    const k = kit(u)
    const body = 'M-16 -8C-16 -11.4 -13.4 -13.4 -9.4 -13.4H5C9 -13.4 11 -10.4 11 -6.4V7C11 10 9 11.6 6 11.6H-12.4C-15 11.6 -16 9.6 -16 7Z'
    const cover = 'M-13 -9.8H1.6C3 -9.8 3.8 -9 3.8 -7.6V5.8C3.8 7.2 3 8 1.6 8H-13Z'
    const bar = 'M8 -4.4H40A4.4 4.4 0 0 1 40 4.4H8Z'
    const guard = 'M9.6 -17.4L13.8 -23.4L16.6 -22L13.2 -12.8Z'
    const sprocket = 'M5.6 -6.4H12.4C13.4 -6.4 14 -5.8 14 -4.8V4.8C14 5.8 13.4 6.4 12.4 6.4H5.6Z'
    const handle = (d: string) =>
      `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.night}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${P.mid}" stroke-width=".7" stroke-linecap="round" stroke-dasharray=".5 1.1" transform="translate(-.5 -.5)"/>`
    const teeth = Array.from({ length: 17 }, (_, i) => {
      const x = 9.6 + i * 1.8
      return `M${f(x)} -4.5L${f(x + 1)} -6.1L${f(x + 1.6)} -4.5M${f(x)} 4.5L${f(x + 1)} 6.1L${f(x + 1.6)} 4.5`
    }).join('')
    const nose = Array.from({ length: 7 }, (_, i) => {
      const a = (-90 + i * 30) * (Math.PI / 180)
      return `M${f(40 + Math.cos(a) * 4.5)} ${f(Math.sin(a) * 4.5)}L${f(40 + Math.cos(a + 0.18) * 6)} ${f(Math.sin(a + 0.18) * 6)}`
    }).join('')
    const fins = [-6.6, -3.8, -1, 1.8, 4.6].map((y) => `<path d="M-11 ${y}H1.8" stroke="${P.night}" stroke-width="1.1" stroke-linecap="round"/><path d="M-11 ${f(y - 0.6)}H1.8" stroke="${P.red}" stroke-width=".5" stroke-linecap="round"/>`).join('')
    // El naipe partido: cada mitad recortada a su lado del corte, separadas por la espada de la motosierra.
    const half = (top: boolean) =>
      k.clip(top ? 'M-8 -11H8V0H-8Z' : 'M-8 0H8V11H-8Z', naipe(k, 'espadas', 1, 'scale(1)', 0.45)) +
      `<path d="M-6.4 0L-5.4 ${top ? -0.6 : 0.6}L-4.2 0L-3 ${top ? -0.7 : 0.7}L-1.8 0L-.6 ${top ? -0.5 : 0.5}L.6 0L1.8 ${top ? -0.7 : 0.7}L3 0L4.2 ${top ? -0.6 : 0.6}L5.4 0L6.4 ${top ? -0.4 : 0.4}" fill="none" stroke="${P.ink}" stroke-width=".3" stroke-linejoin="round"/>`
    const bits = [[86, 36, 20], [93, 46, -30], [95, 64, 40], [66, 32, -50], [90, 72, 15]].map(([x, y, r]) => `<rect x="${x - 1.3}" y="${y - 0.8}" width="2.6" height="1.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.sun(64, 50, 14, 48, 32, false) +
      k.shade(ellipse(76, 48, 18, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.5) +
      `<g transform="translate(76 50) rotate(-30)">` +
      `<g transform="translate(-1.4 -5.2) rotate(-7) scale(1.42)">${half(true)}</g>` +
      `<g transform="translate(1.8 5.4) rotate(6) scale(1.42)">${half(false)}</g>` +
      `</g>` +
      bits + hair(88, 40, 91, 38, 94, 34, 0.6) + hair(90, 56, 93, 56, 96, 54, 0.6) +
      `<g transform="translate(52.5 63) rotate(-30)">` +
      k.cast([body, bar], 2.4, 2.4) +
      handle('M-16 -3H-22.6C-27 -3 -27 7 -22.6 7H-16') +
      k.draw([
        { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) + `<path d="M14 -.2H40" stroke="${P.sky2}" stroke-width="1.3"/><path d="M14 -1.6H38" stroke="#fff" stroke-width=".6"/>` + [16, 20, 24].map((x) => `<circle cx="${x}" cy="2.2" r=".6" fill="${P.sky2}" stroke="${P.blue}" stroke-width=".25"/>`).join('') + `<circle cx="40" cy="0" r="2.6" fill="none" stroke="${P.blue}" stroke-width=".6"/><circle cx="40" cy="0" r=".9" fill="${P.blue}"/>` },
        { d: body, fill: P.red, line: 0.4, inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) + `<path d="M-15 -12.4H-1V-10.6H-15Z" fill="#fff" opacity=".3"/>` },
        { d: cover, fill: P.wine, inner: fins + k.sh(cover, 0, 0, 1, 1, 0, 0.6, P.night, 0.35) },
        { d: sprocket, fill: P.night, inner: `<circle cx="9.6" cy="0" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M6.6 -5.4H12.6" stroke="${P.mid}" stroke-width=".6"/>` },
      ], 0.75) +
      `<path d="${teeth}${nose}" fill="none" stroke="${P.ink}" stroke-width=".65" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M-13.8 -13.4C-13.8 -16.2 -10.4 -16.2 -10.4 -13.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M-13.8 -13.4C-13.8 -16.2 -10.4 -16.2 -10.4 -13.4" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      handle('M-8 -13.4C-8 -23 3 -24.6 9 -18L11 -12.4') +
      k.draw([{ d: guard, fill: P.night, inner: `<path d="M10.6 -16.6L13.8 -21.6" stroke="${P.mid}" stroke-width=".7"/>` }], 0.55) +
      [[-14, 9.4], [6.8, 9.4], [6.8, -11.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `</g>` +
      hair(28, 54, 25, 58, 26, 63, 0.6) + hair(33, 50, 30, 54, 31, 59, 0.5) +
      sparkle(36, 36, 2.4) + sparkle(56, 92, 1.6) +
      k.defs()
    )
  },

  // ── Reenganchado ───────────────────────────────────────────────────

  // Te pasaste y volviste: la rodilla raspada con su curita en cruz, de zapatilla de lona y soquete.
  'Curita en la rodilla': (u) => {
    const k = kit(u)
    const BAND = '#E3B489'
    const leg = 'M48 32C58 36 68 41 76 46C82 50 84 58 81 64C77 71 70 78 66 84L56 82C54 76 56 68 62 63C58 60 52 56 46 54Z'
    const shorts = 'M33 34C37 30 45 28.6 51 30.4L56.4 32.4L50.8 58.4C44 59.6 37.4 58.6 33 55.4C30.8 49.4 31 40 33 34Z'
    const hem = 'M52 30.6L56.6 32.6L51 58.4L46.6 58.8Z'
    const sock = 'M54.4 75.6C58 77.4 64 79 68.4 78.4L66.4 88.6H55.2Z'
    const shoe = 'M50 86C52 84 60 84.4 66 86.4C71 88 75.6 88.6 77 91C78 93.4 76 95 72 95H52C49.4 95 48.6 92 49 89Z'
    const strip = roundRect(-8, -2.5, 8, 2.5, 2.5)
    const curita = (r: number) =>
      `<g transform="translate(77 55) rotate(${r})">` +
      k.draw([{
        d: strip, fill: BAND,
        inner: k.sh(strip, 0, 0, 0, 1, 0, 0.7, P.brown, 0.4) + `<rect x="-3" y="-2.5" width="6" height="5" fill="${P.paper}"/><rect x="-3" y="-2.5" width="6" height="5" fill="none" stroke="${P.brown}" stroke-width=".25"/>` +
          [-6, -4.6, 4.6, 6].map((x) => `<circle cx="${x}" cy="-.9" r=".3" fill="${P.brown}"/><circle cx="${x}" cy=".9" r=".3" fill="${P.brown}"/>`).join(''),
      }], 0.45) +
      `</g>`
    return (
      k.day() +
      k.stage(58, 58, 34) +
      k.floor(63, 95, 15, 2) +
      k.draw([
        { d: leg, fill: P.skin, inner: k.sh(leg, 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + k.sh('M40 50H90V70H40Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) + `<path d="M52 35C60 38.6 68 42.4 74 46" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>` },
        { d: sock, fill: P.white, inner: `<path d="M54 78.6L68 81.2V83L54 80.4Z" fill="${P.sky}"/><path d="M54 81.6L68 84.2V85.4L54 82.8Z" fill="${P.mid}"/>` + k.sh(sock, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) },
        { d: shoe, fill: P.mid, inner: k.sh(shoe, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<path d="M48 92H79V96H48Z" fill="${P.white}"/><path d="M48 92H79" stroke="${P.ink}" stroke-width=".4"/><path d="M68 87C72 88 76 89 77 91.6L70 92Z" fill="${P.white}"/>` + `<path d="M58 85.6L60.6 88M61 85.8L63.4 88.4M64 86.2L66 88.6" stroke="${P.white}" stroke-width=".6"/>` },
        {
          d: shorts, fill: P.mid, line: 0.35,
          inner: k.sh(shorts, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<path d="${hem}" fill="${P.night}"/><path d="M50.8 30L46 58.6" stroke="${P.white}" stroke-width=".5" stroke-dasharray="1 .8"/>` +
            hair(37, 37, 42, 41, 45, 48, 0.6, P.night) + hair(38, 53, 42, 51, 46, 53, 0.5, P.night) + `<path d="M35.6 35C40 31.6 45 30.6 49.6 31.6" fill="none" stroke="${P.sky}" stroke-width="1" stroke-linecap="round" opacity=".7"/>`,
        },
      ], 0.75) +
      hair(66, 66, 63.6, 62, 64, 58, 0.6, P.blue) + hair(74, 64, 72, 70, 68, 76, 0.5, P.blue) +
      hair(70, 49.4, 72, 50.6, 73.4, 50, 0.5, P.red) + hair(81.4, 59.6, 82, 61.4, 81, 62.4, 0.5, P.red) + hair(71, 60.6, 72.2, 62, 73.6, 62, 0.45, P.red) +
      curita(38) + curita(-38) +
      sparkle(36, 76, 2) + sparkle(86, 36, 2.2) +
      k.defs()
    )
  },

  // Cuatro reenganches: el yeso firmado por todos, y la mano igual sostiene la escalera de copas.
  'Yeso firmado': (u) => {
    const k = kit(u)
    const cast = taper(28, 108, 38, 89, 52, 73, 22, 18.4)
    const cuff = 'M-9.4 -2.6C-3 -4.6 3 -4.6 9.4 -2.6L9 1.6C3 -.4 -3 -.4 -9 1.6Z'
    const palm = 'M46.6 70C45 63.4 49 58 55.4 57C62 56 68.8 58 70.4 63.4C71.8 68.4 67.8 73.4 61.6 75C55.6 76.6 48.6 75 46.6 70Z'
    const thumb = taper(48.4, 71.6, 50.4, 62.6, 62.6, 56.8, 7.4, 5.6)
    const fan = [[4, -36], [5, -12], [6, 12], [7, 36]].map(([n, a]) => naipe(k, 'copas', n, `translate(60 63) rotate(${a}) translate(0 -13.6) scale(1.12)`, 0.45)).join('')
    const heart = 'M0 1.6C-3.4 -.6 -3.4 -3.6 -1.4 -3.6C-.6 -3.6 -.1 -3 0 -2.4C.1 -3 .6 -3.6 1.4 -3.6C3.4 -3.6 3.4 -.6 0 1.6Z'
    return (
      k.day() +
      k.sun(60, 54, 17, 46, 28, false) +
      k.cast([cast], 2.4, 2) +
      k.draw([{
        d: cast, fill: P.white,
        inner: k.sh(cast, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M31 92C34.6 85 39.6 79.6 45 74.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>` +
          hair(40, 100, 47, 90, 55, 82, 0.5, P.sky2) + hair(30, 96, 36, 88, 43, 80, 0.4, P.sky2) +
          hair(49, 77.6, 51, 74.4, 53, 76.6, 0.55, P.red) + hair(53, 76.6, 54.4, 73.4, 56.6, 74.4, 0.5, P.red) +
          hair(37.4, 88.6, 39, 85, 41.4, 87.4, 0.55, P.mid) + hair(41.4, 87.4, 42.6, 84, 45, 85, 0.5, P.mid),
      }], 0.85) +
      `<g transform="translate(50 86.4) rotate(-28)">` + k.draw([{ d: heart, fill: P.red, inner: k.sh(heart, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) }], 0.3) + `</g>` +
      `<path d="${starPath(40.2, 78.8, 2.3, 1, 5, -80)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="0" y="0" ${GEORGIA} font-style="italic" font-size="4" fill="${P.ink}" text-anchor="middle" transform="translate(45.2 82.4) rotate(-52)">¡Fuerza!</text>` +
      `<g transform="translate(52.6 73.4) rotate(42)">` + k.draw([{ d: cuff, fill: P.paper, inner: [-6.6, -3.3, 0, 3.3, 6.6].map((x) => hair(x, -3, x - 0.3, -1.2, x, 0.6, 0.45, P.sky2)).join('') + k.sh(cuff, 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) }], 0.55) + `</g>` +
      k.draw([{ d: palm, fill: P.skin, inner: k.sh(palm, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.6) +
      fan +
      k.draw([{
        d: thumb, fill: P.skin,
        inner: k.sh(thumb, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M48 66C50 60.6 56 58 61 56.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".6"/>` +
          `<path d="${ellipse(61.4, 57.4, 2.1, 1.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" transform="rotate(-28 61.4 57.4)"/>` + hair(53.4, 64.6, 54.6, 62.6, 56.4, 61.4, 0.45, P.blue),
      }], 0.6) +
      sparkle(86, 34, 2.4) + sparkle(30, 46, 1.8) +
      k.defs()
    )
  },

  // Doce reenganches: el rey (el doce) envuelto en vendas como una momia, que igual sigue andando bajo la luna y deja la venda arrastrando.
  'Momia andante': (u) => {
    const k = kit(u)
    const moon = ellipse(40, 42, 13, 13)
    const crown = 'M-2.9 -5.6L-3.3 -8.6L-1.6 -7.2L0 -9.3L1.6 -7.2L3.3 -8.6L2.9 -5.6Z'
    const idx = (rot: number) => `<g transform="rotate(${rot})"><text x="-4.1" y="-6" ${GEORGIA} font-weight="700" font-size="3" letter-spacing="-.2" fill="${P.ink}" text-anchor="middle">12</text></g>`
    // Vendas: [y, giro, alto, desde x, hasta x, comba]. Pasan por detrás del canto (la punta más oscura) y se cruzan.
    const B: [number, number, number, number, number, number][] = [
      [-4.9, -6, 1.8, -7.1, 7.2, 0.3], [-1.4, 5, 2.2, -7.2, 7.1, -0.3], [1.5, -8, 2, -7.1, 7.2, 0.4], [4.5, 6, 2.2, -7.2, 5, -0.3], [7.6, -4, 2, -7.1, 1.6, 0.3],
    ]
    const bands = B.map(([y, a, h, x0, x1, bend]) => {
      const t = f(-h / 2), b = f(h / 2)
      const d = `M${x0} ${t}Q0 ${f(-h / 2 + bend)} ${x1} ${t}L${x1} ${b}Q0 ${f(h / 2 + bend)} ${x0} ${b}Z`
      const gauze = `M${x0} ${f(-h * 0.12)}Q0 ${f(-h * 0.12 + bend)} ${x1} ${f(-h * 0.12)}M${x0} ${f(h * 0.2)}Q0 ${f(h * 0.2 + bend)} ${x1} ${f(h * 0.2)}`
      const ends = `M${x0} ${t}H${f(x0 + 0.7)}V${b}H${x0}ZM${x1} ${t}H${f(x1 - 0.7)}V${b}H${x1}Z`
      return `<g transform="translate(0 ${y}) rotate(${a})">` +
        `<path d="${d}" fill="${P.night}" opacity=".3" transform="translate(.25 .45)"/>` +
        k.draw([{
          d, fill: P.paper,
          inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, P.sky2, 0.5) + `<path d="${ends}" fill="${P.sky2}" opacity=".8"/>` +
            `<path d="${gauze}" fill="none" stroke="${P.sky2}" stroke-width=".12" stroke-dasharray=".45 .3"/>` +
            `<path d="M${x0} ${f(-h / 2 + 0.3)}Q0 ${f(-h / 2 + 0.3 + bend)} ${x1} ${f(-h / 2 + 0.3)}" fill="none" stroke="#fff" stroke-width=".28"/>`,
        }], 0.15) +
        `</g>`
    }).join('')
    const tail = taper(52.6, 80.4, 40, 86.6, 27, 84.6, 2.6, 1.6)
    const fray = (x: number, y: number, a: number) => [-0.8, 0, 0.8].map((o) => {
      const r = (a * Math.PI) / 180, px = -Math.sin(r) * o, py = Math.cos(r) * o
      return hair(x + px, y + py, x + px + Math.cos(r) * 1.6, y + py + Math.sin(r) * 1.6 + o * 0.4, x + px + Math.cos(r) * 3, y + py + Math.sin(r) * 3 + o * 0.8, 0.4, P.paper)
    }).join('')
    return (
      k.night() +
      [[30, 62], [92, 30], [26, 74], [95, 66], [62, 24], [80, 22], [86, 40], [70, 34]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(40, 42, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.45, 0), P.goldL, 0.3) +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.9), P.goldL, 0.35) +
      [[36, 37, 2.6], [45.6, 45.6, 1.8], [38, 49, 1.3], [46, 36, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky1}" stroke="${P.sky2}" stroke-width=".35"/>`).join('') +
      `<path d="M12 81L27 64L42 81ZM80 81L92 68L106 81Z" fill="${P.mid}"/><path d="M27 64L42 81H34ZM92 68L106 81H99Z" fill="${P.night}" opacity=".6"/>` +
      `<path d="M27 64L42 81M92 68L106 81" stroke="${P.sky2}" stroke-width=".5" opacity=".6"/>` +
      hair(18, 76, 27, 72, 34, 74, 0.4, P.sky2, 0.5) + hair(84, 76, 92, 73, 98, 75, 0.4, P.sky2, 0.5) +
      `<path d="M8 80C36 77 82 82 112 78V130H8Z" fill="${P.brown}"/>` + k.shade('M8 77H112V130H8Z', k.lin(P.night, 0, 0, 0, 1, 0, 0.5), P.night, 0.3) +
      hair(20, 86, 32, 83.6, 44, 86, 0.6, P.goldL, 0.7) + hair(74, 88, 88, 85.6, 100, 87.6, 0.6, P.goldL, 0.7) + hair(40, 92, 52, 90, 62, 92.4, 0.5, P.goldL, 0.6) +
      k.floor(64, 83.2, 15, 1.8, P.night) +
      k.draw([{ d: tail, fill: P.paper, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.45) + hair(50, 81.4, 40, 85.6, 29, 84, 0.35, P.sky2) }], 0.45) + fray(27, 84.6, 175) +
      `<g transform="translate(62 57) rotate(8) scale(2.3)">` +
      k.cast([CARD], 1, 0.9) +
      k.draw([{
        d: CARD, fill: P.white,
        inner:
          `<path d="${roundRect(-5.4, -8.8, 5.4, 8.8, 0.5)}" fill="none" stroke="${P.ink}" stroke-width=".18"/>` + idx(0) + idx(180) +
          `<path d="M-4.4 -1H4.4V9.6H-4.4Z" fill="${P.red}"/><path d="M-.5 -1H.5V9.6H-.5Z" fill="${P.gold}"/><path d="M-4.4 3.2H-1.6V9.6H-4.4Z" fill="${P.sky}"/>` +
          `<path d="M-3.6 -5.6H3.6V-1H-3.6Z" fill="${P.skin}"/>` + k.sh('M0 -6H4V-.6H0Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
          pip('oros', 3.2, 6.6, 1.7) + k.sh('M1 -11H8V11H1Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3),
      }], 0.33) +
      `<path d="${crown}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".2" stroke-linejoin="round"/><path d="M-2.9 -6.4H2.9" stroke="${P.goldD}" stroke-width=".25"/><circle cx="0" cy="-6.7" r=".4" fill="${P.red}"/><circle cx="-1.8" cy="-6.8" r=".28" fill="${P.sky}"/><circle cx="1.8" cy="-6.8" r=".28" fill="${P.sky}"/><path d="M-2.4 -7.6L-2.2 -6.6" stroke="#fff" stroke-width=".2" stroke-linecap="round"/>` +
      bands +
      `</g>` +
      hair(30, 54, 26, 55, 23.6, 53.6, 0.6, P.paper) + hair(31, 59.6, 27, 61, 24.4, 60, 0.5, P.paper) +
      sparkle(84, 32, 2.2, P.paper) + sparkle(28, 66, 1.5, P.paper) +
      k.defs()
    )
  },
}
