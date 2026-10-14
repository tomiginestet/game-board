// Hockey sobre césped: el palo con su curva (la cuchara) y el puño encintado, la bocha blanca con hoyuelos, el arco
// con la tabla de abajo que suena seco, y la cancha de agua azul. El corner corto se cuenta con el manual, el pizarrón
// y el cañón; las Leonas aparecen por su huella, nunca por sus caras.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { estela, rotulo, voluta, volutas } from './_lote6-piezas'

/** Pizarrón y tiza. */
const PIZARRA = '#2F4A3E', PIZARRA_D = '#1E3229', TIZA = '#EDEBDF'
/** Humo de pólvora. */
const HUMO = '#E6E2D6'

// ── El palo: el puño arriba (y=-56), la cuchara abajo a la izquierda ───────────────────────────────

const STICK = 'M-1.8 -56H1.8V-3C1.8 3.4 -2 7.6 -7.6 7.6C-12 7.6 -14.4 5 -14.4 2C-14.4 -.4 -12.8 -1.6 -11 -1.2C-9.4 -.8 -9 .8 -8 1.6C-5.6 3 -1.8 1.8 -1.8 -3Z'
const GRIP = 'M-2.2 -57H2.2V-36H-2.2Z'

/** Palo de hockey entintado: la caña con su franja, el puño encintado y la cuchara. `x,y` es el talón de la curva. */
function palo(k: Kit, x: number, y: number, rot: number, s = 1, o: { body?: string; bodyD?: string; stripe?: string } = {}) {
  const body = o.body ?? P.mid, bodyD = o.bodyD ?? P.ink, stripe = o.stripe ?? P.gold
  const wraps = Array.from({ length: 9 }, (_, i) => `M-2.4 ${f(-55.6 + i * 2.2)}L2.4 ${f(-54 + i * 2.2)}`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([{
      d: STICK, fill: body,
      inner: k.sh(STICK, 0, 0, 1, 0, 0.1, 0.9, bodyD, 0.45) + `<path d="M-1.8 -58H-.4V8H-1.8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
        `<path d="M-.2 -34V-10" stroke="${stripe}" stroke-width="1"/><path d="M-1.4 -30L1.4 -27M-1.4 -24L1.4 -21" stroke="${P.white}" stroke-width=".55"/>` +
        `<path d="M-1.8 -3C-1.8 1.8 -5.6 3 -8 1.6" fill="none" stroke="${stripe}" stroke-width=".7"/>` +
        hair(-12.6, 4.6, -9, 7.2, -4, 6, 0.6, '#fff', 0.6),
    }], f(0.6 / s)) +
    k.draw([{ d: GRIP, fill: P.white, inner: k.sh(GRIP, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="${wraps}" stroke="${P.blue}" stroke-width=".5"/><path d="M-2.4 -38H2.4V-36H-2.4Z" fill="${P.red}"/>` }], f(0.5 / s)) +
    `</g>`
  )
}

/** Bocha blanca con hoyuelos en (x,y) de radio r. */
function bocha(k: Kit, x: number, y: number, r: number, o: { fill?: string; shade?: string } = {}) {
  const d = ellipse(x, y, r, r), sh = o.shade ?? P.blue
  let dots = ''
  for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
    const px = (i + (j % 2 ? 0.5 : 0)) * 0.3, py = j * 0.27, rr = Math.hypot(px, py)
    if (rr > 0.9) continue
    const sq = Math.sqrt(1 - rr * rr)
    dots += `<ellipse cx="${f(x + px * r)}" cy="${f(y + py * r)}" rx="${f(r * 0.075 * (0.4 + sq * 0.6))}" ry="${f(r * 0.075)}" transform="rotate(${f((Math.atan2(py, px) * 180) / Math.PI)} ${f(x + px * r)} ${f(y + py * r)})" fill="${sh}" opacity="${f(0.35 + (1 - sq) * 0.4)}"/>`
  }
  return (
    k.draw([{ d, fill: o.fill ?? P.white, inner: dots + k.shade(d, k.rad(sh, 0.32, 0.28, 0.85, 0, 0.9), sh, 0.4) }], f(Math.min(0.75, 0.25 + r * 0.06))) +
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.42)}" rx="${f(r * 0.24)}" ry="${f(r * 0.13)}" fill="#fff" opacity=".95" transform="rotate(-38 ${f(x - r * 0.4)} ${f(y - r * 0.42)})"/>`
  )
}

/** Cancha de agua azul desde y0 hasta abajo, con rayas de corte y una línea blanca opcional. */
function cancha(k: Kit, y0: number, line?: number) {
  const d = `M0 ${y0}H120V130H0Z`
  return `<path d="${d}" fill="${P.blue}"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.7, P.mid, 0.45) +
    [0, 1, 2, 3, 4].map((i) => `<path d="M${-10 + i * 30} ${y0}H${6 + i * 30}L${f(-2 + i * 34)} 130H${f(-22 + i * 34)}Z" fill="#fff" opacity=".07"/>`).join('') +
    (line !== undefined ? `<path d="M0 ${line}H120" stroke="#fff" stroke-width="1.2"/>` : '')
}

/** Arco de frente: palos blancos, la red y la tabla oscura abajo. */
function arco(k: Kit, x0: number, x1: number, y0: number, y1: number, board = 7) {
  let g = ''
  for (let x = x0 + 3; x < x1; x += 3.4) g += `M${f(x)} ${y0}V${y1}`
  for (let y = y0 + 3.4; y < y1 - board; y += 3.4) g += `M${x0} ${f(y)}H${x1}`
  const bar = roundRect(x0 - 2, y0 - 2.4, x1 + 2, y0 + 0.8, 1.2)
  const pL = roundRect(x0 - 2, y0 - 2.4, x0 + 1.2, y1, 1.2), pR = roundRect(x1 - 1.2, y0 - 2.4, x1 + 2, y1, 1.2)
  const tabla = `M${x0} ${f(y1 - board)}H${x1}V${y1}H${x0}Z`
  return (
    `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="${P.night}" opacity=".22"/>` +
    `<path d="${g}" stroke="${P.white}" stroke-width=".45" opacity=".9"/>` +
    k.draw([{ d: tabla, fill: P.night, inner: k.sh(tabla, 0, 0, 0, 1, 0, 0.6, '#0F1736', 0.4) + `<path d="M${x0} ${f(y1 - board + 0.8)}H${x1}" stroke="${P.mid}" stroke-width=".6"/>` + `<path d="M${f(x0 + 2)} ${f(y1 - board / 2)}H${x1}" stroke="${P.mid}" stroke-width=".3" stroke-dasharray="3 2"/>` }], 0.45) +
    k.cast([pL, pR, bar], 1.4, 1.4, P.mid) +
    k.draw([
      { d: pL, fill: P.white, inner: k.sh(pL, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
      { d: pR, fill: P.white, inner: k.sh(pR, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
      { d: bar, fill: P.white, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) },
    ], 0.55)
  )
}

/** Huella de leona: almohadilla y cuatro dedos. */
const HUELLA = 'M0 4.6C-4.6 4.6 -7.4 2 -7 -1C-6.6 -3.6 -3.6 -4.4 -1.8 -5.6C-.8 -6.2 .8 -6.2 1.8 -5.6C3.6 -4.4 6.6 -3.6 7 -1C7.4 2 4.6 4.6 0 4.6Z' +
  ellipse(-8.2, -7.8, 2.4, 3) + ellipse(-3, -11.4, 2.4, 3.2) + ellipse(3, -11.4, 2.4, 3.2) + ellipse(8.2, -7.8, 2.4, 3)

export const HOCKEY_ART: Record<string, (u: number) => string> = {
  // ── Palo de oro ─────────────────────────────────────────────────────

  // Cinco goles: la bocha suena seco contra la tabla. El arco de frente y la bocha pegando en la tabla, ¡toc!
  'Bocha a la red': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 52, 32) +
      cancha(k, 80, 84) +
      arco(k, 30, 90, 42, 80, 8) +
      `<path d="M66 72C70 70 74 70 77 72" fill="none" stroke="${P.gold}" stroke-width="1"/>` +
      [[-1, -1], [1, -1], [-1.4, 0.2], [1.4, 0.2], [0, -1.5]].map(([dx, dy]) => hair(60 + dx * 9, 75 + dy * 7, 60 + dx * 11, 75 + dy * 9, 60 + dx * 13, 75 + dy * 11, 0.7, P.gold)).join('') +
      k.floor(60, 80, 8, 1.2, P.night) +
      bocha(k, 60, 74.4, 6) +
      estela(55, 77, 1, -0.25, 3, 10, 2.6, P.white, 0.7) +
      rotulo(60, 34, 9, '¡toc!', { rot: -6 }) +
      sparkle(80, 52, 1.6) + sparkle(40, 56, 1.4) +
      k.defs()
    )
  },

  // Veinticinco goles: tu arrastre da miedo. El palo barriendo y la bocha que sale con la estela, ¡zas!
  'Arrastre letal': (u) => {
    const k = kit(u)
    const sweep = 'M44 88C54 93 66 92 76 86'
    return (
      k.day() +
      k.sun(62, 50, 16, 44, 30, true) +
      cancha(k, 82) +
      `<path d="${sweep}" fill="none" stroke="${P.white}" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>` +
      `<path d="M44 88C54 93 66 92 76 86" fill="none" stroke="${P.white}" stroke-width=".7" stroke-dasharray="2 2" opacity=".9"/>` +
      palo(k, 68, 84, -32, 0.9) +
      estela(76, 58, 0.45, -0.9, 5, 22, 3, P.ink, 0.9) +
      bocha(k, 80, 50, 7.4) +
      `<circle cx="80" cy="50" r="10.6" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-dasharray="1 1.6"/>` +
      rotulo(38, 76, 9, '¡zas!', { rot: -10 }) +
      sparkle(88, 60, 1.8) + sparkle(30, 66, 1.4) +
      k.defs()
    )
  },

  // Ochenta goles: te ponen en la foto con las Leonas. El retrato de oro en la pared, con la huella de la leona.
  'Leona del club': (u) => {
    const k = kit(u)
    const outer = ellipse(60, 56, 22, 27), inner = ellipse(60, 56, 17.4, 22.4)
    let stripes = ''
    for (let i = 0; i < 6; i++) stripes += `<path d="M${f(42.6 + i * 6)} 30H${f(45.6 + i * 6)}V84H${f(42.6 + i * 6)}Z" fill="${P.white}"/>`
    const nail = ellipse(60, 22.6, 1.4, 1.4)
    return (
      k.night() +
      k.sun(60, 56, 26, 46, 24, false) +
      `<path d="M60 22.6L44.4 33M60 22.6L75.6 33" stroke="${P.ink}" stroke-width="1.3"/><path d="M60 22.6L44.4 33M60 22.6L75.6 33" stroke="${P.goldL}" stroke-width=".5"/>` +
      `<path d="${nail}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="${inner}" fill="${P.sky}"/>` + k.clip(inner, stripes + k.sh(inner, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) +
        `<g transform="translate(60 61) scale(1.15)">` + k.draw([{ d: HUELLA, fill: P.gold, inner: k.sh('M-12 -16H12V6H-12Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.5) + `</g>` +
        `<path d="${inner}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.45, 0)}"/>`) +
      (() => {
        const ring = `${outer} ${inner}`, c = k.id('fr')
        return `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/><path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.4"/>` +
          `<path d="${ring}" fill-rule="evenodd" fill="${P.gold}"/>` +
          `<clipPath id="${c}"><path d="${ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${c})">${k.sh(outer, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5)}` +
          Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return `<circle cx="${f(60 + Math.cos(a) * 19.7)}" cy="${f(56 + Math.sin(a) * 24.7)}" r=".9" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` }).join('') +
          `<path d="${ellipse(60, 56, 21, 26)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/><path d="M40 46C41 36 48 30.4 56 29.6" fill="none" stroke="#fff" stroke-width=".9" opacity=".8"/></g>` +
          `<path d="${inner}" fill="none" stroke="${P.ink}" stroke-width=".5"/>`
      })() +
      `<g transform="translate(60 31)">` + voluta('M-6 3C-6 -1 -2 -2.6 .6 -1.2C2.6 0 2 2.6 .4 2.6') + `</g>` +
      `<g transform="translate(60 82) scale(1 -1)">` + voluta('M-6 3C-6 -1 -2 -2.6 .6 -1.2C2.6 0 2 2.6 .4 2.6') + `</g>` +
      rotulo(60, 93, 6.4, 'las Leonas', { c: P.goldL, halo: P.night }) +
      laurel(46, 100, 28, 94, 23, 64, 7) + laurel(74, 100, 92, 94, 97, 64, 7, true) +
      sparkle(36, 30, 2.2, P.goldL) + sparkle(86, 40, 1.8, P.goldL) + sparkle(50, 40, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Especialista en cortos ─────────────────────────────────────────────

  // El primer gol de corto: salió de manual. El libro abierto con la jugada dibujada, y la bocha que salta de la hoja.
  'Primer arrastre': (u) => {
    const k = kit(u)
    const left = 'M60 52C52 47.6 41 47 30 49V82C41 80 52 80.6 60 85Z'
    const right = 'M60 52C68 47.6 79 47 90 49V82C79 80 68 80.6 60 85Z'
    const cover = 'M28 50.6H60H92V85C80 83 68 84 60 88C52 84 40 83 28 85Z'
    const lines = (x0: number, sx: number) => [56, 60, 64].map((y) => `<path d="M${x0} ${y}Q${x0 + sx * 10} ${y - 1.6} ${x0 + sx * 21} ${y - 0.4}" fill="none" stroke="${P.sky2}" stroke-width=".6"/>`).join('')
    return (
      k.day() +
      k.sun(60, 48, 16, 42, 28, false) +
      k.floor(60, 88, 30, 2.6, P.mid) +
      k.draw([{ d: cover, fill: P.red, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.7, P.wine, 0.4) }], 0.6) +
      k.draw([
        { d: left, fill: P.white, inner: k.sh(left, 1, 0, 0, 0, 0, 0.6, P.blue, 0.35) + lines(34, 1) },
        { d: right, fill: P.white, inner: k.sh(right, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) },
      ], 0.5) +
      `<text x="45" y="52.8" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="4.4" fill="${P.ink}" text-anchor="middle" transform="rotate(-4 45 52)">manual</text>` +
      `<path d="M38 77Q44 70 50 74" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-dasharray="1 .9"/><path d="M50 74l-2 -.4l.8 -1.6z" fill="${P.ink}"/>` +
      `<path d="M36 69l2 2m0 -2l-2 2M42 66l2 2m0 -2l-2 2" stroke="${P.red}" stroke-width=".6"/><circle cx="52" cy="70" r="1.1" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M64 80C68 72 70 66 74 62" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-dasharray="1 .9"/><path d="M84 58A9 7 0 0 0 66 58" fill="none" stroke="${P.sky2}" stroke-width=".7"/>` +
      palo(k, 66, 74, 70, 0.48) +
      `<path d="M60 52V85" stroke="${P.ink}" stroke-width=".6"/>` +
      estela(73, 54, 0.5, -1, 3, 10, 2.4, P.ink, 0.7) +
      bocha(k, 76, 44, 6.4) +
      rotulo(76, 32, 6.6, 'p. 1', { rot: 6 }) +
      sparkle(36, 40, 1.8) + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },

  // Ocho goles de corto: tenés pizarrón propio. La jugada preparada en tiza, y la bocha en la repisa del pizarrón.
  'Jugada preparada': (u) => {
    const k = kit(u)
    const frame = roundRect(26, 34, 94, 80, 2), board = roundRect(29, 37, 91, 77, 1)
    const tray = 'M28 79H92V83.4H28Z'
    const chalk = (d: string, w = 0.7) => `<path d="${d}" fill="none" stroke="${TIZA}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(60, 86, 30, 2, P.mid) +
      k.draw([{ d: frame, fill: P.brown, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + hair(28, 35.2, 60, 35, 92, 35.4, 0.6, P.goldL, 0.7) }], 0.65) +
      `<path d="${board}" fill="${PIZARRA}"/>` +
      k.clip(board, k.sh(board, 0, 0, 1, 1, 0, 0.8, PIZARRA_D, 0.45) + hair(34, 50, 50, 46, 70, 44, 2.6, TIZA, 0.12) + hair(52, 70, 70, 66, 86, 68, 2, TIZA, 0.1) +
        chalk('M44 77A16 13 0 0 1 76 77') + chalk('M60 77V74') +
        chalk('M37 44l2.4 2.4m0 -2.4l-2.4 2.4') + chalk('M49 46l2.4 2.4m0 -2.4l-2.4 2.4') + chalk('M80 46l2.4 2.4m0 -2.4l-2.4 2.4') +
        `<circle cx="64" cy="58" r="1.8" fill="none" stroke="${TIZA}" stroke-width=".7"/><circle cx="74" cy="56" r="1.8" fill="none" stroke="${TIZA}" stroke-width=".7"/>` +
        chalk('M39.4 48C44 54 52 58 62 58') + chalk('M62 58l-2.4 -1.6l.4 2.6') +
        chalk('M66 58C70 64 66 70 60 72', 0.7) + chalk('M60 72l2.4 .2l-1.2 -2') +
        chalk('M51.4 48.6C54 52 58 54 63 55', 0.5) +
        `<text x="84" y="70" font-family="Georgia, serif" font-style="italic" font-size="4.6" fill="${TIZA}" text-anchor="middle" opacity=".9">¡gol!</text>`) +
      `<path d="${board}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: tray, fill: P.brown, inner: k.sh(tray, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) }], 0.5) +
      `<g transform="translate(40 77.6) rotate(-8)">` + k.draw([{ d: roundRect(-5, -1, 5, 1.4, 0.8), fill: TIZA, inner: k.sh(roundRect(-5, -1, 5, 1.4, 0.8), 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) }], 0.35) + `</g>` +
      bocha(k, 74, 73.4, 5.2) +
      sparkle(88, 30, 1.8) + sparkle(30, 90, 1.2) +
      k.defs()
    )
  },

  // Veinticinco goles de corto: la arquera rival reza. El cañón dorado disparando la bocha, con su nube de pólvora.
  'Cañón del corto': (u) => {
    const k = kit(u)
    const barrel = 'M-20 -6.2C-22.8 -6.2 -24.4 -3.6 -24.4 0C-24.4 3.6 -22.8 6.2 -20 6.2L14 4.4V-4.4Z'
    const muzzle = 'M12.6 -5.8H17.4C18.4 -5.8 19 -5.2 19 -4.2V4.2C19 5.2 18.4 5.8 17.4 5.8H12.6Z'
    const ring1 = 'M-14 -6.2H-10.4V6H-14Z', ring2 = 'M2 -5.4H5V5.2H2Z'
    const knob = ellipse(-25.4, 0, 2.6, 2.6)
    const carriage = 'M38 82L46 70H64L70 82Z'
    const wheel = `${ellipse(50, 82, 8, 8)} ${ellipse(50, 82, 5.6, 5.6)}`
    const spokes = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI; return `M${f(50 + Math.cos(a) * 5.6)} ${f(82 + Math.sin(a) * 5.6)}L${f(50 - Math.cos(a) * 5.6)} ${f(82 - Math.sin(a) * 5.6)}` }).join('')
    const smoke = [[76, 50, 6], [83, 46, 5], [80, 56, 4.6], [88, 52, 4]].map(([x, y, r]) => ellipse(x, y, r, r * 0.86)).join('')
    const gold = (d: string) => ({ d, fill: P.gold, inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-30 -8H20V-2H-30Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.55, 0)}"/>` })
    return (
      k.night() +
      [[30, 30], [90, 28], [96, 72], [24, 70], [46, 22]].map(([x, y], i) => sparkle(x, y, 1 + (i % 2) * 0.7, P.goldL)).join('') +
      k.floor(56, 90, 24, 2.4, P.ink) +
      k.draw([{ d: carriage, fill: P.brown, inner: k.sh(carriage, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<circle cx="56" cy="74" r=".9" fill="${P.gold}"/><circle cx="62" cy="77" r=".9" fill="${P.gold}"/>` }], 0.6) +
      `<g transform="translate(52 66) rotate(-24)">` +
      k.draw([gold(barrel), gold(muzzle), gold(ring1), gold(ring2), gold(knob)], 0.6) +
      `<path d="M-8 -3C-6 -5 -2 -5 0 -3M-8 3C-6 5 -2 5 0 3" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<path d="${starPath(-4, 0, 2, 0.8, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` +
      `<ellipse cx="19" cy="0" rx="1" ry="4.2" fill="${P.night}"/>` +
      `</g>` +
      `<g transform="translate(-.6 0)">` + `<path d="${wheel}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.5 .6)"/><path d="${wheel}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.2"/><path d="${wheel}" fill-rule="evenodd" fill="${P.brown}"/>` +
      `<path d="${spokes}" stroke="${P.ink}" stroke-width="1.6"/><path d="${spokes}" stroke="${P.brown}" stroke-width=".8"/><circle cx="50" cy="82" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/></g>` +
      `<path d="${smoke}" fill="${P.ink}" transform="translate(.6 .7)"/><path d="${smoke}" fill="none" stroke="${P.ink}" stroke-width="1.2"/><path d="${smoke}" fill="${HUMO}"/>` +
      k.clip(smoke, k.sh(smoke, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4)) +
      estela(77, 38, 0.6, -0.8, 3, 10, 2.6, P.goldL, 0.8) +
      bocha(k, 80, 33.6, 5.4) +
      rotulo(42, 44, 9, '¡bum!', { rot: -12, c: P.goldL, halo: P.night }) +
      volutas(60, 99, 20, 0.42) +
      k.defs()
    )
  },
}
