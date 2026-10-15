import { describe, expect, it } from 'vitest'
import { isBusyPath } from './appUpdate'

describe('isBusyPath', () => {
  it('no recarga en medio de una partida o un formulario', () => {
    for (const p of ['/partido/abc', '/partida/x1', '/jugar/catan', '/anotar', '/juegos/nuevo', '/juegos/catan/editar', '/torneos/nuevo', '/ping-pong/nuevo', '/ajustes', '/admin/juegos']) {
      expect(isBusyPath(p), p).toBe(true)
    }
  })

  it('en las pantallas para mirar sí', () => {
    for (const p of ['/', '/juegos', '/juegos/catan', '/torneos', '/torneos/abc', '/ranking', '/historial', '/grupo', '/partidos']) {
      expect(isBusyPath(p), p).toBe(false)
    }
  })
})
