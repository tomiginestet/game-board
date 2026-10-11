import type { GameDef } from '../schema'

export const chinchon: GameDef = {
  id: 'chinchon',
  name: 'Chinchón',
  emoji: '🪜',
  color: '#C77D12',
  category: 'cartas',
  tagline: 'Me falta una para chinchón… desde 1987.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { lowWins: true, eliminateAt: 100, eliminateOption: 'eliminate', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'eliminate', label: 'Se queda afuera al llegar a', type: 'number', default: 100, choices: [{ value: 50, label: '50' }, { value: 100, label: '100' }, { value: 150, label: '150' }], min: 50, max: 200 },
  ],
  events: [
    { id: 'chinchon', name: 'Chinchón', emoji: '🏆', type: 'count', winsGame: true, help: 'Escalera de siete del mismo palo: gana la partida en el acto.' },
    { id: 'menosDiez', name: 'Cortó con menos diez', emoji: '❄️', type: 'count', points: -10, help: 'Cortó con las siete cartas ligadas (-10).' },
    { id: 'corte', name: 'Cortó', emoji: '✂️', type: 'count', help: 'Fue el que cortó la mano.' },
    { id: 'reenganche', name: 'Se reenganchó', emoji: '🩹', type: 'count', help: 'Volvió a entrar después de pasarse, igualando al que más tiene.' },
  ],
  stats: [],
  awards: [
    {
      id: 'chinchon', name: 'Chinchones', measures: 'Chinchones hechos en total', metric: { type: 'eventTotal', event: 'chinchon' },
      unit: '{n} chinchones', unitOne: '1 chinchón',
      levels: [
        { at: 1, name: 'Escalera de pintor', description: 'Tu primer chinchón. Subiste los siete escalones sin chorrear pintura.' },
        { at: 3, name: 'Escalera Mecano', description: 'Tres chinchones. Ya parece que las cartas se arman solas.' },
        { at: 8, name: 'Escalera al cielo', description: 'Ocho chinchones: Led Zeppelin te pide permiso para tocar.' },
      ],
    },
    {
      id: 'menosDiez', name: 'Menos diez', measures: 'Cortes con menos diez en total', metric: { type: 'eventTotal', event: 'menosDiez' },
      unit: '{n} menos diez', unitOne: '1 menos diez',
      levels: [
        { at: 3, name: 'Cubito de hielo', description: 'Tres menos diez. Empezás a enfriar la planilla.' },
        { at: 15, name: 'Pingüino de vino', description: 'Quince menos diez: frío como el tinto de la jarra del bodegón.' },
        { at: 40, name: 'Base Marambio', description: 'Cuarenta menos diez. Tu planilla vive bajo cero, en la Antártida.' },
      ],
    },
    {
      id: 'cortes', name: 'Cortador serial', measures: 'Manos cortadas en total', metric: { type: 'eventTotal', event: 'corte' },
      unit: '{n} cortes', unitOne: '1 corte',
      levels: [
        { at: 10, name: 'Tijerita escolar', description: 'Diez cortes. Punta redonda, pero corta.' },
        { at: 40, name: 'Peluquero de barrio', description: 'Cuarenta cortes y siempre con charla de fútbol de fondo.' },
        { at: 120, name: 'Motosierra', description: 'Ciento veinte cortes: nadie llega a juntar nada cuando jugás vos.' },
      ],
    },
    {
      id: 'reenganche', name: 'Reenganchado', measures: 'Veces que se reenganchó', metric: { type: 'eventTotal', event: 'reenganche' },
      unit: '{n} reenganches', unitOne: '1 reenganche',
      levels: [
        { at: 1, name: 'Curita en la rodilla', description: 'Te pasaste y volviste. Un raspón nomás.' },
        { at: 4, name: 'Yeso firmado', description: 'Cuatro reenganches. Todos te firmaron el yeso y seguís jugando.' },
        { at: 12, name: 'Momia andante', description: 'Doce reenganches: más vendas que persona, pero acá estás.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Mazo español (40 o 50 cartas con comodines); siete cartas a cada uno.',
    'En tu turno robás del mazo o del pozo y descartás una; se ligan juegos de tres o más del mismo número o escaleras del mismo palo.',
    'Se puede cortar cuando lo que queda sin ligar suma poco (por lo general 5 o menos); los demás suman lo que tienen suelto.',
    'Cortar con todo ligado da menos diez; una escalera de siete del mismo palo es chinchón y gana la partida.',
    'El que llega a 100 queda afuera (se puede reenganchar igualando al que más tiene); gana el último que queda.',
  ],
  rulesUrl: 'https://juegos.gba.gob.ar/wp-content/uploads/documentos/reglamentos/especificos/adultos_mayores_deportes/chin_chon.pdf',
  source: 'builtin',
}
