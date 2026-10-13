// Registro de las ilustraciones de medallas, por nombre de nivel.
// Pesan mucho (son SVG dibujados en código), así que no van en el paquete principal: `loadArt()` las trae en un archivo
// aparte la primera vez que hacen falta, y mientras tanto las medallas se dibujan con el marco y la cara vacía.
export const ART_REGISTRY: Record<string, (u: number) => string> = {}

let loaded = false
let pending: Promise<void> | undefined
const listeners = new Set<() => void>()

/** Si las ilustraciones ya están cargadas. */
export const artLoaded = () => loaded

/** Avisa cuando terminan de cargar las ilustraciones (para `useSyncExternalStore`). */
export function onArtLoaded(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/** Carga las ilustraciones una sola vez; las llamadas siguientes devuelven la misma promesa. */
export function loadArt(): Promise<void> {
  pending ??= import('./registry').then(({ ALL_ART }) => {
    Object.assign(ART_REGISTRY, ALL_ART)
    loaded = true
    for (const cb of listeners) cb()
  })
  return pending
}
