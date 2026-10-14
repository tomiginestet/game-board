import { lv } from '../kit'
import type { GameDef } from '../schema'

export const basquet: GameDef = {
  id: 'basquet',
  name: 'Básquet',
  emoji: '🏀',
  color: '#E8590C',
  category: 'deporte',
  tagline: 'El tablero aguanta todo. Tus rodillas, no tanto.',
  players: { min: 4, max: 20 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [2, 3, 1], quickLabel: 'Doble', pointsName: 'puntos' },
  perPlayer: { scorer: true, unit: 'puntos', unitOne: 'punto', assists: true, mvp: true },
  options: [],
  events: [
    { id: 'tapa', name: 'Tapa', emoji: '🖐️', type: 'count', byPlayer: true, help: 'Tapón: bloqueó un tiro.' },
    { id: 'robo', name: 'Robo', emoji: '🥷', type: 'count', byPlayer: true },
    { id: 'volcada', name: 'Volcada', emoji: '💥', type: 'count', byPlayer: true, help: 'Para los que llegan al aro. O los del aro bajo.' },
  ],
  stats: [],
  awards: [
    {
      id: 'puntos', name: 'Anotador', measures: 'Puntos propios en total', metric: { type: 'scored' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        lv(50, 'Tiro de plaza', 'Cincuenta puntos en el aro sin red de la plaza.', 'star', '#FFA94D'),
        lv(250, 'Goleador de la liga', 'Doscientos cincuenta puntos. Te marcan de a dos.', 'trophy', '#F76707'),
        lv(800, 'Manu en San Antonio', 'Ochocientos puntos. Eurostep incluido, como Ginóbili.', 'crown', '#D9480F'),
      ],
    },
    {
      id: 'noche', name: 'Noche de gloria', measures: 'Más puntos propios en un partido', metric: { type: 'scoredMax' },
      unit: '{n} puntos en un partido', unitOne: '1 punto en un partido',
      levels: [
        lv(15, 'Mano caliente', 'Quince puntos en un partido. "He\'s heating up!"', 'flame', '#FFC078'),
        lv(25, 'Aro de jacuzzi', 'Veinticinco puntos: el aro te parece una pileta.', 'flame', '#FD7E14'),
        lv(40, 'Noche de Kobe', 'Cuarenta puntos en un partido. Mamba mentality.', 'bolt', '#E8590C'),
      ],
    },
    {
      id: 'tapas', name: 'Tapón', measures: 'Tapas en total', metric: { type: 'eventTotal', event: 'tapa' },
      unit: '{n} tapas', unitOne: '1 tapa',
      levels: [
        lv(5, 'Mano arriba', 'Cinco tapas. "¡Acá no!", gritaste.', 'shield', '#FFD8A8'),
        lv(20, 'Paraguas', 'Veinte tapas: abajo del aro llueve para los demás.', 'shield', '#FFA94D'),
        lv(60, 'Scola en la pintura', 'Sesenta tapas. La pintura es tuya.', 'shield', '#E8590C'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cinco contra cinco (o los que haya). Doble vale 2, triple 3 y libre 1.',
    'Tocá el lado que anotó: el botón grande suma un doble; abajo están el triple y el libre. Te preguntamos quién fue.',
    'Se juega por tiempo (cuatro cuartos) o a un tanteador acordado; gana el que más puntos tiene.',
  ],
  rulesUrl: 'https://www.fiba.basketball/documents',
  source: 'builtin',
}
