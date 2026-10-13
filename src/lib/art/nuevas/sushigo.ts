// Sushi Go!: Tenedor libre, Picante y Postre.
// El color propio del juego es el naranja de su ficha (#F08C00): el fondo granulado, los filetes de los platos y el
// fuego. La comida es comida, sin caritas: el nigiri con su brillo, el wasabi rallado, el flan con su caramelo. Al
// sushiman no se lo dibuja: aparece por su cuchillo y su vincha.
import { f } from '../helpers'
import { ellipse, flame, FLAME, hair, kit, laurel, P, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El naranja de la ficha de Sushi Go!, con su sombra y su luz; el damasco del fondo.
const NAR = '#F08C00', NAR_D = '#B4600A', NAR_L = '#FBC779'
const FONDO = '#F9D6AA', FONDO_G = '#EDB06A'
// La comida: salmón, nori, wasabi, madera de hinoki, caramelo, flan y dulce de leche.
const SALMON = '#F4875E', SALMON_D = '#C4553A', SALMON_L = '#FCD3BC'
const NORI = '#26352D', NORI_L = '#55705F'
const WASABI = '#9DBE3E', WASABI_D = '#62842A', WASABI_L = '#D4E794'
const WOOD = '#E6C18A', WOOD_D = '#B2864D'
const CARAMEL = '#C8701E', CARAMEL_D = '#86400F'
const FLAN = '#F4CA62', FLAN_D = '#D39836'
const DULCE = '#A8652B', DULCE_D = '#6D3B14'
const GINGER = '#F7B8B0'

/** Fondo de Sushi Go!: el papel con el damasco del naranja granulado hacia los bordes. */
const mesa = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(FONDO, 0.5, 0.46, 0.7, 0, 1), FONDO_G, 0.5)

/** Bandeja: un disco damasco con el borde granulado (el escenario de Sushi Go!). */
const bandeja = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FCEEDC"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(FONDO, 0.5, 0.5, 0.5, 0, 1), FONDO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${NAR}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Azar repetible (para los granos de arroz y las miguitas). */
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }

/** Granos de arroz sueltos dentro de una caja (quien llama los recorta a su forma). */
const grains = (x0: number, y0: number, x1: number, y1: number, n: number, seed: number, s = 1) =>
  Array.from({ length: n }, (_, i) => {
    const x = x0 + rnd(seed + i) * (x1 - x0), y = y0 + rnd(seed + i + 500) * (y1 - y0), a = rnd(seed + i + 900) * 180
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.3 * s)}" ry="${f(0.66 * s)}" transform="rotate(${f(a)} ${f(x)} ${f(y)})" fill="${P.white}" stroke="${P.sky2}" stroke-width="${f(0.24 * s)}"/>`
  }).join('')

// ── Sushi ─────────────────────────────────────────────────────────────

type Fish = 'salmon' | 'atun' | 'calamar'
const RICE = 'M-13 1C-13.8 -3.6 -10.6 -7.4 -6 -7.8H6C10.6 -7.4 13.8 -3.6 13 1C12.6 3.6 9 5 0 5C-9 5 -12.6 3.6 -13 1Z'
const SLICE = 'M-16.6 -1.4C-17.6 -6.4 -13.6 -11 -6 -11.8C2 -12.6 11.4 -11.6 15.8 -8C18.2 -6 18 -2.4 16.2 -.4C14 -3.6 8 -5.6 0 -5.8C-8 -6 -13.4 -4 -16.6 -1.4Z'
const SLICE_THIN = 'M-17 -1.6C-17.4 -6 -13 -9.6 -6 -10.2C2 -10.8 11.6 -10 16 -7C18.2 -5.4 18 -2.2 16.4 -.2C14 -3 8 -4.8 0 -5C-8 -5.2 -13.6 -3.6 -17 -1.6Z'

/** Nigiri centrado en (0,0): el bollo de arroz grano por grano y la lonja de pescado encima, con su brillo. */
function nigiri(k: Kit, fish: Fish, seed = 1, w = 0.6, wasabi = false) {
  const c = fish === 'salmon' ? SALMON : fish === 'atun' ? P.red : '#FCFAF5'
  const dk = fish === 'salmon' ? SALMON_D : fish === 'atun' ? P.wine : P.sky2
  const slice = fish === 'calamar' ? SLICE_THIN : SLICE
  const marks =
    fish === 'salmon'
      ? [-12, -6.6, -1.2, 4.2, 9.6].map((x, i) => hair(x - 1, -11.6 + Math.abs(x) * 0.02, x + 1.4, -8.6, x + 3.6 - i * 0.2, -5.4, 1, SALMON_L)).join('') +
        [-9.4, -4, 1.4, 6.8].map((x) => hair(x - 0.6, -11.4, x + 1.6, -8.6, x + 3.4, -5.8, 0.35, SALMON_D, 0.7)).join('')
      : fish === 'atun'
        ? [-10, -3, 4, 11].map((x) => hair(x - 2, -11.6, x + 1, -9, x + 3, -5.8, 0.5, '#F08A8C', 0.55)).join('')
        : Array.from({ length: 11 }, (_, i) => { const x = -17 + i * 3.4; return hair(x, -10.6 + Math.abs(x) * 0.04, x + 1.2, -8.4, x + 2.6, -5.4, 0.4, P.sky, 0.9) }).join('') +
          `<path d="M-16 -2.4C-12 -5 -6 -6.2 0 -6.2C7 -6 13 -4.6 16.6 -1.4" fill="none" stroke="#DCD6EE" stroke-width="1.2" opacity=".8"/>`
  return (
    k.draw([{ d: RICE, fill: P.white, inner: grains(-14, -8, 14, 5.4, 46, seed) + k.sh(RICE, 0, 0, 1, 1, 0, 0.55, P.sky2, 0.35) + k.sh('M-14 1H14V6H-14Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) }], w) +
    (wasabi ? `<path d="M-15.4 -.4C-12 -3.4 -6 -4.8 0 -4.6C6 -4.4 12 -3 15.4 .4L15 1.6C12 -1.4 6 -2.8 0 -3C-6 -3.2 -12 -1.8 -15 .8Z" fill="${WASABI}" stroke="${P.ink}" stroke-width=".35"/>` : '') +
    k.draw([{
      d: slice, fill: c,
      inner:
        marks + k.sh(slice, 0, 0, 1, 1, 0, 0.9, dk, 0.45) + k.sh('M-18 -4H18V0H-18Z', 0, 0, 0, 1, 0, 0.7, dk, 0.3) +
        (fish === 'calamar' ? `<path d="M-18 -1.6C-14 -4.8 -6 -6.4 0 -6.2C6 -6 13 -4.6 18 -.6V2H-18Z" fill="${WASABI}" opacity=".3"/>` : ''),
    }], w) +
    `<path d="M-12.6 -9.4C-7 -11.2 3 -11.6 10 -10.2" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>` +
    `<path d="M12.4 -9.2C13.6 -8.6 14.4 -7.8 14.8 -6.8" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".7"/>`
  )
}

/** Maki parado, centrado en la cara de arriba: el alga, el anillo de arroz y el relleno. */
function maki(k: Kit, filling: string, dk: string, seed = 3, w = 0.5) {
  const side = 'M-6.4 0V6.8C-6.4 8.4 -3.6 9.8 0 9.8C3.6 9.8 6.4 8.4 6.4 6.8V0Z'
  const top = ellipse(0, 0, 6.4, 2.8), rice = ellipse(0, 0, 5.3, 2.2)
  return (
    k.draw([
      { d: side, fill: NORI, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, '#0E1712', 0.5) + `<path d="M-4.8 1.4V8" stroke="${NORI_L}" stroke-width=".9" stroke-linecap="round"/><path d="M-6.4 4.4C-3 5.6 3 5.6 6.4 4.4" fill="none" stroke="#0E1712" stroke-width=".3"/>` },
      { d: top, fill: NORI },
    ], w) +
    `<path d="${rice}" fill="${P.white}"/>` + k.clip(rice, grains(-6, -3, 6, 3, 14, seed, 0.75) + k.sh(rice, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3)) +
    `<path d="${ellipse(0.2, 0.1, 2.3, 1)}" fill="${filling}" stroke="${dk}" stroke-width=".3"/><path d="${ellipse(-0.6, -0.2, 0.8, 0.35)}" fill="#fff" opacity=".6"/>`
  )
}

/** Montañita de wasabi rallado, con la base en (0,0). */
function wasabiDab(k: Kit, s = 1) {
  const d = 'M-7.4 0C-8 -3 -5.6 -4.8 -3.8 -5C-4 -7 -1.8 -8.6 .4 -8.2C2 -10 4.8 -9.2 4.8 -6.8C7 -6.2 8 -3.4 7.4 0C3 1 -3 1 -7.4 0Z'
  return `<g transform="scale(${s})">` + k.draw([{
    d, fill: WASABI,
    inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, WASABI_D, 0.5) + hair(-5.6, -2, -3, -4.4, 0, -4.6, 0.45, WASABI_D) + hair(-2, -5.4, 1, -7.4, 3.4, -6.6, 0.4, WASABI_D) +
      [[-4, -1.6], [-1, -2.6], [2.4, -1.4], [4.6, -3.2], [0.6, -5.4], [-2.6, -4.2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".35" fill="${WASABI_D}"/>`).join('') +
      `<path d="M-5 -3C-4 -4.4 -2.6 -5 -1.4 -5" fill="none" stroke="${WASABI_L}" stroke-width=".7" stroke-linecap="round"/>`,
  }], f(0.45 / s)) + `</g>`
}

/** Fuego verde de wasabi: la llama del kit en cuatro capas de verde, del oscuro al casi blanco. */
function greenFlame(k: Kit, t: string) {
  const layer = (sc: number, fill: string, grain: string) =>
    `<g transform="translate(60 90) scale(${sc}) translate(-60 -90)"><path d="${FLAME}" fill="${fill}"/>${k.shade(FLAME, k.lin(grain, 0, 0, 0, 1, 0, 0.8), grain, 0.3)}</g>`
  return `<g transform="${t}">` + k.draw([{ d: FLAME, fill: WASABI, inner: k.sh(FLAME, 0, 0, 1, 1, 0, 0.7, WASABI_D, 0.4) }], 1.8) +
    layer(0.78, '#C4DC66', WASABI) + layer(0.56, '#E6F3A4', '#C4DC66') + layer(0.32, '#FFFBE2', WASABI_L) + `</g>`
}

/** Farolito chino de papel rojo, colgado de su hilo, con la borla dorada. Centro en (0,0). */
function lantern(k: Kit, s = 1) {
  const body = ellipse(0, 0, 6.4, 5.2)
  return `<g transform="scale(${s})">` +
    `<path d="M0 -14V-6" stroke="${P.ink}" stroke-width=".5"/>` +
    k.draw([{
      d: body, fill: P.red,
      inner: k.sh(body, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + [-4.2, -2, 0, 2, 4.2].map((x) => `<path d="M${x} -5.2C${f(x * 1.5)} -2 ${f(x * 1.5)} 2 ${x} 5.2" fill="none" stroke="${P.wine}" stroke-width=".35"/>`).join('') +
        `<ellipse cx="-2.6" cy="-2" rx="1.6" ry="2.4" fill="${NAR_L}" opacity=".55"/>`,
    }], f(0.45 / s)) +
    `<rect x="-2.6" y="-6.2" width="5.2" height="1.6" rx=".4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><rect x="-2.6" y="4.6" width="5.2" height="1.6" rx=".4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
    `<path d="M-.9 6.2L-1.4 11H1.4L.9 6.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M-.5 7V10.6M.5 7V10.6" stroke="${P.goldD}" stroke-width=".25"/>` +
    `</g>`
}

export const SUSHIGO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Tenedor libre ──────────────────────────────────────────────────

  // Cuarenta puntos: ya agarrás los palitos sin el elástico. El nigiri de salmón en el aire y el elástico, jubilado.
  'Palitos de madera': (u) => {
    const k = kit(u)
    const upper = taper(97, 25.6, 80, 38, 62.6, 51.2, 3, 1.3)
    const lower = taper(100.4, 31, 84, 50, 67, 69.4, 3, 1.3)
    const grain = (x0: number, y0: number, x1: number, y1: number) => hair(x0, y0, (x0 + x1) / 2 + 0.4, (y0 + y1) / 2 + 0.3, x1, y1, 0.3, WOOD_D, 0.9)
    return (
      mesa(k) +
      bandeja(k, 60, 62, 33) +
      k.floor(55, 88, 20, 2.6, NAR_D) +
      // El elástico de practicar, tirado en la mesa.
      `<g transform="translate(41 85.6) rotate(-12)"><path d="M-6 0C-6 -2.6 -2 -3.4 1 -3C4.6 -2.6 6.6 -1.4 6.2 .6C5.8 2.6 2 3.2 -1.4 2.8C-4.4 2.4 -6 1.6 -6 0Z" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M-6 0C-6 -2.6 -2 -3.4 1 -3C4.6 -2.6 6.6 -1.4 6.2 .6C5.8 2.6 2 3.2 -1.4 2.8C-4.4 2.4 -6 1.6 -6 0Z" fill="none" stroke="${NAR}" stroke-width=".9"/><path d="M-4.4 -1.6C-2.6 -2.6 0 -2.8 2 -2.4" fill="none" stroke="${NAR_L}" stroke-width=".35"/></g>` +
      hair(32.6, 81, 31, 79, 29.6, 76, 0.45, NAR_D) + hair(35.6, 79, 35, 76.4, 35.2, 73.6, 0.45, NAR_D) +
      // El nigiri, levantado.
      `<g transform="translate(53.4 62) rotate(-12) scale(1.22)">` + nigiri(k, 'salmon', 7, 0.5) + `</g>` +
      // Los palitos de madera, pellizcando el nigiri.
      k.draw([{ d: lower, fill: WOOD, inner: k.sh(lower, 0, 0, 0, 1, 0, 0.8, WOOD_D, 0.4) + grain(97, 33, 82, 50) + grain(92, 38, 76, 55) }], 0.6) +
      k.draw([{ d: upper, fill: WOOD, inner: k.sh(upper, 0, 0, 0, 1, 0, 0.8, WOOD_D, 0.4) + grain(94, 27, 80, 37) + grain(88, 33, 72, 43) + `<path d="M95 25.4L70 45.4" stroke="#FFF3DC" stroke-width=".5" stroke-linecap="round"/>` }], 0.6) +
      sparkle(46.6, 50.8, 2.4, '#fff') + sparkle(32, 46, 1.8) + sparkle(84, 76, 1.5) +
      k.defs()
    )
  },

  // Cincuenta y cinco: te traen la barca entera a la mesa. El barco de madera cargado, sobre las olas de seigaiha.
  'Barco de sushi': (u) => {
    const k = kit(u)
    const hull = 'M26 50C29 56 33.4 61 40 64L92.4 63.6C94.2 63.6 95.4 64.8 95 66.6L93.6 73.6C93 77.4 90 80 86 80H48C40 80 33 75 29.6 68C27.6 63 26.6 56.6 26 50Z'
    const deck = 'M26 50C32 54 37 55.6 42 55.8L93 55.2C95 55.2 96.4 56.8 95.6 58.8L92.4 63.6H40C33.4 61 29 56 26 50Z'
    const prow = 'M26 50.4C24.4 46.4 24.4 42 26.8 39.8C28.8 38 31.8 39 31.6 41.4C31.4 43.2 29.4 43.8 28.4 42.6C29.2 45.2 29.8 47.8 30 50.8Z'
    const disc = ellipse(60, 62, 33, 33)
    const waves = Array.from({ length: 10 }, (_, j) => Array.from({ length: 10 }, (_, i) => {
      const x = 20 + i * 9 + (j % 2) * 4.5, y = 32 + j * 4.6
      return `<path d="M${f(x - 4.5)} ${y}A4.5 4.5 0 0 1 ${f(x + 4.5)} ${y}" fill="${P.sky1}" stroke="${P.blue}" stroke-width=".55"/>` +
        [3.2, 2].map((r) => `<path d="M${f(x - r)} ${y}A${r} ${r} 0 0 1 ${f(x + r)} ${y}" fill="none" stroke="${P.sky}" stroke-width=".45"/>`).join('')
    }).join('')).join('')
    const planks = [68, 72, 76].map((y) => hair(31 + (y - 68) * 0.9, y, 62, y + 0.6, 93.4, y - 0.4, 0.4, WOOD_D)).join('')
    return (
      mesa(k) +
      `<circle cx="60" cy="62" r="33" fill="${P.sky1}"/>` + k.clip(disc, waves) + k.shade(disc, k.rad(P.sky2, 0.5, 0.5, 0.5, 0.2, 1), '#9EB1DB', 0.45) +
      `<circle cx="60" cy="62" r="33" fill="none" stroke="${NAR}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.floor(61, 82, 30, 3, P.mid) +
      k.draw([
        { d: prow, fill: WOOD, inner: k.sh(prow, 0, 0, 1, 0, 0, 0.8, WOOD_D, 0.45) },
        { d: hull, fill: WOOD, inner: k.sh(hull, 0, 0, 1, 1, 0, 0.85, WOOD_D, 0.5) + planks + `<path d="M31.6 64C36.6 70 42 72.6 49 73.6" fill="none" stroke="#FFF3DC" stroke-width=".8" stroke-linecap="round" opacity=".85"/>` + hair(85, 66, 90, 70, 91, 76, 0.4, P.brownD) },
        { d: deck, fill: '#D1A66C', inner: k.sh(deck, 0, 0, 0, 1, 0, 0.7, WOOD_D, 0.45) + [42, 54, 66, 78, 90].map((x) => `<path d="M${x} 55.6L${x - 1.4} 63.6" stroke="${WOOD_D}" stroke-width=".35"/>`).join('') },
      ], 0.7) +
      // El cordón naranja de la borda y la soga de la proa.
      `<path d="M27 51.4C33 55.6 38 57.6 42 57.8L93.6 57.2" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M27 51.4C33 55.6 38 57.6 42 57.8L93.6 57.2" fill="none" stroke="${NAR}" stroke-width=".8" stroke-linecap="round" stroke-dasharray="1.4 .5"/>` +
      `<path d="M25.6 44.6L29.6 45M25.4 46.8L29.8 47.2" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M25.6 44.6L29.6 45M25.4 46.8L29.8 47.2" stroke="${NAR}" stroke-width=".7" stroke-linecap="round"/>` +
      // La carga: wasabi y jengibre en la proa, dos nigiris y dos makis.
      `<g transform="translate(35.4 60.2)">` + wasabiDab(k, 0.72) + `</g>` +
      `<path d="M39.6 60.6C39 58 41 56.6 43 57.4C44.4 56 46.8 57 46.4 59C47.6 60 47 61.6 45.4 61.6H40.6Z" fill="${GINGER}" stroke="${P.ink}" stroke-width=".4"/><path d="M41.4 59.4C42.4 58.6 43.6 58.6 44.4 59.4" fill="none" stroke="#E08E88" stroke-width=".35"/>` +
      `<g transform="translate(55.2 59.6) rotate(-4) scale(.68)">` + nigiri(k, 'salmon', 21, 0.9) + `</g>` +
      `<g transform="translate(72.4 59.4) rotate(3) scale(.68)">` + nigiri(k, 'atun', 41, 0.9) + `</g>` +
      `<g transform="translate(84 54.4)">` + maki(k, SALMON, SALMON_D, 5) + `</g>` +
      `<g transform="translate(91 57.4) scale(.9)">` + maki(k, '#7FB04A', WASABI_D, 9) + `</g>` +
      sparkle(84, 38, 2.2, '#fff') + sparkle(40, 42, 1.6, '#fff') +
      k.defs()
    )
  },

  // Setenta puntos: abriste tu local en el barrio chino. El cuchillo del sushiman con la vincha atada, entre farolitos.
  'Sushiman de Belgrano': (u) => {
    const k = kit(u)
    const blade = 'M56.6 64.4V27.6C56.6 23.6 58.2 20.6 60.8 19C62.2 23 63.6 30 63.8 38V64.4Z'
    const bevel = 'M60.8 19C62.2 23 63.6 30 63.8 38V64.4H61.6V38.6C61.4 31 60.8 24.6 60.8 19Z'
    const ferrule = 'M56.2 64.2H64.2L64.6 69.4H55.8Z'
    const handle = 'M55.8 69.4H64.6L64 94.4C64 95.4 63.2 96 62.2 96H58.2C57.2 96 56.4 95.4 56.4 94.4Z'
    const band = 'M41.6 48.4C48 46.4 56 45.4 64 45.6C70 45.8 75 46.6 78.8 47.8V53.4C75 52.2 70 51.4 64 51.2C56 51 48 52 41.6 54Z'
    const tailA = 'M78.8 47.8C82 47.4 85.6 45.6 88.4 42.6L87 47L90.6 48.8C87 50.6 82.6 51.8 78.8 53.4Z'
    const tailB = 'M41.6 48.4C38.6 49.8 35.4 52.4 33.4 55.8L37.2 55.4L35.8 59.6C38 57 40 55 41.6 54Z'
    const knot = ellipse(79.4, 50.6, 2.4, 3.2)
    const rid = k.id('vincha')
    return (
      mesa(k) +
      k.sun(60, 54, 16, 47, 32, false) +
      k.shade(ellipse(60, 52, 24, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(52, 99, 31, 90, 27, 62, 8) + laurel(68, 99, 89, 90, 93, 62, 8, true) +
      // Los farolitos del barrio chino.
      `<path d="M22 30Q40 37 60 34Q80 37 98 30" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<g transform="translate(35.4 45.4)">` + lantern(k, 0.95) + `</g><g transform="translate(84.6 45.4)">` + lantern(k, 0.95) + `</g>` +
      k.cast([blade, handle], 2.2, 2, P.mid) +
      k.draw([
        {
          d: handle, fill: WOOD,
          inner: `<path d="M61.4 68H66V97H61.4Z" fill="#D3A86E"/><path d="M63.4 68H66V97H63.4Z" fill="${WOOD_D}"/>` + k.sh(handle, 0, 0, 1, 0, 0, 0.6, WOOD_D, 0.35) +
            `<path d="M58.4 69.4L58.6 96M61.4 69.4V96M63.4 69.4L63.2 96" stroke="${P.brownD}" stroke-width=".3" opacity=".7"/>` + hair(57.3, 72, 57.5, 82, 57.3, 93, 0.6, '#FFF3DC') +
            hair(59.6, 74, 60, 80, 59.8, 86, 0.3, WOOD_D) + hair(60, 86, 60.2, 90, 59.8, 94, 0.3, WOOD_D) + hair(62.2, 72, 62.4, 78, 62.2, 84, 0.3, P.brownD),
        },
        { d: ferrule, fill: P.night, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.6, '#0F1736', 0.4) + `<path d="M56.8 65.2H63.6" stroke="${P.mid}" stroke-width=".6"/>` + hair(57, 66.6, 57.2, 68, 57.1, 69, 0.5, P.sky, 0.8) },
        {
          d: blade, fill: P.sky1,
          inner:
            `<path d="M56 18H58.8V66H56Z" fill="${P.white}"/>` + `<path d="${bevel}" fill="${P.sky}"/>` + k.sh(bevel, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) +
            k.sh('M58.8 20H61.6V66H58.8Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + k.shade('M56 40H64V52H56Z', k.lin(P.goldL, 0, 0, 0, 1, 0, 0.8), P.gold, 0.25),
        },
      ], 0.7) +
      `<path d="M61.6 38.6V64.4" stroke="${P.blue}" stroke-width=".35"/>` +
      // El temple: la línea ondulada del filo, y el brillo de espejo de la hoja.
      `<path d="M62.6 27C62.2 30 63 33 62.4 36.4C62 39.6 63 42.6 62.4 46.4C62 50 63 53.4 62.6 57" fill="none" stroke="#fff" stroke-width=".55" opacity=".9"/>` +
      `<path d="M63.2 40V64.4" stroke="${P.white}" stroke-width=".35" opacity=".7"/>` +
      hair(57.6, 25, 57.4, 44, 57.6, 63, 1.1, '#fff') + hair(59.6, 30, 59.6, 40, 59.8, 50, 0.4, P.sky, 0.8) +
      // La marca del herrero: un pez dentro de un círculo, grabado en oro.
      `<circle cx="59" cy="59.4" r="1.9" fill="none" stroke="${P.goldD}" stroke-width=".45"/><path d="M57.8 59.4C58.4 58.6 59.4 58.6 60 59.4C59.4 60.2 58.4 60.2 57.8 59.4ZM60 59.4L60.6 58.8V60Z" fill="${P.goldD}"/>` +
      // La vincha del sushiman, atada a la hoja.
      k.draw([{ d: tailB, fill: P.white, inner: k.sh(tailB, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) + hair(40, 50, 37, 52.6, 35, 56, 0.4, P.blue) }], 0.5) +
      k.draw([{ d: band, fill: P.white, inner: k.sh(band, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M41.6 49.6C48 47.6 56 46.6 64 46.8C70 47 75 47.8 78.8 49M41.6 52.8C48 50.8 56 49.8 64 50C70 50.2 75 51 78.8 52.2" fill="none" stroke="${NAR}" stroke-width=".55"/>` }], 0.55) +
      `<path id="${rid}" d="M44 51.6C50 49.8 57 49 64 49.2C69 49.4 73 50 76.4 50.8" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">Belgrano</textPath></text>` +
      k.draw([{ d: tailA, fill: P.white, inner: k.sh(tailA, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) + hair(80, 49, 84, 47.6, 88, 45, 0.4, P.blue) }, { d: knot, fill: P.white, inner: k.sh(knot, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) }], 0.5) +
      `<path d="M78.4 48.6C79.4 50 79.4 51.4 78.6 52.8" fill="none" stroke="${NAR}" stroke-width=".55"/>` +
      sparkle(60.8, 19.6, 3.4, '#fff') + sparkle(88, 66, 1.8) + sparkle(32, 70, 1.6) +
      k.defs()
    )
  },

  // ── Picante ────────────────────────────────────────────────────────

  // Tres calamares con wasabi: te cae una lagrimita de orgullo sobre el nigiri de calamar, en su tablita de madera.
  'Lágrima de wasabi': (u) => {
    const k = kit(u)
    const top = 'M28.6 77.4L40.6 69.4H92.4L80.4 77.4Z', front = 'M28.6 77.4H80.4V81.8H28.6Z', side = 'M80.4 77.4L92.4 69.4V73.8L80.4 81.8Z'
    const drop = 'M0 -11C3.4 -5.6 6.6 -1.4 6.6 3C6.6 6.8 3.6 9.6 0 9.6C-3.6 9.6 -6.6 6.8 -6.6 3C-6.6 -1.4 -3.4 -5.6 0 -11Z'
    return (
      mesa(k) +
      bandeja(k, 60, 62, 33) +
      k.floor(60, 82.6, 30, 2.6, NAR_D) +
      k.draw([
        { d: side, fill: WOOD_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.4) },
        { d: front, fill: '#D3A86E', inner: k.sh(front, 0, 0, 1, 0, 0, 0.6, WOOD_D, 0.4) },
        { d: top, fill: WOOD, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, WOOD_D, 0.4) + hair(36, 75.6, 58, 75.2, 78, 75.8, 0.35, WOOD_D) + hair(42, 71.4, 64, 71, 86, 71.4, 0.35, WOOD_D) + hair(34, 73.4, 50, 73.2, 66, 73.6, 0.3, WOOD_D) },
      ], 0.6) +
      k.floor(60, 74.2, 18, 2, WOOD_D) +
      `<g transform="translate(60 67.6) scale(1.18)">` + nigiri(k, 'calamar', 13, 0.5, true) + `</g>` +
      // La lágrima, que cae.
      hair(58.4, 21, 58.2, 25, 58.6, 28, 0.5, P.blue) + hair(61.6, 22, 61.8, 25.6, 61.4, 28.4, 0.4, P.blue) +
      `<g transform="translate(60 40)">` +
      k.draw([{ d: drop, fill: P.sky1, inner: k.shade(drop, k.rad(P.sky, 0.6, 0.65, 0.6, 0.95, 0.1), P.sky, 0.4) + `<path d="M-4.6 4.4C-4 7.4 -1.4 8.4 1.6 8" fill="none" stroke="${WASABI}" stroke-width="1" stroke-linecap="round" opacity=".8"/>` }], 0.6) +
      `<path d="M-2.6 -3C-4 -.6 -4.4 1.6 -4 3.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><circle cx="-1.2" cy="-5" r=".7" fill="#fff"/>` +
      `</g>` +
      sparkle(70.6, 33.6, 2, P.goldL) + sparkle(35, 50, 1.6) + sparkle(86, 54, 1.4) +
      k.defs()
    )
  },

  // Doce combos picantes: te sale fuego por la nariz. El wasabi de la casa, en su platito de loza, prendido fuego.
  'Nariz en llamas': (u) => {
    const k = kit(u)
    const dish = ellipse(60, 82.4, 27, 7.2)
    const well = ellipse(60, 81.6, 20, 4.8)
    // El wasabi rallado, armado en montañita, que entra en erupción.
    const mound = 'M39.6 81C43.4 76.4 47.4 70.4 50.8 64C52.8 60.2 54.6 56.6 56.2 54.4C57.6 53.6 62.4 53.6 63.8 54.4C65.4 56.6 67.2 60.2 69.2 64C72.6 70.4 76.6 76.4 80.4 81C70.6 83.6 49.4 83.6 39.6 81Z'
    const crater = ellipse(60, 54.6, 3.8, 1.2)
    const ridges =
      hair(55.4, 56, 51, 66, 44, 78.6, 0.6, WASABI_D) + hair(58, 56.6, 56.4, 68, 52.6, 81.4, 0.5, WASABI_D) + hair(62.4, 56.6, 64, 68, 67.4, 81.4, 0.55, WASABI_D) +
      hair(64.8, 56, 69.4, 66, 76, 78.6, 0.6, WASABI_D) + hair(60.2, 57, 60, 69, 60.4, 82, 0.4, WASABI_D)
    const flecks = Array.from({ length: 40 }, (_, i) => {
      const t = rnd(i + 70), y = 56 + t * 25, half = 4 + t * 16
      return `<circle cx="${f(60 + (rnd(i + 170) * 2 - 1) * half)}" cy="${f(y)}" r="${f(0.22 + rnd(i + 270) * 0.3)}" fill="${i % 3 ? WASABI_D : WASABI_L}"/>`
    }).join('')
    const waves = Array.from({ length: 7 }, (_, i) => `<path d="M${36 + i * 7} 85.4q1.75 -1.4 3.5 0t3.5 0" fill="none" stroke="${P.white}" stroke-width=".45"/>`).join('')
    const drip = (x: number, y: number, l: number) => `<path d="M${x - 1.1} ${y}C${x - 1.2} ${y + l * 0.6} ${x - 0.8} ${y + l} ${x} ${y + l}C${x + 0.8} ${y + l} ${x + 1.2} ${y + l * 0.6} ${x + 1.1} ${y}Z" fill="${NAR}" stroke="${P.ink}" stroke-width=".35"/>`
    return (
      mesa(k) +
      k.shade(ellipse(60, 52, 30, 30), k.rad(NAR_L, 0.5, 0.5, 0.5, 0.9, 0), NAR, 0.4) +
      k.floor(61, 88, 28, 2.6, NAR_D) +
      k.draw([{ d: dish, fill: P.mid, inner: k.sh(dish, 0, 0, 1, 1, 0, 0.9, P.night, 0.5) + `<path d="${ellipse(60, 82, 24.6, 6)}" fill="none" stroke="${P.white}" stroke-width=".7"/>` + waves }], 0.6) +
      `<path d="${well}" fill="${P.white}"/>` + k.sh(well, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) +
      // El fuego que sale del cráter.
      flame(k, 'translate(60 57.4) scale(.44) translate(-60 -90)') +
      k.draw([{
        d: mound, fill: WASABI,
        inner:
          k.sh(mound, 0, 0, 1, 0, 0, 0.95, WASABI_D, 0.5) + `<path d="M38 52H52V84H38Z" fill="${k.lin(WASABI_L, 0, 0, 1, 0, 0.6, 0)}"/>` + k.sh('M38 76H82V84H38Z', 0, 0, 0, 1, 0, 0.6, WASABI_D, 0.35) +
          ridges + flecks + k.shade('M50 52H70V64H50Z', k.lin(NAR, 0, 0, 0, 1, 0.85, 0), NAR, 0.35),
      }], 0.75) +
      `<path d="${crater}" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><path d="${ellipse(60, 54.7, 2.4, 0.6)}" fill="${P.goldL}"/>` +
      drip(56.4, 55, 4.6) + drip(63.2, 55.2, 3.4) + drip(59.4, 55.6, 2.4) +
      `<path d="M49.6 70C51.4 64.6 53.6 60 55.6 56.6" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>` +
      // El calor que tiembla a los costados y las chispas.
      hair(38, 66, 33, 59, 37, 51, 0.8, P.blue) + hair(34.4, 68, 29, 61, 31.4, 53.6, 0.6, P.blue) + hair(82, 66, 87, 59, 83, 51, 0.8, P.blue) + hair(85.6, 68, 91, 61, 88.6, 53.6, 0.6, P.blue) +
      [[42, 40, 0.8], [79, 38, 0.7], [47, 30, 0.6], [73, 28, 0.7], [37, 50, 0.5], [84, 48, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.goldD}"/>`).join('') +
      sparkle(88, 74, 1.8) + sparkle(31, 75, 1.5) +
      k.defs()
    )
  },

  // Treinta y cinco combos: escupís fuego verde como en el Año Nuevo chino. El dragón de la fiesta, con su fuego de wasabi.
  'Dragón de wasabi': (u) => {
    const k = kit(u)
    const neck = 'M2 2C12 6 20 16 24 30C26 38 27 46 27 60H4C4 50 3 40 0 32C-2 26 -4 20 -8 14Z'
    const snout = 'M-26 -1.6C-27.4 -5.6 -24.6 -9.4 -20.4 -9.2C-17.6 -11.8 -12.4 -12 -9.4 -10.4C-4.4 -13.8 3.6 -14.4 9 -11.4C13.4 -9 15.6 -4.4 14.6 -.2C13.6 3 9.4 4.4 4.4 3.8L-23.6 3C-25.6 2.8 -26.4 .6 -26 -1.6Z'
    const jaw = 'M-22.4 6.6C-16 8 -8 8.2 0 7.4C6 6.8 10.4 7.4 12.4 9.8C13.4 12.4 10.4 14.8 6.2 15C-2 15.4 -12 15.2 -18 13.8C-22 12.8 -24.2 9.6 -22.4 6.6Z'
    const mouth = 'M-23.6 3C-16 3.4 -6 3.8 4.4 3.8C8 3.8 11 5 12.4 9.8C10.4 7.4 6 6.8 0 7.4C-8 8.2 -16 8 -22.4 6.6Z'
    const horn = 'M6 -12C10 -18 16 -23 24 -26.4C21.6 -24 20 -21.6 19.6 -19.4C22 -21 25 -22 28.4 -22C24.4 -19.4 20.6 -15.6 17.6 -10.6Z'
    const horn2 = 'M0 -13C1.6 -18.6 4.6 -23.4 9.6 -27C8 -24 7.4 -21.4 7.6 -18.6C9 -20.6 11 -22 13.6 -22.6C10.6 -19.6 8.4 -16 7.4 -12Z'
    const brow = 'M-10.4 -10C-7 -14 -1 -15.6 4.6 -13.4C2 -12.2 -.6 -11.6 -3 -10.8C-5.4 -10 -8 -9.6 -10.4 -10Z'
    const mane = Array.from({ length: 8 }, (_, i) => {
      const t = i / 7, x = 12 + t * 13, y = -9 + t * 34, a = -34 + t * 46
      return `<path d="M0 0C3 -4.4 8.4 -6.6 14 -6C10.4 -3.8 9.6 -1.2 11.4 1.8C7.4 .6 3.6 1.4 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(1.15 - t * 0.35)})"/>`
    }).join('')
    const teethUp = [-21.6, -16.4, -11, -5.6].map((x, i) => `M${x} ${f(3.2 + i * 0.1)}L${f(x + (i === 0 ? 1.3 : 0.9))} ${f(i === 0 ? 7.4 : 5.8)}L${f(x + (i === 0 ? 2.6 : 1.8))} ${f(3.3 + i * 0.1)}Z`).join('')
    const teethDn = [-19, -13, -7.4].map((x, i) => `M${x} ${f(7.6 - i * 0.2)}L${f(x + 1)} ${f(i === 0 ? 3.6 : 4.8)}L${f(x + 2)} ${f(7.5 - i * 0.2)}Z`).join('')
    const scales = Array.from({ length: 16 }, (_, i) => { const r = Math.floor(i / 4), c = i % 4, x = 8 + c * 4.4 + r * 3.2, y = 10 + r * 9 + c * 1.8; return `<path d="M${f(x)} ${f(y)}q1.7 2.1 3.5 0" fill="none" stroke="${NAR_D}" stroke-width=".55"/>` }).join('')
    const whisker = (d: [number, number, number, number, number, number], w: number) => `<path d="${taper(...d, w, 0.35)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    return (
      mesa(k) +
      k.sun(56, 54, 14, 48, 32, false) +
      k.shade(ellipse(52, 54, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      // Las chispas de la fiesta de Año Nuevo.
      [[34, 30, P.red], [86, 26, NAR], [30, 84, NAR], [44, 92, P.red]].map(([x, y, c]) => `<path d="M${x} ${f(+y - 2.6)}V${f(+y + 2.6)}M${f(+x - 2.6)} ${y}H${f(+x + 2.6)}" stroke="${c}" stroke-width=".8" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r=".8" fill="${P.goldL}"/>`).join('') +
      // El fuego de wasabi, que sale de la boca hacia la izquierda.
      k.shade(ellipse(36, 55, 16, 14), k.rad(WASABI_L, 0.5, 0.5, 0.5, 0.9, 0), WASABI, 0.4) +
      greenFlame(k, 'translate(50.6 55.6) rotate(-84) scale(.4 .4) translate(-60 -90)') +
      [[26.6, 44.6, 0.9], [28, 67.4, 0.7], [33.6, 70.4, 0.6], [32.4, 40.4, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${WASABI_L}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      // La cabeza del dragón de la fiesta.
      `<g transform="translate(68.4 51.6) scale(.84)">` +
      k.cast([neck], 2.4, 2, P.mid) +
      `<g fill="${P.gold}" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round">${mane}</g>` +
      k.draw([{
        d: neck, fill: NAR,
        inner: k.sh(neck, 0, 0, 1, 0, 0, 0.9, NAR_D, 0.5) + `<path d="M-6 13C0 19 5 31 7 62H15C13 34 9 19 0 11Z" fill="${P.goldL}"/>` + k.sh('M-6 13C0 19 5 31 7 62H15C13 34 9 19 0 11Z', 0, 0, 1, 0, 0.1, 0.8, P.goldD, 0.45) +
          [17, 23, 29, 35, 41, 47, 53].map((y, i) => `<path d="M${f(i * 1.2)} ${y}Q${f(4 + i * 1.4)} ${y + 2} ${f(9 + i * 1.4)} ${y - 0.6}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`).join('') + scales,
      }], 0.85) +
      k.draw([
        { d: horn2, fill: P.goldL, inner: k.sh(horn2, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + hair(2, -14, 4.6, -19, 8.4, -24.6, 0.35, P.goldD) },
        { d: horn, fill: P.white, inner: k.sh(horn, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + hair(9, -13, 15, -18, 22, -23, 0.4, P.goldD) },
        { d: jaw, fill: NAR, inner: k.sh(jaw, 0, 0, 0, 1, 0.1, 0.95, NAR_D, 0.5) + `<path d="M-20 12C-12 13.6 0 13.8 10 12.6V16H-20Z" fill="${P.goldL}"/>` + hair(-16, 10.4, -6, 10.2, 6, 10, 0.45, NAR_D) },
      ], 0.85) +
      `<path d="${mouth}" fill="${P.wine}"/><path d="M-14 5.6C-8 6.6 -2 6.4 4 5.8" fill="none" stroke="${P.red}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<path d="${teethUp}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="${teethDn}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{
        d: snout, fill: NAR,
        inner: k.sh(snout, 0, 0, 0, 1, 0.05, 0.95, NAR_D, 0.5) + `<path d="M-27 -14H15V-5C4 -8 -12 -7 -27 -3Z" fill="${k.lin(NAR_L, 0, 0, 0, 1, 0.6, 0)}"/>` +
          hair(-18, -3.6, -12, -5, -6, -4.4, 0.45, NAR_D) + hair(0, -1, 6, -1.4, 11, -4, 0.45, NAR_D) + hair(6, -10.6, 10, -9.6, 13, -6.6, 0.4, NAR_D) +
          `<path d="M-14 -.6q1.6 1.6 3.4 0M-9 0q1.6 1.6 3.4 0M-4 .4q1.6 1.6 3.4 0M1 .6q1.6 1.6 3.4 0" fill="none" stroke="${NAR_D}" stroke-width=".45"/>`,
      }], 0.85) +
      // La nariz enrulada, la ceja de fuego y el ojo amarillo de pupila fina.
      `<path d="M-21.6 -9.4C-24 -11.6 -23.4 -14.6 -20.8 -14.8C-18.6 -15 -17.6 -12.6 -19.2 -11.6" fill="none" stroke="${P.ink}" stroke-width="1.9" stroke-linecap="round"/><path d="M-21.6 -9.4C-24 -11.6 -23.4 -14.6 -20.8 -14.8C-18.6 -15 -17.6 -12.6 -19.2 -11.6" fill="none" stroke="${P.gold}" stroke-width=".85" stroke-linecap="round"/>` +
      `<path d="M-22.6 -4.2c.6 -.9 1.8 -1.1 2.6 -.4" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([{ d: brow, fill: P.red, inner: k.sh(brow, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + hair(-8, -10.6, -3, -12.8, 3, -13, 0.35, P.goldL) }], 0.4) +
      `<path d="M-7.2 -7.4C-5.2 -9.8 -1.2 -10 .8 -7.8C-1.2 -5.8 -5.2 -5.6 -7.2 -7.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><path d="M-3.2 -9.4V-6" stroke="${P.ink}" stroke-width=".95" stroke-linecap="round"/><circle cx="-4.6" cy="-8.4" r=".45" fill="#fff"/>` +
      // Los bigotes largos y la barba.
      whisker([-17.4, 0.6, -24, 14, -35, 13], 1.6) + whisker([-12, 1.4, -13, 18, -22, 26], 1.3) + whisker([-20.6, -8, -32, -14, -28, -25], 1.2) +
      `<g fill="${P.gold}" stroke="${P.ink}" stroke-width=".45">` + [[-12, 14.8, 196], [-6, 15.2, 210], [0, 15, 224], [5.6, 14.4, 236]].map(([x, y, a]) => `<path d="M0 0C2 -1.2 5.4 -1.2 7.6 .6C5.4 .9 3 1.6 0 0Z" transform="translate(${x} ${y}) rotate(${a}) scale(1.15)"/>`).join('') + `</g>` +
      `</g>` +
      k.defs()
    )
  },

  // ── Postre ─────────────────────────────────────────────────────────

  // Tres veces con más pudding: el flan casero, mixto, con su caramelo que chorrea, dulce de leche y crema.
  'Flan con dulce': (u) => {
    const k = kit(u)
    const plate = ellipse(60, 82.6, 29, 7.6)
    const pool = 'M40 82.4C38 79.6 44 77.4 52 77C60 76.6 70 77 76 78.4C80.4 79.4 80.4 82 77 83.2C70 85.2 50 85.4 43 84C41.4 83.6 40.4 83 40 82.4Z'
    const body = 'M47.2 54.6C46.6 63.6 45.6 72 44.2 80.2C49 82.8 71 82.8 75.8 80.2C74.4 72 73.4 63.6 72.8 54.6Z'
    const topF = ellipse(60, 54.6, 12.8, 3.3)
    const drip = 'M46.8 54.6C46.6 58 46.4 61 46.2 63C46.2 65 48.6 65 48.8 63C49 61.4 49.6 60.6 50.4 61.4C51 62.6 50.6 66.4 51 68C51.4 70 54 70 54.2 68C54.4 65 54.6 62.6 55.6 62.4C56.6 62.4 56.8 63.6 57 64.6C57.2 66 59.4 66 59.6 64.4C59.8 62.4 60.6 61.6 61.6 62.4C62.4 63.4 62.4 67 62.8 69.4C63.2 71.4 65.8 71.2 66 69.2C66.2 66.4 66.6 63.4 67.6 62.8C68.6 62.4 69 63.6 69.2 64.8C69.4 66.4 71.6 66.2 71.8 64.6C72.2 62 72.6 58 73.2 54.6Z'
    const dulce = 'M30.6 82.4C29.4 78.8 33 75.6 38 75.4C43.4 75.2 47 77.6 46.6 80.8C46.2 83.6 41.6 84.8 36.8 84.6C33.2 84.4 31 83.6 30.6 82.4Z'
    const crema = 'M73.6 82.6C72.2 80.6 73.4 78 75.6 77.6C75.2 75.2 77.6 73.2 80 73.8C80.6 71.6 83.6 71.2 84.8 73.4C87.2 73.2 88.6 75.8 87.6 77.8C89.6 79.4 88.6 82.6 86.4 83C82.4 84 77 84 73.6 82.6Z'
    const bubbles = [[51, 74, 0.6], [56, 77.4, 0.45], [64.6, 75.6, 0.55], [69.4, 78, 0.4], [53.4, 71.4, 0.35], [67, 72, 0.35]]
    return (
      mesa(k) +
      bandeja(k, 60, 62, 33) +
      k.floor(61, 87.6, 27, 2.6, NAR_D) +
      k.draw([{ d: plate, fill: P.white, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + `<path d="${ellipse(60, 82.4, 26.6, 6.4)}" fill="none" stroke="${NAR}" stroke-width="1"/><path d="${ellipse(60, 82.4, 25, 5.7)}" fill="none" stroke="${NAR}" stroke-width=".35"/>` }], 0.6) +
      k.draw([{ d: pool, fill: CARAMEL, inner: k.sh(pool, 0, 0, 1, 1, 0, 0.9, CARAMEL_D, 0.5) + `<path d="M46 79.6C52 78.4 62 78.2 70 79" fill="none" stroke="${NAR_L}" stroke-width=".7" stroke-linecap="round"/>` }], 0.4) +
      k.draw([
        {
          d: body, fill: FLAN,
          inner:
            k.sh('M64 52C70 62 72 72 70 84H80V52Z', 0, 0, 1, 0, 0, 0.9, FLAN_D, 0.5) + k.sh('M42 74H78V84H42Z', 0, 0, 0, 1, 0, 0.6, FLAN_D, 0.35) +
            `<path d="${drip}" fill="${CARAMEL}"/>` + k.sh(drip, 0, 0, 1, 0, 0, 0.9, CARAMEL_D, 0.5) +
            bubbles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${FLAN_D}" opacity=".7"/>`).join('') +
            hair(48.6, 66, 47.6, 72, 47.4, 78, 1.2, '#FFF4D6') + hair(48.4, 56, 48.2, 59, 48.2, 62, 0.9, NAR_L),
        },
        { d: topF, fill: CARAMEL_D, inner: k.sh(topF, 0, 0, 1, 1, 0, 0.8, '#5A2808', 0.4) + `<path d="M50.4 54C54 52.6 62 52.4 67 53.4" fill="none" stroke="${NAR_L}" stroke-width=".9" stroke-linecap="round"/>` },
      ], 0.7) +
      // El mixto: dulce de leche y crema.
      k.draw([{ d: dulce, fill: DULCE, inner: k.sh(dulce, 0, 0, 1, 1, 0, 0.9, DULCE_D, 0.5) + hair(33, 80.4, 38, 77.6, 44, 78.4, 0.6, '#D49A5E') + hair(34.6, 83, 40, 82, 45, 81.2, 0.45, DULCE_D) }], 0.55) +
      `<path d="M34 78.6C35.6 77.2 38 76.6 40 76.8" fill="none" stroke="#F2C894" stroke-width=".9" stroke-linecap="round"/>` +
      k.draw([{ d: crema, fill: P.white, inner: k.sh(crema, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + hair(75.6, 78, 79, 76, 82.4, 73.4, 0.45, P.sky2) + hair(80, 82.4, 81, 78, 82.4, 73.4, 0.45, P.sky2) + hair(87.4, 78, 85, 76, 82.4, 73.4, 0.45, P.blue) }], 0.55) +
      sparkle(55, 51.4, 2.2, '#fff') + sparkle(86, 50, 1.8) + sparkle(34, 56, 1.5) +
      k.defs()
    )
  },

  // Diez veces: lo tuyo es el postre de la abuela. El budín de pan con caramelo y pasas, sobre la carpetita de crochet.
  'Budín de pan': (u) => {
    const k = kit(u)
    const cx = 60, cy = 62
    const lace = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2, x = cx + Math.cos(a) * 31.4, y = cy + Math.sin(a) * 31.4
      return `<circle cx="${f(x)}" cy="${f(y)}" r="3.1" fill="${P.white}" stroke="${P.sky2}" stroke-width=".4"/><circle cx="${f(x)}" cy="${f(y)}" r="1.1" fill="${FONDO}"/>`
    }).join('')
    const petals = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * 360
      return `<path d="M0 -11C2.6 -14 3.4 -20 0 -25C-3.4 -20 -2.6 -14 0 -11Z" transform="translate(${cx} ${cy}) rotate(${a})" fill="#F9E2C4" stroke="${P.sky2}" stroke-width=".4"/>`
    }).join('')
    const holes = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 27.6)}" cy="${f(cy + Math.sin(a) * 27.6)}" r=".9" fill="${FONDO}"/>` }).join('')
    const plate = ellipse(60, 83, 27.6, 7.2)
    const body = 'M37.8 61.6V77.6C37.8 81.6 47.6 85 60 85C72.4 85 82.2 81.6 82.2 77.6V61.6Z'
    const topR = ellipse(60, 61.6, 22.2, 7.4)
    const hole = ellipse(60, 60.8, 6.6, 2.3)
    const glaze = 'M37.8 61.6C37.8 64 38 66.4 38.6 68C39.2 69.6 41.4 69.4 41.6 67.6C41.8 66.4 42.6 66 43.2 67C43.8 68.6 43.6 71.6 44.6 72.8C45.6 74 47.6 73.4 47.8 71.6C48 69.8 48.6 69 49.6 69.6C50.6 70.2 50.4 72.4 51.6 73.2C53 74 54.6 73 54.6 71.4C54.6 70 55.6 69.6 56.4 70.4C57.4 71.6 57.4 74.6 59.2 75C61 75.4 61.8 74 61.8 72.4C61.8 71 62.8 70.4 63.6 71.2C64.6 72.4 64.6 74.2 66.2 74.4C67.8 74.6 68.4 73.2 68.4 71.6C68.4 70.2 69.6 69.6 70.4 70.6C71.2 71.6 71.4 73.4 73 73.4C74.6 73.4 75 72 75 70.4C75 69 76.2 68.4 77 69.4C77.8 70.4 78.4 71.4 79.6 71C81 70.6 81.4 68.6 81.8 66.4C82 64.6 82.2 63 82.2 61.6Z'
    const raisins = [[42, 76, -20], [49, 80.6, 10], [57.4, 78.4, -6], [66.4, 81.4, 18], [73.6, 77.6, -14], [79.4, 75, 8], [53.6, 82.8, 4]]
    const crumbs = Array.from({ length: 34 }, (_, i) => `<circle cx="${f(38.6 + rnd(i + 40) * 43)}" cy="${f(70 + rnd(i + 140) * 14)}" r="${f(0.3 + rnd(i + 240) * 0.35)}" fill="${i % 2 ? '#C77E3A' : '#F6CF8E'}"/>`).join('')
    return (
      mesa(k) +
      // La carpetita de crochet de la abuela, de fondo.
      `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${P.sky2}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` +
      lace +
      `<circle cx="${cx}" cy="${cy}" r="31.4" fill="${P.white}" stroke="${P.sky2}" stroke-width=".5"/>` +
      holes + petals +
      `<circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="${P.sky2}" stroke-width=".4" stroke-dasharray="1.2 .8"/><circle cx="${cx}" cy="${cy}" r="11" fill="none" stroke="${P.sky2}" stroke-width=".45"/>` +
      Array.from({ length: 12 }, (_, i) => { const a = ((i + 0.5) / 12) * Math.PI * 2; return `<path d="M${f(cx + Math.cos(a) * 11)} ${f(cy + Math.sin(a) * 11)}L${f(cx + Math.cos(a) * 25)} ${f(cy + Math.sin(a) * 25)}" stroke="${P.sky2}" stroke-width=".35" stroke-dasharray=".8 .8"/>` }).join('') +
      k.floor(61, 88, 28, 2.6, NAR_D) +
      k.draw([{ d: plate, fill: P.white, inner: k.sh(plate, 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + `<path d="${ellipse(60, 82.8, 25.4, 6.2)}" fill="none" stroke="${NAR}" stroke-width="1"/>` }], 0.6) +
      k.draw([
        {
          d: body, fill: '#E3A658',
          inner:
            k.sh('M64 58C76 64 82 72 78 88H86V58Z', 0, 0, 1, 0, 0, 0.9, '#A35E22', 0.5) + k.sh('M36 78H84V86H36Z', 0, 0, 0, 1, 0, 0.6, '#A35E22', 0.35) +
            crumbs + raisins.map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="1.5" ry="1" transform="rotate(${a} ${x} ${y})" fill="#4E2626" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.5)}" cy="${f(y - 0.3)}" r=".3" fill="#B98585"/>`).join('') +
            `<path d="${glaze}" fill="${CARAMEL}"/>` + k.sh(glaze, 0, 0, 1, 0, 0, 0.9, CARAMEL_D, 0.5) +
            hair(40.4, 64, 40.4, 68, 40.6, 72, 0.9, NAR_L) + hair(41, 74, 40.6, 77, 41.4, 80, 0.8, '#F6CF8E'),
        },
        { d: topR, fill: CARAMEL, inner: k.sh(topR, 0, 0, 1, 1, 0, 0.9, CARAMEL_D, 0.5) + `<path d="M42 59C46 56.4 54 55 62 55.2" fill="none" stroke="${NAR_L}" stroke-width="1" stroke-linecap="round"/>` + `<path d="M70 57C74 58 77 59.6 78.6 61.2" fill="none" stroke="${NAR_L}" stroke-width=".6" stroke-linecap="round" opacity=".7"/>` },
      ], 0.7) +
      // El agujero del molde, con la pared de adentro.
      `<path d="${hole}" fill="${CARAMEL_D}" stroke="${P.ink}" stroke-width=".55"/>` + k.clip(hole, `<path d="M52 61.4C55 63 65 63 68 61.4V64H52Z" fill="#E3A658"/><circle cx="58" cy="62.2" r=".5" fill="#4E2626"/>`) +
      sparkle(46, 56.6, 2.2, '#fff') + sparkle(86, 46, 1.6) +
      k.defs()
    )
  },

  // Treinta veces: capas y capas de gloria. La torta Rogel en su fuente de pie, con el merengue quemado, bajo el sol de Mayo.
  'Torta Rogel': (u) => {
    const k = kit(u)
    const cx = 60, ty = 57, H = 19, rx = 22, ry = 6.4
    const P2 = (a: number, dy = 0): [number, number] => [cx + Math.cos((a * Math.PI) / 180) * rx, ty + dy + Math.sin((a * Math.PI) / 180) * ry]
    const [x60, y60] = P2(62), [x120, y120] = P2(118)
    const sideL = `M${cx - rx} ${ty}A${rx} ${ry} 0 0 0 ${f(x120)} ${f(y120)}V${f(y120 + H)}A${rx} ${ry} 0 0 1 ${cx - rx} ${ty + H}Z`
    const sideR = `M${cx + rx} ${ty}A${rx} ${ry} 0 0 1 ${f(x60)} ${f(y60)}V${f(y60 + H)}A${rx} ${ry} 0 0 0 ${cx + rx} ${ty + H}Z`
    const cutL = `M${cx} ${ty}L${f(x120)} ${f(y120)}V${f(y120 + H)}L${cx} ${ty + H}Z`
    const cutR = `M${cx} ${ty}L${f(x60)} ${f(y60)}V${f(y60 + H)}L${cx} ${ty + H}Z`
    const layers = (curved: boolean) => Array.from({ length: 8 }, (_, i) => {
      const y = ty + 3.2 + i * 2.05
      return curved
        ? `<path d="M${cx - rx - 1} ${f(y)}A${rx + 1} ${ry} 0 0 0 ${cx + rx + 1} ${f(y)}" fill="none" stroke="${DULCE}" stroke-width="1.05"/>`
        : `<path d="M${cx - rx - 1} ${f(y + 1.6)}L${cx + rx + 1} ${f(y + 1.6)}" stroke="${DULCE}" stroke-width="1.05"/>`
    }).join('')
    const stand = ellipse(60, 79.4, 30, 6.6)
    const stem = 'M56.4 85.4H63.6L62.4 91.6H57.6Z'
    const foot = 'M51.4 93.6C51.4 92 55 91.2 60 91.2C65 91.2 68.6 92 68.6 93.6L69.8 96H50.2Z'
    // El merengue: una masa sobre la tapa y los picos con la punta quemada.
    const meringue = `M${cx - rx - 0.6} ${ty + 0.6}C${cx - rx - 1.6} ${ty - 5} ${cx - 12} ${ty - 9} ${cx} ${ty - 9}C${cx + 12} ${ty - 9} ${cx + rx + 1.6} ${ty - 5} ${cx + rx + 0.6} ${ty + 0.6}L${f(x60)} ${f(y60 - 1)}L${cx} ${ty - 1.6}L${f(x120)} ${f(y120 - 1)}Z`
    const peak = (x: number, y: number, s: number, lean: number) => {
      const d = `M${f(x - 3.4 * s)} ${y}C${f(x - 3.6 * s)} ${f(y - 3 * s)} ${f(x - 1 * s)} ${f(y - 4.4 * s)} ${f(x + lean)} ${f(y - 7.4 * s)}C${f(x + 1.4 * s)} ${f(y - 4.6 * s)} ${f(x + 3.8 * s)} ${f(y - 3 * s)} ${f(x + 3.4 * s)} ${y}Z`
      return k.draw([{ d, fill: P.white, inner: `<path d="${d}" fill="${k.lin(P.goldD, 0, 0, 0, 1, 1, 0)}"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) }], 0.4) +
        `<path d="M${f(x - 1.6 * s)} ${f(y - 1)}C${f(x - 1.4 * s)} ${f(y - 3 * s)} ${f(x - 0.4 * s)} ${f(y - 4.4 * s)} ${f(x + lean * 0.6)} ${f(y - 5.6 * s)}" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>`
    }
    const peaks = ([[44, 56.4, 1, -1.2], [52, 55.6, 1.1, 1], [60.4, 54.8, 1.2, -0.8], [69, 55.6, 1.1, 1.2], [76.6, 56.4, 1, -1], [48, 52.6, 0.9, 1], [56, 51.6, 1, -1], [64.6, 51.6, 1, 1.2], [72.4, 52.6, 0.9, -0.8], [60, 48.6, 0.9, 0.8]] as const)
      .slice().sort((a, b) => a[1] - b[1]).map(([x, y, s, l]) => peak(x, y, s, l)).join('')
    const layered = (d: string, curved: boolean, sh: string) => ({ d, fill: '#F2D49C', inner: layers(curved) + k.sh(d, 0, 0, 1, 0, 0, 0.8, sh, 0.45) + k.sh(d, 0, 0, 0, 1, 0, 0.4, DULCE_D, 0.3) })
    return (
      mesa(k) +
      k.sun(60, 54, 17, 47) +
      k.shade(ellipse(60, 56, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.floor(60, 96, 13, 1.8, P.mid) +
      // La fuente de pie, de plata.
      k.draw([
        { d: foot, fill: P.white, inner: k.sh(foot, 0, 0, 1, 1, 0, 0.85, P.blue, 0.4) + `<path d="M52 94.6H68" stroke="${P.blue}" stroke-width=".35"/>` },
        { d: stem, fill: P.white, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + `<path d="M57 88.4H63" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: stand, fill: P.white, inner: k.sh(stand, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="${ellipse(60, 79, 27, 5.4)}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` + `<path d="${ellipse(60, 79.4, 29, 6)}" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-dasharray="1.6 1"/>` },
      ], 0.65) +
      k.floor(60, 79.6, 22, 2.6, P.blue) +
      // La torta con la porción cortada: las capas de masa y dulce de leche.
      k.draw([layered(sideL, true, DULCE_D), layered(sideR, true, DULCE_D), layered(cutL, false, P.goldD), layered(cutR, false, DULCE_D)], 0.7) +
      `<path d="M${cx} ${ty}V${ty + H}" stroke="${P.ink}" stroke-width=".45"/>` +
      // El merengue, por encima.
      k.draw([{ d: meringue, fill: P.white, inner: k.sh(meringue, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="M${cx} ${ty - 1.6}L${f(x60)} ${f(y60 - 1)}V${f(y60 + 2)}L${cx} ${ty + 1.6}L${f(x120)} ${f(y120 + 2)}V${f(y120 - 1)}Z" fill="${P.white}"/>` }], 0.6) +
      peaks +
      `<path d="M${f(x120)} ${f(y120 + 1.2)}L${cx} ${ty}L${f(x60)} ${f(y60 + 1.2)}" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` +
      sparkle(44, 44, 2.4, '#fff') + sparkle(86, 40, 2) + sparkle(32, 50, 1.5) +
      k.defs()
    )
  },
}
