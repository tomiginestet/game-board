import type { GameDef } from '../schema'

export const magic: GameDef = {
  id: 'magic',
  name: 'Magic: The Gathering',
  emoji: '🧙',
  color: '#C2410C',
  category: 'tcg',
  tagline: 'Treinta años de cartón y todavía hay uno que se queda con siete tierras en la mano.',
  players: { min: 2, max: 6 },
  sides: 'individual',
  mode: 'counter',
  weight: 3,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game (Commander)' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'estandar',
      choices: [
        { value: 'estandar', label: 'Estándar' },
        { value: 'pioneer', label: 'Pioneer' },
        { value: 'modern', label: 'Modern' },
        { value: 'legacy', label: 'Legacy / Vintage' },
        { value: 'pauper', label: 'Pauper' },
        { value: 'commander', label: 'Commander (EDH)' },
        { value: 'draft', label: 'Draft / Sellado' },
        { value: 'cube', label: 'Cube' },
      ],
      help: 'Commander se juega de a 3 o 4, con 40 de vida y un game solo.',
    },
  ],
  events: [
    { id: 'mulligan', name: 'Mulligan', emoji: '🔄', type: 'count', help: 'No le gustó la mano y volvió a robar con una carta menos.' },
    { id: 'combo', name: 'Ganó con combo', emoji: '♾️', type: 'count', help: 'Armó el combo (infinito o no) y terminó el game de golpe.' },
    { id: 'remontada', name: 'Remontada', emoji: '🧟', type: 'count', help: 'Ganó un game estando con 5 vidas o menos.' },
    { id: 'danoComandante', name: 'Daño de comandante', emoji: '👑', type: 'count', help: 'Sacó a alguien con 21 de daño de su comandante.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Planeswalker', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Tierra básica', description: 'Tres partidas ganadas. Bajaste una Montaña y ya te sentís mago.', glyph: 'crown', color: '#C2410C' },
        { at: 15, name: 'Dragón Shivano', description: 'Quince victorias: volás por encima de la mesa escupiendo fuego.', glyph: 'crown', color: '#C2410C' },
        { at: 40, name: 'Black Lotus', description: 'Cuarenta partidas ganadas. Valés más que un departamento en Palermo.', glyph: 'crown', color: '#C2410C' },
      ],
    },
    {
      id: 'combo', name: 'Combo infinito', measures: 'Games ganados con combo', metric: { type: 'eventTotal', event: 'combo' },
      unit: '{n} combos', unitOne: '1 combo',
      levels: [
        { at: 1, name: 'Bucle', description: 'Primer combo: lo explicaste diez minutos y al final era cierto.', glyph: 'bolt', color: '#C2410C' },
        { at: 5, name: 'Engranaje perfecto', description: 'Cinco combos. Las piezas encastran como relojería suiza.', glyph: 'bolt', color: '#C2410C' },
        { at: 15, name: 'Máquina de Rube Goldberg', description: 'Quince combos: una carta mueve a la otra y al final se cae el rival.', glyph: 'bolt', color: '#C2410C' },
      ],
    },
    {
      id: 'mulligan', name: 'Barajador', measures: 'Mulligans en total', metric: { type: 'eventTotal', event: 'mulligan' },
      unit: '{n} mulligans', unitOne: '1 mulligan',
      levels: [
        { at: 5, name: 'Mano de siete tierras', description: 'Cinco mulligans. Te tocó todo Islas y nada para hacer con ellas.', glyph: 'cards', color: '#C2410C' },
        { at: 20, name: 'Mezclador compulsivo', description: 'Veinte mulligans: barajás más que un crupier de Casino Flotante.', glyph: 'cards', color: '#C2410C' },
        { at: 50, name: 'Mano de cero', description: 'Cincuenta mulligans. Una vez te quedaste sin cartas antes de empezar.', glyph: 'cards', color: '#C2410C' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'tables'],
  rules: [
    'Cada uno arranca con 20 de vida (40 en Commander) y un mazo propio; se roba una mano de siete y se puede hacer mulligan.',
    'Por turno: se baja una tierra, se gira maná para lanzar criaturas, hechizos y artefactos, y se ataca.',
    'Se pierde al llegar a 0 de vida, al tener que robar sin cartas en la biblioteca o con 10 contadores de veneno.',
    'Los formatos cambian qué cartas valen: Estándar las últimas colecciones, Modern y Legacy pools más grandes, Pauper sólo comunes, Draft y Sellado se arman en el momento.',
    'En torneo se juega al mejor de tres games, con sideboard entre game y game.',
  ],
  rulesUrl: 'https://magic.wizards.com/es/rules',
  source: 'builtin',
}
