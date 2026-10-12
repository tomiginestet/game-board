import type { GameDef } from '../schema'

export const tateti: GameDef = {
  id: 'tateti',
  name: 'Ta-te-ti',
  emoji: '❌',
  color: '#E64980',
  category: 'clasico',
  tagline: 'Ta-te-ti, suerte para mí… y si empato, otra para mí.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 3, targetOption: 'target', quick: [1], quickLabel: 'Ganó la mano', pointsName: 'manos' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 3, choices: [{ value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }, { value: 5, label: '5' }, { value: 10, label: '10' }], min: 1, max: 20 },
  ],
  events: [
    { id: 'empate', name: 'Empate', emoji: '🐱', type: 'count', global: true, help: 'Mano sin ganador: gato.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Tres en línea', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 5, name: 'Servilleta de bar', description: 'Cinco partidas ganadas, dibujadas con birome en la servilleta.' },
        { at: 20, name: 'Pupitre rayado', description: 'Veinte victorias: dejaste cruces y círculos grabados en el banco.' },
        { at: 60, name: 'Pizarrón de maestra', description: 'Sesenta partidas. La seño te deja jugar en el pizarrón grande.' },
      ],
    },
    {
      id: 'shutout', name: 'Sin piedad', measures: 'Partidas ganadas sin que el rival gane una mano', metric: { type: 'shutoutWins' },
      unit: '{n} palizas', unitOne: '1 paliza',
      levels: [
        { at: 1, name: 'Goma de borrar', description: 'Ganaste sin dejarle una mano. Lo borraste del papel.' },
        { at: 5, name: 'Topadora', description: 'Cinco palizas: pasás por encima de la grilla.' },
        { at: 15, name: 'Aplanadora', description: 'Quince partidas en blanco. Dejás el cuaderno liso como pista de patinaje.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Grilla de 3×3; uno juega con cruces y el otro con círculos, alternando.',
    'Gana la mano el primero que completa tres en línea (horizontal, vertical o diagonal).',
    'Si se llena la grilla sin línea, es empate ("gato").',
    'Se alterna quién empieza y gana el primero que llega a las manos acordadas.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Tres_en_l%C3%ADnea',
  source: 'builtin',
}
