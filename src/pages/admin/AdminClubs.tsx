import { ArrowLeftIcon, CrownIcon, DownloadSimpleIcon, MagnifyingGlassIcon, PaperPlaneTiltIcon, TrashIcon, UserMinusIcon } from '@phosphor-icons/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../../components/Logo'
import { actionLabel, admin, runAdmin, downloadJson, useAdminData, type AdminClubDetail, type AdminPlay } from '../../lib/admin'
import { confirmAction, toast } from '../../lib/feedback'
import { findGame } from '../../lib/games'
import { formatDate } from '../../lib/hooks'
import { friendlyError } from '../../lib/text'
import { AdminError, AdminHead } from './Admin'

const when = (iso: string | null | undefined) => (iso ? formatDate(new Date(iso).getTime()) : '—')

type Filter = 'all' | 'group' | 'duo' | 'public'

export function AdminClubs() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('group')
  const query = useDeferredValue(q)
  const { data, error, loading, reload } = useAdminData(() => admin.clubs(query), [query])
  const shown = (data ?? []).filter((c) => filter === 'all' || (filter === 'public' ? c.is_public : c.kind === filter))
  return (
    <>
      <AdminHead title="Clubes" onReload={reload} loading={loading} />
      <label className="search-field">
        <MagnifyingGlassIcon aria-hidden />
        <input className="input" type="search" placeholder="Nombre, descripción o código" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div className="chips">
        {(
          [
            ['group', 'Clubes'],
            ['public', 'Públicos'],
            ['duo', 'Mano a mano'],
            ['all', 'Todos'],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button key={f} className={'chip' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
            {label}
          </button>
        ))}
      </div>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && !shown.length && <p className="empty">No hay clubes con ese filtro.</p>}
      <div className="list">
        {shown.map((c) => (
          <Link key={c.code} to={`/admin/clubes/${c.code}`} className="card admin-row">
            <span className="group-emoji small" aria-hidden>
              {c.emoji ?? (c.kind === 'duo' ? '⚔️' : '🎲')}
            </span>
            <div className="grow">
              <b className="admin-name">{c.name}</b>
              <span className="muted small admin-name">
                {c.owner ? `de ${c.owner}` : 'sin dueño'} · creado {when(c.created_at)} · última actividad {when(c.last_activity)}
              </span>
              <span className="row gap wrap small">
                <span>{c.members} con cuenta</span>
                <span>{c.players} jugadores</span>
                <span>{c.plays} partidas</span>
                {c.games > 0 && <span>{c.games} juegos propios</span>}
                {c.is_public && <span className="pill tiny">público</span>}
                {c.open_reports > 0 && <span className="pill tiny danger">{c.open_reports} reportes</span>}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

function gameName(club: AdminClubDetail, id: string): string {
  const own = club.games.find((g) => g.id === id)
  if (own) return `${own.emoji ?? ''} ${own.name ?? id}`.trim()
  const g = findGame({ games: [] }, id)
  return g ? `${g.emoji} ${g.name}` : `❔ ${id}`
}

function playSummary(p: AdminPlay, names: Map<string, string>): string {
  const players = p.players.map((id) => names.get(id) ?? '¿?')
  if (p.kind === 'match') {
    const w = p.winner ? names.get(p.winner) : undefined
    return w ? `Ganó ${w} (${players.join(', ')})` : players.join(' vs ')
  }
  if (p.status !== 'finished') return players.join(', ')
  // `places` es por lado, y los jugadores vienen aplanados: con lados de uno alcanza para decir quién ganó.
  if (p.places && p.places.length === players.length) {
    const winners = players.filter((_, i) => p.places![i] === 1)
    return `Ganó ${winners.join(' y ')} · ${players.join(', ')}`
  }
  return players.join(', ')
}

function ClubEditor({ club, onSaved }: { club: AdminClubDetail; onSaved: () => void }) {
  const [form, setForm] = useState({ name: club.name, description: club.description ?? '', emoji: club.emoji ?? '', is_public: club.is_public })
  const [busy, setBusy] = useState(false)
  const changed = form.name !== club.name || form.description !== (club.description ?? '') || form.emoji !== (club.emoji ?? '') || form.is_public !== club.is_public
  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault()
        setBusy(true)
        await runAdmin('Club actualizado', () => admin.updateClub(club.code, form), onSaved)
        setBusy(false)
      }}
    >
      <h3>Editar</h3>
      <label className="field">
        <span>Nombre</span>
        <input className="input" value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea className="input" value={form.description} maxLength={200} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>
      <label className="field">
        <span>Emoji</span>
        <input className="input" value={form.emoji} maxLength={16} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
      </label>
      {club.kind === 'group' && (
        <label className="field row-between">
          <span>Aparece en el buscador</span>
          <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} />
        </label>
      )}
      <button className="btn primary" disabled={!changed || busy || !form.name.trim()}>
        Guardar cambios
      </button>
    </form>
  )
}

export function AdminClub() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const { data: club, error, loading, reload } = useAdminData(() => admin.club(code), [code])
  const names = useMemo(() => new Map((club?.players ?? []).map((p) => [p.id, `${p.emoji} ${p.name}`])), [club])
  const [message, setMessage] = useState({ title: '', text: '' })
  if (!club) {
    return (
      <>
        <Link to="/admin/clubes" className="back">
          <ArrowLeftIcon /> Clubes
        </Link>
        <AdminError error={error} />
        {loading && <Loader />}
      </>
    )
  }
  const claimedBy = new Map(club.members.filter((m) => m.player_id).map((m) => [m.player_id!, m.label]))
  const deleteEntity = (kind: string, id: string, label: string) => runAdmin(`${label} borrado`, () => admin.deleteEntity(club.code, kind, id), reload)

  return (
    <>
      <Link to="/admin/clubes" className="back">
        <ArrowLeftIcon /> Clubes
      </Link>
      <div className="row gap admin-title">
        <span className="group-emoji" aria-hidden>
          {club.emoji ?? (club.kind === 'duo' ? '⚔️' : '🎲')}
        </span>
        <div className="grow">
          <h1 className="admin-name">{club.name}</h1>
          {club.description && <p className="muted">{club.description}</p>}
          <span className="muted small">
            {club.kind === 'duo' ? 'Mano a mano' : club.is_public ? 'Club público' : 'Club privado'} · código <code>{club.code}</code> · creado {when(club.created_at)}
          </span>
        </div>
      </div>
      <AdminError error={error} />
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-value">{club.members.length}</span>
          <span className="stat-label">con cuenta</span>
        </div>
        <div className="stat">
          <span className="stat-value">{club.players.length}</span>
          <span className="stat-label">jugadores</span>
        </div>
        <div className="stat">
          <span className="stat-value">{(club.counts.play ?? 0) + (club.counts.match ?? 0)}</span>
          <span className="stat-label">partidas</span>
        </div>
        <div className="stat">
          <span className="stat-value">{club.pending_requests}</span>
          <span className="stat-label">solicitudes</span>
        </div>
      </div>

      {club.reports.length > 0 && (
        <section>
          <h2>Reportes</h2>
          <div className="list">
            {club.reports.map((r) => (
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

      <section>
        <h2>Integrantes con cuenta</h2>
        {!club.members.length && <p className="muted">Nadie con cuenta (se usa sólo con el link).</p>}
        <div className="list">
          {club.members.map((m) => (
            <div key={m.user_id} className="card admin-row">
              <span className="group-emoji small" aria-hidden>
                {m.emoji ?? '🙂'}
              </span>
              <div className="grow">
                <Link to={`/admin/personas/${m.user_id}`}>
                  <b className="admin-name">{m.label}</b>
                </Link>
                <span className="muted small">
                  {m.role === 'owner' ? 'Dueño' : m.role === 'admin' ? 'Admin' : 'Integrante'} · desde {when(m.joined_at)}
                  {m.player_id ? ` · juega como ${names.get(m.player_id) ?? '¿?'}` : ''}
                </span>
              </div>
              <div className="row gap">
                {m.role !== 'owner' && (
                  <button
                    className="btn small"
                    aria-label={`Hacer dueño a ${m.label}`}
                    title="Hacer dueño"
                    onClick={async () => {
                      const ok = await confirmAction({
                        title: `¿Pasarle el club a ${m.label}?`,
                        detail: 'Queda como dueño; el dueño de ahora pasa a ser admin.',
                        confirmLabel: 'Hacer dueño',
                      })
                      if (ok) await runAdmin('Nuevo dueño', () => admin.setClubOwner(club.code, m.user_id), reload)
                    }}
                  >
                    <CrownIcon />
                  </button>
                )}
                <button
                  className="btn small ghost-danger"
                  aria-label={`Sacar a ${m.label} del club`}
                  title="Sacar del club"
                  onClick={() => void runAdmin(`${m.label} ya no está en el club`, () => admin.removeMember(club.code, m.user_id), reload)}
                >
                  <UserMinusIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Jugadores ({club.players.length})</h2>
        <div className="list">
          {club.players.map((p) => (
            <div key={p.id} className="card admin-row">
              <span className="group-emoji small" aria-hidden style={{ background: p.color }}>
                {p.emoji}
              </span>
              <div className="grow">
                <b className="admin-name">{p.name}</b>
                <span className="muted small">{claimedBy.get(p.id) ? `es ${claimedBy.get(p.id)}` : 'sin cuenta'}</span>
              </div>
              <button className="btn small ghost-danger" aria-label={`Borrar a ${p.name}`} onClick={() => void deleteEntity('player', p.id, 'Jugador')}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Juegos propios ({club.games.length})</h2>
        {!club.games.length && <p className="muted">El club usa sólo juegos de fábrica.</p>}
        <div className="list">
          {club.games.map((g) => (
            <div key={g.id} className="card admin-row">
              <span className="group-emoji small" aria-hidden>
                {g.emoji ?? '🎲'}
              </span>
              <div className="grow">
                <Link to={`/admin/juegos/${club.code}/${g.id}`}>
                  <b className="admin-name">{g.name ?? g.id}</b>
                </Link>
                <span className="muted small">
                  {g.author ? `de ${g.author}` : 'autor desconocido'} · {g.plays} partidas · {when(g.updated_at)}
                </span>
              </div>
              <button className="btn small ghost-danger" aria-label={`Borrar ${g.name ?? g.id}`} onClick={() => void deleteEntity('game', g.id, 'Juego')}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Partidas recientes</h2>
        {!club.plays.length && <p className="muted">Todavía no hay partidas sincronizadas.</p>}
        <div className="list">
          {club.plays.slice(0, 60).map((p) => (
            <div key={p.kind + p.id} className="card admin-row">
              <div className="grow">
                <b className="admin-name">{gameName(club, p.gameId)}</b>
                <span className="small admin-name">{playSummary(p, names)}</span>
                <span className="muted small">
                  {p.createdAt ? formatDate(p.createdAt) : '—'} · {p.status === 'finished' ? 'terminada' : p.status === 'live' ? 'en juego' : 'sin empezar'}
                  {p.author ? ` · subida por ${p.author}` : ''}
                </span>
              </div>
              <button className="btn small ghost-danger" aria-label="Borrar partida" onClick={() => void deleteEntity(p.kind, p.id, p.kind === 'match' ? 'Partido' : 'Partida')}>
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
        {club.plays.length > 60 && <p className="muted small">Se muestran las 60 más nuevas. Para ver todo, bajá los datos del club.</p>}
      </section>

      {club.cups.length > 0 && (
        <section>
          <h2>Torneos</h2>
          <div className="list">
            {club.cups.map((c) => (
              <div key={c.kind + c.id} className="card admin-row">
                <div className="grow">
                  <b className="admin-name">{c.name ?? 'Torneo'}</b>
                  <span className="muted small">
                    {gameName(club, c.gameId)} · {c.createdAt ? formatDate(c.createdAt) : '—'}
                  </span>
                </div>
                <button className="btn small ghost-danger" aria-label={`Borrar ${c.name ?? 'torneo'}`} onClick={() => void deleteEntity(c.kind, c.id, 'Torneo')}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <ClubEditor key={club.name + club.description + club.emoji + club.is_public} club={club} onSaved={reload} />

      {club.members.length > 0 && (
        <form
          className="card"
          onSubmit={async (e) => {
            e.preventDefault()
            const ok = await runAdmin('Mensaje enviado', () => admin.sendMessage('club', club.code, message.title, message.text))
            if (ok) setMessage({ title: '', text: '' })
          }}
        >
          <h3>Mandar un mensaje a los integrantes</h3>
          <p className="muted small">Les llega a sus notificaciones, como un aviso de Game Board.</p>
          <label className="field">
            <span>Título</span>
            <input className="input" value={message.title} maxLength={120} onChange={(e) => setMessage({ ...message, title: e.target.value })} />
          </label>
          <label className="field">
            <span>Mensaje (opcional)</span>
            <textarea className="input" rows={3} maxLength={1000} value={message.text} onChange={(e) => setMessage({ ...message, text: e.target.value })} />
          </label>
          <button className="btn" disabled={!message.title.trim()}>
            <PaperPlaneTiltIcon /> Mandar a {club.members.length}
          </button>
        </form>
      )}

      <section className="card">
        <h3>Datos</h3>
        <div className="row gap wrap">
          <button className="btn" onClick={() => void admin.exportClub(club.code).then((d) => downloadJson(`club-${club.name}.json`, d), (e) => toast(friendlyError(e)))}>
            <DownloadSimpleIcon /> Bajar los datos del club
          </button>
          <button
            className="btn danger"
            onClick={async () => {
              const ok = await confirmAction({
                title: `¿Borrar ${club.name}?`,
                detail: `Se borra el club con sus ${club.players.length} jugadores y ${(club.counts.play ?? 0) + (club.counts.match ?? 0)} partidas, para todos sus integrantes (también en el Ping Pong Club). Durante 30 días lo podés recuperar desde la papelera, con el mismo código.`,
                confirmLabel: 'Borrar club',
                danger: true,
              })
              if (ok && (await runAdmin('Club borrado', () => admin.deleteClub(club.code)))) navigate('/admin/clubes')
            }}
          >
            <TrashIcon /> Borrar club
          </button>
        </div>
      </section>

      {club.log.length > 0 && (
        <section>
          <h2>Historial en el panel</h2>
          <ul className="admin-log">
            {club.log.map((l) => (
              <li key={l.id}>
                <span className="muted small">{when(l.at)}</span> {actionLabel(l.action)} {l.label && <span className="muted">· {l.label}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
