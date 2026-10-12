import { ArrowRightIcon, CaretLeftIcon, CaretRightIcon, GearSixIcon, TrashIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { HeroCard, ShelfCard, Shelf } from '../components/GameCard'
import { GameCover } from '../components/GameCover'
import { GameBadge, PlayRow } from '../components/GameBits'
import { PlaceMedal } from '../components/icons'
import { Logo } from '../components/Logo'
import { MatchRow } from '../components/MatchRow'
import { NextMedals } from '../components/NextMedals'
import { SyncBadge } from '../components/SyncBadge'
import { cupChampion } from '../lib/cups'
import { FEATURED, findGame, HERO, pickGames } from '../lib/games'
import type { Category, GameDef } from '../lib/games/schema'
import { gameOrMissing, useBoard, useGames, usePlayerMap } from '../lib/hooks'
import { tournamentChampion } from '../lib/pingpong/stats'
import { actions, useData } from '../lib/store'
import { syncAvailable } from '../lib/sync'
import { playPath } from './GameDetail'

/** Estantes por categoría del inicio. */
const HOME_SHELVES: { cat: Category; title: string; subtitle: string }[] = [
  { cat: 'cartas', title: 'Noches de cartas', subtitle: 'Truco, buraco y compañía' },
  { cat: 'fiesta', title: 'Para la previa', subtitle: 'Juegos de fiesta para muchos' },
  { cat: 'mesa', title: 'Juegos de mesa', subtitle: 'Para sacar la caja y quedarse un rato' },
]

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

  // Cuántas veces y cuándo fue la última vez que el grupo jugó cada juego.
  const playedCount = new Map<string, number>()
  const lastPlayed = new Map<string, number>()
  for (const v of board.views) {
    playedCount.set(v.gameId, (playedCount.get(v.gameId) ?? 0) + 1)
    lastPlayed.set(v.gameId, Math.max(lastPlayed.get(v.gameId) ?? 0, v.at))
  }
  const byId = (ids: string[]) => pickGames(data, ids)
  const continueGames = byId([...lastPlayed.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)).slice(0, 10)
  const topGames = byId([...playedCount.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)).slice(0, 10)
  // El carrusel: primero los más jugados por el grupo (si hay), después los elegidos.
  const hero = byId([...topGames.slice(0, 2).map((g) => g.id), ...HERO]).slice(0, 6)
  const featured = byId(FEATURED)
  const shelfOf = (cat: Category) => games.filter((g) => g.category === cat).sort((a, b) => (playedCount.get(b.id) ?? 0) - (playedCount.get(a.id) ?? 0))
  const custom = games.filter((g) => g.source && g.source !== 'builtin')

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
      {/* Con sincronización, el nombre del grupo y los accesos van en la barra de arriba. */}
      {!syncAvailable && (
        <header className="home-header">
          <div className="grow">
            <h1 className="title-with-icon">
              <Logo className="title-logo" size={30} /> Game Board
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

      <HeroCarousel games={hero} plays={playedCount} />

      {continueGames.length > 0 && (
        <Shelf title="Seguir jugando" subtitle="Lo último que se jugó en el grupo" to="/juegos?cat=mine">
          {continueGames.map((g) => (
            <ShelfCard key={g.id} game={g} plays={playedCount.get(g.id)} />
          ))}
        </Shelf>
      )}

      {topGames.length > 2 && (
        <Shelf title="Lo más jugado del grupo" to="/juegos?orden=jugados">
          {topGames.map((g, i) => (
            <ShelfCard key={g.id} game={g} note={`#${i + 1}`} />
          ))}
        </Shelf>
      )}

      <Shelf title="Destacados" subtitle="Los infaltables de cualquier juntada" to="/juegos">
        {featured.map((g) => (
          <ShelfCard key={g.id} game={g} plays={playedCount.get(g.id)} />
        ))}
      </Shelf>

      {custom.length > 0 && (
        <Shelf title="Hechos por el grupo" to="/juegos?cat=mine">
          {custom.map((g) => (
            <ShelfCard key={g.id} game={g} plays={playedCount.get(g.id)} />
          ))}
        </Shelf>
      )}

      {HOME_SHELVES.map((sh) => {
        const list = shelfOf(sh.cat)
        return list.length > 0 ? (
          <Shelf key={sh.cat} title={sh.title} subtitle={sh.subtitle} to={`/juegos?cat=${sh.cat}`}>
            {list.map((g) => (
              <ShelfCard key={g.id} game={g} plays={playedCount.get(g.id)} />
            ))}
          </Shelf>
        ) : null
      })}

      <CatalogCta games={games} />

      {data.players.length < 2 && (
        <div className="card onboarding">
          <h3>¡Arranquemos!</h3>
          <p>Primero creá a los jugadores del grupo. Después elegí un juego y anotá la primera partida.</p>
          <Link to="/jugadores" className="btn primary">
            <UsersIcon /> Crear jugadores
          </Link>
        </div>
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

      <NextMedals />

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

/** Carrusel grande de arriba: banners con scroll-snap, flechas y puntitos. */
function HeroCarousel({ games, plays }: { games: GameDef[]; plays: Map<string, number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  if (!games.length) return null

  const go = (i: number) => {
    const el = ref.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let dist = Infinity
    Array.from(el.children).forEach((c, i) => {
      const card = c as HTMLElement
      const d = Math.abs(card.offsetLeft - el.offsetLeft + card.clientWidth / 2 - mid)
      if (d < dist) {
        dist = d
        best = i
      }
    })
    if (best !== active) setActive(best)
  }

  return (
    <section className="hero-carousel" aria-roledescription="carrusel" aria-label="Juegos destacados">
      <div className="hero-track" ref={ref} onScroll={onScroll}>
        {games.map((g, i) => (
          <HeroCard key={g.id} game={g} playTo={playPath(g)} plays={plays.get(g.id)} index={i} total={games.length} />
        ))}
      </div>
      {games.length > 1 && (
        <div className="hero-nav">
          <button className="hero-arrow" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label="Anterior">
            <CaretLeftIcon />
          </button>
          <div className="hero-dots">
            {games.map((g, i) => (
              <button key={g.id} className={'hero-dot' + (i === active ? ' active' : '')} onClick={() => go(i)} aria-label={`Ver ${g.name}`} aria-current={i === active} />
            ))}
          </div>
          <button className="hero-arrow" onClick={() => go(Math.min(games.length - 1, active + 1))} disabled={active === games.length - 1} aria-label="Siguiente">
            <CaretRightIcon />
          </button>
        </div>
      )}
    </section>
  )
}

/** Entrada grande al catálogo completo, con un collage de carátulas. */
function CatalogCta({ games }: { games: GameDef[] }) {
  const collage = ['catan', 'truco', 'mariokart', 'pandemic', 'generala', 'dixit', 'ajedrez'].map((id) => games.find((g) => g.id === id)).filter((g): g is GameDef => !!g)
  return (
    <Link to="/juegos" className="catalog-cta">
      <span className="cta-collage" aria-hidden>
        {collage.map((g) => (
          <GameCover key={g.id} game={g} showTitle={false} decorative />
        ))}
      </span>
      <span className="cta-text">
        <span className="cta-kicker">Catálogo</span>
        <b>Explorar catálogo completo</b>
        <span className="cta-count">{games.length} juegos · cartas, mesa, fiesta, videojuegos y más</span>
      </span>
      <span className="cta-arrow" aria-hidden>
        <ArrowRightIcon />
      </span>
    </Link>
  )
}
