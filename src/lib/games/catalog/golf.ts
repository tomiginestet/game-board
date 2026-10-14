import { lv } from '../kit'
import type { GameDef } from '../schema'

export const golf: GameDef = {
  id: 'golf',
  name: 'Golf',
  emoji: '🏌️',
  color: '#087F5B',
  category: 'deporte',
  tagline: 'Un paseo arruinado por una pelotita blanca, como decía Mark Twain.',
  players: { min: 1, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { rounds: 18, roundsOption: 'holes', lowWins: true, scorer: 'sum', pointsName: 'golpes' },
  options: [{ id: 'holes', label: 'Hoyos', type: 'select', default: 18, choices: [{ value: 9, label: '9 hoyos' }, { value: 18, label: '18 hoyos' }] }],
  events: [
    { id: 'birdie', name: 'Birdie', emoji: '🐦', type: 'count', help: 'Un golpe menos que el par del hoyo.' },
    { id: 'eagle', name: 'Eagle', emoji: '🦅', type: 'count', help: 'Dos golpes menos que el par.' },
    { id: 'aceGolf', name: 'Hoyo en uno', emoji: '🕳️', type: 'count' },
  ],
  stats: [],
  awards: [
    {
      id: 'birdies', name: 'Pajarero', measures: 'Birdies en total', metric: { type: 'eventTotal', event: 'birdie' },
      unit: '{n} birdies', unitOne: '1 birdie',
      levels: [
        lv(3, 'Gorrión del green', 'Tres birdies. Cantan los pajaritos del hoyo 7.'),
        lv(15, 'Hornero del club', 'Quince birdies: hacés nido en el green.'),
        lv(50, 'Cóndor de los Andes', 'Cincuenta birdies. Volás más alto que todos.'),
      ],
    },
    {
      id: 'wins', name: 'Chaqueta verde', measures: 'Vueltas de golf ganadas', metric: { type: 'wins' },
      unit: '{n} vueltas', unitOne: '1 vuelta',
      levels: [
        lv(3, 'Carrito eléctrico', 'Tres vueltas ganadas. Ya manejás el carrito sin chocar.'),
        lv(10, 'Pato de Rosario', 'Diez victorias: el swing ya es de Ángel Cabrera.'),
        lv(30, 'Augusta en el barrio', 'Treinta ganadas. Te prueban la chaqueta verde.'),
      ],
    },
  ],
  formats: ['knockout', 'series'],
  rules: [
    'Cada hoyo se carga con los golpes que necesitó cada uno (golpes brutos o netos, como acuerden).',
    'Al terminar la vuelta gana el que tiene menos golpes.',
    'Anotá los birdies y eagles para las medallas.',
  ],
  source: 'builtin',
}
