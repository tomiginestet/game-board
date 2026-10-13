import { Fragment } from 'react'
import '../../styles/keys.css'

/** Una tecla y lo que hace ("A", "suma a Ana"). */
export type KeyHintItem = { keys: string[]; label: string }

/**
 * Fila discreta debajo del tablero con los atajos de teclado. Sólo aparece con mouse o trackpad
 * (en el teléfono no hay teclado que enseñar); los botones llevan además `aria-keyshortcuts`.
 */
export function KeyHint({ items }: { items: KeyHintItem[] }) {
  return (
    <p className="key-hint">
      <span className="key-hint-lead">Teclado:</span>{' '}
      {items.map((it, i) => (
        <span key={i} className="key-hint-item">
          {it.keys.map((k, j) => (
            <Fragment key={k}>
              {j > 0 && <span className="key-hint-or"> o </span>}
              <kbd>{k}</kbd>
            </Fragment>
          ))}{' '}
          {it.label}
          {/* El espacio entre atajos es visual; para el lector de pantalla, una coma. */}
          {i < items.length - 1 && <span className="sr-only">, </span>}
        </span>
      ))}
    </p>
  )
}
