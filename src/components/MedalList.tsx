import { ArrowSquareOutIcon, BookOpenIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { plural } from '../lib/hooks'
import type { MedalFamily } from '../lib/medals'
import { Medal } from './Medal'

/**
 * Lista de familias de medallas separadas por una línea (como los datos de la ficha de la medalla).
 * Cada medalla abre su ficha; el texto abre la ficha en `openLevel`. `detail` va debajo de lo que mide.
 */
export function MedalList({ children }: { children: ReactNode }) {
  return <ul className="medal-list">{children}</ul>
}

export function MedalListRow({
  family,
  detail,
  openLevel = 0,
  onOpen,
}: {
  family: MedalFamily
  detail?: ReactNode
  openLevel?: number
  onOpen: (level: number) => void
}) {
  const levels = family.levels
  const extra = levels.length - 3
  return (
    <li className="medal-list-row">
      <div className="medal-list-art">
        {levels.slice(0, 3).map((l, i) => (
          <button key={i} type="button" className="medal-btn" aria-haspopup="dialog" aria-label={`Ver ${l.name}`} onClick={() => onOpen(i)}>
            <Medal family={family} level={i} size={48} />
          </button>
        ))}
        {extra > 0 && (
          <span className="medal-list-more" aria-hidden>
            +{extra}
          </span>
        )}
      </div>
      <button type="button" className="medal-list-info" aria-haspopup="dialog" onClick={() => onOpen(openLevel)}>
        <span className="medal-list-text">
          <b className="medal-list-name">{family.name}</b>
          <span className="medal-list-measure">
            {family.measures}
            <span className="sr-only">, {plural(levels.length, 'nivel', 'niveles')}</span>
          </span>
          {detail}
        </span>
        <CaretRightIcon className="medal-list-caret" aria-hidden />
      </button>
    </li>
  )
}

/** Reglas como pasos numerados con la misma línea divisoria, y el link al reglamento alineado al texto. */
export function RuleList({ rules, url, footnote }: { rules: string[]; url?: string; footnote?: ReactNode }) {
  return (
    <>
      <ol className="rule-list">
        {rules.map((r, i) => (
          <li key={i}>
            <span className="rule-num num" aria-hidden>
              {i + 1}
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ol>
      {url && (
        <a href={url} target="_blank" rel="noreferrer noopener" className="rule-link">
          <BookOpenIcon aria-hidden /> Reglamento completo
          <ArrowSquareOutIcon className="rule-link-out" aria-hidden />
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      )}
      {footnote && <p className="muted small rule-foot">{footnote}</p>}
    </>
  )
}
