// Cuentas, grupos, amigos y notificaciones (todo pasa por funciones de Supabase).
//
// Un "grupo" es un club de los de siempre (la sincronización de datos no cambia):
// una cuenta puede estar en varios y cambia entre ellos con `activateClub`.
// Los mano a mano con un amigo son grupos de dos (`kind: 'duo'`).

import { useEffect, useSyncExternalStore } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { currentUserId, useAuth } from './auth'
import { BUILTIN_GAMES } from './games'
import { activateClub, adoptLocalData, supabase, useSyncState, type Club } from './sync'

function client() {
  const sb = supabase()
  if (!sb) throw new Error('Las cuentas no están disponibles en esta versión de la app')
  return sb
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await client().rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

// ---------------------------------------------------------------------------
// Perfil

export interface Profile {
  user_id: string
  username: string | null
  display_name: string | null
  emoji: string | null
  color: string | null
}

export type PublicUser = Profile

let profileState: { userId?: string; profile?: Profile | null; loading: boolean } = { loading: false }
const profileListeners = new Set<() => void>()
function setProfileState(next: typeof profileState) {
  profileState = next
  profileListeners.forEach((l) => l())
}

export async function loadProfile(): Promise<Profile | null> {
  const uid = currentUserId()
  if (!uid) {
    setProfileState({ loading: false })
    return null
  }
  setProfileState({ ...profileState, userId: uid, loading: true })
  const { data, error } = await client().from('profiles').select('user_id, username, display_name, emoji, color').eq('user_id', uid).maybeSingle()
  if (error) {
    setProfileState({ userId: uid, profile: profileState.profile, loading: false })
    throw new Error(error.message)
  }
  setProfileState({ userId: uid, profile: (data as Profile | null) ?? null, loading: false })
  return (data as Profile | null) ?? null
}

/** Perfil de la cuenta con sesión: `undefined` mientras carga, `null` si todavía no lo armó. */
export function useProfile(): { profile: Profile | null | undefined; loading: boolean } {
  const auth = useAuth()
  const uid = auth.session?.user.id
  const s = useSyncExternalStore(
    (l) => {
      profileListeners.add(l)
      return () => profileListeners.delete(l)
    },
    () => profileState,
  )
  useEffect(() => {
    if (uid && s.userId !== uid && !s.loading) void loadProfile().catch(() => {})
  }, [uid, s.userId, s.loading])
  if (!uid) return { profile: null, loading: false }
  if (s.userId !== uid) return { profile: undefined, loading: true }
  return { profile: s.profile, loading: s.loading }
}

export function isProfileComplete(p: Profile | null | undefined): p is Profile & { username: string; display_name: string } {
  return !!p?.username && !!p.display_name
}

export async function saveProfile(p: { username: string; display_name: string; emoji: string; color: string }): Promise<void> {
  await rpc('save_profile', { p_username: p.username, p_display_name: p.display_name, p_emoji: p.emoji, p_color: p.color })
  await loadProfile()
}

/** Sugerencia de usuario a partir de un nombre o mail. */
export function suggestUsername(from: string): string {
  const base = from
    .split('@')[0]
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, '')
    .slice(0, 16)
  return base.length >= 3 ? base : (base + 'jugador').slice(0, 12)
}

export type FriendStatus = 'friend' | 'outgoing' | 'incoming' | null

export interface FoundUser extends PublicUser {
  friend_status: FriendStatus
}

export function searchUsers(q: string): Promise<FoundUser[]> {
  return rpc<FoundUser[] | null>('search_users', { p_query: q }).then((r) => r ?? [])
}

// ---------------------------------------------------------------------------
// Grupos

export type Role = 'owner' | 'admin' | 'member'

export interface MyGroup {
  code: string
  id: string
  name: string
  kind: 'group' | 'duo'
  emoji: string | null
  description: string | null
  is_public: boolean
  role: Role
  player_id: string | null
  joined_at: string
  members: number
  pending_requests: number
  /** Link corto (`/c/<slug>`). Puede faltar si el servidor todavía no tiene la migración de links. */
  slug?: string | null
  /** Si es el club de un lugar (bar, club, complejo de canchas). */
  venue?: Venue | null
}

/** Datos de un club de lugar: dirección y juegos que tiene (ids del catálogo). */
export interface Venue {
  address?: string | null
  games: string[]
}

let groupsState: { userId?: string; groups?: MyGroup[]; loading: boolean; error?: string } = { loading: false }
const groupListeners = new Set<() => void>()
function setGroups(next: typeof groupsState) {
  groupsState = next
  groupListeners.forEach((l) => l())
}

export async function refreshGroups(): Promise<MyGroup[]> {
  const uid = currentUserId()
  if (!uid) {
    setGroups({ loading: false })
    return []
  }
  setGroups({ ...groupsState, userId: uid, loading: true })
  try {
    const groups = (await rpc<MyGroup[] | null>('my_groups')) ?? []
    setGroups({ userId: uid, groups, loading: false })
    return groups
  } catch (e) {
    setGroups({ ...groupsState, userId: uid, loading: false, error: e instanceof Error ? e.message : String(e) })
    throw e
  }
}

/** Grupos de la cuenta: `undefined` mientras cargan. */
export function useMyGroups(): { groups: MyGroup[] | undefined; loading: boolean; error?: string } {
  const auth = useAuth()
  const uid = auth.session?.user.id
  const s = useSyncExternalStore(
    (l) => {
      groupListeners.add(l)
      return () => groupListeners.delete(l)
    },
    () => groupsState,
  )
  useEffect(() => {
    if (uid && s.userId !== uid && !s.loading) void refreshGroups().catch(() => {})
  }, [uid, s.userId, s.loading])
  if (!uid || s.userId !== uid) return { groups: undefined, loading: true }
  return { groups: s.groups, loading: s.loading, error: s.error }
}

/** El grupo activo, con los datos de la cuenta (rol, jugador...). */
export function useActiveGroup(): MyGroup | undefined {
  const sync = useSyncState()
  const { groups } = useMyGroups()
  return groups?.find((g) => g.code === sync.club?.code)
}

export function groupToClub(g: Pick<MyGroup, 'code' | 'name' | 'kind' | 'emoji'>): Club {
  return { code: g.code, name: g.name, kind: g.kind, emoji: g.emoji ?? undefined }
}

export async function switchToGroup(g: MyGroup): Promise<void> {
  await activateClub(groupToClub(g))
}

/** Crea un grupo y lo deja activo. `importLocal`: los datos de este dispositivo pasan al grupo. */
export async function createGroup(input: { name: string; description?: string; emoji?: string; isPublic: boolean; importLocal?: boolean }): Promise<MyGroup> {
  const code = await rpc<string>('create_group', {
    p_name: input.name,
    p_description: input.description ?? null,
    p_emoji: input.emoji ?? null,
    p_public: input.isPublic,
    p_with_player: !input.importLocal,
  })
  const groups = await refreshGroups()
  const g = groups.find((x) => x.code === code)
  if (!g) throw new Error('No encontramos el club recién creado. Recargá la app y debería aparecer.')
  if (input.importLocal) await adoptLocalData(groupToClub(g))
  else await switchToGroup(g)
  return g
}

export async function updateGroup(code: string, input: { name: string; description?: string; emoji?: string; isPublic: boolean }): Promise<void> {
  await rpc('update_group', { p_code: code, p_name: input.name, p_description: input.description ?? null, p_emoji: input.emoji ?? null, p_public: input.isPublic })
  await refreshGroups()
}

/** Pone, cambia o saca (`null`) el link corto del club. */
export async function setClubSlug(code: string, slug: string | null): Promise<void> {
  await rpc('set_club_slug', { p_code: code, p_slug: slug })
  await refreshGroups()
}

/** Hace del club un club de lugar, o deja de serlo con `null`. */
export async function setClubVenue(code: string, venue: Venue | null): Promise<void> {
  await rpc('set_club_venue', { p_code: code, p_venue: venue })
  await refreshGroups()
}

/** Lo que se ve de un club antes de entrar (por su código o por su link corto). Funciona sin cuenta. */
export interface ClubCard {
  code: string
  name: string
  emoji: string | null
  description: string | null
  slug: string | null
  venue: Venue | null
  members: number
}

/** `null` si no hay club con ese código o ese link. */
export async function findClubCard(target: { code: string } | { slug: string }): Promise<ClubCard | null> {
  if ('slug' in target) {
    const rows = await rpc<ClubCard[] | null>('club_by_slug', { p_slug: target.slug })
    return rows?.[0] ?? null
  }
  try {
    const rows = await rpc<ClubCard[] | null>('club_card', { p_code: target.code })
    return rows?.[0] ?? null
  } catch (e) {
    // Sin la migración de links, se cae al nombre solo (como antes).
    if (!/club_card/.test(e instanceof Error ? e.message : String(e))) throw e
    const name = await rpc<string | null>('get_club', { p_code: target.code })
    return name ? { code: target.code, name, emoji: null, description: null, slug: null, venue: null, members: 0 } : null
  }
}

export interface FoundGroup {
  id: string
  name: string
  emoji: string | null
  description: string | null
  members: number
  my_status: 'member' | 'pending' | null
}

export function searchGroups(q: string): Promise<FoundGroup[]> {
  return rpc<FoundGroup[] | null>('search_groups', { p_query: q }).then((r) => r ?? [])
}

export function requestJoin(groupId: string, message?: string): Promise<void> {
  return rpc('request_join', { p_group_id: groupId, p_message: message ?? null })
}

export function cancelJoinRequest(groupId: string): Promise<void> {
  return rpc('cancel_join_request', { p_group_id: groupId })
}

export interface JoinRequest extends PublicUser {
  request_id: number
  message: string | null
  created_at: string
}

export function groupRequests(code: string): Promise<JoinRequest[]> {
  return rpc<JoinRequest[] | null>('group_requests', { p_code: code }).then((r) => r ?? [])
}

export async function decideJoinRequest(requestId: number, accept: boolean): Promise<void> {
  await rpc('decide_join_request', { p_request_id: requestId, p_accept: accept })
  void refreshGroups().catch(() => {})
  void refreshNotifications()
}

export function inviteToGroup(code: string, userId: string): Promise<void> {
  return rpc('invite_to_group', { p_code: code, p_user: userId })
}

export async function respondGroupInvite(inviteId: number, accept: boolean): Promise<string | null> {
  const code = await rpc<string | null>('respond_group_invite', { p_invite_id: inviteId, p_accept: accept })
  await refreshGroups().catch(() => {})
  void refreshNotifications()
  return code
}

export interface Member extends PublicUser {
  role: Role
  player_id: string | null
  joined_at: string
}

export function groupMembers(code: string): Promise<Member[]> {
  return rpc<Member[] | null>('group_members', { p_code: code }).then((r) => r ?? [])
}

export function setMemberRole(code: string, userId: string, role: 'admin' | 'member'): Promise<void> {
  return rpc('set_member_role', { p_code: code, p_user: userId, p_role: role })
}

export function removeMember(code: string, userId: string): Promise<void> {
  return rpc('remove_member', { p_code: code, p_user: userId })
}

export async function leaveGroup(code: string): Promise<void> {
  await rpc('leave_group', { p_code: code })
  await refreshGroups().catch(() => {})
}

/** Crea tu jugador en el grupo con los datos de tu perfil. */
export async function ensureMyPlayer(code: string): Promise<string> {
  const id = await rpc<string>('ensure_my_player', { p_code: code })
  await refreshGroups().catch(() => {})
  return id
}

// ---------------------------------------------------------------------------
// Amigos

export interface Friend extends PublicUser {
  status: 'friend' | 'outgoing' | 'incoming'
  duo_code: string | null
  since: string
}

export function myFriends(): Promise<Friend[]> {
  return rpc<Friend[] | null>('my_friends').then((r) => r ?? [])
}

export function sendFriendRequest(userId: string): Promise<FriendStatus> {
  return rpc<FriendStatus>('send_friend_request', { p_user: userId })
}

export async function respondFriendRequest(userId: string, accept: boolean): Promise<void> {
  await rpc('respond_friend_request', { p_user: userId, p_accept: accept })
  void refreshNotifications()
}

export function removeFriend(userId: string): Promise<void> {
  return rpc('remove_friend', { p_user: userId })
}

/** Abre (y crea la primera vez) el mano a mano con un amigo, y lo deja como grupo activo. */
export async function openDuo(friendId: string): Promise<MyGroup> {
  const code = await rpc<string>('ensure_duo', { p_friend: friendId })
  const groups = await refreshGroups()
  const g = groups.find((x) => x.code === code)
  if (!g) throw new Error('No se encontró el mano a mano')
  await switchToGroup(g)
  return g
}

// ---------------------------------------------------------------------------
// Notificaciones

export interface WhoData {
  user_id: string
  username: string | null
  display_name: string
  emoji: string
  color: string
}

export type NotificationData = {
  group_id?: string
  name?: string
  emoji?: string
  request_id?: number
  invite_id?: number
  message?: string | null
  from?: WhoData
  by?: WhoData
}

export interface AppNotification {
  id: number
  kind: 'join_request' | 'join_accepted' | 'join_rejected' | 'group_invite' | 'invite_accepted' | 'friend_request' | 'friend_accepted' | 'removed' | string
  data: NotificationData
  read_at: string | null
  created_at: string
}

let notifState: { userId?: string; items: AppNotification[] } = { items: [] }
const notifListeners = new Set<() => void>()
function setNotifs(next: typeof notifState) {
  notifState = next
  notifListeners.forEach((l) => l())
}

export async function refreshNotifications(): Promise<void> {
  const uid = currentUserId()
  const sb = supabase()
  if (!uid || !sb) {
    setNotifs({ items: [] })
    return
  }
  const { data, error } = await sb.from('notifications').select('id, kind, data, read_at, created_at').order('created_at', { ascending: false }).limit(60)
  if (error) return
  const items = (data ?? []) as AppNotification[]
  const before = notifState.items
  setNotifs({ userId: uid, items })
  // Si llegó algo nuevo de grupos, refrescar la lista de grupos (p. ej. me aceptaron).
  if (before.length && items.some((n) => !before.some((b) => b.id === n.id) && ['join_accepted', 'invite_accepted', 'removed', 'join_request'].includes(n.kind))) {
    void refreshGroups().catch(() => {})
  }
}

export function useNotifications(): { items: AppNotification[]; unread: number } {
  const s = useSyncExternalStore(
    (l) => {
      notifListeners.add(l)
      return () => notifListeners.delete(l)
    },
    () => notifState,
  )
  const uid = useAuth().session?.user.id
  const items = s.userId === uid ? s.items : []
  return { items, unread: items.filter((n) => !n.read_at).length }
}

export async function markAllRead(): Promise<void> {
  const uid = currentUserId()
  if (!uid) return
  const now = new Date().toISOString()
  setNotifs({ ...notifState, items: notifState.items.map((n) => (n.read_at ? n : { ...n, read_at: now })) })
  await client().from('notifications').update({ read_at: now }).eq('user_id', uid).is('read_at', null)
}

export async function deleteNotification(id: number): Promise<void> {
  setNotifs({ ...notifState, items: notifState.items.filter((n) => n.id !== id) })
  await client().from('notifications').delete().eq('id', id)
}

let notifChannel: RealtimeChannel | null = null
let notifTimer: ReturnType<typeof setInterval> | undefined
let watchingUser: string | undefined

/** Avisos en tiempo real (si está disponible) y, por las dudas, cada 30 segundos. */
export function watchNotifications(userId: string | undefined) {
  if (watchingUser === userId) return
  watchingUser = userId
  const sb = supabase()
  if (notifChannel) void sb?.removeChannel(notifChannel)
  notifChannel = null
  clearInterval(notifTimer)
  if (!userId || !sb) {
    setNotifs({ items: [] })
    return
  }
  void refreshNotifications()
  notifChannel = sb
    .channel(`notifications-${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => void refreshNotifications())
    .subscribe()
  notifTimer = setInterval(() => {
    if (document.visibilityState === 'visible') void refreshNotifications()
  }, 30_000)
}

// ---------------------------------------------------------------------------
// Ranking global

export interface GlobalRow extends PublicUser {
  played: number
  wins: number
  gloria: number
  games_won: number
  groups: number
}

export function globalRanking(since?: number, gameId?: string): Promise<GlobalRow[]> {
  const weights = Object.fromEntries(BUILTIN_GAMES.map((g) => [g.id, g.weight]))
  return rpc<GlobalRow[] | null>('global_ranking', {
    p_since: since ? new Date(since).toISOString() : null,
    p_game: gameId ?? null,
    p_weights: weights,
  }).then((r) => r ?? [])
}

/** Un usuario como "jugador" para reusar los avatares. */
export function userAsPlayer(u: Pick<PublicUser, 'user_id' | 'display_name' | 'username' | 'emoji' | 'color'>) {
  return { id: u.user_id, name: u.display_name ?? u.username ?? '¿?', emoji: u.emoji ?? '🙂', color: u.color ?? '#3b82f6', createdAt: 0 }
}
