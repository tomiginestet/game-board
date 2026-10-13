// Coup, el de las influencias y el chamuyo, en clave heroica. El rojo sangre de la ficha del juego es el color propio
// (terciopelo, lacre, buzón, forros) y el papel del día lleva su grano rosado. Los símbolos patrios (la banda, el
// bastón, la escarapela, el sol) son los de todos: nada de partidos. A Pinocho no se lo dibuja: está su nariz.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, starPath, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Rojo de la ficha de Coup, con su sombra, su luz y un rosado pálido. */
const CP = '#8C1C13', CP_D = '#55100B', CP_L = '#C2493B', CP_XL = '#F3D2CA'
/** Celeste de la banda y de la escarapela. */
const ARG = '#7DB3E3', ARG_D = '#4F86BD'
/** Rosa de la fachada. */
const ROSA = '#E8ABA2', ROSA_D = '#C47A70', ROSA_L = '#F7D6CF'
/** Cartón y vidrio. */
const CARD = '#EADCBD', CARD_D = '#B9A47A'

/** Papel del día con el borde granulado en el rojo de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#E9B9AF', 0.5, 0.46, 0.7, 0, 1), '#D9958A', 0.5)

/** Terciopelo rojo oscuro con la luz en el medio. */
const velvet = (k: Kit, cy = 0.45) => `<rect width="120" height="130" fill="${CP_D}"/>` + k.shade(FULL, k.rad(CP, 0.5, cy, 0.55, 0.95, 0), CP, 0.45) + k.shade(FULL, k.rad('#2A0603', 0.5, 0.5, 0.75, 0, 0.8), '#2A0603', 0.4)

/** Escenario rosado: un disco pálido con el borde granulado. */
const stageR = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${CP_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad('#E09A8E', 0.5, 0.5, 0.5, 0, 1), '#D9877A', 0.6) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CP_L}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor dorado suave. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7) => k.shade(ellipse(cx, cy, rx, ry), k.rad(P.goldL, 0.5, 0.5, 0.5, a, 0), P.goldL, 0.45)

/** Cordón dorado retorcido. */
const cord = (d: string, w = 1.1) =>
  `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 2)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.gold}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.goldD}" stroke-width="${w}" stroke-dasharray=".5 .9"/>`

/** Borla dorada colgando de (x,y). */
function tassel(k: Kit, x: number, y: number, r = 0, s = 1) {
  const head = 'M0 0C1.6 0 2.4 1 2.4 2.4C2.4 3.4 1.8 4 1.4 4.4H-1.4C-1.8 4 -2.4 3.4 -2.4 2.4C-2.4 1 -1.6 0 0 0Z'
  const skirt = 'M-1.6 4.2H1.6L3.2 11.6C1.6 12.4 -1.6 12.4 -3.2 11.6Z'
  return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
    k.draw([
      { d: skirt, fill: P.gold, inner: k.sh(skirt, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + `<path d="M-1 5V11.6M0 5V12M1 5V11.6M-2 6V11.4M2 6V11.4" stroke="${P.goldD}" stroke-width=".3"/>` },
      { d: head, fill: P.gold, inner: k.sh(head, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
    ], f(0.4 / s)) +
    `<path d="M-1.8 4.4H1.8" stroke="${CP}" stroke-width=".9"/><circle cx="-.7" cy="1.6" r=".5" fill="${P.goldL}"/></g>`
}

/** Escarapela: cinta celeste y blanca plisada en redondo, con sus colas. Centro en (0,0). */
function cockade(k: Kit, r: number) {
  const pleats = (rr: number, n: number, c: string) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return `<path d="M${f(Math.cos(a) * rr * 0.45)} ${f(Math.sin(a) * rr * 0.45)}L${f(Math.cos(a) * rr * 0.98)} ${f(Math.sin(a) * rr * 0.98)}" stroke="${c}" stroke-width="${f(rr * 0.05)}"/>`
  }).join('')
  const tail = (sgn: number) => `M${f(sgn * r * 0.2)} ${f(r * 0.5)}L${f(sgn * r * 0.75)} ${f(r * 2)}L${f(sgn * r * 0.48)} ${f(r * 1.78)}L${f(sgn * r * 0.3)} ${f(r * 2.06)}L${f(sgn * r * -0.12)} ${f(r * 0.7)}Z`
  return (
    k.draw([
      { d: tail(-1), fill: ARG, inner: `<path d="${tail(-1)}" fill="${P.white}" transform="scale(.5 1)"/>` + k.sh(tail(-1), 0, 0, 1, 1, 0, 0.6, ARG_D, 0.4) },
      { d: tail(1), fill: ARG, inner: `<path d="${tail(1)}" fill="${P.white}" transform="scale(.5 1)"/>` + k.sh(tail(1), 0, 0, 1, 1, 0.2, 0.8, ARG_D, 0.4) },
      { d: ellipse(0, 0, r, r), fill: ARG, inner: pleats(r, 20, ARG_D) + k.sh(ellipse(0, 0, r, r), 0, 0, 1, 1, 0, 0.7, ARG_D, 0.4) },
    ], f(r * 0.06)) +
    `<circle r="${f(r * 0.66)}" fill="${P.white}" stroke="${P.ink}" stroke-width="${f(r * 0.03)}"/>` + pleats(r * 0.66, 16, '#C8D6E8') +
    `<circle r="${f(r * 0.36)}" fill="${ARG}" stroke="${P.ink}" stroke-width="${f(r * 0.03)}"/>` +
    `<circle r="${f(r * 0.14)}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${f(r * 0.03)}"/>`
  )
}

/** Sol de Mayo chiquito bordado en oro, centrado en (x,y). */
const miniSun = (k: Kit, x: number, y: number, r: number) =>
  k.sun(x, y, r, f(r * 2.1), 16) + `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.gold}" stroke="${P.goldD}" stroke-width="${f(r * 0.12)}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.3)}" fill="${P.goldL}"/>`

/** Carta de influencia (genérica): cartón con el marco rojo, la corona y el nombre. Centro en (0,0). */
function influence(k: Kit, w: number, h: number, name: string) {
  const d = roundRect(-w / 2, -h / 2, w / 2, h / 2, f(w * 0.07))
  const win = roundRect(f(-w / 2 + 2.6), f(-h / 2 + 2.6), f(w / 2 - 2.6), f(h * 0.2), f(w * 0.04))
  const crown = 'M-7 4L-8.4 -6L-3.6 -1.6L0 -8.6L3.6 -1.6L8.4 -6L7 4Z'
  return (
    k.draw([{
      d, fill: CARD,
      inner:
        k.sh(d, 0, 0, 1, 1, 0, 0.6, CARD_D, 0.4) +
        `<path d="${roundRect(f(-w / 2 + 1.2), f(-h / 2 + 1.2), f(w / 2 - 1.2), f(h / 2 - 1.2), f(w * 0.05))}" fill="none" stroke="${CP}" stroke-width="1"/>` +
        `<path d="${win}" fill="${CP}"/>` + k.sh(win, 0, 0, 1, 1, 0, 0.8, CP_D, 0.45) +
        k.shade(ellipse(0, -h * 0.13, w * 0.3, h * 0.2), k.rad(P.goldL, 0.5, 0.5, 0.5, 0.6, 0), P.goldL, 0.4) +
        `<g transform="translate(0 ${f(-h * 0.1)}) scale(${f(w / 30)})">` +
        k.draw([{ d: crown, fill: P.gold, inner: k.sh(crown, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-7.6 1.6H7.6" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.5) +
        `<circle cx="0" cy="-9.2" r="1" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="-8.6" cy="-6.6" r=".8" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="8.6" cy="-6.6" r=".8" fill="${P.white}" stroke="${P.ink}" stroke-width=".3"/><circle cx="0" cy="-1" r="1.3" fill="${CP_L}" stroke="${P.ink}" stroke-width=".3"/>` +
        `</g>` +
        `<path d="M${f(-w / 2 + 3)} ${f(h * 0.28)}H${f(w / 2 - 3)}" stroke="${CARD_D}" stroke-width=".4"/>` +
        `<path d="M${f(-w * 0.3)} ${f(h * 0.4)}H${f(w * 0.3)}M${f(-w * 0.24)} ${f(h * 0.45)}H${f(w * 0.24)}" stroke="${CARD_D}" stroke-width=".5"/>`,
    }], 0.6) +
    `<text x="0" y="${f(h * 0.34)}" ${GEORGIA} font-weight="700" font-size="${f(w * 0.15)}" fill="${CP_D}" text-anchor="middle" letter-spacing=".3">${name}</text>`
  )
}

export const COUP_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Presidente ─────────────────────────────────────────────────────

  // Tres partidas: ya te probaste la banda frente al espejo. El espejo dorado, con la banda celeste y blanca puesta.
  'Banda presidencial': (u) => {
    const k = kit(u)
    const cx = 59, cy = 61
    const frame = ellipse(cx, cy, 19.6, 25.4), glass = ellipse(cx, cy, 15.2, 21)
    const crest = 'M52.4 36.8C52.4 32.4 55.6 29.4 59 29.4C62.4 29.4 65.6 32.4 65.6 36.8C63.4 35.6 61.2 35.2 59 35.2C56.8 35.2 54.6 35.6 52.4 36.8Z'
    const volL = 'M52.6 36.6C49.6 36 47.6 33.8 48.2 31.6C48.8 29.8 51 29.8 51.4 31.2C51.6 32.4 50.4 32.8 49.8 32.2'
    const foot = 'M53.6 86C55.4 88.4 57.2 89.4 59 89.4C60.8 89.4 62.6 88.4 64.4 86C62.6 86.6 60.8 86.8 59 86.8C57.2 86.8 55.4 86.6 53.6 86Z'
    const S = [29, 37, 47, 63, 78, 80] as const
    const sash = (w: number) => taper(S[0], S[1], S[2], S[3], S[4], S[5], w, w)
    const beads = Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 17.4)}" cy="${f(cy + Math.sin(a) * 23.2)}" r=".55" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".2"/>` }).join('')
    const folds = [0.18, 0.34, 0.5, 0.66].map((t) => {
      const a = 1 - t, x = a * a * S[0] + 2 * a * t * S[2] + t * t * S[4], y = a * a * S[1] + 2 * a * t * S[3] + t * t * S[5]
      return hair(x - 4.6, y + 3, x - 0.6, y + 0.6, x + 4.4, y - 3.6, 0.5, ARG_D, 0.8)
    }).join('')
    const knot = 'M73.4 77.4L80.6 73L84.6 79.6L77.4 84Z'
    const tailA = 'M75.6 82.6L79.6 80.4L83.6 92L79.2 93.6Z'
    const tailB = 'M80.4 81.6L84.2 79L90.4 88.4L86.2 91Z'
    const fringe = (x0: number, y0: number, x1: number, y1: number) => Array.from({ length: 6 }, (_, i) => { const t = i / 5, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; return `<path d="M${f(x)} ${f(y)}l.3 2.6" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/><path d="M${f(x)} ${f(y)}l.3 2.6" stroke="${P.gold}" stroke-width=".4" stroke-linecap="round"/>` }).join('')
    const stripes = (d: string) => `<path d="${d}" fill="${P.white}" transform="translate(0 0)"/>`
    return (
      velvet(k, 0.46) +
      glow(k, cx, cy, 30, 34, 0.55) +
      k.floor(cx + 2, 91, 18, 2, '#2A0603') +
      k.cast([frame], 2.2, 2.4, '#2A0603') +
      k.draw([{ d: foot, fill: P.gold }], 0.5) +
      [1, -1].map((s) => `<g transform="translate(${s < 0 ? 2 * cx : 0} 0) scale(${s} 1)"><path d="${volL}" fill="none" stroke="${P.ink}" stroke-width="2.3" stroke-linecap="round"/><path d="${volL}" fill="none" stroke="${P.gold}" stroke-width="1" stroke-linecap="round"/></g>`).join('') +
      k.draw([
        { d: frame, fill: P.gold, inner: k.sh(frame, 0, 0, 1, 1, 0, 0.95, P.goldD, 0.5) + `<path d="M38 34H50V86H38Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.45, 0)}"/>` },
        { d: crest, fill: P.gold, inner: k.sh(crest, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.75) +
      `<circle cx="${cx}" cy="32.4" r="1.6" fill="${CP_L}" stroke="${P.ink}" stroke-width=".4"/><circle cx="${f(cx - 0.5)}" cy="31.9" r=".5" fill="#fff"/>` +
      beads +
      `<path d="${ellipse(cx, cy, 16.2, 22)}" fill="none" stroke="${P.goldD}" stroke-width=".6"/>` +
      `<path d="${glass}" fill="${P.sky1}"/>` +
      k.clip(glass,
        k.sh(glass, 0, 0, 1, 1, 0, 0.8, P.blue, 0.4) + k.shade(ellipse(cx - 2, cy - 4, 12, 16), k.rad(CP_XL, 0.5, 0.5, 0.5, 0.6, 0), CP_XL, 0.4) +
        `<path d="M44 56L64 34H69L46 61Z" fill="#fff" opacity=".55"/><path d="M50 70L72 46H74.6L52 73Z" fill="#fff" opacity=".4"/>`) +
      `<path d="${glass}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      // La banda: celeste, blanca y celeste, con los filetes dorados, el sol bordado y el moño con fleco y borla.
      k.cast([sash(12.4)], 1.6, 2.2, '#2A0603') +
      k.draw([
        { d: tailA, fill: ARG, inner: `<path d="M77.6 81.5L81.6 92.8" stroke="${P.white}" stroke-width="1.5"/>` + k.sh(tailA, 0, 0, 1, 1, 0, 0.8, ARG_D, 0.45) },
        { d: tailB, fill: ARG, inner: `<path d="M82.3 80.3L88.3 89.7" stroke="${P.white}" stroke-width="1.5"/>` + k.sh(tailB, 0, 0, 1, 1, 0.2, 0.9, ARG_D, 0.5) },
      ], 0.55) +
      fringe(79.2, 93.6, 83.6, 92) + fringe(86.2, 91, 90.4, 88.4) +
      k.draw([{ d: sash(12.4), fill: ARG, inner: stripes(sash(4.4)) + k.sh(sash(12.4), 0, 0, 1, 1, 0, 0.7, ARG_D, 0.45) + folds }], 0.75) +
      `<path d="${sash(5)}" fill="none" stroke="${P.gold}" stroke-width=".45"/><path d="${sash(10.8)}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      miniSun(k, 63.4, 66.6, 2.6) +
      k.draw([{ d: knot, fill: ARG, inner: `<path d="M77 75.2L81 81.8" stroke="${P.white}" stroke-width="2.2"/>` + k.sh(knot, 0, 0, 1, 1, 0, 0.8, ARG_D, 0.45) + `<path d="M74.6 78.6L81.4 74.4M76.2 82.6L83.2 78.4" stroke="${P.gold}" stroke-width=".5"/>` }], 0.5) +
      cord('M80.6 82C80.8 84.4 80 86.6 78.6 88', 0.8) + tassel(k, 78.4, 87.2, 14, 0.75) +
      sparkle(44, 38, 1.8, '#fff') + sparkle(88, 36, 1.6, P.goldL) + sparkle(31, 72, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Doce victorias: el bastón es tuyo y no lo devolvés. El bastón de mando, con su puño de oro, en el almohadón rojo.
  'Bastón de mando': (u) => {
    const k = kit(u)
    const cushion = 'M26 80C25 72 32 68 60 68C88 68 95 72 94 80C95 88 88 92 60 92C32 92 25 88 26 80Z'
    const shaft = 'M-32 -1.4H22V1.4H-32Z'
    const ferrule = 'M-38 -1.2C-39.2 -1.2 -40 -.6 -40 0C-40 .6 -39.2 1.2 -38 1.2H-32V-1.2Z'
    const collar = 'M21.4 -2.2H25.6V2.2H21.4Z'
    const knob = 'M25.4 -2C27 -4 29.4 -5 32 -5C35.6 -5 38.4 -2.8 38.4 0C38.4 2.8 35.6 5 32 5C29.4 5 27 4 25.4 2Z'
    const finial = 'M38 -1.4C39.4 -1.4 40.4 -.7 40.4 0C40.4 .7 39.4 1.4 38 1.4Z'
    const grain = [[-26, -0.8, -4], [-14, 0.6, 8], [2, -0.6, 16]].map(([x0, y, x1]) => hair(x0, y, (x0 + x1) / 2, y + 0.3, x1, y, 0.3, P.brownD)).join('')
    return (
      field(k) +
      k.sun(60, 54, 16, 46) +
      glow(k, 60, 54, 26, 24, 0.6) +
      k.floor(60, 91, 32, 3, CP_D) +
      tassel(k, 27, 79, 28) + tassel(k, 93, 79, -28) +
      k.draw([{
        d: cushion, fill: CP,
        inner: k.sh(cushion, 0, 0, 1, 1, 0, 0.85, CP_D, 0.5) + `<path d="M30 76C40 72 80 72 90 76" fill="none" stroke="#fff" stroke-width=".9" opacity=".35"/>` +
          hair(38, 82, 46, 78, 54, 76, 0.5, CP_D) + hair(82, 82, 74, 78, 66, 76, 0.5, CP_D) + hair(40, 88, 50, 86, 58, 86, 0.45, CP_D) +
          `<path d="M28 80C34 84 86 84 92 80" fill="none" stroke="${P.gold}" stroke-width=".7" stroke-dasharray="1.4 .8"/>` + `<circle cx="60" cy="80" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>`,
      }], 0.8) +
      k.floor(60, 72, 30, 2.6, CP_D) +
      `<g transform="translate(57 62) rotate(-24)">` +
      k.cast([shaft, knob], 1.4, 2.2, CP_D) +
      k.draw([
        { d: shaft, fill: P.night, inner: `<path d="M-32 -1.4H22V-.3H-32Z" fill="${P.mid}" opacity=".9"/><path d="M-30 -.9H20" stroke="#fff" stroke-width=".4" opacity=".7"/>` + grain },
        { d: ferrule, fill: P.gold, inner: k.sh(ferrule, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M-35 -1.2V1.2M-33.4 -1.2V1.2" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: collar, fill: P.gold, inner: k.sh(collar, 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M22.8 -2.2V2.2M24.2 -2.2V2.2" stroke="${P.goldD}" stroke-width=".35"/>` },
        { d: knob, fill: P.gold, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M26 -3H33V3H26Z" fill="${k.lin('#ffffff', 0, 0, 0, 1, 0.5, 0)}"/>` + `<path d="M29 -4.6C27.8 -1.6 27.8 1.6 29 4.6M35 -4.6C36.2 -1.6 36.2 1.6 35 4.6" fill="none" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: finial, fill: P.gold },
      ], 0.6) +
      miniSun(k, 32, 0, 1.3) +
      `<path d="M27.4 -3.6C29 -4.8 31 -5.2 33 -5" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round"/>` +
      `</g>` +
      // Los cordones con las borlas, colgando debajo del puño.
      cord('M78.4 52C78 56 77 59 75.6 61.6', 0.9) + cord('M78.6 52.4C80.4 56 81.4 59.4 81.4 62.6', 0.9) +
      tassel(k, 75.4, 61, 14, 0.8) + tassel(k, 81.4, 62, -6, 0.8) +
      sparkle(88, 36, 2.2) + sparkle(32, 42, 1.6) +
      k.defs()
    )
  },

  // Treinta y cinco partidas: saludás desde el balcón. La fachada rosa con la puerta abierta, la baranda con el paño
  // rojo y la escarapela, los papelitos y el sol de Mayo asomando detrás del pretil.
  'Balcón de la Rosada': (u) => {
    const k = kit(u)
    const wall = 'M8 44.6H112V130H8Z'
    const cornice = 'M6 41.6H114V45.6H6Z'
    const rail0 = 'M6 34.6H114V36.4H6Z'
    const outer = 'M44 92V63C44 54.2 51.2 47.6 60 47.6C68.8 47.6 76 54.2 76 63V92Z'
    const arch = 'M48.6 92V63.6C48.6 57.2 53.8 52.2 60 52.2C66.2 52.2 71.4 57.2 71.4 63.6V92Z'
    const key = 'M57.6 46.8H62.4L61.6 52.6H58.4Z'
    const win = (x: number) => `M${x} 92V67C${x} 63.2 ${f(x + 2.6)} 60.4 ${f(x + 5)} 60.4C${f(x + 7.4)} 60.4 ${f(x + 10)} 63.2 ${f(x + 10)} 67V92Z`
    const pil = (x: number) => `M${x} 46.6H${x + 5}V92H${x}Z`
    const leafL = 'M48.6 60.4L53.6 63.4V90.6L48.6 92Z', leafR = 'M71.4 60.4L66.4 63.4V90.6L71.4 92Z'
    const fan = Array.from({ length: 7 }, (_, i) => { const a = Math.PI + (i + 1) * (Math.PI / 8); return `M60 63.6L${f(60 + Math.cos(a) * 11.4)} ${f(63.6 + Math.sin(a) * 11.4)}` }).join('')
    const slab = 'M28 84H92V87.6H28Z'
    const rail = 'M29 74H91V76.4H29Z'
    const baluster = 'M-1.1 0C-1.1 .9 -1.8 1.5 -1.8 2.8C-1.8 4.2 -.7 4.9 -.7 5.8C-.7 6.4 -1.5 6.6 -1.5 7.6H1.5C1.5 6.6 .7 6.4 .7 5.8C.7 4.9 1.8 4.2 1.8 2.8C1.8 1.5 1.1 .9 1.1 0Z'
    const drape = 'M44.6 76.4H75.4V84.4C71.4 87.4 65 89 60 89C55 89 48.6 87.4 44.6 84.4Z'
    const corbel = (x: number) => `M${x} 87.6H${x + 4.6}V89.6C${x + 4.6} 92 ${x + 3.2} 93.4 ${x + 2.3} 93.4C${x + 1.4} 93.4 ${x} 92 ${x} 89.6Z`
    const papel = [[30, 46, 20, ARG], [90, 44, -30, P.white], [24, 60, -15, P.gold], [96, 58, 35, ARG], [38, 30, 50, P.white], [82, 28, -20, P.gold], [70, 22, 15, ARG], [50, 24, -35, P.gold], [27, 70, 40, P.white], [93, 70, -50, P.gold]]
      .map(([x, y, r, c]) => `<rect x="-1.6" y="-1" width="3.2" height="2" fill="${c}" stroke="${P.ink}" stroke-width=".3" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')
    const rust = Array.from({ length: 11 }, (_, i) => `<path d="M8 ${f(49.4 + i * 4.4)}H112" stroke="${ROSA_D}" stroke-width=".4" opacity=".8"/>`).join('') +
      Array.from({ length: 22 }, (_, i) => { const r = i % 11, x = 12 + Math.floor(i / 11) * 8 + (r % 2) * 4; return `<path d="M${x} ${f(45 + r * 4.4)}V${f(49.4 + r * 4.4)}M${120 - x} ${f(45 + r * 4.4)}V${f(49.4 + r * 4.4)}" stroke="${ROSA_D}" stroke-width=".35" opacity=".7"/>` }).join('')
    return (
      field(k) +
      k.sun(60, 42, 14, 46) +
      glow(k, 60, 38, 30, 18, 0.8) +
      // El pretil con sus balaustres, la cornisa y la pared almohadillada.
      Array.from({ length: 27 }, (_, i) => `<g transform="translate(${f(8 + i * 4)} 36.4) scale(.68)">` + k.draw([{ d: baluster, fill: ROSA_L, inner: k.sh(baluster, 0, 0, 1, 0, 0, 0.8, ROSA_D, 0.4) }], 0.5) + `</g>`).join('') +
      k.draw([
        { d: rail0, fill: ROSA_L, inner: k.sh(rail0, 0, 0, 0, 1, 0, 0.6, ROSA_D, 0.4) },
        { d: wall, fill: ROSA, inner: k.sh(wall, 0, 0, 0, 1, 0, 0.5, ROSA_D, 0.4) + rust + k.sh('M8 44H112V52H8Z', 0, 0, 0, 1, 0.7, 0, ROSA_D, 0.4) },
        { d: cornice, fill: ROSA_L, inner: k.sh(cornice, 0, 0, 0, 1, 0, 0.8, ROSA_D, 0.45) + `<path d="M6 43.2H114" stroke="${ROSA_D}" stroke-width=".4"/>` + Array.from({ length: 26 }, (_, i) => `<path d="M${8 + i * 4.2} 44V45.6" stroke="${ROSA_D}" stroke-width=".9"/>`).join('') },
      ], 0.7) +
      // Las ventanas de los costados y las pilastras.
      [26, 84].map((x) => `<path d="${win(x)}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` + k.clip(win(x), `<path d="${win(x)}" fill="${k.lin(P.mid, 0, 0, 1, 1, 0.8, 0)}"/>` + `<path d="M${x + 5} 60V92M${x} 70H${x + 10}M${x} 79H${x + 10}" stroke="${ROSA_L}" stroke-width=".7"/>` + `<path d="M${x + 1} 66L${x + 4} 63" stroke="#fff" stroke-width=".6" opacity=".7"/>`) + `<path d="${win(x)}" fill="none" stroke="${ROSA_L}" stroke-width="1.1" transform="translate(0 0)"/>`).join('') +
      k.draw([
        { d: pil(37.4), fill: ROSA_L, inner: k.sh(pil(37.4), 0, 0, 1, 0, 0, 0.6, ROSA_D, 0.4) + `<path d="M39.2 48V91M40.6 48V91" stroke="${ROSA_D}" stroke-width=".4"/>` },
        { d: pil(77.6), fill: ROSA_L, inner: k.sh(pil(77.6), 0, 0, 1, 0, 0.2, 0.8, ROSA_D, 0.45) + `<path d="M79.4 48V91M80.8 48V91" stroke="${ROSA_D}" stroke-width=".4"/>` },
        { d: outer, fill: ROSA_L, inner: k.sh(outer, 0, 0, 1, 1, 0, 0.6, ROSA_D, 0.4) },
      ], 0.6) +
      // La puerta abierta: hojas vidriadas, el abanico de la luneta y las cortinas rojas adentro.
      `<path d="${arch}" fill="${CP_D}"/>` + k.clip(arch,
        k.shade(ellipse(60, 74, 9, 16), k.rad(CP_L, 0.5, 0.5, 0.5, 0.7, 0), CP_L, 0.4) +
        `<path d="M53.6 63.6C55 70 54.4 80 53.6 92H50V60Z" fill="${CP}"/><path d="M66.4 63.6C65 70 65.6 80 66.4 92H70V60Z" fill="${CP}"/>` +
        hair(52.2, 66, 53, 76, 52, 88, 0.45, CP_D) + hair(67.8, 66, 67, 76, 68, 88, 0.45, CP_D) +
        `<path d="M48 63.6H72V52H48Z" fill="${P.sky1}"/><path d="${fan}" stroke="${ROSA_L}" stroke-width=".8"/><path d="M48 63.6H72" stroke="${ROSA_L}" stroke-width="1.2"/>` +
        `<path d="M52 58L56 55" stroke="#fff" stroke-width=".7" opacity=".8"/>`) +
      k.draw([
        { d: leafL, fill: P.white, inner: `<path d="M49.6 64H52.8V89.4H49.6Z" fill="${P.sky}"/><path d="M49.6 70.6L52.8 69.8M49.6 77.4L52.8 76.8M49.6 84L52.8 83.6M51.2 63V90" stroke="${P.white}" stroke-width=".6"/>` },
        { d: leafR, fill: P.white, inner: `<path d="M67.2 64H70.4V89.4H67.2Z" fill="${P.blue}"/><path d="M70.4 70.6L67.2 69.8M70.4 77.4L67.2 76.8M70.4 84L67.2 83.6M68.8 63V90" stroke="${P.white}" stroke-width=".6"/>` },
      ], 0.4) +
      `<path d="${arch}" fill="none" stroke="${P.ink}" stroke-width=".7"/>` +
      k.draw([{ d: key, fill: ROSA_L, inner: k.sh(key, 0, 0, 1, 1, 0, 0.7, ROSA_D, 0.4) }], 0.4) +
      // El balcón: ménsulas, losa, balaustres, baranda y el paño rojo con la escarapela.
      k.draw([corbel(32), corbel(57.7), corbel(83.4)].map((d) => ({ d, fill: ROSA_L, inner: k.sh(d, 0, 0, 1, 0, 0, 0.8, ROSA_D, 0.45) })), 0.5) +
      k.floor(60, 88, 32, 1.6, CP_D) +
      Array.from({ length: 15 }, (_, i) => `<g transform="translate(${f(31.4 + i * 4.08)} 76.4)">` + k.draw([{ d: baluster, fill: P.white, inner: k.sh(baluster, 0, 0, 1, 0, 0, 0.8, ROSA_D, 0.45) }], 0.35) + `</g>`).join('') +
      k.draw([{ d: slab, fill: P.white, inner: k.sh(slab, 0, 0, 0, 1, 0, 0.7, ROSA_D, 0.45) + `<path d="M28 84.8H92" stroke="#fff" stroke-width=".5"/>` }, { d: rail, fill: P.white, inner: k.sh(rail, 0, 0, 0, 1, 0, 0.7, ROSA_D, 0.4) }], 0.6) +
      k.draw([{
        d: drape, fill: CP,
        inner: k.sh(drape, 0, 0, 1, 1, 0, 0.85, CP_D, 0.5) + `<path d="M44 76H52V90H44Z" fill="${k.lin(CP_XL, 0, 0, 1, 0, 0.35, 0)}"/>` +
          hair(50, 77, 49, 82, 50.4, 87, 0.5, CP_D) + hair(70, 77, 71, 82, 69.6, 87, 0.5, CP_D) + hair(55, 77, 54.6, 83, 55.6, 88, 0.4, CP_L),
      }], 0.6) +
      `<path d="M44.6 84.4C48.6 87.4 55 89 60 89C65 89 71.4 87.4 75.4 84.4" fill="none" stroke="${P.gold}" stroke-width="1.6" stroke-dasharray=".6 .5"/>` +
      `<path d="M44.6 76.6H75.4" stroke="${P.gold}" stroke-width=".8"/>` +
      `<g transform="translate(60 80.6)">` + cockade(k, 3.6) + `</g>` +
      laurel(46, 102, 26, 95, 23, 68, 8) + laurel(74, 102, 94, 95, 97, 68, 8, true) +
      papel +
      sparkle(60, 22, 2.6, '#fff') + sparkle(34, 40, 1.6) + sparkle(87, 38, 1.6) +
      k.defs()
    )
  },

  // ── Detector de chamuyo ────────────────────────────────────────────

  // Cinco mentiras cazadas: te alcanza con levantar una ceja. El antifaz de terciopelo con una ceja bien arriba.
  'Ceja levantada': (u) => {
    const k = kit(u)
    const mask = 'M33 54C33 45.6 42 42.4 50.4 45C54.6 46.2 57.4 47.8 60 47.8C62.6 47.8 63.6 44.4 66 41.2C70 36.2 78 35.4 82.4 39.8C86 43.6 87 49 86.6 54.4C85.8 63.4 80 70.4 70.2 70.4C65.2 70.4 62.6 66.6 60 66.6C57.4 66.6 54.8 70.4 49.8 70.4C39.6 70.4 33 62.6 33 54Z'
    const eyeL = 'M39.8 56.4C42.6 51.8 51.6 51.2 55.2 56C51.6 60 43.2 60.4 39.8 56.4Z'
    const eyeR = 'M65 54.6C67.6 48.6 76.8 48.2 80 54.4C76.6 59.4 68.2 59.6 65 54.6Z'
    const browR = taper(64.4, 46.4, 70.8, 35.2, 82.8, 43.2, 2.8, 0.9)
    const browL = taper(56, 50.4, 47, 48.4, 38.4, 50.8, 2.4, 0.9)
    const stick = taper(83.4, 64, 90, 78, 92, 96, 3.4, 2.6)
    const filig = `<path d="M36.4 60C37.6 63 40 65 43 65.6M84 59C82.8 62.4 80.4 64.6 77.4 65.2" fill="none" stroke="${P.gold}" stroke-width=".6" stroke-linecap="round"/>`
    const gems = [[60, 52.4, 1.4, CP_L], [36.4, 53, 0.7, P.goldL], [85.2, 50, 0.7, P.goldL]]
      .map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${P.ink}" stroke-width=".3"/>`).join('')
    return (
      field(k) +
      stageR(k, 60, 60, 33) +
      k.floor(61, 90, 22, 2.4, CP_D) +
      k.draw([{ d: stick, fill: P.gold, inner: k.sh(stick, 0, 0, 1, 0, 0, 0.9, P.goldD, 0.5) + Array.from({ length: 6 }, (_, i) => `<path d="M${f(84 + i * 1.4)} ${f(68 + i * 4.4)}l3.6 -1.4" stroke="${CP}" stroke-width="1.1"/>`).join('') }], 0.55) +
      k.cast([mask], 2, 2.4, CP_D) +
      k.draw([{
        d: mask, fill: CP,
        inner:
          k.sh(mask, 0, 0, 1, 1, 0, 0.85, CP_D, 0.5) + `<path d="M30 40H50V72H30Z" fill="${k.lin(CP_XL, 0, 0, 1, 0, 0.45, 0)}"/>` +
          `<path d="M35.4 54.6C35.6 48 42 45.4 49.6 47.2C54 48.2 57.2 49.8 60 49.8C63 49.8 64.4 46.6 66.8 43.6C70.6 38.8 77.4 38.4 81 42C84 45.2 84.8 49.6 84.4 54.2C83.6 62 78.6 68.2 70.2 68.2C65.6 68.2 63 64.4 60 64.4C57 64.4 54.4 68.2 49.8 68.2C41 68.2 35.4 61.6 35.4 54.6Z" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-dasharray="1.2 .7"/>` +
          hair(42, 66, 46, 68, 52, 68, 0.45, CP_D) + hair(68, 68, 74, 68.4, 80, 66, 0.45, CP_D),
      }], 0.8) +
      `<path d="${eyeL}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/><path d="${eyeR}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/>` +
      `<path d="M41.8 56C44.6 53.6 50 53.4 53.2 55.4" fill="none" stroke="${P.gold}" stroke-width=".5"/><path d="M66.8 53.8C69.4 50.6 75.8 50.4 78.2 53.6" fill="none" stroke="${P.gold}" stroke-width=".5"/>` +
      `<path d="${browR}" fill="${P.night}"/><path d="${browL}" fill="${P.night}"/>` +
      hair(66.4, 44.4, 70.8, 37.8, 77, 39.2, 0.35, P.mid) +
      filig + gems +
      `<path d="M38.6 49C41 46.4 45 45.4 49 46" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" opacity=".65"/>` +
      `<path d="M33.6 54.6C30 54 27.6 52 26.4 49.4M86.4 53.6C90 53 92.4 51 93.6 48.4" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M33.6 54.6C30 54 27.6 52 26.4 49.4M86.4 53.6C90 53 92.4 51 93.6 48.4" fill="none" stroke="${CP_L}" stroke-width=".7" stroke-linecap="round"/>` +
      hair(84, 30, 86, 26, 89, 24, 0.6, CP) + hair(87.6, 33, 91, 31, 94, 31, 0.5, CP) +
      sparkle(34, 36, 2, '#fff') + sparkle(30, 74, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Veinte desafíos acertados: le ves las costuras a cualquier verso. La lupa sobre el Duque, que está zurcido.
  'Lupa de detective': (u) => {
    const k = kit(u)
    const W = 30, H = 44
    const tear = 'M' + Array.from({ length: 11 }, (_, i) => { const t = i / 10; return `${f(-15 + 30 * t)} ${f(6 - 18 * t + (i % 10 ? (i % 2 ? 1.3 : -1.3) : 0))}` }).join('L')
    const tl = Math.hypot(30, 18), nx = 18 / tl, ny = 30 / tl
    const stitches = Array.from({ length: 9 }, (_, i) => { const t = (i + 0.5) / 9, x = -15 + 30 * t, y = 6 - 18 * t; return `M${f(x - nx * 2.4)} ${f(y - ny * 2.4)}L${f(x + nx * 2.4)} ${f(y + ny * 2.4)}` }).join('')
    const card = () =>
      `<g transform="translate(54 62) rotate(-9)">` + influence(k, W, H, 'DUQUE') +
      `<path d="${tear}" fill="none" stroke="${P.ink}" stroke-width=".8" stroke-linejoin="round"/><path d="${tear}" fill="none" stroke="#fff" stroke-width=".4" transform="translate(.3 .7)" opacity=".8"/>` +
      `<path d="${stitches}" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round"/><path d="${stitches}" stroke="${P.white}" stroke-width=".55" stroke-linecap="round"/>` +
      `</g>`
    const lx = 63, ly = 52.6, lr = 15.4
    const lens = ellipse(lx, ly, lr, lr)
    const a = Math.PI / 4, hx = lx + Math.cos(a) * lr, hy = ly + Math.sin(a) * lr
    return (
      field(k) +
      k.sun(60, 58, 15, 46, 32, false) +
      glow(k, 60, 58, 28, 30, 0.6) +
      `<g transform="translate(56.4 64.4) rotate(-9)">` + k.shade(roundRect(-W / 2, -H / 2, W / 2, H / 2, 2), k.lin(CP_D, 0, 0, 0, 1, 0.5, 0.5), CP_D, 0.25) + `</g>` +
      card() +
      `<path d="M${f(hx)} ${f(hy)}L88 84.4" stroke="${P.ink}" stroke-width="7.4" stroke-linecap="round"/><path d="M${f(hx)} ${f(hy)}L88 84.4" stroke="${P.brownD}" stroke-width="5.2" stroke-linecap="round"/>` +
      `<path d="M${f(hx + 2)} ${f(hy + 1)}L87 82.4" stroke="${P.brown}" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>` + hair(79, 75.6, 82, 78.6, 85, 81.6, 0.6, P.night) +
      `<path d="M${f(hx - 0.8)} ${f(hy - 0.8)}L${f(hx + 3.8)} ${f(hy + 3.8)}" stroke="${P.ink}" stroke-width="7.8"/><path d="M${f(hx - 0.8)} ${f(hy - 0.8)}L${f(hx + 3.8)} ${f(hy + 3.8)}" stroke="${P.gold}" stroke-width="6"/>` +
      `<path d="M${f(hx + 0.4)} ${f(hy + 0.4)}L${f(hx + 2.8)} ${f(hy + 2.8)}" stroke="${P.goldD}" stroke-width="6" stroke-dasharray=".5 .7"/>` +
      `<path d="${lens}" fill="${P.white}"/>` +
      k.clip(lens, `<g transform="translate(${lx} ${ly}) scale(1.75) translate(${-lx} ${-ly})">` + card() + `</g>` +
        `<path d="${lens}" fill="${k.lin('#ffffff', 0, 0, 1, 1, 0.5, 0)}"/>` + k.sh(lens, 0, 0, 1, 1, 0.5, 0, P.sky2, 0.3)) +
      `<path d="M50.6 47C52.4 42 56.4 38.8 61.4 38.2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" opacity=".95"/>` +
      `<path d="${lens}" fill="none" stroke="${P.ink}" stroke-width="5.4"/><path d="${lens}" fill="none" stroke="${P.gold}" stroke-width="3.6"/><path d="${lens}" fill="none" stroke="${P.goldD}" stroke-width=".6" transform="translate(.5 .6)"/>` +
      `<path d="${ellipse(lx, ly, lr + 1.4, lr + 1.4)}" fill="none" stroke="${P.goldL}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>` +
      sparkle(34, 40, 1.8, P.goldL) + sparkle(88, 46, 1.6) +
      k.defs()
    )
  },

  // Sesenta mentiras cazadas: te enchufan y das la verdad en papel. El polígrafo de madera y bronce, con la tira.
  'Polígrafo': (u) => {
    const k = kit(u)
    const front = 'M35 61H79V84H35Z', top = 'M35 61L43 53H87L79 61Z', side = 'M79 61L87 53V76L79 84Z'
    const drum = roundRect(46, 48.4, 86, 54.4, 3)
    const paperTop = 'M54.6 53.6H72.6L66 61H48Z'
    const hang = 'M48 61H66V79C66 81.6 64.4 83 62 83H52C49.6 83 48 81.6 48 79Z'
    const roll = ellipse(57, 84.6, 10.6, 3)
    const trace = (x: number, amp: (y: number) => number) => {
      let d = `M${x} 61.6`
      for (let y = 62.6; y <= 81; y += 1.15) d += `L${f(x + amp(y) * (Math.round(y * 10) % 2 ? 1 : -1))} ${f(y)}`
      return d
    }
    const traces = trace(51.6, () => 0.5) + trace(57, (y) => 0.6 + Math.max(0, y - 70) * 0.06) + trace(62.4, (y) => (y > 65 && y < 77 ? 2 : 0.5))
    const arm = (x0: number, y0: number, x1: number, y1: number) => `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${x0} ${y0}L${x1} ${y1}" stroke="${P.gold}" stroke-width=".7" stroke-linecap="round"/>` +
      `<circle cx="${x0}" cy="${y0}" r="1.4" fill="${P.gold}" stroke="${P.ink}" stroke-width=".4"/><path d="M${x1} ${y1}l-.6 1.6" stroke="${P.ink}" stroke-width="1" stroke-linecap="round"/>`
    const corner = (x: number, y: number, sx: number, sy: number) => `<path d="M${x} ${y}h${3.4 * sx}v${1.2 * sy}h${-2.2 * sx}v${2.2 * sy}h${-1.2 * sx}Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".3"/>`
    const gauge = ellipse(73, 72.4, 4.6, 4.6)
    const plug = 'M-3 -2.4H3V2.4H-3Z'
    return (
      field(k) +
      k.sun(60, 58, 16, 48, 32, false) +
      glow(k, 60, 58, 32, 28, 0.75) +
      laurel(46, 101, 26, 94, 23, 66, 8) + laurel(74, 101, 94, 94, 97, 66, 8, true) +
      `<g transform="translate(60 68) scale(1.08) translate(-60 -68)">` +
      k.floor(61, 86, 30, 2.6, CP_D) +
      // El cable, que sale del costado y termina en el enchufe.
      `<path d="M35.6 76C31 76 29.6 79 30.4 82C31 84.6 33 85 34.6 84.2" fill="none" stroke="${P.ink}" stroke-width="2"/><path d="M35.6 76C31 76 29.6 79 30.4 82C31 84.6 33 85 34.6 84.2" fill="none" stroke="${P.night}" stroke-width="1"/>` +
      `<g transform="translate(37.6 82.8) rotate(-30)">` + k.draw([{ d: plug, fill: P.night, inner: `<path d="M-3 -1H3" stroke="${P.mid}" stroke-width=".5"/>` }], 0.45) + `<path d="M3 -1.2H5.4M3 1.2H5.4" stroke="${P.ink}" stroke-width="1.1"/><path d="M3 -1.2H5.2M3 1.2H5.2" stroke="${P.gold}" stroke-width=".5"/></g>` +
      k.draw([
        { d: side, fill: P.brownD, inner: k.sh(side, 0, 0, 1, 0, 0, 0.8, P.night, 0.45) + hair(83, 58, 83.4, 66, 83, 74, 0.35, P.brown) },
        { d: top, fill: P.brown, inner: k.sh(top, 0, 0, 1, 1, 0, 0.6, P.brownD, 0.4) + hair(46, 56, 60, 55.6, 76, 56, 0.35, P.brownD) + hair(42, 59, 56, 58.4, 70, 59, 0.35, P.goldL) },
        { d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="M35 61H45V84H35Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.4, 0)}"/>` + hair(37, 66, 40, 74, 37.6, 82, 0.35, P.brownD) + hair(70, 64, 72, 66, 76, 64, 0.35, P.brownD) + `<path d="M36.4 62.4H77.6V82.6H36.4Z" fill="none" stroke="${P.gold}" stroke-width=".45"/>` },
      ], 0.75) +
      corner(35, 61, 1, 1) + corner(79, 61, -1, 1) + corner(35, 84, 1, -1) + corner(79, 84, -1, -1) +
      `<circle cx="40.6" cy="67" r="1.9" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M40.6 65.4V67" stroke="${P.gold}" stroke-width=".5"/><circle cx="40.6" cy="74" r="1.9" fill="${P.night}" stroke="${P.ink}" stroke-width=".4"/><path d="M41.8 73L40.6 74" stroke="${P.gold}" stroke-width=".5"/>` +
      k.draw([{ d: gauge, fill: P.white, inner: k.sh(gauge, 0, 0, 1, 1, 0, 0.6, CARD_D, 0.4) + Array.from({ length: 7 }, (_, i) => { const t = ((-150 + i * 20) * Math.PI) / 180; return `<path d="M${f(73 + Math.cos(t) * 3.2)} ${f(72.4 + Math.sin(t) * 3.2)}L${f(73 + Math.cos(t) * 4)} ${f(72.4 + Math.sin(t) * 4)}" stroke="${i > 4 ? CP : P.ink}" stroke-width=".4"/>` }).join('') + `<path d="M73 72.4L75.6 69.6" stroke="${CP}" stroke-width=".6" stroke-linecap="round"/><circle cx="73" cy="72.4" r=".6" fill="${P.ink}"/>` }], 0.5) +
      `<circle cx="73" cy="72.4" r="4.6" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
      // El rollo de papel arriba, la tira que pasa por debajo de las plumas y cae por delante.
      k.draw([{ d: drum, fill: P.white, inner: k.sh(drum, 0, 0, 0, 1, 0, 0.8, CARD_D, 0.45) + `<path d="M48 50.4H84" stroke="#fff" stroke-width=".6"/>` }], 0.55) +
      `<ellipse cx="86" cy="51.4" rx="1.6" ry="3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/><ellipse cx="46" cy="51.4" rx="1.6" ry="3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>` +
      k.draw([{ d: paperTop, fill: P.white, inner: `<path d="M57 54L52.4 60.4M62.2 54L57.6 60.4M67.4 54L62.8 60.4" stroke="${CARD_D}" stroke-width=".3"/>` }], 0.4) +
      k.draw([{ d: roll, fill: P.white, inner: k.sh(roll, 0, 0, 0, 1, 0, 0.7, CARD_D, 0.4) + `<path d="${ellipse(57, 84.6, 7, 1.6)}" fill="none" stroke="${CARD_D}" stroke-width=".35"/>` }], 0.5) +
      k.draw([{
        d: hang, fill: P.white,
        inner: k.sh(hang, 0, 0, 1, 1, 0, 0.5, CARD_D, 0.35) + `<path d="M48 64H66M48 68H66M48 72H66M48 76H66M48 80H66" stroke="${CP_XL}" stroke-width=".35"/>` +
          `<path d="${traces}" fill="none" stroke="${CP}" stroke-width=".6" stroke-linejoin="round"/>`,
      }], 0.5) +
      `<g transform="translate(57 76.4) rotate(-10)">` + `<path d="${roundRect(-8.4, -2.6, 8.4, 2.6, 0.5)}" fill="${P.white}" opacity=".7"/><path d="${roundRect(-8.4, -2.6, 8.4, 2.6, 0.5)}" fill="none" stroke="${CP}" stroke-width=".6"/>` +
      `<text x="0" y="1.3" ${GEORGIA} font-weight="700" font-size="3.6" fill="${CP}" text-anchor="middle" letter-spacing=".3">VERDAD</text></g>` +
      arm(84, 57, 52.6, 59) + arm(85.6, 58.8, 58, 60) + arm(87, 60.6, 63.6, 60.8) +
      `<path d="M83 55V58.6M84.6 56.6V60.4M86 58.4V62" stroke="${P.ink}" stroke-width="1.6"/><path d="M83 55V58.6M84.6 56.6V60.4M86 58.4V62" stroke="${P.gold}" stroke-width=".7"/>` +
      `<path d="M44.6 59.6L47 57.4" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".7"/>` +
      `</g>` +
      sparkle(60, 22, 2.8, '#fff') + sparkle(88, 36, 1.8) + sparkle(31, 44, 1.6, P.goldL) +
      k.defs()
    )
  },

  // ── Chamuyero ──────────────────────────────────────────────────────

  // Tres mentiras descubiertas: la nariz te delata. La nariz postiza de madera, larga, con el elástico y una ramita
  // que le brotó en la punta.
  'Nariz de Pinocho': (u) => {
    const k = kit(u)
    const nose = 'M0 -13.4C3.2 -11.4 6.4 -8.4 9 -5.6C20 -4.4 36 -2.6 49 -1.6C52.4 -1.3 53.2 1.8 50.4 2.8C38 5.4 24 6.4 13.6 6.8C12.8 9 10.6 10.4 7.6 10.4C4.6 10.4 1.6 9.4 0 7.8Z'
    const face = 'M0 -13.4V7.8C-.9 7.2 -1.4 6 -1.4 4.6V-11.4C-1.4 -12.6 -.8 -13.2 0 -13.4Z'
    const wing = 'M13.4 3.6C10.4 2.6 6.8 4.2 6 7.6'
    const twig = 'M30 -3.6C30.6 -7.4 31.4 -10.6 33.6 -13.4'
    const leafA = 'M0 0C2 -3.2 6.6 -3.6 9 -.8C6.4 2.2 2 2 0 0Z'
    const band = 'M-1 -10C-10 -13 -20 -14 -32 -12M-1 4.6C-10 6.6 -20 8.6 -32 8'
    const grain = [[11, -3.8, 46, -0.6], [12, -0.2, 47, 1.2], [14, 3.6, 40, 4.4], [16, 1.6, 34, 2.8], [3, -9, 8, -3], [2, -4, 4, 4]].map(([x0, y0, x1, y1]) => hair(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2 - 0.5, x1, y1, 0.35, P.brownD)).join('')
    const leaf = (x: number, y: number, r: number, s: number) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` + k.draw([{ d: leafA, fill: P.green, inner: k.sh(leafA, 0, 0, 1, 1, 0, 0.8, P.greenD, 0.45) + `<path d="M.6 -.2Q4.4 -1 8 -.8" fill="none" stroke="${P.greenD}" stroke-width=".4"/>` }], f(0.4 / s)) + `</g>`
    return (
      field(k) +
      k.sun(60, 58, 15, 46, 32, false) +
      glow(k, 60, 58, 28, 26, 0.6) +
      k.floor(64, 84, 26, 2.4, CP_D) +
      `<g transform="translate(37 62) rotate(-10) scale(1.06)">` +
      `<path d="${band}" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="${band}" fill="none" stroke="${CP}" stroke-width=".9" stroke-linecap="round"/>` +
      k.cast([nose], 1.6, 2.2, CP_D) +
      k.draw([
        { d: face, fill: P.brownD },
        {
          d: nose, fill: P.brown,
          inner: k.sh(nose, 0, 0, 0, 1, 0, 0.9, P.brownD, 0.5) + `<path d="M0 -14C3 -12 6 -9 9 -6.4C20 -5.2 36 -3.4 49 -2.4L48.6 -.4C36 -1.4 20 -2.6 8 -3.2C5 -6 2.6 -8.6 0 -10Z" fill="${P.goldL}" opacity=".5"/>` + grain +
            `<ellipse cx="24" cy="2.6" rx="1.4" ry=".8" fill="${P.brownD}" opacity=".6"/><ellipse cx="24" cy="2.6" rx="2.6" ry="1.4" fill="none" stroke="${P.brownD}" stroke-width=".3"/>` +
            `<path d="${wing}" fill="none" stroke="${P.brownD}" stroke-width=".7" stroke-linecap="round"/>`,
        },
      ], 0.75) +
      `<ellipse cx="8.8" cy="8.6" rx="2.2" ry=".9" fill="${P.night}" transform="rotate(-8 8.8 8.6)"/>` +
      `<path d="M2 -11C4.6 -9.4 7 -7.2 8.6 -5.4" fill="none" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".7"/><path d="M20 -4C30 -3 40 -2 47 -1.2" fill="none" stroke="#fff" stroke-width=".55" stroke-linecap="round" opacity=".6"/>` +
      `<path d="${twig}" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="${twig}" fill="none" stroke="${P.brown}" stroke-width=".8" stroke-linecap="round"/>` +
      leaf(32.6, -11.6, -40, 0.9) + leaf(31, -8, 200, 0.8) + leaf(33.6, -13.4, -110, 0.6) +
      `</g>` +
      hair(91, 40, 95, 44, 96, 49, 0.6, CP) + hair(89, 34, 94, 36, 97, 40, 0.5, CP) +
      sparkle(80, 30, 2) + sparkle(32, 40, 1.6, P.goldL) +
      k.defs()
    )
  },

  // Doce veces cazado: ya nadie te compra el buzón. El buzón rojo de la esquina, con el cartel de "se vende".
  'Cuento del tío': (u) => {
    const k = kit(u)
    const body = 'M47 41H73V86H47Z'
    const cap = 'M44.6 41.6C44.6 33 51.4 27.4 60 27.4C68.6 27.4 75.4 33 75.4 41.6Z'
    const brim = 'M43 40.6H77V44H43Z'
    const knob = 'M57.8 27.6C57.8 25.6 58.8 24.4 60 24.4C61.2 24.4 62.2 25.6 62.2 27.6Z'
    const base = 'M44.6 84.6H75.4L77 90H43Z'
    const slot = roundRect(51.4, 48, 68.6, 51.8, 1.4)
    const sign = roundRect(-12, -7.6, 12, 7.6, 0.8)
    return (
      field(k) +
      k.sun(60, 56, 15, 46, 32, false) +
      glow(k, 60, 56, 26, 30, 0.6) +
      k.floor(61, 90.4, 22, 2.6, CP_D) +
      k.cast([body, cap, base], 2.2, 2.2, CP_D) +
      k.draw([
        { d: base, fill: CP_D, inner: k.sh(base, 0, 0, 1, 0, 0, 0.8, '#2A0603', 0.45) + `<path d="M44 86.4H76" stroke="${CP}" stroke-width=".5"/>` },
        {
          d: body, fill: CP,
          inner:
            k.sh('M62 40H76V87H62Z', 0, 0, 1, 0, 0, 0.9, CP_D, 0.5) + `<path d="M46 40H54V87H46Z" fill="${k.lin(CP_XL, 0, 0, 1, 0, 0.55, 0)}"/>` +
            `<path d="M47 58.4H73M47 79.6H73" stroke="${CP_D}" stroke-width=".7"/><path d="M47 59.2H73M47 80.4H73" stroke="${CP_L}" stroke-width=".4"/>` +
            hair(50, 62, 50.6, 70, 50, 78, 0.5, CP_XL, 0.7) + hair(69, 62, 69.6, 70, 69, 78, 0.45, CP_D),
        },
        { d: brim, fill: CP, inner: k.sh(brim, 0, 0, 1, 1, 0, 0.9, CP_D, 0.5) },
        { d: cap, fill: CP, inner: k.sh(cap, 0, 0, 1, 1, 0, 0.9, CP_D, 0.5) + `<path d="M46 30H56V42H46Z" fill="${k.lin(CP_XL, 0, 0, 1, 0, 0.6, 0)}"/>` + `<path d="M48 39.6C50 34 54.4 30.6 60 30.2" fill="none" stroke="${CP_XL}" stroke-width=".8" stroke-linecap="round" opacity=".7"/>` },
        { d: knob, fill: P.gold, inner: k.sh(knob, 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) },
      ], 0.8) +
      `<path d="${slot}" fill="${P.night}" stroke="${P.ink}" stroke-width=".6"/><path d="M52 48.2H68" stroke="#000" stroke-width="1"/><path d="M51.6 52.6H68.4" stroke="${CP_L}" stroke-width=".5"/>` +
      k.draw([{ d: roundRect(52.4, 53.6, 67.6, 57.2, 0.6), fill: P.gold, inner: k.sh(roundRect(52.4, 53.6, 67.6, 57.2, 0.6), 0, 0, 1, 1, 0, 0.8, P.goldD, 0.45) }], 0.35) +
      `<text x="60" y="56.4" ${GEORGIA} font-weight="700" font-size="2.6" fill="${P.ink}" text-anchor="middle" letter-spacing=".3">CARTAS</text>` +
      `<circle cx="52.6" cy="45.6" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/><circle cx="67.4" cy="45.6" r=".7" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>` +
      // El cartel de cartón, colgado con un piolín.
      `<path d="M47.6 41.6L52.4 62.6M72.4 41.6L67.8 62" fill="none" stroke="${P.ink}" stroke-width=".9"/><path d="M47.6 41.6L52.4 62.6M72.4 41.6L67.8 62" fill="none" stroke="${CARD}" stroke-width=".4"/>` +
      `<g transform="translate(60 68.6) rotate(-7)">` +
      k.draw([{ d: sign, fill: CARD, inner: k.sh(sign, 0, 0, 1, 1, 0, 0.7, CARD_D, 0.45) + `<path d="M-11 -6.6L-9 -5.4M10.6 5.8L8.4 6.6" stroke="${CARD_D}" stroke-width=".4"/>` }], 0.55) +
      `<circle cx="-8.4" cy="-5.2" r=".7" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="8.4" cy="-5.6" r=".7" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<text x="0" y="-.4" ${GEORGIA} font-weight="700" font-style="italic" font-size="5.4" fill="${CP_D}" text-anchor="middle">Se vende</text>` +
      `<text x="0" y="5" ${GEORGIA} font-style="italic" font-size="3" fill="${P.ink}" text-anchor="middle">dueño directo</text>` +
      `</g>` +
      sparkle(86, 34, 2) + sparkle(34, 40, 1.6, P.goldL) + sparkle(84, 78, 1.4, P.goldL) +
      k.defs()
    )
  },

  // Treinta y cinco mentiras descubiertas: tu valija está llena de humo envasado. La valija abierta, con los frascos.
  'Vendedor de humo': (u) => {
    const k = kit(u)
    const lid = 'M40 31H80L84.4 63H35.6Z'
    const lining = 'M42.4 34H77.6L81.2 60.4H38.8Z'
    const inside = 'M35.6 63H84.4L82 68.6H38Z'
    const front = 'M38 68.6H82V87.6H38Z'
    const jar = (x: number, h: number) => roundRect(f(x - 5.6), f(70 - h), f(x + 5.6), 72, 2)
    const smokeIn = (x: number, h: number, ph: number) =>
      Array.from({ length: 4 }, (_, i) => {
        const y = 70 - h * (0.2 + i * 0.2)
        return hair(x - 4.4, y + 1, x - 1 + Math.sin(i + ph) * 2, y - 3, x + 4.4, y - 0.6, 0.7, i % 2 ? '#fff' : CP_XL, 0.95)
      }).join('')
    const puffs = [[60.4, 44.6, 3.2], [58.6, 40, 3.9], [56.4, 35, 4.5], [57.6, 29.6, 5], [63.6, 26.8, 5.2], [69.6, 28.6, 4.4], [72, 33.4, 3.4], [69.4, 36.4, 2.4]]
    const latch = (x: number) => k.draw([{ d: roundRect(x - 2.4, 67.2, x + 2.4, 72.6, 0.6), fill: P.gold, inner: k.sh(roundRect(x - 2.4, 67.2, x + 2.4, 72.6, 0.6), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.5) + `<circle cx="${x}" cy="70.6" r=".6" fill="${P.goldD}"/>` }], 0.4)
    const corner = (x: number, y: number, sx: number, sy: number) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 0H5.4C4.4 1 3 1.6 1.6 1.6C1.6 3 1 4.4 0 5.4Z" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/><circle cx="1.1" cy="1.1" r=".45" fill="${P.goldL}"/></g>`
    const tufts = [[48, 42], [60, 42], [72, 42], [46, 52], [58, 52], [74, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${P.gold}" stroke="${P.ink}" stroke-width=".25"/>`).join('')
    const quilt = `<path d="M48 42L54 47L48 52L42.6 47ZM60 42L66 47L60 52L54 47ZM72 42L78 47L72 52L66 47Z" fill="none" stroke="${CP_D}" stroke-width=".45"/>`
    const jars = [[45.6, 18, 0.2], [74.4, 17, 2.1]] as const
    return (
      field(k) +
      k.sun(60, 54, 16, 48, 32, false) +
      glow(k, 60, 52, 30, 28, 0.75) +
      laurel(46, 101, 26, 94, 23, 66, 8) + laurel(74, 101, 94, 94, 97, 66, 8, true) +
      k.floor(60, 88, 30, 2.6, CP_D) +
      k.draw([{
        d: lid, fill: P.brown,
        inner: k.sh(lid, 0, 0, 1, 1, 0, 0.8, P.brownD, 0.45) + `<path d="${lining}" fill="${CP}"/>` + k.sh(lining, 0, 0, 1, 1, 0, 0.9, CP_D, 0.5) + quilt + tufts +
          `<path d="${lining}" fill="none" stroke="${P.gold}" stroke-width=".5"/>` + `<path d="M44 58H76" stroke="${CP_D}" stroke-width=".6"/><path d="M44 58.6H76" stroke="${CP_L}" stroke-width=".35"/>`,
      }], 0.75) +
      `<path d="${inside}" fill="${CP_D}" stroke="${P.ink}" stroke-width=".6"/>` +
      // Los frascos: dos parados con su humo adentro y el del medio destapado, largando una voluta.
      jars.map(([x, h, ph]) =>
        k.draw([{ d: jar(x, h), fill: '#E3E1EA', inner: k.sh(jar(x, h), 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) + smokeIn(x, h, ph) + `<path d="M${f(x - 3.8)} ${f(72 - h + 2)}V68" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".9"/>` }], 0.55) +
        k.draw([{ d: roundRect(f(x - 4.4), f(70 - h - 3.4), f(x + 4.4), f(70 - h + 0.4), 0.8), fill: P.gold, inner: k.sh(roundRect(f(x - 4.4), f(70 - h - 3.4), f(x + 4.4), f(70 - h + 0.4), 0.8), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) + `<path d="M${f(x - 4.4)} ${f(70 - h - 1.6)}H${f(x + 4.4)}" stroke="${P.goldD}" stroke-width=".35"/>` }], 0.45) +
        `<path d="${roundRect(f(x - 4.4), f(70 - h * 0.45), f(x + 4.4), f(70 - h * 0.45 + 4.4), 0.4)}" fill="${CARD}" stroke="${P.ink}" stroke-width=".35"/><text x="${x}" y="${f(70 - h * 0.45 + 3.2)}" ${GEORGIA} font-weight="700" font-size="2.5" fill="${CP_D}" text-anchor="middle">HUMO</text>`).join('') +
      k.draw(puffs.map(([x, y, r]) => { const d = ellipse(x, y, r, r); return { d, fill: P.white, inner: k.sh(d, 0, 0, 1, 1, 0.1, 0.85, P.sky2, 0.45) } }), 0.55) +
      hair(55, 36, 55.6, 31, 59, 28, 0.55, P.sky2) + hair(61, 31, 65, 28.6, 69, 30, 0.5, P.sky2) + hair(59.4, 43, 57.6, 40, 58, 37, 0.45, P.sky2) + hair(66, 33, 69, 32.4, 70, 34.6, 0.45, P.sky2) +
      `<path d="M54.6 31.4C55.6 28.6 58 26.8 61 26.6" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([{ d: jar(60, 22), fill: '#E3E1EA', inner: k.sh(jar(60, 22), 0, 0, 1, 0, 0, 0.6, P.blue, 0.4) + smokeIn(60, 22, 1.1) + `<path d="M56.2 52V68" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".9"/>` }], 0.55) +
      `<path d="${ellipse(60, 48.2, 5.4, 1.4)}" fill="${P.white}" stroke="${P.ink}" stroke-width=".45"/>` +
      `<path d="${roundRect(55.6, 58, 64.4, 62.4, 0.4)}" fill="${CARD}" stroke="${P.ink}" stroke-width=".35"/><text x="60" y="61.2" ${GEORGIA} font-weight="700" font-size="2.5" fill="${CP_D}" text-anchor="middle">HUMO</text>` +
      `<g transform="translate(71.4 46) rotate(32)">` + k.draw([{ d: roundRect(-4.4, -2, 4.4, 1.8, 0.8), fill: P.gold, inner: k.sh(roundRect(-4.4, -2, 4.4, 1.8, 0.8), 0, 0, 0, 1, 0, 0.9, P.goldD, 0.5) }], 0.45) + `</g>` +
      k.draw([{ d: front, fill: P.brown, inner: k.sh(front, 0, 0, 1, 1, 0, 0.85, P.brownD, 0.5) + `<path d="M38 68.6H48V88H38Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.45, 0)}"/>` + `<path d="M39.4 70H80.6V86.2H39.4Z" fill="none" stroke="${P.brownD}" stroke-width=".5" stroke-dasharray="1 .7"/>` + hair(44, 78, 56, 77, 70, 78.6, 0.4, P.brownD) }], 0.8) +
      latch(48) + latch(72) +
      `<path d="M54 87.6C54 90.6 66 90.6 66 87.6" fill="none" stroke="${P.ink}" stroke-width="2.6"/><path d="M54 87.6C54 90.6 66 90.6 66 87.6" fill="none" stroke="${P.brownD}" stroke-width="1.4"/>` +
      corner(38, 68.6, 1, 1) + corner(82, 68.6, -1, 1) + corner(38, 87.6, 1, -1) + corner(82, 87.6, -1, -1) +
      `<path d="${starPath(60, 79, 3.4, 1.3, 4)}" fill="${P.gold}" stroke="${P.ink}" stroke-width=".35"/>` +
      sparkle(84, 26, 2.2, '#fff') + sparkle(34, 40, 1.6) +
      k.defs()
    )
  },
}
