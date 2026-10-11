import type { GameDef } from '../schema'

export const jenga: GameDef = {
  id: 'jenga',
  name: 'Jenga',
  emoji: '🧱',
  color: '#D9822B',
  category: 'fiesta',
  tagline: 'Temblaba más que la torre. Y después le echó la culpa al colectivo que pasó.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'knocked', name: 'Tiró la torre', emoji: '💥', type: 'count', help: 'Fue el que la derrumbó (y queda último).' },
    { id: 'savedIt', name: 'Salvada épica', emoji: '😰', type: 'count', help: 'La torre se tambaleó en su turno y no se cayó.' },
  ],
  stats: [
    { id: 'floors', label: 'Pisos de la torre al caer', type: 'number' },
  ],
  awards: [
    {
      id: 'wins', name: 'Pulso firme', measures: 'Partidas ganadas (no la tiró)', metric: { type: 'wins' },
      unit: '{n} torres en pie', unitOne: '1 torre en pie',
      levels: [
        { at: 2, name: 'Mano de relojero', description: 'Dos partidas sin tirarla. Lupa en el ojo y paciencia.' },
        { at: 8, name: 'Desactivador de bombas', description: 'Ocho victorias: cable azul, cable rojo, ni un temblor.' },
        { at: 20, name: 'Equilibrista de circo', description: 'Veinte torres en pie. Caminás por la cuerda floja con paraguas.' },
      ],
    },
    {
      id: 'floors', name: 'Rascacielos', measures: 'Torre más alta en una partida', metric: { type: 'statMax', stat: 'floors' },
      unit: '{n} pisos', unitOne: '1 piso',
      levels: [
        { at: 24, name: 'Edificio de monoblock', description: 'Veinticuatro pisos de torre. Sin ascensor.' },
        { at: 30, name: 'Kavanagh', description: 'Treinta pisos: el Kavanagh de los bloques de madera.' },
        { at: 36, name: 'Torre de Babel', description: 'Treinta y seis pisos. Llegaron al cielo y no se entienden.' },
      ],
    },
    {
      id: 'knocked', name: 'Demoledor', measures: 'Torres derrumbadas', metric: { type: 'eventTotal', event: 'knocked' },
      unit: '{n} derrumbes', unitOne: '1 derrumbe',
      levels: [
        { at: 2, name: 'Hipo', description: 'Dos torres al piso. Fue el hipo, juramos.' },
        { at: 6, name: 'Bola de demolición', description: 'Seis derrumbes. Te contratan para tirar edificios.' },
        { at: 15, name: 'King Kong', description: 'Quince torres tiradas: te trepás y la desarmás a manotazos.' },
      ],
    },
  ],
  formats: ['tables', 'series', 'knockout'],
  rules: [
    'Se arma la torre de 18 pisos de 3 bloques cruzados.',
    'Por turno sacás un bloque de cualquier piso menos el de arriba, usando una sola mano, y lo ponés arriba de todo.',
    'Hay que completar el piso de arriba antes de empezar uno nuevo; el turno termina 10 segundos después de apoyar el bloque.',
    'El que tira la torre pierde. Para anotarla: se lo pone último y los demás quedan empatados arriba (o gana el último que jugó antes).',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/2452/jenga',
  source: 'builtin',
}
