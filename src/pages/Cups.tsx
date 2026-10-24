import { CheckCircleIcon, PlusIcon, TrophyIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { cupChampion, cupEntrantName } from '../lib/cups'
import { CUP_FORMATS } from '../lib/games/schema'
import { gameOrMissing, usePlayerMap } from '../lib/hooks'
import { tournamentChampion } from '../lib/pingpong/stats'
import { useData } from '../lib/store'
import { say } from '../skins/say'

/** Todos los torneos: los de cualquier juego y los de ping pong (del Ping Pong Club). */
export function Cups() {
  const data = useData()
  const players = usePlayerMap()
  const nameOf = (id: string) => players.get(id)?.name ?? '?'

  const rows = [
    ...data.cups.map((c) => {
      const game = gameOrMissing(data, c.gameId)
      const champ = cupChampion(c, data.plays.filter((p) => p.cupId === c.id), game.scoring.lowWins)
      return {
        id: c.id,
        to: `/torneos/${c.id}`,
        name: c.name,
        game,
        at: c.createdAt,
        format: CUP_FORMATS.find((f) => f.id === c.format)?.name ?? '',
        champion: champ !== undefined ? cupEntrantName(c, champ, nameOf) : undefined,
        count: c.entrants.length,
      }
    }),
    ...data.tournaments.map((t) => {
      const champ = tournamentChampion(t.id, data)
      return {
        id: t.id,
        to: `/ping-pong/torneos/${t.id}`,
        name: t.name,
        game: gameOrMissing(data, 'pingpong'),
        at: t.createdAt,
        format: t.format === 'league' ? 'Liga' : 'Eliminación directa',
        champion: champ ? nameOf(champ) : undefined,
        count: t.playerIds.length,
      }
    }),
  ].sort((a, b) => Number(!!a.champion) - Number(!!b.champion) || b.at - a.at)

  return (
    <div className="page">
      <div className="section-head">
        <h1>Torneos</h1>
        <Link to="/torneos/nuevo" className="btn primary small">
          <PlusIcon /> Nuevo torneo
        </Link>
      </div>
      {!rows.length && (
        <div className="empty">
          <TrophyIcon size={40} weight="duotone" />
          <p>{say('Todavía no hay torneos. Armá uno de cualquier juego: liga, eliminación, mesas rotativas o partida acumulada.')}</p>
          <Link to="/torneos/nuevo" className="btn primary">
            <PlusIcon /> Crear torneo
          </Link>
        </div>
      )}
      <div className="list rows">
        {rows.map((r) => (
          <Link key={r.id} to={r.to} className="cup-row">
            <GameBadge game={r.game} size={40} />
            <span className="grow">
              <b>{r.name}</b>
              <span className="muted small block ellipsis">
                {r.game.name} · {r.format} · {r.count} inscriptos
              </span>
              {r.champion && (
                <span className="small block win-text">
                  <CheckCircleIcon className="inline-icon" aria-hidden /> Ganó: {r.champion}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
