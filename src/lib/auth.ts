// Cuentas. Con cuenta: tu perfil, tus grupos (en cualquier dispositivo), amigos,
// notificaciones y ranking global. Sin cuenta ("modo invitado") la app funciona
// como antes: datos en el dispositivo y, si querés, un club por link.

import type { Session } from '@supabase/supabase-js'
import { useEffect, useSyncExternalStore } from 'react'
import { clearScopes } from './store'
import { deactivateClub, supabase, syncAvailable, syncNow } from './sync'

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

/** Plan B: ir a Google y volver (Google muestra el dominio de Supabase). */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await client().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })
  if (error) throw new Error(error.message)
}

// ---------------------------------------------------------------------------
// Botón oficial de Google dentro de la app: Google muestra el dominio de la app
// (no el de Supabase) y no hay redirecciones. Le pasa a Supabase el token de Google.

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
export const googleButtonAvailable = !!GOOGLE_CLIENT_ID

interface GoogleId {
  initialize(config: { client_id: string; callback: (r: { credential: string }) => void; nonce: string; ux_mode: 'popup' }): void
  renderButton(el: HTMLElement, options: Record<string, string | number>): void
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } }
  }
}

let gsiScript: Promise<GoogleId> | undefined
function loadGsi(): Promise<GoogleId> {
  gsiScript ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => (window.google ? resolve(window.google.accounts.id) : reject(new Error('No cargó Google')))
    s.onerror = () => {
      gsiScript = undefined
      reject(new Error('No cargó Google'))
    }
    document.head.appendChild(s)
  })
  return gsiScript
}

async function sha256Hex(text: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Dibuja el botón de Google en `el`. Al elegir la cuenta, entra a Supabase con ese token. */
export async function renderGoogleButton(el: HTMLElement, onError: (message: string) => void): Promise<void> {
  if (!GOOGLE_CLIENT_ID) throw new Error('Falta VITE_GOOGLE_CLIENT_ID')
  const gsi = await loadGsi()
  // Google firma el hash del nonce; Supabase recibe el original y verifica que coincidan.
  const nonce = crypto.randomUUID()
  gsi.initialize({
    client_id: GOOGLE_CLIENT_ID,
    nonce: await sha256Hex(nonce),
    ux_mode: 'popup',
    callback: ({ credential }) => {
      void client()
        .auth.signInWithIdToken({ provider: 'google', token: credential, nonce })
        .then(({ error }) => error && onError(error.message))
    },
  })
  gsi.renderButton(el, {
    theme: 'filled_black',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    locale: 'es',
    width: Math.min(400, Math.max(200, el.clientWidth)),
  })
}

/** Cierra la sesión y borra de este dispositivo las copias de los grupos de la cuenta. */
export async function signOut(): Promise<void> {
  // Lo pendiente del grupo activo se sube antes de salir.
  await syncNow().catch(() => {})
  await client().auth.signOut()
  deactivateClub()
  clearScopes()
  setGuest(false)
}

// ---------------------------------------------------------------------------
// Modo invitado (sin cuenta)

const GUEST_KEY = 'game-board-guest-v1'
let guest = (() => {
  try {
    return localStorage.getItem(GUEST_KEY) === '1'
  } catch {
    return false
  }
})()
const guestListeners = new Set<() => void>()

export function setGuest(on: boolean) {
  guest = on
  try {
    if (on) localStorage.setItem(GUEST_KEY, '1')
    else localStorage.removeItem(GUEST_KEY)
  } catch {
    // ignorar
  }
  guestListeners.forEach((l) => l())
}

export function useGuest(): boolean {
  return useSyncExternalStore(
    (l) => {
      guestListeners.add(l)
      return () => guestListeners.delete(l)
    },
    () => guest,
  )
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
