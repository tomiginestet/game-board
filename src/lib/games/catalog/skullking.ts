import type { GameDef } from '../schema'

export const skullking: GameDef = {
  id: 'skullking',
  name: 'Skull King',
  emoji: '🏴‍☠️',
  color: '#2D3142',
  category: 'cartas',
  tagline: 'Apostaste cero y te comiste cuatro bazas. Al agua, marinero.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { rounds: 10, scorer: 'skullKing', pointsName: 'puntos' },
  options: [],
  events: [
    { id: 'catorce', name: 'Catorce de color', emoji: '🔢', type: 'count', points: 10, help: 'Se llevó un 14 amarillo, violeta o verde en una baza (+10). Sólo si acertó la apuesta.' },
    { id: 'catorceNegro', name: 'Catorce negro', emoji: '🏴', type: 'count', points: 20, help: 'Se llevó el 14 de la bandera pirata (+20). Sólo si acertó la apuesta.' },
    { id: 'sirenaCazada', name: 'Pirata capturó sirena', emoji: '🧜', type: 'count', points: 20, help: 'Cada sirena capturada con un pirata (+20). Sólo si acertó la apuesta.' },
    { id: 'piratasDelRey', name: 'Skull King capturó pirata', emoji: '☠️', type: 'count', points: 30, help: 'Cada pirata capturado con el Skull King (+30). Sólo si acertó la apuesta.' },
    { id: 'reyCazado', name: 'Sirena capturó al Skull King', emoji: '👑', type: 'count', points: 40, help: 'Capturó al Skull King con una sirena (+40). Sólo si acertó la apuesta.' },
    { id: 'botin', name: 'Botín / alianza', emoji: '💰', type: 'count', askPoints: true, help: 'Bonus del botín u otros extras de la mesa (normalmente +20 si ambos aliados aciertan).' },
    { id: 'ceroAcertado', name: 'Apostó cero y acertó', emoji: '0️⃣', type: 'count', help: 'Pidió cero bazas y no se llevó ninguna.' },
  ],
  stats: [
    { id: 'exactBids', label: 'Rondas en las que acertó la apuesta', type: 'number', help: 'De 0 a 10.' },
  ],
  awards: [
    {
      id: 'reyCazado', name: 'Cazador de reyes', measures: 'Veces que capturó al Skull King con una sirena', metric: { type: 'eventTotal', event: 'reyCazado' },
      unit: '{n} reyes cazados', unitOne: '1 rey cazado',
      levels: [
        { at: 1, name: 'Beso de sirena', description: 'Hundiste al Skull King con una sirena. Ni lo vio venir.' },
        { at: 3, name: 'Corona al agua', description: 'Tres reyes cazados: las coronas se juntan en el fondo del mar.' },
        { at: 8, name: 'Leviatán', description: 'Ocho reyes hundidos. Los piratas cruzan los mares rezando que no aparezcas.' },
      ],
    },
    {
      id: 'piratas', name: 'Terror de piratas', measures: 'Piratas capturados con el Skull King en total', metric: { type: 'eventTotal', event: 'piratasDelRey' },
      unit: '{n} piratas', unitOne: '1 pirata',
      levels: [
        { at: 3, name: 'Parche en el ojo', description: 'Tres piratas capturados. Ya tenés el look.' },
        { at: 12, name: 'Pata de palo', description: 'Doce piratas: caminás haciendo toc-toc por la cubierta.' },
        { at: 35, name: 'Barba Negra', description: 'Treinta y cinco piratas capturados. Tu barba humea de pura leyenda.' },
      ],
    },
    {
      id: 'ceros', name: 'Polizón', measures: 'Rondas con apuesta cero acertada', metric: { type: 'eventTotal', event: 'ceroAcertado' },
      unit: '{n} ceros acertados', unitOne: '1 cero acertado',
      levels: [
        { at: 3, name: 'Polizón', description: 'Tres ceros acertados. Viajás escondido en un barril y nadie te ve.' },
        { at: 12, name: 'Botella al mar', description: 'Doce ceros: flotás a la deriva sin tocar una baza.' },
        { at: 35, name: 'Barco fantasma', description: 'Treinta y cinco ceros acertados. Estás, pero nadie te puede agarrar.' },
      ],
    },
    {
      id: 'exactas', name: 'Navegante exacto', measures: 'Más rondas acertadas en una partida', metric: { type: 'statMax', stat: 'exactBids' },
      unit: '{n} rondas acertadas', unitOne: '1 ronda acertada',
      levels: [
        { at: 6, name: 'Catalejo', description: 'Seis rondas acertadas en una partida. Ves venir las bazas de lejos.' },
        { at: 8, name: 'Mapa del tesoro', description: 'Ocho de diez: la cruz marca exactamente lo que pediste.' },
        { at: 10, name: 'Cofre del tesoro', description: 'Diez de diez. Partida perfecta: abrí el cofre y repartí doblones.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Diez rondas: en la ronda N cada uno recibe N cartas y apuesta cuántas bazas se va a llevar.',
    'Hay que asistir al palo; el negro (bandera pirata) es triunfo. Escapes pierden siempre; piratas ganan a los números, el Skull King gana a los piratas y la sirena gana al Skull King.',
    'Acertar la apuesta da 20 por baza; errar resta 10 por cada baza de diferencia.',
    'Apostar cero y acertar da 10 × número de ronda; fallar resta lo mismo.',
    'Bonus sólo si acertaste: catorces 10 (el negro 20), sirena con pirata 20, pirata con Skull King 30, Skull King con sirena 40.',
  ],
  rulesUrl: 'https://en.doc.boardgamearena.com/Gamehelpskullking',
  source: 'builtin',
}
