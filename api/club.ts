// Vista previa de los links de un club (`/c/lasartes`, `/unirse/<código>`), ver `vercel.json`.
//
// Cuando alguien comparte el link, WhatsApp, Telegram o quien sea lo piden para armar la carátula: acá se
// busca el club y se responde con las etiquetas Open Graph (título, texto e imagen con la medalla). A una
// persona, el mismo HTML la manda enseguida a la ruta de la app (`/#/c/lasartes`), que la suma al club.

export const config = { runtime: 'edge' }

interface ClubCard {
  name: string
  emoji: string | null
  description: string | null
  members: number
}

const ID = /^[a-z0-9-]{3,40}$/i
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

async function findClub(by: 'slug' | 'code', id: string): Promise<ClubCard | null> {
  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_KEY
  if (!base || !key) return null
  try {
    const res = await fetch(`${base}/rest/v1/rpc/${by === 'slug' ? 'club_by_slug' : 'club_card'}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(by === 'slug' ? { p_slug: id } : { p_code: id }),
    })
    if (!res.ok) return null
    const rows = (await res.json()) as ClubCard[]
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const code = url.searchParams.get('code')
  const juego = url.searchParams.get('juego')
  const by = slug ? 'slug' : 'code'
  const id = (slug ?? code ?? '').trim()
  const valid = ID.test(id)
  const route = by === 'slug' ? `c/${id.toLowerCase()}` : `unirse/${id}`
  const appUrl = `${url.origin}/#/${valid ? route : ''}${valid && juego && ID.test(juego) ? `?juego=${juego}` : ''}`
  const club = valid ? await findClub(by, by === 'slug' ? id.toLowerCase() : id) : null

  const name = club?.name ?? 'Game Board'
  const title = club ? `Sumate a ${name} en Game Board` : 'Game Board'
  const text = club
    ? 'Entrá, anotá tus partidas y llevate la medalla Carnet nuevo. Partidas, torneos y quién manda en cada juego.'
    : 'Partidas, torneos y quién manda en cada juego.'
  const image = `${url.origin}/api/club-og?name=${encodeURIComponent(name)}${club ? '' : '&generic=1'}`
  const canonical = valid ? `${url.origin}/${route}` : url.origin

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(text)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Game Board">
<meta property="og:locale" content="es_AR">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:title" content="${esc(club ? `¡Medalla nueva! Sumate a ${name}` : title)}">
<meta property="og:description" content="${esc(text)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(`Medalla Carnet nuevo de ${name}`)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d1117">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d1117;color:#f0f3f8;font:16px system-ui,sans-serif}a{color:#ff6b35}</style>
</head>
<body>
<p>Abriendo ${esc(name)}… <a href="${esc(appUrl)}">Entrar al club</a></p>
<script>location.replace(${JSON.stringify(appUrl)})</script>
</body>
</html>`
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' },
  })
}
