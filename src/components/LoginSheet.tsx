import { EyeIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { onDenied, useAccess } from '../lib/access'
import { useAuth } from '../lib/auth'
import { toast, useModal } from '../lib/feedback'
import { askLogin, closeLoginAsk, rememberReturnPath, useLoginAsk, type Ask } from '../lib/login'
import { LoginForm } from './LoginForm'
import { Logo } from './Logo'

/** Dibuja la invitación a entrar y avisa cuando algo no se puede cambiar por permisos. */
export function AccessHost() {
  const current = useLoginAsk()
  const auth = useAuth()

  useEffect(
    () =>
      onDenied((d) => {
        if (d === 'login') askLogin()
        else toast('Eso lo pueden cambiar quien lo creó o un admin del club.')
      }),
    [],
  )
  // Ya entró: no hace falta seguir mostrándola.
  useEffect(() => {
    if (auth.session) closeLoginAsk()
  }, [auth.session])

  return current && !auth.session ? <LoginDialog ask={current} /> : null
}

function LoginDialog({ ask: a }: { ask: Ask }) {
  const ref = useRef<HTMLDialogElement>(null)
  useModal(ref)
  return (
    <dialog
      ref={ref}
      className="sheet login-sheet"
      aria-labelledby="login-sheet-title"
      onCancel={(e) => {
        e.preventDefault()
        closeLoginAsk()
      }}
      onClick={(e) => e.target === e.currentTarget && closeLoginAsk()}
    >
      <div className="sheet-body">
        <div className="row-between">
          <h2 id="login-sheet-title">{a.title}</h2>
          <button className="tool-btn" onClick={closeLoginAsk} aria-label="Cerrar">
            <XIcon />
          </button>
        </div>
        <p className="muted">{a.text}</p>
        <LoginForm />
        <button className="link-btn small mt" onClick={closeLoginAsk}>
          Ahora no, sigo mirando
        </button>
      </div>
    </dialog>
  )
}

/** Pantallas para anotar o crear: sin cuenta, en su lugar se invita a entrar (y después se vuelve acá). */
export function NeedsAccount({ children, title = 'Entrá para jugar' }: { children: ReactNode; title?: string }) {
  const access = useAccess()
  const guest = access.mode === 'guest'
  useEffect(() => {
    if (guest) rememberReturnPath()
  }, [guest])
  if (!guest) return <>{children}</>
  return (
    <div className="page needs-account">
      <Logo kind="secuencia" size={64} />
      <h1>{title}</h1>
      <p className="muted">Sin cuenta podés mirar el catálogo, los juegos y sus medallas. Para anotar partidas, armar torneos o agregar juegos, entrá o creá tu cuenta: es gratis y lleva un minuto.</p>
      <LoginForm />
      <Link to="/juegos" className="link-btn small mt">
        Seguir mirando el catálogo
      </Link>
    </div>
  )
}

/** Aviso chico arriba de todo mientras se mira sin cuenta. */
export function GuestBanner() {
  const access = useAccess()
  if (access.mode !== 'guest') return null
  return (
    <div className="guest-banner">
      <EyeIcon size={20} aria-hidden />
      <span className="grow">Estás mirando sin cuenta.</span>
      <button className="btn small primary" onClick={() => askLogin('Entrá a Game Board')}>
        Entrar
      </button>
    </div>
  )
}
