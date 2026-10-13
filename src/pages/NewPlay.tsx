import { PlayIcon, ShuffleIcon, UserIcon, UsersIcon } from '@phosphor-icons/react'
import { Fragment, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Stepper } from '../components/ConfigEditor'
import { GameBadge } from '../components/GameBits'
import { OptionsEditor } from '../components/OptionsEditor'
import { ChoiceGroup, PlayerPicker } from '../components/PlayerPicker'
import { defaultConfig } from '../lib/engine'
import type { GameDef, OptionValue } from '../lib/games/schema'
import { plural, useGame } from '../lib/hooks'
import { groupingOf, lastPlayOf, previewParts, rematchConfig, rematchSides, setupProblem, suggestGrouping, type Grouping } from '../lib/rematch'
import { actions, useData } from '../lib/store'
import './newplay.css'
import type { Id, Play, PlaySide } from '../lib/types'

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

/** Cómo arranca el armado: con `?p=` (revancha desde un jugador) mandan esos; si no, la última partida de este juego. */
function initialSetup(game: GameDef, plays: Play[], exists: (id: Id) => boolean, asked: string | null) {
  if (asked) {
    const selected = asked.split(',').filter(exists).slice(0, game.players.max)
    return { selected, base: groupingOf(game), teamOf: {}, teamCount: 2, last: undefined, config: loadConfig(game) }
  }
  const last = lastPlayOf(plays, game.id)
  if (!last) return { selected: [], base: groupingOf(game), teamOf: {}, teamCount: 2, last: undefined, config: loadConfig(game) }
  // Los mismos lados (sin roles), sin los jugadores que ya no están.
  const sides = rematchSides(last).map((s) => ({ ...s, players: s.players.filter(exists) }))
  const selected = [...new Set(sides.flatMap((s) => s.players))].slice(0, game.players.max)
  const teamOf: Record<Id, number> = {}
  sides.forEach((s, i) => s.players.forEach((id) => (teamOf[id] = i)))
  return { selected, base: groupingOf(game, last), teamOf, teamCount: Math.max(2, sides.length), last, config: rematchConfig(game, last) }
}

function Setup({ game }: { game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name)), [data.players])
  const [init] = useState(() => initialSetup(game, data.plays, (id) => data.players.some((p) => p.id === id), params.get('p')))
  const fromLast = !!init.last
  const [selected, setSelected] = useState<Id[]>(init.selected)
  // `null`: el agrupamiento lo decide la app (el de la última partida, o equipos si "cada uno solo" no da).
  const [chosen, setChosen] = useState<Grouping | null>(null)
  const grouping = chosen ?? suggestGrouping(game, selected.length, init.base)
  const [teamOf, setTeamOf] = useState<Record<Id, number>>(init.teamOf)
  const [teamCount, setTeamCount] = useState(init.teamCount)
  const [config, setConfig] = useState(init.config)

  const max = game.players.max
  const toggle = (id: Id) =>
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id)
      if (s.length >= max) return [...s.slice(1), id]
      return [...s, id]
    })

  // Equipos: los de la última partida o, si no se eligió a mano, en orden (1, 2, 1, 2...) como en el truco.
  const teamIndex = (id: Id) => {
    const t = teamOf[id]
    return t !== undefined && t < teamCount ? t : selected.indexOf(id) % teamCount
  }
  const sides: PlaySide[] = (() => {
    if (grouping === 'coop') return [{ players: selected }]
    if (grouping === 'solo') return selected.map((id) => ({ players: [id] }))
    const teams: Id[][] = Array.from({ length: teamCount }, () => [])
    for (const id of selected) teams[teamIndex(id)]?.push(id)
    // Un equipo que quedó igual que la última vez conserva su nombre.
    const named = (t: Id[]) => init.last?.sides.find((s) => s.name && !s.role && s.players.length === t.length && t.every((id) => s.players.includes(id)))?.name
    return teams.filter((t) => t.length).map((t) => {
      const name = named(t)
      return name ? { players: t, name } : { players: t }
    })
  })()

  const problem = setupProblem(game, grouping, sides)
  const ready = !problem
  const nameOf = (id: Id) => data.players.find((p) => p.id === id)?.name ?? '?'
  const preview = selected.length >= 2 ? previewParts(sides, grouping, nameOf) : undefined
  const sameTeams = fromLast && init.base === 'teams' && grouping === 'teams'

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
          onChange={setChosen}
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
        {fromLast && selected.length > 0 && (
          <div className="row-between">
            <p className="hint">{sameTeams ? 'Marcamos a los de la última partida, con los mismos equipos.' : 'Marcamos a los de la última partida.'}</p>
            <button className="link-btn no-shrink" onClick={() => setSelected([])}>
              Desmarcar a todos
            </button>
          </div>
        )}
        <PlayerPicker players={players} selected={selected} onToggle={toggle} badge={badge} />
      </section>

      {grouping === 'teams' && selected.length > 0 && (
        <section className="card">
          <div className="section-head">
            <h2>Equipos</h2>
            <Stepper value={teamCount} min={2} max={Math.max(2, Math.min(8, selected.length))} onChange={setTeamCount} label="Cantidad de equipos" />
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
          <p className="hint">{teamCount === 2 ? 'Tocá a alguien para pasarlo al otro equipo.' : 'Tocá a alguien para pasarlo al equipo siguiente.'}</p>
          <button className="link-btn" onClick={shuffleTeams}>
            <ShuffleIcon className="inline-icon" /> Equipos al azar
          </button>
          {problem && selected.length >= 2 && <p className="error">{problem}.</p>}
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
        {preview && (
          <p className="setup-preview">
            <span className="sr-only">Quedan así: </span>
            {preview.parts.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="setup-preview-sep"> {preview.sep} </span>}
                <span className="setup-preview-side">{part}</span>
              </Fragment>
            ))}
          </p>
        )}
        <button className="btn primary big block" disabled={!ready} onClick={start}>
          {ready ? (
            <>
              <PlayIcon weight="fill" /> ¡A jugar!
            </>
          ) : (
            problem
          )}
        </button>
      </div>
    </div>
  )
}
