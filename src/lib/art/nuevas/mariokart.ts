// Mario Kart: Piloto, Blanco del azul y Kamikaze del arcoíris, en clave heroica.
// El color propio del juego es el coral de su ficha (#FF6B6B): el papel granulado, la carrocería de los karts y de
// las cupecitas. Nada del juego tal cual: ni el plomero, ni la nube con anteojos, ni los caparazones. Un kart
// genérico, un rayo azul (la amenaza que viene de atrás), una nube con caña, una piñata. Fangio y el Turismo
// Carretera aparecen por sus objetos: el casco con antiparras, el volante de madera y las cupecitas de época.
import { f } from '../helpers'
import { ellipse, hair, kit, P, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** El coral de la ficha de Mario Kart, con su sombra, su luz y el grano del fondo. */
const MK = '#FF6B6B', MK_D = '#C2404A', MK_L = '#FFC5BD', MK_G = '#F08C84'
/** El gris del asfalto y el violeta del arcoíris. */
const ASF = '#5A6380', ASF_D = '#363D57'
const VIO = '#8A6BC0'

/** Papel con el coral granulado hacia los bordes: el cielo de Mario Kart. */
const fondo = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(MK_L, 0.5, 0.46, 0.7, 0, 1), MK_G, 0.5)

/** Escenario coral: un disco claro con el borde granulado. */
const escenario = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FDEBE6"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(MK_L, 0.5, 0.5, 0.5, 0, 1), MK_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${MK}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada (caña, tanza, piolín, mástil): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Rueda: cubierta con dibujo, llanta de rayos y maza dorada. `far` la pinta más oscura (la del otro lado). */
function wheel(k: Kit, x: number, y: number, r: number, far = false, rimC: string = P.sky1) {
  const tire = ellipse(x, y, r, r), rr = r * 0.56, rim = ellipse(x, y, f(rr), f(rr))
  const tread = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    return `M${f(x + Math.cos(a) * r * 0.8)} ${f(y + Math.sin(a) * r * 0.8)}L${f(x + Math.cos(a + 0.12) * r * 1.02)} ${f(y + Math.sin(a + 0.12) * r * 1.02)}`
  }).join('')
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    return `M${f(x + Math.cos(a) * rr * 0.3)} ${f(y + Math.sin(a) * rr * 0.3)}L${f(x + Math.cos(a) * rr * 0.92)} ${f(y + Math.sin(a) * rr * 0.92)}`
  }).join('')
  return (
    k.draw([{
      d: tire, fill: far ? P.mid : P.night,
      inner: `<path d="${tread}" stroke="${far ? P.blue : P.mid}" stroke-width="${f(r * 0.13)}"/>` + k.sh(tire, 0, 0, 1, 1, 0, 0.85, '#0B1226', 0.5) +
        (far ? '' : hair(x - r * 0.84, y + r * 0.1, x - r * 0.8, y - r * 0.7, x - r * 0.1, y - r * 0.86, f(r * 0.09), P.sky, 0.8)),
    }], 0.55) +
    k.draw([{ d: rim, fill: far ? P.blue : rimC, inner: k.sh(rim, 0, 0, 1, 1, 0, 0.9, far ? P.mid : P.blue, 0.5) + `<path d="${spokes}" stroke="${far ? P.mid : P.blue}" stroke-width="${f(r * 0.1)}" stroke-linecap="round"/>` }], 0.3) +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.17)}" fill="${far ? P.goldD : P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Kart genérico de perfil hacia la derecha, con el piso en y=0: trompa alta, pontón, butaca, motor y caño de escape. */
function kart(k: Kit, num = '1', color: string = MK, dark: string = MK_D) {
  const body = 'M-21.4 -9.6C-21.6 -12.6 -20.2 -14.6 -17.6 -14.6H1.6C4.4 -14.6 6.6 -15.4 9.2 -17C12.8 -19.2 17.4 -19.6 21.6 -18C26 -16.4 29.8 -13.2 31.6 -9.8C32.2 -8.6 31.6 -7.2 30.2 -7.2H-19.8C-20.8 -7.2 -21.4 -8.2 -21.4 -9.6Z'
  const pod = 'M-5.6 -13.4H10.2C11.8 -13.4 12.8 -12.2 12.6 -10.8L12 -7.2C11.8 -5.8 10.8 -4.8 9.4 -4.8H-5C-6.4 -4.8 -7.4 -5.8 -7.6 -7.2L-8 -10.8C-8.2 -12.2 -7.2 -13.4 -5.6 -13.4Z'
  const seat = 'M-13.6 -14.6C-14.6 -19.6 -14.2 -25.6 -11.6 -27.4C-9.8 -28.4 -7.6 -27.8 -7.2 -25.8L-6 -14.6Z'
  const engine = 'M-25.4 -21.6H-16.4C-15.6 -21.6 -15 -21 -15 -20.2V-14.6H-25.4C-26.2 -14.6 -26.8 -15.2 -26.8 -16V-20.2C-26.8 -21 -26.2 -21.6 -25.4 -21.6Z'
  const fins = [-20, -18.4, -16.8].map((y) => `M-26.6 ${y}H-15.2`).join('')
  const bumperR = 'M-25.6 -11.4H-21.2V-6.2H-25.6C-26.4 -6.2 -26.8 -6.8 -26.8 -7.4V-10.2C-26.8 -10.8 -26.4 -11.4 -25.6 -11.4Z'
  const bumperF = 'M30.8 -9.8H33.6C34.4 -9.8 34.8 -9.2 34.8 -8.6V-6.6C34.8 -6 34.4 -5.4 33.6 -5.4H30.8Z'
  return (
    wheel(k, -12.6, -9.2, 7.6, true) + wheel(k, 19.4, -7.6, 6, true) +
    rod('M-22 -15.4C-25 -15.6 -28.6 -17 -31 -20.4', P.sky1, 1.8) + `<path d="M-31.6 -21.2L-30 -19.4" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/>` +
    k.draw([
      { d: engine, fill: P.sky2, inner: k.sh(engine, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="${fins}" stroke="${P.mid}" stroke-width=".5"/>` + `<path d="M-26 -21H-21" stroke="#fff" stroke-width=".5"/>` },
      { d: seat, fill: P.night, inner: k.sh(seat, 0, 0, 1, 0, 0, 0.8, '#0B1226', 0.5) + hair(-12.6, -17, -13.4, -22, -11, -26.4, 0.6, P.blue) + `<path d="M-13.8 -19.6H-6.6M-14 -22.4H-7" stroke="${P.mid}" stroke-width=".35"/>` },
    ], 0.55) +
    rod('M5 -15L10 -23.2', P.sky2, 1) +
    `<ellipse cx="10.6" cy="-24.2" rx="1.6" ry="4.6" transform="rotate(-24 10.6 -24.2)" fill="none" stroke="${P.ink}" stroke-width="2.2"/><ellipse cx="10.6" cy="-24.2" rx="1.6" ry="4.6" transform="rotate(-24 10.6 -24.2)" fill="none" stroke="${P.night}" stroke-width="1"/>` +
    k.draw([{
      d: body, fill: color,
      inner: k.sh(body, 0, 0, 0, 1, 0.05, 0.9, dark, 0.5) + `<path d="M-22 -16H32V-13C20 -13.6 6 -12 -22 -12Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.45, 0)}"/>` +
        hair(10, -16.4, 16, -18.6, 23, -17.4, 0.7, '#fff', 0.85) + hair(-18, -13.6, -8, -13.8, 2, -13.8, 0.5, '#fff', 0.6),
    }, {
      d: pod, fill: color,
      inner: k.sh(pod, 0, 0, 1, 1, 0, 0.95, dark, 0.5) + `<path d="M-8 -11.4H12.6M-7.8 -9.2H12.4" stroke="${P.white}" stroke-width=".9"/>` + hair(-5, -12.4, 2, -12.8, 9, -12.4, 0.5, '#fff', 0.7),
    }], 0.65) +
    `<circle cx="23.8" cy="-12" r="3.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/><text x="23.8" y="-10.4" ${GEORGIA} font-weight="700" font-size="4.6" fill="${P.ink}" text-anchor="middle">${num}</text>` +
    wheel(k, -15, -7.6, 7.6) + wheel(k, 16.6, -6, 6) +
    k.draw([{ d: bumperR, fill: P.sky1, inner: k.sh(bumperR, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }, { d: bumperF, fill: P.sky1, inner: k.sh(bumperF, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }], 0.45)
  )
}

/** Casco de kart de perfil hacia la derecha, centrado en (0,0): calota, visor ahumado y una cinta de papel. */
function kartHelmet(k: Kit) {
  const shell = 'M-11.4 4.6C-12.6 -5.6 -6.6 -12.6 1 -12.6C8.6 -12.6 12.8 -7.4 12.8 -.2C12.8 3.4 11.8 6.6 9.8 8.6H-8.4C-10.2 8.6 -11.2 7 -11.4 4.6Z'
  const visor = 'M1.6 -4.2C5 -5.6 9.4 -5.2 12.2 -3C12.8 -.8 12.4 1.6 11.6 3.4H2.8C1.2 1.6 1 -2.4 1.6 -4.2Z'
  const tape = 'M-9.6 -6.6L-3.4 -11.2L-1.6 -8.8L-7.8 -4.2Z'
  return (
    k.draw([{
      d: shell, fill: P.white,
      inner: k.sh('M2 -14H14V10H2Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.45) + k.sh('M-13 4H14V10H-13Z', 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) +
        `<path d="M-11.6 1.4C-6 -1 0 -1.6 4 -1.2" fill="none" stroke="${MK}" stroke-width="2.2"/><path d="M-11.6 3.6C-6 1.2 0 .6 3 .8" fill="none" stroke="${P.gold}" stroke-width="1.1"/>` +
        hair(-8.6, -4, -7.6, -9.6, -1.6, -11.6, 0.9, '#fff') +
        `<path d="M-6 5.6L-4.6 4.4M-3.4 6.4L-2.2 5" stroke="${P.blue}" stroke-width=".35"/>`,
    }, {
      d: visor, fill: P.night,
      inner: `<path d="${visor}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.9, 0)}"/>` + hair(3, -3.4, 7, -4.6, 11, -3, 0.7, '#fff', 0.85) + hair(3.6, 1.6, 7, 2, 10.6, 1.4, 0.4, P.blue),
    }], 0.7) +
    `<path d="M-11 8.6H9.6L9 10.2H-10.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/>` +
    k.draw([{ d: tape, fill: P.paper, inner: `<path d="M-8.4 -6.2L-3.4 -9.8" stroke="${P.blue}" stroke-width=".35" stroke-dasharray="1 .5"/>` }], 0.3) +
    `<text x="-5.6" y="-6.9" ${GEORGIA} font-style="italic" font-size="2.2" fill="${P.ink}" transform="rotate(-37 -5.6 -7.6)" text-anchor="middle">nº 7</text>`
  )
}

/** Cupecita de Turismo Carretera de los cuarenta, de perfil hacia la derecha, con el piso en y=0: capot largo,
 * cabina corrida atrás, cola en pendiente y guardabarros en lágrima. */
function coupe(k: Kit, color: string, dark: string, light: string, num: string) {
  const body =
    'M-33 -9.6C-33.4 -11.6 -32.4 -13.4 -30 -14.4C-26.4 -15.8 -22.8 -18.6 -20 -22C-17.4 -25.6 -13.6 -28.2 -8.4 -28.4H-1.2C2.2 -28.2 4.4 -26.4 6.4 -22.6L7.8 -19.8' +
    'C16 -19.8 24 -19.2 29.4 -17.6C32.4 -16.6 34 -14.4 34.4 -11.4L34.4 -9.6Z'
  const fenderR = 'M-32.4 -8.6C-32.6 -12.4 -28.6 -15 -21.4 -15.2C-15.6 -15.2 -11 -13 -8.6 -9.2C-8.2 -8.4 -8.6 -7.4 -9.6 -7.4H-30.8C-31.8 -7.4 -32.4 -7.8 -32.4 -8.6Z'
  const fenderF = 'M8.4 -8.6C10.4 -12.8 14.8 -15.2 21 -15.2C27.4 -15.2 32.8 -13.6 35 -11C35.8 -10 35.8 -8.6 35.2 -8C34.8 -7.6 34.2 -7.4 33.4 -7.4H9.6C8.6 -7.4 8 -7.8 8.4 -8.6Z'
  const winR = 'M-16 -24C-13.6 -26.2 -10.6 -26.8 -7.6 -26.8H-2.6V-20.6H-18.2C-17.6 -22 -16.8 -23.2 -16 -24Z'
  const winF = 'M-1 -26.8H-.2C2 -26.8 3.6 -25.6 5 -22.6L5.8 -20.6H-1Z'
  const board = 'M-10 -9.6H10V-7.2H-10Z'
  const bumF = 'M33.6 -8H37.2C38 -8 38.2 -6 37.4 -5.8H33.6Z'
  const bumR = 'M-31 -8H-34.6C-35.4 -8 -35.6 -6 -34.8 -5.8H-31Z'
  return (
    k.draw([
      {
        d: body, fill: color,
        inner: k.sh(body, 0, 0, 0, 1, 0, 0.9, dark, 0.5) + `<path d="M-34 -30H36V-19.4C16 -20.4 -10 -22 -34 -14Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.4, 0)}"/>` +
          `<path d="M-2.4 -20.6V-9.6M7.8 -19.8V-9.6" stroke="${dark}" stroke-width=".5"/><path d="M-1.8 -17H.8" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
          hair(9, -19.2, 20, -19, 31, -16.6, 0.6, '#fff', 0.85) + hair(-30, -14.6, -24.4, -17.6, -20.4, -22, 0.5, '#fff', 0.6) +
          `<path d="M-20 -21.4C-14 -22 -6 -21.6 0 -21M-30 -11.6H-12" fill="none" stroke="${dark}" stroke-width=".4"/>` +
          `<path d="M32.4 -16.6V-10M33.4 -15.6V-10M31.4 -17V-10" stroke="${P.night}" stroke-width=".35"/>`,
      },
      { d: winR, fill: P.night, inner: `<path d="${winR}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.95, 0)}"/>` + `<path d="M-13.6 -25.8L-16.2 -21M-11 -26.4L-13.6 -21" stroke="${P.sky}" stroke-width=".5" opacity=".7"/>` },
      { d: winF, fill: P.night, inner: `<path d="${winF}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.95, 0)}"/>` + `<path d="M1.4 -26.4L0 -21" stroke="${P.sky}" stroke-width=".5" opacity=".7"/>` },
      { d: board, fill: P.night },
    ], 0.65) +
    `<circle cx="2.7" cy="-14.6" r="3.9" fill="${P.white}" stroke="${P.ink}" stroke-width=".55"/><text x="2.7" y="-12.7" ${GEORGIA} font-weight="700" font-size="5.4" fill="${P.ink}" text-anchor="middle">${num}</text>` +
    wheel(k, -20.8, -6.2, 6.2, false, light) + wheel(k, 21.6, -6.2, 6.2, false, light) +
    k.draw([
      { d: fenderR, fill: color, inner: k.sh(fenderR, 0, 0, 1, 1, 0, 0.95, dark, 0.5) + hair(-30, -10.6, -26, -14.4, -18, -14.4, 0.7, '#fff', 0.8) },
      { d: fenderF, fill: color, inner: k.sh(fenderF, 0, 0, 1, 1, 0, 0.95, dark, 0.5) + hair(11, -10.4, 15.4, -14.4, 23, -14.6, 0.7, '#fff', 0.8) },
      { d: bumF, fill: P.sky1 }, { d: bumR, fill: P.sky1 },
    ], 0.6) +
    `<ellipse cx="32.2" cy="-11.8" rx="1.7" ry="1.9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><ellipse cx="31.8" cy="-12.4" rx=".5" ry=".7" fill="#fff"/>` +
    `<path d="M-30.4 -10.6H-28" stroke="${P.red}" stroke-width="1.4" stroke-linecap="round"/>`
  )
}

/** Nube de tierra: bollos superpuestos de papel con la sombra marrón. */
function dust(k: Kit, x: number, y: number, s: number) {
  const d = 'M-11 3C-14 3 -15.4 0 -13 -2C-14 -6.4 -9 -8.6 -6.4 -6C-5 -10.4 1.4 -11 3 -6.8C5.6 -9 10 -7.4 9.6 -3.6C13 -3.4 13.6 2.6 10 3Z'
  return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.paper, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.brown, 0.45) + hair(-9, 1, -2, 2.4, 6, 1, 0.5, P.brownD, 0.6) }], 0.45 / s) + `</g>`
}

/** Rayo azul: el zigzag con el resplandor celeste, el cuerpo azul y el alma blanca. */
function bolt(k: Kit, d: string, core: string) {
  return (
    `<path d="${d}" fill="none" stroke="${P.sky}" stroke-width="7" stroke-linejoin="round" opacity=".35"/>` +
    `<path d="${d}" fill="none" stroke="${P.sky1}" stroke-width="3.4" stroke-linejoin="round" opacity=".6"/>` +
    k.draw([{ d, fill: P.blue, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.mid, 0.45) }], 0.6) +
    `<path d="${core}" fill="none" stroke="#fff" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/>`
  )
}

/** Gloria de rayos rectos en azul: la del caparazón que siempre llega. */
function blueGlory(k: Kit, cx: number, cy: number, r0: number, r1: number, n: number) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, w = i % 2 ? 1.1 : 1.7, len = i % 2 ? r0 + (r1 - r0) * 0.72 : r1
    d += `M${f(cx + ux * r0 + px * w)} ${f(cy + uy * r0 + py * w)}L${f(cx + ux * len)} ${f(cy + uy * len)}L${f(cx + ux * r0 - px * w)} ${f(cy + uy * r0 - py * w)}Z`
  }
  const g = k.id('bg')
  return `<radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r1}"><stop offset="${f(r0 / r1)}" stop-color="${P.mid}"/><stop offset=".65" stop-color="${P.blue}"/><stop offset="1" stop-color="${P.sky}" stop-opacity=".45"/></radialGradient>` +
    `<path d="${d}" fill="url(#${g})"/>` + k.shade(d, k.rad(P.mid, 0.5, 0.5, 0.5, 0.9, 0), P.mid, 0.2) +
    `<circle cx="${cx}" cy="${cy}" r="${f(r0 - 2)}" fill="none" stroke="${P.blue}" stroke-width=".8" stroke-dasharray=".01 1.7" stroke-linecap="round"/>`
}

/** Caramelo envuelto con las puntas retorcidas, centrado en (x,y). */
const candy = (x: number, y: number, r: number, c: string, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  `<path d="M-2.4 0L-4.8 -1.8L-4.4 0L-4.8 1.8ZM2.4 0L4.8 -1.8L4.4 0L4.8 1.8Z" fill="${c}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/>` +
  `<ellipse cx="0" cy="0" rx="2.8" ry="1.9" fill="${c}" stroke="${P.ink}" stroke-width=".45"/><path d="M-1.2 -1.8L.4 1.8M.8 -1.8L2.2 1.4" stroke="#fff" stroke-width=".45" opacity=".85"/><ellipse cx="-1.2" cy="-.8" rx=".7" ry=".4" fill="#fff"/></g>`

/** Rueda de rayos de alambre con la tuerca mariposa dorada. */
function wireWheel(k: Kit, x: number, y: number, r: number, far = false) {
  const tire = ellipse(x, y, r, r)
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2, b = a + (i % 2 ? 0.5 : -0.5)
    return `M${f(x + Math.cos(b) * r * 0.2)} ${f(y + Math.sin(b) * r * 0.2)}L${f(x + Math.cos(a) * r * 0.72)} ${f(y + Math.sin(a) * r * 0.72)}`
  }).join('')
  return (
    k.draw([{
      d: tire, fill: far ? P.mid : P.night,
      inner: k.sh(tire, 0, 0, 1, 1, 0, 0.85, '#0B1226', 0.5) + (far ? '' : hair(x - r * 0.86, y + r * 0.1, x - r * 0.8, y - r * 0.72, x - r * 0.1, y - r * 0.88, f(r * 0.08), P.sky, 0.8)),
    }], 0.55) +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.76)}" fill="${far ? P.night : P.mid}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<path d="${spokes}" stroke="${far ? P.blue : P.sky1}" stroke-width=".28"/>` +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.74)}" fill="none" stroke="${far ? P.blue : P.sky1}" stroke-width=".8"/>` +
    `<circle cx="${x}" cy="${y}" r="${f(r * 0.2)}" fill="${far ? P.goldD : P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
    (far ? '' : `<path d="M${f(x - r * 0.36)} ${f(y - r * 0.08)}L${f(x + r * 0.36)} ${f(y + r * 0.08)}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M${f(x - r * 0.36)} ${f(y - r * 0.08)}L${f(x + r * 0.36)} ${f(y + r * 0.08)}" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>`)
  )
}

/** Monoplaza de los cincuenta de perfil hacia la derecha, con el piso en y=0: carrocería de cigarro con el número 5,
 * ruedas de alambre, correa de cuero en el capot, escape cromado y la corona de laurel del ganador colgada del carenado. */
function racer(k: Kit) {
  const body = 'M-36 -11.4C-33 -15.6 -24 -18.6 -14 -19.2L12 -19.4C24 -19.2 32 -16.6 35.8 -12.6C36.8 -11.4 36.6 -9.4 35.2 -8.6C31 -6.4 24 -6 16 -6H-16C-26 -6 -33 -7.4 -36 -9.4Z'
  const rest = 'M-27.4 -17.6C-23 -22.6 -16 -24.2 -11.6 -21.6L-10.2 -19.2H-27Z'
  const pit = 'M-10.6 -19.2C-8 -21.4 -1 -21.4 2 -19.4Z'
  const screen = 'M2 -19.4L3.6 -24.4C4.4 -24.8 5.6 -24.6 6 -23.8L5.6 -19.4Z'
  const louvers = Array.from({ length: 6 }, (_, i) => `M${f(20 + i * 1.8)} -16.8L${f(21 + i * 1.8)} -13.6`).join('')
  return (
    wireWheel(k, -18.6, -10.2, 8.4, true) + wireWheel(k, 23.4, -10.2, 8.4, true) +
    k.draw([
      { d: rest, fill: MK, inner: k.sh(rest, 0, 0, 1, 1, 0, 0.9, MK_D, 0.5) + hair(-25, -18.6, -21, -22, -14.6, -22.6, 0.5, '#fff', 0.7) },
      {
        d: body, fill: MK,
        inner: k.sh(body, 0, 0, 0, 1, 0.05, 0.9, MK_D, 0.5) + `<path d="M-38 -21H38V-16C20 -17.4 -10 -17.4 -38 -12Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.45, 0)}"/>` +
          `<path d="M29.4 -20V-4M31.4 -20V-4" stroke="${P.sky}" stroke-width="1.6"/><path d="M30.4 -20V-4" stroke="${P.white}" stroke-width="1"/>` +
          `<path d="${louvers}" stroke="${MK_D}" stroke-width=".55" stroke-linecap="round"/>` +
          hair(4, -18.4, 18, -18.8, 30, -16.4, 0.7, '#fff', 0.85) + hair(-30, -12.4, -24, -15.8, -16, -17.4, 0.5, '#fff', 0.6) +
          `<path d="M-34 -8.6C-20 -7 10 -7 34 -9" fill="none" stroke="${MK_D}" stroke-width=".45"/>` +
          Array.from({ length: 9 }, (_, i) => `<circle cx="${f(-12 + i * 3)}" cy="-17.6" r=".3" fill="${MK_D}"/>`).join(''),
      },
      { d: pit, fill: P.night },
    ], 0.7) +
    `<path d="M14.6 -19.4V-6.4" stroke="${P.ink}" stroke-width="2"/><path d="M14.6 -19.4V-6.4" stroke="${P.brown}" stroke-width="1.2"/><path d="M13.6 -13.4H15.6V-11.4H13.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<ellipse cx="35.6" cy="-11" rx="1.1" ry="2.6" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M35.6 -13V-9" stroke="${P.sky1}" stroke-width=".35"/>` +
    k.draw([{ d: screen, fill: P.sky1, inner: `<path d="M3.4 -23.6L2.8 -20" stroke="#fff" stroke-width=".5"/>` }], 0.35) +
    `<circle cx="-5" cy="-12.8" r="4.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/><text x="-5" y="-10.6" ${GEORGIA} font-weight="700" font-size="6.4" fill="${P.ink}" text-anchor="middle">5</text>` +
    rod('M8 -8.4C-4 -8.2 -18 -9 -31 -12.4', P.sky1, 1.4) + `<path d="M8 -8.4C-4 -8.2 -18 -9 -31 -12.4" stroke="#fff" stroke-width=".4" fill="none" transform="translate(0 -.4)"/>` +
    `<path d="M-30.6 -14.2L-34 -13.4L-33.4 -10.8L-30 -11Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".45"/>` +
    wireWheel(k, -21, -8.4, 8.4) + wireWheel(k, 21, -8.4, 8.4) +
    wreath(k, 7.4, -16.4)
  )
}

/** Corona de laurel del ganador, colgada, con la cinta celeste y blanca; centrada en (x,y). */
function wreath(k: Kit, x: number, y: number) {
  const leaf = 'M0 0C1.4 -1.6 4.2 -1.8 5.8 0C4.2 1.6 1.4 1.6 0 0Z'
  const ring = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2 + 0.1, out = i % 2 ? 1.1 : 0.9, px = x + Math.cos(a) * 6.4 * out, py = y + Math.sin(a) * 7.8 * out, rot = (a * 180) / Math.PI + 90 + (i % 2 ? 34 : -34)
    return `<path d="${leaf}" transform="translate(${f(px)} ${f(py)}) rotate(${f(rot)}) scale(1.05)" fill="${i % 2 ? P.gold : P.goldL}" stroke="${P.ink}" stroke-width=".35"/><path d="M.8 0H4.6" transform="translate(${f(px)} ${f(py)}) rotate(${f(rot)})" stroke="${P.goldD}" stroke-width=".3"/>`
  }).join('')
  const tailL = `M${f(x - 1.4)} ${f(y + 7.6)}L${f(x - 4.4)} ${f(y + 15)}L${f(x - 2.6)} ${f(y + 14)}L${f(x - 1.8)} ${f(y + 15.8)}L${f(x + 0.6)} ${f(y + 8)}Z`
  const tailR = `M${f(x + 1.4)} ${f(y + 7.6)}L${f(x + 4.6)} ${f(y + 14.4)}L${f(x + 2.8)} ${f(y + 13.8)}L${f(x + 2.4)} ${f(y + 15.6)}L${f(x - 0.4)} ${f(y + 8.2)}Z`
  return (
    `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="7.8" fill="none" stroke="${P.ink}" stroke-width="2.2"/><ellipse cx="${x}" cy="${y}" rx="6.4" ry="7.8" fill="none" stroke="${P.greenD}" stroke-width="1"/>` +
    ring +
    k.draw([{ d: tailL, fill: P.sky, inner: `<path d="M${f(x - 0.6)} ${f(y + 8)}L${f(x - 3.4)} ${f(y + 15)}" stroke="#fff" stroke-width=".9"/>` }, { d: tailR, fill: P.sky, inner: `<path d="M${f(x + 0.6)} ${f(y + 8)}L${f(x + 3.6)} ${f(y + 14.6)}" stroke="#fff" stroke-width=".9"/>` }], 0.35) +
    `<path d="M${f(x - 2)} ${f(y + 6.4)}C${f(x - 1)} ${f(y + 9)} ${f(x + 1)} ${f(y + 9)} ${f(x + 2)} ${f(y + 6.4)}L${f(x + 1.4)} ${f(y + 9.4)}H${f(x - 1.4)}Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
    `<circle cx="${x}" cy="${f(y + 8.2)}" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`
  )
}

export const MARIOKART_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Piloto ─────────────────────────────────────────────────────────

  // Tres copas: casco prestado y mucho entusiasmo. El kart de alquiler con la butaca vacía y, en el piso, el casco
  // prestado con su cinta de papel.
  'Karting de Ezeiza': (u) => {
    const k = kit(u)
    return (
      fondo(k) +
      escenario(k, 60, 60, 34) +
      hair(26, 52, 31, 51.4, 36, 52, 0.7, MK_D, 0.8) + hair(24, 58, 30, 57.4, 35, 58, 0.6, MK_D, 0.7) + hair(28, 64, 32, 63.6, 35, 64, 0.5, MK_D, 0.6) +
      k.floor(64, 80.4, 28, 2.4, P.mid) +
      `<g transform="translate(64 80) scale(.9)">` + kart(k, '7') + `</g>` +
      k.floor(42, 81.4, 10, 1.7, P.mid) +
      `<g transform="translate(41.6 74.4) rotate(-10) scale(.7)">` + kartHelmet(k) + `</g>` +
      sparkle(86, 38, 2.2) + sparkle(38, 40, 1.6) +
      k.defs()
    )
  },

  // Diez copas: Ford o Chevrolet, la discusión es eterna. Dos cupecitas de época, rueda a rueda, bajo el sol de Mayo.
  'Turismo Carretera': (u) => {
    const k = kit(u)
    return (
      fondo(k) +
      k.sun(60, 56, 16, 46) +
      k.shade(ellipse(60, 56, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<path d="M18 86.6H102" stroke="${P.brownD}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      dust(k, 26, 70, 0.8) +
      `<g transform="translate(66 72.6) scale(.78)">` + coupe(k, P.mid, P.night, P.sky2, '2') + `</g>` +
      dust(k, 25, 84, 1) +
      k.floor(58, 87.6, 28, 2.4, P.brownD) +
      `<g transform="translate(57.4 87) scale(.86)">` + coupe(k, MK, MK_D, P.goldL, '1') + `</g>` +
      hair(18, 76, 21, 75.4, 24, 76, 0.5, P.brownD) +
      k.defs()
    )
  },

  // Veinticinco copas: el quíntuple campeón te mira con respeto. La flecha de los cincuenta con el número 5, el
  // casco de corcho con las antiparras sobre la carrocería y cinco estrellas bajo el sol de Mayo.
  'Fangio': (u) => {
    const k = kit(u)
    const stars = [-150, -120, -90, -60, -30].map((deg, i) => {
      const a = (deg * Math.PI) / 180, x = 60 + Math.cos(a) * 31, y = 60 + Math.sin(a) * 31, r = i === 2 ? 3.8 : 3.2
      return k.draw([{ d: starPath(x, y, r, r * 0.42, 5), fill: P.gold, inner: k.sh(starPath(x, y, r, r * 0.42, 5), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) }], 0.45)
    }).join('')
    return (
      fondo(k) +
      k.sun(60, 70, 15, 50) +
      k.shade(ellipse(60, 66, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      stars +
      `<path d="M18 87.6H102" stroke="${P.goldD}" stroke-width=".6" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      k.floor(60, 88, 32, 2.6, P.brownD) +
            `<g transform="translate(60.4 87.6) scale(.98)">` + racer(k) + `</g>` +
      sparkle(88, 36, 2.4, '#fff') + sparkle(30, 42, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Blanco del azul ────────────────────────────────────────────────

  // Tres azules: te buscan como el rayo al árbol. El pararrayos antiguo, con veleta y bola de vidrio, recibe el rayo azul.
  'Pararrayos': (u) => {
    const k = kit(u)
    const roof = 'M10 112L60 88.6L110 112Z'
    const ridge = 'M26 97.4L60 82.6L94 97.4V100.8L60 86L26 100.8Z'
    const tip = 'M60 30.6L63.2 39H56.8Z'
    const ball = ellipse(60, 63, 8.2, 8.2)
    const collar = 'M56.2 40.6H63.8V44H56.2Z'
    const base = 'M54.6 78.4H65.4L67 84.6H53Z'
    const arrow = 'M36 49.4L42 46.4V48.4H76.6V46.6L80.4 46.6L84 44.4L82 49.4L84 54.4L80.4 52.2H76.6V50.4H42V52.4Z'
    const twist = Array.from({ length: 5 }, (_, i) => `M58.6 ${f(72.4 + i * 1.2)}L61.4 ${f(73.4 + i * 1.2)}`).join('')
    const sparks = [-160, -130, -50, -20, -100, -80].map((deg, i) => {
      const a = (deg * Math.PI) / 180, r0 = 4.4, r1 = i > 3 ? 7.4 : 9.6
      return `<path d="M${f(60 + Math.cos(a) * r0)} ${f(31.6 + Math.sin(a) * r0)}L${f(60 + Math.cos(a) * r1)} ${f(31.6 + Math.sin(a) * r1)}" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/>`
    }).join('')
    return (
      fondo(k) +
      escenario(k, 60, 64, 32) +
      `<g transform="translate(0 4)">` +
      k.draw([{ d: roof, fill: MK, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.9, MK_D, 0.5) + Array.from({ length: 7 }, (_, i) => hair(24 + i * 12, 100 + Math.abs(i - 3) * 1.4, 25 + i * 12, 104, 24 + i * 12, 108, 0.45, MK_D)).join('') + hair(30, 99, 44, 93, 58, 87, 0.6, '#fff', 0.7) }], 0.7) +
      k.draw([{ d: ridge, fill: MK_D, inner: k.sh(ridge, 0, 0, 1, 0, 0, 0.6, P.wine, 0.4) }], 0.5) +
      k.floor(60, 85, 9, 1.6, P.wine) +
      rod('M60 44V79', P.sky2, 2) + `<path d="${twist}" stroke="${P.mid}" stroke-width=".55"/>` + `<path d="M59.3 44V79" stroke="#fff" stroke-width=".4"/>` +
      rod('M60 39V41', P.sky2, 1.4) +
      k.draw([{ d: base, fill: P.gold, inner: k.sh(base, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M54 81.6H66" stroke="${P.goldD}" stroke-width=".45"/>` }], 0.55) +
      k.draw([{
        d: arrow, fill: P.gold,
        inner: k.sh(arrow, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M42 49.4H76.6" stroke="${P.goldD}" stroke-width=".4"/>` + `<path d="M77.4 47.4L80 49.4L77.4 51.4M79.6 46.6L82 49.4L79.6 52.2" fill="none" stroke="${P.goldD}" stroke-width=".4"/>`,
      }], 0.5) +
      `<circle cx="60" cy="49.4" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="60" cy="49.4" r=".8" fill="${P.goldD}"/>` +
      k.draw([{ d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) }], 0.4) +
      k.cast([ball], 1.6, 1.8, P.mid) +
      k.draw([{
        d: ball, fill: P.sky,
        inner: k.sh(ball, 0, 0, 1, 1, 0, 0.95, P.mid, 0.55) + `<ellipse cx="60" cy="63" rx="8.2" ry="2.2" fill="none" stroke="${P.white}" stroke-width=".5" opacity=".6"/>` +
          `<path d="M54.4 61C54.8 58 56.8 56.2 59.4 55.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` + `<circle cx="63.6" cy="66.6" r="1" fill="#fff" opacity=".6"/>` +
          hair(56, 66, 58, 69, 62, 70, 0.5, P.mid, 0.7),
      }], 0.65) +
      `<path d="M55.6 56.4H64.4L63.6 54.8H56.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M55.6 69.6H64.4L63.6 71.2H56.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([{ d: tip, fill: P.gold, inner: k.sh(tip, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) }], 0.5) +
      bolt(k, 'M69 8L78.6 8L71 19.8L76.4 20.2L60.4 31L66.4 22.4L61.4 22Z', 'M74.6 9.4L67.2 20.8L71.6 21.2L63.4 28.6') +
      sparks + sparkle(60, 31.2, 4, '#fff') + `</g>` +
      sparkle(30, 58, 1.8) + sparkle(90, 68, 2) +
      k.defs()
    )
  },

  // Diez azules: todos te pegan y salen caramelos. La piñata estrella, azul, rota abajo y largando golosinas.
  'Piñata': (u) => {
    const k = kit(u)
    const cx = 60, cy = 52, R = 12.6
    const body = ellipse(cx, cy, R, R)
    const angs = [-90, -18, 54, 126, 198]
    const cols = [P.gold, MK, P.gold, MK, P.gold]
    const cone = (a: number, len: number, hw: number) => {
      const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy, py = ux, b = R - 3, t = R + len
      return `M${f(cx + ux * b + px * hw)} ${f(cy + uy * b + py * hw)}L${f(cx + ux * t)} ${f(cy + uy * t)}L${f(cx + ux * b - px * hw)} ${f(cy + uy * b - py * hw)}Z`
    }
    const bands = (a: number, len: number, hw: number) => {
      const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy, py = ux
      return [0.3, 0.55, 0.78].map((q) => {
        const d0 = R - 3 + (len + 3) * q, w = hw * (1 - q) + 0.4
        return `M${f(cx + ux * d0 + px * w)} ${f(cy + uy * d0 + py * w)}L${f(cx + ux * d0 - px * w)} ${f(cy + uy * d0 - py * w)}`
      }).join('')
    }
    const tassel = (a: number, len: number) => {
      const r = (a * Math.PI) / 180, x = cx + Math.cos(r) * (R + len), y = cy + Math.sin(r) * (R + len)
      return [[-30, P.sky], [0, MK], [30, P.white], [55, P.gold]].map(([da, c]) => {
        const rr = r + (Number(da) * Math.PI) / 180 * 0.5
        const x1 = x + Math.cos(rr) * 6.4 + 1.6, y1 = y + Math.sin(rr) * 6.4 + 3.4
        return `<path d="M${f(x)} ${f(y)}Q${f((x + x1) / 2 + 1.4)} ${f((y + y1) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${f(x)} ${f(y)}Q${f((x + x1) / 2 + 1.4)} ${f((y + y1) / 2)} ${f(x1)} ${f(y1)}" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/>`
      }).join('')
    }
    const lens = [15.4, 14, 15, 14, 14.6]
    const fringe = Array.from({ length: 7 }, (_, i) => {
      const y = cy - R + 2.6 + i * 3.6
      let d = `M${cx - R - 1} ${f(y)}`
      for (let x = cx - R - 1; x < cx + R + 1; x += 2.2) d += `q1.1 1.8 2.2 0`
      return `<path d="${d}V${f(y + 4)}H${cx - R - 1}Z" fill="${i % 2 ? P.sky : P.sky1}"/><path d="${d}" fill="none" stroke="${P.mid}" stroke-width=".4"/>`
    }).join('')
    const hole = 'M52.4 61C54 59.6 55 62 56.6 60.6C58 59.4 59 62.2 60.6 60.8C62 59.6 63.6 62.4 65 60.6C66 59.6 67.2 60.6 67.6 61.4C65 64 55 64 52.4 61Z'
    return (
      fondo(k) +
      escenario(k, 60, 58, 33) +
      rod('M60 12V24.6', P.brown, 0.9) +
      hair(29, 46, 32, 50, 33, 55, 0.8, MK_D) + hair(28, 56, 31, 58, 33, 62, 0.6, MK_D) + `<text x="36" y="38" ${GEORGIA} font-style="italic" font-size="5" fill="${P.ink}" transform="rotate(-14 36 38)" text-anchor="middle">¡pum!</text>` +
      angs.map((a, i) => tassel(a, lens[i])).join('') +
      k.cast([body], 2, 2.2, MK_D) +
      angs.map((a, i) => k.draw([{ d: cone(a, lens[i], 4.4), fill: cols[i], inner: k.sh(cone(a, lens[i], 4.4), 0, 0, 1, 1, 0, 0.9, cols[i] === MK ? MK_D : P.goldD, 0.5) + `<path d="${bands(a, lens[i], 4.4)}" stroke="${cols[i] === MK ? P.white : MK}" stroke-width="1.1"/>` }], 0.55)).join('') +
      k.draw([{
        d: body, fill: P.sky,
        inner: fringe + k.sh(body, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M46 40H56V66H46Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
          `<path d="${hole}" fill="${P.night}"/>`,
      }], 0.75) +
      `<path d="M53 61L51.6 64.4M57 61.6L57.4 65M62.4 61.8L63.6 64.8M66.4 61.4L68.4 63.6" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/>` +
      candy(50, 72, 20, MK) + candy(60, 78.6, -30, P.gold, 1.1) + candy(70, 71, 50, P.green) + candy(54, 88, -10, P.sky, 1.1) + candy(67, 86, 30, MK, 1.05) +
      `<g transform="translate(76 80) rotate(30)">` + rod('M0 0V8', P.white, 0.8) + `<circle cx="0" cy="-2.2" r="2.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><path d="M0 -2.2m-1.8 0a1.8 1.8 0 1 1 1.8 1.8" fill="none" stroke="#fff" stroke-width=".6"/></g>` +
      sparkle(88, 40, 2) + sparkle(42, 84, 1.4) +
      k.defs()
    )
  },

  // Veinticinco azules: el juego te odia personalmente. La copa de oro, con el blanco grabado, partida por el rayo azul.
  'Víctima del sistema': (u) => {
    const k = kit(u)
    const bowl = 'M40.4 38.6H79.6C79.6 52 74 62 64 65.4V68H56V65.4C46 62 40.4 52 40.4 38.6Z'
    const lip = 'M38.6 36H81.4V39.6H38.6Z'
    const handleL = 'M41.6 42.4C34 41 30.4 45.6 31.8 50.6C33 55 37.6 57.4 43.6 56.4L44.6 53.6C39.4 54.2 35.8 52.6 35.4 49.6C35 46.6 37.6 44.6 42.2 45.6Z'
    const handleR = 'M78.4 42.4C86 41 89.6 45.6 88.2 50.6C87 55 82.4 57.4 76.4 56.4L75.4 53.6C80.6 54.2 84.2 52.6 84.6 49.6C85 46.6 82.4 44.6 77.8 45.6Z'
    const knop = ellipse(60, 70.6, 4.6, 2.8)
    const stem = 'M57.4 68H62.6L62 76H58Z'
    const foot = 'M50 82C50 78.6 54.6 76 60 76C65.4 76 70 78.6 70 82Z'
    const plinth = 'M45.6 82H74.4L76 94H44Z'
    const crack = 'M59.4 38.6L61.6 43.6L58.4 47.4L62.2 52L59 56.6L61 60.6'
    const chip = 'M62.6 36L67.6 36L65.6 33L63.4 31.4Z'
    const beads = Array.from({ length: 12 }, (_, i) => `<circle cx="${f(41.4 + i * 3.3)}" cy="37.8" r=".7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/>`).join('')
    const acanthus = Array.from({ length: 7 }, (_, i) => {
      const x = 46 + i * 4.6
      return `<path d="M${x} 64C${f(x - 1.6)} 60 ${f(x - 1)} 57 ${x} 55.4C${f(x + 1)} 57 ${f(x + 1.6)} 60 ${x} 64Z" fill="${P.goldD}" opacity=".55"/>`
    }).join('')
    return (
      fondo(k) +
      blueGlory(k, 60, 56, 20, 48, 36) +
      k.shade(ellipse(60, 54, 26, 26), k.rad(P.sky1, 0.5, 0.5, 0.5, 0.75, 0), P.sky, 0.4) +
      k.floor(60, 94.4, 22, 2.6, P.mid) +
      k.draw([{ d: plinth, fill: P.night, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, '#0B1226', 0.45) + `<path d="M44.8 86.6H75.2" stroke="${P.mid}" stroke-width=".5"/>` }], 0.65) +
      k.draw([{ d: 'M53 87.4H67V92H53Z', fill: P.gold, inner: k.sh('M53 87.4H67V92H53Z', 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.35) +
      `<text x="60" y="91.1" ${GEORGIA} font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">1º</text>` +
      k.draw([
        { d: handleL, fill: P.gold, inner: k.sh(handleL, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + hair(36.6, 45.6, 33, 49, 37, 54, 0.4, P.goldL) },
        { d: handleR, fill: P.gold, inner: k.sh(handleR, 0, 0, 1, 1, 0.2, 0.95, P.goldD, 0.5) },
        { d: foot, fill: P.gold, inner: k.sh(foot, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M51.4 80.4C55 79 65 79 68.6 80.4" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` },
        { d: stem, fill: P.gold, inner: k.sh(stem, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: knop, fill: P.gold, inner: k.sh(knop, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M55.6 70.6H64.4" stroke="${P.goldD}" stroke-width=".4"/>` },
        {
          d: bowl, fill: P.gold,
          inner: k.sh('M62 36C72 44 74 58 64 70H84V36Z', 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + acanthus +
            `<path d="M42 38H50V64H42Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` +
            `<circle cx="60" cy="49.6" r="8.6" fill="${P.white}" stroke="${P.goldD}" stroke-width=".6"/><circle cx="60" cy="49.6" r="6.6" fill="${P.red}"/><circle cx="60" cy="49.6" r="4.6" fill="${P.white}"/><circle cx="60" cy="49.6" r="2.6" fill="${P.red}"/>` +
            k.sh(ellipse(60, 49.6, 8.6, 8.6), 0, 0, 1, 1, 0.1, 0.7, P.goldD, 0.35) +
            `<circle cx="60" cy="49.6" r="9.6" fill="none" stroke="${P.goldD}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
            `<path d="${crack}" fill="none" stroke="${P.night}" stroke-width="1.3" stroke-linejoin="round"/><path d="${crack}" fill="none" stroke="${P.goldL}" stroke-width=".4" transform="translate(-.8 0)"/>`,
        },
        { d: lip, fill: P.gold, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + beads + `<path d="M62.6 36L67.6 36L66.6 39.6H63.6Z" fill="${P.night}"/>` },
      ], 0.8) +
      `<path d="M44.4 40.6C44 46 45 52 48 57" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` +
      `<g transform="translate(5.6 -9) rotate(28 65 33)">` + k.draw([{ d: chip, fill: P.gold, inner: k.sh(chip, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.4) + `</g>` +
      hair(54, 33, 50, 28, 53, 22.6, 0.8, P.mid, 0.8) + hair(50.6, 34, 46.6, 30.6, 48, 25.4, 0.6, P.mid, 0.7) +
      bolt(k, 'M70 6L81.4 6L72.6 19.4L78.6 19.8L63.8 37.4L68.4 23.6L63 23.2Z', 'M76.6 7.4L68.4 20.6L73.6 21L66 33.6') +
      sparkle(64, 36.4, 3.4, '#fff') + sparkle(34, 32, 2, '#fff') + sparkle(90, 72, 1.6, '#fff') +
      k.defs()
    )
  },

  // ── Kamikaze del arcoíris ──────────────────────────────────────────

  // Cinco veces afuera: la banquina es tuya. El cartel de curva doblado, las marcas de goma y la rueda que se escapa.
  'Banquina': (u) => {
    const k = kit(u)
    const road = 'M-4 74C22 68 42 70 62 82C74 89 82 98 88 112H-4Z'
    const grass = 'M-4 74C22 68 42 70 62 82C74 89 82 98 88 112H124V60C90 62 50 60 -4 66Z'
    const sign = 'M0 -13.6L13.6 0L0 13.6L-13.6 0Z'
    const inner = 'M0 -11.4L11.4 0L0 11.4L-11.4 0Z'
    const arrow = 'M-3.6 7.4C-3.6 2 -1.6 -.6 2.4 -2.6L1.6 -4.8L6.4 -3L4 1.4L3.4 -.6C.4 .8 -.8 3.4 -.8 7.4Z'
    const tufts = [[70, 66], [84, 72], [96, 84], [76, 80], [100, 70], [40, 64]].map(([x, y]) => hair(x, y, x - 1, y - 3, x - 2.4, y - 4.6, 0.6, P.greenD) + hair(x + 1, y, x + 1.4, y - 3.4, x + 2.6, y - 5, 0.6, P.greenD)).join('')
    return (
      fondo(k) +
      `<path d="M-4 66C50 60 90 62 124 60V40C80 46 40 46 -4 52Z" fill="${MK_L}" opacity=".4"/>` +
      k.draw([{ d: grass, fill: P.green, inner: k.sh(grass, 0, 0, 0, 1, 0, 0.9, P.greenD, 0.45) + tufts + `<circle cx="80" cy="92" r="1" fill="${P.brownD}"/><circle cx="92" cy="96" r=".8" fill="${P.brownD}"/><circle cx="72" cy="98" r=".9" fill="${P.brownD}"/>` }], 0.6) +
      k.draw([{
        d: road, fill: ASF,
        inner: k.sh(road, 0, 0, 1, 1, 0, 0.8, ASF_D, 0.45) + `<path d="M-4 77C22 71.4 41 73.4 60 85C71 92 78.6 100.6 84 112" fill="none" stroke="${P.white}" stroke-width="1.4"/>` +
          `<path d="M-4 92C14 88 28 90 40 98" fill="none" stroke="${P.gold}" stroke-width="1.2" stroke-dasharray="4 3"/>`,
      }], 0.6) +
      `<path d="M30 92C44 88 56 82 66 76C72 72 78 70 84 70" fill="none" stroke="${P.night}" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>` +
      `<path d="M34 98C48 93 60 86 70 80C76 76 82 74 88 74" fill="none" stroke="${P.night}" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>` +
      `<g transform="translate(68 58) rotate(28)">` +
      k.cast([sign], 1.6, 2, P.greenD) +
      rod('M0 12V30', P.sky2, 1.8) +
      k.draw([{ d: sign, fill: P.gold, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${inner}" fill="none" stroke="${P.ink}" stroke-width="1"/>` + `<path d="M-8 -6L-3 -11" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>` }], 0.7) +
      `<path d="${arrow}" fill="${P.ink}"/>` +
      `<circle cx="0" cy="-9" r=".6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/><circle cx="0" cy="9" r=".6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      `<path d="M74 79.4L79 82" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/>` +
      k.floor(41, 82, 9, 1.6, P.night) +
      `<g transform="rotate(-18 40 74)">` + wheel(k, 40, 74, 7.4) + `</g>` +
      hair(22, 70, 27, 68, 31, 70, 0.6, P.mid) + hair(20, 76, 26, 75, 30, 77, 0.5, P.mid) +
      sparkle(86, 36, 2) + sparkle(36, 42, 1.6) +
      k.defs()
    )
  },

  // Quince caídas: ya te conocen por nombre. La nube con la caña que pesca el kart y lo devuelve chorreando.
  'Pescado por Lakitu': (u) => {
    const k = kit(u)
    const cloud = 'M-14 5C-18.4 5 -20 -.6 -16.4 -2.8C-17.4 -8.6 -11 -11.6 -7.6 -8.4C-5.8 -13.8 3.4 -14.6 5.4 -8.8C8.4 -11.6 14.6 -9.6 13.8 -4.6C18.4 -4 19 3 14.2 5Z'
    const drip = (x: number, y: number, s: number) => `<path d="M${x} ${y}c-${f(1.2 * s)} ${f(1.8 * s)} -${f(1.4 * s)} ${f(2.8 * s)} 0 ${f(3.4 * s)}c${f(1.4 * s)} -${f(0.6 * s)} ${f(1.2 * s)} -${f(1.6 * s)} 0 -${f(3.4 * s)}Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>`
    const hx = 62, hy = 46
    return (
      fondo(k) +
      escenario(k, 60, 60, 34) +
      `<path d="M30 97C40 94 50 96 60 95C72 94 82 96 90 94" fill="none" stroke="${P.blue}" stroke-width=".6" stroke-dasharray="3 1.6"/>` +
      `<path d="M38 100.6C46 99 54 100 62 99.4" fill="none" stroke="${P.blue}" stroke-width=".5" stroke-dasharray="2.4 1.6"/>` +
      // La tanza, la caña de bambú con nudos y el reel; la caña sale de la nube.
      `<path d="M${hx + 1.6} 26.4V${hy - 1}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M44 38Q54 26 ${hx + 1.6} 26.4" fill="none" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/><path d="M44 38Q54 26 ${hx + 1.6} 26.4" fill="none" stroke="${P.goldL}" stroke-width="1.4" stroke-linecap="round"/>` +
      [[49.6, 31.4], [56.4, 27.6]].map(([x, y]) => `<path d="M${f(x - 0.6)} ${f(y - 0.8)}L${f(x + 0.6)} ${f(y + 0.8)}" stroke="${P.goldD}" stroke-width=".9"/>`).join('') +
      `<circle cx="${hx + 1.6}" cy="26.4" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<g transform="translate(40 42) scale(.92)">` + k.draw([{ d: cloud, fill: P.white, inner: k.sh(cloud, 0, 0, 1, 1, 0.1, 0.9, P.sky2, 0.5) + hair(-12, 2, -4, 3.4, 4, 2.6, 0.5, P.sky, 0.8) + hair(-12, -4.6, -10, -7.6, -7, -8, 0.7, '#fff') }], 0.7) + `</g>` +
      `<circle cx="46.6" cy="40.4" r="2.6" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><circle cx="46.6" cy="40.4" r="1" fill="${P.mid}"/><path d="M46.6 40.4L49 42" stroke="${P.ink}" stroke-width=".6"/>` +
      k.floor(60, 95, 18, 2, P.mid) +
      `<g transform="translate(${hx} ${hy}) rotate(30) scale(.74) translate(10 27.6)">` + kart(k, '7') + `</g>` +
      `<path d="M${hx + 1.6} ${hy - 1.4}C${hx + 1.6} ${hy + 1.4} ${hx - 0.8} ${hy + 2.2} ${hx - 1.8} ${hy + 0.6}" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M${hx + 1.6} ${hy - 1.4}C${hx + 1.6} ${hy + 1.4} ${hx - 0.8} ${hy + 2.2} ${hx - 1.8} ${hy + 0.6}" fill="none" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/>` +
      drip(52, 88, 1) + drip(60.6, 90.6, 1.2) + drip(70, 86, 0.9) + drip(44, 80, 0.8) + drip(76, 80, 0.8) +
      hair(86, 56, 90, 62, 88, 70, 0.6, P.blue) + hair(34, 58, 31, 64, 33, 70, 0.6, P.blue) +
      `<text x="84" y="40" ${GEORGIA} font-style="italic" font-size="4.6" fill="${P.ink}" text-anchor="middle" transform="rotate(8 84 40)">¡otra vez!</text>` +
      k.defs()
    )
  },

  // Cuarenta caídas: más saltos al vacío que vueltas. La senda de seis colores en la noche y el kart que se cae de ella.
  'Senda del Arcoíris': (u) => {
    const k = kit(u)
    const x0 = 8, y0 = 90, cx = 44, cy = 32, x1 = 112, y1 = 54
    const cols = [MK, '#F39A3E', P.gold, P.green, '#6E9FE0', VIO]
    const N = 30
    const pt = (t: number, o: number) => {
      const a = 1 - t, x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
      const dx = 2 * a * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * a * (cy - y0) + 2 * t * (y1 - cy), len = Math.hypot(dx, dy)
      const w = 25 - 16 * t
      return [x + (-dy / len) * o * w, y + (dx / len) * o * w]
    }
    const band = (o0: number, o1: number) => {
      const A: string[] = [], B: string[] = []
      for (let i = 0; i <= N; i++) { const t = i / N, p = pt(t, o0), q = pt(t, o1); A.push(`${f(p[0])} ${f(p[1])}`); B.push(`${f(q[0])} ${f(q[1])}`) }
      return `M${A.join('L')}L${B.reverse().join('L')}Z`
    }
    const road = band(-0.5, 0.5)
    const stripes = cols.map((c, i) => `<path d="${band(-0.5 + i / 6, -0.5 + (i + 1) / 6)}" fill="${c}"/>`).join('')
    const dashes = Array.from({ length: 5 }, (_, i) => {
      const o = -0.5 + (i + 1) / 6
      const A: string[] = []
      for (let j = 0; j <= N; j++) { const p = pt(j / N, o); A.push(`${f(p[0])} ${f(p[1])}`) }
      return `M${A.join('L')}`
    }).join('')
    const lights = (o: number) => Array.from({ length: 12 }, (_, i) => { const t = 0.04 + i * 0.085, p = pt(t, o), r = 1 - t * 0.6; return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const edge = (o: number) => { const A: string[] = []; for (let j = 0; j <= N; j++) { const p = pt(j / N, o); A.push(`${f(p[0])} ${f(p[1])}`) }; return `M${A.join('L')}` }
    // Postes de la baranda colgando del borde de abajo, y destellos sobre la pista.
    const posts = Array.from({ length: 11 }, (_, i) => { const t = 0.06 + i * 0.09, p = pt(t, 0.5), h = 3.4 * (1 - t * 0.6); return `M${f(p[0])} ${f(p[1])}V${f(p[1] + h)}` }).join('')
    const glints = [0.22, 0.48, 0.74].map((t, i) => { const p = pt(t, -0.1 + i * 0.1); return sparkle(f(p[0]), f(p[1]), 2.2 - i * 0.5, '#fff') }).join('')
    const starsBg = [[30, 30, 0.6], [86, 24, 0.5], [96, 56, 0.6], [24, 58, 0.4], [70, 92, 0.5], [44, 22, 0.4], [92, 84, 0.5], [54, 88, 0.4], [36, 76, 0.5], [100, 70, 0.4]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
    return (
      k.night() +
      k.shade(ellipse(60, 56, 40, 34), k.rad(VIO, 0.5, 0.5, 0.5, 0.55, 0), VIO, 0.25) +
      starsBg + sparkle(88, 34, 2.6, P.paper) + sparkle(30, 44, 1.6, P.paper) + sparkle(98, 88, 1.4, P.paper) +
      `<path d="${edge(0)}" fill="none" stroke="${P.sky1}" stroke-width="30" stroke-linecap="round" opacity=".08"/>` +
      k.cast([road], 2, 4, '#000') +
      k.draw([{ d: road, fill: P.white, inner: stripes + `<path d="${dashes}" fill="none" stroke="#fff" stroke-width=".35" opacity=".7"/>` + k.sh(road, 0, 0, 1, 1, 0, 0.35, P.night, 0.3) + `<path d="${road}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` }], 0.7) +
      `<path d="${edge(-0.5)}" fill="none" stroke="${P.white}" stroke-width=".9"/><path d="${edge(0.5)}" fill="none" stroke="${P.white}" stroke-width=".9"/>` +
      `<path d="${posts}" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="${posts}" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round"/>` +
      lights(-0.5) + lights(0.5) + glints +
      `<path d="M74 58C76 62 76 66 74 70" fill="none" stroke="${P.paper}" stroke-width=".6" stroke-dasharray="1.4 1.2" opacity=".8"/>` +
      hair(70, 61, 71, 65, 70, 69, 0.7, P.paper, 0.8) + hair(64, 63, 63, 67, 61, 70, 0.5, P.paper, 0.7) + hair(77, 60, 79, 64, 79, 68, 0.5, P.paper, 0.6) +
      `<g transform="translate(70 73) rotate(150) scale(.74)">` + kart(k, '7') + `</g>` +
      sparkle(64, 92, 1.6, P.goldL) + sparkle(88, 98, 1.2, P.goldL) +
      k.defs()
    )
  },
}
