import { ArrowCounterClockwiseIcon, ArrowLeftIcon, ArrowsCounterClockwiseIcon, ArrowsLeftRightIcon, ConfettiIcon, HandshakeIcon, HouseIcon, PingPongIcon, SparkleIcon, StarIcon, TargetIcon, TimerIcon, TrashIcon, TrophyIcon, XIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeamAvatar } from '../../components/Avatar'
import { Medal } from '../../components/Medal'
import { SetSheet } from '../../components/SetSheet'
import { toast, useModal } from '../../lib/feedback'
import { MedalCelebration } from '../../components/MedalCelebration'
import { MedalSheet } from '../../components/MedalSheet'
import { levelUps, type LevelUp } from '../../lib/pingpong/achievements'
import { formatDate, UNKNOWN_PLAYER, usePlayerMap } from '../../lib/hooks'
import { TIERS } from '../../lib/medalArt'
import { computeMatch, describeConfig, formatElapsed, gameStartedAt, other } from '../../lib/pingpong/scoring'
import { computeLeaderboard } from '../../lib/pingpong/stats'
import { actions, useData } from '../../lib/store'
import { sidePlayers, teamAsPlayer, teamName } from '../../lib/pingpong/teams'
import type { Match, Player, Side } from '../../lib/pingpong/types'
import { mayCreateNow } from '../../lib/access'

function vibrate(ms = 15) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // no soportado
  }
}

/** Mantiene la pantalla encendida mientras se juega. */
function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | undefined
    let cancelled = false
    const request = () =>
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (cancelled) l.release()
          else lock = l
        })
        .catch(() => {})
    request()
    const onVisible = () => document.visibilityState === 'visible' && request()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release().catch(() => {})
    }
  }, [active])
}

export function MatchScreen() {
  const { id } = useParams()
  const data = useData()
  const match = data.matches.find((m) => m.id === id)
  if (!match) {
    return (
      <div className="page">
        <p>Partido no encontrado.</p>
        <Link to="/" className="back">
          <ArrowLeftIcon /> Inicio
        </Link>
      </div>
    )
  }
  return <Scoreboard key={match.id} match={match} />
}

function Scoreboard({ match }: { match: Match }) {
  const navigate = useNavigate()
  const players = usePlayerMap()
  const teamA = sidePlayers(match, 'a').map((id) => players.get(id) ?? UNKNOWN_PLAYER)
  const teamB = sidePlayers(match, 'b').map((id) => players.get(id) ?? UNKNOWN_PLAYER)
  const pA = teamAsPlayer(teamA)
  const pB = teamAsPlayer(teamB)
  const state = computeMatch(match.points, match.config, match.firstServer)
  const completedGames = state.games.filter((g) => g.winner).length
  const [flipped, setFlipped] = useState(false)
  const [seenGames, setSeenGames] = useState(completedGames)
  const [lastScorer, setLastScorer] = useState<Side | null>(null)

  useWakeLock(match.status === 'live')

  const backTo = match.tournamentId ? `/ping-pong/torneos/${match.tournamentId}` : '/'
  const pending = match.status === 'pending'
  const finished = match.status === 'finished'
  const betweenGames = !finished && completedGames > seenGames
  const locked = pending || finished || betweenGames

  const score = useCallback(
    (side: Side) => {
      if (locked) return
      vibrate()
      setLastScorer(side)
      actions.scorePoint(match.id, side)
    },
    [locked, match.id],
  )

  const undo = useCallback(() => {
    if (!match.points.length) return
    vibrate(30)
    actions.undoPoint(match.id)
    const prev = computeMatch(match.points.slice(0, -1), match.config, match.firstServer)
    setSeenGames((n) => Math.min(n, prev.games.filter((g) => g.winner).length))
    setLastScorer(null)
  }, [match])

  // Teclado: ← / → (o A / L) suman, Backspace deshace. Con una capa abierta (antes de empezar,
  // entre juegos o al final) el teclado es de la capa: sus botones responden a Enter y Escape.
  useEffect(() => {
    if (locked) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || document.querySelector('dialog[open]')) return
      const left: Side = flipped ? 'b' : 'a'
      if (e.key === 'ArrowLeft' || e.key === 'a') score(left)
      else if (e.key === 'ArrowRight' || e.key === 'l') score(other(left))
      else if (e.key === 'Backspace' || (e.key === 'z' && (e.ctrlKey || e.metaKey))) undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, flipped, score, undo])

  const sides: Side[] = flipped ? ['b', 'a'] : ['a', 'b']
  const playerOf = (s: Side) => (s === 'a' ? pA : pB)
  const doneGames = state.games.filter((g) => g.winner)
  const lastGame = doneGames.at(-1)
  const gameStart = gameStartedAt(match, state.games)
  // Para lectores de pantalla: el marcador se anuncia cada vez que cambia ("Ana 7, Beto 5").
  const announcement = !pending && match.points.length ? `${pA.name} ${state.current.a}, ${pB.name} ${state.current.b}` : ''
  const keepGoing = () => setSeenGames(completedGames)
  const titleId = useId()

  return (
    <div className="scoreboard">
      <div className="sb-topbar">
        <button className="icon-btn" onClick={() => navigate(backTo)} aria-label="Salir">
          <XIcon />
        </button>
        <div className="sb-info">
          <strong>{finished ? 'Final' : `Juego ${state.games.length}`}</strong>
          <span>{describeConfig(match.config)}</span>
        </div>
        <button className="icon-btn" onClick={() => setFlipped((f) => !f)} aria-label="Cambiar lados" title="Cambiar lados">
          <ArrowsLeftRightIcon />
        </button>
        <button className="icon-btn" onClick={undo} disabled={!match.points.length} aria-label="Deshacer" title="Deshacer último punto">
          <ArrowCounterClockwiseIcon />
        </button>
      </div>

      <div className="sb-tv">
        <div className="tv-head">
          <span className="tv-time">
            <TimerIcon aria-hidden weight="bold" />
            <span className="sr-only">Tiempo de partido:</span>
            <Elapsed from={match.startedAt} to={match.finishedAt} /> total
          </span>
          {!finished && gameStart !== undefined && (
            <span className="tv-time">
              <span className="sr-only">Tiempo del</span> juego {state.games.length} <Elapsed from={gameStart} />
            </span>
          )}
        </div>
        {sides.map((s) => {
          const p = playerOf(s)
          const isServer = !finished && !pending && state.server === s
          return (
            <div key={s} className="tv-row" style={{ ['--pc' as string]: p.color }}>
              <span className="tv-swatch" aria-hidden />
              <span className={'tv-ball' + (isServer ? '' : ' off')} aria-hidden />
              <span className="tv-name">
                <span aria-hidden>{p.emoji}</span> {p.name}
                {isServer && <span className="sr-only"> (saca)</span>}
              </span>
              <span className="tv-games">
                {doneGames.map((g, i) => (
                  <span key={i} className={'tv-game' + (g.winner === s ? ' won' : '')}>
                    <span className="sr-only">Juego {i + 1}: </span>
                    {g[s]}
                  </span>
                ))}
              </span>
              <span className="tv-won">
                {state.gamesWon[s]}
                <span className="sr-only"> {state.gamesWon[s] === 1 ? 'juego ganado' : 'juegos ganados'}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="court">
        {sides.map((s) => {
          const p = playerOf(s)
          const isServer = !finished && !pending && state.server === s
          const tag = state.matchPoint === s ? 'Punto de partido' : state.gamePoint === s ? 'Punto de juego' : null
          return (
            <button
              key={s}
              className={'court-half' + (lastScorer === s ? ' scored' : '')}
              style={{ ['--pc' as string]: p.color }}
              onPointerDown={(e) => {
                if (e.button === 0) score(s)
              }}
              // Enter y Espacio llegan como click sin puntero (detail 0); el toque ya sumó en onPointerDown.
              onClick={(e) => {
                if (e.detail === 0) score(s)
              }}
              onContextMenu={(e) => e.preventDefault()}
              disabled={locked}
            >
              <div className="ch-player">
                <span className="ch-emoji">{p.emoji}</span>
                <span className="ch-name">{p.name}</span>
              </div>
              <div key={state.current[s] + '-' + state.games.length} className="ch-score">
                {state.current[s]}
              </div>
              <div className="ch-tags">
                {isServer && <span className="serve-tag">
                    <PingPongIcon weight="fill" /> Saca
                  </span>}
                {tag && <span className="point-tag">{tag}</span>}
              </div>
            </button>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {!pending && !finished && match.points.length === 0 && (
        <div className="sb-hint">
          Tocá tu mitad de la pantalla para sumar un punto.
          <button className="link-btn" onClick={() => actions.setFirstServer(match.id, other(match.firstServer))}>
            Cambiar quién saca
          </button>
        </div>
      )}

      {pending && (
        <Overlay labelledBy={`${titleId}-setup`} onEscape={() => navigate(backTo)}>
          <div className="overlay-card">
            <div className="vs-row" id={`${titleId}-setup`}>
              <PlayerBig team={teamA} />
              <span className="vs">vs</span>
              <PlayerBig team={teamB} />
            </div>
            <p className="muted">{describeConfig(match.config)}</p>
            <p>Saca primero:</p>
            <div className="chips center">
              {(['a', 'b'] as const).map((s) => (
                <button key={s} className={'chip' + (match.firstServer === s ? ' active' : '')} onClick={() => actions.setFirstServer(match.id, s)}>
                  {playerOf(s).name}
                </button>
              ))}
            </div>
            <button className="btn primary big block" onClick={() => actions.startMatch(match.id)}>
              <PingPongIcon /> ¡A jugar!
            </button>
            <button className="btn block" onClick={() => navigate(backTo)}>
              Volver
            </button>
          </div>
        </Overlay>
      )}

      {betweenGames && lastGame && (
        <Overlay labelledBy={`${titleId}-game`} onEscape={keepGoing} initialFocus=".keep-going">
          <div className="overlay-card">
            <TargetIcon className="big-icon" weight="duotone" />
            <h2 id={`${titleId}-game`}>Juego para {playerOf(lastGame.winner!).name}</h2>
            <p className="game-final">
              {lastGame.a} - {lastGame.b}
            </p>
            <p className="muted">
              Juegos: {pA.name} {state.gamesWon.a} - {state.gamesWon.b} {pB.name}
            </p>
            <button
              className="btn primary big block"
              onClick={() => {
                setFlipped((f) => !f)
                keepGoing()
              }}
            >
              <ArrowsLeftRightIcon /> Cambiar lados y seguir
            </button>
            {/* Arranca con el foco: Enter sigue sin cambiar lados, como antes. */}
            <button className="btn block keep-going" onClick={keepGoing}>
              Seguir sin cambiar
            </button>
            <button className="link-btn" onClick={undo}>
              <ArrowCounterClockwiseIcon className="inline-icon" /> Deshacer último punto
            </button>
          </div>
        </Overlay>
      )}

      {finished && <MatchResult match={match} teamA={teamA} teamB={teamB} onUndo={undo} backTo={backTo} />}
    </div>
  )
}

/** Reloj que corre desde `from` hasta `to` (o hasta ahora, si todavía no terminó). */
function Elapsed({ from, to }: { from?: number; to?: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!from || to) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [from, to])
  return <span className="tv-clock">{formatElapsed(from ? (to ?? now) - from : 0)}</span>
}

/*
 * Las capas sobre el marcador son <dialog> modales: el foco queda adentro, el resto de la página
 * es inerte y, al cerrarse, el foco vuelve a donde estaba (useModal). El estilo en línea anula lo
 * que el navegador le pone a todo <dialog> (borde, margen, tamaño) para que mande `.overlay`.
 */

function Overlay({
  className,
  labelledBy,
  onEscape,
  initialFocus,
  children,
}: {
  className?: string
  /** Id del título visible de la capa. */
  labelledBy: string
  /** Qué hace Escape: lo mismo que el botón de salida de la capa. */
  onEscape: () => void
  /** Selector del elemento que arranca con el foco (si no, el primero que lo acepte). */
  initialFocus?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  useEffect(() => {
    if (initialFocus) ref.current?.querySelector<HTMLElement>(initialFocus)?.focus()
  }, [initialFocus])
  return (
    <dialog
      ref={ref}
      className={'overlay' + (className ? ' ' + className : '')}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onEscape()
      }}
    >
      {children}
    </dialog>
  )
}

function PlayerBig({ team }: { team: Player[] }) {
  return (
    <div className="player-big">
      <TeamAvatar team={team} size={64} />
      <strong>{teamName(team)}</strong>
    </div>
  )
}

function MatchResult({ match, teamA, teamB, onUndo, backTo }: { match: Match; teamA: Player[]; teamB: Player[]; onUndo: () => void; backTo: string }) {
  const pA = teamAsPlayer(teamA)
  const pB = teamAsPlayer(teamB)
  const data = useData()
  const navigate = useNavigate()
  const state = computeMatch(match.points, match.config, match.firstServer)
  const winner = state.winner === 'a' ? pA : state.winner === 'b' ? pB : null
  const winnerTeam = state.winner === 'a' ? teamA : teamB
  const titleId = useId()

  // Elo y logros: comparamos el historial con y sin este partido.
  const { delta, newAchievements, withStats, elo } = useMemo(() => {
    const withMatch = computeLeaderboard(data)
    const without = computeLeaderboard({ ...data, matches: data.matches.filter((m) => m.id !== match.id) })
    const news: { player: Player; ups: LevelUp[] }[] = []
    for (const p of [...teamA, ...teamB]) {
      const ups = levelUps(without.stats.get(p.id), withMatch.stats.get(p.id))
      if (ups.length) news.push({ player: p, ups })
    }
    return {
      delta: withMatch.eloDeltas.get(match.id),
      newAchievements: news,
      withStats: withMatch.stats,
      elo: { a: teamElo(teamA), b: teamElo(teamB) },
    }
    function teamElo(team: Player[]) {
      return Math.round(team.reduce((sum, p) => sum + (withMatch.stats.get(p.id)?.elo ?? 1000), 0) / team.length)
    }
  }, [data, match.id, teamA, teamB])
  const fresh = useMemo(
    () =>
      newAchievements.flatMap(({ player, ups }) =>
        ups.map(({ family, level }) => ({ who: player.name, family, level, value: withStats.get(player.id)?.[family.stat] ?? 0 })),
      ),
    [newAchievements, withStats],
  )
  const [shownUp, setShownUp] = useState<(LevelUp & { player: Player; value: number }) | null>(null)

  const rematch = () => {
    if (!mayCreateNow()) return
    const m = actions.createMatch(sidePlayers(match, 'a'), sidePlayers(match, 'b'), match.config, other(match.firstServer))
    navigate(`/partido/${m.id}`)
  }

  return (
    <Overlay className="result" labelledBy={titleId} onEscape={() => navigate(backTo)} initialFocus=".rs-main">
      {winner && <Confetti />}
      <MedalCelebration id={match.id} finishedAt={match.finishedAt} medals={fresh} />
      <div className="overlay-card">
        {/* Quién ganó, una sola vez: el trofeo es una chapita sobre el avatar del ganador. */}
        {winner ? (
          <>
            <span className="rs-winner">
              <TeamAvatar team={winnerTeam} size={88} />
              <span className="rs-trophy" aria-hidden>
                <TrophyIcon weight="fill" />
              </span>
            </span>
            <h2 id={titleId} className="rs-title">
              ¡{winnerTeam.length > 1 ? 'Ganaron' : 'Ganó'} {winner.name}!
            </h2>
          </>
        ) : (
          <>
            <HandshakeIcon className="big-icon" weight="duotone" />
            <h2 id={titleId} className="rs-title">
              ¡Empate!
            </h2>
          </>
        )}
        <p className="muted small num">
          {match.config.bestOf > 1 ? `Al mejor de ${match.config.bestOf}` : 'A un set'} ·{' '}
          {Math.max(state.gamesWon.a, state.gamesWon.b)} a {Math.min(state.gamesWon.a, state.gamesWon.b)} · {formatDate(match.finishedAt ?? match.createdAt)}
        </p>

        <SetSheet teams={{ a: teamA, b: teamB }} games={state.games} gamesWon={state.gamesWon} winner={state.winner} numbered avatarSize={28} />
        {delta && (
          <dl className="rs-elo num">
            {(['a', 'b'] as const).map((s) => (
              <div key={s} className={state.winner === s ? 'w' : undefined}>
                <dt>{(s === 'a' ? pA : pB).name}</dt>
                <dd>
                  <span className={'elo-delta ' + (delta[s] >= 0 ? 'up' : 'down')}>
                    {delta[s] >= 0 ? '+' : '−'}
                    {Math.abs(delta[s])}
                  </span>{' '}
                  → {elo[s]}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* La medalla es el momento: grande, arriba y centrada, con el texto debajo. Si son varias, en fila. */}
        {fresh.length > 0 && (
          <div className={'rs-medals' + (fresh.length > 1 ? ' many' : '')} role="status">
            {newAchievements.flatMap(({ player, ups }) =>
              ups.map(({ family, level }) => (
                <button
                  key={player.id + family.id}
                  type="button"
                  className="rs-medal"
                  aria-haspopup="dialog"
                  onClick={() => setShownUp({ player, family, level, value: withStats.get(player.id)?.[family.stat] ?? 0 })}
                >
                  <Medal family={family} level={level} size={fresh.length > 1 ? 64 : 104} />
                  <span className="rs-medal-who">
                    {player.name} {level === 0 ? 'desbloqueó' : `subió a ${TIERS[level].name.toLowerCase()}`}
                  </span>
                  <span className="rs-medal-name">{family.levels[level].name}</span>
                  {fresh.length === 1 && <span className="rs-medal-desc">{family.levels[level].description}</span>}
                </button>
              )),
            )}
            {shownUp && (
              <MedalSheet
                family={shownUp.family}
                level={shownUp.level}
                mine={{ name: shownUp.player.name, value: shownUp.value, level: shownUp.level }}
                onClose={() => setShownUp(null)}
              />
            )}
          </div>
        )}

        {!match.tournamentId && (
          <button className="btn primary big block rs-main" onClick={rematch}>
            <ArrowsCounterClockwiseIcon /> Revancha
          </button>
        )}
        <button className={'btn block' + (match.tournamentId ? ' primary big rs-main' : '')} onClick={() => navigate(backTo)}>
          {match.tournamentId ? (
            <>
              <TrophyIcon /> Volver al torneo
            </>
          ) : (
            <>
              <HouseIcon /> Inicio
            </>
          )}
        </button>
        <div className="row gap center">
          <button className="link-btn" onClick={onUndo}>
            <ArrowCounterClockwiseIcon className="inline-icon" /> Deshacer último punto
          </button>
          {!match.tournamentId && (
            <button
              className="link-btn danger-text"
              onClick={() => {
                // Se puede recuperar mientras dure el aviso: se borra sin preguntar y se ofrece deshacer.
                const removed = match
                if (!actions.deleteMatch(match.id)) return
                navigate('/historial')
                toast('Borraste el partido.', { label: 'Deshacer', run: () => actions.restoreMatch(removed) })
              }}
            >
              <TrashIcon className="inline-icon" /> Borrar
            </button>
          )}
        </div>
      </div>
    </Overlay>
  )
}

const CONFETTI_ICONS = [ConfettiIcon, PingPongIcon, SparkleIcon, StarIcon, TrophyIcon]
const CONFETTI_COLORS = ['#ff6b35', '#ffb400', '#22c55e', '#3b82f6', '#ec4899', '#a855f7']

function Confetti() {
  // Distribución pseudoaleatoria determinística (sin Math.random en el render).
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: ((i * 13) % 15) / 10,
    duration: 2.5 + ((i * 7) % 20) / 10,
    Icon: CONFETTI_ICONS[i % CONFETTI_ICONS.length],
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }))
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, color: p.color }}>
          <p.Icon weight="fill" size={24} />
        </span>
      ))}
    </div>
  )
}
