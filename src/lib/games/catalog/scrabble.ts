import type { GameDef } from '../schema'

export const scrabble: GameDef = {
  id: 'scrabble',
  name: 'Scrabble / Palabras cruzadas',
  emoji: '🔤',
  color: '#8D6E3F',
  category: 'clasico',
  tagline: '"Esa palabra no existe." "Existe, la decía mi abuela en Chivilcoy."',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'bingo', name: 'Usó las 7 fichas', emoji: '🎰', type: 'count', points: 50, help: 'Colocó las 7 fichas de una: +50.' },
    { id: 'challenged', name: 'Desafío perdido', emoji: '📕', type: 'count', help: 'Le impugnaron una palabra y el diccionario le dio la razón al otro.' },
  ],
  stats: [
    { id: 'bestWord', label: 'Mejor palabra (puntos)', type: 'number', help: 'Lo máximo que hizo con una sola jugada.' },
  ],
  awards: [
    {
      id: 'bestWord', name: 'Palabra de oro', measures: 'Mejor palabra (puntos en una jugada)', metric: { type: 'statMax', stat: 'bestWord' },
      unit: '{n} puntos en una palabra', unitOne: '1 punto en una palabra',
      levels: [
        { at: 30, name: 'Triple palabra', description: 'Treinta puntos en una jugada. Caíste en la casilla roja.' },
        { at: 60, name: 'Diccionario de bolsillo', description: 'Sesenta puntos de una: palabras que nadie conocía.' },
        { at: 100, name: 'Real Academia', description: 'Cien puntos en una palabra. La RAE te consulta a vos.' },
      ],
    },
    {
      id: 'bingo', name: 'Bingo', measures: 'Veces que usó las 7 fichas de una', metric: { type: 'eventTotal', event: 'bingo' },
      unit: '{n} jugadas de 7 fichas', unitOne: '1 jugada de 7 fichas',
      levels: [
        { at: 1, name: 'Atril vacío', description: 'Vaciaste el atril de una: +50 y cara de sorpresa general.' },
        { at: 5, name: 'Cantó línea', description: 'Cinco veces las siete fichas. Esto ya es la lotería.' },
        { at: 12, name: 'Sopa de letras', description: 'Doce veces vaciaste el atril: las letras te obedecen.' },
      ],
    },
    {
      id: 'score', name: 'Erudito', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 300, name: 'Maestra ciruela', description: 'Trescientos puntos. Puntero y anteojitos en la punta de la nariz.' },
        { at: 400, name: 'Ratón de biblioteca', description: 'Cuatrocientos puntos: vivís entre libros.' },
        { at: 500, name: 'Rayuela', description: 'Quinientos puntos. Cortázar estaría orgulloso del tablero.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables', 'series'],
  rules: [
    'Cada uno tiene 7 fichas en su atril; por turno armás una palabra en línea recta que cruce con las del tablero.',
    'Cada letra vale puntos; las casillas de colores duplican o triplican la letra o la palabra.',
    'Usar las 7 fichas en una jugada suma 50 de bonus. Después reponés hasta tener 7.',
    'Se puede desafiar una palabra con el diccionario: si no existe, se retira y pierde el turno.',
    'Termina cuando se acaban las fichas y alguien vacía su atril; a cada uno se le restan las que le quedaron. Gana el de más puntos.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/320/scrabble',
  source: 'builtin',
}
