import type { GameDef } from '../schema'

export const truco: GameDef = {
  id: 'truco',
  name: 'Truco',
  emoji: '🗡️',
  color: '#B02A30',
  category: 'cartas',
  tagline: 'Quiero retruco… y que traigan otro termo, que esto va para largo.',
  players: { min: 2, max: 6 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { target: 30, targetOption: 'target', tally: 'matches', quick: [1], quickLabel: 'Punto', pointsName: 'tantos' },
  options: [
    { id: 'target', label: 'A cuánto', type: 'number', default: 30, choices: [{ value: 15, label: 'A 15' }, { value: 30, label: 'A 30 (malas y buenas)' }], min: 15, max: 30 },
    { id: 'flor', label: 'Con flor', type: 'boolean', default: false, help: 'Tres cartas del mismo palo se cantan y valen 3 tantos (anulan el envido).' },
  ],
  events: [
    { id: 'envido', name: 'Envido', emoji: '🗣️', type: 'count', points: 2, help: 'Ganó un envido querido. Envido-envido: tocalo dos veces (4).' },
    { id: 'realEnvido', name: 'Real envido', emoji: '👑', type: 'count', points: 3, help: 'Ganó un real envido querido. Envido + real envido: tocá los dos (5).' },
    { id: 'faltaEnvido', name: 'Falta envido', emoji: '💣', type: 'count', askPoints: true, help: 'Se lleva lo que le falta al que va ganando para cerrar el partido (o el partido entero, según la mesa).' },
    { id: 'flor', name: 'Flor', emoji: '🌼', type: 'count', points: 3, help: 'Sólo si juegan con flor: tres cartas del mismo palo.' },
    { id: 'truco', name: 'Truco', emoji: '🃏', type: 'count', points: 2, help: 'Ganó la mano con el truco querido.' },
    { id: 'retruco', name: 'Retruco', emoji: '🔥', type: 'count', points: 3, help: 'Ganó la mano con el retruco querido.' },
    { id: 'valeCuatro', name: 'Vale cuatro', emoji: '💥', type: 'count', points: 4, help: 'Ganó la mano con el vale cuatro querido.' },
    { id: 'noQuiero', name: 'No quiero', emoji: '🙅', type: 'count', askPoints: true, help: 'Le dijeron "no quiero": truco 1, retruco 2, vale cuatro 3; envido no querido 1 (o lo acumulado antes del último canto).' },
  ],
  stats: [],
  awards: [
    {
      id: 'envido', name: 'Cantor de envidos', measures: 'Envidos queridos ganados en total', metric: { type: 'eventTotal', event: 'envido' },
      unit: '{n} envidos', unitOne: '1 envido',
      levels: [
        { at: 10, name: 'Pajarito de la radio', description: 'Diez envidos ganados. Ya te pasan en la AM de la tarde.' },
        { at: 40, name: 'Zorzal criollo', description: 'Cuarenta envidos: cantás los tantos con voz de tango.' },
        { at: 120, name: 'Gardel en el Abasto', description: 'Ciento veinte envidos. Cada día cantás mejor, como el Morocho.' },
      ],
    },
    {
      id: 'valeCuatro', name: 'Vale cuatro', measures: 'Vale cuatro ganados en total', metric: { type: 'eventTotal', event: 'valeCuatro' },
      unit: '{n} vale cuatro', unitOne: '1 vale cuatro',
      levels: [
        { at: 1, name: 'Siete bravo', description: 'Tu primer vale cuatro ganado. Te temblaba el pulso, pero salió.' },
        { at: 5, name: 'Ancho de bastos', description: 'Cinco vale cuatro. Ya no te asusta subir la parada.' },
        { at: 15, name: 'Ancho de espadas', description: 'Quince vale cuatro: sos la carta que mata a todas.' },
      ],
    },
    {
      id: 'faltaEnvido', name: 'Jugado a la falta', measures: 'Faltas envido ganadas en total', metric: { type: 'eventTotal', event: 'faltaEnvido' },
      unit: '{n} faltas envido', unitOne: '1 falta envido',
      levels: [
        { at: 1, name: 'Mano en la lata', description: 'Ganaste una falta envido. Metiste la mano en los ahorros y salió bien.' },
        { at: 3, name: 'Casino de Mar del Plata', description: 'Tres faltas envido ganadas. Te reconocen en la ruleta de la Bristol.' },
        { at: 10, name: 'Hipoteca al paño', description: 'Diez faltas envido. Te jugaste hasta la casa y la seguís teniendo.' },
      ],
    },
    {
      id: 'wins', name: 'Truquero', measures: 'Partidos de truco ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        { at: 5, name: 'Fósforo encendido', description: 'Cinco partidos ganados. Ya prendiste la primera llamita.' },
        { at: 20, name: 'Tres Patitos', description: 'Veinte partidos: una caja entera de fósforos anotando a tu favor.' },
        { at: 60, name: 'Fogón de estancia', description: 'Sesenta partidos ganados. Alrededor tuyo se juntan a ver cómo jugás.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Mazo español de 40 cartas (sin 8, 9 ni comodines); tres cartas por jugador y se juegan tres manos (bazas).',
    'Orden: ancho de espadas, ancho de bastos, siete de espadas, siete de oro, treses, doses, anchos falsos, reyes, caballos, sotas, sietes y seises falsos, cincos y cuatros.',
    'Envido (antes de jugar la primera carta): dos del mismo palo suman 20 + sus valores; querido vale 2, real envido 3, falta envido lo que falta para ganar; no querido vale 1.',
    'Truco vale 2, retruco 3 y vale cuatro 4; si no se quiere, el que cantó se lleva lo que valía antes (1, 2 o 3).',
    'Se juega a 15 o a 30 (malas y buenas), mano a mano, en parejas o de a tres; se anota con fósforos.',
    'Con flor (si se acuerda): tres cartas del mismo palo valen 3 y anulan el envido.',
  ],
  rulesUrl: 'https://www.lacapital.com.ar/informacion-general/como-jugar-al-truco-las-reglas-del-juego-cartas-mas-popular-la-argentina-n2626548.html',
  source: 'builtin',
}
