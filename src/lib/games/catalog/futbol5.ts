import { lv } from '../kit'
import type { GameDef } from '../schema'

export const futbol5: GameDef = {
  id: 'futbol5',
  name: 'Fútbol 5',
  emoji: '⚽',
  color: '#2F9E44',
  category: 'deporte',
  tagline: 'El que no paga la cancha ataja. El que llega tarde, también.',
  players: { min: 4, max: 20 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true, clock: { periods: 2, minutes: 25, minutesOption: 'half' } },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [
    { id: 'half', label: 'Cada tiempo', type: 'select', default: 25, choices: [{ value: 20, label: '20 minutos' }, { value: 25, label: '25 minutos' }, { value: 30, label: '30 minutos' }] },
    { id: 'changes', label: 'Arquero rotativo', type: 'boolean', default: true, help: 'Cada tanto (o cada gol en contra) pasa otro al arco.' },
  ],
  events: [
    { id: 'cano', name: 'Caño', emoji: '🥜', type: 'count', byPlayer: true, help: 'Le pasó la pelota entre las piernas a un rival.' },
    { id: 'atajada', name: 'Atajadón', emoji: '🧤', type: 'count', byPlayer: true, help: 'Una atajada que salvó un gol hecho.' },
    { id: 'amarilla', name: 'Amarilla', emoji: '🟨', type: 'count', byPlayer: true },
    { id: 'roja', name: 'Roja', emoji: '🟥', type: 'count', byPlayer: true },
    { id: 'palo', name: 'Palo', emoji: '🥅', type: 'count', byPlayer: true, help: 'Casi: la pelota pegó en el palo o en el travesaño.' },
  ],
  stats: [],
  awards: [
    {
      id: 'goles', name: 'Goleador', measures: 'Goles propios en total', metric: { type: 'scored' },
      unit: '{n} goles', unitOne: '1 gol',
      levels: [
        lv(10, 'Botín de barrio', 'Diez goles. Ya te pasan la pelota sin mirar.'),
        lv(50, 'Pichichi del jueves', 'Cincuenta goles. Sos el que arma los equipos.'),
        lv(150, 'Goleador de potrero', 'Ciento cincuenta goles. Hasta el arquero rival te aplaude.'),
      ],
    },
    {
      id: 'hattrick', name: 'Hat-trick', measures: 'Más goles propios en un partido', metric: { type: 'scoredMax' },
      unit: '{n} goles en un partido', unitOne: '1 gol en un partido',
      levels: [
        lv(3, 'Triplete', 'Tres goles en un partido: llevate la pelota a tu casa.'),
        lv(5, 'Manito', 'Cinco goles en un partido. Una mano entera de goles.'),
        lv(8, 'Noche de Batistuta', 'Ocho goles en un partido. Ametralladora, como Bati.'),
      ],
    },
    {
      id: 'asistencias', name: 'Pasador', measures: 'Asistencias en total', metric: { type: 'assists' },
      unit: '{n} asistencias', unitOne: '1 asistencia',
      levels: [
        lv(10, 'Pase de la muerte', 'Diez asistencias. La dejás picando en la línea.'),
        lv(40, 'Enganche clásico', 'Cuarenta asistencias: el 10 de toda la vida.'),
        lv(120, 'Riquelme de cancha sintética', 'Ciento veinte asistencias. Pausa, pisada y pase gol.'),
      ],
    },
    {
      id: 'figura', name: 'Figura', measures: 'Veces que fuiste la figura del partido', metric: { type: 'mvp' },
      unit: '{n} veces figura', unitOne: '1 vez figura',
      levels: [
        lv(1, 'Nota 8 en el Olé', 'Fuiste la figura. Te ponen nota alta en la tapa.'),
        lv(5, 'Ovación en el tercer tiempo', 'Cinco veces figura. Te pagan la cerveza.'),
        lv(15, 'Diez de la cancha', 'Quince veces figura. Te piden que juegues para los dos equipos.'),
      ],
    },
    {
      id: 'muralla', name: 'Valla invicta', measures: 'Partidos ganados sin que te hagan un gol', metric: { type: 'shutoutWins' },
      unit: '{n} vallas invictas', unitOne: '1 valla invicta',
      levels: [
        lv(1, 'Arco en cero', 'Ganaste sin que te hagan un gol. El arquero pide aumento.'),
        lv(5, 'Candado', 'Cinco vallas invictas. Adelante del arco hay un candado.'),
        lv(15, 'Cerrojo italiano', 'Quince partidos sin goles en contra. Catenaccio puro.'),
      ],
    },
    {
      id: 'rojas', name: 'Carnicero', measures: 'Rojas en total', metric: { type: 'eventTotal', event: 'roja' },
      unit: '{n} rojas', unitOne: '1 roja',
      levels: [
        lv(1, 'Patada de amigo', 'Te echaron una vez. "Fui a la pelota", dijiste.'),
        lv(3, 'Tarjeta en el bolsillo', 'Tres rojas. El árbitro ya la saca antes de que entres.'),
        lv(8, 'Leñador', 'Ocho expulsiones. Jugás con hacha.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cinco contra cinco (o los que vengan) en cancha chica, con arcos de baby.',
    'No hay offside; el arquero no puede salir del área y los laterales se sacan con el pie.',
    'Se anota cada gol con su autor y, si hubo, quién dio el pase. Al final se elige la figura.',
    'Se juega por tiempo (lo que dura el turno de la cancha): gana el que hizo más goles; puede ser empate.',
    'Usá "Equipos parejos" al armar el partido para que no sea siempre la misma paliza.',
  ],
  source: 'builtin',
}
