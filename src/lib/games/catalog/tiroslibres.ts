import { lv } from '../kit'
import type { GameDef } from '../schema'

export const tiroslibres: GameDef = {
  id: 'tiroslibres',
  name: 'Desafío de tiros libres',
  emoji: '🏀',
  color: '#F76707',
  category: 'deporte',
  tagline: 'Diez tiros desde la línea. Nadie te defiende, y aun así...',
  players: { min: 1, max: 10 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { rounds: 3, roundsOption: 'rounds', scorer: 'sum', pointsName: 'adentro' },
  options: [{ id: 'rounds', label: 'Rondas de 10 tiros', type: 'select', default: 3, choices: [{ value: 1, label: '1 ronda' }, { value: 3, label: '3 rondas' }, { value: 5, label: '5 rondas' }] }],
  events: [{ id: 'perfecta', name: 'Diez de diez', emoji: '💯', type: 'count' }],
  stats: [],
  awards: [
    {
      id: 'perfectas', name: 'Muñeca perfecta', measures: 'Rondas de diez de diez', metric: { type: 'eventTotal', event: 'perfecta' },
      unit: '{n} rondas perfectas', unitOne: '1 ronda perfecta',
      levels: [
        lv(1, 'Swish', 'Diez de diez. Ni tocaste el aro.', 'star', '#FFC078'),
        lv(5, 'Mano de seda', 'Cinco rondas perfectas: la pelota sale sola.', 'gem', '#FF922B'),
        lv(15, 'Línea de libres propia', 'Quince rondas perfectas. Te ponen tu nombre en la línea.', 'crown', '#D9480F'),
      ],
    },
    {
      id: 'max', name: 'Tirador', measures: 'Más tiros adentro en una partida', metric: { type: 'scoreMax' },
      unit: '{n} adentro', unitOne: '1 adentro',
      levels: [
        lv(15, 'Muñeca caliente', 'Quince adentro en una partida.', 'flame', '#FFD8A8'),
        lv(25, 'Francotirador del aro', 'Veinticinco adentro: el aro parece una pileta.', 'eye', '#FFA94D'),
        lv(40, 'Máquina de lanzar', 'Cuarenta adentro en una partida. ¿Sos un robot?', 'bolt', '#E8590C'),
      ],
    },
  ],
  formats: ['knockout', 'series'],
  rules: [
    'Cada ronda, cada uno tira diez libres; se carga cuántos metió.',
    'Al terminar las rondas gana el que más metió en total.',
  ],
  source: 'builtin',
}
