// Básquet en clave heroica: la pelota naranja con sus costuras, el aro con su red de rombos, el tablero y la pintura
// (la zona) sobre el parquet. A los jugadores (Manu, Kobe, Scola) no se los dibuja: aparecen por sus objetos (la
// camiseta 20 con el murciélago, la mamba enroscada, la lata de pintura con el 4). Piezas en ./_basquet-piezas.ts.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { backboard, bball, GEORGIA, hoopNet, parquet, rimBack, rimFront, swoosh, WOOD_D } from './_basquet-piezas'

/** Cemento de la plaza. */
const CEM = '#DCD8CE', CEM_D = '#A8A49A'
/** Piel de la mamba. */
const SNAKE = '#3E4868', SNAKE_D = '#1A2142'

/** Murciélago de alas abiertas, centrado en (0,0). */
const BAT = 'M0 0C-1.6 -1.8 -4.2 -2.4 -6.8 -1.4C-5.8 -.6 -5.6 .5 -6 1.3C-4.6 .6 -3.2 .8 -2.4 1.9C-1.8 1 -.9 .8 0 1.5C.9 .8 1.8 1 2.4 1.9C3.2 .8 4.6 .6 6 1.3C5.6 .5 5.8 -.6 6.8 -1.4C4.2 -2.4 1.6 -1.8 0 0ZM-.7 -.5L-.9 -1.6L-.2 -.9H.2L.9 -1.6L.7 -.5Z'

/** Volutas de fileteado: la espiral entintada, dorada y con su brillo. */
function voluta(d: string, c = P.gold) {
  return (
    `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#fff" stroke-width=".3" stroke-linecap="round" transform="translate(-.3 -.3)" opacity=".85"/>`
  )
}

/** Mano abierta con la palma al frente, la muñeca en y≈16 y la punta del dedo mayor en y=-24.5. */
function hand(k: Kit, band = P.red) {
  const palm = roundRect(-8.8, -4, 8.6, 17, 4.6)
  const fingers: [number, number, number][] = [[-8.6, -4.6, -21], [-4.2, -0.2, -24.5], [0.2, 4.2, -22.6], [4.6, 8.2, -17.4]]
  const arm = roundRect(-7, 14, 7, 44, 2)
  const cuff = roundRect(-8.4, 14.6, 8.4, 23, 1.8)
  const skin = (d: string) => k.sh(d, 0, 0, 1, 0, 0, 0.75, P.brown, 0.4) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>`
  return (
    k.draw([
      { d: arm, fill: P.skin, inner: k.sh(arm, 0, 0, 1, 0, 0, 0.8, P.brown, 0.4) },
      { d: roundRect(-2.1, -12.4, 2.1, 0, 2.1), t: 'translate(-6.8 7.4) rotate(-40)', fill: P.skin, inner: k.sh('M-3 -14H3V1H-3Z', 0, 0, 1, 0, 0, 0.7, P.brown, 0.4) },
      ...fingers.map(([a, b, top]) => ({ d: roundRect(a, top, b, 2, (b - a) / 2), fill: P.skin, inner: skin(roundRect(a, top, b, 2, (b - a) / 2)) })),
      { d: palm, fill: P.skin, inner: skin(palm) + k.sh(palm, 0, 0, 0, 1, 0, 0.5, P.brown, 0.3) },
    ], 0.7) +
    // Nudillos, pliegues de la palma y uñas apenas sugeridas.
    fingers.map(([a, b, top]) => hair(a + 0.8, top + 6.6, (a + b) / 2, top + 7.4, b - 0.8, top + 6.6, 0.35, P.brown) + `<path d="M${f(a + 0.9)} ${f(top + 2.4)}Q${f((a + b) / 2)} ${f(top + 0.9)} ${f(b - 0.9)} ${f(top + 2.4)}" fill="none" stroke="${P.brown}" stroke-width=".3"/>`).join('') +
    hair(-6.4, 4.6, -1, 8.4, 6.4, 3, 0.5, P.brown) + hair(-4, 9.4, -5.6, 12.6, -6.4, 15, 0.45, P.brown) +
    k.draw([{
      d: cuff, fill: band,
      inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) + `<path d="M-8.4 17H8.4M-8.4 20.6H8.4" stroke="#fff" stroke-width="1.1"/>` +
        `<path d="M-8 16.2H-1" stroke="#fff" stroke-width=".4" opacity=".6"/>`,
    }], 0.55)
  )
}

/** Lata de pintura con la boca en (60, y0): cuerpo de chapa, la pintura azul arriba y la etiqueta. */
function paintCan(k: Kit, y0: number, label: string) {
  const rx = 13.4, h = 28, ry = 3.4
  const body = `M${60 - rx} ${y0}V${y0 + h}A${rx} ${ry} 0 0 0 ${60 + rx} ${y0 + h}V${y0}A${rx} ${ry} 0 0 1 ${60 - rx} ${y0}Z`
  const band = `M${60 - rx} ${y0 + 7}A${rx} ${ry} 0 0 0 ${60 + rx} ${y0 + 7}V${y0 + 22}A${rx} ${ry} 0 0 1 ${60 - rx} ${y0 + 22}Z`
  const drip = (x: number, l: number, w: number) =>
    `M${f(x - w)} ${y0 + 1}C${f(x - w)} ${f(y0 + l * 0.5)} ${f(x - w * 0.9)} ${f(y0 + l - 1)} ${f(x - w * 0.6)} ${f(y0 + l)}A${w * 0.7} ${w * 0.7} 0 0 0 ${f(x + w * 0.7)} ${f(y0 + l)}C${f(x + w * 0.8)} ${f(y0 + l - 2)} ${f(x + w)} ${f(y0 + l * 0.5)} ${f(x + w)} ${y0 + 1}Z`
  const drips = drip(50.4, 10.6, 1.6) + drip(57, 6.4, 1.2) + drip(67.6, 14.6, 1.7) + drip(71.6, 7.4, 1.1)
  return (
    k.draw([{
      d: body, fill: P.sky1,
      inner:
        k.sh(body, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="M${60 - rx} ${y0}H${60 - rx + 6}V${y0 + 40}H${60 - rx}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.8, 0)}"/>` +
        `<path d="${band}" fill="${P.white}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) +
        `<path d="${band}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
        `<path d="M${60 - rx} ${y0 + 3}A${rx} ${ry} 0 0 0 ${60 + rx} ${y0 + 3}M${60 - rx} ${y0 + 25.6}A${rx} ${ry} 0 0 0 ${60 + rx} ${y0 + 25.6}" fill="none" stroke="${P.blue}" stroke-width=".5"/>` +
        label +
        `<path d="${drips}" fill="${P.mid}"/>` + `<path d="${drips}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
        `<path d="M49.6 ${y0 + 2}V${y0 + 8}" stroke="${P.sky}" stroke-width=".5" stroke-linecap="round"/>`,
    }], 0.75) +
    `<path d="${ellipse(60, y0, rx, ry)}" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".7"/>` +
    `<path d="${ellipse(60, y0 + 0.3, rx - 1.3, ry - 0.9)}" fill="${P.mid}"/>` +
    k.clip(ellipse(60, y0 + 0.3, rx - 1.3, ry - 0.9), `<path d="${ellipse(57, y0 - 0.6, 6, 1.2)}" fill="${P.blue}"/><path d="M50 ${f(y0 - 0.4)}Q54 ${f(y0 - 1.6)} 58 ${f(y0 - 1.4)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>`)
  )
}

export const BASQUET_ART: Record<string, (u: number) => string> = {
  // ── Anotador ───────────────────────────────────────────────────────

  // Cincuenta puntos: el tablero de chapa agujereada de la plaza, el aro pelado con los ganchitos vacíos (y el último
  // hilo de red que quedó colgando) y la pelota que entra igual.
  'Tiro de plaza': (u) => {
    const k = kit(u)
    const pole = 'M56.8 60H63.2V112H56.8Z'
    const ground = 'M-10 91H130V140H-10Z'
    let holes = ''
    for (let y = 40; y < 62; y += 3.4) for (let x = 41.4; x < 80; x += 3.4) holes += `M${f(x)} ${f(y)}h.01`
    const hooks = [-0.86, -0.5, -0.12, 0.28, 0.66].map((t) => {
      const a = Math.acos(t), x = 60 + 15 * t, y = 68 + 4.2 * Math.sin(a)
      return `<path d="M${f(x)} ${f(y)}V${f(y + 1.8)}Q${f(x)} ${f(y + 2.8)} ${f(x - 0.9)} ${f(y + 2.6)}" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 44, 28, false) +
      k.draw([{ d: ground, fill: CEM, inner: k.sh(ground, 0, 0, 0, 1, 0, 0.7, CEM_D, 0.4) + hair(24, 96, 30, 95, 33, 99, 0.5, CEM_D) + hair(82, 94, 88, 97, 96, 96, 0.5, CEM_D) + hair(70, 100, 74, 98, 78, 101, 0.4, CEM_D) }], 0.6) +
      // Matas de pasto que se cuelan por el cemento.
      [[28, 91], [91, 91]].map(([x, y]) => hair(x, y, x - 1, y - 3, x - 3, y - 5, 0.8, P.greenD) + hair(x, y, x + 0.4, y - 4, x + 1.6, y - 6, 0.8, P.green) + hair(x, y, x + 2, y - 2, x + 4, y - 3.4, 0.7, P.greenD)).join('') +
      k.floor(61, 92, 9, 1.8, CEM_D) +
      k.draw([{ d: pole, fill: P.mid, inner: k.sh(pole, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M57.6 60V112" stroke="${P.sky}" stroke-width=".7"/>` }], 0.65) +
      k.cast([roundRect(38, 36, 82, 63, 1.4)], 1.8, 1.8, P.mid) +
      backboard(k, 38, 36, 82, 63, {
        fill: P.sky1, square: P.white,
        inner:
          `<path d="${holes}" stroke="${P.blue}" stroke-width="1.15" stroke-linecap="round"/>` +
          k.shade(ellipse(76, 60, 9, 6), k.rad(P.brown, 0.5, 0.5, 0.5, 0.8, 0), P.brown, 0.4) + k.shade(ellipse(41, 40, 6, 4), k.rad(P.brown, 0.5, 0.5, 0.5, 0.7, 0), P.brown, 0.35) +
          hair(70, 62, 71, 56, 70.4, 50, 0.5, P.brownD) + hair(44, 63, 44.6, 58, 44, 54, 0.4, P.brownD),
      }) +
      [[39.6, 37.6], [80.4, 37.6], [39.6, 61.4], [80.4, 61.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      k.draw([{ d: 'M55.6 62.4H64.4V68H55.6Z', fill: P.mid }], 0.5) +
      rimBack(60, 68, 15) +
      swoosh(60, 60.4, -98, 8.8, P.mid) +
      bball(k, 60, 60.4, 8.8, { rot: -16 }) +
      rimFront(60, 68, 15) +
      hooks +
      // El último hilo de la red, que quedó colgando de un gancho.
      `<path d="M71 72.4C71.4 75 70 77.4 71 80C71.6 81.6 70.8 83 70 84" fill="none" stroke="${P.ink}" stroke-width="1"/><path d="M71 72.4C71.4 75 70 77.4 71 80C71.6 81.6 70.8 83 70 84" fill="none" stroke="#fff" stroke-width=".45"/>` +
      sparkle(34, 32, 2) + sparkle(88, 76, 1.5) +
      k.defs()
    )
  },

  // Doscientos cincuenta: la pizarra del técnico rival. Vos sos el círculo rojo, y te ponen dos cruces encima.
  'Goleador de la liga': (u) => {
    const k = kit(u)
    const board = roundRect(36.4, 32.6, 83.6, 98, 3.2)
    const white = roundRect(40, 40.4, 80, 94.4, 1.2)
    const clipD = 'M50 29.6H70V38.4Q70 40.6 67.8 40.6H52.2Q50 40.6 50 38.4Z'
    const court =
      `<path d="M41 44H79M53.6 44V58.4H66.4V44M53.6 58.4A6.4 6.4 0 0 0 66.4 58.4M43.4 44V49Q43.4 69 60 70.4Q76.6 69 76.6 49V44M41 91.4H79M54.4 91.4A5.6 5.6 0 0 1 65.6 91.4" fill="none" stroke="${P.sky}" stroke-width=".55"/>` +
      `<path d="M56.6 46.6H63.4" stroke="${P.blue}" stroke-width=".7"/><circle cx="60" cy="48.2" r="1.4" fill="none" stroke="${P.red}" stroke-width=".6"/>`
    const X = (x: number, y: number) => `<path d="M${f(x - 2.6)} ${f(y - 2.6)}L${f(x + 2.6)} ${f(y + 2.6)}M${f(x + 2.6)} ${f(y - 2.6)}L${f(x - 2.6)} ${f(y + 2.6)}" stroke="${P.ink}" stroke-width="1.35" stroke-linecap="round"/>`
    const marker = roundRect(-12, -2.3, 9, 2.3, 1.2), cap = roundRect(9, -2.6, 14, 2.6, 1)
    return (
      k.day() +
      k.stage(60, 62, 36) +
      `<g transform="rotate(-5 60 66)">` +
      k.cast([board], 2.4, 2.4, P.mid) +
      k.draw([{ d: board, fill: P.brown, inner: k.sh(board, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M36 32H50V98H36Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` + hair(38.4, 50, 38.8, 70, 38.2, 90, 0.4, P.brownD) }], 0.75) +
      k.draw([{ d: white, fill: P.white, inner: k.sh(white, 0, 0, 1, 1, 0, 0.45, P.blue, 0.3) + court }], 0.4) +
      // Vos (el círculo rojo, con la flecha al aro) y los dos que te marcan.
      `<circle cx="60" cy="80.4" r="3.4" fill="none" stroke="${P.red}" stroke-width="1.35"/>` +
      `<path d="M60 76.4Q49 70 56.4 53.4" fill="none" stroke="${P.red}" stroke-width=".8" stroke-dasharray="1.6 1"/><path d="M53.8 55.4L56.6 52.6L57.6 56.4" fill="none" stroke="${P.red}" stroke-width=".8" stroke-linejoin="round" stroke-linecap="round"/>` +
      X(52.6, 77.6) + X(67.4, 77.6) +
      `<text x="71.6" y="88.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.2" fill="${P.ink}">x2</text>` +
      k.draw([{ d: clipD, fill: P.sky2, inner: k.sh(clipD, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M50 30H55V41H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` }], 0.6) +
      `<circle cx="60" cy="33.4" r="1.5" fill="${P.paper}" stroke="${P.ink}" stroke-width=".45"/>` +
      `</g>` +
      `<g transform="translate(80 85) rotate(-58)">` +
      k.draw([
        { d: marker, fill: P.white, inner: k.sh(marker, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-6 -2.3H2V2.3H-6Z" fill="${P.red}"/>` },
        { d: cap, fill: P.red, inner: k.sh(cap, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) },
        { d: 'M-12 -1.4L-15 -.6V.6L-12 1.4Z', fill: P.red },
      ], 0.5) +
      `</g>` +
      k.floor(38, 94, 8, 1.6, P.mid) +
      bball(k, 37, 86.6, 7.4, { rot: 10 }) +
      sparkle(88, 40, 2) + sparkle(31, 50, 1.5) +
      k.defs()
    )
  },

  // Ochocientos: la 20 colgada en el sol de Mayo, y el murciélago que un día bajó a la cancha y se fue de un manotazo.
  'Manu en San Antonio': (u) => {
    const k = kit(u)
    const J = 'M47.4 31H53.6Q60 40.4 66.4 31H72.6Q72.8 42 80.6 46.2V93.4Q60 97 39.4 93.4V46.2Q47.2 42 47.4 31Z'
    const neck = 'M53.6 31Q60 40.4 66.4 31'
    const arm = (s: number) => `M${60 + s * 12.6} 31Q${60 + s * 12.8} 42 ${60 + s * 20.6} 46.2`
    const trim = (d: string, w = 1.9) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 0.9)}"/><path d="${d}" fill="none" stroke="${P.sky2}" stroke-width="${w}"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".45"/>`
    const scroll = 'M2 0C3.6 -3.6 8.4 -4.8 11 -2.2C13.2 0 12 3.4 9.4 3.4C7.6 3.4 7 1.6 8.2 .8'
    return (
      k.day() +
      k.sun(60, 60, 19, 50, 32) +
      k.shade(ellipse(60, 60, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      // La percha.
      `<path d="M60 31.4V26.4Q60 22.6 63.2 22.6Q66 22.6 66 25.4" fill="none" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/><path d="M60 31.4V26.4Q60 22.6 63.2 22.6Q66 22.6 66 25.4" fill="none" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>` +
      k.cast([J], 2.6, 2.4, P.goldD) +
      k.draw([{
        d: J, fill: P.night,
        inner:
          k.sh(J, 0, 0, 1, 0, 0, 0.9, '#0B1130', 0.5) + `<path d="M38 30H50V98H38Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="M41.6 50V92.6M78.4 50V92.6" stroke="${P.sky2}" stroke-width="1.6"/><path d="M41.6 50V92.6M78.4 50V92.6" stroke="${P.gold}" stroke-width=".4" stroke-dasharray="1.2 .8"/>` +
          hair(48, 62, 47, 78, 49, 92, 0.6, P.mid) + hair(72, 64, 73, 80, 71, 92, 0.5, '#0B1130') +
          `<path d="M39.4 90.4Q60 94 80.6 90.4" fill="none" stroke="${P.sky2}" stroke-width=".9"/>`,
      }], 0.85) +
      trim(neck) + trim(arm(-1)) + trim(arm(1)) +
      `<text x="60.8" y="76.8" ${GEORGIA} font-weight="700" font-size="22" fill="${P.ink}" text-anchor="middle" stroke="${P.ink}" stroke-width="2.6" stroke-linejoin="round">20</text>` +
      `<text x="60" y="76" ${GEORGIA} font-weight="700" font-size="22" fill="${P.white}" text-anchor="middle" stroke="${P.sky2}" stroke-width=".4">20</text>` +
      // Fileteado dorado debajo del número.
      `<g transform="translate(60 83.4) scale(.62)">` + voluta(scroll) + `</g><g transform="translate(60 83.4) scale(-.62 .62)">` + voluta(scroll) + `</g>` +
      `<circle cx="60" cy="83.4" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      // El murciélago, saliendo despedido del manotazo.
      `<path d="${starPath(84.4, 44.4, 5.4, 1.6, 8)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="${BAT}" fill="${P.night}" stroke="${P.paper}" stroke-width=".25" transform="translate(88 38) rotate(-24) scale(1.35)"/>` +
      hair(80, 48, 82, 45.6, 83.6, 45.4, 0.5, P.ink) + hair(79, 44, 80.6, 42.4, 82.4, 42.6, 0.4, P.ink) +
      sparkle(34, 46, 2.2, P.white) + sparkle(87, 74, 1.6, P.white) + sparkle(33, 78, 1.3, P.white) +
      k.defs()
    )
  },

  // ── Noche de gloria ────────────────────────────────────────────────

  // Quince en un partido: la pelota que empieza a echar humo y fuego, como en los fichines.
  'Mano caliente': (u) => {
    const k = kit(u)
    return (
      k.night() +
      [[34, 30], [86, 30], [28, 54], [92, 58]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.45 : 0.6}" fill="${P.paper}"/>`).join('') +
      k.shade(ellipse(60, 62, 30, 30), k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.gold, 0.35) +
      flame(k, 'translate(60 76) scale(.74) translate(-60 -90)') +
      k.floor(60, 88, 15, 2.2, '#0B1130') +
      bball(k, 60, 66.4, 16, {
        rot: -18,
        over: k.shade(ellipse(60, 54, 18, 10), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45),
      }) +
      // Brasas que saltan.
      [[36, 46, 1], [86, 44, 0.8], [40, 36, 0.6], [82, 32, 0.7], [30, 66, 0.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>`).join('') +
      `<text x="60" y="96" ${GEORGIA} font-style="italic" font-size="6.2" fill="${P.goldL}" text-anchor="middle">heating up!</text>` +
      k.defs()
    )
  },

  // Veinticinco: el aro, visto desde arriba, es una pileta. Burbujas, vapor y la pelota haciendo la plancha.
  'Aro de jacuzzi': (u) => {
    const k = kit(u)
    const C = [60, 61], RX = 22, TILT = 0.42, RY = RX * TILT
    const water = ellipse(C[0], C[1], RX - 0.4, RY - 0.4)
    const net = hoopNet(C[0], C[1], RX, 23, { tilt: TILT, bottom: 0.52 })
    const bubble = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width="${f(Math.min(0.4, r * 0.3))}"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="${P.sky}"/>`
    const drop = (x: number, y: number, s: number) => `<path d="M0 -3C.9 -1.4 1.8 -.4 1.8 .8A1.8 1.8 0 0 1 -1.8 .8C-1.8 -.4 -.9 -1.4 0 -3Z" transform="translate(${x} ${y}) scale(${s})" fill="${P.sky}" stroke="${P.ink}" stroke-width="${f(0.35 / s)}"/>`
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 28, false) +
      backboard(k, 39, 30, 81, 54) +
      k.draw([{ d: 'M56 53H64V57H56Z', fill: P.mid }], 0.5) +
      net.back +
      rimBack(C[0], C[1], RX, TILT) +
      `<path d="${water}" fill="${P.sky}"/>` +
      k.clip(water,
        k.sh(water, 0, 0, 0, 1, 0, 0.9, P.mid, 0.45) +
        `<path d="${ellipse(60, 59.4, 14, 3.4)}" fill="none" stroke="#fff" stroke-width=".55" opacity=".8"/><path d="${ellipse(60, 61.6, 19, 5.6)}" fill="none" stroke="${P.sky1}" stroke-width=".45" opacity=".8"/>` +
        bubble(70, 60, 1.1) + bubble(73.4, 62.4, 0.7) + bubble(45, 63, 0.9) + bubble(48, 60.4, 0.6)) +
      // La pelota hundida hasta la mitad, con el agua por delante.
      k.clip(`M30 20H90V${C[1] - 0.6}H30Z`, bball(k, 57, C[1] - 0.6, 8.4, { rot: 20 })) +
      k.clip(water, `<path d="${ellipse(57, C[1] - 0.6, 8.4, 8.4)}" fill="${P.blue}" opacity=".55"/>`) +
      `<path d="${ellipse(57, C[1] - 0.2, 10, 2.2)}" fill="none" stroke="#fff" stroke-width=".7"/>` +
      rimFront(C[0], C[1], RX, TILT) +
      net.front +
      drop(51.6, 88, 0.9) + drop(64, 92.6, 0.75) + drop(58, 96, 0.6) +
      // Vapor y burbujas que suben.
      hair(70, 52, 74, 47, 70, 42, 0.9, P.blue) + hair(75, 53, 79, 48, 76, 43, 0.7, P.blue) + hair(44, 54, 41, 49, 45, 44, 0.8, P.blue) +
      bubble(83, 52, 1.4) + bubble(86, 46.4, 0.9) + bubble(36, 50, 1.1) +
      sparkle(88, 70, 1.8) + sparkle(31, 68, 1.4) +
      k.defs()
    )
  },

  // Cuarenta en un partido: la mamba negra enroscada en la pelota, de noche y con el sol de oro.
  'Noche de Kobe': (u) => {
    const k = kit(u)
    const C = [59, 57], R = 15
    const back = taper(36, 77, 60, 64, 85, 77, 5.4, 6.4)
    const front = taper(85, 77, 62, 91, 34, 75.4, 6.4, 1)
    const neck = taper(85, 77, 99, 57, 79.4, 39.4, 6.4, 5)
    const head = 'M-3.4 -3.2C1.4 -4.6 6.6 -3.8 9.4 -1C10 -.1 9.8 1.2 8.6 1.8C5 3.6 -.6 4 -3.4 3Z'
    const belly = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-dasharray=".9 .7" opacity=".9"/>`
    const scales = (d: string) => `<path d="${d}" fill="none" stroke="${SNAKE_D}" stroke-width=".7" stroke-dasharray=".01 1.5" stroke-linecap="round"/>`
    const body = (d: string) => ({ d, fill: SNAKE, inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, SNAKE_D, 0.5) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.3, 0)}"/>` })
    return (
      k.night() +
      k.sun(C[0], C[1], 19, 48, 32) +
      `<circle cx="${C[0]}" cy="${C[1] + 4}" r="29" fill="${P.paper}"/>` + k.shade(ellipse(C[0], C[1] + 4, 29, 29), k.rad(P.gold, 0.5, 0.5, 0.5, 0, 0.75), P.gold, 0.4) +
      `<circle cx="${C[0]}" cy="${C[1] + 4}" r="29" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.floor(60, 86, 26, 3, P.goldD) +
      k.draw([body(back)], 0.7) +
      bball(k, C[0], C[1], R, { rot: -30 }) +
      k.draw([body(front), body(neck)], 0.8) +
      scales('M84 77Q62 89 38 76.4') + belly(82, 79.4, 62, 91.6, 40, 78.4) +
      scales('M86 75Q97 57 81 41') + belly(83.4, 75, 94.6, 57, 78.6, 42.2) +
      `<g transform="translate(79 39.4) rotate(200) scale(1.45)">` +
      k.draw([{ d: head, fill: SNAKE, inner: k.sh(head, 0, 0, 0, 1, 0, 0.9, SNAKE_D, 0.5) + `<path d="M-3 -2C1 -3.4 5 -3 8 -1" fill="none" stroke="#fff" stroke-width=".4" opacity=".6"/>` }], 0.6) +
      `<circle cx="4.6" cy="-1.2" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><path d="M4.6 -2V-.4" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M9.6 .4L13.6 .8L15.6 -.6M13.6 .8L15.2 2" fill="none" stroke="${P.red}" stroke-width=".55" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(33, 38, 2, P.goldL) + sparkle(88, 66, 1.4, P.goldL) + sparkle(36, 64, 1.2, P.goldL) +
      k.defs()
    )
  },

  // ── Tapón ──────────────────────────────────────────────────────────

  // Cinco tapas: la mano abierta, bien arriba, que le pega a la pelota. "¡Acá no!"
  'Mano arriba': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.stage(60, 60, 36) +
      `<path d="${starPath(58.6, 42.4, 9, 3, 10)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="${starPath(58.6, 42.4, 5, 2, 8)}" fill="${P.gold}"/>` +
      swoosh(67, 34.6, -30, 8.6, P.mid) +
      bball(k, 67, 34.6, 8.6, { rot: 30 }) +
      `<g transform="translate(48 78) rotate(14) scale(1.22)">` + hand(k) + `</g>` +
      `<text x="38" y="44" ${GEORGIA} font-style="italic" font-size="6.6" fill="${P.ink}" text-anchor="middle" transform="rotate(-12 38 44)">¡acá no!</text>` +
      sparkle(84, 62, 2) + sparkle(78, 82, 1.4) +
      k.defs()
    )
  },

  // Veinte tapas: el paraguas abierto sobre el aro. Afuera llueve; abajo del aro, seco.
  'Paraguas': (u) => {
    const k = kit(u)
    const canopy = 'M28.6 52.6Q28 30.6 60 26.6Q92 30.6 91.4 52.6Q83.6 47.8 75.8 52.6Q67.9 47.8 60 52.6Q52.1 47.8 44.2 52.6Q36.4 47.8 28.6 52.6Z'
    const shaft = 'M59.2 26H60.8V88H59.2Z'
    const net = hoopNet(60, 69, 12, 15)
    const drops: [number, number, number][] = [[30, 62, 1], [36, 74, 0.8], [27, 82, 0.9], [40, 88, 0.7], [87, 72, 0.9], [82, 86, 0.8], [92, 82, 0.6], [46, 22, 0.6], [74, 21, 0.7], [33, 39, 0.7], [88, 38, 0.6]]
    return (
      k.day() +
      k.shade('M0 0H120V130H0Z', k.lin(P.blue, 0, 0, 0, 1, 0.5, 0), P.blue, 0.35) +
      k.stage(60, 62, 33) +
      drops.map(([x, y, s]) => hair(x + 2.4 * s, y - 5 * s, x + 1.2 * s, y - 2.5 * s, x, y, 0.9 * s, P.mid)).join('') +
      // Salpicaduras en el piso, afuera del paraguas.
      [[30, 90], [88, 90]].map(([x, y]) => hair(x - 3, y, x - 2, y - 2, x - 1.4, y - 3, 0.5, P.mid) + hair(x + 3, y, x + 2, y - 2, x + 1.4, y - 3, 0.5, P.mid)).join('') +
      k.floor(60, 88, 16, 2, P.blue) +
      net.back +
      rimBack(60, 69, 12) +
      k.draw([{ d: shaft, fill: P.ink }], 0.3) +
      `<path d="M60 86Q60 93.6 55.4 93.6Q51.6 93.6 51.8 89.6" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M60 86Q60 93.6 55.4 93.6Q51.6 93.6 51.8 89.6" fill="none" stroke="${P.brown}" stroke-width="1.9" stroke-linecap="round"/>` +
      rimFront(60, 69, 12) +
      net.front +
      k.cast([canopy], 2, 2.4, P.mid) +
      k.draw([{
        d: canopy, fill: P.white,
        inner:
          `<path d="M60 25L28 53H44.2ZM60 25L60 53H75.8Z" fill="${P.red}"/>` +
          k.sh(canopy, 0, 0, 1, 1, 0, 0.75, P.wine, 0.35) + `<path d="M28 26H48V54H28Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
          `<path d="M60 27Q42 33 44.2 52.6M60 27V52.6M60 27Q78 33 75.8 52.6" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
          hair(35, 46, 40, 36, 52, 30, 0.6, '#fff', 0.8),
      }], 0.8) +
      k.draw([{ d: 'M59 21.6H61V27H59Z', fill: P.ink }, { d: ellipse(60, 21.6, 1.4, 1.4), fill: P.gold }], 0.4) +
      // La pelota del rival que rebota en el paraguas y sale despedida.
      `<path d="M84 49Q90 44 91 55" fill="none" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1.2 1"/>` +
      bball(k, 89.6, 61, 6.2, { rot: 40 }) +
      k.defs()
    )
  },

  // Sesenta tapas: la pintura (la zona) es tuya. La lata de pintura con el 4, el pincel y la zona recién pintada.
  'Scola en la pintura': (u) => {
    const k = kit(u)
    const key = 'M51.6 70H68.4L82 104H38Z'
    const puddle = 'M44 87C48 85.4 54 85.6 60 85.6C66 85.6 72.4 85.2 75.4 87.2C77.2 88.8 74 90.6 69 90.8C63 91 54 91.2 49 90.6C44.6 90.2 42.4 88.4 44 87Z'
    const brush = 'M-2.4 -8.6L-2 -27Q0 -30 2 -27L2.4 -8.6Z', ferrule = roundRect(-3.2, -9.4, 3.2, 0, 0.6)
    const scroll = 'M2 0C3.6 -3.6 8.4 -4.8 11 -2.2C13.2 0 12 3.4 9.4 3.4C7.6 3.4 7 1.6 8.2 .8'
    const label =
      `<text x="60" y="78" ${GEORGIA} font-weight="700" font-size="11" fill="${P.mid}" text-anchor="middle" stroke="${P.ink}" stroke-width=".45">4</text>` +
      `<text x="60" y="68.6" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.ink}" text-anchor="middle">pintura</text>` +
      `<g transform="translate(66.4 72) scale(.34)">` + voluta(scroll) + `</g><g transform="translate(53.6 72) scale(-.34 .34)">` + voluta(scroll) + `</g>`
    return (
      k.day() +
      k.sun(60, 50, 17, 46, 32) +
      parquet(k, 70, {
        inner:
          `<path d="${key}" fill="${P.mid}"/>` + k.sh(key, 0, 0, 0, 1, 0, 0.7, P.ink, 0.35) +
          `<path d="${key}" fill="none" stroke="#fff" stroke-width="1.1"/>` +
          `<path d="M42 70H78" stroke="#fff" stroke-width=".8"/>` +
          `<path d="${puddle}" fill="${P.mid}"/><path d="${puddle}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M48 87.4C53 86.8 60 86.8 65 87" fill="none" stroke="${P.sky}" stroke-width=".6" stroke-linecap="round"/>`,
      }) +
      `<path d="M0 70H120" stroke="${WOOD_D}" stroke-width=".6"/>` +
      // El pincel, metido en la lata.
      `<g transform="translate(65.6 56.6) rotate(38)">` +
      k.draw([
        { d: brush, fill: P.brown, inner: k.sh(brush, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<circle cx="0" cy="-24.6" r=".9" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-0.8, -10, -1, -18, -0.6, -24, 0.4, P.goldL) },
        { d: ferrule, fill: P.sky2, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) + `<path d="M-3.2 -6.6H3.2M-3.2 -5.4H3.2" stroke="${P.blue}" stroke-width=".4"/><path d="M-3.2 -2.6H3.2V0H-3.2Z" fill="${P.mid}"/>` },
      ], 0.55) +
      `</g>` +
      paintCan(k, 57, label) +
      bball(k, 34.6, 83, 7.6, { rot: 12, over: `<path d="M33 88C33.6 86 35 86.4 36 88.6C36.6 90 38.4 89.6 39 88" fill="${P.mid}" stroke="${P.ink}" stroke-width=".3"/>` }) +
      sparkle(31, 44, 2.2, P.white) + sparkle(88, 42, 1.8, P.white) + sparkle(87, 66, 1.3, P.white) +
      k.defs()
    )
  },
}
