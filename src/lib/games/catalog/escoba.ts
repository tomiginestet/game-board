import type { GameDef } from '../schema'

export const escoba: GameDef = {
  id: 'escoba',
  name: 'Escoba de 15',
  emoji: '🧹',
  color: '#C9A227',
  category: 'cartas',
  tagline: 'Siete de oro, escoba y la abuela que dice "no me di cuenta" con cara de póker.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'rounds',
  weight: 2,
  scoring: { target: 15, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'target', label: 'A cuánto', type: 'number', default: 15, choices: [{ value: 15, label: '15' }, { value: 21, label: '21' }, { value: 30, label: '30' }, { value: 31, label: '31' }], min: 5, max: 50 },
  ],
  events: [
    { id: 'escoba', name: 'Escoba', emoji: '🧹', type: 'count', points: 1, help: 'Se llevó todas las cartas de la mesa (+1).' },
    { id: 'sieteDeOro', name: 'Siete de oro', emoji: '🪙', type: 'count', points: 1, help: 'Se quedó con el siete de oro (+1).' },
    { id: 'setenta', name: 'Setenta', emoji: '7️⃣', type: 'count', points: 1, help: 'Mayoría de sietes (o el setenta, según la mesa) (+1).' },
    { id: 'cartas', name: 'Más cartas', emoji: '🃏', type: 'count', points: 1, help: 'Juntó más de 20 cartas (+1).' },
    { id: 'oros', name: 'Más oros', emoji: '💰', type: 'count', points: 1, help: 'Juntó más oros que el rival (+1).' },
  ],
  stats: [],
  awards: [
    {
      id: 'escobas', name: 'Barrendero', measures: 'Escobas hechas en total', metric: { type: 'eventTotal', event: 'escoba' },
      unit: '{n} escobas', unitOne: '1 escoba',
      levels: [
        { at: 10, name: 'Escobillón', description: 'Diez escobas. Dejaste la vereda impecable.' },
        { at: 40, name: 'Escoba de bruja', description: 'Cuarenta escobas: ya barrés la mesa volando.' },
        { at: 120, name: 'Barrendero de oro', description: 'Ciento veinte escobas. El municipio te quiere de jefe de barrido.' },
      ],
    },
    {
      id: 'escobasPartida', name: 'Limpieza a fondo', measures: 'Más escobas en una partida', metric: { type: 'eventMax', event: 'escoba' },
      unit: '{n} escobas en una partida', unitOne: '1 escoba en una partida',
      levels: [
        { at: 3, name: 'Plumero', description: 'Tres escobas en una partida. Pasaste el plumero por la mesa.' },
        { at: 5, name: 'Aspiradora', description: 'Cinco escobas en una partida: chupás todo lo que se apoya.' },
        { at: 8, name: 'Tornado de patio', description: 'Ocho escobas en una partida. No quedó ni la mesa.' },
      ],
    },
    {
      id: 'sieteDeOro', name: 'El siete bello', measures: 'Sietes de oro levantados en total', metric: { type: 'eventTotal', event: 'sieteDeOro' },
      unit: '{n} sietes de oro', unitOne: '1 siete de oro',
      levels: [
        { at: 5, name: 'Moneda de oro', description: 'Cinco sietes de oro. Brillan en tu bolsillo.' },
        { at: 20, name: 'Lingote', description: 'Veinte sietes de oro: los guardás debajo del colchón.' },
        { at: 60, name: 'Bóveda del Central', description: 'Sesenta sietes de oro. Tenés más reservas que el Banco Central.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables', 'series'],
  rules: [
    'Mazo español de 40 cartas; la sota vale 8, el caballo 9 y el rey 10. Tres cartas a cada uno y cuatro en la mesa.',
    'Con cada carta jugada te llevás las de la mesa que, junto con ella, sumen exactamente 15.',
    'Si te llevás todo lo de la mesa es escoba (+1).',
    'Al final de la mano: +1 por el siete de oro, +1 por la mayoría de sietes (setenta), +1 por más cartas y +1 por más oros.',
    'Se juega individual o en parejas, a 15 (o 21, 30, lo que acuerden).',
  ],
  rulesUrl: 'https://juegos.gba.gob.ar/wp-content/uploads/2026/reglamentos/especificos/deportes_adultos_mayores/escoba_de_15.pdf',
  source: 'builtin',
}
