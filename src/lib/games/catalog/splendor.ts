import type { GameDef } from '../schema'

export const splendor: GameDef = {
  id: 'splendor',
  name: 'Splendor',
  emoji: '💎',
  color: '#0CA678',
  category: 'mesa',
  tagline: 'Juntás rubíes como si fueran figuritas del Mundial.',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { target: 15, finalScores: true, pointsName: 'puntos de prestigio' },
  options: [],
  events: [
    { id: 'noble', name: 'Visita de noble', emoji: '👑', type: 'count', points: 3, help: 'Un noble lo visitó (+3).' },
    { id: 'tier3', name: 'Carta de nivel 3', emoji: '🏛️', type: 'count', help: 'Compró una carta de nivel 3.' },
    { id: 'reserved', name: 'Reservó una carta', emoji: '🟡', type: 'count', help: 'Reservó una carta y se llevó un oro.' },
  ],
  stats: [],
  awards: [
    {
      id: 'nobles', name: 'Alta sociedad', measures: 'Nobles visitados en total', metric: { type: 'eventTotal', event: 'noble' },
      unit: '{n} nobles', unitOne: '1 noble',
      levels: [
        { at: 2, name: 'Te tomaste el té', description: 'Dos nobles en tu casa. Sacaste la vajilla buena.' },
        { at: 8, name: 'Palco en el Colón', description: 'Ocho nobles visitados: ya te saludan en la ópera.' },
        { at: 20, name: 'Tomando mate con la reina', description: 'Veinte nobles. La reina vino y te cebó un amargo.' },
      ],
    },
    {
      id: 'wins', name: 'Joyero', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} victorias', unitOne: '1 victoria',
      levels: [
        { at: 2, name: 'Anillo de lata', description: 'Dos victorias. Brilla, aunque te pone el dedo verde.' },
        { at: 6, name: 'Joyería de la calle Libertad', description: 'Seis victorias: tenés vidriera en el centro.' },
        { at: 15, name: 'Diamante en bruto', description: 'Quince victorias. Un pedrusco que vale fortunas.' },
      ],
    },
    {
      id: 'tier3', name: 'Gran inversión', measures: 'Más cartas de nivel 3 en una partida', metric: { type: 'eventMax', event: 'tier3' },
      unit: '{n} cartas de nivel 3', unitOne: '1 carta de nivel 3',
      levels: [
        { at: 2, name: 'Plazo fijo', description: 'Dos cartas grandes. Inversión segura, poco riesgo.' },
        { at: 3, name: 'Lingote de oro', description: 'Tres cartas de nivel 3 en una partida. Pesado y brillante.' },
        { at: 5, name: 'Caja fuerte', description: 'Cinco cartas de nivel 3: ni los Dalton te la abren.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'league', 'knockout'],
  rules: [
    'En tu turno: tomás 3 gemas distintas, o 2 iguales (si hay 4 o más en la pila), o reservás una carta y te llevás un oro, o comprás una carta.',
    'Cada carta comprada te da una gema permanente de descuento y, a veces, puntos de prestigio.',
    'No podés terminar el turno con más de 10 fichas en la mano.',
    'Si juntás las bonificaciones que pide un noble, te visita y suma 3 puntos.',
    'Cuando alguien llega a 15 puntos se termina la vuelta; gana quien más tiene (en empate, el que compró menos cartas).',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/148228/splendor',
  source: 'builtin',
}
