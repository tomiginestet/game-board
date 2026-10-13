import type { GameDef } from '../schema'

export const hearthstone: GameDef = {
  id: 'hearthstone',
  name: 'Hearthstone',
  emoji: '🍺',
  color: '#B35C00',
  category: 'video',
  tagline: '¡Bienvenido a la taberna! Sacá tu silla, que hoy el topdeck viene de tu lado.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Modo', type: 'select', default: 'estandar',
      choices: [
        { value: 'estandar', label: 'Estándar' },
        { value: 'salvaje', label: 'Salvaje' },
        { value: 'twist', label: 'Twist' },
        { value: 'arena', label: 'Arena' },
        { value: 'campos', label: 'Campos de batalla (hasta 8)' },
      ],
      help: 'En Campos de batalla, cada game es una partida de 8: gana el último en pie.',
    },
  ],
  events: [
    { id: 'topdeck', name: 'Topdeck salvador', emoji: '🙏', type: 'count', help: 'Robó justo la carta que necesitaba para ganar.' },
    { id: 'letal', name: 'Letal desde vida llena', emoji: '💥', type: 'count', help: 'Le sacó 30 de vida (o lo que tuviera) en un solo turno.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Leyenda', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Jarra de la taberna', description: 'Tres partidas ganadas. El tabernero te invita la primera.', glyph: 'trophy', color: '#B35C00' },
        { at: 15, name: 'Legendaria dorada', description: 'Quince victorias: abriste un sobre y salió brillando.', glyph: 'trophy', color: '#B35C00' },
        { at: 40, name: 'Rango Leyenda', description: 'Cuarenta partidas. Ya tenés número al lado del nombre.', glyph: 'trophy', color: '#B35C00' },
      ],
    },
    {
      id: 'topdeck', name: 'Corazón de las cartas', measures: 'Topdecks salvadores en total', metric: { type: 'eventTotal', event: 'topdeck' },
      unit: '{n} topdecks', unitOne: '1 topdeck',
      levels: [
        { at: 3, name: 'Dedos cruzados', description: 'Tres topdecks salvadores. Cruzaste los dedos y funcionó.', glyph: 'clover', color: '#B35C00' },
        { at: 12, name: '¡Leeroy Jenkins!', description: 'Doce topdecks: entrás gritando tu nombre y sale bien igual.', glyph: 'clover', color: '#B35C00' },
        { at: 35, name: 'Bendición de la RNG', description: 'Treinta y cinco topdecks. El rival denunció la partida por brujería.', glyph: 'clover', color: '#B35C00' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables'],
  rules: [
    'Cada uno elige un héroe de una clase y arma un mazo de 30 cartas; el héroe arranca con 30 de vida.',
    'Cada turno se gana un cristal de maná (hasta 10) para jugar esbirros, hechizos y armas.',
    'Gana el que deja al héroe rival en 0. Entre amigos se juega por partida amistosa, al mejor de N.',
    'Campos de batalla es otra cosa: 8 jugadores reclutan esbirros y se enfrentan hasta que queda uno.',
  ],
  rulesUrl: 'https://hearthstone.blizzard.com/es-es',
  source: 'builtin',
}
