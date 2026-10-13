import { ArrowCounterClockwiseIcon, ArrowLeftIcon, FlagCheckeredIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeamAvatar } from '../components/Avatar'
import { GameBadge, sideName, sidePlayersOf } from '../components/GameBits'
import { computeLive, eliminateOf, isDraw, roundsOf, targetOf, winnerSides, type LiveState } from '../lib/engine'
import { planillaOf } from '../lib/games/planilla'
import { clearToast, confirmAction, toast } from '../lib/feedback'
import { directResult, finishShortfall } from '../lib/finish'
import { clearPlanillaDraft, hasPlanilla, pendingPlanillaSides } from '../lib/games/planilla'
import { vibrate } from '../lib/vibrate'
import type { GameDef } from '../lib/games/schema'
import { formatDate, gameOrMissing, usePlayerMap } from '../lib/hooks'
import { actions, getData, useData } from '../lib/store'
import type { Id, Play, Player } from '../lib/types'
import { ScoreAnnouncer } from './play/shared'
import { entryText, useReducedMotion } from './play/playHooks'
import { winnerTitle } from './play/winnerText'
import { CounterBoard } from './play/CounterBoard'
import '../styles/playscreen.css'
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

/** Cuánto dura la pausa del punto final antes de pasar al resumen: lo justo para pasar el teléfono y mirar. */
const BEAT_MS = 4000
/** Cuántas caras entran en la pausa final (empate de muchos). */
const BEAT_FACES = 6

function PlayView({ play, game }: { play: Play; game: GameDef }) {
  const navigate = useNavigate()
  const players = usePlayerMap()
  const live = useMemo(() => computeLive(game, play), [game, play])
  const [finishing, setFinishing] = useState(false)
  const backTo = play.cupId ? `/torneos/${play.cupId}` : '/'
  const finished = play.status === 'finished'
  const scored = game.mode === 'counter' || game.mode === 'rounds' || game.mode === 'turns'

  // "Terminar partida" con la partida incompleta: se pregunta ahí mismo, en la barra (no en un diálogo).
  const [confirming, setConfirming] = useState(false)

  // Pausa del punto final: si un punto cierra la partida sola (o se termina con "Terminar partida" y el
  // tablero ya sabe quién ganó), no se salta directo al resumen. Se muestra "¡Ganó X!" unos segundos con
  // "Deshacer". `auto` deshace el último punto; `manual`, sólo reabre la partida.
  const [beat, setBeat] = useState<false | 'auto' | 'manual'>(false)
  const [prevStatus, setPrevStatus] = useState(play.status)
  if (prevStatus !== play.status) {
    setPrevStatus(play.status)
    setConfirming(false)
    if (play.status === 'finished') {
      if (!finishing && !beat && (game.mode === 'counter' || game.mode === 'rounds')) setBeat('auto')
      setFinishing(false)
    } else setBeat(false)
  }
  const showLive = !finished || !!beat

  // Si el tablero ya sabe el resultado, se cierra sin formulario; si no (empate arriba, roles…), se abre.
  const direct = !finished ? directResult(game, play, live) : undefined
  const shortfall = direct ? finishShortfall(game, play, live) : undefined
  // Generala: lo anotado en la mano en curso (falta que anoten otros) no entra en el resultado.
  const pending = confirming && hasPlanilla(game) ? pendingPlanillaSides(play.id) : []
  const pendingNote = pending.length
    ? ` Lo anotado en esta mano por ${pending.map((i) => sideName(play.sides[i], players)).join(' y ')} no se guarda.`
    : ''
  const finishNow = () => {
    if (!direct) return
    vibrate(40)
    setConfirming(false)
    setBeat('manual')
    actions.finishPlay(play.id, direct)
    if (hasPlanilla(game)) clearPlanillaDraft(play.id)
  }
  // Ningún aviso viejo (p. ej. "Cambiar" de la revancha) puede quedar encima del festejo, de la pregunta
  // o del formulario de cierre.
  useEffect(() => {
    if (beat || confirming || finishing) clearToast()
  }, [beat, confirming, finishing])
  const askFinish = () => {
    if (!direct) setFinishing(true)
    else if (shortfall) setConfirming(true)
    else finishNow()
  }
  const finishBtnRef = useRef<HTMLButtonElement>(null)
  const keepPlaying = () => {
    setConfirming(false)
    requestAnimationFrame(() => finishBtnRef.current?.focus())
  }

  // Mientras se juega, la navegación de abajo se esconde (un pulgar distraído no te saca de la partida).
  useEffect(() => {
    if (!showLive) return
    document.body.classList.add('in-play')
    return () => document.body.classList.remove('in-play')
  }, [showLive])

  // El marcador chico se pega justo debajo del encabezado (que cambia de alto con el nombre del juego).
  const headRef = useRef<HTMLElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const head = headRef.current
    const page = pageRef.current
    if (!head || !page || typeof ResizeObserver !== 'function') return
    const ro = new ResizeObserver(() => page.style.setProperty('--play-head-h', `${head.offsetHeight}px`))
    ro.observe(head)
    return () => ro.disconnect()
  }, [])

  // Al pasar al resumen, se arranca desde arriba.
  useEffect(() => {
    if (finished && !beat) window.scrollTo({ top: 0 })
  }, [finished, beat])

  const undo = () => {
    const last = play.log[play.log.length - 1]
    if (!last) return
    vibrate(30)
    actions.undo(play.id)
    toast(`Deshiciste: ${entryText(play, game, players, last)}`)
  }

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
    <div ref={pageRef} className={'page play-page' + (showLive ? ' is-live' : '') + (beat ? ' has-beat' : '')} style={{ ['--gc' as string]: game.color }}>
      <header ref={headRef} className="play-head" inert={!!beat || undefined}>
        <button className="icon-btn" onClick={() => navigate(backTo)} aria-label={play.cupId ? 'Volver al torneo' : 'Volver al inicio'}>
          <ArrowLeftIcon />
        </button>
        <GameBadge game={game} size={36} />
        <div className="grow play-title">
          {showLive ? <h1 className="play-h1">{game.name}</h1> : <strong>{game.name}</strong>}
          <span className="muted small block">{describePlay(game, play, live)}</span>
        </div>
      </header>

      {!showLive ? (
        <Summary play={play} game={game} live={live} players={players} />
      ) : finishing ? (
        <FinishForm play={play} game={game} live={live} players={players} onCancel={() => setFinishing(false)} />
      ) : (
        <>
          {/* Durante la pausa final el marcador queda a la vista pero no se puede tocar. */}
          <div className="play-board" inert={!!beat || undefined}>
            {scored && <ScoreAnnouncer play={play} live={live} players={players} />}
            {game.mode === 'counter' && <CounterBoard play={play} game={game} live={live} players={players} />}
            {game.mode === 'rounds' && <RoundsBoard play={play} game={game} live={live} players={players} />}
            {game.mode === 'turns' && <TurnsBoard play={play} game={game} live={live} players={players} />}
            {(game.mode === 'result' || game.mode === 'coop') && <FinishForm play={play} game={game} live={live} players={players} />}
            {!beat && (
              <button className="link-btn danger-text small center-block" onClick={discard}>
                <TrashIcon /> {play.cupId ? 'Borrar lo anotado' : 'Descartar partida'}
              </button>
            )}
          </div>
          {beat ? (
            <FinalBeat play={play} players={players} onUndo={() => {
              // Terminada a mano: sólo se reabre (lo anotado queda como estaba).
              if (beat === 'auto') actions.undo(play.id)
              // Si deshacer no alcanzó para reabrirla (p. ej. la cerró otra cosa), se reabre igual.
              if (getData().plays.find((p) => p.id === play.id)?.status === 'finished') actions.reopenPlay(play.id)
            }} onDone={() => setBeat(false)} />
          ) : (
            scored &&
            (confirming && shortfall ? (
              <FinishConfirm text={`${shortfall}.${pendingNote} ¿Terminar igual?`} onKeep={keepPlaying} onFinish={finishNow} />
            ) : (
              <div className="play-dock">
                <button type="button" className="btn big dock-undo" onClick={undo} disabled={!play.log.length} aria-keyshortcuts={game.mode === 'rounds' ? undefined : 'Z Backspace'}>
                  <ArrowCounterClockwiseIcon aria-hidden="true" /> Deshacer
                </button>
                {/* Secundario en todos los modos: el único naranja de la pantalla es la acción de anotar (o "Pasar turno"). */}
                <button ref={finishBtnRef} type="button" className="btn big dock-finish" onClick={askFinish}>
                  <FlagCheckeredIcon aria-hidden="true" /> Terminar partida
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}

/**
 * "Faltan 8 manos. ¿Terminar igual?" en la misma barra del pulgar: el tablero sigue a la vista y se puede
 * seguir anotando. El foco arranca en "Seguir jugando" (lo que no cambia nada); Escape también vuelve.
 */
function FinishConfirm({ text, onKeep, onFinish }: { text: string; onKeep: () => void; onFinish: () => void }) {
  const keepRef = useRef<HTMLButtonElement>(null)
  const textId = useId()
  useEffect(() => {
    keepRef.current?.focus({ preventScroll: true })
  }, [])
  return (
    <div
      className="play-dock dock-confirm"
      role="group"
      aria-labelledby={textId}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onKeep()
        }
      }}
    >
      <p id={textId} className="dock-confirm-text">
        <WarningIcon weight="fill" aria-hidden="true" /> {text}
      </p>
      <button ref={keepRef} type="button" className="btn big" onClick={onKeep}>
        Seguir jugando
      </button>
      <button type="button" className="btn big dock-finish" onClick={onFinish}>
        <FlagCheckeredIcon aria-hidden="true" /> Terminar igual
      </button>
    </div>
  )
}

/**
 * El punto final: "¡Ganaron Ana y Beto!" en grande, con sus caras y el resultado, ocupando media pantalla
 * mientras el tablero queda atrás, apagado. Cuatro segundos (lo que tarda en pasar el teléfono),
 * con "Deshacer" por si fue un toque de más. Si alguien lo toca o lo recorre con el teclado, se queda;
 * con movimiento reducido no hay cuenta regresiva: espera a "Ver resumen".
 */
function FinalBeat({ play, players, onUndo, onDone }: { play: Play; players: Map<Id, Player>; onUndo: () => void; onDone: () => void }) {
  const reduce = useReducedMotion()
  const seeRef = useRef<HTMLButtonElement>(null)
  const winners = winnerSides(play)
  const draw = isDraw(play) || !winners.length
  const title = winnerTitle(play, players)
  const faceSides = (draw ? play.sides.map((_, i) => i) : winners).slice(0, BEAT_FACES)
  const faceSize = faceSides.length === 1 ? 72 : faceSides.length === 2 ? 56 : 44
  // El del ganador primero: "30 a 2".
  const raw = play.result?.scores
  const order = draw ? play.sides.map((_, i) => i) : [...winners, ...play.sides.map((_, i) => i).filter((i) => !winners.includes(i))]
  // Entre dos, "30 a 2"; con más, cada uno con su nombre ("Ana 26 · Beto 11 · Caro 8").
  const score =
    raw?.length && raw.every((v) => typeof v === 'number')
      ? order.length > 2
        ? order.map((i) => `${sideName(play.sides[i], players)} ${raw[i]}`).join(' · ')
        : order.map((i) => raw[i]).join(' a ')
      : ''
  const [paused, setPaused] = useState(false)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    vibrate(60)
    // El foco estaba en el marcador (que queda inerte): pasa al aviso, sin mover la página.
    seeRef.current?.focus({ preventScroll: true })
  }, [])
  const counting = !reduce && !paused
  useEffect(() => {
    if (!counting) return
    const t = window.setTimeout(() => doneRef.current(), BEAT_MS)
    return () => window.clearTimeout(t)
  }, [counting])

  return (
    <div
      className={'final-beat' + (reduce ? ' reduce' : '') + (paused ? ' paused' : '')}
      role="status"
      // Si alguien lo está por tocar o lo recorre con el teclado, no se va solo.
      onPointerDown={() => setPaused(true)}
      onFocus={(e) => (e.target as HTMLElement) !== seeRef.current && setPaused(true)}
    >
      <div className="fb-faces" aria-hidden="true">
        {faceSides.map((i, k) => (
          <span key={i} className="fb-face" style={{ ['--k' as string]: k }}>
            <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={faceSize} />
          </span>
        ))}
      </div>
      <strong className="fb-title">{title}</strong>
      {score && <span className="fb-score num">{score}</span>}
      <div className="fb-actions">
        <button type="button" className="btn big" onClick={onUndo}>
          <ArrowCounterClockwiseIcon aria-hidden="true" /> Deshacer
        </button>
        <button type="button" ref={seeRef} className="btn primary big" onClick={onDone}>
          Ver resumen
        </button>
      </div>
      {counting && <span className="fb-timer" style={{ animationDuration: `${BEAT_MS}ms` }} aria-hidden="true" />}
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
  // En juego, el tablero ya dice "Mano N de M"; terminada, se cuentan las jugadas.
  if (rounds && play.status === 'finished') parts.push(`${Math.min(live.roundsPlayed, rounds)} de ${rounds} manos jugadas`)
  if (game.mode === 'turns' && live.turnCount) parts.push(`turno ${live.turnCount}`)
  // Sin meta ni quema, la regla es la cantidad de casillas (generala) o de manos; la fecha, sólo si no hay nada más.
  if (!parts.length && rounds) parts.push(planillaOf(game) ? `${rounds} categorías` : `${rounds} manos`)
  if (!parts.length) parts.push(formatDate(play.startedAt ?? play.createdAt))
  return parts.join(' · ')
}
