import type { GameDef } from '../schema'

export const pistascruzadas: GameDef = {
  id: 'pistascruzadas',
  name: 'Pistas Cruzadas',
  emoji: '🔠',
  color: '#1C7ED6',
  category: 'cooperativo',
  tagline: '"Fernet" para cruzar Córdoba con Remedio. Y sí, tiene lógica.',
  players: { min: 2, max: 6 },
  sides: 'coop',
  mode: 'coop',
  weight: 1,
  scoring: { finalScores: true, maxScore: 25, pointsName: 'cartas ubicadas' },
  options: [
    {
      id: 'grid', label: 'Tamaño de la grilla', type: 'select', default: 25,
      choices: [{ value: 9, label: '3 × 3 (express)' }, { value: 16, label: '4 × 4 (clásico)' }, { value: 25, label: '5 × 5 (experto)' }],
      help: 'Cuántas cartas de coordenadas hay para ubicar.',
    },
  ],
  events: [
    { id: 'telepathy', name: 'Pista telepática', emoji: '🧠', type: 'count', help: 'Una pista que todos adivinaron al toque, sin dudar.' },
    { id: 'miss', name: 'Carta errada', emoji: '❌', type: 'count', help: 'Adivinaron mal y la carta se descartó boca abajo.' },
  ],
  stats: [],
  awards: [
    {
      id: 'coopWins', name: 'Mentes conectadas', measures: 'Partidas ganadas en equipo', metric: { type: 'coopWins' },
      unit: '{n} grillas ganadas', unitOne: '1 grilla ganada',
      levels: [
        { at: 1, name: 'Dos cabezas', description: 'Primera grilla ganada en equipo. Piensan parecido, qué miedo.' },
        { at: 5, name: 'Wi-Fi mental', description: 'Cinco victorias: se pasan las ideas sin contraseña.' },
        { at: 15, name: 'Colmena', description: 'Quince grillas ganadas. Ya son un solo cerebro con muchas patas.' },
      ],
    },
    {
      id: 'best', name: 'Grilla llena', measures: 'Mejor puntaje en una partida (cartas ubicadas)', metric: { type: 'scoreMax' },
      unit: '{n} cartas ubicadas', unitOne: '1 carta ubicada',
      levels: [
        { at: 16, name: 'Batalla naval', description: 'Dieciséis cartas en su lugar: tocado y hundido.' },
        { at: 21, name: 'Crucigrama de Clarín', description: 'Veintiuna cartas: ya lo hacés en birome y sin borrar.' },
        { at: 25, name: 'Pleno al 25', description: 'Las veinticinco cartas ubicadas. Grilla perfecta, foto y cuadro.' },
      ],
    },
    {
      id: 'telepathy', name: 'Telepatía', measures: 'Pistas telepáticas en total', metric: { type: 'eventTotal', event: 'telepathy' },
      unit: '{n} pistas telepáticas', unitOne: '1 pista telepática',
      levels: [
        { at: 5, name: 'Cucharita doblada', description: 'Cinco pistas al toque. Uri Geller está nervioso.' },
        { at: 20, name: 'Turbante de adivino', description: 'Veinte pistas adivinadas sin dudar. Ya ven el futuro.' },
        { at: 50, name: 'Señal de Tusam', description: 'Cincuenta pistas telepáticas: "¡Pero qué sorpresa!", diría Tusam.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Se arma una grilla (hasta 5 × 5) con palabras en los bordes: letras A-E arriba y números 1-5 al costado.',
    'Cada uno tiene cartas de coordenadas secretas (p. ej. B3) y escribe UNA sola palabra que una las dos palabras de ese cruce.',
    'Los demás debaten y señalan la casilla: si aciertan, la carta se ubica en la grilla; si no, se descarta boca abajo.',
    'Termina cuando se acaban las cartas (o el reloj de arena en la variante con tiempo).',
    'Se cuentan las cartas bien ubicadas: 25 de 25 es la gloria. Se considera ganada con 20 o más en la grilla de 5 × 5.',
  ],
  rulesUrl: 'https://blueorangegames.eu/wp-content/uploads/2023/05/CrossClues-Rules-EN.pdf',
  source: 'builtin',
}
