// Beach vóley en clave heroica: la pelota de tres aspas, la arena con su grano, el mar en el horizonte y las cosas de
// la playa (las ojotas, la musculosa y el protector, la sombrilla). Las palomitas terminan en milanesa, en castillo
// de arena y en un cangrejo que vuela de costado.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { ARENA, ARENA_D, ARENA_L, FULL, GEORGIA, glow, label, sand, sea, vball } from './_voley-piezas'

/** Goma de las ojotas y su tira. */
const OJOTA = '#4F78A6', OJOTA_D = '#2F527E', TIRA = '#E07B5A'
/** Limón. */
const LIMON = '#EFD36A', LIMON_D = '#C9A93A'
/** Pan rallado. */
const RALLADO = '#D9A766', RALLADO_D = '#A8743A'

/** Papel del día con el grano arena. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#EBD3A0', 0.5, 0.46, 0.7, 0, 1), '#D9B678', 0.45)

/** Granitos de arena sueltos (pan rallado, salpicaduras) dentro de un círculo. */
const crumbs = (cx: number, cy: number, r: number, n: number, c1: string, c2: string, seed = 1) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i * 137.5 + seed * 31) * (Math.PI / 180), d = r * Math.sqrt(((i * 0.618 + seed * 0.13) % 1))
    return `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${i % 3 ? 0.45 : 0.7}" fill="${i % 2 ? c1 : c2}"/>`
  }).join('')

/** Ojota vista desde arriba, con la punta hacia arriba y el centro en (0,0). */
function ojota(k: Kit, flip = false) {
  const sole = 'M0 -17C5.4 -17 7.6 -12 7.4 -6C7.2 0 5.6 3 5.8 8C6 13 4 17 0 17C-4 17 -6 13 -5.8 8C-5.6 3 -7.2 0 -7.4 -6C-7.6 -12 -5.4 -17 0 -17Z'
  const strap = 'M-.4 -10.6C-3 -6 -5.2 -2.4 -7 1L-5.6 2.2C-3.6 -.8 -1.2 -4.6 .4 -8.6C1.8 -4.6 4 -.8 5.8 2.2L7.2 1C5.4 -2.4 3 -6 .6 -10.6Z'
  return `<g transform="scale(${flip ? -1 : 1} 1)">` +
    k.draw([{
      d: sole, fill: OJOTA,
      inner: `<path d="M0 -15C4.2 -15 5.8 -11 5.6 -6C5.4 0 3.8 3 4 8C4.2 12 2.6 15 0 15C-2.6 15 -4.2 12 -4 8C-3.8 3 -5.4 0 -5.6 -6C-5.8 -11 -4.2 -15 0 -15Z" fill="${P.sky}"/>` +
        k.sh(sole, 0, 0, 1, 1, 0, 0.7, OJOTA_D, 0.4) + hair(-3, -12, -4.6, -4, -3, 4, 0.5, '#fff', 0.7) +
        `<ellipse cx="0" cy="-12.4" rx="2.2" ry="1.4" fill="${OJOTA}" opacity=".5"/><ellipse cx="0" cy="10" rx="3" ry="3.4" fill="${OJOTA}" opacity=".35"/>`,
    }], 0.6) +
    k.draw([{ d: strap, fill: TIRA, inner: k.sh(strap, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35) }], 0.45) +
    `<circle cx="0" cy="-10.4" r="1" fill="${TIRA}" stroke="${P.ink}" stroke-width=".4"/>` +
    `</g>`
}

/** Pata de cangrejo (dos tramos) desde (x,y) hacia `a` grados. */
const leg = (x: number, y: number, a: number, s: number, bend: number) => {
  const r = (d: number) => (d * Math.PI) / 180
  const x1 = x + Math.cos(r(a)) * 7 * s, y1 = y + Math.sin(r(a)) * 7 * s
  const x2 = x1 + Math.cos(r(a + bend)) * 7 * s, y2 = y1 + Math.sin(r(a + bend)) * 7 * s
  return taper(x, y, (x + x1) / 2, (y + y1) / 2, x1, y1, 2.6 * s, 2 * s) + taper(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, 2 * s, 0.6 * s)
}

export const BEACHVOLEY_ART: Record<string, (u: number) => string> = {
  // ── Rey de la playa ────────────────────────────────────────────────

  // Cinco ganados: las ojotas hacen de esquina de la cancha, con la soga celeste que sale de ellas.
  'Ojotas en la red': (u) => {
    const k = kit(u)
    const rope = 'M14 70L64 80L108 112'
    return (
      field(k) +
      k.sun(60, 44, 12, 40, 32, false) +
      sea(k, 50, 60) +
      sand(k, 60, 4) +
      `<path d="${rope}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linejoin="round"/><path d="${rope}" fill="none" stroke="${P.sky}" stroke-width="1.2" stroke-linejoin="round"/><path d="${rope}" fill="none" stroke="${P.white}" stroke-width="1.2" stroke-dasharray=".8 1.6"/>` +
      `<g transform="translate(54 80) rotate(-62) scale(.95)">` + ojota(k) + `</g>` +
      `<g transform="translate(70 76) rotate(-36) scale(.95)">` + ojota(k, true) + `</g>` +
      k.floor(84, 64, 8, 1.4, ARENA_D) +
      vball(k, 84, 55, 8.4, { rot: -120 }) +
      label(44, 37, 'esquina', 5.6, -8) +
      sparkle(96, 40, 1.8) +
      k.defs()
    )
  },

  // Veinte ganados: la musculosa colgada de la red al rayo del sol, y el protector factor 50 que llegó tarde.
  'Bronceado de cancha': (u) => {
    const k = kit(u)
    const top = 'M-6.6 -18C-5.6 -12 5.6 -12 6.6 -18H10.6C10.4 -12 12 -8 14.6 -5.6V20H-14.6V-5.6C-12 -8 -10.4 -12 -10.6 -18Z'
    const bottle = 'M-5.4 -9C-5.4 -11.6 5.4 -11.6 5.4 -9V13C5.4 15 3.6 16 0 16C-3.6 16 -5.4 15 -5.4 13Z'
    const cap = roundRect(-3, -15.6, 3, -10.6, 1)
    return (
      field(k) +
      k.sun(60, 42, 16, 46) +
      glow(k, 60, 44, 26, 22, 0.8) +
      sea(k, 70, 78) +
      sand(k, 78, 3) +
      `<path d="M14 40Q60 46 106 40" fill="none" stroke="${P.ink}" stroke-width="1.4"/><path d="M14 40Q60 46 106 40" fill="none" stroke="${P.white}" stroke-width=".5"/>` +
      `<g transform="translate(54 62) rotate(-3)">` +
      k.cast([top], 2, 2, ARENA_D) +
      k.draw([{
        d: top, fill: P.white,
        inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.blue, 0.4) + `<path d="M-14.6 6H14.6V10H-14.6Z" fill="${P.sky}"/>` +
          hair(-8, -2, -9, 6, -8, 18, 0.6, P.blue) + hair(7, 0, 8, 8, 6, 18, 0.5, P.blue) +
          `<path d="M-6.6 -18C-5.6 -12 5.6 -12 6.6 -18" fill="none" stroke="${P.sky}" stroke-width=".8"/>`,
      }], 0.7) +
      [-8.6, 8.6].map((x) => `<path d="M${x - 1.4} -22.6H${x + 1.4}V-15.6H${x - 1.4}Z" fill="${P.brown}" stroke="${P.ink}" stroke-width=".5"/>`).join('') +
      `</g>` +
      `<g transform="translate(80 80) rotate(14) scale(.85)">` +
      k.cast([bottle], 1.6, 1.6, ARENA_D) +
      k.draw([
        { d: cap, fill: P.red, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) },
        { d: bottle, fill: P.gold, inner: k.sh(bottle, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="M-5.4 -3H5.4V8H-5.4Z" fill="${P.white}"/>` + hair(-3.6, -8, -4, 0, -3.6, 12, 0.6, '#fff', 0.8) },
      ], 0.55) +
      `<text x="0" y="5.6" ${GEORGIA} font-weight="700" font-size="7" fill="${P.ink}" text-anchor="middle">50</text>` +
      `</g>` +
      sparkle(36, 30, 2, '#fff') + sparkle(86, 30, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cincuenta ganados: en Playa Grande te guardan la sombrilla. La sombrilla a rayas con su corona y el cartel.
  'Dueño de Playa Grande': (u) => {
    const k = kit(u)
    const canopy = 'M24 52C28 34 44 24 60 24C76 24 92 34 96 52C90 49 84 49 78 52C72 49 66 49 60 52C54 49 48 49 42 52C36 49 30 49 24 52Z'
    const gores = 'M42 52C44 40 50 30 60 24C52 32 48 42 48 50ZM60 24C70 30 76 40 78 52L72 50C72 42 68 32 60 24Z'
    const pole = 'M58.8 24H61.2V88H58.8Z'
    const sign = roundRect(-12, -5.4, 12, 5.4, 1.2)
    const crown = 'M53.6 22L52.4 13.6L56.4 17L60 11.6L63.6 17L67.6 13.6L66.4 22Z'
    return (
      field(k) +
      k.sun(60, 46, 16, 48) +
      glow(k, 60, 48, 30, 28, 0.75) +
      laurel(48, 102, 30, 94, 27, 64, 8) + laurel(72, 102, 90, 94, 93, 64, 8, true) +
      sea(k, 72, 80) +
      sand(k, 80, 3) +
      k.floor(60, 96, 30, 4, ARENA_D) +
      `<g transform="translate(0 9)">` + k.draw([{ d: pole, fill: P.white, inner: `<path d="M58.8 30H61.2V34H58.8ZM58.8 42H61.2V46H58.8ZM58.8 54H61.2V58H58.8ZM58.8 66H61.2V70H58.8ZM58.8 78H61.2V82H58.8ZM58.8 90H61.2V94H58.8Z" fill="${P.red}"/>` }], 0.5) +
      k.cast([canopy], 2, 2.4, P.mid) +
      k.draw([{
        d: canopy, fill: P.white,
        inner: `<path d="${gores}" fill="${P.sky}"/><path d="M20 20H42V54H20ZM78 20H100V54H78Z" fill="${P.sky}"/>` +
          k.sh(canopy, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) +
          `<path d="M24 52C30 49 36 49 42 52C48 49 54 49 60 52C66 49 72 49 78 52C84 49 90 49 96 52" fill="none" stroke="${P.gold}" stroke-width="1.2"/>` +
          hair(30, 46, 38, 32, 54, 26, 0.7, '#fff', 0.8),
      }], 0.75) +
      k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.7, P.goldD, 0.4) + `<path d="M53.6 20H66.4" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.5) +
      `<circle cx="60" cy="11.6" r="1" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      `<g transform="translate(78 84) rotate(6)">` +
      `<path d="M0 5V14" stroke="${P.ink}" stroke-width="2"/><path d="M0 5V14" stroke="${P.brown}" stroke-width="1"/>` +
      k.draw([{ d: sign, fill: P.paper, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) }], 0.5) +
      `<text x="0" y="1.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="4" fill="${P.ink}" text-anchor="middle">reservado</text>` +
      `</g>` +
      vball(k, 44, 86, 7, { rot: -110 }) +
      sparkle(84, 30, 2.4, '#fff') + sparkle(34, 34, 1.8, '#fff') +
      k.defs()
    )
  },

  // ── Arena en los dientes ───────────────────────────────────────────

  // Tres palomitas: la pelota empanada en arena, en el plato con su rodaja de limón. Una milanesa.
  'Milanesa de arena': (u) => {
    const k = kit(u)
    const plate = ellipse(60, 80, 34, 11)
    return (
      field(k) +
      k.sun(60, 50, 14, 44, 32, false) +
      glow(k, 60, 54, 26, 24, 0.6) +
      k.draw([{ d: plate, fill: P.white, inner: `<ellipse cx="60" cy="80" rx="25" ry="7.4" fill="none" stroke="${P.sky}" stroke-width=".8"/>` + k.sh(plate, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) + `<path d="M28 80C30 75 40 71.6 50 71" fill="none" stroke="${P.blue}" stroke-width="1"/>` }], 0.7) +
      k.floor(60, 80, 18, 4, P.blue) +
      vball(k, 58, 64, 15, {
        rot: -90, cols: [ARENA_L, RALLADO, ARENA], shade: RALLADO_D,
        over: crumbs(58, 64, 15, 120, RALLADO_D, ARENA_L) + crumbs(58, 64, 15, 40, P.brownD, RALLADO, 3),
      }) +
      `<g transform="translate(80 74) scale(.7 1) rotate(0)">` +
      k.draw([{ d: ellipse(0, 0, 7.4, 7.4), fill: LIMON, inner: `<circle cx="0" cy="0" r="6.2" fill="#F7E8A6"/><path d="M0 0L5.4 0.0M0 0L3.8 3.8M0 0L0.0 5.4M0 0L-3.8 3.8M0 0L-5.4 0.0M0 0L-3.8 -3.8M0 0L-0.0 -5.4M0 0L3.8 -3.8" stroke="${LIMON_D}" stroke-width=".55"/><circle cx="0" cy="0" r="6.2" fill="none" stroke="${P.white}" stroke-width=".6"/>` + k.sh(ellipse(0, 0, 7.4, 7.4), 0, 0, 1, 1, 0, 0.6, LIMON_D, 0.3) }], 0.6) +
      `</g>` +
      crumbs(34, 80, 4, 8, RALLADO_D, RALLADO, 2) + crumbs(84, 84, 4, 8, RALLADO_D, RALLADO, 5) +
      hair(40, 44, 36, 38, 38, 32, 0.7, P.mid) + hair(78, 44, 82, 38, 80, 32, 0.7, P.mid) +
      sparkle(88, 50, 1.8) + sparkle(30, 58, 1.4) +
      k.defs()
    )
  },

  // Quince palomitas: el castillo de arena que los chicos hacen con tu molde, con la pelota de cúpula y el balde.
  'Castillo humano': (u) => {
    const k = kit(u)
    const body = 'M34 92V66H40V62H44V66H50V62H54V66H66V62H70V66H76V62H80V66H86V92Z'
    const tower = 'M48 66V46H51V43H54V46H57V43H60V46H63V43H66V46H69V43H72V46V66Z'
    const door = 'M56 92V82C56 78 64 78 64 82V92Z'
    const bucket = 'M-6.6 -7H6.6L5 7H-5Z'
    return (
      field(k) +
      k.stage(60, 58, 34) +
      sand(k, 86, 2) +
      k.floor(60, 93, 32, 3, ARENA_D) +
      k.cast([body, tower], 2, 1.6, ARENA_D) +
      k.draw([
        { d: body, fill: ARENA, inner: k.sh(body, 0, 0, 1, 1, 0, 0.7, ARENA_D, 0.45) + crumbs(60, 78, 22, 50, ARENA_D, ARENA_L, 2) + `<path d="M34 74H86M34 84H86" stroke="${ARENA_D}" stroke-width=".4" stroke-dasharray="3 2"/>` },
        { d: tower, fill: ARENA, inner: k.sh(tower, 0, 0, 1, 0, 0, 0.7, ARENA_D, 0.45) + crumbs(60, 56, 10, 22, ARENA_D, ARENA_L, 4) + `<path d="M58 52H62V58H58Z" fill="${ARENA_D}"/>` },
        { d: door, fill: ARENA_D },
      ], 0.7) +
      `<path d="M60 31V18" stroke="${P.ink}" stroke-width="1.2"/><path d="M60 18L69 21L60 24Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/>` +
      vball(k, 60, 37, 8.6, { rot: -95 }) +
      `<g transform="translate(90 88) rotate(10)">` + k.draw([{ d: bucket, fill: P.sky, inner: k.sh(bucket, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<path d="M-6.4 -5H6.4" stroke="${P.white}" stroke-width=".8"/>` }], 0.5) + `<path d="M-6.6 -7C-6 -14 6 -14 6.6 -7" fill="none" stroke="${P.ink}" stroke-width=".7"/></g>` +
      `<g transform="translate(26 88) rotate(-30)">` + k.draw([{ d: 'M-.8 -12H.8V0H-.8Z', fill: P.gold }, { d: 'M-3.2 0H3.2L2.4 6C1.6 8 -1.6 8 -2.4 6Z', fill: P.red }], 0.45) + `</g>` +
      sparkle(36, 40, 2) + sparkle(84, 44, 1.6) +
      k.defs()
    )
  },

  // Cuarenta palomitas: el cangrejo vuela de costado, con las tenazas estiradas, y llega a la pelota.
  'Cangrejo volador': (u) => {
    const k = kit(u)
    const shell = 'M-16 2C-17 -6 -10 -11 0 -11C10 -11 17 -6 16 2C14.6 7 8 9 0 9C-8 9 -14.6 7 -16 2Z'
    const claw = 'M0 0C2 -4 7 -6 11 -4C13 -3 13.4 -1 12.6 0L7.6 -.4L12 1.6C11 4 7 5 4 4C1.4 3.4 0 2 0 0Z'
    const legs = [-1, 1].flatMap((s) => [0, 1, 2].map((i) => leg(s * (6 + i * 3.6), 5, 90 + s * (30 + i * 18), 0.9, s * 30)))
    return (
      field(k) +
      k.sun(60, 56, 15, 46) +
      glow(k, 60, 56, 28, 26, 0.75) +
      laurel(48, 101, 30, 93, 27, 63, 8) + laurel(72, 101, 90, 93, 93, 63, 8, true) +
      sand(k, 90, 2) +
      [0, 1, 2].map((i) => hair(80 + i * 3, 50 + i * 6, 90 + i * 3, 50 + i * 6, 100, 52 + i * 6, 1 - i * 0.2, P.mid, 0.7)).join('') +
      crumbs(76, 88, 6, 14, ARENA_D, ARENA, 7) +
      `<g transform="translate(62 62) rotate(-14)">` +
      k.cast([shell], 2, 2.4, P.goldD) +
      k.draw(legs.map((d) => ({ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35) })), 0.5) +
      `<path d="M-4 -10L-6 -16M4 -10L6 -16" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-4 -10L-6 -16M4 -10L6 -16" stroke="${P.red}" stroke-width=".7" stroke-linecap="round"/>` +
      `<circle cx="-6" cy="-16.6" r="1.6" fill="${P.ink}"/><circle cx="6" cy="-16.6" r="1.6" fill="${P.ink}"/><circle cx="-6.4" cy="-17" r=".5" fill="#fff"/><circle cx="5.6" cy="-17" r=".5" fill="#fff"/>` +
      k.draw([{ d: taper(-12, -4, -18, -6, -22, -12, 3.4, 2.6), fill: P.red }, { d: claw, t: 'translate(-22 -12) rotate(-150) scale(1.05)', fill: P.red, inner: k.sh(claw, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35) }], 0.55) +
      k.draw([{ d: taper(12, -4, 18, -8, 21, -14, 3.4, 2.6), fill: P.red }, { d: claw, t: 'translate(21 -14) rotate(-60) scale(.9)', fill: P.red, inner: k.sh(claw, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35) }], 0.55) +
      k.draw([{
        d: shell, fill: P.red,
        inner: k.sh(shell, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + `<path d="M-16 -11H0V-2H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.35, 0)}"/>` +
          `<path d="M-9 -4C-6 -7 6 -7 9 -4M-6 1C-3 -1 3 -1 6 1" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
          `<path d="${starPath(0, -3, 2.4, 1, 5)}" fill="${P.gold}" stroke="${P.wine}" stroke-width=".3"/>` +
          [-11, -7, 7, 11].map((x) => `<circle cx="${x}" cy="${x < 0 ? -2 : -2}" r=".6" fill="${P.goldL}"/>`).join(''),
      }], 0.7) +
      `</g>` +
      vball(k, 34, 40, 8.6, { rot: -60 }) +
      sparkle(84, 32, 2.4, '#fff') + sparkle(28, 66, 1.6, '#fff') +
      k.defs()
    )
  },
}
