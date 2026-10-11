import type { GameDef } from '../schema'

export const ajedrez: GameDef = {
  id: 'ajedrez',
  name: 'Ajedrez',
  emoji: '♟️',
  color: '#5C4033',
  category: 'clasico',
  tagline: 'Pensá tranquilo, total el mate se enfría solo… el otro, el de jaque.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'result',
  weight: 3,
  scoring: { allowDraw: true },
  options: [],
  events: [
    { id: 'mateDelPastor', name: 'Mate del pastor', emoji: '🐑', type: 'count', help: 'Ganó en cuatro jugadas con dama y alfil sobre f7.' },
    { id: 'coronacion', name: 'Coronó un peón', emoji: '👸', type: 'count', help: 'Llevó un peón hasta el fondo y lo cambió por una pieza.' },
    { id: 'sacrificioDama', name: 'Sacrificó la dama', emoji: '🎭', type: 'count', help: 'Entregó la dama a propósito para ganar.' },
  ],
  stats: [
    { id: 'final', label: 'Cómo terminó', type: 'choice', choices: ['Jaque mate', 'Abandono', 'Tiempo', 'Tablas'] },
  ],
  awards: [
    {
      id: 'mates', name: 'Jaque mate', measures: 'Partidas ganadas por jaque mate', metric: { type: 'winsWithChoice', stat: 'final', value: 'Jaque mate' },
      unit: '{n} mates', unitOne: '1 mate',
      levels: [
        { at: 3, name: 'Caballito de madera', description: 'Tres jaque mates. Saltás en L como en la calesita.' },
        { at: 12, name: 'Torre de marfil', description: 'Doce mates: mirás el tablero desde arriba, con monóculo.' },
        { at: 35, name: 'Najdorf en el café', description: 'Treinta y cinco mates. Jugás simultáneas en el bar como don Miguel.' },
      ],
    },
    {
      id: 'pastor', name: 'Pastor', measures: 'Mates del pastor en total', metric: { type: 'eventTotal', event: 'mateDelPastor' },
      unit: '{n} mates del pastor', unitOne: '1 mate del pastor',
      levels: [
        { at: 1, name: 'Ovejita', description: 'Un mate del pastor. Alguien cayó como un corderito.' },
        { at: 3, name: 'Pastor alemán', description: 'Tres mates del pastor: ya mordés en la jugada cuatro.' },
        { at: 8, name: 'Rebaño entero', description: 'Ocho mates del pastor. Tenés una estancia de rivales esquilados.' },
      ],
    },
    {
      id: 'coronas', name: 'Coronador', measures: 'Peones coronados en total', metric: { type: 'eventTotal', event: 'coronacion' },
      unit: '{n} coronaciones', unitOne: '1 coronación',
      levels: [
        { at: 3, name: 'Corona de papel', description: 'Tres peones coronados. De la fila de atrás al trono.' },
        { at: 10, name: 'Peón con capa', description: 'Diez coronaciones: tus peones ya salen con capa de terciopelo.' },
        { at: 30, name: 'Reina de la vendimia', description: 'Treinta coronaciones. Te desfilan en carroza por Mendoza.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Tablero de 8×8; cada uno con rey, dama, dos torres, dos alfiles, dos caballos y ocho peones. Empiezan las blancas.',
    'Gana quien da jaque mate: el rey rival está atacado y no tiene escapatoria.',
    'Jugadas especiales: enroque, captura al paso y coronación del peón al llegar al fondo.',
    'Son tablas por ahogado, acuerdo, triple repetición, regla de 50 jugadas o material insuficiente.',
    'Con reloj, el que se queda sin tiempo pierde (si el rival puede dar mate).',
  ],
  rulesUrl: 'https://handbook.fide.com/chapter/E012023',
  source: 'builtin',
}
