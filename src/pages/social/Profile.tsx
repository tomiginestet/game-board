import { GearSixIcon, PencilSimpleIcon, RankingIcon, SignOutIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { ProfileForm } from '../../components/ProfileForm'
import { signOut, useAuth } from '../../lib/auth'
import { confirmAction } from '../../lib/feedback'
import { plural } from '../../lib/hooks'
import { useMyGroups, useProfile, userAsPlayer } from '../../lib/social'

export function Profile() {
  const auth = useAuth()
  const { profile } = useProfile()
  const { groups } = useMyGroups()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  if (!auth.session || !profile) {
    return (
      <div className="page">
        <h1>Perfil</h1>
        <p className="muted">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="page">
      {editing ? (
        <>
          <h1>Editar perfil</h1>
          <ProfileForm initial={profile} submitLabel="Guardar" onSaved={() => setEditing(false)} />
          <p className="muted small">El nombre, emoji y color se actualizan también en tu jugador de cada club.</p>
          <button className="btn" onClick={() => setEditing(false)}>
            Cancelar
          </button>
        </>
      ) : (
        <header className="profile" style={{ ['--player-color' as string]: profile.color ?? '#3b82f6' }}>
          <button className="btn small profile-edit" onClick={() => setEditing(true)}>
            <PencilSimpleIcon /> Editar
          </button>
          <Avatar player={userAsPlayer(profile)} size={88} />
          <h1>{profile.display_name}</h1>
          <p className="muted">
            @{profile.username} · {auth.session.user.email}
          </p>
        </header>
      )}

      <div className="list">
        <Link to="/grupos" className="card cup-row">
          <UsersThreeIcon />
          <span className="grow">
            <b>Tus clubes</b>
            <span className="muted small block">{groups ? `${plural(groups.filter((g) => g.kind === 'group').length, 'club', 'clubes')} · ${groups.filter((g) => g.kind === 'duo').length} mano a mano` : '…'}</span>
          </span>
        </Link>
        <Link to="/amigos" className="card cup-row">
          <span aria-hidden>🤝</span>
          <span className="grow">
            <b>Amigos</b>
            <span className="muted small block">Buscá amigos y jueguen mano a mano</span>
          </span>
        </Link>
        <Link to="/ranking?global=1" className="card cup-row">
          <RankingIcon />
          <span className="grow">
            <b>Ranking global</b>
            <span className="muted small block">Todos los clubes, todas las cuentas</span>
          </span>
        </Link>
        <Link to="/ajustes" className="card cup-row">
          <GearSixIcon />
          <span className="grow">
            <b>Ajustes</b>
            <span className="muted small block">Copia de seguridad de los datos del club</span>
          </span>
        </Link>
      </div>

      <button
        className="btn danger mt"
        onClick={async () => {
          const ok = await confirmAction({
            title: '¿Cerrar sesión?',
            detail: 'Tus clubes quedan guardados en tu cuenta; en este teléfono se borra la copia hasta que vuelvas a entrar.',
            confirmLabel: 'Cerrar sesión',
            danger: true,
          })
          if (!ok) return
          await signOut()
          navigate('/')
        }}
      >
        <SignOutIcon /> Cerrar sesión
      </button>
    </div>
  )
}
