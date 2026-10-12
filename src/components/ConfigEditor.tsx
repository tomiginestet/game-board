import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import { useId } from 'react'
import { gamesNeeded, suggestedServeEvery } from '../lib/pingpong/scoring'
import type { MatchConfig } from '../lib/pingpong/types'

const POINT_PRESETS = [2, 4, 5, 7, 11, 21]
const BEST_OF_PRESETS = [1, 3, 5, 7, 10]
const SERVE_PRESETS = [1, 2, 5]

interface Props {
  value: MatchConfig
  onChange: (c: MatchConfig) => void
  /** Eliminación directa: no puede haber empates, así que la cantidad de juegos debe ser impar. */
  oddBestOfOnly?: boolean
}

/** `label` dice qué cambia ("Restar a Jugadores"); sin él, los botones quedan como "Menos"/"Más". */
export function Stepper({ value, min, max, onChange, step = 1, label }: { value: number; min: number; max: number; step?: number; label?: string; onChange: (n: number) => void }) {
  return (
    <span className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min} aria-label={label ? `Restar a ${label}` : 'Menos'}>
        <MinusIcon />
      </button>
      <span className="stepper-value" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max} aria-label={label ? `Sumar a ${label}` : 'Más'}>
        <PlusIcon />
      </button>
    </span>
  )
}

export function ConfigEditor({ value, onChange, oddBestOfOnly }: Props) {
  const id = useId()
  const set = (patch: Partial<MatchConfig>) => onChange({ ...value, ...patch })
  const bestOfPresets = oddBestOfOnly ? BEST_OF_PRESETS.filter((n) => n % 2 === 1) : BEST_OF_PRESETS
  const needed = gamesNeeded(value)

  return (
    <div className="config">
      <div className="field" role="group" aria-labelledby={`${id}-points`}>
        <span id={`${id}-points`} className="field-label">
          Cada juego se gana a
        </span>
        <div className="chips">
          {POINT_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              className={'chip' + (value.pointsToWin === n ? ' active' : '')}
              aria-pressed={value.pointsToWin === n}
              onClick={() => set({ pointsToWin: n, serveEvery: suggestedServeEvery(n) })}
            >
              {n}
            </button>
          ))}
          <Stepper label="Puntos para ganar un juego" value={value.pointsToWin} min={1} max={99} onChange={(n) => set({ pointsToWin: n, serveEvery: suggestedServeEvery(n) })} />
        </div>
      </div>

      <div className="field" role="group" aria-labelledby={`${id}-bestof`} aria-describedby={`${id}-bestof-hint`}>
        <span id={`${id}-bestof`} className="field-label">
          Al mejor de (juegos)
        </span>
        <div className="chips">
          {bestOfPresets.map((n) => (
            <button key={n} type="button" className={'chip' + (value.bestOf === n ? ' active' : '')} aria-pressed={value.bestOf === n} onClick={() => set({ bestOf: n })}>
              {n}
            </button>
          ))}
          <Stepper label="Al mejor de" value={value.bestOf} min={1} max={99} step={oddBestOfOnly ? 2 : 1} onChange={(n) => set({ bestOf: n })} />
        </div>
        <p id={`${id}-bestof-hint`} className="hint">
          {value.bestOf === 1
            ? 'Un solo juego define el partido.'
            : `Gana quien llegue primero a ${needed} juegos.` + (value.bestOf % 2 === 0 ? ` Si quedan ${value.bestOf / 2}-${value.bestOf / 2}, es empate.` : '')}
        </p>
      </div>

      <div className="field row-between">
        <label htmlFor={`${id}-win-by-two`}>Ganar por 2 de diferencia</label>
        <input id={`${id}-win-by-two`} type="checkbox" className="switch" checked={value.winByTwo} onChange={(e) => set({ winByTwo: e.target.checked })} />
      </div>

      <div className="field" role="group" aria-labelledby={`${id}-serve`}>
        <span id={`${id}-serve`} className="field-label">
          Saques por turno
        </span>
        <div className="chips">
          {SERVE_PRESETS.map((n) => (
            <button key={n} type="button" className={'chip' + (value.serveEvery === n ? ' active' : '')} aria-pressed={value.serveEvery === n} onClick={() => set({ serveEvery: n })}>
              {n}
            </button>
          ))}
          <Stepper label="Saques por turno" value={value.serveEvery} min={1} max={20} onChange={(n) => set({ serveEvery: n })} />
        </div>
      </div>
    </div>
  )
}
