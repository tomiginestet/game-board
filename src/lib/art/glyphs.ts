// Dibujos genéricos para medallas sin ilustración propia (juegos agregados a mano o por la IA).
// Mismo estilo que el resto: contorno grueso, relleno plano con el color del juego y brillitos.
import type { Glyph } from '../games/schema'
import { D, f, heart, starPts, stick } from './helpers'

/** Mezcla un color hex con otro (t=0 → c, t=1 → o). Si no es hex, devuelve el color tal cual. */
const mix = (c: string, o: string, k: number) => {
  const p = (h: string) => {
    const m = h.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
    if (!m) return null
    const x = m[1].length === 3 ? m[1].replace(/./g, (d) => d + d) : m[1]
    return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16))
  }
  const a = p(c), b = p(o)
  if (!a || !b) return c
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join('')
}
const hash = (s: string) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h }
const ol = (sw?: number) => `class="m-ol"${sw ? ` style="stroke-width:${sw}"` : ''}`
const shine = (x: number, y: number, rx: number, ry: number, rot = -35) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".75" transform="rotate(${rot} ${x} ${y})"/>`
const sparkle = (x: number, y: number, r: number, c: string) => `<polygon ${ol(1.6)} points="${starPts(x, y, r, r * .38, 4)}" fill="${c}"/>`
const face = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-5" cy="0" r="2.2" fill="${D}"/><circle cx="5" cy="0" r="2.2" fill="${D}"/><circle cx="-4.3" cy="-.8" r=".8" fill="#fff"/><circle cx="5.7" cy="-.8" r=".8" fill="#fff"/>` +
  `<circle cx="-9" cy="4" r="2.6" fill="#FF8FA3" opacity=".7"/><circle cx="9" cy="4" r="2.6" fill="#FF8FA3" opacity=".7"/><path d="M-3 4 Q0 7.5 3 4" fill="none" stroke="${D}" stroke-width="1.8" stroke-linecap="round"/></g>`
const MEEPLE = 'M-5 -6 C-10 -8 -9 -21 0 -21 C9 -21 10 -8 5 -6 L16 -4 C22 -3 22 6 16 6 L10 5 L15 19 C16 22 14 23 11 23 L3 23 C2 18 1 15 0 13 C-1 15 -2 18 -3 23 L-11 23 C-14 23 -16 22 -15 19 L-10 5 L-16 6 C-22 6 -22 -3 -16 -4Z'

type Pal = { c: string; dk: string; lt: string; xl: string }
const DRAW: Record<Glyph, (p: Pal) => string> = {
  crown: ({ c, dk, lt }) =>
    `<path ${ol()} d="M32 76 L28 42 L44 56 L60 32 L76 56 L92 42 L88 76Z" fill="${c}"/><path d="M34 70 L88 70" stroke="${dk}" stroke-width="3"/>` +
    `<rect ${ol()} x="30" y="74" width="60" height="12" rx="4" fill="${dk}"/><circle ${ol(1.8)} cx="28" cy="40" r="4" fill="${lt}"/><circle ${ol(1.8)} cx="60" cy="29" r="4.5" fill="${lt}"/><circle ${ol(1.8)} cx="92" cy="40" r="4" fill="${lt}"/>` +
    `<path ${ol(2)} d="M60 52 L65 59 L60 66 L55 59Z" fill="#fff"/><circle ${ol(1.8)} cx="44" cy="80" r="2.6" fill="#E03131"/><circle ${ol(1.8)} cx="60" cy="80" r="2.6" fill="#4DABF7"/><circle ${ol(1.8)} cx="76" cy="80" r="2.6" fill="#40C057"/>` +
    `<path d="M36 64 L34 50" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>`,
  trophy: ({ c, dk, lt }) =>
    `<path d="M42 38 C26 38 28 60 46 60 M78 38 C94 38 92 60 74 60" fill="none" stroke="${D}" stroke-width="8"/><path d="M42 38 C26 38 28 60 46 60 M78 38 C94 38 92 60 74 60" fill="none" stroke="${dk}" stroke-width="3.6"/>` +
    `<path ${ol()} d="M38 30 H82 V42 C82 58 72 66 60 66 C48 66 38 58 38 42Z" fill="${c}"/><rect ${ol()} x="54" y="64" width="12" height="12" fill="${dk}"/>` +
    `<path ${ol()} d="M44 76 H76 L80 88 H40Z" fill="${dk}"/><rect x="50" y="79.5" width="20" height="4.5" rx="1" fill="${lt}"/>` +
    `<polygon ${ol(1.8)} points="${starPts(60, 46, 8)}" fill="#fff"/><path d="M44 36 V46" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  star: ({ c, dk }) =>
    `<polygon ${ol(3)} points="${starPts(60, 60, 34, 16)}" fill="${c}" stroke-linejoin="round"/><polygon points="${starPts(60, 60, 34, 16)}" fill="${dk}" opacity=".0"/>` +
    `<path d="M48 44 L52 36" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` + face(60, 62),
  flame: ({ c, lt }) =>
    `<path ${ol()} d="M60 18 C64 30 76 32 80 44 C84 32 82 28 80 24 C90 32 94 46 92 58 C90 76 76 88 60 88 C44 88 30 76 28 58 C27 48 32 38 38 32 C38 38 40 42 44 44 C46 32 52 26 60 18Z" fill="${c}"/>` +
    `<path d="M60 38 C63 46 70 48 72 56 C74 50 74 48 73 44 C79 50 80 58 79 64 C77 76 70 82 60 82 C50 82 43 76 41 66 C40 58 44 52 48 48 C48 52 50 55 52 56 C53 48 56 44 60 38Z" fill="${lt}"/>` + face(60, 68, .9),
  dice: ({ c, dk, lt, xl }) => {
    const x = 60, y = 56, s = 28, k = f(s * .87), h = s / 2
    const fc = (ox: number, oy: number, ux: number, uy: number, vx: number, vy: number, pts: [number, number][]) =>
      `<g transform="matrix(${ux} ${uy} ${vx} ${vy} ${f(ox)} ${f(oy)})">${pts.map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".1" fill="#fff"/>`).join('')}</g>`
    return `<path d="M${x} ${y - s} L${x + k} ${y - h} L${x} ${y} L${x - k} ${y - h}Z" fill="${lt}"/><path d="M${x - k} ${y - h} L${x} ${y} L${x} ${y + s} L${x - k} ${y + h}Z" fill="${c}"/><path d="M${x} ${y} L${x + k} ${y - h} L${x + k} ${y + h} L${x} ${y + s}Z" fill="${dk}"/>` +
      fc(x - k, y - h, k, -h, k, h, [[.5, .5]]).replace('fill="#fff"', `fill="${dk}"`) + fc(x - k, y - h, k, h, 0, s, [[.27, .27], [.5, .5], [.73, .73]]) + fc(x, y, k, -h, 0, s, [[.27, .27], [.73, .27], [.27, .73], [.73, .73]]) +
      `<path ${ol()} d="M${x} ${y - s} L${x + k} ${y - h} L${x + k} ${y + h} L${x} ${y + s} L${x - k} ${y + h} L${x - k} ${y - h}Z M${x - k} ${y - h} L${x} ${y} L${x + k} ${y - h} M${x} ${y} V${y + s}" fill="none"/>` +
      `<path d="M${x - k + 4} ${y - h + 6} V${y + h - 4}" stroke="${xl}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`
  },
  cards: ({ c, dk }) => {
    const cd = (rot: number, inner: string, fill = '#fff') => `<g transform="rotate(${rot} 60 92)"><rect ${ol()} x="45" y="32" width="30" height="42" rx="4" fill="${fill}"/>${inner}</g>`
    return cd(-22, `<rect x="49" y="36" width="22" height="34" rx="2" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/><path d="M52 40 L68 66 M68 40 L52 66" stroke="#fff" stroke-width="1.4" opacity=".4"/>`, dk) +
      cd(0, `<rect x="49" y="36" width="22" height="34" rx="2" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/><circle cx="60" cy="53" r="6" fill="#fff" opacity=".6"/>`, c) +
      cd(22, heart(60, 53, 6.5, c, 2) + `<text x="50.5" y="42" font-family="Lilita One, sans-serif" font-size="8" fill="${dk}" text-anchor="middle">A</text>`)
  },
  heart: ({ c }) => heart(60, 58, 25, c, 3) + shine(44, 47, 4, 2.4) + face(60, 58),
  shield: ({ c, dk, lt }) =>
    `<path ${ol()} d="M60 24 L88 32 L87 58 C86 74 74 86 60 92 C46 86 34 74 33 58 L32 32Z" fill="${c}"/>` +
    `<path d="M60 28 L84 35 L83 58 C82 72 72 82 60 87Z" fill="${dk}" opacity=".45"/><path ${ol(2.2)} d="M60 24 V92" fill="none"/>` +
    `<path d="M38 38 L38 56" stroke="${lt}" stroke-width="3.4" stroke-linecap="round"/>` +
    `<circle ${ol(2)} cx="60" cy="56" r="11" fill="#fff"/><polygon ${ol(1.6)} points="${starPts(60, 56.5, 7)}" fill="${c}"/>`,
  coin: ({ c, dk, lt }) =>
    `<ellipse ${ol()} cx="66" cy="82" rx="22" ry="8" fill="${dk}"/><ellipse ${ol()} cx="66" cy="76" rx="22" ry="8" fill="${c}"/>` +
    `<circle ${ol()} cx="54" cy="50" r="26" fill="${c}"/><circle cx="54" cy="50" r="19" fill="none" stroke="${dk}" stroke-width="2.4"/>` +
    `<circle cx="54" cy="50" r="17" fill="${lt}" opacity=".5"/>` + shine(41, 37, 4, 2.4) + face(54, 50, .95) +
    `<path d="M86 32 L86 40 M82 36 L90 36" stroke="${D}" stroke-width="2.2" stroke-linecap="round"/>`,
  meeple: ({ c }) =>
    `<g transform="translate(60 60) scale(1.45)"><path ${ol(1.8)} d="${MEEPLE}" fill="${c}"/>${shine(-4, -16, 2.4, 1.5)}<path d="M-15 -1 L-9 -2" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></g>` + face(60, 41, .78),
  bolt: ({ c, lt }) =>
    `<path ${ol()} d="M66 20 L36 64 H56 L50 98 L84 48 H63Z" fill="${c}"/><path d="M62 30 L44 58" stroke="${lt}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M30 40 L24 38 M28 50 L21 51 M92 64 L98 66 M90 74 L96 78" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`,
  skull: ({ c, xl }) =>
    `<path ${ol()} d="M34 54 C32 34 46 24 60 24 C74 24 88 34 86 54 C85 62 80 66 78 68 V78 C78 82 74 84 70 84 H50 C46 84 42 82 42 78 V68 C40 66 35 62 34 54Z" fill="${xl}"/>` +
    `<path d="M70 72 V83 M60 72 V84 M50 72 V83" stroke="${D}" stroke-width="2"/>` +
    `<ellipse ${ol(2)} cx="49" cy="54" rx="7" ry="8" fill="${c}"/><ellipse ${ol(2)} cx="71" cy="54" rx="7" ry="8" fill="${c}"/><circle cx="47" cy="51" r="2.2" fill="#fff"/><circle cx="69" cy="51" r="2.2" fill="#fff"/>` +
    `<path ${ol(2)} d="M60 62 L56.5 68 H63.5Z" fill="${D}"/>` + shine(44, 35, 4, 2.4),
  rocket: ({ c, dk }) =>
    `<path ${ol(2)} d="M52 80 C50 90 56 96 60 100 C64 96 70 90 68 80Z" fill="#FF922B"/><path d="M56 82 C56 88 58 91 60 94 C62 91 64 88 64 82Z" fill="#FFD43B"/>` +
    `<path ${ol()} d="M46 64 L34 76 L36 86 L48 78Z M74 64 L86 76 L84 86 L72 78Z" fill="${dk}"/>` +
    `<path ${ol()} d="M60 18 C74 28 78 46 74 82 H46 C42 46 46 28 60 18Z" fill="#F8F9FA"/><path d="M60 18 C68 24 72 30 74 38 H46 C48 30 52 24 60 18Z" fill="${c}"/><path ${ol()} d="M60 18 C74 28 78 46 74 82 H46 C42 46 46 28 60 18Z M46 38 H74" fill="none"/>` +
    `<circle ${ol()} cx="60" cy="54" r="8" fill="#74C0FC"/>${shine(57.5, 51.5, 2.4, 1.5)}<path ${ol()} d="M60 64 V82" fill="none"/>` +
    `<path d="M51 44 V74" stroke="#fff" stroke-width="2.4" opacity=".9" stroke-linecap="round"/>`,
  brain: ({ c, dk, lt }) =>
    `<path ${ol()} d="M60 28 C52 22 40 26 40 34 C30 34 26 44 30 50 C24 56 28 68 36 68 C36 76 46 80 52 76 C55 80 60 80 60 80 C60 80 65 80 68 76 C74 80 84 76 84 68 C92 68 96 56 90 50 C94 44 90 34 80 34 C80 26 68 22 60 28Z" fill="${c}"/>` +
    `<path d="M60 30 V78 M46 38 C50 42 48 48 44 50 M38 56 C44 56 48 60 46 66 M74 38 C70 42 72 48 76 50 M82 56 C76 56 72 60 74 66" fill="none" stroke="${dk}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M40 34 C40 30 44 28 48 28" stroke="${lt}" stroke-width="3" fill="none" stroke-linecap="round"/>` + face(60, 56, .8).replace(/<circle cx="-?9"[^>]*>/g, ''),
  eye: ({ c, dk }) =>
    `<path ${ol()} d="M24 58 C36 38 84 38 96 58 C84 78 36 78 24 58Z" fill="#fff"/>` +
    `<circle ${ol()} cx="60" cy="58" r="15" fill="${c}"/><circle cx="60" cy="58" r="10" fill="none" stroke="${dk}" stroke-width="2"/><circle cx="60" cy="58" r="6.5" fill="${D}"/>` + shine(55, 53, 3.4, 2.2) + `<circle cx="66" cy="63" r="1.6" fill="#fff"/>` +
    `<path d="M34 42 L30 36 M47 36 L45 29 M60 34 V27 M73 36 L75 29 M86 42 L90 36" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`,
  clover: ({ c, dk, lt }) => {
    const leaf = (deg: number) => `<g transform="rotate(${deg} 60 54)">${heart(60, 40, 11, c, 2.6).replace('<path', `<path transform="rotate(180 60 40)"`)}<path d="M60 54 L60 34" stroke="${dk}" stroke-width="1.8" stroke-linecap="round"/></g>`
    return stick('M60 58 C62 72 68 82 76 90', dk, 3.4) + leaf(0) + leaf(90) + leaf(180) + leaf(270) +
      `<circle ${ol(2)} cx="60" cy="54" r="4" fill="${lt}"/>` + shine(52, 32, 3.2, 2)
  },
  gem: ({ c, dk, lt, xl }) =>
    `<path d="M40 34 H80 L94 50 L60 90 L26 50Z" fill="${c}"/><path d="M26 50 H94 L80 34 H40Z" fill="${lt}"/><path d="M48 50 L60 34 L72 50Z" fill="${xl}"/>` +
    `<path d="M60 90 L72 50 H94Z" fill="${dk}"/><path d="M60 90 L48 50 H26Z" fill="${c}"/>` +
    `<path ${ol(2)} d="M26 50 H94 M40 34 L48 50 L60 90 L72 50 L80 34 M48 50 L60 34 L72 50" fill="none"/><path ${ol()} d="M40 34 H80 L94 50 L60 90 L26 50Z" fill="none"/>` +
    `<path d="M36 52 L50 70" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>` + sparkle(88, 30, 5, '#fff'),
  sword: ({ c, dk }) =>
    `<g transform="rotate(40 60 58)"><path ${ol()} d="M54 64 V26 L60 16 L66 26 V64Z" fill="#E9ECEF"/><path d="M60 20 V62" stroke="#ADB5BD" stroke-width="2"/><path d="M56 28 V58" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` +
    `<rect ${ol()} x="42" y="63" width="36" height="8" rx="4" fill="${c}"/><rect ${ol()} x="55.5" y="70" width="9" height="17" rx="2" fill="${dk}"/><path d="M56 75 H64 M56 80 H64" stroke="${D}" stroke-width="1.4"/>` +
    `<circle ${ol()} cx="60" cy="91" r="5" fill="${c}"/><circle cx="60" cy="67" r="2.2" fill="#fff"/></g>` + sparkle(36, 34, 5, '#FFD43B'),
  house: ({ c, dk }) =>
    `<rect ${ol()} x="72" y="30" width="8" height="16" fill="#ADB5BD"/><path d="M76 26 C73 22 79 20 76 16" stroke="#ADB5BD" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<path ${ol()} d="M36 56 V88 H84 V56" fill="#FFF3D6"/><path ${ol()} d="M28 60 L60 30 L92 60 L86 66 L60 42 L34 66Z" fill="${c}"/><path d="M60 36 L36 58" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>` +
    `<path ${ol()} d="M54 88 V70 C54 64 66 64 66 70 V88Z" fill="${dk}"/><circle cx="63" cy="78" r="1.4" fill="#FFD43B"/>` +
    `<rect ${ol(2)} x="40" y="64" width="10" height="10" rx="1.5" fill="#74C0FC"/><rect ${ol(2)} x="70" y="64" width="10" height="10" rx="1.5" fill="#74C0FC"/><path d="M45 64 V74 M40 69 H50 M75 64 V74 M70 69 H80" stroke="${D}" stroke-width="1.4"/>` +
    heart(60, 54, 3, '#FF6B6B', 1.4),
  road: ({ c, dk }) =>
    `<path ${ol()} d="M14 70 Q36 52 60 58 Q86 64 106 46 V104 H14Z" fill="${c}"/><path ${ol()} d="M14 84 Q40 72 66 80 Q90 86 106 74 V104 H14Z" fill="${dk}"/>` +
    `<path d="M40 104 C46 86 70 82 64 66 C60 56 50 54 58 44" fill="none" stroke="${D}" stroke-width="15" stroke-linecap="round"/><path d="M40 104 C46 86 70 82 64 66 C60 56 50 54 58 44" fill="none" stroke="#868E96" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M40 104 C46 86 70 82 64 66 C60 56 50 54 58 44" fill="none" stroke="#fff" stroke-width="1.8" stroke-dasharray="4 4"/>` +
    `<path ${ol(2)} d="M64 42 V22" fill="none"/><path ${ol(2)} d="M64 22 L80 27 L64 32Z" fill="#E03131"/><circle cx="64" cy="42" r="2" fill="${D}"/>`,
}

/** Achica un poco los dibujos que llegan a los bordes del hexágono. */
const FIT: Partial<Record<Glyph, number>> = { crown: .86, trophy: .9, flame: .92, cards: .88, meeple: .86, bolt: .86, eye: .94, coin: .94, rocket: .94, star: .95 }

/** Dibujo genérico para una medalla sin ilustración propia. */
export function glyphArt(glyph: Glyph, color: string, name: string): string {
  const p: Pal = { c: color, dk: mix(color, '#000', .28), lt: mix(color, '#fff', .45), xl: mix(color, '#fff', .82) }
  const h = hash(name)
  // Brillitos de fondo: un par de posiciones elegidas por el nombre, para que niveles distintos no se vean idénticos.
  const spots: [number, number][] = [[34, 34], [86, 34], [29, 50], [91, 52], [31, 74], [89, 76], [44, 26], [76, 26]]
  const bg = [0, 1, 2].map((i) => {
    const [x, y] = spots[(h >>> (i * 3)) % spots.length]
    return i === 2 ? `<circle cx="${x}" cy="${y}" r="2" fill="${p.lt}"/>` : sparkle(x, y, 3.5 + i, i ? '#fff' : '#FFD43B')
  }).join('')
  const k = FIT[glyph] ?? 1, art = (DRAW[glyph] ?? DRAW.star)(p)
  return `<circle cx="60" cy="58" r="36" fill="${p.xl}" opacity=".55"/>` + bg + (k === 1 ? art : `<g transform="translate(60 60) scale(${k}) translate(-60 -60)">${art}</g>`)
}
