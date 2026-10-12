import type { GameDef } from '../schema'

export const dobble: GameDef = {
  id: 'dobble',
  name: 'Dobble',
  emoji: '👁️',
  color: '#F03E3E',
  category: 'fiesta',
  tagline: '¡El muñequito de nieve! ¡No, el candado! ¡Era el dinosaurio, la pucha!',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: { finalScores: true, pointsName: 'cartas' },
  options: [
    {
      id: 'variant', label: 'Minijuego', type: 'select', default: 'torre',
      choices: [
        { value: 'torre', label: 'La torre infernal (más cartas gana)' },
        { value: 'pozo', label: 'El pozo (se vacía primero, gana)' },
        { value: 'patata', label: 'La patata caliente' },
      ],
    },
  ],
  events: [
    { id: 'falseSlap', name: 'Manotazo en falso', emoji: '🖐️', type: 'count', help: 'Gritó un símbolo que no estaba.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Ojo biónico', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} victorias', unitOne: '1 victoria',
      levels: [
        { at: 3, name: 'Ojo de lince', description: 'Tres victorias. Ves el símbolo antes de que caiga la carta.' },
        { at: 10, name: 'Rayos X', description: 'Diez victorias: ves a través del mazo.' },
        { at: 25, name: 'Terminator', description: 'Veinticinco victorias. Escaneo completo, objetivo localizado.' },
      ],
    },
    {
      id: 'streak', name: 'Reflejos', measures: 'Mejor racha de victorias seguidas', metric: { type: 'bestStreak' },
      unit: '{n} seguidas', unitOne: '1 seguida',
      levels: [
        { at: 2, name: 'Gatillo fácil', description: 'Dos seguidas. Desenfundás más rápido que el resto.' },
        { at: 4, name: 'Lucky Luke', description: 'Cuatro al hilo: más rápido que tu propia sombra.' },
        { at: 7, name: 'Correcaminos', description: 'Siete seguidas. Bip bip y una nube de polvo.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables', 'series'],
  rules: [
    'Cada carta tiene 8 símbolos y entre dos cartas cualesquiera hay SIEMPRE exactamente un símbolo en común.',
    'Hay que encontrar ese símbolo, nombrarlo en voz alta y actuar antes que los demás.',
    'La torre infernal: se gana la carta del centro quien encuentra primero el par; al final gana el que más cartas juntó.',
    'El pozo: cada uno tiene su pila y la descarga al centro al encontrar el par; gana quien se queda sin cartas primero.',
    'Se juegan varias rondas y gana el que más ganó (o se anota cada ronda como partida).',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/63268/spot-it',
  source: 'builtin',
}
