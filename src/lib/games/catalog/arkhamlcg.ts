import type { GameDef } from '../schema'

export const arkhamlcg: GameDef = {
  id: 'arkhamlcg',
  name: 'Arkham Horror: El juego de cartas',
  emoji: '🐙',
  color: '#2B8A3E',
  category: 'tcg',
  tagline: 'Investigadores, bolsa de fichas del caos y la certeza de que alguien termina en el manicomio.',
  players: { min: 1, max: 4 },
  sides: 'coop',
  mode: 'coop',
  weight: 3,
  scoring: { finalScores: true, pointsName: 'puntos de experiencia' },
  options: [
    {
      id: 'dificultad', label: 'Dificultad', type: 'select', default: 'normal',
      choices: [{ value: 'facil', label: 'Fácil' }, { value: 'normal', label: 'Normal' }, { value: 'dificil', label: 'Difícil' }, { value: 'experto', label: 'Experto' }],
    },
  ],
  events: [
    { id: 'traumaMental', name: 'Trauma mental', emoji: '🌀', type: 'count', help: 'Quedó con la cordura en 0 o se llevó un trauma mental.' },
    { id: 'traumaFisico', name: 'Trauma físico', emoji: '🩹', type: 'count', help: 'Quedó con la vida en 0 o se llevó un trauma físico.' },
    { id: 'tentaculo', name: 'Salió el tentáculo', emoji: '🦑', type: 'count', help: 'Sacó la ficha de fallo automático de la bolsa del caos.' },
  ],
  stats: [],
  awards: [
    {
      id: 'coopWins', name: 'Investigador', measures: 'Escenarios ganados en equipo', metric: { type: 'coopWins' },
      unit: '{n} escenarios', unitOne: '1 escenario',
      levels: [
        { at: 3, name: 'Lámpara de aceite', description: 'Tres escenarios ganados. Con la lamparita alcanza para no tropezarte.', glyph: 'eye', color: '#2B8A3E' },
        { at: 15, name: 'Necronomicón', description: 'Quince escenarios: lo leíste entero y (casi) no te volviste loco.', glyph: 'eye', color: '#2B8A3E' },
        { at: 40, name: 'Signo Arcano', description: 'Cuarenta escenarios. Sellaste a los Primigenios con una estrellita.', glyph: 'eye', color: '#2B8A3E' },
      ],
    },
    {
      id: 'tentaculo', name: 'Bolsa del caos', measures: 'Tentáculos sacados en total', metric: { type: 'eventTotal', event: 'tentaculo' },
      unit: '{n} tentáculos', unitOne: '1 tentáculo',
      levels: [
        { at: 5, name: 'Tic nervioso', description: 'Cinco tentáculos. Ya te tiembla el ojo al meter la mano en la bolsa.', glyph: 'brain', color: '#2B8A3E' },
        { at: 20, name: 'Manicomio de Arkham', description: 'Veinte tentáculos: te guardan una cama con tu nombre.', glyph: 'brain', color: '#2B8A3E' },
        { at: 60, name: 'Abrazo de Cthulhu', description: 'Sesenta tentáculos. El Gran Antiguo te saluda como a un viejo amigo.', glyph: 'brain', color: '#2B8A3E' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Juego de cartas cooperativo (LCG) por campañas: cada uno es un investigador con su mazo.',
    'Por turno, tres acciones: investigar, moverse, pelear, evadir, robar, jugar cartas.',
    'Las pruebas se resuelven sacando una ficha de la bolsa del caos; el tentáculo es fallo automático.',
    'Se gana avanzando el mazo de acto antes de que el de plan llegue al final; las secuelas (traumas) siguen en la campaña.',
  ],
  rulesUrl: 'https://www.fantasyflightgames.com/en/products/arkham-horror-the-card-game/',
  source: 'builtin',
}
