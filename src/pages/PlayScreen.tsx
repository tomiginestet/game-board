import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  CheckIcon,
  ConfettiIcon,
  FlagCheckeredIcon,
  LockSimpleIcon,
  MinusIcon,
  PlusIcon,
  SkipForwardIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeamAvatar } from '../components/Avatar'
import { GameBadge, sideColor, sideName, sidePlayersOf } from '../components/GameBits'
import { Medal } from '../components/Medal'
import { MedalCelebration } from '../components/MedalCelebration'
import { MedalSheet } from '../components/MedalSheet'
import { Tally } from '../components/Tally'
import { computeLive, eliminateOf, isDraw, nextTurn, placesFromScores, roundScore, roundsOf, sidesByPlace, targetOf, type LiveState } from '../lib/engine'
import type { EventDef, GameDef } from '../lib/games/schema'
import { formatDate, gameOrMissing, usePlayerMap } from '../lib/hooks'
import { TIERS } from '../lib/medalArt'
import { gameMedals, levelUps, type MedalProgress } from '../lib/medals'
import { computeBoard, gameStatsOf } from '../lib/stats'
import { actions, useData } from '../lib/store'
import type { Id, Play, PlayResult, Player } from '../lib/types'

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

function vibrate(ms = 15) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // no soportado
  }
}

function PlayView({ play, game }: { play: Play; game: GameDef }) {
  const navigate = useNavigate()
  const players = usePlayerMap()
  const live = useMemo(() => computeLive(game, play), [game, play])
  const [finishing, setFinishing] = useState(false)
  const backTo = play.cupId ? `/torneos/${play.cupId}` : '/'
  const finished = play.status === 'finished'

  const discard = () => {
    if (!confirm(play.cupId ? '¿Borrar lo anotado en esta partida del torneo?' : '¿Descartar esta partida?')) return
    if (play.cupId) {
      actions.patchPlay(play.id, { log: [], status: 'pending', result: undefined, finishedAt: undefined, startedAt: undefined })
    } else {
      actions.deletePlay(play.id)
      navigate('/')
    }
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

/** Pide los puntos de un evento que los define en el momento (falta envido, bonus). */
function askPoints(e: EventDef, suggestion?: number): number | null {
  const raw = prompt(`¿Cuántos puntos vale "${e.name}"?`, suggestion !== undefined ? String(suggestion) : '')
  if (raw === null) return null
  const n = Number(raw.replace(',', '.'))
  return isFinite(n) ? n : null
}

// ---------------------------------------------------------------------------
// Marcador en vivo

function CounterBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const target = targetOf(game, play.config)
  const quick = game.scoring.quick?.length ? game.scoring.quick : [1]
  // Los eventos de flor sólo aparecen si se juega con flor.
  const events = game.events.filter((e) => !e.global && !(e.id.toLowerCase().includes('flor') && play.config.flor === false))
  const globals = game.events.filter((e) => e.global)
  const two = play.sides.length === 2
  const leader = Math.max(...live.scores)

  const tap = (s: number, e?: EventDef) => {
    vibrate()
    if (!e) return actions.log(play.id, { k: 'pt', s, n: quick[0] })
    if (e.type === 'holder') return actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
    if (e.askPoints) {
      const suggestion = target !== undefined ? Math.max(1, target - leader) : undefined
      const p = askPoints(e, e.id.toLowerCase().includes('falta') ? suggestion : undefined)
      if (p === null) return
      return actions.log(play.id, { k: 'ev', s, e: e.id, n: 1, p })
    }
    actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
  }

  return (
    <>
      <div className={'counter-board' + (two ? ' two' : '')}>
        {play.sides.map((side, s) => {
          const color = sideColor(side, players)
          const malas = game.scoring.tally === 'matches' && target && target >= 20 ? target / 2 : undefined
          return (
            <div key={s} className="counter-side" style={{ ['--pc' as string]: color }}>
              <button className="counter-main" onPointerDown={(e) => e.button === 0 && tap(s)} onContextMenu={(e) => e.preventDefault()}>
                <span className="cs-name">
                  <TeamAvatar team={sidePlayersOf(side, players)} size={28} /> {sideName(side, players)}
                </span>
                <span key={live.scores[s]} className="cs-score">
                  {live.scores[s]}
                </span>
                {malas !== undefined && <span className="cs-sub">{live.scores[s] < malas ? 'en las malas' : 'en las buenas'}</span>}
                {game.scoring.tally === 'matches' && <Tally value={live.scores[s]} target={target ?? 30} />}
                <span className="cs-hint">
                  +{quick[0]} {game.scoring.quickLabel ?? ''}
                </span>
              </button>
              {(events.length > 0 || quick.length > 1) && (
                <div className="cs-events">
                  {quick.slice(1).map((n) => (
                    <button key={n} className="chip" onClick={() => actions.log(play.id, { k: 'pt', s, n })}>
                      +{n}
                    </button>
                  ))}
                  {events.map((e) => (
                    <button key={e.id} className="chip" onClick={() => tap(s, e)} title={e.help}>
                      {e.emoji} {e.name}
                      {e.points && !e.askPoints ? <span className="muted"> +{e.points}</span> : null}
                      {live.counts[e.id]?.[s] ? <b className="chip-count">{live.counts[e.id][s]}</b> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {globals.length > 0 && (
        <div className="chips center">
          {globals.map((e) => (
            <button key={e.id} className="chip" onClick={() => actions.log(play.id, { k: 'ev', s: -1, e: e.id, n: 1 })} title={e.help}>
              {e.emoji} {e.name} {live.globalCounts[e.id] ? <b className="chip-count">{live.globalCounts[e.id]}</b> : null}
            </button>
          ))}
        </div>
      )}
      <LogList play={play} game={game} players={players} />
    </>
  )
}

/** Últimas cosas anotadas (para saber qué se deshace). */
function LogList({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const items = play.log.slice(-6).reverse()
  if (!items.length) return null
  const label = (i: number) => (i < 0 ? 'Mesa' : sideName(play.sides[i], players))
  return (
    <details className="log-list">
      <summary className="muted small">Lo último anotado</summary>
      <ul>
        {items.map((e, k) => {
          let text = ''
          if (e.k === 'pt') text = `${label(e.s)} +${e.n}`
          else if (e.k === 'ev') {
            const def = game.events.find((x) => x.id === e.e)
            text = `${def?.emoji ?? ''} ${def?.name ?? e.e}: ${label(e.s)}${e.p !== undefined ? ` (+${e.p})` : ''}${e.n < 0 ? ' (−1)' : ''}`
          } else if (e.k === 'turn') text = `Turno de ${label(e.s)}`
          else text = `Mano: ${e.sc.join(' / ')}`
          return <li key={k}>{text}</li>
        })}
      </ul>
    </details>
  )
}

// ---------------------------------------------------------------------------
// Por manos

function RoundsBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const [entering, setEntering] = useState(false)
  const rounds = play.log.filter((e) => e.k === 'round')
  const labels = game.scoring.roundLabels
  const target = targetOf(game, play.config)
  const order = game.scoring.lowWins ? [...live.scores].sort((a, b) => a - b) : [...live.scores].sort((a, b) => b - a)

  return (
    <>
      <div className="table-wrap">
        <table className="rounds-table">
          <thead>
            <tr>
              <th />
              {play.sides.map((s, i) => (
                <th key={i} style={{ color: sideColor(s, players) }} className={live.eliminated[i] ? 'out' : ''}>
                  <TeamAvatar team={sidePlayersOf(s, players)} size={24} />
                  <span className="ellipsis block">{sideName(s, players)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, k) => (
              <tr key={k}>
                <td className="muted small">{labels?.[k] ?? `Mano ${k + 1}`}</td>
                {r.sc.map((v, i) => (
                  <td key={i} className={v < 0 ? 'loss-text' : ''}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              {live.scores.map((v, i) => (
                <td key={i} className={v === order[0] && rounds.length ? 'lead' : ''}>
                  <b>{v}</b>
                  {target && !game.scoring.lowWins && <span className="muted small block">faltan {Math.max(0, target - v)}</span>}
                  {live.eliminated[i] && <span className="loss-text small block">afuera</span>}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      {entering ? (
        <RoundForm play={play} game={game} live={live} players={players} onDone={() => setEntering(false)} />
      ) : (
        <button className="btn primary big block" onClick={() => setEntering(true)}>
          <PlusIcon /> Cargar {labels?.[rounds.length] ?? `mano ${rounds.length + 1}`}
        </button>
      )}
    </>
  )
}

function RoundForm({ play, game, live, players, onDone }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player>; onDone: () => void }) {
  const n = play.sides.length
  const scorer = game.scoring.scorer ?? 'sum'
  const roundIndex = live.roundsPlayed
  const [value, setValue] = useState<(number | null)[]>(() => new Array(n).fill(null))
  const [bid, setBid] = useState<(number | null)[]>(() => new Array(n).fill(0))
  const [tricks, setTricks] = useState<(number | null)[]>(() => new Array(n).fill(0))
  const events = game.events.filter((e) => !e.global)
  const [ev, setEv] = useState<Record<string, number[]>>(() => Object.fromEntries(events.map((e) => [e.id, new Array(n).fill(0)])))
  const [asked, setAsked] = useState<Record<string, number>[]>(() => Array.from({ length: n }, () => ({})))

  const scoreOf = (i: number) =>
    roundScore(
      game,
      roundIndex,
      { value: value[i], bid: bid[i], tricks: tricks[i] },
      Object.fromEntries(events.map((e) => [e.id, ev[e.id][i]])),
      asked[i],
    )
  const scores = play.sides.map((_, i) => scoreOf(i))
  const active = play.sides.map((_, i) => !live.eliminated[i])

  const bump = (e: EventDef, i: number, d: number) => {
    const cur = ev[e.id][i]
    const next = Math.max(0, cur + d)
    if (e.askPoints && d > 0) {
      const p = askPoints(e)
      if (p === null) return
      setAsked(asked.map((a, k) => (k === i ? { ...a, [e.id]: (a[e.id] ?? 0) + p } : a)))
    }
    if (e.askPoints && d < 0 && next === 0) setAsked(asked.map((a, k) => (k === i ? { ...a, [e.id]: 0 } : a)))
    setEv({ ...ev, [e.id]: ev[e.id].map((v, k) => (k === i ? next : v)) })
  }

  const save = () => {
    vibrate(20)
    actions.log(play.id, {
      k: 'round',
      sc: scores.map((s, i) => (active[i] ? s : 0)),
      in: scorer === 'sum' ? { value } : { bid, tricks },
      ev: Object.fromEntries(Object.entries(ev).filter(([, arr]) => arr.some((x) => x > 0))),
    })
    onDone()
  }

  const numberInput = (arr: (number | null)[], set: (a: (number | null)[]) => void, i: number, label: string) => (
    <label className="mini-field">
      <span>{label}</span>
      <input
        className="input"
        type="number"
        inputMode="numeric"
        value={arr[i] ?? ''}
        onChange={(e) => set(arr.map((v, k) => (k === i ? (e.target.value === '' ? null : Number(e.target.value)) : v)))}
      />
    </label>
  )

  return (
    <div className="card round-form">
      <h3>{game.scoring.roundLabels?.[roundIndex] ?? `Mano ${roundIndex + 1}`}</h3>
      {play.sides.map((side, i) =>
        !active[i] ? null : (
          <div key={i} className="rf-side" style={{ ['--pc' as string]: sideColor(side, players) }}>
            <div className="rf-head">
              <TeamAvatar team={sidePlayersOf(side, players)} size={26} />
              <b className="grow ellipsis">{sideName(side, players)}</b>
              <span className={'rf-total' + (scores[i] < 0 ? ' loss-text' : '')}>{scores[i] > 0 ? `+${scores[i]}` : scores[i]}</span>
            </div>
            <div className="rf-inputs">
              {scorer === 'sum' ? (
                numberInput(value, setValue, i, events.some((e) => e.points) ? 'Puntos de cartas' : 'Puntos')
              ) : (
                <>
                  {numberInput(bid, setBid, i, 'Apostó')}
                  {numberInput(tricks, setTricks, i, 'Hizo')}
                </>
              )}
            </div>
            {events.length > 0 && (
              <div className="chips">
                {events.map((e) => (
                  <span key={e.id} className="ev-stepper" title={e.help}>
                    <span>
                      {e.emoji} {e.name}
                      {e.points && !e.askPoints ? <span className="muted small"> {e.points > 0 ? `+${e.points}` : e.points}</span> : null}
                    </span>
                    <span className="stepper">
                      <button type="button" onClick={() => bump(e, i, -1)} disabled={!ev[e.id][i]} aria-label="Menos">
                        <MinusIcon />
                      </button>
                      <span className="stepper-value">{ev[e.id][i]}</span>
                      <button type="button" onClick={() => bump(e, i, 1)} aria-label="Más">
                        <PlusIcon />
                      </button>
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ),
      )}
      {scorer === 'skullKing' && <p className="hint">Los bonus sólo suman si se acertó la apuesta.</p>}
      <div className="row">
        <button className="btn" onClick={onDone}>
          Cancelar
        </button>
        <button className="btn primary grow" onClick={save}>
          <CheckIcon /> Guardar mano
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Por turnos

function TurnsBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const started = live.turnCount > 0
  const current = live.turn
  const pass = () => {
    vibrate(20)
    actions.log(play.id, { k: 'turn', s: nextTurn(play, live) })
  }
  const target = targetOf(game, play.config)
  const counts = game.events.filter((e) => e.type === 'count' && !e.global)
  const holders = game.events.filter((e) => e.type === 'holder')

  return (
    <>
      <div className="turn-banner" style={{ ['--pc' as string]: sideColor(play.sides[started ? current : 0], players) }}>
        {started ? (
          <>
            <span className="muted small">Turno {live.turnCount} · le toca a</span>
            <b className="turn-name">
              <TeamAvatar team={sidePlayersOf(play.sides[current], players)} size={34} /> {sideName(play.sides[current], players)}
            </b>
          </>
        ) : (
          <b>Empieza {sideName(play.sides[0], players)}</b>
        )}
        <button className="btn primary big" onClick={pass}>
          <SkipForwardIcon weight="fill" /> {started ? 'Pasar turno' : 'Arrancar'}
        </button>
      </div>

      {holders.length > 0 && (
        <div className="card holders">
          {holders.map((e) => {
            const h = live.holders[e.id]
            return (
              <div key={e.id} className="holder-row">
                <span className="grow">
                  {e.emoji} {e.name}
                  {e.points ? <span className="muted small"> ({e.points} pts)</span> : null}
                </span>
                <div className="chips">
                  {play.sides.map((side, i) => (
                    <button
                      key={i}
                      className={'chip' + (h === i ? ' active' : '')}
                      style={h === i ? { borderColor: sideColor(side, players) } : undefined}
                      onClick={() => actions.log(play.id, { k: 'ev', s: h === i ? -1 : i, e: e.id, n: 1 })}
                    >
                      {sidePlayersOf(side, players)[0]?.emoji} {sideName(side, players)}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="turn-sides">
        {play.sides.map((side, i) => (
          <div key={i} className={'card turn-side' + (started && i === current ? ' current' : '')} style={{ ['--pc' as string]: sideColor(side, players) }}>
            <div className="rf-head">
              <TeamAvatar team={sidePlayersOf(side, players)} size={30} />
              <b className="grow ellipsis">{sideName(side, players)}</b>
              <span className="ts-score" title="Puntos a la vista">
                {live.scores[i]}
                {target ? <span className="muted small">/{target}</span> : null}
              </span>
            </div>
            <div className="chips">
              {counts.map((e) => (
                <span key={e.id} className="ev-stepper" title={e.help}>
                  <span>
                    {e.emoji} {e.name}
                  </span>
                  <span className="stepper">
                    {/* Lo oculto no se deshabilita en 0: si no, se notaría si alguien ya tiene alguno. */}
                    <button type="button" onClick={() => actions.log(play.id, { k: 'ev', s: i, e: e.id, n: -1 })} disabled={!e.hidden && !live.counts[e.id][i]} aria-label="Menos">
                      <MinusIcon />
                    </button>
                    <span className="stepper-value">{e.hidden ? <LockSimpleIcon aria-label="Oculto" /> : live.counts[e.id][i]}</span>
                    <button type="button" onClick={() => actions.log(play.id, { k: 'ev', s: i, e: e.id, n: 1 })} aria-label="Más">
                      <PlusIcon />
                    </button>
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {counts.some((e) => e.hidden) && (
        <p className="hint">
          <LockSimpleIcon className="inline-icon" /> Lo oculto no se muestra hasta el final, para no revelar estrategias.
        </p>
      )}
      <LogList play={play} game={game} players={players} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Fin de partida: puestos, puntajes, roles y datos finales.

function FinishForm({ play, game, live, players, onCancel }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player>; onCancel?: () => void }) {
  const data = useData()
  // En eliminación directa alguien tiene que pasar de ronda: no hay empate.
  const knockout = !!play.cupId && data.cups.find((c) => c.id === play.cupId)?.format === 'knockout'
  const n = play.sides.length
  const coop = game.mode === 'coop'
  const hasLiveScore = game.mode === 'counter' || game.mode === 'rounds' || game.mode === 'turns'
  const askScores = coop ? game.scoring.maxScore !== undefined || !!game.scoring.finalScores : hasLiveScore || !!game.scoring.finalScores
  const initialScores = (): (number | null)[] => {
    if (game.mode === 'turns') return live.scores.map((s, i) => s + live.hiddenScores[i])
    if (hasLiveScore) return [...live.scores]
    return new Array(coop ? 1 : n).fill(null)
  }
  const [scores, setScores] = useState<(number | null)[]>(initialScores)
  const [coopWin, setCoopWin] = useState<boolean | null>(null)
  // Orden de llegada elegido a mano (índices de lado). Si hay puntajes, se calcula solo.
  const [order, setOrder] = useState<number[]>([])
  const [roleOf, setRoleOf] = useState<Record<Id, string>>({})
  const [winnerRole, setWinnerRole] = useState<string | null>(null)
  const [stats, setStats] = useState<Record<string, (number | string | null)[]>>(() =>
    Object.fromEntries(game.stats.map((s) => [s.id, new Array(coop ? 1 : n).fill(null)])),
  )
  const roles = game.roles
  const lowWins = !!game.scoring.lowWins
  const allPlayers = play.sides.flatMap((s) => s.players)

  const scoresComplete = askScores && !coop && scores.every((s) => s !== null)
  const autoPlaces = scoresComplete ? placesFromScores(scores as number[], lowWins) : undefined
  const tieAtTop = autoPlaces ? autoPlaces.filter((p) => p === 1).length > 1 : false
  const [tieBreak, setTieBreak] = useState<number | null>(null)
  const [draw, setDraw] = useState(false)

  const manualPlaces = (): number[] | undefined => {
    if (draw) return new Array(n).fill(1)
    if (n === 2) return order.length ? (order[0] === 0 ? [1, 2] : [2, 1]) : undefined
    if (order.length < n - 1) return undefined
    const rest = play.sides.map((_, i) => i).filter((i) => !order.includes(i))
    const full = [...order, ...rest]
    return play.sides.map((_, i) => full.indexOf(i) + 1)
  }

  let places: number[] | undefined
  if (roles) places = undefined
  else if (coop) places = coopWin === null ? undefined : [coopWin ? 1 : 2]
  else if (autoPlaces) {
    places = autoPlaces
    if (tieAtTop && tieBreak !== null && !draw) places = autoPlaces.map((p, i) => (p === 1 && i !== tieBreak ? 2 : p === 1 ? 1 : p + 1))
    if (draw) places = autoPlaces.map((p) => (p === 1 ? 1 : p))
  } else places = manualPlaces()

  const rolesReady = !roles || (winnerRole !== null && allPlayers.every((id) => roleOf[id]) && new Set(Object.values(roleOf)).size >= 1)
  const ready = roles ? rolesReady : !!places && (!tieAtTop || tieBreak !== null || (!knockout && (draw || game.scoring.allowDraw === true)))

  const finish = () => {
    if (!ready) return
    vibrate(40)
    if (roles) {
      // Los lados se rearman por rol: un lado por cada rol que se jugó.
      const used = roles.filter((r) => allPlayers.some((id) => roleOf[id] === r))
      const sides = used.map((r) => ({ players: allPlayers.filter((id) => roleOf[id] === r), name: r, role: r }))
      const result: PlayResult = { places: used.map((r) => (r === winnerRole ? 1 : 2)) }
      if (game.stats.length) result.stats = stats
      actions.patchPlay(play.id, { sides })
      actions.finishPlay(play.id, result)
      return
    }
    const result: PlayResult = { places: places! }
    if (coop) result.coopWin = !!coopWin
    if (askScores) result.scores = scores
    if (game.stats.length && Object.values(stats).some((arr) => arr.some((v) => v !== null && v !== ''))) result.stats = stats
    actions.finishPlay(play.id, result)
  }

  const toggleOrder = (i: number) => {
    setDraw(false)
    setOrder((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  }
  const sidesForStats = coop ? [{ players: allPlayers, name: 'El equipo' }] : play.sides

  return (
    <div className="finish-form">
      {coop && (
        <section className="card">
          <h2>¿Cómo les fue?</h2>
          <div className="segmented">
            <button className={coopWin === true ? 'active' : ''} onClick={() => setCoopWin(true)}>
              <ConfettiIcon /> ¡Ganamos!
            </button>
            <button className={coopWin === false ? 'active' : ''} onClick={() => setCoopWin(false)}>
              Perdimos
            </button>
          </div>
        </section>
      )}

      {roles && (
        <section className="card">
          <h2>¿Quién era quién?</h2>
          {allPlayers.map((id) => (
            <div key={id} className="row-between role-row">
              <span>
                {players.get(id)?.emoji} {players.get(id)?.name}
              </span>
              <div className="chips">
                {roles.map((r) => (
                  <button key={r} className={'chip' + (roleOf[id] === r ? ' active' : '')} onClick={() => setRoleOf({ ...roleOf, [id]: r })}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <h3 className="mt">¿Quién ganó?</h3>
          <div className="chips">
            {roles.map((r) => (
              <button key={r} className={'chip' + (winnerRole === r ? ' active' : '')} onClick={() => setWinnerRole(r)}>
                {r === roles[0] ? '🕵️' : '👥'} {r === roles[0] ? `Ganó ${r.toLowerCase()}` : `Ganaron los ${r.toLowerCase()}s`}
              </button>
            ))}
          </div>
        </section>
      )}

      {askScores && (
        <section className="card">
          <h2>{coop ? 'Puntaje del equipo' : `Puntaje final${game.scoring.pointsName ? ` (${game.scoring.pointsName})` : ''}`}</h2>
          {game.mode === 'turns' && <p className="hint">Ya sumamos lo que se vio en la partida y lo oculto. Corregí si hace falta.</p>}
          {(coop ? [{ players: allPlayers }] : play.sides).map((side, i) => (
            <div key={i} className="row-between score-row">
              <span className="ellipsis">{coop ? 'Todos' : sideName(side, players)}</span>
              <input
                className="input score-input"
                type="number"
                inputMode="numeric"
                value={scores[i] ?? ''}
                placeholder={game.scoring.maxScore ? `de ${game.scoring.maxScore}` : '0'}
                onChange={(e) => setScores(scores.map((v, k) => (k === i ? (e.target.value === '' ? null : Number(e.target.value)) : v)))}
              />
            </div>
          ))}
          {tieAtTop && (
            <div className="mt">
              <p className="hint">Hay empate arriba. ¿Quién ganó el desempate?</p>
              <div className="chips">
                {autoPlaces!.map((p, i) =>
                  p === 1 ? (
                    <button key={i} className={'chip' + (tieBreak === i && !draw ? ' active' : '')} onClick={() => (setTieBreak(i), setDraw(false))}>
                      {sideName(play.sides[i], players)}
                    </button>
                  ) : null,
                )}
                {game.scoring.allowDraw !== false && !knockout && (
                  <button className={'chip' + (draw ? ' active' : '')} onClick={() => setDraw(true)}>
                    Quedó empate
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {!coop && !roles && !autoPlaces && (
        <section className="card">
          <h2>{n === 2 ? '¿Quién ganó?' : '¿Cómo terminaron?'}</h2>
          {n > 2 && <p className="hint">Tocalos en orden de llegada: primero el ganador.</p>}
          <div className="list">
            {play.sides.map((side, i) => {
              const pos = order.indexOf(i)
              return (
                <button key={i} className={'pick-row' + (pos >= 0 ? ' active' : '')} onClick={() => (n === 2 ? (setOrder([i]), setDraw(false)) : toggleOrder(i))}>
                  <span className="pick-pos">{pos >= 0 ? (n === 2 ? '🏆' : `${pos + 1}°`) : ''}</span>
                  <TeamAvatar team={sidePlayersOf(side, players)} size={30} />
                  <span className="grow ellipsis">{sideName(side, players)}</span>
                </button>
              )
            })}
          </div>
          {(game.scoring.allowDraw || n === 2) && !knockout && (
            <button className={'chip mt' + (draw ? ' active' : '')} onClick={() => (setDraw(!draw), setOrder([]))}>
              Empate
            </button>
          )}
        </section>
      )}

      {game.stats.length > 0 && (
        <section className="card">
          <h2>Datos para los premios</h2>
          {game.stats.map((st) => (
            <div key={st.id} className="field">
              <label>{st.label}</label>
              {st.help && <span className="hint">{st.help}</span>}
              {sidesForStats.map((side, i) => (
                <div key={i} className="row-between score-row">
                  <span className="ellipsis">{coop ? 'Equipo' : sideName(side, players)}</span>
                  {st.type === 'choice' ? (
                    <select
                      className="input"
                      value={(stats[st.id][i] as string) ?? ''}
                      onChange={(e) => setStats({ ...stats, [st.id]: stats[st.id].map((v, k) => (k === i ? e.target.value || null : v)) })}
                    >
                      <option value="">—</option>
                      {st.choices?.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input score-input"
                      type="number"
                      inputMode="numeric"
                      value={(stats[st.id][i] as number) ?? ''}
                      onChange={(e) => setStats({ ...stats, [st.id]: stats[st.id].map((v, k) => (k === i ? (e.target.value === '' ? null : Number(e.target.value)) : v)) })}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      <div className="sticky-actions row">
        {onCancel && (
          <button className="btn" onClick={onCancel}>
            Seguir jugando
          </button>
        )}
        <button className="btn primary big grow" disabled={!ready} onClick={finish}>
          <FlagCheckeredIcon /> Guardar resultado
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Resumen

function Summary({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const data = useData()
  const navigate = useNavigate()
  const order = sidesByPlace(play)
  const draw = isDraw(play)
  const coop = play.result?.coopWin

  // Medallas que se ganaron con esta partida: comparamos el historial con y sin ella.
  const ups = useMemo(() => {
    const before = computeBoard({ ...data, plays: data.plays.filter((p) => p.id !== play.id) }, { gameId: game.id })
    const after = computeBoard(data, { gameId: game.id })
    const out: { player: Player; medal: MedalProgress }[] = []
    for (const id of play.sides.flatMap((s) => s.players)) {
      const p = players.get(id)
      if (!p) continue
      const b = gameMedals(game, gameStatsOf(before, id, game.id))
      const a = gameMedals(game, gameStatsOf(after, id, game.id))
      for (const m of levelUps(b, a)) out.push({ player: p, medal: m })
    }
    return out
  }, [data, play, game, players])
  const [shownUp, setShownUp] = useState<number | null>(null)
  const shown = shownUp !== null ? ups[shownUp] : undefined
  const fresh = useMemo(() => ups.map(({ player, medal }) => ({ who: player.name, family: medal.family, level: medal.level, value: medal.value })), [ups])

  const eventSummary = game.events
    .map((e) => {
      const per = e.type === 'holder' ? play.sides.map((_, i) => (live.holders[e.id] === i ? 1 : 0)) : (live.counts[e.id] ?? [])
      return { e, per }
    })
    .filter((x) => x.per.some((v) => v > 0))

  const rematch = () => {
    const p = actions.createPlay(game.id, play.sides.map((s) => ({ players: s.players, ...(s.name && !s.role ? { name: s.name } : {}) })), play.config)
    navigate(`/partida/${p.id}`, { replace: true })
  }

  return (
    <div className="summary">
      <div className="card summary-hero">
        {coop !== undefined ? (
          <h2>{coop ? '🎉 ¡Ganaron todos!' : '😵 Ganó el juego'}</h2>
        ) : draw ? (
          <h2>🤝 Empate</h2>
        ) : (
          <h2>🏆 {sideName(play.sides[order[0]], players)}</h2>
        )}
        <ol className="standings-list">
          {order.map((i) => (
            <li key={i} className={play.result?.places[i] === 1 && !draw && coop === undefined ? 'first' : ''}>
              <span className="pick-pos">{coop !== undefined ? '' : `${play.result?.places[i]}°`}</span>
              <TeamAvatar team={sidePlayersOf(play.sides[i], players)} size={30} />
              <span className="grow ellipsis">
                {sideName(play.sides[i], players)}
              </span>
              {play.result?.scores?.[i] !== undefined && play.result.scores[i] !== null && <b>{play.result.scores[i]}</b>}
            </li>
          ))}
        </ol>
      </div>

      <MedalCelebration id={play.id} finishedAt={play.finishedAt} medals={fresh} />
      {ups.length > 0 && (
        <section className="card new-achievements">
          <h3>
            <ConfettiIcon className="inline-icon" /> ¡Medallas nuevas!
          </h3>
          {ups.map(({ player, medal }, k) => (
            <button key={k} type="button" className="medal-up" aria-haspopup="dialog" onClick={() => setShownUp(k)}>
              <Medal family={medal.family} level={medal.level} size={56} />
              <div>
                <b>{medal.family.levels[medal.level].name}</b>
                <span className="muted small block">
                  {player.name} · {medal.family.name} · {TIERS[medal.level].name}
                </span>
                <span className="small">{medal.family.levels[medal.level].description}</span>
              </div>
            </button>
          ))}
          {shown && (
            <MedalSheet
              family={shown.medal.family}
              level={shown.medal.level}
              mine={{ name: shown.player.name, value: shown.medal.value, level: shown.medal.level }}
              onClose={() => setShownUp(null)}
            />
          )}
        </section>
      )}

      {eventSummary.length > 0 && (
        <section className="card">
          <h3>Lo que pasó</h3>
          <div className="table-wrap">
            <table className="rounds-table">
              <thead>
                <tr>
                  <th />
                  {play.sides.map((s, i) => (
                    <th key={i}>{sidePlayersOf(s, players)[0]?.emoji}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventSummary.map(({ e, per }) => (
                  <tr key={e.id}>
                    <td className="small">
                      {e.emoji} {e.name}
                    </td>
                    {play.sides.map((_, i) => (
                      <td key={i}>{e.type === 'holder' ? (per[i] ? '✔' : '') : per[i] || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="row">
        {!play.cupId && (
          <button className="btn primary grow" onClick={rematch}>
            <ArrowsClockwiseIcon /> Revancha
          </button>
        )}
        <button className="btn grow" onClick={() => actions.reopenPlay(play.id)}>
          Corregir
        </button>
      </div>
      {play.cupId ? (
        <Link to={`/torneos/${play.cupId}`} className="btn block mt">
          Volver al torneo
        </Link>
      ) : (
        <Link to={`/juegos/${game.id}`} className="btn block mt">
          Ver {game.name}
        </Link>
      )}
      {!play.cupId && (
        <button
          className="link-btn danger-text small center-block"
          onClick={() => {
            if (confirm('¿Borrar esta partida del historial?')) {
              actions.deletePlay(play.id)
              navigate('/')
            }
          }}
        >
          <TrashIcon /> Borrar partida
        </button>
      )}
    </div>
  )
}
