import { useState } from 'react'
import { TIERS } from '../lib/medalArt'
import { totalLevels, unlockedCount, type MedalProgress } from '../lib/medals'
import { Medal } from './Medal'

/** Medallas de un perfil: una por familia (la del nivel más alto) y, al tocarla, todos sus niveles. */
export function MedalsSection({ title, list }: { title: string; list: MedalProgress[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const keyOf = (p: MedalProgress) => p.family.id + ':' + p.family.name
  const open = list.find((p) => keyOf(p) === openId)

  return (
    <section>
      <h2>
        {title}{' '}
        <span className="muted small">
          {unlockedCount(list)}/{totalLevels(list)} niveles
        </span>
      </h2>
      <div className="medals">
        {list.map((p) => {
          const { family, value, level, next, ratio } = p
          const k = keyOf(p)
          return (
            <button
              key={k}
              type="button"
              className={'medal-tile' + (level >= 0 ? ' unlocked' : '') + (openId === k ? ' open' : '')}
              aria-expanded={openId === k}
              onClick={() => setOpenId(openId === k ? null : k)}
            >
              <span className="medal-family">{family.name}</span>
              <Medal family={family} level={Math.max(level, 0)} locked={level < 0} />
              <span className="medal-name">{level >= 0 ? family.levels[level].name : 'Bloqueado'}</span>
              <span className="medal-sub">
                {next ? `${value} de ${next.at} para ${TIERS[level + 1].name.toLowerCase()}` : `Nivel máximo · ${TIERS[level].name}`}
              </span>
              <span className="medal-bar" aria-hidden="true">
                <i style={{ width: `${Math.round(ratio * 100)}%` }} />
              </span>
            </button>
          )
        })}
      </div>

      {open && (
        <div className="card medal-ladder">
          <div className="medal-ladder-head">
            <h3>{open.family.name}</h3>
            <p className="muted small">
              {open.family.measures}. Tenés {open.family.unit(open.value)}.
            </p>
          </div>
          <ol>
            {open.family.levels.map((l, i) => {
              const got = i <= open.level
              return (
                <li key={l.name} className={got ? 'got' : ''}>
                  <Medal family={open.family} level={i} locked={!got} size={56} />
                  <div>
                    <span className="medal-at">
                      {TIERS[i].name} · {open.family.unit(l.at)}
                    </span>
                    <b>{l.name}</b>
                    <span className="muted small">{l.description}</span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </section>
  )
}
