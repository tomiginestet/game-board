// Wingspan en clave heroica: pájaros de verdad, con su ojo natural y su plumaje grabado, y el verde de la ficha del
// juego en el papel y los acentos. Al hombre pájaro no se lo dibuja: aparece por sus alas (y los pájaros que se le
// posan encima). El hornero, el ave nacional, es el protagonista de la casa.
import { f } from '../helpers'
import { ellipse, hair, kit, laurel, P, roundRect, sparkle, taper, type Kit } from '../kit'

const GEORGIA = 'font-family="Georgia, serif"'
const FULL = 'M0 0H120V130H0Z'
/** Verde de la ficha de Wingspan, con su sombra, su luz, un verde pálido y la noche de monte. */
const W = '#74B816', W_D = '#4C7D0E', W_L = '#B5DC72', W_XL = '#E6F3CF'
/** Barro del nido, madera del poste y del cajón, y la paja. */
const MUD = '#B88554', MUD_D = '#80552F', MUD_L = '#DDB585', WOOD = '#C99A62', WOOD_D = '#8A5E32', STRAW = '#EBCB7C'
/** Plumas: hornero (rufo y ante), gorrión, canario, paloma, gallo y cisne. */
const RUFO = '#B4703A', RUFO_D = '#7E4520', ANTE = '#F2DFC0'
const GRIS = '#9DA3AE', CASTA = '#9A5A2E', CASTA_D = '#5E3418'
const CANARIO = '#F5D447', CANARIO_D = '#D9A21E'
const PALOMA = '#AEB6C6', PALOMA_D = '#6E7790', PALOMA_L = '#D6DCE6'
const GALLO = '#A33A22', GALLO_D = '#64200F', PLUMA_N = '#1F3320'
/** Huevos de colores de Wingspan. */
const EGGS = ['#9FC7E8', '#F2B6C6', '#F4E3B5', '#C7E3A6', '#C9B6E4', '#E8C9A0']

/** Papel del día con el borde granulado en el verde de la ficha. */
const field = (k: Kit) => `<rect width="120" height="130" fill="${P.paper}"/>` + k.shade(FULL, k.rad('#CFE5A9', 0.5, 0.46, 0.7, 0, 1), '#A9D076', 0.5)

/** Escenario verde: un disco pálido con el borde granulado. */
const stageW = (k: Kit, cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${W_XL}"/>` + k.shade(ellipse(cx, cy, r, r), k.rad(W_L, 0.5, 0.5, 0.5, 0, 1), W_L, 0.55) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${W}" stroke-width=".5" stroke-dasharray=".01 1.6" stroke-linecap="round"/>`

/** Resplandor suave de un color. */
const glow = (k: Kit, cx: number, cy: number, rx: number, ry: number, a = 0.7, c = P.goldL) => k.shade(ellipse(cx, cy, rx, ry), k.rad(c, 0.5, 0.5, 0.5, a, 0), c, 0.45)

/** Pseudoazar fijo. */
const rnd = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Ojo natural de pájaro: iris oscuro (o de color), pupila, brillo y un anillito claro si se pide. */
const eye = (x: number, y: number, r: number, iris = '#2A1A10', ring = '') =>
  (ring ? `<circle cx="${x}" cy="${y}" r="${f(r * 1.55)}" fill="${ring}"/>` : '') +
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${iris}" stroke="${P.ink}" stroke-width=".25"/><circle cx="${x}" cy="${y}" r="${f(r * 0.55)}" fill="#120C08"/><circle cx="${f(x - r * 0.35)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.32)}" fill="#fff"/>`

/** Patas finas con tres dedos adelante y uno atrás, apoyadas en y = 0 (hacia la izquierda). */
const legs = (x0: number, x1: number, top: number, c: string) =>
  [x0, x1].map((x) => `<path d="M${x} ${top}L${f(x - 0.4)} 0M${f(x - 0.4)} 0L${f(x - 3)} .3M${f(x - 0.4)} 0L${f(x - 2.4)} 1.1M${f(x - 0.4)} 0L${f(x + 1.8)} .4" fill="none" stroke="${P.ink}" stroke-width="1.3" stroke-linecap="round"/>` +
    `<path d="M${x} ${top}L${f(x - 0.4)} 0M${f(x - 0.4)} 0L${f(x - 3)} .3M${f(x - 0.4)} 0L${f(x - 2.4)} 1.1M${f(x - 0.4)} 0L${f(x + 1.8)} .4" fill="none" stroke="${c}" stroke-width=".55" stroke-linecap="round"/>`).join('')

interface Plumage {
  back: string
  dark: string
  belly: string
  wing: string
  tail: string
  bill: string
  leg: string
  cap?: string
  cheek?: string
  bib?: string
  brow?: string
  iris?: string
  ring?: string
  thin?: boolean
  sing?: boolean
  leg0?: number
  streaks?: string
}
/** Pájaro cantor de perfil, mirando a la izquierda, con las patas en (0,0): gorrión, canario u hornero según el plumaje. */
function songbird(k: Kit, o: Plumage) {
  const L = o.leg0 ?? 1.4
  const body = 'M-10.4 -14C-10.4 -17.6 -7.8 -20.2 -4.4 -20.2C-1.2 -20.2 1 -18.2 1.8 -15.6C4.6 -14.6 8.6 -12 11 -8.2C11.6 -7 11.4 -5.6 10.4 -5C7.6 -2.4 4.4 -1.2 1 -1.2C-4.4 -1.2 -8.6 -4 -9.8 -8.4C-10.2 -10 -10.6 -12 -10.4 -14Z'
  const belly = 'M-9.8 -8.4C-8.6 -4 -4.4 -1.2 1 -1.2C4.4 -1.2 7.6 -2.4 10.4 -5C7 -5.6 3 -6.4 -1 -8.4C-4 -10 -6.6 -11.6 -10.2 -12.4Z'
  const wing = 'M-3 -13.4C1.6 -14.8 7.4 -12.6 10.8 -8.8L16.4 -5.4C11.6 -4.6 6 -4.6 2 -5.6C-1.6 -6.4 -3.8 -8.8 -3.8 -11.2C-3.8 -12.2 -3.4 -13 -3 -13.4Z'
  const tail = 'M8.6 -8.8L20 -6.6C20.8 -6.4 20.8 -5 20 -4.8L9 -4.2Z'
  const cap = 'M-10 -16C-9.2 -18.8 -7 -20.2 -4.4 -20.2C-1.6 -20.2 .6 -18.6 1.6 -16C-1 -16.8 -4 -17.2 -6.4 -17C-7.8 -16.8 -9 -16.4 -10 -16Z'
  const bib = 'M-10.2 -12.6C-9.6 -9.8 -8 -8 -5.8 -7.4C-6 -9.4 -7 -11.2 -8.6 -12.6Z'
  const billC = o.sing
    ? `M-10.2 -15.8L-14.6 -17.4L-10 -14.4ZM-10.2 -13.8L-14 -13.2L-10 -12.6Z`
    : o.thin ? 'M-10.2 -15.4C-12.6 -15.2 -15 -14.4 -17 -13.2C-15 -13.2 -12.6 -12.9 -10.2 -12.9Z' : 'M-10 -15.9C-11.8 -15.6 -13.6 -14.8 -14.4 -14C-13.6 -13.4 -11.8 -12.8 -10 -12.6Z'
  const streaks = o.streaks ? Array.from({ length: 7 }, (_, i) => hair(-1 + i * 2, -12.6 + (i % 2) * 1.6 + i * 0.5, 0.4 + i * 2, -11 + i * 0.5, 2 + i * 2, -9.6 + (i % 2) * 1.2 + i * 0.5, 0.55, o.streaks!)).join('') : ''
  return (
    legs(-1.6, 1.4, -L - 0.6, o.leg) +
    `<g transform="translate(0 ${-L})">` +
    k.draw([
      { d: tail, fill: o.tail, inner: k.sh(tail, 0, 0, 0, 1, 0, 0.8, o.dark, 0.4) + `<path d="M10 -6.6L19.6 -5.8" stroke="${o.dark}" stroke-width=".35"/>` },
      {
        d: body, fill: o.back,
        inner: `<path d="${belly}" fill="${o.belly}"/>` + k.sh(body, 0, 0, 1, 1, 0, 0.75, o.dark, 0.4) + `<path d="M-11 -21H-4V-8H-11Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` +
          (o.cap ? `<path d="${cap}" fill="${o.cap}"/>` : '') + (o.bib ? `<path d="${bib}" fill="${o.bib}"/>` : '') + (o.cheek ? `<path d="${ellipse(-5.4, -13.2, 2.8, 1.9)}" fill="${o.cheek}"/>` : '') +
          (o.brow ? hair(-9.6, -17.2, -6, -18.4, -1.6, -17, 0.75, o.brow) : '') +
          hair(-8.4, -6, -4, -3, 2, -2.6, 0.45, o.dark, 0.5) + hair(-9, -10, -7, -6.4, -3.6, -5.2, 0.4, o.dark, 0.4),
      },
      {
        d: wing, fill: o.wing,
        inner: k.sh(wing, 0, 0, 1, 1, 0, 0.8, o.dark, 0.45) + streaks +
          `<path d="M-2 -11.6C1.6 -12.6 5 -11.8 7.8 -10" fill="none" stroke="${o.belly}" stroke-width=".7" opacity=".9"/>` +
          hair(4, -7.4, 9, -6.6, 15.6, -5.6, 0.45, o.dark) + hair(5, -9, 10, -7.8, 15, -6.2, 0.4, o.dark) + hair(1, -6.4, 5, -6, 9, -5.6, 0.35, o.dark, 0.7),
      },
    ], 0.55) +
    k.draw([{ d: billC, fill: o.bill, inner: k.sh(billC, 0, 0, 0, 1, 0, 0.7, o.dark, 0.3) }], 0.3) +
    eye(-6.6, -15.6, 1.05, o.iris ?? '#2A1A10', o.ring ?? '') +
    `</g>`
  )
}

/** Gorrión macho: corona gris, nuca castaña, mejilla blanca y babero negro. */
const SPARROW: Plumage = { back: CASTA, dark: CASTA_D, belly: '#D9D6CC', wing: '#B27A46', tail: '#7A5232', bill: '#3A3030', leg: '#C99A7A', cap: GRIS, cheek: '#F2EEE6', bib: '#2A2626', streaks: '#3C2414' }
/** Hornero: rufo arriba, ante abajo, pico fino y una ceja clara. */
const HORNERO = (sing = false): Plumage => ({ back: RUFO, dark: RUFO_D, belly: ANTE, wing: '#A8683A', tail: '#C4682E', bill: '#6E5A48', leg: '#6A584C', brow: '#F6E7CC', thin: !sing, sing, leg0: 4.2, iris: '#5A3A20' })
/** Canario: amarillo entero, con el ala apenas más oscura. */
const CANARY = (sing = false): Plumage => ({ back: CANARIO, dark: CANARIO_D, belly: '#FBE68A', wing: '#EBC23A', tail: '#E2B22C', bill: '#EBB79C', leg: '#E2A894', sing })

/** Paloma de plaza de perfil, mirando a la izquierda, con las patas en (0,0); `peck` la pone a picotear. */
function pigeon(k: Kit, peck = false) {
  const body = 'M-8.6 -15.6C-8.6 -18 -6.8 -19.6 -4.6 -19.6C-2.4 -19.6 -.8 -18 -.4 -15.8C1.4 -13.6 4.6 -12.6 8.4 -12C12.4 -11.2 15.6 -9.6 17.6 -7.8L20.4 -6.4C20.8 -6 20.6 -5.2 20 -5.2L14.6 -5C11.6 -2.4 7 -.8 2.4 -.8C-3.4 -.8 -7.2 -3.6 -8 -7.6C-8.4 -10 -8.2 -11.8 -7.6 -13.2C-8.2 -13.8 -8.6 -14.6 -8.6 -15.6Z'
  const neck = 'M-7.6 -13.2C-5.6 -10.6 -2.4 -9.4 .4 -9.6C-.6 -11.6 -.8 -13.8 -.4 -15.8C-2.6 -14.6 -5.4 -13.8 -7.6 -13.2Z'
  const wing = 'M-.6 -13C3.4 -13.8 8.4 -12.6 12.4 -10.8L20 -6.8C15.6 -5.8 9.6 -5.2 5 -5.6C1.2 -6 -1.6 -8.4 -1.8 -10.8Z'
  const bill = 'M-8.4 -16.6L-11.8 -15.6L-8.4 -15Z'
  return (
    legs(-1, 2.2, -1.4, '#D9655A') +
    `<g${peck ? ' transform="rotate(-24 0 -2)"' : ''}>` +
    k.draw([
      {
        d: body, fill: PALOMA,
        inner: k.sh(body, 0, 0, 1, 1, 0, 0.8, PALOMA_D, 0.45) + `<path d="${neck}" fill="${W}"/><path d="${neck}" fill="${k.lin('#8A5CB0', 0, 0, 1, 1, 0.9, 0)}"/>` +
          `<path d="M-9 -20H-3V-9H-9Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.3, 0)}"/>` + `<path d="M15 -8.4L20.4 -6.2L20 -5.2L14.6 -5Z" fill="#3C4256"/>`,
      },
      { d: wing, fill: PALOMA_L, inner: k.sh(wing, 0, 0, 1, 1, 0, 0.75, PALOMA_D, 0.45) + `<path d="M4 -9.4C7 -9.6 10 -8.8 12.6 -7.6M5.4 -7.4C8.4 -7.4 11.4 -6.8 14 -6" fill="none" stroke="#3C4256" stroke-width=".9" stroke-linecap="round"/>` + hair(12, -8.6, 16, -7, 19.4, -6.6, 0.45, PALOMA_D) },
    ], 0.55) +
    k.draw([{ d: bill, fill: '#3E3A40' }], 0.25) + `<ellipse cx="-8.2" cy="-16.6" rx=".9" ry=".6" fill="#F0ECE4"/>` +
    eye(-5.4, -16.4, 0.9, '#E8762A') +
    `</g>`
  )
}

/** Huevo entintado de un color pastel, centrado en (x, y), girado `r`, con pintitas si se pide. */
function egg(k: Kit, x: number, y: number, rx: number, ry: number, c: string, r = 0, spots = false, w = 0.4) {
  const d = `M${x} ${f(y - ry)}C${f(x + rx * 1.1)} ${f(y - ry)} ${f(x + rx)} ${f(y + ry)} ${x} ${f(y + ry)}C${f(x - rx)} ${f(y + ry)} ${f(x - rx * 1.1)} ${f(y - ry)} ${x} ${f(y - ry)}Z`
  return `<g transform="rotate(${r} ${x} ${y})">` +
    k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 1, 1, 0, 0.6, '#7C7C90', 0.3) + (spots ? [[-0.3, -0.2], [0.35, 0.1], [-0.1, 0.45], [0.2, -0.5]].map(([a, b]) => `<circle cx="${f(x + a * rx)}" cy="${f(y + b * ry)}" r="${f(rx * 0.12)}" fill="${MUD_D}" opacity=".7"/>`).join('') : '') }], w) +
    `<ellipse cx="${f(x - rx * 0.35)}" cy="${f(y - ry * 0.4)}" rx="${f(rx * 0.25)}" ry="${f(ry * 0.18)}" fill="#fff" opacity=".85" transform="rotate(-30 ${f(x - rx * 0.35)} ${f(y - ry * 0.4)})"/>` +
    `</g>`
}

/** Pluma suelta (como las del ala), con la base en (0,0) y la punta hacia +x. */
function feather(k: Kit, L: number, w: number, c: string, dark: string, quill = P.goldD) {
  const d = `M0 ${f(-w * 0.5)}C${f(L * 0.3)} ${f(-w * 1.05)} ${f(L * 0.8)} ${f(-w)} ${f(L)} 0C${f(L * 0.8)} ${f(w * 0.85)} ${f(L * 0.3)} ${f(w * 0.95)} 0 ${f(w * 0.5)}Z`
  const barbs = Array.from({ length: Math.max(2, Math.round(L / 3.2)) }, (_, i) => {
    const t = (i + 1) / (Math.round(L / 3.2) + 1), x = L * t
    return `M${f(x)} 0L${f(x + w * 0.5)} ${f(-w * 0.7)}M${f(x)} 0L${f(x + w * 0.5)} ${f(w * 0.6)}`
  }).join('')
  return k.draw([{ d, fill: c, inner: k.sh(d, 0, 0, 0, 1, 0, 0.75, dark, 0.4) + `<path d="${barbs}" stroke="${dark}" stroke-width=".3" opacity=".6"/>` + `<path d="M0 0Q${f(L * 0.5)} ${f(-w * 0.12)} ${f(L * 0.96)} 0" fill="none" stroke="${quill}" stroke-width="${f(Math.max(0.3, w * 0.12))}"/>` }], 0.4)
}

export const WINGSPAN_NUEVAS_ART: Record<string, (u: number) => string> = {
  // ── Ornitólogo ─────────────────────────────────────────────────────

  // Setenta puntos: los binoculares, con un gorrión posado arriba y el cielo en las lentes.
  'Binoculares': (u) => {
    const k = kit(u)
    const ARMOR = '#33402A', ARMOR_L = '#5C6E48'
    const house = (x0: number, x1: number) => `M${x0 + 3} 48C${x0} 50 ${x0 - 1} 56 ${x0 - 1} 62L${x0} 72H${x1}V52C${x1} 49 ${x1 - 2} 47 ${x1 - 5} 47Z`
    const lensSet = (cx: number, cy: number) => {
      const armor = ellipse(cx, cy, 12, 12), ring = ellipse(cx, cy, 9.8, 9.8), glass = ellipse(cx, cy, 8.2, 8.2)
      return k.draw([
        { d: armor, fill: ARMOR, inner: k.sh(armor, 0, 0, 1, 1, 0, 0.85, '#000', 0.45) + Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * 10.9)}" cy="${f(cy + Math.sin(a) * 10.9)}" r=".35" fill="${ARMOR_L}"/>` }).join('') },
        { d: ring, fill: '#C9CFDA', inner: k.sh(ring, 0, 0, 1, 1, 0, 0.9, P.mid, 0.45) },
        {
          d: glass, fill: P.sky,
          inner: `<path d="${glass}" fill="${k.lin(P.sky1, 0, 0, 0, 1, 1, 0)}"/>` + k.shade(glass, k.rad(W, 0.6, 0.75, 0.5, 0.6, 0), W, 0.3) +
            `<path d="M${cx - 6} ${cy + 3.4}Q${cx} ${cy + 1} ${cx + 6} ${cy + 3.6}V${cy + 9}H${cx - 6}Z" fill="${W_D}" opacity=".5"/>` +
            `<path d="M${f(cx - 5.4)} ${f(cy - 2.6)}A6 6 0 0 1 ${f(cx - 1.6)} ${f(cy - 5.8)}" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>`,
        },
      ], 0.7) + `<circle cx="${f(cx + 3.6)}" cy="${f(cy + 3.4)}" r=".9" fill="#fff" opacity=".8"/>`
    }
    const cup = (x: number) => roundRect(x - 5.4, 37.6, x + 5.4, 47.4, 2.4)
    return (
      field(k) +
      stageW(k, 60, 60, 34) +
      k.floor(60, 88, 28, 3) +
      cord_('M35.6 58C28 64 27 78 32 90', W_D, 1.8, W_L) +
      k.draw([
        { d: house(36, 58), fill: ARMOR, inner: k.sh(house(36, 58), 0, 0, 1, 0, 0, 0.6, '#000', 0.4) + `<path d="M38 52C40 50 44 49 48 49" fill="none" stroke="${ARMOR_L}" stroke-width=".9" stroke-linecap="round"/>` },
        { d: house(62, 84).replace(/(\d+\.?\d*) /g, (m) => m), fill: ARMOR, inner: k.sh(house(62, 84), 0, 0, 1, 0, 0.2, 0.9, '#000', 0.45) },
        { d: cup(50.4), fill: '#22291C', inner: k.sh(cup(50.4), 0, 0, 1, 0, 0, 0.8, '#000', 0.4) + `<path d="M45.6 40H55.2M45.6 42.4H55.2" stroke="${ARMOR_L}" stroke-width=".4"/>` },
        { d: cup(69.6), fill: '#22291C', inner: k.sh(cup(69.6), 0, 0, 1, 0, 0, 0.8, '#000', 0.4) + `<path d="M64.8 40H74.4M64.8 42.4H74.4" stroke="${ARMOR_L}" stroke-width=".4"/>` },
        { d: roundRect(56.2, 48, 63.8, 80, 3.4), fill: '#C9CFDA', inner: k.sh(roundRect(56.2, 48, 63.8, 80, 3.4), 0, 0, 1, 0, 0, 0.9, P.mid, 0.45) + [54, 60, 66, 72].map((y) => `<path d="M56.2 ${y}H63.8" stroke="${P.mid}" stroke-width=".4"/>`).join('') },
      ], 0.7) +
      lensSet(45.4, 72) + lensSet(74.6, 72) +
      k.draw([{ d: roundRect(54.4, 43, 65.6, 48.6, 2.4), fill: W, inner: k.sh(roundRect(54.4, 43, 65.6, 48.6, 2.4), 0, 0, 1, 0, 0, 0.8, W_D, 0.45) + Array.from({ length: 8 }, (_, i) => `<path d="M${f(55.6 + i * 1.3)} 43V48.6" stroke="${W_D}" stroke-width=".45"/>`).join('') }], 0.5) +
      `<g transform="translate(59 43.4) scale(.84)">` + songbird(k, SPARROW) + `</g>` +
      sparkle(32, 44, 2) + sparkle(88, 44, 1.6) +
      k.defs()
    )
  },

  // Noventa puntos: la libretita de campo abierta, con el gorrión dibujado, el lápiz y una pluma.
  'Guía de campo': (u) => {
    const k = kit(u)
    const cover = 'M28 44C38 41 52 41 60 44C68 41 82 41 92 44L94 88C84 85 68 85 60 88C52 85 36 85 26 88Z'
    const pageL = 'M30 43C40 40.4 52 40.4 60 43.4V86C52 83 40 83 28.6 85.6Z', pageR = 'M60 43.4C68 40.4 80 40.4 90 43L91.4 85.6C80 83 68 83 60 86Z'
    const lines = Array.from({ length: 8 }, (_, i) => { const y = 50 + i * 4.2; return `<path d="M64 ${f(y)}Q75 ${f(y - 1.2)} 87 ${f(y + 0.2)}" fill="none" stroke="${P.sky2}" stroke-width=".35"/>` }).join('')
    const writing = Array.from({ length: 6 }, (_, i) => {
      const y = 49.4 + i * 4.2, w = [18, 14, 20, 12, 17, 9][i]
      let d = `M65 ${f(y)}`
      for (let x = 65; x < 65 + w; x += 1.6) d += `q.4 -${f(0.9 + rnd(i * 10 + x) * 0.8)} .8 0t.8 0`
      return `<path d="${d}" fill="none" stroke="${P.mid}" stroke-width=".35"/>`
    }).join('')
    const sketch = `<g transform="translate(45 74) scale(.95)">` + songbird(k, SPARROW) + `</g>` +
      `<path d="M33 76.6H57" stroke="#4A4E5C" stroke-width=".35"/><path d="M33 75.6V77.6M57 75.6V77.6" stroke="#4A4E5C" stroke-width=".35"/>` +
      `<text x="45" y="49.6" ${GEORGIA} font-weight="700" font-size="3" fill="${W_D}" text-anchor="middle" letter-spacing=".3">Lám. XII</text>`
    const pencil = `<g transform="translate(66 80) rotate(-28)">` +
      k.draw([
        { d: 'M0 -1.8H24V1.8H0Z', fill: W, inner: k.sh('M0 -1.8H24V1.8H0Z', 0, 0, 0, 1, 0, 0.8, W_D, 0.45) + `<path d="M0 -.6H24" stroke="${W_L}" stroke-width=".5"/>` },
        { d: 'M24 -1.8H27.6V1.8H24Z', fill: P.gold, inner: `<path d="M25 -1.8V1.8M26.4 -1.8V1.8" stroke="${P.goldD}" stroke-width=".4"/>` },
        { d: roundRect(27.6, -1.8, 31, 1.8, 0.8), fill: '#E88E9E' },
        { d: 'M0 -1.8L-5 0L0 1.8Z', fill: STRAW },
      ], 0.5) + `<path d="M-3.4 -.6L-5 0L-3.4 .6Z" fill="#3A3A44"/></g>`
    return (
      field(k) +
      k.sun(60, 58, 16, 47, 32, false) +
      glow(k, 60, 60, 30, 26, 0.6) +
      k.floor(60, 89, 34, 3) +
      `<g transform="translate(63 46) rotate(-64)">` + feather(k, 22, 3.4, P.white, P.blue) + `</g>` +
      k.draw([{ d: cover, fill: W_D, inner: k.sh(cover, 0, 0, 1, 1, 0, 0.6, '#1E3208', 0.4) }], 0.7) +
      k.draw([
        { d: pageL, fill: P.white, inner: k.sh('M52 40H60V88H52Z', 0, 0, 1, 0, 0, 0.4, P.blue, 0.3) + `<path d="M28 40H40V88H28Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.4, 0)}"/>` },
        { d: pageR, fill: P.white, inner: k.sh('M60 40H68V88H60Z', 0, 0, 1, 0, 0.4, 0, P.blue, 0.3) + lines },
      ], 0.5) +
      `<path d="M60 43.4V86" stroke="${P.ink}" stroke-width=".7"/>` +
      sketch +
      `<text x="45" y="81.4" ${GEORGIA} font-style="italic" font-size="2.7" fill="#4A4E5C" text-anchor="middle">Passer domesticus</text>` +
      writing +
      `<path d="M78 49.6l1.2 1.4l2.6 -3" fill="none" stroke="${W_D}" stroke-width=".7" stroke-linecap="round"/>` +
      pencil +
      sparkle(86, 34, 2.2) + sparkle(30, 34, 1.6) +
      k.defs()
    )
  },

  // Ciento diez puntos: las alas del hombre pájaro, de plumas y cera, con dos pájaros que se le posan encima.
  'Hombre pájaro': (u) => {
    const k = kit(u)
    // Un ala izquierda (la derecha es su espejo): bastidor de madera arriba, cobertoras doradas, secundarias y primarias.
    const S = [56, 52], Cc = [42, 38], T = [32, 41]
    const lead = (t: number) => ({
      x: (1 - t) ** 2 * S[0] + 2 * t * (1 - t) * Cc[0] + t * t * T[0],
      y: (1 - t) ** 2 * S[1] + 2 * t * (1 - t) * Cc[1] + t * t * T[1],
    })
    const wingSide = () => {
      let prim = '', sec = '', cov = '', cov2 = ''
      for (let i = 0; i < 7; i++) {
        const t = 1 - i * 0.075, p = lead(t), a = 136 - i * 5.4, L = 15.4 + i * 1.3
        prim += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(a)})">` + feather(k, L, 4.2, P.white, P.sky2, P.goldD) + `</g>`
      }
      for (let i = 0; i < 6; i++) {
        const t = 0.46 - i * 0.08, p = lead(t), a = 102 - i * 2.4, L = 19.6 - i * 1.2
        sec += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(a)})">` + feather(k, L, 4, '#F6F2E8', P.sky2, P.goldD) + `</g>`
      }
      for (let i = 0; i < 9; i++) {
        const t = 0.06 + i * 0.105, p = lead(t)
        cov += `<g transform="translate(${f(p.x)} ${f(p.y + 0.8)}) rotate(${f(100 + i * 4.6)})">` + feather(k, 9.4, 3.4, P.white, P.sky2, P.goldD) + `</g>`
        cov2 += `<g transform="translate(${f(p.x)} ${f(p.y - 0.2)}) rotate(${f(104 + i * 4.6)})">` + feather(k, 5.6, 2.6, P.gold, P.goldD, P.goldD) + `</g>`
      }
      const bar = `M${S[0]} ${S[1]}Q${Cc[0]} ${Cc[1]} ${T[0]} ${T[1]}`
      const drips = [0.18, 0.4, 0.62, 0.84].map((t) => { const p = lead(t); return `<path d="M${f(p.x - 0.8)} ${f(p.y + 0.6)}C${f(p.x - 1)} ${f(p.y + 2.8)} ${f(p.x + 1)} ${f(p.y + 3.2)} ${f(p.x + 0.8)} ${f(p.y + 0.6)}Z" fill="${P.goldL}" stroke="${P.goldD}" stroke-width=".3"/>` }).join('')
      return prim + sec + cov + cov2 +
        `<path d="${bar}" fill="none" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/><path d="${bar}" fill="none" stroke="${WOOD}" stroke-width="1.6" stroke-linecap="round"/><path d="${bar}" fill="none" stroke="${STRAW}" stroke-width=".45" stroke-linecap="round" transform="translate(-.2 -.4)"/>` + drips +
        `<circle cx="${T[0]}" cy="${T[1]}" r="1.3" fill="${P.gold}" stroke="${P.ink}" stroke-width=".45"/>`
    }
    const harness = 'M55.6 46.4H64.4L65 63.6C62 65 58 65 55 63.6Z'
    const straps = 'M56 50L50 48M64 50L70 48M55.6 59.6L50.6 61.6M64.4 59.6L69.4 61.6'
    return (
      field(k) +
      k.sun(60, 54, 14, 48, 32, false) +
      glow(k, 60, 56, 30, 30, 0.75) +
      laurel(50, 100, 34, 95, 30, 76, 6) + laurel(70, 100, 86, 95, 90, 76, 6, true) +
      `<g transform="translate(0 4)">` +
      `<g transform="translate(60 50) scale(1.1) translate(-60 -50)">` + wingSide() + `<g transform="translate(120 0) scale(-1 1)">` + wingSide() + `</g></g>` +
      `<path d="${straps}" stroke="${P.ink}" stroke-width="2.6" stroke-linecap="round"/><path d="${straps}" stroke="${WOOD_D}" stroke-width="1.4" stroke-linecap="round"/>` +
      k.draw([{ d: harness, fill: WOOD_D, inner: k.sh(harness, 0, 0, 1, 1, 0, 0.8, '#3A2410', 0.45) + `<path d="M56.6 48V62.6M63.4 48V62.6" fill="none" stroke="${MUD_L}" stroke-width=".45" stroke-dasharray="1 .8"/>` }], 0.6) +
      k.draw([{ d: ellipse(60, 54.6, 4.4, 4.4), fill: P.gold, inner: k.sh(ellipse(60, 54.6, 4.4, 4.4), 0, 0, 1, 1, 0, 0.9, P.goldD, 0.45) + `<circle cx="60" cy="54.6" r="2.6" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` }], 0.45) +
      `<path d="M57.6 56.8C58.6 53.6 61 52.6 62.6 52.4C61.6 53.4 61.4 55 60.2 56.4Z" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<g transform="translate(44 43.4) rotate(-12) scale(.56)">` + pigeon(k) + `</g>` +
      `<g transform="translate(77 42.6) rotate(10) scale(.54)">` + songbird(k, HORNERO()) + `</g>` +
      `</g>` +
      sparkle(60, 26, 2.6, '#fff') + sparkle(30, 78, 1.6) + sparkle(90, 78, 1.6) +
      k.defs()
    )
  },

  // ── Gallinero ──────────────────────────────────────────────────────

  // Diez huevos: el hornero canta arriba de su casita de barro, sobre el poste del alambrado.
  'Nido de hornero': (u) => {
    const k = kit(u)
    const post = 'M50.4 68H61.6V104H50.4Z'
    const nest = 'M33.6 70C33 55 42.6 42.4 57 42.4C71.4 42.4 81.6 54 81 70C70 72.6 45 72.6 33.6 70Z'
    const door = 'M40.6 69.6V62C40.6 57.6 43.4 55 46.6 55C49.8 55 52.4 57.6 52.4 62V70.4C48.4 70.6 44.4 70.4 40.6 69.6Z'
    const lumps = Array.from({ length: 22 }, (_, i) => {
      const a = Math.PI * (1.05 + rnd(i) * 0.9), r = 6 + rnd(i + 5) * 16, x = 57 + Math.cos(a) * r * 1.1, y = 70 + Math.sin(a) * r * 0.95
      return y < 68 && y > 44 ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(1 + rnd(i * 3) * 1.6)}" ry="${f(0.7 + rnd(i * 7) * 0.9)}" fill="${i % 3 ? MUD_D : MUD_L}" opacity=".55"/>` : ''
    }).join('')
    const straws = Array.from({ length: 10 }, (_, i) => {
      const x = 38 + rnd(i * 2) * 40, y = 48 + rnd(i * 9) * 18, a = rnd(i * 4) * 3 - 1.5
      return y > 47 + Math.abs(x - 57) * 0.4 ? `<path d="M${f(x)} ${f(y)}l${f(3 * Math.cos(a))} ${f(3 * Math.sin(a))}" stroke="${STRAW}" stroke-width=".55" stroke-linecap="round"/>` : ''
    }).join('')
    return (
      field(k) +
      k.sun(58, 50, 14, 46) +
      glow(k, 58, 50, 26, 26, 0.6) +
      `<path d="M14 84Q36 82 50.4 84M61.6 84Q84 82 106 84" fill="none" stroke="${P.ink}" stroke-width="1"/><path d="M14 84Q36 82 50.4 84M61.6 84Q84 82 106 84" fill="none" stroke="${P.sky1}" stroke-width=".4"/>` +
      [28, 40, 74, 88].map((x) => `<path d="M${x - 1.2} ${f(82.4)}l2.4 2.4M${x + 1.2} 82.4l-2.4 2.4" stroke="${P.ink}" stroke-width=".55"/>`).join('') +
      k.draw([{ d: post, fill: WOOD, inner: k.sh(post, 0, 0, 1, 0, 0, 0.85, WOOD_D, 0.45) + hair(53, 72, 52.4, 86, 53.4, 102, 0.5, WOOD_D) + hair(57, 74, 57.8, 88, 56.8, 102, 0.45, WOOD_D) + `<ellipse cx="55" cy="90" rx="1.2" ry="2" fill="${WOOD_D}" opacity=".6"/>` }], 0.7) +
      k.floor(57, 71, 26, 2.4, MUD_D) +
      k.draw([{
        d: nest, fill: MUD,
        inner: k.sh(nest, 0, 0, 1, 1, 0, 0.9, MUD_D, 0.5) + `<path d="M34 40H46V72H34Z" fill="${k.lin(MUD_L, 0, 0, 1, 0, 0.6, 0)}"/>` + lumps + straws +
          hair(52, 46, 60, 45, 68, 47, 0.6, MUD_D, 0.6) + hair(40, 56, 41, 50, 46, 46, 0.5, MUD_L, 0.8) + hair(76, 52, 79, 58, 79.6, 66, 0.55, MUD_D, 0.7) + hair(60, 58, 66, 57, 72, 59, 0.45, MUD_D, 0.6),
      }], 0.8) +
      k.draw([{ d: door, fill: '#2A1A0E', inner: k.sh(door, 0, 0, 1, 0, 0.3, 0, MUD_D, 0.3) + `<path d="M42 70C42 64 44 58.4 46.6 57.4" fill="none" stroke="${MUD_L}" stroke-width=".6" opacity=".6"/>` }], 0.6) +
      `<path d="M39.4 70V62C39.4 57 42.6 53.6 46.6 53.6C50.6 53.6 53.6 57 53.6 62V70.6" fill="none" stroke="${MUD_L}" stroke-width="1.1"/>` +
      `<g transform="translate(62 43.6) rotate(-6) scale(.95)">` + songbird(k, HORNERO(true)) + `</g>` +
      hair(44, 30, 42.4, 27, 44, 24, 0.55, P.goldD) + hair(48.4, 28.4, 48, 25, 50, 22.6, 0.45, P.goldD) +
      sparkle(88, 40, 2) + sparkle(30, 60, 1.5) +
      k.defs()
    )
  },

  // Dieciocho huevos: el maple de cartón lleno, con los huevos de colores del juego.
  'Maple de huevos': (u) => {
    const k = kit(u)
    const PULP = '#CFC8B8', PULP_D = '#958C78', PULP_L = '#E9E4D8'
    const C = 0.866, ox = 49.6, oy = 40, s = 8
    const pt = (x: number, y: number, z = 0) => [ox + (x - y) * C * s, oy + (x + y) * 0.5 * s - z]
    const P2 = (x: number, y: number, z = 0) => pt(x, y, z).map(f).join(' ')
    const nx = 6, ny = 3, hz = 5
    const top = `M${P2(0, 0)}L${P2(nx, 0)}L${P2(nx, ny)}L${P2(0, ny)}Z`
    const right = `M${P2(nx, 0)}L${P2(nx, ny)}L${P2(nx, ny, -hz)}L${P2(nx, 0, -hz)}Z`
    const left = `M${P2(0, ny)}L${P2(nx, ny)}L${P2(nx, ny, -hz)}L${P2(0, ny, -hz)}Z`
    let cups = '', eggs = ''
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const [x, y] = pt(i + 0.5, j + 0.5)
      cups += `<ellipse cx="${f(x)}" cy="${f(y + 0.6)}" rx="${f(s * 0.62)}" ry="${f(s * 0.36)}" fill="${PULP_D}"/>`
    }
    const peaks = Array.from({ length: (nx - 1) * (ny - 1) }, (_, q) => { const i = (q % (nx - 1)) + 1, j = Math.floor(q / (nx - 1)) + 1, [x, y] = pt(i, j); return `<path d="M${f(x - 1.6)} ${f(y + 0.4)}L${f(x)} ${f(y - 2.4)}L${f(x + 1.6)} ${f(y + 0.4)}Z" fill="${PULP_L}" stroke="${PULP_D}" stroke-width=".3"/>` }).join('')
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const [x, y] = pt(i + 0.5, j + 0.5), c = EGGS[(i * 2 + j * 3) % EGGS.length]
      if (i === nx - 1 && j === ny - 1) {
        // El huevo roto de la tortilla: media cáscara con la yema.
        const shell = `M${f(x - 3.6)} ${f(y - 1.4)}L${f(x - 2.4)} ${f(y - 2.6)}L${f(x - 1.2)} ${f(y - 1.6)}L${f(x)} ${f(y - 2.8)}L${f(x + 1.2)} ${f(y - 1.6)}L${f(x + 2.4)} ${f(y - 2.6)}L${f(x + 3.6)} ${f(y - 1.4)}C${f(x + 3.6)} ${f(y + 1.6)} ${f(x + 2)} ${f(y + 2.8)} ${x} ${f(y + 2.8)}C${f(x - 2)} ${f(y + 2.8)} ${f(x - 3.6)} ${f(y + 1.6)} ${f(x - 3.6)} ${f(y - 1.4)}Z`
        eggs += k.draw([{ d: shell, fill: EGGS[5], inner: k.sh(shell, 0, 0, 1, 1, 0, 0.6, '#7C7C90', 0.3) }], 0.4) +
          `<ellipse cx="${x}" cy="${f(y - 1.6)}" rx="3" ry="1.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".35"/><circle cx="${f(x - 0.3)}" cy="${f(y - 1.8)}" r="1.4" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".35"/><circle cx="${f(x - 0.8)}" cy="${f(y - 2.3)}" r=".4" fill="#fff"/>`
        continue
      }
      eggs += egg(k, f(x), f(y - 3), 3.2, 4.2, c, -8 + ((i + j) % 3) * 8, (i + j) % 4 === 1, 0.4)
    }
    return (
      field(k) +
      stageW(k, 60, 60, 34) +
      k.floor(60, 84, 34, 3.4) +
      k.draw([
        { d: right, fill: PULP_D, inner: k.sh(right, 0, 0, 1, 0, 0, 0.6, '#5E5646', 0.4) + Array.from({ length: ny }, (_, j) => { const [x, y] = pt(nx, j + 0.5, -hz * 0.5); return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.6" ry="1.4" fill="${PULP}" opacity=".6"/>` }).join('') },
        { d: left, fill: PULP, inner: k.sh(left, 0, 0, 0, 1, 0, 0.5, PULP_D, 0.3) + Array.from({ length: nx }, (_, i) => { const [x, y] = pt(i + 0.5, ny, -hz * 0.5); return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="2.2" ry="1.4" fill="${PULP_D}" opacity=".45"/>` }).join('') },
        { d: top, fill: PULP_L, inner: k.sh(top, 0, 0, 1, 1, 0, 0.5, PULP_D, 0.3) + cups + peaks },
      ], 0.7) +
      eggs +
      `<path d="M${P2(0, ny, -hz)}L${P2(nx, ny, -hz)}L${P2(nx, 0, -hz)}" fill="none" stroke="${PULP_D}" stroke-width=".4" stroke-dasharray=".01 1.2" stroke-linecap="round"/>` +
      sparkle(32, 42, 2) + sparkle(88, 76, 1.6) +
      k.defs()
    )
  },

  // Veintiséis huevos: el gallo canta al sol arriba del cajón de la granja, lleno de huevos en la paja.
  'Granja avícola': (u) => {
    const k = kit(u)
    const crate = 'M37 72H83V90H37Z'
    const slats = [72, 78].map((y) => `<path d="M37 ${y + 6}H83" stroke="${WOOD_D}" stroke-width=".9"/>`).join('') + `<path d="M42 72V90M78 72V90" stroke="${WOOD_D}" stroke-width="1.4"/>`
    const nails = [[39.6, 75], [80.4, 75], [39.6, 81], [80.4, 81], [39.6, 87], [80.4, 87]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="${P.ink}"/>`).join('')
    const strawTop = Array.from({ length: 12 }, (_, i) => { const x = 38 + i * 3.8, a = rnd(i) * 1.4 - 0.7; return `<path d="M${f(x)} 72.6l${f(Math.cos(a - 1.2) * 4)} ${f(Math.sin(a - 1.2) * 4)}" stroke="${STRAW}" stroke-width=".8" stroke-linecap="round"/>` }).join('')
    // El gallo: cola de hoces verde negra, cuerpo rojizo, esclavina dorada, cresta y barbilla rojas, cantando arriba.
    const sickles = [[9, -22, 24, -48, 32, -18, 3.4], [9, -20, 22, -42, 28, -12, 3], [8, -18, 19, -34, 24, -8, 2.6], [10, -23, 30, -40, 34, -28, 2.4]]
      .map(([x0, y0, cx, cy, x1, y1, w]) => taper(x0, y0, cx, cy, x1, y1, w, 0.4))
    const body = 'M-6 -34C-6 -28 -10 -26 -12 -20C-13.4 -15 -11 -9 -5 -7C0 -5.4 8 -6 12 -10C15 -13.4 15 -19 12 -23C9 -26 4 -26.6 1 -28C-.6 -30 -1 -33 -1.2 -35Z'
    const hackle = 'M-7 -38C-8.4 -34 -9.6 -29 -9 -24L-7.6 -22.4L-6.4 -24L-5 -21.4L-3.6 -23.4L-2 -21L-.6 -23.4L1 -21.6L2 -24C4 -26 5 -29 4 -31C2.6 -34 1 -36.6 -1 -39Z'
    const wingD = 'M-4 -22C2 -24 9 -22 12.4 -17C10.4 -12 4 -9.6 -2 -10.6C-5 -12.6 -6 -18 -4 -22Z'
    const head = 'M-8.4 -40C-8.4 -43 -6 -44.6 -3.8 -44.6C-1.2 -44.6 .6 -42.6 .6 -40.2C.6 -37.8 -1.4 -36.2 -3.8 -36.2C-6.2 -36.2 -8.4 -37.6 -8.4 -40Z'
    const comb = 'M-7.8 -42.8C-8.8 -45.2 -8 -47 -6.6 -45.8C-6.6 -48.4 -5 -49.4 -4 -47.4C-3.4 -50 -1.4 -50.2 -1 -47.8C.2 -49.4 1.8 -48.6 1.2 -46.4C2.6 -46 2.4 -44.2 .8 -43C-1.6 -44.4 -5 -44.4 -7.8 -42.8Z'
    const wattle = 'M-7.6 -38.4C-8.8 -36 -8.2 -33.2 -6.6 -33.4C-5.2 -33.8 -5.4 -36.4 -6 -38.2Z'
    const rooster =
      `<g transform="translate(58 72) scale(.98)">` +
      k.draw(sickles.map((d, i) => ({ d, fill: i === 3 ? W_D : PLUMA_N, inner: k.sh(d, 0, 0, 1, 1, 0, 0.8, '#000', 0.4) + `<path d="${d}" fill="none" stroke="${W}" stroke-width=".5" opacity=".7" transform="translate(-.4 -.4)"/>` })), 0.55) +
      `<path d="M-1 -6.6L-1.6 0M5 -7L5.6 0" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/><path d="M-1 -6.6L-1.6 0M5 -7L5.6 0" stroke="${P.gold}" stroke-width="1.2" stroke-linecap="round"/>` +
      `<path d="M-1.6 0L-5 .4M-1.6 0L-4 1.6M-1.6 0L.8 .6M5.6 0L2.4 .4M5.6 0L3.4 1.6M5.6 0L8 .6M-1.2 -3L1 -3.6M5.2 -3.4L7.4 -4" stroke="${P.goldD}" stroke-width=".8" stroke-linecap="round"/>` +
      k.draw([
        {
          d: body, fill: GALLO,
          inner: k.sh(body, 0, 0, 1, 1, 0, 0.85, GALLO_D, 0.5) + `<path d="M-13 -24H-6V-6H-13Z" fill="${k.lin(P.goldL, 0, 0, 1, 0, 0.35, 0)}"/>` +
            `<path d="M-11 -14C-8 -9 -2 -7 4 -7.4C0 -10 -4 -12 -6 -16Z" fill="${PLUMA_N}" opacity=".85"/>` + hair(-10, -18, -9, -12, -5, -8.6, 0.5, GALLO_D) + hair(6, -24, 10, -21, 13, -17, 0.5, P.gold, 0.8),
        },
        { d: wingD, fill: GALLO_D, inner: k.sh(wingD, 0, 0, 1, 1, 0, 0.8, '#3A1206', 0.45) + `<path d="M-2 -14C2 -12.4 7 -12.6 11 -14.6" fill="none" stroke="${W_D}" stroke-width="1.6"/>` + hair(-3, -20, 3, -21, 10, -18, 0.5, P.gold, 0.8) + hair(-2, -17, 4, -17.6, 11, -15.6, 0.45, '#E2925A', 0.7) },
        { d: hackle, fill: P.gold, inner: k.sh(hackle, 0, 0, 1, 1, 0, 0.85, P.goldD, 0.45) + hair(-6, -36, -7, -30, -6.4, -24.6, 0.45, P.goldD) + hair(-3, -37, -3.6, -30, -3, -23.6, 0.45, P.goldD) + hair(0, -36.6, 0, -30, .6, -24, 0.45, P.goldD) + hair(-7.4, -35, -8, -30, -7.6, -25, 0.45, P.goldL) },
        { d: comb, fill: P.red, inner: k.sh(comb, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
        { d: head, fill: '#C25A2E', inner: k.sh(head, 0, 0, 1, 1, 0, 0.8, GALLO_D, 0.4) },
        { d: wattle, fill: P.red, inner: k.sh(wattle, 0, 0, 1, 1, 0, 0.8, P.wine, 0.4) },
      ], 0.6) +
      k.draw([{ d: 'M-8 -41.6L-13.4 -44.8L-8.2 -40Z', fill: P.goldL }, { d: 'M-8 -39.6L-12.4 -40L-7.6 -38.6Z', fill: P.gold }], 0.3) +
      `<ellipse cx="-2.4" cy="-38.8" rx="1.1" ry="1.4" fill="${P.white}" stroke="${P.ink}" stroke-width=".25"/>` +
      eye(-5, -41.4, 0.85, '#E8962A') +
      `</g>`
    return (
      field(k) +
      k.sun(60, 52, 14, 48, 32, false) +
      glow(k, 60, 50, 30, 30, 0.8) +
      laurel(48, 98, 30, 92, 27, 70, 6) + laurel(72, 98, 90, 92, 93, 70, 6, true) +
      k.floor(60, 91, 26, 2.4) +
      egg(k, 46.6, 69.4, 3.2, 4.2, EGGS[2], -14) + egg(k, 52.6, 68.8, 3.2, 4.2, EGGS[0], 8) + egg(k, 72.4, 68.8, 3.2, 4.2, EGGS[3], -6) + egg(k, 78.4, 69.6, 3, 4, EGGS[1], 14, true) + egg(k, 41.4, 70.4, 2.8, 3.8, EGGS[4], -20) +
      k.draw([{ d: crate, fill: WOOD, inner: k.sh(crate, 0, 0, 1, 1, 0, 0.8, WOOD_D, 0.45) + slats + hair(44, 75, 56, 74.4, 70, 75.4, 0.5, WOOD_D, 0.6) + hair(44, 88, 60, 87.4, 76, 88.4, 0.5, WOOD_D, 0.6) + nails }], 0.75) +
      strawTop +
      k.draw([{ d: roundRect(46, 77.6, 74, 86, 0.8), fill: P.paper, inner: k.sh(roundRect(46, 77.6, 74, 86, 0.8), 0, 0, 1, 1, 0, 0.5, WOOD_D, 0.3) }], 0.4) +
      `<text x="60" y="84" ${GEORGIA} font-weight="700" font-size="4.8" letter-spacing=".4" fill="${W_D}" text-anchor="middle">GRANJA</text>` +
      rooster +
      sparkle(32, 36, 2) + sparkle(90, 44, 1.6) +
      k.defs()
    )
  },

  // ── Pajarera ───────────────────────────────────────────────────────

  // Doce pájaros: la jaula dorada con el canario cantando en la hamaca.
  'Jaula con canario': (u) => {
    const k = kit(u)
    const cx = 60, top = 30, rx = 20, base = 86
    const bars = Array.from({ length: 9 }, (_, i) => {
      const t = (i + 0.5) / 9, x = cx - rx + t * rx * 2, dome = top + 10 - Math.sin(t * Math.PI) * 9.6
      return `M${f(x)} ${f(base)}V${f(dome + 4)}Q${f(cx + (x - cx) * 0.85)} ${f(dome - 2)} ${cx} ${top + 1}`
    }).join('')
    const hoops = [52, 66, 80].map((y) => `M${cx - rx} ${y}H${cx + rx}`).join('')
    const tray = 'M36.6 86H83.4L82 94H38Z'
    return (
      field(k) +
      stageW(k, 60, 62, 34) +
      k.floor(60, 95, 24, 2.6) +
      `<path d="M${cx} 30V24" stroke="${P.ink}" stroke-width="1.4"/>` +
      `<circle cx="${cx}" cy="21.4" r="3" fill="none" stroke="${P.ink}" stroke-width="1.8"/><circle cx="${cx}" cy="21.4" r="3" fill="none" stroke="${P.gold}" stroke-width=".8"/>` +
      `<path d="${bars}" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><path d="${bars}" fill="none" stroke="${P.gold}" stroke-width=".55" stroke-linecap="round"/>` +
      `<path d="M${cx} 64L52 76M${cx} 64L68 76" fill="none" stroke="${P.goldD}" stroke-width=".5"/>` +
      `<path d="M50 76H70" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/><path d="M50 76H70" stroke="${WOOD}" stroke-width="1" stroke-linecap="round"/>` +
      `<g transform="translate(61 75.4) scale(.82)">` + songbird(k, CANARY(true)) + `</g>` +
      k.draw([{ d: roundRect(70, 70, 76.6, 74.6, 1.4), fill: P.white, inner: `<path d="M70.6 71.2H76" stroke="${STRAW}" stroke-width="1.2"/>` }], 0.4) +
      `<path d="${hoops}" fill="none" stroke="${P.ink}" stroke-width="1.1"/><path d="${hoops}" fill="none" stroke="${P.goldL}" stroke-width=".45"/>` +
      `<path d="M${cx - rx} 40C${cx - rx} 30 ${cx - 10} 24 ${cx} 24C${cx + 10} 24 ${cx + rx} 30 ${cx + rx} 40" fill="none" stroke="${P.ink}" stroke-width="1.8"/><path d="M${cx - rx} 40C${cx - rx} 30 ${cx - 10} 24 ${cx} 24C${cx + 10} 24 ${cx + rx} 30 ${cx + rx} 40" fill="none" stroke="${P.gold}" stroke-width=".9"/>` +
      `<circle cx="${cx}" cy="24.6" r="2.2" fill="${P.gold}" stroke="${P.ink}" stroke-width=".5"/>` +
      k.draw([{ d: tray, fill: W, inner: k.sh(tray, 0, 0, 1, 0, 0, 0.85, W_D, 0.45) + `<path d="M38 88.4H82" stroke="${W_L}" stroke-width=".6"/><path d="M40 91.4H80" stroke="${P.gold}" stroke-width=".5" stroke-dasharray="1.2 1"/>` }], 0.6) +
      k.draw([{ d: roundRect(35, 84.4, 85, 87, 1), fill: P.gold, inner: k.sh(roundRect(35, 84.4, 85, 87, 1), 0, 0, 1, 0, 0, 0.8, P.goldD, 0.45) }], 0.45) +
      [[34, 50, -10, W_D], [86, 44, 12, W], [88, 62, -6, W_D]].map(([x, y, r, c]) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse cx="0" cy="0" rx="2" ry="1.5" transform="rotate(-20)" fill="${c}"/><path d="M1.8 -.4V-8.6C3.6 -7.6 5 -6.4 4.4 -4.4" fill="none" stroke="${c}" stroke-width=".7" stroke-linecap="round"/></g>`).join('') +
      sparkle(30, 70, 1.6) +
      k.defs()
    )
  },

  // Quince pájaros: la Pirámide de Mayo con una paloma en la punta, y otra que picotea las miguitas.
  'Plaza con palomas': (u) => {
    const k = kit(u)
    const STONE = P.white, STONE_D = P.sky2
    const steps = 'M42 90H78V93.6H42ZM44.6 86.6H75.4V90H44.6Z'
    const plinth = 'M48 74H72V86.6H48Z'
    const cornice = 'M46.6 71.8H73.4V74H46.6Z'
    const shaft = 'M52.4 71.8L55.4 40H64.6L67.6 71.8Z'
    const cap = 'M54.6 40H65.4L64.8 37.8H55.2Z'
    const tip = 'M56.4 37.8H63.6L60 33.6Z'
    const crumbs = [[30, 86], [34, 88.4], [27, 84.6], [88, 87], [92, 85], [84, 89], [32, 82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".9" ry=".55" fill="${STRAW}" stroke="${WOOD_D}" stroke-width=".25"/>`).join('')
    return (
      field(k) +
      k.sun(60, 50, 14, 46) +
      glow(k, 60, 52, 26, 30, 0.55) +
      k.floor(60, 93, 30, 2.6) +
      k.draw([
        { d: steps, fill: STONE, inner: k.sh(steps, 0, 0, 0, 1, 0, 0.6, STONE_D, 0.4) },
        { d: plinth, fill: STONE, inner: k.sh(plinth, 0, 0, 1, 0, 0, 0.75, P.blue, 0.4) + `<path d="${roundRect(50.4, 76.4, 69.6, 84.4, 0.6)}" fill="none" stroke="${STONE_D}" stroke-width=".6"/>` + `<circle cx="60" cy="80.4" r="2.6" fill="${P.gold}" stroke="${P.goldD}" stroke-width=".4"/>` + hair(50, 85.6, 60, 86, 70, 85.6, 0.4, P.blue, 0.6) },
        { d: cornice, fill: STONE, inner: k.sh(cornice, 0, 0, 1, 0, 0, 0.6, P.blue, 0.35) },
        { d: shaft, fill: STONE, inner: k.sh('M60 36H70V74H60Z', 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) + `<path d="M52 36H57V74H52Z" fill="${k.lin('#ffffff', 0, 0, 1, 0, 0.5, 0)}"/>` + `<path d="M60 42V70" stroke="${STONE_D}" stroke-width=".5"/>` + `<path d="M55.6 50H64.4M55.2 55.4H64.8" stroke="${STONE_D}" stroke-width=".4"/>` },
        { d: cap, fill: STONE, inner: k.sh(cap, 0, 0, 1, 0, 0, 0.7, P.blue, 0.4) },
        { d: tip, fill: STONE, inner: k.sh(tip, 0, 0, 1, 0, 0, 0.8, P.blue, 0.45) },
      ], 0.7) +
      `<path d="M58 62.6L60 59.6L62 62.6L60 65.6Z" fill="${P.sky}" stroke="${P.ink}" stroke-width=".35"/>` +
      `<g transform="translate(60.6 34.6) scale(.6)">` + pigeon(k) + `</g>` +
      crumbs +
      `<g transform="translate(32 86.4) scale(.74)">` + pigeon(k) + `</g>` +
      `<g transform="translate(88 86) scale(-.7 .7)">` + pigeon(k, true) + `</g>` +
      sparkle(32, 40, 1.8) + sparkle(88, 40, 2) +
      k.defs()
    )
  },

  // Dieciocho pájaros: el cisne de cuello negro nada en la laguna de la reserva, entre las cortaderas, y atrás la ciudad.
  'Reserva de Costanera': (u) => {
    const k = kit(u)
    const water = 'M0 70H120V130H0Z'
    const city = 'M22 70V60H27V54H31V62H35V48H39V44H42V48H45V60H49V52H53V70ZM67 70V56H71V40H74V36H77V40H80V58H84V50H88V62H92V54H96V70Z'
    const swanBody = 'M-6 -6C-2 -9.6 8 -10.4 16 -8.6C20.4 -7.6 23.4 -5.8 25.6 -8.8C27 -5.6 26 -2 21.6 0H-8C-9.2 -2 -8.4 -4.4 -6 -6Z'
    const neck = taper(-1.8, -7.8, -14, -14, -7.6, -26.8, 3.8, 2.2)
    const head = 'M-10.8 -27C-10.8 -29.2 -9.2 -30.6 -7.4 -30.6C-5.4 -30.6 -4.6 -29.2 -4.8 -27.4C-5 -25.6 -6.2 -24.8 -7.6 -24.8C-9.4 -24.8 -10.8 -25.6 -10.8 -27Z'
    const bill = 'M-10.6 -27.6C-13 -27.2 -15.4 -26.2 -17 -24.8C-15 -24.6 -12.6 -24.6 -10.4 -25.2Z'
    const wingUp = 'M3 -9.2C7 -13.4 14 -14.6 19.4 -11.8C17 -10.6 12 -9.6 6.4 -9Z'
    const swan = (refl: boolean) =>
      k.draw([
        { d: neck, fill: '#1E1E26', inner: k.sh(neck, 0, 0, 1, 0, 0, 0.6, '#000', 0.3) + hair(-11, -18, -10.6, -14, -7.6, -10, 0.5, '#5A5A6A') },
        { d: swanBody, fill: P.white, inner: k.sh(swanBody, 0, 0, 1, 1, 0, 0.75, P.blue, 0.4) + hair(0, -6, 8, -7.6, 18, -6, 0.5, P.sky2) + hair(4, -3.6, 12, -4, 20, -2.6, 0.45, P.sky2) },
        { d: wingUp, fill: P.white, inner: k.sh(wingUp, 0, 0, 1, 1, 0, 0.7, P.blue, 0.4) + `<path d="M4 -9.4q1.4 -1.6 2.8 -.2q1.4 -1.8 3 -.4q1.6 -1.8 3.2 -.4q1.6 -1.6 3 -.2M7 -12q1.4 -1.4 2.8 -.2q1.6 -1.6 3 -.2q1.4 -1.4 2.8 0" fill="none" stroke="${P.sky2}" stroke-width=".45"/>` },
        { d: head, fill: '#1E1E26' },
        { d: bill, fill: '#9CA8BE', inner: k.sh(bill, 0, 0, 0, 1, 0, 0.6, P.mid, 0.3) },
      ], refl ? 0.3 : 0.6) +
      (refl ? '' : hair(-6.2, -28.2, -5, -26, -5.6, -23, 0.6, P.white) + `<path d="M-11 -27.8C-10 -29.4 -9.4 -29.4 -9 -28.6C-9.6 -27.6 -10.2 -27.2 -11 -27.6Z" fill="${P.red}" stroke="${P.ink}" stroke-width=".25"/>` + eye(-8.4, -27.6, 0.55, '#2A1A10'))
    const reed = (x: number, y: number, h: number, lean: number) => {
      const tx = x + lean, ty = y - h, a = Math.atan2(-h, lean), ux = Math.cos(a), uy = Math.sin(a)
      const plume = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8, bx = tx - ux * 9 * t, by = ty - uy * 9 * t, sd = i % 2 ? 1 : -1, sp = 2.6 * (1 - t * 0.5)
        return hair(bx, by, bx + ux * 2 - uy * sd * sp * 0.6, by + uy * 2 + ux * sd * sp * 0.6, bx + ux * 3.4 - uy * sd * sp, by + uy * 3.4 + ux * sd * sp, 1.1, i % 3 ? '#F3E6C4' : '#E2CC98')
      }).join('')
      return `<path d="M${x} ${y}Q${f(x + lean * 0.4)} ${f(y - h * 0.5)} ${f(tx)} ${f(ty)}" fill="none" stroke="${P.ink}" stroke-width="1.5" stroke-linecap="round"/><path d="M${x} ${y}Q${f(x + lean * 0.4)} ${f(y - h * 0.5)} ${f(tx)} ${f(ty)}" fill="none" stroke="${W_D}" stroke-width=".7" stroke-linecap="round"/>` +
        `<path d="M${f(tx - ux * 9.6)} ${f(ty - uy * 9.6)}L${f(tx + ux * 1.6)} ${f(ty + uy * 1.6)}" stroke="${P.ink}" stroke-width="3.6" stroke-linecap="round" opacity=".85"/>` + plume +
        `<path d="M${f(tx - ux * 9)} ${f(ty - uy * 9)}L${f(tx + ux * 1.2)} ${f(ty + uy * 1.2)}" stroke="#C9AE76" stroke-width=".5"/>`
    }
    const blades = (x: number, y: number, n: number, sg: number) => Array.from({ length: n }, (_, i) => taper(x + i * sg * 1.6, y, x + i * sg * 1.6 + sg * (4 + i), y - 10 - i * 2, x + i * sg * 2.4 + sg * (8 + i * 2), y - 14 - i * 3, 1.6, 0.3)).map((d) => `<path d="${d}" fill="${W}" stroke="${P.ink}" stroke-width=".45"/>`).join('')
    const ripples = Array.from({ length: 9 }, (_, i) => { const y = 74 + i * 3.4, x = 16 + rnd(i) * 30; return `<path d="M${f(x)} ${f(y)}h${f(8 + rnd(i * 3) * 10)}" stroke="${i % 2 ? P.white : P.sky2}" stroke-width=".55" stroke-linecap="round" opacity=".85"/>` }).join('') +
      Array.from({ length: 7 }, (_, i) => { const y = 75.6 + i * 3.8, x = 66 + rnd(i * 5) * 22; return `<path d="M${f(x)} ${f(y)}h${f(6 + rnd(i * 7) * 9)}" stroke="${i % 2 ? P.white : P.sky2}" stroke-width=".55" stroke-linecap="round" opacity=".85"/>` }).join('')
    return (
      field(k) +
      k.sun(60, 68, 12, 50) +
      glow(k, 60, 66, 30, 22, 0.8) +
      `<path d="${city}" fill="${W_D}" opacity=".42"/>` + `<path d="M75 36V30" stroke="${W_D}" stroke-width=".7" opacity=".42"/>` +
      [[36, 40], [40, 39], [44, 41.4]].map(([x, y]) => `<path d="M${x - 1.6} ${y}q1.6 -1.2 1.6 0q0 -1.2 1.6 0" fill="none" stroke="${P.ink}" stroke-width=".45"/>`).join('') +
      `<path d="${water}" fill="${P.sky}"/>` + k.sh(water, 0, 0, 0, 1, 0, 0.8, P.blue, 0.45) + `<path d="M0 70H120V73H0Z" fill="${P.goldL}" opacity=".7"/>` + ripples +
      `<path d="M0 70H120" stroke="${P.ink}" stroke-width=".6"/>` +
      `<g transform="translate(62 86) scale(1.08 -.6)" opacity=".35">` + swan(true) + `</g>` +
      `<g transform="translate(62 86) scale(1.08)">` + swan(false) + `</g>` +
      hair(48, 87.4, 56, 86.4, 64, 87.6, 0.6, P.white) + hair(74, 87.6, 84, 86.6, 92, 87.8, 0.5, P.white) +
      blades(22, 96, 5, 1) + reed(26, 94, 30, -3) + reed(31, 95, 24, 3) + reed(22, 98, 20, 6) +
      blades(98, 96, 5, -1) + reed(94, 94, 28, 3) + reed(89, 96, 22, -2) +
      sparkle(60, 24, 2.4, '#fff') + sparkle(30, 30, 1.6) +
      k.defs()
    )
  },
}

/** Cordón (correa): tinta por fuera, color y un brillo fino. */
function cord_(d: string, c: string, w = 1.2, hi = '#fff') {
  return `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${f(w * 1.9)}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${hi}" stroke-width="${f(w * 0.3)}" stroke-linecap="round" opacity=".55" transform="translate(-.25 -.25)"/>`
}
