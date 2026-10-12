import { ArrowsClockwiseIcon, ArrowsCounterClockwiseIcon, CheckIcon, CloudIcon, CopyIcon, SignInIcon, PlusIcon, ShareNetworkIcon, SignOutIcon, SparkleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDate } from '../lib/hooks'
import { useData } from '../lib/store'
import { linkClub } from '../lib/auth'
import { createClub as createClubRaw, findClub, inviteLink, joinClub as joinClubRaw, leaveClub, syncAvailable, syncNow, useSyncState } from '../lib/sync'
import { AccountCard } from '../components/AccountCard'
import { Loader } from '../components/Logo'

// Si hay sesión, el club queda guardado en la cuenta.
const createClub = (name: string) => createClubRaw(name).then(async (c) => (await linkClub(c.code).catch(() => {}), c))
const joinClub = (code: string, mode: 'replace' | 'merge') => joinClubRaw(code, mode).then(async (c) => (await linkClub(c.code).catch(() => {}), c))

const STATUS_TEXT = {
  off: 'Sin sincronizar',
  syncing: 'Sincronizando…',
  ok: 'Sincronizado',
  offline: 'Sin conexión (se sube al volver)',
  error: 'Error al sincronizar',
} as const

export function ClubPage() {
  const sync = useSyncState()
  const data = useData()
  const navigate = useNavigate()
  const { code: inviteCode } = useParams()
  const [name, setName] = useState('Los del grupo')
  const [code, setCode] = useState(inviteCode ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [invitedName, setInvitedName] = useState<string | null | undefined>(undefined)
  const hasLocalData = data.players.length + data.matches.length + data.tournaments.length + data.plays.length + data.cups.length + data.games.length > 0

  useEffect(() => {
    if (!inviteCode || !syncAvailable) return
    let cancelled = false
    findClub(inviteCode)
      .then((n) => !cancelled && setInvitedName(n))
      .catch(() => !cancelled && setInvitedName(null))
    return () => {
      cancelled = true
    }
  }, [inviteCode])

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  if (!syncAvailable) {
    return (
      <div className="page">
        <h1>Club</h1>
        <div className="empty">La sincronización no está configurada en esta instalación.</div>
      </div>
    )
  }

  if (sync.club) {
    const link = inviteLink(sync.club.code)
    const alreadyInInvited = inviteCode && inviteCode === sync.club.code
    return (
      <div className="page">
        <h1 className="title-with-icon">
          <CloudIcon className="title-icon" weight="duotone" /> {sync.club.name}
        </h1>
        {inviteCode && !alreadyInInvited && (
          <div className="card warn">
            Este dispositivo ya está en otro club. Para unirte al club del link, primero salí de “{sync.club.name}”.
          </div>
        )}
        <section className="card">
          <div className="row-between">
            <span className={'sync-badge ' + sync.status}>
              <span className="sync-dot" />
              {STATUS_TEXT[sync.status]}
            </span>
            <button className="btn small" disabled={sync.status === 'syncing'} onClick={() => run(syncNow)}>
              <ArrowsClockwiseIcon /> Sincronizar
            </button>
          </div>
          <p className="muted small">
            {sync.lastSync ? `Última sincronización: ${formatDate(sync.lastSync)}` : ''}
            {sync.pending ? ` · ${sync.pending} cambios por subir` : ''}
          </p>
          {sync.error && sync.status !== 'ok' && <p className="error">{sync.error}</p>}
          <p>Todos los que estén en este club ven los mismos jugadores, partidas, torneos, juegos y ranking. Es el mismo club que en el Ping Pong Club: los partidos de ping pong se ven en las dos apps.</p>
        </section>

        <AccountCard />

        <section className="card">
          <h3>Invitar amigos</h3>
          <p className="muted">Compartí este link. Quien lo abra puede ver y cargar partidas del club.</p>
          <div className="invite-box">
            <code>{link}</code>
          </div>
          <div className="row gap wrap">
            <button
              className="btn primary"
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title: `Club ${sync.club!.name}`, text: `Sumate a “${sync.club!.name}” en Game Board`, url: link })
                    return
                  } catch {
                    // cancelado: copiamos
                  }
                }
                await navigator.clipboard?.writeText(link)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              <ShareNetworkIcon /> Compartir link
            </button>
            <button
              className="btn"
              onClick={async () => {
                await navigator.clipboard?.writeText(link)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? (
                <>
                  <CheckIcon /> Copiado
                </>
              ) : (
                <>
                  <CopyIcon /> Copiar
                </>
              )}
            </button>
          </div>
          <p className="muted small">
            Código: <b className="mono">{sync.club.code}</b>
          </p>
        </section>

        <button
          className="btn danger"
          onClick={() => {
            if (confirm('¿Dejar de sincronizar este dispositivo? Los datos quedan guardados acá, pero ya no se van a actualizar.')) {
              leaveClub()
              navigate('/club')
            }
          }}
        >
          <SignOutIcon /> Salir del club
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="title-with-icon">
        <CloudIcon className="title-icon" weight="duotone" /> Club
      </h1>
      <p className="muted">
        Armá un club para compartir jugadores, partidas y rankings entre los celulares de todos. Se entra con un link; la cuenta es opcional y sirve para tener tus clubes en cualquier dispositivo.
      </p>

      <AccountCard />

      {inviteCode && (
        <section className="card highlight">
          {invitedName === undefined && <p>Buscando el club…</p>}
          {invitedName === null && <p className="error">El link no corresponde a ningún club. Revisá que esté completo.</p>}
          {invitedName && (
            <>
              <h2>Te invitaron a “{invitedName}”</h2>
              {hasLocalData ? (
                <>
                  <p className="muted">En este dispositivo ya hay datos cargados. ¿Qué hacemos con ellos?</p>
                  <button className="btn primary block" disabled={busy} onClick={() => run(() => joinClub(inviteCode, 'merge').then(() => navigate('/')))}>
                    <PlusIcon /> Unirme y sumar mis datos al club
                  </button>
                  <button
                    className="btn block"
                    disabled={busy}
                    onClick={() =>
                      confirm('Se borran los datos de este dispositivo y se usan los del club. ¿Seguir?') &&
                      run(() => joinClub(inviteCode, 'replace').then(() => navigate('/')))
                    }
                  >
                    <ArrowsCounterClockwiseIcon /> Unirme y usar sólo los datos del club
                  </button>
                </>
              ) : (
                <button className="btn primary big block" disabled={busy} onClick={() => run(() => joinClub(inviteCode, 'replace').then(() => navigate('/')))}>
                  <SignInIcon /> Unirme al club
                </button>
              )}
            </>
          )}
        </section>
      )}

      {!inviteCode && (
        <>
          <section className="card">
            <h2>Crear un club</h2>
            <p className="muted small">{hasLocalData ? 'Los datos que ya cargaste en este dispositivo pasan al club.' : 'Después invitás a tus amigos con un link.'}</p>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Nombre del club" />
            <button className="btn primary block mt" disabled={busy || !name.trim()} onClick={() => run(() => createClub(name))}>
              <SparkleIcon /> Crear club
            </button>
          </section>

          <section className="card">
            <h2>Unirme con un código</h2>
            <p className="muted small">Sirve también el link de un club del Ping Pong Club: es el mismo club.</p>
            <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código o link de invitación" />
            <button
              className="btn block mt"
              disabled={busy || !code.trim()}
              onClick={() => {
                const match = code.match(/unirse\/([a-z0-9-]+)/i)
                navigate(`/unirse/${match ? match[1] : code.trim().toLowerCase()}`)
              }}
            >
              Buscar club
            </button>
          </section>
        </>
      )}

      {busy && <Loader text="Sincronizando…" delay={0} size={72} />}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
