import { CheckIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { useId, useRef, useState } from 'react'
import { sideName } from '../../components/GameBits'
import { statsFilled } from '../../lib/finish'
import type { GameDef, StatDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, PlayResult, Player } from '../../lib/types'

type StatValues = Record<string, (number | string | null)[]>

/**
 * "Para las medallas": los datos que la partida no anotó sola (recurso estrella, curas descubiertas…).
 * Vive en el resumen, después de "Revancha": no frena el cierre. Si ya se cargaron, se muestran
 * resumidos con "Editar".
 */
export function MedalDataCard({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const coop = play.result?.coopWin !== undefined || game.mode === 'coop'
  const rows = coop ? [{ label: 'Equipo' }] : play.sides.map((s) => ({ label: sideName(s, players) }))
  const filled = statsFilled(play)
  const [editing, setEditing] = useState(!filled)
  const [saved, setSaved] = useState(false)
  const [values, setValues] = useState<StatValues>(() => initialValues(game.stats, play.result?.stats, rows.length))
  const editRef = useRef<HTMLButtonElement>(null)
  const firstRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  if (!game.stats.length || !play.result) return null

  const set = (st: StatDef, i: number, v: number | string | null) => {
    setSaved(false)
    setValues((cur) => ({ ...cur, [st.id]: cur[st.id].map((x, k) => (k === i ? v : x)) }))
  }

  const save = () => {
    const result: PlayResult = { ...play.result!, stats: values }
    const any = Object.values(values).some((arr) => arr.some((v) => v !== null && v !== ''))
    if (!any) delete result.stats
    actions.patchPlay(play.id, { result })
    setSaved(true)
    if (any) {
      setEditing(false)
      // El formulario se cierra: el foco pasa a "Editar" para no quedar perdido.
      requestAnimationFrame(() => editRef.current?.focus())
    }
  }

  const startEdit = () => {
    setSaved(false)
    setEditing(true)
    requestAnimationFrame(() => firstRef.current?.focus())
  }

  return (
    <section className="card medal-data" aria-labelledby={titleId}>
      <div className="row-between medal-data-head">
        <h2 id={titleId} className="summary-subtitle">
          Para las medallas
        </h2>
        {/* Siempre en la página (vacío hasta guardar) para que el aviso se lea al aparecer. */}
        <p className="medal-data-status" role="status">
          {saved && (
            <>
              <CheckIcon weight="bold" aria-hidden="true" /> Guardado
            </>
          )}
        </p>
        {!editing && (
          <button ref={editRef} type="button" className="btn small" onClick={startEdit}>
            <PencilSimpleIcon aria-hidden="true" /> Editar
          </button>
        )}
      </div>

      {editing ? (
        <>
          {!filled && <p className="hint">Opcional. Suma para algunas medallas de {game.name}.</p>}
          {game.stats.map((st, s) => (
            <fieldset key={st.id} className="medal-data-stat">
              <legend>{st.label}</legend>
              {st.help && <p className="hint">{st.help}</p>}
              {rows.map((row, i) => {
                const label = `${st.label}: ${row.label}`
                const ref = s === 0 && i === 0 ? (el: HTMLElement | null) => void (firstRef.current = el) : undefined
                return (
                  <div key={i} className="row-between medal-data-row">
                    <span className="medal-data-name">{row.label}</span>
                    {st.type === 'choice' ? (
                      <select ref={ref} className="input" aria-label={label} value={(values[st.id][i] as string) ?? ''} onChange={(e) => set(st, i, e.target.value || null)}>
                        <option value="">—</option>
                        {st.choices?.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        ref={ref}
                        className="input medal-data-num num"
                        type="number"
                        inputMode="numeric"
                        aria-label={label}
                        value={(values[st.id][i] as number) ?? ''}
                        onChange={(e) => set(st, i, e.target.value === '' ? null : Number(e.target.value))}
                      />
                    )}
                  </div>
                )
              })}
            </fieldset>
          ))}
          <button type="button" className="btn medal-data-save" onClick={save}>
            <CheckIcon aria-hidden="true" /> Guardar datos
          </button>
        </>
      ) : (
        <dl className="medal-data-list">
          {game.stats.map((st) => {
            const shown = rows.map((row, i) => ({ row, v: values[st.id][i] })).filter((x) => x.v !== null && x.v !== '')
            return (
              <div key={st.id}>
                <dt>{st.label}</dt>
                <dd>{shown.length ? shown.map((x) => (coop ? String(x.v) : `${x.row.label}: ${x.v}`)).join(' · ') : '—'}</dd>
              </div>
            )
          })}
        </dl>
      )}

    </section>
  )
}

function initialValues(stats: StatDef[], saved: StatValues | undefined, n: number): StatValues {
  return Object.fromEntries(stats.map((s) => [s.id, Array.from({ length: n }, (_, i) => saved?.[s.id]?.[i] ?? null)]))
}
