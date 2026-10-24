import { XIcon } from '@phosphor-icons/react'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { sideColor, sideName } from '../../components/GameBits'
import { computeLive } from '../../lib/engine'
import { toast } from '../../lib/feedback'
import type { EventDef, GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, LogEntry, Play, Player } from '../../lib/types'
import { entryText } from './playHooks'
import { say } from '../../skins/say'

/**
 * Pestañas Marcador / Jugadas de la pantalla de partida (en vivo, por turnos y por manos). El tablero va como
 * `children`; Jugadas es el relato de la partida y, al pie, qué es cada jugada.
 */
export function BoardTabs({ play, game, players, help, children }: { play: Play; game: GameDef; players: Map<Id, Player>; help: EventDef[]; children: ReactNode }) {
  const [tab, setTab] = useState<'board' | 'log'>('board')
  const id = useId()
  const count = play.log.filter((e) => !isHidden(game, e)).length
  return (
    <>
      <div className="board-tabs" role="tablist" aria-label={say('Partida')}>
        <button type="button" role="tab" id={`${id}-board`} aria-selected={tab === 'board'} aria-controls={`${id}-board-panel`} onClick={() => setTab('board')}>
          Marcador
        </button>
        <button type="button" role="tab" id={`${id}-log`} aria-selected={tab === 'log'} aria-controls={`${id}-log-panel`} onClick={() => setTab('log')}>
          Jugadas {count > 0 && <span className="board-tab-count num">{count}</span>}
        </button>
      </div>
      <div role="tabpanel" id={`${id}-board-panel`} aria-labelledby={`${id}-board`} hidden={tab !== 'board'} className="board-panel">
        {children}
      </div>
      <div role="tabpanel" id={`${id}-log-panel`} aria-labelledby={`${id}-log`} hidden={tab !== 'log'} className="board-panel">
        {tab === 'log' && <PlayLog play={play} game={game} players={players} />}
        {help.length > 0 && (
          <section className="ev-help-section">
            <h2>Qué es cada jugada</h2>
            <dl className="ev-help">
              {help.map((e) => (
                <div key={e.id}>
                  <dt>{e.name}</dt>
                  <dd>{e.help}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </>
  )
}

/** Lo oculto (cartas de Catán) no aparece en el relato: se vería quién compró qué. */
const isHidden = (game: GameDef, e: LogEntry) => e.k === 'ev' && !!game.events.find((x) => x.id === e.e)?.hidden

const sideLabel = (play: Play, players: Map<Id, Player>, s: number) => (s < 0 ? 'Mesa' : sideName(play.sides[s], players))

/** Una entrada del registro en dos partes: qué pasó ("+2", "Bochazo") y quién ("Tomi", "pase de Nico"). */
function logLine(play: Play, game: GameDef, players: Map<Id, Player>, e: LogEntry): { what: string; who?: string } {
  const name = (id?: Id) => (id ? players.get(id)?.name ?? '¿?' : undefined)
  if (e.k === 'pt') return { what: `+${e.n}`, who: [name(e.pl), e.as ? `pase de ${name(e.as)}` : undefined].filter(Boolean).join(', ') || undefined }
  if (e.k === 'ev') {
    const def = game.events.find((x) => x.id === e.e)
    return { what: `${def?.name ?? e.e}${e.p !== undefined ? ` (+${e.p})` : ''}${e.n < 0 ? ' (−1)' : ''}`, who: name(e.pl) }
  }
  if (e.k === 'turn') return { what: `Turno de ${sideLabel(play, players, e.s)}` }
  if (e.k === 'round') return { what: 'Mano', who: e.sc.map((n, i) => `${sideLabel(play, players, i)} ${n}`).join(' · ') }
  return { what: entryText(play, game, players, e) }
}

/** "+2 de Tomi", "Bochazo, Juli": lo último anotado, para confirmar el toque. */
export function lastText(play: Play, game: GameDef, players: Map<Id, Player>, e: LogEntry): string {
  const { what, who } = logLine(play, game, players, e)
  if (e.k !== 'pt' && e.k !== 'ev') return what
  return who ? `${what} de ${who}` : `${what}, ${sideLabel(play, players, e.s)}`
}

/**
 * El relato de la partida, de lo último a lo primero: minuto, lado, qué pasó y cómo quedó el marcador.
 * Cualquier jugada se puede borrar (no sólo la última); el aviso ofrece deshacer.
 */
function PlayLog({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const start = play.startedAt ?? play.log[0]?.t ?? 0
  // Marcador después de cada entrada; se muestra sólo cuando cambió.
  const rows = useMemo(() => {
    // Con dos lados, el marcador entero ("5–4"); con más, el total del lado que anotó ("total 7").
    let prev = play.sides.map(() => 0)
    return play.log.map((e, i) => {
      const now = computeLive(game, { ...play, log: play.log.slice(0, i + 1) }).scores
      const s = 's' in e ? e.s : -1
      const changed = now.some((v, k) => v !== prev[k])
      prev = now
      const scores = !changed ? undefined : play.sides.length === 2 ? now.join('–') : s >= 0 ? `total ${now[s]}` : undefined
      return { e, i, score: scores, hidden: isHidden(game, e) }
    })
  }, [play, game])
  // Número de cada mano, para "Mano 3".
  const roundNo = new Map<number, number>()
  play.log.forEach((e, i) => e.k === 'round' && roundNo.set(i, roundNo.size + 1))
  if (!rows.some((r) => !r.hidden)) return <p className="muted play-log-empty">Todavía no se anotó nada. Lo que vayas sumando aparece acá, con el minuto y el marcador.</p>
  const remove = (i: number) => {
    const before = play.log
    const { what } = logLine(play, game, players, play.log[i])
    actions.removeLog(play.id, i)
    toast(`Borraste: ${what}, ${sideLabel(play, players, 's' in play.log[i] ? play.log[i].s : -1)}`, { label: 'Deshacer', run: () => actions.patchPlay(play.id, { log: before }) })
  }
  return (
    <ol className="play-log num">
      {[...rows].reverse().filter((r) => !r.hidden).map(({ e, i, score }) => {
        const line = logLine(play, game, players, e)
        const what = e.k === 'round' ? `Mano ${roundNo.get(i)}` : line.what
        const who = line.who
        const s = 's' in e ? e.s : -1
        const side = sideLabel(play, players, s)
        return (
          <li key={i} className={(i === play.log.length - 1 ? 'last' : '') + (e.k === 'turn' ? ' turn' : '') || undefined}>
            <span className="pl-time">{Math.max(0, Math.floor((e.t - start) / 60000))}′</span>
            <span className="pl-dot" style={{ background: s >= 0 ? sideColor(play.sides[s], players) : 'var(--border-strong)' }} aria-hidden />
            <span className="pl-text">
              <b>{what}</b> {(who || s >= 0) && e.k !== 'turn' && <span className="pl-who">{who && s >= 0 ? `${who} · ${side}` : who ?? side}</span>}
            </span>
            <span className="pl-score">{score}</span>
            <button type="button" className="pl-remove" onClick={() => remove(i)} aria-label={`Borrar ${what} de ${who ?? side}`}>
              <XIcon aria-hidden />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

