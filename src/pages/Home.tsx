import { ArrowRightIcon, GearSixIcon, PlusIcon, SquaresFourIcon, TrashIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { GameBadge, PlayRow } from '../components/GameBits'
import { PlaceMedal } from '../components/icons'
import { MatchRow } from '../components/MatchRow'
import { cupChampion } from '../lib/cups'
import { FEATURED, findGame } from '../lib/games'
import { gameOrMissing, useBoard, useGames, usePlayerMap } from '../lib/hooks'
import { tournamentChampion } from '../lib/pingpong/stats'
import { actions, useData } from '../lib/store'
import { SyncBadge } from './ClubPage'

export function Home() {
  const data = useData()
  const board = useBoard()
  const players = usePlayerMap()
  const games = useGames()

  const live = [
    ...data.plays.filter((p) => p.status === 'live' && !p.cupId).map((p) => ({ kind: 'play' as const, at: p.startedAt ?? p.createdAt, p })),
    ...data.matches.filter((m) => m.status === 'live').map((m) => ({ kind: 'match' as const, at: m.startedAt ?? m.createdAt, m })),
  ].sort((x, y) => y.at - x.at)

  const recent = [
    ...data.plays.filter((p) => p.status === 'finished').map((p) => ({ kind: 'play' as const, at: p.finishedAt ?? p.createdAt, p })),
    ...data.matches.filter((m) => m.status === 'finished').map((m) => ({ kind: 'match' as const, at: m.finishedAt ?? m.createdAt, m })),
  ]
    .sort((x, y) => y.at - x.at)
    .slice(0, 6)

  // Juegos para arrancar rápido: los más jugados por el grupo y, si no hay, los destacados.
  const playedCount = new Map<string, number>()
  for (const v of board.views) playedCount.set(v.gameId, (playedCount.get(v.gameId) ?? 0) + 1)
  const quick = [
    ...[...playedCount.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id),
    ...FEATURED,
  ]
    .filter((id, i, all) => all.indexOf(id) === i)
    .map((id) => findGame(data, id))
    .filter((g) => !!g)
    .slice(0, 8)

  const ranked = [...board.players.values()]
    .filter((s) => s.played > 0)
    .sort((a, b) => b.gloria - a.gloria || b.wins - a.wins)
    .slice(0, 3)

  const activeCups = [
    ...data.cups
      .filter((c) => !c.closedAt && cupChampion(c, data.plays.filter((p) => p.cupId === c.id), findGame(data, c.gameId)?.scoring.lowWins) === undefined)
      .map((c) => ({ id: c.id, name: c.name, gameId: c.gameId, to: `/torneos/${c.id}` })),
    ...data.tournaments.filter((t) => !tournamentChampion(t.id, data)).map((t) => ({ id: t.id, name: t.name, gameId: 'pingpong', to: `/ping-pong/torneos/${t.id}` })),
  ]

  return (
    <div className="page">
      <header className="home-header">
        <div className="grow">
          <h1 className="title-with-icon">
            <SquaresFourIcon className="title-icon" weight="duotone" /> Game Board
          </h1>
          <p className="muted">Partidas, torneos y quién manda en cada juego.</p>
        </div>
        <div className="header-tools">
          <SyncBadge />
          <Link to="/ajustes" className="tool-btn" aria-label="Ajustes" title="Ajustes y copia de seguridad">
            <GearSixIcon size={22} />
          </Link>
        </div>
      </header>

      <section>
        <div className="section-head">
          <h2>¿A qué jugamos?</h2>
          <Link to="/juegos">
            Todos ({games.length}) <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        </div>
        <div className="quick-games">
          {quick.map((g) => (
            <Link key={g.id} to={g.id === 'pingpong' ? '/ping-pong/nuevo' : `/jugar/${g.id}`} className="quick-game" style={{ ['--gc' as string]: g.color }}>
              <GameBadge game={g} size={44} />
              <span className="ellipsis">{g.name}</span>
            </Link>
          ))}
          <Link to="/juegos" className="quick-game more">
            <span className="game-badge add" aria-hidden>
              <PlusIcon />
            </span>
            <span>Otro juego</span>
          </Link>
        </div>
      </section>

      {data.players.length < 2 && (
        <div className="card onboarding">
          <h3>¡Arranquemos!</h3>
          <p>Primero creá a los jugadores del grupo. Después elegí un juego y anotá la primera partida.</p>
          <Link to="/jugadores" className="btn primary">
            <UsersIcon /> Crear jugadores
          </Link>
        </div>
      )}

      {live.length > 0 && (
        <section>
          <h2>En juego</h2>
          <div className="list">
            {live.map((x) =>
              x.kind === 'play' ? (
                <div key={x.p.id} className="live-item">
                  <PlayRow play={x.p} game={gameOrMissing(data, x.p.gameId)} players={players} />
                  <button className="link-btn danger-text small" onClick={() => confirm('¿Descartar esta partida sin terminar?') && actions.deletePlay(x.p.id)}>
                    <TrashIcon /> Descartar
                  </button>
                </div>
              ) : (
                <div key={x.m.id} className="live-item">
                  <MatchRow match={x.m} players={players} />
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {activeCups.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Torneos en curso</h2>
            <Link to="/torneos">
              Ver todos <ArrowRightIcon className="inline-icon" size="1em" />
            </Link>
          </div>
          <div className="list">
            {activeCups.map((c) => (
              <Link key={c.id} to={c.to} className="card cup-row">
                <GameBadge game={gameOrMissing(data, c.gameId)} size={36} />
                <span className="grow">
                  <b>{c.name}</b>
                  <span className="muted small block">{gameOrMissing(data, c.gameId).name}</span>
                </span>
                <TrophyIcon className="muted" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {ranked.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Podio de gloria</h2>
            <Link to="/ranking">
              Ver ranking <ArrowRightIcon className="inline-icon" size="1em" />
            </Link>
          </div>
          <div className="podium">
            {[ranked[1], ranked[0], ranked[2]].map((s, i) => {
              const p = s && players.get(s.playerId)
              return p ? (
                <Link key={p.id} to={`/jugadores/${p.id}`} className={'podium-spot place-' + [2, 1, 3][i]}>
                  <span className="podium-medal">
                    <PlaceMedal place={([2, 1, 3] as const)[i]} />
                  </span>
                  <Avatar player={p} size={i === 1 ? 64 : 48} />
                  <span className="podium-name">{p.name}</span>
                  <span className="podium-elo">✨ {s.gloria}</span>
                  <div className="podium-block" />
                </Link>
              ) : (
                <div key={i} className="podium-spot empty-spot" />
              )
            })}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Últimas partidas</h2>
            <Link to="/historial">
              Ver todo <ArrowRightIcon className="inline-icon" size="1em" />
            </Link>
          </div>
          <div className="list">
            {recent.map((x) =>
              x.kind === 'play' ? (
                <PlayRow key={x.p.id} play={x.p} game={gameOrMissing(data, x.p.gameId)} players={players} />
              ) : (
                <MatchRow key={x.m.id} match={x.m} players={players} />
              ),
            )}
          </div>
        </section>
      )}
    </div>
  )
}
