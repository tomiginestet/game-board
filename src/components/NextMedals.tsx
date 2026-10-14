import { ArrowRightIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { findGame } from '../lib/games'
import { useBoard, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { closestFirst, gameMedals, globalMedals, missingLabel, type MedalProgress } from '../lib/medals'
import { useMyGroups } from '../lib/social'
import { useData } from '../lib/store'
import { useSyncState } from '../lib/sync'
import { Medal } from './Medal'
import { MedalSheet } from './MedalSheet'

interface Near {
  playerId: string
  /** Dónde se gana: el nombre del juego, o "General". */
  where: string
  progress: MedalProgress
}

/**
 * Inicio: las medallas que están por caer. Si sabemos qué jugador sos en el grupo, las tuyas;
 * si no, la más cercana de cada uno del grupo. Con `playerIds` (perfil del club o de un equipo),
 * siempre las de todos ellos.
 */
export function NextMedals({ playerIds, title, max = 3 }: { playerIds?: string[]; title?: string; max?: number } = {}) {
  const data = useData()
  const board = useBoard()
  const pp = useLeaderboard()
  const players = usePlayerMap()
  const sync = useSyncState()
  const { groups } = useMyGroups()
  const meId = playerIds ? undefined : (groups?.find((g) => g.code === sync.club?.code)?.player_id ?? undefined)
  const idsKey = playerIds?.join(',')
  const [open, setOpen] = useState<Near | null>(null)

  const list = useMemo(() => {
    const of = (playerId: string): Near[] => {
      const s = board.players.get(playerId)
      if (!s) return []
      const out: Near[] = globalMedals(s).map((progress) => ({ playerId, where: 'General', progress }))
      for (const [gameId, gs] of s.perGame) {
        const game = findGame(data, gameId)
        if (game) for (const progress of gameMedals(game, gs, pp.stats.get(playerId))) out.push({ playerId, where: game.name, progress })
      }
      return closestFirst(out)
    }
    if (meId && board.players.has(meId)) return of(meId).slice(0, max)
    // Del grupo: las más cercanas, sin repetir jugador y, si alcanza, tampoco medalla, para que la lista sea variada.
    const only = idsKey === undefined ? undefined : new Set(idsKey.split(','))
    const all = closestFirst([...board.players.keys()].filter((id) => !only || only.has(id)).flatMap(of))
    const picked: Near[] = []
    const usedPlayers = new Set<string>()
    const usedMedals = new Set<string>()
    for (const variedOnly of [true, false]) {
      for (const x of all) {
        const medal = x.where + ':' + x.progress.family.id
        if (picked.length === max || usedPlayers.has(x.playerId) || (variedOnly && usedMedals.has(medal))) continue
        picked.push(x)
        usedPlayers.add(x.playerId)
        usedMedals.add(medal)
      }
    }
    return closestFirst(picked)
  }, [data, board, pp, meId, idsKey, max])

  if (!list.length) return null
  const mine = !!meId && list.every((x) => x.playerId === meId)

  return (
    <section>
      <div className="section-head">
        <h2>{title ?? (mine ? 'Tus próximas medallas' : 'Medallas a la vista')}</h2>
        <Link to="/medallas">
          Vitrina <ArrowRightIcon className="inline-icon" size="1em" />
        </Link>
      </div>
      <div className="card near-medals">
        {list.map((x) => {
          const { family, level, next, value, ratio } = x.progress
          const missing = next!.at - value
          const who = players.get(x.playerId)?.name
          return (
            <button key={x.playerId + x.where + family.id} type="button" className="near-medal" aria-haspopup="dialog" onClick={() => setOpen(x)}>
              <Medal family={family} level={level + 1} size={48} />
              <span className="near-medal-body">
                <span className="near-medal-top">
                  <b className="ellipsis">{next!.name}</b>
                  <span className="near-medal-missing">{missingLabel(family, missing)}</span>
                </span>
                <span className="muted small ellipsis">
                  {mine ? '' : `${who} · `}
                  {x.where} · {family.name}
                </span>
                <span className="medal-bar" aria-hidden="true">
                  <i style={{ width: `${Math.round(ratio * 100)}%` }} />
                </span>
              </span>
            </button>
          )
        })}
      </div>
      {open && (
        <MedalSheet
          family={open.progress.family}
          level={open.progress.level + 1}
          mine={{ name: mine ? undefined : players.get(open.playerId)?.name, value: open.progress.value, level: open.progress.level }}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
