import { EnvelopeSimpleIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { signInWithEmail, signInWithGoogle, verifyEmailCode } from '../lib/auth'

/** Entrar con un link (o código) por mail, o con Google. Si la cuenta no existe, se crea. */
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-form">
      {!sent ? (
        <>
          <button className="btn block big" disabled={busy} onClick={() => run(signInWithGoogle)}>
            <GoogleLogoIcon /> Seguir con Google
          </button>
          <div className="or-divider">
            <span>o con tu mail</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (/.+@.+\..+/.test(email)) void run(() => signInWithEmail(email).then(() => setSent(true)))
            }}
          >
            <input className="input" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-label="Mail" />
            <button className="btn primary block big mt" disabled={busy || !/.+@.+\..+/.test(email)}>
              <EnvelopeSimpleIcon /> Mandame un link para entrar
            </button>
          </form>
        </>
      ) : (
        <>
          <p>
            Te mandamos un mail a <b>{email}</b>. Abrí el link desde este dispositivo, o pegá acá el código si vino uno.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (code.trim().length >= 6) void run(() => verifyEmailCode(email, code))
            }}
          >
            <input className="input" inputMode="numeric" placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Código" />
            <button className="btn primary block mt" disabled={busy || code.trim().length < 6}>
              Entrar con el código
            </button>
          </form>
          <button className="link-btn small mt" onClick={() => setSent(false)}>
            Usar otro mail
          </button>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
