import { describe, expect, it } from 'vitest'
import { computeLive } from './engine'
import { canFinishDirectly, directResult, finishShortfall, statsFilled } from './finish'
import { BUILTIN_GAMES } from './games'
import type { GameDef } from './games/schema'
import type { LogEntry, Play } from './types'

const game = (id: string): GameDef => {
  const g = BUILTIN_GAMES.find((x) => x.id === id)
  if (!g) throw new Error(`falta ${id}`)
  return g
}

let n = 0
function play(gameId: string, sides: string[][], log: LogEntry[] = [], extra: Partial<Play> = {}): Play {
  n++
  return { id: `f${n}`, gameId, createdAt: n, status: 'live', config: {}, sides: sides.map((players) => ({ players })), log, ...extra }
}
const t = 0
const pt = (s: number, k = 1): LogEntry => ({ k: 'pt', s, n: k, t })
const round = (sc: number[]): LogEntry => ({ k: 'round', sc, t })

const check = (g: GameDef, p: Play) => {
  const live = computeLive(g, p)
  return { can: canFinishDirectly(g, p, live), result: directResult(g, p, live), short: finishShortfall(g, p, live) }
}

describe('terminar partida', () => {
  it('truco a mitad: se cierra directo, pero avisa que nadie llegó', () => {
    const r = check(game('truco'), play('truco', [['a'], ['b']], [pt(0, 12), pt(1, 5)]))
    expect(r.can).toBe(true)
    expect(r.result).toEqual({ scores: [12, 5], places: [1, 2] })
    expect(r.short).toBe('Nadie llegó a 30 tantos')
  })

  it('empate arriba: hace falta el desempate (formulario)', () => {
    const r = check(game('truco'), play('truco', [['a'], ['b']], [pt(0, 7), pt(1, 7)]))
    expect(r.can).toBe(false)
    expect(check(game('truco'), play('truco', [['a'], ['b']])).can).toBe(false)
  })

  it('generala: faltan manos, se cierra directo con aviso', () => {
    const g = game('generala')
    const r = check(g, play('generala', [['a'], ['b']], [round([12, 4]), round([6, 9]), round([20, 0])]))
    expect(r.can).toBe(true)
    expect(r.result?.places).toEqual([1, 2])
    expect(r.short).toBe('Faltan 8 manos')
  })

  it('catán: con puntaje oculto pasa por el formulario para revisar los puntos finales', () => {
    const g = game('catan')
    expect(g.stats.length).toBeGreaterThan(0)
    const log: LogEntry[] = [
      { k: 'ev', s: 0, e: 'settlement', n: 3, t },
      { k: 'ev', s: 1, e: 'settlement', n: 2, t },
      { k: 'ev', s: 2, e: 'settlement', n: 2, t },
    ]
    const r = check(g, play('catan', [['a'], ['b'], ['c']], log))
    expect(r.can).toBe(false)
  })

  it('chinchón (se quema): gana el que menos tiene, sin aviso de manos', () => {
    const r = check(game('chinchon'), play('chinchon', [['a'], ['b'], ['c']], [round([10, 30, 22])]))
    expect(r.result?.places).toEqual([1, 3, 2])
    expect(r.short).toBeUndefined()
  })

  it('roles, cooperativos y resultado a mano: siempre formulario', () => {
    expect(check(game('impostor'), play('impostor', [['a'], ['b'], ['c']])).can).toBe(false)
    expect(check(game('pandemic'), play('pandemic', [['a', 'b']])).can).toBe(false)
    const counterWithRoles = { ...game('truco'), roles: ['Impostor', 'Tripulante'] }
    expect(check(counterWithRoles, play('truco', [['a'], ['b']], [pt(0, 3)])).can).toBe(false)
  })

  it('statsFilled: sólo cuenta si hay algún dato', () => {
    const p = play('catan', [['a'], ['b']], [], { status: 'finished', result: { places: [1, 2], stats: { vpCards: [null, null], favResource: ['', null] } } })
    expect(statsFilled(p)).toBe(false)
    p.result!.stats!.vpCards = [1, null]
    expect(statsFilled(p)).toBe(true)
  })
})
