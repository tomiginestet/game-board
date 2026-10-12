import { useId, useState } from 'react'
import { Avatar } from './Avatar'
import { ChoiceGroup } from './PlayerPicker'
import { PLAYER_COLORS, PLAYER_EMOJIS, useData } from '../lib/store'

/** Nombres de los colores de PLAYER_COLORS (mismo orden), para que no se elijan sólo por el color. */
const COLOR_NAMES: Record<string, string> = {
  '#ff5a5f': 'Rojo',
  '#ffb400': 'Amarillo',
  '#00a699': 'Verde agua',
  '#3b82f6': 'Azul',
  '#a855f7': 'Violeta',
  '#ec4899': 'Rosa',
  '#22c55e': 'Verde',
  '#f97316': 'Naranja',
  '#14b8a6': 'Turquesa',
  '#eab308': 'Mostaza',
}

function firstUnused<T>(options: T[], used: T[]): T {
  return options.find((o) => !used.includes(o)) ?? options[used.length % options.length]
}

/** Grilla de emojis con etiqueta visible; elección única. */
export function EmojiPicker({ value, onChange, options = PLAYER_EMOJIS, label = 'Emoji' }: { value: string; onChange: (v: string) => void; options?: string[]; label?: string }) {
  const id = useId()
  return (
    <div className="field">
      <span id={id} className="field-label">
        {label}
      </span>
      <ChoiceGroup className="emoji-grid" itemClassName="emoji-btn" labelledBy={id} value={value} onChange={onChange} options={options.map((em) => ({ value: em, content: em }))} />
    </div>
  )
}

/** Muestras de color con nombre (para lectores de pantalla y como tooltip); elección única. */
export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div className="field">
      <span id={id} className="field-label">
        Color
      </span>
      <ChoiceGroup
        className="color-row"
        itemClassName="color-dot"
        labelledBy={id}
        value={value}
        onChange={onChange}
        options={PLAYER_COLORS.map((c) => ({ value: c, content: null, ariaLabel: COLOR_NAMES[c] ?? 'Color', title: COLOR_NAMES[c], style: { background: c } }))}
      />
    </div>
  )
}

export function PlayerForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: { name: string; emoji: string; color: string }
  submitLabel: string
  onSubmit: (v: { name: string; emoji: string; color: string }) => void
  onCancel?: () => void
}) {
  const data = useData()
  const errorId = useId()
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? firstUnused(PLAYER_EMOJIS, data.players.map((p) => p.emoji)))
  const [color, setColor] = useState(initial?.color ?? firstUnused(PLAYER_COLORS, data.players.map((p) => p.color)))
  const trimmed = name.trim()
  const duplicate = data.players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase() && p.name !== initial?.name)

  return (
    <form
      className="card player-form"
      onSubmit={(e) => {
        e.preventDefault()
        if (!trimmed || duplicate) return
        onSubmit({ name: trimmed, emoji, color })
        if (!initial) {
          // Proponer otro emoji y color para el siguiente jugador.
          setName('')
          setEmoji(firstUnused(PLAYER_EMOJIS, [...data.players.map((p) => p.emoji), emoji]))
          setColor(firstUnused(PLAYER_COLORS, [...data.players.map((p) => p.color), color]))
        }
      }}
    >
      <div className="player-form-top">
        <Avatar player={{ id: '', name, emoji, color, createdAt: 0 }} size={56} />
        <label className="field grow">
          <span className="field-label">Nombre</span>
          <input
            className="input"
            placeholder="Juli"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoFocus={!!initial}
            aria-invalid={duplicate || undefined}
            aria-describedby={duplicate ? errorId : undefined}
          />
        </label>
      </div>
      {duplicate && (
        <p id={errorId} className="error">
          Ya hay un jugador con ese nombre. Probá con otro.
        </p>
      )}
      <EmojiPicker value={emoji} onChange={setEmoji} />
      <ColorPicker value={color} onChange={setColor} />
      <div className="row gap">
        <button className="btn primary" type="submit" disabled={!trimmed || duplicate}>
          {submitLabel}
        </button>
        {onCancel && (
          <button className="btn" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
