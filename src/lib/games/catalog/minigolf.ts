import { lv } from '../kit'
import type { GameDef } from '../schema'

export const minigolf: GameDef = {
  id: 'minigolf',
  name: 'Minigolf',
  emoji: '⛳',
  color: '#20C997',
  category: 'deporte',
  tagline: 'El molino de viento te odia personalmente.',
  players: { min: 1, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { rounds: 18, roundsOption: 'holes', lowWins: true, scorer: 'sum', pointsName: 'golpes' },
  options: [{ id: 'holes', label: 'Hoyos', type: 'select', default: 18, choices: [{ value: 9, label: '9 hoyos' }, { value: 18, label: '18 hoyos' }] }],
  events: [{ id: 'hoyoEnUno', name: 'Hoyo en uno', emoji: '🕳️', type: 'count' }],
  stats: [],
  awards: [
    {
      id: 'hoyoEnUno', name: 'De un golpe', measures: 'Hoyos en uno de minigolf', metric: { type: 'eventTotal', event: 'hoyoEnUno' },
      unit: '{n} hoyos en uno', unitOne: '1 hoyo en uno',
      levels: [
        lv(1, 'Por el molino', 'Hoyo en uno pasando por el molino. Grabalo.', 'clover', '#96F2D7'),
        lv(5, 'Payaso domado', 'Cinco hoyos en uno: por la boca del payaso, siempre.', 'clover', '#38D9A9'),
        lv(15, 'Mini Tiger', 'Quince hoyos en uno. Tiger Woods de vacaciones en la costa.', 'crown', '#099268'),
      ],
    },
    {
      id: 'wins', name: 'Minigolfista', measures: 'Partidas de minigolf ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(3, 'Palo prestado', 'Tres ganadas con el palo que te dieron en la entrada.', 'star', '#C3FAE8'),
        lv(10, 'Pelotita de color', 'Diez victorias: siempre pedís la naranja, por cábala.', 'coin', '#63E6BE'),
        lv(30, 'Dueño del castillito', 'Treinta ganadas. El castillito del hoyo 9 lleva tu nombre.', 'house', '#0CA678'),
      ],
    },
  ],
  formats: ['knockout', 'series'],
  rules: [
    'Cada hoyo se carga con los golpes que necesitó cada uno.',
    'Al terminar los 9 o 18 hoyos gana el que tiene menos golpes.',
    'Lo clásico: tope de 6 golpes por hoyo, para que nadie quede atrapado en el molino.',
  ],
  source: 'builtin',
}
