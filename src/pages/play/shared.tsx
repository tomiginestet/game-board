import { QuestionIcon } from '@phosphor-icons/react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { ErrorText } from '../../components/Feedback'
import { sideName } from '../../components/GameBits'
import { type LiveState } from '../../lib/engine'
import { useModal } from '../../lib/feedback'
import type { EventDef } from '../../lib/games/schema'
import type { Id, Play, Player } from '../../lib/types'

/** Botón "?" que muestra la ayuda de cada evento en pantalla (el `title` no se ve en el celular). */
export function HelpToggle({ on, onChange, controls }: { on: boolean; onChange: (v: boolean) => void; controls?: string }) {
  return (
    <button type="button" className="help-toggle" aria-pressed={on} aria-controls={controls} onClick={() => onChange(!on)}>
      <QuestionIcon weight={on ? 'fill' : 'regular'} aria-hidden="true" />
      {on ? 'Ocultar ayuda' : 'Qué es cada uno'}
    </button>
  )
}

/** Anuncia el marcador a los lectores de pantalla cada vez que cambia ("Ana 7, Beto 5"). */
export function ScoreAnnouncer({ play, live, players }: { play: Play; live: LiveState; players: Map<Id, Player> }) {
  const text = play.log.length ? play.sides.map((side, i) => `${sideName(side, players)} ${live.scores[i]}`).join(', ') : ''
  return (
    <p className="sr-only" aria-live="polite">
      {text}
    </p>
  )
}

/** Pide los puntos de un evento que los define en el momento (falta envido, bonus). */
export function PointsDialog({ event, suggestion, onSubmit, onCancel }: { event: EventDef; suggestion?: number; onSubmit: (points: number) => void; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  const id = useId()
  const [raw, setRaw] = useState(suggestion !== undefined ? String(suggestion) : '')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = raw.trim().replace(',', '.')
    const n = Number(text)
    if (!text || !isFinite(n)) {
      setError('Escribí un número, por ejemplo 3.')
      return
    }
    onSubmit(n)
  }

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <form className="confirm-body" onSubmit={submit} noValidate>
        <h2 id={`${id}-title`}>
          {event.emoji} ¿Cuántos puntos vale “{event.name}”?
        </h2>
        <div className="field">
          <label htmlFor={`${id}-input`}>Puntos</label>
          <input
            id={`${id}-input`}
            className="input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value)
              setError('')
            }}
            onFocus={(e) => e.target.select()}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <div id={`${id}-error`}>
            <ErrorText>{error}</ErrorText>
          </div>
        </div>
        <div className="confirm-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn primary">
            Anotar puntos
          </button>
        </div>
      </form>
    </dialog>
  )
}

// ---------------------------------------------------------------------------
// Marcador en vivo
