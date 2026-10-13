// Virus!: Cuerpo sano, Supercontagiador y Cirujano.
// El color propio del juego es el verde lima de su ficha: el fondo, la placa de Petri, el gel, los viriones y el bondi.
// Nada de los virus con caritas de las cartas: el virus es un objeto científico (la esfera con espículas, sin ojos) y
// los órganos son piezas limpias de maqueta, sin enfermos ni sangre.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El verde lima de la ficha (#7CB518), con su sombra y su luz, y el verde pálido del fondo.
const LIMA = '#7CB518', LIMA_D = '#4C760A', LIMA_L = '#C6E383'
const PALIDO = '#CDE5A0', PALIDO_G = '#A9CB6E'
// El papel madera de la etiqueta y de la faja del vaso.
const MADERA = '#E9D3A6'

/** Fondo de Virus: el papel con el verde lima pálido granulado hacia los bordes. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(PALIDO, 0.5, 0.46, 0.7, 0, 1), PALIDO_G, 0.5)

/** Placa de Petri: un disco verde clarito con el borde granulado y el doble filo del vidrio. */
const placa = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF6DE"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(PALIDO, 0.5, 0.5, 0.5, 0, 1), PALIDO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LIMA_D}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${f(r - 2.2)}" fill="none" stroke="#fff" stroke-width=".7" opacity=".7"/>` +
  `<path d="M${f(cx - r * 0.7)} ${f(cy - r * 0.55)}A${r - 3} ${r - 3} 0 0 1 ${f(cx - r * 0.1)} ${f(cy - r * 0.86)}" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional (tubos, elásticos, asas). */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Punto de una curva cúbica. */
const cub = (p: number[], t: number) => {
  const a = 1 - t
  return { x: a * a * a * p[0] + 3 * a * a * t * p[2] + 3 * a * t * t * p[4] + t * t * t * p[6], y: a * a * a * p[1] + 3 * a * a * t * p[3] + 3 * a * t * t * p[5] + t * t * t * p[7] }
}

/** Virión: esfera con espículas en forma de maza alrededor y, de frente, las cabezas de las que miran al ojo.
 * Centrado en (0,0) y de radio r. Sin cara: es un objeto de lámina científica. */
function virion(k: Kit, r: number, o: { n?: number; rot?: number; c?: string; d?: string; head?: string; detail?: boolean } = {}) {
  const n = o.n ?? 14, rot = o.rot ?? 0, c = o.c ?? LIMA, d = o.d ?? LIMA_D, head = o.head ?? P.gold
  const body = ellipse(0, 0, r, r)
  let stalks = '', heads = ''
  for (let i = 0; i < n; i++) {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a)
    const ln = i % 2 ? 1.34 : 1.42
    stalks += `M${f(ca * r * 0.9)} ${f(sa * r * 0.9)}L${f(ca * r * ln)} ${f(sa * r * ln)}`
    heads += `<ellipse cx="${f(ca * r * (ln + 0.08))}" cy="${f(sa * r * (ln + 0.08))}" rx="${f(r * 0.17)}" ry="${f(r * 0.12)}" transform="rotate(${f((Math.atan2(sa, ca) * 180) / Math.PI + 90)} ${f(ca * r * (ln + 0.08))} ${f(sa * r * (ln + 0.08))})" fill="${head}" stroke="${P.ink}" stroke-width="${f(Math.min(0.45, r * 0.04))}"/>`
  }
  const sw = Math.max(0.5, r * 0.1)
  const front = (o.detail ?? r > 6)
    ? [[-0.42, -0.32, 1], [0.12, -0.52, 0.9], [0.5, -0.06, 0.85], [-0.02, 0.06, 1], [-0.52, 0.32, 0.8], [0.3, 0.46, 0.85], [-0.2, -0.72, 0.6], [0.62, -0.46, 0.65], [-0.72, -0.08, 0.6], [-0.1, 0.62, 0.7], [0.66, 0.4, 0.6]]
        .map(([x, y, s]) => `<circle cx="${f(x * r)}" cy="${f(y * r)}" r="${f(r * 0.12 * s)}" fill="${head}" stroke="${P.ink}" stroke-width="${f(r * 0.025)}"/><circle cx="${f(x * r - r * 0.03)}" cy="${f(y * r - r * 0.03)}" r="${f(r * 0.04 * s)}" fill="#fff" opacity=".8"/>`).join('') +
      [[-0.2, -0.1], [0.3, 0.16], [-0.3, 0.6], [0.36, -0.3], [-0.6, 0.06], [0.08, 0.32]].map(([x, y]) => `<circle cx="${f(x * r)}" cy="${f(y * r)}" r="${f(r * 0.05)}" fill="${d}"/>`).join('')
    : ''
  return (
    `<path d="${stalks}" stroke="${P.ink}" stroke-width="${f(sw + 0.8)}" stroke-linecap="round"/><path d="${stalks}" stroke="${d}" stroke-width="${f(sw)}" stroke-linecap="round"/>` + heads +
    k.draw([{
      d: body, fill: c,
      inner:
        k.sh(body, 0, 0, 1, 1, 0, 0.95, d, 0.55) + `<path d="${ellipse(-r * 0.34, -r * 0.36, r * 0.5, r * 0.36)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.55, 0)}" transform="rotate(-38 ${f(-r * 0.34)} ${f(-r * 0.36)})"/>` +
        front + hair(-r * 0.86, r * 0.1, -r * 0.8, -r * 0.5, -r * 0.3, -r * 0.8, Math.max(0.4, r * 0.07), '#fff', 0.75),
    }], Math.min(0.7, 0.3 + r * 0.03))
  )
}

/** Corazón de maqueta anatómica, limpio: el cuerpo, el cayado de la aorta, la pulmonar y dos venas. Centro en (0,0). */
function heartOrgan(k: Kit) {
  const body = 'M-2 -8C4 -12 12 -10 13.4 -2C14.6 5 10 12 2 17C-1 18.6 -3 18.4 -4.4 16.6C-9.6 10 -14 4 -13.4 -2.6C-12.8 -8.6 -7.4 -10.6 -2 -8Z'
  const aorta = 'M-3.4 -7.6C-4.4 -13 -2 -17.6 3 -18C7.6 -18.4 10.4 -15 10 -10.4L6.4 -10.6C6.8 -13 5.6 -14.6 3.2 -14.4C.6 -14.2 -.2 -11.6 .4 -8.4Z'
  const pulm = 'M2.6 -9.2C3.4 -12 5.8 -13.6 8.6 -13.4L9.6 -10.4C7.6 -10.6 6.4 -9.8 6 -8.4Z'
  const vena = 'M-9.6 -6.4C-11.6 -9.6 -11.6 -12.6 -10.4 -14.6L-7.4 -13.6C-8.4 -11.6 -8 -9.4 -6.4 -7.8Z'
  const cap = (x: number, y: number, rx: number, ry: number, a: number, c: string) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="${c}" stroke="${P.ink}" stroke-width=".4"/>`
  return (
    k.draw([
      { d: vena, fill: P.blue, inner: k.sh(vena, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) },
      { d: aorta, fill: P.red, inner: k.sh(aorta, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + hair(-2.6, -10, -2.6, -15.4, 2.6, -16.6, 0.6, '#F49A8E') },
      { d: pulm, fill: P.sky, inner: k.sh(pulm, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) },
      {
        d: body, fill: P.red,
        inner:
          k.sh(body, 0, 0, 1, 1, 0, 0.95, P.wine, 0.55) + `<path d="${ellipse(-6, -2.6, 5.4, 4)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.6, 0)}" transform="rotate(-30 -6 -2.6)"/>` +
          hair(2.6, -6.4, 0, 4, -3.4, 15.6, 0.7, P.wine, 0.9) + hair(4.6, -5, 7, 0, 7.4, 6, 0.4, P.goldL, 0.8) + hair(-10.6, -1.4, -10, 4, -6.6, 9.6, 0.6, '#F49A8E', 0.8),
      },
    ], 0.6) +
    cap(10.2, -10.6, 1.9, 0.9, 5, P.wine) + cap(9.2, -11.9, 1.4, 0.7, 70, P.mid) + cap(-8.8, -14.2, 1.6, 0.8, 20, P.mid)
  )
}

export const VIRUS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Cuerpo sano ────────────────────────────────────────────────────

  // Tres ganadas: el barbijo de tres pliegues, con los viriones que rebotan.
  'Barbijo': (u) => {
    const k = kit(u)
    const mask =
      'M36.4 45C48 42.4 72 42.4 83.6 45L84.6 52.4L83.6 53.8L85 61L84 62.4L85.2 69.4L84.2 70.8L84.6 75.6C72 79.4 48 79.4 35.4 75.6' +
      'L35.8 70.8L34.8 69.4L36 62.4L35 61L36.4 53.8L35.4 52.4Z'
    const fold = (y: number) => `M35 ${y}C48 ${f(y + 2.2)} 72 ${f(y + 2.2)} 85 ${y}V${f(y + 2.4)}C72 ${f(y + 4.4)} 48 ${f(y + 4.4)} 35 ${f(y + 2.4)}Z`
    const folds = [52.6, 61.2, 69.6]
    const bind = (x0: number, x1: number) => `M${x0} 40H${x1}V80H${x0}Z`
    const loop = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` +
      rod('M84.4 47.4C92 44 98.4 48 97.4 58.4C96.6 66.4 90.4 73.6 84.6 73', P.white, 0.9, P.sky1) + `</g>`
    const bounce = (x: number, y: number, r: number, rot: number, d: string) => `<g transform="translate(${x} ${y})">` + virion(k, r, { n: 10, rot }) + `</g>` + d
    return (
      fondo(k) +
      placa(k, 60, 60, 33) +
      k.floor(60, 80, 28, 3, LIMA_D) +
      loop(1) + loop(-1) +
      k.draw([{
        d: mask, fill: P.sky,
        inner:
          k.sh(mask, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + `<path d="M34 42H50V80H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` +
          folds.map((y) => `<path d="${fold(y)}" fill="${P.blue}" opacity=".55"/><path d="M35 ${f(y - 0.6)}C48 ${f(y + 1.6)} 72 ${f(y + 1.6)} 85 ${f(y - 0.6)}" fill="none" stroke="#fff" stroke-width=".8" opacity=".9"/><path d="M35 ${f(y + 2.4)}C48 ${f(y + 4.4)} 72 ${f(y + 4.4)} 85 ${f(y + 2.4)}" fill="none" stroke="${P.mid}" stroke-width=".45"/>`).join('') +
          `<path d="${bind(35, 38.4)} ${bind(81.6, 85)}" fill="${P.white}"/>` + `<path d="M37.6 42V79M82.4 42V79" stroke="${P.blue}" stroke-width=".35" stroke-dasharray="1 .7"/>` +
          `<path d="M36 46.8C48 44.4 72 44.4 84 46.8" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray="1 .7"/><path d="M36 73.8C48 77 72 77 84 73.8" fill="none" stroke="${P.blue}" stroke-width=".35" stroke-dasharray="1 .7"/>` +
          k.sh('M70 42H86V80H70Z', 0, 0, 1, 0, 0, 0.6, P.mid, 0.35) +
          hair(44, 57, 52, 57.6, 60, 57.6, 0.4, P.blue, 0.8) + hair(62, 66, 70, 66.2, 78, 65.6, 0.4, P.blue, 0.8),
      }], 0.75) +
      // El alambre de la nariz, apenas marcado bajo la tela.
      `<path d="M50 45.2C56 44.2 64 44.2 70 45.2" fill="none" stroke="${P.sky1}" stroke-width="1.4" stroke-linecap="round"/><path d="M50 45.2C56 44.2 64 44.2 70 45.2" fill="none" stroke="${P.blue}" stroke-width=".4" transform="translate(0 .7)"/>` +
      bounce(40, 34, 3.6, 8, `<path d="M47.4 44C47 40.4 46 38.4 44.4 37" fill="none" stroke="${LIMA_D}" stroke-width=".6" stroke-dasharray="1 .9" stroke-linecap="round"/>`) +
      bounce(81, 33, 3, 20, `<path d="M73 43.6C74 40 75.6 37.6 77.6 35.8" fill="none" stroke="${LIMA_D}" stroke-width=".6" stroke-dasharray="1 .9" stroke-linecap="round"/>`) +
      sparkle(60, 30, 2.2, '#fff') + sparkle(88, 84, 1.4) +
      k.defs()
    )
  },

  // Doce ganadas: el frasco de alcohol en gel con el gel lima, y la gota que cae en tus manos de ganador.
  'Alcohol en gel': (u) => {
    const k = kit(u)
    const bottle = 'M46 58C46 53.6 49 50.6 53.6 49.6V45.4H66.4V49.6C71 50.6 74 53.6 74 58V92C74 94.4 72.4 96 70 96H50C47.6 96 46 94.4 46 92Z'
    const gel = 'M44 62C52 60.6 68 60.6 76 62V98H44Z'
    const collar = roundRect(51.4, 39.4, 68.6, 46.6, 1.4)
    const stem = 'M58.6 32.6H61.4V39.6H58.6Z'
    const head = 'M51 27.6C51 26.4 52 25.6 53.2 25.6H66C67.6 25.6 68.4 26.6 68.4 28V31.6C68.4 32.6 67.6 33.4 66.6 33.4H53.2C52 33.4 51 32.6 51 31.6Z'
    const nozzle = 'M51.4 27.6H40.6C39.4 27.6 38.6 28.4 38.6 29.6V30.8H51.4Z'
    const label = roundRect(49.4, 66.4, 70.6, 86.6, 1.2)
    const drop = 'M39.6 32.4C40.4 34.6 42.2 36.4 42.2 38.6C42.2 40.4 41 41.6 39.6 41.6C38.2 41.6 37 40.4 37 38.6C37 36.4 38.8 34.6 39.6 32.4Z'
    const bubbles = [[52, 70, 1.2], [67.6, 73, 0.9], [55, 90, 1], [69, 88, 1.3], [62, 92.6, 0.7], [50.4, 78, 0.6], [64.4, 64.8, 0.8], [57.6, 64.2, 0.5]]
    return (
      fondo(k) +
      k.sun(60, 60, 16, 46, 28, false) +
      k.shade(ellipse(60, 62, 26, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.65, 0), P.goldL, 0.4) +
      k.floor(61, 96, 19, 2.6, LIMA_D) +
      k.draw([{
        d: bottle, fill: '#F3F8EC',
        inner:
          `<path d="${gel}" fill="${LIMA_L}"/>` + k.sh(gel, 0, 0, 1, 0, 0, 0.9, LIMA, 0.5) + `<path d="M44 61.6C52 60.2 68 60.2 76 61.6" fill="none" stroke="${LIMA_D}" stroke-width=".55"/><path d="M45 62.8C52 61.6 68 61.6 75 62.8" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>` +
          bubbles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".75" stroke="${LIMA_D}" stroke-width=".25"/>`).join('') +
          k.sh(bottle, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) +
          `<path d="M48.6 56C48.4 70 48.6 82 49.4 93" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/><path d="M71.4 57C71.6 70 71.6 82 71 92" fill="none" stroke="${P.blue}" stroke-width=".5" opacity=".7"/>`,
      }], 0.75) +
      k.draw([{
        d: label, fill: P.white,
        inner: k.sh(label, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + `<path d="M49.4 69.4H70.6M49.4 83.6H70.6" stroke="${LIMA}" stroke-width="1"/>`,
      }], 0.4) +
      `<path d="M58.2 71.4H61.8V73.6H64V77.2H61.8V79.4H58.2V77.2H56V73.6H58.2Z" fill="${LIMA}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="60" y="82.6" ${GEORGIA} font-weight="700" font-size="3.4" fill="${P.ink}" text-anchor="middle">70%</text>` +
      k.draw([
        { d: collar, fill: P.white, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + [53.4, 55.8, 58.2, 60.6, 63, 65.4].map((x) => `<path d="M${x} 40V46" stroke="${P.sky2}" stroke-width=".55"/>`).join('') },
        { d: stem, fill: P.sky1, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: nozzle, fill: P.white, inner: k.sh(nozzle, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) },
        { d: head, fill: P.white, inner: k.sh(head, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M53 27.4H64" stroke="#fff" stroke-width=".8" stroke-linecap="round"/><path d="M53.6 31.6H66" stroke="${P.sky2}" stroke-width=".5"/>` },
      ], 0.65) +
      k.draw([{ d: drop, fill: LIMA_L, inner: k.sh(drop, 0, 0, 1, 1, 0, 0.9, LIMA, 0.5) + `<path d="M38.6 37.4C38.6 36.4 39 35.6 39.4 35" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` }], 0.45) +
      `<circle cx="34.6" cy="46" r="1.1" fill="${LIMA_L}" stroke="${P.ink}" stroke-width=".35"/><circle cx="34.3" cy="45.7" r=".35" fill="#fff"/>` +
      `<circle cx="81" cy="42" r="1.6" fill="#fff" opacity=".85" stroke="${P.blue}" stroke-width=".3"/><circle cx="85.4" cy="50" r="1.1" fill="#fff" opacity=".85" stroke="${P.blue}" stroke-width=".3"/><circle cx="80" cy="54.6" r=".7" fill="#fff" stroke="${P.blue}" stroke-width=".25"/>` +
      sparkle(84, 64, 2.2, '#fff') + sparkle(33, 66, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco ganadas: el café de la guardia, para llevar, con el estetoscopio de jefe colgado y la campana de oro.
  'Jefe de guardia': (u) => {
    const k = kit(u)
    const cup = 'M46.4 47.4H73.6L70.8 90.4C70.6 92 69.4 93 67.8 93H52.2C50.6 93 49.4 92 49.2 90.4Z'
    const sleeve = 'M47.4 60.6H72.6L71.4 79.4H48.6Z'
    const lid = 'M44.6 47.6C44.6 45.6 45.4 44.6 47 44.4L48.4 40.6H71.6L73 44.4C74.6 44.6 75.4 45.6 75.4 47.6C75.4 48.8 74.6 49.4 73.4 49.4H46.6C45.4 49.4 44.6 48.8 44.6 47.6Z'
    const lidTop = ellipse(60, 40.6, 11.6, 2.2)
    const ear = (x: number, y: number, r: number) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.5" transform="rotate(${r} ${x} ${y})" fill="${P.ink}"/><ellipse cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" rx="1.5" ry=".9" transform="rotate(${r} ${x} ${y})" fill="${P.mid}"/>`
    const tube = 'M44 90.4C49 95.4 56 96.6 63 95.8C71 95 76.4 92.4 79.6 88.6'
    const bell = ellipse(83.6, 85.6, 6.2, 6.2)
    const ribs = Array.from({ length: 9 }, (_, i) => { const x = 49.4 + i * 2.65; return `<path d="M${f(x)} 61V79" stroke="${P.brown}" stroke-width=".35" opacity=".7"/>` }).join('')
    return (
      fondo(k) +
      k.sun(60, 58, 16, 48, 28, false) +
      k.shade(ellipse(60, 60, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(3 -4)">` +
      k.floor(60, 93, 18, 2.6, LIMA_D) +
      k.draw([
        {
          d: cup, fill: P.white,
          inner:
            k.sh('M63 46C69 60 69 78 66 94H76V46Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + k.sh('M44 84H76V94H44Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
            `<path d="M50.6 50C50.6 62 51.2 76 52.6 89" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".95"/>` +
            `<path d="M49.4 88.4H70.6" stroke="${P.sky2}" stroke-width=".6"/>`,
        },
        {
          d: sleeve, fill: MADERA,
          inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.85, P.brown, 0.45) + ribs + `<path d="M47.6 62H72.4M48.4 78H71.6" stroke="${P.brownD}" stroke-width=".45"/>`,
        },
        {
          d: lid, fill: P.white,
          inner: k.sh(lid, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M45 47H75" stroke="${P.sky2}" stroke-width=".5"/><path d="M48 44.6H72" stroke="${P.sky2}" stroke-width=".45"/><path d="M47.4 46C52 45.6 56 45.6 58 45.8" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>`,
        },
        { d: lidTop, fill: P.white, inner: k.sh(lidTop, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) + `<path d="${roundRect(62.6, 39.4, 67.4, 41, 0.8)}" fill="${P.night}"/>` },
      ], 0.7) +
      `<path d="M57.6 63.4H62.4V67.6H66.6V72.4H62.4V76.6H57.6V72.4H53.4V67.6H57.6Z" fill="${LIMA}" stroke="${P.ink}" stroke-width=".45"/><path d="M58.2 64H61.4" stroke="${LIMA_L}" stroke-width=".5"/>` +
      `<text x="60" y="86.4" ${GEORGIA} font-style="italic" font-size="4.2" fill="${P.mid}" text-anchor="middle">jefe</text>` +
      hair(64.4, 37.6, 61, 31, 65, 25.6, 0.9, P.blue) + hair(67, 37.4, 70.6, 32, 67.4, 27, 0.7, P.blue) + hair(61.6, 38, 58.6, 34, 60, 30.4, 0.55, P.blue) +
      `</g>` +
      // El estetoscopio echado al pie del vaso: los auriculares de metal, el tubo que da la vuelta y la campana de oro.
      rod('M44 90.4C39.6 88.6 34.6 85.4 31.4 80.6', P.sky1, 1.5, '#fff') + rod('M44 90.4C41.4 86 39.4 80.6 39.2 75.4', P.sky1, 1.5, '#fff') + rod('M34.6 84.2L40.4 80.4', P.sky2, 0.7, '#fff') +
      ear(30.6, 79.2, 50) + ear(39.2, 73.8, 84) +
      rod(tube, P.mid, 2.4, P.sky) +
      `<circle cx="44" cy="90.4" r="1.6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".45"/>` +
      rod('M79.6 88.6L80.4 87.8', P.sky1, 1.4, '#fff') +
      k.cast([bell], 1.4, 1.6, LIMA_D) +
      k.draw([{
        d: bell, fill: P.gold,
        inner: k.sh(bell, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.55) + `<path d="${ellipse(81.6, 83.6, 2.6, 1.8)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.75, 0)}" transform="rotate(-30 81.6 83.6)"/>`,
      }], 0.6) +
      `<circle cx="83.6" cy="85.6" r="4.2" fill="${P.white}" stroke="${P.goldD}" stroke-width=".6"/>` + k.shade(ellipse(83.6, 85.6, 4.2, 4.2), k.lin(P.sky2, 0, 0, 1, 1, 0, 0.9), P.blue, 0.3) +
      `<circle cx="83.6" cy="85.6" r="2.8" fill="none" stroke="${P.sky2}" stroke-width=".35"/><circle cx="83.6" cy="85.6" r="1.4" fill="none" stroke="${P.sky2}" stroke-width=".3"/>` +
      `<circle cx="83.6" cy="85.6" r="5.3" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
      sparkle(47, 50, 2.2, '#fff') + sparkle(88, 50, 1.8) + sparkle(31, 60, 1.6) + sparkle(84, 72, 1.2, P.goldL) +
      k.defs()
    )
  },

  // ── Supercontagiador ───────────────────────────────────────────────

  // Cinco contagios: la caja de pañuelos ahí nomás, intacta, y el estornudo que le pasa por arriba.
  'Estornudo': (u) => {
    const k = kit(u)
    const front = 'M50 70.4H86V95H50Z'
    const side = 'M86 70.4L93 65V89.6L86 95Z'
    const top = 'M50 70.4L57 65H93L86 70.4Z'
    const slot = 'M60.6 68.6C62 66.6 80.6 66.6 82.4 68.6C80.6 69.6 62 69.6 60.6 68.6Z'
    const tissue = 'M62.4 68.4C61 62 63.8 56.4 67.6 53.6C69 57 72 57.6 74.4 55.8C76.4 59.6 80 60.4 81.4 58.6C82.4 62.6 81.2 66.4 80.4 68.4C75 69.6 68 69.6 62.4 68.4Z'
    const drops: [number, number, number][] = [[30, 46, 1.6], [37, 42, 1.2], [43, 47, 1.8], [36, 52, 1], [48, 40, 1.1], [52, 50, 1.3], [58, 44, 1.6], [63, 39, 0.9], [66, 47, 1.1], [72, 42, 1.4], [78, 47, 0.9], [44, 55, 0.8], [56, 37, 0.7], [84, 41, 1.1], [27, 52, 0.9]]
    const spray = [[22, 46, 40, 44, 58, 40], [22, 48, 44, 52, 70, 50], [22, 47, 46, 44, 80, 42]]
    return (
      fondo(k) +
      placa(k, 60, 62, 33) +
      k.floor(72, 95.6, 22, 2.8, LIMA_D) +
      k.draw([
        { d: side, fill: LIMA, inner: k.sh(side, 0, 0, 1, 0, 0.3, 1, LIMA_D, 0.5) + [69, 76, 83].map((y) => `<path d="M86 ${y + 1}L93 ${f(y - 4.4)}" stroke="${P.white}" stroke-width="1.2" opacity=".6"/>`).join('') },
        { d: top, fill: P.white, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) },
        {
          d: front, fill: LIMA,
          inner:
            k.sh(front, 0, 0, 1, 1, 0, 0.8, LIMA_D, 0.45) + `<path d="M48 70H56V96H48Z" fill="${k.lin(LIMA_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
            [74, 81, 88].map((y) => `<path d="M50 ${y}C56 ${y - 2} 62 ${y + 2} 68 ${y}S80 ${y - 2} 86 ${y}" fill="none" stroke="${P.white}" stroke-width="1.3" opacity=".7"/>`).join('') +
            `<path d="${roundRect(55, 76.4, 81, 87.6, 1.2)}" fill="${P.white}"/><path d="${roundRect(55, 76.4, 81, 87.6, 1.2)}" fill="none" stroke="${LIMA_D}" stroke-width=".5"/>`,
        },
      ], 0.75) +
      `<text x="68" y="83.6" ${GEORGIA} font-style="italic" font-size="5" fill="${LIMA_D}" text-anchor="middle">pañuelos</text>` +
      `<path d="${slot}" fill="${P.night}"/>` +
      k.draw([{ d: tissue, fill: P.white, inner: k.sh(tissue, 0, 0, 1, 1, 0, 0.7, P.sky2, 0.45) + hair(67.6, 54.6, 68.6, 61, 66.6, 67.6, 0.45, P.sky2) + hair(74.4, 57, 75.4, 62, 74, 67.6, 0.45, P.sky2) }], 0.5) +
      // El estornudo: la nube de gotitas con viriones que cruza de izquierda a derecha.
      spray.map(([x0, y0, cx, cy, x1, y1]) => hair(x0, y0, cx, cy, x1, y1, 0.6, P.blue, 0.55)).join('') +
      drops.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.35)}" fill="#fff"/>`).join('') +
      `<g transform="translate(46 43)">` + virion(k, 3.4, { n: 10, rot: 10 }) + `</g>` +
      `<g transform="translate(68.6 44.6)">` + virion(k, 2.8, { n: 9, rot: 30 }) + `</g>` +
      `<g transform="translate(83 46.4)">` + virion(k, 2.2, { n: 8 }) + `</g>` +
      `<text x="39" y="36" ${GEORGIA} font-style="italic" font-size="6.4" fill="${P.ink}" transform="rotate(-10 39 36)">¡achís!</text>` +
      sparkle(90, 58, 1.6) +
      k.defs()
    )
  },

  // Veinte contagios: el paciente cero, guardado bajo una campana de vidrio como pieza de museo, con su chapita.
  'Paciente cero': (u) => {
    const k = kit(u)
    const glass = 'M40.4 84V52C40.4 38 49 29.6 60 29.6C71 29.6 79.6 38 79.6 52V84Z'
    const knob = 'M57 30.4C57 27.6 58.2 26.2 60 26.2C61.8 26.2 63 27.6 63 30.4Z'
    const base = 'M33.4 85.4C33.4 83 38 82 60 82C82 82 86.6 83 86.6 85.4V91.6C86.6 94 82 95 60 95C38 95 33.4 94 33.4 91.6Z'
    const baseTop = ellipse(60, 84, 26.6, 2.4)
    const plaque = roundRect(51.4, 87.2, 68.6, 93, 0.8)
    return (
      fondo(k) +
      k.sun(60, 56, 15, 46, 28, false) +
      k.shade(ellipse(60, 58, 22, 22), k.rad(LIMA_L, 0.5, 0.5, 0.5, 0.9, 0), LIMA, 0.5) +
      k.floor(60, 95, 30, 3, LIMA_D) +
      k.draw([{
        d: base, fill: P.brown,
        inner: k.sh(base, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(36, 89, 48, 90, 60, 89.6, 0.45, P.brownD) + hair(64, 91, 74, 92, 84, 90.4, 0.45, P.brownD) + `<path d="M33.6 88.4C40 90 80 90 86.4 88.4" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".7"/>`,
      }, { d: baseTop, fill: P.brownD, inner: k.sh(baseTop, 0, 0, 1, 0, 0, 0.8, '#4A2C16', 0.4) }], 0.7) +
      k.draw([{ d: plaque, fill: P.gold, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.4) +
      `<text x="60" y="91.8" ${GEORGIA} font-weight="700" font-size="4" fill="${P.ink}" text-anchor="middle">N.º 0</text>` +
      `<circle cx="52.6" cy="90.1" r=".4" fill="${P.goldD}"/><circle cx="67.4" cy="90.1" r=".4" fill="${P.goldD}"/>` +
      // El paciente cero, flotando adentro.
      k.floor(60, 82.4, 9, 1.4, LIMA_D) +
      `<g transform="translate(60 59)">` + virion(k, 10.4, { n: 16, rot: 6 }) + `</g>` +
      // La campana: vidrio con brillos y el reflejo del contorno.
      `<path d="${glass}" fill="${P.sky1}" opacity=".22"/>` +
      k.clip(glass, `<path d="M40 30H52V84H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/><path d="M70 30H80V84H70Z" fill="${k.lin(P.blue, 0, 0, 1, 0, 0, 0.3)}"/>`) +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="${glass}" fill="none" stroke="#fff" stroke-width=".5" transform="translate(-.6 .4)" opacity=".7"/>` +
      `<path d="M45 76V52C45 43 49 37 54.6 34.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>` +
      `<path d="M48 70V60" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/><path d="M75 74V54C75 48 73.4 43 70.4 39.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".6"/>` +
      `<path d="M40.4 83.4C46 85.4 74 85.4 79.6 83.4" fill="none" stroke="${P.ink}" stroke-width=".9"/>` +
      k.draw([{ d: knob, fill: P.sky1, inner: k.sh(knob, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M58.4 29.6C58.4 28.4 58.8 27.6 59.4 27.2" fill="none" stroke="#fff" stroke-width=".6"/>` }], 0.5) +
      sparkle(36, 40, 2.2, '#fff') + sparkle(85, 52, 1.8) + sparkle(54, 46, 1.4, '#fff') +
      k.defs()
    )
  },

  // Sesenta contagios: el bondi de la línea 60 en hora pico, fileteado, con el vidrio empañado de lima.
  'Gripe del bondi': (u) => {
    const k = kit(u)
    const body = 'M31.6 40C31.6 33.4 35 30.4 41 30.2C50 29.8 70 29.8 79 30.2C85 30.4 88.4 33.4 88.4 40V88.6C88.4 90.6 87 92 85 92H35C33 92 31.6 90.6 31.6 88.6Z'
    const sign = roundRect(38.6, 32.6, 81.4, 39.4, 1)
    const winL = 'M35.4 42.6H58.8V63.6H36.6C35.8 63.6 35.2 63 35.2 62.2Z'
    const winR = 'M61.2 42.6H84.6L84.8 62.2C84.8 63 84.2 63.6 83.4 63.6H61.2Z'
    const grille = roundRect(48, 70, 72, 83, 1.6)
    const bumper = 'M29.6 86.6C29.6 85.4 30.4 84.6 31.6 84.6H88.4C89.6 84.6 90.4 85.4 90.4 86.6V90.2C90.4 91.4 89.6 92.2 88.4 92.2H31.6C30.4 92.2 29.6 91.4 29.6 90.2Z'
    const lamp = (x: number, r: number) => `<circle cx="${x}" cy="76" r="${f(r + 0.9)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${x}" cy="76" r="${r}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` + k.shade(ellipse(x, 76, r, r), k.rad('#ffffff', 0.35, 0.35, 0.6, 0.95, 0), '#ffffff', 0.4) + `<circle cx="${f(x - r * 0.35)}" cy="${f(76 - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`
    // Fileteado: volutas doradas con hojitas, a cada lado de la parrilla.
    const scroll = (sx: number) =>
      `<g transform="translate(60 0) scale(${sx} 1) translate(-60 0)">` +
      `<path d="M46.6 72C42 70.4 37.4 71.6 36.6 75.4C36 78.4 38.6 80.6 41 79.6C42.8 78.8 42.6 76.4 41 76.2" fill="none" stroke="${P.ink}" stroke-width="1.7" stroke-linecap="round"/>` +
      `<path d="M46.6 72C42 70.4 37.4 71.6 36.6 75.4C36 78.4 38.6 80.6 41 79.6C42.8 78.8 42.6 76.4 41 76.2" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M46 81.4C43 82.6 40 82.4 37.6 81" fill="none" stroke="${P.red}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="M44 73.4C45.2 71.6 47.4 71.2 48 72.4C47 73.8 45.4 74.2 44 73.4Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/></g>`
    const mist = [[44, 50, 3.2, 10], [52, 57, 2.4, 30], [70, 48, 2.8, 0], [78, 56, 2, 20], [40, 59, 1.6, 40], [66, 59, 1.8, 15]]
    return (
      fondo(k) +
      k.sun(60, 58, 16, 48) +
      k.shade(ellipse(60, 58, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(60, 93, 33, 3, LIMA_D) +
      k.draw([{
        d: body, fill: LIMA, line: 0.35,
        inner:
          k.sh(body, 0, 0, 1, 0, 0, 0.8, LIMA_D, 0.45) + `<path d="M30 30H40V92H30Z" fill="${k.lin(LIMA_L, 0, 0, 1, 0, 0.75, 0)}"/>` +
          `<path d="M31 64.6H89V69.4H31Z" fill="${P.paper}"/><path d="M31 65.8H89" stroke="${P.red}" stroke-width=".7"/><path d="M31 68.2H89" stroke="${P.red}" stroke-width=".4"/>` +
          `<path d="M31.6 40.6H88.4" stroke="${LIMA_D}" stroke-width=".6"/>` + k.sh('M30 82H90V92H30Z', 0, 0, 0, 1, 0, 0.6, LIMA_D, 0.35),
      }], 0.85) +
      k.draw([{ d: sign, fill: P.night, inner: k.sh(sign, 0, 0, 1, 0, 0, 0.5, '#0B1230', 0.3) }], 0.4) +
      `<rect x="40" y="33.6" width="8.6" height="4.8" rx=".5" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="44.3" y="37.6" ${GEORGIA} font-weight="700" font-size="4.4" fill="${P.ink}" text-anchor="middle">60</text>` +
      `<text x="65" y="37.4" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.goldL}" text-anchor="middle">hora pico</text>` +
      [winL, winR].map((w) => `<path d="${w}" fill="${P.mid}"/>` + k.clip(w, `<path d="M34 42H86V64H34Z" fill="${k.lin(LIMA_L, 0, 0, 0, 1, 0.25, 0.95)}"/>` + k.shade(w, k.lin(LIMA, 0, 0, 0, 1, 0, 0.7), LIMA, 0.3) +
        mist.map(([x, y, r, rot]) => `<g transform="translate(${x} ${y})" opacity=".55">` + virion(k, r, { n: 9, rot, c: LIMA_D, d: '#2F4A06', head: LIMA_D, detail: false }) + `</g>`).join('') +
        `<path d="M37 45L44 45L39 61H35Z" fill="#fff" opacity=".45"/><path d="M63 45H67L63.4 61H61.4Z" fill="#fff" opacity=".35"/>`) + `<path d="${w}" fill="none" stroke="${P.ink}" stroke-width=".6"/>`).join('') +
      `<path d="M40 63L52 51.4M66 63L78 51.4" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="M40 63L52 51.4M66 63L78 51.4" stroke="${P.sky2}" stroke-width=".45" stroke-linecap="round"/>` +
      k.draw([{
        d: grille, fill: P.sky1,
        inner: k.sh(grille, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + [72.6, 75.2, 77.8, 80.4].map((y) => `<path d="M48 ${y}H72" stroke="${P.mid}" stroke-width=".8"/><path d="M48 ${f(y - 0.6)}H72" stroke="#fff" stroke-width=".4"/>`).join(''),
      }], 0.55) +
      `<circle cx="60" cy="76.4" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="${'M60 74.2L60.6 75.8H62.2L60.9 76.7L61.4 78.3L60 77.3L58.6 78.3L59.1 76.7L57.8 75.8H59.4Z'}" fill="${P.goldL}"/>` +
      scroll(1) + scroll(-1) +
      lamp(36.8, 2.4) + lamp(83.2, 2.4) +
      k.draw([{ d: bumper, fill: P.sky1, inner: k.sh(bumper, 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M31 86.2H89" stroke="#fff" stroke-width=".7"/>` }], 0.6) +
      `<rect x="54.4" y="86.4" width="11.2" height="4" rx=".5" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><path d="M55.6 88.4H64.4" stroke="${P.mid}" stroke-width=".5" stroke-dasharray="1.2 .6"/>` +
      // Viriones que salen por las ventanillas de los costados.
      `<g transform="translate(30.4 47)">` + virion(k, 3.2, { n: 10, rot: 12 }) + `</g>` +
      `<g transform="translate(89.6 44.4)">` + virion(k, 2.8, { n: 9, rot: 30 }) + `</g>` +
      
      sparkle(60, 22.6, 2.2, '#fff') + sparkle(26, 70, 1.4) +
      k.defs()
    )
  },

  // ── Cirujano ───────────────────────────────────────────────────────

  // Tres transplantes: el riñón de maqueta, con la etiqueta de préstamo atada al uréter.
  'Riñón prestado': (u) => {
    const k = kit(u)
    const kidney = 'M58 35.6C48 33.6 37.6 40 35.6 52C33.6 64 37.6 78 48 84C56 88.6 66 86 70 78C73 72 70 66 65 63C61 60.6 60 57.4 62 54C65 49 66 39 58 35.6Z'
    const tag = 'M-3.6 -4.6H13.6L16.6 -1.6V1.6L13.6 4.6H-3.6Z'
    return (
      fondo(k) +
      placa(k, 60, 60, 33) +
      k.floor(55, 88, 20, 2.8, LIMA_D) +
      // Arteria, vena y uréter, saliendo del hilio.
      rod('M63.6 56C68 54 72 50.6 75 46.4', P.red, 3.4, '#F49A8E') + `<ellipse cx="75.2" cy="46.2" rx="2" ry="1.2" transform="rotate(-55 75.2 46.2)" fill="${P.wine}" stroke="${P.ink}" stroke-width=".4"/>` +
      rod('M64.4 60C69 59.4 74 59.4 78.6 58.4', P.blue, 3.2, P.sky) + `<ellipse cx="78.8" cy="58.4" rx="1.8" ry="1.2" transform="rotate(-80 78.8 58.4)" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/>` +
      rod('M64 63.4C69 66 72 72 72.6 80C72.8 84 73.4 88 74.6 91', MADERA, 2, '#fff') +
      k.draw([{
        d: kidney, fill: P.red,
        inner:
          k.sh(kidney, 0, 0, 1, 1, 0, 0.95, P.wine, 0.55) + `<path d="${ellipse(45, 50, 6.6, 10)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.55, 0)}" transform="rotate(20 45 50)"/>` +
          hair(41, 46, 38.6, 58, 42, 72, 0.9, '#F49A8E', 0.9) + hair(60, 40, 64.6, 46, 62.6, 52, 0.6, P.wine) + hair(64, 66.4, 67.6, 72, 66, 78, 0.6, P.wine) +
          hair(48, 42, 52, 39.6, 56, 39.4, 0.5, '#F49A8E', 0.8) + hair(46, 80, 52, 83.4, 58, 83, 0.5, P.wine, 0.8),
      }], 0.8) +
      `<path d="M63.4 54.4C61 57.6 61.2 61 64.2 63.6" fill="none" stroke="${P.wine}" stroke-width=".9" stroke-linecap="round"/>` +
      // La etiqueta de préstamo, de papel madera, atada con hilo.
      `<path d="M72.6 78C76 77 79 75.4 80.6 73.6" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(80.6 73.6) rotate(-150) translate(-13.4 0)">` +
      k.draw([{ d: tag, fill: MADERA, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.75, P.brown, 0.4) + `<path d="M-2 -3.2H12.4M-2 3.2H12.4" stroke="${P.brown}" stroke-width=".3" stroke-dasharray=".8 .5"/>` }], 0.45) +
      `<circle cx="13.4" cy="0" r="1.2" fill="${P.white}" stroke="${P.brown}" stroke-width=".5"/><circle cx="13.4" cy="0" r=".5" fill="${PALIDO_G}"/>` +
      `<text x="4.6" y="1.1" ${GEORGIA} font-style="italic" font-weight="700" font-size="3" fill="${P.red}" text-anchor="middle" transform="rotate(180 4.6 0)">prestado</text>` +
      `</g>` +
      sparkle(38, 36, 2.2, '#fff') + sparkle(84, 40, 1.6) + sparkle(45.6, 48, 1.4, '#fff') +
      k.defs()
    )
  },

  // Diez transplantes: la heladerita de playa abierta, con el hielo y un corazón de maqueta adentro.
  'Corazón en heladerita': (u) => {
    const k = kit(u)
    const front = 'M33.6 66H86.4V90.6C86.4 92.6 85 94 83 94H37C35 94 33.6 92.6 33.6 90.6Z'
    const rimTop = 'M33.6 66L38.6 61.4H81.4L86.4 66Z'
    const inside = 'M38 62.6H82L85 65.4H35Z'
    const lid = 'M37.6 61.4L35.4 43.6C35.2 42 36.2 41 37.8 41H82.2C83.8 41 84.8 42 84.6 43.6L82.4 61.4Z'
    const band = 'M33.6 70H86.4V74.4H33.6Z'
    const cube = (x: number, y: number, s: number, r: number) => {
      const d = roundRect(-s, -s, s, s, s * 0.3)
      return `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.sky, 0.45) + `<path d="M${f(-s * 0.6)} ${f(-s * 0.2)}L${f(-s * 0.2)} ${f(-s * 0.6)}" stroke="#fff" stroke-width=".7" stroke-linecap="round"/>` }], 0.4) + `</g>`
    }
    return (
      fondo(k) +
      placa(k, 60, 60, 33) +
      k.floor(60, 94.6, 30, 3, LIMA_D) +
      k.draw([{
        d: lid, fill: P.white,
        inner: k.sh(lid, 0, 0, 1, 1, 0, 0.75, P.blue, 0.4) + `<path d="${roundRect(39.6, 44.4, 80.4, 58.6, 2)}" fill="none" stroke="${P.sky2}" stroke-width=".7"/>` + `<path d="M40.6 46.4C50 45.4 62 45.2 72 45.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` +
          `<path d="M54.4 49.4H57.6V46.8H62.4V49.4H65.6V54.2H62.4V56.8H57.6V54.2H54.4Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/>`,
      }], 0.65) +
      `<path d="${inside}" fill="${P.sky2}"/>` +
      cube(42.6, 62.4, 3, 12) + cube(49.6, 61.4, 2.8, -10) + cube(73, 61.6, 3, 18) + cube(79.4, 62.6, 2.6, -6) +
      `<g transform="translate(61 56.4) rotate(-12) scale(.84)">` + heartOrgan(k) + `</g>` +
      cube(66.8, 63.4, 2.6, 30) + cube(55, 64, 2.4, 8) +
      k.draw([
        { d: rimTop, fill: P.white, inner: k.sh(rimTop, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) },
        {
          d: front, fill: LIMA,
          inner:
            k.sh(front, 0, 0, 1, 1, 0, 0.85, LIMA_D, 0.5) + `<path d="M32 66H42V95H32Z" fill="${k.lin(LIMA_L, 0, 0, 1, 0, 0.7, 0)}"/>` +
            `<path d="${band}" fill="${P.white}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + `<path d="M33.6 70H86.4M33.6 74.4H86.4" stroke="${P.ink}" stroke-width=".35"/>` +
            hair(40, 80, 44, 82, 48, 86, 0.5, LIMA_D) + `<path d="M36 92.6H84" stroke="${LIMA_D}" stroke-width=".6"/>`,
        },
      ], 0.75) +
      // Asa abatida a los costados.
      rod('M33.4 74C29.6 76 28.6 82 31 86.6', P.sky1, 1.3, '#fff') + rod('M86.6 74C90.4 76 91.4 82 89 86.6', P.sky1, 1.3, '#fff') +
      `<circle cx="33.8" cy="73.6" r="1.3" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><circle cx="86.2" cy="73.6" r="1.3" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="60" y="73.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="3.3" fill="${P.red}" text-anchor="middle">frágil · órgano</text>` +
      hair(46, 58.6, 43, 54, 46, 49.6, 0.7, P.sky, 0.9) + hair(76, 58.6, 79, 54, 76.4, 49.4, 0.6, P.sky, 0.9) + hair(70, 57, 72, 53.4, 70.4, 50, 0.45, P.sky, 0.8) +
      sparkle(88, 40, 2, '#fff') + sparkle(32, 54, 1.6) +
      k.defs()
    )
  },

  // Treinta transplantes: el corazón de remiendos, cosido con los cuatro colores del juego y con los bulones al aire.
  'Frankenstein': (u) => {
    const k = kit(u)
    const heart = 'M60 93C52 87 34.6 75 34 59C33.4 48.6 39.6 41.6 47.6 41.6C53.4 41.6 57.6 45 60 49.6C62.4 45 66.6 41.6 72.4 41.6C80.4 41.6 86.6 48.6 86 59C85.4 75 68 87 60 93Z'
    const X = [60.6, 63]
    const vTop = [60, 49.6, 58.4, 55, 59.4, 59.6, X[0], X[1]]
    const vBot = [X[0], X[1], 62, 72, 58, 80, 60, 96]
    const hL = [20, 60, 40, 56, 50, 66, X[0], X[1]]
    const hR = [X[0], X[1], 70, 60, 80, 66, 100, 59]
    const TL = 'M20 30H60L60 49.6C58.4 55 59.4 59.6 60.6 63C50 66 40 56 20 60Z'
    const TR = 'M60 30H100V59C80 66 70 60 60.6 63C59.4 59.6 58.4 55 60 49.6Z'
    const BL = 'M20 60C40 56 50 66 60.6 63C62 72 58 80 60 96H20Z'
    const BR = 'M60.6 63C70 60 80 66 100 59V96H60C58 80 62 72 60.6 63Z'
    // Texturas de cada remiendo: fibras (corazón), celdillas (estómago), circunvoluciones (cerebro), poros (hueso).
    const fibers = [0, 1, 2, 3, 4, 5].map((i) => hair(38 + i * 3.4, 48 + i * 0.6, 42 + i * 3.2, 54, 40 + i * 3.6, 62 - i * 0.2, 0.45, P.wine, 0.8)).join('')
    const cells = [[66, 50], [71, 48], [76, 51], [81, 54], [68, 55.4], [73.6, 56], [79, 59], [83.4, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="none" stroke="${LIMA_D}" stroke-width=".45"/><circle cx="${x}" cy="${y}" r=".4" fill="${LIMA_D}"/>`).join('')
    const folds = [[38, 66, 44, 63, 46, 68], [44, 72, 50, 68, 54, 72], [42, 78, 48, 76, 52, 80], [50, 84, 54, 80, 58, 84], [36, 70, 38, 74, 42, 74]].map(([x0, y0, cx, cy, x1, y1]) => `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}T${f(x1 + (x1 - cx))} ${f(y1 - (cy - y1) * 0.3)}" fill="none" stroke="${P.mid}" stroke-width=".5"/>`).join('')
    const pores = [[66, 68], [70, 72], [75, 69], [79, 66], [67, 78], [72, 80], [63, 86], [76, 75], [82, 64]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${0.6 + (i % 3) * 0.25}" ry=".5" fill="${P.goldD}"/>`).join('')
    const stitches = (p: number[], n: number) => Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n, q = cub(p, t), q2 = cub(p, Math.min(1, t + 0.01)), dx = q2.x - q.x, dy = q2.y - q.y, l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * 1.7, ny = (dx / l) * 1.7
      return `M${f(q.x - nx - dx / l * 0.6)} ${f(q.y - ny - dy / l * 0.6)}L${f(q.x + nx + dx / l * 0.6)} ${f(q.y + ny + dy / l * 0.6)}M${f(q.x - nx + dx / l * 0.6)} ${f(q.y - ny + dy / l * 0.6)}L${f(q.x + nx - dx / l * 0.6)} ${f(q.y + ny - dy / l * 0.6)}`
    }).join('')
    const seamD = (p: number[]) => `M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`
    const seams = [vTop, vBot, hL, hR].map(seamD).join('')
    const st = stitches(vTop, 4) + stitches(vBot, 7) + stitches(hL, 7) + stitches(hR, 7)
    // Bulón con tuerca, saliendo del costado (hacia −x), con la base en (0,0).
    const bolt = (x: number, y: number, sx: number) =>
      `<g transform="translate(${x} ${y}) scale(${sx} 1)">` +
      k.draw([
        { d: 'M0 -2.2H-7V2.2H0Z', fill: P.sky1, inner: k.sh('M0 -2.2H-7V2.2H0Z', 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M-6.6 -1.2H-.4" stroke="#fff" stroke-width=".5"/>` + [-1.6, -3.2, -4.8].map((xx) => `<path d="M${xx} -2.2L${xx - 0.8} 2.2" stroke="${P.blue}" stroke-width=".35"/>`).join('') },
        { d: 'M-7 -4.4H-10.6V4.4H-7Z', fill: P.sky1, inner: k.sh('M-7 -4.4H-10.6V4.4H-7Z', 0, 0, 0, 1, 0, 0.9, P.blue, 0.5) + `<path d="M-10.6 -1.4H-7M-10.6 1.4H-7" stroke="${P.blue}" stroke-width=".4"/><path d="M-10 -4H-9.2V4H-10Z" fill="#fff" opacity=".7"/>` },
        { d: 'M1.6 -3.4H0V3.4H1.6Z', fill: P.sky2 },
      ], 0.5) + `</g>`
    const zap = (pts: number[][]) => {
      const d = 'M' + pts.map(([x, y]) => `${x} ${y}`).join('L')
      return `<path d="${d}" fill="none" stroke="${P.goldL}" stroke-width="3.6" stroke-linejoin="round" opacity=".35"/><path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width=".4" stroke-linejoin="round"/>`
    }
    return (
      k.night() +
      k.shade(ellipse(60, 64, 34, 32), k.rad(LIMA, 0.5, 0.5, 0.5, 0.75, 0), LIMA, 0.45) +
      laurel(50, 100, 30, 94, 26, 70, 7) + laurel(70, 100, 90, 94, 94, 70, 7, true) +
      zap([[42, 27], [36, 38], [41, 39], [30.6, 52.6]]) + zap([[78, 27], [84, 38], [79, 39], [89.4, 52.6]]) +
      bolt(34.6, 60, 1) + bolt(85.4, 60, -1) +
      k.cast([heart], 2.4, 2.4, '#0B1230') +
      k.draw([{
        d: heart, fill: P.red,
        inner:
          `<path d="${TL}" fill="${P.red}"/>` + k.sh(TL, 0, 0, 1, 1, 0, 0.45, P.wine, 0.35) + fibers +
          `<path d="${TR}" fill="${LIMA}"/>` + k.sh(TR, 0, 0, 1, 1, 0, 0.5, LIMA_D, 0.35) + cells +
          `<path d="${BL}" fill="${P.sky}"/>` + k.sh(BL, 0, 0, 1, 1, 0, 0.5, P.blue, 0.35) + folds +
          `<path d="${BR}" fill="${P.gold}"/>` + k.sh(BR, 0, 0, 1, 1, 0, 0.5, P.goldD, 0.35) + pores +
          k.sh(heart, 0, 0, 1, 1, 0, 0.6, P.mid, 0.25) +
          `<path d="${ellipse(46, 50, 6, 3.6)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.7, 0)}" transform="rotate(-35 46 50)"/><path d="${ellipse(72, 49, 4, 2.4)}" fill="${k.rad('#ffffff', 0.5, 0.5, 0.5, 0.55, 0)}" transform="rotate(-25 72 49)"/>` +
          `<path d="${seams}" fill="none" stroke="${P.ink}" stroke-width=".9"/><path d="${st}" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><path d="${st}" stroke="${P.paper}" stroke-width=".4" stroke-linecap="round"/>`,
      }], 0.85) +
      sparkle(31.6, 56, 2.6, P.goldL) + sparkle(88.4, 56, 2.6, P.goldL) + sparkle(60, 24, 1.8, '#fff') + sparkle(36, 30, 1.2, '#fff') + sparkle(84, 32, 1.2, '#fff') +
      k.defs()
    )
  },
}
