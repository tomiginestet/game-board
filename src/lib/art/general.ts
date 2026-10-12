// Ilustraciones de las medallas generales (sirven para cualquier juego: de mesa, cartas, videojuegos, deportes).
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Piezas reutilizables ──────────────────────────────────────────────
const MEEPLE = 'M-5 -6 C-10 -8 -9 -21 0 -21 C9 -21 10 -8 5 -6 L16 -4 C22 -3 22 6 16 6 L10 5 L15 19 C16 22 14 23 11 23 L3 23 C2 18 1 15 0 13 C-1 15 -2 18 -3 23 L-11 23 C-14 23 -16 22 -15 19 L-10 5 L-16 6 C-22 6 -22 -3 -16 -4Z'
type Face = 'happy' | 'proud' | 'sleepy' | 'none'
const eyes = (k: Face) =>
  k === 'happy' ? `<circle cx="-3.4" cy="-14" r="1.6" fill="${D}"/><circle cx="3.4" cy="-14" r="1.6" fill="${D}"/><path d="M-3 -10.2 Q0 -7.6 3 -10.2" fill="none" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/>`
  : k === 'proud' ? `<path d="M-5 -13.6 Q-3.4 -15.8 -1.8 -13.6 M1.8 -13.6 Q3.4 -15.8 5 -13.6 M-2.6 -10.4 Q0 -7.8 2.6 -10.4" fill="none" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/>`
  : k === 'sleepy' ? `<path d="M-5 -13.6 H-1.8 M1.8 -13.6 H5" stroke="${D}" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="0" cy="-9.6" rx="1.4" ry="1.1" fill="${D}"/>`
  : '';
/** Meeple centrado en (x,y); mide ~42 de alto con s=1. */
const meeple = (x: number, y: number, s: number, fill: string, face: Face = 'happy', rot = 0, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="m-ol" style="stroke-width:${f(2.6 / s)}" d="${MEEPLE}" fill="${fill}"/>` +
  `<ellipse cx="-4" cy="-17" rx="2.2" ry="1.4" fill="#fff" opacity=".7" transform="rotate(-30 -4 -17)"/><path d="M-15 -1 L-9 -2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>` +
  (face !== 'none' ? `<circle cx="-6" cy="-11.5" r="1.7" fill="#FF8FA3" opacity=".7"/><circle cx="6" cy="-11.5" r="1.7" fill="#FF8FA3" opacity=".7"/>` : '') +
  eyes(face) + extra + `</g>`;
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};
/** Dado plano de lado s. */
const die = (x: number, y: number, s: number, n: number, fill = '#fff', pip = D, rot = 0, sw = 2.6) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect class="m-ol" style="stroke-width:${sw}" x="${f(-s / 2)}" y="${f(-s / 2)}" width="${s}" height="${s}" rx="${f(s * .22)}" fill="${fill}"/>` +
  `<path d="M${f(-s * .3)} ${f(-s * .34)} H${f(s * .05)}" stroke="#fff" stroke-width="${f(s * .08)}" stroke-linecap="round" opacity=".6"/>` +
  PIPS[n].map(([a, b]) => `<circle cx="${f(a * s * .26)}" cy="${f(b * s * .26)}" r="${f(s * .09)}" fill="${pip}"/>`).join('') + `</g>`;
/** Dado en perspectiva (cubo isométrico); (x,y) es la arista frontal superior. */
const cube = (x: number, y: number, s: number, c: [string, string, string] = ['#fff', '#F1E3CF', '#DCC6A8'], pip = D) => {
  const k = f(s * .87), h = f(s / 2), face = (ox: number, oy: number, ux: number, uy: number, vx: number, vy: number, pts: [number, number][]) =>
    `<g transform="matrix(${ux} ${uy} ${vx} ${vy} ${f(ox)} ${f(oy)})">${pts.map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".11" fill="${pip}"/>`).join('')}</g>`;
  return `<path d="M${x} ${f(y - s)} L${f(x + k)} ${f(y - h)} L${x} ${y} L${f(x - k)} ${f(y - h)}Z" fill="${c[0]}"/>` +
    `<path d="M${f(x - k)} ${f(y - h)} L${x} ${y} L${x} ${f(y + s)} L${f(x - k)} ${f(y + h)}Z" fill="${c[1]}"/>` +
    `<path d="M${x} ${y} L${f(x + k)} ${f(y - h)} L${f(x + k)} ${f(y + h)} L${x} ${f(y + s)}Z" fill="${c[2]}"/>` +
    face(x - k, y - h, k, -h, k, h, [[.5, .5]]) + face(x - k, y - h, k, h, 0, s, [[.27, .27], [.73, .73]]) + face(x, y, k, -h, 0, s, [[.27, .27], [.5, .5], [.73, .73]]) +
    `<path class="m-ol" d="M${x} ${f(y - s)} L${f(x + k)} ${f(y - h)} L${f(x + k)} ${f(y + h)} L${x} ${f(y + s)} L${f(x - k)} ${f(y + h)} L${f(x - k)} ${f(y - h)}Z M${f(x - k)} ${f(y - h)} L${x} ${y} L${f(x + k)} ${f(y - h)} M${x} ${y} V${f(y + s)}" fill="none"/>`;
};
/** Carta de póker centrada, con un corazón (o pica) en el medio. */
const card = (x: number, y: number, rot: number, suit: 'h' | 's' = 'h', s = 1, back = '#fff') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect class="m-ol" style="stroke-width:${f(2.6 / s)}" x="-10" y="-14" width="20" height="28" rx="3" fill="${back}"/>` +
  (suit === 'h' ? heart(0, 0.5, 4.4, '#E03131', 1.6 / s) + t(-5.6, -6, 6.5, 'A', '#E03131')
    : `<path class="m-ol" style="stroke-width:${f(1.6 / s)}" d="M0 -6 C-3 -2 -7 0 -6 4 C-5 7 -2 6 -1 5 L-2 8 H2 L1 5 C2 6 5 7 6 4 C7 0 3 -2 0 -6Z" fill="${D}"/>` + t(-5.6, -6, 6.5, 'A', D)) + `</g>`;
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

export const GENERAL_ART: Record<string, (u: number) => string> = {
  // ── Victorias totales ──
  'Primera ficha': () =>
    `<ellipse class="m-ol" cx="60" cy="88" rx="30" ry="7" fill="#8CE99A"/><path d="M38 88 H82" stroke="#51CF66" stroke-width="2"/>` +
    `<g fill="#B197FC" opacity=".55"><ellipse cx="28" cy="86" rx="3" ry="1.6"/><ellipse cx="35" cy="89" rx="3" ry="1.6"/></g>` +
    meeple(60, 62, 1.15, '#FF922B', 'proud', 6) +
    `<path d="M33 54 H24 M35 62 H27 M34 70 H28" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` +
    star(86, 34, 6, '#FFD43B', 1.8) + sparkle(36, 34, 4.5) + sparkle(90, 58, 3.5, '#fff'),
  'Ya no sos turista': () =>
    `<g transform="translate(6 6) rotate(-22 36 38)"><rect class="m-ol" x="24" y="30" width="26" height="17" rx="4" fill="#495057"/><rect x="29" y="27" width="9" height="5" rx="1.5" fill="${D}"/>` +
    `<circle class="m-ol" cx="37" cy="38.5" r="6" fill="#74C0FC"/><circle cx="35.5" cy="37" r="1.6" fill="#fff"/><circle cx="46" cy="33.5" r="1.4" fill="#FFD43B"/></g>` +
    `<g transform="translate(76 40) scale(.8) rotate(18) translate(-82 -32)"><path class="m-ol" d="M68 38 C68 28 74 22 82 22 C90 22 96 28 96 38Z" fill="#FFE066"/><path class="m-ol" d="M62 38 H102 C102 42 98 44 94 43 H70 C66 44 62 42 62 38Z" fill="#FCC419"/>` +
    `<path d="M70 34 H94" stroke="#F06595" stroke-width="3.5"/><circle cx="76" cy="28" r="1.5" fill="#F06595"/><circle cx="86" cy="27" r="1.5" fill="#20C997"/></g>` +
    `<path d="M22 54 C26 58 30 58 33 55 M88 52 C92 55 96 54 98 51" fill="none" stroke="${D}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 4"/>` +
    mate(58, 74, 1.2) + `<circle cx="51" cy="78" r="1.6" fill="${D}"/><circle cx="62" cy="78" r="1.6" fill="${D}"/><path d="M53.5 82 Q56.5 85 59.5 82" fill="none" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    heart(84, 68, 4.5, '#FF6B6B', 1.8),
  'Pulpo de mesa': () =>
    ([['M50 56 C40 58 34 52 30 46', 0], ['M70 56 C80 58 86 52 90 46', 0], ['M50 62 C42 70 36 72 30 76', 0], ['M70 62 C78 70 84 72 90 76', 0], ['M54 64 C52 76 46 84 48 92', 0], ['M66 64 C68 76 74 84 72 92', 0]] as const)
      .map(([d]) => stick(d, '#9775FA', 7)).join('') +
    cube(31, 38, 8) + card(89, 42, 14, 'h', .7) + meeple(29, 79, .45, '#40C057', 'none', -12) + coin(91, 79, 7) + die(47, 90, 10, 5, '#FF6B6B', '#fff', -10, 2.2) + die(73, 91, 9, 3, '#4DABF7', '#fff', 12, 2.2) +
    `<path class="m-ol" d="M40 52 C38 34 48 26 60 26 C72 26 82 34 80 52 C78 62 70 66 60 66 C50 66 42 62 40 52Z" fill="#9775FA"/>` +
    `<ellipse cx="50" cy="34" rx="5" ry="3" fill="#fff" opacity=".5" transform="rotate(-30 50 34)"/><circle cx="68" cy="34" r="2" fill="#B197FC"/><circle cx="73" cy="40" r="1.4" fill="#B197FC"/>` +
    `<circle cx="52" cy="48" r="3.4" fill="${D}"/><circle cx="68" cy="48" r="3.4" fill="${D}"/><circle cx="53" cy="47" r="1.2" fill="#fff"/><circle cx="69" cy="47" r="1.2" fill="#fff"/>` +
    `<circle cx="46" cy="55" r="3" fill="#FF8FA3" opacity=".7"/><circle cx="74" cy="55" r="3" fill="#FF8FA3" opacity=".7"/><path d="M55 56 Q60 61 65 56" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`,
  'Dueño del tablero': u => {
    const b = 'M60 65 L96 80 L60 95 L24 80Z', n = 5;
    const p = (a: number, c: number) => `${f(24 + 36 * (a / n) + 36 * (c / n))} ${f(80 - 15 * (a / n) + 15 * (c / n))}`;
    let sq = '';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2) sq += `M${p(i, j)} L${p(i + 1, j)} L${p(i + 1, j + 1)} L${p(i, j + 1)}Z `;
    return `<path class="m-ol" d="M24 80 V86 L60 101 L96 86 V80" fill="#8B5A3C"/>` +
      `<defs><clipPath id="b${u}"><path d="${b}"/></clipPath></defs><path d="${b}" fill="#FFF3BF"/><path d="${sq}" fill="#FF922B" clip-path="url(#b${u})"/><path class="m-ol" d="${b}" fill="none"/>` +
      `<path class="m-ol" d="M51 46 C44 56 42 68 44 78 Q60 82 76 78 C78 68 76 56 69 46Z" fill="#C92A2A"/><path d="M46 76 Q60 80 74 76" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray=".5 3" stroke-linecap="round"/>` +
            meeple(60, 56, .88, '#4DABF7', 'proud') + crown(60, 33, .9) + stick('M78 60 L83 40', '#FCC419', 2.6) + `<circle class="m-ol" style="stroke-width:2" cx="83.5" cy="37.5" r="3.6" fill="#E03131"/>` +
      sparkle(32, 46, 4.5) + sparkle(90, 58, 3.5, '#fff') + sparkle(38, 30, 3);
  },
  'Capo di tutti capi': () =>
    meeple(60, 69, 1.3, '#495057', 'none', 0,
      `<circle cx="0" cy="-13" r="6.8" fill="#F4BE8F"/><circle cx="-5" cy="-10.5" r="1.5" fill="#FF8FA3" opacity=".7"/><circle cx="5" cy="-10.5" r="1.5" fill="#FF8FA3" opacity=".7"/>` +
      `<path d="M-2 -5 L0 6 L2 -5Z" fill="#fff"/><path d="M-1.4 -4 L0 3 L1.4 -4Z" fill="#E03131"/>` +
      `<circle cx="-2.8" cy="-14.4" r="1.3" fill="${D}"/><circle cx="2.8" cy="-14.4" r="1.3" fill="${D}"/>` +
      `<path class="m-ol" style="stroke-width:1.5" d="M0 -11 C-2 -13 -7 -13 -8 -9 C-6 -10 -3 -10 0 -9 C3 -10 6 -10 8 -9 C7 -13 2 -13 0 -11Z" fill="#212529"/>` +
      `<path d="M-2 -7 Q0 -6 2 -7" stroke="${D}" stroke-width=".9" fill="none" stroke-linecap="round"/>`) +
    `<path class="m-ol" d="M38 46 C38 42 44 40 48 41 L50 32 C52 26 68 26 70 32 L72 41 C76 40 82 42 82 46 C76 50 44 50 38 46Z" fill="#495057"/>` +
    `<path d="M49.5 37 C55 39 65 39 70.5 37 L71.5 41.5 C65 43 55 43 48.6 41.5Z" fill="#E03131"/><path d="M53 30 C56 28 62 28 66 30" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".5"/>` +
    `<path d="M74 70 L68 64" stroke="#2F9E44" stroke-width="2" stroke-linecap="round"/><ellipse class="m-ol" style="stroke-width:1.4" cx="70" cy="68" rx="3" ry="1.6" fill="#51CF66" transform="rotate(30 70 68)"/>` +
    `<path class="m-ol" style="stroke-width:1.8" transform="translate(0 4)" d="M64 58 C62 54 64 51 67 52 C68 50 72 50 72 53 C75 53 75 57 72 59 C70 61 66 61 64 58Z" fill="#E03131"/><path d="M66 59 Q68 57 70 59" stroke="#FFA8A8" stroke-width="1.2" fill="none"/>` +
    sparkle(32, 30, 4) + sparkle(90, 72, 3.5),

  // ── Partidas jugadas ──
  'Fichado': () =>
    `<g transform="rotate(-8 56 62)"><rect class="m-ol" x="34" y="26" width="44" height="66" rx="4" fill="#FFF3D6"/><rect x="34" y="26" width="44" height="11" rx="4" fill="#4DABF7"/><path class="m-ol" d="M34 37 H78" fill="none"/>` +
    t(56, 34.5, 7, 'TARJETA', '#fff', 'textLength="30" lengthAdjust="spacingAndGlyphs"') +
    [0, 1, 2, 3, 4].map((i) => `<path d="M38 ${44 + i * 9} H74" stroke="#E9D8B4" stroke-width="1.4"/><rect x="40" y="${41 + i * 9}" width="12" height="5" rx="1" fill="#ADB5BD" opacity=".7"/><rect x="58" y="${41 + i * 9}" width="12" height="5" rx="1" fill="#ADB5BD" opacity=".7"/>`).join('') +
    `<circle cx="70" cy="88" r="2" fill="#fff" stroke="${D}" stroke-width="1.6"/></g>` +
    `<g transform="rotate(-18 58 66)"><rect x="35" y="56" width="46" height="18" rx="4" fill="#fff" fill-opacity=".6" stroke="#E03131" stroke-width="3"/>` + t(58, 69.5, 12, 'FICHADO', '#E03131', 'textLength="40" lengthAdjust="spacingAndGlyphs"') + `</g>` +
    `<circle class="m-ol" cx="84" cy="34" r="12" fill="#fff"/><circle cx="84" cy="34" r="9" fill="none" stroke="#FFD43B" stroke-width="2"/><path d="M84 28 V34 L88 37" stroke="${D}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M77 23 L80 25 M91 23 L88 25" fill="none"/>`,
  'Silla con tu nombre': () =>
    `<path class="m-ol" d="M42 66 L38 94 M78 66 L82 94 M48 70 L47 90 M72 70 L73 90" stroke-width="4" fill="none"/>` +
    `<path d="M42 66 L38 94 M78 66 L82 94 M48 70 L47 90 M72 70 L73 90" stroke="#B4703F" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
    `<path class="m-ol" d="M44 64 L42 30 C42 24 78 24 78 30 L76 64Z" fill="#C97B45"/><path d="M48 32 V60 M72 32 V60" stroke="#A35E2F" stroke-width="2"/>` +
    `<path class="m-ol" d="M36 64 H84 L80 72 H40Z" fill="#E8590C"/><path d="M42 67 H78" stroke="#fff" stroke-width="1.5" opacity=".5"/>` +
    `<path d="M52 34 L50 42 M68 34 L70 42" stroke="${D}" stroke-width="1.6"/>` +
    `<g transform="rotate(-6 60 50)"><rect class="m-ol" x="38" y="41" width="44" height="17" rx="3" fill="#FFF3BF"/>` + t(60, 54, 11, 'RESERVADO', '#E03131', 'textLength="38" lengthAdjust="spacingAndGlyphs"') + `</g>` +
    `<circle class="m-ol" style="stroke-width:1.8" cx="50" cy="35" r="2.2" fill="#ADB5BD"/><circle class="m-ol" style="stroke-width:1.8" cx="70" cy="35" r="2.2" fill="#ADB5BD"/>` +
    star(30, 36, 4.5, '#FFD43B', 1.6) + sparkle(90, 46, 4) + heart(88, 82, 4, '#FF6B6B', 1.6),
  'Llave de la casa': () =>
    `<g transform="rotate(-35 60 56)"><rect class="m-ol" x="56" y="51" width="38" height="9" rx="3" fill="#FCC419"/><path class="m-ol" d="M80 59 V67 H85 V63 H89 V68 H94 V59" fill="#FCC419"/>` +
    `<circle class="m-ol" cx="48" cy="55.5" r="15" fill="#FCC419"/><circle class="m-ol" cx="44" cy="55.5" r="5" fill="#FFF8E7"/><path d="M40 47 C44 44 50 44 54 46" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M60 54 H90" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/><circle cx="54" cy="61" r="1.5" fill="#E67700"/></g>` +
    `<circle cx="42" cy="66" r="7" fill="none" stroke="${D}" stroke-width="5"/><circle cx="42" cy="66" r="7" fill="none" stroke="#CED4DA" stroke-width="2.4"/>` +
    `<path d="M40 73 L37 77" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` + cube(36, 82, 11, ['#FF8787', '#E03131', '#C92A2A'], '#fff') +
    sparkle(84, 30, 5) + sparkle(28, 40, 3.5, '#fff'),
  'Patrimonio del grupo': () =>
    `<circle cx="60" cy="61" r="31" fill="${D}"/><circle class="m-ol" cx="60" cy="58" r="31" fill="#1C7ED6"/><circle cx="60" cy="58" r="27" fill="none" stroke="#fff" stroke-width="2.4"/>` +
    `` +
    `` +
    t(60, 45, 7, 'PATRIMONIO', '#fff', 'textLength="36" lengthAdjust="spacingAndGlyphs"') + t(60, 79.5, 6, 'DEL GRUPO', '#fff', 'textLength="30" lengthAdjust="spacingAndGlyphs"') +
    `<g transform="translate(60 60) scale(.42)"><path d="${MEEPLE}" fill="#fff"/></g>` +
    `<path d="M44 71 H76" stroke="#fff" stroke-width="1.4" opacity=".6"/>` +
    `<circle cx="34" cy="58" r="1.6" fill="#A5D8FF"/><circle cx="86" cy="58" r="1.6" fill="#A5D8FF"/>` +
    `<path d="M40 36 C46 30 54 28 60 28" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".5"/>`,
  'Mueble de living': () =>
    `<path class="m-ol" d="M34 72 L32 92 M86 72 L88 92" stroke-width="5" fill="none"/><path d="M34 72 L32 92 M86 72 L88 92" stroke="#6B3E1F" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path class="m-ol" d="M36 70 C34 46 38 30 60 30 C82 30 86 46 84 70Z" fill="#2F9E44"/>` +
    `<path d="M48 36 V64 M60 34 V64 M72 36 V64" stroke="#237032" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M50 30 C52 26 68 26 70 30 L68 36 L60 34 L52 36Z" fill="#fff"/><path d="M54 30.5 H66" stroke="#DEE2E6" stroke-width="1.2" stroke-dasharray="1.5 1.5"/>` +
    meeple(60, 62, .9, '#FAB005', 'sleepy') +
    `<path class="m-ol" d="M36 66 H84 C88 66 89 72 86 76 H34 C31 72 32 66 36 66Z" fill="#40C057"/>` +
    `<path class="m-ol" d="M26 56 C26 50 38 50 38 56 V78 H26Z" fill="#37B24D"/><path class="m-ol" d="M82 56 C82 50 94 50 94 56 V78 H82Z" fill="#37B24D"/>` +
    `<path d="M29 56 C29 54 33 53 35 55" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>` +
    t(80, 34, 9, 'z', D) + t(87, 27, 7, 'z', D) +
    `<path d="M24 24 L32 32 M24 30 L30 24 M24 24 Q28 27 24 30" stroke="#ADB5BD" stroke-width="1" fill="none"/>`,

  // ── Todoterreno (juegos distintos ganados) ──
  'Navaja suiza': () => {
    const tool = (bx: number, deg: number, len: number, col: string, item: string) =>
      `<g transform="translate(${bx} 76) rotate(${deg})">${stick(`M0 0 V${-len}`, col, 3.6)}<g transform="translate(0 ${-len}) rotate(${-deg})">${item}</g></g>`;
    return tool(40, -30, 24, '#CED4DA', card(0, -7, -10, 's', .62)) +
      tool(53, -10, 26, '#CED4DA', die(0, -5, 13, 3, '#fff', D, 6, 2.2)) +
      tool(67, 10, 26, '#ADB5BD', `<circle class="m-ol" cx="0" cy="-4" r="6.5" fill="#E03131"/><circle cx="-2" cy="-6" r="1.8" fill="#fff" opacity=".8"/>`) +
      tool(80, 32, 20, '#C97B45', `<circle class="m-ol" cx="0" cy="-8" r="9" fill="#4DABF7"/><circle cx="0" cy="-8" r="6.2" fill="none" stroke="#1C7ED6" stroke-width="1.4"/><ellipse cx="-3" cy="-11" rx="2" ry="1.2" fill="#fff" opacity=".7"/>`) +
      `<rect class="m-ol" x="26" y="70" width="68" height="19" rx="9.5" fill="#E03131"/>` +
      `<path d="M34 74 H72" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/><circle cx="33" cy="82" r="1.6" fill="#FFA8A8"/><circle cx="87" cy="82" r="1.6" fill="#FFA8A8"/>` +
      `<rect x="55" y="74.5" width="10" height="10" rx="2" fill="#fff"/><rect x="58.5" y="76.3" width="3" height="6.4" fill="#E03131"/><rect x="56.8" y="78" width="6.4" height="3" fill="#E03131"/>` +
      sparkle(90, 40, 4);
  },
  'Hombre orquesta': () =>
    `<path d="M24 44 L24 34 L30 32 V42 M24 38 L30 36" stroke="${D}" stroke-width="2" fill="none"/><ellipse cx="22" cy="44" rx="3" ry="2.2" fill="${D}"/><ellipse cx="28" cy="42" rx="3" ry="2.2" fill="${D}"/>` +
    `<path d="M92 30 V40" stroke="${D}" stroke-width="2"/><ellipse cx="89.5" cy="40" rx="3" ry="2.2" fill="${D}"/><path d="M92 30 L97 32" stroke="${D}" stroke-width="2"/>` +
    meeple(60, 56, 1.15, '#F03E3E', 'happy') +
    `<ellipse class="m-ol" cx="60" cy="31" rx="16" ry="3.6" fill="#FCC419"/><path class="m-ol" style="stroke-width:2" d="M60 31 V24" fill="none"/>` +
    `<path class="m-ol" d="M46 72 V88 C46 94 74 94 74 88 V72Z" fill="#4DABF7"/><ellipse class="m-ol" cx="60" cy="72" rx="14" ry="5" fill="#E7F5FF"/>` +
    `<path d="M46 78 L52 88 L58 78 L64 88 L70 78" stroke="#fff" stroke-width="1.8" fill="none"/>` +
    `<path d="M50 70 L54 64 M70 70 L66 64" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` +
    card(28, 62, -16, 'h', .62) + cube(92, 58, 7) +
    `<path class="m-ol" style="stroke-width:2" d="M36 82 L42 78" fill="none"/><circle class="m-ol" style="stroke-width:2" cx="34" cy="84" r="3.5" fill="#FFD43B"/>`,
  'Enciclopedia Salvat': () => {
    const book = (x: number, w: number, h: number, c: string, icon: string, rot = 0) =>
      `<g transform="rotate(${rot} ${x + w / 2} 90)"><rect class="m-ol" x="${x}" y="${90 - h}" width="${w}" height="${h}" rx="1.5" fill="${c}"/>` +
      `<rect x="${x + 1.5}" y="${94 - h}" width="${w - 3}" height="2.4" fill="#FFD43B"/><rect x="${x + 1.5}" y="83" width="${w - 3}" height="2.4" fill="#FFD43B"/>` +
      `<path d="M${x + 2.6} ${100 - h} V80" stroke="#fff" stroke-width="1.4" opacity=".35"/><g transform="translate(${x + w / 2} ${90 - h * .5})">${icon}</g></g>`;
    return `<rect class="m-ol" x="24" y="90" width="72" height="6" rx="2" fill="#8B5A3C"/>` +
      book(27, 12, 50, '#C92A2A', `<circle r="3.4" fill="#fff"/><circle r="1.3" fill="#C92A2A"/>`) +
      book(39, 12, 56, '#1971C2', heart(0, 0, 3.4, '#fff', 0)) +
      book(51, 12, 52, '#2F9E44', `<g transform="scale(.3)"><path d="${MEEPLE}" fill="#fff"/></g>`) +
      book(63, 12, 58, '#7048E8', `<polygon points="${starPts(0, 0, 4.4)}" fill="#fff"/>`) +
      book(74, 12, 46, '#E8590C', `<rect x="-4" y="-4" width="8" height="8" rx="1.6" fill="#fff"/><circle cx="-1.8" cy="-1.8" r="1" fill="#E8590C"/><circle cx="1.8" cy="1.8" r="1" fill="#E8590C"/>`, 10) +
      t(39 + 6, 48, 5, 'I', '#fff') + t(63 + 6, 42, 5, 'IV', '#fff') +
      sparkle(32, 32, 4) + sparkle(90, 32, 3.5, '#fff');
  },
  'Parque de diversiones': () => {
    let cabins = '', spokes = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * 45 - 90) * Math.PI / 180, x = f(60 + 27 * Math.cos(a)), y = f(50 + 27 * Math.sin(a));
      spokes += `M60 50 L${x} ${y} `;
      if (i % 2 === 0) cabins += `<path d="M${x} ${y} V${f(y + 5)}" stroke="${D}" stroke-width="2"/>` + (i % 4 === 0 ? die(x, f(y + 10), 11, i ? 4 : 6, i === 4 ? '#FF6B6B' : '#fff', i === 4 ? '#fff' : D, 0, 2.2) : card(x, f(y + 11), 0, i === 2 ? 'h' : 's', .5));
      else cabins += `<circle class="m-ol" style="stroke-width:1.6" cx="${x}" cy="${y}" r="2.4" fill="#FFD43B"/>`;
    }
    return `<path class="m-ol" d="M60 50 L40 96 M60 50 L80 96" stroke-width="4.5" fill="none"/><path d="M60 50 L40 96 M60 50 L80 96" stroke="#ADB5BD" stroke-width="2" fill="none"/>` +
      `<circle cx="60" cy="50" r="27" fill="none" stroke="${D}" stroke-width="7"/><circle cx="60" cy="50" r="27" fill="none" stroke="#F06595" stroke-width="3"/>` +
      `<path d="${spokes}" stroke="${D}" stroke-width="1.6"/><circle cx="60" cy="50" r="19" fill="none" stroke="#FCC419" stroke-width="1.6" stroke-dasharray="2 3"/>` +
      cabins + `<circle class="m-ol" cx="60" cy="50" r="5" fill="#FCC419"/>` +
      `<rect class="m-ol" x="32" y="94" width="56" height="6" rx="3" fill="#868E96"/>`;
  },
  // ── Mesa grande ──
  'Cabecera de mesa': () => {
    const chair = (x: number, y: number, s: number, c: string) => `<rect class="m-ol" style="stroke-width:${f(2.4 * s)}" x="${f(x - 5 * s)}" y="${f(y - 6 * s)}" width="${f(10 * s)}" height="${f(12 * s)}" rx="${f(2 * s)}" fill="${c}"/>`;
    return `<path class="m-ol" d="M50 46 V37 C50 29 70 29 70 37 V46Z" fill="#C92A2A"/><path d="M54 37 C54 34 58 33 60 33" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>` +
      crown(60, 27, 1) +
      chair(41, 54, .8, '#C97B45') + chair(79, 54, .8, '#C97B45') + chair(34, 66, 1, '#C97B45') + chair(86, 66, 1, '#C97B45') + chair(28, 84, 1.2, '#C97B45') + chair(92, 84, 1.2, '#C97B45') +
      `<path class="m-ol" d="M47 46 H73 L88 96 H32Z" fill="#FFF3BF"/><path d="M60 46 V96" stroke="#E03131" stroke-width="5" opacity=".75"/>` +
      `<path d="M47 46 L32 96 M73 46 L88 96" stroke="#FAB005" stroke-width="1.2"/>` +
      `<ellipse class="m-ol" style="stroke-width:1.8" cx="52.5" cy="54" rx="3.4" ry="2" fill="#fff"/><ellipse class="m-ol" style="stroke-width:1.8" cx="67.5" cy="54" rx="3.4" ry="2" fill="#fff"/>` +
      `<ellipse class="m-ol" style="stroke-width:1.8" cx="47" cy="66" rx="4.4" ry="2.6" fill="#fff"/><ellipse class="m-ol" style="stroke-width:1.8" cx="73" cy="66" rx="4.4" ry="2.6" fill="#fff"/>` +
      `<ellipse class="m-ol" style="stroke-width:1.8" cx="42" cy="85" rx="5.4" ry="3.2" fill="#fff"/><ellipse class="m-ol" style="stroke-width:1.8" cx="78" cy="85" rx="5.4" ry="3.2" fill="#fff"/>` +
      die(60, 72, 10, 5, '#fff', D, 12, 2) +
      sparkle(36, 26, 4) + sparkle(84, 26, 4);
  },
  'Mesa de Navidad': () =>
    `<path d="M24 34 Q42 44 60 34 Q78 44 96 34" fill="none" stroke="#2F9E44" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="34" cy="39" r="2.6" fill="#E03131"/><circle cx="48" cy="40.5" r="2.6" fill="#FCC419"/><circle cx="72" cy="40.5" r="2.6" fill="#4DABF7"/><circle cx="86" cy="39" r="2.6" fill="#E03131"/>` +
    `<path class="m-ol" d="M22 78 H98 V100 H22Z" fill="#E03131"/><path d="M22 78 H98" stroke="#fff" stroke-width="2"/><path d="M22 86 L30 92 L38 86 L46 92 L54 86 L62 92 L70 86 L78 92 L86 86 L94 92 L98 89" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/>` +
    `<path class="m-ol" d="M71 78 V58 C71 54 74 52 75 48 V40 H81 V48 C82 52 85 54 85 58 V78Z" fill="#2B8A3E"/><path class="m-ol" style="stroke-width:2" d="M74.5 36 H81.5 V48 H74.5Z" fill="#FCC419"/>` +
    `<rect class="m-ol" style="stroke-width:1.8" x="72.5" y="62" width="11" height="10" rx="1" fill="#FFF3BF"/><path d="M75 65 H81 M75 68 H80" stroke="#E03131" stroke-width="1.2"/><path d="M73.5 58 V76" stroke="#fff" stroke-width="1.6" opacity=".4"/>` +
    `<path class="m-ol" d="M30 78 C28 62 36 54 48 54 C60 54 66 62 64 78Z" fill="#E8A54B"/><path d="M33 64 C36 58 42 56 46 56" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>` +
    ([[38, 66, '#E03131'], [46, 62, '#2F9E44'], [54, 68, '#E03131'], [44, 72, '#FCC419'], [56, 60, '#FCC419'], [36, 74, '#2F9E44'], [58, 74, '#2F9E44']] as const).map(([x, y, c]) => `<rect x="${x - 1.6}" y="${y - 1.6}" width="3.2" height="3.2" rx=".8" fill="${c}"/>`).join('') +
    `<path class="m-ol" style="stroke-width:2" d="M38 56 C40 48 48 44 54 46 L58 50 C52 52 44 54 38 56Z" fill="#E03131"/><circle class="m-ol" style="stroke-width:1.6" cx="59" cy="49" r="2.6" fill="#fff"/>` +
    die(91, 72, 10, 6, '#fff', D, 15, 2) + card(50, 90, -70, 'h', .55) +
    star(60, 24, 6, '#FFD43B', 1.8),
  'Asado de 40 personas': () => {
    let ch = '';
    const rows: [number, number, number, number][] = [[64, 26, 17, 4], [73, 29.5, 16.5, 4], [82, 33, 18, 3]];
    rows.forEach(([y, x0, dx, n], r) => {
      for (let i = 0; i < n; i++) {
        const x = x0 + i * dx, c = (i + r) % 3 === 1 ? '#4A2520' : '#B8452E', rot = (i + r) % 2 ? 5 : -5;
        ch += `<g transform="rotate(${rot} ${x + 7.5} ${y + 3.5})"><rect class="m-ol" style="stroke-width:2" x="${x}" y="${y}" width="15" height="7.5" rx="3.75" fill="${c}"/>` +
          `<path d="M${x + 4} ${y + 2.4} H${x + 10}" stroke="#fff" stroke-width="1.2" opacity=".5" stroke-linecap="round"/><path d="M${x + 5} ${y + 7} L${x + 7} ${y + .8} M${x + 9} ${y + 7} L${x + 11} ${y + .8}" stroke="${D}" stroke-width=".9" opacity=".35"/></g>`;
      }
    });
    return `<path class="m-ol" style="stroke-width:3.4" d="M32 90 L28 100 M88 90 L92 100" fill="none"/>` +
      `<path d="M30 94 Q36 89 42 94 Q48 89 54 94 Q60 89 66 94 Q72 89 78 94 Q84 89 90 94" stroke="#FF922B" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path class="m-ol" d="M22 60 H98 L94 91 H26Z" fill="#343A40"/><path d="M27 68 H93 M27 76 H93 M27 84 H93" stroke="#868E96" stroke-width="1.4"/>` + ch +
      `<path d="M46 58 C43 54 49 52 46 48 M74 58 C71 54 77 52 74 48" fill="none" stroke="#ADB5BD" stroke-width="2.5" stroke-linecap="round"/>` +
      `<rect class="m-ol" x="34" y="22" width="52" height="25" rx="3" fill="#2B8A3E"/><rect x="37" y="25" width="46" height="19" rx="1.5" fill="none" stroke="#8C5A3C" stroke-width="1.6"/>` +
      `<path d="M41 29.5 V40 M44 29.5 V40 M47 29.5 V40 M50 29.5 V40 M39 38 L52 31" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` +
      t(70, 42, 16, '40', '#fff') + `<path d="M56 47 L53 52 M64 47 L67 52" stroke="${D}" stroke-width="2"/>`;
  },
  // ── Cooperativos ──
  'Uno para todos': () => {
    const hand = (deg: number, skin: string, sleeve: string) =>
      `<g transform="translate(60 60) rotate(${deg}) translate(-3 0)">` +
      `<path class="m-ol" d="M-34 -8 L-14 -8 C-6 -9 6 -9 12 -6 C17 -3 17 3 12 5 L-2 7 L-34 8Z" fill="${skin}"/>` +
      `<path class="m-ol" style="stroke-width:2" d="M-6 -8 C-4 -14 4 -14 5 -10 C5 -8 1 -7 -2 -7" fill="${skin}"/>` +
      `<path d="M0 -2 H11 M0 2 H10" stroke="${D}" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>` +
      `<rect class="m-ol" x="-38" y="-10" width="12" height="20" rx="3" fill="${sleeve}"/></g>`;
    return hand(150, '#C68B59', '#E03131') + hand(30, '#FFD8B5', '#4DABF7') + hand(270, '#F4BE8F', '#40C057') +
      sparkle(30, 32, 4.5) + sparkle(92, 82, 4) + heart(90, 32, 4.5, '#FF6B6B', 1.8);
  },
  'Equipo de rescate': u => {
    const segs = [0, 1, 2, 3].map((i) => `<path d="M60 62 L${f(60 + 40 * Math.cos((i * 90 - 22) * Math.PI / 180))} ${f(62 + 40 * Math.sin((i * 90 - 22) * Math.PI / 180))} A40 40 0 0 1 ${f(60 + 40 * Math.cos((i * 90 + 22) * Math.PI / 180))} ${f(62 + 40 * Math.sin((i * 90 + 22) * Math.PI / 180))}Z" fill="#fff"/>`).join('');
    return `<path class="m-ol" d="M20 90 Q30 84 40 90 T60 90 T80 90 T100 90 V104 H20Z" fill="#4DABF7"/>` +
      `<defs><clipPath id="r${u}"><path d="M60 34 a28 28 0 1 1 -.1 0Z M60 48 a14 14 0 1 0 .1 0Z" clip-rule="evenodd"/></clipPath></defs>` +
      `<g clip-path="url(#r${u})"><circle cx="60" cy="62" r="28" fill="#E03131"/>${segs}</g>` +
      `<circle class="m-ol" cx="60" cy="62" r="28" fill="none"/><circle class="m-ol" cx="60" cy="62" r="14" fill="none"/>` +
      `<path d="M38 50 C41 44 46 40 52 38" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>` +
      meeple(60, 64, .48, '#FCC419', 'happy') + meeple(31, 76, .42, '#40C057', 'happy', -20) + meeple(89, 76, .42, '#9775FA', 'happy', 20) +
      `<path d="M28 96 Q34 92 40 96 M76 96 Q82 92 88 96" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  },
  'Los Increíbles': () => {
    const mask = `<path d="M-8 -15.5 C-5 -17.5 -2 -16 0 -15 C2 -16 5 -17.5 8 -15.5 C8 -11.5 5 -11.5 0 -13 C-5 -11.5 -8 -11.5 -8 -15.5Z" fill="${D}"/><circle cx="-3.6" cy="-14.8" r="1.2" fill="#fff"/><circle cx="3.6" cy="-14.8" r="1.2" fill="#fff"/><path d="M-2.6 -9.6 Q0 -7.4 2.6 -9.6" stroke="${D}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
    return `<path class="m-ol" d="M60 22 C78 22 94 32 94 50 C94 72 76 88 60 96 C44 88 26 72 26 50 C26 32 42 22 60 22Z" fill="#FF922B"/>` +
      `<path d="M60 28 C75 28 88 36 88 51 C88 69 73 83 60 90 C47 83 32 69 32 51 C32 36 45 28 60 28Z" fill="#E03131"/>` +
      `<path d="M38 40 C42 34 50 30 58 30" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>` +
      meeple(42, 66, .55, '#FCC419', 'none', -8, mask) + meeple(78, 66, .55, '#FCC419', 'none', 8, mask) + meeple(60, 56, .78, '#FCC419', 'none', 0, mask) +
      `<path d="M30 30 L24 26 M90 30 L96 26 M60 16 V20" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`;
  },

  // ── Por juego ──
  'Debut soñado': () =>
    `<path d="M60 18 L36 82 H84Z" fill="#FFF3BF" opacity=".75"/>` +
    `<path class="m-ol" d="M20 20 H38 C36 40 30 60 34 84 H20Z" fill="#C92A2A"/><path class="m-ol" d="M100 20 H82 C84 40 90 60 86 84 H100Z" fill="#C92A2A"/>` +
    `<path d="M26 24 C26 44 24 64 26 82 M94 24 C94 44 96 64 94 82" stroke="#A61E1E" stroke-width="2" fill="none"/>` +
    `<path class="m-ol" d="M24 84 H96 V96 H24Z" fill="#B4703F"/><path d="M24 88 H96 M40 88 V96 M60 88 V96 M80 88 V96" stroke="#8B5A3C" stroke-width="1.4"/>` +
    meeple(60, 63, .85, '#4DABF7', 'proud', 18) +
    `<path class="m-ol" style="stroke-width:1.8" d="M44 82 C42 78 45 76 47 78 C48 75 52 76 51 79 C51 82 47 83 44 82Z" fill="#E03131"/><path d="M48 82 L52 84" stroke="#2F9E44" stroke-width="1.8" stroke-linecap="round"/>` +
    star(80, 40, 6, '#FFD43B', 1.8) + sparkle(42, 36, 4.5) + sparkle(76, 60, 3, '#fff'),
  'Le agarraste la mano': () =>
    `<path class="m-ol" d="M32 84 C32 76 40 73 60 73 C80 73 88 76 88 84 V88 C88 93 32 93 32 88Z" fill="#343A40"/><path d="M38 79 C44 76 52 75 60 75" stroke="#868E96" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<circle class="m-ol" style="stroke-width:2" cx="80" cy="81" r="3.2" fill="#E03131"/><circle class="m-ol" style="stroke-width:2" cx="40" cy="83" r="3.2" fill="#FCC419"/>` +
    stick('M54 76 L54 40', '#868E96', 4.4) + `<circle class="m-ol" cx="54" cy="33" r="10" fill="#E03131"/><ellipse cx="50.5" cy="29.5" rx="3" ry="2" fill="#fff" opacity=".75" transform="rotate(-30 50.5 29.5)"/>` +
    `<path class="m-ol" d="M100 50 H78 V68 H100Z" fill="#4DABF7"/><rect class="m-ol" x="72" y="49" width="9" height="20" rx="2" fill="#FCC419"/>` +
    `<path class="m-ol" d="M73 50 C66 46 50 45 45 50 C42 53 42 66 45 68 C50 72 66 70 73 68Z" fill="#fff"/>` +
    `<path d="M44 55 H55 M44 60.5 H56 M45 65.5 H55" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:2.2" d="M68 50 C62 44 52 43 48 47 C50 51 58 51 64 53" fill="#fff"/>` +
    `<path d="M62 56 C64 58 66 62 66 64" stroke="#DEE2E6" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    sparkle(80, 32, 5) + sparkle(30, 46, 3.5) + `<path d="M36 34 L30 31 M36 40 L29 41 M72 34 L77 29" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/>`,
  'Especialista': () =>
    die(52, 62, 34, 5, '#fff', D, -8) +
    stick('M74 72 L90 90', '#8B5A3C', 6) +
    `<circle cx="66" cy="62" r="15" fill="#E7F5FF"/><circle cx="69" cy="66" r="5" fill="${D}"/><circle cx="66" cy="62" r="15" fill="#74C0FC" fill-opacity=".3"/><circle cx="66" cy="62" r="15" fill="none" stroke="${D}" stroke-width="7"/><circle cx="66" cy="62" r="15" fill="none" stroke="#FCC419" stroke-width="3.6"/>` +
    `<path d="M58 54 C60 51 64 50 67 50" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<g transform="translate(4 6)"><circle class="m-ol" cx="34" cy="36" r="9" fill="#E03131"/><circle cx="34" cy="36" r="5" fill="#FFD43B"/><path class="m-ol" style="stroke-width:2" d="M29 43 L26 54 L30 52 L32 56 L34 45 M39 43 L42 54 L38 52 L36 56 L34 45" fill="#E03131"/></g>` +
    sparkle(88, 34, 5),
  'Doctorado': () =>
    `<g transform="rotate(-24 88 78)"><rect class="m-ol" x="70" y="72" width="30" height="11" rx="5.5" fill="#FFF8E7"/><ellipse class="m-ol" style="stroke-width:2" cx="99" cy="77.5" rx="3" ry="5.5" fill="#F1E3CF"/><rect x="82" y="71.5" width="4" height="12" fill="#E03131"/></g>` +
    cube(52, 62, 18) +
    `<path d="M45 70 Q48 74 51 72 M53 75 Q56 79 58 76" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0"/>` +
    `<path class="m-ol" d="M52 52 L32 44 L52 36 L72 44Z" fill="#343A40"/><path class="m-ol" d="M40 47 V53 C46 58 58 58 64 53 V47 L52 52Z" fill="#212529"/>` +
    `<path d="M52 44 L68 47 V60" stroke="${D}" stroke-width="3.6" stroke-linecap="round" fill="none"/><path d="M52 44 L68 47 V60" stroke="#FCC419" stroke-width="1.6" stroke-linecap="round" fill="none"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M66 59 L70 59 L71 66 L65 66Z" fill="#FCC419"/><circle class="m-ol" style="stroke-width:1.8" cx="52" cy="44" r="2" fill="#FCC419"/>` +
    sparkle(30, 30, 4.5) + sparkle(88, 36, 5) + star(28, 74, 4, '#FFD43B', 1.6),
  'Leyenda viviente': () => {
    let leaves = '';
    for (let i = 0; i < 6; i++) {
      const deg = 100 + i * 24, a = deg * Math.PI / 180, x = f(60 + 34 * Math.cos(a)), y = f(56 + 34 * Math.sin(a));
      leaves += `<ellipse class="m-ol" style="stroke-width:1.6" cx="${x}" cy="${y}" rx="3" ry="6.5" fill="#40C057" transform="rotate(${deg} ${x} ${y})"/>`;
      leaves += `<ellipse class="m-ol" style="stroke-width:1.6" cx="${f(120 - x)}" cy="${y}" rx="3" ry="6.5" fill="#40C057" transform="rotate(${-deg} ${f(120 - x)} ${y})"/>`;
    }
    return leaves +
      `<path class="m-ol" d="M44 80 H76 V92 H44Z" fill="#E9ECEF"/><rect class="m-ol" x="40" y="90" width="40" height="7" rx="2" fill="#CED4DA"/><rect class="m-ol" x="42" y="76" width="36" height="6" rx="2" fill="#CED4DA"/>` +
      `<rect x="51" y="84" width="18" height="4" rx="1" fill="#FCC419"/>` +
      meeple(60, 51, 1.05, '#FCC419', 'proud', 0, `<path d="M-14 3 L-8 -2 M8 18 L12 12 M5 -18 L7 -16" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M10 6 L14 19 M-10 6 L-14 19" stroke="#E67700" stroke-width="1.6" opacity=".5"/>`) +
      sparkle(34, 30, 5, '#fff') + sparkle(86, 28, 4, '#fff') + sparkle(88, 50, 3, '#FFD43B');
  },
};
