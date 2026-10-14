import { BellRingingIcon, CalendarBlankIcon, CalendarPlusIcon, MapPinIcon, PencilSimpleIcon, PlayIcon, ShareNetworkIcon, TrashIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { sideName } from '../../components/GameBits'
import { PlayerPicker } from '../../components/PlayerPicker'
import { ScheduleDialog } from '../../components/ScheduleDialog'
import { callPeople, canAnswerFor, isCall, lineup, newlyIn, RSVP_LABEL, rsvpCounts } from '../../lib/calls'
import { notifyCall } from '../../lib/callNotify'
import { clockRuleOf } from '../../lib/clock'
import { toast } from '../../lib/feedback'
import type { GameDef } from '../../lib/games/schema'
import { plural } from '../../lib/hooks'
import { downloadIcs, googleCalendarUrl, type CalendarEvent } from '../../lib/ics'
import { useMyPlayerId } from '../../lib/me'
import { formatWhen } from '../../lib/schedule'
import { actions, getData, useData } from '../../lib/store'
import type { Id, Play, Player, Rsvp } from '../../lib/types'

const ANSWERS: Rsvp[] = ['yes', 'maybe', 'no']
const CAPACITIES = [0, 6, 8, 10, 12, 14, 16, 18, 22]

/**
 * La previa de un partido programado: quiénes vienen. En una convocatoria (sin equipos), con los que van se
 * arman los equipos; en un partido del fixture, se arranca sin los que avisaron que no van.
 * Con cuenta, cada uno marca lo suyo (quien organizó, también por los demás); con cupo, los que confirman
 * después quedan en lista de espera y entran solos si alguien se baja.
 */
export function CallView({ play, game, players }: { play: Play; game: GameDef; players: Map<Id, Player> }) {
  const data = useData()
  const navigate = useNavigate()
  const me = useMyPlayerId()
  const call = isCall(play)
  const people = callPeople(play, data.teams)
  // Vos primero: lo primero que se ve es tu respuesta.
  const ordered = me && people.includes(me) ? [me, ...people.filter((id) => id !== me)] : people
  const counts = rsvpCounts(play, people)
  const { inIds, waitIds } = lineup(play, people)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const sorted = useMemo(() => [...data.players].sort((a, b) => a.name.localeCompare(b.name, 'es')), [data.players])
  const min = Math.max(2, game.players.min)
  const team = play.callTeamId ? data.teams.find((t) => t.id === play.callTeamId) : undefined
  const title = call ? (team ? `${team.name}: ${game.name}` : game.name) : play.sides.map((s) => sideName(s, players)).join(' vs ')
  const organizes = !me || !play.organizer || play.organizer === me
  const url = `${window.location.href.split('#')[0]}#/partida/${play.id}`

  const answer = (id: Id, a: Rsvp | null) => {
    const before = lineup(play, people).inIds
    actions.setRsvp(play.id, id, a)
    // Si alguien se bajó y había lista de espera, al que entra le llega el aviso.
    const fresh = getData().plays.find((p) => p.id === play.id)
    if (!fresh || !play.capacity) return
    const promoted = newlyIn(before, lineup(fresh, callPeople(fresh, data.teams)).inIds).filter((x) => x !== id && x !== me)
    if (promoted.length) {
      void notifyCall('call_in', fresh, title, promoted)
      toast(`${promoted.map((x) => players.get(x)?.name ?? '¿?').join(' y ')} ${promoted.length === 1 ? 'entra' : 'entran'} al partido: se liberó un lugar.`)
    }
  }

  const share = async () => {
    const when = play.scheduledAt ? formatWhen(play.scheduledAt) : ''
    const spots = play.capacity ? `Cupo: ${play.capacity} (van ${inIds.length})` : ''
    const text = [`${game.emoji} ${title}`, [when, play.venue].filter(Boolean).join(' · '), spots, `¿Venís? Anotate acá: ${url}`].filter(Boolean).join('\n')
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

  const rule = clockRuleOf(game, play.config)
  const event: CalendarEvent | undefined = play.scheduledAt
    ? {
        id: play.id,
        title: `${game.emoji} ${title}`,
        start: play.scheduledAt,
        minutes: rule ? rule.periods * rule.minutes + 15 : 90,
        location: play.venue,
        description: `Convocatoria en Game Board: ${url}`,
        remindBefore: 120,
      }
    : undefined

  const toggleInvited = (id: Id) => {
    const list = play.invited ?? []
    if (list.includes(id)) return actions.setInvited(play.id, list.filter((x) => x !== id))
    actions.setInvited(play.id, [...list, id])
    if (id !== me) void notifyCall('call', play, title, [id])
  }

  const start = () => {
    if (call) {
      // Con los que entraron (y los "capaz", si no alcanzan) se arman los equipos en la pantalla de siempre.
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
          {organizes && (
            <button type="button" className="link-btn small" onClick={() => setEditing(true)}>
              <PencilSimpleIcon className="inline-icon" aria-hidden="true" /> Cambiar
            </button>
          )}
        </p>
        <p className="call-count" aria-live="polite">
          <b className="num">{inIds.length}</b>
          {play.capacity ? <span className="num">/{play.capacity}</span> : null} {inIds.length === 1 ? 'confirmado' : 'confirmados'}
          <span className="muted">
            {waitIds.length ? ` · ${waitIds.length} en espera` : ''}
            {counts.maybe ? ` · ${counts.maybe} capaz` : ''}
            {counts.no ? ` · ${counts.no} no` : ''}
            {counts.pending ? ` · ${counts.pending} sin responder` : ''}
          </span>
        </p>
        {play.capacity && inIds.length >= play.capacity ? (
          <p className="hint">Cupo lleno: el que confirme ahora queda en lista de espera y entra si alguien se baja.</p>
        ) : inIds.length < min ? (
          <p className="hint">Hacen falta al menos {plural(min, 'jugador', 'jugadores')} para jugar.</p>
        ) : null}
      </section>

      <div className="row wrap">
        <button type="button" className="btn grow" onClick={share}>
          <ShareNetworkIcon aria-hidden="true" /> Mandar al grupo
        </button>
        {call && organizes && (
          <button type="button" className="btn grow" onClick={() => setAdding(!adding)} aria-expanded={adding}>
            <UserPlusIcon aria-hidden="true" /> {adding ? 'Listo' : 'Sumar gente'}
          </button>
        )}
      </div>

      {event && (
        <div className="call-calendar">
          <span className="muted small">
            <BellRingingIcon className="inline-icon" aria-hidden="true" /> Agendalo y te avisa el teléfono 2 horas antes:
          </span>
          <div className="row wrap">
            <button type="button" className="btn small" onClick={() => downloadIcs(event)}>
              <CalendarPlusIcon aria-hidden="true" /> Calendario del teléfono
            </button>
            <a className="btn small" href={googleCalendarUrl(event)} target="_blank" rel="noreferrer noopener">
              <CalendarPlusIcon aria-hidden="true" /> Google Calendar
            </a>
          </div>
        </div>
      )}

      {adding && call && (
        <section>
          <h3>Citados</h3>
          <p className="hint">A los que tienen cuenta en el club les llega el aviso.</p>
          <PlayerPicker players={sorted} selected={play.invited ?? []} label="Citados" onToggle={toggleInvited} />
          <div className="field row-between mt">
            <label htmlFor={`cap-${play.id}`}>Cupo</label>
            <select id={`cap-${play.id}`} className="input narrow" value={play.capacity ?? 0} onChange={(e) => actions.setCapacity(play.id, Number(e.target.value) || null)}>
              {CAPACITIES.map((n) => (
                <option key={n} value={n}>
                  {n ? `${n} jugadores` : 'Sin cupo'}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      <section>
        <h3 className="call-list-title">¿Quién viene?</h3>
        <p className="hint">{me && !organizes ? 'Marcá lo tuyo; el resto lo marca cada uno.' : 'Cada uno marca lo suyo (o lo marca el que organiza).'}</p>
        <ul className="rsvp-list">
          {ordered.map((id) => {
            const p = players.get(id)
            if (!p) return null
            const mine = play.rsvp?.[id]
            const waiting = waitIds.indexOf(id)
            const editable = canAnswerFor(play, me, id)
            return (
              <li key={id} className={'rsvp-row' + (mine ? ` is-${mine}` : '') + (waiting >= 0 ? ' is-waiting' : '') + (id === me ? ' is-me' : '')}>
                <Avatar player={p} size={32} />
                <span className="grow rsvp-name">
                  <span className="ellipsis">{p.name}</span>
                  {id === me && <span className="pill tiny">Vos</span>}
                  {waiting >= 0 && <span className="muted small block">En espera ({waiting + 1}º)</span>}
                  {id === play.organizer && id !== me && <span className="muted small block">Organiza</span>}
                </span>
                {editable ? (
                  <span className="rsvp-choices" role="group" aria-label={`¿Viene ${p.name}?`}>
                    {ANSWERS.map((a) => (
                      <button key={a} type="button" className={'rsvp-btn ' + a + (mine === a ? ' active' : '')} aria-pressed={mine === a} onClick={() => answer(id, mine === a ? null : a)}>
                        {RSVP_LABEL[a]}
                      </button>
                    ))}
                  </span>
                ) : (
                  <span className={'rsvp-answer ' + (mine ?? 'none')}>{mine ? RSVP_LABEL[mine] : 'Sin responder'}</span>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {organizes && (
        <div className="sticky-actions">
          <button type="button" className="btn primary big block" onClick={start} disabled={call && inIds.length + counts.maybe < min}>
            {call ? (
              <>
                <UsersThreeIcon weight="fill" aria-hidden="true" /> Armar equipos con los que van ({inIds.length})
              </>
            ) : (
              <>
                <PlayIcon weight="fill" aria-hidden="true" /> Empezar el partido
              </>
            )}
          </button>
        </div>
      )}

      {call && organizes && (
        <button type="button" className="link-btn danger-text small center-block mt" onClick={remove}>
          <TrashIcon aria-hidden="true" /> Borrar convocatoria
        </button>
      )}
      {editing && <ScheduleDialog play={play} title={title} onClose={() => setEditing(false)} />}
    </div>
  )
}
