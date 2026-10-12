import type { GameDef } from '../schema'

export const lorcana: GameDef = {
  id: 'lorcana',
  name: 'Disney Lorcana',
  emoji: '✨',
  color: '#1864AB',
  category: 'tcg',
  tagline: 'Stitch y la Bella Durmiente en la misma mesa. Y vos cantando "Hakuna Matata" para ganar.',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'core',
      choices: [
        { value: 'core', label: 'Core (constructed)' },
        { value: 'infinito', label: 'Infinity' },
        { value: 'sellado', label: 'Draft / Sellado' },
      ],
    },
  ],
  events: [
    { id: 'cancion', name: 'Cantó una canción', emoji: '🎤', type: 'count', help: 'Agotó personajes para cantar una canción gratis.' },
    { id: 'desafio', name: 'Desafío ganado', emoji: '🤺', type: 'count', help: 'Desafió a un personaje agotado y lo desterró.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Ilumineer', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Gota de tinta', description: 'Tres partidas ganadas. Tu primera gota de tinta mágica.', glyph: 'gem', color: '#1864AB' },
        { at: 15, name: 'Tintero mágico', description: 'Quince victorias: el tintero rebalsa y salen personajes solos.', glyph: 'gem', color: '#1864AB' },
        { at: 40, name: 'Gran Ilumineer', description: 'Cuarenta partidas. Te dejan entrar a la Gran Iluminaria sin tocar el timbre.', glyph: 'gem', color: '#1864AB' },
      ],
    },
    {
      id: 'cancion', name: 'Musical', measures: 'Canciones cantadas en total', metric: { type: 'eventTotal', event: 'cancion' },
      unit: '{n} canciones', unitOne: '1 canción',
      levels: [
        { at: 5, name: 'Cantor de ducha', description: 'Cinco canciones. Afinás perfecto, siempre que nadie escuche.', glyph: 'heart', color: '#1864AB' },
        { at: 20, name: 'Karaoke de los viernes', description: 'Veinte canciones: el micrófono ya sabe tu nombre.', glyph: 'heart', color: '#1864AB' },
        { at: 60, name: 'Gala en el castillo', description: 'Sesenta canciones. Cerrás la función con fuegos artificiales sobre el castillo.', glyph: 'heart', color: '#1864AB' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables'],
  rules: [
    'Mazos de 60 cartas de hasta dos tintas (colores). Se arranca con siete cartas en la mano.',
    'Una vez por turno se puede poner una carta en el tintero, boca abajo, para usarla de tinta.',
    'Los personajes "exploran" para ganar lore o desafían a personajes agotados del rival.',
    'Las canciones se pueden cantar gratis agotando personajes de costo suficiente.',
    'Gana el primero que junta 20 de lore; también pierde el que tiene que robar sin cartas.',
  ],
  rulesUrl: 'https://www.disneylorcana.com/es-ES/resources',
  source: 'builtin',
}
