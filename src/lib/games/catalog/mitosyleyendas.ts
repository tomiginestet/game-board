import type { GameDef } from '../schema'

export const mitosyleyendas: GameDef = {
  id: 'mitosyleyendas',
  name: 'Mitos y Leyendas',
  emoji: '🏰',
  color: '#7F4F24',
  category: 'tcg',
  tagline: 'El TCG de este lado de la cordillera: oro, aliados y un castillo que se viene abajo.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'primerBloque',
      choices: [
        { value: 'primerBloque', label: 'Primer Bloque' },
        { value: 'segundoBloque', label: 'Segundo Bloque' },
        { value: 'imperio', label: 'Imperio' },
        { value: 'racial', label: 'Racial' },
        { value: 'nuevaEra', label: 'Nueva Era' },
      ],
    },
  ],
  events: [
    { id: 'golpeGrande', name: 'Golpe de 10+', emoji: '🪨', type: 'count', help: 'En un solo turno le mandó 10 cartas o más del castillo al cementerio.' },
    { id: 'aliadoCaido', name: 'Aliado destruido', emoji: '⚰️', type: 'count', help: 'Mandó al cementerio a un aliado del rival.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Señor del castillo', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Muralla de piedra', description: 'Tres partidas ganadas. Primeras piedras de tu fortaleza.', glyph: 'house', color: '#7F4F24' },
        { at: 15, name: 'Torre del homenaje', description: 'Quince victorias: desde arriba de la torre se ve todo el reino.', glyph: 'house', color: '#7F4F24' },
        { at: 40, name: 'Castillo de Camelot', description: 'Cuarenta partidas. Mesa redonda, banderines y Excalibur en la pared.', glyph: 'house', color: '#7F4F24' },
      ],
    },
    {
      id: 'golpe', name: 'Asedio', measures: 'Golpes de 10 o más en total', metric: { type: 'eventTotal', event: 'golpeGrande' },
      unit: '{n} golpes', unitOne: '1 golpe',
      levels: [
        { at: 3, name: 'Ariete', description: 'Tres golpes grandes. Tocaste la puerta con un tronco.', glyph: 'shield', color: '#7F4F24' },
        { at: 12, name: 'Catapulta', description: 'Doce golpes: las piedras vuelan por encima de la muralla.', glyph: 'shield', color: '#7F4F24' },
        { at: 35, name: 'Trebuchet', description: 'Treinta y cinco golpes. Lo tuyo ya es ingeniería medieval.', glyph: 'shield', color: '#7F4F24' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mazo (castillo) de 50 cartas con oro, aliados, armas, totems y talismanes. Se roban 8 al empezar.',
    'Por turno se juega un oro como recurso y se pagan cartas con el oro de la reserva.',
    'Los aliados atacan y el daño que pasa se "bota" del castillo del rival directo al cementerio.',
    'Gana el que deja al rival sin cartas en el castillo.',
    'Los formatos (Primer Bloque, Imperio, Racial, Nueva Era…) definen qué ediciones se pueden usar.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Mitos_y_Leyendas',
  source: 'builtin',
}
