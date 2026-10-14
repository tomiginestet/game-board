import { lv } from '../kit'
import type { GameDef } from '../schema'

export const natacion: GameDef = {
  id: 'natacion',
  name: 'Natación',
  emoji: '🏊',
  color: '#1098AD',
  category: 'deporte',
  tagline: 'Gorra, antiparras y el andarivel de los lentos siempre lleno.',
  players: { min: 2, max: 12 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, time: true, lowWins: true, pointsName: 'tiempo' },
  options: [
    { id: 'distance', label: 'Distancia', type: 'select', default: '100', choices: [{ value: '50', label: '50 m' }, { value: '100', label: '100 m' }, { value: '200', label: '200 m' }, { value: '400', label: '400 m' }, { value: '1500', label: '1500 m' }] },
    { id: 'stroke', label: 'Estilo', type: 'select', default: 'crol', choices: [{ value: 'crol', label: 'Crol' }, { value: 'espalda', label: 'Espalda' }, { value: 'pecho', label: 'Pecho' }, { value: 'mariposa', label: 'Mariposa' }, { value: 'combinado', label: 'Combinado' }] },
  ],
  events: [],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pez', measures: 'Carreras de natación ganadas', metric: { type: 'wins' },
      unit: '{n} carreras', unitOne: '1 carrera',
      levels: [
        lv(3, 'Patito de goma', 'Tres carreras ganadas. Flotás con estilo.'),
        lv(10, 'Delfín de pileta', 'Diez victorias: hacés la vuelta olímpica en la pared.'),
        lv(30, 'Meolans de club', 'Treinta ganadas. Te piden autógrafos en el vestuario.'),
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Se larga junto (o por series). Se carga el tiempo de cada uno como en el reloj: 1:12 o 0:58.',
    'Gana el más rápido.',
  ],
  source: 'builtin',
}
