// Fechas de partidos programados (fixture de las ligas): cómo se muestran y cómo se cargan.

/** "sáb 18 oct · 20:00" (con el año si no es este). */
export function formatWhen(ts: number, now = new Date()): string {
  const d = new Date(ts)
  const day = d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' })
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  return `${day.replace(/\./g, '').replace(',', '')} · ${time}`
}

/** "sáb 18 oct" sin la hora (encabezado de una fecha del torneo). */
export function formatDay(ts: number, now = new Date()): string {
  const d = new Date(ts)
  return d
    .toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' })
    .replace(/\./g, '')
    .replace(',', '')
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Para un `<input type="datetime-local">`: "2026-10-18T20:00" en la hora del teléfono. */
export function toLocalInput(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Lo que devuelve un `<input type="datetime-local">`, como instante. `undefined` si está vacío o mal. */
export function fromLocalInput(value: string): number | undefined {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!m) return undefined
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime()
}

/** El próximo `weekday` (0 = domingo) a las `hour`:00, desde mañana. Para proponer la primera fecha. */
export function nextWeekday(weekday: number, hour: number, now = new Date()): number {
  const d = new Date(now)
  d.setHours(hour, 0, 0, 0)
  d.setDate(d.getDate() + 1)
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1)
  return d.getTime()
}
