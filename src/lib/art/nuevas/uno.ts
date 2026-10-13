// UNO: el grito, el +4 y el despiste, en clave heroica. Manda el rojo de la ficha del juego en el catálogo.
// Nada del logo: las cartas son las del mazo (cara de color, óvalo blanco inclinado y el valor), sin la marca.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** El rojo de UNO (el color de su ficha en el catálogo) con su sombra, y los otros tres colores del mazo. */
const RED = '#D62828', RED_D = '#8C1A20'
const YEL = '#F1C232', YEL_D = '#C38A17'
const GRN = '#3F9A50'
const BLU = '#2F66B6'
/** La cara negra de los comodines y el negro de la galera. */
const BLACK = '#232329'
/** El naranja del pececito. */
const FISH = '#EE8A2E', FISH_D = '#B4521C', FISH_L = '#FBC47C'

/** Varilla entintada (manija, cordón, bastón): la tinta gruesa y el color encima. */
const rod = (d: string, c: string, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

// ── La carta ─────────────────────────────────────────────────────────

const CW = 10.4, CH = 15.6
/** La carta centrada en (0,0): 20.8 de ancho por 31.2 de alto. */
const CARD = roundRect(-CW, -CH, CW, CH, 1.9)
const FACE = roundRect(-CW + 1.4, -CH + 1.4, CW - 1.4, CH - 1.4, 1.1)
const OVAL = ellipse(0, 0, 6.9, 12.2)

/** Valor en cursiva con la sombra de tinta corrida, como en el mazo. */
const value = (n: string, x: number, y: number, s: number, fill: string, rot = 0) => {
  const t = rot ? ` transform="rotate(${rot} ${x} ${f(y - s * 0.34)})"` : ''
  return (
    `<text x="${f(x + s * 0.05)}" y="${f(y + s * 0.05)}" ${GEORGIA} font-style="italic" font-weight="700" font-size="${s}" fill="${P.ink}" text-anchor="middle"${t}>${n}</text>` +
    `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="${s}" fill="${fill}" stroke="${P.ink}" stroke-width="${f(s * 0.045)}" paint-order="stroke" stroke-linejoin="round" text-anchor="middle"${t}>${n}</text>`
  )
}

/** Carta del mazo: borde blanco, cara de color con su volumen, el óvalo blanco inclinado con el valor y los índices
 * en las esquinas. Con `face` negro es el comodín +4: cuatro cartitas de colores en el óvalo. */
function unoCard(k: Kit, face: string, dark: string, n: string, w = 0.6) {
  const wild = face === BLACK
  const minis: [number, number, number, string][] = [[-2.4, -3.4, -16, BLU], [2.2, -1.6, 10, GRN], [-2, 2.2, -6, YEL], [2.4, 3.6, 14, RED]]
  const center = wild
    ? minis.map(([x, y, r, c]) => `<rect x="-2.1" y="-3" width="4.2" height="6" rx=".7" fill="${c}" stroke="${P.ink}" stroke-width=".4" transform="translate(${x} ${y}) rotate(${r})"/><path d="M-1.3 -2.2H.4" stroke="#fff" stroke-width=".4" opacity=".7" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')
    : value(n, 0, 5.2, 15, face)
  return (
    k.draw([{
      d: CARD, fill: P.white,
      inner:
        `<path d="${FACE}" fill="${face}"/>` +
        k.clip(FACE, k.sh(FACE, 0, 0, 1, 1, 0, 0.8, dark, 0.45) + `<path d="M-12 -18H-4V18H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>`) +
        `<path d="${FACE}" fill="none" stroke="${dark}" stroke-width=".35"/>` + k.sh('M4 -17H12V17H4Z', 0, 0, 1, 0, 0, 0.35, P.blue, 0.2),
    }], w) +
    `<g transform="rotate(32)">` + k.draw([{ d: OVAL, fill: P.white, inner: k.sh(OVAL, 0, 0, 1, 1, 0, 0.55, P.sky2, 0.4) }], 0.32) + `</g>` +
    center +
    value(wild ? '+4' : n, -CW + 3.8, -CH + 6.6, wild ? 4.4 : 5.4, '#fff') + value(wild ? '+4' : n, CW - 3.8, CH - 2.6, wild ? 4.4 : 5.4, '#fff', 180)
  )
}

/** Puño cerrado (el de la Mano de Dios) con la manga negra de referí; los nudillos arriba en y≈-14. */
function fist(k: Kit) {
  const finger = (x: number, w: number, top: number) => roundRect(f(x - w / 2), top, f(x + w / 2), 1.6, w / 2)
  const F: [number, number, number][] = [[-9.1, 6.2, -12.8], [-3, 6.2, -14.4], [3.1, 6.1, -13.6], [8.9, 5.6, -11.6]]
  const cuff = 'M-12.4 19H12L13 42H-13.4Z'
  const wrist = 'M-9.4 10H9.2L8.8 21H-9Z'
  const palm = 'M-12.6 -3C-13.2 3 -12.8 9 -10.6 14H10.6C12.8 9 13.2 3 12.4 -3Z'
  const thumb = 'M-10.6 14C-14.6 11.6 -15.6 7.6 -14 3.6C-13.2 1.4 -11.4 0 -9.2 0H.8C3.2 0 4.8 1.4 4.8 3.2C4.8 5 3.2 6.4 1 6.4H-6C-6.6 9 -6 11.6 -4.4 14Z'
  return {
    outline: [cuff, wrist, palm, ...F.map(([x, w, top]) => finger(x, w, top)), thumb],
    art: k.draw(
      [
        { d: cuff, fill: BLACK, line: 0.35, inner: `<path d="M-14 19H14V23.4H-14Z" fill="${P.white}"/>` + k.sh('M3 17H15V44H3Z', 0, 0, 1, 0, 0, 0.9, '#000', 0.4) + `<path d="M-14 23H-6V44H-14Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.22, 0)}"/>` + hair(-8, 27, -7, 33, -8.6, 41, 0.5, '#5A5A66') + hair(5, 27, 6, 33, 5, 40, 0.45, '#000') },
        { d: wrist, fill: P.skin, inner: k.sh('M2 8H11V22H2Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-11 15H11V22H-11Z', 0, 0, 0, 1, 0, 0.6) },
        { d: palm, fill: P.skin, inner: k.sh('M3 -4C8 2 10 8 9 15H14V-4Z', 0, 0, 1, 0, 0, 0.9) + k.sh('M-8 5H11V14H-8Z', 0, 0, 0, 1, 0.75, 0.1) },
        ...F.map(([x, w, top]) => ({
          d: finger(x, w, top), fill: P.skin, line: 0.38,
          inner:
            k.sh(`M${f(x)} ${top - 1}H${f(x + w)}V3H${f(x)}Z`, 0, 0, 1, 0, 0, 0.75) + k.sh(`M${f(x - w)} -3H${f(x + w)}V3H${f(x - w)}Z`, 0, 0, 0, 1, 0, 0.6) +
            `<ellipse cx="${f(x - w * 0.16)}" cy="${f(top + 2.2)}" rx="${f(w * 0.17)}" ry=".9" fill="#fff" opacity=".9"/>`,
        })),
        {
          d: thumb, fill: P.skin, line: 0.38,
          inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7) + `<path d="M.6 1.4H2.4C3.7 1.4 4.3 2.4 4.3 3.2C4.3 4 3.7 5 2.4 5H.6C1.2 4 1.2 2.4 .6 1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` + hair(-7.6, 1.2, -7, 3.2, -7.6, 5.4, 0.4),
        },
      ],
      0.62,
    ),
  }
}

/** Puñal: hoja de dos caras que entra (hasta `vis`) en lo que esté clavando, gavilán dorado con volutas, puño rojo
 * encordado y pomo con piedra. La hoja apunta a -y; la guarnición está en y=0. */
function dagger(k: Kit, vis: number) {
  const blade = `M-3.4 0L-2.7 ${-vis}H2.7L3.4 0Z`
  const bladeR = `M0 0V${-vis}H2.7L3.4 0Z`
  const guard = 'M-11 -3.4C-8 -1.4 -4 -.8 0 -.8C4 -.8 8 -1.4 11 -3.4C12.6 -2.6 12.8 -.6 11.2 .8C8 2.6 4 3.2 0 3.2C-4 3.2 -8 2.6 -11.2 .8C-12.8 -.6 -12.6 -2.6 -11 -3.4Z'
  const grip = 'M-2.5 3H2.5L2.1 16.6H-2.1Z'
  const pommel = 'M0 16.2C2.8 16.2 4.4 17.8 4.4 19.8C4.4 22 2.8 23.4 0 23.4C-2.8 23.4 -4.4 22 -4.4 19.8C-4.4 17.8 -2.8 16.2 0 16.2Z'
  const wire = Array.from({ length: 6 }, (_, i) => `<path d="M-2.5 ${f(4 + i * 2.1)}L2.5 ${f(5.6 + i * 2.1)}" stroke="${P.ink}" stroke-width=".8"/><path d="M-2.5 ${f(4 + i * 2.1)}L2.5 ${f(5.6 + i * 2.1)}" stroke="${P.gold}" stroke-width=".4"/>`).join('')
  const curl = (sx: number) =>
    `<g transform="scale(${sx} 1)"><path d="M11.4 -2.6C14 -4 15.6 -1.6 14.4 .2C13.4 1.6 11.4 1 11.8 -.4" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M11.4 -2.6C14 -4 15.6 -1.6 14.4 .2C13.4 1.6 11.4 1 11.8 -.4" fill="none" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/></g>`
  return (
    k.draw([
      { d: blade, fill: P.white },
      { d: grip, fill: RED, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, RED_D, 0.45) },
      { d: pommel, fill: P.gold, line: 0.3, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) },
      { d: guard, fill: P.gold, line: 0.3, inner: k.sh(guard, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-10 -1.4C-5 .4 5 .4 10 -1.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` },
    ], 0.75) +
    `<path d="${bladeR}" fill="${P.sky}"/>` + k.clip(bladeR, k.sh(bladeR, 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.4)) +
    `<path d="M0 -1V${-vis}" stroke="${P.mid}" stroke-width=".45"/>` + hair(-1.8, -2, -2, -vis / 2, -1.6, -vis + 1, 0.6, '#fff') +
    `<path d="${blade}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
    hair(-1, -4, -0.2, -7, -1, -10, 0.4, P.mid) + hair(1, -4, 0.2, -7, 1, -10, 0.4, P.mid) +
    curl(1) + curl(-1) + wire +
    `<circle cx="0" cy="1.2" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="0" cy="1.2" r="1.4" fill="${RED}" stroke="${P.ink}" stroke-width=".3"/><circle cx="-.5" cy=".7" r=".4" fill="#fff"/>` +
    `<path d="M-2.7 3H2.7V4H-2.7ZM-2.3 15.6H2.3V16.6H-2.3Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
    `<circle cx="0" cy="19.8" r="1.6" fill="${RED}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.5" cy="19.3" r=".4" fill="#fff"/>` +
    `<path d="M-4.6 ${-vis}H4.6" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>`
  )
}

export const UNO_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── ¡UNO! ──────────────────────────────────────────────────────────

  // Tres ganadas: la última carta, el uno rojo, parada en las baldosas del patio con el grito detrás.
  'Grito en el patio': (u) => {
    const k = kit(u)
    const N = 13
    let burst = ''
    for (let i = 0; i < N * 2; i++) {
      const a = -Math.PI / 2 + (i / (N * 2)) * Math.PI * 2 + 0.12, r = i % 2 ? 21.5 + (i % 3) * 1.1 : 31 - ((i * 7) % 5) * 0.9
      burst += (i ? 'L' : 'M') + f(60 + Math.cos(a) * r * 1.04) + ' ' + f(52 + Math.sin(a) * r)
    }
    burst += 'Z'
    // Baldosas en perspectiva, con el punto de fuga arriba.
    const vy = 30, ys = [80, 83.2, 87.6, 93.4, 101, 111]
    const xAt = (xb: number, y: number) => 60 + (xb - 60) * ((y - vy) / (111 - vy))
    let dark = ''
    for (let r = 0; r < ys.length - 1; r++) {
      for (let c = -8; c < 8; c++) {
        if ((r + c) % 2 === 0) continue
        const x0 = 60 + c * 13, x1 = x0 + 13
        dark += `M${f(xAt(x0, ys[r]))} ${ys[r]}L${f(xAt(x1, ys[r]))} ${ys[r]}L${f(xAt(x1, ys[r + 1]))} ${ys[r + 1]}L${f(xAt(x0, ys[r + 1]))} ${ys[r + 1]}Z`
      }
    }
    const floor = 'M10 80H110V112H10Z'
    return (
      k.day() +
      `<path d="${floor}" fill="${P.white}"/>` + `<path d="${dark}" fill="${P.sky2}"/>` + k.clip(floor, `<path d="${dark}" fill="none" stroke="${P.blue}" stroke-width=".4"/>`) +
      k.sh(floor, 0, 0, 0, 1, 0.7, 0, P.sky2, 0.4) + `<path d="M10 80H110" stroke="${P.blue}" stroke-width=".7"/>` +
      k.draw([{ d: burst, fill: P.white, inner: k.shade(burst, k.rad(P.goldL, 0.5, 0.5, 0.55, 0.9, 0), P.gold, 0.4) }], 0.6) +
      `<text x="60" y="32.4" ${GEORGIA} font-style="italic" font-weight="700" font-size="6" fill="${RED}" text-anchor="middle">¡uno!</text>` +
      k.floor(63, 80.4, 17, 2.4) +
      `<g transform="translate(60 58.6) rotate(-8) scale(1.36)">` + k.cast([CARD], 1.6, 1.4) + unoCard(k, RED, RED_D, '1') + `</g>` +
      hair(36, 50, 32, 52, 28, 52, 0.7) + hair(37, 58, 33, 60, 29, 61.6, 0.6) + hair(84, 46, 88, 46, 92, 44, 0.7) + hair(84, 54, 88, 55, 92, 54, 0.6) +
      sparkle(86, 32, 2.2) + sparkle(32, 36, 1.6) +
      k.defs()
    )
  },

  // Doce ganadas: el bombo de la hinchada, con el uno pintado en el parche y las dos mazas cruzadas.
  'Bombo de cancha': (u) => {
    const k = kit(u)
    const RX = 17, RY = 22, fx = -6, bx = 9, by = -2
    const shell = `M${fx} ${-RY}L${bx} ${by - RY}A${RX} ${RY} 0 0 1 ${bx} ${by + RY}L${fx} ${RY}Z`
    const hoop = ellipse(fx, 0, RX, RY), head = ellipse(fx, 0, RX - 2.4, RY - 2.6)
    const at = (cx: number, cy: number, a: number) => `${f(cx + Math.cos(a) * RX)} ${f(cy + Math.sin(a) * RY)}`
    let rope = ''
    for (let i = 0; i <= 12; i++) {
      const a = ((-84 + i * 14) * Math.PI) / 180
      rope += (i ? 'L' : 'M') + (i % 2 ? at(bx, by, a) : at(fx, 0, a))
    }
    const tabs = Array.from({ length: 6 }, (_, i) => {
      const a = ((-70 + i * 28) * Math.PI) / 180, x = fx + Math.cos(a) * RX * 0.5 + bx * 0.5 + 0.8, y = Math.sin(a) * RY - 1
      return `<rect x="-1.2" y="-2" width="2.4" height="4" rx=".6" fill="${P.brown}" stroke="${P.ink}" stroke-width=".35" transform="translate(${f(x)} ${f(y)}) rotate(${f((a * 180) / Math.PI * 0.4)})"/>`
    }).join('')
    const tacks = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2
      return `<circle cx="${f(fx + Math.cos(a) * (RX - 1.2))}" cy="${f(Math.sin(a) * (RY - 1.3))}" r=".5" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".2"/>`
    }).join('')
    const backHoop = `M${bx} ${by - RY}A${RX} ${RY} 0 0 1 ${bx} ${by + RY}`
    const mallet = (x0: number, y0: number, x1: number, y1: number) => {
      const stick = taper(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 2.6, 2)
      const ball = ellipse(x1, y1, 5, 5)
      return k.draw([
        { d: stick, fill: P.brown, inner: k.sh(stick, 0, 0, 1, 0, 0.1, 0.9, P.brownD, 0.4) },
        { d: ball, fill: P.white, inner: k.sh(ball, 0, 0, 1, 1, 0, 0.9, P.blue, 0.4) + `<path d="M${x1 - 5} ${y1 + 0.4}Q${x1} ${y1 + 3} ${x1 + 5} ${y1 + 0.4}" fill="none" stroke="${P.sky2}" stroke-width=".5" stroke-dasharray="1 .7"/>` + `<ellipse cx="${f(x1 - 1.8)}" cy="${f(y1 - 1.8)}" rx="1.4" ry=".8" fill="#fff" transform="rotate(-35 ${f(x1 - 1.8)} ${f(y1 - 1.8)})"/>` },
      ], 0.6)
    }
    const confetti = ([[58, 26, 30, RED], [91, 52, -20, YEL], [32, 82, 60, BLU], [87, 80, 15, GRN], [74, 27, -40, BLU], [66, 22, 20, YEL], [94, 66, 70, RED]] as const)
      .map(([x, y, r, c]) => `<rect x="-1.5" y="-.9" width="3" height="1.8" fill="${c}" stroke="${P.ink}" stroke-width=".3" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')
    return (
      k.day() +
      k.sun(60, 60, 16, 46, 32, false) +
      `<g transform="translate(58 66) rotate(-8) scale(1.12)">` +
      k.cast([shell, hoop], 2, 2) +
      k.draw([{ d: shell, fill: RED, inner: k.sh(shell, 0, 0, 1, 0, 0, 0.95, RED_D, 0.45) + k.sh(shell, 0, 0, 0, 1, 0.5, 0, RED_D, 0.3) + hair(4, -18, 14, -16, 22, -10, 0.6, '#fff', 0.6) }], 0.75) +
      rod(rope, P.white, 0.8) + tabs +
      `<path d="${backHoop}" fill="none" stroke="${P.ink}" stroke-width="4"/><path d="${backHoop}" fill="none" stroke="${P.brown}" stroke-width="2.6"/><path d="${backHoop}" fill="none" stroke="${P.goldL}" stroke-width=".5" transform="translate(-.5 0)"/>` +
      k.draw([
        { d: hoop, fill: P.brown, inner: k.sh(hoop, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="${ellipse(fx, 0, RX - 0.9, RY - 1)}" fill="none" stroke="${P.goldL}" stroke-width=".4" opacity=".7"/>` },
        { d: head, fill: RED, line: 0.4, inner: `<g transform="translate(${fx} 0) scale(.78 1)"><g transform="rotate(30)"><path d="${ellipse(0, 0, 8.8, 15.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".5"/></g>${value('1', 0, 7, 21, RED)}</g>` + k.sh(head, 0, 0, 1, 1, 0, 0.7, RED_D, 0.35) + `<path d="M${fx - 11} -10C${fx - 9} -15 ${fx - 5} -18 ${fx} -18.6" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/>` },
      ], 0.7) +
      tacks +
      `</g>` +
      mallet(26.6, 60, 41.6, 35.6) +
      hair(34, 30.6, 38.6, 27.6, 44, 28, 0.6) + hair(47.6, 31, 50.6, 33.4, 51.6, 37.6, 0.6) + hair(33.4, 35, 34, 32, 36.4, 30.6, 0.45) +
      confetti +
      sparkle(88, 34, 2.2) + sparkle(30, 72, 1.5) +
      k.defs()
    )
  },

  // Treinta y cinco ganadas: la bocina de bronce grabada, con cinta, que hace eco en todo el barrio.
  'Megáfono de oro': (u) => {
    const k = kit(u)
    const cone = 'M-21 -3L11 -10.4C14.6 -11 17.4 -13.4 19.6 -17L19.6 17C17.4 13.4 14.6 11 11 10.4L-21 3Z'
    const mouthTube = 'M-26.6 -2.6H-20.6V2.6H-26.6Z'
    const cup = ellipse(-27.2, 0, 1.6, 4.4)
    const lip = ellipse(19.6, 0, 4.6, 17)
    const hole = ellipse(20, 0, 3.4, 15)
    const rr = (x: number) => 3 + (x + 21) * 0.231
    const band = (x: number) => `M${x} ${f(-rr(x))}Q${f(x + 1.6)} 0 ${x} ${f(rr(x))}`
    const bands = [-16, -9, 6].map((x) => `<path d="${band(x)}" fill="none" stroke="${P.ink}" stroke-width="1.5"/><path d="${band(x)}" fill="none" stroke="${P.goldL}" stroke-width=".6" transform="translate(-.4 0)"/>`).join('')
    const beads = Array.from({ length: 13 }, (_, i) => {
      const a = (-Math.PI / 2) + (i / 12) * Math.PI
      return `<circle cx="${f(19.6 + Math.cos(a) * 4.6)}" cy="${f(Math.sin(a) * 17)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>`
    }).join('')
    const handle = 'M-13 5C-14.4 12 -9 16.6 -3 15.6C1.4 14.8 3 11.6 2.2 8.4'
    const grip = 'M-11.2 13.4C-8.6 15.8 -4.6 16.2 -1.6 15'
    const wave = (R: number, w: number) => {
      const a0 = -0.62, a1 = 0.62, cx = 12
      return hair(cx + Math.cos(a0) * R, Math.sin(a0) * R, cx + R * 1.18, 0, cx + Math.cos(a1) * R, Math.sin(a1) * R, w, P.ink)
    }
    return (
      k.day() +
      k.sun(60, 58, 16, 48, 32, false) +
      k.shade(ellipse(60, 56, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      `<g transform="translate(55 65.6) rotate(-29) scale(1.1)">` +
      k.cast([cone, lip], 2, 2.4) +
      rod(handle, P.gold, 1.7) + rod(grip, RED, 2.6) + `<path d="M-9.6 14.2L-9 16.4M-7 15.2L-6.6 17M-4.4 15.4L-4.2 17.2" stroke="${RED_D}" stroke-width=".5"/>` +
      k.draw([
        { d: mouthTube, fill: P.gold, inner: k.sh(mouthTube, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
        { d: cup, fill: P.gold, inner: k.sh(cup, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
        {
          d: cone, fill: P.gold,
          inner:
            k.sh(cone, 0, 0, 0, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-26 -4L12 -12V-4L-26 -.6Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.55, 0)}"/>` +
            bands + Array.from({ length: 6 }, (_, i) => `<path d="M${f(-20.4 + i * 0.75)} -3.4L${f(-19.4 + i * 0.75)} 3.4" stroke="${P.goldD}" stroke-width=".35"/>`).join('') + `<path d="M-8 -4.6H5M-8 4.6H5" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
            `<text x="-1.4" y="1.6" ${GEORGIA} font-style="italic" font-weight="700" font-size="4.6" fill="${P.brownD}" text-anchor="middle">¡uno!</text>` +
            `<path d="${starPath(14.4, 0, 3.6, 1.5, 8)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/><circle cx="14.4" cy="0" r="1.1" fill="${RED}" stroke="${P.ink}" stroke-width=".3"/>` +
            hair(-19, 1.8, -4, 6, 12, 8.6, 0.5, P.goldD) + hair(-19, -1.4, -3, -5.4, 12, -8.4, 1.1, '#fff', 0.9) + hair(-15, -2.4, -6, -4.4, 4, -6.4, 0.4, P.goldL) +
            [-16, -9, 6].map((x) => Array.from({ length: 5 }, (_, i) => `<circle cx="${f(x + 0.5 + Math.sin(((i + 0.5) / 5) * Math.PI) * 0.6)}" cy="${f(-rr(x) + ((i + 0.5) / 5) * 2 * rr(x))}" r=".38" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`).join('')).join(''),
        },
        { d: lip, fill: P.gold, line: 0.3, inner: k.sh(lip, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.8) +
      `<path d="${hole}" fill="${P.brownD}"/>` + k.shade(hole, k.lin(P.night, 0, 0, 1, 0, 0.9, 0.2), P.night, 0.5) + `<path d="M19 -12C17.6 -6 17.6 6 19 12" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
      beads +
      wave(18, 0.9) + wave(24, 0.8) + wave(30, 0.7) +
      `</g>` +
      sparkle(60, 22, 3.2, '#fff') + sparkle(30, 44, 2) + sparkle(90, 74, 1.6) +
      k.defs()
    )
  },

  // ── Mala leche ─────────────────────────────────────────────────────

  // Cinco +4: un codacito en el área. El referí te saca la amarilla, que es un +4.
  'Codazo': (u) => {
    const k = kit(u)
    const hand = fist(k)
    const pitch = ellipse(60, 58, 34, 34)
    const stripes = Array.from({ length: 6 }, (_, i) => `<path d="M${26 + i * 12} 20H${32 + i * 12}V100H${26 + i * 12}Z" fill="${P.greenD}" opacity=".22"/>`).join('')
    return (
      k.day() +
      `<path d="${pitch}" fill="${P.green}"/>` + k.clip(pitch, stripes + `<path d="M14 84H106M38 84A22 22 0 0 0 82 84" fill="none" stroke="${P.white}" stroke-width="1.1" opacity=".9"/><circle cx="60" cy="96" r="1.2" fill="${P.white}"/>`) +
      k.shade(pitch, k.rad(P.greenD, 0.5, 0.5, 0.5, 0, 1), P.greenD, 0.6) +
      `<circle cx="60" cy="58" r="34" fill="none" stroke="${P.greenD}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      `<g transform="rotate(-13 60 72)">` +
      `<g transform="translate(60.6 45.4) rotate(4) scale(1.1)">` + k.cast([CARD], 1.8, 1.6) + unoCard(k, YEL, YEL_D, '+4') + `</g>` +
      `<g transform="translate(62 74) scale(1.02)">${k.cast(hand.outline, 2, 1.8)}</g>` +
      `<g transform="translate(60 72) scale(1.02)">${hand.art}</g>` +
      `</g>` +
      hair(36, 36, 32, 44, 33, 52, 0.8, P.white) + hair(31, 41, 27, 48, 29, 56, 0.6, P.white) + hair(80, 36, 84, 44, 83, 52, 0.8, P.white) + hair(85, 40, 89, 48, 87, 56, 0.6, P.white) +
      sparkle(86, 66, 2.2) + sparkle(36, 64, 1.6) +
      k.defs()
    )
  },

  // Veinticinco +4: el puñal clavado en la madera, atravesando el +4 que te tiraron por la espalda.
  'Puñal por la espalda': (u) => {
    const k = kit(u)
    const planks = Array.from({ length: 8 }, (_, i) => {
      const x = 4 + i * 15
      return `<path d="M${x} 0H${x + 15}V130H${x}Z" fill="${i % 2 ? '#E3BD86' : '#D9AE74'}"/>` +
        hair(x + 4, 10, x + 6, 50, x + 4, 120, 0.5, P.brown, 0.7) + hair(x + 10, 0, x + 8, 40, x + 11, 90, 0.4, P.brown, 0.6) +
        `<path d="M${x} 0V130" stroke="${P.brownD}" stroke-width=".9"/>`
    }).join('')
    const knots = [[33, 38], [80, 84], [92, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.6" fill="none" stroke="${P.brown}" stroke-width=".6"/><ellipse cx="${x}" cy="${y}" rx=".6" ry="1.2" fill="${P.brownD}" opacity=".7"/>`).join('')
    return (
      `<rect width="120" height="130" fill="#DDB37B"/>` + planks + knots +
      k.shade('M0 0H120V130H0Z', k.rad(P.brownD, 0.5, 0.5, 0.7, 0, 0.9), P.brownD, 0.45) +
      `<g transform="translate(52 70) rotate(-8) scale(1.22)">` + k.cast([CARD], 1.6, 1.6, P.brownD) + unoCard(k, BLACK, '#000000', '+4') + `</g>` +
      `<g transform="translate(65.5 54.2) rotate(-120) scale(1.2)">` + k.cast(['M-3.4 0L-2.7 -13H2.7L3.4 0Z', 'M-11 -3.4H11V3.2H-11Z', 'M-2.5 3H2.5V23H-2.5Z'], -1.4, -1.8, P.brownD) + dagger(k, 13) + `</g>` +
      hair(50, 60, 47, 59, 44, 60, 0.5) + hair(51, 64.6, 49, 67, 48.6, 70, 0.45) + hair(54, 60, 55, 57, 57.6, 55.6, 0.4) +
      sparkle(84, 74, 2) +
      k.defs()
    )
  },

  // Setenta y cinco +4: el villano de telenovela. La galera en el centro del escenario y el abanico de +4 detrás, entre
  // los telones rojos.
  'Villano de telenovela': (u) => {
    const k = kit(u)
    const drape = 'M6 6H45C44 22 40 38 33 52C31 56 29.4 59 29 61C33 72 37 90 39 114H6Z'
    const folds = hair(14, 10, 16, 36, 13, 58, 0.7, RED_D) + hair(22, 10, 24, 34, 20, 58, 0.6, RED_D) + hair(31, 10, 32, 28, 26, 56, 0.6, RED_D) + hair(38, 10, 37, 24, 32, 44, 0.45, RED_D) +
      hair(14, 66, 18, 88, 16, 112, 0.7, RED_D) + hair(23, 66, 27, 88, 27, 112, 0.6, RED_D) + hair(31, 68, 34, 88, 35, 112, 0.5, RED_D) +
      hair(18, 12, 19.6, 34, 17, 56, 0.5, '#fff', 0.45) + hair(19, 68, 22, 88, 21, 110, 0.5, '#fff', 0.35)
    const trim = 'M43.2 6C42.2 22 38.2 38 31.4 52C29.6 56 28 59 27.6 61C31.6 72 35.4 90 37.4 114'
    const curtain = k.draw([{ d: drape, fill: RED, inner: k.sh(drape, 0, 0, 1, 0, 0, 0.9, RED_D, 0.45) + k.sh('M6 52H46V70H6Z', 0, 0, 0, 1, 0, 0.8, RED_D, 0.3) + folds + `<path d="${trim}" fill="none" stroke="${P.goldD}" stroke-width="1.6"/><path d="${trim}" fill="none" stroke="${P.gold}" stroke-width=".9"/><path d="${trim}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` }], 0.7) +
      rod('M7 56C15 62 23 63 30 60.6', P.gold, 1.4) + `<path d="M29.4 61L32.4 71.6L26.8 71.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M28.2 67.6V71M29.8 67V71.2M31.2 67.6V71" stroke="${P.goldD}" stroke-width=".3"/><circle cx="29.6" cy="60.8" r="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="29.1" cy="60.3" r=".5" fill="${P.goldL}"/>`
    let val = 'M0 0H120V21'
    for (let x = 120; x > 0; x -= 12) val += `Q${x - 6} 28 ${x - 12} 21`
    val += 'Z'
    const fringe = Array.from({ length: 10 }, (_, i) => { const x = 6 + i * 12; return `<path d="M${x} 24.6V27.6" stroke="${P.gold}" stroke-width=".9"/><circle cx="${x}" cy="28.2" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/>` }).join('')
    const brim = 'M-17 -2.6C-14.6 .2 -8 1.8 0 1.8C8 1.8 14.6 .2 17 -2.6C17.6 1.6 10 5 0 5C-10 5 -17.6 1.6 -17 -2.6Z'
    const crown = 'M-10.4 -.6C-10.6 -8 -11 -15 -11.6 -22C-4.4 -24 4.4 -24 11.6 -22C11 -15 10.6 -8 10.4 -.6C4.4 .8 -4.4 .8 -10.4 -.6Z'
    const top = ellipse(0, -22.2, 11.6, 2.6)
    const hband = 'M-10.6 -6.8C-4.4 -5.2 4.4 -5.2 10.6 -6.8L10.4 -.6C4.4 .8 -4.4 .8 -10.4 -.6Z'
    const hat =
      k.draw([
        { d: brim, fill: BLACK, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, '#000', 0.4) + `<path d="M-15.6 -1.4C-10 1.8 10 1.8 15.6 -1.4" fill="none" stroke="#70707C" stroke-width=".5"/>` },
        { d: crown, fill: BLACK, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, '#000', 0.5) + hair(-7.4, -21, -7.8, -13, -7.2, -4, 1, '#fff', 0.55) + hair(-4.8, -21, -5, -14, -4.6, -7, 0.45, '#fff', 0.4) + hair(6.6, -20, 7.2, -12, 6.6, -5, 0.5, '#5A5A66') },
        { d: hband, fill: RED, inner: k.sh(hband, 0, 0, 1, 0, 0, 0.9, RED_D, 0.45) + `<path d="M-10.4 -5.8C-4.4 -4.2 4.4 -4.2 10.4 -5.8" fill="none" stroke="${RED_D}" stroke-width=".35"/>` },
        { d: top, fill: '#3A3A44', inner: k.sh(top, 0, 0, 1, 1, 0, 0.7, '#000', 0.4) + `<path d="M-9 -22.6C-5 -24 3 -24 7 -23.4" fill="none" stroke="#8A8A96" stroke-width=".4"/>` },
      ], 0.7) +
      `<path d="M3.4 -6.6H8.2V-.4H3.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M4.6 -5.4H7V-1.6H4.6Z" fill="${RED_D}"/>`
    const fan = [-33, -11, 11, 33].map((a) => `<g transform="translate(60 86) rotate(${a}) translate(0 -25)">${k.cast([CARD], 1.2, 1, '#000')}${unoCard(k, BLACK, '#000000', '+4', 0.55)}</g>`).join('')
    const boards = Array.from({ length: 6 }, (_, i) => `<path d="M0 ${f(89 + i * 3.2 + i * i * 0.4)}H120" stroke="${P.brownD}" stroke-width=".5"/>`).join('')
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` + k.shade('M0 0H120V130H0Z', k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.9), P.night, 0.6) +
      `<path d="M0 88H120V130H0Z" fill="${P.brown}"/>` + boards + k.sh('M0 88H120V130H0Z', 0, 0, 0, 1, 0.1, 0.8, P.brownD, 0.4) +
      k.shade('M50 0H70L94 96H26Z', k.lin(P.goldL, 0, 0, 0, 1, 0.42, 0.05), P.goldL, 0.4) +
      k.floor(60, 92, 26, 4.6, '#000') +
      fan +
      `<g transform="translate(60 91) scale(1.08)">` + k.cast([crown, brim], 1.6, 1.4, '#000') + hat + `</g>` +
      curtain + `<g transform="translate(120 0) scale(-1 1)">${curtain}</g>` +
      k.draw([{ d: val, fill: RED, inner: k.sh(val, 0, 0, 0, 1, 0.1, 0.9, RED_D, 0.4) + hair(20, 12, 50, 14, 100, 12, 0.5, RED_D) }], 0.6) + fringe +
      `<text x="85" y="45" ${GEORGIA} font-style="italic" font-weight="700" font-size="5.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3" paint-order="stroke" transform="rotate(10 85 45)">¡ja!</text>` +
      sparkle(37, 38, 1.8, P.goldL) + sparkle(60, 33, 2.4, P.goldL) +
      k.defs()
    )
  },

  // ── Despistado ─────────────────────────────────────────────────────

  // Te olvidaste de cantar UNO: el pececito da vueltas en la pecera y el uno rojo quedó en el fondo.
  'Memoria de pez': (u) => {
    const k = kit(u)
    const cx = 60, cy = 63, R = 27, yt = 41.6, hw = f(Math.sqrt(R * R - (cy - yt) ** 2))
    const bowl = `M${f(cx - hw)} ${yt}A${R} ${R} 0 1 0 ${f(cx + hw)} ${yt}Z`
    const waterY = 49.6, ww = f(Math.sqrt(R * R - (cy - waterY) ** 2))
    const water = `M${f(cx - ww)} ${waterY}A${R} ${R} 0 1 0 ${f(cx + ww)} ${waterY}Z`
    const gravel = Array.from({ length: 34 }, (_, i) => {
      const x = 38 + ((i * 37) % 46), y = 84 + ((i * 13) % 7)
      return `<ellipse cx="${x}" cy="${y}" rx="${f(1.4 + (i % 3) * 0.4)}" ry="${f(1 + (i % 2) * 0.3)}" fill="${[P.goldL, P.sky2, '#E9D2B4', P.white][i % 4]}" stroke="${P.ink}" stroke-width=".25"/>`
    }).join('')
    const body = 'M-11 0C-8 -5.6 -1 -7.6 5 -6C9 -5 11.6 -2.4 12 0C11.6 2.6 9 5 5 6C-1 7.6 -8 5.6 -11 0Z'
    const tail = 'M-9.6 0C-13 -4 -17 -7.4 -20.4 -7.6C-19 -4 -18.6 -1.6 -19.2 0C-18.6 1.8 -19 4 -20.4 7.6C-17 7.4 -13 4 -9.6 0Z'
    const dorsal = 'M-4 -6.2C-2 -10 3 -10.6 6 -8.4C4 -7.6 3 -6.8 2.4 -5.8Z'
    const fin = 'M0 2.4C-1 5.4 -4 7.4 -6.4 7.6C-5.4 5.6 -4.4 3.6 -3.6 2.4Z'
    const scales = Array.from({ length: 7 }, (_, i) => { const x = -5 + (i % 4) * 3.4, y = i < 4 ? -2 : 1.8; return `<path d="M${x} ${f(y - 1.6)}Q${x + 1.6} ${y} ${x} ${f(y + 1.6)}" fill="none" stroke="${FISH_D}" stroke-width=".45"/>` }).join('')
    const fish =
      k.draw([
        { d: tail, fill: FISH, inner: k.sh(tail, 0, 0, 1, 1, 0, 0.8, FISH_D, 0.4) + hair(-11, -1, -15, -4, -19, -6, 0.4, FISH_D) + hair(-11, 1, -15, 3.6, -19, 6, 0.4, FISH_D) + hair(-11, 0, -15, 0, -18.4, 0, 0.35, FISH_D) },
        { d: dorsal, fill: FISH, inner: k.sh(dorsal, 0, 0, 1, 0, 0, 0.8, FISH_D, 0.4) },
        { d: body, fill: FISH, inner: k.sh(body, 0, 0, 0, 1, 0, 0.9, FISH_D, 0.45) + `<path d="M-10 -1C-6 -5 2 -6.4 8 -4.4L6 -1.6C1 -3 -5 -2.4 -10 0Z" fill="${FISH_L}" opacity=".85"/>` + scales + `<path d="M5.4 -4.6C4 -2 4 2 5.4 4.6" fill="none" stroke="${FISH_D}" stroke-width=".55"/>` },
        { d: fin, fill: FISH_L, inner: k.sh(fin, 0, 0, 1, 1, 0, 0.8, FISH_D, 0.4) },
      ], 0.55) +
      `<circle cx="8.2" cy="-1.6" r="1.1" fill="${P.ink}"/><circle cx="7.9" cy="-1.9" r=".35" fill="#fff"/><path d="M11.4 .8L12.4 1.2" stroke="${FISH_D}" stroke-width=".5" stroke-linecap="round"/>`
    return (
      k.day() +
      k.stage(60, 62, 34) +
      k.floor(61, 91, 22, 3) +
      `<path d="${bowl}" fill="${P.white}" opacity=".55"/>` +
      k.clip(bowl,
        `<path d="${water}" fill="${P.sky1}"/>` + k.shade(water, k.lin(P.sky, 0, 0, 0, 1, 0.2, 0.95), P.blue, 0.35) +
        `<g transform="translate(70 80) rotate(22) scale(.62)">${unoCard(k, RED, RED_D, '1', 0.8)}</g>` +
        `<path d="${water}" fill="${P.sky}" opacity=".22"/>` + gravel +
        `<path d="M44 66C40 56 52 52 62 54" fill="none" stroke="${P.blue}" stroke-width=".55" stroke-dasharray="1.3 1.3"/>` +
        `<path d="M76 64C80 72 70 78 58 76" fill="none" stroke="${P.blue}" stroke-width=".55" stroke-dasharray="1.3 1.3"/>` +
        `<g transform="translate(60 64) rotate(-6)">${fish}</g>` +
        `<path d="${ellipse(cx, waterY, ww, 2.6)}" fill="${P.white}" opacity=".6"/><path d="${ellipse(cx, waterY, ww, 2.6)}" fill="none" stroke="${P.blue}" stroke-width=".45"/>`) +
      `<path d="${bowl}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linejoin="round"/>` +
      `<path d="M40 54C37 62 37.6 72 42 80" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".9"/><path d="M44.4 47.6C43 49 42 50.4 41.2 52" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` +
      k.draw([{ d: `${ellipse(cx, yt, hw + 1.2, 3)}`, fill: P.sky1, inner: `<path d="${ellipse(cx, yt + 0.4, hw - 0.6, 1.9)}" fill="${P.sky}" opacity=".5"/>` }], 0.55) +
      [[73, 59.4, 1.1], [75.6, 54.6, 1.4], [73.4, 51.4, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" fill-opacity=".5" stroke="${P.blue}" stroke-width=".45"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`).join('') +
      sparkle(86, 32, 2.2) + sparkle(32, 38, 1.6) +
      k.defs()
    )
  },

  // Cinco olvidos: el paraguas rojo quedó colgado del asiento del colectivo, apoyado y chorreando, con la lluvia
  // en la ventanilla.
  'Paraguas en el bondi': (u) => {
    const k = kit(u)
    const win = roundRect(22, 12, 98, 48, 5)
    const glass = roundRect(25.4, 15.4, 94.6, 44.6, 3)
    const rain = Array.from({ length: 18 }, (_, i) => { const x = 28 + ((i * 23) % 64), y = 19 + ((i * 17) % 24); return hair(x, y, x - 1.2, y + 3, x - 2.2, y + 6, 0.5, P.mid, 0.75) }).join('')
    const drops = [[38, 26], [64, 38], [86, 24], [52, 42], [78, 40]].map(([x, y]) => `<path d="M${x} ${y - 1.6}C${x + 1} ${y} ${x + 1} ${y + 1} ${x} ${y + 1.2}C${x - 1} ${y + 1} ${x - 1} ${y} ${x} ${y - 1.6}Z" fill="${P.white}" stroke="${P.mid}" stroke-width=".3"/>`).join('')
    const back = (x0: number, x1: number) => `M${x0} 112V61C${x0} 55.6 ${x0 + 3} 52.6 ${x0 + 7} 52.6H${x1 - 7}C${x1 - 3} 52.6 ${x1} 55.6 ${x1} 61V112Z`
    const seatL = back(23, 58.6), seatR = back(61.4, 97)
    const seatShade = (x0: number, x1: number) => k.sh(back(x0, x1), 0, 0, 1, 0, 0, 0.85, P.mid, 0.45) + `<path d="M${x0 - 2} 50H${x0 + 9}V112H${x0 - 2}Z" fill="${k.lin(P.sky1, 0, 0, 1, 0, 0.55, 0)}"/>` +
      [0.25, 0.5, 0.75].map((t) => hair(x0 + (x1 - x0) * t, 60, x0 + (x1 - x0) * t + 0.4, 82, x0 + (x1 - x0) * t, 108, 0.55, P.mid, 0.9)).join('') +
      `<path d="M${x0 + 2} 60.6C${x0 + 8} 58.4 ${x1 - 8} 58.4 ${x1 - 2} 60.6" fill="none" stroke="${P.mid}" stroke-width=".45" stroke-dasharray="1 .8"/><path d="M${x0 + 3} 56C${x0 + 6} 54.4 ${x0 + 10} 54 ${x0 + 14} 54" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>`
    const bar = 'M27 53.6V49.4C27 47 28.6 45.4 31 45.4H89C91.4 45.4 93 47 93 49.4V53.6'
    const canopy = 'M-1.6 12C-4.6 16 -6.8 24 -6.6 32C-6.4 38 -3.8 44 -.8 48H.8C3.8 44 6.4 38 6.6 32C6.8 24 4.6 16 1.6 12Z'
    const crook = 'M0 13V-.6C0 -6.2 -8.6 -6.6 -8.6 -1.2'
    const umbrella =
      rod(crook, P.brown, 2.4) + `<path d="M-.7 11V-.4C-.7 -4.8 -7 -5.6 -7.8 -1.8" fill="none" stroke="${P.goldL}" stroke-width=".5" opacity=".85"/>` +
      `<circle cx="-8.6" cy="-1.2" r="1.5" fill="${P.brown}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{
        d: canopy, fill: RED,
        inner: k.sh(canopy, 0, 0, 1, 0, 0.1, 0.95, RED_D, 0.45) + `<path d="M-8 10H-1.4V50H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.32, 0)}"/>` +
          hair(-2.6, 14, -4.8, 30, -1.2, 46, 0.55, RED_D) + hair(1.8, 14, 3.8, 30, 0.8, 46, 0.55, RED_D) + hair(-0.2, 14, -0.6, 30, 0, 46, 0.4, RED_D) +
          hair(-4.6, 22, -5.4, 30, -4.4, 38, 0.6, '#fff', 0.6) +
          `<path d="M-3.4 34.6c.6 0 .9 .5 .9 1s-.4 .9 -.9 .9 -.9 -.4 -.9 -.9 .3 -1 .9 -1Z" fill="#fff" opacity=".85"/><path d="M2.6 20c.5 0 .8 .4 .8 .9s-.4 .8 -.8 .8 -.8 -.3 -.8 -.8 .3 -.9 .8 -.9Z" fill="#fff" opacity=".75"/>`,
      }], 0.6) +
      `<path d="M-6.4 26.4C-2 29 2 29 6.4 26.4L6.6 29.8C2 32.4 -2 32.4 -6.6 29.8Z" fill="${RED_D}" stroke="${P.ink}" stroke-width=".45"/><circle cx="3.8" cy="30" r=".95" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<path d="M-1.7 11H1.7V13.2H-1.7Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-.9 48H.9L.3 52.6H-.3Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M0 54C.9 55.4 1 56.4 0 56.8C-1 56.4 -.9 55.4 0 54Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".3"/>`
    return (
      `<rect width="120" height="130" fill="${P.sky1}"/>` + k.shade('M0 0H120V130H0Z', k.rad(P.sky2, 0.5, 0.4, 0.7, 0, 1), '#9EB1DB', 0.5) +
      k.draw([{ d: win, fill: P.white, inner: k.sh(win, 0, 0, 1, 1, 0, 0.7, P.blue, 0.35) }], 0.6) +
      `<path d="${glass}" fill="${P.sky}"/>` + k.clip(glass, k.shade(glass, k.lin(P.mid, 0, 0, 0, 1, 0.05, 0.6), P.mid, 0.3) + `<path d="M24 56L56 14H72L40 56Z" fill="#fff" opacity=".2"/>` + rain + drops) +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".6"/><path d="M45 17.4V46.6" stroke="${P.ink}" stroke-width="2"/><path d="M45 17.4V46.6" stroke="${P.white}" stroke-width="1"/>` +
      k.draw([{ d: seatL, fill: P.blue, inner: seatShade(23, 58.6) }, { d: seatR, fill: P.blue, inner: seatShade(61.4, 97) }], 0.75) +
      rod(bar, P.white, 2.2) + `<path d="M28 50.6V49.6C28 47.6 29.4 46.4 31.4 46.4H58" fill="none" stroke="${P.sky}" stroke-width=".5"/>` +
      [27, 60, 93].map((x) => `<rect x="${x - 2.2}" y="51.6" width="4.4" height="3" rx=".8" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      `<g transform="translate(73.6 47.4) rotate(24)">` + k.cast([canopy], 2, 1, P.mid) + umbrella + `</g>` +
      sparkle(90, 66, 1.8) +
      k.defs()
    )
  },

  // Quince olvidos: los anteojos de oro con la cadenita, y el uno que tenías adelante todo el tiempo.
  'Anteojos en la frente': (u) => {
    const k = kit(u)
    const L = { x: 46.4, y: 67 }, Rr = { x: 73.6, y: 67 }, r = 11.4
    const cardG = (extra = '') => `<g transform="${extra}translate(60 50) rotate(6) scale(1.36)">${unoCard(k, RED, RED_D, '1', 0.6)}</g>`
    const lens = (c: { x: number; y: number }) => {
      const d = ellipse(c.x, c.y, r, r)
      return k.clip(d, `<path d="${d}" fill="${P.sky1}"/>` + cardG(`translate(${c.x} ${c.y}) scale(1.28) translate(${-c.x} ${-c.y}) `) + `<path d="${d}" fill="${P.sky}" opacity=".18"/>` +
        `<path d="M${c.x - 9} ${c.y - 2}C${c.x - 8} ${c.y - 7} ${c.x - 4} ${c.y - 9.6} ${c.x + 1} ${c.y - 9.6}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>` +
        `<path d="M${c.x + 6} ${c.y + 6}L${c.x + 8} ${c.y + 4}" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`)
    }
    const rim = (c: { x: number; y: number }) => {
      const d = ellipse(c.x, c.y, r, r)
      return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="4.4"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="2.8"/>` +
        `<path d="M${c.x - r} ${c.y}A${r} ${r} 0 0 1 ${c.x + r} ${c.y}" fill="none" stroke="${P.goldL}" stroke-width=".8" transform="translate(-.4 -.5)"/>` +
        `<path d="${ellipse(c.x, c.y, r, r)}" fill="none" stroke="${P.goldD}" stroke-width=".55" stroke-dasharray=".01 1.4" stroke-linecap="round"/>`
    }
    const bridge = 'M57.2 64.6C58 60.4 62 60.4 62.8 64.6'
    const chainPts = Array.from({ length: 15 }, (_, i) => {
      const t = i / 14, x = 34.6 + t * 50.8, y = 70 + Math.sin(t * Math.PI) * 15
      return `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 2 ? 0.9 : 1.3}" fill="${i % 2 ? P.goldL : RED}" stroke="${P.ink}" stroke-width=".35"/>`
    }).join('')
    return (
      k.day() +
      k.sun(60, 56, 16, 47, 32, false) +
      k.shade(ellipse(60, 54, 27, 27), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(52, 99, 30, 90, 27, 62, 8) + laurel(68, 99, 90, 90, 93, 62, 8, true) +
      `<g transform="translate(62 51.6) rotate(6) scale(1.36)">${k.cast([CARD], 1.6, 1.4)}</g>` + cardG() +
      `<path d="M34.6 70Q60 100 85.4 70" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` + chainPts +
      lens(L) + lens(Rr) + rim(L) + rim(Rr) +
      rod(bridge, P.gold, 1.6) + `<path d="M56.4 60.4C57.6 58.4 58.8 58.6 60 60.2C61.2 58.6 62.4 58.4 63.6 60.4" fill="none" stroke="${P.goldD}" stroke-width=".5"/><circle cx="60" cy="61.6" r="1.2" fill="${RED}" stroke="${P.ink}" stroke-width=".35"/><circle cx="59.6" cy="61.2" r=".35" fill="#fff"/>` +
      `<path d="M33 64.4L30 62.6M87 64.4L90 62.6" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M33 64.4L30 62.6M87 64.4L90 62.6" stroke="${P.gold}" stroke-width="1.6" stroke-linecap="round"/>` +
      [34.6, 85.4].map((x) => `<circle cx="${x}" cy="66.4" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="66.4" r=".8" fill="${RED}"/><circle cx="${f(x - 0.3)}" cy="66.1" r=".25" fill="#fff"/>`).join('') +
      sparkle(60, 20, 3.2, '#fff') + sparkle(32, 42, 2) + sparkle(88, 44, 1.6) +
      k.defs()
    )
  },
}
