import type { GameDef } from '../schema'

export const coup: GameDef = {
  id: 'coup',
  name: 'Coup',
  emoji: '🎭',
  color: '#8C1C13',
  category: 'cartas',
  tagline: 'Digo que soy el Duque. ¿Me vas a dudar a mí, que te presté el auto?',
  players: { min: 2, max: 6 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'golpe', name: 'Golpe de estado', emoji: '🪖', type: 'count', help: 'Pagó 7 monedas y le sacó una influencia a alguien sin chance de defensa.' },
    { id: 'asesinato', name: 'Asesinato', emoji: '🗡️', type: 'count', help: 'Usó (o dijo que usaba) a la Asesina y le salió.' },
    { id: 'dudaAcertada', name: 'Dudó y acertó', emoji: '🧐', type: 'count', help: 'Desafió a alguien que mentía y le hizo perder una influencia.' },
    { id: 'bluffDescubierto', name: 'Lo cazaron mintiendo', emoji: '🤥', type: 'count', help: 'Lo desafiaron y no tenía el personaje que decía.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Presidente', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Banda presidencial', description: 'Tres partidas ganadas. Ya te probaste la banda frente al espejo.' },
        { at: 12, name: 'Bastón de mando', description: 'Doce victorias: el bastón es tuyo y no lo devolvés.' },
        { at: 35, name: 'Balcón de la Rosada', description: 'Treinta y cinco partidas. Saludás desde el balcón con los dos brazos.' },
      ],
    },
    {
      id: 'dudas', name: 'Detector de chamuyo', measures: 'Desafíos acertados en total', metric: { type: 'eventTotal', event: 'dudaAcertada' },
      unit: '{n} dudas acertadas', unitOne: '1 duda acertada',
      levels: [
        { at: 5, name: 'Ceja levantada', description: 'Cinco mentiras cazadas. Te alcanza con levantar una ceja.' },
        { at: 20, name: 'Lupa de detective', description: 'Veinte desafíos acertados: le ves las costuras a cualquier verso.' },
        { at: 60, name: 'Polígrafo', description: 'Sesenta mentiras cazadas. Te enchufan y das la verdad en papel.' },
      ],
    },
    {
      id: 'mentiroso', name: 'Chamuyero', measures: 'Veces que lo cazaron mintiendo', metric: { type: 'eventTotal', event: 'bluffDescubierto' },
      unit: '{n} mentiras descubiertas', unitOne: '1 mentira descubierta',
      levels: [
        { at: 3, name: 'Nariz de Pinocho', description: 'Tres mentiras descubiertas. La nariz te delata.' },
        { at: 12, name: 'Cuento del tío', description: 'Doce veces cazado: ya nadie te compra el buzón.' },
        { at: 35, name: 'Vendedor de humo', description: 'Treinta y cinco mentiras descubiertas. Tu valija está llena de humo envasado.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada uno arranca con dos cartas de influencia tapadas y 2 monedas.',
    'En tu turno hacés una acción: ingreso (1), ayuda exterior (2), golpe de estado (7 monedas) o la acción de un personaje (Duque, Asesina, Capitán, Embajador, Condesa).',
    'Podés decir que tenés cualquier personaje: si te desafían y mentías, perdés una influencia; si decías la verdad, la pierde el que dudó.',
    'Con 10 monedas o más, el golpe de estado es obligatorio.',
    'Al perder las dos influencias quedás afuera; gana el último que queda.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/131357/coup',
  source: 'builtin',
}
