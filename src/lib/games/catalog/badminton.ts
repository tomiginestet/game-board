import { bestOfOption, lv } from '../kit'
import type { GameDef } from '../schema'

export const badminton: GameDef = {
  id: 'badminton',
  name: 'Bádminton',
  emoji: '🏸',
  color: '#7048E8',
  category: 'deporte',
  tagline: 'El volante va a 300 km/h. Tu revés, a 3.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'sets',
  weight: 1,
  scoring: { sets: { kind: 'points', bestOf: 3, bestOfOption: 'bestOf', points: 21, cap: 30 }, pointsName: 'games' },
  options: [bestOfOption(3, [1, 3])],
  events: [{ id: 'smash', name: 'Smash', emoji: '💥', type: 'count', help: 'Remate de arriba que define el punto.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Volante', measures: 'Partidos de bádminton ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Volante en el árbol', 'Cinco partidos ganados. El volante ya no se te queda en el árbol.', 'star', '#B197FC'),
        lv(20, 'Raqueta de cuerda', 'Veinte victorias: tus cuerdas suenan como guitarra.', 'trophy', '#845EF7'),
        lv(50, 'Emperador del volante', 'Cincuenta ganados. En el patio te dicen "el de Indonesia".', 'crown', '#5F3DC4'),
      ],
    },
    {
      id: 'smash', name: 'Smash', measures: 'Smashes ganadores', metric: { type: 'eventTotal', event: 'smash' },
      unit: '{n} smashes', unitOne: '1 smash',
      levels: [
        lv(5, 'Plumas al viento', 'Cinco smashes. Quedaron plumas por todo el patio.', 'bolt', '#D0BFFF'),
        lv(25, 'Gallo desplumado', 'Veinticinco smashes. El volante pide el retiro.', 'bolt', '#9775FA'),
        lv(80, 'Rayo de plumas', 'Ochenta smashes. Nadie ve llegar el volante.', 'bolt', '#6741D9'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Singles o dobles con raqueta y volante, por encima de una red alta.',
    'Cada jugada suma un punto. Games a 21 con dos de diferencia; en 29 iguales, gana el que llega a 30.',
    'Al mejor de 3 games. Se saca de abajo de la cintura y cruzado.',
  ],
  rulesUrl: 'https://corporate.bwfbadminton.com/statutes/',
  source: 'builtin',
}
