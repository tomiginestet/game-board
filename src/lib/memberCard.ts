// Carnet de socio: lo que se muestra en el pase de cada club (número, antigüedad y el QR para sumar a otros).

import qrcode from 'qrcode-generator'
import { membershipDays } from './medals'

/** Número de socio: el orden en que se sumó cada cuenta al club (el primero es el 1). */
export function memberNumber(members: { user_id: string; joined_at: string }[], userId: string): number | undefined {
  const sorted = [...members].sort((a, b) => Date.parse(a.joined_at) - Date.parse(b.joined_at) || a.user_id.localeCompare(b.user_id))
  const i = sorted.findIndex((m) => m.user_id === userId)
  return i < 0 ? undefined : i + 1
}

/** "007": el número con ceros adelante, como en un carnet de verdad. */
export const padNumber = (n: number) => String(n).padStart(3, '0')

/** Antigüedad en palabras: "Hoy", "12 días", "3 semanas", "5 meses", "1 año y 2 meses". */
export function seniorityLabel(days: number): string {
  if (days < 1) return 'Desde hoy'
  if (days < 14) return days === 1 ? '1 día' : `${days} días`
  if (days < 60) return `${Math.floor(days / 7)} semanas`
  const months = Math.floor(days / 30.4)
  if (months < 12) return `${months} meses`
  const years = Math.floor(months / 12), rest = months % 12
  const y = years === 1 ? '1 año' : `${years} años`
  return rest ? `${y} y ${rest === 1 ? '1 mes' : `${rest} meses`}` : y
}

/** Antigüedad desde la fecha en que se sumó. */
export const seniorityOf = (joinedAt: string, now = Date.now()) => seniorityLabel(membershipDays(joinedAt, now))

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** "14 oct 2026", corto como en un pase. */
export function sinceLabel(joinedAt: string): string {
  const d = new Date(joinedAt)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** Código QR como un solo path (un cuadrado de 1×1 por módulo) y su lado en módulos, sin margen. */
export function qrPath(text: string): { size: number; d: string } {
  const q = qrcode(0, 'M')
  q.addData(text)
  q.make()
  const size = q.getModuleCount()
  let d = ''
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (q.isDark(y, x)) d += `M${x} ${y}h1v1h-1z`
  return { size, d }
}
