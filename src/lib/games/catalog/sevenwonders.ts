import type { GameDef } from '../schema'

export const sevenwonders: GameDef = {
  id: 'sevenwonders',
  name: '7 Wonders',
  emoji: '🏛️',
  color: '#B08900',
  category: 'mesa',
  tagline: 'Construiste la pirámide con la carta que yo te pasé. Desagradecido.',
  players: { min: 3, max: 7 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [],
  stats: [
    {
      id: 'strategy', label: 'Estrategia principal', type: 'choice',
      choices: ['Ciencia', 'Militar', 'Civil', 'Comercio', 'Gremios', 'Maravilla'],
      help: 'De dónde salió la mayor parte de los puntos.',
    },
    { id: 'sciencePts', label: 'Puntos de ciencia', type: 'number' },
  ],
  awards: [
    {
      id: 'science', name: 'Laboratorio', measures: 'Partidas ganadas con estrategia de ciencia', metric: { type: 'winsWithChoice', stat: 'strategy', value: 'Ciencia' },
      unit: '{n} victorias científicas', unitOne: '1 victoria científica',
      levels: [
        { at: 1, name: 'Tubo de ensayo', description: 'Ganaste a pura ciencia. Explotó algo, pero ganaste.' },
        { at: 3, name: 'Científico loco', description: 'Tres victorias con ruedas, tablillas y compases. Pelo parado incluido.' },
        { at: 7, name: 'Premio Nobel', description: 'Siete victorias científicas. Como Houssay, Leloir y Milstein juntos.' },
      ],
    },
    {
      id: 'military', name: 'Legión', measures: 'Partidas ganadas con estrategia militar', metric: { type: 'winsWithChoice', stat: 'strategy', value: 'Militar' },
      unit: '{n} victorias militares', unitOne: '1 victoria militar',
      levels: [
        { at: 1, name: 'Escudo de madera', description: 'Ganaste a los escudazos con los vecinos.' },
        { at: 3, name: 'Centurión', description: 'Tres victorias militares. Casco con plumero y sandalias.' },
        { at: 7, name: 'Julio César', description: 'Siete victorias militares: llegaste, viste y venciste.' },
      ],
    },
    {
      id: 'score', name: 'Maravilla del mundo', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 50, name: 'Primera piedra', description: 'Cincuenta puntos. Los cimientos están.' },
        { at: 65, name: 'Coloso de Rodas', description: 'Sesenta y cinco puntos: te ven desde el puerto.' },
        { at: 80, name: 'Faro de Alejandría', description: 'Ochenta puntos. Iluminás a toda la mesa (y la encandilás).' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Se juegan 3 eras; en cada una recibís 7 cartas, elegís una, la jugás y pasás el resto al vecino (a la izquierda, derecha, izquierda).',
    'Cada carta se construye pagando recursos (o comprándolos a tus vecinos), se descarta por 3 monedas o se usa para una etapa de tu maravilla.',
    'Al final de cada era, guerra con tus dos vecinos: quien tiene más escudos gana puntos militares.',
    'Al final se suman militar, monedas, maravilla, edificios civiles, comercio, gremios y ciencia (sets y símbolos iguales al cuadrado).',
    'Gana quien tiene más puntos.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/68448/7-wonders',
  source: 'builtin',
}
