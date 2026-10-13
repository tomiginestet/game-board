import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { checkGame } from '../lib/ai'
import { confirmAction } from '../lib/feedback'
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
import { friendlyError } from '../lib/text'
import { Stepper } from './ConfigEditor'
import { ErrorText } from './Feedback'
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
 * Editor de juegos: lo básico con formularios y, para lo raro, todos los datos como texto (JSON).
 * Sirve para armar un juego a mano o retocar lo que propuso la IA.
 */
export function GameEditor({ initial, onSave, onCancel, saveLabel = 'Guardar juego' }: { initial: GameDef; onSave: (g: GameDef) => void; onCancel?: () => void; saveLabel?: string }) {
  const [g, setG] = useState<GameDef>(initial)
  const [json, setJson] = useState<string | null>(null)
  const [error, setError] = useState('')
  const id = useId()
  const set = (patch: Partial<GameDef>) => setG({ ...g, ...patch })
  const setScoring = (patch: Partial<GameDef['scoring']>) => setG({ ...g, scoring: { ...g.scoring, ...patch } })

  const save = async () => {
    try {
      const source = json !== null ? JSON.parse(json) : g
      const { game, warnings } = checkGame(source, { source: initial.source === 'builtin' ? 'custom' : (initial.source ?? 'custom'), keepId: !!initial.id })
      if (warnings.length && !(await confirmAction({ title: '¿Guardar con estos avisos?', detail: warnings.join(' '), confirmLabel: 'Guardar igual' }))) return
      onSave(game)
    } catch (e) {
      setError(friendlyError(e))
    }
  }

  if (json !== null) {
    return (
      <div className="game-editor">
        <label className="field">
          <span className="field-label">Todos los datos del juego, como texto</span>
          <textarea className="input code-area" rows={24} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} aria-describedby={`${id}-json-hint`} />
        </label>
        <p id={`${id}-json-hint`} className="hint">
          Modo avanzado: si cambiás el formato, no se va a poder guardar.
        </p>
        <ErrorText>{error}</ErrorText>
        <div className="row">
          <button
            className="btn"
            onClick={() => {
              try {
                setG(JSON.parse(json))
                setJson(null)
                setError('')
              } catch (e) {
                setError(friendlyError(e))
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
        <div className="field">
          <label htmlFor={`${id}-name`}>Nombre del juego</label>
          <div className="row">
            <input className="input emoji-input" value={g.emoji} onChange={(e) => set({ emoji: e.target.value })} aria-label="Emoji del juego" maxLength={8} />
            <input id={`${id}-name`} className="input grow" value={g.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ej.: Escoba de 15" maxLength={60} />
            <input type="color" className="color-input" value={/^#[0-9a-f]{6}$/i.test(g.color) ? g.color : '#7048E8'} onChange={(e) => set({ color: e.target.value })} aria-label="Color del juego" />
          </div>
        </div>
        <label className="field">
          <span className="field-label">Frase corta (opcional)</span>
          <input className="input" value={g.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Ej.: El que pierde lava los platos" />
        </label>
        <label className="field">
          <span className="field-label">Imagen de carátula (opcional)</span>
          <input className="input" type="url" inputMode="url" value={g.cover ?? ''} onChange={(e) => set({ cover: e.target.value.trim() || undefined })} placeholder="https://…" />
        </label>
        <div className="field" role="group" aria-labelledby={`${id}-category`}>
          <span id={`${id}-category`} className="field-label">
            Categoría
          </span>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'chip' + (g.category === c.id ? ' active' : '')} aria-pressed={g.category === c.id} onClick={() => set({ category: c.id })}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="field row-between" role="group" aria-labelledby={`${id}-players`}>
          <span id={`${id}-players`} className="field-label">
            Jugadores
          </span>
          <span className="row">
            <Stepper label="Mínimo de jugadores" value={g.players.min} min={1} max={g.players.max} onChange={(n) => set({ players: { ...g.players, min: n } })} />
            <span className="muted">a</span>
            <Stepper label="Máximo de jugadores" value={g.players.max} min={g.players.min} max={30} onChange={(n) => set({ players: { ...g.players, max: n } })} />
          </span>
        </div>
        <div className="field" role="group" aria-labelledby={`${id}-sides`}>
          <span id={`${id}-sides`} className="field-label">
            ¿Cómo se juega?
          </span>
          <div className="chips">
            {(
              [
                ['individual', 'Cada uno solo'],
                ['teams', 'Por equipos'],
                ['either', 'Las dos'],
                ['coop', 'Todos juntos'],
              ] as const
            ).map(([sid, name]) => (
              <button key={sid} className={'chip' + (g.sides === sid ? ' active' : '')} aria-pressed={g.sides === sid} onClick={() => set({ sides: sid, ...(sid === 'coop' ? { mode: 'coop' } : {}) })}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="field row-between" role="group" aria-labelledby={`${id}-weight`}>
          <span id={`${id}-weight`} className="field-label">
            Peso de una partida (para la gloria)
          </span>
          <div className="chips">
            {([1, 2, 3] as const).map((w) => (
              <button key={w} className={'chip' + (g.weight === w ? ' active' : '')} aria-pressed={g.weight === w} onClick={() => set({ weight: w })}>
                {['Liviano', 'Medio', 'Pesado'][w - 1]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 id={`${id}-mode`}>Cómo se anota</h2>
        <div className="format-options" role="group" aria-labelledby={`${id}-mode`}>
          {MODES.map((m) => (
            <button
              key={m.id}
              className={'format-opt' + (g.mode === m.id ? ' active' : '')}
              aria-pressed={g.mode === m.id}
              onClick={() => set({ mode: m.id, ...(m.id === 'coop' ? { sides: 'coop' } : g.sides === 'coop' ? { sides: 'individual' } : {}) })}
            >
              <b>{m.name}</b>
              <span className="muted small">{m.help}</span>
            </button>
          ))}
        </div>
        {(g.mode === 'counter' || g.mode === 'rounds' || g.mode === 'turns') && (
          <div className="field row-between mt">
            <label htmlFor={`${id}-target`}>Puntos para ganar {g.mode === 'rounds' && <span className="hint block">(vacío = se juegan N manos)</span>}</label>
            <input
              id={`${id}-target`}
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
              <label htmlFor={`${id}-rounds`}>Cantidad de manos (opcional)</label>
              <input id={`${id}-rounds`} className="input score-input" type="number" value={g.scoring.rounds ?? ''} onChange={(e) => setScoring({ rounds: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
            <div className="field row-between">
              <label htmlFor={`${id}-low`}>Gana el que menos tiene</label>
              <input id={`${id}-low`} type="checkbox" className="switch" checked={!!g.scoring.lowWins} onChange={(e) => setScoring({ lowWins: e.target.checked })} />
            </div>
            <div className="field row-between">
              <label htmlFor={`${id}-elim`}>Se queda afuera al llegar a (opcional)</label>
              <input id={`${id}-elim`} className="input score-input" type="number" value={g.scoring.eliminateAt ?? ''} onChange={(e) => setScoring({ eliminateAt: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </div>
          </>
        )}
        {(g.mode === 'result' || g.mode === 'coop') && (
          <div className="field row-between mt">
            <label htmlFor={`${id}-final`}>Pedir puntaje final</label>
            <input id={`${id}-final`} type="checkbox" className="switch" checked={!!g.scoring.finalScores} onChange={(e) => setScoring({ finalScores: e.target.checked })} />
          </div>
        )}
        {g.mode === 'coop' && (
          <div className="field row-between">
            <label htmlFor={`${id}-max`}>Puntaje máximo (opcional)</label>
            <input id={`${id}-max`} className="input score-input" type="number" value={g.scoring.maxScore ?? ''} onChange={(e) => setScoring({ maxScore: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </div>
        )}
        {g.mode !== 'result' && g.mode !== 'coop' ? null : (
          <div className="field row-between">
            <label htmlFor={`${id}-draw`}>Se puede empatar</label>
            <input id={`${id}-draw`} type="checkbox" className="switch" checked={!!g.scoring.allowDraw} onChange={(e) => setScoring({ allowDraw: e.target.checked })} />
          </div>
        )}
        <label className="field">
          <span className="field-label">Nombre de los puntos (opcional)</span>
          <input className="input" value={g.scoring.pointsName ?? ''} onChange={(e) => setScoring({ pointsName: e.target.value || undefined })} placeholder="Ej.: porotos, coronas" />
        </label>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Eventos</h2>
          <button className="btn small" onClick={() => set({ events: [...g.events, { id: `ev${g.events.length + 1}`, name: '', emoji: '⭐', type: 'count' }] })}>
            <PlusIcon /> Agregar
          </button>
        </div>
        <p className="hint">Cosas que pasan en la partida y alimentan las medallas: “canasta limpia”, “camino más largo”.</p>
        {g.events.map((e, i) => (
          <div key={i} className="editor-item">
            <div className="row">
              <input className="input emoji-input" value={e.emoji} onChange={(x) => updateEvent(i, { emoji: x.target.value })} maxLength={8} aria-label={`Emoji del evento ${i + 1}`} />
              <input
                className="input grow"
                value={e.name}
                placeholder="Ej.: Canasta limpia"
                aria-label={`Nombre del evento ${i + 1}`}
                onChange={(x) => updateEvent(i, { name: x.target.value, id: e.id.startsWith('ev') && x.target.value ? slug(x.target.value) : e.id })}
              />
              <button className="icon-btn" onClick={() => set({ events: g.events.filter((_, k) => k !== i) })} aria-label={`Quitar el evento ${e.name || i + 1}`}>
                <TrashIcon />
              </button>
            </div>
            <div className="chips mt">
              <span className="chips" role="group" aria-label={`Cómo cuenta el evento ${i + 1}`}>
                <button className={'chip' + (e.type === 'count' ? ' active' : '')} aria-pressed={e.type === 'count'} onClick={() => updateEvent(i, { type: 'count' })}>
                  Se suma
                </button>
                <button className={'chip' + (e.type === 'holder' ? ' active' : '')} aria-pressed={e.type === 'holder'} onClick={() => updateEvent(i, { type: 'holder' })}>
                  Pasa de mano
                </button>
              </span>
              <button className={'chip' + (e.hidden ? ' active' : '')} aria-pressed={!!e.hidden} onClick={() => updateEvent(i, { hidden: !e.hidden })}>
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
              <input
                className="input grow"
                value={s.label}
                placeholder="Ej.: Recurso estrella"
                aria-label={`Pregunta ${i + 1}`}
                onChange={(x) => updateStat(i, { label: x.target.value, id: s.id.startsWith('st') && x.target.value ? slug(x.target.value) : s.id })}
              />
              <button className="icon-btn" onClick={() => set({ stats: g.stats.filter((_, k) => k !== i) })} aria-label={`Quitar la pregunta ${s.label || i + 1}`}>
                <TrashIcon />
              </button>
            </div>
            <div className="chips mt" role="group" aria-label={`Tipo de respuesta de la pregunta ${i + 1}`}>
              <button className={'chip' + (s.type === 'number' ? ' active' : '')} aria-pressed={s.type === 'number'} onClick={() => updateStat(i, { type: 'number' })}>
                Número
              </button>
              <button className={'chip' + (s.type === 'choice' ? ' active' : '')} aria-pressed={s.type === 'choice'} onClick={() => updateStat(i, { type: 'choice', choices: s.choices ?? [] })}>
                Opciones
              </button>
            </div>
            {s.type === 'choice' && (
              <label className="field mt">
                <span className="field-label">Opciones, separadas por coma</span>
                <input className="input" value={(s.choices ?? []).join(', ')} placeholder="Ej.: Madera, Ladrillo, Trigo" onChange={(x) => updateStat(i, { choices: x.target.value.split(',').map((c) => c.trim()).filter(Boolean) })} />
              </label>
            )}
          </div>
        ))}
        <div className="field mt">
          <label htmlFor={`${id}-roles`}>Roles secretos (opcional, separados por coma)</label>
          <input
            id={`${id}-roles`}
            className="input"
            value={(g.roles ?? []).join(', ')}
            placeholder="Ej.: Impostor, Tripulante"
            onChange={(x) => set({ roles: x.target.value.split(',').map((c) => c.trim()).filter(Boolean) })}
          />
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Medallas propias</h2>
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
        <p className="hint">Aunque no agregues ninguna, el juego ya tiene las medallas genéricas (Especialista, Racha).</p>
        {g.awards.map((a, i) => (
          <AwardEditor key={i} award={a} game={g} onChange={(patch) => updateAward(i, patch)} onRemove={() => set({ awards: g.awards.filter((_, k) => k !== i) })} />
        ))}
      </section>

      <section className="card">
        <h2>Torneos y reglas</h2>
        <div className="field" role="group" aria-labelledby={`${id}-formats`}>
          <span id={`${id}-formats`} className="field-label">
            Tipos de torneo
          </span>
          <div className="chips">
            {CUP_FORMATS.map((f) => (
              <button
                key={f.id}
                className={'chip' + (g.formats.includes(f.id) ? ' active' : '')}
                aria-pressed={g.formats.includes(f.id)}
                onClick={() => set({ formats: g.formats.includes(f.id) ? g.formats.filter((x) => x !== f.id) : [...g.formats, f.id] })}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span className="field-label">Resumen de las reglas, un renglón por idea</span>
          <textarea className="input" rows={5} value={g.rules.join('\n')} placeholder="Ej.: Se reparten 3 cartas a cada uno." onChange={(e) => set({ rules: e.target.value.split('\n') })} />
        </label>
        <label className="field">
          <span className="field-label">Link al reglamento (opcional)</span>
          <input className="input" type="url" inputMode="url" value={g.rulesUrl ?? ''} placeholder="https://…" onChange={(e) => set({ rulesUrl: e.target.value || undefined })} />
        </label>
      </section>

      <ErrorText>{error}</ErrorText>
      <button className="link-btn small" onClick={() => setJson(JSON.stringify({ ...g, rules: g.rules.filter(Boolean) }, null, 2))}>
        Editar todo como texto (avanzado)
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
  const id = useId()
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
  const medal = a.name || 'nueva'

  return (
    <div className="editor-item">
      <div className="field">
        <label htmlFor={`${id}-name`}>Nombre de la medalla</label>
        <div className="row">
          <input
            id={`${id}-name`}
            className="input grow"
            value={a.name}
            placeholder="Ej.: Ruta 40"
            onChange={(e) => onChange({ name: e.target.value, id: a.id.startsWith('aw') && e.target.value ? slug(e.target.value) : a.id })}
          />
          <button className="icon-btn" onClick={onRemove} aria-label={`Quitar la medalla ${medal}`}>
            <TrashIcon />
          </button>
        </div>
      </div>
      <label className="field">
        <span className="field-label">Qué cuenta</span>
        <select className="input" value={a.metric.type} onChange={(e) => setMetric(e.target.value as Metric['type'])}>
          {METRICS.map((x) => (
            <option key={x.type} value={x.type}>
              {x.name}
            </option>
          ))}
        </select>
      </label>
      {metricInfo?.needs === 'event' && (
        <label className="field">
          <span className="field-label">Evento</span>
          <select className="input" value={m.event} onChange={(e) => onChange({ metric: { ...a.metric, event: e.target.value } as Metric })}>
            {game.events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.emoji} {e.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {(metricInfo?.needs === 'stat' || metricInfo?.needs === 'choice') && (
        <label className="field">
          <span className="field-label">Dato al final</span>
          <select className="input" value={m.stat} onChange={(e) => onChange({ metric: { ...a.metric, stat: e.target.value } as Metric })}>
            {game.stats
              .filter((s) => (metricInfo.needs === 'choice' ? s.type === 'choice' : s.type === 'number'))
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
          </select>
        </label>
      )}
      {metricInfo?.needs === 'choice' && (
        <label className="field">
          <span className="field-label">Valor</span>
          <select className="input" value={m.value} onChange={(e) => onChange({ metric: { ...a.metric, value: e.target.value } as Metric })}>
            <option value="">—</option>
            {choiceStat?.choices?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      {metricInfo?.needs === 'role' && (
        <label className="field">
          <span className="field-label">Rol</span>
          <select className="input" value={m.role} onChange={(e) => onChange({ metric: { ...a.metric, role: e.target.value } as Metric })}>
            {(game.roles ?? []).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="field">
        <span className="field-label">Qué mide, en una frase</span>
        <input className="input" value={a.measures} placeholder="Ej.: Kilómetros recorridos en la ruta" onChange={(e) => onChange({ measures: e.target.value })} />
      </label>
      {a.levels.map((l, k) => {
        const tier = TIER_NAMES[k] ?? `Nivel ${k + 1}`
        return (
          <div key={k} className="level-edit" role="group" aria-label={`Nivel ${tier}`}>
            <Medal family={a} level={k} size={48} />
            <div className="grow">
              <div className="row">
                <label htmlFor={`${id}-at-${k}`} className="muted small">
                  {tier} desde
                </label>
                <input
                  id={`${id}-at-${k}`}
                  className="input score-input"
                  type="number"
                  value={l.at}
                  onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, at: Number(e.target.value) } : x)) })}
                />
              </div>
              <input
                className="input mt"
                value={l.name}
                placeholder="Ej.: Mochilero"
                aria-label={`Nombre del nivel ${tier}`}
                onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, name: e.target.value } : x)) })}
              />
              <input
                className="input mt"
                value={l.description}
                placeholder="Ej.: Ya conoce cada curva de memoria"
                aria-label={`Descripción del nivel ${tier}`}
                onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, description: e.target.value } : x)) })}
              />
              <div className="row mt">
                <select
                  className="input"
                  value={l.glyph ?? 'star'}
                  aria-label={`Dibujo del nivel ${tier}`}
                  onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, glyph: e.target.value as Glyph } : x)) })}
                >
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
                  aria-label={`Color del nivel ${tier}`}
                  onChange={(e) => onChange({ levels: a.levels.map((x, j) => (j === k ? { ...x, color: e.target.value } : x)) })}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
