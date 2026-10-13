import type { PlanillaCell, PlanillaDef } from '../planilla'
import type { GameDef } from '../schema'

export const generala: GameDef = {
  id: 'generala',
  name: 'Generala',
  emoji: '🎲',
  color: '#2B6CB0',
  category: 'dados',
  tagline: 'Sacudí el cubilete como si fuera la coctelera de tu tío.',
  players: { min: 2, max: 10 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: {
    rounds: 11,
    roundLabels: ['1', '2', '3', '4', '5', '6', 'Escalera', 'Full', 'Póker', 'Generala', 'Doble generala'],
    scorer: 'sum',
    pointsName: 'puntos',
  },
  options: [],
  events: [
    { id: 'generalaServida', name: 'Generala servida', emoji: '🤯', type: 'count', winsGame: true, help: 'Cinco iguales de una sola tirada: gana la partida en el acto.' },
    { id: 'generala', name: 'Generala', emoji: '🎯', type: 'count', help: 'Anotó una generala (cinco iguales).' },
    { id: 'dobleGenerala', name: 'Doble generala', emoji: '✌️', type: 'count', help: 'Anotó la doble generala (100).' },
    { id: 'servido', name: 'Juego servido', emoji: '🍽️', type: 'count', help: 'Escalera, full o póker de una sola tirada (+5).' },
    { id: 'tachada', name: 'Tachó una casilla', emoji: '❌', type: 'count', help: 'Anotó cero en una categoría.' },
  ],
  stats: [],
  awards: [
    {
      id: 'generalas', name: 'Generalas', measures: 'Generalas anotadas en total', metric: { type: 'eventTotal', event: 'generala' },
      unit: '{n} generalas', unitOne: '1 generala',
      levels: [
        { at: 3, name: 'Cubilete de bodegón', description: 'Tres generalas. Ya te sirven la picada sin pedirla.' },
        { at: 15, name: 'Quintillizos', description: 'Quince generalas: cinco dados iguales como bebés en fila.' },
        { at: 40, name: 'Tómbola de kermesse', description: 'Cuarenta generalas. Los dados te obedecen como en la kermesse de la parroquia.' },
      ],
    },
    {
      id: 'servidas', name: 'Servida', measures: 'Generalas servidas en total', metric: { type: 'eventTotal', event: 'generalaServida' },
      unit: '{n} servidas', unitOne: '1 servida',
      levels: [
        { at: 1, name: 'Herradura', description: 'Generala servida. Alguien te colgó una herradura en la puerta.' },
        { at: 3, name: 'Trébol de cuatro', description: 'Tres servidas: ya es sospechoso, revisemos los dados.' },
        { at: 7, name: 'Mano de Dios', description: 'Siete generalas servidas. Ni el Diego tuvo tanta mano.' },
      ],
    },
    {
      id: 'dobles', name: 'Doble generala', measures: 'Dobles generalas en total', metric: { type: 'eventTotal', event: 'dobleGenerala' },
      unit: '{n} dobles', unitOne: '1 doble',
      levels: [
        { at: 1, name: 'Doble con queso', description: 'Tu primera doble generala. Pedila con papas.' },
        { at: 3, name: 'Doble de riesgo', description: 'Tres dobles: te tirás de los edificios sin cubilete de protección.' },
        { at: 8, name: 'Bis en el Colón', description: 'Ocho dobles generalas. El público pide otra y vos la das.' },
      ],
    },
    {
      id: 'planilla', name: 'Planillón', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 200, name: 'Libreta de almacenero', description: 'Doscientos puntos en una partida. Anotado en lápiz detrás de la oreja.' },
        { at: 250, name: 'Cuaderno Rivadavia', description: 'Doscientos cincuenta: planilla de tapa dura, como en la escuela.' },
        { at: 300, name: 'Contador con visera', description: 'Trescientos puntos. Te contratan para hacer el balance del club.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cinco dados y hasta tres tiradas por turno; entre tiradas se guardan los que quieras.',
    'Cada turno se anota en una categoría libre: del 1 al 6 suman los dados de ese número.',
    'Escalera 20, full 30, póker 40 (servidos, de una tirada: 25, 35 y 45); generala 50 y doble generala 100.',
    'Generala servida gana la partida en el acto. Si no te sirve nada, tachás una casilla (cero).',
    'Son 11 turnos; gana el que más suma al llenar la planilla.',
  ],
  rulesUrl: 'https://www.oia.unsam.edu.ar/wp-content/uploads/2020/04/generala.pdf',
  source: 'builtin',
}

const numero = (n: number): PlanillaCell => ({
  values: [1, 2, 3, 4, 5].map((k) => k * n),
  help: `Sumá los dados que muestran ${n}.`,
})

const juego = (base: number): PlanillaCell => ({
  values: [base, base + 5],
  help: `Vale ${base}; servido (de una tirada), ${base + 5}.`,
  events: (v) => (v === base + 5 ? ['servido'] : []),
})

const servida = { events: ['generalaServida', 'generala'], value: 50, label: 'Generala servida', help: 'Cinco iguales de una sola tirada: gana la partida en el acto.' }

/** Planilla de la generala: cada uno llena sus 11 casillas en el orden que quiera (ver `lib/games/planilla.ts`). */
export const generalaPlanilla: PlanillaDef = {
  cells: [
    numero(1),
    numero(2),
    numero(3),
    numero(4),
    numero(5),
    numero(6),
    juego(20),
    juego(30),
    juego(40),
    { values: [50], help: 'Cinco dados iguales.', events: (v) => (v > 0 ? ['generala'] : []), instantWin: servida },
    { values: [100], help: 'La segunda generala de la partida.', events: (v) => (v > 0 ? ['generala', 'dobleGenerala'] : []), instantWin: servida },
  ],
  zeroEvent: 'tachada',
}
