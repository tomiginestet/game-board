import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { PlayRow } from '../components/GameBits'
import { MatchRow } from '../components/MatchRow'
import { gameOrMissing, useGames, usePlayerMap } from '../lib/hooks'
import { useData } from '../lib/store'

/** Todas las partidas terminadas, de todos los juegos. */
export function History() {
  const data = useData()
  const players = usePlayerMap()
  const games = useGames()
  const [gameId, setGameId] = useState<string>('all')
  const [limit, setLimit] = useState(50)

  const rows = useMemo(
    () =>
      [
        ...data.plays.filter((p) => p.status === 'finished').map((p) => ({ k: 'play' as const, at: p.finishedAt ?? p.createdAt, gameId: p.gameId, p })),
        ...data.matches.filter((m) => m.status === 'finished').map((m) => ({ k: 'match' as const, at: m.finishedAt ?? m.createdAt, gameId: 'pingpong', m })),
      ]
        .filter((r) => gameId === 'all' || r.gameId === gameId)
        .sort((a, b) => b.at - a.at),
    [data, gameId],
  )
  const used = games.filter((g) => g.id === 'pingpong' ? data.matches.length : data.plays.some((p) => p.gameId === g.id))

  return (
    <div className="page">
      <h1>Historial</h1>
      <div className="chips scroll">
        <button className={'chip' + (gameId === 'all' ? ' active' : '')} aria-pressed={gameId === 'all'} onClick={() => setGameId('all')}>
          Todos
        </button>
        {used.map((g) => (
          <button key={g.id} className={'chip' + (gameId === g.id ? ' active' : '')} aria-pressed={gameId === g.id} onClick={() => setGameId(g.id)}>
            {g.emoji} {g.name}
          </button>
        ))}
      </div>
      {!rows.length && (
        <div className="empty mt">
          <p>Todavía no hay partidas terminadas. Lo que anoten va a quedar acá, para cuando haya que discutir quién ganó.</p>
          <Link to="/juegos" className="btn primary">
            Anotar una partida
          </Link>
        </div>
      )}
      <div className="list mt">
        {rows.slice(0, limit).map((r) =>
          r.k === 'play' ? <PlayRow key={r.p.id} play={r.p} game={gameOrMissing(data, r.p.gameId)} players={players} /> : <MatchRow key={r.m.id} match={r.m} players={players} />,
        )}
      </div>
      {rows.length > limit && (
        <button className="btn block mt" onClick={() => setLimit(limit + 50)}>
          Ver más
        </button>
      )}
    </div>
  )
}
