import { StarIcon } from '@phosphor-icons/react'
import { Avatar } from '../../components/Avatar'
import { playerLines } from '../../lib/engine'
import type { GameDef } from '../../lib/games/schema'
import { actions } from '../../lib/store'
import type { Id, Play, Player } from '../../lib/types'

/**
 * Lo que hizo cada uno dentro de su equipo: goles (o puntos), asistencias, tarjetas y la figura del partido.
 * Sólo aparece en los juegos que llevan estadísticas por jugador.
 */
export function PlayerLinesCard({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const per = game.perPlayer
  const own = game.events.filter((e) => e.byPlayer)
  if (!per && !own.length) return null
  const lines = playerLines(play)
  const everyone = play.sides.flatMap((s, side) => s.players.map((id) => ({ id, side })))
  const rows = everyone
    .map(({ id, side }) => ({ id, side, line: lines.get(id) }))
    .filter((r) => r.line && (r.line.scored || r.line.assists || own.some((e) => r.line!.events[e.id])))
    .sort((a, b) => b.line!.scored - a.line!.scored || b.line!.assists - a.line!.assists)
  const usedEvents = own.filter((e) => rows.some((r) => r.line!.events[e.id]))
  const mvp = play.result?.mvp
  const unit = per?.unit ?? 'puntos'
  if (!rows.length && !per?.mvp) return null

  return (
    <section className="card player-lines">
      {rows.length > 0 && (
        <>
          <h2 className="summary-subtitle">{per?.scorer ? `Quién hizo los ${unit}` : 'Lo de cada uno'}</h2>
          <div className="table-wrap">
            <table className="rounds-table">
              <thead>
                <tr>
                  <th className="left">Jugador</th>
                  {per?.scorer && <th scope="col">{unit.charAt(0).toUpperCase() + unit.slice(1)}</th>}
                  {per?.assists && (
                    <th scope="col">
                      <abbr title="Asistencias">Asist.</abbr>
                    </th>
                  )}
                  {usedEvents.map((e) => (
                    <th key={e.id} scope="col" title={e.name}>
                      <span aria-hidden="true">{e.emoji}</span>
                      <span className="sr-only">{e.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ id, line }) => {
                  const p = players.get(id)
                  return (
                    <tr key={id}>
                      <td className="left">
                        {p?.emoji} {p?.name ?? '¿?'} {mvp === id && <StarIcon weight="fill" className="inline-icon mvp-star" aria-label="Figura" />}
                      </td>
                      {per?.scorer && <td className="num">{line!.scored || ''}</td>}
                      {per?.assists && <td className="num">{line!.assists || ''}</td>}
                      {usedEvents.map((e) => (
                        <td key={e.id} className="num">
                          {line!.events[e.id] || ''}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {per?.mvp && play.status === 'finished' && (
        <div className="mvp-pick">
          <h2 className="summary-subtitle" id={`mvp-${play.id}`}>
            <StarIcon weight="fill" className="inline-icon" /> Figura del partido
          </h2>
          <p className="hint">{mvp ? 'Tocá a otro para cambiarla.' : 'La eligen entre todos. Suma para la medalla de figura.'}</p>
          <div className="chips" role="group" aria-labelledby={`mvp-${play.id}`}>
            {everyone.map(({ id }) => {
              const p = players.get(id)
              if (!p) return null
              return (
                <button key={id} type="button" className={'chip' + (mvp === id ? ' active' : '')} aria-pressed={mvp === id} onClick={() => actions.setMvp(play.id, mvp === id ? null : id)}>
                  <Avatar player={p} size={22} /> {p.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
