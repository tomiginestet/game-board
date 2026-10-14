import { useState } from 'react'
import { TIERS } from '../lib/medalArt'
import { totalLevels, unlockedCount, type MedalProgress } from '../lib/medals'
import { Medal } from './Medal'
import { MedalSheet } from './MedalSheet'

/** Medallas de un perfil: una por familia (la del nivel más alto) y, al tocarla, su ficha en grande con todos los niveles. */
export function MedalsSection({ title, list, playerName }: { title: string; list: MedalProgress[]; playerName?: string }) {
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
              className={'medal-tile' + (level >= 0 ? ' unlocked' : '')}
              aria-haspopup="dialog"
              onClick={() => setOpenId(k)}
            >
              {/* Como las tarjetas de la ficha del juego: la medalla arriba y el texto abajo, centrados.
                  Ganada, el título es el nivel y abajo la familia; bloqueada, el título es la familia. */}
              <Medal family={family} level={Math.max(level, 0)} locked={level < 0} size={84} />
              <span className="medal-name">{level >= 0 ? family.levels[level].name : family.name}</span>
              {level >= 0 && <span className="medal-tile-family">{family.name}</span>}
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
        <MedalSheet
          family={open.family}
          level={open.next ? open.level + 1 : open.level}
          mine={{ name: playerName, value: open.value, level: open.level }}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  )
}
