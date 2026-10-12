import type { GameDef } from '../schema'

export const mariokart: GameDef = {
  id: 'mariokart',
  name: 'Mario Kart',
  emoji: '🏎️',
  color: '#FF6B6B',
  category: 'video',
  tagline: 'Venías primero en la última vuelta. Caparazón azul. Bienvenido a la Argentina.',
  players: { min: 2, max: 12 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [
    {
      id: 'cc', label: 'Cilindrada', type: 'select', default: '150cc',
      choices: [{ value: '50cc', label: '50cc' }, { value: '100cc', label: '100cc' }, { value: '150cc', label: '150cc' }, { value: '200cc', label: '200cc' }],
    },
  ],
  events: [
    { id: 'blueShell', name: 'Caparazón azul recibido', emoji: '🐚', type: 'count', help: 'Iba primero y le cayó el azul.' },
    { id: 'fellOff', name: 'Se cayó de la pista', emoji: '🕳️', type: 'count', help: 'Lakitu lo tuvo que rescatar con la caña.' },
    { id: 'comeback', name: 'Remontada desde el fondo', emoji: '🚀', type: 'count', help: 'Ganó una carrera viniendo de los últimos puestos.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Piloto', measures: 'Copas ganadas', metric: { type: 'wins' },
      unit: '{n} copas', unitOne: '1 copa',
      levels: [
        { at: 3, name: 'Karting de Ezeiza', description: 'Tres copas. Casco prestado y mucho entusiasmo.' },
        { at: 10, name: 'Turismo Carretera', description: 'Diez copas: Ford o Chevrolet, la discusión es eterna.' },
        { at: 25, name: 'Fangio', description: 'Veinticinco copas. Cinco veces campeón del mundo te mira con respeto.' },
      ],
    },
    {
      id: 'blueShell', name: 'Blanco del azul', measures: 'Caparazones azules recibidos', metric: { type: 'eventTotal', event: 'blueShell' },
      unit: '{n} caparazones azules', unitOne: '1 caparazón azul',
      levels: [
        { at: 3, name: 'Pararrayos', description: 'Tres caparazones azules. Te buscan como el rayo al árbol.' },
        { at: 10, name: 'Piñata', description: 'Diez azules recibidos: todos te pegan y salen caramelos.' },
        { at: 25, name: 'Víctima del sistema', description: 'Veinticinco azules. El juego te odia personalmente.' },
      ],
    },
    {
      id: 'fellOff', name: 'Kamikaze del arcoíris', measures: 'Caídas de la pista', metric: { type: 'eventTotal', event: 'fellOff' },
      unit: '{n} caídas', unitOne: '1 caída',
      levels: [
        { at: 5, name: 'Banquina', description: 'Cinco veces afuera. La banquina es tuya.' },
        { at: 15, name: 'Pescado por Lakitu', description: 'Quince caídas: Lakitu ya te conoce por nombre.' },
        { at: 40, name: 'Senda del Arcoíris', description: 'Cuarenta caídas. Hiciste más saltos al vacío que vueltas.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'knockout'],
  rules: [
    'Carreras de karts de 3 vueltas; un Gran Premio es una copa de 4 carreras con puntos por puesto.',
    'Las cajas de ítems dan objetos: hongos para acelerar, cáscaras de banana, caparazones verdes, rojos y el temido azul que va al primero.',
    'Cuanto más atrás venís, mejores ítems te tocan.',
    'Se anota el puesto final de cada uno en la copa (o en la carrera suelta).',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Mario_Kart',
  source: 'builtin',
}
