import { CalendarBlankIcon, MapPinIcon, PlusIcon, ShuffleIcon, TrashIcon, TrophyIcon } from '@phosphor-icons/react'
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
import type { CupEntrant, CupSchedule, Id } from '../lib/types'
import { fromLocalInput, nextWeekday, toLocalInput } from '../lib/schedule'
import { isTeamGame } from '../lib/teams'
import { say } from '../skins/say'

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
        <h2>{say('¿De qué juego?')}</h2>
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
  // Inscriptos: jugadores sueltos o equipos fijos del club.
  const clubTeams = isTeamGame(game) ? data.teams.filter((t) => (!t.gameId || t.gameId === game.id) && t.players.length) : []
  const [useClubTeams, setUseClubTeams] = useState(clubTeams.length >= 2)
  const [teamIds, setTeamIds] = useState<Id[]>([])
  // Fecha y cancha: el fixture con día, hora y lugar de cada partido.
  const [scheduled, setScheduled] = useState(false)
  const [start, setStart] = useState(() => toLocalInput(nextWeekday(new Date().getDay(), 20)))
  const [everyDays, setEveryDays] = useState(7)
  const [gap, setGap] = useState(60)
  const [venues, setVenues] = useState<string[]>(() => [clubTeams.find((t) => t.home)?.home ?? ''])

  const toggle = (id: Id) => {
    setOrder(null)
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const seq = order ?? selected
  const fromClub = useClubTeams && clubTeams.length > 0 && (format === 'knockout' || format === 'league')
  const entrants: CupEntrant[] = fromClub
    ? clubTeams.filter((t) => teamIds.includes(t.id)).map((t) => ({ players: t.players, name: t.name, teamId: t.id }))
    : byTeams
    ? Array.from({ length: Math.floor(seq.length / teamSize) }, (_, i) => ({ players: seq.slice(i * teamSize, (i + 1) * teamSize) }))
    : seq.map((id) => ({ players: [id] }))
  const nameOf = (id: Id) => data.players.find((p) => p.id === id)?.name ?? '?'

  const minEntrants = format === 'tables' ? Math.max(3, game.players.min) : format === 'series' ? Math.max(2, game.players.min) : 2
  const seriesTooMany = format === 'series' && entrants.length > game.players.max
  const leftover = byTeams && !fromClub ? seq.length % teamSize : 0
  const startAt = fromLocalInput(start)
  const canSchedule = format === 'league' || format === 'knockout' || format === 'series'
  const schedule: CupSchedule | undefined = scheduled && canSchedule && startAt ? { start: startAt, everyDays, gapMinutes: gap } : undefined
  const venueList = venues.map((v) => v.trim()).filter(Boolean)
  const ready = name.trim() && entrants.length >= minEntrants && !seriesTooMany && !leftover && (!scheduled || !canSchedule || !!startAt)
  // Qué falta para poder crear el torneo, dicho como lo que hay que hacer.
  const missing = !name.trim()
    ? 'Ponele un nombre al torneo'
    : scheduled && canSchedule && !startAt
      ? 'Elegí el día de la primera fecha'
      : fromClub
        ? 'Elegí al menos 2 equipos'
    : leftover
      ? 'Completá los equipos'
      : seriesTooMany
        ? `Elegí hasta ${game.players.max} jugadores`
        : `Elegí al menos ${plural(byTeams ? minEntrants * teamSize : minEntrants, 'jugador', 'jugadores')}`

  const create = () => {
    if (!ready) return
    const cup = actions.createCup({
      gameId: game.id,
      name,
      format,
      entrants,
      config,
      doubleRound,
      rounds,
      tableSize,
      final,
      prize,
      ...(schedule ? { schedule } : {}),
      ...(canSchedule && scheduled && venueList.length ? { venues: venueList } : {}),
    })
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
            {format === 'tables' ? 'Rondas' : say('Partidas')}
          </span>
          <Stepper value={rounds} min={1} max={20} onChange={setRounds} label={format === 'tables' ? 'Rondas' : say('Partidas')} />
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

      {clubTeams.length > 0 && (format === 'knockout' || format === 'league') && (
        <ChoiceGroup
          className="segmented"
          label="Quiénes se anotan"
          value={useClubTeams}
          onChange={setUseClubTeams}
          options={[
            { value: true, content: 'Equipos del club' },
            { value: false, content: 'Jugadores' },
          ]}
        />
      )}

      {fromClub ? (
        <section>
          <h2>
            Equipos <span className="muted small">{entrants.length} inscriptos</span>
          </h2>
          <div className="list" role="group" aria-label="Equipos inscriptos">
            {clubTeams.map((t) => {
              const on = teamIds.includes(t.id)
              return (
                <button key={t.id} type="button" className={'pick-row' + (on ? ' active' : '')} aria-pressed={on} onClick={() => setTeamIds((ids) => (on ? ids.filter((x) => x !== t.id) : [...ids, t.id]))}>
                  <span className="pick-pos">{on ? '✓' : ''}</span>
                  <span aria-hidden="true">{t.emoji}</span>
                  <span className="grow ellipsis">{t.name}</span>
                  <span className="muted small">{plural(t.players.length, 'jugador', 'jugadores')}</span>
                </button>
              )
            })}
          </div>
          <p className="hint">Cada partido usa el plantel del equipo; los que no van ese día se pueden sacar al jugarlo.</p>
        </section>
      ) : (
        <>
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
        </>
      )}

      {canSchedule && (
        <section className="card">
          <div className="field row-between">
            <label htmlFor="scheduled">
              <CalendarBlankIcon className="inline-icon" /> Fecha y cancha de cada partido
            </label>
            <input id="scheduled" type="checkbox" className="switch" checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
          </div>
          {!scheduled ? (
            <p className="hint">Armamos el fixture con día, hora y cancha. Después se puede cambiar partido por partido.</p>
          ) : (
            <>
              <div className="field">
                <label htmlFor={`${id}-start`}>{format === 'league' ? 'Primera fecha' : format === 'knockout' ? 'Primera ronda' : say('Primera partida')}</label>
                <input id={`${id}-start`} className="input" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor={`${id}-every`}>{format === 'league' ? 'Una fecha' : 'Una ronda'}</label>
                <select id={`${id}-every`} className="input" value={everyDays} onChange={(e) => setEveryDays(Number(e.target.value))}>
                  <option value={7}>Todas las semanas</option>
                  <option value={14}>Cada dos semanas</option>
                  <option value={3}>Cada tres días</option>
                  <option value={1}>Todos los días</option>
                  <option value={0}>Todo el mismo día</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">
                  <MapPinIcon className="inline-icon" /> Canchas
                </span>
                <div className="venue-list">
                  {venues.map((v, i) => (
                    <div key={i} className="row">
                      <input
                        className="input"
                        value={v}
                        maxLength={60}
                        placeholder={`Cancha ${i + 1}`}
                        aria-label={`Cancha ${i + 1}`}
                        onChange={(e) => setVenues(venues.map((x, k) => (k === i ? e.target.value : x)))}
                      />
                      {venues.length > 1 && (
                        <button type="button" className="icon-btn" aria-label={`Sacar la cancha ${i + 1}`} onClick={() => setVenues(venues.filter((_, k) => k !== i))}>
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}
                  {venues.length < 8 && (
                    <button type="button" className="link-btn" onClick={() => setVenues([...venues, ''])}>
                      <PlusIcon className="inline-icon" /> Sumar cancha
                    </button>
                  )}
                </div>
                <p className="hint">Los partidos de una misma fecha se reparten entre las canchas.</p>
              </div>
              <div className="field">
                <label htmlFor={`${id}-gap`}>Si hay más partidos que canchas, uno cada</label>
                <select id={`${id}-gap`} className="input" value={gap} onChange={(e) => setGap(Number(e.target.value))}>
                  {[30, 45, 60, 90, 120].map((m) => (
                    <option key={m} value={m}>
                      {m < 60 ? `${m} minutos` : m === 60 ? '1 hora' : m === 90 ? '1 hora y media' : '2 horas'}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </section>
      )}

      {game.options.length > 0 && (
        <section className="card">
          <h2>{say('Reglas de las partidas')}</h2>
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
