// Cuentas (opcionales). Sin cuenta la app funciona igual, con clubes por link.
// Con cuenta: tus clubes quedan guardados para entrar desde cualquier dispositivo,
// y podés decir qué jugador sos en cada club.

import type { Session } from '@supabase/supabase-js'
import { useEffect, useSyncExternalStore } from 'react'
import { supabase, syncAvailable } from './sync'

export interface AuthState {
  ready: boolean
  session: Session | null
}

let state: AuthState = { ready: !syncAvailable, session: null }
const listeners = new Set<() => void>()

function set(next: Partial<AuthState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

let started = false
export function startAuth() {
  if (started) return
  started = true
  const sb = supabase()
  if (!sb) return
  void sb.auth.getSession().then(({ data }) => set({ ready: true, session: data.session }))
  sb.auth.onAuthStateChange((_event, session) => set({ ready: true, session }))
}

export function useAuth(): AuthState {
  useEffect(startAuth, [])
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export function currentUserId(): string | undefined {
  return state.session?.user.id
}

function client() {
  const sb = supabase()
  if (!sb) throw new Error('Las cuentas no están configuradas')
  return sb
}

function redirectTo(): string {
  return window.location.href.split('#')[0]
}

/** Manda un mail con un link (y un código) para entrar. */
export async function signInWithEmail(email: string): Promise<void> {
  const { error } = await client().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo() } })
  if (error) throw new Error(error.message)
}

/** Entrar con el código de 6 dígitos del mail (si la plantilla del mail lo incluye). */
export async function verifyEmailCode(email: string, token: string): Promise<void> {
  const { error } = await client().auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' })
  if (error) throw new Error(error.message)
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await client().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })
  if (error) throw new Error(error.message)
}

export async function signOut(): Promise<void> {
  await client().auth.signOut()
}

export interface MyClub {
  code: string
  name: string
  player_id: string | null
  joined_at: string
}

export async function myClubs(): Promise<MyClub[]> {
  const { data, error } = await client().rpc('my_clubs')
  if (error) throw new Error(error.message)
  return (data ?? []) as MyClub[]
}

/** Guarda un club en la cuenta. No hace nada si no hay sesión. */
export async function linkClub(code: string): Promise<void> {
  if (!state.session) return
  const { error } = await client().rpc('link_club', { p_code: code })
  if (error) throw new Error(error.message)
}

export async function unlinkClub(code: string): Promise<void> {
  const uid = currentUserId()
  if (!uid) return
  const { error } = await client().from('memberships').delete().eq('user_id', uid).eq('club_code', code)
  if (error) throw new Error(error.message)
}

/** "Este jugador soy yo" en un club (o null para desvincular). */
export async function claimPlayer(code: string, playerId: string | null): Promise<void> {
  const { error } = await client().rpc('claim_player', { p_code: code, p_player_id: playerId })
  if (error) throw new Error(error.message)
}

/** Ids de los jugadores del club que ya tienen cuenta. */
export async function claimedPlayers(code: string): Promise<string[]> {
  const { data, error } = await client().rpc('claimed_players', { p_code: code })
  if (error) throw new Error(error.message)
  return ((data ?? []) as { player_id: string }[]).map((r) => r.player_id)
}

export async function aiSpentThisMonth(): Promise<number> {
  const { data, error } = await client().rpc('ai_spent_this_month')
  if (error) throw new Error(error.message)
  return Number(data ?? 0)
}
