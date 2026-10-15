import { ArrowLeftIcon, ArrowRightIcon, CrownIcon, PencilSimpleIcon, SparkleIcon, TrashIcon, UserCircleCheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { ErrorText } from '../components/Feedback'
import { GameBadge, PlayRow } from '../components/GameBits'
import { MatchRow } from '../components/MatchRow'
import { MedalsSection } from '../components/MedalsSection'
import { PlayerForm } from '../components/PlayerForm'
import { Sparkline } from '../components/Sparkline'
import { claimPlayer, useAuth } from '../lib/auth'
import { confirmAction, toast } from '../lib/feedback'
import { refreshGroups } from '../lib/social'
import { gameOrMissing, plural, useBoard, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { gameMedals, globalMedals } from '../lib/medals'
import { involves } from '../lib/pingpong/teams'
import { gameRanking, globalStatsOf, recentForm, winRate, type FormResult } from '../lib/stats'
import { actions, useData } from '../lib/store'
import { useSyncState } from '../lib/sync'
import { canDelete, canEdit, useAccess } from '../lib/access'
import { friendlyError } from '../lib/text'

export function PlayerDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const data = useData()
  const board = useBoard()
  const ppBoard = useLeaderboard()
  const players = usePlayerMap()
  const navigate = useNavigate()
  const auth = useAuth()
  const sync = useSyncState()
  const access = useAccess()
  const [editing, setEditing] = useState(false)
  const [claimMsg, setClaimMsg] = useState<string | null>(null)
  const [claimError, setClaimError] = useState('')
  const player = data.players.find((p) => p.id === id)

  const s = player ? globalStatsOf(board, player.id) : undefined
  const perGame = s ? [...s.perGame.values()].sort((a, b) => b.played - a.played) : []
  const gameId = params.get('juego') ?? perGame[0]?.gameId // '' = ninguno abierto

  if (!player || !s) {
    return (
      <div className="page">
        <p>Jugador no encontrado.</p>
        <Link to="/jugadores" className="back">
          <ArrowLeftIcon /> Volver
        </Link>
      </div>
    )
  }

  const gs = gameId ? s.perGame.get(gameId) : undefined
  // Puesto en el club de cada juego que jugó, y el juego donde mejor está parado.
  const ranks = new Map(
    perGame.map((x) => {
      const r = gameRanking(board, x.gameId)
      return [x.gameId, { pos: r.findIndex((y) => y.playerId === player.id) + 1, of: r.length }] as const
    }),
  )
  const best = perGame
    .filter((x) => gameOrMissing(data, x.gameId).mode !== 'coop' && (ranks.get(x.gameId)?.of ?? 0) > 1)
    .sort((a, b) => ranks.get(a.gameId)!.pos - ranks.get(b.gameId)!.pos || b.played - a.played)[0]
  const strongest = best && { name: gameOrMissing(data, best.gameId).name, ...ranks.get(best.gameId)! }
  // Torneos en los que está anotado (incluye los que siguen en juego).
  const cupsPlayed =
    data.cups.filter((c) => c.entrants.some((e) => e.players.includes(player.id))).length +
    data.tournaments.filter((t) => t.playerIds.includes(player.id)).length
  const game = gameId ? gameOrMissing(data, gameId) : undefined
  const position =
    [...board.players.values()].filter((x) => x.played > 0).sort((a, b) => b.gloria - a.gloria).findIndex((x) => x.playerId === player.id) + 1

  const history = [
    ...data.plays.filter((p) => p.status === 'finished' && p.sides.some((x) => x.players.includes(player.id))).map((p) => ({ k: 'play' as const, at: p.finishedAt ?? 0, p })),
    ...data.matches.filter((m) => m.status === 'finished' && involves(m, player.id)).map((m) => ({ k: 'match' as const, at: m.finishedAt ?? 0, m })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 10)

  const hasPlayed =
    data.matches.some((m) => involves(m, player.id)) ||
    data.tournaments.some((t) => t.playerIds.includes(player.id)) ||
    data.plays.some((p) => p.sides.some((x) => x.players.includes(player.id))) ||
    data.cups.some((c) => c.entrants.some((e) => e.players.includes(player.id)))

  const claim = async () => {
    if (!sync.club) return
    setClaimMsg(null)
    setClaimError('')
    try {
      await claimPlayer(sync.club.code, player.id)
      void refreshGroups().catch(() => {})
      setClaimMsg('¡Listo! Este jugador quedó asociado a tu cuenta.')
    } catch (e) {
      setClaimError(friendlyError(e))
    }
  }

  // Quien ya jugó no se puede borrar (el botón ni aparece); si cambió algo mientras se confirmaba, se avisa en vez de fallar callado.
  const remove = async () => {
    const ok = await confirmAction({ title: `¿Borrar a ${player.name}?`, detail: 'No se puede deshacer.', confirmLabel: 'Borrar jugador', danger: true })
    if (!ok) return
    if (actions.deletePlayer(player.id)) navigate('/jugadores')
    else toast(`No se puede borrar a ${player.name}: tiene partidas o torneos.`)
  }

  return (
    <div className="page">
      <Link to="/jugadores" className="back">
        <ArrowLeftIcon /> Jugadores
      </Link>

      {editing ? (
        <PlayerForm
          initial={player}
          submitLabel="Guardar"
          onSubmit={(v) => {
            actions.updatePlayer(player.id, v)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <header className="pd-head" style={{ ['--player-color' as string]: player.color }}>
          <Avatar player={player} size={72} />
          <div className="pd-id">
            <h1>{player.name}</h1>
            <p className="pd-sub">
              <SparkleIcon weight="fill" aria-hidden /> <b className="num">{s.gloria}</b> de gloria
              {position ? ` · ${position}º del club` : ''}
            </p>
          </div>
          {canEdit(access, 'player', player) && (
            <button className="btn pd-edit" onClick={() => setEditing(true)} aria-label={`Editar a ${player.name}`}>
              <PencilSimpleIcon />
            </button>
          )}
        </header>
      )}

      {s.played > 0 ? (
        <section className="pd-record" aria-label="Récord">
          {/* Un solo número protagonista: las victorias. Partidas y porcentaje son el mismo dato, leído en la barra. */}
          <p className="pd-big">
            <span className="num">{s.wins}</span> {s.wins === 1 ? 'victoria' : 'victorias'} en {plural(s.played, 'partida', 'partidas')}
          </p>
          <div className="pd-bar" aria-hidden>
            {s.wins > 0 && <i className="win" style={{ flexGrow: s.wins }} />}
            {s.draws > 0 && <i className="draw" style={{ flexGrow: s.draws }} />}
            {s.losses > 0 && <i className="loss" style={{ flexGrow: s.losses }} />}
          </div>
          <p className="pd-bar-labels num">
            <span className="win">{Math.round(winRate(s) * 100)}% ganadas</span>
            <span>
              {s.draws > 0 && `${plural(s.draws, 'empate', 'empates')} · `}
              {plural(s.losses, 'derrota', 'derrotas')}
            </span>
          </p>
          <FormStrip form={recentForm(board, player.id)} />
          <dl className="pd-ledger">
            <div>
              <dt>Racha actual</dt>
              <dd>
                {streakText(s.streak)} <small>· récord {s.bestStreak}</small>
              </dd>
            </div>
            {strongest && (
              <div>
                <dt>Juego fuerte</dt>
                <dd>
                  {strongest.name} <small>· {strongest.pos}º de {strongest.of}</small>
                </dd>
              </div>
            )}
            {cupsPlayed > 0 && (
              <div>
                <dt>Torneos ganados</dt>
                <dd>
                  {s.cupsWon} <small>· jugó {cupsPlayed}</small>
                </dd>
              </div>
            )}
          </dl>
        </section>
      ) : (
        <p className="muted">Todavía no jugó ninguna partida.</p>
      )}

      <MedalsSection title="Medallas generales" list={globalMedals(s)} playerName={player.name} />

      {perGame.length > 0 && (
        <section>
          <h2>Sus juegos</h2>
          {/* Una fila por juego, comparables en columna. Tocar una la abre con la curva de Elo y sus medallas abajo. */}
          <div className="pd-games num" role="list">
            <div className="pd-games-head" aria-hidden>
              <span>Juego</span>
              <span>V–D</span>
              <span>Puesto</span>
              <span>Elo</span>
            </div>
            {perGame.map((x) => {
              const g = gameOrMissing(data, x.gameId)
              const coop = g.mode === 'coop'
              const rank = ranks.get(x.gameId)
              const open = x.gameId === gameId
              return (
                <div key={x.gameId} role="listitem" className={'pd-game' + (open ? ' open' : '')}>
                  <button
                    type="button"
                    className="pd-game-row"
                    aria-expanded={open}
                    onClick={() => setParams(open ? { juego: '' } : { juego: x.gameId }, { replace: true })}
                  >
                    <span className="pd-game-name">
                      <GameBadge game={g} size={28} />
                      <span>{g.name}</span>
                    </span>
                    <span>{coop ? `${x.coopWins}/${x.played}` : `${x.wins}–${x.losses}${x.draws ? `–${x.draws}` : ''}`}</span>
                    <span className={rank?.pos === 1 ? 'first' : undefined}>
                      {coop || !rank ? '—' : (
                        <>
                          {rank.pos === 1 && <CrownIcon weight="fill" aria-label="Primero del club" />}
                          {rank.pos}º
                        </>
                      )}
                    </span>
                    <b>{coop ? '—' : x.elo}</b>
                  </button>
                  {open && (
                    <div className="pd-game-detail">
                      {!coop && x.eloHistory.length > 2 && <Sparkline values={x.eloHistory} height={48} />}
                      <p className="small muted">
                        {coop
                          ? `${plural(x.coopWins, 'victoria', 'victorias')} en equipo de ${plural(x.played, 'partida', 'partidas')}`
                          : `${Math.round(winRate(x) * 100)}% ganadas` +
                            (rank ? ` · ${rank.pos}º de ${rank.of} en el club` : '') +
                            (x.cupsWon ? ` · ${plural(x.cupsWon, 'torneo', 'torneos')}` : '')}
                      </p>
                      <Link to={`/juegos/${g.id}`} className="small">
                        Ver la ficha de {g.name} <ArrowRightIcon className="inline-icon" size="1em" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {gs && game && <MedalsSection title={`Medallas de ${game.name}`} list={gameMedals(game, gs, ppBoard.stats.get(player.id))} playerName={player.name} />}
        </section>
      )}

      {history.length > 0 && (
        <section>
          <h2>Últimas partidas</h2>
          <div className="list">
            {history.map((x) =>
              x.k === 'play' ? (
                <PlayRow key={x.p.id} play={x.p} game={gameOrMissing(data, x.p.gameId)} players={players} focus={player.id} />
              ) : (
                <MatchRow key={x.m.id} match={x.m} players={players} perspective={player.id} />
              ),
            )}
          </div>
        </section>
      )}

      {auth.session && sync.club && (
        <div className="card">
          <button className="btn block" onClick={claim}>
            <UserCircleCheckIcon /> Este jugador soy yo
          </button>
          {claimMsg && (
            <p className="small mt" role="status">
              {claimMsg}
            </p>
          )}
          <ErrorText>{claimError}</ErrorText>
        </div>
      )}

      {!hasPlayed && canDelete(access, 'player', player) && (
        <button className="btn danger block mt" onClick={remove}>
          <TrashIcon /> Borrar jugador
        </button>
      )}
    </div>
  )
}

function streakText(streak: number): string {
  if (streak > 0) return `${plural(streak, 'victoria', 'victorias')} al hilo`
  if (streak < 0) return `${plural(-streak, 'derrota', 'derrotas')} al hilo`
  return 'Sin racha'
}

const FORM_LETTER: Record<FormResult, string> = { win: 'G', loss: 'P', draw: 'E' }
const FORM_NAME: Record<FormResult, string> = { win: 'ganó', loss: 'perdió', draw: 'empató' }

/** Las últimas partidas como en la tabla de un torneo: G, P o E (letra además del color), la más nueva a la derecha. */
function FormStrip({ form }: { form: FormResult[] }) {
  if (form.length < 2) return null
  return (
    <div className="pd-form">
      <span className="pd-form-label">Forma</span>
      <ol aria-label={`Últimas ${form.length} partidas, de la más vieja a la más nueva: ${form.map((r) => FORM_NAME[r]).join(', ')}`}>
        {form.map((r, i) => (
          <li key={i} className={r + (i === form.length - 1 ? ' last' : '')} aria-hidden>
            {FORM_LETTER[r]}
          </li>
        ))}
      </ol>
    </div>
  )
}
