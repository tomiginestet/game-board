// Monopoly (o Estanciero): Prontuario, Magnate hotelero y Usurero.
// El color propio del juego es el verde de su ficha: el paño del tablero de fondo, las casitas, los billetes y la caja
// fuerte. Nada del señor de galera ni del logo: los jugadores aparecen por sus objetos.
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El verde de la ficha del Monopoly (#099268), con su sombra y su luz, y el verde claro del paño.
const VERDE = '#1F9468', VERDE_D = '#0F6446', VERDE_L = '#9AD1B3'
const PANO = '#A6D4B9', PANO_G = '#86BFA0'
// Arena de la playa y café con leche.
const SAND = '#EBD8AF', CAFE = '#C99A6B'

/** Fondo del Monopoly: el papel con el verde claro del tablero granulado hacia los bordes. */
const tablero = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(PANO, 0.5, 0.46, 0.7, 0, 1), PANO_G, 0.5)

/** Paño: un disco verde claro con el borde granulado (el escenario del Monopoly). */
const pano = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E4F1E7"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(PANO, 0.5, 0.5, 0.5, 0, 1), PANO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${VERDE}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Anillo (con el agujero girado al revés para que quede hueco). */
const ring = (cx: number, cy: number, R: number, r: number) =>
  ellipse(cx, cy, R, R) + `M${f(cx - r)} ${cy}A${r} ${r} 0 1 1 ${f(cx + r)} ${cy}A${r} ${r} 0 1 1 ${f(cx - r)} ${cy}Z`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional (perchas, patas, caños). */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Cadena de hierro: eslabones a lo largo de una curva, alternando de frente y de canto. */
function chain(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number, s = 1, c: string = P.sky2) {
  return along(x0, y0, cx, cy, x1, y1, Array.from({ length: n }, (_, i) => (i + 0.5) / n))
    .map((q, i) => {
      const a = f((Math.atan2(q.dy, q.dx) * 180) / Math.PI)
      const link = i % 2
        ? `<rect x="${f(-2.5 * s)}" y="${f(-0.8 * s)}" width="${f(5 * s)}" height="${f(1.6 * s)}" rx="${f(0.8 * s)}" fill="${c}" stroke="${P.ink}" stroke-width=".5"/><path d="M${f(-1.6 * s)} ${f(-0.3 * s)}H${f(1.4 * s)}" stroke="#fff" stroke-width=".35"/>`
        : `<path d="${ring(0, 0, 2.6 * s, 1.1 * s)}" transform="scale(1 .66)" fill="${c}" stroke="${P.ink}" stroke-width=".6"/><path d="M${f(-2 * s)} ${f(-0.7 * s)}Q0 ${f(-1.9 * s)} ${f(2 * s)} ${f(-0.7 * s)}" fill="none" stroke="#fff" stroke-width=".35"/>`
      return `<g transform="translate(${f(q.x)} ${f(q.y)}) rotate(${a})">${link}</g>`
    })
    .join('')
}

/** Moneda de oro de canto inclinado: el filo, la cara con su anillo y un brillo. */
const coin = (x: number, y: number, rx: number, ry: number, rot = 0) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">` +
  `<ellipse cx="0" cy="${f(ry * 0.45)}" rx="${rx}" ry="${ry}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".4"/>` +
  `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
  `<ellipse cx="0" cy="0" rx="${f(rx * 0.64)}" ry="${f(ry * 0.6)}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>` +
  `<path d="M${f(-rx * 0.62)} ${f(-ry * 0.25)}Q${f(-rx * 0.3)} ${f(-ry * 0.82)} ${f(rx * 0.25)} ${f(-ry * 0.78)}" fill="none" stroke="${P.goldL}" stroke-width=".45"/></g>`

/** Llave antigua parada: el ojo abajo en (0,23), la caña hacia arriba y el paletón a la derecha en la punta. */
function oldKey(k: Kit, metal: string, dark: string, light: string) {
  const bow = ring(0, 23, 7.4, 3.6)
  const lobes = [[-6.8, 19.4], [6.8, 19.4], [0, 31]].map(([x, y]) => ring(x, y, 2.4, 0.9)).join('')
  const collar = 'M-3.2 12.6H3.2L2.6 16.4H-2.6Z'
  const shaft = 'M-1.6 13V-21H1.6V13Z'
  const bit = 'M1.4 -25H9.4V-21.4H6.6V-19.2H9.4V-14.6H6.6V-12.6H1.4Z'
  const tip = 'M-2.4 -25H2.4V-22.4H-2.4Z'
  const sh = (d: string) => k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.45)
  return (
    k.draw([
      { d: lobes, fill: metal, inner: sh(lobes) },
      { d: bow, fill: metal, inner: sh(bow) + `<path d="M-5 17.6C-3 16 3 16 5 17.6" fill="none" stroke="${light}" stroke-width=".6"/>` },
      { d: shaft, fill: metal, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, dark, 0.45) + `<path d="M-.7 11V-20" stroke="${light}" stroke-width=".5"/>` },
      { d: bit, fill: metal, inner: sh(bit) + `<path d="M3 -23.6V-14" stroke="${dark}" stroke-width=".4"/>` },
      { d: tip, fill: metal, inner: sh(tip) },
      { d: collar, fill: metal, inner: sh(collar) + `<path d="M-3 14.4H3" stroke="${dark}" stroke-width=".4"/>` },
    ], 0.55) +
    `<circle cx="0" cy="23" r="5.4" fill="none" stroke="${dark}" stroke-width=".4" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
    `<path d="M-4.6 20C-3.6 18.4 -1.6 17.6 0 17.8" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>`
  )
}

export const MONOPOLY_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Prontuario ─────────────────────────────────────────────────────

  // Tres veces preso: el uniforme a rayas ya cuelga de tu percha, con la bola atada a la manga.
  'Traje a rayas': (u) => {
    const k = kit(u)
    const body = 'M52.6 40.4Q60 43.6 67.4 40.4L75.6 43.4C76.4 48 76.2 53 75.8 58V88.6C66 91.4 54 91.4 44.2 88.6V58C43.8 53 43.6 48 44.4 43.4Z'
    const sl = 'M44.4 43.4C40 46.4 36 49.6 33.2 52.2C32.6 52.8 32.6 53.6 33 54.2L38.2 60.8C38.6 61.4 39.4 61.4 40 61L44.2 58C43.8 53 43.6 48 44.4 43.4Z'
    const sr = 'M75.6 43.4C80 46.4 84 49.6 86.8 52.2C87.4 52.8 87.4 53.6 87 54.2L81.8 60.8C81.4 61.4 80.6 61.4 80 61L75.8 58C76.2 53 76.4 48 75.6 43.4Z'
    const stripes = Array.from({ length: 10 }, (_, i) => {
      const y = 43.6 + i * 5
      return `M20 ${f(y)}Q60 ${f(y + 1.2)} 100 ${f(y)}V${f(y + 2.6)}Q60 ${f(y + 3.8)} 20 ${f(y + 2.6)}Z`
    }).join('')
    const ball = ellipse(80, 86.4, 6.2, 6.2)
    return (
      tablero(k) +
      pano(k, 60, 62, 33) +
      rod('M14 31H106', P.sky2, 1.6, '#fff') +
      `<g transform="translate(60 64) scale(1.04) translate(-60 -64)">` +
      k.cast([body, sl, sr], 2.4, 2.2, VERDE) +
      k.draw([
        { d: sl, fill: P.white, line: 0.4, inner: `<path d="${stripes}" fill="${P.night}" transform="rotate(38 38 54)"/>` + k.sh(sl, 0, 0, 0, 1, 0, 0.55, P.blue, 0.3) },
        { d: sr, fill: P.white, line: 0.4, inner: `<path d="${stripes}" fill="${P.night}" transform="rotate(-38 82 54)"/>` + k.sh(sr, 0, 0, 1, 1, 0.25, 0.95, P.blue, 0.4) },
        {
          d: body, fill: P.white, line: 0.4,
          inner:
            `<path d="${stripes}" fill="${P.night}"/>` +
            k.sh('M63 38C66 52 66 72 62 95H90V38Z', 0, 0, 1, 0, 0, 0.85) + k.sh('M40 38H80V50H40Z', 0, 0, 0, 1, 0.6, 0, P.blue, 0.3) +
            `<path d="M40 40H49V95H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + k.sh('M40 82H80V95H40Z', 0, 0, 0, 1, 0, 0.75, P.blue, 0.3),
        },
      ]) +
      `<path d="M52.6 40.4Q60 37.6 67.4 40.4Q60 43.6 52.6 40.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M53.4 40.6L60 38.6L66.6 40.6" fill="none" stroke="${P.brown}" stroke-width="1.2"/>` +
      `<path d="M52.6 40.4Q60 43.6 67.4 40.4L68.4 41.7Q60 45.9 51.6 41.7Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M60 43.4V52" stroke="${P.ink}" stroke-width=".5"/><circle cx="61.4" cy="46.4" r=".6" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/><circle cx="61.4" cy="50" r=".6" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{ d: roundRect(64.4, 49.4, 74, 55.8, 0.5), fill: P.paper, inner: k.sh(roundRect(64.4, 49.4, 74, 55.8, 0.5), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.35) +
      `<path d="${roundRect(65, 50, 73.4, 55.2, 0.3)}" fill="none" stroke="${P.blue}" stroke-width=".25" stroke-dasharray=".6 .4"/>` +
      `<text x="69.2" y="54.2" ${GEORGIA} font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">003</text>` +
      hair(46.2, 62, 48.6, 70, 47.6, 80, 0.7) + hair(73.8, 62, 71.4, 70, 72.4, 80, 0.7) + hair(55.4, 90, 56.4, 86, 58.4, 84, 0.55) + hair(65.4, 90.2, 64.8, 87.4, 63.2, 85.6, 0.55) +
      hair(36.6, 53.6, 39.6, 51, 42.4, 48.8, 0.45) + hair(83.4, 53.6, 80.4, 51, 77.6, 48.8, 0.45) +
      `</g>` +
      rod('M60 42V35.4C60 32.4 61.8 30.2 64 30.2C66.2 30.2 67.4 31.8 67 33.6', P.sky2, 0.9, '#fff') +
      // Grillete en el puño de la manga derecha y la cadena hasta la bola.
      `<g transform="translate(85.6 59.6) rotate(-52)"><path d="${ring(0, 0, 4.4, 2.6)}" transform="scale(1 .5)" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".9"/><path d="M-3.6 -1.2Q0 -2.6 3.6 -1.2" fill="none" stroke="#fff" stroke-width=".4"/></g>` +
      chain(86, 62.6, 92, 72, 82.6, 80.4, 7, 0.9) +
      k.floor(81.4, 92.6, 9, 1.8, P.mid) +
      k.draw([{ d: ball, fill: P.mid, inner: k.sh(ball, 0, 0, 1, 1, 0, 0.95, P.night, 0.5) + `<path d="M74 80H79V93H74Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.5, 0)}"/>` }], 0.75) +
      `<ellipse cx="77.4" cy="83.2" rx="1.8" ry="1" fill="#fff" opacity=".85" transform="rotate(-35 77.4 83.2)"/>` +
      `<path d="M78.6 80.4H82.6L82 78.8H79.2Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".45"/>` +
      sparkle(32, 40, 2) + sparkle(30, 76, 1.5) +
      k.defs()
    )
  },

  // Diez veces adentro: detrás de las rejas, la tele (con el partido) arriba de la heladerita con chapa VIP.
  'Preso VIP': (u) => {
    const k = kit(u)
    const bar = (x: number) => `M${f(x - 1.6)} 8H${f(x + 1.6)}V112H${f(x - 1.6)}Z`
    const bars = [26, 36.4, 46.8, 57.2, 67.6, 78, 88.4].map(bar).join('')
    const cross = 'M10 27.4H110V31.4H10ZM10 80.6H110V84.6H10Z'
    const cab = roundRect(37, 33.6, 83, 63, 3.4)
    const screen = 'M41.8 38Q54 36.4 66.2 38Q67.6 48.4 66.2 58.8Q54 60.4 41.8 58.8Q40.4 48.4 41.8 38Z'
    const fridge = 'M46.4 66.4C46.4 64 47.8 63 50 63H70C72.2 63 73.6 64 73.6 66.4V92.6H46.4Z'
    const plate = roundRect(53.6, 75.4, 66.4, 81, 1)
    const pitch =
      `<path d="M38 36H70V62H38Z" fill="${VERDE}"/>` +
      [0, 1, 2, 3].map((i) => `<path d="M${38 + i * 8} 36H${42 + i * 8}L${f(40 + i * 8 - 1)} 62H${f(36 + i * 8 - 1)}Z" fill="${VERDE_D}" opacity=".45"/>`).join('') +
      `<path d="M44 42H64L66 56H42Z" fill="none" stroke="#fff" stroke-width=".55"/><path d="M54 42V56" stroke="#fff" stroke-width=".5"/>` +
      `<ellipse cx="54" cy="49" rx="3.6" ry="2.4" fill="none" stroke="#fff" stroke-width=".5"/><circle cx="58.6" cy="51.6" r=".7" fill="#fff"/>` +
      k.shade(screen, k.rad('#ffffff', 0.3, 0.25, 0.7, 0.75, 0), '#ffffff', 0.3) +
      Array.from({ length: 11 }, (_, i) => `<path d="M38 ${f(38.6 + i * 2)}H70" stroke="${P.night}" stroke-width=".25" opacity=".35"/>`).join('') +
      `<path d="M43.6 40.4Q48 39 53 39" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>`
    const knob = (y: number) => `<circle cx="75.4" cy="${y}" r="2.5" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><circle cx="75.4" cy="${y}" r="1.4" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><path d="M75.4 ${f(y - 2.2)}V${f(y - 0.8)}" stroke="${P.ink}" stroke-width=".5"/>`
    return (
      tablero(k) +
      k.shade(ellipse(56, 52, 30, 26), k.rad(VERDE_L, 0.5, 0.5, 0.5, 0.8, 0), VERDE_L, 0.35) +
      k.draw([{ d: bars, fill: P.mid, inner: `<path d="${[26, 36.4, 46.8, 57.2, 67.6, 78, 88.4].map((x) => `M${f(x - 1.2)} 8H${f(x - 0.4)}V112H${f(x - 1.2)}Z`).join('')}" fill="${P.sky}"/>` + k.sh(bars, 0, 0, 0, 1, 0, 0.6, P.night, 0.3) }], 0.6) +
      k.draw([{ d: cross, fill: P.mid, inner: `<path d="M10 28.2H110M10 81.4H110" stroke="${P.sky}" stroke-width=".6"/>` + k.sh(cross, 0, 0, 0, 1, 0, 0.7, P.night, 0.4) }], 0.6) +
      [26, 36.4, 46.8, 57.2, 67.6, 78, 88.4].map((x) => `<circle cx="${x}" cy="29.4" r=".8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${x}" cy="82.6" r=".8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      k.floor(60, 93, 22, 2.6, P.night) +
      // Antena de conejo.
      rod('M62 33L50.4 24', P.sky2, 0.7, '#fff') + rod('M62 33L73.4 25.4', P.sky2, 0.7, '#fff') +
      `<circle cx="50.4" cy="24" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="73.4" cy="25.4" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M58 34.4C58 31.4 66 31.4 66 34.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.cast([fridge, cab], 2.4, 2, P.night) +
      k.draw([{
        d: fridge, fill: P.white,
        inner:
          k.sh('M66 62H76V94H66Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + k.sh('M44 84H76V94H44Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.3) +
          `<path d="M46 87.4H74V93H46Z" fill="${P.sky2}"/>` + [49, 52, 55, 58, 61, 64, 67, 70].map((x) => `<path d="M${x} 88.6V91.8" stroke="${P.mid}" stroke-width=".6"/>`).join('') +
          `<path d="M46 87.4H74" stroke="${P.ink}" stroke-width=".45"/>` +
          hair(48.6, 66, 48, 75, 48.6, 84, 0.8, '#fff'),
      }]) +
      rod('M70.4 67V78', P.sky1, 1.1, '#fff') +
      k.draw([{ d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.4) +
      `<text x="60" y="79.8" ${GEORGIA} font-weight="700" font-size="4.2" fill="${P.ink}" text-anchor="middle" letter-spacing=".3">VIP</text>` +
      `<circle cx="54.6" cy="76.4" r=".35" fill="${P.goldD}"/><circle cx="65.4" cy="76.4" r=".35" fill="${P.goldD}"/>` +
      k.draw([{
        d: cab, fill: P.brown, line: 0.35,
        inner:
          k.sh(cab, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="M36 33H44V64H36Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` +
          hair(70, 35.4, 78, 35, 81.6, 36, 0.4, P.brownD) + hair(69, 61, 76, 61.6, 81.6, 60.6, 0.45, P.brownD),
      }], 0.75) +
      `<path d="${roundRect(39.6, 36, 68.4, 61, 2.4)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.clip(screen, pitch) + `<path d="${screen}" fill="none" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M70.6 37H80.4V60H70.6Z" fill="${P.brownD}" opacity=".35"/>` +
      knob(42) + knob(49) +
      [54, 55.8, 57.6].map((y) => `<path d="M71.8 ${y}H79" stroke="${P.night}" stroke-width=".7" stroke-linecap="round"/>`).join('') +
      `<path d="M41 63V65M79 63V65" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>` +
      sparkle(88, 44, 2) + sparkle(31, 52, 1.5, P.goldL) +
      k.defs()
    )
  },

  // Veinticinco detenciones: la corona del penal, con el terciopelo a rayas, sobre las llaves cruzadas de los guardias.
  'Rey del penal': (u) => {
    const k = kit(u)
    const cap = 'M45 63C43.6 52 50 44.6 60 43.8C70 44.6 76.4 52 75 63Z'
    const capStripes = Array.from({ length: 6 }, (_, i) => {
      const y = 45.6 + i * 3.4
      return `M40 ${f(y)}Q60 ${f(y - 2.6)} 80 ${f(y)}V${f(y + 1.7)}Q60 ${f(y - 0.9)} 40 ${f(y + 1.7)}Z`
    }).join('')
    const band = 'M42.4 62.2C50 65.2 70 65.2 77.6 62.2L76.8 72.4C70 75.2 50 75.2 43.2 72.4Z'
    const fleur = 'M0 0C-2.6 -.6 -3.6 -2.8 -2.2 -4.2C-1.8 -5.6 -.8 -6.6 0 -8C.8 -6.6 1.8 -5.6 2.2 -4.2C3.6 -2.8 2.6 -.6 0 0Z'
    const fleurs = [[44.2, 64.2, -14, 0.8], [52, 65.6, -6, 0.95], [60, 66.2, 0, 1.1], [68, 65.6, 6, 0.95], [75.8, 64.2, 14, 0.8]]
      .map(([x, y, r, s]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: fleur, fill: P.gold, inner: k.sh(fleur, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) }], 0.4 / s) + `<path d="M0 -1V-6.4" stroke="${P.goldD}" stroke-width=".35"/></g>`).join('')
    const arch = (d: string) => rod(d, P.gold, 2.4, P.goldL)
    const pearls = (d: [number, number, number, number, number, number]) => along(...d, [0.15, 0.32, 0.5, 0.68, 0.85]).map((q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r=".7" fill="${P.white}" stroke="${P.goldD}" stroke-width=".25"/>`).join('')
    const gem = (x: number, y: number, rx: number, ry: number, c: string, dk: string) =>
      `<ellipse cx="${x}" cy="${y}" rx="${f(rx + 0.9)}" ry="${f(ry + 0.9)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M${f(x - rx * 0.6)} ${y}L${x} ${f(y - ry * 0.7)}L${f(x + rx * 0.6)} ${y}L${x} ${f(y + ry * 0.7)}Z" fill="${dk}" opacity=".5"/><circle cx="${f(x - rx * 0.35)}" cy="${f(y - ry * 0.35)}" r="${f(ry * 0.28)}" fill="#fff"/>`
    return (
      tablero(k) +
      k.sun(60, 56, 16, 47, 28, false) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(60 59) rotate(-40) scale(1.22)">` + k.cast(['M-1.6 13V-21H1.6V13Z'], 1.6, 1.6, VERDE_D) + oldKey(k, P.sky1, P.blue, '#fff') + `</g>` +
      `<g transform="translate(60 59) rotate(40) scale(-1.22 1.22)">` + oldKey(k, P.gold, P.goldD, P.goldL) + `</g>` +
      k.floor(60, 74, 20, 3.4, VERDE_D) +
      k.draw([{ d: cap, fill: P.white, inner: `<path d="${capStripes}" fill="${P.night}"/>` + k.sh(cap, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) + `<path d="M46 50C48 47 51 45.6 54 45" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/>` }], 0.7) +
      arch('M45.4 63C45 52 51.4 45 60 44.2') + arch('M74.6 63C75 52 68.6 45 60 44.2') + arch('M60 64.6V44.2') +
      pearls([45.4, 63, 46, 47, 60, 44.2]) + pearls([74.6, 63, 74, 47, 60, 44.2]) +
      fleurs +
      k.draw([{
        d: band, fill: P.gold,
        inner:
          k.sh(band, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M42 62H50V76H42Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M43 64.4C50 67.2 70 67.2 77 64.4M43.4 70.6C50 73.2 70 73.2 76.6 70.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
          `<path d="M43 64.4C50 67.2 70 67.2 77 64.4" fill="none" stroke="${P.goldL}" stroke-width=".5" transform="translate(0 .7)"/>`,
      }], 0.75) +
      gem(60, 68.8, 2.6, 2.2, P.red, P.wine) + gem(51, 68.4, 2, 1.8, VERDE, VERDE_D) + gem(69, 68.4, 2, 1.8, VERDE, VERDE_D) +
      [46.2, 55.6, 64.4, 73.8].map((x) => `<circle cx="${x}" cy="${f(68.2 - Math.abs(x - 60) * 0.06)}" r=".9" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      k.draw([{ d: ellipse(60, 41, 3.4, 3.4), fill: P.gold, inner: k.sh(ellipse(60, 41, 3.4, 3.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M56.6 41H63.4" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.5) +
      `<path d="M58.8 31.4H61.2V33.8H63.4V36.2H61.2V38H58.8V36.2H56.6V33.8H58.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<circle cx="58.8" cy="40" r=".7" fill="#fff"/>` +
      sparkle(60, 24, 2.8, '#fff') + sparkle(33, 46, 2) + sparkle(88, 70, 1.6) +
      k.defs()
    )
  },

  // ── Magnate hotelero ───────────────────────────────────────────────

  // Dos hoteles: la pensión de la familia, con su café con leche, las medialunas y la llave de la pieza.
  'Pensión familiar': (u) => {
    const k = kit(u)
    const saucer = ellipse(60, 84.4, 25, 6.6)
    const body = 'M48 58C48 70 53 79.6 62 80.8C71 79.6 76 70 76 58Z'
    const rim = ellipse(62, 58, 14, 3.6)
    const milk = ellipse(62, 58.4, 12.2, 2.6)
    const foot = 'M56.4 80H67.6L67 82.8H57Z'
    const handle = 'M75.4 61.4C81 60.6 83.6 64 82.2 67.6C80.8 71 76.8 72.6 73 73.4L73.6 70.4C76 69.8 78.6 68.6 79.4 66.6C80.2 64.6 78.6 63.4 75.6 64.2Z'
    const medialuna = (x: number, y: number, r: number, s: number) => {
      const d = 'M-10 2.6C-10.8 -1.8 -6.6 -6 0 -6C6.6 -6 10.8 -1.8 10 2.6C8.4 3.2 7.2 1.6 5.8 1C4.2 .4 2 .2 0 .2C-2 .2 -4.2 .4 -5.8 1C-7.2 1.6 -8.4 3.2 -10 2.6Z'
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
        k.draw([{
          d, fill: P.gold,
          inner:
            k.sh(d, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-9 -7H9V-3C4 -5 -4 -5 -9 -3Z" fill="${P.goldD}" opacity=".35"/>` +
            hair(-6.4, 1.2, -5, -2, -3.4, -5.4, 0.55, P.brownD) + hair(-2.2, .4, -1.4, -2.8, -.6, -5.8, 0.55, P.brownD) + hair(2.2, .4, 1.4, -2.8, .6, -5.8, 0.55, P.brownD) + hair(6.4, 1.2, 5, -2, 3.4, -5.4, 0.55, P.brownD) +
            `<path d="M-6 -3.4C-3 -5 3 -5 6 -3.4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".75"/>`,
        }], 0.5 / s) + `</g>`
    }
    const tag = 'M0 0C2.6 0 3.6 2.4 3.4 5L2.8 13C2.6 15 1.6 16 0 16C-1.6 16 -2.6 15 -2.8 13L-3.4 5C-3.6 2.4 -2.6 0 0 0Z'
    return (
      tablero(k) +
      pano(k, 60, 62, 33) +
      k.floor(61, 88.6, 26, 3, VERDE_D) +
      k.draw([{ d: saucer, fill: P.white, inner: k.sh(saucer, 0, 0, 1, 1, 0, 0.8, P.blue, 0.35) + `<path d="${ellipse(60, 83.6, 21.4, 4.8)}" fill="none" stroke="${VERDE}" stroke-width=".7"/>` + `<path d="${ellipse(62, 83, 9.6, 2.4)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` }], 0.6) +
      k.draw([
        { d: foot, fill: P.white, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) },
        { d: handle, fill: P.white, inner: k.sh(handle, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) },
        {
          d: body, fill: P.white,
          inner:
            k.sh('M64 56C72 62 74 72 68 84H80V56Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + k.sh('M46 72H78V82H46Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
            `<path d="M40 61.6Q62 64.6 84 61.6V64.2Q62 67.2 40 64.2Z" fill="${VERDE}"/><path d="M40 66Q62 69 84 66" fill="none" stroke="${VERDE}" stroke-width=".45"/>` +
            `<path d="M51 62C51.4 68 53.6 74 57 77.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>`,
        },
        { d: rim, fill: P.white, inner: `<path d="${milk}" fill="${CAFE}"/>` + k.sh(milk, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M54 58.4C57 57 63 56.8 67 57.6" fill="none" stroke="${P.paper}" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` },
      ], 0.65) +
      `<path d="${milk}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      hair(58, 54, 54.6, 48, 58.6, 42, 0.9, P.blue) + hair(64.4, 53.6, 67.6, 47, 64, 40, 0.8, P.blue) + hair(61.4, 50, 59.4, 44.4, 61.8, 37.4, 0.55, P.blue) +
      medialuna(36.6, 80.6, -26, 1.02) + medialuna(44.6, 87.6, -6, 1.06) +
      // La llave de la pieza 2, con su perita verde.
      `<g transform="translate(84 74) rotate(16)">` +
      rod('M0 -1.6V-6.4', P.gold, 0.8) + `<circle cx="0" cy="-7.4" r="1.4" fill="none" stroke="${P.ink}" stroke-width="1.3"/><circle cx="0" cy="-7.4" r="1.4" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
      k.draw([{ d: tag, fill: VERDE, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.9, VERDE_D, 0.5) + `<path d="M-2 2.4C-2.4 6 -2.2 10 -1.4 13" fill="none" stroke="${VERDE_L}" stroke-width=".7" stroke-linecap="round"/>` }], 0.5) +
      `<circle cx="0" cy="2" r=".7" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x=".2" y="11" ${GEORGIA} font-weight="700" font-size="5.6" fill="${P.goldL}" text-anchor="middle">2</text>` +
      `</g>` +
      sparkle(86, 42, 2.2) + sparkle(36, 44, 1.6) +
      k.defs()
    )
  },

  // Ocho hoteles: el gran hotel de la rambla, de ladrillo y pizarra, con la sombrilla clavada en la arena.
  'Hotel en Mar del Plata': (u) => {
    const k = kit(u)
    const wings = 'M30 53H90V77H30Z'
    const wingRoof = 'M30.4 53L34 46.4H86L89.6 53Z'
    const pav = 'M50 45H70V77H50Z'
    const pavRoof = 'M49 45L52.4 35H67.6L71 45Z'
    const sand = 'M10 77H110V112H10Z'
    const wins = (x0: number, n: number, y: number, w = 2.6, h = 3.6) =>
      Array.from({ length: n }, (_, i) => `<rect x="${f(x0 + i * 4.8)}" y="${y}" width="${w}" height="${h}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><path d="M${f(x0 + i * 4.8)} ${f(y + h * 0.45)}H${f(x0 + i * 4.8 + w)}" stroke="${P.blue}" stroke-width=".25"/>`).join('')
    const arches = (x0: number, n: number) =>
      Array.from({ length: n }, (_, i) => { const x = x0 + i * 4.8; return `<path d="M${f(x)} 77V73.4A1.4 1.4 0 0 1 ${f(x + 2.8)} 73.4V77Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".35"/>` }).join('')
    const canopy = 'M28.6 72C29.6 64.6 35.4 60.2 42 60.2C48.6 60.2 54.4 64.6 55.4 72C54 71 52.2 71 50.8 72.2C49.4 71 47.2 70.8 45.6 72C44 70.8 40.6 70.8 38.6 72C37 70.8 34.8 71 33.2 72.2C31.8 71 30 71 28.6 72Z'
    const panels = [0, 2, 4].map((i) => {
      const a0 = 28.6 + i * 4.47, a1 = a0 + 4.47
      return `M42 60.2L${f(a0)} 72.4L${f(a1)} 72.4Z`
    }).join('')
    return (
      tablero(k) +
      k.sun(60, 47, 13, 45) +
      k.shade(ellipse(60, 47, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      rod('M60 35V24.4', P.sky2, 0.6) +
      `<path d="M60.4 24.6H67.4V29.4H60.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M60.4 24.6H67.4V26.2H60.4ZM60.4 27.8H67.4V29.4H60.4Z" fill="${P.sky}"/><circle cx="63.9" cy="27" r=".5" fill="${P.gold}"/>` +
      k.draw([
        { d: wingRoof, fill: P.mid, inner: k.sh(wingRoof, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + [37, 42, 47, 73, 78, 83].map((x) => `<path d="M${x - 1.2} 52.4V49.4A1.2 1.2 0 0 1 ${x + 1.2} 49.4V52.4Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".3"/>`).join('') },
        {
          d: wings, fill: P.red, line: 0.35,
          inner:
            k.sh(wings, 0, 0, 1, 0, 0, 0.7, P.wine, 0.4) + `<path d="M30 53H90V54.8H30ZM30 64H90V65.4H30ZM30 71.6H90V72.6H30Z" fill="${P.paper}"/>` +
            Array.from({ length: 6 }, (_, i) => hair(31, 56.4 + i * 3.2 - (i > 2 ? 1.6 : 0), 40, 56 + i * 3.2, 48, 56.4 + i * 3.2, 0.25, P.wine, 0.6)).join(''),
        },
      ], 0.7) +
      wins(32.4, 4, 56.6) + wins(68.4, 4, 56.6) + wins(32.4, 4, 66) + wins(68.4, 4, 66) + arches(32.6, 4) + arches(68.6, 4) +
      k.draw([
        { d: pavRoof, fill: P.mid, inner: k.sh(pavRoof, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<circle cx="60" cy="40.4" r="2.2" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><path d="M60 38.2V42.6M57.8 40.4H62.2" stroke="${P.ink}" stroke-width=".3"/>` + hair(53, 44, 55, 39, 53.6, 36, 0.5, '#fff', 0.5) },
        {
          d: pav, fill: P.red, line: 0.35,
          inner:
            k.sh(pav, 0, 0, 1, 0, 0, 0.6, P.wine, 0.35) + `<path d="M50 45H70V46.8H50ZM50 45H52V77H50ZM68 45H70V77H68Z" fill="${P.paper}"/>` +
            [51, 55, 59, 63, 67, 71, 75].map((y) => `<path d="M50 ${y}H52M68 ${y}H70" stroke="${P.sky2}" stroke-width=".5"/>`).join(''),
        },
      ], 0.7) +
      [53.4, 58.7, 64].map((x) => `<path d="M${x} 54V50.4A1.3 1.3 0 0 1 ${f(x + 2.6)} 50.4V54Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><path d="M${x} 63V59.4A1.3 1.3 0 0 1 ${f(x + 2.6)} 59.4V63Z" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<path d="M55.6 77V71.4A4.4 4.4 0 0 1 64.4 71.4V77Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/><path d="M55 70.6H65" stroke="${P.paper}" stroke-width=".9"/>` +
      k.draw([{ d: sand, fill: SAND, inner: k.sh(sand, 0, 0, 0, 1, 0, 0.7, P.goldD, 0.35) + hair(62, 84, 70, 83, 78, 84.4, 0.4, P.goldD) + hair(44, 92, 52, 91, 60, 92.4, 0.4, P.goldD) + hair(68, 96, 74, 95.2, 80, 96.2, 0.35, P.goldD) }], 0.5) +
      `<path d="M10 77H110" stroke="${P.ink}" stroke-width=".9"/>` +
      `<path d="M24 78.6H96" stroke="${P.paper}" stroke-width="1.6"/><path d="M24 79.6H96" stroke="${P.ink}" stroke-width=".4"/>` +
      k.floor(46, 91.6, 13, 2, P.goldD) +
      rod('M42 61L43.4 91', P.white, 0.9) + `<path d="M42.3 64L43.6 90" stroke="${VERDE}" stroke-width=".5" stroke-dasharray="1.4 1.4"/>` +
      k.draw([{ d: canopy, fill: P.white, inner: `<path d="${panels}" fill="${VERDE}"/>` + k.sh(canopy, 0, 0, 1, 1, 0, 0.8, VERDE_D, 0.45) + `<path d="M31 66C33 63.4 36 62 39 61.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>` }], 0.6) +
      `<circle cx="42" cy="59.8" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(88, 40, 2.2) + sparkle(82, 88, 1.4) +
      k.defs()
    )
  },

  // Veinte hoteles: el Llao Llao con sus techos verdes, entre el lago y los cerros nevados.
  'Llao Llao': (u) => {
    const k = kit(u)
    const mount = 'M8 76L24 56L30 59L42 41L48 46L58 32L66 43L72 39L84 52L90 50L112 76Z'
    const snowLine = 'M0 0H120V44L84 44L80 48.6L76 45.4L72 49L68 45.6L64 48.8L60 44.4L56 48.6L52 45.8L48 50L44 46.4L40 50.6L36 47L0 50Z'
    const lake = 'M10 76H110V112H10Z'
    const hill = 'M12 80C22 72 38 66.6 60 66C82 66.6 98 72 108 80Z'
    const base = 'M33 64H87V70.4H33Z'
    const wingL = 'M35 54H53V64H35Z', roofL = 'M33.6 54.4L38.2 45.6H50L54.4 54.4Z'
    const wingR = 'M67 54H85V64H67Z', roofR = 'M65.6 54.4L70 45.6H81.8L86.4 54.4Z'
    const tower = 'M53 39H67V64H53Z', towerRoof = 'M51.4 39.6L60 27.4L68.6 39.6Z'
    const turret = 'M29 52H35V66H29Z', turretRoof = 'M28 52.4L32 43.4L36 52.4Z'
    const shingles = (x0: number, x1: number, y0: number, y1: number, n: number) =>
      Array.from({ length: n }, (_, i) => { const y = y0 + ((y1 - y0) * (i + 1)) / (n + 1); return hair(x0, y, (x0 + x1) / 2, y + 0.3, x1, y, 0.35, VERDE_D, 0.8) }).join('')
    const timber = (x0: number, x1: number, y0: number, y1: number) =>
      `<path d="M${x0} ${f((y0 + y1) / 2)}H${x1}" stroke="${P.brownD}" stroke-width=".45"/>` +
      Array.from({ length: Math.round((x1 - x0) / 3.6) }, (_, i) => { const x = x0 + 1.8 + i * 3.6; return `<rect x="${f(x - 0.8)}" y="${f(y0 + 1.2)}" width="1.6" height="2.4" fill="${P.night}"/><rect x="${f(x - 0.8)}" y="${f((y0 + y1) / 2 + 1)}" width="1.6" height="2.4" fill="${P.night}"/>` }).join('')
    const cypress = (x: number, y: number, h: number) => {
      const d = `M${x} ${f(y - h)}C${f(x + 2.6)} ${f(y - h * 0.6)} ${f(x + 3.6)} ${f(y - h * 0.2)} ${f(x + 2.4)} ${y}H${f(x - 2.4)}C${f(x - 3.6)} ${f(y - h * 0.2)} ${f(x - 2.6)} ${f(y - h * 0.6)} ${x} ${f(y - h)}Z`
      return k.draw([{ d, fill: P.greenD, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, '#2F4419', 0.5) + hair(x - 1, y - h * 0.7, x - 1.8, y - h * 0.4, x - 1.2, y - 2, 0.4, P.green) }], 0.5)
    }
    return (
      tablero(k) +
      k.sun(60, 42, 12, 44, 28, false) +
      k.shade(ellipse(60, 42, 20, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      k.draw([{
        d: mount, fill: P.sky,
        inner:
          k.sh(mount, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + k.clip(mount, `<path d="${snowLine}" fill="${P.white}"/>`) + k.sh('M58 30H90V60H58Z', 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) +
          hair(58, 33, 56, 42, 50, 52, 0.5, P.mid) + hair(42, 42, 40, 50, 34, 58, 0.45, P.mid) + hair(72, 40, 73, 48, 70, 56, 0.45, P.mid) + hair(66, 44, 64, 54, 66, 64, 0.4, P.blue),
      }], 0.6) +
      k.draw([{ d: lake, fill: P.sky, inner: k.sh(lake, 0, 0, 0, 1, 0.5, 0, P.white, 0.35) + k.sh(lake, 0, 0, 0, 1, 0, 0.8, P.mid, 0.4) + hair(36, 86, 46, 85.4, 56, 86.2, 0.5, '#fff') + hair(62, 90, 72, 89.4, 82, 90.4, 0.5, '#fff') + hair(44, 95, 52, 94.6, 60, 95.4, 0.45, '#fff') }], 0.5) +
      k.draw([{ d: hill, fill: VERDE_D, inner: k.sh(hill, 0, 0, 1, 1, 0, 0.8, '#08402C', 0.5) + Array.from({ length: 14 }, (_, i) => { const x = 18 + i * 6.4, y = 78 - Math.sin((i / 13) * Math.PI) * 9; return `<path d="M${f(x)} ${f(y)}L${f(x + 1.4)} ${f(y - 3.4)}L${f(x + 2.8)} ${f(y)}Z" fill="${VERDE}"/>` }).join('') }], 0.6) +
      // Reflejo del hotel en el lago.
      `<g opacity=".3">` + [44, 52, 60, 68, 76].map((x) => hair(x - 4, 82 + (x % 3), x, 81.6, x + 4, 82 + (x % 3), 0.7, VERDE_D)).join('') + `</g>` +
      k.draw([
        { d: turretRoof, fill: VERDE, inner: k.sh(turretRoof, 0, 0, 1, 0, 0, 0.9, VERDE_D, 0.5) },
        { d: turret, fill: P.white, inner: k.sh(turret, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + timber(29, 35, 52, 64) },
        { d: roofL, fill: VERDE, inner: k.sh(roofL, 0, 0, 1, 1, 0, 0.8, VERDE_D, 0.45) + shingles(36, 52, 45.6, 54.4, 3) + `<path d="M41 54V50.6A1.4 1.4 0 0 1 43.8 50.6V54Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` },
        { d: wingL, fill: P.white, inner: k.sh(wingL, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + timber(35, 53, 54, 64) },
        { d: roofR, fill: VERDE, inner: k.sh(roofR, 0, 0, 1, 1, 0, 0.9, VERDE_D, 0.5) + shingles(68, 84, 45.6, 54.4, 3) + `<path d="M75 54V50.6A1.4 1.4 0 0 1 77.8 50.6V54Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` },
        { d: wingR, fill: P.white, inner: k.sh(wingR, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + timber(67, 85, 54, 64) },
        { d: towerRoof, fill: VERDE, inner: k.sh(towerRoof, 0, 0, 1, 0, 0, 0.9, VERDE_D, 0.5) + shingles(54, 66, 30, 39.6, 3) + `<path d="M51.4 39.6H60V27.4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` },
        {
          d: tower, fill: P.white,
          inner: k.sh(tower, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M53 39H67V41H53Z" fill="${P.brownD}"/>` +
            [44, 50.6, 57.2].map((y) => `<rect x="55" y="${y}" width="2.2" height="3.6" fill="${P.night}"/><rect x="58.9" y="${y}" width="2.2" height="3.6" fill="${P.night}"/><rect x="62.8" y="${y}" width="2.2" height="3.6" fill="${P.night}"/>`).join('') +
            `<path d="M53 48.4H67M53 55H67" stroke="${P.brownD}" stroke-width=".45"/>`,
        },
        {
          d: base, fill: P.sky2,
          inner: k.sh(base, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<path d="M33 67.2H87" stroke="${P.blue}" stroke-width=".35"/>` +
            Array.from({ length: 13 }, (_, i) => `<path d="M${f(35 + i * 4.2)} 64V67.2M${f(37 + i * 4.2)} 67.2V70.4" stroke="${P.blue}" stroke-width=".3"/>`).join('') +
            `<path d="M57.6 70.4V67A2.4 2.4 0 0 1 62.4 67V70.4Z" fill="${P.night}"/>`,
        },
      ], 0.6) +
      rod('M60 27.6V22.6', P.gold, 0.6) + `<circle cx="60" cy="22.2" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      cypress(25, 82, 18) + cypress(95, 82, 16) + cypress(30.6, 84, 12) +
      sparkle(86, 30, 2.2, '#fff') + sparkle(34, 34, 1.6) +
      k.defs()
    )
  },

  // ── Usurero ────────────────────────────────────────────────────────

  // Fundiste a alguien: el martillo del remate le pega a la silla, que ya tiene su título colgado.
  'Martillero': (u) => {
    const k = kit(u)
    const seat = ellipse(62, 71, 13, 4.4)
    const cane = ellipse(62, 70.8, 11.2, 3.3)
    const deed = roundRect(-6, 0, 6, 14.6, 0.8)
    const head = roundRect(-4.4, -8.6, 4.4, 8.6, 1.8)
    const handle = 'M-4.2 -1.3H-24C-25.4 -1.3 -26.6 -2.2 -27.4 -2.2C-29.4 -2.2 -30.4 -1 -30.4 0C-30.4 1 -29.4 2.2 -27.4 2.2C-26.6 2.2 -25.4 1.3 -24 1.3H-4.2Z'
    return (
      tablero(k) +
      pano(k, 60, 62, 33) +
      k.floor(62, 92, 18, 2.4, VERDE_D) +
      // Silla de café: patas de atrás, respaldo curvado de madera, asiento de esterilla y patas de adelante.
      rod('M56 72L57.6 89', P.brownD, 1.9) + rod('M68 72L66.6 89', P.brownD, 1.9) +
      rod('M53.6 70.6C51.6 58 52.4 41.4 62 37.4C71.6 41.4 72.4 58 70.4 70.6', P.brown, 2.6, P.goldL) +
      rod('M56.4 67C55.8 57 56.6 46.6 62 44C67.4 46.6 68.2 57 67.6 67', P.brown, 1.5, P.goldL) +
      `<path d="${ellipse(62, 84.4, 10.4, 2.6)}" fill="none" stroke="${P.ink}" stroke-width="2.1"/><path d="${ellipse(62, 84.4, 10.4, 2.6)}" fill="none" stroke="${P.brown}" stroke-width="1"/>` +
      k.draw([{ d: seat, fill: P.brown, inner: k.sh(seat, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) }], 0.6) +
      `<path d="${cane}" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".4"/>` +
      k.clip(cane, Array.from({ length: 12 }, (_, i) => `<path d="M${48 + i * 2.6} 66L${54 + i * 2.6} 76M${54 + i * 2.6} 66L${48 + i * 2.6} 76" stroke="${P.goldD}" stroke-width=".3"/>`).join('') + k.sh(cane, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.3)) +
      rod('M51.4 72.6L49.4 92', P.brown, 2.1, P.goldL) + rod('M72.6 72.6L74.6 92', P.brown, 2.1) +
      // El título de propiedad, colgado del respaldo.
      `<path d="M67.6 41.6C71 41 74.4 42.4 76.6 45" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(77.6 44.6) rotate(14)">` +
      k.draw([{ d: deed, fill: P.white, inner: `<path d="M-6 0H6V4.4H-6Z" fill="${VERDE}"/>` + k.sh(deed, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + `<path d="M-4 6.8H4M-4 8.6H4M-4 10.4H2" stroke="${P.sky}" stroke-width=".5"/>` }], 0.45) +
      `<circle cx="0" cy="1.4" r=".6" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x="0" y="12.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="3.4" fill="${P.red}" text-anchor="middle" transform="rotate(-14 0 11.6)">vendido</text>` +
      `</g>` +
      // El martillo, en el momento del golpe.
      `<g transform="translate(47.6 57.4) rotate(-14)">` +
      k.draw([
        { d: handle, fill: P.brownD, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, P.night, 0.4) + `<path d="M-24 -.5H-6" stroke="${P.brown}" stroke-width=".6"/><path d="M-20 -1.3V1.3M-17.6 -1.3V1.3M-10 -1.3V1.3" stroke="${P.night}" stroke-width=".5"/>` },
        { d: head, fill: P.brownD, inner: k.sh(head, 0, 0, 1, 0, 0, 0.9, P.night, 0.45) + `<path d="M-4.4 -8H-1.4V8H-4.4Z" fill="${P.brown}"/><path d="M-4.4 -4.4H4.4V-2.6H-4.4ZM-4.4 2.6H4.4V4.4H-4.4Z" fill="${P.gold}"/><path d="M-4.4 -4.4H4.4M-4.4 -2.6H4.4M-4.4 2.6H4.4M-4.4 4.4H4.4" stroke="${P.goldD}" stroke-width=".35"/>` },
      ], 0.6) +
      `<path d="M-3 -6.8V-5.4M-3 5.4V6.8" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>` +
      hair(35, 46, 38.4, 41, 44, 38.6, 0.6, P.mid) + hair(32, 52, 35, 47, 40, 44.4, 0.5, P.mid) +
      [[-150, 5], [-120, 6], [-40, 5], [-10, 6], [20, 5]].map(([a, l]) => { const r = (a * Math.PI) / 180; return hair(51.4 + Math.cos(r) * 2.6, 68.8 + Math.sin(r) * 2.6, 51.4 + Math.cos(r) * (2.6 + l / 2), 68.8 + Math.sin(r) * (2.6 + l / 2), 51.4 + Math.cos(r) * (2.6 + l), 68.8 + Math.sin(r) * (2.6 + l), 0.6, P.goldD) }).join('') +
      `<text x="30" y="34" ${GEORGIA} font-style="italic" font-size="5.4" fill="${P.ink}" transform="rotate(-10 30 34)">¡a la una!</text>` +
      sparkle(88, 70, 1.8) +
      k.defs()
    )
  },

  // Cinco quiebras: la puerta del tesoro, verde y con filetes dorados, cruzada por la cadena y el candado.
  'Corralito': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58
    const steel = ring(cx, cy, 30, 24.4)
    const door = ellipse(cx, cy, 24.4, 24.4)
    const bolts = Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 27.2)}" cy="${f(cy + Math.sin(a) * 27.2)}" r="1.05" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(cx + Math.cos(a) * 27.2 - 0.3)}" cy="${f(cy + Math.sin(a) * 27.2 - 0.3)}" r=".35" fill="#fff"/>` }).join('')
    const curl = (a: number) => `<g transform="rotate(${a} ${cx} ${cy})"><path d="M${cx} ${f(cy - 21.4)}C${cx + 4} ${f(cy - 21)} ${cx + 7} ${f(cy - 18)} ${cx + 6} ${f(cy - 15.4)}C${cx + 5.2} ${f(cy - 13.6)} ${cx + 3} ${f(cy - 14)} ${cx + 3.2} ${f(cy - 15.6)}M${cx} ${f(cy - 21.4)}C${cx - 4} ${f(cy - 21)} ${cx - 7} ${f(cy - 18)} ${cx - 6} ${f(cy - 15.4)}C${cx - 5.2} ${f(cy - 13.6)} ${cx - 3} ${f(cy - 14)} ${cx - 3.2} ${f(cy - 15.6)}" fill="none" stroke="${P.gold}" stroke-width=".6"/><circle cx="${cx}" cy="${f(cy - 19.6)}" r=".8" fill="${P.gold}"/></g>`
    const spokes = [0, 72, 144, 216, 288].map((a) => {
      const r = ((a - 90) * Math.PI) / 180, x = cx + Math.cos(r) * 12.4, y = cy + 8 + Math.sin(r) * 12.4
      return rod(`M${cx} ${cy + 8}L${f(x)} ${f(y)}`, P.sky1, 1.4, '#fff') + `<circle cx="${f(x)}" cy="${f(y)}" r="1.9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(x - 0.6)}" cy="${f(y - 0.6)}" r=".55" fill="${P.goldL}"/>`
    }).join('')
    const dial = ellipse(cx, cy - 10, 6.2, 6.2)
    const ticks = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2, l = i % 6 ? 1 : 1.8; return `<path d="M${f(cx + Math.cos(a) * 5.6)} ${f(cy - 10 + Math.sin(a) * 5.6)}L${f(cx + Math.cos(a) * (5.6 - l))} ${f(cy - 10 + Math.sin(a) * (5.6 - l))}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const lockBody = roundRect(52.4, 66, 67.6, 80, 2.4)
    return (
      tablero(k) +
      k.shade(ellipse(cx, cy, 36, 36), k.rad(VERDE_D, 0.5, 0.5, 0.5, 0, 0.5), VERDE_D, 0.25) +
      k.floor(cx, 92, 26, 2.6, VERDE_D) +
      k.cast([steel], 2.4, 2.4, VERDE_D) +
      k.draw([
        { d: steel, fill: P.sky1, inner: k.sh(steel, 0, 0, 1, 1, 0, 0.9, P.blue, 0.5) + `<path d="M34 46C38 36 46 31 54 29.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` },
        {
          d: door, fill: VERDE,
          inner:
            k.sh(door, 0, 0, 1, 1, 0, 0.95, VERDE_D, 0.55) + `<path d="M34 34H48V84H34Z" fill="${k.lin(VERDE_L, 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<circle cx="${cx}" cy="${cy}" r="22.2" fill="none" stroke="${P.gold}" stroke-width=".7"/><circle cx="${cx}" cy="${cy}" r="21" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` +
            [0, 90, 180, 270].map(curl).join(''),
        },
      ], 0.75) +
      bolts +
      k.draw([{ d: dial, fill: P.white, inner: k.sh(dial, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + ticks }], 0.5) +
      `<circle cx="${cx}" cy="${cy - 10}" r="2" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><path d="M${cx} ${cy - 15.4}L${cx - 0.8} ${cy - 17}H${cx + 0.8}Z" fill="${P.red}"/>` +
      spokes +
      `<circle cx="${cx}" cy="${cy + 8}" r="3.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/>` +
      // La cadena en cruz y el candado.
      chain(31, 33, 60, 58, 89, 83, 15, 1.25) + chain(89, 33, 60, 58, 31, 83, 15, 1.25) +
      rod('M55.2 66.4V61.6C55.2 55.2 64.8 55.2 64.8 61.6V66.4', P.sky1, 1.9, '#fff') +
      k.draw([{ d: lockBody, fill: P.gold, inner: k.sh(lockBody, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M52 66H56V81H52Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` + `<path d="M52.4 68.4H67.6M52.4 77.6H67.6" stroke="${P.goldD}" stroke-width=".45"/>` }], 0.6) +
      `<circle cx="60" cy="72" r="1.5" fill="${P.ink}"/><path d="M59.3 72.4L58.8 75.6H61.2L60.7 72.4Z" fill="${P.ink}"/>` +
      sparkle(36, 34, 2.2, '#fff') + sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Doce quiebras: la pileta llena de monedas de oro, el trampolín y el chapuzón que las hace saltar.
  'Tío Rico': (u) => {
    const k = kit(u)
    const outer = ellipse(60, 76, 32, 13.2)
    const inner = ellipse(60, 75.2, 27, 9.8)
    const pile: string[] = []
    for (let i = 0; i < 70; i++) {
      const x = 60 + (((i * 37) % 54) - 27) + ((i * 7) % 5) * 0.3, y = 66.4 + ((i * 13) % 19)
      if (((x - 60) / 26) ** 2 + ((y - 75.6) / 9.2) ** 2 < 0.9) pile.push(`${f(x)},${f(y)},${(i * 29) % 40 - 20}`)
    }
    pile.sort((a, b) => +a.split(',')[1] - +b.split(',')[1])
    const pileSvg = pile.map((s) => { const [x, y, r] = s.split(',').map(Number); return coin(x, y, 2.5, 1.15, r) }).join('')
    const fly: [number, number, number, number, number][] = [
      [57, 61, 2.6, 1.2, -10], [62.4, 56, 2.4, 1.4, 30], [55, 50, 2.2, 2.2, 0], [61, 45, 2.4, 0.8, -60], [66.6, 49, 2.2, 1.8, 20],
      [51, 56, 2.2, 1, -30], [58, 39, 2, 2, 0], [70, 58, 2.2, 1.2, 40], [48.6, 46, 2, 1.4, 50], [65, 36, 1.8, 0.9, -20],
    ]
    const bill = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-5" y="-2.4" width="10" height="4.8" fill="${VERDE_L}" stroke="${P.ink}" stroke-width=".4"/><rect x="-4.2" y="-1.7" width="8.4" height="3.4" fill="none" stroke="${VERDE}" stroke-width=".35"/><circle cx="0" cy="0" r="1.2" fill="${VERDE}"/><text x="0" y=".9" ${GEORGIA} font-size="2.2" font-weight="700" fill="${P.paper}" text-anchor="middle">$</text></g>`
    const board = 'M68.4 61.4L96 68.4V71L68.4 63.8Z'
    return (
      tablero(k) +
      k.sun(60, 50, 14, 47, 28, false) +
      k.shade(ellipse(60, 50, 22, 20), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.floor(60, 82, 36, 6, VERDE_D) +
      k.draw([{ d: outer, fill: P.white, inner: k.sh(outer, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.75) +
      `<path d="${ellipse(60, 75.6, 29.5, 11.5)}" fill="none" stroke="${VERDE}" stroke-width="2.6" stroke-dasharray="2.4 2.4"/>` +
      `<path d="${inner}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".7"/>` +
      k.clip(inner, `<path d="${inner}" fill="${P.gold}" transform="translate(0 1.6)"/>` + pileSvg + bill(46, 77, -14) + bill(72, 79.4, 10) + k.sh(inner, 0, 0, 0, 1, 0.4, 0, P.goldD, 0.3)) +
      // Escalerita de caños al costado.
      rod('M35.4 82V73.4C35.4 69.6 38 68 41 68.6', P.sky1, 1.1, '#fff') + rod('M40 84V75.6C40 71.8 42.6 70.2 45.6 70.8', P.sky1, 1.1, '#fff') +
      // Trampolín.
      rod('M90 70.4V82M94 71.4V81', P.sky2, 1.2) +
      k.draw([{ d: board, fill: P.white, inner: `<path d="M68.4 62.6L96 69.6" stroke="${VERDE}" stroke-width=".9"/>` + k.sh(board, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) }], 0.6) +
      // El chapuzón: monedas que saltan.
      hair(54, 66, 50, 58, 52, 48, 0.6, P.goldD) + hair(66, 66, 70, 58, 68, 48, 0.6, P.goldD) + hair(60, 64, 59, 54, 61, 42, 0.5, P.goldD) +
      fly.map(([x, y, rx, ry, r]) => coin(x, y, rx, ry, r)).join('') +
      `<path d="M50 68C52 64.6 55 63 58 63.4C61 62.6 65 63.6 69.6 67.4" fill="none" stroke="${P.goldL}" stroke-width="1" stroke-linecap="round"/>` +
      sparkle(60, 30, 3, '#fff') + sparkle(34, 48, 2) + sparkle(88, 50, 1.8) + sparkle(46, 38, 1.4, P.goldL) +
      k.defs()
    )
  },
}

