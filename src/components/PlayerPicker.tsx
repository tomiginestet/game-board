import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Id, Player } from '../lib/pingpong/types'
import { Avatar } from './Avatar'

interface Props {
  players: Player[]
  selected: Id[]
  onToggle: (id: Id) => void
  /** Etiqueta opcional para cada jugador seleccionado (p. ej. "1" / "2"). */
  badge?: (id: Id) => ReactNode
  /** Nombre del grupo para lectores de pantalla. */
  label?: string
}

/** Selección múltiple de jugadores: cada uno es un botón que se prende y se apaga (aria-pressed). */
export function PlayerPicker({ players, selected, onToggle, badge, label = 'Jugadores' }: Props) {
  if (!players.length) {
    return (
      <div className="empty">
        Todavía no hay jugadores. <Link to="/jugadores">Creá algunos</Link> para empezar.
      </div>
    )
  }
  return (
    <div className="picker" role="group" aria-label={label}>
      {players.map((p) => {
        const isSel = selected.includes(p.id)
        const b = badge?.(p.id)
        return (
          <button
            key={p.id}
            type="button"
            className={'picker-item' + (isSel ? ' active' : '')}
            aria-pressed={isSel}
            onClick={() => onToggle(p.id)}
            style={isSel ? { borderColor: p.color } : undefined}
          >
            <Avatar player={p} size={44} />
            <span className="picker-name">{p.name}</span>
            {b && (
              <span className="picker-badge" style={{ borderColor: p.color }}>
                {b}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface Choice<T> {
  value: T
  content: ReactNode
  /** Nombre accesible cuando el contenido no alcanza (p. ej. un color). */
  ariaLabel?: string
  title?: string
  className?: string
  style?: CSSProperties
}

/**
 * Elección única (segmentados, formatos, emojis, colores): radiogroup con botones.
 * Sólo la opción elegida entra en el orden de tabulación; las flechas, Inicio y Fin mueven y eligen.
 * Mantiene la clase `.active` para los estilos existentes.
 */
export function ChoiceGroup<T extends string | number | boolean>({
  value,
  onChange,
  options,
  label,
  labelledBy,
  className,
  itemClassName = '',
}: {
  value: T
  onChange: (v: T) => void
  options: Choice<T>[]
  label?: string
  labelledBy?: string
  className?: string
  itemClassName?: string
}) {
  const current = options.findIndex((o) => o.value === value)
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = options.length
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const j = (next + n) % n
    onChange(options[j].value)
    const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    buttons?.[j]?.focus()
  }
  return (
    <div className={className} role="radiogroup" aria-label={label} aria-labelledby={labelledBy}>
      {options.map((o, i) => {
        const checked = i === current
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={o.ariaLabel}
            title={o.title}
            tabIndex={checked || (current < 0 && i === 0) ? 0 : -1}
            className={[itemClassName, o.className, checked ? 'active' : ''].filter(Boolean).join(' ')}
            style={o.style}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {o.content}
          </button>
        )
      })}
    </div>
  )
}
