// Medallas: marco hexagonal del nivel + ilustración.
// Cada ilustración es una función que devuelve el contenido del hexágono
// (coordenadas en un lienzo de 120×130). Las ilustraciones viven en `art/`.

import { ART_REGISTRY } from './art'
import { glyphArt } from './art/glyphs'
import { D, f, t } from './art/helpers'
import type { Glyph } from './games/schema'

export function hasArt(name: string): boolean {
  return name in ART_REGISTRY
}


/** Material del marco según el número de nivel (I a VI). */
export const TIERS = [
  { name: 'Bronce', roman: 'I', main: '#E8A26A', dark: '#9C5221', face: '#FFF1E3' },
  { name: 'Plata', roman: 'II', main: '#D3DBE6', dark: '#6E7C91', face: '#F8FAFC' },
  { name: 'Oro', roman: 'III', main: '#FFD24D', dark: '#C98A00', face: '#FFF8DC' },
  { name: 'Diamante', roman: 'IV', main: '#7FE3F0', dark: '#0B7285', face: '#EFFCFE' },
  { name: 'Rubí', roman: 'V', main: '#FF8FAB', dark: '#A61E4D', face: '#FFF0F5' },
  { name: 'Leyenda', roman: 'VI', main: 'grad', dark: '#5F3DC4', face: '#F6F0FF' },
] as const

const hexPts = (r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180
    return f(60 + r * Math.cos(a)) + ',' + f(60 + r * Math.sin(a))
  }).join(' ')

let uid = 0

/** SVG completo de una medalla: marco hexagonal del nivel + ilustración + cinta con el número romano. */
export function medalSvg(
  art: string,
  tier: number,
  opts: { face?: string; label?: string; glyph?: Glyph; color?: string } = {},
): string {
  const u = ++uid
  const T = TIERS[Math.min(Math.max(tier, 0), TIERS.length - 1)]
  // Los colores pueden venir de juegos agregados por el grupo (sincronizados): sólo se aceptan colores hex.
  const hex = (c: string | undefined) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined)
  opts = { ...opts, face: hex(opts.face), color: hex(opts.color) }
  // Ilustración propia por nombre; si no hay, un dibujo genérico (para juegos agregados a mano o por la IA).
  const own = ART_REGISTRY[art]
  const icon = own ? own(u) : glyphArt(opts.glyph ?? 'star', opts.color ?? '#FFD43B', art)
  const main = T.main === 'grad' ? `url(#mg${u})` : T.main
  const grad =
    T.main === 'grad'
      ? `<linearGradient id="mg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B197FC"/><stop offset=".5" stop-color="#F783AC"/><stop offset="1" stop-color="#66D9E8"/></linearGradient>`
      : ''
  const label = (opts.label ?? `${art}, nivel ${T.roman}`).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
  const w = 20 + T.roman.length * 9
  return (
    `<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">` +
    `<defs>${grad}<clipPath id="mc${u}"><polygon points="${hexPts(43)}"/></clipPath></defs>` +
    `<polygon points="${hexPts(54)}" fill="${D}" stroke="${D}" stroke-width="12" stroke-linejoin="round"/>` +
    `<polygon points="${hexPts(54)}" fill="${T.dark}" stroke="${T.dark}" stroke-width="6.8" stroke-linejoin="round"/>` +
    `<polygon points="${hexPts(49)}" fill="${main}" stroke="${main}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M23 36 L52 19" stroke="#fff" stroke-opacity=".55" stroke-width="3.5" stroke-linecap="round"/>` +
    `<polygon points="${hexPts(43)}" fill="${opts.face ?? T.face}"/>` +
    `<g clip-path="url(#mc${u})">${icon}</g>` +
    `<polygon points="${hexPts(43)}" class="m-ol" fill="none"/>` +
    `<rect class="m-ol" x="${60 - w / 2}" y="104" width="${w}" height="17" rx="8.5" fill="${T.dark}"/>` +
    t(60, 116.6, 12, T.roman, '#fff') +
    `</svg>`
  )
}
