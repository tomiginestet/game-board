import { CaretRightIcon, GearSixIcon, HandshakeIcon, PencilSimpleIcon, RankingIcon, ShieldCheckIcon, SignOutIcon, SparkleIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { ProfileForm } from '../../components/ProfileForm'
import { useIsAdmin } from '../../lib/admin'
import { claimedPlayers, claimPlayer, signOut, useAuth } from '../../lib/auth'
import { ROLE_NAMES, ensureMyPlayer, groupMembers, leaveGroup, refreshGroups, useActiveGroup, useMyGroups, useProfile, userAsPlayer, type Member, type MyGroup } from '../../lib/social'
import { useData } from '../../lib/store'
import type { Player } from '../../lib/types'
import { deactivateClub, syncNow } from '../../lib/sync'
import { MemberCard } from '../../components/MemberCard'
import { NextMedals } from '../../components/NextMedals'
import { memberNumber } from '../../lib/memberCard'
import { plural, useBoard } from '../../lib/hooks'
import { ClubPage } from '../ClubPage'
import { gloriaPosition, PlayerProfile } from '../PlayerDetail'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { confirmAction } from '../../lib/feedback'

/**
 * "Vos": una sola pantalla para tu cuenta y tu lugar en el club activo. Arriba quién sos (y cómo te va en el
 * club); después tu carnet, tus medallas y tus números en ese club; al final, lo de la cuenta.
 */
export function Me() {
  const auth = useAuth()
  if (!auth.session) return <ClubPage />
  return <MeView />
}

function MeView() {
  const auth = useAuth()
  const { profile } = useProfile()
  const { groups } = useMyGroups()
  const group = useActiveGroup()
  const data = useData()
  const board = useBoard()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = useIsAdmin()
  const [editing, setEditing] = useState(false)
  const player = group ? data.players.find((p) => p.id === group.player_id) : undefined

  useEffect(() => {
    if (location.hash === '#yo' || location.hash === '#carnet') document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [location.hash, group?.code])

  if (!profile) {
    return (
      <div className="page">
        <h1>Vos</h1>
        <p className="muted">Cargando…</p>
      </div>
    )
  }

  const stats = player ? board.players.get(player.id) : undefined
  const position = player ? gloriaPosition(board, player.id) : 0
  const clubs = groups?.filter((g) => g.kind === 'group').length ?? 0
  const duos = groups?.filter((g) => g.kind === 'duo').length ?? 0

  if (editing) {
    return (
      <div className="page">
        <h1>Editar perfil</h1>
        <ProfileForm initial={profile} submitLabel="Guardar" onSaved={() => setEditing(false)} />
        <p className="muted small">El nombre, emoji y color se actualizan también en tu jugador de cada club.</p>
        <button className="btn" onClick={() => setEditing(false)}>
          Cancelar
        </button>
      </div>
    )
  }

  // En un club, el carnet es el encabezado (quién sos, tu rol, tu gloria). Sin club o en un mano a mano, el tuyo.
  const withCard = !!group && group.kind === 'group'
  return (
    <div className="page">
      {!withCard && (
        <header className="pd-head" style={{ ['--player-color' as string]: profile.color ?? '#3b82f6' }}>
          <Avatar player={userAsPlayer(profile)} size={72} />
          <div className="pd-id">
            <h1>{profile.display_name}</h1>
            <p className="pd-sub">
              {stats && stats.played > 0 ? (
                <>
                  <SparkleIcon weight="fill" aria-hidden /> <b className="num">{stats.gloria}</b> de gloria{position ? ` · ${position}º` : ''}
                  {group ? ` en ${group.name}` : ''}
                </>
              ) : (
                <>@{profile.username}</>
              )}
            </p>
          </div>
        </header>
      )}

      {group ? (
        <ClubSection key={group.code} group={group} fallback={userAsPlayer(profile)} />
      ) : (
        <div className="empty">
          <p>No tenés un club activo.</p>
          <Link to="/grupos" className="btn primary mt">
            <UsersThreeIcon /> Elegir o crear un club
          </Link>
        </div>
      )}

      <section className="section-divided" aria-labelledby="account-title">
        <h2 id="account-title">Tu cuenta</h2>
        <p className="muted small account-who">
          @{profile.username} · {auth.session?.user.email}
        </p>
        <nav className="list rows" aria-label="Tu cuenta">
          <button type="button" className="settings-row" onClick={() => (setEditing(true), window.scrollTo({ top: 0 }))}>
            <PencilSimpleIcon size={22} aria-hidden />
            <span className="grow">
              <b className="block">Editar perfil</b>
              <span className="muted small block">Nombre, emoji y color, en todos tus clubes</span>
            </span>
            <CaretRightIcon aria-hidden />
          </button>
          <Link to="/grupos" className="settings-row">
            <UsersThreeIcon size={22} aria-hidden />
            <span className="grow">
              <b className="block">Tus clubes</b>
              <span className="muted small block">{groups ? `${plural(clubs, 'club', 'clubes')} · ${duos} mano a mano` : 'Cargando…'}</span>
            </span>
            <CaretRightIcon aria-hidden />
          </Link>
          <Link to="/amigos" className="settings-row">
            <HandshakeIcon size={22} aria-hidden />
            <span className="grow">
              <b className="block">Amigos</b>
              <span className="muted small block">Buscá amigos y jueguen mano a mano</span>
            </span>
            <CaretRightIcon aria-hidden />
          </Link>
          <Link to="/ranking?global=1" className="settings-row">
            <RankingIcon size={22} aria-hidden />
            <span className="grow">
              <b className="block">Ranking global</b>
              <span className="muted small block">Todos los clubes, todas las cuentas</span>
            </span>
            <CaretRightIcon aria-hidden />
          </Link>
          <Link to="/ajustes" className="settings-row">
            <GearSixIcon size={22} aria-hidden />
            <span className="grow">
              <b className="block">Ajustes</b>
              <span className="muted small block">Copia de seguridad de los datos del club</span>
            </span>
            <CaretRightIcon aria-hidden />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="settings-row">
              <ShieldCheckIcon size={22} aria-hidden />
              <span className="grow">
                <b className="block">Panel de admin</b>
                <span className="muted small block">Personas, clubes, juegos, métricas y control de la app</span>
              </span>
              <CaretRightIcon aria-hidden />
            </Link>
          )}
        </nav>
        <div className="me-exits">
          {group && <LeaveClub group={group} />}
          <button
            className="btn block"
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
      </section>
    </div>
  )
}

/** Vos en el club activo: el carnet (que hace de encabezado), quién sos si falta, las próximas medallas y tus números. */
function ClubSection({ group, fallback }: { group: MyGroup; fallback: Player }) {
  const auth = useAuth()
  const data = useData()
  const board = useBoard()
  const me = auth.session?.user.id
  const duo = group.kind === 'duo'
  const [members, setMembers] = useState<Member[] | null>(null)
  const player = data.players.find((p) => p.id === group.player_id)
  const stats = player ? board.players.get(player.id) : undefined

  useEffect(() => {
    if (duo) return
    groupMembers(group.code)
      .then(setMembers)
      .catch(() => {})
  }, [group.code, duo])

  return (
    <>
      {!duo && (
        <section id="carnet" aria-label="Tu carnet de socio">
          <MemberCard
            clubCode={group.code}
            clubName={group.name}
            player={player ?? fallback}
            joinedAt={group.joined_at}
            number={me && members ? memberNumber(members, me) : undefined}
            role={ROLE_NAMES[group.role]}
            gloria={stats && stats.played > 0 ? { value: stats.gloria, position: gloriaPosition(board, stats.playerId) } : undefined}
          />
        </section>
      )}
      {!group.player_id && <WhoAmI group={group} />}
      {player && (
        <>
          <NextMedals playerIds={[player.id]} title="Tus próximas medallas" />
          <PlayerProfile player={player} self head={false} />
        </>
      )}
    </>
  )
}

function LeaveClub({ group }: { group: MyGroup }) {
  const navigate = useNavigate()
  const duo = group.kind === 'duo'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const leave = async () => {
    const ok = await confirmAction(
      duo
        ? { title: '¿Salir de este mano a mano?', detail: 'Podés volver cuando quieras desde Amigos.', confirmLabel: 'Salir del mano a mano', danger: true }
        : {
            title: `¿Salir de “${group.name}”?`,
            detail:
              group.role === 'owner'
                ? 'La administración pasa a quien sea admin (o integrante) hace más tiempo. Para volver vas a necesitar una invitación.'
                : 'Para volver vas a necesitar una invitación o pedir sumarte de nuevo.',
            confirmLabel: 'Salir del club',
            danger: true,
          },
    )
    if (!ok) return
    setBusy(true)
    setError('')
    try {
      await leaveGroup(group.code)
      deactivateClub()
      navigate('/grupos')
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <button className="btn danger block" disabled={busy} onClick={() => void leave()}>
        <SignOutIcon /> {duo ? 'Salir del mano a mano' : `Salir de ${group.name}`}
      </button>
      <ErrorText>{error}</ErrorText>
    </>
  )
}

/** Elegir cuál de los jugadores del grupo sos (o crear el tuyo). */
function WhoAmI({ group }: { group: MyGroup }) {
  const data = useData()
  const [claimed, setClaimed] = useState<string[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    claimedPlayers(group.code)
      .then(setClaimed)
      .catch(() => setClaimed([]))
  }, [group.code])

  const free = data.players.filter((p) => !claimed?.includes(p.id))
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      await refreshGroups()
      void syncNow()
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card highlight" id="yo">
      <h2>¿Quién sos en este club?</h2>
      <p className="muted small">Así tus partidas cuentan para tu perfil y para el ranking global.</p>
      {free.length > 0 && (
        <>
          <p className="small">Si ya te habían cargado como jugador, elegite:</p>
          <div className="chips">
            {free.map((p) => (
              <button key={p.id} className="chip player-chip" disabled={busy} onClick={() => run(() => claimPlayer(group.code, p.id))}>
                <Avatar player={p} size={22} /> {p.name}
              </button>
            ))}
          </div>
        </>
      )}
      <button className="btn primary block mt" disabled={busy} onClick={() => run(() => ensureMyPlayer(group.code))}>
        <UserPlusIcon /> {free.length ? 'No estoy: crear mi jugador' : 'Crear mi jugador'}
      </button>
      <ErrorText>{error}</ErrorText>
    </section>
  )
}
