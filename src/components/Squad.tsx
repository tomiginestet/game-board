// Resumen de un conjunto de jugadores (todo el club o el plantel de un equipo):
// quién manda, las medallas que ganaron entre todos y lo que más juegan.

import { ArrowRightIcon, CrownIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { findGame } from '../lib/games'
import { UNKNOWN_PLAYER, plural, useBoard, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { gameMedals, globalMedals, type MedalFamily } from '../lib/medals'
import { beltOf } from '../lib/stats'
import { useData } from '../lib/store'
import type { Id } from '../lib/types'
import { Avatar } from './Avatar'
import { Medal } from './Medal'
import { MedalSheet, type MedalHolder } from './MedalSheet'

export interface SquadMedal {
  key: string
  family: MedalFamily
  /** Nombre del juego, o "General". */
  where: string
  emoji?: string
  holders: (MedalHolder & { id: Id })[]
  /** Nivel más alto que alguien alcanzó, -1 si nadie. */
  best: number
}

/**
 * Medallas de un conjunto de jugadores (todos los del club si no se pasa `ids`): una entrada por familia y juego
 * con quién llegó a qué nivel, y cuántas medallas ganó cada jugador.
 */
export function useSquadMedals(ids?: Id[]) {
  const data = useData()
  const board = useBoard()
  const pp = useLeaderboard()
  const players = usePlayerMap()
  const idsKey = ids?.join(',')

  return useMemo(() => {
    const only = idsKey === undefined ? undefined : new Set(idsKey.split(','))
    const entries = new Map<string, SquadMedal>()
    // Medallas ganadas por cada jugador (una por familia, cualquiera sea el nivel).
    const won = new Map<Id, number>()
    const add = (key: string, family: MedalFamily, where: string, emoji: string | undefined, id: Id, value: number, level: number) => {
      let e = entries.get(key)
      if (!e) entries.set(key, (e = { key, family, where, emoji, holders: [], best: -1 }))
      e.holders.push({ id, name: players.get(id)?.name ?? UNKNOWN_PLAYER.name, value, level })
      e.best = Math.max(e.best, level)
      if (level >= 0) won.set(id, (won.get(id) ?? 0) + 1)
    }
    for (const s of board.players.values()) {
      if (s.played === 0 || (only && !only.has(s.playerId))) continue
      for (const m of globalMedals(s)) add('general:' + m.family.id, m.family, 'General', undefined, s.playerId, m.value, m.level)
      for (const [gameId, gs] of s.perGame) {
        const game = findGame(data, gameId)
        if (!game || gs.played === 0) continue
        for (const m of gameMedals(game, gs, pp.stats.get(s.playerId)))
          add(`${gameId}:${m.family.id}:${m.family.name}`, m.family, game.name, game.emoji, s.playerId, m.value, m.level)
      }
    }
    // Primero las de nivel más alto y, entre ésas, las que menos gente tiene.
    const earned = [...entries.values()]
      .filter((e) => e.best >= 0)
      .sort((a, b) => b.best - a.best || a.holders.filter((h) => h.level === a.best).length - b.holders.filter((h) => h.level === b.best).length)
    return { earned, won }
  }, [data, board, pp, players, idsKey])
}

/** Juegos distintos que jugaron (con al menos una partida terminada). */
export function useGamesPlayed(ids?: Id[]): number {
  const board = useBoard()
  return useMemo(() => {
    const games = new Set<string>()
    for (const s of board.players.values()) if (!ids || ids.includes(s.playerId)) for (const [g, gs] of s.perGame) if (gs.played > 0) games.add(g)
    return games.size
  }, [board, ids])
}

/** Podio de gloria: los tres que más sumaron. */
export function SquadLeaders({ ids, title = 'Quién manda' }: { ids?: Id[]; title?: string }) {
  const board = useBoard()
  const players = usePlayerMap()
  const top = [...board.players.values()]
    .filter((s) => s.played > 0 && (!ids || ids.includes(s.playerId)) && players.has(s.playerId))
    .sort((a, b) => b.gloria - a.gloria || b.wins - a.wins)
    .slice(0, 3)
  if (!top.length) return null

  return (
    <section>
      <div className="section-head">
        <h2>{title}</h2>
        <Link to="/ranking">
          Ranking <ArrowRightIcon className="inline-icon" size="1em" />
        </Link>
      </div>
      <GloriaPodium top={top} />
    </section>
  )
}

/**
 * Podio de gloria (inicio, club, equipo): el segundo, el primero y el tercero, cada uno con su escalón; el escalón
 * lleva la gloria (la altura y el número dicen lo mismo). Debajo, cuánto le lleva el primero al segundo.
 */
export function GloriaPodium({ top }: { top: { playerId: Id; gloria: number }[] }) {
  const players = usePlayerMap()
  const name = (i: number) => players.get(top[i]?.playerId)?.name
  return (
    <>
      <div className="podium">
        {[top[1], top[0], top[2]].map((s, i) => {
          const p = s && players.get(s.playerId)
          const place = ([2, 1, 3] as const)[i]
          return p ? (
            <Link key={p.id} to={`/jugadores/${p.id}`} className={'podium-spot place-' + place}>
              <Avatar player={p} size={i === 1 ? 64 : 48} />
              <span className="podium-name">
                <span className="sr-only">{place}º, </span>
                {p.name}
              </span>
              <span className="podium-block num">
                {s.gloria}
                <small>de gloria</small>
              </span>
            </Link>
          ) : (
            <div key={i} className="podium-spot empty-spot" />
          )
        })}
      </div>
      {top[1] && name(0) && name(1) && (
        <p className="podium-gap">
          {top[0].gloria === top[1].gloria ? `${name(0)} y ${name(1)} están empatados.` : `${name(0)} le lleva ${top[0].gloria - top[1].gloria} de gloria a ${name(1)}.`}
        </p>
      )}
    </>
  )
}

/** Las medallas más altas que ganaron entre todos, con quién llegó más arriba en cada una. */
export function SquadShowcase({ medals, title = 'Vitrina', max = 6 }: { medals: SquadMedal[]; title?: string; max?: number }) {
  const [open, setOpen] = useState<SquadMedal | null>(null)
  if (!medals.length) return null

  return (
    <section>
      <div className="section-head">
        <h2>
          {title} <span className="muted small">{plural(medals.length, 'medalla', 'medallas')}</span>
        </h2>
        <Link to="/medallas">
          Ver todo <ArrowRightIcon className="inline-icon" size="1em" />
        </Link>
      </div>
      <div className="vitrina">
        {medals.slice(0, max).map((e) => {
          const top = e.holders.filter((h) => h.level === e.best).sort((a, b) => b.value - a.value)
          return (
            <button key={e.key} type="button" className="vitrina-item won" aria-haspopup="dialog" onClick={() => setOpen(e)}>
              <Medal family={e.family} level={e.best} size={72} />
              <span className="vitrina-name">{e.family.levels[e.best].name}</span>
              <span className="vitrina-sub leader">
                <CrownIcon weight="fill" aria-hidden /> <span className="ellipsis">{top[0].name}</span>
                {top.length > 1 && <span className="vitrina-more">+{top.length - 1}</span>}
              </span>
              <span className="vitrina-sub">
                {e.emoji ? `${e.emoji} ` : ''}
                {e.where}
              </span>
            </button>
          )
        })}
      </div>
      {open && <MedalSheet family={open.family} level={open.best} others={open.holders} onClose={() => setOpen(null)} />}
    </section>
  )
}

/** Los juegos que más se juegan, con quién tiene el cinturón de cada uno. */
export function SquadGames({ ids, max = 3 }: { ids?: Id[]; max?: number }) {
  const data = useData()
  const board = useBoard()
  const players = usePlayerMap()
  const rows = useMemo(() => {
    const counts = new Map<string, number>()
    for (const v of board.views) {
      if (ids && !v.sides.some((side) => side.some((id) => ids.includes(id)))) continue
      counts.set(v.gameId, (counts.get(v.gameId) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, max)
      .flatMap(([id, n]) => {
        const game = findGame(data, id)
        return game ? [{ game, n, belt: beltOf(board.views, id) }] : []
      })
  }, [data, board, ids, max])
  if (!rows.length) return null

  return (
    <section>
      <div className="section-head">
        <h2>Lo que más se juega</h2>
        <Link to="/juegos">
          Juegos <ArrowRightIcon className="inline-icon" size="1em" />
        </Link>
      </div>
      <div className="list">
        {rows.map(({ game, n, belt }) => (
          <Link key={game.id} to={`/juegos/${game.id}`} className="card squad-game">
            <span className="squad-game-emoji" aria-hidden>
              {game.emoji}
            </span>
            <span className="grow">
              <b className="block ellipsis">{game.name}</b>
              <span className="muted small">{plural(n, 'partida', 'partidas')}</span>
            </span>
            {belt && (
              <span className="squad-belt">
                <span className="muted small">Cinturón</span>
                <b className="ellipsis">{belt.holders.map((id) => players.get(id)?.name ?? UNKNOWN_PLAYER.name).join(' & ')}</b>
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
