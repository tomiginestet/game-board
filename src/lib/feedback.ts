import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

/*
 * Avisos y confirmaciones de toda la app, sin contexto de React: `toast()` y `confirmAction()`
 * se pueden llamar desde cualquier lado y <FeedbackHost/> (components/Feedback) los dibuja.
 * Regla de la casa: si algo se puede deshacer, se hace y se ofrece "Deshacer"; sólo lo
 * irreversible pregunta antes, y el botón dice qué hace ("Salir del club", nunca "Aceptar").
 */

export interface Toast {
  id: number
  text: string
  action?: { label: string; run: () => void }
}

export interface Confirm {
  title: string
  detail?: string
  confirmLabel: string
  danger?: boolean
  resolve: (ok: boolean) => void
}

let toastState: Toast | null = null
let confirmState: Confirm | null = null
let nextId = 1
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Aviso breve abajo de la pantalla. Con `action` (p. ej. Deshacer) dura más. */
export function toast(text: string, action?: Toast['action']) {
  toastState = { id: nextId++, text, action }
  emit()
}

/** Pregunta antes de algo que no se puede deshacer. Resuelve `true` si la persona confirma. */
export function confirmAction(opts: Omit<Confirm, 'resolve'>): Promise<boolean> {
  confirmState?.resolve(false)
  return new Promise((resolve) => {
    confirmState = { ...opts, resolve }
    emit()
  })
}

/** Saca cualquier aviso en pantalla (p. ej. al abrir el festejo, para que no tape sus botones). */
export function clearToast() {
  if (!toastState) return
  toastState = null
  emit()
}

export function closeToast(id: number) {
  if (toastState?.id !== id) return
  toastState = null
  emit()
}

export function settleConfirm(ok: boolean) {
  const c = confirmState
  confirmState = null
  emit()
  c?.resolve(ok)
}

export const useToast = () => useSyncExternalStore(subscribe, () => toastState)
export const useConfirm = () => useSyncExternalStore(subscribe, () => confirmState)

/**
 * Abre un <dialog> como modal y, al cerrarse, devuelve el foco a quien lo abrió.
 * El que abrió se guarda antes del primer efecto: con el diálogo abierto, el resto de la página es inerte.
 */
export function useModal(ref: RefObject<HTMLDialogElement | null>) {
  const [opener] = useState(() => document.activeElement as HTMLElement | null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      opener?.focus?.()
    }
  }, [ref, opener])
}
