// Planilla: para los juegos por manos en los que cada jugador llena SU
// planilla de categorías en el orden que quiera (generala). El motor sigue
// viendo manos completas: la mano N es la N-ésima casilla que llenó cada uno.
// Qué casilla eligió cada lado se guarda en `ev[PLANILLA_KEY]` de la mano
// (el motor ignora las claves que no son eventos de la ficha).

import { generalaPlanilla } from './catalog/generala'
import type { GameDef } from './schema'
import type { LogEntry, Play } from '../types'

/** Una categoría de la planilla (fila). El nombre sale de `scoring.roundLabels`. */
export interface PlanillaCell {
  /** Puntajes que se anotan con un toque (además de tachar). */
  values: number[]
  /** Qué se anota en esta casilla, en una frase. */
  help?: string
  /** Eventos de la ficha que marca anotar este valor (para las medallas). */
  events?: (value: number) => string[]
  /** Si se puede ganar en el acto desde esta casilla (generala servida): anota `value` y marca `events`. */
  instantWin?: { events: string[]; value: number; label: string; help: string }
}

export interface PlanillaDef {
  /** Una por cada `scoring.roundLabels`, en el mismo orden. */
  cells: PlanillaCell[]
  /** Evento que se marca al tachar una casilla (anotar cero). */
  zeroEvent?: string
}

/** Clave de `ev` donde cada mano guarda la casilla que llenó cada lado (-1 = ninguna). */
export const PLANILLA_KEY = '_casilla'

const PLANILLAS: Record<string, PlanillaDef> = {
  generala: generalaPlanilla,
}

/** La planilla del juego, si se anota por categorías libres. */
export function planillaOf(game: GameDef): PlanillaDef | undefined {
  const def = PLANILLAS[game.id]
  const labels = game.scoring.roundLabels
  if (!def || !labels || labels.length !== def.cells.length || game.mode !== 'rounds') return undefined
  return def
}

/** Si el juego se anota en planilla por categorías (para mostrarla al final de la partida). */
export function hasPlanilla(game: GameDef): boolean {
  return planillaOf(game) !== undefined
}

type RoundEntry = Extract<LogEntry, { k: 'round' }>

export interface PlanillaGrid {
  /** `value[casilla][lado]`: lo anotado, o `null` si está libre. */
  value: (number | null)[][]
  /** `at[casilla][lado]`: índice en `play.log` de la mano donde se anotó. */
  at: (number | null)[][]
}

/** Arma la planilla a partir de las manos guardadas. Las manos viejas (sin casilla) llenaban en orden. */
export function planillaGrid(log: LogEntry[], cells: number, sides: number): PlanillaGrid {
  const value = Array.from({ length: cells }, () => new Array<number | null>(sides).fill(null))
  const at = Array.from({ length: cells }, () => new Array<number | null>(sides).fill(null))
  let k = 0
  log.forEach((e, idx) => {
    if (e.k !== 'round') return
    const chosen = e.ev?.[PLANILLA_KEY]
    for (let i = 0; i < sides; i++) {
      const c = chosen ? chosen[i] : k
      if (c === undefined || c < 0 || c >= cells || value[c][i] !== null) continue
      value[c][i] = e.sc[i] ?? 0
      at[c][i] = idx
    }
    k++
  })
  return { value, at }
}

/** Eventos que marca anotar `value` en la casilla `cell`. */
export function cellEvents(def: PlanillaDef, cell: number, value: number): string[] {
  const out = def.cells[cell]?.events?.(value) ?? []
  return value === 0 && def.zeroEvent ? [def.zeroEvent, ...out] : out
}

/** Todos los eventos que la planilla marca sola (para recalcularlos al corregir una casilla). */
function derivedEvents(def: PlanillaDef): Set<string> {
  const ids = new Set<string>()
  if (def.zeroEvent) ids.add(def.zeroEvent)
  def.cells.forEach((c, i) => c.values.forEach((v) => cellEvents(def, i, v).forEach((id) => ids.add(id))))
  return ids
}

export interface PlanillaPick {
  cell: number
  value: number
  /** Ganó en el acto (generala servida). */
  instantWin?: boolean
}

/** La mano que se guarda cuando cada lado eligió su casilla (`null` = no anotó en esta mano). */
export function planillaRound(def: PlanillaDef, picks: (PlanillaPick | null)[]): Omit<RoundEntry, 't'> {
  const n = picks.length
  const ev: Record<string, number[]> = {}
  const mark = (id: string, i: number) => {
    ev[id] ??= new Array<number>(n).fill(0)
    ev[id][i]++
  }
  const win = (p: PlanillaPick | null) => (p?.instantWin ? def.cells[p.cell]?.instantWin : undefined)
  const scoreOf = (p: PlanillaPick | null) => (p ? (win(p)?.value ?? p.value) : null)
  picks.forEach((p, i) => {
    if (!p) return
    const w = win(p)
    for (const id of w ? w.events : cellEvents(def, p.cell, p.value)) mark(id, i)
  })
  const value = picks.map(scoreOf)
  return {
    k: 'round',
    sc: value.map((v) => v ?? 0),
    in: { value },
    ev: { ...ev, [PLANILLA_KEY]: picks.map((p) => (p ? p.cell : -1)) },
  }
}

/** Devuelve el registro con una casilla ya guardada corregida (mismo lugar, mismos demás lados). */
export function correctCell(def: PlanillaDef, log: LogEntry[], logIndex: number, side: number, cell: number, value: number): LogEntry[] {
  const derived = derivedEvents(def)
  return log.map((e, idx) => {
    if (idx !== logIndex || e.k !== 'round') return e
    const n = e.sc.length
    const sc = e.sc.map((v, i) => (i === side ? value : v))
    const values = e.in?.value ?? e.sc
    const ev: Record<string, number[]> = {}
    for (const [id, arr] of Object.entries(e.ev ?? {})) {
      ev[id] = derived.has(id) ? arr.map((v, i) => (i === side ? 0 : v)) : [...arr]
    }
    for (const id of cellEvents(def, cell, value)) {
      ev[id] ??= new Array<number>(n).fill(0)
      ev[id][side]++
    }
    return { ...e, sc, in: { ...e.in, value: values.map((v, i) => (i === side ? value : v)) }, ev }
  })
}

export interface PlanillaSummaryRow {
  /** Nombre de la categoría (de `scoring.roundLabels`). */
  label: string
  /** Lo anotado por lado: número (0 = tachada) o `null` si quedó libre. */
  values: (number | null)[]
}

export interface PlanillaSummaryData {
  rows: PlanillaSummaryRow[]
  /** Total por lado (suma de sus casillas). */
  totals: number[]
  /** Lados que ganaron: los primeros del resultado guardado o, sin resultado, los de más puntos. */
  leaders: number[]
}

/**
 * La planilla final de una partida, lista para mostrar: filas por categoría,
 * columnas por lado y totales. `undefined` si el juego no se anota por planilla.
 */
export function planillaSummary(game: GameDef, play: Pick<Play, 'log' | 'sides' | 'result'>): PlanillaSummaryData | undefined {
  if (!planillaOf(game)) return undefined
  const labels = game.scoring.roundLabels ?? []
  const n = play.sides.length
  const grid = planillaGrid(play.log, labels.length, n)
  const rows = labels.map((label, c) => ({ label, values: grid.value[c] }))
  const totals = play.sides.map((_, i) => rows.reduce((sum, r) => sum + (r.values[i] ?? 0), 0))
  const places = play.result?.places
  let leaders: number[]
  if (places && places.length === n) leaders = places.flatMap((p, i) => (p === 1 ? [i] : []))
  else {
    const best = game.scoring.lowWins ? Math.min(...totals) : Math.max(...totals)
    leaders = totals.some((t) => t !== 0) ? totals.flatMap((t, i) => (t === best ? [i] : [])) : []
  }
  return { rows, totals, leaders }
}
