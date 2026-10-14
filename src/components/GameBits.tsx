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

/** Cómo se nombra un partido en una lista: los lados ("Los Pibes vs La Banda") o la convocatoria. */
export function playTitle(play: Play, players: Map<Id, Player>, teams: { id: Id; name: string }[] = []): string {
  if (play.invited && !play.sides.length) {
    const team = play.callTeamId ? teams.find((t) => t.id === play.callTeamId) : undefined
    const yes = Object.values(play.rsvp ?? {}).filter((r) => r === 'yes').length
    return `${team ? `${team.name}: c` : 'C'}onvocatoria · ${yes} de ${play.invited.length} confirmados`
  }
  return play.sides.map((s) => sideName(s, players)).join(' vs ')
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
  const score = (i: number) => (scores?.[i] !== undefined && scores?.[i] !== null ? formatScore(game, scores[i]!) : undefined)
  // Se lee como la planilla: arriba el juego y la fecha; abajo quién ganó (con corona y su puntaje) y, debajo, el resto en orden.
  const ranked = !live && coop === undefined && !draw
  const lead = ranked ? order.filter((i) => play.result?.places[i] === 1) : []
  const rest = ranked ? order.filter((i) => play.result?.places[i] !== 1) : []
  const all = play.sides.length ? order.map((i) => sideName(play.sides[i], players)).join(' · ') : playTitle(play, players)
  return (
    <Link to={`/partida/${play.id}`} className={'match-row play-row' + resultClass + (live ? ' is-live' : '')}>
      <div className="mr-meta">
        {resultClass && <ResultTag result={resultClass.trim() as 'win' | 'loss'} />}
        {showGame && <b className="pr-game">{game.name}</b>}
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
          <span>{coop ? 'Ganaron todos' : 'Perdieron contra el juego'}</span>
        ) : draw ? (
          <span>
            <HandshakeIcon className="inline-icon" /> Empate
          </span>
        ) : null}
        <span className="mr-date">{play.status === 'pending' && play.scheduledAt ? formatWhen(play.scheduledAt) : formatDate(play.finishedAt ?? play.startedAt ?? play.createdAt)}</span>
      </div>
      {lead.length ? (
        <>
          {lead.map((i) => (
            <div key={i} className="pr-winner">
              <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={28} />
              <span className="ellipsis">{sideName(play.sides[i], players)}</span>
              <CrownIcon weight="fill" className="crown" aria-label="ganó" />
              {score(i) !== undefined && <b className="pr-score num">{score(i)}</b>}
            </div>
          ))}
          {rest.length > 0 && (
            <p className="pr-rest">
              {play.sides.length === 2 ? 'contra ' : ''}
              {rest.map((i, k) => (
                <span key={i}>
                  {k > 0 && ' · '}
                  {play.sides.length > 2 && `${play.result?.places[i]}º `}
                  <span className="pr-rest-name">{sideName(play.sides[i], players)}</span>
                  {score(i) !== undefined && <span className="num"> {score(i)}</span>}
                </span>
              ))}
            </p>
          )}
        </>
      ) : (
        <p className="pr-all ellipsis">{all}</p>
      )}
    </Link>
  )
}
