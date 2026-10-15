import { ArrowLeftIcon, CaretRightIcon, PencilSimpleIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { JoinRequests } from '../../components/ClubHero'
import { plural } from '../../lib/hooks'
import { ClubAccounts, InviteSection } from './ClubMembers'
import { ErrorText } from '../../components/Feedback'
import { FEATURED } from '../../lib/games'
import { useClubGames } from '../../lib/clubGames'
import { canPickClubGames, setClubGames, useActiveGroup, type MyGroup } from '../../lib/social'
import { useSyncState } from '../../lib/sync'
import { friendlyError } from '../../lib/text'
import { GroupForm, GamePicker } from './GroupForms'

/**
 * Gestionar club: lo administrativo, fuera de la pantalla del club. Quién pide entrar, los datos y los juegos
 * del club (admins), invitar (cualquiera) y las cuentas con sus permisos.
 */
export function ClubManage() {
  const group = useActiveGroup()
  const club = useClubGames()
  const location = useLocation()
  const ready = !!group
  useEffect(() => {
    if (ready && location.hash === '#invitar') document.getElementById('invitar')?.scrollIntoView({ block: 'start' })
  }, [ready, location.hash])
  if (!group) return <NoClub />
  const isAdmin = group.role === 'owner' || group.role === 'admin'
  const duo = group.kind === 'duo'
  const chosen = club.chosen.length

  return (
    <div className="page">
      <Link to="/" className="back">
        <ArrowLeftIcon /> {group.name}
      </Link>
      <h1>Gestionar {duo ? 'mano a mano' : 'club'}</h1>

      <JoinRequests group={group} />

      {(isAdmin || canPickClubGames(group)) && (
        <nav className="list rows" aria-label="Ajustes del club">
          {isAdmin && !duo && (
            <Link to="/club/editar" className="settings-row">
              <PencilSimpleIcon size={22} aria-hidden />
              <span className="grow">
                <b className="block">Datos del club</b>
                <span className="muted small block">Nombre, emoji, descripción y quién puede encontrarlo</span>
              </span>
              <CaretRightIcon aria-hidden />
            </Link>
          )}
          {canPickClubGames(group) && (
            <Link to="/club/juegos" className="settings-row">
              <SquaresFourIcon size={22} aria-hidden />
              <span className="grow">
                <b className="block">Juegos del club</b>
                <span className="muted small block">{chosen ? `${plural(chosen, 'elegido', 'elegidos')}: ${club.chosen.slice(0, 3).map((g) => g.name).join(', ')}${chosen > 3 ? '…' : ''}` : 'Sin elegir: se muestran los más jugados'}</span>
              </span>
              <CaretRightIcon aria-hidden />
            </Link>
          )}
        </nav>
      )}

      {!duo && <InviteSection group={group} />}

      <div className="section-divided">
        <ClubAccounts group={group} />
      </div>
    </div>
  )
}

/** Editar nombre, emoji, descripción y si es público (admins). */
export function ClubEdit() {
  const group = useActiveGroup()
  const navigate = useNavigate()
  if (!group) return <NoClub />
  if (group.role !== 'owner' && group.role !== 'admin') return <NotAdmin />
  return (
    <div className="page">
      <Link to="/club/gestion" className="back">
        <ArrowLeftIcon /> Gestionar club
      </Link>
      <h1>Datos del club</h1>
      <GroupForm initial={group} onDone={() => navigate('/club/gestion')} />
    </div>
  )
}

/** Elegir los juegos del club: los que salen destacados en el club, primero en "Para jugar hoy" y al anotar. */
export function ClubGamesEdit() {
  const group = useActiveGroup()
  if (!group) return <NoClub />
  if (!canPickClubGames(group)) return <NotAdmin />
  return <ClubGamesForm key={group.code} group={group} />
}

function ClubGamesForm({ group }: { group: MyGroup }) {
  const club = useClubGames()
  const navigate = useNavigate()
  const [games, setGames] = useState<string[]>(() => club.chosen.map((g) => g.id))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Sugerencias: lo que más juegan y, después, los de siempre.
  const suggestions = [...club.mostPlayed.map((g) => g.id), ...FEATURED]
  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await setClubGames(group.code, games.length ? games : null)
      navigate('/')
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <Link to="/club/gestion" className="back">
        <ArrowLeftIcon /> Gestionar club
      </Link>
      <h1>Juegos del club</h1>
      <p className="muted">Los que tienen o juegan siempre. Salen destacados en el club, primero en “Para jugar hoy” y primero al anotar. El orden es el que elijas.</p>
      <form
        className="card group-form"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <GamePicker label="Elegidos" games={games} onGames={setGames} suggestions={suggestions} />
        {!games.length && <p className="muted small">Sin elegir, el club muestra los que más juegan.</p>}
        <ErrorText>{error}</ErrorText>
        <button className="btn primary block" disabled={busy}>
          {busy ? 'Guardando…' : 'Guardar juegos'}
        </button>
      </form>
    </div>
  )
}

function NoClub() {
  const sync = useSyncState()
  return (
    <div className="page">
      <h1>Club</h1>
      {sync.club ? <p className="muted">Cargando el club…</p> : <div className="empty">No tenés un club activo. Elegí uno de tus clubes o creá uno.</div>}
      <Link to="/grupos" className="btn primary">
        Ver mis clubes
      </Link>
    </div>
  )
}

function NotAdmin() {
  return (
    <div className="page">
      <h1>Club</h1>
      <div className="empty">Esto lo cambia quien administra el club.</div>
      <Link to="/" className="btn">
        Volver al club
      </Link>
    </div>
  )
}
