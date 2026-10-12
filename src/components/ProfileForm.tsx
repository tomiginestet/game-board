import { useId, useState } from 'react'
import { Avatar } from './Avatar'
import { ErrorText } from './Feedback'
import { ColorPicker, EmojiPicker } from './PlayerForm'
import { PLAYER_COLORS, PLAYER_EMOJIS } from '../lib/store'
import { saveProfile, suggestUsername, type Profile } from '../lib/social'
import { friendlyError } from '../lib/text'

/** Tu nombre, usuario (para que te encuentren), emoji y color. */
export function ProfileForm({ initial, email, submitLabel, onSaved }: { initial?: Profile | null; email?: string; submitLabel: string; onSaved?: () => void }) {
  const userId = useId()
  const userErrorId = useId()
  const [name, setName] = useState(initial?.display_name ?? '')
  const [username, setUsername] = useState(initial?.username ?? (email ? suggestUsername(email) : ''))
  const [touchedUser, setTouchedUser] = useState(!!initial?.username)
  const [emoji, setEmoji] = useState(() => initial?.emoji ?? PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)])
  const [color, setColor] = useState(() => initial?.color ?? PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const validUser = /^[a-z0-9_.]{3,20}$/.test(username)
  const userInvalid = !validUser && username.length > 0

  return (
    <form
      className="card player-form"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!name.trim() || !validUser) return
        setBusy(true)
        setError('')
        try {
          await saveProfile({ username, display_name: name.trim(), emoji, color })
          onSaved?.()
        } catch (err) {
          setError(friendlyError(err))
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="player-form-top">
        <Avatar player={{ id: '', name, emoji, color, createdAt: 0 }} size={56} />
        <label className="field grow">
          <span className="field-label">Tu nombre (como te dicen)</span>
          <input
            className="input"
            placeholder="Juli"
            value={name}
            maxLength={40}
            onChange={(e) => {
              setName(e.target.value)
              if (!touchedUser && e.target.value.trim().length >= 3) setUsername(suggestUsername(e.target.value))
            }}
          />
        </label>
      </div>
      <div className="field">
        <label htmlFor={userId} className="field-label">
          Usuario (así te encuentran tus amigos)
        </label>
        <div className="username-input">
          <span className="muted" aria-hidden>
            @
          </span>
          <input
            id={userId}
            className="input"
            value={username}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={userInvalid || undefined}
            aria-describedby={userInvalid ? userErrorId : undefined}
            onChange={(e) => {
              setTouchedUser(true)
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))
            }}
          />
        </div>
        {userInvalid && (
          <p id={userErrorId} className="error small">
            Usá de 3 a 20 letras, números, puntos o guiones bajos.
          </p>
        )}
      </div>
      <EmojiPicker value={emoji} onChange={setEmoji} />
      <ColorPicker value={color} onChange={setColor} />
      <ErrorText>{error}</ErrorText>
      <button className="btn primary block" type="submit" disabled={busy || !name.trim() || !validUser}>
        {busy ? 'Guardando…' : submitLabel}
      </button>
    </form>
  )
}
