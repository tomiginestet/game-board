import { CrownIcon } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { TeamAvatar } from '../../components/Avatar'
import { sideName, sidePlayersOf } from '../../components/GameBits'
import { planillaSummary } from '../../lib/games/planilla'
import type { GameDef } from '../../lib/games/schema'
import type { Id, Play, Player } from '../../lib/types'
import '../../styles/planilla-summary.css'

/**
 * La planilla de la generala tal como quedó al terminar: categorías × jugadores,
 * de sólo lectura, con el total y quién ganó. No muestra nada si el juego no se
 * anota por planilla.
 */
export function PlanillaSummary({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const data = useMemo(() => planillaSummary(game, play), [game, play])
  if (!data) return null
  const { rows, totals, leaders } = data
  const names = play.sides.map((s) => sideName(s, players))
  const tied = leaders.length > 1

  return (
    <section className="card planilla-summary">
      <div className="ps-wrap">
        <table className="ps-table" style={{ ['--n' as string]: play.sides.length }}>
          <caption>
            <span className="ps-title">Planilla final</span>
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Categoría</span>
              </th>
              {play.sides.map((s, i) => (
                <th key={i} scope="col">
                  <TeamAvatar team={sidePlayersOf(s, players)} size={24} />
                  <span className="ps-name" title={names[i]}>
                    {names[i]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, c) => (
              <tr key={c}>
                <th scope="row">{row.label}</th>
                {row.values.map((v, i) => (
                  <td key={i} className={v === null ? 'is-empty' : v === 0 ? 'is-zero' : undefined}>
                    {v === null ? (
                      <span className="sr-only">Sin anotar</span>
                    ) : v === 0 ? (
                      <>
                        <span aria-hidden>—</span>
                        <span className="sr-only">Tachada</span>
                      </>
                    ) : (
                      <span className="num">{v}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              {totals.map((v, i) => {
                const lead = leaders.includes(i)
                return (
                  <td key={i} className={lead ? 'is-lead' : undefined}>
                    <b className="num">{v}</b>
                    {lead && (
                      <span className="ps-lead">
                        <CrownIcon aria-hidden weight="fill" /> {tied ? 'Empató' : 'Ganó'}
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
