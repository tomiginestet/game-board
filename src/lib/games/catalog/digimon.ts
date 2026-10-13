import type { GameDef } from '../schema'

export const digimon: GameDef = {
  id: 'digimon',
  name: 'Digimon Card Game',
  emoji: '🦖',
  color: '#E67700',
  category: 'tcg',
  tagline: 'Agumon digievoluciona a… ¿Greymon? Esperá que tengo que mirar el medidor de memoria.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
  ],
  events: [
    { id: 'mega', name: 'Digievolución a Mega', emoji: '🧬', type: 'count', help: 'Llevó un Digimon hasta el nivel 6 o más.' },
    { id: 'seguridad', name: 'Seguridad rota', emoji: '🔓', type: 'count', help: 'Rompió una carta de seguridad del rival.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Niño elegido', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Digihuevo', description: 'Tres partidas ganadas. El huevo ya se mueve.', glyph: 'trophy', color: '#E67700' },
        { at: 15, name: 'Digivice', description: 'Quince victorias: el aparatito pita y tu compañero evoluciona.', glyph: 'trophy', color: '#E67700' },
        { at: 40, name: 'Emblema del Valor', description: 'Cuarenta partidas. El emblema brilla en tu pecho.', glyph: 'trophy', color: '#E67700' },
      ],
    },
    {
      id: 'mega', name: 'Digievolución', measures: 'Digievoluciones a Mega en total', metric: { type: 'eventTotal', event: 'mega' },
      unit: '{n} Megas', unitOne: '1 Mega',
      levels: [
        { at: 3, name: 'Greymon', description: 'Tres Megas. El dinosaurio naranja con casco ya te hace caso.', glyph: 'rocket', color: '#E67700' },
        { at: 15, name: 'MetalGreymon', description: 'Quince Megas: mitad dinosaurio, mitad máquina, todo potencia.', glyph: 'rocket', color: '#E67700' },
        { at: 40, name: 'WarGreymon', description: 'Cuarenta Megas. Armadura dorada y garras que parten la mesa.', glyph: 'rocket', color: '#E67700' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mazo de 50 cartas más un Digi-mazo de huevos (hasta 5). Se ponen 5 cartas de seguridad boca abajo.',
    'Jugar cartas mueve el medidor de memoria hacia el rival: cuando pasa de su lado, termina tu turno.',
    'Los Digimon digievolucionan apilándose sobre otro de nivel menor y heredan efectos.',
    'Al atacar al jugador se rompe una carta de seguridad; gana el que ataca cuando el rival ya no tiene seguridad.',
  ],
  rulesUrl: 'https://world.digimoncard.com/rule/',
  source: 'builtin',
}
