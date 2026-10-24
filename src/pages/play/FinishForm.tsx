import { ConfettiIcon, FlagCheckeredIcon, WarningIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideName, sidePlayersOf } from '../../components/GameBits'
import { placesFromScores, type LiveState } from '../../lib/engine'
import { finishShortfall, hasLiveScore as liveScored, liveFinalScores } from '../../lib/finish'
import { vibrate } from '../../lib/vibrate'
import type { GameDef } from '../../lib/games/schema'
import { actions, useData } from '../../lib/store'
import type { Id, Play, PlayResult, Player } from '../../lib/types'
import { parseTime } from '../../lib/score'
import { say } from '../../skins/say'

export function FinishForm({ play, game, live, players, onCancel }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player>; onCancel?: () => void }) {
  const data = useData()
  // Al abrir el cierre desde la partida, se arranca desde arriba y el foco no queda perdido.
  const rootRef = useRef<HTMLDivElement>(null)
  const fromPlay = !!onCancel
  useEffect(() => {
    if (!fromPlay) return
    window.scrollTo({ top: 0 })
    rootRef.current?.focus({ preventScroll: true })
  }, [fromPlay])
  // En eliminación directa alguien tiene que pasar de ronda: no hay empate.
  const knockout = !!play.cupId && data.cups.find((c) => c.id === play.cupId)?.format === 'knockout'
  const n = play.sides.length
  const coop = game.mode === 'coop'
  const hasLiveScore = liveScored(game)
  const askScores = coop ? game.scoring.maxScore !== undefined || !!game.scoring.finalScores : hasLiveScore || !!game.scoring.finalScores
  const initialScores = (): (number | null)[] => {
    if (hasLiveScore) return liveFinalScores(game, live)
    return new Array(coop ? 1 : n).fill(null)
  }
  const [scores, setScores] = useState<(number | null)[]>(initialScores)
  const [coopWin, setCoopWin] = useState<boolean | null>(null)
  // Orden de llegada elegido a mano (índices de lado). Si hay puntajes, se calcula solo.
  const [order, setOrder] = useState<number[]>([])
  const [roleOf, setRoleOf] = useState<Record<Id, string>>({})
  const [winnerRole, setWinnerRole] = useState<string | null>(null)
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
  // Si todavía no se puede guardar, el botón dice qué falta (en vez de quedar gris sin explicación).
  const missing = ready
    ? ''
    : roles
      ? 'Elegí qué bando ganó y el rol de cada uno'
      : coop && coopWin === null
        ? 'Elegí si ganaron o perdieron'
        : !places
          ? 'Ordená los puestos'
          : 'Elegí quién ganó el desempate'

  // La partida se puede cerrar antes de tiempo, pero que sea a propósito: se avisa y el botón lo dice.
  const shortfall = finishShortfall(game, play, live, scores)
  const warning = shortfall && `${shortfall}. ¿Guardar igual?`

  const finish = () => {
    if (!ready) return
    vibrate(40)
    if (roles) {
      // Los lados se rearman por rol: un lado por cada rol que se jugó.
      const used = roles.filter((r) => allPlayers.some((id) => roleOf[id] === r))
      const sides = used.map((r) => ({ players: allPlayers.filter((id) => roleOf[id] === r), name: r, role: r }))
      const result: PlayResult = { places: used.map((r) => (r === winnerRole ? 1 : 2)) }
      actions.patchPlay(play.id, { sides })
      actions.finishPlay(play.id, result)
      return
    }
    const result: PlayResult = { places: places! }
    if (coop) result.coopWin = !!coopWin
    if (askScores) result.scores = scores
    actions.finishPlay(play.id, result)
  }

  const toggleOrder = (i: number) => {
    setDraw(false)
    setOrder((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  }

  return (
    <div className="finish-form" ref={rootRef} tabIndex={-1} role="region" aria-label={say('Cerrar la partida')}>
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
                {r === roles[0] ? '🕵️' : '👥'} Ganó el bando {r.toLowerCase()}
              </button>
            ))}
          </div>
        </section>
      )}

      {askScores && (
        <section className="card">
          <h2>{coop ? 'Puntaje del equipo' : game.scoring.time ? 'Tiempos' : `Puntaje final${game.scoring.pointsName ? ` (${game.scoring.pointsName})` : ''}`}</h2>
          {game.scoring.time && <p className="hint">Como en el reloj: 25:14, o 1:02:05 si pasó la hora. Gana el más rápido.</p>}
          {game.mode === 'turns' && <p className="hint">{say('Ya sumamos lo que se vio en la partida y lo oculto. Corregí si hace falta.')}</p>}
          {(coop ? [{ players: allPlayers }] : play.sides).map((side, i) => (
            <div key={i} className="row-between score-row">
              <span className="ellipsis">{coop ? 'Todos' : sideName(side, players)}</span>
              {game.scoring.time ? (
                <TimeInput label={`Tiempo de ${sideName(side, players)}`} onChange={(v) => setScores(scores.map((x, k) => (k === i ? v : x)))} />
              ) : (
              <input
                className="input score-input"
                type="number"
                inputMode="numeric"
                aria-label={`Puntaje de ${coop ? 'todos' : sideName(side, players)}`}
                value={scores[i] ?? ''}
                placeholder={game.scoring.maxScore ? `de ${game.scoring.maxScore}` : '0'}
                onChange={(e) => setScores(scores.map((v, k) => (k === i ? (e.target.value === '' ? null : Number(e.target.value)) : v)))}
              />
              )}
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

      {/* Los datos para las medallas se piden en el resumen: no frenan el cierre. */}
      <div className="sticky-actions finish-actions">
        {warning && (
          <p className="finish-warning" role="status">
            <WarningIcon weight="fill" aria-hidden="true" /> {warning}
          </p>
        )}
        <div className="finish-buttons">
          {onCancel && (
            <button className="btn big" onClick={onCancel}>
              Seguir jugando
            </button>
          )}
          <button className="btn primary big finish-save" disabled={!ready} onClick={finish}>
            <FlagCheckeredIcon aria-hidden="true" /> {missing || (warning ? 'Guardar igual' : 'Guardar resultado')}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Tiempo como se lee en el reloj ("25:14"); se guarda en segundos. */
function TimeInput({ label, onChange }: { label: string; onChange: (seconds: number | null) => void }) {
  const [text, setText] = useState('')
  const parsed = parseTime(text)
  const bad = text.trim() !== '' && parsed === null
  return (
    <span className="time-input">
      <input
        className="input score-input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="mm:ss"
        aria-label={label}
        aria-invalid={bad || undefined}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onChange(parseTime(e.target.value))
        }}
      />
      {bad && <span className="error small">Escribilo así: 25:14</span>}
    </span>
  )
}
