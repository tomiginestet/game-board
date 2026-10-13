// Scrabble / Palabras cruzadas, en clave heroica. Manda el marrón de madera de la ficha del juego en el catálogo:
// el atril, el grano del papel con la cuadrícula del tablero y la sombra de las fichas de marfil. Nada del logo.
// A Cortázar no se lo dibuja: aparece por su rayuela.
import { f } from '../helpers'
import { ellipse, flame, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El marrón de la ficha del Scrabble (#8D6E3F), con su sombra y su luz; y el marfil de las fichas. */
const SCR = '#8D6E3F', SCR_D = '#5A4122', SCR_L = '#C7A673', GRAIN = '#CDB38C', HONEY = '#D9AC62'
const IVORY = '#F7EDD5', IVORY_D = '#DCC79C'
/** El ciruela de la ciruela y el pizarrón de la maestra. */
const PLUM = '#5E2C5E', PLUM_D = '#3A1840', PLUM_L = '#9A6FA6'
const SLATE = '#2F4B43', SLATE_D = '#1B2E29'
/** El gris del ratón y el rosa de sus orejas. */
const MOUSE = '#A99E93', MOUSE_D = '#6C625A', MOUSE_L = '#D9D1C6', PINK = '#E7A7A1'

/** Papel con la cuadrícula del tablero y el grano de la madera hacia los bordes. */
function board(k: Kit, gx = 0.5, gy = 0.46) {
  let grid = ''
  for (let i = 0; i <= 16; i++) grid += `M${f(-0.8 + i * 7.6)} 0V130M0 ${f(0.2 + i * 7.6)}H120`
  return `<rect width="120" height="130" fill="${P.paper}"/><path d="${grid}" stroke="${SCR_L}" stroke-width=".4" opacity=".85"/>` +
    k.shade(FULL, k.rad(SCR_L, gx, gy, 0.7, 0, 1), GRAIN, 0.5)
}

/** Gloria de marquetería: rayos rectos de madera color miel (largos) y nogal (cortos) alternados, con su grano. */
function glory(k: Kit, cx: number, cy: number, r0: number, r1: number, count = 32) {
  let light = '', dark = ''
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
    const long = i % 2 === 0, len = long ? r1 : r0 + (r1 - r0) * 0.7, w = long ? 1.8 : 1.3
    const d = `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
    if (long) light += d
    else dark += d
  }
  return (
    `<path d="${light}" fill="${k.rad(HONEY, 0.5, 0.5, 0.5, 1, 0.65)}"/>` + k.shade(light, k.rad(SCR, 0.5, 0.5, 0.5, 0.9, 0), SCR, 0.25) +
    `<path d="${dark}" fill="${k.rad(SCR, 0.5, 0.5, 0.5, 1, 0.45)}"/>` + k.shade(dark, k.rad(SCR_D, 0.5, 0.5, 0.5, 0.9, 0), SCR_D, 0.25) +
    `<circle cx="${cx}" cy="${cy}" r="${f(r0 - 2)}" fill="none" stroke="${SCR}" stroke-width=".8" stroke-dasharray=".01 1.7" stroke-linecap="round"/>`
  )
}

/** Resplandor dorado suave detrás de algo. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.75) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

/** Ficha de madera clara, centrada en (x,y): cara de 14×14 con la letra y su valor, y el canto abajo a la derecha. */
function tile(k: Kit, ch: string, pts: number, x: number, y: number, rot = 0, s = 1) {
  const face = roundRect(-7, -7, 7, 7, 1.7)
  const body = roundRect(-5.8, -5.5, 8.2, 8.5, 1.7)
  const grain = hair(-6.4, -2.4, -1, -3.6, 6.4, -2, 0.35, IVORY_D) + hair(-6.4, 3, 0, 1.8, 6.4, 3.6, 0.35, IVORY_D) + hair(-3, -5.6, 2, -6.2, 6.4, -5, 0.3, IVORY_D)
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    k.draw([
      { d: body, fill: IVORY_D, inner: k.sh(body, 0, 0, 1, 1, 0.2, 0.95, SCR, 0.45) },
      { d: face, fill: IVORY, line: 0.3, inner: grain + k.sh(face, 0, 0, 1, 1, 0, 0.6, SCR_L, 0.35) + `<path d="M-7 -7H-1V7H-7Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.5, 0)}"/>` },
    ], f(0.6 / s)) +
    hair(-5.4, -5.9, -0.6, -6.6, 4.6, -6, 0.55, '#fff') +
    `<text x="-.7" y="3.8" ${GEORGIA} font-weight="700" font-size="10.4" fill="${P.ink}" text-anchor="middle">${ch}</text>` +
    `<text x="4.8" y="5.8" ${GEORGIA} font-weight="700" font-size="${pts > 9 ? 2.6 : 3}" fill="${P.ink}" text-anchor="middle">${pts}</text>` +
    `</g>`
  )
}

/** Casilla de premio del tablero: un cuadrado con `n` dientes triangulares por lado que se meten en las vecinas. */
function premium(cx: number, cy: number, h: number, n: number, tw: number, th: number) {
  const sides: [number, number, number, number][] = [[-1, -1, 1, 0], [1, -1, 0, 1], [1, 1, -1, 0], [-1, 1, 0, -1]]
  const pts: string[] = []
  for (const [sx, sy, dx, dy] of sides) {
    const x0 = cx + sx * h, y0 = cy + sy * h, nx = dy, ny = -dx
    pts.push(`${f(x0)} ${f(y0)}`)
    for (let j = 1; j <= n; j++) {
      const t = (2 * h * j) / (n + 1)
      pts.push(`${f(x0 + dx * (t - tw / 2))} ${f(y0 + dy * (t - tw / 2))}`, `${f(x0 + dx * t + nx * th)} ${f(y0 + dy * t + ny * th)}`, `${f(x0 + dx * (t + tw / 2))} ${f(y0 + dy * (t + tw / 2))}`)
    }
  }
  return `M${pts.join('L')}Z`
}

/** Trazo de metal o madera torneada: tinta, color y un filo de luz. */
const rod = (d: string, w: number, c: string, lit: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${lit}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.3 -.3)"/>`

/** Libro acostado visto desde el lomo, con el canto de las hojas arriba, nervios dorados y el tejuelo. */
function bookSpine(k: Kit, x0: number, y0: number, x1: number, y1: number, c: string, cd: string) {
  const d = roundRect(x0, y0, x1, y1, 2.2)
  const top = `M${f(x0 + 1.4)} ${y0}L${f(x0 + 3)} ${f(y0 - 2)}H${f(x1 + 0.6)}L${f(x1 - 1)} ${y0}Z`
  const my = (y0 + y1) / 2, h = y1 - y0
  const bands = [x0 + 4.4, x0 + 6.2, x1 - 6.2, x1 - 4.4].map((x) => `<path d="M${f(x)} ${f(y0 + 0.6)}V${f(y1 - 0.6)}" stroke="${P.gold}" stroke-width=".6"/>`).join('')
  const lx = (x0 + x1) / 2
  const label = roundRect(f(lx - 8), f(my - h * 0.28), f(lx + 8), f(my + h * 0.28), 0.6)
  return (
    k.draw([
      { d: top, fill: IVORY, inner: `<path d="M${f(x0 + 2.4)} ${f(y0 - 0.7)}H${f(x1)}M${f(x0 + 1.8)} ${f(y0 - 1.3)}H${f(x1 + 0.3)}" stroke="${IVORY_D}" stroke-width=".3"/>` },
      {
        d, fill: c,
        inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, cd, 0.5) + `<path d="M${x0} ${f(y0 + 0.4)}H${x1}V${f(y0 + h * 0.3)}H${x0}Z" fill="${k.lin('#fff', 0, 0, 0, 1, 0.3, 0)}"/>` +
          bands + hair(x0 + 9, y1 - 1.6, (x0 + x1) / 2, y1 - 1, x1 - 9, y1 - 1.8, 0.4, cd),
      },
    ], 0.6) +
    `<path d="${label}" fill="${cd}" stroke="${P.gold}" stroke-width=".45"/>` +
    hair(lx - 5.6, my, lx, my - 0.5, lx + 5.6, my, 0.55, P.goldL) +
    `<circle cx="${f(x0 + 2.4)}" cy="${f(my)}" r=".5" fill="${P.goldL}"/><circle cx="${f(x1 - 2.4)}" cy="${f(my)}" r=".5" fill="${P.goldL}"/>`
  )
}

export const SCRABBLE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Palabra de oro ─────────────────────────────────────────────────

  // Treinta puntos de una: la Z cae justo en la casilla roja de triple palabra.
  'Triple palabra': (u) => {
    const k = kit(u)
    const sq = premium(60, 61, 19, 3, 5, 3.2)
    const inset = roundRect(43.6, 44.6, 76.4, 77.4, 0.6)
    // Los golpes del aterrizaje, en las esquinas de abajo de la ficha.
    const hit = hair(42.4, 66, 39.4, 67.4, 36.6, 68.4, 0.7, '#fff') + hair(43.4, 70, 40.6, 72.4, 38.4, 74.4, 0.6, '#fff') + hair(78.6, 64, 81.4, 64.4, 84.4, 64, 0.7, '#fff') + hair(78, 68, 80.6, 69.8, 83, 71.6, 0.6, '#fff')
    return (
      board(k) +
      glory(k, 60, 60, 24, 48, 32) +
      k.cast([sq], 2.4, 2.4, SCR) +
      k.draw([{ d: sq, fill: P.red, inner: k.sh(sq, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="M36 38H52V84H36Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.25, 0)}"/>` }], 0.8) +
      `<path d="${inset}" fill="none" stroke="#fff" stroke-width=".55" opacity=".85"/>` +
      `<path d="${roundRect(45, 46, 75, 76, 0.4)}" fill="none" stroke="#fff" stroke-width=".35" opacity=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<text x="60" y="71" ${GEORGIA} font-weight="700" font-size="3.8" letter-spacing=".5" fill="#fff" text-anchor="middle">TRIPLE</text>` +
      `<text x="60" y="75.4" ${GEORGIA} font-weight="700" font-size="3.8" letter-spacing=".5" fill="#fff" text-anchor="middle">PALABRA</text>` +
      k.floor(61.4, 66.6, 14, 2.6, P.wine) +
      tile(k, 'Z', 10, 60.4, 53, 7, 1.46) + hit +
      sparkle(34, 40, 2.4, '#fff') + sparkle(86, 82, 1.8, '#fff') + sparkle(88, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // Sesenta de una: el diccionario de bolsillo, gordo de cuero, con una X de señalador en la palabra que nadie conocía.
  'Diccionario de bolsillo': (u) => {
    const k = kit(u)
    const front = 'M50 40H79Q80.4 40 80.4 41.4V86.6Q80.4 88 79 88H50Z'
    const spine = 'M50 40L39 35.4C36.8 50 36.8 70 39 83.4L50 88C48 72 48 56 50 40Z'
    const top = 'M50 40L39 35.4H69L80.4 40Z'
    const pages = Array.from({ length: 5 }, (_, i) => { const t = 0.15 + i * 0.17; return `M${f(50 - 11 * t)} ${f(40 - 4.6 * t)}H${f(80.4 - 11.4 * t)}` }).join('')
    const bandY = [44, 54, 64, 74, 82]
    const bands = bandY.map((y) => `<path d="M49.6 ${y}Q42 ${f(y - 3.2)} 38.2 ${f(y - 4.4)}" fill="none" stroke="${P.ink}" stroke-width="1.5"/><path d="M49.6 ${y}Q42 ${f(y - 3.2)} 38.2 ${f(y - 4.4)}" fill="none" stroke="${P.gold}" stroke-width=".7"/>`).join('')
    const leaf = (x: number, y: number, r: number) => `<path d="M0 0C1 -1.6 3.2 -2 4.4 -.6C3.2 .8 1.2 1 0 0Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.gold}"/>`
    return (
      board(k) +
      glory(k, 60, 60, 18, 46, 32) +
      k.floor(60, 89, 26, 3, SCR) +
      `<g transform="rotate(-5 60 62)">` +
      k.draw([
        { d: top, fill: P.goldL, inner: `<path d="${pages}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>` + k.sh(top, 0, 0, 1, 0, 0, 0.6, P.goldD, 0.4) },
        { d: spine, fill: P.wine, inner: k.sh(spine, 0, 0, 1, 0, 0.6, 0, '#3A0F1A', 0.5) + k.sh(spine, 0, 0, 0, 1, 0, 0.6, '#3A0F1A', 0.4) },
        {
          d: front, fill: P.red,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.85, P.wine, 0.45) + `<path d="M50 40H58V88H50Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.3, 0)}"/>` +
            hair(54, 62, 58, 64, 61, 70, 0.35, P.wine, 0.7) + hair(70, 46, 74, 52, 72, 58, 0.35, P.wine, 0.7) + hair(62, 78, 68, 80, 74, 79, 0.35, P.wine, 0.7),
        },
      ], 0.8) +
      bands +
      `<path d="M41 57.6L48.6 60.4V66.6L41 63.8Z" fill="${P.night}" stroke="${P.gold}" stroke-width=".45"/>` + hair(42, 61.4, 45, 62.2, 47.8, 63.6, 0.5, P.goldL) +
      `<path d="${roundRect(53, 43.4, 77.4, 84.6, 0.6)}" fill="none" stroke="${P.gold}" stroke-width=".7"/>` +
      `<path d="${roundRect(54.8, 45.2, 75.6, 82.8, 0.4)}" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      leaf(55.4, 47.4, 45) + leaf(75, 47.4, 135) + leaf(55.4, 80.6, -45) + leaf(75, 80.6, -135) +
      `<text x="65.2" y="56" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.goldL}" text-anchor="middle">Diccionario</text>` +
      `<path d="M58 58.4H72.4" stroke="${P.gold}" stroke-width=".4"/>` +
      `<path d="${starPath(65.2, 69.4, 5.2, 1.8, 8)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/><circle cx="65.2" cy="69.4" r="1.4" fill="${P.wine}" stroke="${P.goldD}" stroke-width=".3"/>` +
      // La X de señalador, metida entre las hojas.
      k.clip('M30 10H90V37.9H30Z', tile(k, 'X', 8, 59.6, 32, -7, 0.95)) +
      hair(46, 37.9, 60, 37.4, 74, 37.9, 0.6, P.goldD) +
      `</g>` +
      sparkle(88, 40, 2.2, '#fff') + sparkle(32, 72, 1.6, '#fff') + sparkle(36, 30, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cien de una: el crisol de la Academia al fuego, y de él sale la Ñ, limpia, fija y con esplendor.
  'Real Academia': (u) => {
    const k = kit(u)
    const body = 'M44.6 48C44.2 57 45.6 66 50 73C53 77.8 56.4 79.6 60 79.6C63.6 79.6 67 77.8 70 73C74.4 66 75.8 57 75.4 48Z'
    const spout = 'M44.4 49.4L38.6 46.4C38 46 38.2 45.2 38.8 45.2L45 45.4Z'
    const lip = ellipse(60, 48, 16.6, 4)
    const mouth = ellipse(60, 47.6, 13, 2.5)
    const fire = (x: number, s: number, r: number, y = 92) => flame(k, `translate(${x} ${y}) rotate(${r}) scale(${s}) translate(-60 -90)`)
    const band = 'M37 81Q60 92.6 83 81V86.6Q60 98.2 37 86.6Z'
    const tailL = 'M37 81L30.6 81.6L33.2 84.6L30.8 87.4L37 86.6Z'
    const tailR = 'M83 81L89.4 81.6L86.8 84.6L89.2 87.4L83 86.6Z'
    const rid = k.id('mot')
    const beads = Array.from({ length: 11 }, (_, i) => { const x = 46.4 + i * 2.72, t = (x - 60) / 14.6; return `<circle cx="${f(x)}" cy="${f(55.4 + 2.4 * (1 - t * t))}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    // Guirnalda de laurel en relieve, alrededor de la panza.
    const garland = Array.from({ length: 9 }, (_, i) => { const x = 48 + i * 3, t = (x - 60) / 14, y = 63.6 + 2.6 * (1 - t * t); return `<path d="M0 0C1 -1.4 3 -1.6 4 -.4C3 .8 1 .9 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${i % 2 ? 20 : -20})" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>` }).join('') + `<path d="M46.6 61Q60 66.6 73.4 61" fill="none" stroke="${P.goldD}" stroke-width=".35"/>`
    // Gallones del crisol: estrías que bajan hacia el fondo.
    const flutes = [-9, -5.4, -1.8, 1.8, 5.4, 9].map((dx) => hair(60 + dx, 62.4 + Math.abs(dx) * 0.05, 60 + dx * 0.7, 70, 60 + dx * 0.3, 78.6, 0.5, P.goldD)).join('')
    return (
      board(k, 0.5, 0.42) +
      glory(k, 60, 52, 16, 48, 32) +
      glow(k, 60, 32, 18, 15, 0.85) +
      fire(46, 0.42, -16) + fire(74, 0.42, 16) + fire(60, 0.5, 0) +
      k.draw([
        {
          d: body, fill: P.gold,
          inner: k.sh(body, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M44 46H53V82H44Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<path d="M45.4 53.6Q60 59.4 74.6 53.6M46.6 61Q60 66.6 73.4 61" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` + flutes +
            [0, 1, 2, 3, 4].map((i) => hair(68 + i * 1.3, 49.4 + i * 0.3, 70.4 + i * 1.1, 58, 66 + i * 0.9, 72 - i * 1.4, 0.4, P.goldD, 0.8)).join('') +
            k.sh('M40 64H80V82H40Z', 0, 0, 0, 1, 0, 0.75, P.red, 0.4),
        },
        { d: spout, fill: P.goldL, inner: k.sh(spout, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.45) },
        { d: lip, fill: P.goldL, inner: k.sh(lip, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ellipse(60, 48.4, 15.4, 3.2)}" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` },
      ], 0.8) +
      beads + garland +
      `<path d="${mouth}" fill="${P.red}"/>` + k.shade(mouth, k.rad(P.goldL, 0.5, 0.35, 0.6, 1, 0), P.gold, 0.5) +
      `<path d="M47.6 52C48.6 58 50.4 64 53.4 70" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>` +
      fire(51.4, 0.2, -10, 88) + fire(68.6, 0.2, 10, 88) + fire(60, 0.16, 0, 88.6) +
      hair(53, 45, 50.6, 40, 53.4, 35, 0.6, P.goldD) + hair(67, 45, 69.4, 40, 66.6, 35, 0.6, P.goldD) +
      tile(k, 'Ñ', 8, 60, 32, -4, 1.04) +
      k.draw([{ d: tailL, fill: P.sky1, inner: k.sh(tailL, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) }, { d: tailR, fill: P.sky1, inner: k.sh(tailR, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) }], 0.5) +
      k.draw([{ d: band, fill: P.white, inner: k.sh(band, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M37 82Q60 93.6 83 82M37 85.6Q60 97.2 83 85.6" fill="none" stroke="${P.red}" stroke-width=".35"/>` }], 0.55) +
      `<path id="${rid}" d="M38 85Q60 96.4 82 85" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="3.3" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">limpia, fija y da esplendor</textPath></text>` +
      sparkle(60, 17.4, 2.6, '#fff') + sparkle(36, 42, 2, '#fff') + sparkle(85, 38, 1.8, '#fff') +
      k.defs()
    )
  },

  // ── Bingo ──────────────────────────────────────────────────────────

  // Vaciaste el atril de una: las siete fichas salen volando en arco y queda la madera pelada.
  'Atril vacío': (u) => {
    const k = kit(u)
    const back = 'M36 70.4H84L85.4 72.6H34.6Z'
    const slope = 'M34.6 72.6H85.4L87 79H33Z'
    const front = 'M33 79H87V82.6Q87 84 85.6 84H34.4Q33 84 33 82.6Z'
    const word: [string, number][] = [['G', 2], ['A', 1], ['N', 1], ['A', 1], ['S', 1], ['T', 1], ['E', 1]]
    const tiles = word.map(([c, p], i) => {
      const a = ((-158 + (i * 136) / 6) * Math.PI) / 180
      return tile(k, c, p, f(60 + Math.cos(a) * 28), f(73 + Math.sin(a) * 28), f(((a * 180) / Math.PI + 90) * 0.7), 0.74)
    }).join('')
    return (
      board(k, 0.5, 0.5) +
      glory(k, 60, 72, 12, 50, 32) +
      glow(k, 60, 66, 22, 14, 0.6) +
      hair(46, 69, 43, 63, 40, 58, 0.6, SCR) + hair(60, 69, 59.6, 62, 60, 55, 0.6, SCR) + hair(74, 69, 77, 63, 80, 58, 0.6, SCR) +
      k.floor(60, 84.6, 28, 2.6, SCR) +
      k.draw([
        { d: front, fill: SCR, inner: k.sh(front, 0, 0, 0, 1, 0, 0.9, SCR_D, 0.5) + hair(36, 80.6, 60, 80.2, 84, 80.8, 0.4, SCR_L) },
        { d: slope, fill: SCR_L, inner: k.sh(slope, 0, 0, 1, 1, 0, 0.7, SCR, 0.45) + hair(38, 74.6, 56, 74.2, 72, 74.8, 0.4, SCR) + hair(50, 76.4, 66, 76, 82, 76.6, 0.35, SCR) },
        { d: back, fill: SCR, inner: k.sh(back, 0, 0, 0, 1, 0, 0.8, SCR_D, 0.4) },
      ], 0.7) +
      `<path d="M33.6 78.4H86.4" stroke="${SCR_D}" stroke-width=".8"/>` +
      `<text x="60" y="83.2" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.4" fill="${P.goldL}" text-anchor="middle">+50</text>` +
      tiles +
      sparkle(60, 38, 2.4, '#fff') + sparkle(30, 48, 1.6, '#fff') + sparkle(90, 50, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cinco bingos: esto ya es la lotería. El bolillero de bronce gira lleno de fichas y canta una.
  'Cantó línea': (u) => {
    const k = kit(u)
    const cx = 60, cy = 50, R = 19
    const base = 'M28 80H92L90 86H30Z'
    const baseTop = 'M30 78H90L92 80H28Z'
    const wire = (d: string, w = 0.9) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 0.9)}"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="${w}"/>`
    const rings = [ellipse(cx, cy, R, 8), ellipse(cx, cy, R, 15), ellipse(cx, cy, 4, R)]
    const inside = tile(k, 'L', 1, 51, 45, 22, 0.66) + tile(k, 'I', 1, 67, 42, -28, 0.62) + tile(k, 'N', 1, 60, 58, 40, 0.66)
    return (
      board(k, 0.5, 0.44) +
      glory(k, cx, cy, 20, 47, 32) +
      k.floor(60, 86, 30, 2.6, SCR) +
      rod('M37 50L32.4 79M37 50L42 79', 1.6, P.gold, P.goldL) + rod('M83 50L78 79M83 50L87.6 79', 1.6, P.gold, P.goldL) +
      k.draw([
        { d: base, fill: SCR, inner: k.sh(base, 0, 0, 0, 1, 0, 0.9, SCR_D, 0.5) + hair(34, 83, 60, 82.4, 86, 83, 0.4, SCR_L) },
        { d: baseTop, fill: SCR_L, inner: k.sh(baseTop, 0, 0, 1, 0, 0, 0.6, SCR, 0.4) },
      ], 0.7) +
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${P.sky1}" opacity=".35"/>` +
      `<g opacity=".45">${rings.map((d) => `<path d="${d}" fill="none" stroke="${P.goldD}" stroke-width=".6"/>`).join('')}</g>` +
      inside +
      k.shade(ellipse(cx, cy, R, R), k.rad('#fff', 0.3, 0.25, 0.4, 0.45, 0), '#fff', 0.25) +
      rings.map((d) => wire(d, 0.7)).join('') +
      wire(ellipse(cx, cy, R, R), 1.6) + `<path d="M${cx - 15} ${cy - 10}A${R - 1.4} ${R - 1.4} 0 0 1 ${cx - 6} ${cy - 17}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      rod('M37 50H41M79 50H83', 2.2, P.gold, P.goldL) +
      [37, 83].map((x) => `<circle cx="${x}" cy="${cy}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><circle cx="${x}" cy="${cy}" r="1" fill="${P.goldD}"/>`).join('') +
      rod('M83 50L90 58', 1.6, P.gold, P.goldL) + rod('M90 58L92.4 55.6', 2.4, SCR, SCR_L) +
      tile(k, 'A', 1, 60, 73.4, -4, 0.62) +
      `<text x="44" y="84.8" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.4" fill="${P.goldL}" text-anchor="middle">¡línea!</text>` +
      sparkle(84, 32, 2, '#fff') + sparkle(30, 62, 1.6, '#fff') +
      k.defs()
    )
  },

  // Doce bingos: las letras te obedecen. De la sopera de porcelana suben en arco, ordenaditas.
  'Sopa de letras': (u) => {
    const k = kit(u)
    const body = 'M34 63C34 75 44 83 60 83C76 83 86 75 86 63Z'
    const foot = 'M48 81.6C48 84.6 45 86.6 42.6 88.4C42 89 42.4 89.8 43.2 89.8H76.8C77.6 89.8 78 89 77.4 88.4C75 86.6 72 84.6 72 81.6Z'
    const rim = ellipse(60, 63, 27, 5.4)
    const soup = ellipse(60, 63.2, 23, 3.6)
    const handle = 'M34.8 65.6C30 62.6 26.2 64.2 26.4 67.6C26.6 70.8 30.4 71.6 32 69.4C33 68 31.6 66.4 30.4 67.4'
    const word: [string, number][] = [['S', 1], ['O', 1], ['P', 3], ['A', 1]]
    const tiles = word.map(([c, p], i) => {
      const a = ((-152 + i * (124 / 3)) * Math.PI) / 180
      return tile(k, c, p, f(60 + Math.cos(a) * 26), f(60 + Math.sin(a) * 26), f(((a * 180) / Math.PI + 90) * 0.5), 0.82)
    }).join('')
    const swag = (x0: number, x1: number) => { const mx = (x0 + x1) / 2; return `<path d="M${x0} 70.4Q${mx} 76 ${x1} 70.4" fill="none" stroke="${P.mid}" stroke-width=".6"/>` + hair(x0 + 1, 71.6, mx, 75.4, x1 - 1, 71.6, 0.5, P.blue) + `<circle cx="${mx}" cy="74.6" r="1" fill="${P.mid}"/><circle cx="${x0}" cy="70.4" r=".8" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>` }
    return (
      board(k, 0.5, 0.44) +
      glory(k, 60, 58, 20, 48, 32) +
      glow(k, 60, 46, 26, 18, 0.7) +
      laurel(50, 99, 33, 95, 29, 77, 6) + laurel(70, 99, 87, 95, 91, 77, 6, true) +
      k.floor(60, 90, 22, 2.4, SCR) +
      hair(50, 60, 46, 52, 50, 44, 0.8, P.blue) + hair(60, 60, 62, 50, 58, 40, 0.7, P.blue) + hair(70, 60, 74, 52, 70, 44, 0.8, P.blue) +
      rod(handle, 1.8, P.gold, P.goldL) + `<g transform="translate(120 0) scale(-1 1)">${rod(handle, 1.8, P.gold, P.goldL)}</g>` +
      k.draw([
        { d: foot, fill: P.white, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M43 87.6H77" stroke="${P.gold}" stroke-width="1.2"/><path d="M48 83.4H72" stroke="${P.gold}" stroke-width=".7"/>` },
        {
          d: body, fill: P.white,
          inner: k.sh('M64 60C76 64 84 70 80 86H90V60Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + k.sh('M30 76H90V86H30Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
            `<path d="M34.4 66.8Q60 73.6 85.6 66.8" fill="none" stroke="${P.gold}" stroke-width="1.1"/>` + swag(38, 49) + swag(49, 60) + swag(60, 71) + swag(71, 82) +
            `<path d="M40 70C40 75 44 79 50 80.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>`,
        },
        { d: rim, fill: P.white, line: 0.4, inner: `<path d="${rim}" fill="none" stroke="${P.gold}" stroke-width="1.6" transform="translate(0 .4)"/>` },
      ], 0.75) +
      `<path d="${soup}" fill="${P.gold}"/>` + k.shade(soup, k.lin(P.goldD, 0, 0, 0, 1, 0.8, 0), P.goldD, 0.4) +
      `<circle cx="52" cy="63.4" r=".9" fill="${P.goldL}"/><circle cx="66" cy="62.6" r="1.1" fill="${P.goldL}"/><circle cx="59" cy="64.4" r=".6" fill="${P.goldL}"/>` +
      tiles +
      sparkle(60, 24, 3, '#fff') + sparkle(28, 66, 1.8, '#fff') + sparkle(92, 66, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Erudito ────────────────────────────────────────────────────────

  // Trescientos puntos: en el pizarrón, el puntero, los anteojitos y la ciruela para la maestra.
  'Maestra ciruela': (u) => {
    const k = kit(u)
    const plum = 'M57 55.4C64.6 54 70.6 60.6 70.4 68.6C70.2 76.6 64.6 81.6 57.4 81.6C49.6 81.6 44 76.4 44.2 68.4C44.4 60.6 50 55.6 55.4 56.6C56 56.2 56.4 55.6 57 55.4Z'
    const leafD = 'M58.6 50.6C61.6 46.4 67.6 45.4 71.4 47.6C68.6 51.6 62.6 52.8 58.6 50.6Z'
    const ledge = 'M0 84H120V96H0Z', ledgeTop = 'M0 80.6H120V84H0Z'
    const lens = (x: number) => `<circle cx="${x}" cy="77" r="4.2" fill="${P.sky1}" opacity=".55"/><path d="M${f(x - 2.6)} 75.6A3 3 0 0 1 ${f(x - 0.6)} 74" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>`
    return (
      `<rect width="120" height="130" fill="${SLATE}"/>` + k.shade(FULL, k.rad(SLATE_D, 0.5, 0.42, 0.7, 0, 1), SLATE_D, 0.6) +
      hair(26, 50, 50, 46, 76, 52, 3, '#fff', 0.06) + hair(40, 64, 66, 60, 96, 64, 2.4, '#fff', 0.05) +
      `<text x="60" y="38" ${GEORGIA} font-style="italic" font-size="8.4" fill="#fff" opacity=".82" text-anchor="middle">a b c</text>` +
      hair(44, 41.4, 60, 40.4, 76, 41.6, 0.7, '#fff', 0.7) +
      k.draw([
        { d: ledge, fill: SCR, inner: k.sh(ledge, 0, 0, 0, 1, 0, 0.9, SCR_D, 0.5) + hair(10, 88, 60, 87.4, 110, 88.4, 0.5, SCR_L) },
        { d: ledgeTop, fill: SCR_L, inner: k.sh(ledgeTop, 0, 0, 0, 1, 0, 0.6, SCR, 0.4) },
      ], 0.6) +
      `<path d="${taper(38, 82, 64, 59, 91, 35, 2.8, 1.5)}" fill="${SCR_L}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="${taper(86.4, 39, 88.8, 37, 91, 35, 1.8, 1.5)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(42, 79.4, 62, 61, 84, 41, 0.45, SCR) +
      k.floor(58, 82, 13, 2, SLATE_D) +
      k.draw([{
        d: plum, fill: PLUM,
        inner: k.sh(plum, 0, 0, 1, 1, 0, 0.95, PLUM_D, 0.5) + k.shade(ellipse(51, 64, 6, 8), k.rad(PLUM_L, 0.5, 0.5, 0.5, 0.9, 0), PLUM_L, 0.5) +
          hair(57.4, 57.6, 65, 63, 63.4, 79, 0.7, PLUM_D) + `<ellipse cx="50" cy="63" rx="2.2" ry="1.2" fill="#fff" opacity=".75" transform="rotate(-50 50 63)"/>`,
      }], 0.75) +
      rod('M56.6 56.4C56.8 53 57.6 50.4 59.4 48.6', 1, P.brownD, P.brown) +
      k.draw([{ d: leafD, fill: P.green, inner: k.sh(leafD, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) + hair(59.6, 50.4, 65, 48.4, 70.4, 47.8, 0.45, P.greenD) }], 0.5) +
      lens(33) + lens(43) +
      `<path d="M37.2 77C37.2 75 38.8 74.4 38.8 74.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/>` +
      `<g fill="none" stroke-linecap="round"><path d="M29 76.4L23.6 82M47 76.4L40 81.6M37.2 76.6Q38 74.6 38.8 76.6" stroke="${P.ink}" stroke-width="1.6"/>` +
      `<circle cx="33" cy="77" r="4.2" stroke="${P.ink}" stroke-width="1.7"/><circle cx="43" cy="77" r="4.2" stroke="${P.ink}" stroke-width="1.7"/>` +
      `<path d="M29 76.4L23.6 82M47 76.4L40 81.6M37.2 76.6Q38 74.6 38.8 76.6" stroke="${P.gold}" stroke-width=".7"/>` +
      `<circle cx="33" cy="77" r="4.2" stroke="${P.gold}" stroke-width=".8"/><circle cx="43" cy="77" r="4.2" stroke="${P.gold}" stroke-width=".8"/></g>` +
      sparkle(84, 64, 1.8, '#fff') + sparkle(32, 58, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cuatrocientos puntos: vivís entre libros. El ratón arriba de la pila, olfateando una R.
  'Ratón de biblioteca': (u) => {
    const k = kit(u)
    const body = 'M-7.6 -.2C-10 -.6 -12.8 -1.6 -15.6 -2.6C-16.8 -3 -17.2 -4 -16.4 -5C-14.4 -7.6 -11.6 -10 -8.4 -11C-5.6 -13.8 -1.6 -15 2.4 -14.6C8.6 -14 12.8 -9.6 12.8 -4.6C12.8 -1.6 11.4 0 9 0Z'
    const ear = ellipse(-6.4, -12.8, 3.4, 3.9)
    return (
      board(k, 0.5, 0.5) +
      glory(k, 60, 58, 14, 46, 32) +
      k.floor(60, 88, 30, 2.6, SCR) +
      bookSpine(k, 33, 78, 86, 87, P.mid, P.night) +
      bookSpine(k, 36, 70, 82, 78, P.red, P.wine) +
      bookSpine(k, 38, 63, 85, 70, SCR, SCR_D) +
      `<path d="${taper(72.6, 60.4, 81, 58, 81, 68, 1.6, 0.8)}" fill="${PINK}" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(81, 68, 81.6, 74, 77, 77, 0.8, PINK) +
      tile(k, 'R', 1, 38.4, 57.8, -6, 0.64) +
      `<g transform="translate(61 63)">` +
      k.draw([
        {
          d: body, fill: MOUSE,
          inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, MOUSE_D, 0.5) + `<path d="M-14 -4C-6 -1.4 4 -1 12 -3V1H-14Z" fill="${MOUSE_L}"/>` +
            hair(-2, -12.6, 4, -11.6, 9, -8, 0.4, MOUSE_D) + hair(0, -9, 5, -8, 9.4, -4.4, 0.4, MOUSE_D) + hair(-6, -8.6, -3, -6.4, -1, -3, 0.35, MOUSE_D),
        },
        { d: ear, fill: MOUSE, inner: `<path d="${ellipse(-6.6, -12.6, 2.2, 2.7)}" fill="${PINK}"/>` + k.sh(ear, 0, 0, 1, 1, 0, 0.6, MOUSE_D, 0.4) },
      ], 0.6) +
      `<ellipse cx="-8.4" cy="-.4" rx="1.6" ry=".8" fill="${PINK}" stroke="${P.ink}" stroke-width=".35"/><ellipse cx="6.4" cy="-.3" rx="2.2" ry=".9" fill="${PINK}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<circle cx="-11.4" cy="-7.4" r="1" fill="${P.ink}"/><circle cx="-11.7" cy="-7.7" r=".3" fill="#fff"/>` +
      `<circle cx="-16.6" cy="-4.2" r=".85" fill="${PINK}" stroke="${P.ink}" stroke-width=".3"/>` +
      hair(-15, -4.6, -18, -6.4, -21, -6.6, 0.3) + hair(-15, -4, -18.4, -4, -21.4, -3.4, 0.3) + hair(-15, -3.4, -18, -2.4, -20.6, -0.8, 0.3) +
      `</g>` +
      sparkle(84, 40, 2, '#fff') + sparkle(34, 40, 1.6, '#fff') +
      k.defs()
    )
  },

  // Quinientos puntos: una rayuela de fichas que sube hasta el Cielo. Cortázar estaría orgulloso del tablero.
  'Rayuela': (u) => {
    const k = kit(u)
    const pr = (uu: number, v: number) => { const z = 1 + v * 0.2; return [60 + (uu * 30) / z, -18 + 110 / z] }
    const pt = (uu: number, v: number) => pr(uu, v).map(f).join(' ')
    // Cuadrícula del tablero en el piso, fugando hacia el cielo.
    let grid = ''
    for (let i = -6; i <= 6; i++) grid += `M${pt(i * 0.5, 0)}L${pt(i * 0.5, 9)}`
    for (let j = 0; j <= 9; j++) grid += `M${pt(-4, j * 0.5)}L${pt(4, j * 0.5)}`
    const cells: [string, number, number, number][] = [['R', 1, 0, 0], ['A', 1, 0, 1], ['Y', 4, -1, 2], ['U', 1, 1, 2], ['E', 1, 0, 3], ['L', 1, -1, 4], ['A', 1, 1, 4]]
    const g = 0.05
    const tiles = cells.map(([c, p, col, v]) => {
      const u0 = col === 0 ? -0.5 : col < 0 ? -1 : 0, u1 = u0 + 1
      const nl = pr(u0 + g, v + g), nr = pr(u1 - g, v + g), fr = pr(u1 - g, v + 1 - g), fl = pr(u0 + g, v + 1 - g)
      const th = 2.4 / (1 + v * 0.2)
      const top = `M${nl.map(f).join(' ')}L${nr.map(f).join(' ')}L${fr.map(f).join(' ')}L${fl.map(f).join(' ')}Z`
      const side = `M${nl.map(f).join(' ')}L${nr.map(f).join(' ')}L${f(nr[0])} ${f(nr[1] + th)}L${f(nl[0])} ${f(nl[1] + th)}Z`
      const ax = (fr[0] - fl[0] + nr[0] - nl[0]) / 2, ay = (fr[1] - fl[1] + nr[1] - nl[1]) / 2, cxv = nl[0] - fl[0], cyv = nl[1] - fl[1]
      const m = `matrix(${f(ax)} ${f(ay)} ${f(cxv)} ${f(cyv)} ${f(fl[0])} ${f(fl[1])})`
      return k.draw([
        { d: side, fill: IVORY_D, inner: k.sh(side, 0, 0, 0, 1, 0, 0.8, SCR, 0.4) },
        { d: top, fill: IVORY, line: 0.3, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, SCR_L, 0.35) },
      ], 0.55) +
        `<g transform="${m}"><path d="M.06 .32Q.5 .26 .94 .34M.06 .7Q.5 .64 .94 .72" fill="none" stroke="${IVORY_D}" stroke-width=".022"/>` +
        `<text x=".45" y=".84" ${GEORGIA} font-weight="700" font-size=".7" fill="${P.ink}" text-anchor="middle">${c}</text>` +
        `<text x=".85" y=".9" ${GEORGIA} font-weight="700" font-size=".2" fill="${P.ink}" text-anchor="middle">${p}</text></g>`
    }).join('')
    // El Cielo: medio círculo de tiza al fondo.
    const arc = Array.from({ length: 19 }, (_, i) => { const a = (i / 18) * Math.PI; return pt(Math.cos(a) * 1.3, 5.05 + Math.sin(a) * 1.5) })
    const sky = `M${arc.join('L')}Z`
    const tejo = pr(0.86, 2.14)
    const sun = pr(0, 5.5)
    return (
      `<rect width="120" height="130" fill="${P.paper}"/>` +
      glory(k, 60, f(sun[1]), 9, 52, 36) +
      `<path d="${grid}" stroke="${SCR}" stroke-width=".35" opacity=".5"/>` +
      k.shade(FULL, k.rad(SCR_L, 0.5, 0.36, 0.72, 0, 0.9), GRAIN, 0.45) +
      glow(k, 60, f(sun[1]), 30, 16, 1) +
      `<path d="${sky}" fill="${P.goldL}" opacity=".85"/>` +
      `<path d="M${arc.join('L')}" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round" transform="translate(.4 .5)"/><path d="M${arc.join('L')}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` +
      `<text x="60" y="${f(sun[1] + 1.2)}" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.ink}" text-anchor="middle">Cielo</text>` +
      tiles +
      `<g transform="translate(${f(tejo[0])} ${f(tejo[1])})">` + k.floor(0.6, 1, 4.6, 1.4, SCR_D) +
      k.draw([{ d: ellipse(0, 0, 3.4, 1.9), fill: P.sky2, inner: k.sh(ellipse(0, 0, 3.4, 1.9), 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<ellipse cx="-1.2" cy="-.8" rx="1.4" ry=".5" fill="#fff" opacity=".8"/>` }], 0.5) + `</g>` +
      `<g transform="translate(82 86) rotate(-28)">` + k.draw([{ d: roundRect(-5, -1.3, 5, 1.3, 1.2), fill: P.white, inner: k.sh(roundRect(-5, -1.3, 5, 1.3, 1.2), 0, 0, 0, 1, 0, 0.7, P.sky2, 0.4) }], 0.45) + `</g>` +
      `<circle cx="76" cy="88" r=".5" fill="#fff"/><circle cx="74.4" cy="86.6" r=".35" fill="#fff"/>` +
      sparkle(60, 22, 3.2, '#fff') + sparkle(36, 44, 1.8, '#fff') + sparkle(86, 46, 1.6, '#fff') +
      k.defs()
    )
  },
}
