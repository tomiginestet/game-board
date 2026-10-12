import { HouseIcon, RankingIcon, SquaresFourIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { HashRouter, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AddGame, EditGame } from './pages/AddGame'
import { ClubPage } from './pages/ClubPage'
import { CupDetail } from './pages/CupDetail'
import { Cups } from './pages/Cups'
import { GameDetail } from './pages/GameDetail'
import { Games } from './pages/Games'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { NewCup } from './pages/NewCup'
import { NewPlay } from './pages/NewPlay'
import { MatchScreen } from './pages/pingpong/MatchScreen'
import { NewMatch } from './pages/pingpong/NewMatch'
import { NewTournament } from './pages/pingpong/NewTournament'
import { TournamentDetail } from './pages/pingpong/TournamentDetail'
import { PlayerDetail } from './pages/PlayerDetail'
import { Players } from './pages/Players'
import { PlayScreen } from './pages/PlayScreen'
import { Ranking } from './pages/Ranking'
import { Settings } from './pages/Settings'

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
          <Outlet />
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
    </HashRouter>
  )
}
