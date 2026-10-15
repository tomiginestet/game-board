import type { RouteObject } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { hashPath, screenFor } from './visits'

// La misma forma que las rutas de App.tsx: una suelta y el resto dentro del layout.
const routes: RouteObject[] = [
  { path: '/partido/:id' },
  {
    children: [
      { index: true },
      { path: '/juegos' },
      { path: '/juegos/nuevo' },
      { path: '/juegos/:id' },
      { path: '/partido/nuevo' },
      { path: '/unirse/:code' },
      { path: 'relativa/:id' },
      { path: '*' },
    ],
  },
]

describe('screenFor', () => {
  it('manda la pantalla genérica, nunca el código del club ni los ids', () => {
    expect(screenFor(routes, '/unirse/K7Q2XZ')).toBe('/unirse/:code')
    expect(screenFor(routes, '/partido/abc123')).toBe('/partido/:id')
    expect(screenFor(routes, '/juegos/catan')).toBe('/juegos/:id')
  })

  it('respeta las rutas fijas antes que las de parámetro', () => {
    expect(screenFor(routes, '/juegos/nuevo')).toBe('/juegos/nuevo')
    expect(screenFor(routes, '/partido/nuevo')).toBe('/partido/nuevo')
  })

  it('el inicio, las rutas relativas y las direcciones que no existen', () => {
    expect(screenFor(routes, '/')).toBe('/')
    expect(screenFor(routes, '/relativa/42')).toBe('/relativa/:id')
    expect(screenFor(routes, '/esto/no/existe')).toBe('/no-existe')
  })
})

describe('hashPath', () => {
  it('saca la dirección de adentro del # sin la consulta', () => {
    expect(hashPath('#/unirse/K7Q2XZ?ref=wa')).toBe('/unirse/K7Q2XZ')
    expect(hashPath('#/juegos')).toBe('/juegos')
    expect(hashPath('')).toBe('/')
    expect(hashPath('#')).toBe('/')
  })
})
