import type { GameDef } from '../schema'

export const poker: GameDef = {
  id: 'poker',
  name: 'Póker',
  emoji: '♠️',
  color: '#0B6E4F',
  category: 'cartas',
  tagline: 'Fichas de garbanzo, cara de Las Vegas y el primo que siempre va all-in con 7-2.',
  players: { min: 2, max: 10 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: {},
  options: [],
  events: [
    { id: 'allInGanado', name: 'All-in ganado', emoji: '💸', type: 'count', help: 'Fue con todo y se llevó el pozo.' },
    { id: 'bluff', name: 'Bluff mostrado', emoji: '😏', type: 'count', help: 'Ganó con nada y mostró las cartas para humillar.' },
    { id: 'escaleraReal', name: 'Escalera real', emoji: '👑', type: 'count', help: '10-J-Q-K-A del mismo palo.' },
    { id: 'escaleraColor', name: 'Escalera de color', emoji: '🌈', type: 'count', help: 'Cinco cartas seguidas del mismo palo.' },
    { id: 'pokerMano', name: 'Póker de mano', emoji: '🍀', type: 'count', help: 'Cuatro cartas iguales.' },
    { id: 'recompra', name: 'Recompró fichas', emoji: '🏧', type: 'count', help: 'Se quedó sin fichas y volvió a comprar.' },
  ],
  stats: [],
  awards: [
    {
      id: 'allIn', name: 'Con todo', measures: 'All-in ganados en total', metric: { type: 'eventTotal', event: 'allInGanado' },
      unit: '{n} all-in', unitOne: '1 all-in',
      levels: [
        { at: 3, name: 'Chanchito roto', description: 'Tres all-in ganados. Rompiste la alcancía y salió bien.' },
        { at: 15, name: 'Valija de billetes', description: 'Quince all-in: salís de la mesa como de un banco en una película.' },
        { at: 40, name: 'Pileta de monedas', description: 'Cuarenta all-in ganados. Nadás en fichas como el Tío Rico.' },
      ],
    },
    {
      id: 'escaleraReal', name: 'Realeza', measures: 'Escaleras reales en total', metric: { type: 'eventTotal', event: 'escaleraReal' },
      unit: '{n} escaleras reales', unitOne: '1 escalera real',
      levels: [
        { at: 1, name: 'Corona de cartón', description: 'Una escalera real. Te dura más que la de Burger, pero es de cartón igual.' },
        { at: 2, name: 'Cetro dorado', description: 'Dos escaleras reales: esto ya no es suerte, es linaje.' },
        { at: 4, name: 'Rey Momo', description: 'Cuatro escaleras reales. Sos el rey del carnaval y la mesa baila con vos.' },
      ],
    },
    {
      id: 'bluff', name: 'Cara de póker', measures: 'Bluffs mostrados en total', metric: { type: 'eventTotal', event: 'bluff' },
      unit: '{n} bluffs', unitOne: '1 bluff',
      levels: [
        { at: 3, name: 'Cara de póker', description: 'Tres bluffs mostrados. Ni pestañeaste.' },
        { at: 12, name: 'Anteojos oscuros', description: 'Doce bluffs: jugás de noche con lentes negros y una sonrisita.' },
        { at: 35, name: 'Esfinge', description: 'Treinta y cinco bluffs. Sos un misterio de piedra que nadie descifra.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    "Texas Hold'em: dos cartas propias tapadas y cinco comunitarias (flop de 3, turn y river), con rondas de apuestas entre medio.",
    'Ciegas chica y grande obligatorias que rotan; se puede pasar, igualar, subir o irse al mazo.',
    'Gana el pozo la mejor mano de cinco: escalera real, escalera de color, póker, full, color, escalera, trío, doble par, par, carta alta.',
    'Entre amigos se juega por eliminación: el que se queda sin fichas queda afuera (salvo recompra) y se anota el orden de llegada.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Texas_hold_%27em',
  source: 'builtin',
}
