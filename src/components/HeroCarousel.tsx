import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import type { GameDef } from '../lib/games/schema'
import { playPath } from '../pages/GameDetail'
import { HeroCard } from './GameCard'
import { say } from '../skins/say'

/** Carrusel grande de arriba: banners con scroll-snap, flechas y puntitos. */
export function HeroCarousel({ games, plays }: { games: GameDef[]; plays: Map<string, number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  if (!games.length) return null

  const go = (i: number) => {
    const el = ref.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let dist = Infinity
    Array.from(el.children).forEach((c, i) => {
      const card = c as HTMLElement
      const d = Math.abs(card.offsetLeft - el.offsetLeft + card.clientWidth / 2 - mid)
      if (d < dist) {
        dist = d
        best = i
      }
    })
    if (best !== active) setActive(best)
  }

  // Con el foco en la fila, las flechas del teclado pasan de juego en juego.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight') go(Math.min(games.length - 1, active + 1))
    else if (e.key === 'ArrowLeft') go(Math.max(0, active - 1))
    else return
    e.preventDefault()
  }

  return (
    <section className="hero-carousel" aria-roledescription="carrusel" aria-labelledby="hero-title">
      <h2 id="hero-title">Para jugar hoy</h2>
      <div className="hero-track" ref={ref} onScroll={onScroll} onKeyDown={onKeyDown} tabIndex={0} role="region" aria-label={say('Juegos para jugar hoy. Usá las flechas para pasar.')}>
        {games.map((g, i) => (
          <HeroCard key={g.id} game={g} playTo={playPath(g)} plays={plays.get(g.id)} index={i} total={games.length} />
        ))}
      </div>
      {games.length > 1 && (
        <div className="hero-nav">
          <button className="hero-arrow" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label={say('Juego anterior')}>
            <CaretLeftIcon aria-hidden />
          </button>
          <div className="hero-dots">
            {games.map((g, i) => (
              // Fuera del orden de tabulación: con teclado se pasa con las flechas.
              <button key={g.id} className={'hero-dot' + (i === active ? ' active' : '')} onClick={() => go(i)} aria-label={`Ver ${g.name}`} aria-current={i === active} tabIndex={-1} />
            ))}
          </div>
          <button className="hero-arrow" onClick={() => go(Math.min(games.length - 1, active + 1))} disabled={active === games.length - 1} aria-label={say('Juego siguiente')}>
            <CaretRightIcon aria-hidden />
          </button>
        </div>
      )}
    </section>
  )
}
