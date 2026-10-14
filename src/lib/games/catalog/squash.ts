import { bestOfOption, lv } from '../kit'
import type { GameDef } from '../schema'

export const squash: GameDef = {
  id: 'squash',
  name: 'Squash',
  emoji: '🟡',
  color: '#E67700',
  category: 'deporte',
  tagline: 'Una caja cerrada, una pelota de goma y un rival que no te deja pasar. Terapia.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'points', bestOf: 5, bestOfOption: 'bestOf', points: 11 }, pointsName: 'games' },
  options: [bestOfOption(5, [3, 5])],
  events: [{ id: 'nick', name: 'Al rincón', emoji: '📐', type: 'count', help: 'Tiro al rincón entre la pared y el piso: imposible de devolver.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Caja de cristal', measures: 'Partidos de squash ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Pelota de punto amarillo', 'Cinco partidos ganados. Ya calentás la pelota antes de empezar.'),
        lv(20, 'Rey del T', 'Veinte victorias: dominás el centro de la cancha.'),
        lv(50, 'Pared de enfrente', 'Cincuenta ganados. La pared te devuelve todo, como vos.'),
      ],
    },
    {
      id: 'nicks', name: 'Rincón', measures: 'Tiros al rincón ganadores', metric: { type: 'eventTotal', event: 'nick' },
      unit: '{n} rincones', unitOne: '1 rincón',
      levels: [
        lv(3, 'Escuadra', 'Tres tiros al rincón. Medís los ángulos con transportador.'),
        lv(15, 'Billarista', 'Quince rincones. Le das efecto como en el pool.'),
        lv(40, 'Geómetra de goma', 'Cuarenta rincones. Pitágoras te pide clases.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Dos jugadores en una cancha cerrada; la pelota tiene que pegar en la pared de enfrente entre las líneas.',
    'Puede picar una sola vez en el piso antes de devolverla y rebotar en las paredes que quieras.',
    'Cada jugada suma un punto. Games a 11 con dos de diferencia, al mejor de 5.',
    'Si el rival te tapa el tiro, se pide "let" y se repite el punto.',
  ],
  source: 'builtin',
}
