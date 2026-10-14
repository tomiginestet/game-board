import { useId, useRef, useState, type FormEvent } from 'react'
import { ErrorText } from '../../components/Feedback'
import { sideName } from '../../components/GameBits'
import { type LiveState } from '../../lib/engine'
import { useModal } from '../../lib/feedback'
import type { EventDef } from '../../lib/games/schema'
import type { Id, Play, Player } from '../../lib/types'


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

/**
 * "¿Quién hizo el gol?": los jugadores del lado como botones grandes (un toque y listo) y, si el juego
 * lleva asistencias, un segundo paso "¿Quién dio el pase?". Siempre se puede seguir sin decir quién.
 * `extra`: integrantes del equipo fijo que no estaban en la partida (se suman al elegirlos).
 */
export function WhoDialog({
  title,
  assistTitle,
  people,
  extra = [],
  onSubmit,
  onCancel,
}: {
  title: string
  /** Si viene, después del autor se pregunta por la asistencia. */
  assistTitle?: string
  people: Player[]
  extra?: Player[]
  onSubmit: (who: { pl?: Id; as?: Id }) => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  const id = useId()
  // `undefined`: todavía se elige el autor; `null`: autor sin nombre.
  const [author, setAuthor] = useState<Id | null | undefined>(undefined)
  const step = author === undefined ? 'author' : 'assist'
  const pick = (who: Id | null) => {
    if (step === 'author') {
      // Sin autor no tiene sentido preguntar por el pase.
      if (!assistTitle || !who) return onSubmit(who ? { pl: who } : {})
      return setAuthor(who)
    }
    onSubmit({ ...(author ? { pl: author } : {}), ...(who ? { as: who } : {}) })
  }
  const list = step === 'author' ? [...people, ...extra] : [...people, ...extra].filter((p) => p.id !== author)
  return (
    <dialog
      ref={ref}
      className="confirm-dialog who-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="confirm-body">
        <h2 id={`${id}-title`}>{step === 'author' ? title : assistTitle}</h2>
        <div className="who-grid" role="group" aria-labelledby={`${id}-title`}>
          {list.map((p) => (
            <button key={p.id} type="button" className="who-btn" style={{ ['--pc' as string]: p.color }} onClick={() => pick(p.id)}>
              <span className="who-emoji" aria-hidden="true">
                {p.emoji}
              </span>
              <span className="ellipsis">{p.name}</span>
              {extra.some((x) => x.id === p.id) && <span className="muted small">del plantel</span>}
            </button>
          ))}
        </div>
        <div className="confirm-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn primary" onClick={() => pick(null)}>
            {step === 'author' ? 'Anotar sin nombre' : 'Sin asistencia'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
