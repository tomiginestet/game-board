// La app agregada al inicio del teléfono casi nunca se recarga: el sistema la deja dormida y al volver sigue con el
// código de cuando se abrió. Para que tome los cambios, cada vez que vuelve a primer plano (y cada tanto mientras se
// usa) se fija en `version.json` si hubo un deploy nuevo. Si lo hubo y no estás en medio de algo, se recarga sola;
// si estás anotando o jugando, aparece un aviso para actualizar cuando quieras.

import { useSyncExternalStore } from 'react'

const EVERY = 15 * 60_000
/** Al volver después de tan poco, no vale la pena preguntar de nuevo. */
const MIN_GAP = 60_000

/** Pantallas donde una recarga te sacaría de algo a medio hacer (una partida, un formulario). */
const BUSY = /^\/(anotar|jugar|partida|partido|convocar|ping-pong\/(nuevo|torneo\/nuevo)|juegos\/(nuevo|[^/]+\/editar)|(torneos|equipos|grupos)\/nuevo|cuenta|perfil|ajustes|admin)(\/|$)/

export function isBusyPath(path: string): boolean {
  return BUSY.test(path)
}

let available = false
const listeners = new Set<() => void>()

export function useUpdateAvailable(): boolean {
  return useSyncExternalStore(
    (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    () => available,
  )
}

export function applyUpdate() {
  location.reload()
}

function currentPath(): string {
  return location.hash.replace(/^#/, '').split('?')[0] || '/'
}

/** Escribiendo en un campo o con un diálogo abierto también es mal momento. */
function busy(): boolean {
  if (isBusyPath(currentPath())) return true
  const el = document.activeElement
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true
  return !!document.querySelector('dialog[open]')
}

let lastCheck = 0

async function check(): Promise<boolean> {
  lastCheck = Date.now()
  try {
    const res = await fetch(`./version.json?t=${lastCheck}`, { cache: 'no-store' })
    if (!res.ok) return false
    const { version } = (await res.json()) as { version?: string }
    return !!version && version !== __APP_VERSION__
  } catch {
    return false
  }
}

async function refresh(resuming: boolean) {
  if (available) {
    if (resuming && !busy()) applyUpdate()
    return
  }
  if (Date.now() - lastCheck < MIN_GAP) return
  if (!(await check())) return
  if (resuming && !busy()) return applyUpdate()
  available = true
  listeners.forEach((fn) => fn())
}

export function startUpdateCheck() {
  if (import.meta.env.DEV) return

  // Después de un deploy, las pantallas que se bajan aparte cambian de nombre: si falla una, la versión es vieja.
  window.addEventListener('vite:preloadError', (e) => {
    const key = 'gb-reloaded-for'
    try {
      if (sessionStorage.getItem(key) === __APP_VERSION__) return
      sessionStorage.setItem(key, __APP_VERSION__)
    } catch {
      return
    }
    e.preventDefault()
    applyUpdate()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refresh(true)
  })
  // Safari puede devolver la página entera desde su caché de "atrás".
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) void refresh(true)
  })
  window.addEventListener('online', () => void refresh(false))
  setInterval(() => {
    if (document.visibilityState === 'visible') void refresh(false)
  }, EVERY)
  setTimeout(() => void refresh(false), 10_000)
}
