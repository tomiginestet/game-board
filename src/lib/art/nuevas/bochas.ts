// Bochas: las medallas redibujadas con el kit (../kit.ts). Los objetos de la cancha de bochas del club: las bochas
// de resina (rojas y verdes, con su marca grabada), el bochín, el polvo de ladrillo, la boina, el bastón y el
// vermú con soda de después, con su sifón.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { banner, bocha, bochin, BOCHA_R, BOCHA_RD, burst, DIRT, DIRT_D, GEORGIA, glow, puff, speed, sphere, tinted } from './_bolas-piezas'

/** Vermú y la rodaja de naranja. */
const VERMU = '#8E3326', VERMU_D = '#5A1C15', NARANJA = '#E99A44'
/** Vidrio verde del sifón. */
const SIFON = '#9FC2B6', SIFON_D = '#5D8A7C'
/** Paño de la boina. */
const BOINA = '#2B3560', BOINA_L = '#46528A'

const clay = (k: Kit) => tinted(k, '#E6D2BA', '#C9A47E', 0.5)

/** Piso de polvo de ladrillo, de y0 para abajo, con su tablón de madera al fondo. */
function court(k: Kit, y0: number) {
  const d = `M10 ${y0}Q60 ${y0 - 2} 110 ${y0}V130H10Z`
  const specks = Array.from({ length: 22 }, (_, i) => `<circle cx="${f(24 + ((i * 37) % 72))}" cy="${f(y0 + 3 + ((i * 13) % 14))}" r="${i % 3 ? 0.35 : 0.5}" fill="${DIRT_D}" opacity=".8"/>`).join('')
  return k.draw([{ d, fill: DIRT, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, DIRT_D, 0.45) + specks + `<path d="M10 ${f(y0 + 1.4)}Q60 ${f(y0 - 0.6)} 110 ${f(y0 + 1.4)}" fill="none" stroke="#EBD2AE" stroke-width=".6"/>` }], 0.6)
}

/** Boina vasca de costado, apoyada en (0,0), con su rabito arriba. */
function beret(k: Kit) {
  const b = 'M-21 1C-22 -5 -13 -11.4 0 -11.4C13 -11.4 22.4 -6.4 21.6 -.4C21 3 12 4.6 0 4.6C-12 4.6 -20.6 3.6 -21 1Z'
  const band = 'M-19.6 1.6C-12 4 12 4 20.6 .6L21.2 2.6C12 6 -12 6 -19.6 3.6Z'
  return (
    k.draw([
      { d: 'M-.9 -11L-.4 -14.6H.6L1 -11Z', fill: BOINA },
      {
        d: b, fill: BOINA,
        inner: `<path d="M-22 -14H6C0 -10 -12 -6 -22 -2Z" fill="${k.lin(BOINA_L, 0, 0, 0, 1, 0.9, 0)}"/>` + k.sh(b, 0, 0, 1, 1, 0, 0.8, '#121833', 0.45) +
          `<path d="${band}" fill="#1A2140"/>` +
          hair(-16, -4, -8, -9.6, 4, -10.6, 0.7, P.sky, 0.6) + hair(4, -9.6, 12, -8, 18, -3, 0.5, BOINA_L, 0.8),
      },
    ], 0.7)
  )
}

/** Sifón de soda: vidrio verde con la malla, cabeza de metal con el gatillo y el pico. Base en (0,0). */
function sifon(k: Kit) {
  const body = 'M-9 0C-10.4 0 -11 -1 -11 -2.4V-30C-11 -33.6 -8 -36 -4.6 -36H4.6C8 -36 11 -33.6 11 -30V-2.4C11 -1 10.4 0 9 0Z'
  const head = 'M-6 -35.6L-5.2 -45.6C-5 -47.2 -3.6 -48.2 -2 -48.2H2C3.6 -48.2 5 -47.2 5.2 -45.6L6 -35.6Z'
  const spout = 'M-4.4 -44.4H-15.6C-17 -44.4 -18 -43.4 -18 -42V-39.8H-15.4V-41.4H-4.4Z'
  const lever = 'M2 -48C6 -51.6 11 -52 14.6 -50.6L14 -48.6C11 -49.6 7 -49 3.6 -46.6Z'
  let mesh = ''
  for (let i = -6; i <= 6; i++) mesh += `M${f(-12 + i * 4)} -32L${f(12 + i * 4)} 2M${f(12 - i * 4)} -32L${f(-12 - i * 4)} 2`
  return (
    k.draw([
      { d: lever, fill: '#C9D0DE', inner: k.sh(lever, 0, 0, 0, 1, 0, 0.6, P.blue, 0.4) },
      { d: spout, fill: '#C9D0DE', inner: k.sh(spout, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
      { d: head, fill: '#C9D0DE', inner: k.sh(head, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M-6 -39.6H6M-5.6 -42H5.6" stroke="${P.blue}" stroke-width=".45"/><path d="M-3.6 -47V-36" stroke="#fff" stroke-width=".8" opacity=".9"/>` },
      {
        d: body, fill: SIFON,
        inner: k.clip(body, `<path d="${mesh}" stroke="${SIFON_D}" stroke-width=".45" opacity=".8"/>`) +
          `<path d="M-2 -32V-2" stroke="${P.white}" stroke-width=".6" opacity=".7"/>` +
          k.sh(body, 0, 0, 1, 0, 0, 0.8, SIFON_D, 0.45) +
          `<path d="M-11 -34H-5V2H-11Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` + hair(-8, -30, -8.6, -18, -8, -4, 0.9, '#fff', 0.9),
      },
    ], 0.65) +
    `<path d="M-11 -32.6H11" stroke="${P.ink}" stroke-width=".5"/>`
  )
}

/** Vaso de vermú con hielo y la rodaja de naranja en el borde. Base en (0,0). */
function vermu(k: Kit) {
  const glass = 'M-10.4 -26H10.4L9 -1.6C8.9 -.6 8 0 7 0H-7C-8 0 -8.9 -.6 -9 -1.6Z'
  const drink = 'M-12 -15C-6 -13.6 4 -16 12 -14.6V2H-12Z'
  const slice = ellipse(9, -26.4, 6, 6)
  return (
    k.draw([{
      d: glass, fill: P.sky1,
      inner: `<path d="${drink}" fill="${VERMU}"/>` + k.sh(drink, 0, 0, 1, 1, 0, 0.8, VERMU_D, 0.4) +
        `<path d="${roundRect(-6.4, -18.6, 1.4, -11.6, 1.4)}" fill="#fff" opacity=".45" stroke="${P.sky}" stroke-width=".4" transform="rotate(-10 -2.5 -15)"/>` +
        [[-3, -6, 0.7], [2, -9, 0.5], [4.4, -4, 0.6], [-5.4, -10, 0.45], [0, -2.6, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#F4C8B4" stroke-width=".35"/>`).join('') +
        `<path d="M-11 -28H-5L-6 2H-10Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + hair(-7.6, -22, -7.4, -12, -6.8, -3, 0.7, '#fff', 0.85),
    }], 0.6) +
    k.clip('M-20 -40H20V-26H-20Z', k.draw([{ d: slice, fill: NARANJA, inner: `<circle cx="9" cy="-26.4" r="4.8" fill="#F6C27E"/>` + Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M9 -26.4L${f(9 + Math.cos(a) * 4.6)} ${f(-26.4 + Math.sin(a) * 4.6)}" stroke="${NARANJA}" stroke-width=".4"/>` }).join('') }], 0.45)) +
    `<path d="M-10.4 -26H10.4" stroke="${P.white}" stroke-width=".6"/>`
  )
}

/** Bastón de jubilado, con el mango curvo arriba en (x,y) y la punta abajo. */
const cane = (x: number, y: number, len: number, rot: number) => {
  const d = `M${x} ${y + len}V${y}C${x} ${y - 6} ${x - 9} ${y - 6} ${x - 9} ${y + 0.6}`
  return `<g transform="rotate(${rot} ${x} ${y})">` +
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="4.2" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${P.brown}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M${x - 0.6} ${y + len - 2}V${y}C${x - 0.6} ${y - 4.6} ${x - 8} ${y - 4.8} ${x - 8.4} ${y}" fill="none" stroke="#E2B78A" stroke-width=".6" stroke-linecap="round"/>` +
    `<path d="M${x - 1.3} ${y + len - 2.4}H${x + 1.3}V${y + len + 0.6}H${x - 1.3}Z" fill="${P.night}"/>` +
    `<path d="M${x - 1.5} ${y + 8}H${x + 1.5}" stroke="${P.gold}" stroke-width="1.6"/>` +
    `</g>`
}

export const BOCHAS_ART: Record<string, (u: number) => string> = {
  // ── Cancha de bochas ──────────────────────────────────────────────

  // Cinco ganados: la boina del abuelo, prestada, apoyada medio de costado sobre tu bocha roja.
  'Boina del club': (u) => {
    const k = kit(u)
    return (
      clay(k) +
      k.sun(60, 54, 14, 42, 32, false) +
      court(k, 86) +
      k.floor(60, 92, 20, 3, DIRT_D) +
      bocha(k, 60, 72, 18) +
      `<g transform="translate(59 56.4) rotate(-9) scale(1.02)">` + beret(k) + `</g>` +
      bochin(k, 80, 88, 3.2) +
      sparkle(32, 44, 1.8) + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },

  // Veinte victorias: el vermú de después, que paga el otro. El sifón le tira el chorro de soda al vaso.
  'Vermú con soda': (u) => {
    const k = kit(u)
    const jet = 'M43.4 47.4C49 46 55 50 59.8 58'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 93, 30, 3, P.mid) +
      `<g transform="translate(47 91) rotate(-6)">` + k.cast(['M-11 0V-36H11V0Z'], 1.6, 1.2) + sifon(k) + `</g>` +
      `<path d="${jet}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="${jet}" fill="none" stroke="${P.white}" stroke-width="1.1" stroke-linecap="round"/>` +
      [[58, 52, 0.8], [61, 55, 0.6], [55.6, 49.6, 0.5], [63, 59.6, 0.55]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<g transform="translate(71 92)">` + vermu(k) + `</g>` +
      sparkle(86, 46, 2) + sparkle(30, 70, 1.4) +
      k.defs()
    )
  },

  // Sesenta ganados: la bocha dorada en su pedestal, con el bastón de un jubilado apoyado y la cinta de la revancha.
  'Jubilado de oro': (u) => {
    const k = kit(u)
    const plinth = 'M44 75H76L74 87H46Z'
    const top = roundRect(42, 72, 78, 76.6, 1.4)
    return (
      clay(k) +
      k.sun(60, 54, 15, 46, 32, true) +
      glow(k, 60, 54, 22, 22, 0.8) +
      laurel(40, 82, 30, 62, 38, 40, 6) + laurel(80, 82, 90, 62, 82, 40, 6, true) +
      k.cast([plinth], 1.6, 1.4) +
      k.draw([
        { d: plinth, fill: P.mid, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M46 80H74" stroke="${P.gold}" stroke-width=".6"/>` },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 0, 1, 0, 0.6, P.blue, 0.4) },
      ], 0.6) +
      `<text x="60" y="85.4" ${GEORGIA} font-weight="700" font-size="4.4" fill="${P.goldL}" text-anchor="middle">LX</text>` +
      sphere(k, 60, 57, 15, P.gold, P.goldD, { deco: [[-0.05, 0.05], [0.25, -0.12], [0.22, 0.24]].map(([x, y]) => `<circle cx="${f(60 + x * 15)}" cy="${f(57 + y * 15)}" r="1.5" fill="none" stroke="${P.goldD}" stroke-width=".6"/>`).join('') + `<path d="M46 53C52 47 68 47 74 53" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` }) +
      cane(82, 50, 36, 14) +
      banner(k, 60, 91, 38, P.red, P.wine, 'revancha', P.goldL, 4.4) +
      sparkle(46, 46, 2.2, P.white) + sparkle(76, 40, 1.6, P.white) +
      k.defs()
    )
  },

  // ── Bochador ──────────────────────────────────────────────────────

  // Tres bochazos: la bocha verde le pega de lleno a la roja y suena como una bola de billar gigante. ¡Clac!
  'Choque de bochas': (u) => {
    const k = kit(u)
    return (
      clay(k) +
      k.sun(60, 58, 13, 42, 32, true) +
      court(k, 88) +
      k.floor(48, 91, 14, 2.4, DIRT_D) + k.floor(78, 91, 10, 2, DIRT_D) +
      speed(36, 64, 8, 3, 12, 5, P.mid) +
      burst(k, 60, 64, 10, 5, 8, 12) +
      bocha(k, 74, 68, 13) +
      bocha(k, 47, 62, 13.4, true) +
      `<text x="60" y="38" ${GEORGIA} font-style="italic" font-weight="700" font-size="8" fill="${P.ink}" text-anchor="middle" transform="rotate(-6 60 38)">¡clac!</text>` +
      hair(84, 54, 88, 52, 92, 53, 0.6, P.mid) + hair(86, 60, 90, 60, 93, 62, 0.6, P.mid) +
      bochin(k, 46, 91, 3) +
      k.defs()
    )
  },

  // Quince bochazos: un tiro, dos afuera. La verde entra entre las dos rojas y cada una sale para su lado.
  'Carambola': (u) => {
    const k = kit(u)
    return (
      k.day() +
      court(k, 84) +
      `<path d="M60 96L60 70" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.6 1.4" opacity=".8"/>` +
      `<path d="M57 63C52 58 46 55 41 53M63 63C68 58 74 55 79 53" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.6 1.4" opacity=".8"/>` +
      speed(38, 50, 200, 2, 8, 3.4, P.mid) + speed(82, 50, -20, 2, 8, 3.4, P.mid) +
      bocha(k, 38, 50, 9.6) +
      bocha(k, 82, 50, 9.6) +
      `<path d="${starPath(60, 61, 5, 2, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.floor(60, 88, 14, 2.4, DIRT_D) +
      bocha(k, 60, 74, 13, true) +
      `<text x="60" y="30" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle">dos de un tiro</text>` +
      sparkle(46, 30, 1.4) + sparkle(76, 86, 1.4) +
      k.defs()
    )
  },

  // Cuarenta bochazos: no queda bocha rival en pie. La verde, de noche y con brillo de oro, y la roja partida al
  // medio entre el polvo.
  'Demoledora': (u) => {
    const k = kit(u)
    const half = (s: number) => `M0 ${-12}A12 12 0 0 ${s > 0 ? 1 : 0} 0 12L${f(s * 1.4)} 7L${f(-s * 1.2)} 3L${f(s * 1.6)} -1L${f(-s * 0.8)} -5L${f(s * 1)} -9Z`
    const piece = (x: number, y: number, rot: number, s: number) => {
      const d = half(s)
      return `<g transform="translate(${x} ${y}) rotate(${rot})">` + k.draw([{
        d, fill: BOCHA_R,
        inner: k.shade(d, k.rad(BOCHA_RD, s > 0 ? 0.1 : 0.9, 0.3, 1, 0, 0.9), BOCHA_RD, 0.4) +
          `<path d="M0 -12L${f(s * 1)} -9L${f(-s * 0.8)} -5L${f(s * 1.6)} -1L${f(-s * 1.2)} 3L${f(s * 1.4)} 7L0 12" fill="none" stroke="#E8A79C" stroke-width=".7"/>`,
      }], 0.6) + `</g>`
    }
    return (
      k.night() +
      glow(k, 60, 62, 34, 30, 0.6, P.gold) +
      [[30, 30], [90, 32], [42, 22], [78, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      puff(k, 38, 84, 7, DIRT, DIRT_D) + puff(k, 82, 82, 6, DIRT, DIRT_D) +
      piece(35, 62, 24, -0.85) + piece(85, 60, -26, 0.85) +
      burst(k, 60, 66, 25, 16, 12, 4) +
      k.floor(60, 92, 18, 2.6, P.night) +
      bocha(k, 60, 72, 16, true, { deco: `<path d="M48 64C54 58 66 58 72 64" fill="none" stroke="${P.goldL}" stroke-width=".7" opacity=".9"/>` }) +
      sparkle(46, 44, 2.2, P.goldL) + sparkle(76, 40, 1.8, P.goldL) + sparkle(60, 30, 1.4, P.goldL) +
      [[30, 66], [92, 66]].map(([x, y]) => sparkle(x, y, 1.2, P.goldL)).join('') +
      k.defs()
    )
  },
}
