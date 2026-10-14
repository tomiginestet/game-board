import { PingPongIcon } from '@phosphor-icons/react'
import type { GameScore } from '../lib/pingpong/scoring'
import type { Side } from '../lib/pingpong/types'
import { teamName } from '../lib/pingpong/teams'
import type { Player } from '../lib/types'
import { TeamAvatar } from './Avatar'

interface Props {
  teams: Record<Side, Player[]>
  /** Juegos (sets) del partido; si está en juego, el último es el actual. */
  games: GameScore[]
  gamesWon: Record<Side, number>
  winner?: Side | null
  live?: boolean
  server?: Side
  /** Fila de arriba con el número de cada set (en el resultado). */
  numbered?: boolean
  avatarSize?: number
}

/**
 * La planilla de un partido por sets, como la del tenis: una columna por set, el que lo ganó en negrita y el total
 * al final de la fila. Es la única forma de leer sets en la app (lista de partidas y resultado).
 */
export function SetSheet({ teams, games, gamesWon, winner, live = false, server, numbered = false, avatarSize = 30 }: Props) {
  const shown = games.filter((g) => g.winner || g.a + g.b > 0)
  const label = (s: Side) =>
    `${teamName(teams[s])}: ${gamesWon[s]} ${gamesWon[s] === 1 ? 'set' : 'sets'}` + (shown.length ? ` (${shown.map((g) => g[s]).join(', ')})` : '')
  return (
    <div className="set-sheet num" style={{ ['--sets' as string]: shown.length }}>
      {/* La grilla es visual; los lectores de pantalla escuchan cada lado en una frase. */}
      <span className="sr-only">
        {label('a')}. {label('b')}.
      </span>
      {numbered && shown.length > 0 && (
        <div className="ss-row ss-head" aria-hidden>
          <span>Set</span>
          {shown.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
          <span />
        </div>
      )}
      {(['a', 'b'] as const).map((s) => (
        <div key={s} aria-hidden className={'ss-row' + (winner === s ? ' winner' : '') + (live ? ' live' : '')}>
          <span className="ss-who">
            <TeamAvatar team={teams[s]} size={avatarSize} />
            <span className="ss-name">{teamName(teams[s])}</span>
            {live && server === s && <PingPongIcon className="ss-serve" weight="fill" />}
          </span>
          {shown.map((g, i) => (
            <span key={i} className={'ss-cell' + (g.winner === s ? ' w' : '') + (live && !g.winner ? ' current' : '')}>
              {g[s]}
            </span>
          ))}
          <b className="ss-total">
            {gamesWon[s]}
          </b>
        </div>
      ))}
    </div>
  )
}
