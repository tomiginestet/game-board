import { describe, expect, it } from 'vitest'
import { BUILTIN_GAMES } from '../lib/games'
import { BRANDS, brandFor, DEFAULT_SKIN } from './brands'
import { skin, SKINS } from '.'
import { say } from './say'

describe('skins', () => {
  it('sin VITE_SKIN se arma Game Board', () => {
    expect(DEFAULT_SKIN).toBe('gameboard')
    expect(skin.id).toBe('gameboard')
    expect(skin.name).toBe('Game Board')
  })

  it('un skin que no existe frena el build', () => {
    expect(() => brandFor('nada')).toThrow(/no existe/)
  })

  it('cada marca tiene su id como clave y un nombre corto que entra bajo el ícono', () => {
    for (const [id, brand] of Object.entries(BRANDS)) {
      expect(brand.id).toBe(id)
      expect(brand.shortName.length).toBeLessThanOrEqual(12)
    }
  })

  it('cada marca tiene su skin y cada skin lleva su marca', () => {
    expect(Object.keys(SKINS).sort()).toEqual(Object.keys(BRANDS).sort())
    for (const [id, s] of Object.entries(SKINS)) expect(s).toMatchObject(BRANDS[id])
  })

  it('los destacados y el carrusel de cada skin son juegos de su catálogo', () => {
    for (const s of Object.values(SKINS)) {
      const shown = new Set(BUILTIN_GAMES.filter(s.catalog.include ?? (() => true)).map((g) => g.id))
      expect(shown.size, s.id).toBeGreaterThan(0)
      for (const id of [...s.catalog.featured, ...s.catalog.hero]) expect(shown.has(id), `${s.id}: ${id}`).toBe(true)
    }
  })

  it('say completa las llaves y deja la frase de Game Board si el skin no tiene otra', () => {
    expect(say('Descartaste la partida de {juego}.', { juego: 'Truco' })).toBe('Descartaste la partida de Truco.')
    expect(say('Una frase que ningún skin cambia')).toBe('Una frase que ningún skin cambia')
  })

  it('cada frase propia de un skin sigue existiendo en un say(...) y lleva las mismas llaves', () => {
    const files = import.meta.glob<string>(['../**/*.{ts,tsx}', '!../skins/**', '!../**/*.test.ts'], { query: '?raw', import: 'default', eager: true })
    const source = Object.values(files).join('\n')
    const keys = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
    for (const s of Object.values(SKINS)) {
      for (const [from, to] of Object.entries(s.copy ?? {})) {
        const quoted = [`say('${from.replace(/'/g, "\\'")}'`, `say("${from}"`, `say(\`${from}\``]
        expect(quoted.some((q) => source.includes(q)), `${s.id}: "${from}" ya no está en ningún say(...)`).toBe(true)
        expect(keys(to), `${s.id}: "${to}"`).toEqual(keys(from))
      }
    }
  })
})
