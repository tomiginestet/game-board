import { ArrowRightIcon, CheckCircleIcon, GearSixIcon, PencilSimpleIcon, PlusIcon, TrashIcon, UsersIcon } from '@phosphor-icons/react'
import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom'
import { toast } from '../lib/feedback'
import { ClubHero, JoinRequests } from '../components/ClubHero'
import { ShelfCard, Shelf } from '../components/GameCard'
import { GameBadge, PlayRow, playTitle, sideName } from '../components/GameBits'
import { Logo } from '../components/Logo'
import { MatchRow } from '../components/MatchRow'
import { NextMedals } from '../components/NextMedals'
import { GloriaPodium, SquadShowcase, useSquadMedals } from '../components/Squad'
import { useClubGames } from '../lib/clubGames'
import { cupChampion } from '../lib/cups'
import { computeLive } from '../lib/engine'
import { computeMatch } from '../lib/pingpong/scoring'
import { sidePlayers, teamName } from '../lib/pingpong/teams'
import { findGame, pickGames } from '../lib/games'
import type { GameDef } from '../lib/games/schema'
import { gameOrMissing, useBoard, usePlayerMap } from '../lib/hooks'
import { tournamentChampion } from '../lib/pingpong/stats'
import { groupingOf, joinNames, planRematch, type RematchPlan } from '../lib/rematch'
import { canPickClubGames, useActiveGroup, type MyGroup } from '../lib/social'
import { actions, getData, useData } from '../lib/store'
import { syncAvailable, useSyncState } from '../lib/sync'
import type { Id, Play, Player, PPMatch as Match } from '../lib/types'
import { playPath } from './GameDetail'
import { formatWhen } from '../lib/schedule'
import { mayCreateNow } from '../lib/access'
import { lineup } from '../lib/calls'
import { useMyPlayerId } from '../lib/me'
import { skin } from '../skins'

// Equipos, integrantes e invitaciones: abajo de todo, se bajan aparte.
const ClubPeople = lazy(async () => ({ default: (await import('./social/ClubMembers')).ClubPeople }))

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
  if (!actions.deletePlay(play.id)) return
  toast(`Descartaste la partida de ${gameName}.`, { label: 'Deshacer', run: () => actions.restorePlay(play) })
}

/**
 * Revancha directa desde "Jugar de nuevo": arranca con los mismos lados y reglas que la última
 * vez y ofrece "Cambiar", que descarta la partida recién creada y lleva al armado.
 */
function startRematch(game: GameDef, plan: RematchPlan, navigate: NavigateFunction) {
  if (!mayCreateNow()) return
  const p = actions.createPlay(game.id, plan.sides, plan.config, plan.stake)
  navigate(`/partida/${p.id}`)
  const same = groupingOf(game, plan.from) === 'teams' ? 'Mismos equipos que la última vez' : 'Mismos jugadores que la última vez'
  toast(same, {
    label: 'Cambiar',
    run: () => {
      const now = getData().plays.find((x) => x.id === p.id)
      // Si la partida ya terminó (o no existe), "Cambiar" no borra nada: sólo lleva al armado.
      if (!now || now.status !== 'live') return navigate(playPath(game))
      if (!actions.deletePlay(p.id)) return
      navigate(playPath(game), { replace: true })
      // Si ya se había anotado algo, se puede recuperar.
      if (now && now.log.length > 0) toast(`Descartaste la partida de ${game.name}.`, { label: 'Deshacer', run: () => actions.restorePlay(now) })
    },
  })
}

function discardMatch(match: Match) {
  if (!actions.deleteMatch(match.id)) return
  toast('Descartaste el partido de ping pong.', { label: 'Deshacer', run: () => actions.restoreMatch(match) })
}

/**
 * La pantalla del club (o, sin club, la de este dispositivo): anotar, lo que está en juego y lo que viene,
 * los juegos del club, quién manda, torneos, medallas, últimas partidas y la gente del club.
 */
export function Home() {
  const data = useData()
  const board = useBoard()
  const players = usePlayerMap()
  const club = useClubGames()
  const group = useActiveGroup()
  const medals = useSquadMedals()
  const sync = useSyncState()
  const navigate = useNavigate()
  const [stepsClosed, setStepsClosed] = useState(() => readFlag(FIRST_STEPS_KEY))

  const live = [
    ...data.plays.filter((p) => p.status === 'live' && !p.cupId).map((p) => ({ kind: 'play' as const, at: p.startedAt ?? p.createdAt, p })),
    ...data.matches.filter((m) => m.status === 'live').map((m) => ({ kind: 'match' as const, at: m.startedAt ?? m.createdAt, m })),
  ].sort((x, y) => y.at - x.at)

  // Partidos del fixture que vienen (o que arrancaron hace un rato y todavía no se anotaron).
  const [openedAt] = useState(() => Date.now())
  const me = useMyPlayerId()
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

  // "Jugar de nuevo": los últimos que jugó el club.
  const againGames = pickGames(data, [...club.last.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)).slice(0, 3)

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
      {group ? (
        <>
          <ClubHero group={group} medals={medals.earned.length} />
          <JoinRequests group={group} />
        </>
      ) : (
        <header className="home-header">
          <div className="grow">
            {syncAvailable ? (
              <>
                <h1 className="brand-title">{skin.home.greeting}</h1>
                {sync.club && (
                  <p className="muted">
                    En <b className="strong">{sync.club.name}</b>
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="brand-title title-with-icon">
                  <Logo className="title-logo" size={30} /> {skin.name}
                </h1>
                <p className="muted">{skin.tagline}</p>
              </>
            )}
          </div>
          {!syncAvailable && (
            <Link to="/ajustes" className="tool-btn" aria-label="Ajustes y copia de seguridad">
              <GearSixIcon size={22} />
            </Link>
          )}
        </header>
      )}

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
                      {dayTag(p.scheduledAt!, openedAt) && <b className="day-tag">{dayTag(p.scheduledAt!, openedAt)}</b>}
                      {myStatus(p, me) && <b className={'my-status ' + myStatus(p, me)!.kind}>{myStatus(p, me)!.text}</b>}
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

      <ClubGamesShelf group={group} />

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

      {group ? <NextMedals playerIds={data.players.map((p) => p.id)} title="Medallas a la vista" /> : <NextMedals />}

      {recent.length > 0 ? (
        <section aria-labelledby="recent-title">
          <div className="section-head">
            <h2 id="recent-title">{skin.home.recent}</h2>
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
            <h2 id="recent-title">{skin.home.recent}</h2>
            <p className="muted">Todavía no anotaron partidas. La primera siempre es la más discutida.</p>
          </section>
        )
      )}

      {group && <SquadShowcase medals={medals.earned} title="Vitrina del club" max={4} />}

      {group && (
        <Suspense fallback={null}>
          <ClubPeople group={group} />
        </Suspense>
      )}
    </div>
  )
}

/**
 * Los juegos del club: los que eligió un admin o, si todavía no eligió, los que más juegan. Quien puede
 * elegirlos ve "Elegir" (o "Cambiar") en vez de "Ver todo".
 */
function ClubGamesShelf({ group }: { group?: MyGroup }) {
  const club = useClubGames()
  const editable = !!group && canPickClubGames(group)
  const chosen = club.chosen.length > 0
  const list = chosen ? club.chosen : club.mostPlayed.slice(0, 10)
  if (!list.length && !editable) return null

  const title = group ? (group.kind === 'duo' ? 'Lo que juegan' : 'Juegos del club') : 'Lo más jugado'
  const action = editable ? (
    <Link to="/club/juegos" className="shelf-all" aria-label={chosen ? 'Cambiar los juegos del club' : 'Elegir los juegos del club'}>
      <PencilSimpleIcon className="inline-icon" size="1em" aria-hidden /> {chosen ? 'Cambiar' : 'Elegir'}
    </Link>
  ) : undefined

  if (!list.length) {
    return (
      <section className="card empty-state" aria-labelledby="club-games-title">
        <h2 id="club-games-title">{title}</h2>
        <p className="muted">Elegí los juegos que tiene o juega el club: salen acá, primero en “Para jugar hoy” y primero al anotar.</p>
        <Link to="/club/juegos" className="btn">
          <PencilSimpleIcon /> Elegir juegos
        </Link>
      </section>
    )
  }
  return (
    <Shelf title={title} subtitle={chosen ? undefined : 'Los que más juegan'} to="/juegos?cat=mine" action={action}>
      {list.map((g) => (
        <ShelfCard key={g.id} game={g} plays={club.played.get(g.id)} />
      ))}
    </Shelf>
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

/** "Hoy" o "Mañana" para los partidos que vienen (nada si es más adelante). */
function dayTag(ts: number, now: number): string | undefined {
  const day = (t: number) => new Date(t).toDateString()
  if (day(ts) === day(now)) return 'Hoy'
  if (day(ts) === day(now + 24 * 60 * 60 * 1000)) return 'Mañana'
  return undefined
}

/** Tu respuesta a una convocatoria: vas, estás en espera o todavía no respondiste. */
function myStatus(play: Play, me: Id | undefined): { kind: string; text: string } | undefined {
  if (!me || !play.invited?.includes(me)) return undefined
  const { inIds, waitIds } = lineup(play, play.invited)
  if (inIds.includes(me)) return { kind: 'yes', text: 'Vas' }
  if (waitIds.includes(me)) return { kind: 'wait', text: 'En espera' }
  if (play.rsvp?.[me] === 'no') return { kind: 'no', text: 'No vas' }
  if (play.rsvp?.[me] === 'maybe') return { kind: 'maybe', text: 'Capaz' }
  return { kind: 'pending', text: '¿Venís?' }
}
