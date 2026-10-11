import type { GameDef } from '../schema'

export const uno: GameDef = {
  id: 'uno',
  name: 'UNO',
  emoji: '🟥',
  color: '#D62828',
  category: 'cartas',
  tagline: 'Un +4 a tu abuela es legal. Moralmente, lo discutimos en el asado.',
  players: { min: 2, max: 10 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { target: 500, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'target', label: 'A cuánto', type: 'number', default: 500, choices: [{ value: 200, label: '200' }, { value: 300, label: '300' }, { value: 500, label: '500' }], min: 100, max: 1000 },
  ],
  events: [
    { id: 'cerro', name: 'Se quedó sin cartas', emoji: '🙌', type: 'count', help: 'Ganó la mano: se anota lo que suman las cartas de los demás.' },
    { id: 'masCuatro', name: 'Tiró un +4', emoji: '➕', type: 'count', help: 'Le encajó un comodín +4 a alguien.' },
    { id: 'unoOlvidado', name: 'Se olvidó del ¡UNO!', emoji: '🤐', type: 'count', help: 'Lo agarraron con una carta sin cantar UNO: roba 2.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: '¡UNO!', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Grito en el patio', description: 'Tres partidas ganadas. Se escuchó tu "¡UNO!" desde la vereda.' },
        { at: 12, name: 'Bombo de cancha', description: 'Doce partidas: ya cantás con bombo y redoblante.' },
        { at: 35, name: 'Megáfono de oro', description: 'Treinta y cinco partidas ganadas. Tu grito de UNO tiene eco en todo el barrio.' },
      ],
    },
    {
      id: 'masCuatro', name: 'Mala leche', measures: '+4 tirados en total', metric: { type: 'eventTotal', event: 'masCuatro' },
      unit: '{n} +4', unitOne: '1 +4',
      levels: [
        { at: 5, name: 'Codazo', description: 'Cinco +4 tirados. Un codacito en el área, nada grave.' },
        { at: 25, name: 'Puñal por la espalda', description: 'Veinticinco +4: tus amigos ya se sientan de frente a vos.' },
        { at: 75, name: 'Villano de telenovela', description: 'Setenta y cinco +4. Te reís con bigote y todo mientras los demás roban.' },
      ],
    },
    {
      id: 'olvidos', name: 'Despistado', measures: 'Veces que se olvidó de cantar UNO', metric: { type: 'eventTotal', event: 'unoOlvidado' },
      unit: '{n} olvidos', unitOne: '1 olvido',
      levels: [
        { at: 1, name: 'Memoria de pez', description: 'Te olvidaste de cantar UNO. Tres segundos de memoria, como el pececito.' },
        { at: 5, name: 'Paraguas en el bondi', description: 'Cinco olvidos: dejás todo en el colectivo, incluido el grito.' },
        { at: 15, name: 'Anteojos en la frente', description: 'Quince olvidos. Buscás el UNO y lo tenías puesto todo el tiempo.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Siete cartas a cada uno; en tu turno tirás una del mismo color, número o símbolo que la de arriba, o un comodín. Si no podés, robás.',
    'Especiales: +2, salteo y cambio de sentido; comodín (elige color) y comodín +4 (sólo si no tenés del color pedido; se puede desafiar).',
    'Cuando te queda una carta tenés que gritar "¡UNO!"; si te agarran antes, robás 2.',
    'El que se queda sin cartas gana la mano y se anota lo de los demás: números por su valor, especiales 20, comodines 50.',
    'Gana el primero que llega a 500 puntos.',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Uno_(card_game)',
  source: 'builtin',
}
