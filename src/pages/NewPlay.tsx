import { PlayIcon, ScalesIcon, ShieldIcon, ShuffleIcon, UserIcon, UsersIcon, XIcon } from '@phosphor-icons/react'
import { Fragment, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Stepper } from '../components/ConfigEditor'
import { GameBadge } from '../components/GameBits'
import { OptionsEditor } from '../components/OptionsEditor'
import { StakePicker } from '../components/StakePicker'
import { ChoiceGroup, PlayerPicker } from '../components/PlayerPicker'
import { defaultConfig } from '../lib/engine'
import type { GameDef, OptionValue } from '../lib/games/schema'
import { plural, useBoard, useGame } from '../lib/hooks'
import { balanceTeams, ratingIn, teamAverage, winChance } from '../lib/balance'
import { findGame } from '../lib/games'
import { isTeamGame } from '../lib/teams'
import { callPeople, goingIds, isCall } from '../lib/calls'
import { groupingOf, lastPlayOf, previewParts, rematchConfig, rematchSides, setupProblem, suggestGrouping, type Grouping } from '../lib/rematch'
import { actions, useData } from '../lib/store'
import './newplay.css'
import type { Id, Play, PlaySide, PlayStake, Team } from '../lib/types'
import { mayCreateNow } from '../lib/access'
import { say } from '../skins/say'

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
  if (!game) return <div className="page">{say('Juego no encontrado.')}</div>
  return <Setup key={game.id} game={game} />
}

/** Cómo arranca el armado: con `?p=` (revancha desde un jugador) mandan esos; si no, la última partida de este juego. */
function initialSetup(game: GameDef, plays: Play[], exists: (id: Id) => boolean, asked: string | null, team?: Team) {
  if (team) {
    // "Jugar un partido" desde un equipo: arranca su plantel como el equipo 1.
    const selected = team.players.filter(exists).slice(0, game.players.max)
    return { selected, base: 'teams' as Grouping, teamOf: Object.fromEntries(selected.map((id) => [id, 0])) as Record<Id, number>, teamCount: 2, last: undefined, config: loadConfig(game), fixed: [team.id] as (Id | null)[] }
  }
  if (asked) {
    const selected = asked.split(',').filter(exists).slice(0, game.players.max)
    return { selected, base: groupingOf(game), teamOf: {}, teamCount: 2, last: undefined, config: loadConfig(game), fixed: [] as (Id | null)[] }
  }
  const last = lastPlayOf(plays, game.id)
  if (!last) return { selected: [], base: groupingOf(game), teamOf: {}, teamCount: 2, last: undefined, config: loadConfig(game), fixed: [] as (Id | null)[] }
  // Los mismos lados (sin roles), sin los jugadores que ya no están.
  const sides = rematchSides(last).map((s) => ({ ...s, players: s.players.filter(exists) }))
  const selected = [...new Set(sides.flatMap((s) => s.players))].slice(0, game.players.max)
  const teamOf: Record<Id, number> = {}
  sides.forEach((s, i) => s.players.forEach((id) => (teamOf[id] = i)))
  return { selected, base: groupingOf(game, last), teamOf, teamCount: Math.max(2, sides.length), last, config: rematchConfig(game, last), fixed: last.sides.map((s) => s.teamId ?? null) }
}

function Setup({ game }: { game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name)), [data.players])
  const board = useBoard()
  const rating = (id: Id) => ratingIn(board, id, game, (gid) => findGame(data, gid)?.category)
  // Desde una convocatoria: juegan los que dijeron que van (y los "capaz", si no alcanza), en equipos parejos.
  const [call] = useState(() => data.plays.find((p) => p.id === params.get('convocatoria') && isCall(p)))
  const [init] = useState(() => {
    if (call) {
      const people = callPeople(call, data.teams)
      const yes = goingIds(call, people)
      const going = yes.length >= Math.max(2, game.players.min) ? yes : goingIds(call, people, true)
      const base = initialSetup(game, [], (id) => data.players.some((p) => p.id === id), going.join(','))
      const teamOf: Record<Id, number> = {}
      if (game.sides !== 'individual' && game.sides !== 'coop' && base.selected.length >= 4)
        balanceTeams(base.selected, rating, 2).forEach((t, i) => t.forEach((id) => (teamOf[id] = i)))
      return { ...base, base: Object.keys(teamOf).length ? ('teams' as Grouping) : base.base, teamOf, config: { ...base.config, ...call.config } }
    }
    return initialSetup(game, data.plays, (id) => data.players.some((p) => p.id === id), params.get('p'), data.teams.find((t) => t.id === params.get('equipo')))
  })
  // Equipos fijos del club elegidos para cada columna (equipo 1, equipo 2...).
  const [fixed, setFixed] = useState<(Id | null)[]>(() => init.fixed.map((t) => (t && data.teams.some((x) => x.id === t) ? t : null)))
  const fixedTeam = (t: number) => (fixed[t] ? data.teams.find((x) => x.id === fixed[t]) : undefined)
  const clubTeams = isTeamGame(game) ? data.teams.filter((t) => !t.gameId || t.gameId === game.id) : []
  const fromLast = !!init.last
  const [selected, setSelected] = useState<Id[]>(init.selected)
  // `null`: el agrupamiento lo decide la app (el de la última partida, o equipos si "cada uno solo" no da).
  const [chosen, setChosen] = useState<Grouping | null>(null)
  const grouping = chosen ?? suggestGrouping(game, selected.length, init.base)
  const [teamOf, setTeamOf] = useState<Record<Id, number>>(init.teamOf)
  const [teamCount, setTeamCount] = useState(init.teamCount)
  const [config, setConfig] = useState(init.config)
  const [stake, setStake] = useState<PlayStake | undefined>()

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
    const named = (t: Id[]) => init.last?.sides.find((s) => s.name && !s.teamId && !s.role && s.players.length === t.length && t.every((id) => s.players.includes(id)))?.name
    return teams
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.length)
      .map(({ t, i }) => {
        const team = fixedTeam(i)
        if (team) return { players: t, name: team.name, teamId: team.id }
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
    if (!mayCreateNow()) return
    if (call) {
      // La convocatoria pasa a ser el partido: conserva el día, la cancha y quién confirmó.
      actions.startPending(call.id, sides, config)
      if (stake && grouping !== 'coop') actions.patchPlay(call.id, { stake })
      navigate(`/partida/${call.id}`, { replace: true })
      return
    }
    const p = actions.createPlay(game.id, sides, config, grouping === 'coop' ? undefined : stake)
    navigate(`/partida/${p.id}`, { replace: true })
  }

  const shuffleTeams = () => {
    const order = [...selected].sort(() => Math.random() - 0.5)
    setTeamOf(Object.fromEntries(order.map((id, i) => [id, i % teamCount])))
    setFixed([])
  }

  /** "Somos 10, armá dos equipos": parejos según el Elo de cada uno en este juego. */
  const balance = () => {
    const teams = balanceTeams(selected, rating, teamCount)
    const next: Record<Id, number> = {}
    teams.forEach((t, i) => t.forEach((id) => (next[id] = i)))
    setTeamOf(next)
    setFixed([])
  }

  /** Pone un equipo del club en la primera columna libre (o la reemplaza, si ya estaba). */
  const assignTeam = (team: Team) => {
    if (fixed.includes(team.id)) {
      setFixed(fixed.map((f) => (f === team.id ? null : f)))
      return
    }
    let t = Array.from({ length: teamCount }, (_, i) => i).find((i) => !fixed[i])
    if (t === undefined) t = teamCount - 1
    const roster = team.players.filter((id) => data.players.some((p) => p.id === id))
    const next = [...fixed]
    next[t] = team.id
    setFixed(next)
    setChosen('teams')
    setSelected((s) => [...s, ...roster.filter((id) => !s.includes(id))].slice(0, max))
    setTeamOf((o) => ({ ...o, ...Object.fromEntries(roster.map((id) => [id, t])) }))
  }

  const teamLists = Array.from({ length: teamCount }, (_, t) => selected.filter((id) => teamIndex(id) === t))
  const showStrength = grouping === 'teams' && selected.length >= 2 && teamLists.every((t) => t.length)
  const chance = showStrength && teamCount === 2 ? Math.round(winChance(teamLists[0], teamLists[1], rating) * 100) : undefined

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

      {clubTeams.length > 0 && (
        <section>
          <h2>
            <ShieldIcon className="inline-icon" /> Equipos del club
          </h2>
          <div className="chips" role="group" aria-label="Equipos del club">
            {clubTeams.map((t) => {
              const on = fixed.includes(t.id)
              return (
                <button key={t.id} type="button" className={'chip team-chip' + (on ? ' active' : '')} aria-pressed={on} onClick={() => assignTeam(t)} style={{ ['--tc' as string]: t.color }}>
                  <span aria-hidden="true">{t.emoji}</span> {t.name}
                </button>
              )
            })}
          </div>
          <p className="hint">Tocá un equipo para que juegue con su plantel. Si falta alguien, desmarcalo abajo.</p>
        </section>
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
            <p className="hint">{sameTeams ? say('Marcamos a los de la última partida, con los mismos equipos.') : say('Marcamos a los de la última partida.')}</p>
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
                <b className="team-col-head">
                  {fixedTeam(t) ? (
                    <>
                      <span aria-hidden="true">{fixedTeam(t)!.emoji}</span> <span className="ellipsis">{fixedTeam(t)!.name}</span>
                      <button type="button" className="icon-btn small" onClick={() => setFixed(fixed.map((f, i) => (i === t ? null : f)))} aria-label={`Sacar a ${fixedTeam(t)!.name} del equipo ${t + 1}`}>
                        <XIcon />
                      </button>
                    </>
                  ) : (
                    <>Equipo {t + 1}</>
                  )}
                </b>
                {showStrength && <span className="muted small">Elo {teamAverage(teamLists[t], rating)}</span>}
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
          {chance !== undefined && (
            <p className="balance-chance">
              Chances: <b>{chance}%</b> – <b>{100 - chance}%</b>
              {Math.abs(chance - 50) <= 5 ? ' · Bien parejo' : chance > 50 ? ` · Favorito el equipo 1` : ' · Favorito el equipo 2'}
            </p>
          )}
          <div className="row wrap">
            <button className="btn" onClick={balance} disabled={selected.length < teamCount}>
              <ScalesIcon className="inline-icon" /> Equipos parejos
            </button>
            <button className="link-btn" onClick={shuffleTeams}>
              <ShuffleIcon className="inline-icon" /> Equipos al azar
            </button>
          </div>
          {problem && selected.length >= 2 && <p className="error">{problem}.</p>}
        </section>
      )}

      {game.roles && <p className="hint">Los roles ({game.roles.join(' / ')}) se cargan al final, así nadie se entera antes.</p>}

      {game.options.length > 0 && (
        <section className="card">
          <h2>{say('Reglas de la partida')}</h2>
          <OptionsEditor game={game} value={config} onChange={setConfig} />
        </section>
      )}

      {/* En cooperativo se gana o se pierde todos juntos: no hay a quién tocarle la prenda. */}
      {grouping !== 'coop' && <StakePicker value={stake} onChange={setStake} sides={sides.length} />}

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
