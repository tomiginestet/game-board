import type { GameDef } from '../schema'

export const aventureros: GameDef = {
  id: 'aventureros',
  name: '¡Aventureros al Tren!',
  emoji: '🚂',
  color: '#C92A2A',
  category: 'mesa',
  tagline: 'Me cortaste la ruta a Winnipeg. Esto no lo olvido ni en el Belgrano Cargas.',
  players: { min: 2, max: 5 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'longestRoute', name: 'Ruta más larga', emoji: '🛤️', type: 'holder', points: 10, help: 'Tiene el recorrido continuo más largo (+10 al final).' },
    { id: 'sixRoute', name: 'Ruta de 6 vagones', emoji: '🚃', type: 'count', help: 'Reclamó una ruta de 6 vagones (+15).' },
  ],
  stats: [
    { id: 'ticketsDone', label: 'Billetes completados', type: 'number' },
    { id: 'ticketsFailed', label: 'Billetes sin completar', type: 'number', help: 'Restan sus puntos al final.' },
  ],
  awards: [
    {
      id: 'tickets', name: 'Boletería', measures: 'Más billetes completados en una partida', metric: { type: 'statMax', stat: 'ticketsDone' },
      unit: '{n} billetes en una partida', unitOne: '1 billete en una partida',
      levels: [
        { at: 4, name: 'Boleto picado', description: 'Cuatro billetes cumplidos. El guarda te saluda.' },
        { at: 7, name: 'Abono mensual', description: 'Siete billetes en una partida: viajás más que un comisionista.' },
        { at: 10, name: 'Tren a las Nubes', description: 'Diez billetes completados. Llegás a todos lados, hasta Salta por los viaductos.' },
      ],
    },
    {
      id: 'longest', name: 'Ruta más larga', measures: 'Partidas ganadas con la ruta más larga', metric: { type: 'winsWithEvent', event: 'longestRoute' },
      unit: '{n} victorias con la ruta más larga', unitOne: '1 victoria con la ruta más larga',
      levels: [
        { at: 1, name: 'Maquinista', description: 'Ganaste con la ruta más larga. Gorrita a rayas y silbato.' },
        { at: 3, name: 'Expreso de Oriente', description: 'Tres victorias con la ruta más larga: lujo y algún misterio.' },
        { at: 7, name: 'Transiberiano', description: 'Siete victorias de punta a punta del mapa sin bajarte.' },
      ],
    },
    {
      id: 'score', name: 'Locomotora', measures: 'Mayor puntaje en una partida', metric: { type: 'scoreMax' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        { at: 100, name: 'Trencito de la Costa', description: 'Cien puntos: paseo tranquilo con vista al río.' },
        { at: 130, name: 'Locomotora a vapor', description: 'Ciento treinta puntos. Chucu-chucu y humo por todos lados.' },
        { at: 160, name: 'Tren bala', description: 'Ciento sesenta puntos. Pasaste y nadie te vio.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'league', 'knockout'],
  rules: [
    'En tu turno hacés UNA cosa: robar cartas de vagón, reclamar una ruta pagando cartas de su color, o robar billetes de destino.',
    'Las rutas dan puntos según su largo: 1, 2, 4, 7, 10 o 15 (la de 6 vagones).',
    'Los billetes completados suman sus puntos al final; los que no completaste, restan.',
    'Quien tiene el recorrido continuo más largo suma 10 puntos extra.',
    'Cuando alguien queda con 2 vagones o menos, todos juegan un último turno y gana el que más puntos tiene.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/9209/ticket-to-ride',
  source: 'builtin',
}
