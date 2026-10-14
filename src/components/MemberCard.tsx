import { CaretRightIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { membershipMedal, MEMBERSHIP_FAMILY, missingLabel } from '../lib/medals'
import { padNumber, qrPath, seniorityOf, sinceLabel } from '../lib/memberCard'
import type { Player } from '../lib/types'
import { Avatar } from './Avatar'
import { Medal } from './Medal'
import { MedalSheet } from './MedalSheet'

/** Un color del logo para cada club (siempre el mismo), para la franja del carnet. */
const STRIPES = ['var(--logo-orange, #ff6b35)', 'var(--logo-blue, #4c8dff)', 'var(--logo-green, #22c55e)', 'var(--logo-violet, #b98cff)']
const stripeOf = (code: string) => STRIPES[[...code].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % STRIPES.length]

/**
 * Carnet de socio del club, como un pase de billetera: quién sos, tu número, desde cuándo estás,
 * tu medalla de socio y un QR para que otro se sume escaneándolo.
 */
export function MemberCard({
  club,
  player,
  joinedAt,
  number,
  role,
  stats,
  link,
}: {
  club: { code: string; name: string; emoji: string | null; venue?: unknown }
  player?: Player
  joinedAt: string
  number?: number
  role: string
  stats: { played: number; wins: number }
  link: string
}) {
  const [open, setOpen] = useState(false)
  const medal = membershipMedal(joinedAt)
  const level = Math.max(medal.level, 0)
  const qr = useMemo(() => qrPath(link), [link])
  const since = sinceLabel(joinedAt)

  return (
    <article className="pass" style={{ '--pass-stripe': stripeOf(club.code) } as React.CSSProperties} aria-labelledby="pass-title">
      <header className="pass-top">
        <span className="pass-club-emoji" aria-hidden>
          {club.emoji ?? '🎲'}
        </span>
        <span className="pass-club">
          <span className="pass-kicker">Carnet de socio</span>
          <b id="pass-title">{club.name}</b>
        </span>
        {number !== undefined && (
          <span className="pass-number">
            <span className="pass-kicker">N.º</span>
            <b className="num">{padNumber(number)}</b>
          </span>
        )}
      </header>

      <div className="pass-holder">
        {player && <Avatar player={player} size={52} />}
        <span className="pass-holder-name">
          <b>{player?.name ?? 'Socio'}</b>
          <span className="muted small">{role}</span>
        </span>
      </div>

      <dl className="pass-fields">
        <div>
          <dt>Socio desde</dt>
          <dd>{since}</dd>
        </div>
        <div>
          <dt>Antigüedad</dt>
          <dd>{seniorityOf(joinedAt)}</dd>
        </div>
        <div>
          <dt>Partidas</dt>
          <dd className="num">
            {stats.played}
            {stats.played > 0 && <span className="pass-sub">{stats.wins === 1 ? '1 ganada' : `${stats.wins} ganadas`}</span>}
          </dd>
        </div>
      </dl>

      <button type="button" className="pass-medal" onClick={() => setOpen(true)}>
        <Medal family={MEMBERSHIP_FAMILY} level={level} size={56} />
        <span className="pass-medal-text">
          <b>{MEMBERSHIP_FAMILY.levels[level].name}</b>
          <span className="muted small">
            {medal.next ? `${missingLabel({ unit: (n) => (n === 1 ? '1 día' : `${n} días`) }, medal.next.at - medal.value)} para ${medal.next.name}` : 'El nivel más alto del carnet'}
          </span>
          {medal.next && (
            <span className="pass-progress" aria-hidden>
              <span style={{ width: `${Math.round(medal.ratio * 100)}%` }} />
            </span>
          )}
        </span>
        <CaretRightIcon aria-hidden />
      </button>

      <div className="pass-tear" aria-hidden />

      <div className="pass-qr">
        <svg viewBox={`-4 -4 ${qr.size + 8} ${qr.size + 8}`} role="img" aria-label={`Código QR para sumarse a ${club.name}`}>
          <rect x="-4" y="-4" width={qr.size + 8} height={qr.size + 8} fill="#fff" />
          <path d={qr.d} fill="#0d1117" shapeRendering="crispEdges" />
        </svg>
        <p className="muted small">Mostralo y que lo escaneen con la cámara: se suman a {club.name} y arrancan con su carnet.</p>
      </div>

      {open && <MedalSheet family={MEMBERSHIP_FAMILY} level={level} mine={{ value: medal.value, level: medal.level }} onClose={() => setOpen(false)} />}
    </article>
  )
}
