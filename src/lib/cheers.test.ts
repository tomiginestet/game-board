import { describe, expect, it } from 'vitest'
import { cheerFor, cheersOf, type Outcome } from './cheers'

const OUTCOMES: Outcome[] = ['win', 'lowWin', 'draw', 'coopWin', 'coopLoss']

describe('cheers', () => {
  it('tiene entre 12 y 20 frases distintas por resultado', () => {
    for (const o of OUTCOMES) {
      const list = cheersOf(o)
      expect(list.length).toBeGreaterThanOrEqual(12)
      expect(list.length).toBeLessThanOrEqual(20)
      expect(new Set(list).size).toBe(list.length)
    }
  })

  it('elige siempre la misma frase para la misma partida', () => {
    expect(cheerFor('win', 'abc123')).toBe(cheerFor('win', 'abc123'))
    expect(cheersOf('draw')).toContain(cheerFor('draw', 'xyz'))
  })

  it('reparte las frases entre partidas distintas', () => {
    const seen = new Set(Array.from({ length: 200 }, (_, i) => cheerFor('win', `play-${i}`)))
    expect(seen.size).toBeGreaterThan(10)
  })
})
