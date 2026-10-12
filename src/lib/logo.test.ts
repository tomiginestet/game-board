import { describe, expect, it } from 'vitest'
import favicon from '../../public/favicon.svg?raw'
import secuencia from '../../public/logo-secuencia.svg?raw'
import { loaderForPath, logoAnimation, logoSvg, type LogoKind } from './logo'

const KINDS: LogoKind[] = ['secuencia', 'podio', 'tabla', 'turnos', 'medalla', 'escalera', 'duelo']

describe('logo', () => {
  it('cada animación tiene tantos valores como tiempos y empieza y termina en la grilla', () => {
    for (const k of KINDS) {
      const { inner, dur } = logoAnimation(k)
      expect(dur).toBeGreaterThan(0)
      for (const m of inner.matchAll(/keyTimes="([^"]+)" values="([^"]+)"/g)) {
        const kt = m[1].split(';').map(Number)
        const vals = m[2].split(';')
        expect(vals.length, k).toBe(kt.length)
        expect(kt[0]).toBe(0)
        expect(kt[kt.length - 1]).toBe(1)
        expect([...kt].sort((a, b) => a - b), k).toEqual(kt)
        expect(vals[0], k).toBe(vals[vals.length - 1])
      }
    }
  })

  it('los SVG de public/ están al día (npm run logo)', () => {
    expect(favicon).toBe(logoSvg('quieto', { bg: true, title: 'Game Board' }))
    expect(secuencia).toBe(logoSvg('secuencia', { title: 'Game Board' }))
  })

  it('elige la animación según la pantalla', () => {
    expect(loaderForPath('/partido/nuevo')).toBe('duelo')
    expect(loaderForPath('/ping-pong/nuevo')).toBe('duelo')
    expect(loaderForPath('/ping-pong/torneos/abc')).toBe('podio')
    expect(loaderForPath('/torneos/abc')).toBe('podio')
    expect(loaderForPath('/partida/abc')).toBe('turnos')
    expect(loaderForPath('/jugar/catan')).toBe('turnos')
    expect(loaderForPath('/ranking')).toBe('tabla')
    expect(loaderForPath('/jugadores/abc')).toBe('escalera')
    expect(loaderForPath('/juegos/catan')).toBe('medalla')
    expect(loaderForPath('/')).toBe('secuencia')
    expect(loaderForPath('/historial')).toBe('secuencia')
  })
})
