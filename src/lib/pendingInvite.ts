// La invitación que se abrió sin sesión: se guarda mientras la persona entra (también si el ingreso con Google
// sale de la app y vuelve) y, con la sesión lista, se retoma.

const KEY = 'game-board-pending-invite'

/** Ruta a retomar (`/unirse/abc?juego=pingpong`). Las versiones viejas guardaban sólo el código. */
export function readPendingInvite(): string | null {
  try {
    const v = sessionStorage.getItem(KEY)
    if (!v) return null
    return v.startsWith('/') ? v : `/unirse/${v}`
  } catch {
    return null
  }
}

export function savePendingInvite(path: string | null) {
  try {
    if (path === null) sessionStorage.removeItem(KEY)
    else sessionStorage.setItem(KEY, path)
  } catch {
    // ignorar
  }
}

/** El código del club de la invitación guardada, para mostrar a qué club se está entrando. */
export function pendingInviteCode(): string | undefined {
  return readPendingInvite()?.match(/^\/unirse\/([^/?]+)/)?.[1]
}
