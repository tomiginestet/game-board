import { lv } from '../kit'
import type { GameDef } from '../schema'

export const pool: GameDef = {
  id: 'pool',
  name: 'Pool',
  emoji: '🎱',
  color: '#1B4332',
  category: 'deporte',
  tagline: 'Tiza en el taco, cara de concentración y la negra que entra antes de tiempo.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 3, targetOption: 'target', quick: [1], quickLabel: 'Ganó la mesa', pointsName: 'mesas' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 3, choices: [{ value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }, { value: 4, label: '4 (al mejor de 7)' }, { value: 1, label: 'Una mesa' }], min: 1, max: 15 },
    { id: 'variant', label: 'Modalidad', type: 'select', default: 'bola8', choices: [{ value: 'bola8', label: 'Bola 8' }, { value: 'bola9', label: 'Bola 9' }, { value: 'pool', label: 'Pool argentino (lisas y rayadas)' }] },
  ],
  events: [
    { id: 'breakRun', name: 'Mesa limpia', emoji: '🧹', type: 'count', help: 'Sacó y metió todas sin que el rival toque el taco.' },
    { id: 'negra', name: 'Metió la negra antes', emoji: '⚫', type: 'count', help: 'Metió la 8 antes de tiempo: perdió la mesa.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Taco de oro', measures: 'Partidas de pool ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(5, 'Tiza azul', 'Cinco partidas ganadas. Ya tenés la tiza en el bolsillo.'),
        lv(20, 'Paño verde', 'Veinte victorias: el dueño del bar te fía la ficha.'),
        lv(60, 'El Buscavidas', 'Sesenta ganadas. Paul Newman te pide consejos.'),
      ],
    },
    {
      id: 'mesasLimpias', name: 'Mesa limpia', measures: 'Mesas limpias desde el saque', metric: { type: 'eventTotal', event: 'breakRun' },
      unit: '{n} mesas limpias', unitOne: '1 mesa limpia',
      levels: [
        lv(1, 'Escoba nueva', 'Tu primera mesa limpia. El rival ni tizó el taco.'),
        lv(5, 'Franela del bar', 'Cinco mesas limpias: no dejás ni el polvo.'),
        lv(15, 'Aspiradora industrial', 'Quince mesas limpias. Te contratan para limpiar el bar.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mano a mano o en parejas. Cada mesa (rack) ganada suma un punto; gana el primero a las acordadas.',
    'Bola 8: uno va a las lisas y otro a las rayadas; gana el que mete la negra al final, cantando la tronera.',
    'Meter la blanca es falta: el rival la pone donde quiere. Meter la negra antes de tiempo pierde la mesa.',
  ],
  source: 'builtin',
}
