// Marcador por sets (modo `sets`): a partir de quién ganó cada punto, calcula games, sets y ganador.
// Sirve para los de raqueta y red: tenis y pádel (15-30-40, sets a 6 con tie-break) y los de sets a N
// puntos (vóley, fútbol tenis, bádminton, pickleball).

import type { GameDef, OptionValue, SetsRule } from './games/schema'

export interface SetScore {
  /** Games (tenis) o puntos (sets a N) de cada lado. */
  score: [number, number]
  /** Puntos del tie-break, si el set se definió así. */
  tb?: [number, number]
  /** Se jugó como super tie-break (a 10) en lugar del set decisivo. */
  superTb?: boolean
}

export interface SetsState {
  /** Sets terminados. */
  done: SetScore[]
  /** Set en juego: games (tenis) o puntos (sets a N). */
  current: [number, number]
  /** Tenis: puntos del game en juego (o del tie-break). */
  game: [number, number]
  /** El game en juego es un tie-break (o super tie-break). */
  tiebreak: boolean
  superTb: boolean
  /** Sets ganados por lado. */
  won: [number, number]
  /** Sets que hay que ganar. */
  need: number
  winner?: 0 | 1
  /** Cómo se canta el punto en juego: ["40", "Ad"], ["15", "0"], ["7", "5"]. */
  call: [string, string]
  /** Puntos jugados que cuentan (los que llegan después del final se ignoran). */
  played: number
  /** Lado que saca el próximo punto. */
  server: 0 | 1
  /**
   * Turnos de saque que empezó cada lado (contando el actual). En dobles de tenis o pádel, el que saca dentro
   * de la pareja va rotando: turno 1 el primero, turno 2 el segundo…
   */
  serveTurns: [number, number]
}

function opt(game: GameDef, config: Record<string, OptionValue>, id: string | undefined): OptionValue | undefined {
  if (!id) return undefined
  return config[id] ?? game.options.find((o) => o.id === id)?.default
}

function num(v: OptionValue | undefined, fallback: number): number {
  return typeof v === 'number' ? v : typeof v === 'string' && v !== '' && !isNaN(+v) ? +v : fallback
}

/** La regla de sets con las opciones de la partida ya aplicadas. */
export function setsRuleOf(game: GameDef, config: Record<string, OptionValue>) {
  const r: SetsRule = game.scoring.sets ?? { kind: 'points', bestOf: 3, points: 21 }
  return {
    kind: r.kind,
    bestOf: Math.max(1, num(opt(game, config, r.bestOfOption), r.bestOf)),
    points: Math.max(1, num(opt(game, config, r.pointsOption), r.points ?? 21)),
    lastSetPoints: r.lastSetPoints,
    winBy: r.winBy ?? 2,
    cap: r.cap,
    games: r.games ?? 6,
    golden: opt(game, config, r.goldenPointOption) === true,
    superTb: opt(game, config, r.superTiebreakOption) === true,
  }
}

export type ResolvedSets = ReturnType<typeof setsRuleOf>

const CALLS = ['0', '15', '30', '40']

/** Se cierra a `to` con `by` de diferencia (o al llegar al tope). */
function closes(p: number, q: number, to: number, by: number, cap?: number): boolean {
  if (cap !== undefined && p >= cap) return true
  return p >= to && p - q >= by
}

/** Estado del partido después de una secuencia de puntos (0 = ganó el lado A, 1 = el B). */
/**
 * Estado del partido después de una secuencia de puntos (0 = ganó el lado A, 1 = el B).
 * Saque: en tenis y pádel cambia en cada game (en el tie-break, después del primer punto, cada dos);
 * en los de sets a N puntos saca el que ganó el último punto.
 */
export function computeSets(rule: ResolvedSets, points: number[], firstServer: 0 | 1 = 0): SetsState {
  const need = Math.floor(rule.bestOf / 2) + 1
  const st: SetsState = {
    done: [],
    current: [0, 0],
    game: [0, 0],
    tiebreak: false,
    superTb: false,
    won: [0, 0],
    need,
    call: ['0', '0'],
    played: 0,
    server: firstServer,
    serveTurns: [firstServer === 0 ? 1 : 0, firstServer === 1 ? 1 : 0],
  }
  // Quién sacó el primer punto del tie-break en curso (y cuántos puntos lleva).
  let tbFirst: 0 | 1 = firstServer
  const giveServe = (side: 0 | 1) => {
    if (side !== st.server) st.serveTurns[side]++
    st.server = side
  }
  const deciding = () => st.won[0] === need - 1 && st.won[1] === need - 1
  const startSet = () => {
    st.current = [0, 0]
    st.game = [0, 0]
    st.superTb = rule.kind === 'tennis' && rule.superTb && rule.bestOf > 1 && deciding()
    st.tiebreak = st.superTb
    if (st.superTb) tbFirst = st.server
  }
  const closeSet = (s: 0 | 1, set: SetScore) => {
    st.done.push(set)
    st.won[s]++
    if (st.won[s] >= need) st.winner = s
    else startSet()
  }
  startSet()

  for (const raw of points) {
    if (st.winner !== undefined) break
    if (raw !== 0 && raw !== 1) continue
    const s = raw as 0 | 1
    const o = (1 - s) as 0 | 1
    st.played++
    if (rule.kind === 'points') {
      st.current[s]++
      const to = deciding() && rule.lastSetPoints ? rule.lastSetPoints : rule.points
      // El tope corre a la par del objetivo: un set a 15 con tope 30 se cierra a 15 + 15.
      const cap = rule.cap !== undefined ? rule.cap - rule.points + to : undefined
      if (closes(st.current[s], st.current[o], to, rule.winBy, cap)) closeSet(s, { score: [...st.current] as [number, number] })
      giveServe(s)
      continue
    }
    // Tenis / pádel.
    st.game[s]++
    if (st.tiebreak) {
      const to = st.superTb ? 10 : 7
      if (closes(st.game[s], st.game[o], to, 2)) {
        const tb = [...st.game] as [number, number]
        // El que recibió primero en el tie-break saca primero en el set siguiente.
        giveServe((1 - tbFirst) as 0 | 1)
        if (st.superTb) closeSet(s, { score: s === 0 ? [1, 0] : [0, 1], tb, superTb: true })
        else {
          st.current[s]++
          closeSet(s, { score: [...st.current] as [number, number], tb })
        }
      } else {
        // Primer punto: saca uno; después, dos y dos.
        const k = st.game[0] + st.game[1]
        giveServe(Math.ceil(k / 2) % 2 === 1 ? ((1 - tbFirst) as 0 | 1) : tbFirst)
      }
      continue
    }
    const [p, q] = [st.game[s], st.game[o]]
    const gameWon = rule.golden ? p >= 4 && p > q : p >= 4 && p - q >= 2
    if (!gameWon) continue
    st.game = [0, 0]
    st.current[s]++
    giveServe((1 - st.server) as 0 | 1)
    const g = rule.games
    if (closes(st.current[s], st.current[o], g, 2)) closeSet(s, { score: [...st.current] as [number, number] })
    else if (st.current[0] === g && st.current[1] === g) {
      st.tiebreak = true
      tbFirst = st.server
    }
  }

  if (st.winner === undefined) {
    if (rule.kind === 'points') st.call = [String(st.current[0]), String(st.current[1])]
    else if (st.tiebreak) st.call = [String(st.game[0]), String(st.game[1])]
    else {
      const [a, b] = st.game
      if (a >= 3 && b >= 3) st.call = a === b ? ['40', '40'] : a > b ? ['Ad', '40'] : ['40', 'Ad']
      else st.call = [CALLS[Math.min(a, 3)], CALLS[Math.min(b, 3)]]
    }
  }
  return st
}

/** "6-4 3-6 7-6(5)" o "25-21 23-25 15-12". `first` es el lado que va adelante en el texto. */
export function setsLine(st: Pick<SetsState, 'done'>, first: 0 | 1 = 0): string {
  return st.done
    .map((set) => {
      const a = set.score[first]
      const b = set.score[1 - first]
      if (set.superTb && set.tb) return `[${set.tb[first]}-${set.tb[1 - first]}]`
      const tb = set.tb ? `(${Math.min(set.tb[0], set.tb[1])})` : ''
      return `${a}-${b}${tb}`
    })
    .join(' ')
}

/** "Al mejor de 3 sets", "Un set". */
export function bestOfText(rule: Pick<ResolvedSets, 'bestOf'>): string {
  return rule.bestOf === 1 ? 'a un set' : `al mejor de ${rule.bestOf} sets`
}

/** Puntos de una partida por sets: el lado de cada `pt` del registro, en orden. */
export function pointSides(log: { k: string; s?: number }[]): number[] {
  return log.filter((e) => e.k === 'pt').map((e) => e.s ?? -1)
}
