import { lv } from '../kit'
import type { GameDef } from '../schema'

export const paleta: GameDef = {
  id: 'paleta',
  name: 'Pelota paleta (frontón)',
  emoji: '🪵',
  color: '#A61E4D',
  category: 'deporte',
  tagline: 'Un frontón, una paleta de madera y el club de barrio de toda la vida.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { target: 30, targetOption: 'target', quick: [1], quickLabel: 'Tanto', pointsName: 'tantos' },
  options: [{ id: 'target', label: 'A cuántos tantos', type: 'number', default: 30, choices: [{ value: 15, label: 'A 15' }, { value: 25, label: 'A 25' }, { value: 30, label: 'A 30' }], min: 5, max: 40 }],
  events: [{ id: 'buzon', name: 'Al buzón', emoji: '📮', type: 'count', help: 'Pelota que entra al rincón y no vuelve más.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Frontón', measures: 'Partidos de paleta ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Paleta de pino', 'Cinco partidos ganados. La paleta todavía tiene astillas.'),
        lv(20, 'Pared del club', 'Veinte victorias: la pared tiene tu marca de tanto pegarle.'),
        lv(60, 'Vasco del barrio', 'Sesenta ganados. Te invitan a jugar a Euskadi con boina.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Se juega contra un frontón con paleta de madera y pelota de goma, mano a mano o en parejas.',
    'La pelota tiene que pegar en la pared por encima de la chapa y picar dentro de la cancha.',
    'Se puede devolver de volea o después de un pique. Se suma un tanto por jugada ganada.',
    'Gana el primero que llega a los tantos acordados (30 es lo clásico).',
  ],
  source: 'builtin',
}
