// Imagen de la carátula de un link de club (1200 × 630): el festejo de la medalla Carnet nuevo con el nombre
// del club. El fondo (rayos, confeti y la medalla) es fijo, `public/og/club-fondo.png`; el texto se dibuja acá.

import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

type Node = { type: string; props: Record<string, unknown> }
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } })

const font = (origin: string, file: string) => fetch(`${origin}/og/${file}`).then((r) => r.arrayBuffer())

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const name = (url.searchParams.get('name') ?? 'Game Board').slice(0, 40)
  const generic = url.searchParams.has('generic')
  const [lilita, inter, interBold] = await Promise.all([font(url.origin, 'lilita-one.woff'), font(url.origin, 'inter-400.woff'), font(url.origin, 'inter-700.woff')])
  const size = name.length <= 12 ? 80 : name.length <= 20 ? 64 : 50
  const square = (c: string) => h('div', { width: 22, height: 22, borderRadius: 6, background: c })

  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', position: 'relative', background: '#0d1117', fontFamily: 'Inter', color: '#f0f3f8' },
    [
      { type: 'img', props: { src: `${url.origin}/og/club-fondo.png`, width: 1200, height: 630, style: { position: 'absolute', left: 0, top: 0 } } },
      h('div', { position: 'absolute', left: 540, top: 0, width: 610, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'center' }, [
        h('div', { fontFamily: 'Lilita One', fontSize: 38, color: '#ffb400' }, generic ? 'Game Board' : '¡Medalla nueva!'),
        // "Sumate a" arriba y el nombre del club entero abajo, así no se parte el nombre.
        h('div', { display: 'flex', flexDirection: 'column', fontFamily: 'Lilita One', fontSize: size, lineHeight: 1.02, marginTop: 14 }, [
          h('div', {}, generic ? 'Quién manda' : 'Sumate a'),
          h('div', {}, generic ? 'en cada juego' : name),
        ]),
        h('div', { fontSize: 30, color: '#c9d2e0', marginTop: 22 }, generic ? 'Partidas, torneos y medallas.' : 'Llevate la medalla Carnet nuevo.'),
        h('div', { display: 'flex', alignItems: 'center', marginTop: 54 }, [
          h('div', { display: 'flex', flexWrap: 'wrap', width: 50, height: 50, gap: 6 }, [square('#ff6b35'), square('#4c8dff'), square('#22c55e'), square('#b98cff')]),
          h('div', { fontFamily: 'Lilita One', fontSize: 32, marginLeft: 14 }, 'Game Board'),
          h('div', { fontSize: 22, color: '#9aa5b8', marginLeft: 18, fontWeight: 700 }, 'Partidas, torneos y medallas'),
        ]),
      ]),
    ],
  )

  return new ImageResponse(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Lilita One', data: lilita, weight: 400, style: 'normal' },
      { name: 'Inter', data: inter, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
    ],
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=86400' },
  })
}
