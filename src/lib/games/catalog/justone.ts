import type { GameDef } from '../schema'

export const justone: GameDef = {
  id: 'justone',
  name: 'Just One',
  emoji: '✏️',
  color: '#F59F00',
  category: 'cooperativo',
  tagline: 'Tres pusimos "Messi" para "Rosario". Y así nos fue.',
  players: { min: 3, max: 7 },
  sides: 'coop',
  mode: 'coop',
  weight: 1,
  scoring: { finalScores: true, maxScore: 13, pointsName: 'cartas acertadas' },
  options: [],
  events: [
    { id: 'clash', name: 'Pistas repetidas', emoji: '👯', type: 'count', help: 'Dos o más escribieron lo mismo y se borraron.' },
    { id: 'allErased', name: 'Todas borradas', emoji: '🧽', type: 'count', help: 'Se anularon todas las pistas: el que adivina se queda sin nada.' },
  ],
  stats: [],
  awards: [
    {
      id: 'best', name: 'Sintonía', measures: 'Mejor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} cartas de 13', unitOne: '1 carta de 13',
      levels: [
        { at: 9, name: 'Radio a galena', description: 'Nueve de trece. Hay interferencia, pero se escucha.' },
        { at: 11, name: 'Misma frecuencia', description: 'Once de trece: Radio Mitre, Radio Rivadavia, la que sea, pero la misma.' },
        { at: 13, name: 'Trece de trece', description: 'Perfecto. Ni el Prode sale tan redondo.' },
      ],
    },
    {
      id: 'clash', name: 'Mentes gemelas', measures: 'Pistas repetidas (borradas) en total', metric: { type: 'eventTotal', event: 'clash' },
      unit: '{n} pistas repetidas', unitOne: '1 pista repetida',
      levels: [
        { at: 3, name: 'Gemelos', description: 'Tres veces pensaron lo mismo. Lindo, pero no sirve.' },
        { at: 10, name: 'Fotocopia', description: 'Diez pistas repetidas: escriben con el mismo lápiz.' },
        { at: 25, name: 'Mente colmena', description: 'Veinticinco borradas. Son originales como el pan con manteca.' },
      ],
    },
    {
      id: 'wins', name: 'Una palabra basta', measures: 'Partidas ganadas en equipo', metric: { type: 'coopWins' },
      unit: '{n} partidas ganadas', unitOne: '1 partida ganada',
      levels: [
        { at: 2, name: 'Pizarrita', description: 'Dos partidas ganadas con la pizarrita en mano.' },
        { at: 6, name: 'Telegrama', description: 'Seis victorias: dicen todo con una palabra, como en el correo de antes.' },
        { at: 15, name: 'Pocas pulgas', description: 'Quince victorias. Cero palabras de más.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Todos juegan juntos; hay 13 cartas para adivinar.',
    'Uno no mira la palabra; los demás escriben UNA sola palabra de pista cada uno, sin mostrarla.',
    'Antes de mostrarlas se comparan: las pistas iguales (o muy parecidas) se borran.',
    'El que adivina tiene un solo intento: si acierta, la carta suma; si erra, se pierde esa y la siguiente del mazo. Puede pasar y pierde sólo esa.',
    'Se cuentan las cartas acertadas: 13 es perfecto. Se considera ganada con 9 o más ("¡excelente!").',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/254640/just-one',
  source: 'builtin',
}
