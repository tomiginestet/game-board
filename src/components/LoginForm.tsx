import { EnvelopeSimpleIcon, GoogleLogoIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { googleButtonAvailable, renderGoogleButton, signInWithEmail, signInWithGoogle, verifyEmailCode } from '../lib/auth'
import { friendlyError } from '../lib/text'
import { ErrorText } from './Feedback'

const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())

/** Botón oficial de Google (Google muestra el dominio de la app). Si no carga, el de siempre. */
function GoogleButton({ busy, run, onError }: { busy: boolean; run: (fn: () => Promise<unknown>) => void; onError: (m: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(!googleButtonAvailable)

  useEffect(() => {
    if (fallback || !ref.current) return
    renderGoogleButton(ref.current, onError).catch(() => setFallback(true))
  }, [fallback, onError])

  if (fallback)
    return (
      <button className="btn block big" disabled={busy} onClick={() => run(signInWithGoogle)}>
        <GoogleLogoIcon /> Seguir con Google
      </button>
    )
  return <div ref={ref} className="google-btn" />
}

/** Entrar con un link (o código) por mail, o con Google. Si la cuenta no existe, se crea. */
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // El aviso de mail incompleto aparece recién cuando la persona intenta seguir, no mientras escribe.
  const [tried, setTried] = useState(false)
  const emailProblem = tried && !validEmail(email) ? 'Revisá el mail: tiene que ser como nombre@algo.com.' : ''

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-form">
      {!sent ? (
        <>
          <GoogleButton busy={busy} run={run} onError={(m) => setError(friendlyError(m))} />
          <div className="or-divider">
            <span>o con tu mail</span>
          </div>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setTried(true)
              if (validEmail(email)) void run(() => signInWithEmail(email.trim()).then(() => setSent(true)))
            }}
          >
            <label className="field">
              <span className="field-label">Tu mail</span>
              <input
                className="input"
                type="email"
                inputMode="email"
                placeholder="nombre@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={!!emailProblem}
                aria-describedby={emailProblem ? 'email-problem' : undefined}
              />
              {emailProblem && (
                <span id="email-problem" className="error small">
                  {emailProblem}
                </span>
              )}
            </label>
            <button className="btn primary block big" disabled={busy}>
              <EnvelopeSimpleIcon /> {busy ? 'Mandando…' : 'Mandame un link para entrar'}
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
            <label className="field">
              <span className="field-label">Código del mail (si vino uno)</span>
              <input className="input" inputMode="numeric" autoComplete="one-time-code" placeholder="6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <button className="btn primary block" disabled={busy || code.trim().length < 6}>
              {busy ? 'Entrando…' : 'Entrar con el código'}
            </button>
          </form>
          <button className="link-btn small mt" onClick={() => setSent(false)}>
            Usar otro mail
          </button>
        </>
      )}
      <ErrorText>{error}</ErrorText>
    </div>
  )
}
