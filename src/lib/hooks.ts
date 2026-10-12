import { useEffect, useMemo } from 'react'
import { allGames, findGame, missingGame } from './games'
import type { GameDef } from './games/schema'
import { computeLeaderboard } from './pingpong/stats'
import { computeBoard } from './stats'
import { useData } from './store'
import type { Id, Player } from './types'

/** Estadísticas de todos los juegos (todo el historial). */
export function useBoard() {
  const data = useData()
  return useMemo(() => computeBoard(data), [data])
}

/** Estadísticas del ping pong calculadas igual que en el Ping Pong Club (logros incluidos). */
export function useLeaderboard() {
  const data = useData()
  return useMemo(() => computeLeaderboard({ version: 1, players: data.players, matches: data.matches, tournaments: data.tournaments }), [data.players, data.matches, data.tournaments])
}

export function usePlayerMap(): Map<Id, Player> {
  const data = useData()
  return useMemo(() => new Map(data.players.map((p) => [p.id, p])), [data.players])
}

export function useGames(): GameDef[] {
  const { games } = useData()
  return useMemo(() => allGames({ games }), [games])
}

export function useGame(id: string | undefined): GameDef | undefined {
  const { games } = useData()
  return useMemo(() => (id ? findGame({ games }, id) : undefined), [games, id])
}

export function gameOrMissing(data: Parameters<typeof findGame>[0], id: string): GameDef {
  return findGame(data, id) ?? missingGame(id)
}

/** Jugador "desconocido" para partidas de jugadores borrados o datos inconsistentes. */
export const UNKNOWN_PLAYER: Player = { id: '?', name: '¿?', emoji: '👻', color: '#666', createdAt: 0 }

export function formatDate(ts: number): string {
  const d = new Date(ts)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  if (sameDay) return `Hoy ${time}`
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return `Ayer ${time}`
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' })
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

/** Título de la pestaña del navegador ("Ranking · Game Board"): ayuda a ubicarse y a los lectores de pantalla. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Game Board` : 'Game Board'
  }, [title])
}
