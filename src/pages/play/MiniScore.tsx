import { CrownIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { sideColor, sideName } from '../../components/GameBits'
import type { Id, Play, Player } from '../../lib/types'

/**
 * Marcador chico pegado debajo del encabezado: una franja con el total de cada uno siempre a la vista,
 * aunque la planilla o las tarjetas sean largas. Columnas separadas por líneas finas, sin cajas.
 * Quien va primero lleva corona y "1º" (no sólo color); a quien le toca, una raya de su color debajo.
 */
export function MiniScore({
  play,
  players,
  totals,
  lowWins = false,
  out,
  suffix,
  current,
  children,
}: {
  play: Play
  players: Map<Id, Player>
  totals: number[]
  /** Gana el que menos tiene. */
  lowWins?: boolean
  /** Lados que quedaron afuera (no compiten por el primer puesto). */
  out?: boolean[]
  /** Lo que va después del total, por ejemplo "/10". */
  suffix?: string
  /** Lado al que le toca (por turnos). */
  current?: number
  /** Una fila más dentro de la misma franja fija (por turnos: a quién le toca y "Pasar turno"). */
  children?: ReactNode
}) {
  const alive = totals.filter((_, i) => !out?.[i])
  const best = alive.length ? (lowWins ? Math.min(...alive) : Math.max(...alive)) : undefined
  // Si están todos iguales no hay nadie primero.
  const showLead = alive.some((t) => t !== best)
  return (
    <div className="mini-score" role="group" aria-label="Marcador">
      <ul className="mscore-row" style={{ ['--n' as string]: play.sides.length }}>
        {play.sides.map((side, i) => {
          const lead = showLead && totals[i] === best && !out?.[i]
          const name = sideName(side, players)
          return (
            <li
              key={i}
              className={'mscore-cell' + (lead ? ' lead' : '') + (current === i ? ' current' : '') + (out?.[i] ? ' out' : '')}
              style={{ ['--pc' as string]: sideColor(side, players) }}
            >
              <span className="mscore-text">
                <span className="mscore-name ellipsis">{name}</span>
                <span className="mscore-total">
                  <b className="num">{totals[i]}</b>
                  {suffix && <span className="mscore-suffix num">{suffix}</span>}
                  {lead && (
                    <span className="mscore-lead">
                      <CrownIcon weight="fill" aria-hidden="true" />
                      <span aria-hidden="true">1º</span>
                      <span className="sr-only">, va primero</span>
                    </span>
                  )}
                  {out?.[i] && <span className="mscore-out">afuera</span>}
                  {current === i && <span className="sr-only">, le toca</span>}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      {children}
    </div>
  )
}
