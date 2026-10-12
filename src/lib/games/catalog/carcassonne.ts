import type { GameDef } from '../schema'

export const carcassonne: GameDef = {
  id: 'carcassonne',
  name: 'Carcassonne',
  emoji: '🏰',
  color: '#A87132',
  category: 'mesa',
  tagline: 'Te metiste en mi ciudad con un seguidor. Esto es una usurpación, viejo.',
  players: { min: 2, max: 5 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'stolenCity', name: 'Ciudad compartida/robada', emoji: '🤝', type: 'count', help: 'Se metió en una ciudad ajena y se llevó (o empató) los puntos.' },
    { id: 'monastery', name: 'Monasterio completo', emoji: '⛪', type: 'count', help: 'Rodeó un monasterio con las 8 losetas.' },
  ],
  stats: [
    { id: 'cityPts', label: 'Puntos por ciudades', type: 'number' },
    { id: 'roadPts', label: 'Puntos por caminos', type: 'number' },
    { id: 'fieldPts', label: 'Puntos por campos (granjeros)', type: 'number' },
  ],
  awards: [
    {
      id: 'city', name: 'Urbanista', measures: 'Más puntos por ciudades en una partida', metric: { type: 'statMax', stat: 'cityPts' },
      unit: '{n} puntos de ciudad', unitOne: '1 punto de ciudad',
      levels: [
        { at: 30, name: 'Pueblo medieval', description: 'Treinta puntos de ciudad. Murallas, torrecita y un perro.' },
        { at: 50, name: 'Ciudad amurallada', description: 'Cincuenta puntos: tus murallas se ven desde Francia.' },
        { at: 75, name: 'Rey del castillo', description: 'Setenta y cinco puntos de ciudad. Corona, trono y foso con cocodrilos.' },
      ],
    },
    {
      id: 'farmer', name: 'Granjero', measures: 'Más puntos por campos en una partida', metric: { type: 'statMax', stat: 'fieldPts' },
      unit: '{n} puntos de campo', unitOne: '1 punto de campo',
      levels: [
        { at: 9, name: 'Peón acostado', description: 'Nueve puntos de campo con el seguidor tirado panza arriba.' },
        { at: 18, name: 'Terrateniente', description: 'Dieciocho puntos de campo. Hectáreas y hectáreas.' },
        { at: 30, name: 'Sociedad Rural', description: 'Treinta puntos de granjeros: inaugurás la exposición de Palermo.' },
      ],
    },
    {
      id: 'score', name: 'Señor feudal', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 100, name: 'Escudero', description: 'Cien puntos: diste toda la vuelta al tablero.' },
        { at: 150, name: 'Caballero templario', description: 'Ciento cincuenta puntos. Armadura brillante y capa.' },
        { at: 200, name: 'Señor de los feudos', description: 'Doscientos puntos. Los demás te pagan diezmo.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'league', 'knockout'],
  rules: [
    'Por turno se saca una loseta y se coloca encajando con lo que ya hay en la mesa (caminos con caminos, ciudades con ciudades).',
    'Después podés poner un seguidor en esa loseta: ladrón en un camino, caballero en una ciudad, monje en un monasterio o granjero en un campo.',
    'Al cerrarse, el camino da 1 por loseta, la ciudad 2 por loseta y escudo, y el monasterio 9; el seguidor vuelve a tu mano.',
    'Si hay varios seguidores en la misma construcción, cobra quien tenga más (empatados, cobran todos).',
    'Al final se cobra lo incompleto (a mitad de precio las ciudades) y los granjeros: 3 por cada ciudad completa que tocan su campo.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/822/carcassonne',
  source: 'builtin',
}
