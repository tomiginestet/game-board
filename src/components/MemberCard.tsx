import { CaretRightIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { membershipMedal, MEMBERSHIP_FAMILY } from '../lib/medals'
import { padNumber, seniorityOf, sinceLabel } from '../lib/memberCard'
import type { Player } from '../lib/types'
import { Avatar } from './Avatar'
import { Medal } from './Medal'
import { MedalSheet } from './MedalSheet'

/** Un color del logo para cada club (siempre el mismo), para la franja del carnet. */
const STRIPES = ['#ff6b35', '#4c8dff', '#22c55e', '#b98cff']
const stripeOf = (code: string) => STRIPES[[...code].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % STRIPES.length]

/**
 * Carnet de socio, como un pase de billetera troquelado: arriba quién sos (número, rol, partidas)
 * y en el talón la medalla de socio, desde cuándo estás y cuánto falta para el próximo nivel.
 * El nombre del club no va: el carnet se muestra debajo del encabezado del club.
 */
export function MemberCard({
  clubCode,
  player,
  joinedAt,
  number,
  role,
  stats,
}: {
  clubCode: string
  player?: Player
  joinedAt: string
  number?: number
  role: string
  stats: { played: number; wins: number }
}) {
  const [open, setOpen] = useState(false)
  const medal = membershipMedal(joinedAt)
  const level = Math.max(medal.level, 0)
  const days = medal.next ? medal.next.at - medal.value : 0

  return (
    <article className="pass" style={{ '--pass-stripe': stripeOf(clubCode) } as React.CSSProperties} aria-label="Tu carnet de socio">
      <div className="pass-main">
        {player && <Avatar player={player} size={48} />}
        <div className="pass-who">
          <b className="pass-name">{player?.name ?? 'Socio'}</b>
          <span className="pass-meta">{role}</span>
          <span className="pass-meta">
            {stats.played === 1 ? '1 partida' : `${stats.played} partidas`}
            {stats.played > 0 && ` · ${stats.wins === 1 ? '1 victoria' : `${stats.wins} victorias`}`}
          </span>
        </div>
        {number !== undefined && (
          <span className="pass-number">
            <span aria-label={`Socio número ${number}`}>
              <span aria-hidden>N.º</span> <b>{padNumber(number)}</b>
            </span>
          </span>
        )}
      </div>

      <button type="button" className="pass-stub" onClick={() => setOpen(true)} aria-label={`Medalla de socio: ${MEMBERSHIP_FAMILY.levels[level].name}. Ver detalle`}>
        <Medal family={MEMBERSHIP_FAMILY} level={level} size={52} />
        <span className="pass-stub-text">
          <b>{MEMBERSHIP_FAMILY.levels[level].name}</b>
          <span className="pass-meta">
            {medal.value < 1 ? 'Socio desde hoy' : `Desde el ${sinceLabel(joinedAt)} · ${seniorityOf(joinedAt)}`}
          </span>
          {medal.next && (
            <span className="pass-next">
              <span className="pass-progress" aria-hidden>
                <span style={{ width: `${Math.round(medal.ratio * 100)}%` }} />
              </span>
              <span className="pass-meta">
                {days === 1 ? 'Falta 1 día' : `Faltan ${days} días`} para {medal.next.name}
              </span>
            </span>
          )}
        </span>
        <CaretRightIcon className="pass-caret" aria-hidden />
      </button>

      {open && <MedalSheet family={MEMBERSHIP_FAMILY} level={level} mine={{ value: medal.value, level: medal.level }} onClose={() => setOpen(false)} />}
    </article>
  )
}
