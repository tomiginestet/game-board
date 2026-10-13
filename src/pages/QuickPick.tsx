import { CaretRightIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { pickGames } from '../lib/games'
import type { GameDef } from '../lib/games/schema'
import { useBoard, useGames } from '../lib/hooks'
import { useData } from '../lib/store'
import { playPath } from './GameDetail'
import './quickpick.css'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const DAY = 86_400_000

/** "hoy", "ayer", "hace 3 días", "hace 2 semanas"… contado en días de calendario. */
function ago(ts: number, now = Date.now()): string {
  const start = (t: number) => new Date(t).setHours(0, 0, 0, 0)
  const days = Math.round((start(now) - start(ts)) / DAY)
  if (days < 7) return rtf.format(-days, 'day')
  if (days < 30) return rtf.format(-Math.floor(days / 7), 'week')
  if (days < 365) return rtf.format(-Math.floor(days / 30), 'month')
  return rtf.format(-Math.floor(days / 365), 'year')
}

function playersRange(g: GameDef) {
  const { min, max } = g.players
  return min === max ? `${min} ${min === 1 ? 'jugador' : 'jugadores'}` : `${min} a ${max} jugadores`
}

/**
 * Anotar una partida: elegir el juego y caer directo en el armado.
 * Arriba lo que el club ya juega (lo último primero), después sus juegos propios y el resto de la A a la Z.
 */
export function QuickPick() {
  const data = useData()
  const board = useBoard()
  const games = useGames()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // En el teléfono no se abre el teclado solo: taparía los juegos del club, que son el camino corto.
  // Con mouse y teclado sí conviene arrancar escribiendo.
  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) inputRef.current?.focus()
  }, [])

  const lastPlayed = useMemo(() => {
    const last = new Map<string, number>()
    for (const v of board.views) last.set(v.gameId, Math.max(last.get(v.gameId) ?? 0, v.at))
    return last
  }, [board.views])

  const clubGames = pickGames(data, [...lastPlayed.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id))
  const custom = games.filter((g) => g.source && g.source !== 'builtin' && !lastPlayed.has(g.id))

  const query = norm(q)
  const results = query
    ? games
        .filter((g) => norm(g.name + ' ' + g.tagline).includes(query))
        // Primero los que coinciden por nombre; entre ellos, los que el club jugó más recientemente.
        .sort((a, b) => Number(norm(b.name).includes(query)) - Number(norm(a.name).includes(query)) || (lastPlayed.get(b.id) ?? 0) - (lastPlayed.get(a.id) ?? 0))
    : []

  // Enter con algo escrito: se va al primer resultado.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (results[0]) navigate(playPath(results[0]))
  }

  const row = (g: GameDef) => <GameRow key={g.id} game={g} last={lastPlayed.get(g.id)} />

  return (
    <div className="page qp-page">
      <h1 className="qp-title">¿Qué juegan?</h1>

      <form className="qp-search" role="search" onSubmit={onSubmit}>
        <label htmlFor="qp-q">Buscar juego</label>
        <div className="search">
          <MagnifyingGlassIcon aria-hidden />
          <input
            ref={inputRef}
            id="qp-q"
            className="input"
            type="search"
            placeholder="Ej.: truco, catán, generala"
            autoComplete="off"
            enterKeyHint="go"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </form>
      <p className="sr-only" aria-live="polite">
        {query ? (results.length ? `${results.length} ${results.length === 1 ? 'juego' : 'juegos'}` : 'No hay juegos con ese nombre') : ''}
      </p>

      {query ? (
        results.length > 0 ? (
          <ul className="qp-list" aria-label="Resultados">
            {results.map(row)}
          </ul>
        ) : (
          <section className="qp-empty" aria-labelledby="qp-empty-title">
            <h2 id="qp-empty-title">No está en el catálogo</h2>
            <p className="muted">Agregalo y queda listo para anotar, con ranking y medallas.</p>
            <Link to={`/juegos/nuevo?nombre=${encodeURIComponent(q.trim())}`} className="btn primary block">
              <PlusIcon aria-hidden /> Agregar “{q.trim()}”
            </Link>
          </section>
        )
      ) : (
        <>
          {clubGames.length > 0 && (
            <section aria-labelledby="qp-club">
              <h2 id="qp-club">Del club</h2>
              <ul className="qp-list" aria-labelledby="qp-club">
                {clubGames.map(row)}
              </ul>
            </section>
          )}
          {custom.length > 0 && (
            <section aria-labelledby="qp-custom">
              <h2 id="qp-custom">Hechos por el club</h2>
              <ul className="qp-list" aria-labelledby="qp-custom">
                {custom.map(row)}
              </ul>
            </section>
          )}
          <section aria-labelledby="qp-all">
            <h2 id="qp-all">Todos</h2>
            <ul className="qp-list" aria-labelledby="qp-all">
              {games.map(row)}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

function GameRow({ game, last }: { game: GameDef; last?: number }) {
  return (
    <li>
      <Link to={playPath(game)} className="qp-row">
        <GameBadge game={game} size={36} />
        <span className="qp-text">
          <span className="qp-name">{game.name}</span>
          <span className="qp-meta">
            {playersRange(game)}
            {last !== undefined && <> · jugado {ago(last)}</>}
          </span>
        </span>
        <CaretRightIcon className="qp-caret" aria-hidden />
      </Link>
    </li>
  )
}
