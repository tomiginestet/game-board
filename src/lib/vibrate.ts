/** Vibración corta al anotar (si el teléfono la soporta). */
export function vibrate(ms = 15) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // no soportado
  }
}
