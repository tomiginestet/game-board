import type { GameDef } from '../schema'

export const riftbound: GameDef = {
  id: 'riftbound',
  name: 'Riftbound',
  emoji: '🌀',
  color: '#0C8599',
  category: 'tcg',
  tagline: 'El TCG del League of Legends: mismo tilteo, pero con cartas y sin culpar al jungla.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Modo', type: 'select', default: 'duelo',
      choices: [
        { value: 'duelo', label: 'Duelo 1 contra 1' },
        { value: 'escaramuza', label: 'Todos contra todos (3–4)' },
        { value: 'parejas', label: '2 contra 2' },
      ],
    },
  ],
  events: [
    { id: 'conquista', name: 'Conquista', emoji: '🚩', type: 'count', help: 'Tomó el control de un campo de batalla y sumó punto.' },
    { id: 'campeon', name: 'Jugada de campeón', emoji: '🦸', type: 'count', help: 'Su campeón ganó el combate decisivo.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Invocador', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Runa', description: 'Tres partidas ganadas. Tu primera runa ya brilla.', glyph: 'crown', color: '#0C8599' },
        { at: 15, name: 'Nexo', description: 'Quince victorias: defendés el cristal como si fuera tu casa.', glyph: 'crown', color: '#0C8599' },
        { at: 40, name: 'Grieta del Invocador', description: 'Cuarenta partidas ganadas. Te sabés cada arbusto del mapa.', glyph: 'crown', color: '#0C8599' },
      ],
    },
    {
      id: 'conquista', name: 'Conquistador', measures: 'Campos de batalla conquistados', metric: { type: 'eventTotal', event: 'conquista' },
      unit: '{n} conquistas', unitOne: '1 conquista',
      levels: [
        { at: 10, name: 'Torreta', description: 'Diez conquistas. La primera torre cayó en tu turno.', glyph: 'road', color: '#0C8599' },
        { at: 40, name: 'Inhibidor', description: 'Cuarenta conquistas: ya salen súper súbditos de tu lado.', glyph: 'road', color: '#0C8599' },
        { at: 120, name: 'Barón Nashor', description: 'Ciento veinte conquistas. Le robaste el Barón a todo el grupo.', glyph: 'road', color: '#0C8599' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables'],
  rules: [
    'Cada uno juega con una Leyenda, un campeón elegido, un mazo principal y un mazo de runas que dan recursos.',
    'En la mesa hay campos de batalla; mover unidades ahí y ganar el combate da el control.',
    'Conquistar un campo y mantenerlo controlado al empezar el turno suma puntos.',
    'Gana el primero que llega a 8 puntos (en 2 contra 2, el equipo que llega a 11).',
  ],
  rulesUrl: 'https://riftbound.leagueoflegends.com/',
  source: 'builtin',
}
