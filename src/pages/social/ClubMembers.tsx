import { ArrowRightIcon, CheckIcon, CopyIcon, CrownIcon, LinkIcon, MagnifyingGlassIcon, PencilSimpleIcon, PrinterIcon, ShareNetworkIcon, UserPlusIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { useAuth } from '../../lib/auth'
import { ROLE_NAMES, inviteToGroup, groupMembers, removeMember, searchUsers, setClubSlug, clubShareLink, setMemberRole, userAsPlayer, type FoundUser, type Member, type MyGroup } from '../../lib/social'
import { useData } from '../../lib/store'
import { cleanSlugInput, suggestSlug, validSlug } from '../../lib/clubLink'
import { plural, useBoard } from '../../lib/hooks'
import { useSquadMedals } from '../../components/Squad'
import { teamRecord } from '../../lib/teams'
import { TeamCrest } from '../Teams'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { confirmAction } from '../../lib/feedback'

// La gente del club. Abajo de la pantalla del club van los equipos y los integrantes (se bajan aparte, para
// que lo de arriba aparezca al toque); las cuentas, los permisos y las invitaciones van en "Gestionar club".

/** Las cuentas del club (`null` mientras cargan), con lo que hace falta para volver a pedirlas. */
function useMembers(group: MyGroup) {
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    groupMembers(group.code)
      .then(setMembers)
      .catch((e) => setError(friendlyError(e)))
  }, [group.code])
  useEffect(load, [load, group.members])
  return { members, error, load }
}

/** Equipos e integrantes del club. */
export function ClubPeople({ group }: { group: MyGroup }) {
  const auth = useAuth()
  const data = useData()
  const board = useBoard()
  const medals = useSquadMedals()
  const me = auth.session?.user.id
  const duo = group.kind === 'duo'
  const { members } = useMembers(group)

  const accountOf = new Map((members ?? []).filter((m) => m.player_id).map((m) => [m.player_id!, m]))
  // Cuentas que entraron pero todavía no eligieron quién son: también son del club.
  const withoutPlayer = duo ? [] : (members ?? []).filter((m) => !m.player_id)
  const roster = [...data.players].sort(
    (a, b) => (board.players.get(b.id)?.gloria ?? 0) - (board.players.get(a.id)?.gloria ?? 0) || a.name.localeCompare(b.name, 'es'),
  )
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name, 'es'))

  return (
    <>
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
            Integrantes <span className="muted small">{data.players.length + withoutPlayer.length}</span>
          </h2>
          <Link to="/jugadores">
            Ver todo <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        </div>
        {/* Lista sin tarjetas, como la de jugadores: el detalle en una línea y la gloria en dorado. */}
        <div className="list rows">
          {roster.map((p) => {
            const s = board.players.get(p.id)
            const account = accountOf.get(p.id)
            const won = medals.won.get(p.id) ?? 0
            return (
              <Link key={p.id} to={p.id === group.player_id ? '/perfil' : `/jugadores/${p.id}`} className="club-member">
                <Avatar player={p} size={40} />
                <span className="grow">
                  <b className="block ellipsis">
                    {p.name} {p.id === group.player_id && <span className="muted small">(vos)</span>}
                  </b>
                  <span className="muted small block ellipsis">
                    {account && account.role !== 'member' && !duo && (
                      <>
                        {account.role === 'owner' && <CrownIcon className="inline-icon" weight="fill" aria-hidden />} {ROLE_NAMES[account.role]} ·{' '}
                      </>
                    )}
                    {plural(s?.played ?? 0, 'partida', 'partidas')}
                    {won > 0 && ` · ${plural(won, 'medalla', 'medallas')}`}
                  </span>
                </span>
                <span className="player-gloria num" aria-label={`${s?.gloria ?? 0} de gloria`}>
                  {s?.gloria ?? 0}
                </span>
              </Link>
            )
          })}
          {withoutPlayer.map((m) => {
            const body = (
              <>
                <Avatar player={userAsPlayer(m)} size={40} />
                <span className="grow">
                  <b className="block ellipsis">
                    {m.display_name ?? m.username ?? 'Sin nombre'} {m.user_id === me && <span className="muted small">(vos)</span>}
                  </b>
                  <span className="muted small block ellipsis">
                    {m.role !== 'member' && (
                      <>
                        {m.role === 'owner' && <CrownIcon className="inline-icon" weight="fill" aria-hidden />} {ROLE_NAMES[m.role]} ·{' '}
                      </>
                    )}
                    {m.user_id === me ? 'Falta elegir quién sos' : 'Todavía no eligió quién es'}
                  </span>
                </span>
              </>
            )
            return m.user_id === me ? (
              <Link key={m.user_id} to="/perfil#yo" className="club-member">
                {body}
              </Link>
            ) : (
              <div key={m.user_id} className="club-member">
                {body}
              </div>
            )
          })}
        </div>
        {!duo && (
          <Link to="/club/gestion#invitar" className="btn block mt">
            <UserPlusIcon /> Invitar al club
          </Link>
        )}
      </section>
    </>
  )
}

/**
 * Cuentas del club: quién entró con su cuenta y con qué permiso. El admin principal nombra admins; los admins
 * pueden sacar a alguien. Las acciones van debajo del nombre para que la fila no se parta en pantallas chicas.
 */
export function ClubAccounts({ group }: { group: MyGroup }) {
  const auth = useAuth()
  const me = auth.session?.user.id
  const isAdmin = group.role === 'owner' || group.role === 'admin'
  const duo = group.kind === 'duo'
  const { members, error: loadError, load } = useMembers(group)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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

  const sorted = [...(members ?? [])].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role] || (a.display_name ?? '').localeCompare(b.display_name ?? '', 'es'))

  return (
    <section aria-labelledby="accounts-title">
      <div className="section-head">
        <h2 id="accounts-title">
          Cuentas {members && <span className="muted small">{members.length}</span>}
        </h2>
      </div>
      <p className="muted small">Quienes entraron con su cuenta. Los demás jugadores se anotan sin cuenta.</p>
      {members === null && !loadError && <p className="muted">Cargando…</p>}
      <ul className="account-list">
        {sorted.map((m) => {
          const canRole = group.role === 'owner' && !duo && m.user_id !== me
          const canRemove = isAdmin && !duo && m.user_id !== me && m.role !== 'owner'
          const name = m.display_name ?? m.username ?? 'Sin nombre'
          return (
            <li key={m.user_id} className="account-row">
              <Avatar player={userAsPlayer(m)} size={40} />
              <div className="account-body">
                <b className="block ellipsis">
                  {name} {m.user_id === me && <span className="muted small">(vos)</span>}
                </b>
                <span className="muted small block ellipsis">
                  {!duo && (
                    <>
                      {m.role === 'owner' && <CrownIcon className="inline-icon" weight="fill" aria-hidden />} {ROLE_NAMES[m.role]}
                    </>
                  )}
                  {m.username ? `${duo ? '' : ' · '}@${m.username}` : ''}
                </span>
                {(canRole || canRemove) && (
                  <div className="account-actions">
                    {canRole && (
                      <button className="link-btn small" disabled={busy} onClick={() => run(() => setMemberRole(group.code, m.user_id, m.role === 'admin' ? 'member' : 'admin').then(load))}>
                        {m.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                      </button>
                    )}
                    {canRemove && (
                      <button
                        className="link-btn small danger-text"
                        disabled={busy}
                        onClick={async () => {
                          const ok = await confirmAction({
                            title: `¿Sacar a ${name} del club?`,
                            detail: 'Sus partidas quedan en el historial. Puede volver a sumarse con una invitación.',
                            confirmLabel: 'Sacar del club',
                            danger: true,
                          })
                          if (ok) void run(() => removeMember(group.code, m.user_id).then(load))
                        }}
                      >
                        Sacar del club
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <ErrorText>{error || loadError}</ErrorText>
    </section>
  )
}

const ROLE_ORDER = { owner: 0, admin: 1, member: 2 } as const

/** Invitar: el link (lo principal), buscar cuentas por nombre, el link corto y la tarjeta para imprimir. */
export function InviteSection({ group }: { group: MyGroup }) {
  const { members } = useMembers(group)
  const [q, setQ] = useState('')
  const [found, setFound] = useState<FoundUser[]>([])
  const [invited, setInvited] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const link = clubShareLink(group)
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
    <section id="invitar" aria-labelledby="invite-title" className="invite">
      <h2 id="invite-title">Invitar</h2>
      <p className="muted small">Quien tenga el link puede entrar sin pedir permiso.</p>
      <div className="invite-box">
        <code>{link}</code>
      </div>
      <div className="invite-actions">
        <button
          className="btn primary"
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
        <button className="btn" onClick={copy} aria-live="polite">
          {copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <label className="field mt">
        <span className="field-label">O buscá a alguien que ya tenga cuenta</span>
        <span className="search">
          <MagnifyingGlassIcon aria-hidden />
          <input className="input" placeholder="Nombre o @usuario" value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="none" />
        </span>
      </label>
      {shown.length > 0 && (
        <ul className="account-list">
          {shown.map((u) => {
            const member = (members ?? []).some((m) => m.user_id === u.user_id)
            const done = invited.includes(u.user_id)
            return (
              <li key={u.user_id} className="account-row center">
                <Avatar player={userAsPlayer(u)} size={40} />
                <div className="account-body">
                  <b className="block ellipsis">{u.display_name}</b>
                  <span className="muted small block ellipsis">@{u.username}</span>
                </div>
                <button
                  className={'btn small' + (member || done ? '' : ' primary')}
                  disabled={member || done}
                  onClick={() =>
                    inviteToGroup(group.code, u.user_id)
                      .then(() => setInvited((x) => [...x, u.user_id]))
                      .catch((e) => setError(friendlyError(e)))
                  }
                >
                  {member ? 'Ya está' : done ? (
                    <>
                      <CheckIcon /> Invitado
                    </>
                  ) : (
                    'Invitar'
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {q.trim().length >= 2 && !shown.length && <p className="muted small">No encontramos cuentas con “{q.trim()}”.</p>}
      <ErrorText>{error}</ErrorText>

      {isAdmin && group.kind === 'group' && group.slug !== undefined && <ShortLinkEditor group={group} />}
      {group.kind === 'group' && (
        <div className="short-link">
          <p className="muted small">Una tarjeta A5 con la medalla y el QR del club, lista para imprimir y dejar en el lugar.</p>
          <Link to="/club/tarjeta" className="btn small">
            <PrinterIcon /> Tarjeta para imprimir
          </Link>
        </div>
      )}
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
