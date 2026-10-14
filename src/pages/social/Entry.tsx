import { ArrowRightIcon, ArrowLeftIcon, LinkIcon, MagnifyingGlassIcon, PlusCircleIcon, SignOutIcon, SwordIcon, TrophyIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/LoginForm'
import { Loader } from '../../components/Logo'
import { ProfileForm } from '../../components/ProfileForm'
import { linkClub, setGuest, signOut, useAuth, useGuest } from '../../lib/auth'
import { isProfileComplete, refreshGroups, switchToGroup, useMyGroups, useProfile, watchNotifications } from '../../lib/social'
import { findClub, normalizeCode, syncAvailable, useSyncState } from '../../lib/sync'
import { GroupForm, GroupSearch } from './GroupForms'
import { ClubInvite } from './ClubInvite'
import { inviteTarget } from '../../lib/clubLink'
import { pendingInviteCode, readPendingInvite, savePendingInvite } from '../../lib/pendingInvite'

/** Progreso del alta: barra + texto (no un rótulo arriba del título). */
function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="step-progress">
      <span className="step-bars" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < step ? 'done' : ''} />
        ))}
      </span>
      <span className="muted small">
        Paso {step} de {total}
      </span>
    </div>
  )
}

const ONBOARDED_KEY = 'game-board-onboarded-v1'
const LAST_GROUP_KEY = 'game-board-last-group'

function onboarded(uid: string): boolean {
  try {
    return localStorage.getItem(`${ONBOARDED_KEY}:${uid}`) === '1'
  } catch {
    return false
  }
}

export function markOnboarded(uid: string | undefined) {
  if (!uid) return
  try {
    localStorage.setItem(`${ONBOARDED_KEY}:${uid}`, '1')
  } catch {
    // ignorar
  }
}

export function rememberLastGroup(code: string) {
  try {
    localStorage.setItem(LAST_GROUP_KEY, code)
  } catch {
    // ignorar
  }
}

function lastGroup(): string | null {
  try {
    return localStorage.getItem(LAST_GROUP_KEY)
  } catch {
    return null
  }
}

function Splash() {
  return (
    <div className="splash">
      <Loader kind="secuencia" text="Cargando…" />
    </div>
  )
}

/**
 * Decide qué se ve al abrir la app: la bienvenida (sin sesión), armar el perfil,
 * el onboarding (sin grupos) o la app. Con sesión, también deja activo un grupo
 * de la cuenta si el dispositivo no está en ninguno.
 */
export function Gate({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const guest = useGuest()
  const sync = useSyncState()
  const { profile } = useProfile()
  const { groups, error: groupsError } = useMyGroups()
  const location = useLocation()
  const navigate = useNavigate()
  const uid = auth.session?.user.id
  const [skipped, setSkipped] = useState(false)

  // Link de invitación o QR (`/unirse/abc`, `/c/lasartes`). Sin sesión se ve primero el club y su ranking;
  // al tocar "Sumarme" se guarda la invitación, se entra y se retoma.
  const target = inviteTarget(location.pathname)
  const [, setLoginWanted] = useState(false)
  useEffect(() => {
    const pending = readPendingInvite()
    if (uid && isProfileComplete(profile) && pending) {
      savePendingInvite(null)
      if (location.pathname + location.search !== pending) navigate(pending, { replace: true })
    }
  }, [uid, profile, location.pathname, location.search, navigate])

  useEffect(() => watchNotifications(uid), [uid])

  // Con sesión: el club del dispositivo se guarda en la cuenta; si no hay ninguno activo, se activa el último usado.
  useEffect(() => {
    if (!uid || !groups) return
    const active = sync.club?.code
    if (active && !groups.some((g) => g.code === active)) {
      void linkClub(active)
        .then(() => refreshGroups())
        .catch(() => {})
      return
    }
    if (!active && groups.length && !inviteTarget(location.pathname)) {
      const g = groups.find((x) => x.code === lastGroup()) ?? groups.find((x) => x.kind === 'group') ?? groups[0]
      void switchToGroup(g).catch(() => {})
    }
  }, [uid, groups, sync.club?.code, location.pathname])

  useEffect(() => {
    if (sync.club) rememberLastGroup(sync.club.code)
  }, [sync.club])

  if (!syncAvailable) return <>{children}</>
  if (!auth.ready) return <Splash />
  if (!auth.session) {
    if (guest) return <>{children}</>
    if (target && !readPendingInvite()) return <ClubInvite target={target} standalone onLogin={() => setLoginWanted(true)} />
    return <Welcome inviteCode={pendingInviteCode()} />
  }
  if (profile === undefined) return <Splash />
  if (!isProfileComplete(profile)) return <ProfileSetup />
  if (target) return <>{children}</>
  if (groups === undefined) return groupsError || sync.club ? <>{children}</> : <Splash />
  if (!groups.length && !sync.club && !skipped && !onboarded(auth.session.user.id))
    return (
      <Onboarding
        onSkip={(to) => {
          markOnboarded(uid)
          setSkipped(true)
          if (to) navigate(to)
        }}
      />
    )
  return <>{children}</>
}

/** Pantalla de entrada: qué es la app y cómo entrar. */
function Welcome({ inviteCode }: { inviteCode?: string }) {
  const [invitedTo, setInvitedTo] = useState<string | null>(null)
  useEffect(() => {
    if (!inviteCode) return
    let cancelled = false
    findClub(inviteCode)
      .then((n) => !cancelled && setInvitedTo(n))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [inviteCode])

  return (
    <div className="entry">
      <div className="entry-hero">
        <div className="entry-covers" aria-hidden>
          {['🌾', '🃏', '🏓', '🕵️', '🚂', '🎲'].map((e, i) => (
            <span key={i} className={'entry-tile t' + i}>
              {e}
            </span>
          ))}
        </div>
        <h1>Game Board</h1>
        <p className="entry-lead">Partidas, torneos y quién manda en cada juego. Rankings y medallas de cualquier juego con tu club.</p>
      </div>
      <div className="entry-body">
        {invitedTo && (
          <div className="card highlight">
            Te invitaron a <b>“{invitedTo}”</b>. Entrá o creá tu cuenta y te sumamos.
          </div>
        )}
        <h2>Entrá o creá tu cuenta</h2>
        <LoginForm />
        <ul className="entry-points">
          <li>
            <UsersThreeIcon aria-hidden /> Armá tu club o pedí sumarte a otros
          </li>
          <li>
            <SwordIcon aria-hidden /> Jugá mano a mano con tus amigos
          </li>
          <li>
            <TrophyIcon aria-hidden /> Ranking de tu club y ranking global
          </li>
        </ul>
        <div className="guest-option">
          <button className="link-btn" onClick={() => setGuest(true)}>
            Usar sin cuenta
          </button>
          <p className="muted small">Sin cuenta, todo queda guardado solo en este teléfono.</p>
        </div>
      </div>
    </div>
  )
}

function ProfileSetup() {
  const auth = useAuth()
  const { profile } = useProfile()
  const meta = auth.session?.user.user_metadata as { full_name?: string; name?: string } | undefined
  const initial = profile ?? (meta?.full_name || meta?.name ? { user_id: '', username: null, display_name: meta.full_name ?? meta.name ?? null, emoji: null, color: null } : null)
  return (
    <div className="entry">
      <div className="entry-body">
        <StepProgress step={1} total={2} />
        <h1>¿Cómo te llamamos?</h1>
        <p className="muted">Así te ven tus amigos en el club y en el ranking.</p>
        <ProfileForm initial={initial} email={auth.session?.user.email} submitLabel="Seguir" />
        <button className="link-btn small" onClick={() => void signOut()}>
          <SignOutIcon /> Usar otra cuenta
        </button>
      </div>
    </div>
  )
}

type Step = 'menu' | 'create' | 'search' | 'link'

/** Primer ingreso sin clubes: crear uno, buscar, entrar con un link o ir a jugar con amigos. */
function Onboarding({ onSkip }: { onSkip: (to?: string) => void }) {
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('menu')
  const [code, setCode] = useState('')

  const options: { id: Step | 'friends'; Icon: typeof PlusCircleIcon; title: string; text: string }[] = [
    { id: 'create', Icon: PlusCircleIcon, title: 'Crear un club', text: 'Para tus amigos, la familia o la oficina. Después invitás a los demás.' },
    { id: 'search', Icon: MagnifyingGlassIcon, title: 'Buscar un club', text: 'Encontrá clubes públicos y pedí sumarte: le llega un aviso a quien lo creó.' },
    { id: 'link', Icon: LinkIcon, title: 'Tengo un link o código', text: 'Si alguien te pasó la invitación a su club.' },
    { id: 'friends', Icon: UserPlusIcon, title: 'Jugar con amigos', text: 'Buscá a tus amigos por su usuario y jueguen mano a mano.' },
  ]

  return (
    <div className="entry">
      <div className="entry-body">
        <StepProgress step={2} total={2} />
        {step === 'menu' && (
          <>
            <h1>¡Hola, {profile?.display_name}! {profile?.emoji}</h1>
            <p className="muted">Las partidas y los rankings son de cada club. Podés estar en todos los clubes que quieras.</p>
            <div className="onboarding-options">
              {options.map((o) => (
                <button key={o.id} className="card onboarding-option" onClick={() => (o.id === 'friends' ? onSkip('/amigos') : setStep(o.id))}>
                  <o.Icon className="onboarding-icon" weight="duotone" />
                  <span className="grow">
                    <b className="block">{o.title}</b>
                    <span className="muted small">{o.text}</span>
                  </span>
                  <ArrowRightIcon className="muted" />
                </button>
              ))}
            </div>
            <button className="link-btn small mt" onClick={() => onSkip()}>
              Saltar por ahora
            </button>
          </>
        )}
        {step === 'create' && (
          <>
            <h1>Nuevo club</h1>
            <GroupForm
              onDone={() => {
                onSkip('/')
              }}
            />
          </>
        )}
        {step === 'search' && (
          <>
            <h1>Buscar clubes</h1>
            <GroupSearch />
          </>
        )}
        {step === 'link' && (
          <>
            <h1>Entrar con un link</h1>
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault()
                if (code.trim()) navigate(`/unirse/${normalizeCode(code)}`)
              }}
            >
              <label className="field">
                <span className="field-label">Código o link de invitación</span>
                <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Pegalo acá" autoComplete="off" />
              </label>
              <button className="btn primary block" disabled={!code.trim()}>
                Buscar el club
              </button>
            </form>
          </>
        )}
        {step !== 'menu' && (
          <button className="link-btn small mt" onClick={() => setStep('menu')}>
            <ArrowLeftIcon aria-hidden /> Volver
          </button>
        )}
      </div>
    </div>
  )
}
