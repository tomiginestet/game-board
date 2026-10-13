// Dobble: Ojo biónico y Reflejos, en clave heroica.
// El color propio del juego es el rojo de su ficha (#F03E3E): el fondo granulado como la lata del juego, y la carta
// redonda blanca con sus símbolos de colores como escenario. El chiste está en los ojos rápidos, pero sin caras: se
// cuenta con objetos (la lupa, los anteojos de rayos X, la mira, el revólver, la funda, las plumas del correcaminos).
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El rojo de la ficha de Dobble, con su sombra y su luz. */
const DB = '#F03E3E', DB_D = '#A3191F', DB_L = '#F9B9B3'
/** Los colores de los símbolos de la carta. */
const AZ = '#3D6FCF', VERDE = '#4FA45B', VIOL = '#8457C4', NAR = '#F08A24', AMA = '#F5C431'
/** El cuero de la funda, la arena del desierto y el violeta del correcaminos. */
const CUERO = '#A8642F', CUERO_D = '#6E3A17', ARENA = '#EAD7B6', ARENA_D = '#C9A877', PLUMA = '#5B4FB0', PLUMA_L = '#9C8FE0'

/** La lata: el rojo con el borde granulado más oscuro. */
const lata = (k: Kit) => `<rect width="120" height="130" fill="${DB}"/>` + k.shade(FULL, k.rad(DB_D, 0.5, 0.46, 0.68, 0, 1), DB_D, 0.6)

/** Varilla entintada: la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.2)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Forma rellena con contorno fino de tinta y un brillo. */
const solid = (d: string, c: string, w = 0.45) => `<path d="${d}" fill="${c}" stroke="${P.ink}" stroke-width="${w}" stroke-linejoin="round"/>`

/** Los símbolos de la carta, centrados en (0,0) y de unas 10 unidades. */
const SYM: Record<string, () => string> = {
  ancla: () =>
    rod('M0 -2.6V4.4M-2.4 -1.2H2.4M-4 1.2C-3.4 4 -1.6 5 0 5C1.6 5 3.4 4 4 1.2', AZ, 1.1) +
    `<circle cx="0" cy="-3.9" r="1.3" fill="none" stroke="${P.ink}" stroke-width="2.2"/><circle cx="0" cy="-3.9" r="1.3" fill="none" stroke="${AZ}" stroke-width="1"/>` +
    solid('M-5 2.4L-4.2 .2L-2.8 1.8Z', AZ, 0.35) + solid('M5 2.4L4.2 .2L2.8 1.8Z', AZ, 0.35),
  corazon: () => solid('M0 4.6C-6 1 -5.6 -4.6 -2.4 -4.6C-1.2 -4.6 -.4 -3.8 0 -2.8C.4 -3.8 1.2 -4.6 2.4 -4.6C5.6 -4.6 6 1 0 4.6Z', DB) + `<ellipse cx="-2.4" cy="-2.2" rx="1" ry=".6" fill="#fff" transform="rotate(-30 -2.4 -2.2)"/>`,
  rayo: () => solid('M1.2 -5.2L-3.2 .8H-.4L-1.8 5.2L3.2 -1.2H.4L2.2 -5.2Z', AMA),
  gota: () => solid('M0 -5C-1.8 -2 -3.4 0 -3.4 1.8C-3.4 3.8 -1.8 5 0 5C1.8 5 3.4 3.8 3.4 1.8C3.4 0 1.8 -2 0 -5Z', AZ) + `<ellipse cx="-1.4" cy="1.6" rx=".6" ry="1.1" fill="#fff"/>`,
  trebol: () =>
    rod('M0 1L1.4 5', VERDE, 0.8) +
    [[-2, -1.2], [2, -1.2], [0, -3.6], [0, 1]].slice(0, 3).map(([x, y]) => solid(ellipse(x, y, 2.3, 2.3), VERDE, 0.4)).join('') + solid(ellipse(0, -.6, 1.6, 1.6), VERDE, 0.3),
  sol: () =>
    `<g fill="${NAR}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round">` +
    Array.from({ length: 8 }, (_, i) => `<path d="M-.9 -3.2L0 -5.4L.9 -3.2Z" transform="rotate(${i * 45})"/>`).join('') + `</g>` +
    solid(ellipse(0, 0, 2.9, 2.9), AMA, 0.45) + `<circle cx="-1" cy="-1" r=".7" fill="#fff"/>`,
  nota: () =>
    rod('M-1 3V-3.6L4 -4.8V1.8', VIOL, 0.8) + rod('M-1 -2.2L4 -3.4', VIOL, 0.9) +
    solid(ellipse(-2.4, 3, 1.8, 1.3), VIOL, 0.4) + solid(ellipse(2.6, 1.8, 1.8, 1.3), VIOL, 0.4),
  copo: () =>
    rod([0, 60, 120].map((a) => `M${f(Math.cos((a * Math.PI) / 180) * 4.6)} ${f(Math.sin((a * Math.PI) / 180) * 4.6)}L${f(-Math.cos((a * Math.PI) / 180) * 4.6)} ${f(-Math.sin((a * Math.PI) / 180) * 4.6)}`).join(''), '#6FB4E8', 0.8) +
    `<circle cx="0" cy="0" r="1" fill="#fff" stroke="${P.ink}" stroke-width=".3"/>`,
  luna: () => solid('M1.6 -4.8A5 5 0 1 0 1.6 4.8A3.8 3.8 0 1 1 1.6 -4.8Z', AMA),
  cactus: () =>
    solid('M-1.4 5V-3.4C-1.4 -5.4 1.4 -5.4 1.4 -3.4V5Z', VERDE, 0.4) + solid('M-1.4 1.4H-2.6C-3.8 1.4 -4.2 .6 -4.2 -.6V-2.4C-4.2 -3.4 -2.8 -3.4 -2.8 -2.4V-.4H-1.4Z', VERDE, 0.35) +
    solid('M1.4 -.2H2.6C3.8 -.2 4.2 -1 4.2 -2.2V-3.4C4.2 -4.4 2.8 -4.4 2.8 -3.4V-1.6H1.4Z', VERDE, 0.35) + `<path d="M0 -3.4V4" stroke="#2E6E39" stroke-width=".35"/>`,
  llave: () =>
    `<circle cx="-2.6" cy="0" r="2.2" fill="none" stroke="${P.ink}" stroke-width="2.6"/><circle cx="-2.6" cy="0" r="2.2" fill="none" stroke="${P.goldD}" stroke-width="1.3"/>` +
    rod('M-.4 0H5M3.4 0V1.8M4.8 0V1.4', P.goldD, 1),
  zanahoria: () => solid('M-1.2 -2.6C.6 -3.6 3 -2.2 2.6 -.4C1.6 2 -.4 3.8 -3.6 5.2C-3.4 2 -2.8 -1.4 -1.2 -2.6Z', NAR, 0.4) + rod('M1 -3.2L2.4 -5.4M1.6 -2.8L4.2 -4.2M.4 -3.4L.2 -5.6', VERDE, 0.6),
  bang: () => solid('M-1 -5H1.6L1 1.6H-.6Z', NAR, 0.4) + solid(ellipse(0.3, 3.8, 1.2, 1.2), NAR, 0.4),
}

/** Una carta redonda de Dobble (radio 25) centrada en (0,0) con sus símbolos [nombre, x, y, escala, giro]. */
type Sym = [string, number, number, number, number]
const BASE: Sym[] = [
  ['ancla', 0, 0, 1.45, -8], ['corazon', -11, -11.6, 1.05, -20], ['rayo', 2.6, -15.6, 1.05, 15], ['sol', 14, -8, 1.15, 0],
  ['gota', 15.2, 6.4, 0.95, 20], ['trebol', 6, 15.4, 1.15, -10], ['nota', -8.4, 14, 1.05, 10], ['llave', -15.6, 1.6, 1.05, 30],
]
function carta(k: Kit, syms: Sym[] = BASE, shade = true) {
  const d = ellipse(0, 0, 25, 25)
  return (
    k.draw([{
      d, fill: P.white,
      inner: (shade ? k.sh(d, 0, 0, 1, 1, 0.1, 0.6, '#C9B9A8', 0.35) : '') + `<circle cx="0" cy="0" r="23.2" fill="none" stroke="${DB_L}" stroke-width=".6" stroke-dasharray=".01 1.5" stroke-linecap="round"/>` +
        hair(-21, -6, -18, -16, -8, -21.6, 0.8, '#fff'),
    }], 0.7) +
    syms.map(([n, x, y, s, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${SYM[n]()}</g>`).join('')
  )
}

/** Revólver de seis tiros de perfil hacia la derecha, con el centro del tambor en (0,0): cañón largo con su mira,
 * tambor estriado, armazón grabado, martillo montado, guardamonte y cachas de marfil con un medallón. */
function revolver(k: Kit, engraved = false) {
  const frame = 'M-14 -6H5.4V5.2H-1C-2 8 -5 9.8 -8.4 9.4L-13.6 6Z'
  const barrel = 'M4 -3.6H39.4V-.6H4Z'
  const sight = 'M37.4 -3.4L38.2 -5.4H39L39.4 -3.4Z'
  const housing = 'M4 -.6H29C30 -.6 30.6 0 30.6 .9C30.6 1.8 30 2.4 29 2.4H4Z'
  const cyl = roundRect(-8.4, -5, 4.6, 4.2, 1.6)
  const hammer = 'M-13 -5.4L-14.6 -9.4C-15 -10.4 -16.4 -11 -17.6 -10.6L-17 -9.4C-16.2 -9.6 -15.8 -9.2 -15.6 -8.6L-14.4 -4.8Z'
  const grip = 'M-13.6 5.6C-16.4 9.6 -19 15.4 -20 20.6C-20.4 22.4 -19.2 23.6 -17.6 23.6H-12.6C-11.2 23.6 -10.4 22.6 -10.4 21.4C-10.6 16 -9.6 11.4 -8 9.2Z'
  const guard = 'M-6.8 9.2C-7.6 12.6 -4.6 14.6 -1.6 13.4C.4 12.6 .8 10.2 -.2 8.2'
  const scroll = engraved
    ? `<g opacity=".9">` + hair(-12.6, -3, -11, -1, -12.4, 1.6, 0.4, P.mid) + hair(-12.6, 2, -10.6, 3.4, -11.6, 5.6, 0.35, P.mid) +
      `<path d="M-12.4 -1.6C-11.2 -2.6 -10 -1.6 -10.6 -.6C-11 .2 -12 0 -11.8 -.8" fill="none" stroke="${P.mid}" stroke-width=".35"/>` +
      `<path d="M8 1C10 -.4 12 1.6 14 .4C16 -.8 18 1.2 20 .2" fill="none" stroke="${P.mid}" stroke-width=".35"/>` + `</g>`
    : ''
  return (
    rod(guard, P.sky2, 1.1) + rod('M-4.4 8.4C-4.2 10 -4.8 11.4 -5.8 12', P.sky2, 0.7) +
    k.draw([
      { d: grip, fill: P.white, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.8, ARENA_D, 0.45) + `<path d="M-17 12L-12 17M-18 15L-13 20M-15.6 9.6L-11 14M-17 18L-14 21" stroke="${ARENA_D}" stroke-width=".3"/>` + `<circle cx="-14.6" cy="15.6" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` + hair(-16, 8, -18, 14, -18.6, 20, 0.5, '#fff') },
      { d: hammer, fill: P.blue, inner: k.sh(hammer, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) },
      { d: frame, fill: P.sky1, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.85, P.blue, 0.5) + `<path d="M-14 -6H5.4V-4.4H-14Z" fill="${P.blue}" opacity=".5"/>` + scroll + `<circle cx="-10.6" cy="2.6" r=".6" fill="${P.mid}"/><circle cx="-4" cy="7" r=".5" fill="${P.mid}"/>` },
      { d: housing, fill: P.blue, inner: k.sh(housing, 0, 0, 0, 1, 0, 0.8, P.mid, 0.45) + `<path d="M5 .9H29" stroke="${P.sky1}" stroke-width=".35"/>` },
      { d: barrel, fill: P.blue, inner: k.sh(barrel, 0, 0, 0, 1, 0, 0.9, P.mid, 0.5) + hair(5, -2.8, 20, -3.2, 38, -2.8, 0.5, '#fff', 0.85) + scroll },
      { d: sight, fill: P.blue },
      { d: cyl, fill: P.sky2, inner: k.sh(cyl, 0, 0, 0, 1, 0, 0.9, P.mid, 0.5) + `<path d="M-7 -2.4H3.4M-7 0H3.4M-7 2.2H3.4" stroke="${P.mid}" stroke-width=".55"/>` + hair(-7, -3.8, -2, -4.2, 3, -3.8, 0.5, '#fff') },
    ], 0.55) +
    `<circle cx="-11.6" cy="-1.6" r=".6" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".25"/>`
  )
}

/** Silueta entera del revólver (para sombras), en las mismas coordenadas que `revolver`. */
const GUN = 'M-14 -6H39.4V2.4H5.4V5.2H-1C-2 8 -5 9.8 -8.4 9.4L-13.6 6C-16.4 9.6 -19 15.4 -20 20.6C-20.4 22.4 -19.2 23.6 -17.6 23.6H-12.6C-11.2 23.6 -10.4 22.6 -10.4 21.4C-10.6 16 -9.6 11.4 -8 9.2Z' +
  'M-13 -5.4L-14.6 -9.4C-15 -10.4 -16.4 -11 -17.6 -10.6L-17 -9.4C-16.2 -9.6 -15.8 -9.2 -15.6 -8.6L-14.4 -4.8Z'

/** Humo del caño: un rulo que sube y se abre. */
const smoke = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linecap="round">` +
  `<path d="M0 0C3 -1 4.6 -4 3 -6.4C1.6 -8.4 -1.6 -7.4 -1 -5.4C-.6 -4 1.2 -4.4 1.2 -5.6" stroke="${P.white}" stroke-width="1.6"/>` +
  `<path d="M3 -6.4C5 -9 4 -12.4 1.4 -13.6C-1.4 -14.8 -3.6 -12.4 -2.6 -10.6" stroke="${P.white}" stroke-width="1.2" opacity=".85"/>` +
  `<path d="M1.4 -13.6C3 -16 1.6 -18.6 -.6 -19.4" stroke="${P.white}" stroke-width=".8" opacity=".6"/></g>`

/** Fogonazo dorado de ocho puntas. */
const flash = (x: number, y: number, r: number) =>
  `<path d="${starPath(x, y, r, r * 0.4, 8, -90)}" fill="${AMA}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
  `<path d="${starPath(x, y, r * 0.55, r * 0.25, 8, -67.5)}" fill="#fff"/>`

/** Funda de cuero colgada (vacía o con el revólver), con la boca arriba en (0,−14). */
function holster(k: Kit) {
  const d = 'M-6.4 -14H6.4C7 -6 6.2 4 4 12C3 15.4 -3 15.4 -4 12C-6.2 4 -7 -6 -6.4 -14Z'
  const flap = 'M-7.6 -16.6H7.6L6.8 -12.4H-6.8Z'
  return k.draw([
    { d, fill: CUERO, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, CUERO_D, 0.5) + `<path d="M-4.8 -12C-5 -4 -4.4 4 -2.6 11.6M4.8 -12C5 -4 4.4 4 2.6 11.6" fill="none" stroke="${ARENA}" stroke-width=".4" stroke-dasharray=".9 .6"/>` + `<path d="${starPath(0, -3, 3, 1.3, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-4.6, -10, -5, -2, -3, 8, 0.6, ARENA, 0.7) },
    { d: flap, fill: CUERO_D, inner: `<path d="M-7 -14.6H7" stroke="${ARENA}" stroke-width=".35" stroke-dasharray=".8 .5"/>` },
  ], 0.6) + `<path d="M-4 -12.4C-2 -11 2 -11 4 -12.4" fill="none" stroke="#3A1E0A" stroke-width="1.2" stroke-linecap="round"/>`
}

/** Pluma del correcaminos, con el cañón en (0,0) y la punta hacia arriba (largo `L`): cálamo desnudo, plumón
 * blanco en la base, las dos barbas con sus cortes y el raquis claro. */
function feather(k: Kit, L: number) {
  const w = L * 0.15, b0 = -L * 0.2
  const vane = `M0 ${f(b0)}C${f(-w * 1.1)} ${f(-L * 0.32)} ${f(-w * 1.3)} ${f(-L * 0.7)} ${f(-w * 0.15)} ${-L}C${f(w * 0.9)} ${f(-L * 0.72)} ${f(w * 0.95)} ${f(-L * 0.32)} 0 ${f(b0)}Z`
  const notch = `M${f(-w * 1.25)} ${f(-L * 0.52)}L${f(-w * 0.2)} ${f(-L * 0.47)}L${f(-w * 1.2)} ${f(-L * 0.43)}ZM${f(w * 0.95)} ${f(-L * 0.66)}L${f(w * 0.15)} ${f(-L * 0.6)}L${f(w * 0.98)} ${f(-L * 0.56)}Z`
  const barbs = Array.from({ length: 11 }, (_, i) => {
    const t = 0.28 + i * 0.062, y = -L * t
    return hair(0, y, -w * 0.5, y - L * 0.03, -w * 1.05, y - L * 0.09, 0.28, P.night, 0.55) + hair(0, y - L * 0.02, w * 0.45, y - L * 0.05, w * 0.85, y - L * 0.1, 0.28, P.night, 0.45)
  }).join('')
  const down = Array.from({ length: 6 }, (_, i) => { const s = i % 2 ? 1 : -1, y = b0 + 1.2 - i * 1.1; return hair(0, y, s * w * 0.8, y + 0.2, s * w * 1.5, y + 1.6 + (i % 3) * 0.4, 0.45, P.white, 0.95) }).join('')
  return (
    k.draw([{
      d: vane, fill: PLUMA_L,
      inner: `<path d="M-10 ${f(-L * 0.52)}H10V${-L - 2}H-10Z" fill="${PLUMA}"/>` + k.sh(vane, 0, 0, 1, 0, 0, 0.75, P.night, 0.45) + barbs +
        `<path d="M-10 ${f(-L * 0.3)}H10V2H-10Z" fill="${P.white}" opacity=".65"/>` + `<path d="${notch}" fill="${DB}"/>`,
    }], 0.45) +
    down +
    `<path d="M0 ${f(L * 0.06)}Q${f(-w * 0.1)} ${f(-L * 0.5)} ${f(-w * 0.15)} ${f(-L * 0.98)}" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
    `<path d="M0 ${f(L * 0.06)}Q${f(-w * 0.1)} ${f(-L * 0.5)} ${f(-w * 0.15)} ${f(-L * 0.98)}" fill="none" stroke="${P.white}" stroke-width=".45" stroke-linecap="round"/>`
  )
}

/** Nube de polvo: bollos de arena superpuestos con la sombra marrón. */
function dust(k: Kit, x: number, y: number, s: number) {
  const d = 'M-11 3C-14 3 -15.4 0 -13 -2C-14 -6.4 -9 -8.6 -6.4 -6C-5 -10.4 1.4 -11 3 -6.8C5.6 -9 10 -7.4 9.6 -3.6C13 -3.4 13.6 2.6 10 3Z'
  return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: ARENA, inner: k.sh(d, 0, 0, 1, 1, 0, 0.85, ARENA_D, 0.5) + hair(-9, 1, -2, 2.4, 6, 1, 0.5, CUERO, 0.6) + hair(-8, -3, -6, -6, -2, -6.6, 0.6, '#fff', 0.8) }], 0.45 / s) + `</g>`
}

export const DOBBLE_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Ojo biónico ────────────────────────────────────────────────────

  // Tres victorias: ves el símbolo antes de que caiga la carta. La carta cayendo y la lupa que agranda el que es.
  'Ojo de lince': (u) => {
    const k = kit(u)
    const cx = 52, cy = 64, rot = -10
    const card = `<g transform="translate(${cx} ${cy}) rotate(${rot})">` + carta(k) + `</g>`
    const a = (rot * Math.PI) / 180, lx = cx + 14 * Math.cos(a) + 8 * Math.sin(a), ly = cy + 14 * Math.sin(a) - 8 * Math.cos(a), R = 11
    const handle = 'M-2 0H2L1.6 17C1.6 18.4 -1.6 18.4 -1.6 17Z'
    return (
      lata(k) +
      hair(36, 26, 36.6, 32, 36, 38, 0.8, DB_L, 0.9) + hair(46, 22, 46.6, 28, 46, 35, 0.8, DB_L, 0.9) + hair(58, 24, 58.6, 30, 58, 36, 0.7, DB_L, 0.8) + hair(28, 34, 28.4, 38, 28, 43, 0.6, DB_L, 0.7) +
      k.cast([ellipse(cx, cy, 25, 25)], 2.4, 3, DB_D) +
      card +
      `<g transform="translate(${f(lx)} ${f(ly)}) rotate(-42) translate(0 ${R})">` + rod('M0 0V3', P.gold, 3.2) +
      k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + `<path d="M-1.4 6H1.4M-1.4 9H1.4M-1.4 12H1.4" stroke="${P.brownD}" stroke-width=".4"/>` + hair(-1, 2, -1.2, 9, -.8, 16, 0.5, P.goldL, 0.7) }], 0.55) +
      k.draw([{ d: 'M-2.6 -1H2.6V3.2H-2.6Z', fill: P.gold, inner: k.sh('M-2.6 -1H2.6V3.2H-2.6Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.6 1H2.6" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.45) + `</g>` +
      k.clip(ellipse(lx, ly, R - 1, R - 1), `<circle cx="${f(lx)}" cy="${f(ly)}" r="${R}" fill="${P.white}"/><g transform="translate(${f(lx)} ${f(ly)}) scale(1.75) translate(${f(-lx)} ${f(-ly)})">${card}</g>` + `<circle cx="${f(lx)}" cy="${f(ly)}" r="${R}" fill="${k.rad(P.sky, 0.5, 0.5, 0.5, 0, 0.5)}"/>`) +
      `<circle cx="${f(lx)}" cy="${f(ly)}" r="${R - 0.4}" fill="none" stroke="${P.ink}" stroke-width="3.4"/><circle cx="${f(lx)}" cy="${f(ly)}" r="${R - 0.4}" fill="none" stroke="${P.gold}" stroke-width="2"/>` +
      `<circle cx="${f(lx)}" cy="${f(ly)}" r="${R - 0.4}" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<path d="M${f(lx - 6.4)} ${f(ly - 3.4)}A7.4 7.4 0 0 1 ${f(lx - 2)} ${f(ly - 7.2)}" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M${f(lx - 8.2)} ${f(ly - 9.4)}A12.6 12.6 0 0 1 ${f(lx + 2)} ${f(ly - 12.4)}" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-linecap="round"/>` +
      sparkle(86, 34, 2.4, '#fff') + sparkle(30, 86, 1.6, DB_L) +
      k.defs()
    )
  },

  // Diez victorias: ves a través del mazo. Los anteojos de rayos X con sus espirales, y el mazo radiografiado.
  'Rayos X': (u) => {
    const k = kit(u)
    const LY = 45
    const lens = (x: number) => {
      const spiral = Array.from({ length: 4 }, (_, i) => `<circle cx="${x}" cy="${LY}" r="${f(1.2 + i * 1.5)}" fill="none" stroke="#fff" stroke-width=".55" stroke-dasharray="${f(3 + i * 2)} ${f(1 + i * 0.6)}" transform="rotate(${i * 50} ${x} ${LY})"/>`).join('')
      return k.draw([{ d: ellipse(x, LY, 8.6, 8.6), fill: P.white, inner: k.sh(ellipse(x, LY, 8.6, 8.6), 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + `<circle cx="${x}" cy="${LY}" r="7.6" fill="none" stroke="${DB}" stroke-width=".6"/>` }], 0.75) +
        `<circle cx="${x}" cy="${LY}" r="6.6" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` + spiral +
        `<path d="M${x - 4.6} ${LY - 3.2}A5.6 5.6 0 0 1 ${x - 1.2} ${LY - 5.2}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`
    }
    const top = ellipse(60, 79, 27, 9.4)
    const side = 'M33 79V88A27 9.4 0 0 0 87 88V79A27 9.4 0 0 1 33 79Z'
    const edges = Array.from({ length: 6 }, (_, i) => `<path d="M33 ${f(80.4 + i * 1.3)}A27 9.4 0 0 0 87 ${f(80.4 + i * 1.3)}" fill="none" stroke="${P.sky2}" stroke-width=".4"/>`).join('')
    const spot = ellipse(60, 79, 17, 5.8)
    const ray = (x: number) => `M${x - 6} ${LY + 4}L${x + 6} ${LY + 4}L${x + 7.4 + (60 - x) * 0.3} 77L${x - 7.4 + (60 - x) * 0.3} 77Z`
    // Radiografía: los símbolos de las cartas de abajo, sólo en contorno celeste, cada vez más tenues.
    const ghost = (n: string, x: number, y: number, s: number, o: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">${SYM[n]().replace(/fill="[^"]*"/g, 'fill="none"').replace(/stroke="[^"]*"/g, 'stroke="#BFE2FF"')}</g>`
    const ghosts = `<g transform="translate(60 79) scale(1 .36)">` + ghost('llave', -9, -3, 1.3, 0.95) + ghost('ancla', 8, 2, 1.3, 0.7) + ghost('corazon', -1, 6, 1.1, 0.5) + `</g>`
    return (
      lata(k) +
      k.floor(61, 92, 30, 3, DB_D) +
      k.draw([
        { d: side, fill: P.white, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + edges },
        {
          d: top, fill: P.white,
          inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, '#C9B9A8', 0.3) + `<g transform="translate(60 79) scale(1 .37) scale(1.07)">` + BASE.map(([n, x, y, s, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${SYM[n]()}</g>`).join('') + `</g>` +
            `<path d="${spot}" fill="#16234F"/>` + k.clip(spot, ghosts + k.shade(spot, k.rad('#6FB4E8', 0.5, 0.5, 0.5, 0.7, 0), '#6FB4E8', 0.3)) + `<path d="${spot}" fill="none" stroke="#9FD0FF" stroke-width=".6"/>`,
        },
      ], 0.7) +
      k.shade(ray(49.4), k.lin(P.sky1, 0, 0, 0, 1, 0.75, 0.15), '#9FD0FF', 0.4) + k.shade(ray(70.6), k.lin(P.sky1, 0, 0, 0, 1, 0.75, 0.15), '#9FD0FF', 0.4) +
      hair(47, 54, 49, 64, 52, 74, 0.5, '#fff', 0.7) + hair(73, 54, 71, 64, 68, 74, 0.5, '#fff', 0.7) +
      rod(`M41 ${LY - 1.6}L33.4 ${LY - 8.4}L31.6 ${LY - 6.6}M79 ${LY - 1.6}L86.6 ${LY - 8.4}L88.4 ${LY - 6.6}`, P.white, 1.5) +
      rod(`M57.6 ${LY - 1.4}C58.8 ${LY - 2.8} 61.2 ${LY - 2.8} 62.4 ${LY - 1.4}`, P.white, 1.6) +
      lens(49.4) + lens(70.6) +
      `<circle cx="41.4" cy="${LY - 1.6}" r=".7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/><circle cx="78.6" cy="${LY - 1.6}" r=".7" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x="60" y="30" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.6" fill="${P.white}" text-anchor="middle">rayos X</text>` +
      sparkle(88, 50, 2, '#fff') + sparkle(30, 56, 1.6, DB_L) +
      k.defs()
    )
  },

  // Veinticinco victorias: escaneo completo, objetivo localizado. La mira de bronce y cromo, con la carta en rojo y
  // el ancla enmarcada por la retícula.
  'Terminator': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58, R1 = 31, R0 = 24.6
    const ring = `${ellipse(cx, cy, R1, R1)} ${ellipse(cx, cy, R0, R0)}`
    const rc = k.id('mira')
    const knurl = Array.from({ length: 72 }, (_, i) => { const a = (i / 72) * Math.PI * 2; return `M${f(cx + Math.cos(a) * (R1 - 2))} ${f(cy + Math.sin(a) * (R1 - 2))}L${f(cx + Math.cos(a) * R1)} ${f(cy + Math.sin(a) * R1)}` }).join('')
    const ticks = Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * Math.PI * 2, r = i % 3 ? R0 + 1.2 : R0 + 2.4; return `M${f(cx + Math.cos(a) * R0)} ${f(cy + Math.sin(a) * R0)}L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}` }).join('')
    const nums = [0, 3, 6, 9].map((n, i) => { const a = (i / 4) * Math.PI * 2 - Math.PI / 2 + 0.26, r = R0 + 3.6; return `<text x="${f(cx + Math.cos(a) * r)}" y="${f(cy + Math.sin(a) * r + 0.9)}" ${GEORGIA} font-size="2.4" fill="${P.ink}" text-anchor="middle">${n}</text>` }).join('')
    const view = ellipse(cx, cy, R0, R0)
    const hudC = '#FFE3DE'
    const br = (sx: number, sy: number) => `<path d="M${cx + sx * 9} ${cy + sy * 5.6}V${cy + sy * 9}H${cx + sx * 5.6}" fill="none" stroke="${hudC}" stroke-width=".9"/>`
    return (
      lata(k) +
      k.sun(cx, cy, 30, 52, 36, false) +
      k.cast([ellipse(cx, cy, R1, R1)], 2.2, 2.6, DB_D) +
      k.clip(view, `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="#2B0D12"/>` + `<g transform="translate(${cx} ${cy}) scale(1.3)">` + carta(k, BASE, false) + `</g>` +
        `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="${DB_D}" opacity=".5"/>` + `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="${k.rad('#2B0D12', 0.5, 0.5, 0.5, 0, 0.92)}"/>` +
        Array.from({ length: 16 }, (_, i) => `<path d="M${cx - R0} ${f(cy - R0 + i * 3.2)}H${cx + R0}" stroke="#000" stroke-width=".35" opacity=".25"/>`).join('') +
        `<path d="M${cx - R0} ${cy + 10}H${cx + R0}" stroke="${hudC}" stroke-width="1.6" opacity=".35"/><path d="M${cx - R0} ${cy + 10}H${cx + R0}" stroke="#fff" stroke-width=".4" opacity=".8"/>` +
        `<path d="M${cx - R0} ${cy}H${cx - 11}M${cx + 11} ${cy}H${cx + R0}M${cx} ${cy - R0}V${cy - 11}M${cx} ${cy + 11}V${cy + R0}" stroke="${hudC}" stroke-width=".7"/>` +
        [-20, -16, 16, 20].map((d) => `<path d="M${cx + d} ${cy - 1.2}V${cy + 1.2}M${cx - 1.2} ${cy + d}H${cx + 1.2}" stroke="${hudC}" stroke-width=".5"/>`).join('') +
        br(-1, -1) + br(1, -1) + br(-1, 1) + br(1, 1) +
        `<circle cx="${cx}" cy="${cy}" r="12.6" fill="none" stroke="${hudC}" stroke-width=".4" stroke-dasharray="1.6 1.2"/>` +
        `<path d="M${cx - 15} ${cy + 13.4}H${cx + 15}V${cy + 18.4}H${cx - 15}Z" fill="#2B0D12" opacity=".6"/>` +
        `<text x="${cx}" y="${cy + 17}" ${GEORGIA} font-weight="700" font-size="2.5" fill="${hudC}" text-anchor="middle" textLength="27" lengthAdjust="spacingAndGlyphs">OBJETIVO LOCALIZADO</text>` +
        `<text x="${cx - 14}" y="${cy - 14}" ${GEORGIA} font-size="2.2" fill="${hudC}">100%</text>` +
        `<path d="M${cx + 9} ${cy - 9}L${cx + 13} ${cy - 13}H${cx + 18}" fill="none" stroke="${hudC}" stroke-width=".5"/>` +
        `<path d="M${cx - 16} ${cy - 18}A${R0 - 2} ${R0 - 2} 0 0 1 ${cx + 2} ${cy - R0 + 2.2}" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>`) +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.7 .8)"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.6"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.sky1}"/>` +
      `<clipPath id="${rc}"><path d="${ring}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${rc})">` +
      k.sh(ellipse(cx, cy, R1, R1), 0, 0, 1, 1, 0.1, 0.95, P.blue, 0.5) + `<path d="M${cx - R1} ${cy - R1}H${cx - 8}V${cy + 4}H${cx - R1}Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.6, 0)}"/>` +
      `<path d="${knurl}" stroke="${P.mid}" stroke-width=".5"/>` + `<path d="${ticks}" stroke="${P.ink}" stroke-width=".4"/>` + nums +
      `<circle cx="${cx}" cy="${cy}" r="${R1 - 2.4}" fill="none" stroke="${P.gold}" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${R1 - 2.4}" fill="none" stroke="${P.goldD}" stroke-width=".3" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
      `</g>` +
      `<circle cx="${cx}" cy="${cy}" r="${R0}" fill="none" stroke="${P.ink}" stroke-width=".8"/>` +
      [45, 135, 225, 315].map((deg) => { const a = (deg * Math.PI) / 180, x = cx + Math.cos(a) * (R1 + 0.4), y = cy + Math.sin(a) * (R1 + 0.4); return `<circle cx="${f(x)}" cy="${f(y)}" r="2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="M${f(x - 1.2)} ${f(y)}H${f(x + 1.2)}" stroke="${P.goldD}" stroke-width=".5" transform="rotate(${deg} ${f(x)} ${f(y)})"/>` }).join('') +
      `<path d="M${cx - 24} ${cy - 18}A30 30 0 0 1 ${cx - 6} ${cy - 29.4}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      sparkle(90, 28, 2.6, '#fff') + sparkle(28, 88, 1.8, '#fff') +
      k.defs()
    )
  },

  // ── Reflejos ───────────────────────────────────────────────────────

  // Dos seguidas: desenfundás más rápido que el resto. El revólver recién sacado, con el fogonazo y el humo.
  'Gatillo fácil': (u) => {
    const k = kit(u)
    return (
      lata(k) +
      `<g transform="translate(60 60)">` + carta(k, [], true) + `</g>` +
      hair(30, 84, 36, 76, 40, 72, 0.7, DB_L) + hair(34, 90, 40, 82, 45, 78, 0.6, DB_L) + hair(40, 94, 46, 87, 51, 84, 0.5, DB_L) +
      `<g transform="translate(47 67) rotate(-14) scale(.8)">` + k.cast([GUN], 1.6, 2, DB_D) + revolver(k) + `</g>` +
      flash(78.6, 57.4, 5.4) + smoke(80, 52, 0.9) +
      `<text x="62" y="38" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.6" fill="${P.ink}" text-anchor="middle" transform="rotate(-10 62 38)">¡bang!</text>` +
      sparkle(32, 40, 1.8, '#fff') +
      k.defs()
    )
  },

  // Cuatro al hilo: más rápido que tu propia sombra. El revólver ya disparó; la sombra todavía lo tiene enfundado.
  'Lucky Luke': (u) => {
    const k = kit(u)
    const hol = 'M-6.4 -14H6.4C7 -6 6.2 4 4 12C3 15.4 -3 15.4 -4 12C-6.2 4 -7 -6 -6.4 -14Z'
    const flapSh = 'M-7.6 -16.6H7.6L6.8 -12.4H-6.8Z'
    // La sombra de la funda, proyectada sobre la carta, todavía con el revólver adentro (caño abajo, culata arriba).
    const shadow = `<g transform="translate(70 80) rotate(14) scale(1.1)" fill="${P.night}"><path d="${hol}"/><path d="${flapSh}"/>` +
      `<g transform="translate(-1.6 -10) rotate(96) scale(.66)"><path d="${GUN}"/></g></g>`
    return (
      lata(k) +
      `<g transform="translate(60 58)">` + carta(k, [], true) + `</g>` +
      k.clip(ellipse(60, 58, 25, 25), `<g opacity=".5">${shadow}</g>`) +
      `<path d="M10 58C24 60 34 62 44 66" fill="none" stroke="${P.ink}" stroke-width="5.6" stroke-linecap="round"/><path d="M10 58C24 60 34 62 44 66" fill="none" stroke="${CUERO}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M11 58.6C24 60.4 34 62.4 43.4 66.4" fill="none" stroke="${ARENA}" stroke-width=".4" stroke-dasharray=".9 .6"/>` +
      Array.from({ length: 3 }, (_, i) => `<ellipse cx="${24 + i * 6}" cy="${f(60.6 + i * 1.7)}" rx="1.1" ry="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35" transform="rotate(14 ${24 + i * 6} ${f(60.6 + i * 1.7)})"/>`).join('') +
      `<g transform="translate(43 77.4) rotate(10)">` + holster(k) + `</g>` +
      hair(40, 62, 42, 54, 47, 48, 0.7, P.white, 0.8) + hair(45, 64, 47, 57, 51, 52, 0.5, P.white, 0.7) +
      `<g transform="translate(56 40) rotate(-8) scale(.72)">` + k.cast([GUN], 1.6, 2, DB_D) + revolver(k, true) + `</g>` +
      flash(84.6, 35.6, 4.4) + smoke(85, 30.4, 0.7) +
      sparkle(30, 40, 1.8, '#fff') +
      k.defs()
    )
  },

  // Siete seguidas: bip bip y una nube de polvo. Quedaron las plumas cayendo y la polvareda, bajo una gloria de rayos.
  'Correcaminos': (u) => {
    const k = kit(u)
    return (
      lata(k) +
      k.sun(60, 60, 14, 50, 32, false) +
      k.shade(ellipse(60, 60, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.4) +
      `<path d="M10 92C40 88 80 88 112 92V112H10Z" fill="${ARENA_D}"/>` + k.shade('M10 92C40 88 80 88 112 92V112H10Z', k.lin(CUERO, 0, 0, 0, 1, 0, 0.8), CUERO, 0.4) +
      `<path d="M14 92C40 89 80 89 108 92" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      hair(66, 70, 82, 69.4, 100, 70, 0.8, '#fff', 0.9) + hair(70, 76, 86, 75.4, 104, 76, 0.7, '#fff', 0.8) + hair(62, 82, 80, 81.4, 98, 82, 0.6, '#fff', 0.7) +
      dust(k, 98, 76, 1.1) + dust(k, 80, 82, 1.35) + dust(k, 58, 86, 1.25) + dust(k, 40, 88, 0.95) + dust(k, 88, 66, 0.8) +
      `<g transform="translate(50 76) rotate(24)">` + feather(k, 34) + `</g>` +
      `<g transform="translate(72 60) rotate(-30)">` + feather(k, 24) + `</g>` +
      `<g transform="translate(34 58) rotate(58)">` + feather(k, 16) + `</g>` +
      `<text x="70" y="34" ${GEORGIA} font-style="italic" font-weight="700" font-size="6" fill="${P.ink}" text-anchor="middle" transform="rotate(-8 70 34)">¡bip bip!</text>` +
      sparkle(32, 36, 2, '#fff') + sparkle(92, 52, 1.6, '#fff') +
      k.defs()
    )
  },
}
