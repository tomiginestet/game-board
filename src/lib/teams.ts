// Equipos fijos del club: su campaña (partidos, goles a favor y en contra), sus goleadores y lo que viene.

import { playerLines, winnerSides } from './engine'
import type { GameDef } from './games/schema'
import type { AppData, Id, Play, Team } from './types'

export const TEAM_EMOJIS = ['⚽', '🏀', '🏐', '🎾', '🏒', '🏉', '🥅', '🛡️', '👑', '🔥', '⚡', '🦁', '🐺', '🦅', '🦈', '🐝', '🐉', '🐂', '🌶️', '🍺']

/** Juegos en los que tiene sentido jugar con un equipo fijo (los de equipos o de las dos formas). */
export function isTeamGame(game: Pick<GameDef, 'sides' | 'id'>): boolean {
  return (game.sides === 'teams' || game.sides === 'either') && game.id !== 'pingpong'
}

export interface TeamScorer {
  id: Id
  scored: number
  assists: number
  mvps: number
  played: number
}

export interface TeamRecord {
  played: number
  wins: number
  draws: number
  losses: number
  /** Puntaje (goles) a favor y en contra, en los partidos de a dos. */
  scoreFor: number
  scoreAgainst: number
  /** Últimos resultados, del más nuevo al más viejo: "G", "E", "P". */
  form: ('G' | 'E' | 'P')[]
  scorers: TeamScorer[]
  /** Terminados, del más nuevo al más viejo. */
  finished: Play[]
  /** Pendientes o en juego, en orden de fecha. */
  upcoming: Play[]
}

const when = (p: Play) => p.scheduledAt ?? p.finishedAt ?? p.startedAt ?? p.createdAt

/** Lado de la partida en el que juega el equipo (-1 si no juega). */
export function teamSide(play: Play, teamId: Id): number {
  return play.sides.findIndex((s) => s.teamId === teamId)
}

export function teamRecord(data: Pick<AppData, 'plays'>, team: Team): TeamRecord {
  const rec: TeamRecord = { played: 0, wins: 0, draws: 0, losses: 0, scoreFor: 0, scoreAgainst: 0, form: [], scorers: [], finished: [], upcoming: [] }
  const scorers = new Map<Id, TeamScorer>()
  const scorer = (id: Id) => {
    let s = scorers.get(id)
    if (!s) scorers.set(id, (s = { id, scored: 0, assists: 0, mvps: 0, played: 0 }))
    return s
  }
  for (const play of data.plays) {
    const side = teamSide(play, team.id)
    if (side < 0) {
      if (play.callTeamId === team.id && play.status === 'pending') rec.upcoming.push(play)
      continue
    }
    if (play.status !== 'finished' || !play.result) {
      rec.upcoming.push(play)
      continue
    }
    rec.finished.push(play)
  }
  rec.finished.sort((a, b) => when(b) - when(a))
  rec.upcoming.sort((a, b) => when(a) - when(b))
  for (const play of rec.finished) {
    const side = teamSide(play, team.id)
    const winners = winnerSides(play)
    rec.played++
    const result = winners.includes(side) ? 'G' : winners.length ? 'P' : 'E'
    if (result === 'G') rec.wins++
    else if (result === 'P') rec.losses++
    else rec.draws++
    rec.form.push(result)
    const scores = play.result!.scores
    if (scores && play.sides.length === 2) {
      rec.scoreFor += scores[side] ?? 0
      rec.scoreAgainst += scores[1 - side] ?? 0
    }
    const lines = playerLines(play)
    for (const id of play.sides[side].players) {
      const s = scorer(id)
      s.played++
      const line = lines.get(id)
      if (line) {
        s.scored += line.scored
        s.assists += line.assists
      }
      if (play.result!.mvp === id) s.mvps++
    }
  }
  rec.scorers = [...scorers.values()].sort((a, b) => b.scored - a.scored || b.assists - a.assists || b.mvps - a.mvps || b.played - a.played)
  rec.form = rec.form.slice(0, 5)
  return rec
}
