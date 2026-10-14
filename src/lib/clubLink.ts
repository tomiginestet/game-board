// Links cortos de los clubes (`/c/lasartes`) y lo que viene en el link de un QR.
//
// El link corto es lo que se imprime en la tarjeta del bar: lo elige un admin y apunta al club (ver
// `supabase/migrations/20261015000000_club_links_venues.sql`). La app usa rutas con `#`, así que los links
// se arman como `…/#/c/lasartes`; si el hosting manda cualquier ruta a la app, también sirve `…/c/lasartes`.

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

export function shortLink(slug: string, href: string): string {
  return `${appBase(href)}#/c/${slug}`
}

/** Link corto a una mesa: abre la partida de ese juego (`?juego=pingpong`). */
export function tableLink(slug: string, gameId: string, href: string): string {
  return `${shortLink(slug, href)}?juego=${encodeURIComponent(gameId)}`
}

/**
 * Un link corto que llegó sin `#` (`/c/lasartes` en un hosting que manda todo a la app, o `?c=lasartes`):
 * devuelve la dirección equivalente con `#`, o `null` si no hace falta tocar nada.
 */
export function hashRedirect(loc: { pathname: string; search: string; hash: string }): string | null {
  if (loc.hash && loc.hash !== '#' && loc.hash !== '#/') return null
  const params = new URLSearchParams(loc.search)
  const fromPath = loc.pathname.match(/^(.*\/)c\/([a-z0-9-]+)\/?$/i)
  const slug = fromPath ? fromPath[2] : params.get('c')
  if (!slug) return null
  params.delete('c')
  const rest = params.toString()
  const base = fromPath ? fromPath[1] : loc.pathname
  return `${base}#/c/${slug.toLowerCase()}${rest ? `?${rest}` : ''}`
}

/** Si la ruta es una invitación: por código (`/unirse/abc`) o por link corto (`/c/lasartes`). */
export function inviteTarget(pathname: string): { code: string } | { slug: string } | null {
  const code = pathname.match(/^\/unirse\/([^/]+)/)?.[1]
  if (code) return { code }
  const slug = pathname.match(/^\/c\/([^/]+)/)?.[1]
  return slug ? { slug: slug.toLowerCase() } : null
}
