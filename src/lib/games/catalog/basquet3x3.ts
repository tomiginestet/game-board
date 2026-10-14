import { lv } from '../kit'
import type { GameDef } from '../schema'

export const basquet3x3: GameDef = {
  id: 'basquet3x3',
  name: 'Básquet 3x3 (a 21)',
  emoji: '⛹️',
  color: '#C2255C',
  category: 'deporte',
  tagline: 'Medio aro, tres contra tres y el que pierde sale. Clásico de plaza.',
  players: { min: 2, max: 8 },
  sides: 'teams',
  teamSize: 1,
  mode: 'counter',
  weight: 1,
  scoring: { target: 21, targetOption: 'target', quick: [1, 2], quickLabel: 'Adentro', pointsName: 'puntos' },
  perPlayer: { scorer: true, unit: 'puntos', unitOne: 'punto', mvp: true },
  options: [{ id: 'target', label: 'A cuántos', type: 'number', default: 21, choices: [{ value: 11, label: 'A 11' }, { value: 15, label: 'A 15' }, { value: 21, label: 'A 21' }], min: 5, max: 50 }],
  events: [{ id: 'tapa3', name: 'Tapa', emoji: '🖐️', type: 'count', byPlayer: true }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Medio aro', measures: 'Partidos de 3x3 ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Ganador se queda', 'Cinco partidos ganados. No te saca nadie de la cancha.'),
        lv(20, 'Rey de la plaza', 'Veinte victorias: la fila para jugarte da vuelta a la manzana.'),
        lv(60, 'Streetball de Harlem', 'Sesenta ganados. Te filman para un video de zapatillas.'),
      ],
    },
    {
      id: 'puntos3', name: 'Tiro de afuera', measures: 'Puntos propios en 3x3', metric: { type: 'scored' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        lv(30, 'Tiro de vereda', 'Treinta puntos: tirás desde el cordón.'),
        lv(150, 'Aro sin red', 'Ciento cincuenta puntos. Ni necesitás que haya red para saber que entró.'),
        lv(500, 'Leyenda del potrero de cemento', 'Quinientos puntos. Tu nombre está grafiteado en el tablero.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Tres contra tres (o de a uno, dos...) a medio aro. Adentro de la línea vale 1; de afuera, 2.',
    'Después de cada tanto o rebote defensivo, la pelota tiene que salir afuera de la línea de 3.',
    'Gana el primero que llega a 21 (o a lo acordado).',
  ],
  source: 'builtin',
}
