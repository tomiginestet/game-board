// Splendor: Alta sociedad, Joyero y Gran inversión.
// El color propio del juego es el jade de su ficha (#0CA678): el fondo granulado, el terciopelo y las esmeraldas.
// Las gemas son las cinco del juego (esmeralda, zafiro, rubí, diamante y ónix), talladas de verdad (brillante, talla
// esmeralda, perfil de diamante) y engarzadas en oro con garras, chatones y grano de orfebrería. Nada de caras: la
// reina y los nobles aparecen por sus objetos.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El jade de la ficha de Splendor, con su sombra y su luz; el verde agua del fondo.
const JADE = '#13A47B', JADE_D = '#0B6B51', JADE_L = '#9BDCC4'
const FONDO = '#A4DDC9', FONDO_G = '#76C2A8'
// Hojalata y su verdín.
const TIN = '#C3CAD3', TIN_D = '#8792A1'
const VERDIN = '#86B98F', VERDIN_D = '#4F8461'
// La roca madre (kimberlita) del diamante en bruto, de la luz a la sombra.
const ROCA = ['#BDB3A2', '#998D7A', '#736754', '#4E4537']

/** Fondo de Splendor: el papel con el verde agua del jade granulado hacia los bordes. */
const salon = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(FONDO, 0.5, 0.46, 0.7, 0, 1), FONDO_G, 0.5)

/** Vitrina: un disco verde agua con el borde granulado (el escenario de Splendor). */
const vitrina = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#E3F3EC"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(FONDO, 0.5, 0.5, 0.5, 0, 1), FONDO_G, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${JADE}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Anillo elíptico (el agujero va girado al revés para que quede hueco). */
const ringE = (cx: number, cy: number, Rx: number, Ry: number, rx: number, ry: number, dy = 0) =>
  ellipse(cx, cy, Rx, Ry) + `M${f(cx - rx)} ${f(cy + dy)}A${rx} ${ry} 0 1 1 ${f(cx + rx)} ${f(cy + dy)}A${rx} ${ry} 0 1 1 ${f(cx - rx)} ${f(cy + dy)}Z`

// ── Gemas ─────────────────────────────────────────────────────────────

type Pt = [number, number]
/** Los cuatro tonos de una piedra: luz, cuerpo, sombra y fondo. */
type Tones = readonly [string, string, string, string]
const RUBI: Tones = ['#F6A3A6', '#D6424B', '#A12937', P.wine]
const ZAFIRO: Tones = ['#BCD0F4', '#5C7BD0', '#3A4FA2', P.night]
const ESMERALDA: Tones = ['#A8E8D0', '#1BA77D', '#0E7757', '#074A37']
const DIAMANTE: Tones = ['#FFFFFF', '#EEF3FA', '#C2D0EA', '#8A9DD0']
const ONIX: Tones = ['#A39BAE', '#544B5F', '#342D3E', '#1A1520']
const VIDRIO: Tones = ['#FFD3DC', '#EE7290', '#C2456A', '#86284A']

const poly = (ps: Pt[]) => 'M' + ps.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z'
const centroid = (ps: Pt[]): Pt => [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length]
/** Tono de una faceta según hacia dónde mira (la luz viene de arriba a la izquierda). */
const dirTone = (dx: number, dy: number, bias = 0) => {
  const s = (dx * -0.6 + dy * -0.8) / (Math.hypot(dx, dy) || 1)
  return Math.max(0, Math.min(3, (s > 0.5 ? 0 : s > -0.05 ? 1 : s > -0.6 ? 2 : 3) + bias))
}
/** Facetas pintadas con su tono y el filo fino de la talla. */
const facets = (list: { ps: Pt[]; tone: number }[], t: Tones, edge = 0.22) =>
  list.map(({ ps, tone }) => `<path d="${poly(ps)}" fill="${t[tone]}"/>`).join('') +
  `<path d="${list.map(({ ps }) => poly(ps)).join('')}" fill="none" stroke="${t[3]}" stroke-width="${edge}" stroke-linejoin="round" opacity=".6"/>`

/** Brillante visto desde arriba: mesa octogonal, estrellas, cometas y medias del filetín (32 facetas). */
function brilliant(k: Kit, cx: number, cy: number, r: number, t: Tones, ry = r, w = 0.5) {
  const sy = ry / r, a0 = -Math.PI / 2 + Math.PI / 8, st = Math.PI / 4
  const at = (rad: number, a: number): Pt => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * sy]
  const T = (j: number) => at(r * 0.54, a0 + ((j + 8) % 8) * st)
  const M = (j: number) => at(r * 0.8, a0 + ((j + 8) % 8) * st + st / 2)
  const G = (i: number) => at(r, a0 + ((i + 16) % 16) * (st / 2))
  const list: { ps: Pt[]; tone: number }[] = []
  for (let j = 0; j < 8; j++) {
    const parts: [Pt[], number][] = [[[T(j), T(j + 1), M(j)], -1], [[T(j), M(j - 1), G(2 * j), M(j)], 0], [[M(j), G(2 * j), G(2 * j + 1)], 1], [[M(j), G(2 * j + 1), G(2 * j + 2)], 0]]
    for (const [ps, b] of parts) { const c = centroid(ps); list.push({ ps, tone: dirTone(c[0] - cx, c[1] - cy, b) }) }
  }
  const girdle = poly(Array.from({ length: 16 }, (_, i) => G(i)))
  const table = poly(Array.from({ length: 8 }, (_, j) => T(j)))
  return (
    k.draw([{ d: girdle, fill: t[1] }], w) + facets(list, t, r > 4 ? 0.22 : 0.15) +
    `<path d="${table}" fill="${t[1]}"/><path d="${table}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.8, 0)}"/>` +
    `<path d="${table}" fill="none" stroke="${t[3]}" stroke-width="${r > 4 ? 0.22 : 0.15}" opacity=".6"/>` +
    k.sh(girdle, 0, 0, 1, 1, 0, 0.55, t[3], 0.25)
  )
}

/** Talla esmeralda (rectángulo con las puntas cortadas): tres escalones de facetas y la mesa con su reflejo. */
function stepCut(k: Kit, cx: number, cy: number, w: number, h: number, c: number, t: Tones, lw = 0.5) {
  const oct = (s: number): Pt[] => {
    const W = w * s, H = h * s, C = c * s
    return ([[-W + C, -H], [W - C, -H], [W, -H + C], [W, H - C], [W - C, H], [-W + C, H], [-W, H - C], [-W, -H + C]] as Pt[]).map(([x, y]) => [cx + x, cy + y] as Pt)
  }
  const N: Pt[] = [[0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7], [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7]]
  const rings = [1, 0.8, 0.63, 0.47]
  const list: { ps: Pt[]; tone: number }[] = []
  for (let r = 0; r < 3; r++) {
    const O = oct(rings[r]), I = oct(rings[r + 1])
    for (let i = 0; i < 8; i++) { const j = (i + 1) % 8; list.push({ ps: [O[i], O[j], I[j], I[i]], tone: dirTone(N[i][0], N[i][1], r % 2) }) }
  }
  const out = poly(oct(1)), table = poly(oct(0.47))
  return (
    k.draw([{ d: out, fill: t[1] }], lw) + facets(list, t) +
    `<path d="${table}" fill="${t[1]}"/><path d="${table}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.7, 0)}"/>` +
    `<path d="${poly(oct(0.3))}" fill="none" stroke="${t[2]}" stroke-width=".25" opacity=".7"/>` +
    `<path d="${table}" fill="none" stroke="${t[3]}" stroke-width=".22" opacity=".6"/>` +
    k.sh(out, 0, 0, 1, 1, 0, 0.5, t[3], 0.25)
  )
}

/** Diamante de perfil: corona con su mesa arriba, filetín en (cx,cy) y pabellón que baja hasta la culata. */
function sideGem(k: Kit, cx: number, cy: number, w: number, ch: number, ph: number, t: Tones, lw = 0.5) {
  const T = [-0.56, -0.19, 0.19, 0.56].map((x) => [cx + x * w, cy - ch] as Pt)
  const G = [-1, -0.56, 0, 0.56, 1].map((x) => [cx + x * w, cy] as Pt)
  const C: Pt = [cx, cy + ph]
  const seq = [G[0], T[0], G[1], T[1], G[2], T[2], G[3], T[3], G[4]]
  const list: { ps: Pt[]; tone: number }[] = []
  for (let i = 0; i < seq.length - 2; i++) {
    const ps = [seq[i], seq[i + 1], seq[i + 2]], x = (centroid(ps)[0] - cx) / w
    list.push({ ps, tone: Math.min(3, (x < -0.4 ? 0 : x < 0.25 ? 1 : 2) + (i % 2 ? 0 : 0)) })
  }
  const pav = [1, 2, 1, 3]
  for (let i = 0; i < 4; i++) list.push({ ps: [G[i], G[i + 1], C], tone: pav[i] })
  // Medias del pabellón: dos facetas largas más que cruzan cada mitad.
  const out = poly([G[0], T[0], T[3], G[4], C])
  return (
    k.draw([{ d: out, fill: t[1] }], lw) + facets(list, t) +
    `<path d="M${f(T[0][0])} ${f(T[0][1])}H${f(T[3][0])}" stroke="#fff" stroke-width=".5" opacity=".8"/>` +
    k.sh(out, 0, 0, 1, 1, 0, 0.5, t[3], 0.25)
  )
}

/** Garra de oro que muerde la piedra, en (x,y) y apuntando hacia (tx,ty). */
const claw = (x: number, y: number, tx: number, ty: number, s = 1) => {
  const a = (Math.atan2(ty - y, tx - x) * 180) / Math.PI + 90
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${s})"><path d="M-1.5 1.6C-1.7 -.6 -.9 -2 0 -2C.9 -2 1.7 -.6 1.5 1.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><path d="M-.7 -.9C-.4 -1.4 0 -1.5 .4 -1.3" fill="none" stroke="${P.goldL}" stroke-width=".35" stroke-linecap="round"/></g>`
}

/** Chatón: el aro de oro debajo de una piedra redonda, con su grano. */
const collet = (k: Kit, cx: number, cy: number, r: number, ry = r, w = 0.5) =>
  k.draw([{ d: ellipse(cx, cy, r, ry), fill: P.gold, inner: k.sh(ellipse(cx, cy, r, ry), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], w) +
  `<path d="${ellipse(cx, cy, f(r - 0.6), f(ry - 0.6))}" fill="none" stroke="${P.goldL}" stroke-width=".55" stroke-dasharray=".01 .9" stroke-linecap="round"/>`

/** Piedra redonda engarzada: chatón, brillante y seis garras. */
const setStone = (k: Kit, cx: number, cy: number, r: number, t: Tones, prongs = 6) =>
  collet(k, cx, cy, r + 1.1) + brilliant(k, cx, cy, r, t, r, 0.3) +
  Array.from({ length: prongs }, (_, i) => { const a = (i / prongs) * Math.PI * 2 - Math.PI / 2 + Math.PI / prongs; return claw(cx + Math.cos(a) * (r + 0.4), cy + Math.sin(a) * (r + 0.4), cx, cy, r / 5) }).join('')

type V3 = [number, number, number]
/** Sólido convexo girado y visto un poco desde arriba: las caras que miran al frente, con cuánta luz reciben. */
function solid(verts: V3[], faces: number[][], ry: number, rx: number, s: number, cx: number, cy: number) {
  const c1 = Math.cos(ry), s1 = Math.sin(ry), c2 = Math.cos(rx), s2 = Math.sin(rx)
  const R = verts.map(([x, y, z]): V3 => { const x1 = x * c1 + z * s1, z1 = -x * s1 + z * c1; return [x1, y * c2 - z1 * s2, y * s2 + z1 * c2] })
  const L: V3 = [-0.45, 0.62, 0.64]
  return faces.map((fc) => {
    const ps = fc.map((i) => R[i]), [a, b, c] = ps
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    let n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
    const m = [0, 1, 2].map((i) => ps.reduce((t, p) => t + p[i], 0) / ps.length)
    if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) n = [-n[0], -n[1], -n[2]]
    const len = Math.hypot(...n) || 1
    n = [n[0] / len, n[1] / len, n[2] / len]
    return { ps: ps.map((p) => [cx + p[0] * s, cy - p[1] * s] as Pt), n, lit: n[0] * L[0] + n[1] * L[1] + n[2] * L[2] }
  }).filter((q) => q.n[2] > 0.02)
}

/** Envoltura convexa de unos puntos (para los tubos de los gemelos). */
function hull(pts: Pt[]): Pt[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: Pt[] = [], up: Pt[] = []
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of p.reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
const circlePts = (cx: number, cy: number, r: number, n = 40): Pt[] => Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r])

/** Corona real abierta: aro con piedras, cinco puntas con perlas, el bonete de terciopelo y la crucecita. Base en (0,0). */
function crown(k: Kit) {
  const cap = 'M-9 -5C-9.6 -12.6 -4.6 -15 0 -15C4.6 -15 9.6 -12.6 9 -5Z'
  const points = 'M-10.4 -4.6L-12.2 -11.8L-9 -7.8L-6.4 -14.2L-3.2 -8.6L0 -16.6L3.2 -8.6L6.4 -14.2L9 -7.8L12.2 -11.8L10.4 -4.6C4 -3.2 -4 -3.2 -10.4 -4.6Z'
  const band = 'M-10.6 -5.2C-4 -3.8 4 -3.8 10.6 -5.2L10.2 .4C4 1.8 -4 1.8 -10.2 .4Z'
  return (
    k.draw([{ d: cap, fill: P.red, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + hair(-3, -6, -3.6, -10, -2.4, -13.4, 0.45, P.wine) + hair(3.4, -6, 4, -10, 3, -13, 0.45, P.wine) }], 0.5) +
    k.draw([{ d: points, fill: P.gold, inner: k.sh(points, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-12 -12H-3V-3H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` }], 0.55) +
    [[-12.2, -11.8, 1], [-6.4, -14.2, 1.1], [0, -16.6, 1.2], [6.4, -14.2, 1.1], [12.2, -11.8, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff"/>`).join('') +
    `<path d="M-.5 -17.6V-21.4H.5V-17.6ZM-1.7 -20.2H1.7V-19.2H-1.7Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` +
    k.draw([{ d: band, fill: P.gold, inner: k.sh(band, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-10.4 -3.6C-4 -2.2 4 -2.2 10.4 -3.6" fill="none" stroke="${P.goldL}" stroke-width=".4"/>` }], 0.5) +
    `<path d="M-10 -1C-4 .4 4 .4 10 -1" fill="none" stroke="${P.goldD}" stroke-width=".5" stroke-dasharray=".01 .9" stroke-linecap="round"/>` +
    brilliant(k, 0, -2.2, 1.9, RUBI, 1.6, 0.3) + brilliant(k, -6, -2.7, 1.4, ESMERALDA, 1.2, 0.3) + brilliant(k, 6, -2.7, 1.4, ZAFIRO, 1.2, 0.3)
  )
}

export const SPLENDOR_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Alta sociedad ──────────────────────────────────────────────────

  // Dos nobles en casa: sacaste la vajilla buena. La taza de porcelana con filete de oro, guarda de jade y su rubí.
  'Te tomaste el té': (u) => {
    const k = kit(u)
    const saucer = ellipse(60, 85, 27, 7.2)
    const body = 'M41.6 55C41.6 67.4 47.6 77.2 56 79.6H64C72.4 77.2 78.4 67.4 78.4 55Z'
    const rim = ellipse(60, 55, 18.4, 4.4)
    const tea = ellipse(60, 55.6, 16, 3)
    const foot = 'M53.2 79.2H66.8L68.4 83.4H51.6Z'
    const handle = 'M77.6 59.6C83.6 56.6 90.2 58.4 89.8 63.8C89.4 69.4 82.4 72.6 74.8 73.6L75.6 70C80.6 69.4 85.8 67.2 86 63.8C86.2 61 82.6 60.6 77.8 63Z'
    const gilt = 'M41 55.6C45.6 58.8 52.6 60.4 60 60.4C67.4 60.4 74.4 58.8 79 55.6V58.2C74.4 61.4 67.4 63 60 63C52.6 63 45.6 61.4 41 58.2Z'
    const band = 'M42.4 63.4C47 66.4 53.4 68 60 68C66.6 68 73 66.4 77.6 63.4L76.8 67.4C72.2 70.4 66.4 71.8 60 71.8C53.6 71.8 47.8 70.4 43.2 67.4Z'
    const yb = (x: number) => 71.8 - 4.4 * ((x - 60) / 16.8) ** 2
    const xs = [44.4, 49.6, 54.8, 60, 65.2, 70.4, 75.6]
    const swags = xs.slice(0, -1).map((x0, i) => {
      const x1 = xs[i + 1], xm = (x0 + x1) / 2
      return `<path d="M${x0} ${f(yb(x0))}Q${f(xm)} ${f(yb(xm) + 3.4)} ${x1} ${f(yb(x1))}" fill="none" stroke="${P.gold}" stroke-width=".55"/>`
    }).join('') + xs.map((x) => `<circle cx="${x}" cy="${f(yb(x) + 0.3)}" r=".6" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/><path d="M${x} ${f(yb(x) + 0.9)}V${f(yb(x) + 2.4)}" stroke="${P.gold}" stroke-width=".45" stroke-linecap="round"/>`).join('')
    const spoonBowl = ellipse(0, 0, 4.4, 2.3)
    const spoonHandle = taper(4, -0.2, 11, -0.8, 17.6, -1.6, 1.3, 0.8)
    const spoonEnd = ellipse(18.8, -1.8, 1.9, 1.3)
    return (
      salon(k) +
      vitrina(k, 60, 63, 33) +
      k.floor(61, 89.4, 26, 3, JADE_D) +
      k.draw([{
        d: saucer, fill: P.white,
        inner:
          k.sh(saucer, 0, 0, 1, 1, 0, 0.75, P.blue, 0.35) + `<path d="${ellipse(60, 84.8, 25, 6.2)}" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
          `<path d="${ellipse(60, 84.6, 21, 4.9)}" fill="none" stroke="${JADE}" stroke-width="1"/><path d="${ellipse(60, 84.6, 21, 4.9)}" fill="none" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
          `<path d="${ellipse(60, 84, 11.6, 2.8)}" fill="none" stroke="${P.blue}" stroke-width=".35"/>` + `<path d="M38 82C42 79.6 48 78.6 52 78.4" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`,
      }], 0.6) +
      k.floor(60, 83.2, 9, 1.6, P.blue) +
      k.draw([
        { d: foot, fill: P.white, inner: k.sh(foot, 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) + `<path d="M51.8 82.4H68.2" stroke="${P.gold}" stroke-width=".8"/>` },
        { d: handle, fill: P.white, inner: k.sh(handle, 0, 0, 1, 1, 0, 0.85, P.blue, 0.4) + `<path d="M78 61.2C83 58.6 88 60 87.9 63.8C87.8 68 81.6 70.8 75.2 71.8" fill="none" stroke="${P.gold}" stroke-width=".55"/>` },
        {
          d: body, fill: P.white,
          inner:
            `<path d="${gilt}" fill="${P.gold}"/><path d="${gilt}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>` +
            `<path d="${band}" fill="${JADE}"/>` + k.sh(band, 0, 0, 1, 0, 0, 0.8, JADE_D, 0.45) +
            `<path d="M42.6 64.6C47 67.4 53.4 69 60 69C66.6 69 73 67.4 77.4 64.6" fill="none" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` +
            swags +
            k.sh('M64 52C74 58 78 70 70 82H84V52Z', 0, 0, 1, 0, 0, 0.85, P.blue, 0.4) + k.sh('M40 72H80V82H40Z', 0, 0, 0, 1, 0, 0.6, P.blue, 0.3) +
            hair(45.2, 61, 45.6, 69, 50.4, 75.4, 1.3, '#fff'),
        },
        { d: rim, fill: P.white, inner: `<path d="${tea}" fill="#B8702C"/>` + k.sh(tea, 0, 0, 1, 1, 0, 0.9, P.brownD, 0.45) + `<path d="M48 55.2C52 53.8 60 53.4 66 54.2" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-linecap="round" opacity=".85"/>` },
      ], 0.65) +
      `<path d="${rim}" fill="none" stroke="${P.gold}" stroke-width=".8"/><path d="${tea}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
      `<ellipse cx="60" cy="69.8" rx="3.1" ry="2.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` + brilliant(k, 60, 69.8, 1.9, RUBI, 1.5, 0.25) +
      hair(55, 51.6, 51, 45, 55, 37.6, 0.9, P.blue) + hair(62, 51, 65.4, 44, 61.4, 36, 0.8, P.blue) + hair(58.6, 46.6, 56.8, 41.4, 58.8, 33.6, 0.55, P.blue) +
      `<g transform="translate(67.6 90) rotate(-14)">` +
      k.draw([{ d: spoonHandle, fill: P.sky1 }, { d: spoonEnd, fill: P.sky1, inner: k.sh(spoonEnd, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) }, { d: spoonBowl, fill: P.sky1, inner: k.sh(spoonBowl, 0, 0, 1, 1, 0.2, 0.9, P.blue, 0.45) + `<path d="M-3 -.6C-2 -1.6 0 -1.8 1.6 -1.4" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` }], 0.45) +
      `<circle cx="18.8" cy="-1.8" r=".7" fill="${P.gold}"/>` +
      `</g>` +
      sparkle(88, 44, 2.2) + sparkle(34, 50, 1.6) +
      k.defs()
    )
  },

  // Ocho nobles: ya te saludan en la ópera. Los gemelos de nácar y oro, apoyados en el terciopelo del palco.
  'Palco en el Colón': (u) => {
    const k = kit(u)
    const swag = 'M4 4H116V29C104 39.6 86 41.6 76 35.6C70 32.4 64 31 60 31C56 31 50 32.4 44 35.6C34 41.6 16 39.6 4 29Z'
    const swagEdge = 'M4 29C16 39.6 34 41.6 44 35.6C50 32.4 56 31 60 31C64 31 70 32.4 76 35.6C86 41.6 104 39.6 116 29'
    const curtL = 'M4 20H31.4C28.4 40 27.6 62 31.6 84H4Z'
    const curtR = 'M116 20H88.6C91.6 40 92.4 62 88.4 84H116Z'
    const rail = 'M4 83.4C28 79.4 92 79.4 116 83.4V90.6C92 86.6 28 86.6 4 90.6Z'
    const front = 'M4 90.6C28 86.6 92 86.6 116 90.6V126H4Z'
    const LF: Pt = [47.8, 67.4], LB: Pt = [49.8, 57.6], RF: Pt = [72.2, 67.4], RB: Pt = [70.2, 57.6]
    const r1 = 11, r2 = 8.8
    const barrel = (F: Pt, B: Pt) => poly(hull([...circlePts(F[0], F[1], r1, 48), ...circlePts(B[0], B[1], r2, 48)]))
    const nacre = (F: Pt, B: Pt) =>
      `<path d="M${F[0] - 14} ${F[1] - 24}H${F[0] + 14}V${F[1] + 12}H${F[0] - 14}Z" fill="${k.lin('#F0BED0', 0, 0, 1, 1, 0.6, 0)}"/>` +
      `<path d="M${F[0] - 14} ${F[1] - 24}H${F[0] + 14}V${F[1] + 12}H${F[0] - 14}Z" fill="${k.lin(P.sky, 1, 0, 0, 1, 0.55, 0)}"/>` +
      [0, 1, 2, 3].map((i) => hair(B[0] - r2 + 1 + i * 0.6, B[1] + 2 - i * 2.6, B[0] - 2 + i, B[1] - r2 + 1 + i * 0.4, B[0] + r2 - 2, B[1] - 3 + i * 1.6, 0.45, i % 2 ? '#D6BCE0' : '#E7C4AE')).join('') +
      k.sh(`M${F[0] + 2} ${F[1] - 24}H${F[0] + 14}V${F[1] + 12}H${F[0] + 2}Z`, 0, 0, 1, 0, 0, 0.75, P.blue, 0.35)
    const lens = (F: Pt) => {
      const [x, y] = F, ri = r1 - 2.4
      return (
        `<path d="${ringE(x, y, r1, r1, ri, ri)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".55"/>` +
        k.clip(ringE(x, y, r1, r1, ri, ri), k.sh(ellipse(x, y, r1, r1), 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M${x - r1} ${y - r1}H${x}V${y}H${x - r1}Z" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.5, 0)}"/>`) +
        `<circle cx="${x}" cy="${y}" r="${f(r1 - 1.2)}" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray=".01 1" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${y}" r="${f(ri)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".45"/>` +
        `<circle cx="${x}" cy="${y}" r="${f(ri)}" fill="${k.rad(P.mid, 0.35, 0.3, 0.7, 0.95, 0)}"/>` +
        `<path d="M${f(x - 6)} ${f(y - 1)}A6.2 6.2 0 0 1 ${f(x - 0.6)} ${f(y - 6.2)}" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` +
        // En el vidrio, el resplandor del escenario: un brillo largo arriba y el reflejo dorado sobre el borde.
        `<path d="M${f(x - ri + 1.4)} ${f(y + 2.4)}A${f(ri - 1.4)} ${f(ri - 1.4)} 0 0 0 ${f(x + ri - 1.4)} ${f(y + 2.4)}" fill="none" stroke="${P.gold}" stroke-width=".5" opacity=".55" transform="rotate(-38 ${x} ${y})"/>`
      )
    }
    return (
      `<rect width="120" height="130" fill="${P.wine}"/>` +
      k.shade(FULL, k.rad(P.night, 0.5, 0.45, 0.7, 0, 0.9), P.night, 0.6) +
      k.shade(ellipse(60, 58, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.55, 0), P.gold, 0.4) +
      k.draw([
        { d: curtL, fill: P.red, inner: k.sh(curtL, 0, 0, 1, 0, 0, 0.9, P.wine, 0.5) + hair(26, 30, 24.6, 56, 27, 82, 0.7, P.wine) + hair(29.4, 34, 27.6, 58, 30, 82, 0.5, '#E2716A') + hair(18, 30, 18.6, 60, 21, 84, 0.6, P.wine) },
        { d: curtR, fill: P.red, inner: k.sh(curtR, 0, 0, 1, 0, 0.3, 0.95, P.wine, 0.5) + hair(94, 30, 95.4, 56, 93, 82, 0.7, P.wine) + hair(90.6, 34, 92.4, 58, 90, 82, 0.5, '#E2716A') + hair(102, 30, 101.4, 60, 99, 84, 0.6, P.wine) },
      ], 0.7) +
      // Las borlas que sujetan los cortinados.
      [[29.6, 62], [90.4, 62]].map(([x, y]) => `<path d="M${x - 2.6} ${y - 1}Q${x} ${y + 1.6} ${x + 2.6} ${y - 1}" fill="none" stroke="${P.ink}" stroke-width="1.8"/><path d="M${x - 2.6} ${y - 1}Q${x} ${y + 1.6} ${x + 2.6} ${y - 1}" fill="none" stroke="${P.gold}" stroke-width=".9"/><circle cx="${x}" cy="${y + 1.2}" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x - 1} ${y + 2.2}L${x - 1.6} ${y + 6}H${x + 1.6}L${x + 1} ${y + 2.2}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`).join('') +
      k.draw([{
        d: swag, fill: P.red,
        inner: k.sh(swag, 0, 0, 0, 1, 0, 0.9, P.wine, 0.5) + hair(26, 28, 36, 36, 46, 33, 0.8, P.wine) + hair(94, 28, 84, 36, 74, 33, 0.8, P.wine) + hair(42, 24, 50, 30, 58, 28.6, 0.7, P.wine) + hair(78, 24, 70, 30, 62, 28.6, 0.7, P.wine) +
          hair(34, 26, 44, 30.6, 54, 28, 0.6, '#E2716A'),
      }], 0.7) +
      along(4, 29, 30, 46, 60, 31, Array.from({ length: 16 }, (_, i) => i / 15)).concat(along(60, 31, 90, 46, 116, 29, Array.from({ length: 16 }, (_, i) => i / 15)))
        .map((q) => `<path d="M${f(q.x)} ${f(q.y - 0.4)}V${f(q.y + 2.6)}" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M${f(q.x)} ${f(q.y - 0.4)}V${f(q.y + 2.6)}" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>`).join('') +
      `<path d="${swagEdge}" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="${swagEdge}" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<circle cx="60" cy="33.4" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M58.9 34.4L58.1 38.6H61.9L61.1 34.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        {
          d: front, fill: P.gold,
          inner: k.sh(front, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.5) + `<path d="M4 93.4C28 89.4 92 89.4 116 93.4" fill="none" stroke="${P.goldD}" stroke-width=".8"/><path d="M4 94.8C28 90.8 92 90.8 116 94.8" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
            hair(46, 98, 52, 94.6, 56.4, 97, 0.6, P.goldD) + hair(74, 98, 68, 94.6, 63.6, 97, 0.6, P.goldD),
        },
        { d: rail, fill: P.red, inner: k.sh(rail, 0, 0, 0, 1, 0, 0.9, P.wine, 0.5) + `<path d="M8 84C30 80.8 90 80.8 112 84" fill="none" stroke="#E98B84" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` },
      ], 0.7) +
      `<ellipse cx="60" cy="97.2" rx="3.4" ry="2.8" fill="${P.red}" stroke="${P.goldD}" stroke-width=".6"/><ellipse cx="59.2" cy="96.4" rx=".9" ry=".7" fill="#fff" opacity=".6"/>` +
      k.floor(59, 82, 26, 2.4, P.night) +
      // Los gemelos de teatro: tubos de nácar, aros de oro con grano, la rueda del foco y el mango.
      `<g transform="rotate(-9 60 68)">` +
      k.draw([{ d: barrel(LF, LB), fill: '#F7F1EA', inner: nacre(LF, LB) }, { d: barrel(RF, RB), fill: '#F7F1EA', inner: nacre(RF, RB) }], 0.7) +
      [LB, RB].map((B) => `<path d="${ringE(B[0], B[1], r2, r2, r2 - 1.3, r2 - 1.3)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${B[0]}" cy="${B[1]}" r="${f(r2 - 1.3)}" fill="none" stroke="${P.goldD}" stroke-width=".3"/>`).join('') +
      k.draw([
        { d: 'M55.2 53.6H64.8V60.4H55.2Z', fill: P.gold, inner: k.sh('M55.2 53.6H64.8V60.4H55.2Z', 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M55.2 56.8H64.8" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: roundRect(55.8, 47.4, 64.2, 53.4, 1.2), fill: P.gold, inner: Array.from({ length: 10 }, (_, i) => `<path d="M${f(56.4 + i * 0.8)} 47.4V53.4" stroke="${P.goldD}" stroke-width=".3"/>`).join('') + k.sh(roundRect(55.8, 47.4, 64.2, 53.4, 1.2), 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) },
      ], 0.45) +
      `<path d="M56.4 48.6H58.8" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      lens(LF) + lens(RF) +
      k.draw([{ d: roundRect(57, 62.4, 63, 70.6, 1.2), fill: P.gold, inner: k.sh(roundRect(57, 62.4, 63, 70.6, 1.2), 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M57 66.5H63" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
      `<circle cx="60" cy="66.5" r="1.1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/><circle cx="59.7" cy="66.2" r=".3" fill="#fff"/>` +
      rod('M62.4 70.4L84 92.6', P.gold, 1.9, P.goldL) +
      `<path d="M66.2 74.4L80.2 88.8" stroke="#F7F1EA" stroke-width="1" stroke-linecap="round"/>` +
      `<circle cx="84.6" cy="93.2" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="84" cy="92.6" r=".5" fill="${P.goldL}"/>` +
      `</g>` +
      sparkle(40, 46, 1.8, P.goldL) + sparkle(81, 44, 1.5, P.goldL) +
      k.defs()
    )
  },

  // Veinte nobles: la reina vino y te cebó un amargo. El mate de virola de plata con piedras, coronado, bajo el sol de Mayo.
  'Tomando mate con la reina': (u) => {
    const k = kit(u)
    const gourd = 'M43.4 63C41 73 46 82.6 54.6 85.8H65.4C74 82.6 79 73 76.6 63C74.6 59 70 57.6 60 57.6C50 57.6 45.4 59 43.4 63Z'
    const virola = 'M44.6 58.6C44.6 61.6 51 64 60 64C69 64 75.4 61.6 75.4 58.6V62.6C75.4 65.6 69 68 60 68C51 68 44.6 65.6 44.6 62.6Z'
    const mouth = ellipse(60, 58.6, 15.4, 3.6)
    const yerba = ellipse(60, 58.9, 13, 2.4)
    const stem = 'M54.8 85.4H65.2L63.4 90.4H56.6Z'
    const knot = ellipse(60, 88.4, 4.8, 1.7)
    const foot = 'M50.6 92.2C50.6 90.6 54.6 89.6 60 89.6C65.4 89.6 69.4 90.6 69.4 92.2L71.2 95.4H48.8Z'
    const scallop = Array.from({ length: 10 }, (_, i) => {
      const x0 = 44.8 + i * 3.04, x1 = x0 + 3.04, y = (x: number) => 62.6 + 5.4 * (1 - ((x - 60) / 15.4) ** 2)
      return `M${f(x0)} ${f(y(x0))}Q${f((x0 + x1) / 2)} ${f(y((x0 + x1) / 2) + 1.8)} ${f(x1)} ${f(y(x1))}`
    }).join('')
    const silverSh = (d: string) => k.sh(d, 0, 0, 1, 1, 0, 0.85, P.blue, 0.4)
    return (
      salon(k) +
      k.sun(60, 56, 17, 47) +
      k.shade(ellipse(60, 58, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.floor(60, 95.4, 14, 2, P.mid) +
      // La bombilla de oro, con su virola y el pico.
      rod('M64.6 58.4L72.8 33.4', P.gold, 1.5, P.goldL) + rod('M72.8 33.4Q73.8 29.8 70.8 28.4', P.gold, 1.5) +
      `<path d="M70.6 41.6L73.2 42.6L72.4 45L69.8 44Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      k.draw([
        { d: foot, fill: P.white, inner: silverSh(foot) + Array.from({ length: 9 }, (_, i) => `<path d="M${f(51.6 + i * 2.1)} 91.6L${f(50.6 + i * 2.4)} 95" stroke="${P.blue}" stroke-width=".35"/>`).join('') },
        { d: stem, fill: P.white, inner: silverSh(stem) },
        { d: knot, fill: P.white, inner: silverSh(knot) + `<path d="M56 88.4H64" stroke="${P.blue}" stroke-width=".3"/>` },
        {
          d: gourd, fill: P.brown,
          inner:
            k.sh('M63 58C74 64 78 76 70 88H82V58Z', 0, 0, 1, 0, 0, 0.95, P.brownD, 0.5) + k.sh('M40 78H80V88H40Z', 0, 0, 0, 1, 0, 0.7, P.brownD, 0.35) +
            `<path d="M40 60H52V88H40Z" fill="${k.lin('#FFE3C2', 0, 0, 1, 0, 0.55, 0)}"/>` +
            hair(46.4, 70, 49, 78, 54.6, 83.4, 0.5, P.brownD) + hair(73.4, 70, 71, 78, 65.6, 83.4, 0.5, P.brownD) + hair(60, 70, 59.6, 77, 60, 84.4, 0.4, P.brownD) +
            // Guarda de plata cincelada en la panza.
            `<path d="M43 76.4C50 80.4 70 80.4 77 76.4L76.4 78.8C69 82.6 51 82.6 43.6 78.8Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
            `<path d="M44.4 77.8C51 81.2 69 81.2 75.6 77.8" fill="none" stroke="${P.blue}" stroke-width=".3" stroke-dasharray="1 .7"/>`,
        },
        {
          d: virola, fill: P.white,
          inner:
            silverSh(virola) + `<path d="${scallop}" fill="none" stroke="${P.blue}" stroke-width=".4"/>` +
            hair(46.4, 63.8, 48.6, 66.4, 52.4, 66.6, 0.4, P.blue) + hair(73.6, 63.8, 71.4, 66.4, 67.6, 66.6, 0.4, P.blue),
        },
        { d: mouth, fill: P.white, inner: `<path d="${yerba}" fill="${P.green}"/>` + k.sh(yerba, 0, 0, 1, 1, 0, 0.9, P.greenD, 0.45) + `<path d="M50 58.4C53 57.2 58 56.8 62 57.2" fill="none" stroke="#CFE09A" stroke-width=".8" stroke-linecap="round"/>` },
      ], 0.7) +
      `<path d="${scallop}" fill="none" stroke="${P.ink}" stroke-width=".5" transform="translate(0 0)"/>` +
      setStone(k, 50, 64.6, 1.6, RUBI, 4) + setStone(k, 60, 65.8, 1.9, ESMERALDA, 4) + setStone(k, 70, 64.6, 1.6, ZAFIRO, 4) +
      `<path d="M47.4 66.6C46.4 71 46.6 76 48.6 80" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".55"/>` +
      // La corona de la reina, ladeada sobre la boca del mate.
      `<g transform="translate(53 58.6) rotate(-14) scale(1.05)">` + k.cast(['M-10.6 -5.2C-4 -3.8 4 -3.8 10.6 -5.2L10.2 .4C4 1.8 -4 1.8 -10.2 .4Z'], 0.8, 1.6, P.brownD) + crown(k) + `</g>` +
      sparkle(84, 36, 2.6) + sparkle(36, 40, 1.8) + sparkle(30, 76, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Joyero ─────────────────────────────────────────────────────────

  // Dos victorias: el anillo de hojalata con su piedra de vidrio. Brilla, aunque adentro ya le salió el verdín.
  'Anillo de lata': (u) => {
    const k = kit(u)
    const cx = 58.6, cy = 75.4
    const band = ringE(cx, cy, 17.4, 16.4, 13, 12.4, 0.9)
    const inner = ellipse(cx, cy + 0.9, 13, 12.4)
    const cup = `M${f(cx - 9.6)} 58.4C${f(cx - 10)} 55.2 ${f(cx - 6)} 53.6 ${cx} 53.6C${f(cx + 6)} 53.6 ${f(cx + 10)} 55.2 ${f(cx + 9.6)} 58.4L${f(cx + 6.6)} 61.6H${f(cx - 6.6)}Z`
    const prong = (x: number, lean: number) => `M${f(x - 1)} 56.6L${f(x + lean - 0.7)} 49.2L${f(x + lean + 0.8)} 49L${f(x + 1)} 56.6Z`
    const tag = 'M0 0H10.4L13.4 3.6L10.4 7.2H0Z'
    const mid = ellipse(cx, cy + 0.45, 15.2, 14.4)
    return (
      salon(k) +
      vitrina(k, 60, 63, 33) +
      k.floor(60, 93, 19, 2.6, JADE_D) +
      k.cast([band], 2.2, 2, JADE_D) +
      k.draw([{
        d: band, fill: TIN,
        inner:
          k.sh(ellipse(cx, cy, 17.4, 16.4), 0, 0, 1, 1, 0, 0.9, TIN_D, 0.5) + `<path d="M40 60H47V92H40Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.65, 0)}"/>` +
          // La guarda estampada de pacotilla, la costura soldada abajo, las abolladuras y las rayas.
          `<path d="${mid}" fill="none" stroke="${TIN_D}" stroke-width=".55" stroke-dasharray=".01 1.5" stroke-linecap="round"/>` +
          `<path d="M${f(cx + 1.4)} ${f(cy + 12.6)}L${f(cx + 0.6)} ${f(cy + 16.6)}" stroke="${P.ink}" stroke-width=".5"/><ellipse cx="${f(cx + 1)}" cy="${f(cy + 14.8)}" rx="1.3" ry=".9" fill="${TIN_D}" stroke="${P.ink}" stroke-width=".3"/>` +
          hair(44.4, 68, 43.2, 76, 45.4, 85, 1, '#fff') + hair(70, 89.4, 66, 91.6, 61, 92, 0.4, TIN_D) + hair(73.6, 70, 75, 75, 74.4, 80, 0.4, TIN_D) +
          `<path d="M72.8 83.4c.6 .9 1.6 1.2 2.2 .8M44.6 83.8c.8 .2 1.6 -.2 1.9 -.9M71.6 64c.2 1 1 1.6 1.8 1.6" fill="none" stroke="${TIN_D}" stroke-width=".45"/>` +
          // El verdín que ya trepa por el metal.
          `<path d="M${f(cx - 4)} ${f(cy + 15.4)}C${f(cx - 2)} ${f(cy + 16.6)} ${f(cx + 3)} ${f(cy + 16.6)} ${f(cx + 5)} ${f(cy + 15.4)}L${f(cx + 4)} ${f(cy + 13.2)}C${f(cx + 2)} ${f(cy + 14)} ${f(cx - 2)} ${f(cy + 14)} ${f(cx - 3.4)} ${f(cy + 13.2)}Z" fill="${VERDIN}" opacity=".85"/>` +
          [[cx - 7, cy + 13.6, 0.8], [cx + 8.6, cy + 12.6, 0.7], [cx - 11, cy + 10.4, 0.55]].map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${VERDIN}"/>`).join(''),
      }], 0.75) +
      // Adentro del aro, el verdín que te deja el dedo verde.
      k.clip(inner, `<path d="${ringE(cx, cy + 0.9, 15.4, 14.4, 13, 12.4, -3.2)}" fill="${VERDIN}" fill-rule="evenodd"/>` + k.sh(ellipse(cx, cy + 5, 13, 10), 0, 0, 0, 1, 0, 0.95, VERDIN_D, 0.55)) +
      `<path d="M${f(cx - 10)} ${f(cy + 7.4)}C${f(cx - 6)} ${f(cy + 11.4)} ${f(cx + 6)} ${f(cy + 11.4)} ${f(cx + 10)} ${f(cy + 7.4)}" fill="none" stroke="${VERDIN_D}" stroke-width=".55"/>` +
      [[cx - 5, cy + 10.4, 0.8], [cx + 6.6, cy + 10, 0.9], [cx + 1.4, cy + 11.6, 0.55]].map(([x, y, r]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${VERDIN_D}" opacity=".75"/>`).join('') +
      // La piedra de vidrio, más grande de lo que debería, y las garras torcidas.
      sideGem(k, cx, 50.6, 11.6, 5.6, 9.6, VIDRIO, 0.65) +
      k.draw([{ d: cup, fill: TIN, inner: k.sh(cup, 0, 0, 1, 1, 0, 0.9, TIN_D, 0.5) + `<path d="M${f(cx - 8.6)} 57.4C${f(cx - 4)} 58.6 ${f(cx + 4)} 58.6 ${f(cx + 8.6)} 57.4" fill="none" stroke="#fff" stroke-width=".55"/>` + `<path d="M${f(cx - 6.6)} 60.2H${f(cx + 6.6)}" stroke="${TIN_D}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` }], 0.6) +
      k.draw([{ d: prong(cx - 8.6, -0.8), fill: TIN }, { d: prong(cx - 2.6, 0.2), fill: TIN }, { d: prong(cx + 3.4, -0.3), fill: TIN }, { d: prong(cx + 8.8, 1.1), fill: TIN }], 0.4) +
      `<path d="M${f(cx - 10.4)} 49.2H${f(cx - 8)}M${f(cx - 3.4)} 49.2H${f(cx - 1.4)}M${f(cx + 2.2)} 49.2H${f(cx + 4)}M${f(cx + 9)} 49H${f(cx + 11)}" stroke="${P.ink}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="M${f(cx - 6)} 46.4L${f(cx - 3.4)} 48.6" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` +
      // La etiqueta del precio, atada con un hilo.
      `<path d="M74.6 72C79 71.6 83 73 85.4 76.8" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      `<g transform="translate(85 75.8) rotate(64)">` +
      k.draw([{ d: tag, fill: P.paper, inner: k.sh(tag, 0, 0, 1, 1, 0, 0.6, P.brown, 0.3) }], 0.45) +
      `<circle cx="10.8" cy="3.6" r=".7" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/>` +
      `<text x="4.8" y="5.3" ${GEORGIA} font-weight="700" font-size="4.6" fill="${P.red}" text-anchor="middle" transform="rotate(-90 4.8 3.6)">$5</text>` +
      `</g>` +
      sparkle(cx - 4, 40.4, 3.6, '#fff') + sparkle(cx + 7, 44, 1.6, '#fff') + sparkle(34, 50, 1.8) + sparkle(88, 56, 1.4) +
      k.defs()
    )
  },

  // Seis victorias: tu vidriera en el centro. El busto de terciopelo con el collar de esmeralda, detrás del vidrio.
  'Joyería de la calle Libertad': (u) => {
    const k = kit(u)
    const bust = 'M54.6 41.4C54.6 46 54.2 49.6 53.4 52.2C49 54.2 42.4 56 38 59.2C34.6 61.6 33.2 65.4 33.2 69.4V78H86.8V69.4C86.8 65.4 85.4 61.6 82 59.2C77.6 56 71 54.2 66.6 52.2C65.8 49.6 65.4 46 65.4 41.4Z'
    const neckTop = ellipse(60, 41.4, 5.4, 1.4)
    const base = 'M36.4 78H83.6V81.6C83.6 82.4 82.8 83 82 83H38C37.2 83 36.4 82.4 36.4 81.6Z'
    const plinth = 'M34.4 83H85.6L87.4 88.2H32.6Z'
    const chain = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, n: number) =>
      along(x0, y0, cx, cy, x1, y1, Array.from({ length: n }, (_, i) => i / (n - 1))).map((q, i) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="${i % 2 ? 0.55 : 0.8}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    const sl = 'M16 74L58 24H67L25 78Z', sl2 = 'M30 82L72 32H75.4L33.4 84Z'
    const rid = k.id('arc')
    return (
      `<rect width="120" height="130" fill="${JADE}"/>` +
      k.shade(FULL, k.rad(JADE_D, 0.5, 0.5, 0.62, 0, 1), '#064A37', 0.6) +
      k.shade(ellipse(60, 54, 28, 30), k.rad(JADE_L, 0.5, 0.5, 0.5, 0.8, 0), JADE_L, 0.35) +
      Array.from({ length: 12 }, (_, i) => hair(18 + i * 8, 20, 17 + i * 8, 60, 19 + i * 8, 100, 0.5, JADE_D, 0.5)).join('') +
      // El rótulo dorado pintado en el vidrio.
      `<path id="${rid}" d="M38 37.4Q60 27.4 82 37.4" fill="none"/>` +
      `<text ${GEORGIA} font-style="italic" font-weight="700" font-size="6.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3" letter-spacing=".2"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">Joyería</textPath></text>` +
      k.floor(60, 88.2, 29, 2.4, '#064A37') +
      k.draw([
        { d: plinth, fill: P.gold, inner: k.sh(plinth, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M33.6 85.2H86.4" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.1" stroke-linecap="round"/>` },
        { d: base, fill: P.brownD, inner: k.sh(base, 0, 0, 1, 0, 0, 0.6, '#4A2A12', 0.4) + hair(38, 79.4, 50, 79, 62, 79.4, 0.3, P.brown) },
        {
          d: bust, fill: P.night,
          inner:
            `<path d="M30 40H52V80H30Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.95, 0)}"/>` + k.sh('M63 38C66 50 80 56 92 70V80H62Z', 0, 0, 1, 0, 0, 0.9, '#0B1130', 0.45) + k.sh('M28 68H92V80H28Z', 0, 0, 0, 1, 0, 0.6, '#0B1130', 0.35) +
            hair(55.6, 43, 55.4, 48, 56, 52, 0.7, P.sky) + hair(40.4, 61.6, 46, 59.4, 52.4, 59.6, 0.6, P.blue) + hair(36, 65, 36.8, 70.6, 36.2, 76.6, 0.6, P.blue) +
            hair(79.6, 61.6, 74, 59.6, 67.6, 59.8, 0.45, P.mid) + hair(84, 66, 83, 71, 83.6, 76, 0.45, P.mid) +
            Array.from({ length: 14 }, (_, i) => hair(38 + i * 3.6, 64 + (i % 3), 38.6 + i * 3.6, 70, 38 + i * 3.6, 77, 0.3, i < 6 ? P.mid : '#0B1130', 0.7)).join(''),
        },
        { d: neckTop, fill: P.mid, inner: k.sh(neckTop, 0, 0, 1, 1, 0, 0.6, P.night, 0.3) },
      ], 0.7) +
      `<text x="60" y="81.6" ${GEORGIA} font-style="italic" font-size="3.4" fill="${P.goldL}" text-anchor="middle">calle Libertad</text>` +
      // El collar: cadena de oro, un rubí y un zafiro, y el colgante de esmeralda con su marco de grano.
      chain(53.6, 52.4, 54.4, 61, 60, 63.2, 10) + chain(60, 63.2, 65.6, 61, 66.4, 52.4, 10) +
      setStone(k, 54.6, 59, 1.6, RUBI, 4) + setStone(k, 65.4, 59, 1.6, ZAFIRO, 4) +
      k.draw([{ d: roundRect(58.6, 62.4, 61.4, 65.6, 0.8), fill: P.gold }], 0.35) +
      k.draw([{ d: 'M52.6 66.6L54.8 64.4H65.2L67.4 66.6V76.4L65.2 78.6H54.8L52.6 76.4Z', fill: P.gold, inner: k.sh('M52 64H68V79H52Z', 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.55) +
      `<path d="M53.5 67L55.2 65.3H64.8L66.5 67V76L64.8 77.7H55.2L53.5 76Z" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 .9" stroke-linecap="round"/>` +
      stepCut(k, 60, 71.5, 5.2, 5.6, 1.7, ESMERALDA, 0.35) +
      [[52.6, 66.6], [67.4, 66.6], [52.6, 76.4], [67.4, 76.4]].map(([x, y]) => claw(x, y, 60, 71.5, 0.55)).join('') +
      // Los reflejos del vidrio de la vidriera.
      `<path d="${sl}" fill="#fff" opacity=".13"/><path d="${sl2}" fill="#fff" opacity=".16"/>` +
      sparkle(57.4, 68.6, 2.8, '#fff') + sparkle(86, 46, 1.8, JADE_L) + sparkle(33, 52, 1.4, JADE_L) +
      k.defs()
    )
  },

  // Quince victorias: un pedrusco que vale fortunas. El octaedro de diamante en bruto, recién salido de la roca.
  'Diamante en bruto': (u) => {
    const k = kit(u)
    const RAW = ['#FFFFFF', '#D3E0F5', '#9DB3E2', '#6B82C4']
    const verts: V3[] = [[0, 1.32, 0], [0, -1.32, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]
    const faces = [[0, 4, 2], [0, 2, 5], [0, 5, 3], [0, 3, 4], [1, 2, 4], [1, 5, 2], [1, 3, 5], [1, 4, 3]]
    const vis = solid(verts, faces, 0.44, 0.34, 21.6, 60, 47.4)
    const silhouette = poly(hull(vis.flatMap((q) => q.ps)))
    const top = vis.flatMap((q) => q.ps).reduce((a, b) => (b[1] < a[1] ? b : a))
    const tone = (lit: number) => (lit > 0.72 ? 0 : lit > 0.42 ? 1 : lit > 0.12 ? 2 : 3)
    // Rayado de grabado paralelo a una arista, dentro de cada cara.
    const hatch = ([a, b, c]: Pt[], n: number, col: string, op: number) =>
      Array.from({ length: n }, (_, i) => {
        const t = (i + 1) / (n + 1), p0: Pt = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t], p1: Pt = [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t]
        return hair(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, p1[0], p1[1], 0.32, col, op)
      }).join('')
    // Trígonos: los triangulitos grabados que tienen las caras del diamante en bruto.
    const trigons = ([a, b, c]: Pt[], col: string) => {
      const m = centroid([a, b, c]), s = 0.16
      return [0.55, 0.3].map((w, i) => {
        const o: Pt = [m[0] + (a[0] - m[0]) * (i ? 0.4 : 0), m[1] + (a[1] - m[1]) * (i ? 0.4 : 0)]
        return `<path d="${poly([a, b, c].map((p) => [o[0] + (p[0] - m[0]) * s * w * 2, o[1] + (p[1] - m[1]) * s * w * 2] as Pt))}" fill="none" stroke="${col}" stroke-width=".35" transform="rotate(180 ${f(o[0])} ${f(o[1])})"/>`
      }).join('')
    }
    const crystal =
      k.draw([{
        d: silhouette, fill: RAW[1],
        inner:
          vis.map((q) => `<path d="${poly(q.ps)}" fill="${RAW[tone(q.lit)]}"/>`).join('') +
          vis.map((q) => k.sh(poly(q.ps), 0, 0, 1, 1, 0, 0.35 + tone(q.lit) * 0.18, [P.sky2, P.sky2, P.blue, P.mid][tone(q.lit)], 0.35)).join('') +
          vis.map((q) => hatch(q.ps, 4, [P.sky2, P.sky2, P.blue, P.mid][tone(q.lit)], 0.6)).join('') +
          vis.map((q) => trigons(q.ps, [P.sky2, P.blue, P.mid, P.night][tone(q.lit)])).join(''),
      }], 0.8) +
      `<path d="${vis.map((q) => poly(q.ps)).join('')}" fill="none" stroke="${P.ink}" stroke-width=".45" stroke-linejoin="round"/>`
    const rock = {
      A: [[31, 77], [37, 67.6], [47, 64.4], [53.6, 68.8], [45, 75.6]] as Pt[],
      B: [[66.8, 68.2], [76, 62.8], [87.4, 68.6], [80.6, 75], [71, 73.2]] as Pt[],
      C: [[31, 77], [45, 75.6], [48.6, 88.6], [36.4, 86.2]] as Pt[],
      D: [[45, 75.6], [53.6, 68.8], [60, 71.6], [66.8, 68.2], [71, 73.2], [65, 89.4], [48.6, 88.6]] as Pt[],
      E: [[71, 73.2], [80.6, 75], [87.4, 68.6], [89.2, 78.4], [81, 86.6], [65, 89.4]] as Pt[],
    }
    const stone = (ps: Pt[], c: string, dk: string, extra = '') => k.draw([{ d: poly(ps), fill: c, inner: k.sh(poly(ps), 0, 0, 1, 1, 0, 0.85, dk, 0.45) + extra }], 0.7)
    const specks = (pts: number[][]) => pts.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? '#E4DCCB' : P.red}" stroke="${i % 3 ? 'none' : P.wine}" stroke-width=".2"/>`).join('')
    return (
      salon(k) +
      k.sun(60, 50, 15, 48, 32, false) +
      k.shade(ellipse(60, 48, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.5) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.floor(60, 88.6, 28, 3, ROCA[3]) +
      stone(rock.A, ROCA[0], ROCA[2], hair(38, 70, 42, 70, 46, 67, 0.4, ROCA[3]) + specks([[41, 71, 0.6], [48, 68, 0.4], [36, 74, 0.4]])) +
      stone(rock.B, ROCA[1], ROCA[2], hair(74, 66, 79, 67, 84, 69.6, 0.4, ROCA[3]) + specks([[78, 70, 0.6], [72, 70, 0.4], [83, 70.6, 0.35]])) +
      k.cast([silhouette], 2.6, 2.4, P.mid) + crystal +
      hair(top[0] - 0.6, top[1] + 3, top[0] - 4, top[1] + 12, top[0] - 8.4, top[1] + 22, 1, '#fff') +
      stone(rock.C, ROCA[1], ROCA[3], hair(36, 80, 39, 83, 40, 86, 0.45, ROCA[3]) + specks([[38.6, 79.6, 0.7], [42, 84.6, 0.45], [35.4, 82, 0.35]])) +
      stone(rock.D, ROCA[2], ROCA[3], hair(52, 76, 55, 82, 54, 88, 0.5, ROCA[3]) + hair(62, 74, 63, 80, 60, 86, 0.45, ROCA[3]) + hair(50, 72, 56, 73, 60, 72.6, 0.5, ROCA[0], 0.9) + specks([[56, 79, 0.7], [62.4, 84, 0.5], [51.4, 83.6, 0.45], [66, 77.4, 0.4], [58, 86.6, 0.35]])) +
      stone(rock.E, ROCA[3], '#2E281F', hair(78, 77, 80, 81, 78, 85, 0.45, ROCA[3]) + specks([[75, 80, 0.7], [84.4, 76, 0.45], [70, 85, 0.4]])) +
      sparkle(top[0], top[1] + 1.6, 4.6, '#fff') + sparkle(42.6, 48.6, 2.4, '#fff') + sparkle(86, 34, 2, P.white) + sparkle(34, 34, 1.6, P.white) +
      k.defs()
    )
  },

  // ── Gran inversión ─────────────────────────────────────────────────

  // Dos cartas grandes: inversión segura. El reloj de arena con arena de oro, que de a poco junta piedras abajo.
  'Plazo fijo': (u) => {
    const k = kit(u)
    const topFace = 'M46.6 25.6H73.4L75.6 28.4H44.4Z', topFront = 'M44.4 28.4H75.6V33H44.4Z'
    const botFace = 'M45.4 84.6H74.6L76.8 87.4H43.2Z', botFront = 'M43.2 87.4H76.8V92.4H43.2Z'
    const glass = 'M48.6 33C48.6 46 57.2 53.4 58.8 59.6C57.2 65.8 48.6 73 48.6 84.6H71.4C71.4 73 62.8 65.8 61.2 59.6C62.8 53.4 71.4 46 71.4 33Z'
    const column = (x: number, y0: number, y1: number) => {
      const N = 30, L: string[] = [], R: string[] = []
      for (let i = 0; i <= N; i++) {
        const t = i / N, y = y0 + (y1 - y0) * t
        const w = 0.9 + 1.1 * Math.exp(-(((t - 0.04) / 0.035) ** 2)) + 0.75 * Math.exp(-(((t - 0.3) / 0.09) ** 2)) + 0.75 * Math.exp(-(((t - 0.7) / 0.09) ** 2)) + 1.1 * Math.exp(-(((t - 0.96) / 0.035) ** 2)) + 0.4 * Math.exp(-(((t - 0.5) / 0.04) ** 2))
        L.push(`${f(x - w)} ${f(y)}`)
        R.push(`${f(x + w)} ${f(y)}`)
      }
      return `M${L.join('L')}L${R.reverse().join('L')}Z`
    }
    const colL = column(46.6, 33, 87), colR = column(73.4, 33, 87)
    const gems = [[54.6, 81.6, RUBI], [63.4, 79.8, ESMERALDA], [58.8, 83.4, ZAFIRO], [67.4, 83.2, DIAMANTE], [50.6, 83.6, ONIX]] as const
    return (
      salon(k) +
      vitrina(k, 60, 60, 33) +
      k.floor(61, 92.8, 19, 2.4, JADE_D) +
      `<path d="${column(60, 31, 86)}" fill="${P.brownD}" opacity=".5"/>` +
      // El vidrio, con la arena de oro.
      `<path d="${glass}" fill="${P.sky1}" opacity=".7"/>` +
      k.clip(glass, `<path d="M40 47.4C50 49.6 56 51 60 52C64 51 70 49.6 80 47.4V60H40Z" fill="${P.gold}"/>` + k.sh('M40 46H80V60H40Z', 0, 0, 1, 1, 0, 0.8, P.goldD, 0.5) +
        `<path d="M40 86V80.6C48 79.8 54 75.6 60 73.6C66 75.6 72 79.8 80 80.6V86Z" fill="${P.gold}"/>` + k.sh('M40 73H80V86H40Z', 0, 0, 1, 1, 0, 0.8, P.goldD, 0.5) +
        `<path d="M44 47.6C52 49.6 56 50.8 60 51.6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` +
        gems.map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="1.25" fill="${t[1]}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x - 0.4)}" cy="${f(y - 0.4)}" r=".4" fill="#fff"/>`).join('')) +
      `<path d="M60 59.6V74" stroke="${P.goldD}" stroke-width="1"/><path d="M60 59.6V74" stroke="${P.gold}" stroke-width=".5"/>` +
      `<circle cx="60" cy="66" r=".35" fill="${P.goldL}"/><circle cx="60" cy="70.4" r=".35" fill="${P.goldL}"/>` +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".6"/>` +
      hair(51, 35, 51.4, 44, 56, 52, 0.9, '#fff') + hair(51, 82, 51.6, 75, 56, 67.6, 0.8, '#fff') + hair(69.4, 36, 69, 43, 65.6, 49, 0.45, P.blue) +
      // El marco de madera torneada y dorada.
      k.draw([
        { d: colL, fill: P.brown, inner: k.sh(colL, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) },
        { d: colR, fill: P.brown, inner: k.sh(colR, 0, 0, 1, 0, 0.2, 0.95, P.brownD, 0.5) },
      ], 0.55) +
      [46.6, 73.4].map((x) => `<path d="M${f(x - 0.4)} 36V84" stroke="${P.goldL}" stroke-width=".4" opacity=".7"/><path d="M${f(x - 1.6)} 59.6H${f(x + 1.6)}" stroke="${P.gold}" stroke-width=".8"/>`).join('') +
      k.draw([
        { d: topFront, fill: P.brown, inner: k.sh(topFront, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<path d="M44.4 30.6H75.6" stroke="${P.gold}" stroke-width=".9"/><path d="M44.4 30.6H75.6" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray=".01 1" stroke-linecap="round"/>` + hair(46, 29.4, 54, 29, 60, 29.6, 0.35, P.brownD) },
        { d: topFace, fill: '#CC9566', inner: k.sh(topFace, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.3) + hair(48, 27, 60, 26.6, 72, 27.2, 0.35, P.brownD) },
        { d: botFront, fill: P.brown, inner: k.sh(botFront, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) },
        { d: botFace, fill: '#CC9566', inner: k.sh(botFace, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.3) },
      ], 0.6) +
      `<text x="60" y="91" ${GEORGIA} font-style="italic" font-size="3.6" fill="${P.goldL}" text-anchor="middle">a 30 días</text>` +
      [44.4, 75.6].map((x) => `<circle cx="${x}" cy="30.6" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/><circle cx="${f(x < 60 ? 43.2 : 76.8)}" cy="89.8" r=".9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(57.4, 51.4, 1.8, '#fff') + sparkle(87, 42, 2.2) + sparkle(33, 66, 1.6) +
      k.defs()
    )
  },

  // Tres cartas de nivel 3: tres lingotes en pirámide, pesados y brillantes, con su sello de ley.
  'Lingote de oro': (u) => {
    const k = kit(u)
    const front = 'M-12 0L12 0L10.3 -9.5L-8.9 -9.5Z', right = 'M12 0L16.2 -3L13.1 -11.5L10.3 -9.5Z', top = 'M-8.9 -9.5L10.3 -9.5L13.1 -11.5L-6.1 -11.5Z'
    const ingot = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})">` +
      k.draw([
        { d: right, fill: P.goldD, inner: k.sh(right, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + hair(13, -2, 14.2, -5.6, 12.6, -9, 0.35, P.goldL, 0.6) },
        {
          d: front, fill: P.gold,
          inner: k.sh(front, 0, 0, 1, 0, 0, 0.85, P.goldD, 0.45) + `<path d="M-8 -9.5H-3.4L-5.4 0H-11Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.65, 0.1)}"/>` +
            hair(-11, -1.1, 0, -1.4, 11.4, -1.1, 0.35, P.goldD) + hair(-9.4, -7.6, 0, -7.9, 9.8, -7.6, 0.3, P.goldL),
        },
        { d: top, fill: P.goldL, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.gold, 0.4) },
      ], f(0.6 / s)) +
      `<path d="M-8.9 -9.5L10.3 -9.5" stroke="#fff" stroke-width="${f(0.5 / s)}" opacity=".9"/>` +
      // El sello de ley, estampado en la cara de arriba.
      `<g transform="matrix(1 0 -.7 .55 2.4 -10.5)">` +
      `<rect x="-6.4" y="-2.5" width="12.8" height="4.4" rx="1.5" fill="none" stroke="${P.goldD}" stroke-width=".45"/>` +
      `<text x="0" y=".9" ${GEORGIA} font-weight="700" font-size="3.3" fill="${P.goldD}" text-anchor="middle">999,9</text></g>` +
      `</g>`
    return (
      salon(k) +
      k.sun(60, 50, 13, 46, 28, false) +
      k.shade(ellipse(60, 54, 26, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.floor(60, 85.4, 34, 3.6, JADE_D) +
      ingot(41.8, 83.8, 1.42) + ingot(70.6, 85.6, 1.42) +
      ingot(57.4, 70.4, 1.42) +
      sparkle(44.6, 55, 3.6, '#fff') + sparkle(29.8, 70, 2, '#fff') + sparkle(87, 66, 2.2, '#fff') + sparkle(70, 36, 1.6, P.white) +
      k.defs()
    )
  },

  // Cinco cartas de nivel 3: ni los Dalton te la abren. La caja fuerte de jade y filetes de oro, con la dinamita apagada.
  'Caja fuerte': (u) => {
    const k = kit(u)
    const front = 'M39 38.6H74V84.6H39Z', side = 'M74 38.6L81.4 34V80L74 84.6Z'
    const cornice = 'M37.4 34.8H75.6V39.4H37.4Z', corniceSide = 'M75.6 34.8L83.4 30V34.6L75.6 39.4Z', corniceTop = 'M37.4 34.8L45.2 30H83.4L75.6 34.8Z'
    const plinth = 'M37.6 84.2H75.4V88.2H37.6Z', plinthSide = 'M75.4 84.2L83 79.4V83.4L75.4 88.2Z'
    const door = 'M42 42.4H71V81.2H42Z'
    const cx = 56.5, cy = 57.6, hy = 73.8
    const ticks = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2, l = i % 5 ? 0.9 : 1.8
      return `<path d="M${f(cx + Math.cos(a) * 7.2)} ${f(cy + Math.sin(a) * 7.2)}L${f(cx + Math.cos(a) * (7.2 - l))} ${f(cy + Math.sin(a) * (7.2 - l))}" stroke="${P.ink}" stroke-width="${i % 5 ? 0.25 : 0.4}"/>`
    }).join('')
    const curl = (x: number, y: number, sx: number, sy: number) =>
      `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0H6C4.4 .6 3 1.8 2.4 3.6C1.8 5.4 .6 6 0 6Z" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      `<path d="M2.6 2.6C3.6 1.6 5 1.8 5.2 3C5.4 4.2 4 4.6 3.4 3.8" fill="none" stroke="${P.gold}" stroke-width=".45" stroke-linecap="round"/><circle cx=".9" cy=".9" r=".5" fill="${P.goldL}"/></g>`
    const spokes = [-90, 30, 150].map((a) => {
      const r = (a * Math.PI) / 180, x = cx + Math.cos(r) * 5.8, y = hy + Math.sin(r) * 5.8
      return rod(`M${cx} ${hy}L${f(x)} ${f(y)}`, P.gold, 1.1, P.goldL) + `<circle cx="${f(x)}" cy="${f(y)}" r="1.5" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - 0.5)}" cy="${f(y - 0.5)}" r=".45" fill="${P.goldL}"/>`
    }).join('')
    const stick = roundRect(-9, -2.3, 9, 2.3, 1.1)
    return (
      salon(k) +
      k.sun(60, 54, 16, 47, 32, false) +
      k.shade(ellipse(60, 56, 30, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.floor(60, 90.4, 28, 3, P.mid) +
      [[41.4, 89.6], [72, 89.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${f(x - 0.6)}" cy="${f(y - 0.6)}" r=".55" fill="${P.goldL}"/>`).join('') +
      `<circle cx="80.6" cy="84.8" r="1.6" fill="${P.goldD}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([
        { d: side, fill: JADE_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, '#064A37', 0.5) + `<path d="M76 41.6L79.6 39.4V77.4L76 79.8Z" fill="none" stroke="${P.gold}" stroke-width=".45"/>` + hair(77.8, 44, 77.4, 60, 77.8, 76, 0.4, JADE_L, 0.5) },
        { d: front, fill: JADE, inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, JADE_D, 0.5) + `<path d="M39 38H46V86H39Z" fill="${k.lin(JADE_L, 0, 0, 1, 0, 0.55, 0)}"/>` },
        { d: plinthSide, fill: P.goldD, inner: k.sh(plinthSide, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) },
        { d: plinth, fill: P.gold, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) + `<path d="M37.6 85.6H75.4" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: corniceSide, fill: P.goldD, inner: k.sh(corniceSide, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) },
        { d: corniceTop, fill: P.goldL, inner: k.sh(corniceTop, 0, 0, 1, 0, 0, 0.6, P.gold, 0.4) },
        { d: cornice, fill: P.gold, inner: k.sh(cornice, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) + `<path d="M37.4 37.2H75.6" stroke="${P.goldD}" stroke-width=".4"/><path d="M37.4 38.3H75.6" stroke="${P.goldL}" stroke-width=".45" stroke-dasharray=".01 1" stroke-linecap="round"/>` },
      ], 0.75) +
      // La puerta: filete doble, volutas en las esquinas, bisagras, placa del fabricante, el dial y el timón.
      `<path d="${door}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` + k.sh(door, 0, 0, 1, 1, 0.1, 0.5, JADE_D, 0.3) +
      `<path d="M43.6 44H69.4V79.6H43.6Z" fill="none" stroke="${P.gold}" stroke-width=".7"/><path d="M44.8 45.2H68.2V78.4H44.8Z" fill="none" stroke="${P.gold}" stroke-width=".3"/>` +
      curl(44.8, 45.2, 1, 1) + curl(68.2, 45.2, -1, 1) + curl(44.8, 78.4, 1, -1) + curl(68.2, 78.4, -1, -1) +
      [47, 76].map((y) => `<rect x="40.2" y="${y - 3}" width="2.8" height="6" rx="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M40.4 ${y}H42.8" stroke="${P.goldD}" stroke-width=".35"/>`).join('') +
      k.draw([{ d: roundRect(50, 44.4, 63, 48.4, 0.8), fill: P.gold, inner: k.sh(roundRect(50, 44.4, 63, 48.4, 0.8), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.4) }], 0.4) +
      `<text x="56.5" y="47.5" ${GEORGIA} font-style="italic" font-weight="700" font-size="3" fill="${P.brownD}" text-anchor="middle">Fortuna</text>` +
      k.draw([{ d: ellipse(cx, cy, 8.4, 8.4), fill: P.gold, inner: k.sh(ellipse(cx, cy, 8.4, 8.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }], 0.6) +
      `<circle cx="${cx}" cy="${cy}" r="7.4" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35"/>` + ticks +
      k.draw([{ d: ellipse(cx, cy, 3.6, 3.6), fill: P.gold, inner: k.sh(ellipse(cx, cy, 3.6, 3.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${f(cx + Math.cos(a) * 2.6)} ${f(cy + Math.sin(a) * 2.6)}L${f(cx + Math.cos(a) * 3.6)} ${f(cy + Math.sin(a) * 3.6)}" stroke="${P.goldD}" stroke-width=".35"/>` }).join('') }], 0.4) +
      `<path d="M${cx - 0.8} ${f(cy - 9.4)}H${cx + 0.8}L${cx} ${f(cy - 7.8)}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` +
      `<path d="M${cx - 2} ${f(cy - 1.4)}A2.4 2.4 0 0 1 ${cx} ${f(cy - 2.4)}" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` +
      spokes + `<circle cx="${cx}" cy="${hy}" r="2.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="${cx - 0.6}" cy="${hy - 0.6}" r=".7" fill="${P.goldL}"/>` +
      `<path d="M65.6 63.6C65.6 61.6 69.6 61.6 69.6 63.6V69.6C69.6 71.6 65.6 71.6 65.6 69.6Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="67.6" cy="65.4" r=".8" fill="${P.ink}"/><path d="M67.2 65.8L66.8 68H68.4L68 65.8Z" fill="${P.ink}"/>` +
      // La dinamita de los Dalton, apagada en el piso.
      `<g transform="translate(59.4 93.6) rotate(-6)">` +
      k.draw([{ d: stick, fill: P.red, inner: k.sh(stick, 0, 0, 0, 1, 0, 0.9, P.wine, 0.45) + `<path d="M-5.6 -2.3V2.3M5.6 -2.3V2.3" stroke="${P.wine}" stroke-width=".5"/><path d="M-7.6 -1.3H7.6" stroke="#fff" stroke-width=".5" opacity=".5"/>` }], 0.5) +
      `<text x="0" y="1.2" ${GEORGIA} font-weight="700" font-size="2.8" fill="${P.paper}" text-anchor="middle" letter-spacing=".2">TNT</text>` +
      `<path d="M9 0C11.6 -.4 12.2 -3 10.8 -4.4C9.6 -5.6 10.6 -7.6 12.6 -7.4" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/><circle cx="12.7" cy="-7.4" r=".7" fill="${P.night}"/>` +
      `</g>` +
      hair(72.6, 85, 71, 80.6, 73.6, 76.6, 0.6, P.blue) + hair(74.8, 83.6, 76.6, 79.6, 74.4, 75.6, 0.5, P.blue) +
      sparkle(42.6, 41.4, 2.4, '#fff') + sparkle(87, 44, 1.8) + sparkle(31, 56, 1.4) +
      k.defs()
    )
  },
}
