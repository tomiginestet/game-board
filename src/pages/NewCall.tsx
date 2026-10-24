import { ArrowLeftIcon, MegaphoneIcon } from '@phosphor-icons/react'
import { useId, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { PlayerPicker } from '../components/PlayerPicker'
import { plural, useGame } from '../lib/hooks'
import { lastPlayOf } from '../lib/rematch'
import { fromLocalInput, nextWeekday, toLocalInput } from '../lib/schedule'
import { actions, useData } from '../lib/store'
import type { Id } from '../lib/types'
import { notifyCall } from '../lib/callNotify'
import { useMyPlayerId } from '../lib/me'
import { say } from '../skins/say'

/** Convocar a un partido: día, cancha y a quiénes se les pregunta si vienen. */
export function NewCall() {
  const { gameId } = useParams()
  const game = useGame(gameId)
  const data = useData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = useId()
  const team = data.teams.find((t) => t.id === params.get('equipo'))
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name, 'es')), [data.players])
  // De entrada: el plantel del equipo o los de la última partida de este juego.
  const [invited, setInvited] = useState<Id[]>(() => {
    const exists = (pid: Id) => data.players.some((p) => p.id === pid)
    if (team) return team.players.filter(exists)
    const last = gameId ? lastPlayOf(data.plays, gameId) : undefined
    return [...new Set(last?.sides.flatMap((s) => s.players) ?? [])].filter(exists)
  })
  // El mismo día y hora que la última convocatoria de este juego, una semana después; si no, el mismo día de hoy a las 20.
  const [when, setWhen] = useState(() => {
    const prev = data.plays.filter((p) => p.gameId === gameId && p.invited && p.scheduledAt).sort((a, b) => b.scheduledAt! - a.scheduledAt!)[0]
    const base = prev?.scheduledAt ? new Date(prev.scheduledAt) : undefined
    return toLocalInput(base ? nextWeekday(base.getDay(), base.getHours()) + base.getMinutes() * 60_000 : nextWeekday(new Date().getDay(), 20))
  })
  // Cupo: el de la última convocatoria de este juego (fútbol 5: 10).
  const [capacity, setCapacity] = useState(() => data.plays.filter((p) => p.gameId === gameId && p.invited).sort((a, b) => b.createdAt - a.createdAt)[0]?.capacity ?? 0)
  const me = useMyPlayerId()
  const [venue, setVenue] = useState(() => team?.home ?? data.plays.filter((p) => p.gameId === gameId && p.venue).at(-1)?.venue ?? '')

  if (!game) return <div className="page">{say('Juego no encontrado.')}</div>
  const at = fromLocalInput(when)
  const ready = invited.length >= 2 && !!at

  const create = () => {
    if (!ready) return
    const p = actions.createCall({ gameId: game.id, invited, scheduledAt: at, venue, capacity, ...(me ? { organizer: me } : {}), ...(team ? { teamId: team.id } : {}) })
    // A los citados con cuenta les llega el aviso en la app.
    void notifyCall('call', p, team ? `${team.name}: ${game.name}` : game.name, invited.filter((pid) => pid !== me))
    navigate(`/partida/${p.id}`, { replace: true })
  }

  return (
    <div className="page">
      <Link to={team ? `/equipos/${team.id}` : `/juegos/${game.id}`} className="back">
        <ArrowLeftIcon /> {team ? team.name : game.name}
      </Link>
      <header className="game-head">
        <GameBadge game={game} size={52} />
        <div>
          <h1>Convocar</h1>
          <p className="muted">
            {game.name}
            {team ? ` · ${team.name}` : ''}
          </p>
        </div>
      </header>
      <p className="hint">Mandás la convocatoria al grupo, cada uno marca si va y con los que van se arman los equipos.</p>

      <div className="field">
        <label htmlFor={`${id}-when`}>Día y hora</label>
        <input id={`${id}-when`} className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-venue`}>Cancha (opcional)</label>
        <input id={`${id}-venue`} className="input" value={venue} maxLength={60} placeholder="Cancha 3 del club" onChange={(e) => setVenue(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor={`${id}-cap`}>Cupo (opcional)</label>
        <select id={`${id}-cap`} className="input" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}>
          {[0, 6, 8, 10, 12, 14, 16, 18, 22].map((n) => (
            <option key={n} value={n}>
              {n ? `${n} jugadores (el resto, en lista de espera)` : 'Sin cupo'}
            </option>
          ))}
        </select>
      </div>

      <section>
        <h2>
          Citados <span className="muted small">{plural(invited.length, 'jugador', 'jugadores')}</span>
        </h2>
        <PlayerPicker players={players} selected={invited} label="Citados" onToggle={(pid) => setInvited((s) => (s.includes(pid) ? s.filter((x) => x !== pid) : [...s, pid]))} />
      </section>

      <div className="sticky-actions">
        <button className="btn primary big block" disabled={!ready} onClick={create}>
          <MegaphoneIcon aria-hidden="true" /> {!at ? 'Elegí el día' : invited.length < 2 ? 'Citá al menos a 2' : 'Convocar'}
        </button>
      </div>
    </div>
  )
}
