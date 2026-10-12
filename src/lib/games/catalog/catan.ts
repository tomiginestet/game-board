import type { GameDef } from '../schema'

export const catan: GameDef = {
  id: 'catan',
  name: 'Catán',
  emoji: '🐑',
  color: '#E8590C',
  category: 'mesa',
  tagline: '¿Alguien tiene madera? Te cambio dos ovejas.',
  players: { min: 3, max: 6 },
  sides: 'individual',
  mode: 'turns',
  weight: 3,
  scoring: { target: 10, targetOption: 'target', finalScores: true, pointsName: 'puntos de victoria' },
  options: [
    { id: 'target', label: 'Puntos para ganar', type: 'number', default: 10, choices: [{ value: 10, label: '10' }, { value: 12, label: '12' }, { value: 13, label: '13 (Navegantes)' }], min: 5, max: 20 },
  ],
  events: [
    { id: 'settlement', name: 'Poblado', emoji: '🏠', type: 'count', points: 1, help: 'Construyó un poblado.' },
    { id: 'city', name: 'Ciudad', emoji: '🏰', type: 'count', points: 2, replaces: 'settlement', help: 'Mejoró un poblado a ciudad.' },
    { id: 'longestRoad', name: 'Camino más largo', emoji: '🛣️', type: 'holder', points: 2 },
    { id: 'largestArmy', name: 'Ejército más grande', emoji: '⚔️', type: 'holder', points: 2 },
    { id: 'knight', name: 'Caballero jugado', emoji: '🛡️', type: 'count', hidden: true },
    { id: 'devCard', name: 'Carta de desarrollo comprada', emoji: '📜', type: 'count', hidden: true },
    { id: 'robbed', name: 'Movió al ladrón', emoji: '🦹', type: 'count' },
  ],
  stats: [
    { id: 'vpCards', label: 'Puntos de victoria ocultos (cartas)', type: 'number' },
    { id: 'favResource', label: 'Recurso estrella', type: 'choice', choices: ['Madera', 'Ladrillo', 'Oveja', 'Trigo', 'Piedra'], help: 'El recurso que más usó para ganar.' },
  ],
  awards: [
    {
      id: 'longestRoad', name: 'Ruta 40', measures: 'Partidas ganadas con el camino más largo', metric: { type: 'winsWithEvent', event: 'longestRoad' },
      unit: '{n} victorias por la ruta', unitOne: '1 victoria por la ruta',
      levels: [
        { at: 1, name: 'Camino de tierra', description: 'Ganaste con el camino más largo. Todavía hay pozos, pero llega.' },
        { at: 3, name: 'Ruta 40', description: 'De La Quiaca a Cabo Vírgenes sin soltar el volante.' },
        { at: 7, name: 'Panamericana', description: 'Siete victorias con la ruta más larga. Ya cobrás peaje.' },
      ],
    },
    {
      id: 'army', name: 'Granaderos', measures: 'Caballeros jugados en total', metric: { type: 'eventTotal', event: 'knight' },
      unit: '{n} caballeros', unitOne: '1 caballero',
      levels: [
        { at: 5, name: 'Soldadito de plomo', description: 'Cinco caballeros a la cancha. Arranca el desfile.' },
        { at: 20, name: 'Granadero a caballo', description: 'Veinte caballeros: San Martín te pediría consejos.' },
        { at: 50, name: 'Cruce de los Andes', description: 'Cincuenta caballeros. Ningún ladrón te frena.' },
      ],
    },
    {
      id: 'devCards', name: 'Cartas bajo la manga', measures: 'Más cartas de desarrollo compradas en una partida', metric: { type: 'eventMax', event: 'devCard' },
      unit: '{n} cartas en una partida', unitOne: '1 carta en una partida',
      levels: [
        { at: 4, name: 'Mazo marcado', description: 'Cuatro cartas en una partida. Algo estás tramando.' },
        { at: 7, name: 'Tahúr del Delta', description: 'Siete cartas compradas. Jugás como en el barco casino.' },
        { at: 10, name: 'El mago Fu Manchú', description: 'Diez cartas en una partida: lo tuyo ya es magia.' },
      ],
    },
    {
      id: 'wheat', name: 'Rey del heno', measures: 'Partidas ganadas con el trigo como recurso estrella', metric: { type: 'winsWithChoice', stat: 'favResource', value: 'Trigo' },
      unit: '{n} victorias a puro trigo', unitOne: '1 victoria a puro trigo',
      levels: [
        { at: 1, name: 'Fardito', description: 'Primera victoria a base de trigo. Olor a campo.' },
        { at: 3, name: 'Rey del heno', description: 'Tres victorias con trigo. Tu silo no da más.' },
        { at: 7, name: 'Granero del mundo', description: 'Siete victorias trigueras: exportás a medio planeta.' },
      ],
    },
    {
      id: 'builder', name: 'Albañil', measures: 'Ciudades construidas en total', metric: { type: 'eventTotal', event: 'city' },
      unit: '{n} ciudades', unitOne: '1 ciudad',
      levels: [
        { at: 5, name: 'Loteo', description: 'Cinco ciudades. Ya hay barrio.' },
        { at: 15, name: 'Country con seguridad', description: 'Quince ciudades y una garita en la entrada.' },
        { at: 40, name: 'Puerto Madero', description: 'Cuarenta ciudades. Torres espejadas y todo.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada turno se tiran dos dados: todos cobran recursos de los terrenos con ese número.',
    'Con recursos se construyen caminos, poblados (1 punto), ciudades (2 puntos) y se compran cartas de desarrollo.',
    'Camino más largo (5 o más tramos) y ejército más grande (3 o más caballeros) valen 2 puntos cada uno y cambian de dueño.',
    'Con un 7 se mueve el ladrón y se roba; quien tiene más de 7 cartas descarta la mitad.',
    'Gana el primero que llega a 10 puntos de victoria en su turno.',
  ],
  rulesUrl: 'https://www.catan.com/understand-catan/game-rules',
  source: 'builtin',
}
