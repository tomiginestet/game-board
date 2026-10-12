// Medallas del Chinchón, redibujadas (ver el kit en ../kit.ts): Chinchones, Menos diez, Cortador serial y Reenganchado.
import { f } from '../helpers'
import { ellipse, hair, kit, MEEPLE, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

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

/** Nube de algodón (la misma forma que el humo de la parrilla). */
const PUFF = 'M-9 2C-11 2 -12 0 -10.6 -1.6C-11 -4.6 -7.6 -6 -5.6 -4.4C-4.6 -7.6 0 -8.2 1.6 -5.2C3.6 -7 7.4 -5.6 7 -2.6C9.6 -2.4 10.2 1.6 7.6 2Z'
const puff = (k: Kit, x: number, y: number, s: number, c = P.white) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d: PUFF, fill: c, inner: k.sh(PUFF, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) }], 0.45 / s) + `</g>`

/** Corchea suelta. */
const note = (x: number, y: number, r: number, c = P.ink) =>
  `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="2" ry="1.5" transform="rotate(-20)" fill="${c}"/><path d="M1.8 -.4V-8.6C3.6 -7.6 5 -6.4 4.4 -4.4" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/></g>`

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

  // Tres chinchones: la escalera ya se arma sola, con tiras perforadas de Mecano, tuercas y una rueda dentada de fondo.
  'Escalera Mecano': (u) => {
    const k = kit(u)
    const R = 2.2
    const strip = (x: number, y: number, L: number, rot: number, n: number, c: string, dk: string) => {
      const d = roundRect(-R, -R, f(L + R), R, R)
      const holes = Array.from({ length: n }, (_, i) => {
        const hx = f((i * L) / (n - 1))
        return `<circle cx="${hx}" cy="0" r=".95" fill="${P.night}"/><path d="M${f(hx - 0.7)} .5A.95 .95 0 0 0 ${f(hx + 0.7)} .5" fill="none" stroke="#fff" stroke-width=".35" opacity=".55"/>`
      }).join('')
      return `<g transform="translate(${x} ${y}) rotate(${rot})">` +
        k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, dk, 0.45) + `<path d="M-.4 -1.5H${f(L + 0.4)}" stroke="#fff" stroke-width=".45" stroke-linecap="round" opacity=".5"/>` + holes }], 0.5) +
        `</g>`
    }
    const nut = (x: number, y: number) => `<path d="${starPath(x, y, 1.75, 1.75, 6, 0)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="${y}" r=".75" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".25"/><path d="M${f(x - 0.4)} ${f(y - 1.1)}L${f(x + 0.6)} ${f(y - 1.1)}" stroke="${P.goldL}" stroke-width=".35"/>`
    const N = 15, L = 58, y0 = 88, gap = L / (N - 1)
    const rungYs = [1, 3, 5, 7, 9, 11, 13].map((j) => f(y0 - j * gap))
    const gear = (() => {
      let d = ''
      const n = 18, Ro = 31, Ri = 27.4
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a = (Math.PI * 2) / n
        const pts: [number, number][] = [[Ri, a0], [Ro, a0 + a * 0.14], [Ro, a0 + a * 0.44], [Ri, a0 + a * 0.58]]
        d += pts.map(([rr, aa], j) => `${i || j ? 'L' : 'M'}${f(60 + Math.cos(aa) * rr)} ${f(54 + Math.sin(aa) * rr)}`).join('')
      }
      return d + 'Z' + ellipse(60, 54, 21, 21)
    })()
    const spokes = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.26
      return `<circle cx="${f(60 + Math.cos(a) * 24.2)}" cy="${f(54 + Math.sin(a) * 24.2)}" r="1.1" fill="${P.sky2}" stroke="${P.blue}" stroke-width=".3"/>`
    }).join('')
    const spanner = 'M-8 -1.5H8C8.6 -2.8 9.6 -3.4 11 -3.4C12.6 -3.4 14 -2.8 14.8 -1.6L11.8 -1V1L14.8 1.6C14 2.8 12.6 3.4 11 3.4C9.6 3.4 8.6 2.8 8 1.5H-8C-8.6 2.8 -9.6 3.4 -11 3.4C-12.6 3.4 -14 2.8 -14.8 1.6L-11.8 1V-1L-14.8 -1.6C-14 -2.8 -12.6 -3.4 -11 -3.4C-9.6 -3.4 -8.6 -2.8 -8 -1.5Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<path d="${gear}" fill="${P.sky1}" fill-rule="evenodd" stroke="${P.blue}" stroke-width=".6" stroke-linejoin="round"/>` + k.shade(gear, k.rad(P.sky2, 0.4, 0.4, 0.7, 0, 1), '#9EB1DB', 0.5) + spokes +
      k.floor(61, 89.6, 20, 2.4) +
      strip(48, y0, L, -90, N, P.red, P.wine) + strip(72, y0, L, -90, N, P.red, P.wine) +
      rungYs.map((y) => strip(48, y, 24, 0, 7, P.green, P.greenD)).join('') +
      rungYs.map((y) => nut(48, y) + nut(72, y)).join('') +
      nut(48, y0) + nut(72, y0) + nut(48, f(y0 - L)) + nut(72, f(y0 - L)) +
      `<g transform="translate(61 94) rotate(-4) scale(.78)">` + k.draw([{ d: spanner, fill: P.white, inner: k.sh(spanner, 0, 0, 0, 1, 0, 0.9, P.blue, 0.4) + `<path d="M-7.6 -.6H7.6" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.6) + `</g>` +
      `<g transform="translate(37 90) rotate(12)"><path d="${starPath(0, 0, 2, 2, 6, 0)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle r=".9" fill="${P.night}"/></g>` +
      sparkle(86, 36, 2.2) + sparkle(34, 40, 1.6) +
      k.defs()
    )
  },

  // Ocho chinchones: la escalera de siete de oro sube al cielo, entre nubes, con la gloria detrás (y algo de rock).
  'Escalera al cielo': (u) => {
    const k = kit(u)
    const s = 0.8
    const pos = Array.from({ length: 7 }, (_, i) => [f(37 + i * 7.33), f(78 - i * 5.93)])
    const halo = `<path d="${ellipse(81, 30.4, 6.4, 1.8)}" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="${ellipse(81, 30.4, 6.4, 1.8)}" fill="none" stroke="${P.gold}" stroke-width="1.1"/><path d="M76.6 29.4Q79 28.6 81.6 28.7" fill="none" stroke="${P.goldL}" stroke-width=".5"/>`
    return (
      k.day() +
      k.sun(66, 46, 14, 50, 32, false) +
      k.shade(ellipse(70, 42, 24, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      puff(k, 88, 54, 1.1) + puff(k, 44, 40, 0.8) +
      k.cast(pos.map(([x, y]) => `M${f(x - 5.1)} ${f(y - 7.8)}H${f(x + 5.1)}V${f(y + 7.8)}H${f(x - 5.1)}Z`), 2.2, 2) +
      pos.map(([x, y], i) => [x, y, i] as const).reverse().map(([x, y, i]) => naipe(k, 'oros', i + 1, `translate(${x} ${y}) scale(${s})`, 0.6)).join('') +
      halo +
      puff(k, 34, 88, 1.2) + puff(k, 52, 92, 0.9) + puff(k, 78, 80, 0.8) +
      note(32, 56, -10) + note(40, 30, 12) + note(56, 30, -6) +
      sparkle(90, 34, 2.4) + sparkle(30, 70, 1.6) + sparkle(70, 22, 1.4) +
      k.defs()
    )
  },

  // ── Menos diez ─────────────────────────────────────────────────────

  // Tres menos diez: el cubito de hielo se apoya en la planilla, que ya tiene tres "−10" anotados.
  'Cubito de hielo': (u) => {
    const k = kit(u)
    const sheet = roundRect(34, 24, 78, 84, 1.6)
    const rows = Array.from({ length: 7 }, (_, i) => `<path d="M36 ${38 + i * 7}H76" stroke="${P.sky2}" stroke-width=".55"/>`).join('') + `<path d="M56 32V84" stroke="${P.sky2}" stroke-width=".55"/>`
    const minus = [43.2, 50.2, 57.2].map((y) => `<text x="46" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="5" fill="${P.red}" text-anchor="middle">−10</text>`).join('')
    const scrib = [43.2, 50.2].map((y) => hair(62, y - 1, 64, y - 3.6, 66.4, y - 1.4, 0.7, P.mid) + hair(67, y - 1, 69, y - 3.6, 71, y - 1.4, 0.7, P.mid)).join('')
    // Cubo isométrico: arista 17.
    const T = [60, 49], Rr = [74.7, 57.5], F = [60, 66], Ll = [45.3, 57.5], h = 17
    const top = `M${T[0]} ${T[1]}L${Rr[0]} ${Rr[1]}L${F[0]} ${F[1]}L${Ll[0]} ${Ll[1]}Z`
    const left = `M${Ll[0]} ${Ll[1]}L${F[0]} ${F[1]}V${F[1] + h}L${Ll[0]} ${Ll[1] + h}Z`
    const right = `M${F[0]} ${F[1]}L${Rr[0]} ${Rr[1]}V${Rr[1] + h}L${F[0]} ${F[1] + h}Z`
    const cube = top + left.replace('M', 'L') + right.replace('M', 'L')
    const puddle = 'M40 80C42 76 52 78 58 81C66 84 78 78 84 80C90 82 88 86 82 87.6C74 89.6 60 90 50 88.6C42 87.6 37 84 40 80Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<g transform="rotate(-7 56 54)">` +
      k.cast([sheet], 2.2, 2) +
      k.draw([{
        d: sheet, fill: P.white, line: 0.4,
        inner: `<path d="M32 22H80V32H32Z" fill="${P.sky}"/>` + rows + minus + scrib + k.sh('M64 22H80V86H64Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
          `<text x="56" y="29.6" ${GEORGIA} font-weight="700" font-size="5" letter-spacing=".5" fill="${P.ink}" text-anchor="middle">CHINCHÓN</text>`,
      }]) +
      `</g>` +
      k.draw([{ d: puddle, fill: P.sky1, inner: k.sh(puddle, 0, 0, 1, 1, 0, 0.7, P.sky, 0.4) + `<path d="M46 82Q52 80 58 83" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` }], 0.4) +
      k.cast([cube], 2.6, 1.6) +
      k.draw([
        { d: left, fill: P.sky1, inner: k.sh(left, 0, 0, 1, 1, 0, 0.6, P.sky, 0.4) + `<path d="M47 66L58 72M47 70L58 76" stroke="${P.sky2}" stroke-width=".5" opacity=".7"/>` },
        { d: right, fill: P.sky, inner: k.sh(right, 0, 0, 1, 1, 0.1, 0.9, P.blue, 0.45) + `<path d="M62 74L73 67.6M62 78L73 71.6" stroke="${P.sky2}" stroke-width=".5" opacity=".7"/>` },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.45, P.sky2, 0.4) },
      ], 0.7) +
      `<path d="M47.6 57.6L60 50.4L72.4 57.6" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M47 60V71" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      hair(52, 62, 55, 66, 53.6, 71, 0.6, '#fff') + hair(66, 68, 68.6, 66, 70, 70, 0.55, '#fff') + hair(56, 54, 60, 56.4, 64, 54.6, 0.5, P.sky) +
      [[50, 75, 0.7], [53, 69, 0.5], [68, 76, 0.6], [71, 64, 0.45], [64, 58, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".9"/>`).join('') +
      hair(78, 70, 82, 74, 80, 79, 0.6, P.white) + hair(41, 70, 37, 74, 39, 79, 0.6, P.white) +
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

  // Cuarenta menos diez: la planilla se mudó a la Base Marambio, con la bandera al viento delante del sol de Mayo.
  'Base Marambio': (u) => {
    const k = kit(u)
    const peaks = 'M18 74L34 54L42 61L56 44L68 58L78 50L100 74Z'
    const caps = 'M34 54L38.4 59.6L35 58.4L31.6 60.2ZM56 44L61.6 51L57.6 49.4L54 52.6L50.8 51.4ZM78 50L82.4 55.4L79 54.6L75.6 56Z'
    const ground = 'M8 72C30 68 46 75 66 71C84 68 100 71 112 70V130H8Z'
    const front = 'M42 60H72V78H42Z', side = 'M72 60L82 55V73L72 78Z', roof = 'M40.6 60L50.6 55H83.4L72.4 60Z'
    const win = (x: number) => `<rect x="${x}" y="64.6" width="5" height="4.4" fill="${P.sky}" stroke="${P.white}" stroke-width=".8"/><path d="M${x + 2.5} 64.6V69" stroke="${P.white}" stroke-width=".4"/>`
    const flag = 'M37 30C41 28.4 45 31.6 51 30V40C45 41.6 41 38.4 37 40Z'
    const peng = 'M0 -6C2 -6 3 -4.4 3 -2.6C4.4 -1 4.6 2 4 4.4L2.6 6H-2.6L-4 4.4C-4.6 2 -4.4 -1 -3 -2.6C-3 -4.4 -2 -6 0 -6Z'
    return (
      k.day() +
      k.sun(60, 48, 15, 44) +
      k.draw([{ d: peaks, fill: P.sky1, inner: k.sh(peaks, 0, 0, 1, 0, 0.1, 0.8, P.sky2, 0.4) + `<path d="${caps}" fill="${P.white}"/>` }], 0.5) +
      k.draw([{ d: ground, fill: P.white, inner: k.sh(ground, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.4) + hair(20, 80, 34, 77, 46, 80, 0.6, P.sky2) + hair(74, 82, 88, 79, 100, 81, 0.6, P.sky2) }], 0.5) +
      k.floor(63, 79, 26, 2.4) +
      `<path d="M45 78V81M52 78V81M62 78V81M70 78V81M79.4 74.4V77.6" stroke="${P.ink}" stroke-width="1.4"/>` +
      k.draw([
        { d: side, fill: P.wine, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
        { d: front, fill: P.red, line: 0.35, inner: k.sh(front, 0, 0, 1, 1, 0, 0.6, P.wine, 0.4) + `<path d="M42 62H72" stroke="#fff" stroke-width=".7" opacity=".4"/>` },
        { d: roof, fill: P.white, inner: k.sh(roof, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) },
      ], 0.7) +
      win(45) + win(52) + win(64.4) +
      `<rect x="58.4" y="65" width="4.6" height="13" fill="${P.wine}" stroke="${P.ink}" stroke-width=".4"/><circle cx="62" cy="71.6" r=".4" fill="${P.gold}"/>` +
      `<text x="57" y="76.6" ${GEORGIA} font-weight="700" font-size="2.6" letter-spacing=".3" fill="${P.white}" text-anchor="middle" opacity="0">.</text>` +
      `<path d="M78 55.6V40M74.6 42H81.4M75.4 46H80.6" stroke="${P.ink}" stroke-width=".7"/><circle cx="74.6" cy="42" r="1" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="81.4" cy="42" r="1" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M37 79V29" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M37 79V29" stroke="${P.white}" stroke-width=".7"/><circle cx="37" cy="28.4" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: flag, fill: P.white, inner: `<path d="M36 26H52V33.6H36ZM36 36.4H52V44H36Z" fill="${P.sky}" transform="skewY(0)"/>` + k.sh(flag, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) }], 0.45) +
      `<circle cx="44" cy="35" r="1.3" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4"/>` +
      `<g transform="translate(90 80)">` + k.draw([{ d: peng, fill: P.night, inner: `<path d="M-2 -1.6C-3 1 -2.6 4 -1.6 6H2.2C3 4 3 1 2 -1.6Z" fill="${P.white}"/>` }], 0.4) + `<path d="M-1 -4.4L-3.4 -3.8L-1 -3.4Z" fill="${P.gold}"/><circle cx="-.4" cy="-4.6" r=".4" fill="#fff"/></g>` +
      [[28, 40], [94, 46], [88, 30], [24, 60], [50, 86], [84, 92]].map(([x, y], i) => sparkle(x, y, i % 2 ? 1.2 : 1.8, P.white)).join('') +
      k.defs()
    )
  },

  // ── Cortador serial ────────────────────────────────────────────────

  // Diez cortes: la tijerita de punta redonda, de las del colegio, corta el naipe por la línea punteada.
  'Tijerita escolar': (u) => {
    const k = kit(u)
    const blade = 'M4 -2.4L-21 -1.7A1.75 1.75 0 0 0 -21 1.8L4 2.2Z'
    const ring = (cy: number) => `${ellipse(15, cy, 6.4, 4.6)} ${ellipse(15.4, cy, 3.8, 2.4)}`
    const shank = (cy: number) => `M3 ${cy > 0 ? -1.6 : 1.6}C6 ${cy > 0 ? 1 : -1} 8 ${f(cy * 0.6)} 10 ${f(cy * 0.9)}L12 ${f(cy * 0.5)}C9 ${f(cy * 0.3)} 7 ${cy > 0 ? -1 : 1} 5 ${cy > 0 ? -3.2 : 3.2}Z`
    const plastic = (d: string) => ({ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` })
    const steel = (d: string, t: string) => ({ d, t, fill: P.white, line: 0.3, inner: k.sh('M-24 0H6V4H-24Z', 0, 0, 0, 1, 0.1, 0.9, P.blue, 0.4) })
    return (
      k.day() +
      k.stage(60, 58, 34) +
      `<g transform="translate(50 59) rotate(-12)">` + k.cast([roundRect(-9.6, -14.7, 9.6, 14.7, 1.8)], 2.4, 2.2) + `</g>` +
      // Hoja de abajo (detrás del naipe).
      `<g transform="translate(70 62) rotate(-8)">` + k.draw([steel(blade, 'rotate(-13)')], 0.55) + `</g>` +
      naipe(k, 'oros', 1, 'translate(50 59) rotate(-12) scale(1.5)', 0.45) +
      `<g transform="translate(50 59) rotate(-12)"><path d="M-9.6 1.6H5" stroke="${P.ink}" stroke-width=".7" stroke-dasharray="1.8 1.4"/><path d="M5 1.6H9.8" stroke="${P.ink}" stroke-width=".9"/></g>` +
      `<g transform="translate(70 62) rotate(-8)">` +
      k.draw([steel(blade, 'rotate(13)')], 0.55) +
      k.draw([plastic(shank(7)), plastic(shank(-7)), plastic(ring(7.6)), plastic(ring(-7.6))], 0.6) +
      `<circle cx="0" cy="0" r="2" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/><path d="M-1.2 -.6L1.2 .6" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      hair(84, 40, 86, 36, 89, 34, 0.6) + hair(87, 46, 90, 44, 93, 44, 0.6) +
      sparkle(34, 36, 2.2) + sparkle(86, 84, 1.6) +
      k.defs()
    )
  },

  // Cuarenta cortes: el poste de la peluquería del barrio, y la radio con el partido de fondo.
  'Peluquero de barrio': (u) => {
    const k = kit(u)
    const glass = roundRect(47, 36, 65, 80, 1)
    let bands = ''
    for (let j = -4; j < 14; j++) {
      const y = 30 + j * 7, c = [P.red, P.sky][((j % 2) + 2) % 2]
      bands += `<path d="M46 ${y}L66 ${y - 12}V${y - 8.6}L46 ${y + 3.4}Z" fill="${c}"/>`
    }
    const capTop = 'M44.6 31H67.4V36.4H44.6Z', dome = 'M48 31C48 24.6 64 24.6 64 31Z', capBot = 'M44.6 80H67.4V85H44.6Z', foot = 'M47 85H65L63 90H49Z'
    const gold = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` })
    const radio = roundRect(70, 72, 92, 88, 2.4)
    const bubble = 'M73 36C73 30.6 78 28 83.6 28C89.2 28 93 31 93 36C93 41 89.2 44 83.6 44C82 44 80.4 43.6 79.2 43L74.6 45.6L75.8 41.2C74 40 73 38 73 36Z'
    const ball = ellipse(83.4, 36, 4.2, 4.2)
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(57, 90.4, 13, 2) + k.floor(81, 88.6, 12, 1.8) +
      k.draw([{ d: glass, fill: P.white, inner: bands + k.sh(glass, 0, 0, 1, 0, 0.05, 0.85, P.night, 0.45) + `<path d="M46 36H52V80H46Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` }], 0.7) +
      `<path d="M50.6 38V78" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".85"/>` +
      k.draw([gold(dome), gold(capTop), gold(capBot), gold(foot)], 0.7) +
      `<circle cx="56" cy="23.4" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><circle cx="55.4" cy="22.8" r=".6" fill="#fff"/>` +
      `<path d="M44.6 33.6H67.4M44.6 82.6H67.4" stroke="${P.goldD}" stroke-width=".6"/>` +
      `<path d="M88 72L94 54" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M88 72L94 54" stroke="${P.white}" stroke-width=".45" stroke-linecap="round"/><circle cx="94" cy="54" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M73.6 72C73.6 67 88.4 67 88.4 72" fill="none" stroke="${P.ink}" stroke-width="2.2"/><path d="M73.6 72C73.6 67 88.4 67 88.4 72" fill="none" stroke="${P.brownD}" stroke-width="1"/>` +
      k.draw([{
        d: radio, fill: P.brown,
        inner: k.sh(radio, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<rect x="72" y="74.6" width="11" height="11" rx="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` +
          Array.from({ length: 16 }, (_, i) => `<circle cx="${f(73.8 + (i % 4) * 2.4)}" cy="${f(76.4 + Math.floor(i / 4) * 2.4)}" r=".55" fill="${P.brownD}"/>`).join('') +
          `<circle cx="87.6" cy="78" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M87.6 78L88.8 76.4" stroke="${P.ink}" stroke-width=".4"/><rect x="85.4" y="82.4" width="4.4" height="2.4" rx=".4" fill="${P.night}"/>`,
      }], 0.6) +
      hair(70, 66, 67.6, 62, 70, 58, 0.6) + hair(66, 68, 63, 62, 66, 55, 0.5) +
      k.draw([{ d: bubble, fill: P.white, inner: k.sh(bubble, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.5) +
      k.draw([{ d: ball, fill: P.white, inner: `<path d="${starPath(83.4, 36, 1.6, 1.6, 5)}" fill="${P.ink}"/><path d="M83.4 34.4V31.8M84.9 36.5L87.4 35.6M84.3 37.3L85.8 39.6M82.5 37.3L81 39.6M81.9 36.5L79.4 35.6" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(ball, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.4) +
      sparkle(34, 40, 2.2) + sparkle(30, 70, 1.4) +
      k.defs()
    )
  },

  // Ciento veinte cortes: la motosierra parte el ancho de espadas al medio; no queda nada para juntar.
  'Motosierra': (u) => {
    const k = kit(u)
    const body = 'M-16 -8C-16 -11 -13 -13 -9 -13H5C9 -13 11 -10 11 -6V7C11 10 9 11 6 11H-12C-15 11 -16 9 -16 6Z'
    const bar = roundRect(8, -4.2, 48, 4.2, 4.2)
    const guard = 'M8.6 -16.6L12.6 -22.4L15.4 -21L12.4 -12.4Z'
    const handle = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.night}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`
    const teeth = Array.from({ length: 22 }, (_, i) => {
      const x = 10 + i * 1.8
      return `M${f(x)} -4.4L${f(x + 0.9)} -5.8L${f(x + 1.6)} -4.4M${f(x)} 4.4L${f(x + 0.9)} 5.8L${f(x + 1.6)} 4.4`
    }).join('')
    const half = (top: boolean) => {
      const cut = top ? 'M-10 -12H10V-1.6L-10 2.6Z' : 'M-10 2.6L10 -1.6V12H-10Z'
      return k.clip(cut, naipe(k, 'espadas', 1, 'scale(1)', 0.5)) + `<path d="M-6.4 2.2L-3.6 1.4L-1 1.2L2 .2L4 -.2L6.4 -.9" fill="none" stroke="${P.ink}" stroke-width=".35" stroke-dasharray=".6 .5"/>`
    }
    const chips = [[66, 40, 20], [86, 64, -30], [62, 76, 60], [92, 56, 10], [74, 36, -50], [80, 74, 35]].map(([x, y, r]) => `<rect x="${x - 1.2}" y="${y - 0.8}" width="2.4" height="1.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return (
      k.day() +
      k.sun(60, 56, 16, 46, 28, false) +
      `<g transform="translate(69 46) rotate(-34) scale(1.15)">${half(true)}</g>` +
      `<g transform="translate(48 70) rotate(-26) scale(.9)">` +
      handle('M-16 -2H-25C-29 -2 -29 8 -25 8H-16') +
      k.draw([
        { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.9, P.blue, 0.4) + `<path d="M12 0H44" stroke="${P.sky2}" stroke-width="1.2"/><circle cx="44" cy="0" r="2.4" fill="none" stroke="${P.sky2}" stroke-width=".8"/>` },
        { d: body, fill: P.red, line: 0.4, inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, P.wine, 0.45) + `<path d="M-14 -11H-2V-7H-14Z" fill="#fff" opacity=".25"/><path d="M-12 -2H4M-12 1H4M-12 4H4" stroke="${P.wine}" stroke-width=".8"/>` },
      ], 0.75) +
      `<path d="${teeth}" fill="none" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/>` +
      handle('M-9 -13C-9 -22 2 -24 8 -18L10 -12') +
      k.draw([{ d: guard, fill: P.night }], 0.5) +
      `<circle cx="10.6" cy="0" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      `<g transform="translate(80 66) rotate(-14) scale(1.15)">${half(false)}</g>` +
      chips +
      puff(k, 30, 58, 0.7, P.sky1) + puff(k, 26, 48, 0.5, P.sky1) +
      hair(88, 46, 92, 42, 94, 36, 0.6) + hair(90, 54, 94, 52, 96, 48, 0.5) +
      k.defs()
    )
  },

  // ── Reenganchado ───────────────────────────────────────────────────

  // Te pasaste y volviste: la rodilla raspada con su curita en cruz, de zapatilla Flecha y soquete.
  'Curita en la rodilla': (u) => {
    const k = kit(u)
    const BAND = '#E3B489'
    const leg = 'M48 32C58 36 68 41 76 46C82 50 84 58 81 64C77 71 70 78 66 84L56 82C54 76 56 68 62 63C58 60 52 56 46 54Z'
    const shorts = 'M30 34C34 29 42 27 50 30L54 32L49 57C42 59 34 58 29 54C27 48 27.4 40 30 34Z'
    const sock = 'M54.4 75.6C58 77.4 64 79 68.4 78.4L66.4 88.6H55.2Z'
    const shoe = 'M50 86C52 84 60 84.4 66 86.4C71 88 75.6 88.6 77 91C78 93.4 76 95 72 95H52C49.4 95 48.6 92 49 89Z'
    const strip = roundRect(-8, -2.5, 8, 2.5, 2.5)
    const curita = (r: number) =>
      `<g transform="translate(77 55) rotate(${r})">` +
      k.draw([{ d: strip, fill: BAND, inner: k.sh(strip, 0, 0, 0, 1, 0, 0.7, P.brown, 0.4) + `<rect x="-3" y="-2.5" width="6" height="5" fill="${P.paper}"/>` + [-6, -4.6, 4.6, 6].map((x) => `<circle cx="${x}" cy="-.9" r=".3" fill="${P.brown}"/><circle cx="${x}" cy=".9" r=".3" fill="${P.brown}"/>`).join('') }], 0.45) +
      `</g>`
    return (
      k.day() +
      k.stage(58, 58, 34) +
      k.floor(63, 95, 15, 2) +
      k.draw([
        { d: leg, fill: P.skin, inner: k.sh(leg, 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + k.sh('M40 50H90V70H40Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) + `<path d="M50 34C60 38 68 42 74 46" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>` },
        { d: sock, fill: P.white, inner: `<path d="M54 78.6L68 81.2V83L54 80.4Z" fill="${P.sky}"/><path d="M54 81.6L68 84.2V85.4L54 82.8Z" fill="${P.mid}"/>` + k.sh(sock, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) },
        { d: shoe, fill: P.mid, inner: k.sh(shoe, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<path d="M48 92H79V96H48Z" fill="${P.white}"/><path d="M48 92H79" stroke="${P.ink}" stroke-width=".4"/><path d="M68 87C72 88 76 89 77 91.6L70 92Z" fill="${P.white}"/>` + `<path d="M58 85.6L60.6 88M61 85.8L63.4 88.4M64 86.2L66 88.6" stroke="${P.white}" stroke-width=".6"/>` },
        { d: shorts, fill: P.sky, line: 0.35, inner: k.sh(shorts, 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + `<path d="M50.8 31.4L47.2 55.6" stroke="${P.white}" stroke-width=".5" stroke-dasharray="1 .8"/>` },
      ], 0.75) +
      hair(66, 66, 63.6, 62, 64, 58, 0.6, P.blue) + hair(74, 64, 72, 70, 68, 76, 0.5, P.blue) +
      hair(70, 49.4, 72, 50.6, 73.4, 50, 0.5, P.red) + hair(81.4, 59.6, 82, 61.4, 81, 62.4, 0.5, P.red) + hair(71, 60.6, 72.2, 62, 73.6, 62, 0.45, P.red) +
      curita(38) + curita(-38) +
      sparkle(34, 76, 2) + sparkle(86, 36, 2.2) +
      k.defs()
    )
  },

  // Cuatro reenganches: el yeso firmado por todos, y la mano igual sostiene las cartas.
  'Yeso firmado': (u) => {
    const k = kit(u)
    const cast = taper(30, 104, 40, 86, 54, 70, 20, 17)
    const cuff = 'M-8.6 -2.6C-3 -4.4 3 -4.4 8.6 -2.6L8.2 1.4C3 -.2 -3 -.2 -8.2 1.4Z'
    const palm = 'M48.6 66C46 60 48 54 54 52.6C60 51.2 68 52 70 57C72 62 68 68 62 70.4C56 72.4 50.6 70.4 48.6 66Z'
    const thumb = 'M51 62.4C50.4 58.6 52.6 55.6 56.4 54.6L61.6 53.6C63.4 53.4 64.4 55.6 62.8 56.6L58.4 59.4C57 61.6 56.6 64 56 66Z'
    const fan = [[4, -36], [5, -12], [6, 12], [7, 36]].map(([n, a]) => naipe(k, 'copas', n, `translate(60 62) rotate(${a}) translate(0 -13)`, 0.5)).join('')
    const sig = hair(36, 92, 40, 88, 42, 91, 0.55, P.ink) + hair(42, 91, 44, 86, 47, 88, 0.55, P.ink) +
      hair(40, 80, 44, 82, 48, 78, 0.6, P.red) + hair(48, 78, 50, 74.6, 52, 77, 0.5, P.red) +
      hair(34, 98, 38, 96, 41, 99, 0.5, P.mid) + hair(41, 99, 43, 95.4, 46, 97, 0.5, P.mid)
    return (
      k.day() +
      k.sun(60, 54, 17, 46, 28, false) +
      k.cast([cast], 2.4, 2) +
      k.draw([{ d: cast, fill: P.white, inner: k.sh(cast, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M30 92C34 84 40 78 46 72" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>` + sig }], 0.8) +
      `<path d="M46.4 86.6C44.6 84.6 44.6 82.4 46.6 82C48 81.8 48.8 83 48.8 84C48.8 83 49.6 81.8 51 82C53 82.4 52.8 84.6 51 86.6L48.8 88.6Z" fill="${P.red}" transform="rotate(-30 48.8 85)"/>` +
      `<text x="0" y="0" ${GEORGIA} font-style="italic" font-size="4.4" fill="${P.mid}" text-anchor="middle" transform="translate(41 88) rotate(-52)">¡Fuerza!</text>` +
      `<g transform="translate(54.4 71) rotate(42)">` + k.draw([{ d: cuff, fill: P.paper, inner: hair(-6, -2, -6.4, -.6, -6, 1, 0.4, P.sky2) + hair(-2, -3, -2.2, -1.4, -2, 0, 0.4, P.sky2) + hair(2, -3, 2.2, -1.4, 2, 0, 0.4, P.sky2) + hair(6, -2, 6.4, -.6, 6, 1, 0.4, P.sky2) }], 0.5) + `</g>` +
      k.draw([{ d: palm, fill: P.skin, inner: k.sh(palm, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.6) +
      fan +
      k.draw([{ d: thumb, fill: P.skin, inner: k.sh(thumb, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) + `<path d="M58.8 54.8L61.4 54.2C62.6 54 63.2 55.4 62.2 56L59.6 57.4C59.6 56.4 59.4 55.4 58.8 54.8Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.55) +
      sparkle(86, 36, 2.4) + sparkle(30, 46, 1.8) +
      k.defs()
    )
  },

  // Doce reenganches: la momia que sigue en la mesa, con las cartas en la mano, bajo la luna del desierto.
  'Momia andante': (u) => {
    const k = kit(u)
    const bands = Array.from({ length: 15 }, (_, i) => {
      const y = -27 + i * 3.8, tilt = i % 2 ? 1.4 : -1.4
      return `<path d="M-26 ${f(y - tilt)}L26 ${f(y + tilt)}" stroke="${P.sky2}" stroke-width=".7"/><path d="M-26 ${f(y - tilt + 0.8)}L26 ${f(y + tilt + 0.8)}" stroke="#fff" stroke-width=".5" opacity=".8"/>`
    }).join('')
    const slit = 'M-8.6 -19.6C-4 -20.8 4 -20.8 8.6 -19.6L8.4 -15.4C4 -14.6 -4 -14.6 -8.4 -15.4Z'
    const loose = taper(-22, -2, -32, 4, -30, 18, 3.4, 2.6)
    const moon = ellipse(60, 46, 27, 27)
    const pyr = (x: number, y: number, w: number, h: number, c: string) => `<path d="M${x - w} ${y}L${x} ${y - h}L${x + w} ${y}Z" fill="${c}"/><path d="M${x} ${y - h}L${x + w} ${y}H${f(x + w * 0.2)}Z" fill="${P.night}" opacity=".5"/>`
    const fan = [[5, -24], [6, 0], [7, 24]].map(([n, a]) => naipe(k, 'oros', n, `translate(20 -6) rotate(${a}) translate(0 -9) scale(.56)`, 0.9)).join('')
    return (
      k.night() +
      [[28, 34], [92, 30], [26, 64], [95, 70], [38, 22], [84, 20]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="${moon}" fill="${P.paper}"/>` + k.shade(moon, k.rad(P.goldL, 0.4, 0.4, 0.7, 0, 0.8), P.goldL, 0.3) +
      [[48, 36, 3], [70, 30, 2.2], [74, 54, 2.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky1}" stroke="${P.sky2}" stroke-width=".4"/>`).join('') +
      pyr(30, 84, 16, 22, P.mid) + pyr(92, 84, 13, 17, P.mid) +
      `<path d="M10 82C40 79 80 83 110 80V130H10Z" fill="${P.brown}"/>` + k.shade('M10 80H110V130H10Z', k.lin(P.night, 0, 0, 0, 1, 0, 0.8), P.night, 0.4) +
      k.floor(62, 91.4, 18, 2.4, '#000') +
      `<g transform="translate(60 64) rotate(4) scale(.94)">` +
      k.draw([{ d: loose, fill: P.paper, inner: k.sh(loose, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.75 / 0.94) +
      k.draw([{
        d: MEEPLE, fill: P.paper,
        inner: bands + k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.75, P.mid, 0.35) + k.sh('M-30 14H30V30H-30Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) + `<path d="M-30 -30H-2V30H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>`,
      }], 0.8) +
      `<path d="${slit}" fill="${P.night}"/>` +
      `<circle cx="-3.6" cy="-17.4" r="1.7" fill="${P.white}"/><circle cx="3.6" cy="-17.4" r="1.7" fill="${P.white}"/><circle cx="-3.2" cy="-17.2" r=".9" fill="${P.ink}"/><circle cx="4" cy="-17.2" r=".9" fill="${P.ink}"/>` +
      hair(-6, 6, -4.6, 11, -6.6, 17, 0.6, P.blue) + hair(6, 6, 4.6, 11, 6.6, 17, 0.6, P.blue) +
      fan +
      `</g>` +
      sparkle(88, 44, 2.2, P.paper) + sparkle(30, 48, 1.6, P.paper) +
      k.defs()
    )
  },
}
