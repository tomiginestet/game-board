import { lv } from '../kit'
import type { GameDef } from '../schema'

export const travesano: GameDef = {
  id: 'travesano',
  name: 'Desafío del travesaño',
  emoji: '🎯',
  color: '#5C940D',
  category: 'deporte',
  tagline: 'Desde la mitad de la cancha, al travesaño. Si pega, "¡clang!" y gloria eterna.',
  players: { min: 2, max: 12 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 3, targetOption: 'target', quick: [1], quickLabel: 'Travesaño', pointsName: 'travesaños' },
  options: [{ id: 'target', label: 'Gana el primero a', type: 'number', default: 3, choices: [{ value: 1, label: '1 travesaño' }, { value: 3, label: '3 travesaños' }, { value: 5, label: '5 travesaños' }], min: 1, max: 10 }],
  events: [{ id: 'palito', name: 'Palo (no vale)', emoji: '🥅', type: 'count', help: 'Pegó en el palo vertical. Casi.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Clang', measures: 'Desafíos del travesaño ganados', metric: { type: 'wins' },
      unit: '{n} desafíos', unitOne: '1 desafío',
      levels: [
        lv(3, 'Campana de iglesia', 'Tres desafíos ganados. El "clang" se escucha a dos cuadras.'),
        lv(10, 'Pie de calibre', 'Diez desafíos: medís la distancia con el empeine.'),
        lv(30, 'Leyenda del entrenamiento', 'Treinta ganados. Los del club se quedan después de la práctica para verte.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Desde la distancia acordada, cada uno patea por turno al travesaño.',
    'Sólo vale si pega en el travesaño (el palo vertical no cuenta). Gana el primero a los acordados.',
  ],
  source: 'builtin',
}
