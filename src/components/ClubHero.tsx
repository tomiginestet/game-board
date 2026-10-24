import { ArrowsClockwiseIcon, CheckIcon, GearSixIcon, GlobeHemisphereWestIcon, LockSimpleIcon, StorefrontIcon, SwordIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { plural } from '../lib/hooks'
import { decideJoinRequest, groupRequests, userAsPlayer, type JoinRequest, type MyGroup } from '../lib/social'
import { useData } from '../lib/store'
import { syncNow, useSyncState } from '../lib/sync'
import { friendlyError } from '../lib/text'
import { Avatar } from './Avatar'
import { ErrorText } from './Feedback'
import { useGamesPlayed } from './Squad'
import { say } from '../skins/say'

/**
 * Cabecera de la pantalla del club: emoji, nombre, de qué club se trata y sus números en una franja
 * (`medals`: cuántas ganaron). El guardado ya se ve arriba, en el selector de club; acá sólo el error.
 */
export function ClubHero({ group, medals }: { group: MyGroup; medals: number }) {
  const sync = useSyncState()
  const data = useData()
  const gamesPlayed = useGamesPlayed()
  const duo = group.kind === 'duo'
  const playsCount = data.plays.filter((p) => p.status === 'finished').length + data.matches.filter((m) => m.status === 'finished').length
  const stats = [
    { n: data.players.length, one: 'jugador', many: 'jugadores' },
    { n: playsCount, one: say('partida'), many: say('partidas') },
    { n: gamesPlayed, one: say('juego'), many: say('juegos') },
    { n: medals, one: 'medalla', many: 'medallas' },
  ]

  return (
    <>
      <header className="card club-hero">
        {/* Arriba el emoji y el engranaje, alineados; debajo el nombre con todo el ancho para él. */}
        <div className="club-hero-top">
          <span className="group-emoji huge" aria-hidden>
            {group.emoji ?? (duo ? '⚔️' : '🎲')}
          </span>
          <Link to="/club/gestion" className="tool-btn club-edit" aria-label={duo ? 'Gestionar mano a mano' : 'Gestionar club'} title={duo ? 'Gestionar mano a mano' : 'Gestionar club'}>
            <GearSixIcon size={22} />
            {group.pending_requests > 0 && (
              <span className="badge-count" aria-hidden>
                {group.pending_requests}
              </span>
            )}
          </Link>
        </div>
        <div className="club-hero-title">
          <h1>{group.name}</h1>
          <p className="club-meta">
            {duo ? (
              <span>
                <SwordIcon aria-hidden /> Mano a mano
              </span>
            ) : group.venue ? (
              <span>
                <StorefrontIcon aria-hidden /> {group.venue.address || 'Club de un lugar'}
              </span>
            ) : (
              <span>
                {group.is_public ? <GlobeHemisphereWestIcon aria-hidden /> : <LockSimpleIcon aria-hidden />} {group.is_public ? 'Público' : 'Privado'}
              </span>
            )}
            {!duo && <span>{plural(group.members, 'cuenta', 'cuentas')}</span>}
          </p>
        </div>
        {group.description && <p className="club-desc">{group.description}</p>}
        {/* Una franja, no cajas: los cuatro números se leen de corrido. */}
        <dl className="club-stats">
          {stats.map((x) => (
            <div key={x.one}>
              <dt>{x.n === 1 ? x.one : x.many}</dt>
              <dd className="num">{x.n}</dd>
            </div>
          ))}
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
    <section className="card highlight join-requests" aria-labelledby="requests-title">
      <h2 id="requests-title">{requests.length === 1 ? 'Quiere entrar 1 persona' : `Quieren entrar ${requests.length} personas`}</h2>
      <ul className="request-list">
        {requests.map((r) => (
          <li key={r.request_id} className="request">
            <div className="request-who">
              <Avatar player={userAsPlayer(r)} size={44} />
              <span className="grow">
                <b className="block ellipsis">{r.display_name}</b>
                <span className="muted small block ellipsis">
                  @{r.username} · {relativeDay(r.created_at)}
                </span>
              </span>
            </div>
            {r.message && <p className="request-message">“{r.message}”</p>}
            <div className="request-actions">
              <button className="btn primary small" disabled={busy} onClick={() => void decide(r, true)}>
                <CheckIcon /> Aceptar
              </button>
              <button className="btn small" disabled={busy} onClick={() => void decide(r, false)} aria-label={`Rechazar a ${r.display_name}`}>
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ErrorText>{error}</ErrorText>
    </section>
  )
}

/** "hoy", "ayer" o la fecha, sin la hora: para cuándo pidió entrar. */
function relativeDay(iso: string): string {
  const t = new Date(iso).getTime()
  const day = (x: number) => new Date(x).toDateString()
  if (day(t) === day(Date.now())) return 'hoy'
  if (day(t) === day(Date.now() - 24 * 60 * 60 * 1000)) return 'ayer'
  return new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
