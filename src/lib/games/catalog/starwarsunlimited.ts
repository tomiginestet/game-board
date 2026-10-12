import type { GameDef } from '../schema'

export const starwarsunlimited: GameDef = {
  id: 'starwarsunlimited',
  name: 'Star Wars: Unlimited',
  emoji: '🌌',
  color: '#1C3D5A',
  category: 'tcg',
  tagline: 'Que la Fuerza te acompañe… y que el rival no tenga la iniciativa justo antes que vos.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'premier',
      choices: [
        { value: 'premier', label: 'Premier' },
        { value: 'twinSuns', label: 'Twin Suns (multijugador)' },
        { value: 'sellado', label: 'Draft / Sellado' },
      ],
    },
  ],
  events: [
    { id: 'lider', name: 'Desplegó al líder', emoji: '🧑‍✈️', type: 'count', help: 'Dio vuelta al líder y lo bajó a la arena como unidad.' },
    { id: 'baseDestruida', name: 'Base destruida', emoji: '💣', type: 'count', help: 'Le hizo el último daño a la base rival.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Maestro Jedi', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Sable de entrenamiento', description: 'Tres partidas ganadas. Practicás con el casco tapando los ojos.' },
        { at: 15, name: 'Halcón Milenario', description: 'Quince victorias: hiciste el corredor de Kessel en menos de doce pársecs.' },
        { at: 40, name: 'Estrella de la Muerte', description: 'Cuarenta partidas. Tenés una luna que no es una luna.' },
      ],
    },
    {
      id: 'baseDestruida', name: 'Demoledor imperial', measures: 'Bases rivales destruidas', metric: { type: 'eventTotal', event: 'baseDestruida' },
      unit: '{n} bases', unitOne: '1 base',
      levels: [
        { at: 5, name: 'Caza TIE', description: 'Cinco bases destruidas. Hacés el ruidito del TIE con la boca.' },
        { at: 20, name: 'Destructor Estelar', description: 'Veinte bases: tu nave tapa el sol del planeta entero.' },
        { at: 60, name: 'Lado oscuro', description: 'Sesenta bases destruidas. Respirás fuerte detrás de una máscara negra.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Cada uno tiene un líder, una base (con su vida) y un mazo de al menos 50 cartas.',
    'Por ronda, una carta de la mano se pone como recurso; las unidades van a la arena terrestre o espacial.',
    'Los turnos se alternan acción por acción; el que toma la iniciativa empieza la próxima ronda.',
    'El líder se puede desplegar como unidad cuando hay recursos suficientes.',
    'Gana el que destruye la base rival. Twin Suns es la variante para 3 o 4 con dos líderes cada uno.',
  ],
  rulesUrl: 'https://starwarsunlimited.com/how-to-play',
  source: 'builtin',
}
