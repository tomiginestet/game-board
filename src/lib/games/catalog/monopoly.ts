import type { GameDef } from '../schema'

export const monopoly: GameDef = {
  id: 'monopoly',
  name: 'Monopoly',
  emoji: '🎩',
  color: '#099268',
  category: 'clasico',
  tagline: 'O Estanciero, como manda la tradición: compraste toda Buenos Aires y la cena sigue fría.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 3,
  scoring: {},
  options: [],
  events: [
    { id: 'jail', name: 'Fue preso', emoji: '🚔', type: 'count', help: 'Fue a la cárcel (comisaría en el Estanciero).' },
    { id: 'hotel', name: 'Hotel / estancia construida', emoji: '🏨', type: 'count', help: 'Construyó un hotel (o una estancia).' },
    { id: 'bankrupted', name: 'Quiebra provocada', emoji: '💸', type: 'count', help: 'Mandó a alguien a la quiebra cobrándole.' },
  ],
  stats: [],
  awards: [
    {
      id: 'jail', name: 'Prontuario', measures: 'Veces que fue preso', metric: { type: 'eventTotal', event: 'jail' },
      unit: '{n} visitas a la cárcel', unitOne: '1 visita a la cárcel',
      levels: [
        { at: 3, name: 'Traje a rayas', description: 'Tres veces preso. Ya te queda bien el uniforme.' },
        { at: 10, name: 'Preso VIP', description: 'Diez veces adentro: tenés celda con tele y heladerita.' },
        { at: 25, name: 'Rey del penal', description: 'Veinticinco detenciones. Los guardias te piden permiso.' },
      ],
    },
    {
      id: 'hotels', name: 'Magnate hotelero', measures: 'Hoteles o estancias construidos en total', metric: { type: 'eventTotal', event: 'hotel' },
      unit: '{n} hoteles', unitOne: '1 hotel',
      levels: [
        { at: 2, name: 'Pensión familiar', description: 'Dos hoteles. Desayuno con medialunas incluido.' },
        { at: 8, name: 'Hotel en Mar del Plata', description: 'Ocho hoteles: temporada alta todo el año.' },
        { at: 20, name: 'Llao Llao', description: 'Veinte hoteles. Vista al lago y tarifa en dólares.' },
      ],
    },
    {
      id: 'bankrupted', name: 'Usurero', measures: 'Quiebras provocadas en total', metric: { type: 'eventTotal', event: 'bankrupted' },
      unit: '{n} quiebras provocadas', unitOne: '1 quiebra provocada',
      levels: [
        { at: 1, name: 'Martillero', description: 'Fundiste a alguien y le remataste hasta la silla.' },
        { at: 5, name: 'Corralito', description: 'Cinco quiebras: nadie puede sacar un peso de tu banco.' },
        { at: 12, name: 'Tío Rico', description: 'Doce quiebras. Nadás en monedas como en una pileta.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Se tiran dos dados y se avanza: si la propiedad está libre se puede comprar; si es de otro, se le paga alquiler.',
    'Con todo un grupo de color (o zona, en el Estanciero) se construyen casas/chacras y después hoteles/estancias, y el alquiler sube.',
    'Las casillas de Suerte y Destino sacan cartas; a la cárcel se va por casilla, carta o tres dobles seguidos.',
    'Si no podés pagar hipotecás o vendés; si igual no alcanza, quebrás y quedás afuera.',
    'Gana el último que queda sin quebrar (o el más rico si cortan antes). El Estanciero es la versión argentina, con campos y provincias.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/1406/monopoly',
  source: 'builtin',
}
