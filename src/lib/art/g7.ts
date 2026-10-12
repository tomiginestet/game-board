// Ilustraciones de las medallas de Ajedrez, Ta-te-ti, Sushi Go!, Código Secreto, Aventureros al Tren, Jenga y Wavelength.
import { D, f, heart, star, starPts, stick, t } from './helpers'

// ── Piezas reutilizables ──────────────────────────────────────────────
const ol = (sw: number) => `class="m-ol" style="stroke-width:${f(sw)}"`
const sparkle = (x: number, y: number, r: number, c = '#FFD43B') => `<polygon ${ol(1.6)} points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`
const burst = (cx: number, cy: number, R: number, r: number, n: number, fill: string) => `<polygon ${ol(2)} points="${starPts(cx, cy, R, r, n)}" fill="${fill}"/>`
const shine = (d: string, w = 2.4, o = .6) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="${o}"/>`
const line = (d: string, c: string, w = 2, extra = '') => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`
const dots = (pts: readonly (readonly [number, number])[], r: number, c: string) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')
/** Carita: ojos a ±dx de (x,y), sonrisa debajo. */
const face = (x: number, y: number, dx = 4, r = 1.6, mood: 'smile' | 'o' | 'proud' | 'worry' | 'smug' = 'smile', blush = true) =>
  (mood === 'proud' || mood === 'smug'
    ? line(`M${x - dx - 1.6} ${y} Q${x - dx} ${y - 2} ${x - dx + 1.6} ${y} M${x + dx - 1.6} ${y} Q${x + dx} ${y - 2} ${x + dx + 1.6} ${y}`, D, 1.5)
    : `<circle cx="${x - dx}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${x + dx}" cy="${y}" r="${r}" fill="${D}"/>`) +
  (blush ? `<circle cx="${f(x - dx - 2.4)}" cy="${f(y + 3)}" r="${f(r * 1.3)}" fill="#FF8FA3" opacity=".7"/><circle cx="${f(x + dx + 2.4)}" cy="${f(y + 3)}" r="${f(r * 1.3)}" fill="#FF8FA3" opacity=".7"/>` : '') +
  (mood === 'o' ? `<ellipse cx="${x}" cy="${f(y + 4)}" rx="1.4" ry="1.9" fill="${D}"/>`
    : mood === 'worry' ? line(`M${x - 2.4} ${y + 4.6} Q${x} ${y + 3} ${x + 2.4} ${y + 4.6}`, D, 1.4)
    : mood === 'smug' ? line(`M${x - 2} ${y + 3.6} Q${x + 1} ${y + 5} ${x + 3} ${y + 2.8}`, D, 1.4)
    : line(`M${x - 2.4} ${y + 3} Q${x} ${y + 5.4} ${x + 2.4} ${y + 3}`, D, 1.4))

// Ajedrez: piezas con la base en (x,y).
type PieceKind = 'pawn' | 'rook' | 'knight' | 'queen' | 'king' | 'bishop'
const BASE = '<rect x="-13" y="-6" width="26" height="6" rx="2.5"/>'
const PIECES: Record<PieceKind, string> = {
  pawn: `<path d="M-10 -5 C-9 -11 -5 -15 -4.5 -21 H4.5 C5 -15 9 -11 10 -5Z"/>${BASE}<rect x="-7.5" y="-24" width="15" height="4" rx="2"/><circle cy="-31" r="7.5"/>`,
  rook: `<path d="M-9 -5 L-7.5 -30 H7.5 L9 -5Z"/>${BASE}<rect x="-10.5" y="-33" width="21" height="4" rx="1.5"/><path d="M-10.5 -32 V-42 H-6 V-38 H-2 V-42 H2 V-38 H6 V-42 H10.5 V-32Z"/>`,
  knight: `${BASE}<path d="M-11 -5 C-11 -12 -6 -16 -4 -20 C-7 -19 -11 -19 -13 -21 C-15 -23 -14 -27 -11 -29 L-4 -36 C-3 -39 -1 -42 1 -44 L3 -40 C9 -38 13 -31 12 -21 C11 -14 11 -9 11 -5Z"/>`,
  queen: `<path d="M-10 -5 C-8 -12 -6 -20 -6 -27 H6 C6 -20 8 -12 10 -5Z"/>${BASE}<rect x="-8.5" y="-30" width="17" height="4" rx="2"/><path d="M-8 -29 L-11 -41 L-5 -35 L0 -43 L5 -35 L11 -41 L8 -29Z"/><circle cx="-11" cy="-41" r="2"/><circle cx="0" cy="-43.5" r="2.2"/><circle cx="11" cy="-41" r="2"/>`,
  king: `<path d="M-10 -5 C-8 -12 -6 -20 -6 -27 H6 C6 -20 8 -12 10 -5Z"/>${BASE}<rect x="-8.5" y="-30" width="17" height="4" rx="2"/><path d="M-8 -29 C-11 -34 -10 -38 -6 -38 C-3 -38 -1 -36 0 -34 C1 -36 3 -38 6 -38 C10 -38 11 -34 8 -29Z"/><path d="M-1.6 -46 H1.6 V-43 H4.4 V-40 H1.6 V-36 H-1.6 V-40 H-4.4 V-43 H-1.6Z"/>`,
  bishop: `<path d="M-10 -5 C-8 -12 -6 -18 -5.5 -24 H5.5 C6 -18 8 -12 10 -5Z"/>${BASE}<rect x="-8" y="-27" width="16" height="4" rx="2"/><path d="M0 -44 C-7 -38 -8 -32 -5 -27 H5 C8 -32 6 -37 3 -40 L-1 -34 L1 -41Z"/><circle cy="-45" r="2"/>`,
}
const piece = (k: PieceKind, x: number, y: number, s: number, fill: string, rot = 0, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g ${ol(2.6 / s)} fill="${fill}">${PIECES[k]}</g>` +
  (k === 'knight' ? `<circle cx="-3" cy="-32" r="1.6" fill="${D}"/><circle cx="-11" cy="-24" r="1" fill="${D}"/><path d="M3 -40 C7 -36 9 -30 9 -22" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>`
    : k === 'pawn' ? `<ellipse cx="-3" cy="-34" rx="2.2" ry="1.4" fill="#fff" opacity=".8" transform="rotate(-30 -3 -34)"/>`
    : `<path d="M-4 -24 C-5 -16 -6 -11 -7 -7" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>`) +
  extra + `</g>`
/** Tablerito en perspectiva (rombo) con n×n casillas. */
const isoBoard = (cx: number, cy: number, w: number, h: number, n: number, light = '#FFE8CC', dark = '#9C6644') => {
  const p = (a: number, b: number) => `${f(cx - w + w * a / n + w * b / n)} ${f(cy - h * a / n + h * b / n)}`
  let sq = ''
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2) sq += `M${p(i, j)} L${p(i + 1, j)} L${p(i + 1, j + 1)} L${p(i, j + 1)}Z `
  return `<path ${ol(2)} d="M${cx - w} ${cy} L${cx} ${cy + h} L${cx + w} ${cy} V${cy + 2.5} L${cx} ${cy + h + 2.5} L${cx - w} ${cy + 2.5}Z" fill="#6B3E1F"/>` +
    `<path d="M${p(0, 0)} L${p(n, 0)} L${p(n, n)} L${p(0, n)}Z" fill="${light}"/><path d="${sq}" fill="${dark}"/><path ${ol(2)} d="M${p(0, 0)} L${p(n, 0)} L${p(n, n)} L${p(0, n)}Z" fill="none"/>`
}
/** Nube (contorno con festones) centrada en (cx,cy). */
const fluff = (cx: number, cy: number, rx: number, ry: number, n: number, fill: string, sw = 2.4) => {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2, x = f(cx + rx * Math.cos(a)), y = f(cy + ry * Math.sin(a))
    d += i ? `A${f(Math.PI * (rx + ry) / n * .62)} ${f(Math.PI * (rx + ry) / n * .62)} 0 0 1 ${x} ${y} ` : `M${x} ${y} `
  }
  return `<path ${ol(sw)} d="${d}Z" fill="${fill}"/>`
}
const grapes = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -12 C1 -16 3 -18 6 -19" stroke="#6B3E1F" stroke-width="2" fill="none" stroke-linecap="round"/>` +
  `<path ${ol(1.6 / s)} d="M1 -14 C6 -20 13 -17 12 -11 C8 -10 4 -11 1 -14Z" fill="#69DB7C"/>` +
  ([[-6, -9], [0, -10], [6, -9], [-3, -4], [3, -4], [-6, 1], [0, 1], [6, 1], [-3, 6], [3, 6], [0, 11]] as const)
    .map(([a, b]) => `<circle ${ol(1.4 / s)} cx="${a}" cy="${b}" r="3.6" fill="#9C36B5"/><circle cx="${a - 1.2}" cy="${b - 1.2}" r="1" fill="#E599F7"/>`).join('') + `</g>`

// Ta-te-ti: grilla de 3×3 centrada en (x,y) con celdas de lado c.
const grid = (x: number, y: number, c: number, col: string, w = 2.4) => {
  const a = c * 1.5, b = c / 2
  return line(`M${x - b} ${y - a} V${y + a} M${x + b} ${y - a} V${y + a} M${x - a} ${y - b} H${x + a} M${x - a} ${y + b} H${x + a}`, col, w)
}
const xMark = (x: number, y: number, r: number, col: string, w = 2.4, extra = '') => line(`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`, col, w, extra)
const oMark = (x: number, y: number, r: number, col: string, w = 2.4, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" ${extra}/>`

// Sushi
const nigiri = (x: number, y: number, s: number, rot = 0, extra = '', fish = '#FF8C5A') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path ${ol(2.4 / s)} d="M-12 0 C-13 -6 -9 -7 0 -7 C9 -7 13 -6 12 0 C12 6 -12 6 -12 0Z" fill="#fff"/>` +
  `<path d="M-8 2 h1.6 M-3 4 h1.6 M4 3 h1.6 M8 0 h1.4" stroke="#DEE2E6" stroke-width="1.2" stroke-linecap="round"/>` +
  `<path ${ol(2.4 / s)} d="M-14 -4 C-14 -11 -6 -13 0 -12 C8 -13 15 -10 14 -4 C10 -7 -10 -7 -14 -4Z" fill="${fish}"/>` +
  `<path d="M-8 -11 L-6 -6.4 M-2 -12 L0 -6.6 M4 -12 L6 -6.6 M9 -11 L10.6 -7" stroke="#fff" stroke-width="1.4" opacity=".75" stroke-linecap="round"/>${extra}</g>`
const maki = (x: number, y: number, s: number, core = '#FF8C5A') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path ${ol(2.4 / s)} d="M-8 -8 V2 C-8 6 8 6 8 2 V-8Z" fill="#2B3A2E"/>` +
  `<ellipse ${ol(2.4 / s)} cx="0" cy="-8" rx="8" ry="3.6" fill="#fff"/><ellipse cx="0" cy="-8" rx="3" ry="1.4" fill="${core}"/><path d="M-5 -2 V2" stroke="#fff" stroke-width="1.4" opacity=".35" stroke-linecap="round"/></g>`

// Código Secreto: carta de palabra (beige), de agente rojo/azul, o del asesino.
const wcard = (x: number, y: number, rot = 0, s = 1, kind: 'w' | 'r' | 'b' = 'w') => {
  const c = kind === 'r' ? '#FF6B6B' : kind === 'b' ? '#4DABF7' : '#F1E3CF'
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(2.4 / s)} x="-12" y="-8" width="24" height="16" rx="2.4" fill="${c}"/>` +
    (kind === 'w' ? `<rect x="-9" y="0" width="18" height="5" rx="1" fill="#fff"/><path d="M-6 2.5 H6" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/><circle cx="6" cy="-4" r="2" fill="#D9B98C"/>`
      : `<circle cx="0" cy="-2" r="3" fill="#fff" opacity=".85"/><path d="M-5 6 C-5 1 5 1 5 6Z" fill="#fff" opacity=".85"/>`) + `</g>`
}
const skullCard = (x: number, y: number, s = 1, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect ${ol(2.4 / s)} x="-10" y="-13" width="20" height="26" rx="2.6" fill="#212529"/>` +
  `<path d="M-6 -2 C-6 -9 6 -9 6 -2 C6 1 4 2 4 4 H-4 C-4 2 -6 1 -6 -2Z" fill="#F8F9FA"/><circle cx="-2.4" cy="-2.4" r="1.7" fill="#212529"/><circle cx="2.4" cy="-2.4" r="1.7" fill="#212529"/>` +
  `<path d="M-2.6 4 V6.4 M0 4 V6.4 M2.6 4 V6.4" stroke="#F8F9FA" stroke-width="1.4"/><path d="M-6 9 L6 9" stroke="#F8F9FA" stroke-width="1.2" opacity=".5"/></g>`

// Trenes: locomotora a vapor (mirando a la derecha) y vagón, con las ruedas sobre (x,y).
const steamLoco = (x: number, y: number, s: number, c: string, extra = '') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g ${ol(2.4 / s)}>` +
  `<path d="M18 -10 L25 -1 H16Z" fill="#FCC419"/><rect x="-24" y="-13" width="44" height="5" rx="1.5" fill="#343A40"/>` +
  `<path d="M8 -24 L7 -36 H15 L14 -24Z" fill="#343A40"/><rect x="-6" y="-26" width="25" height="14" rx="6" fill="${c}"/><path d="M-1 -26 a4 4 0 0 1 8 0Z" fill="#FCC419"/>` +
  `<rect x="-22" y="-32" width="17" height="21" rx="2" fill="${c}"/><rect x="-25" y="-35" width="23" height="4" rx="1.5" fill="#343A40"/><rect x="-18" y="-28" width="9" height="8" rx="1.5" fill="#FFE066"/>` +
  `<circle cx="-12" cy="-6" r="6" fill="#495057"/><circle cx="2" cy="-6" r="6" fill="#495057"/><circle cx="15" cy="-4" r="4" fill="#495057"/></g>` +
  `<circle cx="-12" cy="-6" r="1.8" fill="#CED4DA"/><circle cx="2" cy="-6" r="1.8" fill="#CED4DA"/><path d="M-12 -4 H2" stroke="#CED4DA" stroke-width="1.8"/>` +
  `<path d="M-2 -22 H14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".45"/><circle cx="19" cy="-19" r="1.8" fill="#FFE066"/>${extra}</g>`
const wagon = (x: number, y: number, s: number, c: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g ${ol(2.4 / s)}><rect x="-12" y="-28" width="24" height="18" rx="2.5" fill="${c}"/><rect x="-14" y="-30" width="28" height="4" rx="1.5" fill="#343A40"/>` +
  `<rect x="-14" y="-12" width="28" height="4" rx="1.5" fill="#343A40"/><rect x="-8" y="-23" width="6" height="6" rx="1" fill="#FFE066"/><rect x="2" y="-23" width="6" height="6" rx="1" fill="#FFE066"/>` +
  `<circle cx="-7" cy="-5" r="4.4" fill="#495057"/><circle cx="7" cy="-5" r="4.4" fill="#495057"/></g><path d="M-14 -10 L-17 -10" stroke="${D}" stroke-width="2"/></g>`

// Jenga: bloque suelto (centrado) y torre vista de frente, filas alternadas; `skip` saca bloques ('4c' = fila 4, centro; 'l'/'r' = costados).
const jblock = (x: number, y: number, w: number, h: number, rot = 0) =>
  `<g transform="rotate(${rot} ${x} ${y})"><rect ${ol(1.8)} x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="1" fill="#F4C98A"/><path d="M${f(x - w / 2 + 2)} ${f(y - h * .1)} H${f(x + w / 2 - 3)}" stroke="#C9852E" stroke-width=".9"/></g>`
const tower = (x: number, base: number, rows: number, w: number, h: number, skip: string[] = []) => {
  let r = ''
  for (let i = 0; i < rows; i++) {
    const y = base - (i + 1) * h
    if (i % 2) r += `<rect ${ol(1.8)} x="${f(x - w / 2)}" y="${f(y)}" width="${w}" height="${h}" rx="1" fill="#E9B872"/><path d="M${f(x - w / 2 + 3)} ${f(y + h * .4)} H${f(x + w / 2 - 4)}" stroke="#C9852E" stroke-width=".9"/>`
    else ['l', 'c', 'r'].forEach((k, j) => {
      if (!skip.includes(`${i}${k}`)) r += `<rect ${ol(1.8)} x="${f(x - w / 2 + j * w / 3)}" y="${f(y)}" width="${f(w / 3)}" height="${h}" rx="1" fill="${j === 1 ? '#F4C98A' : '#E9B872'}"/><circle cx="${f(x - w / 2 + (j + .5) * w / 3)}" cy="${f(y + h / 2)}" r="${f(h * .18)}" fill="none" stroke="#C9852E" stroke-width=".8"/>`
      else r += `<rect x="${f(x - w / 2 + j * w / 3)}" y="${f(y)}" width="${f(w / 3)}" height="${h}" fill="#6B3E1F"/>`
    })
  }
  return r
}

export const G7_ART: Record<string, (u: number) => string> = {
  // ══ AJEDREZ ══
  // ── Jaque mate ──
  'Caballito de madera': () => {
    let roof = ''
    for (let i = 0; i < 6; i++) roof += `<path ${ol(2)} d="M${31 + i * 10} 36 a5 5 0 0 0 10 0Z" fill="${i % 2 ? '#FFD43B' : '#E03131'}"/>`
    return `<path ${ol(2.6)} d="M28 36 Q42 24 60 20 Q78 24 92 36Z" fill="#E03131"/><path d="M60 21 L44 35 M60 21 L76 35" stroke="#FFD43B" stroke-width="3.4"/><path ${ol(2.6)} d="M28 36 Q42 24 60 20 Q78 24 92 36Z" fill="none"/>` + roof +
      stick('M60 40 V98', '#FFE066', 3) + line('M60 42 V96', '#E03131', 3, 'stroke-dasharray="2.4 4.6" stroke-linecap="butt"') +
      line('M84 41 V50', D, 1.6) + `<circle cx="84" cy="54" r="3.6" fill="none" stroke="${D}" stroke-width="4.2"/><circle cx="84" cy="54" r="3.6" fill="none" stroke="#FCC419" stroke-width="2"/>` +
      piece('knight', 61, 94, 1.12, '#D9A066', 0, `<path ${ol(2)} d="M3 -26 C7 -28 12 -26 12 -21 L11 -16 C8 -17 5 -19 3 -26Z" fill="#E03131"/><path d="M-7 -12 C-4 -14 0 -13 3 -15 M-2 -6 C2 -8 6 -7 9 -9" stroke="#A0632D" stroke-width="1.2" fill="none" opacity=".7"/><path d="M1 -42 C4 -40 7 -38 8 -35 M3 -38 L7 -34" stroke="#6B3E1F" stroke-width="2" fill="none" stroke-linecap="round"/>`) +
      line('M34 84 V64 H43', '#868E96', 2.2, 'stroke-dasharray="3 3"') + `<path d="M42 60.5 L47 64 L42 67.5Z" fill="#868E96"/>` +
      sparkle(88, 70, 3.5) + sparkle(30, 50, 3)
  },
  'Torre de marfil': () =>
    fluff(36, 86, 13, 6, 8, '#fff', 2.2) + fluff(86, 84, 11, 5, 7, '#E7F5FF', 2.2) +
    piece('rook', 60, 90, 1.42, '#FFF8E7', 0,
      `<path d="M-6 -14 H-1 M2 -20 H7 M-7 -27 H-3 M1 -10 H6" stroke="#E9D8B4" stroke-width="1.2"/>` +
      `<path ${ol(1.6)} d="M-4.5 -14.5 V-21 a4.5 4.5 0 0 1 9 0 V-14.5Z" fill="#5C3A1E"/><ellipse cx="0" cy="-19" rx="2.4" ry="2" fill="#fff"/><circle cx="0.4" cy="-19" r="1.1" fill="${D}"/>` +
      `<path d="M-2.6 -22.4 Q0 -24 2.6 -22.4" stroke="${D}" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-19" r="2.9" fill="#A5D8FF" fill-opacity=".35" stroke="#FCC419" stroke-width="1.1"/><path d="M2.6 -17.6 C4 -14 3 -11 5.5 -9" stroke="#FCC419" stroke-width=".7" fill="none" stroke-dasharray="1 .6"/>`) +
    line('M30 46 q2 -2 4 0 q2 -2 4 0 M80 36 q2 -2 4 0 q2 -2 4 0', D, 1.6) + sparkle(88, 56, 4) + sparkle(32, 64, 3, '#fff'),
  'Najdorf en el café': () =>
    `<path ${ol(2.6)} d="M26 96 C28 74 40 66 60 66 C80 66 92 74 94 96Z" fill="#343A40"/><path d="M54 66 L60 82 L66 66Z" fill="#fff"/><path ${ol(1.6)} d="M58.4 68 L60 79 L61.6 68Z" fill="#E03131"/>` +
    `<path d="M48 68 L56 80 M72 68 L64 80" stroke="#212529" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect ${ol(2.2)} x="55" y="58" width="10" height="9" rx="3" fill="#F4BE8F"/>` +
    `<circle ${ol(2.6)} cx="46" cy="44" r="4" fill="#F4BE8F"/><circle ${ol(2.6)} cx="74" cy="44" r="4" fill="#F4BE8F"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="44" rx="13" ry="15" fill="#F4BE8F"/>` +
    `<path ${ol(1.8)} d="M47 44 C45 36 47 32 50 31 C49 35 49 38 50 41Z M73 44 C75 36 73 32 70 31 C71 35 71 38 70 41Z" fill="#CED4DA"/>` +
    shine('M52 32 C55 30 59 30 62 31', 2.2, .7) +
    `<circle cx="54" cy="44" r="4.2" fill="#fff" fill-opacity=".6" stroke="${D}" stroke-width="1.8"/><circle cx="66" cy="44" r="4.2" fill="#fff" fill-opacity=".6" stroke="${D}" stroke-width="1.8"/><path d="M58.2 44 H61.8" stroke="${D}" stroke-width="1.6"/>` +
    dots([[54.5, 44.5], [66.5, 44.5]], 1.3, D) + line('M50.5 38.5 Q54 36.5 57.5 38.5 M62.5 38.5 Q66 36.5 69.5 38.5', D, 1.6) +
    line('M55 52 Q60 55.5 65 52', D, 1.6) + `<circle cx="50" cy="51" r="2.2" fill="#FF8FA3" opacity=".6"/><circle cx="70" cy="51" r="2.2" fill="#FF8FA3" opacity=".6"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="88" rx="38" ry="9" fill="#F1F3F5"/><path d="M34 88 C40 86 44 90 50 88 M70 92 C76 90 80 93 86 90" stroke="#ADB5BD" stroke-width="1.2" fill="none"/>` +
    isoBoard(36, 85, 12, 5, 4) + isoBoard(84, 85, 12, 5, 4) +
    `<path ${ol(2)} d="M53 82 H65 L64 89 C63 92 55 92 54 89Z" fill="#fff"/><path ${ol(1.8)} d="M65 84 C69 84 69 88 64.5 88" fill="none"/><ellipse cx="59" cy="82.4" rx="5.4" ry="1.4" fill="#6B3E1F"/>` +
    line('M57 78 C55 75 59 74 57 71 M61 78 C59 75 63 74 61 71', '#ADB5BD', 1.8) +
    piece('knight', 87, 70, .42, '#fff') + `<path ${ol(2.2)} d="M80 74 C78 70 80 66 84 67 L90 68 C93 69 93 73 90 74Z" fill="#F4BE8F"/>` +
    sparkle(30, 56, 4) + sparkle(90, 50, 3.5, '#fff') + star(30, 38, 3.6, '#FFD43B', 1.4),

  // ── Pastor ──
  'Ovejita': () =>
    `<ellipse ${ol(2.4)} cx="60" cy="92" rx="36" ry="8" fill="#8CE99A"/>` +
    line('M50 74 V86 M58 76 V88 M70 76 V88 M77 73 V85', D, 4.4) + line('M50 74 V86 M58 76 V88 M70 76 V88 M77 73 V85', '#495057', 2) +
    fluff(64, 62, 21, 15, 12, '#fff') + shine('M54 52 C58 49 64 48 68 49', 2.4, .9) + `<path d="M50 64 q3 3 6 0 M66 70 q3 3 6 0 M74 58 q3 3 6 0" stroke="#DEE2E6" stroke-width="1.6" fill="none"/>` +
    `<ellipse ${ol(2.4)} cx="35" cy="50" rx="5" ry="2.8" fill="#FFC9C9" transform="rotate(-30 35 50)"/><ellipse ${ol(2.4)} cx="53" cy="48" rx="5" ry="2.8" fill="#FFC9C9" transform="rotate(30 53 48)"/>` +
    `<ellipse ${ol(2.6)} cx="44" cy="58" rx="10" ry="11.5" fill="#FFE3D3"/>` + fluff(44, 46, 7, 4, 7, '#fff', 2) +
    `<circle cx="40" cy="56" r="2.8" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="48" cy="56" r="2.8" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dots([[40, 56.4], [48, 56.4]], 1.1, D) +
    `<ellipse cx="44" cy="64.5" rx="2" ry="2.6" fill="${D}"/><circle cx="37" cy="61" r="2" fill="#FF8FA3" opacity=".7"/><circle cx="51" cy="61" r="2" fill="#FF8FA3" opacity=".7"/>` +
    t(30, 42, 12, '!', '#E03131', `transform="rotate(-12 30 42)"`) +
    piece('king', 58, 88, .5, '#fff', -90, `<path d="M-3 -22 l2.4 2.4 M-.6 -22 l-2.4 2.4 M1 -22 l2.4 2.4 M3.4 -22 l-2.4 2.4" stroke="${D}" stroke-width="1.6"/>`) +
    sparkle(30, 76, 3) + `<path d="M90 70 l2 -4 M94 76 l4 -2 M88 66 l-1 -4" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>`,
  'Pastor alemán': () =>
    `<path ${ol(2.6)} d="M32 100 C32 86 44 80 60 80 C76 80 88 86 88 100Z" fill="#C68B59"/><path d="M50 86 C54 94 66 94 70 86" fill="#E8C39E"/>` +
    `<rect ${ol(2.4)} x="42" y="80" width="36" height="6" rx="3" fill="#E03131"/><circle ${ol(1.8)} cx="60" cy="90" r="3.4" fill="#FCC419"/>` +
    `<path ${ol(2.6)} d="M38 46 L36 20 L52 34Z" fill="#3B2A20"/><path ${ol(2.6)} d="M82 46 L84 20 L68 34Z" fill="#3B2A20"/><path d="M40 40 L39 27 L47 35Z M80 40 L81 27 L73 35Z" fill="#E8A87C"/>` +
    `<path ${ol(2.6)} d="M38 50 C38 36 48 30 60 30 C72 30 82 36 82 50 C82 62 76 72 60 74 C44 72 38 62 38 50Z" fill="#C68B59"/>` +
    `<path d="M45 34 C52 30 68 30 75 34 C72 42 66 44 60 52 C54 44 48 42 45 34Z" fill="#3B2A20"/>` +
    `<ellipse cx="60" cy="64" rx="12" ry="9" fill="#E8C39E"/>` +
    `<circle cx="51" cy="50" r="2.4" fill="${D}"/><circle cx="69" cy="50" r="2.4" fill="${D}"/><circle cx="51.8" cy="49.2" r=".8" fill="#fff"/><circle cx="69.8" cy="49.2" r=".8" fill="#fff"/>` +
    `<ellipse cx="50" cy="45.5" rx="2" ry="1.2" fill="#E8C39E"/><ellipse cx="70" cy="45.5" rx="2" ry="1.2" fill="#E8C39E"/>` +
    `<path ${ol(2)} d="M55 57 C55 54 65 54 65 57 C65 60 62 61 60 61 C58 61 55 60 55 57Z" fill="${D}"/><ellipse cx="58" cy="56" rx="1.6" ry=".9" fill="#fff" opacity=".7"/>` +
    piece('queen', 78, 71, .8, '#495057', -90, `<path d="M-8 -29 L-11 -41 L-5 -35 L0 -43 L5 -35 L11 -41 L8 -29Z" fill="#FCC419"/>`) +
    `<circle cx="44" cy="58" r="2.4" fill="#FF8FA3" opacity=".6"/><circle cx="76" cy="58" r="2.4" fill="#FF8FA3" opacity=".6"/>` +
    sparkle(28, 66, 3.5) + sparkle(92, 60, 4),
  'Rebaño entero': () => {
    const sheep = (x: number, y: number, s: number, flip = 1) =>
      `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})">` + line('M-7 4 V14 M-3 5 V15 M4 5 V15 M8 4 V14', D, 3.8) + line('M-7 4 V14 M-3 5 V15 M4 5 V15 M8 4 V14', '#495057', 1.6) +
      `<ellipse ${ol(2.4 / s)} cx="0" cy="0" rx="12" ry="8" fill="#FFC9C9"/>` + fluff(12, -3, 2.6, 2.4, 5, '#fff', 1.8 / s) +
      `<path d="M-6 -2 q2 2 4 0 M2 2 q2 2 4 0" stroke="#FFA8A8" stroke-width="1.2" fill="none"/>` +
      `<ellipse ${ol(2.4 / s)} cx="-12" cy="-6" rx="6" ry="6.6" fill="#FFE3D3"/>` + fluff(-12, -13.5, 3.8, 2.2, 6, '#fff', 1.8 / s) +
      `<circle cx="-14.4" cy="-6" r="1.1" fill="${D}"/><circle cx="-9.6" cy="-6" r="1.1" fill="${D}"/><circle cx="-16" cy="-3.4" r="1.6" fill="#FF6B6B" opacity=".7"/><circle cx="-8" cy="-3.4" r="1.6" fill="#FF6B6B" opacity=".7"/>` +
      line('M-13.4 -2.4 Q-12 -3.4 -10.6 -2.4', D, 1.1) + `</g>`
    return burst(60, 46, 30, 22, 12, '#FFF3BF') +
      `<path d="M22 66 H98 M22 76 H98" stroke="${D}" stroke-width="5"/><path d="M22 66 H98 M22 76 H98" stroke="#C97B45" stroke-width="2.4"/>` +
      [28, 46, 74, 92].map(x => `<rect ${ol(2.2)} x="${x - 2.5}" y="58" width="5" height="26" rx="1" fill="#B4703F"/>`).join('') +
      `<ellipse ${ol(2.4)} cx="60" cy="94" rx="40" ry="9" fill="#8CE99A"/>` +
      fluff(60, 40, 15, 10, 10, '#fff') + fluff(60, 32, 9, 6, 8, '#fff') + star(60, 28, 4.5, '#FFD43B', 1.6) +
      sheep(80, 74, .72, -1) + sheep(42, 74, .72) + sheep(62, 86, .9) +
      sparkle(90, 44, 3.5) + sparkle(30, 44, 3)
  },

  // ── Coronador ──
  'Corona de papel': () => {
    const conf = ([[32, 40, '#FF6B6B', 20], [40, 30, '#4DABF7', -30], [84, 34, '#51CF66', 40], [90, 50, '#FCC419', -10], [30, 62, '#845EF7', 30], [88, 72, '#FF6B6B', 60], [76, 26, '#845EF7', -40]] as const)
      .map(([x, y, c, r]) => `<rect x="${x - 1.5}" y="${y - 3}" width="3" height="6" rx="1" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('')
    return conf +
      line('M30 82 C34 76 30 72 36 68 C40 66 38 60 42 58', '#F06595', 2.4) + line('M90 84 C86 78 92 74 86 70', '#4DABF7', 2.4) +
      piece('pawn', 60, 96, 1.3, '#FFF8E7', 0, face(0, -30, 3.2, 1.3, 'smile')) +
      `<g transform="rotate(-10 60 40)"><path ${ol(2.4)} d="M47 46 L45 30 L52 37 L56 27 L60 36 L64 27 L68 37 L75 30 L73 46Z" fill="#FFD43B"/>` +
      `<path d="M47 42 H73" stroke="#F06595" stroke-width="2.4"/>` + dots([[52, 39], [60, 38], [68, 39]], 1.4, '#4DABF7') + `</g>` +
      sparkle(84, 56, 3.5) + sparkle(34, 50, 3)
  },
  'Peón con capa': () =>
    `<path ${ol(2.6)} d="M52 66 C40 72 30 84 28 98 H92 C90 84 80 72 68 66Z" fill="#C92A2A"/>` +
    `<path d="M48 72 C42 80 38 88 38 96 M72 72 C78 80 82 88 82 96" stroke="#A61E1E" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + shine('M44 74 C40 80 37 86 36 90', 2.2, .4) +
    `<path d="M28 94 C40 99 80 99 92 94" stroke="#FCC419" stroke-width="2.6" fill="none"/>` +
    piece('pawn', 60, 96, 1.25, '#FFF8E7', 0, face(0, -30, 3.2, 1.3, 'proud')) +
    `<path ${ol(2.4)} d="M47 69 C51 64 69 64 73 69 C73 74 47 74 47 69Z" fill="#fff"/>` +
    dots([[52, 69], [58, 71], [64, 71], [69, 69]], 1.1, D) +
    `<g transform="translate(0 11) rotate(8 60 34)"><path ${ol(2)} d="M51 38 L49 28 L55 32 L60 25 L65 32 L71 28 L69 38Z" fill="#FFD43B"/><circle cx="60" cy="34.5" r="1.6" fill="#E03131"/></g>` +
    sparkle(30, 40, 4) + sparkle(90, 44, 3.5, '#fff') + star(88, 30, 3.5, '#FFD43B', 1.4),
  'Reina de la vendimia': () =>
    burst(60, 58, 40, 30, 14, '#F3D9FA') +
    `<path d="M24 46 C34 40 40 48 46 42 M96 46 C86 40 80 48 74 42" stroke="#2F9E44" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    grapes(34, 68, .9) + grapes(86, 68, .9) +
    piece('queen', 60, 96, 1.4, '#FFF8E7', 0,
      `<path d="M-8 -29 L-11 -41 L-5 -35 L0 -43 L5 -35 L11 -41 L8 -29Z" fill="#FFD43B"/><circle cx="0" cy="-33" r="1.5" fill="#E03131"/>` +
      face(0, -20, 2.6, 1.1, 'smile') +
      `<path d="M-8 -12 L9 -7 L9 -4 L-9 -9Z" fill="#74C0FC"/><path d="M-8 -12 L9 -7 M9 -4 L-9 -9" stroke="${D}" stroke-width="1"/><circle cx="-4" cy="-9.4" r="1.5" fill="#F06595"/>`) +
    sparkle(40, 30, 4) + sparkle(84, 32, 4.5) + star(60, 22, 3, '#FFD43B', 1.4),

  // ══ TA-TE-TI ══
  // ── Tres en línea ──
  'Servilleta de bar': () =>
    `<g transform="rotate(-7 60 60)"><rect x="29" y="31" width="62" height="62" rx="2" fill="${D}" opacity=".15" transform="translate(2 3)"/><rect ${ol(2.6)} x="29" y="29" width="62" height="62" rx="2" fill="#fff"/>` +
    `<rect x="33" y="33" width="54" height="54" fill="none" stroke="#DEE2E6" stroke-width="1.4" stroke-dasharray="2 2"/>` +
    `<circle cx="78" cy="42" r="9" fill="none" stroke="#C9A27A" stroke-width="2.4" opacity=".55"/>` +
    line('M50 39 C49 50 51 66 50 81 M70 39 C71 52 69 66 70 81 M39 50 C52 49 68 51 81 50 M39 70 C52 71 68 69 81 70', '#1C5FD6', 2.2) +
    xMark(43, 43, 4, '#1C5FD6', 2.2) + xMark(60, 60, 4, '#1C5FD6', 2.2) + xMark(77, 77, 4, '#1C5FD6', 2.2) +
    oMark(60, 43, 4.4, '#1C5FD6', 2.2) + oMark(77, 60, 4.4, '#1C5FD6', 2.2) + oMark(43, 77, 4.4, '#1C5FD6', 2.2) +
    line('M37 37 L83 83', '#E03131', 3) + `</g>` +
    `<g transform="rotate(-48 80 82)">` + `<rect ${ol(2.2)} x="62" y="78.5" width="36" height="7" rx="2" fill="#E7F5FF" fill-opacity=".9"/><path d="M66 82 H92" stroke="#1C5FD6" stroke-width="1.4"/>` +
    `<path ${ol(2)} d="M98 79 H101 L104 82 L101 85 H98Z" fill="#ADB5BD"/><rect ${ol(2.2)} x="58" y="78.5" width="9" height="7" rx="2" fill="#1C5FD6"/><rect x="61" y="76.6" width="10" height="2" rx="1" fill="#1C5FD6" stroke="${D}" stroke-width="1.4"/></g>` +
    sparkle(28, 30, 3.5),
  'Pupitre rayado': () => `<g transform="translate(0 7)">` +
    line('M32 78 L28 100 M88 78 L92 100', D, 6) + line('M32 78 L28 100 M88 78 L92 100', '#868E96', 2.6) +
    `<path ${ol(2.6)} d="M30 78 H90 V86 H30Z" fill="#495057"/>` +
    `<path ${ol(2.6)} d="M30 40 H90 L98 72 H22Z" fill="#C97B45"/><path ${ol(2.6)} d="M22 72 H98 V79 H22Z" fill="#A35E2F"/>` +
    `<path d="M36 46 C50 45 70 47 84 46 M30 58 C50 57 70 59 90 58" stroke="#B4703F" stroke-width="1.2" fill="none"/>` +
    `<rect ${ol(1.8)} x="36" y="42" width="36" height="5" rx="2.5" fill="#8B4A2B"/><rect x="40" y="43" width="22" height="3" rx="1.2" fill="#FCC419"/><path d="M62 43 L66 44.5 L62 46Z" fill="#F4BE8F"/>` +
    `<ellipse ${ol(1.8)} cx="82" cy="45" rx="4" ry="2" fill="#343A40"/>` +
    `<g stroke-linecap="round" fill="none"><g stroke="#E8A86B" stroke-width="2.6" transform="translate(.6 .8)">${'<path d="M54 50 L52 70 M66 50 L68 70 M44 56 H76 M42 64 H78"/>'}</g>` +
    `<path d="M54 50 L52 70 M66 50 L68 70 M44 56 H76 M42 64 H78" stroke="#6B3E1F" stroke-width="2"/></g>` +
    xMark(48, 52.5, 2.2, '#6B3E1F', 1.8) + oMark(60, 53, 2.4, '#6B3E1F', 1.8) + xMark(72, 52.5, 2.2, '#6B3E1F', 1.8) +
    oMark(48, 60, 2.6, '#6B3E1F', 1.8) + xMark(60, 60, 2.4, '#6B3E1F', 1.8) + oMark(72.5, 60, 2.6, '#6B3E1F', 1.8) +
    xMark(47, 67.5, 2.6, '#6B3E1F', 1.8) + oMark(60, 67.5, 2.8, '#6B3E1F', 1.8) + xMark(73, 67.5, 2.6, '#6B3E1F', 1.8) +
    line('M44 50 L77 71', '#E03131', 2.4, 'opacity=".9"') +
    heart(32, 66, 3, '#E8A86B', 1.4) + line('M84 62 L88 68 M86 61 L91 67', '#6B3E1F', 1.4) +
    `</g>` + sparkle(36, 30, 3.5) + sparkle(86, 30, 3),
  'Pizarrón de maestra': () => `<g transform="translate(0 5)">` +
    `<rect ${ol(2.6)} x="24" y="28" width="72" height="54" rx="4" fill="#B4703F"/><rect ${ol(2)} x="29" y="33" width="62" height="44" rx="1.5" fill="#2B8A3E"/>` +
    `<path d="M33 70 C40 66 44 72 52 68" stroke="#fff" stroke-width="5" opacity=".08" fill="none" stroke-linecap="round"/>` +
    `<g opacity=".92">` + grid(52, 55, 12, '#F8F9FA', 1.8) + xMark(40, 43, 3.6, '#F8F9FA', 1.8) + oMark(52, 43, 4, '#F8F9FA', 1.8) + xMark(64, 55, 3.6, '#F8F9FA', 1.8) +
    xMark(52, 55, 3.6, '#F8F9FA', 1.8) + oMark(40, 67, 4, '#F8F9FA', 1.8) + xMark(40, 55, 3.6, '#F8F9FA', 1.8) + oMark(64, 67, 4, '#FFEC99', 1.8) + line('M34 55 H70', '#FFEC99', 2.2) + `</g>` +
    star(81, 45, 7, '#FFD43B', 1.8) + t(81, 62, 7, '10', '#FFEC99') + line('M75 65 Q81 68 87 65', '#FFEC99', 1.4) +
    `<rect ${ol(2.4)} x="22" y="80" width="76" height="6" rx="2" fill="#8B5A3C"/>` +
    `<rect ${ol(1.8)} x="34" y="76" width="14" height="5" rx="1.5" fill="#fff"/><rect ${ol(2)} x="54" y="75" width="16" height="6" rx="1.5" fill="#495057"/><rect x="55.5" y="76.5" width="13" height="2.4" fill="#ADB5BD"/>` +
    `<path ${ol(2.2)} d="M84 70 C78 70 77 80 84 81 C86 81.5 88 81.5 89 81 C96 80 95 70 89 70 C87 70 86 71 86.5 71 C86 71 85.5 70 84 70Z" fill="#E03131"/>` +
    line('M86.5 70.5 C86.5 68 87 67 88 66', '#6B3E1F', 1.6) + `<path ${ol(1.4)} d="M87.5 68 C90 65 93 66 93 67 C91 69 89 69 87.5 68Z" fill="#69DB7C"/>` + shine('M81 73 Q80 76 81.5 78', 1.6, .7) + `</g>`,
  // ── Sin piedad ──
  'Goma de borrar': () =>
    `<g transform="rotate(-6 58 64)"><rect ${ol(2.6)} x="28" y="32" width="60" height="62" rx="3" fill="#fff"/>` +
    `<path d="M28 42 H88 M28 52 H88 M28 62 H88 M28 72 H88 M28 82 H88" stroke="#A5D8FF" stroke-width="1.2"/><path d="M36 32 V94" stroke="#FF8787" stroke-width="1.4"/>` +
    grid(58, 64, 13, '#868E96', 2) + xMark(45, 51, 4, '#495057', 2.4) + xMark(58, 64, 4, '#495057', 2.4) + xMark(71, 77, 4, '#495057', 2.4) + line('M40 46 L76 82', '#E03131', 2.6) +
    oMark(45, 77, 4.4, '#ADB5BD', 2, 'stroke-dasharray="3 3" opacity=".7"') + oMark(58, 51, 4.4, '#ADB5BD', 2, 'stroke-dasharray="2 4" opacity=".5"') + `</g>` +
    `<path d="M62 44 C68 36 76 34 84 34" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>` +
    `<g transform="translate(-8 6) rotate(-32 80 38)"><rect ${ol(2.6)} x="64" y="31" width="17" height="14" rx="3" fill="#FF6B6B"/><rect ${ol(2.6)} x="81" y="31" width="14" height="14" rx="3" fill="#4DABF7"/>` +
    shine('M67 34 H76', 2, .6) + face(72.5, 37.6, 3, 1.2, 'smug', false) + `</g>` +
    dots([[64, 48], [68, 51], [60, 52]], 1.2, '#FFA8A8') + `<path d="M70 50 q1 2 3 1 M58 46 q2 1 2 3" stroke="#FFA8A8" stroke-width="1.4" fill="none"/>` + sparkle(32, 28, 3.5),
  'Topadora': () => `<g transform="translate(62 62) scale(.88) translate(-60 -70)">` +
    `<path d="M22 92 H98" stroke="${D}" stroke-width="2.4"/>` +
    // escombros de grilla
    `<g ${ol(2.2)}><rect x="26" y="78" width="14" height="3.6" rx="1.4" fill="#ADB5BD" transform="rotate(-30 33 80)"/><rect x="30" y="84" width="12" height="3.6" rx="1.4" fill="#ADB5BD" transform="rotate(15 36 86)"/><rect x="22" y="86" width="10" height="3.6" rx="1.4" fill="#ADB5BD" transform="rotate(-8 27 88)"/></g>` +
    xMark(30, 70, 3.6, D, 4.4) + xMark(30, 70, 3.6, '#4DABF7', 2.2) + oMark(38, 62, 3.6, D, 4.4) + oMark(38, 62, 3.6, '#FF6B6B', 2.2) + xMark(26, 56, 2.6, D, 3.6) + xMark(26, 56, 2.6, '#4DABF7', 1.6) +
    `<path ${ol(2.6)} d="M40 56 C46 60 46 84 40 90 L48 90 C51 80 51 66 48 56Z" fill="#ADB5BD"/>` + line('M48 70 H56 M48 82 H58', D, 3) +
    `<rect ${ol(2.6)} x="52" y="80" width="42" height="12" rx="6" fill="#343A40"/>` + dots([[59, 86], [68, 86], [77, 86], [86, 86]], 2.6, '#868E96') +
    `<path ${ol(2.6)} d="M54 80 V66 H88 L92 72 V80Z" fill="#FCC419"/><path ${ol(2.6)} d="M66 66 V44 H86 L88 66Z" fill="#FCC419"/><rect ${ol(2)} x="70" y="48" width="14" height="12" rx="2" fill="#A5D8FF"/>` +
    face(77, 53, 3, 1.2, 'smug', false) + `<path d="M74 51 L76 52 M80 52 L82 51" stroke="${D}" stroke-width="1.2"/>` +
    `<rect ${ol(2)} x="59" y="52" width="4" height="14" fill="#495057"/>` + fluff(63, 44, 6, 4, 7, '#DEE2E6', 1.8) +
    shine('M57 70 H66', 2.2) + `<rect x="56" y="74" width="34" height="3" fill="#212529"/></g>` + sparkle(88, 36, 3.5) + sparkle(36, 34, 3),
  'Aplanadora': () =>
    `<path ${ol(2.4)} d="M16 80 H104 V104 H16Z" fill="#868E96"/><path d="M24 84 H60" stroke="#fff" stroke-width="1.6" opacity=".6" stroke-linecap="round"/>` +
    `<g transform="translate(38 89) scale(1.8 .4)">${xMark(0, 0, 3.4, '#fff', 2)}</g><g transform="translate(56 92) scale(1.8 .4)">${xMark(0, 0, 3.4, '#fff', 2)}</g>` +
    `<g transform="translate(60 58) scale(.88) translate(-60 -64)">` +
    `<rect ${ol(2.6)} x="40" y="62" width="34" height="14" rx="3" fill="#FCC419"/><path d="M44 66 H62" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>` +
    `<path d="M45 62 L50 36 M68 62 L64 36" stroke="${D}" stroke-width="4"/><path d="M45 62 L50 36 M68 62 L64 36" stroke="#868E96" stroke-width="2"/>` +
    `<path ${ol(2.6)} d="M42 36 C50 29 66 29 74 36Z" fill="#E03131"/><rect ${ol(2)} x="51" y="52" width="10" height="10" rx="2" fill="#495057"/>` +
    `<circle ${ol(2.6)} cx="48" cy="80" r="8" fill="#343A40"/><circle cx="48" cy="80" r="2.6" fill="#ADB5BD"/>` +
    `<path ${ol(2.6)} d="M70 60 H92 V64 H70Z" fill="#FAB005"/>` +
    `<circle ${ol(2.6)} cx="80" cy="76" r="15" fill="#ADB5BD"/><circle cx="80" cy="76" r="11" fill="#CED4DA"/>` + shine('M70 70 C72 66 76 64 80 64', 2.4, .9) +
    face(80, 75, 4, 1.6, 'smile') + `</g>` +
    sparkle(30, 70, 3, '#fff') + sparkle(56, 72, 2.4) + sparkle(84, 34, 4.5) + sparkle(34, 44, 3),

  // ══ SUSHI GO! ══
  // ── Tenedor libre ──
  'Palitos de madera': () =>
    nigiri(56, 74, 1.7, -6, face(0, -1, 4, 1.5, 'smile')) +
    stick('M104 36 L72 54', '#E9B872', 3.2) + stick('M106 62 L74 82', '#E9B872', 3.2) +
    `<path d="M88 41 l3 -2 M90 69 l3 -2" stroke="#C97B45" stroke-width="1.4"/>` +
    line('M36 40 C38 34 44 38 46 32 C48 28 52 30 54 26', '#E03131', 2.2) + line('M30 46 l-5 2 M34 50 l-3 4 M58 24 l3 -3', D, 2) +
    sparkle(30, 66, 3.5) + sparkle(84, 36, 3.5) + sparkle(88, 90, 3, '#fff'),
  'Barco de sushi': () =>
    `<path d="M20 86 Q28 82 36 86 T52 86 T68 86 T84 86 T100 86 V100 H20Z" fill="#74C0FC" stroke="${D}" stroke-width="2.4"/>` +
    line('M60 66 V36', D, 2.2) + `<path ${ol(2)} d="M60 36 H78 V48 H60Z" fill="#fff"/><rect x="60.8" y="36.8" width="16.4" height="3.6" fill="#74C0FC"/><rect x="60.8" y="44.2" width="16.4" height="3" fill="#74C0FC"/><circle cx="69" cy="42.3" r="1.6" fill="#FCC419"/>` +
    nigiri(37, 66, .8, -6) + maki(52, 63, .85) + nigiri(68, 64, .8, 4, '', '#FF6B6B') + maki(82, 64, .8, '#69DB7C') +
    `<path ${ol(2.6)} d="M24 68 H90 C94 62 96 56 98 52 C100 60 98 72 92 80 C82 88 40 88 30 82 Z" fill="#C97B45"/>` +
    `<path d="M30 74 H92 M34 80 H86" stroke="#A35E2F" stroke-width="1.6"/>` + shine('M30 71 H54', 2, .5) +
    `<path ${ol(2.6)} d="M22 66 H92 V70 H22Z" fill="#E8A86B"/>` + sparkle(34, 40, 4) + sparkle(88, 32, 3),
  'Sushiman de Belgrano': () => {
    const lantern = (x: number, y: number) => line(`M${x} ${y - 14} V${y - 6}`, D, 1.6) + `<ellipse ${ol(2.2)} cx="${x}" cy="${y}" rx="7" ry="6.5" fill="#E03131"/><path d="M${x - 3} ${y - 5.6} C${x - 5} ${y} ${x - 4} ${y + 4} ${x - 2.6} ${y + 6}" stroke="#FFA8A8" stroke-width="1.2" fill="none"/>` +
      `<rect ${ol(1.6)} x="${x - 3.5}" y="${y - 7.5}" width="7" height="2.5" fill="#FCC419"/><rect ${ol(1.6)} x="${x - 3.5}" y="${y + 5}" width="7" height="2.5" fill="#FCC419"/>` + line(`M${x} ${y + 8} V${y + 13}`, '#FCC419', 1.6)
    return lantern(30, 40) + lantern(90, 40) +
      `<path ${ol(2.6)} d="M30 100 C30 82 42 74 60 74 C78 74 90 82 90 100Z" fill="#fff"/><path d="M60 74 L52 90 M60 74 L68 90" stroke="#ADB5BD" stroke-width="1.8"/>` +
      `<ellipse ${ol(2.6)} cx="60" cy="50" rx="14" ry="15" fill="#F4BE8F"/>` +
      `<path ${ol(2.4)} d="M46 44 C46 34 52 32 60 32 C68 32 74 34 74 44 C70 40 50 40 46 44Z" fill="#212529"/>` +
      `<path ${ol(2.4)} d="M45 41 C52 37 68 37 75 41 L75 46 C68 42 52 42 45 46Z" fill="#fff"/><circle cx="60" cy="41.4" r="2.2" fill="#E03131"/>` +
      `<path ${ol(2)} d="M75 43 L82 39 L81 46Z" fill="#fff"/>` +
      line('M51 51 Q54 49 57 51 M63 51 Q66 49 69 51', D, 1.8) + line('M55 58 Q60 62 65 58', D, 1.8) + `<circle cx="50" cy="56" r="2.2" fill="#FF8FA3" opacity=".7"/><circle cx="70" cy="56" r="2.2" fill="#FF8FA3" opacity=".7"/>` +
      `<rect ${ol(2.4)} x="30" y="82" width="60" height="9" rx="2" fill="#E9B872"/>` +
      [40, 50, 60].map(x => maki(x, 82, .7)).join('') +
      `<g transform="rotate(-35 80 70)"><rect ${ol(2.2)} x="70" y="67" width="7" height="6" rx="1.5" fill="#343A40"/><path ${ol(2.2)} d="M77 67 H100 C100 70 98 73 94 73 H77Z" fill="#DEE2E6"/>${shine('M80 69 H95', 1.4, .9)}</g>` +
      `<circle ${ol(2.4)} cx="72" cy="78" r="5" fill="#F4BE8F"/>` + sparkle(82, 56, 3.5)
  },
  // ── Picante ──
  'Lágrima de wasabi': () =>
    `<ellipse ${ol(2.6)} cx="60" cy="86" rx="30" ry="8" fill="#fff"/><ellipse cx="60" cy="85" rx="24" ry="5" fill="#E9ECEF"/>` +
    `<path ${ol(2.6)} d="M36 84 C30 82 32 72 40 72 C38 62 46 56 54 60 C54 52 60 46 64 40 C66 48 70 52 72 58 C80 56 86 64 82 72 C90 74 90 84 82 84 C70 87 48 87 36 84Z" fill="#82C91E"/>` +
    `<path d="M42 72 C48 70 52 74 58 72 M56 60 C60 58 64 60 68 58" stroke="#5C940D" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + shine('M46 64 C48 62 51 61 53 62', 2, .7) +
    `<ellipse cx="52" cy="72" rx="3" ry="3.6" fill="${D}"/><ellipse cx="68" cy="72" rx="3" ry="3.6" fill="${D}"/><circle cx="53" cy="70.6" r="1.2" fill="#fff"/><circle cx="69" cy="70.6" r="1.2" fill="#fff"/>` +
    line('M56 79 Q60 82 64 79', D, 1.8) + `<circle cx="46" cy="77" r="2.4" fill="#FF8FA3" opacity=".7"/><circle cx="74" cy="77" r="2.4" fill="#FF8FA3" opacity=".7"/>` +
    `<path ${ol(1.8)} d="M75 74 C77 79 79 81 79 83 A4 4 0 0 1 71 83 C71 81 73 79 75 74Z" fill="#74C0FC"/><ellipse cx="74" cy="81" rx="1" ry="1.6" fill="#fff"/>` +
    sparkle(34, 44, 4) + sparkle(84, 40, 3.5) + star(78, 30, 3, '#FFD43B', 1.4),
  'Nariz en llamas': () => {
    const flame = (x: number, y: number, rot: number) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path ${ol(2.4)} d="M-5 0 C-9 8 -8 16 -4 22 C-3 18 -1 17 0 18 C0 24 3 28 6 32 C7 26 6 22 9 20 C10 23 12 24 13 22 C14 14 10 6 5 0Z" fill="#94D82D"/>` +
      `<path d="M-1 6 C-4 12 -3 16 -1 19 C0 17 1 16 2 17 C2 21 4 24 5 26 C6 22 6 19 7 17 C8 12 6 8 3 6Z" fill="#FFEC99"/></g>`
    return `<circle ${ol(2.6)} cx="60" cy="56" r="32" fill="#FFD8B5"/>` +
      `<path d="M30 46 C30 34 40 26 50 25 M70 25 C80 26 90 34 90 46" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>` +
      line('M40 40 L48 44 L40 48 M80 40 L72 44 L80 48', D, 2.4) +
      `<path ${ol(1.8)} d="M42 50 C41 56 40 60 41 64 A2.6 2.6 0 0 0 46 63 C46 60 44 56 42 50Z M78 50 C79 56 80 60 79 64 A2.6 2.6 0 0 1 74 63 C74 60 76 56 78 50Z" fill="#74C0FC"/>` +
      `<circle cx="36" cy="58" r="4" fill="#FF6B6B" opacity=".6"/><circle cx="84" cy="58" r="4" fill="#FF6B6B" opacity=".6"/>` +
      flame(53, 68, 18) + flame(67, 68, -18) +
      `<path ${ol(2.6)} d="M60 38 C54 46 48 56 48 64 C48 70 54 72 60 72 C66 72 72 70 72 64 C72 56 66 46 60 38Z" fill="#FFA8A8"/>` +
      `<ellipse cx="54.5" cy="67" rx="2.6" ry="1.8" fill="${D}"/><ellipse cx="65.5" cy="67" rx="2.6" ry="1.8" fill="${D}"/>` + shine('M58 46 C56 50 55 54 55 58', 2.4, .8) +
      `<path d="M28 30 L24 26 M92 30 L96 26 M60 18 V22" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`
  },
  'Dragón de wasabi': () =>
    burst(60, 58, 40, 30, 16, '#FFE3E3') +
    `<path ${ol(2.6)} d="M62 56 L100 50 L92 60 L102 68 L92 72 L100 84 L86 80 L86 96 L76 82 L68 86 L70 72 Z" fill="#94D82D"/>` +
    `<path d="M66 58 L90 56 L84 62 L92 68 L84 70 L88 78 L80 76 L78 84 L74 76 L70 76 L71 68Z" fill="#E9FAC8"/>` +
    `<g transform="translate(2 8) scale(.85)">` +
    `<path ${ol(2.2)} d="M30 44 L22 40 L28 50 L20 54 L30 58 L24 66 L34 66 L32 76 L40 68Z" fill="#FCC419"/>` +
    `<path ${ol(2.4)} d="M40 32 C36 26 36 22 40 18 M40 26 L35 25 M48 30 C50 24 54 20 58 20 M51 25 L56 26" stroke-width="3.4" fill="none"/>` +
    `<path ${ol(2.6)} d="M32 46 C32 34 42 28 52 30 C60 31 64 36 68 40 L80 42 C84 43 85 49 80 51 L68 53 C66 56 64 58 62 58 L74 60 C78 62 76 68 72 67 L56 66 C50 72 38 72 34 64 C31 58 32 52 32 46Z" fill="#E03131"/>` +
    `<path d="M68 53 L62 58" stroke="${D}" stroke-width="2"/><path d="M38 60 C42 64 48 64 52 62 M36 52 C40 56 46 56 50 54" stroke="#FCC419" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path ${ol(1.6)} d="M70 52 L71 55.5 L73 52.4Z M75 51.6 L76 54.6 L77.6 51.4Z" fill="#fff"/>` +
    `<ellipse ${ol(2)} cx="54" cy="40" rx="5.4" ry="5" fill="#fff"/><circle cx="55.6" cy="40.6" r="2.6" fill="${D}"/><circle cx="56.4" cy="39.6" r=".9" fill="#fff"/>` +
    `<path ${ol(2)} d="M47 35 C51 31 58 31 61 35 C57 34 51 34 47 35Z" fill="#FCC419"/><circle cx="78" cy="45" r="1.3" fill="${D}"/>` +
    line('M80 44 C88 40 90 32 96 34 M78 49 C84 54 84 60 90 60', D, 1.8) + shine('M38 40 C40 36 44 33 48 33', 2.2, .6) + `</g>` +
    nigiri(50, 84, .75, -10, face(0, -1, 3, 1.1, 'o', false)) + line('M38 78 l-3 -3 M42 74 l-1 -4', D, 1.6) + sparkle(80, 34, 4),
  // ── Postre ──
  'Flan con dulce': () =>
    `<ellipse ${ol(2.6)} cx="60" cy="84" rx="34" ry="9" fill="#fff"/><ellipse cx="60" cy="83" rx="27" ry="6" fill="none" stroke="#A5D8FF" stroke-width="1.6"/>` +
    `<path ${ol(2.6)} d="M40 82 L44 58 C46 52 74 52 76 58 L80 82 C72 86 48 86 40 82Z" fill="#FFC94D"/>` + shine('M46 62 L44 78', 2.6, .6) +
    `<path ${ol(2.4)} d="M43 60 C44 52 76 52 77 60 C77 64 75 66 74 70 C73 66 72 64 70 64 C68 64 68 68 66 66 C64 64 60 66 58 64 C56 62 54 70 52 66 C50 63 48 64 46 66 C45 64 43 63 43 60Z" fill="#A0521D"/>` +
    `<ellipse cx="54" cy="57" rx="5" ry="1.6" fill="#fff" opacity=".45"/>` + face(60, 72, 5, 1.7, 'smile') +
    `<path ${ol(2.4)} d="M24 82 C20 80 22 74 27 74 C26 70 30 67 34 69 C36 66 38 72 37 74 C42 74 42 80 38 82Z" fill="#8B4513"/>` + line('M27 77 Q31 79 35 77', '#B4703F', 1.4) +
    `<path ${ol(2.4)} d="M82 82 C78 80 80 74 85 74 C84 70 88 66 92 69 C94 70 96 72 95 74 C100 74 100 80 96 82Z" fill="#fff"/>` + line('M85 77 Q89 79 93 77', '#DEE2E6', 1.4) +
    `<circle ${ol(1.8)} cx="61" cy="48" r="3.4" fill="#E03131"/>` + line('M61 44.6 C61 42 63 40 65 39', '#2F9E44', 1.6) +
    sparkle(34, 44, 4) + sparkle(86, 46, 3.5),
  'Budín de pan': () =>
    `<ellipse ${ol(2.6)} cx="60" cy="84" rx="34" ry="9" fill="#fff"/><ellipse cx="60" cy="83" rx="27" ry="6" fill="none" stroke="#FFC9C9" stroke-width="1.6"/>` +
    `<path ${ol(2.6)} d="M34 56 L56 46 L86 54 V78 L64 88 L34 78Z" fill="#E8A54B"/><path ${ol(2.6)} d="M64 64 L86 54 V78 L64 88Z" fill="#C9852E"/>` +
    `<path ${ol(2.4)} d="M34 56 L56 46 L86 54 L64 64Z" fill="#7A3A12"/>` +
    `<path d="M34 56 C34 62 36 64 38 60 C40 66 42 66 44 60 C46 64 48 68 50 62 C52 60 54 66 56 62 C58 66 62 68 64 64 C66 70 68 70 70 62 C72 66 74 64 76 60 C78 64 80 64 82 58 C84 60 86 58 86 54 L64 64Z" fill="#7A3A12" stroke="${D}" stroke-width="2" stroke-linejoin="round"/>` +
    dots([[40, 70], [50, 74], [44, 78], [56, 70], [58, 80], [48, 66]], 1.6, '#6B2E0E') + dots([[72, 70], [78, 74], [70, 80]], 1.4, '#7A3A12') +
    face(49, 69, 4.4, 1.6, 'proud') + shine('M40 52 L50 48', 2, .5) +
    stick('M92 34 L74 50', '#ADB5BD', 2.4) + line('M92 34 L98 28 M94 36 L100 30', D, 1.8) +
    `<path d="M72 92 C74 94 74 97 72 98 C70 97 70 94 72 92Z" fill="#7A3A12"/>` + sparkle(30, 40, 4) + heart(40, 32, 3.6, '#FF6B6B', 1.6),
  'Torta Rogel': () => {
    let lay = ''
    for (let i = 0; i < 6; i++) lay += `<rect x="36" y="${62 + i * 5}" width="48" height="2.6" fill="#8B4513"/>`
    let mer = ''
    for (let i = 0; i < 6; i++) { const x = 38 + i * 8.8, y = 60; mer += `<path ${ol(2)} d="M${f(x - 5)} ${y} C${f(x - 5)} ${y - 5} ${f(x - 1)} ${y - 6} ${f(x)} ${y - 11} C${f(x + 1)} ${y - 6} ${f(x + 5)} ${y - 5} ${f(x + 5)} ${y}Z" fill="#fff"/><path d="M${f(x - 1)} ${y - 8} C${f(x - .4)} ${y - 9} ${f(x)} ${y - 10} ${f(x)} ${y - 11}" stroke="#E8A54B" stroke-width="2.4" stroke-linecap="round"/>` }
    return burst(60, 58, 40, 31, 16, '#FFF3BF') +
      `<path ${ol(2.6)} d="M26 92 H94 L88 98 H32Z" fill="#CED4DA"/><rect ${ol(2.6)} x="22" y="88" width="76" height="5" rx="2.5" fill="#E9ECEF"/>` +
      `<rect x="36" y="58" width="48" height="30" fill="#FFE8B0"/>` + lay + `<rect ${ol(2.6)} x="36" y="58" width="48" height="30" fill="none"/>` + shine('M40 64 V84', 2.2, .4) +
      `<path ${ol(2.4)} d="M34 60 C34 56 86 56 86 60 C86 62 34 62 34 60Z" fill="#fff"/>` + mer +
      stick('M61 47 V34', '#F8F9FA', 1.6) + burst(61, 31, 6, 2.4, 8, '#FFD43B') + line('M52 26 l-3 -3 M70 26 l3 -3 M61 21 v-3 M50 34 h-4 M72 34 h4', '#FAB005', 1.6) +
      sparkle(28, 50, 4) + sparkle(92, 52, 4.5) + sparkle(80, 40, 3, '#fff') + sparkle(40, 40, 3)
  },

  // ══ CÓDIGO SECRETO ══
  // ── Agencia de inteligencia ──
  'Agente encubierto': () =>
    `<path ${ol(2.6)} d="M40 40 C40 30 46 24 60 24 C74 24 80 30 80 40Z" fill="#6B4F3A"/><path d="M41 36 H79" stroke="#212529" stroke-width="4"/><path ${ol(2.6)} d="M30 42 C40 37 80 37 90 42 C84 45 36 45 30 42Z" fill="#6B4F3A"/>` +
    `<path ${ol(2.6)} d="M26 46 L59 42 L60 92 L28 94Z" fill="#F8F9FA"/><path ${ol(2.6)} d="M94 46 L61 42 L60 92 L92 94Z" fill="#E9ECEF"/>` +
    t(42, 52, 7, 'DIARIO', D, 'transform="rotate(-6 42 52)" textLength="26" lengthAdjust="spacingAndGlyphs"') +
    line('M31 70 H55 M31 75 H55 M31 80 H50 M31 85 H54 M65 52 H89 M65 57 H86', '#ADB5BD', 1.8) + `<rect x="65" y="74" width="22" height="13" rx="1" fill="#CED4DA"/>` +
    `<circle ${ol(2)} cx="49" cy="62" r="5" fill="#fff"/><circle ${ol(2)} cx="71" cy="62" r="5" fill="#fff"/><circle cx="51.4" cy="62.4" r="2.4" fill="${D}"/><circle cx="73.4" cy="62.4" r="2.4" fill="${D}"/>` +
    line('M44 55 L53 57 M67 57 L76 55', D, 2.2) +
    `<ellipse ${ol(2.4)} cx="27" cy="74" rx="5" ry="6" fill="#343A40"/><ellipse ${ol(2.4)} cx="93" cy="74" rx="5" ry="6" fill="#343A40"/>` +
    `<path ${ol(2.4)} d="M44 92 L60 100 L76 92 L80 100 H40Z" fill="#C9A26B"/>` + sparkle(86, 32, 3.5),
  'Superagente 86': () =>
    `<path ${ol(2.6)} d="M30 100 C30 82 44 76 62 76 C80 76 92 82 92 100Z" fill="#495057"/><path d="M56 76 L62 90 L68 76Z" fill="#fff"/><path ${ol(1.6)} d="M60.4 78 L62 88 L63.6 78Z" fill="#212529"/>` +
    `<circle ${ol(2)} cx="80" cy="86" r="5" fill="#FCC419"/>` + t(80, 88.6, 6, '86', D) +
    `<rect ${ol(2.4)} x="61" y="66" width="10" height="11" rx="3" fill="#F4BE8F"/><circle ${ol(2.4)} cx="81" cy="52" r="4" fill="#F4BE8F"/>` +
    `<ellipse ${ol(2.6)} cx="68" cy="52" rx="13" ry="15" fill="#F4BE8F"/>` +
    `<path ${ol(2.4)} d="M54 50 C52 38 60 34 68 34 C78 34 83 40 82 50 C80 44 76 42 70 42 C64 42 58 44 54 50Z" fill="#343A40"/>` + shine('M62 37 C66 36 70 36 73 37', 1.8, .5) +
    line('M62 47 L66 48.6 M71 48.6 Q74 45.6 78 47', D, 1.8) + dots([[64, 52], [74, 52]], 1.6, D) + line('M64 60 Q69 62.6 74 59', D, 1.8) + `<circle cx="78" cy="58" r="2.2" fill="#FF8FA3" opacity=".7"/>` +
    `<g transform="rotate(12 40 52)"><path ${ol(2.6)} d="M58 56 C58 48 54 44 48 44 L42 46 C38 47 34 50 28 51 C22 52 22 57 24 57Z" fill="#6B3E1F"/><rect ${ol(2.2)} x="22" y="55.6" width="37" height="4.4" rx="2" fill="currentColor"/>` +
    line('M44 47 L40 50 M40 47 L44 50 M39 48 L35 51 M35 48 L39 51', '#fff', 1.2) + shine('M52 50 C53 48 52 47 50 47', 1.6, .5) + `</g>` +
    line('M27 54 C24 48 28 44 25 38', D, 1.6) + `<circle cx="25" cy="37.4" r="1.8" fill="#E03131"/>` +
    `<circle ${ol(2.4)} cx="46" cy="64" r="5" fill="#F4BE8F"/>` + line('M46 69 L50 78', D, 6) + line('M46 69 L50 78', '#495057', 2.6) +
    line('M30 66 Q28 70 31 74 M35 66 Q32 72 36 78', '#4DABF7', 2) + sparkle(88, 34, 3.5),
  'Jefe de la SIDE': () => {
    const stack = (x: number, n: number) => {
      let r = ''
      for (let i = 0; i < n; i++) { const y = 92 - i * 6, c = ['#F4C67A', '#E9B05C', '#F4D19B'][i % 3]; r += `<rect ${ol(2)} x="${x - 9 + (i % 2) * 1.5}" y="${y - 5}" width="18" height="5.6" rx="1" fill="${c}"/><rect x="${x + 1 + (i % 2) * 1.5}" y="${y - 6.4}" width="5" height="2" rx=".6" fill="${['#E03131', '#4DABF7', '#40C057', '#FCC419'][i % 4]}"/>` }
      return r
    }
    return `<path d="M60 18 L32 92 H88Z" fill="#FFF3BF" opacity=".75"/>` +
      `<path ${ol(2.6)} d="M40 92 V44 C40 30 80 30 80 44 V92Z" fill="#7A2E1F"/>` + dots([[48, 44], [60, 40], [72, 44], [48, 58], [60, 56], [72, 58]], 1.6, '#4A1A10') + shine('M45 40 C48 36 54 34 58 34', 2.2, .4) +
      `<circle ${ol(2.6)} cx="60" cy="58" r="11" fill="#212529"/><path ${ol(2.6)} d="M42 92 C42 76 50 70 60 70 C70 70 78 76 78 92Z" fill="#212529"/>` +
      `<rect x="51.5" y="55" width="7" height="4" rx="1.6" fill="#fff"/><rect x="61.5" y="55" width="7" height="4" rx="1.6" fill="#fff"/><path d="M58.5 56.6 H61.5" stroke="#fff" stroke-width="1"/>` +
      line('M55 64 Q60 66.5 65 64', '#868E96', 1.6) +
      stack(28, 7) + stack(92, 8) +
      `<g transform="rotate(-10 30 46)"><rect ${ol(1.6)} x="25" y="40" width="10" height="11" fill="#fff"/><circle cx="30" cy="44" r="2.4" fill="#FFC9C9"/><path d="M26.4 50 C26.4 46.6 33.6 46.6 33.6 50Z" fill="#FFC9C9"/></g>` +
      `<g transform="rotate(8 92 40)"><rect ${ol(1.6)} x="87" y="34" width="10" height="11" fill="#fff"/><circle cx="92" cy="38" r="2.4" fill="#A5D8FF"/><path d="M88.4 44 C88.4 40.6 95.6 40.6 95.6 44Z" fill="#A5D8FF"/></g>` +
      `<rect ${ol(2.6)} x="22" y="92" width="76" height="8" rx="2" fill="#5C3A1E"/>`
  },
  // ── Pista maestra ──
  'Tejedor': () =>
    wcard(36, 38, -12, .85) + wcard(84, 38, 10, .85) + wcard(86, 80, -8, .85) + wcard(34, 80, 12, .85) +
    line('M60 64 C50 56 44 46 38 40 M60 64 C70 54 76 46 84 40 M60 64 C70 70 78 74 85 80 M60 64 C50 72 42 76 35 80', '#E03131', 2.4) +
    dots([[38, 40], [84, 40], [85, 80], [35, 80]], 2, '#E03131') +
    stick('M44 46 L72 80', '#FCC419', 2.2) + stick('M76 46 L48 80', '#FCC419', 2.2) +
    `<circle ${ol(2.6)} cx="60" cy="64" r="12" fill="#E03131"/>` + line('M50 60 C55 55 65 55 70 60 M49 66 C55 61 65 61 71 66 M52 72 C56 68 64 68 68 72 M56 53 C51 60 52 70 57 76', '#A61E1E', 1.6) +
    shine('M53 57 C55 55 58 54 60 54', 2, .6) + `<circle ${ol(1.8)} cx="44" cy="46" r="2.6" fill="#4DABF7"/><circle ${ol(1.8)} cx="76" cy="46" r="2.6" fill="#4DABF7"/>` +
    heart(60, 30, 3.6, '#FF6B6B', 1.6) + sparkle(60, 90, 3),
  'Pulpo Paul': () =>
    ([['M50 56 C40 52 34 46 32 40', 0], ['M70 56 C80 52 86 46 88 40', 0], ['M48 62 C40 66 34 66 28 64', 0], ['M72 62 C80 66 86 66 92 64', 0], ['M52 66 C46 76 40 80 34 86', 0], ['M68 66 C74 76 80 80 86 86', 0], ['M56 68 C54 78 52 84 50 92', 0], ['M64 68 C66 78 68 84 70 92', 0]] as const)
      .map(([d]) => stick(d, '#FF922B', 6)).join('') +
    wcard(30, 36, -14, .62) + wcard(90, 36, 14, .62, 'r') + wcard(26, 62, 8, .62, 'b') + wcard(94, 62, -8, .62) + wcard(32, 86, -10, .62, 'r') + wcard(88, 86, 10, .62) + wcard(48, 94, -4, .55, 'b') + wcard(72, 94, 4, .55) +
    `<path ${ol(2.6)} d="M42 50 C40 34 48 26 60 26 C72 26 80 34 78 50 C76 60 70 66 60 66 C50 66 44 60 42 50Z" fill="#FF922B"/>` +
    `<ellipse cx="51" cy="35" rx="5" ry="3" fill="#fff" opacity=".5" transform="rotate(-30 51 35)"/><circle cx="68" cy="34" r="2" fill="#FFC078"/><circle cx="72" cy="40" r="1.4" fill="#FFC078"/>` +
    `<path d="M41 48 C38 34 46 24 60 24 C74 24 82 34 79 48" stroke="${D}" stroke-width="5" fill="none"/><path d="M41 48 C38 34 46 24 60 24 C74 24 82 34 79 48" stroke="#495057" stroke-width="2.4" fill="none"/>` +
    `<rect ${ol(2.2)} x="76" y="44" width="6" height="10" rx="2" fill="#343A40"/>` + line('M79 54 C78 60 72 62 68 61', D, 1.8) + `<circle ${ol(1.6)} cx="67" cy="61" r="2" fill="#343A40"/>` +
    face(60, 48, 6, 2.6, 'smug'),
  'Telaraña': () => {
    let cards = ''
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const x = 36 + c * 12, y = 38 + r * 11, col = (r * 5 + c) % 7 === 0 ? '#FF6B6B' : (r * 5 + c) % 5 === 2 ? '#74C0FC' : '#F1E3CF'
      cards += `<rect ${ol(1.8)} x="${x - 5.4}" y="${y - 4}" width="10.8" height="8" rx="1.4" fill="${col}"/><path d="M${x - 3} ${y + 1} H${x + 3}" stroke="${D}" stroke-width="1.2" opacity=".5"/>`
    }
    let web = '', rings = ''
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + .2; web += `M60 60 L${f(60 + 44 * Math.cos(a))} ${f(60 + 44 * Math.sin(a))} ` }
    for (const R of [10, 20, 30, 40]) { let d = ''; for (let i = 0; i <= 8; i++) { const a = i * Math.PI / 4 + .2; d += (i ? 'L' : 'M') + f(60 + R * Math.cos(a)) + ' ' + f(60 + R * Math.sin(a)) + ' ' } rings += d }
    return cards + `<path d="${web}${rings}" stroke="${D}" stroke-width="2.4" fill="none" opacity=".35"/><path d="${web}${rings}" stroke="#fff" stroke-width="1.2" fill="none"/>` +
      line('M50 52 L42 46 L38 50 M50 58 L40 58 L36 63 M50 64 L42 70 L42 75 M70 52 L78 46 L82 50 M70 58 L80 58 L84 63 M70 64 L78 70 L78 75', D, 2.4) +
      `<ellipse ${ol(2.4)} cx="60" cy="66" rx="9" ry="8" fill="#343A40"/><circle ${ol(2.4)} cx="60" cy="55" r="8" fill="#495057"/>` +
      `<path d="M55 69 H65 M56 64 H64" stroke="#E03131" stroke-width="1.6" stroke-linecap="round"/>` +
      `<rect x="52.5" y="51.5" width="6.4" height="3.6" rx="1.4" fill="${D}"/><rect x="61.1" y="51.5" width="6.4" height="3.6" rx="1.4" fill="${D}"/><path d="M58.9 52.4 H61.1" stroke="${D}" stroke-width="1"/>` +
      line('M57 59 Q60.5 61 64 58', '#fff', 1.4) + sparkle(84, 30, 3.5) + sparkle(30, 84, 3)
  },
  // ── Barrida ──
  'Lampazo': () =>
    `<path ${ol(2.6)} d="M24 84 H96 V92 H24Z" fill="#B4703F"/><path d="M28 87 H70" stroke="#E8A86B" stroke-width="1.6"/>` +
    `<path d="M48 82 C60 84 74 82 86 84" stroke="#74C0FC" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` +
    wcard(30, 56, -30, .7) + wcard(38, 42, 20, .6, 'r') + wcard(26, 74, -10, .66, 'b') + wcard(46, 30, -12, .5) +
    line('M44 60 H52 M48 50 H58 M42 72 H50', D, 2) +
    stick('M94 22 L68 70', '#E9B872', 3.4) +
    `<path ${ol(2.4)} d="M62 66 L76 72 L74 76 L60 70Z" fill="#868E96"/>` +
    `<path ${ol(2.4)} d="M58 70 C54 76 52 82 56 84 C60 86 66 84 70 84 C76 84 82 84 80 78 L76 74Z" fill="#DEE2E6"/>` +
    line('M60 74 L58 82 M64 76 L63 84 M68 76 L68 84 M72 76 L74 83', '#ADB5BD', 1.4) +
    `<path ${ol(1.6)} d="M88 72 C89 75 90 76 90 77 A2 2 0 0 1 86 77 C86 76 87 75 88 72Z M84 62 C85 64 86 65 86 66 A2 2 0 0 1 82 66 C82 65 83 64 84 62Z" fill="#74C0FC"/>` +
    sparkle(80, 48, 3.5),
  'Sopladora de hojas': () => {
    const leaf = (x: number, y: number, r: number, c: string) => `<g transform="translate(${x} ${y}) rotate(${r})"><path ${ol(1.8)} d="M-6 0 C-4 -5 4 -5 6 0 C4 5 -4 5 -6 0Z" fill="${c}"/><path d="M-5 0 H5" stroke="${D}" stroke-width="1"/></g>`
    return line('M66 66 C56 62 46 64 36 60 M66 72 C56 72 46 76 34 76 M64 60 C56 54 46 50 38 44', '#A5D8FF', 2.4) +
      wcard(34, 50, -24, .6) + wcard(46, 36, 18, .55, 'b') + wcard(30, 72, 12, .58, 'r') + leaf(52, 52, 30, '#FF922B') + leaf(40, 86, -20, '#FAB005') + leaf(30, 38, 50, '#E8590C') + leaf(56, 26, -10, '#FAB005') +
      `<g transform="translate(-5 -3)"><path ${ol(2.6)} d="M62 62 L80 58 L82 72 L64 72Z" fill="#868E96"/><ellipse ${ol(2.4)} cx="63" cy="67" rx="3" ry="5.6" fill="#495057"/>` +
      `<path ${ol(2.6)} d="M78 52 C78 46 92 46 94 54 L96 76 C96 82 80 82 80 76Z" fill="#FF922B"/>` + shine('M83 52 C85 50 88 50 90 52', 2, .6) +
      `<path ${ol(2.4)} d="M84 48 C84 40 94 40 94 48" fill="none"/><rect ${ol(2)} x="82" y="62" width="10" height="7" rx="1.6" fill="#343A40"/>` +
      `<circle ${ol(2.2)} cx="88" cy="86" r="6" fill="#343A40"/>` + line('M84 80 L82 84', D, 2) + `</g>` + sparkle(84, 32, 3.5)
  },
  'Tornado': () =>
    fluff(60, 26, 30, 9, 14, '#868E96') +
    `<path ${ol(2.6)} d="M30 30 C40 36 80 36 90 30 C84 46 76 50 72 58 C70 66 66 74 62 84 L58 84 C60 74 56 66 52 58 C46 50 36 44 30 30Z" fill="#ADB5BD"/>` +
    line('M36 36 C48 42 72 42 84 36 M44 46 C52 50 68 50 76 46 M50 56 C56 58 64 58 70 56 M54 66 C58 68 64 68 67 66 M57 76 H63', '#E9ECEF', 2.2) +
    line('M40 44 C48 48 56 48 62 46 M58 62 C62 62 66 62 68 60', '#868E96', 1.6) +
    `<path ${ol(2.6)} d="M22 86 H98 V94 H22Z" fill="#B4703F"/><ellipse cx="60" cy="86" rx="10" ry="2.4" fill="#8B5A3C"/>` +
    wcard(28, 52, -30, .55, 'r') + wcard(90, 54, 25, .55, 'b') + wcard(34, 70, 20, .5) + wcard(84, 74, -15, .52, 'r') + wcard(76, 40, 40, .45, 'b') + wcard(42, 30, -20, .45) +
    line('M24 60 C22 54 24 48 28 44 M96 62 C98 56 96 50 92 46', D, 1.8) + sparkle(94, 34, 3.5, '#fff'),
  // ── Kamikaze ──
  'Pisó el palito': () =>
    burst(70, 44, 18, 12, 10, '#FFE066') +
    `<g transform="rotate(10 72 44)"><path d="M72 58 l-4 3 l8 2 l-8 2 l8 2 l-4 3" stroke="#868E96" stroke-width="2" fill="none"/>` + skullCard(72, 44, 1.05) + `</g>` +
    `<g transform="rotate(-14 44 84)">` + stick('M24 86 L44 86', '#B4703F', 4) + `</g><g transform="rotate(16 64 84)">` + stick('M50 84 L72 84', '#B4703F', 4) + `</g>` +
    line('M47 74 L46 68 M53 75 L57 70 M40 76 L36 72', D, 2) +
    `<path ${ol(2.6)} d="M32 58 C30 48 40 44 46 48 L50 52 C54 56 60 58 62 64 L62 70 L28 70 C26 66 28 62 32 58Z" fill="#4DABF7"/>` +
    `<rect ${ol(2.4)} x="26" y="68" width="38" height="6" rx="3" fill="#fff"/>` + line('M40 50 L44 54 M44 48 L48 52', '#fff', 1.8) + `<path ${ol(2.4)} d="M30 46 C30 40 34 36 40 36 L46 48 L32 58Z" fill="#E7F5FF"/>` +
    t(39, 41, 7.5, '¡crac!', '#E03131', 'transform="rotate(-10 39 41)"'),
  'Imán de balas': () =>
    [[34, 44, -16], [29, 62, 10], [36, 79, -8]].map(([x, y, r]) => line(`M${x + 8} ${y} H${x + 14}`, D, 1.8) + skullCard(x, y, .62, r)).join('') +
    `<g transform="translate(58 58) scale(.8) rotate(-90) translate(-52 -58)"><path ${ol(2.6 / .8)} d="M38 40 V58 C38 76 66 76 66 58 V40 H58 V58 C58 66 46 66 46 58 V40Z" fill="#E03131"/>` +
    `<rect ${ol(2.4)} x="38" y="36" width="8" height="7" fill="#DEE2E6"/><rect ${ol(2.4)} x="58" y="36" width="8" height="7" fill="#DEE2E6"/>` + shine('M41 48 V60', 2, .6) + `</g>` +
    `<path ${ol(2.6)} d="M64 100 C64 86 70 78 81 78 C92 78 98 86 98 100Z" fill="#4DABF7"/>` +
    line('M70 84 L72 66', D, 6) + line('M70 84 L72 66', '#4DABF7', 3) + `<circle ${ol(2.4)} cx="72" cy="63" r="4.2" fill="#F4BE8F"/>` +
    `<circle ${ol(2.6)} cx="82" cy="60" r="12" fill="#F4BE8F"/><path ${ol(2.4)} d="M70 58 C69 48 76 45 83 46 C89 47 94 51 94 58 C90 52 78 52 70 58Z" fill="#6B3E1F"/>` +
    `<circle cx="78" cy="62" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="87" cy="62" r="2.6" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dots([[77.4, 62], [86.4, 62]], 1.1, D) +
    `<ellipse cx="82.5" cy="68.4" rx="1.8" ry="1.5" fill="${D}"/>` + `<path ${ol(1.4)} d="M92 46 C93 49 94 50 94 51 A2 2 0 0 1 90 51 C90 50 91 49 92 46Z" fill="#74C0FC"/>` +
    line('M46 50 C42 54 42 62 46 66 M50 46 C44 52 44 64 50 70', '#FF8787', 1.6, 'stroke-dasharray="2 3"'),
  'Dedo nuclear': () =>
    `<path ${ol(2.6)} d="M50 46 C40 46 36 36 42 30 C42 22 52 18 60 22 C68 18 78 22 78 30 C84 36 80 46 70 46 L66 46 L66 56 C66 60 54 60 54 56 L54 46Z" fill="#FFA94D"/>` +
    `<path d="M44 32 C46 28 50 26 54 26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>` +
    `<ellipse cx="54" cy="35" rx="4" ry="4.6" fill="${D}"/><ellipse cx="66" cy="35" rx="4" ry="4.6" fill="${D}"/><path d="M58.6 41 L60 39 L61.4 41Z" fill="${D}"/>` +
    line('M55 44 V47 M60 44 V47 M65 44 V47', D, 1.4) +
    `<path ${ol(2.4)} d="M40 60 C44 56 50 56 54 58 C58 55 64 55 66 58 C70 56 78 56 80 60 C76 64 44 64 40 60Z" fill="#FFC078"/>` +
    `<path ${ol(2.6)} d="M26 92 L32 74 H88 L94 92Z" fill="#FCC419"/>` +
    `<path d="M36 76 L32 90 M46 76 L42 90 M56 76 L52 90 M66 76 L62 90 M76 76 L72 90 M86 76 L82 90" stroke="${D}" stroke-width="3.4" opacity=".85"/><path ${ol(2.6)} d="M26 92 L32 74 H88 L94 92Z" fill="none"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="76" rx="15" ry="5" fill="#A61E1E"/><path ${ol(2.6)} d="M47 76 V72 C47 66 73 66 73 72 V76 C73 80 47 80 47 76Z" fill="#E03131"/><ellipse cx="54" cy="70" rx="3.6" ry="1.4" fill="#fff" opacity=".6"/>` +
    `<path ${ol(2.4)} d="M66 70 L82 56 C86 52 92 56 88 60 L96 54 C100 52 102 58 98 60 L76 76 C72 78 66 76 66 70Z" fill="#F4BE8F"/><path d="M70 66 C74 63 77 61 80 59" stroke="#E6A06B" stroke-width="1.4"/>` +
    `<rect ${ol(1.6)} x="48" y="83" width="24" height="7.6" rx="1.4" fill="#fff"/>` + t(60, 89, 5.6, 'NO TOCAR', '#E03131', 'textLength="20" lengthAdjust="spacingAndGlyphs"') +
    line('M36 66 l-6 -3 M84 46 l6 -4 M30 54 l-6 0', D, 2),

  // ══ AVENTUREROS AL TREN ══
  // ── Boletería ──
  'Boleto picado': () =>
    `<g transform="rotate(-14 52 58)"><rect ${ol(2.6)} x="28" y="42" width="50" height="30" rx="3" fill="#FFD8A8"/><rect x="31" y="45" width="44" height="24" rx="1.5" fill="none" stroke="#E8590C" stroke-width="1.2" stroke-dasharray="2 1.6"/>` +
    t(50, 55, 9, 'BOLETO', '#C2410C', 'textLength="30" lengthAdjust="spacingAndGlyphs"') + t(42, 65.5, 6.5, '2ª', '#C2410C') + t(58, 65.5, 5.4, 'Nº 0042', '#868E96') +
    `<circle ${ol(2)} cx="72" cy="57" r="3" fill="#FFF8F0"/>` + line('M32 42 V72', '#fff', 1.2, 'opacity=".5"') + `</g>` +
    stick('M72 72 C76 80 78 84 78 92', '#E03131', 4.4) + stick('M72 72 C80 76 86 78 92 80', '#E03131', 4.4) +
    `<path ${ol(2.4)} d="M62 62 L74 68 L72 76 L64 72Z" fill="#ADB5BD"/><circle ${ol(2)} cx="72" cy="72" r="3" fill="#868E96"/><path d="M64 64 L66 66" stroke="#fff" stroke-width="1.4"/>` +
    `<circle ${ol(1.4)} cx="56" cy="80" r="2" fill="#FFD8A8"/><circle ${ol(1.4)} cx="50" cy="88" r="1.6" fill="#FFD8A8"/>` +
    sparkle(84, 36, 4) + sparkle(30, 82, 3),
  'Abono mensual': () => {
    let st = ''
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const x = 41 + c * 9.4, y = 46 + r * 8.6; st += `<circle ${ol(1.2)} cx="${f(x)}" cy="${y}" r="3.4" fill="${(r * 5 + c) % 4 === 3 ? '#FCC419' : '#FF922B'}"/><path d="M${f(x - 1.6)} ${y} L${f(x - .4)} ${y + 1.4} L${f(x + 1.8)} ${y - 1.4}" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>` }
    return `<g transform="translate(0 8) rotate(-8 60 50) translate(60 50) scale(.86) translate(-60 -50)"><rect ${ol(2.6)} x="34" y="26" width="52" height="46" rx="4" fill="#E7F5FF"/><path ${ol(2.6)} d="M34 36 V30 a4 4 0 0 1 4 -4 H82 a4 4 0 0 1 4 4 V36Z" fill="#1971C2"/>` +
      t(60, 33.8, 6.4, 'ABONO', '#fff', 'letter-spacing=".6"') + st + `</g>` +
      `<rect ${ol(2)} x="26" y="62" width="20" height="13" rx="2" fill="#FFD8A8" transform="rotate(-24 36 68)"/><rect ${ol(2)} x="74" y="62" width="20" height="13" rx="2" fill="#FFC9C9" transform="rotate(20 84 68)"/>` +
      `<path ${ol(2.6)} d="M24 76 H96 V94 C96 98 94 100 90 100 H30 C26 100 24 98 24 94Z" fill="#8B4A2B"/><path d="M28 81 H92" stroke="#fff" stroke-width="1.4" stroke-dasharray="2.4 2.4" opacity=".55"/>` +
      `<path ${ol(2.4)} d="M80 82 H98 V92 H80Z" fill="#6B3E1F"/><circle ${ol(1.8)} cx="86" cy="87" r="2.2" fill="#FCC419"/>` + shine('M30 86 H56', 2, .35) + sparkle(30, 44, 3.5) + sparkle(88, 40, 3)
  },
  'Tren a las Nubes': () => {
    let truss = ''
    for (const x of [34, 50, 70, 86]) truss += `<path ${ol(2)} d="M${x - 3} 66 L${x - 7} 100 H${x + 7} L${x + 3} 66Z" fill="#C92A2A"/><path d="M${x - 4} 72 L${x + 4} 80 M${x + 4} 72 L${x - 4} 80 M${x - 5} 84 L${x + 5} 92 M${x + 5} 84 L${x - 5} 92" stroke="#7A1C1C" stroke-width="1.2"/>`
    return `<path ${ol(2.4)} d="M10 74 L34 40 L46 54 L62 32 L78 52 L88 44 L110 74Z" fill="#B197FC"/><path d="M62 32 L68 40 L64 39 L60 43 L56 39Z M34 40 L39 47 L30 47Z" fill="#fff"/>` +
      `<circle ${ol(2)} cx="82" cy="34" r="5.4" fill="#FFD43B"/>` +
      truss + `<rect ${ol(2.4)} x="16" y="62" width="88" height="5" rx="1" fill="#E03131"/><path d="M18 64.5 H102" stroke="#FFA8A8" stroke-width="1" stroke-dasharray="3 3"/>` +
      fluff(40, 88, 18, 6, 10, '#fff', 2) + fluff(78, 90, 20, 6, 10, '#fff', 2) + fluff(60, 96, 24, 6, 12, '#fff', 2) +
      wagon(46, 62, .52, '#FCC419') + steamLoco(66, 62, .52, '#E03131') +
      fluff(80, 36, 0, 0, 3, 'none', 0) + fluff(82, 34, 0, 0, 3, 'none', 0) + fluff(79, 37, 3.6, 2.4, 6, '#E9ECEF', 1.4) + sparkle(28, 54, 3.5, '#fff')
  },
  // ── Ruta más larga ──
  'Maquinista': () =>
    `<path ${ol(2.6)} d="M24 26 H96 V100 H24Z" fill="#C92A2A"/><path d="M24 30 H96" stroke="#A61E1E" stroke-width="2"/>` + dots([[30, 36], [90, 36], [30, 92], [90, 92]], 1.6, '#7A1C1C') +
    `<rect ${ol(2.6)} x="34" y="38" width="52" height="46" rx="5" fill="#FFE8CC"/>` +
    `<path ${ol(2.6)} d="M40 84 C40 74 48 70 60 70 C72 70 80 74 80 84Z" fill="#364FC7"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="58" rx="12" ry="12.5" fill="#F4BE8F"/>` +
    `<path ${ol(2.4)} d="M46 54 C45 42 52 38 60 38 C68 38 75 42 74 54Z" fill="#E7F5FF"/>` + line('M50 41 V54 M55 39 V54 M60 38.6 V54 M65 39 V54 M70 41 V54', '#1C7ED6', 1.8) +
    `<path ${ol(2.4)} d="M44 54 H78 C78 57 74 58 70 58 H44Z" fill="#1C2C5B"/>` +
    dots([[55, 61], [64, 61]], 1.5, D) + `<circle cx="51" cy="65" r="2" fill="#FF8FA3" opacity=".7"/><circle cx="69" cy="65" r="2" fill="#FF8FA3" opacity=".7"/>` +
    `<path ${ol(2)} d="M60 66 L72 64 L72 70 L60 69Z" fill="#FCC419"/><circle ${ol(1.8)} cx="74" cy="67" r="3.4" fill="#FCC419"/>` +
    line('M79 62 L84 60 M80 67 L85 67 M79 72 L84 74', D, 2) + t(78, 50, 7, 'piii', '#E03131', 'transform="rotate(-14 78 50)"') +
    `<rect ${ol(2.4)} x="30" y="84" width="60" height="5" rx="2" fill="#8B4A2B"/>`,
  'Expreso de Oriente': () => `<g transform="translate(0 -5)">` +
    `<path d="M22 92 H98" stroke="${D}" stroke-width="3"/><path d="M22 96 H98" stroke="#868E96" stroke-width="1.6" stroke-dasharray="4 3"/>` +
    `<path ${ol(2.6)} d="M22 36 C22 30 98 30 98 36 V40 H22Z" fill="#212529"/>` +
    `<rect ${ol(2.6)} x="22" y="40" width="76" height="42" rx="3" fill="#1C2C5B"/><path d="M22 46 H98 M22 76 H98" stroke="#FCC419" stroke-width="1.6"/>` +
    [30, 74].map(x => `<rect ${ol(2)} x="${x}" y="50" width="14" height="16" rx="3" fill="#FFE066"/><path d="M${x + 2} ${52} H${x + 12}" stroke="#E8590C" stroke-width="3"/>`).join('') +
    `<rect ${ol(2)} x="48" y="50" width="22" height="20" rx="3" fill="#FFE066"/><path d="M50 52 H68" stroke="#E8590C" stroke-width="3"/>` +
    `<circle cx="59" cy="62" r="5.4" fill="#F4BE8F"/><path ${ol(1.4)} d="M53 64 C55 61 58 62 59 63.4 C60 62 63 61 65 64 C63 63 61 64.4 59 64.4 C57 64.4 55 63 53 64Z" fill="#212529"/>` +
    `<path ${ol(1.6)} d="M54 58 C54 54 64 54 64 58Z" fill="#212529"/>` +
    `<circle cx="62" cy="61" r="7" fill="#A5D8FF" fill-opacity=".35" stroke="${D}" stroke-width="3.4"/><circle cx="62" cy="61" r="7" fill="none" stroke="#FCC419" stroke-width="1.6"/>` + line('M67 66 L74 74', D, 4.4) + line('M67 66 L74 74', '#8B5A3C', 2) +
    t(60, 80.6, 4, '◆ EXPRESO ◆', '#FCC419', 'textLength="28" lengthAdjust="spacingAndGlyphs"') +
    [34, 48, 72, 86].map(x => `<circle ${ol(2.2)} cx="${x}" cy="87" r="5" fill="#495057"/><circle cx="${x}" cy="87" r="1.6" fill="#CED4DA"/>`).join('') +
    `</g>` + sparkle(40, 28, 3.5) + sparkle(80, 26, 3),
  'Transiberiano': () => {
    const seg = [[18, 82], [44, 86], [38, 54], [60, 54], [82, 54], [76, 28], [104, 34]] as const
    const P = (k: number, tt: number) => { const [a, b, c, d] = [seg[k * 3], seg[k * 3 + 1], seg[k * 3 + 2], seg[k * 3 + 3]], m = 1 - tt; return [0, 1].map(i => m * m * m * a[i] + 3 * m * m * tt * b[i] + 3 * m * tt * tt * c[i] + tt * tt * tt * d[i]) }
    const dir = (k: number, tt: number) => { const p1 = P(k, Math.max(tt - .02, 0)), p2 = P(k, Math.min(tt + .02, 1)); return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI }
    const path = `M${seg[0].join(' ')} C${seg[1].join(' ')} ${seg[2].join(' ')} ${seg[3].join(' ')} C${seg[4].join(' ')} ${seg[5].join(' ')} ${seg[6].join(' ')}`
    const tree = (x: number, y: number, s: number) => `<path ${ol(1.8)} d="M${x} ${y - 10 * s} L${x + 5 * s} ${y} H${x - 5 * s}Z" fill="#2F9E44"/><path d="M${x - 2 * s} ${y - 5 * s} L${x} ${y - 10 * s} L${x + 2 * s} ${y - 5 * s}" fill="#fff"/>`
    let cars = ''
    const pts: [number, number][] = [[0, .2], [0, .42], [0, .62], [0, .82], [1, .05], [1, .27], [1, .5]]
    pts.forEach(([k, tt], i) => { const [x, y] = P(k, tt); cars += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(dir(k, tt))})"><rect ${ol(1.8)} x="-5" y="-3.4" width="10" height="6.8" rx="1.6" fill="${i === pts.length - 1 ? '#E03131' : ['#4DABF7', '#FCC419', '#40C057'][i % 3]}"/>${i === pts.length - 1 ? `<circle cx="3" cy="0" r="1.4" fill="${D}"/>` : ''}</g>` })
    return `<rect x="10" y="10" width="100" height="100" fill="#E7F5FF"/>` + line('M10 34 C40 30 80 30 110 34 M10 50 C40 46 80 46 110 50 M40 10 C36 40 36 80 40 110 M80 10 C84 40 84 80 80 110', '#A5D8FF', 1, 'stroke-dasharray="3 3"') + `<path d="M10 64 C30 60 40 70 60 66 C80 62 90 72 110 68 V110 H10Z" fill="#fff"/>` +
      `<path d="M10 40 C24 36 30 46 44 42" stroke="#A5D8FF" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      tree(30, 44, 1) + tree(88, 76, 1.1) + tree(48, 30, .8) + tree(94, 58, .8) + tree(28, 66, .9) + tree(70, 92, .8) +
      `<path d="${path}" stroke="${D}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="${path}" stroke="#ADB5BD" stroke-width="3.4" fill="none" stroke-dasharray="1.4 2.2"/>` + cars +
      dots([[40, 76], [56, 36], [84, 88], [72, 40], [26, 54], [96, 48]], 1.4, '#74C0FC') +
      fluff(96, 26, 4, 2.6, 6, '#fff', 1.4) + `<circle ${ol(1.8)} cx="22" cy="80" r="3" fill="#E03131"/>`
  },
  // ── Locomotora ──
  'Trencito de la Costa': () => {
    const palm = (x: number, y: number, s: number) => `<g transform="translate(${x} ${y}) scale(${s})">` + stick('M0 0 C1 -8 -1 -16 2 -24', '#B4703F', 2.4) +
      `<path ${ol(1.8 / s)} d="M2 -24 C-6 -28 -12 -24 -14 -18 C-8 -22 -4 -22 2 -24Z M2 -24 C10 -28 16 -24 18 -18 C12 -22 8 -22 2 -24Z M2 -24 C-2 -32 4 -36 10 -34 C4 -32 2 -28 2 -24Z M2 -24 C0 -30 -6 -34 -12 -32 C-6 -30 -2 -28 2 -24Z" fill="#40C057"/></g>`
    return `<circle ${ol(2)} cx="38" cy="34" r="7" fill="#FFD43B"/>` +
      `<path ${ol(2.4)} d="M14 80 Q30 76 46 80 T78 80 T110 80 V110 H14Z" fill="#74C0FC"/>` + line('M30 88 Q36 86 42 88 M60 92 Q66 90 72 92', '#fff', 1.6) +
      palm(28, 66, .9) + palm(92, 66, 1) +
      `<rect ${ol(2.4)} x="20" y="66" width="80" height="6" rx="1" fill="#C9A26B"/>` +
      wagon(44, 66, .62, '#F06595') + steamLoco(66, 66, .62, '#4DABF7', face(16, -16, 0, 0, 'smile', false)) +
      fluff(70, 32, 6, 3.4, 7, '#fff', 1.6) + heart(84, 30, 3.2, '#FF6B6B', 1.4)
  },
  'Locomotora a vapor': () =>
    fluff(68, 36, 12, 8, 10, '#F1F3F5') + fluff(52, 30, 8, 5.4, 8, '#F8F9FA') + fluff(84, 30, 7, 5, 7, '#E9ECEF') + fluff(40, 40, 5, 3.6, 6, '#F8F9FA', 2) +
    `<path ${ol(2)} d="M76 54 H96 C97.5 54 98 55 98 56 V64 C98 65 97.5 66 96 66 H86 L80 70 L82 66 H76 C74.5 66 74 65 74 64 V56 C74 55 74.5 54 76 54Z" fill="#fff"/>` + t(86, 63, 7, 'chucu', '#E03131', 'textLength="18" lengthAdjust="spacingAndGlyphs"') +
    `<path d="M22 92 H98" stroke="${D}" stroke-width="3"/>` +
    steamLoco(56, 92, 1.1, '#212529') +
    sparkle(30, 62, 3.5) + line('M90 76 L96 76 M88 84 L95 84', D, 2),
  'Tren bala': () =>
    line('M16 52 H38 M22 62 H34 M14 72 H42 M28 82 H40', D, 2.4) + line('M24 46 H36 M20 88 H32', '#ADB5BD', 2) +
    `<g transform="rotate(-14 62 66)"><path ${ol(2.6)} d="M30 56 H74 C88 56 98 64 104 74 H30Z" fill="#F8F9FA"/><path ${ol(2.6)} d="M30 74 H104 C102 78 98 80 92 80 H30Z" fill="#CED4DA"/>` +
    `<path d="M30 70 H96 C99 71 101 72 102.5 74 H30Z" fill="#1971C2"/><path d="M30 66 H94" stroke="#4DABF7" stroke-width="1.6"/>` +
    `<path ${ol(2)} d="M76 58 C84 58 90 62 94 66 H78Z" fill="#212529"/>` + shine('M80 60 L86 62', 1.6, .8) +
    [36, 48, 60].map(x => `<rect ${ol(1.6)} x="${x}" y="59" width="8" height="5" rx="1.6" fill="#A5D8FF"/>`).join('') +
    `<circle cx="101" cy="72" r="1.4" fill="#FCC419"/></g>` +
    line('M30 96 C50 94 70 92 96 84', '#ADB5BD', 2, 'stroke-dasharray="4 3"') + sparkle(86, 40, 4.5) + sparkle(42, 34, 3) + star(70, 30, 3.4, '#FFD43B', 1.4),

  // ══ JENGA ══
  // ── Pulso firme ──
  'Mano de relojero': () =>
    tower(48, 96, 9, 28, 6, ['4c']) + jblock(66, 66, 14, 6) +
    `<path ${ol(2.4)} d="M98 60 C92 58 86 60 80 62 L74 63 C71 63.5 71 66.5 74 67 L80 67 L74 70 C71 71 72 74 75 73.6 L84 72 C90 74 96 74 100 72Z" fill="#F4BE8F"/>` +
    line('M80 67 L84 66', '#E6A06B', 1.4) +
    `<circle cx="80" cy="38" r="11" fill="#fff"/><ellipse cx="80" cy="38" rx="6" ry="6.6" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="81" cy="39" r="3.6" fill="#4DABF7"/><circle cx="81" cy="39" r="1.8" fill="${D}"/><circle cx="82.4" cy="37.4" r=".9" fill="#fff"/>` +
    `<circle cx="80" cy="38" r="11" fill="#A5D8FF" fill-opacity=".25" stroke="${D}" stroke-width="7"/><circle cx="80" cy="38" r="11" fill="none" stroke="#495057" stroke-width="4"/>` + shine('M72 33 C73 30 76 28 79 28', 1.8, .9) +
    `<path ${ol(1.6)} d="M66 50 C67 53 68 54 68 55.4 A2.4 2.4 0 0 1 63.2 55.4 C63.2 54 64 53 66 50Z" fill="#74C0FC"/>` + sparkle(28, 40, 3.5),
  'Desactivador de bombas': () =>
    tower(52, 96, 8, 28, 6, ['3c']) + jblock(70, 72, 14, 6) +
    `<rect ${ol(2.4)} x="38" y="36" width="28" height="13" rx="2" fill="#343A40"/><rect x="41" y="38.6" width="22" height="8" rx="1" fill="#2B0A0A"/>` + t(52, 45.6, 7.4, '00:03', '#FF4D4D', 'textLength="19" lengthAdjust="spacingAndGlyphs"') +
    line('M44 49 C40 56 44 64 40 70 M60 49 C64 56 74 60 70 70', D, 3.6) + line('M44 49 C40 56 44 64 40 70', '#E03131', 1.8) + line('M60 49 C64 56 74 60 70 70', '#1C7ED6', 1.8) +
    stick('M84 68 L100 60', '#E03131', 4) + stick('M84 74 L100 80', '#E03131', 4) +
    `<path ${ol(2.2)} d="M76 70 L86 66 L88 70 L86 76 L76 74Z" fill="#ADB5BD"/><circle ${ol(1.6)} cx="86" cy="71" r="2" fill="#868E96"/>` +
    `<path ${ol(1.6)} d="M30 54 C31 57 32 58 32 59.4 A2.4 2.4 0 0 1 27.2 59.4 C27.2 58 28 57 30 54Z M76 40 C77 43 78 44 78 45.4 A2.4 2.4 0 0 1 73.2 45.4 C73.2 44 74 43 76 40Z" fill="#74C0FC"/>` +
    sparkle(84, 50, 3),
  'Equilibrista de circo': () => {
    let tent = ''
    for (let i = 0; i < 8; i++) tent += `<path d="M60 14 L${10 + i * 14} 44 L${17 + i * 14} 44Z" fill="${i % 2 ? '#fff' : '#E03131'}"/>`
    return `<path d="M60 14 L4 44 H116Z" fill="#E03131"/>` + tent + `<path d="M4 44 H116" stroke="${D}" stroke-width="2.4"/>` + line('M60 14 L4 44 M60 14 L116 44', D, 2.4) +
      `<path d="M10 44 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0" fill="#FCC419" stroke="${D}" stroke-width="2"/>` +
      line('M14 60 L60 58 L106 60', D, 1.8) +
      tower(60, 98, 6, 24, 6.4) +
      `<path ${ol(2)} d="M57 58 L55 50 M63 58 L65 50" fill="none"/><path ${ol(2.2)} d="M54 50 C54 44 66 44 66 50 L65 52 H55Z" fill="#9775FA"/>` +
      `<circle ${ol(2.2)} cx="60" cy="40" r="5" fill="#F4BE8F"/>` + dots([[58.2, 40], [61.8, 40]], .9, D) + line('M58.4 42.4 Q60 43.6 61.6 42.4', D, 1) +
      line('M55 47 L46 42 M65 47 L74 40', D, 2.4) + `<path ${ol(2)} d="M60 35 L56 31 L60 32 L64 31Z" fill="#FCC419"/>` +
      `<path ${ol(2.2)} d="M64 34 C66 26 80 24 86 30 C83 29 81 30 80 32 C78 30 75 30 73 33 C71 31 67 31 64 34Z" fill="#20C997"/>` + line('M75 31 L74 40', D, 1.6) +
      sparkle(32, 54, 3, '#fff') + sparkle(88, 54, 3.5)
  },
  // ── Rascacielos ──
  'Edificio de monoblock': () => {
    let rows = ''
    for (let i = 0; i < 10; i++) {
      const y = 92 - (i + 1) * 6.2
      rows += i % 2
        ? `<rect ${ol(1.8)} x="38" y="${f(y)}" width="44" height="6.2" rx="1" fill="#E9B872"/>` + [44, 52, 60, 68, 76].map(x => `<rect x="${x - 2}" y="${f(y + 1.5)}" width="4" height="3.2" fill="#74C0FC"/>`).join('')
        : [0, 1, 2].map(k => `<rect ${ol(1.8)} x="${f(38 + k * 44 / 3)}" y="${f(y)}" width="${f(44 / 3)}" height="6.2" rx="1" fill="${k === 1 ? '#F4C98A' : '#E9B872'}"/>`).join('') + [46, 60, 74].map(x => `<rect x="${x - 2}" y="${f(y + 1.5)}" width="4" height="3.2" fill="#74C0FC"/>`).join('')
    }
    return `<path ${ol(2.4)} d="M22 92 H98 V100 H22Z" fill="#ADB5BD"/>` + rows +
      `<rect ${ol(2)} x="62" y="22" width="10" height="8" rx="1" fill="#CED4DA"/>` + line('M64 30 V32 M70 30 V32', D, 1.6) + line('M46 30 V18 M43 21 H49', D, 1.6) +
      line('M82 55 C88 58 92 58 98 55', D, 1.2) + `<rect x="86" y="56" width="4" height="5" fill="#FF6B6B" stroke="${D}" stroke-width="1"/><rect x="92" y="55.6" width="4" height="4" fill="#FCC419" stroke="${D}" stroke-width="1"/>` +
      `<rect ${ol(1.6)} x="48" y="84" width="10" height="8" fill="#8B5A3C"/>` +
      `<rect ${ol(1.6)} x="22" y="70" width="14" height="9" rx="1" fill="#fff"/>` + line('M24.6 77 H27 V74.6 H29.4 V72.2 H32 V70.8', '#E03131', 1.4) + line('M24 72 L34 78', '#E03131', 1.4) +
      sparkle(30, 46, 3.5) + sparkle(90, 40, 3, '#fff')
  },
  'Kavanagh': () => {
    const steps: [number, number, number, number][] = [[30, 90, 60, 6], [36, 84, 54, 4], [42, 72, 48, 3], [48, 60, 36, 3], [53, 50, 24, 2], [56.5, 42, 16, 2]]
    let b = ''
    steps.forEach(([x0, w, top, n]) => {
      const h = 6
      for (let i = 0; i < n; i++) {
        const y = top + 32 - i * h - (top === 60 ? 0 : 0)
        void y
      }
      void w; void x0
    })
    const level = (x: number, w: number, y: number, rows: number) => {
      let r = ''
      for (let i = 0; i < rows; i++) {
        const yy = y - (i + 1) * 6
        r += i % 2 ? `<rect ${ol(1.8)} x="${x}" y="${yy}" width="${w}" height="6" rx="1" fill="#E9B872"/><path d="M${x + 3} ${yy + 2.4} H${x + w - 3}" stroke="#C9852E" stroke-width=".9"/>`
          : [0, 1, 2].map(k => `<rect ${ol(1.8)} x="${f(x + k * w / 3)}" y="${yy}" width="${f(w / 3)}" height="6" rx="1" fill="${k === 1 ? '#F4C98A' : '#E9B872'}"/>`).join('')
      }
      return r
    }
    b = level(34, 52, 94, 4) + level(40, 40, 70, 3) + level(46, 28, 52, 2) + level(51, 18, 40, 2)
    return burst(60, 50, 30, 24, 14, '#FFF3BF') + b + line('M60 28 V18', D, 4) + line('M60 28 V18', '#ADB5BD', 1.8) + `<circle ${ol(1.6)} cx="60" cy="18" r="2" fill="#E03131"/>` +
      `<path d="M40 94 V74 M80 94 V74" stroke="#fff" stroke-width="1.4" opacity=".35"/>` + `<rect ${ol(1.6)} x="55" y="86" width="10" height="8" rx="4" fill="#8B5A3C"/>` +
      sparkle(28, 56, 3.5) + sparkle(92, 60, 4) + star(80, 34, 3.4, '#FFD43B', 1.4)
  },
  'Torre de Babel': () => {
    const tier = (y: number, w: number, c: string) => `<path ${ol(2.2)} d="M${60 - w / 2} ${y} L${60 - w / 2 + 3} ${y - 10} H${60 + w / 2 - 3} L${60 + w / 2} ${y}Z" fill="${c}"/>` +
      line(`M${60 - w / 2 + 2} ${y - 4} L${60 + w / 2 - 6} ${y - 9}`, '#A35E2F', 1.6) + [0.25, .5, .75].map(k => `<rect x="${f(60 - w / 2 + w * k - 1.4)}" y="${y - 6}" width="2.8" height="3.6" rx="1.2" fill="#6B3E1F"/>`).join('')
    const bub = (x: number, y: number, txt: string, c: string) => `<path ${ol(1.8)} d="M${x - 8} ${y - 6} H${x + 8} C${x + 10} ${y - 6} ${x + 10} ${y + 4} ${x + 8} ${y + 4} H${x - 2} L${x - 6} ${y + 8} L${x - 5} ${y + 4} H${x - 8} C${x - 10} ${y + 4} ${x - 10} ${y - 6} ${x - 8} ${y - 6}Z" fill="#fff"/>` + t(x, y + 2, 8, txt, c)
    return fluff(60, 28, 22, 7, 12, '#fff', 2) +
      tier(96, 68, '#E9B872') + tier(86, 56, '#F4C98A') + tier(76, 46, '#E9B872') + tier(66, 36, '#F4C98A') + tier(56, 26, '#E9B872') + tier(46, 16, '#F4C98A') +
      fluff(48, 40, 9, 4, 8, '#fff', 2) + fluff(74, 38, 9, 4, 8, '#fff', 2) +
      bub(32, 52, '¿?', '#E03131') + bub(88, 50, '#!', '#1C7ED6') + bub(84, 76, 'ñ?', '#2F9E44') + sparkle(36, 74, 3)
  },
  // ── Demoledor ──
  'Hipo': () =>
    `<g transform="rotate(10 70 96)">` + tower(70, 96, 8, 24, 6) + `</g>` + jblock(82, 40, 12, 5.4, 30) +
    line('M76 36 l3 -4 M88 44 l5 0', D, 1.6) +
    `<path ${ol(2.6)} d="M24 100 C24 86 30 80 40 80 C50 80 56 86 56 100Z" fill="#40C057"/>` +
    `<circle ${ol(2.6)} cx="40" cy="66" r="12" fill="#FFD8B5"/><path ${ol(2.2)} d="M28 62 C28 52 52 52 52 62 C46 58 34 58 28 62Z" fill="#8B5A3C"/>` +
    line('M34 66 Q36 64 38 66 M42 66 Q44 64 46 66', D, 1.6) + `<ellipse cx="40" cy="72" rx="2" ry="2.4" fill="${D}"/><circle cx="33" cy="70" r="2" fill="#FF8FA3" opacity=".7"/><circle cx="47" cy="70" r="2" fill="#FF8FA3" opacity=".7"/>` +
    `<path ${ol(2)} d="M30 34 H52 C55 34 55 46 52 46 H42 L36 51 L37 46 H30 C27 46 27 34 30 34Z" fill="#fff"/>` + t(41, 43.6, 9, '¡hic!', '#E03131') +
    line('M24 56 l-3 -2 M56 56 l3 -2', D, 1.6),
  'Bola de demolición': () =>
    `<path ${ol(2.4)} d="M14 38 L60 30 L62 36 L14 46Z" fill="#FCC419"/>` + line('M20 39 L26 44 M30 37 L36 43 M40 35 L46 41 M50 33 L56 39', D, 1.4) +
    line('M58 35 L44 62', D, 2) + `<circle ${ol(2.6)} cx="42" cy="68" r="10" fill="#495057"/>` + shine('M36 64 C37 61 40 60 42 60', 2.2, .6) +
    line('M22 60 C26 64 28 70 30 76 M26 54 C32 58 34 64 36 70', D, 1.6, 'opacity=".5"') +
    burst(54, 70, 8, 4, 8, '#FFE066') +
    tower(76, 96, 7, 24, 6, ['2c', '3l', '4c']) +
    jblock(62, 50, 12, 5.4, -30) + jblock(58, 82, 10, 5, 20) + jblock(86, 44, 12, 5.4, 25) +
    line('M60 60 l-4 -3 M58 66 l-5 0', D, 1.6) + sparkle(88, 26, 3.5),
  'King Kong': () =>
    `<g transform="rotate(-4 64 98)">` + tower(64, 98, 6, 26, 6.4, ['5c']) + `</g>` +
    jblock(30, 50, 12, 5.4, -30) + jblock(32, 70, 11, 5, 40) + jblock(84, 40, 12, 5.4, 20) +
    `<path ${ol(2.6)} d="M42 60 C40 48 48 40 60 40 C72 40 80 48 78 60 C78 64 74 66 70 66 H50 C46 66 42 64 42 60Z" fill="#495057"/>` +
    `<path ${ol(2.6)} d="M46 54 C40 48 36 46 36 40 C40 38 43 40 44 44" fill="#495057"/><circle ${ol(2.4)} cx="37" cy="39" r="5" fill="#495057"/>` +
    `<path ${ol(2.6)} d="M74 52 C82 56 86 64 84 72" fill="none" stroke-width="7"/><path d="M74 52 C82 56 86 64 84 72" stroke="#495057" stroke-width="3.4" fill="none" stroke-linecap="round"/>` +
    `<circle ${ol(2.6)} cx="60" cy="34" r="11" fill="#495057"/><path ${ol(2)} d="M52 36 C52 30 68 30 68 36 C68 42 64 44 60 44 C56 44 52 42 52 36Z" fill="#CC9A7A"/>` +
    `<path d="M51 30 Q55 27 59 30 M61 30 Q65 27 69 30" stroke="${D}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + dots([[55.5, 32.6], [64.5, 32.6]], 1.4, D) +
    `<path ${ol(1.6)} d="M55 39 Q60 43 65 39Z" fill="#fff"/><ellipse cx="57.6" cy="35.8" rx=".9" ry=".7" fill="${D}"/><ellipse cx="62.4" cy="35.8" rx=".9" ry=".7" fill="${D}"/>` +
    `<path ${ol(1.8)} d="M52 50 C54 46 66 46 68 50 C66 56 54 56 52 50Z" fill="#6C757D"/>` +
    burst(30, 40, 6, 3, 8, '#FFE066') + `<circle ${ol(2.4)} cx="84" cy="74" r="4.6" fill="#495057"/>` + sparkle(90, 58, 3.5),

  // ══ WAVELENGTH ══
  // ── Tiro al blanco ──
  'Dardo en la diana': () => {
    let wedges = ''
    for (let i = 0; i < 20; i++) {
      const a1 = (i * 18 - 99) * Math.PI / 180, a2 = ((i + 1) * 18 - 99) * Math.PI / 180, R = 28
      wedges += `<path d="M60 60 L${f(60 + R * Math.cos(a1))} ${f(60 + R * Math.sin(a1))} A${R} ${R} 0 0 1 ${f(60 + R * Math.cos(a2))} ${f(60 + R * Math.sin(a2))}Z" fill="${i % 2 ? '#212529' : '#FFF3D6'}"/>`
    }
    return `<circle ${ol(2.6)} cx="60" cy="60" r="34" fill="#212529"/>` + [24, 26, 28, 30].map((n, i) => `<circle cx="60" cy="60" r="0" data-x="${n}${i}"/>`).join('') + wedges +
      `<circle cx="60" cy="60" r="26.4" fill="none" stroke="#E03131" stroke-width="3" stroke-dasharray="4.6 4"/><circle cx="60" cy="60" r="16" fill="none" stroke="#2F9E44" stroke-width="3" stroke-dasharray="2.8 2.4"/>` +
      `<circle ${ol(1.6)} cx="60" cy="60" r="5" fill="#2F9E44"/><circle cx="60" cy="60" r="2.4" fill="#E03131"/><circle class="m-ol" cx="60" cy="60" r="28" fill="none"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<circle cx="${f(60 + 31 * Math.cos(a))}" cy="${f(60 + 31 * Math.sin(a))}" r=".9" fill="#ADB5BD"/>` }).join('') +
      `<g transform="rotate(-38 60 60)">` + stick('M60 60 H74', '#ADB5BD', 2.2) + `<path ${ol(2)} d="M64 57.4 L72 57.4 L74 60 L72 62.6 L64 62.6Z" fill="#E03131"/>` +
      `<path ${ol(2)} d="M73 60 L82 53 L86 55 L80 60 L86 65 L82 67Z" fill="#4DABF7"/></g>` +
      sparkle(30, 30, 3.5) + sparkle(90, 86, 3)
  },
  'Guillermo Tell': () =>
    `<path ${ol(2.6)} d="M30 100 C30 86 42 80 60 80 C78 80 90 86 90 100Z" fill="#2F9E44"/>` +
    `<ellipse ${ol(2.6)} cx="60" cy="66" rx="15" ry="15" fill="#FFD8B5"/><path ${ol(2.4)} d="M45 62 C45 50 75 50 75 62 C70 58 50 58 45 62Z" fill="#C97B45"/>` +
    `<circle cx="54" cy="66" r="2.8" fill="#fff" stroke="${D}" stroke-width="1.4"/><circle cx="66" cy="66" r="2.8" fill="#fff" stroke="${D}" stroke-width="1.4"/>` + dots([[54, 65.2], [66, 65.2]], 1.2, D) +
    line('M55 74 Q57 72.6 59 74 Q61 75.4 63 74 Q64 73.4 65 74', D, 1.6) + `<path ${ol(1.4)} d="M76 60 C77 63 78 64 78 65.4 A2.2 2.2 0 0 1 73.6 65.4 C73.6 64 74 63 76 60Z" fill="#74C0FC"/>` +
    `<circle ${ol(2.6)} cx="60" cy="44" r="10" fill="#E03131"/><path d="M60 35 C59 40 61 48 60 54" stroke="#FFF3BF" stroke-width="2.6"/><path d="M60 35 C59 40 61 48 60 54" stroke="${D}" stroke-width="1" fill="none"/>` + shine('M53 40 C53 38 55 36 57 36', 2, .7) +
    line('M60 35 C60 31 62 29 64 28', '#6B3E1F', 1.8) + `<path ${ol(1.4)} d="M62 31 C64 27 68 27 69 29 C67 31 64 31 62 31Z" fill="#69DB7C"/>` +
    stick('M22 44 H96', '#C97B45', 1.8) + `<path ${ol(2)} d="M94 40 L102 44 L94 48Z" fill="#ADB5BD"/><path ${ol(1.8)} d="M22 44 L16 39 H24 L28 44 L24 49 H16Z" fill="#FCC419"/>` +
    line('M74 36 l4 -4 M74 52 l4 4 M46 36 l-4 -4 M46 52 l-4 4', D, 1.8) + sparkle(84, 64, 3.5),
  'Antena parabólica': () =>
    [[12, '#FCC419'], [20, '#FF922B'], [28, '#4DABF7']].map(([r, c]) => { const R = r as number, a1 = 105 * Math.PI / 180, a2 = 165 * Math.PI / 180; return `<path d="M${f(86 + R * Math.cos(a1))} ${f(30 + R * Math.sin(a1))} A${R} ${R} 0 0 1 ${f(86 + R * Math.cos(a2))} ${f(30 + R * Math.sin(a2))}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` }).join('') +
    `<g transform="rotate(30 88 28)"><rect ${ol(1.8)} x="84" y="25" width="8" height="6" rx="1" fill="#ADB5BD"/><rect ${ol(1.6)} x="76" y="26" width="7" height="4" fill="#4DABF7"/><rect ${ol(1.6)} x="93" y="26" width="7" height="4" fill="#4DABF7"/></g>` +
    `<path ${ol(2.4)} d="M20 88 L60 80 L100 88 V100 H20Z" fill="#E8590C"/>` + line('M26 92 L60 86 L94 92', '#C2410C', 1.4) +
    line('M46 84 L52 70 M58 84 L54 70', D, 4.6) + line('M46 84 L52 70 M58 84 L54 70', '#868E96', 2) +
    `<g transform="rotate(35 52 60)"><path ${ol(2.6)} d="M30 54 C30 74 74 74 74 54Z" fill="#F8F9FA"/><path d="M36 58 C40 66 64 66 68 58" stroke="#DEE2E6" stroke-width="2" fill="none"/>` +
    line('M52 68 V42', D, 4.4) + line('M52 68 V42', '#ADB5BD', 2) + `<circle ${ol(2)} cx="52" cy="42" r="3" fill="#E03131"/></g>` +
    sparkle(32, 44, 3.5) + sparkle(88, 66, 3) + star(40, 30, 3, '#FFD43B', 1.4),
  // ── En la misma onda ──
  'Walkie-talkie': () => {
    const wt = (x: number, rot: number, c: string) => `<g transform="rotate(${rot} ${x} 64)">` + line(`M${x + 5} 46 V30`, D, 4.4) + line(`M${x + 5} 46 V30`, '#495057', 2) +
      `<rect ${ol(2.6)} x="${x - 9}" y="44" width="18" height="40" rx="4" fill="${c}"/><rect ${ol(1.8)} x="${x - 6}" y="48" width="12" height="9" rx="1.6" fill="#C3FAE8"/>` +
      line(`M${x - 4} 52.6 q1.4 -3 2.8 0 t2.8 0 t2.8 0`, '#087F5B', 1.2) +
      `<rect x="${x - 6}" y="61" width="12" height="11" rx="2" fill="${D}" opacity=".25"/>` + line(`M${x - 4} 64 H${x + 4} M${x - 4} 67 H${x + 4} M${x - 4} 70 H${x + 4}`, D, 1.2) +
      `<circle ${ol(1.6)} cx="${x}" cy="78" r="2.4" fill="#E03131"/>` + shine(`M${x - 6} 76 V58`, 1.6, .4) + `</g>`
    return wt(36, -10, '#FCC419') + wt(84, 10, '#4DABF7') +
      [8, 14, 20].map((r, i) => `<path d="M${60 - r * .5} ${f(52 - r * .86)} A${r} ${r} 0 0 1 ${60 - r * .5} ${f(52 + r * .86)}" transform="translate(${-10 + r * 0} 0)" fill="none" stroke="${['#FCC419', '#FF922B', '#4DABF7'][i]}" stroke-width="0"/>`).join('') +
      line('M48 58 q3 -6 6 0 t6 0 t6 0', '#FF922B', 2.6) + line('M48 66 q3 -6 6 0 t6 0 t6 0', '#4DABF7', 2.6) +
      heart(60, 40, 3.6, '#FF6B6B', 1.6) + sparkle(30, 92, 3) + sparkle(90, 92, 3)
  },
  'Radio AM': () => `<g transform="translate(-12 4)">` +
    `<path ${ol(2.4)} d="M62 90 C66 66 80 58 92 60 C100 62 104 72 106 90Z" fill="#8CE99A"/><path d="M70 82 C76 72 84 68 92 68" stroke="#fff" stroke-width="1.6" fill="none" opacity=".5"/>` +
    `<path ${ol(2.2)} d="M82 60 C80 52 86 46 92 48 C98 50 98 58 92 60 C88 62 84 62 82 60Z" fill="#ADB5BD"/>` + shine('M86 51 C88 49 90 49 92 50', 1.4, .7) + `</g>` +
    [8, 15, 22].map(r => `<path d="M${88 - r * .2} ${f(40 - r * .5)} A${r} ${r} 0 0 0 ${f(88 - r * .95)} ${f(40 + r * .1)}" transform="translate(-12 4)" fill="none" stroke="${r === 8 ? '#FCC419' : r === 15 ? '#FF922B' : '#4DABF7'}" stroke-width="2.2" stroke-linecap="round"/>`).join('') +
    `<g transform="translate(49 66) scale(.72) translate(-60 -64)">` +
    `<path ${ol(3)} d="M30 94 V58 C30 36 46 28 60 28 C74 28 90 36 90 58 V94Z" fill="#8B4A2B"/><path d="M34 90 V58 C34 40 48 32 60 32" stroke="#B4703F" stroke-width="2" fill="none"/>` +
    `<path ${ol(2.4)} d="M40 70 V58 C40 44 50 38 60 38 C70 38 80 44 80 58 V70Z" fill="#E8C39E"/>` + line('M46 44 V70 M53 39.6 V70 M60 38 V70 M67 39.6 V70 M74 44 V70', '#C9A27A', 1.6) +
    `<rect ${ol(2.4)} x="38" y="74" width="44" height="10" rx="2" fill="#FFF3BF"/>` +
    `<path d="M43 79 H77" stroke="${D}" stroke-width=".8"/><rect x="56" y="76" width="4" height="6" fill="#4DABF7"/><rect x="53" y="76" width="3" height="6" fill="#FF922B"/><rect x="60" y="76" width="3" height="6" fill="#FF922B"/>` + line('M58 75 V83', '#E03131', 1.8) +
    `<circle ${ol(2.4)} cx="44" cy="90" r="2.6" fill="#FCC419"/><circle ${ol(2.4)} cx="76" cy="90" r="2.6" fill="#FCC419"/></g>` + sparkle(28, 40, 3.5),
  'Torre de transmisión': () => {
    const ring = (r: number, c: string) => `<ellipse cx="60" cy="86" rx="${r}" ry="${f(r * .32)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="5 3"/>`
    return burst(60, 38, 22, 17, 12, '#FFF3BF') +
      `<path ${ol(2.4)} d="M14 80 C30 72 90 72 106 80 V110 H14Z" fill="#8CE99A"/>` + ring(40, '#4DABF7') + ring(28, '#FF922B') + ring(16, '#FCC419') +
      [[30, 84], [88, 82], [44, 94], [78, 94]].map(([x, y]) => `<path ${ol(1.6)} d="M${x} ${y} C${x - 4} ${y - 4} ${x - 3} ${y - 8} ${x} ${y - 8} C${x + 3} ${y - 8} ${x + 4} ${y - 4} ${x} ${y}Z" fill="#E03131"/><circle cx="${x}" cy="${y - 5}" r="1.2" fill="#fff"/>`).join('') +
      `<path ${ol(2.4)} d="M52 88 L58 34 H62 L68 88Z" fill="#fff"/><path d="M53.5 76 H66.5 M55 62 H65 M56.5 48 H63.5" stroke="#E03131" stroke-width="5"/>` +
      line('M53 88 L64 74 L55.5 62 L63 50 L57.5 40 M67 88 L56 74 L64.5 62 L57 50 L62.5 40', D, 1.2) + `<path ${ol(2.4)} d="M52 88 L58 34 H62 L68 88Z" fill="none"/>` +
      `<circle ${ol(2)} cx="60" cy="30" r="3.6" fill="#E03131"/>` +
      [8, 14, 20].map((r) => `<path d="M${60 - r} ${30 - r * .3} A${r} ${r} 0 0 1 ${60 - r * .7} ${30 - r * .9} M${60 + r} ${30 - r * .3} A${r} ${r} 0 0 0 ${60 + r * .7} ${30 - r * .9}" fill="none" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/>`).join('') +
      sparkle(30, 56, 3.5) + sparkle(92, 60, 3)
  },
}
