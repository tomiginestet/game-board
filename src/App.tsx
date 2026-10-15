import { HouseIcon, RankingIcon, SquaresFourIcon, TrophyIcon, UsersIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { createRoutesFromElements, HashRouter, Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'
import { Announcement } from './components/Announcement'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FeedbackHost } from './components/Feedback'
import { AccessHost, GuestBanner, NeedsAccount } from './components/LoginSheet'
import { Loader, Logo } from './components/Logo'
import { TopBar } from './components/TopBar'
import { UpdateBanner } from './components/UpdateBanner'
import { Visits } from './components/Visits'
import { useAuth } from './lib/auth'
// Va en el paquete principal: la pantalla de entrada (`Gate`) ya la usa para los links sin sesión.
import { InviteRoute, ShortLinkRoute } from './pages/social/ClubInvite'
import { useDocumentTitle } from './lib/hooks'
import { loaderForPath } from './lib/logo'
import { Home } from './pages/Home'
import { Gate } from './pages/social/Entry'

/** Cada pantalla se baja recién cuando se abre; mientras tanto se ve la animación de su momento. */
function page<M extends Record<string, unknown>, K extends keyof M>(load: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await load())[name] as ComponentType }))
}
const AddGame = page(() => import('./pages/AddGame'), 'AddGame')
const EditGame = page(() => import('./pages/AddGame'), 'EditGame')
const CupDetail = page(() => import('./pages/CupDetail'), 'CupDetail')
const Cups = page(() => import('./pages/Cups'), 'Cups')
const GameDetail = page(() => import('./pages/GameDetail'), 'GameDetail')
const Games = page(() => import('./pages/Games'), 'Games')
const History = page(() => import('./pages/History'), 'History')
const NewCup = page(() => import('./pages/NewCup'), 'NewCup')
const NewPlay = page(() => import('./pages/NewPlay'), 'NewPlay')
const MatchScreen = page(() => import('./pages/pingpong/MatchScreen'), 'MatchScreen')
const NewMatch = page(() => import('./pages/pingpong/NewMatch'), 'NewMatch')
const NewTournament = page(() => import('./pages/pingpong/NewTournament'), 'NewTournament')
const TournamentDetail = page(() => import('./pages/pingpong/TournamentDetail'), 'TournamentDetail')
const PlayerDetail = page(() => import('./pages/PlayerDetail'), 'PlayerDetail')
const Medals = page(() => import('./pages/Medals'), 'Medals')
const Players = page(() => import('./pages/Players'), 'Players')
const Teams = page(() => import('./pages/Teams'), 'Teams')
const NewTeam = page(() => import('./pages/Teams'), 'NewTeam')
const TeamDetail = page(() => import('./pages/Teams'), 'TeamDetail')
const NewCall = page(() => import('./pages/NewCall'), 'NewCall')
const PlayScreen = page(() => import('./pages/PlayScreen'), 'PlayScreen')
const QuickPick = page(() => import('./pages/QuickPick'), 'QuickPick')
const Ranking = page(() => import('./pages/Ranking'), 'Ranking')
const Settings = page(() => import('./pages/Settings'), 'Settings')
const Friends = page(() => import('./pages/social/Friends'), 'Friends')
const GroupPage = page(() => import('./pages/social/GroupPage'), 'GroupPage')
const Groups = page(() => import('./pages/social/Groups'), 'Groups')
const PrintCard = page(() => import('./pages/social/PrintCard'), 'PrintCard')
const NewGroupPage = page(() => import('./pages/social/Groups'), 'NewGroupPage')
const SearchGroupsPage = page(() => import('./pages/social/Groups'), 'SearchGroupsPage')
const Notifications = page(() => import('./pages/social/Notifications'), 'Notifications')
const Profile = page(() => import('./pages/social/Profile'), 'Profile')
const AdminLayout = page(() => import('./pages/admin/Admin'), 'AdminLayout')
const AdminOverview = page(() => import('./pages/admin/Admin'), 'AdminOverview')
const AdminPeople = page(() => import('./pages/admin/AdminPeople'), 'AdminPeople')
const AdminPerson = page(() => import('./pages/admin/AdminPeople'), 'AdminPerson')
const AdminClubs = page(() => import('./pages/admin/AdminClubs'), 'AdminClubs')
const AdminClub = page(() => import('./pages/admin/AdminClubs'), 'AdminClub')
const AdminGames = page(() => import('./pages/admin/AdminGames'), 'AdminGames')
const AdminGame = page(() => import('./pages/admin/AdminGames'), 'AdminGame')
const AdminReports = page(() => import('./pages/admin/AdminTools'), 'AdminReports')
const AdminTrash = page(() => import('./pages/admin/AdminTools'), 'AdminTrash')
const AdminLog = page(() => import('./pages/admin/AdminTools'), 'AdminLog')
const AdminControl = page(() => import('./pages/admin/AdminTools'), 'AdminControl')
const AdminHealth = page(() => import('./pages/admin/AdminTools'), 'AdminHealth')

function PageLoader() {
  const location = useLocation()
  return <Loader kind={loaderForPath(location.pathname)} />
}

const NAV = [
  { to: '/', label: 'Inicio', Icon: HouseIcon, end: true },
  { to: '/juegos', label: 'Juegos', Icon: SquaresFourIcon },
  { to: '/torneos', label: 'Torneos', Icon: TrophyIcon },
  { to: '/ranking', label: 'Ranking', Icon: RankingIcon },
]

/** Título de la pestaña según la pantalla (el más específico primero). */
const TITLES: [RegExp, string][] = [
  [/^\/$/, 'Inicio'],
  [/^\/anotar/, 'Anotar'],
  [/^\/juegos\/nuevo/, 'Agregar juego'],
  [/^\/juegos/, 'Juegos'],
  [/^\/(jugar|partida)\//, 'Partida'],
  [/^\/convocar/, 'Convocar'],
  [/^\/(ping-pong\/nuevo|partido)/, 'Partido'],
  [/^\/(torneos|ping-pong\/torneo)/, 'Torneos'],
  [/^\/ranking/, 'Ranking'],
  [/^\/jugadores/, 'Jugadores'],
  [/^\/equipos/, 'Equipos'],
  [/^\/historial/, 'Historial'],
  [/^\/ajustes/, 'Ajustes'],
  [/^\/(club|grupo|grupos|unirse|c\/)/, 'Club'],
  [/^\/amigos/, 'Amigos'],
  [/^\/notificaciones/, 'Notificaciones'],
  [/^\/(perfil|cuenta)/, 'Perfil'],
  [/^\/admin/, 'Admin'],
]

function Layout() {
  const location = useLocation()
  const auth = useAuth()
  useDocumentTitle(TITLES.find(([re]) => re.test(location.pathname))?.[1])
  // Con cuenta, la última pestaña es el club (integrantes, invitaciones, solicitudes); sin cuenta, los jugadores.
  const nav = [...NAV, auth.session ? { to: '/grupo', label: 'Club', Icon: UsersThreeIcon } : { to: '/jugadores', label: 'Jugadores', Icon: UsersIcon }]
  return (
    <div className="app">
      <a className="skip-link" href="#contenido" onClick={(e) => (e.preventDefault(), document.getElementById('contenido')?.focus())}>
        Saltar al contenido
      </a>
      <TopBar />
      <Announcement />
      <UpdateBanner />
      <main className="content" id="contenido" tabIndex={-1}>
        <GuestBanner />
        {/* Se reinicia al cambiar de pantalla. */}
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <nav className="bottom-nav" aria-label="Principal">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={'end' in n ? n.end : undefined} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            {({ isActive }) => (
              <>
                <n.Icon className="nav-icon" size={24} weight={isActive ? 'fill' : 'regular'} />
                <span className="nav-label">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/** Dirección que no existe: lo decimos en vez de mostrar el inicio como si nada. */
function NotFound() {
  return (
    <div className="page empty-page">
      <Logo kind="secuencia" size={72} />
      <h1>Esta casilla está vacía</h1>
      <p className="muted">No encontramos esta página. Puede que el link esté incompleto o que eso ya no exista.</p>
      <Link to="/" className="btn primary">
        Volver al inicio
      </Link>
    </div>
  )
}

/** Las rutas de la app. De acá sale también la pantalla genérica que se cuenta en las visitas. */
const routes = (
  <>
    {/* Marcador del ping pong a pantalla completa (el mismo del Ping Pong Club). */}
    <Route path="/partido/:id" element={<MatchScreen />} />
    {/* Tarjeta del club para imprimir, sin la barra ni la navegación. */}
    <Route path="/club/tarjeta" element={<PrintCard />} />
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/anotar" element={<NeedsAccount><QuickPick /></NeedsAccount>} />
      <Route path="/juegos" element={<Games />} />
      <Route path="/juegos/nuevo" element={<NeedsAccount title="Entrá para agregar juegos"><AddGame /></NeedsAccount>} />
      <Route path="/juegos/:id" element={<GameDetail />} />
      <Route path="/juegos/:id/editar" element={<NeedsAccount title="Entrá para editar juegos"><EditGame /></NeedsAccount>} />
      <Route path="/jugar/:gameId" element={<NeedsAccount><NewPlay /></NeedsAccount>} />
      <Route path="/partida/:id" element={<PlayScreen />} />
      <Route path="/ping-pong/nuevo" element={<NeedsAccount><NewMatch /></NeedsAccount>} />
      <Route path="/partido/nuevo" element={<NeedsAccount><NewMatch /></NeedsAccount>} />
      <Route path="/ping-pong/torneo/nuevo" element={<NeedsAccount title="Entrá para armar torneos"><NewTournament /></NeedsAccount>} />
      <Route path="/ping-pong/torneos/:id" element={<TournamentDetail />} />
      <Route path="/torneos" element={<Cups />} />
      <Route path="/torneos/nuevo" element={<NeedsAccount title="Entrá para armar torneos"><NewCup /></NeedsAccount>} />
      <Route path="/torneos/:id" element={<CupDetail />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/medallas" element={<Medals />} />
      <Route path="/jugadores" element={<Players />} />
      <Route path="/jugadores/:id" element={<PlayerDetail />} />
      <Route path="/equipos" element={<Teams />} />
      <Route path="/equipos/nuevo" element={<NeedsAccount title="Entrá para armar equipos"><NewTeam /></NeedsAccount>} />
      <Route path="/equipos/:id" element={<TeamDetail />} />
      <Route path="/convocar/:gameId" element={<NeedsAccount title="Entrá para convocar"><NewCall /></NeedsAccount>} />
      <Route path="/historial" element={<History />} />
      <Route path="/ajustes" element={<Settings />} />
      <Route path="/club" element={<GroupPage />} />
      <Route path="/cuenta" element={<Profile />} />
      <Route path="/unirse/:code" element={<InviteRoute />} />
      <Route path="/c/:slug" element={<ShortLinkRoute />} />
      <Route path="/grupo" element={<GroupPage />} />
      <Route path="/grupos" element={<Groups />} />
      <Route path="/grupos/nuevo" element={<NewGroupPage />} />
      <Route path="/grupos/buscar" element={<SearchGroupsPage />} />
      <Route path="/amigos" element={<Friends />} />
      <Route path="/notificaciones" element={<Notifications />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="personas" element={<AdminPeople />} />
        <Route path="personas/:id" element={<AdminPerson />} />
        <Route path="clubes" element={<AdminClubs />} />
        <Route path="clubes/:code" element={<AdminClub />} />
        <Route path="juegos" element={<AdminGames />} />
        <Route path="juegos/:code/:id" element={<AdminGame />} />
        <Route path="reportes" element={<AdminReports />} />
        <Route path="papelera" element={<AdminTrash />} />
        <Route path="registro" element={<AdminLog />} />
        <Route path="control" element={<AdminControl />} />
        <Route path="salud" element={<AdminHealth />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
)
const ROUTES = createRoutesFromElements(routes)

export default function App() {
  return (
    <HashRouter>
      <Gate>
        <Suspense fallback={<PageLoader />}>
          <Routes>{routes}</Routes>
        </Suspense>
      </Gate>
      <FeedbackHost />
      <AccessHost />
      <Visits routes={ROUTES} />
    </HashRouter>
  )
}
