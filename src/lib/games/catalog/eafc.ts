import type { GameDef } from '../schema'

export const eafc: GameDef = {
  id: 'eafc',
  name: 'EA Sports FC (FIFA)',
  emoji: '⚽',
  color: '#0CA0E8',
  category: 'video',
  tagline: 'Perdiste 4 a 0 y fue el joystick, el lag y el árbitro. En ese orden.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, allowDraw: true, pointsName: 'goles' },
  options: [
    {
      id: 'halfLength', label: 'Duración de cada tiempo', type: 'select', default: 6,
      choices: [{ value: 4, label: '4 minutos' }, { value: 6, label: '6 minutos' }, { value: 8, label: '8 minutos' }],
    },
  ],
  events: [
    { id: 'bicycle', name: 'Gol de chilena', emoji: '🤸', type: 'count' },
    { id: 'olimpico', name: 'Gol olímpico', emoji: '🚩', type: 'count', help: 'Gol directo de córner, como Onzari contra Uruguay en 1924.' },
    { id: 'penalties', name: 'Ganó por penales', emoji: '🥅', type: 'count' },
    { id: 'lastMinute', name: 'Gol en el último minuto', emoji: '⏱️', type: 'count', help: 'Gol que cambió el resultado sobre la hora.' },
    { id: 'redCard', name: 'Expulsado', emoji: '🟥', type: 'count' },
    { id: 'rageQuit', name: 'Tiró el joystick', emoji: '🎮', type: 'count', help: 'Rage quit o joystick al sillón (o a la pared).' },
  ],
  stats: [
    { id: 'team', label: 'Equipo que usó', type: 'choice', choices: ['Selección Argentina', 'Boca', 'River', 'Real Madrid', 'Barcelona', 'Manchester City', 'Otro'] },
  ],
  awards: [
    {
      id: 'margin', name: 'Goleador serial', measures: 'Mayor diferencia de gol en una victoria', metric: { type: 'marginMax' },
      unit: 'ganó por {n}', unitOne: 'ganó por 1',
      levels: [
        { at: 3, name: 'Baile', description: 'Ganaste por tres. Olé, olé, olé.' },
        { at: 5, name: 'Paliza', description: 'Cinco goles de diferencia. El rival pidió la hora en el primer tiempo.' },
        { at: 8, name: 'Mineirazo', description: 'Ocho o más de diferencia: un Brasil-Alemania en el living.' },
      ],
    },
    {
      id: 'golazo', name: 'Golazo', measures: 'Goles de chilena en total', metric: { type: 'eventTotal', event: 'bicycle' },
      unit: '{n} chilenas', unitOne: '1 chilena',
      levels: [
        { at: 1, name: 'Tijera', description: 'Una chilena adentro. Lo gritaste como en la Bombonera.' },
        { at: 5, name: 'Acróbata', description: 'Cinco chilenas: el joystick hace piruetas.' },
        { at: 12, name: 'Escorpión', description: 'Doce chilenas. Ya las hacés hasta de espaldas, como Higuita.' },
      ],
    },
    {
      id: 'penalties', name: 'Mira de los once metros', measures: 'Partidos ganados por penales', metric: { type: 'eventTotal', event: 'penalties' },
      unit: '{n} definiciones ganadas', unitOne: '1 definición ganada',
      levels: [
        { at: 1, name: 'Bajo los tres palos', description: 'Ganaste por penales. Guantes y nervios de acero.' },
        { at: 3, name: 'Goyco', description: 'Tres definiciones ganadas: Italia 90 en el living.' },
        { at: 7, name: 'Dibu Martínez', description: 'Siete tandas ganadas. Bailecito en la línea incluido.' },
      ],
    },
    {
      id: 'rage', name: 'Calentón', measures: 'Joysticks revoleados', metric: { type: 'eventTotal', event: 'rageQuit' },
      unit: '{n} joysticks revoleados', unitOne: '1 joystick revoleado',
      levels: [
        { at: 1, name: 'Joystick volador', description: 'Revoleaste el joystick. Era de la casa, eh.' },
        { at: 4, name: 'Pibe calentón', description: 'Cuatro rage quits. Tranquilo, que es un jueguito.' },
        { at: 10, name: 'Olla a presión', description: 'Diez joysticks revoleados. Silbás como la olla de los porotos.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Partido de fútbol en la consola: 1 contra 1 o 2 contra 2 en el mismo sillón (o online).',
    'Cada uno elige equipo; se juegan dos tiempos de pocos minutos.',
    'En liga vale el empate; en eliminación directa hay alargue y penales.',
    'Se anotan los goles de cada lado y los momentos de gloria (o de vergüenza).',
    'Prohibido pausar en un contraataque del rival. Es ley.',
  ],
  rulesUrl: 'https://www.ea.com/games/ea-sports-fc',
  source: 'builtin',
}
