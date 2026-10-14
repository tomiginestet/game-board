import { lv } from '../kit'
import type { GameDef } from '../schema'

export const penales: GameDef = {
  id: 'penales',
  name: 'Tanda de penales',
  emoji: '🥅',
  color: '#495057',
  category: 'deporte',
  tagline: 'Once metros, un arquero que baila y toda la presión del mundo.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 5, targetOption: 'target', quick: [1], quickLabel: 'Gol', pointsName: 'goles' },
  options: [{ id: 'target', label: 'Gana el primero a', type: 'number', default: 5, choices: [{ value: 3, label: '3 goles' }, { value: 5, label: '5 goles' }, { value: 10, label: '10 goles' }], min: 1, max: 20 }],
  events: [
    { id: 'atajado', name: 'Se lo atajaron', emoji: '🧤', type: 'count' },
    { id: 'palo', name: 'Palo', emoji: '🪵', type: 'count' },
    { id: 'panenka', name: 'Panenka', emoji: '🥄', type: 'count', help: 'Picadita al medio, con el arquero ya en el piso.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pateador', measures: 'Tandas ganadas', metric: { type: 'wins' },
      unit: '{n} tandas', unitOne: '1 tanda',
      levels: [
        lv(3, 'Pie firme', 'Tres tandas ganadas. Ni te tiembla la pierna.'),
        lv(10, 'Sangre fría', 'Diez tandas: pateás mirando al arquero a los ojos.'),
        lv(30, 'Montiel en Lusail', 'Treinta tandas ganadas. Ya sabés cómo termina la historia.'),
      ],
    },
    {
      id: 'panenka', name: 'Picadita', measures: 'Penales picados a lo Panenka', metric: { type: 'eventTotal', event: 'panenka' },
      unit: '{n} panenkas', unitOne: '1 panenka',
      levels: [
        lv(1, 'Cuchara', 'Tu primera Panenka. Si la errabas, te mudabas.'),
        lv(5, 'Abreu en Sudáfrica', 'Cinco picaditas. El Loco estaría orgulloso.'),
        lv(15, 'Nervios de acero', 'Quince Panenkas. Te dicen "el cuchara".'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cada uno patea por turno; el botón grande suma un gol al que acaba de patear.',
    'Gana el primero que llega a los goles acordados (o hagan 5 cada uno y después muerte súbita).',
  ],
  source: 'builtin',
}
