// Medallas: "estampitas" coleccionables. Cada una es una figurita troquelada con forma de estampilla:
// borde perforado, banda grabada del material del nivel, ventana en arco con la ilustración, esquinas
// como un naipe, rareza en estrellitas y una cinta (o un sello, de oro para arriba) con el número.
// Las ilustraciones son funciones que devuelven el contenido de la ventana, dibujado en un lienzo de
// 120×130 centrado en (60,60), como las del Ping Pong Club. Viven en `art/`.

import { ART_REGISTRY } from './art'
import { glyphArt } from './art/glyphs'
import { f, starPts } from './art/helpers'
import type { Glyph } from './games/schema'

export function hasArt(name: string): boolean {
  return name in ART_REGISTRY
}

/**
 * Material de cada nivel (I a VI). `foil` es el metal de la banda y la cinta (claro, medio, oscuro),
 * `ink` la tinta del grabado y `line` la de los contornos de la ilustración.
 */
export const TIERS = [
  { name: 'Bronce', roman: 'I', main: '#E8A26A', dark: '#9C5221', face: '#FFF1E3', ink: '#6E3514', line: '#3B1B0A', foil: ['#FFD9B8', '#DE8F55', '#9C5221'] },
  { name: 'Plata', roman: 'II', main: '#D3DBE6', dark: '#6E7C91', face: '#F3F6FA', ink: '#3A4860', line: '#1F2838', foil: ['#FFFFFF', '#BCC7D6', '#6E7C91'] },
  { name: 'Oro', roman: 'III', main: '#FFD24D', dark: '#C98A00', face: '#FFF6DA', ink: '#1F2A5C', line: '#151C40', foil: ['#FFF4BF', '#F5C33B', '#A86F00'] },
  { name: 'Diamante', roman: 'IV', main: '#7FE3F0', dark: '#0B7285', face: '#EAFBFD', ink: '#0B4A57', line: '#062F38', foil: ['#F0FEFF', '#6FD8E8', '#0B7285'] },
  { name: 'Rubí', roman: 'V', main: '#FF8FAB', dark: '#A61E4D', face: '#FFEFF4', ink: '#6E1032', line: '#45081F', foil: ['#FFE0EA', '#F25C85', '#A61E4D'] },
  { name: 'Leyenda', roman: 'VI', main: 'grad', dark: '#5F3DC4', face: '#F5EFFF', ink: '#3B2391', line: '#24135F', foil: ['#B197FC', '#F783AC', '#66D9E8'] },
] as const

const PAPER = '#FBF4E3'
const SERIF = `font-family="Playfair Display, Georgia, serif" font-weight="900"`

/** Borde de estampilla: rectángulo con mordidas semicirculares en los cuatro lados. */
function perforated(x: number, y: number, w: number, h: number, r: number, nx: number, ny: number): string {
  const X = x + w, Y = y + h
  let d = `M${x} ${y}`
  for (let i = 0; i < nx; i++) { const c = x + (w * (i + 0.5)) / nx; d += `L${f(c - r)} ${y}A${r} ${r} 0 0 0 ${f(c + r)} ${y}` }
  d += `L${X} ${y}`
  for (let i = 0; i < ny; i++) { const c = y + (h * (i + 0.5)) / ny; d += `L${X} ${f(c - r)}A${r} ${r} 0 0 0 ${X} ${f(c + r)}` }
  d += `L${X} ${Y}`
  for (let i = 0; i < nx; i++) { const c = X - (w * (i + 0.5)) / nx; d += `L${f(c + r)} ${Y}A${r} ${r} 0 0 0 ${f(c - r)} ${Y}` }
  d += `L${x} ${Y}`
  for (let i = 0; i < ny; i++) { const c = Y - (h * (i + 0.5)) / ny; d += `L${x} ${f(c + r)}A${r} ${r} 0 0 0 ${x} ${f(c - r)}` }
  return d + 'Z'
}

const STAMP = perforated(4, 4, 112, 142, 3.3, 11, 14)
/** Ventana en arco donde va la ilustración. */
const WINDOW = 'M23 114V58A37 37 0 0 1 97 58V114Z'
const WINDOW_OUT = 'M20.5 116V58A39.5 39.5 0 0 1 99.5 58V116'
/** Banda del marco: rectángulo exterior menos el interior. */
const BAND = 'M11 11H109V139H11Z M19 19V131H101V19Z'

/** Grabado de la banda, distinto en cada nivel (baldosa de 8×8). */
const BAND_PATTERN = [
  (c: string) => `<circle cx="4" cy="4" r="1.25" fill="${c}"/>`,
  (c: string) => `<path d="M-1 9L9 -1M-1 1L1 -1M7 9L9 7" stroke="${c}" stroke-width="1.1"/>`,
  (c: string) => `<path d="M0 6.6H6.4V1.6H2.2V4.4H4.2" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="square"/>`,
  (c: string) => `<path d="M4 1.2L6.8 4L4 6.8L1.2 4Z" fill="none" stroke="${c}" stroke-width="1.1"/><circle cx="0" cy="0" r=".9" fill="${c}"/><circle cx="8" cy="8" r=".9" fill="${c}"/><circle cx="0" cy="8" r=".9" fill="${c}"/><circle cx="8" cy="0" r=".9" fill="${c}"/>`,
  (c: string) => `<path d="M0 6.5A4 4 0 0 1 8 6.5M0 2.5A2 2 0 0 0 4 2.5A2 2 0 0 0 8 2.5" fill="none" stroke="${c}" stroke-width="1.1"/>`,
  (c: string) => `<polygon points="${starPts(4, 4, 3.2, 1.1, 4)}" fill="${c}"/>`,
]

/** Copa chiquita (esquina de arriba a la derecha, como en los naipes). */
const cup = (x: number, y: number, c: string) =>
  `<path transform="translate(${x} ${y})" fill="${c}" d="M-4.2 -4.6H4.2V-1.4C4.2 1.8 2.2 3 0 3C-2.2 3 -4.2 1.8 -4.2 -1.4Z M-.9 3H.9V4.6H-.9Z M-3 4.4H3V5.8H-3Z M-4.2 -3.6C-6.6 -3.6 -6.4 .4 -3.6 .4 M4.2 -3.6C6.6 -3.6 6.4 .4 3.6 .4"/>` +
  `<path transform="translate(${x} ${y})" d="M-4.2 -3.4C-6.4 -3.4 -6.2 .2 -3.8 .2M4.2 -3.4C6.4 -3.4 6.2 .2 3.8 .2" fill="none" stroke="${c}" stroke-width="1"/>`

let uid = 0

export interface MedalOpts {
  /** Color de fondo de la ilustración, si no usa el del material. */
  face?: string
  label?: string
  /** Dibujo genérico y color, para medallas sin ilustración propia. */
  glyph?: Glyph
  color?: string
  /** Valor de la estampilla: el número que hubo que alcanzar (va en las esquinas). */
  value?: number
  /** Versión grande: escribe el nombre en la cinta. */
  detail?: boolean
}

/** SVG completo de una medalla. */
export function medalSvg(art: string, tier: number, opts: MedalOpts = {}): string {
  const u = ++uid
  const k = Math.min(Math.max(tier, 0), TIERS.length - 1)
  const T = TIERS[k]
  // Los colores pueden venir de juegos agregados por el grupo (sincronizados): sólo se aceptan colores hex.
  const hex = (c: string | undefined) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined)
  const face = hex(opts.face) ?? T.face
  // Ilustración propia por nombre; si no hay, un dibujo genérico (para juegos agregados a mano o por la IA).
  const own = ART_REGISTRY[art]
  const icon = own ? own(u) : glyphArt(opts.glyph ?? 'star', hex(opts.color) ?? '#FFD43B', art)
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
  const label = esc(opts.label ?? `${art}, nivel ${T.roman}`)
  const [fl, fm, fd] = T.foil
  const holo = k === 5
  const ink = T.ink

  // Metal de la banda, la cinta y el sello; el de leyenda es holográfico.
  const foil = holo
    ? `<linearGradient id="mf${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B197FC"/><stop offset=".3" stop-color="#F783AC"/><stop offset=".55" stop-color="#FFE066"/><stop offset=".8" stop-color="#66D9E8"/><stop offset="1" stop-color="#B197FC"/></linearGradient>`
    : `<linearGradient id="mf${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${fl}"/><stop offset=".35" stop-color="${fm}"/><stop offset=".55" stop-color="${fd}"/><stop offset=".72" stop-color="${fm}"/><stop offset="1" stop-color="${fl}"/></linearGradient>`
  const defs =
    `<defs>${foil}` +
    `<clipPath id="ms${u}"><path d="${STAMP}"/></clipPath>` +
    `<clipPath id="mw${u}"><path d="${WINDOW}"/></clipPath>` +
    `<pattern id="mp${u}" x="11" y="11" width="8" height="8" patternUnits="userSpaceOnUse">${BAND_PATTERN[k](ink)}</pattern>` +
    `<pattern id="mh${u}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V3" stroke="${ink}" stroke-width=".7"/></pattern>` +
    `<radialGradient id="mv${u}" cx=".5" cy=".45" r=".62"><stop offset=".6" stop-color="${ink}" stop-opacity="0"/><stop offset="1" stop-color="${ink}" stop-opacity=".22"/></radialGradient>` +
    (k >= 3 ? `<linearGradient id="mg${u}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` : '') +
    `</defs>`

  // Papel con su sombra de sticker.
  const paper =
    `<path d="${STAMP}" transform="translate(1.6 2.6)" fill="#000" opacity=".38"/>` +
    `<path d="${STAMP}" fill="${PAPER}"/>` +
    (holo ? `<path d="${STAMP}" fill="url(#mf${u})" opacity=".22"/>` : '')

  // Fondo grabado del interior y banda de metal con su dibujo.
  const band =
    `<rect x="19" y="19" width="82" height="112" fill="url(#mh${u})" opacity=".35"/>` +
    `<path d="${BAND}" fill-rule="evenodd" fill="url(#mf${u})"/>` +
    `<path d="${BAND}" fill-rule="evenodd" fill="url(#mp${u})" opacity=".55"/>` +
    `<rect x="11" y="11" width="98" height="128" fill="none" stroke="${ink}" stroke-width="1.4"/>` +
    `<rect x="19" y="19" width="82" height="112" fill="none" stroke="${ink}" stroke-width="1"/>`

  // Rayos de sol detrás del dibujo, de oro para arriba.
  const rays =
    k >= 2
      ? `<g opacity="${k >= 4 ? 0.13 : 0.09}" fill="${ink}">` +
        Array.from({ length: 18 }, (_, i) => {
          const a = (i * 20 * Math.PI) / 180, b = ((i * 20 + 8) * Math.PI) / 180
          return `<path d="M60 64L${f(60 + 90 * Math.cos(a))} ${f(64 + 90 * Math.sin(a))}L${f(60 + 90 * Math.cos(b))} ${f(64 + 90 * Math.sin(b))}Z"/>`
        }).join('') +
        `</g>`
      : ''
  const window =
    `<path d="${WINDOW_OUT}" fill="none" stroke="${ink}" stroke-width=".9"/>` +
    `<path d="${WINDOW}" fill="${face}"/>` +
    `<g clip-path="url(#mw${u})">${rays}<g transform="translate(0 3)">${icon}</g><path d="${WINDOW}" fill="url(#mv${u})"/></g>` +
    `<path d="${WINDOW}" fill="none" stroke="${ink}" stroke-width="2"/>`

  // Esquinas como un naipe: el valor arriba a la izquierda y abajo a la derecha (dado vuelta).
  const val = opts.value !== undefined && opts.value >= 0 && opts.value < 10000 ? String(opts.value) : T.roman
  const fs = val.length <= 2 ? 10 : val.length === 3 ? 8 : 6.6
  const corner = (x: number, y: number) => `<rect x="${x}" y="${y}" width="15" height="15" fill="${ink}"/><rect x="${x + 1.5}" y="${y + 1.5}" width="12" height="12" fill="none" stroke="url(#mf${u})" stroke-width=".8"/>`
  const num = `<text x="0" y="${f(fs * 0.36)}" ${SERIF} font-size="${fs}" fill="${PAPER}" text-anchor="middle">${val}</text>`
  const corners =
    corner(10, 10) + corner(95, 10) + corner(10, 125) + corner(95, 125) +
    `<g transform="translate(17.5 17.5)">${num}</g><g transform="translate(102.5 132.5) rotate(180)">${num}</g>` +
    cup(102.5, 17, `url(#mf${u})`) +
    `<polygon points="${starPts(17.5, 132.8, 5, 2.2)}" fill="url(#mf${u})"/>`

  // Rareza: una estrellita por nivel, en un cartucho arriba.
  const n = k + 1, sw = 7 * n + 5
  const rarity =
    `<rect x="${f(60 - sw / 2)}" y="9.5" width="${sw}" height="11" rx="5.5" fill="${ink}"/>` +
    Array.from({ length: n }, (_, i) => `<polygon points="${starPts(f(60 - (7 * (n - 1)) / 2 + 7 * i), 15.2, 3.1, 1.35)}" fill="url(#mf${u})"/>`).join('')

  // En la versión grande, el nombre va escrito sobre la cinta (en dos renglones si es largo).
  const words = art.toUpperCase().split(/\s+/).filter(Boolean)
  const full = words.join(' ')
  let lines = [full]
  if (full.length > 18 && words.length > 1) {
    const off = (i: number) => Math.abs(words.slice(0, i).join(' ').length - full.length / 2)
    let best = 1
    for (let i = 2; i < words.length; i++) if (off(i) < off(best)) best = i
    lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')]
  }
  // Cinta con las puntas dobladas hacia atrás (más ancha si el nombre va en dos renglones).
  const rb = opts.detail && lines.length > 1 ? 119 : 116, tb = rb + 4
  const ribbon =
    `<path d="M24 107H9L13.5 ${f((107 + tb) / 2)}L9 ${tb}H24Z" fill="${T.dark}" stroke="${ink}" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<path d="M96 107H111L106.5 ${f((107 + tb) / 2)}L111 ${tb}H96Z" fill="${T.dark}" stroke="${ink}" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<path d="M22 ${rb}L24 ${tb}V112Z M98 ${rb}L96 ${tb}V112Z" fill="${ink}"/>` +
    `<path d="M22 103Q60 115.5 98 103V${rb}Q60 ${f(rb + 12.5)} 22 ${rb}Z" fill="url(#mf${u})" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>` +
    `<path d="M25 106.4Q60 118 95 106.4" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>`
  // Cada renglón va sobre una curva paralela a la cinta, `dy` por debajo de su línea media.
  const ribbonLine = (txt: string, i: number, dy: number, max: number) => {
    const fs = f(Math.min(max, 76 / (Math.max(txt.length, 1) * 0.74)))
    const y = dy + fs * 0.36
    return (
      `<path id="mr${u}-${i}" d="M22 ${f(109.5 + y)}Q60 ${f(122 + y)} 98 ${f(109.5 + y)}" fill="none"/>` +
      `<text ${SERIF} font-size="${fs}" fill="${ink}" text-anchor="middle"><textPath href="#mr${u}-${i}" startOffset="50%">${esc(txt)}</textPath></text>`
    )
  }
  const ribbonText = opts.detail
    ? lines.length === 1
      ? ribbonLine(lines[0], 0, 0, 7.4)
      : ribbonLine(lines[0], 0, -1.5, 5.6) + ribbonLine(lines[1], 1, 4.8, 5.6)
    : k < 2
      ? `<text x="60" y="118.2" ${SERIF} font-size="11" fill="${ink}" text-anchor="middle">${T.roman}</text>`
      : ''

  // Sello dentado con el número, de oro para arriba.
  let seal = ''
  if (k >= 2) {
    const cy = opts.detail ? 136 : 123, R = 12.5
    seal =
      `<polygon points="${starPts(60, cy, R, R - 2.2, 16)}" fill="url(#mf${u})" stroke="${ink}" stroke-width="1.1" stroke-linejoin="round"/>` +
      `<circle cx="60" cy="${cy}" r="${R - 4.6}" fill="${ink}"/><circle cx="60" cy="${cy}" r="${R - 5.8}" fill="none" stroke="url(#mf${u})" stroke-width=".7"/>` +
      `<text x="60" y="${f(cy + 3)}" ${SERIF} font-size="${T.roman.length > 2 ? 7 : 8.4}" fill="url(#mf${u})" text-anchor="middle">${T.roman}</text>` +
      (k >= 4 && !opts.detail ? `<path d="M52 ${cy - 13} L54.5 ${cy - 18} L57.5 ${cy - 14.5} L60 ${cy - 19.5} L62.5 ${cy - 14.5} L65.5 ${cy - 18} L68 ${cy - 13}Z" fill="url(#mf${u})" stroke="${ink}" stroke-width="1" stroke-linejoin="round"/>` : '')
  }

  // Brillo que pasa por encima (diamante para arriba): una figurita "brillante".
  const shine =
    k >= 3 ? `<g clip-path="url(#ms${u})"><g transform="rotate(24 60 76)"><rect class="m-shine" style="animation-delay:-${f((u * 1.7) % 6)}s" x="-70" y="-30" width="34" height="220" fill="url(#mg${u})"/></g></g>` : ''

  return (
    `<svg viewBox="0 0 120 152" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="color:${T.line}">` +
    defs + paper + band + window + corners + rarity + ribbon + ribbonText + seal + shine +
    `</svg>`
  )
}
