import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Avatar, TeamAvatar } from '../components/Avatar'
import { GameBadge } from '../components/GameBits'
import { gameOrMissing, plural, UNKNOWN_PLAYER, useGames, usePlayerMap } from '../lib/hooks'
import { beltOf, computeBoard, levelFor, periodStart, winRate, type GlobalStats } from '../lib/stats'
import { useData } from '../lib/store'
import { useAuth } from '../lib/auth'
import { globalRanking, userAsPlayer, type GlobalRow } from '../lib/social'
import { syncAvailable, useSyncState } from '../lib/sync'

type Tab = 'gloria' | 'wins' | 'elo' | 'allround' | 'belts'
type Period = 'all' | 'year' | 'month' | 'week'

const TABS: { id: Tab; name: string; help: string }[] = [
  { id: 'gloria', name: 'Gloria', help: 'Puntos por cada partida: más por ganar, por mesas grandes y por juegos largos.' },
  { id: 'wins', name: 'Victorias', help: 'Partidas ganadas sumando todos los juegos.' },
  { id: 'elo', name: 'Elo por juego', help: 'El nivel de cada uno en un juego: sube más si le ganás a alguien mejor.' },
  { id: 'allround', name: 'Todoterreno', help: 'En cuántos juegos distintos ganaste alguna vez.' },
  { id: 'belts', name: 'Cinturones', help: 'Quién tiene el cinturón de cada juego: se lo saca el que le gana.' },
]

const PERIODS: { id: Period; name: string }[] = [
  { id: 'all', name: 'Siempre' },
  { id: 'year', name: 'Este año' },
  { id: 'month', name: 'Este mes' },
  { id: 'week', name: 'Esta semana' },
]

export function Ranking() {
  const auth = useAuth()
  const sync = useSyncState()
  const [params, setParams] = useSearchParams()
  const canGlobal = syncAvailable && !!auth.session
  const scope = canGlobal && params.get('global') === '1' ? 'global' : 'group'
  return (
    <div className="page">
      <h1>Ranking</h1>
      {canGlobal && (
        <div className="segmented">
          <button className={scope === 'group' ? 'active' : ''} onClick={() => setParams({})}>
            {sync.club?.emoji ?? '👥'} {sync.club ? sync.club.name : 'Este dispositivo'}
          </button>
          <button className={scope === 'global' ? 'active' : ''} onClick={() => setParams({ global: '1' })}>
            🌎 Global
          </button>
        </div>
      )}
      {scope === 'global' ? <GlobalRanking /> : <GroupRanking />}
    </div>
  )
}

type GlobalTab = 'gloria' | 'wins' | 'allround'

/** Ranking de todas las cuentas, sumando las partidas de todos los grupos. */
function GlobalRanking() {
  const games = useGames()
  const myId = useAuth().session?.user.id
  const [tab, setTab] = useState<GlobalTab>('gloria')
  const [period, setPeriod] = useState<Period>('all')
  const [gameId, setGameId] = useState('')
  // Resultado de la última consulta, con la clave de los filtros que la pidieron.
  const [result, setResult] = useState<{ key: string; rows?: GlobalRow[]; error?: string } | null>(null)
  const key = `${period}|${gameId}`
  const rows = result?.key === key ? (result.rows ?? null) : null
  const error = result?.key === key ? (result.error ?? '') : ''

  useEffect(() => {
    let cancelled = false
    globalRanking(periodStart(period), gameId || undefined)
      .then((r) => !cancelled && setResult({ key: `${period}|${gameId}`, rows: r }))
      .catch((e) => !cancelled && setResult({ key: `${period}|${gameId}`, error: e instanceof Error ? e.message : String(e) }))
    return () => {
      cancelled = true
    }
  }, [period, gameId])

  const sorted = [...(rows ?? [])].sort((a, b) =>
    tab === 'wins' ? b.wins - a.wins || b.gloria - a.gloria : tab === 'allround' ? b.games_won - a.games_won || b.wins - a.wins : b.gloria - a.gloria || b.wins - a.wins,
  )

  return (
    <>
      <div className="chips scroll mt">
        {TABS.filter((t) => t.id === 'gloria' || t.id === 'wins' || t.id === 'allround').map((t) => (
          <button key={t.id} className={'chip' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id as GlobalTab)}>
            {t.name}
          </button>
        ))}
      </div>
      <div className="segmented small mt">
        {PERIODS.map((p) => (
          <button key={p.id} className={period === p.id ? 'active' : ''} aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <select className="input mt" value={gameId} onChange={(e) => setGameId(e.target.value)} aria-label="Juego">
        <option value="">Todos los juegos</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <p className="hint">Suma las partidas de todos los clubes y mano a mano. Sólo cuentan los jugadores que tienen cuenta (“este jugador soy yo”).</p>
      {error && <p className="error">{error}</p>}
      {rows === null && !error && <p className="muted">Cargando…</p>}
      {rows?.length === 0 && <div className="empty">Todavía no hay partidas de jugadores con cuenta en este período.</div>}
      <div className="list ranking">
        {sorted.map((r, i) => (
          <div key={r.user_id} className={'rank-row' + (r.user_id === myId ? ' me' : '')}>
            <span className="rank-pos">{i + 1}</span>
            <Avatar player={userAsPlayer(r)} size={36} />
            <span className="grow">
              <b>
                {r.display_name ?? r.username} {r.user_id === myId && <span className="muted small">(vos)</span>}
              </b>
              <span className="muted small block">
                {tab === 'allround'
                  ? `ganó en ${plural(r.games_won, 'juego', 'juegos')}`
                  : `${plural(r.played, 'partida', 'partidas')} · ${plural(r.wins, 'victoria', 'victorias')} · ${Math.round((r.wins / Math.max(1, r.played)) * 100)}%`}
                {` · ${plural(r.groups, 'club', 'clubes')}`}
              </span>
            </span>
            <span className="rank-value num">
              {tab === 'wins' ? r.wins : tab === 'allround' ? r.games_won : (
                <>
                  {r.gloria}
                  <span className="sr-only"> de gloria</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function GroupRanking() {
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
  const sorted: { s: GlobalStats; value: string; sub: string; mid: string }[] = (() => {
    if (tab === 'gloria')
      return all
        .sort((a, b) => b.gloria - a.gloria || b.wins - a.wins)
        .map((s) => ({ s, value: `${s.gloria}`, mid: `${s.wins}/${s.played}`, sub: `${plural(s.played, 'partida', 'partidas')} · ${plural(s.wins, 'victoria', 'victorias')}` }))
    if (tab === 'wins')
      return all
        .sort((a, b) => b.wins - a.wins || winRate(b) - winRate(a))
        .map((s) => ({ s, value: String(s.wins), mid: `${Math.round(winRate(s) * 100)}%`, sub: `${Math.round(winRate(s) * 100)}% de ${s.played} · racha máx. ${s.bestStreak}` }))
    if (tab === 'allround')
      return all
        .sort((a, b) => b.gamesWon - a.gamesWon || b.gamesPlayed - a.gamesPlayed)
        .map((s) => ({ s, value: `${s.gamesWon}`, mid: `${s.gamesPlayed}`, sub: `ganó en ${plural(s.gamesWon, 'juego', 'juegos')} de ${s.gamesPlayed} que jugó` }))
    return []
  })()

  // Encabezados de la tabla: la columna del medio y la del valor cambian según la pestaña.
  const COLS: Record<Tab, [string, string]> = { gloria: ['V / P', 'Gloria'], wins: ['Efect.', 'Victorias'], allround: ['Jugó', 'Ganó en'], elo: ['V–D', 'Elo'], belts: ['', ''] }
  const [midHead, valueHead] = COLS[tab]
  const eloRows = eloGame
    ? all
        .map((s) => s.perGame.get(eloGame))
        .filter((x) => !!x && x.played > 0)
        .sort((a, b) => b!.elo - a!.elo)
    : []

  return (
    <>
      <div className="chips scroll mt">
        {TABS.map((t) => (
          <button key={t.id} className={'chip' + (tab === t.id ? ' active' : '')} aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
            {t.name}
          </button>
        ))}
      </div>
      <div className="segmented small mt">
        {PERIODS.map((p) => (
          <button key={p.id} className={period === p.id ? 'active' : ''} aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      {tab === 'elo' && (
        <div className="chips scroll">
          {playedGames.map((g) => (
            <button key={g.id} className={'chip' + (eloGame === g.id ? ' active' : '')} aria-pressed={eloGame === g.id} onClick={() => setGameId(g.id)}>
              {g.name}
            </button>
          ))}
        </div>
      )}

      {!board.views.length && (
        <div className="empty">
          {period === 'all' ? (
            <>
              <p>Todavía no hay partidas anotadas. Cuando terminen la primera, acá se arma la tabla.</p>
              <Link to="/juegos" className="btn primary">
                Anotar una partida
              </Link>
            </>
          ) : (
            <p>No hubo partidas en este período. Probá con uno más largo.</p>
          )}
        </div>
      )}

      <div className={'list ranking' + (tab === 'belts' ? '' : ' rank-table')}>
        {tab !== 'belts' && (sorted.length > 0 || (tab === 'elo' && eloRows.length > 0)) && (
          <div className="rank-head" aria-hidden>
            <span>#</span>
            <span />
            <span>Jugador</span>
            <span>{midHead}</span>
            <span>{valueHead}</span>
          </div>
        )}
        {tab === 'elo'
          ? eloRows.map((s, i) => {
              const p = players.get(s!.playerId) ?? UNKNOWN_PLAYER
              return (
                <Link key={p.id} to={`/jugadores/${p.id}?juego=${eloGame}`} className={'rank-row' + (i === 0 ? ' first' : '')}>
                  <span className="rank-pos">{i + 1}</span>
                  <Avatar player={p} size={32} />
                  <span className="rank-who">
                    <b>{p.name}</b>
                    <span className="muted small block">{levelFor(s!.elo).name}</span>
                  </span>
                  <span className="rank-mid">
                    {s!.wins}–{s!.losses}
                  </span>
                  <span className="rank-value">{s!.elo}</span>
                </Link>
              )
            })
          : tab === 'belts'
            ? playedGames.map((g) => {
                const belt = beltOf(board.views, g.id)
                if (!belt) return null
                return (
                  <Link key={g.id} to={`/juegos/${g.id}`} className="rank-row">
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
            : sorted.map(({ s, value, sub, mid }, i) => {
                const p = players.get(s.playerId) ?? UNKNOWN_PLAYER
                return (
                  <Link key={p.id} to={`/jugadores/${p.id}`} className={'rank-row' + (i === 0 ? ' first' : '')}>
                    <span className="rank-pos">{i + 1}</span>
                    <Avatar player={p} size={32} />
                    <span className="rank-who">
                      <b>{p.name}</b>
                    </span>
                    <span className="rank-mid">
                      {mid}
                      <span className="sr-only">. {sub}</span>
                    </span>
                    <span className="rank-value">
                      {value}
                      <span className="sr-only"> {valueHead.toLowerCase()}</span>
                    </span>
                  </Link>
                )
              })}
      </div>
      {/* Cómo se calcula, al pie y chico: la tabla va primero. */}
      <p className="hint">{TABS.find((t) => t.id === tab)?.help}</p>
    </>
  )
}
