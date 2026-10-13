import { CheckIcon, CrownIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { roundScore, roundsOf, targetOf, type LiveState } from '../../lib/engine'
import { planillaOf } from '../../lib/games/planilla'
import { vibrate } from '../../lib/vibrate'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { PlanillaBoard } from './PlanillaBoard'
import { PointsDialog } from './shared'
import '../../styles/rounds.css'

export function RoundsBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const planilla = planillaOf(game)
  if (planilla) return <PlanillaBoard play={play} game={game} def={planilla} live={live} players={players} />
  return <ManosBoard play={play} game={game} live={live} players={players} />
}

/** "Mano 4 de 10" (o "Mano 4" si no hay cantidad fija). */
function manoTitle(game: GameDef, play: Play, index: number): string {
  const total = roundsOf(game, play.config)
  return total ? `Mano ${Math.min(index + 1, total)} de ${total}` : `Mano ${index + 1}`
}

function ManosBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const [entering, setEntering] = useState(false)
  const rounds = play.log.filter((e) => e.k === 'round')
  const labels = game.scoring.roundLabels
  const target = targetOf(game, play.config)
  const lowWins = !!game.scoring.lowWins
  const alive = live.scores.filter((_, i) => !live.eliminated[i])
  const best = alive.length ? (lowWins ? Math.min(...alive) : Math.max(...alive)) : undefined
  const leaders = live.scores.filter((v, i) => v === best && !live.eliminated[i]).length
  // Si están todos iguales no hay nadie primero.
  const showLead = leaders < alive.length
  const next = labels?.[rounds.length]

  return (
    <>
      <div className="manos-head">
        <h2 className="num">{manoTitle(game, play, rounds.length)}</h2>
        {next && <p className="muted small">{next}</p>}
      </div>
      {rounds.length > 0 && (
        // Enfocable: con muchos jugadores la tabla se desplaza de costado (también con el teclado).
        <div className="table-wrap" role="region" aria-label="Puntos de cada mano" tabIndex={0}>
          <table className="rounds-table manos-table" style={{ ['--n' as string]: play.sides.length }}>
            <caption className="sr-only">Puntos de cada mano</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Mano</span>
                </th>
                {play.sides.map((s, i) => (
                  <th key={i} scope="col" style={{ color: sideColor(s, players) }} className={live.eliminated[i] ? 'out' : ''}>
                    <TeamAvatar team={sidePlayersOf(s, players)} size={24} />
                    <span className="ellipsis block">{sideName(s, players)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rounds.map((r, k) => (
                <tr key={k}>
                  <th scope="row" className="muted small">
                    {labels?.[k] ?? `Mano ${k + 1}`}
                  </th>
                  {r.sc.map((v, i) => (
                    <td key={i} className={'num' + (v < 0 ? ' loss-text' : '')}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                {live.scores.map((v, i) => {
                  const lead = showLead && v === best && !live.eliminated[i]
                  return (
                    <td key={i} className={lead ? 'lead' : ''}>
                      <b className="num">{v}</b>
                      {lead && (
                        <span className="pl-lead">
                          <CrownIcon aria-hidden weight="fill" /> {leaders > 1 ? 'empatado' : 'primero'}
                        </span>
                      )}
                      {target && !lowWins && <span className="muted small block num">faltan {Math.max(0, target - v)}</span>}
                      {live.eliminated[i] && <span className="loss-text small block">afuera</span>}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {entering ? (
        <RoundForm play={play} game={game} live={live} players={players} onDone={() => setEntering(false)} />
      ) : (
        <button className="btn primary big block" onClick={() => setEntering(true)}>
          <PlusIcon /> Cargar mano {rounds.length + 1}
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
  const formId = useId()

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

  const setAt = (arr: (number | null)[], i: number, v: number | null) => arr.map((x, k) => (k === i ? v : x))

  const numberInput = (arr: (number | null)[], set: (a: (number | null)[]) => void, i: number, label: string, signed = false) => (
    <div className="mini-field">
      <label htmlFor={`${formId}-${label}-${i}`}>{label}</label>
      <div className="mini-input">
        <input
          id={`${formId}-${label}-${i}`}
          className="input num"
          type="text"
          inputMode="numeric"
          pattern={signed ? '-?[0-9]*' : '[0-9]*'}
          autoComplete="off"
          value={arr[i] ?? ''}
          onChange={(e) => {
            const text = e.target.value.trim()
            if (text === '' || text === '-') return set(setAt(arr, i, null))
            const v = Number(text)
            if (Number.isFinite(v)) set(setAt(arr, i, signed ? Math.trunc(v) : Math.max(0, Math.trunc(v))))
          }}
        />
        {signed && (
          <button
            type="button"
            className="btn sign-btn"
            aria-label={`Cambiar el signo de ${label.toLowerCase()} (${sideName(play.sides[i], players)})`}
            onClick={() => set(setAt(arr, i, -(arr[i] ?? 0) || null))}
          >
            ±
          </button>
        )}
      </div>
    </div>
  )

  // Los eventos que mueven el puntaje (o ganan la partida) van a la vista; los que son sólo para las medallas, en "Más".
  const mainEvents = events.filter((e) => e.points || e.askPoints || e.winsGame)
  const moreEvents = events.filter((e) => !(e.points || e.askPoints || e.winsGame))

  const eventRow = (e: EventDef, i: number) => {
    const who = sideName(play.sides[i], players)
    return (
      <li key={e.id} className="rf-ev">
        <span className="rf-ev-name">
          <span aria-hidden>{e.emoji}</span> {e.name}
          {e.points && !e.askPoints ? <span className="muted small num"> {e.points > 0 ? `+${e.points}` : e.points}</span> : null}
          {e.winsGame ? <span className="muted small"> gana la partida</span> : null}
        </span>
        <span className="stepper">
          <button type="button" onClick={() => bump(e, i, -1)} disabled={!ev[e.id][i]} aria-label={`Restar uno a ${e.name} (${who})`}>
            <MinusIcon />
          </button>
          <span className="stepper-value num">{ev[e.id][i]}</span>
          <button type="button" onClick={() => bump(e, i, 1)} aria-label={`Sumar uno a ${e.name} (${who})`}>
            <PlusIcon />
          </button>
        </span>
      </li>
    )
  }

  return (
    <section className="card round-form" aria-label={`Cargar ${manoTitle(game, play, roundIndex).toLowerCase()}`}>
      {asking && <PointsDialog event={asking.e} onCancel={() => setAsking(null)} onSubmit={(p) => addAsked(asking.e, asking.i, p)} />}
      {play.sides.map((side, i) =>
        !active[i] ? null : (
          <div key={i} className="rf-side" style={{ ['--pc' as string]: sideColor(side, players) }}>
            <div className="rf-head">
              <TeamAvatar team={sidePlayersOf(side, players)} size={26} />
              <b className="grow ellipsis">{sideName(side, players)}</b>
              <span className={'rf-total num' + (scores[i] < 0 ? ' loss-text' : '')} aria-label={`Total de la mano: ${scores[i]}`}>
                {scores[i] > 0 ? `+${scores[i]}` : scores[i]}
              </span>
            </div>
            <div className="rf-inputs">
              {scorer === 'sum' ? (
                numberInput(value, setValue, i, events.some((e) => e.points) ? 'Puntos de cartas' : 'Puntos', true)
              ) : (
                <>
                  {numberInput(bid, setBid, i, 'Apostó')}
                  {numberInput(tricks, setTricks, i, 'Hizo')}
                </>
              )}
            </div>
            {mainEvents.length > 0 && <ul className="rf-evs">{mainEvents.map((e) => eventRow(e, i))}</ul>}
            {moreEvents.length > 0 && (
              <details className="rf-more" open={moreEvents.some((e) => ev[e.id][i] > 0) || undefined}>
                <summary>
                  Más <span className="muted small">({moreEvents.map((e) => e.name.toLowerCase()).join(', ')})</span>
                </summary>
                <ul className="rf-evs">{moreEvents.map((e) => eventRow(e, i))}</ul>
              </details>
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
          <CheckIcon /> Guardar mano {roundIndex + 1}
        </button>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Por turnos
