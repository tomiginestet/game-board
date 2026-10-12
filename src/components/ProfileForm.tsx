import { useState } from 'react'
import { Avatar } from './Avatar'
import { PLAYER_COLORS, PLAYER_EMOJIS } from '../lib/store'
import { saveProfile, suggestUsername, type Profile } from '../lib/social'

/** Tu nombre, usuario (para que te encuentren), emoji y color. */
export function ProfileForm({ initial, email, submitLabel, onSaved }: { initial?: Profile | null; email?: string; submitLabel: string; onSaved?: () => void }) {
  const [name, setName] = useState(initial?.display_name ?? '')
  const [username, setUsername] = useState(initial?.username ?? (email ? suggestUsername(email) : ''))
  const [touchedUser, setTouchedUser] = useState(!!initial?.username)
  const [emoji, setEmoji] = useState(() => initial?.emoji ?? PLAYER_EMOJIS[Math.floor(Math.random() * PLAYER_EMOJIS.length)])
  const [color, setColor] = useState(() => initial?.color ?? PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const validUser = /^[a-z0-9_.]{3,20}$/.test(username)

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
          setError(err instanceof Error ? err.message : String(err))
        } finally {
          setBusy(false)
        }
      }}
    >
      <div className="player-form-top">
        <Avatar player={{ id: '', name, emoji, color, createdAt: 0 }} size={56} />
        <input
          className="input"
          placeholder="Tu nombre (como te dicen)"
          value={name}
          maxLength={40}
          onChange={(e) => {
            setName(e.target.value)
            if (!touchedUser && e.target.value.trim().length >= 3) setUsername(suggestUsername(e.target.value))
          }}
          aria-label="Nombre"
        />
      </div>
      <label className="field">
        <span className="muted small">Usuario (así te encuentran tus amigos)</span>
        <span className="username-input">
          <span className="muted">@</span>
          <input
            className="input"
            value={username}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => {
              setTouchedUser(true)
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))
            }}
          />
        </span>
        {!validUser && username.length > 0 && <span className="error small">De 3 a 20 letras, números, puntos o guiones bajos.</span>}
      </label>
      <div className="emoji-grid">
        {PLAYER_EMOJIS.map((em) => (
          <button key={em} type="button" className={'emoji-btn' + (em === emoji ? ' active' : '')} onClick={() => setEmoji(em)}>
            {em}
          </button>
        ))}
      </div>
      <div className="color-row">
        {PLAYER_COLORS.map((c) => (
          <button key={c} type="button" aria-label={c} className={'color-dot' + (c === color ? ' active' : '')} style={{ background: c }} onClick={() => setColor(c)} />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn primary block" type="submit" disabled={busy || !name.trim() || !validUser}>
        {busy ? 'Guardando…' : submitLabel}
      </button>
    </form>
  )
}
