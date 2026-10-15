// Visitas anónimas (Vercel Web Analytics): de cada dirección sólo sale la pantalla
// genérica (`/unirse/:code`, `/juegos/:id`), nunca la real. El link de invitación
// lleva el código secreto del club y las demás llevan ids de jugadores y partidas.

import { matchRoutes, type RouteObject } from 'react-router-dom'

/** Pantalla genérica de una dirección según las rutas de la app. */
export function screenFor(routes: RouteObject[], pathname: string): string {
  let screen = ''
  for (const { route } of matchRoutes(routes, pathname) ?? []) {
    if (!route.path) continue
    screen = route.path.startsWith('/') ? route.path : `${screen.replace(/\/$/, '')}/${route.path}`
  }
  if (screen.endsWith('*')) return '/no-existe'
  return screen || '/'
}

/** La dirección dentro del `#` (la app usa HashRouter), sin lo que venga después de `?`. */
export function hashPath(hash: string): string {
  return new URL(hash.replace(/^#/, '') || '/', 'https://x').pathname
}
