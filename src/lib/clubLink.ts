// Links de los clubes: el corto (`/c/lasartes`), el de invitación (`/unirse/<código>`) y lo que viene en un QR.
//
// El link corto es lo que se imprime en la tarjeta del bar: lo elige un admin y apunta al club (ver
// `supabase/migrations/20261015000200_club_links_venues.sql`). Los links que se comparten van sin `#`
// (`…/c/lasartes`), así los servidores que arman la vista previa (WhatsApp, Telegram…) llegan a
// `api/club.ts`, que responde con la carátula y manda a la persona a la ruta de la app (`#/c/lasartes`).

/** De 3 a 30 letras sin acentos, números o guiones (sin guiones al principio, al final ni dobles). */
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function validSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 30 && SLUG_RE.test(slug)
}

/** Sugerencia de link a partir del nombre del club: "Club de Las Artes" → "lasartes". */
export function suggestSlug(name: string): string {
  const words = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
  // "Club de Las Artes", "Bar del Puerto": lo que distingue al club viene después de "club de" o "bar del".
  while (words.length > 1 && ['club', 'bar'].includes(words[0])) {
    words.shift()
    if (words.length > 1 && ['de', 'del'].includes(words[0])) words.shift()
  }
  const joined = words.join('').slice(0, 30)
  return joined.length >= 3 ? joined : ''
}

/** Lo que escribe la persona en el campo del link, ya limpio (minúsculas, guiones en vez de espacios). */
export function cleanSlugInput(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 30)
}

/** Dirección de la app sin la parte de la ruta (`https://x.app/` o `https://x.github.io/game-board/`). */
export function appBase(href: string): string {
  return href.split('#')[0].split('?')[0]
}

/** La dirección pública de la app: `VITE_PUBLIC_URL` si está (para armar links desde otro lado), si no, la actual. */
export function publicBase(href: string, configured?: string): string {
  const base = configured?.trim() || appBase(href)
  return base.endsWith('/') ? base : `${base}/`
}

export function shortLink(slug: string, href: string, configured?: string): string {
  return `${publicBase(href, configured)}c/${slug}`
}

export function inviteLinkFor(code: string, href: string, configured?: string): string {
  return `${publicBase(href, configured)}unirse/${code}`
}

/** Link corto a una mesa: abre la partida de ese juego (`?juego=pingpong`). */
export function tableLink(slug: string, gameId: string, href: string, configured?: string): string {
  return `${shortLink(slug, href, configured)}?juego=${encodeURIComponent(gameId)}`
}

/**
 * Un link de club que llegó sin `#` (`/c/lasartes`, `/unirse/abc` o `?c=lasartes`, cuando el hosting manda
 * todo a la app): devuelve la dirección equivalente con `#`, o `null` si no hace falta tocar nada.
 */
export function hashRedirect(loc: { pathname: string; search: string; hash: string }): string | null {
  if (loc.hash && loc.hash !== '#' && loc.hash !== '#/') return null
  const params = new URLSearchParams(loc.search)
  const fromPath = loc.pathname.match(/^(.*\/)(c|unirse)\/([a-z0-9-]+)\/?$/i)
  const route = fromPath ? fromPath[2].toLowerCase() : 'c'
  const id = fromPath ? fromPath[3] : params.get('c')
  if (!id) return null
  params.delete('c')
  const rest = params.toString()
  const base = fromPath ? fromPath[1] : loc.pathname
  return `${base}#/${route}/${route === 'c' ? id.toLowerCase() : id}${rest ? `?${rest}` : ''}`
}

/** Si la ruta es una invitación: por código (`/unirse/abc`) o por link corto (`/c/lasartes`). */
export function inviteTarget(pathname: string): { code: string } | { slug: string } | null {
  const code = pathname.match(/^\/unirse\/([^/]+)/)?.[1]
  if (code) return { code }
  const slug = pathname.match(/^\/c\/([^/]+)/)?.[1]
  return slug ? { slug: slug.toLowerCase() } : null
}
