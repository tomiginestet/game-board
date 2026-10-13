// Atajos de teclado para anotar desde una compu (el contador y los turnos). Sin componentes, para el refresco en caliente.
import { useEffect, useEffectEvent } from 'react'
import { toast } from '../../lib/feedback'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { entryText } from './playHooks'

/** `true` si la tecla la tiene que recibir otra cosa: un campo, un diálogo abierto o un botón con foco (para Enter/Espacio). */
function belongsElsewhere(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || document.querySelector('dialog[open]')) return true
  const el = e.target instanceof HTMLElement ? e.target : null
  if (!el) return false
  if (el.isContentEditable || el.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return true
  // Lo que está detrás de la pausa final (o de cualquier capa) no se anota.
  if (el.closest('[inert]')) return true
  // Enter y Espacio sobre un botón o un link son de ese control: no se duplican como atajo.
  if ((e.key === 'Enter' || e.key === ' ') && el.closest('button, a[href], summary, [role="button"]')) return true
  return false
}

/** Ctrl/Cmd+Z deshace como en cualquier programa; cualquier otra combinación con modificadores es del navegador. */
function isUndoCombo(e: KeyboardEvent): boolean {
  return (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'z'
}

/**
 * Escucha el teclado mientras `enabled`. `onKey` recibe la tecla normalizada (minúscula; "enter", "backspace")
 * y devuelve `true` si la usó, para que no haga además lo suyo (Backspace no vuelve atrás, Espacio no desplaza).
 * Mantener una tecla apretada no repite: un punto por pulsación.
 */
export function useScoreKeys(enabled: boolean, onKey: (key: string) => boolean) {
  const handle = useEffectEvent((e: KeyboardEvent) => {
    if (e.repeat || belongsElsewhere(e)) return
    let key: string
    if (isUndoCombo(e)) key = 'z'
    else if (e.ctrlKey || e.metaKey || e.altKey) return
    else key = e.key.toLowerCase()
    if (onKey(key)) e.preventDefault()
  })
  useEffect(() => {
    if (!enabled) return
    const listener = (e: KeyboardEvent) => handle(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [enabled])
}

/** Lo mismo que "Deshacer" de la barra de abajo: deshace lo último y avisa qué se deshizo. */
export function undoLast(play: Play, game: GameDef, players: Map<Id, Player>): boolean {
  const last = play.log[play.log.length - 1]
  if (!last) return false
  actions.undo(play.id)
  toast(`Deshiciste: ${entryText(play, game, players, last)}`)
  return true
}

/** Teclas que suman a cada lado: A y L con dos lados (las puntas del teclado, como en el ping pong); 1 a 9 con más. */
export function sideKeys(count: number): string[] {
  if (count === 2) return ['a', 'l']
  return Array.from({ length: Math.min(count, 9) }, (_, i) => String(i + 1))
}
