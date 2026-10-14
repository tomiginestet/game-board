// La prenda de una partida: "el que pierde paga la próxima ronda". Se juega por algo chico
// (un café, lavar los platos), nunca por plata: no hay montos, ni cuotas, ni "doble o nada".
//
// Lógica pura (sin React ni store) para poder probarla y usarla en el armado, la partida y el resumen.

import type { Play, PlaySide, PlayStake } from './types'

export interface StakeTemplate {
  emoji: string
  /** En infinitivo, para que sirva igual para uno o para varios: "Le toca a Beto pagar…", "Les toca a Ana y Beto pagar…". */
  text: string
}

/** Lo que cumple el que pierde. */
export const LOSER_STAKES: StakeTemplate[] = [
  { emoji: '🍺', text: 'pagar la próxima ronda' },
  { emoji: '☕', text: 'pagar el próximo café' },
  { emoji: '🍽️', text: 'lavar los platos' },
  { emoji: '🧉', text: 'cebar los mates' },
  { emoji: '🥐', text: 'traer las facturas la próxima' },
  { emoji: '🚗', text: 'manejar a la vuelta' },
]

/** Lo que se lleva el que gana. */
export const WINNER_STAKES: StakeTemplate[] = [
  { emoji: '🎵', text: 'elegir la música' },
  { emoji: '🎬', text: 'elegir la película' },
  { emoji: '🎲', text: 'elegir el próximo juego' },
  { emoji: '🛋️', text: 'quedarse con el mejor sillón' },
]

export const STAKE_MAX = 60

export const stakeTemplates = (who: PlayStake['who']) => (who === 'winner' ? WINNER_STAKES : LOSER_STAKES)

/** "El que pierde" entre dos; con más lados, el que queda último. */
export const stakeWhoLabel = (who: PlayStake['who'], sides: number) => (who === 'winner' ? 'El que gana' : sides > 2 ? 'El último' : 'El que pierde')

/** Limpia lo que escribió la gente: sin espacios ni punto de más, sin mayúscula inicial y sin pasarse de largo. `undefined` si quedó vacío. */
export function cleanStake(stake: PlayStake | undefined): PlayStake | undefined {
  let text = stake?.text.replace(/\s+/g, ' ').trim().replace(/[.!]+$/, '').slice(0, STAKE_MAX)
  if (!stake || !text) return undefined
  // Va en medio de la frase ("Le toca a Beto lavar el auto"): "Lavar" pasa a minúscula, una sigla no.
  if (/^\p{Lu}\p{Ll}/u.test(text)) text = text.charAt(0).toLowerCase() + text.slice(1)
  return { text, who: stake.who, ...(stake.emoji ? { emoji: stake.emoji } : {}) }
}

/**
 * A qué lados les toca cumplir la prenda: los ganadores o los que quedaron últimos.
 * `'draw'` si quedaron todos iguales; `undefined` si la partida no terminó o no tiene prenda.
 */
export function stakeSides(play: Play): number[] | 'draw' | undefined {
  const places = play.result?.places
  if (!play.stake || play.status !== 'finished' || !places?.length || play.result?.coopWin !== undefined) return undefined
  const valid = places.filter((p) => typeof p === 'number')
  if (valid.length < 2) return undefined
  const best = Math.min(...valid)
  const worst = Math.max(...valid)
  if (best === worst) return 'draw'
  const target = play.stake.who === 'winner' ? best : worst
  return places.map((p, i) => (p === target ? i : -1)).filter((i) => i >= 0)
}

const joinNames = (names: string[]) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`)

/** Varios a cargo: un equipo con nombre, una pareja o dos que empataron el último puesto. */
const isMany = (sides: PlaySide[]) => sides.length > 1 || sides[0].players.length > 1

/**
 * La prenda resuelta, con nombre: "Le toca a Beto pagar la próxima ronda".
 * Con empate, queda para la revancha. `undefined` si todavía no se sabe. `namesOf`: cómo se dice
 * cada lado en voz alta (el nombre del equipo, si tiene; si no, cada jugador).
 */
export function stakeLine(play: Play, namesOf: (side: PlaySide) => string[]): string | undefined {
  const who = stakeSides(play)
  if (!who || !play.stake) return undefined
  if (who === 'draw') return `Empate: lo de ${play.stake.text} queda para la revancha.`
  const sides = who.map((i) => play.sides[i])
  return `${isMany(sides) ? 'Les toca' : 'Le toca'} a ${joinNames(sides.flatMap(namesOf))} ${play.stake.text}.`
}

/** Antes de saber el resultado: "El que pierde: pagar la próxima ronda". */
export function stakePreview(play: Pick<Play, 'stake' | 'sides'>): string | undefined {
  if (!play.stake) return undefined
  return `${stakeWhoLabel(play.stake.who, play.sides.length)}: ${play.stake.text}`
}
