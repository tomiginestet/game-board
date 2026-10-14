import { bestOfOption, lv, setPointsOption } from '../kit'
import type { GameDef } from '../schema'

export const futboltenis: GameDef = {
  id: 'futboltenis',
  name: 'Fútbol tenis',
  emoji: '⚽',
  color: '#37B24D',
  category: 'deporte',
  tagline: 'Un pique, un toque y la red hecha con una soga. Fútbol de verdad.',
  players: { min: 2, max: 6 },
  sides: 'either',
  teamSize: 2,
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'points', bestOf: 3, bestOfOption: 'bestOf', points: 15, pointsOption: 'setPoints' }, pointsName: 'sets' },
  options: [setPointsOption(15, [11, 12, 15, 21]), bestOfOption(3, [1, 3, 5]), { id: 'touches', label: 'Toques por equipo', type: 'select', default: 3, choices: [{ value: 1, label: '1 toque' }, { value: 2, label: '2 toques' }, { value: 3, label: '3 toques' }] }],
  events: [
    { id: 'chilena', name: 'Chilena', emoji: '🤸', type: 'count', help: 'Punto de chilena o de tijera.' },
    { id: 'cabezazo', name: 'Cabezazo ganador', emoji: '🗣️', type: 'count' },
    { id: 'red', name: 'A la red', emoji: '🥅', type: 'count', help: 'Se la comió la red (o la soga).' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pie de seda', measures: 'Partidos de fútbol tenis ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Soga de la ropa', 'Cinco partidos ganados con la red atada al tender.', 'road', '#82C91E'),
        lv(20, 'Playa de Copacabana', 'Veinte victorias: jugás descalzo y con anteojos de sol.', 'star', '#37B24D'),
        lv(60, 'Ronaldinho en la arena', 'Sesenta ganados. La pelota no toca el piso ni para descansar.', 'crown', '#2B8A3E'),
      ],
    },
    {
      id: 'chilena', name: 'Acróbata', measures: 'Puntos de chilena', metric: { type: 'eventTotal', event: 'chilena' },
      unit: '{n} chilenas', unitOne: '1 chilena',
      levels: [
        lv(1, 'Patada voladora', 'Tu primera chilena en la red. Caíste mal, pero valió.', 'rocket', '#FAB005'),
        lv(5, 'Mortal atrás', 'Cinco chilenas. El kinesiólogo ya te reserva turno.', 'rocket', '#F59F00'),
        lv(15, 'Hombre bala', 'Quince chilenas. Te contrata el Circo de Moscú.', 'rocket', '#E67700'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cancha dividida por una red baja (o una soga). De a uno, de a dos o de a tres por lado.',
    'Se juega con los pies, la cabeza o el pecho; nunca con las manos.',
    'Se permite un pique en tu campo y los toques que acuerden por equipo (lo clásico: hasta 3).',
    'Cada set se gana a los puntos acordados con dos de diferencia. Al mejor de 3 sets.',
  ],
  source: 'builtin',
}
