import { bestOfOption, lv } from '../kit'
import type { GameDef } from '../schema'

export const voley: GameDef = {
  id: 'voley',
  name: 'Vóley',
  emoji: '🏐',
  color: '#F59F00',
  category: 'deporte',
  tagline: '¡Mía! ¡Tuya! … y la pelota cae justo en el medio de los dos.',
  players: { min: 4, max: 16 },
  sides: 'teams',
  teamSize: 2,
  mode: 'sets',
  weight: 2,
  scoring: { sets: { kind: 'points', bestOf: 5, bestOfOption: 'bestOf', points: 25, lastSetPoints: 15 }, pointsName: 'sets' },
  options: [bestOfOption(5, [1, 3, 5])],
  events: [
    { id: 'ace', name: 'Ace', emoji: '🎯', type: 'count', byPlayer: true, help: 'Saque directo, sin que nadie la toque bien.' },
    { id: 'bloqueo', name: 'Bloqueo', emoji: '🧱', type: 'count', byPlayer: true, help: 'Punto de bloqueo en la red.' },
    { id: 'remate', name: 'Remate', emoji: '💥', type: 'count', byPlayer: true, help: 'Punto de ataque.' },
  ],
  stats: [],
  awards: [
    {
      id: 'remates', name: 'Martillo', measures: 'Puntos de remate propios', metric: { type: 'eventTotal', event: 'remate' },
      unit: '{n} remates', unitOne: '1 remate',
      levels: [
        lv(10, 'Mano pesada', 'Diez remates adentro. El piso todavía tiembla.', 'bolt', '#FCC419'),
        lv(40, 'Martillo de Thor', 'Cuarenta remates. Del otro lado se agachan.', 'bolt', '#F59F00'),
        lv(120, 'De Cecco de vestuario', 'Ciento veinte remates. Te piden una selfie en el buffet.', 'crown', '#E67700'),
      ],
    },
    {
      id: 'bloqueos', name: 'Paredón', measures: 'Puntos de bloqueo propios', metric: { type: 'eventTotal', event: 'bloqueo' },
      unit: '{n} bloqueos', unitOne: '1 bloqueo',
      levels: [
        lv(5, 'Ladrillo hueco', 'Cinco bloqueos. Las manos arriba y cerrar los ojos funciona.', 'shield', '#ADB5BD'),
        lv(20, 'Medianera', 'Veinte bloqueos: hay que pedir permiso para pasar.', 'shield', '#868E96'),
        lv(60, 'Muralla china', 'Sesenta bloqueos. Te ven desde el espacio.', 'shield', '#495057'),
      ],
    },
    {
      id: 'wins', name: 'Rotación', measures: 'Partidos de vóley ganados', metric: { type: 'wins' },
      unit: '{n} partidos', unitOne: '1 partido',
      levels: [
        lv(5, 'Saque de abajo', 'Cinco partidos ganados. Todavía sacás como en el colegio, pero entra.', 'star', '#FFD43B'),
        lv(20, 'Líbero de oro', 'Veinte victorias: ninguna pelota toca el piso de tu lado.', 'trophy', '#FAB005'),
        lv(60, 'Generación dorada', 'Sesenta ganados. Te estás por colgar la medalla de Seúl 88.', 'crown', '#E67700'),
      ],
    },
  ],
  perPlayer: { mvp: true },
  formats: ['knockout', 'league'],
  rules: [
    'Dos equipos (de 6 en cancha, o los que haya) separados por una red.',
    'Cada equipo tiene hasta tres toques para pasar la pelota; nadie toca dos veces seguidas.',
    'Se suma un punto en cada jugada (rally point). Sets a 25 con dos de diferencia; el quinto a 15.',
    'Al recuperar el saque, el equipo rota una posición en el sentido de las agujas del reloj.',
  ],
  rulesUrl: 'https://www.fivb.com/en/volleyball/thegame_glossary/officialrulesofthegames',
  source: 'builtin',
}
