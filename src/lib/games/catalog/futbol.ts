import { lv } from '../kit'
import type { GameDef } from '../schema'

export const futbol: GameDef = {
  id: 'futbol',
  name: 'Fútbol 7 / 11',
  emoji: '🥅',
  color: '#0B7285',
  category: 'deporte',
  tagline: 'Cancha grande, pulmones chicos. El segundo tiempo se juega caminando.',
  players: { min: 8, max: 30 },
  sides: 'teams',
  teamSize: 4,
  mode: 'counter',
  weight: 3,
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true, clock: { periods: 2, minutes: 35, minutesOption: 'half' } },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [
    { id: 'half', label: 'Cada tiempo', type: 'select', default: 35, choices: [{ value: 25, label: '25 minutos' }, { value: 30, label: '30 minutos' }, { value: 35, label: '35 minutos' }, { value: 45, label: '45 minutos' }] },
    { id: 'format', label: 'Formato', type: 'select', default: 7, choices: [{ value: 7, label: 'Fútbol 7' }, { value: 8, label: 'Fútbol 8' }, { value: 11, label: 'Fútbol 11' }] },
  ],
  events: [
    { id: 'amarilla', name: 'Amarilla', emoji: '🟨', type: 'count', byPlayer: true },
    { id: 'roja', name: 'Roja', emoji: '🟥', type: 'count', byPlayer: true },
    { id: 'penalAtajado', name: 'Penal atajado', emoji: '🧤', type: 'count', byPlayer: true },
    { id: 'golOlimpico', name: 'Gol olímpico', emoji: '🚩', type: 'count', byPlayer: true, help: 'Gol directo de córner.' },
  ],
  stats: [],
  awards: [
    {
      id: 'goles', name: 'Cañonero', measures: 'Goles propios en cancha grande', metric: { type: 'scored' },
      unit: '{n} goles', unitOne: '1 gol',
      levels: [
        lv(5, 'Primera red', 'Cinco goles en cancha grande. La red de verdad suena distinto.'),
        lv(25, 'Nueve de área', 'Veinticinco goles: no corrés, pero siempre estás donde cae.'),
        lv(80, 'Artillero de la liga', 'Ochenta goles. Te piden los botines para el museo del club.'),
      ],
    },
    {
      id: 'figura', name: 'Crack de la fecha', measures: 'Veces figura del partido', metric: { type: 'mvp' },
      unit: '{n} veces figura', unitOne: '1 vez figura',
      levels: [
        lv(1, 'Jugador de la fecha', 'Fuiste la figura del partido. Foto para el Instagram del club.'),
        lv(5, 'Once ideal', 'Cinco veces figura. Fijo en el equipo ideal del torneo.'),
        lv(15, 'Balón de oro de la liga', 'Quince veces figura. Te conocen hasta en el buffet de la otra cancha.'),
      ],
    },
    {
      id: 'penales', name: 'Arquerazo', measures: 'Penales atajados', metric: { type: 'eventTotal', event: 'penalAtajado' },
      unit: '{n} penales atajados', unitOne: '1 penal atajado',
      levels: [
        lv(1, 'Manos de manteca no', 'Atajaste un penal. Nadie lo esperaba, ni vos.'),
        lv(3, 'Pulpo bajo el arco', 'Tres penales atajados. Tenés ocho brazos.'),
        lv(8, 'Goycochea de la liga', 'Ocho penales atajados. Te piden que orines en el césped por cábala.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Fútbol de 7, 8 u 11 por lado, con offside (en 11) y arquero que puede salir del área.',
    'Se anota cada gol con su autor y su asistencia; las tarjetas, a quien se las sacaron.',
    'Dos tiempos; gana el que hace más goles. En eliminación, si empatan, alargue o penales (cargalo como desempate).',
  ],
  rulesUrl: 'https://www.theifab.com/laws-of-the-game-documents/',
  source: 'builtin',
}
