import { ArrowLeftIcon, CalendarBlankIcon, MapPinIcon, MegaphoneIcon, PencilSimpleIcon, PlayIcon, PlusIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'
import { useId, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PlayRow, playTitle } from '../components/GameBits'
import { NextMedals } from '../components/NextMedals'
import { SquadLeaders, SquadShowcase, useSquadMedals } from '../components/Squad'
import { ColorPicker, EmojiPicker } from '../components/PlayerForm'
import { ChoiceGroup, PlayerPicker } from '../components/PlayerPicker'
import { toast } from '../lib/feedback'
import { formatWhen } from '../lib/schedule'
import { gameOrMissing, plural, useGames, usePlayerMap } from '../lib/hooks'
import { actions, PLAYER_COLORS, useData } from '../lib/store'
import { isTeamGame, TEAM_EMOJIS, teamRecord } from '../lib/teams'
import type { Id, Team } from '../lib/types'

/** Escudo de un equipo: su emoji sobre su color. */
export function TeamCrest({ team, size = 44 }: { team: Pick<Team, 'emoji' | 'color' | 'name'>; size?: number }) {
  return (
    <span className="team-crest" style={{ width: size, height: size, fontSize: size * 0.55, ['--tc' as string]: team.color }} aria-hidden="true" title={team.name}>
      {team.emoji}
    </span>
  )
}

export function Teams() {
  const data = useData()
  const games = useGames()
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  return (
    <div className="page">
      <Link to="/jugadores" className="back">
        <ArrowLeftIcon /> Jugadores
      </Link>
      <div className="section-head">
        <h1>Equipos</h1>
        <Link to="/equipos/nuevo" className="btn primary">
          <PlusIcon /> Nuevo equipo
        </Link>
      </div>
      {!teams.length ? (
        <div className="empty">
          <p>
            <b>Todavía no hay equipos.</b>
          </p>
          <p className="muted">El fútbol 5 de los jueves, la pareja de pádel, los del vóley de la playa: armalos una vez y después jugás, anotás goleadores y armás ligas con ellos.</p>
          <Link to="/equipos/nuevo" className="btn primary mt">
            <PlusIcon /> Armar el primero
          </Link>
        </div>
      ) : (
        <div className="list rows">
          {teams.map((t) => {
            const rec = teamRecord(data, t)
            const game = t.gameId ? games.find((g) => g.id === t.gameId) : undefined
            return (
              <Link key={t.id} to={`/equipos/${t.id}`} className="player-row">
                <TeamCrest team={t} />
                <div className="grow">
                  <strong>{t.name}</strong>
                  <div className="muted small">
                    {game ? `${game.name} · ` : ''}
                    {plural(t.players.length, 'jugador', 'jugadores')} · {rec.wins}G {rec.draws}E {rec.losses}P
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function NewTeam() {
  const navigate = useNavigate()
  return (
    <div className="page">
      <Link to="/equipos" className="back">
        <ArrowLeftIcon /> Equipos
      </Link>
      <h1>Nuevo equipo</h1>
      <TeamForm
        submitLabel="Crear equipo"
        onSubmit={(t) => {
          const saved = actions.saveTeam(t)
          navigate(`/equipos/${saved.id}`, { replace: true })
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  )
}

export function TeamDetail() {
  const { id } = useParams()
  const data = useData()
  const team = data.teams.find((t) => t.id === id)
  if (!team) {
    return (
      <div className="page">
        <p>Equipo no encontrado.</p>
        <Link to="/equipos" className="back">
          <ArrowLeftIcon /> Equipos
        </Link>
      </div>
    )
  }
  return <TeamView key={team.id} team={team} />
}

function TeamView({ team }: { team: Team }) {
  const data = useData()
  const navigate = useNavigate()
  const players = usePlayerMap()
  const games = useGames()
  const [editing, setEditing] = useState(false)
  const rec = useMemo(() => teamRecord(data, team), [data, team])
  const game = team.gameId ? games.find((g) => g.id === team.gameId) : undefined
  const roster = team.players.map((id) => players.get(id)).filter((p) => !!p)
  const scorers = rec.scorers.filter((s) => s.scored || s.assists || s.mvps)
  const unit = game?.perPlayer?.unit ?? 'goles'
  const medals = useSquadMedals(team.players)

  const remove = () => {
    const removed = team
    actions.deleteTeam(team.id)
    navigate('/equipos')
    toast(`Borraste “${removed.name}”. Sus partidos quedan en el historial.`, { label: 'Deshacer', run: () => actions.restoreTeam(removed) })
  }

  if (editing) {
    return (
      <div className="page">
        <h1>Editar equipo</h1>
        <TeamForm
          initial={team}
          submitLabel="Guardar cambios"
          onSubmit={(t) => {
            actions.saveTeam({ ...team, ...t })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="page" style={{ ['--tc' as string]: team.color }}>
      <Link to="/equipos" className="back">
        <ArrowLeftIcon /> Equipos
      </Link>
      <header className="game-head">
        <TeamCrest team={team} size={56} />
        <div className="grow">
          <h1>{team.name}</h1>
          <p className="muted">
            {game ? `${game.name} · ` : ''}
            {plural(team.players.length, 'jugador', 'jugadores')}
            {team.home ? ` · de local en ${team.home}` : ''}
          </p>
        </div>
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Editar equipo">
          <PencilSimpleIcon />
        </button>
      </header>

      {/* Como el perfil: un número protagonista (victorias) con su barra, la forma y los tantos en una frase. */}
      {rec.played > 0 ? (
        <section className="pd-record" aria-label="Récord del equipo">
          <p className="pd-big">
            <span className="num">{rec.wins}</span> {rec.wins === 1 ? 'victoria' : 'victorias'} en {plural(rec.played, 'partido', 'partidos')}
          </p>
          <div className="pd-bar" aria-hidden>
            {rec.wins > 0 && <i className="win" style={{ flexGrow: rec.wins }} />}
            {rec.draws > 0 && <i className="draw" style={{ flexGrow: rec.draws }} />}
            {rec.losses > 0 && <i className="loss" style={{ flexGrow: rec.losses }} />}
          </div>
          <p className="pd-bar-labels num">
            <span className="win">{Math.round((rec.wins / rec.played) * 100)}% ganados</span>
            <span>
              {rec.draws > 0 && `${plural(rec.draws, 'empate', 'empates')} · `}
              {plural(rec.losses, 'derrota', 'derrotas')}
            </span>
          </p>
          {rec.form.length > 1 && (
            <div className="pd-form">
              <span className="pd-form-label">Forma</span>
              <ol aria-label={`Últimos ${rec.form.length} partidos, del más viejo al más nuevo: ${[...rec.form].reverse().map((r) => (r === 'G' ? 'ganó' : r === 'P' ? 'perdió' : 'empató')).join(', ')}`}>
                {[...rec.form].reverse().map((r, i, all) => (
                  <li key={i} className={(r === 'G' ? 'win' : r === 'P' ? 'loss' : 'draw') + (i === all.length - 1 ? ' last' : '')} aria-hidden>
                    {r}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {rec.scoreFor + rec.scoreAgainst > 0 && (
            <p className="team-score-line num">
              {(game?.perPlayer?.unit ?? 'tantos').replace(/^./, (c) => c.toUpperCase())}: {rec.scoreFor} a favor, {rec.scoreAgainst} en contra
            </p>
          )}
        </section>
      ) : (
        <p className="muted">Todavía no jugaron un partido.</p>
      )}

      {game && (
        <div className="row">
          <Link to={`/jugar/${game.id}?equipo=${team.id}`} className="btn primary big grow">
            <PlayIcon weight="fill" /> Jugar un partido
          </Link>
          <Link to={`/convocar/${game.id}?equipo=${team.id}`} className="btn big grow">
            <MegaphoneIcon /> Convocar
          </Link>
        </div>
      )}

      {rec.upcoming.length > 0 && (
        <section>
          <h2>Próximos partidos</h2>
          <div className="list">
            {rec.upcoming.slice(0, 5).map((p) => (
              <Link key={p.id} to={`/partida/${p.id}`} className="card fixture-row">
                <CalendarBlankIcon className="inline-icon" />
                <span className="grow">
                  <b>{playTitle(p, players, data.teams)}</b>
                  <span className="muted small block">
                    {p.scheduledAt ? formatWhen(p.scheduledAt) : p.status === 'live' ? 'En juego' : 'Sin fecha'}
                    {p.venue && (
                      <>
                        {' · '}
                        <MapPinIcon className="inline-icon" /> {p.venue}
                      </>
                    )}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SquadLeaders ids={team.players} title="Quién manda en el equipo" />
      <NextMedals playerIds={team.players} title="Medallas a la vista" />
      <SquadShowcase medals={medals.earned} title="Vitrina del plantel" />

      <section>
        <h2>Plantel</h2>
        {!roster.length ? (
          <p className="muted">Sin jugadores todavía. Tocá el lápiz para sumarlos.</p>
        ) : (
          <div className="table-wrap">
            <table className="standings">
              <thead>
                <tr>
                  <th className="left">Jugador</th>
                  <th>
                    <abbr title="Partidos jugados">PJ</abbr>
                  </th>
                  <th>{unit.charAt(0).toUpperCase() + unit.slice(1)}</th>
                  <th>
                    <abbr title="Asistencias">Asist.</abbr>
                  </th>
                  <th>
                    <abbr title="Veces que fue la figura">Figura</abbr>
                  </th>
                  <th>
                    <abbr title="Medallas ganadas">Med.</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roster.map((p) => {
                  const s = rec.scorers.find((x) => x.id === p.id)
                  return (
                    <tr key={p.id}>
                      <td className="left">
                        <Link to={`/jugadores/${p.id}`} className="plain-link">
                          <Avatar player={p} size={22} /> {p.name}
                        </Link>
                        {team.captain === p.id && (
                          <span className="captain-tag" title="Capitán">
                            C
                          </span>
                        )}
                      </td>
                      <td>{s?.played ?? 0}</td>
                      <td>{s?.scored || ''}</td>
                      <td>{s?.assists || ''}</td>
                      <td>{s?.mvps ? <StarIcon weight="fill" className="inline-icon mvp-star" aria-hidden="true" /> : null}{s?.mvps || ''}</td>
                      <td>{medals.won.get(p.id) || ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {scorers.length > 0 && scorers[0].scored > 0 && (
          <p className="hint">
            Goleador del equipo: <b>{players.get(scorers[0].id)?.name ?? '¿?'}</b> con {plural(scorers[0].scored, game?.perPlayer?.unitOne ?? 'gol', unit)}.
          </p>
        )}
      </section>

      {rec.finished.length > 0 && (
        <section>
          <h2>Partidos</h2>
          <div className="list">
            {rec.finished.slice(0, 10).map((p) => (
              <PlayRow key={p.id} play={p} game={gameOrMissing(data, p.gameId)} players={players} />
            ))}
          </div>
        </section>
      )}

      <button className="link-btn danger-text small center-block mt" onClick={remove}>
        <TrashIcon /> Borrar equipo
      </button>
    </div>
  )
}

type TeamInput = Omit<Team, 'id' | 'createdAt'>

function TeamForm({ initial, submitLabel, onSubmit, onCancel }: { initial?: Team; submitLabel: string; onSubmit: (t: TeamInput) => void; onCancel: () => void }) {
  const data = useData()
  const id = useId()
  const games = useGames().filter(isTeamGame)
  const players = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name, 'es')), [data.players])
  const [name, setName] = useState(initial?.name ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? TEAM_EMOJIS[0])
  const [color, setColor] = useState(initial?.color ?? PLAYER_COLORS[data.teams.length % PLAYER_COLORS.length])
  const [gameId, setGameId] = useState(initial?.gameId ?? '')
  const [roster, setRoster] = useState<Id[]>(initial?.players ?? [])
  const [captain, setCaptain] = useState<Id | ''>(initial?.captain ?? '')
  const [home, setHome] = useState(initial?.home ?? '')
  const trimmed = name.trim()
  const duplicate = data.teams.some((t) => t.id !== initial?.id && t.name.toLowerCase() === trimmed.toLowerCase())
  const ready = !!trimmed && !duplicate
  const nameOf = (pid: Id) => data.players.find((p) => p.id === pid)?.name ?? '?'

  return (
    <form
      className="team-form-body"
      onSubmit={(e) => {
        e.preventDefault()
        if (!ready) return
        onSubmit({
          name: trimmed,
          emoji,
          color,
          players: roster,
          ...(gameId ? { gameId } : {}),
          ...(captain && roster.includes(captain) ? { captain } : {}),
          ...(home.trim() ? { home: home.trim() } : {}),
        })
      }}
    >
      <div className="field">
        <label htmlFor={`${id}-name`}>Nombre</label>
        <input id={`${id}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Los Pibes del Jueves" autoFocus={!initial} aria-invalid={duplicate || undefined} />
        {duplicate && <p className="error small">Ya hay un equipo con ese nombre.</p>}
      </div>
      <EmojiPicker value={emoji} onChange={setEmoji} options={TEAM_EMOJIS} label="Escudo" />
      <ColorPicker value={color} onChange={setColor} />

      <div className="field">
        <label htmlFor={`${id}-game`}>Deporte</label>
        <select id={`${id}-game`} className="input" value={gameId} onChange={(e) => setGameId(e.target.value)}>
          <option value="">Cualquiera</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>
      </div>

      <section>
        <h2>
          Plantel <span className="muted small">{plural(roster.length, 'jugador', 'jugadores')}</span>
        </h2>
        <PlayerPicker players={players} selected={roster} onToggle={(pid) => setRoster((r) => (r.includes(pid) ? r.filter((x) => x !== pid) : [...r, pid]))} label="Plantel" />
      </section>

      {roster.length > 1 && (
        <div className="field">
          <span className="field-label" id={`${id}-cap`}>
            Capitán o capitana (opcional)
          </span>
          <ChoiceGroup
            className="chips"
            itemClassName="chip"
            labelledBy={`${id}-cap`}
            value={captain}
            onChange={setCaptain}
            options={[{ value: '' as Id | '', content: 'Nadie' }, ...roster.map((pid) => ({ value: pid as Id | '', content: nameOf(pid) }))]}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor={`${id}-home`}>Cancha de local (opcional)</label>
        <input id={`${id}-home`} className="input" value={home} onChange={(e) => setHome(e.target.value)} maxLength={60} placeholder="Club Social, cancha 3" />
      </div>

      <div className="row">
        <button type="button" className="btn grow" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn primary grow" disabled={!ready}>
          {trimmed ? submitLabel : 'Ponele un nombre'}
        </button>
      </div>
    </form>
  )
}
