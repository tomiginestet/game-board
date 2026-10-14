import { bestOfOption, goldenPointOption, lv, superTiebreakOption } from '../kit'
import type { GameDef } from '../schema'

export const padel: GameDef = {
  id: 'padel',
  name: 'Pádel',
  emoji: '🎾',
  color: '#1C7ED6',
  category: 'deporte',
  tagline: 'La pelota pegó en la reja y vale. Discutilo después, con la cerveza.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'tennis', bestOf: 3, bestOfOption: 'bestOf', goldenPointOption: 'goldenPoint', superTiebreakOption: 'superTiebreak' }, pointsName: 'sets' },
  options: [bestOfOption(3, [1, 3]), goldenPointOption(), superTiebreakOption()],
  events: [
    { id: 'por3', name: 'Por tres', emoji: '🚀', type: 'count', help: 'Remate que sale de la cancha por arriba del vidrio de fondo.' },
    { id: 'vibora', name: 'Víbora', emoji: '🐍', type: 'count', help: 'Golpe de arriba con efecto cortado que sale pegado a la pared.' },
    { id: 'globo', name: 'Globo ganador', emoji: '🎈', type: 'count', help: 'Globo por encima de los dos rivales que termina en punto.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pala de oro', measures: 'Partidos de pádel ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Pala de madera', 'Cinco partidos ganados. Ya no le pegás con el marco.', 'shield', '#C08A4F'),
        lv(20, 'Pala de carbono', 'Veinte victorias: la pala vale más que tu primer auto.', 'bolt', '#495057'),
        lv(60, 'Dueño de la jaula', 'Sesenta ganados. El turno de las 21 ya viene con tu nombre.', 'crown', '#1C7ED6'),
      ],
    },
    {
      id: 'por3', name: 'Por tres', measures: 'Remates que salieron por arriba del vidrio', metric: { type: 'eventTotal', event: 'por3' },
      unit: '{n} por tres', unitOne: '1 por tres',
      levels: [
        lv(1, 'Despegue', 'Tu primer por tres. La pelota todavía está en órbita.', 'rocket', '#F76707'),
        lv(10, 'Pelota al estacionamiento', 'Diez por tres. Los del auto de al lado ya te conocen.', 'rocket', '#E8590C'),
        lv(30, 'Misión a Marte', 'Treinta remates por tres. La NASA te pide la pala prestada.', 'rocket', '#C92A2A'),
      ],
    },
    {
      id: 'shutout', name: 'En dos sets', measures: 'Partidos ganados sin perder un set', metric: { type: 'shutoutWins' },
      unit: '{n} partidos sin perder sets', unitOne: '1 partido sin perder sets',
      levels: [
        lv(1, 'Pasaron y no saludaron', 'Ganaste sin regalar un set. Turno de una hora, sobraron cuarenta minutos.', 'bolt', '#40C057'),
        lv(5, 'Express del jueves', 'Cinco partidos en dos sets: llegás a la cena antes que todos.', 'flame', '#2F9E44'),
        lv(15, 'Topadora de vidrio', 'Quince partidos sin perder un set. Los rivales piden cambiar de pareja.', 'sword', '#087F5B'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Se juega de a dos contra dos (o de a uno, en cancha single) en una cancha con paredes de vidrio y reja.',
    'Se saca de abajo, después de un pique, cruzado al cuadro de enfrente.',
    'La pelota puede rebotar en las paredes después de picar en tu campo; la reja es "lotería".',
    'Se cuenta como en el tenis: 15, 30, 40 y game; sets a 6 con tie-break en 6 iguales.',
    'Con punto de oro, en 40 iguales se juega un solo punto decisivo (el que recibe elige el lado).',
  ],
  rulesUrl: 'https://www.padelfip.com/es/reglamento/',
  source: 'builtin',
}
