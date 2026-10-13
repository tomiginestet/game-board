// Azul: Mosaiquista, Paleta completa y Manos de manteca.
// El color propio del juego es el cobalto de su ficha (#1971C2): el grano del fondo (una pared de azulejos con sus
// juntas), los esmaltes pintados a mano, el vidrio del rosetón. Los azulejos tienen oficio de ceramista: bizcocho,
// esmalte con brillo y su guarda pintada; el vitral lleva sus plomos y su piedra. Sin personas: el ayudante aparece por
// su cuchara y su balde, el elefante por su trompa.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'

// El cobalto de la ficha de Azul, con su sombra y su luz; el celeste cobalto del fondo.
const COB = '#1971C2', COB_D = '#0D4A86', COB_L = '#86B4E6'
const FONDO = '#A9C7EC', FONDO_G = '#86ACDF'
// Los otros esmaltes del juego: turquesa, naranja, violeta y el negro de la ficha.
const TURQ = '#2FA3B0', TURQ_D = '#1C6F7A'
const NAR = '#E8823A'
const VIOL = '#6E5CB0'
const NEGRO = '#262A36'
// Bizcocho (la arcilla cocida), pastina, piedra arenisca y la piel gris del elefante.
const BIZ = '#E7C9A4'
const PASTINA = '#DAD5CB', PASTINA_D = '#A8A196'
const PIEDRA = '#E9DEC6', PIEDRA_D = '#B9A47E'
const ELEF = '#A3A6AE', ELEF_D = '#6C6F7A', ELEF_L = '#C9CBD1'
const VIDRIO_N = '#141B33'

/** Fondo del juego: el papel con el cobalto claro granulado hacia los bordes y las juntas de una pared de azulejos. */
const pared = (k: Kit) => {
  let grid = ''
  for (let i = 0; i <= 10; i++) grid += `M${f(i * 12 - 0.4)} 0V130M0 ${f(i * 12 + 4.6)}H120`
  return `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad(FONDO, 0.5, 0.46, 0.7, 0, 1), FONDO_G, 0.5) +
    `<path d="${grid}" stroke="#fff" stroke-width=".6" opacity=".5"/>`
}

/** Taller: un disco celeste cobalto con el borde granulado (el escenario del juego). */
const taller = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#EEF3FA"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(FONDO, 0.5, 0.5, 0.5, 0, 0.8), FONDO_G, 0.45) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${COB}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Varilla entintada: la tinta gruesa y el color encima, con un brillo opcional. */
const rod = (d: string, c: string, w: number, hi?: string) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w + 1.3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (hi ? `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" transform="translate(-.35 -.35)"/>` : '')

/** Pétalo en punta, con la base en (0,0) y la punta hacia arriba. */
const petal = (L: number, W: number) => `M0 0C${f(-W)} ${f(-L * 0.3)} ${f(-W * 0.8)} ${f(-L * 0.8)} 0 ${f(-L)}C${f(W * 0.8)} ${f(-L * 0.8)} ${f(W)} ${f(-L * 0.3)} 0 0Z`

/** Pintura de un azulejo de lado `s` centrado en (0,0): flor de ocho pétalos al medio, cuartos de roseta en las
 * esquinas (que se juntan con los vecinos), medias lunas en los bordes y hojitas en diagonal. Cobalto en dos manos. */
function motif(s: number, c = COB, cl = COB_L) {
  const h = s / 2
  const flower = Array.from({ length: 8 }, (_, i) => `<path d="${petal(s * 0.3, s * 0.085)}" transform="rotate(${i * 45})" fill="${i % 2 ? cl : c}"/>`).join('')
  const corner = (sx: number, sy: number) =>
    `<g transform="translate(${f(sx * h)} ${f(sy * h)}) scale(${sx} ${sy})">` +
    `<path d="M0 0H${f(-s * 0.27)}A${f(s * 0.27)} ${f(s * 0.27)} 0 0 1 0 ${f(-s * 0.27)}Z" fill="${c}"/>` +
    [200, 225, 250].map((a) => `<path d="${petal(s * 0.2, s * 0.05)}" transform="rotate(${a - 270})" fill="${P.white}" opacity=".9"/>`).join('') +
    `<path d="M0 0H${f(-s * 0.07)}A${f(s * 0.07)} ${f(s * 0.07)} 0 0 1 0 ${f(-s * 0.07)}Z" fill="${P.gold}"/></g>`
  const half = (x: number, y: number, r: number) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * 0.075)}" fill="${cl}" transform="rotate(${r} ${f(x)} ${f(y)})"/>`
  const leaf = (a: number) => `<path d="${petal(s * 0.13, s * 0.05)}" transform="rotate(${a}) translate(0 ${f(-s * 0.3)})" fill="${cl}"/>`
  return (
    `<path d="${roundRect(-h + s * 0.06, -h + s * 0.06, h - s * 0.06, h - s * 0.06, s * 0.03)}" fill="none" stroke="${cl}" stroke-width="${f(s * 0.025)}"/>` +
    corner(-1, -1) + corner(1, -1) + corner(-1, 1) + corner(1, 1) +
    half(0, -h, 0) + half(0, h, 0) + half(-h, 0, 0) + half(h, 0, 0) +
    [45, 135, 225, 315].map(leaf).join('') +
    `<circle r="${f(s * 0.2)}" fill="none" stroke="${c}" stroke-width="${f(s * 0.02)}"/>` + flower +
    `<circle r="${f(s * 0.07)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${f(s * 0.015)}"/><circle r="${f(s * 0.025)}" fill="${COB_D}"/>`
  )
}

/** Azulejo esmaltado de lado `s` centrado en (0,0): canto de bizcocho, esmalte blanco con el motivo, el esmalte que se
 * junta en el borde y el brillo en diagonal. */
function tile(k: Kit, s: number, o: { crackle?: boolean; w?: number } = {}) {
  const h = s / 2, d = roundRect(-h, -h, h, h, s * 0.05)
  return (
    k.draw([{
      d, fill: P.white,
      inner:
        motif(s) + k.sh(d, 0, 0, 1, 1, 0, 0.55, P.sky2, 0.35) +
        `<path d="M${f(-h)} ${f(-h * 0.2)}L${f(-h * 0.2)} ${f(-h)}H${f(h * 0.25)}L${f(-h)} ${f(h * 0.25)}Z" fill="#fff" opacity=".35"/>` +
        `<path d="${roundRect(-h + 0.3, -h + 0.3, h - 0.3, h - 0.3, s * 0.05)}" fill="none" stroke="${P.sky2}" stroke-width="${f(s * 0.02)}" opacity=".9"/>` +
        (o.crackle ? hair(-h * 0.7, h * 0.3, -h * 0.3, h * 0.1, 0, h * 0.5, 0.25, P.sky2, 0.8) + hair(h * 0.2, -h * 0.8, h * 0.4, -h * 0.4, h * 0.8, -h * 0.3, 0.25, P.sky2, 0.8) : ''),
    }], o.w ?? 0.55) +
    `<path d="M${f(-h * 0.8)} ${f(-h * 0.45)}C${f(-h * 0.7)} ${f(-h * 0.7)} ${f(-h * 0.5)} ${f(-h * 0.8)} ${f(-h * 0.3)} ${f(-h * 0.82)}" fill="none" stroke="#fff" stroke-width="${f(s * 0.04)}" stroke-linecap="round" opacity=".9"/>`
  )
}

/** Guarda griega (meandro) entre los radios r1 y r2 alrededor de (cx,cy), con `n` ganchos. */
function meander(cx: number, cy: number, r1: number, r2: number, n: number) {
  const pt = (u: number, v: number) => {
    const a = (u / n) * Math.PI * 2 - Math.PI / 2, r = r1 + v * (r2 - r1)
    return `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
  }
  let d = ''
  for (let i = 0; i < n; i++) {
    const seg = [[0, 0.06], [0, 0.94], [0.35, 0.94], [0.7, 0.94], [0.7, 0.36], [0.35, 0.36], [0.35, 0.66]]
    d += 'M' + seg.map(([u, v]) => pt(i + u, v)).join('L')
  }
  const ring = (r: number) => `M${f(cx - r)} ${cy}A${r} ${r} 0 1 0 ${f(cx + r)} ${cy}A${r} ${r} 0 1 0 ${f(cx - r)} ${cy}`
  return { keys: d, inner: ring(r1 - 0.3), outer: ring(r2 + 0.3) }
}

/** Plato de loza pintada (blanco y cobalto) de radio R centrado en (cx,cy): ala con guarda, fondo con una flor. */
function plateArt(k: Kit, cx: number, cy: number, R: number, greek: boolean) {
  const mk = meander(cx, cy, R * 0.74, R * 0.9, greek ? 22 : 18)
  const flower = Array.from({ length: 8 }, (_, i) => `<path d="${petal(R * 0.34, R * 0.1)}" transform="translate(${cx} ${cy}) rotate(${i * 45 + 22.5})" fill="${i % 2 ? COB_L : COB}"/>`).join('')
  const scallop = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * R * 0.58)}" cy="${f(cy + Math.sin(a) * R * 0.58)}" r="${f(R * 0.05)}" fill="${COB_L}"/>` }).join('')
  return (
    k.sh(ellipse(cx, cy, R, R), 0, 0, 1, 1, 0, 0.55, P.sky2, 0.35) +
    (greek
      ? `<path d="${mk.keys}" fill="none" stroke="${COB}" stroke-width="${f(R * 0.035)}" stroke-linejoin="miter"/><path d="${mk.inner}${mk.outer}" fill="none" stroke="${COB}" stroke-width="${f(R * 0.03)}"/>`
      : `<path d="${mk.inner}${mk.outer}" fill="none" stroke="${COB}" stroke-width="${f(R * 0.03)}"/>` + Array.from({ length: 18 }, (_, i) => `<path d="${petal(R * 0.13, R * 0.05)}" transform="translate(${cx} ${cy}) rotate(${i * 20}) translate(0 ${f(-R * 0.75)})" fill="${COB}"/>`).join('')) +
    `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.66)}" fill="none" stroke="${P.sky2}" stroke-width="${f(R * 0.03)}"/>` +
    scallop + flower + `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.11)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${f(R * 0.02)}"/>` +
    `<path d="M${f(cx - R * 0.78)} ${f(cy - R * 0.2)}C${f(cx - R * 0.7)} ${f(cy - R * 0.55)} ${f(cx - R * 0.45)} ${f(cy - R * 0.75)} ${f(cx - R * 0.15)} ${f(cy - R * 0.82)}" fill="none" stroke="#fff" stroke-width="${f(R * 0.06)}" stroke-linecap="round" opacity=".85"/>`
  )
}

/** Grietas de un plato: `n` líneas quebradas desde el golpe (cx,cy) hasta más allá del borde. */
function cracks(cx: number, cy: number, R: number, angles: number[], seed: number) {
  return angles.map((a0, i) => {
    const pts: [number, number][] = [[cx, cy]]
    for (let j = 1; j <= 4; j++) {
      const r = (R * 1.15 * j) / 4, jit = (j % 2 ? 1 : -1) * (0.08 + 0.06 * Math.sin(seed + i * 7.3 + j * 3.1)) / Math.max(1, j * 0.6)
      pts.push([cx + Math.cos(a0 + jit) * r, cy + Math.sin(a0 + jit) * r])
    }
    return pts
  })
}

/** Trozo de plato: el polígono entre dos grietas, cerrado por fuera del borde. */
function shard(cs: [number, number][][], i: number) {
  const a = cs[i], b = cs[(i + 1) % cs.length]
  return `M${a.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}L${[...b].reverse().map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`
}

/** Crayón parado con la base en (0,0) y la punta gastada arriba: cera de color, papel con fajas y etiqueta. */
function crayon(k: Kit, c: string, dk: string, len = 30) {
  const top = -len
  const body = `M-3.2 0V${f(top + 6)}C-3.2 ${f(top + 5)} -2.4 ${f(top + 4.4)} -1.6 ${f(top + 3.8)}L-.6 ${f(top + 0.6)}C-.3 ${f(top - 0.2)} .3 ${f(top - 0.2)} .6 ${f(top + 0.6)}L1.6 ${f(top + 3.8)}C2.4 ${f(top + 4.4)} 3.2 ${f(top + 5)} 3.2 ${f(top + 6)}V0Z`
  const wrap = `M-3.5 -2V${f(top + 8)}H3.5V-2Z`
  return (
    k.draw([
      { d: body, fill: c, inner: k.sh(body, 0, 0, 1, 0, 0, 0.9, dk, 0.45) + `<path d="M-2.4 ${f(top + 6)}L-1 ${f(top + 1.4)}" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".7"/>` },
      {
        d: wrap, fill: c,
        inner: k.sh(wrap, 0, 0, 1, 0, 0, 0.9, dk, 0.5) + `<path d="M-4 -4.6H4V-3.6H-4ZM-4 ${f(top + 10)}H4V${f(top + 11)}H-4Z" fill="${dk}"/>` +
          `<path d="M-4 ${f(top / 2 - 3)}H4V${f(top / 2 + 3)}H-4Z" fill="${P.white}"/><path d="M-3.5 ${f(top / 2)}l1.2 -1.6l1.2 1.6l1.2 -1.6l1.2 1.6l1.2 -1.6" fill="none" stroke="${c}" stroke-width=".5"/>` +
          `<path d="M-2.2 -2V${f(top + 8)}" stroke="#fff" stroke-width=".7" opacity=".5"/>`,
      },
    ], 0.5)
  )
}

/** Vasija de loza azul y blanca con el cuello angosto, la base en (0,0): cuerpo, cuello, labio y la pintura. */
function vase(k: Kit) {
  const body = 'M-5 0C-6 -2 -11 -6 -11.4 -14C-11.8 -22 -6 -27 -4 -30C-3.6 -31 -3.8 -33.6 -4.4 -35.4H4.4C3.8 -33.6 3.6 -31 4 -30C6 -27 11.8 -22 11.4 -14C11 -6 6 -2 5 0Z'
  const lip = 'M-5.8 -35C-5.8 -36.6 -3 -37.2 0 -37.2C3 -37.2 5.8 -36.6 5.8 -35C5.8 -33.8 3 -33.4 0 -33.4C-3 -33.4 -5.8 -33.8 -5.8 -35Z'
  const paint =
    `<path d="M-12 -24C-6 -22 6 -22 12 -24V-21.6C6 -19.6 -6 -19.6 -12 -21.6Z" fill="${COB}"/>` +
    `<path d="M-12 -6.6C-6 -4.8 6 -4.8 12 -6.6V-4.8C6 -3 -6 -3 -12 -4.8Z" fill="${COB}"/>` +
    Array.from({ length: 6 }, (_, i) => `<path d="${petal(6.6, 2)}" transform="translate(${-7.5 + i * 3} -7) rotate(${(i - 2.5) * 6})" fill="${i % 2 ? COB_L : COB}"/>`).join('') +
    `<circle cx="0" cy="-15" r="3.4" fill="none" stroke="${COB}" stroke-width=".8"/>` + Array.from({ length: 6 }, (_, i) => `<path d="${petal(3, 1)}" transform="translate(0 -15) rotate(${i * 60})" fill="${COB}"/>`).join('') +
    `<path d="M-6 -15C-6 -18 -8 -19 -9 -17M6 -15C6 -18 8 -19 9 -17" fill="none" stroke="${COB}" stroke-width=".6"/>` +
    `<path d="M-4 -30H4M-4.2 -28.2H4.2" stroke="${COB}" stroke-width=".5"/>`
  return (
    k.draw([
      { d: body, fill: P.white, inner: paint + k.sh(body, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + `<path d="M-12 -30H-6V0H-12Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` },
      { d: lip, fill: P.white, inner: `<path d="${ellipse(0, -35.2, 4.2, 1.1)}" fill="${COB_D}"/>` + k.sh(lip, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) },
    ], 0.65) +
    `<path d="M-8.4 -20C-8.8 -15 -8 -10 -6.4 -6.6" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>`
  )
}

export const AZUL_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Mosaiquista ────────────────────────────────────────────────────

  // Sesenta puntos: ya sabés mezclar la pastina. El balde de zinc con la cuchara clavada, como una espada en la piedra.
  'Ayudante de obra': (u) => {
    const k = kit(u)
    const body = 'M43.4 57L47.6 87.4C52 90.6 72 90.6 76.4 87.4L80.6 57Z'
    const rim = ellipse(62, 57, 18.6, 4.6)
    const paste = ellipse(62, 57.4, 16.4, 3.4)
    const drip = (x: number, h: number) => `M${x - 1.6} 60.6C${x - 1.6} ${f(61 + h)} ${x - 0.6} ${f(62.4 + h)} ${x} ${f(62.4 + h)}C${x + 0.6} ${f(62.4 + h)} ${x + 1.4} ${f(61 + h)} ${x + 1.4} 60.6Z`
    const blade = 'M-7.6 -12.6C-7.6 -13.6 -6.8 -14.2 -5.8 -14.2H5.8C6.8 -14.2 7.6 -13.6 7.6 -12.6L3.4 0H-3.4Z'
    const handle = roundRect(0.4, -32.4, 5.2, -18.4, 2.4)
    return (
      pared(k) +
      taller(k, 60, 60, 33) +
      k.floor(62, 89, 22, 3, COB_D) +
      rod('M44.6 59C43 38 81 38 79.4 59', P.sky2, 0.9, '#fff') +
      k.draw([{
        d: body, fill: '#D5DCE6',
        inner:
          k.sh(body, 0, 0, 1, 0, 0.05, 0.95, P.mid, 0.5) + `<path d="M42 56H52V90H42Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
          `<path d="M45 67C52 70 72 70 79.2 67M46.4 79C53 82 71 82 77.6 79" fill="none" stroke="${P.mid}" stroke-width="1"/><path d="M45 66.2C52 69.2 72 69.2 79.2 66.2M46.4 78.2C53 81.2 71 81.2 77.6 78.2" fill="none" stroke="#fff" stroke-width=".55"/>` +
          hair(56, 72, 58, 74, 57, 76, 0.35, P.blue) + hair(68, 84, 70, 85, 71, 87, 0.35, P.blue) + hair(50, 84, 52, 85.6, 51, 87.4, 0.3, P.blue),
      }], 0.75) +
      k.draw([{ d: rim, fill: P.sky1, inner: `<path d="${paste}" fill="${PASTINA}"/>` + k.sh(paste, 0, 0, 1, 1, 0, 0.8, PASTINA_D, 0.45) + hair(50, 57.4, 56, 56, 62, 57.6, 0.5, '#fff') + hair(64, 58.4, 70, 57, 75, 58.2, 0.45, PASTINA_D) }], 0.6) +
      `<path d="${drip(50, 2.6)}${drip(73, 4)}" fill="${PASTINA}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<circle cx="44" cy="59" r="1.1" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/><circle cx="80" cy="59" r="1.1" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/>` +
      // La cuchara de albañil, clavada en la pastina.
      `<g transform="translate(63 57.6) rotate(17)">` +
      k.draw([
        { d: blade, fill: P.sky1, inner: k.sh(blade, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + `<path d="M-6.4 -13L-3 -.6" stroke="#fff" stroke-width=".8" stroke-linecap="round"/><path d="M0 -13.6V-.4" stroke="${P.blue}" stroke-width=".5"/><path d="M-3.6 -4.6C-1 -5.6 2 -4.8 4.6 -5.6L3.4 0H-3.4Z" fill="${PASTINA}"/>` + hair(-2, -2.4, 0, -3, 2.6, -2.2, 0.4, PASTINA_D) },
        { d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(1.8, -31, 1.6, -26, 2, -21, 0.4, P.brownD) + hair(3.8, -30.4, 4.1, -26, 3.8, -21, 0.35, P.brownD) + `<path d="M1.2 -31.4V-21" stroke="${P.goldL}" stroke-width=".6" opacity=".7"/>` },
      ], 0.7) +
      rod('M0 -14.2V-16.4L2.8 -18.8', P.sky2, 1.3, '#fff') +
      `<path d="M0 -20.6H5.6V-18H0Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M.4 -19.3H5.2" stroke="${P.goldD}" stroke-width=".35"/>` +
      `</g>` +
      // El azulejo apoyado contra el balde.
      `<g transform="translate(37.4 77.6) rotate(-13)">` + k.cast([roundRect(-10, -10, 10, 10, 1)], 1.6, 1.8, COB_D) + tile(k, 20) + `</g>` +
      [[54, 93, 0.9], [72, 92.6, 0.7], [81, 90, 0.6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${f(r * 1.6)}" ry="${r}" fill="${PASTINA}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(84, 36, 2.2) + sparkle(36, 46, 1.6) +
      k.defs()
    )
  },

  // Ochenta puntos: dejás las juntas derechitas. Cuatro azulejos que arman una roseta y el nivel con la burbuja al medio.
  'Azulejero fino': (u) => {
    const k = kit(u)
    const s = 19, g = 1.2, x0 = 60 - s - g / 2, y0 = 66 - s - g / 2
    const grout = `M${f(x0 - 1)} ${f(y0 - 1)}H${f(x0 + 2 * s + g + 1)}V${f(y0 + 2 * s + g + 1)}H${f(x0 - 1)}Z`
    const tiles = [0, 1].flatMap((i) => [0, 1].map((j) => `<g transform="translate(${f(x0 + s / 2 + i * (s + g))} ${f(y0 + s / 2 + j * (s + g))})">${tile(k, s, { crackle: (i + j) % 2 === 1, w: 0.4 })}</g>`)).join('')
    const level = 'M27.4 41.6C27.4 40.4 28.2 39.6 29.4 39.6H90.6C91.8 39.6 92.6 40.4 92.6 41.6V46.6H27.4Z'
    const vial = roundRect(52, 40.6, 68, 45, 2.2)
    const ticks = Array.from({ length: 21 }, (_, i) => { const x = 32 + i * 2.8; return x > 50 && x < 70 ? '' : `M${f(x)} 46.6V${i % 5 ? 45.6 : 44.8}` }).join('')
    return (
      pared(k) +
      taller(k, 60, 62, 33) +
      k.cast([grout], 2.4, 2.4, COB_D) +
      k.draw([{ d: grout, fill: PASTINA, inner: k.sh(grout, 0, 0, 1, 1, 0, 0.7, PASTINA_D, 0.4) }], 0.6) +
      tiles +
      `<path d="M${f(x0 + s + g / 2)} ${f(y0 - 0.6)}V${f(y0 + 2 * s + g + 0.6)}M${f(x0 - 0.6)} ${f(y0 + s + g / 2)}H${f(x0 + 2 * s + g + 0.6)}" stroke="#fff" stroke-width=".35" opacity=".8"/>` +
      // El nivel de burbuja apoyado arriba, con la burbuja justo entre las marcas.
      k.floor(60, 47.4, 30, 1.2, COB_D) +
      k.draw([
        {
          d: level, fill: P.gold,
          inner: k.sh(level, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M27 40.6H93" stroke="#fff" stroke-width=".7" opacity=".8"/>` +
            `<path d="M27.4 39.6H32.4V46.6H27.4ZM87.6 39.6H92.6V46.6H87.6Z" fill="${NEGRO}"/><path d="${ticks}" stroke="${P.ink}" stroke-width=".35"/>`,
        },
      ], 0.65) +
      `<path d="${roundRect(50.6, 39.6, 69.4, 46, 1)}" fill="${NEGRO}"/>` +
      `<path d="${vial}" fill="#CFE38A" stroke="${P.ink}" stroke-width=".45"/>` + k.clip(vial, k.sh(vial, 0, 0, 0, 1, 0, 0.8, P.greenD, 0.4)) +
      `<ellipse cx="60" cy="42.2" rx="2.6" ry="1.1" fill="#fff" stroke="${P.greenD}" stroke-width=".3"/><path d="M56.6 40.6V45M63.4 40.6V45" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="M53 41.4H67" stroke="#fff" stroke-width=".4" opacity=".8"/>` +
      `<circle cx="38" cy="43.1" r="1.9" fill="#CFE38A" stroke="${P.ink}" stroke-width=".4"/><circle cx="38" cy="43.1" r=".7" fill="#fff"/>` +
      sparkle(84, 32, 2.4) + sparkle(30, 76, 1.6) +
      k.defs()
    )
  },

  // Cien puntos: el rey de Portugal te pide la pared. La puerta nazarí, con su arco de herradura, el alfiz, las yeserías
  // y el zócalo de alicatado de estrellas.
  'Palacio de la Alhambra': (u) => {
    const k = kit(u)
    const cx = 60, cy = 58.4, ri = 13, ro = 16.2
    const at = (r: number, a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
    const A0 = Math.PI * 0.8, A1 = Math.PI * 2.2
    const jy = f(cy + Math.sin(A0) * ri), jl = f(cx + Math.cos(A0) * ri), jr = f(cx + Math.cos(A1) * ri)
    const wall = `M33 86V35.4H87V86ZM${jr} 86V${jy}A${ri} ${ri} 0 1 0 ${jl} ${jy}V86Z`
    const open = `M${jl} 86V${jy}A${ri} ${ri} 0 1 1 ${jr} ${jy}V86Z`
    const alfiz = 'M40.6 37.6H79.4V67H40.6Z'
    const sx = f(Math.sqrt(ro * ro - (67 - cy) ** 2))
    const spand = `M41.6 42H60A${ro} ${ro} 0 0 0 ${f(60 - sx)} 67H41.6ZM78.4 42H60A${ro} ${ro} 0 0 1 ${f(60 + sx)} 67H78.4Z`
    const cornice = 'M30.6 35.6H89.4L87 31.4H33Z'
    const archivolt = `M${at(ro, A0)}A${ro} ${ro} 0 1 1 ${at(ro, A1)}L${at(ri, A1)}A${ri} ${ri} 0 1 0 ${at(ri, A0)}Z`
    const vous = Array.from({ length: 17 }, (_, i) => A0 + ((i + 0.5) / 17) * (A1 - A0))
    const voussoirs = vous.map((a, i) => `M${at(ri, a - 0.046)}L${at(ro, a - 0.046)}` + (i % 2 ? '' : '')).join('')
    const dots = vous.filter((_, i) => i % 2 === 0).map((a) => `<circle cx="${f(cx + Math.cos(a) * 15.4)}" cy="${f(cy + Math.sin(a) * 15.4)}" r=".55" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".2"/>`).join('')
    const cusps = Array.from({ length: 13 }, (_, i) => {
      const a = A0 + 0.12 + ((i + 0.5) / 13) * (A1 - A0 - 0.24), x = cx + Math.cos(a) * ri, y = cy + Math.sin(a) * ri
      return `<circle cx="${f(x)}" cy="${f(y)}" r="1.25" fill="${PIEDRA}"/><path d="M${f(x - Math.cos(a + 1.3) * 1.25)} ${f(y - Math.sin(a + 1.3) * 1.25)}A1.25 1.25 0 0 0 ${f(x - Math.cos(a - 1.3) * 1.25)} ${f(y - Math.sin(a - 1.3) * 1.25)}" fill="none" stroke="${P.ink}" stroke-width=".4"/>`
    }).join('')
    // Alicatado: estrellas de ocho puntas en una grilla, de colores alternados.
    const zellige = (x0: number, x1: number) => {
      let out = ''
      const cols = [COB, P.green, P.gold, NEGRO]
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const x = x0 + 2.6 + c * 5 + (r % 2) * 2.5, y = 70.4 + r * 4.2
        if (x > x1 - 1.4) continue
        out += `<path d="${starPath(x, y, 2.4, 1.3, 8, -90 + 22.5)}" fill="${cols[(r + c) % 4]}" stroke="${P.ink}" stroke-width=".25"/><circle cx="${f(x)}" cy="${f(y)}" r=".55" fill="${P.white}"/>`
      }
      return `<path d="M${x0} 68H${x1}V86H${x0}Z" fill="${P.white}"/>` + out + `<path d="M${x0} 68.4H${x1}M${x0} 85.4H${x1}" stroke="${COB}" stroke-width=".8"/><path d="M${x0} 69.4H${x1}" stroke="${P.gold}" stroke-width=".4"/>` + k.sh(`M${x0} 68H${x1}V86H${x0}Z`, 0, 0, 1, 1, 0, 0.5, P.blue, 0.3)
    }
    const arabesque =
      hair(44, 62, 44.6, 54, 50, 49, 0.6, P.gold) + hair(76, 62, 75.4, 54, 70, 49, 0.6, P.gold) +
      `<path d="M45 47C47 44.6 50.4 44.8 50.8 47.2C51.2 49.4 48.2 50 47.6 48.2M75 47C73 44.6 69.6 44.8 69.2 47.2C68.8 49.4 71.8 50 72.4 48.2" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="M42.8 56C45 54.4 47.2 55.6 46.6 57.6M77.2 56C75 54.4 72.8 55.6 73.4 57.6" fill="none" stroke="${P.goldL}" stroke-width=".45" stroke-linecap="round"/>` +
      [[47.6, 51.6], [72.4, 51.6], [43.6, 60.4], [76.4, 60.4], [53, 45.6], [67, 45.6]].map(([x, y]) => `<path d="${starPath(x, y, 1.3, 0.55, 8)}" fill="${P.goldL}"/>`).join('')
    const kufic = Array.from({ length: 17 }, (_, i) => { const x = 42.6 + i * 2.15, h = [1.8, 1, 1.8, 1.4, 0.8][i % 5]; return `M${f(x)} 41V${f(41 - h)}${i % 3 === 0 ? `h1.1` : ''}` }).join('')
    const column = (x: number) => {
      const t = jy - 1.6
      return `<path d="M${f(x - 1.2)} ${f(t + 3.2)}H${f(x + 1.2)}V84H${f(x - 1.2)}Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(x - 0.5)} ${f(t + 3.6)}V83.6" stroke="#fff" stroke-width=".4"/><path d="M${f(x + 0.6)} ${f(t + 3.6)}V83.6" stroke="${P.sky2}" stroke-width=".5"/>` +
        `<path d="M${f(x - 2.6)} ${f(t)}H${f(x + 2.6)}L${f(x + 1.6)} ${f(t + 3.4)}H${f(x - 1.6)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${f(x - 2)} ${f(t + 1.4)}H${f(x + 2)}M${f(x - 1.8)} ${f(t + 2.4)}H${f(x + 1.8)}" stroke="${P.goldD}" stroke-width=".3"/>` +
        `<path d="M${f(x - 1.6)} ${f(t + 5.6)}H${f(x + 1.6)}" stroke="${P.gold}" stroke-width=".6"/><path d="M${f(x - 2.2)} 84H${f(x + 2.2)}V86H${f(x - 2.2)}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }
    const lamp =
      `<path d="M60 ${f(cy - ri)}V49.6" stroke="${P.ink}" stroke-width=".55" stroke-dasharray=".9 .5"/>` +
      k.shade(ellipse(60, 54, 7.4, 6.4), k.rad('#ffffff', 0.5, 0.5, 0.5, 0.95, 0), '#ffffff', 0.6) +
      `<path d="M57.4 50.6H62.6L60 49Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="M56.6 50.8H63.4L63.8 53.2C63.8 55.6 62 57.2 60 58C58 57.2 56.2 55.6 56.2 53.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="${starPath(60, 53.8, 1.6, 0.7, 8)}" fill="${P.white}"/><path d="M56.4 52.4H63.6" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<path d="M60 58V59.4" stroke="${P.ink}" stroke-width=".45"/><circle cx="60" cy="59.8" r=".65" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`
    const merlon = (x: number) => `M${f(x - 2.6)} 31.6V28.8H${f(x - 1.4)}V26.6H${f(x + 1.4)}V28.8H${f(x + 2.6)}V31.6Z`
    const masonry = [40, 45, 50, 55, 60, 65].map((y) => `M33 ${y}H40.6M79.4 ${y}H87`).join('') + [42.5, 52.5, 62.5].map((y) => `M36.8 ${y - 2.5}V${y + 2.5}M83.2 ${y - 2.5}V${y + 2.5}`).join('')
    return (
      pared(k) +
      k.sun(60, 60, 13, 46, 28, false) +
      k.shade(ellipse(60, 60, 24, 24), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.8, 0), P.goldL, 0.45) +
      k.cast([wall], 2.4, 2.4, COB_D) +
      k.draw([{ d: wall, fill: PIEDRA, inner: k.sh(wall, 0, 0, 1, 1, 0, 0.7, PIEDRA_D, 0.45) + `<path d="${masonry}" stroke="${PIEDRA_D}" stroke-width=".4"/>` }], 0.75) +
      k.draw([{ d: spand, fill: COB, inner: k.sh(spand, 0, 0, 1, 1, 0, 0.8, COB_D, 0.45) + arabesque }], 0.4) +
      `<path d="M41 37.8H79V41.8H41Z" fill="${COB_D}"/><path d="${kufic}" fill="none" stroke="${P.gold}" stroke-width=".55"/>` +
      `<path d="${alfiz}" fill="none" stroke="${P.ink}" stroke-width="1.7"/><path d="${alfiz}" fill="none" stroke="${P.gold}" stroke-width=".85"/>` +
      `<path d="M41.6 42H78.4" stroke="${P.gold}" stroke-width=".5"/>` +
      // El arco: la luz que entra, la rosca de dovelas con sus lunares, los lóbulos y el farol nazarí.
      k.shade(open, k.lin(P.goldL, 0, 0, 0, 1, 0.1, 0.6), P.goldL, 0.4) +
      k.draw([{ d: archivolt, fill: PIEDRA, inner: k.sh(archivolt, 0, 0, 1, 1, 0, 0.7, PIEDRA_D, 0.45) + `<path d="${voussoirs}" stroke="${PIEDRA_D}" stroke-width=".45"/>` + dots }], 0.5) +
      cusps + lamp + column(jl) + column(jr) +
      zellige(33.6, jl - 1.4) + zellige(jr + 1.4, 86.4) +
      `<path d="M33 68H${jl}M${jr} 68H87" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([
        { d: [46.4, 53.2, 60, 66.8, 73.6].map(merlon).join(''), fill: PIEDRA, inner: k.sh('M40 26H80V32H40Z', 0, 0, 1, 0, 0, 0.7, PIEDRA_D, 0.4) },
        { d: cornice, fill: PIEDRA, inner: k.sh(cornice, 0, 0, 0, 1, 0, 0.8, PIEDRA_D, 0.45) + Array.from({ length: 14 }, (_, i) => `<path d="M${f(34.6 + i * 3.8)} 32.2V35.4" stroke="${PIEDRA_D}" stroke-width=".7"/>`).join('') },
      ], 0.6) +
      `<path d="M30.6 35.6H89.4" stroke="${P.ink}" stroke-width=".5"/>` +
      k.floor(60, 87, 30, 2, COB_D) +
      `<path d="M30 86.4H90" stroke="${P.ink}" stroke-width="1.2"/>` +
      sparkle(26, 46, 2) + sparkle(94, 52, 1.6) + sparkle(60, 22, 1.8, '#fff') +
      k.defs()
    )
  },

  // ── Paleta completa ────────────────────────────────────────────────

  // Tres colores completos: arranca la colección. La cajita de crayones con tres que asoman más que el resto.
  'Cajita de crayones': (u) => {
    const k = kit(u)
    const front = 'M38 62H78V90H38Z'
    const side = 'M78 62L86 56.4V84.4L78 90Z'
    const mouth = 'M38 62L46 56.4H86L78 62Z'
    const flap = 'M46 56.4L49 42H89L86 56.4Z'
    const shorts = [[48, COB_D], [54, NEGRO], [70, TURQ_D], [76, VIOL]] as const
    return (
      pared(k) +
      taller(k, 60, 60, 33) +
      k.floor(63, 90, 26, 2.8, COB_D) +
      k.draw([{ d: flap, fill: P.white, inner: k.sh(flap, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + `<path d="M48.4 44.4H87.6" stroke="${COB}" stroke-width="1.2"/>` + `<path d="${starPath(68, 49.4, 3.4, 1.4, 8)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>` }], 0.55) +
      k.draw([{ d: mouth, fill: P.night }], 0.5) +
      shorts.map(([x, c]) => `<g transform="translate(${x} 64)">${crayon(k, c, P.night, 11)}</g>`).join('') +
      `<g transform="translate(51.4 66) rotate(-9)">` + crayon(k, COB, COB_D, 34) + `</g>` +
      `<g transform="translate(73 66) rotate(9)">` + crayon(k, P.red, P.wine, 32) + `</g>` +
      `<g transform="translate(62 66)">` + crayon(k, P.gold, P.goldD, 38) + `</g>` +
      k.draw([
        { d: side, fill: COB_D, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.night, 0.4) + `<path d="M80 66L84 63.2V78L80 81Z" fill="${COB}" opacity=".6"/>` },
        {
          d: front, fill: COB,
          inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, COB_D, 0.45) + `<path d="M36 60H46V92H36Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="${roundRect(41.6, 67.6, 74.4, 85, 4)}" fill="${P.white}" stroke="${P.gold}" stroke-width=".8"/>` +
            `<path d="M38 63.6H78M38 88.4H78" stroke="${P.gold}" stroke-width=".7"/>`,
        },
      ], 0.7) +
      `<text x="58" y="76.4" ${GEORGIA} font-style="italic" font-size="5.4" fill="${COB_D}" text-anchor="middle">Crayones</text>` +
      [P.red, P.gold, COB, TURQ, NEGRO].map((c, i) => `<circle cx="${50 + i * 4}" cy="80.8" r="1.3" fill="${c}" stroke="${P.ink}" stroke-width=".3"/>`).join('') +
      sparkle(84, 32, 2.2) + sparkle(34, 44, 1.6) +
      k.defs()
    )
  },

  // Diez colores completos: todas las tonalidades en tu pared. El arcoíris hecho de venecitas, apoyado en dos nubes.
  'Arcoíris': (u) => {
    const k = kit(u)
    const cx = 60, cy = 76, bands = [P.red, NAR, P.gold, P.green, COB, VIOL], w = 3.6, r0 = 15.4
    let tess = ''
    bands.forEach((c, b) => {
      const r1 = r0 + (bands.length - 1 - b) * w, r2 = r1 + w - 0.5, n = Math.round((Math.PI * (r1 + w / 2)) / 3.3)
      for (let i = 0; i < n; i++) {
        const a1 = Math.PI + (i / n) * Math.PI + 0.012, a2 = Math.PI + ((i + 1) / n) * Math.PI - 0.012
        const p = (r: number, a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
        tess += `<path d="M${p(r1, a1)}L${p(r2, a1)}L${p(r2, a2)}L${p(r1, a2)}Z" fill="${c}" stroke="${P.ink}" stroke-width=".3"/>`
        if (i % 2 === 0) tess += `<path d="M${p(r2 - 0.6, a1 + 0.02)}L${p(r2 - 0.6, (a1 + a2) / 2)}" stroke="#fff" stroke-width=".45" opacity=".75"/>`
      }
    })
    const outer = r0 + bands.length * w
    const arc = `M${cx - outer - 0.6} ${cy}A${outer + 0.6} ${outer + 0.6} 0 0 1 ${cx + outer + 0.6} ${cy}H${cx + r0 - 0.6}A${r0 - 0.6} ${r0 - 0.6} 0 0 0 ${cx - r0 + 0.6} ${cy}Z`
    const cloud = (x: number, y: number, s: number, flip: number) => {
      const d = 'M-12 4C-15 4 -16 0 -13 -1.6C-14 -6 -9 -8.4 -6 -6C-5 -11 2 -12 4 -7.4C7 -10 12 -8 11 -3.6C14.4 -3.4 15 3.6 11 4Z'
      return `<g transform="translate(${x} ${y}) scale(${f(s * flip)} ${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, P.sky2, 0.45) + hair(-8, 0, -2, -4, 5, -2, 0.5, P.sky) }], 0.6 / s) + `</g>`
    }
    return (
      pared(k) +
      taller(k, 60, 62, 34) +
      k.cast([arc], 2.2, 2.2, COB_D) +
      `<path d="${arc}" fill="${PASTINA}" stroke="${P.ink}" stroke-width="1.4" stroke-linejoin="round"/>` + tess +
      k.shade(arc, k.lin(P.blue, 0, 0, 1, 1, 0, 0.45), P.blue, 0.2) +
      `<path d="M${cx - outer + 1.6} ${cy - 2}A${outer - 1.6} ${outer - 1.6} 0 0 1 ${f(cx - 6)} ${f(cy - outer + 1.8)}" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>` +
      cloud(30.4, 77, 1, 1) + cloud(89.6, 77, 1, -1) +
      sparkle(60, 50, 2.6, '#fff') + sparkle(30, 46, 1.8) + sparkle(90, 44, 1.6) +
      k.defs()
    )
  },

  // Veinticinco colores completos: entra el sol y da gusto. El rosetón de la catedral, con su piedra, sus plomos y los
  // haces de luz de colores.
  'Vitral de catedral': (u) => {
    const k = kit(u)
    const cx = 60, cy = 56, R = 32
    const pt = (r: number, a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`
    const N = 12, step = (Math.PI * 2) / N
    // Cada pétalo: un arco apuntado radial, del óculo al anillo.
    const lancet = (i: number, r1: number, r2: number, half: number) => {
      const a = -Math.PI / 2 + i * step, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux
      const P0 = [cx + ux * r1 + px * half * 0.55, cy + uy * r1 + py * half * 0.55], P1 = [cx + ux * r1 - px * half * 0.55, cy + uy * r1 - py * half * 0.55]
      const S0 = [cx + ux * (r2 - half * 1.6) + px * half, cy + uy * (r2 - half * 1.6) + py * half], S1 = [cx + ux * (r2 - half * 1.6) - px * half, cy + uy * (r2 - half * 1.6) - py * half]
      const T = [cx + ux * r2, cy + uy * r2]
      const c0 = [S0[0] + ux * half * 1.2, S0[1] + uy * half * 1.2], c1 = [S1[0] + ux * half * 1.2, S1[1] + uy * half * 1.2]
      return `M${f(P0[0])} ${f(P0[1])}L${f(S0[0])} ${f(S0[1])}Q${f(c0[0])} ${f(c0[1])} ${f(T[0])} ${f(T[1])}Q${f(c1[0])} ${f(c1[1])} ${f(S1[0])} ${f(S1[1])}L${f(P1[0])} ${f(P1[1])}Z`
    }
    const glassCols = [COB, P.red, COB, P.gold, COB, P.red, COB, P.green, COB, P.red, COB, P.gold]
    let glass = '', leads = ''
    for (let i = 0; i < N; i++) {
      const d = lancet(i, 12.6, 28.6, 4.3), a = -Math.PI / 2 + i * step
      glass += `<path d="${d}" fill="${glassCols[i]}"/>`
      leads += `<path d="M${pt(14, a)}L${pt(25, a)}" /><path d="M${pt(18, a - 0.12)}L${pt(18, a + 0.12)}M${pt(22, a - 0.1)}L${pt(22, a + 0.1)}"/>`
      glass += `<circle cx="${f(cx + Math.cos(a + step / 2) * 27.6)}" cy="${f(cy + Math.sin(a + step / 2) * 27.6)}" r="2.2" fill="${i % 2 ? P.gold : TURQ}"/>`
    }
    const petals = Array.from({ length: N }, (_, i) => lancet(i, 12.6, 28.6, 4.3)).join('')
    const roundels = Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * step + step / 2; return `M${f(cx + Math.cos(a) * 27.6 - 2.2)} ${f(cy + Math.sin(a) * 27.6)}A2.2 2.2 0 1 0 ${f(cx + Math.cos(a) * 27.6 + 2.2)} ${f(cy + Math.sin(a) * 27.6)}A2.2 2.2 0 1 0 ${f(cx + Math.cos(a) * 27.6 - 2.2)} ${f(cy + Math.sin(a) * 27.6)}` }).join('')
    const star = starPath(cx, cy, 9, 4.4, 8, -90 + 22.5)
    const ring = `${ellipse(cx, cy, R + 3.4, R + 3.4)} M${cx - R} ${cy}A${R} ${R} 0 1 1 ${cx + R} ${cy}A${R} ${R} 0 1 1 ${cx - R} ${cy}Z`
    const beams = [[-0.2, P.gold], [0.15, COB_L], [0.45, P.red], [0.75, P.goldL]] as const
    return (
      `<rect width="120" height="130" fill="#26304F"/>` + k.shade(FULL, k.rad('#4A5784', 0.5, 0.42, 0.6, 0.9, 0), '#4A5784', 0.4) +
      Array.from({ length: 9 }, (_, r) => `<path d="M0 ${12 + r * 11}H120" stroke="#1A2240" stroke-width=".6"/>` + Array.from({ length: 6 }, (_, c) => `<path d="M${f(c * 22 + (r % 2) * 11)} ${12 + r * 11}V${23 + r * 11}" stroke="#1A2240" stroke-width=".6"/>`).join('')).join('') +
      // Los haces de luz que bajan hacia la nave.
      beams.map(([dx, c]) => `<path d="M${f(52 + dx * 20)} 60L${f(66 + dx * 20)} 56L${f(96 + dx * 30)} 130H${f(70 + dx * 30)}Z" fill="${c}" opacity=".16"/>`).join('') +
      k.shade('M48 56L76 52L112 130H66Z', k.lin(P.goldL, 0, 0, 0, 1, 0.35, 0), P.goldL, 0.2) +
      // El vidrio de fondo, oscuro, con su resplandor; los pétalos, los medallones y la estrella del óculo.
      `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${VIDRIO_N}"/>` +
      k.clip(ellipse(cx, cy, R, R),
        `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${COB_D}"/>` + glass +
        `<circle cx="${cx}" cy="${cy}" r="12" fill="${P.red}"/><path d="${star}" fill="${P.gold}"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="${COB}"/>` +
        k.shade(ellipse(cx, cy, R, R), k.rad('#ffffff', 0.38, 0.32, 0.75, 0.55, 0), '#ffffff', 0.35) +
        k.shade(ellipse(cx, cy, R, R), k.rad(VIDRIO_N, 0.62, 0.68, 0.6, 0, 0.7), VIDRIO_N, 0.3) +
        `<g fill="none" stroke="${NEGRO}" stroke-width=".55">${leads}<path d="${star}"/><circle cx="${cx}" cy="${cy}" r="6.4"/><circle cx="${cx}" cy="${cy}" r="3.2"/></g>` +
        Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `<path d="M${pt(12, a)}L${pt(R, a)}" stroke="${NEGRO}" stroke-width=".4" opacity=".7"/>` }).join('') +
        `<path d="M${pt(23.8, 0)}A23.8 23.8 0 1 1 ${pt(23.8, Math.PI)}A23.8 23.8 0 1 1 ${pt(23.8, 0)}" fill="none" stroke="${NEGRO}" stroke-width=".4" opacity=".7"/>`) +
      // La tracería de piedra: pétalos, medallones, óculo y el anillo de afuera.
      `<path d="${petals}${roundels}" fill="none" stroke="${P.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="${petals}${roundels}" fill="none" stroke="${PIEDRA}" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="12.4" fill="none" stroke="${P.ink}" stroke-width="2.8"/><circle cx="${cx}" cy="${cy}" r="12.4" fill="none" stroke="${PIEDRA}" stroke-width="1.6"/>` +
      k.draw([{ d: ring, fill: PIEDRA, inner: k.sh(ellipse(cx, cy, R + 3.4, R + 3.4), 0, 0, 1, 1, 0, 0.9, PIEDRA_D, 0.5) + `<circle cx="${cx}" cy="${cy}" r="${R + 1.7}" fill="none" stroke="${PIEDRA_D}" stroke-width=".4" stroke-dasharray=".01 1.4" stroke-linecap="round"/>` }], 0.75) +
      Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `<path d="M${pt(R + 0.2, a)}L${pt(R + 3.2, a)}" stroke="${PIEDRA_D}" stroke-width=".45"/>` }).join('') +
      `<path d="M${pt(R + 1.6, Math.PI * 1.1)}A${R + 1.6} ${R + 1.6} 0 0 1 ${pt(R + 1.6, Math.PI * 1.45)}" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".8"/>` +
      sparkle(48, 44, 2.6, '#fff') + sparkle(66, 50, 1.6, '#fff') + sparkle(30, 98, 1.6, P.goldL) + sparkle(84, 96, 1.4, P.goldL) +
      k.defs()
    )
  },

  // ── Manos de manteca ───────────────────────────────────────────────

  // Dos rondas con azulejos al piso: escoba y pala. Los pedazos del plato de loza, juntados en la pala.
  'Plato roto': (u) => {
    const k = kit(u)
    const floorD = 'M30 84L38.6 65.6H81.4L88 84Z'
    const back = 'M38.6 65.6V60.6C38.6 58.4 40 57.2 42.2 57.2H77.8C80 57.2 81.4 58.4 81.4 60.6V65.6Z'
    const sideL = 'M38.6 60.6V65.6L30 84L28 82.4Z'
    const sideR = 'M81.4 60.6V65.6L88 84L90 82.4Z'
    const lip = 'M28 82.4L30 84H88L90 82.4L89.6 85.6C89.4 86.4 88.8 86.8 88 86.8H30C29.2 86.8 28.6 86.4 28.4 85.6Z'
    const grip = taper(54, 58, 50, 46, 44, 34, 5, 3.8)
    const cs = cracks(0, 0, 13, [-1.9, -0.5, 0.9, 2.3], 2)
    const shards: [number, number, number, number][] = [[44, 75, -24, 0], [58, 70.6, 12, 1], [73, 76, -8, 2], [57.6, 80.6, 30, 3]]
    const block = roundRect(-3.2, -15, 3.2, 5, 1.8)
    const bristles = 'M-3.8 4.6H3.8L4.6 13.4H-4.6Z'
    return (
      pared(k) +
      taller(k, 60, 60, 33) +
      k.floor(59, 87, 31, 2.6, COB_D) +
      k.draw([{ d: grip, fill: COB, inner: k.sh(grip, 0, 0, 1, 0, 0, 0.9, COB_D, 0.45) + `<path d="M50.6 55L45.6 37" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` }], 0.65) +
      `<circle cx="44.6" cy="36.2" r="1" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      // La escobilla, apoyada contra el fondo de la pala.
      `<g transform="translate(80.4 57) rotate(32)">` +
      k.draw([
        { d: bristles, fill: P.gold, inner: k.sh(bristles, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + [-3, -1.5, 0, 1.5, 3].map((x) => hair(x, 5, x * 1.05, 9, x * 1.15, 13, 0.4, P.goldD)).join('') },
        { d: block, fill: P.brown, inner: k.sh(block, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + `<path d="M-1.6 -13.6V3.6" stroke="${P.goldL}" stroke-width=".6" opacity=".7"/>` + hair(1, -12, 1.4, -5, 1, 2, 0.4, P.brownD) },
      ], 0.6) +
      `<circle cx="0" cy="-12" r="1" fill="none" stroke="${P.ink}" stroke-width=".6"/><path d="M-3.2 4H3.2" stroke="${P.ink}" stroke-width=".6"/>` +
      `</g>` +
      // La pala enlozada: fondo, paredes y el labio blanco de adelante.
      k.draw([
        { d: back, fill: COB, inner: k.sh(back, 0, 0, 1, 0, 0, 0.8, COB_D, 0.45) + `<path d="M39.6 59.4C39.8 58.6 40.6 58.2 42.2 58.2H77.8" fill="none" stroke="${P.white}" stroke-width=".8"/>` },
        { d: sideL, fill: COB_D },
        { d: sideR, fill: COB_D },
        { d: floorD, fill: COB, inner: k.sh(floorD, 0, 0, 0, 1, 0.5, 0, COB_D, 0.45) + k.sh(floorD, 0, 0, 1, 1, 0, 0.6, COB_D, 0.35) + `<path d="M40 67H80" stroke="${COB_L}" stroke-width=".5" opacity=".7"/>` },
        { d: lip, fill: P.white, inner: k.sh(lip, 0, 0, 1, 0, 0, 0.8, P.sky2, 0.4) + `<path d="M30 85.4H88" stroke="${COB}" stroke-width=".4"/>` },
      ], 0.75) +
      `<circle cx="42" cy="78" r=".55" fill="${P.white}"/><circle cx="68" cy="81" r=".5" fill="${P.white}"/><circle cx="50" cy="70" r=".45" fill="${P.white}"/>` +
      // Los pedazos, cada uno con su parte de la pintura del plato.
      shards.map(([x, y, r, i]) => `<g transform="translate(${x} ${y}) rotate(${r})">` + k.draw([{ d: shard(cs, i), fill: P.white, inner: plateArt(k, 0, 0, 13, false) }], 0.5) + k.clip(shard(cs, i), `<path d="${shard(cs, i)}" fill="none" stroke="${BIZ}" stroke-width="1.2"/>`) + `</g>`).join('') +
      // Un pedacito que todavía cae.
      `<g transform="translate(66 44) rotate(20)">` + k.draw([{ d: 'M-3 -2L3.4 -2.6L2 2.6L-2.4 2Z', fill: P.white, inner: `<path d="M-3 -1H3" stroke="${COB}" stroke-width="1"/>` }], 0.45) + `</g>` +
      hair(64, 38, 63, 41, 64.6, 42, 0.5, P.blue) + hair(69, 37.6, 69.4, 40, 68.6, 41.6, 0.45, P.blue) +
      sparkle(32, 46, 2.2) + sparkle(90, 72, 1.6) +
      k.defs()
    )
  },

  // Seis desastres: entrás y se rompe todo. La trompa del elefante enroscada en la vasija de loza, que ya se cae.
  'Elefante en bazar': (u) => {
    const k = kit(u)
    const trunk = taper(110, 10, 90, 36, 55, 51, 19, 8.6)
    const wrap = taper(56, 50.6, 48.4, 57.6, 40.4, 55.2, 8.8, 6)
    const tip = 'M41.6 51.6C39.2 50.6 36.4 51.4 35.8 54C35.2 56.8 37.4 58.8 40.2 58.6C41.4 58.6 42.4 58 42.8 57.2Z'
    const rings = [0.16, 0.25, 0.34, 0.43, 0.52, 0.6, 0.68, 0.76, 0.84, 0.92].map((t) => {
      const a = 1 - t, x = a * a * 110 + 2 * a * t * 90 + t * t * 55, y = a * a * 10 + 2 * a * t * 36 + t * t * 51
      const dx = 2 * a * (90 - 110) + 2 * t * (55 - 90), dy = 2 * a * (36 - 10) + 2 * t * (51 - 36), L = Math.hypot(dx, dy), w = (19 + (8.6 - 19) * t) / 2
      const nx = -dy / L, ny = dx / L
      return hair(x + nx * w * 0.92, y + ny * w * 0.92, x + (dx / L) * 1.6, y + (dy / L) * 1.6, x - nx * w * 0.92, y - ny * w * 0.92, 0.55, ELEF_D, 0.85)
    }).join('')
    return (
      pared(k) +
      taller(k, 58, 62, 33) +
      k.floor(56, 93, 20, 2.4, COB_D) +
      // La vasija, volcándose.
      `<g transform="translate(60 92) rotate(-22) scale(1.15)">` + k.cast(['M-11 0C-12 -10 -12 -24 -4 -30V-36H4V-30C12 -24 12 -10 11 0Z'], 2, 2, COB_D) + vase(k) +
      `<path d="M3 -26L5.4 -21L3.6 -18L6 -13" fill="none" stroke="${P.ink}" stroke-width=".55" stroke-linejoin="round"/>` + `</g>` +
      // La trompa: gris, con sus arrugas, enroscada en el cuello de la vasija.
      k.cast([trunk], 2.2, 2.4, COB_D) +
      k.draw([
        { d: trunk, fill: ELEF, inner: k.sh(trunk, 0, 0, 1, 1, 0, 0.9, ELEF_D, 0.5) + `<path d="M92 4C88 24 80 40 60 46L62 41C78 36 84 22 86 4Z" fill="${ELEF_L}" opacity=".8"/>` + rings + hair(98, 22, 92, 34, 80, 42, 0.45, ELEF_D, 0.8) },
        { d: wrap, fill: ELEF, inner: k.sh(wrap, 0, 0, 0, 1, 0, 0.9, ELEF_D, 0.5) + hair(52.4, 51.6, 51, 55, 51.4, 58.4, 0.5, ELEF_D) + hair(47.6, 53, 46.6, 56, 47, 59.4, 0.5, ELEF_D) + hair(43.6, 52.2, 43, 55, 43.4, 58, 0.45, ELEF_D) },
        { d: tip, fill: ELEF, inner: k.sh(tip, 0, 0, 1, 1, 0, 0.8, ELEF_D, 0.45) },
      ], 0.8) +
      // El colmillo de marfil, al costado de la trompa.
      k.draw([{ d: taper(84, 26, 73, 38.6, 61.6, 35, 5.4, 1.2), fill: '#F4EEDF', inner: k.sh(taper(84, 26, 73, 38.6, 61.6, 35, 5.4, 1.2), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.45) + hair(82, 27.4, 74, 35.4, 65, 34.6, 0.45, '#fff') + hair(80, 31, 73, 37.4, 67, 36.6, 0.35, PIEDRA_D) }], 0.6) +
      `<ellipse cx="37.6" cy="54.6" rx="1.1" ry="1.5" fill="${P.night}" transform="rotate(20 37.6 54.6)"/><path d="M36.6 52.4C37.4 51.6 38.6 51.4 39.6 51.8" fill="none" stroke="${ELEF_L}" stroke-width=".5" stroke-linecap="round"/>` +
      // Los pedazos que ya saltan.
      [[36, 84, -30], [82, 86, 40], [30, 72, 10]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-2.4 -1.6L2.6 -2.2L1.4 2L-1.8 1.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1.6 -.8L1.6 -1.2" stroke="${COB}" stroke-width=".7"/></g>`).join('') +
      hair(42, 76, 38, 79, 36, 81, 0.5, P.blue) + hair(76, 80, 79, 82, 80, 84, 0.5, P.blue) +
      sparkle(30, 44, 2) + sparkle(88, 66, 1.6) +
      k.defs()
    )
  },

  // Quince rondas rompiendo cerámica: ¡opa! El plato con la guarda griega estallando en el aire, entre laureles.
  'Casamiento griego': (u) => {
    const k = kit(u)
    const R = 22, cs = cracks(0, 0, R, [-2.3, -1.25, -0.25, 0.75, 1.75, 2.75].map((a) => a + 0.1), 5)
    const pieces = cs.map((_, i) => {
      const a0 = Math.atan2(cs[i][4][1], cs[i][4][0]), a1 = Math.atan2(cs[(i + 1) % cs.length][4][1], cs[(i + 1) % cs.length][4][0])
      let mid = (a0 + a1) / 2
      if (Math.abs(a1 - a0) > Math.PI) mid += Math.PI
      return { i, dx: Math.cos(mid) * 3.2, dy: Math.sin(mid) * 3.2, r: (i % 2 ? 1 : -1) * (1.6 + i * 0.4) }
    })
    const flecks = [[34, 32, 20], [88, 36, -30], [26, 62, 60], [96, 64, -10], [44, 88, 15], [80, 90, -40]]
    return (
      pared(k) +
      k.sun(60, 56, 15, 48, 32, false) +
      k.shade(ellipse(60, 56, 28, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.85, 0), P.goldL, 0.5) +
      laurel(50, 100, 29, 92, 25, 64, 8) + laurel(70, 100, 91, 92, 95, 64, 8, true) +
      `<g transform="translate(60 55)">` +
      pieces.map(({ i, dx, dy, r }) => `<g transform="translate(${f(dx)} ${f(dy)}) rotate(${r})">` + k.cast([shard(cs, i)], 1.6, 1.8, COB_D) + `</g>`).join('') +
      pieces.map(({ i, dx, dy, r }) => `<g transform="translate(${f(dx)} ${f(dy)}) rotate(${r})">` +
        k.draw([{ d: shard(cs, i), fill: P.white, inner: `<circle r="${R}" fill="${P.white}"/>` + plateArt(k, 0, 0, R, true) }], 0.6) +
        k.clip(shard(cs, i), `<path d="${shard(cs, i)}" fill="none" stroke="${BIZ}" stroke-width="1.4"/>`) + `</g>`).join('') +
      `</g>` +
      `<g transform="translate(60 55)"><path d="M${f(-R - 3)} 0A${R + 3} ${R + 3} 0 0 1 0 ${f(-R - 3)}" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".0"/></g>` +
      flecks.map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-2.2 -1.4L2.4 -2L1.2 1.8L-1.6 1.2Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><path d="M-1.4 -.6L1.4 -1" stroke="${COB}" stroke-width=".6"/></g>`).join('') +
      hair(30, 40, 33, 43, 37, 44, 0.5, COB_D) + hair(90, 44, 87, 46, 83, 46.4, 0.5, COB_D) + hair(30, 70, 34, 69, 37, 67, 0.45, COB_D) + hair(90, 72, 86, 70.6, 83, 68, 0.45, COB_D) +
      `<text x="60" y="94" ${GEORGIA} font-style="italic" font-weight="700" font-size="8" fill="${COB_D}" text-anchor="middle">¡Opa!</text>` +
      sparkle(60, 22, 2.8, '#fff') + sparkle(28, 50, 1.8) +
      k.defs()
    )
  },
}
