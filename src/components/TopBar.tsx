import { BellIcon, GearSixIcon, CaretDownIcon, CheckIcon, MagnifyingGlassIcon, PlusIcon, SwordIcon, UserCircleIcon, UsersThreeIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { switchToGroup, useMyGroups, useNotifications, useProfile, userAsPlayer, type MyGroup } from '../lib/social'
import { syncAvailable, useSyncState } from '../lib/sync'
import { Logo } from './Logo'
import { SyncBadge } from './SyncBadge'
import { Avatar } from './Avatar'

/** Barra de arriba con sesión: grupo activo (para cambiar), notificaciones y perfil. */
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
        <span className="top-brand grow title-with-icon">
          <Logo className="title-logo" size={26} /> Game Board
        </span>
        <SyncBadge />
        <Link to="/ajustes" className="tool-btn" aria-label="Ajustes">
          <GearSixIcon size={22} />
        </Link>
      </header>
    )
  }

  return (
    <>
      <header className="top-bar">
        <button className="group-switch" onClick={() => setOpen(true)} aria-haspopup="dialog">
          <span className="group-emoji small" aria-hidden>
            {sync.club ? (sync.club.emoji ?? active?.emoji ?? (sync.club.kind === 'duo' ? '⚔️' : '🎲')) : '📱'}
          </span>
          <span className="grow ellipsis">
            <span className="group-switch-label">{sync.club?.kind === 'duo' || active?.kind === 'duo' ? 'Mano a mano' : 'Grupo'}</span>
            <b className="block ellipsis">{sync.club?.name ?? 'Sin grupo'}</b>
          </span>
          <span className={'sync-dot ' + sync.status} title={sync.status} />
          <CaretDownIcon />
        </button>
        <Link to="/notificaciones" className="tool-btn bell" aria-label={unread ? `Notificaciones (${unread} sin leer)` : 'Notificaciones'}>
          <BellIcon size={22} weight={unread ? 'fill' : 'regular'} />
          {unread > 0 && <span className="badge-count">{unread > 9 ? '9+' : unread}</span>}
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

function GroupSheet({ groups, activeCode, onClose }: { groups: MyGroup[]; activeCode?: string; onClose: () => void }) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const regular = groups.filter((g) => g.kind === 'group')
  const duos = groups.filter((g) => g.kind === 'duo')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const pick = async (g: MyGroup) => {
    if (g.code === activeCode) return onClose()
    setBusy(g.code)
    setError('')
    try {
      await switchToGroup(g)
      onClose()
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
    }
  }

  const go = (to: string) => {
    onClose()
    navigate(to)
  }

  const row = (g: MyGroup) => (
    <button key={g.code} className={'sheet-row' + (g.code === activeCode ? ' active' : '')} disabled={!!busy} onClick={() => pick(g)}>
      <span className="group-emoji small" aria-hidden>
        {g.emoji ?? (g.kind === 'duo' ? '⚔️' : '🎲')}
      </span>
      <span className="grow ellipsis">
        <b className="block ellipsis">{g.name}</b>
        <span className="muted small">
          {g.kind === 'duo' ? 'Mano a mano' : `${g.members} ${g.members === 1 ? 'integrante' : 'integrantes'}`}
          {g.pending_requests > 0 && <span className="win-text"> · {g.pending_requests} solicitudes</span>}
        </span>
      </span>
      {busy === g.code ? <span className="muted small">…</span> : g.code === activeCode && <CheckIcon className="win-text" />}
    </button>
  )

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="Elegir grupo" onClick={(e) => e.stopPropagation()}>
        <div className="row-between">
          <h2>¿Con quién jugás?</h2>
          <button className="tool-btn" onClick={onClose} aria-label="Cerrar">
            <XIcon />
          </button>
        </div>
        {regular.length > 0 && <h3 className="sheet-title">Tus grupos</h3>}
        {regular.map(row)}
        {duos.length > 0 && (
          <h3 className="sheet-title">
            <SwordIcon className="inline-icon" /> Mano a mano
          </h3>
        )}
        {duos.map(row)}
        {!groups.length && <p className="muted">Todavía no estás en ningún grupo.</p>}
        {error && <p className="error">{error}</p>}
        <div className="sheet-actions">
          <button className="btn" onClick={() => go('/grupos/nuevo')}>
            <PlusIcon /> Crear grupo
          </button>
          <button className="btn" onClick={() => go('/grupos/buscar')}>
            <MagnifyingGlassIcon /> Buscar
          </button>
          <button className="btn" onClick={() => go('/amigos')}>
            <UsersThreeIcon /> Amigos
          </button>
        </div>
      </div>
    </div>
  )
}
