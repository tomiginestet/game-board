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

/** Llave antigua parada: el ojo calado (cuatro lóbulos y un anillo) abajo en (0,22), la caña hacia arriba y el paletón
 * con sus guardas a la derecha, en la punta. */
function oldKey(k: Kit, metal: string, dark: string, light: string) {
  const lobes = [[-4.6, 22], [4.6, 22], [0, 17.4], [0, 26.6]].map(([x, y]) => ring(x, y, 2.2, 0.8)).join('')
  const bow = ring(0, 22, 4.1, 2.1)
  const collar = 'M-2.9 11.2H2.9V13.2H-2.9ZM-2.2 14.2H2.2V15.6H-2.2Z'
  const shaft = 'M-1.3 15V-19.6A1.3 1.3 0 0 1 1.3 -19.6V15Z'
  const bit = 'M1.1 -19H8.6V-15.4H6.2V-13.6H8.6V-10H5.2V-8.4H1.1Z'
  const sh = (d: string) => k.sh(d, 0, 0, 1, 1, 0, 0.9, dark, 0.45)
  return (
    k.draw([
      { d: lobes, fill: metal, inner: sh(lobes) },
      { d: bow, fill: metal, inner: sh(bow) },
      { d: shaft, fill: metal, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, dark, 0.45) + `<path d="M-.5 13V-19" stroke="${light}" stroke-width=".5"/>` },
      { d: bit, fill: metal, inner: sh(bit) + `<path d="M2.6 -18V-9.4" stroke="${dark}" stroke-width=".35"/>` },
      { d: collar, fill: metal, inner: sh(collar) },
    ], 0.5) +
    [[-4.6, 22], [4.6, 22], [0, 17.4], [0, 26.6]].map(([x, y]) => `<path d="M${f(x - 1.5)} ${f(y - 0.5)}A1.6 1.6 0 0 1 ${f(x - 0.3)} ${f(y - 1.5)}" fill="none" stroke="${light}" stroke-width=".4" stroke-linecap="round"/>`).join('') +
    `<circle cx="0" cy="22" r="3.1" fill="none" stroke="${dark}" stroke-width=".35" stroke-dasharray=".01 .9" stroke-linecap="round"/>` +
    `<path d="M-3 20.6C-2.6 19.4 -1.4 18.8 0 18.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>`
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
      `<g transform="translate(60 70) rotate(-42) scale(1.22) translate(0 -8.3)">` + k.cast(['M-1.3 15V-19.6H1.3V15Z'], 1, 1, P.mid) + oldKey(k, P.sky1, P.blue, '#fff') + `</g>` +
      `<g transform="translate(60 70) rotate(42) scale(-1.22 1.22) translate(0 -8.3)">` + k.cast(['M-1.3 15V-19.6H1.3V15Z'], -1, 1, P.mid) + oldKey(k, P.gold, P.goldD, P.goldL) + `</g>` +
      `<g transform="translate(0 -6.4)">` +
      k.floor(60, 74.6, 18, 2.6, VERDE_D) +
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
      `</g>` +
      sparkle(84, 30, 2.4, '#fff') + sparkle(33, 62, 2) + sparkle(88, 70, 1.6) +
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
    // Medialuna: media luna de cinco gajos enrollados (el borde de afuera ondulado) con las puntas finitas hacia abajo.
    const pt = (r: number, a: number) => `${f(r * Math.sin(a))} ${f(5 - r * Math.cos(a))}`
    const out: string[] = [], inn: string[] = []
    for (let i = 0; i <= 30; i++) {
      const t = i / 30, a = ((-80 + 160 * t) * Math.PI) / 180, h = 0.6 + 3.6 * Math.pow(Math.cos(a * 0.98), 1.6)
      out.push(pt(9 + h + 0.7 * Math.abs(Math.sin(t * Math.PI * 5)) * (h / 4.2), a))
      inn.push(pt(9 - h * 0.8, a))
    }
    const croissant = `M${out.join('L')}L${inn.reverse().join('L')}Z`
    const seams = [0.2, 0.4, 0.6, 0.8].map((t) => {
      const a = ((-80 + 160 * t) * Math.PI) / 180, h = 0.6 + 3.6 * Math.pow(Math.cos(a * 0.98), 1.6), [x0, y0] = pt(9 - h * 0.8, a).split(' ').map(Number), [x1, y1] = pt(9 + h, a).split(' ').map(Number)
      return hair(x0, y0, (x0 + x1) / 2 + (t < 0.5 ? 0.8 : -0.8), (y0 + y1) / 2, x1, y1, 0.6, P.brownD)
    }).join('')
    const glaze = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) => {
      const a = ((-80 + 160 * t) * Math.PI) / 180, h = 0.6 + 3.6 * Math.pow(Math.cos(a * 0.98), 1.6), r = 9 + h * 0.55
      return `<path d="M${pt(r, a - 0.07)}L${pt(r, a + 0.05)}" stroke="#fff" stroke-width="${f(0.35 + h * 0.18)}" stroke-linecap="round" opacity=".8"/>`
    }).join('')
    const medialuna = (x: number, y: number, r: number, s: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
      k.draw([{ d: croissant, fill: P.gold, inner: k.sh(croissant, 0, 0, 0, 1, 0, 0.95, P.brownD, 0.5) + `<path d="M-12 -10H12V-3C6 -6 -6 -6 -12 -3Z" fill="${P.goldD}" opacity=".3"/>` + seams }], 0.5 / s) +
      glaze + `</g>`
    const tag = 'M0 0C2.6 0 3.6 2.4 3.4 5L2.8 13C2.6 15 1.6 16 0 16C-1.6 16 -2.6 15 -2.8 13L-3.4 5C-3.6 2.4 -2.6 0 0 0Z'
    return (
      tablero(k) +
      pano(k, 60, 62, 33) +
      `<g transform="translate(1.4 -4.6)">` +
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
      medialuna(39.6, 81.6, -24, 1) + medialuna(47.6, 88.4, -4, 1.04) +
      // La llave de la pieza 2, con su perita verde.
      `<g transform="translate(84 74) rotate(16)">` +
      rod('M0 -1.6V-6.4', P.gold, 0.8) + `<circle cx="0" cy="-7.4" r="1.4" fill="none" stroke="${P.ink}" stroke-width="1.3"/><circle cx="0" cy="-7.4" r="1.4" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
      k.draw([{ d: tag, fill: VERDE, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.9, VERDE_D, 0.5) + `<path d="M-2 2.4C-2.4 6 -2.2 10 -1.4 13" fill="none" stroke="${VERDE_L}" stroke-width=".7" stroke-linecap="round"/>` }], 0.5) +
      `<circle cx="0" cy="2" r=".7" fill="${P.paper}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x=".2" y="11" ${GEORGIA} font-weight="700" font-size="5.6" fill="${P.goldL}" text-anchor="middle">2</text>` +
      `</g>` +
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

  // Veinte hoteles: el Llao Llao, con sus techos verdes y su torre, entre el lago y los cerros nevados.
  'Llao Llao': (u) => {
    const k = kit(u)
    const mount = 'M4 78L18 61L24 63L36 45L42 49L54 31L62 41L68 36L80 50L86 48L98 59L116 78Z'
    const snowLine = 'M0 0H120V52L98 59L94 53.4L90 56L86 50.6L82 53.6L78 49L74 52L70 47.6L66 50.4L62 45.6L58 49L55 44.4L51 48.6L47 45.4L43 50.6L39 47.6L35 52L31 50L27 56L23 54.4L19 60L0 60Z'
    const lake = 'M6 80H114V112H6Z'
    const hill = 'M6 85C18 77.6 36 72.6 60 72.2C84 72.6 102 77.6 114 85Z'
    const base = 'M30.6 66H89.4V73.4H30.6Z'
    const wingL = 'M34 55.8H53V66H34Z', roofL = 'M32.4 56.2L37.4 45.4H50.4L54.6 56.2Z'
    const wingR = 'M67 55.8H86V66H67Z', roofR = 'M65.4 56.2L69.6 45.4H82.6L87.6 56.2Z'
    const tower = 'M52.6 38.4H67.4V66H52.6Z', towerRoof = 'M50.4 39L60 25.6L69.6 39Z'
    const turret = 'M28.2 54.4H34.6V67H28.2Z', turretRoof = 'M27.2 54.8L31.4 44.4L35.6 54.8Z'
    // Tejas: hileras de escamas sobre los techos.
    const shingles = (x0: number, x1: number, y0: number, y1: number, n: number, inset: number) =>
      Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / (n + 1), y = y0 + (y1 - y0) * t, a = x0 + inset * (1 - t), b = x1 - inset * (1 - t)
        const ticks = Array.from({ length: Math.max(2, Math.round((b - a) / 2.6)) }, (_, j) => { const x = a + 1.3 + j * 2.6 + (i % 2) * 1.3; return x < b - 0.6 ? `M${f(x)} ${f(y - 1.6)}V${f(y)}` : '' }).join('')
        return hair(a, y, (a + b) / 2, y + 0.3, b, y, 0.4, VERDE_D, 0.9) + `<path d="${ticks}" stroke="${VERDE_D}" stroke-width=".3" opacity=".7"/>`
      }).join('')
    // Muros de madera: viga del entrepiso, postes y dos pisos de ventanas con marco blanco.
    const timber = (x0: number, x1: number, y0: number, y1: number) => {
      const n = Math.round((x1 - x0) / 4.2), w = (x1 - x0) / n, mid = (y0 + y1) / 2
      let out = `<path d="M${x0} ${f(mid)}H${x1}" stroke="${P.brownD}" stroke-width=".55"/>`
      for (let i = 0; i < n; i++) {
        const x = x0 + i * w
        if (i) out += `<path d="M${f(x)} ${y0}V${y1}" stroke="${P.brownD}" stroke-width=".35"/>`
        for (const y of [y0 + 1.1, mid + 1]) out += `<rect x="${f(x + w / 2 - 1)}" y="${f(y)}" width="2" height="2.8" fill="${P.night}" stroke="${P.paper}" stroke-width=".3"/>`
      }
      return out
    }
    const dormer = (x: number, y: number) => `<path d="M${x} ${y}V${f(y - 2.6)}L${f(x + 1.7)} ${f(y - 4.2)}L${f(x + 3.4)} ${f(y - 2.6)}V${y}Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><rect x="${f(x + 1)}" y="${f(y - 2.4)}" width="1.4" height="2" fill="${P.night}"/>`
    const chimney = (x: number, y: number) => `<path d="M${x} ${y}V${f(y - 4)}H${f(x + 2.4)}V${y}Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(x - 0.4)} ${f(y - 4)}H${f(x + 2.8)}" stroke="${P.ink}" stroke-width=".8"/>`
    const cypress = (x: number, y: number, h: number) => {
      const d = `M${x} ${f(y - h)}C${f(x + 2.6)} ${f(y - h * 0.6)} ${f(x + 3.6)} ${f(y - h * 0.2)} ${f(x + 2.4)} ${y}H${f(x - 2.4)}C${f(x - 3.6)} ${f(y - h * 0.2)} ${f(x - 2.6)} ${f(y - h * 0.6)} ${x} ${f(y - h)}Z`
      return k.draw([{ d, fill: P.greenD, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, '#2F4419', 0.5) + hair(x - 1, y - h * 0.7, x - 1.8, y - h * 0.4, x - 1.2, y - 2, 0.45, P.green) + hair(x + 0.6, y - h * 0.5, x + 1.4, y - h * 0.3, x + 1, y - h * 0.1, 0.35, '#2F4419') }], 0.5)
    }
    const crowns = Array.from({ length: 30 }, (_, i) => {
      const r = Math.floor(i / 10), c = i % 10, x = 12 + c * 10.4 + (r % 2) * 5.2, y = 79 + r * 2.4 - Math.sin(((x - 6) / 108) * Math.PI) * (6 - r * 1.4)
      return `M${f(x)} ${f(y)}a1.8 1.6 0 0 1 3.6 0`
    }).join('')
    const silhouette = `<path d="${tower} ${towerRoof} ${wingL} ${roofL} ${wingR} ${roofR}" fill="${VERDE_D}"/>`
    return (
      tablero(k) +
      k.sun(60, 40, 12, 46, 28, false) +
      k.shade(ellipse(60, 40, 20, 18), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.draw([{
        d: mount, fill: P.sky,
        inner:
          k.sh(mount, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + k.clip(mount, `<path d="${snowLine}" fill="${P.white}"/>` + k.sh('M54 28H120V64H54Z', 0, 0, 1, 0, 0, 0.75, P.sky2, 0.45)) +
          hair(54, 32, 52, 42, 46, 52, 0.55, P.mid) + hair(36, 46, 34, 54, 28, 62, 0.5, P.mid) + hair(68, 37, 70, 46, 66, 56, 0.5, P.mid) + hair(62, 42, 60, 52, 62, 62, 0.45, P.blue) +
          hair(80, 51, 82, 58, 78, 66, 0.45, P.mid) + hair(24, 63, 22, 68, 18, 72, 0.4, P.mid) + hair(86, 49, 90, 56, 92, 64, 0.4, P.blue),
      }], 0.6) +
      k.draw([{
        d: lake, fill: P.sky,
        inner:
          k.sh(lake, 0, 0, 0, 1, 0, 0.85, P.mid, 0.4) +
          `<g transform="matrix(1 0 0 -.4 0 109.4)" opacity=".28">${silhouette}</g>` +
          [[30, 86, 46], [52, 88.6, 70], [36, 92, 52], [64, 94.4, 84], [44, 98, 62]].map(([x0, y, x1]) => hair(x0, y, (x0 + x1) / 2, y - 0.4, x1, y, 0.55, '#fff')).join(''),
      }], 0.5) +
      k.draw([{ d: hill, fill: VERDE_D, inner: k.sh(hill, 0, 0, 1, 1, 0, 0.8, '#08402C', 0.5) + `<path d="${crowns}" fill="none" stroke="${VERDE}" stroke-width=".7" stroke-linecap="round"/>` }], 0.6) +
      chimney(39.4, 48) + chimney(78.6, 48) +
      k.draw([
        { d: turretRoof, fill: VERDE, inner: k.sh(turretRoof, 0, 0, 1, 0, 0, 0.9, VERDE_D, 0.5) + shingles(28, 35, 44.4, 54.8, 2, 3) },
        { d: turret, fill: P.white, inner: k.sh(turret, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<rect x="30.4" y="56.6" width="2" height="2.8" fill="${P.night}"/><rect x="30.4" y="61.6" width="2" height="2.8" fill="${P.night}"/>` },
        { d: roofL, fill: VERDE, inner: k.sh(roofL, 0, 0, 1, 1, 0, 0.8, VERDE_D, 0.45) + shingles(33, 54, 45.4, 56.2, 3, 4.4) },
        { d: wingL, fill: P.white, inner: k.sh(wingL, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + timber(34, 53, 55.8, 66) },
        { d: roofR, fill: VERDE, inner: k.sh(roofR, 0, 0, 1, 1, 0, 0.95, VERDE_D, 0.5) + shingles(66, 87, 45.4, 56.2, 3, 4.4) },
        { d: wingR, fill: P.white, inner: k.sh(wingR, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + timber(67, 86, 55.8, 66) },
        { d: towerRoof, fill: VERDE, inner: k.sh(towerRoof, 0, 0, 1, 0, 0, 0.9, VERDE_D, 0.5) + shingles(51, 69, 25.6, 39, 4, 8.4) + `<path d="M50.4 39H60V25.6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` },
        {
          d: tower, fill: P.white,
          inner:
            k.sh(tower, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M52.6 38.4H67.4V40.2H52.6Z" fill="${P.brownD}"/>` +
            `<circle cx="60" cy="44" r="2" fill="${P.night}" stroke="${P.paper}" stroke-width=".4"/>` +
            [55, 58.9, 62.8].map((x) => `<rect x="${x}" y="48" width="2.2" height="3.4" fill="${P.night}" stroke="${P.paper}" stroke-width=".3"/>`).join('') +
            `<path d="M52.6 53H67.4V66H52.6Z" fill="${P.sky2}"/>` + k.sh('M52.6 53H67.4V66H52.6Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) +
            [55.6, 58.2, 60.8, 63.4].map((y, i) => `<path d="M52.6 ${y}H67.4" stroke="${P.blue}" stroke-width=".3"/>` + [0, 1, 2, 3].map((j) => `<path d="M${f(54 + j * 4 + (i % 2) * 2)} ${f(y - 2.6)}V${y}" stroke="${P.blue}" stroke-width=".3"/>`).join('')).join('') +
            `<path d="M57.4 66V61.6A2.6 2.6 0 0 1 62.6 61.6V66Z" fill="${P.night}"/>`,
        },
        {
          d: base, fill: P.sky2,
          inner: k.sh(base, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + `<path d="M30.6 68.4H89.4M30.6 70.9H89.4" stroke="${P.blue}" stroke-width=".3"/>` +
            Array.from({ length: 14 }, (_, i) => `<path d="M${f(32.4 + i * 4.2)} 66V68.4M${f(34.4 + i * 4.2)} 68.4V70.9M${f(32.4 + i * 4.2)} 70.9V73.4" stroke="${P.blue}" stroke-width=".3"/>`).join(''),
        },
      ], 0.6) +
      `<path d="M52.4 52.4H67.6V53.4H52.4Z" fill="${P.brownD}"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${f(53.2 + i * 1.94)} 53.4V55.2" stroke="${P.brownD}" stroke-width=".35"/>`).join('') + `<path d="M52.4 55.2H67.6" stroke="${P.brownD}" stroke-width=".45"/>` +
      dormer(40.2, 53.6) + dormer(45.4, 53.6) + dormer(71.4, 53.6) + dormer(76.6, 53.6) +
      rod('M60 25.8V21.4', P.gold, 0.6) + `<circle cx="60" cy="21" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      cypress(23.6, 84, 19) + cypress(29.6, 85, 13) + cypress(95.6, 84, 17) +
      sparkle(88, 30, 2.2, '#fff') + sparkle(32, 32, 1.6) +
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
      `<text x="38" y="32.4" ${GEORGIA} font-style="italic" font-size="5.2" fill="${P.ink}" transform="rotate(-8 38 32.4)">¡a la una!</text>` +
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
      [[40.6, 38.6], [79.4, 38.6], [40.6, 77.4], [79.4, 77.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${x}" cy="${y}" r="1" fill="${P.night}"/>`).join('') +
      chain(40.6, 38.6, 60, 58, 79.4, 77.4, 11, 1.25) + chain(79.4, 38.6, 60, 58, 40.6, 77.4, 11, 1.25) +
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
    const outer = ellipse(60, 79, 33, 13.4)
    const inner = ellipse(60, 78.4, 27.4, 9.8)
    const mound = 'M87 78.4C82 70 72 64.6 60 64.4C48 64.6 38 70 33 78.4Z'
    const top = (x: number) => 64.4 + 14 * ((x - 60) / 27) ** 2
    const inside = (x: number, y: number) => ((x - 60) / 26) ** 2 + ((y - 78.4) / 8.8) ** 2 < 1 || (Math.abs(x - 60) < 25 && y > top(x) + 0.6 && y < 79)
    let pile = ''
    for (let r = 0; r < 13; r++) {
      const y = 65.4 + r * 2
      for (let c = 0; c < 13; c++) {
        const x = 29 + c * 5.2 + (r % 2) * 2.6 + ((r * 7 + c * 3) % 5) * 0.3
        if (inside(x, y)) pile += coin(x, y, 2.7, 1.25, ((r * 11 + c * 17) % 26) - 13)
      }
    }
    const fly: [number, number, number, number, number][] = [
      [56, 59, 3, 1.4, -10], [63.4, 54, 2.8, 2.2, 20], [52.6, 49, 2.8, 1, -50], [60, 44, 2.6, 2.6, 0], [67.4, 46.4, 2.4, 1, 60], [49.6, 40.4, 2.4, 1.8, -20],
      [65, 36.4, 2.4, 1.2, 30], [57, 33, 2.2, 2.2, 0], [72.4, 55, 2.6, 1.4, -30], [45.6, 55, 2.6, 1.6, 20], [71, 41, 2, 0.8, -60], [51.4, 30.6, 1.8, 1.2, 40],
    ]
    const bill = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-5.4" y="-2.5" width="10.8" height="5" fill="${VERDE_L}" stroke="${P.ink}" stroke-width=".4"/><rect x="-4.6" y="-1.8" width="9.2" height="3.6" fill="none" stroke="${VERDE}" stroke-width=".35"/><circle cx="0" cy="0" r="1.3" fill="${VERDE}"/><text x="0" y=".9" ${GEORGIA} font-size="2.3" font-weight="700" fill="${P.paper}" text-anchor="middle">$</text></g>`
    const board = 'M66.4 60.8L94.6 66.6C95.6 66.8 96 67.6 95.8 68.4L95.6 69.2L66.4 63.2C65.6 63 65.6 61 66.4 60.8Z'
    const stand = 'M86.4 66L89.2 66.6L91.4 79.6H84.2Z'
    return (
      tablero(k) +
      k.sun(60, 47, 14, 48, 28, false) +
      k.shade(ellipse(60, 46, 22, 20), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.floor(61, 85, 37, 6, VERDE_D) +
      k.draw([{ d: outer, fill: P.white, inner: k.sh(outer, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.75) +
      `<path d="${ellipse(60, 78.7, 30.2, 11.6)}" fill="none" stroke="${VERDE}" stroke-width="2.6" stroke-dasharray="2.4 2.4"/>` +
      `<path d="${ellipse(60, 78.7, 30.2, 11.6)}" fill="none" stroke="${P.ink}" stroke-width=".25" opacity=".5"/>` +
      `<path d="${inner}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".7"/>` +
      // Escalera de caños, del borde de atrás hacia adentro.
      rod('M38.4 66.6V60C38.4 57.4 41.4 56.4 43.4 58.4V71', P.sky1, 1.1, '#fff') + rod('M44.6 65V58.4C44.6 55.8 47.6 54.8 49.6 56.8V69.6', P.sky1, 1.1, '#fff') +
      rod('M43.4 62.6L49.6 61.2M43.4 66.4L49.6 65', P.sky2, 0.7) +
      `<path d="${mound}" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".7"/>` +
      k.clip(`${inner} ${mound}`, `<path d="M20 60H100V92H20Z" fill="${P.gold}"/>` + pile + bill(44.6, 76.6, -14) + bill(74, 80.6, 10) + k.sh('M30 62H90V90H30Z', 0, 0, 0, 1, 0, 0.5, P.goldD, 0.3)) +
      // Trampolín.
      k.draw([
        { d: stand, fill: P.sky1, inner: k.sh(stand, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M86 70.4H89.8M85.4 75H90.6" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: board, fill: P.white, inner: `<path d="M67 61.4L94.6 67.1" stroke="${VERDE}" stroke-width="1.3"/>` + k.sh(board, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) },
      ], 0.6) +
      // El chapuzón: las monedas saltan.
      hair(54, 64, 48.6, 56, 49.6, 44, 0.65, P.goldD) + hair(66, 64, 71.6, 56, 70, 44, 0.65, P.goldD) + hair(60, 62, 58.6, 50, 60.6, 38, 0.55, P.goldD) +
      hair(50, 64.6, 44, 60, 40.6, 52, 0.5, P.goldD) + hair(70, 64.6, 76, 60, 79.4, 52, 0.5, P.goldD) +
      fly.map(([x, y, rx, ry, r]) => coin(x, y, rx, ry, r)).join('') +
      coin(50.4, 64.4, 2.4, 1.6, -40) + coin(69.6, 64.4, 2.4, 1.6, 40) + coin(46.4, 62.6, 2, 1, -60) + coin(73.6, 62.6, 2, 1, 60) +
      sparkle(60, 24.6, 2.8, '#fff') + sparkle(34, 46, 2) + sparkle(87, 48, 1.8) + sparkle(42, 34, 1.4, P.goldL) +
      k.defs()
    )
  },
}

