import { lv } from '../kit'
import type { GameDef } from '../schema'

export const bochas: GameDef = {
  id: 'bochas',
  name: 'Bochas',
  emoji: '🟤',
  color: '#8D6E63',
  category: 'deporte',
  tagline: 'El bochín no se mueve. Vos tampoco, salvo para medir con el metro.',
  players: { min: 2, max: 8 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 15, targetOption: 'target', quick: [1], quickLabel: 'Punto', pointsName: 'puntos' },
  options: [{ id: 'target', label: 'A cuántos puntos', type: 'number', default: 15, choices: [{ value: 12, label: 'A 12' }, { value: 15, label: 'A 15' }, { value: 18, label: 'A 18' }], min: 5, max: 30 }],
  events: [
    { id: 'bochazo', name: 'Bochazo', emoji: '💥', type: 'count', help: 'Sacó una bocha rival de un tiro.' },
    { id: 'arrime', name: 'Arrime pegado', emoji: '📏', type: 'count', help: 'Quedó pegada al bochín.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Cancha de bochas', measures: 'Partidos de bochas ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Boina del club', 'Cinco partidos ganados. Te prestan la boina del abuelo.', 'house', '#BCAAA4'),
        lv(20, 'Vermú con soda', 'Veinte victorias: el vermú de después lo paga el otro.', 'coin', '#A1887F'),
        lv(60, 'Jubilado de oro', 'Sesenta ganados. Los del club de jubilados te piden revancha.', 'crown', '#6D4C41'),
      ],
    },
    {
      id: 'bochazos', name: 'Bochador', measures: 'Bochazos en total', metric: { type: 'eventTotal', event: 'bochazo' },
      unit: '{n} bochazos', unitOne: '1 bochazo',
      levels: [
        lv(3, 'Choque de bochas', 'Tres bochazos. Sonó como una bola de billar gigante.', 'bolt', '#D7CCC8'),
        lv(15, 'Carambola', 'Quince bochazos: sacás dos de un tiro.', 'bolt', '#A1887F'),
        lv(40, 'Demoledora', 'Cuarenta bochazos. No queda bocha rival en pie.', 'skull', '#5D4037'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Se tira el bochín y cada lado trata de arrimar sus bochas lo más cerca posible.',
    'Cuando se tiraron todas, suma un punto cada bocha que esté más cerca que la mejor del rival.',
    'Se puede "bochar": tirar fuerte para sacar una bocha rival. Gana el primero a 15 (o lo acordado).',
  ],
  source: 'builtin',
}
