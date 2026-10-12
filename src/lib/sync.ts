import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import { entityKey, KINDS, listOf, type EntityChange, type EntityKind, type RemoteEntity } from './diff'
import { applyRemote, copyCurrentTo, EMPTY, getData, hasScope, onLocalChanges, replaceAllFromRemote, switchScope } from './store'

/**
 * Sincronización con Supabase (la misma base y los mismos clubes que el Ping Pong Club).
 *
 * La app sigue funcionando offline con localStorage. Si el dispositivo está unido
 * a un "club", cada cambio local se encola (outbox) y se sube; los cambios de
 * otros dispositivos se bajan al abrir la app, al recibir un aviso en tiempo
 * real, al volver a la pestaña y cada cierto tiempo. Por cada jugador/partido/
 * torneo gana la versión más reciente.
 *
 * Con cuenta, se puede estar en varios grupos (clubes): hay uno activo y los
 * datos (y la cola de cambios) de cada uno se guardan aparte en el dispositivo,
 * así cambiar de grupo es instantáneo.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string | undefined
/** Formato viejo (un solo club). Se migra solo al formato por grupo. */
const LEGACY_SYNC_KEY = 'game-board-sync-v1'
const ACTIVE_KEY = 'game-board-active-club-v1'
const clubSyncKey = (code: string) => `game-board-sync-v1:${code}`
const PULL_INTERVAL_MS = 30_000
/** Margen al pedir cambios, por transacciones que confirman fuera de orden. */
const PULL_OVERLAP_MS = 15_000

export const syncAvailable = !!(SUPABASE_URL && SUPABASE_KEY)

let client: SupabaseClient | null = null
function getClient(): SupabaseClient | null {
  if (!syncAvailable) return null
  // Con sesión persistida: las cuentas son opcionales, pero si hay una, queda guardada.
  client ??= createClient(SUPABASE_URL!, SUPABASE_KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  return client
}

export function supabase(): SupabaseClient | null {
  return getClient()
}

export interface Club {
  code: string
  name: string
  /** `duo`: mano a mano con un amigo. */
  kind?: 'group' | 'duo'
  emoji?: string
}

interface OutboxItem {
  kind: EntityKind
  id: string
  v: number
}

interface Persisted {
  club?: Club
  /** Versión conocida de cada entidad (local o remota). */
  versions: Record<string, number>
  /** Cambios locales pendientes de subir. */
  outbox: Record<string, OutboxItem>
  /** Último `updated_at` recibido del servidor. */
  cursor?: string
}

export type SyncStatus = 'off' | 'syncing' | 'ok' | 'offline' | 'error'

export interface SyncState {
  club?: Club
  status: SyncStatus
  pending: number
  lastSync?: number
  error?: string
}

/** Cómo se cuenta el estado del guardado en la interfaz (nunca sólo con un color). */
export const SYNC_LABEL: Record<SyncStatus, string> = {
  ok: 'Todo guardado',
  syncing: 'Guardando…',
  offline: 'Sin conexión: guardamos cuando vuelva',
  error: 'No se pudo guardar',
  off: 'Solo en este teléfono',
}

function readJSON<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function loadClubState(club: Club): Persisted {
  const p = readJSON<Partial<Persisted>>(clubSyncKey(club.code))
  return { club, versions: p?.versions ?? {}, outbox: p?.outbox ?? {}, cursor: p?.cursor }
}

function loadPersisted(): Persisted {
  // Migración del formato de un solo club: sus datos pasan a guardarse como los de ese grupo.
  const legacy = readJSON<Persisted>(LEGACY_SYNC_KEY)
  if (legacy) {
    try {
      if (legacy.club) {
        localStorage.setItem(clubSyncKey(legacy.club.code), JSON.stringify({ versions: legacy.versions ?? {}, outbox: legacy.outbox ?? {}, cursor: legacy.cursor }))
        localStorage.setItem(ACTIVE_KEY, JSON.stringify(legacy.club))
        if (!hasScope(legacy.club.code)) copyCurrentTo(legacy.club.code)
      }
      localStorage.removeItem(LEGACY_SYNC_KEY)
    } catch {
      // ignorar
    }
  }
  const active = readJSON<Club>(ACTIVE_KEY)
  return active?.code ? loadClubState(active) : { versions: {}, outbox: {} }
}

let persisted = loadPersisted()
switchScope(persisted.club?.code ?? null)
let state: SyncState = { club: persisted.club, status: persisted.club ? 'syncing' : 'off', pending: Object.keys(persisted.outbox).length }
const listeners = new Set<() => void>()

function save() {
  try {
    if (persisted.club) {
      localStorage.setItem(clubSyncKey(persisted.club.code), JSON.stringify({ versions: persisted.versions, outbox: persisted.outbox, cursor: persisted.cursor }))
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(persisted.club))
    } else {
      localStorage.removeItem(ACTIVE_KEY)
    }
  } catch {
    // ignorar
  }
}

function setState(patch: Partial<SyncState>) {
  state = { ...state, ...patch, club: persisted.club, pending: Object.keys(persisted.outbox).length }
  listeners.forEach((l) => l())
}

export function useSyncState(): SyncState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

/** Nueva versión, siempre mayor a la anterior conocida para esa entidad. */
function nextVersion(key: string): number {
  return Math.max(Date.now(), (persisted.versions[key] ?? 0) + 1)
}

function enqueue(changes: { kind: EntityKind; id: string }[]) {
  for (const c of changes) {
    const key = entityKey(c.kind, c.id)
    const v = nextVersion(key)
    persisted.versions[key] = v
    persisted.outbox[key] = { kind: c.kind, id: c.id, v }
  }
  save()
  setState({})
}

function allLocalEntities(): { kind: EntityKind; id: string }[] {
  const data = getData()
  return KINDS.flatMap((kind) => listOf(data, kind).map((e) => ({ kind, id: e.id })))
}

// ---------------------------------------------------------------------------
// Subir y bajar

let pushTimer: ReturnType<typeof setTimeout> | undefined
let pushing: Promise<void> | null = null
let pulling: Promise<void> | null = null
let pullingCode: string | undefined
let channel: RealtimeChannel | null = null

function schedulePush(delay = 400) {
  if (!persisted.club) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(), delay)
}

function describeError(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message)
  return String(e)
}

async function push(): Promise<void> {
  const sb = getClient()
  const club = persisted.club
  if (!sb || !club) return
  if (pushing) {
    await pushing
    return schedulePush(0)
  }
  pushing = (async () => {
    const items = Object.values(persisted.outbox)
    if (!items.length) return
    setState({ status: 'syncing' })
    const data = getData()
    try {
      for (let i = 0; i < items.length; i += 200) {
        const chunk = items.slice(i, i + 200)
        const payload = chunk.map((it) => {
          const entity = listOf(data, it.kind).find((e) => e.id === it.id)
          return entity ? { kind: it.kind, id: it.id, v: it.v, deleted: false, data: entity } : { kind: it.kind, id: it.id, v: it.v, deleted: true }
        })
        const { error } = await sb.rpc('push_changes', { p_code: club.code, p_items: payload })
        if (error) throw error
        // Se cambió de grupo mientras subíamos: la cola de este grupo se limpia la próxima vez.
        if (persisted.club?.code !== club.code) return
        for (const it of chunk) {
          const key = entityKey(it.kind, it.id)
          // Sólo se saca de la cola si no hubo otro cambio mientras subíamos.
          if (persisted.outbox[key]?.v === it.v) delete persisted.outbox[key]
        }
        save()
      }
      void channel?.send({ type: 'broadcast', event: 'changed', payload: {} })
      setState({ status: 'ok', lastSync: Date.now(), error: undefined })
    } catch (e) {
      setState({ status: navigator.onLine === false ? 'offline' : 'error', error: describeError(e) })
    }
  })()
  try {
    await pushing
  } finally {
    pushing = null
  }
  if (Object.keys(persisted.outbox).length && state.status === 'ok') schedulePush(0)
}

interface PulledRow extends RemoteEntity {
  v: number
  updated_at: string
}

async function pull(full = false): Promise<void> {
  const sb = getClient()
  const club = persisted.club
  if (!sb || !club) return
  if (pulling) {
    if (pullingCode === club.code) return pulling
    await pulling.catch(() => {})
    if (persisted.club?.code !== club.code) return
  }
  pullingCode = club.code
  pulling = (async () => {
    setState({ status: 'syncing' })
    try {
      const since = !full && persisted.cursor ? new Date(new Date(persisted.cursor).getTime() - PULL_OVERLAP_MS).toISOString() : null
      const { data, error } = await sb.rpc('pull_changes_all', { p_code: club.code, p_since: since })
      if (error) throw error
      if (persisted.club?.code !== club.code) return
      const rows = (data ?? []) as PulledRow[]
      const toApply: RemoteEntity[] = []
      for (const row of rows) {
        const key = entityKey(row.kind, row.id)
        const known = persisted.versions[key] ?? 0
        if (row.v > known) {
          persisted.versions[key] = row.v
          delete persisted.outbox[key]
          toApply.push(row)
        }
        if (!persisted.cursor || row.updated_at > persisted.cursor) persisted.cursor = row.updated_at
      }
      save()
      applyRemote(toApply)
      setState({ status: 'ok', lastSync: Date.now(), error: undefined })
    } catch (e) {
      setState({ status: navigator.onLine === false ? 'offline' : 'error', error: describeError(e) })
    }
  })()
  try {
    await pulling
  } finally {
    pulling = null
  }
}

/** Baja y sube todo lo pendiente. */
export async function syncNow(): Promise<void> {
  await pull()
  await push()
}

function connectRealtime() {
  const sb = getClient()
  const club = persisted.club
  if (!sb || !club) return
  disconnectRealtime()
  channel = sb
    .channel(`club-${club.code}`, { config: { broadcast: { self: false } } })
    .on('broadcast', { event: 'changed' }, () => void pull())
    .subscribe()
}

function disconnectRealtime() {
  if (channel) void getClient()?.removeChannel(channel)
  channel = null
}

// ---------------------------------------------------------------------------
// Club

export async function createClub(name: string): Promise<Club> {
  const sb = getClient()
  if (!sb) throw new Error('Sincronización no configurada')
  const { data, error } = await sb.rpc('create_club', { p_name: name })
  if (error) throw new Error(describeError(error))
  const club: Club = { code: String(data), name: name.trim() }
  await adoptLocalData(club)
  return club
}

/** Pasa los datos que se están mostrando (los de este dispositivo) a un grupo recién creado. */
export async function adoptLocalData(club: Club): Promise<void> {
  disconnectRealtime()
  copyCurrentTo(club.code)
  switchScope(club.code)
  persisted = { club, versions: {}, outbox: {}, cursor: undefined }
  enqueue(allLocalEntities())
  connectRealtime()
  await push()
  await pull(true)
}

/** Busca un club por código. Devuelve su nombre o `null` si no existe. */
export async function findClub(code: string): Promise<string | null> {
  const sb = getClient()
  if (!sb) throw new Error('Sincronización no configurada')
  const { data, error } = await sb.rpc('get_club', { p_code: normalizeCode(code) })
  if (error) throw new Error(describeError(error))
  return (data as string | null) ?? null
}

/**
 * Se une a un club existente.
 * - `replace`: usa sólo los datos del club.
 * - `merge`: suma los datos que se están mostrando (los de este dispositivo) a los del club.
 */
export async function joinClub(code: string, mode: 'replace' | 'merge'): Promise<Club> {
  const normalized = normalizeCode(code)
  const name = await findClub(normalized)
  if (!name) throw new Error('No existe un club con ese código')
  const club: Club = { code: normalized, name }
  if (mode === 'replace') {
    await activateClub(club)
    return club
  }
  disconnectRealtime()
  copyCurrentTo(club.code)
  switchScope(club.code)
  persisted = { club, versions: {}, outbox: {}, cursor: undefined }
  save()
  setState({})
  // Bajar primero: si hay datos locales más viejos que los del club, gana el club.
  await pull(true)
  const pendingLocal = allLocalEntities().filter((e) => !(entityKey(e.kind, e.id) in persisted.versions))
  enqueue(pendingLocal)
  await push()
  connectRealtime()
  return club
}

/**
 * Deja este grupo como el activo. Lo pendiente del grupo anterior queda en su cola
 * (se sube al volver a él). Si el grupo ya estaba guardado en el dispositivo, se ve al instante.
 */
export async function activateClub(club: Club): Promise<void> {
  if (persisted.club?.code === club.code) {
    if (persisted.club.name !== club.name || persisted.club.emoji !== club.emoji || persisted.club.kind !== club.kind) {
      persisted = { ...persisted, club: { ...persisted.club, ...club } }
      save()
      setState({})
    }
    return
  }
  if (persisted.club && Object.keys(persisted.outbox).length) await push().catch(() => {})
  disconnectRealtime()
  clearTimeout(pushTimer)
  persisted = loadClubState(club)
  if (!hasScope(club.code)) {
    // Primera vez en este dispositivo: arranca vacío y baja todo.
    persisted.versions = {}
    persisted.cursor = undefined
    switchScope(club.code)
    replaceAllFromRemote(EMPTY)
  } else {
    switchScope(club.code)
  }
  save()
  setState({ status: 'syncing', lastSync: undefined, error: undefined })
  connectRealtime()
  await pull(!persisted.cursor)
  await push()
}

/** Deja de usar grupos en este dispositivo y vuelve a los datos locales (los de sin cuenta). */
export function deactivateClub() {
  disconnectRealtime()
  clearTimeout(pushTimer)
  persisted = { versions: {}, outbox: {} }
  save()
  switchScope(null)
  setState({ status: 'off', error: undefined, lastSync: undefined })
}

/** Deja de sincronizar. Los datos del club quedan guardados en este dispositivo, como datos locales. */
export function leaveClub() {
  copyCurrentTo(null)
  deactivateClub()
}

/** Acepta el código o un link de invitación entero (de Game Board o del Ping Pong Club). */
export function normalizeCode(code: string): string {
  const fromLink = code.match(/unirse\/([a-z0-9-]+)/i)?.[1]
  return (fromLink ?? code).trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Cambia a otro club de la cuenta. */
export async function switchClub(code: string, name?: string): Promise<Club> {
  const club: Club = { code, name: name ?? (await findClub(code)) ?? code }
  await activateClub(club)
  return club
}

export function inviteLink(code: string): string {
  const base = window.location.href.split('#')[0]
  return `${base}#/unirse/${code}`
}

// ---------------------------------------------------------------------------
// Arranque

let started = false

export function startSync() {
  if (started) return
  started = true
  onLocalChanges((changes: EntityChange[]) => {
    if (!persisted.club) return
    enqueue(changes)
    schedulePush()
  })
  if (!syncAvailable) return
  // Estos disparadores no hacen nada mientras el dispositivo no esté en un club.
  setInterval(() => {
    if (persisted.club && document.visibilityState === 'visible') void syncNow()
  }, PULL_INTERVAL_MS)
  document.addEventListener('visibilitychange', () => {
    if (persisted.club && document.visibilityState === 'visible') void syncNow()
  })
  window.addEventListener('online', () => persisted.club && void syncNow())
  if (persisted.club) {
    connectRealtime()
    void syncNow()
  }
}
