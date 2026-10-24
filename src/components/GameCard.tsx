import { ArrowRightIcon, FireIcon, InfoIcon, PlayIcon, SparkleIcon, UsersIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { categoryName, playersLabel, WEIGHT_NAMES } from '../lib/games'
import type { GameDef } from '../lib/games/schema'
import { plural } from '../lib/hooks'
import { GameCover } from './GameCover'
import { say } from '../skins/say'

function SourcePill({ game }: { game: GameDef }) {
  if (game.source === 'ai')
    return (
      <span className="cc-pill ai">
        <SparkleIcon /> IA
      </span>
    )
  if (game.source === 'custom') return <span className="cc-pill mine">Del club</span>
  return null
}

/** Caja chica para los estantes horizontales (los juegos del club). */
export function ShelfCard({ game, plays, note }: { game: GameDef; plays?: number; note?: string }) {
  return (
    // El nombre está dibujado en la carátula: lo repetimos oculto para que el link se lea igual que se ve.
    <Link to={`/juegos/${game.id}`} className="shelf-card" style={{ ['--gc' as string]: game.color }}>
      <span className="cc-cover">
        <GameCover game={game} decorative />
        <SourcePill game={game} />
      </span>
      <span className="sr-only">{game.name}, </span>
      <span className="shelf-meta">
        <UsersIcon aria-hidden /> {playersLabel(game)}
        {plays ? (
          <b className="shelf-count">
            <span aria-hidden>·</span> <FireIcon weight="fill" aria-hidden /> <span className="num">{plays}</span>
            <span className="sr-only"> {plays === 1 ? say('partida') : say('partidas')}</span>
          </b>
        ) : note ? (
          <span>
            <span aria-hidden>·</span> {note}
          </span>
        ) : null}
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
          {plays ? <span className="cc-chip hot">{plural(plays, say('partida'), say('partidas'))}</span> : null}
        </span>
      </span>
    </Link>
  )
}

/** Tarjeta grande del carrusel "Para jugar hoy". */
export function HeroCard({ game, playTo, plays, index, total }: { game: GameDef; playTo: string; plays?: number; index: number; total: number }) {
  return (
    <article className="hero-card" style={{ ['--gc' as string]: game.color }} aria-roledescription="diapositiva" aria-label={`${index + 1} de ${total}: ${game.name}`}>
      <GameCover game={game} aspect="landscape" showTitle={false} decorative />
      <div className="hero-info">
        <h3 className="hero-name">{game.name}</h3>
        {game.tagline && <p className="hero-tagline">{game.tagline}</p>}
        <div className="hero-chips">
          {plays ? (
            <span className="cc-chip hot">
              <FireIcon weight="fill" aria-hidden /> {plural(plays, say('partida'), say('partidas'))} en el club
            </span>
          ) : null}
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
            <InfoIcon /> Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Estante horizontal con título y "Ver todo" (o la acción que se pase, como "Elegir"). */
export function Shelf({ title, subtitle, to, action, children }: { title: string; subtitle?: string; to?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="shelf">
      <div className="shelf-head">
        <div className="grow">
          <h2>{title}</h2>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        {action}
        {to && !action && (
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
