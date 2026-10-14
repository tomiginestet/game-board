import { lv } from '../kit'
import type { GameDef } from '../schema'

export const metegol: GameDef = {
  id: 'metegol',
  name: 'Metegol',
  emoji: '🕹️',
  color: '#D9480F',
  category: 'deporte',
  tagline: 'Prohibido el molinete. (Lo vas a hacer igual.)',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 5, targetOption: 'target', quick: [1], quickLabel: 'Gol', pointsName: 'goles' },
  options: [{ id: 'target', label: 'A cuántos goles', type: 'number', default: 5, choices: [{ value: 5, label: 'A 5' }, { value: 7, label: 'A 7' }, { value: 10, label: 'A 10' }], min: 1, max: 20 }],
  events: [
    { id: 'molinete', name: 'Molinete', emoji: '🌀', type: 'count', help: 'Gol girando la barra. En casi todos los bares no vale.' },
    { id: 'golArquero', name: 'Gol del arquero', emoji: '🧤', type: 'count', help: 'Gol desde el arco propio.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Barra de acero', measures: 'Partidos de metegol ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Ficha del bar', 'Cinco partidos ganados. La ficha la pone el que pierde.', 'coin', '#FFA94D'),
        lv(25, 'Muñeca de goma', 'Veinticinco victorias: la muñeca hace cosas raras.', 'bolt', '#FD7E14'),
        lv(80, 'Dueño del metegol', 'Ochenta ganados. El metegol de la oficina es tuyo.', 'crown', '#D9480F'),
      ],
    },
    {
      id: 'abajo', name: 'Por abajo de la mesa', measures: 'Partidos ganados sin que el rival haga un gol', metric: { type: 'shutoutWins' },
      unit: '{n} pasadas por abajo', unitOne: '1 pasada por abajo',
      levels: [
        lv(1, 'A gatas', 'Ganaste en cero: al rival le toca pasar por abajo de la mesa.', 'skull', '#FFC9C9'),
        lv(5, 'Túnel de lavado', 'Cinco rivales pasaron por abajo. Ya hay alfombra.', 'skull', '#FF8787'),
        lv(15, 'Peaje del bar', 'Quince en cero. Por abajo de tu mesa pasa más gente que por la Panamericana.', 'road', '#E03131'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mano a mano o de a dos (uno ataca y otro defiende). Gana el primero que llega a los goles acordados.',
    'El molinete (girar la barra a lo loco) no vale, salvo que la casa diga otra cosa.',
    'Si alguien pierde sin hacer un gol, pasa por abajo de la mesa. Es ley.',
  ],
  source: 'builtin',
}
