import type { GameDef } from '../schema'

export const rummikub: GameDef = {
  id: 'rummikub',
  name: 'Rummikub',
  emoji: '🀄',
  color: '#1971C2',
  category: 'mesa',
  tagline: 'Desarmá toda la mesa para bajar una ficha. Después la armás… seguro.',
  players: { min: 2, max: 4 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { rounds: 4, roundsOption: 'rounds', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'rounds', label: 'Cantidad de manos', type: 'number', default: 4, choices: [{ value: 1, label: '1' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 6, label: '6' }], min: 1, max: 12 },
  ],
  events: [
    { id: 'cerro', name: 'Se quedó sin fichas', emoji: '🙌', type: 'count', help: 'Ganó la mano: suma lo que les quedó a los demás.' },
    { id: 'rummikub', name: 'Rummikub', emoji: '🤩', type: 'count', help: 'Bajó todas las fichas de una sola vez.' },
    { id: 'comodinEnMano', name: 'Se quedó con el comodín', emoji: '🤡', type: 'count', help: 'Terminó la mano con el comodín en el atril (-30).' },
  ],
  stats: [],
  awards: [
    {
      id: 'cerro', name: 'Atril vacío', measures: 'Manos ganadas en total', metric: { type: 'eventTotal', event: 'cerro' },
      unit: '{n} manos ganadas', unitOne: '1 mano ganada',
      levels: [
        { at: 5, name: 'Cartón lleno', description: 'Cinco manos ganadas. ¡Bingo, señora!' },
        { at: 20, name: 'Abuela del bingo', description: 'Veinte manos: fibrón en mano y diez cartones a la vez.' },
        { at: 60, name: 'Rey del bingo', description: 'Sesenta manos ganadas. El locutor del bingo te saluda por el micrófono.' },
      ],
    },
    {
      id: 'rummikub', name: 'De una', measures: 'Rummikubs (todo de una) en total', metric: { type: 'eventTotal', event: 'rummikub' },
      unit: '{n} rummikubs', unitOne: '1 rummikub',
      levels: [
        { at: 1, name: 'Atril pelado', description: 'Bajaste todo de una vez. Quedó el atril pelado y los demás mirando.' },
        { at: 3, name: 'Malabarista de semáforo', description: 'Tres rummikubs: hacés malabares con las fichas en el rojo.' },
        { at: 8, name: 'Houdini', description: 'Ocho rummikubs. Las fichas desaparecen de tu atril como por arte de magia.' },
      ],
    },
    {
      id: 'comodin', name: 'Payaso', measures: 'Manos terminadas con el comodín en el atril', metric: { type: 'eventTotal', event: 'comodinEnMano' },
      unit: '{n} comodines perdidos', unitOne: '1 comodín perdido',
      levels: [
        { at: 1, name: 'Payaso triste', description: 'Te quedaste con el comodín. Treinta puntos de tristeza pintada.' },
        { at: 5, name: 'Bufón de corte', description: 'Cinco comodines atragantados: cascabeles y nada para festejar.' },
        { at: 15, name: 'Circo Rodas', description: 'Quince comodines en el atril. Ya armaste tu propia carpa.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    '106 fichas: números del 1 al 13 en cuatro colores (dos veces cada uno) y dos comodines; 14 fichas por jugador.',
    'Se bajan grupos (mismo número, distinto color) o escaleras (mismo color, seguidos) de tres o más.',
    'La primera bajada tiene que sumar 30 o más; después se puede reacomodar todo lo de la mesa.',
    'Si no podés bajar, robás una ficha. El primero que se queda sin fichas gana la mano.',
    'Los demás restan lo que les quedó (comodín 30) y el ganador suma el total de esas restas.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Rummikub',
  source: 'builtin',
}
