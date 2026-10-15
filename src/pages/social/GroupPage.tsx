import { ArrowRightIcon, SignOutIcon, UsersIcon, UsersThreeIcon, UserPlusIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { claimedPlayers, claimPlayer, useAuth } from '../../lib/auth'
import { ROLE_NAMES, ensureMyPlayer, groupMembers, leaveGroup, refreshGroups, useActiveGroup, type Member, type MyGroup } from '../../lib/social'
import { useData } from '../../lib/store'
import { deactivateClub, syncNow, useSyncState } from '../../lib/sync'
import { MemberCard } from '../../components/MemberCard'
import { NextMedals } from '../../components/NextMedals'
import { memberNumber } from '../../lib/memberCard'
import { formatDate, useBoard } from '../../lib/hooks'
import { ClubPage } from '../ClubPage'
import { PlayerProfile } from '../PlayerDetail'
import { friendlyError } from '../../lib/text'
import { ErrorText } from '../../components/Feedback'
import { confirmAction } from '../../lib/feedback'

/** Pestaña "Vos": quién sos en el club activo, tu carnet, tus números y tus medallas. */
export function GroupPage() {
  const auth = useAuth()
  const group = useActiveGroup()
  const sync = useSyncState()
  if (!auth.session) return <ClubPage />
  if (!group) {
    return (
      <div className="page">
        <h1>Vos</h1>
        {sync.club ? <p className="muted">Cargando el club…</p> : <div className="empty">No tenés un club activo. Elegí uno de tus clubes o creá uno.</div>}
        <Link to="/grupos" className="btn primary">
          <UsersIcon /> Ver mis clubes
        </Link>
      </div>
    )
  }
  return <MeInClub key={group.code} group={group} />
}

function MeInClub({ group }: { group: MyGroup }) {
  const auth = useAuth()
  const data = useData()
  const board = useBoard()
  const navigate = useNavigate()
  const location = useLocation()
  const me = auth.session?.user.id
  const duo = group.kind === 'duo'
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const player = data.players.find((p) => p.id === group.player_id)

  useEffect(() => {
    if (duo) return
    groupMembers(group.code)
      .then(setMembers)
      .catch(() => {})
  }, [group.code, duo])

  useEffect(() => {
    if (location.hash === '#yo' || location.hash === '#carnet') document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [location.hash])

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

  const stats = board.players.get(group.player_id ?? '')
  const carnet = !duo && (
    <section id="carnet" aria-label="Tu carnet de socio">
      <MemberCard
        clubCode={group.code}
        player={player}
        joinedAt={group.joined_at}
        number={me && members ? memberNumber(members, me) : undefined}
        role={ROLE_NAMES[group.role]}
        stats={{ played: stats?.played ?? 0, wins: stats?.wins ?? 0 }}
      />
    </section>
  )

  return (
    <div className="page">
      {player ? (
        <PlayerProfile
          player={player}
          self
          afterHead={
            <>
              <p className="muted small me-club-line">
                {duo ? 'En el mano a mano' : `${ROLE_NAMES[group.role]} de`} <b className="strong">{group.name}</b> desde el {formatDate(new Date(group.joined_at).getTime())}
              </p>
              {carnet}
              <NextMedals playerIds={[player.id]} title="Tus próximas medallas" />
            </>
          }
        />
      ) : (
        <>
          <header>
            <h1>Vos en {group.name}</h1>
            <p className="muted">Elegí quién sos para ver tus números, tus medallas y tu carnet.</p>
          </header>
          <WhoAmI group={group} />
          {carnet}
        </>
      )}

      <section className="section-divided">
        <div className="list">
          <Link to="/grupos" className="card club-member">
            <UsersThreeIcon size={28} aria-hidden />
            <span className="grow">
              <b className="block">Tus clubes</b>
              <span className="muted small">Cambiá de club, creá uno o buscá el de tus amigos</span>
            </span>
            <ArrowRightIcon aria-hidden />
          </Link>
        </div>
      </section>

      <ErrorText>{error}</ErrorText>

      <button className="btn danger mt" disabled={busy} onClick={() => void leave()}>
        <SignOutIcon /> {duo ? 'Salir del mano a mano' : 'Salir del club'}
      </button>
    </div>
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
