import type { GameDef } from '../schema'

export const cacho: GameDef = {
  id: 'cacho',
  name: 'Cacho',
  emoji: '🥤',
  color: '#8D5524',
  category: 'dados',
  tagline: 'Seis quinas, dijo el tío con un solo dado. Dudo, tío. Dudo mucho.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'calzo', name: 'Calzó', emoji: '👞', type: 'count', help: 'Dijo que había exactamente lo apostado y acertó.' },
    { id: 'dudaAcertada', name: 'Dudó y acertó', emoji: '🤨', type: 'count', help: 'Dudó una apuesta y no había tantos: el otro pierde un dado.' },
    { id: 'pierdeDado', name: 'Perdió un dado', emoji: '🎲', type: 'count', help: 'Le tocó dejar un dado afuera.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Último en pie', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Vaso de cuero', description: 'Tres partidas ganadas. Tu cacho ya tiene olor a bar.' },
        { at: 12, name: 'Dado cargado', description: 'Doce victorias: nadie dice nada, pero todos revisan tus dados.' },
        { at: 35, name: 'Pirata del Pacífico', description: 'Treinta y cinco partidas. Jugás con parche, loro y cinco dados de hueso.' },
      ],
    },
    {
      id: 'calzo', name: 'Calzador', measures: 'Veces que calzó en total', metric: { type: 'eventTotal', event: 'calzo' },
      unit: '{n} calzadas', unitOne: '1 calzada',
      levels: [
        { at: 3, name: 'Ojota', description: 'Calzaste tres veces. Vas cómodo, en ojotas.' },
        { at: 12, name: 'Mocasín de charol', description: 'Doce calzadas: te queda justo, brillante y de punta.' },
        { at: 35, name: 'Bota de potro', description: 'Treinta y cinco calzadas. Te calza como la bota al gaucho.' },
      ],
    },
    {
      id: 'dudas', name: 'Desconfiado', measures: 'Dudas acertadas en total', metric: { type: 'eventTotal', event: 'dudaAcertada' },
      unit: '{n} dudas acertadas', unitOne: '1 duda acertada',
      levels: [
        { at: 5, name: 'Nariz de sabueso', description: 'Cinco dudas acertadas. Olés la mentira por debajo del vaso.' },
        { at: 20, name: 'Perro policía', description: 'Veinte dudas: te traen al aeropuerto a revisar cubiletes.' },
        { at: 60, name: 'Comisario de pueblo', description: 'Sesenta dudas acertadas. En tu mesa nadie miente dos veces.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada uno tiene cinco dados y un cacho (cubilete); todos tiran tapado y sólo ven los suyos.',
    'Por turno se sube la apuesta sobre cuántos dados de un número hay en toda la mesa (los ases son comodín).',
    'En vez de subir se puede dudar: si no hay tantos, pierde un dado el que apostó; si hay, el que dudó.',
    'También se puede calzar: si hay exactamente lo apostado, el que calzó recupera un dado; si no, lo pierde.',
    'Sin dados quedás afuera; gana el último que queda con dados.',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Liar%27s_dice',
  source: 'builtin',
}
