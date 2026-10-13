// Jenga en clave heroica: la torre de bloques de haya en isométrica, con su veta, sus puntas con anillos y el naranja
// de la ficha del juego en el papel, la noche y los acentos. A los personajes (el equilibrista, King Kong) no se los
// dibuja: aparecen por sus objetos (la sombrilla y la cuerda floja; la mano del gorila y el avioncito).
import { f } from '../helpers'
import { along, ellipse, hair, kit, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Naranja de la ficha de Jenga, con su sombra, su luz, un naranja pálido y la noche tostada. */
const J = '#D9822B', J_D = '#9A5417', J_L = '#F2B66E', J_XL = '#F9E3C6', J_N = '#2B1A10'
/** Madera de haya de los bloques: costado iluminado, tapa clara, costado en sombra, puntas (más oscuras), veta y junta. */
const WOOD = '#EFCC98', WOOD_L = '#FBE9C9', WOOD_D = '#C4874A', END = '#E2B174', END_D = '#AE7239', GRAIN = '#A86A30', SEAM = '#6E4220'
/** Pelo y cuero del gorila. */
const FUR = '#2C2830', FUR_L = '#6A6474', SKIN = '#45404A', SKIN_L = '#7C7482'
/** Hierro de la bola de demolición. */
const IRON = '#4B5068', IRON_D = '#262A3C', IRON_L = '#8C93AE'

/** Papel del día con el borde granulado en el naranja de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#F0C89A', 0.5, 0.46, 0.7, 0, 1), '#E2A266', 0.5)

/** Noche tostada, con un resplandor naranja en el medio. */
const dusk = (k: Kit, cy = 0.42) => `<rect width="120" height="130" fill="${J_N}"/>` + k.shade(FULL, k.rad(J_D, 0.48, cy, 0.55, 0.9, 0), J_D, 0.35)

/** Escenario naranja: un disco pálido con el borde granulado. */
const stageJ = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBEEDB"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(J_L, 0.5, 0.5, 0.5, 0, 1), J_L, 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${J}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor suave de un color. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Pseudoazar fijo (para que la veta no cambie entre dibujos). */
const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const C = 0.866
interface Iso {
  pt: (x: number, y: number, z: number) => number[]
  poly: (...ps: number[][]) => string
  fx: (X: number) => string
  fy: (Y: number) => string
  fz: (Z: number) => string
}
/** Isométrica con el origen en (ox, oy): x baja a la derecha, y baja a la izquierda y z sube. fx, fy y fz son las
 * matrices de las caras x = X (u = y, v = z), y = Y (u = x, v = z) y z = Z (u = x, v = y), para dibujar en ellas. */
function iso(ox: number, oy: number): Iso {
  const pt = (x: number, y: number, z: number) => [ox + (x - y) * C, oy + (x + y) * 0.5 - z]
  return {
    pt,
    poly: (...ps) => 'M' + ps.map(([x, y, z]) => pt(x, y, z).map(f).join(' ')).join('L') + 'Z',
    fx: (X) => `matrix(${-C} .5 0 -1 ${f(ox + X * C)} ${f(oy + X * 0.5)})`,
    fy: (Y) => `matrix(${C} .5 0 -1 ${f(ox - Y * C)} ${f(oy + Y * 0.5)})`,
    fz: (Z) => `matrix(${C} .5 ${-C} .5 ${ox} ${f(oy - Z)})`,
  }
}

/** Cambia u por v (para la veta que corre a lo alto). */
const swap = (s: string) => `<g transform="matrix(0 1 1 0 0 0)">${s}</g>`

/** Veta larga del costado de un bloque (u0..u1 a lo largo, v0..v1 a lo ancho), en coordenadas de la cara. */
function longGrain(u0: number, u1: number, v0: number, v1: number, seed: number, c = GRAIN, op = 0.6) {
  const L = u1 - u0, H = v1 - v0, w = Math.min(0.42, H * 0.12)
  let s = ''
  for (let i = 0; i < 2; i++) {
    const r = rnd(seed * 3 + i), v = v0 + H * (0.3 + i * 0.4) + (r - 0.5) * H * 0.14
    const a = u0 + L * (0.04 + r * 0.22), b = u1 - L * (0.04 + rnd(seed + i * 7) * 0.28)
    s += hair(a, v, (a + b) / 2, v + (i ? 1 : -1) * H * 0.24, b, v + (r - 0.5) * H * 0.2, w, c, op)
  }
  return s
}

/** Anillos de la punta de un bloque, recortados a su rectángulo. */
function endGrain(k: Kit, u0: number, u1: number, v0: number, v1: number, seed: number, c = GRAIN) {
  const w = u1 - u0, h = v1 - v0, cx = u0 + w * (0.15 + rnd(seed) * 0.7), cy = rnd(seed + 3) > 0.5 ? v0 - h * 0.35 : v1 + h * 0.35
  const rings = [0.55, 0.95, 1.4, 1.9].map((r) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * h)}" fill="none" stroke="${c}" stroke-width=".22" opacity=".6"/>`).join('')
  return k.clip(`M${f(u0)} ${f(v0)}H${f(u1)}V${f(v1)}H${f(u0)}Z`, rings)
}

interface Tower {
  svg: string
  I: Iso
  H: number
  h: number
  t: number
}
/** Torre de Jenga de `n` pisos de tres bloques cruzados sobre una base de lado B, con la esquina del frente abajo en
 * (cx, by). Los pisos pares (contando desde `from`) muestran las tres puntas en la cara derecha y los impares en la
 * izquierda; `holes` saca bloques [piso, 0|1|2] de esas caras. */
function tower(k: Kit, cx: number, by: number, B: number, n: number, o: { holes?: number[][]; h?: number; w?: number; from?: number } = {}): Tower {
  const h = o.h ?? B / 5, H = n * h, t = B / 3, I = iso(cx, by - B), from = o.from ?? 0
  const hole = (i: number, j: number) => (o.holes ?? []).some(([a, b]) => a === i && b === j)
  const side = (endsOn: number, lit: boolean) => {
    let s = '', seam = ''
    for (let i = 0; i < n; i++) {
      const z0 = i * h, z1 = z0 + h
      if (i) seam += `M0 ${f(z0)}H${f(B)}`
      if ((i + from) % 2 === endsOn) {
        for (let j = 0; j < 3; j++) {
          const u0 = j * t, u1 = u0 + t, r = `M${f(u0)} ${f(z0)}H${f(u1)}V${f(z1)}H${f(u0)}Z`
          s += hole(i, j)
            ? `<path d="${r}" fill="${J_N}"/><path d="M${f(u0)} ${f(z0)}H${f(u1)}V${f(z0 + h * 0.32)}H${f(u0)}Z" fill="${SEAM}"/><path d="M${f(u0 + t * 0.35)} ${f(z0 + h * 0.4)}H${f(u1 - t * 0.35)}V${f(z1 - h * 0.25)}H${f(u0 + t * 0.35)}Z" fill="${J_L}" opacity=".5"/>`
            : `<path d="${r}" fill="${lit ? END : END_D}"/>` + endGrain(k, u0, u1, z0, z1, (i + from) * 3 + j)
        }
        seam += `M${f(t)} ${f(z0)}V${f(z1)}M${f(2 * t)} ${f(z0)}V${f(z1)}`
      } else s += longGrain(0.4, B - 0.4, z0, z1, (i + from) * 5 + endsOn)
      if (lit) s += `<path d="M.4 ${f(z1 - 0.32)}H${f(B - 0.4)}" stroke="#fff" stroke-width=".3" opacity=".55"/>`
    }
    return s + `<path d="${seam}" fill="none" stroke="${SEAM}" stroke-width=".4"/>`
  }
  const alongX = (n - 1 + from) % 2 === 0
  let topIn = ''
  for (let j = 0; j < 3; j++) {
    const g = longGrain(0.5, B - 0.5, j * t, (j + 1) * t, 40 + j + from)
    topIn += alongX ? g : swap(g)
  }
  topIn += `<path d="${alongX ? `M0 ${f(t)}H${B}M0 ${f(2 * t)}H${B}` : `M${f(t)} 0V${B}M${f(2 * t)} 0V${B}`}" fill="none" stroke="${SEAM}" stroke-width=".4"/>`
  const L = I.poly([0, B, 0], [B, B, 0], [B, B, H], [0, B, H])
  const R = I.poly([B, 0, 0], [B, B, 0], [B, B, H], [B, 0, H])
  const T = I.poly([0, 0, H], [B, 0, H], [B, B, H], [0, B, H])
  const svg = k.draw([
    { d: L, fill: WOOD, inner: `<g transform="${I.fy(B)}">${side(1, true)}</g>` + k.sh(L, 0, 0, 0, 1, 0, 0.35, J_D, 0.25) + `<path d="${L}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` },
    { d: R, fill: WOOD_D, inner: `<g transform="${I.fx(B)}">${side(0, false)}</g>` + k.sh(R, 0, 0, 1, 0, 0.1, 0.75, J_D, 0.4) },
    { d: T, fill: WOOD_L, inner: `<g transform="${I.fz(H)}">${topIn}</g>` + k.sh(T, 0, 0, 1, 1, 0, 0.3, J, 0.2) },
  ], o.w ?? 0.75)
  return { svg, I, H, h, t }
}

/** Bloque como prisma en la isométrica I (x0..x1, y0..y1, z0..z1); `alongX` dice si el largo corre en x. */
function prism(k: Kit, I: Iso, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, alongX: boolean, seed = 0, w = 0.55) {
  const top = I.poly([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1])
  const lf = I.poly([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1])
  const rf = I.poly([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1])
  const rect = (a: number, b: number, c: number, d: number, fill: string) => `<path d="M${f(a)} ${f(c)}H${f(b)}V${f(d)}H${f(a)}Z" fill="${fill}"/>`
  const lfIn = alongX ? longGrain(x0 + 0.3, x1 - 0.3, z0, z1, seed) : rect(x0, x1, z0, z1, END) + endGrain(k, x0, x1, z0, z1, seed)
  const rfIn = alongX ? rect(y0, y1, z0, z1, END_D) + endGrain(k, y0, y1, z0, z1, seed + 1) : longGrain(y0 + 0.3, y1 - 0.3, z0, z1, seed + 1)
  const tIn = alongX ? longGrain(x0 + 0.3, x1 - 0.3, y0, y1, seed + 2) : swap(longGrain(y0 + 0.3, y1 - 0.3, x0, x1, seed + 2))
  return k.draw([
    { d: lf, fill: WOOD, inner: `<g transform="${I.fy(y1)}">${lfIn}</g>` + `<path d="${lf}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` },
    { d: rf, fill: WOOD_D, inner: `<g transform="${I.fx(x1)}">${rfIn}</g>` + k.sh(rf, 0, 0, 1, 0, 0, 0.6, J_D, 0.35) },
    { d: top, fill: WOOD_L, inner: `<g transform="${I.fz(z1)}">${tIn}</g>` },
  ], w)
}

/** Bloque suelto (que vuela o se cae), centrado en (x, y), girado `rot` y escalado `s`. */
const loose = (k: Kit, x: number, y: number, rot: number, s = 1, alongX = true, seed = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
  (alongX ? prism(k, iso(0, 0), -7.5, 7.5, -2.5, 2.5, -1.5, 1.5, true, seed, 0.55 / s) : prism(k, iso(0, 0), -2.5, 2.5, -7.5, 7.5, -1.5, 1.5, false, seed, 0.55 / s)) +
  `</g>`

/** Cuerda (soga, cable): tinta por fuera, color y un brillo fino. */
const cord = (d: string, c: string, w = 1.2, hi = '#fff') =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`

/** Esfera de reloj grabada de fondo: disco pálido, anillo de minutos y los números romanos de los cuartos. */
function dial(k: Kit, cx: number, cy: number, r: number) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * Math.PI * 2, r0 = r - (i % 5 ? 2.2 : 3.6), r1 = r - 0.9
    return `M${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)}L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}`
  }).join('')
  const num = (t: string, a: number) => {
    const x = cx + Math.cos(a) * (r - 7.4), y = cy + Math.sin(a) * (r - 7.4) + 1.6
    return `<text x="${f(x)}" y="${f(y)}" ${GEORGIA} font-size="4.6" fill="${J_D}" text-anchor="middle" opacity=".8">${t}</text>`
  }
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${J_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(J_L, 0.5, 0.5, 0.5, 0, 0.9), J_L, 0.55) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${J}" stroke-width=".9"/><circle cx="${cx}" cy="${cy}" r="${f(r - 1.4)}" fill="none" stroke="${J_L}" stroke-width=".4"/>` +
    `<path d="${ticks}" stroke="${J_D}" stroke-width=".4" opacity=".75"/>` +
    num('XII', -Math.PI / 2) + num('III', 0) + num('VI', Math.PI / 2) + num('IX', Math.PI) +
    [0.5, 1, 2, 2.5, 3.5, 4, 5, 5.5].map((q) => { const a = (q / 6) * Math.PI - Math.PI / 2; return `<circle cx="${f(cx + Math.cos(a) * (r - 7))}" cy="${f(cy + Math.sin(a) * (r - 7))}" r=".7" fill="${J_L}" stroke="${J_D}" stroke-width=".25"/>` }).join('')
  )
}

export const JENGA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Pulso firme ────────────────────────────────────────────────────

  // Dos sin tirarla: la pinza de relojero saca un bloque, y la lupa de ojo lo agranda con su veta y todo.
  'Mano de relojero': (u) => {
    const k = kit(u)
    const B = 20, cx = 48, by = 95
    const [ex, ey] = iso(cx, by - B).pt(B + 7.6, B / 2, 18)
    // La pinza: dos hojas de acero con la zona estriada, unidas atrás; las puntas en (0, ±2.4) y el lomo hacia +x.
    const blade = 'M0 -2.5C4 -3.1 8 -4.4 12 -4.7L26 -3.5C28.4 -3.3 30.6 -2.6 30.6 -1.4V0H28L13 -2.5C8.6 -2.4 4 -2.1 .3 -1.9Z'
    const lower = 'M0 2.5C4 3.1 8 4.4 12 4.7L26 3.5C28.4 3.3 30.6 2.6 30.6 1.4V0H28L13 2.5C8.6 2.4 4 2.1 .3 1.9Z'
    const knurl = (sg: number) => Array.from({ length: 6 }, (_, i) => `<path d="M${13 + i * 1.8} ${f(sg * 2.6)}L${f(14.4 + i * 1.8)} ${f(sg * 4.4)}" stroke="${P.blue}" stroke-width=".35"/>`).join('')
    const tweezers = (kk: Kit) =>
      `<g transform="translate(${f(ex)} ${f(ey)}) rotate(-36)">` +
      kk.draw([
        { d: lower, fill: P.white, inner: kk.sh(lower, 0, 0, 0, 1, 0, 0.9, P.blue, 0.45) + knurl(1) },
        { d: blade, fill: P.white, inner: kk.sh(blade, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + knurl(-1) + `<path d="M2 -2.6C6 -3.2 10 -4 13 -4.1" stroke="#fff" stroke-width=".5"/>` },
        { d: roundRect(27.4, -1.8, 32.4, 1.8, 1.4), fill: P.sky1, inner: kk.sh(roundRect(27.4, -1.8, 32.4, 1.8, 1.4), 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) },
      ], 0.45) +
      `</g>`
    // La escena: la torre, el bloque que sale y la pinza (la lupa la vuelve a dibujar agrandada).
    const scene = (kk: Kit) => {
      const T = tower(kk, cx, by, B, 8)
      return T.svg + prism(kk, T.I, B, B + 9, T.t, 2 * T.t, 4 * T.h, 5 * T.h, true, 3) + tweezers(kk)
    }
    const lx = f(ex + 1), ly = f(ey - 1), R = 11.4, Z = 1.75
    const lens = ellipse(lx, ly, R, R)
    const back = ellipse(lx + 3.4, ly - 2.8, R + 3.4, R + 3.4)
    const n = [0.64, 0.77], hull = `M${f(lx + n[0] * (R + 2.6))} ${f(ly + n[1] * (R + 2.6))}L${f(lx + 3.4 + n[0] * (R + 3.4))} ${f(ly - 2.8 + n[1] * (R + 3.4))}L${f(lx + 3.4 - n[0] * (R + 3.4))} ${f(ly - 2.8 - n[1] * (R + 3.4))}L${f(lx - n[0] * (R + 2.6))} ${f(ly - n[1] * (R + 2.6))}Z`
    const rim = `${ellipse(lx, ly, R + 2.6, R + 2.6)} ${ellipse(lx, ly, R, R)}`
    const ticks = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2
      return `M${f(lx + Math.cos(a) * (R + 0.5))} ${f(ly + Math.sin(a) * (R + 0.5))}L${f(lx + Math.cos(a) * (R + 2.2))} ${f(ly + Math.sin(a) * (R + 2.2))}`
    }).join('')
    return (
      field(k) +
      dial(k, 58, 60, 34) +
      k.floor(50, 92, 24, 3.2) +
      k.draw([
        { d: back, fill: P.night, inner: k.sh(back, 0, 0, 1, 1, 0, 0.8, '#0E1430', 0.5) },
        { d: hull, fill: P.night, inner: `<path d="${hull}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.9, 0)}"/>` + [0.35, 0.7].map((q) => `<path d="${ellipse(f(lx + 3.4 * q), f(ly - 2.8 * q), f(R + 2.6 + q * 0.8), f(R + 2.6 + q * 0.8))}" fill="none" stroke="${P.mid}" stroke-width=".5" opacity=".7"/>`).join('') },
      ], 0.6) +
      scene(k) +
      k.clip(lens, `<rect width="120" height="130" fill="#FCF0DE"/><g transform="translate(${lx} ${ly}) scale(${Z}) translate(${-lx} ${-ly})">${scene(k)}</g>` +
        k.sh(lens, 0, 0, 1, 1, 0.1, 0.55, P.sky2, 0.4) + `<path d="${lens}" fill="${k.rad('#ffffff', 0.35, 0.3, 0.5, 0.45, 0)}"/>`) +
      `<path d="${rim}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.5 .6)"/><path d="${rim}" fill-rule="evenodd" fill="${P.night}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="${ticks}" stroke="${P.mid}" stroke-width=".5"/>` +
      `<path d="${ellipse(lx, ly, R + 0.2, R + 0.2)}" fill="none" stroke="${J}" stroke-width=".7"/>` +
      `<path d="M${f(lx - R * 0.72)} ${f(ly - R * 0.3)}A${R * 0.8} ${R * 0.8} 0 0 1 ${f(lx - R * 0.2)} ${f(ly - R * 0.76)}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M${f(lx + R * 0.66)} ${f(ly + R * 0.34)}A${R * 0.75} ${R * 0.75} 0 0 1 ${f(lx + R * 0.36)} ${f(ly + R * 0.66)}" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` +
      sparkle(f(lx - R * 0.5), f(ly - R * 0.56), 2.4, '#fff') +
      sparkle(30, 46, 2) + sparkle(88, 84, 1.5) +
      k.defs()
    )
  },

  // Ocho ganadas: tres bloques atados como cartuchos, con el despertador; la pinza corta el cable azul sin temblar.
  'Desactivador de bombas': (u) => {
    const k = kit(u)
    const w = 8.6, y1 = 81, dx = 3.2, dy = -2.6
    const sticks = [[45.2, 49.6], [53.8, 45.4], [62.4, 48.2]]
    const stick = ([x, y0]: number[], i: number) => {
      const front = `M${x} ${y0}H${f(x + w)}V${y1}H${x}Z`
      const top = `M${x} ${y0}L${f(x + dx)} ${f(y0 + dy)}H${f(x + w + dx)}L${f(x + w)} ${y0}Z`
      const side = `M${f(x + w)} ${y0}L${f(x + w + dx)} ${f(y0 + dy)}V${f(y1 + dy)}L${f(x + w)} ${y1}Z`
      const rings = k.clip(top, [1.2, 2.4, 3.6, 4.8].map((r) => `<ellipse cx="${f(x + w * (0.3 + rnd(i) * 0.4) + dx / 2)}" cy="${f(y0 + dy / 2 + 1.6)}" rx="${f(r)}" ry="${f(r * 0.4)}" fill="none" stroke="${GRAIN}" stroke-width=".25" opacity=".7"/>`).join(''))
      return k.draw([
        { d: side, fill: WOOD_D, inner: swap(longGrain(y0 + dy + 1, y1 + dy - 1, x + w, x + w + dx, 9 + i)) + k.sh(side, 0, 0, 1, 0, 0, 0.6, J_D, 0.35) },
        { d: front, fill: WOOD, inner: swap(longGrain(y0 + 1, y1 - 1, x, x + w, i * 4)) + k.sh(front, 0, 0, 1, 0, 0, 0.45, J_D, 0.3) + `<path d="M${f(x + 0.7)} ${y0 + 0.6}V${y1 - 0.6}" stroke="#fff" stroke-width=".45" opacity=".6"/>` },
        { d: top, fill: END },
      ], 0.65) + rings
    }
    const x0 = sticks[0][0], xr = sticks[2][0] + w
    const band = (yb: number) =>
      k.draw([
        { d: `M${f(xr)} ${yb}L${f(xr + dx)} ${f(yb + dy)}V${f(yb + dy + 4.4)}L${f(xr)} ${f(yb + 4.4)}Z`, fill: '#1E1A1F' },
        { d: `M${x0 - 0.4} ${yb}H${f(xr)}V${f(yb + 4.4)}H${x0 - 0.4}Z`, fill: '#2C272E', inner: `<path d="M${x0} ${f(yb + 1)}H${f(xr)}" stroke="${P.sky2}" stroke-width=".6" opacity=".55"/>` + hair(x0 + 3, yb + 3.2, x0 + 10, yb + 3.6, x0 + 16, yb + 3, 0.4, '#5B5560') },
      ], 0.45)
    // El despertador de campanitas, naranja como la caja del juego.
    const cx = 58.4, cy = 64.6, R = 8.4
    const bell = (sgn: number) => {
      const d = `M${f(cx + sgn * 3.4)} ${f(cy - R - 0.6)}C${f(cx + sgn * 3.4)} ${f(cy - R - 5.6)} ${f(cx + sgn * 10)} ${f(cy - R - 6)} ${f(cx + sgn * 10.4)} ${f(cy - R - 1.4)}Z`
      return { d, fill: P.gold, inner: k.sh(d, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M${f(cx + sgn * 4.6)} ${f(cy - R - 2)}C${f(cx + sgn * 5)} ${f(cy - R - 4.4)} ${f(cx + sgn * 7)} ${f(cy - R - 4.8)} ${f(cx + sgn * 8.4)} ${f(cy - R - 4.2)}" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/>` }
    }
    const caseD = ellipse(cx, cy, R, R), face = ellipse(cx, cy, R - 2, R - 2)
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2, r0 = R - 2.9, r1 = i % 3 ? R - 2.6 : R - 3.6
      return `<path d="M${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)}" stroke="${P.ink}" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`
    }).join('')
    // La pinza: mordazas de acero y mangos naranjas, con el eje en el origen y las puntas hacia -x.
    const jawA = 'M1.6 -1.6L-8.4 -3.2C-9.6 -3.3 -10.2 -2.4 -9.4 -1.6L-1 1Z', jawB = 'M1.6 1.6L-8.4 3.6C-9.6 3.8 -10.2 2.8 -9.4 2.2L-1 -1Z'
    const gripA = taper(2, -1.4, 8, -3, 15, -4.4, 3, 2.6), gripB = taper(2, 1.4, 8, 3.2, 15, 5.2, 3, 2.6)
    const pliers =
      `<g transform="translate(85.6 63.6) rotate(62)">` +
      k.draw([
        { d: gripB, fill: J, inner: k.sh(gripB, 0, 0, 0, 1, 0, 0.9, J_D, 0.45) },
        { d: jawB, fill: P.white, inner: k.sh(jawB, 0, 0, 0, 1, 0.1, 0.9, P.blue, 0.45) },
        { d: gripA, fill: J, inner: k.sh(gripA, 0, 0, 0, 1, 0, 0.8, J_D, 0.4) + `<path d="M5 -3L13.6 -4.8" stroke="#fff" stroke-width=".5" opacity=".6"/>` },
        { d: jawA, fill: P.white, inner: k.sh(jawA, 0, 0, 0, 1, 0.1, 0.9, P.blue, 0.45) + `<path d="M-7.6 -2.6L-1.4 -1.2" stroke="#fff" stroke-width=".4"/>` },
      ], 0.5) +
      `<circle cx="0" cy="0" r="1.7" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".5"/><circle cx="0" cy="0" r=".6" fill="${P.mid}"/>` +
      `</g>`
    return (
      field(k) +
      k.sun(58, 62, 15, 47, 32, false) +
      glow(k, 58, 62, 26, 26, 0.6) +
      k.floor(61, 82, 22, 3) +
      sticks.map(stick).join('') +
      band(53) + band(73.4) +
      cord(`M51 61.6C43 60 36.6 53.6 39.8 47.6C41.6 44.4 45.4 44.6 48.2 46.8`, P.red, 1.1) +
      cord(`M65.8 61C72 60 77.6 58.4 79.8 55.6C82 52.6 79 48.6 73 48C70.4 47.8 68.8 47.4 67.4 46`, P.sky, 1.1) +
      k.draw([bell(-1), bell(1), { d: caseD, fill: J, inner: k.sh(caseD, 0, 0, 1, 1, 0, 0.9, J_D, 0.5) + `<path d="M${cx - 6} ${cy - 4}A7 7 0 0 1 ${cx - 1} ${cy - 7.4}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` }], 0.6) +
      `<path d="M${cx} ${f(cy - R - 0.6)}V${f(cy - R - 4)}" stroke="${P.ink}" stroke-width="1.1"/><circle cx="${cx}" cy="${f(cy - R - 4.6)}" r="1.1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M${cx - 5.6} ${f(cy + R - 1.4)}L${cx - 7.4} ${f(cy + R + 1.8)}M${cx + 5.6} ${f(cy + R - 1.4)}L${cx + 7.4} ${f(cy + R + 1.8)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/>` +
      k.draw([{ d: face, fill: P.white, inner: k.sh(face, 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) }], 0.35) + ticks +
      `<path d="M${cx} ${cy}L${cx - 2.4} ${cy - 3.6}M${cx} ${cy}L${cx + 4.4} ${cy + 0.6}" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/><path d="M${cx} ${cy}L${cx + 1.2} ${cy + 4.8}" stroke="${P.red}" stroke-width=".4"/><circle cx="${cx}" cy="${cy}" r=".7" fill="${P.red}"/>` +
      pliers +
      `<path d="M82.4 53L84.4 51.2M83.4 55.4L86 55M80.6 51.6L80.8 49.2" stroke="${P.goldD}" stroke-width=".55" stroke-linecap="round"/>` +
      sparkle(33, 76, 1.8) + sparkle(86, 34, 2.2) +
      k.defs()
    )
  },

  // Veinte en pie: la torre cruza la cuerda floja con sombrilla, bajo el reflector y entre los telones del circo.
  'Equilibrista de circo': (u) => {
    const k = kit(u)
    const curtain = 'M6 6H34C33.4 24 29 40 22.6 50C25.4 62 28 84 30 120H6Z'
    const folds = hair(12, 8, 14, 28, 19, 48, 0.6, J_D) + hair(20, 8, 22, 28, 21.6, 48, 0.55, J_D) + hair(28, 8, 26.6, 26, 22.6, 48, 0.5, J_D) +
      hair(24, 54, 25.6, 80, 27, 118, 0.55, J_D) + hair(19, 56, 19, 84, 18, 118, 0.6, J_D) + hair(13, 56, 12.4, 84, 11, 118, 0.5, J_D)
    const drape = (flip: boolean) =>
      `<g${flip ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` +
      k.draw([{ d: curtain, fill: J, inner: k.sh(curtain, 0, 0, 1, 0, 0, 0.85, J_D, 0.45) + `<path d="M6 6H16V120H6Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + folds + k.sh('M6 6H34V20H6Z', 0, 0, 0, 1, 0.7, 0, J_N, 0.3) }], 0.7) +
      cord('M17 49.6C20.4 52.4 24.4 52.4 26.6 49', P.gold, 1.3, P.goldL) +
      `<circle cx="26.8" cy="49.6" r="1.6" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M25.6 50.8L24.8 57.4H28.6L28 50.8Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M25.8 52.6V57M26.8 52.6V57.2M27.8 52.6V57" stroke="${P.goldD}" stroke-width=".3"/>` +
      `</g>`
    const B = 13, cxT = 60, base = 84
    const T = tower(k, cxT, base + B / 2, B, 10, { w: 0.7 })
    const top = base - T.H
    // La sombrilla: gajos alternados naranja y crema, flecos dorados y el regatón arriba.
    const ay = -11.4, rim = Array.from({ length: 9 }, (_, i) => -14.6 + i * 3.65)
    const gore = (i: number) => {
      const a = rim[i], b = rim[i + 1]
      return `M0 ${ay}Q${f(a * 0.62)} ${f(-8.4 + Math.abs(a) * 0.05)} ${f(a)} 0Q${f((a + b) / 2)} 2.6 ${f(b)} 0Q${f(b * 0.62)} ${f(-8.4 + Math.abs(b) * 0.05)} 0 ${ay}Z`
    }
    const parasol =
      `<g transform="translate(${cxT} ${f(top - 12)}) rotate(-8)">` +
      `<path d="M0 -12V12" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M0 -12V12" stroke="${P.goldD}" stroke-width=".7"/>` +
      k.draw(Array.from({ length: 8 }, (_, i) => ({ d: gore(i), fill: i % 2 ? P.white : J, inner: k.sh(gore(i), 0, 0, 1, 1, 0, 0.8, i % 2 ? P.blue : J_D, 0.4) + (i < 3 ? `<path d="${gore(i)}" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` : '') + hair(0, ay + 1, (rim[i] + rim[i + 1]) * 0.3, -6, (rim[i] + rim[i + 1]) / 2, -0.6, 0.35, i % 2 ? P.sky2 : J_D, 0.8) })), 0.6) +
      rim.map((x) => `<path d="M${f(x)} 0V2.2" stroke="${P.goldD}" stroke-width=".5"/><circle cx="${f(x)}" cy="2.7" r=".75" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      `<path d="M-.8 -11.4L0 -15.4L.8 -11.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="0" cy="-11.6" r="1.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>`
    const lx = f(cxT - B * C), rx = f(cxT + B * C)
    const rope = `M4 66Q30 72 ${lx} ${base}M${rx} ${base}Q90 72 116 66`
    const twist = (x0: number, y0: number, qx: number, qy: number, x1: number, y1: number) =>
      along(x0, y0, qx, qy, x1, y1, [0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]).map((q) => `<path d="M${f(q.x - 0.7)} ${f(q.y - 0.7)}L${f(q.x + 0.6)} ${f(q.y + 0.5)}" stroke="${P.goldD}" stroke-width=".4"/>`).join('')
    return (
      dusk(k, 0.5) +
      k.sun(60, 60, 13, 50, 32, false) +
      glow(k, 60, 58, 30, 30, 0.55) +
      k.shade(ellipse(60, 92, 26, 5), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.4) +
      cord(rope, P.white, 1.3, P.goldL) + twist(4, 66, 30, 72, lx, base) + twist(rx, base, 90, 72, 116, 66) +
      T.svg + parasol +
      drape(false) + drape(true) +
      sparkle(60, 24, 2.4, P.goldL) + sparkle(40, 78, 1.4, P.goldL) + sparkle(82, 40, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Rascacielos ────────────────────────────────────────────────────

  // Veinticuatro pisos: el monoblock de bloques, con tanque, antena, ropa tendida y el cartel del ascensor.
  'Edificio de monoblock': (u) => {
    const k = kit(u)
    const B = 17, T = tower(k, 60, 96, B, 13, { holes: [[4, 1], [7, 2], [10, 0]] })
    const { I, h, t, H } = T
    const stubA = prism(k, I, 0.3, t - 0.3, B, B + 5, 9 * h, 10 * h, false, 7)
    const lineStart = I.pt(t / 2, B + 5, 9.6 * h)
    const roof = I.pt(B / 2, B / 2, H)
    const tank = (x: number, y: number) => {
      const body = `M${x - 5} ${y - 7}V${y}A5 2 0 0 0 ${x + 5} ${y}V${y - 7}Z`
      return k.draw([
        { d: body, fill: P.sky2, inner: k.sh(body, 0, 0, 1, 0, 0, 0.85, P.mid, 0.45) + `<path d="M${x - 5} ${y - 3.6}A5 2 0 0 0 ${x + 5} ${y - 3.6}" fill="none" stroke="${P.mid}" stroke-width=".4"/>` + `<path d="M${x - 3.6} ${y - 6}V${y}" stroke="#fff" stroke-width=".6" opacity=".6"/>` },
        { d: ellipse(x, y - 7, 5, 2), fill: P.sky1, inner: k.sh(ellipse(x, y - 7, 5, 2), 0, 0, 1, 1, 0, 0.6, P.blue, 0.3) },
      ], 0.5) + `<path d="M${x - 3} ${y + 1.2}V${y + 3.4}M${x + 3} ${y + 1.2}V${y + 3.4}" stroke="${P.ink}" stroke-width=".9"/>`
    }
    const ax = roof[0] + 6.4, ay = roof[1] + 0.6
    const antenna =
      `<path d="M${f(ax)} ${f(ay)}V${f(ay - 21)}" stroke="${P.ink}" stroke-width=".9"/>` +
      [[-18, 6.4], [-14.6, 5.2], [-11.2, 4]].map(([dy, w]) => `<path d="M${f(ax - w)} ${f(ay + dy + 1.6)}L${f(ax)} ${f(ay + dy)}L${f(ax + w)} ${f(ay + dy + 1.6)}" fill="none" stroke="${P.ink}" stroke-width=".55"/>`).join('') +
      `<path d="M${f(ax - 5.4)} ${f(ay - 6)}H${f(ax + 5.4)}" stroke="${P.ink}" stroke-width=".55"/><circle cx="${f(ax)}" cy="${f(ay - 21.4)}" r=".7" fill="${P.red}"/>`
    const shirt = 'M-3.6 0L-1.4 -.4C-.8 .6 .8 .6 1.4 -.4L3.6 0L4.4 2.6L2.8 3V7.6H-2.8V3L-4.4 2.6Z'
    const sock = 'M-1 0H1.2V4.6L3.4 6.2C4.2 6.8 3.8 8 2.8 7.8L-.2 7C-.8 6.8 -1 6.4 -1 5.8Z'
    const [lx, ly] = lineStart
    const line = `M${f(lx)} ${f(ly)}Q32 ${f(ly - 2)} 20 ${f(ly - 9)}`
    const signM = `matrix(${C} .5 0 1 ${f(60 - B * C)} ${f(96 - B + B * 0.5)})`
    return (
      field(k) +
      stageJ(k, 60, 60, 34) +
      k.floor(61, 93.4, 22, 3) +
      T.svg + stubA +
      tank(roof[0] - 2.2, roof[1] - 1.4) + antenna +
      `<path d="${line}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="translate(34.6 ${f(ly - 3.2)}) rotate(14)">` + k.draw([{ d: shirt, fill: J, inner: k.sh(shirt, 0, 0, 1, 1, 0, 0.8, J_D, 0.4) }], 0.4) + `<path d="M-1.4 -.3L0 1.2L1.4 -.3" fill="none" stroke="${J_D}" stroke-width=".4"/></g>` +
      `<g transform="translate(26.6 ${f(ly - 6.4)}) rotate(22)">` + k.draw([{ d: sock, fill: P.sky, inner: `<path d="M-1 1.4H1.2" stroke="${P.white}" stroke-width=".8"/>` + k.sh(sock, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) }], 0.4) + `</g>` +
      `<path d="M33.4 ${f(ly - 3.6)}l.4 -1.6M36 ${f(ly - 2.8)}l.4 -1.6M26.2 ${f(ly - 6.8)}l.6 -1.4" stroke="${P.ink}" stroke-width=".5"/>` +
      `<g transform="${signM}"><g transform="translate(1.4 -10.4) rotate(-3)">` +
      k.draw([{ d: roundRect(0, -4.8, 14.2, 0, 0.4), fill: P.white, inner: k.sh(roundRect(0, -4.8, 14.2, 0, 0.4), 0, 0, 1, 1, 0, 0.5, J_L, 0.3) }], 0.3) +
      `<text x="7.1" y="-1.5" ${GEORGIA} font-style="italic" font-size="2.35" fill="${P.ink}" text-anchor="middle">sin ascensor</text>` +
      `<path d="M.4 -4.6L1.6 -3.4M13.8 -4.6L12.6 -3.4" stroke="${J_L}" stroke-width=".9"/></g></g>` +
      sparkle(86, 40, 2.2) + sparkle(30, 76, 1.5) +
      k.defs()
    )
  },

  // Treinta pisos: el Kavanagh hecho de bloques, escalonado como el de verdad, con la bandera arriba.
  'Kavanagh': (u) => {
    const k = kit(u)
    const tiers = [[21, 4], [17.2, 4], [13.8, 5], [10.4, 5], [7.2, 5], [4.4, 3]] as const
    const h = 1.9, by0 = 97, B0 = tiers[0][0], gy = by0 - B0 / 2
    let z = 0, from = 0, svg = ''
    for (const [B, n] of tiers) {
      svg += tower(k, 60, gy + B / 2 - z, B, n, { h, from, w: 0.65 }).svg
      z += n * h
      from += n
    }
    const topY = gy - z
    const flag = (x: number, y: number) => {
      const d = `M${x} ${y}C${x + 4} ${y - 1.4} ${x + 7} ${y + 1.4} ${x + 11} ${y}V${y + 7.2}C${x + 7} ${y + 8.6} ${x + 4} ${y + 5.8} ${x} ${y + 7.2}Z`
      return k.draw([{ d, fill: P.white, inner: `<path d="M${x - 1} ${y - 2}H${x + 12}V${y + 2.4}H${x - 1}Z" fill="${P.sky}"/><path d="M${x - 1} ${y + 4.8}H${x + 12}V${y + 10}H${x - 1}Z" fill="${P.sky}"/>` + k.sh(d, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) }], 0.4) +
        `<circle cx="${x + 5.4}" cy="${y + 3.6}" r=".9" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".25"/>`
    }
    return (
      field(k) +
      k.sun(60, 44, 13, 44) +
      glow(k, 60, 44, 20, 20, 0.6) +
      k.floor(60, 95, 30, 3.4) +
      svg +
      `<path d="M60 ${f(topY + 1.2)}V${f(topY - 13)}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M60 ${f(topY + 1)}V${f(topY - 12.8)}" stroke="${P.white}" stroke-width=".5"/>` +
      `<circle cx="60" cy="${f(topY - 13.4)}" r="1" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      flag(60.6, f(topY - 12.6)) +
      sparkle(32, 52, 2) + sparkle(88, 70, 1.6) +
      k.defs()
    )
  },

  // Treinta y seis pisos: la torre de Babel de bloques llega a las nubes, y arriba nadie se entiende.
  'Torre de Babel': (u) => {
    const k = kit(u)
    const cx = 60, ry = 0.28, N = 7
    let yb = 85, out = ''
    for (let i = 0; i < N; i++) {
      const r = 23.6 - i * 2.95, hg = 7.4 - i * 0.4, yt = yb - hg, e = r * ry
      const band = `M${f(cx - r)} ${f(yt)}L${f(cx - r)} ${f(yb)}A${f(r)} ${f(e)} 0 0 0 ${f(cx + r)} ${f(yb)}L${f(cx + r)} ${f(yt)}A${f(r)} ${f(e)} 0 0 1 ${f(cx - r)} ${f(yt)}Z`
      const cap = ellipse(cx, f(yt), f(r), f(e))
      // Hiladas de bloques: arcos que siguen la curva y juntas verticales alternadas.
      const rows = 3, rh = hg / rows
      let courses = ''
      for (let j = 1; j < rows; j++) courses += `M${f(cx - r)} ${f(yb - j * rh)}A${f(r)} ${f(e)} 0 0 0 ${f(cx + r)} ${f(yb - j * rh)}`
      for (let j = 0; j < rows; j++) {
        const n = Math.max(6, Math.round(r / 2))
        for (let q = 1; q < n; q++) {
          const th = ((q + (j % 2) * 0.5) / n) * Math.PI
          if (th >= Math.PI) continue
          const x = cx - Math.cos(th) * r, yy = Math.sin(th) * e
          courses += `M${f(x)} ${f(yb - j * rh + yy)}V${f(yb - (j + 1) * rh + yy)}`
        }
      }
      // Arcos de la galería (oscuros), más angostos hacia los costados.
      let arches = ''
      if (i < 6) {
        const n = Math.max(4, Math.round(r / 3.6))
        for (let q = 0; q < n; q++) {
          const th = ((q + 0.5) / n) * Math.PI, x = cx - Math.cos(th) * r, s = Math.sin(th), aw = 1.3 * s + 0.2, base = yb - 0.8 + Math.sin(th) * e, top = base - hg * 0.55
          arches += `<path d="M${f(x - aw)} ${f(base)}V${f(top + aw)}A${f(aw)} ${f(aw)} 0 0 1 ${f(x + aw)} ${f(top + aw)}V${f(base)}Z" fill="${J_N}" opacity="${f(0.55 + s * 0.4)}"/>`
        }
      }
      // La rampa que sube en espiral, de abajo a la izquierda hasta arriba a la derecha.
      const up: string[] = [], lo: string[] = []
      for (let q = 0; q <= 16; q++) {
        const ph = (q / 16) * Math.PI, x = cx - Math.cos(ph) * r, yf = yb + Math.sin(ph) * e, z = hg * (0.06 + 0.7 * (q / 16))
        up.push(`${f(x)} ${f(yf - z - 1.5)}`)
        lo.push(`${f(x)} ${f(yf - z)}`)
      }
      const ramp = `<path d="M${up.join('L')}L${lo.reverse().join('L')}Z" fill="${WOOD_L}"/><path d="M${lo.reverse().join('L')}" fill="none" stroke="${SEAM}" stroke-width=".55"/><path d="M${up.join('L')}" fill="none" stroke="#fff" stroke-width=".35" opacity=".8"/>`
      out += k.draw([
        {
          d: band, fill: WOOD,
          inner: k.sh(`M${cx} 0H${cx + 40}V130H${cx}Z`, 0, 0, 1, 0, 0, 0.85, J_D, 0.45) + `<path d="M${f(cx - r)} 0H${f(cx - r * 0.45)}V130H${f(cx - r)}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` +
            `<path d="${courses}" fill="none" stroke="${SEAM}" stroke-width=".32" opacity=".8"/>` + arches + ramp + k.sh(band, 0, 0, 0, 1, 0, 0.3, J_D, 0.2),
        },
        { d: cap, fill: WOOD_L, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.6, J, 0.3) },
      ], i ? 0.55 : 0.7)
      yb = yt
    }
    const topY = yb
    const stubs =
      `<path d="M54 ${f(topY - 0.6)}h2.8v-2.6H54ZM57.8 ${f(topY - 1)}h3.2v-3.8h-3.2ZM62 ${f(topY - 0.4)}h2.6v-2.2H62Z" fill="${WOOD_D}" stroke="${P.ink}" stroke-width=".45"/>`
    const cloud = (x: number, y: number, s: number, fl = 1) => {
      const d = 'M-14 3C-17 3 -18 0 -15.6 -1.6C-16 -5 -12 -7 -9.4 -5C-8 -9 -2 -10 0 -6.4C2 -9.6 8 -9 8.6 -4.6C12 -6 16 -3 14.4 .4C17 1 16.6 3.4 14 3.6Z'
      return `<g transform="translate(${x} ${y}) scale(${s * fl} ${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0.1, 0.8, J_L, 0.4) }], 0.5 / s) + `</g>`
    }
    const word = (x: number, y: number, r: number, s: string, size: number) =>
      `<text x="${x}" y="${y}" ${GEORGIA} font-style="italic" font-weight="700" font-size="${size}" fill="${P.ink}" text-anchor="middle" transform="rotate(${r} ${x} ${y})">${s}</text>`
    return (
      field(k) +
      k.sun(60, 40, 12, 46, 32, false) +
      glow(k, 60, 40, 24, 18, 0.8) +
      k.floor(60, 91, 26, 3) +
      out + stubs +
      cloud(54, f(topY - 2.4), 0.8) + cloud(71, f(topY + 0.6), 0.6, -1) + cloud(43, f(topY + 7), 0.5, -1) +
      word(32, 50, -14, 'Ж', 6.4) + word(88, 48, 12, 'λ', 6.4) + word(87.6, 68, -8, '¿?', 5) + word(31, 70, 10, 'ñ', 5.6) +
      sparkle(60, 22, 2.6, '#fff') +
      k.defs()
    )
  },

  // ── Demoledor ──────────────────────────────────────────────────────

  // Dos derrumbes: un hipo y la torre se va de costado. Al lado, el vaso de agua.
  'Hipo': (u) => {
    const k = kit(u)
    const B = 14, low = tower(k, 66, 95, B, 8)
    const up = tower(k, 66, 95 - low.H, B, 3, { from: 8 })
    const glass = 'M31 62H44L42.6 91.4H32.4Z'
    const water = 'M31.4 70.4C35.4 69.4 39.6 71.4 43.6 70.4L42.6 91.4H32.4Z'
    return (
      field(k) +
      stageJ(k, 60, 60, 34) +
      k.floor(64, 93.4, 18, 2.6) + k.floor(40.6, 87.6, 8, 1.6) +
      `<g transform="rotate(-6 66 95)">` + low.svg +
      `<g transform="translate(5 1) rotate(14 ${f(66 + B * C * 0.5)} ${f(95 - low.H)})">` + up.svg + `</g></g>` +
      loose(k, 88, 52, 34, 0.75, true, 3) + loose(k, 82, 36, -18, 0.62, false, 5) +
      hair(46, 92, 44.4, 88, 46, 84, 0.6, J_D) + hair(43, 93.4, 41.4, 89, 43, 85, 0.5, J_D) + hair(78, 92, 79.6, 88, 78, 84, 0.6, J_D) + hair(81, 93, 82.6, 89, 81, 85, 0.5, J_D) +
      hair(74, 44, 78, 40, 82, 42, 0.5, J_D) + hair(92, 62, 96, 60, 96, 56, 0.45, J_D) +
      `<g transform="translate(2.6 -4)">` +
      k.draw([{
        d: glass, fill: P.white,
        inner: `<path d="${water}" fill="${P.sky}"/>` + k.sh(water, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) + `<path d="M31.4 70.4C35.4 69.4 39.6 71.4 43.6 70.4" fill="none" stroke="#fff" stroke-width=".7"/>` +
          `<path d="M33.4 65V88" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>` + k.sh(glass, 0, 0, 1, 0, 0.3, 0.6, P.sky2, 0.3) +
          [[37.4, 83, 0.7], [40, 78, 0.5], [36.4, 75, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width=".4"/>`).join(''),
      }], 0.6) +
      `<path d="M31 62H44" stroke="${P.ink}" stroke-width=".5"/>` +
      `</g>` +
      `<text x="40" y="47" ${GEORGIA} font-style="italic" font-size="9" fill="${J_D}" text-anchor="middle" transform="rotate(-10 40 47)">¡hip!</text>` +
      hair(28, 46, 30.6, 42, 33.4, 40, 0.6, J_D) + hair(51, 36, 54, 38, 55.4, 41.6, 0.6, J_D) +
      sparkle(90, 78, 1.6) +
      k.defs()
    )
  },

  // Seis derrumbes: la bola de hierro entra en la torre, vuelan los bloques y se levanta el polvo.
  'Bola de demolición': (u) => {
    const k = kit(u)
    const B = 13, T = tower(k, 76, 93, B, 7, { holes: [[3, 1]] })
    const ball = 'M44 51.6C52.4 51.6 58 58.4 58 66.2C58 74.6 51.8 81 43.4 81C35 81 29 74.4 29 66.4C29 58.4 35.4 51.6 44 51.6Z'
    const cap = 'M39.4 52.6C40 49.4 41.8 47.6 43.8 47.6C45.8 47.6 47.6 49.4 48.2 52.6C46.6 52 41 52 39.4 52.6Z'
    const x0 = 29, y0 = 4, x1 = 43.8, y1 = 45.4, len = Math.hypot(x1 - x0, y1 - y0), a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
    const links = Array.from({ length: Math.floor(len / 4) + 1 }, (_, i) => {
      const t = Math.min(1, (i * 4) / len), x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">` + (i % 2
        ? `<rect x="-3.2" y="-.85" width="6.4" height="1.7" rx=".85" fill="${IRON_L}" stroke="${P.ink}" stroke-width=".55"/>`
        : `<path d="${ellipse(0, 0, 3.4, 2.1)} ${ellipse(0, 0, 2, 0.85)}" fill-rule="evenodd" fill="${IRON}" stroke="${P.ink}" stroke-width=".55"/><path d="M-2.4 -1.3A3 1.6 0 0 1 1.4 -1.6" fill="none" stroke="${IRON_L}" stroke-width=".45"/>`) + `</g>`
    }).join('')
    const dust = (x: number, y: number, s: number) =>
      [[0, 0, 1], [-0.95, 0.35, 0.72], [0.9, 0.4, 0.78], [0.15, -0.75, 0.66], [-0.5, -0.5, 0.5]].map(([dx, dy, r]) =>
        k.shade(ellipse(f(x + dx * s * 6), f(y + dy * s * 6), f(r * s * 5.4), f(r * s * 5.4)), k.rad(P.white, 0.42, 0.4, 0.58, 0.95, 0), J_L, 0.85)).join('')
    const chips = [[60, 58, 30], [64, 76, -20], [57, 82, 60], [68, 62, 10], [62, 66, -50]].map(([x, y, r]) => `<path d="M-1.2 -.5H1.2L.8 .6H-1Z" transform="translate(${x} ${y}) rotate(${r})" fill="${WOOD_D}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    return (
      field(k) +
      k.sun(66, 60, 14, 46, 32, false) +
      glow(k, 66, 62, 24, 24, 0.5) +
      k.floor(77, 91, 17, 2.6) + k.floor(46, 92, 12, 2) +
      T.svg +
      dust(64, 70, 1.1) + dust(80, 56, 0.8) +
      loose(k, 84, 50, 26, 0.7, true, 1) + loose(k, 70, 44, -24, 0.66, false, 2) + loose(k, 90, 38, 64, 0.56, true, 4) + loose(k, 76, 30, 10, 0.5, true, 6) +
      chips +
      hair(21, 60, 25, 64, 26, 70, 0.7, J_D) + hair(20, 69, 23.6, 73, 24, 79, 0.6, J_D) + hair(24, 52, 27, 56, 28.6, 61, 0.5, J_D) +
      links +
      k.cast([ball], 2, 2, J_D) +
      k.draw([
        { d: cap, fill: IRON, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.8, IRON_D, 0.45) },
        { d: ball, fill: IRON, inner: k.sh(ball, 0, 0, 1, 1, 0.1, 0.95, IRON_D, 0.55) + `<path d="${ellipse(38.8, 60, 6.4, 5.4)}" fill="${k.rad(IRON_L, 0.5, 0.5, 0.5, 0.9, 0)}"/>` + hair(31.6, 74, 35.6, 79, 43, 80, 0.5, IRON_L, 0.7) + hair(52, 58, 55.6, 63, 56.4, 69, 0.45, J_L, 0.8) },
      ], 0.75) +
      `<path d="M29.2 65C34.6 67 52.4 67 57.8 65" fill="none" stroke="${IRON_D}" stroke-width=".9"/><path d="M29.2 64.2C34.6 66.2 52.4 66.2 57.8 64.2" fill="none" stroke="${IRON_L}" stroke-width=".4"/>` +
      [32.6, 38.4, 44, 49.6, 55].map((x) => `<circle cx="${x}" cy="${f(65.2 + (1 - ((x - 44) / 14) ** 2) * 0.8)}" r=".55" fill="${IRON_L}" stroke="${IRON_D}" stroke-width=".2"/>`).join('') +
      `<ellipse cx="37.4" cy="58" rx="2.4" ry="1.4" fill="#fff" opacity=".75" transform="rotate(-40 37.4 58)"/>` +
      `<path d="${ellipse(43.8, 46, 2.4, 2.6)} ${ellipse(43.8, 46, 1.1, 1.3)}" fill-rule="evenodd" fill="${IRON}" stroke="${P.ink}" stroke-width=".5"/>` +
      sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Quince derrumbes: contra la luna naranja, el puño del gorila se aferra al mástil de la torre; el avioncito da vueltas.
  'King Kong': (u) => {
    const k = kit(u)
    const B = 13, cx = 48, T = tower(k, cx, 99, B, 10, { holes: [[2, 1], [5, 0], [7, 2]], h: 2.6 })
    const cy = 99 - B / 2 - T.H
    const S = tower(k, cx, cy + 3, 6, 13, { h: 2.4, from: 10, w: 0.6, holes: [[3, 1], [9, 0]] })
    const needle = cy - 31.2
    const moon = ellipse(68, 42, 24, 24)
    const craters = [[56, 30, 3.4], [80, 28, 2.4], [84, 54, 3], [64, 60, 2], [74, 34, 1.5]].map(([x, y, r]) => k.shade(ellipse(x, y, r, r), k.rad(J_D, 0.6, 0.6, 0.6, 0.9, 0.2), J, 0.35)).join('')
    // El puño: cuatro dedos de cuero cruzan el mástil por delante y doblan en la falange; el pulgar los cruza en diagonal.
    const finger = (yc: number, x0: number, x1: number, th: number) => {
      const a = th / 2
      const d = `M${x1} ${f(yc - a)}C${f(x1 - 5)} ${f(yc - a - 0.6)} ${f(x0 + 4)} ${f(yc - a - 0.2)} ${f(x0 + 1.6)} ${f(yc - a + 0.2)}C${f(x0 - 0.8)} ${f(yc - a + 0.8)} ${f(x0 - 0.8)} ${f(yc + a - 0.4)} ${f(x0 + 1.4)} ${f(yc + a)}C${f(x0 + 4)} ${f(yc + a + 0.5)} ${f(x1 - 5)} ${f(yc + a + 0.4)} ${x1} ${f(yc + a)}Z`
      return {
        d, fill: SKIN,
        inner: k.sh(d, 0, 0, 0, 1, 0, 0.95, '#18161C', 0.55) + `<path d="M${f(x0 + 2)} ${f(yc - a + 1)}C${f(x0 + 6)} ${f(yc - a + 0.4)} ${f(x1 - 6)} ${f(yc - a + 0.4)} ${f(x1 - 1)} ${f(yc - a + 0.8)}" fill="none" stroke="${SKIN_L}" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` +
          hair(x0 + 2.6, yc - a + 0.9, x0 + 1.8, yc, x0 + 2.6, yc + a - 0.9, 0.5, '#1C1A20') + hair(x0 + 3.8, yc - a + 1.2, x0 + 3.2, yc, x0 + 3.8, yc + a - 1.1, 0.4, '#1C1A20') +
          hair(x0 + 7.4, yc - a + 1.3, x0 + 7, yc, x0 + 7.4, yc + a - 1.2, 0.35, '#1C1A20') + hair(x1 - 3, yc - a + 1, x1 - 3.6, yc, x1 - 3, yc + a - 1, 0.4, '#1C1A20'),
      }
    }
    const fingers = [finger(42.8, 42.4, 63, 5), finger(48, 41.4, 64, 5.4), finger(53.2, 41.8, 64, 5.2), finger(58, 43, 63, 4.6)]
    const thumb = 'M66 38.6C62 38 56 39.6 50.4 43.4C48.6 44.6 48.8 47.2 50.8 47.4C53 47.6 57 45.4 62 44.8C65 44.4 67.4 43 67.6 41Z'
    const nail = 'M50 44.4C51.2 43.6 52.6 43.4 53.2 44.2C53.6 45.2 52.6 46.2 51.2 46.4C50.2 46.4 49.6 45.4 50 44.4Z'
    // El antebrazo peludo entra por la derecha, con mechones peinados hacia la mano.
    const arm = 'M61.6 37.4C64 34.6 68 33 72 31.6C80 28.6 90 24.8 106 20V54C96 54.6 86 56.6 78 58.4C72 60 66 61.6 61 61.4C60 54 60 44 61.6 37.4Z'
    const lock = (x: number, y: number, L: number, w: number, ox: number, oy: number, c: string) =>
      `<path d="${taper(f(x), f(y), f(x - L * 0.45 + ox * 0.6), f(y + L * 0.12 + oy * 0.6), f(x - L * 0.92 + ox * 1.6), f(y + L * 0.3 + oy * 1.6), w, 0.2)}" fill="${c}"/>`
    const edge = (line: number[][], ox: number, oy: number) => {
      let out = ''
      for (let i = 0; i < line.length - 1; i++) {
        const [x0, y0] = line[i], [x1, y1] = line[i + 1], n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 2.1)
        for (let j = 0; j < n; j++) {
          const t = j / n, r = rnd(i * 31 + j + oy * 7)
          out += lock(x0 + (x1 - x0) * (t + (r - 0.5) * 0.3 / n) - ox, y0 + (y1 - y0) * t - oy * (0.6 + r), 3.6 + r * 5, 1.6 + rnd(j * 3 + i) * 1.2, ox * (0.5 + r), oy * (0.4 + r * 1.2), j % 3 ? FUR : '#3A3540')
        }
      }
      return out
    }
    const shag = edge([[100, 22], [90, 25.2], [80, 28.6], [72, 31.6], [66, 34]], 0, -1) + edge([[100, 54.2], [90, 55.6], [80, 57.8], [72, 59.8], [64, 61.4]], 0, 1)
    const strands = Array.from({ length: 64 }, (_, i) => {
      const x = 64 + rnd(i * 3.1) * 36, y0 = 35 - (x - 64) * 0.36, y = y0 + 4 + rnd(i * 7.7) * (24 - (x - 64) * 0.1)
      return hair(x + 3.4, y - 1, x + 0.6, y + 0.2 + rnd(i) * 0.6, x - 2.8, y + 1.2, 0.5, i % 4 ? FUR_L : '#A39CB0', 0.8)
    }).join('')
    const rim = hair(64, 35.6, 74, 30.4, 88, 25.6, 0.9, J_L, 0.9) + hair(90, 24.6, 96, 22.6, 102, 21, 0.8, J_L, 0.8)
    // El biplano, de perfil: alas naranjas, fuselaje crema y la hélice que gira.
    const plane = (x: number, y: number) => {
      const body = 'M-8.6 -1.6L-6 -.8C-2 -1.6 3 -1.8 6.4 -1.2C7.6 -.8 7.6 1 6.4 1.4C3 2 -2 1.8 -6 .8L-8.6 .2Z'
      const fin = 'M-8.6 -1.6L-9.4 -4.6H-7.8L-5.6 -1Z'
      return `<g transform="translate(${x} ${y}) rotate(-14) scale(.95)">` +
        `<path d="M-1 -3.2L-.6 .6M3 -3.2L2.6 .6M.6 1.4L.2 3.4M2.6 1.4L3.2 3.4" stroke="${P.ink}" stroke-width=".4"/>` +
        k.draw([
          { d: fin, fill: J },
          { d: roundRect(-2.8, -4, 4.6, -3, 0.5), fill: J, inner: `<path d="M-2.4 -3.7H4.2" stroke="${J_L}" stroke-width=".35"/>` },
          { d: body, fill: P.white, inner: k.sh(body, 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) + `<path d="M-5.4 -.2H5.6" stroke="${J}" stroke-width=".5"/>` },
          { d: roundRect(-2.4, 0.6, 4.8, 1.5, 0.45), fill: J },
        ], 0.38) +
        `<circle cx="1" cy="-1.5" r=".6" fill="${P.night}"/><circle cx=".2" cy="3.6" r=".8" fill="${P.ink}"/><circle cx="3.2" cy="3.6" r=".8" fill="${P.ink}"/>` +
        `<ellipse cx="7.8" cy=".1" rx=".5" ry="3.4" fill="${P.paper}" opacity=".7"/>` +
        `</g>`
    }
    return (
      dusk(k, 0.4) +
      [[30, 30, 0.6], [26, 84, 0.5], [44, 24, 0.45], [90, 78, 0.5], [94, 88, 0.4], [80, 82, 0.35]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.paper}"/>`).join('') +
      glow(k, 68, 42, 34, 34, 0.45, J) +
      `<path d="${moon}" fill="${J_L}"/>` + k.shade(moon, k.rad(J_D, 0.36, 0.34, 0.75, 0, 0.8), J, 0.35) + k.clip(moon, craters) +
      `<path d="M27 47C25 53 29 59 35 59C41 59 43 53 40 50" fill="none" stroke="${P.paper}" stroke-width=".5" stroke-dasharray="1.4 1.4" opacity=".75"/>` +
      plane(33.4, 45) +
      k.floor(cx, 97, 15, 2.4, '#000') +
      T.svg + S.svg +
      `<path d="M${cx} ${f(needle + 0.6)}V${f(needle - 8)}" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/><path d="M${cx} ${f(needle + 0.4)}V${f(needle - 7.6)}" stroke="${P.white}" stroke-width=".4"/><circle cx="${cx}" cy="${f(needle - 8.4)}" r=".8" fill="${P.red}"/>` +
      k.draw(fingers, 0.65) +
      k.draw([{ d: arm, fill: FUR, inner: k.sh(arm, 0, 0, 0, 1, 0, 0.8, '#000', 0.45) + strands + rim }], 0.8) + shag +
      k.draw([{ d: thumb, fill: SKIN, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.9, '#18161C', 0.5) + `<path d="M64 39.6C60 39.6 55 41.4 51.6 44" fill="none" stroke="${SKIN_L}" stroke-width=".9" stroke-linecap="round" opacity=".85"/>` + hair(57, 41.4, 56.6, 43.4, 57.4, 45.6, 0.45, '#1C1A20') + hair(58.6, 41, 58.2, 43, 59, 45, 0.35, '#1C1A20') }], 0.6) +
      `<path d="${nail}" fill="#A99EA8" stroke="#1C1A20" stroke-width=".3"/>` +
      loose(k, 31, 70, 28, 0.6, true, 3) + loose(k, 72, 74, -40, 0.55, false, 8) + loose(k, 34, 84, 60, 0.45, true, 5) +
      hair(30, 64, 31.6, 61, 35, 59.4, 0.5, J_L) + hair(68, 66, 69.6, 63, 67.6, 61, 0.45, J_L) +
      hair(36, 36, 37, 34, 39, 33, 0.45, J_L) + hair(60, 30, 61, 28, 63, 27.4, 0.45, J_L) +
      k.defs()
    )
  },
}

