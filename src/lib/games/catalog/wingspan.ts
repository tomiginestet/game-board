import type { GameDef } from '../schema'

export const wingspan: GameDef = {
  id: 'wingspan',
  name: 'Wingspan',
  emoji: '🐦',
  color: '#74B816',
  category: 'mesa',
  tagline: 'El hornero te pone dos huevos y vos le pedís uno más. Así no se puede.',
  players: { min: 1, max: 5 },
  sides: 'individual',
  mode: 'result',
  weight: 3,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [],
  stats: [
    { id: 'birds', label: 'Pájaros en tu reserva', type: 'number' },
    { id: 'eggs', label: 'Huevos al final', type: 'number' },
    { id: 'tucked', label: 'Cartas metidas debajo de pájaros', type: 'number' },
  ],
  awards: [
    {
      id: 'score', name: 'Ornitólogo', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 70, name: 'Binoculares', description: 'Setenta puntos. Ya distinguís un gorrión de una paloma.' },
        { at: 90, name: 'Guía de campo', description: 'Noventa puntos: llevás la libretita y anotás todo.' },
        { at: 110, name: 'Hombre pájaro', description: 'Ciento diez puntos. Los pájaros se te posan en la cabeza como a una estatua de plaza.' },
      ],
    },
    {
      id: 'eggs', name: 'Gallinero', measures: 'Más huevos en una partida', metric: { type: 'statMax', stat: 'eggs' },
      unit: '{n} huevos', unitOne: '1 huevo',
      levels: [
        { at: 10, name: 'Nido de hornero', description: 'Diez huevos. Casita de barro y todo.' },
        { at: 18, name: 'Maple de huevos', description: 'Dieciocho huevos: alcanza para una tortilla de verdad.' },
        { at: 26, name: 'Granja avícola', description: 'Veintiséis huevos en una partida. Abastecés a todo el barrio.' },
      ],
    },
    {
      id: 'birds', name: 'Pajarera', measures: 'Más pájaros jugados en una partida', metric: { type: 'statMax', stat: 'birds' },
      unit: '{n} pájaros', unitOne: '1 pájaro',
      levels: [
        { at: 12, name: 'Jaula con canario', description: 'Doce pájaros jugados. Cantan a la mañana.' },
        { at: 15, name: 'Plaza con palomas', description: 'Quince pájaros: tirás miguitas y se te vienen todos.' },
        { at: 18, name: 'Reserva de Costanera', description: 'Dieciocho pájaros. Tu tablero es la Costanera Sur.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'league', 'knockout'],
  rules: [
    'Se juegan 4 rondas; en cada una tenés menos cubos de acción (8, 7, 6 y 5).',
    'Por acción: jugás un pájaro en uno de tus tres hábitats, o activás un hábitat para ganar comida, poner huevos o robar cartas.',
    'Cuantos más pájaros tiene una fila, más fuerte es esa acción; muchos pájaros tienen poderes que se activan.',
    'Al final de cada ronda se puntúa un objetivo; al final se suman pájaros, bonificaciones, objetivos, huevos, comida guardada y cartas metidas.',
    'Gana quien tiene más puntos.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/266192/wingspan',
  source: 'builtin',
}
