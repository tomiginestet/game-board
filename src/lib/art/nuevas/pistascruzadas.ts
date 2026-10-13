// Pistas Cruzadas, el de la grilla de palabras que se cruzan, en clave heroica. Manda el azul de la ficha del juego
// (#1C7ED6): el papel es cuadriculado, como el de la grilla, y la noche es azul. A las personas reales (Uri Geller,
// Tusam) no se las dibuja: aparecen por sus cosas (la cucharita doblada, el televisor con la espiral).
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Azul de la ficha de Pistas Cruzadas, con su sombra, su luz, un celeste pálido y la noche azul. */
const PC = '#1C7ED6', PC_D = '#0E4A8A', PC_L = '#7DB8F0', PC_XL = '#DCEBFB', PC_N = '#0B2447'
/** Paja de la colmena y negro del bombín. */
const STRAW = '#E7BE62', STRAW_D = '#A8792A', HAT = '#1D2236', HAT_L = '#46506E'

/** Papel cuadriculado con el borde granulado en el azul de la ficha. */
const graph = (k: Kit) => {
  let g = ''
  for (let i = 0; i <= 26; i++) g += `M0 ${i * 5}H120`
  for (let i = 0; i <= 24; i++) g += `M${i * 5} 0V130`
  return `<rect width="120" height="130" fill="${P.paper}"/>` + `<path d="${g}" stroke="${PC_L}" stroke-width=".3" opacity=".55"/>` +
    k.shade(FULL, k.rad('#A9CBEF', 0.5, 0.46, 0.7, 0, 1), '#7FA9DA', 0.5)
}

/** Noche azul con el resplandor de la ficha en el medio. */
const nightB = (k: Kit, cy = 0.44, r = 0.56) => `<rect width="120" height="130" fill="${PC_N}"/>` + k.shade(FULL, k.rad(PC, 0.5, cy, r, 0.85, 0), PC, 0.4)

/** Escenario celeste: un disco pálido con el borde granulado. */
const stageB = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PC_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(PC_L, 0.5, 0.5, 0.5, 0, 1), PC_L, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PC}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor suave. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Estrellitas de la noche. */
const stars = (list: number[][]) => list.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}" opacity=".85"/>`).join('')

/** Cordón (cable, soga, alambre): tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Lamparita encendida, con la rosca abajo (la punta del contacto en (0,16.4)). */
function bulb(k: Kit) {
  const glass = 'M0 -27C8.4 -27 13.6 -21 13.6 -13.6C13.6 -8.4 10.6 -5 8.4 -1.4C7.4 .2 7 1.6 7 3H-7C-7 1.6 -7.4 .2 -8.4 -1.4C-10.6 -5 -13.6 -8.4 -13.6 -13.6C-13.6 -21 -8.4 -27 0 -27Z'
  const base = 'M-7 3H7L6.6 12.4C6.6 13.6 3.6 14.6 0 14.6C-3.6 14.6 -6.6 13.6 -6.6 12.4Z'
  const tip = 'M-2.6 14.4H2.6L1.6 16.4H-1.6Z'
  let fil = 'M-4.8 -12.6'
  for (let i = 0; i < 6; i++) fil += `q.8 -1.8 1.6 0`
  return (
    k.draw([
      {
        d: glass, fill: '#FFFBEA',
        inner:
          k.shade(glass, k.rad(P.goldL, 0.5, 0.56, 0.55, 1, 0.1), P.gold, 0.5) + k.sh(glass, 0, 0, 1, 1, 0.1, 0.6, PC_L, 0.35) +
          `<path d="M-2.2 3V-5.4M2.2 3V-5.4" stroke="${PC_D}" stroke-width=".5"/><path d="M-2.2 -5.4L-4.8 -12.6M2.2 -5.4L4.8 -12.6" stroke="${P.ink}" stroke-width=".4"/>` +
          `<path d="M-2.8 3C-2.8 -1 -2 -3 0 -3.4C2 -3 2.8 -1 2.8 3" fill="#fff" opacity=".6" stroke="${PC_L}" stroke-width=".35"/>` +
          `<path d="${fil}" fill="none" stroke="${P.goldD}" stroke-width=".9"/><path d="${fil}" fill="none" stroke="#fff" stroke-width=".35"/>` +
          hair(-10.6, -18, -11.4, -12, -8.6, -6, 1.1, '#fff', 0.95) + hair(-6, -24.4, -3, -25.6, 0, -25.6, 0.7, '#fff', 0.8),
      },
      {
        d: base, fill: P.sky1,
        inner: k.sh(base, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + [5, 7.4, 9.8, 12].map((y) => `<path d="M-7 ${y}L7 ${f(y - 1.6)}" stroke="${P.mid}" stroke-width=".55"/>`).join('') + hair(-5.4, 4.6, -5.6, 8, -5, 11.6, 0.6, '#fff'),
      },
      { d: tip, fill: P.gold, inner: k.sh(tip, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
    ], 0.65)
  )
}

/** Abeja de verdad vista desde arriba, mirando hacia arriba, centrada en el tórax (0,0). */
function bee(k: Kit) {
  const wing = 'M0 0C-3 -4 -9 -6 -12 -4C-13.6 -2.6 -12 0 -8 .8C-5 1.4 -2 1 0 0Z'
  const abd = 'M0 1.6C3 1.6 4.2 5 4 8.6C3.8 12 2 14.6 0 15.6C-2 14.6 -3.8 12 -4 8.6C-4.2 5 -3 1.6 0 1.6Z'
  return (
    k.draw([
      { d: abd, fill: STRAW, inner: `<path d="M-5 6H5V7.8H-5ZM-5 9.8H5V11.6H-5ZM-5 13.4H5V15H-5Z" fill="${HAT}"/>` + k.sh(abd, 0, 0, 1, 0, 0, 0.8, STRAW_D, 0.45) },
      { d: ellipse(0, 0, 2.8, 2.6), fill: '#8A5A1E', inner: k.sh(ellipse(0, 0, 2.8, 2.6), 0, 0, 1, 1, 0, 0.9, HAT, 0.5) },
      { d: ellipse(0, -3.6, 1.9, 1.5), fill: HAT },
    ], 0.5) +
    `<path d="M-.6 -4.8C-1.4 -6.4 -2.6 -7.2 -3.6 -7.2M.6 -4.8C1.4 -6.4 2.6 -7.2 3.6 -7.2" fill="none" stroke="${P.paper}" stroke-width=".5" stroke-linecap="round"/>` +
    [1, -1].map((s) => `<g transform="scale(${s} 1)"><path d="${wing}" fill="#fff" opacity=".8" stroke="${P.ink}" stroke-width=".45"/><path d="M-1 0C-4 -2 -7 -3.4 -10.6 -3.4" fill="none" stroke="${P.blue}" stroke-width=".3"/></g>`).join('')
  )
}

export const PISTASCRUZADAS_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Mentes conectadas ──────────────────────────────────────────────

  // Primera grilla ganada en equipo: piensan parecido, qué miedo. Dos lamparitas, un solo cable, la misma idea.
  'Dos cabezas': (u) => {
    const k = kit(u)
    const cordL = 'M40.6 74.4C42 84 54 86 58.4 92Q61.6 95 58.4 98Q55.2 101 58.4 104'
    const cordR = 'M79.4 74.4C78 84 66 86 61.6 92Q58.4 95 61.6 98Q64.8 101 61.6 104'
    return (
      graph(k) +
      stageB(k, 60, 58, 34) +
      glow(k, 45, 46, 22, 22, 0.8) + glow(k, 75, 46, 22, 22, 0.8) + glow(k, 60, 34, 16, 12, 0.9, '#fff') +
      cord(cordL, PC, 1.3) + cord(cordR, PC, 1.3) +
      `<g transform="translate(45 58) rotate(16)">` + bulb(k) + `</g>` +
      `<g transform="translate(75 58) rotate(-16)">` + bulb(k) + `</g>` +
      // La chispa compartida.
      [-150, -120, -90, -60, -30].map((a) => { const r = (a * Math.PI) / 180; return hair(60 + Math.cos(r) * 4.4, 30 + Math.sin(r) * 4.4, 60 + Math.cos(r) * 6.4, 30 + Math.sin(r) * 6.4, 60 + Math.cos(r) * 8.6, 30 + Math.sin(r) * 8.6, 0.7, P.goldD) }).join('') +
      `<path d="${starPath(60, 33, 3.6, 1.3, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(32, 40, 1.8, P.goldD) + sparkle(88, 40, 1.8, P.goldD) + sparkle(88, 76, 1.4, '#fff') +
      k.defs()
    )
  },

  // Cinco victorias: se pasan las ideas sin contraseña. El bombín con antena y el candado abierto.
  'Wi-Fi mental': (u) => {
    const k = kit(u)
    const crown = 'M-14 -2C-15 -12 -10 -22 0 -22C10 -22 15 -12 14 -2Z'
    const band = 'M-14.1 -2.2C-14.4 -4 -14.4 -5.6 -14.1 -7C-6 -4.8 6 -4.8 14.1 -7C14.4 -5.6 14.4 -4 14.1 -2.2C6 .2 -6 .2 -14.1 -2.2Z'
    const brim = 'M-21 0C-21.4 -3 -17.6 -3.6 -14 -2C-6 1 6 1 14 -2C17.6 -3.6 21.4 -3 21 0C20.6 3.4 12 5.6 0 5.6C-12 5.6 -20.6 3.4 -21 0Z'
    const arc = (r: number) => { const a0 = (-140 * Math.PI) / 180, a1 = (-40 * Math.PI) / 180; return `M${f(Math.cos(a0) * r)} ${f(-38 + Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f(Math.cos(a1) * r)} ${f(-38 + Math.sin(a1) * r)}` }
    const lockBody = roundRect(-5.4, -4.6, 5.4, 4.6, 1.2)
    return (
      graph(k) +
      stageB(k, 60, 60, 34) +
      glow(k, 58, 40, 24, 22, 0.8) +
      k.floor(60, 90.4, 24, 3, PC_D) +
      `<g transform="translate(58 82) scale(1.12)">` +
      // La antena, con las ondas que salen.
      `<path d="M0 -21V-36" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M0 -21V-36" stroke="${P.sky1}" stroke-width=".7" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-37.4" r="1.7" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.5" cy="-37.9" r=".45" fill="#fff"/>` +
      cord(arc(4.4), PC, 1.2) + cord(arc(8), PC, 1.2) + cord(arc(11.6), PC, 1.2) +
      k.cast([crown, brim], 2, 2, PC_D) +
      k.draw([
        { d: crown, fill: HAT, inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, '#000', 0.5) + `<path d="M-16 -24H-4V0H-16Z" fill="${k.lin(HAT_L, 0, 0, 1, 0, 0.95, 0)}"/>` + hair(-9, -6, -9.6, -14, -5, -19.6, 0.9, '#8C97B8', 0.8) + hair(4, -20, 8, -18, 10.6, -13, 0.5, PC, 0.6) },
        { d: band, fill: PC, inner: k.sh(band, 0, 0, 1, 0, 0, 0.85, PC_D, 0.5) + `<path d="M-14 -4.6C-6 -2.4 6 -2.4 14 -4.6" fill="none" stroke="${PC_L}" stroke-width=".4"/>` },
        { d: brim, fill: HAT, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, '#000', 0.5) + hair(-18, 1, -10, 3.6, 0, 3.8, 0.6, '#8C97B8', 0.8) },
      ], 0.7) +
      `<path d="M10.6 -5.4L12.4 -2.6L13.6 -6.2" fill="${PC}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      // El candado abierto: sin contraseña.
      `<g transform="translate(85 80) rotate(8)">` +
      `<path d="M-3.4 -4.4V-9C-3.4 -12.6 3.4 -12.6 3.4 -9V-7.6" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round" transform="rotate(-28 -3.4 -4.4)"/>` +
      `<path d="M-3.4 -4.4V-9C-3.4 -12.6 3.4 -12.6 3.4 -9V-7.6" fill="none" stroke="${P.sky1}" stroke-width="1.3" stroke-linecap="round" transform="rotate(-28 -3.4 -4.4)"/>` +
      k.draw([{ d: lockBody, fill: P.gold, inner: k.sh(lockBody, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-5.4 -2H5.4M-5.4 2H5.4" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.55) +
      `<circle cx="0" cy="-.6" r="1.1" fill="${P.ink}"/><path d="M-.5 0L-.7 2.4H.7L.5 0Z" fill="${P.ink}"/>` +
      `</g>` +
      sparkle(84, 34, 2, P.goldD) + sparkle(32, 44, 1.6, P.goldD) + sparkle(34, 76, 1.4, '#fff') +
      k.defs()
    )
  },

  // Quince grillas ganadas: ya son un solo cerebro con muchas patas. La colmena de paja, con las abejas en formación.
  'Colmena': (u) => {
    const k = kit(u)
    const top = 36, base = 84, W = 23
    const w = (y: number) => { const t = (base - y) / (base - top); return W * Math.sqrt(Math.max(0, 1 - Math.pow(t, 2.6))) }
    const N = 30
    const ys = Array.from({ length: N + 1 }, (_, i) => top + ((base - top) * i) / N)
    const skep = `M${ys.map((y) => `${f(60 - w(y))} ${f(y)}`).join('L')}L${ys.slice().reverse().map((y) => `${f(60 + w(y))} ${f(y)}`).join('L')}Z`
    const bands = Array.from({ length: 8 }, (_, i) => 42.4 + i * 5.4)
    const coils = bands.map((y) => `M${f(60 - w(y))} ${f(y)}Q60 ${f(y + 2.6)} ${f(60 + w(y))} ${f(y)}`).join('')
    const straw = bands.map((y, i) => {
      const hw = w(y + 2.6), n = Math.max(3, Math.round(hw / 2.4))
      return Array.from({ length: n * 2 }, (_, j) => {
        const x = 60 - hw + 1.6 + (j * (hw * 2 - 3.2)) / (n * 2 - 1), dy = 2.6 * (1 - Math.pow((x - 60) / (hw + 0.1), 2)) * 0.9
        return hair(x - 0.8, y + dy + 0.6, x, y + dy + 2.2, x + 0.8 - (i % 2) * 1.6, y + dy + 4, 0.4, STRAW_D, 0.8)
      }).join('')
    }).join('')
    const stitches = bands.map((y, i) => [-0.5, 0.2, 0.62].map((t) => { const x = 60 + t * w(y) * 1.4 * (i % 2 ? 1 : -0.8); return `<path d="M${f(x)} ${f(y - 1.4 + 2.2)}V${f(y + 2.6)}" stroke="${P.brownD}" stroke-width=".7" stroke-linecap="round"/>` }).join('')).join('')
    const door = 'M54.6 84V80.6C54.6 78.6 57 77.6 60 77.6C63 77.6 65.4 78.6 65.4 80.6V84Z'
    const board = 'M32 84H88L86 88.6H34Z'
    const knob = 'M57.6 36.6C57.6 34.4 58.6 33 60 33C61.4 33 62.4 34.4 62.4 36.6Z'
    return (
      nightB(k, 0.5, 0.5) +
      stars([[30, 38, 0.5], [88, 30, 0.45], [94, 56, 0.4], [26, 62, 0.4], [76, 22, 0.35], [44, 24, 0.4]]) +
      k.sun(60, 60, 22, 50, 36, false) +
      glow(k, 60, 60, 32, 32, 0.7) +
      laurel(48, 99, 28, 92, 26, 66, 7) + laurel(72, 99, 92, 92, 94, 66, 7, true) +
      `<g transform="translate(60 86) scale(.88) translate(-60 -86)">` +
      k.floor(60, 88.6, 28, 2.6, '#000') +
      k.draw([{ d: board, fill: P.brown, inner: k.sh(board, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + hair(36, 86, 60, 85.4, 84, 86, 0.5, P.goldL, 0.7) }], 0.6) +
      k.cast([skep], 2.4, 2.2, '#000') +
      k.draw([
        { d: knob, fill: STRAW, inner: k.sh(knob, 0, 0, 1, 0, 0, 0.9, STRAW_D, 0.5) },
        {
          d: skep, fill: STRAW,
          inner:
            straw + `<path d="${coils}" fill="none" stroke="${P.brownD}" stroke-width=".8"/>` + `<path d="${coils}" fill="none" stroke="${P.goldL}" stroke-width=".4" transform="translate(0 -.9)"/>` + stitches +
            k.sh(skep, 0, 0, 1, 0, 0.05, 0.9, STRAW_D, 0.5) + `<path d="M36 34H50V86H36Z" fill="${k.lin('#fff', 0, 0, 1, 0, 0.45, 0)}"/>` + k.sh('M30 76H90V86H30Z', 0, 0, 0, 1, 0, 0.6, P.brownD, 0.35),
        },
      ], 0.8) +
      `<path d="${door}" fill="#2A1A0A" stroke="${P.ink}" stroke-width=".6"/><path d="M56 81C57 79.4 59 79 60.6 79.2" fill="none" stroke="${STRAW_D}" stroke-width=".5"/>` +
      `<path d="M58 84C57.6 86 58.6 87.4 59.6 88" fill="none" stroke="${P.gold}" stroke-width="1.4" stroke-linecap="round"/>` +
      `</g>` +
      // Las abejas, iguales y en fila: un solo cerebro.
      [[31.4, 64], [34.6, 52.4], [40.6, 42]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(28) scale(.66)">${bee(k)}</g>`).join('') +
      `<path d="M30 74C28 70 28.4 68 30 66M33 62C31.4 58.6 32 56.6 33.6 54.6M37.6 51C37 47.6 38 45.6 40 44" fill="none" stroke="${PC_L}" stroke-width=".5" stroke-dasharray="1 1.1" stroke-linecap="round"/>` +
      sparkle(84, 40, 2.4, '#fff') + sparkle(88, 70, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Grilla llena ───────────────────────────────────────────────────

  // Dieciséis cartas en su lugar: tocado y hundido. El acorazado se va a pique en el mar cuadriculado, con la clavija roja.
  'Batalla naval': (u) => {
    const k = kit(u)
    const SEA = 72
    const sea = `M0 ${SEA}C14 ${SEA - 1.6} 24 ${SEA + 1.4} 36 ${SEA}C48 ${SEA - 1.6} 60 ${SEA + 1.4} 72 ${SEA}C84 ${SEA - 1.6} 96 ${SEA + 1.4} 120 ${SEA}V130H0Z`
    let gridD = ''
    for (let i = 0; i < 11; i++) gridD += `M0 ${f(SEA + 2 + i * 6)}H120`
    for (let i = 0; i < 21; i++) gridD += `M${i * 6} ${SEA}V130`
    const hull = 'M-27 -1.4L28 -3L22.4 6.4H-23Z'
    const deck = 'M-11 -1.6V-6.4H-4.6V-10.4H4.4V-6.4H10.4V-2Z'
    const funnel = 'M-2.4 -10.4L-1.6 -16H2.4L3 -10.4Z'
    const turret = (x: number, dir: number) => `<path d="M${x - 3.4} -1.6C${x - 3.4} -4 ${x + 3.4} -4 ${x + 3.4} -1.6Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".5"/><path d="M${x + dir * 2} -3L${x + dir * 9} -4.2" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>`
    const ports = [-16, -12, -8, -4, 0, 4, 8, 12, 16].map((x) => `<circle cx="${x}" cy="1.4" r=".55" fill="${P.ink}"/>`).join('')
    const peg = 'M-1.8 0V-7.4C-1.8 -9.2 1.8 -9.2 1.8 -7.4V0Z'
    const ship =
      k.draw([
        { d: funnel, fill: P.sky2, inner: `<path d="M-2.2 -13.6H2.8V-12.4H-2H-2.2Z" fill="${P.red}"/>` + k.sh(funnel, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) },
        { d: deck, fill: P.sky1, inner: k.sh(deck, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M-9 -4.4H-6M-3 -8.4H3M5.6 -4.4H9" stroke="${P.ink}" stroke-width=".6"/>` },
        { d: hull, fill: '#8A98B8', inner: `<path d="M-30 2.6H30V8H-30Z" fill="${P.red}" opacity=".85"/>` + k.sh(hull, 0, 0, 0, 1, 0, 0.8, P.mid, 0.45) + ports + hair(-22, -0.6, 0, -1.2, 24, -2, 0.5, '#fff', 0.8) },
      ], 0.6) +
      turret(-17, -1) + turret(16, 1) +
      `<path d="M5.6 -10.4V-20M2.6 -17H8.6" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="M-16 -3L-24 -3.6" stroke="${P.ink}" stroke-width=".5"/>`
    return (
      graph(k) +
      k.shade(`M0 0H120V${SEA}H0Z`, k.lin(PC_L, 0, 0, 0, 1, 0, 0.6), PC_L, 0.35) +
      // El humo del impacto.
      `<path d="M58 44C52 40 54 32 60 32C60 26 68 24 71 29C76 26 82 30 80 36C84 38 82 44 77 44Z" fill="#5C6684" opacity=".35"/>` +
      `<g transform="translate(62 67) rotate(-20)">` + k.cast([hull], 1.6, 2, PC_D) + ship +
      // La clavija roja: tocado.
      `<g transform="translate(3.4 -2) rotate(10)">` + k.draw([{ d: peg, fill: P.red, inner: k.sh(peg, 0, 0, 1, 0, 0, 0.9, P.wine, 0.5) + `<path d="M-1 -7.6V-1" stroke="#fff" stroke-width=".5" opacity=".8"/>` }], 0.55) + `</g>` +
      `</g>` +
      // El mar: la grilla del tablero.
      k.draw([{ d: sea, fill: PC, inner: `<path d="${gridD}" stroke="${PC_L}" stroke-width=".55" opacity=".7"/>` + k.sh(sea, 0, 0, 0, 1, 0, 0.8, PC_D, 0.5) + hair(10, SEA + 1, 26, SEA + 1.8, 40, SEA + 0.6, 0.6, '#fff', 0.9) + hair(76, SEA + 0.8, 90, SEA + 1.8, 104, SEA + 0.6, 0.6, '#fff', 0.9) }], 0.6) +
      // Salpicadura donde se hunde la popa.
      [[30, 66, 1.2], [27, 62, 0.9], [34, 61, 1], [24, 68, 0.8], [37, 66.4, 0.8], [31, 57.6, 0.7]].map(([x, y, r]) => `<path d="M${x} ${f(y - r * 2)}C${f(x + r)} ${f(y - r * 0.4)} ${f(x + r)} ${f(y + r)} ${x} ${f(y + r)}C${f(x - r)} ${f(y + r)} ${f(x - r)} ${f(y - r * 0.4)} ${x} ${f(y - r * 2)}Z" fill="#fff" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      hair(22, 71.4, 30, 69, 40, 71, 0.8, '#fff') +
      `<path d="M44 80C50 78.6 56 78.6 62 80M70 84C76 82.6 82 82.6 88 84" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>` +
      `<path d="${starPath(63.4, 52, 4, 1.4, 8)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(88, 40, 2, '#fff') + sparkle(32, 40, 1.6, PC) +
      k.defs()
    )
  },

  // Veintiuna cartas: ya lo hacés en birome y sin borrar. El crucigrama del diario, lleno, y la birome.
  'Crucigrama de Clarín': (u) => {
    const k = kit(u)
    const rows = ['CRUZ#AS', 'A#NA#LO', 'SOL#PEZ', 'A#AMOR#', '#TE#MAR', 'LUNA#IR', 'OS#ASES']
    const c = 5.6, x0 = 39, y0 = 40
    const grid = rows.map((r, i) => r.split('').map((ch, j) => {
      const x = x0 + j * c, y = y0 + i * c
      return ch === '#'
        ? `<rect x="${f(x)}" y="${f(y)}" width="${c}" height="${c}" fill="${P.ink}"/>`
        : `<text x="${f(x + c / 2)}" y="${f(y + c * 0.78)}" ${GEORGIA} font-style="italic" font-size="4.2" fill="${PC_D}" text-anchor="middle">${ch}</text>`
    }).join('')).join('')
    let lines = ''
    for (let i = 0; i <= 7; i++) lines += `M${x0} ${f(y0 + i * c)}H${f(x0 + 7 * c)}M${f(x0 + i * c)} ${y0}V${f(y0 + 7 * c)}`
    const page = 'M14 22L104 14L110 112L20 120Z'
    const col = (x: number, yA: number, yB: number) => Array.from({ length: Math.floor((yB - yA) / 2.6) }, (_, i) => `M${x} ${f(yA + i * 2.6)}H${x + 9 - (i % 4 === 3 ? 4 : 0)}`).join('')
    // La birome: punta de bronce, caño transparente con el tubito de tinta y la tapita azul.
    const barrel = 'M7 -2.4H34V2.4H7Z', cone = 'M0 0L7 -2.4V2.4Z', plug = 'M34 -2.1H37V2.1H34Z'
    const cap = 'M37 -2.6H46C47.4 -2.6 47.4 2.6 46 2.6H37Z'
    return (
      `<rect width="120" height="130" fill="${PC_XL}"/>` +
      `<g transform="rotate(-5 60 64)">` +
      k.draw([{
        d: page, fill: '#F2EEE3',
        inner:
          k.shade(page, k.rad('#C9C2AE', 0.5, 0.5, 0.7, 0, 1), '#B9B19A', 0.4) +
          `<path d="${col(24, 34, 112)}${col(86, 34, 112)}${col(39, 86, 112)}${col(51, 86, 112)}${col(63, 86, 112)}${col(75, 86, 112)}" stroke="#9A9688" stroke-width=".7"/>` +
          `<path d="M18 30H104" stroke="${P.ink}" stroke-width=".6"/>` +
          `<text x="60" y="35.6" ${GEORGIA} font-weight="700" font-size="4" fill="${P.ink}" text-anchor="middle" letter-spacing=".8">CRUCIGRAMA</text>`,
      }], 0.6) +
      k.draw([{ d: `M${x0} ${y0}H${f(x0 + 7 * c)}V${f(y0 + 7 * c)}H${x0}Z`, fill: P.white, inner: grid + `<path d="${lines}" stroke="${P.ink}" stroke-width=".35"/>` + k.sh(`M${x0} ${y0}H${f(x0 + 7 * c)}V${f(y0 + 7 * c)}H${x0}Z`, 0, 0, 1, 1, 0, 0.35, P.blue, 0.25) }], 0.55) +
      `</g>` +
      // La birome, apoyada, recién terminada la última palabra.
      `<g transform="translate(61.6 70.6) rotate(-40)">` +
      k.cast([`M0 0L7 -2.4H46V2.4H7Z`], 1.8, 2, PC_D) +
      k.draw([
        { d: cone, fill: P.gold, inner: k.sh(cone, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) },
        {
          d: barrel, fill: '#EAF3FC',
          inner: `<path d="M7 -.8H34V.8H7Z" fill="${PC_XL}" stroke="${PC_L}" stroke-width=".3"/><path d="M7 -.5H22V.5H7Z" fill="${PC}"/>` +
            `<path d="M7 -2.4H34V-1.2H7Z" fill="#fff" opacity=".9"/><path d="M7 1.4H34V2.4H7Z" fill="${PC_L}" opacity=".6"/>` + `<path d="M7 -1.2H34M7 1.4H34" stroke="${PC_L}" stroke-width=".3"/>` +
            `<circle cx="20" cy="-1.8" r=".6" fill="${PC_L}"/>`,
        },
        { d: plug, fill: PC, inner: k.sh(plug, 0, 0, 0, 1, 0, 0.8, PC_D, 0.4) },
        { d: cap, fill: PC, inner: k.sh(cap, 0, 0, 0, 1, 0, 0.9, PC_D, 0.5) + `<path d="M38 -1.6H45" stroke="#fff" stroke-width=".5" opacity=".7"/>` },
      ], 0.5) +
      cord('M39 -3.2H46.4', PC, 0.8) +
      `<circle cx="0" cy="0" r=".55" fill="${PC_D}"/>` +
      `</g>` +
      `<path d="M55.6 72.6C57.4 73.6 59.4 73 61 71.4" fill="none" stroke="${PC_D}" stroke-width=".55" stroke-linecap="round"/>` +
      sparkle(86, 46, 2.2, '#fff') + sparkle(34, 86, 1.6, '#fff') +
      k.defs()
    )
  },

  // Las veinticinco cartas ubicadas: grilla perfecta, foto y cuadro. La grilla llena, en su marco dorado, en la pared.
  'Pleno al 25': (u) => {
    const k = kit(u)
    const X0 = 36, Y0 = 34, S = 48, T = 6.6
    const outer = `M${X0} ${Y0}H${X0 + S}V${Y0 + S}H${X0}Z`
    const inner = `M${X0 + T} ${Y0 + T}H${X0 + S - T}V${Y0 + S - T}H${X0 + T}Z`
    const frame = `${outer}${`M${X0 + T} ${Y0 + T}V${Y0 + S - T}H${X0 + S - T}V${Y0 + T}Z`}`
    const g = (S - 2 * T) / 5
    const cells = Array.from({ length: 25 }, (_, i) => {
      const r = Math.floor(i / 5), c = i % 5, x = X0 + T + c * g, y = Y0 + T + r * g
      const d = roundRect(f(x + 0.5), f(y + 0.5), f(x + g - 0.5), f(y + g - 0.5), 0.6)
      return `<path d="${d}" fill="${(r + c) % 2 ? PC : '#2E8EE2'}" stroke="${PC_D}" stroke-width=".35"/>` +
        `<path d="M${f(x + 1.6)} ${f(y + g * 0.52)}L${f(x + g * 0.42)} ${f(y + g - 1.8)}L${f(x + g - 1.4)} ${f(y + 1.6)}" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"/>`
    }).join('')
    const beads = (x1: number, y1: number, x2: number, y2: number, n: number) => Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n; return `<circle cx="${f(x1 + (x2 - x1) * t)}" cy="${f(y1 + (y2 - y1) * t)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    const bi = X0 + T - 1.1, be = X0 + S - T + 1.1, by = Y0 + T - 1.1, bz = Y0 + S - T + 1.1
    const corner = (x: number, y: number, r: number) =>
      `<g transform="translate(${x} ${y}) rotate(${r})">` +
      `<path d="M0 0C3 -1 6 0 7.4 2.4C5.4 1.8 3.4 2.4 2.4 4C2 5.6 2.6 7 4 7.4C1.4 7.6 -1 5.4 0 0Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M1 1.2C2.6 1 4.2 1.6 5.4 2.6M1.2 1.4C1.2 3 1.8 4.6 2.8 5.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/><circle cx="1.6" cy="1.6" r="1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/></g>`
    const plaque = 'M52.6 79.4H67.4V85.4H52.6Z'
    return (
      nightB(k, 0.46, 0.56) +
      k.sun(60, 58, 28, 52, 40, false) +
      glow(k, 60, 52, 34, 30, 0.7) +
      // El clavo y el hilo del cuadro.
      `<path d="M44 ${Y0 + 3}L60 22.6L76 ${Y0 + 3}" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="M44 ${Y0 + 3}L60 22.6L76 ${Y0 + 3}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` +
      `<circle cx="60" cy="22.4" r="1.6" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.cast([outer], 2.6, 2.8, '#030B1C') +
      `<path d="${inner}" fill="${PC_N}"/>` + cells + k.shade(inner, k.lin('#000', 0, 0, 1, 1, 0.35, 0), '#000', 0.3) +
      k.draw([{
        d: frame, fill: P.gold,
        inner:
          k.sh(outer, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) +
          `<path d="M${X0} ${Y0}L${X0 + T} ${Y0 + T}H${X0 + S - T}L${X0 + S} ${Y0}Z" fill="${P.goldL}" opacity=".75"/><path d="M${X0} ${Y0}L${X0 + T} ${Y0 + T}V${Y0 + S - T}L${X0} ${Y0 + S}Z" fill="${P.goldL}" opacity=".45"/>` +
          `<path d="M${X0 + S} ${Y0}L${X0 + S - T} ${Y0 + T}V${Y0 + S - T}L${X0 + S} ${Y0 + S}ZM${X0} ${Y0 + S}L${X0 + T} ${Y0 + S - T}H${X0 + S - T}L${X0 + S} ${Y0 + S}Z" fill="${P.goldD}" opacity=".45"/>` +
          `<path d="M${X0} ${Y0}L${X0 + T} ${Y0 + T}M${X0 + S} ${Y0}L${X0 + S - T} ${Y0 + T}M${X0} ${Y0 + S}L${X0 + T} ${Y0 + S - T}M${X0 + S} ${Y0 + S}L${X0 + S - T} ${Y0 + S - T}" stroke="${P.goldD}" stroke-width=".5"/>` +
          `<path d="M${X0 + 2.2} ${Y0 + 2.2}H${X0 + S - 2.2}V${Y0 + S - 2.2}H${X0 + 2.2}Z" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
          // Hojas de acanto a lo largo del marco.
          Array.from({ length: 9 }, (_, i) => {
            const t = X0 + 7 + i * 4.25
            return hair(t, Y0 + 3.4, t + 1.2, Y0 + 1.8, t + 2.6, Y0 + 3, 0.5, P.goldD) + hair(t, Y0 + S - 3.4, t + 1.2, Y0 + S - 1.8, t + 2.6, Y0 + S - 3, 0.5, P.goldD) +
              hair(X0 + 3.4, t, X0 + 1.8, t + 1.2, X0 + 3, t + 2.6, 0.5, P.goldD) + hair(X0 + S - 3.4, t, X0 + S - 1.8, t + 1.2, X0 + S - 3, t + 2.6, 0.5, P.goldD)
          }).join(''),
      }], 0.85) +
      beads(bi, by, be, by, 16) + beads(bi, bz, be, bz, 16) + beads(bi, by, bi, bz, 16) + beads(be, by, be, bz, 16) +
      corner(X0 - 1.6, Y0 - 1.6, 0) + corner(X0 + S + 1.6, Y0 - 1.6, 90) + corner(X0 + S + 1.6, Y0 + S + 1.6, 180) + corner(X0 - 1.6, Y0 + S + 1.6, 270) +
      // La chapita con el número.
      k.draw([{ d: plaque, fill: P.goldL, inner: k.sh(plaque, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) }], 0.45) +
      `<text x="60" y="84" ${GEORGIA} font-weight="700" font-size="5" fill="${P.ink}" text-anchor="middle">25</text>` +
      `<circle cx="53.8" cy="82.4" r=".45" fill="${P.goldD}"/><circle cx="66.2" cy="82.4" r=".45" fill="${P.goldD}"/>` +
      sparkle(84, 30, 2.4, '#fff') + sparkle(32, 88, 1.6, P.goldL) + sparkle(42, 38, 2, '#fff') +
      k.defs()
    )
  },

  // ── Telepatía ──────────────────────────────────────────────────────

  // Cinco pistas al toque: la cucharita doblada con la mente, y las ondas que la torcieron.
  'Cucharita doblada': (u) => {
    const k = kit(u)
    const handle = 'M-1.1 0L-1.7 25.4C-3.9 27.6 -4.1 33 0 34.8C4.1 33 3.9 27.6 1.7 25.4L1.1 0Z'
    const bowl = 'M0 1.4C-1 -.6 -5.6 -4 -5.6 -10.6C-5.6 -16.4 -2.8 -19.6 0 -19.6C2.8 -19.6 5.6 -16.4 5.6 -10.6C5.6 -4 1 -.6 0 1.4Z'
    const wave = (r: number) => `M${f(30 + Math.cos(-0.2) * r)} ${f(40 + Math.sin(-0.2) * r)}A${r} ${r} 0 0 1 ${f(30 + Math.cos(1.1) * r)} ${f(40 + Math.sin(1.1) * r)}`
    return (
      graph(k) +
      stageB(k, 60, 60, 34) +
      glow(k, 60, 56, 30, 28, 0.6) +
      // Las ondas de la mente, que llegan desde arriba a la izquierda.
      [12, 18, 24].map((r, i) => `<path d="${wave(r)}" fill="none" stroke="${PC}" stroke-width="${1.4 - i * 0.3}" stroke-dasharray="${i ? '2 1.6' : '0'}" stroke-linecap="round" opacity="${1 - i * 0.2}"/>`).join('') +
      k.floor(62, 93, 18, 2.6, PC_D) +
      `<g transform="translate(58 58) rotate(-8)">` +
      k.cast([handle], 1.8, 2, PC_D) +
      k.draw([{
        d: handle, fill: P.sky1,
        inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + hair(-0.6, 3, -0.9, 14, -0.8, 24, 0.6, '#fff') +
          `<path d="M0 26.6C-1.8 28.6 -1.8 31.6 0 32.8C1.8 31.6 1.8 28.6 0 26.6Z" fill="none" stroke="${P.blue}" stroke-width=".45"/><circle cx="0" cy="29.8" r=".7" fill="${PC}"/>` +
          hair(-1, 21, -0.4, 23, 0, 25, 0.4, P.blue),
      }], 0.6) +
      // El cuello torcido: la cuchara se dobló para la derecha.
      `<g transform="rotate(58)">` +
      k.cast([bowl], 1.8, 2, PC_D) +
      k.draw([{
        d: bowl, fill: P.sky1,
        inner: k.sh(bowl, 0, 0, 1, 1, 0, 0.9, P.blue, 0.5) + `<path d="${ellipse(0.6, -10.4, 3.6, 6.8)}" fill="${P.sky}" opacity=".6"/>` + hair(-3.6, -14, -3.8, -10, -2.4, -5.6, 0.9, '#fff') + `<ellipse cx="-2" cy="-15" rx="1" ry="1.8" fill="#fff" opacity=".9"/>`,
      }], 0.6) +
      `</g>` +
      `<circle cx="0" cy="0" r="1.6" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      hair(64, 52, 67, 50, 70, 51, 0.6, PC_D) + hair(62.6, 56, 66.4, 56, 69, 58, 0.6, PC_D) +
      sparkle(60.6, 57.4, 3.4, '#fff') + sparkle(88, 40, 2, PC) + sparkle(34, 80, 1.6, P.goldD) +
      k.defs()
    )
  },

  // Veinte pistas adivinadas sin dudar: ya ven el futuro. El turbante con joya y pluma, sobre la bola de cristal.
  'Turbante de adivino': (u) => {
    const k = kit(u)
    const ball = ellipse(60, 70, 14.4, 14.4)
    const stand = 'M48.6 82C50 85 52 86.4 53.6 86.6L51 92.4H69L66.4 86.6C68 86.4 70 85 71.4 82C67 85.4 53 85.4 48.6 82Z'
    const turban = 'M36.6 58C35 46 44 34.6 60 34.6C76 34.6 85 46 83.4 58C79 62.6 41 62.6 36.6 58Z'
    const folds = 'M38 54C46 44 58 40 72 41M37.4 48C46 40 56 37 66 37.6M44 59.6C52 50 64 45 80 47.6M54 61C62 54 72 51 82.6 53.4'
    const feather = taper(60.6, 45, 62, 34, 68.4, 22.6, 2.4, 4.6)
    return (
      graph(k) +
      k.sun(60, 58, 18, 48, 32, false) +
      glow(k, 60, 64, 28, 26, 0.7, '#fff') +
      k.floor(60, 92.6, 16, 2.4, PC_D) +
      k.draw([{ d: stand, fill: P.gold, inner: k.sh(stand, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M52.2 89.6H67.8" stroke="${P.goldD}" stroke-width=".4"/>` + hair(53, 88, 54, 86.6, 56, 86.4, 0.5, '#fff') }], 0.6) +
      // La bola de cristal, con la niebla del futuro adentro.
      k.draw([{
        d: ball, fill: PC_XL,
        inner:
          k.shade(ball, k.rad(PC_L, 0.5, 0.5, 0.5, 0.1, 0.95), PC_L, 0.5) +
          hair(50, 74, 56, 68, 64, 72, 1.2, '#fff', 0.85) + hair(54, 78, 62, 74, 70, 78, 0.9, '#fff', 0.7) + hair(56, 66, 62, 62, 68, 66, 0.7, PC, 0.6) +
          `<path d="${starPath(63, 73, 2.6, 0.9, 4)}" fill="${P.goldL}"/>` + k.sh(ball, 0, 0, 1, 1, 0.3, 0.9, PC, 0.35),
      }], 0.7) +
      hair(48.6, 66, 49.4, 61, 53.4, 58.6, 1.2, '#fff', 0.95) +
      // El turbante: tela azul enroscada, joya y pluma.
      k.cast([turban], 2, 2.4, PC_D) +
      k.draw([{ d: feather, fill: P.white, inner: k.sh(feather, 0, 0, 1, 1, 0, 0.7, PC_L, 0.45) + hair(61, 42, 63.6, 32, 67.6, 24, 0.5, PC_L) + [0, 1, 2, 3, 4].map((i) => hair(62 + i * 1.2, 40 - i * 3.4, 60.6 + i * 1.2, 38 - i * 3.4, 60 + i * 1.2, 36.4 - i * 3.4, 0.3, PC_L, 0.8)).join('') }], 0.5) +
      k.draw([{
        d: turban, fill: PC,
        inner:
          `<path d="${folds}" fill="none" stroke="${PC_D}" stroke-width="1.6" stroke-linecap="round"/>` + `<path d="${folds}" fill="none" stroke="${PC_L}" stroke-width=".6" stroke-linecap="round" transform="translate(-.4 -.9)"/>` +
          k.sh(turban, 0, 0, 1, 1, 0, 0.9, PC_N, 0.5) + `<path d="M34 34H52V62C46 60 40 58 34 56Z" fill="${k.lin('#fff', 0, 0, 1, 1, 0.45, 0)}"/>` +
          `<path d="M37.6 57.6C46 60.6 74 60.6 82.4 57.6" fill="none" stroke="${P.gold}" stroke-width=".8"/>`,
      }], 0.75) +
      // La joya del frente.
      k.draw([{ d: starPath(60.4, 47.4, 6, 3.6, 8), fill: P.gold, inner: k.sh(starPath(60.4, 47.4, 6, 3.6, 8), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) +
      `<circle cx="60.4" cy="47.4" r="2.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><circle cx="59.6" cy="46.6" r=".7" fill="#fff"/>` +
      `<path d="M58.6 53.4L57.6 57.6M62.2 53.4L63.2 57.6" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/><circle cx="57.4" cy="58.2" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/><circle cx="63.4" cy="58.2" r=".8" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>` +
      sparkle(36, 76, 2, '#fff') + sparkle(86, 70, 1.8, P.goldD) + sparkle(84, 34, 1.6, '#fff') +
      k.defs()
    )
  },

  // Cincuenta pistas telepáticas: "¡Pero qué sorpresa!", diría Tusam. El televisor de antes con la espiral en la pantalla.
  'Señal de Tusam': (u) => {
    const k = kit(u)
    const cab = roundRect(31, 44, 89, 86, 4)
    const screen = 'M36.4 52C36.4 49.4 38 48.4 41 48.2C48 47.8 58 47.8 65 48.2C68 48.4 69.6 49.4 69.6 52V77C69.6 79.6 68 80.6 65 80.8C58 81.2 48 81.2 41 80.8C38 80.6 36.4 79.6 36.4 77Z'
    const panel = roundRect(73, 48, 85.6, 81, 1.4)
    const b = 1.15, TH = Math.PI * 9, N = 220
    const A = Array.from({ length: N + 1 }, (_, i) => { const t = (i / N) * TH; return `${f(53 + Math.cos(t) * b * t)} ${f(64.4 + Math.sin(t) * b * t * 0.92)}` })
    const B = Array.from({ length: N + 1 }, (_, i) => { const t = TH - (i / N) * TH; return `${f(53 + Math.cos(t) * b * (t + Math.PI))} ${f(64.4 + Math.sin(t) * b * (t + Math.PI) * 0.92)}` })
    const spiral = `M${A.join('L')}L${B.join('L')}Z`
    const knob = (y: number) => `<circle cx="79.3" cy="${y}" r="3.2" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".55"/><circle cx="79.3" cy="${y}" r="2.1" fill="none" stroke="${P.blue}" stroke-width=".45" stroke-dasharray=".5 .5"/><path d="M79.3 ${y}L80.8 ${f(y - 1.8)}" stroke="${P.ink}" stroke-width=".6"/><circle cx="78.4" cy="${f(y - 1)}" r=".6" fill="#fff"/>`
    const grill = Array.from({ length: 6 }, (_, i) => `<path d="M75.4 ${f(66 + i * 2.2)}H83.2" stroke="${P.brownD}" stroke-width=".7"/>`).join('')
    const signal = (x: number, y: number, s: number) => [3, 5.6, 8.2].map((r, i) => `<path d="M${f(x - r * 0.7 * s)} ${f(y - r * 0.7)}A${r} ${r} 0 0 ${s > 0 ? 1 : 0} ${f(x + r * 0.7 * s)} ${f(y - r * 0.7 + r * 0.02)}" fill="none" stroke="${P.goldL}" stroke-width="${f(0.9 - i * 0.15)}" stroke-linecap="round" opacity="${f(1 - i * 0.2)}" transform="rotate(${s * 40} ${x} ${y})"/>`).join('')
    const rid = k.id('tus')
    return (
      nightB(k, 0.5, 0.6) +
      k.sun(60, 62, 30, 52, 40, false) +
      glow(k, 60, 62, 34, 30, 0.6) +
      // La antena de conejo, con la señal.
      cord('M60 44L45.6 25', P.sky1, 0.9) + cord('M60 44L76.4 24', P.sky1, 0.9) +
      `<circle cx="45.4" cy="24.6" r="1.4" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/><circle cx="76.6" cy="23.6" r="1.4" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".45"/>` +
      signal(45.4, 24.6, -1) + signal(76.6, 23.6, 1) +
      `<path d="M54 44.6C54 41 56.6 39.6 60 39.6C63.4 39.6 66 41 66 44.6Z" fill="${HAT}" stroke="${P.ink}" stroke-width=".55"/>` +
      // Las patitas del mueble.
      `<path d="M38 86L35.4 93M82 86L84.6 93" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M38 86L35.4 93M82 86L84.6 93" stroke="${P.brown}" stroke-width="1.2" stroke-linecap="round"/>` +
      k.cast([cab], 2.4, 2.4, '#030B1C') +
      k.draw([{
        d: cab, fill: P.brown,
        inner:
          k.sh(cab, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M29 42H44V88H29Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` +
          hair(33, 46, 60, 45.2, 87, 46, 0.5, P.goldL, 0.8) + hair(33, 84, 60, 84.6, 87, 84, 0.5, P.brownD) +
          hair(32.6, 56, 33, 66, 32.6, 78, 0.5, P.brownD, 0.8),
      }], 0.85) +
      k.draw([{ d: panel, fill: '#D9C29A', inner: k.sh(panel, 0, 0, 1, 1, 0, 0.7, P.brown, 0.4) + grill }], 0.45) +
      knob(54) + knob(61.4) +
      // La pantalla, con la espiral que hipnotiza.
      `<path d="M35 50.8C35 47.6 37 46.6 40.6 46.4C48 46 58 46 65.4 46.4C69 46.6 71 47.6 71 50.8V78.2C71 81.4 69 82.4 65.4 82.6C58 83 48 83 40.6 82.6C37 82.4 35 81.4 35 78.2Z" fill="#C8B48C" stroke="${P.ink}" stroke-width=".6"/>` +
      k.draw([{
        d: screen, fill: '#E9F1FA',
        inner:
          `<path d="${spiral}" fill="${PC_N}"/>` + k.shade(screen, k.rad(PC_L, 0.5, 0.5, 0.6, 0.1, 0.9), PC, 0.4) +
          `<path d="M36 52H70M36 56H70M36 60H70M36 64H70M36 68H70M36 72H70M36 76H70" stroke="#fff" stroke-width=".3" opacity=".35"/>` +
          hair(39, 52, 38.4, 58, 39, 66, 1.1, '#fff', 0.9) + hair(42, 50.4, 46, 49.8, 52, 49.6, 0.7, '#fff', 0.8),
      }], 0.6) +
      // La cinta con el grito de guerra.
      k.draw([{ d: 'M33.6 88.6C44 91.4 76 91.4 86.4 88.6L85.4 95C76 97.6 44 97.6 34.6 95Z', fill: P.goldL, inner: k.sh('M33.6 88.6C44 91.4 76 91.4 86.4 88.6L85.4 95C76 97.6 44 97.6 34.6 95Z', 0, 0, 0, 1, 0, 0.7, P.goldD, 0.4) }], 0.5) +
      `<path d="M33.6 88.6L28 87.6L30.6 91.4L28.6 95L34.6 95ZM86.4 88.6L92 87.6L89.4 91.4L91.4 95L85.4 95Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
      `<path id="${rid}" d="M36 93.6C46 96 74 96 84 93.6" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="3.8" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">¡pero qué sorpresa!</textPath></text>` +
      sparkle(30, 40, 2.2, '#fff') + sparkle(92, 52, 1.6, P.goldL) +
      k.defs()
    )
  },
}
