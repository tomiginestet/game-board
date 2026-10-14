import { bestOfOption, lv, superTiebreakOption } from '../kit'
import type { GameDef } from '../schema'

export const tenis: GameDef = {
  id: 'tenis',
  name: 'Tenis',
  emoji: '🎾',
  color: '#2B8A3E',
  category: 'deporte',
  tagline: '¡Afuera! (Estaba adentro. Todos lo vimos. Igual: afuera.)',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'tennis', bestOf: 3, bestOfOption: 'bestOf', superTiebreakOption: 'superTiebreak' }, pointsName: 'sets' },
  options: [bestOfOption(3, [1, 3, 5]), superTiebreakOption()],
  events: [
    { id: 'ace', name: 'Ace', emoji: '🎯', type: 'count', help: 'Saque que el rival ni toca.' },
    { id: 'doubleFault', name: 'Doble falta', emoji: '🫣', type: 'count', help: 'Los dos saques afuera: punto regalado.' },
    { id: 'passing', name: 'Passing shot', emoji: '🏹', type: 'count', help: 'Tiro que pasa al rival que subió a la red.' },
  ],
  stats: [],
  awards: [
    {
      id: 'aces', name: 'Saque bala', measures: 'Aces en total', metric: { type: 'eventTotal', event: 'ace' },
      unit: '{n} aces', unitOne: '1 ace',
      levels: [
        lv(5, 'Saque de mate', 'Cinco aces. Sacás y te da tiempo de cebar uno.'),
        lv(25, 'Cañón Navarone', 'Veinticinco aces: el rival devuelve con los ojos cerrados.'),
        lv(80, 'Karlović de barrio', 'Ochenta aces. Medís dos metros cuando sacás.'),
      ],
    },
    {
      id: 'wins', name: 'Raqueta', measures: 'Partidos de tenis ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Polvo de ladrillo', 'Cinco partidos ganados: volvés con las medias coloradas.'),
        lv(20, 'Torre de Tandil', 'Veinte victorias. Ya te dicen la torre, como a Delpo.'),
        lv(60, 'Vilas en Roland Garros', 'Sesenta partidos ganados. El drive te sale con vincha y todo.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Singles o dobles. El punto se cuenta 15, 30, 40 y game; en 40 iguales hay que ganar dos seguidos (ventaja).',
    'Cada set se gana a 6 games con 2 de diferencia; en 6 iguales se juega tie-break a 7.',
    'El partido es al mejor de 3 sets (o de 5). Se puede definir el tercero con super tie-break a 10.',
    'Dos saques por punto; si los dos van afuera, es doble falta.',
  ],
  rulesUrl: 'https://www.itftennis.com/en/about-us/governance/rules-and-regulations/',
  source: 'builtin',
}
