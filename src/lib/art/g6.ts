// Ilustraciones de medallas: Dominó, Virus!, El Impostor, Carcassonne, Scrabble y Among Us.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Primitivas ────────────────────────────────────────────────────────
const sw = (w?: number) => (w === undefined ? '' : ` style="stroke-width:${w}"`)
const ol = (d: string, fill: string, w?: number) => `<path class="m-ol"${sw(w)} d="${d}" fill="${fill}"/>`
const ci = (x: number, y: number, r: number, fill: string, w?: number) => `<circle class="m-ol"${sw(w)} cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"/>`
const el = (x: number, y: number, rx: number, ry: number, fill: string, w?: number) => `<ellipse class="m-ol"${sw(w)} cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"/>`
const re = (x: number, y: number, w: number, h: number, rx: number, fill: string, s?: number) => `<rect class="m-ol"${sw(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(rx)}" fill="${fill}"/>`
const ln = (d: string, w = 2, c = D, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`
const sh = (d: string, w = 2.2, o = 0.6) => ln(d, w, '#fff', `opacity="${o}"`)
const dot = (x: number, y: number, r: number, c = D) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}"/>`
const eye = (x: number, y: number, r = 2) => dot(x, y, r) + dot(x + r * 0.35, y - r * 0.4, r * 0.38, '#fff')
const blush = (x: number, y: number, r = 2.6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#FF8FA3" opacity=".7"/>`
const OUT = 'stroke="currentColor" stroke-width="2.6" paint-order="stroke" stroke-linejoin="round"'
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * 0.38, 4)}" fill="${c}"/>`
const drop = (x: number, y: number, s = 1, c = '#74C0FC') =>
  `<path class="m-ol" style="stroke-width:${f(1.6)}" transform="translate(${x} ${y}) scale(${s})" d="M0 -5 C2 -2 3.4 0 3.4 1.8 A3.4 3.4 0 0 1 -3.4 1.8 C-3.4 0 -2 -2 0 -5Z" fill="${c}"/>`
const g = (tr: string, body: string) => `<g transform="${tr}">${body}</g>`

// ── Piezas de juego ───────────────────────────────────────────────────
const MEEPLE = 'M-5 -6 C-10 -8 -9 -21 0 -21 C9 -21 10 -8 5 -6 L16 -4 C22 -3 22 6 16 6 L10 5 L15 19 C16 22 14 23 11 23 L3 23 C2 18 1 15 0 13 C-1 15 -2 18 -3 23 L-11 23 C-14 23 -16 22 -15 19 L-10 5 L-16 6 C-22 6 -22 -3 -16 -4Z'
type Face = 'happy' | 'proud' | 'sleepy' | 'none'
const mEyes = (k: Face) =>
  k === 'happy' ? `<circle cx="-3.4" cy="-14" r="1.6" fill="${D}"/><circle cx="3.4" cy="-14" r="1.6" fill="${D}"/><path d="M-3 -10.2 Q0 -7.6 3 -10.2" fill="none" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/>`
  : k === 'proud' ? `<path d="M-5 -13.6 Q-3.4 -15.8 -1.8 -13.6 M1.8 -13.6 Q3.4 -15.8 5 -13.6 M-2.6 -10.4 Q0 -7.8 2.6 -10.4" fill="none" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/>`
  : k === 'sleepy' ? `<path d="M-5 -13.6 Q-3.4 -12 -1.8 -13.6 M1.8 -13.6 Q3.4 -12 5 -13.6" fill="none" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="0" cy="-9.4" rx="1.6" ry="1.3" fill="${D}"/>`
  : ''
/** Meeple centrado en (x,y); mide ~44 de alto con s=1. */
const meeple = (x: number, y: number, s: number, fill: string, face: Face = 'happy', rot = 0, extra = '', pre = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${pre}<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="${MEEPLE}" fill="${fill}"/>` +
  `<ellipse cx="-4" cy="-17" rx="2.2" ry="1.4" fill="#fff" opacity=".7" transform="rotate(-30 -4 -17)"/><path d="M-15 -1 L-9 -2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>` +
  (face !== 'none' ? `<circle cx="-6" cy="-11.5" r="1.7" fill="#FF8FA3" opacity=".7"/><circle cx="6" cy="-11.5" r="1.7" fill="#FF8FA3" opacity=".7"/>` : '') +
  mEyes(face) + extra + `</g>`
const coin = (x: number, y: number, r: number) =>
  `<circle class="m-ol" style="stroke-width:2" cx="${x}" cy="${y}" r="${r}" fill="#FCC419"/><circle cx="${x}" cy="${y}" r="${f(r * 0.62)}" fill="none" stroke="#E67700" stroke-width="1.4"/>` +
  `<ellipse cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.4)}" rx="${f(r * 0.22)}" ry="${f(r * 0.13)}" fill="#fff" transform="rotate(-40 ${f(x - r * 0.4)} ${f(y - r * 0.4)})"/>`
const crown = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z" fill="#FFD43B"/>` +
  `<circle cx="0" cy="1.5" r="1.8" fill="#E03131"/><circle cx="-6" cy="2" r="1.2" fill="#4DABF7"/><circle cx="6" cy="2" r="1.2" fill="#4DABF7"/></g>`

const PIPS: Record<number, [number, number][]> = {
  0: [], 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}
const pips = (n: number, cx: number, cy: number, s: number, c: string) => PIPS[n].map(([a, b]) => dot(cx + a * s, cy + b * s, s * 0.4, c)).join('')
/** Ficha de dominó vertical de ancho w (alto 2w), con valores a (arriba) y b (abajo). */
const dom = (x: number, y: number, w: number, a: number, b: number, rot = 0, s = 2.2, fill = '#FFFBF4', pc = D) =>
  g(`translate(${x} ${y}) rotate(${rot})`,
    re(-w / 2, -w, w, w * 2, w * 0.2, fill, s) + ln(`M${f(-w * 0.32)} 0 H${f(w * 0.32)}`, s * 0.6, pc === '#fff' ? '#fff' : D) +
    pips(a, 0, -w / 2, w * 0.26, pc) + pips(b, 0, w / 2, w * 0.26, pc) + dot(0, 0, w * 0.07, '#ADB5BD'))
/** Ficha de letra del Scrabble. */
const tile = (x: number, y: number, s: number, L: string, n: string, rot = 0, fill = '#F5DDA9') =>
  g(`translate(${x} ${y}) rotate(${rot})`,
    re(-s / 2, -s / 2, s, s * 1.1, s * 0.18, '#C9965B', f(Math.min(2.4, s * 0.17))) + re(-s / 2, -s / 2, s, s, s * 0.18, fill, f(Math.min(2.4, s * 0.17))) +
    sh(`M${f(-s * 0.3)} ${f(-s * 0.34)} H${f(s * 0.05)}`, f(s * 0.07), 0.8) +
    t(-s * 0.06, s * 0.24, f(s * 0.62), L, D) + t(s * 0.3, s * 0.4, f(s * 0.22), n, D))
/** Tripulante (estilo Among Us), mirando a la derecha. ~38 de alto con s=1. */
const crew = (x: number, y: number, s: number, c: string, c2: string, extra = '', rot = 0, visor = '#9BE3F5') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    re(-16, -6, 7, 17, 3, c2, f(2.6 / s)) +
    ol('M-11 -4 C-11 -20 11 -20 11 -4 V17 C11 21 3.5 21 3.5 17 V14 H-3.5 V17 C-3.5 21 -11 21 -11 17Z', c, f(2.6 / s)) +
    `<path d="M-11 4 C-6 8 4 8 11 4 V14 H-11Z" fill="${c2}" opacity=".35"/>` +
    sh('M-7 -9 C-6 -12 -4 -14 -1 -15', 2, 0.5) +
    ol('M-1 -11 H8 C13 -11 13 -2 8 -2 H-1 C-6 -2 -6 -11 -1 -11Z', visor, f(2.4 / s)) +
    sh('M1 -8.4 H7', 2, 0.85) + extra)
/** Virus del Virus!: bolita con antenitas y cara. */
const germ = (x: number, y: number, r: number, c: string, mood: 'mean' | 'happy' | 'sad' = 'mean') => {
  let k = ''
  const w = f(Math.min(2.2, r * 0.3))
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 + 22.5) * Math.PI / 180
    k += ln(`M${f(x + r * 0.8 * Math.cos(a))} ${f(y + r * 0.8 * Math.sin(a))} L${f(x + r * 1.25 * Math.cos(a))} ${f(y + r * 1.25 * Math.sin(a))}`, w + 1, D) +
      ci(x + r * 1.3 * Math.cos(a), y + r * 1.3 * Math.sin(a), r * 0.2, c, w)
  }
  const ex = r * 0.36, ey = y - r * 0.08
  const face = mood === 'mean'
    ? ln(`M${f(x - ex - r * .3)} ${f(ey - r * .42)} L${f(x - ex + r * .25)} ${f(ey - r * .22)} M${f(x + ex + r * .3)} ${f(ey - r * .42)} L${f(x + ex - r * .25)} ${f(ey - r * .22)}`, w) +
      dot(x - ex, ey, r * 0.15) + dot(x + ex, ey, r * 0.15) + ol(`M${f(x - r * .4)} ${f(y + r * .3)} Q${x} ${f(y + r * .7)} ${f(x + r * .4)} ${f(y + r * .3)}Z`, '#fff', f(w * .8))
    : mood === 'happy'
      ? dot(x - ex, ey, r * 0.15) + dot(x + ex, ey, r * 0.15) + ln(`M${f(x - r * .3)} ${f(y + r * .3)} Q${x} ${f(y + r * .6)} ${f(x + r * .3)} ${f(y + r * .3)}`, w)
      : dot(x - ex, ey, r * 0.15) + dot(x + ex, ey, r * 0.15) + ln(`M${f(x - r * .3)} ${f(y + r * .5)} Q${x} ${f(y + r * .2)} ${f(x + r * .3)} ${f(y + r * .5)}`, w)
  return k + ci(x, y, r, c, w) + `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .45)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" opacity=".8" transform="rotate(-35 ${f(x - r * .4)} ${f(y - r * .45)})"/>` + face
}
/** Mano señalando hacia +x con la punta del dedo en (x,y). */
const pointer = (x: number, y: number, rot: number, skin = '#F4BE8F', sleeve = '#4DABF7') =>
  g(`translate(${x} ${y}) rotate(${rot})`,
    re(-25, -6, 7, 12, 2.5, sleeve, 2) + re(-19, -5, 10, 10, 3.6, skin, 2) + re(-11, -5, 11, 4.2, 2.1, skin, 2) +
    ln('M-16 1 H-11 M-16 3.6 H-11.5', 1.1, D, 'opacity=".5"'))
const chainTiles = (y: number, xs: number[], w: number, vals: [number, number][], s = 2) =>
  xs.map((x, i) => dom(x, y, w, vals[i][0], vals[i][1], 90, s)).join('')
const sack = (x: number, y: number, s: number) =>
  g(`translate(${x} ${y}) scale(${s})`,
    ol('M-6 -9 L-3 -5 C-11 -2 -12 10 -6 11 H6 C12 10 11 -2 3 -5 L6 -9 C2 -7 -2 -7 -6 -9Z', '#C69C6D', f(2.2 / s)) +
    ln('M-4 -5 H4', f(2 / s)) + t(0, 7.4, 9, '$', '#7C4A1E'))

export const G6_ART: Record<string, (u: number) => string> = {
  // ═══ DOMINÓ ═══
  'Mesa de plaza': () =>
    el(60, 92, 34, 6, '#8CE99A') +
    ol('M53 74 C55 62 53 52 47 44 L55 46 L60 39 L65 46 L73 44 C67 52 65 62 67 74Z', '#8B5A3C') + ln('M58 56 C59 62 58 68 59 72', 1.6, '#6B3E1F') +
    ol('M32 46 C24 44 24 34 32 32 C32 24 42 20 50 24 C54 16 68 16 72 24 C80 20 90 26 88 32 C96 34 96 46 88 46 C84 52 72 52 66 48 C60 52 48 52 44 48 C40 52 32 50 32 46Z', '#51CF66') +
    ln('M38 40 Q44 36 50 40 M60 32 Q66 28 72 32 M70 44 Q76 40 82 44', 1.8, '#2F9E44') + sh('M34 34 C35 29 39 26 44 26', 2.4, 0.6) +
    ol('M54 76 H66 L68 90 H52Z', '#ADB5BD') + el(60, 91, 12, 3, '#868E96') +
    ol('M32 70 V74 C32 80 88 80 88 74 V70Z', '#868E96') + el(60, 70, 28, 7.5, '#DEE2E6') + sh('M38 68 C44 65 52 64 58 64', 2, 0.8) +
    chainTiles(69, [46, 60, 74], 7, [[1, 3], [3, 5], [5, 5]], 1.8) +
    // paloma
    g('translate(120 0) scale(-1 1) translate(2 2)', el(34, 84, 7, 5, '#ADB5BD', 2.2) + ci(39, 77, 4, '#ADB5BD', 2) + `<path d="M36 79 C38 82 40 81 41 79" fill="#63E6BE" opacity=".8"/>` +
    ol('M42.5 76.5 L46 77.5 L42.5 78.6Z', '#FAB005', 1.4) + dot(40, 76.3, 0.9) + ln('M31 82 Q34 80 37 83', 1.4) + ln('M33 89 V92 M36 89 V92', 1.6, '#E8590C')) +
    sparkle(88, 60, 3.5, '#fff'),

  'Club de jubilados': () =>
    g('translate(3 3)', stick('M31 68 L29 90 M51 68 L53 88 M36 69 L37 88 M46 69 L45 88', '#8B5A3C', 2.4) +
    stick('M33 66 V42 C33 31 49 31 49 42 V66', '#8B5A3C', 3.4) + stick('M37.5 63 V44 C37.5 37 44.5 37 44.5 44 V63', '#A0522D', 2) +
    el(41, 67, 13, 3.6, '#A0522D') +
    g('translate(0 5) rotate(-14 41 31)', ol('M29 33 C28 25 52 23 53 31 C47 36 35 36 29 33Z', '#1D3557') + re(39.5, 22.5, 3, 3, 1, '#1D3557', 1.6) + sh('M33 29 C37 27 41 27 44 27', 1.6, 0.5))) +
    ol('M64 76 H72 L73 90 H63Z', '#495057') + el(68, 91, 9, 2.5, '#343A40', 2) +
    ol('M46 70 V73 C46 79 90 79 90 73 V70Z', '#ADB5BD') + el(68, 70, 22, 6, '#F8F9FA') + ln('M54 69 Q60 67 64 70', 1.2, '#CED4DA') +
    dom(56, 61, 6, 6, 1, -6, 1.8) + dom(64.5, 60.5, 6, 2, 4, 5, 1.8) +
    el(80, 68.5, 10, 2.4, '#fff', 2) + ol('M86 57 C92 57 92 64 85 64', 'none', 2.2) + ol('M73 56 H87 C87 63 84 67 80 67 C76 67 73 63 73 56Z', '#fff', 2.2) +
    el(80, 56, 7, 1.8, '#C68B59', 1.8) + `<ellipse cx="78.5" cy="55.8" rx="2.6" ry=".8" fill="#FFF3E0"/>` +
    ln('M77 51 C75 48 79 46 77 42 M83 51 C81 48 85 46 83 42', 2, '#ADB5BD') +
    sparkle(86, 34, 4) + sparkle(28, 50, 3, '#fff'),

  'Patriarca de la cuadra': () =>
    ol('M28 100 C28 82 40 74 60 74 C80 74 92 82 92 100Z', '#8D6E63') + ol('M52 74 L60 84 L68 74Z', '#fff', 2) + ln('M44 82 V100 M76 82 V100', 1.6, '#6D4C41') +
    ci(41, 53, 4, '#F4BE8F') + ci(79, 53, 4, '#F4BE8F') + ci(60, 52, 19, '#F4BE8F') +
    ol('M39 43 C36 31 49 25 62 27 C77 27 85 33 82 43 C72 38 50 38 39 43Z', '#1D3557') + re(58.5, 23, 3.4, 4, 1, '#1D3557', 1.6) + sh('M46 34 C51 31 57 30 62 30', 1.8, 0.45) +
    ol('M44 46 C46 42 54 42 56 46 C52 45 48 45 44 46Z', '#E9ECEF', 1.6) + ol('M64 46 C66 42 74 42 76 46 C72 45 68 45 64 46Z', '#E9ECEF', 1.6) +
    eye(50.5, 50, 2.1) + eye(69.5, 50, 2.1) + blush(46, 58) + blush(74, 58) +
    el(60, 56, 4, 3.4, '#E6A06B', 1.8) +
    ol('M60 60 C54 56 45 58 42 65 C48 62 54 64 60 62 C66 64 72 62 78 65 C75 58 66 56 60 60Z', '#F1F3F5', 2) + ln('M56 67 Q60 69 64 67', 1.6) +
    // mesa y golpe
    ol('M16 86 H104 V110 H16Z', '#2F9E44') + ln('M16 89.5 H104', 1.4, '#69DB7C') +
    `<polygon class="m-ol" style="stroke-width:2" points="${starPts(77, 86, 13, 7, 9)}" fill="#FFE066"/>` +
    stick('M86 70 L80 74', '#8D6E63', 7) + dom(77, 79, 7, 6, 6, 0, 2) + ci(78, 72, 5.4, '#F4BE8F', 2) + ln('M75 70.5 H80 M75 73.5 H80', 1.2, D, 'opacity=".5"') +
    ln('M66 80 L62 77 M88 80 L92 77 M66 86 L61 86 M88 86 L93 86', 2.2) +
    g('rotate(-14 44 90)', re(37, 88, 14, 5, 1.6, '#FFFBF4', 1.8) + dot(41, 90.5, 0.9) + dot(47, 90.5, 0.9)) +
    t(34, 74, 10, '¡PA!', '#E03131', `transform="rotate(-12 34 74)" ${OUT}`),

  'Boleto capicúa': () =>
    g('rotate(-8 60 60)',
      re(36, 24, 48, 70, 3, '#FFD8A8') + ln('M40 30 H80', 1.6, '#E8590C', 'stroke-dasharray="1 3"') +
      t(60, 41, 9, 'BOLETO', '#C92A2A', 'textLength="34" lengthAdjust="spacingAndGlyphs"') +
      re(49, 45, 22, 9, 2, '#4DABF7', 1.4) + `<rect x="51.5" y="47" width="5" height="3.4" fill="#E7F5FF"/><rect x="58" y="47" width="5" height="3.4" fill="#E7F5FF"/><rect x="64.5" y="47" width="4.5" height="3.4" fill="#E7F5FF"/>` +
      ci(53, 54.5, 1.8, D, 1) + ci(67, 54.5, 1.8, D, 1) +
      ln('M44 63 Q60 56 76 63', 1.6, '#E03131') + ln('M73 60 L76 63 L72 64.5', 1.6, '#E03131') +
      `<path d="M38 66 L83 64 L82 78 L39 79Z" fill="#FFE066" opacity=".9"/>` +
      t(60, 77, 14, '12321', D, 'textLength="40" lengthAdjust="spacingAndGlyphs"') +
      t(60, 88, 7, '$ 0,50', '#9C5221')) +
    sparkle(86, 34, 5) + sparkle(30, 70, 3.5) + sparkle(90, 78, 3, '#fff'),

  'Patente capicúa': () =>
    re(32, 78, 12, 12, 3, '#343A40') + re(76, 78, 12, 12, 3, '#343A40') +
    ol('M26 82 V64 C26 56 30 52 36 50 L42 36 C44 31 76 31 78 36 L84 50 C90 52 94 56 94 64 V82Z', '#212529') +
    ol('M38 50 L43 38 C44 35 76 35 77 38 L82 50Z', '#FCC419') + ol('M42 48 L46 39 H74 L78 48Z', '#A5D8FF', 2) + sh('M48 46 L51 41', 2.2, 0.8) +
    ol('M26 60 C26 54 30 50 38 50 H82 C90 50 94 54 94 60 V64 H26Z', '#FCC419') +
    re(54, 27, 12, 6, 2, '#fff', 1.8) + t(60, 32, 5, 'TAXI', D) +
    ci(36, 64, 7, '#FFF9DB') + ci(84, 64, 7, '#FFF9DB') + eye(37.5, 64.5, 3) + eye(82.5, 64.5, 3) +
    ln('M48 64 Q60 70 72 64', 2.2) +
    re(40, 71, 40, 14, 2.5, '#fff', 2) + `<rect x="41.3" y="72.3" width="37.4" height="3.6" fill="#1C7ED6"/>` + t(60, 83.6, 8.6, 'AB 121 BA', D, 'textLength="34" lengthAdjust="spacingAndGlyphs"') +
    sparkle(86, 40, 4.5) + sparkle(34, 40, 3.5, '#fff') + sparkle(80, 72, 3, '#fff'),

  'Reloj a las 12:21': () =>
    `<polygon points="${starPts(56, 58, 44, 30, 12)}" fill="#FFE066" opacity=".55"/>` +
    stick('M34 74 L30 82 M78 74 L82 82', '#868E96', 3) +
    g('rotate(-20 36 36)', ol('M28 38 C28 28 44 28 44 38Z', '#FCC419')) + g('rotate(20 76 36)', ol('M68 38 C68 28 84 28 84 38Z', '#FCC419')) +
    stick('M56 33 V28', '#868E96', 2.4) + ci(56, 27, 2.6, '#FCC419', 1.8) +
    re(24, 36, 64, 40, 11, '#E03131') + sh('M30 44 C31 40 34 39 38 39', 2.4, 0.6) +
    re(30, 44, 52, 24, 5, '#212529', 2.2) +
    t(56, 63.5, 17, '12:21', '#69DB7C', 'textLength="44" lengthAdjust="spacingAndGlyphs"') +
    dom(88, 72, 9, 6, 6, 10, 2.2) +
    sparkle(32, 88, 3.5, '#fff') + sparkle(86, 40, 4.5) + sparkle(70, 86, 3),

  'Calle cortada': () =>
    stick('M30 88 L36 50 L42 88', '#F8F9FA', 3) + stick('M78 88 L84 50 L90 88', '#F8F9FA', 3) +
    ln('M31.5 80 L40.5 80 M79.5 80 L88.5 80', 2.4, '#E8590C') +
    chainTiles(50, [41, 60, 79], 9, [[1, 3], [3, 6], [6, 2]], 2.2) +
    `<path d="M56 40 L48 32 M64 40 L72 32 M60 38 V30" stroke="#FCC419" stroke-width="2.4" stroke-linecap="round"/>` +
    ol('M54 45 V42 C54 36 66 36 66 42 V45Z', '#FF922B', 2) + sh('M57 41 C57 39 59 38 60 38', 1.4, 0.8) +
    ol('M48 90 H72 L70 86 H50Z', '#E8590C', 2.2) + ol('M51 86 L58 58 C59 55 61 55 62 58 L69 86Z', '#FF922B') +
    `<path d="M55.5 68 H64.5 L66 74 H54Z" fill="#fff"/><path d="M53 78 H67" stroke="#fff" stroke-width="3.5"/>` + sh('M57 62 L54 76', 1.8, 0.5) +
    sparkle(28, 40, 3.5) + sparkle(92, 40, 3.5),

  'Piquete en el puente': () =>
    ol('M18 86 Q28 82 38 86 T58 86 T78 86 T98 86 T118 86 V110 H18Z', '#4DABF7') + ln('M34 93 Q40 90 46 93 M64 95 Q70 92 76 95', 1.6, '#fff') +
    ol('M36 72 H46 V90 H36Z M74 72 H84 V90 H74Z', '#ADB5BD', 2.2) +
    ol('M18 66 H102 V74 H18Z', '#868E96') + ln('M18 69.5 H102', 1.4, '#ADB5BD') +
    ln('M44 70 V70', 1) +
    dom(44, 56, 7.5, 6, 6, -4, 2) + dom(55, 56, 7.5, 0, 3, 3, 2) + dom(66, 56, 7.5, 5, 1, -3, 2) + dom(77, 56, 7.5, 2, 4, 4, 2) +
    // gomas humeando
    ci(30, 60, 6, '#343A40', 2.2) + ci(30, 60, 2.3, '#868E96', 1.6) + ci(90, 60, 6, '#343A40', 2.2) + ci(90, 60, 2.3, '#868E96', 1.6) +
    `<path class="m-ol" style="stroke-width:2" d="M30 53 C26 50 28 46 30 42 C31 46 35 48 33 52Z" fill="#FF922B"/><path class="m-ol" style="stroke-width:2" d="M90 53 C86 50 88 46 90 42 C91 46 95 48 93 52Z" fill="#FF922B"/>` +
    ci(30, 37, 5, '#868E96', 2) + ci(36, 30, 6, '#868E96', 2) + ci(46, 26, 6.5, '#ADB5BD', 2) +
    ci(90, 37, 5, '#868E96', 2) + ci(84, 30, 6, '#868E96', 2) + ci(74, 26, 6.5, '#ADB5BD', 2) +
    g('rotate(-4 60 40)', re(40, 34, 40, 11, 2, '#fff', 2) + t(60, 42.6, 8.4, 'PIQUETE', '#E03131', 'textLength="32" lengthAdjust="spacingAndGlyphs"')),

  'General Paz trabada': () => {
    const car = (x: number, y: number, h: number, a: number, b: number, fill = '#FFFBF4', pc = D) =>
      re(x - h * 0.85, y + h * 0.3, h * 0.42, h * 0.42, h * 0.1, '#212529', 1.6) + re(x + h * 0.43, y + h * 0.3, h * 0.42, h * 0.42, h * 0.1, '#212529', 1.6) +
      re(x - h, y - h / 2, 2 * h, h, h * 0.2, fill, f(Math.min(2.2, h * 0.2))) + ln(`M${x} ${f(y - h * 0.32)} V${f(y + h * 0.32)}`, f(h * 0.1), pc === '#fff' ? '#fff' : D) +
      pips(a, x - h / 2, y, h * 0.26, pc) + pips(b, x + h / 2, y, h * 0.26, pc) +
      re(x - h * 0.98, y - h * 0.15, h * 0.12, h * 0.3, h * 0.05, '#FF6B6B', 1) + re(x + h * 0.86, y - h * 0.15, h * 0.12, h * 0.3, h * 0.05, '#FF6B6B', 1)
    return `<rect x="0" y="0" width="120" height="130" fill="#D0EBFF"/>` + `<rect x="0" y="40" width="120" height="90" fill="#8CE99A"/>` +
      ol('M52 40 H68 L100 104 H20Z', '#495057') + ln('M60 42 V104', 2, '#FFE066', 'stroke-dasharray="4 4"') + ln('M55 40 L36 104 M65 40 L84 104', 1.4, '#fff', 'opacity=".6"') +
      car(53, 48, 5, 2, 1) + car(67, 49, 5, 1, 4, '#343A40', '#fff') +
      car(44, 63, 8, 3, 3, '#343A40', '#fff') + car(76, 63, 8, 5, 2) +
      car(60, 84, 13, 6, 4) +
      ci(36, 82, 3.4, '#DEE2E6', 1.6) + ci(31, 79, 2.4, '#DEE2E6', 1.4) +
      t(88, 82, 8, '¡PIII!', '#E03131', `transform="rotate(-14 88 82)" ${OUT}`) +
      stick('M42 38 V30 M78 38 V30', '#868E96', 2) + re(38, 26, 44, 13, 2.5, '#2B8A3E', 2.2) + `<rect x="40.5" y="28.3" width="39" height="8.4" rx="1.4" fill="none" stroke="#fff" stroke-width="1"/>` +
      t(60, 35.2, 7.4, 'GRAL. PAZ', '#fff', 'textLength="32" lengthAdjust="spacingAndGlyphs"')
  },

  // ═══ VIRUS! ═══
  'Barbijo': () =>
    g('translate(60 62) scale(.86) translate(-60 -54)', ci(60, 54, 28, '#F4BE8F') + ol('M33 48 C30 26 46 22 60 24 C76 22 90 28 87 48 C82 38 74 34 60 34 C46 34 38 38 33 48Z', '#8B5A3C') +
    ln('M44 45 Q48 41 52 45 M68 45 Q72 41 76 45', 2.2) +
    ln('M36 54 C26 52 26 70 38 68 M84 54 C94 52 94 70 82 68', 4.6) + ln('M36 54 C26 52 26 70 38 68 M84 54 C94 52 94 70 82 68', 2, '#fff') +
    ol('M35 54 C46 50 74 50 85 54 L85 68 C76 82 44 82 35 68Z', '#74C0FC') +
    ln('M38 60 C50 58 70 58 82 60 M40 67 C50 65 70 65 80 67', 1.4, '#339AF0') + ln('M52 52 H68', 2, '#E7F5FF') +
    ln('M50 70 Q60 77 70 70', 2.4) + blush(37, 50, 2.4) + blush(83, 50, 2.4)) +
    germ(84, 33, 4.4, '#40C057', 'sad') + ln('M78 41 L75 44 M82 43 L81 46', 1.8) + t(88, 52, 6.5, 'boing', '#7048E8', `transform="rotate(14 88 52)"`) + sparkle(32, 36, 3.5),

  'Alcohol en gel': () =>
    ol('M38 56 C38 50 42 48 46 48 H58 C62 48 66 50 66 56 V88 C66 92 38 92 38 88Z', '#A5D8FF') +
    `<path d="M40 70 H64 V88 C64 90 40 90 40 88Z" fill="#74C0FC" opacity=".6"/>` + sh('M42 56 V82', 2.4, 0.6) +
    re(47, 42, 10, 7, 1.5, '#fff', 2) + re(45, 36, 14, 7, 2, '#E9ECEF', 2) + stick('M58 38 H70 V41', '#E9ECEF', 2.4) + re(48.5, 30, 7, 6, 1.5, '#fff', 2) +
    `<path class="m-ol" style="stroke-width:1.6" d="M70 44 C72 47 73 49 73 50.5 A3 3 0 0 1 67 50.5 C67 49 68 47 70 44Z" fill="#B2F2BB"/>` +
    re(42, 64, 20, 18, 3, '#fff', 1.8) + t(52, 72.5, 7, '70%', '#1C7ED6') + `<path d="M50 75 H54 M52 73 V77" stroke="#E03131" stroke-width="1.6"/>` +
    eye(47, 57, 1.6) + eye(57, 57, 1.6) + ln('M50 60.5 Q52 62.5 54 60.5', 1.4) + blush(44, 60, 1.6) + blush(60, 60, 1.6) +
    g('translate(78 70) rotate(-22) scale(.95)', ol('M-8 10 C-10 4 -10 -2 -9 -6 C-9 -10 -5 -10 -5 -6 V-12 C-5 -16 -1 -16 -1 -12 V-13 C-1 -17 3 -17 3 -13 V-11 C3 -15 7 -15 7 -11 V-2 L10 -6 C12 -9 16 -6 14 -3 L8 8 C6 12 -6 13 -8 10Z', '#E6A06B', 2.6)) +
    g('translate(84 72) rotate(24) scale(-.95 .95)', ol('M-8 10 C-10 4 -10 -2 -9 -6 C-9 -10 -5 -10 -5 -6 V-12 C-5 -16 -1 -16 -1 -12 V-13 C-1 -17 3 -17 3 -13 V-11 C3 -15 7 -15 7 -11 V-2 L10 -6 C12 -9 16 -6 14 -3 L8 8 C6 12 -6 13 -8 10Z', '#F4BE8F', 2.6) + sh('M-6 4 C-7 0 -7 -3 -6 -5', 1.6, 0.6)) +
    ln('M70 84 Q78 90 86 86 M92 58 Q96 64 94 70', 1.8, '#4DABF7') +
    ci(72, 52, 2.6, '#fff', 1.4) + ci(90, 50, 3.2, '#fff', 1.4) + ci(94, 86, 2, '#fff', 1.4) + ci(80, 90, 2.4, '#fff', 1.4) +
    sparkle(32, 44, 4),

  'Jefe de guardia': () =>
    ol('M26 100 C26 82 40 72 60 72 C80 72 94 82 94 100Z', '#F8F9FA') + ol('M50 72 L60 86 L70 72Z', '#63E6BE', 2.2) +
    ln('M50 73 L56 92 M70 73 L64 92', 2) +
    stick('M49 74 C42 80 42 88 46 90', '#495057', 1.6) + ci(47, 91, 3.6, '#CED4DA', 2) +
    re(68, 84, 12, 7, 1.5, '#4DABF7', 1.6) + t(74, 89.6, 4.4, 'JEFE', '#fff') +
    ci(43, 50, 4, '#F4BE8F') + ci(77, 50, 4, '#F4BE8F') + ci(60, 50, 17, '#F4BE8F') +
    ol('M43 46 C40 32 52 28 60 31 C70 28 82 34 77 46 C74 40 70 38 66 40 C60 36 52 40 48 38 C46 41 45 44 43 46Z', '#5C3D2E') +
    ln('M43 38 C52 33 68 33 77 38', 2.4, '#495057') + ci(60, 35, 5.6, '#E9ECEF', 2) + ci(60, 35, 2.4, '#fff', 1.2) +
    ln('M49 51 H55 M65 51 H71', 2) + dot(52, 53, 1.8) + dot(68, 53, 1.8) + ln('M48 56 Q52 58 56 56 M64 56 Q68 58 72 56', 1.4, '#9775FA') +
    ln('M56 62 Q60 64 64 62', 1.6) + `<g fill="${D}" opacity=".35"><circle cx="54" cy="64" r=".7"/><circle cx="57" cy="66" r=".7"/><circle cx="63" cy="66" r=".7"/><circle cx="66" cy="64" r=".7"/></g>` +
    // café
    ol('M78 62 H92 L90 84 H80Z', '#fff') + `<path d="M79.2 69 H90.8 L90.2 76 H79.8Z" fill="#C97B45"/>` + re(76.5, 58.5, 17, 4.5, 2, '#E9ECEF', 2) +
    ci(80, 76, 4, '#F4BE8F', 2) + ln('M82 54 C80 50 84 48 82 44 M88 54 C86 50 90 48 88 44', 1.8, '#ADB5BD') +
    sparkle(30, 44, 4) + `<path d="M28 60 H34 M31 57 V63" stroke="#E03131" stroke-width="2.4" stroke-linecap="round"/>`,

  'Estornudo': () =>
    ol('M60 52 C62 40 74 36 80 42 C86 34 98 40 96 50 C102 58 96 70 88 68 C84 76 72 76 68 70 C60 72 54 62 60 52Z', '#C0EB75') +
    `<path d="M66 54 C68 46 74 44 78 48" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>` +
    germ(74, 56, 5, '#40C057') + germ(88, 54, 4.2, '#E03131') + germ(82, 66, 3.4, '#FCC419') +
    g('translate(3 0)', ci(37, 58, 17, '#F4BE8F') + ol('M22 52 C20 38 34 36 40 40 C44 36 54 40 52 48 C46 44 32 44 22 52Z', '#E8590C') +
    ln('M28 53 L33 55 L28 57 M42 53 L37 55 L42 57', 2) +
    el(50, 59, 6, 5, '#FF8787', 2.2) + sh('M48 56.5 Q49.5 55.5 51 56', 1.4, 0.8) +
    el(41, 67, 5, 3.6, '#C92A2A', 2) + blush(28, 63) +
    dot(58, 64, 1.2, '#74C0FC') + dot(62, 68, 1.5, '#74C0FC') + dot(57, 70, 1, '#74C0FC')) +
    ol('M24 98 C24 84 30 76 40 76 C50 76 56 84 56 98Z', '#4DABF7') +
    t(72, 90, 11, '¡ACHÚ!', '#fff', `transform="rotate(-8 72 90)" ${OUT}`),

  'Paciente cero': () =>
    ol('M40 100 C40 84 48 78 60 78 C72 78 80 84 80 100Z', '#74C0FC') + ln('M48 82 V100 M60 80 V100 M72 82 V100', 2, '#fff', 'opacity=".7"') +
    ci(60, 58, 18, '#D8F5A2') + ol('M44 52 C42 40 52 38 60 40 C70 36 80 42 76 52 C70 48 66 46 60 47 C54 46 48 48 44 52Z', '#5C3D2E') +
    ci(60, 45, 6, '#fff', 1.8) + t(60, 49.3, 10, '0', '#E03131') +
    ln('M49 57 Q52 54 55 57 M65 57 Q68 54 71 57', 2) + ln('M48 61 Q52 63 56 61 M64 61 Q68 63 72 61', 1.2, '#94D82D') +
    stick('M60 66 L74 72', '#fff', 2.2) + ci(75, 72.6, 1.6, '#E03131', 1.2) + ln('M56 66 H62', 1.8) +
    drop(44, 46, 0.8) +
    germ(33, 42, 6, '#E03131') + germ(87, 42, 6, '#4DABF7') + germ(32, 76, 5.5, '#FCC419') + germ(88, 76, 5.5, '#40C057') + germ(60, 25, 4, '#9775FA', 'happy'),

  'Gripe del bondi': () => g('translate(0 3)',
    ci(38, 82, 6.5, '#343A40', 2.2) + ci(38, 82, 2.4, '#ADB5BD', 1.4) + ci(82, 82, 6.5, '#343A40', 2.2) + ci(82, 82, 2.4, '#ADB5BD', 1.4) +
    ol('M24 46 C24 40 28 37 34 37 H88 C93 37 96 41 96 47 V80 H24Z', '#E03131') +
    `<path d="M25.5 60 H94.5 V64 H25.5Z" fill="#FFD43B"/><path d="M25.5 66 H94.5 V67.6 H25.5Z" fill="#1C7ED6"/>` +
    re(30, 42, 12, 14, 2, '#D0EBFF', 2) + re(45, 42, 12, 14, 2, '#D0EBFF', 2) + re(60, 42, 12, 14, 2, '#D0EBFF', 2) + re(76, 42, 16, 18, 2, '#D0EBFF', 2) +
    [[36, '#D8F5A2'], [51, '#F4BE8F'], [66, '#C0EB75']].map(([x, c]) =>
      ci(+x, 51, 4.6, c as string, 1.6) + ln(`M${+x - 2.4} 50 L${+x - .6} 50.6 M${+x + 2.4} 50 L${+x + .6} 50.6`, 1.2) + el(+x, 54, 1.4, 1.1, D, 0.8)).join('') +
    ci(84, 52, 5, '#F4BE8F', 1.6) + dot(83, 51, 1) + dot(87, 51, 1) + ln('M82 55 H86', 1.2) + ln('M80 48 C82 45 88 45 90 48', 2.2, '#1D3557') +
    re(66, 70, 18, 7, 1.5, '#212529', 1.6) + t(75, 75.8, 6, '152', '#FFD43B') +
    ln('M28 72 H58', 1.6, '#fff', 'opacity=".5"') +
    `<path class="m-ol" style="stroke-width:1.6" d="M33 38 C30 34 34 30 37 32 C40 28 46 30 44 35Z" fill="#C0EB75"/><path class="m-ol" style="stroke-width:1.6" d="M63 38 C60 34 64 30 67 32 C70 28 76 30 74 35Z" fill="#C0EB75"/>` +
    germ(50, 27, 3.8, '#40C057') + germ(62, 23, 3.4, '#E03131') + germ(76, 28, 3.8, '#9775FA')) +
    t(60, 98, 7, 'achú', '#2F9E44', OUT.replace('currentColor', '#fff')),

  'Riñón prestado': () =>
    stick('M58 68 C66 70 70 78 72 86', '#FFA8A8', 3) +
    ol('M36 42 C44 30 66 32 70 46 C72 54 62 56 62 66 C62 74 72 76 68 86 C62 96 40 94 34 80 C30 68 30 52 36 42Z', '#C2255C') +
    sh('M40 46 C43 40 48 37 54 37', 2.6, 0.55) +
    eye(43, 62, 2.2) + eye(54, 62, 2.2) + ln('M43 71 Q46 69 49 71 Q52 73 55 71', 1.8) + blush(39, 68, 2.2) + blush(58, 68, 2.2) + drop(36, 56, 0.75) +
    ln('M64 40 C70 42 72 46 76 48', 1.6, '#9C6644') +
    g('rotate(14 84 50)', ol('M73 43 H94 V57 H73 L69 50Z', '#FFF3BF', 2) + ci(73.5, 50, 1.4, '#fff', 1.2) + t(84, 52.6, 6.4, 'PRESTADO', '#C92A2A', 'textLength="18" lengthAdjust="spacingAndGlyphs"')) +
    sparkle(84, 74, 3.5, '#fff') + sparkle(30, 34, 3.5),

  'Corazón en heladerita': () =>
    ol('M34 58 L30 36 C30 33 32 32 35 32 H85 C88 32 90 33 90 36 L86 58Z', '#E9ECEF') + ol('M36 56 L33.5 38 H86.5 L84 56Z', '#CED4DA', 1.6) +
    re(30, 58, 60, 30, 5, '#E03131') + re(28, 56, 64, 8, 3, '#fff') +
    g('rotate(-10 40 58)', re(34, 52, 9, 9, 2, '#D0EBFF', 1.8)) + g('rotate(14 80 58)', re(75, 51, 9, 9, 2, '#D0EBFF', 1.8)) +
    heart(60, 49, 12, '#FF6B6B', 2.6) + sh('M52 42 C52 40 54 39 56 40', 1.8, 0.8) +
    dot(55.5, 49, 1.8) + dot(64.5, 49, 1.8) + ln('M57.5 53 Q60 55 62.5 53', 1.5) + blush(52, 52, 1.8) + blush(68, 52, 1.8) +
    ln('M42 38 L38 34 M78 38 L82 34 M60 30 V26', 2.2) +
    re(53, 70, 14, 14, 2, '#fff', 1.8) + `<path d="M60 72.5 V81.5 M55.5 77 H64.5" stroke="#E03131" stroke-width="3"/>` +
    ln('M36 74 V82 M84 74 V82', 2.2, '#C92A2A') + sh('M36 67 H48', 2, 0.5),

  'Frankenstein': u =>
    re(24, 64, 10, 7, 2, '#ADB5BD', 2) + re(86, 64, 10, 7, 2, '#ADB5BD', 2) +
    ol('M34 100 C34 88 44 84 60 84 C76 84 86 88 86 100Z', '#495057') + ln('M54 84 L60 92 L66 84', 2, '#fff', 'opacity=".5"') +
    `<defs><clipPath id="fk${u}"><path d="M38 32 H82 C86 32 88 36 88 40 V74 C88 82 82 86 74 86 H46 C38 86 32 82 32 74 V40 C32 36 34 32 38 32Z"/></clipPath></defs>` +
    `<g clip-path="url(#fk${u})"><rect x="30" y="30" width="60" height="60" fill="#8CE99A"/><path d="M30 64 L52 68 L56 90 H30Z" fill="#F4BE8F"/><path d="M68 30 L72 50 L90 54 V30Z" fill="#C68B59"/><path d="M90 66 L76 70 L78 90 H90Z" fill="#B197FC"/></g>` +
    ol('M38 32 H82 C86 32 88 36 88 40 V74 C88 82 82 86 74 86 H46 C38 86 32 82 32 74 V40 C32 36 34 32 38 32Z', 'none') +
    ln('M32 64 L52 68 L56 86 M72 32 L72 50 L88 54 M88 66 L76 70 L78 86', 1.4) +
    ln('M40 63 L42 68 M46 64 L47 69 M53 72 L49 73 M54 79 L50 80 M73 39 L77 38 M73 45 L77 44 M80 50 L81 55 M80 66 L82 71 M76 76 L80 75', 1.4) +
    ol('M30 46 V32 C30 24 90 24 90 32 V46 C84 40 78 44 72 40 C66 44 58 40 52 44 C46 40 40 44 36 40 C34 42 32 44 30 46Z', '#212529') + sh('M40 30 H56', 2, 0.35) +
    ln('M43 52 L55 55 M65 55 L77 52', 3) + ci(50, 60, 4.2, '#fff', 1.8) + dot(51, 60.5, 2.2) + ci(70, 60, 3.4, '#fff', 1.8) + dot(69.5, 60.5, 1.8) +
    ln('M48 74 Q60 79 72 74', 2.2) + ln('M52 73 V78 M58 75 V80 M64 75 V80 M70 73 V77', 1.4) +
    blush(42, 70, 2.4) + blush(80, 70, 2.4) +
    `<path class="m-ol" style="stroke-width:1.8" d="M22 44 L28 36 L26 42 L32 40 L25 50 L27 45Z" fill="#FFD43B"/><path class="m-ol" style="stroke-width:1.8" d="M96 44 L90 36 L92 42 L86 40 L93 50 L91 45Z" fill="#FFD43B"/>`,

  // ═══ EL IMPOSTOR ═══
  'Cara de nada': () =>
    ol('M28 100 C28 84 40 78 56 78 C72 78 84 84 84 100Z', '#868E96') +
    ci(56, 52, 22, '#F4BE8F') + ol('M34 48 C32 32 44 26 58 28 C72 28 80 36 78 50 C72 42 62 38 50 40 C44 42 38 44 34 48Z', '#495057') +
    ln('M42 51 H52 M60 51 H70', 2.2) + `<path d="M44 51 A3 3 0 0 0 50 51Z M62 51 A3 3 0 0 0 68 51Z" fill="${D}"/>` +
    ln('M50 66 H62', 2.4) + drop(77, 42, 0.95) +
    g('rotate(-10 76 76)', re(66, 60, 21, 32, 4, '#343A40') + re(68.5, 64, 16, 23, 2, '#E7F5FF', 1.6) + t(76.5, 79, 9, '???', '#E03131')) +
    ci(66, 80, 4, '#F4BE8F', 2) + ci(86, 76, 3.6, '#F4BE8F', 2),

  'Chamuyero': () =>
    ol('M28 100 C28 84 40 78 58 78 C76 78 88 84 88 100Z', '#7048E8') + ol('M50 78 L58 92 L66 78Z', '#fff', 2) + ln('M44 80 L52 98 M72 80 L64 98', 2, '#5F3DC4') +
    ci(58, 54, 18, '#F4BE8F') +
    ol('M40 50 C36 30 52 26 62 28 C74 26 82 34 78 48 C74 40 66 37 58 39 C50 37 44 42 40 50Z', '#212529') + sh('M48 34 C54 31 62 31 68 33 M52 38 C58 35 64 35 70 37', 1.6, 0.6) +
    ln('M47 52 Q50 49 53 52', 2.2) + ln('M45 47 L53 46', 2) + eye(66, 51, 2.2) + ln('M62 46 L70 45', 2) + blush(46, 60) + blush(70, 60) +
    ol('M48 60 Q58 71 69 60Z', '#fff', 2.2) + ln('M52 62 V65 M57 62 V67 M62 62 V66', 1) + sparkle(66, 63, 3.2, '#FFD43B') +
    // pistolitas con los dedos
    stick('M80 90 L86 76', '#7048E8', 6) + ci(87, 72, 4.6, '#F4BE8F', 2) + stick('M88 70 L94 64', '#F4BE8F', 2.6) + stick('M85 69 L84 63', '#F4BE8F', 2.4) +
    `<ellipse cx="38" cy="62" rx="3" ry="2.2" fill="none" stroke="#ADB5BD" stroke-width="1.8"/><ellipse cx="32" cy="55" rx="4" ry="3" fill="none" stroke="#ADB5BD" stroke-width="1.8"/>` +
    t(31, 48, 8.5, 'bla', '#7048E8', `transform="rotate(-12 31 48)" ${OUT}`) + t(38, 39, 6.5, 'bla', '#F06595', OUT),

  'Vendedor de buzones': () =>
    ol('M34 84 V48 C34 32 56 32 56 48 V84Z', '#E03131') + re(31, 82, 28, 6, 2, '#C92A2A') + re(37, 52, 16, 4, 1.5, D, 1.4) +
    sh('M38 44 C38 40 41 37 45 36 M38 60 V78', 2.4, 0.55) + ln('M34 66 H56', 1.6, '#C92A2A') +
    ln('M48 38 L54 46', 1.4, '#9C6644') +
    g('rotate(18 52 52)', ol('M50 50 H64 V60 H50 L46 55Z', '#FFF3BF', 1.8) + t(56.4, 58, 7, '$99', '#2F9E44')) +
    ol('M60 100 C60 78 66 64 77 64 C88 64 94 78 94 100Z', '#C97B45') + ln('M68 70 V100 M80 66 V100 M64 82 H92 M62 92 H94', 1.2, '#8B5A3C', 'opacity=".7"') +
    ol('M73 64 L77 72 L81 64Z', '#fff', 1.8) + ol('M76 68 H78 L80 84 L77 87 L74 84Z', '#E03131', 1.6) +
    ci(77, 48, 13, '#F4BE8F') + ol('M64 46 C62 34 72 32 78 34 C86 32 92 40 89 48 C86 42 80 40 74 42 C70 40 66 42 64 46Z', '#212529') + sh('M70 37 C74 35 78 35 82 36', 1.4, 0.6) +
    eye(72, 47, 1.8) + eye(82, 47, 1.8) + ln('M70 53 H84', 2) + ol('M70 55 Q77 62 84 55Z', '#fff', 1.8) + blush(68, 52, 2) + blush(86, 52, 2) +
    stick('M66 78 L60 70', '#C97B45', 6) + ci(59, 68, 4, '#F4BE8F', 2) + stick('M58 64.5 V60', '#F4BE8F', 2.4) +
    sparkle(28, 30, 0) + sparkle(30, 42, 4) + sparkle(90, 30, 4) + sparkle(30, 72, 3, '#fff'),

  'Perro guardián': () =>
    ol('M74 88 C74 70 76 56 84 52 C92 56 94 70 94 88Z', '#5F3DC4') + ol('M78 66 C77 58 80 54 84 54 C88 54 91 58 90 66Z', '#212529', 1.8) +
    dot(81.5, 61, 1.2, '#FFE066') + dot(86.5, 61, 1.2, '#FFE066') +
    re(26, 46, 40, 42, 2, '#C97B45') + ln('M26 56 H66 M26 66 H66 M26 76 H66', 1.4, '#A35E2F') +
    ol('M20 50 L46 26 L72 50 L66 52 L46 34 L26 52Z', '#E03131') +
    re(34, 46, 24, 7, 1.5, '#FFF3BF', 1.6) + t(46, 51.7, 5.4, 'FIRULAIS', D, 'textLength="20" lengthAdjust="spacingAndGlyphs"') +
    ol('M35 88 V68 C35 56 57 56 57 68 V88Z', '#3B2A20') +
    ol('M37 70 L36 56 L45 64Z', '#A0522D', 2.2) +
    ci(46, 76, 11, '#F1D3A5') + ol('M54 67 C61 67 62 78 57 82 C56 77 55 72 54 67Z', '#A0522D', 2.2) +
    el(48, 81, 7, 4.6, '#FFF8E7', 1.8) + el(52, 78.5, 3, 2.2, D, 1.2) + eye(42, 73, 1.9) + eye(50, 73, 1.9) +
    ln('M46 84.5 Q49 86.5 52 84.5', 1.4) + ln('M58 76 L63 74 M58 80 L63 81', 1.8) +
    t(68, 42, 16, '!', '#E03131', OUT),

  'Detective Conan': () =>
    ol('M34 100 C34 86 44 78 60 78 C76 78 86 86 86 100Z', '#1971C2') + ol('M52 78 L60 88 L68 78Z', '#fff', 2) +
    ol('M54 82 L60 85 L54 88Z M66 82 L60 85 L66 88Z', '#E03131', 1.8) + ci(60, 85, 1.8, '#C92A2A', 1.4) +
    ci(58, 54, 19, '#F4BE8F') +
    ol('M39 52 C36 34 48 28 60 30 C66 26 70 30 72 26 C72 30 70 32 72 33 C80 36 80 46 77 52 C74 44 70 40 64 40 C58 44 50 44 44 42 C42 46 40 48 39 52Z', '#3B2A20') +
    ci(50, 56, 6.6, '#E7F5FF', 2.2) + ci(67, 56, 6.6, '#E7F5FF', 2.2) + ln('M56.6 55 H60.4', 2) + eye(51, 56.6, 2) + eye(68, 56.6, 2) +
    sh('M46 53 L48 51 M63 53 L65 51', 1.2, 0.9) + ln('M54 67 Q59 70 64 66', 1.8) + blush(44, 63) + blush(72, 63) +
    stick('M78 86 C84 80 86 72 88 64', '#1971C2', 6) + ci(88.5, 61, 4.6, '#F4BE8F', 2) + stick('M90 58 L95 49', '#F4BE8F', 2.6) +
    ln('M92 42 L94 38 M97 46 L101 44 M86 44 L85 40', 2) + t(31, 42, 16, '!', '#FCC419', OUT) + sparkle(30, 70, 3),

  'Hércules Poirot': () =>
    ol('M32 100 C32 86 44 78 60 78 C76 78 88 86 88 100Z', '#343A40') + ol('M53 78 L60 90 L67 78Z', '#fff', 2) +
    ol('M54 81 L60 84 L54 87Z M66 81 L60 84 L66 87Z', '#212529', 1.6) +
    ol('M60 20 C74 20 80 38 80 52 C80 68 72 78 60 78 C48 78 40 68 40 52 C40 38 46 20 60 20Z', '#F4BE8F') +
    sh('M50 28 C53 24 57 23 60 23', 2.6, 0.7) +
    ol('M41 54 C40 44 42 38 46 36 C45 42 45 48 46 55Z', '#212529', 1.8) + ol('M79 54 C80 44 78 38 74 36 C75 42 75 48 74 55Z', '#212529', 1.8) +
    ln('M46 44 Q51 42.5 55 44.5', 2.2) + ln('M65 41 Q70 36 75 40', 2.2) +
    ln('M48 49 Q51 50.5 54 49', 2) + ci(70, 48, 2.8, '#fff', 1.6) + dot(70.5, 48.4, 1.5) +
    el(60, 54, 3.4, 4, '#E6A06B', 1.6) +
    ol('M60 60 C54 56 46 58 42 62 C38 64 33 61 35 56 C32 63 38 68 45 66 C51 64 56 64 60 63 C64 64 69 64 75 66 C82 68 88 63 85 56 C87 61 82 64 78 62 C74 58 66 56 60 60Z', '#212529', 2) +
    ln('M35 56 C35 53 38 53 38 55 M85 56 C85 53 82 53 82 55', 1.6) +
    ci(60, 69, 2, '#C92A2A', 1.4) + blush(46, 60, 2.4) + blush(74, 60, 2.4) +
    sparkle(30, 34, 4.5) + sparkle(90, 34, 4.5) + sparkle(26, 60, 3, '#fff') + sparkle(94, 60, 3, '#fff'),

  'Oreja parada': () =>
    stick('M58 42 L49 29 M64 42 L72 29', '#ADB5BD', 2) + ci(49, 29, 2.6, '#E03131', 1.6) + ci(72, 29, 2.6, '#E03131', 1.6) +
    ol('M42 48 C42 30 82 30 80 52 C79 62 72 66 68 72 C64 78 68 88 56 90 C46 92 42 84 46 78 C48 74 44 70 42 66Z', '#F4BE8F') +
    ln('M50 50 C50 40 72 40 72 52 C72 60 64 62 62 68 C60 74 62 80 56 82', 2.6, '#E6A06B') + ln('M56 56 C56 50 64 50 64 56 C64 60 58 60 58 64', 2, '#E6A06B') +
    sh('M47 42 C50 37 56 35 62 35', 2.4, 0.6) +
    re(54, 38, 14, 6, 3, '#495057', 2) + ci(61, 38, 2, '#868E96', 1.4) +
    ln('M84 62 Q88 68 84 74 M89 58 Q95 68 89 78', 2, '#7048E8') +
    ol('M80 40 H94 C96 40 96 50 94 50 H86 L82 54 V50 H80 C78 50 78 40 80 40Z', '#fff', 1.8) + t(87, 48.4, 7, 'bla', '#7048E8') +
    ol('M24 62 H36 C38 62 38 72 36 72 H32 L28 76 V72 H24 C22 72 22 62 24 62Z', '#fff', 1.8) + dot(26.5, 67, 1) + dot(30, 67, 1) + dot(33.5, 67, 1) +
    ln('M34 54 Q30 48 34 42', 2, '#7048E8') + sparkle(32, 86, 3) + sparkle(84, 86, 3),

  'Pungista de pistas': () =>
    stick('M18 24 H102', '#ADB5BD', 3) + stick('M38 24 V34 M82 24 V34', '#868E96', 1.6) +
    ol('M33 34 H43 L38 42Z', '#FFE066', 2) + ol('M77 34 H87 L82 42Z', '#FFE066', 2) +
    ol('M18 54 H102 V110 H18Z', '#4263EB') + ln('M18 58 H102', 1.4, '#748FFC') +
    ol('M36 64 H76 V84 L56 94 L36 84Z', '#3B5BDB', 2.2) + ln('M39 67 H73 V82.5 L56 91 L39 82.5Z', 1.4, '#FFA94D', 'stroke-dasharray="2 2"') +
    g('rotate(12 56 52)', re(44, 36, 26, 32, 2.5, '#fff') + t(57, 54, 9, 'MATE', '#E03131', 'textLength="20" lengthAdjust="spacingAndGlyphs"') + ln('M48 40 H66', 1.4, '#ADB5BD')) +
    ol('M36 64 H76 L76 70 H36Z', '#3B5BDB', 2.2) + ln('M39 67 H73', 1.4, '#FFA94D', 'stroke-dasharray="2 2"') +
    g('rotate(-30 80 44)', re(70, 38, 30, 12, 4, '#fff') + `<path d="M78 39.5 V48.5 M86 39.5 V48.5 M94 39.5 V48.5" stroke="${D}" stroke-width="3.4"/>`) +
    ci(66, 46, 6, '#343A40', 2.2) + stick('M62 42 L58 38', '#343A40', 2.6) +
    ln('M26 46 Q30 42 34 46', 2) + t(86, 78, 9, 'shh', '#fff', OUT),

  'Lector de mentes': () =>
    ol('M18 100 C18 86 26 78 38 78 C50 78 58 86 58 100Z', '#2F9E44') +
    ci(38, 64, 14, '#F4BE8F') + ol('M24 60 L36 28 L54 58Z', '#CED4DA') + ln('M30 46 L38 50 L34 40 M44 52 L40 44', 1.4, '#868E96') + sh('M33 40 L30 50', 1.8, 0.8) +
    ci(36, 27, 3, '#E9ECEF', 1.8) +
    ci(33, 66, 3.2, '#fff', 1.6) + ci(43, 66, 3.2, '#fff', 1.6) + dot(33, 66, 1.4) + dot(43, 66, 1.4) +
    ln('M35 73 Q38 75 41 73', 1.6) + blush(28, 71, 2) + blush(48, 71, 2) +
    stick('M56 48 L62 42 L60 48 L68 40', '#FCC419', 2.6) + stick('M58 56 L66 52 L64 58 L72 52', '#FCC419', 2.6) +
    ol('M64 50 C60 46 62 38 70 38 C72 32 82 30 86 36 C94 34 98 44 92 48 C96 54 88 58 84 56 C80 60 70 60 68 56 C62 58 60 52 64 50Z', '#fff', 2.2) +
    t(79, 51, 11, 'SOL', '#F08C00', 'textLength="18" lengthAdjust="spacingAndGlyphs"') +
    dot(80, 62, 1.6) + dot(81, 66, 2.2) +
    ci(80, 80, 9, '#C68B59') + ol('M71 78 C70 70 78 68 82 70 C88 68 91 74 89 79 C86 76 80 75 71 78Z', '#212529', 1.8) +
    dot(77, 81, 1.4) + dot(84, 81, 1.4) + ln('M78 85 H83', 1.4),

  'Sospechoso de siempre': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#E9ECEF"/>` +
    ln('M18 32 H102 M18 44 H102 M18 56 H102 M18 68 H102 M18 80 H102', 1.4, '#ADB5BD') +
    t(30, 30.5, 5, '1,90', '#868E96') + t(30, 42.5, 5, '1,80', '#868E96') + t(30, 54.5, 5, '1,70', '#868E96') + t(30, 66.5, 5, '1,60', '#868E96') +
    ol('M38 100 C38 76 46 64 60 64 C74 64 82 76 82 100Z', '#FF922B') +
    ci(60, 46, 14, '#F4BE8F') + ol('M46 44 C44 32 54 30 60 32 C68 30 76 36 74 44 C70 38 62 38 56 40 C52 40 48 41 46 44Z', '#5C3D2E') +
    ln('M51 43 Q54 40 57 43 M63 41 Q66 39 69 42', 1.8) + eye(54, 47, 1.8) + eye(66, 47, 1.8) + ln('M56 55 Q60 53 64 56', 1.8) +
    `<g fill="${D}" opacity=".35"><circle cx="53" cy="53" r=".7"/><circle cx="56" cy="57" r=".7"/><circle cx="64" cy="58" r=".7"/><circle cx="67" cy="54" r=".7"/></g>` +
    re(42, 70, 36, 18, 2, '#343A40') + t(60, 83.6, 11, 'Nº 3', '#fff') + ci(42, 80, 3.4, '#F4BE8F', 1.8) + ci(78, 80, 3.4, '#F4BE8F', 1.8) +
    t(82, 36, 14, '?', '#7048E8', OUT) + t(88, 46, 10, '?', '#7048E8', OUT),

  'Cara de culpable': () => g('translate(60 54) scale(.82) translate(-60 -60)',
    ci(60, 60, 18, '#F4BE8F') + ol('M43 54 C42 42 52 40 60 42 C70 40 78 44 77 54 C72 48 64 47 58 49 C52 48 47 50 43 54Z', '#212529') +
    ci(53, 59, 3.6, '#fff', 1.6) + ci(67, 59, 3.6, '#fff', 1.6) + dot(51.4, 59.6, 1.7) + dot(65.4, 59.6, 1.7) +
    ln('M49 54 L56 55 M64 55 L71 54', 1.8) +
    ln('M52 69 Q55 67 58 69 Q61 71 64 69 Q66 67 68 69', 1.8) + blush(48, 66, 2.2) + blush(72, 66, 2.2) +
    drop(78, 50, 0.9) + drop(42, 48, 0.7) + drop(80, 64, 0.6)) +
    pointer(44, 46, 12, '#C68B59', '#E03131') + pointer(76, 46, 168, '#FFD8B5', '#40C057') +
    pointer(46, 66, -28, '#F4BE8F', '#FCC419') + pointer(74, 66, -152, '#E6A06B', '#9775FA') +
    ln('M60 32 V28 M50 34 L48 30 M70 34 L72 30', 2),

  'Preso de Alcatraz': u =>
    `<rect x="0" y="74" width="120" height="60" fill="#4DABF7"/>` + ln('M18 74 H102', 2.6) + ln('M28 84 Q32 81 36 84 M70 90 Q74 87 78 90 M86 80 Q90 77 94 80', 1.6, '#fff') +
    ol('M30 98 L36 82 L40 90Z', '#868E96', 2) +
    ol('M34 78 C36 68 44 64 56 64 C68 64 76 68 80 78Z', '#ADB5BD') + ln('M44 70 L48 74 M64 68 L68 72', 1.6, '#868E96') +
    `<defs><clipPath id="al${u}"><path d="M39 70 V58 C39 54 57 54 57 58 V70Z"/></clipPath></defs>` +
    `<g clip-path="url(#al${u})"><rect x="38" y="52" width="20" height="20" fill="#fff"/><path d="M38 59 H58 M38 65 H58" stroke="${D}" stroke-width="3"/></g>` + ol('M39 70 V58 C39 54 57 54 57 58 V70Z', 'none', 2.2) +
    ci(48, 47, 8.5, '#F4BE8F', 2.2) + `<path d="M40 44 C40 38 56 38 56 44" fill="#fff" stroke="${D}" stroke-width="1.6"/><path d="M41 42 H55" stroke="${D}" stroke-width="2"/>` +
    ln('M44 47 Q45 46 46 47 M50 47 Q51 46 52 47', 1.4) + ln('M45.5 52 Q48 50 50.5 52', 1.4) + drop(43.5, 51, 0.5) +
    ln('M43 70 V66 M53 70 V66', 1.6) + ln('M44 70 Q38 72 34 70', 1.4, '#495057') + ci(32, 70, 3.6, '#343A40', 1.6) +
    stick('M58 60 L66 52', '#F4BE8F', 2.6) + stick('M68 58 V44', '#C97B45', 2) +
    g('rotate(6 78 46)', re(62, 36, 30, 18, 2, '#FFF3BF', 2) + t(77, 44, 6.6, 'SOY', '#C92A2A') + t(77, 51, 6.6, 'INOCENTE', '#C92A2A', 'textLength="24" lengthAdjust="spacingAndGlyphs"')) +
    ol('M86 90 L90 80 L94 90Z', '#868E96', 1.8),

  // ═══ CARCASSONNE ═══
  'Pueblo medieval': () => g('translate(60 62) scale(.9) translate(-60 -60)',
    g('rotate(-5 60 60)',
      re(34, 34, 52, 52, 3, '#8CE99A') +
      `<path d="M58 86 C58 74 62 66 60 56 H64 C66 66 62 74 64 86Z" fill="#F1E3CF" stroke="${D}" stroke-width="1.4"/>` +
      ol('M34 36 C34 34 36 34 36 34 H84 C86 34 86 36 86 36 V48 C72 58 48 58 34 48Z', '#E8C47A', 2.4) +
      ln('M34 48 C48 58 72 58 86 48', 4.4, '#8B5A3C') + ln('M38 50 V47 M44 53 V50 M50 55 V52 M70 55 V52 M76 53 V50 M82 50 V47', 2.6, '#8B5A3C') +
      ol('M38 44 V39 L41 36 L44 39 V44Z', '#fff', 1.4) + `<path d="M37 39 L41 34.5 L45 39Z" fill="#E03131"/>` +
      ol('M74 44 V39 L77 36 L80 39 V44Z', '#fff', 1.4) + `<path d="M73 39 L77 34.5 L81 39Z" fill="#E03131"/>` +
      ci(42, 74, 4, '#2F9E44', 1.6) + ci(78, 72, 5, '#2F9E44', 1.6) + ci(48, 80, 3, '#40C057', 1.4)) +
    re(53, 32, 14, 20, 1.5, '#DEE2E6') + ol('M50 33 L60 20 L70 33Z', '#E03131') + ol('M56 52 V46 C56 42 64 42 64 46 V52Z', '#3B2A20', 2) +
    re(58, 36, 4, 5, 1, '#3B2A20', 1.2) + stick('M60 21 V16', '#868E96', 1.2) +
    // perro
    el(69, 60, 4.6, 3.2, '#C97B45', 1.6) + ci(73, 56, 3, '#C97B45', 1.6) + `<path d="M71 54 L72 51 L74 54Z" fill="#8B5A3C" stroke="${D}" stroke-width="1"/>` + dot(74, 55.6, .7) + dot(76, 56.6, .8) +
    ln('M64.5 59 L62.5 56', 1.6, '#8B5A3C')) + sparkle(28, 50, 3) + sparkle(92, 66, 3, '#fff'),

  'Ciudad amurallada': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#D0EBFF"/>` + ci(86, 34, 6, '#FFE066', 2) +
    ol('M14 82 C34 66 86 66 106 82 V110 H14Z', '#8CE99A') +
    ol('M26 82 V60 H30 V56 H35 V60 H40 V56 H45 V60 H50 V56 H55 V60 H65 V56 H70 V60 H75 V56 H80 V60 H85 V56 H90 V60 H94 V82Z', '#CED4DA') +
    ln('M28 68 H48 M72 68 H92 M34 74 H48 M72 74 H86 M38 64 V68 M82 64 V68', 1.4, '#ADB5BD') +
    re(24, 46, 14, 36, 1.5, '#DEE2E6') + ol('M22 47 L31 34 L40 47Z', '#E03131') + re(82, 46, 14, 36, 1.5, '#DEE2E6') + ol('M80 47 L89 34 L98 47Z', '#4DABF7') +
    re(48, 38, 24, 44, 1.5, '#E9ECEF') + ol('M46 39 L60 22 L74 39Z', '#FCC419') + ol('M53 82 V68 C53 60 67 60 67 68 V82Z', '#5C3D2E') + ln('M56 64 V82 M60 62 V82 M64 64 V82', 1.2, '#8B5A3C') +
    re(56, 46, 8, 8, 4, '#3B2A20', 1.6) + re(28, 56, 6, 8, 3, '#3B2A20', 1.4) + re(86, 56, 6, 8, 3, '#3B2A20', 1.4) +
    stick('M31 34 V28 M89 34 V28 M60 22 V16', '#868E96', 1.2) +
    ol('M31 28 L38 30 L31 32Z', '#E03131', 1.4) + ol('M89 28 L96 30 L89 32Z', '#4DABF7', 1.4) + ol('M60 17 L68 19.5 L60 22Z', '#FCC419', 1.4) +
    sh('M50 44 V78', 2, 0.5),

  'Rey del castillo': () => {
    const croc = (x: number, y: number, flip = 1) => g(`translate(${x} ${y}) scale(${flip} 1)`,
      ol('M-10 2 C-10 -4 -6 -6 0 -5 L12 -3 C14 -2 14 2 12 2Z', '#40C057', 2) + ci(-5, -6, 2.6, '#40C057', 1.6) + ci(0, -5.5, 2.2, '#40C057', 1.6) +
      dot(-5, -6.4, 1) + dot(0, -6, .9) + `<path d="M2 2 L3.5 4 L5 2 L6.5 4 L8 2" fill="#fff" stroke="${D}" stroke-width=".8"/>`)
    return `<rect x="0" y="0" width="120" height="130" fill="#D0EBFF"/>` +
      ol('M30 80 V44 H34 V40 H40 V44 H46 V40 H52 V44 H68 V40 H74 V44 H80 V40 H86 V44 H90 V80Z', '#ADB5BD') +
      re(22, 40, 12, 40, 1.5, '#CED4DA') + ol('M20 41 L28 26 L36 41Z', '#E03131') + re(86, 40, 12, 40, 1.5, '#CED4DA') + ol('M84 41 L92 26 L100 41Z', '#E03131') +
      ln('M36 56 H44 M76 56 H84 M38 66 H44 M76 66 H84', 1.4, '#868E96') +
      ol('M46 80 V42 C46 32 74 32 74 42 V80Z', '#C92A2A') + ln('M49.5 78 V43 C49.5 36 70.5 36 70.5 43 V78', 1.6, '#FCC419') +
      meeple(60, 62, 0.72, '#4DABF7', 'proud') + crown(60, 44, 0.75) +
      stick('M75 72 L80 52', '#FCC419', 2) + ci(80.5, 50, 2.6, '#E03131', 1.6) +
      `<rect x="0" y="80" width="120" height="50" fill="#339AF0"/>` + ln('M18 80 H102', 2.6) + ln('M36 94 Q40 91 44 94 M66 96 Q70 93 74 96', 1.6, '#fff') +
      croc(40, 88) + croc(80, 88, -1) + sparkle(60, 24, 4)
  },

  'Peón acostado': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#E7F5FF"/>` +
    g('translate(-6 4)', ci(80, 36, 7, '#FFD43B', 2.2) + ln('M80 25 V22 M91 36 H94 M88 28 L90 26 M72 28 L70 26 M88 44 L90 46', 2, '#FAB005') + dot(78, 35.4, .9) + dot(82, 35.4, .9) + ln('M78 38.4 Q80 40 82 38.4', 1.2)) +
    ol('M14 68 C36 60 84 60 106 68 V110 H14Z', '#94D82D') +
    el(60, 84, 24, 4, '#74B816', 0) + meeple(60, 74, 0.8, '#E03131', 'sleepy', -90) +
    ln('M42 66 L36 58', 1.6, '#2F9E44') + el(35.5, 57, 1.6, 3, '#FCC419', 1.2) +
    [30, 36, 44, 76, 84, 90].map((x, i) => ln(`M${x} 96 Q${x + 1} ${84 - (i % 3) * 3} ${x - 1} ${80 - (i % 3) * 3}`, 1.8, '#2F9E44') + el(x - 1, 78 - (i % 3) * 3, 1.8, 3.6, '#FCC419', 1.4)).join('') +
    t(46, 50, 10, 'Z', D) + t(53, 42, 8, 'z', D) + t(58, 35, 6, 'z', D),

  'Terrateniente': () => {
    let fields = ''
    const cols = ['#94D82D', '#FFD43B', '#69DB7C', '#FAB005', '#B2F2BB']
    const rows = [[54, 62], [62, 74], [74, 90], [90, 112]]
    rows.forEach(([y0, y1], r) => {
      for (let i = -3; i < 4; i++) {
        const k0 = (y0 - 46) * 1.4, k1 = (y1 - 46) * 1.4
        fields += `<path d="M${f(60 + i * k0)} ${y0} L${f(60 + (i + 1) * k0)} ${y0} L${f(60 + (i + 1) * k1)} ${y1} L${f(60 + i * k1)} ${y1}Z" fill="${cols[(i + 3 + r * 2) % 5]}" stroke="${D}" stroke-width="1.2"/>`
      }
    })
    return `<rect x="0" y="0" width="120" height="130" fill="#E7F5FF"/>` + fields + ln('M14 54 H106', 2) +
      stick('M88 54 L91 40 L94 54', '#868E96', 1.2) + g('translate(91 38)', [0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 0 L${f(6 * Math.cos(a * Math.PI / 180))} ${f(6 * Math.sin(a * Math.PI / 180))}" stroke="${D}" stroke-width="1.4"/>`).join('') + dot(0, 0, 1.4)) +
      meeple(56, 62, 1.05, '#8B5A3C', 'proud', 0, `<path d="M-15.5 -2 L-9 2 L-4.5 -2 L0 2 L4.5 -2 L9 2 L15.5 -2" stroke="#FFD43B" stroke-width="1.6" fill="none"/><path d="M-15 2 L-9 6 L-4.5 2 L0 6 L4.5 2 L9 6 L15 2" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/>`) +
      el(56, 42.5, 19, 4.4, '#212529', 2.4) + ol('M45 42 C45 30 67 30 67 42Z', '#212529', 2.4) + ln('M45.5 39.5 H66.5', 2, '#E03131') +
      sparkle(30, 42, 3.5)
  },

  'Sociedad Rural': () =>
    ln('M24 32 Q60 44 96 32', 1.6) +
    [[30, '#E03131'], [42, '#FCC419'], [54, '#4DABF7'], [66, '#40C057'], [78, '#E03131'], [90, '#FCC419']].map(([x, c], i) => {
      const y = 33.4 + 4.6 * Math.sin(Math.PI * (+x - 24) / 72) + (i === 0 || i === 5 ? 0 : 0)
      return `<path class="m-ol" style="stroke-width:1.4" d="M${+x - 4} ${f(y)} L${+x + 4} ${f(y)} L${x} ${f(y + 7)}Z" fill="${c}"/>`
    }).join('') +
    ol('M24 82 H96 L92 92 H28Z', '#C97B45') + ln('M30 87 H90', 1.2, '#8B5A3C') +
    stick('M42 76 V82 M50 77 V82 M68 77 V82 M74 76 V82', '#fff', 3) +
    ol('M36 66 C34 54 44 50 58 52 C68 50 78 54 76 66 C76 76 64 80 56 79 C46 80 38 76 36 66Z', '#fff') +
    `<path d="M44 56 C48 54 52 58 50 62 C46 64 42 60 44 56Z M62 66 C66 62 72 66 70 70 C66 72 62 70 62 66Z" fill="${D}"/>` +
    ol('M30 60 C26 62 26 70 30 72', 'none', 2) +
    ol('M72 46 L67 40 C66 38 69 37 70 39Z M88 46 L93 40 C94 38 91 37 90 39Z', '#FFF3BF', 1.6) +
    el(70, 50, 4.6, 2.6, '#fff', 1.8) + el(90, 50, 4.6, 2.6, '#fff', 1.8) +
    ol('M70 50 C70 42 90 42 90 50 L88 64 C88 70 72 70 72 64Z', '#fff') + `<path d="M74 46 C76 44 80 46 79 50 C76 52 73 50 74 46Z" fill="${D}"/>` +
    el(80, 64, 9, 5.6, '#FFA8C5', 2) + dot(77, 64, 1.2) + dot(83, 64, 1.2) + eye(75.5, 54.5, 1.9) + eye(84.5, 54.5, 1.9) +
    ci(72, 74, 5, '#4DABF7', 2) + ci(72, 74, 2.6, '#FCC419', 1.4) + ol('M69 78 L67 86 L70 84 L72 87 L73 79Z', '#4DABF7', 1.4) +
    meeple(38, 77, 0.42, '#40C057', 'happy', -6) + el(37, 67.5, 7, 1.6, '#C97B45', 1.4) + ol('M33 67.5 C33 62.5 41 62.5 41 67.5Z', '#C97B45', 1.4) +
    sparkle(98, 66, 3) + sparkle(24, 52, 3.5),

  'Escudero': () =>
    stick('M50 92 L48 98 M70 92 L72 98', '#40C057', 3) +
    meeple(60, 56, 0.72, '#40C057', 'happy') +
    ol('M38 54 H82 V68 C82 82 72 90 60 96 C48 90 38 82 38 68Z', '#4DABF7') + ol('M44 59 H76 V68 C76 79 68 85 60 89 C52 85 44 79 44 68Z', '#fff', 1.8) +
    ci(60, 71, 6.4, '#FCC419', 1.8) +
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * 45 * Math.PI / 180; return ln(`M${f(60 + 8 * Math.cos(a))} ${f(71 + 8 * Math.sin(a))} L${f(60 + 11 * Math.cos(a))} ${f(71 + 11 * Math.sin(a))}`, 1.8, '#F08C00') }).join('') +
    dot(58, 70, .9) + dot(62, 70, .9) + ln('M58 73 Q60 74.5 62 73', 1) +
    ci(40, 56, 3.8, '#40C057', 2) + ci(80, 56, 3.8, '#40C057', 2) +
    drop(36, 40, 0.8) + drop(86, 42, 0.7) + ln('M30 70 L26 70 M90 70 L94 70 M31 78 L27 80 M89 78 L93 80', 2),

  'Caballero templario': () =>
    ol('M44 50 C32 62 28 84 32 96 H88 C92 84 88 62 76 50Z', '#F8F9FA') + ln('M40 70 C38 80 38 88 40 94 M80 70 C82 80 82 88 80 94', 1.4, '#CED4DA') +
    stick('M86 82 V38', '#E9ECEF', 2.6) + stick('M81 72 H91', '#FCC419', 2.4) + stick('M86 72 V84', '#8B5A3C', 2.4) +
    meeple(60, 64, 1.0, '#ADB5BD', 'none', 0,
      `<path d="M-7 -5 H7 L8.5 21 H-8.5Z" fill="#fff" stroke="${D}" stroke-width="1.6"/><path d="M0 -1 V14 M-5 4 H5" stroke="#E03131" stroke-width="3.2"/>` +
      `<rect x="-8.5" y="-21" width="17" height="15" rx="4" fill="#DEE2E6" stroke="${D}" stroke-width="2"/><path d="M-6.5 -14.5 H6.5" stroke="${D}" stroke-width="2.4"/><path d="M0 -12 V-7" stroke="${D}" stroke-width="1.2"/><circle cx="-3" cy="-9.5" r=".7" fill="${D}"/><circle cx="3" cy="-9.5" r=".7" fill="${D}"/>` +
      `<path d="M-5 -19 C-4 -20 -2 -20 -1 -20" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`) +
    ol('M60 43 C56 36 58 30 64 28 C62 32 64 36 62 43Z', '#E03131', 1.8) + ci(84, 74, 3.4, '#ADB5BD', 1.8) +
    sparkle(32, 40, 4.5, '#fff') + sparkle(42, 30, 3) + sparkle(30, 64, 3, '#fff'),

  'Señor de los feudos': () =>
    stick('M48 80 V88 M72 80 V88', '#5F3DC4', 3) +
    ol('M44 80 V36 C44 26 76 26 76 36 V80Z', '#7048E8') + ln('M48 78 V37 C48 31 72 31 72 37 V78', 1.6, '#FCC419') + ci(60, 28, 2.8, '#FCC419', 1.6) +
    ol('M42 72 H78 L76 80 H44Z', '#5F3DC4') +
    ol('M46 52 C42 62 42 72 46 76 H74 C78 72 78 62 74 52Z', '#C92A2A') + ln('M47 74 H73', 3, '#fff') + ln('M50 74 V74 M56 74 V74 M62 74 V74 M68 74 V74', 1.8, D, 'stroke-dasharray=".1 4"') +
    meeple(60, 56, 0.66, '#FCC419', 'proud') + crown(60, 40, 0.68) +
    sack(52, 88, 0.72) + sack(68, 89, 0.8) + coin(60, 92, 3.6) + coin(44, 92, 3) + coin(76, 92, 3) +
    meeple(30, 76, 0.34, '#40C057', 'happy', -8) + sack(30, 62, 0.55) +
    meeple(90, 74, 0.34, '#4DABF7', 'happy', 8) + sack(90, 60, 0.55) +
    sparkle(30, 44, 3.5) + sparkle(90, 44, 3.5),

  // ═══ SCRABBLE ═══
  'Triple palabra': () =>
    g('rotate(-6 60 70)', re(38, 48, 44, 42, 6, '#E03131') + `<rect x="42" y="52" width="36" height="34" rx="3.5" fill="none" stroke="#FFA8A8" stroke-width="1.6"/>` +
      t(60, 75, 21, 'x3', '#fff', OUT) + t(60, 83.5, 6, 'PALABRA', '#FFE3E3', 'textLength="24" lengthAdjust="spacingAndGlyphs"') + sh('M44 56 H52', 2.2, 0.6)) +
    ln('M38 22 L40 26 M58 16 V20 M82 24 L80 28', 1.8) +
    tile(40, 36, 13, 'A', '1', -16) + tile(60, 29, 13, 'Ñ', '8', 8) + tile(80, 38, 13, 'Z', '10', 18) +
    sparkle(28, 58, 3.5) + sparkle(92, 60, 3.5) + sparkle(86, 80, 3, '#fff'),

  'Diccionario de bolsillo': () =>
    `<polygon points="${starPts(60, 58, 38, 22, 10)}" fill="#FFE066" opacity=".55"/>` +
    t(36, 46, 15, 'A', '#4DABF7', OUT + ' transform="rotate(-20 36 46)"') + t(50, 34, 15, 'Ñ', '#E03131', OUT) + t(70, 34, 15, 'Q', '#40C057', OUT + ' transform="rotate(10 70 34)"') +
    t(84, 48, 14, 'Z', '#9775FA', OUT + ' transform="rotate(18 84 48)"') + t(60, 50, 12, 'K', '#FF922B', OUT) +
    sparkle(30, 62, 3) + sparkle(90, 64, 3) + sparkle(42, 24, 0) +
    g('rotate(-6 60 74)',
      ol('M42 60 L60 64 L78 60 V86 L60 90 L42 86Z', '#FFF8E7') + ln('M60 64 V90', 1.8) + ln('M46 66 L56 68 M46 71 L56 73 M64 68 L74 66 M64 73 L74 71', 1.2, '#ADB5BD') +
      ol('M40 62 V88 L60 93 L80 88 V62 L78 86 L60 90 L42 86Z', '#C92A2A') + ol('M60 90 V93', 'none', 2)) +
    ln('M44 58 L40 52 M76 58 L80 52 M60 60 V54', 2, '#FAB005'),

  'Real Academia': () =>
    ol('M20 100 C20 78 30 66 44 66 C58 66 66 78 66 100Z', '#343A40') + ln('M44 70 V100', 1.6, '#495057') +
    ln('M36 68 Q44 80 52 68', 2, '#4DABF7') + ci(44, 82, 4.6, '#FCC419', 2) + `<polygon points="${starPts(44, 82, 3, 1.4)}" fill="#E67700"/>` +
    ci(44, 46, 14, '#F4BE8F') + ol('M30 46 C28 38 32 34 36 36 C34 40 34 44 34 48Z M58 46 C60 38 56 34 52 36 C54 40 54 44 54 48Z', '#F8F9FA', 1.6) +
    ol('M32 50 C32 60 38 70 44 72 C50 70 56 60 56 50 C52 54 48 56 44 56 C40 56 36 54 32 50Z', '#F8F9FA') + ln('M40 56 Q44 54 48 56', 1.6, '#ADB5BD') +
    ci(39, 46, 4, '#E7F5FF', 1.6) + ci(49, 46, 4, '#E7F5FF', 1.6) + ln('M43 46 H45', 1.4) + dot(39, 46.4, 1.3) + dot(49, 46.4, 1.3) +
    ln('M35 40.5 L41 40 M47 40 L53 40.5', 1.8, '#ADB5BD') + sh('M38 36 C40 34 44 33 47 33', 1.8, 0.7) +
    `<polygon points="${starPts(78, 62, 26, 17, 12)}" fill="#FFE066" opacity=".7"/>` +
    tile(78, 60, 28, 'Ñ', '8', 8, '#FFD43B') + ci(64, 66, 4, '#F4BE8F', 2) + ci(90, 72, 4, '#F4BE8F', 2) +
    sparkle(92, 38, 4.5) + sparkle(64, 34, 3.5, '#fff'),

  'Atril vacío': () => {
    const L = 'GANASTE'
    let s = ''
    for (let i = 0; i < 7; i++) {
      const deg = -162 + i * 24, a = deg * Math.PI / 180, x = f(60 + 34 * Math.cos(a)), y = f(76 + 34 * Math.sin(a))
      s += tile(x, y, 11.5, L[i], String([2, 1, 1, 1, 1, 1, 1][i]), deg + 90)
    }
    return ln('M44 70 Q40 62 36 56 M76 70 Q80 62 84 56 M60 68 V60', 1.8, '#ADB5BD', 'stroke-dasharray="2 3"') + s +
      ol('M32 78 H88 L84 88 H36Z', '#B4703F') + ol('M30 74 H90 V79 H30Z', '#C97B45') + sh('M34 76 H70', 1.4, 0.5) +
      t(60, 70, 12, '+50', '#E03131', OUT) + sparkle(60, 50, 3.5)
  },

  'Cantó línea': () =>
    stick('M36 58 L32 68 M60 58 L64 68', '#8B5A3C', 2.6) + stick('M28 68 H68', '#8B5A3C', 3) +
    ci(48, 42, 16, '#FFF3BF', 2.6) + ln('M48 26 C40 34 40 50 48 58 M48 26 C56 34 56 50 48 58 M32 42 H64 M34 34 H62 M34 50 H62', 1.4, '#E8590C') +
    ci(44, 44, 2.6, '#4DABF7', 1.2) + ci(52, 38, 2.6, '#E03131', 1.2) + ci(50, 50, 2.6, '#40C057', 1.2) +
    ci(48, 42, 2.4, '#ADB5BD', 1.6) + stick('M64 42 H70 V48', '#ADB5BD', 2) +
    ci(80, 36, 9, '#FFD43B') + ci(80, 36, 5.8, '#fff', 1.4) + t(80, 39, 7.6, '50', D) + sh('M74 31 C75 29 77 28 79 28', 1.8, 0.8) +
    ln('M70 30 L66 28 M72 44 L68 47 M88 46 L90 49', 1.8) +
    'CANTADO'.split('').map((c, i) => tile(f(30.6 + i * 9.8), 78, 9, c, '1', i % 2 ? 3 : -3)).join('') +
    t(60, 96, 8.6, '¡LÍNEA!', '#E03131', OUT),

  'Sopa de letras': () =>
    ln('M48 42 C44 36 52 32 48 26 M60 40 C56 34 64 30 60 22 M72 42 C68 36 76 32 72 26', 2.4, '#ADB5BD') +
    stick('M78 58 L94 36', '#CED4DA', 3) + el(95, 34.5, 3, 4.4, '#CED4DA', 2) +
    el(60, 92, 12, 3, '#1C7ED6', 2.2) +
    ol('M27 58 C27 80 42 92 60 92 C78 92 93 80 93 58Z', '#4DABF7') + ln('M32 72 C38 80 46 85 54 86', 2.4, '#fff', 'opacity=".55"') +
    ln('M40 76 L44 80 L48 76 L52 80 L56 76 L60 80 L64 76 L68 80 L72 76 L76 80 L80 76', 1.6, '#FFE066') +
    el(60, 58, 33, 9, '#FFA94D') + `<ellipse cx="60" cy="57" rx="28" ry="6" fill="#FFC078"/>` +
    t(60, 62, 12, 'CAPO', '#FFF3BF', OUT + ' textLength="34" lengthAdjust="spacingAndGlyphs"') +
    `<g fill="#FFF3BF" stroke="${D}" stroke-width="1"><circle cx="38" cy="58" r="1.8"/><circle cx="82" cy="57" r="1.8"/><circle cx="46" cy="53" r="1.4"/><circle cx="74" cy="53" r="1.4"/></g>` +
    sparkle(28, 40, 4) + sparkle(88, 76, 3.5, '#fff'),

  'Maestra ciruela': () =>
    ol('M32 100 C32 82 42 72 58 72 C74 72 84 82 84 100Z', '#fff') + ln('M58 76 V100', 1.6, '#DEE2E6') +
    ol('M49 76 C44 72 44 82 49 80 L58 78 L67 80 C72 82 72 72 67 76 L58 78Z', '#4DABF7', 1.8) + ci(58, 78, 2.2, '#339AF0', 1.4) +
    ci(58, 50, 16, '#F4BE8F') + ci(58, 30, 6.4, '#8D6E63') +
    ol('M42 50 C40 38 48 34 58 34 C68 34 76 38 74 50 C72 42 64 40 58 42 C52 40 44 42 42 50Z', '#8D6E63') +
    ln('M48 47 Q51 45 54 47 M62 47 Q65 45 68 47', 1.8) + dot(51, 50, 1.5) + dot(65, 50, 1.5) +
    re(46, 55, 9, 5.5, 2, '#E7F5FF', 1.6) + re(61, 55, 9, 5.5, 2, '#E7F5FF', 1.6) + ln('M55 57 H61', 1.4) +
    ln('M54.5 64 Q58 62.5 61.5 64', 1.8) + blush(46, 62, 2) + blush(70, 62, 2) +
    stick('M78 88 L94 46', '#C97B45', 2) + ci(80, 84, 4, '#F4BE8F', 2) + ci(94.5, 44.5, 1.8, '#E03131', 1.2) +
    ci(30, 86, 6.6, '#9C36B5') + sh('M27 83 C27 81 29 80 30 80', 1.6, 0.7) + ln('M30 79 L31 75', 1.6) + ol('M31 76 C34 72 38 74 38 74 C36 78 33 78 31 76Z', '#40C057', 1.4) +
    t(30, 58, 8, 'abc', '#40C057', 'transform="rotate(-14 30 58)"'),

  'Ratón de biblioteca': () =>
    ol('M76 70 C88 66 94 72 92 80 C90 86 84 84 86 80', 'none', 2.2) +
    ci(44, 38, 9, '#ADB5BD') + ci(76, 38, 9, '#ADB5BD') + ci(44, 38, 5.4, '#FFA8C5', 1.6) + ci(76, 38, 5.4, '#FFA8C5', 1.6) +
    ol('M44 66 C42 50 48 42 60 42 C72 42 78 50 76 66Z', '#ADB5BD') +
    ci(53, 54, 5, '#E7F5FF', 1.8) + ci(67, 54, 5, '#E7F5FF', 1.8) + ln('M58 54 H62', 1.6) + dot(53, 55, 1.8) + dot(67, 55, 1.8) +
    el(60, 62, 2.4, 1.8, '#FF6B9A', 1.4) + ln('M54 62 L44 60 M54 64 L45 66 M66 62 L76 60 M66 64 L75 66', 1, D) + blush(48, 60, 2) + blush(72, 60, 2) +
    ol('M30 72 L60 76 L90 72 V92 L60 96 L30 92Z', '#C92A2A') +
    ol('M32 70 C42 66 52 68 60 72 C68 68 78 66 88 70 V88 C78 84 68 86 60 90 C52 86 42 84 32 88Z', '#FFF8E7') + ln('M60 72 V90', 1.6) +
    ln('M37 74 Q46 72 55 75 M37 78 Q46 76 55 79 M37 82 Q46 80 54 83 M65 75 Q74 72 83 74 M65 79 Q74 76 83 78 M66 83 Q74 80 83 82', 1.2, '#ADB5BD') +
    ci(50, 70, 3, '#ADB5BD', 1.6) + ci(70, 70, 3, '#ADB5BD', 1.6) +
    sparkle(30, 52, 3.5) + sparkle(90, 54, 3.5, '#fff'),

  'Rayuela': () => {
    const q = (x0: number, x1: number, y0: number, y1: number, k: number) => {
      const dx = (y1 - y0) * k
      return `<path d="M${f(x0 + dx)} ${y0} H${f(x1 - dx)} L${x1} ${y1} H${x0}Z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`
    }
    return `<rect x="0" y="0" width="120" height="130" fill="#868E96"/>` + ln('M18 40 L40 34 M80 30 L102 36 M24 70 L36 66', 1.2, '#ADB5BD') +
      `<path d="M38 40 C38 22 82 22 82 40" fill="none" stroke="#fff" stroke-width="2.4"/>` + t(60, 36, 8, 'CIELO', '#fff', 'textLength="24" lengthAdjust="spacingAndGlyphs"') +
      q(48, 72, 40, 52, 0.08) + q(40, 60, 52, 66, 0.1) + q(60, 80, 52, 66, 0.1) + q(48, 72, 66, 80, 0.1) + q(48, 72, 80, 96, 0.1) +
      tile(60, 46.5, 8, 'O', '1') + tile(50, 59, 9, 'L', '1', -4) + tile(70, 59, 9, 'I', '1', 4) + tile(60, 73, 10, 'U', '1', -3) + tile(60, 88, 11, 'J', '8', 3) +
      el(76, 64, 3.6, 2.6, '#E8590C', 1.6) + sh('M74.6 63 L75.6 62.6', 1, 0.8) +
      g('rotate(30 32 82)', re(26, 80, 14, 4, 2, '#FFF3BF', 1.6)) + sparkle(92, 52, 3, '#fff')
  },

  // ═══ AMONG US ═══
  'Ventilación': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#ADB5BD"/>` + ln('M18 50 H102 M18 74 H102 M44 30 V50 M80 50 V74 M40 74 V100', 1.4, '#868E96') +
    g('translate(4 4) rotate(-16 36 56)', re(20, 50, 30, 12, 2, '#CED4DA', 2.2) + ln('M25 53 V59 M30 53 V59 M35 53 V59 M40 53 V59 M45 53 V59', 1.6, '#868E96')) +
    ol('M32 80 L40 68 H82 L90 80Z', '#212529') +
    crew(60, 64, 1.25, '#E03131', '#A61E1E', `<path d="M-2 -6.5 Q1 -8.5 4 -6.5" stroke="${D}" stroke-width="1.2" fill="none"/><path d="M5 -6.5 Q8 -8.5 11 -6.5" stroke="${D}" stroke-width="1.2" fill="none"/>`) +
    ol('M30 80 H92 L88 88 H34Z', '#868E96') + ln('M38 84 H84', 1.4, '#495057') +
    sparkle(30, 66, 3.5, '#fff') + t(86, 44, 9, 'sus', '#E03131', OUT),

  'Sabotaje': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#1A1B2E"/>` +
    `<path d="M60 32 L18 100 H44Z M60 32 L102 100 H76Z" fill="#FF6B6B" opacity=".18"/>` +
    `<circle cx="60" cy="30" r="16" fill="#FF6B6B" opacity=".25"/>` +
    re(50, 32, 20, 5, 1.5, '#495057', 2) + ol('M52 32 C52 22 68 22 68 32Z', '#FA5252') + sh('M56 28 C56 26 58 25 60 25', 1.8, 0.8) +
    ln('M46 24 L42 20 M74 24 L78 20 M60 18 V14', 2, '#FF8787') +
    `<path d="M44 92 C44 70 46 58 60 58 C74 58 76 70 76 92Z" fill="#2C2E43"/>` +
    `<ellipse cx="54" cy="68" rx="6" ry="3" fill="#FFE066" opacity=".3"/><ellipse cx="66" cy="68" rx="6" ry="3" fill="#FFE066" opacity=".3"/>` +
    `<path d="M50 68 Q54 64.5 58 68 Q54 70 50 68Z M62 68 Q66 64.5 70 68 Q66 70 62 68Z" fill="#FFE066"/>` +
    dot(54, 67.6, 1, D) + dot(66, 67.6, 1, D) +
    t(30, 50, 14, '!', '#FF6B6B', OUT) + t(90, 50, 14, '!', '#FF6B6B', OUT) +
    `<rect x="30" y="86" width="14" height="10" rx="1" fill="#25273A"/><rect x="78" y="84" width="12" height="12" rx="1" fill="#25273A"/>`,

  'Alien de la nave': () =>
    stick('M50 66 C40 58 34 62 30 52', '#9775FA', 4.4) + stick('M70 66 C80 58 86 62 90 52', '#9775FA', 4.4) +
    stick('M54 70 C46 74 38 72 34 78', '#B197FC', 3.4) + stick('M66 70 C74 74 82 72 86 78', '#B197FC', 3.4) +
    ci(30, 51, 2.6, '#E599F7', 1.4) + ci(90, 51, 2.6, '#E599F7', 1.4) +
    ol('M46 70 C44 50 50 40 60 40 C70 40 76 50 74 70Z', '#9775FA') + sh('M51 48 C52 45 55 43 58 43', 2, 0.6) +
    ci(53, 54, 5.4, '#fff', 1.8) + ci(67, 54, 5.4, '#fff', 1.8) + dot(53.6, 55, 3.4) + dot(67.6, 55, 3.4) + dot(55, 53.4, 1.3, '#fff') + dot(69, 53.4, 1.3, '#fff') +
    ln('M57 63 Q60 65 63 63', 1.6) + blush(48, 62, 2.2) + blush(72, 62, 2.2) +
    g('rotate(-28 40 70)', ol('M38 70 C38 52 60 50 62 60 V70Z', '#E03131') + ol('M46 60 H56 C60 60 60 66 56 66 H46 C42 66 42 60 46 60Z', '#9BE3F5', 2) + `<path d="M40 70 L43 74 L46 70 L49 74 L52 70 L55 74 L58 70" fill="#fff" stroke="${D}" stroke-width="1.2"/>`) +
    ol('M40 72 H80 V88 C80 92 72 92 72 88 V86 H66 V90 C66 94 56 94 56 90 V86 H48 V88 C48 92 40 92 40 88Z', '#E03131') + el(60, 72, 20, 4, '#862E2E') +
    `<path d="M42 72 L45 76 L48 72 L51 76 L54 72 L57 76 L60 72 L63 76 L66 72 L69 76 L72 72 L75 76 L78 72" fill="#fff" stroke="${D}" stroke-width="1.2"/>` +
    t(60, 33, 9, '¿yo?', '#7048E8', OUT),

  'Escaneo médico': () =>
    `<path d="M36 86 L40 28 H80 L84 86Z" fill="#69DB7C" opacity=".22"/>` +
    el(60, 87, 26, 7, '#2B8A3E') + el(60, 86, 20, 5, '#69DB7C', 2) + el(60, 86, 12, 2.8, '#B2F2BB', 1.6) +
    crew(60, 60, 1.3, '#4DABF7', '#1864AB') +
    `<rect x="36" y="56" width="48" height="4" fill="#8CE99A" opacity=".85"/>` + ln('M36 58 H84', 1, '#2B8A3E') +
    ln('M38 44 H82 M38 72 H82', 1, '#40C057', 'opacity=".6" stroke-dasharray="3 3"') +
    re(84, 44, 12, 14, 2, '#343A40', 1.8) + ln('M86.5 54 V52 M89.5 54 V49 M92.5 54 V47', 1.8, '#69DB7C') +
    t(30, 54, 8, 'OK', '#2F9E44', OUT) + sparkle(30, 72, 3),

  'Cables conectados': () => {
    const L = [44, 56, 68, 80], R = [56, 80, 44, 68], C = ['#E03131', '#4DABF7', '#FCC419', '#E64980']
    return re(28, 36, 64, 50, 5, '#495057') + re(32, 40, 56, 42, 3, '#343A40', 1.6) +
      C.map((c, i) => stick(`M38 ${L[i]} C54 ${L[i]} 66 ${R[i]} 82 ${R[i]}`, c, 3.2)).join('') +
      C.map((c, i) => re(30, L[i] - 3.5, 8, 7, 1.5, c, 1.6) + re(82, R[i] - 3.5, 8, 7, 1.5, c, 1.6)).join('') +
      ci(84, 82, 9, '#40C057') + ln('M79.5 82 L83 85.5 L89 78.5', 3, '#fff') +
      sparkle(32, 30, 3.5) + sparkle(94, 64, 3)
  },

  'Capitán de la nave': () =>
    ol('M30 80 C30 74 90 74 90 80 V86 C90 92 30 92 30 86Z', '#868E96') + el(60, 80, 30, 6, '#ADB5BD') +
    el(76, 76, 12, 4, '#DEE2E6', 2) + ol('M66 76 C66 64 86 64 86 76Z', '#FA5252') + sh('M70 70 C71 68 73 67 75 67', 2, 0.8) +
    el(76, 76, 10, 2.4, '#C92A2A', 1.6) +
    crew(44, 60, 1.2, '#40C057', '#2B8A3E') + stick('M56 66 L66 68', '#40C057', 3.2) +
    // gorra de capitán
    ol('M30 42 C30 34 56 32 58 40 L57 44 H31Z', '#fff', 2.2) + ol('M31 44 H57 V47 H31Z', '#212529', 2) + ol('M52 46 C58 46 62 48 62 50 C58 50 54 49 50 48Z', '#212529', 1.8) +
    ci(44, 41, 2.6, '#FCC419', 1.4) + ln('M33 46 H55', 1, '#FCC419') +
    star(80, 34, 5, '#FFD43B', 1.6) + sparkle(92, 50, 3.5) + sparkle(26, 70, 3, '#fff') +
    t(60, 89.6, 5.4, 'EMERGENCIA', '#fff', 'textLength="26" lengthAdjust="spacingAndGlyphs"'),

  'Cuchillito': () =>
    `<g opacity=".3">${crew(66, 58, 1.55, '#5F3DC4', '#5F3DC4', '', 0, '#5F3DC4')}</g>` + `<path d="M68 47 H76" stroke="#E03131" stroke-width="2.4" stroke-linecap="round"/>` +
    g('rotate(-40 56 64)',
      re(32, 59, 22, 10, 4, '#8B5A3C') + dot(38, 64, 1.3, '#FCC419') + dot(47, 64, 1.3, '#FCC419') + sh('M35 61.5 H50', 1.4, 0.5) +
      ol('M54 58 H82 C86 58 88 62 88 64 C80 68 66 70 54 70Z', '#DEE2E6') + sh('M58 61 H80', 2, 0.9) + ln('M54 58 V70', 2.4)) +
    `<path class="m-ol" style="stroke-width:1.8" d="M79 50 C81 53 82 55 82 56.5 A3 3 0 0 1 76 56.5 C76 55 77 53 79 50Z" fill="#E5383B"/>` +
    sparkle(36, 40, 4) + sparkle(90, 72, 3) + t(44, 88, 8, 'shh…', '#495057', OUT.replace('currentColor', '#fff')),

  'Ninja del ducto': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#CED4DA"/>` + ln('M18 50 H102 M44 30 V50 M80 50 V74 M18 74 H102', 1.4, '#ADB5BD') +
    ln('M78 26 L86 34 M86 24 L94 32 M72 32 L78 38', 2.2, '#868E96') +
    g('rotate(-22 30 66)', re(18, 62, 22, 9, 2, '#ADB5BD', 2) + ln('M22 64.5 V68.5 M27 64.5 V68.5 M32 64.5 V68.5', 1.4, '#868E96')) +
    ol('M32 88 L40 76 H80 L88 88Z', '#212529') +
    crew(58, 64, 1.2, '#343A40', '#212529',
      `<path d="M-11 -13.5 H11" stroke="#E03131" stroke-width="3"/><path class="m-ol" style="stroke-width:1.4" d="M-11 -13 C-16 -16 -20 -14 -25 -17 C-21 -12 -16 -12 -12 -11Z M-11 -13 C-16 -10 -19 -7 -21 -3 C-16 -7 -14 -9 -11 -12Z" fill="#E03131"/>` +
      `<path d="M-1 -8 H9" stroke="${D}" stroke-width="3.2" stroke-linecap="round"/>`, 158) +
    ol('M30 88 H90 L86 96 H34Z', '#868E96') + ln('M38 92 H82', 1.4, '#495057') +
    g('rotate(20 30 40)', `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(30, 40, 6, 2, 4)}" fill="#ADB5BD"/>`) + dot(30, 40, 1.2) +
    ln('M70 34 L66 44 M78 40 L72 48 M62 30 L60 38', 2, '#fff'),

  'Pesadilla espacial': u =>
    `<rect x="0" y="0" width="120" height="130" fill="#10132B"/>` +
    [[30, 34], [48, 24], [86, 28], [94, 46], [26, 62], [40, 90], [84, 88], [70, 22]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? .9 : 1.4}" fill="#fff"/>`).join('') +
    ci(32, 84, 5, '#9775FA', 2) + ln('M28 82.5 Q32 81 36 82.5', 1.2, '#B197FC') +
    ol('M30 56 L19 52 L23 61 L19 70 L30 66Z', '#FF922B', 2) + ol('M30 58 L24 57 L26 61 L24 65 L30 64Z', '#FFE066', 1.4) +
    ol('M44 46 L36 30 H48 L60 44Z', '#868E96') + ol('M44 76 L36 92 H48 L60 78Z', '#868E96') +
    ol('M28 62 C28 50 44 42 62 42 C82 42 96 52 96 62 C96 72 82 80 62 80 C44 80 28 74 28 62Z', '#CED4DA') +
    ln('M34 70 H58', 1.4, '#868E96') + re(36, 52, 9, 6, 2, '#868E96', 1.4) + sh('M36 49 C42 46 48 45 54 45', 2.2, 0.7) +
    `<defs><clipPath id="pw${u}"><circle cx="72" cy="61" r="14"/></clipPath></defs>` +
    `<circle cx="72" cy="61" r="14" fill="#FFE066"/>` +
    `<g clip-path="url(#pw${u})"><g transform="translate(146 0) scale(-1 1)">${crew(73, 70, 0.78, '#212529', '#212529', '', 0, '#FF2E2E')}</g>` +
    `<path d="M64.5 60 L62 47 C64 48 66 52 66.5 60Z" fill="#DEE2E6" stroke="currentColor" stroke-width="1"/><rect x="62" y="59.5" width="7" height="2.2" rx="1" fill="#212529"/></g>` +
    ci(72, 61, 14, 'none', 3.4) + ci(72, 61, 17, 'none', 1.6) +
    t(60, 96, 7, 'aaah…', '#ADB5BD'),
}
