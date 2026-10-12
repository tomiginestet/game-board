import type { GameDef } from '../schema'

export const podrida: GameDef = {
  id: 'podrida',
  name: 'La Podrida',
  emoji: '🍅',
  color: '#7A4B94',
  category: 'cartas',
  tagline: 'Pediste dos, hiciste cero, y encima repartís vos. Está podrida.',
  players: { min: 3, max: 7 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { scorer: 'bidTricks', bidHit: 10, bidPerTrick: 5, bidMiss: -5, pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'ceroCumplido', name: 'Pidió cero y cumplió', emoji: '🫥', type: 'count', help: 'Pidió ninguna baza y no se llevó ninguna.' },
    { id: 'todasCumplidas', name: 'Pidió todas y las hizo', emoji: '🦾', type: 'count', help: 'Pidió todas las bazas de la mano y se las llevó.' },
    { id: 'podridaAlPie', name: 'Se la comió el que reparte', emoji: '🤬', type: 'count', help: 'Repartía, no pudo pedir lo que quería por la regla del pie y no cumplió.' },
  ],
  stats: [
    { id: 'cumplidas', label: 'Manos en las que cumplió', type: 'number', help: 'Cuántas veces acertó exacto lo que pidió.' },
  ],
  awards: [
    {
      id: 'wins', name: 'Bien podrido', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Banana manchada', description: 'Tres victorias. Empezaste a madurar, con pintitas y todo.' },
        { at: 12, name: 'Queso azul', description: 'Doce victorias: olés fuerte, pero a los entendidos les encanta.' },
        { at: 40, name: 'Heladera abandonada', description: 'Cuarenta victorias. Nadie se anima a abrir la puerta para pararte.' },
      ],
    },
    {
      id: 'ceros', name: 'Cero absoluto', measures: 'Veces que pidió cero y cumplió', metric: { type: 'eventTotal', event: 'ceroCumplido' },
      unit: '{n} ceros cumplidos', unitOne: '1 cero cumplido',
      levels: [
        { at: 3, name: 'Bolsillo vacío', description: 'Tres ceros cumplidos. No te llevaste ni una pelusa.' },
        { at: 15, name: 'Billetera de jubilado', description: 'Quince ceros: el arte de no tener nada a fin de mes.' },
        { at: 40, name: 'Monje zen', description: 'Cuarenta ceros cumplidos. El vacío es tu estado natural.' },
      ],
    },
    {
      id: 'cumplidas', name: 'Pronóstico exacto', measures: 'Más manos cumplidas en una partida', metric: { type: 'statMax', stat: 'cumplidas' },
      unit: '{n} manos cumplidas', unitOne: '1 mano cumplida',
      levels: [
        { at: 6, name: 'Balanza de almacén', description: 'Seis manos cumplidas en una partida. Pesás las bazas al gramo.' },
        { at: 10, name: 'Reloj de estación', description: 'Diez manos exactas: puntual como el tren que nunca llega.' },
        { at: 14, name: 'Bola de cristal', description: 'Catorce manos cumplidas. Adivinás el futuro mejor que la tarotista del canal.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Mazo español; en cada mano se reparte una cantidad distinta de cartas (sube de a una hasta el máximo y vuelve a bajar) y se da vuelta una carta que marca el triunfo.',
    'Antes de jugar, cada uno pide cuántas bazas va a hacer; el que reparte habla último y no puede pedir un número que haga cerrar la suma ("regla del pie").',
    'Se juega como el tute: hay que asistir al palo; si no, se puede fallar con triunfo. La carta más alta se lleva la baza.',
    'Puntaje de la mesa: el que cumple exacto suma 10 más 5 por baza; el que no cumple resta 5 por cada baza de diferencia (hay mesas que dan 10 + 1 por baza y 0 al que falla).',
    'Gana el que más puntos tiene al terminar todas las manos.',
  ],
  rulesUrl: 'https://es.wikipedia.org/wiki/Pocha_(juego_de_naipes)',
  source: 'builtin',
}
