// Digimon Card Game. Nada de la marca ni de sus criaturas: un huevo con manchas, un aparatito genérico con un
// dinosaurio de píxeles, un emblema propio y un dinosaurio naranja cualquiera que evoluciona a máquina y a armadura.
// Lo que distingue al juego: la noche del mundo digital (grilla en perspectiva y píxeles sueltos) y el naranja de la ficha.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

/** Naranja del juego (el `color` de la ficha), con su luz y su sombra. */
const OR = '#E67700', OR_L = '#F6A94E', OR_D = '#9E4A08'
/** Verde de la pantallita de cristal líquido. */
const LCD = '#BFCB98', LCD_D = '#4E5A35'

/** Fondo del mundo digital: noche con píxeles sueltos, resplandor naranja y, si hay `floor`, el piso de grilla. */
function digital(k: Kit, o: { floor?: number; glow?: [number, number, number] } = {}) {
  const [gx, gy, gr] = o.glow ?? [60, 56, 30]
  const hz = o.floor
  const px = [[28, 34, 1.4, P.sky], [90, 30, 1.2, OR_L], [34, 56, 1, P.sky], [94, 58, 1.4, P.sky], [84, 22, 0.9, P.sky], [24, 48, 0.9, OR_L], [70, 20, 1, P.sky]] as const
  const grid = hz === undefined ? '' :
    `<path d="M0 ${hz}H120V130H0Z" fill="${P.night}" opacity=".55"/>` +
    `<path d="${Array.from({ length: 17 }, (_, i) => `M${f(60 + (i - 8) * 4.2)} ${hz}L${f(60 + (i - 8) * 15)} 112`).join('')}${[1.6, 4, 7.6, 12.6, 19.4, 28].map((d) => `M0 ${f(hz + d)}H120`).join('')}" stroke="${P.sky}" stroke-width=".35" opacity=".4"/>` +
    `<path d="M0 ${hz}H120" stroke="${OR_L}" stroke-width=".6" opacity=".8"/>`
  return (
    k.night() +
    `<path d="${Array.from({ length: 21 }, (_, i) => `M${i * 6} 0V130`).join('')}${Array.from({ length: 22 }, (_, i) => `M0 ${i * 6}H120`).join('')}" stroke="${P.mid}" stroke-width=".25" opacity=".5"/>` +
    k.shade(ellipse(gx, gy, gr, gr), k.rad(OR, 0.5, 0.5, 0.5, 0.6, 0), OR, 0.35) +
    grid +
    px.map(([x, y, s, c]) => `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${s}" height="${s}" fill="${c}" opacity=".85"/>`).join('')
  )
}

/** Cabeza de tiranosaurio naranja de perfil hacia la izquierda (hocico en x≈27, nuca en x≈87), con la línea de la
 * boca que baja hacia atrás como en un cráneo de verdad. La mandíbula gira desde la bisagra (80,61). */
const DINO_HEAD = {
  neck: 'M70 58C78 60 86 66 92 78L98 108H62C62 96 60 86 56 76Z',
  throat: 'M56 76C60 84 62 94 62 108H69C69 94 66 84 62 72Z',
  skull: 'M26.4 52.6C26 49.6 28 47 31 46C34 45 38 44.2 44 43C50 41.8 54 40 58 38.4C62 36.8 68 35.4 74 36C80 36.6 85 40 86.6 46C88 52 86 57.6 81.6 60.6C77 62.6 72 61.6 68 60.8C60 59.6 50 58.4 40 57C33.4 56 28 55.6 26.4 52.6Z',
  jaw: 'M28.4 55.6C34 57 44 58.4 56 59.8C64 60.6 72 61.6 80 61C78 65.6 72 68 64 68C54 68 42 65.4 33.6 61.6C30.4 60 28.6 58 28.4 55.6Z',
  chin: 'M31 59.4C38 63 48 65.6 60 66.4C68 66.8 74 65.4 78.6 63V70H31Z',
  brow: 'M57.6 41.6C61.6 39.8 67.6 39.6 72.4 41.4L71.4 43.4C67 42.2 62.6 42.4 58.8 43.8Z',
}

/** Arrugas y escamas de la cabeza: trazos finos del color de sombra. */
const dinoTexture = (c: string) =>
  hair(31, 50, 36, 48.6, 42, 48.4, 0.45, c) + hair(36, 53.4, 44, 53, 52, 54.6, 0.45, c) + hair(58, 49, 66, 50, 74, 54, 0.5, c) +
  hair(74, 47, 78, 50, 80, 56, 0.5, c) + hair(46, 47, 52, 46, 56, 47.4, 0.4, c) + hair(62, 53.6, 68, 55, 72, 58.4, 0.4, c) +
  [[40, 50.6], [47, 50.4], [53, 51.6], [44, 54.6], [70, 50.6], [76, 53]].map(([x, y]) => `<path d="M${x} ${y}q1 1 2 0" fill="none" stroke="${c}" stroke-width=".4"/>`).join('')

/** Dientes en sierra a lo largo de una recta (de x0 a x1 a la altura y, con pendiente `dy` por unidad). */
const teeth = (x0: number, x1: number, y: number, dy: number, n: number, h: number, up = false) =>
  Array.from({ length: n }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n, w = (x1 - x0) / n, yy = y + (x - x0) * dy, hh = h * (0.65 + 0.55 * Math.sin((Math.PI * (i + 0.8)) / (n + 0.6))) * (i % 2 ? 0.8 : 1)
    return `M${f(x + w * 0.08)} ${f(yy)}L${f(x + w * 0.42)} ${f(yy + (up ? -hh : hh))}L${f(x + w * 0.92)} ${f(yy + w * dy)}Z`
  }).join('')

/** Pixel art de un dinosaurio chiquito para la pantalla del aparatito. */
const DINO = ['.....####.', '....##.###', '....######', '....####..', '#..#####..', '########..', '.#######..', '..##..##..']

export const TCG_DIGIMON_NUEVAS_ART: Record<string, (u: number) => string> = {
  // Tres partidas: el huevo ya se mueve. Manchado, con una rajadura que deja salir luz, tambaleándose sobre la grilla.
  'Digihuevo': (u) => {
    const k = kit(u)
    const egg = 'M60 31C69.6 31 77.4 45 77.4 57.6C77.4 69.4 69.6 78 60 78C50.4 78 42.6 69.4 42.6 57.6C42.6 45 50.4 31 60 31Z'
    const band = 'M38 51.6L43.6 56L49.2 51.6L54.8 56L60.4 51.6L66 56L71.6 51.6L77.2 56L82 52V61.6L77.2 65.6L71.6 61.2L66 65.6L60.4 61.2L54.8 65.6L49.2 61.2L43.6 65.6L38 61.2Z'
    const spot = (x: number, y: number, r: number, c: string) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f(r * 0.86)}" fill="${c}" stroke="${OR_D}" stroke-width=".4"/>`
    const crack = 'M55.4 36.4L58 40L56.6 42.6L60.4 45.4L59.6 48.4L63 50.6'
    return (
      digital(k, { floor: 76, glow: [60, 54, 32] }) +
      k.floor(60, 79, 18, 3, '#0E1533') +
      `<path d="M32 50C30 56 30.6 62 33.6 67M88 50C90 56 89.4 62 86.4 67" fill="none" stroke="${OR_L}" stroke-width=".7" stroke-linecap="round" opacity=".8"/>` +
      hair(28, 46, 25.6, 56, 28.4, 66, 0.8, OR_L, 0.7) + hair(92, 46, 94.4, 56, 91.6, 66, 0.8, OR_L, 0.7) +
      `<g transform="rotate(-9 60 78)">` +
      k.draw([{
        d: egg, fill: P.white,
        inner:
          `<path d="${band}" fill="${OR}"/><path d="${band}" fill="none" stroke="${OR_D}" stroke-width=".6"/>` +
          spot(52, 42, 3, OR) + spot(66.4, 44.4, 2.4, OR) + spot(61, 37, 1.6, OR_L) + spot(70.4, 37.6, 1.3, OR) + spot(47.6, 48, 1.4, OR_L) +
          spot(50, 70, 2.2, OR) + spot(66, 71.4, 2.8, OR) + spot(58.4, 74.4, 1.4, OR_L) + spot(72.6, 66, 1.2, OR_L) +
          k.sh(egg, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) +
          `<ellipse cx="52.4" cy="42" rx="3.4" ry="6.4" fill="#fff" opacity=".7" transform="rotate(24 52.4 42)"/>` +
          hair(46, 64, 48.4, 70, 53, 74.4, 0.5, P.blue, 0.8) + hair(73.6, 48, 75, 56, 73.4, 66, 0.6, P.mid, 0.8),
      }], 0.85) +
      `<path d="${crack}" fill="none" stroke="${OR_L}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="${crack}" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M58 40L60.6 39M60.4 45.4L63.2 44.4" fill="none" stroke="${P.ink}" stroke-width=".5" stroke-linecap="round"/>` +
      hair(57, 39, 54, 33, 56, 26, 0.7, OR_L) + hair(60.6, 46, 64, 40, 68, 36, 0.6, OR_L) +
      `</g>` +
      `<rect x="38.4" y="27.6" width="2.2" height="2.2" fill="${OR_L}"/><rect x="77" y="31" width="1.6" height="1.6" fill="${P.sky}"/><rect x="83" y="40" width="2.2" height="2.2" fill="${OR}"/><rect x="34" y="40" width="1.4" height="1.4" fill="${P.sky}"/>` +
      sparkle(61, 23, 2.4, OR_L) +
      k.defs()
    )
  },

  // Quince victorias: el aparatito pita y tu compañero evoluciona. Pantalla de cristal líquido, flechita para arriba y ¡bip!
  'Digivice': (u) => {
    const k = kit(u)
    const body = 'M-12 -24H12C16.4 -24 19 -21.4 19 -17V-6C21.4 -4.6 21.4 2.6 19 4V15C19 20.6 15.4 25 9 25H-9C-15.4 25 -19 20.6 -19 15V4C-21.4 2.6 -21.4 -4.6 -19 -6V-17C-19 -21.4 -16.4 -24 -12 -24Z'
    const bezel = roundRect(-14, -19, 14, 6, 4)
    const screen = roundRect(-11, -16, 11, 3, 1.6)
    const strap = 'M-7.6 -26C-10 -34 -16 -40 -24 -44L-27.6 -39.4C-20.6 -36.4 -15.6 -31 -13.6 -25.4Z'
    const pix = DINO.flatMap((row, r) => [...row].map((c, i) => (c === '#' ? `M${f(-9.6 + i * 1.3)} ${f(-12.2 + r * 1.3)}h1.3v1.3h-1.3Z` : ''))).join('')
    const btn = (x: number, y: number, r: number) =>
      k.draw([{ d: ellipse(x, y, r, r), fill: OR, inner: k.sh(ellipse(x, y, r, r), 0, 0, 1, 1, 0, 0.9, OR_D, 0.5) }], 0.45) + `<circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.3)}" fill="#fff" opacity=".8"/>`
    const rid = k.id('bip')
    return (
      digital(k, { glow: [58, 58, 34] }) +
      `<g transform="translate(54 65) rotate(-12)">` +
      k.cast([body, strap], 2.4, 2.4, '#0E1533') +
      k.draw([{ d: strap, fill: OR, inner: k.sh(strap, 0, 0, 1, 0, 0.2, 0.9, OR_D, 0.5) + `<path d="M-9.6 -26.6C-12 -33 -17 -38 -24.6 -42" fill="none" stroke="${OR_D}" stroke-width=".4" stroke-dasharray="1 .8"/>` }], 0.6) +
      `<ellipse cx="-9.6" cy="-25.2" rx="3" ry="2" fill="none" stroke="${P.ink}" stroke-width="2"/><ellipse cx="-9.6" cy="-25.2" rx="3" ry="2" fill="none" stroke="${P.sky1}" stroke-width=".9"/>` +
      k.draw([{
        d: body, fill: P.white,
        inner:
          k.sh(body, 0, 0, 1, 1, 0, 0.9, P.blue, 0.45) + `<path d="M-22 -26H-12V26H-22Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.7, 0)}"/>` +
          `<path d="M-19 -6C-21.4 -4.6 -21.4 2.6 -19 4ZM19 -6C21.4 -4.6 21.4 2.6 19 4Z" fill="${P.sky2}"/>` +
          `<path d="M-19 -1H-21M-19 1H-21M19 -1H21M19 1H21" stroke="${P.blue}" stroke-width=".4"/>` +
          hair(-16, 18, -12, 22.6, -6, 23.4, 0.5, P.blue) + hair(16.6, -16, 17.4, -6, 16.6, 4, 0.5, P.mid, 0.8),
      }], 0.85) +
      k.draw([{ d: bezel, fill: OR, inner: k.sh(bezel, 0, 0, 1, 1, 0, 0.9, OR_D, 0.5) + hair(-12.4, -2, -13, -10, -11, -17.4, 0.5, OR_L) }], 0.5) +
      `<path d="${screen}" fill="${LCD}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.clip(screen, k.sh(screen, 0, 0, 1, 1, 0.1, 0.7, LCD_D, 0.35) + `<path d="M-11 -10H11M-11 -4H11M-5 -16V3M3 -16V3" stroke="${LCD_D}" stroke-width=".15" opacity=".5"/>`) +
      `<path d="${pix}" fill="${LCD_D}"/>` +
      `<path d="M6.4 -6.6V-13.2M3.8 -10.6L6.4 -13.4L9 -10.6" fill="none" stroke="${LCD_D}" stroke-width="1.2" stroke-linejoin="miter"/>` +
      `<path d="M-9.6 0H-6.6M-5.6 0H-2.6M-1.6 0H1.4" stroke="${LCD_D}" stroke-width="1"/>` +
      `<path d="M-9 -15C-4 -15.6 2 -15.6 7 -15" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>` +
      btn(-6.4, 14, 3) + btn(6.4, 14, 3) +
      `<path d="M-2 10.6H2M-2 13H2M-2 15.4H2" stroke="${P.mid}" stroke-width=".7" stroke-linecap="round"/>` +
      `</g>` +
      [7, 11.5, 16].map((r, i) => `<path d="M${f(71 + r * Math.cos(-0.75))} ${f(45 + r * Math.sin(-0.75))}A${r} ${r} 0 0 1 ${f(71 + r * Math.cos(0.3))} ${f(45 + r * Math.sin(0.3))}" fill="none" stroke="${OR_L}" stroke-width="${1.3 - i * 0.25}" stroke-linecap="round" opacity="${1 - i * 0.2}"/>`).join('') +
      `<path id="${rid}" d="M79 60Q86 58.6 93 54.6" fill="none"/>` +
      `<text font-family="Georgia, serif" font-style="italic" font-size="5.2" fill="${P.paper}"><textPath href="#${rid}" startOffset="50%" text-anchor="middle">¡bip!</textPath></text>` +
      sparkle(34, 36, 2, OR_L) + sparkle(86, 84, 1.6, P.paper) +
      k.defs()
    )
  },

  // Cuarenta partidas: el emblema brilla en tu pecho. El relicario de oro con su cadena y la llama naranja detrás del vidrio.
  'Emblema del Valor': (u) => {
    const k = kit(u)
    const frame = roundRect(-14, -18, 14, 18, 3.4)
    const glass = roundRect(-10, -13.6, 10, 13.6, 2)
    const crest = 'M0 -11C4.6 -9 8 -6 8 -1C8 5 4.4 9 0 11C-4.4 9 -8 5 -8 -1C-8 -6 -4.6 -9 0 -11Z'
    const fire = 'M0 8C-4.4 8 -6.4 4.6 -5.6 1C-5 -1.8 -3 -3.4 -2.6 -6.4C-1.2 -4.8 -.8 -3.4 -1 -1.8C.4 -4.6 1.4 -7.6 .8 -10.4C3.6 -8 6 -4 5.6 .6C5.4 5 3.6 8 0 8Z'
    const fireIn = 'M0 6.4C-2.4 6.4 -3.4 4.4 -2.8 2.4C-2.4 1 -1.4 .2 -1.2 -1.4C0 -.4 .4 .6 .2 1.8C1.2 .4 1.8 -1.4 1.6 -3C3 -1.4 3.8 .8 3.4 3C3 5.2 1.8 6.4 0 6.4Z'
    const chain = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) => {
      const N = 13
      return Array.from({ length: N }, (_, i) => {
        const t = (i + 0.5) / N, a = 1 - t, x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1
        const dx = 2 * a * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * a * (cy - y0) + 2 * t * (y1 - cy), ang = (Math.atan2(dy, dx) * 180) / Math.PI
        return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang + (i % 2 ? 0 : 0))})">` +
          (i % 2 ? `<path d="M-1.7 0H1.7" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M-1.7 0H1.7" stroke="${P.gold}" stroke-width=".8" stroke-linecap="round"/>`
            : `<ellipse cx="0" cy="0" rx="1.9" ry="1.2" fill="none" stroke="${P.ink}" stroke-width="1.4"/><ellipse cx="0" cy="0" rx="1.9" ry="1.2" fill="none" stroke="${P.gold}" stroke-width=".6"/>`) + `</g>`
      }).join('')
    }
    const beads = Array.from({ length: 22 }, (_, i) => {
      const t = i / 22, per = 2 * (24 + 32), d = t * per
      const [x, y] = d < 24 ? [-12 + d, -16] : d < 56 ? [12, -16 + (d - 24)] : d < 80 ? [12 - (d - 56), 16] : [-12, 16 - (d - 80)]
      return `<circle cx="${f(x)}" cy="${f(y)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".18"/>`
    }).join('')
    return (
      digital(k, { glow: [60, 62, 34] }) +
      k.sun(60, 62, 18, 46, 32, false) +
      k.shade(ellipse(60, 62, 26, 26), k.rad(OR_L, 0.5, 0.5, 0.5, 0.8, 0), OR_L, 0.4) +
      laurel(48, 99, 28, 92, 25, 64, 7) + laurel(72, 99, 92, 92, 95, 64, 7, true) +
      chain(60, 37, 52, 30, 42, 22) + chain(60, 37, 68, 30, 78, 22) +
      `<g transform="translate(60 64) rotate(-4)">` +
      k.cast([frame], 2.4, 2.6, '#0E1533') +
      // Argolla de arriba.
      `<ellipse cx="0" cy="-21.6" rx="2.6" ry="3.4" fill="none" stroke="${P.ink}" stroke-width="2.4"/><ellipse cx="0" cy="-21.6" rx="2.6" ry="3.4" fill="none" stroke="${P.gold}" stroke-width="1.1"/>` +
      k.draw([{ d: 'M-3.4 -19.6H3.4L2.6 -17.6H-2.6Z', fill: P.gold }], 0.4) +
      k.draw([{
        d: frame, fill: P.gold,
        inner: k.sh(frame, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-15 -19H-9V19H-15Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` +
          `<path d="${roundRect(-12.4, -16.4, 12.4, 16.4, 2.6)}" fill="none" stroke="${P.goldD}" stroke-width=".5"/>`,
      }], 0.85) +
      beads +
      [[-12, -16], [12, -16], [-12, 16], [12, 16]].map(([x, y]) => `<path d="${starPath(x, y, 2.2, 0.8, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".35"/>`).join('') +
      `<path d="${glass}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      k.clip(glass,
        k.shade(glass, k.rad(OR, 0.5, 0.5, 0.6, 0.95, 0), OR, 0.5) +
        Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M0 0L${f(Math.cos(a) * 16)} ${f(Math.sin(a) * 16)}" stroke="${OR_L}" stroke-width=".5" opacity=".6"/>` }).join('') +
        k.draw([{ d: crest, fill: OR, inner: k.sh(crest, 0, 0, 1, 1, 0, 0.9, OR_D, 0.5) + `<path d="M0 -9.6C3.8 -8 6.6 -5.4 6.6 -1.2C6.6 4 3.6 7.6 0 9.4" fill="none" stroke="${OR_L}" stroke-width=".6"/>` }], 0.5) +
        `<path d="${fire}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".45"/><path d="${fireIn}" fill="${P.white}"/>` +
        `<path d="M-9 -12L-3 -12L-10 4L-10 -6Z" fill="#fff" opacity=".28"/><path d="M4 13.6L10 -2V4L7 13.6Z" fill="#fff" opacity=".18"/>`) +
      `</g>` +
      sparkle(60, 40.6, 2.6, '#fff') + sparkle(81.4, 52, 2.2, OR_L) + sparkle(37, 74, 1.8, OR_L) + sparkle(77, 86, 1.4, '#fff') +
      k.defs()
    )
  },

  // Tres Megas: el dinosaurio naranja con casco ya te hace caso. Casco de hueso con dos cuernos, abrochado con su barbijo.
  'Greymon': (u) => {
    const k = kit(u)
    const h = DINO_HEAD
    const helmet = 'M50 41.4C52.4 34.6 60 30.6 69.4 30C79 29.6 86.4 33.6 88.6 40.6C89.6 44.4 89 48.4 86.8 51.4C85 46.4 81 43 75.4 41.6C67.4 40 58.4 40.4 50 41.4Z'
    const hornA = 'M55.4 35.4C53.6 30.6 51 26.6 46.6 23.4C52.6 23.8 58 26.6 61.6 31.6Z'
    const hornB = 'M66.4 30.8C65.6 26 66.4 21.6 68.6 18C70.8 22.4 72.4 26.6 72.8 30.6Z'
    const strap = 'M86.4 50C85 55.6 82 60.6 77.6 64.6L75.2 62.6C79.2 59 81.8 54.4 82.8 49.4Z'
    return (
      digital(k, { floor: 90, glow: [58, 56, 32] }) +
      `<g transform="translate(2 5)">` +
      k.cast([h.neck, h.skull], 2.4, 2.2, '#0E1533') +
      k.draw([{ d: h.neck, fill: OR, inner: k.sh(h.neck, 0, 0, 1, 0, 0, 0.95, OR_D, 0.5) + `<path d="${h.throat}" fill="${P.goldL}"/>` + k.sh(h.throat, 0, 0, 1, 0, 0.2, 0.9, P.goldD, 0.45) + Array.from({ length: 5 }, (_, i) => hair(56.6 + i * 1.6, 80 + i * 5.4, 60 + i * 1.8, 81.4 + i * 5.4, 64 + i * 1.6, 80 + i * 5.4, 0.5, P.goldD)).join('') + hair(80, 70, 86, 82, 88, 98, 0.6, OR_D) + hair(72, 66, 76, 78, 76, 92, 0.5, OR_D) }], 0.8) +
      k.draw([{ d: h.jaw, fill: OR, inner: k.sh(h.jaw, 0, 0, 0, 1, 0.1, 0.95, OR_D, 0.5) + `<path d="${h.chin}" fill="${P.goldL}" opacity=".8"/>` + hair(36, 62, 48, 65.4, 62, 66.4, 0.45, OR_D) }], 0.8) +
            k.draw([{
        d: h.skull, fill: OR,
        inner: k.sh(h.skull, 0, 0, 0, 1, 0.05, 0.95, OR_D, 0.5) + `<path d="M24 36H88V46C70 42 44 44 24 50Z" fill="${k.lin(OR_L, 0, 0, 0, 1, 0.8, 0)}"/>` + dinoTexture(OR_D),
      }], 0.8) +
      `<path d="${teeth(29, 66, 54.4, 0.162, 9, 2.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M26.6 53C33 55.6 44 57.4 56 59C62 59.8 66 60.4 70 60.8" fill="none" stroke="${P.ink}" stroke-width=".7" stroke-linecap="round"/>` +
      `<path d="M30 47.4C31 46.6 32.4 46.6 33 47.4" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="${h.brow}" fill="${OR_D}"/>` +
      `<path d="M62.4 45.2C63.8 43.6 67 43.2 68.8 44.6C67.2 46.4 64 46.6 62.4 45.2Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".6" stroke-linejoin="round"/><path d="M65.6 43.8C65.2 44.6 65.2 45.6 65.6 46.2" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linecap="round"/><circle cx="64.6" cy="44.7" r=".3" fill="#fff"/>` +
      hair(60, 47.4, 64, 48.4, 69, 47.4, 0.4, OR_D) +
      k.draw([
        { d: hornA, fill: P.white, inner: k.sh(hornA, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M52 27.4L56.6 25.8M54.6 31L59 29.4" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: hornB, fill: P.white, inner: k.sh(hornB, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M67 26.4H72M66.4 22.6H70.8" stroke="${P.goldD}" stroke-width=".4"/>` },
        {
          d: helmet, fill: P.paper,
          inner: k.sh(helmet, 0, 0, 1, 1, 0, 0.95, P.brown, 0.5) + `<path d="M50.6 41.2C58 39.6 68 39.2 76 40.8C82 42.2 86.4 46 87.6 50.4" fill="none" stroke="${P.brownD}" stroke-width=".6"/>` +
            hair(56, 37, 62, 33.4, 70, 32.6, 0.5, P.brown) + hair(62, 39.4, 70, 36.6, 80, 37.2, 0.45, P.brown) + hair(81, 35.4, 85, 38, 87.4, 43, 0.45, P.brownD) +
            [[54.6, 39.6], [66, 37.6], [77.6, 39.6], [84.6, 44.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.brown}" stroke="${P.ink}" stroke-width=".3"/>`).join(''),
        },
      ], 0.8) +
      k.draw([{ d: strap, fill: P.brownD, inner: `<path d="M85.4 50.4L76.4 63.6" stroke="${P.brown}" stroke-width=".5" stroke-dasharray="1 .7"/>` }], 0.5) +
      `<g transform="rotate(-48 81 57)"><rect x="79.2" y="55.4" width="3.6" height="3.2" rx=".5" fill="none" stroke="${P.ink}" stroke-width="1.6"/><rect x="79.2" y="55.4" width="3.6" height="3.2" rx=".5" fill="none" stroke="${P.gold}" stroke-width=".7"/></g>` +
      `</g>` +
      sparkle(34, 32, 2, OR_L) + sparkle(28, 80, 1.4, P.paper) + sparkle(92, 34, 1.4, P.paper) +
      k.defs()
    )
  },

  // Quince Megas: mitad dinosaurio, mitad máquina. La misma cabeza rugiendo, con el cráneo blindado y el ojo de lente.
  'MetalGreymon': (u) => {
    const k = kit(u)
    const h = DINO_HEAD
    const metal = 'M47 24H96V70H74C69 62 62 52 48 42Z'
    const seam = 'M48.4 42C58 49 66 56 72 63'
    const helm = 'M50 41.4C52.4 34.6 60 30.6 69.4 30C79 29.6 86.4 33.6 88.6 40.6C89.6 44.4 89 48.4 86.8 51.4C85 46.4 81 43 75.4 41.6C67.4 40 58.4 40.4 50 41.4Z'
    const horn = 'M62 31.6C60.4 25.6 61.6 20.4 65 16.6C66.4 21.6 68.6 26 71.6 30.2Z'
    const hose = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: number) => {
      const dd = taper(x0, y0, cx, cy, x1, y1, w, w)
      const rings = Array.from({ length: 8 }, (_, i) => { const t = (i + 0.5) / 8, a = 1 - t; return `<circle cx="${f(a * a * x0 + 2 * a * t * cx + t * t * x1)}" cy="${f(a * a * y0 + 2 * a * t * cy + t * t * y1)}" r="${f(w * 0.36)}" fill="none" stroke="${P.night}" stroke-width=".4"/>` }).join('')
      return k.draw([{ d: dd, fill: P.sky2, inner: k.sh(dd, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) }], 0.5) + rings
    }
    const rivets = (pts: number[][]) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".75" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>`).join('')
    const jawT = 'rotate(-15 80 61)'
    return (
      digital(k, { floor: 90, glow: [56, 58, 32] }) +
      `<g transform="translate(2 4)">` +
      k.cast([h.neck, h.skull], 2.4, 2.2, '#0E1533') +
      k.draw([{
        d: h.neck, fill: OR,
        inner: k.sh(h.neck, 0, 0, 1, 0, 0, 0.95, OR_D, 0.5) + `<path d="${h.throat}" fill="${P.goldL}"/>` +
          `<path d="M72 60C82 62 88 70 92 82L97 108H80C80 94 78 80 68 68Z" fill="${P.sky}"/>` + k.sh('M66 58H100V108H66Z', 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) +
          [0, 1, 2, 3, 4].map((i) => `<path d="M${70 + i * 3.6} ${64 + i * 8.6}C${77 + i * 3.4} ${64.6 + i * 8.6} ${85 + i * 2.4} ${68 + i * 9} ${92 + i * 1.6} ${74 + i * 9}" fill="none" stroke="${P.ink}" stroke-width=".55"/>`).join(''),
      }], 0.8) +
      hose(86, 52, 92, 66, 88, 88, 2.6) + hose(80, 60, 84, 74, 78, 96, 2.2) +
      `<path d="M27 54C40 58 60 60.6 80 61L29.6 70.6C27.6 64 26.6 58 27 54Z" fill="${P.wine}"/>` + k.clip('M27 54C40 58 60 60.6 80 61L29.6 70.6C27.6 64 26.6 58 27 54Z', k.sh('M20 50H82V80H20Z', 1, 0, 0, 0, 0, 0.8, '#3A0F1A', 0.5)) +
      `<g transform="${jawT}">` + k.draw([{ d: h.jaw, fill: OR, inner: k.sh(h.jaw, 0, 0, 0, 1, 0.1, 0.95, OR_D, 0.5) + `<path d="${h.chin}" fill="${P.goldL}" opacity=".8"/>` }], 0.8) +
      `<path d="${teeth(30, 66, 56.6, 0.09, 9, 2.4, true)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` + `</g>` +
      k.draw([{
        d: h.skull, fill: OR,
        inner: k.sh(h.skull, 0, 0, 0, 1, 0.05, 0.95, OR_D, 0.5) + `<path d="M24 36H88V46C70 42 44 44 24 50Z" fill="${k.lin(OR_L, 0, 0, 0, 1, 0.8, 0)}"/>` + dinoTexture(OR_D) +
          `<path d="${metal}" fill="${P.sky}"/>` + k.sh(metal, 0, 0, 1, 1, 0, 0.9, P.mid, 0.5) + `<path d="M47 24H96V40C80 36 62 37 50 43Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.75, 0)}"/>` +
          `<path d="M64 40V54M76 37V62.6M84 40H88" stroke="${P.mid}" stroke-width=".5"/>` + hair(70, 52, 76, 56, 80, 60, 0.5, P.night, 0.7) + hair(72, 40, 78, 39.4, 84, 42, 0.6, '#fff', 0.9),
      }], 0.8) +
      `<path d="${seam}" fill="none" stroke="${P.ink}" stroke-width="1"/>` + rivets([[50.6, 43.6], [54.4, 46.4], [58.2, 49.4], [61.8, 52.6], [65.2, 55.8], [68.6, 59.2]]) +
      `<path d="${teeth(29, 48, 54.4, 0.162, 5, 2.6)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="${teeth(48, 66, 57.5, 0.162, 5, 2.4)}" fill="${P.sky1}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M30 47.4C31 46.6 32.4 46.6 33 47.4" fill="none" stroke="${P.ink}" stroke-width=".9" stroke-linecap="round"/>` +
      // Ojo de lente: aro, iris rojo y brillo.
      k.shade(ellipse(66, 45.6, 7, 7), k.rad(P.red, 0.5, 0.5, 0.5, 0.7, 0), P.red, 0.3) +
      `<circle cx="66" cy="45.6" r="3.8" fill="${P.mid}" stroke="${P.ink}" stroke-width=".6"/><circle cx="66" cy="45.6" r="2.6" fill="${P.red}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<circle cx="66" cy="45.6" r="1.1" fill="${P.wine}"/><circle cx="65.1" cy="44.7" r=".65" fill="#fff"/>` +
      k.draw([
        { d: horn, fill: P.sky1, inner: k.sh(horn, 0, 0, 1, 0, 0, 0.9, P.mid, 0.5) + hair(63, 29, 63, 23, 65, 18.6, 0.5, '#fff') },
        {
          d: helm, fill: P.sky2,
          inner: k.sh(helm, 0, 0, 1, 1, 0, 0.95, P.mid, 0.5) + `<path d="M48 30H92V36C78 33 62 34 48 41Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.7, 0)}"/>` +
            `<path d="M50.6 41.2C58 39.6 68 39.2 76 40.8C82 42.2 86.4 46 87.6 50.4" fill="none" stroke="${P.mid}" stroke-width=".6"/><path d="M76 31V40.6" stroke="${P.mid}" stroke-width=".5"/>`,
        },
      ], 0.8) +
      rivets([[55, 38.6], [60, 35.4], [70, 33], [82, 36], [86.4, 42.6]]) +
      `</g>` +
      hair(26, 68, 21, 66, 18, 61, 0.6, OR_L) + hair(30, 76, 24, 77, 20, 74, 0.5, OR_L) + hair(36, 84, 31, 87, 26, 87, 0.45, OR_L) +
      sparkle(36, 30, 2.2, P.paper) + sparkle(92, 36, 1.6, OR_L) +
      k.defs()
    )
  },

  // Cuarenta Megas: armadura dorada y garras que parten la mesa. El guantelete baja con sus tres cuchillas y la mesa se raja.
  'WarGreymon': (u) => {
    const k = kit(u)
    const fore = 'M-11 -96H11L10 -10H-10Z'
    const cuff = 'M-11.8 -15H11.8L12.8 -7H-12.8Z'
    const hand = 'M-12.8 -7H12.8C13.8 -2 13.2 3 11.2 6.6H-11.2C-13.2 3 -13.8 -2 -12.8 -7Z'
    const claw = (x: number, sk: number, l: number) => `M${x - 2.6} 5.4L${x + 2.6} 5.4C${x + 2.8} ${f(14 + l * 0.3)} ${f(x + 1.6 + sk)} ${f(24 + l * 0.6)} ${f(x + sk * 2.4)} ${f(32 + l)}C${f(x - 1.4 + sk)} ${f(23 + l * 0.6)} ${x - 2.8} ${f(13 + l * 0.3)} ${x - 2.6} 5.4Z`
    const claws = [claw(-7.8, -1.4, 0), claw(0, 0, 2.6), claw(7.8, 1.4, 0)]
    const plates = [-54, -45, -36, -27, -18].map((y) => `<path d="M-10.6 ${y}Q0 ${y + 2.4} 10.6 ${y}" fill="none" stroke="${P.goldD}" stroke-width=".6"/><path d="M-10.6 ${y + 0.9}Q0 ${y + 3.3} 10.6 ${y + 0.9}" fill="none" stroke="${P.goldL}" stroke-width=".5"/>`).join('')
    const knuckle = (x: number) => `<ellipse cx="${x}" cy="4.4" rx="3.2" ry="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><path d="M${x - 1.8} 3.6A2 1.4 0 0 1 ${x + 0.6} 2.6" fill="none" stroke="${P.goldL}" stroke-width=".5"/>`
    const topL = 'M12 70.6L49.6 75L47 79.2L50 83L12 80.6Z'
    const topR = 'M59 75L108 70.6V80.6L59.4 83L62 79Z'
    const frontL = 'M12 80.6L50 83L48.6 90.6L12 88.6Z'
    const frontR = 'M59.4 83L108 80.6V88.6L60.4 90.8Z'
    const splinter = (x: number, y: number, r: number, s: number) => `<path d="M0 -.8L5.6 -.4L6.6 0L5.6 .5L0 .9Z" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="${P.brown}" stroke="${P.ink}" stroke-width="${f(0.4 / s)}"/>`
    return (
      k.night() +
      k.sun(54, 60, 16, 50, 32, false) +
      k.shade(ellipse(54, 64, 30, 30), k.rad(OR, 0.5, 0.5, 0.5, 0.7, 0), OR, 0.4) +
      // La mesa partida: dos tablones que se hunden hacia la rajadura.
      `<path d="M0 86H120V130H0Z" fill="#0E1533"/>` + k.shade('M0 84H120V104H0Z', k.lin('#0E1533', 0, 0, 0, 1, 0, 1), '#0E1533', 0.3) +
      k.draw([
        { d: frontL, fill: P.brownD, inner: k.sh(frontL, 0, 0, 1, 0, 0, 0.9, P.night, 0.4) + `<path d="M12 84.6L49.4 87" stroke="${P.brown}" stroke-width=".4"/>` },
        { d: frontR, fill: P.brownD, inner: k.sh(frontR, 0, 0, 0, 1, 0, 0.9, P.night, 0.45) + `<path d="M60 87L108 84.6" stroke="${P.brown}" stroke-width=".4"/>` },
        { d: topL, fill: P.brown, inner: k.sh(topL, 0, 0, 1, 0, 0, 0.8, P.brownD, 0.45) + hair(16, 74, 30, 75, 44, 77, 0.45, P.brownD) + hair(18, 78, 30, 79, 42, 80.6, 0.4, P.brownD) + `<ellipse cx="28" cy="76.6" rx="2" ry=".8" fill="none" stroke="${P.brownD}" stroke-width=".4" transform="rotate(7 28 76.6)"/>` },
        { d: topR, fill: P.brown, inner: k.sh(topR, 0, 0, 1, 0, 0, 0.9, P.brownD, 0.5) + hair(66, 77, 82, 75.4, 102, 73.4, 0.45, P.brownD) + hair(66, 80.6, 84, 79, 104, 77, 0.4, P.brownD) + `<ellipse cx="90" cy="76" rx="2.2" ry=".8" fill="none" stroke="${P.brownD}" stroke-width=".4" transform="rotate(-6 90 76)"/>` },
      ], 0.7) +
      `<path d="M49.6 75L54 78.4L59 75L62 79L59.4 83L56 92L50 83L47 79.2Z" fill="${P.night}"/>` +
      `<path d="M49.6 75L47 79.2L50 83L48.6 90.6M59 75L62 79L59.4 83L60.4 90.8" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linejoin="round"/>` +
      `<path d="M49.6 75L52.6 73.4L51.4 76.4ZM59 75L57.4 72.6L60.4 74.2ZM47 79.2L44.6 78L46.4 80.6ZM62 79L64.6 77.6L63 80.4Z" fill="${P.brown}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<path d="M32 76.4L45 78M66 78.2L80 76.8M36 73.6L46.6 74.8" stroke="${P.night}" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>` +
      splinter(42, 66, -150, 1.1) + splinter(66, 64, -30, 1.2) + splinter(36, 71, -170, 0.8) + splinter(74, 69, -10, 0.9) + splinter(56, 60, -96, 0.7) +
      `<path d="${starPath(55, 74, 9, 2.4, 10, -80)}" fill="${OR_L}" opacity=".85"/><path d="${starPath(55, 74, 5.4, 1.6, 8, -60)}" fill="#fff"/>` +
      // El guantelete, entrando desde arriba a la derecha.
      hair(100, 30, 92, 40, 82, 46, 0.8, OR_L, 0.7) + hair(102, 44, 94, 52, 86, 56, 0.6, OR_L, 0.6) + hair(84, 18, 78, 28, 72, 34, 0.6, OR_L, 0.6) +
      `<g transform="translate(74 41) rotate(30) scale(1.18)">` +
      k.cast([fore, hand, ...claws], 1.8, 1, '#0E1533') +
      k.draw(claws.map((d) => ({ d, fill: P.sky1, inner: k.sh(d, 0, 0, 1, 0, 0.1, 0.95, P.mid, 0.5) + `<path d="M-14 0H-1V44H-14Z" fill="#fff" opacity=".45"/>` })), 0.65) +
      claws.map((_, i) => hair(-7.8 + i * 7.8 - 0.7, 8, -7.8 + i * 7.8 - 0.9, 18, -7.8 + i * 7.8 + (i - 1) * 2.2, 29 + (i === 1 ? 2.4 : 0), 0.5, '#fff') + hair(-7.8 + i * 7.8 + 0.9, 8, -7.8 + i * 7.8 + 1.2, 17, -7.8 + i * 7.8 + (i - 1) * 2.6 + 0.6, 26 + (i === 1 ? 2.4 : 0), 0.45, P.mid)).join('') +
      [-7.8, 0, 7.8].map((x) => `<path d="M${x - 2.9} 6.4H${x + 2.9}" stroke="${P.ink}" stroke-width="2.4"/><path d="M${x - 2.7} 6.4H${x + 2.7}" stroke="${OR}" stroke-width="1.2"/>`).join('') +
      k.draw([
        {
          d: fore, fill: P.gold,
          inner: k.sh(fore, 0, 0, 1, 0, 0, 0.95, P.goldD, 0.5) + `<path d="M-11 -98H-4V-8H-11Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.8, 0)}"/>` + plates +
            `<path d="M0 -96V-20" stroke="${P.goldD}" stroke-width=".55"/><path d="M-.6 -96V-20" stroke="${P.goldL}" stroke-width=".4"/>` +
            [-1, 1].map((s) => `<path d="M${s * 2} -64C${s * 7} -62 ${s * 8.4} -58 ${s * 6} -55.4C${s * 4.4} -53.6 ${s * 2.2} -54.8 ${s * 3} -56.6" fill="none" stroke="${P.goldD}" stroke-width=".6" stroke-linecap="round"/>`).join(''),
        },
        { d: cuff, fill: OR, inner: k.sh(cuff, 0, 0, 1, 0, 0, 0.9, OR_D, 0.5) + `<path d="M-12 -12.4H12" stroke="${OR_L}" stroke-width=".6"/><path d="M-12 -9.4H12" stroke="${OR_D}" stroke-width=".4"/>` },
        { d: hand, fill: P.gold, inner: k.sh(hand, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M-12 -4.6Q0 -2 12 -4.6" fill="none" stroke="${P.goldL}" stroke-width=".6"/>` },
      ], 0.8) +
      Array.from({ length: 10 }, (_, i) => `<circle cx="${f(-10.4 + i * 2.31)}" cy="-15.6" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".18"/>`).join('') +
      knuckle(-7.8) + knuckle(7.8) + knuckle(0) +
      `<path d="${starPath(0, -1.6, 5.4, 2.6, 4)}" fill="${P.goldL}" stroke="${P.ink}" stroke-width=".4"/>` +
      `<circle cx="0" cy="-1.6" r="2.6" fill="${OR}" stroke="${P.ink}" stroke-width=".45"/><circle cx="0" cy="-1.6" r="1.2" fill="${OR_D}"/><circle cx="-.8" cy="-2.4" r=".6" fill="#fff"/>` +
      `</g>` +
      sparkle(30, 36, 2.2, OR_L) + sparkle(36, 54, 1.6, P.paper) + sparkle(90, 66, 1.4, P.paper) +
      k.defs()
    )
  },
}
