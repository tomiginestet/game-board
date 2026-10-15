import { useSyncExternalStore } from 'react'
import type { EntityKind } from './diff'
import type { Id } from './types'

/**
 * Quién puede cambiar qué. Son las mismas reglas que aplica el servidor al guardar
 * (`supabase/migrations/20261015000300_permisos.sql`); acá sirven para no dejar hacer en la
 * pantalla lo que después el servidor rechazaría.
 *
 * - `all`: sin servidor, o con cuenta pero con los datos de este dispositivo (sin club activo).
 * - `guest`: sin cuenta. Se puede mirar todo, pero no anotar ni cambiar nada.
 * - `member`: con cuenta, en un club. Cualquiera crea cosas nuevas; cambiar o borrar lo que ya
 *   existe es del dueño o un admin, de quien lo creó, de los que juegan una partida (cambiarla,
 *   no borrarla) y de cada uno con su jugador (cambiarlo, no borrarlo).
 */
export type Access =
  | { mode: 'all'; uid?: string }
  | { mode: 'guest' }
  | { mode: 'member'; uid: string; admin: boolean; playerId?: Id | null }

/** Lo que guarda cada entidad sobre quién la creó (lo pone la app y lo confirma el servidor). */
export interface Authored {
  id: Id
  createdBy?: string | null
}

/** Jugadores de una partida (`play`) o de un partido de ping pong (`match`). */
function playersOf(kind: EntityKind, e: object): Id[] {
  if (kind === 'play') {
    // En una convocatoria, los citados también: responden si van.
    const { sides, invited } = e as { sides?: { players?: Id[] }[]; invited?: Id[] }
    const inSides = Array.isArray(sides) ? sides.flatMap((s) => (Array.isArray(s?.players) ? s.players : [])) : []
    return Array.isArray(invited) ? [...inSides, ...invited] : inSides
  }
  if (kind === 'match') {
    const m = e as { playerA?: Id; playerB?: Id; partnerA?: Id; partnerB?: Id }
    return [m.playerA, m.playerB, m.partnerA, m.partnerB].filter((x): x is Id => !!x)
  }
  return []
}

/** ¿Puede crear cosas nuevas (partidas, juegos, torneos, jugadores)? */
export function canCreate(a: Access): boolean {
  return a.mode !== 'guest'
}

/**
 * ¿Puede pasar `before` a `after`? Sin `before` es algo nuevo; sin `after`, un borrado.
 * Mirá siempre el estado anterior: lo que decide es cómo estaba, no cómo queda.
 */
export function canChange(a: Access, kind: EntityKind, before: Authored | undefined, after: object | undefined): boolean {
  if (a.mode === 'all') return true
  if (a.mode === 'guest') return false
  if (!before) return true
  if (a.admin || (before.createdBy && before.createdBy === a.uid)) return true
  if (!after) return false
  if (kind === 'player') return !!a.playerId && before.id === a.playerId
  if (kind === 'play' || kind === 'match') return !!a.playerId && playersOf(kind, before).includes(a.playerId)
  return false
}

/** Atajos para la interfaz: cambiar o borrar algo que ya existe. */
export const canEdit = (a: Access, kind: EntityKind, e: Authored) => canChange(a, kind, e, e)
export const canDelete = (a: Access, kind: EntityKind, e: Authored) => canChange(a, kind, e, undefined)

/** Por qué no se pudo: falta entrar con una cuenta, o no es tuyo. */
export type Denial = 'login' | 'permission'

export function denialFor(a: Access): Denial {
  return a.mode === 'guest' ? 'login' : 'permission'
}

// ---------------------------------------------------------------------------
// Estado: lo calcula `useAccessSync` (con la sesión y el club activo) y lo leen el store y la interfaz.

// Con servidor, hasta saber si hay sesión, sólo se mira.
const withServer = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY)
let access: Access = withServer ? { mode: 'guest' } : { mode: 'all' }
const listeners = new Set<() => void>()
const deniedListeners = new Set<(d: Denial) => void>()

export function getAccess(): Access {
  return access
}

export function setAccess(next: Access) {
  if (JSON.stringify(next) === JSON.stringify(access)) return
  access = next
  listeners.forEach((l) => l())
}

export function onAccessChange(l: () => void): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useAccess(): Access {
  return useSyncExternalStore(onAccessChange, () => access)
}

/** Avisa que se intentó algo no permitido (lo muestra `AccessHost`). */
export function reportDenied(d: Denial) {
  deniedListeners.forEach((l) => l(d))
}

/** Antes de crear algo y saltar a verlo: sin cuenta no se crea (se invita a entrar) y no hay que saltar. */
export function mayCreateNow(): boolean {
  if (canCreate(access)) return true
  reportDenied('login')
  return false
}

export function onDenied(l: (d: Denial) => void): () => void {
  deniedListeners.add(l)
  return () => deniedListeners.delete(l)
}
