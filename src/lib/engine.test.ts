import { describe, expect, it } from 'vitest'
import { checkGame, extractJson } from './ai'
import { bracketRounds, cupChampion, cupStandings, knockoutSeedsIdx, nextTables, roundRobinIdx, splitTables } from './cups'
import { autoResult, computeLive, placesFromScores, roundScore, winnerSides } from './engine'
import { BUILTIN_GAMES, findGame } from './games'
import type { GameDef } from './games/schema'
import { closestFirst, gameMedals, missingLabel, GLOBAL_FAMILIES, globalMedals, progressOf } from './medals'
import { beltOf, computeBoard, gameStatsOf, globalStatsOf, gloriaPoints } from './stats'
import type { AppData, Cup, LogEntry, Play } from './types'

const game = (id: string): GameDef => {
  const g = BUILTIN_GAMES.find((x) => x.id === id)
  if (!g) throw new Error(`falta ${id}`)
  return g
}

let n = 0
function play(gameId: string, sides: string[][], extra: Partial<Play> = {}): Play {
  n++
  return { id: `x${n}`, gameId, createdAt: n, status: 'live', config: {}, sides: sides.map((players) => ({ players })), log: [], ...extra }
}

function finished(gameId: string, sides: string[][], places: number[], extra: Partial<Play> = {}): Play {
  return play(gameId, sides, { status: 'finished', finishedAt: 1000 + n, result: { places }, ...extra })
}

const t = 0
const data = (plays: Play[], cups: Cup[] = []): AppData => ({ version: 1, players: [], matches: [], tournaments: [], plays, cups, games: [], teams: [] })

describe('motor', () => {
  it('truco: suma puntos y eventos y termina al llegar a 30', () => {
    const truco = game('truco')
    const p = play('truco', [['a'], ['b']], { config: { target: 30 } })
    p.log.push({ k: 'pt', s: 0, n: 1, t }, { k: 'ev', s: 0, e: 'envido', n: 1, t })
    const live = computeLive(truco, p)
    expect(live.scores[0]).toBe(1 + (truco.events.find((e) => e.id === 'envido')?.points ?? 0))
    expect(autoResult(truco, p)).toBeUndefined()
    for (let i = 0; i < 30; i++) p.log.push({ k: 'pt', s: 1, n: 1, t })
    expect(autoResult(truco, p)?.places).toEqual([2, 1])
  })

  it('catán: la ciudad reemplaza al poblado y el camino más largo pasa de mano', () => {
    const catan = game('catan')
    const p = play('catan', [['a'], ['b']])
    const log: LogEntry[] = [
      { k: 'ev', s: 0, e: 'settlement', n: 1, t },
      { k: 'ev', s: 0, e: 'settlement', n: 1, t },
      { k: 'ev', s: 0, e: 'city', n: 1, t },
      { k: 'ev', s: 0, e: 'longestRoad', n: 1, t },
      { k: 'ev', s: 1, e: 'longestRoad', n: 1, t },
      { k: 'ev', s: 1, e: 'knight', n: 1, t },
    ]
    p.log = log
    const live = computeLive(catan, p)
    expect(live.counts.settlement).toEqual([1, 0])
    expect(live.counts.city).toEqual([1, 0])
    expect(live.scores).toEqual([3, 2])
    expect(live.holders.longestRoad).toBe(1)
    expect(live.holderGains.longestRoad).toEqual([1, 1])
    // Los caballeros son ocultos: no suman a la vista.
    expect(live.counts.knight).toEqual([0, 1])
  })

  it('por manos: suma manos, respeta el objetivo y la eliminación', () => {
    const buraco = game('buraco')
    const p = play('buraco', [['a'], ['b']], { config: { target: 1500 } })
    p.log.push({ k: 'round', sc: [900, 100], t }, { k: 'round', sc: [700, 50], t })
    expect(autoResult(buraco, p)?.places).toEqual([1, 2])

    const chinchon = game('chinchon')
    const q = play('chinchon', [['a'], ['b'], ['c']])
    q.log.push({ k: 'round', sc: [50, 110, 20], t })
    expect(autoResult(chinchon, q)).toBeUndefined()
    q.log.push({ k: 'round', sc: [60, 0, 10], t })
    const r = autoResult(chinchon, q)!
    expect(r.places[2]).toBe(1)
  })

  it('chinchón: cortar con chinchón gana en el acto', () => {
    const chinchon = game('chinchon')
    const q = play('chinchon', [['a'], ['b']])
    q.log.push({ k: 'round', sc: [0, 30], ev: { chinchon: [1, 0] }, t })
    expect(autoResult(chinchon, q)?.places[0]).toBe(1)
  })

  it('apuestas y bazas', () => {
    const sk = game('skullking')
    expect(roundScore(sk, 2, { bid: 2, tricks: 2 }, {})).toBe(40)
    expect(roundScore(sk, 2, { bid: 2, tricks: 3 }, {})).toBe(-10)
    expect(roundScore(sk, 4, { bid: 0, tricks: 0 }, {})).toBe(50)
    expect(roundScore(sk, 4, { bid: 0, tricks: 1 }, {})).toBe(-50)
    const podrida = game('podrida')
    expect(roundScore(podrida, 0, { bid: 2, tricks: 2 }, {})).toBe(20)
    expect(roundScore(podrida, 0, { bid: 2, tricks: 0 }, {})).toBe(-10)
  })

  it('puestos con empates', () => {
    expect(placesFromScores([10, 7, 10, 2])).toEqual([1, 3, 1, 4])
    expect(placesFromScores([10, 7, 2], true)).toEqual([3, 2, 1])
  })

  describe('ganar en el acto: el resto se ordena desde el segundo puesto', () => {
    const generala = () => game('generala')
    const servida = (sides: number, w: number, sc: number[]) => {
      const p = play('generala', Array.from({ length: sides }, (_, i) => [`j${i}`]))
      const ev = new Array<number>(sides).fill(0)
      ev[w] = 1
      // El ganador anota poco a propósito: gana igual aunque tenga menos puntos.
      p.log.push({ k: 'round', sc, ev: { generalaServida: ev }, t })
      return autoResult(generala(), p)?.places
    }

    it('2 jugadores → [1, 2], gane quien gane', () => {
      expect(servida(2, 0, [0, 30])).toEqual([1, 2])
      expect(servida(2, 1, [30, 0])).toEqual([2, 1])
    })

    it('3 jugadores con los otros empatados → comparten el segundo', () => {
      expect(servida(3, 0, [0, 10, 10])).toEqual([1, 2, 2])
      expect(servida(3, 1, [10, 0, 10])).toEqual([2, 1, 2])
    })

    it('3 jugadores distintos → [1, 2, 3] con el ganador en cualquier lugar', () => {
      expect(servida(3, 0, [0, 20, 10])).toEqual([1, 2, 3])
      expect(servida(3, 1, [10, 0, 20])).toEqual([3, 1, 2])
      expect(servida(3, 2, [20, 10, 0])).toEqual([2, 3, 1])
    })

    it('si gana el que menos tiene (chinchón), el resto también arranca en 2', () => {
      const chinchon = game('chinchon')
      const q = play('chinchon', [['a'], ['b'], ['c']])
      q.log.push({ k: 'round', sc: [40, 0, 15], ev: { chinchon: [0, 1, 0] }, t })
      expect(autoResult(chinchon, q)?.places).toEqual([3, 1, 2])
      const r = play('chinchon', [['a'], ['b'], ['c']])
      r.log.push({ k: 'round', sc: [20, 20, 0], ev: { chinchon: [0, 0, 1] }, t })
      expect(autoResult(chinchon, r)?.places).toEqual([2, 2, 1])
    })
  })

  it('ganadores: empate y cooperativo', () => {
    expect(winnerSides(finished('x', [['a'], ['b']], [1, 1]))).toEqual([])
    expect(winnerSides(finished('x', [['a', 'b']], [1], { result: { places: [1], coopWin: true } }))).toEqual([0])
    expect(winnerSides(finished('x', [['a', 'b']], [2], { result: { places: [2], coopWin: false } }))).toEqual([])
  })
})

describe('torneos', () => {
  it('liga: todos contra todos', () => {
    const pairs = roundRobinIdx(5)
      .flat()
      .map(([a, b]) => [a, b].sort().join('-'))
    expect(new Set(pairs).size).toBe(10)
  })

  it('mesas parejas y que no se repitan', () => {
    expect(splitTables([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4).map((x) => x.length)).toEqual([4, 3, 3])
    let seed = 1
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    const first = splitTables([0, 1, 2, 3, 4, 5, 6, 7], 4)
    const second = nextTables(8, 4, [first], random)
    const repeated = second.some((table) => first.some((f) => table.filter((x) => f.includes(x)).length > 2))
    expect(repeated).toBe(false)
  })

  it('eliminación: el ganador de la final es campeón', () => {
    const cup: Cup = { id: 'c', name: 'Copa', gameId: 'truco', createdAt: 0, format: 'knockout', entrants: [{ players: ['a'] }, { players: ['b'] }, { players: ['c'] }], config: {} }
    cup.seeds = knockoutSeedsIdx([0, 1, 2])
    expect(cup.seeds).toEqual([0, 2, 1, null])
    const semi = finished('truco', [['a'], ['c']], [2, 1], { cupId: 'c', round: 0, slot: 0 })
    let rounds = bracketRounds(cup, [semi])
    expect(rounds[0][0].winner).toBe(2)
    expect(rounds[0][1].winner).toBe(1)
    const final = finished('truco', [['c'], ['b']], [1, 2], { cupId: 'c', round: 1, slot: 0 })
    rounds = bracketRounds(cup, [semi, final])
    expect(cupChampion(cup, [semi, final])).toBe(2)
  })

  it('partida acumulada: gana el que más suma', () => {
    const cup: Cup = { id: 'c', name: 'Acumulada', gameId: 'buraco', createdAt: 0, format: 'series', entrants: [{ players: ['a'] }, { players: ['b'] }], config: {}, rounds: 2 }
    const p1 = finished('buraco', [['a'], ['b']], [1, 2], { cupId: 'c', round: 0, result: { places: [1, 2], scores: [3000, 2900] } })
    const p2 = finished('buraco', [['a'], ['b']], [2, 1], { cupId: 'c', round: 1, result: { places: [2, 1], scores: [500, 3010] } })
    expect(cupStandings(cup, [p1, p2])[0].entrant).toBe(1)
    expect(cupChampion(cup, [p1, p2])).toBe(1)
  })
})

describe('estadísticas y medallas', () => {
  it('gloria: más por ganar en mesas grandes y juegos pesados', () => {
    expect(gloriaPoints(1, 2, [1, 2], 0)).toBe(6)
    expect(gloriaPoints(1, 2, [1, 2], 1)).toBe(1)
    expect(gloriaPoints(3, 4, [1, 2, 3, 4], 0)).toBeGreaterThan(gloriaPoints(3, 2, [1, 2], 0))
  })

  it('ELO, rachas, eventos y premios propios', () => {
    const catan = game('catan')
    const plays: Play[] = []
    for (let i = 0; i < 3; i++) {
      const p = finished('catan', [['a'], ['b'], ['c']], [1, 2, 3], {
        result: { places: [1, 2, 3], scores: [10, 7, 5], stats: { favResource: ['Trigo', 'Madera', null] } },
      })
      p.log = [{ k: 'ev', s: 0, e: 'longestRoad', n: 1, t }]
      plays.push(p)
    }
    const board = computeBoard(data(plays))
    const a = gameStatsOf(board, 'a', 'catan')
    expect(a.wins).toBe(3)
    expect(a.bestStreak).toBe(3)
    expect(a.elo).toBeGreaterThan(1000)
    expect(a.events.longestRoad.wins).toBe(3)
    expect(a.choiceWins['favResource:Trigo']).toBe(3)
    const medals = gameMedals(catan, a)
    expect(medals.find((m) => m.family.id === 'wheat')?.level).toBe(1)
    expect(medals.find((m) => m.family.id === 'longestRoad')?.level).toBe(1)
    const g = globalStatsOf(board, 'a')
    expect(globalMedals(g).find((m) => m.family.id === 'wins')?.level).toBe(0)
    expect(gameStatsOf(board, 'c', 'catan').elo).toBeLessThan(1000)
  })

  it('lo que falta para una medalla, con la unidad cuando se puede', () => {
    const fam = (unit: (n: number) => string) => ({ unit })
    expect(missingLabel(GLOBAL_FAMILIES[0], 3)).toBe('Faltan 3 victorias')
    expect(missingLabel(GLOBAL_FAMILIES[0], 1)).toBe('Falta 1 victoria')
    expect(missingLabel(fam((n) => `+${n} de Elo`), 55)).toBe('Faltan 55 de Elo')
    expect(missingLabel(fam((n) => `ganó por ${n}`), 3)).toBe('Faltan 3')
    expect(missingLabel(fam((n) => `de ${n} abajo`), 2)).toBe('Faltan 2')
  })

  it('medallas más cercanas: primero la de más avance, sin las ganadas ni las sin empezar', () => {
    const fam = GLOBAL_FAMILIES[0]
    const list = [3, 0, 8, 100, 9].map((v, i) => ({ i, progress: progressOf(fam, v) }))
    // 9 de 10 y 8 de 10 primero; 3 de 10 después; 0 (sin empezar) y 100 (nivel máximo) quedan afuera.
    expect(closestFirst(list).map((x) => x.i)).toEqual([4, 2, 0])
  })

  it('roles: victorias como impostor', () => {
    const p = finished('impostor', [['a'], ['b', 'c']], [1, 2])
    p.sides[0].role = 'Impostor'
    p.sides[1].role = 'Tripulante'
    const board = computeBoard(data([p]))
    expect(gameStatsOf(board, 'a', 'impostor').roleWins.Impostor).toBe(1)
  })

  it('cinturón: se lo saca quien le gana al que lo tiene', () => {
    const plays = [
      finished('truco', [['a'], ['b']], [1, 2]),
      finished('truco', [['a'], ['c']], [1, 2]),
      finished('truco', [['b'], ['c']], [1, 2]),
      finished('truco', [['c'], ['a']], [1, 2]),
    ]
    const belt = beltOf(computeBoard(data(plays)).views, 'truco')
    expect(belt?.holders).toEqual(['c'])
    expect(belt?.defenses).toBe(0)
  })
})

describe('fichas hechas con IA', () => {
  it('saca el JSON de una respuesta de chat y lo valida', () => {
    const text = 'Acá va:\n```json\n{"name":"Bang!","mode":"result","players":{"min":4,"max":7},"events":[{"id":"sheriff","name":"Mató al sheriff","emoji":"🤠","type":"count"}],"awards":[{"id":"x","name":"Pistolero","measures":"","metric":{"type":"eventTotal","event":"sheriff"},"unit":"{n} sheriffs","levels":[{"at":1,"name":"Cuatrero","description":"","glyph":"skull","color":"#aa3300"}]},{"id":"y","name":"Malo","metric":{"type":"eventTotal","event":"nope"},"levels":[{"at":1,"name":"N"}]}],"formats":["knockout","tables"]}\n```'
    const { game: g, warnings } = checkGame(extractJson(text))
    expect(g.name).toBe('Bang!')
    expect(g.awards).toHaveLength(1)
    expect(g.formats).toEqual(['tables'])
    expect(warnings.some((w) => w.includes('Malo'))).toBe(true)
    expect(g.id).toMatch(/^bang-/)
  })

  it('rechaza lo que no es una ficha', () => {
    expect(() => checkGame(extractJson('{"foo": 1}'))).toThrow()
    expect(() => extractJson('nada por acá')).toThrow()
  })
})

describe('catálogo', () => {
  it('hay muchos juegos y los pedidos están', () => {
    for (const id of ['pingpong', 'catan', 'truco', 'buraco', 'tateti', 'skullking', 'impostor', 'pistascruzadas']) expect(findGame({ games: [] }, id), id).toBeDefined()
    expect(BUILTIN_GAMES.length).toBeGreaterThanOrEqual(40)
  })

  it('cada ficha es coherente', () => {
    for (const g of BUILTIN_GAMES) {
      const events = new Set(g.events.map((e) => e.id))
      const stats = new Set(g.stats.map((s) => s.id))
      const options = new Set(g.options.map((o) => o.id))
      expect(g.players.min, g.id).toBeLessThanOrEqual(g.players.max)
      for (const key of ['targetOption', 'roundsOption', 'eliminateOption'] as const) if (g.scoring[key]) expect(options.has(g.scoring[key]!), `${g.id}.${key}`).toBe(true)
      for (const e of g.events) if (e.replaces) expect(events.has(e.replaces), `${g.id}: ${e.id}`).toBe(true)
      for (const a of g.awards) {
        const m = a.metric as Record<string, string>
        if ('event' in m) expect(events.has(m.event), `${g.id}: ${a.id}`).toBe(true)
        if ('stat' in m) expect(stats.has(m.stat), `${g.id}: ${a.id}`).toBe(true)
        if ('role' in m) expect(g.roles?.includes(m.role), `${g.id}: ${a.id}`).toBe(true)
        expect(a.levels.map((l) => l.at), `${g.id}: ${a.id}`).toEqual([...a.levels.map((l) => l.at)].sort((x, y) => x - y))
      }
      if (g.formats.includes('knockout') || g.formats.includes('league')) expect(g.players.min, g.id).toBeLessThanOrEqual(2 * (g.teamSize ?? 1))
    }
  })

  it('los nombres de medallas no se repiten entre juegos', () => {
    const seen = new Map<string, string>()
    for (const g of BUILTIN_GAMES)
      for (const a of g.awards)
        for (const l of a.levels) {
          expect(seen.get(l.name), `${l.name} (${g.id} y ${seen.get(l.name)})`).toBeUndefined()
          seen.set(l.name, g.id)
        }
  })

  it('los dibujos genéricos andan con cualquier nombre y color', async () => {
    const { medalSvg } = await import('./medalArt')
    const { GLYPHS } = await import('./games/schema')
    for (const glyph of GLYPHS)
      for (const name of ['Gatillo nervioso', 'Nombre raro', '', 'ñandú 🦤'])
        for (const color of ['#E03131', '#abc', 'rojo'])
          expect(medalSvg(name, 2, { glyph, color })).toContain('<svg')
  })

  // Los dibujos genéricos (`glyph`) son sólo para los juegos que agrega el grupo o la IA: los del catálogo llevan su ilustración.
  it('cada medalla del catálogo tiene su ilustración propia', async () => {
    const { ART_REGISTRY, loadArt } = await import('./art')
    await loadArt()
    const { GLOBAL_FAMILIES } = await import('./medals')
    const missing: string[] = []
    for (const g of BUILTIN_GAMES) for (const a of g.awards) for (const l of a.levels) if (l.glyph || !ART_REGISTRY[l.name]) missing.push(`${g.id}: ${l.name}`)
    for (const f of GLOBAL_FAMILIES) for (const l of f.levels) if (!ART_REGISTRY[l.name]) missing.push(`general: ${l.name}`)
    expect(missing).toEqual([])
  })

  // El registro es uno solo, por nombre: dos ilustraciones con el mismo nombre se pisan y una nunca se ve.
  it('ninguna ilustración repite el nombre de otra', () => {
    const files = import.meta.glob<Record<string, unknown>>('./art/nuevas/*.ts', { eager: true })
    const seen = new Map<string, string>()
    const dup: string[] = []
    for (const [file, m] of Object.entries(files))
      for (const [k, v] of Object.entries(m))
        if (k.endsWith('_ART'))
          for (const name of Object.keys(v as object)) {
            if (seen.has(name)) dup.push(`${name}: ${seen.get(name)} y ${file}`)
            seen.set(name, file)
          }
    expect(dup).toEqual([])
  })
})
