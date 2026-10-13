// T.E.G., el plan táctico y estratégico de la guerra, en clave heroica. El verde de la ficha del juego es el color
// propio (fichas de ejército, lacre, continentes pintados, la aurora de Kamchatka) y el papel del día lleva su grano
// verde. A las personas reales (Maquiavelo, Napoleón, Gengis Kan, Atila) no se las dibuja: aparecen por sus objetos.
import { f } from '../helpers'
import { die, ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
/** Verde de la ficha del T.E.G., con su sombra, su luz y un verde pálido para reflejos. */
const TEG = '#2B8A3E', TEG_D = '#17532A', TEG_L = '#6FBF7E', TEG_XL = '#CFE8C6'
/** Tierra reseca (Atila) y piel de oso. */
const DRY = '#DDB97F', BEAR = '#7A5236', BEAR_D = '#432A19', BEAR_L = '#B08458'
/** Piel clara de gorro (borde del casco mongol y el gorro de Kamchatka). */
const FUR = '#D8CBB6', FUR_D = '#9A856A', FUR_L = '#F6EFE2'
const FULL = 'M0 0H120V130H0Z'

/** Papel del día con el borde granulado en el verde de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#A6CC9E', 0.5, 0.46, 0.7, 0, 1), '#8BB985', 0.5)

/** Noche de Kamchatka con la aurora verde y estrellas. */
function aurora(k: Kit) {
  const curtain = (y0: number, amp: number, h: number, ph: number, op: number) => {
    const bot: string[] = [], top: string[] = []
    for (let i = 0; i <= 26; i++) {
      const x = -4 + i * 5, w = Math.sin(i * 0.42 + ph) * amp + Math.sin(i * 0.17 + ph * 2) * amp * 0.6
      bot.push(`${f(x)} ${f(y0 + w)}`)
      top.push(`${f(x)} ${f(y0 + w - h - Math.sin(i * 0.8 + ph) * 3)}`)
    }
    const d = `M${bot.join('L')}L${top.reverse().join('L')}Z`
    const hem = `M${bot.join('L')}`
    const rays = Array.from({ length: 18 }, (_, i) => {
      const x = 4 + i * 6.4 + Math.sin(i * 2.3) * 1.6, j = Math.round((x + 4) / 5), w = Math.sin(j * 0.42 + ph) * amp + Math.sin(j * 0.17 + ph * 2) * amp * 0.6
      return hair(x, y0 + w - 0.6, x + 0.6, y0 + w - h * 0.5, x + 0.2, y0 + w - h * (0.7 + (i % 3) * 0.12), 0.7, TEG_XL, 0.35)
    }).join('')
    return `<path d="${d}" fill="${k.lin(TEG_L, 0, 0, 0, 1, 0, 0.85)}" opacity="${op}"/>` + k.shade(d, k.lin(TEG_L, 0, 0, 0, 1, 0, 0.5), TEG_L, 0.15) +
      rays + `<path d="${hem}" fill="none" stroke="${TEG_XL}" stroke-width=".7" opacity="${f(op * 0.8)}"/>`
  }
  const stars = [[30, 26, 0.6], [44, 21, 0.45], [78, 22, 0.55], [92, 34, 0.5], [26, 44, 0.4], [70, 30, 0.35], [52, 28, 0.35], [96, 52, 0.4], [86, 26, 0.3]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('')
  return k.night() + stars + curtain(50, 4, 24, 0.4, 0.75) + curtain(38, 3, 14, 2.1, 0.5)
}

/** Contorno irregular alrededor de (cx,cy): un círculo con ondas (lacre, polvo). */
function blob(cx: number, cy: number, r: number, amp: number, k1 = 7, N = 48) {
  let d = ''
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, rr = r + amp * Math.sin(a * k1) + amp * 0.6 * Math.sin(a * 3 + 1.3)
    d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr)
  }
  return d + 'Z'
}

/** Contorno suave (Catmull-Rom cerrado) por una lista de puntos. */
function smooth(pts: number[][], t = 1 / 6) {
  const n = pts.length
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    d += `C${f(p1[0] + (p2[0] - p0[0]) * t)} ${f(p1[1] + (p2[1] - p0[1]) * t)} ${f(p2[0] - (p3[0] - p1[0]) * t)} ${f(p2[1] - (p3[1] - p1[1]) * t)} ${p2[0]} ${p2[1]}`
  }
  return d + 'Z'
}

/** Borde de piel: mechones en punta alrededor de una elipse. */
function tufty(cx: number, cy: number, rx: number, ry: number, n: number, spike: number) {
  const at = (a: number, g: number) => `${f(cx + (rx + g) * Math.cos(a))} ${f(cy + (ry + g * (ry / rx) * 1.2) * Math.sin(a))}`
  let d = `M${at(0, 0)}`
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, j = spike * (1 + 0.3 * Math.sin(i * 2.7))
    d += `Q${at(a0 + (a1 - a0) * 0.2, j * 0.7)} ${at(a0 + (a1 - a0) * 0.75, j)}Q${at(a0 + (a1 - a0) * 0.85, j * 0.3)} ${at(a1, 0)}`
  }
  return d + 'Z'
}

/** Ficha de ejército del T.E.G.: un cilindrito verde con el canto acanalado. Base al centro en (x,y), radio r. */
function token(k: Kit, x: number, y: number, r: number, tilt = 0) {
  const h = f(r * 0.95), ry = f(r * 0.42)
  const side = `M${-r} ${-h}V0A${r} ${ry} 0 0 0 ${r} 0V${-h}Z`
  const top = ellipse(0, -h, r, ry)
  const grooves = Array.from({ length: 5 }, (_, i) => {
    const xx = -r + ((i + 1) * 2 * r) / 6, e = ry * Math.sqrt(1 - (xx / r) ** 2)
    return `<path d="M${f(xx)} ${f(-h + e)}V${f(e)}" stroke="${TEG_D}" stroke-width="${f(r * 0.07)}" opacity=".55"/>`
  }).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${tilt})">` +
    k.draw([
      { d: side, fill: TEG, inner: k.sh(side, 0, 0, 1, 0, 0, 0.9, TEG_D, 0.5) + `<path d="M${-r} ${-h - 2}h${f(r * 0.7)}V${f(r)}h${f(-r * 0.7)}Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.7, 0)}"/>` + grooves },
      { d: top, fill: TEG_L, inner: k.sh(top, 0, 0, 1, 1, 0, 0.7, TEG, 0.4) + `<path d="${ellipse(0, -h, r * 0.62, ry * 0.62)}" fill="none" stroke="${TEG_D}" stroke-width="${f(r * 0.08)}"/>` },
    ], f(Math.min(0.55, r * 0.14))) +
    `</g>`
  )
}

/** Cantonera dorada con voluta (libros, estuches). */
const corner = (x: number, y: number, sx: number, sy: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${f(sx * s)} ${f(sy * s)})"><path d="M0 0H7.4C6 1.4 4 2 2 2C2 4 1.4 6 0 7.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M1.6 1.6C3 3 4 3 5 2.4M1.6 1.6C3 3 3 4 2.4 5" fill="none" stroke="${P.goldD}" stroke-width=".35"/><circle cx="1.4" cy="1.4" r=".55" fill="${P.goldL}"/></g>`

/** Cordón dorado retorcido. */
const cord = (d: string, w = 1.1) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 2)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldD}" stroke-width="${w}" stroke-dasharray=".5 .9"/>`

/** Continentes de un planisferio chico (x de -27 a 27, y de -18 a 18), como contornos suaves. */
const MAP = {
  na: smooth([[-25, -12], [-21, -14.6], [-15, -15.4], [-10, -15.6], [-7, -14.2], [-8.6, -12], [-6, -11.6], [-3.4, -12.4], [-4, -9.8], [-6.4, -8.6], [-7.6, -6.4], [-8.4, -4.4], [-9.6, -5.4], [-11.4, -4.2], [-12.4, -2.2], [-11.2, -.6], [-13, -1.2], [-15.4, -3.6], [-17.6, -6.6], [-19.6, -9.4], [-22.6, -10.6]]),
  gl: smooth([[-4.2, -16.2], [-.8, -16.8], [.4, -15], [-1.2, -13], [-3, -12.8], [-4.2, -14.4]]),
  sa: smooth([[-10.6, .4], [-7.6, .8], [-5, 2.4], [-3.6, 4.6], [-4.6, 7.2], [-6.4, 9.2], [-7.6, 12], [-8.6, 15.6], [-9.6, 15.2], [-9.8, 11.4], [-10.6, 8], [-11.6, 4.6], [-11.8, 2]]),
  eu: smooth([[0, -11], [1, -13.2], [3.6, -14.2], [6.6, -13.6], [7, -11.4], [5.4, -10], [3.6, -8.2], [1.8, -8.6], [.4, -9.4]]),
  af: smooth([[.4, -6], [3.6, -7.2], [7.4, -6.6], [9.4, -3.8], [10.6, -1.6], [9.2, 1.6], [7.8, 5], [6, 8.2], [4.6, 8.6], [3.6, 5.2], [2.8, 1.6], [.6, 0], [-.6, -2.6]]),
  as: smooth([[7.4, -11.6], [8.4, -14.2], [12, -15.8], [17, -15.6], [22, -14.4], [25.2, -12.4], [24.4, -9.6], [21.6, -8.6], [20.6, -5.6], [18, -3.6], [15.6, -4.2], [14, -2], [12.2, -4.8], [10.6, -6], [9, -8.6]]),
  oc: smooth([[17.4, 5.6], [20.2, 4.2], [23, 4.8], [23.6, 7.6], [21.4, 9.2], [18.6, 8.6]]),
}

export const TEG_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Agenda oculta ──────────────────────────────────────────────────

  // El primer objetivo secreto: el sobre, cerrado con lacre verde y cordón, bajo una gloria de rayos.
  'Sobre lacrado': (u) => {
    const k = kit(u)
    const env = roundRect(-28, -19, 28, 19, 1.8)
    const flap = 'M-28 -17.2C-28 -18.3 -27.2 -19 -26.2 -19H26.2C27.2 -19 28 -18.3 28 -17.2L3.4 3.6C1.4 5.2 -1.4 5.2 -3.4 3.6Z'
    const flapShadow = 'M-28 -16L-3.4 4.8C-1.4 6.4 1.4 6.4 3.4 4.8L28 -16V-13.6L3.4 7.2C1.4 8.8 -1.4 8.8 -3.4 7.2L-28 -13.6Z'
    const seal = blob(0, 4, 9.4, 0.55, 9)
    const drip = 'M3.4 11.6C4.4 14 6.4 15.4 6 17C5.6 18.4 3.2 18 3.2 16.4C3.2 15 2.6 13.8 1.6 12.6Z'
    const face = ellipse(0, 4, 6.3, 6.3)
    const fibers = [[-22, -8], [-14, 12], [14, 14], [22, -6], [-24, 8], [20, 6]].map(([x, y], i) => hair(x, y, x + 2, y + (i % 2 ? 1 : -1), x + 4.4, y + 0.4, 0.35, P.sky2)).join('')
    const dots = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * 5.4)}" cy="${f(4 + Math.sin(a) * 5.4)}" r=".38" fill="${TEG_L}"/>` }).join('')
    return (
      field(k) +
      k.sun(60, 58, 16, 46, 32, false) +
      k.shade(ellipse(60, 60, 28, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      `<g transform="translate(60 61) rotate(-8)">` +
      k.cast([env], 2.4, 2.4) +
      k.draw([{
        d: env, fill: P.white,
        inner:
          k.sh('M4 -20H30V20H4Z', 0, 0, 1, 0, 0, 0.75, P.blue, 0.35) + k.sh('M-30 8H30V20H-30Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
          `<path d="M-28 19L-4.6 2.6M28 19L4.6 2.6" stroke="${P.blue}" stroke-width=".55"/>` +
          `<path d="M-27 18.2L-6 3.6" stroke="#fff" stroke-width=".5" transform="translate(-.6 -.8)"/>` + fibers,
      }], 0.8) +
      `<path d="${flapShadow}" fill="${P.blue}" opacity=".22"/>` +
      k.draw([{ d: flap, fill: P.paper, line: 0.35, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.6, P.sky2, 0.4) + `<path d="M-24.6 -17.4H24.6" stroke="#fff" stroke-width=".9" opacity=".9"/>` + hair(-18, -12, -10, -6, -4, -1, 0.4, P.sky2) }], 0.4) +
      cord('M-1.4 8.4C-7 13 -12 18 -14.6 26') + cord('M1.4 8.4C5 14 8 19.6 9.4 26.4') +
      `<path d="M-14.6 26l-1 1.6M-14.6 26l.6 1.8M9.4 26.4l-.8 1.8M9.4 26.4l1.2 1.4" stroke="${P.goldD}" stroke-width=".5" stroke-linecap="round"/>` +
      k.draw([
        { d: drip, fill: TEG, inner: k.sh(drip, 0, 0, 1, 1, 0, 0.9, TEG_D, 0.5) },
        { d: seal, fill: TEG, inner: k.sh(seal, 0, 0, 1, 1, 0, 0.95, TEG_D, 0.55) + `<path d="M-10 -6H-2V14H-10Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.5, 0)}"/>` },
      ], 0.65) +
      `<path d="${face}" fill="${TEG_D}" opacity=".3"/><path d="${face}" fill="none" stroke="${TEG_D}" stroke-width=".7"/>` +
      `<path d="M-4.6 8.4A6.3 6.3 0 0 0 5 7.6" fill="none" stroke="${TEG_XL}" stroke-width=".6" opacity=".8"/>` + dots +
      `<path d="${starPath(0, 4, 4.6, 1.1, 4)}" fill="${TEG_L}" stroke="${TEG_D}" stroke-width=".35"/><path d="${starPath(0, 4, 2.9, 0.8, 4, -45)}" fill="${TEG}" stroke="${TEG_D}" stroke-width=".3"/><circle cx="0" cy="4" r=".8" fill="${TEG_XL}"/>` +
      `<path d="M-6.6 .6C-5.6 -2.4 -3.4 -4.2 -1 -4.8" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` +
      `</g>` +
      sparkle(88, 40, 2.4) + sparkle(32, 82, 1.6) + sparkle(34, 40, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Tres objetivos secretos: el caballo de Troya, con la escotilla abierta y las fichas verdes adentro.
  'Caballo de Troya': (u) => {
    const k = kit(u)
    const body = roundRect(46, 52, 90, 72, 9)
    const neck = 'M48 62L44 50L38 46L33 48.6C31.2 49.6 28.8 48.4 29.4 46L34.2 35C35.6 31.8 38.6 29.6 42 29.4L47.4 30L59 51L54 62Z'
    const earL = 'M40.2 30.6L41.2 23.6L44.2 29.8Z', earR = 'M44.4 30L46.8 23.8L48.2 30.8Z'
    const post = (x: number) => `M${x} 69H${f(x + 4.6)}V89H${x}Z`
    const plat = roundRect(33, 88.4, 94, 93.6, 1.4)
    const hole = roundRect(61.4, 55, 76.4, 67.2, 0.8)
    const door = 'M61.4 67.2H76.4L78.8 77H63.6Z'
    const strands = [taper(90, 56.6, 97, 60, 95.4, 79, 2.4, 0.9), taper(90.4, 57.4, 99.6, 63.6, 98.4, 76.6, 2.2, 0.8), taper(89.6, 57.4, 93.6, 65, 92, 80.6, 2.2, 0.8)]
    const wheel = (x: number) => {
      const spokes = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.3; return `M${f(x + Math.cos(a) * 1.4)} ${f(94 + Math.sin(a) * 1.4)}L${f(x + Math.cos(a) * 4)} ${f(94 + Math.sin(a) * 4)}` }).join('')
      return k.draw([{ d: ellipse(x, 94, 5, 5), fill: P.brown, inner: k.sh(ellipse(x, 94, 5, 5), 0, 0, 1, 1, 0, 0.9, P.brownD, 0.5) + `<circle cx="${x}" cy="94" r="3.9" fill="none" stroke="${P.brownD}" stroke-width=".5"/>` }], 0.6) +
        `<path d="${spokes}" stroke="${P.brownD}" stroke-width="1"/><circle cx="${x}" cy="94" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }
    // Crin de madera: dientes a lo largo del cogote.
    const mane = Array.from({ length: 8 }, (_, i) => {
      const t = 0.06 + i * 0.115, x = 47.4 + 11.6 * t, y = 30 + 21 * t, ux = 0.483, uy = 0.875, nx = 0.875, ny = -0.483, L = 3.6 - i * 0.2
      return `M${f(x - ux * 1.3)} ${f(y - uy * 1.3)}L${f(x + nx * L - ux * 0.4)} ${f(y + ny * L - uy * 0.4)}L${f(x + nx * L + ux * 0.6)} ${f(y + ny * L + uy * 0.6)}L${f(x + ux * 1.3)} ${f(y + uy * 1.3)}Z`
    }).join('')
    const nails = [[56, 55], [57.6, 60.4], [82, 55], [83.4, 60.4], [52, 65.6], [53.4, 70], [80, 65.6], [79, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".5" fill="${P.brownD}"/><circle cx="${f(x - 0.15)}" cy="${f(y - 0.15)}" r=".18" fill="${P.goldL}"/>`).join('')
    const grain = hair(48, 54.6, 54, 54, 60, 54.8, 0.35, P.brownD) + hair(64, 59.6, 72, 59, 80, 59.8, 0.35, P.brownD) + hair(50, 64.6, 58, 64, 64, 64.8, 0.35, P.brownD) + hair(78, 69.6, 82, 69, 88, 69.4, 0.35, P.brownD) + hair(48, 55.6, 52, 55.2, 56, 55.4, 0.4, P.goldL)
    return (
      field(k) +
      k.sun(60, 52, 14, 46, 32, false) +
      k.shade(ellipse(60, 52, 24, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<g transform="translate(62 60) scale(.92) translate(-62 -60)">` +
      k.floor(63, 97, 32, 3.4, P.mid) +
      k.draw([{ d: post(57), fill: P.brownD }, { d: post(84), fill: P.brownD }], 0.6) +
      k.draw(strands.map((d) => ({ d, fill: P.goldL, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) })), 0.45) +
      `<path d="M88.8 55.6L91.6 58.4" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="M88.8 55.6L91.6 58.4" stroke="${P.gold}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([
        { d: post(49), fill: P.brown, inner: k.sh(post(49), 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + `<path d="M48 85H55" stroke="${P.brownD}" stroke-width=".6"/>` + hair(50.6, 72, 50.4, 78, 50.8, 84, 0.35, P.goldL) },
        { d: post(77), fill: P.brown, inner: k.sh(post(77), 0, 0, 1, 0, 0, 0.8, P.brownD, 0.4) + `<path d="M76 85H83" stroke="${P.brownD}" stroke-width=".6"/>` + hair(78.6, 72, 78.4, 78, 78.8, 84, 0.35, P.goldL) },
      ], 0.6) +
      k.draw([{ d: mane, fill: P.brownD }], 0.4) +
      k.draw([
        {
          d: neck, fill: P.brown,
          inner: k.sh('M44 26H62V64H44Z', 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<path d="M26 30H38V50H26Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="M42 30.6L52.4 51M37 34.8L46.6 54" stroke="${P.brownD}" stroke-width=".5"/>` + hair(33, 38.6, 31.6, 42, 31, 46, 0.4, P.brownD) + hair(39.4, 33, 43, 40, 46.6, 47, 0.35, P.goldL),
        },
        { d: earL, fill: P.brown, inner: `<path d="M41.4 26L42.8 29.4" stroke="${P.brownD}" stroke-width=".6"/>` },
        { d: earR, fill: P.brown },
        {
          d: body, fill: P.brown, line: 0.35,
          inner:
            k.sh('M70 50H92V74H70Z', 0, 0, 1, 0, 0, 0.85, P.brownD, 0.45) + k.sh('M44 66H92V74H44Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.4) +
            `<path d="M44 50H62V58H44Z" fill="${k.lin(P.goldL, 0, 0, 0, 1, 0.6, 0)}"/>` +
            `<path d="M46 57.4H90M46 62.6H90M46 67.6H90M56.8 52V57.4M82.6 52V57.4M58.4 57.4V62.6M84 57.4V62.6M53 62.6V67.6M80.8 62.6V67.6" fill="none" stroke="${P.brownD}" stroke-width=".55"/>` +
            `<path d="M46 58H90M46 63.2H90M46 68.2H90" stroke="${P.goldL}" stroke-width=".35" opacity=".7"/>` + grain + nails,
        },
      ], 0.75) +
      `<path d="${hole}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.clip(hole, k.shade(ellipse(69, 70, 9, 6), k.rad(TEG_L, 0.5, 0.5, 0.5, 0.6, 0), TEG_L, 0.3) + token(k, 64.6, 68.2, 2.5) + token(k, 69, 67.6, 2.6) + token(k, 73.6, 68.2, 2.5) + `<path d="M61 55H77V59H61Z" fill="#0F1736" opacity=".6"/>`) +
      `<path d="M61.4 55.6H76.4" stroke="${P.brownD}" stroke-width=".8"/>` +
      k.draw([{ d: door, fill: P.brown, inner: k.sh(door, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) + `<path d="M62.2 70.4H77.2M62.8 73.6H77.8" stroke="${P.brownD}" stroke-width=".5"/>` + `<path d="M62 67.6H76.6" stroke="${P.goldL}" stroke-width=".5"/>` }], 0.55) +
      token(k, 72.6, 75.6, 2.5, 14) +
      `<path d="M33.8 36.6L38.6 46.6M30.4 41.6C32.4 43 34.6 43.6 37 43" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M33.8 36.6L38.6 46.6M30.4 41.6C32.4 43 34.6 43.6 37 43" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M38.6 46.6C42 51.6 45.4 53.4 49 53" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-dasharray="1 .6"/>` +
      `<ellipse cx="37.6" cy="35.2" rx="1.6" ry="1" transform="rotate(-28 37.6 35.2)" fill="${P.ink}"/><path d="M35.4 35.6C36.6 33.8 38.6 33.4 40 34" fill="none" stroke="${P.brownD}" stroke-width=".45"/>` +
      `<circle cx="31.4" cy="45.2" r=".7" fill="${P.brownD}"/>` +
      k.draw([{ d: plat, fill: P.brown, inner: k.sh(plat, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M48 88.4V93.6M70 88.4V93.6" stroke="${P.brownD}" stroke-width=".5"/>` + `<path d="M34 89.6H93" stroke="${P.goldL}" stroke-width=".4"/>` }], 0.6) +
      wheel(40) + wheel(63.4) + wheel(87) +
      `</g>` +
      sparkle(84, 34, 2.2) + sparkle(28, 70, 1.6) + sparkle(30, 56, 1.2, P.goldL) +
      k.defs()
    )
  },

  // Siete objetivos: el fin justifica los medios. El Príncipe encuadernado en cuero verde, con el puñal detrás.
  'Maquiavelo': (u) => {
    const k = kit(u)
    const cover = roundRect(42, 30, 74, 82, 1.4)
    const pages = 'M73.6 31.4L78.8 34.4V84.6L73.6 81.6Z'
    const blade = 'M-38 0L-30 -2.4H19V2.4H-30Z'
    const guard = 'M19 -7.4C20.6 -7.4 21.8 -6 21.4 -4.4L21 -2V2L21.4 4.4C21.8 6 20.6 7.4 19 7.4C18 6 18 4 18.6 2.6V-2.6C18 -4 18 -6 19 -7.4Z'
    const grip = 'M21 -1.9H32V1.9H21Z'
    const clasp = (y: number) => k.draw([{ d: `M69.4 ${y}H77.4V${f(y + 3.8)}H69.4C68.4 ${f(y + 3.8)} 67.8 ${f(y + 3)} 67.8 ${f(y + 1.9)}C67.8 ${f(y + 0.8)} 68.4 ${y} 69.4 ${y}Z`, fill: P.gold, inner: k.sh('M66 0H80V130H66Z', 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) }], 0.4) + `<circle cx="69.6" cy="${f(y + 1.9)}" r=".8" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>`
    const crown = 'M-6 2L-7 -5L-3.2 -2L0 -7.2L3.2 -2L7 -5L6 2Z'
    const filet = (x0: number, y0: number, x1: number, y1: number) =>
      `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="none" stroke="${P.gold}" stroke-width=".6"/>`
    const wire = Array.from({ length: 5 }, (_, i) => `<path d="M${f(22 + i * 2.2)} -1.9L${f(23.4 + i * 2.2)} 1.9" stroke="${P.goldD}" stroke-width=".55"/>`).join('')
    return (
      field(k) +
      k.sun(60, 56, 16, 47, 32, false) +
      k.shade(ellipse(60, 56, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(48, 100, 28, 92, 25, 64, 8) + laurel(72, 100, 92, 92, 95, 64, 8, true) +
      // El puñal, cruzado por detrás del libro.
      `<g transform="translate(60 60) rotate(-22)">` +
      k.draw([
        { d: blade, fill: P.sky1, inner: `<path d="M-38 0L-30 -2.4H19V0Z" fill="#fff"/>` + k.sh('M-40 0H22V3H-40Z', 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) + `<path d="M-36 0H18" stroke="${P.blue}" stroke-width=".4"/>` },
        { d: grip, fill: P.wine, inner: wire },
        { d: guard, fill: P.gold, inner: k.sh(guard, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.7) +
      k.draw([{ d: ellipse(35.4, 0, 3.6, 3.6), fill: P.gold, inner: k.sh(ellipse(35.4, 0, 3.6, 3.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.5) +
      `<circle cx="35.4" cy="0" r="1.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="34.8" cy="-.6" r=".5" fill="#fff"/>` +
      `<circle cx="19.8" cy="0" r="1.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      k.cast([cover, pages], 2.2, 2.2) +
      k.draw([
        { d: pages, fill: P.goldL, inner: Array.from({ length: 6 }, (_, i) => `<path d="M${f(74.4 + i * 0.75)} ${f(32.4 + i * 0.45)}V${f(82.2 + i * 0.45)}" stroke="${P.goldD}" stroke-width=".3"/>`).join('') + k.sh(pages, 0, 0, 0, 1, 0, 0.6, P.goldD, 0.3) },
        {
          d: cover, fill: TEG,
          inner:
            k.sh('M58 28H76V84H58Z', 0, 0, 1, 0, 0, 0.85, TEG_D, 0.5) + k.sh('M40 70H76V84H40Z', 0, 0, 0, 1, 0, 0.7, TEG_D, 0.4) +
            `<path d="M40 28H50V84H40Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.55, 0)}"/>` +
            `<path d="M45.4 30V82" stroke="${TEG_D}" stroke-width=".7"/><path d="M46 30V82" stroke="${TEG_L}" stroke-width=".4"/>` +
            hair(50, 36, 56, 37, 64, 35.6, 0.35, TEG_D) + hair(54, 74, 60, 75, 68, 73.6, 0.35, TEG_D),
        },
      ], 0.8) +
      filet(47.6, 33.4, 71, 78.6) + `<path d="M49.2 35H69.4V77H49.2Z" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray="1 .6"/>` +
      corner(47.6, 33.4, 1, 1, 0.8) + corner(71, 33.4, -1, 1, 0.8) + corner(47.6, 78.6, 1, -1, 0.8) + corner(71, 78.6, -1, -1, 0.8) +
      `<text x="58.6" y="43" ${GEORGIA} font-style="italic" font-size="4" fill="${P.gold}" text-anchor="middle">Il Principe</text>` +
      `<path d="M52 45.4H65.4" stroke="${P.gold}" stroke-width=".4"/><circle cx="58.7" cy="45.4" r=".6" fill="${P.gold}"/>` +
      `<ellipse cx="59.3" cy="60" rx="7.4" ry="9.4" fill="${TEG_D}" opacity=".4"/>` +
      `<ellipse cx="59.3" cy="60" rx="7.4" ry="9.4" fill="none" stroke="${P.gold}" stroke-width=".8"/><ellipse cx="59.3" cy="60" rx="6.2" ry="8.2" fill="none" stroke="${P.goldD}" stroke-width=".35" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
      `<g transform="translate(59.3 61) scale(.9)">` + k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) + `<path d="M-6.6 0H6.6" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.35) +
      `<circle cx="0" cy="-7.8" r=".9" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/><circle cx="-7" cy="-5.6" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/><circle cx="7" cy="-5.6" r=".7" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".25"/><circle cx="0" cy="-.8" r=".9" fill="${P.red}"/></g>` +
      `<path d="M55 68.4H63.6" stroke="${P.gold}" stroke-width=".4"/>` +
      clasp(50) + clasp(66.4) +
      `<path d="M76 83.4L76.6 93.6L78 92.2L79.4 93.8L78.6 83.8Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>` +
      `<path d="M44.6 34C44.6 32.6 45.4 31.6 46.6 31.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` +
      sparkle(60, 22, 3, '#fff') + sparkle(86, 34, 1.8) + sparkle(32, 40, 1.6) +
      k.defs()
    )
  },

  // ── Imperio ────────────────────────────────────────────────────────

  // Treinta países de tu color: el planisferio pintado de verde, con el pincel todavía cargado.
  'Mapa pintado': (u) => {
    const k = kit(u)
    const sheet = 'M-29.6 -20H29.6V20H-29.6Z'
    const roll = (x: number) => roundRect(x - 2.6, -21.6, x + 2.6, 21.6, 2.6)
    const ocean = 'M-27 -17.6H27V17.6H-27Z'
    const grat = `M-18 -17.6V17.6M-9 -17.6V17.6M0 -17.6V17.6M9 -17.6V17.6M18 -17.6V17.6M-27 -8.8H27M-27 0H27M-27 8.8H27`
    const painted = [MAP.na, MAP.gl, MAP.sa, MAP.eu, MAP.af, MAP.oc]
    const stroke = 'M5 -17H14.4C15.4 -14 13.6 -11 15.2 -8.4C16.2 -6.6 14.4 -4.4 15.4 -1H5Z'
    const borders = 'M-21 -14L-19 -10L-14 -9M-15 -15.4L-14 -9L-10 -7.4M-10 -15.6L-10 -7.4M-11.4 -4.2L-9 -7M-8 2L-6.4 5.4L-4 5M-10 5.4L-6.4 5.4M-9.4 10L-6.6 10M2 -3.6L6 -3L9 -.6M3.4 1.6L8.6 2.6M4.6 4.6L5 8.6M2 -12L4.4 -10.6M4.4 -13.8L4.4 -10.6M19.4 6.6L22 7'
    const rose = `<g transform="translate(-20.4 10.4)"><circle r="3.6" fill="none" stroke="${P.blue}" stroke-width=".35"/><path d="${starPath(0, 0, 4.6, 0.9, 4)}" fill="${P.white}" stroke="${P.mid}" stroke-width=".3"/><path d="M0 -4.6L.9 -.9L0 0ZM4.6 0L.9 .9L0 0ZM0 4.6L-.9 .9L0 0ZM-4.6 0L-.9 -.9L0 0Z" fill="${P.mid}"/></g>`
    // Pincel: punta en (0,0), mango hacia +x.
    const bristles = 'M0 -1.6C2 -2.8 5 -3.4 9.6 -3.2V3.2C5 3.4 2 2.8 0 1.6C-.6 .6 -.6 -.6 0 -1.6Z'
    const ferrule = 'M9.4 -3.4H16.4C16.8 -3.4 17 -3 17 -2.6V2.6C17 3 16.8 3.4 16.4 3.4H9.4Z'
    const handle = 'M16.8 -2.6C22 -2.4 28 -2 32.6 -1.6C34 -1.4 34.6 -.6 34.6 0C34.6 .6 34 1.4 32.6 1.6C28 2 22 2.4 16.8 2.6Z'
    return (
      field(k) +
      k.sun(60, 54, 15, 46, 32, false) +
      k.shade(ellipse(60, 56, 30, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      `<g transform="translate(58 59) rotate(-6) scale(.94)">` +
      k.cast([sheet], 2.2, 2.4) +
      k.draw([{
        d: sheet, fill: P.paper,
        inner:
          `<path d="${ocean}" fill="${P.sky1}"/>` + k.sh(ocean, 0, 0, 1, 1, 0, 0.6, P.sky, 0.4) +
          `<path d="${grat}" stroke="${P.blue}" stroke-width=".3" stroke-dasharray="1 1" opacity=".7"/>` +
          [[-22, 3], [6, 13], [-2, -2], [12, 11], [-17, 14]].map(([x, y]) => `<path d="M${x} ${y}q1 -.7 2 0t2 0" fill="none" stroke="${P.blue}" stroke-width=".35"/>`).join('') +
          rose +
          painted.map((d) => `<path d="${d}" fill="${TEG}"/>`).join('') +
          k.clip(painted.join(''), k.sh('M-30 -20H30V20H-30Z', 0, 0, 1, 1, 0, 0.7, TEG_D, 0.35) + `<path d="${borders}" fill="none" stroke="${TEG_D}" stroke-width=".4"/>` +
            hair(-22, -12.6, -16, -14.6, -9, -14, 0.6, TEG_XL) + hair(-10.4, 2, -8, 1.6, -6, 3, 0.5, TEG_XL) + hair(1, -5, 4, -6.4, 8, -5.6, 0.5, TEG_XL)) +
          painted.map((d) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>`).join('') +
          `<path d="${MAP.as}" fill="${P.white}"/>` +
          k.clip(MAP.as, `<path d="${stroke}" fill="${TEG}"/>` + hair(7, -15, 8, -9, 7.4, -3, 0.45, TEG_D) + hair(10, -16, 11, -10, 10.4, -3, 0.4, TEG_D) + hair(13, -15, 13.4, -9, 13.6, -3, 0.35, TEG_XL) +
            `<path d="M17 -14L18 -10L22 -9.4M19.6 -6L21 -10" fill="none" stroke="${P.blue}" stroke-width=".35"/>`) +
          `<path d="${MAP.as}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
          `<path d="${ocean}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
          k.sh('M-30 10H30V20H-30Z', 0, 0, 0, 1, 0, 0.4, P.blue, 0.3),
      }], 0.75) +
      k.draw([
        { d: roll(-29.6), fill: P.white, inner: k.sh(roll(-29.6), 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M-30.8 -20V20" stroke="#fff" stroke-width=".7"/>` },
        { d: roll(29.6), fill: P.white, inner: k.sh(roll(29.6), 0, 0, 1, 0, 0.1, 0.9, P.blue, 0.4) + `<path d="M28.4 -20V20" stroke="#fff" stroke-width=".7"/>` },
      ], 0.6) +
      `<path d="M-9 15.4C-9.2 18 -8.8 20.6 -8.2 21.2C-7.4 21.6 -7 20.6 -7.2 19L-7.6 15.6Z" fill="${TEG}" stroke="${P.ink}" stroke-width=".35"/>` +
      `</g>` +
      `<g transform="translate(73 52.6) rotate(58)">` +
      k.cast([handle, ferrule], 1.6, 1.4) +
      k.draw([
        { d: handle, fill: P.red, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, P.wine, 0.5) + `<path d="M17 -2.6H40V-1H17Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.45, 0)}"/>` + `<path d="M29 -2.2V2.2M30.2 -2.1V2.1" stroke="${P.gold}" stroke-width=".7"/>` },
        { d: ferrule, fill: P.sky1, inner: k.sh(ferrule, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) + `<path d="M11.4 -3.4V3.4M13.4 -3.4V3.4M15.2 -3.4V3.4" stroke="${P.blue}" stroke-width=".45"/><path d="M9.4 -1.8H17" stroke="#fff" stroke-width=".6"/>` },
        { d: bristles, fill: TEG, inner: k.sh(bristles, 0, 0, 0, 1, 0, 0.9, TEG_D, 0.5) + `<path d="M7 -2.8H10V2.8H7Z" fill="${P.goldL}"/>` + hair(1, -1, 4, -1.6, 8, -2, 0.35, TEG_D) + hair(1, 0.6, 4, 0.8, 8, 1.2, 0.35, TEG_D) + hair(2, -0.2, 5, -0.2, 7.6, -0.4, 0.3, TEG_XL) },
      ], 0.6) +
      `<circle cx="33.2" cy="0" r=".6" fill="${P.wine}"/>` +
      `</g>` +
      `<path d="M71.6 57C71 59 71.2 60.8 72 61.4C72.8 61.8 73.2 60.8 73 59.2Z" fill="${TEG}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(32, 36, 2.2) + sparkle(90, 40, 1.6) + sparkle(36, 88, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Tres veces dueño del mundo: el bicornio de Napoleón, de costado, sobre el globo terráqueo.
  'Napoleón': (u) => {
    const k = kit(u)
    const R = 18.6
    const globe = ellipse(0, 0, R, R)
    const na = 'M-17 -10C-13 -16 -4 -18.6 2.4 -16.6C5 -15.4 4.4 -12.4 1.6 -10.6C-.6 -9 -2.4 -6.6 -1.6 -3.6C-1 -1.2 -3.6 0 -5.8 -.8C-8.4 -1.8 -10.4 -4.2 -12.6 -5.8C-14.8 -7.4 -17.6 -8 -17 -10Z'
    const gl = 'M5 -18C8 -19.4 11 -18.4 10.4 -16C9.6 -14.4 6.6 -14.4 5.6 -15.6Z'
    const ca = 'M-3.6 -.6C-2 .4 -.6 1.8 .6 2.6L0 3.4C-1.4 2.4 -3 1.2 -4.2 0Z'
    const sa = 'M.8 2.6C4.4 1.8 8.4 3.6 10.6 6.6C11.8 9.4 9.4 12.6 7.4 15.4C5.6 17.8 3.8 19.6 2.6 20C1.6 16.4 .8 12.6 -.2 9.4C-1 6.8 -.6 3.8 .8 2.6Z'
    const af = 'M14.6 -12C17.6 -11 20 -8 20 -3C19.6 2 17.6 6 15.6 4.6C14.4 1 14 -6 14.6 -12Z'
    const lands = [na, gl, ca, sa, af]
    const ring = 'M0 -21.6A21.6 21.6 0 0 1 0 21.6V19.4A19.4 19.4 0 0 0 0 -19.4Z'
    const front = 'M-28 7C-21 1 -13 -12 0 -13.4C13 -12 21 1 28 7C19 3.6 9.4 2.4 0 2.4C-9.4 2.4 -19 3.6 -28 7Z'
    const under = 'M-28 7C-19 3.6 -9.4 2.4 0 2.4C9.4 2.4 19 3.6 28 7C19 5.8 9.4 5.2 0 5.2C-9.4 5.2 -19 5.8 -28 7Z'
    const pleats = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `M${f(10 + Math.cos(a) * 1.8)} ${f(-4 + Math.sin(a) * 1.8)}L${f(10 + Math.cos(a) * 4.2)} ${f(-4 + Math.sin(a) * 4.2)}` }).join('')
    return (
      field(k) +
      k.sun(60, 56, 15, 46, 32, false) +
      k.shade(ellipse(60, 56, 30, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.65, 0), P.goldL, 0.4) +
      k.floor(60, 95.4, 16, 2.6, P.mid) +
      `<g transform="translate(60 70)">` +
      k.draw([
        { d: 'M-2.6 18H2.6L3.4 23H-3.4Z', fill: P.gold, inner: k.sh('M-4 18H4V24H-4Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) },
        { d: 'M-11 25.2C-11 23.4 -6 22.4 0 22.4C6 22.4 11 23.4 11 25.2C11 26.6 6 27.2 0 27.2C-6 27.2 -11 26.6 -11 25.2Z', fill: P.gold, inner: k.sh('M-12 22H12V28H-12Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-9 24.6C-4 25.6 4 25.6 9 24.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>` },
      ], 0.6) +
      k.draw([{
        d: globe, fill: P.sky,
        inner:
          `<path d="${globe}" fill="${P.sky1}" opacity=".5"/>` +
          lands.map((d) => `<path d="${d}" fill="${TEG}" stroke="${P.ink}" stroke-width=".4" stroke-linejoin="round"/>`).join('') +
          `<path d="M-12 -14L-9 -8L-4 -6M-8 4L-3 6M2 8L7 9M3 13L7 12" fill="none" stroke="${TEG_D}" stroke-width=".35"/>` +
          `<path d="${ellipse(0, 0, 7.4, R)} ${ellipse(0, 0, 14, R)}" fill="none" stroke="${P.blue}" stroke-width=".35" opacity=".8"/>` +
          `<path d="M${-R} 0Q0 4 ${R} 0M-16 -9Q0 -6.6 16 -9M-16 9Q0 12.4 16 9" fill="none" stroke="${P.blue}" stroke-width=".35" opacity=".8"/>` +
          k.shade(globe, k.rad(P.mid, 0.3, 0.28, 0.8, 0, 0.95), P.mid, 0.4) +
          `<path d="M-13 -9C-11 -13 -7 -15.6 -3 -16.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`,
      }], 0.75) +
      k.draw([{ d: ring, fill: P.gold, inner: k.sh(ring, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) }], 0.5) +
      [-60, -20, 20, 60].map((a) => { const r = (a * Math.PI) / 180; return `<circle cx="${f(Math.sin(-r + Math.PI / 2) * 20.5)}" cy="${f(Math.sin(r) * 20.5)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('') +
      `</g>` +
      k.shade(ellipse(60, 53, 15, 3), k.rad(P.night, 0.5, 0.5, 0.5, 0.7, 0), P.night, 0.4) +
      `<g transform="translate(60 47.6) scale(1.06)">` +
      k.draw([
        { d: under, fill: P.ink },
        {
          d: front, fill: P.night,
          inner:
            `<path d="M-26 -14H-6V8H-26Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.9, 0)}"/>` + k.sh(front, 0, 0, 1, 1, 0.1, 0.9, '#0F1736', 0.5) +
            `<path d="M-25 5.4C-19 0 -12 -10.8 0 -12C12 -10.8 19 0 25 5.4" fill="none" stroke="${P.mid}" stroke-width=".9"/>` +
            hair(-18, 1, -12, -4, -6, -6.4, 0.5, P.mid) + hair(-20, 4, -12, 1, -4, -1, 0.45, P.mid) + hair(4, -9, 12, -6, 18, 0, 0.4, '#0F1736'),
        },
      ], 0.75) +
      `<path d="M8.8 -11.6H11.2V-4H8.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M10 -11.2V-4.6" stroke="${P.goldL}" stroke-width=".4"/>` +
      `<circle cx="10" cy="-4" r="4.4" fill="${P.mid}" stroke="${P.ink}" stroke-width=".5"/><path d="${pleats}" stroke="${P.night}" stroke-width=".3"/>` +
      `<circle cx="10" cy="-4" r="3" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="10" cy="-4" r="1.7" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<circle cx="10" cy="-4" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="9.7" cy="-4.3" r=".3" fill="#fff"/>` +
      `<path d="M-24 4.4C-20 1 -16 -4 -12 -7.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".5"/>` +
      `</g>` +
      sparkle(88, 38, 2.4) + sparkle(32, 40, 1.8) + sparkle(30, 76, 1.4) +
      k.defs()
    )
  },

  // Siete conquistas totales: el casco mongol de perfil, de punta y con borde de piel, con la cola de caballo roja al
  // viento y el cubrenuca de laminillas verdes.
  'Gengis Kan': (u) => {
    const k = kit(u)
    const bowl = 'M-15 0C-15.4 -7 -13 -13 -8.6 -17.6C-5 -21.4 -1.8 -25.6 0 -31C1.8 -25.6 5 -21.4 8.6 -17.6C13 -13 15.4 -7 15 0Z'
    const cap = 'M-3.2 -22.2C-1.8 -24.4 -.8 -27 0 -31C.8 -27 1.8 -24.4 3.2 -22.2C1 -21.4 -1 -21.4 -3.2 -22.2Z'
    const brim = tufty(0, 0.4, 17.4, 3.4, 36, 1.6)
    const curtain = 'M-8.6 2.6C-10.6 9 -11.2 16 -10.2 23.2C-6 24 -3.4 25.6 0 24.6C3.4 25.8 6 24.2 9.6 25.2C12.6 26 16 24 20.6 22.6C21 16 19.8 8.6 16.4 2.6Z'
    const plume = 'M0 -33.4C7.4 -35 14.4 -31 18.4 -24C21.4 -18.4 22.6 -10.4 22 -3.4C19.4 -9.6 16 -15.6 11.6 -20.6C8.2 -24.6 4.2 -28.6 0 -30.8Z'
    // Laminillas: filas de placas con remaches dorados y cordón rojo.
    const lam = (() => {
      let d = '', dots = ''
      for (let r = 0; r < 4; r++) {
        const y = 6.4 + r * 4.6, x0 = -9.6 - r * 0.3, x1 = 17.4 + r * 0.9
        d += `M${f(x0)} ${f(y)}Q${f((x0 + x1) / 2)} ${f(y + 1.4)} ${f(x1)} ${f(y - 0.2)}`
        for (let i = 0; i < 9; i++) {
          const x = x0 + 1.4 + i * 3.2 + (r % 2) * 1.6
          if (x < x1 - 0.8) { d += `M${f(x)} ${f(y - 4)}V${f(y + 0.6)}`; dots += `<circle cx="${f(x - 1.6)}" cy="${f(y - 2.2)}" r=".42" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>` }
        }
      }
      return `<path d="${d}" fill="none" stroke="${TEG_D}" stroke-width=".5"/>` + `<path d="M-10 8.2Q4 10 18 8M-10.4 17.4Q4 19.2 19 17.2" fill="none" stroke="${P.red}" stroke-width=".55" stroke-dasharray="1.2 .8"/>` + dots
    })()
    const furHair = Array.from({ length: 16 }, (_, i) => { const x = -16 + i * 2.13, y = -1.6 + (i % 3) * 0.9; return hair(x, y, x + 0.6, y + 1.2, x + 0.2, y + 2.6, 0.45, i % 2 ? FUR_D : FUR_L) }).join('')
    const rosette = `<g transform="translate(7.4 12.6)"><circle r="3.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="${starPath(0, 0, 2.8, 1.2, 8)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".25"/><circle r="1" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/><circle cx="-.3" cy="-.3" r=".3" fill="#fff"/></g>`
    const strands = [[1, -33, 9, -34, 15, -27], [2, -32, 11, -30, 17, -20], [1, -31.6, 8, -28, 13, -20], [3, -33.4, 13, -32, 19.6, -18], [5, -31.6, 14, -27, 20.6, -10], [8, -30, 16, -24, 21, -7]]
      .map(([a, b, c, d, e, g], i) => hair(a, b, c, d, e, g, 0.45, i % 3 === 2 ? P.goldL : P.wine)).join('')
    return (
      field(k) +
      k.sun(60, 52, 15, 47, 32, false) +
      k.shade(ellipse(60, 54, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(49, 99, 31, 92, 29, 64, 8) + laurel(71, 99, 89, 92, 91, 64, 8, true) +
      `<g transform="translate(58.4 62.6) scale(1.1)">` +
      k.cast([bowl, curtain, plume], 2, 2) +
      k.draw([{
        d: curtain, fill: TEG,
        inner: k.sh(curtain, 0, 0, 1, 0, 0, 0.9, TEG_D, 0.5) + k.sh('M-12 18H22V27H-12Z', 0, 0, 0, 1, 0, 0.6, TEG_D, 0.4) + `<path d="M-12 0H-2V27H-12Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.6, 0)}"/>` + lam,
      }], 0.7) +
      `<path d="M-10.2 23.2C-6 24 -3.4 25.6 0 24.6C3.4 25.8 6 24.2 9.6 25.2C12.6 26 16 24 20.6 22.6" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      rosette +
      k.draw([{ d: plume, fill: P.red, inner: k.sh(plume, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + strands }], 0.5) +
      k.draw([
        {
          d: bowl, fill: P.sky1,
          inner:
            k.sh('M1 -32H17V1H1Z', 0, 0, 1, 0, 0, 0.9, P.blue, 0.5) + `<path d="M-17 -32H-6V1H-17Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.75, 0)}"/>` +
            `<path d="M-7.6 0C-7.8 -8 -5.6 -15 -2.4 -21.6M7.6 0C7.8 -8 5.6 -15 2.4 -21.6M0 0V-22" fill="none" stroke="${P.ink}" stroke-width="1.6"/>` +
            `<path d="M-7.6 0C-7.8 -8 -5.6 -15 -2.4 -21.6M7.6 0C7.8 -8 5.6 -15 2.4 -21.6M0 0V-22" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
            [[-6.6, -6], [-5, -12.4], [6.6, -6], [5, -12.4], [0, -8], [0, -15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".2"/>`).join('') +
            `<path d="M-14.6 -3.6C-12 -5.6 -10 -3.4 -8 -5.4M14.6 -3.6C12 -5.6 10 -3.4 8 -5.4M-3.6 -4.4C-2 -6 2 -6 3.6 -4.4" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
            hair(-12, -2, -12, -10, -6.4, -17, 0.7, '#fff') + hair(11, -2, 11, -9, 7, -15, 0.45, P.blue),
        },
      ], 0.75) +
      k.draw([{ d: cap, fill: P.gold, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-2.6 -23.6H2.6" stroke="${P.goldD}" stroke-width=".4"/>` }], 0.4) +
      k.draw([{ d: brim, fill: FUR, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, FUR_D, 0.5) + furHair }], 0.55) +
      `<circle cx="0" cy="-33.2" r="1.7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="-.5" cy="-33.7" r=".45" fill="#fff"/>` +
      `<path d="M0 -34.8V-37.8" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="M0 -34.8V-37.8" stroke="${P.gold}" stroke-width=".45" stroke-linecap="round"/>` +
      `</g>` +
      sparkle(32, 46, 2.2) + sparkle(90, 80, 1.6) + sparkle(86, 34, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Topadora ───────────────────────────────────────────────────────

  // Veinte países a puro dado: el casco verde del soldado raso, con su red, y el dado al lado.
  'Soldado raso': (u) => {
    const k = kit(u)
    const dome = 'M-19.4 -1C-20.4 -14 -12 -23.6 .6 -23.6C13.4 -23.6 21.4 -14 20.4 -1Z'
    const brim = 'M-23.4 -.4C-23.4 -2.2 -21.6 -3.2 -18.8 -3C-7 -2 7.4 -2 19.4 -3C22.4 -3.2 24.4 -2.2 24.4 -.2C24.4 2 21.8 3.4 18.2 3.2C7 2.4 -6.6 2.4 -17.8 3.2C-21.4 3.4 -23.4 2 -23.4 -.4Z'
    const net = Array.from({ length: 9 }, (_, i) => { const x = -28 + i * 6.4; return `M${f(x)} 0L${f(x + 22)} -26M${f(x + 22)} 0L${f(x)} -26` }).join('')
    const strap = 'M-15.4 1.8C-13.6 8 -6.4 11.2 1.6 11.2C9 11.2 15.4 8 17.4 1.8'
    // Dado rojo en perspectiva (frente arriba en (x,y), lado s).
    const redDie = (x: number, y: number, s: number, rot: number) => {
      const kk = f(s * 0.87), h = f(s / 2)
      const out = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}L${f(x - kk)} ${f(y + h)}L${f(x - kk)} ${f(y - h)}Z`
      const topF = `M${x} ${f(y - s)}L${f(x + kk)} ${f(y - h)}L${x} ${y}L${f(x - kk)} ${f(y - h)}Z`
      const right = `M${x} ${y}L${f(x + kk)} ${f(y - h)}L${f(x + kk)} ${f(y + h)}L${x} ${f(y + s)}Z`
      const pip = (px: number, py: number, r = 0.62) => `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${r}" ry="${f(r * 0.75)}" fill="${P.white}"/>`
      return (
        `<g transform="rotate(${rot} ${x} ${y})">` +
        k.draw([{ d: out, fill: P.red, inner: `<path d="${topF}" fill="#E06A5F"/>` + k.sh(right, 0, 0, 1, 1, 0.3, 0.95, P.wine, 0.5) }], 0.6) +
        `<path d="M${f(x - kk)} ${f(y - h)}L${x} ${y}L${f(x + kk)} ${f(y - h)}M${x} ${y}V${f(y + s)}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>` +
        pip(x, y - h) + pip(x - kk * 0.45, y - h * 1.0 + 0.2) + pip(x + kk * 0.45, y - h + 0.2) +
        pip(x - kk * 0.7, y + h * 0.1, 0.55) + pip(x - kk * 0.3, y + h * 0.9, 0.55) +
        pip(x + kk * 0.3, y + h * 0.15, 0.55) + pip(x + kk * 0.7, y + h * 0.5, 0.55) + pip(x + kk * 0.3, y + h * 1.05, 0.55) + pip(x + kk * 0.7, y + h * 1.4, 0.55) +
        `<path d="M${f(x - kk + 0.6)} ${f(y - h + 0.2)}L${f(x - 0.4)} ${f(y - s + 0.8)}" stroke="#fff" stroke-width=".5" opacity=".7"/>` +
        `</g>`
      )
    }
    return (
      field(k) +
      k.sun(60, 56, 15, 46, 32, false) +
      k.shade(ellipse(60, 58, 28, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(62, 77.4, 32, 3.6, P.mid) +
      `<g transform="translate(62 73) scale(1.28)">` +
      `<path d="${strap}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="${strap}" fill="none" stroke="${P.brown}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<path d="${strap}" fill="none" stroke="${P.brownD}" stroke-width=".35" stroke-dasharray="1 1" transform="translate(0 -.2)"/>` +
      `<path d="M.2 9.8H3.2V12.6H.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        {
          d: dome, fill: TEG,
          inner:
            k.sh('M4 -26H24V2H4Z', 0, 0, 1, 0, 0, 0.9, TEG_D, 0.55) + `<path d="M-22 -26H-6V2H-22Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="${net}" stroke="${TEG_D}" stroke-width=".45" opacity=".75"/>` +
            `<path d="${net}" stroke="${TEG_XL}" stroke-width=".25" opacity=".5" transform="translate(-.4 -.3)"/>` +
            `<ellipse cx="-8" cy="-15" rx="4" ry="2.2" fill="#fff" opacity=".55" transform="rotate(-38 -8 -15)"/>` +
            hair(5, -21, 10, -18, 13, -12, 0.4, TEG_D) + hair(-14, -5, -10, -7, -6, -6, 0.35, TEG_D),
        },
        { d: brim, fill: TEG, inner: k.sh(brim, 0, 0, 0, 1, 0, 0.9, TEG_D, 0.55) + `<path d="M-20 -1.6C-8 -.8 8 -.8 20 -1.6" fill="none" stroke="${TEG_XL}" stroke-width=".5"/>` },
      ], 0.75 / 1.28) +
      `</g>` +
      redDie(33.6, 79.4, 7, -10) +
      sparkle(88, 40, 2.4) + sparkle(30, 44, 1.6) + sparkle(90, 72, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Ochenta países: el Sherman verde pasa por encima de lo que venga (un dado incluido).
  'Tanque Sherman': (u) => {
    const k = kit(u)
    const track = 'M-34 2.4C-36 3 -36.6 5.6 -35.2 7.6L-29.6 15C-28.8 16 -27.8 16.4 -26.6 16.4H27.4C28.6 16.4 29.6 16 30.2 15L34.8 8C36 6 35 3 32.6 2.6Z'
    const fender = 'M-37 -1.8H36.6V1.8H-37Z'
    const hull = 'M-35.4 -1.8L-24 -12.4H23L31 -7V-1.8Z'
    const turret = 'M-15.6 -12.4C-16.4 -17.6 -13.2 -23.4 -4 -24C6 -24.4 13 -21 15.4 -12.4Z'
    const mantlet = roundRect(-20.4, -21, -14.6, -13.6, 1.4)
    const gun = 'M-20 -18.8H-44V-16H-20Z'
    const muzzle = roundRect(-46, -19.8, -42.4, -15, 0.6)
    const cupola = 'M1.6 -23.6C1.6 -26.4 3.8 -27.6 7 -27.6C10.2 -27.6 12.4 -26.4 12.4 -23.6Z'
    const wheels = [-21, -13.6, -3.8, 3.6, 13, 20.4]
    const links = Array.from({ length: 20 }, (_, i) => `M${f(-27 + i * 2.85)} 14.6V16.4`).join('') + Array.from({ length: 22 }, (_, i) => `M${f(-33 + i * 3)} 2.6V4`).join('')
    const pennant = 'M17.6 -40.2L26 -37.6L17.8 -35.2Z'
    const puff = (x: number, y: number, s: number) => {
      const d = blob(0, 0, 4, 0.7, 6)
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.5) }], 0.45 / s) + `</g>`
    }
    return (
      field(k) +
      k.sun(60, 54, 15, 46, 32, false) +
      k.shade(ellipse(60, 56, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
      k.floor(62, 88, 32, 3.4, P.mid) +
      puff(88, 84, 1.1) + puff(93, 77, 0.8) + puff(82, 89, 0.7) +
      die(k, 33.4, 82.6, 5.6, -16) +
      `<g transform="translate(65 68.6) rotate(-7) scale(.86)">` +
      k.cast([track, hull, turret], 2.4, 2.6, P.mid) +
      `<path d="M17.6 -22L17.6 -40.6" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([{ d: pennant, fill: TEG_L, inner: `<path d="M17.6 -40.2L26 -37.6" stroke="${P.white}" stroke-width=".5"/>` }], 0.4) +
      k.draw([
        { d: track, fill: P.mid, inner: k.sh(track, 0, 0, 0, 1, 0, 0.8, P.night, 0.5) + `<path d="${links}" stroke="${P.night}" stroke-width=".7"/>` },
      ], 0.75) +
      wheels.map((x) => k.draw([{ d: ellipse(x, 10.8, 3.5, 3.5), fill: P.sky2, inner: k.sh(ellipse(x, 10.8, 3.5, 3.5), 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<circle cx="${x}" cy="10.8" r="2.3" fill="none" stroke="${P.mid}" stroke-width=".5"/>` }], 0.45) + `<circle cx="${x}" cy="10.8" r="1" fill="${P.ink}"/>`).join('') +
      [-17.3, 0, 16.7].map((x) => `<path d="M${f(x - 4)} 8.4L${f(x - 2)} 5.6H${f(x + 2)}L${f(x + 4)} 8.4Z" fill="${TEG_D}" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      k.draw([{ d: ellipse(-30.4, 6.6, 4.2, 4.2), fill: P.sky2, inner: k.sh(ellipse(-30.4, 6.6, 4.2, 4.2), 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) }, { d: ellipse(31, 6.6, 3.4, 3.4), fill: P.sky2, inner: k.sh(ellipse(31, 6.6, 3.4, 3.4), 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) }], 0.45) +
      `<path d="${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `M${f(-30.4 + Math.cos(a) * 2.2)} ${f(6.6 + Math.sin(a) * 2.2)}L${f(-30.4 + Math.cos(a) * 4)} ${f(6.6 + Math.sin(a) * 4)}` }).join('')}" stroke="${P.mid}" stroke-width=".7"/><circle cx="-30.4" cy="6.6" r="1.2" fill="${P.ink}"/><circle cx="31" cy="6.6" r="1" fill="${P.ink}"/>` +
      k.draw([
        { d: fender, fill: TEG_D, inner: `<path d="M-37 -1H36.6" stroke="${TEG_L}" stroke-width=".4"/>` },
        {
          d: hull, fill: TEG,
          inner:
            k.sh('M-36 -13H32V-1H-36Z', 0, 0, 0, 1, 0, 0.7, TEG_D, 0.45) + `<path d="M-35.4 -1.8L-24 -12.4H-20L-30 -1.8Z" fill="${TEG_L}" opacity=".7"/>` +
            `<path d="M-22 -12.4V-1.8M23 -12.4V-1.8" stroke="${TEG_D}" stroke-width=".45"/>` +
            Array.from({ length: 9 }, (_, i) => `<circle cx="${f(-18 + i * 4.6)}" cy="-10.6" r=".4" fill="${TEG_D}"/>`).join(''),
        },
        { d: gun, fill: TEG, inner: k.sh(gun, 0, 0, 0, 1, 0, 0.8, TEG_D, 0.5) + `<path d="M-44 -18H-20" stroke="${TEG_XL}" stroke-width=".5"/>` },
        { d: muzzle, fill: TEG_D },
        {
          d: turret, fill: TEG,
          inner: k.sh(turret, 0, 0, 1, 1, 0, 0.9, TEG_D, 0.5) + `<path d="M-16 -25H-4V-12H-16Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.55, 0)}"/>` + hair(-10, -21, -2, -22.6, 8, -21, 0.45, TEG_XL) + hair(-12, -14, -2, -15, 12, -14, 0.4, TEG_D),
        },
        { d: cupola, fill: TEG_D, inner: `<path d="M3 -25H11" stroke="${TEG_L}" stroke-width=".5"/>` },
        { d: mantlet, fill: TEG, inner: k.sh(mantlet, 0, 0, 1, 1, 0, 0.9, TEG_D, 0.5) },
      ], 0.75) +
      `<path d="M-31 -6.2L-28.6 -6.2" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<circle cx="7" cy="-6.8" r="4.8" fill="none" stroke="${P.white}" stroke-width=".7"/><path d="${starPath(7, -6.8, 4, 1.6, 5)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      `</g>` +
      sparkle(36, 36, 2.2) + sparkle(88, 44, 1.6) +
      k.defs()
    )
  },

  // Doscientos países: la espada de Atila clavada en la tierra reseca, donde no vuelve a crecer el pasto.
  'Atila': (u) => {
    const k = kit(u)
    const S = 1.18, GY = 50, GROUND = 76.6
    const blade = 'M-3.4 1.6H3.4L3.1 46L0 52L-3.1 46Z'
    const guard = 'M-11 -2.6H11C12.4 -2.6 13.2 -1.6 13 -.4L12.6 .8C12.4 1.8 11.6 2.6 10.4 2.6H-10.4C-11.6 2.6 -12.4 1.8 -12.6 .8L-13 -.4C-13.2 -1.6 -12.4 -2.6 -11 -2.6Z'
    const grip = 'M-2.8 -2.6H2.8L2.4 -14.8H-2.4Z'
    const pommel = 'M-6.2 -14.6H6.2C6.8 -14.6 7.2 -15.2 7 -15.8L5.8 -19.4C5.4 -20.4 4.6 -21 3.6 -21H-3.6C-4.6 -21 -5.4 -20.4 -5.8 -19.4L-7 -15.8C-7.2 -15.2 -6.8 -14.6 -6.2 -14.6Z'
    // Celdas de granate engarzadas en oro (cloisonné), como en las espadas de los hunos.
    const cells = (x0: number, y0: number, w: number, h: number, n: number) => Array.from({ length: n }, (_, i) => {
      const x = x0 + i * (w / n) + 0.35, cw = w / n - 0.7
      const shape = i % 2 ? `M${f(x)} ${f(y0)}H${f(x + cw)}V${f(y0 + h)}H${f(x)}Z` : `M${f(x + cw / 2)} ${f(y0)}L${f(x + cw)} ${f(y0 + h / 2)}L${f(x + cw / 2)} ${f(y0 + h)}L${f(x)} ${f(y0 + h / 2)}Z`
      return `<path d="${shape}" fill="${P.red}" stroke="${P.goldD}" stroke-width=".3"/><path d="M${f(x + 0.3)} ${f(y0 + 0.5)}h${f(cw * 0.35)}" stroke="#F3A79F" stroke-width=".35"/>`
    }).join('')
    const wire = Array.from({ length: 6 }, (_, i) => `<path d="M-2.8 ${f(-4.2 - i * 1.8)}L2.7 ${f(-3.2 - i * 1.8)}" stroke="${P.ink}" stroke-width=".8"/><path d="M-2.8 ${f(-4.2 - i * 1.8)}L2.7 ${f(-3.2 - i * 1.8)}" stroke="${P.gold}" stroke-width=".4"/>`).join('')
    const ground = 'M10 86C26 77.6 44 76.4 60 76.6C76 76.4 94 77.6 110 86V112H10Z'
    // Barro seco: un panal de grietas irregular, en perspectiva (las celdas crecen hacia adelante).
    const jit = (a: number) => Math.sin(a * 12.9898) * 0.5 + Math.sin(a * 4.1) * 0.35
    const mp = (i: number, j: number) => {
      const v = i / 5, w = 4.6 + v * 7.4, y0 = 77.4 + Math.pow(v, 1.25) * 26
      return [f(60 + (j - 14) * w * 0.55 + jit(i * 31 + j) * w * 0.34), f(y0 + ((i + j) % 2 ? w * 0.26 : 0) + jit(i * 17 + j * 3) * w * 0.2)]
    }
    let mud = ''
    for (let i = 0; i <= 5; i++) {
      mud += 'M' + Array.from({ length: 29 }, (_, j) => mp(i, j).join(' ')).join('L')
      if (i < 5) for (let j = 0; j < 29; j++) if ((i + j) % 2) mud += `M${mp(i, j).join(' ')}L${mp(i + 1, j).join(' ')}`
    }
    const stalk = (x: number, y: number, h: number, bend: number, c: string, w = 0.75) => hair(x, y, x + bend * 0.3, y - h * 0.6, x + bend, y - h, w, c)
    const dead = (x: number, y: number) => stalk(x, y, 8, -5, P.goldD) + stalk(x + 1, y, 7, 4.4, P.brownD) + stalk(x + 0.4, y, 9.4, 0.8, P.goldD) + stalk(x - 1, y, 5.4, -6.4, P.brownD) + stalk(x + 2, y, 5, 6.4, P.goldD, 0.6)
    const green = (x: number, y: number) => stalk(x, y, 7, -2, TEG) + stalk(x + 1, y, 8.6, 1.4, TEG_D) + stalk(x - 1, y, 6, -3.4, TEG_L) + stalk(x + 2, y, 6, 3, TEG)
    const local = (GROUND - GY) / S
    return (
      field(k) +
      k.sun(60, 44, 14, 46, 32, false) +
      k.shade(ellipse(60, 44, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(49, 99, 31, 92, 29, 64, 8) + laurel(71, 99, 89, 92, 91, 64, 8, true) +
      k.draw([{
        d: ground, fill: DRY,
        inner:
          k.sh(ground, 0, 0, 0, 1, 0, 0.9, P.brown, 0.45) + k.sh('M76 76H112V112H76Z', 0, 0, 1, 0, 0, 0.6, P.brown, 0.35) +
          `<path d="${mud}" fill="none" stroke="${P.brownD}" stroke-width=".55" stroke-linejoin="round"/>` +
          `<path d="${mud}" fill="none" stroke="${P.goldL}" stroke-width=".35" stroke-linejoin="round" transform="translate(-.4 -.5)" opacity=".7"/>`,
      }], 0.75) +
      k.shade(ellipse(60, 79.6, 22, 4.6), k.rad(P.brownD, 0.5, 0.5, 0.5, 0.85, 0), P.brownD, 0.45) +
      k.clip('M0 0H120V86H110C94 77.6 76 76.4 60 76.6C44 76.4 26 77.6 10 86H0Z', `<g transform="translate(60 ${GY}) scale(${S})">` + k.cast([blade, guard, pommel], 1.4, 1.2, P.brownD) + `</g>`) +
      `<g transform="translate(60 ${GY}) scale(${S})">` +
      k.clip(`M-20 -30H20V${f(local)}H-20Z`, k.draw([{
        d: blade, fill: P.sky1,
        inner: `<path d="M-3.4 1.6H0V52L-3.1 46Z" fill="#fff"/>` + k.sh('M0 0H4V52H0Z', 0, 0, 1, 0, 0.2, 0.9, P.blue, 0.4) + `<path d="M-.9 3H.9V44H-.9Z" fill="${P.mid}" opacity=".45"/><path d="M-1.3 3V44" stroke="#fff" stroke-width=".4"/>` + hair(-2.4, 6, -2.6, 14, -2.2, 20, 0.5, '#fff'),
      }], 0.75 / S)) +
      `<path d="M-5.4 ${f(local)}C-2 ${f(local - 1)} 2 ${f(local - 1)} 5.4 ${f(local)}" fill="none" stroke="${P.brownD}" stroke-width=".9"/>` +
      k.draw([
        { d: grip, fill: P.wine, inner: wire },
        { d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + cells(-5.4, -19.2, 10.8, 3.4, 5) },
        { d: guard, fill: P.gold, inner: k.sh(guard, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + cells(-11.6, -1.7, 23.2, 3.4, 9) + `<path d="M-11 -2H11" stroke="${P.goldL}" stroke-width=".4"/>` },
      ], 0.7 / S) +
      [-13, 13].map((x) => `<circle cx="${x}" cy="0" r="1.4" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${x}" cy="0" r=".5" fill="${P.red}"/>`).join('') +
      `<circle cx="0" cy="-22" r="1.3" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M-4.6 -20C-3.6 -20.8 -2 -21 -.6 -21M-9.4 -1.8C-7 -2.2 -4 -2.2 -2 -2" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      `</g>` +
      k.draw([{ d: 'M51.4 78.6C52.4 76.6 55.4 76 56.8 77.6L55.8 79.6C54 80.2 52.4 80 51.4 78.6Z', fill: DRY, inner: k.sh('M51 75H59V81H51Z', 0, 0, 0, 1, 0, 0.8, P.brown, 0.4) }, { d: 'M63.4 77.6C65 76 68 76.4 68.6 78.4C67.6 79.8 65.6 80 64.2 79.4Z', fill: DRY, inner: k.sh('M62 75H69V81H62Z', 0, 0, 0, 1, 0, 0.8, P.brown, 0.4) }], 0.45) +
      [[46, 62], [75, 58], [40, 70], [81, 68], [55, 66], [70, 70]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.goldD}" opacity=".8"/>`).join('') +
      dead(41, 82.4) + dead(79, 82.6) +
      green(30, 86.4) + green(90, 86.4) +
      hair(36, 74, 33, 66, 36, 58, 0.6, P.blue, 0.55) + hair(85, 74, 88, 66, 85, 57, 0.6, P.blue, 0.55) +
      sparkle(60, 19.6, 2.4, '#fff') + sparkle(86, 40, 1.8) + sparkle(33, 44, 1.6) +
      k.defs()
    )
  },

  // ── Kamchatka ──────────────────────────────────────────────────────

  // La primera defensa: el oso de Kamchatka, orgulloso sobre la roca nevada, con la aurora verde en el lomo.
  'Oso siberiano': (u) => {
    const k = kit(u)
    const bear =
      'M31 64C32 62.4 34.6 61.2 37.4 60.6C39 59.2 40.4 57.6 42 56.6C41.8 54.6 43.4 53.2 45.2 53.6C46.8 54 47.4 55.6 46.8 57C50 55.4 54 52 59.4 51' +
      'C64 50 68.4 50.4 72 51.6C79 53 85 54 88.6 57.6C91.4 60.6 91.8 65.4 90.4 69C89.8 73 90.6 79 91.4 83C91.8 85 91 86.4 89.4 86.4H83.2C82 86.4 81.6 85.2 82.4 84.4' +
      'C82.8 80.6 82.4 76.6 80.6 73.4C74 75.4 66 75.6 60.4 74.4C59.8 78 60.2 82 60.8 84.4C61.2 86 60.4 87 58.8 87H52.2C50.8 87 50.4 85.8 51.4 85' +
      'C52 81 51.6 76 50 71.6C48 68.4 45 67.4 41.6 67C38 66.8 34.6 66.2 32.6 65.4C31.4 65 30.8 64.6 31 64Z'
    const farFront = 'M46 70C45 75.6 44.6 80.4 44 84.4C43.6 86 44.2 87 45.6 87H50.6C51.8 87 52 85.8 51.2 85C51 81 51.4 76 52.4 72Z'
    const farRear = 'M77 72C77.4 77 78.4 81 79 84.4C79.4 86 78.8 87 77.4 87H72C70.8 87 70.6 85.8 71.4 85C71.2 81 70.6 77 69.6 73Z'
    const rock = 'M14 92C22 85.6 32 85.4 42 87.4C52 85.6 66 85.8 76 87.6C86 85.4 98 87 108 92V114H14Z'
    const snowCap = 'M14 92C22 85.6 32 85.4 42 87.4C52 85.6 66 85.8 76 87.6C86 85.4 98 87 108 92C98 90.6 92 92 86 91C80 90 74 92.6 66 91C58 89.6 50 92.6 42 91.2C34 90 24 92.4 14 92Z'
    const fur = [
      [52, 56, 58, 53.4, 64, 53], [60, 58, 66, 56, 72, 56.4], [72, 55, 78, 55.4, 84, 58], [70, 63, 76, 62, 82, 64.4], [58, 64, 62, 62, 68, 62.6],
      [86, 63, 87.4, 66.6, 86.6, 70], [85.6, 73, 86.4, 77, 87.6, 81], [55, 75, 55.6, 79, 55.4, 83], [48, 60, 50, 58, 53.4, 57.6], [43, 61.4, 45.6, 60.6, 48, 61.6],
      [62, 70, 66, 71.4, 72, 71], [52, 66, 54, 68, 56, 70.4], [76, 68, 78.6, 69, 81, 71],
    ].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.55, BEAR_D)).join('')
    const sheen = [[50, 54.4, 56, 52, 62, 51.6], [64, 51.6, 70, 51.4, 76, 52.6], [36, 61.4, 39, 59.8, 42, 59.4]].map(([a, b, c, d, e, g]) => hair(a, b, c, d, e, g, 0.45, BEAR_L)).join('')
    const rim = hair(47.6, 55.6, 55, 51, 66, 50.2, 0.9, TEG_L, 0.95) + hair(68, 50.6, 80, 52.4, 88.6, 57.4, 0.8, TEG_L, 0.85) + hair(43.2, 54, 44.4, 53.4, 45.8, 54.2, 0.5, TEG_L) + hair(89.6, 60, 91, 64, 90.2, 68, 0.6, TEG_L, 0.6)
    const ruff = Array.from({ length: 10 }, (_, i) => { const x = 61 + i * 2; return `M${f(x)} ${f(74.6 + Math.sin(i * 1.3) * 0.3)}l.9 1.7l.9 -1.5` }).join('') + 'M42 67.2l.6 1.6l1 -1.2M45 67.8l.4 1.6l1 -1.2'
    const flakes = [[34, 36, 1.4], [86, 30, 1.2], [96, 58, 1], [28, 72, 1.1], [50, 32, 0.9], [72, 40, 0.8]].map(([x, y, r]) => sparkle(x, y, r, P.white)).join('')
    return (
      aurora(k) +
      k.draw([{ d: rock, fill: P.sky, inner: k.sh(rock, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + hair(30, 96, 36, 100, 44, 102, 0.5, P.mid) + hair(70, 96, 78, 100, 88, 100, 0.5, P.mid) }], 0.7) +
      `<path d="${snowCap}" fill="${P.white}"/>` + k.sh(snowCap, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.4) +
      `<g transform="translate(60 70) scale(.94) translate(-60 -70)">` +
      k.floor(67, 87.6, 27, 2.2, P.mid) +
      k.draw([{ d: farFront, fill: BEAR_D, inner: hair(47.6, 74, 47, 79, 46.6, 84, 0.4, BEAR) }, { d: farRear, fill: BEAR_D, inner: hair(73.6, 75, 74.4, 80, 75, 84, 0.4, BEAR) }], 0.6) +
      k.draw([{
        d: bear, fill: BEAR,
        inner:
          k.sh('M28 66H96V90H28Z', 0, 0, 0, 1, 0, 0.9, BEAR_D, 0.5) + k.sh('M78 48H96V90H78Z', 0, 0, 1, 0, 0, 0.75, BEAR_D, 0.4) +
          `<path d="M28 48H62V62H28Z" fill="${k.lin(BEAR_L, 0, 0, 0, 1, 0.75, 0)}"/>` + fur + sheen + rim +
          `<path d="${ruff}" fill="none" stroke="${BEAR_D}" stroke-width=".5"/>` +
          `<path d="M31.4 63.2C33.4 62 35.6 61.6 37.6 61.8" fill="none" stroke="${BEAR_L}" stroke-width=".7"/>`,
      }], 0.8) +
      `<path d="M43.6 55.4C44 54.6 45 54.4 45.6 55" fill="none" stroke="${BEAR_D}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M30.6 63.4C30.8 62.2 32.2 61.8 33 62.6C33.4 63.4 32.6 64.4 31.6 64.6C31 64.6 30.6 64.1 30.6 63.4Z" fill="${P.ink}"/>` +
      `<path d="M32.6 65.4C34 65.8 35.6 65.8 36.6 65.4" fill="none" stroke="${BEAR_D}" stroke-width=".6" stroke-linecap="round"/>` +
      `<path d="M38.6 60.6C39.4 60 40.6 60 41.2 60.6C40.6 61.2 39.4 61.2 38.6 60.6Z" fill="${P.ink}"/><circle cx="39.6" cy="60.5" r=".25" fill="${TEG_XL}"/>` +
      `<path d="M52 86.6l.6 -1.4M54.4 86.8l.4 -1.6M56.8 86.8l.2 -1.6M84 86l.6 -1.4M86.6 86.2l.3 -1.6M89 86.2l.1 -1.6" stroke="${P.paper}" stroke-width=".55" stroke-linecap="round"/>` +
      `</g>` +
      flakes +
      k.defs()
    )
  },

  // Cinco defensas: la muralla de hielo con las fichas verdes de guardia y la bandera arriba.
  'Muralla helada': (u) => {
    const k = kit(u)
    const wall = 'M20 96V60H31V52.6H44.6V60H53.2V52.6H66.8V60H75.4V52.6H89V60H100V96Z'
    const rows = [66.6, 73.4, 80.2, 87]
    const joints = [
      [36, 48, 60, 72, 84], [30, 42, 54, 66, 78, 90], [36, 48, 60, 72, 84], [30, 42, 54, 66, 78, 90], [36, 48, 60, 72, 84],
    ].map((xs, r) => xs.map((x) => `M${x} ${r ? rows[r - 1] : 60}V${rows[r] ?? 96}`).join('')).join('')
    const merlonJ = 'M37.8 52.6V60M60 52.6V60M82.2 52.6V60'
    const glints = [[25, 63], [39, 70], [53, 63], [67, 77], [81, 70], [95, 63], [33, 84], [61, 84], [89, 84], [47, 77], [75, 63], [34, 55], [56, 55], [78, 55]]
      .map(([x, y]) => `<path d="M${x} ${f(y + 3)}L${f(x + 4)} ${y}" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".85"/><path d="M${f(x + 1.4)} ${f(y + 3.6)}L${f(x + 3.4)} ${f(y + 2.2)}" stroke="#fff" stroke-width=".4" stroke-linecap="round" opacity=".7"/>`).join('')
    const snow = (x0: number, x1: number, y: number) => `M${x0 - 0.6} ${y}C${x0 - 1} ${f(y - 2.2)} ${f(x0 + 2)} ${f(y - 3.2)} ${f((x0 + x1) / 2)} ${f(y - 2.8)}C${f(x1 - 2)} ${f(y - 3.2)} ${x1 + 1} ${f(y - 2.2)} ${x1 + 0.6} ${y}C${f(x1 - 2)} ${f(y + 1)} ${f(x1 - 4)} ${f(y + 0.2)} ${f((x0 + x1) / 2 + 1)} ${f(y + 1.2)}C${f(x0 + 4)} ${f(y + 0.4)} ${f(x0 + 2)} ${f(y + 1.4)} ${x0 - 0.6} ${y}Z`
    const icicles = [[33, 60, 3.4], [36, 60, 2], [47, 60, 2.8], [51, 60, 4.2], [70, 60, 3], [73, 60, 2], [92, 60, 3.6], [96, 60, 2.4], [40, 52.6, 1.8], [62, 52.6, 2.2], [86, 52.6, 2]]
      .map(([x, y, h]) => `<path d="M${f(x - 0.9)} ${f(y + 0.2)}L${x} ${f(y + h)}L${f(x + 0.9)} ${f(y + 0.2)}Z" fill="${P.white}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
    const drift = 'M12 98C24 91 40 94.4 52 92C66 89.4 82 92 108 97V114H12Z'
    const flag = 'M64.4 30.4C68.6 28.8 72.4 31.6 77.4 29.8V40.2C72.4 42 68.6 39.2 64.4 40.8Z'
    return (
      aurora(k) +
      k.cast([wall], 2.4, 2.4, '#0F1736') +
      k.draw([{
        d: wall, fill: P.sky1,
        inner:
          k.sh(wall, 0, 0, 1, 1, 0, 0.75, P.blue, 0.45) + k.sh('M18 84H102V98H18Z', 0, 0, 0, 1, 0, 0.6, P.mid, 0.4) +
          `<path d="M${rows.map((y) => `20 ${y}H100`).join('M')}M20 60H100" stroke="${P.blue}" stroke-width=".7"/>` +
          `<path d="${joints}${merlonJ}" stroke="${P.blue}" stroke-width=".7"/>` +
          `<path d="M${rows.map((y) => `20 ${f(y + 0.7)}H100`).join('M')}M20 60.7H100" stroke="#fff" stroke-width=".45" opacity=".8"/>` +
          glints + `<path d="M20 52H44V96H20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>`,
      }], 0.75) +
      icicles +
      k.draw([{ d: snow(31, 44.6, 52.8), fill: P.white }, { d: snow(53.2, 66.8, 52.8), fill: P.white }, { d: snow(75.4, 89, 52.8), fill: P.white }], 0.4) +
      `<path d="M64.4 52V28.6" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M64.4 52V28.6" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      `<circle cx="64.4" cy="27.8" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([{ d: flag, fill: TEG, inner: k.sh(flag, 0, 0, 1, 0, 0, 0.8, TEG_D, 0.5) + hair(68, 31, 68.6, 35, 68, 40, 0.5, TEG_D) + hair(72.6, 31, 73, 35, 72.4, 40.4, 0.5, TEG_XL, 0.7) }], 0.55) +
      `<path d="${starPath(70.6, 35.2, 2.4, 1, 5)}" fill="${P.white}" stroke="${TEG_D}" stroke-width=".25"/>` +
      token(k, 38, 52.4, 3.6) + token(k, 57.6, 52.4, 3.4) + token(k, 82.2, 52.4, 3.6) +
      k.draw([{ d: drift, fill: P.white, inner: k.sh(drift, 0, 0, 0, 1, 0, 0.6, P.sky2, 0.45) + hair(30, 96, 40, 94, 50, 95, 0.5, P.sky2) + hair(66, 94, 76, 93, 86, 95, 0.5, P.sky2) }], 0.6) +
      sparkle(30, 40, 1.4, P.white) + sparkle(92, 44, 1.2, P.white) + sparkle(48, 36, 1, P.white) +
      k.defs()
    )
  },

  // Quince defensas: la ciudadanía. El gorro de piel con la escarapela verde, sobre el pasaporte de Kamchatka.
  'Hijo de Kamchatka': (u) => {
    const k = kit(u)
    const crown = 'M-15.4 -9C-16.4 -21.4 -8.6 -28.2 0 -28.2C8.6 -28.2 16.4 -21.4 15.4 -9Z'
    const flapL = tufty(-19.4, 1.6, 6.4, 9.4, 18, 1.5)
    const flapR = tufty(19.4, 1.6, 6.4, 9.4, 18, 1.5)
    const front = tufty(0, -8.6, 19.6, 6.6, 40, 1.7)
    const backFur = tufty(0, 2.4, 14.6, 8, 28, 1.3)
    const pass = roundRect(-17, -11, 17, 11, 1.4)
    // Pelos de la piel: trazos cortos que caen hacia afuera y abajo.
    const furStrokes = (cx: number, cy: number, rx: number, ry: number, n: number, c: string, seed: number, w = 0.5) =>
      Array.from({ length: n }, (_, i) => {
        const a = (i * 2.399 + seed) % (Math.PI * 2), rr = 0.15 + Math.sqrt((i * 0.618 + seed * 0.1) % 1) * 0.8
        const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr, dx = Math.cos(a) * 1.2, dy = 1.8
        return hair(x, y, x + dx * 0.3, y + dy * 0.5, x + dx, y + dy, w, c)
      }).join('')
    const quilt = 'M-9.6 -10C-10.2 -17 -6.8 -24 -1 -27.4M9.6 -10C10.2 -17 6.8 -24 1 -27.4M0 -10V-28M-14.6 -16C-6 -18 6 -18 14.6 -16M-11 -22.6C-4 -24.2 4 -24.2 11 -22.6'
    const ties = 'M-20.4 11.4C-21.4 14 -19.6 16.4 -21 19M20.4 11.4C21.4 14 19.6 16.4 21 19'
    return (
      aurora(k) +
      k.sun(60, 54, 13, 44, 32, false) +
      k.shade(ellipse(60, 56, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.5, 0), P.goldL, 0.3) +
      laurel(46, 100, 28, 94, 24, 66, 7) + laurel(74, 100, 92, 94, 96, 66, 7, true) +
      `<g transform="translate(60 67) scale(1.14)">` +
      k.floor(0, 11, 28, 2.6, '#000') +
      `<path d="${ties}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${ties}" fill="none" stroke="${FUR_D}" stroke-width=".6" stroke-linecap="round"/>` +
      k.draw([
        { d: backFur, fill: FUR_D, inner: k.sh(backFur, 0, 0, 0, 1, 0, 0.9, '#6E5C45', 0.5) + furStrokes(0, 3, 12, 5, 26, '#6E5C45', 5) },
        { d: flapL, fill: FUR, inner: k.sh(flapL, 0, 0, 1, 1, 0, 0.9, FUR_D, 0.5) + `<path d="M-26 -8H-20V12H-26Z" fill="${k.lin(FUR_L, 0, 0, 1, 0, 0.8, 0)}"/>` + furStrokes(-19.4, 0.6, 5.4, 8, 18, FUR_D, 1) },
        { d: flapR, fill: FUR, inner: k.sh(flapR, 0, 0, 1, 1, 0.2, 0.95, FUR_D, 0.5) + furStrokes(19.4, 0.6, 5.4, 8, 18, FUR_D, 2) },
        {
          d: crown, fill: TEG,
          inner: k.sh(crown, 0, 0, 1, 0, 0, 0.9, TEG_D, 0.5) + `<path d="M-17 -30H-6V-6H-17Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.5, 0)}"/>` +
            `<path d="${quilt}" fill="none" stroke="${TEG_D}" stroke-width=".55"/><path d="${quilt}" fill="none" stroke="${TEG_L}" stroke-width=".35" stroke-dasharray=".8 .8" transform="translate(-.5 -.3)"/>` +
            `<circle cx="0" cy="-28" r="1.2" fill="${TEG_D}"/>`,
        },
      ], 0.7) +
      k.draw([{
        d: front, fill: FUR,
        inner: k.sh(front, 0, 0, 1, 1, 0, 0.9, FUR_D, 0.5) + `<path d="M-22 -18H-6V0H-22Z" fill="${k.lin(FUR_L, 0, 0, 1, 0, 0.9, 0)}"/>` +
          furStrokes(0, -8.6, 18, 5.6, 46, FUR_D, 0.4) + furStrokes(-7, -10, 9, 3.4, 14, FUR_L, 3, 0.45),
      }], 0.7) +
      `<ellipse cx="0" cy="-8.8" rx="4.4" ry="5.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/><ellipse cx="0" cy="-8.8" rx="3.4" ry="4.2" fill="${TEG}" stroke="${P.goldD}" stroke-width=".4"/>` +
      `<path d="${starPath(0, -8.8, 2.8, 1.1, 5)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` +
      `<path d="M-2.4 -12.2C-1.6 -13.2 -.6 -13.6 .4 -13.6" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      `</g>` +
      `<g transform="translate(60 89.6) rotate(-5)">` +
      k.cast([pass], 1.8, 1.6, '#000') +
      k.draw([{
        d: pass, fill: TEG,
        inner: k.sh(pass, 0, 0, 1, 1, 0, 0.9, TEG_D, 0.5) + `<path d="M-18 -12H-6V12H-18Z" fill="${k.lin(TEG_XL, 0, 0, 1, 0, 0.4, 0)}"/>` +
          `<path d="${roundRect(-15.2, -9.2, 15.2, 9.2, 0.8)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` + `<path d="M-17 -11V11" stroke="${TEG_D}" stroke-width="1"/>`,
      }], 0.6) +
      `<circle cx="0" cy="-3.6" r="3.4" fill="none" stroke="${P.gold}" stroke-width=".6"/><path d="${ellipse(0, -3.6, 1.4, 3.4)}M-3.4 -3.6H3.4" fill="none" stroke="${P.gold}" stroke-width=".4"/>` +
      `<text x="0" y="5" ${GEORGIA} font-size="3.4" letter-spacing=".25" fill="${P.goldL}" text-anchor="middle">KAMCHATKA</text>` +
      `<text x="0" y="8.4" ${GEORGIA} font-style="italic" font-size="2.2" fill="${P.gold}" text-anchor="middle">pasaporte</text>` +
      `</g>` +
      sparkle(88, 36, 2.2, P.white) + sparkle(32, 38, 1.6, P.white) + sparkle(94, 62, 1.2, P.white) +
      k.defs()
    )
  },
}
