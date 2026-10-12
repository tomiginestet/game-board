import { EnvelopeSimpleIcon, GoogleLogoIcon, SignOutIcon, UserCircleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { myClubs, signInWithEmail, signInWithGoogle, signOut, useAuth, verifyEmailCode, type MyClub } from '../lib/auth'
import { switchClub, syncAvailable, useSyncState } from '../lib/sync'

/** Cuenta (opcional): iniciar sesión, ver tus clubes y cambiar entre ellos. */
export function AccountCard() {
  const auth = useAuth()
  const sync = useSyncState()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [clubs, setClubs] = useState<MyClub[] | null>(null)
  const userId = auth.session?.user.id

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    myClubs()
      .then((c) => !cancelled && setClubs(c))
      .catch(() => !cancelled && setClubs([]))
    return () => {
      cancelled = true
    }
  }, [userId, sync.club?.code])

  if (!syncAvailable || !auth.ready) return null

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

  if (!auth.session) {
    return (
      <section className="card">
        <h2>
          <UserCircleIcon className="inline-icon" /> Tu cuenta <span className="muted small">(opcional)</span>
        </h2>
        <p className="muted small">Con cuenta, tus clubes te siguen a cualquier celular y podés decir qué jugador sos. También habilita generar juegos con IA.</p>
        {!sent ? (
          <>
            <input className="input" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <button className="btn primary block mt" disabled={busy || !/.+@.+\..+/.test(email)} onClick={() => run(() => signInWithEmail(email).then(() => setSent(true)))}>
              <EnvelopeSimpleIcon /> Mandame un link para entrar
            </button>
            <button className="btn block mt" disabled={busy} onClick={() => run(signInWithGoogle)}>
              <GoogleLogoIcon /> Entrar con Google
            </button>
          </>
        ) : (
          <>
            <p>
              Te mandamos un mail a <b>{email}</b>. Abrí el link desde este dispositivo, o pegá acá el código si vino uno.
            </p>
            <input className="input" inputMode="numeric" placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn block mt" disabled={busy || code.trim().length < 6} onClick={() => run(() => verifyEmailCode(email, code))}>
              Entrar con el código
            </button>
            <button className="link-btn small mt" onClick={() => setSent(false)}>
              Usar otro mail
            </button>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    )
  }

  const others = (clubs ?? []).filter((c) => c.code !== sync.club?.code)
  return (
    <section className="card">
      <div className="row-between">
        <h2>
          <UserCircleIcon className="inline-icon" /> Tu cuenta
        </h2>
        <button className="btn small" onClick={() => run(signOut)}>
          <SignOutIcon /> Salir
        </button>
      </div>
      <p className="muted small">{auth.session.user.email}</p>
      {sync.club && clubs && !clubs.some((c) => c.code === sync.club!.code) && <p className="small">Este club se guarda en tu cuenta la próxima vez que entres a él.</p>}
      {others.length > 0 && (
        <>
          <h3>Tus otros clubes</h3>
          <div className="list">
            {others.map((c) => (
              <button
                key={c.code}
                className="card cup-row"
                disabled={busy}
                onClick={() => confirm(`¿Cambiar a “${c.name}”? Lo de este club queda guardado en el servidor.`) && run(() => switchClub(c.code))}
              >
                <span className="grow">
                  <b>{c.name}</b>
                </span>
                <span className="muted small">Cambiar</span>
              </button>
            ))}
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  )
}
