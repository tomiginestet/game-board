import { lv } from '../kit'
import type { GameDef } from '../schema'

export const running: GameDef = {
  id: 'running',
  name: 'Carrera (running)',
  emoji: '🏃',
  color: '#F03E3E',
  category: 'deporte',
  tagline: 'El que llega último invita las medialunas.',
  players: { min: 2, max: 30 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, time: true, lowWins: true, pointsName: 'tiempo' },
  options: [{ id: 'distance', label: 'Distancia', type: 'select', default: '5K', choices: [{ value: '3K', label: '3 km' }, { value: '5K', label: '5 km' }, { value: '10K', label: '10 km' }, { value: '21K', label: 'Media maratón' }, { value: '42K', label: 'Maratón' }] }],
  events: [],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Primero en la meta', measures: 'Carreras ganadas', metric: { type: 'wins' },
      unit: '{n} carreras', unitOne: '1 carrera',
      levels: [
        lv(3, 'Zapatillas nuevas', 'Tres carreras ganadas. Las zapatillas todavía tienen olor a caja.'),
        lv(10, 'Vuelta a los Lagos', 'Diez victorias: le das la vuelta a Palermo sin parar.'),
        lv(30, 'Zabala del barrio', 'Treinta ganadas. Corrés como Juan Carlos Zabala en Los Ángeles 32.'),
      ],
    },
    {
      id: 'played', name: 'Kilómetros en las piernas', measures: 'Carreras corridas', metric: { type: 'played' },
      unit: '{n} carreras', unitOne: '1 carrera',
      levels: [
        lv(5, 'Medias de compresión', 'Cinco carreras corridas. Ya usás medias de esas.'),
        lv(20, 'Reloj con GPS', 'Veinte carreras: subís todo a Strava.'),
        lv(60, 'Maratonista de fierro', 'Sesenta carreras. Tus rodillas piden vacaciones.'),
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Todos largan juntos. Al terminar se carga el tiempo de cada uno (25:14, o 1:02:05 si pasó la hora).',
    'Gana el más rápido. En partida acumulada se suman los tiempos de varias carreras.',
  ],
  source: 'builtin',
}
