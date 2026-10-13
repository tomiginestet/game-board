import { ArrowLeftIcon, CrownIcon, GiftIcon, LockIcon, PlayIcon, ShuffleIcon, TrashIcon } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeamAvatar } from '../components/Avatar'
import { GameBadge, PlayRow } from '../components/GameBits'
import { bracketRounds, cupChampion, cupEntrantName, cupStandings, tableRounds, type BracketSlot } from '../lib/cups'
import { confirmAction } from '../lib/feedback'
import { CUP_FORMATS, type GameDef } from '../lib/games/schema'
import { gameOrMissing, UNKNOWN_PLAYER, usePlayerMap } from '../lib/hooks'
import { roundName } from '../lib/pingpong/tournament'
import { actions, useData } from '../lib/store'
import type { Cup, Id, Play, Player } from '../lib/types'

export function CupDetail() {
  const { id } = useParams()
  const data = useData()
  const cup = data.cups.find((c) => c.id === id)
  if (!cup) {
    return (
      <div className="page">
        <p>Torneo no encontrado.</p>
        <Link to="/torneos" className="back">
          <ArrowLeftIcon /> Torneos
        </Link>
      </div>
    )
  }
  return <CupView cup={cup} game={gameOrMissing(data, cup.gameId)} />
}

function CupView({ cup, game }: { cup: Cup; game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const players = usePlayerMap()
  const plays = useMemo(() => data.plays.filter((p) => p.cupId === cup.id).sort((a, b) => (a.round ?? 0) - (b.round ?? 0) || (a.slot ?? 0) - (b.slot ?? 0)), [data.plays, cup.id])
  const nameOf = (id: Id) => players.get(id)?.name ?? '?'
  const entrantName = (i: number | null | undefined) => (i === null ? 'Libre' : i === undefined ? 'Por definir' : cupEntrantName(cup, i, nameOf))
  const entrantTeam = (i: number): Player[] => cup.entrants[i]?.players.map((id) => players.get(id) ?? UNKNOWN_PLAYER) ?? []
  const lowWins = !!game.scoring.lowWins
  const champion = cupChampion(cup, plays, lowWins)
  const standings = cup.format === 'knockout' ? [] : cupStandings(cup, plays, lowWins)
  const next = plays.find((p) => p.status !== 'finished')
  const formatName = CUP_FORMATS.find((f) => f.id === cup.format)?.name

  const remove = async () => {
    const ok = await confirmAction({
      title: `¿Borrar el torneo “${cup.name}”?`,
      detail: 'Se borran también todas sus partidas. No se puede deshacer.',
      confirmLabel: 'Borrar torneo',
      danger: true,
    })
    if (!ok) return
    actions.deleteCup(cup.id)
    navigate('/torneos')
  }

  return (
    <div className="page">
      <Link to="/torneos" className="back">
        <ArrowLeftIcon /> Torneos
      </Link>
      <header className="game-head">
        <GameBadge game={game} size={52} />
        <div className="grow">
          <h1>{cup.name}</h1>
          <p className="muted">
            {game.name} · {formatName} · {cup.entrants.length} inscriptos
          </p>
        </div>
      </header>

      {cup.prize && (
        <div className="card prize">
          <GiftIcon className="inline-icon" /> <b>En juego:</b> {cup.prize}
        </div>
      )}

      {champion !== undefined && (
        <div className="champion-banner">
          <CrownIcon weight="fill" size={36} />
          <span className="muted small">Ganó el torneo</span>
          <TeamAvatar team={entrantTeam(champion)} size={56} />
          <span className="champion-name">{entrantName(champion)}</span>
        </div>
      )}

      {next && champion === undefined && (
        <Link to={`/partida/${next.id}`} className="btn primary big block">
          <PlayIcon weight="fill" /> Próxima: {next.sides.map((s) => s.name ?? s.players.map(nameOf).join(' & ')).join(' vs ')}
        </Link>
      )}

      {cup.format === 'knockout' && <Bracket cup={cup} plays={plays} entrantName={entrantName} />}

      {standings.length > 0 && (
        <section>
          <h2>Tabla</h2>
          <div className="table-wrap">
            <table className="standings">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="left">{cup.entrants[0]?.players.length > 1 ? 'Equipo' : 'Jugador'}</th>
                  <th>
                    <abbr title="Partidas jugadas">PJ</abbr>
                  </th>
                  <th>
                    <abbr title="Victorias">V</abbr>
                  </th>
                  {cup.format === 'league' && (
                    <th>
                      <abbr title="Empates">E</abbr>
                    </th>
                  )}
                  <th>{cup.format === 'series' && standings.some((s) => s.score) ? 'Puntaje' : <abbr title="Puntos">Pts</abbr>}</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((r, i) => (
                  <tr key={r.entrant}>
                    <td>{i + 1}</td>
                    <td className="left">
                      <TeamAvatar team={entrantTeam(r.entrant)} size={22} /> {entrantName(r.entrant)}
                    </td>
                    <td>{r.played}</td>
                    <td>{r.wins}</td>
                    {cup.format === 'league' && <td>{r.draws}</td>}
                    <td>
                      <b>{cup.format === 'series' && standings.some((s) => s.score) ? r.score : r.points}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cup.format === 'tables' && <p className="hint">En cada mesa se suma un punto por cada rival que quedó atrás.</p>}
        </section>
      )}

      {cup.format === 'tables' && <TablesControls cup={cup} plays={plays} />}

      {cup.format !== 'knockout' && (
        <section>
          <h2>Partidas</h2>
          {groupByRound(plays).map(([round, list]) => (
            <div key={round} className="round-group">
              <h3 className="muted small">
                {cup.format === 'league' ? `Fecha ${round + 1}` : cup.format === 'series' ? `Partida ${round + 1}` : round === cup.rounds ? 'Mesa final' : `Ronda ${round + 1}`}
              </h3>
              <div className="list">
                {list.map((p) => (
                  <PlayRow key={p.id} play={p} game={game} players={players} showGame={false} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="row mt">
        {(cup.format === 'series' || cup.format === 'tables' || cup.format === 'league') && (
          <button className="btn grow" onClick={() => actions.closeCup(cup.id, !cup.closedAt)}>
            <LockIcon /> {cup.closedAt ? 'Reabrir torneo' : 'Cerrar torneo ahora'}
          </button>
        )}
        <button className="btn danger" onClick={remove}>
          <TrashIcon /> Borrar
        </button>
      </div>
    </div>
  )
}

function groupByRound(plays: Play[]): [number, Play[]][] {
  const m = new Map<number, Play[]>()
  for (const p of plays) m.set(p.round ?? 0, [...(m.get(p.round ?? 0) ?? []), p])
  return [...m.entries()].sort((a, b) => a[0] - b[0])
}

function TablesControls({ cup, plays }: { cup: Cup; plays: Play[] }) {
  const done = tableRounds(cup, plays).length
  const allFinished = plays.every((p) => p.status === 'finished')
  const hasFinal = plays.some((p) => p.round === cup.rounds)
  if (!allFinished) return null
  if (done < (cup.rounds ?? 1))
    return (
      <button className="btn primary block" onClick={() => actions.nextTablesRound(cup.id)}>
        <ShuffleIcon /> Armar ronda {done + 1} (mesas mezcladas)
      </button>
    )
  if (cup.final && !hasFinal)
    return (
      <button className="btn primary block" onClick={() => actions.nextTablesRound(cup.id)}>
        <CrownIcon /> Armar la mesa final
      </button>
    )
  return null
}

function Bracket({ cup, plays, entrantName }: { cup: Cup; plays: Play[]; entrantName: (i: number | null | undefined) => string }) {
  const navigate = useNavigate()
  const rounds = bracketRounds(cup, plays)
  const open = (slot: BracketSlot) => {
    if (slot.a === null || slot.b === null || slot.a === undefined || slot.b === undefined) return
    const p = slot.play ?? actions.ensureKnockoutPlay(cup.id, slot.round, slot.slot, slot.a, slot.b)
    navigate(`/partida/${p.id}`)
  }
  return (
    <section>
      <h2>Cuadro</h2>
      <div className="bracket">
        {rounds.map((round, r) => (
          <div key={r} className="bracket-round">
            <h3 className="muted small">{roundName(r, rounds.length)}</h3>
            <div className="bracket-slots">
              {round.map((slot) => {
                const playable = slot.a !== null && slot.b !== null && slot.a !== undefined && slot.b !== undefined
                const winnerA = slot.winner !== undefined && slot.winner === slot.a
                const winnerB = slot.winner !== undefined && slot.winner === slot.b
                const scores = slot.play?.result?.scores
                const ia = slot.play?.sides.findIndex((s) => s.players.join() === cup.entrants[slot.a ?? -1]?.players.join())
                return (
                  <button key={slot.slot} className="card bracket-card" disabled={!playable} onClick={() => open(slot)}>
                    <span className={'bk-line' + (winnerA ? ' win' : '')}>
                      {entrantName(slot.a)}
                      {scores && ia !== undefined && ia >= 0 && <b>{scores[ia]}</b>}
                    </span>
                    <span className={'bk-line' + (winnerB ? ' win' : '')}>
                      {entrantName(slot.b)}
                      {scores && ia !== undefined && ia >= 0 && <b>{scores[1 - ia]}</b>}
                    </span>
                    {playable && slot.winner === undefined && <span className="bk-detail muted small">{slot.play?.status === 'live' ? 'En juego' : 'Jugar'}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
