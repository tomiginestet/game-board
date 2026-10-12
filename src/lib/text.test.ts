import { describe, expect, it } from 'vitest'
import { friendlyError } from './text'

describe('friendlyError', () => {
  it('traduce errores de red y de sesión', () => {
    expect(friendlyError(new TypeError('Failed to fetch'))).toMatch(/No hay conexión/)
    expect(friendlyError(new Error('JWT expired'))).toMatch(/sesión venció/)
    expect(friendlyError(new Error('Token has expired or is invalid'))).toMatch(/código venció/)
    expect(friendlyError({ message: 'email rate limit exceeded' })).toMatch(/muchos intentos/)
  })

  it('traduce errores del servidor', () => {
    expect(friendlyError(new Error('Club inexistente'))).toMatch(/No encontramos ese club/)
    expect(friendlyError(new Error('Lote inválido'))).toMatch(/No pudimos guardar/)
    expect(friendlyError(new SyntaxError('Unexpected token < in JSON at position 0'))).toMatch(/formato/)
  })

  it('deja pasar los mensajes propios y esconde los técnicos', () => {
    expect(friendlyError(new Error('No podés ser tu propio amigo (en la app)'))).toBe('No podés ser tu propio amigo (en la app)')
    expect(friendlyError(new Error('Cannot read properties of undefined'))).toBe('Algo salió mal. Probá de nuevo en un rato.')
    expect(friendlyError(undefined)).toBe('Algo salió mal. Probá de nuevo en un rato.')
  })
})
