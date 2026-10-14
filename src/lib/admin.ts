// Panel de administración. Todo pasa por funciones `admin_*` de Supabase, que verifican
// en el servidor que la cuenta sea admin y que haya entrado con Google: esconder la
// pantalla no alcanza (ver supabase/migrations/20261015000000_admin.sql).

import { useEffect, useState } from 'react'
import { useAuth } from './auth'
import { toast } from './feedback'
import { friendlyError } from './text'
import { supabase } from './sync'

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const sb = supabase()
  if (!sb) throw new Error('Las cuentas no están disponibles en esta versión de la app')
  const { data, error } = await sb.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

/** `undefined` mientras se fija. */
export function useIsAdmin(): boolean | undefined {
  const uid = useAuth().session?.user.id
  const [state, setState] = useState<{ uid?: string; admin?: boolean }>({})
  useEffect(() => {
    if (!uid) return
    let alive = true
    rpc<boolean>('is_app_admin')
      .then((admin) => alive && setState({ uid, admin: !!admin }))
      .catch(() => alive && setState({ uid, admin: false }))
    return () => {
      alive = false
    }
  }, [uid])
  if (!uid) return false
  return state.uid === uid ? state.admin : undefined
}

// ---------------------------------------------------------------------------
// Tipos (lo que devuelven las funciones)

export interface Totals {
  users: number
  users_7d: number
  profiles: number
  active_1d: number
  active_7d: number
  active_28d: number
  groups: number
  duos: number
  groups_7d: number
  public_groups: number
  plays: number
  plays_7d: number
  active_groups_7d: number
  active_groups_28d: number
  custom_games: number
  ai_month_usd: number
  ai_month_calls: number
  open_reports: number
  trash: number
}

export interface DailyRow {
  day: string
  signups: number
  active: number
  plays: number
  groups: number
}

export interface WeeklyRow {
  semana: string
  clubes_activos: number
  mano_a_mano_activos: number
  partidas: number
  clubes_nuevos: number
  cuentas_nuevas: number
  juegos_con_ia: number
  gasto_ia_usd: number
}

export interface GameStat {
  juego: string
  nombre: string
  partidas: number
  partidas_30_dias: number
  clubes: number
  ultima_partida: string
}

export interface RetentionRow {
  semana_de_inicio: string
  clubes: number
  semana_1: number | null
  semana_2: number | null
  semana_3: number | null
  semana_4: number | null
}

export interface Overview {
  purged: number
  totals: Totals
  daily: DailyRow[]
  weekly: WeeklyRow[]
  games: GameStat[]
  retention: RetentionRow[]
}

export interface AdminUser {
  user_id: string
  email: string | null
  providers: string[]
  created_at: string
  last_sign_in_at: string | null
  banned: boolean
  deleted: boolean
  is_admin: boolean
  username: string | null
  display_name: string | null
  emoji: string | null
  color: string | null
  clubs: number
  games_created: number
  plays_created: number
  ai_usd: number
  last_active: string | null
  ai_blocked: boolean
}

export interface LogEntry {
  id: number
  at: string
  admin_id: string | null
  admin?: string
  action: string
  target_kind: string | null
  target_id: string | null
  label: string | null
  details: Record<string, unknown>
  trash_id: number | null
}

export interface Report {
  id: number
  reporter: string | null
  reporter_label?: string | null
  target_kind: 'user' | 'group' | 'game'
  target: Record<string, string>
  target_label?: string | null
  club_code?: string | null
  reason: string
  status: 'open' | 'resolved' | 'dismissed'
  created_at: string
}

export interface AdminUserDetail extends AdminUser {
  memberships: { code: string; name: string; emoji: string | null; kind: string; role: string; player_id: string | null; joined_at: string }[]
  friends: number
  games: { code: string; club: string; id: string; name: string | null; emoji: string | null; updated_at: string }[]
  ai: { at: string; model: string; usd: number }[]
  activity_days: number
  reports_about: Report[]
  log: LogEntry[]
}

export interface AdminClub {
  code: string
  id: string
  name: string
  kind: 'group' | 'duo'
  emoji: string | null
  description: string | null
  is_public: boolean
  created_at: string
  disabled_at: string | null
  owner_id: string | null
  owner: string | null
  members: number
  players: number
  plays: number
  games: number
  cups: number
  last_activity: string | null
  open_reports: number
}

export interface AdminPlay {
  kind: 'play' | 'match'
  id: string
  gameId: string
  status: string | null
  createdAt: number | null
  finishedAt: number | null
  players: string[]
  places: number[] | null
  winner: string | null
  author: string | null
}

export interface AdminClubDetail extends Omit<AdminClub, 'members' | 'players' | 'plays' | 'games' | 'cups'> {
  members: { user_id: string; label: string; email: string | null; emoji: string | null; color: string | null; role: string; player_id: string | null; joined_at: string }[]
  players: { id: string; name: string; emoji: string; color: string }[]
  games: { id: string; name: string | null; emoji: string | null; createdAt: number | null; created_by: string | null; author: string | null; updated_at: string; plays: number }[]
  plays: AdminPlay[]
  cups: { kind: 'cup' | 'tournament'; id: string; name: string | null; gameId: string; createdAt: number | null }[]
  counts: Record<string, number>
  pending_requests: number
  reports: Report[]
  log: LogEntry[]
}

export interface AdminGame {
  code: string
  club: string
  club_emoji: string | null
  id: string
  name: string | null
  emoji: string | null
  category: string | null
  createdAt: number | null
  updated_at: string
  created_by: string | null
  author: string | null
  plays: number
  open_reports: number
}

export interface TrashItem {
  id: number
  kind: 'entity' | 'club' | 'member' | 'user'
  label: string
  ref: Record<string, string>
  reason: string | null
  deleted_at: string
  purge_after: string
  restored_at: string | null
  purged_at: string | null
  deleted_by: string | null
}

export interface AiUsage {
  months: { month: string; calls: number; usd: number }[]
  by_user: { user_id: string | null; label: string; calls: number; usd: number; ai_blocked: boolean }[]
  recent: { at: string; model: string; usd: number; input_tokens: number; output_tokens: number; label: string }[]
}

export interface AiSetting {
  enabled: boolean
  monthly_limit_usd?: number | null
  daily_per_user?: number | null
}

export interface Announcement {
  text: string | null
  level?: 'info' | 'warn'
  until?: string | null
}

export interface Settings {
  ai?: AiSetting
  announcement?: Announcement
}

export interface Health {
  empty_clubs: { code: string; name: string; kind: string; created_at: string }[]
  abandoned_clubs: { code: string; name: string; kind: string; last: string }[]
  disabled_clubs: { code: string; name: string; kind: string; disabled_at: string }[]
  ownerless_clubs: { code: string; name: string; kind: string; members: number }[]
  no_profile: { user_id: string; email: string | null; created_at: string }[]
  broken_plays: { code: string; club: string; id: string; gameId: string | null }[]
  stale_live: { code: string; club: string; id: string; gameId: string | null; updated_at: string }[]
  big_entities: { code: string; kind: string; id: string; bytes: number }[]
  pending_requests_old: number
}

// ---------------------------------------------------------------------------
// Llamadas

export const admin = {
  overview: () => rpc<Overview>('admin_overview'),
  users: (q = '') => rpc<AdminUser[]>('admin_users', { p_query: q }),
  user: (id: string) => rpc<AdminUserDetail>('admin_user', { p_user: id }),
  setBanned: (id: string, banned: boolean) => rpc<void>('admin_set_banned', { p_user: id, p_banned: banned }),
  setAiBlocked: (id: string, blocked: boolean) => rpc<void>('admin_set_ai_blocked', { p_user: id, p_blocked: blocked }),
  clubs: (q = '') => rpc<AdminClub[]>('admin_clubs', { p_query: q }),
  club: (code: string) => rpc<AdminClubDetail>('admin_club', { p_code: code }),
  updateClub: (code: string, c: { name: string; description: string; emoji: string; is_public: boolean }) =>
    rpc<void>('admin_update_club', { p_code: code, p_name: c.name, p_description: c.description, p_emoji: c.emoji, p_public: c.is_public }),
  setClubOwner: (code: string, user: string) => rpc<void>('admin_set_club_owner', { p_code: code, p_user: user }),
  setClubDisabled: (code: string, disabled: boolean) => rpc<void>('admin_set_club_disabled', { p_code: code, p_disabled: disabled }),
  games: (q = '') => rpc<AdminGame[]>('admin_games', { p_query: q }),
  entity: (code: string, kind: string, id: string) =>
    rpc<{ data: Record<string, unknown> | null; deleted: boolean; updated_at: string; author: string | null } | null>('admin_entity', { p_code: code, p_kind: kind, p_id: id }),
  deleteEntity: (code: string, kind: string, id: string) => rpc<number>('admin_trash_entity', { p_code: code, p_kind: kind, p_id: id }),
  trash: () => rpc<TrashItem[]>('admin_trash_list'),
  restore: (id: number) => rpc<void>('admin_restore', { p_id: id }),
  purge: (id: number) => rpc<void>('admin_purge', { p_id: id }),
  log: (limit = 200) => rpc<LogEntry[]>('admin_log_list', { p_limit: limit }),
  reports: (status: 'open' | 'all' = 'open') => rpc<Report[]>('admin_reports', { p_status: status }),
  resolveReport: (id: number, status: Report['status']) => rpc<void>('admin_resolve_report', { p_id: id, p_status: status }),
  aiUsage: () => rpc<AiUsage>('admin_ai_usage'),
  settings: () => rpc<Settings>('admin_settings'),
  saveSetting: (key: keyof Settings, value: AiSetting | Announcement) => rpc<void>('admin_save_setting', { p_key: key, p_value: value }),
  sendMessage: (target: 'all' | 'club' | 'user', ref: string | null, title: string, message: string) =>
    rpc<number>('admin_send_message', { p_target: target, p_ref: ref, p_title: title, p_message: message }),
  health: () => rpc<Health>('admin_health'),
  exportClub: (code: string) => rpc<unknown>('admin_export_club', { p_code: code }),
  exportUser: (id: string) => rpc<unknown>('admin_export_user', { p_user: id }),
}

/** Carga algo del panel y lo vuelve a cargar con `reload()`. */
export function useAdminData<T>(load: () => Promise<T>, deps: unknown[]): { data?: T; error: string; loading: boolean; reload: () => void } {
  const [state, setState] = useState<{ data?: T; error: string; loading: boolean }>({ error: '', loading: true })
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: '' }))
    load()
      .then((data) => alive && setState({ data, error: '', loading: false }))
      .catch((e: unknown) => alive && setState((s) => ({ ...s, error: e instanceof Error ? e.message : String(e), loading: false })))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])
  return { ...state, reload: () => setTick((t) => t + 1) }
}

export function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

const ACTIONS: Record<string, string> = {
  ban_user: 'Desactivó la cuenta',
  unban_user: 'Reactivó la cuenta',
  block_ai: 'Le cortó la IA',
  unblock_ai: 'Le devolvió la IA',
  update_club: 'Editó el club',
  set_owner: 'Cambió el dueño',
  remove_member: 'Sacó del club',
  disable_club: 'Desactivó el club',
  enable_club: 'Reactivó el club',
  trash_game: 'Borró el juego',
  trash_play: 'Borró la partida',
  trash_match: 'Borró el partido',
  trash_player: 'Borró el jugador',
  trash_cup: 'Borró el torneo',
  trash_tournament: 'Borró el torneo',
  restore_entity: 'Recuperó',
  purge_entity: 'Borró para siempre',
  purge_club: 'Borró para siempre el club',
  purge_member: 'Descartó',
  report_resolved: 'Resolvió un reporte',
  report_dismissed: 'Descartó un reporte',
  report_open: 'Reabrió un reporte',
  setting_ai: 'Cambió la IA',
  setting_announcement: 'Cambió el anuncio',
  message: 'Mandó un mensaje',
}

export function actionLabel(action: string): string {
  return ACTIONS[action] ?? action
}

export function userName(u: Pick<AdminUser, 'display_name' | 'username' | 'email'>): string {
  return u.display_name ?? u.username ?? u.email ?? 'Sin nombre'
}

/** Corre una acción del panel y avisa; si devuelve el id de la papelera, ofrece Deshacer. */
export async function runAdmin(label: string, fn: () => Promise<unknown>, after?: () => void): Promise<boolean> {
  try {
    const trashId = await fn()
    after?.()
    if (typeof trashId === 'number') {
      toast(label, {
        label: 'Deshacer',
        run: () =>
          void admin
            .restore(trashId)
            .then(() => (toast('Listo, lo recuperamos'), after?.()))
            .catch((e) => toast(friendlyError(e))),
      })
    } else {
      toast(label)
    }
    return true
  } catch (e) {
    toast(friendlyError(e))
    return false
  }
}
