import { CheckIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { roundScore, targetOf, type LiveState } from '../../lib/engine'
import { vibrate } from '../../lib/vibrate'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { PointsDialog } from './shared'

export function RoundsBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
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

export function RoundForm({ play, game, live, players, onDone }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player>; onDone: () => void }) {
  const n = play.sides.length
  const scorer = game.scoring.scorer ?? 'sum'
  const roundIndex = live.roundsPlayed
  const [value, setValue] = useState<(number | null)[]>(() => new Array(n).fill(null))
  const [bid, setBid] = useState<(number | null)[]>(() => new Array(n).fill(0))
  const [tricks, setTricks] = useState<(number | null)[]>(() => new Array(n).fill(0))
  const events = game.events.filter((e) => !e.global)
  const [ev, setEv] = useState<Record<string, number[]>>(() => Object.fromEntries(events.map((e) => [e.id, new Array(n).fill(0)])))
  const [asked, setAsked] = useState<Record<string, number>[]>(() => Array.from({ length: n }, () => ({})))
  const [asking, setAsking] = useState<{ e: EventDef; i: number } | null>(null)

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
    // Los que valen lo que se diga en el momento piden los puntos antes de sumar.
    if (e.askPoints && d > 0) return setAsking({ e, i })
    const next = Math.max(0, ev[e.id][i] + d)
    if (e.askPoints && d < 0 && next === 0) setAsked(asked.map((a, k) => (k === i ? { ...a, [e.id]: 0 } : a)))
    setEv({ ...ev, [e.id]: ev[e.id].map((v, k) => (k === i ? next : v)) })
  }

  const addAsked = (e: EventDef, i: number, p: number) => {
    setAsked(asked.map((a, k) => (k === i ? { ...a, [e.id]: (a[e.id] ?? 0) + p } : a)))
    setEv({ ...ev, [e.id]: ev[e.id].map((v, k) => (k === i ? v + 1 : v)) })
    setAsking(null)
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
      {asking && <PointsDialog event={asking.e} onCancel={() => setAsking(null)} onSubmit={(p) => addAsked(asking.e, asking.i, p)} />}
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
                      <button type="button" onClick={() => bump(e, i, -1)} disabled={!ev[e.id][i]} aria-label={`Restar uno a ${e.name} (${sideName(side, players)})`}>
                        <MinusIcon />
                      </button>
                      <span className="stepper-value">{ev[e.id][i]}</span>
                      <button type="button" onClick={() => bump(e, i, 1)} aria-label={`Sumar uno a ${e.name} (${sideName(side, players)})`}>
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
