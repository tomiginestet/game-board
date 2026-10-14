// Cómo se muestra y se carga un puntaje: número común o tiempo (carreras, natación).

import type { GameDef } from './games/schema'

/** 1514 → "25:14"; 3725 → "1:02:05". */
export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/** "25:14", "1:02:05", "25" (minutos) o "25,5" → segundos. `null` si no se entiende. */
export function parseTime(text: string): number | null {
  const t = text.trim().replace(',', '.')
  if (!t) return null
  if (/^\d+(\.\d+)?$/.test(t)) return Math.round(Number(t) * 60)
  const parts = t.split(/[:.'h]/).filter(Boolean)
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+$/.test(p))) return null
  const nums = parts.map(Number)
  if (nums.slice(1).some((n) => n >= 60)) return null
  return nums.reduce((acc, n) => acc * 60 + n, 0)
}

/** Puntaje listo para mostrar según el juego. */
export function formatScore(game: Pick<GameDef, 'scoring'> | undefined, value: number): string {
  return game?.scoring.time ? formatTime(value) : String(value)
}
