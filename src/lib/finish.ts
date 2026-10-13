// Cierre de una partida en juego: si el tablero ya sabe el resultado, "Terminar partida"
// no tiene por qué terminar en un formulario.

import { eliminateOf, placesFromScores, roundsOf, targetOf, type LiveState } from './engine'
import type { GameDef } from './games/schema'
import type { Play, PlayResult } from './types'

/** Modos en los que el tablero lleva el puntaje mientras se juega. */
export function hasLiveScore(game: GameDef): boolean {
  return game.mode === 'counter' || game.mode === 'rounds' || game.mode === 'turns'
}

/** Puntaje final según lo anotado: en `turns` se suma lo oculto (que se revela al final). */
export function liveFinalScores(game: GameDef, live: LiveState): number[] {
  if (game.mode === 'turns') return live.scores.map((s, i) => s + (live.hiddenScores[i] ?? 0))
  return [...live.scores]
}

/**
 * El resultado que se puede guardar sin preguntar nada, o `undefined` si hace falta el formulario:
 * juegos sin puntaje en vivo, cooperativos (¿ganaron o perdieron?), por roles (¿quién era quién?)
 * o con empate arriba (desempate). Los datos para las medallas (`game.stats`) no frenan: se piden
 * después, en el resumen.
 */
export function directResult(game: GameDef, play: Play, live: LiveState): PlayResult | undefined {
  if (!hasLiveScore(game) || game.roles?.length) return undefined
  // Con puntaje oculto (Catán: cartas de puntos de victoria), el tablero no sabe todo: el formulario
  // muestra los puntajes finales para que se corrijan antes de declarar ganador.
  if (game.mode === 'turns' && game.events.some((e) => e.hidden)) return undefined
  const n = play.sides.length
  if (!n) return undefined
  const scores = liveFinalScores(game, live)
  const places = placesFromScores(scores, !!game.scoring.lowWins)
  if (n > 1 && places.filter((p) => p === 1).length > 1) return undefined
  return { scores, places }
}

export function canFinishDirectly(game: GameDef, play: Play, live: LiveState): boolean {
  return directResult(game, play, live) !== undefined
}

/**
 * Lo que le falta a la partida para terminar sola ("Faltan 8 manos", "Nadie llegó a 30 tantos"),
 * para que cerrarla antes sea a propósito. `scores` permite chequear los puntajes corregidos a mano.
 */
export function finishShortfall(game: GameDef, play: Play, live: LiveState, scores: (number | null)[] = liveFinalScores(game, live)): string | undefined {
  if (!hasLiveScore(game)) return undefined
  const burns = eliminateOf(game, play.config) !== undefined
  if (game.mode === 'rounds' && !burns) {
    const total = roundsOf(game, play.config)
    const left = total === undefined ? 0 : total - live.roundsPlayed
    if (left > 0) return left === 1 ? 'Falta 1 mano' : `Faltan ${left} manos`
  }
  const target = targetOf(game, play.config)
  const typed = scores.filter((v): v is number => v !== null)
  if (target !== undefined && !game.scoring.lowWins && !burns && typed.length > 0 && Math.max(...typed) < target) {
    return `Nadie llegó a ${target} ${game.scoring.pointsName ?? 'puntos'}`
  }
  return undefined
}

/** Si el juego pide datos para las medallas y todavía no se cargó ninguno. */
export function statsFilled(play: Play): boolean {
  return Object.values(play.result?.stats ?? {}).some((arr) => arr.some((v) => v !== null && v !== ''))
}
