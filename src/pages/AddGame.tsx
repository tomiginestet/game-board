import { ArrowLeftIcon, ArrowSquareOutIcon, CheckIcon, ClipboardTextIcon, CopyIcon, HandIcon, MagicWandIcon, PencilSimpleIcon, SparkleIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { blankGame, GameEditor } from '../components/GameEditor'
import { Medal } from '../components/Medal'
import { generateWithApi, parseGameResponse, promptForChat, type Checked } from '../lib/ai'
import { aiSpentThisMonth, useAuth } from '../lib/auth'
import { findGame } from '../lib/games'
import type { GameDef } from '../lib/games/schema'
import { actions, useData } from '../lib/store'
import { syncAvailable } from '../lib/sync'
import { MODE_NAMES } from './GameDetail'

const MONTHLY_LIMIT = 10

type Way = 'paste' | 'api' | 'manual'

/** Agregar un juego: con IA (copiar y pegar gratis, o automática por API) o a mano. */
export function AddGame() {
  const data = useData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const copyOf = params.get('copiar')
  const source = copyOf ? findGame(data, copyOf) : undefined
  const [name, setName] = useState(params.get('nombre') ?? '')
  const [notes, setNotes] = useState('')
  const [rules, setRules] = useState('')
  const [way, setWay] = useState<Way>(source ? 'manual' : 'paste')
  const [draft, setDraft] = useState<Checked | null>(null)
  const [editing, setEditing] = useState<GameDef | null>(source ? { ...source, id: '', name: `${source.name} (a mi manera)`, source: 'custom' } : null)

  const save = (g: GameDef) => {
    const saved = actions.saveGame(g)
    navigate(`/juegos/${saved.id}`, { replace: true })
  }

  if (editing) {
    return (
      <div className="page">
        <button className="back link-btn" onClick={() => setEditing(null)}>
          <ArrowLeftIcon /> Volver
        </button>
        <h1>{source ? 'Tu versión' : 'Armar a mano'}</h1>
        <GameEditor initial={editing} onSave={save} onCancel={() => setEditing(null)} />
      </div>
    )
  }

  if (draft) {
    return (
      <div className="page">
        <button className="back link-btn" onClick={() => setDraft(null)}>
          <ArrowLeftIcon /> Volver
        </button>
        <h1>¿Te sirve esta ficha?</h1>
        <GamePreview game={draft.game} />
        {draft.warnings.length > 0 && (
          <div className="card warn">
            <b>Ajustes automáticos:</b>
            <ul className="small">
              {draft.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="sticky-actions row">
          <button className="btn" onClick={() => setEditing(draft.game)}>
            <PencilSimpleIcon /> Retocar
          </button>
          <button className="btn primary big grow" onClick={() => save(draft.game)}>
            <CheckIcon /> Agregar a la biblioteca
          </button>
        </div>
      </div>
    )
  }

  const input = { name, notes, rules }
  return (
    <div className="page">
      <Link to="/juegos" className="back">
        <ArrowLeftIcon /> Juegos
      </Link>
      <h1>Agregar un juego</h1>
      <p className="muted">La app arma la ficha del juego: cómo se anota, qué eventos registrar, modos de torneo y medallas propias.</p>

      <div className="field">
        <label htmlFor="gname">Nombre del juego</label>
        <input id="gname" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Carrera de mente, Bang!, Escoba…" />
      </div>
      <div className="field">
        <label htmlFor="gnotes">Cómo lo juegan ustedes (opcional)</label>
        <input id="gnotes" className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej.: a 5000 puntos, en parejas" />
      </div>
      <div className="field">
        <label htmlFor="grules">Reglas (opcional, pegalas si las tenés)</label>
        <textarea id="grules" className="input" rows={5} value={rules} onChange={(e) => setRules(e.target.value)} placeholder="Pegá el reglamento o un resumen. Con reglas, la ficha sale mucho mejor." />
      </div>

      <div className="segmented">
        <button className={way === 'paste' ? 'active' : ''} onClick={() => setWay('paste')}>
          <ClipboardTextIcon /> IA gratis
        </button>
        <button className={way === 'api' ? 'active' : ''} onClick={() => setWay('api')}>
          <MagicWandIcon /> IA automática
        </button>
        <button className={way === 'manual' ? 'active' : ''} onClick={() => setWay('manual')}>
          <HandIcon /> A mano
        </button>
      </div>

      {way === 'paste' && <PasteFlow input={input} onDraft={setDraft} />}
      {way === 'api' && <ApiFlow input={input} onDraft={setDraft} />}
      {way === 'manual' && (
        <section className="card">
          <p>Armá la ficha con un formulario. Si no te querés complicar, alcanza con el nombre, la cantidad de jugadores y “Resultado final”: el juego ya tiene ranking, torneos y medallas genéricas.</p>
          <button className="btn primary block" disabled={!name.trim()} onClick={() => setEditing({ ...blankGame(name.trim()) })}>
            <PencilSimpleIcon /> Empezar
          </button>
        </section>
      )}
    </div>
  )
}

function PasteFlow({ input, onDraft }: { input: { name: string; notes: string; rules: string }; onDraft: (c: Checked) => void }) {
  const [copied, setCopied] = useState(false)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const copy = async () => {
    await navigator.clipboard?.writeText(promptForChat(input))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  return (
    <section className="card steps">
      <p className="muted small">Gratis: usás cualquier chat de IA (Claude, ChatGPT, Gemini…) con tu cuenta.</p>
      <ol>
        <li>
          <button className="btn primary" disabled={!input.name.trim()} onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'Pedido copiado' : 'Copiar el pedido'}
          </button>
        </li>
        <li>
          Pegalo en un chat.{' '}
          <a href="https://claude.ai/new" target="_blank" rel="noreferrer noopener">
            Abrir Claude <ArrowSquareOutIcon className="inline-icon" />
          </a>
        </li>
        <li>
          Copiá la respuesta entera y pegala acá:
          <textarea className="input mt code-area" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='{ "id": "...", "name": "..." }' />
        </li>
      </ol>
      {error && <p className="error">{error}</p>}
      <button
        className="btn primary block"
        disabled={!answer.trim()}
        onClick={() => {
          try {
            setError('')
            onDraft(parseGameResponse(answer))
          } catch (e) {
            setError((e as Error).message)
          }
        }}
      >
        <SparkleIcon /> Ver la ficha
      </button>
    </section>
  )
}

function ApiFlow({ input, onDraft }: { input: { name: string; notes: string; rules: string }; onDraft: (c: Checked) => void }) {
  const auth = useAuth()
  const [spent, setSpent] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!auth.session) return
    aiSpentThisMonth()
      .then(setSpent)
      .catch(() => setSpent(null))
  }, [auth.session])

  if (!syncAvailable) return <div className="card">La generación automática no está configurada en esta instalación.</div>
  if (!auth.session)
    return (
      <div className="card">
        <p>Para usar la IA automática hay que iniciar sesión (así se controla el gasto).</p>
        <Link to="/club" className="btn primary">
          Iniciar sesión
        </Link>
      </div>
    )

  const generate = async () => {
    setBusy(true)
    setError('')
    try {
      onDraft(await generateWithApi(input))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card">
      <p className="muted small">
        Usa la API de Claude con un tope de USD {MONTHLY_LIMIT} por mes para toda la app. Cada juego cuesta unos centavos.
        {spent !== null && ` Este mes se usaron USD ${spent.toFixed(2)}.`}
      </p>
      <button className="btn primary big block" disabled={busy || !input.name.trim()} onClick={generate}>
        <MagicWandIcon /> {busy ? 'Pensando el juego… (puede tardar un minuto)' : 'Generar ficha'}
      </button>
      {error && <p className="error">{error}</p>}
    </section>
  )
}

/** Vista previa de una ficha antes de guardarla. */
export function GamePreview({ game }: { game: GameDef }) {
  return (
    <div className="game-preview">
      <header className="game-head">
        <GameBadge game={game} size={56} />
        <div>
          <h2>{game.name}</h2>
          <p className="muted">{game.tagline}</p>
          <div className="chips">
            <span className="pill">
              {game.players.min}–{game.players.max} jugadores
            </span>
            <span className="pill">{MODE_NAMES[game.mode]}</span>
          </div>
        </div>
      </header>
      {game.events.length > 0 && (
        <section className="card">
          <h3>Se anota</h3>
          <div className="chips">
            {game.events.map((e) => (
              <span key={e.id} className="pill">
                {e.emoji} {e.name}
                {e.points ? ` (${e.points > 0 ? '+' : ''}${e.points})` : ''}
                {e.hidden ? ' 🔒' : ''}
              </span>
            ))}
          </div>
        </section>
      )}
      {game.awards.length > 0 && (
        <section className="card">
          <h3>Medallas propias</h3>
          {game.awards.map((a) => (
            <div key={a.id} className="award-row">
              <div className="award-medals">
                {a.levels.slice(0, 3).map((_, i) => (
                  <Medal key={i} family={a} level={i} size={44} />
                ))}
              </div>
              <div className="grow">
                <b>{a.name}</b>
                <span className="muted small block">{a.measures}</span>
                <span className="small block">{a.levels.map((l) => l.name).join(' · ')}</span>
              </div>
            </div>
          ))}
        </section>
      )}
      {game.rules.length > 0 && (
        <section className="card">
          <h3>Reglas</h3>
          <ul className="rules">
            {game.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** Editar un juego agregado por el grupo. */
export function EditGame() {
  const { id } = useParams()
  const data = useData()
  const navigate = useNavigate()
  const game = data.games.find((g) => g.id === id)
  if (!game) return <div className="page">Juego no encontrado.</div>
  return (
    <div className="page">
      <Link to={`/juegos/${game.id}`} className="back">
        <ArrowLeftIcon /> {game.name}
      </Link>
      <h1>Editar ficha</h1>
      <GameEditor
        initial={game}
        onSave={(g) => {
          actions.saveGame({ ...g, id: game.id })
          navigate(`/juegos/${game.id}`, { replace: true })
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  )
}
