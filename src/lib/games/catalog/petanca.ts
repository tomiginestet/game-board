import { lv } from '../kit'
import type { GameDef } from '../schema'

export const petanca: GameDef = {
  id: 'petanca',
  name: 'Petanca',
  emoji: '⚪',
  color: '#748FFC',
  category: 'deporte',
  tagline: 'Bochas francesas: se tira con los pies juntos y un pastis en la otra mano.',
  players: { min: 2, max: 6 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 13, quick: [1], quickLabel: 'Punto', pointsName: 'puntos' },
  options: [],
  events: [{ id: 'carreau', name: 'Carreau', emoji: '🎯', type: 'count', help: 'Sacó la bola rival y la suya quedó en el mismo lugar.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Boule', measures: 'Partidas de petanca ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(5, 'Pies juntos', 'Cinco partidas ganadas. Ya no pisás afuera del círculo.'),
        lv(20, 'Plaza de Marsella', 'Veinte victorias: hablás francés con las manos.'),
        lv(50, 'Fanny', 'Cincuenta ganadas. En Provenza, al que pierde 13 a 0 le toca besar a Fanny. A vos, nunca.'),
      ],
    },
    {
      id: 'carreau', name: 'Tirador', measures: 'Carreaux en total', metric: { type: 'eventTotal', event: 'carreau' },
      unit: '{n} carreaux', unitOne: '1 carreau',
      levels: [
        lv(1, 'Tiro limpio', 'Tu primer carreau: sacaste la otra y la tuya ni se movió.'),
        lv(5, 'Bola clavada', 'Cinco carreaux. Tus bolas echan raíces.'),
        lv(15, 'Francotirador provenzal', 'Quince carreaux. Te llaman de la federación francesa.'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Se tira el boliche y, con los pies juntos dentro del círculo, se arriman las bolas.',
    'Juega el lado que no tiene la bola más cerca. Al final de la mano suma cada bola mejor que la mejor rival.',
    'Gana el primero a 13.',
  ],
  source: 'builtin',
}
