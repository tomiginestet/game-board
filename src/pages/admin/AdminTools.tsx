import { ArrowCounterClockwiseIcon, CheckIcon, PaperPlaneTiltIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../../components/Logo'
import { actionLabel, admin, runAdmin, useAdminData, type AiSetting, type Announcement, type Report, type TrashItem } from '../../lib/admin'
import { confirmAction, toast } from '../../lib/feedback'
import { formatDate } from '../../lib/hooks'
import { friendlyError } from '../../lib/text'
import { AdminError, AdminHead } from './Admin'

const when = (iso: string | null | undefined) => (iso ? formatDate(new Date(iso).getTime()) : '—')

// ---------------------------------------------------------------------------
// Reportes

function reportTarget(r: Report): ReactNode {
  const label = r.target_label ?? 'ya no existe'
  if (r.target_kind === 'user' && r.target.user_id) return <Link to={`/admin/personas/${r.target.user_id}`}>👤 {label}</Link>
  if (r.target_kind === 'group' && r.club_code) return <Link to={`/admin/clubes/${r.club_code}`}>🎲 {label}</Link>
  if (r.target_kind === 'game' && r.target.code) return <Link to={`/admin/juegos/${r.target.code}/${r.target.id}`}>🃏 {label}</Link>
  return label
}

export function AdminReports() {
  const [all, setAll] = useState(false)
  const { data, error, loading, reload } = useAdminData(() => admin.reports(all ? 'all' : 'open'), [all])
  return (
    <>
      <AdminHead title="Reportes" onReload={reload} loading={loading} />
      <div className="segmented">
        <button className={all ? '' : 'active'} onClick={() => setAll(false)}>
          Sin revisar
        </button>
        <button className={all ? 'active' : ''} onClick={() => setAll(true)}>
          Todos
        </button>
      </div>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && !data.length && <p className="empty">{all ? 'Nadie reportó nada todavía.' : 'No hay reportes para revisar.'}</p>}
      <div className="list">
        {data?.map((r) => (
          <div key={r.id} className="card">
            <p className="admin-name">
              <b>{reportTarget(r)}</b>
            </p>
            <p>“{r.reason}”</p>
            <span className="muted small">
              {r.reporter_label ? `Reportó ${r.reporter_label}` : 'Cuenta borrada'} · {when(r.created_at)}
              {r.status !== 'open' && ` · ${r.status === 'resolved' ? 'resuelto' : 'descartado'}`}
            </span>
            <div className="row gap wrap">
              {r.status === 'open' ? (
                <>
                  <button className="btn small primary" onClick={() => void runAdmin('Reporte resuelto', () => admin.resolveReport(r.id, 'resolved'), reload)}>
                    <CheckIcon /> Resuelto
                  </button>
                  <button className="btn small" onClick={() => void runAdmin('Reporte descartado', () => admin.resolveReport(r.id, 'dismissed'), reload)}>
                    <XIcon /> Descartar
                  </button>
                </>
              ) : (
                <button className="btn small" onClick={() => void runAdmin('Reporte reabierto', () => admin.resolveReport(r.id, 'open'), reload)}>
                  Reabrir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Papelera

const TRASH_KIND: Record<TrashItem['kind'], string> = { entity: '', club: 'Club', member: 'Salida de club', user: 'Cuenta' }

function daysLeft(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000))
}

export function AdminTrash() {
  const { data, error, loading, reload } = useAdminData(admin.trash, [])
  const pending = (data ?? []).filter((t) => !t.restored_at && !t.purged_at)
  const done = (data ?? []).filter((t) => t.restored_at || t.purged_at)
  return (
    <>
      <AdminHead title="Papelera" onReload={reload} loading={loading} />
      <p className="muted">Los juegos, partidas, jugadores y torneos que borrás desde el panel quedan acá 30 días para recuperarlos. Después ya no se pueden recuperar (se revisa cada vez que abrís el panel).</p>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && !pending.length && <p className="empty">La papelera está vacía.</p>}
      <div className="list">
        {pending.map((t) => (
          <div key={t.id} className="card admin-row">
            <div className="grow">
              <b className="admin-name">
                {TRASH_KIND[t.kind] && <span className="muted">{TRASH_KIND[t.kind]}: </span>}
                {t.label}
              </b>
              <span className="muted small">
                Borrado {when(t.deleted_at)} · quedan {daysLeft(t.purge_after)} días{t.reason ? ` · ${t.reason}` : ''}
              </span>
            </div>
            <div className="row gap">
              <button className="btn small primary" onClick={() => void runAdmin('Listo, lo recuperamos', () => admin.restore(t.id), reload)}>
                <ArrowCounterClockwiseIcon /> Recuperar
              </button>
              <button
                className="btn small ghost-danger"
                aria-label="Borrar para siempre"
                title="Borrar para siempre"
                onClick={async () => {
                  const ok = await confirmAction({
                    title: '¿Borrar para siempre?',
                    detail: t.kind === 'user' ? 'La cuenta se borra del todo. No se puede deshacer.' : 'Ya no se va a poder recuperar.',
                    confirmLabel: 'Borrar para siempre',
                    danger: true,
                  })
                  if (ok) await runAdmin('Borrado para siempre', () => admin.purge(t.id), reload)
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      {done.length > 0 && (
        <details>
          <summary className="muted">Recuperados y borrados para siempre ({done.length})</summary>
          <ul className="admin-log">
            {done.map((t) => (
              <li key={t.id}>
                <span className="muted small">{when(t.restored_at ?? t.purged_at)}</span> {t.restored_at ? 'Recuperado' : 'Borrado para siempre'}: {t.label}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Registro

export function AdminLog() {
  const { data, error, loading, reload } = useAdminData(() => admin.log(300), [])
  return (
    <>
      <AdminHead title="Registro" onReload={reload} loading={loading} />
      <p className="muted">Todo lo que se hizo desde el panel.</p>
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && !data.length && <p className="empty">Todavía no se hizo nada desde el panel.</p>}
      <ul className="admin-log">
        {data?.map((l) => (
          <li key={l.id}>
            <span className="muted small">{when(l.at)}</span> {actionLabel(l.action)}
            {l.label && <b className="admin-name"> {l.label}</b>}
            {typeof l.details?.reason === 'string' && <span className="muted"> · {l.details.reason}</span>}
          </li>
        ))}
      </ul>
    </>
  )
}

// ---------------------------------------------------------------------------
// Control: IA, anuncio y mensajes

function AiCard() {
  const settings = useAdminData(admin.settings, [])
  const usage = useAdminData(admin.aiUsage, [])
  const saved = settings.data?.ai ?? { enabled: true }
  const [draft, setDraft] = useState<AiSetting | null>(null)
  const ai = draft ?? saved
  return (
    <section className="card">
      <h3>IA para crear juegos</h3>
      <AdminError error={settings.error || usage.error} />
      <label className="field row-between">
        <span>Encendida para todos</span>
        <input type="checkbox" checked={ai.enabled} onChange={(e) => setDraft({ ...ai, enabled: e.target.checked })} />
      </label>
      <label className="field">
        <span>Tope de gasto por mes (US$, vacío = el de la función, 10)</span>
        <input
          className="input"
          type="number"
          min={0}
          step={1}
          value={ai.monthly_limit_usd ?? ''}
          onChange={(e) => setDraft({ ...ai, monthly_limit_usd: e.target.value === '' ? null : Number(e.target.value) })}
        />
      </label>
      <label className="field">
        <span>Juegos por persona cada 24 horas (vacío = 10)</span>
        <input
          className="input"
          type="number"
          min={0}
          step={1}
          value={ai.daily_per_user ?? ''}
          onChange={(e) => setDraft({ ...ai, daily_per_user: e.target.value === '' ? null : Number(e.target.value) })}
        />
      </label>
      <button
        className="btn primary"
        disabled={!draft}
        onClick={() => void runAdmin('IA actualizada', () => admin.saveSetting('ai', ai), () => (setDraft(null), settings.reload()))}
      >
        Guardar
      </button>

      {usage.data && (
        <>
          <h4>Este mes, por persona</h4>
          {!usage.data.by_user.length && <p className="muted small">Nadie usó la IA este mes.</p>}
          <ul className="admin-log">
            {usage.data.by_user.map((b) => (
              <li key={b.user_id ?? 'x'}>
                {b.user_id ? <Link to={`/admin/personas/${b.user_id}`}>{b.label}</Link> : b.label}: {b.calls} pedidos · US$ {Number(b.usd).toFixed(2)}
                {b.ai_blocked && <span className="pill tiny">sin IA</span>}
              </li>
            ))}
          </ul>
          <h4>Por mes</h4>
          <ul className="admin-log">
            {usage.data.months.map((m) => (
              <li key={m.month}>
                {new Date(m.month).toLocaleDateString('es', { month: 'long', year: 'numeric', timeZone: 'UTC' })}: {m.calls} pedidos · US$ {Number(m.usd).toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function AnnouncementCard() {
  const settings = useAdminData(admin.settings, [])
  const saved: Announcement = settings.data?.announcement ?? { text: null }
  const [draft, setDraft] = useState<Announcement | null>(null)
  const a = draft ?? saved
  const save = (value: Announcement, label: string) => runAdmin(label, () => admin.saveSetting('announcement', value), () => (setDraft(null), settings.reload()))
  return (
    <section className="card">
      <h3>Anuncio arriba de la app</h3>
      <p className="muted small">Lo ve todo el mundo (con o sin cuenta) arriba de la pantalla, hasta que lo cierra o se vence.</p>
      <AdminError error={settings.error} />
      <label className="field">
        <span>Texto</span>
        <textarea className="input" rows={2} maxLength={280} value={a.text ?? ''} onChange={(e) => setDraft({ ...a, text: e.target.value })} />
      </label>
      <div className="segmented">
        <button className={a.level !== 'warn' ? 'active' : ''} onClick={() => setDraft({ ...a, level: 'info' })}>
          Novedad
        </button>
        <button className={a.level === 'warn' ? 'active' : ''} onClick={() => setDraft({ ...a, level: 'warn' })}>
          Aviso importante
        </button>
      </div>
      <label className="field">
        <span>Se vence (opcional)</span>
        <input
          className="input"
          type="datetime-local"
          value={a.until ? toLocalInput(a.until) : ''}
          onChange={(e) => setDraft({ ...a, until: e.target.value ? new Date(e.target.value).toISOString() : null })}
        />
      </label>
      <div className="row gap wrap">
        <button className="btn primary" disabled={!draft || !a.text?.trim()} onClick={() => void save({ ...a, text: a.text?.trim() ?? null }, 'Anuncio publicado')}>
          Publicar
        </button>
        {saved.text && (
          <button className="btn" onClick={() => void save({ text: null }, 'Anuncio sacado')}>
            Sacar el anuncio
          </button>
        )}
      </div>
    </section>
  )
}

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function MessageCard() {
  const [form, setForm] = useState({ title: '', text: '' })
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault()
        const ok = await confirmAction({
          title: '¿Mandar el mensaje a todas las cuentas?',
          detail: 'Le llega a cada una en sus notificaciones. No se puede deshacer.',
          confirmLabel: 'Mandar a todos',
        })
        if (!ok) return
        setBusy(true)
        try {
          const n = await admin.sendMessage('all', null, form.title, form.text)
          toast(`Mensaje enviado a ${n} cuentas`)
          setForm({ title: '', text: '' })
        } catch (err) {
          toast(friendlyError(err))
        } finally {
          setBusy(false)
        }
      }}
    >
      <h3>Mensaje a todos</h3>
      <p className="muted small">Llega a las notificaciones de cada cuenta. Para un club o una persona, mandalo desde su página.</p>
      <label className="field">
        <span>Título</span>
        <input className="input" maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>
      <label className="field">
        <span>Mensaje (opcional)</span>
        <textarea className="input" rows={3} maxLength={1000} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
      </label>
      <button className="btn" disabled={busy || !form.title.trim()}>
        <PaperPlaneTiltIcon /> Mandar
      </button>
    </form>
  )
}

export function AdminControl() {
  return (
    <>
      <AdminHead title="Control" />
      <AiCard />
      <AnnouncementCard />
      <MessageCard />
      <section className="card">
        <h3>Registro de cuentas nuevas</h3>
        <p className="muted">Si hace falta frenar las altas, se apagan desde Supabase (Authentication → Sign In / Providers).</p>
      </section>
    </>
  )
}

// ---------------------------------------------------------------------------
// Salud de los datos

function HealthList<T>({ title, hint, items, render }: { title: string; hint: string; items: T[]; render: (item: T) => ReactNode }) {
  return (
    <section>
      <h2>
        {title} <span className="muted">({items.length})</span>
      </h2>
      <p className="muted small">{hint}</p>
      {items.length > 0 && <ul className="admin-log">{items.slice(0, 50).map((it, i) => <li key={i}>{render(it)}</li>)}</ul>}
    </section>
  )
}

export function AdminHealth() {
  const { data, error, loading, reload } = useAdminData(admin.health, [])
  return (
    <>
      <AdminHead title="Salud de los datos" onReload={reload} loading={loading} />
      <AdminError error={error} />
      {!data && loading && <Loader />}
      {data && (
        <>
          <HealthList
            title="Clubes vacíos"
            hint="Creados hace más de una semana y sin ningún dato."
            items={data.empty_clubs}
            render={(c) => (
              <Link to={`/admin/clubes/${c.code}`}>
                {c.name} <span className="muted small">· {when(c.created_at)}</span>
              </Link>
            )}
          />
          <HealthList
            title="Clubes abandonados"
            hint="Sin cambios en más de 60 días."
            items={data.abandoned_clubs}
            render={(c) => (
              <Link to={`/admin/clubes/${c.code}`}>
                {c.name} <span className="muted small">· última vez {when(c.last)}</span>
              </Link>
            )}
          />
          <HealthList
            title="Clubes desactivados"
            hint="Desactivados desde el panel: no sincronizan. Se reactivan desde la página del club."
            items={data.disabled_clubs}
            render={(c) => (
              <Link to={`/admin/clubes/${c.code}`}>
                {c.name} <span className="muted small">· {when(c.disabled_at)}</span>
              </Link>
            )}
          />
          <HealthList
            title="Clubes sin dueño"
            hint="El primero que lo guarde en su cuenta queda como dueño. Podés asignar uno desde el club."
            items={data.ownerless_clubs}
            render={(c) => (
              <Link to={`/admin/clubes/${c.code}`}>
                {c.name} <span className="muted small">· {c.members} con cuenta</span>
              </Link>
            )}
          />
          <HealthList
            title="Cuentas sin perfil"
            hint="Entraron pero no eligieron nombre de usuario."
            items={data.no_profile}
            render={(u) => (
              <Link to={`/admin/personas/${u.user_id}`}>
                {u.email ?? u.user_id} <span className="muted small">· {when(u.created_at)}</span>
              </Link>
            )}
          />
          <HealthList
            title="Partidas rotas"
            hint="Sin juego o sin jugadores: no se pueden mostrar bien."
            items={data.broken_plays}
            render={(p) => (
              <Link to={`/admin/clubes/${p.code}`}>
                {p.club} <span className="muted small">· {p.gameId ?? 'sin juego'} · {p.id}</span>
              </Link>
            )}
          />
          <HealthList
            title="Partidas colgadas"
            hint="Siguen en juego después de una semana sin cambios."
            items={data.stale_live}
            render={(p) => (
              <Link to={`/admin/clubes/${p.code}`}>
                {p.club} <span className="muted small">· {p.gameId} · {when(p.updated_at)}</span>
              </Link>
            )}
          />
          <HealthList
            title="Datos muy pesados"
            hint="Más de 100 KB en una sola partida o ficha (el máximo es 200 KB)."
            items={data.big_entities}
            render={(e) => (
              <Link to={`/admin/clubes/${e.code}`}>
                {e.kind} {e.id} <span className="muted small">· {Math.round(e.bytes / 1024)} KB</span>
              </Link>
            )}
          />
          <section>
            <h2>Solicitudes sin respuesta</h2>
            <p className="muted small">{data.pending_requests_old} pedidos para entrar a un club llevan más de dos semanas sin que nadie los responda.</p>
          </section>
        </>
      )}
    </>
  )
}
