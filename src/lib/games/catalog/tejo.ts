import { lv } from '../kit'
import type { GameDef } from '../schema'

export const tejo: GameDef = {
  id: 'tejo',
  name: 'Tejo',
  emoji: '🏖️',
  color: '#F08C00',
  category: 'deporte',
  tagline: 'Arena, tejos de metal y el tío que mide con la ojota.',
  players: { min: 2, max: 8 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 15, targetOption: 'target', quick: [1], quickLabel: 'Punto', pointsName: 'puntos' },
  options: [{ id: 'target', label: 'A cuántos puntos', type: 'number', default: 15, choices: [{ value: 10, label: 'A 10' }, { value: 15, label: 'A 15' }, { value: 21, label: 'A 21' }], min: 5, max: 30 }],
  events: [{ id: 'arriba', name: 'Arriba del tejín', emoji: '🪙', type: 'count', help: 'El tejo quedó arriba del tejín.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Tejo de playa', measures: 'Partidos de tejo ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Ojota de medir', 'Cinco partidos ganados. La ojota es la cinta métrica oficial.'),
        lv(20, 'Sombrilla propia', 'Veinte victorias: la sombrilla del tejo es tuya.'),
        lv(50, 'Rey de Villa Gesell', 'Cincuenta ganados. Te esperan cada enero en la bajada de la 3.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Se tira el tejín y después los tejos, tratando de dejarlos lo más cerca posible.',
    'Suma cada tejo propio más cerca que el mejor del rival. Gana el primero a los puntos acordados.',
  ],
  source: 'builtin',
}
