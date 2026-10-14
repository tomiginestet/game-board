import { bestOfOption, lv } from '../kit'
import type { GameDef } from '../schema'

export const beachvoley: GameDef = {
  id: 'beachvoley',
  name: 'Beach vóley',
  emoji: '🏖️',
  color: '#E8590C',
  category: 'deporte',
  tagline: 'Arena hasta en las orejas, protector factor 50 y una lata de agua tibia.',
  players: { min: 4, max: 4 },
  sides: 'teams',
  teamSize: 2,
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'points', bestOf: 3, bestOfOption: 'bestOf', points: 21, lastSetPoints: 15 }, pointsName: 'sets' },
  options: [bestOfOption(3, [1, 3])],
  events: [
    { id: 'shot', name: 'Shot por arriba', emoji: '🌈', type: 'count', help: 'Globito o "shot" que cae atrás de los dos.' },
    { id: 'palomita', name: 'Palomita', emoji: '🐦', type: 'count', help: 'Salvada tirándose de cabeza a la arena.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Rey de la playa', measures: 'Partidos de beach vóley ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Ojotas en la red', 'Cinco partidos ganados. Usaste las ojotas para marcar la cancha.', 'star', '#FFA94D'),
        lv(20, 'Bronceado de cancha', 'Veinte victorias: tenés la marca de la musculosa grabada.', 'flame', '#FD7E14'),
        lv(50, 'Dueño de Playa Grande', 'Cincuenta ganados. En Mar del Plata te guardan la sombrilla.', 'crown', '#E8590C'),
      ],
    },
    {
      id: 'palomitas', name: 'Arena en los dientes', measures: 'Palomitas en total', metric: { type: 'eventTotal', event: 'palomita' },
      unit: '{n} palomitas', unitOne: '1 palomita',
      levels: [
        lv(3, 'Milanesa de arena', 'Tres palomitas. Quedaste empanado como milanesa.', 'heart', '#FFD8A8'),
        lv(15, 'Castillo humano', 'Quince palomitas. Los chicos te usan de molde para castillos.', 'house', '#FFA94D'),
        lv(40, 'Cangrejo volador', 'Cuarenta palomitas. Vivís más horizontal que vertical.', 'rocket', '#F76707'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Dos contra dos en la arena, con red de vóley.',
    'Tres toques por equipo; no se puede "colocar" con los dedos para pasarla por encima de la red.',
    'Sets a 21 con dos de diferencia; si hay tercero, a 15. Se cambia de lado cada 7 puntos.',
  ],
  source: 'builtin',
}
