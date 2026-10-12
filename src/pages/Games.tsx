import { MagnifyingGlassIcon, PlusIcon, SparkleIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GameBadge } from '../components/GameBits'
import { CATEGORIES, type Category } from '../lib/games/schema'
import { useBoard, useGames } from '../lib/hooks'

/** Biblioteca: todos los juegos, por categoría, con buscador. */
export function Games() {
  const games = useGames()
  const board = useBoard()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Category | 'all' | 'mine'>('all')

  const played = useMemo(() => {
    const m = new Map<string, number>()
    for (const v of board.views) m.set(v.gameId, (m.get(v.gameId) ?? 0) + 1)
    return m
  }, [board.views])

  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const list = games.filter((g) => {
    if (q && !norm(g.name + ' ' + g.tagline).includes(norm(q))) return false
    if (cat === 'mine') return played.has(g.id) || g.source !== 'builtin'
    return cat === 'all' || g.category === cat
  })

  return (
    <div className="page">
      <div className="section-head">
        <h1>Juegos</h1>
        <Link to="/juegos/nuevo" className="btn primary small">
          <PlusIcon /> Agregar
        </Link>
      </div>

      <label className="search">
        <MagnifyingGlassIcon />
        <input className="input" placeholder="Buscar juego…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>

      <div className="chips scroll">
        <button className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => setCat('all')}>
          Todos
        </button>
        <button className={'chip' + (cat === 'mine' ? ' active' : '')} onClick={() => setCat('mine')}>
          ⭐ Del grupo
        </button>
        {CATEGORIES.filter((c) => games.some((g) => g.category === c.id)).map((c) => (
          <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => setCat(c.id)}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="game-grid">
        {list.map((g) => (
          <Link key={g.id} to={`/juegos/${g.id}`} className="game-card" style={{ ['--gc' as string]: g.color }}>
            <GameBadge game={g} size={48} />
            <b className="ellipsis">{g.name}</b>
            <span className="muted small">
              {g.players.min === g.players.max ? g.players.min : `${g.players.min}–${g.players.max}`} jug.
              {played.get(g.id) ? ` · ${played.get(g.id)} partidas` : ''}
            </span>
            {g.source === 'ai' && (
              <span className="pill tiny">
                <SparkleIcon /> IA
              </span>
            )}
            {g.source === 'custom' && <span className="pill tiny">Del grupo</span>}
          </Link>
        ))}
      </div>
      {!list.length && (
        <div className="empty">
          No encontramos “{q}”.{' '}
          <Link to={`/juegos/nuevo?nombre=${encodeURIComponent(q)}`}>Agregalo a la biblioteca</Link>.
        </div>
      )}
    </div>
  )
}
