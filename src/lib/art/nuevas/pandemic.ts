// Pandemic: el equipo que salva al mundo, en clave heroica. Manda el verde petróleo de la ficha del juego en el
// catálogo: las tapas, los rótulos, los líquidos, los mangos y el grano del fondo de laboratorio. Ni enfermos ni
// personas: los médicos aparecen por sus objetos (el guardapolvo, el bastón, las manos de oro).
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El petróleo de la ficha del Pandemic en el catálogo, con su sombra, su luz, su agua pálida y su grano. */
const TEAL = '#0B7285', TEAL_D = '#064F5C', TEAL_L = '#5DAFBA', TEAL_P = '#DDEFEE', TEAL_G = '#9FCFD2', TEAL_N = '#86BFC3'
/** El azul del cubo de enfermedad (el del Doctor House). */
const CUBE = '#3A6BD0', CUBE_D = '#22468F', CUBE_L = '#8CAEF0'
/** El verde que burbujea en la probeta. */
const LIME = '#79B850', LIME_D = '#47802C', LIME_L = '#C6E59C'
/** El goma negra de mangueras, tapones y puntas. */
const RUBBER = '#2C3040', RUBBER_L = '#5A6078'
const FULL = 'M0 0H120V130H0Z'

/** Varilla entintada (caño, manguera, alambre): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Fondo de laboratorio: papel con el grano verde agua hacia los bordes. */
const lab = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(TEAL_G, 0.5, 0.46, 0.7, 0, 1), TEAL_N, 0.5)

/** Noche petróleo: el fondo oscuro de la ficha del juego, con un resplandor en el medio. */
const tnight = (k: Kit) => `<rect width="120" height="130" fill="#0B2C38"/>` + k.shade(FULL, k.rad(TEAL, 0.48, 0.42, 0.55, 0.9, 0), TEAL, 0.35)

/** Escenario verde agua: un disco con el borde granulado. */
const tstage = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TEAL_P}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(TEAL_G, 0.5, 0.5, 0.5, 0, 1), TEAL_N, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TEAL_L}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor dorado detrás del protagonista. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

/** Burbuja de jabón: casi transparente, con el borde fino y un brillo. */
const bubble = (x: number, y: number, r: number, c = TEAL_L) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${f(Math.min(0.5, r * 0.22))}"/>` +
  `<path d="M${f(x - r * 0.62)} ${f(y - r * 0.1)}A${f(r * 0.64)} ${f(r * 0.64)} 0 0 1 ${f(x - r * 0.1)} ${f(y - r * 0.62)}" fill="none" stroke="#fff" stroke-width="${f(r * 0.24)}" stroke-linecap="round"/>`

/** Globo terráqueo de líneas finas (meridianos y paralelos), para rótulos y emblemas. */
const globe = (x: number, y: number, r: number, c: string, w = 0.45) =>
  `<g fill="none" stroke="${c}" stroke-width="${w}"><circle cx="${x}" cy="${y}" r="${r}"/><path d="${ellipse(x, y, r * 0.42, r)}"/><path d="M${x} ${f(y - r)}V${f(y + r)}M${f(x - r)} ${y}H${f(x + r)}"/>` +
  `<path d="M${f(x - r * 0.86)} ${f(y - r * 0.5)}Q${x} ${f(y - r * 0.36)} ${f(x + r * 0.86)} ${f(y - r * 0.5)}M${f(x - r * 0.86)} ${f(y + r * 0.5)}Q${x} ${f(y + r * 0.64)} ${f(x + r * 0.86)} ${f(y + r * 0.5)}"/></g>`

/** Cubo de madera en perspectiva, con el vértice del frente en (x,y) y lado s: arriba claro, izquierda y derecha. */
function cube(k: Kit, x: number, y: number, s: number, c: string, cd: string, cl: string, w = 0.6) {
  const kk = f(s * 0.87), h = f(s / 2)
  const out = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}L${f(x - kk)} ${f(y - h)}Z`
  const top = `M${f(x - kk)} ${f(y - h)}L${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${x} ${y}Z`
  const left = `M${f(x - kk)} ${f(y - h)}L${x} ${y}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}Z`
  const right = `M${x} ${y}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}Z`
  return (
    k.draw([{
      d: out, fill: c,
      inner: `<path d="${top}" fill="${cl}"/><path d="${right}" fill="${cd}"/>` + k.sh(left, 0, 0, 0, 1, 0, 0.5, cd, 0.3) + k.sh(right, 0, 0, 1, 1, 0, 0.8, P.night, 0.35) +
        hair(x - kk * 0.8, y - h * 0.2, x - kk * 0.45, y + s * 0.2, x - kk * 0.7, y + h * 0.9, 0.35, cd) + hair(x + kk * 0.3, y + s * 0.1, x + kk * 0.55, y + h * 0.4, x + kk * 0.4, y + s * 0.7, 0.35, P.night, 0.6),
    }], w) +
    `<path d="M${f(x - kk)} ${f(y - h)}L${x} ${y}L${f(x + kk)} ${f(y - h)}M${x} ${y}V${f(y + s)}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 0.6)}" stroke-linejoin="round"/>` +
    `<path d="M${f(x - kk * 0.7)} ${f(y - h * 1.02)}L${f(x - kk * 0.05)} ${f(y - s * 0.86)}" stroke="#fff" stroke-width="${f(s * 0.07)}" stroke-linecap="round" opacity=".85"/>`
  )
}

/** Mata redonda de bordes abollonados (nube de rocío, espuma), centrada en (x,y). */
function bush(x: number, y: number, r: number, n = 9, rot = 0) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2, rr = r * (1 - 0.1 * ((i * 7) % 3))
    return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]
  })
  return `M${f(pts[0][0])} ${f(pts[0][1])}` + pts.map((_, i) => {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % n], br = Math.hypot(x1 - x0, y1 - y0) * 0.56
    return `A${f(br)} ${f(br)} 0 0 1 ${f(x1)} ${f(y1)}`
  }).join('') + 'Z'
}

export const PANDEMIC_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Salvadores del mundo ───────────────────────────────────────────

  // Salvaron al mundo una vez: el bidón de lavandina, con el planeta en el rótulo, y todo baldeado.
  'Lavandina': (u) => {
    const k = kit(u)
    const jug =
      'M46 38.4H54V41.6C57 40.8 63 40.4 70 40.4C75.6 40.4 79.4 43.4 80.4 48.6C81.2 53 81.4 58 81.4 62V87.6C81.4 91 79 93 75.4 93H44.6C41 93 38.6 91 38.6 87.6V62C38.6 53 41 46.6 46 43.2Z' +
      'M66.4 47.6V51C66.4 52.2 67.2 53 68.4 53H75C76.2 53 77 52.2 77 51V47.6C77 46.4 76.2 45.6 75 45.6H68.4C67.2 45.6 66.4 46.4 66.4 47.6Z'
    const cap = roundRect(44.2, 30.4, 55.8, 38.8, 1.4)
    const label = roundRect(42.4, 60.4, 77.6, 86.4, 2.2)
    const puddle = ellipse(60, 93.4, 27, 3.6)
    const ribs = Array.from({ length: 8 }, (_, i) => `M${f(45.8 + i * 1.2)} 32.4V37.2`).join('')
    return (
      lab(k) +
      tstage(k, 60, 62, 34) +
      `<g transform="translate(60 59.4) scale(.86) translate(-60 -62)">` +
      k.draw([{ d: puddle, fill: TEAL_P, inner: k.sh(puddle, 0, 0, 1, 1, 0, 0.6, TEAL_L, 0.4) + `<path d="M38 92.4Q48 91 58 91.4M66 95.4Q74 95.4 82 94" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` }], 0.4) +
      k.floor(61, 92.6, 22, 2.4, TEAL) +
      k.draw([
        {
          d: jug, fill: P.white,
          inner:
            k.sh('M63 38H84V95H63Z', 0, 0, 1, 0, 0, 0.85, TEAL_L, 0.4) + k.sh('M36 84H84V95H36Z', 0, 0, 0, 1, 0, 0.6, TEAL_L, 0.3) +
            `<path d="M36 40H47V95H36Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
            hair(40.4, 62, 39.8, 74, 40.4, 86, 0.9, '#fff') + hair(42, 47, 46, 43.6, 53, 42.4, 0.7, '#fff', 0.9) +
            hair(39.4, 57.4, 60, 55.4, 81, 57.4, 0.45, TEAL_L) + hair(68, 42.4, 74, 42, 78.6, 45.4, 0.5, '#fff', 0.9) +
            `<path d="M45.6 41.6H54.4" stroke="${TEAL_L}" stroke-width=".5"/>`,
        },
        { d: cap, fill: TEAL, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.85, TEAL_D, 0.45) + `<path d="${ribs}" stroke="${TEAL_D}" stroke-width=".4"/>` + `<path d="M44 30H56V32.2H44Z" fill="${TEAL_L}" opacity=".6"/>` },
      ], 0.75) +
      k.draw([{ d: label, fill: TEAL, inner: k.sh(label, 0, 0, 1, 1, 0, 0.8, TEAL_D, 0.45) + `<path d="M40 58H52V88H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` }], 0.5) +
      `<path d="${roundRect(44.2, 62.2, 75.8, 84.6, 1.4)}" fill="none" stroke="${P.white}" stroke-width=".45"/>` +
      `<circle cx="60" cy="68.6" r="4.6" fill="${TEAL_L}"/>` + globe(60, 68.6, 4.6, P.white, 0.45) +
      `<text x="60" y="80.6" ${GEORGIA} font-style="italic" font-size="6.2" fill="${P.white}" text-anchor="middle">lavandina</text>` +
      `</g>` +
      bubble(33, 45, 3) + bubble(28.6, 53.6, 1.7) + bubble(36.6, 35, 1.5) + bubble(88.4, 50, 2.3) + bubble(86, 40.6, 1.3) + bubble(31.4, 82, 1.6) +
      sparkle(87.6, 68, 2.6, '#fff') + sparkle(33, 66, 1.9, '#fff') + sparkle(64, 24, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cuatro mundos salvados: la OMS manda saludos. El guardapolvo blanco colgado, con el estetoscopio al cuello.
  'Guardapolvo blanco': (u) => {
    const k = kit(u)
    const body = 'M51.4 33.6C54 35.2 57 35.8 60 35.8C63 35.8 66 35.2 68.6 33.6L79.4 38.6C81 39.4 81.8 41 81.6 42.8L79.6 54L80.6 91.4H39.4L40.4 54L38.4 42.8C38.2 41 39 39.4 40.6 38.6Z'
    const sl = 'M40.6 38.6C36.6 40.6 34.6 44.6 33.8 50L30.6 81.6C30.4 83 31.4 84 32.8 84H38.8C40 84 40.8 83.2 40.8 82L41.4 54Z'
    const sr = 'M79.4 38.6C83.4 40.6 85.4 44.6 86.2 50L89.4 81.6C89.6 83 88.6 84 87.2 84H81.2C80 84 79.2 83.2 79.2 82L78.6 54Z'
    const inside = 'M53.8 35.2C56 36.2 58 36.6 60 36.6C62 36.6 64 36.2 66.2 35.2C64.8 44 62.4 54 60 62.4C57.6 54 55.2 44 53.8 35.2Z'
    const lapL = 'M51.4 33.6C49.4 35.4 47.8 37.6 46.8 40.4L50 46.4L47.6 48.6L59.6 62.4C57.6 54 55.2 44 53.8 35.2Z'
    const lapR = 'M68.6 33.6C70.6 35.4 72.2 37.6 73.2 40.4L70 46.4L72.4 48.6L60.4 62.4C62.4 54 64.8 44 66.2 35.2Z'
    const pocket = 'M66.2 50.6H75.8L75.4 57.6C75.4 58.4 74.8 59 74 59H68C67.2 59 66.6 58.4 66.6 57.6Z'
    const pen = (x: number, c: string, top: number) =>
      `<path d="M${f(x - 0.9)} ${top}H${f(x + 0.9)}V52H${f(x - 0.9)}Z" fill="${c}" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(x + 0.3)} ${f(top + 0.4)}V${f(top + 4.4)}" stroke="${P.goldL}" stroke-width=".55"/><circle cx="${f(x + 0.3)}" cy="${f(top + 4.6)}" r=".45" fill="${P.gold}"/>`
    const button = (y: number) => `<circle cx="57.4" cy="${y}" r="1.2" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="57" cy="${y}" r=".2" fill="${P.ink}"/><circle cx="57.8" cy="${y}" r=".2" fill="${P.ink}"/>`
    const lowPocket = (x: number) => `<path d="M${x} 71H${x + 10}L${f(x + 9.6)} 79.8C${f(x + 9.6)} 80.6 ${f(x + 9)} 81.2 ${f(x + 8.2)} 81.2H${f(x + 1.8)}C${f(x + 1)} 81.2 ${f(x + 0.4)} 80.6 ${f(x + 0.4)} 79.8Z" fill="none" stroke="${TEAL_L}" stroke-width=".55"/><path d="M${x} 72.6H${x + 10}" stroke="${TEAL_L}" stroke-width=".4" stroke-dasharray=".8 .6"/>`
    return (
      lab(k) +
      k.sun(60, 56, 16, 47, 32, false) +
      glow(k, 60, 60, 28, 32) +
      `<g transform="translate(60 57) scale(.92) translate(-60 -57)">` +
      rod('M60 34.6V29.6C60 26.8 62 24.8 64.4 24.8C66.6 24.8 68 26.4 68 28.4', P.gold, 1.3) + `<path d="M60.6 33V29.4C60.6 27.4 62 25.8 63.8 25.6" fill="none" stroke="${P.goldL}" stroke-width=".45"/>` +
      k.cast([body, sl, sr], 2.4, 2, TEAL) +
      k.draw([
        { d: sl, fill: P.white, inner: k.sh(sl, 0, 0, 1, 0, 0.1, 0.7, TEAL_L, 0.35) + hair(36.4, 56, 34.6, 68, 34.2, 79, 0.55, TEAL_L) + `<path d="M30.6 80.2H40.9" stroke="${TEAL_L}" stroke-width=".5"/>` },
        { d: sr, fill: P.white, inner: k.sh(sr, 0, 0, 1, 0, 0.2, 0.95, TEAL_L, 0.45) + hair(83.6, 56, 85.4, 68, 85.8, 79, 0.55, TEAL_L) + `<path d="M79.1 80.2H89.4" stroke="${TEAL_L}" stroke-width=".5"/>` },
        {
          d: body, fill: P.white,
          inner:
            k.sh('M64 40C70 56 70 74 66 94H84V40Z', 0, 0, 1, 0, 0, 0.8, TEAL_L, 0.4) + k.sh('M36 84H84V94H36Z', 0, 0, 0, 1, 0, 0.6, TEAL_L, 0.3) +
            `<path d="${inside}" fill="${TEAL_P}"/>` + k.sh(inside, 0, 0, 0, 1, 0.3, 0.9, TEAL_L, 0.45) +
            `<path d="M53 39.2Q60 37.2 67 39.2" fill="none" stroke="${P.brownD}" stroke-width="2.2"/><path d="M53 38.6Q60 36.6 67 38.6" fill="none" stroke="${P.brown}" stroke-width=".8"/>` +
            `<path d="M60.4 62.4L60.6 91.4" stroke="${TEAL_L}" stroke-width=".6"/>` +
            hair(46, 64, 45.4, 78, 46.6, 91, 0.6, TEAL_L) + hair(73.6, 64, 74.4, 78, 73.4, 91, 0.6, TEAL_L) + hair(52.6, 84, 53.4, 88, 52.8, 91.2, 0.45, TEAL_L) +
            lowPocket(43.6) + lowPocket(66.4),
        },
        { d: lapL, fill: P.white, inner: k.sh(lapL, 0, 0, 1, 1, 0, 0.6, TEAL_L, 0.35) + `<path d="M46 38H54V44H46Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.8, 0)}"/>` },
        { d: lapR, fill: P.white, inner: k.sh(lapR, 0, 0, 0, 1, 0.3, 0.95, TEAL_L, 0.45) },
      ], 0.75) +
      button(67.4) + button(76) + button(84.6) +
      pen(69.2, TEAL, 45.4) + pen(72.6, P.red, 46.6) +
      k.draw([{ d: pocket, fill: P.white, inner: k.sh(pocket, 0, 0, 1, 0, 0.2, 0.8, TEAL_L, 0.4) + `<path d="M66.4 52.2H75.6" stroke="${TEAL_L}" stroke-width=".4" stroke-dasharray=".8 .6"/>` }], 0.35) +
      // El estetoscopio: la goma con la campana de un lado y las olivas del otro.
      rod('M54.4 36.4C51.4 41 49.4 48 49.2 55C49 61 50.4 65.4 52.4 68.2', TEAL, 1.6) +
      `<path d="M53.4 37.6C51 42 49.8 48 49.8 54" fill="none" stroke="${TEAL_L}" stroke-width=".45" stroke-linecap="round"/>` +
      rod('M65.4 36.6C68.4 41 70.2 46 70.4 51', P.white, 0.7) + rod('M64.8 36.6C66 41.2 66.8 46.4 66.8 51.4', P.white, 0.7) +
      `<ellipse cx="70.5" cy="52.6" rx="1.2" ry="1.6" fill="${TEAL_D}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="66.8" cy="53" rx="1.2" ry="1.6" fill="${TEAL_D}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M52.2 68L53.4 70" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      k.draw([{ d: ellipse(53.8, 72.2, 3.6, 3.6), fill: P.sky1, inner: k.sh(ellipse(53.8, 72.2, 3.6, 3.6), 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) }], 0.5) +
      `<circle cx="53.8" cy="72.2" r="2.3" fill="${P.white}" stroke="${P.blue}" stroke-width=".4"/><path d="M52.2 71C52.8 70.2 53.6 70 54.4 70.2" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(88, 30, 2.4) + sparkle(30, 32, 1.8) + sparkle(92, 62, 1.4) +
      k.defs()
    )
  },

  // Diez mundos salvados: "nunca es lupus", era el cubo azul. La lupa sobre el cubo y el bastón de las llamas.
  'Doctor House': (u) => {
    const k = kit(u)
    // El bastón: negro, con llamas pintadas abajo, virola dorada y empuñadura de derby. Base en (0,0), hacia arriba.
    const shaft = roundRect(-2.3, -60, 2.3, -2.4, 1.4)
    const tip = roundRect(-2.6, -4.4, 2.6, 0, 1)
    const handle = 'M-2.3 -60C-2.9 -66.4 1.4 -70 6.6 -70C11 -70 14 -67.6 13.8 -64.4C13.6 -62.2 11.8 -61.4 10.2 -62.2C8.8 -62.8 8.8 -64.8 6.6 -65C4 -65.2 2 -63.6 1.8 -60Z'
    const collar = roundRect(-2.9, -61.8, 2.9, -58.4, 0.6)
    const fire = 'M-3 -3V-18C-2.2 -22 -1.6 -26 -2.2 -33C-.2 -28 .8 -25 .4 -21C1.6 -24 2.4 -28.6 1.8 -34C3.6 -28 3.8 -22 3 -17V-3Z'
    const fireIn = 'M-3 -3V-12C-2 -15 -1.4 -18 -1.4 -22.6C-.2 -19 .4 -16.6 .2 -14C1.2 -16 1.8 -19 1.8 -22C3 -18.6 3.2 -15 3 -11.6V-3Z'
    const cane =
      `<g transform="translate(45 89.6) rotate(29.6)">` +
      k.draw([
        { d: handle, fill: P.night, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.8, '#000', 0.4) + hair(-.8, -62, .4, -67.6, 6, -68.6, 0.6, P.sky, 0.8) },
        {
          d: shaft, fill: P.night,
          inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.9, '#000', 0.4) + `<path d="${fire}" fill="${P.red}"/><path d="${fireIn}" fill="${P.gold}"/><path d="M-3 -3V-7.6C-2.2 -9 -1.6 -10 -1.4 -12.4C-.4 -10.6 0 -9.6 0 -8.4C.8 -9.6 1.2 -10.8 1.4 -12.2C2.4 -10.4 2.8 -8.6 3 -7V-3Z" fill="${P.goldL}"/>` +
            k.sh('M.6 -36H3V-2H.6Z', 0, 0, 1, 0, 0, 0.7, P.wine, 0.3) +
            hair(-1.2, -56, -1.5, -46, -1.2, -36, 0.6, P.sky, 0.7) + hair(-1.4, -30, -1.6, -18, -1.4, -6, 0.5, '#fff', 0.5),
        },
        { d: tip, fill: RUBBER, inner: `<path d="M-2.4 -2.6H2.4M-2.4 -1.4H2.4" stroke="${RUBBER_L}" stroke-width=".35"/>` },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) + `<path d="M-2.9 -60.1H2.9" stroke="${P.goldD}" stroke-width=".35"/>` },
      ], 0.6) +
      `</g>`
    // La lupa: aro dorado con perlas, cuello, virola moleteada y mango petróleo. Centro del vidrio en (0,0).
    const ring = ellipse(0, 0, 14.6, 14.6)
    const neck = 'M-2.6 14.2H2.6L2.2 19.8H-2.2Z'
    const ferrule = roundRect(-3.3, 19.6, 3.3, 23, 0.8)
    const grip = 'M-3 23H3C3.4 28 3.8 33 3.5 36.4C3.3 38 1.8 38.8 0 38.8C-1.8 38.8 -3.3 38 -3.5 36.4C-3.8 33 -3.4 28 -3 23Z'
    const beads = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * 13.3)}" cy="${f(Math.sin(a) * 13.3)}" r=".42" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>` }).join('')
    const lens = ellipse(52, 50, 12, 12)
    const lx = 52, ly = 50
    return (
      lab(k) +
      k.sun(58, 54, 16, 48, 32, false) +
      glow(k, 58, 54, 26, 28, 0.8) +
      laurel(49, 99, 28, 90, 25, 62, 8) + laurel(71, 99, 92, 90, 95, 62, 8, true) +
      cane +
      `<g transform="translate(${lx} ${ly}) rotate(-45)">` +
      k.cast([ring, grip, neck], 1.8, 2, P.blue) +
      k.draw([
        { d: neck, fill: P.gold, inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) },
        { d: grip, fill: TEAL, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.95, TEAL_D, 0.5) + `<path d="M-4 23H-1V40H-4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + `<path d="M-3.2 27H3.4M-3.4 31H3.6M-3.4 35H3.4" stroke="${TEAL_D}" stroke-width=".45"/>` + hair(-1.6, 24, -2, 30, -1.8, 37, 0.5, TEAL_L) },
        { d: ferrule, fill: P.gold, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + Array.from({ length: 6 }, (_, i) => `<path d="M${f(-2.6 + i * 1.05)} 19.6V23" stroke="${P.goldD}" stroke-width=".35"/>`).join('') },
        { d: ring, fill: P.gold, inner: k.sh(ring, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-16 -16H-4V16H-16Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` },
      ], 0.75) +
      beads +
      `<circle cx="0" cy="38.6" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      // Adentro del vidrio, el cubo azul agrandado.
      k.clip(lens, `<path d="${lens}" fill="${TEAL_P}"/>` + k.shade(lens, k.rad(TEAL_G, 0.5, 0.5, 0.5, 0, 0.9), TEAL_N, 0.4) + cube(k, lx, ly + 1, 8.6, CUBE, CUBE_D, CUBE_L, 0.55) +
        `<path d="M${lx - 12} ${ly - 3}A12 12 0 0 1 ${lx - 3} ${ly - 12}L${lx + 2} ${ly - 12}A12 12 0 0 0 ${lx - 12} ${ly + 2}Z" fill="#fff" opacity=".45"/>`) +
      `<circle cx="${lx}" cy="${ly}" r="12" fill="none" stroke="${P.ink}" stroke-width=".8"/>` +
      `<path d="M${lx - 8.6} ${ly - 3.4}A9.4 9.4 0 0 1 ${lx - 3.4} ${ly - 8.6}" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` +
      sparkle(lx + 7, ly + 7, 1.6, '#fff') +
      sparkle(60, 16.4, 3.2, '#fff') + sparkle(86, 30, 2) + sparkle(31, 36, 1.6) +
      k.defs()
    )
  },

  // ── Laboratorio de vacunas ─────────────────────────────────────────

  // Cuatro curas: la probeta en su gradilla, que burbujea algo verde y rebalsa.
  'Probeta': (u) => {
    const k = kit(u)
    const tube = 'M53 38V79A7 7 0 0 0 67 79V38Z'
    const lip = roundRect(51.4, 35.4, 68.6, 38.8, 1.2)
    const liquid = 'M53.6 52V79A6.4 6.4 0 0 0 66.4 79V52Z'
    const foam = bush(60, 34.4, 6.4, 9, 0.4) + bush(54.6, 37, 3.6, 7, 1) + bush(65.6, 36.4, 3.8, 7, 2)
    const drip = 'M66.4 38.6C68.4 38.6 69 40.4 69 42.6V48.6C69 50.4 68.2 51.4 67.4 51.4C66.6 51.4 66 50.4 66.2 48.6Z'
    const topFace = 'M33.6 66H86.4L88.4 69H31.6Z'
    const front = 'M31.6 69H88.4V73.6H31.6Z'
    const base = 'M29.6 89H90.4V94H29.6Z', baseTop = 'M31.6 86.6H88.4L90.4 89H29.6Z'
    const legL = 'M34.2 73.6H38V89H34.2Z', legR = 'M82 73.6H85.8V89H82Z'
    const ticks = Array.from({ length: 7 }, (_, i) => { const y = 46 + i * 4; return `<path d="M${i % 2 ? 63.4 : 61.6} ${y}H66.4" stroke="${P.ink}" stroke-width=".4" opacity=".75"/>` }).join('')
    const inBubbles = [[57, 74, 1.2], [62.4, 68, 0.9], [58.6, 61, 1.4], [63, 57, 0.8], [56.2, 55, 0.7], [61, 80, 0.9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${LIME_L}" stroke="${LIME_D}" stroke-width=".3"/>`).join('')
    const hole = (x: number) => `<path d="${ellipse(x, 67.5, 7.6, 1.15)}" fill="${P.brownD}" stroke="${P.ink}" stroke-width=".4"/>`
    const wood = (d: string, c: string, dk: string) => ({ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, dk, 0.4) })
    return (
      lab(k) +
      tstage(k, 60, 60, 34) +
      `<g transform="translate(60 61) scale(.85) translate(-60 -62)">` +
      k.floor(60, 93, 30, 2.6, TEAL) +
      k.draw([wood(legL, P.brown, P.brownD), wood(legR, P.brown, P.brownD), wood(baseTop, P.goldL, P.brown), wood(base, P.brown, P.brownD), wood(topFace, P.goldL, P.brown)], 0.6) +
      `<path d="M33 92H88M40 87.6H82" stroke="${P.brownD}" stroke-width=".35" opacity=".7"/>` +
      hole(44) + hole(76) + hole(60) +
      k.draw([
        {
          d: tube, fill: TEAL_P,
          inner: `<path d="${liquid}" fill="${LIME}"/>` + k.sh(liquid, 0, 0, 1, 0, 0, 0.85, LIME_D, 0.45) + `<path d="${ellipse(60, 52, 6.4, 1.3)}" fill="${LIME_L}" stroke="${LIME_D}" stroke-width=".35"/>` +
            inBubbles + ticks + k.sh(tube, 0, 0, 1, 0, 0.1, 0.6, TEAL_L, 0.3) +
            `<path d="M54.6 40V80" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".85"/><path d="M57.4 41V48" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>`,
        },
        { d: lip, fill: TEAL_P, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.7, TEAL_L, 0.4) + `<path d="M52.6 36.6H58" stroke="#fff" stroke-width=".6"/>` },
      ], 0.6) +
      k.draw([{ d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + hair(34, 71.2, 50, 70.6, 66, 71.4, 0.4, P.brownD) + hair(70, 71, 78, 70.8, 86, 71.4, 0.35, P.brownD) }], 0.6) +
      `<path d="M52.6 68.2Q60 70 67.4 68.2" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: drip, fill: LIME, inner: k.sh(drip, 0, 0, 1, 0, 0, 0.8, LIME_D, 0.4) }, { d: foam, fill: LIME, inner: k.sh(foam, 0, 0, 1, 1, 0, 0.85, LIME_D, 0.45) + `<path d="${bush(57.4, 31.6, 3.6, 7, 0.2)}" fill="${LIME_L}" opacity=".8"/>` }], 0.55) +
      [[56.4, 33.4, 1.4], [61.4, 31, 1.1], [64.6, 35.6, 0.9], [52.6, 37, 0.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${LIME_D}" stroke-width=".35"/>`).join('') +
      bubble(54, 22.6, 2.2, LIME_D) + bubble(64, 19.6, 1.6, LIME_D) + bubble(68.6, 25.6, 1.2, LIME_D) + bubble(49.6, 28, 1.1, LIME_D) +
      `</g>` +
      sparkle(85, 44, 2.4) + sparkle(35, 50, 1.8) +
      k.defs()
    )
  },

  // Quince curas: la jeringa gigante, cargada de vacuna, que alcanza para medio planeta; al lado, el frasquito.
  'Jeringa gigante': (u) => {
    const k = kit(u)
    const thumb = roundRect(-40.6, -8.4, -37.6, 8.4, 1.2)
    const plunger = 'M-37.8 -2.4H-14V2.4H-37.8Z'
    const flange = roundRect(-24.6, -11.6, -21.4, 11.6, 1.4)
    const barrel = roundRect(-22, -6.8, 18.4, 6.8, 1.4)
    const seal = 'M-14.4 -6.2H-10.4V6.2H-14.4Z'
    const liquid = 'M-10.4 -6.2H17.8V6.2H-10.4Z'
    const nozzle = 'M18.2 -3.2H21.6L23.6 -1.8V1.8L21.6 3.2H18.2Z'
    const hub = roundRect(23.4, -2.8, 28.4, 2.8, 0.8)
    const needle = 'M28.2 -.75H46.2L49.4 .75H28.2Z'
    const ticks = Array.from({ length: 9 }, (_, i) => { const x = -8 + i * 3; return `<path d="M${x} -6.8V${i % 2 ? -4.4 : -2.8}" stroke="${P.ink}" stroke-width=".4"/>` }).join('')
    const vialBody = roundRect(72.4, 69.6, 85.6, 89, 2)
    const vialNeck = 'M74.8 65.8H83.2V70H74.8Z'
    const crimp = roundRect(73.8, 61.8, 84.2, 66.6, 1)
    const flip = roundRect(74.8, 59.4, 83.2, 62.2, 0.8)
    const vLiquid = 'M72.6 77H85.4V87C85.4 88 84.6 88.8 83.6 88.8H74.4C73.4 88.8 72.6 88 72.6 87Z'
    return (
      lab(k) +
      k.sun(60, 58, 16, 47, 32, false) +
      glow(k, 60, 58, 30, 26) +
      k.floor(79, 89, 9, 1.8, TEAL) +
      // El frasquito de vacuna.
      k.draw([
        { d: vialNeck, fill: TEAL_P, inner: k.sh(vialNeck, 0, 0, 1, 0, 0, 0.7, TEAL_L, 0.4) },
        {
          d: vialBody, fill: TEAL_P,
          inner: `<path d="${vLiquid}" fill="${TEAL}"/>` + k.sh(vLiquid, 0, 0, 1, 0, 0, 0.8, TEAL_D, 0.45) + `<path d="${ellipse(79, 77, 6.4, 0.9)}" fill="${TEAL_L}"/>` +
            `<path d="M72 71.6H86V76H72Z" fill="${P.white}"/><path d="M72 72.4H86M72 75.2H86" stroke="${TEAL}" stroke-width=".5"/><path d="M78.2 73H79.8V74.6H78.2Z" fill="${P.red}"/>` +
            k.sh(vialBody, 0, 0, 1, 0, 0.1, 0.6, TEAL_L, 0.3) + `<path d="M74.4 72V87" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`,
        },
        { d: crimp, fill: P.sky1, inner: k.sh(crimp, 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + `<path d="M73.8 65H84.2" stroke="${P.blue}" stroke-width=".4"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${f(75.4 + i * 1.5)} 62V65" stroke="${P.blue}" stroke-width=".3"/>`).join('') },
        { d: flip, fill: TEAL, inner: k.sh(flip, 0, 0, 1, 0, 0, 0.8, TEAL_D, 0.4) },
      ], 0.55) +
      // La jeringa, en alto como una espada.
      `<g transform="translate(57.6 59) rotate(-40) scale(.8)">` +
      k.cast([barrel, flange, thumb, plunger], 2.2, 2.6, TEAL) +
      k.draw([
        { d: plunger, fill: P.white, inner: k.sh(plunger, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-37.8 0H-14" stroke="${P.blue}" stroke-width=".45"/>` },
        { d: thumb, fill: P.white, inner: k.sh(thumb, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) },
        { d: flange, fill: P.white, inner: k.sh(flange, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) },
        { d: needle, fill: P.white, inner: `<path d="M28 -.9H48V-.1H28Z" fill="#fff"/>` + k.sh(needle, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) },
        { d: hub, fill: P.gold, inner: k.sh(hub, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M25 -2.8V2.8M26.6 -2.8V2.8" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: nozzle, fill: TEAL_P, inner: `<path d="M18 -1.6H23.6V1.6H18Z" fill="${TEAL}"/>` },
        {
          d: barrel, fill: TEAL_P,
          inner: `<path d="${liquid}" fill="${TEAL}"/>` + k.sh(liquid, 0, 0, 0, 1, 0, 0.85, TEAL_D, 0.45) + `<path d="M-10.4 -6.2H17.8V-3.6H-10.4Z" fill="${TEAL_L}" opacity=".7"/>` +
            `<path d="${seal}" fill="${RUBBER}"/><path d="M-13.2 -6.2V6.2M-11.6 -6.2V6.2" stroke="${RUBBER_L}" stroke-width=".4"/>` +
            k.sh(barrel, 0, 0, 0, 1, 0, 0.5, TEAL_L, 0.3) + `<path d="M-20.6 -4.6H17" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>` + ticks +
            [[-4, 2.4, 0.9], [4, 3.4, 0.6], [11, 1.6, 0.8], [7, -1, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${TEAL_P}" stroke-width=".35"/>`).join(''),
        },
      ], 0.75) +
      `</g>` +
      `<path d="M87.6 37.6C88.6 39.4 89.4 40.4 89.4 41.6C89.4 42.8 88.6 43.6 87.6 43.6C86.6 43.6 85.8 42.8 85.8 41.6C85.8 40.4 86.6 39.4 87.6 37.6Z" fill="${TEAL_L}" stroke="${P.ink}" stroke-width=".45"/><circle cx="87" cy="41.4" r=".45" fill="#fff"/>` +
      sparkle(90, 30, 2.4, '#fff') + sparkle(30, 44, 2) + sparkle(36, 88, 1.4) +
      k.defs()
    )
  },

  // Cuarenta curas: Favaloro, corazón grande y manos de oro. El corazón con su puente dorado, sostenido en dos
  // manos de oro, delante del sol de Mayo.
  'Doctor Favaloro': (u) => {
    const k = kit(u)
    const heart = 'M58.6 77C52.4 72.4 45 65.6 43 57.4C41.4 50.4 44.6 43.6 50.8 42.6C54.4 42 57.4 43.6 59.4 46.4C61.8 43.2 65.6 41.6 69.6 42.4C75.6 43.8 78.8 50.2 77 57.6C75 65.6 66.6 71.6 58.6 77Z'
    const aorta = 'M54.6 46V36.6C54.6 29.6 59.6 26 64.6 26C70.2 26 73.8 30 73.8 35.6V44H67.8V36C67.8 33.6 66.4 32 64.4 32C62.2 32 60.8 33.6 60.8 36.4V46Z'
    const branch = (x: number, r: number) => `<g transform="translate(${x} 29.4) rotate(${r})">` + k.draw([{ d: roundRect(-1.4, -6.6, 1.4, 1, 1.2), fill: P.red, inner: k.sh(roundRect(-1.4, -6.6, 1.4, 1, 1.2), 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.45) + `<path d="${ellipse(0, -6.4, 1.4, 0.6)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/></g>`
    const pulm = taper(53.4, 47, 50.6, 41, 46.4, 37.4, 6, 5)
    // Una mano de oro, palma arriba: el pulgar sube por el costado del corazón y los dedos juntos lo acunan por abajo.
    const handL =
      'M30.6 90C33.6 85.6 37 82 41 80.4L41.6 79.6C41 75 41.6 70.6 43.6 67.6C44.6 66 46.8 66.2 47 68C47.4 71 47 74.6 47.8 77.6' +
      'C53 77.8 60 77.6 66.4 76.8C70.2 76.4 71.2 82.4 67.4 83.6C61.4 85.4 55 87 49.6 88.6C45.6 89.8 42.6 91.6 41.2 93.4C40 95 38.8 96.6 37.6 98Z'
    const fingers =
      hair(50, 79.6, 58, 79.6, 68.6, 78.8, 0.5, P.goldD) + hair(49.4, 81.6, 57, 81.8, 69.6, 81, 0.5, P.goldD) + hair(49, 83.8, 56, 84, 66, 83, 0.45, P.goldD) +
      `<path d="M69.4 78.4Q70.4 79.4 69.6 80.4M69.8 80.8Q70.6 82 69.2 82.8" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` +
      hair(45.2, 70, 45.6, 73.6, 46.2, 77, 0.45, P.goldD) + hair(36.6, 87.6, 40.6, 83.6, 45.4, 82, 0.5, P.goldD) + hair(41.4, 89.4, 45, 87, 49.6, 86.4, 0.4, P.goldD, 0.8) +
      hair(43.6, 68.4, 42.8, 73, 42.6, 77.6, 0.6, '#fff', 0.75) + hair(51, 78.6, 58, 78.6, 66, 77.8, 0.6, '#fff', 0.75) +
      `<path d="M44.4 68.2C45 67.4 45.8 67.4 46.2 68.2" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`
    const hand = (mirror: boolean) =>
      `<g${mirror ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` +
      k.draw([{
        d: handL, fill: P.gold,
        inner: k.sh(handL, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + k.sh('M30 86H62V100H30Z', 0, 0, 0, 1, 0, 0.7, P.goldD, 0.35) + fingers,
      }], 0.7) + `</g>`
    return (
      k.day() +
      k.sun(60, 52, 16, 47) +
      glow(k, 60, 54, 26, 28, 0.85) +
      `<g transform="translate(0 .8)">` +
      k.draw([
        { d: aorta, fill: P.red, inner: k.sh(aorta, 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) + `<path d="M56 44V36.6C56 31 60 27.6 64.4 27.4" fill="none" stroke="${P.goldL}" stroke-width=".7" opacity=".8"/>` + hair(70, 33, 72, 38, 71.4, 43, 0.45, P.wine) },
      ], 0.7) +
      branch(59.6, -14) + branch(64.4, 0) + branch(69, 14) +
      `<path d="${ellipse(70.8, 44, 3, 0.9)}" fill="${P.wine}"/>` +
      k.cast([heart], 2, 2.2, P.goldD) +
      k.draw([
        {
          d: heart, fill: P.red,
          inner: k.sh(heart, 0, 0, 1, 1, 0, 0.95, P.wine, 0.5) + `<path d="M40 40H54V70H40Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.5, 0)}"/>` +
            hair(59.6, 47.6, 54.6, 60, 58.2, 75, 0.8, P.wine) + hair(56.6, 55, 52, 58, 48.6, 64, 0.45, P.wine) + hair(57, 63, 61, 66, 64, 70, 0.45, P.wine) +
            hair(70, 47, 73.4, 53, 72.6, 61, 0.5, P.wine) + hair(46.4, 50, 46, 56, 48.6, 62, 0.4, P.wine, 0.7) +
            `<ellipse cx="49" cy="48.2" rx="3.4" ry="1.8" fill="#fff" opacity=".75" transform="rotate(-35 49 48.2)"/>`,
        },
      ], 0.8) +
      k.draw([{ d: pulm, fill: P.red, inner: k.sh(pulm, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) }], 0.6) +
      `<path d="${ellipse(46.6, 37.6, 2.8, 1.2)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35" transform="rotate(-32 46.6 37.6)"/>` +
      // El puente dorado del bypass, con sus puntadas.
      rod('M61.4 46.2C66.6 46.6 71.2 52 70.4 58.4C69.8 62.4 67.8 64.8 65.8 66.2', P.gold, 1.3) +
      `<path d="M62 45.6C66.4 46.2 70 50 70 54" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-linecap="round"/>` +
      [[61.4, 46.2], [65.8, 66.2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `</g>` +
      hand(true) + hand(false) +
      sparkle(60, 15.6, 3.2, '#fff') + sparkle(32, 40, 2.2) + sparkle(89, 44, 1.8) +
      k.defs()
    )
  },

  // ── Erradicador ────────────────────────────────────────────────────

  // Una enfermedad borrada del mapa: la mochila de fumigar con su palanca, la manguera y la lanza que rocía.
  'Fumigador': (u) => {
    const k = kit(u)
    const tank = 'M60.4 48C60.4 43 64 40 69 40H77C82 40 85.6 43 85.6 48V86.4C85.6 89.4 83.6 91.4 80.6 91.4H65.4C62.4 91.4 60.4 89.4 60.4 86.4Z'
    const neck = 'M67.4 36.2H77.6V40.6H67.4Z'
    const lid = roundRect(65.6, 32.4, 79.4, 36.8, 1.8)
    const strap = (x: number) => roundRect(x - 2, 42, x + 2, 90, 1.2)
    const band = 'M60.4 58H85.6V71H60.4Z'
    const lance = 'M43.6 77.4L33.4 47.8'
    const nozzle = 'M-1.2 0H1.2L2 -4.4H-2Z'
    const mist = bush(34.8, 38.4, 5.2, 8, 0.3)
    const drops = [[30, 42, 0.5], [28.6, 37.4, 0.45], [31.6, 33, 0.4], [38.6, 31.6, 0.5], [41.4, 36.4, 0.45], [40.6, 42, 0.4], [26.8, 44.4, 0.35]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${TEAL_L}"/>`).join('')
    return (
      lab(k) +
      tstage(k, 60, 60, 34) +
      `<g transform="translate(58 61) scale(.88) translate(-60 -62)">` +
      k.floor(70, 92, 18, 2.4, TEAL) +
      k.draw([
        { d: neck, fill: TEAL_D },
        {
          d: tank, fill: TEAL,
          inner: k.sh('M74 38C80 50 82 70 80 94H90V38Z', 0, 0, 1, 0, 0, 0.9, TEAL_D, 0.5) + k.sh('M58 82H88V94H58Z', 0, 0, 0, 1, 0, 0.7, TEAL_D, 0.35) +
            `<path d="M58 40H66V94H58Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="${band}" fill="${P.white}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.7, TEAL_L, 0.35) + `<path d="M60.4 59.4H85.6M60.4 69.6H85.6" stroke="${TEAL}" stroke-width=".5"/>` +
            hair(61.4, 78, 73, 77.4, 84.6, 78, 0.5, TEAL_D) + hair(61.4, 82.4, 73, 81.8, 84.6, 82.4, 0.5, TEAL_D) +
            hair(62.4, 46, 62, 60, 62.4, 86, 0.8, '#fff', 0.6) + hair(66, 41.6, 72, 41, 78, 41.6, 0.6, '#fff', 0.7),
        },
        { d: lid, fill: TEAL, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.85, TEAL_D, 0.45) + Array.from({ length: 10 }, (_, i) => `<path d="M${f(67 + i * 1.2)} 33.2V36" stroke="${TEAL_D}" stroke-width=".4"/>`).join('') + `<path d="M66 32.6H79" stroke="${TEAL_L}" stroke-width=".7"/>` },
      ], 0.75) +
      // El emblema del rótulo: una gota tachando una cruz de enfermedad.
      `<path d="M73 60.6C75.4 63.6 76.6 65.2 76.6 66.6C76.6 68.6 75 69.8 73 69.8C71 69.8 69.4 68.6 69.4 66.6C69.4 65.2 70.6 63.6 73 60.6Z" fill="${TEAL}" stroke="${P.ink}" stroke-width=".4"/><path d="M71.6 66.6C71.6 65.8 72 65.2 72.6 64.6" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      k.draw([
        { d: strap(64.6), fill: RUBBER, inner: `<path d="M62.6 44H66.6" stroke="${RUBBER_L}" stroke-width=".4"/>` + hair(63.8, 46, 63.6, 66, 63.8, 88, 0.4, RUBBER_L) },
        { d: strap(81.6), fill: RUBBER, inner: hair(80.8, 46, 80.6, 66, 80.8, 88, 0.4, RUBBER_L) },
      ], 0.45) +
      [[64.6, 52], [81.6, 52]].map(([x, y]) => `<rect x="${x - 2.6}" y="${y}" width="5.2" height="3.2" rx=".6" fill="none" stroke="${P.gold}" stroke-width=".9"/><rect x="${x - 2.6}" y="${y}" width="5.2" height="3.2" rx=".6" fill="none" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      // La manguera y la lanza de bronce con su pico.
      rod('M63.2 90.4C60 97 49 97 45.2 85.6', RUBBER, 2) + `<path d="M62 91.4C59 95.4 51 95.6 47.4 88.4" fill="none" stroke="${RUBBER_L}" stroke-width=".45"/>` +
      rod(lance, P.gold, 1.2) + `<path d="M42.8 76L33.6 49.4" stroke="${P.goldL}" stroke-width=".4"/>` +
      `<g transform="translate(44.4 80.6) rotate(-19)">` + k.draw([{ d: roundRect(-2.2, -5, 2.2, 5, 1.6), fill: TEAL_D, inner: `<path d="M-2.2 -2H2.2M-2.2 0H2.2M-2.2 2H2.2" stroke="${TEAL}" stroke-width=".5"/>` }], 0.5) +
      `<path d="M2.2 -3.4C5 -3 5.6 0 3.6 1.6" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M2.2 -3.4C5 -3 5.6 0 3.6 1.6" fill="none" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/></g>` +
      `<g transform="translate(33.6 48.4) rotate(-19)">` + k.draw([{ d: nozzle, fill: P.gold, inner: k.sh(nozzle, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.4) + `</g>` +
      // El rocío.
      hair(32.6, 43.4, 30, 39, 27.6, 35, 0.5, TEAL_L) + hair(33, 43.2, 33.4, 37.6, 34, 31.6, 0.5, TEAL_L) + hair(33.4, 43.4, 36.6, 38.4, 40.4, 34.6, 0.5, TEAL_L) +
      k.draw([{ d: mist, fill: P.white, inner: k.sh(mist, 0, 0, 1, 1, 0, 0.8, TEAL_G, 0.5) }], 0.4) + drops +
      `</g>` +
      sparkle(88, 34, 2.2) + sparkle(30, 66, 1.6) +
      k.defs()
    )
  },

  // Cinco erradicadas: el Aedes te tiene miedo. La raqueta eléctrica chispea y el mosquito huye contra la luna.
  'Matamosquitos': (u) => {
    const k = kit(u)
    const frame = ellipse(0, 0, 16, 20)
    const hole = ellipse(0, 0, 12.8, 16.8)
    const throat = 'M-7 17.6C-4.6 21 -3.4 25 -3.4 30H3.4C3.4 25 4.6 21 7 17.6C4.6 19 2.4 19.6 0 19.6C-2.4 19.6 -4.6 19 -7 17.6Z'
    const handle = roundRect(-3.8, 29, 3.8, 51, 2.6)
    let mesh = ''
    for (let x = -13; x <= 13; x += 1.6) mesh += `M${f(x)} -18V18`
    for (let y = -17; y <= 17; y += 1.6) mesh += `M-14 ${f(y)}H14`
    const racket =
      `<g transform="translate(47.4 55.4) rotate(-36) scale(.9)">` +
      k.cast([frame, handle], 2.6, 2.4, '#000') +
      k.clip(hole, `<path d="${hole}" fill="${P.night}" opacity=".45"/><path d="${mesh}" stroke="${P.sky1}" stroke-width=".28" opacity=".85"/><path d="${mesh}" stroke="${P.sky}" stroke-width=".22" opacity=".6" transform="translate(.8 .8)"/>`) +
      k.draw([
        { d: throat, fill: P.gold, inner: k.sh(throat, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) },
        {
          d: handle, fill: P.gold,
          inner: k.sh(handle, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M-4 29H-1.4V52H-4Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<path d="M-3.8 40H3.8V51H-3.8Z" fill="${TEAL_D}"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M-3.8 ${f(41 + i * 1.6)}H3.8" stroke="${TEAL}" stroke-width=".5"/>`).join(''),
        },
        { d: frame + 'M0 -16.8A12.8 16.8 0 0 1 0 16.8A12.8 16.8 0 0 1 0 -16.8Z', fill: P.gold, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-15 -8A16 20 0 0 1 -4 -19.4" fill="none" stroke="${P.goldL}" stroke-width="1.1" stroke-linecap="round"/>` + `<path d="${ellipse(0, 0, 14.4, 18.4)}" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` },
      ], 0.75) +
      `<circle cx="0" cy="33.4" r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.5" cy="32.9" r=".45" fill="#fff"/>` +
      `<circle cx="0" cy="37.6" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>` + k.shade(ellipse(0, 37.6, 3, 3), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.4) +
      `</g>`
    // El Aedes: patas con anillos blancos, lira blanca en el tórax y bandas en el abdomen. Mira a la derecha.
    const legs: [number, number, number, number, number, number][] = [[0, 2, -3, 8, -8, 13], [-1, 2.2, -6, 7, -13, 10], [-1.4, 1.8, -8, 4, -15.6, 5], [1, 2, 3, 7, 1, 13.4], [.4, 2.2, -1, 8, -4, 14], [1.4, 1.6, 6, 5, 9, 9.6]]
    const rings = legs.map(([x0, y0, cx, cy, x1, y1]) => [0.35, 0.55, 0.75, 0.92].map((t) => {
      const a = 1 - t, x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
      return `<circle cx="${f(x)}" cy="${f(y)}" r=".42" fill="${P.paper}"/>`
    }).join('')).join('')
    const abdomen = 'M-1.4 .4C-5 1.4 -10 3.6 -13.4 6C-14.6 6.8 -14 8.4 -12.6 8C-8.6 6.8 -4 5 -.4 3.2Z'
    const wing = 'M.4 -1.6C-2.6 -7.6 -9.6 -11.8 -14 -11.2C-15.6 -11 -15 -9.4 -12.4 -7.8C-8.4 -5.4 -4 -3.4 .4 -1.6Z'
    const mosquito =
      `<g transform="translate(76.6 40.4) rotate(-14) scale(1.02)">` +
      legs.map(([x0, y0, cx, cy, x1, y1]) => `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${P.night}" stroke-width=".55" stroke-linecap="round"/>`).join('') + rings +
      k.draw([{ d: abdomen, fill: P.night, inner: [-3, -5.6, -8.2, -10.8].map((x) => `<path d="M${x} 0L${f(x - 1)} 8" stroke="${P.paper}" stroke-width=".55"/>`).join('') }], 0.35) +
      `<ellipse cx="0" cy=".2" rx="3.2" ry="2.6" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1.4 -1.4C-.4 -.4 -.4 1 -1.4 1.8M1 -1.4C0 -.4 0 1 1 1.8" fill="none" stroke="${P.paper}" stroke-width=".45"/>` +
      `<circle cx="3.8" cy="-1.2" r="1.5" fill="${P.night}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M5 -.6L11.6 2.4" stroke="${P.night}" stroke-width=".55" stroke-linecap="round"/><path d="M4.4 -2.4C5.6 -4 6.6 -5.4 8.2 -6.2M4 -2.6C4.6 -4.6 5 -6 6.2 -7.4" fill="none" stroke="${P.night}" stroke-width=".4" stroke-linecap="round"/>` +
      k.draw([{ d: wing, fill: '#fff', inner: `<path d="M-.6 -2.4C-4 -5.6 -9 -8.6 -13 -9.6M-2 -3.8C-6 -5.8 -9.6 -6.8 -12.6 -7.4" fill="none" stroke="${P.blue}" stroke-width=".3"/>` }], 0.3) +
      `</g>`
    const stars = [[30, 30, 0.6], [44, 22, 0.45], [98, 64, 0.5], [92, 76, 0.4], [26, 76, 0.5], [60, 22, 0.35], [70, 90, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    const moon = ellipse(76.6, 40.4, 12.6, 12.6)
    return (
      tnight(k) +
      stars +
      k.shade(ellipse(76.6, 40.4, 21, 21), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.3) +
      k.draw([{ d: moon, fill: P.paper, inner: k.sh(moon, 0, 0, 1, 1, 0, 0.75, P.goldD, 0.4) + [[71.6, 35.6, 2.2], [81.4, 46, 2.8], [80, 34, 1.3], [71.4, 46.4, 1.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldL}" stroke="${P.gold}" stroke-width=".35"/>`).join('') }], 0.5) +
      hair(56, 52, 60, 48.4, 64, 47, 0.6, P.sky, 0.8) + hair(58, 57, 62, 54, 66.6, 52.6, 0.5, P.sky, 0.7) +
      mosquito +
      racket +
      // La chispa en la malla.
      `<path d="M50.6 34.4L46.4 40.4L50 41L45.2 48.6" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M50.6 34.4L46.4 40.4L50 41L45.2 48.6" fill="none" stroke="${P.goldL}" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/>` +
      sparkle(50.6, 33.6, 2.6, P.goldL) + sparkle(44.6, 49.6, 1.8, P.goldL) +
      sparkle(90, 86, 1.6, P.paper) +
      k.defs()
    )
  },

  // Doce erradicadas: ¿a quién vas a llamar? La trampa se abre y el haz de luz chupa al virus en un remolino de
  // ectoplasma, como a un fantasma.
  'Cazafantasmas': (u) => {
    const k = kit(u)
    const front = 'M37.6 80H77.6V91.6H37.6Z'
    const side = 'M77.6 80L83.6 75V86.6L77.6 91.6Z'
    const top = 'M37.6 80L43.6 75H83.6L77.6 80Z'
    const mouth = 'M46 79L49.4 76.2H75.4L72 79Z'
    const doorL = 'M46 79L49.4 76.2L41.4 59.8L37.4 62.2Z'
    const doorR = 'M72 79L75.4 76.2L87.6 60.8L84 58.6Z'
    const beam = 'M47 78H74.4L98 14H22Z'
    const stripes = Array.from({ length: 11 }, (_, i) => `<path d="M${f(37.6 + i * 4)} 88.2H${f(39.6 + i * 4)}L${f(37.4 + i * 4)} 91.6H${f(35.4 + i * 4)}Z" fill="${P.ink}"/>`).join('')
    const rivet = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".25"/>`
    const vents = Array.from({ length: 5 }, (_, i) => `<rect x="${f(40.2 + i * 1.9)}" y="82.8" width=".9" height="4.2" rx=".45" fill="${P.night}"/><path d="M${f(40.2 + i * 1.9)} 87H${f(41.1 + i * 1.9)}" stroke="${P.sky1}" stroke-width=".3"/>`).join('')
    const plate = roundRect(50.6, 82.6, 65.4, 87.2, 0.8)
    // El virus: esfera petróleo con espigas de cabeza roja.
    const vx = 61, vy = 39.4
    const spikes = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + 0.2, x0 = vx + Math.cos(a) * 8, y0 = vy + Math.sin(a) * 8, x1 = vx + Math.cos(a) * 11.4, y1 = vy + Math.sin(a) * 11.4
      return `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="${TEAL_L}" stroke-width=".6"/>` +
        `<circle cx="${f(x1)}" cy="${f(y1)}" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x1 - 0.4)}" cy="${f(y1 - 0.4)}" r=".4" fill="#fff"/>`
    }).join('')
    const core = ellipse(vx, vy, 8.6, 8.6)
    const dots = [[-3, -3, 1.4], [2.6, -4, 1], [3.6, 1.6, 1.3], [-2, 3, 1.1], [0, -.4, .8], [-5, .6, .7]].map(([x, y, r]) => `<circle cx="${f(vx + x)}" cy="${f(vy + y)}" r="${r}" fill="${TEAL_D}" stroke="${TEAL_L}" stroke-width=".3"/>`).join('')
    // El remolino de ectoplasma: anillos que se achican hasta la boca de la trampa.
    const MINT = '#E2F8EF'
    const rings: [number, number, number, number][] = [[61.4, 55.6, 12, 2.8], [60.8, 62.4, 9.4, 2.3], [61.2, 68.6, 7, 1.8], [60.8, 73.8, 4.8, 1.3]]
    const ringBack = rings.map(([x, y, rx, ry]) => `<path d="M${f(x - rx)} ${y}A${rx} ${ry} 0 0 1 ${f(x + rx)} ${y}" fill="none" stroke="${MINT}" stroke-width="1" opacity=".55"/>`).join('')
    const ringFront = rings.map(([x, y, rx, ry], i) => {
      const d = `M${f(x - rx)} ${y}A${rx} ${ry} 0 0 0 ${f(x + rx)} ${y}`
      return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(2.2 - i * 0.3)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${MINT}" stroke-width="${f(1.2 - i * 0.2)}" stroke-linecap="round"/>`
    }).join('')
    return (
      tnight(k) +
      [[28, 34, 0.6], [92, 46, 0.5], [30, 60, 0.45], [96, 72, 0.4], [40, 24, 0.4], [84, 26, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      laurel(49, 99, 28, 90, 25, 62, 8) + laurel(71, 99, 92, 90, 95, 62, 8, true) +
      // El haz de luz, que es la gloria de esta medalla.
      `<path d="${beam}" fill="${k.lin(P.goldL, 0, 1, 0, 0, 0.95, 0.05)}"/>` + k.shade(beam, k.lin(P.gold, 0, 1, 0, 0, 0.8, 0), P.gold, 0.25) +
      hair(50, 76, 42, 46, 32, 16, 0.6, '#fff', 0.8) + hair(70, 76, 80, 46, 90, 16, 0.6, '#fff', 0.8) + hair(56, 76, 54, 46, 50, 16, 0.4, '#fff', 0.7) + hair(65, 76, 68, 46, 72, 16, 0.4, '#fff', 0.7) +
      k.shade(ellipse(vx, vy + 4, 20, 22), k.rad(MINT, 0.5, 0.5, 0.5, 0.9, 0), MINT, 0.4) +
      ringBack +
      hair(50, 55, 52, 66, 58, 75, 0.5, TEAL_L) + hair(72, 56, 70, 66, 63.4, 75, 0.5, TEAL_L) + hair(56, 51, 54, 58, 57.6, 66, 0.4, TEAL_L, 0.8) + hair(66, 51, 68, 58, 64.6, 66, 0.4, TEAL_L, 0.8) +
      hair(53, 28, 52, 22, 54, 17, 0.5, MINT, 0.8) + hair(61, 26.6, 61.4, 21, 60.6, 16.4, 0.5, MINT, 0.8) + hair(69, 28, 70, 22, 68, 17, 0.5, MINT, 0.8) +
      spikes +
      k.draw([{ d: core, fill: TEAL, inner: k.sh(core, 0, 0, 1, 1, 0, 0.95, TEAL_D, 0.5) + `<path d="M50 30H60V52H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + dots }], 0.7) +
      `<path d="M55.6 35.8C56.6 33.8 58.4 32.4 60.6 32" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      ringFront +
      // La trampa: chapa con remaches, rejilla, placa, reloj y la franja de peligro; las puertas abiertas en V.
      k.floor(61, 92, 28, 2.6, '#000') +
      k.draw([
        {
          d: doorL, fill: P.sky2,
          inner: k.sh(doorL, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) + `<path d="M46 79L49.4 76.2L45 67L41.6 69.2Z" fill="${P.goldL}" opacity=".55"/>` +
            `<path d="M44.6 76.8L39.8 61.2" stroke="${P.white}" stroke-width=".6" opacity=".8"/>` + hair(46.6, 76, 44, 68, 41.6, 61.4, 0.4, P.mid) + rivet(40.6, 62.6) + rivet(44.2, 70),
        },
        {
          d: doorR, fill: P.sky1,
          inner: k.sh(doorR, 0, 0, 1, 0, 0.2, 0.9, P.mid, 0.45) + `<path d="M72 79L75.4 76.2L81 69L77.6 67.2Z" fill="${P.goldL}" opacity=".6"/>` + hair(74, 76.4, 79, 68, 84.6, 60.6, 0.4, P.mid) + rivet(84.6, 61.2) + rivet(79.4, 68),
        },
      ], 0.55) +
      k.draw([
        { d: side, fill: P.mid, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + `<path d="M79.4 80.6L82 78.6V84L79.4 86Z" fill="none" stroke="${P.sky}" stroke-width=".5"/>` },
        { d: top, fill: P.sky1, inner: k.sh(top, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + hair(42, 78.6, 60, 78.2, 76, 78.6, 0.35, P.blue) + hair(46, 76.4, 62, 75.8, 80, 76.2, 0.3, P.blue) },
        {
          d: front, fill: P.sky2,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) + `<path d="M36 80H77V82H36Z" fill="#fff" opacity=".5"/>` +
            vents + `<path d="M50 80V88.2M66 80V88.2" stroke="${P.mid}" stroke-width=".4"/>` +
            `<path d="M37.6 88.2H77.6V91.6H37.6Z" fill="${P.gold}"/>` + stripes + `<path d="M37.6 88.2H77.6" stroke="${P.ink}" stroke-width=".45"/>`,
        },
      ], 0.7) +
      k.draw([{ d: plate, fill: P.gold, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="${roundRect(51.6, 83.4, 64.4, 86.4, 0.5)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/><path d="M53.4 84.9H62.6" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray="1.2 .6"/>` }], 0.35) +
      `<circle cx="72" cy="84.6" r="2.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><circle cx="72" cy="84.6" r="2.4" fill="none" stroke="${P.gold}" stroke-width=".5" transform="scale(1.12) translate(-7.7 -9.1)"/>` +
      `<path d="M72 84.6L73.4 83" stroke="${P.red}" stroke-width=".5" stroke-linecap="round"/><path d="M70.2 84.6A1.8 1.8 0 0 1 73.8 84.6" fill="none" stroke="${P.blue}" stroke-width=".3" stroke-dasharray=".3 .4"/>` +
      `<path d="${mouth}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5" stroke-linejoin="round"/>` + k.shade(mouth, k.lin('#ffffff', 0, 1, 0, 0, 0.9, 0.2), '#ffffff', 0.4) +
      `<path d="M45.6 79.4H49M71 79.4H74.4" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      rivet(39.4, 81.4) + rivet(75.8, 81.4) + rivet(52, 83.6) + rivet(64, 83.6) +
      `<circle cx="80.6" cy="80.4" r=".9" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/><circle cx="80.6" cy="83.4" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.shade(ellipse(80.6, 80.4, 2.6, 2.6), k.rad(P.red, 0.5, 0.5, 0.5, 0.7, 0), P.red, 0.3) +
      rod('M83.6 84C88 84.6 90 87.4 92.4 89.4', RUBBER, 1.1) +
      sparkle(36, 44, 2.2, P.goldL) + sparkle(86, 38, 2, P.goldL) + sparkle(60, 15.4, 3, '#fff') +
      k.defs()
    )
  },
}
