import type { GameDef } from '../schema'

/** El ping pong usa el marcador y los logros propios del Ping Pong Club (y comparte sus datos). */
export const pingpong: GameDef = {
  id: 'pingpong',
  name: 'Ping pong',
  emoji: '🏓',
  color: '#2F9E44',
  category: 'deporte',
  tagline: 'Si toca la red y entra, se pide disculpas igual.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'rally',
  weight: 2,
  scoring: {},
  options: [],
  events: [],
  stats: [],
  awards: [],
  formats: ['knockout', 'league'],
  rules: [
    'Cada juego se gana a 11 puntos con 2 de diferencia (configurable: 21, 4, lo que quieran).',
    'Se sacan 2 puntos seguidos cada uno; en el deuce se alterna punto a punto.',
    'El partido es al mejor de 3, 5 o los juegos que elijan.',
    'En dobles se saca cruzado, de la mitad derecha a la mitad derecha.',
  ],
  rulesUrl: 'https://www.ittf.com/handbook/',
  source: 'builtin',
}
