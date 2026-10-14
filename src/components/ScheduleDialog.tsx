import { useId, useRef, useState, type FormEvent } from 'react'
import { useModal } from '../lib/feedback'
import { fromLocalInput, toLocalInput } from '../lib/schedule'
import { actions } from '../lib/store'
import type { Play } from '../lib/types'

/** Cambiar el día, la hora o la cancha de un partido del fixture. */
export function ScheduleDialog({ play, title, venues = [], onClose }: { play: Play; title: string; venues?: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  const id = useId()
  const [when, setWhen] = useState(play.scheduledAt ? toLocalInput(play.scheduledAt) : '')
  const [venue, setVenue] = useState(play.venue ?? '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    actions.schedulePlay(play.id, { scheduledAt: fromLocalInput(when) ?? null, venue: venue.trim() || null })
    onClose()
  }

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="confirm-body" onSubmit={submit}>
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="field">
          <label htmlFor={`${id}-when`}>Día y hora</label>
          <input id={`${id}-when`} className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-venue`}>Cancha</label>
          <input id={`${id}-venue`} className="input" list={`${id}-venues`} value={venue} maxLength={60} placeholder="Cancha 1" onChange={(e) => setVenue(e.target.value)} />
          <datalist id={`${id}-venues`}>
            {venues.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>
        <div className="confirm-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn primary">
            Guardar
          </button>
        </div>
      </form>
    </dialog>
  )
}
