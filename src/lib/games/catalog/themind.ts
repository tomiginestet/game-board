import type { GameDef } from '../schema'

export const themind: GameDef = {
  id: 'themind',
  name: 'The Mind',
  emoji: '🧘',
  color: '#7048E8',
  category: 'cooperativo',
  tagline: 'Silencio total. Hasta que alguien tira el 94 con el 31 en la mano.',
  players: { min: 2, max: 4 },
  sides: 'coop',
  mode: 'coop',
  weight: 1,
  scoring: { finalScores: true, maxScore: 12, pointsName: 'nivel' },
  options: [],
  events: [
    { id: 'lifeLost', name: 'Vida perdida', emoji: '💔', type: 'count', help: 'Alguien se apuró (o se durmió) y se perdió una vida.' },
    { id: 'shuriken', name: 'Estrella ninja', emoji: '✴️', type: 'count', help: 'Usaron una estrella ninja.' },
  ],
  stats: [],
  awards: [
    {
      id: 'level', name: 'Conexión mental', measures: 'Nivel más alto alcanzado', metric: { type: 'scoreMax' },
      unit: 'nivel {n}', unitOne: 'nivel 1',
      levels: [
        { at: 5, name: 'Meditación', description: 'Nivel cinco. Ojos cerrados, respiración profunda.' },
        { at: 8, name: 'Levitando', description: 'Nivel ocho: flotan a un palmo de la silla y no necesitan hablar ni para pedir pizza.' },
        { at: 12, name: 'Mente maestra', description: 'Nivel doce. Telepatía certificada por escribano.' },
      ],
    },
    {
      id: 'wins', name: 'Uno solo', measures: 'Partidas ganadas en equipo', metric: { type: 'coopWins' },
      unit: '{n} partidas ganadas', unitOne: '1 partida ganada',
      levels: [
        { at: 1, name: 'Cerebro compartido', description: 'Superaron todos los niveles juntos. Un cerebro, varias cabezas.' },
        { at: 3, name: 'Gurú', description: 'Tres victorias. Ponen incienso antes de repartir.' },
        { at: 8, name: 'Nirvana', description: 'Ocho victorias: paz total, aura dorada y cero discusiones.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Cartas del 1 al 100. En el nivel 1 cada uno recibe 1 carta, en el 2 recibe 2, y así.',
    'Hay que jugar todas las cartas al centro en orden ascendente, SIN hablar ni hacer señas: sólo sintiendo el tiempo.',
    'Si alguien juega una carta y otro tenía una menor, se pierde una vida.',
    'Una estrella ninja (todos de acuerdo) hace que cada uno descarte su carta más baja.',
    'Se gana superando 12 niveles con 2 jugadores, 10 con 3 y 8 con 4. El puntaje es el nivel alcanzado.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/244992/the-mind',
  source: 'builtin',
}
