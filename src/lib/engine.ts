// Motor de partidas: a partir de la ficha del juego y lo anotado, calcula el
// estado en vivo (puntajes, turnos, quién tiene qué) y cuándo termina.

import type { EventDef, GameDef, OptionValue } from './games/schema'
import { computeSets, pointSides, setsRuleOf, type SetsState } from './sets'
import type { Id, LogEntry, Play, PlayResult } from './types'

export function optionValue(game: GameDef, config: Record<string, OptionValue>, id: string | undefined): OptionValue | undefined {
  if (!id) return undefined
  return config[id] ?? game.options.find((o) => o.id === id)?.default
}

function numOption(game: GameDef, config: Record<string, OptionValue>, id: string | undefined, fallback?: number): number | undefined {
  const v = optionValue(game, config, id)
  return typeof v === 'number' ? v : typeof v === 'string' && v !== '' && !isNaN(+v) ? +v : fallback
}

/** Configuración inicial de una partida: el valor por defecto de cada opción. */
export function defaultConfig(game: GameDef): Record<string, OptionValue> {
  return Object.fromEntries(game.options.map((o) => [o.id, o.default]))
}

export function targetOf(game: GameDef, config: Record<string, OptionValue>): number | undefined {
  return numOption(game, config, game.scoring.targetOption, game.scoring.target)
}

export function roundsOf(game: GameDef, config: Record<string, OptionValue>): number | undefined {
  return numOption(game, config, game.scoring.roundsOption, game.scoring.rounds ?? game.scoring.roundLabels?.length)
}

export function eliminateOf(game: GameDef, config: Record<string, OptionValue>): number | undefined {
  return numOption(game, config, game.scoring.eliminateOption, game.scoring.eliminateAt)
}

export interface LiveState {
  /** Puntaje actual de cada lado (en `turns`, el público; en `rounds`, el acumulado). */
  scores: number[]
  /** Cantidad de cada evento `count` por lado. */
  counts: Record<string, number[]>
  /** Dueño actual de cada evento `holder` (-1 = nadie). */
  holders: Record<string, number>
  /** Veces que cada lado tuvo cada `holder` (para premios). */
  holderGains: Record<string, number[]>
  /** Puntos que vienen de eventos ocultos (se suman recién al final). */
  hiddenScores: number[]
  /** Turno actual (índice de lado) y cuántos turnos se jugaron. */
  turn: number
  turnCount: number
  /** Manos jugadas (modo `rounds`). */
  roundsPlayed: number
  /** Lados eliminados (chinchón). */
  eliminated: boolean[]
  /** Lado que ganó en el acto con un evento (chinchón). */
  instantWinner?: number
  /** Eventos globales (empates del ta-te-ti). */
  globalCounts: Record<string, number>
  /** Modo `sets`: games, sets y el punto en juego. `scores` son los sets ganados. */
  sets?: SetsState
}

function eventDef(game: GameDef, id: string): EventDef | undefined {
  return game.events.find((e) => e.id === id)
}

export function computeLive(game: GameDef, play: Play): LiveState {
  const n = play.sides.length
  const zeros = () => new Array<number>(n).fill(0)
  const st: LiveState = {
    scores: zeros(),
    counts: {},
    holders: {},
    holderGains: {},
    hiddenScores: zeros(),
    turn: 0,
    turnCount: 0,
    roundsPlayed: 0,
    eliminated: new Array<boolean>(n).fill(false),
    globalCounts: {},
  }
  for (const e of game.events) {
    if (e.type === 'holder') {
      st.holders[e.id] = -1
      st.holderGains[e.id] = zeros()
    } else st.counts[e.id] = zeros()
  }

  for (const entry of play.log) applyEntry(game, st, entry, n)

  // Los `holder` suman sus puntos a quien los tiene ahora.
  for (const e of game.events) {
    if (e.type !== 'holder' || !e.points) continue
    const h = st.holders[e.id]
    if (h >= 0 && h < n) {
      if (e.hidden) st.hiddenScores[h] += e.points
      else if (game.mode === 'turns' || game.mode === 'counter') st.scores[h] += e.points
    }
  }

  const elim = eliminateOf(game, play.config)
  if (game.mode === 'rounds' && elim !== undefined) {
    st.eliminated = st.scores.map((s) => s >= elim)
  }
  if (game.mode === 'sets') {
    st.sets = computeSets(setsRuleOf(game, play.config), pointSides(play.log))
    st.scores = play.sides.map((_, i) => st.sets!.won[i] ?? 0)
  }
  return st
}

/** Lo que hizo cada jugador en una partida: lo que anotó, asistencias y eventos propios. */
export interface PlayerLine {
  /** Puntos (goles) anotados por el jugador. */
  scored: number
  assists: number
  /** Eventos `byPlayer` por id. */
  events: Record<string, number>
}

export function emptyLine(): PlayerLine {
  return { scored: 0, assists: 0, events: {} }
}

/** Estadísticas por jugador de una partida, según lo anotado con nombre (`pl`/`as`). */
export function playerLines(play: Pick<Play, 'log'>): Map<Id, PlayerLine> {
  const out = new Map<Id, PlayerLine>()
  const line = (id: Id) => {
    let l = out.get(id)
    if (!l) out.set(id, (l = emptyLine()))
    return l
  }
  for (const e of play.log) {
    if (e.k === 'pt') {
      if (e.pl) line(e.pl).scored += e.n
      if (e.as) line(e.as).assists++
    } else if (e.k === 'ev' && e.pl) {
      const l = line(e.pl)
      l.events[e.e] = Math.max(0, (l.events[e.e] ?? 0) + e.n)
    }
  }
  return out
}

function applyEntry(game: GameDef, st: LiveState, entry: LogEntry, n: number) {
  switch (entry.k) {
    case 'pt':
      if (entry.s >= 0 && entry.s < n) st.scores[entry.s] += entry.n
      break
    case 'turn':
      st.turn = entry.s
      st.turnCount++
      break
    case 'ev': {
      const def = eventDef(game, entry.e)
      if (!def) break
      if (def.global || entry.s < 0) {
        st.globalCounts[def.id] = (st.globalCounts[def.id] ?? 0) + entry.n
        break
      }
      if (entry.s >= n) break
      if (def.type === 'holder') {
        st.holders[def.id] = entry.s
        if (entry.s >= 0) st.holderGains[def.id][entry.s]++
        break
      }
      const counts = st.counts[def.id]
      counts[entry.s] = Math.max(0, counts[entry.s] + entry.n)
      if (def.replaces && entry.n > 0 && st.counts[def.replaces]) {
        const other = st.counts[def.replaces]
        if (other[entry.s] > 0) {
          other[entry.s]--
          const replaced = eventDef(game, def.replaces)
          if (replaced?.points && game.mode !== 'rounds') {
            if (replaced.hidden) st.hiddenScores[entry.s] -= replaced.points
            else st.scores[entry.s] -= replaced.points
          }
        }
      }
      const pts = (entry.p ?? def.points ?? 0) * entry.n
      if (pts && game.mode !== 'rounds') {
        if (def.hidden) st.hiddenScores[entry.s] += pts
        else st.scores[entry.s] += pts
      }
      if (def.winsGame && entry.n > 0) st.instantWinner = entry.s
      break
    }
    case 'round': {
      st.roundsPlayed++
      entry.sc.forEach((v, i) => {
        if (i < n) st.scores[i] += v
      })
      for (const [id, arr] of Object.entries(entry.ev ?? {})) {
        const def = eventDef(game, id)
        if (!def) continue
        if (def.type === 'holder') {
          const h = arr.findIndex((x) => x > 0)
          if (h >= 0) {
            st.holders[id] = h
            st.holderGains[id][h]++
          }
          continue
        }
        const counts = st.counts[id]
        arr.forEach((v, i) => {
          if (i < n) counts[i] += v
        })
        if (def.winsGame) {
          const w = arr.findIndex((x) => x > 0)
          if (w >= 0) st.instantWinner = w
        }
      }
      break
    }
  }
}

/** Puntaje de una mano según la ficha (apuesta y bazas, o número directo) más los eventos con puntos. */
export function roundScore(
  game: GameDef,
  roundIndex: number,
  input: { value?: number | null; bid?: number | null; tricks?: number | null },
  events: Record<string, number>,
  askedPoints: Record<string, number> = {},
): number {
  let score = 0
  const sc = game.scoring
  const scorer = sc.scorer ?? 'sum'
  if (scorer === 'sum') score = input.value ?? 0
  else {
    const bid = input.bid ?? 0
    const tricks = input.tricks ?? 0
    const roundNumber = roundIndex + 1
    if (scorer === 'skullKing') {
      if (bid === 0) score = tricks === 0 ? 10 * roundNumber : -10 * roundNumber
      else score = bid === tricks ? 20 * bid : -10 * Math.abs(bid - tricks)
    } else {
      const hit = sc.bidHit ?? 10
      const per = sc.bidPerTrick ?? 5
      // `bidMiss` es lo que se pierde por cada baza de diferencia (da igual si la ficha lo pone con signo).
      const miss = Math.abs(sc.bidMiss ?? 5)
      score = bid === tricks ? hit + per * tricks : -miss * Math.abs(bid - tricks)
    }
  }
  for (const e of game.events) {
    const times = events[e.id] ?? 0
    if (!times || e.type === 'holder') continue
    // En Skull King los bonus sólo cuentan si se acertó la apuesta.
    if (scorer === 'skullKing' && (input.bid ?? 0) !== (input.tricks ?? 0)) continue
    const pts = e.askPoints ? (askedPoints[e.id] ?? 0) : (e.points ?? 0) * times
    score += pts
  }
  return score
}

/** Puestos a partir de puntajes (empates comparten puesto). */
export function placesFromScores(scores: number[], lowWins = false): number[] {
  return scores.map((s) => 1 + scores.filter((o) => (lowWins ? o < s : o > s)).length)
}

/**
 * Si la partida terminó sola (alguien llegó al objetivo, se jugaron todas las
 * manos, quedó uno solo), devuelve el resultado. Si no, `undefined`.
 */
export function autoResult(game: GameDef, play: Play, live = computeLive(game, play)): PlayResult | undefined {
  const target = targetOf(game, play.config)
  const lowWins = !!game.scoring.lowWins
  const n = play.sides.length
  const scores = live.scores

  if (live.instantWinner !== undefined) {
    const w = live.instantWinner
    // El resto se ordena entre sí (sin contar al ganador), desde el segundo puesto.
    const rest = scores.filter((_, i) => i !== w)
    const places = scores.map((s, i) => (i === w ? 1 : 2 + rest.filter((o) => (lowWins ? o < s : o > s)).length))
    return { scores, places }
  }

  if (game.mode === 'sets') {
    if (live.sets?.winner === undefined) return undefined
    return { scores, places: placesFromScores(scores) }
  }

  if (game.mode === 'counter') {
    if (target === undefined) return undefined
    const reached = scores.findIndex((s) => s >= target)
    if (reached < 0) return undefined
    return { scores, places: placesFromScores(scores) }
  }

  if (game.mode === 'rounds') {
    if (!live.roundsPlayed) return undefined
    const elim = eliminateOf(game, play.config)
    if (elim !== undefined && n > 1) {
      const alive = live.eliminated.filter((e) => !e).length
      if (alive <= 1) {
        // El que queda gana; el resto, por puntaje (menos es mejor).
        const base = placesFromScores(scores, true)
        return { scores, places: scores.map((_, i) => (!live.eliminated[i] ? 1 : base[i] + (alive ? 1 : 0))) }
      }
      return undefined
    }
    const rounds = roundsOf(game, play.config)
    if (rounds !== undefined && live.roundsPlayed >= rounds) return { scores, places: placesFromScores(scores, lowWins) }
    if (target !== undefined && !lowWins && scores.some((s) => s >= target)) return { scores, places: placesFromScores(scores) }
    return undefined
  }
  return undefined
}

/** Índices de los lados ganadores de una partida terminada (vacío si fue empate entre todos o no terminó). */
export function winnerSides(play: Pick<Play, 'result' | 'status'>): number[] {
  if (play.status !== 'finished' || !play.result) return []
  const places = play.result.places
  const firsts = places.map((p, i) => (p === 1 ? i : -1)).filter((i) => i >= 0)
  if (play.result.coopWin !== undefined) return play.result.coopWin ? firsts : []
  // Todos primeros = empate.
  return firsts.length === places.length && places.length > 1 ? [] : firsts
}

export function isDraw(play: Play): boolean {
  return play.status === 'finished' && !!play.result && play.result.coopWin === undefined && play.result.places.length > 1 && play.result.places.every((p) => p === 1)
}

/** Lados que conviene mostrar ordenados por posición. */
export function sidesByPlace(play: Play): number[] {
  const idx = play.sides.map((_, i) => i)
  const places = play.result?.places
  return places ? idx.sort((a, b) => places[a] - places[b]) : idx
}

/** Próximo turno en el modo `turns`. */
export function nextTurn(play: Play, live: LiveState): number {
  if (!live.turnCount) return 0
  return (live.turn + 1) % play.sides.length
}
