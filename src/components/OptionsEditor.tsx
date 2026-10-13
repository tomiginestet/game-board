import { useId } from 'react'
import type { GameDef, OptionValue } from '../lib/games/schema'
import { Stepper } from './ConfigEditor'

/** Opciones de una partida según los detalles del juego (a cuánto se juega, con flor, etc.). */
export function OptionsEditor({ game, value, onChange }: { game: GameDef; value: Record<string, OptionValue>; onChange: (v: Record<string, OptionValue>) => void }) {
  const uid = useId()
  if (!game.options.length) return null
  const set = (id: string, v: OptionValue) => onChange({ ...value, [id]: v })
  return (
    <div className="config">
      {game.options.map((o) => {
        const v = value[o.id] ?? o.default
        const id = `${uid}-${o.id}`
        if (o.type === 'boolean')
          return (
            <div key={o.id} className="field row-between">
              <label htmlFor={id}>
                {o.label}
                {o.help && <span className="hint block">{o.help}</span>}
              </label>
              <input id={id} type="checkbox" className="switch" checked={!!v} onChange={(e) => set(o.id, e.target.checked)} />
            </div>
          )
        return (
          <div key={o.id} className="field" role="group" aria-labelledby={`${id}-label`} aria-describedby={o.help ? `${id}-help` : undefined}>
            <span id={`${id}-label`} className="field-label">
              {o.label}
            </span>
            <div className="chips">
              {(o.choices ?? []).map((c) => (
                <button key={String(c.value)} type="button" className={'chip' + (v === c.value ? ' active' : '')} aria-pressed={v === c.value} onClick={() => set(o.id, c.value)}>
                  {c.label}
                </button>
              ))}
              {o.type === 'number' && (
                <Stepper label={o.label} value={Number(v) || 0} min={o.min ?? 0} max={o.max ?? 9999} step={stepFor(Number(v))} onChange={(n) => set(o.id, n)} />
              )}
            </div>
            {o.help && (
              <p id={`${id}-help`} className="hint">
                {o.help}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function stepFor(n: number): number {
  if (n >= 1000) return 100
  if (n >= 100) return 10
  return 1
}
