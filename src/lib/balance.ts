// Armado de equipos parejos: "somos 10, armá dos equipos" usando el Elo de cada uno.

import type { GameDef } from './games/schema'
import { expectedScore, INITIAL_ELO, type Board } from './stats'
import type { Id } from './types'

/**
 * Qué tan fuerte es alguien en este juego: su Elo si ya lo jugó; si no, el promedio de su Elo en los
 * juegos de la misma categoría (otro deporte, otro juego de cartas), pesado por partidas; si no, el inicial.
 */
export function ratingIn(board: Board, playerId: Id, game: Pick<GameDef, 'id' | 'category'>, categoryOf: (gameId: string) => string | undefined): number {
  const per = board.players.get(playerId)?.perGame
  if (!per) return INITIAL_ELO
  const own = per.get(game.id)
  if (own && own.played > 0) return own.elo
  let sum = 0
  let weight = 0
  for (const s of per.values()) {
    if (!s.played || categoryOf(s.gameId) !== game.category) continue
    sum += s.elo * s.played
    weight += s.played
  }
  return weight ? Math.round(sum / weight) : INITIAL_ELO
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : INITIAL_ELO)

/** Qué tan desparejos quedan: la diferencia entre el equipo más fuerte y el más débil (promedios). */
export function spread(teams: Id[][], rating: (id: Id) => number): number {
  const avgs = teams.map((t) => avg(t.map(rating)))
  return Math.max(...avgs) - Math.min(...avgs)
}

/**
 * Reparte a los jugadores en `count` equipos de tamaños parejos (difieren en uno como mucho) tratando de que
 * el promedio de Elo de cada uno quede lo más cerca posible. Arranca con un "pan y queso" (el mejor elige
 * primero, ida y vuelta) y después prueba cambios de a dos mientras mejore.
 * `random` desempata entre jugadores de Elo parecido, para que "otra vez" pueda dar otro armado igual de parejo.
 */
export function balanceTeams(ids: Id[], rating: (id: Id) => number, count: number, random: () => number = Math.random): Id[][] {
  const k = Math.max(1, Math.min(count, ids.length || 1))
  // Orden por Elo con un poco de ruido (±15) para que no salga siempre lo mismo.
  const noisy = new Map(ids.map((id) => [id, rating(id) + (random() - 0.5) * 30]))
  const order = [...ids].sort((a, b) => noisy.get(b)! - noisy.get(a)!)
  const teams: Id[][] = Array.from({ length: k }, () => [])
  order.forEach((id, i) => {
    const round = Math.floor(i / k)
    const pos = i % k
    teams[round % 2 === 0 ? pos : k - 1 - pos].push(id)
  })
  let best = spread(teams, rating)
  for (let iter = 0; iter < 400 && best > 0; iter++) {
    let improved = false
    for (let a = 0; a < k && !improved; a++)
      for (let b = a + 1; b < k && !improved; b++)
        for (let i = 0; i < teams[a].length && !improved; i++)
          for (let j = 0; j < teams[b].length && !improved; j++) {
            ;[teams[a][i], teams[b][j]] = [teams[b][j], teams[a][i]]
            const cost = spread(teams, rating)
            if (cost < best - 0.5) {
              best = cost
              improved = true
            } else [teams[a][i], teams[b][j]] = [teams[b][j], teams[a][i]]
          }
    if (!improved) break
  }
  return teams
}

/** Chances de ganar del primer equipo contra el segundo (0 a 1), según sus promedios de Elo. */
export function winChance(a: Id[], b: Id[], rating: (id: Id) => number): number {
  return expectedScore(avg(a.map(rating)), avg(b.map(rating)))
}

export function teamAverage(team: Id[], rating: (id: Id) => number): number {
  return Math.round(avg(team.map(rating)))
}
