import { PlayIcon, ShuffleIcon, UserIcon, UsersIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Stepper } from '../components/ConfigEditor'
import { GameBadge } from '../components/GameBits'
import { OptionsEditor } from '../components/OptionsEditor'
import { ChoiceGroup, PlayerPicker } from '../components/PlayerPicker'
import { defaultConfig } from '../lib/engine'
import type { GameDef, OptionValue } from '../lib/games/schema'
import { plural, useGame } from '../lib/hooks'
import { actions, useData } from '../lib/store'
import type { Id, PlaySide } from '../lib/types'

const lastConfigKey = (gameId: string) => `gb-last-config-${gameId}`

function loadConfig(game: GameDef): Record<string, OptionValue> {
  const base = defaultConfig(game)
  try {
    const raw = localStorage.getItem(lastConfigKey(game.id))
    if (raw) return { ...base, ...JSON.parse(raw) }
  } catch {
    // ignorar
  }
  return base
}

export function NewPlay() {
  const { gameId } = useParams()
  const game = useGame(gameId)
  if (!gameId || gameId === 'pingpong') return <Navigate to="/ping-pong/nuevo" replace />
  if (!game) return <div className="page">Juego no encontrado.</div>
  return <Setup key={game.id} game={game} />
}

/** Cómo se arman los lados: cada uno por su cuenta, por equipos o todos juntos (cooperativo). */
type Grouping = 'solo' | 'teams' | 'coop'

function Setup({ game }: { game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name)), [data.players])
  const initialGrouping: Grouping = game.sides === 'coop' ? 'coop' : game.sides === 'teams' ? 'teams' : 'solo'
  const [grouping, setGrouping] = useState<Grouping>(initialGrouping)
  const [selected, setSelected] = useState<Id[]>(() => (params.get('p') ?? '').split(',').filter((id) => data.players.some((p) => p.id === id)))
  const [teamOf, setTeamOf] = useState<Record<Id, number>>({})
  const [teamCount, setTeamCount] = useState(2)
  const [config, setConfig] = useState(() => loadConfig(game))

  const max = game.players.max
  const toggle = (id: Id) =>
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id)
      if (s.length >= max) return [...s.slice(1), id]
      return [...s, id]
    })

  // Equipos: si no se eligió a mano, se reparten en orden (1, 2, 1, 2...) como en el truco.
  const teamIndex = (id: Id) => teamOf[id] ?? selected.indexOf(id) % teamCount
  const sides: PlaySide[] = (() => {
    if (grouping === 'coop') return [{ players: selected }]
    if (grouping === 'solo') return selected.map((id) => ({ players: [id] }))
    const teams: Id[][] = Array.from({ length: teamCount }, () => [])
    for (const id of selected) teams[teamIndex(id)]?.push(id)
    return teams.filter((t) => t.length).map((t) => ({ players: t }))
  })()

  const minPlayers = Math.max(game.players.min, grouping === 'coop' ? 1 : 2)
  const enoughSides = grouping === 'coop' ? sides.length === 1 : sides.length >= 2
  const fixedTeam = grouping === 'teams' && game.teamSize && game.sides === 'teams' ? game.teamSize : undefined
  const balanced = !fixedTeam || sides.every((s) => s.players.length === fixedTeam)
  const ready = selected.length >= minPlayers && enoughSides && balanced
  const nameOf = (id: Id) => data.players.find((p) => p.id === id)?.name ?? '?'

  const start = () => {
    if (!ready) return
    try {
      localStorage.setItem(lastConfigKey(game.id), JSON.stringify(config))
    } catch {
      // ignorar
    }
    const p = actions.createPlay(game.id, sides, config)
    navigate(`/partida/${p.id}`, { replace: true })
  }

  const shuffleTeams = () => {
    const order = [...selected].sort(() => Math.random() - 0.5)
    setTeamOf(Object.fromEntries(order.map((id, i) => [id, i % teamCount])))
  }

  const badge = (id: Id) => {
    const i = selected.indexOf(id)
    if (i < 0) return undefined
    if (grouping === 'teams') return `Equipo ${teamIndex(id) + 1}`
    if (grouping === 'solo' && game.mode === 'turns') return `${i + 1}°`
    return undefined
  }

  return (
    <div className="page">
      <header className="game-head">
        <GameBadge game={game} size={52} />
        <div>
          <h1>{game.name}</h1>
          <p className="muted">{game.tagline}</p>
        </div>
      </header>

      {game.sides === 'either' && (
        <ChoiceGroup
          className="segmented"
          label="Cómo se juega"
          value={grouping}
          onChange={setGrouping}
          options={[
            {
              value: 'solo',
              content: (
                <>
                  <UserIcon /> Cada uno solo
                </>
              ),
            },
            {
              value: 'teams',
              content: (
                <>
                  <UsersIcon /> Por equipos
                </>
              ),
            },
          ]}
        />
      )}

      <section>
        <h2>
          ¿Quiénes juegan?{' '}
          <span className="muted small">
            {game.players.min === game.players.max ? plural(game.players.min, 'jugador', 'jugadores') : `de ${game.players.min} a ${game.players.max}`}
            {game.mode === 'turns' && grouping === 'solo' ? ' · en orden de turno' : ''}
          </span>
        </h2>
        <PlayerPicker players={players} selected={selected} onToggle={toggle} badge={badge} />
      </section>

      {grouping === 'teams' && selected.length > 0 && (
        <section className="card">
          <div className="section-head">
            <h2>Equipos</h2>
            {!fixedTeam && <Stepper value={teamCount} min={2} max={Math.max(2, Math.min(8, selected.length))} onChange={setTeamCount} label="Cantidad de equipos" />}
          </div>
          <div className="teams-grid">
            {Array.from({ length: teamCount }, (_, t) => (
              <div key={t} className="team-col">
                <b>Equipo {t + 1}</b>
                {selected
                  .filter((id) => teamIndex(id) === t)
                  .map((id) => (
                    <button
                      key={id}
                      className="chip"
                      onClick={() => setTeamOf({ ...teamOf, [id]: (teamIndex(id) + 1) % teamCount })}
                      title="Tocá para cambiar de equipo"
                      aria-label={`${nameOf(id)}: pasar al equipo ${((teamIndex(id) + 1) % teamCount) + 1}`}
                    >
                      {nameOf(id)}
                    </button>
                  ))}
              </div>
            ))}
          </div>
          <p className="hint">Tocá a alguien para pasarlo al otro equipo.</p>
          <button className="link-btn" onClick={shuffleTeams}>
            <ShuffleIcon className="inline-icon" /> Equipos al azar
          </button>
          {!balanced && <p className="error">Cada equipo tiene que tener {fixedTeam} jugadores.</p>}
        </section>
      )}

      {game.roles && <p className="hint">Los roles ({game.roles.join(' / ')}) se cargan al final, así nadie se entera antes.</p>}

      {game.options.length > 0 && (
        <section className="card">
          <h2>Reglas de la partida</h2>
          <OptionsEditor game={game} value={config} onChange={setConfig} />
        </section>
      )}

      <div className="sticky-actions">
        <button className="btn primary big block" disabled={!ready} onClick={start}>
          {ready ? (
            <>
              <PlayIcon weight="fill" /> ¡A jugar!
            </>
          ) : selected.length < minPlayers ? (
            `Elegí al menos ${plural(minPlayers, 'jugador', 'jugadores')}`
          ) : !balanced ? (
            `Armá equipos de ${fixedTeam} jugadores`
          ) : (
            'Repartí los jugadores en al menos 2 equipos'
          )}
        </button>
      </div>
    </div>
  )
}
