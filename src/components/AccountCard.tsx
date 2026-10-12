import { UserCircleIcon } from '@phosphor-icons/react'
import { setGuest, useAuth } from '../lib/auth'
import { syncAvailable } from '../lib/sync'

/** En modo invitado: invitación a crear una cuenta (grupos, amigos, ranking global). */
export function AccountCard() {
  const auth = useAuth()
  if (!syncAvailable || !auth.ready || auth.session) return null
  return (
    <section className="card">
      <h2>
        <UserCircleIcon className="inline-icon" /> Estás sin cuenta
      </h2>
      <p className="muted small">Con una cuenta tenés tu usuario, podés estar en varios grupos, buscar grupos y amigos, jugar mano a mano y aparecer en el ranking global.</p>
      <button className="btn primary block" onClick={() => setGuest(false)}>
        Entrar o crear cuenta
      </button>
    </section>
  )
}
