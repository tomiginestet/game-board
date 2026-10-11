// Ilustraciones de medallas: Skull King, Póker, Exploding Kittens, Dixit, Monopoly y Smash.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Piezas reutilizables ──────────────────────────────────────────────
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`;
const hl = (x: number, y: number, rx: number, ry: number, rot = -30, o = .7) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${x} ${y})"/>`;
const eye = (x: number, y: number, r = 2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${f(x + r * .35)}" cy="${f(y - r * .35)}" r="${f(r * .4)}" fill="#fff"/>`;
const blush = (x: number, y: number, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FF8FA3" opacity=".7"/>`;
const ln = (d: string, w = 2, c = D) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Nube/humo: unión de círculos con un solo contorno. */
const blob = (cs: [number, number, number][], fill: string, sw = 2.6) =>
  cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}" stroke="${D}" stroke-width="${sw * 2}"/>`).join('') +
  cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
/** Olas desde y hacia abajo. */
const waves = (y: number, fill: string, amp = 3, step = 12, x0 = 12) => {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < 108; x += step) d += ` q${step / 4} ${-amp} ${step / 2} 0 t${step / 2} 0`;
  return `<path class="m-ol" d="${d} V112 H${x0}Z" fill="${fill}"/>`;
};
const coin = (x: number, y: number, r: number) =>
  `<circle class="m-ol" style="stroke-width:${f(Math.min(2.6, r * .4))}" cx="${x}" cy="${y}" r="${r}" fill="#FCC419"/><circle cx="${x}" cy="${y}" r="${f(r * .6)}" fill="none" stroke="#E67700" stroke-width="${f(Math.min(1.6, r * .25))}"/>` +
  `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .4)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" transform="rotate(-40 ${f(x - r * .4)} ${f(y - r * .4)})"/>`;
const crown = (x: number, y: number, s: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-10 5 L-12 -6 L-5 -1 L0 -9 L5 -1 L12 -6 L10 5Z" fill="#FFD43B"/>` +
  `<path d="M-8 1 L-9 -2" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/><circle cx="0" cy="1.5" r="1.8" fill="#E03131"/><circle cx="-6" cy="2" r="1.2" fill="#4DABF7"/><circle cx="6" cy="2" r="1.2" fill="#4DABF7"/></g>`;
const SPADE = 'M0 -6 C-3 -2 -7 0 -6 4 C-5 7 -2 6 -1 5 L-2 8 H2 L1 5 C2 6 5 7 6 4 C7 0 3 -2 0 -6Z';
/** Carta de póker (20×28 con s=1). lbl: rango arriba a la izquierda. */
const card = (x: number, y: number, rot: number, suit: 'h' | 's' = 'h', s = 1, lbl = 'A', back = '#fff') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${back}"/>` +
  (suit === 'h' ? heart(0, 1.5, 4.4, '#E03131', 1.6 / s) + t(-5, -5, 7, lbl, '#E03131')
    : `<path class="m-ol" style="stroke-width:${f(1.6 / s)}" d="${SPADE}" transform="translate(0 2)" fill="${D}"/>` + t(-5, -5, 7, lbl, D)) + `</g>`;
/** Carta boca abajo. */
const cardBack = (x: number, y: number, rot: number, s = 1, c = '#E03131') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="#fff"/>` +
  `<rect x="-7" y="-11" width="14" height="22" rx="1.5" fill="${c}"/><path d="M-7 -4 L0 -11 L7 -4 M-7 4 L0 11 L7 4 M-7 -11 L7 11 M7 -11 L-7 11" stroke="#fff" stroke-width="1" opacity=".55" fill="none"/></g>`;
const chip = (x: number, y: number, r: number, c: string) =>
  `<circle class="m-ol" style="stroke-width:${f(Math.min(2.6, r * .35))}" cx="${x}" cy="${y}" r="${r}" fill="${c}"/>` +
  `<circle cx="${x}" cy="${y}" r="${f(r * .76)}" fill="none" stroke="#fff" stroke-width="${f(r * .3)}" stroke-dasharray="${f(r * .55)} ${f(r * .64)}"/>` +
  `<circle cx="${x}" cy="${y}" r="${f(r * .45)}" fill="${c}" stroke="#fff" stroke-width="${f(r * .1)}"/>`;
const chipStack = (x: number, y: number, n: number, c: string, w = 16) =>
  Array.from({ length: n }, (_, i) => `<rect class="m-ol" style="stroke-width:2" x="${f(x - w / 2)}" y="${f(y - i * 4.4 - 4.4)}" width="${w}" height="4.4" rx="2" fill="${c}"/>` +
    `<path d="M${f(x - w * .3)} ${f(y - i * 4.4 - 2.2)} h2 M${f(x - 1)} ${f(y - i * 4.4 - 2.2)} h2 M${f(x + w * .3 - 2)} ${f(y - i * 4.4 - 2.2)} h2" stroke="#fff" stroke-width="1.6"/>`).join('');
/** Calavera centrada (~30×35 con s=1). */
const skull = (x: number, y: number, s: number, rot = 0, fill = '#FFF8E7', extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-15 -2 C-15 -13 -8 -19 0 -19 C8 -19 15 -13 15 -2 C15 4 12 7 9 8 V13 C9 15 7 16 5 16 H-5 C-7 16 -9 15 -9 13 V8 C-12 7 -15 4 -15 -2Z" fill="${fill}"/>` +
  hl(-7, -12, 3, 1.8) +
  `<ellipse cx="-6" cy="-2" rx="4.2" ry="4.6" fill="${D}"/><ellipse cx="6" cy="-2" rx="4.2" ry="4.6" fill="${D}"/><circle cx="-4.8" cy="-3.6" r="1.4" fill="#fff"/><circle cx="7.2" cy="-3.6" r="1.4" fill="#fff"/>` +
  `<path d="M0 3 L-2 6.5 H2Z" fill="${D}"/>` + ln('M-6 10.5 H6 M-2 10.5 V15.5 M2 10.5 V15.5', 1.3) + extra + `</g>`;
const fish = (x: number, y: number, s: number, c: string, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M-9 0 L-16 -6 L-15 0 L-16 6Z" fill="${c}"/>` +
  `<path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M-10 0 C-6 -8 6 -8 10 0 C6 8 -6 8 -10 0Z" fill="${c}"/><path d="M-3 -5 C-1 -2 -1 2 -3 5" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6"/>` +
  `<circle cx="4" cy="-1.5" r="2.4" fill="#fff"/><circle cx="5" cy="-1.5" r="1.3" fill="${D}"/><circle cx="9.5" cy="1.8" r="1" fill="${D}"/></g>`;
// Gatito (cabeza ~32×34 con s=1; orejas en y≈-20, mentón en y≈14).
type CatFace = 'happy' | 'wow' | 'smug' | 'calm' | 'none';
const catFace = (k: CatFace, ec = D) =>
  k === 'happy' ? ln('M-8.5 -2 Q-6 -5 -3.5 -2 M3.5 -2 Q6 -5 8.5 -2', 1.8)
  : k === 'wow' ? `<circle cx="-6" cy="-3" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="6" cy="-3" r="3.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="-6" cy="-3" r="1.4" fill="${D}"/><circle cx="6" cy="-3" r="1.4" fill="${D}"/>`
  : k === 'smug' ? `<path d="M-9 -3.5 H-3 M3 -3.5 H9" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M-8.4 -3.5 A2.8 2.8 0 0 0 -3.6 -3.5Z M3.6 -3.5 A2.8 2.8 0 0 0 8.4 -3.5Z" fill="${ec}"/>`
  : k === 'calm' ? eye(-6, -3, 2.2) + eye(6, -3, 2.2)
  : '';
const cat = (x: number, y: number, s: number, fill: string, face: CatFace = 'happy', extra = '', rot = 0, mouth = true) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-15 0 C-16 -7 -15 -14 -13 -20 L-5 -13.5 C-2 -14.2 2 -14.2 5 -13.5 L13 -20 C15 -14 16 -7 15 0 C15 9 8 14 0 14 C-8 14 -15 9 -15 0Z" fill="${fill}"/>` +
  `<path d="M-12 -16 L-7.5 -12.6 L-12.6 -10.5Z M12 -16 L7.5 -12.6 L12.6 -10.5Z" fill="#FF8FA3"/>` + hl(-8, -9, 2.4, 1.4) +
  (face !== 'none' ? blush(-9.5, 4) + blush(9.5, 4) + catFace(face) : '') +
  (mouth ? `<path d="M-1.6 1.6 H1.6 L0 3.4Z" fill="#F06595" stroke="${D}" stroke-width=".8" stroke-linejoin="round"/>` + ln('M-3.2 5.4 Q-1.6 7 0 5.2 Q1.6 7 3.2 5.4', 1.3) +
    ln('M-16 1 L-10 2.4 M-16 5 L-10 4.6 M16 1 L10 2.4 M16 5 L10 4.6', 1) : '') + extra + `</g>`;
/** Bomba negra con mecha. */
const bomb = (x: number, y: number, r: number, ears = false) =>
  (ears ? `<path class="m-ol" d="M${f(x - r * .8)} ${f(y - r * .45)} L${f(x - r * .7)} ${f(y - r * 1.25)} L${f(x - r * .2)} ${f(y - r * .9)}Z M${f(x + r * .8)} ${f(y - r * .45)} L${f(x + r * .7)} ${f(y - r * 1.25)} L${f(x + r * .2)} ${f(y - r * .9)}Z" fill="#343A40"/>` : '') +
  `<circle class="m-ol" cx="${x}" cy="${y}" r="${r}" fill="#343A40"/>` + hl(f(x - r * .4), f(y - r * .4), f(r * .28), f(r * .16), -40, .5);
const mini = (x: number, y: number, s: number, fill: string, face = true, rot = 0, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-5 -6 C-10 -8 -9 -21 0 -21 C9 -21 10 -8 5 -6 L16 -4 C22 -3 22 6 16 6 L10 5 L15 19 C16 22 14 23 11 23 L3 23 C2 18 1 15 0 13 C-1 15 -2 18 -3 23 L-11 23 C-14 23 -16 22 -15 19 L-10 5 L-16 6 C-22 6 -22 -3 -16 -4Z" fill="${fill}"/>` +
  hl(-4, -17, 2.2, 1.4) + (face ? `<circle cx="-3.4" cy="-14" r="1.6" fill="${D}"/><circle cx="3.4" cy="-14" r="1.6" fill="${D}"/>` + ln('M-3 -10.2 Q0 -7.6 3 -10.2', 1.5) : '') + extra + `</g>`;
/** Carta de Dixit (alta, 18×27) con un dibujito adentro. */
const dcard = (x: number, y: number, rot: number, s: number, bg: string, art: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.4 / s)}" x="-9" y="-13.5" width="18" height="27" rx="2.5" fill="#FFF8E7"/>` +
  `<rect x="-6.5" y="-11" width="13" height="22" rx="1.2" fill="${bg}"/>${art}</g>`;
const DC_MOON = `<circle cx="1.5" cy="-4" r="4" fill="#FFE066"/><circle cx="3.2" cy="-5.4" r="3.4" fill="#4C6EF5"/><path d="M-6.5 6 Q-2 2 2 5 T6.5 4 V11 H-6.5Z" fill="#63E6BE"/><circle cx="-3" cy="-7" r=".8" fill="#fff"/><circle cx="4" cy="2" r=".6" fill="#fff"/>`;
const DC_EYE = `<path d="M-5 0 Q0 -5 5 0 Q0 5 -5 0Z" fill="#fff"/><circle r="2" fill="#7048E8"/><circle r=".8" fill="${D}"/><path d="M-6.5 -8 Q-2 -6 0 -3 M6.5 -8 Q2 -6 0 -3" stroke="#FFD8A8" stroke-width="1.2" fill="none"/><path d="M-3 6 L0 10 L3 6Z" fill="#FFD43B"/>`;
const DC_KEY = `<circle cx="0" cy="-4" r="3" fill="none" stroke="#FCC419" stroke-width="1.6"/><path d="M0 -1 V8 M0 5 H2.6 M0 7.6 H2" stroke="#FCC419" stroke-width="1.6"/><circle cx="-4" cy="-8" r=".7" fill="#fff"/><circle cx="4" cy="2" r=".7" fill="#fff"/>`;
/** Medialuna (crecent) entre dos círculos. */
const crescent = (cx: number, cy: number, R: number, dx: number, dy: number, r: number) => {
  const d = Math.hypot(dx, dy), a = (R * R - r * r + d * d) / (2 * d), h = Math.sqrt(R * R - a * a);
  const bx = cx + a * dx / d, by = cy + a * dy / d, px = -dy / d * h, py = dx / d * h;
  return `M${f(bx + px)} ${f(by + py)} A${R} ${R} 0 1 1 ${f(bx - px)} ${f(by - py)} A${r} ${r} 0 1 0 ${f(bx + px)} ${f(by + py)}Z`;
};
const medialuna = (x: number, y: number, s: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2 / s)}" d="M-8 2 C-8 -4 -3 -6 0 -6 C3 -6 8 -4 8 2 C6 0 4 -1 3 -1 C2 -3 -2 -3 -3 -1 C-4 -1 -6 0 -8 2Z" fill="#E8A54B"/>` +
  ln('M-3 -1 L-2 -5 M3 -1 L2 -5', .9, '#B5651D') + `</g>`;
/** Guante de boxeo apuntando a la derecha (~44×30 con s=1). */
const glove = (x: number, y: number, s: number, rot = 0, c = '#E03131') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-27" y="-11" width="14" height="22" rx="3" fill="#fff"/>` +
  ln('M-23 -6 L-18 -2 M-23 -2 L-18 2 M-23 2 L-18 6', 1.2, '#ADB5BD') +
  `<path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="M-15 -13 C-6 -20 12 -19 17 -7 C21 3 16 14 4 15 L-15 13Z" fill="${c}"/>` +
  `<path class="m-ol" style="stroke-width:${f(2.2 / s)}" d="M-8 6 C-6 0 6 0 8 5 C9 9 0 11 -5 10" fill="${c}"/>` +
  hl(0, -11, 6, 2.6, -8, .6) + `</g>`;
/** Uniforme a rayas recortado con una forma. */
const stripes = (u: string, d: string, x0: number, y0: number, x1: number, y1: number, gap = 6, c = '#212529', base = '#fff') =>
  `<defs><clipPath id="${u}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="${base}"/>` +
  `<g clip-path="url(#${u})" fill="${c}">${Array.from({ length: Math.ceil((y1 - y0) / gap) }, (_, i) => `<rect x="${x0}" y="${f(y0 + i * gap)}" width="${x1 - x0}" height="${f(gap / 2)}"/>`).join('')}</g>` +
  `<path class="m-ol" d="${d}" fill="none"/>`;

export const G5_ART: Record<string, (u: number) => string> = {
  // ══ SKULL KING ══
  // ── Cazador de reyes ──
  'Beso de sirena': () =>
    waves(86, '#74C0FC', 2.5, 14) + ln('M24 93 q4 -2 8 0 M80 94 q4 -2 8 0', 1.6, '#fff') +
    `<path class="m-ol" d="M50 88 C58 82 66 80 74 82 C70 86 67 88 64 89 C68 90 71 93 72 97 C66 97 58 95 50 92Z" fill="#12B886"/>` +
    stick('M34 70 C32 82 38 89 52 90', '#20C997', 9) + ln('M35 76 q2 2 4 0 M37 82 q2 2 4 0 M42 86 q2 2 4 0', 1, '#087F5B') +
    skull(70, 58, 1.15, 8, '#FFF8E7', blush(-10, 4.5, 3.4) + blush(10, 4.5, 3.4) + ln('M13 -9 l3 -2 M14 -5 l3.4 -1', 1.4, '#F03E3E')) +
    crown(73, 34, .95, 12) +
    `<path class="m-ol" d="M33 63 C31 68 31 72 34 76 H46 C47 72 46 67 44 63Z" fill="#FFD8B5"/><ellipse class="m-ol" style="stroke-width:1.8" cx="42" cy="68" rx="3.6" ry="3" fill="#B197FC"/>` +
    `<path class="m-ol" d="M30 48 C30 38 46 36 50 46 C46 44 44 46 46 52 C40 54 38 60 36 70 C32 72 26 70 24 64 C28 60 28 54 30 48Z" fill="#F76707"/>` +
    `<circle class="m-ol" cx="42" cy="54" r="8.5" fill="#FFD8B5"/>` +
    `<path class="m-ol" d="M32 50 C32 42 42 40 49 46 C44 46 40 46 36 52Z" fill="#F76707"/>` +
    ln('M41 53 Q43 51 45 53', 1.4) + blush(44, 57.5, 2) +
    `<path class="m-ol" style="stroke-width:1.4" d="M49.5 55.5 C51.5 54 53 55 52 56.5 C53 58 51.5 59 49.5 57.5Z" fill="#F03E3E"/>` +
    `<circle cx="32" cy="50" r="2" fill="#FFD43B" stroke="${D}" stroke-width="1"/>` +
    heart(57, 37, 4, '#FF6B6B', 1.6) + heart(51, 27, 2.6, '#FF8FA3', 1.4) + sparkle(90, 66, 3.5),
  'Corona al agua': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#4DABF7"/><path d="M40 10 L52 10 L40 80 L22 80Z M66 10 L74 10 L72 80 L58 80Z" fill="#fff" opacity=".18"/>` +
    stick('M28 92 C24 84 32 80 28 70 C25 64 30 60 28 56', '#40C057', 3.4) + stick('M92 92 C96 84 88 80 92 72', '#40C057', 3.4) +
    `<path class="m-ol" d="M14 88 Q34 80 54 86 T106 84 V112 H14Z" fill="#FFD8A8"/><circle cx="66" cy="92" r="1.3" fill="#E8A54B"/><circle cx="34" cy="94" r="1.3" fill="#E8A54B"/>` +
    crown(42, 86, .8, -18) + crown(80, 87, .75, 16) +
    `<circle cx="51" cy="36" r="3" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="56" cy="27" r="2.2" fill="none" stroke="#fff" stroke-width="1.4"/><circle cx="50" cy="21" r="1.6" fill="none" stroke="#fff" stroke-width="1.2"/><circle cx="66" cy="38" r="1.8" fill="none" stroke="#fff" stroke-width="1.3"/>` +
    crown(60, 54, 1.5, 22) + ln('M46 44 L44 40 M76 46 L80 43', 2, '#fff') +
    fish(30, 58, .9, '#FF922B') + fish(89, 46, .85, '#FCC419', true) +
    `<circle cx="36" cy="50" r="1.4" fill="none" stroke="#fff" stroke-width="1"/><circle cx="83" cy="38" r="1.4" fill="none" stroke="#fff" stroke-width="1"/>`,
  'Leviatán': () =>
    `<rect x="0" y="0" width="120" height="80" fill="#D0EBFF"/>` +
    stick('M84 86 C92 74 92 60 86 52 C82 46 76 46 76 52', '#12B886', 7) +
    `<circle cx="91" cy="70" r="1.6" fill="#C3FAE8"/><circle cx="90" cy="62" r="1.4" fill="#C3FAE8"/>` +
    crown(78, 40, 1.05, -8) +
    stick('M30 84 C24 72 26 60 34 56 C38 54 42 58 38 62', '#12B886', 6) +
    `<path class="m-ol" d="M38 84 C36 56 44 36 60 36 C76 36 84 56 82 84Z" fill="#20C997"/>` + hl(48, 46, 5, 3, -45, .5) +
    `<circle cx="70" cy="50" r="2" fill="#63E6BE"/><circle cx="74" cy="56" r="1.4" fill="#63E6BE"/><circle cx="45" cy="60" r="1.6" fill="#63E6BE"/>` +
    `<ellipse class="m-ol" style="stroke-width:2" cx="52" cy="54" rx="5.6" ry="6.4" fill="#fff"/><ellipse class="m-ol" style="stroke-width:2" cx="67" cy="54" rx="5.6" ry="6.4" fill="#fff"/>` +
    `<circle cx="54" cy="52" r="2.8" fill="${D}"/><circle cx="69" cy="52" r="2.8" fill="${D}"/><circle cx="55" cy="51" r="1" fill="#fff"/><circle cx="70" cy="51" r="1" fill="#fff"/>` +
    ln('M45 45 L57 48 M74 45 L62 48', 2.6) +
    `<path class="m-ol" d="M49 66 Q60 75 71 66 Q60 70 49 66Z" fill="${D}"/><path d="M53 68 L55 72 L57 69Z M63 69 L65 72 L67 68Z" fill="#fff"/>` +
    `<g transform="translate(26 74) rotate(-10)"><path class="m-ol" style="stroke-width:2" d="M-8 0 H8 L5 5 H-5Z" fill="#8B5A3C"/><path d="M0 0 V-13" stroke="${D}" stroke-width="1.6"/><path class="m-ol" style="stroke-width:1.6" d="M0 -12 L7 -6 L0 -3Z" fill="#fff"/></g>` +
    waves(80, '#1C7ED6', 3, 12) + ln('M22 88 q4 -2 8 0 M60 90 q4 -2 8 0 M86 92 q4 -2 8 0', 1.6, '#74C0FC') +
    sparkle(92, 26, 3.5) + sparkle(64, 26, 3, '#fff'),
  // ── Terror de piratas ──
  'Parche en el ojo': () =>
    `<ellipse class="m-ol" cx="36" cy="62" rx="4" ry="5.5" fill="#F4BE8F"/><ellipse class="m-ol" cx="84" cy="62" rx="4" ry="5.5" fill="#F4BE8F"/>` +
    `<circle cx="34" cy="70" r="3.4" fill="none" stroke="${D}" stroke-width="4.4"/><circle cx="34" cy="70" r="3.4" fill="none" stroke="#FCC419" stroke-width="2"/>` +
    `<path class="m-ol" d="M37 58 C37 40 47 34 60 34 C73 34 83 40 83 58 C83 76 73 86 60 86 C47 86 37 76 37 58Z" fill="#F4BE8F"/>` +
    `<g fill="#C9824F" opacity=".55"><circle cx="50" cy="78" r=".9"/><circle cx="54" cy="81" r=".9"/><circle cx="60" cy="82" r=".9"/><circle cx="66" cy="81" r=".9"/><circle cx="70" cy="78" r=".9"/><circle cx="46" cy="74" r=".9"/><circle cx="74" cy="74" r=".9"/></g>` +
    `<path class="m-ol" d="M84 50 C92 48 96 54 94 60 C92 56 90 56 88 58 M84 50 C90 54 92 62 88 68" fill="#E03131"/>` +
    `<path class="m-ol" d="M35 52 C34 36 46 28 60 28 C74 28 86 36 85 52 C76 46 44 46 35 52Z" fill="#E03131"/>` +
    `<g fill="#fff"><circle cx="46" cy="40" r="1.6"/><circle cx="58" cy="35" r="1.6"/><circle cx="70" cy="38" r="1.6"/><circle cx="78" cy="44" r="1.6"/><circle cx="52" cy="45" r="1.4"/><circle cx="66" cy="44" r="1.4"/></g>` +
    ln('M36 54 L86 68', 4.6) + ln('M36 54 L86 68', 2, '#495057') +
    `<ellipse class="m-ol" cx="51" cy="60" rx="8" ry="7" fill="#212529"/>` +
    `<circle cx="51" cy="58.5" r="2.6" fill="#fff"/><rect x="49.4" y="60" width="3.2" height="2.4" rx=".6" fill="#fff"/><circle cx="50" cy="58.4" r=".7" fill="#212529"/><circle cx="52" cy="58.4" r=".7" fill="#212529"/>` +
    ln('M47 64.5 L55 66.5 M47 66.5 L55 64.5', 1.1, '#fff') +
    eye(69, 59, 2.6) + ln('M64 52 Q69 49 74 52', 2.2) + ln('M44 51 L56 52', 2.2) +
    blush(73, 68, 3) + `<path class="m-ol" style="stroke-width:2.2" d="M51 72 Q60 78 70 70" fill="none"/><rect class="m-ol" style="stroke-width:1.2" x="61.5" y="73" width="3.4" height="3" rx=".6" fill="#FCC419"/>` +
    sparkle(90, 34, 4) + sparkle(28, 80, 3, '#fff'),
  'Pata de palo': u =>
    `<path class="m-ol" d="M22 92 H98 V110 H22Z" fill="#C97B45"/>` + ln('M22 98 H98 M40 92 V98 M70 98 V110 M88 92 V98', 1.4, '#8B5A3C') +
    `<path class="m-ol" d="M52 50 H68 L63.5 90 C63 93 57 93 56.5 90Z" fill="#D9A066"/>` +
    ln('M57 56 C58 66 57 78 59 88', 1.4, '#B5651D') +
    ln('M56 58 v6 M58.2 58 v6 M60.4 58 v6 M62.6 58 v6 M55 63 L64 59 M56.5 69 v6 M58.5 69 v6 M60.5 69 v6 M62.5 69 v6 M55.5 74 L63.5 70 M58 80 v5 M60.4 80 v5', 1.4) +
    `<rect class="m-ol" x="50" y="48" width="20" height="6" rx="2" fill="#ADB5BD"/><circle cx="54" cy="51" r="1" fill="${D}"/><circle cx="66" cy="51" r="1" fill="${D}"/>` +
    stripes(`pp${u}`, 'M42 20 H78 L74 46 L70 50 L66 46 L62 51 L58 46 L54 51 L50 46 L46 50Z', 40, 20, 80, 52, 7, '#1971C2') +
    `<path class="m-ol" d="M60 20 V36" fill="none"/>` +
    t(84, 86, 9, 'toc', '#8B5A3C', 'transform="rotate(-10 84 86)"') + t(88, 74, 7, 'toc', '#B5651D', 'transform="rotate(-14 88 74)"') +
    ln('M50 91 l-4 -1 M70 91 l4 -1', 1.6) +
    `<g transform="translate(32 60)"><path class="m-ol" style="stroke-width:2" d="M-6 6 C-8 -4 -2 -10 4 -8 C8 -6 8 0 6 6 L2 14 H-4Z" fill="#40C057"/><path class="m-ol" style="stroke-width:1.8" d="M4 -6 C10 -6 11 -2 7 0Z" fill="#FCC419"/>${eye(1, -4, 1.4)}<path d="M-6 4 C-10 8 -10 14 -6 18" stroke="#E03131" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
  'Barba Negra': () =>
    blob([[26, 64, 6], [30, 56, 5], [94, 62, 6], [90, 54, 5]], '#CED4DA', 2) +
    `<circle class="m-ol" cx="60" cy="54" r="15" fill="#F4BE8F"/>` +
    `<path class="m-ol" d="M42 52 C36 62 34 78 40 86 C44 92 50 88 53 94 C56 89 60 96 64 91 C68 96 74 90 77 89 C86 80 86 62 78 52 C76 64 66 64 60 64 C54 64 44 64 42 52Z" fill="#212529"/>` +
    ln('M46 70 C44 76 46 82 44 86 M74 70 C76 76 74 82 76 86 M56 78 V88', 1.4, '#495057') +
    `<path class="m-ol" style="stroke-width:2" d="M52 70 Q60 76 68 70 Q60 72 52 70Z" fill="#fff"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M60 64 C56 62 48 62 44 68 C48 66 54 67 60 67 C66 67 72 66 76 68 C72 62 64 62 60 64Z" fill="#343A40"/>` +
    ln('M44 86 L40 92 M76 86 L80 92', 2.2) + flameSmall2(39, 94) + flameSmall2(81, 94) + flameSmall2(58, 98) + ln('M56 88 V95', 2.2) +
    `<ellipse cx="53" cy="53" rx="3" ry="3.2" fill="#fff" stroke="${D}" stroke-width="1.4"/><ellipse cx="67" cy="53" rx="3" ry="3.2" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="54" cy="54" r="1.5" fill="${D}"/><circle cx="66" cy="54" r="1.5" fill="${D}"/>` +
    ln('M48 47 L57 50 M72 47 L63 50', 3) +
    `<path class="m-ol" d="M28 42 C36 30 46 38 60 24 C74 38 84 30 92 42 C82 48 38 48 28 42Z" fill="#212529"/>` +
    ln('M33 43 C44 46 76 46 87 43', 1.8, '#FCC419') +
    `<g transform="translate(60 36) scale(.32)"><path d="M-15 -2 C-15 -13 -8 -19 0 -19 C8 -19 15 -13 15 -2 C15 4 12 7 9 8 V13 H-9 V8 C-12 7 -15 4 -15 -2Z" fill="#fff"/><circle cx="-6" cy="-2" r="4.4" fill="#212529"/><circle cx="6" cy="-2" r="4.4" fill="#212529"/></g>` +
    ln('M51 41 L69 44 M51 44 L69 41', 1.6, '#fff') +
    blob([[44, 22, 3], [49, 20, 3.4], [76, 21, 3], [71, 19, 3.2]], '#DEE2E6', 1.6),
  // ── Polizón ──
  'Polizón': () =>
    `<path class="m-ol" d="M22 92 H98 V110 H22Z" fill="#C97B45"/>` + ln('M22 98 H98 M50 92 V98 M78 98 V110', 1.4, '#8B5A3C') +
    `<path class="m-ol" d="M38 46 C34 60 34 78 38 92 H82 C86 78 86 60 82 46Z" fill="#C97B45"/>` +
    ln('M48 48 C46 62 46 78 48 92 M60 48 V92 M72 48 C74 62 74 78 72 92', 1.6, '#8B5A3C') + hl(42, 66, 2, 12, 0, .35) +
    `<path class="m-ol" d="M35.6 54 C46 57 74 57 84.4 54 L85 60 C74 63 46 63 35 60Z" fill="#868E96"/><path class="m-ol" d="M35 79 C46 82 74 82 85 79 L84.4 85 C74 88 46 88 35.6 85Z" fill="#868E96"/>` +
    `<ellipse class="m-ol" cx="60" cy="46" rx="22" ry="6" fill="#3B2314"/>` +
    `<ellipse cx="52" cy="46.5" rx="3" ry="2.6" fill="#fff"/><ellipse cx="64" cy="46.5" rx="3" ry="2.6" fill="#fff"/><circle cx="53" cy="46.8" r="1.5" fill="${D}"/><circle cx="65" cy="46.8" r="1.5" fill="${D}"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M73 47 C73 44 76 43 77 45 C78 43 80 44 80 46" fill="#F4BE8F"/>` +
    `<g transform="rotate(-14 58 34)"><ellipse class="m-ol" cx="58" cy="37" rx="23" ry="6" fill="#B5651D"/><ellipse class="m-ol" cx="58" cy="34" rx="23" ry="6" fill="#D9A066"/>` + ln('M44 33 H72 M48 37 H68', 1.2, '#B5651D') + `</g>` +
    `<path class="m-ol" style="stroke-width:1.6" d="M86 36 C88 40 89 42 89 44 A3 3 0 0 1 83 44 C83 42 84 40 86 36Z" fill="#74C0FC"/>` +
    t(34, 44, 8, 'shh…', '#868E96', 'transform="rotate(-14 34 44)"'),
  'Botella al mar': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#E7F5FF"/><circle class="m-ol" cx="80" cy="34" r="8" fill="#FFD43B"/>` +
    ln('M36 36 q3 -3 6 0 q3 -3 6 0 M28 46 q2 -2 4 0 q2 -2 4 0', 1.8) +
    waves(64, '#4DABF7', 3, 14) +
    `<g transform="translate(58 66) rotate(-24)"><path class="m-ol" d="M-22 -9 H6 C10 -9 12 -5 14 -4 H20 V4 H14 C12 5 10 9 6 9 H-22 C-25 9 -26 6 -26 0 C-26 -6 -25 -9 -22 -9Z" fill="#C3FAE8" fill-opacity=".9"/>` +
    `<rect class="m-ol" style="stroke-width:2" x="19" y="-5" width="7" height="10" rx="2" fill="#B5651D"/>` +
    `<g transform="rotate(24 -6 0)"><rect class="m-ol" style="stroke-width:1.8" x="-14" y="-6" width="16" height="12" rx="1.5" fill="#FFF3BF"/>` + t(-6, 4.4, 11, '0', '#E03131') + `</g>` +
    `<path d="M-20 -5 H4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9"/><path d="M14 -2 H18" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></g>` +
    `<path class="m-ol" d="M12 78 q7 -4 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 V112 H12Z" fill="#339AF0" fill-opacity=".92"/>` +
    ln('M24 88 q4 -2 8 0 M58 92 q4 -2 8 0 M82 86 q4 -2 8 0', 1.6, '#A5D8FF') + sparkle(90, 56, 3, '#fff'),
  'Barco fantasma': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#2B2D52"/><circle cx="34" cy="32" r="1.2" fill="#fff"/><circle cx="86" cy="52" r="1" fill="#fff"/><circle cx="44" cy="46" r=".9" fill="#fff"/>` +
    `<circle cx="80" cy="34" r="10" fill="#FFF9DB"/><circle cx="77" cy="31" r="2" fill="#E9E3C5"/><circle cx="83" cy="38" r="1.4" fill="#E9E3C5"/>` +
    `<g opacity=".88">` +
    `<path d="M60 70 V28 M76 70 V40 M44 70 V44" stroke="${D}" stroke-width="2.4"/>` +
    `<path class="m-ol" d="M44 34 Q60 30 74 34 L72 60 L67 56 L63 62 L58 56 L53 61 L48 57 L46 60Z" fill="#96F2D7"/>` +
    `<path class="m-ol" d="M77 44 L90 52 L86 58 L84 55 L78 64Z" fill="#96F2D7"/><path class="m-ol" d="M43 46 L32 58 L36 58 L38 62 L43 60Z" fill="#96F2D7"/>` +
    `<ellipse cx="54" cy="43" rx="2.6" ry="3.6" fill="${D}"/><ellipse cx="65" cy="43" rx="2.6" ry="3.6" fill="${D}"/><ellipse cx="59.5" cy="51" rx="2.6" ry="3.2" fill="${D}"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M60 28 L68 30 L64 32 L68 34 L60 34Z" fill="#63E6BE"/>` +
    `<path class="m-ol" d="M26 64 H36 L38 70 H92 L86 82 C70 86 50 86 38 82 L30 74Z" fill="#63E6BE"/>` +
    `<circle cx="50" cy="76" r="2" fill="#2B2D52"/><circle cx="62" cy="77" r="2" fill="#2B2D52"/><circle cx="74" cy="76" r="2" fill="#2B2D52"/>` + `</g>` +
    `<path d="M14 86 C24 80 34 88 44 84 C54 80 62 88 74 84 C84 80 94 86 106 82 V112 H14Z" fill="#E9ECEF" opacity=".55"/>` +
    `<path d="M14 94 C26 90 36 96 48 92 C60 88 70 96 82 92 C92 88 100 92 106 90 V112 H14Z" fill="#F8F9FA" opacity=".7"/>` +
    sparkle(30, 66, 3, '#96F2D7') + sparkle(92, 70, 2.6, '#96F2D7'),
  // ── Navegante exacto ──
  'Catalejo': () =>
    `<path d="M14 48 H106 V112 H14Z" fill="#74C0FC"/><path class="m-ol" d="M14 48 H106" fill="none"/>` + ln('M30 56 q4 -2 8 0 M78 60 q4 -2 8 0 M50 66 q4 -2 8 0', 1.6, '#fff') +
    card(56, 40, -8, 'h', .5, '7') + card(72, 39, 6, 's', .55, 'A') + card(86, 43, 14, 'h', .45, 'K') +
    `<circle class="m-ol" style="stroke-width:2" cx="40" cy="34" r="6" fill="#FFD43B"/>` +
    ln('M24 38 q2 -2 4 0 q2 -2 4 0', 1.4) +
    `<g transform="translate(26 92) rotate(-34)">` +
    `<rect class="m-ol" x="0" y="-4" width="14" height="8" rx="2" fill="#8B5A3C"/><rect class="m-ol" x="12" y="-5.5" width="15" height="11" rx="2" fill="#FCC419"/><rect class="m-ol" x="25" y="-7" width="15" height="14" rx="2" fill="#FAB005"/><rect class="m-ol" x="38" y="-9" width="14" height="18" rx="2.5" fill="#FCC419"/>` +
    `<path d="M15 -3 H25 M28 -4.5 H38 M41 -6 H50" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><ellipse class="m-ol" cx="52" cy="0" rx="3" ry="9" fill="#A5D8FF"/><path d="M52 -5 V-1" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></g>` +
    sparkle(79, 52, 5, '#fff') + sparkle(92, 30, 3),
  'Mapa del tesoro': u =>
    `<g transform="rotate(-7 60 60)"><path class="m-ol" d="M28 34 H92 V86 H28Z" fill="#FFE8B0"/>` +
    `<path d="M32 40 C34 38 38 39 40 41 M84 80 C86 78 88 79 90 80" stroke="#E9C46A" stroke-width="1.4" fill="none"/>` +
    `<defs><clipPath id="m${u}"><path d="M28 34 H92 V86 H28Z"/></clipPath></defs><g clip-path="url(#m${u})">` + ln('M30 48 q3 -2 6 0 M36 74 q3 -2 6 0 M80 40 q3 -2 6 0', 1.4, '#74C0FC') + `</g>` +
    `<path class="m-ol" style="stroke-width:2" d="M40 70 C36 60 44 50 54 52 C60 44 74 44 78 52 C86 54 86 66 80 72 C74 80 52 80 40 70Z" fill="#FFD8A8"/>` +
    `<path d="M48 66 C48 60 56 56 62 58 C68 54 76 58 74 66 C68 72 54 72 48 66Z" fill="#8CE99A"/>` +
    ln('M36 82 C42 78 46 74 50 70 C54 66 52 60 58 60 C64 60 66 56 70 52', 1.8, '#7F4F24').replace('stroke-linecap="round"', 'stroke-linecap="round" stroke-dasharray="2.5 3"') +
    `<path d="M66 46 L76 56 M76 46 L66 56" stroke="${D}" stroke-width="7" stroke-linecap="round"/><path d="M66 46 L76 56 M76 46 L66 56" stroke="#E03131" stroke-width="3.6" stroke-linecap="round"/>` +
    `<g transform="translate(40 46)"><path d="M0 -5 L1.4 0 L0 5 L-1.4 0Z M-5 0 L0 -1.4 L5 0 L0 1.4Z" fill="${D}"/>${t(0, -6.5, 4.5, 'N', D)}</g>` +
    `</g>` +
    `<g transform="rotate(-7 60 60)"><rect class="m-ol" x="22" y="31" width="8" height="58" rx="4" fill="#E9C46A"/><rect class="m-ol" x="90" y="31" width="8" height="58" rx="4" fill="#E9C46A"/>` +
    ln('M25 36 V84 M93 36 V84', 1.4, '#fff') + `</g>` + sparkle(88, 26, 3.5) + sparkle(30, 94, 3, '#fff'),
  'Cofre del tesoro': () =>
    `<g opacity=".6">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M60 58 L${f(60 + 50 * Math.cos((-160 + i * 23) * Math.PI / 180) - 4)} ${f(58 + 50 * Math.sin((-160 + i * 23) * Math.PI / 180))} L${f(60 + 50 * Math.cos((-160 + i * 23) * Math.PI / 180) + 4)} ${f(58 + 50 * Math.sin((-160 + i * 23) * Math.PI / 180))}Z" fill="#FFE066"/>`).join('')}</g>` +
    `<path class="m-ol" d="M30 60 L34 34 C40 28 80 28 86 34 L90 60Z" fill="#8B4513"/><path d="M36 56 L39 38 C44 34 76 34 81 38 L84 56Z" fill="#5C2E0E"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M56 30 H64 V38 H56Z" fill="#FCC419"/>` +
    coin(38, 62, 6) + coin(50, 58, 6.4) + coin(62, 55, 6.6) + coin(74, 58, 6.4) + coin(84, 62, 6) + coin(44, 52, 5.4) + coin(56, 48, 5.6) + coin(69, 48, 5.6) + coin(79, 52, 5.2) + coin(62, 41, 5.4) +
    `<polygon class="m-ol" style="stroke-width:2" points="48,44 52,40 56,44 52,50" fill="#E03131"/><polygon class="m-ol" style="stroke-width:2" points="74,40 78,36 82,40 78,46" fill="#4DABF7"/>` +
    `<path class="m-ol" d="M28 64 H92 V92 H28Z" fill="#A0522D"/><path d="M34 70 V88 M86 70 V88" stroke="#7A3B16" stroke-width="1.6"/>` +
    `<path class="m-ol" d="M28 64 H92 V70 H28Z" fill="#FCC419"/><path class="m-ol" style="stroke-width:2" d="M40 64 V92 M80 64 V92" fill="none"/><path d="M38 64 V92 M78 64 V92" stroke="#FCC419" stroke-width="3"/><path class="m-ol" style="stroke-width:2" d="M36.5 64 V92 H40.5 V64 M76.5 64 V92 H80.5 V64" fill="none"/>` +
    `<path class="m-ol" d="M54 70 H66 V82 C66 85 54 85 54 82Z" fill="#FCC419"/><circle cx="60" cy="75" r="1.8" fill="${D}"/><path d="M60 76 V80" stroke="${D}" stroke-width="1.6"/>` +
    ln('M44 66 C46 74 52 76 54 74', 4.4) + ln('M44 66 C46 74 52 76 54 74', 2, '#fff') +
    `<g fill="#fff" stroke="${D}" stroke-width="1"><circle cx="45" cy="69" r="1.4"/><circle cx="47.5" cy="73" r="1.4"/><circle cx="51" cy="75" r="1.4"/></g>` +
    coin(34, 96, 5) + coin(86, 95, 5) + sparkle(30, 42, 4) + sparkle(92, 44, 4.5) + sparkle(60, 22, 3.5, '#fff'),

  // ══ PÓKER ══
  // ── Con todo ──
  'Chanchito roto': u => {
    const zig = 'M60 34 L55 44 L63 52 L56 61 L64 70 L58 82';
    const body = `<rect class="m-ol" x="38" y="70" width="8" height="12" rx="3" fill="#F783AC"/><rect class="m-ol" x="74" y="70" width="8" height="12" rx="3" fill="#F783AC"/>` +
      `<path class="m-ol" d="M32 56 C26 54 26 48 30 47" fill="none"/>` +
      `<ellipse class="m-ol" cx="60" cy="58" rx="27" ry="20" fill="#FFA8C5"/>` + hl(46, 46, 6, 3, -20, .6) +
      `<path class="m-ol" d="M66 40 L72 30 L78 42Z" fill="#F783AC"/><rect x="52" y="39" width="10" height="2.6" rx="1.3" fill="${D}"/>` +
      `<ellipse class="m-ol" cx="87" cy="60" rx="5" ry="6.4" fill="#F783AC"/><ellipse cx="86" cy="58" rx="1" ry="1.6" fill="${D}"/><ellipse cx="88.6" cy="62" rx="1" ry="1.6" fill="${D}"/>` +
      ln('M72 52 Q75 49 78 52', 1.8) + blush(78, 60, 3);
    const half = (side: 'l' | 'r') => `<defs><clipPath id="${side}${u}"><path d="${side === 'l' ? `M0 0 H60 ${zig.slice(7).replace(/L/g, 'L')} V130 H0Z` : `M120 0 H60 ${zig.slice(7)} V130 H120Z`}"/></clipPath></defs>` +
      `<g transform="${side === 'l' ? 'translate(-5 3) rotate(-9 46 72)' : 'translate(5 3) rotate(9 74 72)'}"><g clip-path="url(#${side}${u})">${body}</g>` +
      `<path class="m-ol" d="${zig}" fill="none"/></g>`;
    return half('l') + half('r') +
      chip(58, 66, 6, '#E03131') + chip(62, 80, 6.4, '#1C7ED6') + chip(54, 88, 6, '#2F9E44') + chip(68, 92, 5.6, '#E03131') + chip(44, 94, 5, '#1C7ED6') + chip(78, 96, 5, '#2F9E44') +
      ln('M60 26 V20 M50 28 L46 22 M70 28 L74 22', 2) + sparkle(30, 34, 3.5) + sparkle(92, 36, 3.5, '#fff');
  },
  'Valija de billetes': () => {
    const brick = (x: number, y: number) => `<rect class="m-ol" style="stroke-width:2" x="${x}" y="${y}" width="17" height="10" rx="1.5" fill="#8CE99A"/>` +
      `<path d="M${x + 2.5} ${y + 3} h4 M${x + 10.5} ${y + 7} h4" stroke="#2F9E44" stroke-width="1.2"/><rect x="${x + 6.5}" y="${y}" width="4" height="10" fill="#FFF3BF" stroke="${D}" stroke-width="1"/>`;
    return `<rect class="m-ol" x="30" y="26" width="60" height="30" rx="4" fill="#5C3A1E"/><rect x="34" y="30" width="52" height="22" rx="2" fill="#C92A2A"/><path d="M34 41 H86" stroke="#A61E1E" stroke-width="1.4"/>` +
      `<path class="m-ol" style="stroke-width:2" d="M40 30 C44 36 54 36 58 30" fill="#A61E1E"/>` +
      `<rect class="m-ol" x="26" y="54" width="68" height="34" rx="4" fill="#8B5A3C"/><rect x="30" y="57" width="60" height="28" rx="2" fill="#5C3A1E"/>` +
      brick(32, 59) + brick(51.5, 59) + brick(71, 59) + brick(32, 72) + brick(51.5, 72) + brick(71, 72) +
      `<rect class="m-ol" x="24" y="86" width="72" height="8" rx="3" fill="#6B3E1F"/><rect class="m-ol" style="stroke-width:2" x="36" y="87" width="7" height="5" rx="1" fill="#FCC419"/><rect class="m-ol" style="stroke-width:2" x="77" y="87" width="7" height="5" rx="1" fill="#FCC419"/>` +
      `<g transform="rotate(-18 84 34)"><rect class="m-ol" style="stroke-width:2" x="74" y="28" width="22" height="11" rx="1.5" fill="#B2F2BB"/>${t(85, 37, 8.5, '$', '#2F9E44')}</g>` +
      chip(30, 48, 6, '#1C7ED6') + chip(90, 70, 6, '#E03131') + chip(34, 92, 5, '#2F9E44') + sparkle(60, 22, 3.5);
  },
  'Pileta de monedas': u => {
    let cs = '';
    [[72, 6], [80, 6.5], [88, 7], [96, 7]].forEach(([y, r], row) => {
      for (let x = 22 + (row % 2) * 5; x < 100; x += r * 2) cs += coin(x, y, r);
    });
    return `<rect x="0" y="0" width="120" height="66" fill="#D0EBFF"/>` +
      `<path class="m-ol" d="M26 66 V50 H32 V66Z" fill="#ADB5BD"/><path class="m-ol" d="M16 44 H50 C52 44 52 49 50 49 H16Z" fill="#4DABF7"/>` +
      `<path class="m-ol" d="M14 66 H106 V112 H14Z" fill="#A5D8FF"/>` +
      `<defs><clipPath id="p${u}"><path d="M18 70 H102 V112 H18Z"/></clipPath></defs><path d="M18 70 H102 V112 H18Z" fill="#FAB005"/>` +
      `<g transform="rotate(12 64 60)">` + stick('M61 50 L58 30', '#F4BE8F', 5) + stick('M67 50 L70 30', '#F4BE8F', 5) +
      `<path class="m-ol" style="stroke-width:2" d="M53 28 C53 25 59 25 60 28 L59 31 H54Z M68 28 C69 25 75 25 75 28 L74 31 H69Z" fill="#F4BE8F"/>` +
      `<rect class="m-ol" x="55" y="46" width="18" height="30" rx="8" fill="#F4BE8F"/><path class="m-ol" d="M55 48 H73 V56 H55Z" fill="#E03131"/><path d="M56 52 H72" stroke="#fff" stroke-width="1.6"/></g>` +
      `<g clip-path="url(#p${u})">${cs}</g>` +
      coin(52, 64, 4.4) + coin(78, 62, 4.4) + coin(46, 54, 3.6) + coin(84, 50, 3.6) + coin(90, 60, 3) +
      ln('M56 66 C54 62 50 62 48 64 M72 66 C74 62 78 62 80 64', 2, '#E67700') +
      `<path class="m-ol" style="stroke-width:2" d="M92 70 V54 C92 50 98 50 98 54" fill="none"/>` + sparkle(40, 30, 3.5) + sparkle(92, 36, 4);
  },
  // ── Realeza ──
  'Corona de cartón': () => {
    const c = (x: number, y: number, r: number, l: string, red: boolean) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><rect class="m-ol" style="stroke-width:1.8" x="-6" y="-8.5" width="12" height="17" rx="2" fill="#fff"/>` +
      (red ? heart(0, 2.6, 2.6, '#E03131', 1) : `<path d="${SPADE}" transform="translate(0 3) scale(.45)" fill="${D}"/>`) + t(0, -1.4, 7, l, red ? '#E03131' : D) +
      `<rect x="-4" y="-11" width="8" height="4" fill="#FFF3BF" opacity=".75" transform="rotate(-12)"/></g>`;
    return `<path class="m-ol" d="M27 90 V40 L36 54 L44 30 L52 52 L60 24 L68 52 L76 30 L84 54 L93 40 V90 Z" fill="#D9A066"/>` +
      `<path d="M27 80 H93 M27 85 H93" stroke="#B5651D" stroke-width="1.2" stroke-dasharray="3 2"/>` +
      `<path class="m-ol" d="M27 76 H93" fill="none"/>` + ln('M31 50 L33 56 M57 34 L56 40', 1.6, '#fff') +
      `<circle class="m-ol" style="stroke-width:1.6" cx="44" cy="34" r="2.4" fill="#FFD43B"/><circle class="m-ol" style="stroke-width:1.6" cx="60" cy="28" r="2.6" fill="#FF6B6B"/><circle class="m-ol" style="stroke-width:1.6" cx="76" cy="34" r="2.4" fill="#4DABF7"/>` +
      c(33, 63, -10, '10', true) + c(46.5, 62, -4, 'J', true) + c(60, 61, 0, 'Q', true) + c(73.5, 62, 4, 'K', true) + c(87, 63, 10, 'A', true) +
      `<path d="M33 92 Q36 89 40 92" stroke="${D}" stroke-width="1.4" fill="none"/>` + star(80, 84, 3.4, '#FFD43B', 1.4) + star(40, 84, 3, '#4DABF7', 1.4) +
      sparkle(28, 32, 3) + sparkle(92, 32, 3);
  },
  'Cetro dorado': () =>
    `<path class="m-ol" d="M34 82 C40 78 80 78 86 82 L90 92 C80 96 40 96 30 92Z" fill="#C92A2A"/>` + ln('M38 84 C50 81 70 81 82 84', 2, '#FA5252') +
    `<path class="m-ol" style="stroke-width:1.6" d="M31 92 L27 98 L33 97Z M89 92 L93 98 L87 97Z M34 82 L29 79 L32 85Z M86 82 L91 79 L88 85Z" fill="#FCC419"/>` +
    `<g transform="rotate(16 60 60)">` + stick('M60 84 V54', '#FCC419', 5) +
    `<circle class="m-ol" style="stroke-width:2" cx="60" cy="86" r="3.6" fill="#FCC419"/><circle class="m-ol" style="stroke-width:2" cx="60" cy="68" r="3" fill="#E03131"/>` +
    `<path class="m-ol" d="M52 56 C52 50 68 50 68 56 L64 58 H56Z" fill="#FCC419"/>` + card(60, 38, 0, 'h', .95, 'A') + `</g>` +
    sparkle(36, 40, 4.5) + sparkle(90, 54, 3.5, '#fff') + sparkle(84, 30, 3),
  'Rey Momo': () =>
    `<g>` + [['#F06595', -40], ['#20C997', -20], ['#FCC419', 0], ['#4DABF7', 20], ['#9775FA', 40]].map(([c, a]) =>
      `<path class="m-ol" style="stroke-width:2" transform="rotate(${a} 60 46)" d="M60 46 C54 38 54 28 60 20 C66 28 66 38 60 46Z" fill="${c}"/>`).join('') + `</g>` +
    ln('M26 52 C30 46 26 42 30 38 M90 46 C94 50 90 56 94 60 M28 70 C24 74 30 78 26 82', 2.2, '#F06595') + ln('M84 30 C88 34 86 38 90 40', 2.2, '#20C997') +
    `<path class="m-ol" d="M36 96 C34 74 44 64 60 64 C76 64 86 74 84 96Z" fill="#7048E8"/>` + hl(44, 76, 3, 6, 20, .35) +
    `<path d="M60 66 V96" stroke="#FCC419" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/><path class="m-ol" d="M46 66 C52 72 68 72 74 66 C70 62 50 62 46 66Z" fill="#fff"/>` +
    `<circle class="m-ol" cx="60" cy="54" r="12" fill="#F4BE8F"/>` + ln('M53 52 Q55 50 57 52 M63 52 Q65 50 67 52', 1.6) + blush(52, 57, 2.6) + blush(68, 57, 2.6) +
    `<path class="m-ol" style="stroke-width:1.6" d="M60 57 C57 55 52 56 52 59 C55 58 57 59 60 59 C63 59 65 58 68 59 C68 56 63 55 60 57Z" fill="#6B3E1F"/><path d="M57 61 Q60 63.4 63 61" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    crown(60, 41, 1) +
    card(80, 72, 4, 'h', .45, 'A') + card(76, 73, -6, 'h', .45, 'K') + card(72, 75, -16, 'h', .45, 'Q') +
    `<circle class="m-ol" style="stroke-width:2" cx="72" cy="82" r="3.2" fill="#F4BE8F"/>` +
    `<g fill="#F06595"><rect x="34" y="40" width="2.4" height="2.4" transform="rotate(20 35 41)"/><rect x="86" y="72" width="2.4" height="2.4" fill="#FCC419"/></g><circle cx="38" cy="58" r="1.4" fill="#20C997"/><circle cx="88" cy="84" r="1.4" fill="#4DABF7"/>`,
  // ── Cara de póker ──
  'Cara de póker': () =>
    `<circle class="m-ol" cx="60" cy="58" r="24" fill="#F4BE8F"/>` +
    `<path class="m-ol" d="M36 50 C38 36 82 36 84 50 C76 46 44 46 36 50Z" fill="#51CF66" fill-opacity=".9"/><path class="m-ol" style="stroke-width:2" d="M34 50 C48 44 72 44 86 50" fill="none"/>` +
    `<circle cx="51" cy="58" r="2.4" fill="${D}"/><circle cx="69" cy="58" r="2.4" fill="${D}"/>` + ln('M46 53 H55 M65 53 H74', 2.2) +
    ln('M52 70 H68', 2.6) + ln('M60 60 V64', 1.4, '#C9824F') +
    `<path class="m-ol" style="stroke-width:1.8" d="M83 54 C86 59 88 62 88 64.5 A4 4 0 0 1 80 64.5 C80 62 81 59 83 54Z" fill="#74C0FC"/><ellipse cx="82" cy="63" rx=".9" ry="1.6" fill="#fff"/>` +
    cardBack(50, 88, -12, .7) + cardBack(62, 87, 6, .7, '#1C7ED6') +
    `<circle class="m-ol" style="stroke-width:2" cx="44" cy="92" r="4" fill="#F4BE8F"/><circle class="m-ol" style="stroke-width:2" cx="72" cy="92" r="4" fill="#F4BE8F"/>` +
    t(30, 36, 8, '...', '#868E96'),
  'Anteojos oscuros': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#283161"/><circle cx="30" cy="40" r="1.2" fill="#fff"/><circle cx="92" cy="46" r="1" fill="#fff"/><circle cx="40" cy="26" r=".9" fill="#fff"/>` +
    `<path class="m-ol" style="stroke-width:2" d="${crescent(84, 30, 7, 4, -3, 6)}" fill="#FFE066"/>` +
    `<path class="m-ol" d="M38 96 C38 84 46 80 60 80 C74 80 82 84 82 96Z" fill="#212529"/><path d="M54 80 L60 90 L66 80Z" fill="#fff"/><path d="M58 82 L60 92 L62 82Z" fill="#E03131"/>` +
    `<circle class="m-ol" cx="60" cy="58" r="21" fill="#F4BE8F"/>` +
    `<path class="m-ol" d="M39 56 C36 36 50 32 62 34 C74 32 86 40 81 56 C78 46 68 42 60 42 C50 42 42 46 39 56Z" fill="#212529"/>` + ln('M48 40 C54 37 62 37 68 38', 1.4, '#868E96') +
    ln('M38 56 H82', 2.6) +
    `<path class="m-ol" d="M40 54 H58 V60 C58 66 52 67 47 66 C41 65 40 61 40 54Z M62 54 H80 C80 61 79 65 73 66 C68 67 62 66 62 60Z" fill="#212529"/>` +
    `<rect x="44" y="56" width="5" height="7" rx=".8" fill="#fff" transform="rotate(-10 46 59)"/><rect x="66" y="56" width="5" height="7" rx=".8" fill="#fff" transform="rotate(-10 68 59)"/>` +
    `<path d="M45.6 59 l.9 1 -.9 1 -.9 -1Z M67.6 59 l.9 1 -.9 1 -.9 -1Z" fill="#E03131"/>` + ln('M52 56 L56 60 M74 56 L78 60', 1.2, '#868E96') +
    `<path class="m-ol" style="stroke-width:2.2" d="M53 71 Q60 74 67 69" fill="none"/>` + blush(72, 68, 2.4) +
    chipStack(90, 92, 3, '#E03131', 14) + sparkle(76, 70, 2.6, '#fff'),
  'Esfinge': () =>
    `<rect x="0" y="0" width="120" height="74" fill="#FFF3BF"/><circle class="m-ol" style="stroke-width:2" cx="34" cy="34" r="6" fill="#FFA94D"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M70 72 L88 44 L106 72Z" fill="#E9C46A"/><path d="M88 44 L106 72 H94Z" fill="#C98A00" opacity=".35"/>` +
    `<path class="m-ol" d="M14 74 H106 V112 H14Z" fill="#FFD8A8"/>` +
    `<path class="m-ol" d="M36 76 L42 42 C46 30 74 30 78 42 L84 76 L72 70 H48Z" fill="#4DABF7"/>` +
    ln('M40 50 L48 54 M38 60 L48 62 M37 70 L48 70 M80 50 L72 54 M82 60 L72 62 M83 70 L72 70', 3.4, '#FFD43B') +
    `<path class="m-ol" d="M48 44 C48 38 72 38 72 44 V60 C72 70 66 74 60 74 C54 74 48 70 48 60Z" fill="#E9C46A"/>` +
    ln('M51 54 Q54 52.6 57 54 M63 54 Q66 52.6 69 54', 1.8) + ln('M51 52 H57 M63 52 H69', 1.2, '#B5651D') +
    `<path d="M58 58 L60 63 L62 58" stroke="#B5651D" stroke-width="1.2" fill="none"/>` + ln('M56 67 Q60 68.5 65 66', 1.8) +
    `<rect class="m-ol" style="stroke-width:2" x="57" y="74" width="6" height="8" rx="1" fill="#4DABF7"/>` +
    `<path class="m-ol" d="M42 46 C46 38 74 38 78 46 L83 51 C72 46 48 46 37 51Z" fill="#51CF66" fill-opacity=".9"/><path d="M42 46 C50 42 70 42 78 46" stroke="#2F9E44" stroke-width="2" fill="none"/>` +
    `<path class="m-ol" d="M28 96 V84 C28 80 32 78 38 78 H48 C52 78 52 84 50 86 V96Z M92 96 V84 C92 80 88 78 82 78 H72 C68 78 68 84 70 86 V96Z" fill="#E9C46A"/>` +
    ln('M44 86 V92 M40 86 V92 M76 86 V92 M80 86 V92', 1.4, '#B5651D') +
    cardBack(56, 92, -10, .55) + cardBack(64, 92, 8, .55) + sparkle(92, 32, 3.5),

  // ══ EXPLODING KITTENS ══
  // ── Siete vidas ──
  'Gato de tejado': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#2C3E7A"/><circle cx="30" cy="40" r="1.2" fill="#fff"/><circle cx="90" cy="62" r="1" fill="#fff"/><circle cx="84" cy="34" r="1.3" fill="#fff"/><circle cx="36" cy="58" r=".9" fill="#fff"/>` +
    `<circle class="m-ol" cx="58" cy="50" r="22" fill="#FFF3BF"/><circle cx="50" cy="44" r="4" fill="#F1E3B0"/><circle cx="66" cy="58" r="3" fill="#F1E3B0"/><circle cx="64" cy="40" r="2" fill="#F1E3B0"/>` +
    `<path class="m-ol" d="M14 74 H106 V112 H14Z" fill="#C92A2A"/>` +
    `<g fill="none" stroke="#8F1F1F" stroke-width="1.6">${[80, 88, 96].map((y, r) => `<path d="M${10 + (r % 2) * 6} ${y} ${Array.from({ length: 9 }, () => 'q6 6 12 0').join(' ')}"/>`).join('')}</g>` +
    `<rect class="m-ol" x="12" y="70" width="96" height="6" rx="2" fill="#E8590C"/>` +
    `<g fill="#212529" stroke="${D}" stroke-width="2.4" stroke-linejoin="round">` +
    `<path d="M40 64 C34 60 32 50 36 44 C37 42 39 43 38 46 C36 52 38 58 44 62Z"/>` +
    `<path d="M44 70 V62 C44 56 52 54 60 54 C66 54 70 56 72 58 L72 70 H68 V64 H50 V70Z"/>` +
    `<path d="M66 56 C64 48 68 44 74 44 C80 44 82 48 81 54 C80 59 70 60 66 56Z M68 46 L68 39 L73 44Z M79 46 L81 39 L76 44Z"/></g>` +
    `<ellipse cx="72" cy="50" rx="1.8" ry="1.4" fill="#FFD43B"/><ellipse cx="78" cy="50" rx="1.8" ry="1.4" fill="#FFD43B"/><path d="M72 49.2 V50.8 M78 49.2 V50.8" stroke="${D}" stroke-width=".9"/>` +
    sparkle(90, 44, 3, '#fff') + sparkle(28, 50, 2.6, '#fff'),
  'Siete vidas': () =>
    Array.from({ length: 7 }, (_, i) => {
      const a = (-162 + i * 24) * Math.PI / 180;
      return heart(f(60 + 34 * Math.cos(a)), f(66 + 34 * Math.sin(a)), i === 3 ? 5 : 4.2, i % 2 ? '#FF8787' : '#FA5252', 1.6);
    }).join('') +
    cat(60, 70, 1.45, '#FF922B', 'happy', ln('M-4 -13 L-3 -9 M0 -13.6 V-9.4 M4 -13 L3 -9', 1.4, '#E8590C')) +
    `<path class="m-ol" d="M44 92 C46 88 50 88 52 92 M68 92 C70 88 74 88 76 92" fill="none"/>` + sparkle(30, 90, 3) + sparkle(92, 88, 3, '#fff'),
  'Gato con casco': () =>
    `<path class="m-ol" d="M32 100 C32 82 42 74 60 74 C78 74 88 82 88 100Z" fill="#5C940D"/>` +
    ln('M40 84 V100 M50 78 V100 M60 76 V100 M70 78 V100 M80 84 V100', 1.6, '#3B5D06') +
    `<path d="M34 90 H86" stroke="#FFD43B" stroke-width="4"/><path d="M34 90 H86" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3"/>` +
    `<path class="m-ol" d="M48 76 L54 82 L60 76 L66 82 L72 76" fill="none"/>` +
    cat(60, 58, 1.25, '#ADB5BD', 'calm', ln('M-11 -8 L-7 -6 M11 -8 L7 -6', 1.4, '#868E96')) +
    `<path class="m-ol" d="M41 44 C41 28 79 28 79 44Z" fill="#FCC419"/><path class="m-ol" style="stroke-width:2" d="M57 31 H63 V44 H57Z" fill="#FAB005"/>` +
    `<path class="m-ol" d="M34 44 H86 C86 49 34 49 34 44Z" fill="#FAB005"/>` + hl(48, 36, 4, 2, -30, .6) +
    `<g transform="translate(82 70) rotate(-10)"><path class="m-ol" style="stroke-width:2" d="M-6 6 V-2 C-6 -4 -4 -5 -2 -4 V-10 C-2 -13 3 -13 3 -10 V-4 H6 C8 -4 9 -2 8 0 L7 6Z" fill="#ADB5BD"/></g>` +
    sparkle(30, 36, 3.5) + sparkle(92, 50, 3),
  // ── Antibombas ──
  'Cable rojo': () =>
    bomb(54, 62, 22, true) + ln('M54 40 C54 34 58 30 62 30', 4.4) + ln('M54 40 C54 34 58 30 62 30', 2, '#CED4DA') +
    `<circle cx="47" cy="56" r="3.4" fill="#fff"/><circle cx="61" cy="56" r="3.4" fill="#fff"/><circle cx="48" cy="57" r="1.6" fill="${D}"/><circle cx="62" cy="57" r="1.6" fill="${D}"/>` +
    ln('M49 63 Q51 61.6 53 63 Q55 61.6 57 63 Q59 61.6 61 63', 1.4, '#fff') +
    `<path d="M66 48 C68 52 69 54 69 56 A2.4 2.4 0 0 1 64.2 56 C64.2 54 65 52 66 48Z" fill="#74C0FC"/>` +
    `<rect class="m-ol" style="stroke-width:2" x="42" y="68" width="24" height="11" rx="2" fill="#212529"/>` + t(54, 77, 8.5, '0:01', '#FF6B6B') +
    stick('M66 72 C82 74 88 62 74 50', '#E03131', 2.4) + stick('M62 79 C66 90 80 92 84 84', '#4DABF7', 2.4) + stick('M42 74 C32 78 30 86 38 90', '#FCC419', 2.4) +
    `<g transform="translate(91 54) rotate(32)">` +
    `<path class="m-ol" style="stroke-width:2" d="M-1 0 L-4.5 11 C-3 12.5 -1 12 0 10.5 L1.6 0Z" fill="#CED4DA"/><path class="m-ol" style="stroke-width:2" d="M1 0 L4.5 11 C3 12.5 1 12 0 10.5 L-1.6 0Z" fill="#ADB5BD"/>` +
    `<path class="m-ol" style="stroke-width:2.2" d="M-1.6 -1 L-7 -18 C-7 -21 -3 -21 -3 -18 L0 -3Z" fill="#E03131"/><path class="m-ol" style="stroke-width:2.2" d="M1.6 -1 L7 -18 C7 -21 3 -21 3 -18 L0 -3Z" fill="#FA5252"/>` +
    `<circle class="m-ol" style="stroke-width:1.6" cx="0" cy="0" r="2.4" fill="#868E96"/></g>` +
    `<path d="M80 72 L76 76 M86 72 L88 77 M78 66 L73 66" stroke="#FCC419" stroke-width="2" stroke-linecap="round"/>`,
  'Brigada antibombas': () =>
    `<path class="m-ol" d="M28 102 C28 80 40 70 60 70 C80 70 92 80 92 102Z" fill="#66803A"/>` +
    `<path class="m-ol" d="M46 74 H74 V100 H46Z" fill="#82A04A"/>` + ln('M46 82 H74 M46 90 H74 M60 74 V100', 1.6, '#4F6A26') +
    `<path class="m-ol" d="M28 86 C24 80 26 72 34 72 C40 72 42 80 40 90Z M92 86 C96 80 94 72 86 72 C80 72 78 80 80 90Z" fill="#82A04A"/>` +
    `<path d="M48 96 H72" stroke="#FFD43B" stroke-width="3"/>` +
    `<path class="m-ol" d="M38 40 L36 26 L46 32Z M82 40 L84 26 L74 32Z" fill="#66803A"/>` +
    `<circle class="m-ol" cx="60" cy="48" r="23" fill="#66803A"/>` +
    `<rect class="m-ol" x="43" y="36" width="34" height="26" rx="10" fill="#A5D8FF"/>` +
    `<g transform="translate(60 52) scale(.62)"><path d="M-6 -3 L-9 -14 L-3 -9Z M6 -3 L9 -14 L3 -9Z" fill="#FF922B" stroke="${D}" stroke-width="2"/><circle cx="0" cy="0" r="14" fill="#FF922B" stroke="${D}" stroke-width="2.6"/>` +
    eye(-5, -2, 2.6) + eye(5, -2, 2.6) + `<path d="M-1.6 3 H1.6 L0 4.6Z" fill="#F06595"/>` + ln('M-3 6.6 Q-1.5 8 0 6.4 Q1.5 8 3 6.6', 1.6) + `</g>` +
    `<path d="M47 40 L53 40 M47 44 L50 44" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M43 49 C40 50 39 54 41 57 M77 49 C80 50 81 54 79 57" fill="none"/>` +
    sparkle(30, 46, 3.5) + sparkle(92, 52, 3, '#fff'),
  'Gato MacGyver': () =>
    `<path class="m-ol" d="M24 100 C24 82 32 74 48 74 C62 74 70 82 70 100Z" fill="#B5651D"/><path class="m-ol" d="M40 74 L47 86 L54 74" fill="#fff"/>` +
    `<path class="m-ol" d="M32 58 C26 66 28 74 34 78 L40 70Z M60 58 C66 66 64 74 58 78 L52 70Z" fill="#8B5A3C"/>` +
    cat(46, 58, 1.08, '#FFD8A8', 'smug', '', 0) +
    `<path class="m-ol" style="stroke-width:2.2" d="M33 44 C32 36 38 34 42 38 C42 32 50 32 52 38 C54 34 60 36 59 44 C54 40 50 42 46 40 C42 42 38 40 33 44Z" fill="#8B5A3C"/>` +
    bomb(84, 76, 13, true) + ln('M84 63 C84 58 88 56 90 54', 4) + ln('M84 63 C84 58 88 56 90 54', 1.8, '#CED4DA') +
    `<path d="M76 72 C76 68 82 68 82 72 V80 C82 82 79 82 79 80 V73" fill="none" stroke="#DEE2E6" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M86 80 C86 76 92 76 93 80 C94 84 88 86 86 80Z" fill="#F783AC"/><circle class="m-ol" style="stroke-width:1.4" cx="94" cy="76" r="3" fill="#FCC2D7"/>` +
    `<g transform="translate(66 74) rotate(-30)"><rect class="m-ol" style="stroke-width:2" x="-3" y="-4" width="14" height="8" rx="4" fill="#E03131"/><path class="m-ol" style="stroke-width:1.6" d="M10 -2 L20 -3 L20 0 L10 1Z" fill="#DEE2E6"/><rect x="1.5" y="-1.5" width="3" height="3" fill="#fff"/></g>` +
    `<circle class="m-ol" style="stroke-width:2" cx="64" cy="78" r="3.6" fill="#FFD8A8"/>` + sparkle(92, 48, 3.5) + sparkle(30, 30, 3),
  // ── Kabum ──
  'Pelo chamuscado': () =>
    `<polygon class="m-ol" points="${starPts(60, 64, 34, 22, 14, -90)}" fill="#495057"/>` +
    `<polygon points="${starPts(60, 64, 28, 20, 14, -90)}" fill="#FFA94D"/>` +
    cat(60, 68, 1.4, '#FFA94D', 'wow', `<ellipse cx="0" cy="7" rx="2.4" ry="2.8" fill="${D}"/><circle cx="-8" cy="-12" r="2" fill="#495057" opacity=".6"/><circle cx="9" cy="-8" r="1.6" fill="#495057" opacity=".6"/>`, 0, false) +
    `<path d="M-1.6 1.6 H1.6 L0 3.4Z" transform="translate(60 68) scale(1.4)" fill="#F06595"/>` +
    ln('M40 70 l-3 -2 l-3 2 l-3 -2 M80 70 l3 -2 l3 2 l3 -2 M40 76 l-3 1 l-3 -1 l-3 1 M80 76 l3 1 l3 -1 l3 1', 1.2) +
    blob([[52, 26, 5], [60, 23, 6], [68, 26, 5]], '#CED4DA', 2) + blob([[30, 40, 3.5], [27, 34, 3]], '#DEE2E6', 1.6) + blob([[90, 40, 3.5], [93, 34, 3]], '#DEE2E6', 1.6) +
    sparkle(84, 86, 3.5, '#FF922B') + sparkle(34, 88, 3, '#FFD43B'),
  'Cara tiznada': () =>
    `<polygon class="m-ol" points="${starPts(60, 62, 40, 26, 10, -90)}" fill="#FFD43B"/><polygon points="${starPts(60, 62, 30, 20, 10, -72)}" fill="#FF922B"/>` +
    cat(60, 66, 1.45, '#495057', 'none', `<circle cx="-7" cy="-3" r="4.4" fill="#fff"/><path d="M1.6 -3 A4.4 4.4 0 0 0 10.4 -3Z" fill="#fff"/><path d="M1.2 -3.2 H10.8" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<circle cx="-6.4" cy="-2.6" r="1.8" fill="${D}"/><circle cx="6" cy="-2" r="1.4" fill="${D}"/><circle cx="-9" cy="6" r="3" fill="#343A40"/><circle cx="8" cy="8" r="2.4" fill="#343A40"/>` +
      `<path d="M-3 7 Q0 9 3 7" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="0" cy="3" r="1.6" fill="#F06595"/>`, 0, false) +
    ln('M37 66 c-2 -2 -4 2 -6 0 M37 72 c-2 2 -4 -2 -6 0 M83 66 c2 -2 4 2 6 0 M83 72 c2 2 4 -2 6 0', 1.4) +
    stick('M44 36 C40 30 46 28 42 22', '#ADB5BD', 2.4) + stick('M76 36 C80 30 74 28 78 22', '#ADB5BD', 2.4) +
    `<path d="M48 70 l-1 -2 M70 72 l1 -2" stroke="#fff" stroke-width="1" />`,
  'Hongo nuclear': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#FFE8CC"/>` +
    blob([[30, 92, 9], [42, 88, 10], [60, 86, 11], [78, 88, 10], [90, 92, 9], [60, 96, 8]], '#FF922B') +
    `<path class="m-ol" d="M52 84 C54 74 52 64 50 56 H70 C68 64 66 74 68 84Z" fill="#FFA94D"/><path d="M53 66 H67 M54 74 H66" stroke="#FF922B" stroke-width="2.4"/>` +
    `<ellipse class="m-ol" cx="60" cy="66" rx="16" ry="4" fill="#FFC078"/>` +
    `<path class="m-ol" d="M34 36 L34 18 L48 28Z M86 36 L86 18 L72 28Z" fill="#FF922B"/><path d="M37 32 L37 24 L43 28Z M83 32 L83 24 L77 28Z" fill="#FFD43B"/>` +
    blob([[38, 46, 10], [50, 38, 11], [60, 34, 10], [70, 38, 11], [82, 46, 10], [48, 52, 9], [60, 54, 9], [72, 52, 9], [60, 44, 12]], '#FF922B') +
    `<circle cx="48" cy="38" r="5" fill="#FFD43B" opacity=".8"/><circle cx="66" cy="34" r="4" fill="#FFD43B" opacity=".8"/><circle cx="80" cy="44" r="3.4" fill="#FFD43B" opacity=".8"/>` +
    ln('M48 44 L54 48 M54 44 L48 48 M66 44 L72 48 M72 44 L66 48', 2.4) + `<ellipse cx="60" cy="52" rx="3" ry="2.4" fill="${D}"/>` +
    ln('M38 48 L30 46 M38 51 L30 52 M82 48 L90 46 M82 51 L90 52', 1.2) +
    `<g transform="translate(90 30) rotate(-20)"><rect class="m-ol" style="stroke-width:1.4" x="-2.5" y="-2.5" width="5" height="5" rx="1" fill="#CED4DA"/><rect class="m-ol" style="stroke-width:1.4" x="-10" y="-2" width="6" height="4" fill="#4DABF7"/><rect class="m-ol" style="stroke-width:1.4" x="4" y="-2" width="6" height="4" fill="#4DABF7"/></g>`,
  // ══ DIXIT ══
  // ── Cuentacuentos ──
  'Abuela con cuento': () =>
    stick('M26 88 C40 98 66 98 84 90', '#8B5A3C', 3.4) + stick('M36 80 L33 92 M68 82 L70 94', '#B5651D', 3) +
    `<path class="m-ol" d="M28 82 L30 40 C30 30 48 30 48 40 L48 82Z" fill="#C97B45"/>` + ln('M34 40 V78 M39 38 V78 M44 40 V78', 1.4, '#8B5A3C') +
    `<path class="m-ol" d="M36 84 C34 66 40 56 52 56 C62 56 66 64 66 72 L60 84Z" fill="#F783AC"/>` + ln('M44 64 V82', 1.4, '#E64980') +
    `<path class="m-ol" d="M44 74 H72 C78 74 78 86 72 86 H44Z" fill="#9775FA"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M70 86 H82 C84 86 84 91 82 91 H70Z" fill="#FF8787"/>` +
    `<circle class="m-ol" cx="52" cy="34" r="5.4" fill="#E9ECEF"/>` +
    `<circle class="m-ol" cx="53" cy="46" r="10" fill="#FFD8B5"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M43 45 C42 36 50 34 56 36 C60 36 63 40 63 44 C58 40 50 40 43 45Z" fill="#E9ECEF"/>` +
    `<circle cx="51" cy="47" r="3" fill="#fff" fill-opacity=".5" stroke="${D}" stroke-width="1.3"/><circle cx="58.5" cy="47" r="3" fill="#fff" fill-opacity=".5" stroke="${D}" stroke-width="1.3"/>` +
    ln('M54 47 H55.5', 1.3) + ln('M50 47.5 Q51 46.4 52 47.5 M57.5 47.5 Q58.5 46.4 59.5 47.5', 1.1) + blush(48, 51, 2) + ln('M53 52.4 Q55.5 54.4 58 52.4', 1.4) +
    `<path class="m-ol" style="stroke-width:2" d="M56 66 L66 70 L76 66 V76 L66 80 L56 76Z" fill="#fff"/><path d="M66 70 V80" stroke="${D}" stroke-width="1.4"/>` + ln('M59 70 L64 72 M59 73 L64 75 M68 72 L73 70 M68 75 L73 73', 1, '#ADB5BD') +
    `<circle class="m-ol" style="stroke-width:1.8" cx="57" cy="72" r="2.8" fill="#FFD8B5"/><circle class="m-ol" style="stroke-width:1.8" cx="76" cy="71" r="2.8" fill="#FFD8B5"/>` +
    ln('M66 66 C62 58 72 54 70 46 C68 40 74 36 78 38', 1.4, '#B197FC').replace('round"/>', 'round" stroke-dasharray="2 3"/>') +
    star(80, 40, 4.4, '#FFD43B', 1.6) + sparkle(70, 30, 3.4, '#B197FC') + heart(86, 56, 3.2, '#FF8FA3', 1.4) +
    `<path class="m-ol" style="stroke-width:1.6" d="${crescent(76, 54, 4, 1.6, -1.4, 3.6)}" fill="#FFE066"/>` + sparkle(88, 70, 2.6, '#fff'),
  'Poeta maldito': () =>
    dcard(82, 46, 10, 1, '#B197FC', DC_EYE) +
    `<path class="m-ol" d="M28 102 C28 84 36 78 52 78 C68 78 76 84 76 102Z" fill="#343A40"/><path class="m-ol" d="M44 78 C44 84 60 84 60 78 V74 H44Z" fill="#212529"/>` +
    `<path class="m-ol" d="M38 62 C36 46 42 40 52 40 C62 40 68 46 66 62 C66 70 64 76 62 78 H42 C40 74 38 70 38 62Z" fill="#495057"/>` +
    `<circle class="m-ol" cx="52" cy="57" r="12" fill="#FFE3D3"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M41 54 C42 46 50 44 56 46 C60 48 62 50 64 54 C58 50 50 50 41 54Z" fill="#495057"/>` +
    `<path class="m-ol" d="M36 48 C34 38 50 32 62 36 C68 38 70 42 68 47 C58 43 46 44 36 48Z" fill="#212529"/><path d="M52 34 V31" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M45 56 H50 M54 56 H59" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M45.4 56 A2.3 2.3 0 0 0 49.6 56Z M54.4 56 A2.3 2.3 0 0 0 58.6 56Z" fill="${D}"/>` +
    ln('M45 60 Q47.5 61.4 50 60 M54 60 Q56.5 61.4 59 60', 1, '#B197FC') + ln('M48 65 Q52 63.6 56 65', 1.6) +
    `<g transform="rotate(14 56 65)"><rect class="m-ol" style="stroke-width:1.4" x="55" y="63.6" width="12" height="2.8" rx=".6" fill="#fff"/><rect x="65.4" y="64.2" width="1.6" height="1.6" fill="#FF6B1A"/></g>` +
    ln('M68 66 C72 60 64 58 68 52 C71 47 77 50 75 54 C73 57 70 54 72 52', 1.8, '#ADB5BD') +
    `<g transform="translate(76 86) rotate(35)"><path class="m-ol" style="stroke-width:2" d="M0 12 C-6 4 -6 -8 0 -16 C6 -8 6 4 0 12Z" fill="#fff"/>` + ln('M0 16 V-12 M0 -4 L-3 -8 M0 2 L3 -2 M0 -8 L3 -11', 1.1) + `</g>` +
    sparkle(92, 70, 3, '#B197FC'),
  'Borges': () => {
    const ring = (r: number, dash: string, rot: number) => `<circle cx="60" cy="64" r="${r}" fill="none" stroke="${D}" stroke-width="7" stroke-dasharray="${dash}" transform="rotate(${rot} 60 64)"/>` +
      `<circle cx="60" cy="64" r="${r}" fill="none" stroke="#C97B45" stroke-width="3.6" stroke-dasharray="${dash}" transform="rotate(${rot} 60 64)"/>`;
    return `<circle cx="60" cy="64" r="46" fill="#FFE8B0"/>` + ring(38, '70 9', 20) + ring(29, '50 8', -60) + ring(20, '34 7', 100) +
      ln('M60 26 V35 M98 64 H89 M27 58 L36 60 M73 30 L69 38', 4.4) + ln('M60 26 V35 M98 64 H89 M27 58 L36 60 M73 30 L69 38', 2, '#C97B45') +
      `<rect class="m-ol" x="53" y="80" width="5" height="12" fill="#495057"/><rect class="m-ol" x="62" y="80" width="5" height="12" fill="#495057"/>` +
      `<path class="m-ol" style="stroke-width:2" d="M51 92 H58 V95 H50Z M62 92 H69 L70 95 H62Z" fill="#212529"/>` +
      `<path class="m-ol" d="M47 84 C45 64 50 56 60 56 C70 56 75 64 73 84Z" fill="#868E96"/><path class="m-ol" style="stroke-width:2" d="M55 56 L60 66 L65 56Z" fill="#fff"/><path d="M59 58 L60 68 L61 58Z" fill="#7048E8"/>` +
      stick('M60 72 V95', '#6B3E1F', 2.4) + `<path class="m-ol" style="stroke-width:2" d="M56 72 C56 68 64 68 64 72 C64 75 56 75 56 72Z" fill="#FFD8B5"/>` +
      `<ellipse class="m-ol" style="stroke-width:2" cx="50" cy="46" rx="2" ry="3" fill="#FFD8B5"/><ellipse class="m-ol" style="stroke-width:2" cx="70" cy="46" rx="2" ry="3" fill="#FFD8B5"/>` +
      `<circle class="m-ol" cx="60" cy="45" r="10" fill="#FFD8B5"/>` +
      `<path class="m-ol" style="stroke-width:2" d="M50 43 C50 32 70 32 70 43 C66 38 54 38 50 43Z" fill="#E9ECEF"/>` +
      ln('M54 46 Q56 48 58 46 M62 46 Q64 48 66 46', 1.5) + ln('M53 42.5 H58 M62 42.5 H67', 1.2, '#ADB5BD') + ln('M57 51 Q60 53 63 51', 1.5) + blush(53, 50, 2) + blush(67, 50, 2) +
      sparkle(84, 30, 3.5) + sparkle(30, 82, 3, '#fff') + sparkle(90, 86, 2.6);
  },
  // ── Ilusionista ──
  'Conejo en la galera': () =>
    stick('M26 74 L42 58', D, 2.6) + ln('M38 62 L42 58', 3.4, '#fff') + sparkle(44, 55, 5) + sparkle(32, 50, 2.6, '#fff') + sparkle(48, 44, 2.4, '#B197FC') +
    `<ellipse class="m-ol" cx="60" cy="90" rx="30" ry="6" fill="#343A40"/>` +
    `<path class="m-ol" d="M40 64 V86 C40 92 80 92 80 86 V64Z" fill="#212529"/><path class="m-ol" d="M40 78 C40 82 80 82 80 78 V84 C80 88 40 88 40 84Z" fill="#E03131"/>` + hl(45, 70, 1.6, 5, 0, .35) +
    `<ellipse cx="60" cy="64" rx="20" ry="5" fill="#000"/>` +
    `<g transform="rotate(-12 52 34)"><ellipse class="m-ol" cx="52" cy="32" rx="5" ry="13" fill="#fff"/><ellipse cx="52" cy="33" rx="2.4" ry="9" fill="#FFC9C9"/></g>` +
    `<g transform="rotate(16 68 34)"><ellipse class="m-ol" cx="68" cy="32" rx="5" ry="13" fill="#fff"/><ellipse cx="68" cy="33" rx="2.4" ry="9" fill="#FFC9C9"/></g>` +
    `<path class="m-ol" d="M47 66 C46 58 50 54 60 54 C70 54 74 58 73 66Z" fill="#fff"/>` +
    `<circle class="m-ol" cx="60" cy="50" r="12" fill="#fff"/>` + eye(55, 49, 2.2) + eye(65, 49, 2.2) + blush(52, 54, 2.4) + blush(68, 54, 2.4) +
    `<path d="M58.6 53 H61.4 L60 54.6Z" fill="#F06595"/>` + ln('M57.6 56 Q60 58 62.4 56', 1.3) + `<rect x="58.8" y="56.4" width="2.4" height="2.2" rx=".5" fill="#fff" stroke="${D}" stroke-width=".8"/>` +
    `<path class="m-ol" style="stroke-width:2.6" d="M40 64 C40 70 80 70 80 64" fill="none"/>` +
    dcard(82, 56, 14, .9, '#4C6EF5', DC_MOON) +
    `<circle class="m-ol" style="stroke-width:2" cx="76" cy="62" r="3" fill="#fff"/><circle class="m-ol" style="stroke-width:2" cx="86" cy="50" r="3" fill="#fff"/>`,
  'Pintor surrealista': u =>
    stick('M74 30 L66 96', '#8B5A3C', 2.6) + stick('M80 30 L92 96', '#8B5A3C', 2.6) +
    `<g transform="rotate(4 77 54)"><rect class="m-ol" x="62" y="34" width="30" height="40" rx="2.5" fill="#FFF8E7"/><rect x="65" y="37" width="24" height="34" fill="#74C0FC"/><rect x="65" y="60" width="24" height="11" fill="#FFD8A8"/>` +
    ln('M66 52 L80 46 L84 40', 1.8, '#8B5A3C') +
    `<path class="m-ol" style="stroke-width:1.6" d="M70 45 C74 42 80 42 82 45 C84 50 80 54 82 62 C81 65 78 64 78 60 C77 55 72 54 70 52 C68 50 68 47 70 45Z" fill="#FFE066"/>` +
    `<path d="M72 47 C74 45 78 45 80 47 C81 51 78 53 79 58 C75 54 72 52 72 47Z" fill="#fff"/>` + ln('M76 49 V46 M76 49 L78 51', 1, D) +
    `<ellipse cx="86" cy="66" rx="2" ry="1" fill="#E8590C"/></g>` +
    stick('M50 74 L64 60', '#E9C46A', 2) + `<path class="m-ol" style="stroke-width:1.6" d="M63 61 L67 56 L68 58 L65 62Z" fill="#E03131"/>` +
    stripes(`ps${u}`, 'M22 102 C22 82 28 74 40 74 C52 74 58 82 58 102Z', 20, 74, 60, 104, 6, '#1C7ED6') +
    `<circle class="m-ol" style="stroke-width:2" cx="51" cy="74" r="3.2" fill="#F4BE8F"/>` +
    `<circle class="m-ol" cx="40" cy="54" r="12" fill="#F4BE8F"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M28 52 C28 40 52 40 52 50 C46 46 36 46 28 52Z" fill="#212529"/>` +
    `<circle cx="35" cy="54" r="3.4" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="45" cy="54" r="3.4" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="35.6" cy="53.4" r="1.4" fill="${D}"/><circle cx="45.6" cy="53.4" r="1.4" fill="${D}"/>` +
    ln('M31 49 Q35 47 38 49 M42 49 Q45 47 49 49', 1.4) +
    ln('M40 61 C36 60 31 59 30 52 C30 49 32 48 33 50 M40 61 C44 60 49 59 50 52 C50 49 48 48 47 50', 1.8) + ln('M38 65 H42', 1.4) +
    `<circle cx="28" cy="34" r="2" fill="#FF6B6B"/><circle cx="36" cy="30" r="1.6" fill="#FCC419"/><circle cx="92" cy="80" r="1.6" fill="#51CF66"/>`,
  'Gran Hipnotizador': () => {
    let sp = 'M60 46';
    for (let a = 0; a <= 6.6 * Math.PI; a += .25) sp += ` L${f(60 + 2.4 * a * Math.cos(a))} ${f(46 + 2.4 * a * Math.sin(a))}`;
    const se = (x: number, y: number) => {
      let p = `M${x} ${y}`;
      for (let a = 0; a <= 4 * Math.PI; a += .4) p += ` L${f(x + .32 * a * Math.cos(a))} ${f(y + .32 * a * Math.sin(a))}`;
      return `<circle cx="${x}" cy="${y}" r="4.4" fill="#fff" stroke="${D}" stroke-width="1.4"/><path d="${p}" fill="none" stroke="#7048E8" stroke-width="1.1" stroke-linecap="round"/>`;
    };
    return `<rect x="0" y="0" width="120" height="130" fill="#E5DBFF"/><path d="${sp}" fill="none" stroke="#B197FC" stroke-width="4.4"/>` +
      `<path class="m-ol" d="M24 104 L36 70 C42 64 78 64 84 70 L96 104Z" fill="#212529"/>` +
      `<path class="m-ol" d="M42 70 L30 52 L52 66Z M78 70 L90 52 L68 66Z" fill="#C92A2A"/>` +
      `<circle class="m-ol" cx="60" cy="50" r="14" fill="#F4BE8F"/>` +
      `<path class="m-ol" style="stroke-width:2" d="M46 48 C44 34 76 34 74 48 C70 42 64 41 60 46 C56 41 50 42 46 48Z" fill="#212529"/>` +
      se(54, 51) + se(66, 51) + ln('M49 45 Q53 42 57 45 M63 45 Q67 42 71 45', 1.8) +
      ln('M60 58 C56 57 52 58 50 55 M60 58 C64 57 68 58 70 55', 1.6) + `<path class="m-ol" style="stroke-width:1.6" d="M57 61 L60 69 L63 61Z" fill="#212529"/>` +
      ln('M61 74 L66 80 L70 85', 1.6, '#868E96').replace('round"/>', 'round" stroke-dasharray="1.6 1.6"/>') +
      `<circle class="m-ol" style="stroke-width:2" cx="60" cy="73" r="3.2" fill="#F4BE8F"/>` +
      `<circle class="m-ol" cx="72" cy="89" r="7.5" fill="#FCC419"/><circle cx="72" cy="89" r="5" fill="#fff"/>` + ln('M72 89 V86 M72 89 L74 90', 1.2) + `<rect class="m-ol" style="stroke-width:1.6" x="70.6" y="79.6" width="3" height="2.4" rx=".6" fill="#FCC419"/>` +
      ln('M48 92 Q54 98 62 96 M84 82 Q86 86 84 92', 1.8, '#9775FA') + sparkle(34, 36, 3.5, '#fff') + sparkle(88, 40, 3, '#FFD43B');
  },
  // ── Soñador ──
  'Cazamariposas': () =>
    `<path class="m-ol" d="M14 84 Q60 74 106 84 V112 H14Z" fill="#8CE99A"/>` + ln('M28 88 l-1 -3 M30 88 l1 -3 M88 86 l-1 -3 M90 86 l1 -3', 1.4, '#2F9E44') +
    `<circle class="m-ol" style="stroke-width:1.6" cx="86" cy="92" r="2.4" fill="#FFD43B"/><circle class="m-ol" style="stroke-width:1.6" cx="34" cy="94" r="2" fill="#F783AC"/>` +
    stick('M40 80 L38 90 M46 80 L48 90', '#FFD8B5', 3) +
    `<path class="m-ol" d="M34 82 C34 68 37 64 43 64 C49 64 52 68 52 82Z" fill="#FCC419"/><rect class="m-ol" style="stroke-width:2" x="35" y="76" width="16" height="7" rx="2" fill="#4C6EF5"/>` +
    stick('M48 70 L70 42', '#C97B45', 2.4) +
    `<circle class="m-ol" style="stroke-width:2" cx="49" cy="70" r="3" fill="#FFD8B5"/><circle class="m-ol" style="stroke-width:2" cx="36" cy="70" r="3" fill="#FFD8B5"/>` +
    `<circle class="m-ol" cx="42" cy="54" r="9" fill="#FFD8B5"/>` + eye(44, 54, 1.6) + eye(49, 53, 1.6) + blush(40, 58, 2) + ln('M44 59 Q46.4 60.6 48.6 58.4', 1.3) +
    `<path class="m-ol" style="stroke-width:2" d="M33 52 C32 42 46 40 50 48 L56 48 C56 50 50 50 33 52Z" fill="#E03131"/>` +
    `<g transform="rotate(-32 74 36)"><path class="m-ol" style="stroke-width:1.6" d="M64 37 C64 46 70 52 74 52 C78 52 84 46 84 37" fill="#fff" fill-opacity=".55"/>` + ln('M68 38 L72 50 M74 38 V52 M80 38 L76 50', 1, '#ADB5BD') +
    `<ellipse cx="74" cy="36" rx="10" ry="3.4" fill="none" stroke="${D}" stroke-width="4.6"/><ellipse cx="74" cy="36" rx="10" ry="3.4" fill="none" stroke="#DEE2E6" stroke-width="2"/></g>` +
    `<g transform="translate(84 58) rotate(14)"><ellipse class="m-ol" style="stroke-width:1.8" cx="-9" cy="-4" rx="7" ry="5" fill="#F783AC" transform="rotate(-30 -9 -4)"/><ellipse class="m-ol" style="stroke-width:1.8" cx="9" cy="-4" rx="7" ry="5" fill="#F783AC" transform="rotate(30 9 -4)"/>` +
    `<ellipse class="m-ol" style="stroke-width:1.6" cx="-8" cy="5" rx="4.4" ry="3.4" fill="#B197FC"/><ellipse class="m-ol" style="stroke-width:1.6" cx="8" cy="5" rx="4.4" ry="3.4" fill="#B197FC"/></g>` +
    dcard(84, 58, 14, .62, '#4C6EF5', DC_MOON) + ln('M72 70 q-3 3 -6 1 M76 76 q-3 3 -6 1', 1.4, '#ADB5BD'),
  'Globo aerostático': u => {
    const E = 'M60 24 C82 24 90 40 85 54 C81 64 70 72 66 76 H54 C50 72 39 64 35 54 C30 40 38 24 60 24Z';
    return blob([[26, 88, 6], [34, 84, 7], [42, 89, 5]], '#fff', 2) + blob([[82, 92, 6], [90, 88, 7], [97, 93, 5]], '#fff', 2) +
      ln('M56 76 L55 84 M64 76 L65 84', 1.4) +
      `<defs><clipPath id="g${u}"><path d="${E}"/></clipPath></defs><g clip-path="url(#g${u})">` +
      `<rect x="30" y="20" width="60" height="60" fill="#FF8787"/><ellipse cx="60" cy="52" rx="20" ry="34" fill="#FFD43B"/><ellipse cx="60" cy="52" rx="12.5" ry="34" fill="#4DABF7"/><ellipse cx="60" cy="52" rx="5" ry="34" fill="#B197FC"/>` +
      `<path d="M30 40 Q60 46 90 40 M30 58 Q60 64 90 58" stroke="${D}" stroke-width="1.6" fill="none"/>` +
      `<path d="M30 40 Q60 46 90 40 V58 Q60 64 90 58" fill="none"/>` +
      `<g fill="#fff"><polygon points="${starPts(43, 34, 3.4)}"/><circle cx="53" cy="50" r="2.4"/><path d="M72 69 l2 -4 l2 4Z"/></g>` +
      heart(76, 33, 2.6, '#E03131', 0) + `<path d="${crescent(66, 51, 3.4, 1.4, -1.2, 3)}" fill="#fff"/>` + `<circle cx="44" cy="66" r="1.8" fill="#7048E8"/><path d="M60 30 l2 3 l-2 3 l-2 -3Z" fill="#fff"/>` +
      `</g><path class="m-ol" d="${E}" fill="none"/>` + hl(42, 38, 3, 7, 20, .55) +
      `<rect class="m-ol" x="52" y="82" width="16" height="12" rx="2" fill="#C97B45"/>` + ln('M52 87 H68 M56 82 V94 M60 82 V94 M64 82 V94', 1.1, '#8B5A3C') +
      `<circle class="m-ol" style="stroke-width:2" cx="62" cy="80" r="3.6" fill="#FFD8B5"/>` + ln('M66 79 L70 74', 2.4) + ln('M66 79 L70 74', 1, '#FFD8B5') +
      ln('M24 46 q2 -2 4 0 q2 -2 4 0 M88 30 q2 -2 4 0 q2 -2 4 0', 1.4) + sparkle(94, 60, 3);
  },
  'Dueño de la luna': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#283161"/>` +
    [[30, 34, 1.2], [44, 26, .9], [90, 70, 1.1], [24, 60, .9], [94, 46, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') +
    `<path class="m-ol" d="M26 90 C26 84 94 84 94 90 V96 H26Z" fill="#C97B45"/><ellipse class="m-ol" cx="60" cy="88" rx="34" ry="5" fill="#E8A54B"/>` +
    card(48, 88, -70, 'h', .4, 'A') + card(66, 87, 80, 's', .4, 'K') + mini(78, 84, .26, '#40C057', false) +
    ln('M34 46 V78', 1, '#E9ECEF') + `<path d="M34 78 C34 82 31 82 31 80" stroke="${D}" stroke-width="1.4" fill="none"/>` +
    dcard(33, 80, 8, .42, '#B197FC', DC_KEY) +
    `<path class="m-ol" d="${crescent(64, 46, 26, -11, -11, 23)}" fill="#FFE066"/>` + `<circle cx="78" cy="56" r="2.6" fill="#FCC419"/><circle cx="72" cy="66" r="1.8" fill="#FCC419"/>` +
    ln('M68 46 Q70 47.6 72 46', 1.4) + blush(76, 49, 2) +
    stick('M54 54 L34 46', '#C97B45', 1.8) +
    `<path class="m-ol" style="stroke-width:2" d="M50 56 C48 50 50 44 56 44 C60 44 62 50 60 56Z" fill="#74C0FC"/>` +
    stick('M52 56 L46 64 M58 56 L56 66', '#74C0FC', 3) +
    `<circle class="m-ol" style="stroke-width:2" cx="55" cy="40" r="5.4" fill="#FFD8B5"/>` + ln('M53 40 Q54 41 55 40 M57 40 Q58 41 59 40', 1) +
    `<path class="m-ol" style="stroke-width:2" d="M49.6 39 C50 32 58 30 61 36 C62 38 66 40 68 44 C64 42 60 38 49.6 39Z" fill="#4C6EF5"/><circle class="m-ol" style="stroke-width:1.6" cx="68.4" cy="45" r="2" fill="#fff"/>` +
    `<circle class="m-ol" style="stroke-width:1.6" cx="52" cy="53" r="2" fill="#FFD8B5"/>` +
    sparkle(86, 30, 3.4) + sparkle(38, 62, 2.4, '#fff'),

  // ══ MONOPOLY ══
  // ── Prontuario ──
  'Traje a rayas': u =>
    ln('M60 34 V30 C60 24 67 24 67 28', 2.6) + stick('M32 44 L60 34 L88 44', '#ADB5BD', 2.6) +
    stripes(`tr${u}`, 'M45 38 L34 44 L24 56 L32 64 L38 58 V88 H82 V58 L88 64 L96 56 L86 44 L75 38 C71 45 49 45 45 38Z', 20, 38, 100, 92, 7) +
    `<path class="m-ol" style="stroke-width:2" d="M45 38 C49 45 71 45 75 38 L70 36 C66 40 54 40 50 36Z" fill="#fff"/>` +
    `<rect class="m-ol" style="stroke-width:1.8" x="62" y="56" width="16" height="9" rx="1.5" fill="#fff"/>` + t(70, 63.4, 6.5, '1702', D) +
    `<g fill="none" stroke="${D}" stroke-width="2">` + [[80, 88], [83, 91.5], [86.4, 94]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6" transform="rotate(${i % 2 ? -20 : 40} ${x} ${y})"/>`).join('') + `</g>` +
    `<circle class="m-ol" cx="66" cy="94" r="8" fill="#343A40"/>` + hl(63, 91, 2.4, 1.4, -40, .55) +
    `<path d="M74 94 C78 96 82 94 86 94" stroke="${D}" stroke-width="2" fill="none" stroke-dasharray="2.4 1.2"/>` +
    sparkle(28, 36, 3.4) + sparkle(92, 32, 3, '#fff'),
  'Preso VIP': u =>
    `<rect x="0" y="0" width="120" height="130" fill="#DEE2E6"/><path class="m-ol" d="M14 84 H106 V112 H14Z" fill="#ADB5BD"/>` +
    ln('M20 50 H34 M26 44 V50 M80 36 H100 M90 30 V36', 1, '#CED4DA') +
    `<rect class="m-ol" x="50" y="24" width="20" height="14" rx="1.5" fill="#A5D8FF"/>` + ln('M55 24 V38 M60 24 V38 M65 24 V38', 2.2) +
    `<rect class="m-ol" x="24" y="58" width="14" height="28" rx="2" fill="#fff"/><path class="m-ol" style="stroke-width:2" d="M24 68 H38" fill="none"/>` + ln('M35 61 V65 M35 71 V77', 1.8) +
    `<circle cx="29" cy="76" r="1.8" fill="#F06595"/><rect x="27" y="62" width="3" height="3" fill="#FCC419" transform="rotate(12 28 63)"/>` +
    stick('M78 66 L76 84 M90 66 L92 84', '#495057', 2) +
    `<rect class="m-ol" x="72" y="48" width="24" height="18" rx="3" fill="#343A40"/><rect x="75" y="51" width="18" height="12" rx="1.5" fill="#51CF66"/>` + ln('M84 51 V63', 1, '#fff') + `<circle cx="84" cy="57" r="2.4" fill="none" stroke="#fff" stroke-width="1"/>` +
    ln('M80 48 L76 42 M88 48 L92 42', 1.6) +
    `<path class="m-ol" d="M40 86 V62 C40 54 64 54 64 62 V86Z" fill="#E03131"/>` +
    stripes(`pv${u}`, 'M46 74 C44 64 48 60 52 60 C58 60 60 64 60 70 L80 70 C82 70 82 78 80 78 H50 C47 78 46 76 46 74Z', 40, 60, 84, 80, 4.4) +
    `<path class="m-ol" d="M36 70 H44 V88 H36Z M62 74 H68 V88 H62Z" fill="#C92A2A"/><path class="m-ol" d="M42 78 H64 V86 H42Z" fill="#FA5252"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M78 69 C78 64 88 64 88 69 C88 72 78 72 78 69Z M78 77 C78 74 86 72 88 76 C88 80 78 80 78 77Z" fill="#F783AC"/>` +
    `<circle class="m-ol" cx="52" cy="52" r="8" fill="#F4BE8F"/>` + ln('M48 52 Q50 50 52 52 M54 52 Q56 50 58 52', 1.4) + ln('M50 56 Q53 58.4 56 56', 1.4) + blush(48, 55, 1.8) +
    `<path class="m-ol" style="stroke-width:2" d="M44 50 C44 42 60 42 60 50Z" fill="#fff"/>` + ln('M45 47 H59', 2.2, '#212529') +
    `<g transform="translate(64 58) scale(.42)">` + stick('M4 -12 L14 -30', '#CED4DA', 2.4) + `<path class="m-ol" style="stroke-width:6" d="M-13 -10 C-17 0 -14 14 0 15 C14 14 17 0 13 -10Z" fill="#9C6644"/><ellipse class="m-ol" style="stroke-width:6" cx="0" cy="-10" rx="13" ry="4" fill="#5C940D"/></g>` +
    `<circle class="m-ol" style="stroke-width:2" cx="61" cy="62" r="2.8" fill="#F4BE8F"/>` + sparkle(92, 34, 3) + t(30, 36, 8, '★', '#FCC419'),
  'Rey del penal': u => {
    const mat = (x: number, y: number, w: number, c: string) => `<rect class="m-ol" x="${x}" y="${y}" width="${w}" height="9" rx="4" fill="${c}"/>` +
      `<path d="${Array.from({ length: Math.floor(w / 5) - 1 }, (_, i) => `M${x + 5 + i * 5} ${y + 1.6} V${y + 7.4}`).join(' ')}" stroke="#4DABF7" stroke-width="1" opacity=".7"/>` +
      `<circle cx="${x + w * .3}" cy="${y + 4.5}" r=".9" fill="${D}"/><circle cx="${x + w * .7}" cy="${y + 4.5}" r=".9" fill="${D}"/>`;
    return mat(26, 86, 68, '#F8F9FA') + mat(30, 77, 62, '#FFF3BF') + mat(28, 68, 64, '#F8F9FA') +
      stripes(`rp${u}`, 'M52 66 H60 V80 H52Z M62 66 H70 V80 H62Z', 50, 60, 72, 82, 4) +
      `<path class="m-ol" style="stroke-width:2" d="M50 80 H60 V84 H48Z M62 80 H72 L74 84 H62Z" fill="#495057"/>` +
      stripes(`rb${u}`, 'M42 68 C40 50 46 44 60 44 C74 44 80 50 78 68Z', 38, 44, 82, 70, 5) +
      stick('M76 54 L84 40', '#CED4DA', 2.4) + `<ellipse class="m-ol" style="stroke-width:2" cx="85" cy="37" rx="3.4" ry="4.6" fill="#DEE2E6" transform="rotate(30 85 37)"/>` +
      `<circle class="m-ol" style="stroke-width:2" cx="77" cy="55" r="3.4" fill="#F4BE8F"/><circle class="m-ol" style="stroke-width:2" cx="44" cy="62" r="3.4" fill="#F4BE8F"/>` +
      `<circle class="m-ol" cx="60" cy="38" r="10" fill="#F4BE8F"/>` +
      `<path d="M53 37 H58 M62 37 H67" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M53.4 37 A2.3 2.3 0 0 0 57.6 37Z M62.4 37 A2.3 2.3 0 0 0 66.6 37Z" fill="${D}"/>` +
      ln('M56 43 Q60 46 64 42', 1.6) + blush(53, 42, 2) + blush(67, 42, 2) + `<g fill="#868E96" opacity=".6"><circle cx="57" cy="46" r=".7"/><circle cx="60" cy="47" r=".7"/><circle cx="63" cy="46" r=".7"/></g>` +
      `<path class="m-ol" style="stroke-width:2" d="M49 32 V22 L53 27 L57 19 L60 26 L63 19 L67 27 L71 22 V32Z" fill="#D9A066"/>` + ln('M51 29 H69', 1, '#B5651D') +
      sparkle(32, 46, 3.4) + sparkle(90, 58, 3, '#fff') + star(36, 32, 3, '#FFD43B', 1.4);
  },
  // ── Magnate hotelero ──
  'Pensión familiar': () =>
    blob([[78, 22, 3.4], [83, 18, 3]], '#E9ECEF', 1.6) + `<rect class="m-ol" x="72" y="28" width="8" height="12" fill="#C0532F"/>` +
    `<path class="m-ol" d="M24 54 L60 26 L96 54Z" fill="#E03131"/>` + ln('M36 46 L42 48 M50 38 L56 40 M64 40 L70 38 M76 46 L82 44', 1.4, '#A61E1E') +
    `<path class="m-ol" d="M32 52 H88 V94 H32Z" fill="#FFE8CC"/>` +
    `<rect class="m-ol" x="64" y="70" width="16" height="24" rx="1.5" fill="#2F9E44"/><circle cx="76" cy="83" r="1.4" fill="#FCC419"/>` + ln('M66 74 H78', 1.2, '#51CF66') +
    `<rect class="m-ol" x="37" y="68" width="20" height="16" rx="1.5" fill="#A5D8FF"/>` + `<path d="M37 68 Q42 74 40 84 H37Z M57 68 Q52 74 54 84 H57Z" fill="#FF8FA3"/>` +
    `<ellipse class="m-ol" style="stroke-width:1.6" cx="47" cy="84" rx="9" ry="2.4" fill="#fff"/>` + medialuna(43, 81, .6, -8) + medialuna(51, 81, .6, 8) +
    `<rect class="m-ol" x="35" y="84" width="24" height="3" rx="1" fill="#C97B45"/>` +
    ln('M46 62 V58 M74 62 V58', 1.4) + `<rect class="m-ol" x="38" y="55" width="44" height="11" rx="2" fill="#fff"/>` + t(60, 63.6, 8.4, 'PENSIÓN', '#E03131', 'textLength="34" lengthAdjust="spacingAndGlyphs"') +
    `<path class="m-ol" style="stroke-width:2" d="M84 88 H92 L91 95 H85Z" fill="#E8590C"/><circle cx="86" cy="85" r="2" fill="#F06595"/><circle cx="90" cy="84" r="2" fill="#FCC419"/>` +
    `<path class="m-ol" d="M22 94 H98" fill="none"/>` + sparkle(30, 40, 3) + heart(92, 70, 3, '#FF8FA3', 1.4),
  'Hotel en Mar del Plata': () =>
    `<rect x="0" y="0" width="120" height="70" fill="#D0EBFF"/><circle class="m-ol" style="stroke-width:2" cx="88" cy="34" r="6" fill="#FFD43B"/>` +
    `<path class="m-ol" d="M38 34 L42 26 H78 L82 34Z" fill="#495057"/>` +
    `<rect class="m-ol" x="38" y="34" width="44" height="34" fill="#C0532F"/>` +
    [0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${42 + c * 8}" y="${38 + r * 7}" width="4" height="4" rx=".6" fill="#FFF3BF"/>`).join('')).join('') +
    `<rect class="m-ol" style="stroke-width:2" x="56" y="58" width="8" height="10" fill="#6B3E1F"/>` + ln('M44 28 V24 M76 28 V24', 1.6) +
    `<path class="m-ol" d="M14 66 H106 V84 H14Z" fill="#FFE8A8"/>` +
    `<path class="m-ol" d="M24 56 C24 48 42 48 42 56Z" fill="#fff"/><path d="M27.6 54.5 C28 51 30 49.6 33 49.6 V56 H27.6Z M33 49.6 C36 49.6 38 51 38.4 54.5 V56 H33Z" fill="#E03131" clip-path="none"/>` +
    `<path class="m-ol" d="M24 56 C24 48 42 48 42 56Z" fill="none"/>` + ln('M33 56 V76', 2) +
    `<path class="m-ol" d="M80 58 C80 50 98 50 98 58Z" fill="#FCC419"/><path d="M86 52 V58 M92 52 V58" stroke="#4DABF7" stroke-width="3"/><path class="m-ol" d="M80 58 C80 50 98 50 98 58Z" fill="none"/>` + ln('M89 58 V76', 2) +
    `<rect class="m-ol" style="stroke-width:2" x="76" y="74" width="16" height="4" rx="2" fill="#4DABF7"/>` +
    `<path class="m-ol" d="M54 84 C50 78 52 68 58 62 C60 60 62 58 62 54 C62 50 68 50 70 54 C72 58 70 64 66 70 C66 76 70 80 72 84Z" fill="#8B5A3C"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M54 84 C50 82 46 84 46 86 H56Z M66 84 C70 82 76 84 76 86 H64Z" fill="#6B3E1F"/>` +
    `<circle cx="66" cy="54" r="1.4" fill="${D}"/><ellipse class="m-ol" style="stroke-width:1.4" cx="70.6" cy="57" rx="2.4" ry="1.6" fill="#C9824F"/>` + ln('M72 56 L77 54 M72 58 L77 59', .9) + blush(64, 58, 1.6) +
    waves(84, '#4DABF7', 2.4, 12) + ln('M24 92 q3 -2 6 0 M80 94 q3 -2 6 0', 1.4, '#fff'),
  'Llao Llao': () =>
    `<rect x="0" y="0" width="120" height="80" fill="#D0EBFF"/>` +
    `<path class="m-ol" d="M14 68 L36 34 L50 50 L66 26 L84 50 L96 38 L110 58 V74 H14Z" fill="#868E96"/>` +
    `<path d="M30 43 L36 34 L42 42 L38 41 L34 45Z M60 34 L66 26 L73 36 L69 35 L65 38 L62 35Z M92 43 L96 38 L101 45 L97 44Z" fill="#fff"/>` +
    `<path class="m-ol" d="M14 72 Q40 58 60 64 T110 66 V84 H14Z" fill="#2F9E44"/>` +
    [[28, 66], [34, 64], [88, 64], [94, 66]].map(([x, y]) => `<path class="m-ol" style="stroke-width:1.6" d="M${x} ${y - 12} L${x + 4} ${y} H${x - 4}Z" fill="#2B8A3E"/>`).join('') +
    `<rect class="m-ol" x="42" y="52" width="36" height="18" fill="#FFE8CC"/><rect class="m-ol" style="stroke-width:2" x="42" y="64" width="36" height="6" fill="#ADB5BD"/>` +
    ln('M48 54 V64 M72 54 V64', 1.4, '#B5651D') +
    `<path class="m-ol" d="M38 54 L45 44 H75 L82 54Z" fill="#2B8A3E"/>` +
    `<rect class="m-ol" x="54" y="36" width="12" height="18" fill="#FFE8CC"/><path class="m-ol" d="M52 38 L60 26 L68 38Z" fill="#2B8A3E"/>` +
    `<rect x="58" y="41" width="4" height="5" rx=".6" fill="#FCC419"/>` + [46, 52, 66, 72].map((x) => `<rect x="${x - 1.6}" y="56" width="3.2" height="4" rx=".6" fill="#FCC419"/>`).join('') +
    waves(76, '#339AF0', 2, 12) + `<path d="M52 82 H68 M56 86 H64" stroke="#A5D8FF" stroke-width="1.6" stroke-linecap="round"/>` +
    ln('M26 88 q3 -2 6 0 M84 90 q3 -2 6 0', 1.4, '#A5D8FF') +
    `<g transform="translate(36 86)"><path class="m-ol" style="stroke-width:1.8" d="M-6 0 H6 L4 3 H-4Z" fill="#fff"/><path d="M0 0 V-8" stroke="${D}" stroke-width="1.2"/><path class="m-ol" style="stroke-width:1.4" d="M0 -8 L5 -2 H0Z" fill="#fff"/></g>` +
    sparkle(84, 30, 3) + sparkle(40, 26, 2.6, '#fff'),
  // ── Usurero ──
  'Martillero': () =>
    stick('M66 52 L64 92 M86 52 L88 92', '#8B5A3C', 3) + stick('M69 76 L68 92 M83 76 L84 92', '#B5651D', 2.6) +
    `<path class="m-ol" d="M64 46 C64 38 88 38 88 46 V60 H64Z" fill="#C97B45"/>` + ln('M70 44 V58 M76 43 V58 M82 44 V58', 1.4, '#8B5A3C') +
    `<path class="m-ol" d="M60 72 H92 L90 78 H62Z" fill="#E8590C"/>` +
    ln('M70 42 L64 50', 1.2) +
    `<g transform="rotate(-14 60 56)"><rect class="m-ol" style="stroke-width:2" x="44" y="50" width="22" height="11" rx="1.5" fill="#fff"/>` + t(55, 58.4, 7, 'VENDIDO', '#E03131', 'textLength="18" lengthAdjust="spacingAndGlyphs"') + `<circle cx="64" cy="52.4" r="1" fill="${D}"/></g>` +
    `<g transform="translate(9 -2)"><rect class="m-ol" x="26" y="86" width="26" height="7" rx="2" fill="#8B5A3C"/>` +
    `<polygon class="m-ol" style="stroke-width:2" points="${starPts(39, 84, 11, 5.6, 8)}" fill="#FFD43B"/>` +
    `<g transform="rotate(-38 38 74)">` + stick('M38 70 L38 36', '#C97B45', 3.6) +
    `<rect class="m-ol" x="27" y="66" width="22" height="12" rx="3" fill="#8B5A3C"/><rect class="m-ol" style="stroke-width:2" x="25" y="66" width="4" height="12" rx="1.4" fill="#FCC419"/><rect class="m-ol" style="stroke-width:2" x="47" y="66" width="4" height="12" rx="1.4" fill="#FCC419"/>` + hl(36, 69, 5, 1.2, 0, .5) + `</g></g>` +
    ln('M30 64 L35 68 M28 74 L34 76', 2) + t(58, 32, 8, '¡A la una!', '#868E96', 'textLength="30" lengthAdjust="spacingAndGlyphs"'),
  'Corralito': () =>
    `<path class="m-ol" d="M26 42 L60 24 L94 42Z" fill="#E9ECEF"/>` + t(60, 39, 7.4, 'BANCO', '#495057', 'textLength="24" lengthAdjust="spacingAndGlyphs"') +
    `<rect class="m-ol" x="26" y="42" width="68" height="6" fill="#CED4DA"/>` +
    `<rect class="m-ol" x="28" y="48" width="8" height="40" fill="#F8F9FA"/><rect class="m-ol" x="84" y="48" width="8" height="40" fill="#F8F9FA"/>` + ln('M31 52 V84 M87 52 V84', 1.2, '#ADB5BD') +
    `<rect class="m-ol" x="38" y="48" width="44" height="40" fill="#495057"/>` +
    coin(46, 82, 4.6) + coin(55, 82, 4.6) + coin(64, 82, 4.6) + coin(73, 82, 4.6) + coin(50, 75, 4.6) + coin(59, 75, 4.6) + coin(68, 75, 4.6) + coin(55, 68, 4.4) + coin(64, 68, 4.4) +
    ln('M44 48 V88 M51 48 V88 M58 48 V88 M65 48 V88 M72 48 V88 M78 48 V88', 3.6) + ln('M44 48 V88 M51 48 V88 M58 48 V88 M65 48 V88 M72 48 V88 M78 48 V88', 1.6, '#ADB5BD') +
    `<path d="M38 52 L82 84 M82 52 L38 84" stroke="${D}" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 1.4"/><path d="M38 52 L82 84 M82 52 L38 84" stroke="#868E96" stroke-width="2.6" stroke-dasharray="3 1.4"/>` +
    `<path d="M55 64 C55 56 65 56 65 64" fill="none" stroke="${D}" stroke-width="5"/><path d="M55 64 C55 56 65 56 65 64" fill="none" stroke="#CED4DA" stroke-width="2.4"/>` +
    `<rect class="m-ol" x="52" y="63" width="16" height="13" rx="2.4" fill="#FCC419"/><circle cx="60" cy="68" r="1.8" fill="${D}"/><path d="M60 69 V72.6" stroke="${D}" stroke-width="1.6"/>` +
    `<rect class="m-ol" x="22" y="88" width="76" height="5" fill="#CED4DA"/><rect class="m-ol" x="18" y="93" width="84" height="6" fill="#ADB5BD"/>` +
    sparkle(30, 32, 3) + `<path class="m-ol" style="stroke-width:1.6" d="M90 30 C92 34 93 36 93 37.6 A3 3 0 0 1 87 37.6 C87 36 88 34 90 30Z" fill="#74C0FC"/>`,
  'Tío Rico': u =>
    `<rect x="0" y="0" width="120" height="130" fill="#E9ECEF"/><circle class="m-ol" cx="60" cy="40" r="22" fill="#CED4DA"/><circle cx="60" cy="40" r="16" fill="none" stroke="#ADB5BD" stroke-width="2"/>` + t(60, 47, 20, '$', '#ADB5BD') +
    `<defs><clipPath id="t${u}"><path d="M14 104 C20 74 40 66 60 66 C80 66 100 74 106 104Z"/></clipPath></defs>` +
    `<path class="m-ol" d="M14 104 C20 74 40 66 60 66 C80 66 100 74 106 104Z" fill="#FAB005"/>` +
    `<g clip-path="url(#t${u})">${[[30, 86], [42, 78], [56, 72], [70, 74], [84, 80], [94, 90], [36, 96], [50, 88], [64, 84], [78, 92], [24, 98], [60, 98]].map(([x, y]) => coin(x, y, 5.4)).join('')}</g>` +
    `<g transform="translate(60 52) rotate(172)">` +
    `<path class="m-ol" style="stroke-width:2" d="M-5 16 L-9 24 L-3 22 L-1 26 L0 18Z M5 16 L9 24 L3 22 L1 26 L0 18Z" fill="#FF922B"/>` +
    `<ellipse class="m-ol" cx="0" cy="4" rx="9" ry="12" fill="#fff"/>` +
    `<path class="m-ol" d="M-9.4 2 C-10 12 -6 16 -2 18 L0 12 L2 18 C6 16 10 12 9.4 2 C6 -2 -6 -2 -9.4 2Z" fill="#1971C2"/>` +
    stick('M-6 -6 L-4 -24 M6 -6 L4 -24', '#fff', 3.4) +
    `<circle class="m-ol" cx="0" cy="-12" r="7.4" fill="#fff"/><ellipse class="m-ol" style="stroke-width:1.8" cx="0" cy="-7" rx="5.6" ry="2.6" fill="#FF922B"/>` +
    ln('M-4.4 -14 Q-2.6 -12.4 -0.8 -14 M0.8 -14 Q2.6 -12.4 4.4 -14', 1.3) + `</g>` +
    coin(48, 62, 3.6) + coin(74, 60, 3.6) + coin(42, 70, 3) + coin(80, 68, 3) +
    `<g transform="translate(32 34) rotate(-28)"><rect class="m-ol" x="-6" y="-12" width="12" height="12" rx="1" fill="#212529"/><rect class="m-ol" style="stroke-width:2" x="-10" y="-1.4" width="20" height="3.4" rx="1.6" fill="#212529"/><rect x="-6" y="-4.4" width="12" height="2.6" fill="#E03131"/></g>` +
    `<circle cx="88" cy="40" r="3.6" fill="#fff" fill-opacity=".5" stroke="${D}" stroke-width="1.6"/>` + ln('M86 43.4 C84 48 88 50 84 56', 1, '#868E96') + sparkle(90, 58, 3) + sparkle(28, 58, 3, '#fff'),

  // ══ SMASH ══
  // ── Luchador ──
  'Guante de box': () =>
    ln('M26 40 H36 M30 76 H40', 2.6) +
    `<polygon class="m-ol" points="${starPts(83, 58, 14, 8, 9, -90)}" fill="#FFD43B"/>` + t(83, 61, 8, 'PUM', '#E03131', 'textLength="14" lengthAdjust="spacingAndGlyphs"') +
    glove(51, 58, 1.1) + sparkle(84, 34, 3.4) + sparkle(36, 84, 3, '#fff'),
  'Titanes en el Ring': () =>
    `<path d="M50 14 L70 14 L92 100 H28Z" fill="#FFF3BF" opacity=".8"/>` +
    `<path class="m-ol" d="M14 84 H106 V112 H14Z" fill="#4DABF7"/><path d="M14 90 H106" stroke="#1C7ED6" stroke-width="2"/>` +
    `<rect class="m-ol" x="22" y="50" width="6" height="40" rx="2" fill="#ADB5BD"/><rect class="m-ol" x="92" y="50" width="6" height="40" rx="2" fill="#ADB5BD"/>` +
    stick('M24 58 H96', '#E03131', 2.2) + stick('M24 67 H96', '#fff', 2.2) + stick('M24 76 H96', '#1C7ED6', 2.2) +
    `<path class="m-ol" d="M46 48 L34 90 H86 L74 48Z" fill="#7048E8"/><path d="M38 86 H82" stroke="#FCC419" stroke-width="2.4"/>` +
    stick('M54 80 V92 M66 80 V92', '#F4BE8F', 5) + `<path class="m-ol" style="stroke-width:2" d="M50 86 H58 V94 H50Z M62 86 H70 V94 H62Z" fill="#E03131"/>` +
    stick('M47 52 L36 54 L36 42 M73 52 L84 54 L84 42', '#F4BE8F', 6) + `<circle class="m-ol" cx="36" cy="40" r="4" fill="#F4BE8F"/><circle class="m-ol" cx="84" cy="40" r="4" fill="#F4BE8F"/>` +
    `<path class="m-ol" d="M46 50 C46 46 74 46 74 50 L70 72 H50Z" fill="#F4BE8F"/>` + ln('M54 56 Q57 58 60 56 Q63 58 66 56 M60 60 V68', 1.2, '#C9824F') +
    `<path class="m-ol" d="M50 70 H70 L69 82 H51Z" fill="#FCC419"/>` + `<circle class="m-ol" style="stroke-width:2" cx="60" cy="72" r="3" fill="#fff"/>` +
    `<circle class="m-ol" cx="60" cy="38" r="9.4" fill="#E03131"/>` +
    `<path d="M52 37 C53 33 57 33 58 37 C57 39 53 39 52 37Z M68 37 C67 33 63 33 62 37 C63 39 67 39 68 37Z" fill="#fff"/>` +
    `<circle cx="55.6" cy="36.6" r="1.4" fill="${D}"/><circle cx="64.4" cy="36.6" r="1.4" fill="${D}"/><polygon points="${starPts(60, 31.6, 2.6)}" fill="#FCC419"/>` +
    `<path d="M56 43 Q60 45.6 64 43" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
    ln('M86 14 V24', 1.6) + `<rect class="m-ol" x="81" y="24" width="10" height="13" rx="5" fill="#CED4DA"/>` + ln('M83 28 H89 M83 31 H89', 1, '#868E96') +
    sparkle(30, 36, 3.4) + sparkle(94, 46, 2.6, '#fff'),
  'Mano Maestra': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#2B2155"/>` + [[28, 40, 1.2], [90, 30, 1], [94, 66, 1.2], [26, 72, .9], [80, 82, .8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') +
    `<path class="m-ol" d="M24 86 H96 L90 94 H30Z" fill="#495057"/><path d="M26 86 H94" stroke="#66D9E8" stroke-width="2"/>` +
    ln('M44.5 58 L42 69 M54 59 L37 78 M66 59 L76 69 M75.5 57 L83 78', .9, '#E9ECEF') +
    mini(42, 77, .36, '#E03131', true, -10) + mini(78, 77, .36, '#4DABF7', true, 12) +
    [44.5, 54, 66, 75.5].map((x, i) => `<rect class="m-ol" x="${x - 4.4}" y="${40 + (i % 3 ? 2 : 0)}" width="8.8" height="17" rx="4.4" fill="#fff"/>`).join('') +
    `<path class="m-ol" d="M40 34 C40 28 80 28 80 34 L80 46 C80 50 40 50 40 46Z" fill="#fff"/>` +
    `<path class="m-ol" d="M80 36 C88 34 92 40 90 44 C88 47 84 46 80 44Z" fill="#fff"/>` +
    ln('M50 36 V42 M60 36 V42 M70 36 V42', 1.4, '#DEE2E6') + ln('M46 44 H74', 1.2, '#DEE2E6') +
    `<rect class="m-ol" x="48" y="20" width="24" height="10" rx="3" fill="#F1F3F5"/>` + ln('M52 23 V27 M56 23 V27 M60 23 V27 M64 23 V27 M68 23 V27', 1, '#CED4DA') +
    sparkle(30, 56, 3, '#66D9E8') + sparkle(92, 52, 3, '#FFD43B'),
  // ── Intocable ──
  'Ni despeinado': () =>
    `<path class="m-ol" d="M36 102 C36 86 44 80 56 80 C68 80 76 86 76 102Z" fill="#4DABF7"/><path class="m-ol" d="M48 80 L56 88 L64 80" fill="#fff"/>` +
    `<ellipse class="m-ol" cx="74" cy="60" rx="3.4" ry="5" fill="#F4BE8F"/>` +
    `<circle class="m-ol" cx="56" cy="60" r="19" fill="#F4BE8F"/>` +
    `<path class="m-ol" d="M36 58 C30 36 46 22 66 24 C84 26 88 40 78 48 C74 40 66 40 58 42 C48 44 42 48 38 60Z" fill="#212529"/>` +
    ln('M46 32 C52 28 62 27 70 30 M44 39 C48 35 54 34 60 34', 2, '#fff') +
    ln('M44 58 Q48 54.6 52 58', 2) + eye(64, 57, 2.6) + ln('M43 52 L51 51 M60 50 Q64 48 68 50', 2) + blush(46, 64, 2.6) + blush(70, 64, 2.6) +
    `<path class="m-ol" style="stroke-width:2.2" d="M48 66 Q58 76 68 65 Q58 69 48 66Z" fill="#fff"/>` + sparkle(66, 70, 3.4, '#fff') +
    `<g transform="translate(84 84)"><rect class="m-ol" style="stroke-width:2" x="-7" y="-6" width="14" height="13" rx="3" fill="#C3FAE8"/><rect class="m-ol" style="stroke-width:2" x="-8" y="-10" width="16" height="5" rx="1.6" fill="#20C997"/>` +
    `<rect x="-6" y="-2" width="12" height="5.6" fill="#fff"/>${t(0, 2.4, 4.6, 'GOMINA', '#087F5B', 'textLength="11" lengthAdjust="spacingAndGlyphs"')}</g>` +
    `<g transform="translate(30 82) rotate(-35)"><rect class="m-ol" style="stroke-width:2" x="-10" y="-3" width="20" height="5" rx="1.4" fill="#F06595"/>` + ln('M-8 2 V5.6 M-5 2 V5.6 M-2 2 V5.6 M1 2 V5.6 M4 2 V5.6 M7 2 V5.6', 1.2) + `</g>` +
    sparkle(84, 28, 4) + sparkle(30, 40, 3, '#FFD43B'),
  'Teflón': () =>
    stick('M72 72 L86 86', '#212529', 6) + `<circle cx="84.4" cy="84.4" r="1.4" fill="#fff"/>` +
    `<circle class="m-ol" cx="56" cy="58" r="24" fill="#343A40"/><circle cx="56" cy="58" r="19" fill="#495057"/>` +
    `<path d="M40 50 A17 17 0 0 1 50 41" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".6"/>` +
    `<path d="M48 56 H54 M58 56 H64" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M48.4 56 A2.6 2.6 0 0 0 53.6 56Z M58.4 56 A2.6 2.6 0 0 0 63.6 56Z" fill="#fff"/>` +
    ln('M50 65 Q56 69 62 64', 1.8, '#fff') +
    glove(34, 34, .5, 215) + glove(88, 40, .5, -25) +
    `<polygon class="m-ol" style="stroke-width:1.6" points="${starPts(38, 42, 5, 2.4, 6)}" fill="#FFD43B"/><polygon class="m-ol" style="stroke-width:1.6" points="${starPts(78, 48, 5, 2.4, 6)}" fill="#FFD43B"/>` +
    ln('M24 46 Q28 50 32 48 M94 58 Q90 60 86 58', 1.6),
  'Estrella invencible': () =>
    ['#FF6B6B', '#FFA94D', '#FFE066', '#8CE99A', '#74C0FC', '#B197FC'].map((c, i) => `<circle cx="60" cy="58" r="${40 - i * 4}" fill="none" stroke="${c}" stroke-width="4.2"/>`).join('') +
    `<polygon class="m-ol" style="stroke-width:3" points="${starPts(60, 59, 31, 15)}" fill="#FCC419"/><polygon points="${starPts(60, 60, 22, 11)}" fill="#FFE066"/>` +
    hl(50, 42, 4, 2, -30) +
    `<ellipse cx="54" cy="58" rx="2.6" ry="4.6" fill="${D}"/><ellipse cx="66" cy="58" rx="2.6" ry="4.6" fill="${D}"/><circle cx="54.8" cy="56" r="1" fill="#fff"/><circle cx="66.8" cy="56" r="1" fill="#fff"/>` +
    blush(49, 64, 2.4) + blush(71, 64, 2.4) + ln('M56 65 Q60 68.6 64 65', 1.8) +
    sparkle(28, 32, 4, '#FF8FAB') + sparkle(92, 32, 4, '#74C0FC') + sparkle(26, 84, 3.4, '#8CE99A') + sparkle(94, 86, 3.4, '#FFD43B'),
  // ── Al vacío ──
  'Lemming': () => {
    const lem = (x: number, y: number, s: number, rot: number, step: boolean) =>
      `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
      (step ? stick('M-2 8 L-4 14 M2 8 L8 12', '#FFD8B5', 3) : stick('M-2 8 L-3 14 M2 8 L3 14', '#FFD8B5', 3)) +
      stick('M-5 -2 L-10 4 M5 -2 L10 -6', '#FFD8B5', 2.6) +
      `<path class="m-ol" style="stroke-width:${f(2.4 / s)}" d="M-6 -4 H6 L7 9 H-7Z" fill="#4C6EF5"/>` +
      `<circle class="m-ol" style="stroke-width:${f(2.4 / s)}" cx="0" cy="-10" r="6" fill="#FFD8B5"/>` +
      `<path class="m-ol" style="stroke-width:${f(2 / s)}" d="M-6 -11 C-8 -18 -2 -21 0 -17 C2 -22 9 -18 6 -12 C3 -15 -2 -15 -6 -11Z" fill="#40C057"/>` +
      eye(2, -9.6, 1.2) + ln('M0 -6.4 Q2 -5 4 -6.8', 1) + `</g>`;
    return `<path class="m-ol" d="M14 66 H60 V112 H14Z" fill="#8B5A3C"/><path class="m-ol" d="M14 62 H62 V68 H14Z" fill="#51CF66"/>` +
      `<circle cx="26" cy="80" r="1.6" fill="#6B3E1F"/><circle cx="44" cy="90" r="1.6" fill="#6B3E1F"/><circle cx="34" cy="96" r="1.2" fill="#6B3E1F"/>` +
      ln('M66 70 V80 M74 72 V84 M82 70 V78', 1.6, '#ADB5BD').replace('round"/>', 'round" stroke-dasharray="2 3"/>') +
      lem(32, 49, .9, 0, false) + lem(60, 48, 1.15, 6, true) + lem(82, 90, .8, 160, false) +
      t(86, 72, 8, '¡wii!', '#4C6EF5', 'transform="rotate(-10 86 72)"') + sparkle(86, 36, 3) + sparkle(42, 32, 2.6, '#fff');
  },
  'Salto sin paracaídas': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#A5D8FF"/>` + ln('M30 26 V40 M90 50 V66 M38 70 V88 M82 20 V32', 2.4, '#fff') +
    blob([[28, 54, 5], [34, 50, 6], [41, 54, 5]], '#fff', 2) + blob([[82, 84, 5], [88, 80, 6], [95, 84, 5]], '#fff', 2) +
    `<g transform="translate(60 58) rotate(-14)">` +
    stick('M-5 14 L-12 26 M5 14 L12 26', '#FF922B', 4.4) +
    stick('M-8 -2 L-18 -18 M8 -2 L18 -18', '#FF922B', 4) + `<circle class="m-ol" style="stroke-width:2" cx="-19" cy="-20" r="3.4" fill="#FFD8B5"/><circle class="m-ol" style="stroke-width:2" cx="19" cy="-20" r="3.4" fill="#FFD8B5"/>` +
    `<rect class="m-ol" x="-13" y="-6" width="26" height="20" rx="5" fill="#8B5A3C"/>` +
    `<path class="m-ol" d="M-9 -4 H9 L8 16 H-8Z" fill="#FF922B"/>` + ln('M-6 -4 V10 M6 -4 V10', 2.2, '#6B3E1F') +
    `<path d="M10 6 C16 8 18 14 16 18" stroke="${D}" stroke-width="1.2" fill="none"/><circle class="m-ol" style="stroke-width:1.6" cx="16" cy="19" r="2.4" fill="#E03131"/>` +
    `<circle class="m-ol" cx="0" cy="-14" r="10" fill="#FFD8B5"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M-9 -18 L-11 -28 L-5 -23 L-2 -32 L2 -24 L7 -30 L8 -22 L12 -24 L9 -16 C4 -20 -4 -20 -9 -18Z" fill="#E8590C"/>` +
    `<circle cx="-4" cy="-14" r="3" fill="#fff" stroke="${D}" stroke-width="1.3"/><circle cx="4" cy="-14" r="3" fill="#fff" stroke="${D}" stroke-width="1.3"/><circle cx="-4" cy="-13.6" r="1.2" fill="${D}"/><circle cx="4" cy="-13.6" r="1.2" fill="${D}"/>` +
    `<ellipse class="m-ol" style="stroke-width:1.6" cx="0" cy="-7" rx="2" ry="2.6" fill="#C92A2A"/></g>` +
    t(88, 36, 11, '?!', '#E03131', 'transform="rotate(12 88 36)"'),
  'Coyote': () =>
    `<rect x="0" y="0" width="120" height="130" fill="#FFE8CC"/>` +
    `<path d="M70 104 V82 H84 V74 H100 V104Z" fill="#FFC078"/><path d="M14 104 V96 H30 V104Z" fill="#FFC078"/>` +
    `<path class="m-ol" d="M14 60 H44 L46 66 L42 74 L46 84 L40 96 L44 112 H14Z" fill="#D9480F"/><path class="m-ol" d="M14 58 H45 V64 H14Z" fill="#FF922B"/>` +
    ln('M16 74 L36 74 M16 86 L34 86', 1.6, '#A33A0B') +
    blob([[47, 62, 2.4], [51, 60, 2]], '#E9ECEF', 1.4) +
    `<path class="m-ol" d="M54 76 C46 80 44 88 48 94 C50 90 52 86 56 84Z" fill="#C08552"/>` +
    stick('M60 80 L59 94 M66 80 L67 94', '#C08552', 3.4) +
    `<path class="m-ol" d="M54 64 C54 56 72 56 72 64 L70 82 H56Z" fill="#C08552"/><path d="M58 66 C58 62 68 62 68 66 L67 80 H59Z" fill="#E9C49A"/>` +
    stick('M56 64 L48 58', '#C08552', 3) + stick('M46 64 V46', '#8B5A3C', 1.8) +
    `<rect class="m-ol" x="34" y="34" width="24" height="12" rx="2" fill="#FFF3BF"/>` + t(46, 43.4, 8.4, 'chau', '#E03131') +
    `<circle class="m-ol" style="stroke-width:2" cx="47" cy="57" r="2.6" fill="#C08552"/>` +
    `<path class="m-ol" d="M56 36 L54 22 L62 30Z M64 30 L68 20 L70 32Z" fill="#C08552"/>` +
    `<path class="m-ol" d="M52 44 C52 34 58 30 64 31 C70 32 72 38 72 42 L86 46 C88 48 86 51 84 51 L70 52 C64 56 52 54 52 44Z" fill="#C08552"/>` +
    `<path d="M70 50 L84 50.4 C82 52.4 74 53 70 52Z" fill="#E9C49A"/><circle cx="86" cy="47.6" r="2" fill="${D}"/>` +
    `<path d="M59 42 H65 M67 42 H71" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><path d="M59.4 42 A2.4 2.4 0 0 0 64.6 42Z M67.4 42 A2 2 0 0 0 70.8 42Z" fill="${D}"/>` +
    `<path class="m-ol" style="stroke-width:1.6" d="M57 33 L56 26 L60 30Z" fill="#E9C49A"/>` +
    ln('M60 58 L60 56 M66 58 L66 56', 1, '#A06A3B') + ln('M52 100 q2 -2 4 0 q2 -2 4 0', 1.2, '#ADB5BD'),

};

function flameSmall2(x: number, y: number) {
  return `<path class="m-ol" style="stroke-width:1.6" transform="translate(${x} ${y})" d="M0 0 C-4 -3 -2 -7 0 -10 C1 -7 4 -5 3 -2 C2 0 1 1 0 0Z" fill="#FF922B"/><path transform="translate(${x} ${y})" d="M0 -1 C-1.6 -2 -1 -4 0 -5 C.6 -4 1.4 -3 1 -1.4Z" fill="#FFD43B"/>`;
}
