// Medallas del Catán redibujadas (ver el kit en ../kit.ts): Ruta 40, Granaderos, Cartas bajo la manga,
// Rey del heno y Albañil. Las piezas son las de madera del juego, con los colores de los jugadores.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'

// Colores propios: el naranja de un jugador del Catán (con su sombra) y la tierra de los caminos.
const ORANGE = '#E0843C', ORANGE_D = '#A95A22'
const DIRT = '#D9B585'

/** Hexágono de punta arriba. */
const hexagon = (cx: number, cy: number, r: number) => starPath(cx, cy, r, r, 3, -90)

/** Contorno esponjoso (lana, nubes): arquitos hacia afuera alrededor de una elipse. */
function fluff(cx: number, cy: number, rx: number, ry: number, n: number) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, x = f(cx + rx * Math.cos(a)), y = f(cy + ry * Math.sin(a))
    d += i ? `A${f((rx * 3.3) / n)} ${f((rx * 3.3) / n)} 0 0 1 ${x} ${y}` : `M${x} ${y}`
  }
  return d + 'Z'
}

/** Rulos de lana: trazos curvos sueltos dentro de un vellón. */
const curls = (pts: number[][], c = P.sky2, w = 0.45) => pts.map(([x, y]) => hair(x - 1.6, y + 0.4, x - 0.2, y - 1.6, x + 1.6, y + 0.2, w, c)).join('')

/** Poblado de madera en tres cuartos, con la base del frente centrada en (x,y). */
function settlement(k: Kit, x: number, y: number, s: number, c: string, dk: string) {
  const front = 'M-5 0V-6.4L0 -11L5 -6.4V0Z'
  const wall = 'M5 0V-6.4L10 -9V-2.6Z'
  const roof = 'M0 -11L5 -13.6L10 -9L5 -6.4Z'
  const lw = f(0.3 / s)
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: wall, fill: dk, line: 0.3 / s, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) + hair(6, -2, 7.6, -4.6, 9.4, -4, 0.3, P.night) },
      { d: roof, fill: c, line: 0.3 / s, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.6, dk, 0.35) + hair(1.4, -11.6, 4, -12, 6.6, -11, 0.25, '#fff', 0.5) },
      { d: front, fill: c, line: 0.3 / s, inner: k.sh(front, 0, 0, 1, 1, 0, 0.4, dk, 0.3) + `<path d="M-5 -11H-2V1H-5Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + hair(-3, -1, -2.4, -4, -3.2, -7, 0.3, dk) + hair(2, -1, 2.6, -3.4, 1.8, -6, 0.25, dk) },
    ], 0.55 / s) +
    `<path d="M-4.4 -6.6L0 -10.4" stroke="#fff" stroke-width="${lw}" opacity=".6" stroke-linecap="round"/>` +
    `</g>`
  )
}

/** Ciudad de madera en tres cuartos (la torre a dos aguas y el ala baja), base del frente en (x,y). */
function cityPiece(k: Kit, x: number, y: number, s: number, c: string, dk: string) {
  const front = 'M-8 0V-11L-4 -15L0 -11V-6H8V0Z'
  const towerWall = 'M0 -6V-11L4 -13.2V-8.2Z'
  const towerRoof = 'M-4 -15L0 -17.2L4 -13.2L0 -11Z'
  const lowTop = 'M0 -6H8L12 -8.2H4Z'
  const lowWall = 'M8 0V-6L12 -8.2V-2.2Z'
  const g = (x0: number, y0: number, x1: number, y1: number) => hair(x0, y0, (x0 + x1) / 2 + 0.4, (y0 + y1) / 2, x1, y1, 0.22, dk, 0.5)
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: lowWall, fill: dk, line: 0.3 / s, inner: k.sh(lowWall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      { d: lowTop, fill: c, line: 0.3 / s, inner: k.sh(lowTop, 0, 0, 1, 0, 0, 0.3, dk, 0.25) },
      { d: towerWall, fill: dk, line: 0.3 / s, inner: k.sh(towerWall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      { d: towerRoof, fill: c, line: 0.3 / s, inner: k.sh(towerRoof, 0, 0, 1, 1, 0, 0.6, dk, 0.35) },
      {
        d: front, fill: c, line: 0.3 / s,
        inner:
          k.sh('M-1 -18H9V1H-1Z', 0, 0, 1, 0, 0, 0.35, dk, 0.25) + k.sh('M-9 -3H9V1H-9Z', 0, 0, 0, 1, 0, 0.3, dk, 0.25) + `<path d="M-8 -15H-5V1H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
          g(-6.4, -1, -6.8, -9) + g(-2.6, -1, -2.2, -9.6) + g(2, -1, 2.4, -5) + g(5.4, -1, 5, -5),
      },
    ], 0.55 / s) +
    `<path d="M-7.4 -11.2L-4 -14.4" stroke="#fff" stroke-width="${f(0.35 / s)}" opacity=".65" stroke-linecap="round"/>` +
    `</g>`
  )
}

/** El ladrón del Catán: un peón gris, con la base en (0,0) y la cabeza arriba. */
function robber(k: Kit, x: number, y: number, s: number, rot = 0) {
  const body = 'M-2.2 -13.2C-2.2 -10.6 -6.4 -6.6 -6.4 -2.4C-6.4 -.2 -4 1 0 1C4 1 6.4 -.2 6.4 -2.4C6.4 -6.6 2.2 -10.6 2.2 -13.2Z'
  const head = ellipse(0, -16.4, 3.8, 3.8)
  const collar = roundRect(-3.6, -14, 3.6, -12, 1)
  const grey = (d: string) => ({ d, fill: P.blue, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.night, 0.4) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` })
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + k.draw([grey(body), grey(head), grey(collar)], 0.6 / s) + `</g>`
}

/** Oveja de perfil mirando a la izquierda, con el centro del cuerpo en (x,y). `coin` le pone una moneda en la boca. */
function sheep(k: Kit, x: number, y: number, s: number, coin = false) {
  const body = fluff(0, 0, 10, 6.8, 13)
  const head = 'M-8.4 -5.6C-12.6 -6.6 -16.4 -3.6 -16.2 .4C-16 3 -14 4.4 -11.8 3.8C-9.8 3.2 -8.2 .8 -7.2 -2Z'
  const legs = 'M-6.6 4H-4.4V11.6H-6.6ZM-2.2 4.6H0V11.6H-2.2ZM4 4.6H6.2V11.6H4ZM7.4 4H9.6V11.2H7.4Z'
  const cap = fluff(-10.4, -5.6, 3.2, 2.2, 7)
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: legs, fill: P.night },
      { d: body, fill: P.white, inner: k.sh(body, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + curls([[-3, -2], [3, -3], [6, 2], [-1, 3], [-6, 1], [1, -0.4], [7, -2.6]]) },
      { d: head, fill: P.night, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) + hair(-15.4, -1, -14, -3.6, -11, -4.6, 0.4, P.mid) },
    ], 0.55 / s) +
    `<path d="M-9.8 -4.4L-6 -6.8L-6.4 -3.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/>` +
    k.draw([{ d: cap, fill: P.white, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.4 / s) +
    `<circle cx="-12.6" cy="-1.4" r="1.2" fill="${P.white}"/><circle cx="-12.9" cy="-1.3" r=".6" fill="${P.ink}"/>` +
    (coin ? `<circle cx="-16.4" cy="3.4" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-16.4" cy="3.4" r="1.6" fill="none" stroke="${P.goldD}" stroke-width=".35"/><path d="M-17.4 2.2L-16.9 1.8" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` : '') +
    `</g>`
  )
}

/** Espiga de trigo: tallo desde (x0,y0) hasta la punta (x1,y1), con granos alternados y barbas. */
function ear(x0: number, y0: number, x1: number, y1: number, w = 1, n = 7) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux
  const a = (Math.atan2(dy, dx) * 180) / Math.PI
  let grains = '', awns = ''
  for (let i = 0; i < n; i++) {
    const t = 0.5 + (i * 0.48) / n, side = i % 2 ? 1 : -1, x = x0 + dx * t + px * side * 0.9 * w, y = y0 + dy * t + py * side * 0.9 * w
    grains += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.7 * w)}" ry="${f(0.95 * w)}" transform="rotate(${f(a + side * 28)} ${f(x)} ${f(y)})" fill="${P.gold}" stroke="${P.ink}" stroke-width="${f(0.28 * w)}"/>` +
      `<path d="M${f(x - ux * 0.9 * w)} ${f(y - uy * 0.9 * w)}L${f(x + ux * 0.7 * w)} ${f(y + uy * 0.7 * w)}" stroke="${P.goldD}" stroke-width="${f(0.25 * w)}"/>`
    const ex = x + ux * 1.2 * w + px * side * 0.6 * w, ey = y + uy * 1.2 * w + py * side * 0.6 * w
    awns += hair(ex, ey, ex + (ux * 2.6 + px * side * 1.4) * w, ey + (uy * 2.6 + py * side * 1.4) * w, ex + (ux * 5.6 + px * side * 2.2) * w, ey + (uy * 5.6 + py * side * 2.2) * w, 0.28 * w, P.goldD)
  }
  const tx = x0 + dx * 0.99, ty = y0 + dy * 0.99
  const tip = `<ellipse cx="${f(tx)}" cy="${f(ty)}" rx="${f(1.5 * w)}" ry="${f(0.85 * w)}" transform="rotate(${f(a)} ${f(tx)} ${f(ty)})" fill="${P.gold}" stroke="${P.ink}" stroke-width="${f(0.28 * w)}"/>` +
    hair(tx, ty, tx + ux * 3 * w, ty + uy * 3 * w, tx + ux * 6 * w, ty + uy * 6 * w, 0.3 * w, P.goldD)
  return `<path d="M${f(x0)} ${f(y0)}L${f(x0 + dx * 0.95)} ${f(y0 + dy * 0.95)}" stroke="${P.goldD}" stroke-width="${f(0.7 * w)}" stroke-linecap="round"/>` + awns + grains + tip
}

/** Carta de desarrollo del Catán parada, con la base al medio en (x,y): el dorso o un frente con su ícono. */
function devCard(k: Kit, x: number, y: number, rot: number, face: 'back' | 'knight' | 'vp' | 'wheat', s = 1) {
  const d = roundRect(-6.6, -19, 6.6, 0, 1.4)
  const panel = roundRect(-5.2, -17.6, 5.2, -6.4, 0.8)
  let body: string
  if (face === 'back') {
    body =
      k.draw([{ d, fill: P.mid, inner: k.sh('M0 -20H8V1H0Z', 0, 0, 1, 0, 0, 0.7, P.night, 0.4) + `<path d="M-7 -20H-3V1H-7Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` }], 0.5 / s) +
      `<path d="${roundRect(-5.1, -17.5, 5.1, -1.5, 0.8)}" fill="none" stroke="${P.goldL}" stroke-width="${f(0.45 / s)}"/>` +
      `<path d="${hexagon(0, -9.5, 4.4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/><path d="${hexagon(0, -9.5, 2.6)}" fill="${P.goldD}"/>` +
      `<circle cx="0" cy="-9.5" r=".9" fill="${P.goldL}"/>` +
      [[-3.6, -15.8], [3.6, -15.8], [-3.6, -3.2], [3.6, -3.2]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".45" fill="${P.goldL}"/>`).join('')
  } else {
    const icon =
      face === 'knight'
        ? `<path d="M-.7 -16.4L0 -17.6L.7 -16.4V-10.2H-.7Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="M-2.8 -10.4H2.8V-9.4H-2.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/><path d="M-.5 -9.4H.5V-7.6H-.5Z" fill="${P.brown}"/><circle cx="0" cy="-7.3" r=".6" fill="${P.gold}"/>` +
          `<path d="M-4.4 -15.4H-1.6V-11.6C-1.6 -10 -2.4 -9.2 -3 -8.8C-3.6 -9.2 -4.4 -10 -4.4 -11.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>`
        : face === 'vp'
          ? `<path d="${starPath(0, -12, 4, 1.8, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
          : ear(-1.6, -7.2, 1.2, -15.6, 0.55)
    body =
      k.draw([{ d, fill: P.white, inner: k.sh('M0 -20H8V1H0Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.5 / s) +
      `<path d="${panel}" fill="${face === 'knight' ? P.sky1 : face === 'vp' ? P.wine : P.sky}" stroke="${P.ink}" stroke-width=".3"/>` + icon +
      `<path d="M-4 -4.4H4M-4 -2.6H2.4" stroke="${P.sky2}" stroke-width=".55"/>`
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${body}</g>`
}

/** Morrión de granadero con su penacho, con el borde de abajo centrado en (0,0). */
function shako(k: Kit) {
  const body = 'M-7.4 0L-8.4 -15H8.4L7.4 0Z'
  const visor = 'M-8.4 -1C-4 1.2 4 1.2 8.4 -1L9.2 1C4 3.8 -4 3.8 -9.2 1Z'
  const top = 'M-8.4 -15C-8.4 -16.4 8.4 -16.4 8.4 -15Z'
  const plume = 'M1 -14.8C-3.6 -16.8 -3.2 -22 .4 -24.2C.2 -20.8 4.4 -19.2 3.2 -14.8Z'
  return (
    k.draw([
      { d: plume, fill: P.red, inner: k.sh(plume, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + hair(-.4, -15.6, -1, -19, .4, -22.6, 0.5, P.wine) + hair(1.6, -15.6, 1.6, -18, 2.6, -20, 0.35, '#fff', 0.6) },
      { d: body, fill: P.night, inner: k.sh('M0 -16H10V2H0Z', 0, 0, 1, 0, 0, 0.8, '#0E1533', 0.4) + `<path d="M-7.6 -12.2H7.6" stroke="${P.gold}" stroke-width=".9"/><path d="M-5.6 -13V-1.6" stroke="${P.mid}" stroke-width="1.1" opacity=".8"/>` },
      { d: top, fill: P.night },
      { d: visor, fill: P.night, inner: `<path d="M-6 .6C-2 1.8 2 1.8 6 .6" fill="none" stroke="${P.mid}" stroke-width=".5"/>` },
    ], 0.7) +
    `<path d="${starPath(0, -6.2, 3.4, 1.5, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="-6.2" r="1.1" fill="${P.goldL}"/>` +
    `<circle cx="-.1" cy="-14.6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Caballo de ajedrez mirando a la izquierda, con la base en (0,0): tallado, con brida, pechera y morrión. */
function knight(k: Kit, c: { fill: string; dark: string; light: string; line: string }, s: number) {
  const foot = 'M-17 0H17V-2.6C17 -4.8 14.6 -6.4 11.6 -6.8H-11.6C-14.6 -6.4 -17 -4.8 -17 -2.6Z'
  const ring = 'M-13 -6.8H13L11.8 -10.4H-11.8Z'
  const head =
    'M-11.8 -10.4C-12.8 -16 -9 -21 -8.6 -27C-8.4 -30 -10.6 -31.6 -14 -32.4L-21 -33.6C-24 -34 -25.4 -36.4 -24.6 -38.8' +
    'C-24 -40.8 -22.4 -42 -20.6 -42.6C-17 -45 -13.4 -49 -10 -52.4L-8.6 -56L-6.2 -60.4L-3.6 -54.6C2.6 -52 8.4 -46 10.6 -38' +
    'C12.6 -30 11.4 -22 13 -16C13.6 -13.4 12.8 -11.6 11.8 -10.4Z'
  const mane = 'M-3.6 -54.6C2.6 -52 8.4 -46 10.6 -38C12.6 -30 11.4 -22 13 -16L9.4 -17.6L10.4 -21.6L7.8 -23.6L8.8 -28.6L6.4 -30.6L6.6 -35.6L4 -37.4L3.4 -42.4L.4 -44L-.6 -48.6L-3.6 -50.6Z'
  const breast = 'M-11.2 -24.2C-4 -20.6 6 -20.8 12.4 -23.4L12.6 -18.6C6 -15.8 -4 -15.8 -11.8 -19.4Z'
  const w = (n: number) => f(n / s)
  const locks = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6, x = -1.6 + t * 11.4, y = -50 + t * 31
    return hair(x, y, x + 1.6, y + 2, x + 2.6, y + 4.6, 0.55, c.dark)
  }).join('')
  const fringe = Array.from({ length: 9 }, (_, i) => {
    const x = -9.6 + i * 2.6, y = -18.6 + Math.pow((x - 0.6) / 12, 2) * -1.6 + 1.6
    return `<path d="M${f(x)} ${f(y)}V${f(y + 2)}" stroke="${P.gold}" stroke-width=".55"/><circle cx="${f(x)}" cy="${f(y + 2.3)}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`
  }).join('')
  return (
    `<g transform="scale(${s})">` +
    k.draw([
      { d: foot, fill: c.fill, line: 0.3, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.9, c.dark, 0.45) + `<path d="M-17 -8H-9V1H-17Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` + `<path d="M-15.6 -3.4H15.6" stroke="${c.dark}" stroke-width=".4"/>` },
      { d: ring, fill: c.fill, inner: k.sh(ring, 0, 0, 1, 0, 0, 0.9, c.dark, 0.45) },
      {
        d: head, fill: c.fill,
        inner:
          k.sh('M2 -62H16V-8H2Z', 0, 0, 1, 0, 0, 0.9, c.dark, 0.45) + k.sh('M-26 -36H-6V-30H-26Z', 0, 0, 0, 1, 0.7, 0, c.dark, 0.35) +
          `<path d="M-26 -62H-14V-8H-26Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(-9, -42, -7.4, -36, -10.4, -31.4, 0.7, c.line) + hair(-8.4, -27, -10.4, -20, -10.4, -12.4, 0.5, c.dark) + hair(-4, -30, -5.4, -22, -4.4, -13, 0.4, c.dark) +
          hair(-17, -44.6, -15, -47.6, -12.4, -50, 0.5, '#fff', 0.8),
      },
      { d: mane, fill: c.dark, inner: k.sh(mane, 0, 0, 1, 0, 0, 0.6, c.line, 0.3) + locks },
    ], 0.85 / s) +
    // ojo, ollar, boca y brida dorada con su roseta
    `<path d="M-14.6 -45.4C-13.4 -46.8 -11.4 -46.8 -10.4 -45.4C-11.6 -44.4 -13.4 -44.4 -14.6 -45.4Z" fill="${P.ink}"/><circle cx="-12.2" cy="-45.6" r=".45" fill="#fff"/>` +
    hair(-15.4, -47.6, -12.6, -48.6, -9.6, -47.4, 0.5, c.line) +
    `<path d="M-23 -39.4C-22 -40.4 -20.8 -39.8 -21.4 -38.6" fill="none" stroke="${P.ink}" stroke-width="${w(0.5)}" stroke-linecap="round"/>` +
    `<path d="M-24.2 -36.2L-19.4 -35.4" stroke="${P.ink}" stroke-width="${w(0.5)}" stroke-linecap="round"/>` +
    `<path d="M-19.4 -35.4L-11.2 -40.4L-6 -50.4M-21.6 -41.6C-18 -40.6 -14.4 -41 -11.2 -40.4" fill="none" stroke="${P.ink}" stroke-width="${w(1.5)}" stroke-linecap="round"/>` +
    `<path d="M-19.4 -35.4L-11.2 -40.4L-6 -50.4M-21.6 -41.6C-18 -40.6 -14.4 -41 -11.2 -40.4" fill="none" stroke="${P.gold}" stroke-width="${w(0.7)}" stroke-linecap="round"/>` +
    `<circle cx="-11.2" cy="-40.4" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width="${w(0.4)}"/><circle cx="-11.2" cy="-40.4" r=".6" fill="${P.red}"/>` +
    k.draw([{ d: breast, fill: P.red, inner: k.sh(breast, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M-11.4 -22.6C-4 -19 6 -19.2 12.4 -21.8" fill="none" stroke="${P.gold}" stroke-width=".6"/>` }], 0.5 / s) +
    fringe +
    `<circle cx=".6" cy="-20.2" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="${starPath(0.6, -20.2, 1.3, 0.5, 6)}" fill="${P.goldL}"/>` +
    `<g transform="translate(-6.6 -53.4) rotate(-16) scale(.66)">${shako(k)}</g>` +
    `</g>`
  )
}

export const CATAN_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Ruta 40 ────────────────────────────────────────────────────────

  // Primer camino más largo: un hexágono de pasto con un camino de tierra lleno de pozos que igual llega al poblado.
  'Camino de tierra': (u) => {
    const k = kit(u)
    const hx = (i: number, dy = 0) => {
      const a = (i * Math.PI) / 3
      return `${f(60 + 33 * Math.cos(a))} ${f(70 + 16.4 * Math.sin(a) + dy)}`
    }
    const top = `M${[0, 1, 2, 3, 4, 5].map((i) => hx(i)).join('L')}Z`
    const side = `M${hx(3)}L${hx(2)}L${hx(1)}L${hx(0)}L${hx(0, 9)}L${hx(1, 9)}L${hx(2, 9)}L${hx(3, 9)}Z`
    const road = taper(58, 92, 39, 74, 62.6, 57.6, 20, 5.6)
    const puddle = (x: number, y: number, rx: number, ry: number) =>
      `<path d="${ellipse(x, y, rx, ry)}" fill="${P.brown}"/><path d="${ellipse(x + 0.2, y + ry * 0.12, rx * 0.86, ry * 0.78)}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="${ellipse(x + rx * 0.12, y + ry * 0.2, rx * 0.66, ry * 0.5)}" fill="${P.blue}" opacity=".35"/>` +
      hair(x - rx * 0.6, y - ry * 0.1, x - rx * 0.2, y - ry * 0.55, x + rx * 0.3, y - ry * 0.35, 0.5, P.white)
    const tuft = (x: number, y: number, s = 1) => hair(x - 1.2 * s, y, x - 1 * s, y - 1.4 * s, x - 1.8 * s, y - 2.6 * s, 0.45, P.greenD) + hair(x, y, x, y - 1.8 * s, x + 0.2 * s, y - 3.4 * s, 0.5, P.greenD) + hair(x + 1.2 * s, y, x + 1.2 * s, y - 1.4 * s, x + 2 * s, y - 2.4 * s, 0.45, P.greenD)
    const stones = [[34, 79, 1.3], [44, 90.6, 1.1], [52, 87.6, 0.8], [72, 91.6, 1.4], [84, 85, 1], [89, 79.6, 0.8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.7)}" fill="${P.brownD}"/><ellipse cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.25)}" rx="${f(r * 0.4)}" ry="${f(r * 0.25)}" fill="${P.goldL}" opacity=".6"/>`).join('')
    const roots = hair(39, 82, 41, 86, 39.4, 89, 0.45, P.brownD) + hair(64, 90, 66, 93, 64.6, 96, 0.45, P.brownD) + hair(80, 87, 82.6, 89.4, 82, 92, 0.4, P.brownD)
    const pebbles = [[50, 85], [61, 81.6], [47, 74], [56, 66], [62, 62], [44, 79]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".7" ry=".45" fill="${P.brown}"/>`).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 28, false) +
      k.floor(62, 84, 36, 6) +
      k.draw([
        { d: side, fill: P.brown, line: 0.35, inner: k.sh(side, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + k.sh(side, 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) + `<path d="M24 80.4Q60 101 96 80.4" fill="none" stroke="${P.brownD}" stroke-width=".4" stroke-dasharray="2 1.6" opacity=".7"/>` + stones + roots },
        {
          d: top, fill: P.green,
          inner:
            k.sh(top, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) + `<path d="M20 50H50V92H20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` +
            `<path d="${road}" fill="${DIRT}"/>` + k.sh(road, 0, 0, 1, 1, 0, 0.75, P.brown, 0.4) + pebbles +
            hair(50, 91, 34, 74, 60.6, 58.4, 0.7, P.brown) + hair(66, 91, 44, 74, 64.6, 58.4, 0.7, P.brown) +
            puddle(52.6, 81.8, 5.4, 2) + puddle(50.2, 70.8, 3.2, 1.3) + puddle(57.4, 63, 1.8, 0.8) +
            tuft(33, 71) + tuft(41, 61) + tuft(76, 64) + tuft(87, 70.6) + tuft(74, 78, 1.2) + tuft(38, 79) + tuft(84, 79, 0.9) + tuft(66, 84),
        },
      ], 0.75) +
      k.floor(67, 59.6, 11, 2.2, P.greenD) +
      settlement(k, 63.8, 60.4, 1.55, P.red, P.wine) +
      sparkle(88, 40, 2.4) + sparkle(31, 46, 1.6) +
      k.defs()
    )
  },

  // Tres: el escudo de la Ruta 40, como un blasón, sobre la cordillera y el asfalto que se pierde en el horizonte.
  'Ruta 40': (u) => {
    const k = kit(u)
    const far = 'M8 74L20 63L28 67L40 54L50 63L58 58L68 66L80 52L92 62L112 56V80H8Z'
    const snow = 'M40 54L35.8 59.2L38.4 58.6L40.4 60.6L42.4 58.2L44.4 59.2ZM80 52L75.6 57.4L78.2 56.8L80.2 59L82.4 56.6L84.4 57.4Z'
    const ground = 'M0 73H120V130H0Z'
    const road = 'M37 73.2H40L58 106H2Z'
    const shield = 'M41 34H79V52C79 63 71 70 60 74.6C49 70 41 63 41 52Z'
    const rim = 'M43.4 36.4H76.6V52C76.6 61.6 69.4 67.8 60 72C50.6 67.8 43.4 61.6 43.4 52Z'
    const post = 'M58.4 72H61.6V97H58.4Z'
    const clamp = (y: number) => `<path d="M57.2 ${y}H62.8V${y + 2}H57.2Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><circle cx="60" cy="${y + 1}" r=".4" fill="${P.ink}"/>`
    return (
      k.day() +
      k.sun(60, 54, 22, 48, 28, false) +
      `<path d="${far}" fill="${P.sky2}"/>` + k.shade(far, k.lin(P.blue, 0, 0, 1, 0, 0, 0.8), P.blue, 0.4) + `<path d="${snow}" fill="${P.white}"/>` +
      hair(40, 55, 37, 62, 32, 68, 0.45, P.mid) + hair(80, 53, 84, 60, 88, 66, 0.45, P.mid) + hair(58, 59, 61, 63, 64, 68, 0.4, P.mid) +
      `<path d="${far}" fill="none" stroke="${P.mid}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="${ground}" fill="${P.paper}"/>` + k.shade(ground, k.lin(P.goldL, 0, 0, 0, 1, 0.3, 1), P.gold, 0.4) +
      `<path d="M0 73.4H120" stroke="${P.ink}" stroke-width=".6"/>` +
      hair(70, 80, 82, 79, 94, 80.4, 0.5, P.goldD) + hair(74, 89, 86, 87.6, 98, 89, 0.5, P.goldD) + hair(66, 84, 72, 83.4, 78, 84.4, 0.4, P.goldD) +
      `<path d="${road}" fill="${P.blue}"/>` + k.shade(road, k.lin(P.mid, 0, 0, 1, 1, 0, 0.9), P.mid, 0.4) +
      `<path d="M37 73.2L2 106M40 73.2L58 106" stroke="${P.ink}" stroke-width=".8"/><path d="M38.6 74L30 106" stroke="${P.goldL}" stroke-width="1.5" stroke-dasharray="2.4 2.8"/>` +
      k.floor(62, 97, 7, 1.6, P.goldD) +
      k.draw([{ d: post, fill: P.sky1, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M58.6 74V96" stroke="#fff" stroke-width=".5"/>` }], 0.55) +
      clamp(76) + clamp(84) +
      k.cast([shield], 2.4, 2.2) +
      k.draw([{
        d: shield, fill: P.white,
        inner:
          `<path d="M36 30H84V45.4H36Z" fill="${P.ink}"/>` + k.sh('M62 30H84V76H62Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + `<path d="M36 45H50V76H36Z" fill="${k.lin(P.sky1, 0, 0, 1, 0, 0.5, 0)}"/>` +
          hair(46, 64, 50, 56, 56, 49, 0.9, '#fff', 0.7) + hair(70, 50, 74, 54, 75, 60, 0.4, P.blue),
      }], 0.9) +
      `<path d="${rim}" fill="none" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M43.4 45.2H76.6" stroke="${P.gold}" stroke-width=".8"/>` +
      [[45, 38.6], [75, 38.6], [60, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<text x="60" y="40.4" ${GEORGIA} font-weight="700" font-size="4" letter-spacing=".6" fill="${P.white}" text-anchor="middle">RUTA</text>` +
      `<text x="60" y="44" ${GEORGIA} font-size="2.4" letter-spacing=".5" fill="${P.sky}" text-anchor="middle">NACIONAL</text>` +
      `<text x="60" y="63.6" ${GEORGIA} font-weight="700" font-size="16" fill="${P.ink}" text-anchor="middle">40</text>` +
      sparkle(90, 36, 2) + sparkle(28, 48, 1.4) +
      k.defs()
    )
  },

  // Siete: ya cobrás peaje. La barrera dorada de la Panamericana, con su semáforo, y una oveja que paga con moneda.
  'Panamericana': (u) => {
    const k = kit(u)
    const plinth = 'M31 80H53V86H31Z'
    const molding = 'M33.4 75.6H50.6L53 80H31Z'
    const shaft = 'M34.6 56H49.4V75.6H34.6Z'
    const capital = 'M32.6 52H51.4L49.4 56H34.6Z'
    const housing = roundRect(33, 41.6, 51, 52, 2.4)
    const lights = roundRect(37.4, 27.4, 46.6, 41.6, 1.8)
    const hood = 'M37 29.2C37 26.6 47 26.6 47 29.2L46.2 30.4C45 29 39 29 37.8 30.4Z'
    const arm = 'M42 44.6H103V49.4H42Z'
    const stripes = Array.from({ length: 9 }, (_, i) => `<path d="M${50 + i * 7} 44L${53.6 + i * 7} 44L${52.6 + i * 7} 50H${49 + i * 7}Z" fill="${P.red}"/>`).join('')
    const gold = (d: string, line = 0) => ({ d, fill: P.gold, line, inner: k.sh(d, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` })
    const beads = (y: number, x0: number, x1: number) => Array.from({ length: Math.round((x1 - x0) / 2) + 1 }, (_, i) => `<circle cx="${f(x0 + i * 2)}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`).join('')
    const flutes = [37.4, 40.6, 43.8, 47].map((x) => `<path d="M${x} 57V74.6" stroke="${P.goldD}" stroke-width=".6"/><path d="M${f(x - 0.7)} 57V74.6" stroke="${P.goldL}" stroke-width=".35"/>`).join('')
    const rosette = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2, x = 42 + Math.cos(a) * 2.4, y = 47 + Math.sin(a) * 2.4
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.3" ry=".7" transform="rotate(${f((a * 180) / Math.PI)} ${f(x)} ${f(y)})" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`
    }).join('')
    const curl = (x: number, sgn: number) => {
      const d = 'M0 0C-2.6 0 -3.8 2.2 -3 3.8C-2.2 5.4 .4 5.2 .6 3.6C.8 2.6 -.4 2 -1.2 2.6'
      return `<g transform="translate(${x} 52.6) scale(${sgn} 1)"><path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".9" stroke-linecap="round"/></g>`
    }
    return (
      k.day() +
      k.sun(44, 46, 15, 60, 36, false) +
      k.shade(ellipse(44, 46, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<path d="M0 84H120V130H0Z" fill="${P.blue}"/>` + k.shade('M0 84H120V130H0Z', k.lin(P.mid, 0, 0, 0, 1, 0.2, 1), P.mid, 0.4) +
      `<path d="M0 84H120" stroke="${P.ink}" stroke-width=".8"/><path d="M14 92H28M54 92H70M84 92H100" stroke="${P.goldL}" stroke-width="1.5"/>` +
      k.floor(42, 86, 16, 2, P.night) + k.floor(76, 86.4, 12, 1.8, P.night) +
      k.draw([{ d: arm, fill: P.white, inner: stripes + k.sh(arm, 0, 0, 0, 1, 0, 0.8, P.blue, 0.35) + `<path d="M46 45.4H102" stroke="#fff" stroke-width=".5" opacity=".8"/>` }], 0.7) +
      k.draw([gold(plinth, 0.3), gold(molding), gold(shaft), gold(capital, 0.3), { d: housing, fill: P.mid, inner: k.sh(housing, 0, 0, 1, 1, 0, 0.8, P.night, 0.4) + `<path d="M33 42H39V52H33Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` }], 0.8) +
      flutes + beads(77.6, 34.4, 50.4) + beads(54, 34.6, 49.6) + curl(33, 1) + curl(51, -1) +
      `<path d="M33.6 83H50.4" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<path d="${roundRect(35.4, 60, 48.6, 68.4, 0.8)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="${roundRect(36.2, 60.8, 47.8, 67.6, 0.5)}" fill="none" stroke="${P.goldL}" stroke-width=".3"/>` +
      `<text x="42" y="65.6" ${GEORGIA} font-weight="700" font-size="3" letter-spacing=".2" fill="${P.goldL}" text-anchor="middle">PEAJE</text>` +
      rosette + `<circle cx="42" cy="47" r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="41.5" cy="46.5" r=".45" fill="#fff"/>` +
      k.shade(ellipse(42, 32.4, 9, 9), k.rad(P.red, 0.5, 0.5, 0.5, 0.7, 0), P.red, 0.3) +
      k.draw([
        { d: lights, fill: P.night, inner: k.sh(lights, 0, 0, 1, 0, 0, 0.8, '#0E1533', 0.4) },
        { d: hood, fill: P.night },
      ], 0.6) +
      `<circle cx="42" cy="32.4" r="2.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".5"/><circle cx="41.2" cy="31.6" r=".8" fill="#fff" opacity=".85"/>` +
      `<circle cx="42" cy="38" r="2.2" fill="${P.greenD}" stroke="${P.ink}" stroke-width=".5" opacity=".9"/><path d="M40.8 37.2A1.4 1.4 0 0 1 42.6 36.6" fill="none" stroke="${P.green}" stroke-width=".5"/>` +
      hair(36, 30, 33, 28.4, 30.4, 28.6, 0.55, P.red) + hair(48, 30, 51, 28.4, 53.6, 28.6, 0.55, P.red) + hair(37.4, 34.4, 34.4, 34.6, 32, 35.6, 0.45, P.red) + hair(46.6, 34.4, 49.6, 34.6, 52, 35.6, 0.45, P.red) +
      sheep(k, 77, 74.6, 1.1, true) +
      sparkle(86, 34, 2.6) + sparkle(64, 30, 1.6) + sparkle(60, 64, 1.3) +
      k.defs()
    )
  },

  // ── Granaderos ─────────────────────────────────────────────────────

  // Cinco caballeros: el soldadito de plomo es un peón de plomo pintado de granadero, con su morrión y la pintura saltada.
  'Soldadito de plomo': (u) => {
    const k = kit(u)
    const foot = 'M-15.4 0H15.4V-2.4C15.4 -4.2 13 -5.6 10 -5.8H-10C-13 -5.6 -15.4 -4.2 -15.4 -2.4Z'
    const ring = 'M-11.4 -5.8H11.4L10.4 -9.2H-10.4Z'
    const body = 'M-9.6 -9.2C-7.4 -17 -5 -25 -4.2 -31.6H4.2C5 -25 7.4 -17 9.6 -9.2Z'
    const collar = 'M-7.8 -31.8C-7.8 -34 -4.4 -35.2 0 -35.2C4.4 -35.2 7.8 -34 7.8 -31.8C7.8 -30.2 4.4 -29.4 0 -29.4C-4.4 -29.4 -7.8 -30.2 -7.8 -31.8Z'
    const head = ellipse(0, -42, 7.6, 7.6)
    const tin = (d: string, line = 0) => ({ d, fill: P.sky1, line, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` })
    const coat =
      `<path d="M-8 -10.4L4.2 -31M8 -10.4L-4.2 -31" stroke="${P.ink}" stroke-width="2.6"/><path d="M-8 -10.4L4.2 -31M8 -10.4L-4.2 -31" stroke="${P.white}" stroke-width="1.6"/>` +
      `<path d="M-12 -14.4H12V-11.6H-12Z" fill="${P.red}"/><path d="M-12 -14.4H12" stroke="${P.gold}" stroke-width=".4"/>` +
      k.sh('M1 -36H12V-8H1Z', 0, 0, 1, 0, 0, 0.85, P.night, 0.45) + `<path d="M-12 -36H-3V-8H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
      `<path d="M5.4 -20.6C6.6 -19 6.4 -17.2 5.2 -16.4C4.6 -17.6 4.4 -19.2 5.4 -20.6Z" fill="${P.sky1}" stroke="${P.mid}" stroke-width=".25"/>` +
      hair(-6.6, -16, -5.4, -24, -3.6, -29.6, 0.45, P.night)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61.6, 95, 19, 2.8) +
      `<g transform="translate(60 94.4) scale(.98)">` +
      k.draw([
        tin(foot, 0.3),
        tin(ring),
        { d: body, fill: P.mid, inner: coat },
        { d: collar, fill: P.red, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) },
        { d: head, fill: P.sky1, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="M-1 -38.6C.6 -38 1.6 -39 2.4 -38.2" fill="none" stroke="${P.mid}" stroke-width=".35"/><ellipse cx="-3.6" cy="-46" rx="1.8" ry="1.1" fill="#fff" opacity=".8" transform="rotate(-35 -3.6 -46)"/>` },
      ], 0.8) +
      `<path d="M-14 -2.6H14" stroke="${P.blue}" stroke-width=".4"/>` + hair(-12, -3.6, -9, -4.4, -6, -4.2, 0.4, '#fff') + hair(6, -1.4, 8.6, -1.8, 11, -1.2, 0.35, P.mid) +
      [-26.4, -22.4, -18.4].map((y) => `<circle cx="0" cy="${y}" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
      `<g transform="translate(0 -48.6) scale(.82)">${shako(k)}</g>` +
      `</g>` +
      sparkle(86, 40, 2.4) + sparkle(33, 52, 1.6) + sparkle(84, 70, 1.3) +
      k.defs()
    )
  },

  // Veinte: el granadero a caballo es el caballo de ajedrez, de marfil, con morrión, brida dorada y pechera de gala.
  'Granadero a caballo': (u) => {
    const k = kit(u)
    return (
      k.day() +
      k.sun(60, 54, 18, 47, 32, false) +
      k.floor(62, 94.6, 20, 2.8) +
      `<g transform="translate(63 94)">` +
      knight(k, { fill: P.white, dark: P.blue, light: P.sky1, line: P.mid }, 1) +
      `</g>` +
      sparkle(34, 40, 2.4) + sparkle(88, 70, 1.6) +
      k.defs()
    )
  },

  // Cincuenta: el caballo de oro, de granadero, en la cumbre de los Andes bajo el sol de Mayo; el ladrón, rodando cuesta abajo.
  'Cruce de los Andes': (u) => {
    const k = kit(u)
    const back = 'M4 100L24 70L32 75L44 62L52 70V100Z'
    const main = 'M14 104L34 80L44 84L60 66L74 80L82 74L108 104Z'
    const snow = 'M60 66L53.4 74.6L56.6 73.6L59 76.2L61.8 73.4L64.8 75.4L67 74ZM34 80L30.8 84.4L33.2 83.6L35.2 85.4L37 83.2L39 83.4ZM82 74L79 78L81.4 77.6L83 79.2L84.8 77.4L86.4 77.8Z'
    const flag = 'M84 37.4C87.4 36.2 90.6 38.6 94 37.4V45C90.6 46.2 87.4 43.8 84 45Z'
    const rock = (x0: number, y0: number, x1: number, y1: number, n: number, c: string) =>
      Array.from({ length: n }, (_, i) => {
        const t = i / n
        return hair(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, x0 + (x1 - x0) * t + 2.4, y0 + (y1 - y0) * t + 3, x0 + (x1 - x0) * t + 3.4, y0 + (y1 - y0) * t + 7, 0.45, c)
      }).join('')
    return (
      k.day() +
      k.sun(60, 50, 16, 47) +
      k.draw([{ d: back, fill: P.sky2, inner: k.sh(back, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M44 62L40.6 67.4L43.4 66.4L45.6 68L47.6 65.8Z" fill="${P.white}"/>` + rock(44, 64, 50, 80, 5, P.blue) }], 0.6) +
      k.draw([{
        d: main, fill: P.sky,
        inner:
          k.sh('M60 64L110 104H60Z', 0, 0, 1, 0, 0.2, 0.9, P.mid, 0.45) + k.sh('M14 90H110V104H14Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) +
          `<path d="${snow}" fill="${P.white}"/>` + k.sh(snow, 0, 0, 1, 0, 0, 0.5, P.sky2, 0.3) +
          rock(62, 70, 74, 88, 7, P.mid) + rock(84, 78, 96, 94, 5, P.mid) + rock(36, 84, 44, 94, 4, P.blue) +
          hair(60, 67, 55, 78, 48, 92, 0.6, P.white) + hair(44, 86, 40, 92, 34, 100, 0.5, P.white),
      }], 0.75) +
      k.shade(ellipse(60, 46, 20, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.floor(61, 68.6, 13, 1.8, P.mid) +
      `<g transform="translate(60.6 69.4)">` + knight(k, { fill: P.gold, dark: P.goldD, light: P.goldL, line: P.brownD }, 0.69) + `</g>` +
      `<path d="M84 72V33.6" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M84 72V33.6" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/><circle cx="84" cy="33.2" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      k.draw([{ d: flag, fill: P.white, inner: `<path d="M82 34H96V41.2H82Z" fill="${P.sky}"/>` + k.sh(flag, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) + hair(86, 39, 89, 38.6, 92, 39.4, 0.35, P.mid) }], 0.5) +
      `<circle cx="89" cy="41.2" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      robber(k, 55, 94.6, 0.52, -78) +
      hair(56, 88.4, 58.4, 87, 61, 87.6, 0.5) + hair(57.6, 91, 60.4, 90.4, 63, 91.4, 0.45) +
      sparkle(32, 40, 2.4, P.white) + sparkle(36, 54, 1.4, P.white) +
      k.defs()
    )
  },

  // ── Cartas bajo la manga ───────────────────────────────────────────

  // Cuatro cartas: el mazo de desarrollo, con una carta asomando del medio y el lápiz que marcó la esquina.
  'Mazo marcado': (u) => {
    const k = kit(u)
    // Las cartas acostadas: cada una se dibuja en sus coordenadas (13.2×19) y se lleva al paralelogramo A-B-D.
    const A = [31, 58], B = [70, 47], D = [49, 82]
    const m = (dx: number, dy: number) => `translate(${dx} ${dy}) matrix(${f(((B[0] - A[0]) / 13.2) * 100) / 100} ${f(((B[1] - A[1]) / 13.2) * 100) / 100} ${f(((D[0] - A[0]) / 19) * 100) / 100} ${f(((D[1] - A[1]) / 19) * 100) / 100} ${A[0]} ${A[1]})`
    const cardD = roundRect(0, 0, 13.2, 19, 1.1)
    const layers = [7, 5.6, 4.2, 2.8, 1.4].map((dy) => ({ d: cardD, t: m(0, dy), fill: P.white, line: 0.12, inner: k.sh(cardD, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }))
    const art =
      `<path d="${roundRect(1.1, 1.1, 12.1, 17.9, 0.7)}" fill="none" stroke="${P.goldL}" stroke-width=".22"/>` +
      `<path d="${hexagon(6.6, 9.5, 4.2)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".2"/><path d="${hexagon(6.6, 9.5, 2.6)}" fill="${P.goldD}"/><circle cx="6.6" cy="9.5" r=".8" fill="${P.goldL}"/>` +
      [[2.6, 2.6], [10.6, 2.6], [2.6, 16.4], [10.6, 16.4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".35" fill="${P.goldL}"/>`).join('') +
      `<path d="M9.2 1.8L10.2 3.4L12 1" fill="none" stroke="${P.white}" stroke-width=".4" stroke-linecap="round" stroke-linejoin="round"/>`
    const pencil = 'M0 -1.7H16V1.7H0Z'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(62, 86, 30, 4) +
      k.draw([{ d: cardD, t: `${m(-9, 6.6)} rotate(-8 6.6 9.5)`, fill: P.mid, line: 0.12, inner: k.sh(cardD, 0, 0, 1, 1, 0, 0.6, P.night, 0.4) + `<path d="M1.6 13.6L3 15.4L5 12.8" fill="none" stroke="${P.white}" stroke-width=".4" stroke-linecap="round"/>` }], 0.3) +
      k.draw(layers, 0.3) +
      k.draw([{ d: cardD, t: m(0, 0), fill: P.mid, inner: k.sh(cardD, 0, 0, 1, 1, 0, 0.8, P.night, 0.45) + `<path d="M-1 -1H5V20H-1Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + art }], 0.3) +
      `<g transform="translate(86.1 43.9) rotate(160)">` +
      k.draw([
        { d: pencil, fill: P.gold, inner: `<path d="M0 -.55H16V.55H0Z" fill="${P.goldD}" opacity=".6"/><path d="M0 -1.7H16V-.9H0Z" fill="#fff" opacity=".35"/>` + k.sh(pencil, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) },
        { d: 'M16 -1.7L22 0L16 1.7Z', fill: DIRT },
        { d: 'M-3.4 -1.7H0V1.7H-3.4Z', fill: P.sky2, line: 0.3, inner: `<path d="M-2.2 -2V2M-1.1 -2V2" stroke="${P.blue}" stroke-width=".3"/>` },
        { d: 'M-6.4 -1.7H-3.4V1.7H-6.4Z', fill: P.red, inner: k.sh('M-7 -2H-3V2H-7Z', 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.5) +
      `<path d="M20.4 -.45L22 0L20.4 .45Z" fill="${P.ink}"/>` +
      `</g>` +
      hair(60, 47, 62, 44.6, 65, 44, 0.5) + hair(55.6, 50, 57.6, 47.6, 60, 47.4, 0.45) +
      sparkle(32, 42, 2) + sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Siete: el tahúr del barco casino aprieta su mano de cartas en el puño, y otra más se asoma por el puño de la camisa.
  'Tahúr del Delta': (u) => {
    const k = kit(u)
    const finger = (x: number, w: number, top: number) => roundRect(f(x - w / 2), top, f(x + w / 2), 1.6, w / 2)
    const F: [number, number, number][] = [[-9.1, 6.2, -12.8], [-3, 6.2, -14.4], [3.1, 6.1, -13.6], [8.9, 5.6, -11.6]]
    const cuff = 'M-12.4 19H12L13 30H-13.4Z'
    const sleeve = 'M-15 28.6H15L17 44H-17Z'
    const wrist = 'M-9.4 10H9.2L8.8 21H-9Z'
    const palm = 'M-12.6 -3C-13.2 3 -12.8 9 -10.6 14H10.6C12.8 9 13.2 3 12.4 -3Z'
    const thumb = 'M-10.6 14C-14.6 11.6 -15.6 7.6 -14 3.6C-13.2 1.4 -11.4 0 -9.2 0H.8C3.2 0 4.8 1.4 4.8 3.2C4.8 5 3.2 6.4 1 6.4H-6C-6.6 9 -6 11.6 -4.4 14Z'
    const fan = ([[-36, 'wheat'], [-14, 'vp'], [8, 'knight'], [30, 'knight']] as const).map(([r, face]) => devCard(k, 0, 0, r, face, 1.45)).join('')
    const fist = k.draw(
      [
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H11V22H2Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.35) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -4C8 2 10 8 9 15H14V-4Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.35) + k.sh('M-8 5H11V14H-8Z', 0, 0, 0, 1, 0.75, 0.1, P.blue, 0.35) },
        ...F.map(([x, w, top]) => ({
          d: finger(x, w, top), fill: P.skin, line: 0.38,
          inner:
            k.sh(`M${f(x)} ${top - 1}H${f(x + w)}V3H${f(x)}Z`, 0, 0, 1, 0, 0, 0.75, P.blue, 0.35) + k.sh(`M${f(x - w)} -3H${f(x + w)}V3H${f(x - w)}Z`, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) +
            `<ellipse cx="${f(x - w * 0.16)}" cy="${f(top + 2.2)}" rx="${f(w * 0.17)}" ry=".9" fill="#fff" opacity=".9"/>` + hair(x - w * 0.3, top + 5.6, x, top + 5, x + w * 0.3, top + 5.6, 0.35, P.blue),
        })),
        {
          d: thumb, fill: P.skin, line: 0.38,
          inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M.6 1.4H2.4C3.7 1.4 4.3 2.4 4.3 3.2C4.3 4 3.7 5 2.4 5H.6C1.2 4 1.2 2.4 .6 1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-7.6, 1.2, -7, 3.2, -7.6, 5.4, 0.4),
        },
      ],
      0.62,
    )
    return (
      k.night() +
      [[30, 30], [90, 34], [96, 58], [24, 58], [40, 22], [80, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="M0 82H120V130H0Z" fill="${P.mid}"/>` + k.shade('M0 82H120V130H0Z', k.lin(P.night, 0, 0, 0, 1, 0, 0.9), P.night, 0.4) + `<path d="M0 82H120" stroke="${P.sky2}" stroke-width=".4"/>` +
      [[28, 86, 5], [36, 91, 3], [88, 87, 6], [82, 93, 4], [94, 95, 3]].map(([x, y, w]) => hair(x - w, y, x, y - 0.4, x + w, y, 0.55, P.goldL, 0.7)).join('') +
      k.shade(ellipse(60, 54, 34, 32), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.3) +
      `<g transform="translate(60 66) scale(1.06)">` +
      `<g transform="translate(-.6 -3)">${fan}</g>` +
      k.draw([{ d: sleeve, fill: P.wine, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M-8 28V44M0 28V44M8 28V44" stroke="${P.red}" stroke-width=".5" opacity=".5"/>` }], 0.7) +
      `<g transform="translate(9.6 27) rotate(24)">` + devCard(k, 0, 0, 0, 'back', 1) + `</g>` +
      k.draw([{ d: cuff, fill: P.white, line: 0.35, inner: k.sh('M2 17H15V32H2Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.35) + k.sh('M-15 17H15V22H-15Z', 0, 0, 0, 1, 0.8, 0, P.blue, 0.3) }], 0.62) +
      `<circle cx="-7.6" cy="24.6" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-8" cy="24.2" r=".45" fill="#fff"/>` +
      fist +
      `</g>` +
      sparkle(88, 44, 2.2, P.goldL) + sparkle(30, 46, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Diez: lo tuyo ya es magia. La galera, una oveja en vez de conejo y las cartas saliendo en abanico.
  'El mago Fu Manchú': (u) => {
    const k = kit(u)
    const crown = 'M43 71V90.6C43 94.6 77 94.6 77 90.6V71Z'
    const brimO = ellipse(60, 71, 21, 5.4), brimI = ellipse(60, 71, 15, 3.4)
    const brimFront = 'M39 71C39 74 48.4 76.4 60 76.4C71.6 76.4 81 74 81 71C81 72.4 75 74.4 60 74.4C45 74.4 39 72.4 39 71Z'
    const band = 'M43 72H77V78.6H43Z'
    const wand = 'M0 -1.3H24V1.3H0Z'
    const cards = ([[-154, 'knight'], [-122, 'back'], [-90, 'vp'], [-58, 'back'], [-26, 'wheat']] as const).map(([a, face]) => {
      const r = (a * Math.PI) / 180
      return devCard(k, f(60 + Math.cos(r) * 25), f(64 + Math.sin(r) * 25), a + 90, face, 0.92)
    }).join('')
    const wool = fluff(0, 3, 11.4, 7, 15)
    const head = 'M-4.6 -3C-4.8 -7 -2.6 -9 0 -9C2.6 -9 4.8 -7 4.6 -3C4.4 1 3.4 5 2 6.6C1.4 7.4 -1.4 7.4 -2 6.6C-3.4 5 -4.4 1 -4.6 -3Z'
    const earL = 'M-4.2 -4C-7.4 -6.6 -11.4 -6.6 -13 -4.6C-11.2 -2.2 -7.4 -1.6 -4.4 -2Z'
    const cap = fluff(0, -8.4, 5.6, 2.8, 9)
    const legL = taper(-6.4, 6, -7.6, 9, -8.4, 12.4, 2.4, 2.2), legR = taper(6.4, 6, 7.6, 9, 8.4, 12.4, 2.4, 2.2)
    const trail = hair(91, 56, 98, 46, 90, 40, 0.8, P.goldL) + hair(90, 40, 82, 34, 84, 26, 0.6, P.goldL) + hair(30, 62, 26, 54, 32, 48, 0.6, P.goldL) + [[94, 44], [86, 31], [28, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".6" fill="${P.goldL}"/>`).join('')
    const stars = [[78, 22, 1.2], [96, 34, 1], [66, 22, 0.9]].map(([x, y, r]) => sparkle(x, y, r, P.goldL)).join('')
    return (
      k.night() +
      k.shade(ellipse(60, 56, 40, 38), k.rad(P.gold, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.38) +
      [[28, 34], [92, 24], [24, 74], [96, 72], [38, 22], [84, 90], [30, 90]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      cards +
      k.floor(61, 94, 20, 2.6, '#000') +
      k.draw([{
        d: crown, fill: P.night,
        inner:
          k.sh('M62 70H80V96H62Z', 0, 0, 1, 0, 0, 0.9, '#0E1533', 0.45) + `<path d="${band}" fill="${P.red}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) +
          `<path d="M43 72.6H77M43 78H77" stroke="${P.gold}" stroke-width=".5"/>` +
          `<path d="M43 70H50V96H43Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.5, 0)}"/>` + hair(47, 81, 47.6, 86, 47, 92, 0.7, P.sky2) + hair(50.4, 82, 50.8, 86, 50.4, 91, 0.45, P.sky2) + hair(71, 81, 71.4, 86, 71, 91, 0.4, P.mid),
      }], 0.75) +
      `<path d="${roundRect(56.2, 72.4, 63.8, 78.2, 0.6)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${roundRect(57.8, 73.8, 62.2, 76.8, 0.3)}" fill="${P.red}" stroke="${P.goldD}" stroke-width=".35"/>` +
      k.draw([{ d: `${brimO}${brimI}`, fill: P.night, inner: k.sh(brimO, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) }], 0.7) +
      `<path d="${brimI}" fill="#0B1029"/>` +
      `<g transform="translate(60 62)">` +
      k.clip('M-30 -40H30V9.2C20 11.2 -20 11.2 -30 9.2Z', k.draw([{ d: wool, fill: P.white, inner: k.sh(wool, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + curls([[-7, 2], [-3, 5], [5, 4], [8, 1], [0, 8]]) }], 0.6)) +
      k.draw([
        { d: earL, fill: P.night, inner: `<path d="M-5 -3.4C-7.4 -5 -10 -5 -11.4 -4.2C-10 -3 -7.4 -2.6 -5 -2.8Z" fill="#E8B9B4" opacity=".8"/>` },
        { d: earL, t: 'scale(-1 1)', fill: P.night, inner: `<path d="M-5 -3.4C-7.4 -5 -10 -5 -11.4 -4.2C-10 -3 -7.4 -2.6 -5 -2.8Z" fill="#E8B9B4" opacity=".8"/>` },
        { d: head, fill: P.night, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) + hair(-2.6, -6, -3.4, -2, -2.6, 2, 0.5, P.mid) },
        { d: cap, fill: P.white, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) },
      ], 0.55) +
      `<ellipse cx="-2" cy="-2.6" rx="1.4" ry="1.6" fill="${P.white}"/><ellipse cx="2" cy="-2.6" rx="1.4" ry="1.6" fill="${P.white}"/><circle cx="-1.6" cy="-3.2" r=".75" fill="${P.ink}"/><circle cx="2.4" cy="-3.2" r=".75" fill="${P.ink}"/>` +
      `<path d="M-1.4 4.2Q-.8 4.8 -.4 4.2M.4 4.2Q.8 4.8 1.4 4.2" fill="none" stroke="${P.sky2}" stroke-width=".4" stroke-linecap="round"/>` +
      `</g>` +
      `<path d="${brimFront}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/><path d="M39.6 71.6C41 74.4 50 75.9 60 75.9C70 75.9 79 74.4 80.4 71.6" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="M42 72.6C48 74.6 72 74.6 78 72.6" fill="none" stroke="${P.sky2}" stroke-width=".4" opacity=".7"/>` +
      `<g transform="translate(60 62)">` + k.draw([{ d: legL, fill: P.night }, { d: legR, fill: P.night }], 0.45) + `<path d="M-8.4 11.4V13.2M8.4 11.4V13.2" stroke="${P.sky2}" stroke-width=".4"/></g>` +
      trail +
      `<g transform="translate(80 84) rotate(-62)">` +
      k.draw([{ d: wand, fill: P.night, inner: `<path d="M17.6 -2H25V2H17.6Z" fill="${P.white}"/><path d="M-1 -2H4V2H-1Z" fill="${P.white}"/><path d="M16.6 -2H17.6V2H16.6ZM4 -2H5V2H4Z" fill="${P.gold}"/>` + `<path d="M6 -.6H16" stroke="${P.sky2}" stroke-width=".4"/>` }], 0.5) +
      `</g>` +
      sparkle(92, 58, 3.2, P.goldL) + sparkle(87, 50, 1.4, P.goldL) + sparkle(97, 50, 1.1, P.goldL) + stars +
      sparkle(30, 82, 1.8, P.goldL) + sparkle(60, 30, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Rey del heno ───────────────────────────────────────────────────

  // Primera victoria a base de trigo: un fardito atado con hilo, con olor a campo.
  'Fardito': (u) => {
    const k = kit(u)
    const front = 'M33 64H69V89H33Z'
    const topF = 'M33 64L45 55H81L69 64Z'
    const end = 'M69 64L81 55V80L69 89Z'
    const straws = (x0: number, x1: number, y0: number, y1: number, n: number, c: string) =>
      Array.from({ length: n }, (_, i) => {
        const y = y0 + ((i * 7.3) % (y1 - y0)), x = x0 + ((i * 13.7) % (x1 - x0 - 6))
        return hair(x, y, x + 3, y - 0.4, x + 6, y + 0.3, 0.45, c)
      }).join('')
    const ends = Array.from({ length: 26 }, (_, i) => {
      const t = (i * 0.37) % 1, s = (i * 0.61) % 1
      return `<circle cx="${f(70 + t * 10)}" cy="${f(63.4 - t * 8 + s * 23)}" r=".45" fill="${P.brownD}"/>`
    }).join('')
    const twine = (x: number) => `<path d="M${x} 64V89" stroke="${P.ink}" stroke-width="1.7"/><path d="M${x} 64V89" stroke="${P.red}" stroke-width=".9"/>`
    const twineTop = (x: number) => `<path d="M${x} 64L${x + 12} 55" stroke="${P.ink}" stroke-width="1.5"/><path d="M${x} 64L${x + 12} 55" stroke="${P.red}" stroke-width=".8"/>`
    const whiff = (x: number, y: number, s: number) => hair(x, y, x - 3 * s, y - 4 * s, x, y - 8 * s, 0.75, P.greenD) + hair(x, y - 8 * s, x + 3 * s, y - 12 * s, x - 0.4, y - 16 * s, 0.6, P.greenD)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61, 90, 31, 3.4) +
      k.draw([
        { d: end, fill: P.goldD, line: 0.35, inner: k.sh(end, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.45) + ends },
        { d: topF, fill: P.goldL, line: 0.35, inner: k.sh(topF, 0, 0, 1, 1, 0, 0.7, P.gold, 0.4) + straws(39, 80, 56, 63, 14, P.goldD) },
        { d: front, fill: P.gold, line: 0.35, inner: k.sh(front, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M33 64H43V89H33Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + straws(34, 69, 66, 88, 36, P.goldD) },
      ], 0.85) +
      twineTop(42) + twineTop(58) + twine(42) + twine(58) +
      `<path d="M58 75.6C60.6 74.4 62.4 76.6 60.4 78.2C59 79.4 57.4 78 58 76.6" fill="none" stroke="${P.red}" stroke-width=".7"/>` +
      hair(33, 68, 30, 67, 27.6, 68.6, 0.5, P.goldD) + hair(33, 81, 30, 82.6, 28, 82, 0.5, P.goldD) + hair(69, 88, 72, 90.6, 75, 90, 0.5, P.goldD) + hair(49, 89, 48, 91.6, 45.6, 92.4, 0.5, P.goldD) +
      hair(37, 93, 41, 92, 44, 93.6, 0.5, P.goldD) + hair(77, 91.6, 80, 90.6, 83, 91.4, 0.45, P.goldD) +
      ear(55, 57, 49, 30, 1.2) + ear(59, 57, 65.4, 33, 1) +
      whiff(37, 52, 1) + whiff(31, 58, 0.8) + whiff(84, 50, 1) + whiff(89, 57, 0.8) +
      sparkle(88, 36, 2) +
      k.defs()
    )
  },

  // Tres: el rollo de heno coronado, con su cetro de trigo.
  'Rey del heno': (u) => {
    const k = kit(u)
    const back = 'M41.6 54L57 45A18.4 18.4 0 0 1 75.6 76.8L60.2 85.8Z'
    const face = ellipse(50.8, 69.6, 18.4, 18.4)
    let spiral = ''
    for (let i = 0; i <= 140; i++) {
      const a = (i / 140) * Math.PI * 2 * 4.6, r = 0.8 + (i / 140) * 16.2
      spiral += (i ? 'L' : 'M') + f(50.8 + Math.cos(a) * r) + ' ' + f(69.6 + Math.sin(a) * r)
    }
    const crown = 'M-11 0L-12.6 -12.4L-6 -6.4L0 -15.6L6 -6.4L12.6 -12.4L11 0Z'
    const band = 'M-11.4 0H11.4V3.6H-11.4Z'
    const bodyStraw = Array.from({ length: 11 }, (_, i) => {
      const t = i / 10, x = 46 + t * 26, y = 53 - t * 4 + (i % 3) * 7
      return hair(x, y + 8, x + 6, y + 4, x + 12, y + 1, 0.5, P.goldD)
    }).join('')
    const faceStraw = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 + 0.3, r = 6 + (i % 3) * 3.6
      return hair(50.8 + Math.cos(a) * r, 69.6 + Math.sin(a) * r, 50.8 + Math.cos(a + 0.2) * (r + 1), 69.6 + Math.sin(a + 0.2) * (r + 1), 50.8 + Math.cos(a + 0.4) * r, 69.6 + Math.sin(a + 0.4) * r, 0.4, P.gold)
    }).join('')
    const rod = 'M78.4 93.6L81.6 59.2L84 59.4L81 93.8Z'
    return (
      k.day() +
      k.sun(60, 56, 18, 47, 28, false) +
      k.floor(62, 89, 29, 3.4) +
      k.draw([
        { d: back, fill: P.gold, inner: k.sh(back, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + bodyStraw + `<path d="M50 72L64 63M54 80L70 71" stroke="${P.red}" stroke-width=".9"/>` },
        { d: face, fill: P.goldL, inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.gold, 0.45) + faceStraw + `<path d="${spiral}" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` + hair(39, 62, 43, 55, 49.6, 52.6, 0.8, P.white) },
      ], 0.85) +
      hair(35, 76, 32, 78, 30, 77, 0.5, P.goldD) + hair(39, 84, 36.4, 87, 34, 87, 0.5, P.goldD) + hair(70, 88, 73, 90.4, 76, 90, 0.5, P.goldD) +
      k.draw([{ d: rod, fill: P.gold, inner: k.sh(rod, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.4) + [64, 72, 80, 88].map((y) => `<path d="M${f(81.4 - (y - 60) * 0.09)} ${y}H${f(84 - (y - 60) * 0.09)}" stroke="${P.goldD}" stroke-width=".5"/>`).join('') }], 0.5) +
      `<circle cx="82.8" cy="58.4" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      ear(82.9, 57, 85, 36, 1.25) +
      `<g transform="translate(63.6 47.6) rotate(14)">` +
      k.draw([
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 1, P.goldD, 0.45) + `<path d="M-13 -16H-6V2H-13Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` + `<path d="M-10.4 -1.4L-11.4 -9.6M10.4 -1.4L11.4 -9.6" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: band, fill: P.goldD, inner: [-7, 0, 7].map((x) => `<circle cx="${x}" cy="1.8" r="1" fill="${x ? P.sky : P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join('') },
      ], 0.7) +
      [[-12.6, -12.4], [0, -15.6], [12.6, -12.4]].map(([x, y]) => `<circle cx="${x}" cy="${y - 1}" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      `<circle cx="0" cy="-6.6" r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-.5" cy="-7.1" r=".45" fill="#fff"/>` +
      `</g>` +
      sparkle(34, 40, 2.2) + sparkle(74, 30, 1.6) +
      k.defs()
    )
  },

  // Siete: el granero del mundo. Una gavilla gigante de trigo, atada con cinta celeste y blanca, plantada en el planeta.
  'Granero del mundo': (u) => {
    const k = kit(u)
    const globe = ellipse(60, 86, 15.4, 15.4)
    const land = 'M54 72.4C57 71.6 60 73 61.6 75.6C63.4 78.4 66 79 66.6 82C67.2 85 64 87.6 62.4 90.6C61 93.4 60.2 97 58.4 99.4C57.2 97 57.4 93.4 56.2 90.4C55 87.6 52.4 85.4 52.6 81.6C52.8 78.4 51.6 74.4 54 72.4Z'
    const land2 = 'M69.6 75C72.6 75.6 74.6 78.4 74.8 81.4C72.8 81 70.8 79.4 69.6 77Z'
    const angles = [-0.78, -0.58, -0.38, -0.19, 0, 0.19, 0.38, 0.58, 0.78]
    const ears = angles.map((a, i) => {
      const x0 = 60 + Math.sin(a) * 4, y0 = 61, len = 30 - Math.abs(a) * 6 - (i % 2) * 2.4
      return ear(x0, y0, x0 + Math.sin(a) * len, y0 - Math.cos(a) * len, 1.25, 8)
    }).join('')
    const butts = angles.map((a) => `<path d="M60 63L${f(60 + a * 7)} 72" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M60 63L${f(60 + a * 7)} 72" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>`).join('')
    const bow = 'M60 62.6C54 57 48 58 48.4 61.6C48.8 65 54.6 65.4 60 62.6ZM60 62.6C66 57 72 58 71.6 61.6C71.2 65 65.4 65.4 60 62.6Z'
    const tails = 'M59 63L52.6 72L55 71.4L55.6 74L60.2 63.6ZM61 63L67.4 72L65 71.4L64.4 74L59.8 63.6Z'
    return (
      k.day() +
      k.sun(60, 50, 17, 47) +
      k.shade(ellipse(60, 46, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.4) +
      laurel(50, 101, 32, 94, 28, 70, 7) + laurel(70, 101, 88, 94, 92, 70, 7, true) +
      k.cast([globe], 2.2, 2.2) +
      k.draw([{
        d: globe, fill: P.sky,
        inner:
          `<path d="${land}${land2}" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` + hair(55, 78, 57, 84, 59, 92, 0.4, P.greenD) + hair(62, 80, 63.6, 84, 62, 88, 0.35, P.greenD) +
          `<path d="M44.6 86H75.4M46 78Q60 80 74 78M46 94Q60 92 74 94M60 70.6V101.4M52 71Q46 86 52 101M68 71Q74 86 68 101" fill="none" stroke="${P.white}" stroke-width=".4" opacity=".7"/>` +
          k.sh(globe, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + `<ellipse cx="53" cy="77" rx="4" ry="2.4" fill="#fff" opacity=".6" transform="rotate(-35 53 77)"/>`,
      }], 0.75) +
      butts + ears +
      k.draw([
        { d: tails, fill: P.sky, inner: `<path d="M50 66H70V69.4H50Z" fill="${P.white}"/>` + k.sh(tails, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
        { d: bow, fill: P.sky, inner: `<path d="M46 61.8H74V63.4H46Z" fill="${P.white}"/>` + k.sh(bow, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + hair(50.6, 60, 53.6, 61, 57, 62, 0.35, P.mid) + hair(69.4, 60, 66.4, 61, 63, 62, 0.35, P.mid) },
      ], 0.5) +
      `<circle cx="60" cy="62.6" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(60, 62.6, 1.4, 0.6, 6)}" fill="${P.goldL}"/>` +
      sparkle(88, 34, 2.2) + sparkle(30, 40, 1.6) +
      k.defs()
    )
  },

  // ── Albañil ────────────────────────────────────────────────────────

  // Cinco ciudades: la primera ciudad del loteo, con los lotes marcados con estacas e hilo y el cartel clavado.
  'Loteo': (u) => {
    const k = kit(u)
    const field = 'M14 76H106V112H14Z'
    const stake = (x: number, y: number, h: number) => `<path d="M${x} ${y}V${f(y - h)}" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M${x} ${y}V${f(y - h)}" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/><path d="M${f(x - 0.65)} ${f(y - h - 0.2)}h1.3v1.4h-1.3Z" fill="${P.red}"/>`
    const board = roundRect(66, 36, 92, 51, 1.2)
    const strings = `M30 76.6L23 97M46 76.6L42 97M76 76.6L80 97M92 76.6L99 97M18 83H102M16 91H104`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<path d="${field}" fill="${P.green}"/>` + k.shade(field, k.lin(P.greenD, 0, 0, 0, 1, 0, 0.8), P.greenD, 0.4) +
      `<path d="M14 76.4H106" stroke="${P.ink}" stroke-width=".6"/>` +
      [[24, 80], [36, 88], [88, 80], [96, 88], [70, 94], [30, 95]].map(([x, y]) => hair(x - 1, y, x - 0.6, y - 1.6, x - 1.2, y - 2.8, 0.4, P.greenD) + hair(x + 0.6, y, x + 0.8, y - 1.6, x + 1.4, y - 2.6, 0.4, P.greenD)).join('') +
      `<path d="${strings}" fill="none" stroke="${P.white}" stroke-width=".55"/>` +
      stake(30, 77, 4) + stake(46, 77, 4) + stake(76, 77, 4) + stake(92, 77, 4) + stake(23, 84, 5) + stake(43.6, 84, 5) + stake(78.6, 84, 5) + stake(97.4, 84, 5) +
      k.floor(58, 88, 22, 2.8, P.greenD) +
      cityPiece(k, 55, 87.6, 2.2, P.red, P.wine) +
      `<path d="M71 50V85M87 50V85" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M71 50V85M87 50V85" stroke="${P.brown}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<g transform="rotate(4 79 44)">` +
      k.draw([{ d: board, fill: P.white, inner: k.sh(board, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + `<path d="M66 36H92V39.4H66Z" fill="${P.red}"/>` + hair(68, 49.4, 76, 48.8, 84, 49.6, 0.35, P.sky2) }], 0.55) +
      `<text x="79" y="47.4" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle">Loteo</text>` +
      `<circle cx="68" cy="37.7" r=".5" fill="${P.white}"/><circle cx="90" cy="37.7" r=".5" fill="${P.white}"/>` +
      `</g>` +
      sparkle(32, 42, 2.2) + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },

  // Quince: el country con su garita en la entrada y, detrás de la reja con lanzas, las ciudades.
  'Country con seguridad': (u) => {
    const k = kit(u)
    const booth = 'M27 50H51V93H27Z'
    const roof = 'M22.6 50.6L39 40.6L55.4 50.6Z'
    const eave = 'M22.6 50.6H55.4V53H22.6Z'
    const win = 'M30.4 56.6H47.6V70H30.4Z'
    const wall = 'M51 83H100V93H51Z'
    const bars = Array.from({ length: 9 }, (_, i) => {
      const x = 56 + i * 5
      return `<path d="M${x} 83V71" stroke="${P.ink}" stroke-width="1.7"/><path d="M${x} 83V71" stroke="${P.white}" stroke-width=".7"/><path d="M${x - 1.3} 71.4L${x} 67.6L${x + 1.3} 71.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }).join('')
    const tiles = Array.from({ length: 5 }, (_, i) => hair(26 + i * 5.4, 50.2, 30 + i * 4.6, 47, 34 + i * 3.4, 43.6, 0.45, P.wine)).join('')
    return (
      k.day() +
      k.stage(62, 60, 34) +
      k.floor(64, 93.4, 36, 2.8) +
      cityPiece(k, 67, 78, 1.7, P.mid, P.night) + cityPiece(k, 84, 80.4, 1.15, ORANGE, ORANGE_D) +
      `<path d="M52 74H100" stroke="${P.ink}" stroke-width="1.4"/><path d="M52 74H100" stroke="${P.white}" stroke-width=".6"/>` + bars +
      k.draw([{ d: wall, fill: P.white, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + Array.from({ length: 6 }, (_, i) => `<path d="M${56 + i * 9} 83V88M${51 + i * 9} 88H${60 + i * 9}M${60.5 + i * 9} 88V93" stroke="${P.sky2}" stroke-width=".4"/>`).join('') }], 0.6) +
      `<path d="M51 83H100" stroke="${P.gold}" stroke-width=".7"/>` +
      `<g transform="translate(2.6 0)">` +
      k.draw([
        { d: booth, fill: P.white, line: 0.4, inner: k.sh('M42 48H53V95H42Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M26 81H52V94H26Z" fill="${P.sky}"/><path d="M26 81H52" stroke="${P.ink}" stroke-width=".4"/>` + k.sh('M26 81H52V94H26Z', 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + hair(30, 86, 39, 85.4, 48, 86, 0.4, P.mid) },
        { d: roof, fill: P.red, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + tiles },
        { d: eave, fill: P.white, inner: k.sh(eave, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
      ], 0.75) +
      `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + k.sh(win, 0, 0, 1, 1, 0.1, 0.8, P.blue, 0.4) +
      hair(32, 68, 36, 62.6, 40, 57.6, 1, P.white) + hair(36.6, 69, 39.6, 65, 42.6, 61, 0.55, P.white) + `<path d="M39 56.6V70" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M29 71H49" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="${roundRect(29.4, 73.6, 48.6, 78.4, 0.6)}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="39" y="77.1" ${GEORGIA} font-weight="700" font-size="2.6" letter-spacing=".15" fill="${P.white}" text-anchor="middle">SEGURIDAD</text>` +
      `<path d="M36.6 41.4V38.6H41.4V41.4Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><path d="M36.6 38.6C36.6 34.8 41.4 34.8 41.4 38.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="M37.8 37.8C37.8 36.6 38.4 36 39 35.8" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      hair(35, 36.6, 32, 35, 29.6, 35, 0.55, P.goldD) + hair(43, 36.6, 46, 35, 48.4, 35, 0.55, P.goldD) + hair(39, 34, 39, 31.6, 39, 29.4, 0.55, P.goldD) +
      `</g>` +
      sparkle(88, 40, 2.2) + sparkle(64, 34, 1.4) +
      k.defs()
    )
  },

  // Cuarenta: Puerto Madero. La ciudad del Catán creció hasta ser una torre espejada, con el puente de la Mujer al pie.
  'Puerto Madero': (u) => {
    const k = kit(u)
    const front = 'M43 90V47L53 34L63 47V64H79V90Z'
    const towerWall = 'M63 64V47L68 44V61Z'
    const towerRoof = 'M53 34L58 31L68 44L63 47Z'
    const lowTop = 'M63 64H79L84 61H68Z'
    const lowWall = 'M79 90V64L84 61V87Z'
    const water = 'M0 90H120V130H0Z'
    const floors =
      Array.from({ length: 18 }, (_, i) => `<path d="M43 ${f(39 + i * 3)}H79" stroke="${P.white}" stroke-width=".35" opacity=".85"/>`).join('') +
      Array.from({ length: 10 }, (_, i) => `<path d="M${f(46.3 + i * 3.3)} 30V90" stroke="${P.mid}" stroke-width=".25" opacity=".55"/>`).join('')
    const lit = [[46.3, 51], [52.9, 57], [56.2, 45], [46.3, 72], [59.5, 81], [66.1, 69], [72.7, 78], [49.6, 84], [69.4, 84], [56.2, 66], [43, 60]]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="3.3" height="3" fill="${P.goldL}" opacity=".9"/>`).join('')
    const glass =
      `<path d="M43 30H80V90H43Z" fill="${k.lin(P.sky1, 0, 0, 0, 1, 0.9, 0)}"/>` + floors + lit +
      k.sh('M62 30H80V90H62Z', 0, 0, 1, 0, 0, 0.6, P.mid, 0.35) +
      `<path d="M43 72L63 54V60L43 78Z" fill="#fff" opacity=".4"/><path d="M43 82L79 56V59L43 85Z" fill="#fff" opacity=".3"/>` + hair(45, 52, 49, 45, 52, 39, 0.7, '#fff')
    const sideLines = (x0: number, y0: number, n: number) => Array.from({ length: n }, (_, i) => `<path d="M${x0} ${y0 + i * 3}L${x0 + 5} ${y0 - 3 + i * 3}" stroke="${P.sky2}" stroke-width=".3" opacity=".7"/>`).join('')
    const reflect = Array.from({ length: 8 }, (_, i) => hair(46 + i * 4.6, 93.4 + (i % 3) * 2.4, 48 + i * 4.6, 93 + (i % 3) * 2.4, 50.6 + i * 4.6, 93.4 + (i % 3) * 2.4, 0.6, i % 2 ? P.goldL : P.sky1)).join('')
    const mast = taper(41, 89, 35, 72, 27.4, 56, 3.2, 1.4)
    const deck = roundRect(16, 86.4, 50, 89.4, 1.2)
    const cables = [0.3, 0.45, 0.6, 0.75, 0.88].map((t, i) => {
      const a = 1 - t, x = a * a * 41 + 2 * a * t * 35 + t * t * 27.4, y = a * a * 89 + 2 * a * t * 72 + t * t * 56
      return `<path d="M${f(x)} ${f(y)}L${f(37 - i * 4.4)} 86.4" stroke="${P.ink}" stroke-width=".55"/><path d="M${f(x)} ${f(y)}L${f(37 - i * 4.4)} 86.4" stroke="${P.white}" stroke-width=".25"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 54, 20, 48, 32, false) +
      k.shade(ellipse(62, 56, 28, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.35) +
      k.cast([front], 2.4, 2) +
      k.draw([
        { d: lowWall, fill: P.mid, line: 0.35, inner: k.sh(lowWall, 0, 0, 1, 0, 0, 0.7, P.night, 0.4) + sideLines(79, 67, 8) },
        { d: lowTop, fill: P.sky2, line: 0.35 },
        { d: towerWall, fill: P.mid, line: 0.35, inner: k.sh(towerWall, 0, 0, 1, 0, 0, 0.7, P.night, 0.4) + sideLines(63, 50, 5) },
        { d: towerRoof, fill: P.gold, line: 0.35, inner: k.sh(towerRoof, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + hair(55, 34, 60, 36, 64, 42, 0.45, P.goldL) },
        { d: front, fill: P.sky, line: 0.4, inner: glass },
      ], 0.8) +
      `<path d="M43 47L53 34L63 47" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linejoin="round"/><path d="M43 47L53 34L63 47" fill="none" stroke="${P.gold}" stroke-width="1.1" stroke-linejoin="round"/>` +
      `<path d="M53 34V25.6" stroke="${P.ink}" stroke-width="1.2"/><path d="M53 34V25.6" stroke="${P.gold}" stroke-width=".5"/><circle cx="53" cy="25.2" r="1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M43 64H63" stroke="${P.gold}" stroke-width=".7"/>` +
      `<path d="${water}" fill="${P.mid}"/>` + k.shade(water, k.lin(P.night, 0, 0, 0, 1, 0, 0.9), P.night, 0.4) + `<path d="M0 90H120" stroke="${P.ink}" stroke-width=".9"/>` +
      `<path d="M46 92.4H80" stroke="${P.sky}" stroke-width="2" opacity=".5"/>` + reflect +
      cables +
      k.draw([
        { d: mast, fill: P.white, inner: k.sh(mast, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
        { d: deck, fill: P.white, inner: k.sh(deck, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M16 88H50" stroke="${P.sky2}" stroke-width=".4"/>` },
      ], 0.55) +
      sparkle(88, 38, 2.4) + sparkle(32, 44, 1.6) + sparkle(72, 46, 1.4, '#fff') +
      k.defs()
    )
  },
}
