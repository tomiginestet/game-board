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
  scoring: { quick: [1], quickLabel: 'Gol', pointsName: 'goles', allowDraw: true },
  perPlayer: { scorer: true, unit: 'goles', unitOne: 'gol', assists: true, mvp: true },
  options: [],
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
        lv(10, 'Pelota de cuero pesado', 'Diez goles con la pelota que no pica.', 'star', '#74C0FC'),
        lv(40, 'Rey del parquet', 'Cuarenta goles: el piso brilla cuando entrás.', 'trophy', '#339AF0'),
        lv(120, 'Mundial de Colombia 2016', 'Ciento veinte goles. Campeón del mundo de futsal, como la Selección.', 'crown', '#1864AB'),
      ],
    },
    {
      id: 'suela', name: 'Suela mágica', measures: 'Jugadas de suela', metric: { type: 'eventTotal', event: 'suela' },
      unit: '{n} jugadas de suela', unitOne: '1 jugada de suela',
      levels: [
        lv(3, 'Pisadita', 'Tres jugadas de suela. El rival se quedó mirando el piso.', 'eye', '#A5D8FF'),
        lv(15, 'Falcão de pasillo', 'Quince jugadas: la suela hace lo que quiere.', 'gem', '#4DABF7'),
        lv(40, 'Zapatilla encantada', 'Cuarenta jugadas de suela. Tus zapatillas tienen vida propia.', 'gem', '#1971C2'),
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
