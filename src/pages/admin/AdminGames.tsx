import { ArrowLeftIcon, MagnifyingGlassIcon, TrashIcon } from '@phosphor-icons/react'
import { useDeferredValue, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../../components/Logo'
import { admin, runAdmin, useAdminData } from '../../lib/admin'
import { formatDate } from '../../lib/hooks'
import { AdminError, AdminHead } from './Admin'

const when = (iso: string | null | undefined) => (iso ? formatDate(new Date(iso).getTime()) : '—')

/** Juegos agregados por los clubes (los de fábrica no se tocan desde acá). */
export function AdminGames() {
  const [q, setQ] = useState('')
  const query = useDeferredValue(q)
  const { data, error, loading, reload } = useAdminData(() => admin.games(query), [query])
  return (
    <>
      <AdminHead title="Juegos agregados" onReload={reload} loading={loading} />
      <p className="muted">Los que crearon los clubes, a mano o con IA. Al borrar uno, sus partidas quedan como "Juego borrado".</p>
      <label className="search-field">
        <MagnifyingGlassIcon aria-hidden />
        <input className="input" type="search" placeholder="Juego o club" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && !data.length && <p className="empty">Ningún club agregó juegos todavía.</p>}
      <div className="list">
        {data?.map((g) => (
          <div key={g.code + g.id} className="card admin-row">
            <span className="group-emoji small" aria-hidden>
              {g.emoji ?? '🎲'}
            </span>
            <Link to={`/admin/juegos/${g.code}/${g.id}`} className="grow">
              <b className="admin-name">{g.name ?? g.id}</b>
              <span className="muted small admin-name">
                {g.club_emoji ?? '🎲'} {g.club} · {g.author ? `de ${g.author}` : 'autor desconocido'} · {when(g.updated_at)}
              </span>
              <span className="row gap wrap small">
                <span>{g.plays} partidas</span>
                {g.open_reports > 0 && <span className="pill tiny danger">{g.open_reports} reportes</span>}
              </span>
            </Link>
            <button className="btn small ghost-danger" aria-label={`Borrar ${g.name ?? g.id}`} onClick={() => void runAdmin('Juego borrado', () => admin.deleteEntity(g.code, 'game', g.id), reload)}>
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export function AdminGame() {
  const { code = '', id = '' } = useParams()
  const navigate = useNavigate()
  const { data, error, loading } = useAdminData(() => admin.entity(code, 'game', id), [code, id])
  const game = data?.data as { name?: string; emoji?: string; description?: string; category?: string; mode?: string } | null | undefined
  return (
    <>
      <Link to="/admin/juegos" className="back">
        <ArrowLeftIcon /> Juegos
      </Link>
      <AdminError error={error} />
      {loading && <Loader />}
      {data === null && <p className="empty">Ese juego no existe.</p>}
      {data && (
        <>
          <div className="row gap admin-title">
            <span className="group-emoji" aria-hidden>
              {game?.emoji ?? '🎲'}
            </span>
            <div className="grow">
              <h1 className="admin-name">{game?.name ?? id}</h1>
              <span className="muted small">
                {data.author ? `Lo subió ${data.author}` : 'Autor desconocido'} · {when(data.updated_at)} ·{' '}
                <Link to={`/admin/clubes/${code}`}>ver el club</Link>
              </span>
            </div>
          </div>
          {data.deleted && <p className="status-message info">Está borrado. Si fue desde el panel, lo podés recuperar desde la papelera.</p>}
          {game?.description && <p>{game.description}</p>}
          {!data.deleted && (
            <button
              className="btn danger"
              onClick={async () => {
                if (await runAdmin('Juego borrado', () => admin.deleteEntity(code, 'game', id))) navigate('/admin/juegos')
              }}
            >
              <TrashIcon /> Borrar juego
            </button>
          )}
          {game && (
            <details className="card">
              <summary>Ficha completa (JSON)</summary>
              <pre className="admin-json">{JSON.stringify(game, null, 2)}</pre>
            </details>
          )}
        </>
      )}
    </>
  )
}
