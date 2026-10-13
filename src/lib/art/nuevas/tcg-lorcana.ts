// Disney Lorcana. Juego principal: la tinta mágica color zafiro, la noche de cuento y el oro de los Ilumineers.
// Nada de la marca ni de personajes: ni el hexágono de tinta, ni el castillo del logo, ni orejas de ratón.
import { f } from '../helpers'
import { ellipse, hair, kit, P, sparkle, starPath, taper, type Kit } from '../kit'

/** El color de la ficha (zafiro) y sus tonos: la tinta, la tinta en sombra, el reflejo y la noche de cuento. */
const LOR = '#1864AB', LORD = '#0D3A70', LORL = '#79AEE6', LORN = '#0A2049'

const STARS: [number, number, number][] = [
  [31, 41, 0.5], [37, 29, 0.4], [48, 23, 0.35], [73, 23, 0.4], [85, 31, 0.5], [92, 47, 0.35], [28, 62, 0.4], [94, 66, 0.45],
  [33, 83, 0.35], [88, 84, 0.4], [53, 30, 0.3], [69, 35, 0.3], [41, 51, 0.3], [80, 56, 0.3],
]

/** Noche de cuento: azul profundo con el resplandor zafiro de la tinta y estrellitas. */
function lorNight(k: Kit, gx = 0.5, gy = 0.46, stars = STARS) {
  return (
    `<rect width="120" height="130" fill="${LORN}"/>` +
    k.shade('M0 0H120V130H0Z', k.rad(LOR, gx, gy, 0.55, 0.95, 0), LOR, 0.5) +
    stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" opacity=".8"/>`).join('')
  )
}

/** Gloria de rayos rectos de luz zafiro (la de los Ilumineers), largos y cortos alternados. */
function glory(k: Kit, cx: number, cy: number, r0: number, r1: number, n: number, color = LORL, a0 = 0.95) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, len = i % 2 ? r0 + (r1 - r0) * 0.62 : r1, w = i % 2 ? 0.9 : 1.6
    const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
    d += `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
  }
  return k.shade(d, k.rad(color, 0.5, 0.5, 0.5, a0, 0), color, 0.6)
}

/** Corchea entintada con la cabeza en (x,y). */
function note(k: Kit, x: number, y: number, s: number, r: number, fill = P.white, shade = LORL) {
  const head = ellipse(0, 0, 2.7, 1.9)
  const stem = 'M1.3 -.8V-13C1.9 -10 5.8 -9 6 -5.4C6.1 -4 5.6 -3 5 -2.4C5.2 -5.2 3.8 -7.2 2.8 -7.8V-.8Z'
  return (
    `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
    k.draw([{ d: stem, fill, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.8, shade, 0.4) }, { d: head, t: 'rotate(-24)', fill, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, shade, 0.45) }], f(0.5 / s)) +
    `<ellipse cx="-.9" cy="-.6" rx=".9" ry=".45" fill="#fff" transform="rotate(-24)"/></g>`
  )
}

/** Plumín dorado grabado en su portaplumas laqueado, con la punta (manchada de tinta) en (0,0) hacia abajo. */
function nib(k: Kit) {
  const body = 'M0 0C-1.6 -3.6 -6.2 -9.4 -7 -14.6C-7.4 -17.4 -7 -19.4 -6.4 -21H6.4C7 -19.4 7.4 -17.4 7 -14.6C6.2 -9.4 1.6 -3.6 0 0Z'
  const ferrule = 'M-7.2 -21H7.2L7.6 -29H-7.6Z'
  const holder = 'M-6.2 -29C-6 -42 -5.4 -54 -4.6 -72H4.6C5.4 -54 6 -42 6.2 -29Z'
  const stain = 'M0 0C-.9 -2 -2.6 -4.4 -3.4 -6C-1 -5 1 -5 3.4 -6C2.6 -4.4 .9 -2 0 0Z'
  const scroll = (s: number) =>
    `<g transform="scale(${s} 1)"><path d="M-1.2 -14.6C-3.6 -14.8 -5.2 -16.4 -4.6 -18.2C-4.1 -19.6 -2.3 -19.4 -2.4 -18C-2.5 -17 -3.6 -17 -3.6 -17.8" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-linecap="round"/>` +
    `<path d="M-1.6 -12.6C-3.4 -11 -4.4 -9 -3.8 -7.4" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-linecap="round"/><circle cx="-5.2" cy="-13" r=".45" fill="${P.goldD}"/></g>`
  return (
    k.draw([
      {
        d: holder, fill: P.wine,
        inner: k.sh(holder, 0, 0, 1, 0, 0, 0.9, '#3A0F1A', 0.5) + `<path d="M-6 -29H-2.4V-72H-6Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.32, 0)}"/>` +
          `<path d="M-6.4 -37.4H6.4V-40H-6.4Z" fill="${P.gold}"/><path d="M-6.4 -38.7H6.4" stroke="${P.goldD}" stroke-width=".35"/>` + hair(-3.6, -44, -3.4, -56, -3, -70, 0.7, '#fff', 0.6),
      },
      {
        d: ferrule, fill: P.gold,
        inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-7.4 -23.2H7.4M-7.4 -25H7.4M-7.4 -26.8H7.4" stroke="${P.goldD}" stroke-width=".4"/>` + hair(-5.6, -21.4, -5.8, -25, -5.6, -28.6, 0.7, '#fff', 0.9),
      },
      {
        d: body, fill: P.gold,
        inner:
          k.sh('M0 -22H8V1H0Z', 0, 0, 1, 0, 0.1, 0.95, P.goldD, 0.5) + `<path d="M-8 -22H-2V1H-8Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="M-6.9 -17.6Q0 -15.2 6.9 -17.6" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` + scroll(1) + scroll(-1) +
          `<path d="${stain}" fill="${LOR}"/>` + hair(-5.8, -19.4, -5.2, -12, -1.4, -4, 0.6, '#fff', 0.8),
      },
    ], 0.7) +
    `<path d="M0 0V-10.2" stroke="${P.ink}" stroke-width=".5"/>` +
    `<path d="M0 -10.4C-1.8 -12.2 -1.5 -13.6 -.6 -13.6C-.2 -13.6 0 -13.3 0 -13C0 -13.3 .2 -13.6 .6 -13.6C1.5 -13.6 1.8 -12.2 0 -10.4Z" fill="${LORD}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

/** Gota de tinta zafiro, con el polvo dorado que gira adentro. Centro de la panza en (0,4.6), punta en (0,-24). */
const DROP = 'M0 -24C3.2 -15 14 -8 14 4.6C14 13.4 7.8 19.4 0 19.4C-7.8 19.4 -14 13.4 -14 4.6C-14 -8 -3.2 -15 0 -24Z'
function inkDrop(k: Kit) {
  const dust = [[-7.4, 9.4, 0.7], [-2.4, 13.4, 0.55], [4, 12.6, 0.6], [8.6, 6, 0.5], [6.4, -2.6, 0.45], [-3.4, 1.4, 0.4], [1.4, 7.4, 0.6], [-9.4, 3.4, 0.45], [-5, 15, 0.4], [9.6, 11, 0.4]]
  return (
    k.draw([{
      d: DROP, fill: LOR,
      inner:
        `<path d="M-16 -26H3V4C-6 6 -12 8 -16 10Z" fill="${k.lin(LORL, 0, 0, 1, 1, 0.95, 0)}"/>` + k.sh(DROP, 0, 0, 1, 1, 0, 0.95, LORD, 0.55) +
        `<path d="${DROP}" fill="none" stroke="${LORL}" stroke-width=".6" opacity=".8" transform="translate(0 .9) scale(.9)"/>` +
        hair(-10, 11, -5, -3, 6, 1.6, 1, P.goldL) + hair(6, 1.6, 12.4, 8, 3.4, 14.6, 0.9, P.gold) + hair(3.4, 14.6, -5.4, 16.6, -7.2, 7.4, 0.7, P.goldL, 0.9) +
        hair(-7.2, 7.4, -6, 3, -0.6, 4.4, 0.55, P.gold, 0.9) + hair(-0.6, 4.4, 4, 6, 2, 10, 0.45, P.goldL, 0.8) +
        dust.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
        hair(-8, 15.6, 0, 19.6, 8, 15.6, 0.9, LORL, 0.9),
    }], 0.8) +
    hair(-10.8, 4, -11, -5.6, -4.2, -15, 1.5, '#fff', 0.95) + `<ellipse cx="-7.6" cy="-.6" rx="1.4" ry=".85" fill="#fff" transform="rotate(-50 -7.6 -.6)"/>` +
    hair(10, 12, 11.6, 6, 11, 1, 0.6, '#fff', 0.5) +
    sparkle(5, 7, 2.8, P.goldL) + sparkle(-4, 9, 1.4, '#fff')
  )
}

/** Manzana roja de cuento, con rabito y hoja. Centro en (0,0). */
function apple(k: Kit) {
  const d = 'M0 -5.6C-2.4 -7.6 -7.6 -7.4 -8.6 -2.6C-9.6 2.6 -6 8.4 -2.6 8.4C-1.4 8.4 -.8 7.8 0 7.8C.8 7.8 1.4 8.4 2.6 8.4C6 8.4 9.6 2.6 8.6 -2.6C7.6 -7.4 2.4 -7.6 0 -5.6Z'
  const leaf = 'M.8 -8.2C2.6 -11 6.6 -11.6 8.4 -9.8C6.6 -7.4 3 -7 .8 -8.2Z'
  return (
    `<path d="M-.2 -5.4C-.4 -7.6 .2 -9.6 1.6 -10.8" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-.2 -5.4C-.4 -7.6 .2 -9.6 1.6 -10.8" fill="none" stroke="${P.brownD}" stroke-width=".7" stroke-linecap="round"/>` +
    k.draw([
      { d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.95, P.wine, 0.5) + `<path d="M-10 -8H-1V3C-5 2 -8 1 -10 0Z" fill="${k.lin('#FFB4A8', 0, 0, 1, 1, 0.7, 0)}"/>` + hair(1.4, -4, 3.4, 1, 1.8, 6.6, 0.5, P.wine, 0.7) },
      { d: leaf, fill: P.green, inner: k.sh(leaf, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="M1.6 -8.4Q5 -9.6 7.6 -9.6" fill="none" stroke="${P.greenD}" stroke-width=".35"/>` },
    ], 0.6) +
    hair(-6.4, -3.6, -6, -5.6, -3.6, -6, 0.9, '#fff', 0.95) + `<circle cx="-6.2" cy="-1.4" r=".55" fill="#fff"/>`
  )
}

/** Zapatito de cristal de perfil, con la punta a la izquierda y el taco apoyado en (7,3). */
function slipper(k: Kit) {
  const d = 'M-9 -1.6C-9.6 -3 -8.6 -4.4 -6.6 -4.6C-3.6 -4.8 -.8 -5.4 1.6 -7C3.4 -8.2 5.6 -9.2 7.6 -8.6C8.8 -8.2 9.2 -6.8 8.8 -5.4L8.2 -3.2L7.6 3H6.4L6 -1.6C3.6 -1.4 1 -.6 -1.6 0C-4.4 .6 -8 .4 -9 -1.6Z'
  return (
    k.draw([{
      d, fill: P.sky1,
      inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, LORL, 0.5) + `<path d="M1.6 -7C3.6 -6.2 5.8 -6.6 7.6 -8.6L8.6 -6.4C6.4 -5 3.6 -5.2 1.6 -7Z" fill="${LORL}"/>` +
        hair(-7.6, -2.6, -3, -3.4, 1, -5.2, 0.5, '#fff') + hair(-6, -.8, -2, -1.2, 4.6, -2.4, 0.4, LORL) + `<path d="M6.8 -1.4L7.4 2.6" stroke="#fff" stroke-width=".35"/>`,
    }], 0.5) +
    sparkle(-4.4, -3.4, 1.6, '#fff')
  )
}

/** Fuegos artificiales: rayos que caen un poco, con estrellitas en las puntas y una corona interior. */
function burst(k: Kit, cx: number, cy: number, R: number, n: number, c1: string, c2: string, w = 1) {
  let s = k.shade(ellipse(cx, cy, R * 1.15, R * 1.15), k.rad(c1, 0.5, 0.5, 0.5, 0.55, 0), c1, 0.35)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.13, cs = Math.cos(a), sn = Math.sin(a)
    const x1 = cx + cs * R, y1 = cy + sn * R + R * 0.1
    s += hair(cx + cs * R * 0.16, cy + sn * R * 0.16, cx + cs * R * 0.62, cy + sn * R * 0.62, x1, y1, w, c1) +
      `<circle cx="${f(x1)}" cy="${f(y1)}" r="${f(w * 0.62)}" fill="${c2}"/>` +
      (i % 2 ? `<circle cx="${f(x1 + cs * 1.4)}" cy="${f(y1 + sn * 1.4 + 1.6)}" r="${f(w * 0.34)}" fill="${c2}" opacity=".85"/>` : '')
    if (i % 2 === 0) {
      const b = a + Math.PI / n, cb = Math.cos(b), sb = Math.sin(b)
      s += hair(cx + cb * R * 0.12, cy + sb * R * 0.12, cx + cb * R * 0.34, cy + sb * R * 0.34, cx + cb * R * 0.5, cy + sb * R * 0.5 + R * 0.03, w * 0.7, c2)
    }
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.09)}" fill="#fff"/>`
}

/** Almenas a lo largo de un borde superior, de x0 a x1 a la altura y. */
const merlons = (x0: number, x1: number, y: number, n: number, h = 2.4) => {
  const w = (x1 - x0) / (n * 2 - 1)
  let d = `M${x0} ${f(y + h)}`
  for (let i = 0; i < n * 2 - 1; i++) d += i % 2 ? `H${f(x0 + (i + 1) * w)}V${f(y)}` : `V${f(y)}H${f(x0 + (i + 1) * w)}V${f(y + h)}`
  return d
}

export const TCG_LORCANA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Ilumineer ──────────────────────────────────────────────────────

  // Tres ganadas: la primera gota de tinta mágica se suelta del plumín, con el polvo dorado girando adentro.
  'Gota de tinta': (u) => {
    const k = kit(u)
    return (
      lorNight(k, 0.48, 0.58) +
      k.sun(56, 72, 17, 46, 28, false) +
      k.shade(ellipse(56, 72, 24, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(55 46) rotate(50) scale(1.15)">` + nib(k) + `</g>` +
      `<path d="${taper(55.2, 46.6, 55.4, 48.4, 56, 50.4, 1.4, 0.5)}" fill="${LOR}"/>` +
      `<g transform="translate(56 74)">` + k.cast([DROP], 2.2, 2.2, '#06142F') + inkDrop(k) + `</g>` +
      sparkle(33, 56, 2.2, '#fff') + sparkle(84, 64, 1.8, '#fff') + sparkle(36, 84, 1.4, P.goldL) + sparkle(40, 32, 1.4, '#fff') +
      k.defs()
    )
  },

  // Quince: el tintero de cristal rebalsa y de la tinta salen, solos, la manzana y el zapatito de los cuentos.
  'Tintero mágico': (u) => {
    const k = kit(u)
    const GLASS = '#D6E4F5'
    const body = 'M-17 0L-18 -3V-17C-18 -19.4 -16.4 -21.2 -13 -22H13C16.4 -21.2 18 -19.4 18 -17V-3L17 0Z'
    const ink = 'M-15.6 -1.8V-14.4C-10 -13 -4 -15.2 0 -14.4C4 -13.6 10 -15.4 15.6 -14.4V-1.8Z'
    const top = 'M-13 -22C-10.6 -24.6 -8.4 -25.8 -7.4 -26H7.4C8.4 -25.8 10.6 -24.6 13 -22Z'
    const collar = 'M-7.4 -25.6V-30.8H7.4V-25.6Z'
    const rim = 'M-8.8 -30.8H8.8V-33.2H-8.8Z'
    const lid = 'M8.4 -33C9.6 -38.4 13.6 -41.4 17 -40C19.4 -38.8 18.6 -34.6 14.6 -32.4Z'
    const spillL = 'M-8.8 -33.2C-9.8 -30.6 -9.2 -28 -10.6 -25.8C-11.8 -23.8 -14.4 -23.4 -15.2 -21.2C-15.8 -19.4 -15.2 -17.6 -15.4 -15.6C-15.6 -14 -13.2 -13.8 -13.2 -15.4C-13.2 -17.4 -13 -19.2 -11.8 -20.6C-10.4 -22.2 -8 -23.4 -7.4 -26Z'
    const spillR = 'M8.8 -33.2C9.4 -30.6 8.6 -28 9.8 -25.8C10.8 -24 13.2 -23.4 13.6 -21.4C14 -19.6 13.2 -18.4 13.6 -16.8C13.9 -15.4 15.8 -15.6 15.8 -17C15.8 -19 15.6 -21 14.6 -22.8C13.4 -25 10.6 -25.4 10 -28.4Z'
    const drip = 'M-2.4 -31C-2.8 -28.6 -1.8 -26.6 -2.2 -24.2C-2.5 -22.6 -.4 -22.4 -.2 -24C0 -26 .8 -28.6 1.2 -31Z'
    const puddle = ellipse(0, 0.6, 25, 3.8)
    const plume = taper(60, 61, 70, 47, 50.6, 40.6, 3.2, 7.6)
    const plume2 = taper(61.6, 60, 66.4, 50.6, 75.6, 46.4, 2.4, 4.6)
    const dust = [[51, 33.6, 0.7], [44.6, 44.6, 0.55], [56.4, 31, 0.45], [79, 47.6, 0.55], [72.6, 41, 0.45], [70.6, 49.4, 0.4], [54, 46, 0.45], [66, 38, 0.4], [86, 47, 0.4]]
    return (
      lorNight(k, 0.5, 0.48) +
      glory(k, 60, 58, 14, 46, 24, LORL, 0.8) +
      k.shade(ellipse(62, 42, 26, 20), k.rad(LORL, 0.5, 0.5, 0.5, 0.75, 0), LORL, 0.45) +
      `<g transform="translate(60 94)">` +
      k.draw([{ d: puddle, fill: LOR, inner: k.sh(puddle, 0, 0, 1, 1, 0, 0.9, LORD, 0.5) + hair(-20, -0.8, -10, -2.6, 2, -2.4, 0.7, LORL) }], 0.6) +
      k.cast([body], 2.2, 1.6, '#06142F') +
      k.draw([
        { d: lid, fill: P.gold, inner: k.sh(lid, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M10.6 -34.6C12 -37.6 14.6 -39 16.8 -38.2" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` + hair(11, -36.4, 13, -39, 16, -39.6, 0.5, '#fff') },
        {
          d: body, fill: GLASS,
          inner:
            `<path d="${ink}" fill="${LOR}"/>` + k.sh(ink, 0, 0, 1, 1, 0, 0.9, LORD, 0.5) + `<path d="M-15.6 -14.4C-10 -13 -4 -15.2 0 -14.4C4 -13.6 10 -15.4 15.6 -14.4" fill="none" stroke="${LORL}" stroke-width=".6"/>` +
            `<path d="M-18 -23H-9.6V1H-18Z" fill="#fff" opacity=".35"/>` + `<path d="M9.6 -23H18V1H9.6Z" fill="${LORD}" opacity=".3"/>` +
            `<path d="M-9.6 -22V0M9.6 -22V0" stroke="${LORL}" stroke-width=".55"/>` +
            `<path d="M-18 -3.6H18V1H-18Z" fill="${P.sky}" opacity=".85"/><path d="M-18 -3.6H18" stroke="${P.white}" stroke-width=".5"/>` +
            hair(-14.6, -20, -15.2, -11, -14.4, -5, 1, '#fff', 0.95) + hair(-7.4, -20, -7.8, -14, -7.2, -6, 0.6, '#fff', 0.7) + hair(12.6, -19, 13, -12, 12.4, -6, 0.5, '#fff', 0.6) +
            `<path d="${starPath(0, -8, 4.4, 1.7, 8)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="0" cy="-8" r="1.1" fill="${P.goldL}"/>`,
        },
        { d: top, fill: GLASS, inner: k.sh(top, 0, 0, 1, 0, 0, 0.9, LORL, 0.5) + hair(-10, -23, -7, -25, -2, -25.4, 0.5, '#fff') },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-7.4 -28.2H7.4" stroke="${P.goldD}" stroke-width=".4"/>` + hair(-5.6, -26, -5.8, -28, -5.6, -30.4, 0.6, '#fff') },
        { d: rim, fill: P.gold, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: spillL, fill: LOR, inner: k.sh(spillL, 0, 0, 1, 0, 0, 0.8, LORD, 0.4) + hair(-9.6, -30, -10.4, -26, -13.6, -22.6, 0.45, LORL) },
        { d: spillR, fill: LOR, inner: k.sh(spillR, 0, 0, 1, 0, 0, 0.8, LORD, 0.4) },
        { d: drip, fill: LOR },
      ], 0.65) +
      `<circle cx="9" cy="-32.6" r="1" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      // La tinta que sube sola, aclarándose en polvo de estrellas.
      k.draw([
        { d: plume2, fill: LORL, inner: k.sh(plume2, 0, 0, 1, 1, 0, 0.8, LOR, 0.45) + hair(63.6, 56, 67, 50.4, 73, 47, 0.5, '#fff') },
        { d: plume, fill: LORL, inner: k.sh(plume, 0, 0, 1, 0, 0.1, 0.95, LOR, 0.5) + `<path d="M48 36H62V62H48Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.75, 0)}"/>` + hair(59.4, 58, 66, 47, 54.6, 41.4, 0.7, P.goldL) + hair(61.8, 57, 68.4, 48, 63, 42.4, 0.5, P.gold, 0.8) },
      ], 0.55) +
      `<ellipse cx="60" cy="61" rx="8.6" ry="1.8" fill="${LORD}" stroke="${P.ink}" stroke-width=".5"/><path d="M57 61.2C58 60 61 59.8 63.4 60.8" fill="none" stroke="${LORL}" stroke-width=".5"/>` +
      dust.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}"/>`).join('') +
      `<g transform="translate(47.4 37.4) rotate(-8) scale(.98)">` + apple(k) + `</g>` +
      `<g transform="translate(80 42) rotate(-14) scale(1.08)">` + slipper(k) + `</g>` +
      sparkle(36, 52, 1.8, P.goldL) + sparkle(88, 60, 1.6, '#fff') + sparkle(63, 28, 1.8, '#fff') +
      k.defs()
    )
  },

  // Cuarenta: la puerta de la Gran Iluminaria se abre sola y la luz baja por la escalinata. El timbre, ni lo tocaste.
  'Gran Ilumineer': (u) => {
    const k = kit(u)
    const frame = 'M36.6 90V46A23.4 23.4 0 0 1 83.4 46V90ZM47 90H73V46A13 13 0 0 0 47 46Z'
    const opening = 'M47 90H73V46A13 13 0 0 0 47 46Z'
    const doorL = 'M46 92L53.4 86.4V40.6L46 31Z', doorR = 'M74 92L66.6 86.4V40.6L74 31Z'
    const keystone = 'M56.2 21.6H63.8L62.4 33.6H57.6Z'
    const capL = 'M34.8 43.6H48.6V47.4H34.8Z', capR = 'M71.4 43.6H85.2V47.4H71.4Z'
    const baseL = 'M35 86H48.4V90H35Z', baseR = 'M71.6 86H85V90H71.6Z'
    const steps = ['M38 90H82V93.4H38Z', 'M31 93.4H89V97H31Z', 'M24 97H96V101H24Z']
    const voussoirs = Array.from({ length: 9 }, (_, i) => {
      const a = Math.PI + ((i + 1) / 10) * Math.PI, c = Math.cos(a), s = Math.sin(a)
      return `M${f(60 + c * 13)} ${f(46 + s * 13)}L${f(60 + c * 23.4)} ${f(46 + s * 23.4)}`
    }).join('')
    const beams = Array.from({ length: 9 }, (_, i) => {
      const a = (-90 + (i - 4) * 9) * Math.PI / 180, w = 0.05
      return `M60 66L${f(60 + Math.cos(a - w) * 40)} ${f(66 + Math.sin(a - w) * 40)}L${f(60 + Math.cos(a + w) * 40)} ${f(66 + Math.sin(a + w) * 40)}Z`
    }).join('')
    const filig = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)"><path d="M47.6 46C49.6 48 50.4 51 49.4 53.6C48.6 55.6 50 57 51.6 56.2M47.6 64C49.6 66 50.4 69 49.4 71.6C48.6 73.6 50 75 51.6 74.2" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-linecap="round"/>` +
      `<path d="M47.2 41V88.6M52.6 42V85.6" stroke="${P.goldD}" stroke-width=".4"/><circle cx="51.6" cy="62" r=".7" fill="${P.goldL}"/></g>`
    const flute = (x: number) => hair(x, 50, x - 0.3, 68, x, 85, 0.5, P.sky2)
    const bell = 'M-3.4 3.4C-3.4 -.2 -2.4 -2.8 0 -2.8C2.4 -2.8 3.4 -.2 3.4 3.4L4.4 4.6H-4.4Z'
    return (
      lorNight(k, 0.5, 0.5) +
      k.sun(60, 60, 16, 50, 32, false) +
      k.shade(ellipse(60, 62, 30, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.4) +
      // Luz adentro: dorado que se vuelve blanco al fondo, con los haces que salen.
      k.clip(opening,
        `<path d="${opening}" fill="${P.goldL}"/>` + k.shade(opening, k.rad('#fff', 0.5, 0.62, 0.5, 1, 0), '#fff', 0.7) +
        `<path d="${beams}" fill="#fff" opacity=".55"/>` +
        k.draw([
          { d: doorL, fill: LOR, inner: k.sh(doorL, 0, 0, 1, 0, 0.6, 0, LORD, 0.5) + filig(1) },
          { d: doorR, fill: LORD, inner: k.sh(doorR, 0, 0, 1, 0, 0, 0.4, LORN, 0.5) + filig(-1) },
        ], 0.5) +
        k.shade('M52 86H68V91H52Z', k.lin(P.gold, 0, 0, 0, 1, 0, 0.6), P.goldD, 0.3)) +
      // Escalinata con la luz derramada encima.
      k.draw(steps.map((d, i) => ({ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.sky2, 0.4) + k.sh(d, 0, 0, 1, 0, 0.5, 0.9, P.blue, 0.3) + `<path d="M${50 - i * 4} ${[90, 93.4, 97][i]}L${70 + i * 4} ${[90, 93.4, 97][i]}L${74 + i * 6} ${[93.4, 97, 101][i]}L${46 - i * 6} ${[93.4, 97, 101][i]}Z" fill="${P.goldL}" opacity=".8"/>` })), 0.6) +
      k.cast([frame], 1.8, 1.8, '#06142F') +
      k.draw([
        {
          d: frame, fill: P.white,
          inner:
            k.sh(frame, 0, 0, 1, 0, 0, 0.85, P.sky, 0.45) + k.sh(frame, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.35) +
            `<path d="${voussoirs}" stroke="${P.sky2}" stroke-width=".55"/>` +
            `<path d="M47 90V46A13 13 0 0 1 73 46V90" fill="none" stroke="${P.gold}" stroke-width="1.6"/><path d="M47.8 90V46A12.2 12.2 0 0 1 72.2 46V90" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
            `<path d="M36.6 46A23.4 23.4 0 0 1 83.4 46" fill="none" stroke="${P.gold}" stroke-width=".7" transform="translate(60 46) scale(.93) translate(-60 -46)"/>` +
            flute(39.6) + flute(42) + flute(44.4) + flute(75.6) + flute(78) + flute(80.4) +
            `<path d="M38.4 46A21.6 21.6 0 0 1 81.6 46" fill="none" stroke="${P.gold}" stroke-width="1.2" stroke-dasharray=".01 2.3" stroke-linecap="round"/>`,
        },
      ], 0.75) +
      k.draw([
        { d: capL, fill: P.gold, inner: k.sh(capL, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        { d: capR, fill: P.gold, inner: k.sh(capR, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        { d: baseL, fill: P.gold, inner: k.sh(baseL, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        { d: baseR, fill: P.gold, inner: k.sh(baseR, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        { d: keystone, fill: P.gold, inner: k.sh(keystone, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + hair(57.6, 22.6, 58.2, 27, 58.6, 32, 0.5, '#fff') },
      ], 0.55) +
      `<path d="M36 45.5H48M72 45.5H84M35.6 88H48M72 88H84.6" stroke="${P.goldD}" stroke-width=".4"/>` +
      [36, 48.4, 71.6, 84].map((x) => `<circle cx="${x}" cy="45.5" r="1.1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<circle cx="60" cy="27" r="2.4" fill="${LOR}" stroke="${P.ink}" stroke-width=".45"/><path d="M58.8 26.2A1.4 1.4 0 0 1 60.4 25.4" fill="none" stroke="#fff" stroke-width=".55" stroke-linecap="round"/>` +
      // El timbre al costado, quieto.
      `<path d="M83.6 52.4H88.6C90.6 52.4 91 50.4 89.8 49.6" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M83.6 52.4H88.6C90.6 52.4 91 50.4 89.8 49.6" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>` +
      `<g transform="translate(88.6 56.6)">` + k.draw([{ d: bell, fill: P.gold, inner: k.sh(bell, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + hair(-2, 3, -2, 0, -0.6, -2, 0.5, '#fff') }], 0.45) + `<circle cx="0" cy="5.4" r=".9" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".3"/></g>` +
      sparkle(60, 64, 3.6, '#fff') + sparkle(30, 38, 2, P.goldL) + sparkle(91, 74, 1.6, '#fff') + sparkle(28, 72, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Musical ────────────────────────────────────────────────────────

  // Cinco canciones: la cortina cerrada (que nadie escuche) y las notas que se escapan por arriba con el vapor.
  'Cantor de ducha': (u) => {
    const k = kit(u)
    const ROD = 53
    const rings = Array.from({ length: 10 }, (_, i) => 22 + i * 8.4)
    let top = `M18 ${ROD + 2}`
    rings.forEach((x, i) => { if (i) top += `Q${f(x - 4.2)} ${ROD + 4.8} ${f(x)} ${ROD + 2}` })
    const curtain = top + 'V112H18Z'
    const folds = rings.map((x) => k.sh(`M${f(x + 1)} ${ROD}H${f(x + 6.6)}V114H${f(x + 1)}Z`, 0, 0, 1, 0, 0, 0.85, LORD, 0.5)).join('')
    const crests = rings.map((x) => hair(x - 1.4, ROD + 5, x - 2.4, 80, x - 1.4, 108, 0.75, LORL, 0.75)).join('')
    const pattern = [[30, 66], [47, 62], [64, 68], [81, 63], [38, 80], [56, 86], [74, 82], [90, 78], [47, 97], [66, 99]].map(([x, y]) => `<path d="${starPath(x, y, 1.5, 0.6, 5)}" fill="${P.goldL}" opacity=".9"/>`).join('')
    const tiles = Array.from({ length: 14 }, (_, i) => `M${8 + i * 8} 0V130`).join('') + Array.from({ length: 16 }, (_, i) => `M0 ${2 + i * 8}H120`).join('')
    const head = 'M-6.6 0C-6.6 -3.6 -3.6 -6.2 0 -6.2C3.6 -6.2 6.6 -3.6 6.6 0Z'
    const face = ellipse(0, 0, 6.6, 1.7)
    const pipe = 'M71.6 4V22.6C71.6 26.4 69.2 28.8 65.4 28.8H63V25.2H65.4C67 25.2 68 24.2 68 22.6V4Z'
    const jets = [-5.4, -3.2, -1, 1.2, 3.4, 5.6].map((dx, i) => hair(55 + dx * 1.3, 39 + dx * 0.3, 54 + dx * 1.7, 45, 53 + dx * 2.2, ROD - 1, i % 2 ? 0.55 : 0.75, LORL, 0.9)).join('')
    const drops = [[45, 47], [49.6, 50], [58, 48], [63.4, 50.6], [41.4, 51]].map(([x, y]) => `<path d="M${x} ${f(y - 1.4)}C${f(x + 0.8)} ${f(y - 0.2)} ${f(x + 0.8)} ${f(y + 0.8)} ${x} ${f(y + 0.8)}C${f(x - 0.8)} ${f(y + 0.8)} ${f(x - 0.8)} ${f(y - 0.2)} ${x} ${f(y - 1.4)}Z" fill="${LORL}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.white}"/>` + `<path d="${tiles}" stroke="${P.sky2}" stroke-width=".6"/>` +
      k.shade('M0 0H120V130H0Z', k.rad(LORL, 0.5, 0.4, 0.7, 0, 1), LORL, 0.5) +
      // Ducha: caño, flor y los chorros que se pierden detrás de la cortina.
      k.draw([{ d: pipe, fill: P.sky1, inner: k.sh(pipe, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + hair(69.4, 6, 69.6, 16, 69.4, 23, 0.6, '#fff') + `<path d="M67.6 14H72V16.4H67.6Z" fill="${P.sky}"/>` }], 0.6) +
      jets + drops +
      `<g transform="translate(57 36) rotate(-16) scale(1.45)">` +
      `<path d="M2.6 -6.2L3.8 -8.8H6.6L5.6 -5.4Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
      k.draw([{ d: head, fill: P.sky1, inner: k.sh(head, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + hair(-4.4, -1, -3.6, -4.2, -0.6, -5.2, 0.6, '#fff') + `<path d="M-5 -2.4Q0 -1 5 -2.4" fill="none" stroke="${P.blue}" stroke-width=".35"/>` }, { d: face, fill: P.sky, inner: [-4, -2, 0, 2, 4, -3, -1, 1, 3].map((x, i) => `<circle cx="${x}" cy="${i < 5 ? -0.3 : 0.7}" r=".35" fill="${P.mid}"/>`).join('') }], 0.4) +
      `</g>` +
      // Vapor y notas que se escapan por arriba.
      hair(30, 52, 25, 45, 31, 38, 1, P.sky, 0.9) + hair(90, 52, 95, 46, 90, 40, 1, P.sky, 0.9) + hair(78, 50, 74, 44, 78, 38, 0.8, P.sky, 0.8) +
      note(k, 35, 49.6, 1.25, -14, P.gold, P.goldD) + note(k, 84.4, 47.6, 1.15, 12, P.gold, P.goldD) + note(k, 74.6, 38.4, 0.75, 4, P.gold, P.goldD) +
      // Barral y cortina zafiro con estrellitas doradas.
      k.draw([{ d: curtain, fill: LOR, inner: folds + crests + pattern + k.sh(`M18 ${ROD}H102V${ROD + 14}H18Z`, 0, 0, 0, 1, 0.45, 0, LORD, 0.35) }], 0.75) +
      `<path d="M16 ${ROD - 2.6}H104V${ROD}H16Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".7"/><path d="M16 ${ROD - 1.8}H104" stroke="#fff" stroke-width=".6"/>` +
      rings.map((x) => `<ellipse cx="${x}" cy="${ROD + 0.4}" rx="1.7" ry="2.6" fill="none" stroke="${P.ink}" stroke-width="1.2"/><ellipse cx="${x}" cy="${ROD + 0.4}" rx="1.7" ry="2.6" fill="none" stroke="${P.gold}" stroke-width=".5"/>`).join('') +
      sparkle(46, 30, 1.6, '#fff') +
      k.defs()
    )
  },

  // Veinte: el micrófono de los viernes, bajo el cañón de luz, con su cartelito de "reservado".
  'Karaoke de los viernes': (u) => {
    const k = kit(u)
    const caps = 'M-11 -12C-11 -20 -6 -24 0 -24C6 -24 11 -20 11 -12V4C11 10 6 14 0 14C-6 14 -11 10 -11 4Z'
    const slots = Array.from({ length: 12 }, (_, i) => `M-12 ${f(-19.6 + i * 2.7)}H12`).join('')
    const band = 'M-11.4 -4.6H11.4V-1.4H-11.4Z'
    const yoke = 'M-14 -4.6C-14 8 -8 17.4 0 17.4C8 17.4 14 8 14 -4.6H11.6C11.6 6.6 6.6 15 0 15C-6.6 15 -11.6 6.6 -11.6 -4.6Z'
    const rod = 'M-1.4 17H1.4V46H-1.4Z'
    const base = 'M-13 46.8C-13 44.4 -7 43 0 43C7 43 13 44.4 13 46.8C13 49.2 7 50.6 0 50.6C-7 50.6 -13 49.2 -13 46.8Z'
    const tag = 'M0 0L3 -4.4H23.2V4.4H3Z'
    const cone = 'M51 4H69L92 98H28Z'
    return (
      lorNight(k, 0.5, 0.6) +
      k.shade(cone, k.lin(P.goldL, 0, 0, 0, 1, 0.7, 0.2), P.goldL, 0.35) +
      k.floor(60, 95.6, 26, 4.4, P.goldL) + k.shade(ellipse(60, 95.6, 22, 3.4), k.rad(P.goldL, 0.5, 0.5, 0.5, 1, 0.2), P.goldL, 0.7) +
      note(k, 33, 47, 1.2, -16, P.gold, P.goldD) + note(k, 87, 58, 1, 14, P.gold, P.goldD) + note(k, 82, 34, 0.8, 8, LORL, LOR) +
      `<g transform="translate(60 47.4)">` +
      k.floor(1, 47, 14, 2.4, '#06142F') +
      k.draw([
        { d: base, fill: P.sky1, inner: k.sh(base, 0, 0, 1, 1, 0, 0.9, P.blue, 0.5) + `<path d="M-12 46.8C-8 48.6 8 48.6 12 46.8" fill="none" stroke="${P.blue}" stroke-width=".4"/>` + hair(-9, 45.4, -4, 44.4, 1, 44.2, 0.6, '#fff') },
        { d: rod, fill: P.sky1, inner: k.sh(rod, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + `<path d="M-1.4 30H1.4V32H-1.4Z" fill="${P.gold}"/>` },
        { d: yoke, fill: P.gold, inner: k.sh(yoke, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        {
          d: caps, fill: P.white,
          inner:
            `<path d="${slots}" stroke="${P.blue}" stroke-width="1.1"/>` + `<path d="${slots}" stroke="${P.mid}" stroke-width=".45" transform="translate(0 .5)"/>` +
            `<path d="M-2.2 -26H2.2V16H-2.2Z" fill="${P.white}"/><path d="M-2.2 -26V16M2.2 -26V16" stroke="${P.blue}" stroke-width=".45"/>` +
            k.sh(caps, 0, 0, 1, 0, 0.05, 0.9, P.mid, 0.5) + `<path d="M-12 -26H-5V16H-12Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.6, 0)}"/>` +
            hair(-7.6, -18, -9.4, -6, -7.4, 8, 1, '#fff', 0.9),
        },
        { d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-11.4 -3H11.4" stroke="${P.goldD}" stroke-width=".35"/>` },
      ], 0.7) +
      `<circle cx="-12.8" cy="-3" r="1.6" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><circle cx="12.8" cy="-3" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<circle cx="0" cy="-3" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>` +
      // El cartelito, atado al pie con una cinta.
      `<path d="M1.4 24.6C3.6 25 5 26 5.8 27.4" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M1.4 24.6C3.6 25 5 26 5.8 27.4" fill="none" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/>` +
      `<g transform="translate(5.4 27.4) rotate(16)">` + k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 0, 1, 0, 0.6, P.brown, 0.3) + `<path d="M5 -3.2H21.4" stroke="${P.red}" stroke-width=".35"/>` }], 0.45) + `<circle cx="3.4" cy="0" r=".9" fill="${LORN}" stroke="${P.gold}" stroke-width=".4"/>` +
      `<text x="13.2" y="1.3" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="3.5" fill="${P.ink}" text-anchor="middle">reservado</text></g>` +
      `</g>` +
      sparkle(46.4, 26.6, 1.8, '#fff') + sparkle(30, 70, 1.4, '#fff') +
      k.defs()
    )
  },

  // Sesenta: se cierra la función con fuegos artificiales sobre un castillo de cuento, con las ventanas encendidas.
  'Gala en el castillo': (u) => {
    const k = kit(u)
    const hill = 'M10 106C26 94 44 89 60 89C76 89 94 94 110 106Z'
    const wall = merlons(40, 80, 79, 7) + 'V93H40Z'
    const keep = merlons(51, 69, 70, 4, 2.2) + 'V93H51Z'
    const towerL = 'M35 93V73.6H44V93Z', towerR = 'M76 93V71.6H85V93Z'
    const roofL = 'M33.6 73.8L39.5 61L45.4 73.8Z', roofR = 'M74.6 71.8L80.5 58L86.4 71.8Z', roofK = 'M53.6 70.4L60 54.6L66.4 70.4Z'
    const CASTLE = '#163F78'
    const win = (x: number, y: number, w = 1.6, h = 2.8) => `<path d="M${x} ${y + h}V${f(y + w / 2)}A${w / 2} ${w / 2} 0 0 1 ${f(x + w)} ${f(y + w / 2)}V${y + h}Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`
    const flag = (x: number, y: number) => `<path d="M${x} ${y}V${y - 5.4}" stroke="${P.ink}" stroke-width=".55"/><path d="M${x} ${y - 5.4}L${x + 4} ${f(y - 4.4)}L${x} ${f(y - 3.4)}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>`
    const stone = (x0: number, x1: number, y0: number, y1: number) => {
      let s = ''
      for (let y = y0, r = 0; y < y1; y += 2.6, r++) s += `M${x0} ${f(y)}H${x1}` + Array.from({ length: Math.ceil((x1 - x0) / 4) }, (_, i) => `M${f(x0 + i * 4 + (r % 2) * 2)} ${f(y)}v2.6`).join('')
      return `<path d="${s}" stroke="${LORD}" stroke-width=".3" opacity=".8"/>`
    }
    const trail = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${P.goldL}" stroke-width=".55" stroke-dasharray=".01 1.5" stroke-linecap="round"/>`
    return (
      lorNight(k, 0.5, 0.4, STARS.filter(([, y]) => y < 70)) +
      trail(60, 56, 59, 46, 59.6, 37) + trail(44, 64, 40, 56, 37, 50) + trail(80, 60, 82, 52, 84, 47) +
      burst(k, 59.6, 36.4, 19, 30, P.gold, P.goldL, 1.15) + burst(k, 59.6, 36.4, 9.4, 16, '#fff', P.goldL, 0.7) +
      burst(k, 36.6, 49, 10.4, 18, LORL, '#fff', 0.8) + burst(k, 84, 45.6, 10, 18, '#F08C84', '#fff', 0.8) +
      k.draw([{ d: hill, fill: LORD, inner: k.sh(hill, 0, 0, 0, 1, 0, 0.8, LORN, 0.45) + hair(30, 96, 46, 92, 60, 91.6, 0.6, LORL, 0.7) + hair(72, 92.4, 84, 94, 92, 98, 0.5, LORL, 0.6) }], 0.6) +
      flag(39.5, 61) + flag(80.5, 58) + flag(60, 54.6) +
      k.draw([
        { d: wall, fill: CASTLE, inner: stone(40, 80, 81.4, 93) + k.sh(wall, 0, 0, 1, 0, 0, 0.6, LORN, 0.4) },
        { d: towerL, fill: CASTLE, inner: stone(35, 44, 74, 93) + k.sh(towerL, 0, 0, 1, 0, 0.2, 0.8, LORN, 0.45) + `<path d="M35 73.6H39V93H35Z" fill="${LORL}" opacity=".35"/>` },
        { d: towerR, fill: CASTLE, inner: stone(76, 85, 72, 93) + k.sh(towerR, 0, 0, 1, 0, 0.2, 0.8, LORN, 0.45) + `<path d="M76 71.6H80V93H76Z" fill="${LORL}" opacity=".35"/>` },
        { d: keep, fill: CASTLE, inner: stone(51, 69, 72.2, 93) + k.sh(keep, 0, 0, 1, 0, 0.1, 0.7, LORN, 0.45) + `<path d="M51 70H57V93H51Z" fill="${LORL}" opacity=".3"/>` },
        { d: roofL, fill: LOR, inner: k.sh(roofL, 0, 0, 1, 0, 0, 0.9, LORD, 0.5) + hair(37, 72, 38.4, 67, 39.4, 62, 0.4, LORL) + hair(42, 72, 41, 67, 39.8, 62.4, 0.35, LORN) },
        { d: roofR, fill: LOR, inner: k.sh(roofR, 0, 0, 1, 0, 0, 0.9, LORD, 0.5) + hair(78, 70, 79.4, 64, 80.4, 59, 0.4, LORL) + hair(83, 70, 82, 64, 80.8, 59.4, 0.35, LORN) },
        { d: roofK, fill: LOR, inner: k.sh(roofK, 0, 0, 1, 0, 0, 0.9, LORD, 0.5) + hair(56.6, 69, 58.4, 62, 59.8, 56, 0.45, LORL) + hair(63.4, 69, 61.6, 62, 60.2, 56, 0.4, LORN) },
      ], 0.6) +
      win(38.6, 78) + win(79.6, 76) + win(53, 77) + win(65.4, 77) + win(38.6, 85) + win(79.6, 84) + win(46.4, 84.6, 1.4, 2.4) + win(72.4, 84.6, 1.4, 2.4) +
      // Luz de los fuegos en los filos de techos y torres, y los remates dorados.
      hair(33.8, 73, 36.4, 67, 39.4, 61.4, 0.6, P.goldL) + hair(74.8, 71, 77.6, 64.4, 80.4, 58.4, 0.6, P.goldL) + hair(53.8, 69.6, 56.6, 62, 59.8, 55, 0.6, P.goldL) +
      hair(35.2, 75, 35.4, 84, 35.2, 92, 0.5, P.goldL, 0.7) + hair(76.2, 73, 76.4, 82, 76.2, 92, 0.5, P.goldL, 0.7) + hair(51.2, 72, 51.4, 82, 51.2, 92, 0.5, P.goldL, 0.7) +
      `<path d="M33.6 73.8H45.4M74.6 71.8H86.4M53.6 70.4H66.4" stroke="${P.gold}" stroke-width=".8"/>` +
      `<path d="M57.4 72.4H62.6V79.6L60 78L57.4 79.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/><path d="${starPath(60, 75.2, 1.4, 0.55, 5)}" fill="${LOR}"/>` +
      `<path d="M57.4 93V87.6A2.6 2.6 0 0 1 62.6 87.6V93Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M38 70.4H41M79 68.4H82" stroke="${P.gold}" stroke-width=".5"/>` +
      sparkle(46, 26, 1.6, '#fff') + sparkle(76, 26, 1.4, '#fff') + sparkle(28, 66, 1.2, '#fff') +
      k.defs()
    )
  },
}
