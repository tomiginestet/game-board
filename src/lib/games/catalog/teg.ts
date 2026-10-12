import type { GameDef } from '../schema'

export const teg: GameDef = {
  id: 'teg',
  name: 'T.E.G.',
  emoji: '🌎',
  color: '#2B8A3E',
  category: 'mesa',
  tagline: 'Nadie sabía dónde quedaba Kamchatka hasta que hubo que defenderla.',
  players: { min: 2, max: 6 },
  sides: 'individual',
  mode: 'turns',
  weight: 3,
  scoring: {},
  options: [
    { id: 'commonGoal', label: 'Vale ganar por objetivo común (30 países)', type: 'boolean', default: true },
  ],
  events: [
    { id: 'conquest', name: 'País conquistado', emoji: '🚩', type: 'count', help: 'Ganó un país atacando.' },
    { id: 'continent', name: 'Continente completo', emoji: '🗺️', type: 'count', help: 'Completó un continente entero (cobra ejércitos extra).' },
    { id: 'eliminated', name: 'Eliminó a un jugador', emoji: '☠️', type: 'count', help: 'Le sacó el último país a alguien.' },
    { id: 'exchange', name: 'Canje de tarjetas', emoji: '🃏', type: 'count', help: 'Canjeó tres tarjetas por ejércitos.' },
    { id: 'kamchatka', name: 'Defendió Kamchatka', emoji: '🐻', type: 'count', help: 'Aguantó un ataque a Kamchatka. Por la patria.' },
  ],
  stats: [
    { id: 'how', label: 'Cómo ganó', type: 'choice', choices: ['Objetivo secreto', 'Conquista de 30 países', 'Por abandono'], help: 'Sólo para el ganador.' },
    { id: 'countries', label: 'Países al terminar', type: 'number' },
  ],
  awards: [
    {
      id: 'secret', name: 'Agenda oculta', measures: 'Partidas ganadas por objetivo secreto', metric: { type: 'winsWithChoice', stat: 'how', value: 'Objetivo secreto' },
      unit: '{n} objetivos cumplidos', unitOne: '1 objetivo cumplido',
      levels: [
        { at: 1, name: 'Sobre lacrado', description: 'Cumpliste tu objetivo secreto y nadie lo vio venir.' },
        { at: 3, name: 'Caballo de Troya', description: 'Tres victorias secretas: parecías inofensivo y estabas adentro.' },
        { at: 7, name: 'Maquiavelo', description: 'Siete objetivos cumplidos. El fin justificó todos los medios.' },
      ],
    },
    {
      id: 'thirty', name: 'Imperio', measures: 'Partidas ganadas conquistando 30 países', metric: { type: 'winsWithChoice', stat: 'how', value: 'Conquista de 30 países' },
      unit: '{n} victorias por 30 países', unitOne: '1 victoria por 30 países',
      levels: [
        { at: 1, name: 'Mapa pintado', description: 'Treinta países de tu color. El tablero parece una bandera tuya.' },
        { at: 3, name: 'Napoleón', description: 'Tres veces dueño del mundo. Mano en el chaleco y a posar.' },
        { at: 7, name: 'Gengis Kan', description: 'Siete conquistas totales. Desde Mongolia hasta Tierra del Fuego.' },
      ],
    },
    {
      id: 'conquest', name: 'Topadora', measures: 'Países conquistados en total', metric: { type: 'eventTotal', event: 'conquest' },
      unit: '{n} países conquistados', unitOne: '1 país conquistado',
      levels: [
        { at: 20, name: 'Soldado raso', description: 'Veinte países ganados a puro dado.' },
        { at: 80, name: 'Tanque Sherman', description: 'Ochenta países. Pasás por encima de lo que venga.' },
        { at: 200, name: 'Atila', description: 'Doscientos países conquistados: por donde pasás no vuelve a crecer el pasto.' },
      ],
    },
    {
      id: 'kamchatka', name: 'Kamchatka', measures: 'Veces que defendió Kamchatka', metric: { type: 'eventTotal', event: 'kamchatka' },
      unit: '{n} defensas de Kamchatka', unitOne: '1 defensa de Kamchatka',
      levels: [
        { at: 1, name: 'Oso siberiano', description: 'Defendiste Kamchatka. Frío, lejos y orgulloso.' },
        { at: 5, name: 'Muralla helada', description: 'Cinco defensas: Kamchatka no se toca.' },
        { at: 15, name: 'Hijo de Kamchatka', description: 'Quince defensas. Te dan la ciudadanía y un gorro de piel.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Se reparten los 50 países y cada uno recibe un objetivo secreto (conquistar ciertos continentes, destruir a un color, etc.).',
    'Cada turno se incorporan ejércitos (la mitad de tus países, más extras por continente completo y por canje de tarjetas).',
    'Se ataca con hasta 3 dados contra hasta 3 del defensor; se comparan de mayor a menor y el empate lo gana quien defiende.',
    'Si conquistaste al menos un país en tu turno sacás una tarjeta; tres iguales o tres distintas se canjean por ejércitos.',
    'Gana quien cumple su objetivo secreto o el objetivo común: ocupar 30 países.',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Plan_T%C3%A1ctico_y_Estrat%C3%A9gico_de_la_Guerra',
  source: 'builtin',
}
