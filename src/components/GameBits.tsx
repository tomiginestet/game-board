import { CrownIcon, HandshakeIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { isDraw, sidesByPlace } from '../lib/engine'
import type { GameDef } from '../lib/games/schema'
import { formatDate, UNKNOWN_PLAYER } from '../lib/hooks'
import { formatScore } from '../lib/score'
import { formatWhen } from '../lib/schedule'
import type { Id, Play, PlaySide, Player } from '../lib/types'
import { TeamAvatar } from './Avatar'

/** Resultado desde el punto de vista de un jugador: con texto, no sólo con color. */
export function ResultTag({ result }: { result: 'win' | 'loss' | 'draw' }) {
  return <span className={'result-tag ' + result}>{result === 'win' ? 'Ganó' : result === 'loss' ? 'Perdió' : 'Empató'}</span>
}

/** Ícono de un juego: su emoji sobre un cuadrado de su color. */
export function GameBadge({ game, size = 40 }: { game: Pick<GameDef, 'emoji' | 'color' | 'name'>; size?: number }) {
  return (
    <span
      className="game-badge"
      style={{ width: size, height: size, fontSize: size * 0.55, background: game.color + '33', borderColor: game.color }}
      aria-hidden
      title={game.name}
    >
      {game.emoji}
    </span>
  )
}

export function sidePlayersOf(side: PlaySide, players: Map<Id, Player>): Player[] {
  return side.players.map((id) => players.get(id) ?? UNKNOWN_PLAYER)
}

export function sideName(side: PlaySide, players: Map<Id, Player>): string {
  const names = sidePlayersOf(side, players).map((p) => p.name).join(' & ')
  // Los lados armados por rol (impostor) muestran a los jugadores y el rol.
  if (side.role) return `${names} (${side.role})`
  return side.name ?? names
}

/** Color que representa a un lado (el de su primer jugador). */
export function sideColor(side: PlaySide, players: Map<Id, Player>): string {
  return players.get(side.players[0])?.color ?? '#888'
}

/** Fila resumen de una partida de cualquier juego (salvo ping pong, que usa MatchRow). */
export function PlayRow({ play, game, players, focus, showGame = true }: { play: Play; game: GameDef; players: Map<Id, Player>; focus?: Id; showGame?: boolean }) {
  const live = play.status !== 'finished'
  const order = sidesByPlace(play)
  const draw = isDraw(play)
  const coop = play.result?.coopWin
  const mine = focus ? play.sides.findIndex((s) => s.players.includes(focus)) : -1
  const myPlace = mine >= 0 ? play.result?.places[mine] : undefined
  const resultClass =
    !live && focus && mine >= 0
      ? coop !== undefined
        ? coop
          ? ' win'
          : ' loss'
        : myPlace === 1 && !draw
          ? ' win'
          : draw
            ? ''
            : ' loss'
      : ''
  const scores = play.result?.scores
  return (
    <Link to={`/partida/${play.id}`} className={'match-row play-row' + resultClass + (live ? ' is-live' : '')}>
      {showGame && <GameBadge game={game} size={36} />}
      <div className="pr-body">
        <div className="pr-sides">
          {order.slice(0, 4).map((i, k) => {
            const s = play.sides[i]
            const first = play.result?.places[i] === 1 && !draw && coop === undefined
            return (
              <span key={i} className={'pr-side' + (first ? ' first' : '')}>
                {k > 0 && <span className="muted">·</span>}
                <TeamAvatar team={sidePlayersOf(s, players)} size={22} />
                <span className="ellipsis">{sideName(s, players)}</span>
                {first && <CrownIcon weight="fill" className="inline-icon crown" />}
                {scores?.[i] !== undefined && scores?.[i] !== null && <b className="pr-score">{formatScore(game, scores[i]!)}</b>}
              </span>
            )
          })}
          {order.length > 4 && <span className="muted small">+{order.length - 4}</span>}
        </div>
        <div className="mr-meta muted small">
          {resultClass && <ResultTag result={resultClass.trim() as 'win' | 'loss'} />}
          {showGame && <span>{game.name}</span>}
          {play.stake && (
            <span title={`Prenda: ${play.stake.text}`}>
              <span aria-hidden="true">{play.stake.emoji ?? '🎁'}</span>
              <span className="sr-only">Con prenda: {play.stake.text}</span>
            </span>
          )}
          {live ? (
            <span className="win-text">
              {play.status === 'live' && <span className="live-dot" />} {play.status === 'pending' ? 'Pendiente' : 'En juego'}
            </span>
          ) : coop !== undefined ? (
            <span>{coop ? '¡Ganaron!' : 'Perdieron contra el juego'}</span>
          ) : draw ? (
            <span>
              <HandshakeIcon className="inline-icon" /> Empate
            </span>
          ) : null}
          <span>{play.status === 'pending' && play.scheduledAt ? formatWhen(play.scheduledAt) : formatDate(play.finishedAt ?? play.startedAt ?? play.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
