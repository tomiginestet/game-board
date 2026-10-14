import { Link } from 'react-router-dom'
import { formatDate, UNKNOWN_PLAYER } from '../lib/hooks'
import { computeMatch } from '../lib/pingpong/scoring'
import type { PPMatch as Match, Player, Id } from '../lib/types'
import { sidePlayers, sideOf } from '../lib/pingpong/teams'
import { ResultTag } from './GameBits'
import { SetSheet } from './SetSheet'

interface Props {
  match: Match
  players: Map<Id, Player>
  showDate?: boolean
  /** Desde la perspectiva de un jugador (para colorear victoria/derrota). */
  perspective?: Id
}

export function MatchRow({ match: m, players, showDate = true, perspective }: Props) {
  const teamOf = (s: 'a' | 'b') => sidePlayers(m, s).map((id) => players.get(id) ?? UNKNOWN_PLAYER)
  const state = computeMatch(m.points, m.config, m.firstServer)
  const finished = m.status === 'finished'
  const live = m.status === 'live'
  let resultClass = ''
  const mySide = perspective ? sideOf(m, perspective) : undefined
  if (mySide && finished) resultClass = state.winner === mySide ? ' win' : state.winner === null ? ' draw' : ' loss'

  // Arriba el contexto (estado, formato, hora); abajo la planilla de sets, que se lee sola.
  return (
    <Link to={`/partido/${m.id}`} className={'match-row' + resultClass + (live ? ' is-live' : '')}>
      <div className="mr-meta">
        {m.status === 'pending' && <span className="pill">Por jugar</span>}
        {live && (
          <span className="pill live">
            <span className="live-dot" /> En juego
          </span>
        )}
        {(resultClass === ' win' || resultClass === ' loss') && <ResultTag result={resultClass === ' win' ? 'win' : 'loss'} />}
        {finished && m.winner === null && <span className="pill">Empate</span>}
        <span>Ping pong · {m.config.bestOf > 1 ? `al mejor de ${m.config.bestOf}` : 'a un set'}</span>
        {showDate && <span className="mr-date">{formatDate(m.finishedAt ?? m.startedAt ?? m.createdAt)}</span>}
      </div>
      <SetSheet
        teams={{ a: teamOf('a'), b: teamOf('b') }}
        games={m.status === 'pending' ? [] : state.games}
        gamesWon={state.gamesWon}
        winner={finished ? state.winner : undefined}
        live={live}
        server={state.server}
      />
    </Link>
  )
}
