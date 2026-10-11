import type { GameDef } from '../schema'

export const explodingkittens: GameDef = {
  id: 'explodingkittens',
  name: 'Exploding Kittens',
  emoji: '🙀',
  color: '#E8590C',
  category: 'cartas',
  tagline: 'Es como la ruleta rusa, pero con gatitos y menos dignidad.',
  players: { min: 2, max: 5 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'desactivo', name: 'Desactivó', emoji: '🧯', type: 'count', help: 'Sacó un gatito explosivo y lo desactivó.' },
    { id: 'exploto', name: 'Explotó', emoji: '💥', type: 'count', help: 'Sacó un gatito explosivo sin desactivación: afuera.' },
    { id: 'ataque', name: 'Atacó', emoji: '⚔️', type: 'count', help: 'Jugó un Ataque y le dejó dos turnos al siguiente.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Siete vidas', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Gato de tejado', description: 'Tres partidas ganadas. Caminás por la cornisa sin caerte.' },
        { at: 12, name: 'Siete vidas', description: 'Doce victorias: te quedan vidas para regalar.' },
        { at: 35, name: 'Gato con casco', description: 'Treinta y cinco partidas. Ya venís con casco de obra y chaleco antiexplosivos.' },
      ],
    },
    {
      id: 'desactivo', name: 'Antibombas', measures: 'Gatitos desactivados en total', metric: { type: 'eventTotal', event: 'desactivo' },
      unit: '{n} desactivaciones', unitOne: '1 desactivación',
      levels: [
        { at: 5, name: 'Cable rojo', description: 'Cinco gatitos desactivados. Cortaste el cable correcto.' },
        { at: 20, name: 'Brigada antibombas', description: 'Veinte desactivaciones: traje acolchado y pulso firme.' },
        { at: 60, name: 'Gato MacGyver', description: 'Sesenta gatitos desactivados con un clip y un chicle.' },
      ],
    },
    {
      id: 'exploto', name: 'Kabum', measures: 'Veces que explotó', metric: { type: 'eventTotal', event: 'exploto' },
      unit: '{n} explosiones', unitOne: '1 explosión',
      levels: [
        { at: 3, name: 'Pelo chamuscado', description: 'Explotaste tres veces. Olés a pelo quemado.' },
        { at: 10, name: 'Cara tiznada', description: 'Diez explosiones: la cara negra y los ojitos parpadeando, como en los dibujitos.' },
        { at: 30, name: 'Hongo nuclear', description: 'Treinta explosiones. Te ven desde la estación espacial.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'En el mazo hay gatitos explosivos (uno menos que jugadores); cada uno empieza con una carta de Desactivar.',
    'En tu turno jugás las cartas que quieras (o ninguna) y terminás robando una.',
    'Si robás un gatito explosivo y no tenés Desactivar, quedás afuera; si lo desactivás, lo volvés a meter donde quieras en el mazo.',
    'Ataque, Saltar, Ver el futuro, Barajar, Favor y Nope sirven para esquivar la bomba o pasársela a otro.',
    'Gana el último que queda sin explotar.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/172225/exploding-kittens',
  source: 'builtin',
}
