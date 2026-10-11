import type { GameDef } from '../schema'

export const pandemic: GameDef = {
  id: 'pandemic',
  name: 'Pandemic',
  emoji: '🦠',
  color: '#0B7285',
  category: 'cooperativo',
  tagline: 'Otra vez brote en Buenos Aires. Alguien que lleve alcohol en gel.',
  players: { min: 2, max: 4 },
  sides: 'coop',
  mode: 'coop',
  weight: 3,
  scoring: {},
  options: [
    {
      id: 'epidemics', label: 'Dificultad (cartas de epidemia)', type: 'select', default: 4,
      choices: [{ value: 4, label: 'Introductoria (4)' }, { value: 5, label: 'Normal (5)' }, { value: 6, label: 'Heroica (6)' }],
    },
  ],
  events: [
    { id: 'outbreak', name: 'Brote', emoji: '💥', type: 'count', help: 'Una ciudad con 3 cubos se infectó otra vez y contagió a las vecinas.' },
    { id: 'epidemic', name: 'Epidemia', emoji: '☣️', type: 'count' },
  ],
  stats: [
    { id: 'cures', label: 'Curas descubiertas', type: 'number', help: 'De 0 a 4.' },
    { id: 'eradicated', label: 'Enfermedades erradicadas', type: 'number' },
  ],
  awards: [
    {
      id: 'wins', name: 'Salvadores del mundo', measures: 'Partidas ganadas en equipo', metric: { type: 'coopWins' },
      unit: '{n} mundos salvados', unitOne: '1 mundo salvado',
      levels: [
        { at: 1, name: 'Lavandina', description: 'Salvaron al mundo una vez. Todo baldeado con lavandina.' },
        { at: 4, name: 'Guardapolvo blanco', description: 'Cuatro victorias: la OMS les manda saludos.' },
        { at: 10, name: 'Doctor House', description: 'Diez mundos salvados. "Nunca es lupus." Era el cubo azul.' },
      ],
    },
    {
      id: 'cures', name: 'Laboratorio de vacunas', measures: 'Curas descubiertas en total', metric: { type: 'statTotal', stat: 'cures' },
      unit: '{n} curas', unitOne: '1 cura',
      levels: [
        { at: 4, name: 'Probeta', description: 'Cuatro curas descubiertas. Burbujea algo verde.' },
        { at: 15, name: 'Jeringa gigante', description: 'Quince curas: vacunan a medio planeta en fila.' },
        { at: 40, name: 'Doctor Favaloro', description: 'Cuarenta curas. Corazón grande y manos de oro.' },
      ],
    },
    {
      id: 'eradicated', name: 'Erradicador', measures: 'Enfermedades erradicadas en total', metric: { type: 'statTotal', stat: 'eradicated' },
      unit: '{n} erradicadas', unitOne: '1 erradicada',
      levels: [
        { at: 1, name: 'Fumigador', description: 'Una enfermedad borrada del mapa. Mochila y manguera.' },
        { at: 5, name: 'Matamosquitos', description: 'Cinco erradicadas: el Aedes te tiene miedo.' },
        { at: 12, name: 'Cazafantasmas', description: 'Doce enfermedades erradicadas. ¿A quién vas a llamar?' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Todos juegan juntos contra cuatro enfermedades que se expanden por el mapa. Cada uno tiene un rol con un poder especial.',
    'Por turno tenés 4 acciones: moverte, tratar cubos, construir centros de investigación, compartir cartas o descubrir una cura (5 cartas del mismo color).',
    'Después robás 2 cartas (puede salir una epidemia) e infectás ciudades. Una ciudad con un 4.º cubo genera un brote en cadena.',
    'Se gana al descubrir las 4 curas.',
    'Se pierde con 8 brotes, si se acaban los cubos de un color o si no quedan cartas para robar.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/30549/pandemic',
  source: 'builtin',
}
