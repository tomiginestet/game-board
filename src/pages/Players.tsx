import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PlayerForm } from '../components/PlayerForm'
import { useBoard } from '../lib/hooks'
import { actions, useData } from '../lib/store'

export function Players() {
  const data = useData()
  const board = useBoard()
  const [adding, setAdding] = useState(data.players.length === 0)
  const players = [...data.players].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="page">
      <div className="section-head">
        <h1>Jugadores</h1>
        {!adding && (
          <button className="btn primary" onClick={() => setAdding(true)}>
            <PlusIcon /> Nuevo
          </button>
        )}
      </div>

      {adding && (
        <PlayerForm submitLabel="Agregar jugador" onSubmit={(v) => actions.addPlayer(v.name, v.emoji, v.color)} onCancel={data.players.length ? () => setAdding(false) : undefined} />
      )}

      <div className="list">
        {players.map((p) => {
          const s = board.players.get(p.id)
          return (
            <Link key={p.id} to={`/jugadores/${p.id}`} className="card player-row">
              <Avatar player={p} size={44} />
              <div className="grow">
                <strong>{p.name}</strong>
                <div className="muted small">
                  {s?.played ?? 0} partidas · {s?.wins ?? 0} victorias · {s?.gamesPlayed ?? 0} juegos
                </div>
              </div>
              <span className="elo">✨ {s?.gloria ?? 0}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
