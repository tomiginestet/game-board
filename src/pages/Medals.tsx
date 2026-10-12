import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Medal } from '../components/Medal'
import { MedalSheet, type MedalHolder } from '../components/MedalSheet'
import { findGame } from '../lib/games'
import { UNKNOWN_PLAYER, useBoard, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { gameMedals, GLOBAL_FAMILIES, globalMedals, type MedalFamily } from '../lib/medals'
import { useData } from '../lib/store'

interface Entry {
  key: string
  family: MedalFamily
  holders: MedalHolder[]
  /** Nivel más alto que alguien del grupo alcanzó, -1 si nadie. */
  best: number
}

interface Shelf {
  id: string
  name: string
  emoji?: string
  entries: Entry[]
}

type Show = 'all' | 'won' | 'open'

const SHOW: { id: Show; name: string }[] = [
  { id: 'all', name: 'Todas' },
  { id: 'won', name: 'Ganadas' },
  { id: 'open', name: 'Por ganar' },
]

function entry(key: string, family: MedalFamily, holders: MedalHolder[]): Entry {
  return { key, family, holders, best: Math.max(-1, ...holders.map((h) => h.level)) }
}

/** Vitrina: todas las medallas del grupo, por juego, con quién llegó más alto en cada una. */
export function Medals() {
  const data = useData()
  const board = useBoard()
  const pp = useLeaderboard()
  const players = usePlayerMap()
  const [params, setParams] = useSearchParams()
  const shelfId = params.get('juego') ?? 'all'
  const show = (params.get('ver') as Show | null) ?? 'all'
  const [open, setOpen] = useState<{ entry: Entry; level: number } | null>(null)

  const shelves = useMemo(() => {
    const stats = [...board.players.values()].filter((s) => s.played > 0)
    const name = (id: string) => players.get(id)?.name ?? UNKNOWN_PLAYER.name
    const general: Shelf = {
      id: 'general',
      name: 'Generales',
      emoji: '🏅',
      entries: GLOBAL_FAMILIES.map((f, k) =>
        entry(
          'general:' + f.id,
          f,
          stats.map((s) => {
            const m = globalMedals(s)[k]
            return { name: name(s.playerId), value: m.value, level: m.level }
          }),
        ),
      ),
    }
    // Juegos que el grupo jugó, del más jugado al menos jugado.
    const counts = new Map<string, number>()
    for (const v of board.views) counts.set(v.gameId, (counts.get(v.gameId) ?? 0) + 1)
    const games = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => findGame(data, id))
      .filter((g) => !!g)
    const perGame: Shelf[] = games.map((game) => {
      const rows = stats.flatMap((s) => {
        const gs = s.perGame.get(game.id)
        return gs && gs.played > 0 ? [{ id: s.playerId, medals: gameMedals(game, gs, pp.stats.get(s.playerId)) }] : []
      })
      const families = rows[0]?.medals.map((m) => m.family) ?? []
      return {
        id: game.id,
        name: game.name,
        emoji: game.emoji,
        entries: families.map((f, k) =>
          entry(
            game.id + ':' + f.id + ':' + f.name,
            f,
            rows.map((r) => ({ name: name(r.id), value: r.medals[k].value, level: r.medals[k].level })),
          ),
        ),
      }
    })
    return [general, ...perGame]
  }, [data, board, pp, players])

  const all = shelves.flatMap((s) => s.entries)
  const wonLevels = all.reduce((n, e) => n + e.best + 1, 0)
  const totalLevels = all.reduce((n, e) => n + e.family.levels.length, 0)

  const visible = shelves
    .filter((s) => shelfId === 'all' || s.id === shelfId)
    .map((s) => ({ ...s, entries: s.entries.filter((e) => (show === 'won' ? e.best >= 0 : show === 'open' ? e.best < e.family.levels.length - 1 : true)) }))
    .filter((s) => s.entries.length > 0)

  const setParam = (k: string, v?: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  return (
    <div className="page">
      <Link to="/" className="back">
        <ArrowLeftIcon /> Inicio
      </Link>
      <header className="vitrina-head">
        <h1>Vitrina de medallas</h1>
        <p className="muted">
          El club ganó <b className="vitrina-count">{wonLevels}</b> de {totalLevels} niveles.
        </p>
        <span className="medal-bar" aria-hidden="true">
          <i style={{ width: `${totalLevels ? Math.round((wonLevels / totalLevels) * 100) : 0}%` }} />
        </span>
      </header>

      <div className="chips">
        {SHOW.map((s) => (
          <button key={s.id} className={'chip' + (show === s.id ? ' active' : '')} aria-pressed={show === s.id} onClick={() => setParam('ver', s.id === 'all' ? undefined : s.id)}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="chips scroll">
        <button className={'chip' + (shelfId === 'all' ? ' active' : '')} aria-pressed={shelfId === 'all'} onClick={() => setParam('juego')}>
          Todos
        </button>
        {shelves.map((s) => (
          <button key={s.id} className={'chip' + (shelfId === s.id ? ' active' : '')} aria-pressed={shelfId === s.id} onClick={() => setParam('juego', s.id)}>
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      {visible.map((s) => (
        <section key={s.id}>
          <h2>
            {s.emoji} {s.name}
          </h2>
          <div className="vitrina">
            {s.entries.map((e) => {
              const top = e.best >= 0 ? e.holders.filter((h) => h.level === e.best).sort((a, b) => b.value - a.value)[0] : undefined
              return (
                <button
                  key={e.key}
                  type="button"
                  className={'vitrina-item' + (e.best >= 0 ? ' won' : '')}
                  aria-haspopup="dialog"
                  onClick={() => setOpen({ entry: e, level: Math.min(e.best + 1, e.family.levels.length - 1) })}
                >
                  <Medal family={e.family} level={Math.max(e.best, 0)} locked={e.best < 0} size={72} />
                  <span className="vitrina-name">{e.family.name}</span>
                  <span className="vitrina-sub">{top ? `👑 ${top.name}` : 'Nadie todavía'}</span>
                  <span className="vitrina-levels" aria-label={`${e.best + 1} de ${e.family.levels.length} niveles`}>
                    {e.family.levels.map((_, i) => (
                      <i key={i} className={i <= e.best ? 'on' : ''} />
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      {!visible.length && <p className="muted">No hay medallas con este filtro.</p>}

      {open && <MedalSheet family={open.entry.family} level={open.level} others={open.entry.holders} onClose={() => setOpen(null)} />}
    </div>
  )
}
