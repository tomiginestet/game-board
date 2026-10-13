// Póker: la mesa de paño. Color propio: el verde de la ficha (#0B6E4F), en el paño que hace de fondo de todas las
// medallas, con la luz de la lámpara en el medio. Nada de caras: el bluff se cuenta con una máscara, unos lentes y piedra.
import { f } from '../helpers'
import { along, ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

/** Verde del paño (el `color` de la ficha), con su sombra y su luz. */
const FELT = '#0B6E4F', FELT_D = '#053D2C', FELT_L = '#43A07A'
const FULL = 'M0 0H120V130H0Z'
const GEO = 'font-family="Georgia, serif"'

/** Refleja un path (sólo M, L, H, V, C, Q y Z absolutos) respecto de la vertical x=60. */
const mirror = (d: string) =>
  d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (_, c: string, args: string) => {
    const n = args.trim() ? args.trim().split(/[\s,]+|(?=-)/).filter(Boolean).map(Number) : []
    if (c === 'H') return 'H' + n.map((x) => f(120 - x)).join(' ')
    if (c === 'V' || c === 'Z') return c + n.join(' ')
    return c + n.map((v, i) => (i % 2 ? v : f(120 - v))).join(' ')
  })

/** Paño verde de la mesa: la luz de la lámpara en el medio, los bordes en sombra y la línea de apuestas punteada. */
const felt = (k: Kit, cy = 58, glow = 0.9) =>
  `<rect width="120" height="130" fill="${FELT}"/>` +
  k.shade(FULL, k.rad(FELT_L, 0.5, f(cy / 130), 0.48, glow, 0), FELT_L, 0.45) +
  k.shade(FULL, k.rad(FELT_D, 0.5, 0.46, 0.7, 0, 1), FELT_D, 0.55) +
  `<circle cx="60" cy="60" r="38.4" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round" opacity=".55"/>`

// ── Naipe francés ────────────────────────────────────────────────────

type Suit = 's' | 'h' | 'd' | 'c'
const SUIT: Record<Suit, string> = {
  s: 'M0 -5.4C-1.8 -3 -4.8 -1.6 -4.8 1C-4.8 2.9 -3.2 3.9 -1.7 3.5C-1.1 3.3 -.7 2.9 -.45 2.5C-.5 3.7 -1.1 4.7 -2 5.4H2C1.1 4.7 .5 3.7 .45 2.5C.7 2.9 1.1 3.3 1.7 3.5C3.2 3.9 4.8 2.9 4.8 1C4.8 -1.6 1.8 -3 0 -5.4Z',
  h: 'M0 5C-3 2.6 -5 .6 -5 -1.8C-5 -3.6 -3.7 -4.8 -2.3 -4.8C-1.3 -4.8 -.4 -4.2 0 -3.3C.4 -4.2 1.3 -4.8 2.3 -4.8C3.7 -4.8 5 -3.6 5 -1.8C5 .6 3 2.6 0 5Z',
  d: 'M0 -5.4Q1.8 -2.6 3.9 0Q1.8 2.6 0 5.4Q-1.8 2.6 -3.9 0Q-1.8 -2.6 0 -5.4Z',
  c: ellipse(0, -2.5, 2.3, 2.3) + ellipse(-2.5, 1.3, 2.3, 2.3) + ellipse(2.5, 1.3, 2.3, 2.3) + 'M-.6 1C-.6 3.4 -1.2 4.6 -2.2 5.4H2.2C1.2 4.6 .6 3.4 .6 1Z',
}
const suitC = (s: Suit) => (s === 'h' || s === 'd' ? P.red : P.ink)
const pip = (s: Suit, x: number, y: number, sc: number, flip = false) =>
  `<path d="${SUIT[s]}" fill="${suitC(s)}" transform="translate(${x} ${y})${flip ? ' rotate(180)' : ''} scale(${sc})"/>`
const LAYOUT: Record<string, number[][]> = {
  '2': [[0, -7.4], [0, 7.4]],
  '7': [[-3.2, -7.8], [3.2, -7.8], [0, -3.9], [-3.2, 0], [3.2, 0], [-3.2, 7.8], [3.2, 7.8]],
  '10': [[-3.2, -8.2], [3.2, -8.2], [0, -5.4], [-3.2, -2.7], [3.2, -2.7], [-3.2, 2.7], [3.2, 2.7], [0, 5.4], [-3.2, 8.2], [3.2, 8.2]],
}

/** Figura sin cara: el marco de la carta con su emblema (corona, tiara o pluma) en vez del retrato. */
function court(rank: string, s: Suit) {
  const c = suitC(s)
  const frame = `<path d="M-5 -9.4H5V9.4H-5Z" fill="${P.sky1}" stroke="${c}" stroke-width=".4"/><path d="M-5 0H5" stroke="${c}" stroke-width=".3" stroke-dasharray=".6 .5"/>`
  const crown = (y: number, sc: number) =>
    `<path d="M-3.6 1.6L-4.2 -2.6L-1.8 -.6L0 -3.6L1.8 -.6L4.2 -2.6L3.6 1.6Z" transform="translate(0 ${y}) scale(${sc})" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35" stroke-linejoin="round"/>`
  const emblem =
    rank === 'K' ? crown(-4, 1) :
    rank === 'Q' ? crown(-4, 0.8) + `<circle cx="0" cy="-5.6" r=".7" fill="${P.red}"/>` :
    `<path d="M-2.6 -1.6C-2 -5 1 -7.6 3.6 -7.8C2 -6 .4 -3.6 -1.2 -1.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
  return frame + emblem + pip(s, 0, 4.4, 0.5)
}

/** Naipe francés centrado en (0,0), de 18 × 26: índice en dos esquinas y las pintas. */
function pcard(k: Kit, rank: string, s: Suit, w = 0.5) {
  const d = roundRect(-9, -13, 9, 13, 1.6)
  const c = suitC(s)
  const ten = rank.length > 1
  const idx = `<text x="-6.4" y="-7.8" ${GEO} font-weight="700" font-size="${ten ? 3.5 : 4.4}" fill="${c}" text-anchor="middle"${ten ? ' letter-spacing="-.4"' : ''}>${rank}</text>` + pip(s, -6.4, -4.9, 0.32)
  const mid = rank === 'A' ? pip(s, 0, 0, 1.15) : LAYOUT[rank] ? LAYOUT[rank].map(([x, y]) => pip(s, x, y, 0.36, y > 0)).join('') : court(rank, s)
  return k.draw([{ d, fill: P.white, inner: mid + idx + `<g transform="rotate(180)">${idx}</g>` + k.sh('M3 -14H10V14H3Z', 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) }], w)
}

// ── Fichas ───────────────────────────────────────────────────────────

type ChipC = [string, string, string]
const RED: ChipC = [P.red, P.wine, P.white]
const BLUE: ChipC = [P.mid, P.night, P.white]
const WHITE: ChipC = [P.white, P.sky2, P.red]
const GOLD: ChipC = [P.gold, P.goldD, P.white]

/** Ficha de póker en perspectiva: la cara de arriba centrada en (x,y), radio r, canto de alto h con sus incrustaciones. */
function chip(k: Kit, x: number, y: number, r: number, c: ChipC, o: { h?: number; ph?: number; w?: number } = {}) {
  const ry = r * 0.42, h = o.h ?? r * 0.32, ph = o.ph ?? 0.35, n = 6
  const side = `M${f(x - r)} ${f(y)}A${f(r)} ${f(ry)} 0 0 0 ${f(x + r)} ${f(y)}V${f(y + h)}A${f(r)} ${f(ry)} 0 0 1 ${f(x - r)} ${f(y + h)}Z`
  const top = ellipse(x, y, r, ry)
  const at = (a: number, rr: number, dy = 0) => `${f(x + Math.cos(a) * rr)} ${f(y + dy + Math.sin(a) * rr * 0.42)}`
  let sideM = '', topM = ''
  for (let i = 0; i < n; i++) {
    const a = ph + (i * Math.PI * 2) / n, w = 0.27
    topM += `M${at(a - w, r * 0.97)}L${at(a + w, r * 0.97)}L${at(a + w * 0.8, r * 0.76)}L${at(a - w * 0.8, r * 0.76)}Z`
    if (Math.sin(a) > -0.3) sideM += `M${at(a - w, r)}L${at(a + w, r)}L${at(a + w, r, h)}L${at(a - w, r, h)}Z`
  }
  return k.draw([
    { d: side, fill: c[0], inner: `<path d="${sideM}" fill="${c[2]}"/>` + k.sh(side, 0, 0, 1, 0, 0, 0.85, c[1], 0.5) },
    {
      d: top, fill: c[0],
      inner: `<path d="${topM}" fill="${c[2]}"/>` + `<path d="${ellipse(x, y, r * 0.64, ry * 0.64)}" fill="none" stroke="${c[2]}" stroke-width="${f(r * 0.05)}" stroke-dasharray="${f(r * 0.16)} ${f(r * 0.1)}"/>` +
        `<path d="${ellipse(x, y, r * 0.5, ry * 0.5)}" fill="#fff" opacity=".18"/>` + k.sh(top, 0, 0, 1, 1, 0, 0.6, c[1], 0.35) +
        `<path d="M${f(x - r * 0.8)} ${f(y - ry * 0.3)}Q${f(x - r * 0.5)} ${f(y - ry * 0.9)} ${f(x)} ${f(y - ry * 0.95)}" fill="none" stroke="#fff" stroke-width="${f(r * 0.07)}" stroke-linecap="round" opacity=".7"/>`,
    },
  ], o.w ?? 0.45)
}

/** Pila de fichas con la base en (x,yb), de abajo hacia arriba. */
const stack = (k: Kit, x: number, yb: number, r: number, cs: ChipC[], jit: number[] = []) => {
  const h = r * 0.32
  return cs.map((c, i) => chip(k, x + (jit[i] ?? 0), yb - h - i * h, r, c, { ph: 0.35 + i * 0.5 })).join('')
}

/** Ficha volando de canto: un disco girado `rot` grados y achatado por `tilt` (1 = de frente). */
function flyingChip(k: Kit, x: number, y: number, r: number, c: ChipC, rot: number, tilt: number) {
  const ry = r * tilt, th = r * 0.3
  const face = ellipse(0, 0, r, ry)
  const edge = `M${-r} 0A${r} ${f(ry)} 0 0 0 ${r} 0V${f(th)}A${r} ${f(ry)} 0 0 1 ${-r} ${f(th)}Z`
  const marks = Array.from({ length: 6 }, (_, i) => {
    const a = 0.3 + (i * Math.PI) / 3, w = 0.26
    const p = (aa: number, rr: number) => `${f(Math.cos(aa) * rr)} ${f(Math.sin(aa) * rr * tilt)}`
    return `M${p(a - w, r * 0.97)}L${p(a + w, r * 0.97)}L${p(a + w * 0.8, r * 0.74)}L${p(a - w * 0.8, r * 0.74)}Z`
  }).join('')
  return `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    k.draw([
      { d: edge, fill: c[1] },
      { d: face, fill: c[0], inner: `<path d="${marks}" fill="${c[2]}"/><path d="${ellipse(0, 0, r * 0.62, ry * 0.62)}" fill="none" stroke="${c[2]}" stroke-width="${f(r * 0.05)}" stroke-dasharray="${f(r * 0.16)} ${f(r * 0.1)}"/>` + k.sh(face, 0, 0, 1, 1, 0, 0.6, c[1], 0.35) },
    ], 0.4) + `</g>`
}

// ── Piezas de las medallas ───────────────────────────────────────────

const PIG = '#F2B1A6', PIG_D = '#C66C69', PIG_L = '#FCE1DA', PIG_IN = '#8E4447'

/** Chanchito de cerámica de perfil (mira a la izquierda), con flores pintadas; patas en y≈20. */
function piggy(k: Kit) {
  const body = 'M-19 -5C-17 -13 -8 -17.4 3 -17.4C15 -17.4 24 -11 25.2 -1C26.2 8 19 15.4 7 16.2C-3 17 -12 15.6 -17 10.6C-20.4 7 -20.6 0 -19 -5Z'
  const snout = 'M-17.4 -7.2C-20.6 -7.4 -24 -6.6 -25.2 -5L-25.4 3.6C-24.2 5.2 -20.8 5.6 -17.4 5Z'
  const nose = ellipse(-25.3, -0.7, 2.3, 4.3)
  const ear = 'M-11.4 -14.8C-14 -18.6 -13.6 -22.8 -10.8 -24.4C-8.4 -21.8 -5.8 -18.8 -4.8 -16C-7 -15.6 -9.4 -15.2 -11.4 -14.8Z'
  const earB = 'M-5.6 -16.4C-6.4 -20.4 -5 -23.4 -2.4 -24.4C-.8 -21.6 .4 -18.8 .6 -16.8Z'
  const leg = (x: number) => `M${x} 9H${f(x + 6)}L${f(x + 5.8)} 19.6C${f(x + 5.8)} 20.8 ${f(x + 0.2)} 20.8 ${f(x + 0.2)} 19.6Z`
  const hoof = (x: number) => `<path d="M${x} 17.6H${f(x + 6)}V21H${x}Z" fill="${PIG_D}"/><path d="M${f(x + 3)} 18V21" stroke="${P.ink}" stroke-width=".35"/>`
  const flower = (x: number, y: number, s: number) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    Array.from({ length: 5 }, (_, i) => `<ellipse cx="0" cy="-2.2" rx="1.3" ry="2.2" transform="rotate(${i * 72})" fill="${P.white}" stroke="${P.blue}" stroke-width=".35"/>`).join('') +
    `<circle r="1.1" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".3"/>` +
    `<path d="M2.4 2.4C4.4 2.4 5.6 3.6 6 5.2C4.2 5.4 2.8 4.4 2.4 2.4Z" fill="${P.green}" stroke="${P.greenD}" stroke-width=".3"/></g>`
  const tail = 'M24.6 -3.4C27.6 -5.4 30.4 -3.6 29.4 -1.2C28.6 .6 26 .2 26.4 -1.6C26.8 -3.2 29.6 -3 30.6 -.6C31.2 1 30.6 2.6 29.4 3.4'
  return (
    `<path d="${tail}" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="${tail}" fill="none" stroke="${PIG}" stroke-width="1" stroke-linecap="round"/>` +
    k.draw([{ d: leg(-7.6), fill: PIG_D, inner: hoof(-7.6) }, { d: leg(7.4), fill: PIG_D, inner: hoof(7.4) }, { d: earB, fill: PIG_D }], 0.55) +
    k.draw([
      { d: leg(-14), fill: PIG, inner: k.sh(leg(-14), 0, 0, 1, 0, 0, 0.8, PIG_D, 0.4) + hoof(-14) },
      { d: leg(13.6), fill: PIG, inner: k.sh(leg(13.6), 0, 0, 1, 0, 0, 0.8, PIG_D, 0.4) + hoof(13.6) },
      {
        d: body, fill: PIG,
        inner:
          `<path d="M-22 -20H-2V20H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
          k.sh('M2 -20C16 -14 22 2 14 20H30V-20Z', 0, 0, 1, 0, 0, 0.9, PIG_D, 0.45) + k.sh('M-22 6H28V20H-22Z', 0, 0, 0, 1, 0, 0.75, PIG_D, 0.35) +
          flower(-6.4, 3, 1) + flower(15.6, -5, 0.8) + flower(4, 9.6, 0.6) +
          hair(-13.6, -7, -11.6, 0, -14, 7.4, 0.5, PIG_D) + hair(-10, 12.4, 0, 15, 12, 12.4, 0.45, PIG_D) + hair(18, -12, 22.6, -6, 23, 2, 0.4, PIG_D) +
          `<ellipse cx="-9" cy="-11.4" rx="4.6" ry="1.5" transform="rotate(-18 -9 -11.4)" fill="#fff" opacity=".85"/><circle cx="-3.4" cy="-13.4" r=".7" fill="#fff"/>`,
      },
      { d: snout, fill: PIG, inner: k.sh(snout, 0, 0, 0, 1, 0, 0.7, PIG_D, 0.4) + `<path d="M-24 -6H-19V-3" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>` },
    ], 0.7) +
    k.draw([{ d: nose, fill: PIG_L, inner: k.sh(nose, 0, 0, 1, 1, 0, 0.6, PIG_D, 0.35) + `<ellipse cx="-25.6" cy="-2.3" rx=".65" ry="1.1" fill="${PIG_IN}"/><ellipse cx="-25.6" cy="1" rx=".65" ry="1.1" fill="${PIG_IN}"/>` }], 0.45) +
    k.draw([{ d: ear, fill: PIG, inner: k.sh(ear, 0, 0, 1, 1, 0, 0.8, PIG_D, 0.45) + hair(-10.6, -16, -10.8, -20, -10.2, -22.8, 0.5, PIG_D) }], 0.55) +
    `<path d="M-1.6 -15.4C1 -16.2 4 -16.2 6.4 -15.6" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-1 -15.9C1.2 -16.4 3.8 -16.4 5.8 -16" fill="none" stroke="${PIG_D}" stroke-width=".4"/>`
  )
}

/** Fajo de billetes en perspectiva oblicua: esquina de abajo a la izquierda del frente en (x,y), ancho w, fondo (dx,dy), alto h. */
const BILL = '#E2EBCF', BILL_D = '#7F9D6E'
function brick(k: Kit, x: number, y: number, w: number, dx: number, dy: number, h: number) {
  const top = `M${x} ${f(y - h)}H${f(x + w)}L${f(x + w + dx)} ${f(y - h + dy)}H${f(x + dx)}Z`
  const front = `M${x} ${y}H${f(x + w)}V${f(y - h)}H${x}Z`
  const side = `M${f(x + w)} ${y}L${f(x + w + dx)} ${f(y + dy)}V${f(y - h + dy)}L${f(x + w)} ${f(y - h)}Z`
  const mx = x + w / 2
  const band = `M${f(mx - 1.4)} ${f(y - h)}H${f(mx + 1.4)}L${f(mx + 1.4 + dx)} ${f(y - h + dy)}H${f(mx - 1.4 + dx)}Z`
  const bandF = `M${f(mx - 1.4)} ${y}H${f(mx + 1.4)}V${f(y - h)}H${f(mx - 1.4)}Z`
  const layers = Array.from({ length: Math.round(h / 0.55) }, (_, i) => `M${x} ${f(y - 0.5 - i * 0.55)}H${f(x + w)}`).join('')
  const ox = x + w * 0.27 + dx * 0.5, oy = y - h + dy * 0.5
  return k.draw([
    { d: side, fill: BILL, inner: k.sh(side, 0, 0, 1, 0, 0.4, 0.9, BILL_D, 0.5) },
    { d: front, fill: BILL, inner: `<path d="${layers}" stroke="${BILL_D}" stroke-width=".25"/>` + k.sh(front, 0, 0, 1, 0, 0, 0.6, BILL_D, 0.4) + `<path d="${bandF}" fill="${P.white}"/><path d="M${f(mx - 1.4)} ${f(y - h / 2)}H${f(mx + 1.4)}" stroke="${P.red}" stroke-width=".5"/>` },
    {
      d: top, fill: BILL,
      inner:
        `<path d="M${f(x + 0.9)} ${f(y - h - 0.5)}H${f(x + w - 0.7)}L${f(x + w + dx - 0.9)} ${f(y - h + dy + 0.5)}H${f(x + dx + 0.7)}Z" fill="none" stroke="${BILL_D}" stroke-width=".3"/>` +
        `<ellipse cx="${f(ox)}" cy="${f(oy)}" rx="${f(w * 0.12)}" ry="${f(Math.abs(dy) * 0.32)}" fill="${P.white}" stroke="${BILL_D}" stroke-width=".3"/>` +
        `<ellipse cx="${f(ox)}" cy="${f(oy)}" rx="${f(w * 0.06)}" ry="${f(Math.abs(dy) * 0.18)}" fill="${BILL_D}" opacity=".55"/>` +
        `<path d="M${f(x + w * 0.66 + dx * 0.3)} ${f(oy + dy * 0.12)}H${f(x + w * 0.9 + dx * 0.3)}M${f(x + w * 0.68 + dx * 0.6)} ${f(oy - dy * 0.12)}H${f(x + w * 0.92 + dx * 0.6)}" stroke="${BILL_D}" stroke-width=".3"/>` +
        `<path d="${band}" fill="${P.white}"/><path d="M${f(mx)} ${f(y - h)}L${f(mx + dx)} ${f(y - h + dy)}" stroke="${P.red}" stroke-width=".5"/>` +
        k.sh(top, 0, 0, 1, 1, 0, 0.45, BILL_D, 0.3),
    },
  ], 0.4)
}

/** Billete suelto que vuela, centrado en (0,0). */
function bill(k: Kit) {
  const d = 'M-6.4 -3.2C-3 -4 1 -2.4 6.4 -3.4L6 3.2C1 4.2 -3 2.6 -6 3.4Z'
  return k.draw([{
    d, fill: BILL,
    inner: `<path d="M-5.4 -2.4C-3 -3 1 -1.6 5.4 -2.4L5.1 2.3C1 3.2 -3 1.8 -5.1 2.5Z" fill="none" stroke="${BILL_D}" stroke-width=".3"/>` +
      `<ellipse cx="0" cy="0" rx="1.8" ry="2" fill="${P.white}" stroke="${BILL_D}" stroke-width=".3"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.7, BILL_D, 0.4) +
      `<text x="-3.6" y="1.4" ${GEO} font-size="2.6" font-weight="700" fill="${BILL_D}" text-anchor="middle">$</text>`,
  }], 0.4)
}

/** Moneda de oro en el aire: disco girado `rot` y achatado por `tilt`. */
function coin(k: Kit, x: number, y: number, r: number, rot: number, tilt: number) {
  const ry = Math.max(r * tilt, 0.4)
  const face = ellipse(0, 0, r, ry)
  const edge = `M${-r} 0A${r} ${f(ry)} 0 0 0 ${r} 0V${f(r * 0.24)}A${r} ${f(ry)} 0 0 1 ${-r} ${f(r * 0.24)}Z`
  return `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    k.draw([
      { d: edge, fill: P.goldD, inner: `<path d="M${-r} ${f(r * 0.12)}A${r} ${f(ry)} 0 0 0 ${r} ${f(r * 0.12)}" fill="none" stroke="${P.gold}" stroke-width=".3" stroke-dasharray=".3 .3"/>` },
      { d: face, fill: P.gold, inner: k.sh(face, 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) + `<path d="${ellipse(0, 0, r * 0.72, ry * 0.72)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/><path d="${ellipse(-r * 0.25, -ry * 0.3, r * 0.3, ry * 0.18)}" fill="#fff" opacity=".7"/>` },
    ], 0.38) + `</g>`
}

/** Pluma de avestruz de carnaval a lo largo de una curva: borde ondulado y esponjoso, barbas que se enrulan y raquis claro. */
function ostrich(k: Kit, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, W: number, fill: string, dk: string) {
  const N = 46, L: string[] = [], R: string[] = []
  const pts = along(x0, y0, cx, cy, x1, y1, Array.from({ length: N + 1 }, (_, i) => i / N))
  const wAt = (t: number) => W * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + t * 0.96)), 0.5) * (0.35 + 0.65 * Math.min(1, t * 1.8))
  const nrm = (i: number) => { const q = pts[i], len = Math.hypot(q.dx, q.dy) || 1; return { ux: q.dx / len, uy: q.dy / len } }
  pts.forEach((q, i) => {
    const { ux, uy } = nrm(i), ww = wAt(i / N)
    L.push(`${f(q.x - uy * ww * (1 + 0.14 * Math.sin(i * 2.1)))} ${f(q.y + ux * ww * (1 + 0.14 * Math.sin(i * 2.1)))}`)
    R.push(`${f(q.x + uy * ww * (1 + 0.14 * Math.cos(i * 2.3)))} ${f(q.y - ux * ww * (1 + 0.14 * Math.cos(i * 2.3)))}`)
  })
  const d = `M${L.join('L')}L${R.reverse().join('L')}Z`
  let barbs = ''
  for (let i = 3; i < N - 1; i += 2) {
    const q = pts[i], { ux, uy } = nrm(i), ww = wAt(i / N)
    for (const sd of [-1, 1]) {
      const ex = q.x - uy * ww * sd * 0.95 + ux * ww * 0.5, ey = q.y + ux * ww * sd * 0.95 + uy * ww * 0.5
      barbs += hair(q.x, q.y, q.x - uy * ww * sd * 0.7 + ux * ww * 0.05, q.y + ux * ww * sd * 0.7 + uy * ww * 0.05, ex, ey, 0.34, dk, 0.7)
    }
  }
  return k.draw([{ d, fill, inner: k.sh(d, 0, 0, 1, 1, 0, 0.75, dk, 0.4) + barbs + hair(x0, y0, cx, cy, x1, y1, 0.75, '#fff', 0.8) }], 0.5)
}

/** Corona de carnaval (cilindro visto de arriba): aro con piedras, puntas con flor de lis y perlas. Centro del aro en (0,0). */
function momoCrown(k: Kit) {
  const RX = 21, RY = 4.6, H = 13
  const fy = (u: number) => RY * Math.sqrt(Math.max(0, 1 - u * u))
  const tipsF = [-0.8, -0.4, 0, 0.4, 0.8], tipsB = [-0.6, -0.2, 0.2, 0.6]
  // Frente del aro con las puntas
  let top = ''
  const us = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]
  us.forEach((u, i) => {
    const x = u * RX, y = fy(u)
    const isTip = tipsF.includes(u)
    const hh = isTip ? (u === 0 ? 16 : Math.abs(u) > 0.5 ? 11.6 : 14) : 0
    top += (i ? 'L' : 'M') + `${f(x)} ${f(y - hh)}`
  })
  const front = `${top}L${RX} ${H}A${RX} ${RY} 0 0 1 ${-RX} ${H}Z`
  let back = ''
  ;[-1, -0.6, -0.2, 0.2, 0.6, 1].forEach((u, i) => {
    const x = u * RX, y = -fy(u), hh = tipsB.includes(u) ? (Math.abs(u) < 0.5 ? 7.4 : 6) : 0
    if (i) {
      const pu = [-1, -0.6, -0.2, 0.2, 0.6, 1][i - 1], mu = (pu + u) / 2
      back += `L${f(mu * RX)} ${f(-fy(mu) + 1.2)}`
    }
    back += (i ? 'L' : 'M') + `${f(x)} ${f(y - hh)}`
  })
  const backD = `${back}L${RX} 0A${RX} ${RY} 0 0 1 ${-RX} 0Z`
  const band = `M${-RX} ${f(H - 5.6)}A${RX} ${RY} 0 0 0 ${RX} ${f(H - 5.6)}V${H}A${RX} ${RY} 0 0 1 ${-RX} ${H}Z`
  const gems = [-0.7, -0.35, 0, 0.35, 0.7].map((u, i) => {
    const x = u * RX, y = H - 2.8 + fy(u) * 0.95
    return i % 2
      ? `<path d="M${f(x)} ${f(y - 2)}L${f(x + 1.5)} ${f(y)}L${f(x)} ${f(y + 2)}L${f(x - 1.5)} ${f(y)}Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/><path d="M${f(x - 0.5)} ${f(y - 0.8)}L${f(x)} ${f(y - 1.5)}" stroke="#fff" stroke-width=".35"/>`
      : `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${u === 0 ? 2.6 : 1.8}" ry="${u === 0 ? 2.2 : 1.6}" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><ellipse cx="${f(x - 0.5)}" cy="${f(y - 0.6)}" rx=".6" ry=".4" fill="#fff"/>`
  }).join('')
  const pearls = (yy: number) => Array.from({ length: 15 }, (_, i) => { const u = -0.93 + i * (1.86 / 14); return `<circle cx="${f(u * RX)}" cy="${f(yy + fy(u))}" r=".6" fill="${P.white}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
  const sequins = [H - 3.9, H - 1.5].map((yy, r) => Array.from({ length: 22 }, (_, i) => { const u = -0.95 + (i + r * 0.5) * (1.9 / 22); return u > 0.97 ? '' : `<circle cx="${f(u * RX)}" cy="${f(yy + fy(u))}" r=".5" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".18"/>` }).join('')).join('')
  const fleur = tipsF.map((u) => {
    const x = u * RX, y = fy(u) - (u === 0 ? 16 : Math.abs(u) > 0.5 ? 11.6 : 14)
    return `<circle cx="${f(x)}" cy="${f(y - 1.2)}" r="${u === 0 ? 2 : 1.5}" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x - 0.5)}" cy="${f(y - 1.7)}" r=".5" fill="#fff"/>` +
      hair(x, y + 2, x - 2.4, y + 4.4, x - 3.4, y + 7.4, 0.5, P.goldD) + hair(x, y + 2, x + 2.4, y + 4.4, x + 3.4, y + 7.4, 0.5, P.goldD)
  }).join('')
  return (
    k.draw([{ d: backD, fill: P.goldD, inner: k.sh(backD, 0, 0, 1, 0, 0.2, 0.9, P.brownD, 0.45) }], 0.55) +
    `<path d="${ellipse(0, 0, RX - 0.6, RY - 0.4)}" fill="${P.wine}"/>` +
    k.draw([{
      d: front, fill: P.gold,
      inner: k.sh(front, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M${-RX - 2} -20H-8V20H${-RX - 2}Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` +
        `<path d="${band}" fill="${P.goldD}" opacity=".35"/>` + `<path d="M${-RX} ${f(H - 5.6)}A${RX} ${RY} 0 0 0 ${RX} ${f(H - 5.6)}" fill="none" stroke="${P.ink}" stroke-width=".4"/>` +
        pearls(H - 7.2) + sequins + gems + fleur,
    }], 0.75)
  )
}

/** Máscara de porcelana (volto) sin rasgos: sólo los ojos huecos, el filete dorado y una pica en la frente. */
function mask(k: Kit) {
  const d = 'M0 -25C10.6 -25 17.6 -17 17.6 -4C17.6 8 13.4 18.6 6.6 23.6C4.6 25 2.4 25.6 0 25.6C-2.4 25.6 -4.6 25 -6.6 23.6C-13.4 18.6 -17.6 8 -17.6 -4C-17.6 -17 -10.6 -25 0 -25Z'
  const eyeL = 'M-12.2 -3.6C-10.6 -6.2 -5.6 -7 -3 -4.6C-5 -2.4 -10 -1.8 -12.2 -3.6Z'
  const eyeR = 'M12.2 -3.6C10.6 -6.2 5.6 -7 3 -4.6C5 -2.4 10 -1.8 12.2 -3.6Z'
  const scroll = (sx: number) =>
    `<g transform="scale(${sx} 1)"><path d="M-2.6 -16.6C-5.4 -18.6 -9 -18.6 -11.4 -16.6C-13 -15.2 -12.4 -13 -10.6 -13.2C-9.4 -13.4 -9.2 -14.8 -10.2 -15.2" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
    `<path d="M-2.6 -16.6C-4 -19.6 -6.4 -21.2 -9.4 -21.4" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-linecap="round"/><circle cx="-9.6" cy="-21.4" r=".55" fill="${P.goldD}"/><circle cx="-12.6" cy="-17.8" r=".5" fill="${P.goldD}"/></g>`
  const dots = Array.from({ length: 21 }, (_, i) => {
    const a = Math.PI * (1.08 + i * 0.042)
    return `<circle cx="${f(Math.cos(a) * 15.2)}" cy="${f(-4 + Math.sin(a) * 18.4)}" r=".42" fill="${P.goldD}"/>`
  }).join('')
  return (
    k.draw([{
      d, fill: P.white,
      inner:
        `<path d="M-20 -28H-4V28H-20Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
        k.sh('M3 -26C12 -18 14 2 6 28H20V-26Z', 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + k.sh('M-20 12H20V28H-20Z', 0, 0, 0, 1, 0, 0.5, P.blue, 0.3) +
        k.shade(ellipse(-7.6, -4.2, 7, 4.4), k.rad(P.sky2, 0.5, 0.5, 0.5, 0.8, 0), P.sky2, 0.4) + k.shade(ellipse(7.6, -4.2, 7, 4.4), k.rad(P.blue, 0.5, 0.5, 0.5, 0.7, 0), P.blue, 0.35) +
        k.sh('M.6 -4C1.4 2 2.6 6 3 9.6C2 10.6 .6 10.8 0 10.6Z', 0, 0, 1, 0, 0.1, 0.9, P.blue, 0.4) +
        k.shade(ellipse(1.6, 10.4, 3.4, 1.4), k.rad(P.blue, 0.5, 0.5, 0.5, 0.6, 0), P.blue, 0.3) +
        scroll(1) + scroll(-1) + dots +
        `<path d="${SUIT.s}" transform="translate(0 -17.4) scale(.62)" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".5"/>` +
        `<path d="${d}" fill="none" stroke="${P.gold}" stroke-width=".9" transform="scale(.94) translate(0 -.4)"/>` +
        `<ellipse cx="-9" cy="-12" rx="3.4" ry="1.2" transform="rotate(-40 -9 -12)" fill="#fff"/>`,
    }], 0.8) +
    k.draw([{ d: eyeL, fill: FELT_D, inner: k.sh(eyeL, 0, 0, 0, 1, 0.9, 0.3, '#02251A', 0.4) }, { d: eyeR, fill: FELT_D, inner: k.sh(eyeR, 0, 0, 0, 1, 0.9, 0.3, '#02251A', 0.4) }], 0.3) +
    `<path d="M-11.6 -3.2C-9.6 -1.8 -5.6 -2 -3.4 -4.2M11.6 -3.2C9.6 -1.8 5.6 -2 3.4 -4.2" fill="none" stroke="${P.gold}" stroke-width=".55"/>`
  )
}

/** Carta boca abajo acostada en la mesa (rotada `a` grados y aplastada por `sq`), centrada en (cx,cy) y escalada por `s`.
 * Con `peek`, la esquina de adelante a la derecha se levanta y deja ver el índice. */
function flatBack(k: Kit, cx: number, cy: number, a: number, s = 1, sq = 0.5, peek?: [string, Suit]) {
  const ca = Math.cos((a * Math.PI) / 180), sa = Math.sin((a * Math.PI) / 180)
  const mx = (u: number, v: number) => [cx + (u * ca - v * sa) * s, cy + (u * sa + v * ca) * s * sq]
  const m = (u: number, v: number) => mx(u, v).map(f).join(' ')
  const quad = (x0: number, y0: number, x1: number, y1: number) => `M${m(x0, y0)}L${m(x1, y0)}L${m(x1, y1)}L${m(x0, y1)}Z`
  const d = peek ? `M${m(-9, -13)}L${m(9, -13)}L${m(9, 5)}L${m(1, 13)}L${m(-9, 13)}Z` : quad(-9, -13, 9, 13)
  const inner = quad(-7.4, -11.4, 7.4, 11.4)
  let lat = ''
  for (let i = -6; i <= 6; i++) lat += `M${m(-7.4, i * 3.4 - 10)}L${m(7.4, i * 3.4 + 4.8)}M${m(7.4, i * 3.4 - 10)}L${m(-7.4, i * 3.4 + 4.8)}`
  let flap = ''
  if (peek) {
    const [ax, ay] = mx(9, 5), [bx, by] = mx(1, 13), [tx, ty] = mx(9, 13)
    const lx = tx - 3.6 * s, ly = ty - 9.4 * s
    const fd = `M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}L${f(lx)} ${f(ly)}Z`
    flap = k.shade(`M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}L${f(tx)} ${f(ty)}Z`, k.lin('#021B13', 0, 0, 1, 1, 0.7, 0.2), '#021B13', 0.3) +
      k.draw([{ d: fd, fill: P.white, inner: k.sh(fd, 0, 0, 1, 1, 0.5, 0, P.sky2, 0.4) }], 0.4) +
      `<text x="${f((ax + bx + lx) / 3 - 0.6)}" y="${f((ay + by + ly) / 3 + 1)}" ${GEO} font-weight="700" font-size="${f(4 * s)}" fill="${suitC(peek[1])}" text-anchor="middle" transform="rotate(${f(a - 10)} ${f((ax + bx + lx) / 3)} ${f((ay + by + ly) / 3)})">${peek[0]}</text>` +
      pip(peek[1], f((ax + bx + lx) / 3 + 2.4 * s), f((ay + by + ly) / 3 + 1.6 * s), f(0.3 * s))
  }
  return k.draw([{
    d, fill: P.white,
    inner: `<path d="${inner}" fill="${P.red}"/>` + k.clip(inner, `<path d="${lat}" stroke="${P.white}" stroke-width=".35" opacity=".8"/>`) +
      `<path d="${quad(-8.2, -12.2, 8.2, 12.2)}" fill="none" stroke="${P.red}" stroke-width=".3"/>` + k.sh(d, 0, 0, 1, 1, 0, 0.6, P.wine, 0.35),
  }], 0.45) + flap
}

const SAND = '#EBCB92', SAND_D = '#B98A52'

/** La esfinge echada de perfil, mirando a la derecha (la cara queda del lado de la sombra). Suelo en y=0. */
function sphinx(k: Kit) {
  const body = 'M14.6 -22.4C8 -23.8 0 -21.6 -8 -20.2C-18 -19.8 -27 -16.4 -29 -9C-30.4 -4 -29 -1 -26 0H17C17.6 -6 17.2 -14 14.6 -22.4Z'
  const legB = 'M10 -10.8C16 -11.2 24 -11.2 28.4 -10.8C30.4 -10.6 31.4 -9.4 31.4 -8V-6.8H10Z'
  const legF = 'M6.4 -7.4C13 -8 23 -8 28.8 -7.4C31 -7 32.2 -5.4 32.2 -3.7C32.2 -1.4 31 0 28.8 0H6Z'
  const pawR = 'M-17.6 -3.8C-11 -4.2 -5 -4 -1.6 -3.4C.3 -3 1 -1.4 .3 0H-17.6Z'
  const tail = taper(-27.6, -2.6, -18, 1.6, -4, -1.2, 1.9, 0.9)
  const flap = 'M7.4 -41.4C5 -35 2.4 -28.6 -.6 -21.6L14.4 -20.8C13.6 -27 12.8 -34 12.4 -40.6Z'
  const head = 'M7.4 -41.4C9.4 -45.2 15.4 -46.6 19.8 -45.2C22.6 -44.4 23.8 -42 23.8 -39.4C24.4 -38.2 24.6 -36.8 24.8 -35.6C25.8 -34.4 26.6 -33.2 27 -32.2C27.2 -31.6 26.8 -31.2 26 -31.1L25.8 -30.4C26.2 -30 26.2 -29.4 25.8 -29C26.1 -28.6 26 -28 25.5 -27.7C25.8 -26.6 25.3 -25.6 24.3 -25.2C22.4 -24.6 20.2 -24.6 18.6 -25L17.6 -21H12Z'
  const cloth = 'M7.4 -41.4C9.4 -45.2 15.4 -46.6 19.8 -45.2C22.6 -44.4 23.8 -42 23.8 -39.4L19.4 -38.4C18.8 -35 18.6 -31 18.8 -27L12 -21C11 -28 10 -35 7.4 -41.4Z'
  const lappet = 'M15.4 -36.4H19.6L21.4 -17.6L15.2 -16.8Z'
  const uraeus = 'M22.4 -39.4C22 -41.4 22.8 -43 24.4 -42.8C24.6 -42 24.2 -41.4 23.8 -41C24 -40.4 24 -39.8 23.8 -39.2Z'
  const strata = (y0: number, n: number, x0: number, x1: number) =>
    Array.from({ length: n }, (_, i) => hair(x0 + (i % 2) * 3, y0 + i * 3.2, (x0 + x1) / 2, y0 + i * 3.2 + 0.6, x1 - (i % 3) * 2, y0 + i * 3.2, 0.32, SAND_D, 0.6)).join('')
  const stripes = (x0: number, x1: number, y0: number, y1: number, n: number, tilt = 0) =>
    Array.from({ length: n }, (_, i) => { const y = y0 + ((y1 - y0) * (i + 0.5)) / n; return `<path d="M${x0} ${f(y)}L${x1} ${f(y + tilt)}" stroke="${P.mid}" stroke-width="${f(((y1 - y0) / n) * 0.5)}"/>` }).join('')
  return (
    k.draw([{ d: legB, fill: SAND_D, inner: k.sh(legB, 0, 0, 0, 1, 0, 0.8, P.brownD, 0.4) }], 0.6) +
    k.draw([{ d: tail, fill: SAND, inner: k.sh(tail, 0, 0, 0, 1, 0, 0.8, SAND_D, 0.4) }], 0.45) +
    k.draw([
      {
        d: body, fill: SAND,
        inner:
          `<path d="M-32 -26H-6V2H-32Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` + k.sh('M-6 -26C4 -18 8 -10 8 2H20V-26Z', 0, 0, 1, 0, 0, 0.8, SAND_D, 0.45) + k.sh('M-32 -8H20V2H-32Z', 0, 0, 0, 1, 0, 0.7, SAND_D, 0.4) +
          strata(-18.6, 6, -27, 14) +
          hair(-27.4, -12, -21, -19.6, -12.4, -16.4, 0.6, SAND_D) + hair(-12.4, -16.4, -9.6, -8, -13, -0.4, 0.6, SAND_D) +
          hair(-4, -19, 1, -14, 0, -8, 0.4, SAND_D) + hair(4, -19.6, 9.4, -15, 9, -8.6, 0.5, SAND_D) + hair(-9, -11, -4, -12.4, 1, -10.6, 0.35, SAND_D),
      },
      { d: pawR, fill: SAND, inner: k.sh(pawR, 0, 0, 0, 1, 0.1, 0.8, SAND_D, 0.4) + hair(-3.4, -3.6, -2.4, -1.8, -3, 0, 0.35, SAND_D) + hair(-6.2, -3.8, -5.2, -1.8, -5.8, 0, 0.35, SAND_D) },
      { d: legF, fill: SAND, inner: k.sh(legF, 0, 0, 1, 0, 0, 0.6, SAND_D, 0.4) + k.sh(legF, 0, 0, 0, 1, 0.1, 0.8, SAND_D, 0.4) + hair(29.4, -4.6, 31, -2.6, 30, 0, 0.4, SAND_D) + hair(26.6, -5, 28, -2.8, 27.2, 0, 0.4, SAND_D) + hair(23.8, -5.2, 25, -3, 24.4, 0, 0.35, SAND_D) + hair(9, -6.4, 17, -7.4, 26, -6.6, 0.45, '#fff', 0.7) },
    ], 0.75) +
    `<g transform="translate(13 -21) scale(1.14) translate(-13 21)">` +
    k.draw([{ d: flap, fill: P.goldL, inner: stripes(-2, 16, -41, -21, 9, 0.6) + k.sh(flap, 0, 0, 1, 0, 0, 0.75, SAND_D, 0.45) }], 0.6) +
    k.draw([{
      d: head, fill: SAND,
      inner: k.sh('M14 -48H30V-20H14Z', 0, 0, 1, 0, 0.1, 0.85, SAND_D, 0.5) + k.sh(head, 0, 0, 0, 1, 0, 0.5, SAND_D, 0.3) +
        hair(19.4, -25.2, 21.6, -23.4, 24.2, -24.8, 0.4, SAND_D) + hair(24.6, -33.4, 23.6, -31.8, 24.4, -30.8, 0.35, P.brownD),
    }], 0.7) +
    k.draw([{ d: cloth, fill: P.goldL, inner: k.clip(cloth, stripes(6, 26, -46, -20, 10, -1.6)) + k.sh(cloth, 0, 0, 1, 0, 0, 0.7, SAND_D, 0.45) + `<path d="M8.6 -42.4C11 -45 16 -45.6 20 -44.2" fill="none" stroke="#fff" stroke-width=".6" opacity=".8"/>` }], 0.5) +
    k.draw([{ d: lappet, fill: P.goldL, inner: stripes(15, 22, -36.4, -16.8, 8, 0) + k.sh(lappet, 0, 0, 1, 0, 0, 0.75, SAND_D, 0.45) }], 0.5) +
    k.draw([{ d: uraeus, fill: P.gold, inner: k.sh(uraeus, 0, 0, 1, 0, 0, 0.8, P.goldD, 0.4) }], 0.35) +
    `<path d="M20.4 -35.6C21.2 -36.6 22.8 -36.8 23.8 -35.8C23 -35 21.4 -34.8 20.4 -35.6Z" fill="${P.white}" stroke="${P.brownD}" stroke-width=".4"/><circle cx="22.6" cy="-35.7" r=".5" fill="${P.brownD}"/>` +
    hair(20.6, -35.4, 20, -35.2, 19.6, -34.4, 0.5, P.brownD) + hair(20.6, -37.4, 22.4, -38.2, 24.2, -37.4, 0.45, P.brownD) +
    `</g>`
  )
}

export const POKER_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Con todo ───────────────────────────────────────────────────────

  // Tres all-in: rompiste la alcancía y salió bien. El chanchito de cerámica partido y las fichas que se le escapan.
  'Chanchito roto': (u) => {
    const k = kit(u)
    const crack = [[7, -19], [4.4, -12.6], [8.6, -7.4], [5, -1.6], [9.2, 3.6], [5.4, 9.4], [8.4, 13.6], [6.6, 22]]
    const cp = crack.map(([x, y]) => `${x} ${y}`).join('L')
    const front = `M-40 -30L7 -30L${cp}L-40 30Z`
    const rear = `M60 -30L7 -30L${cp}L60 30Z`
    const gap = `M${cp}L${crack.slice().reverse().map(([x, y]) => `${f(x + 4.6)} ${y}`).join('L')}Z`
    const body = 'M-19 -5C-17 -13 -8 -17.4 3 -17.4C15 -17.4 24 -11 25.2 -1C26.2 8 19 15.4 7 16.2C-3 17 -12 15.6 -17 10.6C-20.4 7 -20.6 0 -19 -5Z'
    const edge = (w: number) => k.clip(body, `<path d="M${cp}" fill="none" stroke="${P.paper}" stroke-width="2" stroke-linejoin="round"/><path d="M${cp}" fill="none" stroke="${P.ink}" stroke-width="${w}" stroke-linejoin="round"/>`)
    return (
      felt(k, 54) +
      k.floor(58, 76.6, 30, 3.4, FELT_D) +
      `<g transform="translate(57 53.6) scale(1.06)">` +
      `<g transform="translate(3.8 0) rotate(9 19 20.6)">` + k.clip(rear, piggy(k)) + edge(0.6) + `</g>` +
      k.clip(body, `<path d="${gap}" fill="${PIG_IN}"/>` + k.sh(gap, 0, 0, 1, 0, 0.9, 0.4, '#3E1A1E', 0.5)) +
      k.clip(front, piggy(k)) + edge(0.75) +
      `</g>` +
      flyingChip(k, 68.4, 73.6, 3.6, RED, 30, 0.5) + flyingChip(k, 62.6, 80.4, 3.2, WHITE, -20, 0.7) +
      stack(k, 71.6, 91.4, 6.2, [BLUE, RED, WHITE, RED], [0, 0.6, -0.4, 0.3]) +
      chip(k, 56, 90, 5.2, GOLD) + flyingChip(k, 84.6, 81.6, 4.4, BLUE, 78, 0.4) +
      sparkle(33, 38, 2.4) + sparkle(88, 40, 1.6) + sparkle(80, 64, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Quince all-in: salís de la mesa como de un banco en una película. El maletín de aluminio abierto, lleno de fajos.
  'Valija de billetes': (u) => {
    const k = kit(u)
    const frontF = 'M31 75H79V87.4C79 88.6 78.2 89.4 77 89.4H33C31.8 89.4 31 88.6 31 87.4Z'
    const sideF = 'M79 75L85 63V76.6L79 89.4Z'
    const rim = 'M31 75H79L85 63H37Z'
    const hole = 'M33.6 73.6H77.6L82.2 64.4H38.2Z'
    const lid = 'M37 63H85L87.2 35.4H39.2Z'
    const lidTop = 'M39.2 35.4H87.2L88.4 33.4H40.4Z'
    const lining = 'M40.6 61.4H81.6L83.4 37.4H42.2Z'
    const pocket = 'M40.8 61.4H81.6L82.3 53.6H41.2Z'
    const cw = 44 / 3
    const bricks = [1, 0].map((row) => [0, 1, 2].map((j) => brick(k, f(33.6 + j * cw + 0.4 + row * 2.3), f(73.6 - row * 4.6), f(cw - 0.8), 2.3, -4.6, 2.8)).join('')).join('')
    const lidBill = (x: number) => {
      const d = `M${x} 52.4H${f(x + 12.4)}L${f(x + 13)} 41.6H${f(x + 0.6)}Z`
      return k.draw([{
        d, fill: BILL,
        inner: `<path d="M${f(x + 0.9)} 51.5H${f(x + 11.5)}L${f(x + 12)} 42.5H${f(x + 1.4)}Z" fill="none" stroke="${BILL_D}" stroke-width=".3"/>` +
          `<ellipse cx="${f(x + 4.4)}" cy="47" rx="2.4" ry="3" fill="${P.white}" stroke="${BILL_D}" stroke-width=".35"/><ellipse cx="${f(x + 4.4)}" cy="47" rx="1.2" ry="1.7" fill="${BILL_D}" opacity=".5"/>` +
          `<path d="M${f(x + 8)} 44.6H${f(x + 11)}M${f(x + 8)} 49.8H${f(x + 11)}" stroke="${BILL_D}" stroke-width=".35"/>` +
          `<text x="${f(x + 9.6)}" y="48.6" ${GEO} font-size="3.2" font-weight="700" fill="${BILL_D}" text-anchor="middle">$</text>` + k.sh(d, 0, 0, 1, 1, 0, 0.5, BILL_D, 0.35),
      }, { d: `M${x} 52.4H${f(x + 12.4)}V53.8H${x}Z`, fill: BILL, inner: `<path d="M${x} 53.1H${f(x + 12.4)}" stroke="${BILL_D}" stroke-width=".25"/>` }], 0.35)
    }
    const strap = 'M41.4 45.6H82.9L82.8 48.2H41.3Z'
    const latch = (x: number) =>
      `<path d="M${x} 76.4H${f(x + 5)}V80.6H${x}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M${f(x + 0.8)} 77.4H${f(x + 4.2)}" stroke="${P.goldL}" stroke-width=".5"/>` +
      `<path d="M${f(x + 1)} 74.6L${f(x + 4)} 74.6L${f(x + 3.6)} 77.4H${f(x + 1.4)}Z" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(x + 2.5)}" cy="79" r=".6" fill="${P.goldD}"/>`
    const handle = 'M48.6 79.4C48.6 85.8 61.4 85.8 61.4 79.4'
    return (
      felt(k, 60) +
      k.floor(60, 89, 30, 3, FELT_D) +
      `<g transform="translate(29.6 50) rotate(-16)">` + bill(k) + `</g>` +
      k.draw([
        { d: lidTop, fill: P.white },
        { d: lid, fill: P.sky1, inner: k.sh(lid, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + hair(85, 60, 86.4, 48, 86.6, 37, 0.4, '#fff', 0.8) },
      ], 0.7) +
      `<path d="${lining}" fill="${P.wine}"/>` + k.sh(lining, 0, 0, 0, 1, 0.1, 0.8, '#3A0F1B', 0.45) +
      `<path d="${lining}" fill="none" stroke="${P.ink}" stroke-width=".45"/>` +
      lidBill(43) + lidBill(55.8) + lidBill(68.6) +
      k.draw([{ d: strap, fill: P.red, inner: k.sh(strap, 0, 0, 0, 1, 0, 0.8, P.wine, 0.4) + `<path d="M41.4 46.3H82.9M41.4 47.5H82.9" stroke="${P.goldL}" stroke-width=".25" stroke-dasharray=".8 .5"/>` }], 0.35) +
      k.draw([{ d: pocket, fill: P.red, inner: k.sh(pocket, 0, 0, 1, 1, 0, 0.8, P.wine, 0.45) + `<path d="M41.6 54.6H81.6" stroke="${P.goldL}" stroke-width=".35" stroke-dasharray="1 .7"/>` }], 0.4) +
      k.draw([
        { d: rim, fill: P.white, inner: k.sh(rim, 0, 0, 1, 0, 0, 0.5, P.blue, 0.3) },
        { d: sideF, fill: P.sky2, inner: k.sh(sideF, 0, 0, 1, 0, 0.3, 0.9, P.mid, 0.45) + hair(81, 76, 83, 71, 83.4, 66, 0.35, '#fff', 0.7) },
        {
          d: frontF, fill: P.sky1,
          inner: k.sh('M60 72H82V92H60Z', 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) + `<path d="M28 72H44V92H28Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.6, 0)}"/>` +
            `<path d="M31 77H79M31 86.6H79" stroke="${P.blue}" stroke-width=".5"/><path d="M31 77.6H79M31 87.2H79" stroke="#fff" stroke-width=".35"/>` +
            hair(34, 82, 50, 81.6, 66, 82, 0.35, P.sky2) + hair(40, 84.4, 56, 84, 74, 84.4, 0.3, P.sky2),
        },
      ], 0.8) +
      `<path d="${hole}" fill="${P.night}"/>` +
      bricks +
      latch(36.6) + latch(68.4) +
      `<path d="M47.4 77.6H50.2V80.4H47.4ZM59.8 77.6H62.6V80.4H59.8Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<path d="${handle}" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="${handle}" fill="none" stroke="#33395A" stroke-width="2.1" stroke-linecap="round"/><path d="M50 82.6C52 84.2 56 84.4 58 83.4" fill="none" stroke="${P.sky}" stroke-width=".45" stroke-linecap="round"/>` +
      `<path d="M31 85.6A3.8 3.8 0 0 0 34.8 89.4H31ZM79 85.6A3.8 3.8 0 0 1 75.2 89.4H79Z" fill="${P.sky2}" stroke="${P.ink}" stroke-width=".4"/>` +
      sparkle(84, 28, 2) + sparkle(27, 68, 1.6) + sparkle(64, 30, 1.4) +
      k.defs()
    )
  },

  // Cuarenta all-in: nadás en fichas como el Tío Rico. La pileta llena de monedas, con el chapuzón que las hace saltar.
  'Pileta de monedas': (u) => {
    const k = kit(u)
    const outer = ellipse(60, 79, 31, 11), innerE = ellipse(60, 79, 26.4, 8.4)
    const wall = 'M33.6 79A26.4 8.4 0 0 1 86.4 79V81.6A26.4 7.4 0 0 0 33.6 81.6Z'
    const gold = ellipse(60, 81, 26.4, 7.4)
    const mound = 'M44 81C48 77.4 53.6 75.4 60 75.4C66.4 75.4 72 77.4 76 81C68 83 52 83 44 81Z'
    const tiles = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return `M${f(60 + Math.cos(a) * 26.4)} ${f(79 + Math.sin(a) * 8.4)}L${f(60 + Math.cos(a) * 31)} ${f(79 + Math.sin(a) * 11)}`
    }).join('')
    const pile = Array.from({ length: 40 }, (_, i) => {
      const row = Math.floor(i / 10), c = i % 10, x = 36 + c * 5.2 + (row % 2) * 2.6, y = 77.6 + row * 2.4
      const inside = ((x - 60) / 25) ** 2 + ((y - 81) / 6.6) ** 2 < 1
      return inside ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.3" ry=".9" fill="${(row + c) % 3 ? P.gold : P.goldL}" stroke="${P.goldD}" stroke-width=".35"/>` : ''
    }).join('')
    const moundCoins = [[50, 80], [55.4, 78.4], [61, 77.2], [66.4, 78.4], [71, 80], [53, 81.4], [58.4, 80.2], [63.8, 80.2], [68.8, 81.4]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="1" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".35"/>`).join('')
    const ladder = (x: number) => `<path d="M${x} 75.6V66C${x} 62.6 ${f(x + 5)} 62.6 ${f(x + 5)} 66V78" fill="none" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M${x} 75.6V66C${x} 62.6 ${f(x + 5)} 62.6 ${f(x + 5)} 66V78" fill="none" stroke="${P.white}" stroke-width="1" stroke-linecap="round"/><path d="M${f(x + 0.3)} 66.4V75" stroke="${P.sky}" stroke-width=".35"/>`
    const arcs: [number, number, number, number][] = [[59.4, 40, 60.4, 26], [49, 46, 37.6, 56], [71, 46, 82.4, 56]]
    const ts = [0.24, 0.42, 0.6, 0.78, 0.96]
    const splash = arcs.map(([cx, cy, x1, y1], i) =>
      along(60, 74, cx, cy, x1, y1, ts).map((q, j) => ({ q, i, j })).reverse().map(({ q, i: a, j }) =>
        coin(k, f(q.x), f(q.y), f(3.4 - j * 0.34), (a * 47 + j * 61) % 180 - 90, 0.25 + ((a * 3 + j * 5) % 7) / 9)).join('')).join('')
    const trails = arcs.map(([cx, cy, x1, y1]) => hair(60, 72, cx, cy, x1, y1, 0.6, P.goldL, 0.7)).join('')
    return (
      felt(k, 54) +
      k.sun(60, 56, 15, 46, 28, false) +
      k.shade(ellipse(60, 54, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      k.draw([{ d: outer, fill: P.white, inner: k.sh(outer, 0, 0, 1, 1, 0, 0.6, P.blue, 0.35) }], 0.75) +
      `<path d="${tiles}" stroke="${P.sky2}" stroke-width=".4"/>` + `<path d="${ellipse(60, 79, 28.7, 9.7)}" fill="none" stroke="${P.sky2}" stroke-width=".35"/>` +
      `<path d="${innerE}" fill="${P.sky}" stroke="${P.ink}" stroke-width=".5"/>` + `<path d="${wall}" fill="${P.sky}"/>` +
      `<path d="M36 79.4V81M40 77.6V79.6M45 76.4V78.8M50 75.6V78M55 75V77.6M60 74.8V77.4M65 75V77.6M70 75.6V78M75 76.4V78.8M80 77.6V79.6M84 79.4V81" stroke="${P.blue}" stroke-width=".3"/>` +
      `<path d="${gold}" fill="${P.gold}"/>` + k.clip(gold, pile + k.sh(gold, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.4)) +
      `<path d="${innerE}" fill="none" stroke="${P.ink}" stroke-width=".5"/>` +
      ladder(82.4) +
      trails +
      `<path d="${mound}" fill="${P.gold}"/>` + k.clip(mound, moundCoins + k.sh(mound, 0, 0, 1, 1, 0, 0.6, P.goldD, 0.4)) +
      `<path d="${ellipse(60, 81, 19, 3.2)}" fill="none" stroke="${P.goldL}" stroke-width=".7" stroke-dasharray="2.4 1.4"/>` +
      splash +
      flyingChip(k, 76, 38, 2.8, RED, 25, 0.55) + flyingChip(k, 44, 38.6, 2.6, BLUE, -35, 0.7) +
      sparkle(46, 30, 2.4, '#fff') + sparkle(34, 80, 1.6) + sparkle(88, 76, 1.8) +
      k.defs()
    )
  },

  // ── Realeza ────────────────────────────────────────────────────────

  // Una escalera real: la corona de cartón cortada a tijera y pintada a medias, delante del abanico del diez al as.
  'Corona de cartón': (u) => {
    const k = kit(u)
    const KR = '#C99A64', KR_D = '#8E6237', KR_IN = '#B88A58'
    const RX = 24, CY = 72, RY = 5, H = 14
    const fy = (uu: number) => RY * Math.sqrt(Math.max(0, 1 - uu * uu))
    // Puntas cortadas a tijera: ninguna sale igual.
    const TIP: Record<string, number> = { '-0.8': 12.4, '-0.4': 15.6, '0': 18, '0.4': 14.8, '0.8': 12.8 }
    const fu = [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]
    const frontTop = fu.map((uu, i) => (i ? 'L' : 'M') + `${f(60 + uu * RX + (TIP[String(uu)] ? (uu > 0 ? 0.6 : -0.4) : 0))} ${f(CY + fy(uu) - (TIP[String(uu)] ?? 0))}`).join('')
    const front = `${frontTop}L${60 + RX} ${CY + H}A${RX} ${RY} 0 0 1 ${60 - RX} ${CY + H}Z`
    const bu = [-1, -0.6, -0.2, 0.2, 0.6, 1]
    const back = bu.map((uu, i) => {
      const t = Math.abs(uu) === 1 ? 0 : Math.abs(uu) < 0.5 ? 5.4 : 4.4
      const mid = i ? `L${f(60 + ((bu[i - 1] + uu) / 2) * RX)} ${f(CY - fy((bu[i - 1] + uu) / 2) + 0.6)}` : ''
      return mid + (i ? 'L' : 'M') + `${f(60 + uu * RX)} ${f(CY - fy(uu) - t)}`
    }).join('') + `L${60 + RX} ${CY}A${RX} ${RY} 0 0 1 ${60 - RX} ${CY}Z`
    const paint = k.clip(front,
      `<path d="${front}" fill="${P.gold}"/>` + `<path d="${front}" fill="none" stroke="${KR}" stroke-width="3.4" stroke-linejoin="round"/>` +
      `<path d="M49 82.4C50.6 81.2 52.6 81.8 53.8 83.2C52.2 84.6 50 84.2 49 82.4ZM68.6 72.4C70.2 71.6 71.6 72.4 71.8 73.8C70.4 74.4 69 73.8 68.6 72.4ZM39.6 76C40.6 75 42 75.4 42.4 76.6C41.4 77.4 40.2 77.2 39.6 76Z" fill="${KR}"/>` +
      Array.from({ length: 10 }, (_, i) => hair(37 + (i % 3) * 2, 66 + i * 2.4, 60, 65 + i * 2.4 + (i % 2), 83 - (i % 2) * 3, 66 + i * 2.4, 0.5, i % 2 ? P.goldL : P.goldD, 0.75)).join('') +
      k.sh(front, 0, 0, 1, 0, 0, 0.85, P.goldD, 0.45) + `<path d="M34 50H46V92H34Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>`)
    const gem = (x: number, y: number, r: number, c: string) =>
      `<path d="M${f(x - r)} ${y}C${f(x - r)} ${f(y - r * 1.1)} ${f(x + r * 1.1)} ${f(y - r)} ${f(x + r)} ${f(y + 0.2)}C${f(x + r * 0.9)} ${f(y + r)} ${f(x - r * 0.8)} ${f(y + r * 1.1)} ${f(x - r)} ${y}Z" fill="${c}" stroke="${P.ink}" stroke-width=".55"/>` +
      hair(x - r * 0.6, y + r * 0.3, x, y - r * 0.6, x + r * 0.6, y - r * 0.2, 0.5, '#fff', 0.7) + hair(x - r * 0.4, y + r * 0.7, x + r * 0.2, y, x + r * 0.7, y + r * 0.3, 0.4, '#000', 0.25)
    const fan = ['10', 'J', 'Q', 'K', 'A'].map((r, i) => `<g transform="translate(60 98) rotate(${-34 + i * 17}) translate(0 -40) scale(1.06)">${pcard(k, r, 'h')}</g>`).join('')
    return (
      felt(k, 54) +
      k.shade(ellipse(60, 52, 30, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.4, 0), P.goldL, 0.35) +
      fan +
      k.floor(60, 91, 26, 3, FELT_D) +
      k.draw([{ d: back, fill: KR_IN, inner: k.sh(back, 0, 0, 1, 0, 0.2, 0.9, KR_D, 0.45) + Array.from({ length: 12 }, (_, i) => `<path d="M${38 + i * 4} 54V74" stroke="${KR_D}" stroke-width=".3" opacity=".5"/>`).join('') }], 0.6) +
      k.draw([{ d: front, fill: KR }], 0.8) + paint +
      k.clip(front, k.sh('M80.6 70H86V92H80.6Z', 0, 0, 1, 0, 0.6, 0, KR_D, 0.5)) + `<path d="M80.6 74.6V89.4" stroke="${P.ink}" stroke-width=".55"/>` +
      `<path d="M78.6 78H82.6M78.6 84.4H82.6" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M78.6 78H82.6M78.6 84.4H82.6" stroke="${P.sky1}" stroke-width=".6" stroke-linecap="round"/>` +
      gem(60, 81, 3.4, P.red) + gem(46, 80, 2.4, P.sky) + gem(72, 80.4, 2.4, P.green) +
      sparkle(32, 40, 2.2) + sparkle(90, 50, 1.6) + sparkle(56, 84, 1.2, '#fff') +
      k.defs()
    )
  },

  // Dos escaleras reales: esto ya es linaje. El cetro de oro rematado en una pica de esmalte, con su borla, entre laureles.
  'Cetro dorado': (u) => {
    const k = kit(u)
    const spadeO = `<path d="${SUIT.s}" transform="translate(0 -25) scale(2.3)" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/>`
    const spadeI = `<g transform="translate(0 -25) scale(1.82)"><path d="${SUIT.s}" fill="${P.night}"/>${k.clip(SUIT.s, k.sh(SUIT.s, 0, 0, 1, 1, 0.1, 0.9, '#0B1233', 0.4) + `<path d="M-6 -6H-1V6H-6Z" fill="${k.lin(P.mid, 0, 0, 1, 0, 0.9, 0)}"/>`)}</g>`
    const filig = `<path d="M0 -20.6C-2.4 -22 -4.4 -24.4 -4 -27C-3.8 -28.6 -2.2 -29 -1.6 -27.8M0 -20.6C2.4 -22 4.4 -24.4 4 -27C3.8 -28.6 2.2 -29 1.6 -27.8M0 -21V-31" fill="none" stroke="${P.gold}" stroke-width=".5" stroke-linecap="round"/>`
    const curl = (sgn: number) =>
      `<g transform="translate(0 -13.2) scale(${sgn} 1)"><path d="M2 0C6.4 -.4 10.6 -2.6 11.2 -6.2C11.6 -8.8 9 -10.4 7.2 -9C5.8 -7.8 6.6 -5.8 8.4 -6.2" fill="none" stroke="${P.ink}" stroke-width="2.8" stroke-linecap="round"/>` +
      `<path d="M2 0C6.4 -.4 10.6 -2.6 11.2 -6.2C11.6 -8.8 9 -10.4 7.2 -9C5.8 -7.8 6.6 -5.8 8.4 -6.2" fill="none" stroke="${P.gold}" stroke-width="1.3" stroke-linecap="round"/><path d="M3 -.8C6.4 -1.4 9.4 -3 10.2 -5.6" fill="none" stroke="${P.goldL}" stroke-width=".4" stroke-linecap="round"/><circle cx="8.4" cy="-6.2" r=".7" fill="${P.goldL}"/></g>`
    const shaft = 'M-2.9 -2.6L-2.4 27H2.4L2.9 -2.6Z'
    const spiral = Array.from({ length: 12 }, (_, i) => `M-2.9 ${f(-1 + i * 2.4)}L2.9 ${f(0.8 + i * 2.4)}`).join('')
    const knop = (y: number, rx: number, ry: number) => k.draw([{ d: ellipse(0, y, rx, ry), fill: P.gold, inner: k.sh(ellipse(0, y, rx, ry), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<path d="M${-rx} ${y}H${rx}" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
      Array.from({ length: 7 }, (_, i) => `<circle cx="${f(-rx * 0.8 + (i * rx * 1.6) / 6)}" cy="${f(y + ry * 0.35)}" r=".45" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".15"/>`).join('')
    const collar = 'M-5.6 -15.4C-3.6 -11.6 3.6 -11.6 5.6 -15.4L4 -10.2H-4Z'
    const orb = ellipse(0, -6.4, 5, 4)
    const pommel = ellipse(0, 30.6, 3.8, 3.6)
    const pearls = along(-10.4, -23, 0, -37.4, 10.4, -23, [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92]).map((q) => `<circle cx="${f(q.x * 0.98)}" cy="${f(q.y + 1.6)}" r=".6" fill="${P.white}" stroke="${P.goldD}" stroke-width=".2"/>`).join('')
    const tassel = 'M-1.6 0H1.6L3.2 8.6C1.4 9.6 -1.4 9.6 -3.2 8.6Z'
    return (
      felt(k, 56) +
      k.sun(60, 56, 16, 46, 28, false) +
      k.shade(ellipse(60, 54, 22, 28), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.7, 0), P.goldL, 0.45) +
      laurel(50, 98, 30, 88, 28, 60, 8) + laurel(70, 98, 90, 88, 92, 60, 8, true) +
      `<g transform="translate(60 59.4) rotate(12)">` +
      k.cast([shaft, ellipse(0, 30.6, 3.8, 3.6), ellipse(0, -6.4, 5, 4)], 2, 2) +
      `<g transform="translate(0 -25) scale(2.3)">` + k.cast([SUIT.s], 0.9, 0.9) + `</g>` +
      curl(1) + curl(-1) +
      k.draw([{ d: shaft, fill: P.gold, inner: k.sh(shaft, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="${spiral}" stroke="${P.goldD}" stroke-width=".5"/><path d="M-1.4 -2V26" stroke="${P.goldL}" stroke-width=".55"/>` }], 0.6) +
      knop(9.6, 4.2, 2.1) + knop(21.6, 3.6, 1.8) +
      k.draw([{ d: pommel, fill: P.gold, inner: k.sh(pommel, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) }, { d: 'M-1.6 33.6H1.6L.9 36.8H-.9Z', fill: P.gold }], 0.5) +
      `<circle cx="0" cy="30.6" r="1.5" fill="${P.red}" stroke="${P.ink}" stroke-width=".35"/><circle cx="-.5" cy="30.1" r=".4" fill="#fff"/>` +
      `<path d="M3.6 -5C6.6 -2 7.6 1 7.4 4.4" fill="none" stroke="${P.ink}" stroke-width="1.3"/><path d="M3.6 -5C6.6 -2 7.6 1 7.4 4.4" fill="none" stroke="${P.red}" stroke-width=".6"/>` +
      `<g transform="translate(7.4 5.4) rotate(-12)">` + k.draw([{ d: tassel, fill: P.gold, inner: k.sh(tassel, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + `<path d="M-1.6 3V9M-.6 2.6V9.4M.4 2.6V9.4M1.4 3V9.2M2.4 4V8.8" stroke="${P.goldD}" stroke-width=".3"/>` }], 0.4) +
      `<path d="M-2 .4H2V2.2H-2Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".3"/><circle cx="0" cy="-.6" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/></g>` +
      k.draw([{ d: orb, fill: P.gold, inner: k.sh(orb, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-5 -6.4H5" stroke="${P.goldD}" stroke-width=".4"/><path d="M-3.4 -8.6C-2.4 -9.6 -1 -10 .4 -10" fill="none" stroke="#fff" stroke-width=".5" stroke-linecap="round"/>` }], 0.5) +
      `<circle cx="0" cy="-6.2" r="1.8" fill="${P.red}" stroke="${P.ink}" stroke-width=".4"/><circle cx="-.5" cy="-6.7" r=".5" fill="#fff"/>` +
      k.draw([{ d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.45) + hair(-3.8, -13.8, -2.6, -12.2, -1.4, -10.8, 0.4, P.goldD) + hair(3.8, -13.8, 2.6, -12.2, 1.4, -10.8, 0.4, P.goldD) + hair(0, -13, 0, -11.6, 0, -10.4, 0.35, P.goldD) }], 0.45) +
      spadeO + spadeI + filig + pearls +
      `<path d="M-5 -29.6C-4.2 -32.4 -2.4 -34.6 0 -36.2" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".85"/>` +
      `<circle cx="0" cy="-20" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><circle cx="0" cy="-20" r="1.2" fill="${P.red}"/><circle cx="-.4" cy="-20.4" r=".35" fill="#fff"/>` +
      `<circle cx="0" cy="-38" r="1.5" fill="${P.white}" stroke="${P.ink}" stroke-width=".4"/>` +
      `</g>` +
      sparkle(86, 30, 2.4, '#fff') + sparkle(32, 42, 1.8) +
      k.defs()
    )
  },

  // Cuatro escaleras reales: sos el rey del carnaval. La corona de Momo con su penacho de plumas, serpentinas y papel picado.
  'Rey Momo': (u) => {
    const k = kit(u)
    const serp = (x0: number, y0: number, dx: number, dy: number, r: number, turns: number, c: string) => {
      const N = 60
      const d = Array.from({ length: N + 1 }, (_, i) => {
        const t = i / N, a = t * turns * Math.PI * 2
        return `${i ? 'L' : 'M'}${f(x0 + dx * t + Math.cos(a) * r * (1 - t * 0.3))} ${f(y0 + dy * t + Math.sin(a) * r * 0.55)}`
      }).join('')
      return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`
    }
    const confetti = [[30, 50, P.red, 20], [90, 44, P.sky, -30], [38, 32, P.white, 50], [86, 28, P.gold, 10], [26, 70, P.sky, 70], [94, 66, P.red, -10], [48, 22, P.sky, 30], [73, 20, P.red, -40]]
      .map(([x, y, c, r]) => `<rect x="-1.3" y="-.75" width="2.6" height="1.5" fill="${c}" stroke="${P.ink}" stroke-width=".3" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')
    return (
      felt(k, 54) +
      k.sun(60, 54, 15, 46, 28, false) +
      k.shade(ellipse(60, 50, 26, 26), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      ostrich(k, 58, 66, 42, 30, 28, 46, 6, P.red, P.wine) +
      ostrich(k, 62, 66, 78, 30, 92, 46, 6, P.sky, P.blue) +
      ostrich(k, 60, 66, 56, 30, 68, 24, 6.8, P.white, P.sky2) +
      k.floor(60, 89, 24, 3, FELT_D) +
      `<g transform="translate(60 72)">` + momoCrown(k) + `</g>` +
      serp(41.6, 77, -16, -10, 4.6, 1.5, P.sky) + serp(78.4, 77, 16, -10, 4.6, 1.5, P.red) +
      confetti +
      sparkle(46, 36, 2, '#fff') + sparkle(34, 80, 1.6) + sparkle(88, 80, 1.4) +
      k.defs()
    )
  },

  // ── Cara de póker ──────────────────────────────────────────────────

  // Tres bluffs mostrados: ni pestañeaste. La máscara de porcelana sin gesto y el 7-2 que ganó con nada.
  'Cara de póker': (u) => {
    const k = kit(u)
    const ribbon = (sgn: number) => {
      const d = 'M17.2 -4.6C20 -2 21.4 4 20.6 10C20 15 21 19.6 23.4 23.4L20.4 22.6L19.6 25.6C17.4 21.4 17 16 17.6 11C18.2 6 17.8 0 15.6 -2.6Z'
      return `<g transform="translate(60 50) scale(${sgn} 1)">` + k.draw([{ d, fill: P.red, inner: k.sh(d, 0, 0, 1, 0, 0, 0.9, P.wine, 0.45) + hair(18.6, 2, 19.4, 10, 18.8, 18, 0.4, P.wine) }], 0.5) + `</g>`
    }
    return (
      felt(k, 50) +
      ribbon(1) + ribbon(-1) +
      `<g transform="translate(60 50)">` + k.cast(['M0 -25C10.6 -25 17.6 -17 17.6 -4C17.6 8 13.4 18.6 6.6 23.6C2 26.6 -2 26.6 -6.6 23.6C-13.4 18.6 -17.6 8 -17.6 -4C-17.6 -17 -10.6 -25 0 -25Z'], 2.2, 2.4, FELT_D) + mask(k) + `</g>` +
      `<g transform="translate(51 80) rotate(-14)">` + pcard(k, '7', 'c') + `</g>` +
      `<g transform="translate(68 80.6) rotate(12)">` + pcard(k, '2', 'd') + `</g>` +
      sparkle(86, 34, 2.2) + sparkle(32, 30, 1.6) +
      k.defs()
    )
  },

  // Doce bluffs: jugás de noche con lentes negros. Los anteojos apoyados sobre las cartas tapadas, bajo la lámpara.
  'Anteojos oscuros': (u) => {
    const k = kit(u)
    const FR = '#1E2440'
    const frame = 'M31.4 45.4C31.4 42 33.6 40.4 36.8 40.4H55C58.6 40.4 60.4 42.4 59.8 46L58.4 55.8C57.4 61.4 53.6 64 48.6 64H41.4C36 64 32.6 61.4 32 56.2Z'
    const lens = 'M33.6 46.2C33.6 44.4 34.8 43.4 36.8 43.4H54.6C56.6 43.4 57.8 44.6 57.4 46.6L56 55.4C55.2 59.6 52.6 61.6 48.6 61.6H41.4C37.4 61.6 35.2 59.6 34.6 55.6Z'
    const bridge = 'M58.6 42.2C59.6 41.6 60.4 41.6 61.4 42.2V46.4C60.4 45.8 59.6 45.8 58.6 46.4Z'
    const glass = (d: string, glint: string) =>
      `<path d="${d}" fill="${P.night}"/>` + k.clip(d, `<path d="${d}" fill="${k.lin(P.mid, 0, 0, 0, 1, 0, 0.95)}"/>` + glint + k.sh(d, 0, 0, 1, 1, 0.2, 0.8, '#0A1030', 0.4))
    return (
      `<rect width="120" height="130" fill="${FELT_D}"/>` +
      k.shade(FULL, k.rad(FELT, 0.5, 0.6, 0.5, 1, 0), FELT, 0.5) +
      k.shade('M46 0H74L104 104H16Z', k.lin(FELT_L, 0, 0, 0, 1, 0.55, 0), FELT_L, 0.35) +
      `<circle cx="60" cy="60" r="38.4" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round" opacity=".4"/>` +
      [[28, 30], [92, 34], [25, 52], [96, 70], [84, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 0.5 : 0.7}" fill="${P.paper}" opacity=".7"/>`).join('') +
      k.floor(60, 76, 34, 8, '#021B13') +
      flatBack(k, 47, 72, -16, 1.32, 0.48) + flatBack(k, 72, 74, 12, 1.32, 0.48, ['7', 'c']) +
      k.floor(60, 68, 28, 3, '#021B13') +
      `<g transform="translate(0 3.4)">` +
      `<path d="M33 52H87" stroke="${P.ink}" stroke-width="3.4"/><path d="M33 52H87" stroke="${FR}" stroke-width="2"/>` +
      k.draw([{ d: frame, fill: FR }, { d: mirror(frame), fill: FR }, { d: bridge, fill: FR }], 0.75) +
      `<path d="M33 44C34 41.6 36 41.2 38 41.2H54" fill="none" stroke="${P.blue}" stroke-width=".6" stroke-linecap="round"/><path d="M66 41.2H82C84 41.2 86 41.6 87 44" fill="none" stroke="${P.blue}" stroke-width=".5" stroke-linecap="round" opacity=".7"/>` +
      glass(lens, `<path d="M30 40H46L34 66H30Z" fill="${k.lin(P.sky, 0, 0, 1, 1, 0.6, 0)}"/>`) +
      glass(mirror(lens), `<path d="M62 40H70L64 66H62Z" fill="${k.lin(P.sky, 0, 0, 1, 1, 0.35, 0)}"/>`) +
      `<path d="M36.6 46.2C38 45 42 44.8 45 45" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/>` +
      `<path d="M65.6 46.2C67 45 70 44.8 72 45" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/>` +
      `<path d="M74.4 49.6H79.4L78.8 56.8H73.8Z" fill="${P.white}" opacity=".9"/><path d="M76.6 54.2C75.4 53.2 75.6 51.8 76.6 52.6C77.6 51.8 77.8 53.2 76.6 54.2Z" fill="${P.red}"/>` +
      `<path d="M40 58.6H51" stroke="${P.sky}" stroke-width=".5" opacity=".6"/>` +
      [[33.6, 43.6], [35.4, 42.6], [86.4, 43.6], [84.6, 42.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".65" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".2"/>`).join('') +
      sparkle(51, 47.6, 1.8, '#fff') + `</g>` + sparkle(90, 28, 1.8, P.paper) +
      k.defs()
    )
  },

  // Treinta y cinco bluffs: un misterio de piedra que nadie descifra. La esfinge echada sobre su pedestal, con los palos en el cartucho.
  'Esfinge': (u) => {
    const k = kit(u)
    const slab = 'M27.4 77.8H92.6V81.6H27.4Z'
    const ped = 'M33.4 81.6H86.6L81.6 90.6H38.4Z'
    const cart = ellipse(60, 86.2, 13.6, 3.2)
    return (
      felt(k, 50) +
      k.sun(64, 50, 16, 48, 28, false) +
      k.shade(ellipse(72, 42, 22, 22), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.75, 0), P.goldL, 0.45) +
      k.draw([
        { d: ped, fill: SAND, inner: k.sh(ped, 0, 0, 1, 0, 0, 0.8, SAND_D, 0.45) + `<path d="M36 84H84" stroke="${SAND_D}" stroke-width=".35"/>` },
        { d: slab, fill: P.goldL, inner: k.sh(slab, 0, 0, 1, 1, 0, 0.7, SAND_D, 0.45) + `<path d="M27.4 79.4H92.6" stroke="${SAND_D}" stroke-width=".35"/>` },
      ], 0.7) +
      `<path d="${cart}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".5"/><path d="${ellipse(60, 86.2, 12.4, 2.4)}" fill="none" stroke="${P.goldD}" stroke-width=".35"/>` +
      `<path d="M73.6 84.2V88.2" stroke="${P.ink}" stroke-width=".7"/>` +
      pip('s', 51.6, 86.2, 0.36) + pip('h', 57.2, 86.2, 0.36) + pip('d', 62.8, 86.2, 0.36) + pip('c', 68.4, 86.2, 0.36) +
      k.floor(58, 78, 30, 1.6, SAND_D) +
      `<g transform="translate(57.4 77.8)">` + sphinx(k) + `</g>` +
      sparkle(36, 40, 2.4, '#fff') + sparkle(30, 58, 1.4) +
      k.defs()
    )
  },
}
