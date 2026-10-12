import type { GameDef } from '../schema'

export const domino: GameDef = {
  id: 'domino',
  name: 'Dominó',
  emoji: '🁫',
  color: '#3D3D3D',
  category: 'clasico',
  tagline: 'Golpeá la ficha contra la mesa, que si no hace ruido no vale.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'rounds',
  weight: 2,
  scoring: { target: 100, targetOption: 'target', scorer: 'sum', pointsName: 'tantos' },
  options: [
    { id: 'target', label: 'A cuánto', type: 'number', default: 100, choices: [{ value: 100, label: 'A 100' }, { value: 200, label: 'A 200' }], min: 50, max: 500 },
  ],
  events: [
    { id: 'domino', name: 'Dominó', emoji: '🙌', type: 'count', help: 'Se quedó sin fichas y cerró la mano.' },
    { id: 'tranque', name: 'Ganó el tranque', emoji: '🚧', type: 'count', help: 'La mano se trabó y ganó por tener menos puntos.' },
    { id: 'capicua', name: 'Capicúa', emoji: '🔁', type: 'count', help: 'Cerró con una ficha que entraba por las dos puntas.' },
  ],
  stats: [],
  awards: [
    {
      id: 'dominos', name: 'Dominó', measures: 'Manos cerradas con dominó', metric: { type: 'eventTotal', event: 'domino' },
      unit: '{n} dominós', unitOne: '1 dominó',
      levels: [
        { at: 10, name: 'Mesa de plaza', description: 'Diez dominós. Ya tenés banco fijo bajo el ombú.' },
        { at: 40, name: 'Club de jubilados', description: 'Cuarenta dominós: te guardan la silla y el cortado.' },
        { at: 120, name: 'Patriarca de la cuadra', description: 'Ciento veinte dominós. Los vecinos te consultan antes de mover una ficha.' },
      ],
    },
    {
      id: 'capicua', name: 'Capicúa', measures: 'Capicúas en total', metric: { type: 'eventTotal', event: 'capicua' },
      unit: '{n} capicúas', unitOne: '1 capicúa',
      levels: [
        { at: 1, name: 'Boleto capicúa', description: 'Tu primera capicúa. Como el boleto de colectivo que guardabas de pibe.' },
        { at: 5, name: 'Patente capicúa', description: 'Cinco capicúas: hasta el auto te sale simétrico.' },
        { at: 15, name: 'Reloj a las 12:21', description: 'Quince capicúas. Mirás la hora y siempre te devuelve el guiño.' },
      ],
    },
    {
      id: 'tranques', name: 'Trancador', measures: 'Tranques ganados en total', metric: { type: 'eventTotal', event: 'tranque' },
      unit: '{n} tranques', unitOne: '1 tranque',
      levels: [
        { at: 3, name: 'Calle cortada', description: 'Tres tranques ganados. Pusiste el cono y nadie pasa.' },
        { at: 12, name: 'Piquete en el puente', description: 'Doce tranques: cortaste el Pueyrredón y te quedaste con la mano.' },
        { at: 35, name: 'General Paz trabada', description: 'Treinta y cinco tranques. Hora pico permanente, y vos ganás igual.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    '28 fichas (doble seis); con 4 jugadores se reparten 7 a cada uno; con menos, se roba del pozo o se pasa.',
    'Sale el doble seis (o el que corresponda) y se juega por turno empalmando fichas con el mismo número en las puntas.',
    'El que se queda sin fichas hace dominó y se anota la suma de los puntos que les quedan a los rivales.',
    'Si nadie puede jugar se tranca: gana la mano quien (o la pareja que) tiene menos puntos.',
    'Se juega a 100 o 200 tantos, individual o en parejas enfrentadas.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Domin%C3%B3',
  source: 'builtin',
}
