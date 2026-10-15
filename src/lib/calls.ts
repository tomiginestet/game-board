// Convocatorias: "¿quién viene el jueves?". Un partido programado con citados que responden si van,
// y con los que van se arman los equipos.

import type { Id, Play, Rsvp, Team } from './types'

/** Una convocatoria todavía sin equipos armados. */
export function isCall(play: Pick<Play, 'status' | 'invited'>): boolean {
  return play.status === 'pending' && !!play.invited
}

/** A quiénes se les pregunta: los citados o, en un partido de fixture, los planteles de cada lado. */
export function callPeople(play: Play, teams: Team[] = []): Id[] {
  if (play.invited) return play.invited
  const out: Id[] = []
  for (const s of play.sides) {
    const roster = s.teamId ? teams.find((t) => t.id === s.teamId)?.players : undefined
    for (const id of [...s.players, ...(roster ?? [])]) if (!out.includes(id)) out.push(id)
  }
  return out
}

export interface RsvpCounts {
  yes: number
  maybe: number
  no: number
  pending: number
}

export function rsvpCounts(play: Pick<Play, 'rsvp'>, people: Id[]): RsvpCounts {
  const c: RsvpCounts = { yes: 0, maybe: 0, no: 0, pending: 0 }
  for (const id of people) {
    const r = play.rsvp?.[id]
    if (r) c[r]++
    else c.pending++
  }
  return c
}

/** Los que van (y, si se pide, los "capaz"), en el orden de los citados. */
export function goingIds(play: Pick<Play, 'rsvp' | 'rsvpAt' | 'capacity'>, people: Id[], withMaybe = false): Id[] {
  // Con cupo, juegan los que entraron (no los de la lista de espera).
  const { inIds } = lineup(play, people)
  if (!withMaybe) return inIds
  const room = play.capacity ? Math.max(0, play.capacity - inIds.length) : Infinity
  return [...inIds, ...people.filter((id) => play.rsvp?.[id] === 'maybe').slice(0, room)]
}

export const RSVP_LABEL: Record<Rsvp, string> = { yes: 'Voy', maybe: 'Capaz', no: 'No voy' }

/** "6 van · 2 no · 2 sin responder". */
export function rsvpSummary(c: RsvpCounts): string {
  const parts = [`${c.yes} ${c.yes === 1 ? 'va' : 'van'}`]
  if (c.maybe) parts.push(`${c.maybe} capaz`)
  if (c.no) parts.push(`${c.no} no`)
  if (c.pending) parts.push(`${c.pending} sin responder`)
  return parts.join(' · ')
}

/**
 * Quiénes entran y quiénes quedan en lista de espera: con cupo, entran los primeros que dijeron que van
 * (por hora de respuesta); el resto espera y entra solo si alguien se baja.
 */
export function lineup(play: Pick<Play, 'rsvp' | 'rsvpAt' | 'capacity'>, people: Id[]): { inIds: Id[]; waitIds: Id[] } {
  const order = new Map(people.map((id, i) => [id, i]))
  const yes = people
    .filter((id) => play.rsvp?.[id] === 'yes')
    .sort((a, b) => (play.rsvpAt?.[a] ?? Infinity) - (play.rsvpAt?.[b] ?? Infinity) || order.get(a)! - order.get(b)!)
  if (!play.capacity || play.capacity <= 0) return { inIds: yes, waitIds: [] }
  return { inIds: yes.slice(0, play.capacity), waitIds: yes.slice(play.capacity) }
}

/**
 * Si `me` puede marcar la respuesta de `id`. Sin cuenta (o sin saber quién sos) cualquiera marca por todos,
 * como en la juntada; con cuenta, cada uno lo suyo, y quien organizó también por los demás.
 */
export function canAnswerFor(play: Pick<Play, 'organizer'>, me: Id | undefined, id: Id): boolean {
  if (!me) return true
  return id === me || !play.organizer || play.organizer === me
}

/** Los que entraron al partido con este cambio (se liberó un lugar). */
export function newlyIn(before: Id[], after: Id[]): Id[] {
  return after.filter((id) => !before.includes(id))
}
