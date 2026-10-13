// Ta-te-ti, en clave heroica. El rosa de la ficha del juego es el color propio (la línea ganadora, el margen del
// cuaderno, la goma, la topadora) y el fondo es una hoja de cuaderno cuadriculado con su margen rosa.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Rosa de la ficha del juego, con su sombra, su luz y un rosa pálido. */
const TT = '#E64980', TT_D = '#A3245A', TT_L = '#F28DB4', TT_XL = '#FBD5E4'
/** Verde de pizarrón y el blanco de la tiza. */
const BOARD = '#2F5446', BOARD_D = '#1C3A30', CHALK = '#F3F1EA'
/** Grafito del lápiz y madera clara del pupitre. */
const LEAD = '#5B6070', WOOD = '#C99A62', WOOD_D = '#8A5E33', WOOD_L = '#E6C190'
const FULL = 'M0 0H120V130H0Z'

/** Hoja de cuaderno cuadriculado: papel, cuadrícula celeste, margen rosa doble y el borde granulado en rosa. */
function notebook(k: Kit, margin = 31) {
  let grid = ''
  for (let x = 2; x < 120; x += 5) grid += `M${x} 0V130`
  for (let y = 3; y < 130; y += 5) grid += `M0 ${y}H120`
  return (
    `<rect width="120" height="130" fill="${P.white}"/>` +
    `<path d="${grid}" stroke="${P.sky}" stroke-width=".35" opacity=".55"/>` +
    `<path d="M${margin} 0V130M${margin + 1.6} 0V130" stroke="${TT}" stroke-width=".55" opacity=".75"/>` +
    k.shade(FULL, k.rad('#F0B2CB', 0.5, 0.46, 0.7, 0, 1), '#E293B3', 0.45)
  )
}

/** Papel liso con el borde granulado en rosa. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F0B2CB', 0.5, 0.46, 0.7, 0, 1), '#E293B3', 0.45)

/** Cruz hecha a mano: dos trazos que se afinan, centrada en (x,y), de medio lado s. */
const cross = (x: number, y: number, s: number, c: string, w = 1.1) =>
  hair(x - s, y - s, x - s * 0.1, y + s * 0.05, x + s, y + s, w, c) + hair(x + s * 0.9, y - s, x + s * 0.1, y - s * 0.1, x - s, y + s * 1.05, w, c)

/** Círculo hecho a mano, con el arranque superpuesto como cuando se dibuja de un trazo. */
const ring = (x: number, y: number, r: number, c: string, w = 0.9) =>
  `<path d="M${f(x + r * 0.3)} ${f(y - r * 1.02)}C${f(x - r * 0.9)} ${f(y - r * 1.1)} ${f(x - r * 1.2)} ${f(y + r * 0.2)} ${f(x - r * 0.6)} ${f(y + r * 0.85)}C${f(x)} ${f(y + r * 1.3)} ${f(x + r * 1.15)} ${f(y + r * 0.8)} ${f(x + r * 1.05)} ${f(y - r * 0.1)}C${f(x + r)} ${f(y - r * 0.8)} ${f(x + r * 0.4)} ${f(y - r * 1.1)} ${f(x - r * 0.2)} ${f(y - r * 0.9)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`

/** Grilla de ta-te-ti a mano: dos verticales y dos horizontales, apenas torcidas. Celda de lado c, centro (x,y). */
const grid = (x: number, y: number, c: number, col: string, w = 0.9) => {
  const h = c * 1.5
  return hair(x - c / 2, y - h, x - c / 2 - 0.6, y, x - c / 2 + 0.4, y + h, w, col) + hair(x + c / 2, y - h + 0.4, x + c / 2 + 0.6, y, x + c / 2 - 0.2, y + h - 0.2, w, col) +
    hair(x - h, y - c / 2, x, y - c / 2 + 0.6, x + h, y - c / 2 - 0.3, w, col) + hair(x - h + 0.3, y + c / 2, x, y + c / 2 - 0.5, x + h, y + c / 2 + 0.3, w, col)
}


/** Cruz maciza, como una letra recortada (para la pila que empuja la topadora). */
const X_SOLID = 'M-4 -5.2L0 -1.4L4 -5.2L5.4 -3.8L1.4 0L5.4 3.8L4 5.2L0 1.4L-4 5.2L-5.4 3.8L-1.4 0L-5.4 -3.8Z'

/** Birome: caña hexagonal transparente con el tubito de tinta azul, tapón azul y punta de metal; la punta en (−22,0). */
function birome(k: Kit) {
  const barrel = 'M-15.6 -2.2H15.6V2.2H-15.6Z'
  const cone = 'M-15.6 -2.2L-21 -.7V.7L-15.6 2.2Z'
  const plug = roundRect(15.4, -2.4, 19.6, 2.4, 1)
  return (
    k.draw([
      { d: cone, fill: P.white, inner: k.sh(cone, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M-17 -1.8V1.8M-18.6 -1.4V1.4" stroke="${P.sky}" stroke-width=".3"/>` },
      { d: barrel, fill: P.sky1, inner: `<path d="M-15.6 -.4H15.6V.4H-15.6Z" fill="${P.mid}"/>` + `<path d="M-15.6 -2.2H15.6V-1.2H-15.6Z" fill="#fff" opacity=".8"/>` + k.sh(barrel, 0, 0, 0, 1, 0.2, 0.7, P.blue, 0.35) + `<path d="M-15.6 -.9H15.6M-15.6 1.2H15.6" stroke="${P.sky}" stroke-width=".3"/>` + `<circle cx="9" cy="-1.4" r=".5" fill="${P.white}" stroke="${P.sky}" stroke-width=".2"/>` },
      { d: plug, fill: P.mid, inner: k.sh(plug, 0, 0, 0, 1, 0, 0.8, P.night, 0.4) },
    ], 0.45) +
    `<path d="M-21 -.6L-22.6 0L-21 .6Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".3"/>`
  )
}

/** Compás escolar cerrado en ángulo: cabeza moleteada arriba en (0,0), una pata con la púa y otra con la mina. */
function compass(k: Kit) {
  const legA = 'M-1.2 1L-7.6 25.6L-6.4 26L1 1.6Z'
  const legB = 'M1.2 1L9.6 22.4L8 23L-1 1.6Z'
  const pencil = 'M7.6 20.6L10.6 19.4L14 28L12.4 29.4Z'
  const head = roundRect(-2.4, -6.4, 2.4, 1.6, 1)
  return (
    k.draw([
      { d: legA, fill: P.sky1, inner: k.sh(legA, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) },
      { d: legB, fill: P.sky1, inner: k.sh(legB, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) },
      { d: pencil, fill: TT, inner: k.sh(pencil, 0, 0, 1, 0, 0, 0.8, TT_D, 0.45) + `<path d="M12.4 27.6L13.4 29.6L14.4 27.8Z" fill="${LEAD}"/>` },
      { d: head, fill: P.gold, inner: k.sh(head, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + [-4.8, -3.4, -2, -.6].map((y) => `<path d="M-2.4 ${y}H2.4" stroke="${P.goldD}" stroke-width=".4"/>`).join('') },
    ], 0.5) +
    `<path d="M-7.2 25.8L-7.8 29" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
    `<circle cx="0" cy="1.6" r="1.2" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>`
  )
}

/** Topadora rosa de perfil, mirando a la izquierda, con la pala ancha vista de tres cuartos; el piso en y=0. */
function bulldozer(k: Kit) {
  const belt = roundRect(-14, -12.2, 24, 0, 6)
  const shoes = Array.from({ length: 15 }, (_, i) => { const x = -10.6 + i * 2.4; return `M${f(x)} -.4H${f(x + 1.8)}V1.4H${f(x)}Z` }).join('') +
    Array.from({ length: 13 }, (_, i) => { const x = -8.4 + i * 2.4; return `M${f(x)} -13.4H${f(x + 1.7)}V-12H${f(x)}Z` }).join('')
  const fender = 'M-14.6 -12.4H24.6V-14.2H-14.6Z'
  const hood = 'M-12.4 -14.2V-21.4C-12.4 -22.8 -11.4 -23.6 -10 -23.6H7.6V-14.2Z'
  const cab = 'M7.6 -14.2V-31.6H22C23.2 -31.6 24 -30.8 24 -29.6V-14.2Z'
  const winF = 'M9.6 -29.6H15V-21.6H9.6Z', winS = 'M16.6 -29.6H22.2V-21.6H16.6Z'
  const ropsPost = (x: number) => `M${f(x - 0.9)} -14.2V-36.6H${f(x + 0.9)}V-14.2Z`
  const ropsTop = 'M5.4 -38.2H26.2V-35.6H5.4Z'
  const pipe = 'M-3.4 -23.4V-31.4L-1.8 -32.6V-23.4Z'
  const blade = 'M-36.4 -26.6C-31 -27.6 -26.8 -27.6 -23.4 -26.8L-21.6 1.6C-26 2.4 -32 2.6 -37.2 2.4C-40.2 -6 -40 -17 -36.4 -26.6Z'
  const edge = 'M-37.4 -.6C-32 -.2 -26 -.4 -21.8 -1L-21.6 1.6C-26 2.4 -32 2.6 -37.2 2.4Z'
  const arm = 'M-22.6 -6.4L-8 -8V-4.4L-22.4 -2.6Z'
  const ripper = 'M24 -7.4L28.6 -6L27.6 1.6L26 1.8L25.8 -3.4L23.8 -4.6Z'
  const sprocket = starPath(18.6, -6.4, 5.4, 4.2, 10)
  const wheel = (x: number, r: number) => k.draw([{ d: ellipse(x, -6.2, r, r), fill: P.sky2, inner: k.sh(ellipse(x, -6.2, r, r), 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) }], 0.35) + `<circle cx="${x}" cy="-6.2" r="${f(r * 0.32)}" fill="${P.ink}"/>`
  return (
    k.draw([{ d: ripper, fill: P.sky2, inner: k.sh(ripper, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) }], 0.45) +
    k.draw([{ d: belt, fill: P.night, inner: k.sh(belt, 0, 0, 0, 1, 0, 0.6, '#000', 0.3) + `<path d="M-8 -6.2H18" stroke="${P.mid}" stroke-width="5.6" opacity=".5"/>` }], 0.7) +
    `<path d="${shoes}" fill="${P.mid}" stroke="${P.ink}" stroke-width=".35"/>` +
    k.draw([{ d: sprocket, fill: P.sky2, inner: k.sh(sprocket, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) }], 0.4) + `<circle cx="18.6" cy="-6.4" r="2" fill="${TT}" stroke="${P.ink}" stroke-width=".4"/>` +
    wheel(-8.6, 4.6) + wheel(-1.6, 2.1) + wheel(3.2, 2.1) + wheel(8, 2.1) + wheel(12.6, 2.1) +
    k.draw([
      { d: arm, fill: TT_D, inner: `<path d="M-22.4 -5.4L-8 -7" stroke="${TT}" stroke-width=".6"/>` },
      { d: fender, fill: TT, inner: k.sh(fender, 0, 0, 0, 1, 0, 0.8, TT_D, 0.45) },
      { d: hood, fill: TT, inner: k.sh(hood, 0, 0, 1, 1, 0, 0.8, TT_D, 0.45) + `<path d="M-13 -25H8V-21C2 -22 -6 -22 -13 -20Z" fill="${k.lin(TT_XL, 0, 0, 0, 1, 0.6, 0)}"/>` + `<path d="M-11.2 -21.4V-15.4M-9.6 -21.4V-15.4M-8 -21.4V-15.4" stroke="${TT_D}" stroke-width=".7"/>` + `<path d="M-4 -20H5M-4 -18.2H5M-4 -16.4H5" stroke="${TT_D}" stroke-width=".45"/>` },
      { d: cab, fill: TT, inner: k.sh(cab, 0, 0, 1, 0, 0, 0.8, TT_D, 0.45) + `<path d="${winF}${winS}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/>` + k.sh(winF + winS, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + `<path d="M10.6 -22.6L14 -28.6M18 -22.6L21.4 -28.6" stroke="#fff" stroke-width=".6"/>` },
    ], 0.7) +
    k.draw([{ d: ropsPost(7), fill: P.night }, { d: ropsPost(24.6), fill: P.night }, { d: ropsTop, fill: P.night, inner: `<path d="M6 -37.6H25.6" stroke="${P.mid}" stroke-width=".6"/>` }], 0.45) +
    [[7, -35.6], [24.6, -35.6], [7, -15], [24.6, -15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>`).join('') +
    k.draw([{ d: pipe, fill: P.sky2, inner: `<path d="M-3.4 -31H-2.6V-23.4H-3.4Z" fill="#fff" opacity=".7"/>` }], 0.35) +
    hair(-2.4, -33.4, -4, -36, -2, -39, 0.5, P.sky2) +
    `<path d="M-11.6 -21.4L-23.6 -18.4" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M-11.6 -21.4L-23.6 -18.4" stroke="${TT_D}" stroke-width="1.4" stroke-linecap="round"/><path d="M-16.6 -20.2L-23.6 -18.4" stroke="${P.sky1}" stroke-width=".9" stroke-linecap="round"/>` +
    k.draw([
      {
        d: blade, fill: TT,
        inner: `<path d="${blade}" fill="${k.lin(TT_D, 0, 0, 0, 1, 0, 0.9)}" opacity=".7"/>` + k.sh(blade, 0, 0, 1, 0, 0, 0.6, TT_D, 0.4) +
          `<path d="M-38 -24H-22V-22H-38Z" fill="${TT_XL}" opacity=".7"/>` +
          hair(-38, -18, -30, -19.6, -22.4, -18.4, 0.5, TT_D) + hair(-38.6, -11, -30, -12.4, -22.2, -11.4, 0.5, TT_D) + hair(-38.4, -4.6, -30, -5.6, -22, -5, 0.45, TT_D) +
          hair(-35.6, -25, -36.8, -14, -36, -2, 0.7, TT_XL, 0.8),
      },
      { d: edge, fill: P.sky1, inner: k.sh(edge, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + [-35, -31, -27, -23.6].map((x) => `<circle cx="${x}" cy=".8" r=".45" fill="${P.ink}"/>`).join('') },
    ], 0.75)
  )
}

/** Aplanadora (rodillo compactador) de tres cuartos, mirando a la izquierda: el rodillo grande adelante con su
 * horquilla, la cabina chica abierta con techito y el rodillo de atrás; el piso en y=0. */
function roller(k: Kit) {
  const drum = (nx: number, ny: number, rx: number, ry: number, fx: number, fy: number) =>
    `M${nx} ${f(ny - ry)}L${fx} ${f(fy - ry)}A${rx} ${ry} 0 0 1 ${fx} ${f(fy + ry)}L${nx} ${f(ny + ry)}Z`
  const front = drum(-24, -14, 5.6, 14, 4, -17.4), frontFace = ellipse(-24, -14, 5.6, 14)
  const rear = drum(22, -9.6, 4, 9.6, 40, -11.8), rearFace = ellipse(22, -9.6, 4, 9.6)
  const body = 'M5 -21.4L4.4 -33C4.4 -35 5.6 -36 7.6 -36H37.4C39.2 -36 40.4 -35 40.4 -33.2V-23L38.6 -21.4Z'
  const beam = 'M-29.4 -32.4L6 -36.4V-31.6L-28.8 -27.8Z'
  const yoke = 'M-29.4 -31.4L-20.4 -32.2L-20.6 -14.6A3.4 3.4 0 0 1 -27.4 -14.6Z'
  const roof = 'M8 -53.6H35.4L34 -50.6H9.4Z'
  const post = (x: number, y0: number) => `M${f(x - 0.6)} ${y0}V-51H${f(x + 0.6)}V${y0}Z`
  const seat = 'M24 -36V-44.4C24 -45.6 25 -46.4 26.2 -46.4H27.4C28.6 -46.4 29.4 -45.6 29.4 -44.4V-40.6H31.6V-36Z'
  const steel = (d: string, light: string) => k.sh(d, 0, 0, 0, 1, 0.1, 0.9, P.blue, 0.5) + `<path d="${d}" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.6, 0)}" opacity=".5"/>` + light
  const bolts = (cx: number, cy: number, rx: number, ry: number, n: number) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * rx)}" cy="${f(cy + Math.sin(a) * ry)}" r=".45" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".2"/>` }).join('')
  const louvers = [26, 28.4, 30.8, 33.2, 35.6].map((x) => `M${x} -33V-25`).join('')
  return (
    k.draw([{ d: rear, fill: P.sky1, inner: steel(rear, `<path d="M22 -16.4L40 -18.6" stroke="#fff" stroke-width=".9" opacity=".8"/>`) }], 0.6) +
    k.draw([{ d: rearFace, fill: P.sky2, inner: k.sh(rearFace, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<ellipse cx="22" cy="-9.6" rx="2.6" ry="6.6" fill="none" stroke="${P.blue}" stroke-width=".45"/>` }], 0.5) +
    `<ellipse cx="22" cy="-9.6" rx="1.2" ry="2.6" fill="${TT}" stroke="${P.ink}" stroke-width=".35"/>` +
    k.draw([{
      d: body, fill: TT,
      inner: k.sh(body, 0, 0, 1, 1, 0, 0.85, TT_D, 0.45) + `<path d="M4 -37H40V-33C30 -34 16 -34 4 -32Z" fill="${k.lin(TT_XL, 0, 0, 0, 1, 0.6, 0)}"/>` +
        `<path d="${louvers}" stroke="${TT_D}" stroke-width=".7"/>` + `<path d="M6 -24.6H39" stroke="${TT_D}" stroke-width=".5"/>` + `<path d="M8 -30H20V-25.6H8Z" fill="${P.night}" opacity=".25"/>`,
    }], 0.7) +
    k.draw([{ d: seat, fill: P.night, inner: `<path d="M25 -45.2V-40" stroke="${P.mid}" stroke-width=".6"/>` }], 0.4) +
    `<path d="M14.6 -36L13.6 -41.6" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="13.4" cy="-42" rx="2.8" ry="1" fill="none" stroke="${P.ink}" stroke-width="1.1"/><ellipse cx="13.4" cy="-42" rx="2.8" ry="1" fill="none" stroke="${P.sky}" stroke-width=".4"/>` +
    k.draw([{ d: post(10, -36), fill: P.night }, { d: post(33.4, -36), fill: P.night }, { d: post(30.6, -36.6), fill: P.night }, { d: post(12.6, -36.6), fill: P.night }], 0.35) +
    k.draw([{ d: roof, fill: TT_D, inner: `<path d="M9 -53H35" stroke="${TT}" stroke-width=".7"/>` }], 0.55) +
    `<path d="M21.2 -53.6V-55.6C21.2 -57.4 24.6 -57.4 24.6 -55.6V-53.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M22.2 -55.4C22.4 -56.2 23 -56.6 23.6 -56.6" fill="none" stroke="#fff" stroke-width=".4"/>` +
    k.draw([{ d: beam, fill: TT, inner: k.sh(beam, 0, 0, 0, 1, 0, 0.85, TT_D, 0.5) + `<path d="M-29 -31.6L6 -35.6" stroke="${TT_XL}" stroke-width=".6"/>` }], 0.6) +
    `<path d="M6 -33.6L9 -34" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="7.4" cy="-33.8" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
    k.draw([{ d: front, fill: P.sky1, inner: steel(front, `<path d="M-24 -23.6L4 -27" stroke="#fff" stroke-width="1.4" opacity=".85"/><path d="M-24 -20.6L4 -24" stroke="#fff" stroke-width=".5" opacity=".7"/>`) + hair(-20, -5, -8, -6, 2, -7.6, 0.5, P.mid) }], 0.75) +
    k.draw([{ d: frontFace, fill: P.sky2, inner: k.sh(frontFace, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<ellipse cx="-24" cy="-14" rx="4.2" ry="10.6" fill="none" stroke="${P.blue}" stroke-width=".5"/>` }], 0.6) +
    bolts(-24, -14, 4.9, 12.2, 16) +
    k.draw([{ d: yoke, fill: TT, inner: k.sh(yoke, 0, 0, 1, 0, 0, 0.85, TT_D, 0.45) + `<path d="M-28.4 -30.6L-27 -16" stroke="${TT_XL}" stroke-width=".6"/>` }], 0.6) +
    `<circle cx="-24" cy="-14.4" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="-24.6" cy="-15" r=".55" fill="#fff"/>` +
    `<path d="M-30 -3.6L-27.4 -1.4" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>`
  )
}

export const TATETI_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Tres en línea ─────────────────────────────────────────────────

  // Cinco partidas: dibujadas con birome en la servilleta, sobre la mesa de mármol del bar.
  'Servilleta de bar': (u) => {
    const k = kit(u)
    const table = ellipse(60, 60, 37, 37)
    const zig = (x0: number, y0: number, x1: number, y1: number, n: number) => {
      let d = ''
      for (let i = 1; i <= n; i++) {
        const t = i / n, tm = (i - 0.5) / n, nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny)
        d += `L${f(x0 + (x1 - x0) * tm - (nx / l) * 0.8)} ${f(y0 + (y1 - y0) * tm - (ny / l) * 0.8)}L${f(x0 + (x1 - x0) * t)} ${f(y0 + (y1 - y0) * t)}`
      }
      return d
    }
    const nap = `M-23 -23${zig(-23, -23, 23, -23, 18)}${zig(23, -23, 23, 23, 18)}${zig(23, 23, -23, 23, 18)}${zig(-23, 23, -23, -23, 18)}Z`
    const veins = hair(26, 40, 40, 46, 52, 44, 0.5, P.sky2) + hair(70, 88, 82, 80, 96, 82, 0.5, P.sky2) + hair(30, 76, 36, 70, 44, 72, 0.4, P.sky2) + hair(84, 30, 90, 40, 94, 44, 0.45, P.sky2) + hair(52, 44, 60, 40, 64, 34, 0.35, P.sky2)
    const C = 9
    return (
      field(k) +
      k.floor(61, 64, 38, 38, P.mid) +
      k.draw([{ d: table, fill: P.white, inner: k.sh(table, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + veins + `<path d="M30 40C34 32 42 26 50 24" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` }], 0.6) +
      `<circle cx="60" cy="60" r="36" fill="none" stroke="${P.gold}" stroke-width="1.6"/><circle cx="60" cy="60" r="36" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 1.3" stroke-linecap="round"/>` +
      `<circle cx="84" cy="36" r="7.6" fill="none" stroke="${P.brown}" stroke-width="1.4" opacity=".35"/><circle cx="84.6" cy="36.4" r="6.8" fill="none" stroke="${P.brownD}" stroke-width=".4" opacity=".35"/>` +
      `<g transform="translate(57 59) rotate(-7)">` +
      k.cast([nap], 1.6, 1.8, P.mid) +
      k.draw([{ d: nap, fill: P.white, inner: k.sh(nap, 0, 0, 1, 1, 0, 0.45, P.sky2, 0.35) + `<path d="M-23 23L23 -23" stroke="${P.sky1}" stroke-width=".6"/>` }], 0.45) +
      `<path d="${roundRect(-19.6, -19.6, 19.6, 19.6, 1.4)}" fill="none" stroke="${P.sky2}" stroke-width=".5" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      `<path d="${roundRect(-18, -18, 18, 18, 1)}" fill="none" stroke="${P.sky2}" stroke-width=".35"/>` +
      grid(0, 0, C, P.mid, 0.85) +
      cross(-C, -C, 2.8, P.mid, 1) + cross(0, 0, 2.8, P.mid, 1) + cross(C, C, 2.8, P.mid, 1) + ring(C, -C, 3, P.mid, 0.8) + ring(-C, C, 3, P.mid, 0.8) + ring(0, -C, 3, P.mid, 0.8) +
      hair(-C - 4.6, -C - 4.4, 0, 0.6, C + 4.8, C + 4.4, 1.6, TT) +
      `</g>` +
      `<g transform="translate(80 82) rotate(-36)">` + k.cast(['M-21 -2.2H19.6V2.2H-21Z'], 1.4, 1.6, P.mid) + birome(k) + `</g>` +
      sparkle(36, 34, 2) + sparkle(88, 64, 1.6) +
      k.defs()
    )
  },

  // Veinte victorias: dejaste cruces y círculos grabados en el banco, con el compás, y la línea ganadora en rosa.
  'Pupitre rayado': (u) => {
    const k = kit(u)
    const top = 'M16 46L104 42L106 84L14 88Z'
    const edge = 'M14 88L106 84V91L14 95Z'
    const grain = [[18, 52, 60, 49, 104, 49], [16, 60, 50, 58, 105, 56], [15, 70, 64, 66, 105, 66], [15, 80, 50, 79, 106, 76], [40, 47, 70, 46, 100, 45]]
      .map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.55, WOOD_D)).join('') +
      `<path d="M74 60C78 56 84 56 86 60C88 64 82 67 78 64" fill="none" stroke="${WOOD_D}" stroke-width=".45"/><path d="M75.6 60.4C78.4 58 82.4 58 83.6 60.6" fill="none" stroke="${WOOD_D}" stroke-width=".35"/>`
    const groove = 'M24 49.6L84 47.2'
    const carve = (d: string, w = 1.7) => `<path d="${d}" fill="none" stroke="#4D3118" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${WOOD_L}" stroke-width="${f(w * 0.4)}" stroke-linecap="round" transform="translate(.55 .6)"/>`
    const C = 11, cx = 54, cy = 67, sy = 0.68
    const P2 = (x: number, y: number) => `${f(cx + x)} ${f(cy + y * sy)}`
    const X = (x: number, y: number) => carve(`M${P2(x - 3, y - 3)}L${P2(x + 3, y + 3)}M${P2(x + 3, y - 3)}L${P2(x - 3, y + 3)}`)
    const O = (x: number, y: number) => carve(ellipse(cx + x, cy + y * sy, 3.2, 3.2 * sy))
    return (
      field(k) +
      k.floor(60, 94, 46, 4, P.mid) +
      k.draw([
        { d: edge, fill: WOOD_D, inner: k.sh(edge, 0, 0, 0, 1, 0, 0.6, '#4D3118', 0.4) + `<path d="M14 89L106 85" stroke="${WOOD}" stroke-width=".5"/>` },
        { d: top, fill: WOOD, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, WOOD_D, 0.4) + `<path d="M14 42H50V90H14Z" fill="${k.lin(WOOD_L, 0, 0, 1, 0, 0.6, 0)}"/>` + grain },
      ], 0.75) +
      `<path d="${groove}" stroke="${WOOD_D}" stroke-width="2.6" stroke-linecap="round"/><path d="${groove}" stroke="#5A3A1C" stroke-width="1.4" stroke-linecap="round"/><path d="M24 50.8L84 48.4" stroke="${WOOD_L}" stroke-width=".5"/>` +
      `<ellipse cx="94" cy="48.6" rx="5" ry="3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6"/><ellipse cx="94" cy="48.8" rx="3.6" ry="2" fill="#1A1430"/><path d="M91.2 48C92 47.2 93.4 46.8 94.6 46.9" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      carve(`M${P2(-C / 2, -C * 1.5)}L${P2(-C / 2, C * 1.5)}M${P2(C / 2, -C * 1.5)}L${P2(C / 2, C * 1.5)}M${P2(-C * 1.5, -C / 2)}L${P2(C * 1.5, -C / 2)}M${P2(-C * 1.5, C / 2)}L${P2(C * 1.5, C / 2)}`, 2) +
      X(-C, -C) + O(0, -C) + X(C, -C) + O(-C, 0) + X(0, 0) + O(C, 0) + X(-C, C) + O(0, C) +
      `<path d="M${P2(C + 3, -C - 3)}L${P2(-C - 3, C + 3)}" stroke="#4D3118" stroke-width="3.2" stroke-linecap="round"/><path d="M${P2(C + 3, -C - 3)}L${P2(-C - 3, C + 3)}" stroke="${TT}" stroke-width="2" stroke-linecap="round"/><path d="M${P2(C + 2.6, -C - 3.4)}L${P2(-C - 2.6, C + 2.6)}" stroke="${TT_XL}" stroke-width=".4" stroke-linecap="round"/>` +
      `<g transform="translate(83 58) rotate(-24)">` + k.cast(['M-1.2 1L-7.6 25.6L-6.4 26L1 1.6Z', 'M1.2 1L9.6 22.4L8 23L-1 1.6Z'], 1.4, 1.4, WOOD_D) + compass(k) + `</g>` +
      sparkle(32, 36, 1.8) + sparkle(90, 34, 1.6) +
      k.defs()
    )
  },

  // Sesenta partidas: la seño te deja jugar en el pizarrón grande. Tiza, línea rosa y la estrellita dorada.
  'Pizarrón de maestra': (u) => {
    const k = kit(u)
    const frame = roundRect(24, 30, 96, 82, 2.4)
    const board = roundRect(28.4, 34.4, 91.6, 77.6, 0.8)
    const ledge = 'M22 82.6H98L96 87.4H24Z'
    const C = 10.4, cx = 57, cy = 56
    const chalk = (d: string, c = CHALK, w = 1.1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity=".9"/><path d="${d}" fill="none" stroke="${BOARD}" stroke-width="${f(w * 0.5)}" stroke-dasharray=".4 1.1" stroke-linecap="round" opacity=".7"/>`
    const corner = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><path d="${starPath(x, y, 2, 0.8, 8)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/><circle cx="${x}" cy="${y}" r=".6" fill="${TT}"/>`
    const smudges = hair(32, 42, 40, 38, 48, 40, 2.4, '#ffffff', 0.08) + hair(70, 72, 78, 69, 88, 72, 2.6, '#ffffff', 0.08) + hair(32, 70, 36, 64, 34, 58, 2, '#ffffff', 0.07)
    const star = starPath(86, 36, 8.4, 3.8, 5, -80)
    return (
      field(k) +
      k.sun(60, 56, 16, 48, 32, false) +
      k.floor(60, 92, 36, 3, P.mid) +
      laurel(46, 101, 30, 96, 26, 82, 5) + laurel(74, 101, 90, 96, 94, 82, 5, true) +
      k.cast([frame], 2.4, 2.4) +
      k.draw([{ d: frame, fill: P.gold, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${roundRect(25.6, 31.6, 94.4, 80.4, 1.8)}" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` + `<path d="${roundRect(26.8, 32.8, 93.2, 79.2, 1.2)}" fill="none" stroke="${P.goldD}" stroke-width=".45" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` }], 0.8) +
      k.draw([{ d: board, fill: BOARD, inner: k.sh(board, 0, 0, 1, 1, 0, 0.7, BOARD_D, 0.45) + `<path d="M28 34H48V78H28Z" fill="${k.lin('#6E9484', 0, 0, 1, 0, 0.35, 0)}"/>` + smudges }], 0.5) +
      corner(26.2, 32.2) + corner(93.8, 32.2) + corner(26.2, 79.8) + corner(93.8, 79.8) +
      chalk(`M${cx - C / 2} ${cy - C * 1.5}L${cx - C / 2 - 0.4} ${cy + C * 1.5}M${cx + C / 2} ${cy - C * 1.5 + 0.4}L${cx + C / 2 + 0.3} ${cy + C * 1.5}M${cx - C * 1.5} ${cy - C / 2}L${cx + C * 1.5} ${cy - C / 2 - 0.4}M${cx - C * 1.5} ${cy + C / 2 + 0.3}L${cx + C * 1.5} ${cy + C / 2}`) +
      [[-1, -1], [1, -1], [0, 0], [-1, 1]].map(([i, j]) => chalk(`M${cx + i * C - 3} ${cy + j * C - 3}L${cx + i * C + 3} ${cy + j * C + 3}M${cx + i * C + 3} ${cy + j * C - 3}L${cx + i * C - 3} ${cy + j * C + 3}`)).join('') +
      [[0, -1], [-1, 0], [1, 0], [0, 1]].map(([i, j]) => chalk(ellipse(cx + i * C, cy + j * C, 3.3, 3.3))).join('') +
      chalk(`M${cx + C + 4.4} ${cy - C - 4.4}L${cx - C - 4.6} ${cy + C + 4.6}`, TT_L, 1.8) +
      `<text x="80" y="73" ${GEORGIA} font-style="italic" font-size="4.6" fill="${CHALK}" opacity=".85" text-anchor="middle" transform="rotate(-8 80 73)">¡muy bien!</text>` +
      k.draw([{ d: ledge, fill: WOOD, inner: k.sh(ledge, 0, 0, 0, 1, 0, 0.8, WOOD_D, 0.45) + `<path d="M23 83.6H97" stroke="${WOOD_L}" stroke-width=".6"/>` }], 0.6) +
      k.draw([{ d: roundRect(34, 79.6, 44, 82.6, 1.4), fill: CHALK, inner: k.sh(roundRect(34, 79.6, 44, 82.6, 1.4), 0, 0, 0, 1, 0, 0.6, P.sky2, 0.4) }, { d: roundRect(46, 80.2, 52.4, 82.6, 1.2), fill: TT_L, inner: k.sh(roundRect(46, 80.2, 52.4, 82.6, 1.2), 0, 0, 0, 1, 0, 0.6, TT, 0.4) }], 0.4) +
      k.draw([{ d: roundRect(64, 77.6, 80, 82.6, 1), fill: WOOD_D, inner: `<path d="M64 80.8H80V82.6H64Z" fill="${P.sky2}"/>` + `<path d="M64 81.6H80" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".6 .6"/>` }], 0.45) +
      k.cast([star], 1.6, 1.8, P.mid) +
      k.draw([{ d: star, fill: P.gold, inner: k.sh(star, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="${starPath(86, 36, 6.6, 3, 5, -80)}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.6) +
      `<text x="86" y="38.6" ${GEORGIA} font-weight="700" font-size="5.6" fill="${P.wine}" text-anchor="middle">10</text>` +
      sparkle(80, 26, 2.2, '#fff') + sparkle(32, 26, 1.6) +
      k.defs()
    )
  },

  // ── Sin piedad ────────────────────────────────────────────────────

  // Una paliza: la goma de borrar lo borró del papel. Quedan tus cruces; los círculos del rival, hechos migas.
  'Goma de borrar': (u) => {
    const k = kit(u)
    const C = 10, cx = 54, cy = 56
    const front = 'M-13 -4.6H11L13 -2.6V6.6H-13Z'
    const topF = 'M-13 -4.6L-9.6 -8.4H14.4L11 -4.6Z'
    const side = 'M11 -4.6L14.4 -8.4V2.6L13 6.6V-2.6Z'
    const worn = 'M-13 -4.6C-15.4 -3.6 -16 2 -15.4 4.6C-15 6 -14.2 6.6 -13 6.6Z'
    const sleeve = 'M-1 -4.6H8V6.6H-1Z'
    const crumbs = [[63, 63, 0], [67, 60, 40], [60, 68, 80], [70, 66, 20], [65, 71, 60], [58, 62, 10]].map(([x, y, r], i) => `<path d="M${x} ${y}c1 -.6 2.2 -.2 2.4 .6c.2 .8 -.8 1.2 -1.6 1c-.6 -.2 -1 -.8 -.8 -1.6" fill="${i % 2 ? TT_L : P.sky1}" stroke="${P.ink}" stroke-width=".3" transform="rotate(${r} ${x} ${y})"/>`).join('')
    const smudge = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="4.4" ry="3" fill="${LEAD}" opacity=".12" transform="rotate(-20 ${x} ${y})"/>` + hair(x - 3.4, y + 1, x, y - 2, x + 3, y - 0.6, 0.35, LEAD, 0.35)
    return (
      notebook(k) +
      k.floor(76, 76, 18, 3, P.mid) +
      grid(cx, cy, C, LEAD, 0.8) +
      cross(cx - C, cy - C, 3, LEAD, 1) + cross(cx, cy, 3, LEAD, 1) + cross(cx + C, cy + C, 3, LEAD, 1) +
      smudge(cx + C, cy - C) + smudge(cx - C, cy + C) + smudge(cx, cy - C) +
      `<g opacity=".4">${ring(cx + C, cy, 3.2, LEAD, 0.8)}</g>` +
      k.clip(`M${cx + C - 6} ${cy - 6}H${cx + C + 0.4}V${cy + 6}H${cx + C - 6}Z`, ring(cx + C, cy, 3.2, LEAD, 0.8)) +
      hair(cx - C - 4, cy - C - 4, cx, cy + 0.4, cx + C + 4, cy + C + 4, 1.5, TT) +
      crumbs +
      `<g transform="translate(78 64) rotate(-28) scale(1.3)">` + k.cast([front, topF, side], 1.4, 1.6, P.mid) +
      k.draw([
        { d: worn, fill: TT_L, inner: k.sh(worn, 0, 0, 1, 0, 0, 0.6, TT, 0.4) + `<path d="M-14.6 -2C-15 0 -15 2.6 -14.6 4.6" fill="none" stroke="${LEAD}" stroke-width=".5" opacity=".5"/>` },
        { d: front, fill: TT, inner: k.sh(front, 0, 0, 0, 1, 0, 0.8, TT_D, 0.45) + `<path d="M-13 -4.6H-4V6.6H-13Z" fill="${k.lin(TT_XL, 0, 0, 1, 0, 0.6, 0)}"/>` },
        { d: topF, fill: TT_L, inner: k.sh(topF, 0, 0, 1, 0, 0, 0.6, TT, 0.4) },
        { d: side, fill: TT_D },
        { d: sleeve, fill: P.white, inner: `<path d="M-1 -1H8M-1 3H8" stroke="${P.sky}" stroke-width=".7"/>` + k.sh(sleeve, 0, 0, 0, 1, 0, 0.6, P.blue, 0.35) },
      ], 0.6) +
      `<path d="M-1 -4.6L2.4 -8.4H11.4L8 -4.6Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<text x="3.5" y="1.8" ${GEORGIA} font-style="italic" font-size="2.6" fill="${TT_D}" text-anchor="middle">goma</text>` +
      `</g>` +
      hair(88, 54, 92, 58, 92, 64, 0.6, P.mid) + hair(91, 51, 96, 56, 96, 62, 0.5, P.mid) +
      sparkle(36, 32, 1.8) + sparkle(90, 40, 1.6) +
      k.defs()
    )
  },

  // Cinco palizas: la topadora rosa pasa por encima de la grilla y empuja con la pala las cruces y los círculos.
  'Topadora': (u) => {
    const k = kit(u)
    const xPiece = (x: number, y: number, r: number, s: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: X_SOLID, fill: P.mid, inner: k.sh(X_SOLID, 0, 0, 1, 1, 0, 0.8, P.night, 0.45) + `<path d="M-4 -5.2L0 -1.4L4 -5.2" fill="none" stroke="${P.sky}" stroke-width=".5"/>` }], f(0.5 / s)) + `</g>`
    const oPiece = (x: number, y: number) => `<g transform="translate(${x} ${y})">` +
      `<circle r="3.9" fill="none" stroke="${P.ink}" stroke-width="3.8"/><circle r="3.9" fill="none" stroke="${TT}" stroke-width="2.4"/><path d="M-3 -2.4A3.9 3.9 0 0 1 1.6 -3.6" fill="none" stroke="${TT_XL}" stroke-width=".7" stroke-linecap="round"/></g>`
    const treads = Array.from({ length: 6 }, (_, i) => `M${f(93 + i * 1.8)} 79.4L${f(94.2 + i * 1.8)} 81.6`).join('')
    return (
      notebook(k, 24) +
      hair(22, 82, 60, 80.6, 100, 82, 0.6, LEAD, 0.6) +
      `<path d="${treads}" stroke="${P.mid}" stroke-width=".9" opacity=".55"/>` +
      k.floor(66, 81, 32, 3, P.mid) +
      hair(26, 79, 30, 74.6, 34, 76.4, 0.8, LEAD) + hair(25.6, 66, 29, 69.6, 28, 74, 0.7, LEAD) +
      oPiece(31, 76) + xPiece(34.6, 67.4, 24, 0.85) + oPiece(27, 68.6) + xPiece(30.4, 59.6, -14, 0.72) +
      `<g transform="translate(71 80) scale(.88)">` + k.cast(['M-14 -12.2H24V0H-14Z', 'M-12.4 -14.2V-23.6H7.6V-14.2Z', 'M7.6 -14.2V-31.6H24V-14.2Z'], 2.2, 1.6, P.mid) + bulldozer(k) + `</g>` +
      sparkle(88, 34, 2) + sparkle(36, 42, 1.6) +
      k.defs()
    )
  },

  // Quince en blanco: el rodillo de la aplanadora deja el cuaderno liso como pista de patinaje.
  'Aplanadora': (u) => {
    const k = kit(u)
    const ice = 'M48 82H104L100 88H52Z'
    const crumple = 'M14 82L18 79.6L21 81.4L25 78.8L29 81L33 79.4L36 82Z'
    return (
      notebook(k, 24) +
      k.sun(60, 56, 16, 50, 32, false) +
      `<path d="M0 82H120V130H0Z" fill="${P.white}"/>` +
      `<path d="${ice}" fill="${P.sky1}"/>` + k.shade(ice, k.lin(P.sky, 0, 0, 1, 0, 0.1, 0.7), P.sky, 0.3) +
      `<path d="M0 82H120" stroke="${P.ink}" stroke-width=".6"/><path d="M50 82.8H102" stroke="#fff" stroke-width=".9"/>` +
      `<path d="M62 85.4C70 84.2 78 86.4 86 85.2M70 87C76 86.2 84 87.4 92 86.6" fill="none" stroke="#fff" stroke-width=".6"/>` +
      k.draw([{ d: crumple, fill: P.white, inner: k.sh(crumple, 0, 0, 0, 1, 0, 0.7, P.sky2, 0.4) }], 0.45) +
      cross(25, 74.4, 2.6, LEAD, 1.1) + ring(31.4, 75.4, 2.4, LEAD, 1) +
      `<g transform="translate(60 82) scale(.88)">` + k.floor(6, 0, 38, 2.6, P.mid) + roller(k) + `</g>` +
      sparkle(92, 84.6, 2.2, '#fff') + sparkle(78, 86, 1.4, '#fff') +
      sparkle(88, 34, 2.4, '#fff') + sparkle(30, 46, 1.8) +
      k.defs()
    )
  },
}
