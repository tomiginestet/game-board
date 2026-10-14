import type { GameDef } from '../schema'

export const marvelsnap: GameDef = {
  id: 'marvelsnap',
  name: 'Marvel Snap',
  emoji: '🫰',
  color: '#3B5BDB',
  category: 'video',
  tagline: 'Seis turnos, tres lugares y un chasquido de dedos para duplicar la apuesta.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 3, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 3, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }, { value: 4, label: '4 (al mejor de 7)' }], min: 1, max: 10 },
  ],
  events: [
    { id: 'snap', name: 'Snap ganado', emoji: '🫰', type: 'count', help: 'Hizo snap (duplicó la apuesta) y ganó el game.' },
    { id: 'retirada', name: 'Se retiró a tiempo', emoji: '🏃', type: 'count', help: 'Vio que perdía y se fue antes del final.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Coleccionista', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Cubo cósmico', description: 'Tres partidas ganadas. Tu primer cubo brilla en el estante.' },
        { at: 15, name: 'Carta variante', description: 'Quince victorias: tus cartas tienen marco 3D y ganas de lucirse.' },
        { at: 40, name: 'Guantelete del infinito', description: 'Cuarenta partidas. Seis gemas y la mitad del grupo hecha polvo.' },
      ],
    },
    {
      id: 'snap', name: 'Doble o nada', measures: 'Snaps ganados en total', metric: { type: 'eventTotal', event: 'snap' },
      unit: '{n} snaps', unitOne: '1 snap',
      levels: [
        { at: 5, name: 'Chasquido de dedos', description: 'Cinco snaps ganados. Chasqueás y el rival traga saliva.' },
        { at: 20, name: 'Farol de Loki', description: 'Veinte snaps: a veces tenías, a veces no. Nunca se sabe.' },
        { at: 60, name: 'Snap de Thanos', description: 'Sesenta snaps. Chasqueás y desaparece medio grupo de la mesa.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mazos de 12 cartas; la partida dura 6 turnos y los dos juegan sus cartas al mismo tiempo.',
    'Hay tres lugares en la mesa, cada uno con su efecto; gana el que tiene más poder en dos de los tres.',
    'En cualquier momento se puede hacer "snap" para duplicar lo que está en juego, o retirarse.',
    'Entre amigos se juega por batalla amistosa al mejor de N; también se puede anotar el snap ganado.',
  ],
  rulesUrl: 'https://www.marvelsnap.com/',
  source: 'builtin',
}
