import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  CheckIcon,
  CopyIcon,
  CrownIcon,
  GlobeHemisphereWestIcon,
  LinkIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  ShareNetworkIcon,
  ShieldStarIcon,
  SignOutIcon,
  SparkleIcon,
  StorefrontIcon,
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
  setClubSlug,
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
import { cleanSlugInput, shortLink, suggestSlug, validSlug } from '../../lib/clubLink'
import { SyncIcon } from '../../components/SyncIcon'
import { MemberCard } from '../../components/MemberCard'
import { memberNumber } from '../../lib/memberCard'
import { formatDate, plural, useBoard } from '../../lib/hooks'
import { NextMedals } from '../../components/NextMedals'
import { SquadGames, SquadLeaders, SquadShowcase, useGamesPlayed, useSquadMedals } from '../../components/Squad'
import { teamRecord } from '../../lib/teams'
import { TeamCrest } from '../Teams'
import { ClubPage } from '../ClubPage'
import { GroupForm } from './GroupForms'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { confirmAction } from '../../lib/feedback'

const ROLE_NAMES = { owner: 'Admin principal', admin: 'Admin', member: 'Integrante' } as const

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
  const board = useBoard()
  const medals = useSquadMedals()
  const gamesPlayed = useGamesPlayed()

  const load = useCallback(() => {
    groupMembers(group.code)
      .then(setMembers)
      .catch((e) => setError(friendlyError(e)))
    if (isAdmin && !duo) groupRequests(group.code).then(setRequests).catch(() => {})
  }, [group.code, isAdmin, duo])

  useEffect(load, [load, group.pending_requests])

  useEffect(() => {
    if (location.hash === '#yo' || location.hash === '#carnet') document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
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
  const accountOf = new Map((members ?? []).filter((m) => m.player_id).map((m) => [m.player_id!, m]))
  const roster = [...data.players].sort(
    (a, b) => (board.players.get(b.id)?.gloria ?? 0) - (board.players.get(a.id)?.gloria ?? 0) || a.name.localeCompare(b.name, 'es'),
  )
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name, 'es'))

  if (editing) {
    return (
      <div className="page">
        <h1>Editar club</h1>
        <GroupForm initial={group} onDone={() => setEditing(false)} />
        <button className="btn" onClick={() => setEditing(false)}>
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <div className="page">
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
            <button className="tool-btn club-edit" onClick={() => setEditing(true)} aria-label="Editar club" title="Editar club">
              <PencilSimpleIcon />
            </button>
          )}
        </div>
        {group.description && <p className="club-desc">{group.description}</p>}
        <dl className="club-stats">
          <div>
            <dt>Jugadores</dt>
            <dd className="num">{playerCount}</dd>
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
            <dd className="num">{medals.earned.length}</dd>
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

      {!duo && (
        <section id="carnet" aria-label="Tu carnet de socio">
          <MemberCard
            clubCode={group.code}
            player={data.players.find((p) => p.id === group.player_id)}
            joinedAt={group.joined_at}
            number={me && members ? memberNumber(members, me) : undefined}
            role={ROLE_NAMES[group.role]}
            stats={{ played: board.players.get(group.player_id ?? '')?.played ?? 0, wins: board.players.get(group.player_id ?? '')?.wins ?? 0 }}
          />
        </section>
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

      {playsCount === 0 && (
        <div className="empty">
          <p>
            <b>Todavía no hay partidas.</b>
          </p>
          <p className="muted">Con la primera aparecen acá quién manda, las medallas del club y las que están por caer.</p>
          <Link to="/anotar" className="btn primary mt">
            <PlusIcon /> Anotar una partida
          </Link>
        </div>
      )}

      <SquadLeaders />
      <NextMedals playerIds={data.players.map((p) => p.id)} title="Medallas a la vista" />
      <SquadShowcase medals={medals.earned} title="Vitrina del club" />
      <SquadGames />

      <section>
        <div className="section-head">
          <h2>
            Equipos {teams.length > 0 && <span className="muted small">{teams.length}</span>}
          </h2>
          <Link to={teams.length ? '/equipos' : '/equipos/nuevo'}>
            {teams.length ? 'Ver todo' : 'Armar uno'} <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        </div>
        {teams.length ? (
          <div className="club-teams">
            {teams.map((t) => {
              const rec = teamRecord(data, t)
              return (
                <Link key={t.id} to={`/equipos/${t.id}`} className="card club-team" style={{ ['--tc' as string]: t.color }}>
                  <TeamCrest team={t} size={40} />
                  <span className="grow">
                    <b className="block ellipsis">{t.name}</b>
                    <span className="muted small">
                      {plural(t.players.length, 'jugador', 'jugadores')} · {rec.wins}G {rec.draws}E {rec.losses}P
                    </span>
                  </span>
                  {rec.form.length > 0 && (
                    <span className="club-team-form" aria-label={`Últimos: ${rec.form.slice(0, 3).join(' ')}`}>
                      {rec.form.slice(0, 3).map((r, i) => (
                        <span key={i} className={'form-dot small ' + (r === 'G' ? 'win' : r === 'P' ? 'loss' : 'draw')} aria-hidden>
                          {r}
                        </span>
                      ))}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="muted small">El fútbol 5 de los jueves, la pareja de pádel: armalos una vez y ves cómo le va a cada uno.</p>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>
            Integrantes <span className="muted small">{playerCount}</span>
          </h2>
          <Link to="/jugadores">
            Ver todo <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        </div>
        <div className="list">
          {roster.map((p) => {
            const s = board.players.get(p.id)
            const account = accountOf.get(p.id)
            const won = medals.won.get(p.id) ?? 0
            return (
              <Link key={p.id} to={`/jugadores/${p.id}`} className="card club-member">
                <Avatar player={p} size={44} />
                <span className="grow">
                  <b className="block ellipsis">
                    {p.name} {p.id === group.player_id && <span className="muted small">(vos)</span>}
                  </b>
                  <span className="muted small">
                    {account && account.role !== 'member' && !duo && (
                      <>
                        {account.role === 'owner' && <CrownIcon className="inline-icon" weight="fill" aria-hidden />} {ROLE_NAMES[account.role]} ·{' '}
                      </>
                    )}
                    {plural(s?.played ?? 0, 'partida', 'partidas')} · {plural(s?.wins ?? 0, 'victoria', 'victorias')}
                  </span>
                </span>
                <span className="club-member-score">
                  <span className="club-member-gloria num" aria-label={`${s?.gloria ?? 0} de gloria`}>
                    <SparkleIcon weight="fill" className="gloria-icon" aria-hidden /> {s?.gloria ?? 0}
                  </span>
                  {won > 0 && <span className="muted small">{plural(won, 'medalla', 'medallas')}</span>}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section-divided">
        <h2>Cuentas del club</h2>
        <p className="muted small">Quienes entraron con su cuenta. Los demás jugadores se anotan sin cuenta.</p>
        <div className="list">
          {members === null && <p className="muted">Cargando…</p>}
          {members?.map((m) => (
            <div key={m.user_id} className="member-row">
              <Avatar player={userAsPlayer(m)} size={36} />
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
  const link = group.slug ? shortLink(group.slug, window.location.href) : inviteLink(group.code)
  const isAdmin = group.role === 'owner' || group.role === 'admin'

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
                {member ? 'Ya está' : done ? 'Invitación enviada' : 'Invitar'}
              </button>
            </div>
          )
        })}
      </div>
      <ErrorText>{error}</ErrorText>
      <p className="muted small mt">O compartí el link (quien lo tenga puede entrar sin pedir permiso):</p>
      <div className="invite-box">
        <code>{link}</code>
      </div>
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
      {isAdmin && group.kind === 'group' && group.slug !== undefined && <ShortLinkEditor group={group} />}
    </section>
  )
}

/** Link corto del club (`/c/lasartes`): el que va impreso en el QR de un bar o se dice en voz alta. */
function ShortLinkEditor({ group }: { group: MyGroup }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(group.slug ?? suggestSlug(group.name))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const valid = validSlug(value)

  const save = async (slug: string | null) => {
    setBusy(true)
    setError('')
    try {
      await setClubSlug(group.code, slug)
      setEditing(false)
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  if (group.slug && !editing) {
    return (
      <div className="short-link">
        <p className="muted small">
          Link corto: <b className="mono">/c/{group.slug}</b>. Es el que va en el QR.
        </p>
        <button className="link-btn small" onClick={() => setEditing(true)}>
          <PencilSimpleIcon /> Cambiar link corto
        </button>
      </div>
    )
  }
  if (!editing) {
    return (
      <div className="short-link">
        <p className="muted small">Un link corto con el nombre del club es más fácil de decir y entra mejor en un QR.</p>
        <button className="btn small" onClick={() => setEditing(true)}>
          <LinkIcon /> Elegir link corto
        </button>
      </div>
    )
  }
  return (
    <form
      className="short-link"
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) void save(value)
      }}
    >
      <label className="field">
        <span className="field-label">Link corto</span>
        <span className="slug-input">
          <span className="muted" aria-hidden>
            /c/
          </span>
          <input
            className="input"
            value={value}
            onChange={(e) => setValue(cleanSlugInput(e.target.value))}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={30}
            aria-describedby="slug-help"
          />
        </span>
      </label>
      <p id="slug-help" className="muted small">
        De 3 a 30 letras sin acentos, números o guiones. Si lo cambiás, los QR impresos con el link anterior dejan de andar.
      </p>
      <ErrorText>{error}</ErrorText>
      <div className="row gap wrap">
        <button className="btn primary small" disabled={busy || !valid || value === group.slug}>
          {busy ? 'Guardando…' : 'Guardar link'}
        </button>
        <button type="button" className="btn small" onClick={() => setEditing(false)}>
          Cancelar
        </button>
        {group.slug && (
          <button type="button" className="btn small danger" disabled={busy} onClick={() => void save(null)}>
            Sacar link corto
          </button>
        )}
      </div>
    </form>
  )
}
