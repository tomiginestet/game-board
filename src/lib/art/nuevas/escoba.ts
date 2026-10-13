// Escoba de 15. Color propio: el mostaza de la ficha (#C9A227), en el papel granulado del fondo de todas las medallas
// y en la paja de las escobas. Los naipes son españoles de verdad: oros, copas, espadas y bastos, con la pinta en el marco.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

/** Mostaza de la ficha, con su sombra y su luz. */
const MUST = '#C9A227', MUST_D = '#8A6A12', MUST_L = '#EAD27C'
/** Noche ocre: el mostaza de la ficha llevado a la oscuridad (cielo de bruja y de tormenta). */
const OCHRE_N = '#2F2508', OCHRE_M = '#5C4812'
const FULL = 'M0 0H120V130H0Z'
const GEO = 'font-family="Georgia, serif"'

/** Fondo de la escoba: papel con el mostaza de la ficha granulado hacia los bordes y el filete punteado. */
const field = (k: Kit) =>
  `<rect width="120" height="130" fill="${MUST_L}"/>` +
  k.shade(FULL, k.rad(P.paper, 0.5, 0.46, 0.5, 1, 0), P.paper, 0.6) +
  k.shade(FULL, k.rad(MUST, 0.5, 0.46, 0.7, 0, 0.9), MUST, 0.45) +
  `<circle cx="60" cy="60" r="38.4" fill="none" stroke="${MUST_D}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round" opacity=".55"/>`

/** Escenario: un disco claro de mostaza con el borde granulado. */
const stage = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.white}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(MUST_L, 0.5, 0.5, 0.5, 0, 1), MUST_L, 0.55) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${MUST_D}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

// ── Naipe español ────────────────────────────────────────────────────

type Palo = 'oros' | 'copas' | 'espadas' | 'bastos'

/** Figura de un palo centrada en (x,y). Se dibuja en un espacio de ±12 y se escala por r/10 (r = radio del oro). */
function pip(palo: Palo, x: number, y: number, r: number, rot = 0): string {
  const s = r / 10
  const o = `stroke="${P.ink}" stroke-width="${f((0.2 + 0.08 * r) / s)}" stroke-linejoin="round"`
  let g = ''
  if (palo === 'oros') {
    const ticks = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return `M${f(Math.cos(a) * 7.4)} ${f(Math.sin(a) * 7.4)}L${f(Math.cos(a) * 9.2)} ${f(Math.sin(a) * 9.2)}`
    }).join('')
    g =
      `<circle r="10" fill="${P.gold}" ${o}/>` +
      `<path d="${ticks}" stroke="${P.goldD}" stroke-width="1.1"/>` +
      `<circle r="7" fill="${P.goldL}" stroke="${P.goldD}" stroke-width="1"/>` +
      `<path d="${starPath(0, 0, 5.8, 3, 8, -90)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".8"/>` +
      `<circle r="2.2" fill="${P.red}" stroke="${P.ink}" stroke-width=".7"/>` +
      `<path d="M-7.6 -2.6A8 8 0 0 1 -2.6 -7.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>`
  } else if (palo === 'copas') {
    const bowl = 'M-9 -9.6C-9 -3.6 -6 -.6 0 -.4C6 -.6 9 -3.6 9 -9.6Z'
    const foot = 'M-1.2 5.2C-2 7.8 -5.2 8.8 -6.4 11.2H6.4C5.2 8.8 2 7.8 1.2 5.2Z'
    g =
      `<path d="${foot}" fill="${P.gold}" ${o}/>` +
      `<path d="M-1.4 -.6H1.4L1.2 5.4H-1.2Z" fill="${P.gold}" ${o}/>` +
      `<path d="${ellipse(0, 2.4, 2.8, 1.4)}" fill="${P.gold}" ${o}/>` +
      `<path d="${bowl}" fill="${P.gold}" ${o}/>` +
      `<path d="M-8.9 -6.8C-3 -5.6 3 -5.6 8.9 -6.8L8.6 -5C3 -3.8 -3 -3.8 -8.6 -5Z" fill="${P.red}"/>` +
      `<path d="${ellipse(0, -9.6, 9, 2.1)}" fill="${P.red}" ${o}/>` +
      `<path d="${ellipse(0, -9.2, 6.6, 1.2)}" fill="${P.wine}"/>` +
      `<path d="M-6.8 -4.4C-6 -2.8 -4.6 -1.8 -3 -1.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>`
  } else if (palo === 'espadas') {
    g =
      `<path d="M0 -13.6L1.9 -11L1.7 3.6H-1.7L-1.9 -11Z" fill="${P.sky}" ${o}/>` +
      `<path d="M0 -12.4V3" stroke="${P.blue}" stroke-width=".7"/><path d="M-.9 -10.4V2.6" stroke="#fff" stroke-width=".6" opacity=".7"/>` +
      `<path d="M-6.4 3C-4.2 5 4.2 5 6.4 3C7.8 2.2 8.6 3.8 7.4 4.8C5 7 -5 7 -7.4 4.8C-8.6 3.8 -7.8 2.2 -6.4 3Z" fill="${P.gold}" ${o}/>` +
      `<path d="M-1.2 6.4H1.2V10.4H-1.2Z" fill="${P.red}" ${o}/>` +
      `<circle cy="11.6" r="1.8" fill="${P.gold}" ${o}/>`
  } else {
    const body = 'M-1.6 12.4C-2 6 -3.2 -.4 -4 -6.2C-4.6 -10.4 -3 -12.8 0 -12.8C3 -12.8 4.6 -10.4 4 -6.2C3.2 -.4 2 6 1.6 12.4Z'
    g =
      `<path d="M-3.4 -2.6L-7.6 -5.6" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M-3.4 -2.6L-7.6 -5.6" stroke="${P.brown}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<path d="${body}" fill="${P.brown}" ${o}/>` +
      `<path d="M1.4 -11.6C3.6 -8 3.2 0 1.2 11" fill="none" stroke="${P.brownD}" stroke-width="1.6" opacity=".7"/>` +
      `<path d="${ellipse(0, -11.4, 3, 1.1)}" fill="${P.goldL}" stroke="${P.brownD}" stroke-width=".5"/>` +
      `<path d="M2 -9.4C4.4 -12 7.4 -11.8 8.2 -10C6 -8.4 3.6 -8.4 2 -9.4Z" fill="${P.green}" stroke="${P.ink}" stroke-width=".6"/>`
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${f(s * 100) / 100})">${g}</g>`
}

const CARD = roundRect(-6.4, -9.8, 6.4, 9.8, 1.2)
const PINTA: Record<Palo, number> = { oros: 0, copas: 1, espadas: 2, bastos: 3 }
const SPOTS: number[][][] = [
  [],
  [[0, 0]],
  [[0, -4.6], [0, 4.6]],
  [[0, -5.2], [0, 0], [0, 5.2]],
  [[-2.4, -4.4], [2.4, -4.4], [-2.4, 4.4], [2.4, 4.4]],
  [[-2.4, -4.8], [2.4, -4.8], [0, 0], [-2.4, 4.8], [2.4, 4.8]],
  [[-2.4, -4.8], [2.4, -4.8], [-2.4, 0], [2.4, 0], [-2.4, 4.8], [2.4, 4.8]],
  [[-2.4, -5.2], [2.4, -5.2], [0, -2.6], [-2.4, 0.2], [2.4, 0.2], [-2.4, 5.2], [2.4, 5.2]],
]
const PIP_R = [0, 4, 1.9, 1.7, 1.6, 1.5, 1.4, 1.3]
const PIP_K: Record<Palo, number> = { oros: 1, copas: 1.15, espadas: 1.05, bastos: 1.1 }

/** Naipe español centrado en (0,0) (12.8 × 19.6): marco con la pinta del palo, número en las esquinas y las figuras. */
function naipe(k: Kit, palo: Palo, n: number, t: string, w = 0.5): string {
  const g = PINTA[palo]
  const gaps = Array.from({ length: g }, (_, i) => {
    const x = -2 + ((i + 1) * 7.4) / (g + 1)
    return `M${f(x - 0.6)} -8.8H${f(x + 0.6)}M${f(-x - 0.6)} 8.8H${f(-x + 0.6)}`
  }).join('')
  const idx = (rot: number) =>
    `<g transform="rotate(${rot})"><path d="M-6.4 -9.8H-2.6V-5.2H-6.4Z" fill="${P.white}"/>` +
    `<text x="-4.5" y="-5.9" ${GEO} font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">${n}</text></g>`
  const r = PIP_R[n] * PIP_K[palo]
  const tilt = palo === 'espadas' || palo === 'bastos'
  const pips = SPOTS[n].map(([x, y], i) => pip(palo, x, y, r, tilt && n > 1 ? (i % 2 ? 22 : -22) : 0)).join('')
  return (
    `<g transform="${t}">` +
    k.draw([{
      d: CARD, fill: P.white,
      inner:
        `<path d="${roundRect(-5.4, -8.8, 5.4, 8.8, 0.5)}" fill="none" stroke="${P.ink}" stroke-width=".3"/>` +
        (gaps ? `<path d="${gaps}" stroke="${P.white}" stroke-width=".9"/>` : '') +
        idx(0) + idx(180) + pips +
        k.sh('M1 -11H8V11H1Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3),
    }], w) +
    `</g>`
  )
}

// ── Piezas ───────────────────────────────────────────────────────────

/** Cabeza de plumero: un bulbo de plumas esponjoso con la base en (0,0) y la punta hacia arriba (y negativa). */
function duster(k: Kit) {
  const N = 96, cy = -16, rx = 14.6, ry = 16.8
  const at = (a: number, s = 1) => {
    const bump = 1 + 0.07 * Math.sin(a * 11) + 0.05 * Math.sin(a * 23 + 1) + 0.03 * Math.sin(a * 37)
    const pinch = 1 - 0.55 * Math.pow(Math.max(0, Math.sin(a)), 2)
    return [Math.cos(a) * rx * bump * pinch * s, cy + Math.sin(a) * ry * bump * s]
  }
  const outline = (s: number, dx = 0, dy = 0) => 'M' + Array.from({ length: N }, (_, i) => { const [x, y] = at((i / N) * Math.PI * 2, s); return `${f(x + dx)} ${f(y + dy)}` }).join('L') + 'Z'
  const body = outline(1), back = outline(1.06, 0.8, 0.6), light = outline(0.66, -3.4, -3.6)
  // Plumas enruladas: trazos cortos que salen del centro hacia afuera y se doblan en la punta.
  const wisps = Array.from({ length: 70 }, (_, i) => {
    const a = i * 2.39996, rr = 0.25 + 0.7 * Math.sqrt(((i * 37) % 70) / 70), [px, py] = at(a, rr), [qx, qy] = at(a + 0.25, rr + 0.2)
    return hair(px, py, (px + qx) / 2 + Math.sin(a) * 1.2, (py + qy) / 2 - Math.cos(a) * 1.2, qx, qy, 0.42, i % 3 ? MUST_D : P.brownD, 0.7)
  }).join('') + [-2.2, -1.6, -1, -0.5].map((a) => { const [ex, ey] = at(a, 0.8); return hair(0, -1, ex * 0.4, (ey - 1) * 0.6, ex, ey, 0.4, P.brownD, 0.6) }).join('')
  const fringe = Array.from({ length: 34 }, (_, i) => {
    const a = -Math.PI * 1.02 + (i / 33) * Math.PI * 1.04, [x, y] = at(a, 0.98), [ox, oy] = at(a, 1.14)
    return hair(x, y, (x + ox) / 2 + Math.cos(a * 3) * 1.2, (y + oy) / 2, ox, oy, 0.4, i % 2 ? MUST_D : P.brownD, 0.85)
  }).join('')
  return (
    k.draw([{ d: back, fill: MUST_D }], 0.5) +
    k.draw([{
      d: body, fill: MUST,
      inner: `<path d="${light}" fill="${MUST_L}" opacity=".9"/>` + k.shade(light, k.rad('#ffffff', 0.4, 0.4, 0.5, 0.6, 0), '#ffffff', 0.3) +
        k.sh(body, 0, 0, 1, 1, 0, 0.75, MUST_D, 0.45) + wisps,
    }], 0.6) +
    fringe
  )
}

/** Moneda del siete de oro, de frente: canto moleteado, anillo de puntos, rosetón de ocho puntas y el 7. Centro (0,0). */
function oroCoin(k: Kit, r: number) {
  const face = ellipse(0, 0, r, r)
  const s = r / 10
  const mill = Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return `M${f(Math.cos(a) * r * 0.9)} ${f(Math.sin(a) * r * 0.9)}L${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}` }).join('')
  const dots = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return `<circle cx="${f(Math.cos(a) * r * 0.8)}" cy="${f(Math.sin(a) * r * 0.8)}" r="${f(0.32 * s)}" fill="${P.goldD}"/>` }).join('')
  return (
    k.draw([{
      d: face, fill: P.gold,
      inner: `<path d="${mill}" stroke="${P.goldD}" stroke-width="${f(0.4 * s)}"/>` + k.sh(face, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) +
        `<path d="${ellipse(0, 0, r * 0.88, r * 0.88)}" fill="none" stroke="${P.ink}" stroke-width="${f(0.35 * s)}"/>` +
        `<path d="${ellipse(0, 0, r * 0.7, r * 0.7)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width="${f(0.5 * s)}"/>` + dots +
        `<path d="${starPath(0, 0, r * 0.62, r * 0.34, 8, -90)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${f(0.45 * s)}"/>` +
        k.sh(ellipse(0, 0, r * 0.7, r * 0.7), 0, 0, 1, 1, 0, 0.6, P.goldD, 0.35) +
        `<circle r="${f(r * 0.3)}" fill="${P.goldL}" stroke="${P.goldD}" stroke-width="${f(0.4 * s)}"/>` +
        `<text x="0" y="${f(r * 0.17)}" ${GEO} font-weight="700" font-size="${f(r * 0.5)}" fill="${P.red}" text-anchor="middle">7</text>` +
        `<path d="M${f(-r * 0.78)} ${f(-r * 0.3)}A${f(r * 0.84)} ${f(r * 0.84)} 0 0 1 ${f(-r * 0.3)} ${f(-r * 0.78)}" fill="none" stroke="#fff" stroke-width="${f(1.2 * s)}" stroke-linecap="round" opacity=".85"/>`,
    }], f(0.7 * Math.max(s, 0.6)))
  )
}

/** Lingote: prisma trapecial dorado con el 7 y el oro estampados. Esquina de abajo a la izquierda del frente en (x,y). */
function ingot(k: Kit, x: number, y: number, w: number, h: number, dx = 2.6, dy = -2.6) {
  const i = 1.6
  const front = `M${x} ${y}H${f(x + w)}L${f(x + w - i)} ${f(y - h)}H${f(x + i)}Z`
  const top = `M${f(x + i)} ${f(y - h)}H${f(x + w - i)}L${f(x + w - i + dx)} ${f(y - h + dy)}H${f(x + i + dx)}Z`
  const side = `M${f(x + w)} ${y}L${f(x + w + dx)} ${f(y + dy)}L${f(x + w - i + dx)} ${f(y - h + dy)}L${f(x + w - i)} ${f(y - h)}Z`
  const mx = x + w / 2
  return k.draw([
    { d: side, fill: P.goldD, inner: k.sh(side, 0, 0, 1, 0, 0, 0.6, P.brownD, 0.4) },
    { d: top, fill: P.goldL, inner: k.sh(top, 0, 0, 1, 0, 0, 0.5, P.gold, 0.4) + `<path d="M${f(x + i + 1)} ${f(y - h - 0.6)}H${f(x + w - i - 2)}" stroke="#fff" stroke-width=".5" opacity=".9"/>` },
    {
      d: front, fill: P.gold,
      inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) +
        `<path d="${roundRect(f(mx - w * 0.3), f(y - h * 0.78), f(mx + w * 0.3), f(y - h * 0.2), 0.6)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` +
        `<text x="${f(mx - w * 0.1)}" y="${f(y - h * 0.3)}" ${GEO} font-weight="700" font-size="${f(h * 0.5)}" fill="${P.goldD}" text-anchor="middle">7</text>` +
        `<circle cx="${f(mx + w * 0.16)}" cy="${f(y - h * 0.5)}" r="${f(h * 0.17)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/><circle cx="${f(mx + w * 0.16)}" cy="${f(y - h * 0.5)}" r="${f(h * 0.06)}" fill="${P.goldD}"/>`,
    },
  ], 0.5)
}

export const ESCOBA_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Barrendero ─────────────────────────────────────────────────────

  // Diez escobas: dejaste la vereda impecable. El escobillón sobre las baldosas, con los naipes barridos en un montoncito.
  'Escobillón': (u) => {
    const k = kit(u)
    const floor = ellipse(60, 81, 33, 11.6)
    const ys = [69, 72.2, 76, 80.6, 86, 92.4]
    const xa = (i: number, y: number) => 60 + i * 7 * (0.66 + ((y - 69) / 24) * 0.6)
    let grid = ys.map((y) => `M20 ${y}H100`).join('')
    for (let i = -6; i <= 6; i++) grid += `M${f(xa(i, 69))} 69L${f(xa(i, 94))} 94`
    let dots = ''
    for (let r = 0; r < ys.length - 1; r++) for (let i = -6; i < 6; i++) {
      const y0 = ys[r], y1 = ys[r + 1]
      for (const [p, q] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]) {
        const y = y0 + (y1 - y0) * q, x = xa(i, y) + (xa(i + 1, y) - xa(i, y)) * p
        dots += `<rect x="${f(x - 0.55)}" y="${f(y - 0.4)}" width="1.1" height=".8" rx=".3" fill="${MUST}" opacity=".8"/>`
      }
    }
    const block = 'M40.6 69.6H75.4V74.6H40.6Z', blockTop = 'M40.6 69.6L43.4 66.6H78.2L75.4 69.6Z', blockSide = 'M75.4 69.6L78.2 66.6V71.6L75.4 74.6Z'
    const bristle = 'M41.2 74.6H75L76.6 81.4C64 82.6 52 82.6 39.8 81.4Z'
    const fibers = Array.from({ length: 30 }, (_, i) => { const t = i / 29, x = 41.6 + t * 33; return hair(x, 75, x + (t - 0.5) * 0.6, 78, x + (t - 0.5) * 2.6, 81.6, 0.45, i % 3 ? MUST_D : P.brownD, 0.8) }).join('')
    const handle = taper(60.6, 67.4, 69.4, 49, 76.2, 31.6, 3.4, 2.8)
    const pile = [
      naipe(k, 'bastos', 4, 'translate(37.6 77) scale(1 .62) rotate(-62) scale(1.06)'),
      naipe(k, 'copas', 3, 'translate(43.6 80.4) scale(1 .62) rotate(24) scale(1.06)'),
      naipe(k, 'espadas', 5, 'translate(39.6 72.8) scale(1 .62) rotate(-14) scale(1.06)'),
      naipe(k, 'oros', 7, 'translate(45.4 75.8) scale(1 .62) rotate(52) scale(1.06)'),
    ].join('')
    return (
      field(k) +
      stage(k, 60, 56, 30) +
      k.draw([{ d: floor, fill: P.white, inner: `<path d="${grid}" stroke="${MUST_D}" stroke-width=".4" opacity=".8"/>` + dots + k.sh(floor, 0, 0, 0, 1, 0, 0.6, MUST, 0.4) }], 0.6) +
      hair(81, 80, 86, 79.4, 91, 79.6, 0.6, '#fff') + hair(80, 84, 84.6, 83.4, 88.6, 83.8, 0.5, '#fff') +
      k.floor(61, 82.6, 22, 2.6, MUST_D) +
      pile +
      `<circle cx="29.6" cy="68.6" r=".7" fill="${MUST_D}" opacity=".6"/><circle cx="25.6" cy="74.6" r=".5" fill="${MUST_D}" opacity=".5"/><circle cx="29.4" cy="66.6" r=".45" fill="${MUST_D}" opacity=".5"/>` +
      `<g transform="translate(3.4 1.2)">` +
      k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0.1, 0.9, P.brownD, 0.45) + hair(62, 64, 69.6, 48, 75.4, 34, 0.5, P.goldL, 0.8) + hair(63.4, 62, 70.4, 48, 76.6, 34, 0.35, P.brownD, 0.8) }], 0.6) +
      k.draw([{ d: 'M75 30.2L78.2 31.2L77.2 36.4L74.2 35.6Z', fill: P.red, inner: k.sh('M75 30.2L78.2 31.2L77.2 36.4L74.2 35.6Z', 0, 0, 1, 0, 0, 0.8, P.wine, 0.4) }], 0.45) +
      `<circle cx="76.2" cy="32.6" r=".7" fill="${P.ink}"/>` +
      `<path d="M50.4 67.6L66.4 55.6" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/><path d="M50.4 67.6L66.4 55.6" stroke="${P.sky1}" stroke-width=".9" stroke-linecap="round"/>` +
      k.draw([
        { d: bristle, fill: MUST, inner: fibers + k.sh(bristle, 0, 0, 1, 0, 0, 0.7, MUST_D, 0.4) },
        { d: blockSide, fill: P.brownD },
        { d: block, fill: P.brown, inner: k.sh(block, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.4) + hair(42, 72, 58, 71.4, 74, 72.2, 0.4, P.brownD) + `<path d="M44 70.4H58" stroke="${P.goldL}" stroke-width=".5" opacity=".8"/>` },
        { d: blockTop, fill: P.goldL, inner: k.sh(blockTop, 0, 0, 1, 0, 0, 0.6, P.brown, 0.4) },
      ], 0.7) +
      k.draw([{ d: 'M58.4 66.6L59.2 63.4H63.6L64.2 66.6Z', fill: P.sky1, inner: k.sh('M58.4 63H64.4V67H58.4Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.4) }], 0.45) +
      `</g>` +
      sparkle(88, 70, 2.4, '#fff') + sparkle(82, 88, 1.6, '#fff') + sparkle(34, 40, 2) +
      k.defs()
    )
  },

  // Cuarenta escobas: ya barrés la mesa volando. La escoba de bruja cruza la luna llena con naipes enganchados en la paja.
  'Escoba de bruja': (u) => {
    const k = kit(u)
    const moon = ellipse(66, 47, 23, 23)
    const craters = [[76, 55, 4.2], [63.4, 61.6, 2.2], [82, 40, 1.8], [56, 44, 1.3], [70, 32, 1.1], [86.6, 50, 1.2], [72, 44, 0.9]]
      .map(([x, y, r]) => `<path d="${ellipse(x, y, r, r * 0.86)}" fill="${MUST_L}" opacity=".8"/><path d="${ellipse(x + r * 0.15, y + r * 0.15, r * 0.7, r * 0.6)}" fill="${MUST_D}" opacity=".18"/>`).join('')
    const handle = taper(-40, 0, -20, -2, 1.6, 0, 2.6, 3.6)
    const bundle = 'M0 -3.2C8 -4.6 18 -7.6 29.4 -10L30.6 -6.4L29 -3L31.6 .4L29.8 3.6L31 7.2L29.6 9.6C18.6 7.4 8 4.4 0 3.2Z'
    const twigs = Array.from({ length: 15 }, (_, i) => { const t = i / 14 - 0.5; return hair(1, t * 5.6, 15, t * 11, 29.6, t * 18, 0.5, i % 3 ? MUST_D : P.brownD, 0.85) }).join('')
    const stray = hair(22, -7, 28, -11, 34.6, -13.4, 0.5, P.brownD) + hair(24, 6, 30, 9.4, 35, 12.6, 0.5, P.brownD) + hair(26, -2, 31, -2.6, 36, -3.6, 0.45, P.brownD) +
      hair(28, -12.2, 31, -13, 33.4, -15.2, 0.35, P.brownD)
    const bind = (x: number) => `<path d="M${x} -4.2H${f(x + 2.4)}V4.2H${x}Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x} -2.6L${f(x + 2.4)} -3.6M${x} -.4L${f(x + 2.4)} -1.4M${x} 1.8L${f(x + 2.4)} .8M${x} 4L${f(x + 2.4)} 3" stroke="${P.wine}" stroke-width=".4"/>`
    const knots = `<ellipse cx="-28" cy="-1.6" rx="1" ry=".7" fill="${P.brownD}"/><ellipse cx="-14" cy="-1.8" rx="1.2" ry=".8" fill="${P.brownD}"/><path d="M-22 -2.2L-24 -5.4" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-22 -2.2L-24 -5.4" stroke="${P.brown}" stroke-width=".7" stroke-linecap="round"/>`
    return (
      `<rect width="120" height="130" fill="${OCHRE_N}"/>` + k.shade(FULL, k.rad(OCHRE_M, 0.55, 0.38, 0.6, 0.95, 0), OCHRE_M, 0.4) +
      [[28, 34], [40, 24], [90, 26], [30, 66], [94, 64], [44, 86], [84, 88], [36, 48]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 0.5 : 0.75}" fill="${P.paper}"/>`).join('') +
      sparkle(36, 30, 2, P.paper) + sparkle(88, 80, 1.6, P.paper) +
      k.shade(ellipse(66, 47, 36, 36), k.rad(MUST_L, 0.5, 0.5, 0.5, 0.7, 0), MUST_L, 0.35) +
      k.draw([{ d: moon, fill: '#F7ECC6', inner: k.sh(moon, 0, 0, 1, 1, 0, 0.8, MUST_L, 0.5) + craters + `<path d="M45 40H58V72H45Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` }], 0.6) +
      naipe(k, 'oros', 7, 'translate(82 70.4) rotate(-26) scale(.7)') + naipe(k, 'copas', 1, 'translate(76.6 78.8) rotate(18) scale(.66)') +
      `<g transform="translate(62 63.4) rotate(28)">` +
      k.cast([bundle, handle], 2, 2.4, '#1A1404') +
      k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.45) + hair(-37, -1, -19, -2.4, 0, -1.2, 0.45, P.goldL, 0.8) + knots }], 0.6) +
      k.draw([{ d: bundle, fill: MUST, inner: k.sh(bundle, 0, 0, 0, 1, 0, 0.8, MUST_D, 0.45) + twigs + `<path d="M0 -3.2C8 -4.6 18 -7.6 29.4 -10L29 -7C18 -5 8 -2.6 0 -1.6Z" fill="${MUST_L}" opacity=".7"/>` }], 0.65) +
      stray + bind(1.4) + bind(6.4) +
      `</g>` +
      naipe(k, 'espadas', 3, 'translate(46 84) rotate(-34) scale(.62)') +
      hair(70, 84, 64, 86.6, 56, 87.4, 0.5, MUST_L, 0.6) + hair(92, 62, 96, 58, 97, 54, 0.4, MUST_L, 0.5) +
      hair(30, 54, 38, 58, 46, 59, 0.55, MUST_L, 0.6) + hair(26, 60, 34, 63, 42, 63.4, 0.45, MUST_L, 0.5) +
      k.defs()
    )
  },

  // Ciento veinte escobas: el municipio te quiere de jefe de barrido. La escoba de oro, de pie, con su cinta y el sol de Mayo.
  'Barrendero de oro': (u) => {
    const k = kit(u)
    const fan = 'M55.6 63.4C52 72 47.4 82 44.6 92.4C46.2 93.8 48 93 49.4 94.2C51 93 53 94.4 54.6 93.4C56.4 94.6 58.4 93.4 60 94.4C61.6 93.4 63.6 94.6 65.4 93.4C67 94.4 69 93 70.6 94.2C72 93 73.8 93.8 75.4 92.4C72.6 82 68 72 64.4 63.4Z'
    const ferrule = 'M56.4 53.6H63.6L65 63.8H55Z'
    const handle = 'M58 24.4H62L61.7 54.4H58.3Z'
    const fx = (y: number, sd: number) => 60 + sd * (4.6 + ((y - 63.4) / 29) * 10.6)
    const fibers = Array.from({ length: 22 }, (_, i) => { const t = i / 21 - 0.5; return hair(60 + t * 8, 64.4, 60 + t * 14, 78, 60 + t * 29, 93.6, 0.5, i % 4 ? MUST_D : P.brownD, 0.75) }).join('')
    const stitch = (y: number, c: string) =>
      `<path d="M${f(fx(y, -1) + 0.6)} ${y}Q60 ${f(y + 1.8)} ${f(fx(y, 1) - 0.6)} ${y}" fill="none" stroke="${P.ink}" stroke-width="1.6"/><path d="M${f(fx(y, -1) + 0.6)} ${y}Q60 ${f(y + 1.8)} ${f(fx(y, 1) - 0.6)} ${y}" fill="none" stroke="${c}" stroke-width=".8" stroke-dasharray="1.4 .6"/>`
    const spiral = Array.from({ length: 12 }, (_, i) => `M58 ${f(26 + i * 2.4)}L62 ${f(27.6 + i * 2.4)}`).join('')
    const ribbonBack = 'M56 41.2C58 40.6 62 40.6 64 41.2V45.4C62 44.8 58 44.8 56 45.4Z'
    const band = 'M37 42.4C45 40.6 53 39.8 60 40C67 39.8 75 40.6 83 42.4V47.8C75 46 67 45.2 60 45.4C53 45.2 45 46 37 47.8Z'
    const tailL = 'M37 42.4L30.4 44.4L33.4 47L30.6 50.2L37 47.8Z'
    const tailR = 'M83 42.4L89.6 44.4L86.6 47L89.4 50.2L83 47.8Z'
    const rid = k.id('rib')
    return (
      field(k) +
      k.sun(60, 54, 16, 46) +
      k.shade(ellipse(60, 52, 22, 30), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      laurel(50, 99, 29, 90, 26, 62, 8) + laurel(70, 99, 91, 90, 94, 62, 8, true) +
      k.cast([fan, handle, ferrule], 2.2, 2) +
      k.draw([{ d: ribbonBack, fill: P.sky1, inner: k.sh(ribbonBack, 0, 0, 0, 1, 0.3, 0.9, P.blue, 0.4) }], 0.45) +
      k.draw([
        { d: handle, fill: P.gold, inner: k.sh(handle, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="${spiral}" stroke="${P.goldD}" stroke-width=".45"/><path d="M59 25V54" stroke="${P.goldL}" stroke-width=".6"/>` },
        {
          d: fan, fill: MUST,
          inner: k.sh(fan, 0, 0, 1, 0, 0, 0.9, MUST_D, 0.45) + `<path d="M40 60H56V96H40Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.7, 0)}"/>` + fibers +
            k.sh('M40 88H80V96H40Z', 0, 0, 0, 1, 0, 0.6, MUST_D, 0.3),
        },
        { d: ferrule, fill: P.gold, inner: k.sh(ferrule, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M56.6 55.4H63.4M56.4 57.2H63.6M56.2 61.2H63.9M56 62.8H64.2" stroke="${P.goldD}" stroke-width=".4"/><path d="M56.2 58.4H63.8V60.2H56.2Z" fill="${P.red}"/>` },
      ], 0.75) +
      stitch(71, P.red) + stitch(78.4, P.green) + stitch(85.6, P.red) +
      hair(53.6, 70, 52, 80, 49, 90, 0.5, P.goldL, 0.9) +
      k.draw([{ d: 'M57.2 22.8C57.2 20.6 58.4 19.4 60 19.4C61.6 19.4 62.8 20.6 62.8 22.8C62.8 24 61.6 24.6 60 24.6C58.4 24.6 57.2 24 57.2 22.8Z', fill: P.gold, inner: k.sh(ellipse(60, 22, 3, 3), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.4) }], 0.45) +
      `<circle cx="60" cy="22.2" r="1" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/>` +
      k.draw([{ d: band, fill: P.white, inner: k.sh(band, 0, 0, 0, 1, 0, 0.7, P.blue, 0.35) + `<path d="M37 43.6C45 41.8 53 41 60 41.2C67 41 75 41.8 83 43.6M37 46.6C45 44.8 53 44 60 44.2C67 44 75 44.8 83 46.6" fill="none" stroke="${P.sky}" stroke-width=".4"/>` }], 0.5) +
      `<path id="${rid}" d="M39 46.2C47 44.4 54 43.6 60 43.8C66 43.6 73 44.4 81 46.2" fill="none"/>` +
      `<text ${GEO} font-style="italic" font-size="3.5" fill="${P.ink}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">jefe de barrido</textPath></text>` +
      k.draw([{ d: tailL, fill: P.sky1, inner: k.sh(tailL, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) }, { d: tailR, fill: P.sky1, inner: k.sh(tailR, 0, 0, 0, 1, 0.2, 0.9, P.blue, 0.4) }], 0.45) +
      sparkle(60, 13, 3, '#fff') + sparkle(36, 34, 2.2) + sparkle(86, 70, 1.8) +
      k.defs()
    )
  },

  // ── Limpieza a fondo ───────────────────────────────────────────────

  // Tres escobas en una partida: pasaste el plumero por la mesa. El plumero de plumas le saca el polvo al siete de oros.
  'Plumero': (u) => {
    const k = kit(u)
    const handle = taper(0, 2, 0.6, 14, 0, 27, 4.4, 3.4)
    const rings = [8.6, 15.4, 22.2].map((y) => `<path d="M-2.4 ${y}H2.4" stroke="${P.brownD}" stroke-width=".7"/><path d="M-2.2 ${f(y + 0.7)}H2.2" stroke="${P.goldL}" stroke-width=".4"/>`).join('')
    const cuff = 'M-4.4 -1.6C-2 -3 2 -3 4.4 -1.6L3.6 4.4C1.4 5.4 -1.4 5.4 -3.6 4.4Z'
    const puff = (x: number, y: number, s: number) => {
      const d = 'M-6 1.6C-7.6 1.6 -8.2 -.2 -7 -1.4C-7.2 -3.6 -4.8 -4.6 -3.4 -3.4C-2.6 -5.6 .6 -6 1.6 -3.8C3 -5 5.6 -4 5.2 -1.8C7 -1.6 7.4 1.2 5.4 1.6Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, MUST, 0.45) }], f(0.4 / s)) + `</g>`
    }
    return (
      field(k) +
      stage(k, 60, 60, 33) +
      k.floor(76, 92, 8, 1.6, MUST_D) + k.floor(36, 87, 10, 1.8, MUST_D) +
      naipe(k, 'oros', 7, 'translate(37 74.6) rotate(-16) scale(1.08)') +
      puff(33.4, 56.6, 0.6) + puff(46.6, 64.6, 0.5) + puff(31, 46, 0.42) +
      [[34, 50], [26, 62], [40, 58], [30, 38], [48, 68], [38, 42]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${MUST_D}" opacity=".6"/>`).join('') +
      `<g transform="translate(65.4 66.4) rotate(-30) scale(.94)">` +
      k.draw([{ d: handle, fill: P.brown, inner: k.sh(handle, 0, 0, 1, 0, 0.1, 0.9, P.brownD, 0.45) + rings + `<path d="M-1.2 4V29" stroke="${P.goldL}" stroke-width=".6" opacity=".8"/>` }], 0.6) +
      `<path d="M0 28.4C-2.6 32.4 2.6 33.6 1.6 29.6" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M0 28.4C-2.6 32.4 2.6 33.6 1.6 29.6" fill="none" stroke="${P.red}" stroke-width=".6" stroke-linecap="round"/>` +
      `<g transform="scale(1.08)">` + duster(k) + `</g>` +
      k.draw([{ d: cuff, fill: P.red, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.8, P.wine, 0.45) + `<path d="M-4 0C-1.6 -1 1.6 -1 4 0M-3.8 2.4C-1.4 1.6 1.4 1.6 3.8 2.4" fill="none" stroke="${P.goldL}" stroke-width=".45"/>` }], 0.45) +
      `</g>` +
      sparkle(84, 36, 2.2, '#fff') + sparkle(88, 64, 1.6) + sparkle(76, 84, 1.2, '#fff') +
      k.defs()
    )
  },

  // Cinco escobas en una partida: chupás todo lo que se apoya. La aspiradora de lata mostaza se traga los naipes.
  'Aspiradora': (u) => {
    const k = kit(u)
    const body = 'M50 67.6H84A3.4 9.2 0 0 1 84 86H50Z'
    const cap = ellipse(50, 76.8, 4, 9.2)
    const handleTop = 'M60 67.8C60 60.6 76 60.6 76 67.8'
    const hose = 'M45.4 77.4C36 79 28.6 74 29.4 64.6C30.2 56 36 52.6 41.6 51.6'
    const wand = 'M41.2 52L56.6 37.4'
    const nozzle = 'M53.4 33L62.6 41.2L64.6 39.2L55.4 31Z'
    const cards: [Palo, number, number, number, number, number][] = [['oros', 7, 71.6, 30.6, 30, 0.62], ['copas', 4, 82.4, 42.6, -20, 0.7], ['bastos', 5, 77, 56.6, 50, 0.66]]
    return (
      field(k) +
      stage(k, 60, 62, 33) +
      k.floor(66, 89.6, 22, 2.4, MUST_D) +
      cards.map(([p, n, x, y, r, s]) => naipe(k, p, n, `translate(${x} ${y}) rotate(${r}) scale(${s})`)).join('') +
      hair(78, 34, 72, 36, 65, 37, 0.6, MUST_D, 0.8) + hair(86, 48, 76, 46, 66, 41, 0.6, MUST_D, 0.8) + hair(80, 52, 74, 46, 68, 42, 0.45, MUST_D, 0.7) + hair(70, 24, 66, 28, 62.6, 33, 0.5, MUST_D, 0.7) +
      `<path d="M52 89.4H82M52 89.4C50 89.4 48.6 88.4 48.4 86.6" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/><path d="M52 89.4H82M52 89.4C50 89.4 48.6 88.4 48.4 86.6" fill="none" stroke="${P.sky1}" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="${hose}" fill="none" stroke="${P.ink}" stroke-width="5.6" stroke-linecap="round"/><path d="${hose}" fill="none" stroke="${P.sky2}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="${hose}" fill="none" stroke="${P.blue}" stroke-width="4" stroke-dasharray=".6 1.1"/><path d="${hose}" fill="none" stroke="#fff" stroke-width=".7" transform="translate(-.8 -.8)" opacity=".7"/>` +
      `<path d="${wand}" stroke="${P.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="${wand}" stroke="${P.white}" stroke-width="2.2" stroke-linecap="round"/><path d="M42.4 51.4L56 38.4" stroke="${P.sky}" stroke-width=".5"/>` +
      k.draw([{ d: nozzle, fill: P.sky1, inner: k.sh(nozzle, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="M55.4 31L64.6 39.2" stroke="${MUST_D}" stroke-width="1.2" stroke-dasharray=".4 .4"/>` }], 0.55) +
      `<path d="${handleTop}" fill="none" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/><path d="${handleTop}" fill="none" stroke="${P.white}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([
        {
          d: body, fill: MUST,
          inner: k.sh(body, 0, 0, 0, 1, 0, 0.9, MUST_D, 0.5) + `<path d="M50 68.8H86V72.4H50Z" fill="${MUST_L}" opacity=".85"/>` + `<path d="M50 70H85" stroke="#fff" stroke-width=".6" opacity=".9"/>` +
            `<path d="M57.6 67.6V86M78.6 67.6V86" stroke="${P.ink}" stroke-width=".4"/><path d="M56 67.6H57.6V86H56ZM77 67.6H78.6V86H77Z" fill="${P.sky1}"/>` +
            Array.from({ length: 5 }, (_, i) => `<path d="M${81.4 + i * 1.1} 72V81" stroke="${MUST_D}" stroke-width=".55"/>`).join(''),
        },
        { d: cap, fill: P.sky1, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + `<path d="${ellipse(50, 76.8, 2.8, 6.6)}" fill="none" stroke="${P.blue}" stroke-width=".4"/><path d="M47.4 70.6C47.8 68.6 48.6 68 49.4 68" fill="none" stroke="#fff" stroke-width=".6"/>` },
      ], 0.75) +
      k.draw([{ d: 'M44.6 75H49V79.8H44.6Z', fill: P.white, inner: k.sh('M44.6 75H49V79.8H44.6Z', 0, 0, 0, 1, 0, 0.8, P.blue, 0.4) }], 0.4) +
      k.draw([{ d: ellipse(67.6, 79.4, 6, 3.4), fill: P.white, inner: k.sh(ellipse(67.6, 79.4, 6, 3.4), 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.4) +
      `<text x="67.6" y="80.8" ${GEO} font-style="italic" font-weight="700" font-size="3.6" fill="${P.ink}" text-anchor="middle">15</text>` +
      sparkle(32, 40, 2.2, '#fff') + sparkle(90, 72, 1.6) +
      k.defs()
    )
  },

  // Ocho escobas en una partida: no quedó ni la mesa. El tornado levanta la mesa del patio y los naipes, sobre el damero.
  'Tornado de patio': (u) => {
    const k = kit(u)
    const N = 40, y0 = 26, y1 = 88
    const cAt = (t: number) => 60 + 7 * Math.sin(t * Math.PI * 1.15 + 0.3) - 3 * t
    const wAt = (t: number) => 2.4 + 27 * Math.pow(1 - t, 1.35)
    const Lp: string[] = [], Rp: string[] = []
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = y0 + (y1 - y0) * t, c = cAt(t), w = wAt(t) * (1 + 0.05 * Math.sin(i * 1.7))
      Lp.push(`${f(c - w)} ${f(y)}`)
      Rp.push(`${f(c + w * (1 + 0.04 * Math.cos(i * 2.3)))} ${f(y)}`)
    }
    const funnel = `M${Lp.join('L')}L${Rp.reverse().join('L')}Z`
    const swirls = Array.from({ length: 17 }, (_, i) => {
      const t = 0.03 + i * 0.058, y = y0 + (y1 - y0) * t, c = cAt(t), w = wAt(t)
      return hair(c - w * 0.96, y + 1.6, c - w * 0.1, y + 0.8 + w * 0.16, c + w * 0.96, y - 2.4, 0.6, i % 2 ? MUST_D : P.brownD, 0.8) +
        (i % 2 ? '' : hair(c - w * 0.7, y - 0.4, c, y - 0.6 + w * 0.08, c + w * 0.6, y - 2.6, 0.45, '#fff', 0.75))
    }).join('')
    const cloud = 'M14 30C10 30 9 25 13 23.4C12 18.6 18 16.4 21 19C22 13.6 30 12.6 32.6 17C35 12 44 12 46 17C49 12.4 57 12 59.4 16.6C62 12 71 12.4 73 17.4C76 13 84 13.6 86 18.4C89.6 15.4 96 17.4 95.4 22.6C99.6 23.4 99.6 29.4 95 30C90 32.4 84 31 81 29.4C76 32.4 68 32.6 63 30.4C58 33 50 33 46 30.4C40 33 32 32.6 28 30C24 32 18 32 14 30Z'
    const puff = (x: number, y: number, s: number) => {
      const d = 'M-9 2C-11 2 -12 0 -10.6 -1.6C-11 -4.6 -7.6 -6 -5.6 -4.4C-4.6 -7.6 0 -8.2 1.6 -5.2C3.6 -7 7.4 -5.6 7 -2.6C9.6 -2.4 10.2 1.6 7.6 2Z'
      return `<g transform="translate(${x} ${y}) scale(${s})">` + k.draw([{ d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0, 0.7, MUST_L, 0.45) + hair(-8, 0, -2, -2.6, 5, -.6, 0.5, MUST, 0.8) }], f(0.45 / s)) + `</g>`
    }
    const tTop = 'M-8.4 -2.2L4.6 -4.6L9.4 -.4L-3.6 2.2Z'
    const tFront = 'M-3.6 2.2L9.4 -.4V1.2L-3.6 3.8Z', tSide = 'M-8.4 -2.2L-3.6 2.2V3.8L-8.4 -.6Z'
    const legs = [[-7.4, -0.8], [-3.6, 3.4], [8.8, 0.8], [4.2, -3.6]].map(([x, y]) => `<path d="M${x} ${y}V${f(y + 8)}" stroke="${P.ink}" stroke-width="1.9" stroke-linecap="round"/><path d="M${x} ${y}V${f(y + 8)}" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>`).join('')
    const tiles = (() => {
      let d = ''
      const rows = [84, 87, 90.4, 94.2, 98.4]
      for (let r = 0; r < rows.length - 1; r++) for (let i = -8; i < 8; i++) {
        if ((r + i) % 2) continue
        const ya = rows[r], yb = rows[r + 1], sx = (y: number) => 5.2 * (0.7 + ((y - 84) / 14) * 0.6)
        d += `M${f(60 + i * sx(ya))} ${ya}L${f(60 + (i + 1) * sx(ya))} ${ya}L${f(60 + (i + 1) * sx(yb))} ${yb}L${f(60 + i * sx(yb))} ${yb}Z`
      }
      return d
    })()
    const patio = ellipse(60, 90, 38, 9.4)
    const flying: [Palo, number, number, number, number, number][] = [['oros', 7, 33.6, 50, -30, 0.62], ['copas', 2, 86.4, 42, 40, 0.58], ['espadas', 1, 41, 72, 70, 0.52], ['bastos', 6, 80.6, 68.6, -60, 0.54]]
    return (
      `<rect width="120" height="130" fill="${OCHRE_M}"/>` +
      k.shade(FULL, k.lin(OCHRE_N, 0, 0, 0, 1, 0.95, 0.1), OCHRE_N, 0.5) +
      k.shade(ellipse(60, 60, 34, 34), k.rad(MUST_L, 0.5, 0.5, 0.5, 0.75, 0), MUST_L, 0.35) +
      k.draw([{ d: patio, fill: P.white, inner: `<path d="${tiles}" fill="${P.mid}"/>` + k.sh(patio, 0, 0, 0, 1, 0, 0.6, MUST_D, 0.4) }], 0.6) +
      k.floor(57, 88, 16, 2.6, OCHRE_N) +
      k.draw([{
        d: funnel, fill: MUST_L,
        inner: `<path d="M20 18H52V90H20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.55, 0)}"/>` + k.sh('M60 18C72 30 70 60 60 90H100V18Z', 0, 0, 1, 0, 0, 0.9, MUST_D, 0.5) + swirls,
      }], 0.75) +
      hair(30, 36, 26, 40, 24, 46, 0.5, MUST_L, 0.7) + hair(90, 36, 94, 40, 95, 46, 0.5, MUST_L, 0.7) +
      k.draw([{ d: cloud, fill: OCHRE_M, inner: k.sh(cloud, 0, 0, 0, 1, 0, 0.9, OCHRE_N, 0.5) + `<path d="M13 23.4C15 21 19 20 21 19M32.6 17C36 15 42 15 46 17M59.4 16.6C63 14.6 69 15 73 17.4M86 18.4C89 17 93 18 95.4 22.6" fill="none" stroke="${MUST}" stroke-width=".7" stroke-linecap="round"/>` }], 0.6) +
      puff(47, 86.6, 0.5) + puff(68.4, 87, 0.56) + puff(57.4, 89.6, 0.4) +
      `<g transform="translate(73 47) rotate(-24)">` + legs + k.draw([{ d: tSide, fill: P.brownD }, { d: tFront, fill: P.brown }, { d: tTop, fill: P.goldL, inner: k.sh(tTop, 0, 0, 1, 1, 0, 0.7, P.brown, 0.4) + `<path d="M-6 -1.4L5 -3.4M-4 .8L7.4 -1.4" stroke="${P.brown}" stroke-width=".3"/>` }], 0.5) + `</g>` +
      flying.map(([p, n, x, y, r, s]) => naipe(k, p, n, `translate(${x} ${y}) rotate(${r}) scale(${s})`, 0.45)).join('') +
      [[30, 62], [92, 56], [38, 38], [86, 78], [34, 80], [70, 34]].map(([x, y], i) => `<path d="M${x} ${y}l${i % 2 ? 1.6 : -1.4} ${i % 2 ? -0.8 : 1}" stroke="${P.brownD}" stroke-width="1" stroke-linecap="round"/>`).join('') +
      k.defs()
    )
  },

  // ── El siete bello ─────────────────────────────────────────────────

  // Cinco sietes de oro: brillan en tu bolsillo. El monedero de boquilla de la abuela, abierto, y el siete de oro que sale brillando.
  'Moneda de oro': (u) => {
    const k = kit(u)
    const purse = 'M38.4 64.6C35.4 72 34.6 82 38.6 88.4C42.6 94.2 50.4 96 60 96C69.6 96 77.4 94.2 81.4 88.4C85.4 82 84.6 72 81.6 64.6Z'
    const mouth = 'M39.4 60.6C40.6 53 44.4 50 48.6 50H71.4C75.6 50 79.4 53 80.6 60.6L82.4 64.8H37.6Z'
    const railF = 'M37.4 65C37.8 62.4 39.8 61 42.8 61H77.2C80.2 61 82.2 62.4 82.6 65'
    const railB = 'M39.4 60.6C40.6 53 44.4 50 48.6 50H71.4C75.6 50 79.4 53 80.6 60.6'
    const rail = (d: string) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="1.9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-linecap="round" transform="translate(-.3 -.5)"/>`
    const knob = (x: number, y: number) => `<path d="M${x} ${y}V${f(y - 2.4)}" stroke="${P.ink}" stroke-width="1.4"/><path d="M${x} ${y}V${f(y - 2.4)}" stroke="${P.gold}" stroke-width=".6"/>` +
      `<circle cx="${x}" cy="${f(y - 3.6)}" r="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><circle cx="${f(x - 0.6)}" cy="${f(y - 4.2)}" r=".5" fill="#fff"/>`
    return (
      field(k) +
      k.sun(60, 43, 14, 40, 28, false) +
      k.shade(ellipse(60, 44, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.95, 0), P.goldL, 0.5) +
      k.floor(60, 95, 22, 2.4, MUST_D) +
      `<path d="${mouth}" fill="${P.wine}" stroke="${P.ink}" stroke-width=".6"/>` + k.sh(mouth, 0, 0, 0, 1, 0, 0.8, '#3A0F1B', 0.45) +
      rail(railB) + knob(60, 50) +
      `<ellipse cx="50" cy="61" rx="4" ry="1.6" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4"/><ellipse cx="70.6" cy="60.6" rx="3.4" ry="1.4" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".4"/>` +
      `<g transform="translate(60 44) rotate(-8)">` + k.cast([ellipse(0, 0, 14.4, 14.4)], 1.6, 2, MUST_D) + oroCoin(k, 14.4) + `</g>` +
      k.draw([{
        d: purse, fill: P.red,
        inner: k.sh(purse, 0, 0, 1, 1, 0, 0.9, P.wine, 0.5) + `<path d="M34 64H48V96H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.35, 0)}"/>` +
          `<path d="M40.4 66.8C38 73 37.6 81.6 40.8 86.8C44.4 92 51.2 93.6 60 93.6C68.8 93.6 75.6 92 79.2 86.8C82.4 81.6 82 73 79.6 66.8" fill="none" stroke="${MUST_L}" stroke-width=".55" stroke-dasharray="1.2 .8"/>` +
          hair(46, 70, 44, 80, 47, 90, 0.5, P.wine) + hair(60, 68, 59, 80, 60, 92, 0.45, P.wine) + hair(74, 70, 76, 80, 73, 90, 0.5, P.wine) +
          `<path d="M41 68C44 66.6 47 66.4 49 67" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>`,
      }], 0.8) +
      rail(railF) + knob(60, 61) +
      `<circle cx="37.8" cy="64.8" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="82.2" cy="64.8" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(44, 30, 2.6, '#fff') + sparkle(80, 34, 1.8, '#fff') + sparkle(86, 56, 1.4) +
      k.defs()
    )
  },

  // Veinte sietes de oro: los guardás debajo del colchón. La cama con el colchón a rayas levantado y los lingotes del siete abajo.
  'Lingote': (u) => {
    const k = kit(u)
    const rail = 'M34 80.4H86V86H34Z', railTop = 'M34 80.4L38.6 76.6H90.6L86 80.4Z', railSide = 'M86 80.4L90.6 76.6V82.2L86 86Z'
    const head = 'M27.6 88V58C27.6 52.4 31 49.4 36.4 49.4C41.8 49.4 45.2 52.4 45.2 58V64H40.4V88Z'
    const post = (x: number, y0: number, y1: number) => `M${f(x - 1.6)} ${y1}V${y0}H${f(x + 1.6)}V${y1}Z`
    const L = 54, T = 13
    const side = `M3 0C1.2 0 0 -1.2 0 -3V${f(-T + 3)}C0 ${f(-T + 1.2)} 1.2 ${-T} 3 ${-T}H${L - 3}C${L - 1.2} ${-T} ${L} ${f(-T + 1.2)} ${L} ${f(-T + 3)}V-3C${L} -1.2 ${L - 1.2} 0 ${L - 3} 0Z`
    const top = `M3 ${-T}L7.8 ${f(-T - 4.4)}H${L + 2}L${L - 3} ${-T}Z`
    const end = `M${L} ${f(-T + 3)}L${L + 4.4} ${f(-T - 2)}V${-5}L${L} -3Z`
    const bands = Array.from({ length: 4 }, (_, i) => `<path d="M-2 ${f(-T + 2 + i * 3)}H${L + 6}" stroke="${P.sky}" stroke-width="1.6"/><path d="M-2 ${f(-T + 3.3 + i * 3)}H${L + 6}" stroke="${P.blue}" stroke-width=".3"/>`).join('')
    const topBands = Array.from({ length: 3 }, (_, i) => `<path d="M${f(4.4 + i * 1.5)} ${f(-T - 1.1 - i * 1.4)}H${f(L - 1 + i * 1.5)}" stroke="${P.sky}" stroke-width="1"/>`).join('')
    const tufts = [11, 22, 33, 44].map((x) => `<circle cx="${x}" cy="${f(-T / 2)}" r=".85" fill="${P.white}" stroke="${P.mid}" stroke-width=".35"/><path d="M${x - 2.4} ${f(-T / 2 + 0.4)}Q${x} ${f(-T / 2 - 1.8)} ${x + 2.4} ${f(-T / 2 + 0.4)}" fill="none" stroke="${P.blue}" stroke-width=".35"/>`).join('')
    const piping = `<path d="M1.6 -.8H${L - 1.6}M1.6 ${f(-T + 0.8)}H${L - 1.6}" stroke="${P.mid}" stroke-width=".6" stroke-dasharray="1 .5"/>`
    return (
      field(k) +
      stage(k, 60, 62, 33) +
      k.floor(60, 87, 30, 2.6, MUST_D) +
      k.draw([
        { d: head, fill: P.brown, inner: k.sh(head, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + `<path d="M31 58C31 54.6 33.4 52.8 36.4 52.8C39.4 52.8 41.8 54.6 41.8 58V86H31Z" fill="none" stroke="${P.brownD}" stroke-width=".5"/>` + hair(33, 60, 32.6, 72, 33.4, 84, 0.45, P.goldL, 0.8) },
      ], 0.7) +
      `<circle cx="36.4" cy="47.6" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/><circle cx="35.7" cy="46.9" r=".6" fill="#fff"/>` +
      k.draw([
        { d: railSide, fill: P.brownD },
        { d: rail, fill: P.brown, inner: k.sh(rail, 0, 0, 1, 0, 0, 0.7, P.brownD, 0.45) + hair(36, 83.4, 60, 82.8, 84, 83.6, 0.45, P.brownD) + `<path d="M34 81.4H86" stroke="${P.goldL}" stroke-width=".5" opacity=".8"/>` },
        { d: railTop, fill: P.goldL, inner: k.sh(railTop, 0, 0, 1, 0, 0, 0.6, P.brown, 0.4) },
      ], 0.7) +
      k.draw([{ d: post(87.6, 74, 90), fill: P.brown, inner: k.sh(post(87.6, 74, 90), 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) }], 0.55) + `<circle cx="87.6" cy="73" r="1.9" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.shade('M54 72L92 46V80H54Z', k.lin(P.brownD, 0, 0, 1, 0, 0.1, 0.5), P.brownD, 0.3) +
      ingot(k, 58.6, 80, 12.6, 5.6) + ingot(k, 71.2, 80, 12.6, 5.6) + ingot(k, 64.8, 74.4, 12.6, 5.6) +
      sparkle(76.6, 64.6, 2.2, '#fff') + sparkle(66.4, 67.4, 1.2, '#fff') +
      `<g transform="translate(40.6 80) rotate(-31)">` +
      k.cast([side], 1.6, 2.4, MUST_D) +
      k.draw([
        { d: end, fill: P.sky1, inner: k.sh(end, 0, 0, 1, 0, 0, 0.4, P.blue, 0.25) },
        { d: top, fill: P.white, inner: topBands + k.sh(top, 0, 0, 1, 0, 0, 0.4, P.sky2, 0.3) },
        { d: side, fill: P.white },
      ], 0.75) +
      k.clip(side, bands + k.sh(side, 0, 0, 0, 1, 0, 0.35, P.blue, 0.22)) + piping + tufts +
      `</g>` +
      hair(84, 40, 89, 44, 92, 50, 0.6, MUST_D) + hair(88, 36, 93, 40, 96, 46, 0.5, MUST_D) +
      sparkle(54, 36, 2.2, '#fff') + sparkle(66, 28, 1.4) +
      k.defs()
    )
  },

  // Sesenta sietes de oro: más reservas que el Banco Central. La puerta redonda de la bóveda abierta y el oro que brilla adentro.
  'Bóveda del Central': (u) => {
    const k = kit(u)
    const ox = 50, oy = 60
    const ring = `${ellipse(ox, oy, 26, 26)} ${ellipse(ox, oy, 19.6, 19.6)}`
    const hole = ellipse(ox, oy, 19.6, 19.6)
    const holes = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${f(ox + Math.cos(a) * 21.6)}" cy="${f(oy + Math.sin(a) * 21.6)}" r="1.1" fill="${P.night}" stroke="${P.ink}" stroke-width=".3"/>` }).join('')
    const rivets = Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2; return `<circle cx="${f(ox + Math.cos(a) * 24.4)}" cy="${f(oy + Math.sin(a) * 24.4)}" r=".42" fill="${P.blue}"/>` }).join('')
    const pile = ingot(k, 35.6, 76, 10, 4.6, 2, -2) + ingot(k, 45.6, 76, 10, 4.6, 2, -2) + ingot(k, 55.6, 76, 10, 4.6, 2, -2) +
      ingot(k, 40.6, 71.4, 10, 4.6, 2, -2) + ingot(k, 50.6, 71.4, 10, 4.6, 2, -2) + ingot(k, 45.6, 66.8, 10, 4.6, 2, -2)
    // Puerta abierta de canto: el espesor a la izquierda, con los pernos, y la cara de frente achatada.
    const dx = 87, dy = 60, rx = 7.6, ry = 23.4
    const face = ellipse(dx, dy, rx, ry), edge = `${ellipse(dx - 4.6, dy, rx, ry)}`
    const bolts = [-17, -8.6, 0, 8.6, 17].map((y) => `<path d="M${f(dx - 4.6 - rx * Math.sqrt(1 - (y / ry) ** 2) - 3.6)} ${dy + y}H${f(dx - 4.6 - rx * Math.sqrt(1 - (y / ry) ** 2) + 1)}" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="M${f(dx - 4.6 - rx * Math.sqrt(1 - (y / ry) ** 2) - 3.6)} ${dy + y}H${f(dx - 4.6 - rx * Math.sqrt(1 - (y / ry) ** 2) + 1)}" stroke="${P.white}" stroke-width="1.6" stroke-linecap="round"/>`).join('')
    const spokes = [0, 72, 144, 216, 288].map((a) => {
      const r = ((a - 90) * Math.PI) / 180, x = dx + Math.cos(r) * 4.4, y = dy + Math.sin(r) * 13
      return `<path d="M${dx} ${dy}L${f(x)} ${f(y)}" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M${dx} ${dy}L${f(x)} ${f(y)}" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
        `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.2" ry="1.8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    }).join('')
    const beams = 'M50 60L18 30L26 26ZM50 60L14 50L15 58ZM50 60L20 86L28 90ZM50 60L44 22L52 22ZM50 60L72 24L78 28Z'
    return (
      field(k) +
      k.sun(ox, oy, 20, 50) +
      `<path d="${beams}" fill="${k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0)}" opacity=".8"/>` +
      k.shade(ellipse(ox, oy, 34, 34), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.9, 0), P.goldL, 0.45) +
      k.cast([ellipse(ox, oy, 26, 26)], 2.4, 2.4, MUST_D) +
      `<path d="M74.2 46H81.4M74.2 74H81.4" stroke="${P.ink}" stroke-width="4"/><path d="M74.2 46H81.4M74.2 74H81.4" stroke="${P.sky2}" stroke-width="2.4"/><path d="M74.6 45.4H81" stroke="#fff" stroke-width=".5"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.ink}" transform="translate(.6 .7)"/><path d="${ring}" fill-rule="evenodd" fill="none" stroke="${P.ink}" stroke-width="1.5"/>` +
      `<path d="${ring}" fill-rule="evenodd" fill="${P.sky2}"/>` +
      k.clip(ellipse(ox, oy, 26, 26), k.sh(ellipse(ox, oy, 26, 26), 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) + `<path d="M20 30H40V90H20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` +
        `<circle cx="${ox}" cy="${oy}" r="23" fill="none" stroke="#fff" stroke-width=".5" opacity=".7"/><circle cx="${ox}" cy="${oy}" r="20.4" fill="none" stroke="${P.blue}" stroke-width=".5"/>`) +
      holes + rivets +
      `<path d="${hole}" fill="#3B2A0C"/>` + k.clip(hole, k.shade(hole, k.rad(P.goldL, 0.5, 0.66, 0.62, 1, 0), P.gold, 0.55) + pile + sparkle(53, 63, 2.6, '#fff') + sparkle(42.6, 70.4, 1.4, '#fff') + sparkle(60, 54, 1.2, '#fff')) +
      `<path d="${hole}" fill="none" stroke="${P.ink}" stroke-width=".7"/><path d="${ellipse(ox, oy, 18.8, 18.8)}" fill="none" stroke="${P.goldL}" stroke-width=".8" opacity=".9"/>` +
      k.draw([
        { d: edge, fill: P.sky2, inner: k.sh(edge, 0, 0, 1, 0, 0, 0.8, P.mid, 0.45) + Array.from({ length: 7 }, (_, i) => `<path d="M${76 + i * 1.4} ${f(dy - ry + 3)}V${f(dy + ry - 3)}" stroke="${P.blue}" stroke-width=".3" opacity=".7"/>`).join('') },
        { d: face, fill: P.sky1, inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.blue, 0.45) + `<path d="${ellipse(dx, dy, rx * 0.82, ry * 0.86)}" fill="none" stroke="${P.blue}" stroke-width=".4"/><path d="${ellipse(dx, dy, rx * 0.66, ry * 0.7)}" fill="none" stroke="#fff" stroke-width=".45"/>` },
      ], 0.7) +
      bolts + spokes +
      `<path d="${ellipse(dx, dy, 2.6, 6.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/><path d="${ellipse(dx, dy, 1.2, 3)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>` +
      `<text x="${dx}" y="${f(dy - 3.2)}" ${GEO} font-weight="700" font-size="2.2" fill="${P.red}" text-anchor="middle">7</text>` +
      sparkle(30, 34, 2.4, '#fff') + sparkle(78, 30, 1.8, '#fff') + sparkle(34, 88, 1.4) +
      k.defs()
    )
  },
}
