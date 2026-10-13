import { ShuffleIcon, TrophyIcon } from '@phosphor-icons/react'
import { useId, useMemo, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Stepper } from '../components/ConfigEditor'
import { GameBadge } from '../components/GameBits'
import { OptionsEditor } from '../components/OptionsEditor'
import { ChoiceGroup, PlayerPicker } from '../components/PlayerPicker'
import { defaultConfig } from '../lib/engine'
import { CUP_FORMATS, type CupFormat, type GameDef } from '../lib/games/schema'
import { plural, useGame, useGames } from '../lib/hooks'
import { actions, useData } from '../lib/store'
import type { CupEntrant, Id } from '../lib/types'

export function NewCup() {
  const [params, setParams] = useSearchParams()
  const gameId = params.get('juego') ?? undefined
  const game = useGame(gameId)
  const games = useGames().filter((g) => g.formats.length > 0)
  if (gameId === 'pingpong') return <Navigate to="/ping-pong/torneo/nuevo" replace />
  if (!game) {
    return (
      <div className="page">
        <h1>Nuevo torneo</h1>
        <h2>¿De qué juego?</h2>
        <div className="game-grid">
          {games.map((g) => (
            <button key={g.id} className="game-card" style={{ ['--gc' as string]: g.color }} onClick={() => setParams({ juego: g.id })}>
              <GameBadge game={g} size={44} />
              <b className="ellipsis">{g.name}</b>
            </button>
          ))}
        </div>
      </div>
    )
  }
  return <CupSetup key={game.id} game={game} />
}

function CupSetup({ game }: { game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const id = useId()
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name)), [data.players])
  const [format, setFormat] = useState<CupFormat>(game.formats[0])
  const [name, setName] = useState(`Copa de ${game.name}`)
  const [selected, setSelected] = useState<Id[]>([])
  const [byTeams, setByTeams] = useState(game.sides === 'teams')
  const teamSize = game.teamSize ?? 2
  const [order, setOrder] = useState<Id[] | null>(null)
  const [config, setConfig] = useState(() => defaultConfig(game))
  const [doubleRound, setDoubleRound] = useState(false)
  const [rounds, setRounds] = useState(3)
  const [tableSize, setTableSize] = useState(Math.min(4, game.players.max))
  const [final, setFinal] = useState(true)
  const [prize, setPrize] = useState('')

  const toggle = (id: Id) => {
    setOrder(null)
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const seq = order ?? selected
  const entrants: CupEntrant[] = byTeams
    ? Array.from({ length: Math.floor(seq.length / teamSize) }, (_, i) => ({ players: seq.slice(i * teamSize, (i + 1) * teamSize) }))
    : seq.map((id) => ({ players: [id] }))
  const nameOf = (id: Id) => data.players.find((p) => p.id === id)?.name ?? '?'

  const minEntrants = format === 'tables' ? Math.max(3, game.players.min) : format === 'series' ? Math.max(2, game.players.min) : 2
  const seriesTooMany = format === 'series' && entrants.length > game.players.max
  const leftover = byTeams ? seq.length % teamSize : 0
  const ready = name.trim() && entrants.length >= minEntrants && !seriesTooMany && !leftover
  // Qué falta para poder crear el torneo, dicho como lo que hay que hacer.
  const missing = !name.trim()
    ? 'Ponele un nombre al torneo'
    : leftover
      ? 'Completá los equipos'
      : seriesTooMany
        ? `Elegí hasta ${game.players.max} jugadores`
        : `Elegí al menos ${plural(byTeams ? minEntrants * teamSize : minEntrants, 'jugador', 'jugadores')}`

  const create = () => {
    if (!ready) return
    const cup = actions.createCup({ gameId: game.id, name, format, entrants, config, doubleRound, rounds, tableSize, final, prize })
    navigate(`/torneos/${cup.id}`, { replace: true })
  }

  return (
    <div className="page">
      <header className="game-head">
        <GameBadge game={game} size={52} />
        <div>
          <h1>Nuevo torneo</h1>
          <p className="muted">{game.name}</p>
        </div>
      </header>

      <div className="field">
        <label htmlFor="cup-name">Nombre</label>
        <input id="cup-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
      </div>

      <section>
        <h2 id={`${id}-format`}>Formato</h2>
        <ChoiceGroup
          className="format-options"
          itemClassName="format-opt"
          labelledBy={`${id}-format`}
          value={format}
          onChange={setFormat}
          options={CUP_FORMATS.filter((f) => game.formats.includes(f.id)).map((f) => ({
            value: f.id,
            content: (
              <>
                <b>{f.name}</b>
                <span className="muted small">{f.description}</span>
              </>
            ),
          }))}
        />
      </section>

      {format === 'league' && (
        <div className="field row-between">
          <label htmlFor="double">Ida y vuelta</label>
          <input id="double" type="checkbox" className="switch" checked={doubleRound} onChange={(e) => setDoubleRound(e.target.checked)} />
        </div>
      )}
      {(format === 'tables' || format === 'series') && (
        <div className="field row-between">
          <span className="field-label" aria-hidden>
            {format === 'tables' ? 'Rondas' : 'Partidas'}
          </span>
          <Stepper value={rounds} min={1} max={20} onChange={setRounds} label={format === 'tables' ? 'Rondas' : 'Partidas'} />
        </div>
      )}
      {format === 'tables' && (
        <>
          <div className="field row-between">
            <span className="field-label" aria-hidden>
              Jugadores por mesa
            </span>
            <Stepper value={tableSize} min={Math.max(2, game.players.min)} max={game.players.max} onChange={setTableSize} label="Jugadores por mesa" />
          </div>
          <div className="field row-between">
            <label htmlFor="final">Mesa final con los mejores</label>
            <input id="final" type="checkbox" className="switch" checked={final} onChange={(e) => setFinal(e.target.checked)} />
          </div>
        </>
      )}

      {game.sides === 'either' && (format === 'knockout' || format === 'league') && (
        <ChoiceGroup
          className="segmented"
          label="Cómo se juega"
          value={byTeams}
          onChange={setByTeams}
          options={[
            { value: false, content: 'Individual' },
            { value: true, content: `Por equipos de ${teamSize}` },
          ]}
        />
      )}

      <section>
        <h2>
          Participantes <span className="muted small">{entrants.length} {byTeams ? 'equipos' : 'inscriptos'}</span>
        </h2>
        <PlayerPicker players={players} selected={selected} onToggle={toggle} label="Participantes" />
        {byTeams && entrants.length > 0 && (
          <div className="teams-preview">
            <span>
              {entrants.map((e, i) => (
                <span key={i} className="block">
                  <b>Equipo {i + 1}:</b> {e.players.map(nameOf).join(' & ')}
                </span>
              ))}
            </span>
            <button className="link-btn" onClick={() => setOrder([...selected].sort(() => Math.random() - 0.5))}>
              <ShuffleIcon className="inline-icon" /> Mezclar equipos
            </button>
          </div>
        )}
        {leftover > 0 && (
          <p className="error">
            {leftover === 1 ? 'Sobra 1 jugador' : `Sobran ${leftover} jugadores`}: cada equipo es de {teamSize}. Sumá o sacá jugadores para completarlos.
          </p>
        )}
        {seriesTooMany && <p className="error">En partida acumulada juegan todos juntos: elegí hasta {game.players.max} jugadores.</p>}
      </section>

      {game.options.length > 0 && (
        <section className="card">
          <h2>Reglas de las partidas</h2>
          <OptionsEditor game={game} value={config} onChange={setConfig} />
        </section>
      )}

      <div className="field">
        <label htmlFor="prize">Premio o castigo (opcional)</label>
        <input id="prize" className="input" placeholder="El último lava los platos 🍽️" value={prize} onChange={(e) => setPrize(e.target.value)} maxLength={120} />
      </div>

      <div className="sticky-actions">
        <button className="btn primary big block" disabled={!ready} onClick={create}>
          <TrophyIcon /> {ready ? 'Crear torneo' : missing}
        </button>
      </div>
    </div>
  )
}
