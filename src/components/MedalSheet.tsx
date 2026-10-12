import { CaretLeftIcon, CaretRightIcon, CheckCircleIcon, CrownIcon, LockSimpleIcon, TargetIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { TIERS } from '../lib/medalArt'
import type { MedalFamily } from '../lib/medals'
import { Medal } from './Medal'

/** Progreso de alguien en la familia que se está mirando. */
export interface MedalHolder {
  name: string
  value: number
  /** Índice del nivel alcanzado, -1 si ninguno. */
  level: number
}

const tierOf = (i: number) => TIERS[Math.min(i, TIERS.length - 1)]

/**
 * Ficha de una medalla en grande: se abre con una animación y muestra la descripción,
 * qué hay que hacer para ganarla y cuánto falta. Con flechas se recorren los niveles.
 * `mine` es el progreso de un jugador (perfil, fin de partida); `others`, el de todo el grupo (ficha del juego).
 */
export function MedalSheet({
  family,
  level: initial,
  mine,
  others,
  onClose,
}: {
  family: MedalFamily
  level: number
  /** Sin nombre, la ficha le habla a quien la mira ("llevás"). */
  mine?: Omit<MedalHolder, 'name'> & { name?: string }
  others?: MedalHolder[]
  onClose: () => void
}) {
  const last = family.levels.length - 1
  const [level, setLevel] = useState(Math.min(Math.max(initial, 0), last))
  const closeRef = useRef<HTMLButtonElement>(null)
  const go = (i: number) => setLevel(Math.min(Math.max(i, 0), last))

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowLeft') go(level - 1)
    else if (e.key === 'ArrowRight') go(level + 1)
  }

  const l = family.levels[level]
  const tier = tierOf(level)
  const locked = mine ? mine.level < level : others ? !others.some((o) => o.level >= level) : false
  const holders = others?.filter((o) => o.level >= level).sort((a, b) => b.value - a.value)
  const closest = others?.filter((o) => o.level < level && o.value > 0).sort((a, b) => b.value - a.value)[0]

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet medal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Medalla ${l.name}`}
        style={{ ['--tier' as string]: tier.main === 'grad' ? '#B197FC' : tier.main, ['--tier-dark' as string]: tier.dark }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="row-between">
          <span className="medal-family">{family.name}</span>
          <button ref={closeRef} className="tool-btn" onClick={onClose} aria-label="Cerrar">
            <XIcon />
          </button>
        </div>

        <div className="ms-stage">
          <button className="ms-nav" onClick={() => go(level - 1)} disabled={level === 0} aria-label="Nivel anterior">
            <CaretLeftIcon weight="bold" />
          </button>
          {/* La key reinicia la animación de apertura en cada nivel. */}
          <div key={level} className={'ms-medal-wrap' + (locked ? ' locked' : '')}>
            <span className="ms-rays" aria-hidden />
            <span className="ms-medal">
              <Medal family={family} level={level} locked={locked} size={168} />
              {!locked && <span className="ms-shine" aria-hidden />}
            </span>
            {locked && (
              <span className="ms-lock" aria-hidden>
                <LockSimpleIcon weight="fill" />
              </span>
            )}
          </div>
          <button className="ms-nav" onClick={() => go(level + 1)} disabled={level === last} aria-label="Nivel siguiente">
            <CaretRightIcon weight="bold" />
          </button>
        </div>

        <div key={'t' + level} className="ms-text">
          <span className="ms-tier">
            {tier.name} · Nivel {tier.roman}
          </span>
          <h2>{l.name}</h2>
          <p className="ms-desc">{l.description}</p>
        </div>

        <div className="ms-box">
          <span className="sheet-title">
            <TargetIcon className="inline-icon" /> Cómo se gana
          </span>
          <p>
            {family.measures}: llegá a <b>{family.unit(l.at)}</b>.
          </p>
        </div>

        {mine && <Progress who={mine.name} value={mine.value} target={l.at} got={mine.level >= level} unit={family.unit} />}

        {others && (
          <div className="ms-box">
            <span className="sheet-title">
              <CrownIcon className="inline-icon" /> En el grupo
            </span>
            {holders && holders.length > 0 ? (
              <p>
                {holders.length === 1 ? 'La tiene ' : 'La tienen '}
                <b>{holders.map((h) => h.name).join(', ')}</b>.
              </p>
            ) : (
              <p className="muted">Nadie la tiene todavía. ¡Puede ser tuya!</p>
            )}
            {closest && (
              <p className="small muted">
                Más cerca de ganarla: {closest.name}, con {family.unit(closest.value)} (le {closest.value + 1 === l.at ? 'falta' : 'faltan'}{' '}
                {l.at - closest.value}).
              </p>
            )}
          </div>
        )}

        <ol className="ms-levels" aria-label="Niveles">
          {family.levels.map((x, i) => {
            const got = mine ? mine.level >= i : others ? others.some((o) => o.level >= i) : true
            return (
              <li key={x.name}>
                <button
                  className={'ms-level' + (i === level ? ' active' : '')}
                  onClick={() => go(i)}
                  aria-pressed={i === level}
                  aria-label={`${tierOf(i).name}: ${x.name}`}
                >
                  <Medal family={family} level={i} locked={!got} size={40} />
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function Progress({ who, value, target, got, unit }: { who?: string; value: number; target: number; got: boolean; unit: (n: number) => string }) {
  const missing = target - value
  return (
    <div className={'ms-box' + (got ? ' got' : '')}>
      {got ? (
        <p>
          <CheckCircleIcon weight="fill" className="inline-icon win-text" />{' '}
          {who ? (
            <>
              <b>{who}</b> la ganó. Lleva {unit(value)}.
            </>
          ) : (
            <>¡La ganaste! Llevás {unit(value)}.</>
          )}
        </p>
      ) : (
        <>
          <p>
            {who ? <b>{who}</b> : 'Vos'} lleva{who ? '' : 's'} {unit(value)} de {unit(target)}.{' '}
            <b>
              {missing === 1 ? 'Falta' : 'Faltan'} {missing}
            </b>{' '}
            para ganarla.
          </p>
          <span className="medal-bar" aria-hidden="true">
            <i style={{ width: `${Math.round(Math.min(1, Math.max(0, value / target)) * 100)}%` }} />
          </span>
        </>
      )}
    </div>
  )
}
