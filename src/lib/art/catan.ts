// Ilustraciones de las medallas de Catán (mismo estilo calcomanía que el Ping Pong Club).
import { D, f, heart, star, stick, t } from './helpers'

// Colores de jugador (piezas de madera) y recursos.
const RED = '#E03131', BLUE = '#1C7ED6', ORANGE = '#F76707', WHITE = '#F1F3F5'
const WHEAT = '#F5C342', WHEAT_D = '#D9961E', GRASS = '#8CC152', GRASS_D = '#5E9E2E'

const sw = (s: number) => `style="stroke-width:${f(2.6 / s)}"`
const g = (x: number, y: number, s: number, body: string, rot = 0) =>
  `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ''} scale(${s})">${body}</g>`

/** Poblado de madera (base en y). */
const house = (x: number, y: number, s: number, c: string) => g(x, y, s,
  `<path class="m-ol" ${sw(s)} d="M-8 0 V-10 L0 -17 L8 -10 V0Z" fill="${c}"/>` +
  `<path d="M0 -15.6 L6.7 -9.8 V-1.2 H2.5 V-11Z" fill="#000" opacity=".16"/>` +
  `<path d="M-5.5 -10.5 L-1 -14.4" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>` +
  `<rect x="-2.6" y="-6" width="4" height="6" rx="1" fill="${D}" opacity=".75"/>`)

/** Ciudad de madera. */
const city = (x: number, y: number, s: number, c: string) => g(x, y, s,
  `<path class="m-ol" ${sw(s)} d="M-12 0 V-13 L-5.5 -20 L1 -13 V-8 H12 V0Z" fill="${c}"/>` +
  `<path d="M1 -7 H11 V-1.2 H1Z" fill="#000" opacity=".14"/>` +
  `<path d="M-9.5 -13.5 L-6 -17.2" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>` +
  `<rect x="-7.5" y="-11" width="4" height="4" rx=".8" fill="#FFE066" stroke="${D}" stroke-width="1"/>` +
  `<rect x="4" y="-5.5" width="3.6" height="5.5" rx=".8" fill="${D}" opacity=".75"/>`)

/** Contorno esponjoso (lana, nubes, humo). */
const fluff = (cx: number, cy: number, rx: number, ry: number, n: number, fill: string, extra = '') => {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, x = f(cx + rx * Math.cos(a)), y = f(cy + ry * Math.sin(a))
    d += i ? `A${f(rx * 3.3 / n)} ${f(rx * 3.3 / n)} 0 0 1 ${x} ${y} ` : `M${x} ${y} `
  }
  return `<path class="m-ol" ${extra} d="${d}Z" fill="${fill}"/>`
}

/** Oveja de frente (centro del cuerpo en x,y). */
const sheep = (x: number, y: number, s: number, legs = true) => g(x, y, s,
  (legs ? `<path class="m-ol" ${sw(s)} d="M-7 6 V14 M7 6 V14" fill="none" style="stroke-width:${f(5 / s)}"/>` : '') +
  fluff(0, 0, 15, 11, 11, '#fff', sw(s)) +
  `<ellipse cx="-11" cy="-3" rx="4" ry="2.4" fill="${D}" transform="rotate(-25 -11 -3)"/><ellipse cx="11" cy="-3" rx="4" ry="2.4" fill="${D}" transform="rotate(25 11 -3)"/>` +
  `<ellipse cx="0" cy="1" rx="7.5" ry="8.5" fill="${D}"/>` +
  fluff(0, -7, 6, 3.4, 7, '#fff', sw(s)) +
  `<circle cx="-3" cy="0" r="1.9" fill="#fff"/><circle cx="3" cy="0" r="1.9" fill="#fff"/><circle cx="-2.7" cy=".3" r="1" fill="${D}"/><circle cx="3.3" cy=".3" r="1" fill="${D}"/>` +
  `<path d="M-2 5 Q0 6.8 2 5" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>`)

/** Espiga de trigo apoyada en x,y. */
const wheat = (x: number, y: number, s: number, rot = 0) => {
  let k = `<path d="M0 0 C0 -10 0 -18 0 -26" fill="none" stroke="${D}" stroke-width="${f(5.2 / s)}" stroke-linecap="round"/><path d="M0 0 C0 -10 0 -18 0 -26" fill="none" stroke="#9C6B1E" stroke-width="${f(1.8 / s)}" stroke-linecap="round"/>`
  for (let i = 0; i < 4; i++) {
    const yy = -14 - i * 5
    k += `<ellipse class="m-ol" ${sw(s * 1.3)} cx="-3" cy="${yy}" rx="2.4" ry="3.8" transform="rotate(-30 -3 ${yy})" fill="${WHEAT}"/>` +
      `<ellipse class="m-ol" ${sw(s * 1.3)} cx="3" cy="${yy}" rx="2.4" ry="3.8" transform="rotate(30 3 ${yy})" fill="${WHEAT}"/>`
  }
  k += `<ellipse class="m-ol" ${sw(s * 1.3)} cx="0" cy="-34" rx="2.4" ry="4" fill="${WHEAT}"/>`
  return g(x, y, s, k, rot)
}

/** Caballero (cabeza de caballito de ajedrez) en color de jugador. */
const knight = (x: number, y: number, s: number, c: string, flip = false) => g(x, y, s,
  `<g${flip ? ' transform="scale(-1 1)"' : ''}>` +
  `<path class="m-ol" ${sw(s)} d="M-8 0 H9 C9 -6 6 -9 7 -14 C8 -20 4 -25 -1 -26 L-2 -30 L-5 -25 C-10 -22 -13 -16 -13 -11 C-13 -8 -11 -7 -9 -8 L-4 -11 C-3 -7 -8 -5 -8 0Z" fill="${c}"/>` +
  `<path d="M3 -25 C8 -20 6 -14 5 -10 C4 -6 7 -3 8 -1 H5 C3 -5 2 -9 3 -14Z" fill="#000" opacity=".15"/>` +
  `<circle cx="-4" cy="-19" r="1.7" fill="${D}"/><circle cx="-4.5" cy="-19.6" r=".6" fill="#fff"/>` +
  `<rect class="m-ol" ${sw(s)} x="-11" y="-1" width="22" height="5" rx="2" fill="${c}"/></g>`)

/** Carta de desarrollo (dorso). */
const card = (x: number, y: number, rot: number, mid = '') => g(x, y, 1,
  `<rect class="m-ol" x="-13" y="-19" width="26" height="38" rx="3.5" fill="#FFF3D6"/>` +
  `<rect x="-9.5" y="-15.5" width="19" height="31" rx="2" fill="#7048E8"/>` +
  `<path d="M-9.5 -2 L0 -15.5 L9.5 -2 L0 11.5Z M-9.5 10 L-4 15.5 M9.5 10 L4 15.5" fill="#845EF7" stroke="#9775FA" stroke-width="1"/>` +
  (mid || t(0, 5, 16, '?', '#FFD43B')), rot)

// Escudo de ruta nacional argentina.
const shield = 'M40 32 H80 V56 C80 67 71 74 60 78 C49 74 40 67 40 56Z'

export const CATAN_ART: Record<string, (u: number) => string> = {
  'Camino de tierra': () =>
    `<path class="m-ol" d="M14 62 C30 52 48 58 60 54 C76 49 92 52 106 58 V110 H14Z" fill="${GRASS}"/>` +
    `<path d="M70 56 C80 53 92 54 106 60 V68 C94 62 84 62 74 62Z" fill="${GRASS_D}" opacity=".5"/>` +
    `<path class="m-ol" d="M34 108 C40 94 68 90 63 81 C59 74 44 73 49 65 C52 60 58 59 58 55 L64 55 C64 60 60 62 59 66 C58 71 76 73 77 81 C79 93 60 98 66 108Z" fill="#C08552"/>` +
    `<path d="M52 101 C56 94 70 90 70 83 M55 68 C57 63 61 62 61 58" fill="none" stroke="#E2B07E" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 5"/>` +
    `<ellipse class="m-ol" cx="50" cy="96" rx="7" ry="3.4" fill="#7A4B27"/><ellipse cx="51" cy="96.6" rx="4.2" ry="1.7" fill="#74C0FC"/>` +
    `<ellipse class="m-ol" cx="68" cy="80" rx="5.5" ry="2.7" fill="#7A4B27"/><ellipse cx="68.6" cy="80.5" rx="3.2" ry="1.3" fill="#74C0FC"/>` +
    `<ellipse class="m-ol" style="stroke-width:2.2" cx="53" cy="67" rx="3.6" ry="1.8" fill="#7A4B27"/>` +
    house(61, 54, .95, RED) +
    `<rect class="m-ol" x="37" y="54" width="4" height="10" rx="1.5" fill="#8C5A3C"/>` + fluff(39, 49, 8, 7, 8, '#51CF66') +
    `<circle cx="36" cy="46.5" r="1.8" fill="#fff" opacity=".6"/>` +
    fluff(85, 70, 5, 3, 6, '#E9D5B7', 'style="stroke-width:2"') + fluff(91, 64, 3.5, 2.2, 6, '#E9D5B7', 'style="stroke-width:2"') +
    `<circle class="m-ol" cx="82" cy="38" r="6.5" fill="#FFD43B"/><path d="M79 35.5 A3.5 3.5 0 0 1 82 34" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path d="M72 34 L69.5 32.5 M73 27.5 L71 25 M82 28 V25.4" stroke="#FAB005" stroke-width="2" stroke-linecap="round"/>`,

  'Ruta 40': () =>
    `<path class="m-ol" d="M14 62 L32 40 L42 50 L54 34 L68 48 L80 36 L106 62 V70 H14Z" fill="#9C7A5B"/>` +
    `<path d="M28 44.8 L32 40 L35.6 43.6 L32 46Z M50.6 38.4 L54 34 L58 38 L54 41Z M76.4 39.6 L80 36 L84 40 L80 42Z" fill="#fff"/>` +
    `<path class="m-ol" d="M14 66 H106 V110 H14Z" fill="#E9C46A"/>` +
    `<path class="m-ol" d="M56 66 H64 L92 110 H28Z" fill="#5C6670"/>` +
    `<path d="M60 70 V75 M60 81 V89 M60 96 V108" stroke="#FFD43B" stroke-width="2.6" stroke-linecap="round"/>` +
    `<rect class="m-ol" x="55" y="74" width="10" height="26" fill="#ADB5BD"/><path d="M57.5 76 V98" stroke="#fff" stroke-width="1.6" opacity=".7"/>` +
    `<path class="m-ol" style="stroke-width:3.4" d="${shield}" fill="#fff"/>` +
    `<path d="M41.5 33.5 H78.5 V43 H41.5Z" fill="#1C3F8C"/><path class="m-ol" d="M40 43 H80" fill="none"/>` +
    t(60, 40.6, 6.6, 'RUTA NAC.', '#fff', 'letter-spacing=".3"') +
    `<path d="M43 46 H77" stroke="#74ACDF" stroke-width="2.2"/>` +
    t(60, 69, 23, '40', D) +
    `<path d="M43.5 48 V57 C43.5 61 45 64 47 66" fill="none" stroke="#E9ECEF" stroke-width="2.4" stroke-linecap="round"/>`,

  'Panamericana': () =>
    `<path class="m-ol" d="M14 78 H106 V110 H14Z" fill="#5C6670"/>` +
    `<path d="M20 92 H34 M46 92 H60 M72 92 H86 M98 92 H106" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect class="m-ol" x="30" y="40" width="5" height="40" fill="#ADB5BD"/><rect class="m-ol" x="85" y="40" width="5" height="40" fill="#ADB5BD"/>` +
    `<path class="m-ol" d="M24 30 H96 L92 42 H28Z" fill="#F76707"/>` +
    `<path d="M30 33.5 H52" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
    t(60, 40, 10, 'PEAJE', '#fff', 'letter-spacing="1"') +
    `<rect class="m-ol" x="40" y="50" width="24" height="34" rx="2" fill="#1C7ED6"/>` +
    `<rect class="m-ol" x="38" y="46" width="28" height="6" rx="2" fill="#1864AB"/>` +
    `<rect class="m-ol" x="43" y="55" width="18" height="14" rx="2" fill="#D0EBFF"/>` +
    sheep(52, 66, .55, false) +
    `<rect class="m-ol" x="43" y="72" width="18" height="3" rx="1" fill="#1864AB"/>` +
    `<path d="M64 73 H100" stroke="${D}" stroke-width="8" stroke-linecap="round"/><path d="M64 73 H100" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/>` +
    `<path d="M70 73 H76 M82 73 H88 M94 73 H99" stroke="${RED}" stroke-width="4.2"/>` +
    `<circle class="m-ol" cx="66" cy="73" r="3.5" fill="#E03131"/>` +
    `<circle class="m-ol" cx="84" cy="56" r="8" fill="#FFD43B"/><circle cx="84" cy="56" r="5.3" fill="none" stroke="#F59F00" stroke-width="1.4"/>` + t(84, 60, 10, '$', '#E67700') +
    `<path class="m-ol" style="stroke-width:2.2" d="M76 47 L78 50 M92 47 L90 50" fill="none"/>`,

  'Soldadito de plomo': () =>
    `<ellipse class="m-ol" cx="60" cy="96" rx="19" ry="5" fill="#868E96"/><path d="M44 95 C50 92 70 92 76 95" stroke="#CED4DA" stroke-width="1.6" fill="none"/>` +
    `<path class="m-ol" d="M52 74 H68 L68 94 H61 V80 H59 V94 H52Z" fill="#F1F3F5"/>` +
    `<rect class="m-ol" x="50" y="90" width="10" height="5" rx="2" fill="#343A40"/><rect class="m-ol" x="60" y="90" width="10" height="5" rx="2" fill="#343A40"/>` +
    stick('M79 26 V86', '#8C5A3C', 2.6) + `<path class="m-ol" style="stroke-width:2" d="M79 26 L77 16 L81 26Z" fill="#DEE2E6"/>` +
    `<path class="m-ol" d="M47 56 C47 51 51 49 60 49 C69 49 73 51 73 56 V77 H47Z" fill="#1C5DB8"/>` +
    `<path d="M48 51 L72 75 M72 51 L48 75" stroke="#fff" stroke-width="3"/>` +
    `<circle cx="60" cy="63" r="2.2" fill="#FFD43B" stroke="${D}" stroke-width="1"/>` +
    `<rect class="m-ol" x="46" y="74" width="28" height="5" rx="1.5" fill="#fff"/>` +
    `<path class="m-ol" d="M73 56 C77 60 78 64 79 68" fill="none" stroke-width="7"/><path d="M73 56 C77 60 78 64 79 68" fill="none" stroke="#1C5DB8" stroke-width="4" stroke-linecap="round"/>` +
    `<circle class="m-ol" cx="79" cy="68" r="3" fill="#F8C9A0"/>` +
    `<path class="m-ol" d="M47 56 C43 61 42 66 43 72" fill="none" stroke-width="7"/><path d="M47 56 C43 61 42 66 43 72" fill="none" stroke="#1C5DB8" stroke-width="4" stroke-linecap="round"/>` +
    `<circle class="m-ol" cx="43" cy="72" r="3" fill="#F8C9A0"/>` +
        `<circle class="m-ol" cx="60" cy="42" r="9.5" fill="#F8C9A0"/>` +
    `<circle cx="56.5" cy="42" r="1.5" fill="${D}"/><circle cx="63.5" cy="42" r="1.5" fill="${D}"/>` +
    `<circle cx="54" cy="46" r="2.2" fill="#FF6B6B" opacity=".75"/><circle cx="66" cy="46" r="2.2" fill="#FF6B6B" opacity=".75"/>` +
    `<path d="M57 47 Q60 48.5 63 47" stroke="${D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
    `<path class="m-ol" d="M50 37 L49 22 H71 L70 37Z" fill="#212529"/><path d="M52 24 L53 35" stroke="#495057" stroke-width="2" stroke-linecap="round"/>` +
    `<rect class="m-ol" x="48" y="35" width="24" height="4" rx="1.5" fill="#212529"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M60 25 L63.5 29 L60 33 L56.5 29Z" fill="#FFD43B"/>` +
    `<path class="m-ol" d="M60 22 C56 18 57 13 60 12 C63 13 64 18 60 22Z" fill="${RED}"/>`,

  'Granadero a caballo': () =>
    `<path d="M44 70 C36 72 34 80 36 88" fill="none" stroke="${D}" stroke-width="7.6" stroke-linecap="round"/><path d="M44 70 C36 72 34 80 36 88" fill="none" stroke="#3B2314" stroke-width="4" stroke-linecap="round"/>` +
    stick('M50 80 V94', '#7A4421', 4) + stick('M70 80 V94', '#7A4421', 4) +
    `<path class="m-ol" d="M70 70 C72 60 76 53 80 48 C84 44 90 45 92 49 L96.5 57 C97.5 61 93.5 64 90 62 L86 59 C84 64 82 70 80 76Z" fill="#9C5B2E"/>` +
    `<ellipse class="m-ol" cx="60" cy="74" rx="19" ry="9.5" fill="#9C5B2E"/>` +
    `<path d="M70 66 C74 68 78 72 79 76" fill="#9C5B2E"/>` +
    `<path d="M46 70 C52 67 60 67 66 68" fill="none" stroke="#C47A45" stroke-width="2.4" stroke-linecap="round"/>` +
    stick('M55 80 V95', '#9C5B2E', 4.4) + stick('M74 79 V95', '#9C5B2E', 4.4) +
    `<path class="m-ol" style="stroke-width:2" d="M80 47 C76 50 72 56 70.5 66 L75 63 C76 57 78 53 83 49Z" fill="#3B2314"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M82 47 L83 40 L87 46Z" fill="#9C5B2E"/>` +
    `<circle cx="87" cy="52" r="1.8" fill="${D}"/><circle cx="87.5" cy="51.4" r=".6" fill="#fff"/><circle cx="94.4" cy="58.6" r="1" fill="${D}"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M50 66 H68 L66 79 H52Z" fill="${RED}"/><path d="M52.5 76 H65.5" stroke="#FFD43B" stroke-width="1.8"/>` +
    `<path class="m-ol" d="M51 69 V58 C51 53.5 54 52 59 52 C64 52 67 53.5 67 58 V69Z" fill="#1C3F8C"/>` +
    `<path d="M53 54.5 L66 67" stroke="#fff" stroke-width="2.6"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M55 52.6 L59 57 L63 52.6Z" fill="${RED}"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M49.5 58 C49.5 54 52 53 55 53.5 L54.5 58.5Z" fill="#FFD43B"/>` +
    `<path class="m-ol" d="M57 66 H65 L66 76 H59Z" fill="#F1F3F5"/><rect class="m-ol" x="58.5" y="75" width="8" height="9" rx="2" fill="#212529"/>` +
    stick('M65 58 L74 62', '#1C3F8C', 3.4) + `<circle class="m-ol" style="stroke-width:2" cx="75" cy="62" r="2.6" fill="#F8C9A0"/>` +
    `<path d="M77 62 L93 59.5" stroke="${D}" stroke-width="1.4"/>` +
    `<circle class="m-ol" cx="59" cy="45" r="8.5" fill="#F8C9A0"/>` +
    `<path class="m-ol" style="stroke-width:1.8" d="M50.5 43 C50.5 49 52 51 54 52.5 L53.5 45Z M67.5 43 C67.5 49 66 51 64 52.5 L64.5 45Z" fill="#5C3A21"/>` +
    `<circle cx="56" cy="45" r="1.4" fill="${D}"/><circle cx="62" cy="45" r="1.4" fill="${D}"/>` +
    `<path class="m-ol" style="stroke-width:1.6" d="M59 49 C57 47.6 54 48.4 54 50.4 C56 50 57.6 50 59 49.8 C60.4 50 62 50 64 50.4 C64 48.4 61 47.6 59 49Z" fill="#5C3A21"/>` +
    `<path class="m-ol" d="M50 40 C49.6 35 49.2 30 48.6 26 H69.4 C68.8 30 68.4 35 68 40Z" fill="#212529"/>` +
    `<path d="M52 28 L52.6 37" stroke="#495057" stroke-width="2" stroke-linecap="round"/>` +
    `<rect class="m-ol" x="48.5" y="38" width="21" height="4.4" rx="2" fill="#212529"/>` +
    star(59, 32, 4.4, '#FFD43B', 1.6, 2.6) +
    `<path class="m-ol" style="stroke-width:2" d="M50 36 C45 33 44 27 47 22 C50 25 52 30 51.4 36Z" fill="${RED}"/>`,

  'Cruce de los Andes': () =>
    `<path class="m-ol" d="M14 76 L36 46 L46 60 L62 40 L80 60 L88 48 L106 72 V110 H14Z" fill="#8D7BB5"/>` +
    `<path d="M62 40 L80 60 L88 48 L106 72 V110 H70 L72 78 L66 62Z" fill="#000" opacity=".12"/>` +
    `<path class="m-ol" style="stroke-width:2.2" d="M30.4 53.6 L36 46 L41 52.4 L38 51 L35 54 L33 51.5Z M56.4 48 L62 40 L67.6 47.4 L64.6 46 L62 49 L59.4 46Z M84.5 52.6 L88 48 L91.6 52.8 L88 51.5Z" fill="#fff"/>` +
    `<path class="m-ol" d="M14 88 C40 80 60 72 106 64 V110 H14Z" fill="#B49A7A"/>` +
    `<path d="M28 92 C46 86 66 78 96 70" fill="none" stroke="#D6C2A2" stroke-width="2" stroke-dasharray="3 5" stroke-linecap="round"/>` +
    `<path d="M62 40 V25" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:2" d="M62 26 H75 V35 H62Z" fill="#74ACDF"/><path d="M62.9 29.2 H74.2 V31.8 H62.9Z" fill="#fff"/><circle cx="68.5" cy="30.5" r="1.4" fill="#FAB005"/>` +
    knight(38, 86, .6, RED, true) + knight(52, 81, .6, BLUE, true) + knight(66, 76, .6, ORANGE, true) + knight(80, 71, .6, WHITE, true) +
    `<path d="M88 30 L92 32 L96 30" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,

  'Mazo marcado': () =>
    card(44, 66, -18) + card(76, 66, 18) +
    card(60, 62, 0,
      `<path d="M-8 -12 L2 -2 M2 -12 L-8 -2" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="5" cy="9" r="2.4" fill="#40C057" stroke="${D}" stroke-width="1"/>`) +
    `<path class="m-ol" style="stroke-width:2" d="M73 43 L66 43 L73 50Z" fill="#E5DBFF"/>` +
    `<path d="M48.5 81 L52 79 M53 81 L56 79" stroke="${RED}" stroke-width="1.8" stroke-linecap="round"/>` +
    g(84, 40, 1,
      `<rect class="m-ol" x="-4" y="-22" width="8" height="26" rx="1" fill="#FFD43B"/><path d="M-1.3 -20 V2" stroke="#FFF3BF" stroke-width="1.6"/>` +
      `<rect class="m-ol" x="-4" y="-27" width="8" height="6" rx="2" fill="#FF8FA3"/>` +
      `<path class="m-ol" d="M-4 4 L0 13 L4 4Z" fill="#F4D3A8"/><path d="M-1.4 10 L0 13 L1.4 10Z" fill="${D}"/>`, 30) ,

  'Tahúr del Delta': () =>
    `<path class="m-ol" d="M14 82 C24 79 30 84 40 81 C50 78 56 84 66 81 C76 78 84 84 94 81 C100 79 104 80 106 81 V110 H14Z" fill="#C79A5B"/>` +
    `<circle class="m-ol" cx="39" cy="69" r="10" fill="${RED}"/><circle class="m-ol" style="stroke-width:2" cx="39" cy="69" r="3" fill="#FFD43B"/>` +
    `<path d="M39 60 V66 M39 72 V78 M30 69 H36 M42 69 H48 M32.6 62.6 L36.9 66.9 M41.1 71.1 L45.4 75.4 M45.4 62.6 L41.1 66.9 M36.9 71.1 L32.6 75.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path class="m-ol" d="M30 74 H94 L86 88 H38Z" fill="#fff"/><path d="M32 77.5 H92" stroke="${RED}" stroke-width="3"/>` +
    `<path d="M38 88 L35 82 H90 L86 88Z" fill="#000" opacity=".08"/>` +
    `<rect class="m-ol" x="40" y="58" width="46" height="16" rx="2" fill="#F8F0E3"/>` +
    [47, 56, 65, 74, 82].map((x) => `<circle cx="${x - 1}" cy="66" r="3" fill="#FFD43B" stroke="${D}" stroke-width="1.4"/>`).join('') +
    `<rect class="m-ol" x="44" y="46" width="36" height="12" rx="2" fill="#7048E8"/>` +
    t(62, 55.5, 9, 'CASINO', '#FFD43B', 'letter-spacing=".6"') +
    [47, 54, 61, 68, 75].map((x, i) => `<circle cx="${x + 2}" cy="44" r="1.4" fill="${i % 2 ? RED : '#FFD43B'}" stroke="${D}" stroke-width=".8"/>`).join('') +
    `<rect class="m-ol" x="70" y="32" width="8" height="12" fill="#343A40"/><rect class="m-ol" x="68.5" y="30" width="11" height="4" rx="1" fill="${RED}"/>` +
    heart(66, 24.5, 3.6, RED, 1.8) + `<path class="m-ol" style="stroke-width:1.8" d="M56 26 L59.5 30.5 L56 35 L52.5 30.5Z" fill="${RED}"/>` +
    `<path d="M74 27 C72 24 76 22 74 19" fill="none" stroke="#ADB5BD" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M40 94 C44 92 48 96 52 94 M66 96 C70 94 74 98 78 96" fill="none" stroke="#E7C892" stroke-width="2" stroke-linecap="round"/>`,

  'El mago Fu Manchú': () =>
    card(36, 46, -28) + card(84, 46, 26) +
    `<path class="m-ol" d="M38 76 L42 98 C42 101 78 101 78 98 L82 76Z" fill="#212529"/>` +
    `<path d="M41 84 L79 84 L78.2 89 L41.8 89Z" fill="${RED}"/>` +
    `<path d="M46 80 L48 96" stroke="#495057" stroke-width="2.4" stroke-linecap="round"/>` +
    sheep(60, 62, .95, false) +
    `<ellipse class="m-ol" cx="60" cy="76" rx="25" ry="6" fill="#343A40"/>` +
    `<path d="M41 75 C46 72 74 72 79 75" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M40 77.5 C48 80 72 80 80 77.5" fill="none" stroke="#6C757D" stroke-width="1.6" stroke-linecap="round"/>` +
    stick('M93 72 L81 50', '#212529', 3) + `<path d="M83.3 54.4 L81 50" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
    star(62, 30, 5, '#FFD43B', 1.8) + star(48, 35, 3.2, '#FFD43B', 1.6) + star(75, 35, 3.6, '#FFD43B', 1.6) +
    `<path d="M77 47 L75 43 M83 45 L85 41 M87 51 L91 50" stroke="#FAB005" stroke-width="2" stroke-linecap="round"/>`,

  'Fardito': () =>
    `<path d="M48 38 C46 34 50 32 48 28 M60 37 C58 33 62 31 60 27 M72 38 C70 34 74 32 72 28" fill="none" stroke="#8CC152" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path class="m-ol" d="M30 54 L40 44 H90 L80 54Z" fill="#FFE08A"/>` +
    `<path class="m-ol" d="M80 54 L90 44 V82 L80 92Z" fill="${WHEAT_D}"/>` +
    `<rect class="m-ol" x="30" y="54" width="50" height="38" rx="2" fill="${WHEAT}"/>` +
    `<path d="M34 62 H40 M45 60 H52 M33 84 H39 M58 87 H66 M72 62 H77 M73 80 H77" stroke="#C98A1A" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M83 58 L87 54 M83 70 L87 66 M83 82 L87 78 M46 50 H54 M62 48 H70" stroke="#B87A12" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="M33 54 l-4 -4 M36 51 l-2 -6 M86 47 l5 -4 M88 44 l2 -6 M82 92 l4 3 M30 70 l-5 1 M30 80 l-5 -2" stroke="${D}" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path d="M33 54 l-4 -4 M36 51 l-2 -6 M86 47 l5 -4 M88 44 l2 -6 M82 92 l4 3 M30 70 l-5 1 M30 80 l-5 -2" stroke="${WHEAT}" stroke-width="1.4" stroke-linecap="round"/>` +
    `<path d="M42 92 V54 L52 44 M68 92 V54 L78 44" fill="none" stroke="${D}" stroke-width="5.4" stroke-linejoin="round"/>` +
    `<path d="M42 92 V54 L52 44 M68 92 V54 L78 44" fill="none" stroke="#C0392B" stroke-width="2.4" stroke-linejoin="round"/>` +
    `<circle cx="50" cy="71" r="2.2" fill="${D}"/><circle cx="60" cy="71" r="2.2" fill="${D}"/><circle cx="50.8" cy="70.2" r=".8" fill="#fff"/><circle cx="60.8" cy="70.2" r=".8" fill="#fff"/>` +
    `<circle cx="47" cy="77" r="2.6" fill="#FF8FA3" opacity=".7"/><circle cx="63" cy="77" r="2.6" fill="#FF8FA3" opacity=".7"/>` +
    `<path d="M52 76 Q55 79 58 76" fill="none" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`,

  'Rey del heno': () => {
    let spiral = ''
    for (let i = 0; i <= 40; i++) { const a = i * .5, r = 3 + i * .5; spiral += (i ? 'L' : 'M') + f(60 + r * Math.cos(a)) + ' ' + f(68 + r * Math.sin(a)) }
    return `<path class="m-ol" d="M36 60 C30 76 30 90 28 100 H92 C90 90 90 76 84 60Z" fill="#C92A2A"/>` +
      `<path d="M30 92 H90 V100 H29Z" fill="#fff"/><path d="M36 96 h3 M48 96 h3 M60 96 h3 M72 96 h3 M84 96 h3" stroke="${D}" stroke-width="2" stroke-linecap="round"/>` +
      `<circle class="m-ol" cx="60" cy="68" r="24" fill="${WHEAT}"/>` +
      `<path d="${spiral}" fill="none" stroke="#D9961E" stroke-width="2" stroke-linecap="round"/>` +
      `<circle class="m-ol" cx="60" cy="68" r="24" fill="none"/>` +
      `<path d="M50 64 Q53 61 56 64 M64 64 Q67 61 70 64" fill="none" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>` +
      `<circle cx="48" cy="72" r="3" fill="#FF8FA3" opacity=".75"/><circle cx="72" cy="72" r="3" fill="#FF8FA3" opacity=".75"/>` +
      `<path class="m-ol" style="stroke-width:2.2" d="M54 73 Q60 79 66 73Z" fill="#fff"/>` +
      `<path class="m-ol" d="M44 46 L42 28 L51 36 L60 24 L69 36 L78 28 L76 46Z" fill="#FFD43B"/>` +
      `<path d="M45 42 H75" stroke="#F59F00" stroke-width="2"/>` +
      `<circle class="m-ol" style="stroke-width:1.6" cx="60" cy="38" r="2.6" fill="${RED}"/><circle class="m-ol" style="stroke-width:1.6" cx="50" cy="40" r="1.8" fill="#4DABF7"/><circle class="m-ol" style="stroke-width:1.6" cx="70" cy="40" r="1.8" fill="#4DABF7"/>` +
      wheat(88, 96, .9, 8) + `<circle class="m-ol" cx="86" cy="82" r="3.5" fill="#F8C9A0"/>`
  },

  'Granero del mundo': (u) =>
    `<defs><clipPath id="gl${u}"><circle cx="60" cy="56" r="23"/></clipPath></defs>` +
    `<path class="m-ol" d="M52 80 L50 92 H70 L68 80Z" fill="#ADB5BD"/><rect class="m-ol" x="42" y="90" width="36" height="6" rx="3" fill="#868E96"/>` +
    `<circle cx="60" cy="56" r="23" fill="#4DABF7"/>` +
    `<g clip-path="url(#gl${u})">` +
    `<path class="m-ol" style="stroke-width:2" d="M50 37 C56 33 64 35 68 39 C74 41 80 45 78 51 C76 57 70 59 68 63 C66 69 62 73 60.5 80 L58.5 82 C56.5 76 56 70 54 64 C50 58 46 52 46 46 C46 42 47.5 39.5 50 37Z" fill="${GRASS}"/>` +
    `<path d="M57 64 C58 70 59 75 60 80 L61.5 79 C62.5 73 64 69 66 64Z" fill="${WHEAT}"/>` +
    `<path d="M84 34 C88 40 88 48 86 52 L80 44Z M30 50 C34 48 36 54 34 58 L30 60Z" fill="${GRASS}" stroke="${D}" stroke-width="2"/>` +
    `<path d="M37 56 A23 23 0 0 0 60 79 A26 26 0 0 1 37 56Z" fill="#000" opacity=".12"/>` +
    `</g>` +
    `<ellipse cx="50" cy="42" rx="4" ry="2.4" fill="#fff" opacity=".6" transform="rotate(-35 50 42)"/>` +
    `<circle class="m-ol" cx="60" cy="56" r="23" fill="none"/>` +
    `<path d="M61 68 V52" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/>` +
    `<path class="m-ol" style="stroke-width:1.6" d="M61 52 H71 V59 H61Z" fill="#74ACDF"/><path d="M61.8 54.4 H70.2 V56.6 H61.8Z" fill="#fff"/><circle cx="66" cy="55.5" r="1" fill="#FAB005"/>` +
    wheat(30, 92, .85, -22) + wheat(38, 94, .85, -8) + wheat(90, 92, .85, 22) + wheat(82, 94, .85, 8) +
    `<path class="m-ol" d="M28 84 C34 90 44 94 50 92 L52 98 C42 100 32 94 26 88Z" fill="#74ACDF"/>` +
    `<path class="m-ol" d="M92 84 C86 90 76 94 70 92 L68 98 C78 100 88 94 94 88Z" fill="#74ACDF"/>` +
    `<path d="M29 87 C35 92 43 95 50 94.6 M91 87 C85 92 77 95 70 94.6" fill="none" stroke="#fff" stroke-width="1.6"/>`,

  'Loteo': () =>
    `<path class="m-ol" d="M14 58 C40 52 80 52 106 58 V110 H14Z" fill="${GRASS}"/>` +
    `<path d="M30 58 L22 104 M52 55 L50 104 M72 55 L78 104 M92 57 L104 100 M14 74 C40 70 80 70 106 74 M14 90 C40 86 80 86 106 90" fill="none" stroke="#fff" stroke-width="1.8" stroke-dasharray="3 3" opacity=".9"/>` +
    [[29, 66], [72, 64], [51, 80], [94, 76], [27, 84]].map(([x, y]) => `<rect class="m-ol" style="stroke-width:1.6" x="${x - 1.5}" y="${y - 5}" width="3" height="6" fill="#E8590C"/>`).join('') +
    house(41, 73, .85, BLUE) + city(84, 89, .8, ORANGE) + house(62, 92, .85, RED) +
    `<rect class="m-ol" x="37" y="40" width="4" height="22" fill="#8C5A3C"/><rect class="m-ol" x="79" y="40" width="4" height="20" fill="#8C5A3C"/>` +
    `<rect class="m-ol" x="30" y="25" width="60" height="21" rx="3" fill="#FFF3BF"/>` +
    t(60, 40, 14, 'LOTEO', RED, 'letter-spacing="1"') +
    `<rect class="m-ol" x="56" y="44" width="30" height="9" rx="2" fill="${RED}" transform="rotate(-6 71 48)"/>` +
    t(71, 51.4, 6.8, '¡VENDO!', '#fff', 'transform="rotate(-6 71 48)"'),

  'Country con seguridad': () =>
    city(78, 58, 1.05, BLUE) + house(58, 58, 1, RED) + house(96, 58, .9, ORANGE) +
    fluff(68, 40, 6, 6, 7, '#51CF66', 'style="stroke-width:2.2"') +
    `<rect class="m-ol" x="20" y="58" width="90" height="46" fill="#9BD86C"/>` +
    [56, 64, 72, 80, 88, 96].map((x) => `<path class="m-ol" style="stroke-width:2" d="M${x - 3} 78 V66 L${x} 62 L${x + 3} 66 V78Z" fill="#fff"/>`).join('') +
    `<rect class="m-ol" style="stroke-width:2" x="50" y="68" width="56" height="3" fill="#fff"/>` +
    `<path class="m-ol" d="M28 46 H56 L53 39 H31Z" fill="${RED}"/>` +
    `<rect class="m-ol" x="31" y="46" width="22" height="44" fill="#E9ECEF"/>` +
    `<rect class="m-ol" x="34" y="49" width="16" height="16" rx="1.5" fill="#D0EBFF"/>` +
    sheep(42, 62, .62, false) + `<path class="m-ol" style="stroke-width:1.6" d="M37.5 54.4 C37.5 50.6 46.5 50.6 46.5 54.4Z" fill="#1864AB"/><rect class="m-ol" style="stroke-width:1.6" x="36.5" y="53.6" width="12" height="2" rx="1" fill="#1864AB"/>` +
    `<rect class="m-ol" x="32" y="65" width="20" height="3" rx="1" fill="#ADB5BD"/>` +
    star(42, 76, 4.6, '#FFD43B', 1.8) +
    `<path d="M52 86 H100" stroke="${D}" stroke-width="8" stroke-linecap="round"/><path d="M52 86 H100" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/>` +
    `<path d="M56 86 H62 M68 86 H74 M80 86 H86 M92 86 H98" stroke="${RED}" stroke-width="4.2"/>` +
    `<circle class="m-ol" cx="53" cy="86" r="3.5" fill="#FFD43B"/>` +
    `<rect class="m-ol" x="20" y="90" width="90" height="16" fill="#868E96"/>`,

  'Puerto Madero': (u) =>
    `<defs><linearGradient id="pm${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A5D8FF"/><stop offset="1" stop-color="#4DABF7"/></linearGradient></defs>` +
    `<path class="m-ol" d="M46 76 V32 L58 26 V76Z" fill="url(#pm${u})"/><path class="m-ol" d="M58 76 V36 C64 32 70 32 74 36 V76Z" fill="url(#pm${u})"/><path class="m-ol" d="M74 76 V44 H86 V76Z" fill="url(#pm${u})"/>` +
    `<path d="M50 34 V70 M54 32 V70 M62 40 V70 M66 38 V70 M70 40 V70 M78 48 V70 M82 48 V70" stroke="#fff" stroke-width="1.2" opacity=".55"/>` +
    `<path d="M48 42 L56 38 M60 44 L72 42" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    stick('M33 76 V42', '#E03131', 3) + stick('M27 46 L46 42 L42 50', '#E03131', 3) +
    `<path d="M43 50 V58" stroke="${D}" stroke-width="1.6"/><rect class="m-ol" style="stroke-width:1.8" x="40.5" y="57" width="5" height="4" fill="#FFD43B"/>` +
    `<rect class="m-ol" x="20" y="74" width="80" height="6" fill="#ADB5BD"/>` +
    `<path class="m-ol" d="M20 80 H100 V110 H20Z" fill="#1C7ED6"/>` +
    `<path d="M30 97 q4 -3 8 0 t8 0 M68 100 q4 -3 8 0 t8 0 M76 91 q4 -3 8 0" fill="none" stroke="#74C0FC" stroke-width="2" stroke-linecap="round"/>` +
    [[.3, 62], [.45, 56], [.6, 50], [.75, 44], [.9, 38]].map(([k, xe]) => `<path d="M${f(72 - 22 * k)} ${f(86 - 43 * k)} L${xe} 86" stroke="${D}" stroke-width="1.1"/>`).join('') +
    stick('M24 86 H96', '#fff', 3.4) +
    `<path class="m-ol" d="M68 88 L76 88 L50 43Z" fill="#fff"/><path d="M71 85 L54 53" stroke="#DEE2E6" stroke-width="1.6" stroke-linecap="round"/>`,
}
