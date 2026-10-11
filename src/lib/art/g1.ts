// Ilustraciones de medallas: Truco, Rummikub, T.E.G., Azul, Dobble y Just One.
import { D, f, flameSmall, heart, star, starPts, stick, t } from './helpers'

// ── Piezas reutilizables ──────────────────────────────────────────────
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`;
const coin = (x: number, y: number, r: number) =>
  `<circle class="m-ol" cx="${x}" cy="${y}" r="${r}" fill="#FCC419"/><circle cx="${x}" cy="${y}" r="${f(r * .62)}" fill="none" stroke="#E67700" stroke-width="1.6"/>` +
  `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .4)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" transform="rotate(-40 ${f(x - r * .4)} ${f(y - r * .4)})"/>`;
const crown = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z" fill="#FFD43B"/>` +
  `<circle cx="0" cy="1.5" r="1.8" fill="#E03131"/><circle cx="-6" cy="2" r="1.2" fill="#4DABF7"/><circle cx="6" cy="2" r="1.2" fill="#4DABF7"/></g>`;
const mate = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + stick('M4 -12 L14 -30', '#CED4DA', 2.4) +
  `<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-13 -10 C-17 0 -14 14 0 15 C14 14 17 0 13 -10Z" fill="#9C6644"/>` +
  `<path d="M-9 -4 C-10 2 -8 8 -4 10" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".45"/>` +
  `<ellipse class="m-ol" style="stroke-width:${f(2.6 / s)}" cx="0" cy="-10" rx="13" ry="4" fill="#5C940D"/><path d="M-7 -11 Q-3 -12.5 1 -11" stroke="#94D82D" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
  `<rect class="m-ol" style="stroke-width:${f(2 / s)}" x="-14" y="-7" width="28" height="4" rx="2" fill="#E9C46A"/></g>`;
const ol = (sw: number) => `class="m-ol" style="stroke-width:${sw}"`;
const blush = (x: number, y: number, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/>`;
const eye = (x: number, y: number, r = 2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${f(x + r * .35)}" cy="${f(y - r * .35)}" r="${f(r * .38)}" fill="#fff"/>`;
const line = (d: string, w = 1.8, c = D) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const shine = (d: string, w = 2.2, op = .6) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
const note = (x: number, y: number, s = 1, c = '#9775FA') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M2.4 -.6 V-12 Q7 -10 7.5 -6" fill="none" stroke="${D}" stroke-width="${f(2 / s)}" stroke-linecap="round"/>` +
  `<ellipse ${ol(f(1.6 / s))} cx="0" cy="0" rx="3.2" ry="2.4" fill="${c}" transform="rotate(-20)"/></g>`;
const puff = (x: number, y: number, s = 1, c = '#E9ECEF') =>
  `<path ${ol(f(2 / s))} transform="translate(${x} ${y}) scale(${s})" d="M-9 4 C-13 4 -13 -2 -9 -2 C-9 -7 -3 -8 -1 -5 C1 -9 8 -8 8 -3 C12 -3 12 4 8 4Z" fill="${c}"/>`;

// Naipes españoles
const SUIT_C = { e: '#1971C2', b: '#2F9E44', o: '#E67700', c: '#E03131' } as const;
type Suit = keyof typeof SUIT_C;
/** Espada española vertical; (x,y) es la guarnición. Mide ~46 de alto con s=1. */
const sword = (x: number, y: number, s = 1, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
  `<path ${ol(f(2.2 / s))} d="M-3 0 V-24 L0 -30 L3 -24 V0Z" fill="#DEE2E6"/><path d="M-1 -3 V-24" stroke="#fff" stroke-width="1.3"/><path d="M1.2 -2 V-23" stroke="#ADB5BD" stroke-width="1"/>` +
  `<rect ${ol(f(2 / s))} x="-2.2" y="3" width="4.4" height="9" rx="1.6" fill="#C92A2A"/><circle ${ol(f(2 / s))} cx="0" cy="14" r="2.8" fill="#FCC419"/>` +
  `<path ${ol(f(2.2 / s))} d="M-10 -2 C-6 1 6 1 10 -2 L9 2.5 C5 5 -5 5 -9 2.5Z" fill="#FCC419"/></g>`;
const BASTO = 'M-3 20 C-4 6 -7 -6 -9 -14 C-10 -21 -2 -25 3 -22 C9 -19 8 -10 6 -3 C5 6 4 14 3 20Z';
/** Basto (garrote) vertical centrado. ~45 de alto con s=1. */
const basto = (x: number, y: number, s = 1, rot = 0, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
  `<path ${ol(f(1.8 / s))} d="M2 -21 C6 -27 12 -26 13 -22 C9 -20 5 -19 2 -21Z" fill="#51CF66"/>` +
  `<path ${ol(f(2.4 / s))} d="${BASTO}" fill="#C97B45"/><path d="M-5 -14 C-5 -18 -2 -20 1 -20" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>` +
  `<circle ${ol(f(1.5 / s))} cx="-6.5" cy="-6" r="1.8" fill="#8B5A3C"/><circle ${ol(f(1.5 / s))} cx="5" cy="-13" r="1.6" fill="#8B5A3C"/><circle ${ol(f(1.5 / s))} cx="3.5" cy="4" r="1.5" fill="#8B5A3C"/>` +
  extra + `</g>`;
const oro = (x: number, y: number, r: number) => coin(x, y, r) + `<circle cx="${f(x - r * .2)}" cy="${f(y - r * .05)}" r="${f(r * .1)}" fill="${D}"/><circle cx="${f(x + r * .2)}" cy="${f(y - r * .05)}" r="${f(r * .1)}" fill="${D}"/>`;
const copa = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path ${ol(f(2 / s))} d="M-7 -8 H7 C7 0 4 3 0 3 C-4 3 -7 0 -7 -8Z M-1.5 3 H1.5 V7 H4 V9 H-4 V7 H-1.5Z" fill="#FCC419"/><path d="M-6 -6 H6" stroke="#E03131" stroke-width="2"/></g>`;
/** Naipe español centrado (22×32 con s=1). */
const spCard = (x: number, y: number, rot: number, s: number, n: string, suit: Suit, mid = '') => {
  const c = SUIT_C[suit];
  const m = mid || (suit === 'e' ? sword(0, 6, .4) : suit === 'b' ? basto(0, 0, .36, 20) : suit === 'o' ? oro(0, 1, 5.5) : copa(0, 1, .9));
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(f(2.4 / s))} x="-11" y="-16" width="22" height="32" rx="3" fill="#FFF8E7"/>` +
    `<path d="M-8.5 -9 V13.5 H8.5 V-13.5 H-3" fill="none" stroke="${c}" stroke-width="1.1" stroke-dasharray="4 2"/>` + t(-6.3, -8.5, 7, n, c) + m + `</g>`;
};
// Rummikub
const TILE_C = ['#1C7ED6', '#E03131', '#F08C00', '#212529'];
const tile = (x: number, y: number, n: number | string, c: string, rot = 0, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(f(2.2 / s))} x="-7" y="-9" width="14" height="18" rx="2.6" fill="#FFF8E7"/>` +
  `<path d="M-4.6 6.4 H4.6" stroke="#E9D8B4" stroke-width="1.4" stroke-linecap="round"/>` + t(0, 3.2, 10, String(n), c) + `</g>`;
const jtile = (x: number, y: number, rot = 0, s = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(f(2.2 / s))} x="-7" y="-9" width="14" height="18" rx="2.6" fill="#FFF8E7"/>` +
  `<circle cx="0" cy="-.5" r="5" fill="#E03131"/><circle cx="-1.8" cy="-1.8" r=".9" fill="${D}"/><circle cx="1.8" cy="-1.8" r=".9" fill="${D}"/><path d="M-2.6 .8 Q0 3.6 2.6 .8" stroke="${D}" stroke-width="1" fill="none" stroke-linecap="round"/>` +
  `<path d="M-4.6 6.4 H4.6" stroke="#E9D8B4" stroke-width="1.4" stroke-linecap="round"/></g>`;
const duck = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path ${ol(f(1.6 / s))} d="M-6 2 C-7 -2 -4 -3 -1 -2 C-2 -7 4 -8 5 -4 C5 -2 4 -1 3 0 C7 0 6 6 0 6 C-4 6 -6 5 -6 2Z" fill="#FFD43B"/>` +
  `<path ${ol(f(1.2 / s))} d="M5 -4.5 L8.5 -3.6 L5 -2.4Z" fill="#FF922B"/><circle cx="2.6" cy="-4.6" r=".9" fill="${D}"/></g>`;
const matchStick = (x1: number, y1: number, x2: number, y2: number, head = '#E03131') =>
  stick(`M${x1} ${y1} L${x2} ${y2}`, '#F2C48D', 3) + `<circle ${ol(1.8)} cx="${x2}" cy="${y2}" r="3" fill="${head}"/>`;

// T.E.G.
/** Ficha de ejército (cilindrito). */
const army = (x: number, y: number, c: string, s = 1, face = false) => {
  const b = 'M-6 -2 V3 C-6 6.6 6 6.6 6 3 V-2Z';
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${b}" fill="${c}"/><path d="${b}" fill="#000" opacity=".2"/><path ${ol(f(2.2 / s))} d="${b}" fill="none"/>` +
    `<ellipse ${ol(f(2.2 / s))} cx="0" cy="-2" rx="6" ry="2.6" fill="${c}"/><ellipse cx="-2.2" cy="-2.6" rx="1.8" ry=".7" fill="#fff" opacity=".6"/>` +
    (face ? `<circle cx="-2" cy="2.2" r=".9" fill="#fff"/><circle cx="2" cy="2.2" r=".9" fill="#fff"/>` : '') + `</g>`;
};
const flag = (x: number, y: number, c: string, s = 1, h = 14) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V${-h}" stroke="${D}" stroke-width="${f(2 / s)}" stroke-linecap="round"/><path ${ol(f(1.8 / s))} d="M0 ${-h} L10 ${-h + 3} L0 ${-h + 6}Z" fill="${c}"/></g>`;
// Azul
const AZ: [string, string][] = [['#1C7ED6', '#fff'], ['#FAB005', '#E8590C'], ['#E03131', '#FFC9C9'], ['#343A40', '#3BC9DB'], ['#E3FAFC', '#1098AD']];
const AZP = [
  (c: string) => `<path d="M0 -3.8 L1.3 0 L0 3.8 L-1.3 0Z M-3.8 0 L0 -1.3 L3.8 0 L0 1.3Z" fill="${c}"/>`,
  (c: string) => `<path d="M0 -4 L4 0 L0 4 L-4 0Z" fill="${c}"/><circle r="1.4" fill="#FFE066"/>`,
  (c: string) => `<circle r="2.4" fill="${c}"/><circle cx="-3.6" cy="-3.6" r="1" fill="${c}"/><circle cx="3.6" cy="-3.6" r="1" fill="${c}"/><circle cx="-3.6" cy="3.6" r="1" fill="${c}"/><circle cx="3.6" cy="3.6" r="1" fill="${c}"/>`,
  (c: string) => `<path d="M-3.4 -3.4 L3.4 3.4 M3.4 -3.4 L-3.4 3.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/><circle r="1.4" fill="${c}"/>`,
  (c: string) => `<circle r="3" fill="none" stroke="${c}" stroke-width="1.6"/><circle r="1" fill="${c}"/>`,
];
/** Azulejo de Azul (12×12 con s=1). */
const az = (x: number, y: number, s: number, k: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(f(2.2 / s))} x="-6" y="-6" width="12" height="12" rx="2" fill="${AZ[k][0]}"/>` + AZP[k](AZ[k][1]) +
  `<path d="M-4 -4.2 H-1" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".7"/></g>`;
/** Pedazo de azulejo roto (triángulo). */
const shard = (x: number, y: number, s: number, k: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path ${ol(f(2 / s))} d="M-5 -4 L5 -3 L-1 5Z" fill="${AZ[k][0]}"/><circle cx="0" cy="-1" r="1.2" fill="${AZ[k][1]}"/></g>`;

// Dobble
const SYMS = [
  `<path ${ol(1.4)} d="M0 3.6 C-5 .4 -4 -4 0 -1.4 C4 -4 5 .4 0 3.6Z" fill="#E03131"/>`,
  `<polygon ${ol(1.4)} points="${starPts(0, 0, 4.2)}" fill="#FCC419"/>`,
  `<path ${ol(1.4)} d="M0 -4.6 C2.6 -1 3.4 .6 3.4 1.6 A3.4 3.4 0 0 1 -3.4 1.6 C-3.4 .6 -2.6 -1 0 -4.6Z" fill="#339AF0"/>`,
  `<path ${ol(1.3)} d="M1.2 -4.8 L-3 .8 H0 L-1.2 4.8 L3 -.8 H0Z" fill="#FF922B"/>`,
  `<circle ${ol(1.3)} cx="-1.8" cy="-.6" r="2" fill="#40C057"/><circle ${ol(1.3)} cx="1.8" cy="-.6" r="2" fill="#40C057"/><circle ${ol(1.3)} cx="0" cy="-3" r="2" fill="#40C057"/><path d="M0 0 L.6 4" stroke="${D}" stroke-width="1.3"/>`,
  `<circle ${ol(1.3)} r="3.4" fill="#9775FA"/><circle cx="-1" cy="-1" r="1" fill="#fff"/>`,
];
const sym = (k: number, x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${SYMS[k % SYMS.length]}</g>`;
/** Carta redonda de Dobble con símbolos. */
const dcard = (x: number, y: number, r: number, rot = 0) => {
  const s = r / 15;
  let g = '';
  for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * Math.PI / 180; g += sym(i + 1, f(r * .58 * Math.cos(a)), f(r * .58 * Math.sin(a)), s); }
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><circle ${ol(2.6)} r="${r}" fill="#fff"/><circle r="${f(r - 2.4)}" fill="none" stroke="#E9ECEF" stroke-width="1.2"/>${g}${sym(0, 0, 0, s * 1.1)}</g>`;
};

export const G1_ART: Record<string, (u: number) => string> = {
  // ══ TRUCO ══
  // ── Cantor de envidos ──
  'Pajarito de la radio': () =>
    `<path ${ol(3)} d="M28 96 V74 C28 52 92 52 92 74 V96Z" fill="#C97B45"/><path d="M33 92 V75 C33 59 49 56 56 56" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/>` +
    `<path ${ol(2.4)} d="M38 80 V74 C38 62 82 62 82 74 V80Z" fill="#FFE8B0"/><path d="M46 66 V80 M53 63 V80 M60 62 V80 M67 63 V80 M74 66 V80" stroke="#C9852E" stroke-width="1.6"/>` +
    `<rect ${ol(2)} x="38" y="84" width="26" height="7" rx="3.5" fill="#FFF3BF"/><path d="M42 86 V88 M46 86 V88 M50 86 V88 M54 86 V88 M58 86 V88" stroke="${D}" stroke-width="1"/><path d="M51 84.5 V90.5" stroke="#E03131" stroke-width="1.6"/>` +
    t(46, 82.6, 4.5, 'AM', '#8B5A3C') +
    `<circle ${ol(2)} cx="72" cy="87.5" r="4" fill="#8B5A3C"/><circle ${ol(2)} cx="82" cy="87.5" r="4" fill="#8B5A3C"/><path d="M72 84.5 V87 M82 84.5 V87" stroke="#fff" stroke-width="1.2"/>` +
    spCard(40, 45, -28, .5, '1', 'e') + spCard(44, 43, -12, .5, '7', 'e') +
    `<path ${ol(2.4)} d="M50 47 L37 42 L40 52Z" fill="#1C7ED6"/>` +
    `<ellipse ${ol(2.8)} cx="58" cy="45" rx="12.5" ry="10.5" fill="#4DABF7"/><ellipse cx="61.5" cy="49.5" rx="7" ry="4.6" fill="#FFE066"/>` +
    `<path ${ol(2)} d="M49 45 C51 39 59 40 59 46 C57 52 51 51 49 45Z" fill="#1C7ED6"/><path d="M51 38 C53 36 56 35 58 35" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>` +
    eye(63.5, 41, 1.9) + blush(66, 46, 2) +
    `<path ${ol(1.8)} d="M68.5 41 L78 38.5 L69.5 44Z" fill="#FF922B"/><path ${ol(1.8)} d="M69.5 45 L77 47.5 L68.5 47.5Z" fill="#FF922B"/>` +
    line('M55 55.5 V58 M62 55.5 V58', 2, '#FF922B') +
    note(84, 48, 1, '#FF6B6B') + note(92, 60, .8, '#9775FA') + note(26, 66, .8, '#20C997'),
  'Zorzal criollo': () =>
    stick('M24 86 C40 82 70 83 96 80', '#8B5A3C', 4) + `<ellipse ${ol(1.8)} cx="88" cy="76" rx="5" ry="2.6" fill="#51CF66" transform="rotate(-30 88 76)"/><ellipse ${ol(1.8)} cx="30" cy="80" rx="5" ry="2.6" fill="#51CF66" transform="rotate(30 30 80)"/>` +
    `<path ${ol(2.6)} d="M40 68 L22 74 L26 66 L22 60 L40 60Z" fill="#8B5A3C"/>` +
    `<ellipse ${ol(3)} cx="56" cy="62" rx="20" ry="19" fill="#B4703F"/><ellipse cx="62" cy="70" rx="12" ry="10" fill="#FFE8CC"/>` +
    [[57, 66], [63, 64], [68, 68], [60, 72], [66, 75], [55, 75]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.6" fill="#B4703F"/>`).join('') +
    `<path ${ol(2.4)} d="M38 62 C42 52 54 54 56 64 C54 74 42 74 38 62Z" fill="#8B5A3C"/><path d="M42 61 C44 58 48 57 50 58" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5"/>` +
    eye(65, 54, 2.3) + `<path d="M61 50 L68 51" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` + blush(68, 60, 2.4) +
    `<path ${ol(2)} d="M72 53 L89 46 L74 58Z" fill="#FCC419"/><path ${ol(2)} d="M74 60 L87 64 L72 63Z" fill="#FCC419"/><path d="M74 58 L86 62 L74 60.5Z" fill="#C92A2A"/>` +
    `<path ${ol(2.2)} d="M50 76 Q62 82 74 72 L76 77 Q62 88 50 81Z" fill="#E03131"/><path ${ol(2)} d="M70 77 L76 88 L80 76Z" fill="#E03131"/><circle cx="58" cy="80" r="1" fill="#fff"/><circle cx="66" cy="79" r="1" fill="#fff"/>` +
    `<ellipse ${ol(2.6)} cx="56" cy="44" rx="20" ry="4.2" fill="#343A40" transform="rotate(-8 56 44)"/>` +
    `<path ${ol(2.6)} d="M45 45 L47 33 C47 30 63 28 64 31 L66 42Z" fill="#343A40"/><path d="M46.5 39 L65 36.5" stroke="#868E96" stroke-width="2.6"/><path d="M49 34 C52 32 56 31 59 31" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>` +
    note(32, 50, 1, '#FF6B6B') + note(40, 36, .8, '#4DABF7') + note(92, 72, .7, '#FCC419'),
  'Gardel en el Abasto': () =>
    `<path ${ol(3)} d="M28 98 V50" fill="none"/><path d="M28 98 V50" stroke="#495057" stroke-width="2"/>` +
    `<circle cx="28" cy="38" r="11" fill="#FFE066" opacity=".45"/><path ${ol(2.4)} d="M22 46 H34 L36 38 L28 31 L20 38Z" fill="#FFD43B"/><path ${ol(2)} d="M20 38 H36 M28 31 V46" fill="none"/><path ${ol(2)} d="M24 46 H32 L31 50 H25Z" fill="#495057"/>` +
    star(88, 28, 4, '#FFD43B', 1.6) + sparkle(94, 46, 3) +
    `<path ${ol(3)} d="M32 104 C32 82 44 74 60 74 C76 74 88 82 88 104Z" fill="#343A40"/><path ${ol(2)} d="M53 74 L60 88 L67 74Z" fill="#fff"/>` +
    `<path ${ol(2)} d="M53 74 L60 88 L50 84 L47 76Z M67 74 L60 88 L70 84 L73 76Z" fill="#212529"/><path ${ol(1.8)} d="M54 75 L60 78 L66 75 L66 81 L60 78 L54 81Z" fill="${D}"/>` +
    `<rect ${ol(2)} x="56" y="68" width="8" height="8" fill="#F4BE8F"/>` +
    `<ellipse ${ol(3)} cx="60" cy="56" rx="14" ry="15" fill="#F4BE8F"/>` +
    `<path d="M47 52 C47 46 50 44 54 44 L66 44 C70 44 73 46 73 52 C71 48 68 47 66 47 L54 47 C52 47 49 48 47 52Z" fill="#212529"/>` +
    `<path d="M51.5 54 Q54 51.5 56.5 54 M63.5 54 Q66 51.5 68.5 54" fill="none" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/><path d="M51 50 Q54 48.5 57 50 M63 50 Q66 48.5 69 50" fill="none" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    blush(50, 60) + blush(70, 60) + `<path ${ol(2)} d="M52 61 Q60 70 68 61Z" fill="#fff"/><path d="M58 57 Q60 58.5 62 57" stroke="${D}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<ellipse ${ol(2.8)} cx="60" cy="43" rx="23" ry="5" fill="#868E96" transform="rotate(-6 60 43)"/>` +
    `<path ${ol(2.8)} d="M45 43 C45 32 48 26 60 26 C72 26 75 32 75 41Z" fill="#868E96"/><path d="M55 27 Q60 31 65 27" stroke="${D}" stroke-width="1.6" fill="none"/>` +
    `<path d="M45.4 38 C55 37 66 36 74.6 35 L74.8 40.5 C66 41.5 55 42.5 45.2 43Z" fill="#212529"/><path d="M49 34 C49 30 52 28 55 28" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".55"/>` +
    spCard(78, 80, -14, .55, '1', 'e') + spCard(84, 79, 4, .55, '7', 'o') + spCard(89, 81, 22, .55, '3', 'c') +
    `<circle ${ol(2)} cx="80" cy="88" r="4.5" fill="#F4BE8F"/>` +
    note(36, 66, .8, '#FCC419'),

  // ── Vale cuatro ──
  'Siete bravo': () =>
    stick('M50 88 L48 96', '#FFF8E7', 3) + stick('M70 88 L72 96', '#FFF8E7', 3) +
    `<path ${ol(2.2)} d="M42 96 H52 V99 H42Z M68 96 H78 V99 H68Z" fill="${D}"/>` +
    stick('M42 62 C34 66 34 74 40 76', '#FFF8E7', 3.4) + stick('M78 66 L82 66', '#FFF8E7', 3.4) +
    `<rect ${ol(3)} x="40" y="32" width="40" height="58" rx="6" fill="#FFF8E7"/>` +
    `<path d="M45 46 V85 H75 V37 H55" fill="none" stroke="${SUIT_C.e}" stroke-width="1.6" stroke-dasharray="6 3"/>` + t(47.5, 46, 13, '7', SUIT_C.e) +
    `<path d="M48 54 L56 57 M72 54 L64 57" stroke="${D}" stroke-width="3" stroke-linecap="round"/>` + eye(53, 60, 2.4) + eye(67, 60, 2.4) +
    blush(48, 66) + blush(72, 66) + `<path ${ol(2)} d="M53 70 Q60 66 67 70 L66 73 Q60 71 54 73Z" fill="#fff"/>` +
    `<path d="M56 78 C58 76 62 76 64 78" stroke="${SUIT_C.e}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<circle ${ol(2)} cx="40" cy="76" r="3.6" fill="#FFF8E7"/>` +
    sword(80, 66, .68, 58) + `<circle ${ol(2)} cx="82" cy="67" r="3.8" fill="#FFF8E7"/>` +
    line('M30 46 L35 49 M27 56 L33 57 M30 66 L35 64', 2.2),
  'Ancho de bastos': () =>
    spCard(46, 58, -12, 1.35, '1', 'b', t(6.3, 13, 7, '1', SUIT_C.b, 'transform="rotate(180 6.3 10.5)"')) +
    basto(64, 58, 1.42, 22, `<rect x="-9" y="-12" width="7" height="4.6" rx="2" fill="${D}"/><rect x="-1" y="-13.5" width="7" height="4.6" rx="2" fill="${D}"/><path d="M-2 -10.5 L-1 -11" stroke="${D}" stroke-width="1"/>` +
      `<path d="M-7.6 -11 L-5.6 -11.4" stroke="#fff" stroke-width=".9" stroke-linecap="round"/><path d="M.4 -12.5 L2.4 -12.9" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M-5 -3 Q0 -1 3 -5" stroke="${D}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`) +
    sparkle(86, 34, 4.5) + sparkle(30, 86, 3.5, '#fff') + star(88, 80, 4, '#FFD43B', 1.6),
  'Ancho de espadas': () => {
    let rays = '';
    for (let i = 0; i < 12; i++) {
      const a1 = (i * 30 - 6) * Math.PI / 180, a2 = (i * 30 + 6) * Math.PI / 180;
      rays += `M60 50 L${f(60 + 60 * Math.cos(a1))} ${f(50 + 60 * Math.sin(a1))} L${f(60 + 60 * Math.cos(a2))} ${f(50 + 60 * Math.sin(a2))}Z `;
    }
    return `<path d="${rays}" fill="#FFE066" opacity=".55"/><circle cx="60" cy="50" r="20" fill="#FFF3BF" opacity=".8"/>` +
      `<path ${ol(3)} d="M20 82 C30 76 90 76 100 82 V100 H20Z" fill="#8B5A3C"/><path d="M20 82 C30 76 90 76 100 82 C90 88 30 88 20 82Z" fill="#B4703F"/><path ${ol(3)} d="M20 82 C30 76 90 76 100 82" fill="none"/>` +
      `<path d="M30 81 C40 79 50 78 56 78" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".4"/>` +
      `<path d="M52 82 L48 85 M68 82 L72 85 M60 83 L60 86" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<g transform="translate(60 40) scale(1.5)"><path ${ol(2)} d="M-3.4 0 V27 L0 29 L3.4 27 V0Z" fill="#DEE2E6"/><path d="M-1.2 3 V26" stroke="#fff" stroke-width="1.4"/><path d="M1.4 3 V26" stroke="#ADB5BD" stroke-width="1"/>` +
      `<rect ${ol(1.8)} x="-2.4" y="-12" width="4.8" height="10" rx="1.8" fill="#C92A2A"/><path d="M-2.4 -9 H2.4 M-2.4 -6 H2.4" stroke="#FCC419" stroke-width="1"/><circle ${ol(1.8)} cx="0" cy="-13.5" r="3.2" fill="#FCC419"/>` +
      `<path ${ol(2)} d="M-12 1 C-8 -3 8 -3 12 1 L11 -3.5 C7 -6 -7 -6 -11 -3.5Z" fill="#FCC419"/><circle cx="0" cy="-1.6" r="1.4" fill="#E03131"/></g>` +
      `<ellipse ${ol(2)} cx="35" cy="80" rx="5" ry="1.8" fill="#FFF3BF"/><path ${ol(2)} d="M30 66 L32 80 H38 L40 66Z" fill="#DEE2E6" fill-opacity=".8"/><path d="M31 71 H39 L38 80 H32Z" fill="#7B2D26"/>` +
      sparkle(84, 30, 5) + sparkle(36, 30, 4, '#fff') + sparkle(86, 62, 3.5);
  },

  // ── Jugado a la falta ──
  'Mano en la lata': () =>
    `<ellipse ${ol(2.6)} cx="36" cy="50" rx="17" ry="6" fill="#1C7ED6" transform="rotate(-62 36 50)"/><ellipse cx="36" cy="50" rx="12" ry="3" fill="none" stroke="#fff" stroke-width="1.6" transform="rotate(-62 36 50)"/>` +
    `<path ${ol(3)} d="M28 68 V86 C28 96 92 96 92 86 V68Z" fill="#1C7ED6"/><path d="M28 74 C40 82 80 82 92 74 V80 C80 88 40 88 28 80Z" fill="#fff" opacity=".85"/>` +
    [36, 48, 60, 72, 84].map((x) => `<circle cx="${x}" cy="${x === 36 || x === 84 ? 79.5 : 82.5}" r="1.6" fill="#E03131"/>`).join('') +
    `<ellipse ${ol(3)} cx="60" cy="68" rx="32" ry="9" fill="#1864AB"/>` +
    `<g transform="rotate(-12 46 64)"><rect ${ol(2)} x="36" y="60" width="18" height="7" rx="3.5" fill="#8CE99A"/><ellipse ${ol(1.6)} cx="54" cy="63.5" rx="2" ry="3.5" fill="#B2F2BB"/><rect x="43" y="60" width="3" height="7" fill="#E03131"/></g>` +
    `<g transform="rotate(16 74 62)"><rect ${ol(2)} x="66" y="58" width="18" height="7" rx="3.5" fill="#8CE99A"/><ellipse ${ol(1.6)} cx="84" cy="61.5" rx="2" ry="3.5" fill="#B2F2BB"/><rect x="73" y="58" width="3" height="7" fill="#E03131"/></g>` +
    coin(40, 70, 4.5) + coin(52, 68, 5) + coin(80, 70, 4.5) + coin(64, 70, 4) +
    `<path d="M100 46 L74 56" stroke="${D}" stroke-width="15" stroke-linecap="round"/><path d="M100 46 L74 56" stroke="#F4BE8F" stroke-width="9.4" stroke-linecap="round"/>` +
    `<rect ${ol(2.6)} x="86" y="40" width="16" height="15" rx="3" fill="#7048E8" transform="rotate(-20 94 47)"/><path d="M89 43 L91 52" stroke="#fff" stroke-width="1.8" opacity=".4" stroke-linecap="round" transform="rotate(-20 94 47)"/>` +
    `<path ${ol(2.6)} d="M74 50 C70 48 64 50 63 54 L60 62 C59 65 62 66 64 64 L65 62 L64 66 C64 68 67 69 68 67 L69 64 L69 67 C70 69 73 69 73 66 L73 63 C76 64 78 62 78 58 C78 55 77 52 74 50Z" fill="#F4BE8F"/>` +
    `<path ${ol(2)} d="M72 52 C68 51 64 53 64 56" fill="none"/>` +
    sparkle(30, 32, 4) + sparkle(84, 36, 3.5) + t(78, 34, 9, '$', '#2F9E44') + t(70, 26, 6, '$', '#2F9E44'),
  'Casino de Mar del Plata': () =>
    `<path ${ol(2.6)} d="M20 42 H100 V80 H20Z" fill="#F1E3CF"/><path ${ol(2.6)} d="M18 36 H102 V43 H18Z" fill="#E8590C"/>` +
    [30, 42, 54, 66, 78, 90].map((x) => `<path ${ol(1.8)} d="M${x - 4} 58 V52 C${x - 4} 47 ${x + 4} 47 ${x + 4} 52 V58Z" fill="#4DABF7"/><path ${ol(1.8)} d="M${x - 4} 74 V67 C${x - 4} 62 ${x + 4} 62 ${x + 4} 67 V74Z" fill="#4DABF7"/>`).join('') +
    `<path d="M38 36 V27 M82 36 V27" stroke="${D}" stroke-width="1.8"/><path ${ol(1.6)} d="M38 27 L46 29.5 L38 32Z" fill="#74C0FC"/><path ${ol(1.6)} d="M82 27 L90 29.5 L82 32Z" fill="#74C0FC"/>` +
    `<path ${ol(2.6)} d="M18 82 Q28 78 38 82 T58 82 T78 82 T102 82 V100 H18Z" fill="#74C0FC"/>` +
    `<rect ${ol(2.6)} x="24" y="84" width="30" height="12" rx="2" fill="#ADB5BD"/>` +
    `<path ${ol(2.8)} d="M28 85 C26 74 30 64 36 60 C36 52 42 46 48 48 C52 49 54 52 52 56 C49 58 46 60 46 64 C48 72 52 78 52 85Z" fill="#CED4DA"/>` +
    `<path ${ol(2.2)} d="M46 64 C50 66 52 70 50 74" fill="none"/><path d="M33 72 C33 66 35 62 38 60" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>` +
    `<circle cx="45" cy="52" r="1.3" fill="${D}"/><path d="M50 54 L53 53 M50 55.5 L53 56" stroke="${D}" stroke-width=".8"/>` +
    `<circle ${ol(3)} cx="76" cy="76" r="17" fill="#E03131"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<rect x="73" y="59.6" width="6" height="5.5" fill="#fff" transform="rotate(${i * 60} 76 76)"/>`).join('') +
    `<circle ${ol(2.2)} cx="76" cy="76" r="10" fill="#FFF3BF"/>` + t(76, 80.6, 12, '$', '#E03131') + `<circle cx="76" cy="76" r="17" ${ol(3)} fill="none"/>` +
    shine('M64 68 C66 64 69 62 72 61', 2.4, .7) + sparkle(94, 56, 3.5) + sparkle(62, 30, 3, '#fff'),
  'Hipoteca al paño': () =>
    `<path ${ol(3)} d="M16 72 C30 60 90 60 104 72 V104 H16Z" fill="#8B5A3C"/><path d="M22 76 C34 66 86 66 98 76 V104 H22Z" fill="#2B8A3E"/><path d="M34 74 C44 70 54 69 62 69" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".3"/>` +
    `<ellipse cx="60" cy="84" rx="20" ry="4" fill="#1E6E2E"/>` +
    `<path ${ol(3)} d="M44 84 V58 H76 V84Z" fill="#FFE8CC"/><path ${ol(3)} d="M40 60 L60 40 L80 60Z" fill="#E03131"/><path ${ol(2.2)} d="M68 48 V40 H74 V54" fill="#ADB5BD"/>` +
    `<path d="M47 57 L60 44 L73 57" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".4"/>` +
    `<rect ${ol(2)} x="48" y="62" width="9" height="8" rx="1" fill="#A5D8FF"/><rect ${ol(2)} x="63" y="62" width="9" height="8" rx="1" fill="#A5D8FF"/>` +
    `<circle cx="53" cy="66.5" r="2" fill="${D}"/><circle cx="67" cy="66.5" r="2" fill="${D}"/><path d="M49 61 L55 59 M71 61 L65 59" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path ${ol(2)} d="M55 84 V77 C55 72 65 72 65 77 V84Z" fill="#C97B45"/><path d="M57 78 Q60 75.5 63 78" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(1.6)} d="M80 50 C78 54 78 56 80 57 C82 56 82 54 80 50Z" fill="#74C0FC"/>` +
    [0, 1, 2, 3].map((i) => `<ellipse ${ol(2)} cx="30" cy="${88 - i * 4}" rx="7" ry="2.8" fill="${i % 2 ? '#fff' : '#E03131'}"/>`).join('') +
    [0, 1, 2].map((i) => `<ellipse ${ol(2)} cx="38" cy="${94 - i * 4}" rx="7" ry="2.8" fill="${i % 2 ? '#fff' : '#1C7ED6'}"/>`).join('') +
    matchStick(84, 94, 94, 82) + spCard(88, 68, 18, .55, '7', 'e') +
    sparkle(30, 46, 4) + sparkle(92, 40, 3.5, '#fff'),

  // ── Truquero ──
  'Fósforo encendido': () => `<g transform="translate(0 4)">` +
    `<circle cx="60" cy="36" r="20" fill="#FFE066" opacity=".35"/>` +
    `<path ${ol(3)} d="M60 14 C66 22 74 26 72 36 C71 42 66 46 60 46 C54 46 49 42 48 36 C47 30 52 28 52 22 C55 26 57 26 58 24 C58 20 58 17 60 14Z" fill="#FF922B"/>` +
    `<path d="M60 24 C63 29 67 32 66 37 C65 41 63 43 60 43 C57 43 54 41 54 37 C54 34 56 33 57 30 C58 32 60 30 60 24Z" fill="#FFD43B"/>` +
    stick('M47 66 L36 56', '#F2C48D', 3) + stick('M73 66 L84 56', '#F2C48D', 3) + `<circle ${ol(2)} cx="35" cy="55" r="3.4" fill="#F2C48D"/><circle ${ol(2)} cx="85" cy="55" r="3.4" fill="#F2C48D"/>` +
    `<rect ${ol(3)} x="51" y="56" width="18" height="44" rx="3" fill="#F2C48D"/><path d="M55 62 V96" stroke="#fff" stroke-width="2" opacity=".5"/><path d="M64 70 V80 M62 86 V94" stroke="#C9852E" stroke-width="1.2"/>` +
    `<ellipse ${ol(3)} cx="60" cy="54" rx="14" ry="12" fill="#E03131"/><ellipse cx="54" cy="48" rx="3.6" ry="2.2" fill="#fff" opacity=".6" transform="rotate(-30 54 48)"/>` +
    `<path d="M52.5 54 Q55 51.5 57.5 54 M62.5 54 Q65 51.5 67.5 54" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="51" cy="58.5" r="2.2" fill="#FFA8A8"/><circle cx="69" cy="58.5" r="2.2" fill="#FFA8A8"/><path ${ol(1.8)} d="M55.5 58 Q60 64 64.5 58Z" fill="#fff"/>` +
    sparkle(32, 30, 4) + sparkle(88, 30, 3.5) + sparkle(84, 80, 3, '#fff') + `<circle cx="38" cy="40" r="1.6" fill="#FF922B"/><circle cx="82" cy="44" r="1.4" fill="#FF922B"/></g>`,
  'Tres Patitos': () =>
    `<rect ${ol(2.6)} x="34" y="36" width="52" height="20" rx="2" fill="#F1E3CF"/>` +
    [[38, 34], [44, 30], [50, 33], [56, 28], [62, 32], [68, 29], [74, 33], [80, 31]].map(([x, y], i) =>
      `<rect ${ol(1.6)} x="${x - 1.6}" y="${y}" width="3.2" height="${46 - y}" fill="#F2C48D"/><ellipse ${ol(1.6)} cx="${x}" cy="${y}" rx="2.8" ry="3.4" fill="${i === 3 ? '#212529' : '#E03131'}"/>`).join('') +
    `<path d="M56 24 C55 20 57 18 56 15 C59 18 59 21 58 24Z" fill="#FF922B" ${ol(1.4)}/><path d="M53 22 C51 18 53 15 51 12" stroke="#ADB5BD" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<rect ${ol(3)} x="28" y="46" width="64" height="46" rx="4" fill="#1971C2"/><rect x="28" y="46" width="64" height="5" fill="#E03131"/><rect x="28" y="87" width="64" height="5" rx="2" fill="#E03131"/><rect ${ol(3)} x="28" y="46" width="64" height="46" rx="4" fill="none"/>` +
    `<rect ${ol(2)} x="34" y="55" width="52" height="28" rx="5" fill="#FFF3BF"/>` +
    `<path d="M36 79 Q48 75 60 79 T84 79" stroke="#74C0FC" stroke-width="2" fill="none"/>` +
    duck(44, 71, 1.15) + duck(59, 69, 1.25) + duck(74, 71, 1.15) +
    `<path d="M31 50 V70" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".35"/>` + sparkle(92, 30, 3.5) + sparkle(26, 34, 3, '#fff'),
  'Fogón de estancia': () =>
    `<rect x="10" y="10" width="100" height="100" fill="#243B6B"/><circle cx="60" cy="70" r="34" fill="#FF922B" opacity=".18"/>` +
    `<path ${ol(2)} d="M86 22 A9 9 0 1 0 92 36 A7 7 0 1 1 86 22Z" fill="#FFF3BF"/>` +
    [[30, 30], [44, 24], [70, 30], [36, 46], [80, 48], [58, 38], [92, 58], [26, 60]].map(([x, y], i) => i % 3 ? `<circle cx="${x}" cy="${y}" r="1.3" fill="#fff"/>` : `<polygon points="${starPts(x, y, 3, 1.2, 4)}" fill="#FFE066"/>`).join('') +
    `<path ${ol(3)} d="M10 84 C30 78 90 78 110 84 V110 H10Z" fill="#2F6B3A"/>` +
    `<ellipse cx="60" cy="88" rx="22" ry="4" fill="#1E4A26"/>` +
    `<path ${ol(3)} d="M60 46 C65 54 74 58 72 70 C71 78 66 84 60 84 C54 84 48 80 47 72 C46 64 52 62 52 54 C55 58 57 58 58 56 C58 52 58 50 60 46Z" fill="#FF922B"/>` +
    `<path d="M60 60 C63 65 67 68 66 74 C65 79 63 81 60 81 C57 81 54 79 54 75 C54 71 56 70 57 66 C58 68 60 66 60 60Z" fill="#FFD43B"/>` +
    matchStick(44, 92, 58, 68) + matchStick(76, 92, 62, 68) + matchStick(52, 94, 64, 72) + matchStick(68, 94, 56, 72) +
    `<path ${ol(2.6)} d="M22 92 C22 82 26 76 34 76 C42 76 46 82 46 92Z" fill="#ADB5BD"/><path ${ol(2.2)} d="M26 78 C26 72 42 72 42 78" fill="none"/><path ${ol(2.2)} d="M44 84 L50 78 L52 80" fill="none"/>` +
    `<path d="M27 88 C27 84 29 81 32 80" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/><path d="M36 70 C34 66 38 64 36 60" stroke="#CED4DA" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    mate(86, 86, .65) + flameSmall(40, 60, .5) + flameSmall(80, 58, .45),

  // ══ RUMMIKUB ══
  // ── Atril vacío ──
  'Cartón lleno': () => {
    const nums = [[3, 17, 0, 48, 0], [0, 22, 35, 0, 71], [9, 0, 38, 56, 0]];
    let g = '';
    nums.forEach((row, r) => row.forEach((n, c) => {
      const x = 33 + c * 11.5, y = 52 + r * 11;
      g += `<rect x="${x - 5.2}" y="${y - 5}" width="10.4" height="10" fill="${n ? '#fff' : '#FFD8A8'}" stroke="#E9D8B4" stroke-width="1"/>`;
      if (n) g += t(x, y + 3, 7, String(n), D) + `<circle cx="${x}" cy="${y}" r="4.6" fill="#F06595" opacity=".55"/>`;
    }));
    return `<g transform="rotate(-6 60 62)"><rect ${ol(3)} x="24" y="34" width="72" height="54" rx="5" fill="#FFF8E7"/><rect x="24" y="34" width="72" height="12" rx="5" fill="#E03131"/><rect x="24" y="40" width="72" height="6" fill="#E03131"/><rect ${ol(3)} x="24" y="34" width="72" height="54" rx="5" fill="none"/>` +
      t(60, 44, 10, 'BINGO', '#fff', 'letter-spacing="1.5"') + g + `</g>` +
      `<g transform="rotate(38 86 76)"><rect ${ol(2.4)} x="80" y="56" width="11" height="30" rx="2" fill="#F06595"/><rect ${ol(2.2)} x="80" y="50" width="11" height="8" rx="2" fill="#C2255C"/><path ${ol(2)} d="M82 86 H89 L87 92 H84Z" fill="#fff"/><path d="M83 60 V80" stroke="#fff" stroke-width="1.8" opacity=".5" stroke-linecap="round"/></g>` +
      sparkle(32, 28, 4) + sparkle(90, 30, 3.5) + star(28, 90, 4, '#FFD43B', 1.6);
  },
  'Abuela del bingo': () => {
    const crd = (x: number, y: number, r: number, c: string) => `<g transform="rotate(${r} ${x} ${y + 12})"><rect ${ol(2)} x="${x - 9}" y="${y}" width="18" height="22" rx="2" fill="#FFF8E7"/><rect x="${x - 9}" y="${y}" width="18" height="5" rx="2" fill="${c}"/>` +
      `<path d="M${x - 6} ${y + 9} h3 m3 0 h3 m3 0 h3 M${x - 6} ${y + 13} h3 m3 0 h3 m3 0 h3 M${x - 6} ${y + 17} h3 m3 0 h3 m3 0 h3" stroke="#ADB5BD" stroke-width="1.6"/><circle cx="${x - 3}" cy="${y + 13}" r="2" fill="#F06595" opacity=".7"/><circle cx="${x + 3}" cy="${y + 9}" r="2" fill="#F06595" opacity=".7"/></g>`;
    const pen = (x: number, y: number, r: number, c: string) => `<g transform="rotate(${r} ${x} ${y})"><rect ${ol(2)} x="${x - 3}" y="${y - 16}" width="6" height="18" rx="1.5" fill="${c}"/><path ${ol(1.6)} d="M${x - 2} ${y - 16} L${x} ${y - 21} L${x + 2} ${y - 16}Z" fill="#fff"/></g>`;
    return `<path ${ol(3)} d="M34 102 C34 80 44 72 60 72 C76 72 86 80 86 102Z" fill="#9775FA"/><path d="M60 72 V102" stroke="#7048E8" stroke-width="2"/><circle cx="57" cy="80" r="1.4" fill="#fff"/><circle cx="57" cy="88" r="1.4" fill="#fff"/>` +
      `<circle ${ol(3)} cx="60" cy="28" r="7" fill="#DEE2E6"/>` +
      `<circle ${ol(3)} cx="60" cy="52" r="17" fill="#F4BE8F"/>` +
      `<path ${ol(2.6)} d="M43 52 C40 40 48 33 60 33 C72 33 80 40 77 52 C75 44 70 40 64 41 C60 42 52 41 47 44 C44 46 44 50 43 52Z" fill="#DEE2E6"/>` +
      `<circle cx="53" cy="54" r="5" fill="#fff" fill-opacity=".5" stroke="${D}" stroke-width="2"/><circle cx="67" cy="54" r="5" fill="#fff" fill-opacity=".5" stroke="${D}" stroke-width="2"/><path d="M58 54 H62" stroke="${D}" stroke-width="2"/>` +
      `<circle cx="53" cy="54.5" r="1.8" fill="${D}"/><circle cx="67" cy="54.5" r="1.8" fill="${D}"/>` + blush(47, 61) + blush(73, 61) +
      `<path ${ol(1.8)} d="M55 62 Q60 67 65 62Z" fill="#fff"/>` +
      crd(40, 72, -22, '#E03131') + crd(52, 70, -8, '#1C7ED6') + crd(68, 70, 8, '#F08C00') + crd(80, 72, 22, '#2F9E44') +
      pen(30, 60, -20, '#F06595') + pen(90, 60, 20, '#20C997') + `<circle ${ol(2.2)} cx="30" cy="60" r="4.6" fill="#F4BE8F"/><circle ${ol(2.2)} cx="90" cy="60" r="4.6" fill="#F4BE8F"/>`;
  },
  'Rey del bingo': () => {
    const balls = [[52, 62, '#E03131'], [66, 66, '#1C7ED6'], [58, 72, '#F08C00'], [70, 56, '#2F9E44'], [48, 72, '#F06595']] as const;
    return `<path ${ol(3)} d="M38 40 C26 56 24 80 26 96 H94 C96 80 94 56 82 40Z" fill="#C92A2A"/><path d="M28 94 C30 74 32 58 40 46" stroke="#E03131" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path ${ol(2.4)} d="M26 92 H94 V98 H26Z" fill="#fff"/>` + [32, 44, 56, 68, 80, 90].map((x) => `<path d="M${x} 93.5 V96.5" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>`).join('') +
      `<path ${ol(3)} d="M46 90 L52 80 H68 L74 90Z" fill="#FCC419"/>` +
      `<circle cx="60" cy="62" r="19" fill="#E7F5FF"/>` +
      balls.map(([x, y, c]) => `<circle ${ol(1.6)} cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/><circle cx="${x - 2}" cy="${y - 2.4}" r="1" fill="#fff" opacity=".8"/>`).join('') +
      `<circle ${ol(3)} cx="60" cy="62" r="19" fill="none"/><ellipse cx="60" cy="62" rx="8" ry="19" fill="none" stroke="${D}" stroke-width="1.8"/><path d="M41 62 H79" stroke="${D}" stroke-width="1.8"/>` +
      `<path d="M46 50 C49 46 53 44 57 44" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>` +
      stick('M79 62 H86 V72', '#ADB5BD', 2.6) + `<circle ${ol(2)} cx="86" cy="74" r="3.4" fill="#E03131"/><circle ${ol(2.2)} cx="60" cy="62" r="2.6" fill="#FCC419"/>` +
      crown(60, 36, 1.3) + sparkle(32, 30, 4.5) + sparkle(90, 32, 4) + sparkle(30, 70, 3, '#fff');
  },

  // ── De una ──
  'Atril pelado': () =>
    `<path ${ol(3)} d="M28 80 L31 60 H89 L92 80Z" fill="#495057"/><path ${ol(2.4)} d="M29.5 70 H90.5 L91 73 H29Z" fill="#343A40"/>` +
    `<path d="M34 63 H70" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35"/>` +
    `<rect ${ol(3)} x="22" y="78" width="76" height="11" rx="4" fill="#212529"/><path d="M27 81 H50" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>` +
    `<circle cx="53" cy="83" r="1.7" fill="#fff"/><circle cx="67" cy="83" r="1.7" fill="#fff"/><path d="M57 84.5 Q60 87.5 63 84.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    blush(47, 85, 2) + blush(73, 85, 2) +
    tile(36, 42, 1, TILE_C[0], -20, .9) + tile(52, 34, 2, TILE_C[1], 8, .9) + tile(70, 38, 3, TILE_C[2], 16, .9) + tile(86, 46, 4, TILE_C[3], 28, .9) +
    line('M34 54 L32 58 M50 46 L50 50 M70 50 L71 54 M86 58 L88 61', 2) +
    sparkle(26, 70, 4.5) + sparkle(94, 66, 4) + sparkle(60, 56, 3, '#fff'),
  'Malabarista de semáforo': () =>
    `<path ${ol(3.4)} d="M30 100 V74" fill="none"/><path d="M30 100 V74" stroke="#495057" stroke-width="2.4"/>` +
    `<rect ${ol(3)} x="22" y="30" width="16" height="44" rx="5" fill="#343A40"/><circle cx="30" cy="40" r="9" fill="#FF6B6B" opacity=".35"/>` +
    `<circle ${ol(2)} cx="30" cy="40" r="5" fill="#FF6B6B"/><circle cx="28.4" cy="38.4" r="1.6" fill="#fff"/><circle ${ol(2)} cx="30" cy="52" r="5" fill="#5C4813"/><circle ${ol(2)} cx="30" cy="64" r="5" fill="#1E4A26"/>` +
    stick('M60 86 L56 98', '#1C7ED6', 4) + stick('M68 86 L72 98', '#1C7ED6', 4) +
    stick('M56 70 C50 66 48 58 50 52', '#F4BE8F', 3.4) + stick('M72 70 C78 66 80 58 78 52', '#F4BE8F', 3.4) +
    `<path ${ol(3)} d="M54 88 L55 70 C55 66 73 66 73 70 L74 88Z" fill="#FCC419"/><path d="M55 74 H73 M54.6 80 H73.4" stroke="#E03131" stroke-width="2.6"/><path ${ol(3)} d="M54 88 L55 70 C55 66 73 66 73 70 L74 88Z" fill="none"/>` +
    `<circle ${ol(3)} cx="64" cy="58" r="9" fill="#F4BE8F"/><path ${ol(2.4)} d="M55 56 C55 47 73 47 73 56 C70 53 58 53 55 56Z" fill="#7048E8"/><circle ${ol(1.8)} cx="64" cy="48.5" r="2.4" fill="#FCC419"/>` +
    `<circle cx="61" cy="59" r="1.4" fill="${D}"/><circle cx="67" cy="59" r="1.4" fill="${D}"/><path d="M61 62.5 Q64 65 67 62.5" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M48 44 C50 28 76 22 84 42" stroke="${D}" stroke-width="1.4" fill="none" stroke-dasharray="2 3" opacity=".6"/>` +
    tile(50, 40, 7, TILE_C[1], -25, .95) + tile(66, 26, 7, TILE_C[0], 10, .95) + tile(82, 40, 7, TILE_C[3], 30, .95) +
    `<circle ${ol(2)} cx="50" cy="52" r="3" fill="#F4BE8F"/><circle ${ol(2)} cx="78" cy="52" r="3" fill="#F4BE8F"/>`,
  'Houdini': () =>
    puff(30, 40, 1.3) + puff(90, 44, 1.2) + puff(28, 76, 1.1) + puff(92, 78, 1.2) +
    tile(30, 39, 5, TILE_C[0], -15, .7).replace('<g ', '<g opacity=".7" ') + tile(90, 43, 9, TILE_C[1], 15, .7).replace('<g ', '<g opacity=".45" ') + tile(92, 76, 12, TILE_C[2], 10, .6).replace('<g ', '<g opacity=".3" ') +
    `<path ${ol(3)} d="M36 100 C38 80 44 72 60 72 C76 72 82 80 84 100Z" fill="#343A40"/><path ${ol(2)} d="M54 72 L60 82 L66 72Z" fill="#fff"/><path ${ol(1.8)} d="M55 74 L60 77 L65 74 L65 80 L60 77 L55 80Z" fill="#E03131"/>` +
    `<circle ${ol(3)} cx="60" cy="56" r="13" fill="#F4BE8F"/>` +
    `<path d="M53 54 Q55.5 51.5 58 54 M62 54 Q64.5 51.5 67 54" fill="none" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/><path d="M52 50 L57 51 M68 50 L63 51" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path ${ol(1.6)} d="M60 60 C56 58 51 59 50 63 C54 61 57 62 60 61.5 C63 62 66 61 70 63 C69 59 64 58 60 60Z" fill="#212529"/><path d="M56 65 Q60 67 64 65" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="45" rx="17" ry="3.6" fill="#212529"/><path ${ol(2.6)} d="M49 45 L50 27 H70 L71 45Z" fill="#212529"/><path d="M49.6 40 H70.4 V43.5 H49.4Z" fill="#E03131"/><path d="M53 30 V38" stroke="#fff" stroke-width="1.6" opacity=".4" stroke-linecap="round"/>` +
    `<path d="M40 86 C50 82 70 92 80 84" stroke="${D}" stroke-width="5.4" fill="none" stroke-dasharray="5 2.5"/><path d="M40 86 C50 82 70 92 80 84" stroke="#ADB5BD" stroke-width="2.6" fill="none" stroke-dasharray="5 2.5"/>` +
    `<ellipse ${ol(2)} cx="24" cy="60" rx="5" ry="3" fill="#ADB5BD" transform="rotate(-30 24 60)"/><ellipse ${ol(2)} cx="96" cy="62" rx="5" ry="3" fill="#ADB5BD" transform="rotate(30 96 62)"/>` +
    line('M32 64 L36 67 M88 66 L84 69 M30 54 L35 56', 2) + sparkle(46, 26, 3.5) + sparkle(76, 22, 3, '#fff'),

  // ── Payaso ──
  'Payaso triste': () =>
    [[36, 44, 7], [31, 52, 6], [36, 60, 6], [84, 44, 7], [89, 52, 6], [84, 60, 6]].map(([x, y, r]) => `<circle ${ol(2.4)} cx="${x}" cy="${y}" r="${r}" fill="#FF922B"/>`).join('') +
    `<path ${ol(3)} d="M38 100 C40 84 48 78 60 78 C72 78 80 84 82 100Z" fill="#4DABF7"/><path d="M48 80 L60 92 L72 80" stroke="#FCC419" stroke-width="3" fill="none"/>` +
    `<circle ${ol(3)} cx="60" cy="54" r="22" fill="#FFF8F0"/>` +
    `<path ${ol(2.2)} d="M50 30 L60 16 L70 30Z" fill="#9775FA"/><circle ${ol(1.8)} cx="60" cy="16" r="3" fill="#FCC419"/><path d="M53 26 H67" stroke="#FCC419" stroke-width="2"/>` +
    `<path d="M48 44 L51 38 L54 44 L51 50Z" fill="#74C0FC"/><path d="M66 44 L69 38 L72 44 L69 50Z" fill="#74C0FC"/>` +
    `<path d="M47 47 Q51 44 55 47" stroke="${D}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M65 47 Q69 44 73 47" stroke="${D}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M46 40 L54 42 M74 40 L66 42" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path ${ol(1.6)} d="M51 52 C49 56 49 58 51 59 C53 58 53 56 51 52Z" fill="#4DABF7"/>` +
    `<path ${ol(2.2)} d="M48 70 C50 62 70 62 72 70 C66 66 54 66 48 70Z" fill="#E03131"/>` +
    `<circle ${ol(2.4)} cx="60" cy="58" r="5.4" fill="#E03131"/><circle cx="58.4" cy="56.4" r="1.6" fill="#fff"/>` +
    jtile(85, 80, 12, 1.2) + `<circle ${ol(2)} cx="80" cy="88" r="4" fill="#fff"/>`,
  'Bufón de corte': () => {
    const bell = (x: number, y: number) => `<circle ${ol(1.8)} cx="${x}" cy="${y}" r="3.4" fill="#FCC419"/><path d="M${x - 1.4} ${y + 1} H${x + 1.4}" stroke="${D}" stroke-width="1"/>`;
    return `<path ${ol(3)} d="M36 100 C38 84 46 78 60 78 C74 78 82 84 84 100Z" fill="#2F9E44"/><path d="M60 78 V100" stroke="${D}" stroke-width="2"/><path d="M60 78 H84 V100 H60Z" fill="#E03131" opacity=".9"/><path ${ol(3)} d="M36 100 C38 84 46 78 60 78 C74 78 82 84 84 100" fill="none"/>` +
      `<path ${ol(2.4)} d="M40 78 L46 70 L52 78 L58 70 L64 78 L70 70 L76 78 L80 72 L82 80 C70 84 50 84 38 80 L40 72Z" fill="#FFF3BF"/>` +
      `<path ${ol(3)} d="M42 48 C38 40 34 38 29 40 C33 44 36 48 40 52Z" fill="#E03131"/><path ${ol(3)} d="M78 48 C82 40 86 38 91 40 C87 44 84 48 80 52Z" fill="#2F9E44"/>` +
      `<path ${ol(3)} d="M44 46 C44 34 50 22 60 18 C70 22 76 34 76 46Z" fill="#FCC419"/><path d="M60 18 V46" stroke="${D}" stroke-width="1.6"/><path d="M60 19 C68 24 74 34 76 46 H60Z" fill="#7048E8"/><path ${ol(3)} d="M44 46 C44 34 50 22 60 18 C70 22 76 34 76 46Z" fill="none"/>` +
      bell(29, 41) + bell(91, 41) + bell(60, 16) +
      `<circle ${ol(3)} cx="60" cy="60" r="15" fill="#F4BE8F"/><path ${ol(2.6)} d="M43 48 H77 V52 H43Z" fill="#7048E8"/>` +
      `<path d="M51 58 H57 M63 58 H69" stroke="${D}" stroke-width="2" stroke-linecap="round"/><circle cx="54" cy="60" r="1.5" fill="${D}"/><circle cx="66" cy="60" r="1.5" fill="${D}"/>` +
      `<path d="M54 68 Q57 66 60 68 Q63 70 66 68" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
      `<path ${ol(1.4)} d="M71 51 C73 54 73 56 71 57 C69 56 69 54 71 51Z" fill="#74C0FC"/>` +
      jtile(32, 82, -16, 1.05) + `<circle ${ol(2)} cx="36" cy="90" r="3.6" fill="#F4BE8F"/>`;
  },
  'Circo Rodas': () => {
    const tent = 'M24 92 C28 72 32 56 60 30 C88 56 92 72 96 92Z';
    return `<g transform="translate(0 4)">` +
      `<path d="M20 40 Q30 46 40 42 M80 42 Q90 46 100 40" stroke="${D}" stroke-width="1.4" fill="none"/>` +
      [[26, 41, '#FCC419'], [34, 43.5, '#4DABF7'], [86, 43.5, '#40C057'], [94, 41, '#FCC419']].map(([x, y, c]) => `<path ${ol(1.4)} d="M${Number(x) - 3} ${y} H${Number(x) + 3} L${x} ${Number(y) + 6}Z" fill="${c}"/>`).join('') +
      `<path d="${tent}" fill="#fff"/>` +
      [0, 1, 2, 3].map((i) => { const a = 24 + i * 18; return `<path d="M60 30 L${a} 92 H${a + 9}Z" fill="#E03131"/>`; }).join('') + `<path d="M60 30 L87 92 H96 C93 80 90 68 80 52Z" fill="#E03131"/>` +
      `<path ${ol(3)} d="${tent}" fill="none"/>` +
      `<path ${ol(2.6)} d="M49 92 V78 C49 66 71 66 71 78 V92Z" fill="#5F3DC4"/><path d="M60 68 V92" stroke="${D}" stroke-width="1.6"/>` +
      `<path ${ol(2.6)} d="M49 78 C52 74 56 72 60 72 L56 92 H49Z M71 78 C68 74 64 72 60 72 L64 92 H71Z" fill="#FCC419"/>` +
      `<path ${ol(2.4)} d="M20 96 H100" fill="none"/>` +
      `<path d="M60 30 V18" stroke="${D}" stroke-width="2"/><path ${ol(2)} d="M60 18 L76 21 L60 26Z" fill="#E03131"/>` +
      `<circle cx="66" cy="21.6" r="2.4" fill="#FFF3BF"/><circle cx="65.3" cy="21.2" r=".5" fill="${D}"/><circle cx="66.8" cy="21.2" r=".5" fill="${D}"/>` +
      `<circle ${ol(1.8)} cx="60" cy="30" r="2.6" fill="#FCC419"/>` +
      star(36, 34, 4, '#FFD43B', 1.6) + star(84, 32, 3.5, '#FFD43B', 1.4) + sparkle(30, 80, 3, '#fff') + `</g>`;
  },
  // ══ T.E.G. ══
  // ── Agenda oculta ──
  'Sobre lacrado': () =>
    `<g transform="rotate(-8 60 64)"><rect ${ol(3)} x="26" y="44" width="68" height="44" rx="4" fill="#FFF3D6"/>` +
    `<path ${ol(2.4)} d="M26 86 L52 64 M94 86 L68 64" fill="none"/><path ${ol(2.6)} d="M27 46 L60 70 L93 46" fill="#FBE7C0"/>` +
    `<path d="M32 50 L46 60" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>` +
    `<path ${ol(2.4)} d="M60 60 C64 58 69 60 70 64 C73 67 71 72 68 73 C66 77 60 78 57 75 C52 75 49 71 51 67 C49 63 54 59 60 60Z" fill="#C92A2A"/>` +
    `<circle cx="60" cy="68" r="5.6" fill="none" stroke="#FF8787" stroke-width="1.4"/><polygon points="${starPts(60, 68, 3.6, 1.6)}" fill="#FF8787"/>` +
    `<path ${ol(1.8)} d="M58 76 L56 84 L60 81 L63 84 L62 76" fill="#C92A2A"/></g>` +
    `<g transform="rotate(-16 44 52)"><rect x="27" y="46" width="34" height="11" rx="2" fill="#fff" fill-opacity=".75" stroke="#E03131" stroke-width="2"/>` + t(44, 54.6, 8, 'SECRETO', '#E03131', 'textLength="29" lengthAdjust="spacingAndGlyphs"') + `</g>` +
    army(84, 86, '#4DABF7', 1.5, true) + `<path d="M93 76 L96 73 M94 82 L98 81" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` + sparkle(80, 36, 4) + sparkle(30, 72, 3, '#fff'),
  'Caballo de Troya': () =>
    `<rect ${ol(3)} x="28" y="80" width="64" height="7" rx="3" fill="#8B5A3C"/>` +
    [38, 52, 68, 82].map((x) => `<circle ${ol(2.6)} cx="${x}" cy="88" r="5" fill="#E9C46A"/><circle cx="${x}" cy="88" r="1.6" fill="${D}"/>`).join('') +
    [[42, 68], [50, 68], [72, 68], [80, 68]].map(([x, y]) => `<rect ${ol(2.4)} x="${x - 3}" y="${y}" width="6" height="13" fill="#C97B45"/>`).join('') +
    `<path ${ol(3)} d="M86 54 C94 56 96 64 92 72 C90 66 88 62 84 60Z" fill="#8B5A3C"/>` +
    `<rect ${ol(3)} x="36" y="50" width="52" height="22" rx="10" fill="#C97B45"/><path d="M42 58 H82 M42 64 H82" stroke="#A35E2F" stroke-width="1.4"/>` +
    `<path ${ol(3)} d="M38 58 C36 52 34 48 34 44 L44 41 C46 47 48 52 52 56Z" fill="#C97B45"/>` +
    `<path ${ol(3)} d="M24 52 C22 46 26 40 32 38 L44 36 C48 36 48 44 44 46 C38 48 32 52 28 54 C26 55 24 54 24 52Z" fill="#C97B45"/>` +
    `<path ${ol(2)} d="M38 37 L40 30 L44 36Z" fill="#C97B45"/><path d="M44 37 C49 42 50 48 54 52" fill="none" stroke="${D}" stroke-width="6" stroke-linecap="round"/><path d="M44 37 C49 42 50 48 54 52" fill="none" stroke="#8B5A3C" stroke-width="3" stroke-linecap="round"/>` +
    eye(37, 42, 1.8) + `<circle cx="27" cy="50" r="1" fill="${D}"/><path d="M34 54 C40 50 46 50 50 52" stroke="#fff" stroke-width="2" fill="none" opacity=".4" stroke-linecap="round"/>` +
    `<rect ${ol(2.4)} x="58" y="44" width="20" height="12" rx="2" fill="${D}"/><path ${ol(2.4)} d="M58 44 L54 34 H74 L78 44Z" fill="#A35E2F"/>` +
    `<circle ${ol(1.8)} cx="63" cy="47" r="4" fill="#F4BE8F"/><path ${ol(1.8)} d="M58.6 46 C58.6 40 67.4 40 67.4 46Z" fill="#868E96"/><circle cx="61.6" cy="47.6" r=".9" fill="${D}"/><circle cx="64.4" cy="47.6" r=".9" fill="${D}"/>` +
    `<circle ${ol(1.8)} cx="73" cy="48" r="4" fill="#F4BE8F"/><path ${ol(1.8)} d="M68.6 47 C68.6 41 77.4 41 77.4 47Z" fill="#868E96"/><circle cx="71.6" cy="48.6" r=".9" fill="${D}"/><circle cx="74.4" cy="48.6" r=".9" fill="${D}"/>` +
    `<path d="M70 38 L72 32" stroke="${D}" stroke-width="1.6"/>` + sparkle(88, 40, 3.5) + sparkle(28, 62, 3, '#fff'),
  'Maquiavelo': () =>
    `<path ${ol(3)} d="M30 80 C30 60 42 52 60 52 C78 52 90 60 90 80Z" fill="#343A40"/><path ${ol(2)} d="M50 54 L60 62 L70 54 C68 51 52 51 50 54Z" fill="#fff"/>` +
    `<circle ${ol(3)} cx="60" cy="40" r="14" fill="#F4BE8F"/>` +
    `<path ${ol(2.4)} d="M45 40 C44 28 52 23 60 23 C68 23 76 28 75 40 C72 34 66 32 60 33 C54 32 48 34 45 40Z" fill="#212529"/>` +
    `<path ${ol(2.4)} d="M46 31 C46 22 74 22 74 31 C66 28 54 28 46 31Z" fill="#C92A2A"/>` +
    `<path d="M51 41 Q54 39 57 41 M63 41 Q66 39 69 41" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M51 39 L57 37.5 M69 39 L63 37.5" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<circle cx="54" cy="42" r="1.2" fill="${D}"/><circle cx="66" cy="42" r="1.2" fill="${D}"/>` +
    `<path d="M54 47 Q60 50 66 45.5" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(3)} d="M20 98 L28 74 H92 L100 98Z" fill="#74C0FC"/>` +
    `<path ${ol(2)} d="M34 82 C38 78 46 78 48 82 C50 86 46 90 40 90 C34 90 32 86 34 82Z M58 78 C64 76 72 78 74 82 C70 84 70 88 64 90 C58 88 56 82 58 78Z M80 84 C84 82 90 84 90 88 C86 92 82 90 80 84Z" fill="#69DB7C"/>` +
    army(40, 84, '#E03131', .6) + army(66, 83, '#FCC419', .6) + army(85, 87, '#1C7ED6', .6) +
    `<path ${ol(2.6)} d="M48 72 C52 66 60 66 62 70 C64 74 60 78 54 78 C50 78 46 76 48 72Z" fill="#F4BE8F"/><path ${ol(2.6)} d="M72 72 C68 66 60 66 58 70 C56 74 60 78 66 78 C70 78 74 76 72 72Z" fill="#F4BE8F"/>` +
    `<path d="M52 70 C54 68 56 68 57 70 M53 74 C55 72 57 72 58 74 M68 70 C66 68 64 68 63 70 M67 74 C65 72 63 72 62 74" stroke="${D}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<path d="M40 64 L36 60 M80 64 L84 60 M42 70 L37 69 M78 70 L83 69" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/>` + sparkle(86, 40, 3.5) + sparkle(32, 42, 3, '#fff'),

  // ── Imperio ──
  'Mapa pintado': () =>
    `<rect ${ol(3)} x="22" y="40" width="76" height="48" rx="4" fill="#74C0FC"/><path d="M26 46 H60" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>` +
    `<path ${ol(2.2)} fill="#E03131" d="M28 50 C32 46 42 46 46 50 C48 54 44 56 44 60 C42 64 38 62 36 58 C32 58 28 56 28 50Z M38 66 C42 64 46 66 46 72 C46 78 42 84 40 82 C38 78 36 72 38 66Z M54 48 C58 46 62 48 62 52 C60 54 56 54 54 52Z M56 58 C60 56 66 58 66 64 C66 70 62 76 60 76 C56 70 54 64 56 58Z M66 48 C72 44 86 46 90 52 C90 56 84 58 80 60 C76 60 72 58 70 56 C66 56 64 52 66 48Z M80 70 C84 68 90 70 90 74 C88 78 82 78 80 74Z"/>` +
    `<path d="M40 50 L42 54 M70 50 L76 54 M60 62 L62 66" stroke="#fff" stroke-width="1.2" opacity=".55" stroke-linecap="round"/>` +
    flag(84, 66, '#FCC419', .9) +
    `<g transform="translate(2 9) rotate(-30 58 40)">` + stick('M66 40 V58', '#ADB5BD', 2.4) + stick('M66 58 V72', '#FCC419', 4) +
    `<rect ${ol(3)} x="44" y="30" width="36" height="12" rx="6" fill="#E03131"/><path d="M48 33.5 H70" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>` +
    `<path d="M50 42 C50 46 52 46 52 50 M60 42 V45" stroke="#E03131" stroke-width="3" stroke-linecap="round"/></g>` +
    sparkle(30, 34, 3.5) + sparkle(92, 92, 3),
  'Napoleón': () =>
    `<path ${ol(3)} d="M20 104 C20 84 38 72 60 72 C82 72 100 84 100 104Z" fill="#4DABF7"/><path ${ol(2.4)} d="M20 104 C20 84 38 72 60 72 C82 72 100 84 100 104" fill="none"/>` +
    `<path ${ol(2)} d="M30 88 C34 82 40 82 44 86 C42 92 34 92 30 88Z M72 80 C78 78 86 82 86 88 C80 90 74 86 72 80Z" fill="#69DB7C"/>` +
    `<path d="M30 80 C36 76 42 74 48 74" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".5"/>` +
    `<path ${ol(2.4)} d="M52 76 L50 88 H56 V78 M68 76 L70 88 H64 V78" fill="#fff"/><path ${ol(2)} d="M48 86 H57 V90 H48Z M63 86 H72 V90 H63Z" fill="${D}"/>` +
    `<path ${ol(3)} d="M46 76 L48 52 C48 46 72 46 72 52 L74 76Z" fill="#1864AB"/><path ${ol(2)} d="M54 50 L60 76 L66 50Z" fill="#fff"/>` +
    `<path ${ol(2)} d="M55 60 C58 58 62 58 64 60 L62 64 C60 63 58 63 56 64Z" fill="#F4BE8F"/>` +
    `<path d="M57 52 V54 M57 57 V59 M63 52 V54" stroke="#FCC419" stroke-width="2" stroke-linecap="round"/>` +
    `<path ${ol(2.4)} d="M44 54 C42 50 46 48 50 49 L50 54Z M76 54 C78 50 74 48 70 49 L70 54Z" fill="#FCC419"/><path d="M44 54 V57 M46 54 V58 M76 54 V57 M74 54 V58" stroke="#FCC419" stroke-width="1.4"/>` +
    stick('M48 56 C44 62 44 68 47 74', '#1864AB', 4) + `<circle ${ol(2)} cx="47.5" cy="75" r="3" fill="#F4BE8F"/>` +
    `<circle ${ol(3)} cx="60" cy="40" r="10" fill="#F4BE8F"/><path d="M52 38 C54 34 58 36 60 34 C61 37 64 36 66 38" stroke="${D}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<circle cx="56.4" cy="41" r="1.4" fill="${D}"/><circle cx="63.6" cy="41" r="1.4" fill="${D}"/><path d="M54 38.6 L58 39.6 M66 38.6 L62 39.6" stroke="${D}" stroke-width="1.4" stroke-linecap="round"/><path d="M57 45.5 H63" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path ${ol(3)} d="M38 34 C42 22 78 22 82 34 C74 31 66 30 60 31 C54 30 46 31 38 34Z" fill="#212529"/>` +
    `<circle ${ol(1.8)} cx="60" cy="28" r="2.8" fill="#fff"/><circle cx="60" cy="28" r="1.4" fill="#E03131"/><path d="M44 30 C48 27 52 26 56 26" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".4"/>` +
    sparkle(30, 56, 3.5) + sparkle(90, 54, 4),
  'Gengis Kan': () =>
    `<path ${ol(3)} d="M18 84 C38 78 82 78 102 84 V104 H18Z" fill="#74C0FC"/><path ${ol(2)} d="M26 88 C30 84 40 84 42 88 C40 92 30 92 26 88Z M70 86 C76 82 90 84 94 88 C88 92 74 92 70 86Z" fill="#69DB7C"/>` +
    `<path d="M88 88 C70 98 46 98 32 90" stroke="#E03131" stroke-width="2" fill="none" stroke-dasharray="3 3"/><path ${ol(1.6)} d="M30 92 L28 86 L35 88Z" fill="#E03131"/>` +
    puff(90, 74, .9, '#F1E3CF') + puff(98, 64, .7, '#F1E3CF') +
    `<path ${ol(2.6)} d="M78 58 C86 56 92 60 96 54 C94 62 88 64 82 64Z" fill="#495057"/>` +
    stick('M72 68 L80 78', '#8B5A3C', 3.6) + stick('M66 68 L60 80', '#8B5A3C', 3.6) + stick('M46 66 L36 74', '#8B5A3C', 3.6) + stick('M42 64 L34 66', '#8B5A3C', 3.6) +
    `<ellipse ${ol(3)} cx="60" cy="62" rx="18" ry="9" fill="#B4703F"/>` +
    `<path ${ol(3)} d="M44 60 C40 52 36 46 32 44 L28 48 C24 50 26 56 30 56 L36 56 C40 60 42 64 46 66Z" fill="#B4703F"/>` +
    `<path ${ol(2.2)} d="M44 58 C42 52 40 48 36 44 L40 42 C42 46 46 52 48 58Z" fill="#495057"/><circle cx="31" cy="49" r="1.2" fill="${D}"/><path d="M30 44 L29 40 L33 43" stroke="${D}" stroke-width="1.8" fill="#B4703F" stroke-linejoin="round"/>` +
    `<path ${ol(2.4)} d="M52 54 C52 48 70 48 70 54 L68 62 H54Z" fill="#E03131"/>` +
    `<path ${ol(2.6)} d="M56 54 L54 40 C54 36 66 36 66 40 L66 54Z" fill="#1971C2"/><path d="M60 38 V54" stroke="#FCC419" stroke-width="2"/>` +
    stick('M56 44 L46 40', '#1971C2', 3.4) + `<circle ${ol(2)} cx="45" cy="40" r="2.6" fill="#E8B98A"/>` + `<path d="M45 40 V22" stroke="${D}" stroke-width="2"/><path ${ol(1.8)} d="M45 22 L36 25 L45 28Z" fill="#FCC419"/>` +
    `<circle ${ol(2.6)} cx="60" cy="31" r="8" fill="#E8B98A"/><path d="M53 33 C55 37 57 36 58 35 M67 33 C65 37 63 36 62 35" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path d="M56 30 L58.5 31 M64 30 L61.5 31" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path ${ol(2.4)} d="M50 28 C50 18 70 18 70 28 C66 26 54 26 50 28Z" fill="#868E96"/><path ${ol(2.2)} d="M49 29 C49 25 71 25 71 29 C66 31 54 31 49 29Z" fill="#8B5A3C"/><path d="M60 19 V14" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`,

  // ── Topadora ──
  'Soldado raso': () =>
    `<ellipse ${ol(3)} cx="60" cy="92" rx="22" ry="5" fill="#5C940D"/>` +
    stick('M54 78 L52 90', '#82C91E', 4.4) + stick('M66 78 L68 90', '#82C91E', 4.4) +
    `<path ${ol(3)} d="M48 80 L50 60 C50 54 70 54 70 60 L72 80Z" fill="#82C91E"/><path d="M50 70 H70" stroke="#5C940D" stroke-width="2.6"/><rect x="58" y="68" width="4" height="4" fill="#FCC419"/>` +
    stick('M50 62 C44 66 44 74 48 76', '#82C91E', 4) + stick('M70 62 C78 58 78 50 72 46', '#82C91E', 4) +
    `<circle ${ol(3)} cx="60" cy="48" r="10" fill="#82C91E"/>` +
    `<path d="M57 52 Q60 55 63 52" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + blush(53, 50, 2) + blush(67, 50, 2) +
    `<path ${ol(3)} d="M38 46 C38 26 82 26 82 46 C78 44 72 43 60 43 C48 43 42 44 38 46Z" fill="#5C940D"/>` +
    `<path d="M46 34 C50 30 56 29 60 29" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".45"/><path d="M42 40 H78" stroke="#4A7A0A" stroke-width="1.4" stroke-dasharray="2 3"/>` +
    `<path d="M45 45.5 H52 M68 45.5 H75" stroke="${D}" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>` +
    `<path ${ol(2.4)} d="M68 44 L76 42 L74 48Z" fill="#82C91E"/>` +
    sparkle(32, 60, 3.5) + sparkle(88, 64, 3) + star(86, 44, 4, '#FFD43B', 1.6),
  'Tanque Sherman': () =>
    [[48, 93, '#4DABF7', -84], [70, 94, '#E03131', 82]].map(([x, y, c, r]) => `<g transform="rotate(${r} ${x} ${y})">${flag(Number(x), Number(y), String(c), .8, 12)}</g>`).join('') +
    puff(24, 74, .9, '#E9ECEF') + puff(28, 62, .6, '#E9ECEF') +
    `<rect ${ol(3)} x="32" y="74" width="60" height="16" rx="8" fill="#495057"/>` +
    [40, 50, 60, 70, 80].map((x) => `<circle ${ol(2)} cx="${x + 2}" cy="82" r="4.4" fill="#ADB5BD"/><circle cx="${x + 2}" cy="82" r="1.4" fill="${D}"/>`).join('') +
    `<path d="M36 76 H88" stroke="#868E96" stroke-width="1.4" stroke-dasharray="2 2"/>` +
    `<path ${ol(3)} d="M30 74 L34 62 H90 L94 74Z" fill="#6B8E23"/><path d="M38 66 H70" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35"/>` +
    `<rect ${ol(3)} x="74" y="49" width="24" height="6" rx="2" fill="#556B2F"/>` +
    `<path ${ol(3)} d="M42 62 C42 48 50 44 60 44 C70 44 78 48 78 62Z" fill="#6B8E23"/><path ${ol(2.4)} d="M52 44 V38 H62 V44" fill="#556B2F"/>` +
    `<path d="M48 54 C48 50 52 48 55 48" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>` +
    `<circle cx="58" cy="54" r="1.8" fill="${D}"/><circle cx="68" cy="54" r="1.8" fill="${D}"/><path d="M55 50 L60 51.5 M71 50 L66 51.5" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M60 58.5 Q63 60.5 66 58.5" stroke="${D}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    star(48, 68, 3.2, '#fff', 1.2) + line('M24 84 L28 84 M22 90 L28 90', 2),
  'Atila': () =>
    `<path ${ol(3)} d="M16 82 C40 78 80 78 104 82 V104 H16Z" fill="#A47148"/><path d="M28 88 L34 92 L32 98 M80 88 L74 94 L78 98 M56 90 L60 96" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    [[26, 84], [44, 86], [90, 85], [70, 87]].map(([x, y]) => `<path d="M${x} ${y} L${x - 2} ${y - 5} M${x} ${y} L${x + 1} ${y - 6} M${x} ${y} L${x + 3} ${y - 3}" stroke="#C9A227" stroke-width="1.6" stroke-linecap="round"/>`).join('') +
    puff(28, 74, 1, '#E9D8B4') + puff(92, 72, 1.1, '#E9D8B4') +
    `<path ${ol(3)} d="M30 84 C30 66 42 60 60 60 C78 60 90 66 90 84Z" fill="#8B5A3C"/><path d="M34 70 L38 74 M42 64 L44 69 M78 64 L76 69 M86 70 L82 74 M60 62 V67" stroke="#5C3A21" stroke-width="2" stroke-linecap="round"/>` +
    `<circle ${ol(3)} cx="60" cy="46" r="14" fill="#F4BE8F"/>` +
    `<path ${ol(2.6)} d="M46 48 C46 62 52 72 60 74 C68 72 74 62 74 48 C70 54 66 56 60 56 C54 56 50 54 46 48Z" fill="#E8590C"/><path d="M54 62 L56 68 M60 60 V70 M66 62 L64 68" stroke="#C2410C" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path ${ol(2)} d="M53 56 Q60 52 67 56 Q60 60 53 56Z" fill="#fff"/>` +
    `<path d="M51 42 L57 45 M69 42 L63 45" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` + eye(54, 47, 1.8) + eye(66, 47, 1.8) +
    `<path ${ol(3)} d="M44 42 C44 30 52 26 60 26 C68 26 76 30 76 42Z" fill="#ADB5BD"/><path ${ol(2.4)} d="M43 40 H77 V44 H43Z" fill="#868E96"/>` +
    `<path ${ol(2.6)} d="M45 36 C38 34 34 28 34 20 C38 26 42 28 47 30Z M75 36 C82 34 86 28 86 20 C82 26 78 28 73 30Z" fill="#FFF3D6"/>` +
    `<path ${ol(2)} d="M52 28 L54 21 L57 26 L60 19 L63 26 L66 21 L68 28Z" fill="#FCC419"/><path d="M50 34 C52 31 55 30 58 30" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>`,

  // ── Kamchatka ──
  'Oso siberiano': () =>
    `<path ${ol(3)} d="M18 88 C30 76 46 74 58 80 C66 72 84 72 102 82 V104 H18Z" fill="#fff"/><path d="M24 86 C34 80 44 80 52 82" stroke="#A5D8FF" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    
    `<path ${ol(3)} d="M34 84 C34 70 44 64 60 64 C76 64 86 70 86 84Z" fill="#8B5A3C"/>` +
    `<circle ${ol(3)} cx="60" cy="52" r="17" fill="#A0673C"/>` +
    `<ellipse ${ol(2.4)} cx="60" cy="58" rx="8" ry="6" fill="#E9C9A3"/><ellipse cx="60" cy="54.5" rx="3" ry="2" fill="${D}"/><path d="M57 60 Q60 62 63 60" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path d="M47 44 L55 47 M73 44 L65 47" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` + eye(52, 49, 2) + eye(68, 49, 2) +
    `<circle ${ol(3)} cx="60" cy="36" r="14" fill="#A0673C" opacity="0"/>` +
    `<path ${ol(3)} d="M40 42 C40 26 80 26 80 42Z" fill="#7B4A2A"/><rect ${ol(3)} x="38" y="38" width="44" height="8" rx="4" fill="#C5A27A"/>` +
    `<path ${ol(2.6)} d="M40 44 C34 46 32 56 36 62 C40 58 42 52 42 46Z M80 44 C86 46 88 56 84 62 C80 58 78 52 78 46Z" fill="#C5A27A"/>` +
    `<circle ${ol(2)} cx="60" cy="42" r="3" fill="#FCC419"/><path d="M48 32 C51 29 55 28 58 28" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".4"/>` +
    `<path ${ol(2.6)} d="M40 80 C36 74 40 70 46 72 L50 78Z M80 80 C84 74 80 70 74 72 L70 78Z" fill="#A0673C"/>` +
    `<rect ${ol(2.2)} x="44" y="84" width="32" height="10" rx="2" fill="#FFF3BF"/>` + t(60, 91.8, 7, 'KAMCHATKA', '#C92A2A', 'textLength="27" lengthAdjust="spacingAndGlyphs"') +
    [[30, 40], [92, 50], [26, 62], [88, 34]].map(([x, y]) => `<path d="M${x - 3} ${y} H${x + 3} M${x} ${y - 3} V${y + 3} M${x - 2} ${y - 2} L${x + 2} ${y + 2} M${x + 2} ${y - 2} L${x - 2} ${y + 2}" stroke="#74C0FC" stroke-width="1.4" stroke-linecap="round"/>`).join(''),
  'Muralla helada': () =>
    `<rect x="10" y="10" width="100" height="100" fill="#E7F5FF"/>` +
    army(36, 54, '#E03131', 1.2, true) + army(52, 50, '#E03131', 1.2, true) + army(84, 54, '#E03131', 1.2, true) +
    flag(68, 52, '#E03131', 1.5, 22) +
    [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => { const x = 20 + c * 17 + (r % 2 ? 8.5 : 0), y = 58 + r * 10; return `<rect ${ol(2.4)} x="${x}" y="${y}" width="17" height="10" rx="2.4" fill="${(r + c) % 3 ? '#A5D8FF' : '#D0EBFF'}"/><path d="M${x + 3} ${y + 3} H${x + 8}" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`; }).join('')).join('') +
    `<path ${ol(2.4)} d="M18 58 C30 54 50 56 60 54 C72 56 90 54 102 58 L100 62 C96 60 94 64 92 62 C88 66 86 60 82 62 C78 60 74 66 70 62 C64 64 58 60 54 64 C50 60 44 62 40 60 C36 64 30 60 26 62 C24 60 20 62 18 60Z" fill="#fff"/>` +
    `<path d="M46 66 L50 70 M74 78 L78 82" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` +
    [[30, 34], [88, 36], [44, 26], [78, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#74C0FC"/>`).join('') + sparkle(28, 46, 3.5, '#fff') + sparkle(94, 46, 3, '#fff'),
  'Hijo de Kamchatka': () =>
    [[28, 40], [92, 44], [24, 66], [96, 70], [36, 26], [84, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#A5D8FF"/>`).join('') +
    `<path ${ol(3)} d="M30 104 C30 84 42 76 60 76 C78 76 90 84 90 104Z" fill="#C92A2A"/><path ${ol(2.4)} d="M50 76 C50 82 70 82 70 76" fill="#C5A27A"/>` +
    `<circle ${ol(3)} cx="60" cy="62" r="12" fill="#F4BE8F"/>` +
    `<path d="M54 61 Q56 59 58 61 M62 61 Q64 59 66 61" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` + blush(52, 66, 2.2) + blush(68, 66, 2.2) +
    `<path ${ol(1.8)} d="M56 67 Q60 71 64 67Z" fill="#fff"/>` +
    `<path ${ol(3)} d="M34 56 C26 44 32 22 60 20 C88 22 94 44 86 56 C80 52 70 50 60 50 C50 50 40 52 34 56Z" fill="#7B4A2A"/>` +
    `<path d="M38 46 C36 38 40 30 46 26 M48 44 C46 36 50 28 56 24 M72 44 C74 36 70 28 64 24 M82 46 C84 38 80 30 74 26" stroke="#5C3A21" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(3)} d="M32 50 C40 46 80 46 88 50 L87 58 C80 54 40 54 33 58Z" fill="#C5A27A"/>` +
    `<path ${ol(2.6)} d="M34 56 C28 60 28 72 32 78 C38 74 40 66 40 58Z M86 56 C92 60 92 72 88 78 C82 74 80 66 80 58Z" fill="#C5A27A"/>` +
    `<path d="M42 30 C46 26 50 24 54 23" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".35"/>` +
    `<g transform="rotate(-10 78 86)"><rect ${ol(2.6)} x="66" y="74" width="24" height="30" rx="2.5" fill="#862E9C"/>` +
    `<circle cx="78" cy="84" r="5" fill="none" stroke="#FCC419" stroke-width="1.6"/><path d="M75.5 84 C76 81 80 81 80.5 84 C80 86 76 86 75.5 84Z" fill="#FCC419"/>` +
    t(78, 95, 4.4, 'KAMCHATKA', '#FCC419', 'textLength="19" lengthAdjust="spacingAndGlyphs"') + `</g>` +
    `<circle ${ol(2.2)} cx="68" cy="90" r="4" fill="#F4BE8F"/>` + star(30, 88, 4, '#FFD43B', 1.6),

  // ══ AZUL ══
  // ── Mosaiquista ──
  'Ayudante de obra': () =>
    `<path ${ol(3)} d="M28 104 C28 84 42 76 58 76 C74 76 88 84 88 104Z" fill="#FF922B"/><path d="M40 82 V104 M76 82 V104" stroke="#FFD43B" stroke-width="3"/>` +
    `<circle cx="48" cy="92" r="1.6" fill="#ADB5BD"/><circle cx="66" cy="86" r="1.2" fill="#ADB5BD"/>` +
    `<circle ${ol(3)} cx="58" cy="58" r="15" fill="#F4BE8F"/>` +
    `<circle cx="52" cy="66" r="2" fill="#ADB5BD" opacity=".7"/><circle cx="66" cy="54" r="1.6" fill="#ADB5BD" opacity=".7"/><circle cx="48" cy="56" r="1.2" fill="#ADB5BD" opacity=".7"/>` +
    eye(52.5, 58, 1.9) + eye(63.5, 58, 1.9) + blush(49, 63, 2.4) + blush(67, 63, 2.4) + `<path ${ol(1.8)} d="M54 65 Q58 70 62 65Z" fill="#fff"/>` +
    `<path ${ol(3)} d="M40 50 C40 36 76 36 76 50Z" fill="#FCC419"/><rect ${ol(3)} x="36" y="48" width="44" height="6" rx="3" fill="#FAB005"/><path d="M58 38 V48" stroke="${D}" stroke-width="2"/>` +
    `<path d="M46 44 C47 41 50 39 53 39" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>` +
    `<path ${ol(3)} d="M76 76 L78 96 H96 L98 76Z" fill="#ADB5BD"/><ellipse ${ol(2.6)} cx="87" cy="76" rx="11" ry="3.4" fill="#DEE2E6"/><path ${ol(2)} d="M76 76 C76 66 98 66 98 76" fill="none"/>` +
    `<path d="M80 80 V92" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>` +
    `<path ${ol(2.4)} d="M26 76 L40 66 L44 72 L30 82Z" fill="#CED4DA"/>` + stick('M42 69 L48 64', '#8B5A3C', 3) + `<circle ${ol(2)} cx="49" cy="66" r="4" fill="#F4BE8F"/>` +
    az(30, 92, 1, 0, -12) + puff(88, 64, .5, '#DEE2E6') + puff(34, 40, .6, '#DEE2E6'),
  'Azulejero fino': () => {
    let wall = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) if (!(r === 1 && c === 2)) wall += az(32 + c * 14, 58 + r * 14, 1.05, (r * 2 + c) % 5);
    return `<rect ${ol(3)} x="22" y="48" width="76" height="52" rx="3" fill="#E9ECEF"/>` + wall +
      
      `<rect ${ol(3)} x="30" y="38" width="60" height="9" rx="2" fill="#FCC419"/><rect ${ol(2)} x="54" y="39.5" width="12" height="6" rx="3" fill="#C0EB75"/><circle cx="60" cy="42.5" r="1.8" fill="#fff"/><path d="M56.5 39.5 V45.5 M63.5 39.5 V45.5" stroke="${D}" stroke-width="1"/>` +
      `<path d="M35 41 H48" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>` +
      `<g transform="translate(60 71)"><rect x="-8.5" y="-8.5" width="17" height="17" rx="3" fill="#FFE066" opacity=".6"/></g>` + az(60, 71, 1.05, 0) +
      sparkle(36, 30, 4) + sparkle(84, 30, 3.5) + sparkle(70, 64, 3, '#fff') + line('M52 63 L50 60 M68 63 L70 60', 1.8);
  },
  'Palacio de la Alhambra': u => {
    const arch = 'M36 100 V62 C30 54 34 38 46 32 C52 28 56 26 60 22 C64 26 68 28 74 32 C86 38 90 54 84 62 V100Z';
    let band = '';
    for (let i = 0; i < 14; i++) {
      const a = (180 + i * 180 / 13) * Math.PI / 180, x = f(60 + 27 * Math.cos(a)), y = f(56 + 27 * Math.sin(a));
      band += `<polygon points="${starPts(x, y, 3.2, 1.4, 8)}" fill="${i % 2 ? '#FCC419' : '#fff'}"/>`;
    }
    return `<rect x="10" y="10" width="100" height="100" fill="#F3D9B1"/><path d="M10 90 H110" stroke="#E0B97A" stroke-width="2"/>` +
      `<defs><clipPath id="al${u}"><path d="${arch}"/></clipPath></defs>` +
      `<path ${ol(3)} d="${arch}" fill="#1864AB"/>` +
      `<g clip-path="url(#al${u})">${band}<path d="M44 100 V66 C40 58 44 46 52 42 C56 40 58 38 60 36 C62 38 64 40 68 42 C76 46 80 58 76 66 V100Z" fill="#FFF3BF"/>` +
      `<path d="M44 100 V66 C40 58 44 46 52 42 C56 40 58 38 60 36 C62 38 64 40 68 42 C76 46 80 58 76 66 V100Z" fill="none" stroke="${D}" stroke-width="2.4"/>` +
      `<circle cx="60" cy="70" r="18" fill="#FFE066" opacity=".6"/><path d="M50 100 V86 C50 80 70 80 70 86 V100Z" fill="#74C0FC"/></g>` +
      `<path ${ol(2.4)} d="M52 92 H68 L66 96 H54Z" fill="#fff"/><path d="M60 92 V84 M57 86 C58 82 62 82 63 86" stroke="#4DABF7" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
      `<rect ${ol(2.6)} x="22" y="60" width="10" height="40" fill="#F1E3CF"/><rect ${ol(2.6)} x="88" y="60" width="10" height="40" fill="#F1E3CF"/>` +
      `<rect ${ol(2.4)} x="20" y="56" width="14" height="5" rx="1" fill="#FCC419"/><rect ${ol(2.4)} x="86" y="56" width="14" height="5" rx="1" fill="#FCC419"/>` +
      az(27, 74, .7, 0) + az(27, 86, .7, 1) + az(93, 74, .7, 1) + az(93, 86, .7, 0) +
      `<path ${ol(3)} d="${arch}" fill="none"/>` +
      `<polygon ${ol(1.8)} points="${starPts(60, 22, 4.6, 2.2, 8)}" fill="#FCC419"/>` + sparkle(30, 44, 3.5) + sparkle(90, 44, 3.5);
  },

  // ── Paleta completa ──
  'Cajita de crayones': () =>
    [['#1C7ED6', 40, -10], ['#FAB005', 50, -4], ['#E03131', 60, 0], ['#343A40', 70, 4], ['#15AABF', 80, 10]].map(([c, x, r], i) =>
      `<g transform="rotate(${r} ${x} 70)"><rect ${ol(2.4)} x="${Number(x) - 4.5}" y="${36 + (i % 2) * 5}" width="9" height="34" rx="1" fill="${c}"/><path ${ol(2.2)} d="M${Number(x) - 4.5} ${36 + (i % 2) * 5} L${x} ${28 + (i % 2) * 5} L${Number(x) + 4.5} ${36 + (i % 2) * 5}Z" fill="${c}"/>` +
      `<path d="M${Number(x) - 4.5} ${44 + (i % 2) * 5} H${Number(x) + 4.5} M${Number(x) - 4.5} ${47 + (i % 2) * 5} H${Number(x) + 4.5}" stroke="#fff" stroke-width="1.2" opacity=".6"/></g>`).join('') +
    `<path ${ol(3)} d="M30 56 H90 L86 98 H34Z" fill="#FCC419"/><path ${ol(2.6)} d="M30 56 L24 46 L34 50Z M90 56 L96 46 L86 50Z" fill="#FAB005"/>` +
    `<path ${ol(2.4)} d="M36 66 H84 L82 88 H38Z" fill="#fff"/>` + az(48, 77, 1.1, 0) + az(60, 77, 1.1, 1) + az(72, 77, 1.1, 2) +
    `<path d="M34 60 V92" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>` + sparkle(28, 32, 3.5) + sparkle(94, 34, 3),
  'Arcoíris': () => {
    const cols = ['#E03131', '#FF922B', '#FCC419', '#51CF66', '#339AF0', '#7048E8'];
    let bow = '';
    cols.forEach((c, i) => { const r = 36 - i * 4.4; bow += `<path d="M${f(60 - r)} 66 A${r} ${r} 0 0 1 ${f(60 + r)} 66" fill="none" stroke="${c}" stroke-width="4.6"/>`; });
    let wall = '';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) wall += az(36 + c * 12, 76 + r * 12, 1, (c + r * 3) % 5);
    return `<path d="M22 66 A38 38 0 0 1 98 66" fill="none" stroke="${D}" stroke-width="3"/>` + bow + `<path d="M36 66 A24 24 0 0 1 84 66" fill="none" stroke="${D}" stroke-width="2.4"/>` +
      puff(28, 64, 1.2, '#fff') + puff(92, 64, 1.2, '#fff') +
      `<rect ${ol(3)} x="28" y="68" width="64" height="28" rx="3" fill="#DEE2E6"/>` + wall +
      sparkle(60, 32, 4) + sparkle(46, 52, 3, '#fff') + sparkle(74, 50, 3, '#fff');
  },
  'Vitral de catedral': u => {
    const cols = ['#1C7ED6', '#E03131', '#FCC419', '#15AABF', '#7048E8', '#40C057'];
    let pet = '', inner = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180, x = f(60 + 18 * Math.cos(a)), y = f(56 + 18 * Math.sin(a));
      pet += `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="8.5" fill="${cols[i % 6]}" stroke="${D}" stroke-width="1.8" transform="rotate(${i * 30} ${x} ${y})"/>`;
      inner += `<circle cx="${f(60 + 29 * Math.cos(a + .26))}" cy="${f(56 + 29 * Math.sin(a + .26))}" r="3.4" fill="${cols[(i + 3) % 6]}" stroke="${D}" stroke-width="1.6"/>`;
    }
    return `<path d="M60 56 L10 110 H110Z" fill="#FFE066" opacity=".35"/><path d="M60 56 L30 110 H90Z" fill="#FFF3BF" opacity=".5"/>` +
      `<path ${ol(3)} d="M24 98 V54 C24 30 40 18 60 16 C80 18 96 30 96 54 V98Z" fill="#ADB5BD"/>` +
      `<circle ${ol(3)} cx="60" cy="56" r="34" fill="#495057"/>` +
      `<defs><clipPath id="v${u}"><circle cx="60" cy="56" r="32"/></clipPath></defs><g clip-path="url(#v${u})">${inner}${pet}</g>` +
      `<circle ${ol(2.4)} cx="60" cy="56" r="7" fill="#FCC419"/><circle cx="60" cy="56" r="3" fill="#fff"/>` +
      `<path d="M40 38 C44 32 50 28 56 27" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>` +
      `<path d="M30 92 L40 98 M90 92 L80 98" stroke="${D}" stroke-width="2"/>` + sparkle(60, 96, 3.5, '#fff') + sparkle(42, 92, 2.6) + sparkle(78, 94, 2.6);
  },

  // ── Manos de manteca ──
  'Plato roto': () =>
    `<ellipse cx="60" cy="88" rx="38" ry="8" fill="#E9D8B4"/>` +
    `<path ${ol(2.6)} d="M30 80 C30 72 40 66 50 66 L52 76 L46 80 L48 88 C38 88 30 86 30 80Z" fill="#fff"/><path d="M36 78 C36 74 40 71 45 70" stroke="#1C7ED6" stroke-width="2" fill="none"/>` +
    `<path ${ol(2.6)} d="M54 66 C64 66 72 70 74 76 L62 80 L58 74Z" fill="#fff"/><path d="M60 69 C64 69 68 71 70 74" stroke="#1C7ED6" stroke-width="2" fill="none"/>` +
    `<path ${ol(2.6)} d="M52 88 L50 82 L64 84 L76 80 C76 86 66 90 52 88Z" fill="#fff"/><path d="M58 86 C64 86 68 85 72 83" stroke="#1C7ED6" stroke-width="2" fill="none"/>` +
    shard(36, 94, .8, 0, 20) + shard(84, 92, .7, 0, -30) + shard(70, 60, .6, 0, 50) +
    `<g transform="rotate(28 82 52)">` + stick('M82 20 V60', '#C97B45', 3.4) + `<path ${ol(2.6)} d="M74 60 H90 L94 76 H70Z" fill="#FCC419"/><path d="M74 66 V76 M78 66 V76 M82 66 V76 M86 66 V76 M90 66 V76" stroke="#E67700" stroke-width="1.4"/><rect ${ol(2.4)} x="73" y="57" width="18" height="5" rx="1.5" fill="#E03131"/></g>` +
    stick('M30 74 L26 52', '#C92A2A', 3.4) +
    `<path ${ol(2.6)} d="M24 84 L28 72 H40 L46 84Z" fill="#E03131"/><path d="M29 81 L31 75 H39" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5"/>` +
    line('M44 56 L46 52 M52 58 L56 55 M40 62 L36 60', 2),
  'Elefante en bazar': () =>
    `<rect ${ol(2.6)} x="18" y="40" width="20" height="5" fill="#C97B45"/><rect ${ol(2.6)} x="82" y="40" width="20" height="5" fill="#C97B45"/>` +
    `<path ${ol(2.2)} d="M26 40 C22 34 24 28 28 28 C32 28 34 34 30 40Z" fill="#4DABF7"/><path ${ol(2.2)} d="M86 40 C86 34 88 30 92 30 C96 30 98 34 94 40Z" fill="#FCC419"/><path d="M89 34 H95" stroke="#E8590C" stroke-width="1.4"/>` +
    `<path ${ol(3)} d="M32 100 C32 78 44 70 60 70 C76 70 88 78 88 100Z" fill="#ADB5BD"/>` +
    `<path ${ol(3)} d="M42 52 C28 46 24 62 30 72 C34 76 42 74 46 66Z M78 52 C92 46 96 62 90 72 C86 76 78 74 74 66Z" fill="#CED4DA"/><path d="M38 56 C34 58 32 64 35 68 M82 56 C86 58 88 64 85 68" stroke="#FFA8A8" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<circle ${ol(3)} cx="60" cy="56" r="17" fill="#ADB5BD"/>` +
    `<path ${ol(3)} d="M55 62 C54 72 54 80 50 86 C48 90 52 92 54 89 C58 84 62 76 65 62Z" fill="#ADB5BD"/><path d="M55 70 H62 M54.5 76 H60.5 M53 82 H57" stroke="#868E96" stroke-width="1.2"/>` +
    `<path d="M51 50 Q53.5 48 56 50 M64 50 Q66.5 48 69 50" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="53.5" cy="52.5" r="1.6" fill="${D}"/><circle cx="66.5" cy="52.5" r="1.6" fill="${D}"/>` +
    blush(48, 60, 2.6) + blush(72, 60, 2.6) + `<path ${ol(1.4)} d="M73 44 C75 47 75 49 73 50 C71 49 71 47 73 44Z" fill="#74C0FC"/>` +
    shard(30, 88, 1, 0, 10) + shard(42, 96, .9, 1, -40) + shard(80, 90, 1, 2, 60) + shard(92, 82, .8, 3, 0) + shard(70, 98, .8, 4, 120) +
    az(26, 80, .9, 1, -30) + line('M24 66 L20 64 M98 68 L94 66 M60 34 V30', 2),
  'Casamiento griego': () =>
    `<g transform="rotate(-8 60 34)"><rect ${ol(2.6)} x="38" y="24" width="44" height="18" rx="5" fill="#1C7ED6"/>` + t(60, 39, 15, '¡OPA!', '#fff') + `</g>` +
    `<path d="M14 84 L30 66" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M14 84 L30 66" stroke="#fff" stroke-width="7.6" stroke-linecap="round"/>` +
    `<path d="M106 80 L90 62" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M106 80 L90 62" stroke="#fff" stroke-width="7.6" stroke-linecap="round"/>` +
    `<circle ${ol(2.4)} cx="31" cy="64" r="5" fill="#E8B98A"/><circle ${ol(2.4)} cx="89" cy="60" r="5" fill="#E8B98A"/>` +
    `<g transform="rotate(-20 36 58)"><ellipse ${ol(2.6)} cx="36" cy="58" rx="11" ry="4.5" fill="#fff"/><ellipse cx="36" cy="58" rx="6" ry="2" fill="none" stroke="#1C7ED6" stroke-width="1.6"/></g>` +
    `<path d="M24 60 C24 66 26 70 30 72 M22 50 L18 48" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>` +
    `<g transform="rotate(25 84 54)"><ellipse ${ol(2.6)} cx="84" cy="54" rx="11" ry="4.5" fill="#fff"/><ellipse cx="84" cy="54" rx="6" ry="2" fill="none" stroke="#1C7ED6" stroke-width="1.6"/></g>` +
    `<path d="M92 62 L96 66 M88 64 L90 70" stroke="${D}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>` +
    `<path ${ol(3)} d="M18 88 C40 84 80 84 102 88 V104 H18Z" fill="#E9D8B4"/>` +
    `<path d="M60 86 L52 74 M60 86 L60 70 M60 86 L68 74 M60 86 L74 82 M60 86 L46 82" stroke="#FCC419" stroke-width="2.4" stroke-linecap="round"/>` +
    shard(48, 72, .9, 0, 20) + shard(72, 72, .9, 4, -30) + shard(60, 66, .8, 2, 70) + shard(42, 86, .8, 0, -60) + shard(78, 86, .8, 1, 40) +
    `<path ${ol(2.4)} d="M54 88 L60 82 L66 88 L60 92Z" fill="#fff"/>` +
    sparkle(30, 80, 3) + sparkle(90, 78, 3.5),
  // ══ DOBBLE ══
  // ── Ojo biónico ──
  'Ojo de lince': () =>
    `<path ${ol(3)} d="M36 100 C36 82 46 74 60 74 C74 74 84 82 84 100Z" fill="#E0A458"/>` +
    `<path ${ol(3)} d="M44 40 L42 26 L54 34Z M76 40 L78 26 L66 34Z" fill="#E0A458"/><path d="M42 26 L41 21 M78 26 L79 21" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/><path d="M45 36 L44 30 L50 34Z M75 36 L76 30 L70 34Z" fill="#FFC9C9"/>` +
    `<path ${ol(3)} d="M60 32 C76 32 84 42 84 54 C84 60 88 64 86 68 C80 66 76 72 60 72 C44 72 40 66 34 68 C32 64 36 60 36 54 C36 42 44 32 60 32Z" fill="#E0A458"/>` +
    `<path d="M50 34 L52 40 M60 32 V38 M70 34 L68 40" stroke="#8B5A3C" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="60" cy="62" rx="12" ry="8" fill="#FFF3D6"/>` +
    `<circle ${ol(2.4)} cx="50" cy="50" r="7.5" fill="#fff"/><circle ${ol(2.4)} cx="70" cy="50" r="7.5" fill="#fff"/>` +
    `<circle cx="51" cy="53" r="5" fill="#94D82D"/><circle cx="69" cy="53" r="5" fill="#94D82D"/><circle cx="51" cy="54" r="2.6" fill="${D}"/><circle cx="69" cy="54" r="2.6" fill="${D}"/>` +
    `<circle cx="49.4" cy="51.6" r="1.2" fill="#fff"/><circle cx="67.4" cy="51.6" r="1.2" fill="#fff"/><path d="M42 41 L56 44 M78 41 L64 44" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path ${ol(1.8)} d="M57 59 H63 L60 62Z" fill="#F783AC"/><path d="M60 62 V64 M60 64 Q57 66 55 64 M60 64 Q63 66 65 64" stroke="${D}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
    `<path d="M40 62 L30 60 M40 65 L31 66 M80 62 L90 60 M80 65 L89 66" stroke="${D}" stroke-width="1.2" stroke-linecap="round"/>` +
    dcard(60, 86, 13, 10) + `<circle ${ol(2.4)} cx="46" cy="88" r="4.6" fill="#E0A458"/><circle ${ol(2.4)} cx="74" cy="88" r="4.6" fill="#E0A458"/>` +
    line('M53 63 L48 74 M67 63 L72 74', 1.4, '#94D82D') + sparkle(30, 44, 3.5) + sparkle(90, 44, 3.5),
  'Rayos X': () =>
    `<path d="M44 52 L32 82 H58Z M76 52 L62 82 H88Z" fill="#8CE99A" opacity=".45"/>` +
    [0, 1, 2].map((i) => `<ellipse ${ol(2.6)} cx="60" cy="${94 - i * 5}" rx="30" ry="9" fill="${i === 2 ? '#fff' : '#E9ECEF'}"/>`).join('') +
    `<g transform="translate(60 84) scale(1 .3)">` + [[-16, 0, 0], [0, 0, 1], [16, 0, 2], [-8, -14, 3], [8, 14, 4], [8, -14, 5]].map(([x, y, k]) => sym(k, x, y, 1.1)).join('') + `</g>` +
    `<path d="M44 52 L36 74 M76 52 L84 74 M44 52 L52 74 M76 52 L68 74" stroke="#2F9E44" stroke-width="1.6" stroke-dasharray="3 3"/>` +
    `<rect ${ol(2.6)} x="57" y="42" width="6" height="4" rx="2" fill="${D}"/><path d="M28 40 L22 36 M92 40 L98 36" stroke="${D}" stroke-width="3" stroke-linecap="round"/>` +
    [44, 76].map((x) => {
      let sp = 'M' + x + ' 44';
      for (let i = 1; i <= 26; i++) { const a = i * .55, r = i * .42; sp += ` L${f(x + r * Math.cos(a))} ${f(44 + r * Math.sin(a))}`; }
      return `<circle ${ol(3.2)} cx="${x}" cy="44" r="13" fill="#C3FAE8"/><path d="${sp}" fill="none" stroke="#12B886" stroke-width="1.8" stroke-linecap="round"/><path d="M${x - 8} ${38} C${x - 6} 34 ${x - 3} 33 ${x} 32" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }).join('') +
    `<path ${ol(2.6)} d="M31 42 H29 C26 42 25 38 28 36 M89 42 H91 C94 42 95 38 92 36" fill="none"/>` +
    sparkle(60, 28, 3.5) + sparkle(28, 66, 3, '#fff') + sparkle(92, 66, 3, '#fff'),
  'Terminator': () =>
    dcard(72, 72, 18, -10) +
    `<path d="M42 50 L70 66" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round" opacity=".55"/><path d="M42 50 L70 66" stroke="#E03131" stroke-width="1.2" stroke-linecap="round"/>` +
    `<circle cx="72" cy="67.6" r="8" fill="none" stroke="#E03131" stroke-width="2"/><path d="M72 56 V61 M72 74 V79 M60 67.6 H65 M79 67.6 H84" stroke="#E03131" stroke-width="2" stroke-linecap="round"/>` +
    `<path ${ol(3)} d="M24 70 C22 48 30 32 44 30 C58 30 64 42 62 58 C60 70 54 76 44 76 C34 76 26 76 24 70Z" fill="#ADB5BD"/>` +
    `<path d="M30 48 C30 40 36 34 44 34" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".6"/>` +
    `<path d="M24 62 H40 M48 36 V46 M26 54 H34" stroke="#868E96" stroke-width="1.6"/>` +
    [[30, 66], [56, 64], [52, 38], [30, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#495057"/>`).join('') +
    `<circle cx="42" cy="50" r="11" fill="#FF6B6B" opacity=".35"/><circle ${ol(2.6)} cx="42" cy="50" r="7" fill="#343A40"/><circle cx="42" cy="50" r="4.4" fill="#E03131"/><circle cx="42" cy="50" r="2" fill="#FFC9C9"/>` +
    `<path ${ol(2)} d="M34 66 H52 V70 H34Z" fill="#495057"/><path d="M38 66 V70 M42 66 V70 M46 66 V70" stroke="#ADB5BD" stroke-width="1.2"/>` +
    sparkle(86, 40, 3.5),

  // ── Reflejos ──
  'Gatillo fácil': () =>
    `<path ${ol(3)} d="M20 78 H100 V88 H20Z" fill="#8B5A3C"/><path d="M20 81 H100" stroke="#A0673C" stroke-width="1.6"/>` +
    `<rect ${ol(2.6)} x="54" y="76" width="14" height="14" rx="2" fill="#FCC419"/><rect x="58" y="80" width="6" height="6" rx="1" fill="#8B5A3C"/>` +
    `<path ${ol(3)} d="M28 80 H48 L46 102 H32Z" fill="#B4703F"/><path d="M32 84 H44" stroke="#E9C46A" stroke-width="1.6" stroke-dasharray="2 2"/><path ${ol(2.4)} d="M30 80 C30 74 46 74 46 80" fill="#8B5A3C"/>` +
    `<path d="M38 72 C40 60 50 52 60 50 M34 66 C38 56 44 50 52 46 M44 76 C48 66 54 60 62 58" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".55" stroke-dasharray="4 3"/>` +
    puff(40, 70, .7, '#E9ECEF') +
    dcard(72, 48, 14, 15) +
    `<path ${ol(2.6)} d="M58 58 C56 52 62 48 66 52 L70 56 C72 60 68 64 64 64 L60 64 C58 63 57 60 58 58Z" fill="#F4BE8F"/><path d="M60 56 C62 54 64 54 66 55 M59 60 C61 59 63 59 65 60" stroke="${D}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(2.6)} d="M48 74 L58 62 L64 66 L54 78Z" fill="#E03131"/>` +
    line('M86 34 L90 31 M90 44 L95 43 M86 60 L91 62', 2.2) + sparkle(30, 46, 3.5),
  'Lucky Luke': () =>
    `<ellipse cx="54" cy="94" rx="28" ry="4" fill="#E9D8B4"/>` +
    `<g opacity=".85"><path d="M38 94 L40 74 L36 52 C36 46 46 46 46 52 L44 74 L46 94Z" fill="#495057"/><circle cx="41" cy="40" r="6" fill="#495057"/><path d="M31 36 H51 L48 32 C46 26 36 26 34 32Z" fill="#495057"/>` +
    `<path d="M37 54 L32 70 M45 54 L48 70" stroke="#495057" stroke-width="3.4" stroke-linecap="round"/></g>` +
    t(30, 30, 10, '?', '#495057') +
    stick('M60 74 L58 94', '#1C7ED6', 3.4) + stick('M66 74 L70 94', '#1C7ED6', 3.4) + `<path ${ol(2)} d="M53 94 H60 L60 97 H53Z M68 94 H75 L75 97 H68Z" fill="#8B5A3C"/>` +
    `<path ${ol(3)} d="M56 76 L57 50 C57 46 69 46 69 50 L70 76Z" fill="#FCC419"/><path ${ol(2.4)} d="M57 50 C57 46 61 46 61 46 L61 76 H56Z M69 50 C69 46 65 46 65 46 L65 76 H70Z" fill="#212529"/>` +
    stick('M58 52 L54 70', '#FCC419', 3.4) + stick('M68 52 C74 51 78 50 81 49', '#FCC419', 3.4) + `<circle ${ol(2)} cx="54" cy="71" r="2.8" fill="#F4BE8F"/>` +
    dcard(86, 45, 9, 20) + `<circle ${ol(2)} cx="81.5" cy="49" r="3" fill="#F4BE8F"/>` +
    `<path ${ol(2)} d="M58 47 L63 52 L68 47 L63 45Z" fill="#E03131"/>` +
    `<circle ${ol(2.6)} cx="63" cy="38" r="7" fill="#F4BE8F"/><path d="M60 37 L62 37.4 M64.5 37.4 L66.5 37" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M60 41.5 Q63 43 66 41" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M57 38 L56 35 M69 38 L70 35" stroke="${D}" stroke-width="1.8"/>` +
    `<path ${ol(2.6)} d="M51 33 H75 C75 35 72 36 70 35 L69 28 C67 22 59 22 57 28 L56 35 C54 36 51 35 51 33Z" fill="#fff"/><path d="M57 31 H69" stroke="#E9ECEF" stroke-width="2"/>` +
    line('M88 58 L93 60 M86 63 L92 66 M90 32 L93 28', 2),
  'Correcaminos': () =>
    puff(30, 80, 1.3, '#F1E3CF') + puff(26, 66, .9, '#F1E3CF') + puff(40, 90, .9, '#F1E3CF') +
    line('M28 52 H42 M24 60 H38 M32 44 H44', 2.4) +
    `<circle cx="60" cy="88" r="8" fill="none" stroke="#FF922B" stroke-width="3" stroke-dasharray="5 3"/><path d="M56 88 L52 83 M64 88 L69 85" stroke="#FF922B" stroke-width="3" stroke-linecap="round"/>` +
    `<g transform="translate(-4 6)"><path ${ol(2.8)} d="M44 62 C38 60 32 62 26 60 C32 56 40 54 48 56Z" fill="#5F3DC4"/>` +
    `<path ${ol(3)} d="M46 64 C46 54 56 50 66 54 L74 60 C76 70 66 76 58 76 C50 76 46 72 46 64Z" fill="#7048E8"/><path d="M54 66 C58 70 64 70 68 66" stroke="#B197FC" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(3)} d="M66 56 C66 48 68 40 74 36 C80 32 88 36 88 42 C88 48 82 50 76 52 C74 56 72 60 68 62Z" fill="#7048E8"/>` +
    `<path ${ol(2.4)} d="M74 36 C70 32 66 32 62 33 C66 30 68 29 70 28 C68 27 66 26 64 26 C70 25 76 28 78 34Z" fill="#5F3DC4"/>` +
    `<path ${ol(2)} d="M86 42 L97 44 L86 47Z" fill="#FCC419"/>` +
    `<ellipse ${ol(2)} cx="81" cy="40" rx="3.6" ry="4.4" fill="#fff"/><circle cx="82.6" cy="40.6" r="1.8" fill="${D}"/><path d="M76 36.5 L84 35" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M82 47 Q84 49 86 47" stroke="${D}" stroke-width="1.3" fill="none"/></g>` +
    `<path ${ol(2.4)} d="M72 74 C72 67 94 67 94 74 C94 80 88 81 84 80 L79 85 L80 79.6 C75 79 72 77 72 74Z" fill="#fff"/>` + t(83, 77, 6.4, 'BIP BIP', '#E03131', 'textLength="18" lengthAdjust="spacingAndGlyphs"'),
  'Radio a galena': () =>
    `<path ${ol(3)} d="M22 76 L30 66 H92 L98 76 V84 H22Z" fill="#C97B45"/><path ${ol(3)} d="M22 76 H98" fill="none"/><path d="M28 80 H92" stroke="#A35E2F" stroke-width="1.4"/>` +
    `<rect ${ol(2.6)} x="34" y="48" width="18" height="22" rx="3" fill="#FFD8A8"/>` + [52, 56, 60, 64].map((y) => `<path d="M34 ${y} H52" stroke="#E8590C" stroke-width="2"/>`).join('') +
    `<ellipse ${ol(2.4)} cx="43" cy="48" rx="9" ry="2.6" fill="#E8A54B"/>` +
    `<rect ${ol(2.2)} x="62" y="62" width="10" height="6" rx="1" fill="#868E96"/><polygon ${ol(1.8)} points="67,54 71,58 67,62 63,58" fill="#B197FC"/><path d="M76 68 L76 56 C76 52 72 52 69 56" stroke="${D}" stroke-width="1.6" fill="none"/>` +
    `<circle ${ol(2)} cx="84" cy="72" r="3" fill="#FCC419"/><circle ${ol(2)} cx="28" cy="72" r="2.4" fill="#FCC419"/>` +
    `<path d="M43 46 C44 34 50 28 58 28" stroke="${D}" stroke-width="1.6" fill="none"/>` +
    `<path d="M58 34 C58 20 86 20 86 34" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/><path d="M58 34 C58 20 86 20 86 34" fill="none" stroke="#868E96" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect ${ol(2.6)} x="53" y="32" width="9" height="12" rx="4" fill="#343A40"/><rect ${ol(2.6)} x="82" y="32" width="9" height="12" rx="4" fill="#343A40"/>` +
    `<path d="M50 54 L46 50" stroke="none"/>` +
    `<path d="M88 50 L92 47 L90 54 L95 52 M26 48 L30 44 L30 50 L34 46" stroke="#FAB005" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M66 44 Q70 40 74 44 M64 40 Q70 34 76 40" stroke="#4DABF7" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-dasharray="2 2.4"/>`,
  'Misma frecuencia': () => {
    const radio = (x: number, c: string) =>
      `<rect ${ol(3)} x="${x - 14}" y="52" width="28" height="30" rx="7" fill="${c}"/><rect ${ol(2.2)} x="${x - 10}" y="57" width="20" height="10" rx="2" fill="#FFF3BF"/>` +
      `<path d="M${x - 7} 59 V61 M${x - 3} 59 V61 M${x + 1} 59 V61 M${x + 5} 59 V61" stroke="${D}" stroke-width="1"/><path d="M${x + 2} 57.6 V66.4" stroke="#E03131" stroke-width="1.8"/>` +
      `<circle cx="${x - 5}" cy="74" r="1.6" fill="${D}"/><circle cx="${x + 5}" cy="74" r="1.6" fill="${D}"/><path d="M${x - 2.6} 77 Q${x} 79.5 ${x + 2.6} 77" stroke="${D}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M${x} 52 L${x - 6} 38" stroke="${D}" stroke-width="2"/><circle ${ol(1.6)} cx="${x - 6}" cy="38" r="2" fill="#FCC419"/>` + blush(x - 9, 77, 2) + blush(x + 9, 77, 2) +
      `<rect ${ol(2.2)} x="${x - 11}" y="81" width="5" height="4" rx="1" fill="${D}"/><rect ${ol(2.2)} x="${x + 6}" y="81" width="5" height="4" rx="1" fill="${D}"/>`;
    return radio(36, '#E8590C') + radio(84, '#1C7ED6') +
      `<path d="M52 56 Q55 60 52 64 M48 52 Q53 60 48 68 M68 56 Q65 60 68 64 M72 52 Q67 60 72 68" stroke="#7048E8" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      heart(60, 42, 6, '#F06595') + sparkle(60, 78, 3.5) + sparkle(46, 30, 2.8, '#fff') + sparkle(76, 30, 2.8, '#fff');
  },
  'Trece de trece': () => {
    let g = '';
    for (let i = 0; i < 13; i++) {
      const c = i % 5, r = Math.floor(i / 5), x = 32 + c * 11, y = 52 + r * 11;
      g += `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1.5" fill="#fff" stroke="#ADB5BD" stroke-width="1.2"/><path d="M${x - 3} ${y} L${x - 1} ${y + 2.6} L${x + 3.6} ${y - 3.4}" stroke="#2F9E44" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return `<g transform="rotate(-5 60 62)"><rect ${ol(3)} x="24" y="32" width="72" height="62" rx="4" fill="#FFF8E7"/><rect x="24" y="32" width="72" height="12" rx="4" fill="#2F9E44"/><rect x="24" y="38" width="72" height="6" fill="#2F9E44"/><rect ${ol(3)} x="24" y="32" width="72" height="62" rx="4" fill="none"/>` +
      t(60, 42, 9, 'PRODE', '#fff', 'letter-spacing="1.5"') + g + `</g>` +
      `<circle cx="80" cy="78" r="14" fill="#FFE066" opacity=".5"/>` + star(80, 78, 12, '#FCC419', 2.6) + t(80, 82, 9, '13', '#E67700') +
      sparkle(30, 28, 3.5) + sparkle(94, 56, 3);
  },

  // ── Mentes gemelas ──
  'Gemelos': () => {
    const kid = (x: number, tilt: number) =>
      `<g transform="rotate(${tilt} ${x} 80)"><path ${ol(3)} d="M${x - 14} 104 C${x - 14} 88 ${x - 8} 82 ${x} 82 C${x + 8} 82 ${x + 14} 88 ${x + 14} 104Z" fill="#20C997"/>` +
      `<circle ${ol(3)} cx="${x}" cy="62" r="13" fill="#F4BE8F"/><path ${ol(2.4)} d="M${x - 13} 60 C${x - 14} 48 ${x + 14} 46 ${x + 13} 60 C${x + 8} 54 ${x + 2} 52 ${x - 4} 56 C${x - 7} 52 ${x - 10} 56 ${x - 13} 60Z" fill="#8B5A3C"/>` +
      `<circle cx="${x - 4.6}" cy="64" r="1.6" fill="${D}"/><circle cx="${x + 4.6}" cy="64" r="1.6" fill="${D}"/><ellipse cx="${x}" cy="70" rx="2" ry="2.4" fill="${D}"/>` + blush(x - 8, 68, 2) + blush(x + 8, 68, 2) + `</g>`;
    const board = (x: number, r: number) => `<g transform="rotate(${r} ${x} 88)"><rect ${ol(2.6)} x="${x - 13}" y="80" width="26" height="15" rx="2" fill="#fff"/>` + t(x, 91.3, 8.6, 'MATE', '#1C7ED6', 'textLength="19" lengthAdjust="spacingAndGlyphs"') + `</g>`;
    return `<g transform="translate(0 -7)">` + kid(42, -4) + kid(78, 4) + board(42, -6) + board(78, 6) +
      `<circle ${ol(2.2)} cx="30" cy="92" r="3.4" fill="#F4BE8F"/><circle ${ol(2.2)} cx="90" cy="92" r="3.4" fill="#F4BE8F"/>` +
      t(60, 50, 14, '=', '#E03131') + line('M38 44 L36 38 M46 44 L48 38 M74 44 L72 38 M82 44 L84 38', 2) + `</g>` + sparkle(60, 30, 3.5);
  },
  'Fotocopia': () =>
    `<path ${ol(3)} d="M26 64 V44 H94 V64Z" fill="#CED4DA"/><rect ${ol(3)} x="24" y="36" width="72" height="9" rx="2" fill="#868E96"/><path d="M30 39 H60" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>` +
    `<rect x="32" y="48" width="36" height="5" rx="2" fill="#69DB7C"/><path d="M32 50.5 H68" stroke="#fff" stroke-width="1.2" opacity=".6"/>` +
    `<circle ${ol(2)} cx="80" cy="51" r="3.2" fill="#E03131"/><circle ${ol(2)} cx="88" cy="51" r="2.4" fill="#40C057"/>` +
    `<rect ${ol(2.4)} x="30" y="58" width="60" height="5" rx="2.5" fill="${D}"/>` +
    [[44, 76, -14], [76, 76, 14], [60, 80, 0]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect ${ol(2.4)} x="${x - 12}" y="${y - 8}" width="24" height="16" rx="2" fill="#fff"/>` + t(x, y + 3.2, 8.4, 'MATE', '#1C7ED6') + `</g>`).join('') +
    `<path d="M36 30 L33 26 M60 31 V26 M84 30 L87 26" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` +
    line('M28 72 L24 70 M92 72 L96 70 M30 80 L25 80 M90 80 L95 80', 2),
  'Mente colmena': () => {
    const head = (x: number, c: string) => `<path ${ol(2.6)} d="M${x - 9} 100 C${x - 9} 92 ${x - 5} 90 ${x} 90 C${x + 5} 90 ${x + 9} 92 ${x + 9} 100Z" fill="${c}"/><circle ${ol(2.6)} cx="${x}" cy="82" r="8" fill="#F4BE8F"/>` +
      `<path d="M${x - 4} 81 H${x - 1.6} M${x + 1.6} 81 H${x + 4}" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M${x - 2} 86 H${x + 2}" stroke="${D}" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path ${ol(2)} d="M${x - 3} 74.5 H${x + 3} V71 H${x - 3}Z" fill="#ADB5BD"/>`;
    return stick('M34 71 C34 60 40 60 46 58', '#F06595', 2.6) + stick('M60 71 V62', '#4DABF7', 2.6) + stick('M86 71 C86 60 80 60 74 58', '#FCC419', 2.6) +
      head(34, '#40C057') + head(60, '#7048E8') + head(86, '#E8590C') +
      `<path ${ol(3)} d="M40 60 V36 C40 30 80 30 80 36 V60 C80 64 40 64 40 60Z" fill="#E7F5FF" fill-opacity=".85"/>` +
      `<path ${ol(2.6)} d="M46 48 C44 40 50 36 54 38 C56 34 64 34 66 38 C70 36 76 40 74 46 C78 50 74 56 70 55 C66 58 54 58 50 55 C44 56 42 50 46 48Z" fill="#FFA8C5"/>` +
      `<path d="M54 40 C56 44 52 46 54 50 M64 40 C62 44 66 46 64 52 M50 50 C54 50 56 52 58 52 M70 48 C68 50 66 50 64 50" stroke="#E64980" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
      `<rect ${ol(2.6)} x="38" y="26" width="44" height="7" rx="2" fill="#868E96"/><path d="M44 38 V56" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>` +
      `<path d="M30 42 L34 40 M30 50 L35 50 M90 42 L86 40 M90 50 L85 50" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` + sparkle(60, 20, 3);
  },

  // ── Una palabra basta ──
  'Pizarrita': () =>
    stick('M44 66 L34 98', '#C97B45', 3.4) + stick('M76 66 L86 98', '#C97B45', 3.4) + stick('M60 66 L62 96', '#A35E2F', 3) +
    `<rect ${ol(3)} x="28" y="32" width="64" height="44" rx="4" fill="#C97B45"/><rect ${ol(2.4)} x="32" y="36" width="56" height="36" rx="2" fill="#fff"/>` +
    t(60, 62, 20, 'SOL', '#1C7ED6') + `<path d="M36 40 L44 40" stroke="#E7F5FF" stroke-width="3" stroke-linecap="round"/><path d="M48 66 C56 68 66 68 74 66" stroke="#1C7ED6" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<rect ${ol(2.4)} x="26" y="74" width="68" height="5" rx="2" fill="#A35E2F"/>` +
    `<g transform="rotate(-12 74 77)"><rect ${ol(2)} x="64" y="72" width="20" height="5" rx="2" fill="#1C7ED6"/><path ${ol(1.6)} d="M84 72 L88 74.5 L84 77Z" fill="#fff"/></g>` +
    `<polygon ${ol(1.8)} points="${starPts(84, 44, 4, 1.6)}" fill="#FCC419"/>` + sparkle(30, 28, 3) + sparkle(92, 28, 3, '#fff'),
  'Telegrama': () =>
    `<path ${ol(3)} d="M30 30 H90 V94 H30Z" fill="#FFF3BF" transform="rotate(-4 60 62)"/>` +
    `<g transform="rotate(-4 60 62)"><rect x="30" y="30" width="60" height="12" fill="#E8590C"/><rect ${ol(3)} x="30" y="30" width="60" height="64" fill="none"/>` +
    t(60, 39.5, 8, 'TELEGRAMA', '#fff', 'textLength="44" lengthAdjust="spacingAndGlyphs"') +
    `<path d="M36 48 H58 M36 52 H50" stroke="#ADB5BD" stroke-width="1.6"/>` +
    `<rect x="34" y="57" width="52" height="11" fill="#fff" stroke="#E9D8B4"/>` + t(60, 65.6, 8, 'GANAMOS', D, 'font-family="Courier New, monospace" font-weight="bold" textLength="40" lengthAdjust="spacingAndGlyphs"') +
    `<rect x="34" y="71" width="52" height="11" fill="#fff" stroke="#E9D8B4"/>` + t(60, 79.6, 8, 'STOP', '#E03131', 'font-family="Courier New, monospace" font-weight="bold"') + `</g>` +
    `<circle ${ol(2.6)} cx="82" cy="86" r="9" fill="#C92A2A"/><polygon points="${starPts(82, 86, 5, 2.2)}" fill="#FF8787"/>` +
    sparkle(26, 46, 3.5) + sparkle(94, 46, 3),
  'Pocas pulgas': () =>
    stick('M42 80 L34 88 L30 96', '#8B5A3C', 2.6) + stick('M52 84 L50 92 L44 98', '#8B5A3C', 2.6) + stick('M62 82 L70 90 L76 98', '#8B5A3C', 2.6) +
    `<path ${ol(3)} d="M32 74 C30 62 40 56 52 58 C64 60 70 68 66 78 C62 86 40 88 32 74Z" fill="#A0673C"/><path d="M38 66 C40 62 44 60 48 60" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>` +
    `<path d="M40 72 C46 74 54 74 60 72 M40 78 C46 80 54 80 58 78" stroke="#7B4A2A" stroke-width="1.4" fill="none"/>` +
    `<path d="M82 40 V74" stroke="${D}" stroke-width="3.2" stroke-linecap="round"/><path d="M82 40 V74" stroke="#C97B45" stroke-width="1.4"/>` +
    stick('M64 68 L80 64', '#8B5A3C', 2.6) + `<circle ${ol(2)} cx="81" cy="64" r="2.8" fill="#A0673C"/>` +
    `<path d="M58 44 C56 36 50 34 46 36 M64 44 C66 36 70 34 74 36" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    `<circle ${ol(3)} cx="60" cy="52" r="10.5" fill="#A0673C"/>` +
    `<path d="M52 47 L58 49.5 M69 47 L63 49.5" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` + eye(55.5, 53, 1.8) + eye(65, 53, 1.8) +
    `<path d="M56 59 Q60 57 64 59" stroke="${D}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path ${ol(1.8)} d="M68 56 L76 59 L68 60Z" fill="#7B4A2A"/>` +
    `<g transform="rotate(4 82 44)"><rect ${ol(2.6)} x="70" y="36" width="24" height="14" rx="2" fill="#fff"/>` + t(82, 46.6, 9, 'BASTA', '#E03131', 'textLength="19" lengthAdjust="spacingAndGlyphs"') + `</g>` +
    line('M28 52 L33 55 M26 62 L32 62 M44 38 L40 34', 2),
};
