import { lv } from '../kit'
import type { GameDef } from '../schema'

export const rugby: GameDef = {
  id: 'rugby',
  name: 'Rugby (y touch)',
  emoji: '🏉',
  color: '#364FC7',
  category: 'deporte',
  tagline: 'Ochenta minutos de golpes y después todos amigos con una milanesa gigante.',
  players: { min: 4, max: 30 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { quick: [5, 2, 3], quickLabel: 'Try', pointsName: 'puntos', allowDraw: true },
  perPlayer: { scorer: true, unit: 'puntos', unitOne: 'punto', mvp: true },
  options: [{ id: 'touch', label: 'Touch (sin tackle)', type: 'boolean', default: false, help: 'En touch, cada try vale 1: usá sólo el botón grande y contá de a uno.' }],
  events: [
    { id: 'tackle', name: 'Tackle tremendo', emoji: '💪', type: 'count', byPlayer: true },
  ],
  stats: [],
  awards: [
    {
      id: 'puntos', name: 'Apoyador', measures: 'Puntos propios (tries, conversiones y penales)', metric: { type: 'scored' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        lv(15, 'Pelota en el ingoal', 'Quince puntos. Te tiraste de panza y valió.'),
        lv(75, 'Wing veloz', 'Setenta y cinco puntos: corrés pegado a la raya como un tren.'),
        lv(200, 'Puma en el Mundial', 'Doscientos puntos. Te cantan el himno con lágrimas.'),
      ],
    },
    {
      id: 'figura', name: 'Hombre del partido', measures: 'Veces figura en el rugby', metric: { type: 'mvp' },
      unit: '{n} veces figura', unitOne: '1 vez figura',
      levels: [
        lv(1, 'Milanesa del tercer tiempo', 'Fuiste la figura: te toca la milanesa más grande.'),
        lv(5, 'Capitán del scrum', 'Cinco veces figura. Empujás al pack entero.'),
        lv(15, 'Leyenda del club', 'Quince veces figura. Tu camiseta va enmarcada en el buffet.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Try 5 puntos (botón grande), conversión 2, penal o drop 3. La pelota se pasa siempre para atrás.',
    'En touch no hay tackle: tocar al portador frena la jugada y cada try vale 1.',
    'Al cerrar se puede elegir la figura del partido.',
  ],
  rulesUrl: 'https://www.world.rugby/the-game/laws/home',
  source: 'builtin',
}
