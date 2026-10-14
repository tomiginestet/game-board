// Dardos: los objetos del pub. La diana de sisal con sus veinte gajos negros y crema, los anillos rojos y verdes, el
// bull y la araña de alambre; el dardo con su punta de acero, el barril moleteado y las aletas; y la pinta de rubia.
// La familia del ojo de toro le pone cuernos (y alas) a la diana.
import { f } from '../helpers'
import { ellipse, hair, kit, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'
import { BEER, BEER_D, FELT, FELT_D, FOAM, glow, NEGRA, NEGRA_D, rotulo, stars, WOOD, WOOD_D, WOOD_G, WOOD_L } from './_bar-piezas'

const CREAM = '#EEE3C3', CREAM_D = '#C9B98E'
const NUMS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]
/** Hueso de los cuernos. */
const BONE = '#F2E6C8', BONE_D = '#C7AE7E'

// ── Piezas de los dardos ─────────────────────────────────────────────

/** Gajo de corona entre los radios r0 y r1, centrado en el ángulo a (grados) con media abertura h. */
const wedge = (x: number, y: number, r0: number, r1: number, a: number, h = 9) => {
  const p = (r: number, t: number) => `${f(x + r * Math.cos((t * Math.PI) / 180))} ${f(y + r * Math.sin((t * Math.PI) / 180))}`
  return `M${p(r0, a - h)}L${p(r1, a - h)}A${r1} ${r1} 0 0 1 ${p(r1, a + h)}L${p(r0, a + h)}A${r0} ${r0} 0 0 0 ${p(r0, a - h)}Z`
}

/** Diana en (x,y): R es el borde del doble. Con el aro negro de los números (si `nums`), los agujeritos y la araña. */
function board(k: Kit, x: number, y: number, R: number, o: { nums?: boolean; holes?: number; ring?: number; seed?: number } = {}) {
  const ringR = R * (o.ring ?? 1.26), out = ellipse(x, y, ringR, ringR)
  let sectors = '', rings = ''
  for (let i = 0; i < 20; i++) {
    const a = -90 + i * 18, dark = i % 2 === 0
    sectors += `<path d="${wedge(x, y, R * 0.094, R, a)}" fill="${dark ? NEGRA : CREAM}"/>`
    rings += `<path d="${wedge(x, y, R * 0.953, R, a)}${wedge(x, y, R * 0.582, R * 0.629, a)}" fill="${dark ? P.red : FELT}"/>`
  }
  const spokes = Array.from({ length: 20 }, (_, i) => {
    const t = ((-99 + i * 18) * Math.PI) / 180
    return `M${f(x + Math.cos(t) * R * 0.094)} ${f(y + Math.sin(t) * R * 0.094)}L${f(x + Math.cos(t) * R)} ${f(y + Math.sin(t) * R)}`
  }).join('')
  const wire = `<path d="${spokes}" stroke="${P.sky2}" stroke-width="${f(R * 0.012)}"/>` +
    [R, R * 0.953, R * 0.629, R * 0.582, R * 0.094, R * 0.037].map((r) => `<circle cx="${x}" cy="${y}" r="${f(r)}" fill="none" stroke="${P.sky2}" stroke-width="${f(R * 0.012)}"/>`).join('')
  const nums = o.nums === false ? '' : NUMS.map((n, i) => {
    const t = ((-90 + i * 18) * Math.PI) / 180, rr = R * 1.13
    return `<text x="${f(x + Math.cos(t) * rr)}" y="${f(y + Math.sin(t) * rr + R * 0.05)}" font-family="Georgia, serif" font-weight="700" font-size="${f(R * 0.14)}" fill="${P.white}" text-anchor="middle" transform="rotate(${i * 18 > 90 && i * 18 < 270 ? i * 18 - 180 : i * 18} ${f(x + Math.cos(t) * rr)} ${f(y + Math.sin(t) * rr)})">${n}</text>`
  }).join('')
  const s = o.seed ?? 1
  const holes = Array.from({ length: o.holes ?? 0 }, (_, i) => {
    const r = Math.sqrt(((Math.sin(i * 91.7 + s) * 43758.5) % 1 + 1) % 1) * R * 0.95, t = ((Math.sin(i * 12.9 + s * 3) * 9631.3) % 1) * Math.PI * 2
    return `<circle cx="${f(x + Math.cos(t) * r)}" cy="${f(y + Math.sin(t) * r)}" r="${f(R * 0.016 + (i % 3) * R * 0.004)}" fill="${NEGRA_D}" opacity=".85"/>`
  }).join('')
  return k.draw([{
    d: out, fill: NEGRA,
    inner: sectors + rings +
      `<circle cx="${x}" cy="${y}" r="${f(R * 0.094)}" fill="${FELT}"/><circle cx="${x}" cy="${y}" r="${f(R * 0.037)}" fill="${P.red}"/>` +
      wire + nums + holes +
      k.sh(out, 0, 0, 1, 1, 0, 0.5, NEGRA_D, 0.25) + `<path d="${out}" fill="${k.rad('#ffffff', 0.3, 0.26, 0.6, 0.35, 0)}"/>` +
      `<circle cx="${x}" cy="${y}" r="${f(ringR - 0.5)}" fill="none" stroke="${P.mid}" stroke-width=".6"/>` +
      hair(x - ringR * 0.8, y - ringR * 0.3, x - ringR * 0.7, y - ringR * 0.75, x - ringR * 0.2, y - ringR * 0.92, 0.6, P.sky, 0.8),
  }], 0.7)
}

interface DartOpts {
  /** Color de las aletas. */
  fl?: string
  flD?: string
  /** Barril dorado (para los de oro). */
  gold?: boolean
  /** Ancho del barril. */
  w?: number
  /** Qué tanto se ve la punta (0: clavada hasta el barril). */
  tip?: number
  /** Cola partida en dos por otro dardo: la caña y las aletas se abren en V. */
  split?: number
}
/** Dardo con la punta en (x0,y0) y la cola en (x1,y1), visto de costado: punta de acero, barril moleteado, caña y aletas. */
function dart(k: Kit, x0: number, y0: number, x1: number, y1: number, o: DartOpts = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI
  const w = o.w ?? L * 0.075, tip = (o.tip ?? 1) * L * 0.2, b0 = tip, b1 = b0 + L * 0.3, s1 = b1 + L * 0.2
  const fl = o.fl ?? P.red, flD = o.flD ?? P.wine
  const point = `M0 ${f(-w * 0.16)}L${f(b0)} ${f(-w * 0.26)}V${f(w * 0.26)}L0 ${f(w * 0.16)}Z`
  const barrel = `M${f(b0)} ${f(-w * 0.4)}Q${f(b0 + L * 0.06)} ${f(-w * 0.55)} ${f(b0 + L * 0.12)} ${f(-w * 0.55)}L${f(b1 - L * 0.02)} ${f(-w * 0.45)}L${f(b1)} ${f(-w * 0.28)}V${f(w * 0.28)}L${f(b1 - L * 0.02)} ${f(w * 0.45)}L${f(b0 + L * 0.12)} ${f(w * 0.55)}Q${f(b0 + L * 0.06)} ${f(w * 0.55)} ${f(b0)} ${f(w * 0.4)}Z`
  const shaft = `M${f(b1)} ${f(-w * 0.22)}L${f(s1 + 1)} ${f(-w * 0.18)}V${f(w * 0.18)}L${f(b1)} ${f(w * 0.22)}Z`
  const wingT = `M${f(s1 - L * 0.04)} ${f(-w * 0.15)}L${f(L - L * 0.03)} ${f(-w * 1.55)}Q${f(L + 0.4)} ${f(-w * 1.6)} ${f(L)} ${f(-w * 1.1)}L${f(L)} 0H${f(s1 - L * 0.04)}Z`
  const wingB = `M${f(s1 - L * 0.04)} ${f(w * 0.15)}L${f(L - L * 0.03)} ${f(w * 1.55)}Q${f(L + 0.4)} ${f(w * 1.6)} ${f(L)} ${f(w * 1.1)}L${f(L)} 0H${f(s1 - L * 0.04)}Z`
  const knurl = Array.from({ length: Math.max(3, Math.round((b1 - b0) / 1.2)) }, (_, i) => `M${f(b0 + L * 0.13 + i * 1.2)} ${f(-w * 0.5)}V${f(w * 0.5)}`).join('')
  const bc = o.gold ? P.gold : P.sky2, bd = o.gold ? P.goldD : P.mid
  const sp = o.split ?? 0, tT = sp ? `rotate(${-sp} ${f(b1)} 0)` : undefined, tB = sp ? `rotate(${sp} ${f(b1)} 0)` : undefined
  const half = (s: number) => `M${f(b1)} 0L${f(s1 + 1)} 0V${f(s * w * 0.2)}L${f(b1)} ${f(s * w * 0.24)}Z`
  return (
    `<g transform="translate(${f(x0)} ${f(y0)}) rotate(${f(a)})">` +
    k.draw([
      ...(sp ? [{ d: half(-1), t: tT, fill: P.ink }, { d: half(1), t: tB, fill: P.ink }] : []),
      { d: wingT, t: tT, fill: fl, inner: k.sh(wingT, 0, 0, 0, 1, 0, 0.6, flD, 0.4) + `<path d="M${f(s1)} ${f(-w * 0.6)}L${f(L - 1)} ${f(-w * 1.2)}" stroke="#fff" stroke-width=".35" opacity=".7"/>` },
      { d: wingB, t: tB, fill: fl, inner: k.sh(wingB, 0, 0, 0, 1, 0.3, 0.9, flD, 0.5) },
      ...(sp ? [] : [{ d: shaft, fill: P.ink, inner: `<path d="M${f(b1)} ${f(-w * 0.1)}H${f(s1)}" stroke="${P.mid}" stroke-width=".35"/>` }]),
      { d: barrel, fill: bc, inner: `<path d="${knurl}" stroke="${bd}" stroke-width=".3"/>` + k.sh(barrel, 0, 0, 0, 1, 0, 0.9, bd, 0.45) + `<path d="M${f(b0 + 1)} ${f(-w * 0.3)}H${f(b1 - 1)}" stroke="#fff" stroke-width="${f(w * 0.14)}" stroke-linecap="round" opacity=".85"/>` },
      ...(tip > 0.1 ? [{ d: point, fill: P.white, inner: `<path d="M0 0H${f(b0)}" stroke="${P.blue}" stroke-width="${f(w * 0.12)}"/>` }] : []),
    ], f(Math.max(0.3, w * 0.12))) +
    (sp ? '' : `<path d="M${f(s1 - L * 0.04)} 0H${f(L)}" stroke="${P.ink}" stroke-width=".4"/>`) +
    `</g>`
  )
}

/** Cuerno curvo de (x0,y0) (la base) a la punta (x1,y1), pasando cerca de (cx,cy). */
function horn(k: Kit, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number) {
  const d = taper(x0, y0, cx, cy, x1, y1, w0, 0.6)
  const tipD = taper(x0 + (x1 - x0) * 0.62 + (cx - (x0 + x1) / 2) * 0.45, y0 + (y1 - y0) * 0.62 + (cy - (y0 + y1) / 2) * 0.45, (cx + x1) / 2 + (cx - x1) * 0.05, (cy + y1) / 2, x1, y1, w0 * 0.55, 0.6)
  const rings = [0.12, 0.22, 0.32].map((t) => {
    const a = 1 - t, px = a * a * x0 + 2 * a * t * cx + t * t * x1, py = a * a * y0 + 2 * a * t * cy + t * t * y1
    return `<circle cx="${f(px)}" cy="${f(py)}" r="${f(w0 * (0.5 - t * 0.5))}" fill="none" stroke="${BONE_D}" stroke-width=".35"/>`
  }).join('')
  return k.draw([{ d, fill: BONE, inner: rings + `<path d="${tipD}" fill="${P.ink}" opacity=".85"/>` + k.sh(d, 0, 0, 1, 1, 0.1, 0.8, BONE_D, 0.5) }], 0.6)
}

/** Ala de halcón abierta hacia un costado (s = -1 izquierda, 1 derecha), con la base en (x,y). */
function wing(k: Kit, x: number, y: number, s: number) {
  const feathers = [[-46, 26], [-30, 28], [-14, 27], [2, 24], [18, 20]]
  const pieces = feathers.map(([ang, len], i) => {
    const t = (ang * Math.PI) / 180, ex = Math.cos(t) * len, ey = Math.sin(t) * len
    const d = `M0 0Q${f(ex * 0.4 - ey * 0.16)} ${f(ey * 0.4 + ex * 0.16)} ${f(ex)} ${f(ey)}Q${f(ex * 0.6 + ey * 0.1)} ${f(ey * 0.6 - ex * 0.1)} 0 ${f(2.8)}Z`
    return { d, fill: i % 2 ? P.goldL : P.gold, inner: `<path d="M0 1.2L${f(ex * 0.92)} ${f(ey * 0.92)}" stroke="${P.goldD}" stroke-width=".45"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.8, P.goldD, 0.4) + [0.4, 0.6, 0.8].map((q) => `<path d="M${f(ex * q)} ${f(ey * q)}l${f(-ey * 0.04)} ${f(ex * 0.04 + 1.6)}" stroke="${P.goldD}" stroke-width=".3"/>`).join('') }
  })
  return `<g transform="translate(${x} ${y}) scale(${s * 1.25} 1.25)">` + k.draw(pieces.reverse(), 0.5) + `</g>`
}

export const DARDOS_ART: Record<string, (u: number) => string> = {
  // ── Pub inglés ─────────────────────────────────────────────────────

  // Cinco ganadas: la pinta que se calentó mientras apuntabas (espuma chata, el vaho y el termómetro en rojo), y el dardo
  // que por fin se tiró, clavado en la barra.
  'Pinta tibia': (u) => {
    const k = kit(u)
    const glass = 'M43 36H73L71.4 50C73 54 72.6 58 71.2 62L69 92Q68.8 94 66.8 94H49.2Q47.2 94 47 92L44.8 62C43.4 58 43 54 44.6 50Z'
    const beer = 'M44 45H72L71.4 50C73 54 72.6 58 71.2 62L69 92Q68.8 94 66.8 94H49.2Q47.2 94 47 92L44.8 62C43.4 58 43 54 44.6 50Z'
    const foam = 'M43.6 42.6C48 41.6 52 43.4 56 42.6C60 41.8 64 43.4 68 42.6C70 42.2 71.4 42.6 72.4 43.2L72 46.4C66 47.4 50 47.4 44 46.4Z'
    const bar = 'M-10 92H130V140H-10Z'
    const thermo = `M0 -24A1.6 1.6 0 0 1 1.6 -22.4V-2A3.2 3.2 0 1 1 -1.6 -2V-22.4A1.6 1.6 0 0 1 0 -24Z`
    const steam = (x: number, s: number) => hair(x, 34, x - 3 * s, 28, x, 22, 0.8, P.blue, 0.8) + hair(x, 22, x + 3 * s, 17, x, 12, 0.6, P.blue, 0.6)
    return (
      k.day() +
      k.sun(58, 52, 16, 46, 32, true) +
      glow(k, 58, 60, 20, 26, 0.6) +
      k.draw([{ d: bar, fill: WOOD, inner: k.sh(bar, 0, 0, 0, 1, 0, 0.8, WOOD_G, 0.45) + `<path d="M-10 92.6H130" stroke="${WOOD_L}" stroke-width="1"/>` + hair(10, 98, 40, 97, 70, 99, 0.5, WOOD_D) + hair(60, 102, 85, 101, 110, 103, 0.5, WOOD_D) }], 0.6) +
      k.floor(60, 93.6, 16, 2, WOOD_G) +
      steam(52, 1) + steam(62, -1) + steam(57, 1) +
      k.draw([{
        d: glass, fill: P.white,
        inner: `<path d="${beer}" fill="${BEER}"/>` + k.sh(beer, 0, 0, 1, 0, 0, 0.8, BEER_D, 0.45) +
          `<path d="${foam}" fill="${FOAM}"/>` + k.sh(foam, 0, 0, 0, 1, 0, 0.6, CREAM_D, 0.4) +
          `<path d="M47.4 52C46.6 60 47.6 74 49.4 90" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>` +
          `<path d="M44.6 50C48 51.4 68 51.4 71.4 50" fill="none" stroke="${P.sky}" stroke-width=".5"/>` +
          k.sh(glass, 0, 0, 1, 0, 0, 0.5, P.sky2, 0.3),
      }], 0.7) +
      `<g transform="translate(66 74) rotate(14)">` +
      k.draw([{ d: thermo, fill: P.white, inner: `<path d="M-.7 -14V-2H.7V-14Z" fill="${P.red}"/><circle cx="0" cy="1" r="2.4" fill="${P.red}"/>` + `<path d="M.8 -21H1.6M.8 -18H1.6M.8 -15H1.6M.8 -12H1.6M.8 -9H1.6M.8 -6H1.6" stroke="${P.ink}" stroke-width=".3"/>` }], 0.45) +
      `</g>` +
      dart(k, 80, 93, 90, 73, { fl: P.mid, flD: P.ink, tip: 0.2, w: 2.6 }) +
      rotulo(32, 74, 8, 'uff…', { rot: -12, c: P.ink, bold: true }) +
      sparkle(86, 40, 1.8) +
      k.defs()
    )
  },

  // Veinte victorias: la diana del pub en su gabinete de madera, llena de tus agujeritos, con tres dardos en el veinte.
  'Diana del pub': (u) => {
    const k = kit(u)
    const cab = roundRect(23, 20, 97, 98, 2)
    const chalkboard = (x: number) => roundRect(x, 80, x + 12, 96, 0.8)
    return (
      k.night() +
      stars([[30, 26], [90, 28], [26, 50, 0.4], [94, 52, 0.4]]) +
      glow(k, 60, 56, 32, 32, 0.45, P.sky) +
      k.draw([{ d: cab, fill: WOOD_D, inner: k.sh(cab, 0, 0, 1, 1, 0, 0.8, WOOD_G, 0.5) + Array.from({ length: 6 }, (_, i) => hair(26 + i * 13, 22, 24 + i * 13, 60, 27 + i * 13, 96, 0.4, WOOD_G, 0.7)).join('') + `<path d="M25 22H95V96H25Z" fill="none" stroke="${WOOD_L}" stroke-width=".5" opacity=".6"/>` }], 0.7) +
      k.floor(61, 60, 30, 30, NEGRA_D) +
      board(k, 60, 57, 21.4, { holes: 70, seed: 3 }) +
      dart(k, 58.4, 39.4, 44, 27, { fl: P.red, w: 2.6, tip: 0 }) + dart(k, 61.6, 40, 76, 28, { fl: P.red, w: 2.6, tip: 0 }) + dart(k, 60, 41.4, 62, 23, { fl: P.red, w: 2.6, tip: 0 }) +
      k.draw([{ d: chalkboard(27), fill: NEGRA, inner: `<path d="M29 84H37M29 87H35M29 90H38M29 93H33" stroke="${P.paper}" stroke-width=".5" opacity=".85"/>` }, { d: chalkboard(81), fill: NEGRA, inner: `<path d="M83 84H90M83 87H91M83 90H86" stroke="${P.paper}" stroke-width=".5" opacity=".85"/><path d="M83 92.4L91 92.4" stroke="${P.paper}" stroke-width=".3"/>` }], 0.45) +
      sparkle(84, 34, 1.6, P.goldL) + sparkle(34, 74, 1.3, P.goldL) +
      k.defs()
    )
  },

  // Sesenta ganadas: el tiro de Robin Hood. En el bull, el segundo dardo entra por la cola del primero y le abre las
  // aletas en dos; las aletas son plumas.
  'Robin Hood de bar': (u) => {
    const k = kit(u)
    const bx = 36, by = 58
    const edge = ellipse(bx + 2.6, by, 9.6, 26.6)
    const chips = [[63, 46, 30], [66, 58, -40], [60, 44, 70], [70, 47, 10]].map(([x, y, r]) => `<path d="M-1.4 -.4H1.4L1 .5H-1.2Z" transform="translate(${x} ${y}) rotate(${r})" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    return (
      k.day() +
      k.sun(64, 54, 14, 48, 32, true) +
      glow(k, 64, 50, 22, 18, 0.7) +
      k.draw([{ d: edge, fill: NEGRA, inner: k.sh(edge, 0, 0, 1, 0, 0, 0.7, NEGRA_D, 0.4) }], 0.7) +
      `<g transform="translate(${bx} ${by}) scale(.36 1)">` + board(k, 0, 0, 21.4, { nums: false, ring: 1.18, holes: 10, seed: 4 }) + `</g>` +
      k.floor(70, 92, 22, 2.4) +
      dart(k, bx + 0.4, by, 70, 48, { fl: P.red, flD: P.wine, w: 4.6, tip: 0, split: 24 }) +
      dart(k, 60.4, 50.6, 94, 38.6, { gold: true, fl: FELT, flD: FELT_D, w: 4.6, tip: 0.45 }) +
      chips +
      hair(70, 38, 73, 35, 77, 34, 0.6, P.goldD) + hair(70, 62, 74, 64, 78, 64, 0.6, P.goldD) +
      `<path d="M50 74C54 70 60 69 64 70" fill="none" stroke="${P.goldD}" stroke-width=".7"/><path d="M47 30C52 33 56 37 58 41" fill="none" stroke="${P.goldD}" stroke-width=".7"/>` +
      sparkle(62, 50, 3.4, '#fff') + sparkle(88, 70, 2, P.goldL) + sparkle(84, 28, 1.6) +
      k.defs()
    )
  },

  // ── Ojo de toro ────────────────────────────────────────────────────

  // Tres bulls: a la diana le salen los cuernitos de ternero. El dardo entró torcido, de casualidad, con el trébol.
  'Ternero': (u) => {
    const k = kit(u)
    const clover = [0, 90, 180, 270].map((r) => `<path d="M0 0C-2.4 -1.4 -2.8 -4.4 -.9 -4.8C0 -5 .4 -4.4 0 -3.8C-.4 -4.4 0 -5 .9 -4.8C2.8 -4.4 2.4 -1.4 0 0Z" transform="rotate(${r})" fill="${FELT}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    return (
      k.day() +
      k.stage(60, 60, 33) +
      horn(k, 50, 46, 44, 38, 45, 31, 6.4) + horn(k, 70, 46, 76, 38, 75, 31, 6.4) +
      k.floor(61, 88, 18, 2.4) +
      board(k, 60, 64, 18.6, { holes: 10, seed: 2 }) +
      dart(k, 60.6, 61.4, 83, 47, { fl: P.sky, flD: P.mid, w: 3, tip: 0 }) +
      `<g transform="translate(86 44) rotate(20) scale(1.5)">` + clover + `<path d="M0 0Q1 3 3 4" fill="none" stroke="${FELT_D}" stroke-width=".6"/></g>` +
      hair(66, 44, 69, 41, 72, 41, 0.5, P.mid) + hair(84, 58, 87, 58, 89, 60, 0.5, P.mid) +
      rotulo(37, 44, 5.6, '¡muu!', { rot: -14, c: P.mid, bold: true }) +
      sparkle(30, 48, 1.8) + sparkle(90, 72, 1.4) +
      k.defs()
    )
  },

  // Quince bulls: los cuernos de lidia, tres dardos en el centro y la venda que no hizo falta, colgada de un cuerno.
  'Toro de lidia': (u) => {
    const k = kit(u)
    const mask = 'M0 -2.6C-3 -4.6 -8 -4.4 -8.4 -1C-8.6 2.4 -5 4.4 -2 3.2C-1 2.8 -.4 2.2 0 1.6C.4 2.2 1 2.8 2 3.2C5 4.4 8.6 2.4 8.4 -1C8 -4.4 3 -4.6 0 -2.6Z'
    return (
      k.day() +
      k.sun(60, 58, 15, 48, 32, true) +
      horn(k, 48, 54, 22, 52, 26, 26, 8.6) + horn(k, 72, 54, 98, 52, 94, 26, 8.6) +
      k.floor(61, 88, 18, 2.4) +
      board(k, 60, 64, 16.4, { holes: 8, seed: 5 }) +
      dart(k, 59.4, 63.6, 42, 50, { fl: P.red, w: 2.6, tip: 0 }) + dart(k, 60.6, 63.4, 76, 48, { fl: P.red, w: 2.6, tip: 0 }) + dart(k, 60, 64.6, 59, 42, { fl: P.red, w: 2.6, tip: 0 }) +
      `<path d="M35.6 90C30 86 31 82 36 84M52.4 89.4C58 86 58 82 53 83.6" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="M35.6 90C30 86 31 82 36 84M52.4 89.4C58 86 58 82 53 83.6" fill="none" stroke="${P.mid}" stroke-width=".5"/>` +
      k.floor(44.6, 93, 9, 1.4) +
      `<g transform="translate(44 89.6) rotate(-6) scale(1.3)">` +
      k.draw([{ d: mask, fill: NEGRA, inner: k.sh(mask, 0, 0, 1, 1, 0, 0.6, NEGRA_D, 0.4) + `<path d="M-6 -2.2C-4 -3.4 -2 -3.4 -.6 -2.4M.6 -2.4C2 -3.4 4 -3.4 6 -2.2" fill="none" stroke="${P.mid}" stroke-width=".5"/>` + `<path d="M-4.6 1.2Q-3 2.4 -1.4 1.2M1.4 1.2Q3 2.4 4.6 1.2" fill="none" stroke="${P.sky}" stroke-width=".45"/>` }], 0.5) +
      `</g>` +
      sparkle(60, 36, 1.8) + sparkle(30, 66, 1.4) +
      k.defs()
    )
  },

  // Cincuenta bulls: el ojo de halcón. La diana es el ojo, con las alas doradas abiertas; abajo, el cartel del
  // estacionamiento desde donde tiraste.
  'Ojo de halcón': (u) => {
    const k = kit(u)
    const sign = roundRect(-5.4, -5.4, 5.4, 5.4, 1.2)
    const traj = 'M30 92C34 70 44 58 58 56'
    return (
      k.night() +
      stars([[28, 30], [92, 30], [36, 22, 0.4], [84, 22, 0.4], [96, 64, 0.4], [24, 64, 0.4]]) +
      glow(k, 60, 52, 30, 28, 0.5, P.goldL) +
      wing(k, 44, 54, -1) + wing(k, 76, 54, 1) +
      board(k, 60, 52, 15.6, { holes: 4, seed: 7 }) +
      k.shade(ellipse(60, 52, 3.4, 3.4), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.4) +
      `<path d="${traj}" fill="none" stroke="${P.goldL}" stroke-width=".8" stroke-dasharray="1.6 1.6" opacity=".9"/>` +
      dart(k, 60.4, 51.6, 74, 36, { gold: true, fl: P.goldL, flD: P.goldD, w: 2.6, tip: 0 }) +
      `<path d="M32 82V98" stroke="${P.ink}" stroke-width="1.8"/><path d="M32 82V98" stroke="${P.sky2}" stroke-width=".7"/>` +
      `<g transform="translate(32 78)">` + k.draw([{ d: sign, fill: P.mid, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.6, P.ink, 0.4) + `<path d="${roundRect(-4.4, -4.4, 4.4, 4.4, 0.8)}" fill="none" stroke="#fff" stroke-width=".4"/>` }], 0.45) +
      `<text x="0" y="2.9" font-family="Georgia, serif" font-weight="700" font-size="7.6" fill="#fff" text-anchor="middle">E</text></g>` +
      `<path d="${starPath(60, 52, 2.6, 0.5, 4)}" fill="#fff"/>` +
      sparkle(88, 80, 1.6, P.goldL) + sparkle(60, 26, 1.8, P.goldL) +
      k.defs()
    )
  },
}
