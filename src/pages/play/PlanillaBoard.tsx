import { CrownIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { ErrorText } from '../../components/Feedback'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import type { LiveState } from '../../lib/engine'
import { useModal } from '../../lib/feedback'
import { correctCell, planillaGrid, planillaRound, type PlanillaDef, planillaDraftKey, type PlanillaPick } from '../../lib/games/planilla'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'
import { vibrate } from '../../lib/vibrate'
import { MiniScore } from './MiniScore'
import '../../styles/rounds.css'

// Lo anotado en la mano que todavía no se guardó (falta que anoten otros) vive
// en este dispositivo, para no perderlo si se cierra la pantalla.
const draftKey = (playId: Id) => planillaDraftKey(playId)

function readDraft(playId: Id, n: number): (PlanillaPick | null)[] {
  try {
    const raw = JSON.parse(localStorage.getItem(draftKey(playId)) ?? 'null')
    if (Array.isArray(raw) && raw.length === n) return raw.map((p) => (p && typeof p.cell === 'number' && typeof p.value === 'number' ? (p as PlanillaPick) : null))
  } catch {
    // Sin almacenamiento: la mano en curso queda sólo en memoria.
  }
  return new Array(n).fill(null)
}

function writeDraft(playId: Id, picks: (PlanillaPick | null)[]) {
  try {
    if (picks.some(Boolean)) localStorage.setItem(draftKey(playId), JSON.stringify(picks))
    else localStorage.removeItem(draftKey(playId))
  } catch {
    // Sin almacenamiento: no pasa nada, sigue en memoria.
  }
}

function listNames(names: string[]): string {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`
}

interface Editing {
  cell: number
  side: number
}

/**
 * Planilla por categorías (generala): cada jugador llena sus casillas en el
 * orden que quiera. Cuando todos anotaron una casilla, se guarda la mano.
 */
export function PlanillaBoard({ play, game, def, live, players }: { play: Play; game: GameDef; def: PlanillaDef; live: LiveState; players: Map<Id, Player> }) {
  const labels = game.scoring.roundLabels ?? []
  const n = play.sides.length
  const grid = useMemo(() => planillaGrid(play.log, labels.length, n), [play.log, labels.length, n])
  const [stored, setStored] = useState(() => readDraft(play.id, n))
  // Si se deshizo o se corrigió algo, lo anotado sin guardar sólo vale si la casilla sigue libre.
  const picks = stored.map((p, i) => (p && grid.value[p.cell]?.[i] === null ? p : null))
  const [editing, setEditing] = useState<Editing | null>(null)

  const totalRounds = labels.length
  const mano = Math.min(live.roundsPlayed + 1, totalRounds)
  const names = play.sides.map((s) => sideName(s, players))
  const pending = names.filter((_, i) => !picks[i])
  const totals = live.scores.map((s, i) => s + (picks[i]?.value ?? 0))
  const anyFilled = live.roundsPlayed > 0 || picks.some(Boolean)
  const best = Math.max(...totals)
  // Si están todos iguales no hay nadie primero.
  const showLead = anyFilled && totals.some((t) => t !== best)

  const keep = (next: (PlanillaPick | null)[]) => {
    setStored(next)
    writeDraft(play.id, next)
  }

  const pick = (side: number, p: PlanillaPick) => {
    setEditing(null)
    const next = picks.map((x, i) => (i === side ? p : x))
    if (p.instantWin || next.every(Boolean)) {
      vibrate(20)
      actions.log(play.id, planillaRound(def, next))
      keep(new Array(n).fill(null))
    } else keep(next)
  }

  const correct = (side: number, cell: number, value: number) => {
    setEditing(null)
    const at = grid.at[cell][side]
    if (at === null) return
    actions.patchPlay(play.id, { log: correctCell(def, play.log, at, side, cell, value) })
  }

  const clear = (side: number) => {
    setEditing(null)
    keep(picks.map((x, i) => (i === side ? null : x)))
  }

  const status =
    pending.length === n
      ? 'Cada uno anota en una casilla libre, en el orden que quiera.'
      : `Falta anotar: ${listNames(pending)}. La mano se guarda cuando anotan todos.`

  const sheet = editing && (() => {
    const { cell, side } = editing
    const saved = grid.value[cell][side]
    const draft = picks[side]
    const isDraft = draft?.cell === cell
    const movesFrom = draft && !isDraft ? labels[draft.cell] : undefined
    return (
      <CellSheet
        label={labels[cell]}
        name={names[side]}
        def={def}
        cell={cell}
        current={saved ?? (isDraft ? draft.value : undefined)}
        saved={saved !== null}
        movesFrom={movesFrom}
        onPick={(value, instantWin) => (saved !== null ? correct(side, cell, value) : pick(side, { cell, value, ...(instantWin ? { instantWin } : {}) }))}
        onClear={isDraft ? () => clear(side) : undefined}
        onCancel={() => setEditing(null)}
      />
    )
  })()

  return (
    <>
      <MiniScore play={play} players={players} totals={totals} />
      <section className="planilla" aria-labelledby={`pl-title-${play.id}`}>
        <div className="planilla-head">
          <h2 id={`pl-title-${play.id}`} className="num">
            Mano {mano} de {totalRounds}
          </h2>
          <p className="muted small" aria-live="polite">
            {status}
          </p>
        </div>
        <div className="table-wrap">
          <table className="planilla-table" style={{ ['--n' as string]: n }}>
            <caption className="sr-only">Planilla de {game.name}: tocá una casilla libre para anotar o una anotada para corregirla.</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Categoría</span>
                </th>
                {play.sides.map((s, i) => (
                  <th key={i} scope="col" style={{ ['--pc' as string]: sideColor(s, players) }}>
                    <TeamAvatar team={sidePlayersOf(s, players)} size={24} />
                    <span className="ellipsis block">{names[i]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, c) => (
                <tr key={c}>
                  <th scope="row">{label}</th>
                  {play.sides.map((_, i) => {
                    const saved = grid.value[c][i]
                    const draft = picks[i]?.cell === c ? picks[i] : null
                    const v = saved ?? draft?.value ?? null
                    const state = saved !== null ? 'saved' : draft ? 'draft' : 'empty'
                    const what = v === 0 ? 'tachada' : `${v} puntos`
                    const aria =
                      state === 'empty'
                        ? `Anotar ${label} a ${names[i]}`
                        : state === 'draft'
                          ? `${label} de ${names[i]}: ${what}, sin guardar. Cambiar`
                          : `${label} de ${names[i]}: ${what}. Corregir`
                    return (
                      <td key={i}>
                        <button
                          type="button"
                          className={`pl-cell is-${state}${state === 'empty' && picks[i] ? ' is-quiet' : ''}`}
                          aria-label={aria}
                          onClick={() => setEditing({ cell: c, side: i })}
                        >
                          {v === null ? <PlusIcon aria-hidden /> : v === 0 ? <XIcon aria-hidden weight="bold" /> : <span className="num">{v}</span>}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                {totals.map((v, i) => {
                  const lead = showLead && v === best
                  return (
                    <td key={i} className={lead ? 'lead' : undefined}>
                      <b className="num">{v}</b>
                      {lead && (
                        <span className="pl-lead">
                          <CrownIcon aria-hidden weight="fill" /> {totals.filter((t) => t === best).length > 1 ? 'empatado' : 'primero'}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          </table>
        </div>
        {picks.some(Boolean) && <p className="hint pl-legend">Borde punteado: anotado en esta mano, falta que anoten los demás.</p>}
        {sheet}
      </section>
    </>
  )
}

function CellSheet({
  label,
  name,
  def,
  cell,
  current,
  saved,
  movesFrom,
  onPick,
  onClear,
  onCancel,
}: {
  label: string
  name: string
  def: PlanillaDef
  cell: number
  current?: number
  saved: boolean
  movesFrom?: string
  onPick: (value: number, instantWin?: boolean) => void
  onClear?: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  const id = useId()
  const info = def.cells[cell]
  const quick = info?.values.includes(current ?? -1) || current === 0 || current === undefined ? '' : String(current)
  const [raw, setRaw] = useState(quick)
  const [error, setError] = useState('')
  const win = !saved ? info?.instantWin : undefined

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = raw.trim()
    const v = Number(text)
    if (!text || !Number.isInteger(v) || v < 0) {
      setError('Escribí un número entero, por ejemplo 12.')
      return
    }
    onPick(v)
  }

  return (
    <dialog
      ref={ref}
      className="confirm-dialog pl-sheet"
      aria-labelledby={`${id}-title`}
      aria-describedby={info?.help ? `${id}-help` : undefined}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="confirm-body">
        <h2 id={`${id}-title`}>
          {saved ? 'Corregir' : 'Anotar'} {label} a {name}
        </h2>
        {info?.help && (
          <p id={`${id}-help`} className="muted">
            {info.help}
          </p>
        )}
        {movesFrom && <p className="pl-note">Ya anotó en {movesFrom} en esta mano: pasa a esta casilla.</p>}
        <div className="pl-values" role="group" aria-label="Puntaje">
          {info?.values.map((v) => (
            <button key={v} type="button" className="btn pl-value num" aria-pressed={current === v} onClick={() => onPick(v)}>
              {v}
            </button>
          ))}
          <button type="button" className="btn pl-value pl-zero" aria-pressed={current === 0} onClick={() => onPick(0)}>
            <XIcon aria-hidden weight="bold" /> Tachar
          </button>
        </div>
        <form className="pl-other" onSubmit={submit} noValidate>
          <label className="field-label" htmlFor={`${id}-input`}>
            Otro puntaje
          </label>
          <div className="pl-other-row">
            <input
              id={`${id}-input`}
              className="input num"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={raw}
              onChange={(e) => {
                setRaw(e.target.value)
                setError('')
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <button type="submit" className="btn">
              Anotar
            </button>
          </div>
          <div id={`${id}-error`}>
            <ErrorText>{error}</ErrorText>
          </div>
        </form>
        {win && (
          <div className="pl-win">
            <button type="button" className="btn block" onClick={() => onPick(win.value, true)}>
              <CrownIcon aria-hidden weight="fill" /> {win.label}
            </button>
            <p className="muted small">{win.help}</p>
          </div>
        )}
        <div className={'pl-actions' + (onClear ? ' two' : '')}>
          {onClear && (
            <button type="button" className="btn" onClick={onClear}>
              Borrar lo anotado
            </button>
          )}
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </dialog>
  )
}
