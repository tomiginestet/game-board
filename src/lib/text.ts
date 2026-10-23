/** Errores contados en criollo: qué pasó y cómo seguir (los plurales están en `hooks.ts`). */

import { skin } from '../skins'

const GENERIC = 'Algo salió mal. Probá de nuevo en un rato.'

/** Errores conocidos (de la red, de Supabase o del servidor) traducidos a qué pasó y cómo seguir. */
const KNOWN: [RegExp, string][] = [
  [/failed to fetch|network ?error|network request failed|load failed|fetch|ERR_INTERNET|offline/i, 'No hay conexión. Revisá internet y probá de nuevo; lo que anotaste queda guardado en el teléfono.'],
  [/rate limit|too many requests|429|security purposes/i, 'Hubo muchos intentos seguidos. Esperá un minuto y probá de nuevo.'],
  [/otp|token has expired|token.*(invalid|expired)|invalid.*code/i, 'El código venció o no es correcto. Pedí uno nuevo con "Usar otro mail".'],
  [/jwt|refresh token|not authenticated|session.*(missing|expired)|auth session/i, 'Tu sesión venció. Volvé a entrar con tu cuenta.'],
  [/invalid.*email|email.*invalid|unable to validate email/i, 'Revisá el mail: parece que le falta algo.'],
  [/permission denied|row-level security|not allowed|forbidden|403/i, 'No tenés permiso para hacer eso en este club.'],
  [/duplicate key|already exists|unique constraint/i, 'Eso ya existe. Probá con otro nombre.'],
  [/club inexistente|no existe un club/i, 'No encontramos ese club. Revisá que el link o el código estén completos.'],
  [/json|unexpected token|syntaxerror|formato de datos inválido/i, `No pudimos leer esos datos: el formato no es el de ${skin.name}.`],
  [/lote inválido|cambio inválido|elemento demasiado grande|pedido inválido/i, 'No pudimos guardar ese cambio. Probá de nuevo; si sigue pasando, recargá la app.'],
  [/no están configuradas|VITE_|no está configurada/i, 'Esto no está disponible en esta versión de la app.'],
]

/** Palabras que delatan un mensaje técnico o en inglés: mejor no mostrarlo tal cual. */
const TECHNICAL = /\b(the|is|was|not|failed|error|invalid|unable|cannot|could|undefined|null|exception|status|code \d+)\b/i

export function friendlyError(e: unknown): string {
  const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : e && typeof e === 'object' && 'message' in e ? String((e as { message: unknown }).message) : ''
  const msg = raw.trim()
  if (!msg) return GENERIC
  for (const [re, text] of KNOWN) if (re.test(msg)) return text
  // Los mensajes propios (en castellano, pensados para la gente) pasan tal cual.
  return TECHNICAL.test(msg) ? GENERIC : msg
}
