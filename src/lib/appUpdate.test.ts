import { describe, expect, it } from 'vitest'
import { isBusyPath, isStaleChunkError } from './appUpdate'

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

describe('isStaleChunkError', () => {
  it('reconoce una pantalla que no se pudo bajar, en cada navegador', () => {
    for (const m of [
      'Importing a module script failed.',
      'Failed to fetch dynamically imported module: https://x/assets/Me-abc.js',
      'error loading dynamically imported module: https://x/assets/Me-abc.js',
      'Unable to preload CSS for /assets/Me-abc.css',
    ]) {
      expect(isStaleChunkError(new Error(m)), m).toBe(true)
    }
  })

  it('los demás errores no', () => {
    expect(isStaleChunkError(new Error("undefined is not an object (evaluating 'a.name')"))).toBe(false)
    expect(isStaleChunkError('Importing a module script failed.')).toBe(false)
  })
})
