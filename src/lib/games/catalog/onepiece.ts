import type { GameDef } from '../schema'

export const onepiece: GameDef = {
  id: 'onepiece',
  name: 'One Piece Card Game',
  emoji: '🏴‍☠️',
  color: '#C92A2A',
  category: 'tcg',
  tagline: '¡Voy a ser el Rey de los Piratas! Pero primero dejame mezclar las DON!!',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'estandar',
      choices: [
        { value: 'estandar', label: 'Estándar' },
        { value: 'extra', label: 'Extra Regulation' },
        { value: 'sellado', label: 'Sellado' },
      ],
    },
  ],
  events: [
    { id: 'trigger', name: 'Trigger salvador', emoji: '🍈', type: 'count', help: 'Le sacaron una vida, salió un Trigger y le dio vuelta el turno.' },
    { id: 'contraataque', name: 'Bloqueo con counter', emoji: '🛡️', type: 'count', help: 'Frenó un ataque letal tirando counters desde la mano.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Rey de los Piratas', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Sombrero de paja', description: 'Tres partidas ganadas. Te lo encasquetás y salís a navegar.' },
        { at: 15, name: 'Cartel de Se Busca', description: 'Quince victorias: tu cara en todos los puertos y la recompensa sube.' },
        { at: 40, name: 'Thousand Sunny', description: 'Cuarenta partidas ganadas. Barco propio, con león en la proa y pileta.' },
      ],
    },
    {
      id: 'trigger', name: 'Fruta del diablo', measures: 'Triggers salvadores en total', metric: { type: 'eventTotal', event: 'trigger' },
      unit: '{n} triggers', unitOne: '1 trigger',
      levels: [
        { at: 3, name: 'Fruta Gomu Gomu', description: 'Tres triggers salvadores. Te estirás como chicle y no te alcanzan.' },
        { at: 12, name: 'Haki del Rey', description: 'Doce triggers: con mirar la mesa, el rival se desmaya.' },
        { at: 35, name: 'Gear Fifth', description: 'Treinta y cinco triggers. Te reís, te ponés blanco y la mesa rebota.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cada uno tiene un Líder, un mazo de 50 cartas y uno de 10 DON!! que se usan para pagar y potenciar.',
    'Las vidas son cartas boca abajo (según el Líder, 4 o 5). Cada golpe al Líder pasa una vida a la mano.',
    'Algunas vidas tienen Trigger: al salir se pueden activar gratis.',
    'Los ataques se frenan bloqueando con personajes o tirando counters desde la mano.',
    'Gana el que golpea al Líder rival cuando ya no le quedan vidas.',
  ],
  rulesUrl: 'https://en.onepiece-cardgame.com/rules/',
  source: 'builtin',
}
