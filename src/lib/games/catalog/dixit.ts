import type { GameDef } from '../schema'

export const dixit: GameDef = {
  id: 'dixit',
  name: 'Dixit',
  emoji: '🐇',
  color: '#E67700',
  category: 'mesa',
  tagline: '"Nostalgia de domingo." Y era un conejo con un paraguas. Obvio.',
  players: { min: 3, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 2,
  scoring: { target: 30, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [
    { id: 'target', label: 'Puntos para ganar', type: 'number', default: 30, min: 10, max: 60, choices: [{ value: 30, label: '30' }, { value: 20, label: '20 (corta)' }] },
  ],
  events: [
    { id: 'storyHit', name: 'Narró justo', emoji: '📖', type: 'count', help: 'Fue narrador y adivinaron algunos, pero no todos (+3).' },
    { id: 'storyMiss', name: 'Todos o ninguno', emoji: '🙈', type: 'count', help: 'Fue narrador y adivinaron todos o nadie: 0 para él.' },
    { id: 'fooled', name: 'Engañó a la mesa', emoji: '🎭', type: 'count', help: 'Su carta se llevó votos de otros jugadores en la mano.' },
  ],
  stats: [],
  awards: [
    {
      id: 'storyHit', name: 'Cuentacuentos', measures: 'Manos de narrador bien jugadas', metric: { type: 'eventTotal', event: 'storyHit' },
      unit: '{n} narraciones justas', unitOne: '1 narración justa',
      levels: [
        { at: 3, name: 'Abuela con cuento', description: 'Tres narraciones justas. "Había una vez…" y todos callados.' },
        { at: 10, name: 'Poeta maldito', description: 'Diez veces en el punto justo entre críptico y obvio. Boina y cigarrillo.' },
        { at: 25, name: 'Borges', description: 'Veinticinco narraciones: tus pistas son un laberinto con salida.' },
      ],
    },
    {
      id: 'fooled', name: 'Ilusionista', measures: 'Manos en las que su carta engañó a otros', metric: { type: 'eventTotal', event: 'fooled' },
      unit: '{n} engaños', unitOne: '1 engaño',
      levels: [
        { at: 5, name: 'Conejo en la galera', description: 'Cinco veces votaron tu carta trucha. Sacaste el conejo.' },
        { at: 15, name: 'Pintor surrealista', description: 'Quince engaños: tu carta parecía más del narrador que la del narrador.' },
        { at: 40, name: 'Gran Hipnotizador', description: 'Cuarenta engaños. Mirá el péndulo… votá la mía…' },
      ],
    },
    {
      id: 'wins', name: 'Soñador', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} victorias', unitOne: '1 victoria',
      levels: [
        { at: 1, name: 'Cazamariposas', description: 'Primera victoria atrapada con la red.' },
        { at: 5, name: 'Globo aerostático', description: 'Cinco victorias: volás por encima de la mesa.' },
        { at: 12, name: 'Dueño de la luna', description: 'Doce victorias. Te sentás en la medialuna a mirar cómo juegan.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'El narrador elige una carta de su mano y dice una frase, palabra o sonido sobre ella.',
    'Los demás ponen boca abajo la carta suya que mejor encaje; se mezclan, se dan vuelta y todos votan cuál era la del narrador.',
    'Si adivinan todos o nadie: narrador 0 y los demás 2. Si no: narrador y quienes acertaron, 3.',
    'Cada jugador (menos el narrador) suma 1 punto por cada voto que recibió su carta.',
    'Gana el primero que llega a 30 puntos (o quien tenga más cuando se acaba el mazo).',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/39856/dixit',
  source: 'builtin',
}
