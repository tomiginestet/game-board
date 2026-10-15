import { ArrowLeftIcon, DownloadSimpleIcon, MagnifyingGlassIcon, ProhibitIcon, RobotIcon } from '@phosphor-icons/react'
import { useDeferredValue, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { Loader } from '../../components/Logo'
import { actionLabel, admin, downloadJson, runAdmin, useAdminData, userName, type AdminUser } from '../../lib/admin'
import { confirmAction, toast } from '../../lib/feedback'
import { formatDate } from '../../lib/hooks'
import { friendlyError } from '../../lib/text'
import { AdminError, AdminHead } from './Admin'

const when = (iso: string | null | undefined) => (iso ? formatDate(new Date(iso).getTime()) : '—')

function userAvatar(u: Pick<AdminUser, 'user_id' | 'emoji' | 'color' | 'display_name' | 'username' | 'email'>) {
  return <Avatar player={{ id: u.user_id, name: userName(u), emoji: u.emoji ?? '🙂', color: u.color ?? '#3b82f6', createdAt: 0 }} size={40} />
}

function Badges({ u }: { u: AdminUser }) {
  return (
    <>
      {u.is_admin && <span className="pill tiny gold">admin</span>}
      {u.deleted && <span className="pill tiny danger">en la papelera</span>}
      {u.banned && <span className="pill tiny danger">desactivada</span>}
      {u.ai_blocked && <span className="pill tiny">sin IA</span>}
      {!u.username && !u.deleted && <span className="pill tiny">sin perfil</span>}
    </>
  )
}

export function AdminPeople() {
  const [q, setQ] = useState('')
  const query = useDeferredValue(q)
  const { data, error, loading, reload } = useAdminData(() => admin.users(query), [query])
  return (
    <>
      <AdminHead title="Personas" onReload={reload} loading={loading} />
      <label className="search-field">
        <MagnifyingGlassIcon aria-hidden />
        <input className="input" type="search" placeholder="Mail, @usuario o nombre" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && <p className="muted small">{data.length === 500 ? 'Las primeras 500' : `${data.length} cuentas`}</p>}
      <div className="list">
        {data?.map((u) => (
          <Link key={u.user_id} to={`/admin/personas/${u.user_id}`} className="card admin-row">
            {userAvatar(u)}
            <div className="grow">
              <b className="admin-name">
                {userName(u)} {u.username && <span className="muted">@{u.username}</span>}
              </b>
              <span className="muted small admin-name">{u.email}</span>
              <span className="muted small">
                {u.providers.join(' + ') || 'sin login'} · alta {when(u.created_at)} · activa {u.last_active ? when(u.last_active + 'T12:00:00') : '—'}
              </span>
              <span className="row gap wrap small">
                <span>{u.clubs} clubes</span>
                <span>{u.games_created} juegos</span>
                <span>{u.plays_created} partidas</span>
                {Number(u.ai_usd) > 0 && <span>IA US$ {Number(u.ai_usd).toFixed(2)}</span>}
                <Badges u={u} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export function AdminPerson() {
  const { id = '' } = useParams()
  const { data: u, error, loading, reload } = useAdminData(() => admin.user(id), [id])
  if (!u) {
    return (
      <>
        <Link to="/admin/personas" className="back">
          <ArrowLeftIcon /> Personas
        </Link>
        <AdminError error={error} />
        {loading && <Loader />}
      </>
    )
  }
  const name = userName(u)
  return (
    <>
      <Link to="/admin/personas" className="back">
        <ArrowLeftIcon /> Personas
      </Link>
      <div className="row gap admin-title">
        {userAvatar(u)}
        <div className="grow">
          <h1 className="admin-name">{name}</h1>
          <span className="muted admin-name">
            {u.username ? `@${u.username} · ` : ''}
            {u.email}
          </span>
          <span className="row gap wrap">
            <Badges u={u} />
          </span>
        </div>
      </div>
      <AdminError error={error} />

      <dl className="kv-list">
        <div>
          <dt>Entra con</dt>
          <dd>{u.providers.join(' + ') || '—'}</dd>
        </div>
        <div>
          <dt>Alta</dt>
          <dd>{when(u.created_at)}</dd>
        </div>
        <div>
          <dt>Último login</dt>
          <dd>{when(u.last_sign_in_at)}</dd>
        </div>
        <div>
          <dt>Días activa</dt>
          <dd>{u.activity_days}</dd>
        </div>
        <div>
          <dt>Amigos</dt>
          <dd>{u.friends}</dd>
        </div>
        <div>
          <dt>IA (total)</dt>
          <dd>US$ {Number(u.ai_usd).toFixed(2)}</dd>
        </div>
      </dl>

      <section>
        <h2>Clubes ({u.memberships.length})</h2>
        {!u.memberships.length && <p className="muted">No está en ningún club.</p>}
        <div className="list">
          {u.memberships.map((m) => (
            <Link key={m.code} to={`/admin/clubes/${m.code}`} className="card admin-row">
              <span className="group-emoji small" aria-hidden>
                {m.emoji ?? (m.kind === 'duo' ? '⚔️' : '🎲')}
              </span>
              <div className="grow">
                <b className="admin-name">{m.name}</b>
                <span className="muted small">
                  {m.role === 'owner' ? 'Dueño' : m.role === 'admin' ? 'Admin' : 'Integrante'}
                  {m.kind === 'duo' ? ' · mano a mano' : ''} · desde {when(m.joined_at)}
                  {m.player_id ? '' : ' · sin jugador'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Juegos que creó ({u.games.length})</h2>
        {!u.games.length && <p className="muted">Ninguno (o los creó antes de que guardáramos quién los crea).</p>}
        <div className="list">
          {u.games.map((g) => (
            <Link key={g.code + g.id} to={`/admin/juegos/${g.code}/${g.id}`} className="card admin-row">
              <span className="group-emoji small" aria-hidden>
                {g.emoji ?? '🎲'}
              </span>
              <div className="grow">
                <b className="admin-name">{g.name ?? g.id}</b>
                <span className="muted small">
                  en {g.club} · {when(g.updated_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {u.reports_about.length > 0 && (
        <section>
          <h2>Reportes sobre esta cuenta</h2>
          <div className="list">
            {u.reports_about.map((r) => (
              <div key={r.id} className="card">
                <p>“{r.reason}”</p>
                <span className="muted small">
                  {when(r.created_at)} · {r.status === 'open' ? 'sin revisar' : r.status === 'resolved' ? 'resuelto' : 'descartado'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {u.ai.length > 0 && (
        <section>
          <h2>Uso de IA</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <tbody>
                {u.ai.map((a, i) => (
                  <tr key={i}>
                    <td>{when(a.at)}</td>
                    <td>{a.model}</td>
                    <td>US$ {Number(a.usd).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="card">
        <h3>Acciones</h3>
        <div className="row gap wrap">
          <button className="btn" onClick={() => void admin.exportUser(u.user_id).then((d) => downloadJson(`cuenta-${u.username ?? u.user_id}.json`, d), (e) => toast(friendlyError(e)))}>
            <DownloadSimpleIcon /> Bajar sus datos
          </button>
          <button className="btn" disabled={u.deleted} onClick={() => void runAdmin(u.ai_blocked ? 'Le devolvimos la IA' : 'Ya no puede usar la IA', () => admin.setAiBlocked(u.user_id, !u.ai_blocked), reload)}>
            <RobotIcon /> {u.ai_blocked ? 'Devolverle la IA' : 'Cortarle la IA'}
          </button>
          {!u.is_admin && !u.deleted && (
            <button
              className="btn"
              onClick={async () => {
                if (!u.banned) {
                  const ok = await confirmAction({
                    title: `¿Desactivar la cuenta de ${name}?`,
                    detail: 'No puede volver a entrar hasta que la reactives; la sesión que tiene abierta se corta en menos de una hora. Sus clubes, jugadores y partidas no se tocan.',
                    confirmLabel: 'Desactivar cuenta',
                    danger: true,
                  })
                  if (!ok) return
                }
                await runAdmin(u.banned ? 'Cuenta reactivada' : 'Cuenta desactivada', () => admin.setBanned(u.user_id, !u.banned), reload)
              }}
            >
              <ProhibitIcon /> {u.banned ? 'Reactivar cuenta' : 'Desactivar cuenta'}
            </button>
          )}
        </div>
      </section>

      {u.log.length > 0 && (
        <section>
          <h2>Historial en el panel</h2>
          <ul className="admin-log">
            {u.log.map((l) => (
              <li key={l.id}>
                <span className="muted small">{when(l.at)}</span> {actionLabel(l.action)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
