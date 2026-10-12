// Fichas de juegos hechas por IA: armar el pedido, leer la respuesta y validarla.

import { fullPrompt, type PromptInput } from './aiPrompt'
import exampleSource from './games/catalog/catan.ts?raw'
import schemaSource from './games/schema.ts?raw'
import { CATEGORIES, CUP_FORMATS, GLYPHS, type AwardDef, type GameDef, type Metric } from './games/schema'
import { supabase } from './sync'

/** Pedido completo para pegar en cualquier chat (Claude, ChatGPT, Gemini...). */
export function promptForChat(input: PromptInput): string {
  return fullPrompt(schemaSource, exampleSource, input)
}

/** Saca el JSON de una respuesta de chat (con o sin bloque ```json, con texto alrededor). */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('No encontramos los datos del juego en la respuesta. Copiá la respuesta entera del chat y pegala de nuevo.')
  try {
    return JSON.parse(body.slice(start, end + 1))
  } catch {
    throw new Error('La respuesta está incompleta o mal armada. Pedile al chat que la mande entera de nuevo.')
  }
}

export function slugify(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24) || 'juego'
  )
}

const MODES = ['rally', 'counter', 'rounds', 'turns', 'result', 'coop'] as const
const SIDES = ['individual', 'teams', 'either', 'coop'] as const

export interface Checked {
  game: GameDef
  /** Problemas que se corrigieron solos. */
  warnings: string[]
}

const str = (x: unknown, fallback = ''): string => (typeof x === 'string' ? x : fallback)
const num = (x: unknown, fallback: number): number => (typeof x === 'number' && isFinite(x) ? x : fallback)
const arr = <T = unknown>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : [])

/**
 * Valida y completa una ficha (de la IA o del editor). Lo que no tiene arreglo
 * tira un error; lo que se puede corregir se corrige y se avisa.
 */
export function checkGame(raw: unknown, opts: { source?: GameDef['source']; keepId?: boolean } = {}): Checked {
  if (!raw || typeof raw !== 'object') throw new Error('No pudimos leer los datos del juego. Revisá que hayas pegado la respuesta entera.')
  const r = raw as Record<string, unknown>
  const warnings: string[] = []
  const name = str(r.name).trim()
  if (!name) throw new Error('Falta el nombre del juego.')

  let mode = str(r.mode) as GameDef['mode']
  if (!MODES.includes(mode) || mode === 'rally') {
    warnings.push(`No reconocimos cómo se anota${mode ? ` (“${mode}”)` : ''}: lo dejamos como resultado final.`)
    mode = 'result'
  }
  let sides = str(r.sides) as GameDef['sides']
  if (!SIDES.includes(sides)) sides = mode === 'coop' ? 'coop' : 'individual'
  if (mode === 'coop') sides = 'coop'

  const playersRaw = (r.players ?? {}) as Record<string, unknown>
  let min = Math.max(1, Math.round(num(playersRaw.min, 2)))
  let max = Math.max(min, Math.round(num(playersRaw.max, Math.max(min, 6))))
  if (max > 30) max = 30
  if (min > max) [min, max] = [max, min]

  const events = arr<Record<string, unknown>>(r.events)
    .map((e) => ({
      id: str(e.id) || slugify(str(e.name)),
      name: str(e.name, 'Evento'),
      emoji: str(e.emoji, '⭐'),
      type: e.type === 'holder' ? ('holder' as const) : ('count' as const),
      ...(typeof e.points === 'number' ? { points: e.points } : {}),
      ...(e.askPoints ? { askPoints: true } : {}),
      ...(e.hidden ? { hidden: true } : {}),
      ...(typeof e.replaces === 'string' ? { replaces: e.replaces } : {}),
      ...(e.global ? { global: true } : {}),
      ...(e.winsGame ? { winsGame: true } : {}),
      ...(typeof e.help === 'string' ? { help: e.help } : {}),
    }))
    .filter((e, i, all) => all.findIndex((x) => x.id === e.id) === i)
  const eventIds = new Set(events.map((e) => e.id))

  const stats = arr<Record<string, unknown>>(r.stats)
    .map((s) => ({
      id: str(s.id) || slugify(str(s.label)),
      label: str(s.label, 'Dato'),
      type: s.type === 'choice' ? ('choice' as const) : ('number' as const),
      ...(Array.isArray(s.choices) ? { choices: (s.choices as unknown[]).map(String) } : {}),
      ...(typeof s.help === 'string' ? { help: s.help } : {}),
    }))
    .filter((s, i, all) => all.findIndex((x) => x.id === s.id) === i)
  const statIds = new Set(stats.map((s) => s.id))
  const roles = arr(r.roles).map(String).filter(Boolean)

  const metricOk = (m: Metric): boolean => {
    switch (m.type) {
      case 'eventTotal':
      case 'eventMax':
      case 'playsWithEvent':
      case 'winsWithEvent':
        return eventIds.has(m.event)
      case 'statTotal':
      case 'statMax':
        return statIds.has(m.stat)
      case 'winsWithChoice':
        return statIds.has(m.stat) && typeof m.value === 'string'
      case 'winsAsRole':
        return roles.includes(m.role)
      case 'wins':
      case 'played':
      case 'bestStreak':
      case 'shutoutWins':
      case 'scoreMax':
      case 'marginMax':
      case 'coopWins':
        return true
      default:
        return false
    }
  }

  const awards: AwardDef[] = []
  for (const a of arr<Record<string, unknown>>(r.awards)) {
    const metric = a.metric as Metric
    if (!metric || typeof metric !== 'object' || !metricOk(metric)) {
      warnings.push(`Sacamos la medalla “${str(a.name)}”: mide algo que el juego no registra.`)
      continue
    }
    const levels = arr<Record<string, unknown>>(a.levels)
      .map((l) => ({
        at: Math.max(1, num(l.at, 1)),
        name: str(l.name).trim(),
        description: str(l.description),
        glyph: (GLYPHS as readonly string[]).includes(str(l.glyph)) ? (l.glyph as AwardDef['levels'][number]['glyph']) : 'star',
        color: /^#[0-9a-f]{3,8}$/i.test(str(l.color)) ? str(l.color) : '#FFD43B',
      }))
      .filter((l) => l.name)
      .sort((x, y) => x.at - y.at)
      .slice(0, 6)
    if (!levels.length) continue
    awards.push({
      id: str(a.id) || slugify(str(a.name)),
      name: str(a.name, 'Premio'),
      measures: str(a.measures),
      metric,
      unit: str(a.unit, '{n}').includes('{n}') ? str(a.unit) : `{n} ${str(a.unit)}`.trim(),
      ...(typeof a.unitOne === 'string' ? { unitOne: a.unitOne } : {}),
      levels,
    })
  }

  const options = arr<Record<string, unknown>>(r.options)
    .filter((o) => str(o.id) && ['number', 'boolean', 'select'].includes(str(o.type)))
    .map((o) => o as unknown as GameDef['options'][number])
  const scoring = (r.scoring && typeof r.scoring === 'object' ? r.scoring : {}) as GameDef['scoring']
  for (const key of ['targetOption', 'roundsOption', 'eliminateOption'] as const) {
    if (scoring[key] && !options.some((o) => o.id === scoring[key])) {
      warnings.push(`La opción “${scoring[key]}” no existe en el juego: la dejamos de lado.`)
      delete scoring[key]
    }
  }
  if (scoring.scorer && !['sum', 'skullKing', 'bidTricks'].includes(scoring.scorer)) delete scoring.scorer
  if (mode === 'counter' && !scoring.target && !scoring.targetOption) warnings.push('El marcador en vivo no tiene puntaje objetivo: la partida se termina a mano.')

  const category = CATEGORIES.some((c) => c.id === r.category) ? (r.category as GameDef['category']) : 'mesa'
  const formatIds = CUP_FORMATS.map((f) => f.id) as string[]
  let formats = arr(r.formats).map(String).filter((f) => formatIds.includes(f)) as GameDef['formats']
  if (min > 2 || mode === 'coop') formats = formats.filter((f) => f !== 'knockout' && f !== 'league')

  const weight = [1, 2, 3].includes(r.weight as number) ? (r.weight as 1 | 2 | 3) : 2
  const id = opts.keepId && str(r.id) ? str(r.id) : `${slugify(str(r.id) || name)}-${Math.random().toString(36).slice(2, 6)}`

  const game: GameDef = {
    id,
    name: name.slice(0, 60),
    emoji: str(r.emoji, '🎲').slice(0, 8),
    color: /^#[0-9a-f]{3,8}$/i.test(str(r.color)) ? str(r.color) : '#7048E8',
    category,
    tagline: str(r.tagline),
    players: { min, max },
    sides,
    ...(typeof r.teamSize === 'number' ? { teamSize: Math.max(2, Math.round(r.teamSize)) } : {}),
    mode,
    weight,
    scoring,
    options,
    events,
    stats,
    ...(roles.length ? { roles } : {}),
    awards,
    formats,
    rules: arr(r.rules).map(String).slice(0, 12),
    ...(typeof r.rulesUrl === 'string' && /^https?:\/\//.test(r.rulesUrl) ? { rulesUrl: r.rulesUrl } : {}),
    ...(typeof r.cover === 'string' && /^https:\/\//.test(r.cover) ? { cover: r.cover } : {}),
    source: opts.source ?? 'ai',
  }
  return { game, warnings }
}

/** Lee la respuesta de un chat y la deja lista para guardar. */
export function parseGameResponse(text: string): Checked {
  return checkGame(extractJson(text), { source: 'ai' })
}

/** Generación automática con la API de Claude (función de Supabase con tope de gasto mensual). */
export async function generateWithApi(input: PromptInput): Promise<Checked & { costUsd?: number }> {
  const sb = supabase()
  if (!sb) throw new Error('La generación automática no está configurada.')
  const { data, error } = await sb.functions.invoke('generate-game', { body: input })
  if (error) {
    let message = error.message
    try {
      const body = await (error as { context?: Response }).context?.json()
      if (body?.error) message = body.error
    } catch {
      // ignorar
    }
    throw new Error(message)
  }
  const res = data as { text: string; costUsd?: number }
  return { ...parseGameResponse(res.text), costUsd: res.costUsd }
}
