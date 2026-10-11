import type { GameDef } from '../schema'

export const buraco: GameDef = {
  id: 'buraco',
  name: 'Buraco',
  emoji: '🂡',
  color: '#1C7C54',
  category: 'cartas',
  tagline: 'Dejá de mirar el muerto, que no resucita por mirarlo.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'rounds',
  weight: 2,
  scoring: { target: 3000, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'target', label: 'A cuánto', type: 'number', default: 3000, choices: [{ value: 1500, label: '1500' }, { value: 2000, label: '2000' }, { value: 3000, label: '3000' }], min: 500, max: 5000 },
  ],
  events: [
    { id: 'canastaLimpia', name: 'Canasta limpia', emoji: '✨', type: 'count', points: 200, help: 'Siete o más cartas sin comodín ni dos (+200).' },
    { id: 'canastaSucia', name: 'Canasta sucia', emoji: '🧦', type: 'count', points: 100, help: 'Siete o más cartas con comodín o dos (+100).' },
    { id: 'cierre', name: 'Cerró la mano', emoji: '🚪', type: 'count', points: 100, help: 'Se fue: bajó todo con canasta y muerto tomado (+100).' },
    { id: 'noMuerto', name: 'No tomó el muerto', emoji: '⚰️', type: 'count', points: -100, help: 'Terminó la mano sin haber levantado el muerto (-100).' },
  ],
  stats: [],
  awards: [
    {
      id: 'limpias', name: 'Canastas limpias', measures: 'Canastas limpias armadas en total', metric: { type: 'eventTotal', event: 'canastaLimpia' },
      unit: '{n} canastas limpias', unitOne: '1 canasta limpia',
      levels: [
        { at: 5, name: 'Patio baldeado', description: 'Cinco canastas limpias. Huele a lavandina y a domingo.' },
        { at: 25, name: 'Mantel de domingo', description: 'Veinticinco canastas sin una mancha. Ni el tuco se anima.' },
        { at: 80, name: 'Abuela con plumero', description: 'Ochenta canastas limpias: pasás el dedo por la mesa y no hay polvo.' },
      ],
    },
    {
      id: 'sucias', name: 'Canastas sucias', measures: 'Canastas sucias armadas en total', metric: { type: 'eventTotal', event: 'canastaSucia' },
      unit: '{n} canastas sucias', unitOne: '1 canasta sucia',
      levels: [
        { at: 5, name: 'Botines embarrados', description: 'Cinco canastas con comodín. No es lindo, pero suma.' },
        { at: 25, name: 'Agua del Riachuelo', description: 'Veinticinco canastas sucias. Mejor no preguntar qué tienen adentro.' },
        { at: 80, name: 'Chiquero de lujo', description: 'Ochenta canastas sucias: el barro también es un estilo de vida.' },
      ],
    },
    {
      id: 'cierres', name: 'Se fue', measures: 'Manos cerradas en total', metric: { type: 'eventTotal', event: 'cierre' },
      unit: '{n} cierres', unitOne: '1 cierre',
      levels: [
        { at: 5, name: 'Portazo', description: 'Cerraste cinco manos y te fuiste sin saludar.' },
        { at: 25, name: 'Persiana baja', description: 'Veinticinco cierres. Bajás la persiana como el almacén a la siesta.' },
        { at: 75, name: 'El que apaga la luz', description: 'Setenta y cinco cierres: siempre sos el último en irse… y el primero en ganar.' },
      ],
    },
    {
      id: 'sinMuerto', name: 'Muerto olvidado', measures: 'Manos terminadas sin tomar el muerto', metric: { type: 'eventTotal', event: 'noMuerto' },
      unit: '{n} muertos sin tomar', unitOne: '1 muerto sin tomar',
      levels: [
        { at: 1, name: 'Muerto en el ropero', description: 'Te quedó el muerto sin levantar. Ahí sigue, juntando polvo.' },
        { at: 5, name: 'Velorio con sanguchitos', description: 'Cinco muertos sin tomar. Ya hay que servir sánguches de miga.' },
        { at: 15, name: 'Fantasma del Colón', description: 'Quince muertos olvidados: te persiguen por los palcos.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Dos mazos de 52 cartas con 4 comodines; 11 cartas a cada uno y dos "muertos" de 11 cartas boca abajo.',
    'En tu turno robás del mazo o levantás todo el pozo, bajás juegos (piernas de un mismo número o escaleras del mismo palo) y descartás uno.',
    'Comodines y doses comodinean: un juego de 7 o más cartas es canasta limpia (+200) o sucia (+100).',
    'El primero que se queda sin cartas toma su muerto; para cerrar hace falta canasta y haber tomado el muerto (+100). El que no tomó el muerto resta 100.',
    'Al final de la mano se suman las cartas bajadas y se restan las de la mano (comodín 50, dos 20, as 15, 8 a K 10, 3 a 7 5). Se juega a 3000 (o lo que acuerden).',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Buraco',
  source: 'builtin',
}
