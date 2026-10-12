import { BellIcon, GearSixIcon, CaretDownIcon, CheckIcon, MagnifyingGlassIcon, PlusIcon, SwordIcon, UserCircleIcon, UsersThreeIcon, XIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { plural } from '../lib/hooks'
import { switchToGroup, useMyGroups, useNotifications, useProfile, userAsPlayer, type MyGroup } from '../lib/social'
import { SYNC_LABEL, syncAvailable, useSyncState } from '../lib/sync'
import { friendlyError } from '../lib/text'
import { useModal } from '../lib/feedback'
import { ErrorText } from './Feedback'
import { Logo } from './Logo'
import { SyncBadge } from './SyncBadge'
import { SyncIcon } from './SyncIcon'
import { Avatar } from './Avatar'

/** Barra de arriba con sesión: club activo (para cambiar), notificaciones y perfil. */
export function TopBar() {
  const auth = useAuth()
  const sync = useSyncState()
  const { profile } = useProfile()
  const { unread } = useNotifications()
  const { groups } = useMyGroups()
  const [open, setOpen] = useState(false)
  const active = groups?.find((g) => g.code === sync.club?.code)
  const needsPlayer = active && !active.player_id

  if (!syncAvailable) return null
  if (!auth.session) {
    return (
      <header className="top-bar">
        <p className="top-brand grow title-with-icon">
          <Logo className="title-logo" size={26} /> Game Board
        </p>
        <SyncBadge />
        <Link to="/ajustes" className="tool-btn" aria-label="Ajustes y copia de seguridad">
          <GearSixIcon size={22} />
        </Link>
      </header>
    )
  }

  const duo = sync.club?.kind === 'duo' || active?.kind === 'duo'
  return (
    <>
      <header className="top-bar">
        <button
          className="group-switch"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${sync.club ? (duo ? 'Mano a mano' : 'Club') + ': ' + sync.club.name : 'Sin club'}. ${SYNC_LABEL[sync.status]}. Cambiar de club`}
        >
          <span className="group-emoji small" aria-hidden>
            {sync.club ? (sync.club.emoji ?? active?.emoji ?? (sync.club.kind === 'duo' ? '⚔️' : '🎲')) : '📱'}
          </span>
          <span className="grow ellipsis">
            <span className="group-switch-label">
              {duo ? 'Mano a mano' : 'Club'}
              {sync.club && (
                <>
                  {' · '}
                  <SyncIcon status={sync.status} /> {SYNC_LABEL[sync.status]}
                </>
              )}
            </span>
            <b className="block ellipsis">{sync.club?.name ?? 'Sin club'}</b>
          </span>
          <CaretDownIcon aria-hidden />
        </button>
        <Link to="/notificaciones" className="tool-btn bell" aria-label={unread ? `Notificaciones: ${plural(unread, 'sin leer', 'sin leer')}` : 'Notificaciones'}>
          <BellIcon size={22} weight={unread ? 'fill' : 'regular'} />
          {unread > 0 && (
            <span className="badge-count" aria-hidden>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <Link to="/perfil" className="tool-btn avatar-btn" aria-label="Tu perfil">
          {profile ? <Avatar player={userAsPlayer(profile)} size={34} /> : <UserCircleIcon size={26} />}
        </Link>
      </header>
      {needsPlayer && (
        <Link to="/grupo#yo" className="who-banner">
          👋 ¿Quién sos en “{active.name}”? Tocá para elegir tu jugador.
        </Link>
      )}
      {open && <GroupSheet groups={groups ?? []} activeCode={sync.club?.code} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Hoja para cambiar de club. Es un <dialog> modal: atrapa el foco, cierra con Escape y lo devuelve al botón. */
function GroupSheet({ groups, activeCode, onClose }: { groups: MyGroup[]; activeCode?: string; onClose: () => void }) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDialogElement>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const regular = groups.filter((g) => g.kind === 'group')
  const duos = groups.filter((g) => g.kind === 'duo')

  useModal(ref)

  const pick = async (g: MyGroup) => {
    if (g.code === activeCode) return onClose()
    setBusy(g.code)
    setError('')
    try {
      await switchToGroup(g)
      onClose()
      navigate('/')
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(null)
    }
  }

  const go = (to: string) => {
    onClose()
    navigate(to)
  }

  const row = (g: MyGroup) => (
    <button key={g.code} className={'sheet-row' + (g.code === activeCode ? ' active' : '')} disabled={!!busy} onClick={() => pick(g)} aria-current={g.code === activeCode ? 'true' : undefined}>
      <span className="group-emoji small" aria-hidden>
        {g.emoji ?? (g.kind === 'duo' ? '⚔️' : '🎲')}
      </span>
      <span className="grow ellipsis">
        <b className="block ellipsis">{g.name}</b>
        <span className="muted small">
          {g.kind === 'duo' ? 'Mano a mano' : plural(g.members, 'integrante', 'integrantes')}
          {g.pending_requests > 0 && <span className="win-text"> · {plural(g.pending_requests, 'solicitud', 'solicitudes')}</span>}
        </span>
      </span>
      {busy === g.code ? <span className="muted small">Cambiando…</span> : g.code === activeCode && <CheckIcon className="win-text" aria-label="Club actual" />}
    </button>
  )

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet-body">
        <div className="row-between">
          <h2 id="sheet-title">¿Con quién jugás?</h2>
          <button className="tool-btn" onClick={onClose} aria-label="Cerrar">
            <XIcon />
          </button>
        </div>
        {regular.length > 0 && <h3 className="sheet-title">Tus clubes</h3>}
        {regular.map(row)}
        {duos.length > 0 && (
          <h3 className="sheet-title">
            <SwordIcon className="inline-icon" aria-hidden /> Mano a mano
          </h3>
        )}
        {duos.map(row)}
        {!groups.length && <p className="muted">Todavía no estás en ningún club. Creá uno o buscá el de tus amigos.</p>}
        <ErrorText>{error}</ErrorText>
        <div className="sheet-actions">
          <button className="btn" onClick={() => go('/grupos/nuevo')}>
            <PlusIcon /> Crear club
          </button>
          <button className="btn" onClick={() => go('/grupos/buscar')}>
            <MagnifyingGlassIcon /> Buscar clubes
          </button>
          <button className="btn" onClick={() => go('/amigos')}>
            <UsersThreeIcon /> Amigos
          </button>
        </div>
      </div>
    </dialog>
  )
}
