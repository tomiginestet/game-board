import { ArrowClockwiseIcon, WarningIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Loader, Logo } from '../../components/Logo'
import { admin, useAdminData, useIsAdmin, type DailyRow } from '../../lib/admin'
import '../../admin.css'

const SECTIONS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/personas', label: 'Personas' },
  { to: '/admin/clubes', label: 'Clubes' },
  { to: '/admin/juegos', label: 'Juegos' },
  { to: '/admin/reportes', label: 'Reportes' },
  { to: '/admin/papelera', label: 'Papelera' },
  { to: '/admin/registro', label: 'Registro' },
  { to: '/admin/control', label: 'Control' },
  { to: '/admin/salud', label: 'Salud' },
]

/**
 * Sólo para admins. A quien no lo es le mostramos lo mismo que una dirección que no existe
 * (el servidor igual rechaza cada función del panel).
 */
export function AdminLayout() {
  const isAdmin = useIsAdmin()
  if (isAdmin === undefined) return <Loader />
  if (!isAdmin) {
    return (
      <div className="page empty-page">
        <Logo kind="secuencia" size={72} />
        <h1>Esta casilla está vacía</h1>
        <p className="muted">No encontramos esta página. Puede que el link esté incompleto o que eso ya no exista.</p>
        <Link to="/" className="btn primary">
          Volver al inicio
        </Link>
      </div>
    )
  }
  return (
    <div className="page admin">
      <nav className="chips scroll admin-nav" aria-label="Secciones del panel">
        {SECTIONS.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.end} className={({ isActive }) => 'chip' + (isActive ? ' active' : '')}>
            {s.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}

/** Encabezado de cada sección, con el botón de recargar. */
export function AdminHead({ title, onReload, loading, children }: { title: string; onReload?: () => void; loading?: boolean; children?: ReactNode }) {
  return (
    <div className="section-head">
      <h1>{title}</h1>
      <div className="row gap">
        {children}
        {onReload && (
          <button className="btn small" onClick={onReload} disabled={loading} aria-label="Recargar">
            <ArrowClockwiseIcon className={loading ? 'spin' : undefined} />
          </button>
        )}
      </div>
    </div>
  )
}

export function AdminError({ error }: { error: string }) {
  if (!error) return null
  return (
    <p className="status-message error" role="alert">
      <WarningIcon weight="fill" /> {error}
    </p>
  )
}

const usd = (n: number) => `US$ ${Number(n).toFixed(2)}`
const nf = (n: number) => Number(n).toLocaleString('es')

function Tile({ value, label, hint }: { value: string | number; label: string; hint?: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{typeof value === 'number' ? nf(value) : value}</span>
      <span className="stat-label">{label}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  )
}

const DAY_FMT = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const dayLabel = (d: string) => DAY_FMT.format(new Date(d + 'T00:00:00Z'))

/** Barras de los últimos 30 días, de una sola serie, con el valor de cada día al pasar el dedo o el mouse. */
function DailyBars({ rows, field, title }: { rows: DailyRow[]; field: keyof Omit<DailyRow, 'day'>; title: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const values = rows.map((r) => Number(r[field]))
  const max = Math.max(1, ...values)
  const total = values.reduce((a, b) => a + b, 0)
  const w = 300
  const h = 96
  const step = w / Math.max(1, values.length)
  const bw = Math.max(2, step - 2)
  const shown = hover ?? values.length - 1
  return (
    <figure className="admin-chart">
      <figcaption>
        <span>{title}</span>
        <span className="muted small">
          {rows[shown] ? `${dayLabel(rows[shown].day)}: ${nf(values[shown])}` : ''} · 30 días: {nf(total)}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`${title}: ${nf(total)} en los últimos 30 días`} onPointerLeave={() => setHover(null)}>
        <line x1={0} x2={w} y1={h - 0.5} y2={h - 0.5} className="admin-chart-base" />
        {values.map((v, i) => {
          const bh = v ? Math.max(3, (v / max) * (h - 6)) : 0
          return (
            <g key={rows[i].day} onPointerEnter={() => setHover(i)}>
              <rect x={i * step} y={0} width={step} height={h} fill="transparent" />
              {bh > 0 && <rect x={i * step + 1} y={h - bh} width={bw} height={bh} rx={2} className={'admin-chart-bar' + (i === shown ? ' on' : '')} />}
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

export function AdminOverview() {
  const { data, error, loading, reload } = useAdminData(admin.overview, [])
  const t = data?.totals
  return (
    <>
      <AdminHead title="Panel" onReload={reload} loading={loading} />
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {t && (
        <>
          {data.purged > 0 && <p className="status-message info">Se borraron para siempre {data.purged} cosas que llevaban más de 30 días en la papelera.</p>}
          {(t.open_reports > 0 || t.trash > 0) && (
            <div className="row gap wrap">
              {t.open_reports > 0 && (
                <Link className="pill accent" to="/admin/reportes">
                  {t.open_reports} reportes sin revisar
                </Link>
              )}
              {t.trash > 0 && (
                <Link className="pill" to="/admin/papelera">
                  {t.trash} en la papelera
                </Link>
              )}
            </div>
          )}

          <section>
            <h2>Personas</h2>
            <div className="stat-grid">
              <Tile value={t.users} label="cuentas" hint={`+${t.users_7d} en 7 días`} />
              <Tile value={t.active_1d} label="activas hoy" />
              <Tile value={t.active_7d} label="activas 7 días" />
              <Tile value={t.active_28d} label="activas 28 días" />
            </div>
            {t.users > t.profiles && <p className="muted small">{t.users - t.profiles} cuentas todavía no armaron su perfil.</p>}
          </section>

          <section>
            <h2>Clubes y partidas</h2>
            <div className="stat-grid">
              <Tile value={t.groups} label="clubes" hint={`+${t.groups_7d} en 7 días`} />
              <Tile value={t.active_groups_7d} label="anotaron en 7 días" hint={`${t.active_groups_28d} en 28`} />
              <Tile value={t.plays} label="partidas" hint={`${t.plays_7d} en 7 días`} />
              <Tile value={t.duos} label="mano a mano" />
            </div>
            <div className="stat-grid">
              <Tile value={t.public_groups} label="clubes públicos" />
              <Tile value={t.custom_games} label="juegos agregados" />
              <Tile value={usd(t.ai_month_usd)} label="IA este mes" hint={`${t.ai_month_calls} pedidos`} />
              <Tile value={t.open_reports} label="reportes" />
            </div>
          </section>

          <section className="admin-charts">
            <h2>Últimos 30 días</h2>
            <DailyBars rows={data.daily} field="active" title="Personas activas por día" />
            <DailyBars rows={data.daily} field="plays" title="Partidas anotadas" />
            <DailyBars rows={data.daily} field="signups" title="Cuentas nuevas" />
            <DailyBars rows={data.daily} field="groups" title="Clubes nuevos" />
            <p className="muted small">
              "Activas" cuenta las cuentas que abrieron la app ese día (se empieza a medir con esta versión). Las partidas sólo cuentan las de clubes
              sincronizados.
            </p>
          </section>

          <section>
            <h2>Semana por semana</h2>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Semana</th>
                    <th>Clubes activos</th>
                    <th>Partidas</th>
                    <th>Clubes nuevos</th>
                    <th>Cuentas nuevas</th>
                    <th>IA</th>
                  </tr>
                </thead>
                <tbody>
                  {data.weekly.map((w) => (
                    <tr key={w.semana}>
                      <td>{dayLabel(w.semana)}</td>
                      <td>{w.clubes_activos}</td>
                      <td>{w.partidas}</td>
                      <td>{w.clubes_nuevos}</td>
                      <td>{w.cuentas_nuevas}</td>
                      <td>{w.juegos_con_ia ? `${w.juegos_con_ia} · ${usd(w.gasto_ia_usd)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Juegos más anotados</h2>
            {!data.games.length && <p className="empty">Todavía no hay partidas sincronizadas.</p>}
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Juego</th>
                    <th>Partidas</th>
                    <th>30 días</th>
                    <th>Clubes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.games.map((g) => (
                    <tr key={g.juego}>
                      <td className="admin-name">{g.nombre}</td>
                      <td>{g.partidas}</td>
                      <td>{g.partidas_30_dias}</td>
                      <td>{g.clubes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>¿Los clubes vuelven?</h2>
            <p className="muted small">Clubes que anotaron su primera partida esa semana, y cuántos volvieron a anotar 1, 2, 3 y 4 semanas después.</p>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Empezaron</th>
                    <th>Clubes</th>
                    <th>+1</th>
                    <th>+2</th>
                    <th>+3</th>
                    <th>+4</th>
                  </tr>
                </thead>
                <tbody>
                  {data.retention.map((r) => (
                    <tr key={r.semana_de_inicio}>
                      <td>{dayLabel(r.semana_de_inicio)}</td>
                      <td>{r.clubes}</td>
                      {[r.semana_1, r.semana_2, r.semana_3, r.semana_4].map((v, i) => (
                        <td key={i}>{v === null ? '' : `${v} (${Math.round((v / Math.max(1, r.clubes)) * 100)}%)`}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <h3>Visitas y rendimiento (Vercel)</h3>
            <p className="muted">
              Las visitas se miden con Vercel Web Analytics, sin cookies y sin mandar los códigos de los clubes. Por ahora se ven en el panel de Vercel;
              el próximo paso es traerlas acá.
            </p>
            <a className="btn" href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">
              Abrir Vercel
            </a>
          </section>
        </>
      )}
    </>
  )
}
