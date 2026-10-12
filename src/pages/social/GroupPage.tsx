import {
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  CrownIcon,
  GlobeHemisphereWestIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  ShieldStarIcon,
  SignOutIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { claimedPlayers, claimPlayer, useAuth } from '../../lib/auth'
import {
  decideJoinRequest,
  ensureMyPlayer,
  groupMembers,
  groupRequests,
  inviteToGroup,
  leaveGroup,
  refreshGroups,
  removeMember,
  searchUsers,
  setMemberRole,
  useActiveGroup,
  userAsPlayer,
  type FoundUser,
  type JoinRequest,
  type Member,
  type MyGroup,
} from '../../lib/social'
import { useData } from '../../lib/store'
import { deactivateClub, inviteLink, SYNC_LABEL, syncNow, useSyncState } from '../../lib/sync'
import { SyncIcon } from '../../components/SyncIcon'
import { formatDate, plural } from '../../lib/hooks'
import { ClubPage } from '../ClubPage'
import { GroupForm } from './GroupForms'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { confirmAction } from '../../lib/feedback'

const ROLE_NAMES = { owner: 'Dueño', admin: 'Admin', member: 'Integrante' } as const

export function GroupPage() {
  const auth = useAuth()
  const group = useActiveGroup()
  const sync = useSyncState()
  if (!auth.session) return <ClubPage />
  if (!group) {
    return (
      <div className="page">
        <h1>Club</h1>
        {sync.club ? <p className="muted">Cargando el club…</p> : <div className="empty">No tenés un club activo. Elegí uno de tus clubes o creá uno.</div>}
        <Link to="/grupos" className="btn primary">
          <UsersIcon /> Ver mis clubes
        </Link>
      </div>
    )
  }
  return <GroupView key={group.code} group={group} />
}

function GroupView({ group }: { group: MyGroup }) {
  const auth = useAuth()
  const sync = useSyncState()
  const data = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const me = auth.session?.user.id
  const isAdmin = group.role === 'owner' || group.role === 'admin'
  const duo = group.kind === 'duo'
  const [editing, setEditing] = useState(false)
  const [members, setMembers] = useState<Member[] | null>(null)
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    groupMembers(group.code)
      .then(setMembers)
      .catch((e) => setError(friendlyError(e)))
    if (isAdmin && !duo) groupRequests(group.code).then(setRequests).catch(() => {})
  }, [group.code, isAdmin, duo])

  useEffect(load, [load, group.pending_requests])

  useEffect(() => {
    if (location.hash === '#yo') document.getElementById('yo')?.scrollIntoView({ block: 'start' })
  }, [location.hash])

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  const playerCount = data.players.length
  const playsCount = data.plays.filter((p) => p.status === 'finished').length + data.matches.filter((m) => m.status === 'finished').length

  return (
    <div className="page">
      {editing ? (
        <>
          <h1>Editar club</h1>
          <GroupForm
            initial={group}
            onDone={() => {
              setEditing(false)
            }}
          />
          <button className="btn" onClick={() => setEditing(false)}>
            Cancelar
          </button>
        </>
      ) : (
        <header className="group-head">
          <span className="group-emoji huge" aria-hidden>
            {group.emoji ?? (duo ? '⚔️' : '🎲')}
          </span>
          <div className="grow">
            <h1>{group.name}</h1>
            {group.description && <p className="muted">{group.description}</p>}
            <div className="chips">
              {duo ? (
                <span className="pill">⚔️ Mano a mano</span>
              ) : (
                <span className="pill">
                  {group.is_public ? <GlobeHemisphereWestIcon /> : <LockSimpleIcon />} {group.is_public ? 'Público' : 'Privado'}
                </span>
              )}
              <span className="pill">
                {plural(playerCount, 'jugador', 'jugadores')} · {plural(playsCount, 'partida', 'partidas')}
              </span>
              {sync.status !== 'off' && (
                <span className={'pill sync-pill ' + sync.status}>
                  <SyncIcon status={sync.status} /> {SYNC_LABEL[sync.status]}
                </span>
              )}
            </div>
          </div>
          {isAdmin && !duo && (
            <button className="btn small" onClick={() => setEditing(true)}>
              <PencilSimpleIcon /> Editar
            </button>
          )}
        </header>
      )}
      {sync.error && sync.status === 'error' && (
        <p className="error" role="alert">
          {friendlyError(sync.error)}{' '}
          <button className="link-btn small" onClick={() => void syncNow()}>
            <ArrowsClockwiseIcon /> Reintentar
          </button>
        </p>
      )}

      {!group.player_id && <WhoAmI group={group} />}

      {requests.length > 0 && (
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
                <button className="btn small primary" disabled={busy} onClick={() => run(() => decideJoinRequest(r.request_id, true).then(load))}>
                  <CheckIcon /> Aceptar
                </button>
                <button className="tool-btn" aria-label="Rechazar" disabled={busy} onClick={() => run(() => decideJoinRequest(r.request_id, false).then(load))}>
                  <XIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>Integrantes</h2>
          <Link to="/jugadores">Jugadores ({playerCount})</Link>
        </div>
        <p className="muted small">Con cuenta. En “Jugadores” también están los que juegan sin cuenta.</p>
        <div className="list">
          {members === null && <p className="muted">Cargando…</p>}
          {members?.map((m) => (
            <div key={m.user_id} className="card member-row">
              <Avatar player={userAsPlayer(m)} size={40} />
              <span className="grow">
                <b className="block ellipsis">
                  {m.display_name ?? 'Sin nombre'} {m.user_id === me && <span className="muted small">(vos)</span>}
                </b>
                <span className="muted small">
                  {m.username ? `@${m.username}` : ''} {!duo && <> · {m.role === 'owner' && <CrownIcon className="inline-icon" weight="fill" />} {ROLE_NAMES[m.role]}</>}
                </span>
              </span>
              {group.role === 'owner' && !duo && m.user_id !== me && (
                <button
                  className="tool-btn"
                  title={m.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                  aria-label={m.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                  disabled={busy}
                  onClick={() => run(() => setMemberRole(group.code, m.user_id, m.role === 'admin' ? 'member' : 'admin').then(load))}
                >
                  <ShieldStarIcon weight={m.role === 'admin' ? 'fill' : 'regular'} />
                </button>
              )}
              {isAdmin && !duo && m.user_id !== me && m.role !== 'owner' && (
                <button
                  className="tool-btn"
                  aria-label={`Sacar a ${m.display_name}`}
                  disabled={busy}
                  onClick={async () => {
                    const ok = await confirmAction({
                      title: `¿Sacar a ${m.display_name} del club?`,
                      detail: 'Sus partidas quedan en el historial. Puede volver a sumarse con una invitación.',
                      confirmLabel: 'Sacar del club',
                      danger: true,
                    })
                    if (ok) void run(() => removeMember(group.code, m.user_id).then(load))
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {!duo && <InviteSection group={group} members={members ?? []} />}

      <ErrorText>{error}</ErrorText>

      <button
        className="btn danger mt"
        disabled={busy}
        onClick={async () => {
          const ok = await confirmAction(
            duo
              ? { title: '¿Salir de este mano a mano?', detail: 'Podés volver cuando quieras desde Amigos.', confirmLabel: 'Salir del mano a mano', danger: true }
              : {
                  title: `¿Salir de “${group.name}”?`,
                  detail:
                    group.role === 'owner'
                      ? 'La administración pasa a quien sea admin (o integrante) hace más tiempo. Para volver vas a necesitar una invitación.'
                      : 'Para volver vas a necesitar una invitación o pedir sumarte de nuevo.',
                  confirmLabel: 'Salir del club',
                  danger: true,
                },
          )
          if (ok)
            void run(async () => {
              await leaveGroup(group.code)
              deactivateClub()
              navigate('/grupos')
            })
        }}
      >
        <SignOutIcon /> {duo ? 'Salir del mano a mano' : 'Salir del club'}
      </button>
    </div>
  )
}

/** Elegir cuál de los jugadores del grupo sos (o crear el tuyo). */
function WhoAmI({ group }: { group: MyGroup }) {
  const data = useData()
  const [claimed, setClaimed] = useState<string[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    claimedPlayers(group.code)
      .then(setClaimed)
      .catch(() => setClaimed([]))
  }, [group.code])

  const free = data.players.filter((p) => !claimed?.includes(p.id))
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      await refreshGroups()
      void syncNow()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card highlight" id="yo">
      <h2>¿Quién sos en este club?</h2>
      <p className="muted small">Así tus partidas cuentan para tu perfil y para el ranking global.</p>
      {free.length > 0 && (
        <>
          <p className="small">Si ya te habían cargado como jugador, elegite:</p>
          <div className="chips">
            {free.map((p) => (
              <button key={p.id} className="chip player-chip" disabled={busy} onClick={() => run(() => claimPlayer(group.code, p.id))}>
                <Avatar player={p} size={22} /> {p.name}
              </button>
            ))}
          </div>
        </>
      )}
      <button className="btn primary block mt" disabled={busy} onClick={() => run(() => ensureMyPlayer(group.code))}>
        <UserPlusIcon /> {free.length ? 'No estoy: crear mi jugador' : 'Crear mi jugador'}
      </button>
      <ErrorText>{error}</ErrorText>
    </section>
  )
}

function InviteSection({ group, members }: { group: MyGroup; members: Member[] }) {
  const [q, setQ] = useState('')
  const [found, setFound] = useState<FoundUser[]>([])
  const [invited, setInvited] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const link = inviteLink(group.code)

  const shown = q.trim().length >= 2 ? found : []

  useEffect(() => {
    if (q.trim().length < 2) return
    let cancelled = false
    const t = setTimeout(() => {
      searchUsers(q)
        .then((r) => !cancelled && setFound(r))
        .catch(() => {})
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q])

  const copy = async () => {
    await navigator.clipboard?.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="card">
      <h2>
        <UserPlusIcon className="inline-icon" /> Invitar
      </h2>
      <label className="search">
        <MagnifyingGlassIcon />
        <input className="input" placeholder="Buscar por nombre o @usuario" value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="none" />
      </label>
      <div className="list">
        {shown.map((u) => {
          const member = members.some((m) => m.user_id === u.user_id)
          const done = invited.includes(u.user_id)
          return (
            <div key={u.user_id} className="member-row">
              <Avatar player={userAsPlayer(u)} size={36} />
              <span className="grow">
                <b className="block">{u.display_name}</b>
                <span className="muted small">@{u.username}</span>
              </span>
              <button
                className={'btn small' + (member || done ? '' : ' primary')}
                disabled={member || done}
                onClick={() =>
                  inviteToGroup(group.code, u.user_id)
                    .then(() => setInvited((x) => [...x, u.user_id]))
                    .catch((e) => setError(friendlyError(e)))
                }
              >
                {member ? 'Ya está' : done ? 'Invitado' : 'Invitar'}
              </button>
            </div>
          )
        })}
      </div>
      <ErrorText>{error}</ErrorText>
      <p className="muted small mt">O compartí el link (quien lo tenga puede entrar sin pedir permiso):</p>
      <div className="row gap wrap">
        <button
          className="btn"
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title: group.name, text: `Sumate a “${group.name}” en Game Board`, url: link })
                return
              } catch {
                // cancelado: copiamos
              }
            }
            await copy()
          }}
        >
          <ShareNetworkIcon /> Compartir link
        </button>
        <button className="btn" onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </section>
  )
}
