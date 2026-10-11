import type { GameDef } from '../schema'

export const virus: GameDef = {
  id: 'virus',
  name: 'Virus!',
  emoji: '🦠',
  color: '#7CB518',
  category: 'cartas',
  tagline: 'Te contagio el estómago y te robo el corazón. Como un ex, pero en cartas.',
  players: { min: 2, max: 6 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'contagio', name: 'Contagio', emoji: '🤧', type: 'count', help: 'Jugó un Contagio y repartió sus virus a los demás.' },
    { id: 'transplante', name: 'Transplante', emoji: '🫀', type: 'count', help: 'Intercambió un órgano con otro jugador.' },
    { id: 'guante', name: 'Guante de látex', emoji: '🧤', type: 'count', help: 'Hizo descartar la mano a todos los demás.' },
    { id: 'inmunizado', name: 'Inmunizó un órgano', emoji: '💉', type: 'count', help: 'Le puso dos medicinas a un órgano: ya no se lo pueden tocar.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Cuerpo sano', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Barbijo', description: 'Tres partidas ganadas. Precavido y con barbijo.' },
        { at: 12, name: 'Alcohol en gel', description: 'Doce victorias: te frotás las manos cada vez que ganás.' },
        { at: 35, name: 'Jefe de guardia', description: 'Treinta y cinco partidas. Recorrés la sala con estetoscopio y café.' },
      ],
    },
    {
      id: 'contagios', name: 'Supercontagiador', measures: 'Contagios jugados en total', metric: { type: 'eventTotal', event: 'contagio' },
      unit: '{n} contagios', unitOne: '1 contagio',
      levels: [
        { at: 5, name: 'Estornudo', description: 'Cinco contagios. Ni te tapaste la boca.' },
        { at: 20, name: 'Paciente cero', description: 'Veinte contagios: el origen de todos los males de la mesa.' },
        { at: 60, name: 'Gripe del bondi', description: 'Sesenta contagios. Contagiás un colectivo entero en hora pico.' },
      ],
    },
    {
      id: 'transplantes', name: 'Cirujano', measures: 'Transplantes en total', metric: { type: 'eventTotal', event: 'transplante' },
      unit: '{n} transplantes', unitOne: '1 transplante',
      levels: [
        { at: 3, name: 'Riñón prestado', description: 'Tres transplantes. Lo pediste prestado y no lo devolviste.' },
        { at: 10, name: 'Corazón en heladerita', description: 'Diez transplantes: andás con la heladerita de playa llena de órganos.' },
        { at: 30, name: 'Frankenstein', description: 'Treinta transplantes. Tu cuerpo es de veinte personas distintas.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada uno tiene tres cartas en mano; en tu turno jugás una (o descartás) y robás hasta volver a tener tres.',
    'Bajás órganos de cuatro colores (corazón, estómago, cerebro, hueso) y comodines.',
    'Los virus infectan órganos ajenos (dos virus lo destruyen); las medicinas curan los propios (dos lo inmunizan).',
    'Tratamientos especiales: Transplante, Ladrón de órganos, Contagio, Guante de látex y Error médico.',
    'Gana el primero que tiene cuatro órganos sanos de distinto color.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/180020/virus',
  source: 'builtin',
}
