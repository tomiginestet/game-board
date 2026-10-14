import { lv } from '../kit'
import type { GameDef } from '../schema'

export const futsal: GameDef = {
  id: 'futsal',
  name: 'Futsal',
  emoji: '👟',
  color: '#1971C2',
  category: 'deporte',
  tagline: 'Pelota pesada, piso de parquet y la suela que hace magia.',
  players: { min: 4, max: 20 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true, clock: { periods: 2, minutes: 20, minutesOption: 'half' } },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [{ id: 'half', label: 'Cada tiempo', type: 'select', default: 20, choices: [{ value: 15, label: '15 minutos' }, { value: 20, label: '20 minutos' }, { value: 25, label: '25 minutos' }] }],
  events: [
    { id: 'suela', name: 'Jugada de suela', emoji: '👞', type: 'count', byPlayer: true, help: 'Gambeta con la suela que dejó a alguien sentado.' },
    { id: 'amarilla', name: 'Amarilla', emoji: '🟨', type: 'count', byPlayer: true },
    { id: 'roja', name: 'Roja', emoji: '🟥', type: 'count', byPlayer: true },
  ],
  stats: [],
  awards: [
    {
      id: 'goles', name: 'Pivot', measures: 'Goles propios de futsal', metric: { type: 'scored' },
      unit: '{n} goles', unitOne: '1 gol',
      levels: [
        lv(10, 'Pelota de cuero pesado', 'Diez goles con la pelota que no pica.'),
        lv(40, 'Rey del parquet', 'Cuarenta goles: el piso brilla cuando entrás.'),
        lv(120, 'Mundial de Colombia 2016', 'Ciento veinte goles. Campeón del mundo de futsal, como la Selección.'),
      ],
    },
    {
      id: 'suela', name: 'Suela mágica', measures: 'Jugadas de suela', metric: { type: 'eventTotal', event: 'suela' },
      unit: '{n} jugadas de suela', unitOne: '1 jugada de suela',
      levels: [
        lv(3, 'Pisadita', 'Tres jugadas de suela. El rival se quedó mirando el piso.'),
        lv(15, 'Falcão de pasillo', 'Quince jugadas: la suela hace lo que quiere.'),
        lv(40, 'Zapatilla encantada', 'Cuarenta jugadas de suela. Tus zapatillas tienen vida propia.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cinco contra cinco en cancha de piso, con pelota de bote bajo.',
    'Laterales con el pie, faltas acumulativas y el arquero puede jugar con los pies en todo el campo.',
    'Se anota cada gol con su autor y asistencia; al final, la figura.',
  ],
  source: 'builtin',
}
