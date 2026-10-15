// Los juegos del club: los que eligió un admin (o, en un club de lugar, los del lugar) y los que más
// juegan. Salen destacados en la pantalla del club, en "Para jugar hoy" y primero al anotar.

import { useMemo } from 'react'
import { HERO, pickGames } from './games'
import type { GameDef } from './games/schema'
import { useBoard } from './hooks'
import { useActiveGroup } from './social'
import { useData } from './store'

export interface ClubGames {
  /** Los elegidos por el club, en su orden (vacío si todavía no eligió). */
  chosen: GameDef[]
  /** Los que jugó el club, del más jugado al menos. */
  mostPlayed: GameDef[]
  /** Cuántas partidas tiene cada juego en el club. */
  played: Map<string, number>
  /** Cuándo se jugó cada juego por última vez. */
  last: Map<string, number>
}

export function useClubGames(): ClubGames {
  const data = useData()
  const board = useBoard()
  const group = useActiveGroup()
  const chosenIds = group?.games?.length ? group.games : group?.venue?.games
  const chosenKey = chosenIds?.join(',') ?? ''
  return useMemo(() => {
    const played = new Map<string, number>()
    const last = new Map<string, number>()
    for (const v of board.views) {
      played.set(v.gameId, (played.get(v.gameId) ?? 0) + 1)
      last.set(v.gameId, Math.max(last.get(v.gameId) ?? 0, v.at))
    }
    return {
      chosen: chosenKey ? pickGames(data, chosenKey.split(',')) : [],
      mostPlayed: pickGames(data, [...played.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)),
      played,
      last,
    }
  }, [data, board.views, chosenKey])
}

/** "Para jugar hoy": primero los del club, después los más jugados y, para completar, los de siempre. */
export function todayGames(data: Parameters<typeof pickGames>[0], club: ClubGames, max = 6): GameDef[] {
  return pickGames(data, [...club.chosen.map((g) => g.id), ...club.mostPlayed.slice(0, 3).map((g) => g.id), ...HERO]).slice(0, max)
}
