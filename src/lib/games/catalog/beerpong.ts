import { lv } from '../kit'
import type { GameDef } from '../schema'

export const beerpong: GameDef = {
  id: 'beerpong',
  name: 'Beer pong',
  emoji: '🍺',
  color: '#E03131',
  category: 'fiesta',
  tagline: 'La puntería empeora con cada vaso. Por diseño.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 10, targetOption: 'target', quick: [1], quickLabel: 'Vaso', pointsName: 'vasos' },
  options: [{ id: 'target', label: 'Vasos por lado', type: 'number', default: 10, choices: [{ value: 6, label: '6 vasos' }, { value: 10, label: '10 vasos' }], min: 3, max: 15 }],
  events: [{ id: 'rebote', name: 'De rebote', emoji: '🏓', type: 'count', help: 'Entró después de picar en la mesa (en muchas casas vale doble).' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Vaso rojo', measures: 'Partidas de beer pong ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(3, 'Vaso de plástico', 'Tres ganadas. El primer vaso rojo de tu colección.'),
        lv(10, 'Pinza de cirujano', 'Diez victorias: tirás igual de bien en el vaso diez que en el uno.'),
        lv(30, 'Leyenda de la previa', 'Treinta ganadas. Te invitan a las fiestas sólo por la mesa.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Dos lados con vasos en triángulo en cada punta de la mesa. Se tira la pelotita por turnos.',
    'Cada vaso embocado suma uno (y el rival lo saca). Gana el primero que emboca todos los del otro lado.',
    'Con agua también vale. Tomá con responsabilidad.',
  ],
  source: 'builtin',
}
