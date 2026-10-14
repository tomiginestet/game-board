import { ArrowRightIcon, CaretLeftIcon, CaretRightIcon, CheckCircleIcon, GearSixIcon, PlusIcon, TrashIcon, UsersIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom'
import { toast } from '../lib/feedback'
import { HeroCard, ShelfCard, Shelf } from '../components/GameCard'
import { GameCover } from '../components/GameCover'
import { GameBadge, PlayRow, playTitle, sideName } from '../components/GameBits'
import { Logo } from '../components/Logo'
import { MatchRow } from '../components/MatchRow'
import { NextMedals } from '../components/NextMedals'
import { GloriaPodium } from '../components/Squad'
import { cupChampion } from '../lib/cups'
import { computeLive } from '../lib/engine'
import { computeMatch } from '../lib/pingpong/scoring'
import { sidePlayers, teamName } from '../lib/pingpong/teams'
import { FEATURED, findGame, HERO, pickGames } from '../lib/games'
import type { Category, GameDef } from '../lib/games/schema'
import { gameOrMissing, useBoard, useGames, usePlayerMap } from '../lib/hooks'
import { tournamentChampion } from '../lib/pingpong/stats'
import { groupingOf, joinNames, planRematch, type RematchPlan } from '../lib/rematch'
import { actions, getData, useData } from '../lib/store'
import { syncAvailable, useSyncState } from '../lib/sync'
import type { Id, Play, Player, PPMatch as Match } from '../lib/types'
import { playPath } from './GameDetail'
import { formatWhen } from '../lib/schedule'

/** Estantes por categoría del inicio. */
const HOME_SHELVES: { cat: Category; title: string; subtitle: string }[] = [
  { cat: 'cartas', title: 'Noches de cartas', subtitle: 'Truco, buraco y compañía' },
  { cat: 'tcg', title: 'Duelos de cartas', subtitle: 'Magic, Pokémon, Yu-Gi-Oh! y compañía' },
  { cat: 'fiesta', title: 'Para la previa', subtitle: 'Juegos de fiesta para muchos' },
  { cat: 'mesa', title: 'Juegos de mesa', subtitle: 'Para sacar la caja y quedarse un rato' },
  { cat: 'deporte', title: 'A la cancha', subtitle: 'Fútbol, pádel, vóley y compañía' },
]

/** Se recuerda en el dispositivo si ya se cerró la guía de primeros pasos. */
const FIRST_STEPS_KEY = 'game-board-first-steps-closed'
function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

/** Descarta una partida en juego al toque y ofrece deshacerlo (no se pregunta antes). */
function discardPlay(play: Play, gameName: string) {
  actions.deletePlay(play.id)
  toast(`Descartaste la partida de ${gameName}.`, { label: 'Deshacer', run: () => actions.restorePlay(play) })
}

/**
 * Revancha directa desde "Jugar de nuevo": arranca con los mismos lados y reglas que la última
 * vez y ofrece "Cambiar", que descarta la partida recién creada y lleva al armado.
 */
function startRematch(game: GameDef, plan: RematchPlan, navigate: NavigateFunction) {
  const p = actions.createPlay(game.id, plan.sides, plan.config, plan.stake)
  navigate(`/partida/${p.id}`)
  const same = groupingOf(game, plan.from) === 'teams' ? 'Mismos equipos que la última vez' : 'Mismos jugadores que la última vez'
  toast(same, {
    label: 'Cambiar',
    run: () => {
      const now = getData().plays.find((x) => x.id === p.id)
      // Si la partida ya terminó (o no existe), "Cambiar" no borra nada: sólo lleva al armado.
      if (!now || now.status !== 'live') return navigate(playPath(game))
      actions.deletePlay(p.id)
      navigate(playPath(game), { replace: true })
      // Si ya se había anotado algo, se puede recuperar.
      if (now && now.log.length > 0) toast(`Descartaste la partida de ${game.name}.`, { label: 'Deshacer', run: () => actions.restorePlay(now) })
    },
  })
}

function discardMatch(match: Match) {
  actions.deleteMatch(match.id)
  toast('Descartaste el partido de ping pong.', { label: 'Deshacer', run: () => actions.restoreMatch(match) })
}

export function Home() {
  const data = useData()
  const board = useBoard()
  const players = usePlayerMap()
  const games = useGames()
  const sync = useSyncState()
  const navigate = useNavigate()
  const [stepsClosed, setStepsClosed] = useState(() => readFlag(FIRST_STEPS_KEY))

  const live = [
    ...data.plays.filter((p) => p.status === 'live' && !p.cupId).map((p) => ({ kind: 'play' as const, at: p.startedAt ?? p.createdAt, p })),
    ...data.matches.filter((m) => m.status === 'live').map((m) => ({ kind: 'match' as const, at: m.startedAt ?? m.createdAt, m })),
  ].sort((x, y) => y.at - x.at)

  // Partidos del fixture que vienen (o que arrancaron hace un rato y todavía no se anotaron).
  const [openedAt] = useState(() => Date.now())
  const soon = openedAt - 3 * 60 * 60 * 1000
  const upcoming = data.plays
    .filter((p) => p.status === 'pending' && p.scheduledAt !== undefined && p.scheduledAt >= soon)
    .sort((a, b) => a.scheduledAt! - b.scheduledAt!)
    .slice(0, 4)

  const recent = [
    ...data.plays.filter((p) => p.status === 'finished').map((p) => ({ kind: 'play' as const, at: p.finishedAt ?? p.createdAt, p })),
    ...data.matches.filter((m) => m.status === 'finished').map((m) => ({ kind: 'match' as const, at: m.finishedAt ?? m.createdAt, m })),
  ]
    .sort((x, y) => y.at - x.at)
    .slice(0, 5)

  // Cuántas veces y cuándo fue la última vez que el club jugó cada juego.
  const playedCount = new Map<string, number>()
  const lastPlayed = new Map<string, number>()
  for (const v of board.views) {
    playedCount.set(v.gameId, (playedCount.get(v.gameId) ?? 0) + 1)
    lastPlayed.set(v.gameId, Math.max(lastPlayed.get(v.gameId) ?? 0, v.at))
  }
  const byId = (ids: string[]) => pickGames(data, ids)
  const againGames = byId([...lastPlayed.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)).slice(0, 3)
  const topGames = byId([...playedCount.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)).slice(0, 10)
  // El carrusel: primero los más jugados por el club (si hay), después los elegidos.
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

  const hasPlayers = data.players.length >= 2
  const hasPlayed = data.plays.some((p) => p.status === 'finished') || data.matches.some((m) => m.status === 'finished')
  const showFirstSteps = !stepsClosed && !(hasPlayers && hasPlayed)
  const closeFirstSteps = () => {
    setStepsClosed(true)
    try {
      localStorage.setItem(FIRST_STEPS_KEY, '1')
    } catch {
      // Modo privado: se vuelve a mostrar la próxima vez, no pasa nada.
    }
  }

  return (
    <div className="page">
      <header className="home-header">
        <div className="grow">
          {syncAvailable ? (
            <>
              <h1 className="brand-title">¿A qué jugamos hoy?</h1>
              {sync.club && (
                <p className="muted">
                  En <b className="strong">{sync.club.name}</b>
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="brand-title title-with-icon">
                <Logo className="title-logo" size={30} /> Game Board
              </h1>
              <p className="muted">Partidas, torneos y quién manda en cada juego.</p>
            </>
          )}
        </div>
        {!syncAvailable && (
          <Link to="/ajustes" className="tool-btn" aria-label="Ajustes y copia de seguridad">
            <GearSixIcon size={22} />
          </Link>
        )}
      </header>

      {showFirstSteps ? (
        <section className="card first-steps" aria-labelledby="first-steps-title">
          <h2 id="first-steps-title">¡Arranquemos!</h2>
          <p className="muted">Dos pasos y la primera partida ya está en la tabla.</p>
          <ol className="steps">
            <li className={hasPlayers ? 'done' : ''}>
              {hasPlayers ? <CheckCircleIcon weight="fill" aria-hidden /> : <span className="step-num" aria-hidden>1</span>}
              <span>
                Creá a los jugadores del club <span className="sr-only">{hasPlayers ? '(listo)' : '(pendiente)'}</span>
              </span>
            </li>
            <li className={hasPlayed ? 'done' : ''}>
              {hasPlayed ? <CheckCircleIcon weight="fill" aria-hidden /> : <span className="step-num" aria-hidden>2</span>}
              <span>
                Elegí un juego y anotá la primera partida <span className="sr-only">{hasPlayed ? '(listo)' : '(pendiente)'}</span>
              </span>
            </li>
          </ol>
          {hasPlayers ? (
            <Link to="/anotar" className="btn primary block">
              <PlusIcon /> Anotar la primera partida
            </Link>
          ) : (
            <Link to="/jugadores" className="btn primary block">
              <UsersIcon /> Crear jugadores
            </Link>
          )}
          <button className="link-btn small" onClick={closeFirstSteps}>
            Ya sé cómo es
          </button>
        </section>
      ) : (
        <section className="quick-start" aria-label="Anotar una partida">
          <Link to="/anotar" className="btn primary big block">
            <PlusIcon /> Anotar una partida
          </Link>
          {againGames.length > 0 && (
            <div className="again">
              <span className="muted small" id="again-label">
                Jugar de nuevo
              </span>
              <ul className="again-list" aria-labelledby="again-label">
                {againGames.map((g) => {
                  // Con la última partida completa y válida, el chip arranca la revancha; si no, va al armado.
                  // Si ya hay una partida de este juego en curso, el chip la retoma en vez de abrir otra.
                  const ongoing = data.plays.find((p) => p.gameId === g.id && p.status === 'live' && !p.cupId)
                  const plan = ongoing ? undefined : planRematch(g, data.plays, players.keys())
                  const content = (
                    <>
                      <GameBadge game={g} size={26} />
                      <span className="ellipsis">{g.name}</span>
                    </>
                  )
                  return (
                    <li key={g.id}>
                      {plan ? (
                        <button
                          type="button"
                          className="again-chip"
                          onClick={() => startRematch(g, plan, navigate)}
                          aria-label={`Revancha de ${g.name} con ${joinNames(plan.playerIds.map((id) => players.get(id)?.name ?? '?'))}`}
                        >
                          {content}
                        </button>
                      ) : (
                        <Link to={ongoing ? `/partida/${ongoing.id}` : playPath(g)} className="again-chip" aria-label={ongoing ? `Seguir la partida de ${g.name}` : undefined}>
                          {content}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      {live.length > 0 && (
        <section aria-labelledby="live-title">
          <h2 id="live-title">En juego</h2>
          {/* Una lista: juego, quiénes, cómo va y hace cuánto. Tocar la fila vuelve a la partida; descartar es un ícono discreto. */}
          <ul className="live-list">
            {live.map((x) =>
              x.kind === 'play' ? (
                <LivePlayRow key={x.p.id} play={x.p} game={gameOrMissing(data, x.p.gameId)} players={players} />
              ) : (
                <LiveMatchRow key={x.m.id} match={x.m} players={players} game={gameOrMissing(data, 'pingpong')} />
              ),
            )}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-title">
          <h2 id="upcoming-title">Próximos partidos</h2>
          <div className="list">
            {upcoming.map((p) => {
              const g = gameOrMissing(data, p.gameId)
              const cup = p.cupId ? data.cups.find((c) => c.id === p.cupId) : undefined
              return (
                <Link key={p.id} to={`/partida/${p.id}`} className="card fixture-row">
                  <GameBadge game={g} size={36} />
                  <span className="grow">
                    <b>{playTitle(p, players, data.teams)}</b>
                    <span className="muted small block">
                      {formatWhen(p.scheduledAt!)}
                      {p.venue ? ` · ${p.venue}` : ''}
                      {cup ? ` · ${cup.name}` : ''}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {ranked.length > 0 && (
        <section aria-labelledby="podium-title">
          <div className="section-head">
            <h2 id="podium-title">Podio de gloria</h2>
            <SeeAll to="/ranking" label="Ver todo el ranking" />
          </div>
          <GloriaPodium top={ranked} />
        </section>
      )}

      {activeCups.length > 0 && (
        <section aria-labelledby="cups-title">
          <div className="section-head">
            <h2 id="cups-title">Torneos en curso</h2>
            <SeeAll to="/torneos" label="Ver todos los torneos" />
          </div>
          <div className="list rows">
            {activeCups.map((c) => (
              <Link key={c.id} to={c.to} className="cup-row">
                <GameBadge game={gameOrMissing(data, c.gameId)} size={36} />
                <span className="grow">
                  <b>{c.name}</b>
                  <span className="muted small block">{gameOrMissing(data, c.gameId).name}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <NextMedals />

      {recent.length > 0 ? (
        <section aria-labelledby="recent-title">
          <div className="section-head">
            <h2 id="recent-title">Últimas partidas</h2>
            <SeeAll to="/historial" label="Ver todo el historial" />
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
      ) : (
        !showFirstSteps &&
        hasPlayers && (
          <section className="card empty-state" aria-labelledby="recent-title">
            <h2 id="recent-title">Últimas partidas</h2>
            <p className="muted">Todavía no anotaron partidas. La primera siempre es la más discutida.</p>
          </section>
        )
      )}

      <HeroCarousel games={hero} plays={playedCount} />

      {topGames.length > 2 && (
        <Shelf title="Lo más jugado del club" to="/juegos?orden=jugados">
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
        <Shelf title="Hechos por el club" to="/juegos?cat=mine">
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
    </div>
  )
}

/** "Ver todo" de cada sección: mismo texto visible siempre, con destino claro para lectores de pantalla. */
function SeeAll({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="see-all" aria-label={label}>
      Ver todo <ArrowRightIcon className="inline-icon" size="1em" aria-hidden />
    </Link>
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

  // Con el foco en la fila, las flechas del teclado pasan de juego en juego.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight') go(Math.min(games.length - 1, active + 1))
    else if (e.key === 'ArrowLeft') go(Math.max(0, active - 1))
    else return
    e.preventDefault()
  }

  return (
    <section className="hero-carousel" aria-roledescription="carrusel" aria-labelledby="hero-title">
      <h2 id="hero-title">Para jugar hoy</h2>
      <div className="hero-track" ref={ref} onScroll={onScroll} onKeyDown={onKeyDown} tabIndex={0} role="region" aria-label="Juegos para jugar hoy. Usá las flechas para pasar.">
        {games.map((g, i) => (
          <HeroCard key={g.id} game={g} playTo={playPath(g)} plays={plays.get(g.id)} index={i} total={games.length} />
        ))}
      </div>
      {games.length > 1 && (
        <div className="hero-nav">
          <button className="hero-arrow" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label="Juego anterior">
            <CaretLeftIcon aria-hidden />
          </button>
          <div className="hero-dots">
            {games.map((g, i) => (
              // Fuera del orden de tabulación: con teclado se pasa con las flechas.
              <button key={g.id} className={'hero-dot' + (i === active ? ' active' : '')} onClick={() => go(i)} aria-label={`Ver ${g.name}`} aria-current={i === active} tabIndex={-1} />
            ))}
          </div>
          <button className="hero-arrow" onClick={() => go(Math.min(games.length - 1, active + 1))} disabled={active === games.length - 1} aria-label="Juego siguiente">
            <CaretRightIcon aria-hidden />
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
        <b>Ver el catálogo completo</b>
        <span className="cta-count">{games.length} juegos: cartas, mesa, fiesta, videojuegos y más</span>
      </span>
      <span className="cta-arrow" aria-hidden>
        <ArrowRightIcon />
      </span>
    </Link>
  )
}

/** Hace cuánto empezó: "25′", o "3 h 31′" si pasó más de una hora. */
function minutesSince(t?: number): string {
  if (!t) return ''
  const m = Math.max(0, Math.floor((Date.now() - t) / 60000))
  return m < 60 ? `${m}′` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}′`
}

/** Una partida en juego, en una fila: juego, quiénes (o a quién le toca), el marcador y hace cuánto empezó. */
function LivePlayRow({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const live = computeLive(game, play)
  const names = play.sides.map((s) => sideName(s, players)).join(' · ')
  const counts = game.mode === 'counter' || game.mode === 'sets' || game.mode === 'rounds' || game.mode === 'turns'
  const best = game.scoring.lowWins ? Math.min(...live.scores) : Math.max(...live.scores)
  const tied = live.scores.every((v) => v === best)
  const score = !counts || !play.log.length ? '' : play.sides.length === 2 ? live.scores.join('–') : tied ? '' : `${sideName(play.sides[live.scores.indexOf(best)], players)} ${best}`
  const sub = game.mode === 'turns' && live.turnCount ? `Turno ${live.turnCount} · le toca a ${sideName(play.sides[live.turn], players)}` : names
  return (
    <LiveRow to={`/partida/${play.id}`} game={game} sub={sub} score={score} since={play.startedAt ?? play.createdAt} onDiscard={() => discardPlay(play, game.name)} />
  )
}

function LiveMatchRow({ match, game, players }: { match: Match; game: GameDef; players: Map<Id, Player> }) {
  const state = computeMatch(match.points, match.config, match.firstServer)
  const team = (s: 'a' | 'b') => teamName(sidePlayers(match, s).map((id) => players.get(id)).filter((p): p is Player => !!p))
  return (
    <LiveRow
      to={`/partido/${match.id}`}
      game={game}
      sub={`${team('a')} · ${team('b')} · sets ${state.gamesWon.a}–${state.gamesWon.b}`}
      score={`${state.current.a}–${state.current.b}`}
      since={match.startedAt ?? match.createdAt}
      onDiscard={() => discardMatch(match)}
    />
  )
}

function LiveRow({ to, game, sub, score, since, onDiscard }: { to: string; game: GameDef; sub: string; score: string; since?: number; onDiscard: () => void }) {
  return (
    <li className="live-row">
      <Link to={to} className="live-link">
        <GameBadge game={game} size={34} />
        <span className="live-text">
          <b className="ellipsis">{game.name}</b>
          <span className="ellipsis">{sub}</span>
        </span>
        <span className="live-score num">
          {score && <b>{score}</b>}
          <small>
            <span className="live-dot" aria-hidden /> {minutesSince(since)}
            <span className="sr-only"> en juego</span>
          </small>
        </span>
      </Link>
      <button type="button" className="live-discard" onClick={onDiscard} aria-label={`Descartar la partida de ${game.name}`}>
        <TrashIcon aria-hidden />
      </button>
    </li>
  )
}
