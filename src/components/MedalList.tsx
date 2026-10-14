import { ArrowSquareOutIcon, BookOpenIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { plural } from '../lib/hooks'
import type { MedalFamily } from '../lib/medals'
import { Medal } from './Medal'

/**
 * Familias de medallas, una tarjeta por familia: las medallas arriba y el texto abajo, centrados.
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
    <li className="card medal-card">
      <div className="medal-card-art">
        <div className="medal-card-stack">
          {levels.slice(0, 3).map((l, i) => (
            <button key={i} type="button" className="medal-btn" aria-haspopup="dialog" aria-label={`Ver ${l.name}`} onClick={() => onOpen(i)}>
              <Medal family={family} level={i} size={64} />
            </button>
          ))}
        </div>
        {extra > 0 && (
          <span className="medal-card-more" aria-hidden>
            +{extra}
          </span>
        )}
      </div>
      <button type="button" className="medal-card-info" aria-haspopup="dialog" onClick={() => onOpen(openLevel)}>
        <b className="medal-card-name">{family.name}</b>
        <span className="medal-card-measure">
          {family.measures}
          <span className="sr-only">, {plural(levels.length, 'nivel', 'niveles')}</span>
        </span>
        {detail}
      </button>
    </li>
  )
}

/** Reglas como pasos numerados separados por aire, y el link al reglamento alineado al texto. */
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
