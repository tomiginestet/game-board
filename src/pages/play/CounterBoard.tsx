import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useId, useMemo, useState } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideColor, sideName, sidePlayersOf } from '../../components/GameBits'
import { Tally } from '../../components/Tally'
import { optionValue, targetOf, type LiveState } from '../../lib/engine'
import { setsLine } from '../../lib/sets'
import { vibrate } from '../../lib/vibrate'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions, useData } from '../../lib/store'
import type { Id, Play, PlaySide, Player } from '../../lib/types'
import { entryText, usePlayToggle, useTapGuard } from './playHooks'
import { KeyHint } from './KeyHint'
import { HelpToggle, PointsDialog, WhoDialog } from './shared'
import { sideKeys, undoLast, useScoreKeys } from './useScoreKeys'

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
  const [help, setHelp] = usePlayToggle(`help:${game.id}`)
  const helpId = useId()

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
  const withHelp = events.filter((e) => e.help)

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
      {live.sets && <SetsStrip live={live} />}
      <div className={'counter-board' + (two ? ' two' : '')}>
        {play.sides.map((side, s) => (
          <div key={s} className="counter-side" style={{ ['--pc' as string]: sideColor(side, players) }}>
            <SideScore side={side} score={live.scores[s]} game={game} target={target} quick={quick[0]} players={players} shortcut={keys[s]?.toUpperCase()} onTap={() => tap(s)} live={live} index={s} />
            {(shown.length > 0 || quick.length > 1) && (
              <div className="ev-grid" role="group" aria-label={`Jugadas de ${sideName(side, players)}`}>
                {quick.slice(1).map((n) => (
                  <button key={n} type="button" className="ev-tile" onClick={() => score(s, n)}>
                    <span className="ev-tile-name">+{n}</span>
                  </button>
                ))}
                {shown.map((e) => (
                  <button key={e.id} type="button" className="ev-tile" onClick={() => tap(s, e)} aria-describedby={help && e.help ? `${helpId}-${e.id}` : undefined}>
                    <span className="ev-tile-name">
                      <span aria-hidden="true">{e.emoji}</span> {e.name}
                    </span>
                    {e.points && !e.askPoints ? <span className="ev-tile-pts">+{e.points}</span> : null}
                    {live.counts[e.id]?.[s] ? (
                      <b className="ev-tile-count">
                        <span className="sr-only">, anotado </span>
                        {live.counts[e.id][s]}
                        <span className="sr-only"> {live.counts[e.id][s] === 1 ? 'vez' : 'veces'}</span>
                      </b>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <KeyHint items={keyItems} />
      {(rare.length > 0 || withHelp.length > 0) && (
        <div className="board-tools">
          {rare.length > 0 && (
            <button type="button" className="more-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
              <CaretDownIcon className={expanded ? 'flip' : undefined} aria-hidden="true" />
              {expanded ? 'Ver menos' : `Ver todo (${rare.length} más)`}
            </button>
          )}
          {withHelp.length > 0 && <HelpToggle on={help} onChange={setHelp} controls={helpId} />}
        </div>
      )}
      <div id={helpId} hidden={!help}>
        {help && (
          <dl className="ev-help">
            {(expanded ? [...primary, ...rare] : primary).filter((e) => e.help).map((e) => (
              <div key={e.id} id={`${helpId}-${e.id}`}>
                <dt>
                  <span aria-hidden="true">{e.emoji}</span> {e.name}
                </dt>
                <dd>{e.help}</dd>
              </div>
            ))}
            {globals.filter((e) => e.help).map((e) => (
              <div key={e.id}>
                <dt>
                  <span aria-hidden="true">{e.emoji}</span> {e.name}
                </dt>
                <dd>{e.help}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {globals.length > 0 && (
        <div className="chips center">
          {globals.map((e) => (
            <button key={e.id} type="button" className="chip" onClick={() => (vibrate(), actions.log(play.id, { k: 'ev', s: -1, e: e.id, n: 1 }))}>
              {e.emoji} {e.name} {live.globalCounts[e.id] ? <b className="chip-count">{live.globalCounts[e.id]}</b> : null}
            </button>
          ))}
        </div>
      )}
      <LogList play={play} game={game} players={players} />
    </>
  )
}

/** Zona grande de cada lado: un toque suma; un arrastre o un scroll, no. */
function SideScore({ side, score, game, target, quick, players, shortcut, onTap, live, index }: { side: PlaySide; score: number; game: GameDef; target?: number; quick: number; players: Map<Id, Player>; shortcut?: string; onTap: () => void; live: LiveState; index: number }) {
  const guard = useTapGuard(onTap)
  const malas = game.scoring.tally === 'matches' && target && target >= 20 ? target / 2 : undefined
  const name = sideName(side, players)
  const sets = live.sets
  if (sets) {
    const tennis = game.scoring.sets?.kind === 'tennis'
    return (
      <button type="button" className="counter-main sets-main" aria-keyshortcuts={shortcut} {...guard}>
        <span className="cs-name">
          <TeamAvatar team={sidePlayersOf(side, players)} size={28} /> <span className="ellipsis">{name}</span>
        </span>
        <span key={sets.call[index] + sets.played} className="cs-score" aria-label={`${sets.call[index]} en este ${tennis && !sets.tiebreak ? 'game' : sets.tiebreak ? 'tie-break' : 'set'}`}>
          {sets.call[index]}
        </span>
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
        <span className="cs-hint">+1 punto</span>
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
      <span className="cs-hint">
        +{quick} {game.scoring.quickLabel ?? ''}
      </span>
    </button>
  )
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

/** Últimas cosas anotadas (para saber qué se deshace). */
export function LogList({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const items = play.log.slice(-6).reverse()
  if (!items.length) return null
  return (
    <details className="log-list">
      <summary className="log-summary">
        <CaretRightIcon className="log-caret" aria-hidden /> Lo último anotado
      </summary>
      <ul>
        {items.map((e, k) => (
          <li key={k}>{entryText(play, game, players, e)}</li>
        ))}
      </ul>
    </details>
  )
}

// ---------------------------------------------------------------------------
// Por manos
