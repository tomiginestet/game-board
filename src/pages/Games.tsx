import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CatalogCard } from '../components/GameCard'
import { HeroCarousel } from '../components/HeroCarousel'
import { todayGames, useClubGames } from '../lib/clubGames'
import { CATEGORIES, type Category } from '../lib/games/schema'
import { useGames } from '../lib/hooks'
import { useData } from '../lib/store'

type Filter = Category | 'all' | 'mine'
type Sort = 'az' | 'jugados' | 'recientes'

const SORTS: { id: Sort; name: string }[] = [
  { id: 'az', name: 'A–Z' },
  { id: 'jugados', name: 'Más jugados' },
  { id: 'recientes', name: 'Recientes del club' },
]

/** Juegos: "Para jugar hoy" (primero los del club) y el catálogo completo, con buscador, categorías y orden. */
export function Games() {
  const data = useData()
  const games = useGames()
  const club = useClubGames()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')

  const catParam = params.get('cat')
  const cat: Filter = catParam === 'mine' || CATEGORIES.some((c) => c.id === catParam) ? (catParam as Filter) : 'all'
  const sortParam = params.get('orden')
  const sort: Sort = SORTS.some((s) => s.id === sortParam) ? (sortParam as Sort) : 'az'

  // Filtro y orden viven en la URL: "Ver todo" desde el inicio llega ya filtrado y el botón Atrás los respeta.
  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const { played, last } = club
  const today = useMemo(() => todayGames(data, club), [data, club])
  const chosen = useMemo(() => new Set(club.chosen.map((g) => g.id)), [club.chosen])

  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const list = games.filter((g) => {
    if (q && !norm(g.name + ' ' + g.tagline).includes(norm(q))) return false
    if (cat === 'mine') return chosen.has(g.id) || played.has(g.id) || g.source !== 'builtin'
    return cat === 'all' || g.category === cat
  })
  if (sort === 'jugados') list.sort((a, b) => (played.get(b.id) ?? 0) - (played.get(a.id) ?? 0))
  if (sort === 'recientes') list.sort((a, b) => (last.get(b.id) ?? 0) - (last.get(a.id) ?? 0))

  const catName = cat === 'all' ? 'Todos los juegos' : cat === 'mine' ? 'Del club' : CATEGORIES.find((c) => c.id === cat)?.name

  return (
    <div className="page catalog-page">
      <h1 className="sr-only">Juegos</h1>
      <HeroCarousel games={today} plays={played} />

      <div className="section-head">
        <div>
          <h2 className="catalog-title">Catálogo</h2>
          <p className="muted small catalog-sub">
            {catName} · {list.length === 1 ? '1 juego' : `${list.length} juegos`}
          </p>
        </div>
        <Link to="/juegos/nuevo" className="btn primary small">
          <PlusIcon /> Agregar
        </Link>
      </div>

      <div className="catalog-tools">
        <label className="search">
          <MagnifyingGlassIcon />
          <input className="input" type="search" placeholder="Buscar juego…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar juego" />
        </label>
        <label className="catalog-sort">
          <select className="input" value={sort} onChange={(e) => setParam('orden', e.target.value === 'az' ? undefined : e.target.value)} aria-label="Ordenar">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chips scroll">
        <button className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => setParam('cat', undefined)} aria-pressed={cat === 'all'}>
          Todos
        </button>
        <button className={'chip' + (cat === 'mine' ? ' active' : '')} onClick={() => setParam('cat', 'mine')} aria-pressed={cat === 'mine'}>
          Del club
        </button>
        {CATEGORIES.filter((c) => games.some((g) => g.category === c.id)).map((c) => (
          <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => setParam('cat', c.id)} aria-pressed={cat === c.id}>
            {c.name}
          </button>
        ))}
      </div>

      {list.length > 0 && (
        <div className="catalog-grid">
          {list.map((g) => (
            <CatalogCard key={g.id} game={g} plays={played.get(g.id)} />
          ))}
        </div>
      )}
      {!list.length &&
        (q ? (
          <div className="empty">
            No encontramos “{q}”.{' '}
            <Link to={`/juegos/nuevo?nombre=${encodeURIComponent(q)}`}>Agregalo a la biblioteca</Link>.
          </div>
        ) : (
          <div className="empty">
            {cat === 'mine' ? 'Todavía no jugaron ni agregaron juegos.' : 'No hay juegos en esta categoría.'} <Link to="/juegos/nuevo">Agregá uno</Link>.
          </div>
        ))}
    </div>
  )
}
