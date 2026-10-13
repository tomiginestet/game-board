import { ArrowCounterClockwiseIcon, ArrowLeftIcon, FlagCheckeredIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { computeLive, eliminateOf, roundsOf, targetOf, type LiveState } from '../lib/engine'
import { confirmAction, toast } from '../lib/feedback'
import { vibrate } from '../lib/vibrate'
import type { GameDef } from '../lib/games/schema'
import { formatDate, gameOrMissing, usePlayerMap } from '../lib/hooks'
import { actions, useData } from '../lib/store'
import type { Play } from '../lib/types'
import { ScoreAnnouncer } from './play/shared'
import { CounterBoard } from './play/CounterBoard'
import { RoundsBoard } from './play/RoundsBoard'
import { TurnsBoard } from './play/TurnsBoard'
import { FinishForm } from './play/FinishForm'
import { Summary } from './play/Summary'

export function PlayScreen() {
  const { id } = useParams()
  const data = useData()
  const play = data.plays.find((p) => p.id === id)
  if (!play) {
    return (
      <div className="page">
        <p>Partida no encontrada.</p>
        <Link to="/" className="back">
          <ArrowLeftIcon /> Inicio
        </Link>
      </div>
    )
  }
  return <PlayView key={play.id} play={play} game={gameOrMissing(data, play.gameId)} />
}

function PlayView({ play, game }: { play: Play; game: GameDef }) {
  const navigate = useNavigate()
  const players = usePlayerMap()
  const live = useMemo(() => computeLive(game, play), [game, play])
  const [finishing, setFinishing] = useState(false)
  const backTo = play.cupId ? `/torneos/${play.cupId}` : '/'
  const finished = play.status === 'finished'

  const discard = async () => {
    if (play.cupId) {
      // Lo anotado de una partida de torneo no se puede recuperar: se pregunta antes.
      const ok = await confirmAction({
        title: '¿Borrar lo anotado en esta partida del torneo?',
        detail: 'La partida sigue en el torneo, lista para jugarse de nuevo. Lo anotado no se puede recuperar.',
        confirmLabel: 'Borrar lo anotado',
        danger: true,
      })
      if (ok) actions.patchPlay(play.id, { log: [], status: 'pending', result: undefined, finishedAt: undefined, startedAt: undefined })
      return
    }
    const removed = play
    actions.deletePlay(play.id)
    navigate('/')
    toast('Descartaste la partida.', { label: 'Deshacer', run: () => actions.restorePlay(removed) })
  }

  return (
    <div className="page play-page" style={{ ['--gc' as string]: game.color }}>
      <header className="play-head">
        <button className="icon-btn" onClick={() => navigate(backTo)} aria-label="Volver">
          <ArrowLeftIcon />
        </button>
        <GameBadge game={game} size={36} />
        <div className="grow">
          <strong>{game.name}</strong>
          <span className="muted small block">{describePlay(game, play, live)}</span>
        </div>
        {!finished && play.log.length > 0 && (
          <button
            className="icon-btn"
            onClick={() => {
              vibrate(30)
              actions.undo(play.id)
            }}
            aria-label="Deshacer"
            title="Deshacer lo último"
          >
            <ArrowCounterClockwiseIcon />
          </button>
        )}
      </header>

      {finished ? (
        <Summary play={play} game={game} live={live} players={players} />
      ) : finishing ? (
        <FinishForm play={play} game={game} live={live} players={players} onCancel={() => setFinishing(false)} />
      ) : (
        <>
          {(game.mode === 'counter' || game.mode === 'rounds' || game.mode === 'turns') && <ScoreAnnouncer play={play} live={live} players={players} />}
          {game.mode === 'counter' && <CounterBoard play={play} game={game} live={live} players={players} />}
          {game.mode === 'rounds' && <RoundsBoard play={play} game={game} live={live} players={players} />}
          {game.mode === 'turns' && <TurnsBoard play={play} game={game} live={live} players={players} />}
          {(game.mode === 'result' || game.mode === 'coop') && (
            <FinishForm play={play} game={game} live={live} players={players} />
          )}
          {game.mode !== 'result' && game.mode !== 'coop' && (
            <div className="play-actions">
              <button className={'btn block' + (game.mode === 'turns' ? ' primary' : '')} onClick={() => setFinishing(true)}>
                <FlagCheckeredIcon /> Terminar partida
              </button>
            </div>
          )}
          <button className="link-btn danger-text small center-block" onClick={discard}>
            <TrashIcon /> {play.cupId ? 'Borrar lo anotado' : 'Descartar partida'}
          </button>
        </>
      )}
    </div>
  )
}

function describePlay(game: GameDef, play: Play, live: LiveState): string {
  const parts: string[] = []
  const target = targetOf(game, play.config)
  const rounds = roundsOf(game, play.config)
  const burn = eliminateOf(game, play.config)
  if (burn !== undefined) parts.push(`se quema en ${burn}`)
  else if (target) parts.push(`a ${target} ${game.scoring.pointsName ?? 'puntos'}`)
  if (rounds) parts.push(`${Math.min(live.roundsPlayed + (play.status === 'finished' ? 0 : 1), rounds)} de ${rounds} manos`)
  if (game.mode === 'turns' && live.turnCount) parts.push(`turno ${live.turnCount}`)
  if (!parts.length) parts.push(formatDate(play.startedAt ?? play.createdAt))
  return parts.join(' · ')
}
