import { lv } from '../kit'
import type { GameDef } from '../schema'

export const handball: GameDef = {
  id: 'handball',
  name: 'Handball',
  emoji: '🤾',
  color: '#5C940D',
  category: 'deporte',
  tagline: 'Fútbol con las manos, pero sin que nadie te lo cobre.',
  players: { min: 4, max: 20 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [],
  events: [
    { id: 'atajadaHb', name: 'Atajada', emoji: '🧤', type: 'count', byPlayer: true },
    { id: 'exclusion', name: 'Exclusión (2 min)', emoji: '⏱️', type: 'count', byPlayer: true },
  ],
  stats: [],
  awards: [
    {
      id: 'goles', name: 'Lanzador', measures: 'Goles propios de handball', metric: { type: 'scored' },
      unit: '{n} goles', unitOne: '1 gol',
      levels: [
        lv(10, 'Brazo de goma', 'Diez goles. El brazo se estira como chicle.', 'star', '#A9E34B'),
        lv(50, 'Lanzamiento en suspensión', 'Cincuenta goles: volás arriba del área.', 'rocket', '#74B816'),
        lv(150, 'Gladiador del área', 'Ciento cincuenta goles, como los Gladiadores en el Mundial.', 'crown', '#5C940D'),
      ],
    },
    {
      id: 'atajadas', name: 'Arquero de handball', measures: 'Atajadas en total', metric: { type: 'eventTotal', event: 'atajadaHb' },
      unit: '{n} atajadas', unitOne: '1 atajada',
      levels: [
        lv(10, 'Estrella de mar', 'Diez atajadas abierto de brazos y piernas.', 'shield', '#D8F5A2'),
        lv(40, 'Arco tapado', 'Cuarenta atajadas: el arco parece más chico.', 'shield', '#94D82D'),
        lv(120, 'Pared de goma', 'Ciento veinte atajadas. La pelota te rebota hasta en la cara.', 'shield', '#66A80F'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Siete contra siete (uno al arco) en cancha con área de 6 metros que sólo pisa el arquero.',
    'Se juega con las manos: tres pasos con la pelota y hasta tres segundos sin picarla.',
    'Gana el que hace más goles en dos tiempos.',
  ],
  source: 'builtin',
}
