// Pickleball: la paleta lisa de cara rectangular (sin cuerdas, con el canto protector), la pelota amarilla de
// plástico agujereada, la red baja con su cinta, y el pepinillo que le da nombre al juego. La "cocina" (la zona sin
// volea junto a la red) se vuelve cocina de verdad: frasco, vinagre y gorro de chef.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, type Kit } from '../kit'
import { pluma, rotulo, volutas } from './_lote6-piezas'

/** Amarillo apagado de la pelota de plástico. */
const BOLA = '#E5C658', BOLA_D = '#B8902F'
/** Verde del pepinillo en vinagre. */
const PEPINO = '#7E9A4C', PEPINO_D = '#4F6A2C', PEPINO_L = '#B4C67E'
/** Vinagre: un ámbar verdoso, pálido. */
const VINAGRE = '#E2DDA6', VINAGRE_D = '#B9B271'

// ── La pelota agujereada ───────────────────────────────────────────

/** Pelota de pickleball en (x,y) de radio r, con los agujeros que se achatan hacia el borde. */
function bola(k: Kit, x: number, y: number, r: number, rot = 0) {
  const d = ellipse(x, y, r, r)
  // Agujeros en una esfera girada: [latitud, longitud] en grados.
  const holes = [[0, 0], [0, 50], [0, -50], [42, 25], [42, -25], [-42, 25], [-42, -25], [70, 90], [-70, 90], [0, 100], [0, -100], [42, 80], [-42, -80], [42, -80], [-42, 80]]
  const a = (rot * Math.PI) / 180
  const dots = holes.map(([la, lo]) => {
    const L = (la * Math.PI) / 180, O = (lo * Math.PI) / 180
    let px = Math.cos(L) * Math.sin(O), py = -Math.sin(L)
    const pz = Math.cos(L) * Math.cos(O)
    if (pz < 0.12) return ''
    ;[px, py] = [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)]
    const hx = x + px * r * 0.86, hy = y + py * r * 0.86, ang = (Math.atan2(py, px) * 180) / Math.PI
    const rr = r * 0.14
    return `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="${f(rr * Math.max(0.3, pz))}" ry="${f(rr)}" transform="rotate(${f(ang)} ${f(hx)} ${f(hy)})" fill="${BOLA_D}"/>` +
      `<ellipse cx="${f(hx + 0.12 * r * 0.1)}" cy="${f(hy + 0.12 * r * 0.1)}" rx="${f(rr * 0.75 * Math.max(0.3, pz))}" ry="${f(rr * 0.7)}" transform="rotate(${f(ang)} ${f(hx)} ${f(hy)})" fill="#6E5320"/>`
  }).join('')
  return (
    k.draw([{
      d, fill: BOLA,
      inner: dots + k.shade(d, k.rad(BOLA_D, 0.32, 0.28, 0.85, 0, 0.9), BOLA_D, 0.4) + `<path d="${d}" fill="${k.rad('#ffffff', 0.32, 0.28, 0.5, 0.7, 0)}"/>`,
    }], f(Math.min(0.75, 0.25 + r * 0.05))) +
    `<ellipse cx="${f(x - r * 0.42)}" cy="${f(y - r * 0.44)}" rx="${f(r * 0.22)}" ry="${f(r * 0.12)}" fill="#fff" opacity=".9" transform="rotate(-38 ${f(x - r * 0.42)} ${f(y - r * 0.44)})"/>`
  )
}

// ── La paleta: la cara centrada en (0,-13), el mango hasta y=12 ─────────────────────────────

const FACE = 'M-8.6 -22C-8.6 -25.4 -6.4 -27.4 -3 -27.4H3C6.4 -27.4 8.6 -25.4 8.6 -22V-3C8.6 -.8 7 .6 4.6 .6H-4.6C-7 .6 -8.6 -.8 -8.6 -3Z'
const FACE_I = 'M-7.2 -21.8C-7.2 -24.4 -5.6 -26 -3 -26H3C5.6 -26 7.2 -24.4 7.2 -21.8V-3.2C7.2 -1.6 6 -.8 4.4 -.8H-4.4C-6 -.8 -7.2 -1.6 -7.2 -3.2Z'
const HANDLE = 'M-2.4 .2H2.4C2.6 4 2.6 8 2.5 11.6C2.5 12.4 2 12.8 1.4 12.8H-1.4C-2 12.8 -2.5 12.4 -2.5 11.6C-2.6 8 -2.6 4 -2.4 .2Z'

/** Paleta de pickleball entintada con el centro de la cara en (x,y). */
function paleta(k: Kit, x: number, y: number, rot: number, s = 1, o: { face?: string; faceD?: string; over?: string; edge?: string } = {}) {
  const face = o.face ?? P.mid, faceD = o.faceD ?? P.ink
  let hex = ''
  for (let j = 0; j < 9; j++) for (let i = 0; i < 6; i++) {
    const cx = -6.4 + i * 2.6 + (j % 2) * 1.3, cy = -24.6 + j * 2.9
    hex += `M${f(cx - 1.1)} ${f(cy)}L${f(cx - 0.55)} ${f(cy - 0.95)}H${f(cx + 0.55)}L${f(cx + 1.1)} ${f(cy)}L${f(cx + 0.55)} ${f(cy + 0.95)}H${f(cx - 0.55)}Z`
  }
  const wraps = Array.from({ length: 5 }, (_, i) => `M-2.6 ${f(2.2 + i * 2)}L2.6 ${f(3.6 + i * 2)}`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(0 13)">` +
    k.draw([
      { d: HANDLE, fill: P.white, inner: k.sh(HANDLE, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + `<path d="${wraps}" stroke="${P.blue}" stroke-width=".45"/><path d="M-3 11H3V13H-3Z" fill="${o.edge ?? P.night}"/>` },
      {
        d: FACE, fill: o.edge ?? P.night,
        inner: `<path d="${FACE_I}" fill="${face}"/>` + k.clip(FACE_I, `<path d="${hex}" fill="none" stroke="${faceD}" stroke-width=".25" opacity=".45"/>` + k.sh(FACE_I, 0, 0, 1, 1, 0, 0.85, faceD, 0.45) +
          `<path d="M-8 -27H-1.6V0H-8Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.32, 0)}"/>` + (o.over ?? '')) +
          `<path d="${FACE_I}" fill="none" stroke="${P.ink}" stroke-width=".35"/>` +
          `<path d="M-7.9 -21C-7.6 -24.6 -5.6 -26.6 -2.6 -26.8" fill="none" stroke="${P.sky}" stroke-width=".55" stroke-linecap="round"/>`,
      },
    ], f(0.65 / s)) +
    `</g>`
  )
}

// ── El pepinillo: acostado a lo largo del eje x, de -L a L ─────────────────────────────

const pepinoPath = (L: number, w: number) =>
  `M${-L} 0C${-L} ${f(-w * 0.9)} ${f(-L * 0.6)} ${-w} 0 ${f(-w * 1.04)}C${f(L * 0.6)} ${f(-w * 1.08)} ${L} ${f(-w * 0.8)} ${L} 0C${L} ${f(w * 0.85)} ${f(L * 0.6)} ${f(w * 0.96)} 0 ${f(w * 0.92)}C${f(-L * 0.6)} ${f(w * 0.9)} ${-L} ${f(w * 0.85)} ${-L} 0Z`
function pepino(k: Kit, x: number, y: number, rot: number, L = 14, w = 5, o: { bend?: number } = {}) {
  const d = pepinoPath(L, w)
  const warts = [[-0.7, -0.4], [-0.45, 0.3], [-0.2, -0.55], [0.05, 0.1], [0.3, -0.45], [0.5, 0.4], [0.7, -0.15], [-0.85, 0.15], [0.15, 0.6], [-0.1, -0.15]]
    .map(([a, b]) => `<circle cx="${f(a * L)}" cy="${f(b * w)}" r="${f(w * 0.12)}" fill="${PEPINO_D}"/><circle cx="${f(a * L - w * 0.04)}" cy="${f(b * w - w * 0.05)}" r="${f(w * 0.06)}" fill="${PEPINO_L}"/>`).join('')
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})${o.bend ? ` skewY(${o.bend})` : ''}">` +
    k.draw([{
      d, fill: PEPINO,
      inner: k.sh(d, 0, 0, 0, 1, 0, 0.9, PEPINO_D, 0.5) + warts +
        hair(-L * 0.8, -w * 0.5, 0, -w * 0.85, L * 0.75, -w * 0.5, w * 0.22, PEPINO_L, 0.9) +
        hair(-L * 0.7, w * 0.35, 0, w * 0.55, L * 0.7, w * 0.35, 0.4, PEPINO_D),
    }], 0.6) +
    `<path d="M${f(L - 0.6)} -.6l${f(w * 0.3)} -${f(w * 0.12)}" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
    `</g>`
  )
}

/** Red baja de pickleball de x0 a x1, cinta arriba en y0 y la malla hasta y1, con la faja del medio. */
function red(k: Kit, x0: number, x1: number, y0: number, y1: number, strap = true) {
  let g = ''
  for (let x = x0 + 1; x < x1; x += 2) g += `M${f(x)} ${f(y0 + 2.4)}V${y1}`
  for (let y = y0 + 4.4; y < y1; y += 2) g += `M${x0} ${f(y)}H${x1}`
  const tape = `M${x0} ${y0}H${x1}V${f(y0 + 3)}H${x0}Z`
  const mid = (x0 + x1) / 2, band = `M${f(mid - 1.4)} ${y0}H${f(mid + 1.4)}V${y1}H${f(mid - 1.4)}Z`
  return (
    `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="${P.night}" opacity=".16"/>` +
    `<path d="${g}" stroke="${P.ink}" stroke-width=".32"/>` +
    k.draw([{ d: tape, fill: P.white, inner: k.sh(tape, 0, 0, 0, 1, 0, 0.7, P.blue, 0.3) }, ...(strap ? [{ d: band, fill: P.white, inner: k.sh(band, 0, 0, 1, 0, 0, 0.6, P.blue, 0.3) }] : [])], 0.45)
  )
}

/** Piso de la cancha visto en perspectiva: verde apagado con la línea de la cocina. */
function cancha(k: Kit, y0: number, line = true) {
  const d = `M0 ${y0}H120V130H0Z`
  return `<path d="${d}" fill="${P.sky}"/>` + k.sh(d, 0, 0, 0, 1, 0, 0.7, P.mid, 0.35) + (line ? `<path d="M0 ${f(y0 + 9)}H120" stroke="#fff" stroke-width="1.2"/>` : '')
}

export const PICKLEBALL_ART: Record<string, (u: number) => string> = {
  // ── Pepinillo ───────────────────────────────────────────────────────

  // Cinco ganados: recién estás macerando. El pepinillo en un vaso de vinagre, con burbujas, y la pelota de bañero.
  'Pepinillo en vinagre': (u) => {
    const k = kit(u)
    const glass = 'M40 44H80L77 88C76.8 91 74.8 92.6 72 92.6H48C45.2 92.6 43.2 91 43 88Z'
    const liquid = 'M41.3 58C48 60 72 60 78.7 58L77 88C76.8 91 74.8 92.6 72 92.6H48C45.2 92.6 43.2 91 43 88Z'
    const surf = ellipse(60, 58, 18.7, 2.4)
    const bubbles = [[50, 80, 1.4], [54, 72, 1], [66, 84, 1.2], [70, 74, 0.9], [62, 66, 1.1], [47, 66, 0.8], [72, 64, 0.7]]
    return (
      k.day() +
      k.sun(60, 50, 20, 44, 28, false) +
      k.floor(61, 93, 21, 2.4, P.mid) +
      k.draw([{ d: glass, fill: P.sky1 }], 0.7) +
      `<path d="${glass}" fill="${P.white}" opacity=".5"/>` +
      `<path d="${liquid}" fill="${VINAGRE}"/>` + k.clip(liquid, k.sh(liquid, 0, 0, 1, 0, 0, 0.8, VINAGRE_D, 0.45) +
        pepino(k, 58, 77, -64, 15, 5.2) + `<path d="${liquid}" fill="${VINAGRE}" opacity=".35"/>`) +
      bubbles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P.white}" stroke-width=".5"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${f(r * 0.3)}" fill="#fff"/>`).join('') +
      `<path d="${surf}" fill="${VINAGRE}" stroke="${VINAGRE_D}" stroke-width=".5"/>` +
      bola(k, 71, 55.4, 6.2, 20) +
      `<path d="M64 57.4C66 59 76 59 78 57.4" fill="none" stroke="${VINAGRE_D}" stroke-width=".5"/>` +
      `<path d="${ellipse(60, 44, 20, 2.4)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M44.6 48L46.6 86" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/><path d="M48.4 50L49.4 64" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
      rotulo(60, 38, 6.4, 'macerando…', { rot: -4 }) +
      sparkle(86, 66, 1.8) + sparkle(34, 70, 1.4) +
      k.defs()
    )
  },

  // Veinte: la alacena llena. Un frasco de conserva lleno de pelotas, con el pepinillo, la tela a cuadros y la etiqueta.
  'Frasco de conserva': (u) => {
    const k = kit(u)
    const jar = 'M44 40H76V44C80 46 82 50 82 56V84C82 89 79 92 74 92H46C41 92 38 89 38 84V56C38 50 40 46 44 44Z'
    const inside = 'M45.4 45.4H74.6C78.4 47.4 80.2 51 80.2 56V84C80.2 88 77.8 90.4 74 90.4H46C42.2 90.4 39.8 88 39.8 84V56C39.8 51 41.6 47.4 45.4 45.4Z'
    const cloth = 'M40.4 37.6C44 31 76 31 79.6 37.6L82 44C76 46.4 70 43 66 45.6C62 43.6 58 46.4 54 45.6C50 43 44 46.4 38 44Z'
    const shelf = 'M22 92H98V97H22Z'
    const label = roundRect(46, 66, 74, 78, 1.4)
    let check = ''
    for (let i = 0; i < 12; i++) check += `M${f(36 + i * 4)} 30V48`
    for (let j = 0; j < 5; j++) check += `M34 ${f(32 + j * 4)}H86`
    return (
      k.day() +
      k.stage(60, 60, 34) +
      k.draw([{ d: shelf, fill: P.brown, inner: k.sh(shelf, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M22 93H98" stroke="${P.goldL}" stroke-width=".4" opacity=".7"/>` }], 0.6) +
      k.floor(60, 92, 22, 1.6, P.brownD) +
      k.draw([{ d: jar, fill: P.sky1 }], 0.7) +
      `<path d="${inside}" fill="${VINAGRE}" opacity=".7"/>` +
      k.clip(inside,
        bola(k, 50, 83, 7, 10) + bola(k, 69, 82, 7.4, -20) + pepino(k, 60, 70, -78, 14, 4.6) + bola(k, 49, 64, 6.6, 40) + bola(k, 71, 62, 6.8, -5) + bola(k, 59, 52, 6, 15) +
        `<path d="${inside}" fill="${VINAGRE}" opacity=".22"/>` + k.sh(inside, 0, 0, 1, 0, 0, 0.5, P.blue, 0.25)) +
      k.draw([{ d: label, fill: P.paper, inner: k.sh(label, 0, 0, 1, 0, 0, 0.5, P.goldD, 0.3) + `<rect x="47.2" y="67.2" width="25.6" height="9.6" rx=".8" fill="none" stroke="${P.red}" stroke-width=".4"/>` }], 0.45) +
      `<text x="60" y="74.4" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="5.6" fill="${P.ink}" text-anchor="middle">pickles</text>` +
      `<path d="M40.4 52C40 60 40.4 76 41.4 86" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/><path d="M76 50C78 54 78.6 58 78.6 62" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` +
      `<path d="${jar}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([{ d: cloth, fill: P.white, inner: k.clip(cloth, `<path d="${check}" stroke="${P.red}" stroke-width="2" opacity=".75"/>`) + k.sh(cloth, 0, 0, 1, 1, 0, 0.7, P.wine, 0.35) }], 0.6) +
      `<path d="M38.6 41.4C48 43.6 72 43.6 81.4 41.4" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M38.6 41.4C48 43.6 72 43.6 81.4 41.4" fill="none" stroke="${P.goldL}" stroke-width=".7"/>` +
      `<path d="M80.6 41.4C82.6 44 83 47 81.6 49.6M80.6 41.4C83.6 42.6 85.4 44.6 85.6 47" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M80.6 41.4C82.6 44 83 47 81.6 49.6M80.6 41.4C83.6 42.6 85.4 44.6 85.6 47" fill="none" stroke="${P.goldL}" stroke-width=".6" stroke-linecap="round"/>` +
      sparkle(32, 46, 1.8) + sparkle(88, 70, 1.6) +
      k.defs()
    )
  },

  // Cincuenta: nadie pisa tu cocina sin permiso. El gorro de chef, con dos paletas cruzadas detrás como cucharones.
  'Chef de la cocina': (u) => {
    const k = kit(u)
    const puff = 'M44 58C38 57 35 51 37.4 46C39.4 41.6 44 40 47.6 41.4C48.6 35.4 54 31.6 60 31.6C66 31.6 71.4 35.4 72.4 41.4C76 40 80.6 41.6 82.6 46C85 51 82 57 76 58Z'
    const band = 'M45 56H75L74 70C74 71.6 72.6 72.6 71 72.6H49C47.4 72.6 46 71.6 46 70Z'
    return (
      k.night() +
      k.sun(60, 54, 18, 46, 32) +
      laurel(48, 100, 28, 92, 26, 60, 7) + laurel(72, 100, 92, 92, 94, 60, 7, true) +
      paleta(k, 38, 54, -42, 1.2, { face: P.sky, faceD: P.mid }) +
      paleta(k, 82, 54, 42, 1.2, { face: P.sky, faceD: P.mid }) +
      k.floor(60, 76, 18, 2.4, P.night) +
      k.draw([
        { d: band, fill: P.white, inner: k.sh(band, 0, 0, 1, 0, 0, 0.85, P.blue, 0.45) + [50, 55, 60, 65, 70].map((x) => hair(x, 58, x + 0.4, 64, x, 70.4, 0.6, P.sky2)).join('') + `<path d="M46 66.4H74V68.6H46Z" fill="${P.gold}"/><path d="M46 66.4H74" stroke="${P.goldD}" stroke-width=".4"/>` },
        {
          d: puff, fill: P.white,
          inner: k.sh(puff, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + hair(48, 42, 50, 48, 49, 55, 0.7, P.sky2) + hair(60, 33, 62, 44, 60, 55, 0.7, P.sky2) + hair(72, 42, 70, 48, 71, 55, 0.7, P.sky2) +
            hair(40, 47, 41, 43, 45, 42, 0.7, '#fff') + hair(52, 36, 56, 33, 61, 33, 0.8, '#fff'),
        },
      ], 0.7) +
      `<path d="M45 56.4C52 58 68 58 75 56.4" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      bola(k, 60, 82, 6, 25) +
      `<path d="${starPath(60, 47, 3, 1.2, 5)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      volutas(60, 97, 16, 0.42) +
      sparkle(34, 36, 2.2, P.goldL) + sparkle(86, 34, 2, P.goldL) + sparkle(80, 86, 1.4, '#fff') +
      k.defs()
    )
  },

  // ── Mano suave ─────────────────────────────────────────────────────

  // Tres dinks: la pelota bajó como una pluma. Cae meciéndose junto a una pluma, justo pasando la red.
  'Pluma': (u) => {
    const k = kit(u)
    const path = 'M30 30C42 28 46 38 54 40C62 42 64 48 68 54'
    return (
      k.day() +
      cancha(k, 76) +
      red(k, 16, 104, 64, 77) +
      `<path d="${path}" fill="none" stroke="${P.mid}" stroke-width=".8" stroke-dasharray="1.2 1.6" stroke-linecap="round"/>` +
      pluma(k, 44, 58, 24, 23, 5.6) +
      k.floor(71, 82.4, 7.4, 1.3, P.ink) +
      bola(k, 70, 67.4, 8.4, 30) +
      hair(59.6, 62, 58.6, 65, 59.2, 68.4, 0.6) + hair(80.6, 62, 81.6, 65, 81, 68.4, 0.6) +
      rotulo(84, 42, 7, 'shh…', { rot: 8 }) +
      sparkle(34, 66, 1.4) +
      k.defs()
    )
  },

  // Quince dinks: delicadeza de relojero. El guante blanco de seda que toma la paleta apenas, con la pelota quieta
  // sobre la cara, y el tic tac del relojero.
  'Guante de seda': (u) => {
    const k = kit(u)
    const heel = 'M46.4 66C46.4 63.4 48.4 62 50.6 62H55V82.6H50.4C48 82.6 46.4 81 46.4 78.6Z'
    const fingers = [0, 1, 2, 3].map((i) => roundRect(f(50.4 + i * 0.5), f(63.4 + i * 4.3), f(71.4 - i * 1.1), f(67.8 + i * 4.3), 2.2))
    const thumb = 'M47.6 71.4C48.4 66.4 53.4 62.6 61.4 62.2C64.6 62 65.6 63.6 65.2 65C64.8 66.4 63.4 66.8 61.6 66.8C56.4 67 52.6 69 50.6 72.6C49.6 74.2 47.4 73.6 47.6 71.4Z'
    const cuff = 'M47.4 81.6C53 80.2 65 80.2 70.4 81.6L72.6 92C66 90.4 52 90.4 45.2 92Z'
    return (
      k.day() +
      k.stage(60, 56, 34) +
      paleta(k, 60, 50, 0, 1.3) +
      k.floor(60, 49.4, 7, 1.2, P.night) +
      bola(k, 60, 42.6, 7, 14) +
      k.draw([
        { d: cuff, fill: P.white, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M46.6 84.6C53 83.2 65 83.2 71 84.6" fill="none" stroke="${P.blue}" stroke-width=".4" stroke-dasharray=".6 .7"/>` + `<path d="M56 82V91M60 82V91M64 82V91" stroke="${P.sky2}" stroke-width=".6"/>` },
        { d: heel, fill: P.white, inner: k.sh(heel, 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) },
        ...fingers.map((d) => ({ d, fill: P.white, inner: k.sh(d, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M50 60H62V84H50Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` })),
        { d: thumb, fill: P.white, inner: k.sh(thumb, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + hair(51, 69, 54, 65.4, 61, 64, 0.7, '#fff') },
      ], 0.6) +
      fingers.map((_, i) => hair(66.6 - i * 1.1, 64.6 + i * 4.3, 69 - i * 1.1, 65.6 + i * 4.3, 70 - i * 1.1, 67 + i * 4.3, 0.5, P.blue)).join('') +
      `<circle cx="66" cy="86.6" r="1.3" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="65.6" cy="86.2" r=".4" fill="#fff"/>` +
      rotulo(84, 40, 6.4, 'tic', { rot: 10 }) + rotulo(36, 46, 6.4, 'tac', { rot: -10 }) +
      sparkle(76, 28, 2) + sparkle(42, 30, 1.6) + sparkle(82, 74, 1.4) +
      k.defs()
    )
  },


  // Cuarenta dinks: a corazón abierto sobre la red. El bisturí, la pelota operada con sus puntos y el pulso en oro.
  'Cirujano de la red': (u) => {
    const k = kit(u)
    const ecg = 'M14 46H38L41 40L44 50L48 26L52 60L55 44L58 46H70'
    const blade = 'M0 0C4 -1.4 9.6 -1.6 14 -.4C11.4 1.6 6.6 2.6 0 2.4Z'
    const shaft = roundRect(-22, -.4, 0.6, 2.6, 1.2)
    return (
      k.night() +
      `<path d="${ecg}" fill="none" stroke="${P.gold}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/>` +
      `<path d="${ecg}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-linejoin="round"/>` +
      `<path d="M70 46H106" fill="none" stroke="${P.gold}" stroke-width="1" opacity=".5" stroke-dasharray="1.2 1.4"/>` +
      `<path d="M14 78H106V130H14Z" fill="${P.mid}"/>` + k.sh('M14 78H106V100H14Z', 0, 0, 0, 1, 0, 0.6, P.night, 0.4) +
      red(k, 14, 106, 66, 80) +
      k.floor(60, 66, 9, 1.4, P.ink) +
      bola(k, 60, 58.6, 8.6, 18) +
      `<path d="M52.6 55L67.4 62" stroke="${P.red}" stroke-width=".9" stroke-linecap="round"/>` +
      [0.15, 0.35, 0.55, 0.75].map((t) => { const x = 52.6 + 14.8 * t, y = 55 + 7 * t; return `<path d="M${f(x - 1)} ${f(y + 1.8)}L${f(x + 1)} ${f(y - 1.8)}" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` }).join('') +
      `<g transform="translate(73 38) rotate(28)">` +
      k.draw([
        { d: shaft, fill: P.sky1, inner: k.sh(shaft, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M-20 .6H-3" stroke="${P.blue}" stroke-width=".3"/><path d="M-19 1.6H-4" stroke="${P.blue}" stroke-width=".3" stroke-dasharray=".5 .5"/>` },
        { d: blade, fill: P.white, inner: k.sh(blade, 0, 0, 0, 1, 0, 0.7, P.blue, 0.4) + `<path d="M1 .2C5 -.8 9 -1 12.6 -.4" stroke="#fff" stroke-width=".5"/>` },
      ], 0.5) +
      `</g>` +
      sparkle(86, 32, 2.2, P.goldL) + sparkle(36, 64, 1.6, '#fff') + sparkle(78, 52, 1.6, '#fff') +
      volutas(60, 92, 20, 0.45) +
      k.defs()
    )
  },
}
