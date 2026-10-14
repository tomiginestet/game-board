import { bestOfOption, lv, setPointsOption } from '../kit'
import type { GameDef } from '../schema'

export const pickleball: GameDef = {
  id: 'pickleball',
  name: 'Pickleball',
  emoji: '🏓',
  color: '#66A80F',
  category: 'deporte',
  tagline: 'Es como el pádel, el tenis y el ping pong tomando mate juntos.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'sets',
  weight: 1,
  scoring: { sets: { kind: 'points', bestOf: 3, bestOfOption: 'bestOf', points: 11, pointsOption: 'setPoints' }, pointsName: 'games' },
  options: [setPointsOption(11, [11, 15, 21]), bestOfOption(3, [1, 3])],
  events: [
    { id: 'cocina', name: 'Pisó la cocina', emoji: '🍳', type: 'count', help: 'Volea parado en la zona de no volea ("la cocina"): falta.' },
    { id: 'dink', name: 'Dink ganador', emoji: '🪶', type: 'count', help: 'Pelotita suave que cae en la cocina rival y define el punto.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Pepinillo', measures: 'Partidos de pickleball ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Pepinillo en vinagre', 'Cinco partidos ganados. Recién estás macerando.'),
        lv(20, 'Frasco de conserva', 'Veinte victorias: ya tenés la alacena llena.'),
        lv(50, 'Chef de la cocina', 'Cincuenta ganados. Nadie pisa tu cocina sin permiso.'),
      ],
    },
    {
      id: 'dinks', name: 'Mano suave', measures: 'Dinks ganadores', metric: { type: 'eventTotal', event: 'dink' },
      unit: '{n} dinks', unitOne: '1 dink',
      levels: [
        lv(3, 'Pluma', 'Tres dinks ganadores. La pelota bajó como una pluma.'),
        lv(15, 'Guante de seda', 'Quince dinks. Le pegás con la delicadeza de un relojero.'),
        lv(40, 'Cirujano de la red', 'Cuarenta dinks ganadores. Operás a corazón abierto sobre la red.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cancha chica de bádminton, paleta lisa y pelota de plástico con agujeros. Singles o dobles.',
    'Saque de abajo y cruzado; la pelota tiene que picar una vez de cada lado antes de volear.',
    'Cerca de la red está la "cocina": ahí no se puede volear.',
    'Clásicamente sólo suma el que saca; acá anotás los puntos que valen. Games a 11 con dos de diferencia.',
  ],
  source: 'builtin',
}
