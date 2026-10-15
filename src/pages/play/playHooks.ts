// Ganchos y ayudas de la pantalla de partida (sin componentes, para que el refresco en caliente funcione).
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { sideName } from '../../components/GameBits'
import { nextTurn, type LiveState } from '../../lib/engine'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import { vibrate } from '../../lib/vibrate'
import type { Id, LogEntry, Play, Player } from '../../lib/types'

/** Distancia (px) a partir de la cual un toque se considera arrastre o scroll, no un toque. */
const TAP_SLOP = 10

/**
 * Toque "a prueba de juntada" para las zonas grandes que suman puntos: anota al soltar
 * (click), no al apoyar el dedo, y descarta el toque si el dedo se movió más de ~10px,
 * si la página se desplazó en el medio o si el navegador canceló el gesto para hacer scroll.
 * Enter y Espacio siguen funcionando: el click de teclado no pasa por pointerdown.
 */
export function useTapGuard(onTap: () => void) {
  const start = useRef<{ id: number; x: number; y: number; scrollY: number; moved: boolean } | null>(null)
  const discard = useRef(false)
  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary) {
        // Un segundo dedo en medio del toque lo invalida.
        if (start.current) start.current.moved = true
        return
      }
      start.current = { id: e.pointerId, x: e.clientX, y: e.clientY, scrollY: window.scrollY, moved: false }
    },
    onPointerMove: (e: PointerEvent) => {
      const s = start.current
      if (!s || s.id !== e.pointerId || s.moved) return
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > TAP_SLOP || Math.abs(window.scrollY - s.scrollY) > 2) s.moved = true
    },
    onPointerUp: (e: PointerEvent) => {
      const s = start.current
      if (!s || s.id !== e.pointerId) return
      discard.current = s.moved || Math.hypot(e.clientX - s.x, e.clientY - s.y) > TAP_SLOP || Math.abs(window.scrollY - s.scrollY) > 2
      start.current = null
    },
    onPointerCancel: () => {
      // El navegador se quedó con el gesto (scroll): no es un toque.
      start.current = null
      discard.current = true
    },
    onClick: (e: MouseEvent) => {
      // detail === 0: click de teclado (Enter/Espacio) o de un lector de pantalla.
      if (e.detail !== 0 && discard.current) {
        discard.current = false
        return
      }
      discard.current = false
      onTap()
    },
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
  }
}

/** `true` si la persona pidió menos movimiento. Se actualiza si cambia la preferencia. */
export function useReducedMotion(): boolean {
  const [query] = useState(() => (typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : undefined))
  const [reduce, setReduce] = useState(() => !!query?.matches)
  useEffect(() => {
    if (!query) return
    const on = () => setReduce(query.matches)
    query.addEventListener('change', on)
    return () => query.removeEventListener('change', on)
  }, [query])
  return reduce
}

/** Recuerda (en memoria, mientras dure la sesión) un interruptor por partida: "Más jugadas", ayuda. */
const toggles = new Map<string, boolean>()
export function usePlayToggle(key: string, initial = false): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(() => toggles.get(key) ?? initial)
  return [
    on,
    (v: boolean) => {
      toggles.set(key, v)
      setOn(v)
    },
  ]
}

/** Texto corto de una entrada del registro ("Ana +1", "🗣️ Envido: Beto"). */
export function entryText(play: Play, game: GameDef, players: Map<Id, Player>, e: LogEntry): string {
  // Con el cronómetro andando, cada jugada lleva su minuto: "Gol de Ana (Los Pibes) · 12'".
  const minute = (e.k === 'pt' || e.k === 'ev') && e.m ? ` · ${e.m}'` : ''
  return entryBase(play, game, players, e) + minute
}

function entryBase(play: Play, game: GameDef, players: Map<Id, Player>, e: LogEntry): string {
  const label = (i: number) => (i < 0 ? 'Mesa' : sideName(play.sides[i], players))
  const who = (id: Id | undefined) => (id ? players.get(id)?.name ?? '¿?' : undefined)
  if (e.k === 'pt') {
    const unit = game.perPlayer?.scorer ? (e.n === 1 ? (game.perPlayer.unitOne ?? game.scoring.quickLabel ?? 'punto') : (game.perPlayer.unit ?? 'puntos')) : undefined
    if (e.pl) return `${unit ? `${unit.charAt(0).toUpperCase()}${unit.slice(1)} de ${who(e.pl)}` : `${who(e.pl)} +${e.n}`}${e.n > 1 ? ` (+${e.n})` : ''}${e.as ? `, pase de ${who(e.as)}` : ''} (${label(e.s)})`
    return `${label(e.s)} +${e.n}`
  }
  if (e.k === 'ev') {
    const def = game.events.find((x) => x.id === e.e)
    const by = e.pl ? `${who(e.pl)} (${label(e.s)})` : label(e.s)
    return `${def?.emoji ?? ''} ${def?.name ?? e.e}: ${by}${e.p !== undefined ? ` (+${e.p})` : ''}${e.n < 0 ? ' (−1)' : ''}`.trim()
  }
  if (e.k === 'turn') return `Turno de ${label(e.s)}`
  return `Mano: ${e.sc.join(' / ')}`
}


/** Pasa el turno al siguiente (o arranca la partida por turnos). Lo usan el botón de la barra y la tecla N. */
export function passTurn(play: Play, live: LiveState) {
  vibrate(20)
  actions.log(play.id, { k: 'turn', s: nextTurn(play, live) })
}
