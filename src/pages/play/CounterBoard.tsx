import { ArrowsLeftRightIcon, CaretDownIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { Tally } from '../../components/Tally'
import { optionValue, targetOf, type LiveState } from '../../lib/engine'
import { formatElapsed } from '../../lib/pingpong/scoring'
import { setsLine } from '../../lib/sets'
import { vibrate } from '../../lib/vibrate'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions, useData } from '../../lib/store'
import type { Id, Play, PlaySide, Player } from '../../lib/types'
import { usePlayToggle, useTapGuard } from './playHooks'
import { KeyHint } from './KeyHint'
import { PointsDialog, WhoDialog } from './shared'
import { BoardTabs, lastText } from './BoardTabs'
import { ClockBar } from './ClockBar'
import { sideKeys, undoLast, useScoreKeys } from './useScoreKeys'
import { say } from '../../skins/say'

/** Cuántas jugadas se muestran de entrada por lado; el resto queda detrás de "Ver todo". */
/** Con pocas jugadas se muestran todas; con muchas, las más usadas y el resto en "Ver todo". */
const SHOW_ALL_UP_TO = 8
const PRIMARY_EVENTS = 6

export function CounterBoard({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const data = useData()
  const target = targetOf(game, play.config)
  const quick = game.scoring.quick?.length ? game.scoring.quick : [1]
  // Los eventos de flor sólo aparecen si se juega con flor (la opción puede venir del valor por defecto).
  const flor = optionValue(game, play.config, 'flor')
  const events = game.events.filter((e) => !e.global && !(e.id.toLowerCase().includes('flor') && flor === false))
  const globals = game.events.filter((e) => e.global)
  const two = play.sides.length === 2
  // Un solo partido de dos lados (bochas, básquet, truco): dos columnas, cada una con su zona grande y la lista
  // de jugadas debajo. Con sets o más de dos lados: tira de TV y bandas apiladas, como el ping pong.
  const columns = two && !live.sets
  const leader = Math.max(...live.scores)
  const [asking, setAsking] = useState<{ s: number; e: EventDef; suggestion?: number } | null>(null)
  // "¿Quién lo hizo?": un punto (gol) o un evento de un jugador, de un lado.
  const [askingWho, setAskingWho] = useState<{ s: number; n: number; e?: EventDef } | null>(null)
  const per = game.perPlayer
  const sidePeople = (s: number) => play.sides[s]?.players.map((id) => players.get(id)).filter((p): p is Player => !!p) ?? []
  // Del plantel del equipo fijo, los que no estaban anotados en la partida (llegaron tarde, refuerzos).
  const extraPeople = (s: number) => {
    const team = play.sides[s]?.teamId ? data.teams.find((t) => t.id === play.sides[s].teamId) : undefined
    const inPlay = new Set(play.sides.flatMap((x) => x.players))
    return (team?.players ?? []).filter((id) => !inPlay.has(id)).map((id) => players.get(id)).filter((p): p is Player => !!p)
  }
  /** Suma `n` al lado `s`: si el juego anota quién, pregunta (salvo que haya uno solo para elegir). */
  const score = (s: number, n: number) => {
    vibrate()
    if (per?.scorer) {
      const people = sidePeople(s)
      if (people.length === 1 && !extraPeople(s).length && !per.assists) return actions.log(play.id, { k: 'pt', s, n, pl: people[0].id })
      return setAskingWho({ s, n })
    }
    actions.log(play.id, { k: 'pt', s, n })
  }
  const whoDone = (who: { pl?: Id; as?: Id }) => {
    if (!askingWho) return
    const { s, n, e } = askingWho
    for (const id of [who.pl, who.as]) if (id && !play.sides[s].players.includes(id)) actions.addToSide(play.id, s, id)
    if (e) actions.log(play.id, { k: 'ev', s, e: e.id, n: 1, ...(who.pl ? { pl: who.pl } : {}) })
    else actions.log(play.id, { k: 'pt', s, n, ...(who.pl ? { pl: who.pl } : {}), ...(who.as ? { as: who.as } : {}) })
    setAskingWho(null)
  }
  const [expanded, setExpanded] = usePlayToggle(`more:${play.id}`)

  // Jugadas de entrada: las más usadas en las partidas anteriores de este juego (si no hay historial,
  // las primeras de la ficha) más las que ya se usaron en esta. Se fija al abrir, para que nada salte de lugar.
  const history = useMemo(() => {
    const freq: Record<string, number> = {}
    for (const p of data.plays) {
      if (p.gameId !== game.id || p.id === play.id) continue
      for (const e of p.log) if (e.k === 'ev') freq[e.e] = (freq[e.e] ?? 0) + 1
    }
    return freq
  }, [data.plays, game.id, play.id])
  const [primaryIds] = useState(() => {
    const ranked = events.map((e, i) => ({ e, i })).sort((a, b) => (history[b.e.id] ?? 0) - (history[a.e.id] ?? 0) || a.i - b.i)
    const ids = new Set(ranked.slice(0, events.length <= SHOW_ALL_UP_TO ? events.length : PRIMARY_EVENTS).map((x) => x.e.id))
    for (const e of events) if (live.counts[e.id]?.some((n) => n > 0)) ids.add(e.id)
    // Esconder una sola jugada no ahorra nada.
    if (events.length - ids.size <= 1) for (const e of events) ids.add(e.id)
    return ids
  })
  const primary = events.filter((e) => primaryIds.has(e.id))
  const rare = events.filter((e) => !primaryIds.has(e.id))
  const shown = expanded ? [...primary, ...rare] : primary
  const helpItems = [...events, ...globals].filter((e) => e.help)

  const tap = (s: number, e?: EventDef) => {
    if (!e) return score(s, quick[0])
    vibrate()
    if (e.type === 'holder') return actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
    if (e.byPlayer) {
      const people = sidePeople(s)
      if (people.length === 1 && !extraPeople(s).length) return actions.log(play.id, { k: 'ev', s, e: e.id, n: 1, pl: people[0].id })
      return setAskingWho({ s, n: 1, e })
    }
    if (e.askPoints) {
      const suggestion = target !== undefined ? Math.max(1, target - leader) : undefined
      return setAsking({ s, e, suggestion: e.id.toLowerCase().includes('falta') ? suggestion : undefined })
    }
    actions.log(play.id, { k: 'ev', s, e: e.id, n: 1 })
  }

  // Teclado (en la compu): cada lado tiene su tecla y suma lo mismo que tocar su zona grande; Z o Backspace deshace.
  // Con el diálogo de puntos abierto, el teclado es del diálogo; con la partida cerrada, no se anota nada.
  const keys = sideKeys(play.sides.length)
  useScoreKeys(play.status !== 'finished' && !asking && !askingWho, (key) => {
    if (key === 'z' || key === 'backspace') return undoLast(play, game, players)
    // Con dos lados, A/L y también 1/2.
    const s = keys.indexOf(key) >= 0 ? keys.indexOf(key) : two && (key === '1' || key === '2') ? Number(key) - 1 : -1
    if (s < 0) return false
    tap(s)
    return true
  })
  const keyItems = [
    ...(play.sides.length <= 4
      ? keys.map((k, s) => ({ keys: [k.toUpperCase()], label: `suma a ${sideName(play.sides[s], players)}` }))
      : [{ keys: [`1–${keys.length}`], label: 'suman a cada lado, en orden' }]),
    { keys: ['Z'], label: 'deshace' },
  ]

  return (
    <>
      {asking && (
        <PointsDialog
          event={asking.e}
          suggestion={asking.suggestion}
          onCancel={() => setAsking(null)}
          onSubmit={(p) => {
            actions.log(play.id, { k: 'ev', s: asking.s, e: asking.e.id, n: 1, p })
            setAsking(null)
          }}
        />
      )}
      {askingWho && (
        <WhoDialog
          title={askingWho.e ? `${askingWho.e.emoji} ${askingWho.e.name}: ¿quién?` : `¿Quién hizo ${askingWho.n === 1 && per?.unitOne ? `el ${per.unitOne}` : `los ${per?.unit ?? 'puntos'}`}?`}
          assistTitle={!askingWho.e && per?.assists ? '¿Quién dio el pase?' : undefined}
          people={sidePeople(askingWho.s)}
          extra={extraPeople(askingWho.s)}
          onCancel={() => setAskingWho(null)}
          onSubmit={whoDone}
        />
      )}
      {game.scoring.clock && <ClockBar play={play} game={game} />}
      {columns ? <MatchLine play={play} game={game} players={players} /> : <ScoreStrip play={play} game={game} live={live} players={players} />}
      {live.sets && <SetsStrip live={live} />}
      {live.sets && !live.sets.played && (
        <button type="button" className="link-btn small center-block serve-switch" onClick={() => actions.patchPlay(play.id, { firstServer: live.sets!.server === 0 ? 1 : 0 })}>
          <ArrowsLeftRightIcon className="inline-icon" aria-hidden="true" /> Cambiar quién saca primero
        </button>
      )}
      <BoardTabs play={play} game={game} players={players} help={helpItems}>
        <div className={columns ? 'cols' : 'bands' + (two ? ' two' : '')}>
          {play.sides.map((side, s) => (
            <section key={s} className={columns ? 'col' : 'band'} style={{ ['--pc' as string]: sideColor(side, players) }} aria-label={sideName(side, players)}>
              <SideScore side={side} score={live.scores[s]} game={game} target={target} quick={quick[0]} players={players} shortcut={keys[s]?.toUpperCase()} onTap={() => tap(s)} live={live} index={s} hint={!play.log.length} progress={columns} />
              {(shown.length > 0 || quick.length > 1) && (
                <div className="band-acts" role="group" aria-label={`Jugadas de ${sideName(side, players)}`}>
                  {quick.slice(1).map((n) => (
                    <button key={n} type="button" className="band-act pts" onClick={() => score(s, n)}>
                      +{n}
                    </button>
                  ))}
                  {shown.map((e) => {
                    // El contador en cero sólo en las jugadas que no suman puntos (las que cuentan para medallas);
                    // en las que suman (envido, truco), el número aparece recién cuando pasó.
                    const n = e.type === 'count' ? live.counts[e.id]?.[s] ?? 0 : 0
                    const count = e.type === 'count' && (n > 0 || (!e.points && !e.askPoints)) ? n : undefined
                    return (
                      <button key={e.id} type="button" className="band-act" onClick={() => tap(s, e)}>
                        <span className="band-act-name">
                          {e.name}
                          {e.points && !e.askPoints ? <small> +{e.points}</small> : null}
                        </span>
                        {count !== undefined && (
                          <b className={'band-act-count num' + (count ? '' : ' zero')}>
                            <span className="sr-only">, anotado </span>
                            {count}
                            <span className="sr-only"> {count === 1 ? 'vez' : 'veces'}</span>
                          </b>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
        {rare.length > 0 && (
          <button type="button" className="more-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
            <CaretDownIcon className={expanded ? 'flip' : undefined} aria-hidden="true" />
            {expanded ? 'Ver menos jugadas' : `Ver todas las jugadas (${rare.length} más)`}
          </button>
        )}
        {globals.length > 0 && (
          <div className="chips center">
            {globals.map((e) => (
              <button key={e.id} type="button" className="chip" onClick={() => (vibrate(), actions.log(play.id, { k: 'ev', s: -1, e: e.id, n: 1 }))}>
                {e.name} {live.globalCounts[e.id] ? <b className="chip-count">{live.globalCounts[e.id]}</b> : null}
              </button>
            ))}
          </div>
        )}
        <KeyHint items={keyItems} />
      </BoardTabs>
    </>
  )
}

/** Zona grande de cada lado: un toque suma; un arrastre o un scroll, no. */
function SideScore({ side, score, game, target, quick, players, shortcut, onTap, live, index, hint, progress }: { side: PlaySide; score: number; game: GameDef; target?: number; quick: number; players: Map<Id, Player>; shortcut?: string; onTap: () => void; live: LiveState; index: number; hint: boolean; progress?: boolean }) {
  const guard = useTapGuard(onTap)
  const malas = game.scoring.tally === 'matches' && target && target >= 20 ? target / 2 : undefined
  const name = sideName(side, players)
  const sets = live.sets
  if (sets) {
    const tennis = game.scoring.sets?.kind === 'tennis'
    // En dobles de tenis y pádel, dentro de la pareja saca uno por vez, turno y turno.
    const team = sidePlayersOf(side, players)
    const server = tennis && team.length > 1 && sets.server === index ? team[(Math.max(1, sets.serveTurns[index]) - 1) % team.length] : undefined
    return (
      <button type="button" className="counter-main sets-main" aria-keyshortcuts={shortcut} {...guard}>
        <span className="cs-name">
          <TeamAvatar team={sidePlayersOf(side, players)} size={28} /> <span className="ellipsis">{name}</span>
        </span>
        <span key={sets.call[index] + sets.played} className="cs-score" aria-label={`${sets.call[index]} en este ${tennis && !sets.tiebreak ? 'game' : sets.tiebreak ? 'tie-break' : 'set'}`}>
          {sets.call[index]}
        </span>
        {sets.winner === undefined && sets.server === index && (
          <span className="sets-serve">
            <span className="serve-ball" aria-hidden="true" />
            {server ? `Saca ${server.name}` : 'Saca'}
          </span>
        )}
        <span className="cs-sub sets-sub">
          <span>
            Sets <b className="num">{sets.won[index]}</b>
          </span>
          {tennis && !sets.superTb && (
            <span>
              Games <b className="num">{sets.current[index]}</b>
            </span>
          )}
        </span>
        {hint && <span className="cs-hint">Tocá para sumar un punto</span>}
      </button>
    )
  }
  return (
    <button type="button" className="counter-main" aria-keyshortcuts={shortcut} {...guard}>
      <span className="cs-name">
        <TeamAvatar team={sidePlayersOf(side, players)} size={28} /> <span className="ellipsis">{name}</span>
      </span>
      <span key={score} className="cs-score">
        {score}
      </span>
      {malas !== undefined && <span className="cs-sub">{score < malas ? 'en las malas' : 'en las buenas'}</span>}
      {game.scoring.tally === 'matches' && <Tally value={score} target={target ?? 30} />}
      {/* Cada lado con su propia barra: cuánto lleva de la meta y cuánto le falta (el truco ya lo dice con los fósforos). */}
      {progress && target && !game.scoring.lowWins && game.scoring.tally !== 'matches' && (
        <span className="cs-progress">
          <span className="cs-bar" aria-hidden>
            <i style={{ width: `${Math.min(100, (score / target) * 100)}%` }} />
          </span>
          <span className="cs-left num">{score >= target ? 'Llegó' : `Faltan ${target - score}`}</span>
        </span>
      )}
      {/* La pista sólo hace falta antes del primer punto; después, el toque se aprende solo. */}
      {hint && (
        <span className="cs-hint">
          Tocá para sumar {quick === 1 ? 'uno' : quick}
          {game.scoring.quickLabel ? ` (${game.scoring.quickLabel.toLowerCase()})` : ''}
        </span>
      )}
    </button>
  )
}

/**
 * La tira de TV, como en el ping pong: tiempo de partida, lo último que se anotó (confirma el toque sin mirar
 * el historial) y una fila por lado con sus jugadas y el puntaje. Con más de dos lados, ordenada por puntaje.
 */
function ScoreStrip({ play, game, live, players }: { play: Play; game: GameDef; live: LiveState; players: Map<Id, Player> }) {
  const sets = live.sets
  const value = (s: number) => (sets ? sets.won[s] : live.scores[s])
  const order = play.sides.map((_, s) => s)
  if (play.sides.length > 2) order.sort((a, b) => (game.scoring.lowWins ? value(a) - value(b) : value(b) - value(a)))
  const values = play.sides.map((_, s) => value(s))
  const best = game.scoring.lowWins ? Math.min(...values) : Math.max(...values)
  const leader = play.log.length && values.filter((v) => v === best).length === 1 ? values.indexOf(best) : -1
  const last = play.log.at(-1)
  const target = targetOf(game, play.config)
  return (
    <div className="tv-strip num">
      <p className="tvs-head">
        <span>
          <Clock from={play.startedAt} /> {say('de partida')}
        </span>
        <span className="tvs-last">{last ? `Último: ${lastText(play, game, players, last)}` : target ? `Gana el primero a ${target}` : ''}</span>
      </p>
      {order.map((s) => (
        <div key={s} className={'tvs-row' + (s === leader ? ' lead' : '')} style={{ ['--pc' as string]: sideColor(play.sides[s], players) }}>
          <span className="tvs-name">{sideName(play.sides[s], players)}</span>
          <span className="tvs-events">
            {game.events
              .filter((e) => e.type === 'count' && !e.global && live.counts[e.id]?.[s])
              .map((e) => `${e.name} ${live.counts[e.id][s]}`)
              .join(' · ')}
          </span>
          <b className="tvs-score">
            {value(s)}
            {sets && <span className="sr-only"> sets</span>}
          </b>
        </div>
      ))}
    </div>
  )
}

/** Para el partido único de dos lados: reloj y lo último anotado, en una línea. Lo que falta va en cada columna. */
function MatchLine({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const target = targetOf(game, play.config)
  const last = play.log.at(-1)
  return (
    <div className="match-line num">
      <p className="tvs-head">
        <span>
          <Clock from={play.startedAt} /> {say('de partida')}
        </span>
        <span className="tvs-last">{last ? `Último: ${lastText(play, game, players, last)}` : target ? `Gana el primero a ${target}` : ''}</span>
      </p>
    </div>
  )
}

/** Reloj de la partida (minutos y segundos desde el primer punto). */
function Clock({ from }: { from?: number }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!from) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [from])
  return <b>{formatElapsed(from ? now - from : 0)}</b>
}

/** Sets terminados y qué se juega ahora ("6-4 3-6 · Tie-break"). */
function SetsStrip({ live }: { live: LiveState }) {
  const sets = live.sets!
  const now = sets.winner !== undefined ? '' : sets.superTb ? 'Super tie-break' : sets.tiebreak ? 'Tie-break' : `Set ${sets.done.length + 1}`
  return (
    <p className="sets-strip" aria-live="off">
      {sets.done.length > 0 && <span className="num">{setsLine(sets)}</span>}
      {now && <b>{now}</b>}
      {sets.need > 1 && <span className="muted small">gana el primero en ganar {sets.need} sets</span>}
    </p>
  )
}


// ---------------------------------------------------------------------------
// Por manos
