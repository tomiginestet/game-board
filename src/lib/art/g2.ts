// Ilustraciones de medallas: Buraco, Cacho, Splendor, The Mind, Pandemic y EA Sports FC.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Atajos de dibujo ──────────────────────────────────────────────────
const sw = (w?: number) => (w ? ` style="stroke-width:${w}"` : '');
const P = (d: string, fill: string, w?: number) => `<path class="m-ol"${sw(w)} d="${d}" fill="${fill}"/>`;
const C = (cx: number, cy: number, r: number, fill: string, w?: number) => `<circle class="m-ol"${sw(w)} cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const E = (cx: number, cy: number, rx: number, ry: number, fill: string, w?: number) => `<ellipse class="m-ol"${sw(w)} cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const R = (x: number, y: number, w: number, h: number, rx: number, fill: string, s?: number) => `<rect class="m-ol"${sw(s)} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const L = (d: string, c = D, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const shine = (d: string, w = 2.4, o = .6) => L(d, '#fff', w, `opacity="${o}"`);
const blush = (x: number, y: number, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/>`;
const dot = (x: number, y: number, r = 1.6, c = D) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`;
const g = (tr: string, s: string) => `<g transform="${tr}">${s}</g>`;

type Mood = 'happy' | 'calm' | 'angry' | 'shock' | 'wink' | 'grump' | 'sad' | 'sly';
/** Cara para una cabeza de radio ~12 centrada en (x,y). */
const face = (x: number, y: number, s = 1, k: Mood = 'happy', bl = true) => {
  const m = k === 'happy' ? L('M-3 3 Q0 6.2 3 3', D, 1.6)
    : k === 'calm' ? L('M-2.4 3.4 Q0 5.4 2.4 3.4', D, 1.5)
    : k === 'angry' ? L('M-3 5 Q0 2.6 3 5', D, 1.6)
    : k === 'shock' ? `<ellipse cx="0" cy="4.6" rx="2.2" ry="2.8" fill="${D}"/>`
    : k === 'sad' ? L('M-3 5 Q0 2.6 3 5', D, 1.6)
    : k === 'grump' ? L('M-3 4.4 H3', D, 1.6)
    : L('M-2.6 3.6 Q1 5.6 4 2.4', D, 1.6);
  const e = k === 'calm' ? L('M-6 -1 Q-3.8 1.4 -1.6 -1 M1.6 -1 Q3.8 1.4 6 -1', D, 1.5)
    : k === 'shock' ? `<circle cx="-3.8" cy="-1" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="3.8" cy="-1" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/>` + dot(-3.8, -1, 1.1) + dot(3.8, -1, 1.1)
    : k === 'wink' ? dot(-3.8, -1) + L('M1.8 -.6 Q3.8 -3 5.8 -.6', D, 1.5)
    : k === 'sly' ? dot(-3.8, -.4, 1.4) + dot(3.8, -.4, 1.4) + L('M-6 -2.4 H-1.6 M1.6 -2.4 H6', D, 1.5)
    : dot(-3.8, -1) + dot(3.8, -1);
  const b = k === 'angry' ? L('M-6.6 -5.4 L-1.6 -3.4 M6.6 -5.4 L1.6 -3.4', D, 1.8)
    : k === 'grump' ? L('M-6.4 -3.6 L-1.8 -4.2 M6.4 -3.6 L1.8 -4.2', D, 1.8)
    : k === 'sad' ? L('M-6.2 -3.6 L-1.8 -5.4 M6.2 -3.6 L1.8 -5.4', D, 1.5)
    : k === 'sly' ? L('M-6.2 -5.2 Q-4 -6.8 -1.8 -5.4', D, 1.4) : '';
  return g(`translate(${x} ${y}) scale(${s})`, (bl ? blush(-6.4, 2.6) + blush(6.4, 2.6) : '') + e + b + m);
};

// Cartas
const SPADE = 'M0 -6 C-3 -2 -7 0 -6 4 C-5 7 -2 6 -1 5 L-2 8 H2 L1 5 C2 6 5 7 6 4 C7 0 3 -2 0 -6Z';
type Suit = 'h' | 'd' | 's' | 'c' | 'j';
const suit = (k: Suit, w: number) =>
  k === 'h' ? heart(0, .5, 4.4, '#E03131', w)
  : k === 'd' ? P('M0 -6 L5 .5 L0 7 L-5 .5Z', '#E03131', w)
  : k === 's' ? P(SPADE, D, w)
  : k === 'c' ? `<g fill="${D}"><circle cx="0" cy="-2.8" r="2.7"/><circle cx="-3" cy="1.8" r="2.7"/><circle cx="3" cy="1.8" r="2.7"/><path d="M-1 1 L-2.2 7 H2.2 L1 1Z"/></g>`
  : `<polygon class="m-ol" style="stroke-width:${w}" points="${starPts(0, .5, 6, 2.6)}" fill="#FCC419"/>`;
const card = (x: number, y: number, rot: number, s = 1, k: Suit = 'h', rank = 'A', back = '#fff') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${back}"/>` +
    suit(k, f(1.6 / s)) + t(-5.6, -6, 6.5, k === 'j' ? 'J' : rank, k === 'j' ? '#7048E8' : k === 'h' || k === 'd' ? '#E03131' : D));
const cardBack = (x: number, y: number, rot: number, s = 1, c = '#E03131') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${c}"/>` +
    `<rect x="-6.5" y="-10.5" width="13" height="21" rx="1.5" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M0 -6 L4 0 L0 6 L-4 0Z" fill="#fff" opacity=".8"/>`);
/** Carta numerada de The Mind. */
const ncard = (x: number, y: number, rot: number, s: number, n: string, c = '#7048E8') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${c}"/>` +
    `<rect x="-7" y="-11" width="14" height="22" rx="2" fill="none" stroke="#fff" stroke-width="1" opacity=".6"/>` + t(0, 4.5, n.length > 1 ? 12 : 14, n, '#fff'));

// Dados
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};
const die = (x: number, y: number, s: number, n: number, fill = '#fff', pip = D, rot = 0, w = 2.6) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect class="m-ol" style="stroke-width:${w}" x="${f(-s / 2)}" y="${f(-s / 2)}" width="${s}" height="${s}" rx="${f(s * .22)}" fill="${fill}"/>` +
  `<path d="M${f(-s * .3)} ${f(-s * .34)} H${f(s * .05)}" stroke="#fff" stroke-width="${f(s * .08)}" stroke-linecap="round" opacity=".6"/>` +
  PIPS[n].map(([a, b]) => `<circle cx="${f(a * s * .26)}" cy="${f(b * s * .26)}" r="${f(s * .09)}" fill="${pip}"/>`).join('') + `</g>`;
/** Cubo isométrico liso (cubos de enfermedad); (x,y) es la arista frontal superior. */
const pcube = (x: number, y: number, s: number, c: [string, string, string]) => {
  const k = f(s * .87), h = f(s / 2);
  return `<path d="M${x} ${f(y - s)} L${f(x + k)} ${f(y - h)} L${x} ${y} L${f(x - k)} ${f(y - h)}Z" fill="${c[0]}"/>` +
    `<path d="M${f(x - k)} ${f(y - h)} L${x} ${y} L${x} ${f(y + s)} L${f(x - k)} ${f(y + h)}Z" fill="${c[1]}"/>` +
    `<path d="M${x} ${y} L${f(x + k)} ${f(y - h)} L${f(x + k)} ${f(y + h)} L${x} ${f(y + s)}Z" fill="${c[2]}"/>` +
    `<path class="m-ol" style="stroke-width:2.2" d="M${x} ${f(y - s)} L${f(x + k)} ${f(y - h)} L${f(x + k)} ${f(y + h)} L${x} ${f(y + s)} L${f(x - k)} ${f(y + h)} L${f(x - k)} ${f(y - h)}Z M${f(x - k)} ${f(y - h)} L${x} ${y} L${f(x + k)} ${f(y - h)} M${x} ${y} V${f(y + s)}" fill="none"/>`;
};
const BLUE: [string, string, string] = ['#A5D8FF', '#4DABF7', '#1C7ED6'];
const YEL: [string, string, string] = ['#FFEC99', '#FCC419', '#F59F00'];
const RED: [string, string, string] = ['#FFA8A8', '#FA5252', '#C92A2A'];
const BLK: [string, string, string] = ['#ADB5BD', '#495057', '#343A40'];
/** Cubilete de cuero. Boca abajo por defecto; up=true lo da vuelta (boca arriba). */
const cup = (x: number, y: number, s: number, fill = '#A0522D', up = false, rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, up
    ? P('M-14 -16 L-11 15 C-11 19 11 19 11 15 L14 -16Z', fill, f(2.6 / s)) + L('M-12.6 -8 H12.6 M-11.6 8 H11.6', '#FFE8CC', f(1.2 / s), 'stroke-dasharray="2 2"') + shine('M-8 -6 L-6.4 10', f(2 / s), .45)
    : P('M-11 -16 L-14 14 C-14 18 14 18 14 14 L11 -16Z', fill, f(2.6 / s)) + E(0, -16, 11, 3.4, '#6E3B1F', f(2.2 / s)) + L('M-12.4 -6 H12.4 M-13.4 7 H13.4', '#FFE8CC', f(1.2 / s), 'stroke-dasharray="2 2"') + shine('M-8 -10 L-9.6 10', f(2 / s), .45));
const gem = (x: number, y: number, s: number, c: string, rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M-9 -3 L-5 -9 H5 L9 -3 L0 10Z" fill="${c}"/>` +
    `<path d="M-5 -9 H5 L9 -3 H-9Z" fill="#fff" opacity=".38"/><path d="M-9 -3 H9 M-2.5 -3 L0 10 L2.5 -3 M-5 -9 L-2.5 -3 M5 -9 L2.5 -3" stroke="${D}" stroke-width="${f(1 / s)}" fill="none" opacity=".4"/>` +
    `<path d="M-5.4 -.6 L-2 5" stroke="#fff" stroke-width="${f(1.6 / s)}" stroke-linecap="round" opacity=".85"/>`);
const coin = (x: number, y: number, r: number) =>
  C(x, y, r, '#FCC419') + `<circle cx="${x}" cy="${y}" r="${f(r * .62)}" fill="none" stroke="#E67700" stroke-width="1.6"/>` +
  `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .4)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" transform="rotate(-40 ${f(x - r * .4)} ${f(y - r * .4)})"/>`;
const crown = (x: number, y: number, s: number) =>
  g(`translate(${x} ${y}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z" fill="#FFD43B"/>` +
    `<circle cx="0" cy="1.5" r="1.8" fill="#E03131"/><circle cx="-6" cy="2" r="1.2" fill="#4DABF7"/><circle cx="6" cy="2" r="1.2" fill="#4DABF7"/>`);
/** Joystick de consola. */
const ctrl = (x: number, y: number, s: number, rot = 0, fill = '#495057') =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-14 -7 C-8 -10 8 -10 14 -7 C20 -4 23 9 18 12 C14 14 11 9 8 6 H-8 C-11 9 -14 14 -18 12 C-23 9 -20 -4 -14 -7Z" fill="${fill}"/>` +
    L('M-12.5 -1.5 H-6.5 M-9.5 -4.5 V1.5', '#fff', 2.2) + dot(8, -4.4, 1.6, '#FF6B6B') + dot(11.4, -1.2, 1.6, '#51CF66') + dot(8, 2, 1.6, '#FCC419') + dot(4.6, -1.2, 1.6, '#4DABF7') +
    `<circle cx="-3.6" cy="3" r="2.2" fill="${D}"/><circle cx="2" cy="3" r="2.2" fill="${D}"/>` + shine('M-13 -4.6 Q-7 -7.6 -1 -7.4', 1.6, .5));
/** Pelota de fútbol. */
const sball = (x: number, y: number, r: number, id: string, retro = false) => {
  let sp = '', pt = '', pent = '';
  for (let k = 0; k < 5; k++) {
    const a = (-90 + 72 * k) * Math.PI / 180, b = (-54 + 72 * k) * Math.PI / 180;
    pent += f(x + r * .36 * Math.cos(a)) + ',' + f(y + r * .36 * Math.sin(a)) + ' ';
    sp += `M${f(x + r * .36 * Math.cos(a))} ${f(y + r * .36 * Math.sin(a))} L${f(x + r * .78 * Math.cos(a))} ${f(y + r * .78 * Math.sin(a))} `;
    pt += retro ? `<path d="M${f(x + r * .7 * Math.cos(b))} ${f(y + r * .7 * Math.sin(b))} L${f(x + r * 1.05 * Math.cos(b - .3))} ${f(y + r * 1.05 * Math.sin(b - .3))} L${f(x + r * 1.05 * Math.cos(b + .3))} ${f(y + r * 1.05 * Math.sin(b + .3))}Z" fill="${D}"/>`
      : `<circle cx="${f(x + r * 1.02 * Math.cos(a))}" cy="${f(y + r * 1.02 * Math.sin(a))}" r="${f(r * .3)}" fill="${D}"/>`;
  }
  return `<defs><clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>` +
    `<g clip-path="url(#${id})">${pt}</g>` + (retro ? '' : `<polygon points="${pent}" fill="${D}"/><path d="${sp}" stroke="${D}" stroke-width="${f(Math.max(1, r * .09))}"/>`) +
    `<ellipse cx="${f(x - r * .42)}" cy="${f(y - r * .45)}" rx="${f(r * .2)}" ry="${f(r * .12)}" fill="#fff" transform="rotate(-35 ${f(x - r * .42)} ${f(y - r * .45)})"/>` +
    C(x, y, r, 'none', Math.min(2.6, f(r * .28)));
};
const mate = (x: number, y: number, s: number, body = '#9C6644') =>
  g(`translate(${x} ${y}) scale(${s})`, stick('M4 -12 L14 -30', '#CED4DA', 2.4) +
    `<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-13 -10 C-17 0 -14 14 0 15 C14 14 17 0 13 -10Z" fill="${body}"/>` +
    `<path d="M-9 -4 C-10 2 -8 8 -4 10" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".45"/>` +
    `<ellipse class="m-ol" style="stroke-width:${f(2.6 / s)}" cx="0" cy="-10" rx="13" ry="4" fill="#5C940D"/><path d="M-7 -11 Q-3 -12.5 1 -11" stroke="#94D82D" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<rect class="m-ol" style="stroke-width:${f(2 / s)}" x="-14" y="-7" width="28" height="4" rx="2" fill="#E9C46A"/>`);
const SK = '#F4BE8F', SK2 = '#FFD8B5', SK3 = '#C68B59';
/** Rayos de brillo alrededor de (x,y). */
const rays = (x: number, y: number, r1: number, r2: number, n: number, c = '#FFD43B', w = 3, o = 1) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 360 / n - 90) * Math.PI / 180;
    d += `M${f(x + r1 * Math.cos(a))} ${f(y + r1 * Math.sin(a))} L${f(x + r2 * Math.cos(a))} ${f(y + r2 * Math.sin(a))} `;
  }
  return L(d, c, w, `opacity="${o}"`);
};
const steam = (x: number, y: number, s = 1) =>
  g(`translate(${x} ${y}) scale(${s})`, P('M-6 0 C-10 0 -10 -7 -5 -7 C-5 -12 3 -13 4 -8 C9 -9 10 -1 5 0Z', '#fff', 2));

export const G2_ART: Record<string, (u: number) => string> = {
  // ═══════════════ BURACO ═══════════════
  // ── Canastas limpias ──
  'Patio baldeado': () => {
    let tiles = '';
    for (let i = 0; i < 10; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2) tiles += `M${i * 12} ${76 + j * 10} h12 v10 h-12Z `;
    return `<rect x="0" y="76" width="120" height="40" fill="#FFF8F0"/><path d="${tiles}" fill="#E8735A"/>` + L('M0 76 H120', D, 2.6) +
      `<ellipse cx="60" cy="90" rx="30" ry="5" fill="#A5D8FF" opacity=".55"/>` + shine('M30 84 H40 M70 94 H84 M88 82 H94', 2, .9) +
      L('M31 46 C29 28 59 28 57 46', D, 2.6) +
      P('M30 46 L35 82 C35 86 53 86 53 82 L58 46Z', '#4DABF7') + E(44, 46, 14, 4.4, '#1C7ED6') + L('M32 54 H56', '#1971C2', 2) +
      C(36, 44, 4, '#fff', 1.8) + C(43, 41, 5.4, '#fff', 1.8) + C(51, 43, 4.6, '#fff', 1.8) + C(56, 46, 3, '#fff', 1.8) + C(47, 36, 2.4, '#fff', 1.6) +
      shine('M35 58 L37 76', 2.4, .55) + face(44, 66, .85, 'happy') +
      stick('M88 28 L76 72', '#C97B45', 3.2) + g('rotate(14 76 74)', R(64, 70, 24, 6, 2, '#E03131') + R(63, 75, 26, 3.4, 1.5, D, 1.6)) +
      g('translate(64 86) rotate(-72) scale(.5)', `<rect class="m-ol" style="stroke-width:4.7" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/>` + heart(0, .5, 4.4, '#E03131', 2.9)) +
      sparkle(78, 86, 3.6, '#fff') + sparkle(52, 90, 3) + sparkle(84, 40, 4) + sparkle(28, 30, 3.2, '#fff');
  },
  'Mantel de domingo': () => {
    let lace = '';
    for (let i = 0; i < 8; i++) lace += `<circle cx="${f(24 + i * 4.6)}" cy="${f(72 + i * 2.4)}" r="2.4"/><circle cx="${f(96 - i * 4.6)}" cy="${f(72 + i * 2.4)}" r="2.4"/>`;
    const fan = [-36, -24, -12, 0, 12, 24, 36].map((a, i) => g(`rotate(${a} 60 82)`, card(60, 60, 0, .72, (['h', 's', 'd', 'c', 'h', 's', 'd'] as Suit[])[i], ['4', '5', '6', '7', '8', '9', '10'][i]))).join('');
    return `<g fill="#fff" stroke="${D}" stroke-width="1.6">${lace}</g>` +
      P('M60 50 L98 70 L60 92 L22 70Z', '#fff') + P('M22 70 L60 92 L98 70 L98 76 L60 98 L22 76Z', '#F1F3F5') +
      L('M41 60 L79 81 M41 81 L79 60', '#DEE2E6', 1.6, 'stroke-dasharray="3 3"') + fan +
      g('translate(88 40)', P('M0 -10 C3 -5 7 -1 7 3 A7 7 0 0 1 -7 3 C-7 -1 -3 -5 0 -10Z', '#E03131', 2) + dot(-2.4, 1.6, 1.2) + dot(2.4, 1.6, 1.2) + L('M-2 6 Q0 4.4 2 6', D, 1.2) + `<path d="M5 -6 Q7 -4 6 -2" stroke="#4DABF7" stroke-width="1.6" fill="none"/>`) +
      sparkle(30, 46, 4.5, '#fff') + sparkle(36, 34, 3) + sparkle(60, 26, 4);
  },
  'Abuela con plumero': () =>
    cardBack(82, 86, 8, .8, '#4DABF7') + cardBack(78, 82, -6, .8, '#4DABF7') + card(80, 76, 4, .8, 'h', 'A') +
    sparkle(92, 66, 4, '#fff') + sparkle(68, 64, 3) +
    P('M24 104 C24 80 32 66 46 66 C60 66 68 80 68 104Z', '#9775FA') + P('M34 104 C34 86 38 76 46 76 C54 76 58 86 58 104Z', '#fff') +
    R(40, 86, 12, 8, 2, '#FFE3EC', 1.6) + L('M36 76 C40 72 52 72 56 76', '#E64980', 2.2) +
    C(46, 50, 14, SK2) + P('M32 48 C32 34 60 34 60 48 C56 42 50 41 46 43 C42 41 36 42 32 48Z', '#CED4DA') + C(46, 32, 6.5, '#CED4DA') + shine('M43 30 Q45 28 48 29', 1.6, .8) +
    face(46, 52, .95, 'calm') + `<circle cx="42.4" cy="51" r="3.6" fill="#fff" fill-opacity=".35" stroke="${D}" stroke-width="1.3"/><circle cx="49.6" cy="51" r="3.6" fill="#fff" fill-opacity=".35" stroke="${D}" stroke-width="1.3"/>` + L('M46 50.6 H46.1', D, 1.3) +
    stick('M62 76 L76 52', '#8B5A3C', 3) + C(62, 76, 4, SK2, 2) +
    g('translate(79 46) rotate(30) scale(.85)', [['#FF8FB1', -40], ['#FFD43B', -15], ['#74C0FC', 10], ['#B197FC', 35], ['#FF8FB1', 60]].map(([c, a]) => `<ellipse class="m-ol" style="stroke-width:1.6" cx="0" cy="-8" rx="4" ry="9" fill="${c}" transform="rotate(${a})"/>`).join('')) +
    L('M92 56 Q96 60 94 64 M66 40 Q64 36 68 34', '#ADB5BD', 1.6, 'stroke-dasharray="1 3"') + sparkle(28, 34, 3.5, '#fff'),
  // ── Canastas sucias ──
  'Botines embarrados': () => {
    const boot = (fill: string) => P('M26 48 C28 42 42 42 44 48 L48 58 C62 58 80 60 90 68 C95 72 94 80 88 80 H30 C25 80 24 74 25 68Z', fill) +
      L('M50 60 L56 66 M56 59.5 L62 65.5 M62 59.6 L68 66', '#fff', 2) + R(25, 77, 66, 5, 2.5, '#FFE066', 1.8) +
      `<g fill="${D}"><rect x="31" y="81" width="4" height="5" rx="1"/><rect x="42" y="81" width="4" height="5" rx="1"/><rect x="64" y="81" width="4" height="5" rx="1"/><rect x="78" y="81" width="4" height="5" rx="1"/></g>`;
    return E(60, 92, 36, 8, '#8B5A3C') + `<ellipse cx="48" cy="90" rx="10" ry="2" fill="#A9744F"/>` +
      g('translate(66 84) rotate(-8) scale(.6)', `<rect class="m-ol" style="stroke-width:4.2" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/>` + suit('j', 2.6) + t(-5.6, -6, 6.5, 'J', '#7048E8') + `<path d="M-10 6 C-4 2 2 10 10 4 V14 H-10Z" fill="#8B5A3C"/>`) +
      g('translate(60 58) rotate(-8) scale(.88) translate(-60 -64)', boot('#FF922B') +
      P('M76 62 C82 60 90 66 91 72 C88 74 84 70 82 73 C78 72 80 66 76 66Z', '#8B5A3C', 1.8) + P('M27 60 C32 58 36 62 34 68 C31 70 28 66 26 68Z', '#8B5A3C', 1.8) +
      P('M54 72 C58 70 62 72 60 76 C57 77 55 75 54 72Z', '#8B5A3C', 1.6) + shine('M30 50 Q34 46 40 47', 2, .7) + face(36, 62, .7, 'grump', false)) +
      `<g fill="#8B5A3C" stroke="${D}" stroke-width="1.4"><circle cx="26" cy="80" r="2.4"/><circle cx="94" cy="74" r="2"/><circle cx="88" cy="40" r="1.8"/><circle cx="32" cy="36" r="1.6"/></g>` +
      L('M80 34 Q76 28 80 22 M88 38 Q84 32 88 26', '#ADB5BD', 1.6) + g('translate(44 26)', `<ellipse cx="-2" cy="-3" rx="2.6" ry="1.6" fill="#E7F5FF" stroke="${D}" stroke-width="1"/><ellipse cx="2" cy="-3" rx="2.6" ry="1.6" fill="#E7F5FF" stroke="${D}" stroke-width="1"/>` + C(0, 0, 2.2, D, 1));
  },
  'Agua del Riachuelo': u => {
    const gl = 'M32 28 L39 94 H81 L88 28Z';
    return `<defs><clipPath id="w${u}"><path d="${gl}"/></clipPath></defs>` +
      `<path d="${gl}" fill="#E7F5FF" opacity=".7"/>` +
      `<g clip-path="url(#w${u})"><path d="M20 44 Q30 40 40 44 T60 44 T80 44 T100 44 V100 H20Z" fill="#8C9A4E"/><path d="M20 64 Q40 60 60 66 T100 64 V100 H20Z" fill="#6F7A3A" opacity=".6"/>` +
      cardBack(46, 82, 30, .55, '#4DABF7') +
      `<circle cx="44" cy="58" r="2" fill="#fff" opacity=".6"/><circle cx="76" cy="76" r="2.6" fill="#fff" opacity=".6"/><circle cx="72" cy="56" r="1.4" fill="#fff" opacity=".6"/></g>` +
      g('translate(62 68)', P('M-12 0 C-10 -8 4 -9 10 0 C4 9 -10 8 -12 0Z', '#FFA94D') + P('M10 0 L18 -6 L17 6Z', '#FF922B') + P('M-4 -6 L0 -11 L3 -6Z', '#FF922B', 2) +
        L('M-8 -3 L-5 -1 L-8 1', D, 1.5) + dot(-2, -1, 1.3) + L('M-9 4 Q-6 2 -3 4', D, 1.4) + `<path d="M-7 4.2 Q-6.5 7.6 -5 4.6" fill="#FF6B6B" stroke="${D}" stroke-width="1.1"/>` + L('M3 -3 Q5 0 3 3', D, 1.2, 'opacity=".5"')) +
      card(74, 42, 24, .6, 'c', '3') +
      L('M20 44 Q30 40 40 44 T60 44 T80 44 T100 44', D, 2, `clip-path="url(#w${u})"`) +
      P(gl, 'none') + shine('M36 34 L41 86', 3, .55) +
      L('M48 22 Q44 18 48 14 Q52 10 48 6 M62 24 Q58 20 62 16 Q66 12 62 8', '#82C91E', 2.2) +
      g('translate(86 18)', `<ellipse cx="-2" cy="-3" rx="2.6" ry="1.6" fill="#E7F5FF" stroke="${D}" stroke-width="1"/><ellipse cx="2" cy="-3" rx="2.6" ry="1.6" fill="#E7F5FF" stroke="${D}" stroke-width="1"/>` + C(0, 0, 2.4, D, 1)) +
      L('M78 22 Q82 26 84 20', D, 1, 'stroke-dasharray="1 2"');
  },
  'Chiquero de lujo': () =>
    E(60, 88, 38, 11, '#8B5A3C') + `<ellipse cx="50" cy="86" rx="10" ry="2.4" fill="#A9744F"/>` +
    [-40, -20, 0, 20, 40].map((a, i) => g(`rotate(${a} 60 92)`, card(60, 66, 0, .78, (['j', 'h', 'j', 's', 'j'] as Suit[])[i], ['', 'K', '', 'Q', ''][i]))).join('') +
    E(60, 76, 23, 13, '#FFA8C5') + P('M44 76 C42 82 46 86 52 84 M70 84 C76 86 78 82 76 76', '#FFA8C5', 2.4) +
    P('M40 76 C38 70 44 66 50 72 C46 76 42 78 40 76Z', '#8B5A3C', 1.8) + P('M70 82 C72 78 80 78 80 82 C76 84 72 84 70 82Z', '#8B5A3C', 1.8) +
    P('M44 44 L42 32 L52 38Z', '#FF8FB1') + P('M76 44 L78 32 L68 38Z', '#FF8FB1') +
    C(60, 54, 16, '#FFA8C5') + E(60, 59, 7, 5, '#FF8FAB', 2.2) + `<ellipse cx="57.6" cy="59" rx="1.3" ry="2" fill="${D}"/><ellipse cx="62.4" cy="59" rx="1.3" ry="2" fill="${D}"/>` +
    L('M51.6 50.6 Q53.6 48.4 55.6 50.6 M64.4 50.6 Q66.4 48.4 68.4 50.6', D, 1.6) + blush(49, 57, 2.6) + blush(71, 57, 2.6) + L('M56 65.5 Q60 68 64 65.5', D, 1.5) +
    `<path d="M48 68 Q60 76 72 68" fill="none" stroke="${D}" stroke-width="4"/><path d="M48 68 Q60 76 72 68" fill="none" stroke="#FFF3BF" stroke-width="2" stroke-dasharray="1 2.4" stroke-linecap="round"/>` +
    `<path d="M66 62 C70 60 72 64 69 66" fill="#8B5A3C"/>` +
    crown(60, 36, 1.05) + sparkle(30, 40, 4) + sparkle(90, 44, 4.5) + sparkle(86, 26, 2.6, '#fff') +
    `<g fill="#8B5A3C" stroke="${D}" stroke-width="1.4"><circle cx="28" cy="74" r="2.4"/><circle cx="94" cy="70" r="2"/><circle cx="34" cy="64" r="1.6"/></g>`,
  // ── Se fue ──
  'Portazo': () =>
    `<rect x="0" y="0" width="120" height="90" fill="#FFE8CC"/>` + L('M0 90 H120', D, 2.6) + `<rect x="0" y="90" width="120" height="40" fill="#E9C46A"/>` +
    R(36, 26, 40, 66, 2, '#343A40') + P('M36 26 L64 31 L64 86 L36 92Z', '#C97B45') +
    P('M40 34 L60 37 L60 54 L40 54Z', '#B4703F', 1.8) + P('M40 60 L60 59 L60 82 L40 86Z', '#B4703F', 1.8) + C(57, 60, 2.6, '#FCC419', 1.8) +
    L('M70 34 Q74 60 70 86 M76 40 Q80 60 76 80', D, 2.2) + L('M28 40 L22 36 M28 60 H20 M28 80 L22 84', D, 2.2) +
    card(86, 58, 28, .55, 'h', 'K') + card(88, 80, -18, .5, 's', 'Q') + card(28, 62, -24, .45, 'd', '7') +
    L('M82 64 Q90 62 98 66 M80 42 Q86 40 92 44', '#ADB5BD', 1.8) +
    t(76, 40, 10, '¡PUM!', '#E03131', 'transform="rotate(10 76 40)" stroke="#fff" stroke-width="3" paint-order="stroke"'),
  'Persiana baja': () => {
    let sl = '';
    for (let y = 50; y < 92; y += 4) sl += `M33 ${y} H87 `;
    let aw = '';
    for (let i = 0; i < 6; i++) aw += `<path d="M${30 + i * 10} 38 h10 v6 a5 5 0 0 1 -10 0Z" fill="${i % 2 ? '#fff' : '#E03131'}" stroke="${D}" stroke-width="2"/>`;
    return `<rect x="0" y="0" width="120" height="130" fill="#FFD8A8"/>` + `<g fill="#F4A261" opacity=".6"><rect x="22" y="56" width="6" height="3"/><rect x="92" y="70" width="6" height="3"/><rect x="24" y="80" width="5" height="3"/></g>` +
      R(32, 24, 56, 13, 2, '#2F9E44') + t(60, 34, 9, 'ALMACÉN', '#fff', 'textLength="40" lengthAdjust="spacingAndGlyphs"') +
      R(32, 46, 56, 50, 1, '#CED4DA') + L(sl, '#868E96', 1.4) + aw +
      R(30, 92, 60, 6, 2, '#868E96') + P('M57 87 V84 A3 3 0 0 1 63 84 V87', 'none', 1.8) + R(55, 87, 10, 8, 1.5, '#FCC419', 1.8) +
      L('M60 50 L48 60 M60 50 L72 60', D, 1.4) + dot(60, 50, 1.6) +
      g('rotate(-4 60 69)', R(44, 59, 32, 21, 3, '#fff') + heart(49.5, 64.5, 2.4, '#E03131', 1.2) + heart(70.5, 75, 2.4, '#E03131', 1.2) + t(60, 72.6, 7.4, 'CERRADO', '#E03131', 'textLength="25" lengthAdjust="spacingAndGlyphs"')) +
      t(80, 88, 7, 'z', D) + t(85, 83, 9, 'z', D) + t(91, 76, 11, 'z', D);
  },
  'El que apaga la luz': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#343A72"/><path d="M42 40 L18 96 H66Z" fill="#FFE066" opacity=".12"/>` +
    sparkle(90, 26, 2.6, '#FFE066') + sparkle(28, 26, 2, '#fff') +
    L('M42 0 V28', D, 2) + R(38, 26, 8, 6, 1.5, '#868E96', 1.8) + P('M34 40 C34 30 50 30 50 40 C50 46 46 48 46 52 H38 C38 48 34 46 34 40Z', '#FFF3BF') + R(38, 51, 8, 4, 1, '#ADB5BD', 1.6) +
    L('M38 39 Q40 41 42 39 M42 39 Q44 41 46 39', D, 1.3) + t(54, 34, 6, 'z', '#fff') + t(58, 28, 7.5, 'z', '#fff') +
    E(40, 86, 24, 7, '#8B5A3C') + P('M20 86 V96 M60 86 V96', 'none') + card(34, 84, -70, .45, 'h') + card(46, 84, 64, .45, 's') + crown(40, 76, .55) +
    R(70, 38, 20, 30, 4, '#F8F9FA') + R(76, 44, 8, 18, 2, '#DEE2E6', 1.8) + R(77.5, 53, 5, 7, 1.5, '#fff', 1.6) +
    P('M100 46 C94 46 88 46 84 48 C80 50 80 54 84 54 L92 53 C92 58 98 60 104 58Z', SK) + L('M88 50 H94', D, 1.2, 'opacity=".5"') +
    L('M76 60 L72 64 M84 64 L88 68', '#FFE066', 1.8),
  // ── Muerto olvidado ──
  'Muerto en el ropero': () =>
    P('M28 26 H90 V94 H28Z', '#B4703F') + P('M26 22 H92 L90 28 H28Z', '#8B5A3C') +
    R(31, 30, 28, 60, 2, '#C97B45') + R(35, 34, 20, 24, 2, '#B4703F', 1.6) + R(35, 62, 20, 24, 2, '#B4703F', 1.6) + C(55, 60, 1.8, '#FCC419', 1.6) +
    R(61, 30, 26, 60, 1, '#3B2314') + L('M62 38 H86', '#868E96', 2) + L('M68 38 L66 44 H74 Z', '#ADB5BD', 1.4) +
    L('M61 30 L69 38 M61 34 L66 30 M64 30 Q63 33 61 34', '#ADB5BD', .9) +
    cardBack(72, 80, 10, .75, '#4DABF7') + cardBack(76, 78, -4, .75, '#4DABF7') +
    g('translate(74 60) rotate(-8)', P('M-9 14 V-6 C-9 -14 9 -14 9 -6 V14 L6 11 L3 14 L0 11 L-3 14 L-6 11Z', '#fff', 2.2) + `<ellipse cx="-3" cy="-4" rx="1.6" ry="2.4" fill="${D}"/><ellipse cx="3" cy="-4" rx="1.6" ry="2.4" fill="${D}"/>` + `<ellipse cx="0" cy="3" rx="2" ry="2.6" fill="${D}"/>` + t(-5.8, 9, 5, 'A', '#E03131')) +
    P('M87 30 L96 24 V100 L87 90Z', '#C97B45') + C(91, 60, 1.6, '#FCC419', 1.4) +
    `<g fill="#ADB5BD" opacity=".7"><circle cx="40" cy="98" r="3"/><circle cx="46" cy="99" r="2"/><circle cx="82" cy="98" r="2.4"/></g>` + L('M30 96 H90', D, 2.6),
  'Velorio con sanguchitos': () => {
    const sand = (x: number, y: number, r: number) => g(`translate(${x} ${y}) rotate(${r})`, P('M-10 4 L10 4 L0 -10Z', '#FFF3D6', 2) + L('M-8.4 2 L8.4 2', '#FF8FA3', 1.8) + L('M-7 0 L7 0', '#8CE99A', 1.6) + L('M-5.6 -2 L5.6 -2', '#FFE066', 1.4));
    return E(80, 86, 18, 6, '#DEE2E6') + E(80, 85, 14, 4, '#F1F3F5', 1.4) + sand(74, 78, -6) + sand(86, 78, 8) + sand(80, 70, 0) +
      g('translate(44 60) rotate(-6)', P('M-8 -32 H8 L14 -18 L9 30 H-9 L-14 -18Z', '#E03131') + P('M-5 -28 H5 L9 -18 L5 26 H-5 L-9 -18Z', 'none', 1.4).replace('class="m-ol"', 'stroke="#fff" opacity=".7"') +
        `<g transform="translate(0 -4) scale(1.2)">${suit('s', 1.4).replace(`fill="${D}"`, 'fill="#fff"')}</g>` + L('M-3.6 12 L-1 14.6 M-1 12 L-3.6 14.6 M1 12 L3.6 14.6 M3.6 12 L1 14.6', '#fff', 1.4) + L('M-2 20 Q0 18.6 2 20', '#fff', 1.4)) +
      R(84, 36, 4, 22, 1, '#FFF3BF', 1.8) + `<path class="m-ol" style="stroke-width:1.8" d="M86 26 C89 30 90 32 88 34 C87 35 85 35 84 34 C82 32 84 30 86 26Z" fill="#FF922B"/>` + R(80, 56, 12, 4, 2, '#ADB5BD', 1.8) +
      L('M70 62 Q66 58 70 54 M90 62 Q94 58 90 54', '#ADB5BD', 1.6) +
      g('translate(26 88)', P('M-2 -12 C-6 -16 -10 -12 -8 -8 C-12 -8 -12 -2 -8 -2 C-8 2 -2 2 -2 -2 C2 0 4 -6 0 -8 C2 -12 0 -14 -2 -12Z', '#F783AC', 1.6) + dot(-5, -7, 2, '#FFD43B'));
  },
  'Fantasma del Colón': () => {
    const fan = Array.from({ length: 11 }, (_, i) => g(`rotate(${-50 + i * 10} 60 86)`, `<rect x="56" y="62" width="8" height="12" rx="1.4" fill="#fff" stroke="${D}" stroke-width="1.3"/><circle cx="60" cy="67" r="1.4" fill="${i % 2 ? D : '#E03131'}"/>`)).join('');
    return `<rect x="0" y="0" width="120" height="130" fill="#5C1A1B"/>` + `<circle cx="60" cy="40" r="26" fill="#FFE066" opacity=".12"/>` +
      P('M10 14 C34 18 40 40 30 62 C24 54 18 50 10 52Z', '#C92A2A') + P('M110 14 C86 18 80 40 90 62 C96 54 102 50 110 52Z', '#C92A2A') +
      L('M14 18 C28 22 32 36 28 52 M106 18 C92 22 88 36 92 52', '#A61E1E', 2) +
      P('M40 82 C38 68 40 48 44 38 C48 30 72 30 76 38 C80 48 82 68 80 82 C76 78 72 84 68 80 C64 84 58 84 54 80 C50 84 44 78 40 82Z', '#fff') +
      shine('M47 42 Q50 36 56 35', 2.2, .9) + `<ellipse cx="53" cy="50" rx="3" ry="4" fill="${D}"/><ellipse cx="67" cy="50" rx="3" ry="4" fill="${D}"/>` + dot(54, 48.6, 1, '#fff') + dot(68, 48.6, 1, '#fff') +
      `<ellipse cx="60" cy="60" rx="3.6" ry="4.4" fill="${D}"/>` + blush(47, 56, 2.4) + blush(73, 56, 2.4) +
      R(50, 18, 20, 16, 2, '#212529') + R(44, 32, 32, 4, 2, '#212529') + `<rect x="50" y="27" width="20" height="3" fill="#E03131"/>` +
      fan +
      P('M18 80 Q60 90 102 80 V110 H18Z', '#FCC419') + L('M18 80 Q60 90 102 80', '#C92A2A', 5) + L('M18 80 Q60 90 102 80', D, 1.2, 'transform="translate(0 2.6)"') +
      `<g fill="#E67700">${[30, 45, 60, 75, 90].map((x) => `<circle cx="${x}" cy="${x === 60 ? 93 : x === 45 || x === 75 ? 92 : 90}" r="3"/>`).join('')}</g>` + L('M24 98 Q60 106 96 98', '#E67700', 2) +
      sparkle(30, 30, 3, '#FFE066') + sparkle(92, 32, 3.5, '#FFE066');
  },

  // ═══════════════ CACHO ═══════════════
  // ── Último en pie ──
  'Vaso de cuero': () =>
    L('M22 90 H98', D, 2.6) + `<rect x="0" y="90" width="120" height="40" fill="#B4703F"/>` +
    g('translate(50 62)', P('M-16 -18 L-12 24 C-12 28 12 28 12 24 L16 -18Z', '#A0522D') + E(0, -18, 16, 5, '#3B2314') +
      die(-5, -24, 12, 5, '#FFF8E7', D, -14, 2.2) + die(6, -22, 11, 2, '#FFF8E7', D, 18, 2.2) +
      P('M-16 -18 A16 5 0 0 0 16 -18 L15.4 -12 A15.4 4.6 0 0 1 -15.4 -12Z', '#A0522D') +
      L('M-14.4 -6 H14.4 M-12.8 16 H12.8', '#FFE8CC', 1.2, 'stroke-dasharray="2 2"') + shine('M-9 -3 L-7.6 18', 2.2, .45) +
      P('M4 2 h7 v7 h-7z', '#8B4513', 1.4) + L('M4 2 l7 7 M11 2 l-7 7', '#FFE8CC', .8) + face(-3, 5, .85, 'happy')) +
    die(80, 82, 13, 6, '#FFF8E7', D, 12) + die(88, 70, 10, 1, '#FFF8E7', '#E03131', -10, 2.2) +
    L('M74 40 Q70 34 74 28 M82 44 Q78 38 82 32', '#ADB5BD', 2) + sparkle(30, 34, 3.5),
  'Dado cargado': u =>
    E(60, 92, 34, 7, '#E9C46A') + L('M30 86 Q34 90 30 94 M90 86 Q86 90 90 94', D, 1.8) +
    g('rotate(-6 58 60)', R(32, 34, 52, 52, 12, '#fff', 3) + shine('M40 40 H56', 3.4, .9) +
      dot(42, 44, 3.4) + dot(74, 76, 3.4) +
      `<defs><clipPath id="x${u}"><circle cx="58" cy="74" r="10"/></clipPath></defs><circle cx="58" cy="74" r="10" fill="#FFF3BF"/>` +
      `<g clip-path="url(#x${u})">${R(48, 72.5, 20, 3, 1.5, '#868E96', 1.4) + R(49, 67, 5, 14, 1.5, '#495057', 1.4) + R(62, 67, 5, 14, 1.5, '#495057', 1.4)}</g>` + C(58, 74, 10, 'none', 2.2) +
      face(58, 52, 1.15, 'sly')) +
    L('M28 76 L24 78 M30 84 L25 88 M88 74 L94 76', D, 2) + `<path d="M88 34 C90 38 92 40 92 42 A3 3 0 0 1 86 42 C86 40 87 38 88 34Z" fill="#74C0FC" stroke="${D}" stroke-width="1.6"/>` +
    t(88, 28, 7, 'kg', '#495057'),
  'Pirata del Pacífico': () =>
    P('M26 104 C26 84 40 76 58 76 C76 76 88 84 88 104Z', '#C92A2A') + L('M48 78 L58 92 L68 78', '#FCC419', 2) + dot(53, 86, 1.6, '#FCC419') + dot(63, 86, 1.6, '#FCC419') +
    C(58, 56, 16, SK) + P('M44 62 C44 76 52 80 58 80 C64 80 72 76 72 62 C68 66 62 66 58 64 C54 66 48 66 44 62Z', '#6B3E1F') +
    L('M44 48 L72 56', D, 1.8) + E(64, 54, 4, 3.6, D) + dot(51, 54, 1.8) + blush(48, 59) + L('M54 66 Q58 69 62 66', '#fff', 1.6) +
    P('M34 44 C38 30 78 30 82 44 C76 40 68 38 58 40 C48 38 40 40 34 44Z', '#212529') + P('M36 44 C44 40 72 40 80 44 L76 48 C68 44 48 44 40 48Z', '#343A40') + L('M38 44.5 C46 41 70 41 78 44.5', '#FCC419', 1.6) +
    g('translate(58 37) scale(.55)', `<rect x="-6" y="-6" width="12" height="12" rx="2.4" fill="#fff"/>` + dot(-2.6, -2.6, 1.3) + dot(2.6, 2.6, 1.3) + dot(0, 0, 1.3)) +
    g('translate(84 66)', P('M-6 8 C-10 0 -6 -10 2 -10 C8 -10 10 -4 8 0 C10 4 8 10 2 12Z', '#40C057') + P('M6 -6 L12 -4 L7 -1Z', '#FCC419', 1.6) + dot(3, -5, 1.4) + P('M-4 6 C-8 10 -6 16 -2 16 C0 12 0 10 -2 8Z', '#E03131', 1.6) + L('M0 12 L-2 18 M3 12 L2 18', D, 1.4)) +
    stick('M38 76 L30 56', SK, 6) + g('rotate(-20 30 42)', P('M20 28 L22 54 C22 57 38 57 38 54 L40 28Z', '#A0522D') + E(30, 28, 10, 3, '#6E3B1F', 2) + L('M21 40 H39', '#FFE8CC', 1.2, 'stroke-dasharray="2 2"')) +
    L('M18 34 L14 32 M18 44 L13 45 M42 22 L44 18', D, 2) + die(90, 30, 9, 5, '#FFF8E7', D, 20, 2) + die(96, 44, 7, 3, '#FFF8E7', D, -14, 1.8),
  // ── Calzador ──
  'Ojota': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#FFEC99"/><g fill="#F5C842"><circle cx="30" cy="40" r="1.2"/><circle cx="90" cy="84" r="1.2"/><circle cx="86" cy="30" r="1"/><circle cx="34" cy="86" r="1"/></g>` +
    g('rotate(-20 60 62)', P('M60 22 C72 22 76 34 74 48 C72 60 76 70 74 84 C72 96 48 96 46 84 C44 70 48 60 46 48 C44 34 48 22 60 22Z', '#4DABF7') +
      P('M60 26 C69 26 72 36 70 48 C68 60 72 70 70 82 C68 90 52 90 50 82 C48 70 52 60 50 48 C48 36 51 26 60 26Z', '#A5D8FF', 0).replace('class="m-ol" style="stroke-width:0"', '') +
      stick('M60 36 C54 44 50 50 47 56 M60 36 C66 44 70 50 73 56', '#FFD43B', 3.4) + C(60, 36, 2.6, '#FFD43B', 1.8)) +
    g('translate(64 72) rotate(10)', R(-12, -12, 24, 24, 5, '#fff') + shine('M-7 -8 H0', 2, .8) +
      P('M-10 -4 H-1 C-1 2 -10 2 -10 -4Z M1 -4 H10 C10 2 1 2 1 -4Z', '#212529', 1.4) + L('M-10 -4 H10', D, 1.6) + L('M-4 6 Q0 9 4 6', D, 1.6) + blush(-7, 4, 1.8) + blush(7, 4, 1.8)) +
    g('translate(90 30)', C(0, 0, 7, '#FF922B', 2) + rays(0, 0, 10, 14, 8, '#FF922B', 2)),
  'Mocasín de charol': () =>
    E(60, 90, 36, 4.4, D).replace('class="m-ol"', 'opacity=".18"') +
    R(24, 76, 16, 10, 2, '#5C1A1B') +
    P('M22 72 C21 60 28 54 36 57 C42 60 46 61 52 59 C64 55 84 60 96 70 C99 74 97 80 91 80 H26 C22 80 21 76 22 72Z', '#A61E3B') +
    P('M28 60 C32 54 46 55 50 59 C42 64 34 64 28 60Z', '#5C1A1B', 2) +
    P('M38 79 H95 C94 82 92 84 88 84 H40Z', '#E9C46A', 2) +
    P('M52 60 C58 56 68 56 74 60 L72 68 C64 64 58 64 54 68Z', '#7A1428', 2) +
    die(63, 62, 13, 5, '#FCC419', D, 0, 2.2) +
    shine('M30 64 Q36 58 44 59', 3, .85) + shine('M78 62 Q88 64 93 70', 2.6, .8) + shine('M34 73 H52', 2, .4) +
    sparkle(90, 50, 5, '#fff') + sparkle(30, 46, 3.5) + sparkle(76, 40, 3),
  'Bota de potro': () =>
    `<rect x="0" y="90" width="120" height="40" fill="#8CE99A"/>` + L('M0 90 H120', D, 2.4) + L('M28 90 l2 -6 l2 6 M92 90 l2 -5 l2 5 M74 92 l2 -4 l2 4', '#2F9E44', 1.6) +
    P('M38 24 H66 C66 40 64 54 66 66 C74 68 84 72 86 80 C86 86 80 88 74 88 H44 C38 88 36 84 36 78 C38 60 36 40 38 24Z', '#D9A066') +
    E(52, 24, 14, 3.6, '#B4703F') + L('M40 34 C48 36 58 36 66 34', '#8B5A3C', 2) + L('M39 38 L44 34 M47 38 L52 34 M55 38 L60 34 M63 38 L66 35', '#FFF3D6', 1.4) +
    shine('M42 44 C41 56 41 66 42 76', 2.6, .5) + L('M48 70 C56 72 66 72 72 74', '#B4703F', 1.6) +
    C(80, 85, 3.2, SK, 1.6) + C(85, 83, 3, SK, 1.6) + C(88.5, 79.5, 2.6, SK, 1.6) + C(75, 86, 3.2, SK, 1.6) +
    L('M36 74 L26 76', '#ADB5BD', 3.4) + L('M36 74 L26 76', D, 1.2) + `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(23, 76.5, 7, 2.6, 6)}" fill="#DEE2E6"/>` + dot(23, 76.5, 1.4) +
    die(88, 52, 15, 6, '#fff', D, 14) + sparkle(28, 40, 4) + sparkle(84, 30, 3),
  // ── Desconfiado ──
  'Nariz de sabueso': () =>
    L('M22 90 H98', D, 2.6) + `<rect x="0" y="90" width="120" height="40" fill="#2B8A3E"/>` +
    cup(80, 72, 1.05) + t(96, 44, 12, '?', '#E03131') +
    P('M10 40 C20 28 40 30 48 40 C54 46 56 50 64 52 C70 54 70 64 62 66 C52 68 44 68 34 70 C22 74 10 70 10 60Z', '#C97B45') +
    P('M18 40 C10 46 10 66 18 76 C24 72 26 56 26 46Z', '#8B5A3C') +
    E(66, 58, 6, 4.6, '#212529') + shine('M64 55.6 Q66 54.4 68 55.4', 1.4, .8) +
    dot(40, 46, 2.2) + L('M35 41 L44 44', D, 2.2) + L('M44 63 Q52 64 58 62', D, 1.6) + blush(46, 54, 2.2) +
    L('M76 52 Q72 50 72 46 M73 60 Q70 58 70 54', D, 1.5, 'stroke-dasharray="1.5 2.5"') +
    `<g fill="${D}" opacity=".6"><circle cx="50" cy="56" r=".9"/><circle cx="54" cy="58" r=".9"/><circle cx="52" cy="60" r=".9"/></g>`,
  'Perro policía': () =>
    `<rect x="0" y="80" width="120" height="50" fill="#495057"/>` + R(18, 80, 84, 10, 5, '#868E96') + L('M30 85 H90', '#ADB5BD', 1.4, 'stroke-dasharray="4 4"') +
    cup(30, 72, .62, '#A0522D') + cup(90, 72, .62, '#8B4513') +
    P('M32 46 C24 50 24 68 30 72 C36 68 38 56 38 50Z', '#8B5A3C') + P('M88 46 C96 50 96 68 90 72 C84 68 82 56 82 50Z', '#8B5A3C') +
    P('M38 52 C38 38 82 38 82 52 C82 68 74 78 60 78 C46 78 38 68 38 52Z', '#E8A54B') + P('M50 60 C50 54 70 54 70 60 C70 70 66 76 60 76 C54 76 50 70 50 60Z', '#FFE8CC', 2) +
    E(60, 61, 5, 3.6, '#212529') + L('M60 64.6 V68 M56 69 Q60 72 64 69', D, 1.6) + dot(51, 52, 2) + dot(69, 52, 2) + L('M47 48 L54 50 M73 48 L66 50', D, 2) +
    P('M36 42 C38 24 82 24 84 42 Z', '#1C3D7A') + P('M34 42 H86 C86 46 78 48 60 48 C42 48 34 46 34 42Z', '#212529') + star(60, 34, 5, '#FCC419', 1.6) +
    `<rect x="44" y="40" width="32" height="2" fill="#FCC419"/>` + L('M28 64 Q24 60 26 56', D, 1.6) +
    die(70, 88, 8, 3, '#fff', D, 20, 1.8),
  'Comisario de pueblo': () =>
    R(18, 84, 84, 20, 2, '#B4703F') + L('M18 88 H102', '#8B5A3C', 1.6) +
    P('M30 104 C30 82 42 72 60 72 C78 72 90 82 90 104Z', '#364FC7') + L('M60 74 V104', D, 1.8) + dot(64, 84, 1.6, '#FCC419') + dot(64, 94, 1.6, '#FCC419') +
    star(46, 86, 6.5, '#FCC419', 1.8) +
    C(60, 52, 15, SK) + P('M47 58 C50 52 58 54 60 57 C62 54 70 52 73 58 C70 62 64 60 60 59 C56 60 50 62 47 58Z', '#5C3D2E') +
    face(60, 52, 1.05, 'angry', false) + L('M56 65 Q60 63 64 65', D, 1.5) +
    P('M44 42 C44 28 76 28 76 42Z', '#1C3D7A') + P('M42 42 H78 L82 46 C70 44 50 44 38 46Z', '#212529') + R(56, 33, 8, 6, 1.5, '#FCC419', 1.6) +
    die(82, 79, 11, 6, '#fff', D, -8, 2.2) + stick('M72 86 C78 82 80 76 82 72', '#364FC7', 6) + C(82, 68, 6.5, SK) + L('M79 66 H85 M79 69 H85', D, 1.1, 'opacity=".5"') +
    L('M72 80 L67 78 M92 80 L97 78 M72 86 L67 88 M92 86 L97 88', D, 2) + L('M78 58 L77 52 M86 58 L87 52', '#E03131', 2) +
    die(26, 72, 8, 2, '#fff', D, -20, 1.8),

  // ═══════════════ SPLENDOR ═══════════════
  // ── Alta sociedad ──
  'Te tomaste el té': () =>
    E(56, 82, 30, 7, '#fff') + E(56, 81, 20, 4, '#F1F3F5', 1.4) + L('M28 84 Q56 92 84 84', '#FCC419', 1.6) +
    P('M76 52 C90 50 90 70 74 70', 'none', 6).replace('fill="none"', 'fill="none"') + L('M76 52 C88 50 88 68 74 70', '#fff', 3) +
    P('M34 46 H78 C78 66 70 80 56 80 C42 80 34 66 34 46Z', '#fff') + E(56, 46, 22, 5, '#C08552') + L('M38 46 Q56 52 74 46', '#DDA15E', 1.6) +
    L('M38 58 Q56 64 74 58', '#4DABF7', 2.2) + `<g fill="#4DABF7"><circle cx="44" cy="66" r="2"/><circle cx="56" cy="68" r="2"/><circle cx="68" cy="66" r="2"/></g>` + shine('M40 54 Q41 64 46 72', 2.2, .7) +
    gem(56, 60, .55, '#E03131') +
    P('M86 60 C82 56 84 50 90 52 L92 48 C93 44 98 46 96 50 L94 58 C94 64 90 64 86 60Z', SK) + stick('M93 50 L99 32', SK, 3) + sparkle(100, 26, 2.6, '#fff') +
    crown(34, 78, .55) + steam(52, 34, .7) + steam(64, 28, .55) + sparkle(28, 40, 3.5),
  'Palco en el Colón': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#7B1E2B"/>` + P('M10 12 Q36 34 60 18 Q84 34 110 12 V8 H10Z', '#C92A2A') + L('M10 14 Q36 36 60 20 Q84 36 110 14', '#FCC419', 2.4) +
    `<g fill="#FCC419">${[22, 34, 46, 74, 86, 98].map((x) => `<circle cx="${x}" cy="${x < 60 ? 22 + (x - 22) / 4 : 22 + (98 - x) / 4}" r="1.6"/>`).join('')}</g>` +
    P('M14 20 C26 30 30 54 22 80 L12 80Z', '#A61E1E') + P('M106 20 C94 30 90 54 98 80 L108 80Z', '#A61E1E') +
    `<circle cx="60" cy="44" r="20" fill="#FFE066" opacity=".15"/>` +
    P('M16 70 Q60 80 104 70 V110 H16Z', '#FCC419') + P('M16 66 Q60 76 104 66 L104 72 Q60 82 16 72Z', '#C92A2A') +
    `<g fill="#E67700">${[28, 44, 60, 76, 92].map((x) => `<rect x="${x - 2}" y="84" width="4" height="12" rx="2"/>`).join('')}</g>` +
    g('translate(54 56) rotate(-10)', stick('M8 6 L22 18', '#FCC419', 2.6) + C(-7, 0, 7.4, '#74C0FC') + C(7, 0, 7.4, '#74C0FC') + R(-3, -4, 6, 6, 1.5, '#FCC419', 1.8) +
      shine('M-10 -2 Q-9 -5 -6 -5.6 M4 -2 Q5 -5 8 -5.6', 1.6, .9)) +
    gem(86, 64, .6, '#40C057') + sparkle(32, 40, 3.5, '#FFE066') + sparkle(84, 36, 4, '#FFE066') + sparkle(60, 26, 2.6, '#fff'),
  'Tomando mate con la reina': () =>
    P('M26 104 C26 84 38 76 54 76 C70 76 82 84 82 104Z', '#7048E8') + P('M44 76 L54 92 L64 76', '#fff', 2) +
    `<g fill="#fff" stroke="${D}" stroke-width="1">${[40, 46, 52, 58, 64].map((x, i) => `<circle cx="${x + 2}" cy="${80 + (i === 2 ? 3 : i % 4 ? 2 : 0)}" r="2.2"/>`).join('')}</g>` +
    C(52, 54, 15, SK2) + `<g fill="#E9ECEF" stroke="${D}" stroke-width="2"><circle cx="38" cy="50" r="6"/><circle cx="66" cy="50" r="6"/><circle cx="40" cy="42" r="6"/><circle cx="64" cy="42" r="6"/><circle cx="52" cy="40" r="7"/></g>` +
    face(52, 56, .95, 'calm') +
    g('translate(52 31) scale(1.25)', P('M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z', '#FFD43B', 1.9) + dot(0, 1.5, 2, '#E03131') + dot(-6, 2, 1.4, '#40C057') + dot(6, 2, 1.4, '#339AF0') + dot(0, -9, 1.6, '#fff')) +
    stick('M70 90 L76 82', SK2, 5) + mate(80, 72, .95, '#5F3DC4') + gem(76, 74, .38, '#E03131') + gem(85, 76, .38, '#40C057') + gem(80, 81, .36, '#339AF0') +
    L('M60 62 L90 45', '#CED4DA', 0) + sparkle(30, 30, 4) + sparkle(92, 36, 3.5) + sparkle(96, 60, 2.6, '#fff'),
  // ── Joyero ──
  'Anillo de lata': () =>
    P('M46 104 V46 C46 34 74 34 74 46 V104Z', SK) + P('M51 42 C51 36 69 36 69 42 V52 C69 56 51 56 51 52Z', '#FFE3E3', 2) + shine('M55 41 Q60 39 64 41', 1.6, .8) +
    `<rect x="46" y="58" width="28" height="22" fill="#94D82D" opacity=".55"/>` + L('M50 92 H58 M62 96 H70', D, 1.4, 'opacity=".35"') +
    R(44, 64, 32, 9, 4, '#ADB5BD') + L('M48 66.5 H70', '#fff', 1.6, 'opacity=".7"') + P('M54 64 L56 58 H64 L66 64Z', '#868E96', 2) +
    gem(60, 52, .85, '#F06595') + `<circle cx="78" cy="88" r="1" fill="none"/>` +
    L('M36 64 Q32 60 36 56 M84 64 Q88 60 84 56', '#82C91E', 2) +
    g('translate(88 38) rotate(16)', R(-9, -6, 18, 12, 2, '#FFF3BF', 1.8) + C(-6, 0, 1.4, '#fff', 1.2) + t(2, 4, 8, '$5', '#E03131')) + L('M80 43 L76 52', D, 1) +
    sparkle(32, 44, 3, '#fff'),
  'Joyería de la calle Libertad': () => {
    let aw = '';
    for (let i = 0; i < 7; i++) aw += `<path d="M${25 + i * 10} 34 h10 v7 a5 5 0 0 1 -10 0Z" fill="${i % 2 ? '#fff' : '#1C3D7A'}" stroke="${D}" stroke-width="2"/>`;
    return `<rect x="0" y="0" width="120" height="130" fill="#E9ECEF"/>` + `<path d="M0 98 H120" stroke="${D}" stroke-width="2"/>` +
      R(24, 22, 72, 12, 2, '#212529') + t(60, 31.6, 8.4, 'JOYERÍA', '#FCC419', 'textLength="36" lengthAdjust="spacingAndGlyphs"') + aw +
      R(26, 46, 68, 48, 3, '#C5F6FA') + P('M30 94 L44 68 H76 L90 94Z', '#5F3DC4', 2) + shine('M30 52 L40 62 M34 50 L44 60', 2, .7) +
      gem(48, 62, .75, '#E03131') + gem(60, 58, .9, '#E7F5FF') + gem(72, 62, .75, '#40C057') +
      E(46, 82, 7, 5, 'none', 3) + E(46, 82, 7, 5, 'none', 0).replace('class="m-ol" style="stroke-width:0"', 'stroke="#FCC419" stroke-width="1.6"') + gem(46, 76, .4, '#339AF0') +
      L('M64 76 Q72 90 80 76', '#FCC419', 2.4) + dot(72, 83, 2.2, '#F06595') +
      sparkle(36, 54, 3, '#fff') + sparkle(84, 52, 3.6, '#fff') + sparkle(90, 84, 2.6);
  },
  'Diamante en bruto': () =>
    rays(58, 60, 30, 42, 16, '#FFE066', 3) +
    P('M26 84 C22 70 30 58 40 56 C44 46 58 42 66 48 C76 44 90 54 88 66 C96 72 92 86 84 88 H32 C28 88 27 86 26 84Z', '#868E96') +
    P('M32 86 C34 80 40 78 44 82 M70 84 C74 80 80 80 82 84', '#868E96', 2) + L('M36 70 L40 74 M76 72 L80 70', D, 1.6) +
    P('M48 60 L56 46 L68 50 L72 64 L60 76 L46 70Z', '#99E9F2') + P('M56 46 L60 60 L68 50 M60 60 L72 64 M60 60 L60 76 M60 60 L46 70 M60 60 L48 60', 'none', 1.4) +
    P('M56 46 L60 60 L48 60Z', '#E3FAFC', 0).replace('class="m-ol" style="stroke-width:0"', '') + P('M60 60 L72 64 L60 76Z', '#66D9E8', 0).replace('class="m-ol" style="stroke-width:0"', '') +
    P('M48 60 L56 46 L68 50 L72 64 L60 76 L46 70Z', 'none') +
    P('M78 60 L84 54 L88 62 L82 66Z', '#99E9F2', 2) + P('M34 68 L38 62 L42 68 L38 72Z', '#99E9F2', 2) +
    stick('M80 96 L92 70', '#8B5A3C', 3) + P('M78 66 C86 62 96 64 100 70 C94 70 90 70 84 74Z', '#ADB5BD', 2.2) +
    sparkle(58, 24, 5, '#fff') + sparkle(28, 46, 3.5, '#fff') + sparkle(90, 40, 4),
  // ── Gran inversión ──
  'Plazo fijo': () =>
    g('translate(82 34) rotate(8)', R(-13, -12, 26, 26, 3, '#fff') + `<rect x="-13" y="-12" width="26" height="8" rx="3" fill="#E03131"/>` + P('M-13 -4 H13', 'none', 2) + t(0, 10, 13, '30', D) + L('M-7 -15 V-9 M7 -15 V-9', D, 2.4)) +
    E(54, 70, 26, 19, '#FFA8C5') + P('M28 66 C22 64 22 74 28 74', '#FF8FAB', 2) + E(29, 69, 3.4, 4.6, '#FF8FAB', 2) + dot(28.4, 67.6, .9) + dot(28.4, 70.6, .9) +
    P('M40 54 L38 44 L48 50Z', '#FF8FAB', 2) + dot(38, 62, 2) + L('M35 58 L40 59', D, 1.4) + blush(36, 68) + L('M33 75 Q36 77 39 75', D, 1.4) +
    `<g fill="#FF8FAB" stroke="${D}" stroke-width="2.2"><rect x="38" y="84" width="7" height="9" rx="2"/><rect x="62" y="84" width="7" height="9" rx="2"/></g>` + L('M80 64 C86 62 86 70 82 70', D, 1.8) +
    R(50, 51, 14, 3, 1.5, D, 1) + gem(57, 44, .6, '#40C057') + shine('M46 60 Q56 55 66 58', 2.4, .6) +
    P('M62 76 V72 A4 4 0 0 1 70 72 V76', 'none', 2) + R(59, 75, 14, 11, 2, '#FCC419', 2) + dot(66, 80, 1.3) + L('M66 80 V83', D, 1.3) +
    sparkle(30, 40, 3.5) + sparkle(94, 64, 3, '#fff'),
  'Lingote de oro': () =>
    E(60, 88, 34, 5, D).replace('class="m-ol"', 'opacity=".15"') +
    g('translate(-4 14)', P('M28 60 L38 48 H82 L92 60Z', '#FFE066') + P('M28 60 H92 V72 H28Z', '#F59F00')) +
    P('M30 52 L42 34 H78 L90 52Z', '#FFE066') + P('M30 52 H90 L86 70 H34Z', '#FCC419') + P('M90 52 L78 34', 'none') +
    L('M44 38 H70', '#fff', 2.4, 'opacity=".8"') + face(60, 60, .9, 'happy') +
    g('translate(60 43) scale(.7)', `<path d="M-9 -3 L-5 -9 H5 L9 -3 L0 10Z" fill="none" stroke="#E67700" stroke-width="2.2" stroke-linejoin="round"/><path d="M-9 -3 H9" stroke="#E67700" stroke-width="1.6"/>`) +
    sparkle(30, 32, 5, '#fff') + sparkle(90, 30, 4) + sparkle(94, 72, 3, '#fff') + sparkle(48, 22, 2.6),
  'Caja fuerte': () =>
    `<g fill="${D}"><rect x="32" y="88" width="10" height="8" rx="2"/><rect x="78" y="88" width="10" height="8" rx="2"/></g>` +
    R(26, 26, 68, 64, 6, '#5C7080') + R(30, 30, 56, 56, 4, '#212529') +
    L('M30 58 H62', '#495057', 2) + R(34, 48, 22, 8, 1.5, '#FCC419', 1.8) + R(38, 42, 16, 6, 1.5, '#FFE066', 1.8) +
    coin(56, 80, 5.4) + gem(38, 78, .75, '#E03131', -12) + gem(48, 76, .7, '#40C057', 10) + gem(42, 66, .6, '#339AF0', 6) + gem(54, 68, .55, '#E7F5FF', -8) +
    P('M62 30 L92 24 V92 L62 86Z', '#868E96') + L('M67 36 L87 32 M67 80 L87 84', '#ADB5BD', 1.4) +
    C(77, 57, 11, '#CED4DA') + C(77, 57, 7.4, '#ADB5BD', 2) + L('M77 47 V50 M86.6 57 H84 M77 67 V64 M67.4 57 H70', D, 1.6) + L('M77 57 L80.6 52', D, 2.4) + dot(77, 57, 2) +
    `<g fill="#ADB5BD" stroke="${D}" stroke-width="1.4"><circle cx="66" cy="34" r="1.6"/><circle cx="88" cy="30" r="1.6"/><circle cx="66" cy="82" r="1.6"/><circle cx="88" cy="86" r="1.6"/></g>` +
    R(59, 42, 5, 6, 1, '#495057', 1.6) + R(59, 66, 5, 6, 1, '#495057', 1.6) +
    gem(46, 94, .6, '#E7F5FF', -10) + gem(60, 96, .55, '#E03131', 20) + coin(36, 92, 4.6) +
    shine('M30 34 V60', 2.4, .35) + sparkle(30, 22, 3.5, '#fff') + sparkle(96, 28, 4.5),

  // ═══════════════ THE MIND ═══════════════
  // ── Conexión mental ──
  'Meditación': () =>
    `<circle cx="60" cy="56" r="30" fill="#E5DBFF"/><circle cx="60" cy="56" r="36" fill="none" stroke="#D0BFFF" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>` +
    E(60, 90, 32, 6, '#B197FC') +
    P('M30 88 C28 78 40 74 60 76 C80 74 92 78 90 88 C80 92 40 92 30 88Z', '#5C7CFA') + L('M44 84 Q60 80 76 84', '#4263EB', 2) +
    P('M44 78 C42 62 48 54 60 54 C72 54 78 62 76 78Z', '#748FFC') +
    stick('M47 62 C42 70 46 76 54 74', SK, 4.4) + stick('M73 62 C78 70 74 76 66 74', SK, 4.4) +
    ncard(60, 70, 0, .62, '42') +
    C(60, 42, 13, SK) + P('M47 40 C47 26 73 26 73 40 C68 34 62 34 60 36 C58 34 52 34 47 40Z', '#5C3D2E') + face(60, 44, .95, 'calm') +
    L('M30 40 Q26 36 30 32 M90 40 Q94 36 90 32', '#9775FA', 2) + sparkle(84, 24, 3, '#fff'),
  'Levitando': () => {
    const orbit = (a: number, n: string, c: string) => { const r = a * Math.PI / 180; return ncard(f(60 + 33 * Math.cos(r)), f(54 + 12 * Math.sin(r)), f(a / 8), .42, n, c); };
    return R(40, 86, 40, 6, 2, '#C97B45') + L('M44 92 V102 M76 92 V102', D, 3) + `<ellipse cx="60" cy="84" rx="18" ry="3" fill="${D}" opacity=".2"/>` +
      L('M48 76 Q44 80 48 82 M72 76 Q76 80 72 82', '#9775FA', 1.6, 'stroke-dasharray="1.5 2.5"') +
      orbit(200, '7', '#7048E8') + orbit(250, '23', '#E64980') + orbit(290, '58', '#1C7ED6') + orbit(340, '81', '#7048E8') +
      P('M38 72 C36 64 46 62 60 63 C74 62 84 64 82 72 C72 76 48 76 38 72Z', '#5C7CFA') +
      P('M46 66 C44 52 50 44 60 44 C70 44 76 52 74 66Z', '#748FFC') + stick('M48 52 C42 58 42 66 48 68', SK, 4) + stick('M72 52 C78 58 78 66 72 68', SK, 4) +
      C(60, 33, 11, SK) + P('M49 31 C49 20 71 20 71 31 C66 26 62 26 60 28 C58 26 54 26 49 31Z', '#5C3D2E') + face(60, 35, .82, 'calm') +
      orbit(20, '96', '#E64980') + orbit(70, '35', '#1C7ED6') + orbit(120, '12', '#7048E8') +
      g('translate(86 74) rotate(20) scale(.85)', P('M0 -10 L8 8 C3 10 -3 10 -8 8Z', '#FFD43B', 2) + dot(-2, 1, 1.6, '#E03131') + dot(2, 5, 1.6, '#E03131') + dot(1, -3, 1.2, '#E03131'));
  },
  'Mente maestra': () =>
    rays(60, 50, 26, 40, 12, '#FFE066', 3) +
    [['1', -48, '#7048E8'], ['14', -24, '#1C7ED6'], ['37', 0, '#E64980'], ['62', 24, '#1C7ED6'], ['99', 48, '#7048E8']].map(([n, a, c]) => g(`rotate(${a} 60 110)`, ncard(60, 84, 0, .52, n as string, c as string))).join('') +
    P('M38 56 C30 54 30 40 38 38 C38 28 50 26 54 30 C58 24 68 26 70 30 C78 28 88 34 84 42 C92 46 88 58 80 58 C78 64 66 66 60 62 C54 66 42 64 38 56Z', '#FFA8C5') +
    L('M60 32 V60 M44 40 Q50 44 46 50 M74 38 Q68 44 74 50 M52 54 Q56 50 54 46 M66 54 Q64 50 68 46', '#E64980', 1.8) +
    face(60, 50, .8, 'happy') + crown(60, 24, 1) +
    sparkle(30, 30, 4, '#fff') + sparkle(90, 28, 4) +
    g('translate(90 64)', C(0, 0, 6, '#E03131', 2) + `<polygon points="${starPts(0, 0, 3.6, 1.6, 8)}" fill="#FFA8A8"/>`),
  // ── Uno solo ──
  'Cerebro compartido': () =>
    `<path d="M40 54 Q42 40 50 38 M80 54 Q78 40 70 38" fill="none" stroke="#FFE066" stroke-width="7" stroke-linecap="round" opacity=".6"/>` +
    L('M40 54 Q42 40 50 38 M80 54 Q78 40 70 38', '#FCC419', 2.4, 'stroke-dasharray="3 3"') +
    P('M46 40 C40 38 40 28 46 27 C46 20 54 18 58 22 C62 18 70 20 72 26 C78 26 80 36 74 40 C72 44 64 44 60 42 C56 44 48 44 46 40Z', '#FFA8C5') +
    L('M60 24 V41 M50 28 Q54 32 50 36 M70 28 Q66 32 70 36', '#E64980', 1.6) + sparkle(36, 26, 3) + sparkle(84, 26, 3) +
    P('M18 104 C18 86 26 80 36 80 C46 80 52 86 54 104Z', '#4DABF7') + P('M102 104 C102 86 94 80 84 80 C74 80 68 86 66 104Z', '#FF922B') +
    C(36, 64, 14, SK) + P('M22 62 C22 48 46 46 50 58 C44 54 36 54 30 56 C26 58 24 62 22 62Z', '#212529') + face(38, 67, .85, 'calm') +
    C(84, 64, 14, SK3) + P('M98 62 C98 48 74 46 70 58 C76 54 84 54 90 56 C94 58 96 62 98 62Z', '#E8590C') + face(82, 67, .85, 'calm') +
    heart(60, 66, 4, '#FF6B6B', 1.6) + ncard(60, 88, 0, .5, '50'),
  'Gurú': () =>
    `<circle cx="54" cy="58" r="30" fill="#FFF3BF"/>` +
    P('M26 104 C26 84 38 78 54 78 C70 78 82 84 82 104Z', '#FF922B') + L('M38 86 Q54 92 70 86', '#E8590C', 2) +
    C(54, 54, 15, SK3) + P('M40 58 C40 82 50 92 54 94 C58 92 68 82 68 58 C64 64 58 64 54 62 C50 64 44 64 40 58Z', '#fff') +
    L('M46 70 Q48 80 52 86 M60 72 Q60 80 58 86', '#DEE2E6', 1.6) +
    L('M48 61 C50 59 52 60 54 61 C56 60 58 59 60 61', D, 1.6) + face(54, 52, .9, 'calm', false) + blush(46, 56, 2) + blush(62, 56, 2) +
    P('M38 46 C36 30 72 30 70 46 C64 40 44 40 38 46Z', '#E03131') + gem(54, 40, .4, '#339AF0') +
    stick('M82 92 L80 72', '#8B5A3C', 2) + dot(80, 72, 2.4, '#FF6B6B') + E(81, 92, 7, 2.4, '#ADB5BD', 1.8) +
    L('M80 70 C74 64 86 58 80 52 C74 46 86 42 82 34', '#ADB5BD', 2.4) +
    t(89, 64, 9, '1', '#7048E8') + t(73, 50, 9, '2', '#7048E8') + t(88, 42, 9, '3', '#7048E8') + t(76, 32, 8, '4', '#9775FA') +
    sparkle(30, 34, 3.5),
  'Nirvana': () =>
    rays(60, 56, 22, 42, 18, '#FFE066', 3) + `<circle cx="60" cy="56" r="26" fill="#FFF3BF" opacity=".8"/>` +
    L('M24 92 Q34 88 44 92 M76 92 Q86 88 96 92', '#4DABF7', 2.2) +
    E(60, 86, 26, 5, '#51CF66') +
    P('M60 86 C44 86 30 80 26 70 C38 68 50 74 60 86Z', '#F783AC') + P('M60 86 C76 86 90 80 94 70 C82 68 70 74 60 86Z', '#F783AC') +
    P('M60 86 C48 82 38 70 40 58 C50 60 58 72 60 86Z', '#FAA2C1') + P('M60 86 C72 82 82 70 80 58 C70 60 62 72 60 86Z', '#FAA2C1') +
    P('M60 86 C52 78 50 62 60 52 C70 62 68 78 60 86Z', '#FCC2D7') + shine('M58 60 Q56 68 58 76', 1.8, .7) +
    g('translate(60 40) rotate(15)', `<polygon class="m-ol" points="${starPts(0, 0, 14, 4.2, 4)}" fill="#CED4DA"/><polygon points="${starPts(0, 0, 9, 2.6, 4)}" fill="#F1F3F5"/>` + C(0, 0, 3, '#868E96', 1.8)) +
    sparkle(28, 40, 4, '#fff') + sparkle(92, 42, 4.5) + sparkle(84, 22, 3, '#fff'),

  // ═══════════════ PANDEMIC ═══════════════
  // ── Salvadores del mundo ──
  'Lavandina': u =>
    `<ellipse cx="60" cy="94" rx="36" ry="5" fill="#A5D8FF" opacity=".6"/>` +
    stick('M26 30 L40 90', '#C97B45', 3) + P('M34 88 C30 92 30 98 36 98 L50 96 C52 92 48 88 44 86Z', '#E9ECEF', 2.2) + L('M38 90 L37 97 M42 89 L42 96 M46 88 L47 95', '#ADB5BD', 1.4) +
    P('M44 46 C44 40 50 38 54 38 H66 C70 38 72 42 72 46 V88 C72 92 44 92 44 88Z', '#fff') + P('M56 38 C52 30 64 30 64 38', 'none', 2) +
    R(55, 26, 10, 8, 2, '#4DABF7') + P('M66 44 C76 44 78 60 70 62', 'none', 2.4) +
    R(47, 56, 22, 22, 3, '#4DABF7', 2) + `<path d="M58 60 C61 64 63 66 63 69 A5 5 0 0 1 53 69 C53 66 55 64 58 60Z" fill="#fff"/>` + shine('M48 46 V54', 2, .6) +
    face(58, 46, .7, 'happy') +
    `<defs><clipPath id="gl${u}"><circle cx="86" cy="66" r="12"/></clipPath></defs>` + `<circle cx="86" cy="66" r="12" fill="#4DABF7"/>` +
    `<g clip-path="url(#gl${u})" fill="#51CF66" stroke="${D}" stroke-width="1.2"><path d="M76 58 C80 54 86 56 86 60 C84 64 80 62 78 66 C76 64 74 60 76 58Z"/><path d="M88 68 C92 64 98 66 98 72 C94 78 90 76 88 72Z"/><path d="M80 72 C82 74 82 78 80 80 C78 78 78 74 80 72Z"/></g>` + C(86, 66, 12, 'none') +
    sparkle(98, 50, 4, '#fff') + sparkle(76, 46, 3) + sparkle(30, 70, 3.5, '#fff') + sparkle(94, 86, 2.6),
  'Guardapolvo blanco': u =>
    L('M60 22 C60 16 66 16 66 20', D, 2.2) + L('M30 34 L60 24 L90 34', '#8B5A3C', 3.6) +
    P('M38 32 L50 28 L60 40 L70 28 L82 32 C90 36 92 46 92 56 L94 98 H26 L28 56 C28 46 30 36 38 32Z', '#fff') +
    P('M50 28 L56 52 L60 40Z', '#F1F3F5', 2) + P('M70 28 L64 52 L60 40Z', '#F1F3F5', 2) + L('M60 40 V98', D, 2) +
    `<g fill="#DEE2E6" stroke="${D}" stroke-width="1.4"><circle cx="64" cy="60" r="1.8"/><circle cx="64" cy="72" r="1.8"/><circle cx="64" cy="84" r="1.8"/></g>` +
    R(70, 70, 14, 10, 1.5, '#F8F9FA', 1.8) + L('M73 70 V62 M77 70 V64', '#4DABF7', 2.2) + L('M80 70 V63', '#E03131', 2.2) +
    `<path d="M46 32 C40 46 42 60 48 66" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/><path d="M74 32 C80 46 78 58 74 62" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M46 32 C40 46 42 60 48 66 M74 32 C80 46 78 58 74 62" fill="none" stroke="#4DABF7" stroke-width="2.6" stroke-linecap="round"/>` + C(48, 69, 4.2, '#CED4DA', 2) + C(48, 69, 1.8, '#868E96', 1) +
    `<defs><clipPath id="pn${u}"><circle cx="40" cy="80" r="7"/></clipPath></defs><circle cx="40" cy="80" r="7" fill="#4DABF7"/><g clip-path="url(#pn${u})" fill="#51CF66"><path d="M33 76 C36 74 40 76 39 79 C37 81 34 80 33 76Z"/><path d="M41 82 C44 80 47 82 47 86 L41 86Z"/></g>` + C(40, 80, 7, 'none', 2) +
    sparkle(26, 26, 3.5) + sparkle(96, 28, 3, '#fff'),
  'Doctor House': () =>
    P('M26 104 C26 86 38 78 54 78 C70 78 82 86 82 104Z', '#495057') + P('M46 80 L54 96 L62 80', '#74C0FC', 2) +
    C(54, 56, 15, SK) + `<g fill="${D}" opacity=".35">${[[46, 64], [50, 66], [54, 67], [58, 66], [62, 64], [48, 62], [60, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8"/>`).join('')}</g>` +
    P('M38 54 C36 38 50 36 54 40 C58 36 72 38 70 54 C66 46 62 46 60 44 C56 48 46 46 38 54Z', '#868E96') +
    face(54, 56, .95, 'grump', false) + L('M45 52 L50 51 M58 51 L63 52', D, 1.6) +
    stick('M30 104 L36 60', '#5C3D2E', 3) + L('M30 60 C30 54 40 54 40 60', D, 6) + L('M30 60 C30 54 40 54 40 60', '#5C3D2E', 3) +
    stick('M78 90 L84 76', '#495057', 6) + stick('M88 68 L94 58', '#5C3D2E', 4) +
    pcube(80, 46, 8, BLUE) + C(82, 48, 13, '#E7F5FF') + `<circle cx="82" cy="48" r="13" fill="#E7F5FF"/>` + pcube(82, 47, 8.4, BLUE) + `<circle cx="82" cy="48" r="13" fill="#74C0FC" fill-opacity=".2"/>` +
    `<circle cx="82" cy="48" r="13" fill="none" stroke="${D}" stroke-width="6.6"/><circle cx="82" cy="48" r="13" fill="none" stroke="#CED4DA" stroke-width="3.2"/>` + shine('M74 42 Q76 37 81 36', 2.2, .9) +
    t(30, 34, 10, '?', '#E03131') + t(40, 26, 8, '?', '#E03131'),
  // ── Laboratorio de vacunas ──
  'Probeta': () =>
    R(26, 90, 68, 6, 2, '#868E96') +
    P('M50 26 H70 V44 L88 82 C90 88 86 92 80 92 H40 C34 92 30 88 32 82 L50 44Z', '#E7F5FF') +
    P('M42 62 H78 L88 82 C90 88 86 92 80 92 H40 C34 92 30 88 32 82Z', '#69DB7C') + L('M42 62 Q50 58 60 62 T78 62', D, 2) +
    R(47, 22, 26, 6, 3, '#CED4DA') + shine('M53 32 V44 L40 76', 2.6, .7) +
    C(52, 76, 3, '#B2F2BB', 1.6) + C(66, 82, 2.4, '#B2F2BB', 1.6) + C(72, 72, 1.8, '#B2F2BB', 1.4) + face(60, 78, .9, 'happy') +
    C(58, 52, 2.4, '#B2F2BB', 1.4) + C(64, 40, 3, '#B2F2BB', 1.4) + C(56, 16, 4, '#B2F2BB', 1.6) + C(66, 12, 2.6, '#B2F2BB', 1.4) +
    sparkle(30, 46, 3.5) + sparkle(90, 50, 4, '#fff') + pcube(94, 30, 5, YEL) + pcube(24, 30, 4.6, BLUE),
  'Jeringa gigante': () => {
    const sci = (x: number, c: string) => g(`translate(${x} 82) scale(.9)`, P('M-6 -8 C-6 -16 6 -16 6 -8 L8 14 H-8Z', '#fff', 2.2) + C(0, -16, 7, SK, 2.2) +
      `<rect x="-6" y="-19" width="12" height="4" rx="2" fill="${c}" stroke="${D}" stroke-width="1.6"/>` + dot(-2.2, -15, 1.1) + dot(2.2, -15, 1.1) + L('M-2 -12 Q0 -10.6 2 -12', D, 1.1) +
      stick('M-5 -6 L-7 -26', SK, 2.4) + stick('M5 -6 L7 -26', SK, 2.4) + L('M-4 14 V20 M4 14 V20', D, 3));
    return E(60, 98, 38, 4, D).replace('class="m-ol"', 'opacity=".15"') +
      stick('M18 50 H26', '#ADB5BD', 3) + R(24, 42, 5, 16, 2, '#868E96', 2) +
      R(28, 43, 54, 14, 4, '#E7F5FF') + `<rect x="44" y="46" width="36" height="8" rx="2" fill="#69DB7C"/>` + L('M36 43 V48 M44 43 V50 M52 43 V48 M60 43 V50 M68 43 V48 M76 43 V50', D, 1.4) +
      R(28, 45, 5, 10, 1.5, D, 1) + P('M82 46 L89 48 V52 L82 54Z', '#CED4DA', 2) + L('M89 50 H99', '#ADB5BD', 1.6) + dot(97, 54, 1.6, '#69DB7C') + shine('M34 46 H46', 1.8, .8) +
      sci(40, '#4DABF7') + sci(58, '#FCC419') + sci(76, '#FF6B6B') + sparkle(42, 30, 3.5) + sparkle(78, 30, 4, '#fff');
  },
  'Doctor Favaloro': () =>
    rays(60, 76, 18, 28, 10, '#FFE066', 3) +
    P('M22 104 C22 84 36 76 60 76 C84 76 98 84 98 104Z', '#38D9A9') + P('M50 76 L60 90 L70 76', '#20C997', 2) +
    C(60, 50, 16, SK) + P('M44 46 C44 30 76 30 76 46 C70 40 50 40 44 46Z', '#5C3D2E') +
    P('M42 44 C40 26 80 26 78 44 C70 36 50 36 42 44Z', '#69DB7C') + L('M48 34 Q60 30 72 34', '#38D9A9', 1.6) +
    R(46, 47, 12, 9, 3, '#fff', 2.2) + R(62, 47, 12, 9, 3, '#fff', 2.2) + `<rect x="46" y="47" width="12" height="9" rx="3" fill="#A5D8FF" opacity=".4"/>` + L('M58 51 H62', D, 2) +
    dot(52, 52, 1.6) + dot(68, 52, 1.6) + blush(48, 59) + blush(72, 59) + L('M55 61 Q60 65 65 61', D, 1.6) +
    P('M36 92 C34 82 44 78 50 82 L56 88 C50 92 42 94 36 92Z', '#FCC419') + P('M84 92 C86 82 76 78 70 82 L64 88 C70 92 78 94 84 92Z', '#FCC419') +
    heart(60, 78, 9, '#E03131', 2.6) + shine('M54 74 Q56 71 59 72', 1.8, .9) + sparkle(38, 72, 3, '#fff') + sparkle(84, 70, 3.5, '#fff') + sparkle(30, 30, 3),
  // ── Erradicador ──
  'Fumigador': () =>
    `<g opacity=".85">${C(84, 50, 10, '#E9ECEF', 1.6) + C(94, 60, 8, '#E9ECEF', 1.6) + C(76, 62, 9, '#E9ECEF', 1.6) + C(90, 40, 7, '#E9ECEF', 1.6)}</g>` +
    pcube(86, 52, 4.4, RED) + pcube(78, 64, 4, YEL) + pcube(94, 66, 3.6, BLK) + L('M82 46 l4 4 m0 -4 l-4 4', D, 1.2, 'opacity="0"') +
    pcube(96, 84, 4, BLUE) + `<g opacity=".6">${pcube(88, 30, 3.4, BLUE)}</g>` +
    R(22, 46, 16, 30, 6, '#40C057') + L('M26 50 V70', '#fff', 1.8, 'opacity=".5"') +
    P('M38 104 C38 82 42 70 50 70 C58 70 62 82 62 104Z', '#FAB005') +
    C(50, 54, 12, SK) + P('M38 52 C38 38 62 38 62 52Z', '#FAB005') + R(36, 50, 28, 4, 2, '#E67700', 1.8) +
    R(41, 54, 18, 7, 3.5, '#212529', 1.8) + E(46, 57.5, 3, 2.4, '#74C0FC', 1.4) + E(54, 57.5, 3, 2.4, '#74C0FC', 1.4) +
    P('M44 63 C44 70 56 70 56 63Z', '#ADB5BD', 1.8) + dot(50, 66, 1.4) +
    L('M30 76 C34 90 48 90 58 82 L70 70', D, 5) + L('M30 76 C34 90 48 90 58 82 L70 70', '#495057', 2.4) + stick('M58 80 L72 70', SK, 3.6) +
    L('M74 66 L80 60 M76 70 L82 68 M72 62 L74 56', '#ADB5BD', 1.6),
  'Matamosquitos': () =>
    pcube(30, 82, 4.4, RED) + pcube(88, 84, 4, YEL) + pcube(28, 58, 3.6, BLK) +
    L('M30 66 L24 64 M34 74 L28 78 M86 62 L94 60 M82 72 L90 76', D, 2.2) +
    g('translate(56 66)', `<ellipse cx="-14" cy="-3" rx="10" ry="4" fill="#E7F5FF" stroke="${D}" stroke-width="1.8" transform="rotate(-12 -14 -3)"/><ellipse cx="14" cy="-3" rx="10" ry="4" fill="#E7F5FF" stroke="${D}" stroke-width="1.8" transform="rotate(12 14 -3)"/>` +
      L('M-6 3 L-20 8 L-24 14 M-2 5 L-8 14 M2 5 L8 14 M6 3 L20 8 L24 14', D, 1.6) + E(0, 2, 11, 5.4, '#495057') + L('M-5 -2.4 V6.4 M0 -3.4 V7.4 M5 -2.4 V6.4', '#fff', 1.8) +
      C(0, -8, 6, '#495057') + L('M0 -14 L0 -22', D, 1.6) + L('M-4.4 -10.4 L-1.4 -7.4 M-1.4 -10.4 L-4.4 -7.4 M1.4 -10.4 L4.4 -7.4 M4.4 -10.4 L1.4 -7.4', '#fff', 1.3)) +
    g('rotate(22 58 62)', stick('M58 46 L58 4', '#FCC419', 3.6) + `<rect x="40" y="46" width="36" height="32" rx="5" fill="#FF6B6B" fill-opacity=".3"/>` +
      L('M46 46 V78 M52 46 V78 M58 46 V78 M64 46 V78 M70 46 V78 M40 52 H76 M40 58 H76 M40 64 H76 M40 70 H76', '#C92A2A', 1, 'opacity=".7"') + R(40, 46, 36, 32, 5, 'none') + R(54, 40, 8, 8, 2, '#FCC419', 2)) +
    t(38, 40, 9, '¡PAF!', '#E03131', 'transform="rotate(-14 38 40)"') + sparkle(30, 48, 3) + sparkle(90, 50, 3, '#fff'),
  'Cazafantasmas': () =>
    L('M67 70 C72 66 64 64 68 62 C72 60 66 58 70 56', '#FFE066', 7, 'opacity=".55"') + L('M67 70 C72 66 64 64 68 62 C72 60 66 58 70 56', '#F06595', 2.6) + L('M66 68 C70 65 66 63 69 61 C72 59 70 58 72 56', '#74C0FC', 1.6) +
    g('translate(70 47) scale(.78)', P('M-12 4 C-14 -10 -6 -16 0 -16 C6 -16 14 -10 12 4 C10 10 8 6 6 12 C4 8 2 14 0 10 C-2 14 -4 8 -6 12 C-8 6 -10 10 -12 4Z', '#8CE99A') +
      L('M-12 -10 L-16 -14 M0 -16 V-21 M12 -10 L16 -14 M14 0 L19 -1 M-14 0 L-19 -1', D, 2) + `<g fill="#8CE99A" stroke="${D}" stroke-width="1.6"><circle cx="-16.6" cy="-14.6" r="2"/><circle cx="0" cy="-22" r="2"/><circle cx="16.6" cy="-14.6" r="2"/><circle cx="20" cy="-1" r="2"/><circle cx="-20" cy="-1" r="2"/></g>` +
      `<circle cx="-4" cy="-6" r="3" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="4" cy="-6" r="3" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dot(-4, -5, 1.3) + dot(4, -5, 1.3) + `<ellipse cx="0" cy="2" rx="2.6" ry="3.2" fill="${D}"/>` + `<circle cx="-6" cy="-1" r="1.4" fill="#2F9E44"/><circle cx="7" cy="1" r="1.2" fill="#2F9E44"/>` +
      L('M-24 -6 Q-28 0 -24 6 M24 -6 Q28 0 24 6', D, 1.6)) +
    R(26, 58, 22, 36, 4, '#868E96') + R(30, 64, 14, 10, 2, '#212529', 1.8) + `<rect x="32" y="66" width="4" height="6" fill="#51CF66"/><rect x="37" y="68" width="4" height="4" fill="#FCC419"/>` +
    C(37, 84, 6, '#CED4DA', 2) + L('M37 84 L40 81', D, 1.6) + `<g fill="#E03131" stroke="${D}" stroke-width="1.2"><circle cx="30" cy="90" r="1.6"/><circle cx="44" cy="90" r="1.6"/></g>` +
    L('M48 88 C54 92 56 86 56 80', D, 4.6) + L('M48 88 C54 92 56 86 56 80', '#FCC419', 2) +
    g('rotate(-35 56 80)', R(48, 74, 22, 8, 3, '#495057') + R(66, 75, 6, 6, 1.5, '#E03131', 1.6)) +
    sparkle(40, 36, 4, '#fff') + sparkle(56, 48, 3) + sparkle(90, 70, 3.5),
  // ═══════════════ EA SPORTS FC ═══════════════
  // ── Goleador serial ──
  'Baile': u =>
    `<rect x="0" y="86" width="120" height="44" fill="#69DB7C"/>` + L('M0 86 H120', D, 2.4) + L('M10 96 H110', '#fff', 1.6, 'opacity=".7"') +
    g('translate(84 74)', P('M-10 16 C-12 4 -6 -2 0 -2 C6 -2 12 4 10 16Z', '#E03131') + C(0, -12, 9, SK) + P('M-9 -14 C-8 -22 8 -22 9 -14 C4 -18 -4 -18 -9 -14Z', '#212529') +
      L('M-6 -13 a2.4 2.4 0 1 1 2.4 2.4 M3 -13 a2.4 2.4 0 1 1 2.4 2.4', D, 1.3) + L('M-2.6 -6 Q0 -8 2.6 -6', D, 1.4) +
      star(-8, -26, 3.4, '#FCC419', 1.4) + star(8, -28, 3, '#FCC419', 1.4) + L('M-12 -25 Q0 -34 12 -25', D, 1, 'stroke-dasharray="1.5 2"')) +
    stick('M44 68 L36 86', '#212529', 4.2) + stick('M50 68 L58 76 L54 86', '#212529', 4.2) + L('M34 88 h5 M53 88 h5', '#E03131', 3.4) +
    R(39, 48, 16, 22, 5, '#74C0FC') + `<path d="M45 48 V70 M51 48 V70" stroke="#fff" stroke-width="2.6"/>` + R(39, 48, 16, 22, 5, 'none') + R(39, 64, 16, 8, 3, '#212529', 2.2) +
    stick('M42 52 L30 40', SK, 3.6) + stick('M52 52 L62 40', SK, 3.6) +
    C(47, 38, 9, SK) + P('M38 36 C38 26 56 26 56 36 C52 32 46 31 42 34 C41 35 40 36 38 36Z', '#5C3D2E') + face(47, 39, .72, 'happy') +
    sball(66, 82, 6, `bb${u}`) + L('M64 92 Q68 94 72 92', D, 1.4) +
    t(30, 28, 10, '¡olé!', '#E03131', 'transform="rotate(-10 30 28)"') + L('M68 30 Q72 26 70 22 M76 34 Q80 32 82 28', D, 1.6),
  'Paliza': u =>
    stick('M40 54 V64 M80 54 V64', '#868E96', 3) +
    R(24, 24, 72, 32, 4, '#212529') + R(28, 28, 64, 24, 2, '#343A40', 1.6) +
    t(43, 48, 20, '5', '#FFD43B') + t(60, 46, 14, '-', '#fff') + t(77, 48, 20, '0', '#FFD43B') + `<g fill="#FF6B6B"><circle cx="30" cy="31" r="1"/><circle cx="90" cy="31" r="1"/></g>` +
    sball(60, 80, 15, `pb${u}`) +
    `<circle cx="54" cy="78" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="66" cy="78" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dot(54, 79, 1.6) + dot(66, 79, 1.6) +
    L('M57 87 Q60 84 63 87', D, 1.8) + L('M49 73 L57 75 M71 73 L63 75', D, 1.6) +
    `<path d="M50 82 C48 88 50 92 52 92 C54 92 54 88 50 82Z M70 82 C72 88 70 92 68 92 C66 92 66 88 70 82Z" fill="#74C0FC" stroke="${D}" stroke-width="1.2"/>` +
    g('rotate(-30 70 70)', R(64, 68, 12, 4.4, 2, '#FFE8CC', 1.4)) +
    g('translate(90 74)', C(0, 0, 6, '#fff', 2) + L('M0 -3.4 V0 L2.4 1.6', D, 1.4)) + L('M84 82 Q78 86 74 84', SK, 2.6) +
    L('M26 66 L22 62 M28 76 L22 76', D, 2),
  'Mineirazo': u =>
    `<path d="M20 22 L26 14 M100 22 L94 14" stroke="${D}" stroke-width="3"/><g fill="#FFF3BF" stroke="${D}" stroke-width="1.6"><rect x="18" y="12" width="12" height="6" rx="1"/><rect x="90" y="12" width="12" height="6" rx="1"/></g>` +
    `<path d="M24 18 L40 48 H14Z M96 18 L80 48 H106Z" fill="#FFF3BF" opacity=".35"/>` +
    R(28, 22, 64, 30, 4, '#212529') + R(32, 26, 56, 22, 2, '#1B4332', 1.6) +
    t(46, 46, 20, '7', '#FFD43B') + t(60, 44, 14, '-', '#fff') + t(74, 46, 20, '1', '#FFD43B') +
    P('M26 104 C26 86 38 78 60 78 C82 78 94 86 94 104Z', '#FFD43B') + P('M50 78 C50 84 70 84 70 78', '#2F9E44', 2.4) + L('M60 84 V104', '#2F9E44', 1.6, 'opacity="0"') +
    C(60, 66, 13, SK3) + P('M47 62 C47 52 73 52 73 62 C68 58 52 58 47 62Z', '#212529') +
    `<circle cx="55" cy="64" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="65" cy="64" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dot(55, 64, 1.3) + dot(65, 64, 1.3) +
    `<ellipse cx="60" cy="73" rx="3" ry="4" fill="${D}"/>` + `<path d="M50 68 C49 72 50 74 51.4 74 C52.8 74 53 72 50 68Z" fill="#74C0FC" stroke="${D}" stroke-width="1"/>` +
    stick('M38 88 C34 74 40 62 47 60', SK3, 4.4) + stick('M82 88 C86 74 80 62 73 60', SK3, 4.4) +
    sball(96, 92, 6, `mb${u}`) + sball(24, 90, 5, `mc${u}`) + L('M30 80 L26 76 M90 80 L94 76', D, 2),
  // ── Golazo ──
  'Tijera': u =>
    `<rect x="0" y="90" width="120" height="40" fill="#69DB7C"/>` + L('M0 90 H120', D, 2.4) +
    L('M24 74 Q40 66 52 70 M26 82 Q40 78 50 80', D, 1.6, 'opacity=".5"') +
    `<g transform="translate(8 4)">` + stick('M58 64 L76 40', '#212529', 4.2) + stick('M58 64 L80 58', '#212529', 4.2) + L('M76 40 l2 -3 M80 58 l3 0', '#E03131', 4) +
    R(40, 56, 22, 14, 6, '#74C0FC') + `<path d="M46 56 V70 M52 56 V70" stroke="#fff" stroke-width="2.4"/>` + R(40, 56, 22, 14, 6, 'none') + R(54, 57, 10, 12, 4, '#212529', 2) +
    stick('M44 66 L30 80', SK, 3.4) + stick('M46 58 L36 48', SK, 3.4) +
    C(34, 66, 8, SK) + P('M30 58 C24 60 24 70 28 72 C28 66 32 62 36 60Z', '#5C3D2E') + face(36, 67, .6, 'shock', false) + `</g>` +
    sball(84, 36, 7, `tb${u}`) + L('M76 42 L72 46 M91 44 L94 48 M80 28 L78 24', D, 1.8) +
    g('translate(40 38) rotate(-30) scale(.9)', C(-5, 6, 3.6, 'none', 2.2) + C(5, 6, 3.6, 'none', 2.2) + P('M-3 3 L2 -12 L1 -2Z', '#CED4DA', 1.6) + P('M3 3 L-2 -12 L-1 -2Z', '#CED4DA', 1.6)) +
    sparkle(92, 60, 3.5) + sparkle(62, 28, 3),
  'Acróbata': u =>
    `<circle cx="58" cy="56" r="30" fill="none" stroke="#ADB5BD" stroke-width="2.4" stroke-dasharray="4 5" stroke-linecap="round"/>` + P('M84 36 L90 44 L80 44Z', '#ADB5BD', 1.6) + P('M32 76 L26 68 L36 68Z', '#ADB5BD', 1.6) +
    g('rotate(-30 58 56)', stick('M56 60 L46 70 L54 78', '#212529', 4) + stick('M62 60 L70 70 L64 78', '#212529', 4) +
      R(50, 40, 18, 22, 6, '#74C0FC') + `<path d="M56 40 V62 M62 40 V62" stroke="#fff" stroke-width="2.4"/>` + R(50, 40, 18, 22, 6, 'none') + R(50, 56, 18, 8, 3, '#212529', 2) +
      stick('M52 44 L42 38', SK, 3.4) + stick('M66 44 L74 36', SK, 3.4) +
      C(59, 30, 9, SK) + P('M50 28 C50 18 68 18 68 28 C62 24 56 24 50 28Z', '#5C3D2E') + face(59, 31, .7, 'happy')) +
    ctrl(84, 22, .55, 20, '#F8F9FA') + L('M62 24 Q70 14 76 20', D, 1.4, 'stroke-dasharray="1.5 2"') +
    sball(40, 86, 7, `ab${u}`) + sparkle(28, 36, 4) + sparkle(94, 70, 3.5, '#fff') + star(86, 88, 4, '#FFD43B', 1.6),
  'Escorpión': u =>
    `<rect x="0" y="86" width="120" height="46" fill="#69DB7C"/>` + L('M0 86 H120', D, 2.4) +
    L('M84 50 Q92 54 90 62 M80 44 Q94 44 96 58', '#ADB5BD', 1.6) +
    stick('M68 64 L64 48 L56 42', '#212529', 4.4) + stick('M70 62 L76 44 L62 36', '#212529', 4.4) + L('M56 42 l-3 -1 M62 36 l-3 -2', '#FF922B', 4.4) +
    R(44, 60, 30, 14, 6, '#FCC419') + L('M50 60 L56 74 M58 60 L64 74', '#FF922B', 2.4) + R(44, 60, 30, 14, 6, 'none') + R(64, 60, 10, 13, 4, '#212529', 2) +
    stick('M50 70 L42 84', SK3, 3.6) + stick('M56 72 L52 86', SK3, 3.6) + C(42, 85, 3.6, '#fff', 1.8) + C(52, 87, 3.6, '#fff', 1.8) +
    C(38, 66, 9, SK3) + `<g fill="#212529" stroke="${D}" stroke-width="1.4">${[[31, 61], [35, 57], [41, 56], [46, 59], [30, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6"/>`).join('')}</g>` +
    dot(35, 67, 1.4) + L('M29 71 Q33 69 37 71', '#5C3D2E', 2.6) + blush(40, 70, 2) +
    sball(52, 30, 7, `eb${u}`) + L('M42 26 L38 23 M43 34 L39 37 M50 21 L48 18', D, 1.8) +
    sparkle(86, 32, 4.5) + sparkle(28, 44, 3.5, '#fff'),
  // ── Mira de los once metros ──
  'Bajo los tres palos': () => {
    let net = '';
    for (let x = 30; x <= 90; x += 6) net += `M${x} 30 V86 `;
    for (let y = 36; y <= 86; y += 6) net += `M26 ${y} H94 `;
    return `<rect x="0" y="86" width="120" height="44" fill="#69DB7C"/>` + L(net, '#ADB5BD', 1) + L('M0 86 H120', '#fff', 2.4) +
      `<path d="M24 88 V28 H96 V88" fill="none" stroke="${D}" stroke-width="7" stroke-linejoin="round"/><path d="M24 88 V28 H96 V88" fill="none" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/>` +
      stick('M54 72 L46 78 L48 86', '#212529', 4.4) + stick('M66 72 L74 78 L72 86', '#212529', 4.4) +
      P('M48 60 C48 50 72 50 72 60 L70 74 H50Z', '#FF922B') + L('M50 64 H70', '#fff', 2) + R(50, 68, 20, 8, 3, '#212529', 2) +
      stick('M50 58 L40 66', '#FF922B', 3.6) + stick('M70 58 L80 66', '#FF922B', 3.6) +
      R(32, 62, 11, 12, 4, '#FCC419') + R(77, 62, 11, 12, 4, '#FCC419') + L('M34 65 H41 M79 65 H86', '#fff', 1.4) +
      C(60, 46, 10, SK) + P('M50 44 C50 34 70 34 70 44 C64 40 56 40 50 44Z', '#5C3D2E') + face(60, 48, .78, 'angry', false) + L('M56 52 H64', D, 1.4) +
      L('M34 44 Q30 40 32 36 M86 44 Q90 40 88 36', '#ADB5BD', 1.4);
  },
  'Goyco': u =>
    `<rect x="0" y="88" width="120" height="42" fill="#69DB7C"/>` + L('M0 88 H120', '#fff', 2.4) +
    `<path d="M100 88 V36 H120" fill="none" stroke="${D}" stroke-width="7"/><path d="M100 88 V36 H120" fill="none" stroke="#fff" stroke-width="3.6"/>` +
    L('M58 60 Q74 50 86 60 M60 72 Q76 66 90 74', '#ADB5BD', 1.6, 'stroke-dasharray="3 3"') +
    g('translate(68 64) scale(.78) translate(-66 -62) rotate(-22 66 62)', stick('M78 62 L94 58 L98 64', '#212529', 4.4) + stick('M78 66 L92 70', '#212529', 4.4) +
      R(54, 54, 26, 16, 7, '#495057') + L('M60 54 V70 M66 54 V70', '#868E96', 1.6) + R(54, 54, 26, 16, 7, 'none') +
      stick('M56 58 L40 54', '#495057', 3.6) + stick('M56 66 L40 70', '#495057', 3.6) + R(32, 49, 10, 10, 4, '#fff') + R(32, 65, 10, 10, 4, '#fff') +
      C(50, 46, 9, SK) + P('M42 44 C42 34 58 34 58 44 C54 40 46 40 42 44Z', '#5C3D2E') + face(50, 47, .7, 'angry', false) + L('M47 51.5 H53', D, 1.4)) +
    sball(37, 60, 7, `gy${u}`, true) + L('M30 50 L27 47 M28 62 H24 M31 69 L28 72', D, 1.8) +
    g('translate(60 31)', `<rect x="-9" y="-4" width="6" height="8" fill="#2F9E44"/><rect x="-3" y="-4" width="6" height="8" fill="#fff"/><rect x="3" y="-4" width="6" height="8" fill="#E03131"/>` + R(-9, -4, 18, 8, 1, 'none', 1.6)) + t(60, 45, 9, '90', '#495057'),
  'Dibu Martínez': () => {
    let net = '';
    for (let x = 28; x <= 92; x += 8) net += `M${x} 30 V88 `;
    for (let y = 38; y <= 88; y += 8) net += `M24 ${y} H96 `;
    return `<rect x="0" y="88" width="120" height="42" fill="#69DB7C"/>` + L(net, '#CED4DA', 1) +
      `<path d="M22 90 V26 H98 V90" fill="none" stroke="${D}" stroke-width="7"/><path d="M22 90 V26 H98 V90" fill="none" stroke="#fff" stroke-width="3.6"/>` + L('M0 89 H120', '#fff', 2.6) +
      stick('M56 74 L48 88', '#212529', 4.4) + stick('M64 74 L74 72 L78 80', '#212529', 4.4) + L('M45 90 h6 M76 82 l3 3', '#9775FA', 3.6) +
      P('M48 56 C48 48 72 48 72 56 L70 76 H50Z', '#9775FA') + L('M52 60 L68 72 M52 72 L68 60', '#B197FC', 1.8) + R(50, 70, 20, 8, 3, '#212529', 2) +
      stick('M50 56 L32 48', '#9775FA', 3.6) + stick('M70 56 L88 48', '#9775FA', 3.6) + C(29, 46, 6, '#51CF66') + C(91, 46, 6, '#51CF66') + L('M26 44 L32 48 M88 44 L94 48', '#fff', 1.2) +
      C(60, 42, 10, SK) + P('M50 40 C50 30 70 30 70 40 C64 36 56 36 50 40Z', '#5C3D2E') + face(60, 44, .78, 'wink') +
      t(36, 32, 10, '♪', '#7048E8') + t(86, 30, 12, '♫', '#7048E8') + sparkle(100, 56, 3.5) + sparkle(20, 60, 3.5);
  },
  // ── Calentón ──
  'Joystick volador': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#E7F5FF"/>` +
    P('M20 104 V82 C20 76 26 74 32 76 H88 C94 74 100 76 100 82 V104Z', '#E8590C') + R(30, 72, 60, 14, 6, '#FF922B') + L('M60 74 V86', D, 1.6) +
    L('M16 80 Q24 56 38 50 Q48 46 44 40 Q40 34 48 32 Q58 30 62 38', D, 4.6) + L('M16 80 Q24 56 38 50 Q48 46 44 40 Q40 34 48 32 Q58 30 62 38', '#495057', 2.2) +
    L('M58 56 L48 64 M62 62 L54 72 M70 64 L66 76', D, 2, 'opacity=".5"') +
    ctrl(76, 42, 1.25, 28, '#F8F9FA') +
    `<circle cx="73" cy="34" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/><circle cx="81" cy="38" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.2"/>` + dot(73.4, 34, 1.1) + dot(81.4, 38, 1.1) +
    `<ellipse cx="74" cy="44" rx="1.8" ry="2.4" fill="${D}" transform="rotate(28 74 44)"/>` +
    L('M94 22 L98 18 M100 32 L106 30 M88 16 L88 10', D, 2) + sparkle(30, 30, 3.5),
  'Pibe calentón': () =>
    steam(22, 46, 1.1) + steam(98, 46, 1.1) + steam(30, 32, .8) + steam(92, 30, .8) +
    P('M28 104 C28 88 40 82 60 82 C80 82 92 88 92 104Z', '#4DABF7') + L('M48 84 Q60 92 72 84', '#1C7ED6', 2) +
    C(60, 56, 18, '#FF8787') + C(41, 58, 4, '#FF8787', 2.2) + C(79, 58, 4, '#FF8787', 2.2) +
    P('M42 52 C40 34 80 34 78 52 C70 44 50 44 42 52Z', '#E03131') + P('M70 40 L90 38 C92 42 88 44 76 46Z', '#C92A2A') + R(56, 35, 8, 4, 2, '#fff', 1.4) +
    face(60, 58, 1.05, 'angry', false) + R(55, 63, 10, 4, 1.5, '#fff', 1.4) + L('M57.5 63 V67 M60 63 V67 M62.5 63 V67', D, .9) +
    ctrl(60, 86, .95, 0, '#495057') + C(42, 86, 4.4, SK, 2.2) + C(78, 86, 4.4, SK, 2.2) +
    L('M36 76 L30 80 M84 76 L90 80', D, 2) + L('M44 30 L40 24 M76 30 L80 24 M60 28 V22', '#E03131', 2),
  'Olla a presión': () =>
    `<path d="M44 100 C40 92 48 90 46 84 C52 88 50 94 54 94 C54 88 60 86 60 80 C66 86 66 92 64 98Z M68 100 C66 92 72 88 72 82 C78 88 80 94 78 100Z" fill="#FF922B" stroke="${D}" stroke-width="2"/>` +
    R(32, 94, 56, 6, 2, '#495057') +
    R(76, 62, 8, 6, 2, '#212529', 1.8) + ctrl(88, 66, .6, 90, '#212529') + R(36, 62, 8, 6, 2, '#212529', 1.8) + ctrl(32, 66, .6, -90, '#212529') +
    P('M42 54 H78 V86 C78 94 42 94 42 86Z', '#ADB5BD') + shine('M47 62 V84', 3, .6) + L('M42 64 H78', '#868E96', 1.6) +
    P('M37 54 C37 46 83 46 83 54 C83 58 37 58 37 54Z', '#CED4DA') + R(56, 40, 8, 8, 2, '#495057') + C(60, 36, 4, '#E03131', 2) +
    face(60, 75, 1.05, 'angry', false) + L('M55 81 Q60 77 65 81', D, 1.8) +
    steam(46, 28, .9) + steam(74, 24, 1) + steam(60, 16, .75) + L('M66 32 L74 28 M54 32 L46 28 M60 30 V26', '#fff', 2.4) +
    t(83, 40, 9, '¡fiiiu!', '#E8590C', 'transform="rotate(14 83 40)" textLength="22" lengthAdjust="spacingAndGlyphs"') +
    `<g fill="#C08552" stroke="${D}" stroke-width="1"><ellipse cx="46" cy="52" rx="2" ry="1.4"/><ellipse cx="74" cy="51" rx="2" ry="1.4"/></g>`,
};
