import { afterEach, describe, expect, it } from 'vitest'
import { canChange, canCreate, onDenied, setAccess, type Access, type Denial } from './access'
import { actions, getData, replaceAllFromRemote, EMPTY } from './store'

const me = 'user-me'
const other = 'user-other'
const member: Access = { mode: 'member', uid: me, admin: false, playerId: 'p-me' }
const admin: Access = { mode: 'member', uid: me, admin: true, playerId: 'p-me' }

const playOf = (createdBy: string | undefined, players: string[][]) => ({ id: 'x', createdBy, sides: players.map((p) => ({ players: p })) })

describe('canChange', () => {
  it('sin servidor (o sin club) se puede todo', () => {
    expect(canChange({ mode: 'all' }, 'game', { id: 'g', createdBy: other }, undefined)).toBe(true)
  })

  it('sin cuenta no se puede nada, ni crear', () => {
    expect(canCreate({ mode: 'guest' })).toBe(false)
    expect(canChange({ mode: 'guest' }, 'play', undefined, { id: 'x' })).toBe(false)
  })

  it('cualquier integrante crea cosas nuevas', () => {
    expect(canChange(member, 'game', undefined, { id: 'g' })).toBe(true)
  })

  it('un juego ajeno sólo lo cambian quien lo creó o un admin', () => {
    const game = { id: 'g', createdBy: other }
    expect(canChange(member, 'game', game, game)).toBe(false)
    expect(canChange(member, 'game', game, undefined)).toBe(false)
    expect(canChange(admin, 'game', game, undefined)).toBe(true)
    expect(canChange(member, 'game', { id: 'g', createdBy: me }, undefined)).toBe(true)
  })

  it('lo viejo, sin autor, es de los admins', () => {
    expect(canChange(member, 'game', { id: 'g' }, { id: 'g' })).toBe(false)
    expect(canChange(admin, 'game', { id: 'g' }, { id: 'g' })).toBe(true)
  })

  it('los que juegan anotan la partida, pero no la borran', () => {
    const mine = playOf(other, [['p-me'], ['p-2']])
    expect(canChange(member, 'play', mine, mine)).toBe(true)
    expect(canChange(member, 'play', mine, undefined)).toBe(false)
    const notMine = playOf(other, [['p-1'], ['p-2']])
    expect(canChange(member, 'play', notMine, notMine)).toBe(false)
  })

  it('en ping pong cuenta el compañero de dobles', () => {
    const match = { id: 'm', createdBy: other, playerA: 'p-1', playerB: 'p-2', partnerB: 'p-me' }
    expect(canChange(member, 'match', match, match)).toBe(true)
  })

  it('cada uno cambia su jugador, pero no lo borra', () => {
    const player = { id: 'p-me', createdBy: other }
    expect(canChange(member, 'player', player, player)).toBe(true)
    expect(canChange(member, 'player', player, undefined)).toBe(false)
    expect(canChange(member, 'player', { id: 'p-2', createdBy: other }, { id: 'p-2' })).toBe(false)
  })
})

describe('store con permisos', () => {
  afterEach(() => {
    setAccess({ mode: 'all' })
    replaceAllFromRemote(EMPTY)
  })

  it('lo nuevo queda a nombre de quien lo crea', () => {
    setAccess(member)
    const p = actions.createPlay('truco', [{ players: ['p-me'] }, { players: ['p-2'] }], {})
    expect(getData().plays.find((x) => x.id === p.id)).toMatchObject({ createdBy: me })
  })

  it('no guarda lo que no está permitido y avisa por qué', () => {
    const seen: Denial[] = []
    const stop = onDenied((d) => seen.push(d))
    replaceAllFromRemote({ ...EMPTY, plays: [{ ...playOf(other, [['p-1'], ['p-2']]), gameId: 'truco', createdAt: 0, status: 'live', config: {}, log: [] }] })

    setAccess(member)
    expect(actions.deletePlay('x')).toBe(false)
    expect(getData().plays).toHaveLength(1)

    setAccess({ mode: 'guest' })
    actions.createPlay('truco', [{ players: ['p-1'] }, { players: ['p-2'] }], {})
    expect(getData().plays).toHaveLength(1)

    setAccess(admin)
    expect(actions.deletePlay('x')).toBe(true)
    expect(getData().plays).toHaveLength(0)

    expect(seen).toEqual(['permission', 'login'])
    stop()
  })
})
