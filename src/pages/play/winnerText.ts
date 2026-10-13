// Cómo se dice quién ganó (misma regla que WinnerHero: "Ganó" para uno solo, "Ganaron" para un equipo o varios).
import { sideName } from '../../components/GameBits'
import { isDraw, winnerSides } from '../../lib/engine'
import type { Id, Play, PlaySide, Player } from '../../lib/types'

/** "Ana", "Ana y Beto", "Ana, Beto y Caro". */
export const joinNames = (names: string[]) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`)

/** Nombres de un lado para decirlos en voz alta: el del equipo si tiene, si no cada jugador ("Ana y Beto", no "Ana & Beto"). */
export function spokenNames(side: PlaySide, players: Map<Id, Player>): string[] {
  if (side.name || side.role) return [sideName(side, players)]
  return side.players.map((id) => players.get(id)?.name ?? '?')
}

/** "¡Ganó Ana!", "¡Ganaron Ana y Beto!", "¡Empate!". */
export function winnerTitle(play: Play, players: Map<Id, Player>): string {
  const winners = winnerSides(play)
  if (isDraw(play) || !winners.length) return '¡Empate!'
  const many = winners.length > 1 || play.sides[winners[0]].players.length > 1 || !!play.sides[winners[0]].name
  return `¡${many ? 'Ganaron' : 'Ganó'} ${joinNames(winners.flatMap((i) => spokenNames(play.sides[i], players)))}!`
}
