import { lv } from '../kit'
import type { GameDef } from '../schema'

export const dardos: GameDef = {
  id: 'dardos',
  name: 'Dardos',
  emoji: '🎯',
  color: '#C92A2A',
  category: 'deporte',
  tagline: 'Apuntaste al 20 y le diste al 1. Clásico.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { target: 501, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [{ id: 'target', label: 'Juego', type: 'number', default: 501, choices: [{ value: 301, label: '301' }, { value: 501, label: '501' }, { value: 701, label: '701' }], min: 50, max: 1001 }],
  events: [
    { id: 'bull', name: 'Bull', emoji: '🔴', type: 'count', help: 'Al centro (50).' },
    { id: 'max180', name: '¡Ciento ochenta!', emoji: '💯', type: 'count', help: 'Tres dardos al triple 20.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pub inglés', measures: 'Partidas de dardos ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(5, 'Pinta tibia', 'Cinco ganadas. La cerveza se calentó mientras apuntabas.'),
        lv(20, 'Diana del pub', 'Veinte victorias: la diana tiene tus agujeritos.'),
        lv(60, 'Robin Hood de bar', 'Sesenta ganadas. Partís un dardo con otro.'),
      ],
    },
    {
      id: 'bulls', name: 'Ojo de toro', measures: 'Bulls en total', metric: { type: 'eventTotal', event: 'bull' },
      unit: '{n} bulls', unitOne: '1 bull',
      levels: [
        lv(3, 'Ternero', 'Tres bulls. Le das al centro de casualidad, pero le das.'),
        lv(15, 'Toro de lidia', 'Quince bulls: no erras el centro ni con los ojos cerrados.'),
        lv(50, 'Ojo de halcón', 'Cincuenta bulls. Ves el centro desde el estacionamiento.'),
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Cada ronda tirás tres dardos y cargás lo que sumaste. Se juega a 301, 501 o 701.',
    'Gana el primero que llega al total (en la regla oficial se baja de 501 a 0 y se cierra con un doble).',
    'El centro (bull) vale 50; el anillo de afuera del centro, 25. Triples y dobles multiplican.',
  ],
  source: 'builtin',
}
