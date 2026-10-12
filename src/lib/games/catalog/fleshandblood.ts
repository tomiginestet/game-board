import type { GameDef } from '../schema'

export const fleshandblood: GameDef = {
  id: 'fleshandblood',
  name: 'Flesh and Blood',
  emoji: '⚔️',
  color: '#862E2E',
  category: 'tcg',
  tagline: 'Un héroe, un arma y la mano entera tirada en un solo ataque. Vivir al límite.',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'counter',
  weight: 3,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 1, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'classic',
      choices: [
        { value: 'classic', label: 'Classic Constructed' },
        { value: 'silverAge', label: 'Silver Age' },
        { value: 'blitz', label: 'Blitz' },
        { value: 'draft', label: 'Draft / Sellado' },
        { value: 'pitFight', label: 'Ultimate Pit Fight (multijugador)' },
      ],
    },
  ],
  events: [
    { id: 'alFilo', name: 'Ganó al filo', emoji: '🩸', type: 'count', help: 'Ganó un game con 1 o 2 de vida.' },
    { id: 'golpazo', name: 'Golpe de 10+', emoji: '💢', type: 'count', help: 'Pegó un ataque de 10 o más de daño.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Héroe de Rathe', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Espada de madera', description: 'Tres partidas ganadas. Entrenás en el patio con una espada de palo.' },
        { at: 15, name: 'Arena de Rathe', description: 'Quince victorias: la arena corea tu nombre.' },
        { at: 40, name: 'Leyenda viviente', description: 'Cuarenta partidas. Te hacen estatua en la plaza del pueblo.' },
      ],
    },
    {
      id: 'alFilo', name: 'Al límite', measures: 'Games ganados con 1 o 2 de vida', metric: { type: 'eventTotal', event: 'alFilo' },
      unit: '{n} games al filo', unitOne: '1 game al filo',
      levels: [
        { at: 1, name: 'Gota de sangre', description: 'Ganaste con una gota de sangre encima. Pura épica.' },
        { at: 5, name: 'Corazón de león', description: 'Cinco games al filo: cuanto menos vida, más fuerte pegás.' },
        { at: 15, name: 'Inmortal de Rathe', description: 'Quince games al filo. Ya nadie cree que puedan matarte.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cada uno elige un héroe (que define la vida y la clase) con su arma y equipo, más un mazo.',
    'Las cartas sirven de tres formas: para atacar, para defender o "pitcheadas" como recurso.',
    'Al final del turno se vuelve a robar hasta completar la mano (4 cartas en general).',
    'Gana el que deja al héroe rival en 0 de vida.',
  ],
  rulesUrl: 'https://fabtcg.com/resources/rules-and-policy-center/',
  source: 'builtin',
}
