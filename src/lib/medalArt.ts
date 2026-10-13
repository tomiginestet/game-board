// Medallas: pines de esmalte duro con forma de hexágono (ver docs/medallas-filosofia.md).
// El marco es una pieza de metal fundido y pulido; adentro va la ilustración, dibujada en un lienzo de
// 120×130 centrado en (60,60). Las ilustraciones viven en `art/`.
//
// Lo que el marco le deja a las ilustraciones (por id, con el mismo `u` que reciben):
// - `url(#mm{u})`: el metal pulido del nivel (piezas grandes).
// - `url(#mw{u})`: el metal claro, para filetes, números y detalles en relieve (siempre brilla).
// - `url(#md{u})`: el borde oscuro de los filetes.
// - `#mgu{u}`: el guilloché del nivel (vacío en bronce y plata), para usar con `<use>` sobre los fondos.

import { ART_REGISTRY } from './art'
import { glyphArt } from './art/glyphs'
import { f } from './art/helpers'
import type { Glyph } from './games/schema'

export function hasArt(name: string): boolean {
  return name in ART_REGISTRY
}

/**
 * Material de cada nivel (I a VI): el metal pulido del marco (bandas de reflejo de oscuro a claro), su borde
 * (`line`) y la piedra que llevan arriba los niveles altos. `main` y `dark` son los colores del nivel para la
 * interfaz (ficha de la medalla, imagen para compartir).
 */
export const TIERS = [
  { name: 'Bronce', roman: 'I', main: '#E8A26A', dark: '#9C5221', face: '#FFF1E3', metal: ['#5A2A0E', '#B8692F', '#FFD2A6', '#D88A4E'], line: '#3E1A06', gem: '' },
  { name: 'Plata', roman: 'II', main: '#D3DBE6', dark: '#6E7C91', face: '#F3F6FA', metal: ['#454E5C', '#A9B3C1', '#FFFFFF', '#CBD3DE'], line: '#2A313B', gem: '' },
  { name: 'Oro', roman: 'III', main: '#FFD24D', dark: '#C98A00', face: '#FFF6DA', metal: ['#6B4600', '#C99418', '#FFF2BF', '#E8BE45'], line: '#3F2900', gem: '' },
  { name: 'Diamante', roman: 'IV', main: '#9FE3F2', dark: '#2F7F96', face: '#EAFBFD', metal: ['#29495A', '#86B9CB', '#F4FEFF', '#BFE3EE'], line: '#16303C', gem: '#8AF0FF' },
  { name: 'Rubí', roman: 'V', main: '#F2A38E', dark: '#A23A4E', face: '#FFEFF4', metal: ['#5C2316', '#C77A62', '#FFE6DC', '#E8A38C'], line: '#3A140B', gem: '#F0204F' },
  { name: 'Leyenda', roman: 'VI', main: 'grad', dark: '#5F3DC4', face: '#F5EFFF', metal: ['#2A1660', '#6E8BFF', '#FFF0B8', '#F07AC0'], line: '#170B38', gem: 'prism' },
] as const

const hexPts = (r: number, cx = 60, cy = 60) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180
    return f(cx + r * Math.cos(a)) + ',' + f(cy + r * Math.sin(a))
  }).join(' ')

/** Números romanos dibujados (no dependen de una tipografía): I y V con serifas, de 9 de alto. */
const GLYPH = {
  I: { w: 3.2, d: 'M0 -9H3.2V-8.2H2.5V-.8H3.2V0H0V-.8H.7V-8.2H0Z' },
  V: { w: 7.4, d: 'M0 -9H3V-8.3H2.3L4 -2.4L5.6 -8.3H4.8V-9H7.4V-8.3H6.8L4.2 0H3.4L.7 -8.3H0Z' },
} as const
function roman(txt: string, cx: number, base: number, fill: string, shade: string): string {
  const gap = 0.9
  const w = [...txt].reduce((s, c) => s + GLYPH[c as 'I' | 'V'].w, 0) + gap * (txt.length - 1)
  let x = cx - w / 2, out = ''
  for (const c of txt) {
    const g = GLYPH[c as 'I' | 'V']
    out += `<path d="${g.d}" transform="translate(${f(x + 0.45)} ${f(base + 0.6)})" fill="${shade}"/><path d="${g.d}" transform="translate(${f(x)} ${f(base)})" fill="${fill}"/>`
    x += g.w + gap
  }
  return out
}

/** Piedra facetada centrada en (x,y), de ancho 2s. `prism` es la tornasolada de leyenda. */
function gem(u: number, x: number, y: number, s: number, color: string, line: string): string {
  const prism = color === 'prism'
  const d = (pts: number[][]) => 'M' + pts.map(([a, b]) => `${f(x + a * s)} ${f(y + b * s)}`).join('L') + 'Z'
  return (
    (prism ? `<linearGradient id="mgp${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9BF6FF"/><stop offset=".35" stop-color="#B197FC"/><stop offset=".65" stop-color="#FF8FC8"/><stop offset="1" stop-color="#FFD166"/></linearGradient>` : '') +
    `<path d="${d([[-1, -0.35], [-0.55, -0.85], [0.55, -0.85], [1, -0.35], [0, 1]])}" fill="${prism ? `url(#mgp${u})` : color}"/>` +
    `<path d="${d([[-1, -0.35], [1, -0.35], [0, 1]])}" fill="#000" opacity=".22"/>` +
    `<path d="${d([[-0.55, -0.85], [0.55, -0.85], [0.3, -0.35], [-0.3, -0.35]])}" fill="#fff" opacity=".5"/>` +
    `<path d="${d([[-0.3, -0.35], [0.3, -0.35], [0, 1]])}" fill="#fff" opacity=".28"/>` +
    `<path d="${d([[-1, -0.35], [-0.55, -0.85], [0.55, -0.85], [1, -0.35], [0, 1]])}" fill="none" stroke="${line}" stroke-width=".7" stroke-linejoin="round"/>` +
    `<path d="${d([[-0.74, -0.5], [-0.5, -0.72], [-0.42, -0.44]])}" fill="#fff"/>`
  )
}

/** Rama de laurel de metal fundido, del lado izquierdo (la derecha es el espejo). */
function laurel(metal: string, line: string): string {
  const leaf = 'M0 0C3 -3 8.6 -3 12 0C8.6 3 3 3 0 0Z'
  const at = (deg: number, r: number) => [60 + r * Math.cos((deg * Math.PI) / 180), 64 + r * Math.sin((deg * Math.PI) / 180)]
  const [x0, y0] = at(112, 56.5), [x1, y1] = at(218, 56.5)
  let out = `<path d="M${f(x0)} ${f(y0)}A56.5 56.5 0 0 1 ${f(x1)} ${f(y1)}" fill="none" stroke="${line}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M${f(x0)} ${f(y0)}A56.5 56.5 0 0 1 ${f(x1)} ${f(y1)}" fill="none" stroke="${metal}" stroke-width="1.4" stroke-linecap="round"/>`
  for (let i = 0; i < 9; i++) {
    const deg = 120 + i * 11.6, [x, y] = at(deg, 56.5)
    const tan = deg + 90
    for (const tilt of [-36, 32])
      out += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(tan + tilt)})"><path d="${leaf}" fill="${metal}" stroke="${line}" stroke-width=".8"/><path d="M1.4 0H9.6" stroke="${line}" stroke-width=".45" opacity=".7"/></g>`
  }
  return out
}

/** Guilloché del nivel: líneas finas grabadas bajo el esmalte, cada vez más ricas. */
function guilloche(k: number): string {
  if (k < 2) return ''
  const rings = Array.from({ length: 30 }, (_, i) => `<circle cx="60" cy="60" r="${f(2 + i * 1.9)}"/>`).join('')
  const rays = Array.from({ length: 48 }, (_, i) => {
    const a = (i * 7.5 * Math.PI) / 180
    return `M60 60L${f(60 + 70 * Math.cos(a))} ${f(60 + 70 * Math.sin(a))}`
  }).join('')
  let waves = ''
  for (let j = 0; j < 22; j++) {
    let d = `M0 ${f(8 + j * 5.4)}`
    for (let x = 6; x <= 120; x += 6) d += `Q${x - 3} ${f(8 + j * 5.4 + (x % 12 ? -2.2 : 2.2))} ${x} ${f(8 + j * 5.4)}`
    waves += d
  }
  const line = `fill="none" stroke="#fff" stroke-width=".45"`
  if (k === 2) return `<g ${line} opacity=".22">${rings}</g>`
  if (k === 3) return `<g fill="none" stroke="#fff" stroke-width=".4" opacity=".24"><path d="${rays}"/></g><g ${line} opacity=".12">${rings}</g>`
  if (k === 4) return `<path d="${waves}" ${line} opacity=".2"/>`
  return `<g ${line} opacity=".2">${rings}</g><g fill="none" stroke="#fff" stroke-width=".35" opacity=".16"><path d="${rays}"/></g>`
}

let uid = 0

export interface MedalOpts {
  /** Color de fondo de la ilustración, si no usa el del material. */
  face?: string
  label?: string
  /** Dibujo genérico y color, para medallas sin ilustración propia. */
  glyph?: Glyph
  color?: string
  /** Las ilustraciones todavía están cargando: sin ilustración propia, la cara queda vacía. */
  pending?: boolean
}

/** SVG completo de una medalla: pin hexagonal del metal del nivel + ilustración + plaqueta con el número. */
export function medalSvg(art: string, tier: number, opts: MedalOpts = {}): string {
  const u = ++uid
  const k = Math.min(Math.max(tier, 0), TIERS.length - 1)
  const T = TIERS[k]
  // Los colores pueden venir de juegos agregados por el grupo (sincronizados): sólo se aceptan colores hex.
  const hex = (c: string | undefined) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined)
  const face = hex(opts.face) ?? T.face
  // Ilustración propia por nombre; si no hay, un dibujo genérico (para juegos agregados a mano o por la IA). Mientras
  // las ilustraciones cargan (`pending`, ver `loadArt`), la cara queda vacía para no mostrar el genérico y después cambiarlo.
  const own = ART_REGISTRY[art]
  const icon = own ? own(u) : opts.pending ? '' : glyphArt(opts.glyph ?? 'star', hex(opts.color) ?? '#FFD43B', art)
  const label = (opts.label ?? `${art}, nivel ${T.roman}`).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
  const [dk, md, lt, rf] = T.metal
  const mm = `url(#mm${u})`, line = T.line
  // Metal pulido: varias bandas de reflejo en diagonal, iguales en todo el pin (marco, filetes, números).
  const bands: [number, string][] =
    k === 5
      ? [[0, '#2A1660'], [0.14, '#6E8BFF'], [0.27, '#B8F3FF'], [0.4, '#7B5CFF'], [0.53, '#FF8AC8'], [0.66, '#FFF0B8'], [0.8, '#59D6C9'], [1, '#2A1660']]
      : [[0, dk], [0.13, md], [0.27, lt], [0.4, md], [0.52, dk], [0.66, rf], [0.8, lt], [0.92, md], [1, dk]]

  // Metal claro de los filetes: sólo reflejos, para que se lea como metal y no como contorno.
  const shine: [number, string][] =
    k === 5
      ? [[0, '#B8F3FF'], [0.25, '#FFF0B8'], [0.5, '#FFC2E2'], [0.75, '#C9B8FF'], [1, '#B8F3FF']]
      : [[0, rf], [0.22, lt], [0.42, md], [0.6, lt], [0.8, rf], [1, md]]
  const defs =
    `<defs>` +
    `<linearGradient id="mm${u}" gradientUnits="userSpaceOnUse" x1="14" y1="2" x2="106" y2="128">${bands.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>` +
    `<linearGradient id="mw${u}" gradientUnits="userSpaceOnUse" x1="20" y1="10" x2="100" y2="120">${shine.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>` +
    `<linearGradient id="md${u}"><stop stop-color="${line}" stop-opacity=".7"/></linearGradient>` +
    `<linearGradient id="mv${u}" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".42" stop-color="#fff" stop-opacity=".06"/><stop offset=".43" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>` +
    (k >= 3 ? `<radialGradient id="mo${u}"><stop offset=".45" stop-color="${k === 5 ? '#9D7BFF' : T.gem}" stop-opacity=".5"/><stop offset="1" stop-color="${k === 5 ? '#9D7BFF' : T.gem}" stop-opacity="0"/></radialGradient>` : '') +
    `<clipPath id="mc${u}"><polygon points="${hexPts(43)}"/></clipPath>` +
    `<g id="mgu${u}">${guilloche(k)}</g>` +
    `</defs>`

  const aura =
    (k >= 3 ? `<circle cx="60" cy="62" r="60" fill="url(#mo${u})"/>` : '') +
    (k === 5 ? laurel(`url(#mw${u})`, line) + `<g transform="translate(120 0) scale(-1 1)">${laurel(`url(#mw${u})`, line)}</g>` : '')

  // Pieza fundida: sombra, borde, canto pulido con una ranura grabada, y el labio donde apoya el esmalte.
  const frame =
    `<polygon points="${hexPts(52, 60, 63.5)}" fill="#000" opacity=".4" stroke="#000" stroke-width="9" stroke-linejoin="round"/>` +
    `<polygon points="${hexPts(52)}" fill="${line}" stroke="${line}" stroke-width="10" stroke-linejoin="round"/>` +
    `<polygon points="${hexPts(52)}" fill="${mm}" stroke="${mm}" stroke-width="8" stroke-linejoin="round"/>` +
    `<polygon points="${hexPts(48.4)}" fill="none" stroke="${line}" stroke-width="1" stroke-linejoin="round" opacity=".75"/>` +
    `<polygon points="${hexPts(49.3)}" fill="none" stroke="#fff" stroke-width=".5" stroke-linejoin="round" opacity=".55"/>` +
    `<polygon points="${hexPts(44.4)}" fill="${line}"/>`

  // Esmalte con la ilustración y, encima, el vidrio que brilla en diagonal.
  const inner =
    `<polygon points="${hexPts(43)}" fill="${face}"/>` +
    `<g clip-path="url(#mc${u})">${icon}<polygon points="${hexPts(43)}" fill="url(#mv${u})"/>` +
    `<path d="M24 46L52 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".4"/></g>`

  // Piedra engarzada arriba (diamante para arriba) y plaqueta de metal con el número en relieve.
  const stone =
    k >= 3 ? `<polygon points="${hexPts(8.8, 60, 9)}" fill="${line}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/><polygon points="${hexPts(8.4, 60, 9)}" fill="${mm}"/>` + gem(u, 60, 9.6, 6.2, T.gem, line) : ''
  const w = 20 + T.roman.length * 6.4
  const plaque =
    `<rect x="${f(60 - w / 2 - 1)}" y="103" width="${f(w + 2)}" height="20" rx="10" fill="${line}"/>` +
    `<rect x="${f(60 - w / 2)}" y="104" width="${f(w)}" height="18" rx="9" fill="${mm}"/>` +
    `<rect x="${f(60 - w / 2 + 2.6)}" y="106.6" width="${f(w - 5.2)}" height="12.8" rx="6.4" fill="#1D2B53" stroke="${line}" stroke-width=".6"/>` +
    `<rect x="${f(60 - w / 2 + 3.6)}" y="107.4" width="${f(w - 7.2)}" height="5" rx="2.5" fill="#fff" opacity=".12"/>` +
    roman(T.roman, 60, 117.5, `url(#mw${u})`, '#0B1230')

  return (
    `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" style="color:#2B1B12">` +
    defs + aura + frame + inner + stone + plaque +
    `</svg>`
  )
}
