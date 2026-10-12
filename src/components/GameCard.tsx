import { ArrowRightIcon, InfoIcon, PlayIcon, SparkleIcon, UsersIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { categoryName, playersLabel, WEIGHT_NAMES } from '../lib/games'
import type { GameDef } from '../lib/games/schema'
import { plural } from '../lib/hooks'
import { GameCover } from './GameCover'

function SourcePill({ game }: { game: GameDef }) {
  if (game.source === 'ai')
    return (
      <span className="cc-pill ai">
        <SparkleIcon /> IA
      </span>
    )
  if (game.source === 'custom') return <span className="cc-pill mine">Del grupo</span>
  return null
}

/** Caja chica para los estantes horizontales del inicio. */
export function ShelfCard({ game, plays, note }: { game: GameDef; plays?: number; note?: string }) {
  return (
    <Link to={`/juegos/${game.id}`} className="shelf-card" style={{ ['--gc' as string]: game.color }} aria-label={`${game.name}${plays ? `, ${plural(plays, 'partida', 'partidas')}` : ''}: ver ficha`}>
      <span className="cc-cover">
        <GameCover game={game} decorative />
        <SourcePill game={game} />
      </span>
      <span className="shelf-meta">
        <UsersIcon aria-hidden /> {playersLabel(game)}
        {plays ? <b className="shelf-count" title={plural(plays, 'partida', 'partidas')}>· 🔥 {plays}</b> : note ? <span>· {note}</span> : null}
      </span>
    </Link>
  )
}

/** Tarjeta del catálogo completo. */
export function CatalogCard({ game, plays }: { game: GameDef; plays?: number }) {
  return (
    <Link to={`/juegos/${game.id}`} className="catalog-card" style={{ ['--gc' as string]: game.color }}>
      <span className="cc-cover">
        <GameCover game={game} decorative />
        <SourcePill game={game} />
      </span>
      <span className="cc-body">
        <b className="cc-name">{game.name}</b>
        {game.tagline && <span className="cc-tagline">{game.tagline}</span>}
        <span className="cc-chips">
          <span className="cc-chip">{playersLabel(game)}</span>
          <span className="cc-chip">{categoryName(game)}</span>
          {plays ? <span className="cc-chip hot">{plural(plays, 'partida', 'partidas')}</span> : null}
        </span>
      </span>
    </Link>
  )
}

/** Tarjeta grande del carrusel de arriba del inicio. */
export function HeroCard({ game, playTo, plays, index, total }: { game: GameDef; playTo: string; plays?: number; index: number; total: number }) {
  return (
    <article className="hero-card" style={{ ['--gc' as string]: game.color }} aria-roledescription="diapositiva" aria-label={`${index + 1} de ${total}: ${game.name}`}>
      <GameCover game={game} aspect="landscape" showTitle={false} decorative />
      <div className="hero-info">
        <span className="hero-kicker">{plays ? `🔥 ${plural(plays, 'partida', 'partidas')} en el grupo` : 'Destacado'}</span>
        <h3 className="hero-name">{game.name}</h3>
        {game.tagline && <p className="hero-tagline">{game.tagline}</p>}
        <div className="hero-chips">
          <span className="cc-chip">
            <UsersIcon aria-hidden /> {playersLabel(game, true)}
          </span>
          <span className="cc-chip">{categoryName(game)}</span>
          <span className="cc-chip">{game.mode === 'coop' ? 'Cooperativo' : WEIGHT_NAMES[game.weight]}</span>
        </div>
        <div className="hero-actions">
          <Link to={playTo} className="btn primary">
            <PlayIcon weight="fill" /> Jugar
          </Link>
          <Link to={`/juegos/${game.id}`} className="btn hero-ghost">
            <InfoIcon /> Ver ficha
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Estante horizontal con título y "Ver todo". */
export function Shelf({ title, subtitle, to, children }: { title: string; subtitle?: string; to?: string; children: ReactNode }) {
  return (
    <section className="shelf">
      <div className="shelf-head">
        <div className="grow">
          <h2>{title}</h2>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="shelf-all">
            Ver todo <ArrowRightIcon className="inline-icon" size="1em" />
          </Link>
        )}
      </div>
      <div className="shelf-row">
        {children}
      </div>
    </section>
  )
}
