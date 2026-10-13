import type { GameDef } from '../schema'

export const dragonball: GameDef = {
  id: 'dragonball',
  name: 'Dragon Ball Super Card Game',
  emoji: '🐉',
  color: '#F08C00',
  category: 'tcg',
  tagline: 'Tres turnos cargando el Kamehameha y el rival sigue gritando. Como en la tele.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Versión', type: 'select', default: 'fusionWorld',
      choices: [
        { value: 'fusionWorld', label: 'Fusion World' },
        { value: 'masters', label: 'Masters' },
      ],
    },
  ],
  events: [
    { id: 'despertar', name: 'Despertar', emoji: '💛', type: 'count', help: 'Su Líder despertó (se dio vuelta) con poca vida.' },
    { id: 'remate', name: 'Remate', emoji: '🔥', type: 'count', help: 'Le sacó la última vida al Líder rival.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Esferas del Dragón', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Esfera de cuatro estrellas', description: 'Tres partidas ganadas. La esfera del abuelo Gohan ya es tuya.', glyph: 'star', color: '#F08C00' },
        { at: 15, name: 'Radar del Dragón', description: 'Quince victorias: el radar titila y sabés dónde están todas.', glyph: 'star', color: '#F08C00' },
        { at: 40, name: 'Shenlong', description: 'Cuarenta partidas. Se oscurece el cielo y te concede un deseo.', glyph: 'star', color: '#F08C00' },
      ],
    },
    {
      id: 'despertar', name: 'Transformación', measures: 'Despertares en total', metric: { type: 'eventTotal', event: 'despertar' },
      unit: '{n} despertares', unitOne: '1 despertar',
      levels: [
        { at: 3, name: 'Super Saiyajin', description: 'Tres despertares. Pelo amarillo parado y cara de pocos amigos.', glyph: 'flame', color: '#F08C00' },
        { at: 12, name: 'Super Saiyajin Blue', description: 'Doce despertares: el pelo se te puso celeste y ni pestañeás.', glyph: 'flame', color: '#F08C00' },
        { at: 35, name: 'Ultra Instinto', description: 'Treinta y cinco despertares. Esquivás sin pensar, con el pelo plateado.', glyph: 'flame', color: '#F08C00' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cada uno juega con un Líder, un mazo de 50 cartas y un área de energía para pagar costos.',
    'El Líder arranca con 8 vidas (Fusion World); cada golpe le saca una que pasa a la mano.',
    'Con poca vida, el Líder puede despertar: se da vuelta y se vuelve más fuerte.',
    'Los ataques se frenan bloqueando o con cartas de combo desde la mano.',
    'Gana el que le pega al Líder rival cuando ya no tiene vidas.',
  ],
  rulesUrl: 'https://www.dbs-cardgame.com/fw/en/rule/',
  source: 'builtin',
}
