// Revancha y armado de partidas: volver a jugar con los mismos lados (equipos o cada uno
// solo) que la última vez, y decir qué falta cuando el armado no es válido.
//
// Lógica pura (sin React ni store) para poder probarla y usarla desde el inicio, el armado
// y el resumen de la partida.

import { defaultConfig } from './engine'
import type { GameDef, OptionValue } from './games/schema'
import type { Id, Play, PlaySide } from './types'

/** Cómo se arman los lados: cada uno por su cuenta, por equipos o todos juntos (cooperativo). */
export type Grouping = 'solo' | 'teams' | 'coop'

const playedAt = (p: Play) => p.finishedAt ?? p.startedAt ?? p.createdAt

/** Última partida de ese juego que se jugó de verdad (terminada o en juego). */
export function lastPlayOf(plays: Play[], gameId: string): Play | undefined {
  let last: Play | undefined
  for (const p of plays) {
    if (p.gameId === gameId && (p.status === 'finished' || p.status === 'live') && (!last || playedAt(p) > playedAt(last))) last = p
  }
  return last
}

/**
 * Hasta cuántos jugadores se puede jugar "cada uno solo". En los juegos que se pueden jugar
 * de las dos formas con marcador cara a cara (truco, ping pong), solo es mano a mano: con
 * más gente se juega por equipos. En el resto, lo que permita el juego.
 */
export function soloMax(game: GameDef): number {
  if (game.sides === 'either' && game.teamSize && (game.mode === 'counter' || game.mode === 'rally')) return 2
  return game.players.max
}

/** Cómo se armaron los lados de una partida (o cómo se arma por defecto el juego, sin partida). */
export function groupingOf(game: GameDef, play?: Play): Grouping {
  if (game.sides === 'coop') return 'coop'
  if (game.sides === 'teams') return 'teams'
  if (game.sides === 'individual') return 'solo'
  return play && play.sides.some((s) => s.players.length > 1) ? 'teams' : 'solo'
}

/**
 * Agrupamiento sugerido para `count` jugadores: si "cada uno solo" no alcanza y la cuenta da
 * para equipos completos (4 en el truco), por equipos. Si no, el que venía.
 */
export function suggestGrouping(game: GameDef, count: number, fallback: Grouping): Grouping {
  if (game.sides !== 'either' || !game.teamSize) return fallback
  if (count > soloMax(game) && count % game.teamSize === 0) return 'teams'
  return fallback
}

const jugadores = (n: number) => (n === 1 ? '1 jugador' : `${n} jugadores`)

/**
 * Qué impide arrancar este armado, en palabras para el botón ("Armá equipos de 2 jugadores").
 * `undefined` si se puede jugar.
 */
export function setupProblem(game: GameDef, grouping: Grouping, sides: PlaySide[]): string | undefined {
  const count = sides.reduce((n, s) => n + s.players.length, 0)
  const min = Math.max(game.players.min, grouping === 'coop' ? 1 : 2)
  if (count < min) return `Elegí al menos ${jugadores(min)}`
  if (count > game.players.max) return `Se juega hasta de a ${game.players.max}: sacá a alguien`
  if (grouping === 'coop') return sides.length === 1 ? undefined : 'Juntá a todos en un mismo equipo'
  if (grouping === 'solo') {
    const top = soloMax(game)
    if (count > top) return game.sides === 'either' ? `Cada uno solo es de a ${top}: pasá a Por equipos` : `Se juega hasta de a ${top}: sacá a alguien`
    return undefined
  }
  if (sides.length < 2) return 'Repartí los jugadores en al menos 2 equipos'
  // En los de equipos (Código secreto) `teamSize` es el mínimo por equipo: 4 contra 4 vale.
  if (game.teamSize && game.sides === 'teams' && sides.some((s) => s.players.length < game.teamSize!)) return `Armá equipos de al menos ${jugadores(game.teamSize)}`
  // En los de las dos formas (truco 2 contra 2 o 3 contra 3) los equipos tienen que ser parejos.
  if (game.teamSize && game.sides === 'either' && sides.some((s) => s.players.length !== sides[0].players.length)) return 'Armá equipos parejos'
  return undefined
}

/** "Ana, Beto, Caro y Dani". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`
}

/** Los lados como texto ("Ana & Beto") y con qué se separan: "vs" entre dos lados o equipos, "·" entre varios solos. */
export function previewParts(sides: PlaySide[], grouping: Grouping, nameOf: (id: Id) => string): { parts: string[]; sep: string } {
  if (grouping === 'coop') return { parts: [joinNames(sides.flatMap((s) => s.players).map(nameOf))], sep: '' }
  const parts = sides.map((s) => s.players.map(nameOf).join(' & '))
  return { parts, sep: grouping === 'teams' || parts.length === 2 ? 'vs' : '·' }
}

/** Una línea con cómo quedan los lados: "Ana & Beto vs Caro & Dani", "Ana vs Beto" o "Ana · Beto · Caro". */
export function sidesPreview(sides: PlaySide[], grouping: Grouping, nameOf: (id: Id) => string): string {
  const { parts, sep } = previewParts(sides, grouping, nameOf)
  return parts.join(` ${sep} `)
}

/**
 * Los mismos lados de una partida para volver a jugarla: mismos equipos (y nombres), sin los
 * roles. Si los lados se armaron por rol al cerrarla (impostor: un lado por bando), se vuelve
 * a cada uno solo: los roles se reparten de nuevo y se cargan al final.
 */
export function rematchSides(play: Play): PlaySide[] {
  if (play.sides.some((s) => s.role)) return play.sides.flatMap((s) => s.players.map((id) => ({ players: [id] })))
  return play.sides.map((s) => ({ players: [...s.players], ...(s.name ? { name: s.name } : {}) }))
}

/** Reglas de la partida para la revancha: las de la última vez, completando las opciones nuevas del juego. */
export function rematchConfig(game: GameDef, play: Play): Record<string, OptionValue> {
  return { ...defaultConfig(game), ...play.config }
}

export interface RematchPlan {
  from: Play
  sides: PlaySide[]
  config: Record<string, OptionValue>
  playerIds: Id[]
}

/**
 * Revancha directa: los lados y las reglas de la última partida de ese juego, si todavía se
 * puede jugar igual (están todos los jugadores y el armado es válido). Si no, `undefined` y
 * se pasa por el armado.
 */
export function planRematch(game: GameDef, plays: Play[], existing: Iterable<Id>): RematchPlan | undefined {
  const from = lastPlayOf(plays, game.id)
  if (!from) return undefined
  const ids = new Set(existing)
  const sides = rematchSides(from)
  const playerIds = sides.flatMap((s) => s.players)
  if (!playerIds.length || playerIds.some((id) => !ids.has(id)) || new Set(playerIds).size !== playerIds.length) return undefined
  if (setupProblem(game, groupingOf(game, from), sides)) return undefined
  return { from, sides, config: rematchConfig(game, from), playerIds }
}
