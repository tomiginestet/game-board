import type { GameDef } from '../schema'

export const azul: GameDef = {
  id: 'azul',
  name: 'Azul',
  emoji: '🟦',
  color: '#1971C2',
  category: 'mesa',
  tagline: 'Juntaste azulejos para la pared y te quedaron todos en el piso. Como en la obra.',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'floor', name: 'Rompió azulejos', emoji: '💥', type: 'count', help: 'Mandó 4 o más azulejos al piso en una ronda.' },
  ],
  stats: [
    { id: 'rows', label: 'Filas horizontales completas', type: 'number', help: '+2 cada una.' },
    { id: 'columns', label: 'Columnas completas', type: 'number', help: '+7 cada una.' },
    { id: 'colors', label: 'Colores completos (5 de un color)', type: 'number', help: '+10 cada uno.' },
  ],
  awards: [
    {
      id: 'score', name: 'Mosaiquista', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 60, name: 'Ayudante de obra', description: 'Sesenta puntos. Ya sabés mezclar la pastina.' },
        { at: 80, name: 'Azulejero fino', description: 'Ochenta puntos: dejás las juntas derechitas.' },
        { at: 100, name: 'Palacio de la Alhambra', description: 'Cien puntos o más. El rey de Portugal te pide la pared.' },
      ],
    },
    {
      id: 'colors', name: 'Paleta completa', measures: 'Colores completos en total', metric: { type: 'statTotal', stat: 'colors' },
      unit: '{n} colores completos', unitOne: '1 color completo',
      levels: [
        { at: 3, name: 'Cajita de crayones', description: 'Tres colores completos. Arranca la colección.' },
        { at: 10, name: 'Arcoíris', description: 'Diez colores completos: todas las tonalidades en tu pared.' },
        { at: 25, name: 'Vitral de catedral', description: 'Veinticinco colores completos. Entra el sol y da gusto.' },
      ],
    },
    {
      id: 'floor', name: 'Manos de manteca', measures: 'Rondas en que rompió 4 o más azulejos', metric: { type: 'eventTotal', event: 'floor' },
      unit: '{n} desastres', unitOne: '1 desastre',
      levels: [
        { at: 2, name: 'Plato roto', description: 'Dos rondas con azulejos al piso. Escoba y pala.' },
        { at: 6, name: 'Elefante en bazar', description: 'Seis desastres: entrás y se rompe todo.' },
        { at: 15, name: 'Casamiento griego', description: 'Quince rondas rompiendo cerámica. ¡Opa!' },
      ],
    },
  ],
  formats: ['tables', 'series', 'league', 'knockout'],
  rules: [
    'En tu turno tomás todos los azulejos de UN color de una fábrica (el resto va al centro) o del centro.',
    'Los ponés en una de tus líneas de patrón; lo que sobra cae al piso y resta puntos.',
    'Al terminar la ronda, cada línea completa pasa un azulejo a la pared y suma por los vecinos conectados.',
    'El juego termina cuando alguien completa una fila horizontal de la pared.',
    'Bonus final: +2 por fila, +7 por columna y +10 por cada color completo. Gana el que más puntos tiene.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/230802/azul',
  source: 'builtin',
}
