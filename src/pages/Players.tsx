import { CaretRightIcon, PlusIcon, ShieldIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PlayerForm } from '../components/PlayerForm'
import { plural, useBoard } from '../lib/hooks'
import { actions, useData } from '../lib/store'
import { say } from '../skins/say'

export function Players() {
  const data = useData()
  const board = useBoard()
  const [adding, setAdding] = useState(data.players.length === 0)
  // De más a menos gloria, como el ranking: los que más juegan (los que más se buscan) quedan arriba.
  const gloriaOf = (id: string) => board.players.get(id)?.gloria ?? 0
  const players = [...data.players].sort((a, b) => gloriaOf(b.id) - gloriaOf(a.id) || a.name.localeCompare(b.name))

  return (
    <div className="page">
      <div className="section-head">
        <h1>Jugadores</h1>
        {!adding && (
          <button className="btn primary" onClick={() => setAdding(true)}>
            <PlusIcon /> Nuevo jugador
          </button>
        )}
      </div>

      {adding && (
        <PlayerForm submitLabel="Agregar jugador" onSubmit={(v) => actions.addPlayer(v.name, v.emoji, v.color)} onCancel={data.players.length ? () => setAdding(false) : undefined} />
      )}

      <Link to="/equipos" className="player-row teams-link">
        <ShieldIcon size={24} aria-hidden="true" />
        <div className="grow">
          <strong>Equipos</strong>
          <div className="muted small">{data.teams.length ? `${data.teams.length} ${data.teams.length === 1 ? 'equipo' : 'equipos'} del club` : 'Armá el de fútbol 5, la pareja de pádel…'}</div>
        </div>
        <CaretRightIcon aria-hidden="true" />
      </Link>

      <div className="list rows">
        {players.map((p) => {
          const s = board.players.get(p.id)
          return (
            <Link key={p.id} to={`/jugadores/${p.id}`} className="player-row">
              <Avatar player={p} size={40} />
              <div className="grow">
                <strong>{p.name}</strong>
                <div className="muted small ellipsis">
                  {s?.played ? `${plural(s.played, say('partida'), say('partidas'))} · juega ${plural(s.gamesPlayed, say('juego'), say('juegos'))}` : 'Todavía no jugó'}
                </div>
              </div>
              <span className="player-gloria num">
                {s?.gloria ?? 0}
                <span className="sr-only"> de gloria</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
