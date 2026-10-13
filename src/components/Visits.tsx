import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'
import { useCallback } from 'react'
import { useLocation, type RouteObject } from 'react-router-dom'
import { hashPath, screenFor } from '../lib/visits'

/**
 * Visitas anónimas con Vercel Web Analytics (sin cookies). Sólo sale la pantalla genérica:
 * se la pasamos como ruta y, por las dudas, también reemplaza la dirección completa del
 * evento, que llevaría el `#/unirse/<código>` del link de invitación.
 */
export function Visits({ routes }: { routes: RouteObject[] }) {
  const screen = screenFor(routes, useLocation().pathname)
  const beforeSend = useCallback(
    (event: BeforeSendEvent) => ({ ...event, url: location.origin + screenFor(routes, hashPath(location.hash)) }),
    [routes],
  )
  return <Analytics route={screen} path={screen} beforeSend={beforeSend} />
}
