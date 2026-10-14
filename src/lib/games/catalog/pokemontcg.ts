import type { GameDef } from '../schema'

export const pokemontcg: GameDef = {
  id: 'pokemontcg',
  name: 'Pokémon TCG',
  emoji: '⚡',
  color: '#E0A800',
  category: 'tcg',
  tagline: 'Las cartas que te sacaba la maestra en el recreo, ahora con torneos y planilla.',
  players: { min: 2, max: 2 },
  sides: 'individual',
  mode: 'counter',
  weight: 2,
  scoring: { target: 2, targetOption: 'target', quick: [1], quickLabel: 'Ganó el game', pointsName: 'games' },
  options: [
    { id: 'target', label: 'Gana el primero a', type: 'number', default: 2, choices: [{ value: 1, label: '1 game' }, { value: 2, label: '2 (al mejor de 3)' }, { value: 3, label: '3 (al mejor de 5)' }], min: 1, max: 10 },
    {
      id: 'formato', label: 'Formato', type: 'select', default: 'estandar',
      choices: [
        { value: 'estandar', label: 'Estándar' },
        { value: 'expandido', label: 'Expandido' },
        { value: 'gym', label: 'Gym Leader Challenge' },
        { value: 'retro', label: 'Retro (Base Set)' },
        { value: 'sellado', label: 'Sellado / Prerelease' },
      ],
    },
  ],
  events: [
    { id: 'ko', name: 'Knock out', emoji: '💥', type: 'count', help: 'Dejó fuera de combate a un Pokémon y se llevó premios.' },
    { id: 'exKo', name: 'KO a un ex', emoji: '⭐', type: 'count', help: 'Tumbó a un Pokémon ex o V: dos o tres premios de una.' },
    { id: 'sinMazo', name: 'Rival sin mazo', emoji: '📭', type: 'count', help: 'Ganó porque el rival no tenía cartas para robar.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Entrenador', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Medalla Roca', description: 'Tres partidas ganadas. Le ganaste a Brock y te dio la primera medalla.' },
        { at: 15, name: 'Ocho medallas', description: 'Quince victorias: la gorra llena de medallas y rumbo a la Liga.' },
        { at: 40, name: 'Campeón de la Liga', description: 'Cuarenta partidas ganadas. Entrás al Salón de la Fama con tu equipo.' },
      ],
    },
    {
      id: 'ko', name: 'Atrápalos ya', measures: 'Knock outs en total', metric: { type: 'eventTotal', event: 'ko' },
      unit: '{n} KO', unitOne: '1 KO',
      levels: [
        { at: 10, name: 'Pokébola', description: 'Diez KO. Ya sabés tirarla con efecto.' },
        { at: 50, name: 'Superball', description: 'Cincuenta KO: la azul con rayas rojas, para los que no fallan.' },
        { at: 150, name: 'Ultraball', description: 'Ciento cincuenta KO. Nada se te escapa.' },
      ],
    },
    {
      id: 'exKo', name: 'Cazador de ex', measures: 'KO a Pokémon ex o V en total', metric: { type: 'eventTotal', event: 'exKo' },
      unit: '{n} ex tumbados', unitOne: '1 ex tumbado',
      levels: [
        { at: 3, name: 'Holo brillante', description: 'Tres ex tumbados. Tu carpeta brilla con la luz de la ventana.' },
        { at: 15, name: 'Carta full art', description: 'Quince ex: tus cartas no tienen ni borde de tanto dibujo.' },
        { at: 40, name: 'Charizard primera edición', description: 'Cuarenta ex tumbados. Vale una fortuna y no lo vendés ni loco.' },
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Mazos de 60 cartas: Pokémon, Energías y Entrenadores. Cada uno pone 6 premios boca abajo.',
    'Por turno se roba, se baja un Pokémon básico o se evoluciona, se une una Energía y se ataca con el Pokémon activo.',
    'Cada KO da un premio (dos o tres si es un ex o V). Gana el primero que se lleva todos sus premios.',
    'También se gana si el rival no tiene Pokémon en juego o no puede robar al empezar su turno.',
  ],
  rulesUrl: 'https://www.pokemon.com/es/jcc-pokemon/reglas',
  source: 'builtin',
}
