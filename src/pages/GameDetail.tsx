import { ArrowLeftIcon, ArrowRightIcon, CopyIcon, CrownIcon, PencilSimpleIcon, PlayIcon, ShieldIcon, SparkleIcon, TrashIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, TeamAvatar } from '../components/Avatar'
import { GameCover } from '../components/GameCover'
import { PlayRow } from '../components/GameBits'
import { LevelIcon } from '../components/icons'
import { MatchRow } from '../components/MatchRow'
import { MedalList, MedalListRow, RuleList } from '../components/MedalList'
import { confirmAction } from '../lib/feedback'
import { MedalSheet, type MedalHolder } from '../components/MedalSheet'
import { isBuiltin, playersLabel, WEIGHT_NAMES } from '../lib/games'
import { CATEGORIES, CUP_FORMATS, type GameDef, type PlayMode } from '../lib/games/schema'
import { formatDate, plural, UNKNOWN_PLAYER, useBoard, useGame, useLeaderboard, usePlayerMap } from '../lib/hooks'
import { gameMedals } from '../lib/medals'
import { isTeamGame } from '../lib/teams'
import { beltOf, gameStatsOf, levelFor, winRate } from '../lib/stats'
import { actions, useData } from '../lib/store'

export const MODE_NAMES: Record<PlayMode, string> = {
  rally: 'Marcador punto a punto',
  counter: 'Marcador en vivo',
  rounds: 'Por manos',
  turns: 'Por turnos, puntaje al final',
  result: 'Resultado final',
  coop: 'Cooperativo',
  sets: 'Por sets, punto a punto',
}

export function playPath(game: Pick<GameDef, 'id'>): string {
  return game.id === 'pingpong' ? '/ping-pong/nuevo' : `/jugar/${game.id}`
}

export function GameDetail() {
  const { id } = useParams()
  const game = useGame(id)
  if (!game) {
    return (
      <div className="page">
        <p>Juego no encontrado.</p>
        <Link to="/juegos" className="back">
          <ArrowLeftIcon /> Juegos
        </Link>
      </div>
    )
  }
  return <GameView key={game.id} game={game} />
}

/** "3 V 2 D 1 E · 50%" con las abreviaturas explicadas. */
export function WinLoss({ wins, losses, draws, rate }: { wins: number; losses: number; draws: number; rate: number }) {
  return (
    <>
      {wins}
      <abbr title="Victorias">V</abbr> {losses}
      <abbr title="Derrotas">D</abbr>
      {draws ? (
        <>
          {' '}
          {draws}
          <abbr title="Empates">E</abbr>
        </>
      ) : null}{' '}
      · {Math.round(rate * 100)}%
    </>
  )
}

function GameView({ game }: { game: GameDef }) {
  const data = useData()
  const navigate = useNavigate()
  const board = useBoard()
  const ppBoard = useLeaderboard()
  const players = usePlayerMap()
  const builtin = isBuiltin(game.id)

  const ranking = useMemo(
    () =>
      [...board.players.values()]
        .map((s) => s.perGame.get(game.id))
        .filter((s) => !!s && s.played > 0)
        .sort((a, b) => b!.elo - a!.elo || b!.wins - a!.wins) as NonNullable<ReturnType<typeof gameStatsOf>>[],
    [board, game.id],
  )
  const belt = beltOf(board.views, game.id)
  const playCount = useMemo(() => board.views.filter((v) => v.gameId === game.id).length, [board.views, game.id])
  const coop = game.mode === 'coop'

  // Para cada familia de medallas, cómo va cada jugador y quién llegó más alto.
  const leaders = useMemo(() => {
    return gameMedals(game, gameStatsOf(board, '', game.id)).map((fam, k) => {
      let best: { id: string; level: number; value: number } | undefined
      const all: MedalHolder[] = []
      for (const s of ranking) {
        const m = gameMedals(game, s, ppBoard.stats.get(s.playerId))[k]
        all.push({ name: players.get(s.playerId)?.name ?? UNKNOWN_PLAYER.name, level: m.level, value: m.value })
        if (m.level >= 0 && (!best || m.level > best.level || (m.level === best.level && m.value > best.value))) best = { id: s.playerId, level: m.level, value: m.value }
      }
      return { fam, best, all }
    })
  }, [game, board, ppBoard, ranking, players])
  const [sheet, setSheet] = useState<{ k: number; level: number } | null>(null)
  const sheetFam = sheet && leaders[sheet.k]

  const recentPlays =
    game.id === 'pingpong'
      ? []
      : data.plays
          .filter((p) => p.gameId === game.id)
          .sort((a, b) => (b.finishedAt ?? b.createdAt) - (a.finishedAt ?? a.createdAt))
          .slice(0, 5)
  const recentMatches =
    game.id === 'pingpong'
      ? [...data.matches].sort((a, b) => (b.finishedAt ?? b.createdAt) - (a.finishedAt ?? a.createdAt)).slice(0, 5)
      : []

  // Un juego con partidas o torneos no se puede borrar: se explica antes de preguntar nada.
  const inUse = data.plays.some((p) => p.gameId === game.id) || data.cups.some((c) => c.gameId === game.id)
  const remove = async () => {
    if (inUse) return
    const ok = await confirmAction({ title: `¿Borrar ${game.name} del catálogo?`, detail: 'No se puede deshacer.', confirmLabel: 'Borrar juego', danger: true })
    if (ok && actions.deleteGame(game.id)) navigate('/juegos')
  }

  return (
    <div className="page" style={{ ['--gc' as string]: game.color }}>
      <Link to="/juegos" className="back">
        <ArrowLeftIcon /> Catálogo
      </Link>
      <header className="gd-hero">
        <GameCover game={game} aspect="landscape" showTitle={false} className="gd-hero-cover" />
        <div className="gd-hero-info">
          <h1>{game.name}</h1>
          {game.tagline && <p className="gd-hero-tagline">{game.tagline}</p>}
          <div className="gd-hero-chips">
            <span className="cc-chip">
              <span aria-hidden>{CATEGORIES.find((c) => c.id === game.category)?.emoji}</span> {CATEGORIES.find((c) => c.id === game.category)?.name}
            </span>
            {game.source === 'custom' && <span className="cc-chip">Del club</span>}
            <span className="cc-chip">
              <UsersIcon aria-hidden /> {playersLabel(game, true)}
            </span>
            <span className="cc-chip">{MODE_NAMES[game.mode]}</span>
            {game.mode !== 'coop' && <span className="cc-chip">{WEIGHT_NAMES[game.weight]}</span>}
            {game.source === 'ai' && (
              <span className="cc-chip ai">
                <SparkleIcon aria-hidden /> Juego armado con IA
              </span>
            )}
            {playCount > 0 && <span className="cc-chip hot">{plural(playCount, 'partida', 'partidas')}</span>}
          </div>
        </div>
      </header>

      <div className="quick-actions">
        <Link to={playPath(game)} className="btn primary big">
          <PlayIcon weight="fill" /> Jugar
        </Link>
        {game.formats.length > 0 && (
          <Link to={game.id === 'pingpong' ? '/ping-pong/torneo/nuevo' : `/torneos/nuevo?juego=${game.id}`} className="btn big">
            <TrophyIcon /> Torneo
          </Link>
        )}
        {isTeamGame(game) && game.category === 'deporte' && (
          <Link to="/equipos" className="btn big">
            <ShieldIcon /> Equipos
          </Link>
        )}
      </div>

      {belt && (
        <div className="card belt">
          <span className="belt-icon" aria-hidden>
            🥊
          </span>
          <div className="grow">
            <span className="muted small">Cinturón de {game.name}</span>
            <b className="block">{belt.holders.map((id) => players.get(id)?.name ?? '?').join(' & ')}</b>
            <span className="muted small">
              Desde {formatDate(belt.since)} · {plural(belt.defenses, 'defensa', 'defensas')}
            </span>
          </div>
          <TeamAvatar team={belt.holders.map((id) => players.get(id) ?? UNKNOWN_PLAYER)} size={44} />
        </div>
      )}

      {ranking.length > 0 && (
        <section>
          <h2>Ranking</h2>
          <div className="list ranking">
            {ranking.slice(0, 10).map((s, i) => {
              const p = players.get(s.playerId) ?? UNKNOWN_PLAYER
              return (
                <Link key={s.playerId} to={`/jugadores/${s.playerId}?juego=${game.id}`} className="card rank-row">
                  <span className="rank-pos">{i + 1}</span>
                  <Avatar player={p} size={36} />
                  <span className="grow">
                    <b>{p.name}</b>
                    <span className="muted small block">
                      {coop
                        ? `${plural(s.coopWins, 'victoria', 'victorias')} de ${s.played}`
                        : <WinLoss wins={s.wins} losses={s.losses} draws={s.draws} rate={winRate(s)} />}
                    </span>
                  </span>
                  {!coop && (
                    <span className="rank-value">
                      <LevelIcon icon={levelFor(s.elo).icon} /> {s.elo}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {game.perPlayer?.scorer && ranking.some((s) => s.scored > 0) && (
        <section>
          <h2>Tabla de {game.perPlayer.unit ?? 'goleadores'}</h2>
          <div className="list ranking">
            {[...ranking]
              .filter((s) => s.scored > 0)
              .sort((a, b) => b.scored - a.scored || b.assists - a.assists)
              .slice(0, 10)
              .map((s, i) => {
                const p = players.get(s.playerId) ?? UNKNOWN_PLAYER
                return (
                  <Link key={s.playerId} to={`/jugadores/${s.playerId}?juego=${game.id}`} className="card rank-row">
                    <span className="rank-pos">{i + 1}</span>
                    <Avatar player={p} size={36} />
                    <span className="grow">
                      <b>{p.name}</b>
                      <span className="muted small block">
                        {plural(s.played, 'partido', 'partidos')}
                        {game.perPlayer?.assists && s.assists ? ` · ${plural(s.assists, 'asistencia', 'asistencias')}` : ''}
                        {s.mvps ? ` · ${s.mvps} ${s.mvps === 1 ? 'vez' : 'veces'} figura` : ''}
                      </span>
                    </span>
                    <span className="rank-value num">{s.scored}</span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>Medallas</h2>
          <Link to={`/medallas?juego=${game.id}`}>
            Vitrina <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        </div>
        <p className="muted small section-lead">Tocá una medalla para verla en grande y saber cómo se gana.</p>
        <MedalList>
          {leaders.map(({ fam, best }, k) => (
            <MedalListRow
              key={fam.family.id + fam.family.name}
              family={fam.family}
              openLevel={best ? Math.min(best.level + 1, fam.family.levels.length - 1) : 0}
              onOpen={(level) => setSheet({ k, level })}
              detail={
                best ? (
                  <span className="medal-card-leader">
                    <CrownIcon weight="fill" aria-hidden /> {players.get(best.id)?.name} · {fam.family.levels[best.level].name}
                  </span>
                ) : (
                  <span className="medal-card-leader none">Nadie la tiene todavía</span>
                )
              }
            />
          ))}
        </MedalList>
        {sheet && sheetFam && <MedalSheet family={sheetFam.fam.family} level={sheet.level} others={sheetFam.all} onClose={() => setSheet(null)} />}
      </section>

      {game.rules.length > 0 && (
        <section className="section-divided">
          <h2>Reglas en dos minutos</h2>
          <RuleList
            rules={game.rules}
            url={game.rulesUrl}
            footnote={game.formats.length > 0 && `Torneos: ${game.formats.map((f) => CUP_FORMATS.find((x) => x.id === f)?.name).join(', ')}.`}
          />
        </section>
      )}

      {(recentPlays.length > 0 || recentMatches.length > 0) && (
        <section>
          <h2>Últimas partidas</h2>
          <div className="list">
            {recentPlays.map((p) => (
              <PlayRow key={p.id} play={p} game={game} players={players} showGame={false} />
            ))}
            {recentMatches.map((m) => (
              <MatchRow key={m.id} match={m} players={players} />
            ))}
          </div>
        </section>
      )}

      <div className="row mt">
        {game.id !== 'pingpong' && (
          <Link to={builtin ? `/juegos/nuevo?copiar=${game.id}` : `/juegos/${game.id}/editar`} className="btn grow">
            {builtin ? (
              <>
                <CopyIcon /> Copiar y modificar
              </>
            ) : (
              <>
                <PencilSimpleIcon /> Editar juego
              </>
            )}
          </Link>
        )}
        {!builtin && (
          <button className="btn danger" onClick={remove} disabled={inUse} aria-describedby={inUse ? 'gd-delete-hint' : undefined}>
            <TrashIcon /> Borrar
          </button>
        )}
      </div>
      {!builtin && inUse && (
        <p id="gd-delete-hint" className="hint mt">
          Para borrarlo, primero borrá sus partidas y torneos.
        </p>
      )}
    </div>
  )
}
