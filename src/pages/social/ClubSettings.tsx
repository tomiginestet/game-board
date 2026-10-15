import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorText } from '../../components/Feedback'
import { FEATURED } from '../../lib/games'
import { useClubGames } from '../../lib/clubGames'
import { canPickClubGames, setClubGames, useActiveGroup, type MyGroup } from '../../lib/social'
import { useSyncState } from '../../lib/sync'
import { friendlyError } from '../../lib/text'
import { GroupForm, GamePicker } from './GroupForms'

/** Editar nombre, emoji, descripción y si es público (admins). */
export function ClubEdit() {
  const group = useActiveGroup()
  const navigate = useNavigate()
  if (!group) return <NoClub />
  if (group.role !== 'owner' && group.role !== 'admin') return <NotAdmin />
  return (
    <div className="page">
      <Link to="/" className="back">
        <ArrowLeftIcon /> {group.name}
      </Link>
      <h1>Editar club</h1>
      <GroupForm initial={group} onDone={() => navigate('/')} />
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
      <Link to="/" className="back">
        <ArrowLeftIcon /> {group.name}
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
