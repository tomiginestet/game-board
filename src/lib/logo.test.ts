import { describe, expect, it } from 'vitest'
import { LOGO_PALETTE, loaderForPath, logoAnimation, logoSvg, recolorLogo, type LogoKind } from './logo'

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

  it('con otra paleta cambian los cuadraditos y el fondo, y el dorado del ganador queda', () => {
    const palette = { a: '#000001', b: '#000002', c: '#000003', d: '#000004', ink: '#000005', tile: '#000006', dim: '#000007' }
    const svg = logoSvg('podio', { bg: true, palette })
    for (const hex of Object.values(LOGO_PALETTE)) expect(svg).not.toContain(hex)
    for (const hex of Object.values(palette).slice(0, 5)) expect(svg).toContain(hex)
    expect(svg).toContain('#ffb400')
    expect(recolorLogo(logoSvg('quieto'), LOGO_PALETTE)).toBe(logoSvg('quieto'))
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
