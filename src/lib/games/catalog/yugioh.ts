import type { GameDef } from '../schema'

export const yugioh: GameDef = {
  id: 'yugioh',
  name: 'Yu-Gi-Oh!',
  emoji: '🐲',
  color: '#5F3DC4',
  category: 'tcg',
  tagline: '¡Es hora del duelo! Y del primo que lee la carta en voz alta durante cinco minutos.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el duelo', pointsName: 'duelos' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 duelo' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'avanzado',
      choices: [
        { value: 'avanzado', label: 'Avanzado (lista prohibida)' },
        { value: 'tradicional', label: 'Tradicional' },
        { value: 'goat', label: 'GOAT (2005)' },
        { value: 'edison', label: 'Edison' },
        { value: 'speed', label: 'Speed Duel' },
        { value: 'rush', label: 'Rush Duel' },
      ],
      help: 'Speed Duel arranca con 4000 de vida; el resto, con 8000.',
    },
  ],
  events: [
    { id: 'otk', name: 'One Turn Kill', emoji: '⚔️', type: 'count', help: 'Le sacó los 8000 de vida en un solo turno.' },
    { id: 'exodia', name: 'Exodia', emoji: '🗿', type: 'count', help: 'Juntó las cinco piezas en la mano y ganó en el acto.' },
    { id: 'trampa', name: 'Trampa justa', emoji: '🪤', type: 'count', help: 'Activó la trampa en el momento exacto y le dio vuelta el duelo.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Rey de los Juegos', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Rompecabezas del Milenio', description: 'Tres partidas ganadas. Armaste el rompecabezas y se te prendió el ojo.' },
        { at: 15, name: 'Disco de duelo', description: 'Quince victorias: te atás el disco al brazo hasta para ir al chino.' },
        { at: 50, name: 'Faraón', description: 'Cincuenta partidas ganadas. Ya tenés pelo de cinco colores.' },
      ],
    },
    {
      id: 'otk', name: 'Todo en un turno', measures: 'One Turn Kills en total', metric: { type: 'eventTotal', event: 'otk' },
      unit: '{n} OTK', unitOne: '1 OTK',
      levels: [
        { at: 1, name: 'Mago Oscuro', description: 'Primer OTK: el mago de confianza hizo el trabajo.' },
        { at: 5, name: 'Dragón Blanco de Ojos Azules', description: 'Cinco OTK. Ráfaga de destrucción y a otra cosa.' },
        { at: 15, name: 'Dragón Alado de Ra', description: 'Quince OTK: un dios egipcio dorado baja a la mesa del living.' },
      ],
    },
    {
      id: 'exodia', name: 'El Prohibido', measures: 'Duelos ganados con Exodia', metric: { type: 'eventTotal', event: 'exodia' },
      unit: '{n} Exodias', unitOne: '1 Exodia',
      levels: [
        { at: 1, name: 'Las cinco piezas', description: 'Juntaste las cinco piezas. Nadie te creía hasta que las diste vuelta.' },
        { at: 3, name: 'Abuelito orgulloso', description: 'Tres Exodias: el abuelo te mira desde el mostrador de la tienda y sonríe.' },
        { at: 6, name: '¡Exodia, oblitéralo!', description: 'Seis veces. Gritás la frase y los vecinos golpean la pared.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mazo principal de 40 a 60 cartas (más Deck Extra); cada uno arranca con 8000 puntos de vida.',
    'Por turno se puede hacer una Invocación Normal, más todas las Invocaciones Especiales que permitan las cartas (Fusión, Sincronía, Xyz, Péndulo, Enlace).',
    'Los monstruos atacan en posición de ataque; las Mágicas y Trampas se colocan boca abajo y se activan en respuesta.',
    'Gana el que deja al rival en 0, si el rival no puede robar o con un efecto de victoria (Exodia).',
  ],
  rulesUrl: 'https://www.yugioh-card.com/es/rulebook/',
  source: 'builtin',
}
