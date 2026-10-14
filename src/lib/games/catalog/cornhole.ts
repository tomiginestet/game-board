import { lv } from '../kit'
import type { GameDef } from '../schema'

export const cornhole: GameDef = {
  id: 'cornhole',
  name: 'Cornhole',
  emoji: '🌽',
  color: '#FAB005',
  category: 'deporte',
  tagline: 'Bolsitas de maíz a un agujero en una tabla. Más difícil de lo que parece.',
  players: { min: 2, max: 4 },
  sides: 'either',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 21, targetOption: 'target', quick: [1, 3], quickLabel: 'En la tabla', pointsName: 'puntos' },
  options: [{ id: 'target', label: 'A cuántos', type: 'number', default: 21, choices: [{ value: 11, label: 'A 11' }, { value: 21, label: 'A 21' }], min: 5, max: 30 }],
  events: [{ id: 'airmail', name: 'Directo al agujero', emoji: '🕳️', type: 'count', help: 'La bolsita entró de una, sin tocar la tabla.' }],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Bolsa de maíz', measures: 'Partidas de cornhole ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(5, 'Choclo tierno', 'Cinco ganadas. Recién salido de la planta.', 'clover', '#FFE066'),
        lv(20, 'Humita en chala', 'Veinte victorias: ya estás bien envuelto.', 'heart', '#FCC419'),
        lv(50, 'Pochoclo explosivo', 'Cincuenta ganadas. Reventás como pochoclo en la olla.', 'flame', '#F59F00'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Dos tablas inclinadas con un agujero, enfrentadas a unos 8 metros.',
    'Bolsita que queda en la tabla: 1 punto (botón grande). Que entra al agujero: 3.',
    'Lo que hace uno anula lo del otro en esa mano (sumá sólo la diferencia). Gana el primero a 21.',
  ],
  source: 'builtin',
}
