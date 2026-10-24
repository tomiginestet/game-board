import { describe, expect, it } from 'vitest'
import { BUILTIN_GAMES } from '../lib/games'
import { BRANDS, brandFor, DEFAULT_SKIN } from './brands'
import { skin } from '.'

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

  it('los destacados y el carrusel son juegos del catálogo del skin', () => {
    const shown = new Set(BUILTIN_GAMES.filter(skin.catalog.include ?? (() => true)).map((g) => g.id))
    for (const id of [...skin.catalog.featured, ...skin.catalog.hero]) expect(shown.has(id), id).toBe(true)
  })
})
