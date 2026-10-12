import type { GameDef } from '../schema'

export const marvelchampions: GameDef = {
  id: 'marvelchampions',
  name: 'Marvel Champions',
  emoji: '🦸',
  color: '#C2255C',
  category: 'tcg',
  tagline: 'Hoy somos todos Vengadores. Mañana nos peleamos por quién era Spider-Man.',
  players: { min: 1, max: 4 },
  sides: 'coop',
  mode: 'coop',
  weight: 2,
  scoring: {},
  options: [
    {
      id: 'dificultad', label: 'Dificultad', type: 'select', default: 'estandar',
      choices: [{ value: 'estandar', label: 'Estándar' }, { value: 'experto', label: 'Experto' }, { value: 'heroico', label: 'Heroico' }],
    },
  ],
  events: [
    { id: 'heroeCaido', name: 'Héroe caído', emoji: '🤕', type: 'count', help: 'Uno del equipo quedó en 0 de vida.' },
    { id: 'planFrenado', name: 'Plan frustrado', emoji: '🛑', type: 'count', help: 'Sacaron todas las amenazas del plan secundario.' },
  ],
  stats: [],
  awards: [
    {
      id: 'coopWins', name: 'Vengadores', measures: 'Villanos derrotados en equipo', metric: { type: 'coopWins' },
      unit: '{n} villanos', unitOne: '1 villano',
      levels: [
        { at: 3, name: 'Antifaz de héroe', description: 'Tres villanos derrotados. El antifaz te queda pintado.', glyph: 'shield', color: '#C2255C' },
        { at: 15, name: 'Escudo del Capitán', description: 'Quince villanos: tirás el escudo y vuelve solo a la mano.', glyph: 'shield', color: '#C2255C' },
        { at: 40, name: 'Torre de los Vengadores', description: 'Cuarenta villanos. La torre tiene tu nombre en la puerta.', glyph: 'shield', color: '#C2255C' },
      ],
    },
    {
      id: 'played', name: 'Lector de historietas', measures: 'Partidas jugadas', metric: { type: 'played' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 5, name: 'Revista de kiosco', description: 'Cinco partidas. Tu primera historieta, doblada en el bolsillo.', glyph: 'meeple', color: '#C2255C' },
        { at: 25, name: 'Colección encuadernada', description: 'Veinticinco partidas: el estante lleno de tomos con lomo de colores.', glyph: 'meeple', color: '#C2255C' },
        { at: 75, name: 'Multiverso', description: 'Setenta y cinco partidas. Ya jugaste con todas las versiones de vos mismo.', glyph: 'meeple', color: '#C2255C' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Juego de cartas cooperativo (LCG): cada uno lleva un héroe con su mazo de 40 a 50 cartas.',
    'Los héroes cambian entre su forma de héroe (atacar, frustrar) y su alter ego (recuperarse).',
    'El villano avanza un plan: si junta amenazas suficientes, ganan los malos.',
    'Se gana bajando todas las fases del villano a 0 de vida; se pierde si caen todos los héroes o se completa el plan.',
  ],
  rulesUrl: 'https://www.fantasyflightgames.com/en/products/marvel-champions-the-card-game/',
  source: 'builtin',
}
