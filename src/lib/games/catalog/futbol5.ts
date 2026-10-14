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
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [
    { id: 'length', label: 'Duración', type: 'select', default: 60, choices: [{ value: 50, label: '50 minutos' }, { value: 60, label: '1 hora' }, { value: 90, label: '1 hora y media' }] },
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
        lv(10, 'Botín de barrio', 'Diez goles. Ya te pasan la pelota sin mirar.', 'star', '#51CF66'),
        lv(50, 'Pichichi del jueves', 'Cincuenta goles. Sos el que arma los equipos.', 'trophy', '#2F9E44'),
        lv(150, 'Goleador de potrero', 'Ciento cincuenta goles. Hasta el arquero rival te aplaude.', 'crown', '#087F5B'),
      ],
    },
    {
      id: 'hattrick', name: 'Hat-trick', measures: 'Más goles propios en un partido', metric: { type: 'scoredMax' },
      unit: '{n} goles en un partido', unitOne: '1 gol en un partido',
      levels: [
        lv(3, 'Triplete', 'Tres goles en un partido: llevate la pelota a tu casa.', 'flame', '#FAB005'),
        lv(5, 'Manito', 'Cinco goles en un partido. Una mano entera de goles.', 'flame', '#F76707'),
        lv(8, 'Noche de Batistuta', 'Ocho goles en un partido. Ametralladora, como Bati.', 'bolt', '#E03131'),
      ],
    },
    {
      id: 'asistencias', name: 'Pasador', measures: 'Asistencias en total', metric: { type: 'assists' },
      unit: '{n} asistencias', unitOne: '1 asistencia',
      levels: [
        lv(10, 'Pase de la muerte', 'Diez asistencias. La dejás picando en la línea.', 'heart', '#74C0FC'),
        lv(40, 'Enganche clásico', 'Cuarenta asistencias: el 10 de toda la vida.', 'brain', '#339AF0'),
        lv(120, 'Riquelme de cancha sintética', 'Ciento veinte asistencias. Pausa, pisada y pase gol.', 'eye', '#1864AB'),
      ],
    },
    {
      id: 'figura', name: 'Figura', measures: 'Veces que fuiste la figura del partido', metric: { type: 'mvp' },
      unit: '{n} veces figura', unitOne: '1 vez figura',
      levels: [
        lv(1, 'Nota 8 en el Olé', 'Fuiste la figura. Te ponen nota alta en la tapa.', 'star', '#FFD43B'),
        lv(5, 'Ovación en el tercer tiempo', 'Cinco veces figura. Te pagan la cerveza.', 'trophy', '#FAB005'),
        lv(15, 'Diez de la cancha', 'Quince veces figura. Te piden que juegues para los dos equipos.', 'crown', '#E67700'),
      ],
    },
    {
      id: 'muralla', name: 'Valla invicta', measures: 'Partidos ganados sin que te hagan un gol', metric: { type: 'shutoutWins' },
      unit: '{n} vallas invictas', unitOne: '1 valla invicta',
      levels: [
        lv(1, 'Arco en cero', 'Ganaste sin que te hagan un gol. El arquero pide aumento.', 'shield', '#868E96'),
        lv(5, 'Candado', 'Cinco vallas invictas. Adelante del arco hay un candado.', 'shield', '#495057'),
        lv(15, 'Cerrojo italiano', 'Quince partidos sin goles en contra. Catenaccio puro.', 'shield', '#212529'),
      ],
    },
    {
      id: 'rojas', name: 'Carnicero', measures: 'Rojas en total', metric: { type: 'eventTotal', event: 'roja' },
      unit: '{n} rojas', unitOne: '1 roja',
      levels: [
        lv(1, 'Patada de amigo', 'Te echaron una vez. "Fui a la pelota", dijiste.', 'skull', '#FA5252'),
        lv(3, 'Tarjeta en el bolsillo', 'Tres rojas. El árbitro ya la saca antes de que entres.', 'skull', '#E03131'),
        lv(8, 'Leñador', 'Ocho expulsiones. Jugás con hacha.', 'sword', '#C92A2A'),
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
