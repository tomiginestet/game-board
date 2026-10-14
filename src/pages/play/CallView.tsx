import { CalendarBlankIcon, MapPinIcon, PencilSimpleIcon, PlayIcon, ShareNetworkIcon, TrashIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { sideName } from '../../components/GameBits'
import { PlayerPicker } from '../../components/PlayerPicker'
import { ScheduleDialog } from '../../components/ScheduleDialog'
import { callPeople, isCall, RSVP_LABEL, rsvpCounts, rsvpSummary } from '../../lib/calls'
import { toast } from '../../lib/feedback'
import type { GameDef } from '../../lib/games/schema'
import { plural } from '../../lib/hooks'
import { formatWhen } from '../../lib/schedule'
import { actions, useData } from '../../lib/store'
import type { Id, Play, Player, Rsvp } from '../../lib/types'

const ANSWERS: Rsvp[] = ['yes', 'maybe', 'no']

/**
 * La previa de un partido programado: quiénes vienen. En una convocatoria (sin equipos), con los que van se
 * arman los equipos; en un partido del fixture, se arranca sin los que avisaron que no van.
 */
export function CallView({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const data = useData()
  const navigate = useNavigate()
  const call = isCall(play)
  const people = callPeople(play, data.teams)
  const counts = rsvpCounts(play, people)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const sorted = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name, 'es')), [data.players])
  const min = Math.max(2, game.players.min)
  const going = people.filter((id) => play.rsvp?.[id] === 'yes')
  const team = play.callTeamId ? data.teams.find((t) => t.id === play.callTeamId) : undefined
  const title = call ? (team ? `${team.name}: ${game.name}` : game.name) : play.sides.map((s) => sideName(s, players)).join(' vs ')

  const share = async () => {
    const url = `${window.location.href.split('#')[0]}#/partida/${play.id}`
    const when = play.scheduledAt ? formatWhen(play.scheduledAt) : ''
    const text = [`${game.emoji} ${title}`, [when, play.venue].filter(Boolean).join(' · '), `¿Venís? Anotate acá: ${url}`].filter(Boolean).join('\n')
    try {
      if (navigator.share) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(text)
        toast('Copiamos el mensaje para pegarlo en el grupo.')
      }
    } catch {
      // Se canceló el compartir: no pasa nada.
    }
  }

  const start = () => {
    if (call) {
      // Con los que van (y los "capaz", si no alcanzan) se arman los equipos en la pantalla de siempre.
      navigate(`/jugar/${game.id}?convocatoria=${play.id}`)
      return
    }
    actions.startPending(play.id)
  }

  const remove = () => {
    const removed = play
    actions.deletePlay(play.id)
    navigate('/')
    toast('Borraste la convocatoria.', { label: 'Deshacer', run: () => actions.restorePlay(removed) })
  }

  return (
    <div className="call-view">
      <section className="call-head">
        <h2 className="call-title">{title}</h2>
        <p className="call-meta muted">
          <span>
            <CalendarBlankIcon className="inline-icon" aria-hidden="true" /> {play.scheduledAt ? formatWhen(play.scheduledAt) : 'Sin fecha'}
          </span>
          {play.venue && (
            <span>
              <MapPinIcon className="inline-icon" aria-hidden="true" /> {play.venue}
            </span>
          )}
          <button type="button" className="link-btn small" onClick={() => setEditing(true)}>
            <PencilSimpleIcon className="inline-icon" aria-hidden="true" /> Cambiar
          </button>
        </p>
        <p className="call-count" aria-live="polite">
          <b className="num">{counts.yes}</b> {counts.yes === 1 ? 'confirmado' : 'confirmados'}
          <span className="muted"> · {rsvpSummary(counts).split(' · ').slice(1).join(' · ') || 'todos respondieron'}</span>
        </p>
        {counts.yes < min && <p className="hint">Hacen falta al menos {plural(min, 'jugador', 'jugadores')} para jugar.</p>}
      </section>

      <div className="row wrap">
        <button type="button" className="btn grow" onClick={share}>
          <ShareNetworkIcon aria-hidden="true" /> Mandar al grupo
        </button>
        {call && (
          <button type="button" className="btn grow" onClick={() => setAdding(!adding)} aria-expanded={adding}>
            <UserPlusIcon aria-hidden="true" /> {adding ? 'Listo' : 'Sumar gente'}
          </button>
        )}
      </div>

      {adding && call && (
        <section>
          <h3>Citados</h3>
          <PlayerPicker
            players={sorted}
            selected={play.invited ?? []}
            label="Citados"
            onToggle={(id) => actions.setInvited(play.id, (play.invited ?? []).includes(id) ? (play.invited ?? []).filter((x) => x !== id) : [...(play.invited ?? []), id])}
          />
        </section>
      )}

      <section>
        <h3 className="call-list-title">¿Quién viene?</h3>
        <p className="hint">Cada uno marca lo suyo (o lo marca el que organiza).</p>
        <ul className="rsvp-list">
          {people.map((id) => {
            const p = players.get(id)
            if (!p) return null
            const mine = play.rsvp?.[id]
            return (
              <li key={id} className={'rsvp-row' + (mine ? ` is-${mine}` : '')}>
                <Avatar player={p} size={32} />
                <span className="grow ellipsis">{p.name}</span>
                <span className="rsvp-choices" role="group" aria-label={`¿Viene ${p.name}?`}>
                  {ANSWERS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={'rsvp-btn ' + a + (mine === a ? ' active' : '')}
                      aria-pressed={mine === a}
                      onClick={() => actions.setRsvp(play.id, id, mine === a ? null : a)}
                    >
                      {RSVP_LABEL[a]}
                    </button>
                  ))}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="sticky-actions">
        <button type="button" className="btn primary big block" onClick={start} disabled={call && going.length + counts.maybe < min}>
          {call ? (
            <>
              <UsersThreeIcon weight="fill" aria-hidden="true" /> Armar equipos con los que van ({going.length})
            </>
          ) : (
            <>
              <PlayIcon weight="fill" aria-hidden="true" /> Empezar el partido
            </>
          )}
        </button>
      </div>

      {call && (
        <button type="button" className="link-btn danger-text small center-block mt" onClick={remove}>
          <TrashIcon aria-hidden="true" /> Borrar convocatoria
        </button>
      )}
      {editing && <ScheduleDialog play={play} title={title} onClose={() => setEditing(false)} />}
    </div>
  )
}
