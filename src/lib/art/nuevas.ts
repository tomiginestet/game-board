// Ilustraciones redibujadas como pines de esmalte (ver docs/medallas-filosofia.md y las reglas en kit.ts).
import { f } from './helpers'
import { ellipse, ENAMEL as E, MEEPLE, pin, starPath, type Pin } from './kit'

/** Carta parada con la base en (0,0): marfil con el palo en esmalte y la letra en metal. */
const card = (p: Pin, x: number, y: number, rot: number, suit: 'h' | 's') =>
  `<g transform="translate(${x} ${y}) rotate(${rot})">` +
  p.cell('M-6.4 -18.6H6.4Q7.6 -18.6 7.6 -17.4V-1.2Q7.6 0 6.4 0H-6.4Q-7.6 0 -7.6 -1.2V-17.4Q-7.6 -18.6 -6.4 -18.6Z', E.white, 1) +
  p.cell(
    suit === 'h'
      ? 'M0 -4.2C-4.6 -7.4 -4.4 -11.6 -1.9 -11.6C-.9 -11.6 -.2 -11 0 -10.2C.2 -11 .9 -11.6 1.9 -11.6C4.4 -11.6 4.6 -7.4 0 -4.2Z'
      : 'M0 -12.2C-3.4 -9.4 -4.6 -8.2 -4.2 -6.6C-3.8 -5 -1.8 -5 -.8 -6.2L-1.6 -4.2H1.6L.8 -6.2C1.8 -5 3.8 -5 4.2 -6.6C4.6 -8.2 3.4 -9.4 0 -12.2Z',
    suit === 'h' ? E.crimson : E.charcoal,
    0.7,
  ) +
  `<text x="-4.2" y="-12.4" font-family="Georgia, serif" font-weight="700" font-size="5.6" fill="${p.metal}" stroke="${p.dark}" stroke-width=".25" text-anchor="middle">A</text>` +
  `</g>`

export const NUEVAS_ART: Record<string, (u: number) => string> = {
  // La primera victoria: un meeple en lo alto del podio, bajo un sol de rayos y cuatro estrellas.
  'Primera ficha': (u) => {
    const p = pin(u)
    const wedges = Array.from({ length: 8 }, (_, i) => {
      const a = ((i * 45 - 90) * Math.PI) / 180, d = (11.25 * Math.PI) / 180
      return p.cell(`M60 50L${f(60 + 90 * Math.cos(a - d))} ${f(50 + 90 * Math.sin(a - d))}L${f(60 + 90 * Math.cos(a + d))} ${f(50 + 90 * Math.sin(a + d))}Z`, E.navy, 0.8)
    }).join('')
    const s = 0.95, w = f(1.4 / s)
    const figure =
      `<g transform="translate(60 48.4) scale(${s})">` +
      p.cell(MEEPLE, E.mustard, w) +
      p.cell('M-6.4 -18.8C-6.4 -22.4 -3.8 -24.6 -1 -24.6C-3.4 -23.2 -4.8 -21.4 -5 -18.4Z', E.ivory, 0.9) +
      p.cell('M-4.8 -10.4H-1.8L0 -5.8L1.8 -10.4H4.8L1.3 -2.4H-1.3Z', E.crimson, 1) +
      p.solid(ellipse(0, -.6, 3.4, 3.4)) +
      p.solid(starPath(0, -.5, 1.9, .85, 5)) +
      `</g>`
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.cobalt}"/>` +
      wedges +
      p.guil('M0 0H120V130H0Z') +
      p.star(34, 46, 3) + p.star(86, 46, 3) + p.star(41, 33, 2.1) + p.star(79, 33, 2.1) +
      p.cell('M41 79H79V108H41Z', E.ivory) +
      p.cell('M38 73.4H82Q83.6 73.4 83.6 75V77.5Q83.6 79.1 82 79.1H38Q36.4 79.1 36.4 77.5V75Q36.4 73.4 38 73.4Z', E.crimson) +
      p.solid('M56.4 86.6L61.8 83.4H63.6V97.8H66.2V100.4H55.8V97.8H58.6V87.4L56.4 88.6Z') +
      figure
    )
  },

  // Diez ganadas: la cámara de turista sale volando; queda el mate, con su virola de plata y su guarda.
  'Ya no sos turista': (u) => {
    const p = pin(u)
    const rays = Array.from({ length: 16 }, (_, i) => {
      const a = ((i * 22.5 - 90) * Math.PI) / 180, d = (4.2 * Math.PI) / 180, R = i % 2 ? 21.5 : 25
      return p.solid(`M${f(60 + 16.5 * Math.cos(a - d))} ${f(44 + 16.5 * Math.sin(a - d))}L${f(60 + R * Math.cos(a))} ${f(44 + R * Math.sin(a))}L${f(60 + 16.5 * Math.cos(a + d))} ${f(44 + 16.5 * Math.sin(a + d))}Z`)
    }).join('')
    const gourd = 'M47 62C42.5 67.5 41 76 44 83.5C47 90.5 53 94 60 94C67 94 73 90.5 76 83.5C79 76 77.5 67.5 73 62Z'
    const gc = p.id('gc')
    const band =
      `<clipPath id="${gc}"><path d="${gourd}"/></clipPath><g clip-path="url(#${gc})">` +
      `<path d="M38 72.6Q60 76.4 82 72.6V80.2Q60 84 38 80.2Z" fill="${E.charcoal}"/>` +
      [44, 50.5, 57, 63.5, 70, 76.5].map((x) => {
        const y = 76.6 + (1 - ((x - 60) / 22) ** 2) * 1.9
        return `<path d="M${x} ${f(y - 3)}L${f(x + 2.6)} ${f(y)}L${x} ${f(y + 3)}L${f(x - 2.6)} ${f(y)}Z" fill="${E.ivory}"/><circle cx="${x}" cy="${f(y)}" r=".9" fill="${E.crimson}"/>`
      }).join('') +
      `</g>` +
      p.wire('M43.4 72.7Q60 76.4 76.6 72.7', 1) + p.wire('M43.4 80.3Q60 84 76.7 80.3', 1)
    const camera =
      `<g transform="translate(33 61) rotate(-24)">` +
      p.cell('M-9 -3.6Q-9 -6 -6.6 -6H-4.2L-2.6 -8.4H2.6L4.2 -6H6.6Q9 -6 9 -3.6V4.4Q9 6.6 6.6 6.6H-6.6Q-9 6.6 -9 4.4Z', E.charcoal, 1.1) +
      p.solid(ellipse(0, .4, 4.4, 4.4)) + p.cell(ellipse(0, .4, 2.7, 2.7), E.navy, 0.7) +
      `<circle cx="-.9" cy="-.5" r=".8" fill="#fff" opacity=".8"/>` +
      `</g>` +
      p.wire('M44 69.4L47.6 71.8', 1) + p.wire('M42.4 74.6L45.4 77.6', 1)
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.sky}"/>` +
      p.guil('M0 0H120V130H0Z') +
      rays +
      p.cell(ellipse(60, 44, 15, 15), E.mustard) +
      p.cell(gourd, E.leather) +
      band +
      p.solid('M46 62V65.2A14 3.6 0 0 0 74 65.2V62Z') +
      [48.6, 52.6, 56.6, 60.6, 64.6, 68.6, 72].map((x) => `<circle cx="${x}" cy="${f(64.4 + (1 - ((x - 60) / 14) ** 2) * 2.2)}" r=".55" fill="${p.dark}"/>`).join('') +
      p.solid(ellipse(60, 62, 14, 3.6)) +
      p.cell(ellipse(60, 61.8, 11.2, 2.4), E.jade, 0.9) +
      p.cell('M49.6 61.6Q53.4 56.6 58.4 61.4Z', E.jade, 0.9) +
      p.solid('M61.4 60.8L63.8 61.2L70.6 25.8L68.2 25.4Z') +
      p.solid('M68.1 25.6C68 23.4 67 22 65 21.4C64.4 21.2 64 22.4 64.6 22.7C66.2 23.4 66.9 24.4 67 25.6Z') +
      p.solid(ellipse(65.9, 44.2, 2.6, 1.3)) +
      camera
    )
  },

  // Cien: el capo, de traje cruzado, sombrero y rosa, sobre un damasco bordó.
  'Capo di tutti capi': (u) => {
    const p = pin(u)
    const dm = p.id('dm')
    const s = 1.02, w = f(1.4 / s)
    const head =
      p.cell(ellipse(0, -17, 8.8, 8.8), E.blush, w) +
      p.wire('M-5 -17.6Q-3.4 -16.4 -1.8 -17.6', 0.9) + p.wire('M1.8 -17.6Q3.4 -16.4 5 -17.6', 0.9) +
      p.cell('M-5.2 -12.6C-3.6 -14.8 -1 -14.6 0 -13.4C1 -14.6 3.6 -14.8 5.2 -12.6C3.8 -11.4 1.4 -11.8 0 -12.3C-1.4 -11.8 -3.8 -11.4 -5.2 -12.6Z', E.charcoal, 0.8)
    const hat =
      p.cell('M-8.2 -22.6C-8.8 -28.6 -6.8 -33.4 -2.8 -33.4C-1 -31.8 1 -31.8 2.8 -33.4C6.8 -33.4 8.8 -28.6 8.2 -22.6Z', E.charcoal, w) +
      p.cell('M-8.5 -26.6C-3 -25.1 3 -25.1 8.5 -26.6L8.4 -23.4C3 -22.2 -3 -22.2 -8.4 -23.4Z', E.crimson, 0.9) +
      p.cell('M-14.4 -22.4C-14.4 -25.6 14.4 -25.6 14.4 -22.4C14.4 -20.2 -14.4 -20.2 -14.4 -22.4Z', E.charcoal, w)
    const suit =
      `<clipPath id="${dm}c"><path d="${MEEPLE}"/></clipPath><g clip-path="url(#${dm}c)">` +
      Array.from({ length: 12 }, (_, i) => `<path d="M${-24 + i * 4.4} -10V30" stroke="${E.slate}" stroke-width=".55"/>`).join('') + `</g>` +
      p.cell('M-5 -10.6L0 -1.2L5 -10.6Z', E.white, 0.9) +
      p.cell('M-1.3 -9.4H1.3L2.1 -2.6L0 .2L-2.1 -2.6Z', E.crimson, 0.8) +
      p.wire('M-6.8 -10.4L-1.4 -.4', 1) + p.wire('M6.8 -10.4L1.4 -.4', 1) +
      p.cell('M-10.6 -5.4L-6.6 -5.4L-8.4 -3.2Z', E.white, 0.7) +
      p.cell('M8.6 -2.6Q11.6 -3.4 12.4 -.8Q9.6 -.2 8.6 -2.6Z', E.jade, 0.7) +
      p.cell(ellipse(8.2, -5.2, 2.3, 2.3), E.crimson, 0.8) +
      p.solid('M21.4 -5.6A2.6 2.6 0 1 1 21.39 -5.6ZM21.4 -4.2A1.2 1.2 0 1 0 21.41 -4.2Z') +
      p.cell(ellipse(21.4, -6.4, 1.3, 1.3), E.crimson, 0.6)
    return (
      `<pattern id="${dm}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${E.wine}"/>` +
      `<path d="M5 1.4L7.6 5L5 8.6L2.4 5Z" fill="none" stroke="${E.crimson}" stroke-width=".8"/><circle cx="0" cy="0" r="1" fill="${E.crimson}"/><circle cx="10" cy="0" r="1" fill="${E.crimson}"/><circle cx="0" cy="10" r="1" fill="${E.crimson}"/><circle cx="10" cy="10" r="1" fill="${E.crimson}"/></pattern>` +
      `<rect x="0" y="0" width="120" height="130" fill="url(#${dm})"/>` +
      p.guil('M0 0H120V130H0Z') +
      p.cell(ellipse(60, 89.4, 24, 4.6), E.crimson, 1.2) +
      `<g transform="translate(60 62.6) scale(${s})">` + p.cell(MEEPLE, E.charcoal, w) + suit + head + hat + `</g>`
    )
  },

  // Quinientas partidas: el lobo viejo, de boina y anteojos, gana con los ojos cerrados bajo la luna llena.
  'Viejo lobo': (u) => {
    const p = pin(u)
    const head =
      'M60 41C67 41 72.6 44 75.4 49.4L83.6 56L78.6 58.8L86.4 64.8L78.8 67.2L82.4 73.6L72.4 75.4C69.2 82.6 64.8 88.4 60 88.4' +
      'C55.2 88.4 50.8 82.6 47.6 75.4L37.6 73.6L41.2 67.2L33.6 64.8L41.4 58.8L36.4 56L44.6 49.4C47.4 44 53 41 60 41Z'
    const mirror = (svg: string) => svg + `<g transform="translate(120 0) scale(-1 1)">${svg}</g>`
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.midnight}"/>` +
      p.guil('M0 0H120V130H0Z') +
      p.star(31, 35, 1.8) + p.star(90, 35, 1.5) + p.star(27, 79, 1.4) +
      p.cell(ellipse(60, 56, 30, 30), E.ivory) +
      p.cell(ellipse(37.6, 46, 3.2, 3.2), E.cream, 0.9) + p.cell(ellipse(84.6, 43, 2.4, 2.4), E.cream, 0.9) + p.cell(ellipse(80, 33.6, 1.6, 1.6), E.cream, 0.8) +
      p.cell('M44 92C52 88.6 68 88.6 76 92L74.8 98.4C66 95.4 54 95.4 45.2 98.4Z', E.crimson, 1.1) +
      p.cell(head, E.gray) +
      p.cell('M60 56C63 60 66.4 60.8 70 60C74 62.4 76 66.4 75.2 70.4C72.2 79 66.6 86.6 60 86.6C53.4 86.6 47.8 79 44.8 70.4C44 66.4 46 62.4 50 60C53.6 60.8 57 60 60 56Z', E.white, 1.1) +
      p.cell('M46.6 44.6C49.6 40.8 70 39.6 74.6 44C76.4 46 74.6 48.8 70.6 49.6C64 50.8 54 50.6 48.6 49.2C46 48.4 45.4 46.2 46.6 44.6Z', E.navy) +
      p.solid(ellipse(60.6, 40.4, 1.6, 1.6)) +
      mirror(p.cell('M45.8 50.4L43 29.6L56.6 42.2C52.4 43.6 48.6 46.4 45.8 50.4Z', E.gray) + p.cell('M47.2 45.4L45.4 34.4L53.2 42.2C50.8 43 48.8 44 47.2 45.4Z', E.blush, 0.9)) +
      mirror(p.cell('M47.4 55.6Q52 51.4 57 54.6Q52.4 54.4 47.4 57.2Z', E.white, 0.8) + p.wire('M49.4 60.2Q52.6 62.4 55.8 60', 1) + p.wire(ellipse(52.6, 60.6, 5.4, 5.4), 0.9)) +
      p.wire('M58 60Q60 58.8 62 60', 0.9) +
      p.cell('M56 69.4C56 67.6 64 67.6 64 69.4C64 71.6 61.6 73.4 60 73.4C58.4 73.4 56 71.6 56 69.4Z', E.charcoal, 0.8) +
      p.wire('M60 73.4V76.2M55.6 77.2Q60 80.2 64.8 76.4', 0.9) +
      card(p, 82, 87, -14, 's') + card(p, 84, 86.4, 4, 'h') + card(p, 86.4, 86.8, 22, 's')
    )
  },

  // Diez seguidas: la camiseta con el 10 y su aureola. El Diego, sin mostrarlo.
  'D10S': (u) => {
    const p = pin(u)
    const shirt = 'M53 40L43.6 43.4L32.6 52.6L38.8 61.4L44.2 57.6V89C54 91.6 66 91.6 75.8 89V57.6L81.2 61.4L87.4 52.6L76.4 43.4L67 40Q60 47.6 53 40Z'
    const sc = p.id('sh')
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.navy}"/>` +
      p.cell(ellipse(60, 62, 33, 33), E.cobalt) +
      `<path d="${shirt}" fill="${E.white}"/>` +
      `<clipPath id="${sc}"><path d="${shirt}"/></clipPath><g clip-path="url(#${sc})">` +
      `<path d="M55.4 30H64.6V100H55.4ZM42 30H47.6V100H42ZM72.4 30H78V100H72.4Z" fill="${E.sky}"/>` +
      p.wire('M55.4 30V100M64.6 30V100M47.6 30V100M72.4 30V100') +
      `</g>` +
      p.wire(shirt) +
      p.cell('M53 40Q60 47.6 67 40L64.8 39.2Q60 44.4 55.2 39.2Z', E.navy, 1) +
      `<text x="60" y="78.6" font-family="Lilita One, sans-serif" font-size="22" fill="${E.navy}" stroke="${p.metal}" stroke-width="1.2" paint-order="stroke" stroke-linejoin="round" text-anchor="middle">10</text>` +
      p.ring(60, 30.6, 14.6, 5, 4.2, E.mustard)
    )
  },

  // Veinte seguidas: "¿de qué planeta viniste?". Un barrilete celeste y blanco entre las estrellas.
  'Barrilete cósmico': (u) => {
    const p = pin(u)
    const bow = (x: number, y: number, r: number) => p.cell('M-3.6 -2.4L0 0L-3.6 2.4Z', E.mustard, 0.9, `translate(${x} ${y}) rotate(${r})`) + p.cell('M3.6 -2.4L0 0L3.6 2.4Z', E.mustard, 0.9, `translate(${x} ${y}) rotate(${r})`)
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.midnight}"/>` +
      p.star(33, 31, 2.3) + p.star(88, 63, 1.9) + p.star(86, 31, 1.4) +
      p.cell(ellipse(33.4, 66, 6.4, 6.4), E.plum) + `<g transform="rotate(-18 33.4 66)">${p.wire(ellipse(33.4, 66, 11, 2.6), 1)}</g>` +
      p.wire('M60 80C53 86 51 90 55 94C58.4 97.4 63.6 97.6 66.4 101', 1.1) +
      bow(53.6, 88.6, -30) + bow(61.4, 96.8, 20) +
      p.cell('M60 22L39 47H60Z', E.sky) + p.cell('M60 22L81 47H60Z', E.white) +
      p.cell('M39 47L60 80V47Z', E.white) + p.cell('M81 47L60 80V47Z', E.sky) +
      p.cell(ellipse(60, 47, 4.4, 4.4), E.mustard, 1)
    )
  },

  // Siete generalas servidas: la mano de Dios, con la manga albiceleste, larga el dado.
  'Mano de Dios': (u) => {
    const p = pin(u)
    const hand =
      'M-8.4 24L-10.6 8C-13.6 4.6 -16.4 -.6 -18.2 -5C-19.4 -8 -16.4 -10 -14.4 -7.8C-12.6 -5.8 -11.4 -3.6 -10.6 -2.4' +
      'L-11.8 -18.8C-12.2 -22.8 -7 -23.4 -6.8 -19.6L-5.6 -5.2L-5.2 -5.2L-5.2 -22.2C-5.2 -26.4 .2 -26.4 .2 -22.2L-.2 -5.4L.2 -5.4' +
      'L1.2 -20.4C1.6 -24.2 6.6 -23.8 6.2 -20L4.8 -4.6L5.2 -4.6L7.4 -14.6C8.2 -18 12.4 -17.4 11.8 -14L10.6 2L8.4 24Z'
    const pips = [[-2.8, -2.8], [2.8, -2.8], [0, 0], [-2.8, 2.8], [2.8, 2.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.25" fill="${E.charcoal}"/>`).join('')
    return (
      `<rect x="0" y="0" width="120" height="130" fill="${E.sky}"/>` +
      p.cell(ellipse(58, 52, 29, 29), E.ivory) +
      `<g transform="translate(58 62) rotate(6) scale(1.05)">` +
      p.cell(hand, E.blush, 1.1) +
      p.cell('M-11.4 20H11.4L12.6 40H-12.6Z', E.sky, 1.1) + p.cell('M-3.4 20H3.4L3.6 40H-3.6Z', E.white, 1.1) +
      `</g>` +
      p.ring(58.6, 27.6, 12.4, 4.4, 3.8, E.mustard) +
      `<g transform="translate(80 43) rotate(18)">` + p.cell('M-5 -6.6H5Q6.6 -6.6 6.6 -5V5Q6.6 6.6 5 6.6H-5Q-6.6 6.6 -6.6 5V-5Q-6.6 -6.6 -5 -6.6Z', E.white, 1.1) + pips + `</g>`
    )
  },
}
