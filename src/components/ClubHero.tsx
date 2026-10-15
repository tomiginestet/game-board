import { ArrowsClockwiseIcon, CheckIcon, GlobeHemisphereWestIcon, LockSimpleIcon, PencilSimpleIcon, StorefrontIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/hooks'
import { decideJoinRequest, groupRequests, userAsPlayer, type JoinRequest, type MyGroup } from '../lib/social'
import { useData } from '../lib/store'
import { SYNC_LABEL, syncNow, useSyncState } from '../lib/sync'
import { friendlyError } from '../lib/text'
import { Avatar } from './Avatar'
import { ErrorText } from './Feedback'
import { useGamesPlayed } from './Squad'
import { SyncIcon } from './SyncIcon'

/** Cabecera de la pantalla del club: emoji, nombre, de qué club se trata y sus números (`medals`: cuántas ganaron). */
export function ClubHero({ group, medals }: { group: MyGroup; medals: number }) {
  const sync = useSyncState()
  const data = useData()
  const gamesPlayed = useGamesPlayed()
  const isAdmin = group.role === 'owner' || group.role === 'admin'
  const duo = group.kind === 'duo'
  const playsCount = data.plays.filter((p) => p.status === 'finished').length + data.matches.filter((m) => m.status === 'finished').length

  return (
    <>
      <header className="card club-hero">
        <div className="club-hero-top">
          <span className="group-emoji huge" aria-hidden>
            {group.emoji ?? (duo ? '⚔️' : '🎲')}
          </span>
          <div className="club-hero-title">
            <h1>{group.name}</h1>
            <p className="club-meta">
              {duo ? (
                <span>⚔️ Mano a mano</span>
              ) : group.venue ? (
                <span>
                  <StorefrontIcon aria-hidden /> {group.venue.address || 'Club de un lugar'}
                </span>
              ) : (
                <span>
                  {group.is_public ? <GlobeHemisphereWestIcon aria-hidden /> : <LockSimpleIcon aria-hidden />} {group.is_public ? 'Público' : 'Privado'}
                </span>
              )}
              {sync.status !== 'off' && (
                <span className={'sync-pill ' + sync.status}>
                  <SyncIcon status={sync.status} /> {SYNC_LABEL[sync.status]}
                </span>
              )}
            </p>
          </div>
          {isAdmin && !duo && (
            <Link to="/club/editar" className="tool-btn club-edit" aria-label="Editar club" title="Editar club">
              <PencilSimpleIcon />
            </Link>
          )}
        </div>
        {group.description && <p className="club-desc">{group.description}</p>}
        <dl className="club-stats">
          <div>
            <dt>Jugadores</dt>
            <dd className="num">{data.players.length}</dd>
          </div>
          <div>
            <dt>Partidas</dt>
            <dd className="num">{playsCount}</dd>
          </div>
          <div>
            <dt>Juegos</dt>
            <dd className="num">{gamesPlayed}</dd>
          </div>
          <div>
            <dt>Medallas</dt>
            <dd className="num">{medals}</dd>
          </div>
        </dl>
      </header>
      {sync.error && sync.status === 'error' && (
        <p className="error" role="alert">
          {friendlyError(sync.error)}{' '}
          <button className="link-btn small" onClick={() => void syncNow()}>
            <ArrowsClockwiseIcon /> Reintentar
          </button>
        </p>
      )}
    </>
  )
}

/** Quienes pidieron entrar al club, para que un admin los acepte o no. */
export function JoinRequests({ group }: { group: MyGroup }) {
  const isAdmin = group.role === 'owner' || group.role === 'admin'
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    if (isAdmin && group.kind === 'group') groupRequests(group.code).then(setRequests).catch(() => {})
  }, [group.code, group.kind, isAdmin])
  useEffect(load, [load, group.pending_requests])

  const decide = async (r: JoinRequest, accept: boolean) => {
    setBusy(true)
    setError('')
    try {
      await decideJoinRequest(r.request_id, accept)
      load()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  if (!requests.length) return null
  return (
    <section className="card highlight">
      <h2>Quieren entrar ({requests.length})</h2>
      <div className="list">
        {requests.map((r) => (
          <div key={r.request_id} className="member-row">
            <Avatar player={userAsPlayer(r)} size={40} />
            <span className="grow">
              <b className="block">{r.display_name}</b>
              <span className="muted small">
                @{r.username} · {formatDate(new Date(r.created_at).getTime())}
              </span>
              {r.message && <span className="small block">“{r.message}”</span>}
            </span>
            <button className="btn small primary" disabled={busy} onClick={() => void decide(r, true)}>
              <CheckIcon /> Aceptar
            </button>
            <button className="tool-btn" aria-label={`Rechazar a ${r.display_name}`} disabled={busy} onClick={() => void decide(r, false)}>
              <XIcon />
            </button>
          </div>
        ))}
      </div>
      <ErrorText>{error}</ErrorText>
    </section>
  )
}
