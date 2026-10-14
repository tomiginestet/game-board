import { useSyncExternalStore } from 'react'

/**
 * Sin cuenta se puede mirar todo; para anotar o cambiar algo hay que entrar. Este es el único
 * momento en que se pide: cuando se intenta (o con los botones de "Entrar"). Lo dibuja `AccessHost`.
 */

const RETURN_KEY = 'game-board-return-to'
/** El link del mail abre otra pestaña: se guarda en el dispositivo, por un rato. */
const RETURN_TTL_MS = 60 * 60_000

export interface Ask {
  title: string
  text: string
}

let ask: Ask | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

/** Recuerda esta pantalla para volver a ella después de entrar. */
export function rememberReturnPath() {
  try {
    localStorage.setItem(RETURN_KEY, JSON.stringify({ path: window.location.hash.slice(1) || '/', at: Date.now() }))
  } catch {
    // ignorar
  }
}

function readReturnPath(): string | null {
  try {
    const raw = localStorage.getItem(RETURN_KEY)
    const r = raw ? (JSON.parse(raw) as { path?: string; at?: number }) : null
    return r?.path && r.at && Date.now() - r.at < RETURN_TTL_MS ? r.path : null
  } catch {
    return null
  }
}

/** Adónde volver después de entrar (y lo olvida). */
export function takeReturnPath(): string | null {
  const path = readReturnPath()
  try {
    localStorage.removeItem(RETURN_KEY)
  } catch {
    // ignorar
  }
  return path
}

export function hasReturnPath(): boolean {
  return !!readReturnPath()
}

/** Abre la invitación a entrar. Después de entrar se vuelve a esta pantalla (también si se entra con el link del mail). */
export function askLogin(title = 'Entrá para jugar', text = 'Sin cuenta podés mirar el catálogo y los juegos. Para anotar partidas, armar torneos o agregar juegos, entrá o creá tu cuenta: es gratis y lleva un minuto.') {
  rememberReturnPath()
  ask = { title, text }
  emit()
}

export function closeLoginAsk() {
  ask = null
  emit()
}

export function useLoginAsk(): Ask | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => ask,
  )
}
