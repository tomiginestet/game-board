import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, TeamAvatar } from '../components/Avatar'
import { GameBadge } from '../components/GameBits'
import { LevelIcon } from '../components/icons'
import { gameOrMissing, plural, UNKNOWN_PLAYER, useGames, usePlayerMap } from '../lib/hooks'
import { beltOf, computeBoard, levelFor, periodStart, winRate, type GlobalStats } from '../lib/stats'
import { useData } from '../lib/store'

type Tab = 'gloria' | 'wins' | 'elo' | 'allround' | 'belts'
type Period = 'all' | 'year' | 'month' | 'week'

const TABS: { id: Tab; name: string; help: string }[] = [
  { id: 'gloria', name: '✨ Gloria', help: 'Puntos por cada partida: más por ganar, por mesas grandes y por juegos largos.' },
  { id: 'wins', name: '🏆 Victorias', help: 'Partidas ganadas sumando todos los juegos.' },
  { id: 'elo', name: '📈 ELO por juego', help: 'El nivel de cada uno en un juego: sube más si le ganás a alguien mejor.' },
  { id: 'allround', name: '🧰 Todoterreno', help: 'En cuántos juegos distintos ganaste alguna vez.' },
  { id: 'belts', name: '🥊 Cinturones', help: 'Quién tiene el cinturón de cada juego: se lo saca el que le gana.' },
]

const PERIODS: { id: Period; name: string }[] = [
  { id: 'all', name: 'Siempre' },
  { id: 'year', name: 'Este año' },
  { id: 'month', name: 'Este mes' },
  { id: 'week', name: 'Esta semana' },
]

export function Ranking() {
  const data = useData()
  const players = usePlayerMap()
  const games = useGames()
  const [tab, setTab] = useState<Tab>('gloria')
  const [period, setPeriod] = useState<Period>('all')
  const board = useMemo(() => computeBoard(data, { since: periodStart(period) }), [data, period])
  const playedGames = useMemo(() => games.filter((g) => board.views.some((v) => v.gameId === g.id)), [games, board])
  const [gameId, setGameId] = useState<string | undefined>(undefined)
  const eloGame = gameId ?? playedGames[0]?.id

  const all = [...board.players.values()].filter((s) => s.played > 0)
  const sorted: { s: GlobalStats; value: string; sub: string }[] = (() => {
    if (tab === 'gloria')
      return all
        .sort((a, b) => b.gloria - a.gloria || b.wins - a.wins)
        .map((s) => ({ s, value: `✨ ${s.gloria}`, sub: `${plural(s.played, 'partida', 'partidas')} · ${s.wins} ganadas` }))
    if (tab === 'wins')
      return all
        .sort((a, b) => b.wins - a.wins || winRate(b) - winRate(a))
        .map((s) => ({ s, value: String(s.wins), sub: `${Math.round(winRate(s) * 100)}% de ${s.played} · racha máx. ${s.bestStreak}` }))
    if (tab === 'allround')
      return all
        .sort((a, b) => b.gamesWon - a.gamesWon || b.gamesPlayed - a.gamesPlayed)
        .map((s) => ({ s, value: `${s.gamesWon}`, sub: `ganó en ${plural(s.gamesWon, 'juego', 'juegos')} de ${s.gamesPlayed} que jugó` }))
    return []
  })()

  const eloRows = eloGame
    ? all
        .map((s) => s.perGame.get(eloGame))
        .filter((x) => !!x && x.played > 0)
        .sort((a, b) => b!.elo - a!.elo)
    : []

  return (
    <div className="page">
      <h1>Ranking</h1>
      <div className="chips scroll">
        {TABS.map((t) => (
          <button key={t.id} className={'chip' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>
            {t.name}
          </button>
        ))}
      </div>
      <div className="segmented small mt">
        {PERIODS.map((p) => (
          <button key={p.id} className={period === p.id ? 'active' : ''} onClick={() => setPeriod(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <p className="hint">{TABS.find((t) => t.id === tab)?.help}</p>

      {tab === 'elo' && (
        <div className="chips scroll">
          {playedGames.map((g) => (
            <button key={g.id} className={'chip' + (eloGame === g.id ? ' active' : '')} onClick={() => setGameId(g.id)}>
              {g.emoji} {g.name}
            </button>
          ))}
        </div>
      )}

      {!board.views.length && <div className="empty">No hay partidas en este período.</div>}

      <div className="list ranking">
        {tab === 'elo'
          ? eloRows.map((s, i) => {
              const p = players.get(s!.playerId) ?? UNKNOWN_PLAYER
              return (
                <Link key={p.id} to={`/jugadores/${p.id}?juego=${eloGame}`} className="card rank-row">
                  <span className="rank-pos">{i + 1}</span>
                  <Avatar player={p} size={36} />
                  <span className="grow">
                    <b>{p.name}</b>
                    <span className="muted small block">
                      {levelFor(s!.elo).name} · {s!.wins}G {s!.losses}P
                    </span>
                  </span>
                  <span className="rank-value">
                    <LevelIcon icon={levelFor(s!.elo).icon} /> {s!.elo}
                  </span>
                </Link>
              )
            })
          : tab === 'belts'
            ? playedGames.map((g) => {
                const belt = beltOf(board.views, g.id)
                if (!belt) return null
                return (
                  <Link key={g.id} to={`/juegos/${g.id}`} className="card rank-row">
                    <GameBadge game={gameOrMissing(data, g.id)} size={36} />
                    <span className="grow">
                      <b>{belt.holders.map((id) => players.get(id)?.name ?? '?').join(' & ')}</b>
                      <span className="muted small block">
                        {g.name} · {plural(belt.defenses, 'defensa', 'defensas')}
                      </span>
                    </span>
                    <TeamAvatar team={belt.holders.map((id) => players.get(id) ?? UNKNOWN_PLAYER)} size={32} />
                  </Link>
                )
              })
            : sorted.map(({ s, value, sub }, i) => {
                const p = players.get(s.playerId) ?? UNKNOWN_PLAYER
                return (
                  <Link key={p.id} to={`/jugadores/${p.id}`} className="card rank-row">
                    <span className="rank-pos">{i + 1}</span>
                    <Avatar player={p} size={36} />
                    <span className="grow">
                      <b>{p.name}</b>
                      <span className="muted small block">{sub}</span>
                    </span>
                    <span className="rank-value">{value}</span>
                  </Link>
                )
              })}
      </div>
    </div>
  )
}
