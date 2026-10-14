import { describe, expect, it } from 'vitest'
import { cleanSlugInput, hashRedirect, inviteLinkFor, inviteTarget, shortLink, suggestSlug, tableLink, validSlug } from './clubLink'

describe('links cortos', () => {
  it('valida el nombre del link', () => {
    expect(validSlug('lasartes')).toBe(true)
    expect(validSlug('las-artes-2')).toBe(true)
    expect(validSlug('ab')).toBe(false)
    expect(validSlug('-lasartes')).toBe(false)
    expect(validSlug('las--artes')).toBe(false)
    expect(validSlug('las artes')).toBe(false)
    expect(validSlug('lasartés')).toBe(false)
  })

  it('sugiere un link a partir del nombre', () => {
    expect(suggestSlug('Club de Las Artes')).toBe('lasartes')
    expect(suggestSlug('Las Artes')).toBe('lasartes')
    expect(suggestSlug('Bar del Puerto')).toBe('puerto')
    expect(suggestSlug('Los del asado')).toBe('losdelasado')
    expect(suggestSlug('Ping Pong Ñuñoa')).toBe('pingpongnunoa')
    expect(suggestSlug('El Club')).toBe('elclub')
    expect(suggestSlug('🍻')).toBe('')
  })

  it('limpia lo que se escribe', () => {
    expect(cleanSlugInput('Las Artes')).toBe('las-artes')
    expect(cleanSlugInput('Peña  Ñandú!!')).toBe('pena-nandu')
  })

  it('arma los links para compartir sin #', () => {
    expect(shortLink('lasartes', 'https://gameboard.app/#/grupo')).toBe('https://gameboard.app/c/lasartes')
    expect(shortLink('lasartes', 'https://x.github.io/game-board/?a=1#/')).toBe('https://x.github.io/game-board/c/lasartes')
    expect(shortLink('lasartes', 'http://localhost:5173/#/grupo', 'https://game-board-club.vercel.app')).toBe('https://game-board-club.vercel.app/c/lasartes')
    expect(tableLink('lasartes', 'pingpong', 'https://gameboard.app/')).toBe('https://gameboard.app/c/lasartes?juego=pingpong')
    expect(inviteLinkFor('abc123', 'https://gameboard.app/#/club')).toBe('https://gameboard.app/unirse/abc123')
  })

  it('pasa los links sin # a la ruta con #', () => {
    expect(hashRedirect({ pathname: '/c/LasArtes', search: '', hash: '' })).toBe('/#/c/lasartes')
    expect(hashRedirect({ pathname: '/game-board/c/lasartes/', search: '?juego=pool', hash: '' })).toBe('/game-board/#/c/lasartes?juego=pool')
    expect(hashRedirect({ pathname: '/', search: '?c=lasartes&juego=pool', hash: '' })).toBe('/#/c/lasartes?juego=pool')
    expect(hashRedirect({ pathname: '/unirse/AbC123', search: '', hash: '' })).toBe('/#/unirse/AbC123')
    expect(hashRedirect({ pathname: '/', search: '', hash: '' })).toBeNull()
    expect(hashRedirect({ pathname: '/c/lasartes', search: '', hash: '#/ranking' })).toBeNull()
  })

  it('reconoce las rutas de invitación', () => {
    expect(inviteTarget('/unirse/abc123')).toEqual({ code: 'abc123' })
    expect(inviteTarget('/c/LasArtes')).toEqual({ slug: 'lasartes' })
    expect(inviteTarget('/club')).toBeNull()
  })
})
