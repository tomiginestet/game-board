// Love Letter en clave heroica: cartas, sobres lacrados y objetos de cortejo, con el frambuesa de la ficha del juego en
// el papel, la noche y los acentos. A los personajes (el vigilante, el sereno, Sherlock, la princesa, el novio) no se
// los dibuja: aparecen por sus objetos (la gorra y el silbato, el farol, la gorra de cazador y la lupa, el frac).
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Frambuesa de la ficha de Love Letter, con su sombra, su luz, un rosa pálido y la noche de bolero. */
const LL = '#C2185B', LL_D = '#7E0F3B', LL_L = '#E8789F', LL_XL = '#F9DCE6', LL_N = '#2C0A1D'
/** Madera de la guitarra y del mango de la lupa. */
const SPRUCE = '#E9B877', MAPLE = '#B5713A', MAPLE_D = '#7A4520'
/** Tweed de la gorra de cazador. */
const TWEED = '#B98D5E', TWEED_D = '#7E5A36', TWEED_L = '#E2C49A'
/** Cromo, hierro y paño negro. */
const CHROME = '#DDE3EE', IRON = '#2E3142', CLOTH = '#25222C', CLOTH_L = '#4A4656'

/** Papel del día con el borde granulado en el frambuesa de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F1C0D1', 0.5, 0.46, 0.7, 0, 1), '#DE8EAD', 0.5)

/** Noche de bolero, con un resplandor frambuesa en el medio. */
const dusk = (k: Kit, cy = 0.42) => `<rect width="120" height="130" fill="${LL_N}"/>` + k.shade(FULL, k.rad(LL_D, 0.48, cy, 0.55, 0.9, 0), LL, 0.35)

/** Escenario rosa: un disco pálido con el borde granulado. */
const stageL = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FCEAF0"/>` + k.shade(ellipse(cx, cy, r, r), k.rad('#F0A6C2', 0.5, 0.5, 0.5, 0, 1), '#EC9ABA', 0.55) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor suave de un color. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Corazón con la punta abajo, centrado en (x, y) y de ancho 2s. */
const heartD = (x: number, y: number, s: number) =>
  `M${x} ${f(y + s * 0.95)}C${f(x - s * 1.5)} ${f(y + s * 0.05)} ${f(x - s * 1.1)} ${f(y - s * 1.05)} ${x} ${f(y - s * 0.4)}C${f(x + s * 1.1)} ${f(y - s * 1.05)} ${f(x + s * 1.5)} ${f(y + s * 0.05)} ${x} ${f(y + s * 0.95)}Z`

/** Cordón: tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Nota musical (corchea) en (x, y). */
const note = (x: number, y: number, r: number, c = P.ink) =>
  `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="2" ry="1.5" transform="rotate(-20)" fill="${c}"/><path d="M1.8 -.4V-8.6C3.6 -7.6 5 -6.4 4.4 -4.4" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/></g>`

/** Sello de lacre frambuesa con un corazón en relieve, centrado en (0,0). */
function seal(k: Kit, r = 5) {
  let d = ''
  for (let i = 0; i <= 18; i++) {
    const a = (i / 18) * Math.PI * 2, rr = r * (1 + (i % 2 ? 0.08 : -0.04) + Math.sin(i * 2.3) * 0.05)
    d += (i ? 'L' : 'M') + f(Math.cos(a) * rr) + ' ' + f(Math.sin(a) * rr)
  }
  d += 'Z'
  return (
    k.draw([{ d, fill: LL, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, LL_D, 0.5) }], 0.45) +
    `<circle r="${f(r * 0.68)}" fill="none" stroke="${LL_D}" stroke-width=".45"/>` +
    `<path d="${heartD(0, 0, r * 0.36)}" fill="${LL_D}" opacity=".75"/><path d="${heartD(-0.25, -0.25, r * 0.36)}" fill="none" stroke="${LL_L}" stroke-width=".35"/>` +
    `<path d="M${f(-r * 0.6)} ${f(-r * 0.3)}A${f(r * 0.66)} ${f(r * 0.66)} 0 0 1 ${f(-r * 0.1)} ${f(-r * 0.66)}" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".75"/>`
  )
}

/** Sobre visto de atrás, centrado en (0,0), con la solapa cerrada y el lacre en la punta. */
function envelope(k: Kit, w: number, h: number, sealR = 5) {
  const x0 = -w / 2, y0 = -h / 2, x1 = w / 2, y1 = h / 2
  const body = roundRect(x0, y0, x1, y1, 1.4)
  const flap = `M${f(x0 + 0.4)} ${f(y0 + 0.4)}L0 ${f(h * 0.14)}L${f(x1 - 0.4)} ${f(y0 + 0.4)}Z`
  return (
    k.draw([{
      d: body, fill: P.white,
      inner: k.sh(body, 0, 0, 1, 1, 0, 0.55, LL_L, 0.3) + `<path d="${body}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
        `<path d="M${f(x0 + 0.6)} ${f(y1 - 0.6)}L${f(-w * 0.07)} ${f(h * 0.06)}M${f(x1 - 0.6)} ${f(y1 - 0.6)}L${f(w * 0.07)} ${f(h * 0.06)}" fill="none" stroke="${LL_L}" stroke-width=".5"/>` +
        `<path d="${flap}" fill="${LL_XL}"/>` + k.sh(flap, 0, 0, 0, 1, 0.1, 0.6, LL_L, 0.3) +
        `<path d="M${f(x0 + 0.4)} ${f(y0 + 0.4)}L0 ${f(h * 0.14)}L${f(x1 - 0.4)} ${f(y0 + 0.4)}" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` +
        hair(x0 + 3, y0 + 3, x0 + w * 0.25, y0 + h * 0.2, -3, h * 0.1, 0.45, '#fff') +
        `<path d="M${f(x0 + 1.4)} ${f(y1 - 1.4)}H${f(x1 - 1.4)}" stroke="${LL_L}" stroke-width=".35" stroke-dasharray="1.2 .9" opacity=".8"/>`,
    }], 0.7) +
    `<g transform="translate(0 ${f(h * 0.14)})">${seal(k, sealR)}</g>`
  )
}

/** Naipe de la corte (sin la marca): borde frambuesa, número romano y un corazón; base en (0,0). */
function courtCard(k: Kit, n: string, w = 13, h = 19) {
  const d = roundRect(-w / 2, -h, w / 2, 0, 1.2)
  return (
    k.draw([{ d, fill: P.white, inner: k.sh(`M1 ${-h - 1}H${w}V1H1Z`, 0, 0, 1, 0, 0, 0.5, LL_L, 0.3) }], 0.5) +
    `<path d="${roundRect(-w / 2 + 1.2, -h + 1.2, w / 2 - 1.2, -1.2, 0.6)}" fill="none" stroke="${LL}" stroke-width=".55"/>` +
    `<path d="${roundRect(-w / 2 + 2, -h + 2, w / 2 - 2, -2, 0.4)}" fill="none" stroke="${P.goldD}" stroke-width=".3" stroke-dasharray=".8 .6"/>` +
    `<path d="${heartD(0, -h * 0.46, w * 0.2)}" fill="${LL}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<text x="${f(-w / 2 + 3.4)}" y="${f(-h + 5.4)}" ${GEORGIA} font-weight="700" font-size="3.6" fill="${LL_D}" text-anchor="middle">${n}</text>`
  )
}

export const LOVELETTER_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Enamorado ──────────────────────────────────────────────────────

  // Tres ganadas: el sobre lacrado recibe el perfumazo de la colonia de abuelo, con pera y borla.
  'Carta perfumada': (u) => {
    const k = kit(u)
    const body = 'M-8.6 -5.4C-8.6 -7 -7.6 -7.6 -6 -7.6H6C7.6 -7.6 8.6 -7 8.6 -5.4V12C8.6 13.6 7.6 14.6 6 14.6H-6C-7.6 14.6 -8.6 13.6 -8.6 12Z'
    const liquid = 'M-7 1.4C-3 .6 3 2.2 7 1.4V11.6C7 12.6 6.4 13.2 5.4 13.2H-5.4C-6.4 13.2 -7 12.6 -7 11.6Z'
    const neck = 'M-2.6 -10.4H2.6V-7.4H-2.6Z', collar = roundRect(-3.8, -13.4, 3.8, -10, 1), head = roundRect(-1.9, -16.4, 1.9, -13.2, 0.6)
    const bulb = ellipse(15.6, -1.6, 4.2, 5.2)
    const net = Array.from({ length: 4 }, (_, i) => `M${f(12 + i * 2.2)} -6.4Q${f(13 + i * 2)} -1.6 ${f(12.4 + i * 2.2)} 3.4`).join('') + 'M11.6 -3.6Q15.6 -2.4 19.6 -3.6M11.4 .2Q15.6 1.4 19.8 .2'
    const bottle =
      `<g transform="translate(75 61) rotate(6) scale(.92)">` +
      cord('M3.8 -11.6C9 -13 14 -10 15.4 -6.6', LL_D, 1) +
      k.draw([{ d: bulb, fill: LL, inner: k.sh(bulb, 0, 0, 1, 1, 0, 0.9, LL_D, 0.5) + `<path d="${net}" fill="none" stroke="${P.goldL}" stroke-width=".35" opacity=".85"/>` }], 0.55) +
      `<path d="M15.6 3.6V6" stroke="${P.goldD}" stroke-width=".7"/><circle cx="15.6" cy="6.4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M14.6 7L13.8 12.4H17.4L16.6 7Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M14.8 8.4V12M15.6 8.4V12.2M16.4 8.4V12" stroke="${P.goldD}" stroke-width=".25"/>` +
      k.draw([
        { d: neck, fill: P.sky1 },
        {
          d: body, fill: LL_XL,
          inner: `<path d="${liquid}" fill="${LL_L}"/>` + k.sh(liquid, 0, 0, 1, 0, 0, 0.8, LL, 0.4) + k.sh(body, 0, 0, 1, 0, 0.3, 0.7, LL_D, 0.3) +
            `<path d="${roundRect(-6.4, -5.4, 6.4, 12.4, 2)}" fill="none" stroke="#fff" stroke-width=".55" opacity=".8"/>` +
            `<path d="M-6.4 -4.6V10.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"/><path d="M5.6 -3V9" stroke="${LL_D}" stroke-width=".5" opacity=".5"/>`,
        },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-3.6 -11.8H3.6" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: head, fill: P.gold, inner: k.sh(head, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
        { d: 'M-1.9 -15.6H-4.4V-14.2H-1.9Z', fill: P.gold },
      ], 0.55) +
      `<path d="${roundRect(-5.4, -1.6, 5.4, 4.4, 0.6)}" fill="${P.white}" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<text x="0" y="2.4" ${GEORGIA} font-style="italic" font-size="2.6" fill="${LL_D}" text-anchor="middle">Colonia</text>` +
      `</g>`
    const mist = [[66, 45, 0.6], [63, 43.4, 0.5], [60.4, 45.4, 0.45], [62.6, 47.8, 0.4], [58, 43, 0.35], [56.6, 46.8, 0.35], [65, 41.6, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LL}"/>`).join('') +
      hair(68, 44.6, 62, 43, 54, 44, 0.5, LL, 0.8) + hair(68, 46, 62, 47, 55, 49.4, 0.45, LL, 0.7)
    return (
      field(k) +
      stageL(k, 60, 60, 34) +
      k.floor(48, 84, 20, 2.8) + k.floor(77, 76, 9, 1.8) +
      `<g transform="translate(47 69) rotate(-9)">` + k.cast([roundRect(-17, -11, 17, 11, 1.4)], 2, 2, LL) + envelope(k, 34, 22, 4.4) + `</g>` +
      [[38, 56, 1], [46.4, 53.4, 1.15], [54.4, 55.4, 0.9]].map(([x, y, sc]) => `<path d="M${x} ${y}c-2.4 -2.4 -2.4 -4.6 0 -6.8s2.4 -4.6 0 -7c-1.4 -1.4 -1.6 -2.6 -.8 -3.8" fill="none" stroke="${LL}" stroke-width="${f(0.7 * sc)}" stroke-linecap="round" opacity=".8" transform="rotate(${f((x - 46) * 0.6)} ${x} ${y})"/>`).join('') +
      mist + bottle +
      sparkle(30, 76, 1.8) + sparkle(88, 36, 2.2) +
      k.defs()
    )
  },

  // Doce ganadas: de noche, la guitarra al pie del balcón; arriba, la ventana encendida y la cortina corrida.
  'Serenata al balcón': (u) => {
    const k = kit(u)
    const body = 'M0 -16.4C6 -16.4 9 -13 9 -9C9 -5.6 6.6 -3.6 6.8 -1C7 1.6 11.6 3.6 11.6 9.4C11.6 15.6 6.4 19.4 0 19.4C-6.4 19.4 -11.6 15.6 -11.6 9.4C-11.6 3.6 -7 1.6 -6.8 -1C-6.6 -3.6 -9 -5.6 -9 -9C-9 -13 -6 -16.4 0 -16.4Z'
    const neck = 'M-1.9 -46H1.9V-15H-1.9Z', head = 'M-2.2 -46L-3 -55.4C-3 -56.4 -2.4 -57 -1.4 -57H1.4C2.4 -57 3 -56.4 3 -55.4L2.2 -46Z'
    const frets = Array.from({ length: 9 }, (_, i) => `M-1.9 ${f(-44 + i * 3.2 - i * i * 0.06)}H1.9`).join('')
    const strings = Array.from({ length: 6 }, (_, i) => { const x = -1.3 + i * 0.52; return `M${f(x * 1.6)} 11.4L${f(x)} -46` }).join('')
    const pegs = [-54.4, -51.6, -48.8].map((y) => `<circle cx="-3.6" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/><circle cx="3.6" cy="${y}" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    const guitar =
      `<g transform="translate(43 70) rotate(24) scale(.92)">` +
      k.cast([body], 1.6, 2, '#000') +
      k.draw([
        { d: neck, fill: MAPLE_D, inner: `<path d="M-1.4 -46H1.4V-15H-1.4Z" fill="${CLOTH}"/><path d="${frets}" stroke="${P.goldL}" stroke-width=".3"/>` },
        { d: head, fill: MAPLE, inner: k.sh(head, 0, 0, 1, 0, 0, 0.8, MAPLE_D, 0.4) + `<path d="M-1 -55.6V-47.4M1 -55.6V-47.4" stroke="${MAPLE_D}" stroke-width=".7"/>` },
        {
          d: body, fill: SPRUCE,
          inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, MAPLE, 0.5) + `<path d="${body}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
            `<path d="${body}" fill="none" stroke="${MAPLE_D}" stroke-width="1.1" transform="scale(.92) translate(0 .3)"/>` +
            hair(-4, 4, -5, 10, -3.4, 16, 0.4, MAPLE, 0.6) + hair(3.4, 2, 4.6, 9, 3, 16, 0.4, MAPLE, 0.6),
        },
      ], 0.65) +
      `<circle cx="0" cy="-4.4" r="4.6" fill="none" stroke="${LL}" stroke-width="1.1"/><circle cx="0" cy="-4.4" r="4.6" fill="none" stroke="${P.gold}" stroke-width=".4" stroke-dasharray=".6 .5"/>` +
      `<circle cx="0" cy="-4.4" r="3.4" fill="${CLOTH}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: roundRect(-5.4, 10.2, 5.4, 12.6, 0.8), fill: MAPLE_D }], 0.3) +
      `<path d="${strings}" stroke="${P.paper}" stroke-width=".2"/>` + pegs +
      cord('M0 -45C-3 -44 -6 -40 -6.6 -36', LL, 1.2) + cord('M0 -45C2 -43 2 -39 4.4 -37', LL, 1.1) +
      `<path d="${heartD(0, -45.2, 1.6)}" fill="${LL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>`
    // El balcón: la fachada de piedra, la ventana en arco encendida con la cortina corrida y la baranda con volutas.
    const wall = 'M66 0H120V130H66Z'
    const win = 'M71 62V40C71 33.4 75.4 29.6 80.6 29.6C85.8 29.6 90.2 33.4 90.2 40V62Z'
    const curtL = 'M71 39C72.2 34 75 31 78.4 30.2C76 35 74.4 42 74.8 48C75 54 74.6 58 74.4 62H71Z', curtR = 'M90.2 39C89 34 86.2 31 82.8 30.2C85.2 35 86.8 42 86.4 48C86.2 54 86.6 58 86.8 62H90.2Z'
    const slab = 'M63 62H99V66H63Z'
    const curl = (x: number, sg: number) => `M${x} 62C${x} 58.4 ${f(x + sg * 3)} 58 ${f(x + sg * 3)} 55.4C${f(x + sg * 3)} 53.4 ${f(x + sg * 0.9)} 53.2 ${f(x + sg * 1.1)} 54.8`
    const rail = `M64.6 51.6H98M64.6 62V51.6` + [68.6, 76, 83.4, 90.8].map((x) => curl(x, 1) + curl(x + 7.4, -1)).join('')
    const stones = 'M66 24H120M66 44H70M92 44H120M66 76H120M66 92H120M74 0V24M96 0V24M84 76V92M104 76V92M70 92V108M92 92V108M104 24V44M108 44V62'
    // El abanico abierto de la princesa, asomado sobre la baranda.
    const fan = (x: number, y: number) => {
      const d = `M${x} ${y}L${f(x - 8.6)} ${f(y - 4.4)}A9.6 9.6 0 0 1 ${f(x + 8.6)} ${f(y - 4.4)}Z`
      const ribs = Array.from({ length: 9 }, (_, i) => { const a = Math.PI + 0.47 + (i / 8) * (Math.PI - 0.94); return `M${x} ${y}L${f(x + Math.cos(a) * 9.4)} ${f(y + Math.sin(a) * 9.4)}` }).join('')
      return k.draw([{ d, fill: LL_L, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, LL, 0.4) + `<path d="${ribs}" stroke="${LL_D}" stroke-width=".4"/>` + `<path d="M${f(x - 8)} ${f(y - 5.6)}A8.8 8.8 0 0 1 ${f(x + 8)} ${f(y - 5.6)}" fill="none" stroke="${P.gold}" stroke-width=".6"/>` }], 0.5) +
        `<circle cx="${x}" cy="${y}" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
    }
    return (
      dusk(k, 0.36) +
      [[34, 48, 0.6], [52, 30, 0.5], [28, 62, 0.45], [56, 46, 0.4], [44, 24, 0.35]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      glow(k, 37, 45, 16, 16, 0.5, LL_L) +
      k.draw([{ d: ellipse(37, 45, 8, 8), fill: P.paper, inner: k.shade(ellipse(37, 45, 8, 8), k.rad(LL_L, 0.36, 0.34, 0.75, 0, 0.6), LL_L, 0.3) + `<circle cx="34.6" cy="43" r="1.6" fill="${LL_XL}"/><circle cx="39.6" cy="48" r="1.1" fill="${LL_XL}"/>` }], 0.45) +
      k.draw([{ d: wall, fill: LL_D, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.8, LL_N, 0.45) + `<path d="${stones}" stroke="${LL_N}" stroke-width=".6" opacity=".8"/>` + `<path d="M66 0H70V130H66Z" fill="${LL}" opacity=".5"/>` }], 0.7) +
      `<path d="${win}" fill="${P.gold}"/>` + k.clip(win, glow(k, 80.6, 46, 12, 18, 0.95, '#ffffff') + k.sh(win, 0, 0, 0, 1, 0.4, 0, P.goldD, 0.3)) +
      k.draw([
        { d: curtL, fill: LL, inner: k.sh(curtL, 0, 0, 1, 0, 0, 0.8, LL_D, 0.45) + hair(72.6, 40, 73.4, 50, 72.8, 61, 0.45, LL_D) },
        { d: curtR, fill: LL, inner: k.sh(curtR, 0, 0, 1, 0, 0, 0.9, LL_D, 0.45) + hair(88.6, 40, 87.8, 50, 88.4, 61, 0.45, LL_D) },
      ], 0.5) +
      `<path d="${win}" fill="none" stroke="${P.ink}" stroke-width=".9"/><path d="M69.4 62V40C69.4 32.6 74.4 28 80.6 28C86.8 28 91.8 32.6 91.8 40V62" fill="none" stroke="${LL_L}" stroke-width="1.1"/>` +
      `<path d="${rail}" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="${rail}" fill="none" stroke="${CLOTH_L}" stroke-width=".4" stroke-linecap="round"/>` +
      k.draw([{ d: slab, fill: LL_L, inner: k.sh(slab, 0, 0, 0, 1, 0, 0.9, LL_D, 0.45) }], 0.6) +
      fan(80.6, 52.4) +
      k.floor(42, 95, 16, 2.2, '#000') +
      guitar +
      note(56, 56, -10, LL_L) + note(60, 44, 8, P.paper) + note(50, 50, -6, LL_L) +
      sparkle(30, 34, 1.8, P.goldL) + sparkle(28, 76, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Treinta y cinco ganadas: la carroza real, dorada, con la corona arriba y pétalos que caen.
  'Casamiento real': (u) => {
    const k = kit(u)
    const body = 'M41 38H79C81 38 82 39 82 41L84 59C84 68 74 73 60 73C46 73 36 68 36 59L38 41C38 39 39 38 41 38Z'
    const roof = 'M35.6 38.4H84.4L82.4 33.6C75 30 45 30 37.6 33.6Z'
    const door = roundRect(50, 41, 70, 69, 3)
    const win = 'M53 56V49C53 45 56 43.4 60 43.4C64 43.4 67 45 67 49V56Z'
    const side = (x: number) => `M${x} 44H${x + 7}V60C${x + 7} 62 ${x + 5.6} 63 ${x + 3.5} 63C${x + 1.4} 63 ${x} 62 ${x} 60Z`
    const crown = 'M52 32L50.6 22.6L55.4 26.6L60 19.6L64.6 26.6L69.4 22.6L68 32Z'
    const wheel = (cx: number, cy: number, r: number) => {
      const spokes = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${f(cx + Math.cos(a) * r * 0.22)} ${f(cy + Math.sin(a) * r * 0.22)}L${f(cx + Math.cos(a) * r * 0.82)} ${f(cy + Math.sin(a) * r * 0.82)}` }).join('')
      const ring = `${ellipse(cx, cy, r, r)} ${ellipse(cx, cy, f(r * 0.82), f(r * 0.82))}`
      return (
        `<path d="${spokes}" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/><path d="${spokes}" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>` +
        `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.4 .5)"/><path d="${ring}" fill-rule="evenodd" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` +
        `<path d="M${f(cx - r * 0.7)} ${f(cy - r * 0.55)}A${f(r * 0.92)} ${f(r * 0.92)} 0 0 1 ${f(cx + r * 0.1)} ${f(cy - r * 0.9)}" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.24)}" fill="${LL}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${cx}" cy="${cy}" r="${f(r * 0.1)}" fill="${P.goldL}"/>`
      )
    }
    const scroll = (x: number, y: number, sx: number) => `<path d="M${x} ${y}c${f(sx * 3)} 0 ${f(sx * 4)} -3 ${f(sx * 2.4)} -4.4c${f(sx * -1.4)} -1 ${f(sx * -2.6)} .4 ${f(sx * -1.6)} 1.6" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>`
    const petals = [[30, 40, 20], [92, 44, -30], [86, 26, 40], [34, 62, -20], [96, 64, 10], [26, 52, 60]].map(([x, y, r], i) =>
      `<path d="${i % 2 ? heartD(x, y, 1.4) : `M${x} ${y}c1.4 -1.6 3.6 -1.4 4 0c-1 1.6 -3 1.8 -4 0Z`}" transform="rotate(${r} ${x} ${y})" fill="${i % 2 ? LL : LL_L}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    return (
      field(k) +
      k.sun(60, 54, 15, 47, 32, false) +
      glow(k, 60, 52, 30, 26, 0.75) +
      laurel(52, 100, 30, 92, 26, 66, 7) + laurel(68, 100, 90, 92, 94, 66, 7, true) +
      k.floor(60, 90, 30, 3) +
      wheel(44, 80, 9.4) +
      `<path d="M44 80L52 70M76 80L70 70" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M44 80L52 70M76 80L70 70" stroke="${P.goldD}" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="M36 64C30 64 28 70 32 72M84 64C90 64 92 70 88 72" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/><path d="M36 64C30 64 28 70 32 72M84 64C90 64 92 70 88 72" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/>` +
      k.cast([body], 2, 2.2, LL_D) +
      k.draw([
        {
          d: body, fill: P.gold,
          inner: k.sh(body, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M36 36H48V76H36Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<path d="M37 64C44 70 76 70 83 64" fill="none" stroke="${P.goldD}" stroke-width=".7"/><path d="M37.6 66.6C46 72 74 72 82.4 66.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
            Array.from({ length: 9 }, (_, i) => `<circle cx="${f(40 + i * 5)}" cy="${f(67.4 + Math.sin((i / 8) * Math.PI) * 3.6)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`).join(''),
        },
        { d: door, fill: LL, line: 0.4, inner: k.sh(door, 0, 0, 1, 1, 0, 0.8, LL_D, 0.45) + `<path d="${roundRect(51.4, 42.4, 68.6, 67.6, 2.4)}" fill="none" stroke="${P.gold}" stroke-width=".6"/>` },
        { d: side(41), fill: LL_D, inner: k.sh(side(41), 0, 0, 1, 0, 0, 0.6, LL_N, 0.3) + `<path d="${side(42.4)}" fill="none" stroke="${P.gold}" stroke-width=".4" transform="scale(.94) translate(2.6 3.2)"/>` },
        { d: side(72), fill: LL_D, inner: k.sh(side(72), 0, 0, 1, 0, 0, 0.8, LL_N, 0.35) },
        { d: roof, fill: P.gold, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M37 37H83" stroke="${P.goldL}" stroke-width=".6"/>` },
      ], 0.75) +
      k.draw([{ d: win, fill: P.sky1, inner: `<path d="M53 49C55 47 57 47 58.4 48.4V56H53Z" fill="${LL_L}"/><path d="M67 49C65 47 63 47 61.6 48.4V56H67Z" fill="${LL_L}"/>` + k.sh(win, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3) + `<path d="M56 46L54.6 52" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` }], 0.45) +
      `<path d="${heartD(60, 62.4, 2.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${heartD(59.6, 62, 1.2)}" fill="${P.goldL}"/>` +
      scroll(44.4, 66, 1) + scroll(75.6, 66, -1) + scroll(39.4, 42, 1) + scroll(80.6, 42, -1) +
      wheel(77, 79, 11.6) +
`<g transform="translate(60 32) scale(.78) translate(-60 -32)">` +
      k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M51.4 29.6H68.6" stroke="${P.goldD}" stroke-width=".6"/>` }], 0.55) +
      `<circle cx="50.6" cy="22" r="1.1" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="60" cy="18.8" r="1.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="69.4" cy="22" r="1.1" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="${heartD(60, 27.4, 1.7)}" fill="${LL}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      petals +
      sparkle(60, 12, 2.6, '#fff') + sparkle(92, 34, 1.8) + sparkle(28, 32, 1.6) +
      k.defs()
    )
  },

  // ── Ojo de guardia ─────────────────────────────────────────────────

  // Cinco aciertos: el poste de la esquina con la gorra de vigilante puesta y el silbato colgado.
  'Vigilante de esquina': (u) => {
    const k = kit(u)
    const post = 'M57.6 49H62.4V97H57.6Z'
    const plate = roundRect(36, 57, 66, 65.6, 0.8)
    const plate2 = 'M62 55.6L84 48.4V56.6L62 63.8Z'
    // La gorra: copa azul noche, banda negra, chapa dorada, visera de charol y barbijo dorado.
    const crownD = 'M36 40C35 34 44 29.4 60 29.4C76 29.4 85 34 84 40C82 43.6 72 45.6 60 45.6C48 45.6 38 43.6 36 40Z'
    const band = 'M40.4 41.4C48 44 72 44 79.6 41.4L80 47C72 49.4 48 49.4 40 47Z'
    const visor = 'M40.6 47C48 49.6 72 49.6 79.4 47C79 51 72 55.6 60 55.6C48 55.6 41 51 40.6 47Z'
    const badge = 'M60 33.4L64.2 35.4V40C64.2 42.4 62 44 60 44.8C58 44 55.8 42.4 55.8 40V35.4Z'
    // El silbato de bronce con su bolilla, colgado de un cordón.
    const whistle = 'M-7.4 -2.6H3C5.6 -2.6 7.6 -.6 7.6 2C7.6 4.6 5.6 6.6 3 6.6C1.2 6.6 -.2 5.6 -1 4.2H-7.4C-8.2 4.2 -8.6 3.6 -8.6 2.8V-1.4C-8.6 -2.2 -8.2 -2.6 -7.4 -2.6Z'
    return (
      field(k) +
      stageL(k, 60, 62, 34) +
      k.floor(60, 96, 14, 2.2) +
      k.draw([{ d: post, fill: IRON, inner: k.sh(post, 0, 0, 1, 0, 0, 0.8, '#000', 0.4) + `<path d="M58.6 48V97" stroke="${CLOTH_L}" stroke-width=".8"/>` + [64, 76, 88].map((y) => `<path d="M57.6 ${y}H62.4" stroke="${CLOTH_L}" stroke-width=".5"/>`).join('') }], 0.6) +
      k.draw([
        { d: plate2, fill: CLOTH, inner: `<path d="M63 56.4L83 49.8V55.6L63 62.2Z" fill="none" stroke="${P.paper}" stroke-width=".4"/>` },
        { d: plate, fill: CLOTH, inner: k.sh(plate, 0, 0, 1, 0, 0, 0.5, '#000', 0.3) + `<path d="${roundRect(37, 58, 65, 64.6, 0.5)}" fill="none" stroke="${P.paper}" stroke-width=".45"/>` },
      ], 0.5) +
      `<text x="51" y="63.2" ${GEORGIA} font-weight="700" font-size="4" letter-spacing=".3" fill="${P.paper}" text-anchor="middle">FLORIDA</text>` +
      `<text font-family="Georgia, serif" font-weight="700" font-size="2.35" fill="${P.paper}" transform="matrix(1 -.33 0 1 64.4 60.6)" textLength="18" lengthAdjust="spacingAndGlyphs">CORRIENTES</text>` +
      cord('M44 65.6C44 70 46 74 49.4 76.4', LL, 0.9) +
      `<g transform="translate(52 78) rotate(28)">` +
      k.draw([{ d: whistle, fill: P.gold, inner: k.sh(whistle, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-7.6 -1.4H2.6" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.5) +
      `<rect x="-3.2" y="-2.6" width="2" height="1.6" fill="${P.ink}"/><circle cx="3" cy="2" r="1.6" fill="${P.goldD}"/><circle cx="-9.4" cy=".6" r="1.1" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      `</g>` +
      `<g transform="translate(60 48) scale(.72) translate(-60 -48)">` +
      k.cast([crownD, visor], 2, 2, LL) +
      k.draw([
        { d: crownD, fill: P.night, inner: k.sh(crownD, 0, 0, 1, 1, 0, 0.8, '#0C1230', 0.45) + `<path d="M40 36C46 32 56 31.4 64 31.6" fill="none" stroke="${P.mid}" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>` + hair(48, 32.6, 60, 31.4, 72, 32.6, 0.4, P.mid, 0.7) },
        { d: band, fill: CLOTH, inner: k.sh(band, 0, 0, 1, 0, 0, 0.7, '#000', 0.4) + `<path d="M41 43C48 45.6 72 45.6 79 43" fill="none" stroke="${P.gold}" stroke-width=".5"/>` },
        { d: visor, fill: '#1A1820', inner: k.sh(visor, 0, 0, 1, 1, 0, 0.6, '#000', 0.3) + `<path d="M45 49.8C52 52.4 66 52.6 74 50.2" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".55"/>` },
      ], 0.7) +
      `<path d="M41.4 47.2C48 51.4 72 51.4 78.6 47.2" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M41.4 47.2C48 51.4 72 51.4 78.6 47.2" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<circle cx="41.6" cy="47.2" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="78.4" cy="47.2" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([{ d: badge, fill: P.gold, inner: k.sh(badge, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.4) +
      `<path d="${starPath(60, 38.8, 2.4, 1, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/><path d="M57 35.6L60 34.2L63 35.6" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` +
      `</g>` +
      hair(64, 74, 68, 72, 72, 74, 0.6, LL) + hair(65, 78, 70, 77.4, 74, 79.6, 0.5, LL) +
      `<text x="80" y="72" ${GEORGIA} font-style="italic" font-size="5.6" fill="${LL_D}" text-anchor="middle" transform="rotate(-10 80 72)">¡priii!</text>` +
      sparkle(32, 40, 1.8) + sparkle(90, 34, 2.2) +
      k.defs()
    )
  },

  // Veinte aciertos: el farol del sereno, con su llavero, alumbra de noche las cartas ajenas.
  'Sereno con linterna': (u) => {
    const k = kit(u)
    const roofD = 'M-7.6 -9L0 -16.6L7.6 -9Z', cap = roundRect(-2.4, -19.4, 2.4, -16.2, 0.8)
    const glass = 'M-6.4 -8.6H6.4L5.4 9H-5.4Z', base = 'M-7.2 9H7.2L6 13.4H-6Z', top = roundRect(-8.2, -10, 8.2, -8, 0.8)
    const flameD = 'M0 -5C2.2 -2 3 0 3 2C3 4.4 1.6 6 0 6C-1.6 6 -3 4.4 -3 2C-3 0 -2.2 -2 0 -5Z'
    const lantern =
      `<g transform="translate(45 55) rotate(-8) scale(.95)">` +
      `<path d="M0 -19.4C-5 -20 -6.6 -25.6 -3 -28.4C0 -30.6 4 -29.8 5 -26.4" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M0 -19.4C-5 -20 -6.6 -25.6 -3 -28.4C0 -30.6 4 -29.8 5 -26.4" fill="none" stroke="${CHROME}" stroke-width=".7" stroke-linecap="round"/>` +
      glow(k, 0, 1, 22, 22, 0.9) +
      k.draw([
        { d: glass, fill: P.goldL, inner: glow(k, 0, 2, 8, 10, 1, '#ffffff') + k.sh(glass, 0, 0, 1, 0, 0.3, 0.6, P.gold, 0.3) },
        { d: base, fill: IRON, inner: k.sh(base, 0, 0, 1, 0, 0, 0.7, '#000', 0.4) + `<path d="M-6.4 10.6H6.4" stroke="${CLOTH_L}" stroke-width=".5"/>` },
        { d: roofD, fill: IRON, inner: k.sh(roofD, 0, 0, 1, 0, 0, 0.8, '#000', 0.4) + `<path d="M-5 -9.6L0 -15M0 -15V-9.6" stroke="${CLOTH_L}" stroke-width=".45"/>` },
        { d: cap, fill: IRON },
        { d: top, fill: IRON, inner: `<path d="M-7.6 -9.4H7.6" stroke="${CLOTH_L}" stroke-width=".5"/>` },
      ], 0.6) +
      k.draw([{ d: flameD, fill: P.gold, inner: `<path d="M0 -2C1.2 0 1.6 1.4 1.6 2.6C1.6 4 .8 4.8 0 4.8C-.8 4.8 -1.6 4 -1.6 2.6C-1.6 1.4 -1.2 0 0 -2Z" fill="#fff"/>` }], 0.3) +
      `<path d="M0 6V8.6" stroke="${P.ink}" stroke-width=".8"/>` +
      `<path d="M-6.4 -8.6L-5.4 9M6.4 -8.6L5.4 9M0 -8.6V-5.6M-6 0H6" stroke="${P.ink}" stroke-width="1" fill="none"/><path d="M-6.4 -8.6L-5.4 9M6.4 -8.6L5.4 9" stroke="${CLOTH_L}" stroke-width=".35"/>` +
      `<path d="M-4.4 -6.4L-3.6 6" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` +
      // El llavero del sereno, colgado del farol.
      `<circle cx="-5.6" cy="16.6" r="2.4" fill="none" stroke="${P.ink}" stroke-width="1.1"/><circle cx="-5.6" cy="16.6" r="2.4" fill="none" stroke="${P.gold}" stroke-width=".45"/>` +
      `<g transform="translate(-6.6 18.6) rotate(18)"><path d="M0 0V8M0 5.6H1.8M0 7.4H1.4" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M0 0V8M0 5.6H1.8M0 7.4H1.4" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/></g>` +
      `<g transform="translate(-4.4 18.8) rotate(-16)"><path d="M0 0V6.6M0 4.6H1.6" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M0 0V6.6M0 4.6H1.6" stroke="${CHROME}" stroke-width=".55" stroke-linecap="round"/></g>` +
      `</g>`
    const cone = 'M50 60L98 80L90 98L46 70Z'
    const table = 'M18 88C40 82 80 78 104 82V110H18Z'
    return (
      dusk(k, 0.5) +
      [[30, 24, 0.6], [60, 20, 0.5], [86, 30, 0.55], [94, 50, 0.4], [70, 36, 0.4], [24, 74, 0.45]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      k.draw([{ d: table, fill: MAPLE_D, inner: k.sh(table, 0, 0, 0, 1, 0, 0.8, LL_N, 0.4) + hair(26, 88, 60, 82, 96, 83.4, 0.5, MAPLE, 0.8) + hair(30, 94, 64, 88, 98, 89, 0.45, MAPLE, 0.7) + `<path d="M18 88C40 82 80 78 104 82" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".6"/>` }], 0.6) +
      k.shade(cone, k.lin(P.goldL, 0, 0, 1, 0, 0.75, 0.15), P.goldL, 0.35) +
      `<g transform="translate(64 88) rotate(-22)">${courtCard(k, 'III')}</g>` + `<g transform="translate(72 87) rotate(-4)">${courtCard(k, 'V')}</g>` + `<g transform="translate(80 88) rotate(16)">${courtCard(k, 'VIII')}</g>` +
      k.shade('M58 60L98 80L92 96L52 72Z', k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0), P.goldL, 0.2) +
      lantern +
      sparkle(90, 66, 2, P.goldL) + sparkle(58, 70, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Sesenta aciertos: la lupa ve en el mate quién tiene la princesa; atrás, la gorra de cazador.
  'Sherlock de barrio': (u) => {
    const k = kit(u)
    const lx = 54, ly = 58, R = 17
    const lens = ellipse(lx, ly, R, R)
    const rim = `${ellipse(lx, ly, R + 3.4, R + 3.4)} ${ellipse(lx, ly, R, R)}`
    const ferrule = 'M-3.4 0H3.4L3 5H-3Z', handle = 'M-3 5H3C3.6 9 3.8 14 3.4 19C3.2 21 2 22 0 22C-2 22 -3.2 21 -3.4 19C-3.8 14 -3.6 9 -3 5Z'
    // El mate agrandado adentro de la lupa: la calabaza, la virola de alpaca, la yerba y la bombilla.
    const gourd = 'M-11 -4C-14.6 1 -15.4 9 -12 15.4C-9 21 -4.6 23.6 0 23.6C4.6 23.6 9 21 12 15.4C15.4 9 14.6 1 11 -4Z'
    const virola = 'M-11.6 -8.6H11.6V-3.4C6 -1.8 -6 -1.8 -11.6 -3.4Z'
    const mate =
      `<g transform="translate(${lx - 1} ${ly + 3}) scale(.66)">` +
      `<path d="M4 -10L13 -30" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M4 -10L13 -30" stroke="${CHROME}" stroke-width="1.7" stroke-linecap="round"/><path d="M5 -12L12 -27.6" stroke="#fff" stroke-width=".5"/>` +
      k.draw([
        { d: gourd, fill: P.brown, inner: k.sh(gourd, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M-14 -4H-4V24H-14Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M-13 8Q0 13 13 8M-12.6 12Q0 17 12.6 12" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` + [-8.4, -4.2, 0, 4.2, 8.4].map((x) => `<path d="M${x} ${f(8.6 + (1 - (x / 13) ** 2) * 2.6)}l1.6 1.6l-1.6 1.6l-1.6 -1.6Z" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".3"/>`).join('') },
        { d: virola, fill: CHROME, inner: k.sh(virola, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M-10.6 -6.4Q0 -4.6 10.6 -6.4" fill="none" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` },
        { d: ellipse(0, -8.6, 11.6, 2.8), fill: CHROME, inner: `<path d="${ellipse(0, -8.4, 9.8, 1.9)}" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` + k.sh(ellipse(0, -8.4, 9.8, 1.9), 0, 0, 1, 0, 0, 0.9, P.greenD, 0.3) },
      ], 0.6) +
      `<path d="M-6 -8.6Q-3 -12.6 1 -8.8Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M4 -10L6.2 -14.8" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M4 -10L6.2 -14.8" stroke="${CHROME}" stroke-width="1.7" stroke-linecap="round"/>` +
      `<ellipse cx="13.4" cy="-30.6" rx="2.4" ry="1.3" transform="rotate(-66 13.4 -30.6)" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(-5, -14, -8, -19, -5, -25, 0.8, P.sky) + hair(-1, -14, 2, -20, -1, -26, 0.7, P.sky) +
      `</g>`
    // La gorra de cazador: copa a cuadros, viseras adelante y atrás, orejeras atadas con moño arriba.
    const dome = 'M-12 2C-12 -7 -6 -12 0 -12C6 -12 12 -7 12 2C6 4 -6 4 -12 2Z'
    const peakF = 'M-12 2C-16 2.4 -19.6 4.4 -20 6.4C-14 7 -8 5.6 -6 3.6Z', peakB = 'M12 2C16 2.4 19.6 4.4 20 6.4C14 7 8 5.6 6 3.6Z'
    const flap = 'M-4.4 2.4C-4.8 6 -3.4 9.4 0 10.2C3.4 9.4 4.8 6 4.4 2.4C1.6 3.2 -1.6 3.2 -4.4 2.4Z'
    const checks = Array.from({ length: 7 }, (_, i) => `M${-12 + i * 4} -14V4`).join('') + Array.from({ length: 5 }, (_, i) => `M-14 ${-10 + i * 3.4}H14`).join('')
    const hat =
      `<g transform="translate(80.6 42) rotate(14) scale(.72)">` +
      k.draw([
        { d: peakB, fill: TWEED, inner: k.sh(peakB, 0, 0, 1, 1, 0, 0.9, TWEED_D, 0.5) + `<path d="${checks}" stroke="${TWEED_D}" stroke-width=".45" opacity=".7"/>` },
        { d: dome, fill: TWEED, inner: k.sh(dome, 0, 0, 1, 1, 0, 0.9, TWEED_D, 0.5) + `<path d="${checks}" stroke="${TWEED_D}" stroke-width=".5" opacity=".75"/><path d="${checks}" stroke="${LL}" stroke-width=".3" opacity=".6" transform="translate(1.6 1.6)"/>` + `<path d="M-9 -4C-7 -8 -3 -10 1 -10.4" fill="none" stroke="${TWEED_L}" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>` + `<path d="M0 -12V2M-6.4 -10C-7.6 -6 -7.6 -2 -6.6 2.6M6.4 -10C7.6 -6 7.6 -2 6.6 2.6" fill="none" stroke="${TWEED_D}" stroke-width=".55"/>` },
        { d: flap, fill: TWEED, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.8, TWEED_D, 0.45) + `<path d="${checks}" stroke="${TWEED_D}" stroke-width=".4" opacity=".7"/>` },
        { d: peakF, fill: TWEED, inner: k.sh(peakF, 0, 0, 1, 1, 0, 0.8, TWEED_D, 0.45) + `<path d="${checks}" stroke="${TWEED_D}" stroke-width=".4" opacity=".7"/>` },
      ], 0.6) +
      `<circle cx="0" cy="-12" r="1.2" fill="${TWEED_D}" stroke="${P.ink}" stroke-width=".4"/>` +
      cord('M0 -12C-3 -15.6 -6 -14.4 -4.4 -12.4C-3.4 -11.4 -1.4 -12 0 -12C1.4 -12 3.4 -11.4 4.4 -12.4C6 -14.4 3 -15.6 0 -12', TWEED_D, 0.7, TWEED_L) +
      `</g>`
    const beads = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return `<circle cx="${f(lx + Math.cos(a) * (R + 1.7))}" cy="${f(ly + Math.sin(a) * (R + 1.7))}" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    return (
      field(k) +
      k.sun(56, 56, 15, 47, 32, false) +
      glow(k, 56, 56, 30, 30, 0.7) +
      laurel(50, 100, 30, 92, 26, 66, 7) + laurel(70, 100, 90, 92, 94, 66, 7, true) +
      hat +
      `<g transform="translate(70.6 73.6) rotate(-42)">` + k.cast([handle], 1.6, 1.6, LL_D) +
      k.draw([
        { d: handle, fill: LL_D, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.8, LL_N, 0.45) + `<path d="M-1.6 7V20" stroke="${LL_L}" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` + [9, 14.6].map((y) => `<path d="M-3.4 ${y}H3.4M-3.4 ${y + 1.2}H3.4" stroke="${P.gold}" stroke-width=".6"/>`).join('') },
        { d: ferrule, fill: P.gold, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-3.2 2.4H3.2" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.6) + `<circle cx="0" cy="22.4" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/></g>` +
      k.clip(lens, `<rect width="120" height="130" fill="${LL_XL}"/>` + k.shade(lens, k.rad(LL_L, 0.5, 0.5, 0.5, 0, 0.9), LL_L, 0.4) + mate + `<path d="${lens}" fill="${k.rad('#ffffff', 0.32, 0.28, 0.5, 0.5, 0)}"/>`) +
      `<path d="${rim}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/><path d="${rim}" fill-rule="evenodd" fill="${P.gold}" stroke="${P.ink}" stroke-width=".7"/>` +
      k.clip(`${ellipse(lx, ly, R + 3.4, R + 3.4)}`, k.sh(ellipse(lx, ly, R + 3.4, R + 3.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45)) +
      beads +
      `<path d="M${f(lx - R * 0.72)} ${f(ly - R * 0.34)}A${f(R * 0.8)} ${f(R * 0.8)} 0 0 1 ${f(lx - R * 0.2)} ${f(ly - R * 0.76)}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>` +
      sparkle(f(lx - R * 0.46), f(ly - R * 0.62), 2.6, '#fff') + sparkle(30, 44, 1.8) + sparkle(90, 66, 1.6) +
      k.defs()
    )
  },

  // ── Corazón roto ───────────────────────────────────────────────────

  // La primera princesa perdida: la carta quedó en visto, con el doble tilde azul y una telaraña de tanto esperar.
  'Mensaje en visto': (u) => {
    const k = kit(u)
    const tick = (x: number, y: number) => `M${x} ${y}L${x + 4.4} ${y + 4.6}L${x + 13} ${y - 6.6}`
    const web = Array.from({ length: 5 }, (_, i) => { const a = (i / 4) * (Math.PI / 2); return `M0 0L${f(Math.cos(a) * 11)} ${f(-Math.sin(a) * 11)}` }).join('') +
      [3.4, 6.4, 9.2].map((r) => Array.from({ length: 4 }, (_, i) => { const a0 = (i / 4) * (Math.PI / 2), a1 = ((i + 1) / 4) * (Math.PI / 2); return `M${f(Math.cos(a0) * r)} ${f(-Math.sin(a0) * r)}Q${f(Math.cos((a0 + a1) / 2) * r * 0.8)} ${f(-Math.sin((a0 + a1) / 2) * r * 0.8)} ${f(Math.cos(a1) * r)} ${f(-Math.sin(a1) * r)}` }).join('')).join('')
    return (
      field(k) +
      stageL(k, 60, 60, 34) +
      k.floor(56, 90, 24, 3) +
      `<g transform="translate(54 70) rotate(-7)">` + k.cast([roundRect(-21, -14, 21, 14, 1.4)], 2.2, 2.2, LL) + envelope(k, 42, 28, 5.4) +
      `<g transform="translate(-20.4 13.4)"><path d="${web}" fill="none" stroke="${P.blue}" stroke-width=".3" opacity=".9"/></g>` +
      `<g transform="translate(20.4 -13.4) rotate(180)"><path d="${web}" fill="none" stroke="${P.blue}" stroke-width=".3" opacity=".9"/></g>` +
      `</g>` +
      `<g transform="translate(-6 5) rotate(-8 74 40)">` +
      `<path d="${tick(62, 40)}" fill="none" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${tick(62, 40)}" fill="none" stroke="${P.sky}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${tick(70, 40)}" fill="none" stroke="${P.ink}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${tick(70, 40)}" fill="none" stroke="${P.sky}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M71.2 43.6L74.4 46.8L82 37" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>` +
      `</g>` +
      `<text x="84" y="53" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 84 53)">visto</text>` +
      `<text x="84.4" y="57.6" ${GEORGIA} font-size="3" fill="${P.mid}" text-anchor="middle" transform="rotate(-8 84 57.6)">23:47</text>` +
      sparkle(32, 44, 1.8) + sparkle(88, 80, 1.5) +
      k.defs()
    )
  },

  // Cinco princesas perdidas: la rocola del bar toca un bolero con el corazón partido; al lado, el vaso.
  'Bolero en la rocola': (u) => {
    const k = kit(u)
    const box = 'M40 54C40 42 48.4 34.4 60 34.4C71.6 34.4 80 42 80 54V92H40Z'
    const arch = 'M44.4 54C44.4 45 51 38.8 60 38.8C69 38.8 75.6 45 75.6 54V60H44.4Z'
    const win = 'M48.6 60V54C48.6 47.6 53.6 43 60 43C66.4 43 71.4 47.6 71.4 54V60Z'
    const grill = roundRect(46, 74, 74, 88, 2)
    const glass = 'M77.6 74.6H87.4L86.6 88H78.4Z'
    const bubbles = Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI, r = 18; return `<circle cx="${f(60 + Math.cos(a) * r)}" cy="${f(54 + Math.sin(a) * r)}" r=".7" fill="#fff" opacity=".85"/>` }).join('')
    return (
      dusk(k, 0.45) +
      [[30, 28, 0.6], [88, 26, 0.5], [24, 60, 0.45], [96, 52, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      glow(k, 58, 56, 34, 34, 0.6, LL_L) +
      k.floor(58, 93, 28, 2.6, '#000') + k.floor(82.6, 88, 6, 1.2, '#000') +
      `<g transform="translate(-4 0)">` +
      k.draw([{
        d: box, fill: MAPLE_D,
        inner: k.sh(box, 0, 0, 1, 0, 0, 0.85, LL_N, 0.5) + `<path d="M40 30H46V96H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          `<path d="M42 92V54C42 43 50 36.4 60 36.4C70 36.4 78 43 78 54V92" fill="none" stroke="${LL}" stroke-width="2.4"/>` + `<path d="M42 92V54C42 43 50 36.4 60 36.4C70 36.4 78 43 78 54V92" fill="none" stroke="${LL_XL}" stroke-width=".8"/>` + bubbles,
      }], 0.75) +
      k.draw([{ d: arch, fill: P.gold, inner: k.sh(arch, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + Array.from({ length: 7 }, (_, i) => { const a = Math.PI + ((i + 0.5) / 7) * Math.PI; return `<path d="M${f(60 + Math.cos(a) * 12)} ${f(54 + Math.sin(a) * 12)}L${f(60 + Math.cos(a) * 15.6)} ${f(54 + Math.sin(a) * 15.6)}" stroke="${P.goldD}" stroke-width=".6"/>` }).join('') }], 0.5) +
      k.draw([{ d: win, fill: LL_N, inner: k.shade(win, k.rad(LL, 0.5, 0.9, 0.7, 0.8, 0), LL, 0.4) + `<ellipse cx="60" cy="57" rx="9" ry="2.6" fill="${CLOTH}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="60" cy="57" rx="6.6" ry="1.8" fill="none" stroke="${CLOTH_L}" stroke-width=".3"/><ellipse cx="60" cy="56.8" rx="2.6" ry=".8" fill="${LL}"/>` + `<path d="M67 46L65.6 54.4L61.4 56.4" fill="none" stroke="${CHROME}" stroke-width=".7"/><circle cx="67" cy="46" r="1" fill="${CHROME}" stroke="${P.ink}" stroke-width=".3"/>` + `<path d="M52 47C53.4 45 56 44.4 58 44.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` }], 0.45) +
      // El disco: corazón partido en la etiqueta.
      `<path d="M57.6 49.6C55 47.6 55.4 45.6 57 45.6C58 45.6 58.6 46.4 58.8 47L58 48.2L59.4 49L58.6 50.4Z" fill="${LL}" stroke="${P.ink}" stroke-width=".3"/><path d="M60.2 50.4L61 49L59.6 48.2L60.4 47C60.8 46.2 61.6 45.6 62.4 45.6C64 45.6 64.2 47.8 60.2 50.4Z" fill="${LL}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{ d: roundRect(46, 62, 74, 71, 1), fill: P.paper, inner: Array.from({ length: 10 }, (_, i) => `<rect x="${f(47.2 + (i % 5) * 5.4)}" y="${i < 5 ? 63.2 : 67.2}" width="4.2" height="2.8" rx=".5" fill="${i === 7 ? LL : P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('') }], 0.45) +
      k.draw([{ d: grill, fill: LL, inner: k.sh(grill, 0, 0, 1, 1, 0, 0.8, LL_D, 0.45) + Array.from({ length: 6 }, (_, i) => `<path d="M${f(49 + i * 4.4)} 74V88" stroke="${CHROME}" stroke-width="1.2"/><path d="M${f(48.6 + i * 4.4)} 74V88" stroke="#fff" stroke-width=".35"/>`).join('') }], 0.5) +
      `<path d="M38.6 92H81.4" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M38.6 92H81.4" stroke="${CHROME}" stroke-width="1.6" stroke-linecap="round"/>` +
      `</g>` +
      k.draw([{ d: glass, fill: P.white, inner: `<path d="M78 81.4H87L86.6 88H78.4Z" fill="${P.goldD}"/>` + k.sh('M78 81.4H87L86.6 88H78.4Z', 0, 0, 1, 0, 0, 0.7, MAPLE_D, 0.4) + `<path d="M79.2 82.6h2.8v2.4h-2.8ZM82.6 81.8h2.8v2.4h-2.8Z" fill="${P.white}" opacity=".7" stroke="${P.ink}" stroke-width=".25"/>` + `<path d="M79.2 76V86" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` + k.sh(glass, 0, 0, 1, 0, 0.3, 0.6, P.sky2, 0.3) }], 0.5) +
      note(32, 42, -10, LL_L) + note(84, 40, 12, P.paper) + note(28, 60, 6, P.paper) + note(88, 58, -8, LL_L) +
      sparkle(60, 22, 2.4, LL_XL) +
      k.defs()
    )
  },

  // Quince desamores: ante el rosetón de la iglesia, el frac alquilado espera en su percha, con la flor marchita.
  'Plantado en el altar': (u) => {
    const k = kit(u)
    const cx = 60, cy = 54, R = 31
    // El rosetón: doce pétalos de vitral alrededor de seis, con el plomo entintado.
    const petal = (a: number, r0: number, r1: number, w: number) => {
      const p = (r: number, da: number) => `${f(cx + Math.cos(a + da) * r)} ${f(cy + Math.sin(a + da) * r)}`
      return `M${p(r0, 0)}Q${p((r0 + r1) / 2, -w)} ${p(r1, 0)}Q${p((r0 + r1) / 2, w)} ${p(r0, 0)}Z`
    }
    const outer = Array.from({ length: 12 }, (_, i) => petal((i / 12) * Math.PI * 2, 14, 28.4, 0.2))
    const inner = Array.from({ length: 6 }, (_, i) => petal((i / 6) * Math.PI * 2 + Math.PI / 6, 5.6, 14, 0.42))
    const dots = Array.from({ length: 12 }, (_, i) => { const a = ((i + 0.5) / 12) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 25)}" cy="${f(cy + Math.sin(a) * 25)}" r="1.5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".6"/>` }).join('')
    const cols = [LL, P.sky, P.gold, LL_L]
    const rose = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${LL_N}"/>` +
      outer.map((d, i) => `<path d="${d}" fill="${cols[i % 4]}" stroke="${P.ink}" stroke-width=".9"/>`).join('') + dots +
      inner.map((d, i) => `<path d="${d}" fill="${cols[(i + 2) % 4]}" stroke="${P.ink}" stroke-width=".9"/>`).join('') +
      `<circle cx="${cx}" cy="${cy}" r="5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".9"/><path d="${heartD(cx, cy, 2.1)}" fill="${LL}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="2.8"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.goldD}" stroke-width="1.2"/><circle cx="${cx}" cy="${cy}" r="${R - 1.8}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>`
    // El frac en su percha: saco negro con solapas de raso, camisa, moño y la flor marchita en el ojal.
    const hook = 'M60 39V27.4C60 25.4 61.6 24.2 63 24.2C64.6 24.2 65.6 25.4 65.4 26.8'
    const hanger = 'M36.6 44.8C46 40.2 54 38.2 60 38.2C66 38.2 74 40.2 83.4 44.8L82.8 47C74 42.8 66 40.8 60 40.8C54 40.8 46 42.8 37.2 47Z'
    const jacket = 'M52 38.4L60 52L68 38.4C72 39 77 41 80.4 43.8C81.6 56 81.8 76 80.8 98H39.2C38.2 76 38.4 56 39.6 43.8C43 41 48 39 52 38.4Z'
    const sleeve = 'M39.6 43.8C36.6 44.8 34.8 47.4 34.4 51C33.6 62 33.6 76 34.2 88.4H41.6C41.8 76 41.8 62 41.6 52.6C41.4 49 40.8 46 39.6 43.8Z'
    const shirt = 'M52.4 38.4C55 38 65 38 67.6 38.4L60 66Z'
    const lapelL = 'M52 38.4L60 52L57.4 66L46 50.6L50 46.6L46.6 42.6Z', lapelR = 'M68 38.4L60 52L62.6 66L74 50.6L70 46.6L73.4 42.6Z'
    const tie = 'M55.6 42C57 41.4 58.6 41.8 60 43C61.4 41.8 63 41.4 64.4 42V46C63 46.6 61.4 46.2 60 45C58.6 46.2 57 46.6 55.6 46Z'
    const tag = 'M0 0L3.6 -2.6H18C19 -2.6 19.6 -2 19.6 -1V6.6C19.6 7.6 19 8.2 18 8.2H3.6Z'
    const wilted = 'M-3.2 0C-3.8 3 -2.6 6.4 -.6 7.2L0 6L.8 7.2C2.8 6.4 3.8 3 3.2 0C1.6 -1.2 -1.6 -1.2 -3.2 0Z'
    const suit =
      `<path d="${hook}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="${hook}" fill="none" stroke="${CHROME}" stroke-width="1" stroke-linecap="round"/>` +
      k.draw([{ d: hanger, fill: MAPLE, inner: k.sh(hanger, 0, 0, 0, 1, 0, 0.8, MAPLE_D, 0.45) + `<path d="M40 44.6C48 41 72 41 80 44.6" fill="none" stroke="${SPRUCE}" stroke-width=".5"/>` }], 0.55) +
      k.cast([jacket, sleeve, sleeve.replace(/(\d+\.?\d*) (\d+\.?\d*)/g, (_, x: string, y: string) => `${f(120 - +x)} ${y}`)], 2.2, 2.4, '#000') +
      k.draw([
        { d: jacket, fill: CLOTH, inner: k.sh(jacket, 0, 0, 1, 0, 0, 0.8, '#000', 0.45) + `<path d="M38 40H46V98H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.2, 0)}"/>` + hair(44, 60, 42, 76, 43, 96, 0.55, CLOTH_L) + hair(76, 60, 78, 76, 77, 96, 0.5, '#000') + hair(60, 66, 60, 80, 60, 98, 0.45, '#000') + hair(48, 70, 52, 72, 56, 71, 0.4, CLOTH_L) },
        { d: shirt, fill: P.white, inner: k.sh(shirt, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + `<path d="M58.4 50L60 56.6L61.6 50" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` + [52, 58].map((y) => `<circle cx="60" cy="${y}" r=".6" fill="${P.ink}"/>`).join('') },
        { d: lapelL, fill: '#3E3A4A', inner: `<path d="M53 40L59 50.6L56.6 62" fill="none" stroke="${CLOTH_L}" stroke-width=".9" opacity=".9"/>` + hair(49, 46, 52, 52, 55, 60, 0.5, '#6A6478') },
        { d: lapelR, fill: '#2E2A36', inner: `<path d="M67 40L61 50.6L63.4 62" fill="none" stroke="${CLOTH_L}" stroke-width=".5" opacity=".7"/>` },
      ], 0.75) +
      `<circle cx="60" cy="72" r="1" fill="${CLOTH_L}" stroke="${P.ink}" stroke-width=".3"/><circle cx="60" cy="79" r="1" fill="${CLOTH_L}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{ d: tie, fill: CLOTH }], 0.35) + `<circle cx="60" cy="44" r="1" fill="${CLOTH}" stroke="${CLOTH_L}" stroke-width=".3"/>` +
      k.draw([
        { d: sleeve, fill: CLOTH, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.7, '#000', 0.4) + `<path d="M34 50H37V90H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` + hair(37.6, 52, 37, 70, 37.8, 86, 0.45, CLOTH_L) + `<path d="M34.2 84.6H41.6" stroke="${CLOTH_L}" stroke-width=".5"/>` },
        { d: `M${120 - 39.6} 43.8C${120 - 36.6} 44.8 ${120 - 34.8} 47.4 ${120 - 34.4} 51C${120 - 33.6} 62 ${120 - 33.6} 76 ${120 - 34.2} 88.4H${120 - 41.6}C${120 - 41.8} 76 ${120 - 41.8} 62 ${120 - 41.6} 52.6C${120 - 41.4} 49 ${120 - 40.8} 46 ${120 - 39.6} 43.8Z`, fill: CLOTH, inner: k.sh('M78 43H86V90H78Z', 0, 0, 1, 0, 0.2, 0.9, '#000', 0.45) + hair(82.4, 52, 83, 70, 82.2, 86, 0.45, '#000') + `<path d="M78.4 84.6H85.8" stroke="${CLOTH_L}" stroke-width=".5"/>` },
      ], 0.7) +
      `<path d="M34.4 88.4H41.4V90.6H34.6ZM78.6 88.4H85.6L85.4 90.6H78.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(52.4, 39, 46, 40.6, 40.4, 43.8, 0.5, CLOTH_L) + hair(67.6, 39, 74, 40.6, 79.6, 43.8, 0.45, '#000') +
      `<path d="M70.4 48.4C73 49.6 74 53.6 72.8 57.6" fill="none" stroke="${P.greenD}" stroke-width="1" stroke-linecap="round"/><path d="M72 52.6C74 51.6 75.6 52.4 75.8 53.8C74.2 54.4 72.8 54 72 52.6Z" fill="#8C9A5A" stroke="${P.ink}" stroke-width=".3"/>` +
      `<g transform="translate(72.8 57.4) rotate(12)">` + k.draw([{ d: wilted, fill: '#F1E4E6', inner: k.sh(wilted, 0, 0, 1, 1, 0, 0.8, '#B88A94', 0.45) + `<path d="M-1.6 .6C-1.8 3 -1.2 5 0 6M1.6 .6C1.8 3 1.2 5 0 6" fill="none" stroke="#9A6B76" stroke-width=".4"/>` + `<path d="M-2.4 .4C-1 1 1 1 2.4 .4" fill="none" stroke="${P.greenD}" stroke-width=".7"/>` }], 0.45) + `</g>` +
      `<path d="M74.4 70.6c1.2 -1.4 3 -1.2 3.4 0c-.8 1.4 -2.6 1.6 -3.4 0Z" fill="#F1E4E6" stroke="${P.ink}" stroke-width=".3" transform="rotate(30 74.4 70.6)"/>`
    return (
      field(k) +
      k.sun(cx, cy, 28, 50, 36, false) +
      glow(k, cx, cy, 38, 38, 0.6) +
      rose +
      k.shade(ellipse(cx, cy, R, R), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.45, 0), '#ffffff', 0.3) +
      `<g transform="translate(60 58) scale(.74) translate(-60 -58)">` + suit + `</g>` +
      `<path d="M60.6 36.4C65 36.6 69.6 36 73.4 35.4" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(73 35.4) rotate(18)">` + k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.5, LL_L, 0.3) }], 0.45) +
      `<circle cx="4" cy="2.8" r=".8" fill="${LL_N}"/><text x="11.6" y="4.4" ${GEORGIA} font-style="italic" font-size="3.2" fill="${P.ink}" text-anchor="middle">alquilado</text></g>` +
      [[34, 90, 30], [79, 90, -20], [74.6, 84, 50]].map(([x, y, r]) => `<path d="M${x} ${y}c1.4 -1.6 3.6 -1.4 4 0c-1 1.6 -3 1.8 -4 0Z" transform="rotate(${r} ${x} ${y})" fill="#F1E4E6" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(90, 28, 2) + sparkle(28, 34, 1.6) +
      k.defs()
    )
  },
}

// Herramientas que quedan disponibles para ajustes.
void taper
