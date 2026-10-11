import type { GameDef } from '../schema'

export const sushigo: GameDef = {
  id: 'sushigo',
  name: 'Sushi Go!',
  emoji: '🍣',
  color: '#F08C00',
  category: 'cartas',
  tagline: 'Tenedor libre de sushi, pero el que se queda con el último pudding es el vivo.',
  players: { min: 2, max: 5 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { rounds: 3, scorer: 'sum', roundLabels: ['Ronda 1', 'Ronda 2', 'Ronda 3 + pudding'], pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'wasabiCalamar', name: 'Calamar con wasabi', emoji: '🦑', type: 'count', help: 'Puso un nigiri de calamar sobre wasabi (9 puntos).' },
    { id: 'sashimi', name: 'Sashimi completo', emoji: '🐟', type: 'count', help: 'Juntó tres sashimis (10 puntos).' },
    { id: 'makiMayor', name: 'Más makis', emoji: '🍙', type: 'count', help: 'Ganó la mayoría de makis de la ronda (6 puntos).' },
    { id: 'puddingMayor', name: 'Más pudding', emoji: '🍮', type: 'count', help: 'Terminó con más puddings (+6 al final).' },
  ],
  stats: [],
  awards: [
    {
      id: 'score', name: 'Tenedor libre', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 40, name: 'Palitos de madera', description: 'Cuarenta puntos en una partida. Ya agarrás los palitos sin el elástico.' },
        { at: 55, name: 'Barco de sushi', description: 'Cincuenta y cinco: te traen la barca entera a la mesa.' },
        { at: 70, name: 'Sushiman de Belgrano', description: 'Setenta puntos. Abriste tu propio local en el barrio chino.' },
      ],
    },
    {
      id: 'wasabi', name: 'Picante', measures: 'Calamares con wasabi en total', metric: { type: 'eventTotal', event: 'wasabiCalamar' },
      unit: '{n} calamares con wasabi', unitOne: '1 calamar con wasabi',
      levels: [
        { at: 3, name: 'Lágrima de wasabi', description: 'Tres calamares con wasabi. Te cae una lagrimita de orgullo.' },
        { at: 12, name: 'Nariz en llamas', description: 'Doce combos picantes: te sale fuego por la nariz.' },
        { at: 35, name: 'Dragón de wasabi', description: 'Treinta y cinco. Escupís fuego verde como en el Año Nuevo chino.' },
      ],
    },
    {
      id: 'pudding', name: 'Postre', measures: 'Veces que terminó con más pudding', metric: { type: 'eventTotal', event: 'puddingMayor' },
      unit: '{n} victorias de pudding', unitOne: '1 victoria de pudding',
      levels: [
        { at: 3, name: 'Flan con dulce', description: 'Tres veces con más pudding. Mixto, con dulce de leche y crema.' },
        { at: 10, name: 'Budín de pan', description: 'Diez veces: lo tuyo es el postre de la abuela.' },
        { at: 30, name: 'Torta Rogel', description: 'Treinta veces con más pudding. Capas y capas de gloria con merengue.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Tres rondas; en cada una todos eligen una carta de su mano a la vez y pasan el resto al de al lado.',
    'Makis: la mayoría suma 6 y el segundo 3. Tempura: 5 por cada par. Sashimi: 10 por cada trío. Gyozas: 1, 3, 6, 10 o 15 según cuántas.',
    'Nigiris suman 1, 2 o 3; puestos sobre wasabi valen el triple.',
    'Los puddings se guardan hasta el final: el que más tiene suma 6 y el que menos resta 6.',
    'Gana el que más puntos suma en las tres rondas.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/133473/sushi-go',
  source: 'builtin',
}
