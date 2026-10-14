import { GiftIcon, PencilSimpleIcon, XIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { STAKE_MAX, stakeTemplates, stakeWhoLabel } from '../lib/stake'
import type { PlayStake } from '../lib/types'
import { ChoiceGroup } from './PlayerPicker'

const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * La prenda de la partida, opcional: un toque a "Jugar por algo" y se elige de las sugeridas
 * (pagar la próxima ronda, lavar los platos) o se escribe otra. Nunca plata.
 */
export function StakePicker({ value, onChange, sides }: { value: PlayStake | undefined; onChange: (v: PlayStake | undefined) => void; sides: number }) {
  const [open, setOpen] = useState(!!value)
  const [who, setWho] = useState<PlayStake['who']>(value?.who ?? 'loser')
  const templates = stakeTemplates(who)
  const [custom, setCustom] = useState(!!value && !templates.some((t) => t.text === value.text))
  const inputId = useId()

  if (!open)
    return (
      <button type="button" className="btn block stake-open" onClick={() => setOpen(true)}>
        <GiftIcon aria-hidden="true" /> Jugar por algo
        <span className="muted small">una ronda, un café, los platos…</span>
      </button>
    )

  const changeWho = (next: PlayStake['who']) => {
    setWho(next)
    // Lo escrito a mano sirve para cualquiera de los dos; una sugerida es de su lista.
    if (value) onChange(custom ? { ...value, who: next } : undefined)
  }
  const close = () => {
    onChange(undefined)
    setCustom(false)
    setOpen(false)
  }

  return (
    <section className="card stake-card">
      <div className="section-head">
        <h2>
          <GiftIcon className="inline-icon" /> ¿Por algo?
        </h2>
        <button type="button" className="icon-btn small" onClick={close} aria-label="Jugar sin prenda">
          <XIcon />
        </button>
      </div>
      <ChoiceGroup
        className="segmented small"
        label="A quién le toca"
        value={who}
        onChange={changeWho}
        options={[
          { value: 'loser', content: stakeWhoLabel('loser', sides) },
          { value: 'winner', content: 'El que gana' },
        ]}
      />
      <div className="chips" role="group" aria-label={who === 'winner' ? 'Lo que se lleva el que gana' : 'Lo que cumple el que pierde'}>
        {templates.map((t) => {
          const on = !custom && value?.text === t.text
          return (
            <button
              key={t.text}
              type="button"
              className={'chip' + (on ? ' active' : '')}
              aria-pressed={on}
              onClick={() => {
                setCustom(false)
                onChange(on ? undefined : { text: t.text, emoji: t.emoji, who })
              }}
            >
              <span aria-hidden="true">{t.emoji}</span> {upper(t.text)}
            </button>
          )
        })}
        <button
          type="button"
          className={'chip' + (custom ? ' active' : '')}
          aria-pressed={custom}
          onClick={() => {
            setCustom(!custom)
            onChange(undefined)
          }}
        >
          <PencilSimpleIcon aria-hidden="true" /> Otra
        </button>
      </div>
      {custom && (
        <div className="field">
          <label htmlFor={inputId}>{stakeWhoLabel(who, sides)} tiene que…</label>
          <input
            id={inputId}
            className="input"
            autoFocus
            placeholder={who === 'winner' ? 'elegir dónde se cena' : 'lavar el auto'}
            maxLength={STAKE_MAX}
            value={value?.text ?? ''}
            onChange={(e) => onChange(e.target.value ? { text: e.target.value, who } : undefined)}
          />
        </div>
      )}
      <p className="hint">Se juega por el honor y algo chico. Al terminar, te decimos a quién le toca.</p>
    </section>
  )
}
