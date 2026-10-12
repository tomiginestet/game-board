import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { checkGame } from '../lib/ai'
import {
  CATEGORIES,
  CUP_FORMATS,
  GLYPHS,
  type AwardDef,
  type EventDef,
  type GameDef,
  type Glyph,
  type Metric,
  type PlayMode,
  type StatDef,
} from '../lib/games/schema'
import { Stepper } from './ConfigEditor'
import { Medal } from './Medal'

const MODES: { id: Exclude<PlayMode, 'rally'>; name: string; help: string }[] = [
  { id: 'result', name: 'Resultado final', help: 'Al terminar se elige quién ganó o el orden de llegada.' },
  { id: 'counter', name: 'Marcador en vivo', help: 'Se suman puntos tocando la pantalla (truco, ta-te-ti).' },
  { id: 'rounds', name: 'Por manos', help: 'Al final de cada mano se carga el puntaje de cada uno.' },
  { id: 'turns', name: 'Por turnos', help: 'Se pasan los turnos y se registran eventos; el puntaje se confirma al final.' },
  { id: 'coop', name: 'Cooperativo', help: 'Todos contra el juego: se gana o se pierde juntos.' },
]

const METRICS: { type: Metric['type']; name: string; needs?: 'event' | 'stat' | 'choice' | 'role' }[] = [
  { type: 'wins', name: 'Partidas ganadas' },
  { type: 'played', name: 'Partidas jugadas' },
  { type: 'bestStreak', name: 'Mejor racha' },
  { type: 'scoreMax', name: 'Mayor puntaje en una partida' },
  { type: 'marginMax', name: 'Mayor diferencia al ganar' },
  { type: 'shutoutWins', name: 'Ganadas sin que el rival sume' },
  { type: 'coopWins', name: 'Ganadas en cooperativo' },
  { type: 'eventTotal', name: 'Veces que hizo un evento (total)', needs: 'event' },
  { type: 'eventMax', name: 'Máximo de un evento en una partida', needs: 'event' },
  { type: 'playsWithEvent', name: 'Partidas en las que hizo un evento', needs: 'event' },
  { type: 'winsWithEvent', name: 'Ganadas haciendo un evento', needs: 'event' },
  { type: 'statTotal', name: 'Suma de un dato final', needs: 'stat' },
  { type: 'statMax', name: 'Máximo de un dato final', needs: 'stat' },
  { type: 'winsWithChoice', name: 'Ganadas con un valor de un dato', needs: 'choice' },
  { type: 'winsAsRole', name: 'Ganadas con un rol', needs: 'role' },
]

const TIER_NAMES = ['Bronce', 'Plata', 'Oro']
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'x'

export function blankGame(name = ''): GameDef {
  return {
    id: '',
    name,
    emoji: '🎲',
    color: '#7048E8',
    category: 'mesa',
    tagline: '',
    players: { min: 2, max: 6 },
    sides: 'individual',
    mode: 'result',
    weight: 2,
    scoring: { finalScores: false },
    options: [],
    events: [],
    stats: [],
    awards: [],
    formats: ['tables', 'league', 'knockout'],
    rules: [],
    source: 'custom',
  }
}

/**
 * Editor de fichas: lo básico con formularios y, para lo raro, la ficha completa en JSON.
 * Sirve para armar un juego a mano o retocar lo que propuso la IA.
 */
export function GameEditor({ initial, onSave, onCancel, saveLabel = 'Guardar juego' }: { initial: GameDef; onSave: (g: GameDef) => void; onCancel?: () => void; saveLabel?: string }) {
  const [g, setG] = useState<GameDef>(initial)
  const [json, setJson] = useState<string | null>(null)
  const [error, setError] = useState('')
  const set = (patch: Partial<GameDef>) => setG({ ...g, ...patch })
  const setScoring = (patch: Partial<GameDef['scoring']>) => setG({ ...g, scoring: { ...g.scoring, ...patch } })

  const save = () => {
    try {
      const source = json !== null ? JSON.parse(json) : g
      const { game, warnings } = checkGame(source, { source: initial.source === 'builtin' ? 'custom' : (initial.source ?? 'custom'), keepId: !!initial.id })
      if (warnings.length && !confirm(`Ojo:\n· ${warnings.join('\n· ')}\n\n¿Guardar igual?`)) return
      onSave(game)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (json !== null) {
    return (
      <div className="game-editor">
        <p className="hint">Ficha completa en JSON. Cuidado: tiene que respetar el formato.</p>
        <textarea className="input code-area" rows={24} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button
            className="btn"
            onClick={() => {
              try {
                setG(JSON.parse(json))
                setJson(null)
                setError('')
              } catch (e) {
                setError((e as Error).message)
              }
            }}
          >
            Volver al formulario
          </button>
          <button className="btn primary grow" onClick={save}>
            {saveLabel}
          </button>
        </div>
      </div>
    )
  }

  const updateEvent = (i: number, patch: Partial<EventDef>) => set({ events: g.events.map((e, k) => (k === i ? { ...e, ...patch } : e)) })
  const updateStat = (i: number, patch: Partial<StatDef>) => set({ stats: g.stats.map((e, k) => (k === i ? { ...e, ...patch } : e)) })
  const updateAward = (i: number, patch: Partial<AwardDef>) => set({ awards: g.awards.map((e, k) => (k === i ? { ...e, ...patch } : e)) })

  return (
    <div className="game-editor">
      <section className="card">
        <h2>Lo básico</h2>
        <div className="row">
          <input className="input emoji-input" value={g.emoji} onChange={(e) => set({ emoji: e.target.value })} aria-label="Emoji" maxLength={8} />
          <input className="input grow" value={g.name} onChange={(e) => set({ name: e.target.value })} placeholder="Nombre del juego" maxLength={60} />
          <input type="color" className="color-input" value={/^#[0-9a-f]{6}$/i.test(g.color) ? g.color : '#7048E8'} onChange={(e) => set({ color: e.target.value })} aria-label="Color" />
        </div>
        <input className="input mt" value={g.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Una frase con gracia" />
        <input
          className="input mt"
          type="url"
          inputMode="url"
          value={g.cover ?? ''}
          onChange={(e) => set({ cover: e.target.value.trim() || undefined })}
          placeholder="Imagen de carátula: link https://… (opcional)"
          aria-label="Link a la imagen de carátula (opcional)"
        />
        <div className="field mt">
          <label>Categoría</label>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'chip' + (g.category === c.id ? ' active' : '')} onClick={() => set({ category: c.id })}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="field row-between">
          <label>Jugadores</label>
          <span className="row">
            <Stepper value={g.players.min} min={1} max={g.players.max} onChange={(n) => set({ players: { ...g.players, min: n } })} />
            <span className="muted">a</span>
            <Stepper value={g.players.max} min={g.players.min} max={30} onChange={(n) => set({ players: { ...g.players, max: n } })} />
          </span>
        </div>
        <div className="field">
          <label>¿Cómo se juega?</label>
          <div className="chips">
            {(
              [
                ['individual', 'Cada uno solo'],
                ['teams', 'Por equipos'],
                ['either', 'Las dos'],
                ['coop', 'Todos juntos'],
              ] as const
            ).map(([id, name]) => (
              <button key={id} className={'chip' + (g.sides === id ? ' active' : '')} onClick={() => set({ sides: id, ...(id === 'coop' ? { mode: 'coop' } : {}) })}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="field row-between">
          <label>Peso de una partida (para la gloria)</label>
          <div className="chips">
            {([1, 2, 3] as const).map((w) => (
              <button key={w} className={'chip' + (g.weight === w ? ' active' : '')} onClick={() => set({ weight: w })}>
                {['Liviano', 'Medio', 'Pesado'][w - 1]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Cómo se anota</h2>
        <div className="format-options">
          {MODES.map((m) => (
            <button key={m.id} className={'format-opt' + (g.mode === m.id ? ' active' : '')} onClick={() => set({ mode: m.id, ...(m.id === 'coop' ? { sides: 'coop' } : g.sides === 'coop' ? { sides: 'individual' } : {}) })}>
              <b>{m.name}</b>
              <span className="muted small">{m.help}</span>
            </button>
          ))}
        </div>
        {(g.mode === 'counter' || g.mode === 'rounds' || g.mode === 'turns') && (
          <div className="field row-between mt">
            <label>Puntos para ganar {g.mode === 'rounds' && <span className="hint block">(vacío = se juegan N manos)</span>}</label>
            <input
              className="input score-input"
              type="number"
              value={g.scoring.target ?? ''}
              onChange={(e) => setScoring({ target: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>
        )}
        {g.mode === 'rounds' && (
          <>
            <div className="field row-between">
              <label>Cantidad de manos (opcional)</label>
              <input className="input score-input" type="number" value={g.scoring.rounds ?? ''} onChange={(e) => setScoring({ rounds: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
            <div className="field row-between">
              <label>Gana el que menos tiene</label>
              <input type="checkbox" className="switch" checked={!!g.scoring.lowWins} onChange={(e) => setScoring({ lowWins: e.target.checked })} />
            </div>
            <div className="field row-between">
              <label>Se queda afuera al llegar a (opcional)</label>
              <input className="input score-input" type="number" value={g.scoring.eliminateAt ?? ''} onChange={(e) => setScoring({ eliminateAt: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
          </>
        )}
        {(g.mode === 'result' || g.mode === 'coop') && (
          <div className="field row-between mt">
            <label>Pedir puntaje final</label>
            <input type="checkbox" className="switch" checked={!!g.scoring.finalScores} onChange={(e) => setScoring({ finalScores: e.target.checked })} />
          </div>
        )}
        {g.mode === 'coop' && (
          <div className="field row-between">
            <label>Puntaje máximo (opcional)</label>
            <input className="input score-input" type="number" value={g.scoring.maxScore ?? ''} onChange={(e) => setScoring({ maxScore: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </div>
        )}
        {g.mode !== 'result' && g.mode !== 'coop' ? null : (
          <div className="field row-between">
            <label>Se puede empatar</label>
            <input type="checkbox" className="switch" checked={!!g.scoring.allowDraw} onChange={(e) => setScoring({ allowDraw: e.target.checked })} />
          </div>
        )}
        <input className="input" value={g.scoring.pointsName ?? ''} onChange={(e) => setScoring({ pointsName: e.target.value || undefined })} placeholder="Nombre de los puntos (porotos, coronas…)" />
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Eventos</h2>
          <button className="btn small" onClick={() => set({ events: [...g.events, { id: `ev${g.events.length + 1}`, name: '', emoji: '⭐', type: 'count' }] })}>
            <PlusIcon /> Agregar
          </button>
        </div>
        <p className="hint">Cosas que pasan en la partida y alimentan los premios: “canasta limpia”, “camino más largo”.</p>
        {g.events.map((e, i) => (
          <div key={i} className="editor-item">
            <div className="row">
              <input className="input emoji-input" value={e.emoji} onChange={(x) => updateEvent(i, { emoji: x.target.value })} maxLength={8} />
              <input className="input grow" value={e.name} placeholder="Nombre" onChange={(x) => updateEvent(i, { name: x.target.value, id: e.id.startsWith('ev') && x.target.value ? slug(x.target.value) : e.id })} />
              <button className="icon-btn" onClick={() => set({ events: g.events.filter((_, k) => k !== i) })} aria-label="Quitar">
                <TrashIcon />
              </button>
            </div>
            <div className="chips mt">
              <button className={'chip' + (e.type === 'count' ? ' active' : '')} onClick={() => updateEvent(i, { type: 'count' })}>
                Se suma
              </button>
              <button className={'chip' + (e.type === 'holder' ? ' active' : '')} onClick={() => updateEvent(i, { type: 'holder' })}>
                Pasa de mano
              </button>
              <button className={'chip' + (e.hidden ? ' active' : '')} onClick={() => updateEvent(i, { hidden: !e.hidden })}>
                🔒 Oculto
              </button>
              <label className="row small">
                Puntos
                <input className="input score-input" type="number" value={e.points ?? ''} onChange={(x) => updateEvent(i, { points: x.target.value === '' ? undefined : Number(x.target.value) })} />
              </label>
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Datos al final</h2>
          <button className="btn small" onClick={() => set({ stats: [...g.stats, { id: `st${g.stats.length + 1}`, label: '', type: 'number' }] })}>
            <PlusIcon /> Agregar
          </button>
        </div>
        <p className="hint">Preguntas para cada jugador al terminar (“recurso estrella”, “mejor palabra”).</p>
        {g.stats.map((s, i) => (
          <div key={i} className="editor-item">
            <div className="row">
              <input className="input grow" value={s.label} placeholder="Pregunta" onChange={(x) => updateStat(i, { label: x.target.value, id: s.id.startsWith('st') && x.target.value ? slug(x.target.value) : s.id })} />
              <button className="icon-btn" onClick={() => set({ stats: g.stats.filter((_, k) => k !== i) })} aria-label="Quitar">
                <TrashIcon />
              </button>
            </div>
            <div className="chips mt">
              <button className={'chip' + (s.type === 'number' ? ' active' : '')} onClick={() => updateStat(i, { type: 'number' })}>
                Número
              </button>
              <button className={'chip' + (s.type === 'choice' ? ' active' : '')} onClick={() => updateStat(i, { type: 'choice', choices: s.choices ?? [] })}>
                Opciones
              </button>
            </div>
            {s.type === 'choice' && (
              <input className="input mt" value={(s.choices ?? []).join(', ')} placeholder="Opciones separadas por coma" onChange={(x) => updateStat(i, { choices: x.target.value.split(',').map((c) => c.trim()).filter(Boolean) })} />
            )}
          </div>
        ))}
        <div className="field mt">
          <label>Roles secretos (opcional)</label>
          <input
            className="input"
            value={(g.roles ?? []).join(', ')}
            placeholder="Impostor, Tripulante"
            onChange={(x) => set({ roles: x.target.value.split(',').map((c) => c.trim()).filter(Boolean) })}
          />
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Premios propios</h2>
          <button
            className="btn small"
            onClick={() =>
              set({
                awards: [
                  ...g.awards,
                  {
                    id: `aw${g.awards.length + 1}`,
                    name: '',
                    measures: '',
                    metric: { type: 'wins' },
                    unit: '{n}',
                    levels: [1, 5, 15].map((at, k) => ({ at, name: '', description: '', glyph: 'star' as Glyph, color: ['#E8A26A', '#ADB5BD', '#FFD43B'][k] })),
                  },
                ],
              })
            }
          >
            <PlusIcon /> Agregar
          </button>
        </div>
        <p className="hint">Aunque no agregues ninguno, el juego ya tiene las medallas genéricas (Especialista, Racha).</p>
        {g.awards.map((a, i) => (
          <AwardEditor key={i} award={a} game={g} onChange={(patch) => updateAward(i, patch)} onRemove={() => set({ awards: g.awards.filter((_, k) => k !== i) })} />
        ))}
      </section>

      <section className="card">
        <h2>Torneos y reglas</h2>
        <div className="chips">
          {CUP_FORMATS.map((f) => (
            <button
              key={f.id}
              className={'chip' + (g.formats.includes(f.id) ? ' active' : '')}
              onClick={() => set({ formats: g.formats.includes(f.id) ? g.formats.filter((x) => x !== f.id) : [...g.formats, f.id] })}
            >
              {f.name}
            </button>
          ))}
        </div>
        <textarea className="input mt" rows={5} value={g.rules.join('\n')} placeholder="Resumen de las reglas, un renglón por idea" onChange={(e) => set({ rules: e.target.value.split('\n') })} />
        <input className="input mt" value={g.rulesUrl ?? ''} placeholder="Link al reglamento (opcional)" onChange={(e) => set({ rulesUrl: e.target.value || undefined })} />
      </section>

      {error && <p className="error">{error}</p>}
      <button className="link-btn small" onClick={() => setJson(JSON.stringify({ ...g, rules: g.rules.filter(Boolean) }, null, 2))}>
        Editar la ficha completa (JSON)
      </button>
      <div className="sticky-actions row">
        {onCancel && (
          <button className="btn" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button className="btn primary big grow" disabled={!g.name.trim()} onClick={save}>
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function AwardEditor({ award: a, game, onChange, onRemove }: { award: AwardDef; game: GameDef; onChange: (p: Partial<AwardDef>) => void; onRemove: () => void }) {
  const metricInfo = METRICS.find((m) => m.type === a.metric.type)
  const setMetric = (type: Metric['type']) => {
    const info = METRICS.find((m) => m.type === type)!
    let metric: Metric
    if (info.needs === 'event') metric = { type, event: game.events[0]?.id ?? '' } as Metric
    else if (info.needs === 'stat') metric = { type, stat: game.stats[0]?.id ?? '' } as Metric
    else if (info.needs === 'choice') metric = { type: 'winsWithChoice', stat: game.stats.find((s) => s.type === 'choice')?.id ?? '', value: '' }
    else if (info.needs === 'role') metric = { type: 'winsAsRole', role: game.roles?.[0] ?? '' }
    else metric = { type } as Metric
    onChange({ metric })
  }
  const m = a.metric as Record<string, string>
  const choiceStat = game.stats.find((s) => s.id === m.stat)

  return (
    <div className="editor-item">
      <div className="row">
        <input className="input grow" value={a.name} placeholder="Nombre de la familia (Ruta 40)" onChange={(e) => onChange({ name: e.target.value, id: a.id.startsWith('aw') && e.target.value ? slug(e.target.value) : a.id })} />
        <button className="icon-btn" onClick={onRemove} aria-label="Quitar">
          <TrashIcon />
        </button>
      </div>
      <select className="input mt" value={a.metric.type} onChange={(e) => setMetric(e.target.value as Metric['type'])}>
        {METRICS.map((x) => (
          <option key={x.type} value={x.type}>
            {x.name}
          </option>
        ))}
      </select>
      {metricInfo?.needs === 'event' && (
        <select className="input mt" value={m.event} onChange={(e) => onChange({ metric: { ...a.metric, event: e.target.value } as Metric })}>
          {game.events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.emoji} {e.name}
            </option>
          ))}
        </select>
      )}
      {(metricInfo?.needs === 'stat' || metricInfo?.needs === 'choice') && (
        <select className="input mt" value={m.stat} onChange={(e) => onChange({ metric: { ...a.metric, stat: e.target.value } as Metric })}>
          {game.stats
            .filter((s) => (metricInfo.needs === 'choice' ? s.type === 'choice' : s.type === 'number'))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
        </select>
      )}
      {metricInfo?.needs === 'choice' && (
        <select className="input mt" value={m.value} onChange={(e) => onChange({ metric: { ...a.metric, value: e.target.value } as Metric })}>
          <option value="">—</option>
          {choiceStat?.choices?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
      {metricInfo?.needs === 'role' && (
        <select className="input mt" value={m.role} onChange={(e) => onChange({ metric: { ...a.metric, role: e.target.value } as Metric })}>
          {(game.roles ?? []).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      )}
      <input className="input mt" value={a.measures} placeholder="Qué mide, en una frase" onChange={(e) => onChange({ measures: e.target.value })} />
      {a.levels.map((l, k) => (
        <div key={k} className="level-edit">
          <Medal family={a} level={k} size={48} />
          <div className="grow">
            <div className="row">
              <span className="muted small">{TIER_NAMES[k] ?? `Nivel ${k + 1}`} desde</span>
              <input
                className="input score-input"
                type="number"
                value={l.at}
                onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, at: Number(e.target.value) } : x)) })}
              />
            </div>
            <input className="input mt" value={l.name} placeholder="Nombre del nivel" onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, name: e.target.value } : x)) })} />
            <input className="input mt" value={l.description} placeholder="Descripción con gracia" onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, description: e.target.value } : x)) })} />
            <div className="row mt">
              <select className="input" value={l.glyph ?? 'star'} onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, glyph: e.target.value as Glyph } : x)) })}>
                {GLYPHS.map((gl) => (
                  <option key={gl} value={gl}>
                    {gl}
                  </option>
                ))}
              </select>
              <input
                type="color"
                className="color-input"
                value={l.color && /^#[0-9a-f]{6}$/i.test(l.color) ? l.color : '#FFD43B'}
                onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, color: e.target.value } : x)) })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
