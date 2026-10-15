import { lv } from '../kit'
import type { GameDef } from '../schema'

export const hockey: GameDef = {
  id: 'hockey',
  name: 'Hockey',
  emoji: '🏑',
  color: '#862E9C',
  category: 'deporte',
  tagline: 'Palo, bocha y canilleras. El tercer tiempo es obligatorio.',
  players: { min: 4, max: 24 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true, clock: { periods: 4, minutes: 15, minutesOption: 'quarter', periodName: 'cuarto' } },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [{ id: 'quarter', label: 'Cada cuarto', type: 'select', default: 15, choices: [{ value: 10, label: '10 minutos' }, { value: 12, label: '12 minutos' }, { value: 15, label: '15 minutos' }] }],
  events: [
    { id: 'corto', name: 'Gol de corner corto', emoji: '📐', type: 'count', byPlayer: true, help: 'Además del gol: vino de un corner corto.' },
    { id: 'verde', name: 'Tarjeta verde', emoji: '🟩', type: 'count', byPlayer: true },
    { id: 'amarillaHk', name: 'Tarjeta amarilla', emoji: '🟨', type: 'count', byPlayer: true },
  ],
  stats: [],
  awards: [
    {
      id: 'goles', name: 'Palo de oro', measures: 'Goles propios de hockey', metric: { type: 'scored' },
      unit: '{n} goles', unitOne: '1 gol',
      levels: [
        lv(5, 'Bocha a la red', 'Cinco goles: la bocha suena seco contra la tabla.'),
        lv(25, 'Arrastre letal', 'Veinticinco goles. Tu arrastre da miedo.'),
        lv(80, 'Leona del club', 'Ochenta goles. Te ponen en la foto con las Leonas.'),
      ],
    },
    {
      id: 'cortos', name: 'Especialista en cortos', measures: 'Goles de corner corto', metric: { type: 'eventTotal', event: 'corto' },
      unit: '{n} goles de corto', unitOne: '1 gol de corto',
      levels: [
        lv(1, 'Primer arrastre', 'Tu primer gol de corner corto. Salió de manual.'),
        lv(8, 'Jugada preparada', 'Ocho goles de corto: tenés pizarrón propio.'),
        lv(25, 'Cañón del corto', 'Veinticinco goles de corto. La arquera rival reza.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Once contra once (o los que haya) con palo y bocha, en césped sintético.',
    'Sólo se juega con la cara plana del palo; el gol vale si se tira desde adentro del área.',
    'Se anota cada gol con su autor y asistencia; los de corner corto, también como jugada.',
  ],
  source: 'builtin',
}
