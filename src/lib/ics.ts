// Agendar un partido: archivo de calendario (.ics, con recordatorio) o link de Google Calendar.

const pad = (n: number) => String(n).padStart(2, '0')

/** 20261021T230000Z */
function utc(ts: number): string {
  const d = new Date(ts)
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

export interface CalendarEvent {
  id: string
  title: string
  start: number
  minutes: number
  location?: string
  description?: string
  /** Minutos antes para el aviso del teléfono. */
  remindBefore?: number
}

export function icsText(ev: CalendarEvent): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Game Board//Convocatorias//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}@game-board`,
    `DTSTAMP:${utc(Date.now())}`,
    `DTSTART:${utc(ev.start)}`,
    `DTEND:${utc(ev.start + ev.minutes * 60_000)}`,
    `SUMMARY:${esc(ev.title)}`,
    ...(ev.location ? [`LOCATION:${esc(ev.location)}`] : []),
    ...(ev.description ? [`DESCRIPTION:${esc(ev.description)}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(ev.title)}`,
    `TRIGGER:-PT${ev.remindBefore ?? 120}M`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}

/** Baja el .ics: en el teléfono se abre el calendario para agregarlo. */
export function downloadIcs(ev: CalendarEvent) {
  const blob = new Blob([icsText(ev)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'partido.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${utc(ev.start)}/${utc(ev.start + ev.minutes * 60_000)}`,
    ...(ev.location ? { location: ev.location } : {}),
    ...(ev.description ? { details: ev.description } : {}),
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}
