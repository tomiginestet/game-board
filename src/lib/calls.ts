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
export function goingIds(play: Pick<Play, 'rsvp'>, people: Id[], withMaybe = false): Id[] {
  return people.filter((id) => play.rsvp?.[id] === 'yes' || (withMaybe && play.rsvp?.[id] === 'maybe'))
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
