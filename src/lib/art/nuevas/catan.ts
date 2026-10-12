// Medallas del Catán redibujadas (ver el kit en ../kit.ts): Ruta 40, Granaderos, Cartas bajo la manga,
// Rey del heno y Albañil. Las piezas son las de madera del juego, con los colores de los jugadores.
import { f } from '../helpers'
import { ellipse, hair, kit, MEEPLE, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

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

/** Poblado de madera en tres cuartos, con la base del frente centrada en (x,y). */
function settlement(k: Kit, x: number, y: number, s: number, c: string, dk: string) {
  const front = 'M-5 0V-6.4L0 -11L5 -6.4V0Z'
  const wall = 'M5 0V-6.4L10 -9V-2.6Z'
  const roof = 'M0 -11L5 -13.6L10 -9L5 -6.4Z'
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: wall, fill: dk, line: 0.3 / s, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      { d: roof, fill: c, line: 0.3 / s, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.8, dk, 0.4) },
      { d: front, fill: c, line: 0.3 / s, inner: k.sh(front, 0, 0, 1, 1, 0, 0.55, dk, 0.35) + `<path d="M-5 -11H-2V1H-5Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` },
    ], 0.55 / s) +
    `</g>`
  )
}

/** Ciudad de madera en tres cuartos (la torre a dos aguas y el ala baja), base del frente en (x,y). */
function cityPiece(k: Kit, x: number, y: number, s: number, c: string, dk: string, extra = '') {
  const front = 'M-8 0V-11L-4 -15L0 -11V-6H8V0Z'
  const towerWall = 'M0 -6V-11L4 -13.2V-8.2Z'
  const towerRoof = 'M-4 -15L0 -17.2L4 -13.2L0 -11Z'
  const lowTop = 'M0 -6H8L12 -8.2H4Z'
  const lowWall = 'M8 0V-6L12 -8.2V-2.2Z'
  const grain = s > 1.4 ? hair(-6.6, -9, -6, -5, -6.8, -1, 0.35 / s * 1.6, dk) + hair(2, -4.4, 4.6, -3.6, 6.6, -4.6, 0.3 / s * 1.6, dk) : ''
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: lowWall, fill: dk, line: 0.3 / s, inner: k.sh(lowWall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      { d: lowTop, fill: c, line: 0.3 / s, inner: k.sh(lowTop, 0, 0, 1, 0, 0, 0.6, dk, 0.4) },
      { d: towerWall, fill: dk, line: 0.3 / s, inner: k.sh(towerWall, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) },
      { d: towerRoof, fill: c, line: 0.3 / s, inner: k.sh(towerRoof, 0, 0, 1, 1, 0, 0.8, dk, 0.4) },
      { d: front, fill: c, line: 0.3 / s, inner: k.sh(front, 0, 0, 1, 1, 0, 0.55, dk, 0.35) + `<path d="M-8 -15H-5V1H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + grain + extra },
    ], 0.55 / s) +
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

/** Meeple chiquito (para tropas y multitudes). */
const tiny = (k: Kit, x: number, y: number, s: number, c: string, dk: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d: MEEPLE, fill: c, inner: k.sh('M0 -30H30V30H0Z', 0, 0, 1, 0, 0, 0.8, dk, 0.4) }], 0.5 / s) + `</g>`

/** Oveja de perfil mirando a la izquierda, con el centro del cuerpo en (x,y). */
function sheep(k: Kit, x: number, y: number, s: number) {
  const body = fluff(0, 0, 10, 6.8, 13)
  const head = 'M-8.4 -5.6C-12.6 -6.6 -16.4 -3.6 -16.2 .4C-16 3 -14 4.4 -11.8 3.8C-9.8 3.2 -8.2 .8 -7.2 -2Z'
  const legs = 'M-6.6 4H-4.4V11.6H-6.6ZM-2.2 4.6H0V11.6H-2.2ZM4 4.6H6.2V11.6H4ZM7.4 4H9.6V11.2H7.4Z'
  return (
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    k.draw([
      { d: legs, fill: P.night },
      { d: body, fill: P.white, inner: k.sh(body, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + [[-3, -2], [3, -3], [6, 2], [-1, 3], [-6, 1]].map(([a, b]) => hair(a - 1.6, b, a, b - 1.6, a + 1.6, b, 0.45, P.sky2)).join('') },
      { d: head, fill: P.night, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) },
    ], 0.55 / s) +
    `<path d="M-9.8 -4.4L-6 -6.8L-6.4 -3.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/>` +
    k.draw([{ d: fluff(-10.4, -5.6, 3.2, 2.2, 7), fill: P.white, inner: k.sh(fluff(-10.4, -5.6, 3.2, 2.2, 7), 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.4 / s) +
    `<circle cx="-12.6" cy="-1.4" r="1.2" fill="${P.white}"/><circle cx="-12.9" cy="-1.3" r=".6" fill="${P.ink}"/>` +
    `</g>`
  )
}

/** Espiga de trigo: tallo desde (x0,y0) hasta la punta (x1,y1), con granos alternados y barbas. */
function ear(x0: number, y0: number, x1: number, y1: number, w = 1) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux
  const a = (Math.atan2(dy, dx) * 180) / Math.PI
  let grains = '', awns = ''
  for (let i = 0; i < 7; i++) {
    const t = 0.5 + i * 0.075, side = i % 2 ? 1 : -1, x = x0 + dx * t + px * side * 0.9 * w, y = y0 + dy * t + py * side * 0.9 * w
    grains += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1.7 * w)}" ry="${f(0.95 * w)}" transform="rotate(${f(a + side * 28)} ${f(x)} ${f(y)})" fill="${P.gold}" stroke="${P.ink}" stroke-width="${f(0.28 * w)}"/>`
    const ex = x + ux * 1.2 * w + px * side * 0.6 * w, ey = y + uy * 1.2 * w + py * side * 0.6 * w
    awns += hair(ex, ey, ex + (ux * 2.6 + px * side * 1.4) * w, ey + (uy * 2.6 + py * side * 1.4) * w, ex + (ux * 5.6 + px * side * 2.2) * w, ey + (uy * 5.6 + py * side * 2.2) * w, 0.28 * w, P.goldD)
  }
  const tip = `<ellipse cx="${f(x0 + dx * 0.99)}" cy="${f(y0 + dy * 0.99)}" rx="${f(1.5 * w)}" ry="${f(0.85 * w)}" transform="rotate(${f(a)} ${f(x0 + dx * 0.99)} ${f(y0 + dy * 0.99)})" fill="${P.gold}" stroke="${P.ink}" stroke-width="${f(0.28 * w)}"/>`
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
      `<circle cx="0" cy="-9.5" r=".9" fill="${P.goldL}"/>`
  } else {
    const icon =
      face === 'knight'
        ? `<path d="M-.7 -16.4L0 -17.6L.7 -16.4V-10.2H-.7Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><path d="M-2.8 -10.4H2.8V-9.4H-2.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/><path d="M-.5 -9.4H.5V-7.6H-.5Z" fill="${P.brown}"/><circle cx="0" cy="-7.3" r=".6" fill="${P.gold}"/>` +
          `<path d="M-4.4 -15.4H-1.6V-11.6C-1.6 -10 -2.4 -9.2 -3 -8.8C-3.6 -9.2 -4.4 -10 -4.4 -11.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>`
        : face === 'vp'
          ? `<path d="${starPath(0, -12, 4, 1.8, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
          : ear(-1.6, -7.2, 1.6, -17, 0.55)
    body =
      k.draw([{ d, fill: P.white, inner: k.sh('M0 -20H8V1H0Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }], 0.5 / s) +
      `<path d="${panel}" fill="${face === 'knight' ? P.sky1 : face === 'vp' ? P.wine : P.sky}" stroke="${P.ink}" stroke-width=".3"/>` + icon +
      `<path d="M-4 -4.4H4M-4 -2.6H2.4" stroke="${P.sky2}" stroke-width=".55"/>`
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${body}</g>`
}

/** Morrión de granadero (coordenadas del meeple: va sobre la cabeza de radio 9.6). */
function shako(k: Kit) {
  const body = 'M-7.4 -21.4L-8.4 -36.4H8.4L7.4 -21.4Z'
  const visor = 'M-8.4 -22.4C-4 -20.2 4 -20.2 8.4 -22.4L9.2 -20.4C4 -17.6 -4 -17.6 -9.2 -20.4Z'
  const plume = 'M1 -36.2C-3.6 -38.2 -3.2 -43.4 .4 -45.6C.2 -42.2 4.4 -40.6 3.2 -36.2Z'
  return (
    k.draw([
      { d: plume, fill: P.red, inner: k.sh(plume, 0, 0, 1, 1, 0, 0.9, P.wine, 0.4) + hair(-.4, -37, -1, -40.4, .4, -44, 0.5, P.wine) },
      { d: body, fill: P.night, inner: k.sh('M0 -38H10V-20H0Z', 0, 0, 1, 0, 0, 0.8, '#0E1533', 0.4) + `<path d="M-7.6 -33.6H7.6" stroke="${P.gold}" stroke-width=".9"/><path d="M-5.6 -34.4V-23" stroke="${P.mid}" stroke-width="1.1" opacity=".8"/>` },
      { d: visor, fill: P.night },
    ], 0.7) +
    `<path d="M-8 -21.6C-8 -16 -6 -12.6 -3.6 -11.4M8 -21.6C8 -16 6 -12.6 3.6 -11.4" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
    `<path d="${starPath(0, -27.6, 3.4, 1.5, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="0" cy="-27.6" r="1.1" fill="${P.goldL}"/>`
  )
}

/** Casaca de granadero para un meeple: pantalón blanco, correaje cruzado y faja; luz y sombra. */
const UNIFORM =
  `<path d="M-30 6H30V30H-30Z" fill="${P.white}"/><path d="M-1 6H1V30H-1Z" fill="${P.sky2}"/>` +
  `<path d="M-12 -9.6L9 4.6M12 -9.6L-9 4.6" stroke="${P.ink}" stroke-width="3.6"/><path d="M-12 -9.6L9 4.6M12 -9.6L-9 4.6" stroke="${P.white}" stroke-width="2.4"/>` +
  `<path d="M-24 2.6H24" stroke="${P.red}" stroke-width="3"/>` +
  `<path d="M-7 -11.4C-3 -9.6 3 -9.6 7 -11.4L7.6 -9C3 -7.2 -3 -7.2 -7.6 -9Z" fill="${P.red}"/>`

/** Cara de soldadito pintado: ojos, bigote y cachetes. */
const FACE =
  `<circle cx="-2.6" cy="-15.6" r=".9" fill="${P.ink}"/><circle cx="2.6" cy="-15.6" r=".9" fill="${P.ink}"/>` +
  `<path d="M-3.6 -11.8C-2 -13.2 -.6 -12.6 0 -12C.6 -12.6 2 -13.2 3.6 -11.8C2 -11 .8 -11.4 0 -11.6C-.8 -11.4 -2 -11 -3.6 -11.8Z" fill="${P.ink}"/>` +
  `<ellipse cx="-4.6" cy="-13" rx="1.4" ry=".8" fill="${P.red}" opacity=".35"/><ellipse cx="4.6" cy="-13" rx="1.4" ry=".8" fill="${P.red}" opacity=".35"/>`

export const CATAN_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Ruta 40 ────────────────────────────────────────────────────────

  // Primer camino más largo: un hexágono de pasto con un camino de tierra lleno de pozos que igual llega al poblado.
  'Camino de tierra': (u) => {
    const k = kit(u)
    const hx = (i: number, dy = 0) => {
      const a = (i * Math.PI) / 3
      return `${f(60 + 38 * Math.cos(a))} ${f(68 + 17 * Math.sin(a) + dy)}`
    }
    const top = `M${[0, 1, 2, 3, 4, 5].map((i) => hx(i)).join('L')}Z`
    const side = `M${hx(3)}L${hx(2)}L${hx(1)}L${hx(0)}L${hx(0, 8)}L${hx(1, 8)}L${hx(2, 8)}L${hx(3, 8)}Z`
    const road = taper(58, 90, 38, 72, 62.6, 56.6, 21, 5.6)
    const puddle = (x: number, y: number, rx: number, ry: number) =>
      `<path d="${ellipse(x, y, rx, ry)}" fill="${P.brown}"/><path d="${ellipse(x + 0.2, y + ry * 0.12, rx * 0.86, ry * 0.78)}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="${ellipse(x + rx * 0.12, y + ry * 0.2, rx * 0.66, ry * 0.5)}" fill="${P.blue}" opacity=".35"/>` +
      hair(x - rx * 0.6, y - ry * 0.1, x - rx * 0.2, y - ry * 0.55, x + rx * 0.3, y - ry * 0.35, 0.5, P.white)
    const tuft = (x: number, y: number, s = 1) => hair(x - 1.2 * s, y, x - 1 * s, y - 1.4 * s, x - 1.8 * s, y - 2.6 * s, 0.45, P.greenD) + hair(x, y, x, y - 1.8 * s, x + 0.2 * s, y - 3.4 * s, 0.5, P.greenD) + hair(x + 1.2 * s, y, x + 1.2 * s, y - 1.4 * s, x + 2 * s, y - 2.4 * s, 0.45, P.greenD)
    const stones = [[33, 76, 1.3], [44, 88, 1.1], [52, 84.6, 0.8], [72, 89, 1.4], [84, 82.6, 1], [90, 76.6, 0.8]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.7)}" fill="${P.brownD}"/><ellipse cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.25)}" rx="${f(r * 0.4)}" ry="${f(r * 0.25)}" fill="${P.goldL}" opacity=".6"/>`).join('')
    const roots = hair(38, 79, 40, 83, 38.4, 86, 0.45, P.brownD) + hair(64, 87, 66, 90, 64.6, 93, 0.45, P.brownD) + hair(80, 84, 82.6, 86.4, 82, 89, 0.4, P.brownD)
    return (
      k.day() +
      k.sun(60, 50, 16, 46, 28, false) +
      k.floor(62, 82, 40, 6) +
      k.draw([
        { d: side, fill: P.brown, line: 0.35, inner: k.sh(side, 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + k.sh(side, 0, 0, 0, 1, 0, 0.6, P.brownD, 0.3) + `<path d="M20 77.4Q60 98 100 77.4" fill="none" stroke="${P.brownD}" stroke-width=".4" stroke-dasharray="2 1.6" opacity=".7"/>` + stones + roots },
        {
          d: top, fill: P.green,
          inner:
            k.sh(top, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.4) + `<path d="M18 48H50V90H18Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` +
            `<path d="${road}" fill="${DIRT}"/>` + k.sh(road, 0, 0, 1, 1, 0, 0.75, P.brown, 0.4) +
            hair(50, 89, 33, 72, 60.6, 57.4, 0.7, P.brown) + hair(66, 89, 43, 72, 64.6, 57.4, 0.7, P.brown) +
            puddle(52.6, 79.8, 5.4, 2) + puddle(50.2, 68.8, 3.2, 1.3) + puddle(57.6, 61.6, 1.8, 0.8) +
            tuft(30, 68) + tuft(40, 59) + tuft(76, 62) + tuft(88, 68.6) + tuft(74, 76, 1.2) + tuft(37, 77) + tuft(84, 77, 0.9) + tuft(66, 82),
        },
      ], 0.75) +
      k.floor(67, 57.8, 11, 2.2, P.greenD) +
      settlement(k, 63.8, 58.6, 1.5, P.red, P.wine) +
      sparkle(88, 38, 2.4) + sparkle(31, 44, 1.6) +
      k.defs()
    )
  },

  // Tres: el escudo de la Ruta 40, como un blasón, sobre la cordillera y el asfalto que se pierde en el horizonte.
  'Ruta 40': (u) => {
    const k = kit(u)
    const far = 'M8 74L20 62L28 66L40 52L50 62L58 57L68 66L80 50L92 61L112 54V80H8Z'
    const snow = 'M40 52L35.8 57.2L38.4 56.6L40.4 58.6L42.4 56.2L44.4 57.2ZM80 50L75.6 55.4L78.2 54.8L80.2 57L82.4 54.6L84.4 55.4Z'
    const ground = 'M0 72H120V130H0Z'
    const road = 'M42 72.2H45L70 106H8Z'
    const shield = 'M40 29H80V48C80 59 72 66 60 70.6C48 66 40 59 40 48Z'
    const post = 'M62.4 68H65.6V97H62.4Z'
    const shrub = (x: number, y: number, s: number) => `<path d="${ellipse(x, y, 2.6 * s, 1.3 * s)}" fill="${P.green}" stroke="${P.ink}" stroke-width=".35"/>` + hair(x - 1.6 * s, y - 0.2, x, y - 1.4 * s, x + 1.6 * s, y - 0.2, 0.4, P.greenD)
    return (
      k.day() +
      k.sun(60, 50, 22, 48, 28, false) +
      `<path d="${far}" fill="${P.sky2}"/>` + k.shade(far, k.lin(P.blue, 0, 0, 1, 0, 0, 0.8), P.blue, 0.4) + `<path d="${snow}" fill="${P.white}"/>` +
      `<path d="${far}" fill="none" stroke="${P.mid}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path d="${ground}" fill="${P.paper}"/>` + k.shade(ground, k.lin(P.goldL, 0, 0, 0, 1, 0.3, 1), P.gold, 0.4) +
      `<path d="M0 72.4H120" stroke="${P.ink}" stroke-width=".6"/>` +
      hair(74, 80, 86, 79, 98, 80.4, 0.5, P.goldD) + hair(80, 88, 90, 86.6, 100, 88, 0.5, P.goldD) + hair(16, 80, 24, 79, 32, 80.6, 0.45, P.goldD) +
      `<path d="${road}" fill="${P.blue}"/>` + k.shade(road, k.lin(P.mid, 0, 0, 1, 1, 0, 0.9), P.mid, 0.4) +
      `<path d="M42 72.2L8 106M45 72.2L70 106" stroke="${P.ink}" stroke-width=".8"/><path d="M43.4 73L39.2 106" stroke="${P.goldL}" stroke-width="1.5" stroke-dasharray="2.4 2.8"/>` +
      shrub(26, 84, 1.1) + shrub(84, 78, 0.8) + shrub(94, 92, 1.2) + shrub(18, 94, 1) +
      k.floor(66, 97, 7, 1.6, P.goldD) +
      k.draw([{ d: post, fill: P.sky1, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) }], 0.55) +
      `<g transform="translate(4 0)">` +
      k.cast([shield], 2.4, 2.2) +
      k.draw([{
        d: shield, fill: P.white,
        inner:
          `<path d="M36 26H84V40H36Z" fill="${P.ink}"/>` + k.sh('M62 26H84V72H62Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) + `<path d="M36 40H50V72H36Z" fill="${k.lin(P.sky1, 0, 0, 1, 0, 0.5, 0)}"/>` +
          `<path d="M42.4 42.4H77.6V48C77.6 57.4 71 63.4 60 67.8C49 63.4 42.4 57.4 42.4 48Z" fill="none" stroke="${P.ink}" stroke-width=".55"/>`,
      }], 0.9) +
      `<path d="M41 39.6H79" stroke="${P.gold}" stroke-width=".7"/>` +
      `<text x="60" y="34.4" ${GEORGIA} font-weight="700" font-size="4" letter-spacing=".6" fill="${P.white}" text-anchor="middle">RUTA</text>` +
      `<text x="60" y="38.2" ${GEORGIA} font-size="2.5" letter-spacing=".5" fill="${P.sky}" text-anchor="middle">NACIONAL</text>` +
      `<text x="60" y="61" ${GEORGIA} font-weight="700" font-size="17" fill="${P.ink}" text-anchor="middle">40</text>` +
      `</g>` +
      sparkle(90, 34, 2) + sparkle(28, 46, 1.4) +
      k.defs()
    )
  },

  // Siete: ya cobrás peaje. La cabina de la Panamericana bajo una gloria, y la primera en la fila es una oveja.
  'Panamericana': (u) => {
    const k = kit(u)
    const body = 'M27 50H49V93H27Z'
    const roof = 'M23.6 46H52.4L50.6 51H25.4Z'
    const sign = roundRect(25.4, 37.6, 50.6, 46, 1)
    const win = 'M30 55H46V69H30Z'
    const post = 'M49 71H56V93H49Z'
    const arm = 'M54 71.2H98V76.4H54Z'
    const rest = 'M93.6 76H96.4V93H93.6Z'
    const stripes = Array.from({ length: 7 }, (_, i) => `<path d="M${58 + i * 7.2} 70H${61.6 + i * 7.2}L${60.6 + i * 7.2} 78H${57 + i * 7.2}Z" fill="${P.red}"/>`).join('')
    return (
      k.day() +
      k.sun(64, 56, 18, 48, 28, false) +
      `<path d="M0 91H120V130H0Z" fill="${P.blue}"/>` + k.shade('M0 91H120V130H0Z', k.lin(P.mid, 0, 0, 0, 1, 0.2, 1), P.mid, 0.4) +
      `<path d="M0 91H120" stroke="${P.ink}" stroke-width=".8"/>` +
      `<path d="M6 98H20M32 98H50M62 98H80M92 98H110" stroke="${P.goldL}" stroke-width="1.5"/>` +
      k.floor(40, 93, 16, 2, P.night) + k.floor(95, 93, 4, 1, P.night) + k.floor(78, 93.4, 9, 1.6, P.night) +
      k.draw([
        { d: rest, fill: P.white, inner: k.sh(rest, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M93 80H97M93 85H97" stroke="${P.red}" stroke-width="2"/>` },
        {
          d: body, fill: P.white, line: 0.4,
          inner:
            k.sh('M40 48H52V95H40Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M24 82H52V95H24Z" fill="${P.sky}"/>` + `<path d="M24 82H52" stroke="${P.ink}" stroke-width=".4"/>` +
            k.sh('M24 82H52V95H24Z', 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) + hair(29, 86, 38, 85.4, 47, 86, 0.45, P.mid),
        },
        { d: roof, fill: P.mid, inner: k.sh(roof, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) },
        { d: sign, fill: P.gold, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) + `<path d="M25 38H31V47H25Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` },
        { d: post, fill: P.gold, line: 0.35, inner: k.sh(post, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) },
        { d: arm, fill: P.white, inner: stripes + k.sh(arm, 0, 0, 0, 1, 0, 0.8, P.blue, 0.35) },
      ], 0.75) +
      `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + k.sh(win, 0, 0, 1, 1, 0.1, 0.8, P.blue, 0.4) +
      hair(31.6, 66, 35, 61, 39, 56.4, 0.9, P.white) + hair(35.6, 67.4, 38.4, 63.6, 41.6, 59.4, 0.5, P.white) +
      `<path d="M28.6 70H47.4" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<text x="38" y="44.2" ${GEORGIA} font-weight="700" font-size="5" letter-spacing=".5" fill="${P.ink}" text-anchor="middle">PEAJE</text>` +
      `<circle cx="38" cy="34.4" r="2.4" fill="${P.red}" stroke="${P.ink}" stroke-width=".6"/><circle cx="37.3" cy="33.7" r=".7" fill="#fff" opacity=".8"/><path d="M38 36.8V37.6" stroke="${P.ink}" stroke-width=".8"/>` +
      hair(33, 32, 31, 30.6, 29, 30.6, 0.45, P.red) + hair(43, 32, 45, 30.6, 47, 30.6, 0.45, P.red) +
      `<circle cx="52.6" cy="73.8" r="2.6" fill="${P.white}" stroke="${P.ink}" stroke-width=".6"/><circle cx="52.6" cy="73.8" r=".9" fill="${P.ink}"/>` +
      sheep(k, 78.6, 82.6, 0.92) +
      sparkle(86, 40, 2.4) + sparkle(64, 30, 1.6) +
      k.defs()
    )
  },

  // ── Granaderos ─────────────────────────────────────────────────────

  // Cinco caballeros: el soldadito de plomo, de granadero, firme sobre su base de lata.
  'Soldadito de plomo': (u) => {
    const k = kit(u)
    const baseTop = ellipse(60, 88.4, 16, 3.8)
    const baseSide = 'M44 88.4V91.6C44 93.8 51 95.6 60 95.6C69 95.6 76 93.8 76 91.6V88.4Z'
    const rifle = 'M17.4 24V4L18.8 -1H21.2L22 4V24Z'
    const barrel = 'M18.8 -1V-36H20.6V-1Z'
    const bayonet = 'M19.2 -36L19.7 -46L20.2 -36Z'
    const inner =
      UNIFORM + k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.75, P.night) + k.sh('M-30 14H30V30H-30Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
      `<path d="M-30 -30H-2V30H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` +
      hair(-6, 9, -4.6, 14, -6.6, 20, 0.7, P.sky2) + hair(6, 9, 4.6, 14, 6.6, 20, 0.7, P.blue) + hair(-18, -6, -14, -4.6, -11, -6.4, 0.5, P.night) + hair(18, -6, 14, -4.6, 11, -6.4, 0.5, P.night)
    const head = ellipse(0, -15.6, 7.4, 7.2)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(61.6, 94, 20, 2.8) +
      k.draw([
        { d: baseSide, fill: P.sky2, inner: k.sh(baseSide, 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + hair(47, 92, 52, 93.6, 58, 94, 0.5, P.white) },
        { d: baseTop, fill: P.sky1, inner: k.sh(baseTop, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) },
      ], 0.65) +
      `<g transform="translate(60 62) scale(.94)">` +
      k.draw([{ d: MEEPLE, fill: P.mid, inner }], 0.85) +
      `<circle cx="0" cy="2.6" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="0" cy="-2.6" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-14 -8.6L-19.4 -8.2M14 -8.6L19.4 -8.2" stroke="${P.gold}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([{ d: head, fill: P.skin, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.5) + FACE + shako(k) +
      k.draw([
        { d: bayonet, fill: P.white },
        { d: barrel, fill: P.sky2, inner: k.sh(barrel, 0, 0, 1, 0, 0, 0.8, P.mid, 0.4) },
        { d: rifle, fill: P.brown, inner: k.sh(rifle, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + hair(18.6, 6, 19, 14, 18.6, 22, 0.4, P.goldL) },
      ], 0.6) +
      `<path d="${ellipse(20, -2, 3.4, 3)}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".6"/><path d="M17.8 -3.4H22.2" stroke="${P.red}" stroke-width="1.2"/>` +
      `</g>` +
      sparkle(86, 38, 2.2) + sparkle(32, 50, 1.6) + sparkle(84, 74, 1.3) +
      k.defs()
    )
  },

  // Veinte: el granadero sobre un caballito de madera del juego, encabritado como en el monumento, sable en alto.
  'Granadero a caballo': (u) => {
    const k = kit(u)
    const horse =
      'M-33.4 -18.6C-33.6 -21 -31 -23.6 -27.6 -26.4L-24.2 -29.4L-22.8 -34.6L-20 -30C-16.4 -27 -13.6 -18.6 -10 -13.4' +
      'C-4 -12.4 6 -13.4 12 -13.4C16.4 -13.4 18.8 -10.4 18.4 -6.4C18.2 -2.6 17.6 .6 16.6 2.6L18.4 16.4H13.4L11.4 4.6' +
      'C4 5.6 -3.6 5.6 -9 4.6L-15.6 7.4L-21 3.2C-22 2.6 -21.6 1.2 -20.6 1.2L-16.6 2.4C-18 -.6 -18.6 -5.6 -19.4 -10' +
      'C-20.4 -13.6 -22.4 -15.6 -24.6 -15L-30.4 -14.2C-32.4 -14 -33.4 -16 -33.4 -18.6Z'
    const farLegs = 'M-6.6 3.6L-12.6 8.2L-17.4 5.4L-16.4 3.8L-12.8 5.2L-8 1.4ZM6.4 4H10.6L12.4 16.4H7.6Z'
    const tail = taper(17.8, -10.6, 25, -5, 23, 8.6, 3.8, 1.4)
    const blanket = 'M-5 -13.6H10.4L11.2 -1.8C6.4 -.2 -1.2 -.2 -5.6 -1.8Z'
    const thigh = taper(2.4, -15.6, 8.6, -13, 9.6, -7.4, 4.2, 3.6)
    const boot = 'M7.4 -8.6H12L11.6 -1.4L14.6 -.6C15.6 -.3 15.6 1.2 14.6 1.4H7.6Z'
    const blade = 'M14 -25.6C19 -31.6 22 -39 22.2 -47.6C24 -38.8 21.6 -30.4 16 -24.2Z'
    const plinth = 'M30 90H90V96.4H30Z'
    const plinthTop = 'M33 86.4H87L90 90H30Z'
    const rider =
      `<g transform="translate(2.6 -21.4) scale(.58)">` +
      k.draw([{ d: MEEPLE, fill: P.mid, inner: UNIFORM + k.sh('M2 -30H30V30H2Z', 0, 0, 1, 0, 0, 0.75, P.night) + `<path d="M-30 -30H-2V30H-30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` }], 1.2) +
      `<circle cx="0" cy="-2.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{ d: ellipse(0, -15.6, 7.4, 7.2), fill: P.skin, inner: k.sh(ellipse(0, -15.6, 7.4, 7.2), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.8) + FACE + shako(k) +
      `</g>`
    return (
      k.day() +
      k.sun(60, 54, 18, 46) +
      k.floor(60, 95, 30, 2.4) +
      k.draw([
        { d: plinth, fill: P.white, line: 0.35, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) },
        { d: plinthTop, fill: P.sky1, inner: k.sh(plinthTop, 0, 0, 1, 0, 0, 0.6, P.sky2, 0.4) },
      ], 0.6) +
      `<g transform="translate(66 72.4) rotate(-20 16 16) scale(1.02)">` +
      k.draw([{ d: farLegs, fill: P.brownD, inner: k.sh(farLegs, 0, 0, 1, 0, 0, 0.6, P.night, 0.3) }], 0.6) +
      `<g transform="rotate(20 2.6 -21.4)">` +
      k.draw([{ d: blade, fill: P.white, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + hair(16, -26, 20.6, -35, 21.6, -45, 0.35, P.sky2) }], 0.5) +
      rider +
      `<path d="M13 -25.4L17.6 -23.2" stroke="${P.ink}" stroke-width="2.2"/><path d="M13 -25.4L17.6 -23.2" stroke="${P.gold}" stroke-width="1.1"/><path d="M14.2 -23.6C15.2 -21.6 17.6 -21.8 18 -23.6" fill="none" stroke="${P.gold}" stroke-width=".6"/>` +
      `</g>` +
      k.draw([
        { d: tail, fill: P.brownD, inner: hair(18.6, -8, 23, -3, 22.6, 6, 0.45, P.night) + hair(20, -8, 25, -2, 24.4, 4, 0.35, P.brown) },
        {
          d: horse, fill: P.brown,
          inner:
            k.sh('M0 -20H24V20H0Z', 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + k.sh('M-34 0H24V20H-34Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.35) +
            `<path d="M-34 -36H-18V20H-34Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` +
            hair(-19, -28.6, -15, -21, -11, -14.6, 1.8, P.brownD) + hair(-20.6, -28, -17.4, -22.6, -14.4, -17.4, 0.6, P.night) +
            hair(-12, -6, -10, -1, -11.6, 3, 0.5, P.brownD) + hair(8, -8, 11, -4, 13.6, 2, 0.5, P.brownD) +
            `<path d="M-24.6 -24.4l2.4 .7" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><circle cx="-31.4" cy="-19.2" r=".6" fill="${P.ink}"/>`,
        },
        { d: blanket, fill: P.red, line: 0.3, inner: k.sh(blanket, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) + `<path d="M-4.8 -4C-1 -2.6 6.4 -2.6 10.8 -4" fill="none" stroke="${P.gold}" stroke-width=".8"/>` },
        { d: thigh, fill: P.white, inner: k.sh(thigh, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
        { d: boot, fill: P.night, inner: `<path d="M7 -9H12.4V-7.4H7Z" fill="${P.ink}"/>` },
      ], 0.65) +
      `<path d="M-30 -16.4L-14 -21.6L1.4 -19.6" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      `</g>` +
      sparkle(32, 38, 2) +
      k.defs()
    )
  },

  // Cincuenta: el cruce de los Andes, con la tropa subiendo en fila, la bandera arriba y el ladrón tirado abajo.
  'Cruce de los Andes': (u) => {
    const k = kit(u)
    const back = 'M6 96L26 60L34 66L46 48L54 56V96Z'
    const main = 'M18 100L42 68L50 72L60 40L70 60L76 54L104 100Z'
    const snow = 'M60 40L54.4 56.6L57.8 53.4L60.6 57L63.4 52.6L66.4 55.6ZM42 68L38.4 73.2L41 72.4L43 74L44.6 71.6L46.4 70.2ZM76 54L72.6 59.6L75.4 58.6L77.4 60.6L79 58Z'
    const trail = 'M70 98L52 90L68 81L54 73L64 64L58 54L60.4 44'
    const flag = 'M60.4 32.6C63.4 31.6 66.4 33.6 69.4 32.6V39.6C66.4 40.6 63.4 38.6 60.4 39.6Z'
    const troops = ([[67, 96.4, 0.16], [56.6, 91.6, 0.15], [63.6, 83.6, 0.14], [57.4, 75.6, 0.13], [62, 66.6, 0.12], [59.6, 57.4, 0.11], [60.4, 46.6, 0.105]] as const)
      .map(([x, y, s], i) => tiny(k, x, y - 26 * s, s, i === 6 ? P.gold : P.mid, i === 6 ? P.goldD : P.night)).join('')
    return (
      k.day() +
      k.sun(60, 48, 15, 47) +
      k.draw([{ d: back, fill: P.sky2, inner: k.sh(back, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M46 48L42.6 54.4L45.4 53.4L47.6 55L49.6 52.8Z" fill="${P.white}"/>` }], 0.6) +
      k.draw([{
        d: main, fill: P.sky,
        inner:
          k.sh('M60 38L106 100H60Z', 0, 0, 1, 0, 0.2, 0.9, P.mid, 0.45) + k.sh('M18 84H106V100H18Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) +
          `<path d="${snow}" fill="${P.white}"/>` + k.sh(snow, 0, 0, 1, 0, 0, 0.5, P.sky2, 0.3) +
          hair(60, 41, 55, 56, 48, 74, 0.6, P.white) + hair(70, 61, 74, 72, 80, 84, 0.6, P.mid) + hair(64, 52, 70, 66, 72, 78, 0.5, P.mid) + hair(44, 70, 40, 78, 34, 88, 0.5, P.white) +
          `<path d="${trail}" fill="none" stroke="${P.paper}" stroke-width="1.2" stroke-dasharray="1.6 1.4" stroke-linejoin="round"/>`,
      }], 0.75) +
      troops +
      `<path d="M60.4 44V29.8" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/><circle cx="60.4" cy="29.6" r=".8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{ d: flag, fill: P.white, inner: `<path d="M58 29H72V36.1H58Z" fill="${P.sky}"/>` + k.sh(flag, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) }], 0.45) +
      `<circle cx="64.9" cy="36.1" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
      robber(k, 41.6, 94.6, 0.56, -100) +
      hair(36, 92, 38, 89.6, 40.6, 89, 0.5) + hair(35.4, 95.6, 37.6, 94.6, 39.6, 95, 0.45) +
      k.defs()
    )
  },

  // ── Cartas bajo la manga ───────────────────────────────────────────

  // Cuatro cartas: el mazo de desarrollo, con la marquita de lápiz en la esquina y una carta asomando.
  'Mazo marcado': (u) => {
    const k = kit(u)
    // Mazo en perspectiva: la carta de arriba es un paralelogramo; abajo, el canto de las cartas.
    const A = [36, 60], B = [70, 50], C = [86, 70], D = [52, 80]
    const pt = (p: number[], dy = 0) => `${p[0]} ${p[1] + dy}`
    const topFace = `M${pt(A)}L${pt(B)}L${pt(C)}L${pt(D)}Z`
    const edge = `M${pt(A)}L${pt(D)}L${pt(C)}L${pt(C, 7)}L${pt(D, 7)}L${pt(A, 7)}Z`
    const layers = [1.4, 2.8, 4.2, 5.6].map((dy) => `<path d="M${pt(A, dy)}L${pt(D, dy)}L${pt(C, dy)}" fill="none" stroke="${P.sky2}" stroke-width=".45"/>`).join('')
    // Carta de arriba dibujada en sus coordenadas y llevada al paralelogramo (de 13.2×19 a A-B-C-D).
    const ax = (B[0] - A[0]) / 13.2, ay = (B[1] - A[1]) / 13.2, bx = (D[0] - A[0]) / 19, by = (D[1] - A[1]) / 19
    const onTop = (s: string) => `<g transform="matrix(${f(ax * 100) / 100} ${f(ay * 100) / 100} ${f(bx * 100) / 100} ${f(by * 100) / 100} ${A[0]} ${A[1]})">${s}</g>`
    const art =
      `<path d="${roundRect(1.2, 1.2, 12, 17.8, 0.8)}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      `<path d="${hexagon(6.6, 9.5, 4.4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${hexagon(6.6, 9.5, 2.6)}" fill="${P.goldD}"/><circle cx="6.6" cy="9.5" r=".9" fill="${P.goldL}"/>` +
      `<path d="M9.4 2.2L10.4 3.6L11.6 1.6" fill="none" stroke="${P.white}" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round"/>`
    const pencil = 'M0 -1.6H26V1.6H0Z'
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(63, 84, 30, 4) +
      devCard(k, 41, 70, -64, 'knight', 1.5) +
      k.draw([
        { d: edge, fill: P.white, inner: layers + k.sh(edge, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
        { d: topFace, fill: P.mid, inner: k.sh(topFace, 0, 0, 1, 1, 0, 0.8, P.night, 0.45) + `<path d="M30 46H54V84H30Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.25, 0)}"/>` },
      ], 0.8) +
      onTop(art) +
      `<g transform="translate(74 47) rotate(132)">` +
      k.draw([
        { d: pencil, fill: P.gold, inner: `<path d="M0 -.5H26V.5H0Z" fill="${P.goldD}" opacity=".6"/>` + k.sh(pencil, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) },
        { d: 'M26 -1.6L32 0L26 1.6Z', fill: DIRT },
        { d: 'M-4 -1.6H0V1.6H-4Z', fill: P.sky2, line: 0.3 },
        { d: 'M-7.4 -1.6H-4V1.6H-7.4Z', fill: P.red, inner: k.sh('M-8 -2H-4V2H-8Z', 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.5) +
      `<path d="M30.4 -.4L32 0L30.4 .4Z" fill="${P.ink}"/>` +
      `</g>` +
      hair(73, 40, 75, 37, 78, 36, 0.5) + hair(78.6, 43, 81.4, 41.6, 84, 42, 0.45) +
      sparkle(32, 40, 2) + sparkle(88, 78, 1.6) +
      k.defs()
    )
  },

  // Siete: el tahúr del barco casino, con la mano de cartas y una más saliendo del puño de la camisa.
  'Tahúr del Delta': (u) => {
    const k = kit(u)
    const palm = 'M49 94C48 88 47.4 82 48.6 77.6C49.8 73.6 54 71.6 58.6 71.8C63.6 72 67 75.4 67.4 80.2C67.8 85.4 66.4 90.4 65 94Z'
    const thumb = 'M49.4 80.6C47.4 75.4 48.4 70.4 52.6 68.2C55.2 66.8 57.8 67.8 57.4 70.2C57 72.2 54.6 72.8 53.8 75L53.4 80.6Z'
    const cuff = 'M46.4 91.6H67.6L68.6 99H45.4Z'
    const sleeve = 'M43 98H71L76 116H38Z'
    const fan = ([[-30, 'wheat'], [-11, 'vp'], [8, 'knight'], [27, 'knight']] as const).map(([r, face]) => devCard(k, 0, 0, r, face, 1.62)).join('')
    const boat = 'M22 75.6H44L42 78.4H24Z'
    return (
      k.night() +
      [[30, 30], [90, 34], [96, 58], [24, 56], [40, 22], [80, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      `<path d="M0 78H120V130H0Z" fill="${P.mid}"/>` + k.shade('M0 78H120V130H0Z', k.lin(P.night, 0, 0, 0, 1, 0, 0.9), P.night, 0.4) +
      `<path d="M0 78H120" stroke="${P.sky2}" stroke-width=".4"/>` +
      `<path d="${boat}" fill="${P.night}" stroke="${P.sky2}" stroke-width=".35"/><path d="M26 75.6V72.6H40V75.6M29 72.6V70H37V72.6" fill="${P.night}" stroke="${P.sky2}" stroke-width=".35"/>` +
      [27.6, 30.6, 33.6, 36.6].map((x) => `<rect x="${x}" y="73.4" width="1.4" height="1.2" fill="${P.goldL}"/>`).join('') +
      [[28, 82, 4], [34, 86, 3], [90, 84, 6], [84, 90, 4], [96, 92, 3]].map(([x, y, w]) => hair(x - w, y, x, y - 0.4, x + w, y, 0.5, P.goldL, 0.7)).join('') +
      k.shade(ellipse(58, 56, 32, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.goldL, 0.3) +
      `<g transform="translate(57.6 76)">${fan}</g>` +
      k.draw([
        { d: sleeve, fill: P.wine, inner: k.sh(sleeve, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + hair(50, 100, 52, 106, 50.6, 112, 0.5, P.night) },
        { d: cuff, fill: P.white, line: 0.35, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) },
      ], 0.7) +
      `<g transform="translate(66.4 93.6) rotate(28)">` + devCard(k, 0, 0, 0, 'back', 1.1) + `</g>` +
      k.draw([{ d: cuff, fill: P.white, line: 0.35, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.7, P.blue, 0.35) }], 0) +
      `<path d="M66 92L69.6 98.6" stroke="${P.ink}" stroke-width=".4"/>` +
      `<circle cx="51" cy="95.4" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        { d: palm, fill: P.skin, inner: k.sh('M58 70H70V96H58Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.35) + k.sh('M46 84H70V96H46Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) + hair(56, 82, 60, 86, 64, 85, 0.45) },
        { d: thumb, fill: P.skin, line: 0.38, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) + `<path d="M53.6 68.8C55 68.2 56.6 68.6 56.6 69.8C56.6 70.8 55.4 71.2 54.2 71Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` },
      ], 0.6) +
      sparkle(88, 44, 2.2, P.goldL) + sparkle(30, 44, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Diez: la galera del mago, con una oveja en vez de conejo y las cartas volando en abanico.
  'El mago Fu Manchú': (u) => {
    const k = kit(u)
    const crown = 'M43 71V90.6C43 94.6 77 94.6 77 90.6V71Z'
    const brimO = ellipse(60, 71, 21, 5.4), brimI = ellipse(60, 71, 15, 3.4)
    const brimFront = 'M39 71C39 74 48.4 76.4 60 76.4C71.6 76.4 81 74 81 71C81 72.4 75 74.4 60 74.4C45 74.4 39 72.4 39 71Z'
    const wand = 'M0 -1.3H24V1.3H0Z'
    const cards = ([[-150, 'knight'], [-120, 'back'], [-90, 'vp'], [-60, 'back'], [-30, 'wheat']] as const).map(([a, face]) => {
      const r = (a * Math.PI) / 180
      return devCard(k, f(60 + Math.cos(r) * 26), f(64 + Math.sin(r) * 26), a + 90, face, 0.9)
    }).join('')
    const head = 'M-4.4 -1.4C-4.6 -5.6 -2.6 -7.6 0 -7.6C2.6 -7.6 4.6 -5.6 4.4 -1.4C4.2 2.6 2.4 5 0 5C-2.4 5 -4.2 2.6 -4.4 -1.4Z'
    const legsUp = 'M-7.4 -3.6H-4.6V3.6H-7.4ZM4.6 -3.6H7.4V3.6H4.6Z'
    return (
      k.night() +
      k.shade(ellipse(60, 54, 40, 38), k.rad(P.gold, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.35) +
      [[28, 34], [92, 30], [24, 74], [96, 72], [38, 22], [84, 90]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}"/>`).join('') +
      cards +
      k.floor(61, 94, 20, 2.6, '#000') +
      k.draw([{
        d: crown, fill: P.night,
        inner:
          k.sh('M62 70H80V96H62Z', 0, 0, 1, 0, 0, 0.9, '#0E1533', 0.45) + `<path d="M43 72H77V78.6H43Z" fill="${P.red}"/>` + k.sh('M43 72H77V78.6H43Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) +
          `<path d="M43 70H50V96H43Z" fill="${k.lin(P.sky, 0, 0, 1, 0, 0.45, 0)}"/>` + hair(47, 82, 47.6, 86, 47, 91, 0.6, P.sky2),
      }], 0.75) +
      k.draw([{ d: `${brimO}${brimI}`, fill: P.night, inner: k.sh(brimO, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) }], 0.7) +
      `<path d="${brimI}" fill="#0B1029"/>` +
      `<g transform="translate(60 66)">` +
      k.clip('M-30 -40H30V5.4C20 7.2 -20 7.2 -30 5.4Z',
        k.draw([{ d: fluff(0, 2, 11, 7.6, 14), fill: P.white, inner: k.sh(fluff(0, 2, 11, 7.6, 14), 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + hair(-6, 0, -4, -2, -2, 0, 0.45, P.sky2) + hair(4, 1, 6, -1, 8, 1, 0.45, P.sky2) }], 0.6)) +
      `<path d="M-5 -4.4L-10.6 -6.6L-9.4 -2.4ZM5 -4.4L10.6 -6.6L9.4 -2.4Z" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([{ d: head, fill: P.night, inner: k.sh(head, 0, 0, 1, 1, 0, 0.6, '#0E1533', 0.4) }], 0.55) +
      k.draw([{ d: fluff(0, -7.6, 4.4, 2.6, 8), fill: P.white, inner: k.sh(fluff(0, -7.6, 4.4, 2.6, 8), 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) }], 0.45) +
      `<circle cx="-1.9" cy="-2" r="1.3" fill="${P.white}"/><circle cx="1.9" cy="-2" r="1.3" fill="${P.white}"/><circle cx="-1.7" cy="-1.8" r=".65" fill="${P.ink}"/><circle cx="2.1" cy="-1.8" r=".65" fill="${P.ink}"/>` +
      `<path d="M-1 2.6Q0 3.4 1 2.6" fill="none" stroke="${P.sky2}" stroke-width=".4"/>` +
      `<g transform="translate(0 4.4)">` + k.draw([{ d: legsUp, fill: P.night }], 0.45) + `</g>` +
      `</g>` +
      `<path d="${brimFront}" fill="${P.night}" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(78 82) rotate(-58)">` +
      k.draw([{ d: wand, fill: P.night, inner: `<path d="M17 -2H25V2H17Z" fill="${P.white}"/><path d="M-1 -2H4V2H-1Z" fill="${P.white}"/>` }], 0.5) +
      `</g>` +
      sparkle(92, 58, 3, P.goldL) + sparkle(86, 50, 1.4, P.goldL) + sparkle(96, 48, 1.1, P.goldL) +
      sparkle(30, 82, 1.8, P.goldL) + sparkle(60, 30, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Rey del heno ───────────────────────────────────────────────────

  // Primera victoria a base de trigo: un fardito atado con hilo, con olor a campo.
  'Fardito': (u) => {
    const k = kit(u)
    const front = 'M34 64H70V88H34Z'
    const topF = 'M34 64L46 55H82L70 64Z'
    const end = 'M70 64L82 55V79L70 88Z'
    const straws = (x0: number, x1: number, y0: number, y1: number, n: number, c: string) =>
      Array.from({ length: n }, (_, i) => {
        const y = y0 + ((i * 7.3) % (y1 - y0)), x = x0 + ((i * 13.7) % (x1 - x0 - 6))
        return hair(x, y, x + 3, y - 0.4, x + 6, y + 0.3, 0.45, c)
      }).join('')
    const ends = Array.from({ length: 22 }, (_, i) => {
      const t = (i * 0.37) % 1, s = (i * 0.61) % 1
      return `<circle cx="${f(71 + t * 10 - 0)}" cy="${f(63 - t * 8 + s * 22)}" r=".45" fill="${P.goldD}"/>`
    }).join('')
    const twine = (x: number) => `<path d="M${x} 64V88" stroke="${P.ink}" stroke-width="1.7"/><path d="M${x} 64V88" stroke="${P.red}" stroke-width=".9"/>`
    const twineTop = (x: number) => `<path d="M${x} 64L${x + 12} 55" stroke="${P.ink}" stroke-width="1.5"/><path d="M${x} 64L${x + 12} 55" stroke="${P.red}" stroke-width=".8"/>`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.floor(62, 89, 30, 3.4) +
      k.draw([
        { d: end, fill: P.goldD, line: 0.35, inner: k.sh(end, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.45) + ends },
        { d: topF, fill: P.goldL, line: 0.35, inner: k.sh(topF, 0, 0, 1, 1, 0, 0.7, P.gold, 0.4) + straws(40, 80, 56, 63, 14, P.goldD) },
        { d: front, fill: P.gold, line: 0.35, inner: k.sh(front, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M34 64H44V88H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` + straws(35, 70, 66, 87, 34, P.goldD) },
      ], 0.85) +
      twineTop(43) + twineTop(59) + twine(43) + twine(59) +
      `<path d="M59 74.6C61.6 73.4 63.4 75.6 61.4 77.2C60 78.4 58.4 77 59 75.6" fill="none" stroke="${P.red}" stroke-width=".7"/>` +
      hair(34, 68, 31, 67, 28.6, 68.6, 0.5, P.goldD) + hair(34, 80, 31, 81.6, 29, 81, 0.5, P.goldD) + hair(70, 87, 73, 89.6, 76, 89, 0.5, P.goldD) + hair(50, 88, 49, 90.6, 46.6, 91.4, 0.5, P.goldD) +
      hair(38, 92, 42, 91, 45, 92.6, 0.5, P.goldD) + hair(78, 90.6, 81, 89.6, 84, 90.4, 0.45, P.goldD) +
      ear(56, 57, 50, 30, 1.2) + ear(60, 57, 66.4, 33, 1) +
      hair(36, 50, 32, 44, 36, 38, 0.8, P.greenD) + hair(40, 48, 44, 42, 40.4, 36, 0.6, P.greenD) + hair(80, 50, 84, 44, 80, 38, 0.8, P.greenD) + hair(85, 52, 88.6, 47, 86.6, 42, 0.55, P.greenD) +
      sparkle(88, 36, 2) +
      k.defs()
    )
  },

  // Tres: el rollo de heno coronado, con su cetro de trigo.
  'Rey del heno': (u) => {
    const k = kit(u)
    const back = 'M42.2 52.6L57.4 43.6A18 18 0 0 1 75.8 74.8L60.6 83.8Z'
    const face = ellipse(51.4, 68.2, 18, 18)
    let spiral = ''
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2 * 4.2, r = 1 + (i / 120) * 15.6
      spiral += (i ? 'L' : 'M') + f(51.4 + Math.cos(a) * r) + ' ' + f(68.2 + Math.sin(a) * r)
    }
    const crown = 'M-11 0L-12.6 -12.4L-6 -6.4L0 -15.6L6 -6.4L12.6 -12.4L11 0Z'
    const band = 'M-11.4 0H11.4V3.6H-11.4Z'
    const bodyStraw = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8, x = 46 + t * 26, y = 52 - t * 4 + (i % 3) * 7
      return hair(x, y + 8, x + 6, y + 4, x + 12, y + 1, 0.5, P.goldD)
    }).join('')
    return (
      k.day() +
      k.sun(60, 54, 18, 46, 28, false) +
      k.floor(62, 87, 28, 3.4) +
      k.draw([
        { d: back, fill: P.gold, inner: k.sh(back, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + bodyStraw + `<path d="M50 70L64 62M54 78L70 70" stroke="${P.red}" stroke-width=".9"/>` },
        { d: face, fill: P.goldL, inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.gold, 0.45) + `<path d="${spiral}" fill="none" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` + hair(40, 60, 44, 54, 50, 51.6, 0.7, P.white) },
      ], 0.85) +
      hair(36, 74, 33, 76, 31, 75, 0.5, P.goldD) + hair(40, 82, 37.4, 85, 35, 85, 0.5, P.goldD) + hair(70, 86, 73, 88.4, 76, 88, 0.5, P.goldD) +
      `<g transform="translate(64 47) rotate(14)">` +
      k.draw([
        { d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 1, P.goldD, 0.45) + `<path d="M-13 -16H-6V2H-13Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` },
        { d: band, fill: P.goldD, inner: [-7, 0, 7].map((x) => `<circle cx="${x}" cy="1.8" r="1" fill="${x ? P.sky : P.red}" stroke="${P.ink}" stroke-width=".3"/>`).join('') },
      ], 0.7) +
      [[-12.6, -12.4], [0, -15.6], [12.6, -12.4]].map(([x, y]) => `<circle cx="${x}" cy="${y - 1}" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      `<circle cx="0" cy="-6.6" r="1.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      ear(84, 94, 86, 44, 1.25) +
      `<path d="M82.4 82.4L88 81.2" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M82.4 82.4L88 81.2" stroke="${P.red}" stroke-width="1.3" stroke-linecap="round"/>` +
      sparkle(34, 40, 2.2) + sparkle(90, 32, 1.6) +
      k.defs()
    )
  },

  // Siete: el granero del mundo. Una gavilla gigante de trigo, atada con cinta celeste y blanca, plantada en el planeta.
  'Granero del mundo': (u) => {
    const k = kit(u)
    const globe = ellipse(60, 85, 16, 16)
    const land = 'M54 71.4C57 70.6 60 72 61.6 74.6C63.4 77.4 66 78 66.6 81C67.2 84 64 86.6 62.4 89.6C61 92.4 60.2 96 58.4 98.4C57.2 96 57.4 92.4 56.2 89.4C55 86.6 52.4 84.4 52.6 80.6C52.8 77.4 51.6 73.4 54 71.4Z'
    const land2 = 'M70 74C73 74.6 75.4 77.4 75.6 80.4C73.6 80 71.4 78.4 70 76Z'
    const stalks = Array.from({ length: 11 }, (_, i) => {
      const t = i / 10 - 0.5
      return { a: t * 1.5, bx: 60 + t * 9 }
    })
    const ears = stalks.map(({ a }, i) => {
      const x0 = 60 + Math.sin(a) * 6, y0 = 58, len = 26 + (1 - Math.abs(a)) * 6 - (i % 2) * 3
      return ear(x0, y0, x0 + Math.sin(a) * len, y0 - Math.cos(a) * len, 1.05)
    }).join('')
    const butts = stalks.map(({ bx }) => `<path d="M60 60L${f(bx)} 72.6" stroke="${P.goldD}" stroke-width="1.3"/>`).join('') +
      `<path d="M55.6 72.4H64.4" stroke="${P.ink}" stroke-width=".5"/>`
    const bow = 'M60 61C55 56.6 50.4 57.6 50.8 60.6C51.2 63.4 55.6 63.6 60 61ZM60 61C65 56.6 69.6 57.6 69.2 60.6C68.8 63.4 64.4 63.6 60 61Z'
    const tails = 'M59 61.4L53.6 70.4L55.8 69.8L56.4 72.2L60 62ZM61 61.4L66.4 70.4L64.2 69.8L63.6 72.2L60 62Z'
    return (
      k.day() +
      k.sun(60, 50, 17, 47) +
      k.cast([globe], 2.2, 2.2) +
      k.draw([{
        d: globe, fill: P.sky,
        inner:
          `<path d="${land}${land2}" fill="${P.green}" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M44 85H76M46 77Q60 79 74 77M46 93Q60 91 74 93M60 69V101M52 70Q46 85 52 100M68 70Q74 85 68 100" fill="none" stroke="${P.white}" stroke-width=".4" opacity=".7"/>` +
          k.sh(globe, 0, 0, 1, 1, 0, 0.85, P.mid, 0.45) + `<ellipse cx="53" cy="76" rx="4" ry="2.4" fill="#fff" opacity=".6" transform="rotate(-35 53 76)"/>`,
      }], 0.75) +
      `<g transform="translate(0 -1)">` +
      butts + ears +
      k.draw([
        { d: tails, fill: P.sky, inner: `<path d="M50 64H70V68H50Z" fill="${P.white}"/>` },
        { d: bow, fill: P.sky, inner: `<path d="M48 60H72V61.6H48Z" fill="${P.white}"/>` + k.sh(bow, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
      ], 0.45) +
      `<circle cx="60" cy="61" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(88, 76, 2) + sparkle(30, 76, 1.6) +
      k.defs()
    )
  },

  // ── Albañil ────────────────────────────────────────────────────────

  // Cinco ciudades: la primera casa del loteo, con los lotes marcados con estacas e hilo y el cartel clavado.
  'Loteo': (u) => {
    const k = kit(u)
    const field = 'M14 74H106V112H14Z'
    const stake = (x: number, y: number, h: number) => `<path d="M${x} ${y}V${f(y - h)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${x} ${y}V${f(y - h)}" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/><path d="M${f(x - 0.6)} ${f(y - h)}h1.2v1.2h-1.2Z" fill="${P.red}"/>`
    const board = roundRect(66, 36, 92, 51, 1.2)
    return (
      k.day() +
      k.stage(60, 60, 34) +
      `<path d="${field}" fill="${P.green}"/>` + k.shade(field, k.lin(P.greenD, 0, 0, 0, 1, 0, 0.8), P.greenD, 0.4) +
      `<path d="M14 74.4H106" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M30 76L22 96M46 76L42 96M76 76L80 96M92 76L100 96M14 82H106M14 90H106" fill="none" stroke="${P.white}" stroke-width=".45" stroke-dasharray="1.6 1"/>` +
      stake(30, 77, 4) + stake(46, 77, 4) + stake(76, 77, 4) + stake(92, 77, 4) + stake(26, 85, 5) + stake(44, 85, 5) + stake(78, 85, 5) + stake(96, 85, 5) +
      k.floor(57, 86.6, 22, 2.8, P.greenD) +
      cityPiece(k, 55, 86.4, 2.15, P.red, P.wine, `<path d="M-6.6 -9.6H-4.6V-7.4H-6.6ZM-3.4 -9.6H-1.4V-7.4H-3.4ZM2 -4.4H5.6V0H2Z" fill="${P.wine}" stroke="${P.ink}" stroke-width=".18"/>`) +
      `<path d="M71 50V84M87 50V84" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M71 50V84M87 50V84" stroke="${P.brown}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<g transform="rotate(4 79 44)">` +
      k.draw([{ d: board, fill: P.white, inner: k.sh(board, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) + `<path d="M66 36H92V39.4H66Z" fill="${P.red}"/>` }], 0.55) +
      `<text x="79" y="47.6" ${GEORGIA} font-style="italic" font-size="6" fill="${P.ink}" text-anchor="middle">Loteo</text>` +
      `</g>` +
      sparkle(32, 42, 2.2) + sparkle(88, 64, 1.4) +
      k.defs()
    )
  },

  // Quince: el country, con su garita en la entrada, la reja y las ciudades del otro lado.
  'Country con seguridad': (u) => {
    const k = kit(u)
    const booth = 'M29 52H51V92H29Z'
    const roof = 'M25 52L40 43L55 52Z'
    const win = 'M32 56.6H48V69H32Z'
    const wall = 'M51 82H100V92H51Z'
    const bars = Array.from({ length: 9 }, (_, i) => {
      const x = 56 + i * 5
      return `<path d="M${x} 82V60" stroke="${P.ink}" stroke-width="1.7"/><path d="M${x} 82V60" stroke="${P.white}" stroke-width=".7"/><path d="M${x - 1.3} 60.4L${x} 57L${x + 1.3} 60.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }).join('')
    const cam = 'M0 -2H8L9.6 -1V2H0Z'
    return (
      k.day() +
      k.stage(62, 60, 34) +
      k.floor(64, 92.4, 36, 2.8) +
      cityPiece(k, 66, 76, 1.25, P.mid, P.night) + cityPiece(k, 86, 74, 1.1, ORANGE, ORANGE_D) + cityPiece(k, 76, 80, 1.3, P.white, P.sky2) +
      `<path d="M52 64H100M52 75H100" stroke="${P.ink}" stroke-width="1.4"/><path d="M52 64H100M52 75H100" stroke="${P.white}" stroke-width=".6"/>` + bars +
      k.draw([{ d: wall, fill: P.white, inner: k.sh(wall, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + Array.from({ length: 6 }, (_, i) => `<path d="M${56 + i * 9} 82V92M${51 + i * 9} 87H${60 + i * 9}" stroke="${P.sky2}" stroke-width=".4"/>`).join('') }], 0.6) +
      k.draw([
        { d: booth, fill: P.white, line: 0.4, inner: k.sh('M42 50H53V94H42Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.4) + `<path d="M28 80H52V93H28Z" fill="${P.sky}"/><path d="M28 80H52" stroke="${P.ink}" stroke-width=".4"/>` + k.sh('M28 80H52V93H28Z', 0, 0, 1, 1, 0, 0.8, P.mid, 0.4) },
        { d: roof, fill: P.red, inner: k.sh(roof, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + hair(30, 50.4, 35, 47.4, 40, 44.4, 0.5, P.wine) + hair(36, 51.4, 42, 48, 47, 46, 0.5, P.wine) },
      ], 0.75) +
      `<path d="${win}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` + k.sh(win, 0, 0, 1, 1, 0.1, 0.8, P.blue, 0.4) +
      hair(33.6, 67, 37, 62, 41, 57.6, 0.9, P.white) + `<path d="M40 56.6V69" stroke="${P.ink}" stroke-width=".5"/>` +
      `<path d="M30.4 70.6H49.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="${roundRect(31.6, 73, 48.4, 77.6, 0.6)}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="40" y="76.6" ${GEORGIA} font-weight="700" font-size="2.9" letter-spacing=".2" fill="${P.white}" text-anchor="middle">SEGURIDAD</text>` +
      `<path d="M37.6 43.6V41H42.4V43.6Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><path d="M37.6 41C37.6 37.6 42.4 37.6 42.4 41Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      hair(36, 39, 33, 37.6, 30.6, 37.6, 0.55, P.goldD) + hair(44, 39, 47, 37.6, 49.4, 37.6, 0.55, P.goldD) + hair(40, 36.4, 40, 34, 40, 32, 0.55, P.goldD) +
      `<path d="M51 55H54" stroke="${P.ink}" stroke-width="1.2"/>` +
      `<g transform="translate(53.6 55) rotate(18)">` + k.draw([{ d: cam, fill: P.white, inner: k.sh(cam, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }], 0.45) + `<circle cx="9.6" cy=".4" r=".7" fill="${P.red}"/></g>` +
      sparkle(86, 36, 2.2) + sparkle(30, 34, 1.4) +
      k.defs()
    )
  },

  // Cuarenta: Puerto Madero. Las ciudades del Catán crecieron hasta ser torres espejadas sobre el dique.
  'Puerto Madero': (u) => {
    const k = kit(u)
    const glass = (d: string, x0: number, x1: number, y0: number, y1: number, light: boolean) =>
      ({
        d, fill: light ? P.sky1 : P.sky, line: 0.4,
        inner:
          k.sh(d, 0, 0, 1, 1, 0, 0.8, light ? P.sky2 : P.mid, 0.4) +
          Array.from({ length: Math.ceil((y1 - y0) / 3.2) }, (_, i) => `<path d="M${x0} ${f(y0 + i * 3.2)}H${x1}" stroke="${P.white}" stroke-width=".35" opacity=".8"/>`).join('') +
          Array.from({ length: Math.ceil((x1 - x0) / 3.4) }, (_, i) => `<path d="M${f(x0 + i * 3.4)} ${y0}V${y1}" stroke="${P.mid}" stroke-width=".25" opacity=".5"/>`).join('') +
          `<path d="M${x0} ${f(y1 - 10)}L${x1} ${f(y1 - 30)}V${f(y1 - 22)}L${x0} ${f(y1 - 2)}Z" fill="#fff" opacity=".35"/>`,
      })
    const left = 'M28 92V36H42V92Z'
    const right = 'M78 92V44H92V92Z'
    const front = 'M42 92V36L52 23L62 36V60H78V92Z'
    const towerWall = 'M62 60V36L67 33V57Z'
    const towerRoof = 'M52 23L57 20L67 33L62 36Z'
    const lowTop = 'M62 60H78L83 57H67Z'
    const water = 'M0 92H120V130H0Z'
    const reflect = Array.from({ length: 9 }, (_, i) => hair(30 + i * 7.4, 96 + (i % 3) * 2.6, 32 + i * 7.4, 95.6 + (i % 3) * 2.6, 35 + i * 7.4, 96 + (i % 3) * 2.6, 0.6, i % 2 ? P.goldL : P.sky1)).join('')
    return (
      k.day() +
      k.sun(56, 52, 20, 48, 32, false) +
      `<path d="M23 92V64L32 56H37V62L28 68V92" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="M23 92V64L32 56H37V62L28 68V92" fill="none" stroke="${P.red}" stroke-width="1.2" stroke-linejoin="round"/>` +
      k.draw([glass(left, 28, 42, 36, 92, true), glass(right, 78, 92, 44, 92, true)], 0.6) +
      `<path d="M33 36V30H37V36M35 30V24" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      k.draw([
        { d: towerWall, fill: P.mid, line: 0.35, inner: k.sh(towerWall, 0, 0, 1, 0, 0, 0.7, P.night, 0.4) },
        { d: towerRoof, fill: P.gold, line: 0.35, inner: k.sh(towerRoof, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) },
        { d: lowTop, fill: P.sky2, line: 0.35 },
        glass(front, 42, 78, 23, 92, false),
      ], 0.8) +
      `<path d="M42 36L52 23L62 36" fill="none" stroke="${P.gold}" stroke-width="1.6"/><path d="M42 36L52 23L62 36" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="${water}" fill="${P.mid}"/>` + k.shade(water, k.lin(P.night, 0, 0, 0, 1, 0, 0.9), P.night, 0.4) + `<path d="M0 92H120" stroke="${P.ink}" stroke-width=".9"/>` + reflect +
      `<path d="M92 96L104 60" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M92 96L104 60" stroke="${P.white}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<path d="M100 72L84 92M98 78L88 92M102 66L80 92" stroke="${P.white}" stroke-width=".4"/>` +
      sparkle(34, 30, 2) + sparkle(88, 34, 1.6) +
      k.defs()
    )
  },
}
