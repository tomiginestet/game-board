import type { GameDef } from '../schema'

export const smash: GameDef = {
  id: 'smash',
  name: 'Super Smash Bros.',
  emoji: '👊',
  color: '#E03131',
  category: 'video',
  tagline: 'Jugás con Kirby y te comés a todos. Literal.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [
    { id: 'stocks', label: 'Vidas (stocks)', type: 'number', default: 3, min: 1, max: 99 },
    { id: 'items', label: 'Con ítems', type: 'boolean', default: true },
  ],
  events: [
    { id: 'perfect', name: 'Ganó sin perder vidas', emoji: '💯', type: 'count' },
    { id: 'meteor', name: 'Meteorazo', emoji: '☄️', type: 'count', help: 'Mandó a alguien para abajo de un golpe (spike).' },
    { id: 'selfDestruct', name: 'Se tiró solo', emoji: '🤦', type: 'count', help: 'Se cayó del escenario sin que nadie lo tocara.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Luchador', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} victorias', unitOne: '1 victoria',
      levels: [
        { at: 3, name: 'Guante de box', description: 'Tres victorias. Ya pegás con ganas.' },
        { at: 10, name: 'Titanes en el Ring', description: 'Diez victorias: Martín Karadagián te presenta en el ring.' },
        { at: 25, name: 'Mano Maestra', description: 'Veinticinco victorias. Movés a los luchadores como muñecos.' },
      ],
    },
    {
      id: 'perfect', name: 'Intocable', measures: 'Victorias sin perder una vida', metric: { type: 'eventTotal', event: 'perfect' },
      unit: '{n} perfectas', unitOne: '1 perfecta',
      levels: [
        { at: 1, name: 'Ni despeinado', description: 'Ganaste sin perder una vida. Ni un pelo fuera de lugar.' },
        { at: 4, name: 'Teflón', description: 'Cuatro perfectas: no se te pega nada.' },
        { at: 10, name: 'Estrella invencible', description: 'Diez perfectas. Brillás de colores y nadie te toca.' },
      ],
    },
    {
      id: 'sd', name: 'Al vacío', measures: 'Veces que se tiró solo del escenario', metric: { type: 'eventTotal', event: 'selfDestruct' },
      unit: '{n} caídas solas', unitOne: '1 caída sola',
      levels: [
        { at: 3, name: 'Lemming', description: 'Tres veces al vacío sin ayuda. Seguías a alguien, seguro.' },
        { at: 10, name: 'Salto sin paracaídas', description: 'Diez caídas solitas. ¿Para qué esperar a que te peguen?' },
        { at: 25, name: 'Coyote', description: 'Veinticinco al vacío: mirás para abajo, cartelito de "chau" y caés.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables', 'series'],
  rules: [
    'Pelea en plataformas: el objetivo no es bajar la vida sino sacar a los rivales del escenario.',
    'Cuanto más porcentaje de daño acumula alguien, más lejos vuela con cada golpe.',
    'Con vidas (stocks): gana el último que queda; con tiempo: gana quien más rivales sacó.',
    'Los ítems (bates, pokébolas, la bola Smash) son opcionales; los torneos suelen jugarse sin ítems.',
  ],
  rulesUrl: 'https://www.smashbros.com/',
  source: 'builtin',
}
