// Ilustraciones de medallas: Chinchón, La Podrida, Love Letter, Escoba de 15, Wingspan y Hombres Lobo.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Primitivas ─────────────────────────────────────────────────────────
const sw_ = (sw?: number) => (sw ? ` style="stroke-width:${sw}"` : '');
const P = (d: string, fill: string, sw?: number, x = '') => `<path class="m-ol"${sw_(sw)} d="${d}" fill="${fill}"${x}/>`;
const C = (cx: number, cy: number, r: number, fill: string, sw?: number) => `<circle class="m-ol"${sw_(sw)} cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const E = (cx: number, cy: number, rx: number, ry: number, fill: string, sw?: number, rot = 0) =>
  `<ellipse class="m-ol"${sw_(sw)} cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const R = (x: number, y: number, w: number, h: number, rx: number, fill: string, sw?: number, x2 = '') =>
  `<rect class="m-ol"${sw_(sw)} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${x2}/>`;
const L = (d: string, c: string = D, w = 2.2, o = 1) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o < 1 ? ` opacity="${o}"` : ''}/>`;
const dot = (cx: number, cy: number, r: number, c: string = D, o = 1) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"${o < 1 ? ` opacity="${o}"` : ''}/>`;
const hl = (cx: number, cy: number, rx: number, ry: number, rot = -30, o = .75) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${cx} ${cy})"/>`;
const blush = (x: number, y: number, r = 2.6) => dot(x, y, r, '#FF8FA3', .7);
const smile = (x: number, y: number, w: number, sw = 1.8) => L(`M${f(x - w)} ${y} Q${x} ${f(y + w * .9)} ${f(x + w)} ${y}`, D, sw);
const frown = (x: number, y: number, w: number, sw = 1.8) => L(`M${f(x - w)} ${y} Q${x} ${f(y - w * .8)} ${f(x + w)} ${y}`, D, sw);
const g = (tr: string, inner: string) => `<g transform="${tr}">${inner}</g>`;
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`;
const coin = (x: number, y: number, r: number) =>
  `<circle class="m-ol" cx="${x}" cy="${y}" r="${r}" fill="#FCC419"/><circle cx="${x}" cy="${y}" r="${f(r * .62)}" fill="none" stroke="#E67700" stroke-width="1.6"/>` +
  `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .4)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" transform="rotate(-40 ${f(x - r * .4)} ${f(y - r * .4)})"/>`;
const crown = (x: number, y: number, s: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z" fill="#FFD43B"/>` +
  `<circle cx="0" cy="1.5" r="1.8" fill="#E03131"/><circle cx="-6" cy="2" r="1.2" fill="#4DABF7"/><circle cx="6" cy="2" r="1.2" fill="#4DABF7"/></g>`;
const mate = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + stick('M4 -12 L14 -30', '#CED4DA', 2.4) +
  `<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-13 -10 C-17 0 -14 14 0 15 C14 14 17 0 13 -10Z" fill="#9C6644"/>` +
  `<path d="M-9 -4 C-10 2 -8 8 -4 10" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".45"/>` +
  `<ellipse class="m-ol" style="stroke-width:${f(2.6 / s)}" cx="0" cy="-10" rx="13" ry="4" fill="#5C940D"/><path d="M-7 -11 Q-3 -12.5 1 -11" stroke="#94D82D" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
  `<rect class="m-ol" style="stroke-width:${f(2 / s)}" x="-14" y="-7" width="28" height="4" rx="2" fill="#E9C46A"/></g>`;
const flame = (x: number, y: number, s = 1) =>
  g(`translate(${x} ${y}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M0 0 C-7 -1 -9 -9 -4 -15 C-4 -11 -2 -10 -1 -10 C-2 -16 2 -21 6 -23 C5 -17 10 -13 8 -6 C7 -2 4 0 0 0Z" fill="#FF922B"/>` +
    `<path d="M0.5 -2 C-3 -3 -4 -7 -1 -10 C0 -7 1 -7 2 -7 C2 -10 4 -12 5 -13 C5 -9 7 -7 5 -4 C4 -2 2 -2 0.5 -2Z" fill="#FFD43B"/>`);
const flake = (x: number, y: number, r: number, c = '#4DABF7') =>
  L(`M${x} ${f(y - r)} V${f(y + r)} M${f(x - r * .87)} ${f(y - r / 2)} L${f(x + r * .87)} ${f(y + r / 2)} M${f(x - r * .87)} ${f(y + r / 2)} L${f(x + r * .87)} ${f(y - r / 2)}`, c, 1.6);
const cloud = (x: number, y: number, s: number) =>
  g(`translate(${x} ${y}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-15 5 C-20 5 -20 -3 -14 -3 C-14 -10 -5 -11 -3 -6 C-1 -13 10 -13 10 -5 C16 -6 19 1 14 5Z" fill="#fff"/>` +
    `<path d="M-10 -2 C-9 -5 -6 -6 -4 -5" stroke="#E7F5FF" stroke-width="2" fill="none" stroke-linecap="round"/>`);
const fly = (x: number, y: number) =>
  `<ellipse class="m-ol" style="stroke-width:1.1" cx="${x - 1.6}" cy="${y - 2.6}" rx="2" ry="1.3" fill="#E7F5FF" transform="rotate(-30 ${x - 1.6} ${y - 2.6})"/>` +
  `<ellipse class="m-ol" style="stroke-width:1.1" cx="${x + 1.6}" cy="${y - 2.6}" rx="2" ry="1.3" fill="#E7F5FF" transform="rotate(30 ${x + 1.6} ${y - 2.6})"/>` + dot(x, y, 1.9);
const note = (x: number, y: number, s: number, c = '#7048E8', rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<path d="M3 0 V-12 Q8 -10 8 -5" fill="none" stroke="${D}" stroke-width="${f(2 / s)}" stroke-linecap="round"/>` +
    `<ellipse class="m-ol" style="stroke-width:${f(1.6 / s)}" cx="0" cy="0" rx="3.6" ry="2.7" fill="${c}" transform="rotate(-20)"/>`);
const egg = (x: number, y: number, s: number, fill: string, spots = '', rot = 0) =>
  g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M0 -9 C5 -9 7 -2 7 2 C7 7 4 9.5 0 9.5 C-4 9.5 -7 7 -7 2 C-7 -2 -5 -9 0 -9Z" fill="${fill}"/>` +
    (spots ? `<g fill="${spots}"><circle cx="-2" cy="-2" r="1.1"/><circle cx="2.6" cy="1.5" r="1.3"/><circle cx="-3" cy="4" r=".9"/><circle cx="1" cy="6" r=".8"/><circle cx="3" cy="-4" r=".7"/></g>` : '') +
    `<ellipse cx="-2.6" cy="-3.8" rx="1.4" ry="2.4" fill="#fff" opacity=".7" transform="rotate(20 -2.6 -3.8)"/>`);

// ── Naipes españoles ───────────────────────────────────────────────────
type Suit = 'o' | 'c' | 'e' | 'b';
const SUIT: Record<Suit, string> = {
  o: `<circle class="m-ol" style="stroke-width:1.5" r="4.8" fill="#FCC419"/><circle r="2.7" fill="none" stroke="#E67700" stroke-width="1.2"/><circle cx="-1.8" cy="-1.9" r=".9" fill="#fff"/>`,
  c: `<path class="m-ol" style="stroke-width:1.5" d="M-4.8 -5.4 H4.8 C4.8 -.6 2.6 1.6 0 1.6 C-2.6 1.6 -4.8 -.6 -4.8 -5.4Z M-1 1.6 H1 V4 H-1Z M-3.6 4 H3.6 V5.8 H-3.6Z" fill="#FAB005"/><path d="M-4.2 -3.6 H4.2" stroke="#E03131" stroke-width="1.3"/>`,
  e: `<path class="m-ol" style="stroke-width:1.4" d="M0 -7 L1.5 -5 V2.6 H-1.5 V-5Z" fill="#A5D8FF"/><rect class="m-ol" style="stroke-width:1.3" x="-4" y="2.4" width="8" height="1.8" rx=".9" fill="#FCC419"/><rect class="m-ol" style="stroke-width:1.2" x="-.9" y="4.2" width="1.8" height="3" fill="#8B5A3C"/>`,
  b: `<path class="m-ol" style="stroke-width:1.5" d="M-1.4 6.4 L-2.6 -3.4 C-3 -7 3 -7 2.6 -3.4 L1.4 6.4Z" fill="#C97B45"/><circle cx="-1" cy="-1" r=".8" fill="#8B5A3C"/><circle cx=".8" cy="2.4" r=".8" fill="#8B5A3C"/><path d="M2.4 -3 Q6 -5 5 -1 Q4 -2 2.4 -2Z" fill="#40C057"/>`,
};
const SUITC: Record<Suit, string> = { o: '#E67700', c: '#E03131', e: '#1971C2', b: '#2F9E44' };
/** Naipe español de 20×28 centrado, con número y palo. */
const ncard = (x: number, y: number, rot: number, s: number, suit: Suit, num: string | number) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.4 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/>` +
  `<rect x="-7.4" y="-11.4" width="14.8" height="22.8" rx="1.6" fill="none" stroke="${SUITC[suit]}" stroke-width="1" stroke-dasharray="7 2.4" opacity=".6"/>` +
  t(-4.6, -4.4, 7.4, String(num), SUITC[suit], 'stroke="#fff" stroke-width="2" paint-order="stroke"') +
  `<g transform="translate(1.6 4)">${SUIT[suit]}</g></g>`;
/** Dorso de naipe. */
const bcard = (x: number, y: number, rot: number, s: number, c = '#C92A2A') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.4 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${c}"/>` +
  `<rect x="-6.5" y="-10.5" width="13" height="21" rx="1.5" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/><path d="M0 -6 L4 0 L0 6 L-4 0Z" fill="#fff" opacity=".7"/></g>`;
/** Carta de la Princesa (Love Letter). */
const pcard = (x: number, y: number, rot: number, s: number) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.4 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="#FFDEEB"/>` +
  `<rect x="-7.4" y="-11.4" width="14.8" height="22.8" rx="1.6" fill="none" stroke="#E64980" stroke-width="1"/>` + crown(0, -3, .55) + heart(0, 6, 3.6, '#E64980', 1.4) + `</g>`;

// ── Personajes ─────────────────────────────────────────────────────────
type Mouth = 'grin' | 'smug' | 'drool' | 'open' | 'none';
/** Cabeza de lobo de frente centrada en (x,y); ~40 de ancho con s=1. */
const wolf = (x: number, y: number, s: number, mouth: Mouth = 'grin', fur = '#868E96', ears = true) => {
  const k = f(2.6 / s);
  const m = mouth === 'grin'
    ? `<path class="m-ol" style="stroke-width:1.6" d="M-9 6 Q0 16 9 6 Q0 9.5 -9 6Z" fill="#C92A2A"/><path d="M-7.4 6.8 L-6 9.6 L-4.6 7.8 L-3 10 L-1.5 8.2 L0 10.2 L1.5 8.2 L3 10 L4.6 7.8 L6 9.6 L7.4 6.8 Q0 9.4 -7.4 6.8Z" fill="#fff"/>`
    : mouth === 'smug'
      ? L('M-6 7 Q0 11 6 7', D, 1.8) + `<path class="m-ol" style="stroke-width:1.2" d="M3 8.2 L4.4 11.6 L5.4 7.6Z" fill="#fff"/>`
      : mouth === 'drool'
        ? `<path class="m-ol" style="stroke-width:1.6" d="M-7 6 Q0 14 7 6 Q0 8.5 -7 6Z" fill="#C92A2A"/><path class="m-ol" style="stroke-width:1.2" d="M-5.6 6.6 L-4.4 9.4 L-3.2 7.2Z M5.6 6.6 L4.4 9.4 L3.2 7.2Z" fill="#fff"/>` +
          `<path class="m-ol" style="stroke-width:1.2" d="M5 11 C5 14 6.6 15 6.6 16.6 A1.8 1.8 0 0 1 3.2 16.6 C3.2 15 4.8 14 5 11Z" fill="#A5D8FF"/>`
        : mouth === 'open' ? `<path class="m-ol" style="stroke-width:1.6" d="M-4 6 Q0 4 4 6 Q4 13 0 13 Q-4 13 -4 6Z" fill="#C92A2A"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">` +
    (ears ? `<path class="m-ol" style="stroke-width:${k}" d="M-15 -10 L-17 -28 L-4 -19Z" fill="${fur}"/><path class="m-ol" style="stroke-width:${k}" d="M15 -10 L17 -28 L4 -19Z" fill="${fur}"/>` +
      `<path d="M-13.4 -13 L-14.6 -23.4 L-7.4 -18.4Z M13.4 -13 L14.6 -23.4 L7.4 -18.4Z" fill="#FFA8A8"/>` : '') +
    `<path class="m-ol" style="stroke-width:${k}" d="M-17 -6 C-18 -18 -10 -21 0 -21 C10 -21 18 -18 17 -6 L23 2 L16 3 L19 9 C12 13 6 15 0 15 C-6 15 -12 13 -19 9 L-16 3 L-23 2Z" fill="${fur}"/>` +
    `<path d="M-9 -3 C-7 -8 7 -8 9 -3 C11 3 8 13 0 13 C-8 13 -11 3 -9 -3Z" fill="#DEE2E6"/>` + hl(-9, -15, 3.4, 1.8) +
    `<ellipse class="m-ol" style="stroke-width:1.5" cx="-7" cy="-8.5" rx="3.4" ry="3" fill="#FFD43B"/><ellipse class="m-ol" style="stroke-width:1.5" cx="7" cy="-8.5" rx="3.4" ry="3" fill="#FFD43B"/>` +
    dot(-6.4, -8.4, 1.5) + dot(6.4, -8.4, 1.5) + L('M-11.5 -13 L-3.6 -11 M11.5 -13 L3.6 -11', D, 2) +
    `<ellipse class="m-ol" style="stroke-width:1.8" cx="0" cy="3.4" rx="7.4" ry="5.6" fill="#F8F9FA"/>` +
    `<path d="M-3.2 0 C-3.2 -2.2 3.2 -2.2 3.2 0 C3.2 2 1.2 3 0 3 C-1.2 3 -3.2 2 -3.2 0Z" fill="${D}"/><ellipse cx="-1" cy="-.6" rx="1" ry=".6" fill="#fff"/>` +
    m + `</g>`;
};
/** Pajarito de perfil mirando a la derecha, centrado en (x,y). s<0 lo da vuelta. */
const bird = (x: number, y: number, s: number, body: string, wing: string, beak = '#FF922B', belly = '') => {
  const a = Math.abs(s), k = f(2.2 / a);
  return `<g transform="translate(${x} ${y}) scale(${s} ${a})">` +
    `<path class="m-ol" style="stroke-width:${k}" d="M-7 -1 L-16 -5 L-15 3 L-7 4Z" fill="${wing}"/>` +
    `<path class="m-ol" style="stroke-width:${k}" d="M-9 2 C-9 -5 -3 -7 2 -6 C2 -11 6 -13 9 -13 C13 -13 15 -10 15 -7 C16 2 12 8 3 8 C-3 8 -7 6 -9 2Z" fill="${body}"/>` +
    (belly ? `<path d="M14 -2 C13 4 8 7 3 7 C6 4 9 0 14 -2Z" fill="${belly}"/>` : '') +
    `<path class="m-ol" style="stroke-width:${f(1.6 / a)}" d="M14.4 -8.6 L20 -6.2 L14.4 -4Z" fill="${beak}"/>` +
    `<path class="m-ol" style="stroke-width:${f(1.8 / a)}" d="M-5 -1 C-1 -5 5 -3 7 1 C3 4 -2 4 -5 -1Z" fill="${wing}"/>` +
    dot(10, -8, 1.5) + `<circle cx="10.5" cy="-8.5" r=".5" fill="#fff"/>` + `</g>`;
};
/** Paloma de plaza. */
const pigeon = (x: number, y: number, s: number) =>
  bird(x, y, s, '#ADB5BD', '#868E96', '#495057', '') + g(`translate(${x} ${y}) scale(${s} ${Math.abs(s)})`, `<path d="M9 -4 C10 0 8 3 5 4 C6 1 6 -2 9 -4Z" fill="#20C997" opacity=".7"/>` +
    L('M0 8 V12 M4 8 V12', '#F06595', 1.6 / Math.abs(s)));

// ── Ilustraciones ──────────────────────────────────────────────────────
export const G3_ART: Record<string, (u: number) => string> = {
  // ═════════ CHINCHÓN ═════════
  // Chinchones
  'Escalera de pintor': () => {
    const xl = (y: number) => 48 - (y - 27) * 8 / 70, xr = (y: number) => 64 + (y - 27) * 8 / 70;
    let rungs = '';
    for (let i = 0; i < 7; i++) {
      const y = f(86 - i * 8.6), a = f(xl(y) - 3.5), b = f(xr(y) + 3.5);
      rungs += R(a, f(y - 3.3), f(b - a), 6.6, 1.6, '#fff', 2) + t(f(a + 3.8), f(y + 2.5), 6.6, String(i + 1), '#E03131') +
        g(`translate(${f(b - 4.6)} ${f(y + .2)}) scale(.42)`, SUIT.c);
    }
    return `<g transform="translate(0 3)">` + stick('M40 98 L48 27', '#C97B45', 4) + stick('M72 98 L64 27', '#C97B45', 4) + rungs +
      R(45, 22, 22, 6, 2, '#A0522D', 2.2) +
      P('M45 23.5 C46 21.5 57 21.5 59 22.5 V27 C59 30 56.4 30 56.4 27 C56 33 52.4 33 52.4 27.6 C52 30 49 30 49 27.5 H45Z', '#4DABF7', 1.8) + `</g>` +
      P('M70.6 52 C69 56 72 58 72.4 55 C73 58 75 56 73.6 52Z', '#4DABF7', 1.4) +
      L('M75 72 C75 61 91 61 91 72', D, 1.8) + P('M75 71 H91 L89 88 C89 91 77 91 77 88Z', '#E9ECEF') + E(83, 71, 8, 2.6, '#4DABF7', 2) +
      P('M76.6 72 V77 C76.6 79.4 79.4 79.4 79.4 77 V72.6Z', '#4DABF7', 1.4) + L('M80 76 H87', '#fff', 1.6, .6) +
      stick('M85 71 L92 52', '#E03131', 3) +
      dot(30, 62, 2.2, '#4DABF7') + dot(34, 70, 1.4, '#F06595') + dot(86, 44, 1.8, '#FCC419') + dot(27, 52, 1.2, '#4DABF7') +
      sparkle(31, 42, 4.5) + sparkle(84, 32, 3.2, '#fff');
  },
  'Escalera Mecano': () => {
    let posts = '', cards = '';
    for (let i = 0; i < 7; i++) {
      const x = f(33 + i * 8.8), y = f(74 - i * 4.4);
      posts += R(f(x - 2.2), y, 4.4, f(92 - y), 1.2, '#40C057', 1.6) +
        Array.from({ length: Math.floor((92 - y - 12) / 5) }, (_, j) => dot(x, f(y + 12 + j * 5), .9, '#fff')).join('');
      cards += ncard(x, y, 0, .72, 'o', i + 1);
    }
    let holes = '';
    for (let j = 0; j < 14; j++) holes += dot(f(26 + j * 5), 0, 1, '#fff');
    return posts + R(18, 88, 84, 6, 2, '#40C057', 2) + cards +
      g('translate(60 61) rotate(-26.5)', R(-36, -2.8, 72, 5.6, 2.8, '#E03131', 1.8) + g('translate(-60 0)', holes)) +
      Array.from({ length: 7 }, (_, i) => `<polygon class="m-ol" style="stroke-width:1.4" points="${starPts(f(33 + i * 8.8 - (i - 3) * .0), f(74 - i * 4.4 + 2), 2.4, 2.1, 3, 0)}" fill="#ADB5BD"/>`).join('') +
      sparkle(32, 40, 4.5) + sparkle(46, 30, 3, '#fff');
  },
  'Escalera al cielo': u => {
    let rays = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30) * Math.PI / 180, b = a + .14, c = a - .14;
      rays += `M${f(78 + 15 * Math.cos(c))} ${f(36 + 15 * Math.sin(c))} L${f(78 + 23 * Math.cos(a))} ${f(36 + 23 * Math.sin(a))} L${f(78 + 15 * Math.cos(b))} ${f(36 + 15 * Math.sin(b))}Z `;
    }
    let cards = '';
    for (let i = 0; i < 7; i++) cards += ncard(f(29 + i * 7.2), f(84 - i * 7.2), i % 2 ? 8 : -8, f(.74 - i * .05), 'c', i + 1);
    return `<defs><linearGradient id="sk${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#74C0FC"/><stop offset="1" stop-color="#E7F5FF"/></linearGradient></defs>` +
      `<rect x="0" y="0" width="120" height="130" fill="url(#sk${u})"/>` +
      `<circle cx="78" cy="36" r="19" fill="#FFF3BF" opacity=".7"/>` + P(rays, '#FFD43B', 1.6) + C(78, 36, 13, '#FFE066', 2.2) +
      g('translate(78 37) scale(1.25)', SUIT.c) + dot(75.5, 31, 1.1) + dot(80.5, 31, 1.1) +
      cloud(34, 52, .9) + cloud(92, 62, .7) + cards + cloud(40, 94, 1.4) + cloud(72, 96, 1.2) + sparkle(52, 30, 3.5, '#fff');
  },
  // Menos diez
  'Cubito de hielo': () =>
    E(60, 90, 28, 5, '#D0EBFF', 2) + L('M40 90 H54 M66 91 H74', '#fff', 1.6, .8) +
    P('M36 46 L48 34 H88 L76 46Z', '#E7F5FF') + P('M76 46 L88 34 V74 L76 86Z', '#74C0FC') + R(36, 46, 40, 40, 5, '#A5D8FF') +
    L('M40 50 H52 M40 50 V62', '#fff', 2.4, .9) + L('M52 38 H80', '#fff', 2, .8) + L('M80 42 V66', '#fff', 1.6, .5) +
    t(56, 63, 14, '-10', '#1971C2', 'stroke="#E7F5FF" stroke-width="2.6" paint-order="stroke"') +
    dot(49, 71, 1.8) + dot(63, 71, 1.8) + dot(49.6, 70.4, .6, '#fff') + dot(63.6, 70.4, .6, '#fff') + blush(45, 75) + blush(67, 75) + smile(56, 75, 3.4) +
    flake(28, 40, 4.5) + flake(94, 82, 3.5) + flake(30, 72, 3) + sparkle(92, 26, 4, '#fff'),
  'Pingüino de vino': () =>
    stick('M74 50 C88 52 90 72 76 78', '#343A40', 4) +
    P('M44 92 C36 78 38 60 46 50 C42 40 48 28 60 28 C72 28 78 38 74 50 C82 60 84 78 76 92Z', '#343A40') +
    P('M48 91 C42 78 44 62 52 56 C57 52 65 52 69 57 C76 65 76 82 72 91Z', '#fff') +
    P('M45 54 C38 60 36 70 38 76 C42 72 44 66 46 60Z', '#212529') +
    `<ellipse cx="56" cy="38" rx="4" ry="4.4" fill="#fff"/><ellipse cx="66" cy="38" rx="4" ry="4.4" fill="#fff"/>` + dot(55, 38.5, 2) + dot(65, 38.5, 2) +
    P('M58 43 L40 38 L42 44 L58 48Z', '#FF922B', 2) + L('M44 40.6 L56 44', '#E8590C', 1.2) +
    hl(52, 31, 4, 1.8) + L('M50 60 C48 66 48 74 50 80', '#E7F5FF', 2.4) +
    t(60, 79, 13, '-10', '#A61E4D') +
    P('M50 92 L46 97 H56 L54 92Z M66 92 L64 97 H74 L70 92Z', '#FF922B', 1.8) +
    P('M41 38 C41 42 43 43 43 45 A2 2 0 0 1 39 45 C39 43 41 42 41 38Z', '#A61E4D', 1.4) +
    L('M48 30 Q52 27 56 28 M64 28 Q68 27 71 30', '#E7F5FF', 2.2) + dot(78, 64, 1.2, '#A5D8FF') + dot(80, 70, .9, '#A5D8FF') + dot(46, 70, 1, '#A5D8FF') +
    flake(30, 54, 4) + flake(90, 40, 3.6) + flake(88, 86, 3),
  'Base Marambio': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#D0EBFF"/>` +
    flake(32, 36, 3, '#fff') + flake(88, 50, 2.6, '#fff') + flake(40, 54, 2.2, '#fff') +
    L('M67 44 V22', D, 2.4) +
    `<g transform="translate(0 0)"><rect class="m-ol" style="stroke-width:2" x="49" y="23" width="18" height="12" rx="1" fill="#fff"/><rect x="50" y="24" width="16" height="3.4" fill="#74C0FC"/><rect x="50" y="30.6" width="16" height="3.4" fill="#74C0FC"/>` +
    `<circle cx="58" cy="29" r="1.6" fill="#FCC419"/><path class="m-ol" style="stroke-width:2" d="M49 23 H67 V35 H49Z" fill="none"/></g>` +
    L('M54 74 V82 M86 74 V82 M70 74 V82', D, 2.6) +
    R(48, 50, 44, 24, 3, '#FF6B1A') + R(52, 42, 22, 10, 2, '#FF922B', 2) +
    [56, 69, 82].map((x) => R(x, 56, 8, 7, 1.6, '#A5D8FF', 1.8) + L(`M${x + 2} ${58} L${x + 4} 60`, '#fff', 1.2)).join('') +
    L('M50 52 H90', '#fff', 1.6, .5) + R(48, 66, 44, 3, 1, '#fff', 1.4) +
    P('M10 80 C30 74 46 82 64 80 C80 78 96 76 112 80 V120 H10Z', '#F8F9FA') + L('M20 88 Q30 85 40 88 M70 90 Q80 87 92 90', '#A5D8FF', 2) +
    // pingüino con cartas
    E(36, 78, 9, 12, '#343A40') + E(36, 81, 6, 8.5, '#fff', 0) + dot(33, 71, 1.4, '#fff') + dot(39, 71, 1.4, '#fff') + dot(33.3, 71.2, .8) + dot(38.7, 71.2, .8) +
    P('M34 74 L36 77.6 L38 74Z', '#FF922B', 1.4) + P('M31 90 L29 93 H35 Z M41 90 L43 93 H37 Z', '#FF922B', 1.4) +
    ncard(44, 78, -14, .38, 'o', 7) + ncard(47, 79, 4, .38, 'c', 7) + ncard(50, 81, 20, .38, 'e', 7) + E(45, 84, 3, 2.2, '#343A40', 1.6) +
    ncard(26, 92, -60, .36, 'b', 1),
  // Cortador serial
  'Tijerita escolar': u => {
    const card = `<rect class="m-ol" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff" style="stroke-width:1.9"/>` +
      `<rect x="-7.4" y="-11.4" width="14.8" height="22.8" rx="1.6" fill="none" stroke="#1971C2" stroke-width="1" stroke-dasharray="7 2.4" opacity=".6"/>` +
      t(-4.6, -4.4, 7.4, '1', '#1971C2') + `<g transform="translate(1.4 3) scale(1.3)">${SUIT.e}</g>`;
    const blade = (sgn: number, c: string) => P(`M2 ${-2 * sgn} L-21 ${-8 * sgn} C-25 ${-9 * sgn} -27 ${-5.5 * sgn} -23 ${-3.5 * sgn} L0 ${2 * sgn}Z`, c, 2);
    const handle = (sgn: number, c: string) => stick(`M2 ${sgn} L8 ${5 * sgn}`, c, 4) +
      `<ellipse cx="15" cy="${8 * sgn}" rx="7.5" ry="5.4" fill="none" stroke="${D}" stroke-width="7.6"/><ellipse cx="15" cy="${8 * sgn}" rx="7.5" ry="5.4" fill="none" stroke="${c}" stroke-width="4"/>` +
      `<path d="M10 ${4.4 * sgn} Q14 ${3 * sgn} 18 ${4 * sgn}" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>`;
    return `<defs><clipPath id="ta${u}"><rect x="-14" y="-18" width="28" height="18"/></clipPath><clipPath id="tb${u}"><rect x="-14" y="0" width="28" height="18"/></clipPath></defs>` +
      g('translate(44 60) scale(1.3) rotate(-14 -10 0)', `<g clip-path="url(#ta${u})">${card}</g>` + L('M-10 0 H10', D, 1.6)) +
      g('translate(44 60) scale(1.3) rotate(10 -10 0)', `<g clip-path="url(#tb${u})">${card}</g>` + L('M-10 0 H10', D, 1.6)) +
      g('translate(66 59) scale(1.1)', blade(-1, '#DEE2E6') + handle(-1, '#FF6B6B') + handle(1, '#4DABF7') + blade(1, '#CED4DA') + C(0, 0, 2.2, '#868E96', 1.4) + L('M-18 -5 L-6 -2', '#fff', 1.4, .8)) +
      `<polygon class="m-ol" style="stroke-width:1.4" points="58,36 62,34 61,39" fill="#FCC419"/><polygon class="m-ol" style="stroke-width:1.4" points="66,82 71,80 69,86" fill="#74C0FC"/>` +
      L('M70 42 L74 36 M78 46 L84 42', D, 2) + sparkle(30, 32, 4) + sparkle(88, 82, 3.4, '#fff');
  },
  'Peluquero de barrio': u =>
    `<defs><clipPath id="pp${u}"><rect x="22" y="34" width="9" height="34" rx="4.5"/></clipPath></defs>` +
    `<rect x="22" y="34" width="9" height="34" rx="4.5" fill="#fff"/><g clip-path="url(#pp${u})">${[0, 1, 2, 3, 4].map((i) => `<path d="M18 ${40 + i * 9} L36 ${30 + i * 9}" stroke="#E03131" stroke-width="3"/><path d="M18 ${44.5 + i * 9} L36 ${34.5 + i * 9}" stroke="#1C7ED6" stroke-width="2"/>`).join('')}</g>` +
    R(22, 34, 9, 34, 4.5, 'none', 2) + R(21, 30, 11, 5, 2, '#ADB5BD', 1.8) + R(21, 67, 11, 5, 2, '#ADB5BD', 1.8) +
    P('M30 102 C30 82 40 72 60 72 C80 72 90 82 90 102Z', '#fff') + P('M52 72 L60 84 L68 72Z', '#A5D8FF', 2) +
    R(55, 60, 10, 14, 3, '#E6A06B', 2) +
    ncard(45, 82, -10, .42, 'c', 4) + R(37, 84, 15, 10, 2, '#E9ECEF', 2) + L('M40 88 H49', '#ADB5BD', 1.4) +
    C(44.5, 50, 3.4, '#F4BE8F', 2) + C(75.5, 50, 3.4, '#F4BE8F', 2) + C(60, 48, 15, '#F4BE8F') +
    P('M45 47 C42 32 52 29 62 30 C72 30 79 36 75 47 C74 41 70 38 64 38 C60 41 52 40 48 40 C47 42 46 44 45 47Z', '#343A40') +
    L('M56 33 C62 32 68 33 72 36', '#868E96', 1.6) +
    L('M51 44 L56 44.6 M64 44.6 L69 44', D, 1.8) + dot(54, 48, 1.7) + dot(66, 48, 1.7) + blush(50, 53) + blush(70, 53) +
    P('M60 54 C56 51.6 50 52 47.6 57 C52 55.6 56 56.6 60 56 C64 56.6 68 55.6 72.4 57 C70 52 64 51.6 60 54Z', '#343A40', 1.6) +
    smile(60, 59, 3, 1.6) +
    stick('M82 82 L88 62', '#fff', 7) + C(88, 58, 4.6, '#F4BE8F', 2) +
    g('translate(88 52) rotate(-8)', P('M-1 0 L-4 -20 C-4.6 -22.6 -2.6 -23 -2 -20.6 L1 -2Z', '#DEE2E6', 1.6) + P('M1 0 L5 -19 C5.6 -21.6 7.6 -21 7 -18.6 L2 -1Z', '#CED4DA', 1.6) + C(.4, -1.4, 1.6, '#868E96', 1.2)) +
    sparkle(78, 32, 3.4) + L('M74 40 L78 38', D, 1.6),
  'Motosierra': () => {
    const teeth = Array.from({ length: 11 }, (_, i) => `M${f(24 + i * 3.6)} 57.6 l1.8 -2.4 l1.8 2.4`).join(' ') + ' ' + Array.from({ length: 11 }, (_, i) => `M${f(24 + i * 3.6)} 70.4 l1.8 2.4 l1.8 -2.4`).join(' ');
    return [0, 1, 2, 3, 4].map((i) => R(26 + i * .6, 74 + i * 3, 30, 4, 1.4, i % 2 ? '#fff' : '#F1F3F5', 1.6)).join('') +
      bcard(62, 30, 34, .5) + ncard(30, 36, -30, .46, 'o', 3) + bcard(46, 26, -12, .4, '#1C7ED6') + ncard(88, 70, 24, .4, 'b', 6) +
      g('rotate(-18 70 60)', P(teeth, '#868E96', 1.2) + R(20, 57.6, 44, 12.8, 6.4, '#CED4DA') + L('M26 61 H58', '#fff', 1.8, .7) + dot(26.6, 64, 1.6, '#868E96') +
        stick('M66 48 C66 36 84 36 86 46', '#343A40', 3.4) +
        P('M58 50 H84 C91 50 94 56 94 63 V70 C94 76 89 78 84 78 H58Z', '#FF922B') + R(58, 50, 9, 28, 2, '#343A40', 2) +
        L('M72 56 H88 M72 60.5 H88 M72 65 H88', '#E8590C', 1.6) + hl(80, 53, 5, 1.4, 0, .7) + C(88, 72, 2.6, '#FFD43B', 1.4)) +
      `<g transform="rotate(-12 72 90)">${t(72, 90, 9, '¡RRRM!', '#E8590C', 'stroke="#fff" stroke-width="2.4" paint-order="stroke"')}</g>` +
      L('M40 50 L34 44 M46 46 L44 40 M52 48 L54 42', D, 1.8) + dot(36, 58, 1.2, '#E8590C') + dot(42, 54, .9, '#868E96') + dot(30, 52, .9, '#868E96');
  },
  // Reenganchado
  'Curita en la rodilla': () => {
    const band = (rot: number) => g(`translate(66 58) rotate(${rot})`, R(-12, -4, 24, 8, 4, '#F2C094', 1.8) + R(-4.4, -3, 8.8, 6, 1.4, '#FFE8CC', 0) +
      dot(-8, -1.4, .6, '#C9824F') + dot(-8, 1.4, .6, '#C9824F') + dot(8, -1.4, .6, '#C9824F') + dot(8, 1.4, .6, '#C9824F'));
    return P('M18 28 L44 26 L50 44 L28 52 L18 52Z', '#4DABF7') +
      stick('M36 42 L66 58 L56 84', '#F4BE8F', 15) +
      P('M18 28 L44 26 L50 42 L30 50 L18 50Z', '#4DABF7') + L('M24 46 L46 38', '#fff', 1.6, .5) + L('M40 30 L44 40', '#1C7ED6', 1.4) +
      R(48, 80, 14, 6, 2, '#fff', 2) + L('M50 82.6 H60', '#E03131', 1.4) +
      P('M46 86 C46 84 62 84 64 86 L74 88 C78 89 78 95 74 95 H46Z', '#E03131') + L('M50 89 H62', '#fff', 1.6) + L('M46 95 H76', '#fff', 1.2, .6) +
      E(66, 58, 8, 7, '#FF8787', 0, 0) + L('M62 55 L67 58 M64 61 L70 57', '#E03131', 1.2) +
      band(45) + band(-45) + dot(66, 58, 1, '#C9824F') +
      L('M76 46 L80 42 M80 52 L86 51 M74 40 L74 35', D, 2) +
      ncard(86, 70, 14, .62, 'b', 2) + g('translate(86 70) rotate(-30)', R(-9, -3, 18, 6, 3, '#F2C094', 1.6) + R(-3, -2.2, 6, 4.4, 1, '#FFE8CC', 0)) +
      sparkle(30, 70, 3.6, '#fff') + sparkle(84, 34, 4);
  },
  'Yeso firmado': () =>
    P('M32 20 L48 58 L58 58 L42 20Z', '#74C0FC') + L('M37 26 L49 54', '#fff', 1.4, .6) +
    ncard(80, 46, -18, .55, 'o', 1) + ncard(85, 44, 0, .55, 'c', 1) + ncard(90, 46, 18, .55, 'e', 1) +
    P('M76 56 C78 52 84 50 88 52 C92 54 92 62 88 66 C84 70 78 68 76 66Z', '#F4BE8F') + L('M82 54 C86 55 88 58 88 62', '#C9824F', 1.2) +
    E(78, 52, 3, 4.4, '#F4BE8F', 1.8, -30) +
    g('rotate(-8 52 66)', R(18, 54, 62, 26, 13, '#F8F9FA') + R(72, 53, 8, 28, 4, '#E9ECEF', 2) +
      L('M28 60 Q32 57 36 60 T44 60', '#4C6EF5', 1.6) + L('M50 72 Q53 68 56 72 Q58 75 62 71', '#E03131', 1.6) + L('M30 72 L34 68 L36 73 L40 69', '#2F9E44', 1.6) +
      heart(64, 61, 3.2, '#FF6B6B', 1.2) + `<rect x="46" y="57" width="6" height="8.4" rx="1" fill="#fff" stroke="#7048E8" stroke-width="1.2" transform="rotate(10 49 61)"/>` +
      t(48.6, 63.6, 4.6, '7', '#7048E8') + t(66, 76, 6, 'TITO', '#F08C00', 'transform="rotate(-6 66 76)"') + star(24, 66, 2.4, '#FFD43B', 1) +
      L('M24 59 Q48 56 70 58', '#fff', 2, .8)) +
    sparkle(30, 86, 4) + sparkle(92, 30, 3.4, '#fff'),
  'Momia andante': () => {
    const wrap = '#F1E3CF', lines = '#C9B79C';
    return stick('M41 36 C34 40 32 48 26 48', wrap, 3) +
      stick('M47 72 L40 93', wrap, 9) + stick('M57 72 L66 92', wrap, 9) + L('M38 82 L46 84 M60 82 L68 80', lines, 1.4) +
      P('M40 46 C40 41 62 41 63 46 L65 74 H39Z', wrap) + L('M41 51 Q52 48 63 52 M40 58 Q52 55 64 59 M40 65 Q52 62 64 66 M42 70 L60 64', lines, 1.4) +
      ncard(84, 42, -16, .48, 'o', 7) + ncard(88, 41, 0, .48, 'c', 7) + ncard(92, 43, 16, .48, 'e', 7) +
      stick('M58 49 L84 49', wrap, 8) + stick('M54 55 L82 54', wrap, 8) + L('M66 46 L67 52 M74 46 L75 52 M68 52 L69 58', lines, 1.2) +
      C(52, 33, 12, wrap) + L('M42 27 Q52 24 62 28 M41 38 Q52 41 63 37', lines, 1.4) + R(41, 29, 22, 7, 3.5, D, 0) +
      dot(47, 32.5, 2.6, '#fff') + dot(57.6, 32.5, 1.8, '#fff') + dot(47.6, 33, 1.2) + dot(58, 32.8, .9) +
      L('M28 76 H20 M30 84 H22 M32 68 H26', D, 2) + sparkle(30, 30, 3.6) + sparkle(80, 74, 3.4, '#fff');
  },

  // ═════════ LA PODRIDA ═════════
  // Bien podrido
  'Banana manchada': () =>
    stick('M62 68 L66 50', '#FFE066', 3) + ncard(68, 40, 10, .7, 'o', 3) + C(66, 50, 3, '#FFE066', 1.8) +
    P('M27 48 C32 82 68 96 90 72 C93 69 93 64 89 64 C70 76 48 70 38 46 C36 42 29 42 27 48Z', '#FFE066') +
    P('M89 65 L95 56 L98.4 58.6 L92 67Z', '#8B5A3C', 1.8) + dot(29, 47, 2, '#5C3A21') +
    L('M33 54 C38 66 50 76 62 78', '#fff', 2.2, .7) +
    [[42, 68, 1.8], [36, 58, 1.4], [72, 82, 2], [80, 76, 1.3], [48, 80, 1.5], [62, 86, 1.2], [84, 70, .9]].map(([x, y, r]) => dot(x, y, r, '#8B5A3C')).join('') +
    dot(54, 76, 1.8) + dot(64, 77, 1.8) + blush(50, 80, 2.2) + blush(69, 80.6, 2.2) + smile(59, 80, 2.8, 1.6) +
    L('M84 44 C82 40 86 38 84 34 M90 50 C88 46 92 44 90 40', '#94D82D', 2) + sparkle(36, 32, 4),
  'Queso azul': () =>
    L('M38 44 C34 38 42 34 38 28 M50 38 C46 32 54 28 50 22', '#82C91E', 2.6) + L('M80 44 C76 38 84 34 80 28', '#82C91E', 2.6) +
    P('M26 66 L64 44 L94 62Z', '#FFF9DB') + P('M26 66 L94 62 V86 L26 92Z', '#FFEC99') +
    L('M40 60 Q48 58 52 54 M62 52 Q70 54 76 58 M48 62 Q56 60 66 60', '#5C7CFA', 1.6) +
    L('M32 72 Q36 76 34 82 M80 66 Q84 72 82 80 M58 84 Q64 82 66 86', '#5C7CFA', 1.6) + dot(36, 86, 1.6, '#748FFC') + dot(88, 74, 1.4, '#748FFC') +
    E(74, 76, 3, 2.4, '#FFE066', 1.6) + E(40, 64, 2.4, 1.2, '#FFE066', 1.4) +
    dot(52, 74, 1.8) + dot(64, 73.4, 1.8) + blush(47, 79, 2.4) + blush(69, 78, 2.4) + smile(58, 78, 3, 1.6) +
    crown(64, 38, .75, -8) + fly(88, 40) + L('M84 44 C80 48 76 44 79 41', D, 1, .6),
  'Heladera abandonada': u =>
    `<defs><radialGradient id="hg${u}" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#D8F5A2"/><stop offset="1" stop-color="#5C940D"/></radialGradient></defs>` +
    `<circle cx="58" cy="60" r="36" fill="#C0EB75" opacity=".35"/>` +
    R(32, 24, 46, 80, 14, '#DEE2E6') + L('M36 34 C36 28 40 27 46 27', '#fff', 2.4, .8) +
    R(37, 31, 36, 64, 9, `url(#hg${u})`) +
    L('M38 52 H72 M38 72 H72', '#F8F9FA', 2.4) +
    ncard(46, 64, -8, .42, 'o', 1) + ncard(54, 64, 6, .42, 'c', 1) + bcard(64, 84, 12, .42, '#7048E8') + ncard(50, 86, -6, .42, 'e', 4) +
    E(62, 42, 3.6, 3.6, '#fff', 1.6) + E(70, 42, 3.6, 3.6, '#fff', 1.6) + dot(63, 43, 1.6) + dot(71, 43, 1.6) +
    P('M78 30 C84 30 92 34 94 38 V92 C92 96 86 100 78 100Z', '#F1F3F5') + stick('M88 50 V64', '#ADB5BD', 2.4) +
    dot(40, 40, 2, '#8B5A3C', .5) + dot(36, 98, 3, '#8B5A3C', .4) + dot(90, 80, 1.6, '#8B5A3C', .5) +
    fly(30, 40) + fly(88, 26) + fly(24, 64) + L('M30 44 C26 50 32 54 28 58', D, 1, .5),
  // Cero absoluto
  'Bolsillo vacío': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#4263EB"/>` + L('M16 34 Q60 50 104 34', '#F59F00', 1.4) + `<path d="M16 38 Q60 54 104 38" fill="none" stroke="#FFD43B" stroke-width="1.2" stroke-dasharray="3 2.4"/>` +
    `<path d="M20 52 Q24 80 20 100 M100 52 Q96 80 100 100" fill="none" stroke="#FFD43B" stroke-width="1.2" stroke-dasharray="3 2.4"/>` +
    P('M36 46 C34 62 38 76 46 82 C50 86 54 84 56 86 C58 90 64 90 66 86 C72 82 82 72 84 46 Q60 56 36 46Z', '#F8F0E3') +
    L('M42 58 C46 66 50 72 54 76 M78 56 C74 66 70 74 66 78 M52 60 C56 66 62 66 66 60', '#D9C7AA', 1.6) +
    P('M28 42 Q60 58 92 42 Q60 50 28 42Z', '#364FC7', 2) + C(30, 42, 2.4, '#E8590C', 1.4) + C(90, 42, 2.4, '#E8590C', 1.4) +
    `<path d="M58 88 C60 94 56 96 58 99" fill="none" stroke="#F8F0E3" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M64 66 C74 58 76 46 68 38" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 3" stroke-linecap="round"/>` +
    g('translate(62 30) rotate(-14) scale(.9)', E(-6, -2, 7, 5, '#CED4DA', 1.8, -20) + E(6, -2, 7, 5, '#CED4DA', 1.8, 20) + E(-4, 3, 4, 3, '#ADB5BD', 1.6, 20) + E(4, 3, 4, 3, '#ADB5BD', 1.6, -20) +
      E(0, 0, 2.4, 5.6, '#8B5A3C', 1.6) + L('M-1 -5 Q-3 -9 -5 -9 M1 -5 Q3 -9 5 -9', D, 1.2) + dot(-.9, -2.4, .7, '#fff') + dot(.9, -2.4, .7, '#fff') + dot(-6, -3, 1.4, '#868E96') + dot(6, -3, 1.4, '#868E96')) +
    dot(70, 58, 1.2, '#fff', .8) + dot(76, 50, .9, '#fff', .8) + dot(48, 46, 1, '#fff', .6),
  'Billetera de jubilado': () =>
    P('M22 44 L58 40 L60 86 L24 84Z', '#8B5A3C') + P('M98 44 L62 40 L60 86 L96 84Z', '#9C6644') +
    `<path d="M26 47 L56 44 L57.6 82 L27.6 80.4Z M94 47 L64 44 L62.4 82 L92.4 80.4Z" fill="none" stroke="#E9C46A" stroke-width="1.2" stroke-dasharray="2.4 2"/>` +
    P('M29 50 L54 48 L55 76 L30 77Z', '#D0EBFF', 1.8) +
    R(34, 54, 16, 18, 1, '#fff', 1.4, ' transform="rotate(-3 42 63)"') + C(42, 61, 4.4, '#F4BE8F', 1.4) + P('M37 59 C37 54 47 54 47 59 C45 57 39 57 37 59Z', '#DEE2E6', 1.2) +
    C(40.2, 61, 1.6, 'none', 1) + C(43.8, 61, 1.6, 'none', 1) + L('M40.6 64.6 Q42 65.6 43.4 64.6', D, 1) + P('M35 72 C35 67 49 67 49 72Z', '#495057', 1.2) +
    L('M31 52 L36 50', '#fff', 1.6, .8) +
    P('M66 52 L92 50 L92.6 58 L66.6 60Z', '#5C3A21', 1.4) +
    g('rotate(-10 78 50)', R(68, 38, 20, 16, 1, '#FFE3E3', 1.6) + L('M71 42 H85 M71 46 H80', '#E03131', 1.2) + t(80, 51.6, 4.6, 'Nº 0', '#495057')) +
    P('M66 62 L92 60.4 L93 80 L67 81Z', '#7F4F35', 1.6) + L('M80 63 L83 67 M86 63 L80 72 M74 64 L84 70 M76 70 L88 66', '#F8F9FA', .8, .7) +
    L('M24 60 L28 61 M93 72 L96 71', '#C9824F', 1.6) + dot(74, 76, 1.6, '#5C3A21', .5) +
    fly(88, 30) + L('M84 34 C78 40 70 34 66 40', D, 1, .5),
  'Monje zen': () => {
    const orb = (a: number) => [f(60 + 36 * Math.cos(a * Math.PI / 180)), f(56 + 13 * Math.sin(a * Math.PI / 180))] as const;
    const card = (a: number, s: Suit, n: number, back = false) => { const [x, y] = orb(a); return back ? bcard(x, y, a / 10, .42) : ncard(x, y, -12 + a / 20, .42, s, n); };
    return `<circle cx="60" cy="42" r="20" fill="#FFF3BF" opacity=".8"/>` +
      card(200, 'o', 0, true) + card(290, 'c', 0) + `<ellipse cx="60" cy="56" rx="36" ry="13" fill="none" stroke="${D}" stroke-width="1.2" stroke-dasharray="2 3" opacity=".5"/>` +
      E(60, 97, 22, 3, '#000', 0) .replace('fill="#000"', 'fill="#000" opacity=".12"') +
      `<ellipse cx="60" cy="84" rx="28" ry="9" fill="none" stroke="${D}" stroke-width="11"/><ellipse cx="60" cy="84" rx="28" ry="9" fill="none" stroke="#FCC419" stroke-width="6"/>` +
      L('M38 81 Q44 78 52 77', '#fff', 1.6, .8) +
      P('M40 80 C40 66 48 56 60 56 C72 56 80 66 80 80 C72 84 48 84 40 80Z', '#FF922B') + P('M50 58 L72 80 L66 82 L46 60Z', '#E8590C', 0) +
      E(60, 80, 24, 6.4, '#F76707') + P('M52 76 C54 72 66 72 68 76 C64 78 56 78 52 76Z', '#F4BE8F', 1.6) +
      R(56, 50, 8, 8, 3, '#F4BE8F', 2) + C(49.6, 43, 2.6, '#F4BE8F', 1.8) + C(70.4, 43, 2.6, '#F4BE8F', 1.8) + C(60, 42, 11, '#F4BE8F') + hl(55, 36, 3, 1.6) +
      L('M53 43 Q55.4 45 57.6 43 M62.4 43 Q64.6 45 67 43', D, 1.6) + blush(52, 47, 2) + blush(68, 47, 2) + L('M58 48.4 Q60 49.6 62 48.4', D, 1.4) + dot(60, 37, 1, '#E8590C') +
      card(30, 'e', 0) + card(130, 'b', 0) + card(80, 'o', 0, true) +
      sparkle(30, 30, 3.6, '#fff') + sparkle(92, 30, 3, '#FFD43B');
  },
  // Pronóstico exacto
  'Balanza de almacén': () =>
    P('M44 96 C44 88 50 86 60 86 C70 86 76 88 76 96Z', '#C97B45') + R(57, 42, 6, 46, 2, '#FAB005') +
    L('M34 42 L26 66 M34 42 L44 66 M86 42 L76 66 M86 42 L96 66', D, 1.6) +
    P('M22 66 H46 C46 74 40 78 34 78 C28 78 22 74 22 66Z', '#FCC419') + P('M74 66 H98 C98 74 92 78 86 78 C80 78 74 74 74 66Z', '#FCC419') +
    ncard(30, 58, -10, .42, 'o', 5) + ncard(37, 58, 8, .42, 'c', 2) + ncard(83, 58, -8, .42, 'e', 3) + ncard(90, 58, 10, .42, 'b', 4) +
    E(34, 66, 12, 2.4, '#FFE066', 1.8) + E(86, 66, 12, 2.4, '#FFE066', 1.8) +
    R(30, 39, 60, 6, 3, '#FAB005') + L('M36 41 H56', '#fff', 1.4, .7) + C(34, 42, 2, '#E67700', 1.4) + C(86, 42, 2, '#E67700', 1.4) +
    P('M44 38 A16 16 0 0 1 76 38Z', '#fff', 2) + L('M48 34 L50 35.6 M54 29.4 L55 31.4 M60 27.6 V30 M66 29.4 L65 31.4 M72 34 L70 35.6', D, 1.2) +
    L('M60 42 V26', '#E03131', 2) + C(60, 42, 3, '#E67700', 1.6) + hl(52, 30, 3, 1.2, -40) +
    sparkle(26, 34, 3.6) + sparkle(94, 34, 3.6) + t(60, 82, 7, '=', '#E67700'),
  'Reloj de estación': () => {
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 20.6 : 18.4;
      ticks += `M${f(60 + r1 * Math.sin(a))} ${f(62 - r1 * Math.cos(a))} L${f(60 + 22.6 * Math.sin(a))} ${f(62 - 22.6 * Math.cos(a))} `;
    }
    const hand = (rot: number, len: number, suit: Suit, n: number) =>
      g(`translate(60 62) rotate(${rot})`, `<rect class="m-ol" style="stroke-width:1.6" x="-3.6" y="${-len}" width="7.2" height="${len + 3}" rx="1.4" fill="#fff"/>` +
        t(0, f(-len + 6.2), 5.6, String(n), SUITC[suit]) + g(`translate(0 ${f(-len / 2 + 2)}) scale(.5)`, SUIT[suit]));
    return P('M44 22 H76 L72 27 H48Z', '#343A40', 2) + L('M60 27 V35', D, 3) + L('M52 27 C46 32 50 36 54 34 M68 27 C74 32 70 36 66 34', D, 1.8) +
      C(60, 62, 28, '#2B8A3E') + C(60, 62, 24, '#FFFBF0', 2) + L('M40 50 C44 42 50 39 56 38', '#fff', 2.2, .8) + L(ticks, D, 1.8) +
      hand(-60, 13, 'o', 10) + hand(0, 19, 'c', 12) + L('M60 62 L71 74', '#E03131', 1.4) + C(60, 62, 2.4, '#E03131', 1.4) +
      C(60, 34.6, 2.4, '#FCC419', 1.4) + sparkle(28, 40, 3.6) + sparkle(92, 82, 3.4, '#fff') + L('M28 70 L22 68 M30 78 L24 80', D, 1.8);
  },
  'Bola de cristal': u =>
    `<defs><radialGradient id="bc${u}" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#F3F0FF"/><stop offset=".6" stop-color="#B197FC"/><stop offset="1" stop-color="#7048E8"/></radialGradient></defs>` +
    P('M14 82 C30 74 46 78 60 76 C74 78 90 74 106 82 V110 H14Z', '#7048E8') +
    [24, 32, 40, 48, 56, 64, 72, 80, 88, 96].map((x) => L(`M${x} ${x < 60 ? 84 + (60 - x) / 20 : 84 + (x - 60) / 20} V${x < 60 ? 90 + (60 - x) / 18 : 90 + (x - 60) / 18}`, '#FCC419', 1.6)).join('') +
    L('M22 82 C36 76 46 80 60 78 C74 80 84 76 98 82', '#FCC419', 1.4) + star(36, 90, 2.6, '#FFD43B', 1.2) + star(84, 90, 2.6, '#FFD43B', 1.2) +
    P('M44 80 C44 72 48 70 52 70 H68 C72 70 76 72 76 80Z', '#FCC419') + L('M48 76 H72', '#E67700', 1.4) +
    C(60, 48, 25, `url(#bc${u})`) +
    ncard(53, 52, -14, .48, 'o', 1) + ncard(60, 50, 0, .48, 'c', 1) + ncard(67, 52, 14, .48, 'e', 1) +
    `<circle cx="60" cy="48" r="25" fill="#fff" opacity=".12"/>` + L('M42 40 C44 32 50 28 56 27', '#fff', 3, .85) + dot(46, 46, 1.6, '#fff', .8) +
    sparkle(26, 36, 4, '#fff') + sparkle(94, 40, 4) + sparkle(88, 24, 2.6, '#fff') + star(30, 62, 3, '#FFD43B', 1.4) + star(92, 64, 2.6, '#FFD43B', 1.4),

  // ═════════ LOVE LETTER ═════════
  // Enamorado
  'Carta perfumada': () =>
    L('M44 40 C40 34 48 30 44 24 M58 38 C54 32 62 28 58 22 M72 40 C68 34 76 30 72 24', '#F783AC', 2.4) +
    heart(36, 28, 3, '#FF8FB1', 1.2) + heart(82, 26, 3.4, '#FF8FB1', 1.2) +
    g('rotate(-6 60 66)', R(28, 46, 64, 42, 4, '#FFF4E6') + L('M28.6 87 L52 68 M91.4 87 L68 68', D, 2) + P('M28 48 L60 72 L92 48 C92 46 90 46 88 46 H32 C30 46 28 46 28 48Z', '#FFE8CC') +
      L('M34 82 H44', '#FFC9C9', 1.4) + C(60, 70, 9, '#C92A2A') + heart(60, 69.6, 4.4, '#FF6B6B', 1.4) + dot(55, 66, 1.2, '#fff', .7) +
      R(78, 50, 10, 12, 1, '#A5D8FF', 1.4) + heart(83, 56, 2.4, '#E64980', 0)) +
    heart(30, 52, 2.6, '#F783AC', 1.2) +
    sparkle(92, 40, 3.4, '#fff'),
  'Serenata al balcón': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#364FC7"/>` + dot(30, 46, 1, '#fff') + dot(50, 30, .8, '#fff') + dot(24, 60, .8, '#fff') + dot(56, 46, .7, '#fff') + star(42, 52, 2.2, '#FFE066', 1) +
    C(36, 34, 9, '#FFF3BF') + `<circle cx="40" cy="31" r="7.4" fill="#364FC7"/>` +
    R(62, 10, 50, 64, 0, '#F8C291') + L('M66 22 H110 M66 36 H110', '#E8A06B', 1.4) +
    R(68, 24, 22, 30, 11, '#FFD43B', 2) + R(70, 26, 18, 28, 9, '#FFE066', 0) +
    C(79, 38, 6, '#F4BE8F', 1.8) + P('M72 36 C72 28 86 28 86 36 C88 42 86 48 86 48 C84 42 82 38 79 36 C76 38 74 42 72 48 C72 48 70 42 72 36Z', '#F08C00', 1.6) +
    crown(79, 30, .5) + dot(77, 38.6, 1) + dot(81, 38.6, 1) + blush(76, 41, 1.4) + blush(82, 41, 1.4) +
    R(64, 46, 30, 4, 1.4, '#495057', 1.8) + L('M67 50 V60 M71 50 V60 M75 50 V60 M79 50 V60 M83 50 V60 M87 50 V60 M91 50 V60', D, 1.6) + R(64, 59, 30, 4, 1.4, '#495057', 1.8) +
    heart(72, 70, 3, '#FF6B6B', 1.2) + note(56, 52, .9, '#FFD43B', 10) + note(64, 70, .8, '#63E6BE', -10) + note(50, 40, .7, '#F783AC') +
    P('M22 104 C22 84 30 78 40 78 C50 78 58 84 58 104Z', '#212529') + P('M36 78 L40 86 L44 78Z', '#fff', 1.4) + P('M38 79 L40 82 L42 79Z', '#E03131', 1) +
    C(40, 66, 10, '#E6A06B') + P('M30 64 C29 54 50 52 50 63 C46 58 36 57 30 64Z', '#212529', 2) +
    L('M36 64 Q37.6 62.6 39 64 M42 64 Q43.6 62.6 45 64', D, 1.4) + P('M36 69 C38 67.6 42 67.6 44 69 C42 70 38 70 36 69Z', '#212529', 1) + smile(40, 71, 2, 1.4) + blush(34.6, 68.6, 1.6) +
    stick('M50 86 L70 70', '#8B5A3C', 3) + P('M30 96 C26 88 32 82 38 85 C42 80 52 82 50 90 C54 96 44 102 38 98 C34 100 30 100 30 96Z', '#E8590C') + C(42, 91, 3, D, 0) + L('M38 86 L44 96', '#FFD43B', .8),
  'Casamiento real': () =>
    L('M40 76 C36 80 34 82 33 84 M42 78 C42 84 42 88 42 92', D, 1.4) +
    g('translate(32 86) rotate(-20)', R(-4, -5, 8, 10, 1.6, '#CED4DA', 1.6) + L('M-4 -2 H4 M-4 2 H4', '#868E96', 1)) + g('translate(42 94) rotate(15)', R(-4, -5, 8, 10, 1.6, '#ADB5BD', 1.6) + L('M-4 -2 H4', '#868E96', 1)) +
    L('M26 90 L22 92 M34 98 L30 100', D, 1.4) +
    P('M38 70 C36 48 48 36 64 36 C80 36 92 48 90 70Z', '#FCC419') + L('M52 40 C56 38 60 37 64 37', '#fff', 2.2, .7) +
    P('M64 36 V70 M44 50 C52 46 76 46 84 50', '#FCC419', 1.6) +
    R(52, 46, 24, 16, 8, '#A5D8FF', 2) + C(58, 56, 4, '#F4BE8F', 1.4) + C(70, 56, 4, '#F4BE8F', 1.4) + crown(58, 50, .38) + dot(57, 56, .8) + dot(59.4, 56, .8) + dot(68.6, 56, .8) + dot(71, 56, .8) +
    P('M66 53 C66 50 74 50 74 53 L75 60 L65 60Z', '#fff', 1.2) + heart(64, 54, 2, '#FF6B6B', 1) +
    R(36, 68, 56, 6, 3, '#E64980') + crown(64, 32, .9) +
    C(48, 82, 9, 'none', 3) + C(80, 82, 9, 'none', 3) + L('M48 73 V91 M39 82 H57 M42 76 L54 88 M54 76 L42 88 M80 73 V91 M71 82 H89 M74 76 L86 88 M86 76 L74 88', D, 1.4) +
    `<circle cx="48" cy="82" r="9" fill="none" stroke="#FCC419" stroke-width="1.6"/><circle cx="80" cy="82" r="9" fill="none" stroke="#FCC419" stroke-width="1.6"/>` + C(48, 82, 2, '#E64980', 1.2) + C(80, 82, 2, '#E64980', 1.2) +
    heart(30, 46, 4, '#FF6B6B', 1.6) + heart(92, 40, 3.4, '#F783AC', 1.4) + heart(40, 30, 2.6, '#F783AC', 1.2) + sparkle(86, 26, 3.4),
  // Ojo de guardia
  'Vigilante de esquina': () =>
    ncard(31, 46, -10, .72, 'e', 1) + L('M24 30 L20 26 M30 28 L30 22 M40 30 L44 26', D, 1.8) +
    P('M38 104 C38 84 48 74 66 74 C84 74 94 84 94 104Z', '#1C3D7A') + L('M66 76 V100', '#FCC419', 1.4) + dot(66, 82, 1.4, '#FCC419') + dot(66, 90, 1.4, '#FCC419') +
    stick('M50 82 L36 66', '#1C3D7A', 8) + P('M30 66 C30 60 38 60 38 64 L40 68 C36 70 32 70 30 66Z', '#F4BE8F', 1.8) + stick('M33 62 L30 55', '#F4BE8F', 2.4) +
    R(60, 60, 12, 16, 3, '#E6A06B', 2) + C(66, 50, 13, '#F4BE8F') +
    P('M50 44 C50 26 58 18 66 18 C74 18 82 26 82 44Z', '#1C3D7A') + R(48, 41, 36, 5, 2.5, '#152C59', 2) + C(66, 32, 4, '#CED4DA', 1.6) + L('M58 24 C62 21 66 20 69 21', '#fff', 1.8, .5) +
    C(66, 17.6, 2.4, '#CED4DA', 1.4) +
    dot(61, 51, 1.6) + dot(71, 51, 1.6) + L('M57 47.6 L63 48.4 M75 47.6 L69 48.4', D, 1.8) + blush(57, 55, 2.2) + blush(75, 55, 2.2) +
    P('M66 56 C62 54 56 55 54 59 C58 58 62 58 66 58 C70 58 74 58 78 59 C76 55 70 54 66 56Z', '#5C3A21', 1.4) +
    g('translate(70 60) rotate(10)', R(0, -2.6, 12, 5.2, 2.6, '#CED4DA', 1.6) + C(10, 0, 4, '#CED4DA', 1.6) + dot(10, 0, 1.4)) +
    L('M88 54 L94 52 M88 60 L95 61 M86 48 L90 44', D, 1.8),
  'Sereno con linterna': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#1B2A4E"/>` + dot(80, 28, 1, '#fff') + dot(92, 40, .8, '#fff') + dot(70, 22, .8, '#fff') + C(86, 30, 6, '#FFF3BF', 1.6) + `<circle cx="89" cy="28" r="5" fill="#1B2A4E"/>` +
    `<path d="M58 64 L56 104 L104 104 L104 70Z" fill="#FFE066" opacity=".45"/>` + `<path d="M58 64 L64 104 L96 104 L104 78Z" fill="#FFF3BF" opacity=".45"/>` +
    ncard(72, 86, -14, .58, 'o', 3) + ncard(86, 80, 12, .54, 'c', 8) + ncard(66, 72, 30, .42, 'b', 5) +
    P('M24 104 C24 74 30 58 42 58 C54 58 58 74 58 104Z', '#5F3DC4') + L('M41 62 V100', '#4C2FA8', 1.6) + dot(44, 70, 1.2, '#FCC419') + dot(44, 80, 1.2, '#FCC419') +
    P('M34 58 C38 62 46 62 50 58 L48 64 C44 66 40 66 36 64Z', '#E03131', 1.8) +
    C(42, 46, 11, '#F4BE8F') + P('M30 44 C30 30 54 30 54 44 Z', '#343A40') + R(28, 42, 30, 4, 2, '#212529', 1.8) +
    dot(38, 48, 1.6) + dot(47, 48, 1.6) + dot(38.5, 47.5, .5, '#fff') + dot(47.5, 47.5, .5, '#fff') + blush(35, 52, 1.8) + blush(50, 52, 1.8) + L('M40 53 H45', D, 1.6) +
    stick('M50 72 L58 66', '#5F3DC4', 6) + L('M60 52 V56', D, 1.8) + P('M54 56 H66 L64 58 H56Z', '#343A40', 1.6) +
    R(55, 58, 10, 12, 2, '#FFE066', 1.8) + flame(60, 67, .38) + R(54, 70, 12, 3, 1.4, '#343A40', 1.6) + `<circle cx="60" cy="64" r="11" fill="#FFE066" opacity=".25"/>` +
    dot(98, 58, 1.4, '#FFD43B') + dot(103, 58, 1.4, '#FFD43B'),
  'Sherlock de barrio': () =>
    P('M22 104 C22 84 32 74 48 74 C64 74 70 84 72 104Z', '#A0522D') + P('M26 82 C34 76 62 76 70 84 L72 94 C62 88 34 88 24 94Z', '#C97B45', 2) +
    L('M30 86 L34 92 M40 84 L42 90 M52 84 L52 90 M62 86 L60 92', '#8B5A3C', 1.2) +
    R(43, 62, 10, 14, 3, '#E6A06B', 2) + C(48, 50, 14, '#F4BE8F') +
    P('M33 46 C32 30 64 30 63 46 C68 48 70 46 72 44 C70 50 64 52 60 48 L36 48 C32 52 26 50 24 46 C27 47 30 47 33 46Z', '#C97B45') +
    L('M38 36 L44 46 M46 34 L50 46 M54 34 L56 46 M40 42 H58', '#8B5A3C', 1.2) + C(48, 32, 2.2, '#8B5A3C', 1.4) +
    P('M35 47 L33 58 L37 57 L38 48Z', '#C97B45', 1.6) +
    dot(43, 54, 1.6) + L('M39 50 L45 50.6', D, 1.6) + blush(40, 58, 2) + L('M46 61 Q49 62.6 52 61', D, 1.6) +
    mate(31, 82, .55) +
    ncard(76, 90, -14, .5, 'c', 12) + ncard(88, 88, 10, .5, 'o', 1) +
    stick('M72 66 L84 82', '#5C3A21', 4) + `<circle cx="64" cy="56" r="11" fill="#E7F5FF" opacity=".75"/>` + `<ellipse cx="62" cy="56" rx="4.6" ry="4.6" fill="#fff"/>` + dot(61, 56, 3) + dot(62.4, 54.6, 1, '#fff') +
    `<circle cx="64" cy="56" r="11" fill="none" stroke="${D}" stroke-width="6.4"/><circle cx="64" cy="56" r="11" fill="none" stroke="#FCC419" stroke-width="3.2"/>` +
    L('M57 50 C58 48 60 47 62 47', '#fff', 2, .9) + L('M54 48 L58 47', D, 1.8) + sparkle(90, 34, 4) + sparkle(30, 26, 3, '#fff'),
  // Corazón roto
  'Mensaje en visto': () =>
    g('rotate(-8 58 60)', R(36, 24, 44, 74, 8, '#343A40') + R(40, 34, 36, 58, 3, '#E9ECEF', 1.6) + R(52, 28, 12, 2.6, 1.3, '#868E96', 0) +
      R(40, 34, 36, 10, 3, '#4DABF7', 0) + C(46, 39, 3.2, '#FFDEEB', 1.2) + crown(46, 38.6, .22) + `<rect x="51" y="37" width="16" height="2.6" rx="1.3" fill="#fff"/>` +
      P('M50 52 H72 C73.6 52 74 53 74 54 V68 C74 70 73 70.6 72 70.6 H54 L50 74 L51 70.6 C49.6 70 49 69 49 68 V54 C49 53 49.6 52 50 52Z', '#B2F2BB', 1.6) +
      heart(61.4, 61, 5.4, '#FF6B6B', 1.4) + L('M62 67.4 L64 69 L67 66 M66 67.4 L68 69 L71 66', '#1C7ED6', 1.4) +
      `<rect x="42" y="78" width="32" height="7" rx="3.5" fill="#fff"/><path d="M44 81.6 H58" stroke="#CED4DA" stroke-width="1.4" stroke-linecap="round"/>`) +
    P('M88 42 C86 38 89 35 92 37 C95 35 98 38 96 42 L92 46Z', '#FF8787', 1.6) + L('M92 37 L91 40 L93 42 L92 45', D, 1.2) +
    t(28, 44, 9, '?', '#ADB5BD') + t(24, 58, 7, '?', '#CED4DA') + `<path d="M28 74 C28 78 30 79 30 81 A2 2 0 0 1 26 81 C26 79 28 78 28 74Z" fill="#74C0FC" stroke="${D}" stroke-width="1.4"/>`,
  'Bolero en la rocola': () =>
    P('M30 100 V54 C30 26 90 26 90 54 V100Z', '#C2255C') +
    `<path d="M36 100 V55 C36 34 84 34 84 55 V100" fill="none" stroke="${D}" stroke-width="6.4"/>` +
    `<path d="M36 100 V55 C36 34 84 34 84 55 V100" fill="none" stroke="#FFD43B" stroke-width="2.4"/><path d="M36 100 V55 C36 34 84 34 84 55 V100" fill="none" stroke="#FF922B" stroke-width="2.4" stroke-dasharray="3 5"/>` +
    P('M42 66 V56 C42 40 78 40 78 56 V66Z', '#212529') + C(60, 54, 10, '#495057', 0) + C(60, 54, 10, 'none', 1.4) + L('M53 54 A7 7 0 0 1 60 47', '#868E96', 1) +
    C(60, 54, 2.6, '#FF6B6B', 1.2) + R(44, 70, 32, 10, 3, '#FFF3BF') +
    `<g transform="translate(60 75)"><path class="m-ol" style="stroke-width:1.4" d="M-1 3.6 C-6 0 -6.4 -3.6 -3.6 -4 C-2.4 -4.2 -1.4 -3.4 -1 -2.6 L-2 -.4 L-.2 1 Z" fill="#E03131"/><path class="m-ol" style="stroke-width:1.4" d="M1 3.6 C6 0 6.4 -3.6 3.6 -4 C2.4 -4.2 1.4 -3.4 1 -2.6 L1.4 -1 L.4 .6Z" fill="#E03131"/></g>` +
    R(42, 84, 36, 14, 3, '#862E9C') + L('M46 88 H74 M46 92 H74 M46 96 H74', '#DA77F2', 1.2) +
    dot(39, 46, 1.8, '#63E6BE') + dot(81, 46, 1.8, '#63E6BE') +
    note(24, 40, .9, '#74C0FC', 20) + note(96, 46, .9, '#74C0FC', -20) + note(22, 64, .7, '#A5D8FF', 30) + note(98, 66, .7, '#A5D8FF', -25) +
    `<path d="M20 50 C22 46 26 46 28 50" fill="none" stroke="${D}" stroke-width="1" opacity=".0"/>`,
  'Plantado en el altar': () =>
    `<path d="M28 100 V50 C28 24 92 24 92 50 V100" fill="none" stroke="${D}" stroke-width="9"/><path d="M28 100 V50 C28 24 92 24 92 50 V100" fill="none" stroke="#fff" stroke-width="5"/>` +
    [[29, 60], [31, 42], [40, 31], [52, 26], [68, 26], [80, 31], [89, 42], [91, 60], [29, 80], [91, 80]].map(([x, y], i) => C(x, y, 2.6, i % 2 ? '#FFA8A8' : '#F783AC', 1.4)).join('') +
    `<path d="M68 50 C74 44 76 40 78 38" fill="none" stroke="${D}" stroke-width="1.4" stroke-dasharray="2 2.6"/>` +
    g('translate(82 30) rotate(24)', P('M-10 -8 C-16 -14 -20 -8 -16 -4Z M10 -8 C16 -14 20 -8 16 -4Z', '#fff', 1.4)) + pcard(82, 30, 24, .5) +
    P('M34 104 C34 84 42 72 56 72 C70 72 78 84 78 104Z', '#212529') + P('M50 72 L56 90 L62 72Z', '#fff', 1.6) + P('M52 74 L56 77 L60 74 L60 79 L56 76.4 L52 79Z', '#212529', 1) +
    R(51, 62, 10, 12, 3, '#F4BE8F', 2) + C(56, 50, 12, '#F4BE8F') + P('M44 48 C43 36 68 34 68 46 C64 42 56 40 50 42 C48 44 46 46 44 48Z', '#5C3A21') +
    L('M49 48 L53 49.4 M63 48 L59 49.4', D, 1.6) + dot(51.4, 52, 1.5) + dot(60.6, 52, 1.5) + frown(56, 59, 3, 1.6) +
    `<path d="M49 54 C49 58 50 59 50 60.6 A1.6 1.6 0 0 1 46.8 60.6 C46.8 59 48 58 49 54Z" fill="#74C0FC" stroke="${D}" stroke-width="1.2"/>` +
    stick('M72 86 L66 80', '#212529', 6) + L('M72 84 L80 76', '#2F9E44', 2) +
    P('M80 76 C78 82 74 84 72 86', 'none', 1.4) + C(82, 74, 3, '#C9B79C', 1.4) + C(78, 79, 2.6, '#ADB5BD', 1.4) + C(84, 79, 2.4, '#C9B79C', 1.4) +
    `<path d="M84 82 L86 88 M80 84 L80 90" stroke="#C9B79C" stroke-width="1.6" stroke-linecap="round"/>`,

  // ═════════ ESCOBA DE 15 ═════════
  // Barrendero
  'Escobillón': () =>
    `<rect x="0" y="88" width="120" height="20" fill="#DEE2E6"/>` + L('M0 88 H120 M30 88 V104 M60 88 V104 M90 88 V104', '#ADB5BD', 1.2) +
    stick('M54 72 L90 30', '#E03131', 3.6) +
    g('rotate(-8 50 78)', R(30, 72, 42, 8, 2.4, '#C97B45') + `<path d="M32 80 L31 90 M36 80 L35.4 90 M40 80 L39.6 90 M44 80 L43.8 90 M48 80 V90 M52 80 V90 M56 80 L56.2 90 M60 80 L60.4 90 M64 80 L64.6 90 M68 80 L69 90" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="M32 80 L31 90 M36 80 L35.4 90 M40 80 L39.6 90 M44 80 L43.8 90 M48 80 V90 M52 80 V90 M56 80 L56.2 90 M60 80 L60.4 90 M64 80 L64.6 90 M68 80 L69 90" stroke="#FFD43B" stroke-width="1"/>` + L('M34 74.6 H60', '#fff', 1.4, .6)) +
    ncard(24, 80, -30, .5, 'o', 7) + ncard(30, 64, -50, .46, 'c', 3) + ncard(40, 52, -20, .42, 'e', 5) +
    cloud(26, 92, .5) + dot(36, 46, 1.2, '#ADB5BD') + dot(30, 54, 1, '#ADB5BD') +
    L('M44 44 L38 40 M48 40 L46 34', D, 1.8) + sparkle(86, 80, 4, '#fff') + sparkle(78, 70, 2.6, '#fff') + sparkle(90, 54, 3),
  'Escoba de bruja': () =>
    C(64, 50, 27, '#FFE066', 0) + `<circle cx="64" cy="50" r="27" fill="#FFF3BF" opacity=".45"/>` + dot(54, 38, 3.4, '#FCC419', .7) + dot(78, 62, 4.4, '#FCC419', .7) + dot(74, 34, 2, '#FCC419', .7) +
    ncard(26, 70, -24, .42, 'o', 1) + ncard(34, 86, 18, .4, 'c', 2) + ncard(28, 50, 10, .38, 'e', 3) + sparkle(40, 74, 2.6, '#fff') + sparkle(38, 58, 2.2) +
    L('M36 76 C42 78 46 76 50 74 M34 64 C40 66 44 66 48 66', D, 1.4, .5) +
    P('M54 64 C46 66 40 70 34 76 C44 76 50 72 56 70Z', '#7048E8') +
    stick('M40 78 L96 62', '#8B5A3C', 3) +
    P('M42 76 L26 70 L22 78 L24 88 Z', '#FCC419') + L('M28 74 L42 77 M26 80 L41 78 M27 85 L41 79', '#E67700', 1.2) + R(39, 73, 5, 8, 1.6, '#E03131', 1.6, ' transform="rotate(-16 41.5 77)"') +
    P('M52 72 C52 62 56 56 62 56 C68 56 72 62 72 70Z', '#7048E8') + P('M66 70 L74 76 L80 74 L76 70Z', '#212529', 1.8) + L('M64 70 L70 73', D, 1.6) +
    C(62, 48, 8.4, '#FFD8B5') + P('M54 46 C52 52 50 56 48 58 C52 58 54 56 56 54Z M70 46 C72 52 72 56 74 58 C70 58 68 56 68 52Z', '#FF922B', 1.6) +
    E(62, 41, 15, 3.2, '#5F3DC4', 2) + P('M52 40 C54 32 54 24 48 18 C58 20 66 28 72 40Z', '#5F3DC4') + R(53, 35, 17, 3.4, 1.4, '#FF922B', 1.4, ' transform="rotate(-4 61 37)"') +
    dot(59, 48, 1.4) + dot(66, 48, 1.4) + blush(57, 51.4, 1.8) + blush(68, 51.4, 1.8) + smile(62.4, 51.6, 2.2, 1.4) +
    stick('M60 64 L72 64', '#7048E8', 3.4) + C(74, 64, 2.6, '#FFD8B5', 1.6) +
    sparkle(86, 30, 3.6, '#fff') + star(92, 46, 2.6, '#FFD43B', 1.2),
  'Barrendero de oro': () => {
    let rays = '';
    for (let i = 0; i < 16; i++) { const a = i * 22.5 * Math.PI / 180, b = a + .2; rays += `M60 58 L${f(60 + 70 * Math.cos(a))} ${f(58 + 70 * Math.sin(a))} L${f(60 + 70 * Math.cos(b))} ${f(58 + 70 * Math.sin(b))}Z `; }
    return `<path d="${rays}" fill="#FFE066" opacity=".55"/>` +
      P('M36 104 C36 84 46 74 60 74 C74 74 84 84 84 104Z', '#FCC419') + L('M40 90 H80 M38 97 H82', '#E9ECEF', 3) + L('M40 90 H80 M38 97 H82', '#ADB5BD', 1, .6) +
      P('M54 74 L60 82 L66 74Z', '#FFF3BF', 1.6) + R(55, 63, 10, 12, 3, '#E6A06B', 2) +
      C(60, 54, 12.4, '#F4BE8F') + P('M47 52 C46 40 74 40 73 52Z', '#FAB005') + P('M71 49 C78 48 84 50 84 52 C80 53 74 53 70 52Z', '#E67700', 1.8) + L('M52 43 C56 41 60 41 63 42', '#fff', 1.6, .8) + star(60, 46.6, 2.4, '#fff', 1) +
      L('M52.6 55.6 Q54.4 53.6 56.2 55.6 M63.8 55.6 Q65.6 53.6 67.4 55.6', D, 1.6) + blush(51.6, 59, 2) + blush(68.4, 59, 2) +
      P('M60 60 C57 58.4 53 59 52 62 C55 61 58 61.6 60 61.4 C62 61.6 65 61 68 62 C67 59 63 58.4 60 60Z', '#5C3A21', 1.2) + smile(60, 63.4, 2.4, 1.4) +
      stick('M84 100 L84 50', '#FCC419', 3.4) + R(79, 46, 10, 6, 2, '#E67700', 1.8) +
      P('M79.6 46 L76 32 C80 30 88 30 92 32 L88.4 46Z', '#FFD43B') + L('M80 44 L78.6 34 M84 44 V33 M88 44 L89.4 34', '#E67700', 1.4) +
      stick('M74 84 L82 76', '#FCC419', 6) + C(84, 74, 4.4, '#F4BE8F', 1.8) +
      sparkle(88, 34, 4.6, '#fff') + sparkle(30, 40, 4.6) + sparkle(86, 62, 3) + sparkle(34, 64, 3, '#fff');
  },
  // Limpieza a fondo
  'Plumero': () => {
    const cols = ['#E03131', '#FF922B', '#FFD43B', '#40C057', '#4DABF7', '#7048E8', '#F06595'];
    let fe = '';
    cols.forEach((c, i) => {
      const deg = -150 + i * 22, a = deg * Math.PI / 180, x = f(50 + 15 * Math.cos(a)), y = f(62 + 15 * Math.sin(a));
      fe += E(x, y, 13, 5.4, c, 2, deg) + L(`M${f(50 + 5 * Math.cos(a))} ${f(62 + 5 * Math.sin(a))} L${f(50 + 25 * Math.cos(a))} ${f(62 + 25 * Math.sin(a))}`, '#fff', 1, .6);
    });
    return ncard(84, 64, 24, .55, 'o', 7) + ncard(76, 84, -12, .5, 'c', 1) + ncard(90, 48, 40, .42, 'e', 4) +
      L('M70 56 L76 52 M68 66 L74 68 M66 76 L70 80', D, 1.8) + cloud(78, 36, .45) + cloud(70, 92, .4) +
      stick('M30 96 L48 66', '#8B5A3C', 4) + fe + C(50, 63, 4, '#E8590C', 1.8) + L('M34 88 L40 79', '#fff', 1.4, .5) +
      sparkle(28, 46, 4) + sparkle(64, 32, 3, '#fff');
  },
  'Aspiradora': () =>
    ncard(30, 50, -30, .44, 'o', 2) + ncard(28, 70, 26, .42, 'c', 6) + ncard(42, 40, 50, .36, 'b', 5) + bcard(38, 82, -40, .38) +
    L('M48 62 C40 58 36 52 34 46 M48 66 C40 68 36 72 34 78 M50 60 C46 52 44 46 46 40', '#74C0FC', 1.6) +
    E(84, 94, 3.6, 3.6, D, 0) + E(70, 94, 3.6, 3.6, D, 0) +
    P('M64 92 C60 76 68 64 82 64 C94 64 98 76 96 92Z', '#E03131') + P('M68 70 C72 66 80 65 86 66 L84 72 C78 71 72 72 68 74Z', '#FA5252', 0) +
    E(80, 64, 12, 4, '#FF8787', 2) + R(76, 58, 8, 5, 2, '#343A40', 1.6) + L('M70 70 C72 68 74 67 76 67', '#fff', 2, .7) +
    C(70, 92, 3.6, '#495057', 1.8) + C(88, 92, 3.6, '#495057', 1.8) + C(84, 80, 4, '#FFD43B', 1.6) +
    `<path d="M66 76 C54 76 60 60 54 56" fill="none" stroke="${D}" stroke-width="7.4" stroke-linecap="round"/><path d="M66 76 C54 76 60 60 54 56" fill="none" stroke="#868E96" stroke-width="3.8" stroke-linecap="round" stroke-dasharray="2.4 1.4"/>` +
    stick('M54 56 L50 60', '#CED4DA', 3.6) + P('M50 56 L46 54 L40 64 L44 68 L52 64Z', '#495057', 2) + L('M44 57 L42 62', '#fff', 1.2, .5) +
    sparkle(84, 40, 4) + sparkle(96, 54, 2.6, '#fff'),
  'Tornado de patio': u => {
    const tiles = Array.from({ length: 8 }, (_, i) => `<rect x="${12 + i * 12}" y="86" width="12" height="12" fill="${i % 2 ? '#fff' : '#343A40'}"/><rect x="${12 + i * 12}" y="98" width="12" height="12" fill="${i % 2 ? '#343A40' : '#fff'}"/>`).join('');
    return `<defs><clipPath id="tz${u}"><path d="M24 26 C40 18 80 18 96 26 C92 40 76 48 72 60 C68 72 68 82 63 90 C59 92 56 88 57 82 C58 68 44 52 32 42Z"/></clipPath></defs>` +
      `<rect x="0" y="86" width="120" height="30" fill="#fff"/>` + tiles + L('M0 86 H120', D, 2.4) +
      `<path d="M24 26 C40 18 80 18 96 26 C92 40 76 48 72 60 C68 72 68 82 63 90 C59 92 56 88 57 82 C58 68 44 52 32 42Z" fill="#ADB5BD"/>` +
      `<g clip-path="url(#tz${u})">` + L('M20 30 Q60 42 100 28 M26 42 Q60 52 90 38 M36 54 Q58 62 80 50 M46 66 Q60 70 74 62 M52 78 Q62 80 70 74', '#DEE2E6', 3) + L('M20 36 Q60 46 98 34 M40 60 Q60 66 78 56', '#868E96', 1.6) + `</g>` +
      P('M24 26 C40 18 80 18 96 26 C92 40 76 48 72 60 C68 72 68 82 63 90 C59 92 56 88 57 82 C58 68 44 52 32 42Z', 'none') +
      cloud(52, 90, .45) + cloud(72, 91, .4) +
      g('translate(84 58) rotate(28)', R(-10, -3, 20, 4, 1.4, '#C97B45', 1.8) + L('M-8 1 V10 M8 1 V10', D, 3.6) + L('M-8 1 V10 M8 1 V10', '#C97B45', 1.6)) +
      g('translate(32 66) rotate(-24)', L('M-5 -10 V8 M5 0 V8 M-5 0 H5', D, 3.6) + L('M-5 -10 V8 M5 0 V8 M-5 0 H5', '#E8590C', 1.6)) +
      ncard(30, 44, -30, .4, 'o', 7) + ncard(88, 36, 30, .38, 'c', 3) + ncard(78, 80, -20, .36, 'e', 1) + bcard(44, 82, 40, .34) + ncard(66, 36, 60, .34, 'b', 4) +
      L('M22 56 L18 54 M98 52 L102 50', D, 1.6);
  },
  // El siete bello
  'Moneda de oro': () => {
    let pips = '';
    for (let i = 0; i < 7; i++) { const a = (-90 + i * 360 / 7) * Math.PI / 180; pips += C(f(60 + 22.4 * Math.cos(a)), f(57 + 22.4 * Math.sin(a)), 2.2, '#FFE066', 1.3); }
    return E(60, 90, 24, 4, '#000', 0).replace('fill="#000"', 'fill="#000" opacity=".12"') +
      C(60, 60, 29, '#E67700') + C(60, 57, 29, '#FCC419') + `<circle cx="60" cy="57" r="24.6" fill="none" stroke="#E67700" stroke-width="2"/>` + pips +
      t(61.4, 69.4, 34, '7', '#FFE066') + t(60, 68, 34, '7', '#E67700') +
      L('M38 44 C42 36 50 31 58 30', '#fff', 3, .85) + hl(40, 50, 2, 1.2, 0, .9) +
      coin(90, 82, 7) + coin(30, 82, 6) + sparkle(88, 32, 5, '#fff') + sparkle(30, 34, 3.6) + sparkle(84, 54, 2.6, '#fff');
  },
  'Lingote': () =>
    P('M14 82 C30 78 90 78 106 82 V110 H14Z', '#fff') + L('M20 82 V110 M26 81 V110 M32 80 V110 M38 80 V110 M44 80 V110 M50 79 V110 M56 79 V110 M62 79 V110 M68 79 V110 M74 79 V110 M80 80 V110 M86 80 V110 M92 80 V110 M98 81 V110', '#74C0FC', 2) + P('M14 82 C30 78 90 78 106 82', 'none') + dot(36, 92, 1.6, '#1C7ED6') + dot(60, 94, 1.6, '#1C7ED6') + dot(84, 92, 1.6, '#1C7ED6') +
    `<ellipse cx="60" cy="84" rx="30" ry="3" fill="#000" opacity=".12"/>` +
    P('M38 52 H82 L92 82 H28Z', '#FAB005') + P('M44 40 H76 L82 52 H38Z', '#FFE066') + P('M82 52 L92 82', 'none') +
    t(61.2, 77.2, 22, '7', '#E67700', 'opacity=".55"') + t(60, 76, 22, '7', '#FFF3BF', 'stroke="#E67700" stroke-width="1.6" paint-order="stroke"') +
    L('M46 44 H70', '#fff', 2, .9) + L('M40 57 L34 76', '#fff', 2.4, .8) + L('M46 48 H74', '#FAB005', 1.2) +
    coin(30, 70, 6) + coin(92, 72, 5.4) + sparkle(86, 36, 5, '#fff') + sparkle(32, 44, 4) + sparkle(70, 30, 2.6),
  'Bóveda del Central': u => {
    const bar = (x: number, y: number) => P(`M${x - 8} ${y} H${x + 8} L${x + 10} ${y + 7} H${x - 10}Z`, '#FCC419', 1.6) + L(`M${x - 6} ${y + 1.6} H${x + 4}`, '#fff', 1.2, .7);
    let bolts = '';
    for (let i = 0; i < 10; i++) { const a = i * 36 * Math.PI / 180; bolts += dot(f(66 + 26.6 * Math.cos(a)), f(58 + 26.6 * Math.sin(a)), 1.4, '#868E96'); }
    return `<defs><radialGradient id="bv${u}" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFE066"/><stop offset="1" stop-color="#495057"/></radialGradient></defs>` +
      `<rect x="0" y="0" width="120" height="130" fill="#868E96"/>` + L('M0 30 H120 M0 50 H120 M0 70 H120 M0 90 H120', '#ADB5BD', 1.2) +
      C(66, 58, 29, '#CED4DA') + bolts + C(66, 58, 23, `url(#bv${u})`, 2.4) +
      bar(56, 74) + bar(76, 74) + bar(66, 67) + bar(46, 81) + bar(66, 81) + bar(86, 81).replace('', '') +
      t(66, 60, 12, '7', '#FCC419', 'stroke="#5C3A21" stroke-width="2.4" paint-order="stroke"') + sparkle(54, 50, 2.6, '#fff') + sparkle(78, 52, 2.2, '#fff') +
      E(28, 60, 9, 26, '#ADB5BD') + E(29.6, 60, 6, 20, '#CED4DA', 2) +
      L('M29.6 50 V70 M24.6 54 L34.6 66 M24.6 66 L34.6 54', D, 3.6) + L('M29.6 50 V70 M24.6 54 L34.6 66 M24.6 66 L34.6 54', '#FCC419', 1.6) + C(29.6, 60, 2.6, '#FCC419', 1.4) +
      L('M37 50 L37 70', D, 3) +
      coin(46, 94, 6) + coin(80, 95, 6) + t(46, 96.6, 7, '7', '#E67700') + t(80, 97.6, 7, '7', '#E67700') + sparkle(90, 30, 4) + sparkle(42, 28, 3, '#fff');
  },

  // ═════════ WINGSPAN ═════════
  // Ornitólogo
  'Binoculares': u => {
    const lens = (x: number, b: string) => C(x, 66, 13.4, '#343A40', 2.4) + C(x, 66, 10.4, `url(#bl${u})`, 1.8) + b + L(`M${x - 7} 60 C${x - 5} 57 ${x - 2} 56 ${x + 1} 56`, '#fff', 2, .9) + dot(x + 6, 72, 1.1, '#fff', .8);
    return `<defs><radialGradient id="bl${u}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#E7F5FF"/><stop offset="1" stop-color="#4DABF7"/></radialGradient></defs>` +
      L('M28 46 C18 60 22 84 38 94', D, 4.4) + L('M28 46 C18 60 22 84 38 94', '#E03131', 2) +
      R(34, 30, 16, 12, 3, '#495057') + R(70, 30, 16, 12, 3, '#495057') + L('M37 33 H47 M73 33 H83', '#868E96', 1.4) +
      R(26, 38, 33, 46, 13, '#2F9E44') + R(61, 38, 33, 46, 13, '#2F9E44') + R(53, 40, 14, 18, 3, '#343A40') +
      L('M56 43 V55 M60 43 V55 M64 43 V55', '#868E96', 1.4) + L('M31 46 C33 42 36 41 40 41 M66 46 C68 42 71 41 75 41', '#fff', 2, .55) +
      lens(42.5, bird(43, 68, .42, '#E03131', '#C92A2A')) + lens(77.5, bird(77, 68, -.42, '#FCC419', '#F08C00')) +
      sparkle(90, 28, 4) + sparkle(28, 30, 3, '#fff');
  },
  'Guía de campo': () =>
    P('M20 44 V92 C36 88 50 88 60 94 C70 88 84 88 100 92 V44Z', '#2F9E44') +
    P('M60 46 C50 40 36 40 24 44 V88 C36 84 50 84 60 90Z', '#FFF9DB') + P('M60 46 C70 40 84 40 96 44 V88 C84 84 70 84 60 90Z', '#FFFDF0') +
    L('M28 74 C36 72 46 72 56 75 M28 79 C36 77 44 77 52 79 M64 75 C72 72 80 72 92 74 M64 80 C70 78 78 78 86 79', '#A5D8FF', 1.2) +
    bird(41, 60, .78, '#E03131', '#C92A2A', '#495057') + bird(80, 60, -.76, '#4DABF7', '#1C7ED6', '#495057', '#fff') +
    L('M30 46 Q36 44 40 46 M70 46 L74 50 L80 44', '#2F9E44', 1.6) + egg(91, 52, .32, '#A5D8FF', '#4DABF7') +
    g('translate(76 84) rotate(-34)', R(-18, -3, 30, 6, 1, '#FCC419', 1.8) + P('M12 -3 L19 0 L12 3Z', '#F4BE8F', 1.6) + dot(17.6, 0, 1) + R(-22, -3, 5, 6, 1.4, '#FF8FA3', 1.6) + L('M-15 -1.2 H8', '#fff', 1, .7)) +
    sparkle(30, 32, 3.6) + sparkle(90, 32, 3, '#fff'),
  'Hombre pájaro': () => {
    const S = '#5FB3A8', Sd = '#3E8E84';
    return R(36, 82, 48, 24, 2, '#CED4DA') + R(32, 78, 56, 6, 2, '#ADB5BD') + R(50, 88, 20, 7, 1, '#FCC419', 1.6) + L('M54 91.4 H66', '#E67700', 1.2) +
      stick('M54 64 L52 78', S, 7) + stick('M66 64 L68 78', S, 7) +
      stick('M48 52 L28 56', S, 6) + stick('M72 52 L92 56', S, 6) +
      P('M46 50 C46 45 74 45 74 50 L72 68 H48Z', S) + L('M60 47 V66', Sd, 1.4) + P('M52 46 L60 54 L68 46Z', Sd, 1.4) +
      C(60, 38, 9.6, S) + L('M55 37.6 H58 M62 37.6 H65', Sd, 1.6) + P('M60 42 C57 40.6 53 41.4 52.6 44 C55 43 58 43.6 60 43.4 C62 43.6 65 43 67.4 44 C67 41.4 63 40.6 60 42Z', Sd, 1.2) +
      P('M54 30 C54 34 56 35 55 38 C54 35 52 34 52 32Z M75 49 C75 52 77 53 76 56 C75 53 73 52 73 50Z', '#fff', 1.2) +
      bird(60, 25, .5, '#E03131', '#C92A2A') + pigeon(30, 47, -.5) + bird(90, 47, .5, '#FCC419', '#F08C00') + bird(76, 42, .36, '#4DABF7', '#1C7ED6') +
      L('M38 30 L34 28 M84 28 L88 26', D, 1.6) + note(40, 36, .6, '#20C997');
  },
  // Gallinero
  'Nido de hornero': () =>
    R(52, 78, 16, 30, 2, '#8B5A3C') + L('M56 84 V100 M63 82 V96', '#5C3A21', 1.2) +
    P('M30 78 C28 54 42 42 60 42 C78 42 92 54 90 78Z', '#C8865A') +
    L('M38 60 L44 58 M76 56 L82 60 M40 70 L46 70 M72 68 L80 70 M52 50 L58 49 M66 50 L72 52', '#A0643C', 1.6) + L('M36 64 C38 56 44 50 50 48', '#E6A97A', 2.4, .8) +
    P('M50 78 V68 C50 58 70 58 70 68 V78Z', '#5C3A21', 2) +
    egg(56, 73, .42, '#fff', '#CED4DA') + egg(64.6, 73.4, .42, '#fff', '#CED4DA') +
    E(60, 79, 33, 4, '#A0643C') +
    bird(62, 35, .6, '#C97B45', '#A0522D', '#495057', '#F4D9B5') + note(84, 34, .6, '#FF922B', 10) +
    sparkle(30, 40, 3.6) + L('M24 86 L96 86', 'none', 0),
  'Maple de huevos': () => {
    const rows: [number, number, number][] = [[48, 21.9, .58], [63, 25.6, .68], [79, 29.4, .8]];
    const cols = ['#74C0FC', '#B2F2BB', '#FFF3BF', '#E599F7', '#FFA8A8', '#fff', '#FFD8A8', '#A5D8FF', '#D0BFFF', '#C3FAE8', '#FFC9C9', '#FFEC99'];
    const sp = ['#1C7ED6', '#2F9E44', '#E67700', '#9C36B5', '#E03131', '#868E96', '#E8590C', '#1971C2', '#6741D9', '#0CA678', '#C92A2A', '#F08C00'];
    let e = '';
    rows.forEach(([y, hw, s], r) => [-.75, -.25, .25, .75].forEach((k, c) => {
      const x = f(60 + hw * k), i = r * 4 + c;
      e += E(x, f(y + 5 * s), f(8 * s), f(3.4 * s), '#B8A27F', 0) + (i === 6 ? '' : egg(x, y, s, cols[i], sp[i], (c - 1.5) * 4));
    }));
    return P('M38 40 H82 L92 88 H28Z', '#D8C3A5') + L('M34 56 H86 M32 71 H88', '#C4AD8A', 1.6) + e +
      P('M28 88 C32 84 36 92 40 88 C44 84 48 92 52 88 C56 84 60 92 64 88 C68 84 72 92 76 88 C80 84 84 92 88 88 L92 88 L90 96 H30 L28 88Z', '#C9B79C') +
      sparkle(90, 34, 3.6) + sparkle(28, 36, 3, '#fff');
  },
  'Granja avícola': () =>
    P('M30 52 H90 V100 H30Z', '#E03131') + L('M30 58 H90', '#fff', 0) + L('M34 60 L46 72 M46 60 L34 72 M74 60 L86 72 M86 60 L74 72', '#fff', 2) + R(33, 59, 14, 14, 0, 'none', 1.6) + R(73, 59, 14, 14, 0, 'none', 1.6) +
    P('M48 100 V72 C48 66 72 66 72 72 V100Z', '#5C3A21') + egg(55, 84, .5, '#FFF3BF') + egg(65, 86, .5, '#FFE8CC') +
    P('M22 56 L60 28 L98 56 L92 58 L60 36 L28 58Z', '#C92A2A') +
    P('M34 54 L60 35 L86 54Z', '#fff') + P('M52 30 C49 22 55 19 57 24 C58 18 64 18 64 24 C67 20 72 23 68 30Z', '#E03131') +
    dot(53, 45, 1.8) + dot(67, 45, 1.8) + dot(53.6, 44.4, .6, '#fff') + dot(67.6, 44.4, .6, '#fff') + P('M56.6 47 H63.4 L60 52Z', '#FF922B', 1.6) + P('M58.6 52 C58 55 62 55 61.4 52Z', '#E03131', 1.4) +
    blush(49, 49, 2) + blush(71, 49, 2) +
    egg(42, 94, .64, '#FFF3BF', '', -30) + egg(78, 93, .66, '#FFE8CC', '', 24) + egg(60, 97, .6, '#fff', '', 10) +
    L('M34 90 L28 88 M36 96 L30 98 M86 88 L92 86 M84 96 L90 98', D, 1.6) + sparkle(88, 36, 3.4) + sparkle(30, 40, 3, '#fff'),
  // Pajarera
  'Jaula con canario': () => {
    const bars = [36, 48, 60, 72, 84].map((x) => x === 60 ? 'M60 86 V32' : `M${x} 86 V58 C${x} ${x < 60 ? 40 : 40} ${f((x + 60) / 2)} 32 60 32`).join(' ');
    return L('M60 20 V27', D, 1.8) + `<circle cx="60" cy="24" r="3.4" fill="none" stroke="${D}" stroke-width="3.6"/><circle cx="60" cy="24" r="3.4" fill="none" stroke="#FCC419" stroke-width="1.6"/>` +
      stick('M42 72 H78', '#C97B45', 2.4) + bird(58, 61, 1.05, '#FFD43B', '#FAB005', '#FF922B') +
      L(bars, D, 3.4) + L(bars, '#FCC419', 1.4) + R(54, 28, 12, 5, 2.5, '#FAB005', 1.8) +
      R(30, 84, 60, 8, 3, '#FAB005') + R(34, 92, 52, 5, 2, '#E67700', 1.8) + L('M36 87 H60', '#fff', 1.4, .7) +
      note(90, 40, .9, '#7048E8', -10) + note(26, 48, .8, '#F06595', 10) + note(94, 64, .7, '#20C997') + L('M80 50 L86 46 M80 56 L88 56', D, 1.6);
  },
  'Plaza con palomas': () =>
    P('M10 74 C30 70 90 70 110 74 V110 H10Z', '#E9D8B4') + L('M20 82 Q40 80 50 82 M70 84 Q86 82 98 84', '#D8C3A5', 1.6) +
    L('M32 72 V50 M88 72 V50', D, 3) + R(28, 42, 64, 5, 2, '#2F9E44', 2) + R(28, 49, 64, 5, 2, '#2F9E44', 2) + R(26, 58, 68, 5, 2, '#40C057', 2) +
    L('M30 63 L28 74 M90 63 L92 74', D, 3) + L('M32 44 H50 M32 60 H52', '#fff', 1.2, .5) +
    P('M38 58 L40 46 H50 L52 58Z', '#D8C3A5', 1.8) + L('M42 46 L43 50 M48 46 L47 50', '#B8A27F', 1.2) + E(45, 46, 5, 1.6, '#F2BC63', 1.4) +
    [[40, 78], [52, 82], [60, 78], [70, 88], [46, 90], [80, 80], [64, 92], [56, 86]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2.4" height="2" rx=".6" fill="#C97B45" transform="rotate(${x * 7} ${x} ${y})"/>`).join('') +
    pigeon(80, 36, -.5) + pigeon(32, 82, .58) + pigeon(88, 82, -.58) + pigeon(60, 70, .48) + pigeon(48, 92, -.55) + pigeon(74, 94, .55) +
    L('M74 24 Q78 20 82 24 M84 20 Q88 16 92 20', D, 1.4),
  'Reserva de Costanera': u =>
    `<defs><linearGradient id="rc${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD8A8"/><stop offset=".6" stop-color="#FFF3BF"/></linearGradient></defs>` +
    `<rect x="0" y="0" width="120" height="130" fill="url(#rc${u})"/>` + C(60, 50, 9, '#FFA94D', 0) +
    `<path d="M20 64 V48 H26 V40 H32 V64 M34 64 V44 L38 36 L42 44 V64 M46 64 V30 H54 V64 M58 64 V42 H64 V64 M66 64 V36 L70 26 L74 36 V64 M78 64 V46 H86 V64 M88 64 V38 H94 V64" fill="#91A7FF" stroke="#748FFC" stroke-width="1"/>` +
    `<rect x="0" y="62" width="120" height="50" fill="#4DABF7"/>` + L('M0 62 H120', D, 2) + L('M30 70 H42 M64 74 H78 M48 82 H58 M84 70 H94', '#fff', 1.6, .7) +
    L('M42 63 L41 82 M46 63 L47 82', '#495057', 1.4) + E(44, 58, 8, 5.4, '#fff', 2, 15) + P('M40 56 C44 54 48 56 50 60 C46 61 42 60 40 56Z', '#CED4DA', 1.4) +
    stick('M38 55 C33 50 40 45 36 39', '#fff', 2.4) + C(36, 37.6, 3.2, '#fff', 1.8) + P('M33.6 36.4 L25 38.6 L33.6 39.2Z', '#FCC419', 1.4) + dot(36.6, 37, .9) +
    L('M70 62 V84 M68 62 L64 70 L69 72', '#F06595', 1.6) + E(70, 58, 9, 6, '#FF8FAB', 2, -10) + P('M62 56 L56 52 L58 60Z', '#F06595', 1.6) +
    stick('M76 56 C84 50 79 42 75 38 C72 34 76 28 80 31', '#FF8FAB', 2.6) + C(80.6, 31.6, 3.2, '#FF8FAB', 1.8) + P('M83 31 L89 35 L85 37Z', D, 1.2) + dot(80.6, 30.6, .9) + L('M64 58 C66 56 70 55 73 56', '#FFDEEB', 1.6) +
    [[24, 96, 70], [28, 98, 64], [32, 98, 72], [86, 98, 66], [90, 96, 72], [94, 98, 62]].map(([x, b, top]) => stick(`M${x} ${b} L${x + (x < 60 ? -1 : 1)} ${top}`, '#5C940D', 1.4) + E(x + (x < 60 ? -1 : 1), top - 2, 1.8, 4.4, '#8B5A3C', 1.4)).join('') +
    L('M24 30 Q27 27 30 30 M32 26 Q35 23 38 26', D, 1.4),

  // ═════════ HOMBRES LOBO ═════════
  // Manada
  'Caperucita engañada': () =>
    P('M20 66 C20 54 100 54 100 66 V80 H20Z', '#fff') + L('M28 62 C40 58 80 58 92 62', '#DEE2E6', 1.6) +
    wolf(60, 58, 1.04, 'grin', '#868E96', false) +
    P('M38 50 C36 34 48 28 60 28 C72 28 84 34 82 50 C78 46 70 43 60 43 C50 43 42 46 38 50Z', '#fff') +
    L('M38 50 C41 46 43 49 46 46 C48 44 51 47 54 44.4 C57 43 60 46 63 44 C66 43 69 47 72 45 C75 45 77 48 80 47', '#FFA8A8', 1.8) + dot(50, 36, 1.6, '#FFA8A8') + dot(66, 34, 1.6, '#FFA8A8') + dot(58, 31, 1.4, '#FFA8A8') + dot(74, 40, 1.4, '#FFA8A8') +
    P('M44 36 L40 22 L52 32Z', '#868E96') + P('M76 36 L80 22 L68 32Z', '#868E96') + P('M45 33 L42.4 25.4 L49 31Z M75 33 L77.6 25.4 L71 31Z', '#FFA8A8', 0) +
    P('M80 46 C84 40 92 42 90 48 C94 50 90 56 84 52Z', '#F06595', 1.6) + C(82, 48, 2.2, '#E64980', 1.4) +
    `<circle cx="52.7" cy="49.2" r="5" fill="#fff" fill-opacity=".35" stroke="${D}" stroke-width="1.8"/><circle cx="67.3" cy="49.2" r="5" fill="#fff" fill-opacity=".35" stroke="${D}" stroke-width="1.8"/>` + L('M57.6 49 Q60 47.6 62.4 49', D, 1.6) +
    P('M14 78 C32 72 88 72 106 78 V110 H14Z', '#F783AC') + L('M40 74 V110 M80 74 V110 M14 92 H106', '#E64980', 1.4) + heart(30, 86, 3, '#fff', 1) + heart(60, 86, 3, '#FFDEEB', 1) + heart(90, 86, 3, '#fff', 1) +
    E(44, 76, 5, 3.6, '#868E96', 1.8) + E(76, 76, 5, 3.6, '#868E96', 1.8) + L('M42 75 V77 M46 75 V77 M74 75 V77 M78 75 V77', D, 1),
  'Aullido a la luna': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#2C3E73"/>` + dot(30, 40, 1, '#fff') + dot(44, 26, .8, '#fff') + dot(36, 58, .8, '#fff') + dot(92, 74, .8, '#fff') + star(50, 40, 2, '#FFE066', 1) +
    `<circle cx="76" cy="40" r="20" fill="#FFF3BF" opacity=".25"/>` + C(76, 40, 14, '#FFF3BF') + dot(71, 36, 2.6, '#FFE8A3') + dot(81, 45, 2.2, '#FFE8A3') + dot(80, 34, 1.4, '#FFE8A3') +
    P('M10 90 C28 80 52 78 72 84 C86 88 98 86 110 84 V112 H10Z', '#2B8A3E') + L('M30 84 L28 80 M33 84 V79 M80 86 L79 82 M83 86 L84 81', '#51CF66', 1.4) +
    P('M38 88 C30 88 24 84 26 76 C28 82 32 82 38 82Z', '#868E96') +
    P('M36 88 C34 76 36 64 44 56 C47 52 48 48 49 44 L47 33 L54 39 C58 34 64 30 71 26 C73 26 74 28 73 30 C70 34 66 38 63 41 C62 46 60 50 58 56 C58 64 60 76 62 88Z', '#868E96') +
    P('M58 54 C56 62 56 72 59 84 C53 78 49 66 52 57Z', '#DEE2E6', 0) + L('M40 70 C42 64 44 60 46 58', '#ADB5BD', 1.6) + L('M54 60 L56 63 M52 66 L55 68', '#ADB5BD', 1.2) + L('M54 72 V88', D, 2) + L('M56 42 Q58 40 60 41.6', D, 1.6) + P('M64 39 L71 32 L68 38Z', '#C92A2A', 1.2) +
    dot(72.6, 27.2, 1.2) + P('M50.6 36.8 L49 34.6 L52.6 37.4Z', '#FFA8A8', 0) +
    L('M72 22 Q75 19 78 22 M74 17 Q79 13 84 17', '#FFF3BF', 1.8) + star(96, 58, 2.4, '#FFE066', 1),
  'Lobizón': u =>
    `<defs><linearGradient id="lz${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A6B"/><stop offset="1" stop-color="#7048E8"/></linearGradient></defs>` +
    `<rect x="0" y="0" width="120" height="130" fill="url(#lz${u})"/>` + `<circle cx="60" cy="46" r="32" fill="#FFF3BF" opacity=".18"/>` + C(60, 46, 26, '#FFF3BF') + dot(50, 38, 4, '#FFE8A3') + dot(72, 54, 3, '#FFE8A3') + dot(70, 34, 2, '#FFE8A3') +
    dot(26, 40, 1, '#fff') + dot(94, 34, .9, '#fff') + dot(30, 62, .8, '#fff') +
    P('M10 84 C30 80 90 80 110 84 V112 H10Z', '#5C940D') + L('M22 82 L26 74 L28 82 M90 82 L94 72 L96 82 M98 84 L101 76', '#94D82D', 1.6) +
    P('M30 104 L32 88 L26 86 L33 80 L30 74 L39 74 L46 68 H74 L81 74 L90 74 L87 80 L94 86 L88 88 L90 104Z', '#6E5848') +
    P('M50 70 L60 86 L70 70Z', '#A88C76', 0) + L('M44 80 L46 86 M76 80 L74 86', '#4E3D31', 1.6) +
    `<g transform="rotate(32 60 86)"><rect x="24" y="80" width="72" height="12" fill="#74C0FC"/><rect x="24" y="84" width="72" height="4" fill="#fff"/><rect class="m-ol" style="stroke-width:2" x="24" y="80" width="72" height="12" fill="none"/></g>` +
    C(80, 98, 4, '#FCC419', 1.6) + `<path d="M77 101 L75 108 M83 101 L85 108" stroke="#FCC419" stroke-width="2.4" stroke-linecap="round"/>` +
    wolf(60, 56, 1.02, 'grin', '#6E5848') + P('M44 40 L40 34 L48 38 Z M76 40 L80 34 L72 38Z', '#6E5848', 1.6) +
    P('M56 36 L60 30 L64 36Z', '#6E5848', 1.6),
  // Pueblo unido
  'Horquilla en mano': () => {
    const fork = (x1: number, y1: number, x2: number, y2: number) => {
      const a = Math.atan2(y2 - y1, x2 - x1), px = -Math.sin(a), py = Math.cos(a), ux = Math.cos(a), uy = Math.sin(a);
      const tine = (o: number) => `M${f(x2 + px * o)} ${f(y2 + py * o)} L${f(x2 + px * o + ux * 9)} ${f(y2 + py * o + uy * 9)}`;
      return stick(`M${x1} ${y1} L${x2} ${y2}`, '#C97B45', 2.6) + stick(`M${f(x2 - px * 5)} ${f(y2 - py * 5)} L${f(x2 + px * 5)} ${f(y2 + py * 5)} ${tine(-5)} ${tine(0)} ${tine(5)}`, '#ADB5BD', 1.8);
    };
    const villager = (x: number, y: number, r: number, skin: string, shirt: string, hat: string) =>
      P(`M${x - r * 1.7} 106 C${x - r * 1.7} ${y + r * 1.6} ${x - r} ${y + r * .9} ${x} ${y + r * .9} C${x + r} ${y + r * .9} ${x + r * 1.7} ${y + r * 1.6} ${x + r * 1.7} 106Z`, shirt) +
      C(x, y, r, skin) + hat + L(`M${f(x - r * .55)} ${f(y - r * .2)} L${f(x - r * .15)} ${f(y - r * .02)} M${f(x + r * .55)} ${f(y - r * .2)} L${f(x + r * .15)} ${f(y - r * .02)}`, D, 1.6) +
      dot(f(x - r * .35), f(y + r * .2), 1.4) + dot(f(x + r * .35), f(y + r * .2), 1.4) + frown(x, f(y + r * .6), f(r * .3), 1.6);
    return fork(34, 88, 30, 40) + fork(86, 88, 90, 42) + stick('M60 82 L60 46', '#8B5A3C', 2.8) + R(56, 44, 8, 6, 1.6, '#495057', 1.6) + flame(60, 45, .9) +
      villager(34, 76, 9, '#F4BE8F', '#40C057', P('M25 74 C25 64 43 64 43 74 C40 71 28 71 25 74Z', '#C97B45', 1.8)) +
      villager(86, 76, 9, '#C68B59', '#4DABF7', P('M77 73 C78 66 94 66 95 73Z', '#FCC419', 1.8) + R(74, 72, 24, 3, 1.4, '#FCC419', 1.6)) +
      villager(60, 70, 10, '#FFD8B5', '#E03131', P('M49 68 C48 58 72 58 71 68 C66 66 54 66 49 68Z', '#343A40', 1.8) + dot(60, 59, 1.6, '#343A40')) +
      stick('M31 84 L33 80', '#F4BE8F', 0) + C(32, 84, 3.4, '#F4BE8F', 1.6) + C(88, 84, 3.4, '#C68B59', 1.6) + C(60, 80, 3.4, '#FFD8B5', 1.6) +
      flame(46, 34, .4) + dot(76, 30, 1, '#FF922B') + dot(44, 48, .9, '#FF922B');
  },
  'Bala de plata': u =>
    `<defs><linearGradient id="sv${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#868E96"/><stop offset=".35" stop-color="#F8F9FA"/><stop offset="1" stop-color="#ADB5BD"/></linearGradient></defs>` +
    C(34, 34, 8, '#FFF3BF', 1.8) + `<circle cx="37.6" cy="31.6" r="6.6" fill="#FFF1E3"/>` +
    g('rotate(28 60 62)', P('M48 62 C48 42 55 30 60 25 C65 30 72 42 72 62Z', `url(#sv${u})`) +
      P('M57 44 L56.4 38.6 L58.6 41 C59.4 40.4 60.6 40.4 61.4 41 L63.6 38.6 L63 44 C63.6 46 62.6 49 60 50 C57.4 49 56.4 46 57 44Z', '#495057', 0).replace('class="m-ol" ', 'opacity=".45" ') +
      L('M52 58 C52 46 55 38 58 33', '#fff', 2.6, .9) +
      R(46, 62, 28, 27, 2, '#FAB005') + L('M46 68 H74', D, 2) + R(44, 87, 32, 6, 2, '#E67700') + L('M50 72 V84', '#FFE066', 2.4, .9) + C(60, 90, 2.4, '#ADB5BD', 1.4)) +
    sparkle(76, 34, 6, '#fff') + sparkle(86, 50, 3.4) + sparkle(30, 70, 3.6, '#fff') + L('M80 24 L82 20 M88 30 L92 28', D, 1.6),
  'Intendente de Castronegro': () =>
    P('M28 100 V44 C28 26 92 26 92 44 V100Z', '#C92A2A') + `<path d="M33 98 V45 C33 31 87 31 87 45 V98" fill="none" stroke="#FCC419" stroke-width="2"/>` +
    [[42, 42], [60, 38], [78, 42], [42, 58], [78, 58]].map(([x, y]) => dot(x, y, 1.6, '#8B1A1A')).join('') +
    g('translate(60 26)', P('M-7 -4 H7 V3 C7 7 3 9 0 10 C-3 9 -7 7 -7 3Z', '#FCC419', 1.8) + R(-1, -2.4, 2, 8, 0, '#4DABF7', 0) + R(-5, 0, 10, 2, 0, '#4DABF7', 0)) +
    P('M38 104 C38 82 46 72 60 72 C74 72 82 82 82 104Z', '#343A40') + P('M54 72 L60 86 L66 72Z', '#fff', 1.6) + P('M58.4 74 H61.6 L61 82 L60 84 L59 82Z', '#E03131', 1) +
    `<g transform="rotate(-36 60 88)"><rect x="34" y="84" width="52" height="9" fill="#74C0FC"/><rect x="34" y="87" width="52" height="3" fill="#fff"/><rect class="m-ol" style="stroke-width:1.8" x="34" y="84" width="52" height="9" fill="none"/></g>` + C(48, 98, 3, '#FCC419', 1.4) +
    R(22, 72, 14, 28, 6, '#E03131') + R(84, 72, 14, 28, 6, '#E03131') + L('M26 76 V90 M88 76 V90', '#fff', 1.6, .4) +
    stick('M88 96 L92 56', '#212529', 2.4) + C(92, 54, 3.4, '#FCC419', 1.6) + L('M92 58 L95 66', '#FCC419', 1.4) + C(88, 80, 4, '#F4BE8F', 1.8) +
    R(55, 60, 10, 12, 3, '#E6A06B', 2) + C(60, 52, 13, '#F4BE8F') + P('M47 50 C46 44 48 42 50 42 C49 46 50 48 50 52Z M73 50 C74 44 72 42 70 42 C71 46 70 48 70 52Z', '#CED4DA', 1.4) + hl(56, 42, 4, 1.6, -10) +
    L('M51.6 51 Q53.6 49 55.6 51 M64.4 51 Q66.4 49 68.4 51', D, 1.6) + blush(50.6, 55.6, 2.2) + blush(69.4, 55.6, 2.2) +
    P('M60 57 C56 55 50 56 49 60 C53 59 57 59.6 60 59.4 C63 59.6 67 59 71 60 C70 56 64 55 60 57Z', '#ADB5BD', 1.4) + smile(60, 61.6, 2.6, 1.4) +
    sparkle(22, 36, 3.6) + sparkle(98, 36, 3.6),
  // Bocadito
  'Picadita': () => {
    const cube = (x: number, y: number, s: number) => g(`translate(${x} ${y}) scale(${s})`,
      `<path d="M0 -10 L8 -6 L0 -2 L-8 -6Z" fill="#FFE066"/><path d="M-8 -6 L0 -2 V7 L-8 3Z" fill="#FCC419"/><path d="M8 -6 L0 -2 V7 L8 3Z" fill="#F59F00"/>` +
      `<path class="m-ol" style="stroke-width:${f(1.8 / s)}" d="M0 -10 L8 -6 V3 L0 7 L-8 3 V-6Z M-8 -6 L0 -2 L8 -6 M0 -2 V7" fill="none"/>` + dot(-4, 1, .9, '#FFF3BF') + dot(4, -.4, .7, '#E67700'));
    const salame = (x: number, y: number) => E(x, y, 6, 4.4, '#C2255C', 1.6) + dot(x - 2, y - 1, .9, '#FFDEEB') + dot(x + 2, y + 1, .8, '#FFDEEB') + dot(x + 1.6, y - 1.8, .6, '#FFDEEB') + dot(x - 1, y + 1.8, .6, '#FFDEEB');
    const olive = (x: number, y: number) => E(x, y, 3, 2.4, '#82C91E', 1.4) + dot(x + 1, y - .4, .9, '#E03131');
    return P('M22 70 C22 60 30 56 40 56 H82 C92 56 98 60 98 70 V74 C98 82 92 86 82 86 H40 C30 86 22 82 22 74Z', '#A0643C') +
      P('M22 66 C22 56 30 52 40 52 H82 C92 52 98 56 98 66 C98 76 92 80 82 80 H40 C30 80 22 76 22 66Z', '#D9A066') + L('M30 62 C40 58 70 58 90 62 M32 72 C46 70 74 70 88 72', '#C4864E', 1.2) +
      salame(34, 64) + salame(42, 72) + salame(84, 72) + cube(48, 60, .7) + cube(76, 60, .7) + cube(86, 64, .6) + olive(30, 72) + olive(70, 74) + olive(52, 74) +
      L('M77 54 L80 46', '#E9C46A', 1.4) + dot(80, 45.4, 1.4, '#E03131') +
      // aldeanito
      L('M56 66 L54 72 M64 66 L66 72', D, 2) + P('M54 58 C54 54 66 54 66 58 L65 67 H55Z', '#4DABF7', 1.6) + L('M54 58 L49 52 M66 58 L71 52', D, 1.8) +
      C(60, 49, 6, '#FFD8B5', 1.8) + P('M53.6 47 C53 41 67 41 66.4 47 C62 45 58 45 53.6 47Z', '#343A40', 1.6) + dot(57.6, 49.4, 1.1) + dot(62.4, 49.4, 1.1) +
      `<ellipse cx="60" cy="53" rx="1.4" ry="1.8" fill="${D}"/>` + `<path d="M67 46 C67 49 68.4 50 68.4 51.4 A1.4 1.4 0 0 1 65.6 51.4 C65.6 50 67 49 67 46Z" fill="#74C0FC" stroke="${D}" stroke-width="1"/>` +
      L('M48 46 L45 44 M72 46 L75 44 M60 38 V35', D, 1.4) + sparkle(28, 44, 3.4) + sparkle(92, 44, 3, '#fff');
  },
  'Choripán de lobo': () =>
    wolf(60, 50, .9, 'drool') +
    P('M24 74 C22 66 30 62 40 64 H80 C90 62 98 66 96 74Z', '#E8A54B') + L('M40 66 L44 70 M54 65 L58 69 M68 65 L72 69', '#C9852E', 1.4) +
    P('M18 76 C18 70 24 69 30 69 H90 C96 69 102 70 102 76 C102 82 96 83 90 83 H30 C24 83 18 82 18 76Z', '#B8452E') + L('M26 72 C40 71 80 71 94 72', '#fff', 1.6, .5) +
    dot(40, 74, 1, '#40C057') + dot(46, 77, 1, '#2F9E44') + dot(76, 74, 1, '#40C057') + dot(84, 77, .9, '#2F9E44') + dot(32, 73, .9, '#2F9E44') +
    P('M53 70 C52 64 68 64 67 70 C62 68 58 68 53 70Z', '#343A40', 1.6) + dot(60, 65.4, 1.2, '#343A40') + C(55.6, 75, 2.6, '#fff', 1.2) + C(64.4, 75, 2.6, '#fff', 1.2) + dot(56, 75.4, 1.3) + dot(64, 75.4, 1.3) + `<ellipse cx="60" cy="79.6" rx="1.6" ry="1.9" fill="#fff" stroke="${D}" stroke-width="1.2"/>` +
    `<path d="M69 70 C69 73 70.4 74 70.4 75.4 A1.4 1.4 0 0 1 67.6 75.4 C67.6 74 69 73 69 70Z" fill="#74C0FC" stroke="${D}" stroke-width="1"/>` +
    P('M24 80 C24 88 36 92 60 92 C84 92 96 88 96 80Z', '#F2BC63') + L('M34 86 C44 88 76 88 86 86', '#fff', 1.6, .5) +
    E(28, 86, 6, 4.6, '#868E96', 1.8) + E(92, 86, 6, 4.6, '#868E96', 1.8) + L('M26 84 V88 M30 84 V88 M90 84 V88 M94 84 V88', D, 1) +
    sparkle(90, 34, 3.6) + L('M30 40 L26 38 M30 46 L25 47', D, 1.6),
  'Plato principal': () =>
    stick('M28 80 L32 42', '#ADB5BD', 2.6) + L('M28.6 42 L29.6 32 M32 42 V32 M35.4 42 L34.4 32', D, 3.4) + L('M28.6 42 L29.6 32 M32 42 V32 M35.4 42 L34.4 32', '#ADB5BD', 1.4) + R(28, 40, 8, 4, 1.6, '#ADB5BD', 1.6) +
    stick('M92 80 L88 50', '#ADB5BD', 2.6) + P('M88 52 C84 46 84 36 88 30 C92 36 92 46 90 52Z', '#DEE2E6', 1.8) +
    wolf(60, 50, .9, 'drool') +
    P('M44 62 C48 66 72 66 76 62 L74 74 C68 78 52 78 46 74Z', '#fff', 2) + L('M48 68 H72 M50 72 H70', '#FF6B6B', 1.2) + L('M54 64 V76 M60 65 V77 M66 64 V76', '#FF6B6B', 1.2) +
    P('M54 62 L48 58 L50 66Z M66 62 L72 58 L70 66Z', '#fff', 1.6) +
    E(32, 66, 5, 4, '#868E96', 1.8) + E(89, 64, 5, 4, '#868E96', 1.8) +
    E(60, 86, 34, 11, '#fff') + `<ellipse cx="60" cy="85" rx="25" ry="6.6" fill="none" stroke="#CED4DA" stroke-width="1.6"/>` +
    P('M84 86 A8 8 0 0 1 92 80 L86 86Z', '#FFE066', 1.6) +
    L('M56 88 L52 92 M64 88 L68 92', D, 2.4) + P('M54 80 C54 76 66 76 66 80 L65 88 H55Z', '#E03131', 1.6) +
    C(60, 72, 5.6, '#FFD8B5', 1.8) + dot(58, 72.4, 1) + dot(62, 72.4, 1) + `<ellipse cx="60" cy="75.4" rx="1.2" ry="1.4" fill="${D}"/>` +
    L('M60 66 L60 62', '#2F9E44', 1.4) + E(57, 62, 2.6, 1.6, '#40C057', 1.2, -30) + E(63, 61.4, 2.6, 1.6, '#51CF66', 1.2, 30) + E(60, 59.6, 1.6, 2.4, '#40C057', 1.2) +
    L('M54 82 L48 78 M66 82 L72 78', D, 1.8),
};
