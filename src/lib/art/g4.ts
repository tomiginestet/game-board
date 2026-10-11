// Ilustraciones de medallas: Generala, UNO, Coup, Pistas Cruzadas, 7 Wonders y Mario Kart.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Atajos de dibujo ──────────────────────────────────────────────────
const sw_ = (sw?: number) => (sw ? ` style="stroke-width:${sw}"` : '')
const P = (d: string, fill: string, sw?: number) => `<path class="m-ol"${sw_(sw)} d="${d}" fill="${fill}"/>`
const C = (cx: number, cy: number, r: number, fill: string, sw?: number) => `<circle class="m-ol"${sw_(sw)} cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`
const E = (cx: number, cy: number, rx: number, ry: number, fill: string, sw?: number, rot = 0) =>
  `<ellipse class="m-ol"${sw_(sw)} cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`
const R = (x: number, y: number, w: number, h: number, rx: number, fill: string, sw?: number) =>
  `<rect class="m-ol"${sw_(sw)} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`
const L = (d: string, c = D, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`
const g = (tr: string, inner: string) => `<g transform="${tr}">${inner}</g>`
const hl = (x: number, y: number, rx: number, ry: number, rot = -30, op = .7) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`
const eye = (x: number, y: number, r = 1.8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${f(x + r * .3)}" cy="${f(y - r * .35)}" r="${f(r * .38)}" fill="#fff"/>`
const cheek = (x: number, y: number, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/>`
const smile = (x: number, y: number, w = 3, sw = 1.8) => L(`M${f(x - w)} ${y} Q${x} ${f(y + w * .9)} ${f(x + w)} ${y}`, D, sw)
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`
const drop = (x: number, y: number, s = 1, c = '#74C0FC') => P(`M${x} ${y} C${f(x + 2.6 * s)} ${f(y + 3.6 * s)} ${f(x + 2.6 * s)} ${f(y + 6 * s)} ${x} ${f(y + 6 * s)} C${f(x - 2.6 * s)} ${f(y + 6 * s)} ${f(x - 2.6 * s)} ${f(y + 3.6 * s)} ${x} ${y}Z`, c, 1.5)
const SKIN = '#F4BE8F'
/** Nube con contorno unido (círculos [x,y,r]). */
const cloud = (cs: [number, number, number][], fill = '#fff') =>
  cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${D}" stroke-width="5.4"/>`).join('') + cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('')

// ── Piezas de juego ───────────────────────────────────────────────────
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}
const die = (x: number, y: number, s: number, n: number, fill = '#fff', pip = D, rot = 0, sw = 2.6) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect class="m-ol" style="stroke-width:${sw}" x="${f(-s / 2)}" y="${f(-s / 2)}" width="${s}" height="${s}" rx="${f(s * .22)}" fill="${fill}"/>` +
  `<path d="M${f(-s * .3)} ${f(-s * .34)} H${f(s * .05)}" stroke="#fff" stroke-width="${f(s * .08)}" stroke-linecap="round" opacity=".6"/>` +
  PIPS[n].map(([a, b]) => `<circle cx="${f(a * s * .26)}" cy="${f(b * s * .26)}" r="${f(s * .09)}" fill="${pip}"/>`).join('') + `</g>`
/** Carta de UNO (20×28 con s=1). */
const uno = (x: number, y: number, rot: number, s: number, c: string, txt: string) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/><rect x="-7.6" y="-11.6" width="15.2" height="23.2" rx="2" fill="${c}"/>` +
    `<ellipse rx="5.6" ry="10.4" fill="#fff" transform="rotate(28)"/>` +
    t(0, txt.length > 1 ? 3.4 : 4.4, txt.length > 1 ? 9 : 12.5, txt, c, `stroke="${D}" stroke-width="1.1" paint-order="stroke"`))
/** Comodín +4 negro. */
const wild = (x: number, y: number, rot: number, s: number) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/><rect x="-7.6" y="-11.6" width="15.2" height="23.2" rx="2" fill="#212529"/>` +
    `<ellipse rx="5.6" ry="10.4" fill="#fff" transform="rotate(28)"/>` +
    `<rect x="-6.4" y="-10.4" width="3.4" height="3.4" rx=".8" fill="#E03131"/><rect x="3" y="-10.4" width="3.4" height="3.4" rx=".8" fill="#1C7ED6"/><rect x="-6.4" y="7" width="3.4" height="3.4" rx=".8" fill="#FCC419"/><rect x="3" y="7" width="3.4" height="3.4" rx=".8" fill="#40C057"/>` +
    t(0, 3.4, 9.5, '+4', '#F03E3E', `stroke="${D}" stroke-width="1.1" paint-order="stroke"`))
/** Carta de personaje (Coup): 22×30 con s=1; `inner` se dibuja centrado en (0,-2). */
const ccard = (x: number, y: number, rot: number, s: number, bg: string, inner: string) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-11" y="-15" width="22" height="30" rx="3" fill="#FFF3D6"/><rect x="-8" y="-12" width="16" height="20" rx="2" fill="${bg}"/>` +
    inner + `<rect x="-7" y="10" width="14" height="2.4" rx="1.2" fill="#E9C46A"/>`)
const coin = (x: number, y: number, r: number) =>
  `<circle class="m-ol" cx="${x}" cy="${y}" r="${r}" fill="#FCC419"/><circle cx="${x}" cy="${y}" r="${f(r * .62)}" fill="none" stroke="#E67700" stroke-width="1.6"/>` +
  `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .4)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" transform="rotate(-40 ${f(x - r * .4)} ${f(y - r * .4)})"/>`
const gear = (x: number, y: number, r: number, fill = '#ADB5BD', sw = 2.2) => {
  let d = ''
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2, rr = Math.floor(i / 2) % 2 ? r * .78 : r
    d += (i ? 'L' : 'M') + f(x + rr * Math.cos(a + .1)) + ' ' + f(y + rr * Math.sin(a + .1)) + ' '
  }
  return P(d + 'Z', fill, sw) + C(x, y, f(r * .32), '#fff', sw)
}
const MEEPLE = 'M-5 -6 C-10 -8 -9 -21 0 -21 C9 -21 10 -8 5 -6 L16 -4 C22 -3 22 6 16 6 L10 5 L15 19 C16 22 14 23 11 23 L3 23 C2 18 1 15 0 13 C-1 15 -2 18 -3 23 L-11 23 C-14 23 -16 22 -15 19 L-10 5 L-16 6 C-22 6 -22 -3 -16 -4Z'
const meeple = (x: number, y: number, s: number, fill: string, rot = 0, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="${MEEPLE}" fill="${fill}"/>` +
  `<ellipse cx="-4" cy="-17" rx="2.2" ry="1.4" fill="#fff" opacity=".7" transform="rotate(-30 -4 -17)"/>` + extra + `</g>`

// Karts
type Mood = 'happy' | 'scared' | 'dizzy' | 'burnt' | 'sad'
/** Cabeza de piloto con casco, en coordenadas locales. */
const pilot = (x: number, y: number, r: number, helm: string, mood: Mood = 'happy') => {
  const fx = f(x + r * .18), fy = f(y + r * .12), sk = mood === 'burnt' ? '#5C5F66' : SKIN, ex = r * .24, ey = f(fy - r * .08)
  const face = mood === 'happy' ? eye(f(fx - ex), ey, r * .13) + eye(f(fx + ex), ey, r * .13) + smile(fx, f(fy + r * .2), r * .2, 1.4)
    : mood === 'scared' ? `<circle cx="${f(fx - ex)}" cy="${ey}" r="${f(r * .17)}" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="${f(fx + ex)}" cy="${ey}" r="${f(r * .17)}" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="${f(fx - ex)}" cy="${ey}" r="${f(r * .06)}" fill="${D}"/><circle cx="${f(fx + ex)}" cy="${ey}" r="${f(r * .06)}" fill="${D}"/><ellipse cx="${fx}" cy="${f(fy + r * .28)}" rx="${f(r * .1)}" ry="${f(r * .13)}" fill="${D}"/>`
    : mood === 'dizzy' ? L(`M${f(fx - ex - 1.4)} ${f(+ey - 1.4)} l2.8 2.8 m0 -2.8 l-2.8 2.8 M${f(fx + ex - 1.4)} ${f(+ey - 1.4)} l2.8 2.8 m0 -2.8 l-2.8 2.8`, D, 1.2) + L(`M${f(fx - 2)} ${f(fy + r * .28)} q1 -1 2 0 t2 0`, D, 1.2)
    : mood === 'burnt' ? `<circle cx="${f(fx - ex)}" cy="${ey}" r="${f(r * .14)}" fill="#fff"/><circle cx="${f(fx + ex)}" cy="${ey}" r="${f(r * .14)}" fill="#fff"/><circle cx="${f(fx - ex)}" cy="${ey}" r="${f(r * .05)}" fill="${D}"/><circle cx="${f(fx + ex)}" cy="${ey}" r="${f(r * .05)}" fill="${D}"/>` + L(`M${f(fx - 2)} ${f(fy + r * .3)} h4`, '#fff', 1.2)
    : eye(f(fx - ex), ey, r * .12) + eye(f(fx + ex), ey, r * .12) + L(`M${f(fx - 2.2)} ${f(fy + r * .34)} Q${fx} ${f(fy + r * .18)} ${f(fx + 2.2)} ${f(fy + r * .34)}`, D, 1.3)
  return C(x, y, r, helm) + L(`M${f(x - r * .75)} ${f(y - r * .4)} Q${x} ${f(y - r * 1.05)} ${f(x + r * .75)} ${f(y - r * .4)}`, '#fff', 1.8, ' opacity=".6"') +
    E(fx, fy, f(r * .62), f(r * .55), sk, 1.8) + face
}
const KART = 'M-24 2 C-24 -3 -20 -5 -14 -5 H2 L8 -10 H18 C23 -10 26 -6 26 -1 V2 C26 5 24 7 21 7 H-21 C-23 7 -24 5 -24 2Z'
const wheel = (x: number, y: number, r = 6.5, c = '#343A40') => C(x, y, r, c) + `<circle cx="${x}" cy="${y}" r="${f(r * .38)}" fill="#ADB5BD"/>`
const kart = (x: number, y: number, s: number, c: string, head: string, rot = 0, wc = '#343A40') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    R(-21, -16, 6, 12, 2, '#495057', 2.2) + stick('M8 -9 L3 -16', '#495057', 2) + head + P(KART, c) + L('M-19 -1 H0', '#fff', 2, ' opacity=".5"') +
    C(22, -3, 1.8, '#FFF3BF', 1.4) + wheel(-15, 7, 6.5, wc) + wheel(15, 7, 6.5, wc))
/** Caparazón azul con pinches y alas. */
const blueShell = (x: number, y: number, s: number, rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    P('M-7 -5 C-16 -16 -24 -8 -17 -2 C-14 0 -10 -1 -7 -3Z', '#fff', 2.2) + P('M7 -5 C16 -16 24 -8 17 -2 C14 0 10 -1 7 -3Z', '#fff', 2.2) +
    E(0, 3, 13, 4.5, '#FFF3BF', 2.4) + P('M-12 2 C-12 -12 12 -12 12 2Z', '#339AF0', 2.4) +
    [[-6, -6, -9, -13], [0, -8, 0, -16], [6, -6, 9, -13]].map(([a, b, c2, d]) => `<polygon class="m-ol" style="stroke-width:1.6" points="${a - 2.6},${b + 1} ${c2},${d} ${a + 2.6},${b + 1}" fill="#fff"/>`).join('') +
    hl(-6, -2, 2.4, 1.4))
/** Caparazón común (verde/rojo). */
const shell = (x: number, y: number, s: number, c: string, rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,
    E(0, 3, 12, 4.2, '#fff', 2.4) + P('M-11 2 C-11 -12 11 -12 11 2Z', c, 2.4) +
    L('M-5 -7 L-2 -2 H4 L6 -6 M-2 -2 L-4 2 M4 -2 L6 2 M-8 -2 H-6', '#fff', 1.4, ' opacity=".8"') + hl(-6, -4, 2.2, 1.3))

export const G4_ART: Record<string, (u: number) => string> = {
  // ══ GENERALA ══════════════════════════════════════════════════════
  'Cubilete de bodegón': u => {
    let ch = ''
    for (let i = 0; i < 11; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) ch += `M${14 + i * 9} ${78 + j * 7}h9v7h-9Z`
    return `<defs><clipPath id="cb${u}"><rect x="14" y="78" width="92" height="30"/></clipPath></defs><rect x="14" y="78" width="92" height="30" fill="#fff"/>` +
      `<path d="${ch}" fill="#E03131" opacity=".8" clip-path="url(#cb${u})"/>` + L('M14 78 H106', D, 3) +
      P('M75 54 C75 50 93 50 93 54 V80 C93 83 75 83 75 80Z', '#96F2D7') + L('M77 62 L91 76 M77 71 L86 80 M81 54 L91 64', '#38D9A9', 1.3) + L('M79 57 V76', '#fff', 2.4, ' opacity=".75"') +
      P('M77 46 L67 42 V45.5 L77 50Z', '#ADB5BD', 2.2) + stick('M87 43 L94 36', '#ADB5BD', 2.4) + P('M76 54 V46 C76 41 92 41 92 46 V54Z', '#CED4DA') + hl(80, 46, 2, 1.2) +
      die(52, 37, 12, 5, '#fff', D, -14) + die(65, 35, 12, 5, '#fff', D, 12) +
      P('M41 44 L45 80 H67 L71 44Z', '#B5651D') + R(38, 39.5, 36, 7, 3, '#7A3E12') + R(43, 74, 26, 7, 2.5, '#7A3E12') +
      L('M46.5 51 L48.5 70 M65.5 51 L63.5 70', '#F3D9B1', 1.4, ' stroke-dasharray="2 2.6"') + L('M52 51 L53 67', '#fff', 2.4, ' opacity=".35"') +
      `<g transform="translate(4 -3)">` + E(44, 88, 15, 5, '#C97B45') + C(37, 85.5, 3.6, '#C2255C', 1.6) + C(45, 84.5, 3.6, '#C2255C', 1.6) +
      `<g fill="#FFC9C9"><circle cx="36" cy="85" r=".8"/><circle cx="38.4" cy="86.6" r=".7"/><circle cx="44.4" cy="84" r=".8"/><circle cx="46" cy="85.8" r=".7"/></g>` +
      R(49.5, 80.5, 5.5, 5.5, 1, '#FFD43B', 1.6) + C(55, 86, 2.1, '#74B816', 1.4) + `</g>` + sparkle(30, 46, 4) + sparkle(88, 32, 3.5, '#fff')
  },
  'Quintillizos': () => {
    const xs = [32, 46, 60, 74, 88]
    return L('M24 25 Q60 37 96 25', D, 1.4) +
      L('M42 30 V34 M60 32 V36 M78 30 V34', D, 1.2) + star(42, 37, 3.6, '#FFD43B', 1.4) + `<circle class="m-ol" style="stroke-width:1.4" cx="60" cy="39" r="3" fill="#74C0FC"/>` + heart(78, 37, 3, '#FF8FA3', 1.4) +
      [26, 34, 42, 50, 58, 66, 74, 82, 90].map(x => stick(`M${x} 74 V98`, '#E9C46A', 2.4)).join('') +
      xs.map(x => E(x, 64, 7, 6, '#A5D8FF', 2.2) + C(x, 51, 7.6, '#FFDAB0', 2.4) +
        L(`M${x - 1} 43.8 C${x - 3} 40.5 ${x + 1.5} 39.5 ${x + 1.4} 42.2`, D, 1.4) +
        L(`M${x - 4} 50.5 Q${x - 2.7} 49.2 ${x - 1.4} 50.5 M${x + 1.4} 50.5 Q${x + 2.7} 49.2 ${x + 4} 50.5`, D, 1.2) +
        cheek(x - 4.6, 53.4, 1.5) + cheek(x + 4.6, 53.4, 1.5) + `<ellipse cx="${x}" cy="54.6" rx="1.1" ry=".9" fill="${D}"/>` +
        die(x, 64, 9.5, 5, '#fff', D, 0, 2) + C(x - 5.4, 65, 2.2, '#FFDAB0', 1.5) + C(x + 5.4, 65, 2.2, '#FFDAB0', 1.5)).join('') +
      R(18, 70, 84, 6, 3, '#C97B45') + L('M22 71.6 H98', '#fff', 1.2, ' opacity=".4"') + R(18, 92, 84, 6, 3, '#C97B45')
  },
  'Tómbola de kermesse': u => {
    const cx = 58, cy = 62, r = 20
    const oct = Array.from({ length: 8 }, (_, k) => { const a = (22.5 + 45 * k) * Math.PI / 180; return f(cx + r * Math.cos(a)) + ',' + f(cy + r * Math.sin(a)) }).join(' ')
    const cols = ['#E03131', '#FCC419', '#4DABF7', '#40C057', '#F06595', '#FF922B']
    let flags = ''
    for (let i = 0; i < 9; i++) {
      const tt = .06 + i * .11, x = f(22 + 76 * tt), y = f(30 + 20 * tt * (1 - tt))
      flags += `<polygon class="m-ol" style="stroke-width:1.6" points="${f(x - 3.6)},${y} ${f(x + 3.6)},${y} ${x},${f(+y + 7.5)}" fill="${cols[i % 6]}"/>`
    }
    return L('M22 30 Q60 40 98 30', D, 1.4) + flags +
      stick(`M${cx} ${cy} L44 93 M${cx} ${cy} L72 93`, '#8B5A3C', 3.4) + R(34, 91, 48, 6, 3, '#6B3E1F') +
      `<defs><clipPath id="tb${u}"><polygon points="${oct}"/></clipPath></defs><polygon points="${oct}" fill="#FFF3BF"/>` +
      `<g clip-path="url(#tb${u})">` + die(50, 66, 9, 5, '#FF6B6B', '#fff', 15, 2) + die(65, 72, 9, 5, '#4DABF7', '#fff', -20, 2) + die(60, 56, 9, 5, '#fff', D, 30, 2) +
      die(49, 77, 9, 5, '#FFD43B', D, -10, 2) + die(69, 59, 8, 5, '#51CF66', '#fff', 5, 2) + die(56, 46, 8, 5, '#B197FC', '#fff', -25, 2) +
      L('M30 48 H86 M30 55 H86 M30 69 H86 M30 76 H86', '#E8590C', 1.4, ' opacity=".7"') + `</g>` +
      `<polygon points="${oct}" fill="none" stroke="${D}" stroke-width="6.6" stroke-linejoin="round"/><polygon points="${oct}" fill="none" stroke="#FF922B" stroke-width="3" stroke-linejoin="round"/>` +
      stick(`M${cx} ${cy} H88 V73`, '#ADB5BD', 2.6) + R(84.5, 72, 7, 10, 3.5, '#E03131', 2) + C(cx, cy, 4, '#FCC419', 2) +
      L('M30 50 A30 30 0 0 1 40 38', D, 2.2) + L('M35 36 L40 38 L39 43', D, 2.2) + L('M86 78 A30 30 0 0 1 76 88', D, 2.2) +
      die(30, 86, 8, 5, '#fff', D, 20, 2) + sparkle(92, 52, 4) + sparkle(26, 64, 3.5, '#fff')
  },
  'Herradura': () =>
    `<path d="M60 30 L44 37 M60 30 L76 37" stroke="${D}" stroke-width="1.6"/>` + C(60, 29, 2.4, '#868E96', 1.6) +
    stick('M43 40 C41 94 79 94 77 40', '#FCC419', 11) + R(36, 34, 14, 7, 2.5, '#FCC419') + R(70, 34, 14, 7, 2.5, '#FCC419') +
    L('M40 46 C40 60 42 70 46 76', '#fff', 2, ' opacity=".7"') +
    [[43.6, 54], [45.5, 66], [51, 75.5], [76.4, 54], [74.5, 66], [69, 75.5]].map(([x, y]) => `<rect x="${x - 1.4}" y="${y - 1}" width="2.8" height="2" rx=".6" fill="#E67700"/>`).join('') +
    die(53, 66, 11, 6, '#fff', D, -12) + die(67, 64, 11, 6, '#fff', D, 10) + die(60, 53, 11, 6, '#fff', D, 4) +
    die(30, 50, 10, 6, '#fff', D, -24) + die(90, 46, 10, 6, '#fff', D, 22) +
    L('M27 38 L28.5 43 M33 37 L32.5 42 M87 34 L88 39 M93 35 L92 40', D, 1.8) +
    sparkle(30, 76, 4.5) + sparkle(91, 72, 4),
  'Trébol de cuatro': () => {
    const leaf = (a: number) => g(`translate(60 54) rotate(${a})`, heart(0, -13.5, 11.5, '#40C057', 2.6) +
      [[-3.4, -19], [3.4, -19], [-3.4, -14.5], [3.4, -14.5], [-3.4, -10], [3.4, -10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#fff"/>`).join(''))
    return stick('M60 58 C62 72 68 82 76 92', '#2F9E44', 3.6) + [45, 135, 225, 315].map(leaf).join('') + C(60, 54, 3.4, '#2F9E44', 2) +
      hl(46, 38, 2.4, 1.4) + sparkle(30, 50, 4.5) + sparkle(88, 34, 4) + sparkle(36, 80, 3.5, '#fff') + sparkle(86, 74, 3)
  },
  'Mano de Dios': () =>
    `<g opacity=".9">` + [-10, 8, 26, 44, 62].map(a => `<path d="M30 30 L${f(30 + 90 * Math.cos(a * Math.PI / 180) - 8 * Math.sin(a * Math.PI / 180))} ${f(30 + 90 * Math.sin(a * Math.PI / 180) + 8 * Math.cos(a * Math.PI / 180))} L${f(30 + 90 * Math.cos(a * Math.PI / 180) + 8 * Math.sin(a * Math.PI / 180))} ${f(30 + 90 * Math.sin(a * Math.PI / 180) - 8 * Math.cos(a * Math.PI / 180))}Z" fill="#FFF3BF"/>`).join('') + `</g>` +
    g('translate(58 48) rotate(30) scale(1.2)',
      stick('M4 -5 L14 -10', SKIN, 4.4) + stick('M6 -1 L17 -2', SKIN, 4.4) + stick('M6 3 L16 6', SKIN, 4.4) + stick('M3 6 L11 12', SKIN, 4.2) +
      R(-46, -9, 36, 18, 3, '#74C0FC') + `<rect x="-40" y="-7.7" width="6" height="15.4" fill="#fff"/><rect x="-28" y="-7.7" width="6" height="15.4" fill="#fff"/>` + R(-46, -9, 36, 18, 3, 'none') +
      R(-13, -10, 6, 20, 2, '#fff', 2.2) +
      P('M-8 -8 C-1 -10 5 -9 8 -5 C10 -1 9 4 6 8 C1 10 -4 10 -8 8Z', SKIN) + stick('M-3 -8 L1 -14', SKIN, 4.2) + L('M-4 -3 C-1 -4 2 -3 4 -1', '#E6A06B', 1.4)) +
    cloud([[22, 30, 8], [30, 23, 8], [32, 33, 6], [21, 40, 6]]) + L('M24 30 Q28 27 31 29', '#DEE2E6', 1.6) +
    die(70, 68, 11, 5, '#fff', D, -12) + die(84, 58, 10, 5, '#fff', D, 18) + die(84, 80, 10, 5, '#fff', D, -25) + die(66, 86, 10, 5, '#fff', D, 22) + die(50, 78, 10, 5, '#fff', D, 6) +
    L('M74 52 L78 50 M90 46 L92 42 M60 64 L56 62', D, 1.8) + sparkle(84, 34, 4.5) + sparkle(36, 64, 3.5) + sparkle(94, 70, 3, '#fff'),
  'Doble con queso': () =>
    P('M31 78 H89 C89 88 82 91 60 91 C38 91 31 88 31 78Z', '#F4A64A') +
    P('M29 75 H91 L89 77 C87 77 86 82 84 82 C82 82 82 77 79 77 H63 C61 77 60 84 57 84 C54 84 55 77 51 77 H41 C39 77 38 81 36 81 C34 81 34 77 31 77Z', '#FCC419', 2.2) +
    R(30, 64, 60, 12, 6, '#6B3E26') + P('M28 62 H92 L90 64 C88 64 87 70 85 70 C83 70 83 64 80 64 H66 C64 64 63 73 60 73 C57 73 58 64 54 64 H42 C40 64 39 69 37 69 C35 69 35 64 31 64Z', '#FCC419', 2.2) +
    R(30, 51, 60, 12, 6, '#6B3E26') +
    [[50, 54.5], [60, 54.5], [70, 54.5], [50, 59.5], [60, 59.5], [70, 59.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join('') +
    [[45, 67.5], [60, 70], [75, 67.5], [52.5, 70], [67.5, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".9"/>`).join('') +
    stick('M30 50 Q34 54 38 50 T46 50 T54 50 T62 50 T70 50 T78 50 T86 50 T90 50', '#69DB7C', 3) +
    P('M31 47 C31 22 89 22 89 47 C89 49 31 49 31 47Z', '#F4A64A') + L('M38 38 C40 32 46 29 52 28', '#fff', 2.4, ' opacity=".55"') +
    [[46, 34, -20], [56, 30, 10], [66, 33, -10], [74, 38, 25], [60, 39, 0], [50, 41, 15], [80, 43, -15]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1" fill="#FFF8E7" transform="rotate(${a} ${x} ${y})"/>`).join('') +
    sparkle(26, 40, 3.5) + sparkle(94, 60, 3.5, '#fff') + `<g transform="rotate(12 82 37)">` + R(74, 31, 16, 12, 3, '#E03131', 2.2) + t(82, 40.5, 9, 'x2', '#fff') + `</g>`,
  'Doble de riesgo': () => {
    const stunt = (x: number, y: number, s: number, rot: number, helm: string) => g(`translate(${x} ${y}) rotate(${rot})`,
      R(-s / 2, -s / 2, s, s, f(s * .22), '#fff') + `<circle cx="${f(-s * .27)}" cy="${f(s * .27)}" r="${f(s * .08)}" fill="${D}"/><circle cx="${f(s * .27)}" cy="${f(s * .27)}" r="${f(s * .08)}" fill="${D}"/>` +
      L(`M${f(-s * .5)} ${f(-s * .05)} H${f(s * .5)}`, D, 1.8) + C(f(-s * .17), f(-s * .05), f(s * .15), '#A5D8FF', 1.8) + C(f(s * .17), f(-s * .05), f(s * .15), '#A5D8FF', 1.8) +
      `<circle cx="${f(-s * .19)}" cy="${f(-s * .05)}" r="${f(s * .05)}" fill="${D}"/><circle cx="${f(s * .15)}" cy="${f(-s * .05)}" r="${f(s * .05)}" fill="${D}"/>` +
      smile(0, f(s * .22), s * .13, 1.6) +
      P(`M${f(-s * .56)} ${f(-s * .3)} C${f(-s * .56)} ${f(-s * 1.05)} ${f(s * .56)} ${f(-s * 1.05)} ${f(s * .56)} ${f(-s * .3)}Z`, helm, 2.4) +
      L(`M${f(-s * .1)} ${f(-s * .86)} V${f(-s * .32)}`, '#fff', 2.4, ' opacity=".8"'))
    return R(18, 44, 24, 64, 1, '#ADB5BD') + R(16, 40, 28, 6, 2, '#868E96') +
      [[22, 52], [32, 52], [22, 64], [32, 64], [22, 76], [32, 76], [22, 88], [32, 88]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="7" rx="1" fill="#74C0FC"/>`).join('') +
      L('M44 38 C54 26 66 26 70 32', D, 1.8, ' stroke-dasharray="3 3.5"') + L('M44 42 C60 40 74 44 80 54', D, 1.8, ' stroke-dasharray="3 3.5"') +
      R(50, 84, 36, 10, 3, '#E03131') + L('M58 85.5 V92.5 M66 85.5 V92.5 M74 85.5 V92.5', '#fff', 2.4) +
      stunt(64, 50, 20, -15, '#E03131') + stunt(84, 66, 17, 16, '#FCC419') + L('M92 46 L96 42 M88 42 L90 37', D, 2) + sparkle(52, 72, 3.5) + sparkle(76, 30, 3.5, '#fff')
  },
  'Bis en el Colón': () => {
    const bow = (x: number, rot: number, fill: string, pip: string) => stick(`M${x - 4} 72 L${x - 4} 83 M${x + 4} 72 L${x + 4} 83`, fill, 2.4) +
      g(`translate(${x} 64) rotate(${rot})`, R(-9, -9, 18, 18, 4, fill, 2.6) +
        `<circle cx="-5" cy="-5" r="1.5" fill="${pip}"/><circle cx="5" cy="-5" r="1.5" fill="${pip}"/><circle cx="-5" cy="5" r="1.5" fill="${pip}"/><circle cx="5" cy="5" r="1.5" fill="${pip}"/>` +
        L('M-4.5 -0.5 Q-3 -2.2 -1.5 -0.5 M1.5 -0.5 Q3 -2.2 4.5 -0.5', pip, 1.4) + smile(0, 2.4, 2, 1.4)) +
      stick(`M${x + (rot > 0 ? -8 : 8)} 66 Q${x} 74 ${x + (rot > 0 ? 6 : -6)} 70`, fill, 2.2)
    const rose = (x: number, y: number, rot: number) => g(`translate(${x} ${y}) rotate(${rot})`, stick('M0 2 L0 12', '#2F9E44', 1.6) + `<ellipse cx="3" cy="7" rx="2.4" ry="1.2" fill="#40C057" transform="rotate(-30 3 7)"/>` + C(0, -1, 3.6, '#E03131', 1.8) + L('M-1.4 -1.6 Q0 -3 1.4 -1 Q0 1 -1.4 -0.4', '#FFA8A8', 1))
    return `<rect x="14" y="14" width="92" height="92" fill="#5C2B1A"/><ellipse cx="60" cy="86" rx="30" ry="8" fill="#FFE066" opacity=".35"/><path d="M48 24 L36 86 H84 L72 24Z" fill="#FFE066" opacity=".16"/>` +
      P('M14 82 H106 V108 H14Z', '#C97B45') + L('M22 88 H98 M18 95 H102', '#A35E2F', 1.4) + `<ellipse cx="60" cy="86" rx="26" ry="5" fill="#FFE066" opacity=".45"/>` +
      bow(48, -22, '#fff', D) + bow(72, 22, '#fff', D) +
      P('M14 28 H38 C34 46 30 66 36 90 H14Z', '#C92A2A') + L('M22 34 C20 54 22 72 26 88 M30 34 C28 52 28 70 31 88', '#A61E1E', 2) +
      P('M106 28 H82 C86 46 90 66 84 90 H106Z', '#C92A2A') + L('M98 34 C100 54 98 72 94 88 M90 34 C92 52 92 70 89 88', '#A61E1E', 2) +
      P('M14 14 H106 V30 Q96 37 86 30 Q76 37 66 30 Q60 34 54 30 Q44 37 34 30 Q24 37 14 30Z', '#A61E1E') + L('M18 31.5 Q24 36 34 30.5 M54 30.5 Q60 34 66 30.5 M86 30.5 Q96 36 102 31.5', '#FCC419', 1.6) +
      C(60, 24, 4.2, '#FCC419', 2) +
      rose(38, 46, -30) + rose(82, 42, 40) + rose(60, 38, 160) + rose(76, 86, 80) + sparkle(28, 58, 3, '#FFE066') + sparkle(92, 60, 3, '#FFE066')
  },
  'Libreta de almacenero': () =>
    C(110, 60, 30, SKIN) + P('M80 46 C82 30 96 26 110 28 V40 C100 38 90 40 84 50Z', '#6B3E1F') +
    g('translate(86 44) rotate(-28)', R(-20, -3.5, 32, 7, 1.5, '#FCC419', 2.2) + L('M-18 -1 H10', '#FFE066', 1.4) + P('M-20 -3.5 L-27 0 L-20 3.5Z', '#F4D6A0', 2) + `<path d="M-27 0 L-24.5 -1.2 V1.2Z" fill="${D}"/>` + R(12, -3.5, 3, 7, .5, '#ADB5BD', 2) + R(15, -3.5, 5, 7, 1.8, '#FF8FA3', 2)) +
    P('M85 48 C77 46 74 58 78 66 C80 70 86 70 87 64Z', SKIN) + L('M83 53 C80 54 80 60 83 62', '#E6A06B', 1.6) +
    g('rotate(-7 44 62)', R(22, 30, 42, 58, 3, '#FFF9DB') + `<rect x="22" y="30" width="42" height="7" fill="#E8590C" opacity=".85"/>` + R(22, 30, 42, 58, 3, 'none') +
      [27, 33, 39, 45, 51, 57].map(x => `<circle cx="${x}" cy="33.5" r="1.4" fill="#fff" stroke="${D}" stroke-width="1.2"/>`).join('') +
      [46, 53, 60, 67].map(y => `<path d="M26 ${y} H60" stroke="#A5D8FF" stroke-width="1"/>`).join('') +
      t(38, 44.5, 6.5, 'FIADO', '#495057') + L('M28 51 C30 49 32 52 34 50 S38 51 40 50 M52 51 H58 M28 58 C30 56 33 59 36 57 M52 58 H57 M28 65 C31 63 34 66 37 64 M52 65 H58', '#495057', 1.2) +
      `<path d="M27 70 H60" stroke="${D}" stroke-width="1.2"/>` + t(48, 81, 11, '200', '#E03131') + `<ellipse cx="48" cy="77.5" rx="11" ry="6.5" fill="none" stroke="#E03131" stroke-width="1.6" transform="rotate(-6 48 77.5)"/>`) +
    sparkle(76, 84, 3.5) + sparkle(30, 26, 3, '#fff'),
  'Cuaderno Rivadavia': () => {
    const rows = [45, 51, 57, 63, 69, 75]
    return P('M22 36 L60 42 L98 36 V88 L60 94 L22 88Z', '#8C2F39') +
      P('M25 34 Q44 33 60 39 V89 Q44 84 25 85Z', '#fff') + P('M95 34 Q76 33 60 39 V89 Q76 84 95 85Z', '#fff') +
      rows.map(y => `<path d="M28 ${y - 1} Q44 ${y - 2} 58 ${y + 2} M62 ${y + 2} Q76 ${y - 2} 92 ${y - 1}" stroke="#A5D8FF" stroke-width="1" fill="none"/>`).join('') +
      L('M36 37 V86 M47 38 V87 M70 38 V87 M81 37 V86', '#FFA8A8', 1) +
      ['1', '2', '3', '4', '5', '6'].map((n, i) => t(31.5, rows[i] + 1, 4.8, n, '#868E96')).join('') +
      ['3', '8', '12', '16', '15', '24'].map((n, i) => t(41.5, rows[i] + 1.2, 4.8, n, '#1C7ED6')).join('') +
      ['E', 'F', 'P', 'G', '2G', ''].map((n, i) => t(65, rows[i] + 1.6, 4.8, n, '#868E96')).join('') +
      ['20', '30', '40', '50', '100', ''].map((n, i) => t(75.5, rows[i] + 1.6, 4.8, n, '#1C7ED6')).join('') +
      L('M71 79 H91', D, 1.2) + t(81.5, 87, 8, '250', '#E03131') + L('M60 39 V89', '#DEE2E6', 1.4) +
      stick('M54 34 V40', '#E03131', 2) + P('M54 89 V100 L56.5 97 L59 100 V89Z', '#E03131', 1.8) +
      sparkle(88, 26, 4) + sparkle(28, 92, 3, '#fff')
  },
  'Contador con visera': () =>
    stick('M64 70 C66 50 70 30 82 29 C93 28 92 50 89 66 C87 80 92 88 98 94', '#fff', 8) +
    L('M64 70 C66 50 70 30 82 29 C93 28 92 50 89 66 C87 80 92 88 98 94', '#ADB5BD', 3, ' stroke-dasharray="1.5 4"') +
    P('M28 82 C28 66 38 60 50 60 C62 60 72 66 72 82Z', '#fff') + P('M47 60 L50 68 L53 60Z', '#E03131', 1.8) +
    `<rect x="31" y="70" width="5" height="4" fill="#E03131"/><rect x="64" y="70" width="5" height="4" fill="#E03131"/>` +
    C(50, 44, 14, SKIN) + P('M36 46 C34 40 37 36 40 38 C40 42 39 44 38 48Z', '#ADB5BD', 2) + P('M64 46 C66 40 63 36 60 38 C60 42 61 44 62 48Z', '#ADB5BD', 2) +
    cheek(42, 50.5, 2.2) + cheek(58, 50.5, 2.2) +
    `<circle cx="45" cy="45" r="4.4" fill="#E7F5FF" stroke="${D}" stroke-width="1.8"/><circle cx="55" cy="45" r="4.4" fill="#E7F5FF" stroke="${D}" stroke-width="1.8"/><path d="M49.4 45 H50.6" stroke="${D}" stroke-width="1.6"/>` +
    eye(45, 45.5, 1.4) + eye(55, 45.5, 1.4) + P('M45 52 Q50 50 55 52 Q50 54.5 45 52Z', '#868E96', 1.4) +
    `<path d="M34 37 Q50 26 66 37 L69 31 Q50 18 31 31Z" fill="#40C057" opacity=".8"/>` + P('M34 37 Q50 26 66 37 L69 31 Q50 18 31 31Z', 'none') + L('M36 33 Q50 25 64 33', '#fff', 1.4, ' opacity=".5"') +
    P('M26 76 L32 68 H74 L80 76 V92 H26Z', '#868E96') + R(30, 76, 46, 13, 2, '#495057', 2) +
    [34, 40, 46, 52, 58].map(x => `<rect x="${x}" y="78.5" width="4" height="3.4" rx="1" fill="#fff"/><rect x="${x}" y="83.6" width="4" height="3.4" rx="1" fill="#fff"/>`).join('') +
    `<rect x="64" y="78.5" width="9" height="8.5" rx="1.4" fill="#E03131"/>` + R(56, 66, 16, 5, 2, '#ADB5BD', 2) +
    C(40, 70, 3.6, SKIN, 2) + C(60, 72, 3.6, SKIN, 2) +
    `<g transform="rotate(70 90 50)">` + t(90, 52.5, 7, '300', '#E03131') + `</g>` + sparkle(26, 52, 3.5) + sparkle(74, 22, 3, '#fff'),

  // ══ UNO ═══════════════════════════════════════════════════════════
  'Grito en el patio': () =>
    P('M38 36 C38 28 60 26 64 33 C72 32 74 42 68 45 C64 50 44 50 40 45 C34 44 34 38 38 36Z', '#fff', 2.4) + P('M52 47 L50 54 L58 47Z', '#fff', 2.2) + `<path d="M50 46 H59" stroke="#fff" stroke-width="3"/>` +
    t(53.5, 42.5, 10, '¡UNO!', '#E03131') +
    P('M32 104 C32 80 38 72 50 72 C62 72 68 80 68 104Z', '#fff') + L('M50 76 V100', '#DEE2E6', 1.6) +
    stick('M64 80 L78 62', '#fff', 6) + uno(82, 50, 14, .82, '#E03131', '1') + C(78, 61, 4, SKIN, 2) +
    C(50, 60, 14, SKIN) + P('M36 58 C34 46 42 43 50 45 C56 42 66 46 64 57 C62 51 58 50 55 51 C51 47 42 50 36 58Z', '#7A4A2A') +
    L('M42 57 L46 59 L42 61 M58 57 L54 59 L58 61', D, 1.8) + P('M45 64 C45 71 55 71 55 64Z', '#C92A2A', 2) + `<ellipse cx="50" cy="68" rx="2.6" ry="1.4" fill="#FF8FA3"/>` +
    cheek(40, 64, 2.4) + cheek(60, 64, 2.4) +
    P('M43 74 L50 77 L43 80Z', '#1C7ED6', 2) + P('M57 74 L50 77 L57 80Z', '#1C7ED6', 2) + C(50, 77, 1.8, '#1C7ED6', 1.6) +
    stick('M36 80 C30 72 32 64 38 66', '#fff', 6) + C(39, 66, 4, SKIN, 2) +
    L('M30 46 L25 44 M30 52 L24 53 M74 66 L80 70', D, 2) + sparkle(84, 78, 3.5) + sparkle(28, 30, 3, '#fff'),
  'Bombo de cancha': () =>
    stick('M35 43 L72 98 M85 43 L48 98', '#C97B45', 3) + C(34, 41, 6.5, '#fff', 2.4) + C(86, 41, 6.5, '#fff', 2.4) + hl(32, 39, 1.8, 1.1) + hl(84, 39, 1.8, 1.1) +
    `<circle cx="60" cy="63" r="25" fill="#FFF8E7"/><circle cx="60" cy="63" r="25" fill="none" stroke="${D}" stroke-width="10"/><circle cx="60" cy="63" r="25" fill="none" stroke="#fff" stroke-width="5.4"/><circle cx="60" cy="63" r="25" fill="none" stroke="#4DABF7" stroke-width="5.4" stroke-dasharray="6.5 6.6"/>` +
    `<circle cx="60" cy="63" r="20" fill="none" stroke="${D}" stroke-width="1.6"/>` +
    uno(60, 63, -10, 1.15, '#E03131', '1') + L('M44 52 C46 48 50 46 54 45', '#fff', 2.4, ' opacity=".7"') +
    [[28, 40, '#FCC419', 20], [92, 44, '#40C057', -30], [24, 64, '#F06595', 50], [96, 66, '#4DABF7', 10], [34, 86, '#FF922B', -20], [88, 84, '#FCC419', 40], [60, 30, '#4DABF7', 60]]
      .map(([x, y, c, a]) => `<rect x="${+x - 2.4}" y="${+y - 1.4}" width="4.8" height="2.8" rx=".6" fill="${c}" stroke="${D}" stroke-width="1" transform="rotate(${a} ${x} ${y})"/>`).join(''),
  'Megáfono de oro': () =>
    ([[24, 82, 12, 18, '#FFC9C9'], [36, 78, 12, 22, '#D0EBFF'], [48, 84, 10, 16, '#FFE8CC'], [58, 76, 14, 24, '#D3F9D8'], [72, 82, 12, 18, '#FFF3BF'], [84, 78, 12, 22, '#E5DBFF']] as [number, number, number, number, string][])
      .map(([x, y, w, h, c]) => P(`M${x} ${y + h} V${y + 5} L${x + w / 2} ${y - 2} L${x + w} ${y + 5} V${y + h}Z`, c, 2) + `<rect x="${x + w / 2 - 1.6}" y="${y + 7}" width="3.2" height="3.6" fill="#FFE066" stroke="${D}" stroke-width="1"/>`).join('') +
    `<g transform="rotate(-12 82 46)"><rect x="66" y="25" width="32" height="42" rx="6" fill="none" stroke="#FCC419" stroke-width="2.4" opacity=".55"/><rect x="71" y="31" width="22" height="30" rx="4" fill="none" stroke="#FCC419" stroke-width="2.4" opacity=".85"/></g>` +
    uno(82, 46, -12, .72, '#FCC419', '1') +
    g('rotate(-14 42 56)', R(20, 50, 9, 12, 2, '#E67700') + P('M28 50 L58 38 V74 L28 62Z', '#FCC419') + E(58, 56, 5, 18, '#FFE066') + `<ellipse cx="58" cy="56" rx="2.4" ry="13" fill="#E67700" opacity=".5"/>` +
      L('M34 52 L52 45', '#fff', 2.6, ' opacity=".7"') + L('M41 47.5 V64.5', '#E67700', 2) + P('M36 62 L37 74 H43 L42 64Z', '#E67700', 2.2)) +
    L('M64 32 L68 28 M66 76 L70 80', D, 2) + sparkle(30, 36, 4.5) + sparkle(94, 72, 3.5, '#fff'),
  'Codazo': () =>
    `<ellipse cx="40" cy="91" rx="14" ry="3" fill="${D}" opacity=".12"/><ellipse cx="82" cy="91" rx="14" ry="3" fill="${D}" opacity=".12"/>` +
    stick('M93 62 L97 50', '#4DABF7', 4.6) + E(82, 70, 15, 19, '#4DABF7') + hl(76, 58, 3.6, 2.2) +
    `<circle cx="77" cy="64" r="3.2" fill="#fff" stroke="${D}" stroke-width="1.6"/><circle cx="87" cy="64" r="3.2" fill="#fff" stroke="${D}" stroke-width="1.6"/><circle cx="77.6" cy="64" r="1.2" fill="${D}"/><circle cx="87.6" cy="64" r="1.2" fill="${D}"/>` +
    `<ellipse cx="82" cy="73" rx="2.6" ry="3.2" fill="${D}"/>` + drop(94, 50, .9) +
    E(40, 70, 15, 19, '#FF922B') + hl(34, 58, 3.6, 2.2) + L('M32 64 H38 M43 64 H49', D, 2) + L('M33 62 Q35 60.5 37 62 M44 62 Q46 60.5 48 62', D, 1.2) +
    cheek(32, 69, 2.4) + cheek(48, 69, 2.4) + L('M36 72 Q42 75 46 70', D, 1.8) +
    stick('M50 70 L62 64 L58 76', '#FF922B', 4.6) + `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(66, 60, 6, 2.8, 6)}" fill="#FFE066"/>` +
    wild(70, 34, 24, .82) + L('M50 44 L58 40 M52 50 L60 46', D, 1.8) + sparkle(30, 42, 3.5) + sparkle(92, 32, 3, '#fff'),
  'Puñal por la espalda': () =>
    wild(76, 44, 38, .95) + L('M66 34 L62 30 M86 54 L91 56 M88 40 L93 37', D, 2) +
    meeple(52, 64, 1.25, '#FFD43B', -4,
      `<circle cx="-3.6" cy="-14" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="3.6" cy="-14" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="-3.2" cy="-14" r="1" fill="${D}"/><circle cx="4" cy="-14" r="1" fill="${D}"/>` +
      `<ellipse cx="0" cy="-8.6" rx="1.6" ry="2" fill="${D}"/><circle cx="-6.6" cy="-10.4" r="1.6" fill="#FF8FA3" opacity=".7"/><circle cx="6.6" cy="-10.4" r="1.6" fill="#FF8FA3" opacity=".7"/>`) +
    t(34, 42, 13, '!', '#E03131', `stroke="${D}" stroke-width="1" paint-order="stroke"`) + drop(36, 54, 1) + drop(31, 62, .8) + sparkle(84, 82, 3.5) + sparkle(30, 82, 3, '#fff'),
  'Villano de telenovela': () =>
    P('M26 104 L34 70 C38 62 74 62 78 70 L86 104Z', '#343A40') + P('M34 70 L30 44 L46 60Z', '#C92A2A') + P('M78 70 L82 44 L66 60Z', '#C92A2A') +
    P('M48 62 L56 72 L64 62Z', '#fff', 2.2) + P('M52 64 L56 68 L60 64 L56 76Z', '#E03131', 1.8) +
    C(56, 46, 14, '#F1E3CF') + P('M42 46 C40 30 72 30 70 46 C67 40 62 38 56 43 C50 38 45 40 42 46Z', D) +
    L('M46 42.5 L53 45 M66 42.5 L59 45', D, 2.6) + L('M47 47 Q50 45.5 52.5 47.5 M60 47.5 Q62 45.5 65 47', D, 1.8) +
    P('M49 55 Q56 63 63 55Z', '#C92A2A', 2) + L('M49 53.6 Q53 51 56 52.6 Q59 51 63 53.6 M49 53.6 C46.5 53.6 46 51.4 47.4 50.6 M63 53.6 C65.5 53.6 66 51.4 64.6 50.6', D, 1.4) +
    [-34, -14, 6, 26].map(a => g(`rotate(${a} 82 86)`, wild(82, 68, 0, .7))).join('') + C(82, 85, 5, '#fff', 2.2) +
    t(78, 37, 9, 'JA', '#7048E8') + t(88, 47, 7, 'JA', '#7048E8') + sparkle(32, 40, 3.5),
  'Memoria de pez': u => {
    const bowl = 'M47 37 C30 42 28 60 32 72 C36 84 46 90 60 90 C74 90 84 84 88 72 C92 60 90 42 73 37Z'
    return `<defs><clipPath id="pz${u}"><path d="${bowl}"/></clipPath></defs>` + P(bowl, '#F1F8FF') +
      `<g clip-path="url(#pz${u})"><path d="M20 50 Q30 46 40 50 T60 50 T80 50 T100 50 V100 H20Z" fill="#A5D8FF"/>` +
      `<circle cx="44" cy="90" r="5" fill="#B197FC"/><circle cx="54" cy="91" r="4" fill="#FFD43B"/><circle cx="68" cy="90" r="5" fill="#63E6BE"/><circle cx="76" cy="88" r="3" fill="#FF8FA3"/>` +
      uno(42, 80, -62, .55, '#40C057', '1') + stick('M74 86 C72 78 76 74 74 68', '#40C057', 2) + `</g>` +
      P(bowl, 'none') + E(60, 37, 13, 3, '#fff', 2.4) + L('M36 58 C34 66 36 74 40 80', '#fff', 2.6, ' opacity=".8"') +
      P('M48 66 L40 60 L41 72Z', '#FF922B', 2.2) + E(58, 66, 11, 8, '#FF922B', 2.4) + P('M56 59 L60 55 L62 59Z', '#FF922B', 1.8) +
      `<circle cx="63" cy="64" r="3.4" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="63.6" cy="64.4" r="1.2" fill="${D}"/>` + `<circle cx="68.4" cy="68.5" r=".9" fill="${D}"/>` +
      L('M52 62 Q54 66 52 70', '#E8590C', 1.4) +
      `<circle cx="72" cy="58" r="1.6" fill="none" stroke="#1C7ED6" stroke-width="1.2"/><circle cx="75" cy="50" r="2" fill="none" stroke="${D}" stroke-width="1.4"/><circle cx="78" cy="43" r="2.4" fill="none" stroke="${D}" stroke-width="1.4"/>` +
      t(87, 52, 14, '?', '#7048E8', `stroke="${D}" stroke-width="1.2" paint-order="stroke"`) + sparkle(30, 40, 3.5)
  },
  'Paraguas en el bondi': () =>
    `<rect x="14" y="14" width="92" height="92" fill="#FFE8A3"/>` + R(24, 24, 72, 28, 4, '#A5D8FF') +
    `<path d="M26 52 V42 H34 V36 H42 V46 H50 V40 H60 V52Z" fill="#91A7FF"/><path d="M70 52 V38 H78 V44 H88 V34 H94 V52Z" fill="#91A7FF"/>` + L('M30 30 L38 26 M74 28 L80 25', '#fff', 2, ' opacity=".8"') +
    R(24, 24, 72, 28, 4, 'none') + L('M60 24 V52', D, 3) + C(80, 37, 5.5, '#FCC419', 2) + t(80, 39.6, 6.5, '60', D) +
    P('M36 52 C36 47 84 47 84 52 V80 H36Z', '#1C7ED6') + `<path d="M40 56 L46 62 L40 68 M52 56 L58 62 L52 68 M64 56 L70 62 L64 68 M76 56 L82 62 L76 68 M46 56 L52 62 L46 68 M58 56 L64 62 L58 68 M70 56 L76 62 L70 68" stroke="#4DABF7" stroke-width="1.2" fill="none"/>` +
    R(36, 47, 48, 6, 3, '#E9ECEF', 2.2) + stick('M44 47 C44 40 76 40 76 47', '#CED4DA', 2.4) +
    P('M30 78 H90 C92 78 92 86 90 88 H30 C28 86 28 78 30 78Z', '#1864AB') + L('M34 81 H86', '#fff', 1.4, ' opacity=".35"') +
    g('translate(58 66) rotate(22)', P('M0 24 L-2 18 C-8 8 -8 -6 -3.6 -13 H3.6 C8 -6 8 8 2 18Z', '#E03131') + L('M-2.4 14 C-4.4 6 -4.4 -4 -1.6 -10 M2.4 14 C4.4 6 4.4 -4 1.6 -10', '#A61E1E', 1.4) +
      L('M-5 4 C-5 -2 -4 -7 -2.6 -9', '#fff', 1.4, ' opacity=".6"') + R(-5.8, 1, 11.6, 3.6, 1.6, '#C92A2A', 1.8) + C(0, 2.8, 1.2, '#FCC419', 1) +
      stick('M0 -13 V-20', '#ADB5BD', 1.6) + stick('M0 -20 V-23 C0 -30 9 -30 9 -23', '#8B5A3C', 2.6)) +
    L('M75 48 V54', D, 1.2) + uno(75.4, 61, 6, .5, '#40C057', '5') + sparkle(28, 66, 3.5),
  'Anteojos en la frente': () =>
    P('M30 106 C30 86 44 78 60 78 C76 78 90 86 90 106Z', '#7950F2') + L('M48 82 L52 90 M72 82 L68 90', '#9775FA', 2) +
    C(60, 56, 21, SKIN) + P('M39 58 C35 50 37 40 42 40 C42 46 43 50 45 52Z', '#CED4DA', 2.2) + P('M81 58 C85 50 83 40 78 40 C78 46 77 50 75 52Z', '#CED4DA', 2.2) +
    L('M44 44 C44 40 48 38 50 40', '#fff', 2.2, ' opacity=".5"') +
    L('M44 38 L38 44 M76 38 L82 44', '#5F3DC4', 2) + C(52, 39, 6, '#E7F5FF', 2.4) + C(68, 39, 6, '#E7F5FF', 2.4) + L('M58 39 H62', D, 2.4) + hl(50, 37, 1.8, 1) + hl(66, 37, 1.8, 1) +
    L('M46 47 L54 49 M74 47 L66 49', D, 2) + `<ellipse cx="51" cy="55" rx="4.4" ry="4.8" fill="#fff" stroke="${D}" stroke-width="1.8"/><ellipse cx="69" cy="55" rx="4.4" ry="4.8" fill="#fff" stroke="${D}" stroke-width="1.8"/>` +
    `<circle cx="48.6" cy="54" r="1.8" fill="${D}"/><circle cx="66.6" cy="54" r="1.8" fill="${D}"/>` + L('M53 67 Q56 64 59 67 T65 67', D, 2) + cheek(44, 63, 2.6) + cheek(76, 63, 2.6) +
    drop(84, 46, 1) + drop(36, 64, .8) +
    uno(92, 66, 18, .55, '#FCC419', '1') + C(88, 74, 4.6, SKIN, 2) + C(32, 76, 4.6, SKIN, 2) + L('M30 70 L28 66 M34 70 L34 65', D, 1.8) +
    t(32, 46, 12, '?', '#E8590C', `stroke="${D}" stroke-width="1" paint-order="stroke"`) + t(90, 52, 9, '?', '#E8590C', `stroke="${D}" stroke-width="1" paint-order="stroke"`),

  // ══ COUP ══════════════════════════════════════════════════════════
  'Banda presidencial': () =>
    P('M22 106 C22 80 38 68 60 68 C82 68 98 80 98 106Z', '#2C3E66') + P('M50 68 L60 90 L70 68Z', '#fff', 2.2) + P('M57 72 H63 L61 84 H59Z', '#495057', 1.8) +
    P('M48 68 L42 76 L54 88Z', '#22325A', 2) + P('M72 68 L78 76 L66 88Z', '#22325A', 2) +
    ccard(78, 79, 10, .55, '#9775FA', `<path d="M-5 -2 L-6 -8 L-2.5 -5.5 L0 -10 L2.5 -5.5 L6 -8 L5 -2Z" fill="#FCC419" stroke="${D}" stroke-width="1.2"/><circle cx="0" cy="3" r="3.6" fill="${SKIN}" stroke="${D}" stroke-width="1.2"/>`) +
    R(71, 84, 15, 6, 1, '#22325A', 2) +
    g('translate(60 88) rotate(40)', `<rect x="-40" y="-8" width="80" height="16" fill="#74C0FC"/><rect x="-40" y="-2.7" width="80" height="5.4" fill="#fff"/>` + `<path class="m-ol" d="M-40 -8 H40 M-40 8 H40" fill="none"/>`) +
    C(74, 100, 5, '#FCC419', 2) +
    C(60, 46, 14, SKIN) + P('M46 44 C44 32 56 28 64 31 C72 32 76 40 74 46 C70 40 62 38 52 40 C49 41 47 43 46 44Z', '#495057') +
    L('M51 45 Q53 43 55 45 M65 45 Q67 43 69 45', D, 1.8) + smile(60, 51, 4) + cheek(50, 50, 2.6) + cheek(70, 50, 2.6) +
    sparkle(30, 44, 4.5) + sparkle(90, 42, 3.5, '#fff') + star(32, 64, 3.5, '#FFD43B', 1.4),
  'Bastón de mando': () =>
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<path d="M76 38 L${f(76 + 50 * Math.cos(a * Math.PI / 180))} ${f(38 + 50 * Math.sin(a * Math.PI / 180))}" stroke="#FFF3BF" stroke-width="5"/>`).join('') +
    coin(32, 82, 6) + coin(42, 88, 5) + coin(28, 70, 5) +
    g('rotate(36 60 60)', R(56.5, 42, 7, 60, 3.5, '#3B2416') + L('M58.6 46 V96', '#fff', 1.4, ' opacity=".35"') + R(55, 92, 10, 6, 2, '#FCC419', 2.2) +
      R(54, 38, 12, 6, 2, '#FCC419', 2.2) + R(55, 33, 10, 6, 2, '#FFD43B', 2.2) + P('M52 26 C52 16 68 16 68 26 C68 31 64 33 60 33 C56 33 52 31 52 26Z', '#FCC419') +
      C(60, 24, 3, '#E03131', 1.6) + hl(56, 21, 2, 1.2) + P('M58 16 L60 11 L62 16Z', '#FCC419', 1.6)) +
    stick('M75 46 C74 54 70 58 70 64', '#FCC419', 1.6) + stick('M75 46 C78 54 80 58 80 62', '#FCC419', 1.6) +
    P('M67 64 H73 L74 72 H66Z', '#FCC419', 2) + P('M77 62 H83 L84 70 H76Z', '#FCC419', 2) +
    P('M75 46 L66 41 L67 51Z', '#74C0FC', 2) + P('M75 46 L84 41 L83 51Z', '#74C0FC', 2) + C(75, 46, 2.4, '#fff', 1.6) +
    sparkle(30, 44, 4.5) + sparkle(92, 70, 3.5),
  'Balcón de la Rosada': () =>
    `<rect x="14" y="14" width="92" height="92" fill="#F7B2BD"/>` + `<rect x="14" y="20" width="92" height="8" fill="#FBD3DA"/>` + L('M14 28 H106 M14 20 H106', D, 2) +
    `<rect x="26" y="28" width="7" height="72" fill="#FBD3DA"/><rect x="87" y="28" width="7" height="72" fill="#FBD3DA"/>` + L('M26 28 V100 M33 28 V100 M87 28 V100 M94 28 V100', D, 1.6) +
    P('M44 76 V46 C44 34 76 34 76 46 V76Z', '#4A2A2A') + L('M48 46 C48 40 52 38 56 38', '#fff', 1.6, ' opacity=".3"') +
    stick('M54 58 L44 40', '#2C3E66', 3.6) + stick('M66 58 L76 40', '#2C3E66', 3.6) + C(43.5, 38, 3.2, SKIN, 2) + C(76.5, 38, 3.2, SKIN, 2) +
    P('M50 76 V62 C50 56 70 56 70 62 V76Z', '#2C3E66') + `<path d="M52 58 L68 72" stroke="#74C0FC" stroke-width="4"/><path d="M52 58 L68 72" stroke="#fff" stroke-width="1.4"/>` +
    C(60, 49, 7, SKIN) + P('M53 48 C52 42 58 40 62 41 C66 41 68 44 67 48 C64 45 58 44 53 48Z', '#495057', 1.8) + smile(60, 51.5, 2.6, 1.5) + `<circle cx="57.4" cy="48.6" r="1" fill="${D}"/><circle cx="62.6" cy="48.6" r="1" fill="${D}"/>` +
    R(28, 74, 64, 5, 1.5, '#FBD3DA') + [34, 40, 46, 52, 58, 64, 70, 76, 82, 88].map(x => R(x - 1.8, 79, 3.6, 10, 1.6, '#FBD3DA', 1.6)).join('') + R(28, 89, 64, 4, 1.5, '#FBD3DA') +
    [36, 72].map(x => `<rect x="${x}" y="77" width="12" height="15" fill="#74C0FC"/><rect x="${x}" y="82" width="12" height="5" fill="#fff"/><circle cx="${x + 6}" cy="84.5" r="1.5" fill="#FCC419"/>` + R(x, 77, 12, 15, 1, 'none', 2)).join('') +
    [[24, 40, '#74C0FC'], [96, 46, '#fff'], [30, 60, '#FCC419'], [92, 62, '#74C0FC'], [80, 32, '#fff'], [40, 30, '#FCC419']].map(([x, y, c]) => `<rect x="${+x - 2}" y="${+y - 1.2}" width="4" height="2.4" fill="${c}" stroke="${D}" stroke-width=".8" transform="rotate(${+x * 7} ${x} ${y})"/>`).join(''),
  'Ceja levantada': () =>
    C(31, 62, 5, SKIN, 2.4) + C(89, 62, 5, SKIN, 2.4) + C(60, 60, 28, SKIN) + P('M32 56 C28 34 44 26 60 28 C78 26 92 36 88 56 C84 44 76 40 66 42 C56 38 44 42 32 56Z', '#5C3A21') +
    L('M44 32 C50 30 56 30 60 31', '#fff', 2.2, ' opacity=".3"') +
    L('M38 52 L54 54', D, 3.4) + L('M40 60 H52', D, 2.4) + L('M41 58.5 Q46 56 51 58.5', D, 1.6) + `<circle cx="47" cy="60.6" r="1.8" fill="${D}"/>` +
    L('M62 42 Q70 30 82 40', D, 3.4) + `<ellipse cx="72" cy="58" rx="6" ry="6.6" fill="#fff" stroke="${D}" stroke-width="2"/><circle cx="69.6" cy="59" r="2.6" fill="${D}"/><circle cx="68.8" cy="58" r=".9" fill="#fff"/>` +
    L('M60 62 Q62 68 58 69', '#C97B45', 2) + L('M48 77 Q58 75 70 72', D, 2.6) + cheek(42, 70, 3) + cheek(80, 68, 3) +
    sparkle(86, 30, 4) + L('M88 46 L94 44 M86 38 L91 34', D, 1.8),
  'Lupa de detective': u =>
    ccard(60, 62, 8, 1.75, '#F783AC', `<circle cx="0" cy="-2" r="4.6" fill="${SKIN}" stroke="${D}" stroke-width="1"/><path d="M3 -2 L9 -3.4" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/>`) +
    `<defs><clipPath id="lp${u}"><circle cx="52" cy="52" r="19"/></clipPath></defs>` +
    `<g clip-path="url(#lp${u})"><rect x="28" y="28" width="50" height="50" fill="#F783AC"/><circle cx="52" cy="52" r="14" fill="#FCC2D7"/>` +
    C(42, 56, 10, SKIN, 2.6) + P('M32 54 C29 44 38 40 44 42 C49 42 53 46 52 51 C46 47 39 48 32 54Z', '#7A4A2A', 2) +
    P('M49 56 L72 50.6 C75 50.6 75 55 72 55 L49 62Z', SKIN, 2.4) + L('M58 56 L63 55', '#E6A06B', 1.4) +
    `<circle cx="45" cy="54" r="2.8" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="46" cy="54.4" r="1.2" fill="${D}"/>` +
    L('M37 63 Q40 61 43 63', D, 1.6) + drop(35, 46, .9) + cheek(37, 59, 2.2) + `</g>` +
    `<circle cx="52" cy="52" r="19" fill="#E7F5FF" opacity=".15"/>` + L('M39 44 A14 14 0 0 1 48 38', '#fff', 2.6, ' opacity=".9"') +
    stick('M66 66 L84 86', '#8B5A3C', 6) + `<circle cx="52" cy="52" r="19" fill="none" stroke="${D}" stroke-width="9"/><circle cx="52" cy="52" r="19" fill="none" stroke="#FCC419" stroke-width="4.6"/>` +
    sparkle(86, 34, 4.5) + sparkle(30, 82, 3.5, '#fff'),
  'Polígrafo': () =>
    R(30, 30, 56, 26, 2, '#fff') + L('M34 36 H82 M34 42 H82 M34 48 H82', '#FFC9C9', 1) +
    L('M32 44 L36 42 L39 46 L42 40 L45 47 L48 38 L51 50 L54 36 L57 49 L60 39 L63 48 L66 44', '#E03131', 1.8) + L('M32 50 Q36 49 40 51 T48 50 T56 51 T64 49', '#1C7ED6', 1.4) +
    stick('M88 56 L67 44', '#495057', 1.6) + stick('M88 56 L65 50', '#495057', 1.6) + C(66.4, 44, 1.6, '#E03131', 1.2) + C(64.4, 50, 1.6, '#1C7ED6', 1.2) +
    E(30, 43, 4, 14, '#DEE2E6', 2.2) + E(86, 43, 4, 14, '#DEE2E6', 2.2) +
    P('M30 56 C24 62 22 72 26 80 L32 78 C30 72 31 64 35 58Z', '#fff', 2.2) + L('M27 64 L29 68 L27 72 L29 76', '#E03131', 1.2) +
    R(24, 56, 72, 30, 5, '#C97B45') + L('M28 60 H92', '#fff', 1.4, ' opacity=".4"') +
    [42, 62].map(x => C(x, 71, 8, '#FFF8E7', 2.2) + L(`M${x - 5} 71 A5 5 0 0 1 ${x + 5} 71`, '#ADB5BD', 1.2) + L(`M${x} 71 L${x + (x === 42 ? 4 : -3)} 66`, '#E03131', 1.6) + `<circle cx="${x}" cy="71" r="1.2" fill="${D}"/>`).join('') +
    C(80, 68, 3, '#495057', 1.8) + C(88, 68, 3, '#495057', 1.8) + R(76, 76, 14, 5, 1.5, '#212529', 1.6) +
    R(28, 86, 8, 4, 1, '#6B3E1F', 1.8) + R(84, 86, 8, 4, 1, '#6B3E1F', 1.8) +
    stick('M92 30 V22', '#868E96', 2) + C(92, 32, 5, '#FF6B6B', 2.2) + hl(90.5, 30.5, 1.4, 1) + L('M84 26 L80 23 M85 34 L81 35 M99 26 L102 23', '#E03131', 1.8),
  'Nariz de Pinocho': () =>
    C(36, 60, 18, '#E9B872') + P('M20 56 C18 42 30 38 40 42 C48 40 54 46 52 52 C46 48 40 48 34 50 C28 50 24 52 20 56Z', '#5C3A21') +
    P('M50 55 L90 49 C93 49 93 53 90 53 L50 63Z', '#E9B872', 2.4) + L('M60 56 L70 55 M76 52.6 L82 52', '#C99A4E', 1.4) +
    stick('M86 51 C86 44 88 40 92 37', '#8B5A3C', 1.6) + P('M92 37 C94 30 100 30 101 32 C99 36 96 38 92 37Z', '#51CF66', 2) + P('M88 44 C82 42 80 38 81 36 C85 36 88 39 88 44Z', '#51CF66', 2) +
    L('M93 36 L98 32 M87 43 L83 39', '#2F9E44', 1) +
    `<ellipse cx="42" cy="56" rx="3.6" ry="4.2" fill="#fff" stroke="${D}" stroke-width="1.6"/><circle cx="43.4" cy="56.4" r="1.6" fill="${D}"/>` +
    `<circle cx="38" cy="66" r="3.6" fill="#E03131" opacity=".8"/>` + L('M42 71 Q46 69 48 72', D, 1.8) + C(22, 62, 3.6, '#E9B872', 2) +
    drop(28, 46, .9) + L('M72 42 L74 38 M80 42 L82 39', D, 1.6) + sparkle(30, 84, 3.5) + sparkle(80, 76, 3, '#fff'),
  'Cuento del tío': () =>
    P('M20 104 C20 86 26 76 34 76 C42 76 48 86 48 104Z', '#7A5230') + P('M30 76 L34 86 L38 76Z', '#fff', 1.6) +
    C(34, 62, 10, SKIN) + P('M22 58 H46 L42 55 C42 46 26 46 26 55Z', '#495057', 2.4) + L('M27 55 H41', '#E03131', 2) +
    L('M29 62.5 Q31 61 33 62.5', D, 1.6) + `<circle cx="39" cy="62" r="1.4" fill="${D}"/>` + P('M28 67 Q34 64 40 67 Q34 69 28 67Z', D, 1.2) + L('M30 70.4 Q34 72.4 38 70', D, 1.4) +
    stick('M44 84 L50 76', '#7A5230', 4) + C(51, 75, 3.2, SKIN, 1.8) + stick('M51 72 V70', SKIN, 1.4) +
    R(50, 84, 22, 6, 1.5, '#A61E1E') + R(52, 52, 18, 33, 2, '#E03131') + P('M50 54 C50 38 72 38 72 54Z', '#E03131') + C(61, 40, 2.4, '#FCC419', 1.6) +
    R(55, 56, 12, 3, 1.5, D, 1) + L('M55 64 V82', '#fff', 2, ' opacity=".4"') +
    g('rotate(-10 61 72)', R(47, 67, 28, 10, 2, '#FFF3BF', 2.2) + t(61, 74.6, 6.4, 'SE VENDE', '#E03131')) +
    P('M74 104 C74 86 80 78 88 78 C96 78 102 86 102 104Z', '#FF922B') + C(88, 64, 10, SKIN) + P('M76 62 C76 50 100 50 100 62 L104 63 H72Z', '#FFE066', 2.2) +
    `<circle cx="84.6" cy="65" r="1.4" fill="${D}"/><circle cx="91.4" cy="65" r="1.4" fill="${D}"/>` + smile(88, 69, 2.6, 1.5) + cheek(81, 68, 2) + cheek(95, 68, 2) +
    R(82, 82, 12, 9, 2, '#343A40', 2) + C(88, 86.5, 2.8, '#74C0FC', 1.4) + L('M80 76 L84 82 M96 76 L92 82', D, 1.2) +
    g('rotate(-20 76 76)', R(70, 72, 12, 7, 1, '#8CE99A', 1.8) + t(76, 77.6, 5.5, '$', '#2F9E44')) + sparkle(62, 28, 3.5) + sparkle(28, 36, 3, '#fff'),
  'Vendedor de humo': () => {
    const jar = (x: number, y: number) => R(x - 7, y - 10, 14, 19, 4, '#F1F8FF') + L(`M${x - 4} ${y - 4} C${x - 1} ${y - 7} ${x + 3} ${y - 3} ${x} ${y} C${x - 3} ${y + 3} ${x + 1} ${y + 6} ${x + 4} ${y + 3}`, '#ADB5BD', 2.4) +
      R(x - 8, y - 13, 16, 4, 1.6, '#FCC419', 2) + R(x - 6, y - 1, 12, 6, 1, '#fff', 1.4) + t(x, y + 3.6, 4.4, 'HUMO', '#E03131') + L(`M${x - 4.6} ${y - 7} V${y - 3}`, '#fff', 1.6, ' opacity=".8"')
    return P('M26 64 L30 32 H90 L94 64Z', '#8B5A3C') + P('M31 62 L34 36 H86 L89 62Z', '#C92A2A', 2) + L('M40 40 H80', '#fff', 1.4, ' opacity=".3"') +
      jar(42, 60) + jar(78, 60) +
      R(53, 46, 14, 19, 4, '#F1F8FF') + L('M56 52 C59 49 63 53 60 56 C57 59 61 62 64 59', '#ADB5BD', 2.4) + R(55, 49, 12, 6, 1, '#fff', 1.4) + t(61, 53.6, 4.4, 'HUMO', '#E03131') +
      g('rotate(-30 54 44)', R(46, 40, 16, 4, 1.6, '#FCC419', 2)) +
      L('M60 42 C54 36 64 32 58 26 M64 42 C70 36 62 30 70 24', '#ADB5BD', 3) + cloud([[60, 26, 4], [66, 22, 3.4], [54, 22, 3]], '#E9ECEF') +
      P('M22 64 H98 L94 92 H26Z', '#A5612E') + L('M30 70 H90', '#fff', 1.6, ' opacity=".35"') + R(40, 66, 6, 7, 1.5, '#FCC419', 1.8) + R(74, 66, 6, 7, 1.5, '#FCC419', 1.8) +
      stick('M52 92 C52 98 68 98 68 92', '#6B3E1F', 2.6) +
      g('rotate(14 30 80)', R(26, 74, 10, 12, 2, '#FFF3BF', 1.8) + t(31, 83, 7, '$', '#2F9E44')) + sparkle(30, 44, 3.5) + sparkle(90, 40, 3, '#fff')
  },

  // ══ PISTAS CRUZADAS ═══════════════════════════════════════════════
  'Dos cabezas': () => {
    const head = (x: number, hair: string, flip: number) =>
      P(`M${x - 18} 106 C${x - 18} 92 ${x - 10} 86 ${x} 86 C${x + 10} 86 ${x + 18} 92 ${x + 18} 106Z`, flip > 0 ? '#4DABF7' : '#F06595') +
      C(x, 70, 14, SKIN) + P(`M${x - 14} 68 C${x - 16} 54 ${x + 14} 52 ${x + 14} 66 C${x + 8} 60 ${x} 62 ${x - 4} 58 C${x - 6} 62 ${x - 10} 64 ${x - 14} 68Z`, hair) +
      eye(x + 3 * flip - 3, 68, 1.8) + eye(x + 3 * flip + 3, 68, 1.8) + smile(x + 2 * flip, 75, 3) + cheek(x - 8, 73, 2.4) + cheek(x + 8, 73, 2.4)
    return `<circle cx="60" cy="42" r="20" fill="#FFF3BF"/>` + [[-90, 18], [-45, 18], [-135, 18], [0, 16], [180, 16]].map(([a]) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return L(`M${f(60 + 19 * c)} ${f(40 + 19 * s)} L${f(60 + 25 * c)} ${f(40 + 25 * s)}`, '#FAB005', 2.6) }).join('') +
      P('M52 44 C47 38 49 26 60 26 C71 26 73 38 68 44 C66 47 65 49 65 52 H55 C55 49 54 47 52 44Z', '#FFD43B') + L('M56 46 L58 38 L60 42 L62 38 L64 46', '#E67700', 1.4) + hl(55, 32, 2.6, 1.6) +
      R(55, 51, 10, 7, 2.4, '#ADB5BD', 2.2) + L('M55.5 54.5 H64.5', D, 1.2) +
      head(36, '#7A4A2A', 1) + head(84, '#FAB005', -1) +
      L('M44 56 Q47 52 51 52 M76 56 Q73 52 69 52', D, 1.8, ' stroke-dasharray="2 3"') + sparkle(30, 40, 3.5) + sparkle(90, 40, 3.5, '#fff')
  },
  'Wi-Fi mental': () => {
    const head = (x: number, hair: string, body: string) => P(`M${x - 16} 106 C${x - 16} 92 ${x - 9} 86 ${x} 86 C${x + 9} 86 ${x + 16} 92 ${x + 16} 106Z`, body) +
      C(x, 72, 13, SKIN) + P(`M${x - 13} 70 C${x - 14} 58 ${x + 13} 56 ${x + 13} 68 C${x + 6} 62 ${x - 4} 62 ${x - 13} 70Z`, hair) + cheek(x - 7, 76, 2.2) + cheek(x + 7, 76, 2.2)
    return head(34, '#343A40', '#40C057') + head(86, '#E8590C', '#7950F2') +
      eye(31, 72, 1.6) + eye(38, 72, 1.6) + smile(35, 78, 2.6) +
      L('M81 70 L84 73 L81 76 M90 70 L87 73 L90 76', D, 1.6) + P('M82 78 Q86 84 90 78Z', '#C92A2A', 1.6) +
      g('translate(36 54) rotate(45)', `<circle cx="0" cy="0" r="2.6" fill="#1C7ED6" stroke="${D}" stroke-width="1.6"/>` +
        [7, 12, 17].map(r => `<path d="M${f(-r * .7)} ${f(-r * .7)} A${r} ${r} 0 0 1 ${f(r * .7)} ${f(-r * .7)}" fill="none" stroke="${D}" stroke-width="5.6" stroke-linecap="round"/><path d="M${f(-r * .7)} ${f(-r * .7)} A${r} ${r} 0 0 1 ${f(r * .7)} ${f(-r * .7)}" fill="none" stroke="#4DABF7" stroke-width="2.6" stroke-linecap="round"/>`).join('')) +
      [0, 1, 2, 3].map(i => R(77 + i * 5, 50 - i * 4, 3.6, 6 + i * 4, 1, '#40C057', 1.8)).join('') +
      L('M50 40 Q60 34 70 40', D, 1.8, ' stroke-dasharray="2 3.4"') +
      P('M55 78 V74 C55 68 65 68 65 74', 'none', 2.4) + R(53, 76, 14, 11, 2.4, '#FCC419', 2.2) + `<circle cx="60" cy="81" r="1.6" fill="${D}"/>` +
      sparkle(60, 28, 3.5) + sparkle(96, 64, 3, '#fff')
  },
  'Colmena': () => {
    const bee = (x: number, y: number, rot: number, letter: string) => (letter ? L(`M${x} ${y + 4} V${y + 9}`, D, 1.2) + R(x - 4.5, y + 9, 9, 9, 1.6, '#FFF3BF', 1.8) + t(x, y + 16.4, 7.5, letter, D) : '') +
      g(`translate(${x} ${y}) rotate(${rot})`, E(-2, -5, 3.6, 2.6, '#E7F5FF', 1.4, -30) + E(2.5, -5, 3.6, 2.6, '#E7F5FF', 1.4, 30) + E(0, 0, 6, 4.4, '#FCC419', 2) +
        `<path d="M-2 -4 V4 M1.6 -4.2 V4.2" stroke="${D}" stroke-width="1.8"/><circle cx="4" cy="-1" r=".9" fill="${D}"/>`)
    const cell = (c: number, r: number, fill: string, l = '') => R(64 + c * 9, 58 + r * 9, 9, 9, 0, fill, 1.6) + (l ? t(68.5 + c * 9, 65.4 + r * 9, 6.5, l, D) : '')
    return P('M20 92 C18 66 26 44 38 42 C50 44 58 66 56 92Z', '#FCC419') +
      L('M22 80 Q38 84 55 80 M21 70 Q38 74 55 70 M24 60 Q38 64 52 60 M29 51 Q38 54 47 51', '#E67700', 2) + L('M28 56 C28 50 32 46 36 45', '#fff', 2, ' opacity=".5"') +
      E(38, 78, 5, 5.6, D, 2) + R(18, 90, 40, 6, 2, '#8B5A3C') +
      cell(0, 0, '#fff', 'S') + cell(1, 0, '#fff', 'O') + cell(2, 0, '#fff', 'L') + cell(0, 1, '#fff', 'A') + cell(1, 1, '#343A40') + cell(2, 1, '#fff') +
      cell(0, 2, '#fff', 'L') + cell(1, 2, '#fff') + cell(2, 2, '#fff', 'A') +
      L('M44 46 C52 34 62 30 72 36', D, 1.4, ' stroke-dasharray="1.5 3"') +
      bee(52, 32, -10, 'T') + bee(80, 34, 10, 'E') + bee(26, 64, -10, '') + sparkle(90, 56, 3) + sparkle(62, 88, 3.5)
  },
  'Batalla naval': u => {
    let grid = ''
    for (let i = 0; i < 9; i++) grid += `M${18 + i * 11} 14 V106 M14 ${21 + i * 11} H106 `
    return `<rect x="14" y="14" width="92" height="92" fill="#4DABF7"/><path d="${grid}" stroke="#A5D8FF" stroke-width="1.2"/>` +
      [[34.5, 37.5], [78.5, 48.5], [34.5, 81.5], [89.5, 70.5], [45.5, 48.5]].map(([x, y]) => C(x, y, 2.8, '#fff', 1.6)).join('') +
      g('rotate(-16 58 72)', P('M34 70 H84 L78 82 H40Z', '#868E96') + R(46, 62, 20, 8, 1.5, '#ADB5BD') + R(54, 54, 8, 9, 1.5, '#CED4DA') + R(66, 64, 8, 6, 1, '#ADB5BD', 2) +
        stick('M58 54 V48', '#495057', 2) + L('M40 74 H80', '#fff', 1.4, ' opacity=".5"') + `<circle cx="48" cy="66" r="1.2" fill="#fff"/><circle cx="54" cy="66" r="1.2" fill="#fff"/>`) +
      `<defs><clipPath id="bn${u}"><rect x="14" y="78" width="92" height="30"/></clipPath></defs>` +
      `<path clip-path="url(#bn${u})" d="M14 80 Q20 76 26 80 T38 80 T50 80 T62 80 T74 80 T86 80 T98 80 T110 80 V106 H14Z" fill="#339AF0" stroke="${D}" stroke-width="2.6"/>` +
      L('M30 86 Q34 84 38 86 M66 90 Q70 88 74 90', '#fff', 1.6) + L('M58 44 C56 40 60 38 58 34', '#ADB5BD', 2.4) +
      `<polygon class="m-ol" style="stroke-width:2" points="${starPts(66, 58, 12, 6.5, 8)}" fill="#FF922B"/>` + C(66, 58, 5.4, '#E03131', 2.2) + hl(64, 56, 1.6, 1) +
      g('rotate(-5 60 32)', R(38, 25, 44, 12, 3, '#fff', 2.4) + t(60, 34.4, 9, '¡TOCADO!', '#E03131'))
  },
  'Crucigrama de Clarín': () => {
    const W = ['MATE#', 'A#ALA', 'SOL#S', 'A#OSO', '#ROTO']
    let cells = ''
    W.forEach((row, r) => [...row].forEach((ch, c) => {
      const x = 38 + c * 7.4, y = 50 + r * 7.4
      cells += ch === '#' ? `<rect x="${x}" y="${y}" width="7.4" height="7.4" fill="#343A40"/>` : t(f(x + 3.7), f(y + 5.8), 5.6, ch, '#1C7ED6')
    }))
    return g('rotate(-7 54 62)', R(24, 28, 58, 66, 1.5, '#F8F9FA') + `<rect x="28" y="32" width="50" height="8" fill="#495057"/>` + L('M28 44 H78', D, 1.2) +
      L('M28 50 H34 M28 54 H34 M28 58 H34 M28 62 H34 M28 66 H34 M28 70 H34 M28 74 H34 M28 78 H34 M28 82 H34 M28 86 H34', '#ADB5BD', 1.6) +
      `<rect x="38" y="50" width="37" height="37" fill="#fff" stroke="${D}" stroke-width="1.6"/>` + cells +
      `<path d="M45.4 50 V87 M52.8 50 V87 M60.2 50 V87 M67.6 50 V87 M38 57.4 H75 M38 64.8 H75 M38 72.2 H75 M38 79.6 H75" stroke="${D}" stroke-width=".7"/>`) +
    R(81, 38, 11, 38, 2, '#E7F5FF') + L('M86.5 42 V74', '#4DABF7', 1.6) + P('M81 76 L86.5 86 L92 76Z', '#CED4DA', 2.2) + `<circle cx="86.5" cy="86" r="1.2" fill="#1C7ED6"/>` +
      R(80, 28, 13, 13, 2.5, '#1C7ED6') + stick('M92 32 V46', '#1C7ED6', 1.6) + L('M83 44 V70', '#fff', 1.4, ' opacity=".8"') +
      eye(84.5, 52, 1.4) + eye(89.5, 52, 1.4) + smile(87, 57, 2.2, 1.4) + cheek(83, 56, 1.4) + cheek(91, 56, 1.4) +
      stick('M81 60 L76 64 L80 67', '#E7F5FF', 1.8) + sparkle(30, 30, 3.5) + sparkle(94, 92, 3, '#fff') + star(98, 22, 4, '#FFD43B', 1.4)
  },
  'Pleno al 25': () => {
    let cards = ''
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const x = 38.6 + c * 8.8, y = 38.6 + r * 8.8
      cards += `<rect x="${f(x)}" y="${f(y)}" width="7.4" height="7.4" rx="1.4" fill="${(r + c) % 2 ? '#fff' : '#FFF3BF'}" stroke="${D}" stroke-width="1.1"/><path d="M${f(x + 2)} ${f(y + 3.8)} l1.4 1.4 l2.4 -2.8" stroke="#40C057" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
    }
    return [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return L(`M${f(60 + 34 * c)} ${f(60 + 34 * s)} L${f(60 + 44 * c)} ${f(60 + 44 * s)}`, '#FFD43B', 3) }).join('') +
      R(32, 32, 56, 56, 3, '#FCC419') + R(36, 36, 48, 48, 1, '#FFE066', 2) + cards + L('M35 35 H60', '#fff', 1.6, ' opacity=".7"') +
      `<ellipse cx="62" cy="69" rx="14" ry="5" fill="${D}" opacity=".25"/>` + C(60, 62, 14, '#E03131') +
      `<circle cx="60" cy="62" r="11.6" fill="none" stroke="#fff" stroke-width="3.6" stroke-dasharray="4 3.3"/>` + C(60, 62, 8, '#fff', 1.8) + t(60, 65.6, 10, '25', '#E03131') +
      sparkle(28, 30, 4) + sparkle(92, 92, 3.5) + sparkle(94, 30, 3, '#fff')
  },
  'Cucharita doblada': () =>
    `<ellipse cx="60" cy="34" rx="24" ry="11" fill="#E5DBFF"/>` +
    E(51, 34, 6, 4.4, '#fff', 2) + E(69, 34, 6, 4.4, '#fff', 2) + `<circle cx="52" cy="35.6" r="2.2" fill="#7048E8"/><circle cx="68" cy="35.6" r="2.2" fill="#7048E8"/><circle cx="52" cy="35.6" r="1" fill="${D}"/><circle cx="68" cy="35.6" r="1" fill="${D}"/>` +
    L('M44 27 L56 30 M76 27 L64 30', D, 2.4) +
    L('M52 41 L58 62 M68 41 L62 62', '#9775FA', 1.8, ' stroke-dasharray="2 3"') +
    stick('M42 92 L58 66', '#CED4DA', 4) + stick('M58 66 L70 62', '#CED4DA', 3.4) + E(78, 59, 8, 5, '#DEE2E6', 2.4, -18) + hl(76, 57.4, 3, 1.4, -18) +
    L('M46 84 L54 71', '#fff', 1.4, ' opacity=".8"') + `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(58, 66, 6, 2.4, 6)}" fill="#FFE066"/>` +
    sparkle(34, 56, 4.5, '#B197FC') + sparkle(86, 44, 4, '#FFD43B') + sparkle(84, 80, 3.5, '#B197FC') + sparkle(30, 76, 3, '#FFD43B') + sparkle(70, 86, 2.6, '#fff'),
  'Turbante de adivino': () =>
    `<ellipse cx="60" cy="56" rx="26" ry="10" fill="#E5DBFF" opacity=".8"/>` +
    g('rotate(-4 60 80)', R(36, 70, 48, 20, 3, '#FFF3D6') + `<rect x="39" y="73" width="42" height="14" rx="2" fill="none" stroke="#E9C46A" stroke-width="1.4"/>` + t(60, 84, 10, 'LUNA', D)) +
    `<ellipse cx="60" cy="64" rx="18" ry="3" fill="${D}" opacity=".12"/>` +
    g('translate(6 9) scale(.9)',
    P('M32 46 C28 26 46 20 60 22 C74 20 92 26 88 46 C80 54 40 54 32 46Z', '#7048E8') +
    L('M34 40 C46 30 64 30 86 38 M36 46 C50 36 70 36 86 44 M40 30 C52 26 68 26 80 30', '#9775FA', 2.4) +
    stick('M62 32 C64 24 70 20 74 18', '#FFF3BF', 3) +
    C(60, 38, 7, '#FCC419', 2.4) + `<polygon class="m-ol" style="stroke-width:1.8" points="60,33 64.4,38 60,43 55.6,38" fill="#E03131"/>` + hl(58.6, 36.4, 1.2, .8)) +
    L('M48 58 L48 62 M60 58 V64 M72 58 L72 62', '#B197FC', 1.8, ' stroke-dasharray="1 2.6"') +
    sparkle(26, 56, 4, '#B197FC') + sparkle(94, 58, 4, '#FFD43B') + sparkle(30, 30, 3, '#FFD43B') + sparkle(88, 22, 3, '#B197FC'),
  'Señal de Tusam': () => {
    let sp = ''
    for (let i = 0; i <= 160; i++) { const a = i * .15, r = 2 + a * 2.1; sp += (i ? 'L' : 'M') + f(60 + r * Math.cos(a)) + ' ' + f(52 + r * Math.sin(a)) + ' ' }
    const hand = (x: number, s: number) => g(`translate(${x} 80) scale(${s} 1)`, [[-6, -8], [-2, -11], [2, -11], [6, -8]].map(([a, b]) => stick(`M${a * .7} -2 L${a} ${b}`, SKIN, 2.6)).join('') + E(0, 0, 7, 6, SKIN, 2.4) +
      L('M-10 -14 q2 -2 0 -4 M10 -14 q-2 -2 0 -4 M0 -18 q2 -2 0 -4', '#7048E8', 1.4))
    return `<rect x="14" y="14" width="92" height="92" fill="#F3F0FF"/><path d="${sp}" fill="none" stroke="#B197FC" stroke-width="4.4"/>` +
      P('M28 106 C28 86 42 78 60 78 C78 78 92 86 92 106Z', '#212529') + P('M52 78 L60 92 L68 78Z', '#fff', 2) + P('M54 82 L60 85 L54 88Z M66 82 L60 85 L66 88Z', '#E03131', 1.6) +
      C(60, 58, 17, SKIN) + P('M43 56 C40 40 54 36 62 38 C72 38 80 46 77 56 C74 48 66 44 58 46 C52 46 46 50 43 56Z', D) +
      L('M47 50 L56 53 M73 50 L64 53', D, 2.6) +
      `<circle cx="52" cy="58" r="5" fill="#fff" stroke="${D}" stroke-width="1.8"/><circle cx="68" cy="58" r="5" fill="#fff" stroke="${D}" stroke-width="1.8"/>` +
      L('M52 58 m-2.6 0 a2.6 2.6 0 1 1 2.6 2.6 a1.4 1.4 0 0 1 -1.4 -1.4 M68 58 m-2.6 0 a2.6 2.6 0 1 1 2.6 2.6 a1.4 1.4 0 0 1 -1.4 -1.4', '#7048E8', 1.2) +
      P('M50 66 C54 63 58 64 60 66 C62 64 66 63 70 66 C68 70 63 69 60 67.6 C57 69 52 70 50 66Z', D, 1.4) + L('M56 71 Q60 73 64 71', D, 1.6) +
      hand(30, 1) + hand(90, -1)
  },

  // ══ 7 WONDERS ═════════════════════════════════════════════════════
  'Tubo de ensayo': u =>
    R(34, 78, 52, 8, 3, '#C97B45') + stick('M38 86 V96 M82 86 V96', '#A35E2F', 3) +
    `<g transform="translate(0 6)">` + `<defs><clipPath id="te${u}"><path d="M51 42 V80 C51 89 69 89 69 80 V42Z"/></clipPath></defs>` +
    `<path d="M51 42 V80 C51 89 69 89 69 80 V42Z" fill="#F1F8FF"/>` +
    `<g clip-path="url(#te${u})"><path d="M48 60 Q54 57 60 60 T72 60 V92 H48Z" fill="#69DB7C"/><circle cx="56" cy="76" r="2" fill="#D3F9D8"/><circle cx="63" cy="70" r="1.6" fill="#D3F9D8"/><circle cx="58" cy="65" r="1.2" fill="#D3F9D8"/></g>` +
    P('M51 42 V80 C51 89 69 89 69 80 V42Z', 'none') + L('M55 46 V78', '#fff', 2.2, ' opacity=".8"') + R(48, 38, 24, 5, 2.5, '#fff') +
    `<polygon class="m-ol" style="stroke-width:2" points="${starPts(60, 28, 17, 9, 9)}" fill="#FF922B"/><polygon points="${starPts(60, 28, 10, 5.4, 9)}" fill="#FFE066"/>` +
    cloud([[52, 30, 6], [60, 26, 7], [68, 31, 6], [60, 34, 5]], '#E9ECEF') + `<circle cx="57" cy="27" r="1.2" fill="${D}"/><circle cx="63" cy="27" r="1.2" fill="${D}"/>` + L('M58 31 Q60 30 62 31', D, 1.2) + `</g>` +
    C(44, 52, 2.4, '#8CE99A', 1.6) + C(78, 48, 3, '#8CE99A', 1.6) + C(80, 62, 1.8, '#8CE99A', 1.4) +
    gear(86, 76, 7, '#ADB5BD', 2) + sparkle(32, 62, 3.5) + sparkle(30, 40, 3, '#fff'),
  'Científico loco': () =>
    P('M28 106 C28 82 42 72 60 72 C78 72 92 82 92 106Z', '#fff') + P('M52 72 L60 86 L68 72Z', '#74C0FC', 2) + L('M44 80 L48 100 M76 80 L72 100', '#DEE2E6', 2) +
    `<polygon class="m-ol" points="${starPts(60, 48, 25, 14, 11, -100)}" fill="#F8F9FA"/>` +
    C(60, 52, 14, SKIN) + L('M47 44 Q60 36 73 44', D, 2.4) + C(54, 43, 4.2, '#74C0FC', 2) + C(66, 43, 4.2, '#74C0FC', 2) + hl(53, 42, 1.2, .8) + hl(65, 42, 1.2, .8) +
    `<circle cx="54" cy="52" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.6"/><circle cx="54.6" cy="52" r="1.4" fill="${D}"/><circle cx="66" cy="52" r="2.2" fill="#fff" stroke="${D}" stroke-width="1.6"/><circle cx="66" cy="52" r=".9" fill="${D}"/>` +
    P('M51 58 Q60 54 69 58 Q66 62 60 59 Q54 62 51 58Z', '#F8F9FA', 1.6) + P('M53 61 Q60 68 67 61Z', '#fff', 1.6) + cheek(48, 58, 2.4) + cheek(72, 58, 2.4) +
    stick('M38 84 L32 72', '#fff', 5) + gear(30, 64, 9, '#FCC419') +
    stick('M82 84 L88 74', '#fff', 5) + g('translate(90 60) rotate(10)', stick('M0 -8 L-5 10 M0 -8 L5 10', '#ADB5BD', 2) + C(0, -9, 2.6, '#FCC419', 1.8)) + C(32, 73, 3.6, SKIN, 1.8) + C(88, 75, 3.6, SKIN, 1.8) +
    g('rotate(-14 30 40)', R(23, 31, 14, 17, 2, '#D9A066', 2.2) + L('M26 35 h3 M31 35 h3 M26 39 h5 M26 43 h2 M30 43 h4', '#8B5A3C', 1.4)) +
    sparkle(92, 36, 4) + sparkle(84, 92, 3, '#fff'),
  'Premio Nobel': () =>
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return L(`M${f(60 + 28 * c)} ${f(66 + 28 * s)} L${f(60 + 34 * c)} ${f(66 + 34 * s)}`, '#FFD43B', 2.6) }).join('') +
    P('M40 14 L54 48 H64 L50 14Z', '#74C0FC') + `<path d="M44.6 14 L56.6 46 H59.4 L47.4 14Z" fill="#fff"/>` + P('M80 14 L66 48 H56 L70 14Z', '#74C0FC') + `<path d="M75.4 14 L63.4 46 H60.6 L72.6 14Z" fill="#fff"/>` +
    P('M40 14 L54 48 H64 L50 14Z M80 14 L66 48 H56 L70 14Z', 'none') +
    R(52, 44, 16, 6, 2, '#FCC419', 2.2) +
    C(60, 66, 21, '#FCC419') + `<circle cx="60" cy="66" r="16.5" fill="#FFD43B" stroke="#E67700" stroke-width="1.6"/>` +
    [150, 130, 110, 30, 50, 70].map(a => { const x = f(60 + 13.6 * Math.cos(a * Math.PI / 180)), y = f(66 + 13.6 * Math.sin(a * Math.PI / 180)); return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#E67700" transform="rotate(${a + 90} ${x} ${y})"/>` }).join('') +
    `<path d="M56.5 55 V61 L51 72 C50 74 51 75.5 53 75.5 H67 C69 75.5 70 74 69 72 L63.5 61 V55Z M55 55 H65" fill="#FFF3BF" stroke="#E67700" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M53.6 68 H66.4 L68.6 72.6 C69 74 68.4 74.6 67 74.6 H53 C51.6 74.6 51 74 51.4 72.6Z" fill="#69DB7C"/><circle cx="59" cy="71" r="1.1" fill="#fff"/><circle cx="62" cy="65" r=".9" fill="#E67700"/>` +
    hl(48, 56, 3.4, 2) + star(28, 50, 4.4, '#FFD43B', 1.6) + star(92, 50, 4.4, '#FFD43B', 1.6) + star(30, 84, 3.6, '#FFD43B', 1.4) + sparkle(90, 84, 3.4, '#fff'),
  'Escudo de madera': u =>
    `<defs><clipPath id="es${u}"><circle cx="56" cy="58" r="26"/></clipPath></defs>` + C(56, 58, 26, '#C97B45') +
    `<g clip-path="url(#es${u})"><rect x="30" y="32" width="9" height="52" fill="#B4703F"/><rect x="48" y="32" width="9" height="52" fill="#B4703F"/><rect x="66" y="32" width="9" height="52" fill="#B4703F"/>` +
    L('M39 32 V84 M48 32 V84 M57 32 V84 M66 32 V84 M75 32 V84', '#8B5A3C', 1.2) + `</g>` +
    `<circle cx="56" cy="58" r="26" fill="none" stroke="${D}" stroke-width="8"/><circle cx="56" cy="58" r="26" fill="none" stroke="#ADB5BD" stroke-width="4"/>` +
    [0, 60, 120, 180, 240, 300].map(a => `<circle cx="${f(56 + 26 * Math.cos(a * Math.PI / 180))}" cy="${f(58 + 26 * Math.sin(a * Math.PI / 180))}" r="1.3" fill="${D}"/>`).join('') +
    C(56, 58, 8, '#CED4DA') + hl(53.5, 55.5, 2.4, 1.4) +
    L('M40 46 q3 2 6 0 M66 74 q3 2 6 0 M42 70 q2 2 4 0', '#6B3E1F', 1.8) +
    g('rotate(-35 76 44)', stick('M68 44 H92', '#C97B45', 2) + P('M92 41 L98 44 L92 47Z', '#ADB5BD', 1.6) + P('M68 44 L64 40 H70 L72 44 L70 48 H64Z', '#E03131', 1.6)) +
    C(82, 80, 10, '#E03131') + `<circle cx="82" cy="80" r="7" fill="none" stroke="#fff" stroke-width="1.2" opacity=".6"/>` + t(82, 84, 10, '+1', '#fff') + sparkle(28, 36, 3.5) + sparkle(92, 58, 3, '#fff'),
  'Centurión': () =>
    P('M42 56 L32 92 H88 L78 56Z', '#C92A2A') +
    R(36, 58, 12, 26, 3, '#E03131') + `<rect x="40.6" y="62" width="2.8" height="18" fill="#FCC419"/><rect x="37.6" y="69.6" width="8.8" height="2.8" fill="#FCC419"/>` + R(36, 58, 12, 26, 3, 'none') +
    stick('M54 82 V93 M66 82 V93', SKIN, 3.6) + L('M51.6 86 L56.4 89 M56.4 86 L51.6 89 M63.6 86 L68.4 89 M68.4 86 L63.6 89', '#8B5A3C', 1.2) +
    E(53, 95, 4.2, 2.2, '#8B5A3C', 2) + E(67, 95, 4.2, 2.2, '#8B5A3C', 2) +
    [48, 53, 58, 63, 68].map(x => R(x - .5, 72, 5, 10, 1.4, '#8B5A3C', 1.6)).join('') +
    P('M47 54 H73 L71 74 H49Z', '#CED4DA') + L('M50 60 H70 M50 65 H70 M50 70 H70', '#868E96', 1.4) + L('M52 57 V69', '#fff', 1.6, ' opacity=".6"') +
    stick('M84 38 V96', '#8B5A3C', 2.4) + P('M84 30 L88 39 H80Z', '#CED4DA', 2) + stick('M74 58 L83 62', SKIN, 3.4) +
    P('M48 28 C48 20 72 20 72 28 C66 25 54 25 48 28Z', '#E03131', 2.2) + L('M52 26 V23 M56 25 V21.6 M60 25 V21.4 M64 25 V21.6 M68 26 V23', '#FFA8A8', 1.2) +
    C(60, 42, 12, SKIN) + P('M47 40 C47 26 73 26 73 40 L71 44 C71 36 66 32 60 32 C54 32 49 36 49 44Z', '#ADB5BD', 2.4) + P('M47 40 L47 50 L51 49 L50 40Z M73 40 L73 50 L69 49 L70 40Z', '#ADB5BD', 2) +
    L('M53 41 Q55 39.6 57 41 M63 41 Q65 39.6 67 41', D, 1.6) + smile(60, 47, 3) + cheek(53, 46, 2) + cheek(67, 46, 2) + sparkle(30, 36, 3.5),
  'Julio César': () =>
    P('M22 106 C22 84 38 72 58 72 C78 72 94 84 94 106Z', '#fff') + `<path d="M36 78 L70 106 H84 L46 74Z" fill="#9C36B5" stroke="${D}" stroke-width="2.4" stroke-linejoin="round"/>` + L('M30 92 C34 86 40 82 46 80', '#DEE2E6', 1.6) +
    C(58, 48, 17, SKIN) + P('M42 46 C40 32 50 28 58 29 C68 28 76 34 74 46 C70 40 66 38 62 40 C58 37 50 38 42 46Z', '#7A4A2A') +
    [-160, -140, -120, -100, -80, -60, -40, -20].map(a => { const x = f(58 + 18 * Math.cos(a * Math.PI / 180)), y = f(46 + 18 * Math.sin(a * Math.PI / 180)); return E(x, y, 3.8, 2, '#FCC419', 1.5, a + 90 + (a < -90 ? 25 : -25)) }).join('') +
    L('M50 48 Q52 46 54 48', D, 1.8) + eye(65, 48, 1.8) + L('M47 44 L54 45 M62 44 L69 43', D, 1.8) +
    P('M51 55 Q58 61 65 55Z', '#fff', 1.6) + cheek(48, 54, 2.6) + cheek(70, 54, 2.6) + L('M58 50 Q60 53 57 54', '#E6A06B', 1.6) +
    stick('M76 82 L84 70', '#fff', 6) + R(78, 58, 13, 13, 4, SKIN, 2.4) + P('M80 59 C79 52 82 48 85 49 C87 50 86 55 86 59Z', SKIN, 2.4) + L('M80 63 H90 M80 66.6 H90', '#E6A06B', 1.2) +
    sparkle(30, 40, 4) + sparkle(92, 40, 3.5) + star(32, 62, 3.4, '#FFD43B', 1.4),
  'Primera piedra': () =>
    `<ellipse cx="60" cy="89" rx="32" ry="4" fill="${D}" opacity=".12"/>` +
    P('M80 56 L88 48 V80 L80 88Z', '#ADB5BD') + P('M32 56 L40 48 H88 L80 56Z', '#E9ECEF') + R(32, 56, 48, 32, 2, '#CED4DA') +
    L('M36 82 L41 80 M74 62 l3 2 M84 60 V66', '#868E96', 1.6) +
    R(38, 64, 22, 14, 2, '#FCC419', 2) + t(49, 74.4, 8, 'Nº1', '#8B5A3C') + L('M40 66.4 H50', '#fff', 1.2, ' opacity=".7"') +
    `<rect x="65" y="56" width="8" height="32" fill="#74C0FC"/><rect x="68" y="56" width="2" height="32" fill="#fff"/>` + L('M65 56 V88 M73 56 V88', D, 1.8) +
    P('M65 56 L73 48 H81 L73 56Z', '#74C0FC', 1.8) +
    P('M69 54 C62 46 56 50 59 55 C61 58 66 57 69 54Z M69 54 C76 46 82 50 79 55 C77 58 72 57 69 54Z', '#74C0FC', 2) + C(69, 54, 2.6, '#fff', 1.6) +
    E(46, 52, 7, 2.4, '#868E96', 2) +
    g('rotate(-14 48 46)', P('M34 47 L44 41 L54 47 L44 51Z', '#DEE2E6', 2.2) + L('M38 47 L44 43.6', '#fff', 1.4) + stick('M54 47 L60 44', '#ADB5BD', 1.6) + R(59, 41, 13, 5.4, 2.7, '#C97B45', 2.2)) +
    sparkle(28, 46, 4) + sparkle(92, 66, 3.5) + sparkle(88, 34, 3, '#fff'),
  'Coloso de Rodas': () =>
    `<path d="M14 80 Q24 76 34 80 T54 80 T74 80 T94 80 T114 80 V110 H14Z" fill="#4DABF7" stroke="${D}" stroke-width="2.6"/>` + L('M26 88 Q30 86 34 88 M80 90 Q84 88 88 90 M46 96 Q50 94 54 96', '#fff', 1.6) +
    R(28, 72, 20, 12, 1.5, '#CED4DA') + R(72, 72, 20, 12, 1.5, '#CED4DA') + L('M30 76 H46 M74 76 H90', '#fff', 1.4, ' opacity=".5"') +
    stick('M55 58 L40 72', '#D9A066', 6.4) + stick('M65 58 L80 72', '#D9A066', 6.4) +
    P('M52 38 H68 L67 58 H53Z', '#D9A066') + P('M52 54 H68 L70 62 H50Z', '#20C997', 2.2) + L('M56 44 H64 M60 44 V52', '#B5793F', 1.4) +
    stick('M53 41 L46 54', '#D9A066', 4) + stick('M67 41 L75 34', '#D9A066', 4) + stick('M76 33 L77 29', '#8B5A3C', 2.6) +
    P('M77 29 C73 24 76 20 78 18 C79 22 82 23 81 26 C80 28 79 29 77 29Z', '#FF922B', 1.8) +
    C(60, 32, 6.4, '#D9A066') + [-150, -120, -90, -60, -30].map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<polygon class="m-ol" style="stroke-width:1.4" points="${f(60 + 5.6 * c - 1.6 * s)},${f(32 + 5.6 * s + 1.6 * c)} ${f(60 + 11 * c)},${f(32 + 11 * s)} ${f(60 + 5.6 * c + 1.6 * s)},${f(32 + 5.6 * s - 1.6 * c)}" fill="#FCC419"/>` }).join('') +
    `<circle cx="58" cy="32" r="1" fill="${D}"/><circle cx="62.4" cy="32" r="1" fill="${D}"/>` + smile(60, 34.6, 1.8, 1.3) +
    P('M52 86 H68 L65 91 H55Z', '#C97B45', 2) + stick('M60 86 V74', '#8B5A3C', 1.4) + P('M61 75 L68 84 H61Z', '#fff', 1.8) +
    L('M30 50 q2 -2 4 0 q2 -2 4 0 M84 50 q2 -2 4 0', D, 1.4) + sparkle(36, 38, 3, '#fff'),
  'Faro de Alejandría': () =>
    `<path d="M60 30 L14 8 L14 52Z" fill="#FFE066" opacity=".55"/><path d="M60 30 L106 8 L106 52Z" fill="#FFE066" opacity=".55"/><circle cx="60" cy="30" r="14" fill="#FFF3BF"/>` +
    P('M40 100 L43 74 H77 L80 100Z', '#F1E3CF') + R(40, 71, 40, 5, 1.5, '#E9D8B4') + P('M46 71 L48 52 H72 L74 71Z', '#E9D8B4') + R(45, 49, 30, 4, 1.5, '#F1E3CF') +
    P('M51 49 L52 38 H68 L69 49Z', '#F1E3CF') + R(49, 36, 22, 3.6, 1.5, '#E9D8B4') +
    `<path d="M57 60 V66 H63 V60Z M56 84 V92 H64 V84Z M47 82 v4 h4 v-4Z M69 82 v4 h4 v-4Z" fill="#8B5A3C"/>` + L('M45 78 L44 96 M50 56 L49 68', '#fff', 1.6, ' opacity=".6"') +
    P('M60 37 C52 33 54 26 57 21 C58 25 60 26 61 24 C62 22 61 19 62 17 C67 22 69 30 60 37Z', '#FF922B', 2.2) + P('M60 35 C57 33 57 29 59 26 C60 28 62 29 63 28 C64 31 63 34 60 35Z', '#FFE066', 1.4) +
    meeple(33, 78, .42, '#4DABF7', 0, `<rect x="-8" y="-17" width="16" height="5" rx="2.5" fill="${D}"/>`) +
    meeple(87, 78, .42, '#F06595', 0, `<rect x="-8" y="-17" width="16" height="5" rx="2.5" fill="${D}"/>`) +
    L('M34 66 L37 68 M24 66 L22 68 M86 66 L84 68 M96 66 L98 68', D, 1.4) + sparkle(30, 44, 3, '#fff') + sparkle(90, 44, 3, '#fff'),

  // ══ MARIO KART ═════════════════════════════════════════════════════
  'Karting de Ezeiza': () =>
    g('translate(84 34) rotate(-12)', P('M-12 0 C-12 -2.6 10 -2.6 12 0 C10 2.6 -12 2.6 -12 0Z', '#fff', 1.8) + P('M-2 -1 L-6 -8 H-3 L3 -1Z', '#fff', 1.6) + P('M-2 1 L-5 6 H-2.6 L2 1Z', '#fff', 1.6) + P('M-11 -1 L-13 -5 H-10.6 L-8 -1Z', '#4DABF7', 1.4) + L('M-6 0 H8', '#4DABF7', 1)) +
    L('M64 40 L74 37', D, 1.2, ' stroke-dasharray="1 2.4"') +
    L('M18 70 H28 M20 78 H30 M22 86 H30', D, 2.2) +
    kart(60, 78, 1.1, '#40C057', '', 0) +
    C(52, 56, 15, '#E03131') + L('M41 50 Q52 38 63 50', '#fff', 2.4, ' opacity=".6"') + star(48, 46, 3, '#FFD43B', 1.2) +
    E(53, 63, 9, 6.6, SKIN, 2) + R(43, 56, 21, 7, 3.4, '#343A40', 2) + hl(48, 58, 3, 1, 0, .5) + smile(54, 66.6, 2.4, 1.5) + cheek(47, 65, 1.8) + cheek(60, 65, 1.8) +
    L('M36 48 q-3 -3 0 -6 M69 48 q3 -3 0 -6', D, 1.6) +
    P('M88 90 L82 90 L85 78Z', '#FF922B', 1.8) + L('M83.4 85 H86.6', '#fff', 1.6) + sparkle(30, 40, 3.5),
  'Turismo Carretera': () => {
    const car = (x: number, y: number, s: number, c: string, n: string) => g(`translate(${x} ${y}) scale(${s})`,
      P('M-28 3 C-28 -2 -26 -4 -20 -5 L-12 -6 C-8 -14 8 -14 12 -6 L23 -5 C28 -4 29 0 29 3 C29 7 27 8 24 8 H-24 C-27 8 -28 7 -28 3Z', c) +
      P('M-9 -6 C-6 -11.4 7 -11.4 9.4 -6Z', '#A5D8FF', 2) + L('M0 -11 V-6', D, 2) + R(-31, 2, 6, 3.4, 1.6, '#DEE2E6', 1.8) + R(26, 2, 6, 3.4, 1.6, '#DEE2E6', 1.8) +
      C(-1, 1, 4.6, '#fff', 1.8) + t(-1, 3.4, 6.5, n, D) + L('M-22 -2 H-12', '#fff', 1.8, ' opacity=".5"') + wheel(-17, 7, 5.6) + wheel(17, 7, 5.6))
    return `<path d="M14 90 H106 V106 H14Z" fill="#868E96"/>` + L('M24 96 H36 M50 96 H62 M76 96 H88', '#fff', 2) +
      cloud([[30, 50, 3.6], [35, 47, 4.4], [28, 74, 4], [33, 77, 4.6]], '#E9D8B4') +
      L('M30 56 H38 M32 62 H40 M30 84 H38', D, 2) +
      car(62, 52, .95, '#1C7ED6', '7') + car(60, 78, 1.05, '#E03131', '3') +
      sparkle(88, 32, 3.5) + sparkle(44, 32, 3, '#fff')
  },
  'Fangio': () =>
    [[38, 38], [49, 31], [60, 28], [71, 31], [82, 38]].map(([x, y]) => star(x, y, 4.6, '#FFD43B', 1.6)).join('') +
    L('M14 64 H22 M16 72 H26 M18 80 H24', D, 2) +
    g('translate(60 70)', P('M-8 -10 C-18 -18 -30 -12 -38 -14 C-30 -6 -16 -6 -8 -6Z', '#fff', 2) +
      P('M-34 2 C-34 -6 -26 -8 -14 -8 L20 -8 C32 -8 38 -4 38 2 C38 6 34 8 28 8 H-28 C-32 8 -34 6 -34 2Z', '#E03131') +
      L('M-26 -3 H14', '#fff', 2, ' opacity=".5"') + C(4, 0, 4.4, '#fff', 1.8) + t(4, 2.4, 6.5, '1', D) + R(-12, -10, 6, 4, 1, '#A5D8FF', 1.6) +
      C(-2, -16, 8, SKIN) + P('M-10 -16 C-10 -26 6 -26 6 -16 C2 -20 -6 -20 -10 -16Z', '#8B5A3C', 2.2) + P('M-10 -16 L-11 -10 L-7 -11Z', '#8B5A3C', 1.6) +
      L('M-6 -17.4 H5', D, 1.6) + `<circle cx="-2" cy="-17.4" r="2.6" fill="#A5D8FF" stroke="${D}" stroke-width="1.6"/><circle cx="4" cy="-17.4" r="2.6" fill="#A5D8FF" stroke="${D}" stroke-width="1.6"/>` +
      smile(1, -12, 2, 1.4) +
      [-22, 22].map(x => C(x, 7, 9, '#343A40') + `<circle cx="${x}" cy="7" r="6" fill="#DEE2E6"/>` + L(`M${x - 6} 7 H${x + 6} M${x} 1 V13 M${x - 4.2} 2.8 L${x + 4.2} 11.2 M${x + 4.2} 2.8 L${x - 4.2} 11.2`, '#868E96', .9) + `<circle cx="${x}" cy="7" r="1.6" fill="${D}"/>`).join('')) +
    sparkle(92, 58, 3.5, '#fff'),
  'Pararrayos': () =>
    L('M96 38 C88 38 80 39 72 41', D, 1.8, ' stroke-dasharray="2 3"') + L('M90 30 L86 34 M92 48 L87 46', D, 1.6) +
    stick('M38 76 V44', '#ADB5BD', 2) + P('M35 45 L38 35 L41 45Z', '#CED4DA', 1.8) +
    kart(62, 80, 1, '#FCC419', pilot(-6, -16, 9, '#7950F2', 'scared')) +
    blueShell(58, 43, .8, -14) + `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(39, 36, 7, 3, 7)}" fill="#FFE066"/>` +
    L('M26 38 L30 41 M27 50 L31 48 M46 28 L44 32', D, 1.8) + drop(82, 54, .8) + drop(88, 60, .6),
  'Piñata': u => {
    const body = 'M-24 2 C-24 -3 -20 -5 -14 -5 H2 L8 -10 H18 C23 -10 26 -6 26 -1 V2 C26 5 24 7 21 7 H-21 C-23 7 -24 5 -24 2Z'
    let fr = ''
    const cs = ['#F06595', '#FFD43B', '#4DABF7', '#69DB7C', '#F06595']
    cs.forEach((c, i) => { let d = `M-26 ${-12 + i * 4} `; for (let k = 0; k <= 26; k++) d += `L${-26 + k * 2} ${-12 + i * 4 + (k % 2 ? 2 : 0)} `; fr += `<path d="${d}V20 H-26Z" fill="${c}"/>` })
    return stick('M60 14 V36', '#C97B45', 1.6) +
      g('translate(60 52) scale(1.25)', `<defs><clipPath id="pn${u}"><path d="${body}"/></clipPath></defs><g clip-path="url(#pn${u})">${fr}</g>` + `<path class="m-ol" style="stroke-width:2.1" d="${body}" fill="none"/>` +
        C(-6, -15, 7, '#FFE066', 2.1) + `<circle cx="-4.6" cy="-15.6" r="1.1" fill="${D}"/><circle cx="-0.6" cy="-15.6" r="1.1" fill="${D}"/>` + smile(-2.6, -12.4, 1.6, 1.2) +
        C(-15, 7, 5.6, '#7950F2', 2.1) + C(15, 7, 5.6, '#7950F2', 2.1) + `<circle cx="-15" cy="7" r="2" fill="#FFD43B"/><circle cx="15" cy="7" r="2" fill="#FFD43B"/>` + L('M4 -4 L8 2 L5 6', D, 1.2)) +
      shell(26, 48, .85, '#40C057', 20) + shell(94, 54, .85, '#E03131', -20) +
      `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(34, 52, 5, 2.2, 6)}" fill="#FFE066"/><polygon class="m-ol" style="stroke-width:1.6" points="${starPts(88, 60, 5, 2.2, 6)}" fill="#FFE066"/>` +
      [[44, 80, '#E03131', 20], [58, 88, '#4DABF7', -30], [74, 82, '#FCC419', 40], [52, 74, '#40C057', -10], [68, 74, '#F06595', 10], [84, 90, '#7950F2', -20], [38, 90, '#FF922B', 30]]
        .map(([x, y, c, a]) => g(`translate(${x} ${y}) rotate(${a})`, P('M-3 0 L-6 -2.6 V2.6Z M3 0 L6 -2.6 V2.6Z', c as string, 1.2) + E(0, 0, 3.2, 2.4, c as string, 1.4) + `<circle cx="-1" cy="-.8" r=".7" fill="#fff"/>`)).join('')
  },
  'Víctima del sistema': () =>
    `<ellipse cx="60" cy="90" rx="30" ry="5" fill="${D}" opacity=".25"/>` +
    cloud([[34, 66, 5], [30, 58, 6], [36, 50, 5], [86, 68, 5], [90, 60, 5.6]], '#CED4DA') +
    kart(60, 80, 1, '#495057', P('M-14 -22 L-12 -28 L-9 -23 L-6 -30 L-3 -23 L0 -29 L2 -22Z', '#343A40', 1.8) + pilot(-6, -16, 9, '#343A40', 'burnt'), 0, '#212529') +
    L('M44 72 L48 70 M68 78 L72 76', '#868E96', 1.4) +
    `<ellipse cx="56" cy="47" rx="24" ry="7" fill="none" stroke="${D}" stroke-width="1.4" stroke-dasharray="2 3"/>` +
    blueShell(34, 48, .5) + blueShell(62, 41, .5) + blueShell(76, 52, .5) +
    sparkle(48, 32, 3, '#FFE066') + sparkle(88, 34, 3, '#FFE066'),
  'Banquina': () =>
    `<path d="M14 26 H106 V56 H14Z" fill="#868E96"/>` + L('M14 26 H106', D, 2.6) + L('M18 41 H30 M42 41 H54 M66 41 H78 M90 41 H102', '#fff', 2.4) +
    `<path d="M14 56 H106 V106 H14Z" fill="#E0B97A"/>` + L('M14 56 H106', D, 2.6) +
    [[28, 70], [40, 90], [80, 92], [72, 64], [92, 76]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.2" fill="#A0784A"/>`).join('') +
    L('M24 82 l2 -5 l2 5 M88 88 l2 -5 l2 5', '#2F9E44', 1.8) +
    stick('M84 54 V80', '#ADB5BD', 2) + `<polygon class="m-ol" points="84,32 96,44 84,56 72,44" fill="#FCC419"/>` + L('M80 50 V44 Q80 39 85 39 H88 M86 36 L89 39 L86 42', D, 2) +
    cloud([[30, 70, 4], [36, 66, 5], [32, 62, 3.6]], '#F1E3CF') +
    kart(56, 76, 1, '#E03131', pilot(-6, -16, 9, '#FCC419', 'dizzy'), 14) +
    L('M28 50 L30 52 M38 50 L37 53', D, 1.2) + L('M50 50 q2 -3 4 0 q2 -3 4 0', D, 1.4),
  'Pescado por Lakitu': () =>
    `<path d="M14 90 Q24 86 34 90 T54 90 T74 90 T94 90 T114 90 V110 H14Z" fill="#4DABF7" stroke="${D}" stroke-width="2.6"/>` + L('M54 96 q4 -3 8 0 M70 96 q4 -3 8 0', '#fff', 1.6) +
    stick('M46 44 L84 30', '#8B5A3C', 2) + L('M84 30 L76 52', D, 1.2) +
    g('translate(2 6)', cloud([[30, 40, 9], [40, 34, 9], [44, 44, 8], [24, 48, 6], [34, 48, 7]]) +
    `<circle cx="34" cy="40" r="1.6" fill="${D}"/><circle cx="41" cy="40" r="1.6" fill="${D}"/>` + smile(37.6, 44, 2.4, 1.4) + cheek(30, 44, 1.8) + cheek(45, 44, 1.8) +
    P('M28 32 C28 24 46 24 46 32Z', '#40C057', 2) + R(25, 31, 24, 3.6, 1.8, '#2F9E44', 2) + C(44, 38, 2.2, SKIN, 1.6)) +
    kart(72, 70, .9, '#4DABF7', pilot(-6, -16, 9, '#E03131', 'sad'), -26) +
    drop(58, 80, .8) + drop(66, 84, .9) + drop(80, 82, .8) + drop(88, 76, .7) + sparkle(92, 50, 3, '#fff'),
  'Senda del Arcoíris': () => {
    const cs = ['#E03131', '#FF922B', '#FCC419', '#40C057', '#4DABF7', '#7950F2']
    return `<rect x="14" y="14" width="92" height="92" fill="#1B1E3F"/>` +
      [[24, 64], [34, 84], [90, 72], [80, 92], [48, 96], [96, 52], [70, 50], [28, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#fff"/>`).join('') +
      `<circle cx="88" cy="88" r="6" fill="#9775FA" stroke="${D}" stroke-width="2"/><path d="M80 88 Q88 84 96 88" stroke="#E5DBFF" stroke-width="1.4" fill="none"/>` +
      `<path d="M8 50 Q50 18 112 30" fill="none" stroke="${D}" stroke-width="22" stroke-linecap="round"/>` +
      cs.map((c, i) => `<path d="M8 ${f(42 + i * 3.2)} Q50 ${f(10 + i * 3.2)} 112 ${f(22 + i * 3.2)}" fill="none" stroke="${c}" stroke-width="3.4"/>`).join('') +
      L('M48 58 L52 64 M60 54 L62 60 M70 54 L70 60', '#fff', 1.6, ' opacity=".6"') +
      L('M40 50 L44 58 M52 46 L55 54 M30 58 L34 64', '#fff', 1.8, ' opacity=".7"') + kart(60, 74, .95, '#F06595', pilot(-6, -16, 9, '#FCC419', 'scared'), 38) +
      sparkle(30, 76, 3.5, '#FFE066') + sparkle(86, 58, 3, '#fff') + sparkle(42, 70, 2.6, '#fff')
  },
}
