import { HouseIcon, RankingIcon, SquaresFourIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { HashRouter, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Loader } from './components/Logo'
import { loaderForPath } from './lib/logo'
import { Home } from './pages/Home'

/** Cada pantalla se baja recién cuando se abre; mientras tanto se ve la animación de su momento. */
function page<M extends Record<string, unknown>, K extends keyof M>(load: () => Promise<M>, name: K) {
  return lazy(async () => ({ default: (await load())[name] as ComponentType }))
}
const AddGame = page(() => import('./pages/AddGame'), 'AddGame')
const EditGame = page(() => import('./pages/AddGame'), 'EditGame')
const ClubPage = page(() => import('./pages/ClubPage'), 'ClubPage')
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
const Players = page(() => import('./pages/Players'), 'Players')
const PlayScreen = page(() => import('./pages/PlayScreen'), 'PlayScreen')
const Ranking = page(() => import('./pages/Ranking'), 'Ranking')
const Settings = page(() => import('./pages/Settings'), 'Settings')

function PageLoader() {
  const location = useLocation()
  return <Loader kind={loaderForPath(location.pathname)} />
}

const NAV = [
  { to: '/', label: 'Inicio', Icon: HouseIcon, end: true },
  { to: '/juegos', label: 'Juegos', Icon: SquaresFourIcon },
  { to: '/torneos', label: 'Torneos', Icon: TrophyIcon },
  { to: '/ranking', label: 'Ranking', Icon: RankingIcon },
  { to: '/jugadores', label: 'Jugadores', Icon: UsersIcon },
]

function Layout() {
  const location = useLocation()
  return (
    <div className="app">
      <main className="content">
        {/* Se reinicia al cambiar de pantalla. */}
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <nav className="bottom-nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
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

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Marcador del ping pong a pantalla completa (el mismo del Ping Pong Club). */}
          <Route path="/partido/:id" element={<MatchScreen />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/juegos" element={<Games />} />
            <Route path="/juegos/nuevo" element={<AddGame />} />
            <Route path="/juegos/:id" element={<GameDetail />} />
            <Route path="/juegos/:id/editar" element={<EditGame />} />
            <Route path="/jugar/:gameId" element={<NewPlay />} />
            <Route path="/partida/:id" element={<PlayScreen />} />
            <Route path="/ping-pong/nuevo" element={<NewMatch />} />
            <Route path="/partido/nuevo" element={<NewMatch />} />
            <Route path="/ping-pong/torneo/nuevo" element={<NewTournament />} />
            <Route path="/ping-pong/torneos/:id" element={<TournamentDetail />} />
            <Route path="/torneos" element={<Cups />} />
            <Route path="/torneos/nuevo" element={<NewCup />} />
            <Route path="/torneos/:id" element={<CupDetail />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/jugadores" element={<Players />} />
            <Route path="/jugadores/:id" element={<PlayerDetail />} />
            <Route path="/historial" element={<History />} />
            <Route path="/ajustes" element={<Settings />} />
            <Route path="/club" element={<ClubPage />} />
            <Route path="/cuenta" element={<ClubPage />} />
            <Route path="/unirse/:code" element={<ClubPage />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
