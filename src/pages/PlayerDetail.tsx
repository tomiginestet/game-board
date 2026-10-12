import { ArrowLeftIcon, PencilSimpleIcon, TrashIcon, UserCircleCheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { GameBadge, PlayRow } from '../components/GameBits'
import { LevelIcon } from '../components/icons'
import { MatchRow } from '../components/MatchRow'
import { MedalsSection } from '../components/MedalsSection'
import { PlayerForm } from '../components/PlayerForm'
import { Sparkline } from '../components/Sparkline'
import { claimPlayer, useAuth } from '../lib/auth'
import { gameOrMissing, plural, useBoard, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { gameMedals, globalMedals } from '../lib/medals'
import { involves } from '../lib/pingpong/teams'
import { globalStatsOf, levelFor, winRate } from '../lib/stats'
import { actions, useData } from '../lib/store'
import { useSyncState } from '../lib/sync'

export function PlayerDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const data = useData()
  const board = useBoard()
  const ppBoard = useLeaderboard()
  const players = usePlayerMap()
  const navigate = useNavigate()
  const auth = useAuth()
  const sync = useSyncState()
  const [editing, setEditing] = useState(false)
  const [claimMsg, setClaimMsg] = useState<string | null>(null)
  const player = data.players.find((p) => p.id === id)

  const s = player ? globalStatsOf(board, player.id) : undefined
  const perGame = s ? [...s.perGame.values()].sort((a, b) => b.played - a.played) : []
  const gameId = params.get('juego') ?? perGame[0]?.gameId

  if (!player || !s) {
    return (
      <div className="page">
        <p>Jugador no encontrado.</p>
        <Link to="/jugadores" className="back">
          <ArrowLeftIcon /> Volver
        </Link>
      </div>
    )
  }

  const gs = gameId ? s.perGame.get(gameId) : undefined
  const game = gameId ? gameOrMissing(data, gameId) : undefined
  const position =
    [...board.players.values()].filter((x) => x.played > 0).sort((a, b) => b.gloria - a.gloria).findIndex((x) => x.playerId === player.id) + 1

  const history = [
    ...data.plays.filter((p) => p.status === 'finished' && p.sides.some((x) => x.players.includes(player.id))).map((p) => ({ k: 'play' as const, at: p.finishedAt ?? 0, p })),
    ...data.matches.filter((m) => m.status === 'finished' && involves(m, player.id)).map((m) => ({ k: 'match' as const, at: m.finishedAt ?? 0, m })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 10)

  const hasPlayed =
    data.matches.some((m) => involves(m, player.id)) ||
    data.tournaments.some((t) => t.playerIds.includes(player.id)) ||
    data.plays.some((p) => p.sides.some((x) => x.players.includes(player.id))) ||
    data.cups.some((c) => c.entrants.some((e) => e.players.includes(player.id)))

  const claim = async () => {
    if (!sync.club) return
    try {
      await claimPlayer(sync.club.code, player.id)
      setClaimMsg('¡Listo! Este jugador quedó asociado a tu cuenta.')
    } catch (e) {
      setClaimMsg((e as Error).message)
    }
  }

  return (
    <div className="page">
      <Link to="/jugadores" className="back">
        <ArrowLeftIcon /> Jugadores
      </Link>

      {editing ? (
        <PlayerForm
          initial={player}
          submitLabel="Guardar"
          onSubmit={(v) => {
            actions.updatePlayer(player.id, v)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <header className="profile" style={{ ['--player-color' as string]: player.color }}>
          <button className="btn small profile-edit" onClick={() => setEditing(true)}>
            <PencilSimpleIcon /> Editar
          </button>
          <Avatar player={player} size={88} />
          <h1>{player.name}</h1>
          <div className="profile-elo">
            <span className="big-number">✨ {s.gloria}</span>
            <span className="muted">puntos de gloria{position ? ` · #${position} del grupo` : ''}</span>
          </div>
        </header>
      )}

      <div className="stat-grid">
        <Stat label="Partidas" value={s.played} />
        <Stat label="Ganadas" value={s.wins} />
        <Stat label="Efectividad" value={`${Math.round(winRate(s) * 100)}%`} />
        <Stat label="Juegos" value={`${s.gamesWon}/${s.gamesPlayed}`} hint="ganados / jugados" />
        <Stat label="Torneos" value={s.cupsWon} />
        <Stat label="Racha máx." value={s.bestStreak} />
      </div>

      <MedalsSection title="Medallas generales" list={globalMedals(s)} />

      {perGame.length > 0 && (
        <section>
          <h2>Por juego</h2>
          <div className="chips scroll">
            {perGame.map((x) => {
              const g = gameOrMissing(data, x.gameId)
              return (
                <button key={x.gameId} className={'chip' + (x.gameId === gameId ? ' active' : '')} onClick={() => setParams({ juego: x.gameId }, { replace: true })}>
                  {g.emoji} {g.name} <span className="muted">{x.played}</span>
                </button>
              )
            })}
          </div>
          {gs && game && (
            <div className="card game-stats">
              <div className="row">
                <GameBadge game={game} size={44} />
                <div className="grow">
                  <Link to={`/juegos/${game.id}`}>
                    <b>{game.name}</b>
                  </Link>
                  <span className="muted small block">
                    {game.mode === 'coop'
                      ? `${plural(gs.coopWins, 'victoria', 'victorias')} en equipo de ${gs.played}`
                      : `${gs.wins}G ${gs.losses}P${gs.draws ? ` ${gs.draws}E` : ''} · ${Math.round(winRate(gs) * 100)}%${gs.cupsWon ? ` · ${plural(gs.cupsWon, 'torneo', 'torneos')}` : ''}`}
                  </span>
                </div>
                {game.mode !== 'coop' && (
                  <span className="rank-value">
                    <LevelIcon icon={levelFor(gs.elo).icon} /> {gs.elo}
                  </span>
                )}
              </div>
              {gs.eloHistory.length > 2 && <Sparkline values={gs.eloHistory} />}
            </div>
          )}
          {gs && game && <MedalsSection title={`Medallas de ${game.name}`} list={gameMedals(game, gs, ppBoard.stats.get(player.id))} />}
        </section>
      )}

      {history.length > 0 && (
        <section>
          <h2>Últimas partidas</h2>
          <div className="list">
            {history.map((x) =>
              x.k === 'play' ? (
                <PlayRow key={x.p.id} play={x.p} game={gameOrMissing(data, x.p.gameId)} players={players} focus={player.id} />
              ) : (
                <MatchRow key={x.m.id} match={x.m} players={players} perspective={player.id} />
              ),
            )}
          </div>
        </section>
      )}

      {auth.session && sync.club && (
        <div className="card">
          <button className="btn block" onClick={claim}>
            <UserCircleCheckIcon /> Este jugador soy yo
          </button>
          {claimMsg && <p className="small mt">{claimMsg}</p>}
        </div>
      )}

      {!hasPlayed && (
        <button
          className="btn danger block mt"
          onClick={() => {
            if (confirm(`¿Borrar a ${player.name}?`) && actions.deletePlayer(player.id)) navigate('/jugadores')
          }}
        >
          <TrashIcon /> Borrar jugador
        </button>
      )}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="stat" title={hint}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
