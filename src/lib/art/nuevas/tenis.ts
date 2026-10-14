// Tenis: la pelota de fieltro con su costura, la raqueta encordada (de grafito o de madera, la de los 70), el polvo
// de ladrillo y el tubo de pelotas. Los que pide cada chiste: el mate, el cañón, el metro de carpintero y la vincha.
// A las personas reales (Karlović, Del Potro, Vilas) no se las dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'
import { banner, CLAY, CLAY_D, label, PINO, PINO_D, puff, racket, tennisBall, trail, voluta } from './_raquetas-piezas'

/** Yerba y calabaza del mate. */
const YERBA = '#8DA453', YERBA_D = '#5E7434'
/** Verde gris de las sierras de Tandil. */
const SIERRA = '#9DB08A', SIERRA_D = '#6E8460'

/** Cancha de polvo de ladrillo desde `y0` hasta abajo, con la línea blanca de fondo. */
const clay = (k: Kit, y0: number, line = true) => {
  const d = `M0 ${y0}H120V130H0Z`
  return `<path d="${d}" fill="${CLAY}"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.7, CLAY_D, 0.4) +
    `<path d="M0 ${y0}H120V${y0 + 8}H0Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.35, 0)}"/>` +
    (line ? `<path d="M0 ${f(y0 + 5)}H120" stroke="${P.white}" stroke-width="1.6"/><path d="M0 ${f(y0 + 5.7)}H120" stroke="${CLAY_D}" stroke-width=".3" opacity=".6"/>` : '')
}

/** Mate de calabaza con la virola de alpaca, la yerba y la bombilla, apoyado en (0,13). */
function mate(k: Kit) {
  const body = 'M-11.6 -9.4C-15.8 -3.4 -15.6 5.4 -10.6 10.6C-6.4 14.6 6.4 14.6 10.6 10.6C15.6 5.4 15.8 -3.4 11.6 -9.4Z'
  const virola = 'M-12.6 -13.2H12.6L12 -8.6C4 -6.8 -4 -6.8 -12 -8.6Z'
  const yerba = ellipse(0, -13.2, 11.2, 2.6)
  const bomb = taper(3, -13, 6, -22, 8.6, -30, 1.6, 1.2)
  return (
    k.draw([{ d: bomb, fill: P.sky1, inner: k.sh(bomb, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) }], 0.5) +
    k.draw([
      {
        d: body, fill: P.brown,
        inner:
          k.sh(body, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M-16 -10H-6V14H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          hair(-8, -4, -10, 3, -7, 10, 0.6, P.brownD) + hair(4, -6, 6, 2, 4, 11, 0.5, P.brownD) +
          `<path d="M-8 2C-4 4 4 4 8 2" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>`,
      },
      {
        d: virola, fill: P.white,
        inner: k.sh(virola, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) +
          Array.from({ length: 9 }, (_, i) => `<circle cx="${f(-10 + i * 2.5)}" cy="-10.6" r=".45" fill="${P.blue}"/>`).join(''),
      },
    ], 0.7) +
    `<path d="${yerba}" fill="${YERBA}" stroke="${P.ink}" stroke-width=".5"/>` +
    k.clip(yerba, k.sh(yerba, 0, 0, 1, 1, 0, 0.8, YERBA_D, 0.5) + [[-6, -13.6], [-2, -12.4], [3, -14], [7, -12.8], [-8, -12.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".5" fill="${YERBA_D}"/>`).join('')) +
    k.draw([{ d: bomb, fill: P.sky1, inner: k.sh(bomb, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) }], 0.5) +
    k.draw([{ d: roundRect(7.4, -32.8, 10.6, -29.6, 0.9), fill: P.gold, inner: k.sh(roundRect(7.4, -32.8, 10.6, -29.6, 0.9), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.45)
  )
}

/** Cañón de bronce con el eje en (0,0), apuntando a +x: culata con botón a la izquierda, boca a la derecha. */
function cannon(k: Kit, metal: string, metalD: string) {
  const barrel = 'M-19 -6.4C-21.4 -6.2 -22.4 -3.4 -22.4 0C-22.4 3.4 -21.4 6.2 -19 6.4L16 4.6V-4.6Z'
  const muzzle = roundRect(15, -6, 20.4, 6, 1.6)
  const knob = ellipse(-24.4, 0, 2.6, 2.6)
  const bands = [-15, -6, 6].map((x) => `M${x} -6.4V6.4`).join('')
  return k.draw([
    { d: knob, fill: metal, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, metalD, 0.5) },
    {
      d: barrel, fill: metal,
      inner:
        k.sh(barrel, 0, 0, 0, 1, 0.1, 0.95, metalD, 0.5) + `<path d="M-23 -7H18V-2.6H-23Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` +
        `<path d="${bands}" stroke="${P.ink}" stroke-width="1.6"/><path d="${bands}" stroke="${P.goldL}" stroke-width=".7" transform="translate(-.4 0)"/>` +
        hair(-18, -4.6, -2, -5.2, 14, -3.6, 0.6, '#fff', 0.85),
    },
    { d: muzzle, fill: metal, inner: k.sh(muzzle, 0, 0, 0, 1, 0, 0.9, metalD, 0.5) + `<path d="M15 -6H21V-3H15Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` },
  ], 0.7)
}

/** Rueda de carreta con rayos, centrada en (x,y). */
function wheel(k: Kit, x: number, y: number, r: number) {
  const rim = ellipse(x, y, r, r) + ` M${f(x - r + 2)} ${y}A${f(r - 2)} ${f(r - 2)} 0 1 1 ${f(x + r - 2)} ${y}A${f(r - 2)} ${f(r - 2)} 0 1 1 ${f(x - r + 2)} ${y}Z`
  const spokes = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.2; return `M${x} ${y}L${f(x + Math.cos(a) * (r - 1.4))} ${f(y + Math.sin(a) * (r - 1.4))}` }).join('')
  return (
    `<path d="${spokes}" stroke="${P.ink}" stroke-width="2"/><path d="${spokes}" stroke="${P.brown}" stroke-width="1"/>` +
    k.draw([{ d: rim, fill: P.brown, inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) }], 0.6) +
    k.draw([{ d: ellipse(x, y, 2.2, 2.2), fill: P.night, inner: `<circle cx="${f(x - 0.6)}" cy="${f(y - 0.6)}" r=".7" fill="${P.sky}"/>` }], 0.4)
  )
}

/** Tubo de pelotas transparente, de x0 a x1 y de y0 a y1, con tres pelotas adentro. */
function tube(k: Kit, x0: number, x1: number, y0: number, y1: number) {
  const cx = (x0 + x1) / 2, rx = (x1 - x0) / 2
  const body = `M${x0} ${y0}H${x1}V${y1}A${rx} 2.6 0 0 1 ${x0} ${y1}Z`
  const r = rx - 1.6, n = 3, step = (y1 - y0) / n
  const balls = Array.from({ length: n }, (_, i) => tennisBall(k, cx, f(y0 + step * (i + 0.5) + 0.6), f(Math.min(r, step / 2 - 0.2)), { rot: -30 + i * 50 })).join('')
  return (
    k.draw([{ d: body, fill: P.sky1 }], 0.75) +
    balls +
    `<path d="${body}" fill="${k.lin(P.blue, 0, 0, 1, 0, 0, 0.35)}"/>` +
    `<path d="M${f(x0 + 2.4)} ${f(y0 + 2)}V${f(y1 - 2)}" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>` +
    `<path d="M${f(x0 + 5)} ${f(y0 + 3)}V${f(y1 - 6)}" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".7"/>` +
    `<path d="M${f(x1 - 2.4)} ${f(y0 + 2)}V${f(y1 - 2)}" stroke="${P.blue}" stroke-width=".8" stroke-linecap="round" opacity=".6"/>` +
    `<path d="${body}" fill="none" stroke="${P.ink}" stroke-width=".5"/>`
  )
}

/** Metro de carpintero plegable, parado, de y0 (arriba) a y1, ancho w, centrado en x. */
function ruler(k: Kit, x: number, y0: number, y1: number, w: number) {
  const segs = 5, h = (y1 - y0) / segs
  let out = ''
  for (let i = 0; i < segs; i++) {
    const t = y0 + i * h, d = roundRect(f(x - w / 2), f(t + 0.3), f(x + w / 2), f(t + h - 0.3), 0.8)
    let ticks = ''
    for (let j = 1; j < 10; j++) ticks += `M${f(x - w / 2)} ${f(t + (h * j) / 10)}h${j === 5 ? 3 : 1.8}`
    const n = 200 - i * 40
    out +=
      k.draw([{
        d, fill: P.goldL,
        inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) + `<path d="${ticks}" stroke="${P.ink}" stroke-width=".45"/>` +
          `<text x="${f(x + 1.4)}" y="${f(t + h / 2 + 1.6)}" font-family="Georgia, serif" font-weight="700" font-size="4" fill="${i === 0 ? P.red : P.ink}" text-anchor="middle" transform="rotate(-90 ${f(x + 1.4)} ${f(t + h / 2)})">${n}</text>`,
      }], 0.5) +
      (i ? `<circle cx="${f(x + w / 2 - 1.4)}" cy="${f(t)}" r=".85" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` : '')
  }
  return out
}

/** Vincha de toalla atada alrededor de la cabeza de la raqueta, con las dos colas al viento (en coordenadas de la raqueta). */
function vincha(k: Kit) {
  const band = 'M-13 -27C-6 -29.4 6 -29.4 13 -27L13 -21.4C6 -23.6 -6 -23.6 -13 -21.4Z'
  const tail1 = 'M12.4 -26.6C16 -28.6 20 -28.8 24.4 -27.2L22.2 -24.4L25 -22C20.6 -21.8 16.8 -22.2 12.8 -22Z'
  const tail2 = 'M12.6 -23C15.6 -21 18.6 -17.6 21.6 -16.6L19 -14.6L20.2 -11.6C16.6 -13.4 14 -16.6 12 -20.6Z'
  const knot = ellipse(13.2, -24.4, 2.6, 3)
  const stripes = `M-13 -25.6C-6 -27.9 6 -27.9 13 -25.6M-13 -22.8C-6 -25.1 6 -25.1 13 -22.8`
  return (
    k.draw([
      { d: tail2, fill: P.white, inner: k.sh(tail2, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.5) + `<path d="M13.4 -21.6C16 -19.4 18.2 -17 20.6 -15.6" fill="none" stroke="${P.red}" stroke-width=".7"/>` },
      { d: tail1, fill: P.white, inner: k.sh(tail1, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.5) + `<path d="M13 -25C17 -26.4 20.4 -26.4 23.6 -25.4" fill="none" stroke="${P.red}" stroke-width=".7"/>` },
      { d: band, fill: P.white, inner: k.sh(band, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.5) + `<path d="${stripes}" fill="none" stroke="${P.red}" stroke-width=".8"/>` + hair(-10, -26.6, -2, -28, 8, -27.4, 0.5, P.sky2) },
      { d: knot, fill: P.white, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.9, P.sky2, 0.5) },
    ], 0.55)
  )
}

export const TENIS_ART: Record<string, (u: number) => string> = {
  // ── Saque bala ─────────────────────────────────────────────────────

  // Cinco aces: la pelota pasa como una bala y, mientras tanto, el mate ya está cebado (y humeando).
  'Saque de mate': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 28, false) +
      clay(k, 84) +
      k.floor(49, 87.6, 17, 2.4, CLAY_D) +
      `<g transform="translate(48 74.4) scale(1.08)">` + mate(k) + `</g>` +
      hair(38, 54, 35, 48, 38, 42, 0.8, P.white, 0.9) + hair(43, 52, 40.6, 46, 43.4, 40, 0.7, P.white, 0.85) +
      trail(78.6, 39, 194, 12, 3, 3, P.mid, 0.9) +
      tennisBall(k, 84, 40, 7.4, { rot: -60 }) +
      label(84, 62, 6.4, '¡ace!', P.ink, -8) +
      sparkle(30, 70, 1.8) + sparkle(92, 76, 1.4) +
      k.defs()
    )
  },

  // Veinticinco aces: el cañón de Navarone dispara pelotas de tenis. Humo en la boca y la pelota que sale silbando.
  'Cañón Navarone': (u) => {
    const k = kit(u)
    const carriage = 'M30 86L36 74.4L60 66.4L63 70L56 86Z'
    return (
      k.day() +
      k.stage(60, 58, 34) +
      k.floor(52, 89.4, 26, 2.6, P.mid) +
      k.draw([{ d: carriage, fill: P.brown, inner: k.sh(carriage, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + hair(36, 78, 46, 73, 58, 69.6, 0.5, P.brownD) + hair(34, 84, 44, 80, 55, 80, 0.45, P.brownD) }], 0.7) +
      `<g transform="translate(51 68) rotate(-30)">` + cannon(k, P.night, '#0F1736') + `</g>` +
      wheel(k, 47, 80, 9) +
      puff(k, 73.6, 53, 9.4) +
      trail(80.6, 40.2, 146, 12, 3, 2.8, P.mid, 0.8) +
      tennisBall(k, 85, 36, 7, { rot: 10 }) +
      hair(92, 30, 95, 33, 95, 38, 0.6, P.mid) +
      sparkle(32, 44, 2.2) + sparkle(90, 66, 1.6) +
      k.defs()
    )
  },

  // Ochenta aces: el metro de carpintero desplegado llega a los dos metros, y la raqueta de grafito saca desde ahí
  // arriba. Oro: la raqueta grabada y la pelota con su gloria.
  'Karlović de barrio': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 56, 16, 47) +
      k.shade(ellipse(64, 46, 22, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 100, 31, 93, 27, 64, 8) + laurel(70, 100, 89, 93, 93, 64, 8, true) +
      k.floor(57, 94, 22, 2.4, P.mid) +
      ruler(k, 41, 34, 95, 7.4) +
      `<g transform="translate(66.6 74) rotate(6) scale(.98)">` + k.cast([ellipse(0, -23.6, 11.6, 14.6)], 2, 2, P.mid) + `</g>` +
      racket(k, 66.6, 74, 6, { s: 0.98, frame: P.night, frameD: '#0F1736', grip: P.gold, gripD: P.goldD, engrave: true }) +
      tennisBall(k, 71, 29.6, 5, { rot: 30 }) +
      label(55, 31.4, 4.8, '2,00 m', P.red) +
      sparkle(84, 30, 2.4, '#fff') + sparkle(56, 26, 1.6, '#fff') + sparkle(86, 62, 1.4) +
      k.defs()
    )
  },

  // ── Raqueta ───────────────────────────────────────────────────────

  // Cinco ganados: la media blanca, colorada de polvo de ladrillo hasta el tobillo.
  'Polvo de ladrillo': (u) => {
    const k = kit(u)
    const sock = 'M-8 -30H8V2C8 6.6 11 8.4 16.4 8.6C22 8.8 25 12 24.2 16.4C23.4 20.6 19.6 22.6 13.6 22.6H-1.6C-7.6 22.6 -10 18.6 -9.4 12.4L-8 2Z'
    const cuff = 'M-8.6 -31.6H8.6V-22H-8.6Z'
    return (
      k.day() +
      k.sun(60, 52, 15, 44, 28, false) +
      clay(k, 84) +
      k.floor(62, 88.4, 22, 2.6, CLAY_D) +
      `<g transform="translate(55 66) rotate(-6)">` +
      k.cast([sock], 2, 2, CLAY_D) +
      k.draw([{
        d: sock, fill: P.white,
        inner:
          k.sh(sock, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.5) +
          `<path d="M-14 -6H30V26H-14Z" fill="${k.lin(CLAY, 0, 0, 0, 1, 0, 0.95)}"/>` + k.shade('M-14 -6H30V26H-14Z', k.lin(CLAY_D, 0, 0, 0, 1, 0, 0.9), CLAY_D, 0.3) +
          `<path d="M14 9C19 9.6 22 12 22.6 15.6M-8.6 14C-8 18 -5 21 -.4 21.6" fill="none" stroke="${CLAY_D}" stroke-width=".5"/>` +
          hair(-5.6, -18, -6.4, -8, -5, 2, 0.6, P.sky2) + hair(3.6, -20, 4.4, -10, 3.4, 0, 0.5, P.sky2),
      }, {
        d: cuff, fill: P.white,
        inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.5) + `<path d="M-8.6 -28.6H8.6M-8.6 -25.6H8.6" stroke="${P.mid}" stroke-width="1.2"/>` +
          Array.from({ length: 8 }, (_, i) => `<path d="M${f(-7 + i * 2)} -31V-22.6" stroke="${P.sky2}" stroke-width=".35"/>`).join(''),
      }], 0.75) +
      `</g>` +
      hair(30, 84, 33, 80, 38, 79, 0.7, CLAY_D) + hair(31, 88, 35, 85.6, 39.6, 85.6, 0.6, CLAY_D) + `<circle cx="36" cy="76" r=".8" fill="${CLAY}"/><circle cx="32" cy="78.6" r=".6" fill="${CLAY}"/><circle cx="40" cy="74.6" r=".5" fill="${CLAY}"/>` +
      tennisBall(k, 85.4, 80.4, 6.6, { rot: 40 }) +
      `<path d="M80 83.6C83 86.6 88 86.6 91 83" fill="none" stroke="${CLAY_D}" stroke-width=".8" opacity=".7"/>` +
      sparkle(84, 36, 2) + sparkle(34, 40, 1.6) +
      k.defs()
    )
  },

  // Veinte victorias: la torre es el tubo de pelotas, con almenas y banderín, sobre las sierras de Tandil.
  'Torre de Tandil': (u) => {
    const k = kit(u)
    const hills = 'M0 82C12 72 22 70 32 74C40 66 52 64 62 72C72 66 84 62 96 70C106 66 114 68 120 72V130H0Z'
    const cap = 'M46.4 46H73.6V38.4H70V41.4H66V38.4H62V41.4H58V38.4H54V41.4H50V38.4H46.4Z'
    const pennant = 'M60.6 26.6L72 29.8L60.6 33Z'
    return (
      k.day() +
      k.sun(60, 54, 15, 44, 28, false) +
      `<path d="${hills}" fill="${SIERRA}"/>` + k.sh(hills, 0, 0, 0, 1, 0, 0.6, SIERRA_D, 0.4) +
      `<path d="M10 88C20 82 32 82 40 86M78 84C88 78 100 78 112 82" fill="none" stroke="${SIERRA_D}" stroke-width=".6"/>` +
      k.floor(60, 96, 18, 2.4, P.mid) +
      tube(k, 47.6, 72.4, 46, 95) +
      k.draw([{ d: cap, fill: P.white, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M46.4 44H73.6" stroke="${P.blue}" stroke-width=".5"/>` }], 0.65) +
      `<path d="M60 38.4V25.6" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([{ d: pennant, fill: P.red, inner: k.sh(pennant, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.45) +
      `<circle cx="60" cy="25.4" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(34, 44, 2.2) + sparkle(86, 46, 1.8) +
      k.defs()
    )
  },

  // Sesenta ganados: la raqueta de madera de los 70 con la vincha atada, sobre el polvo de ladrillo de París.
  'Vilas en Roland Garros': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 54, 16, 47) +
      k.shade(ellipse(60, 50, 26, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      clay(k, 86, false) +
      laurel(48, 100, 30, 93, 27, 64, 8) + laurel(72, 100, 90, 93, 93, 64, 8, true) +
      k.floor(60, 90, 20, 2.4, CLAY_D) +
      `<g transform="translate(58 76) rotate(-12)">` + k.cast([ellipse(0, -23.6, 11.6, 14.6)], 2, 2, P.mid) + `</g>` +
      racket(k, 58, 76, -12, { s: 1.08, frame: PINO, frameD: PINO_D, grip: P.brown, gripD: P.brownD, strings: P.goldL, engrave: true, top: vincha(k) }) +
      tennisBall(k, 81.4, 80, 5.8, { rot: 20 }) +
      voluta('M36 88C33 84 34.6 80.6 37.6 81.2C39.6 81.6 39.4 84 37.8 84', P.gold) +
      banner(k, 60, 92, 34, CLAY, CLAY_D, 'París ’77', P.white, 4.4) +
      sparkle(36, 34, 2.4, '#fff') + sparkle(86, 40, 1.8, '#fff') + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },
}

