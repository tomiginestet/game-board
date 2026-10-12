import type { GameDef } from '../schema'

export const impostor: GameDef = {
  id: 'impostor',
  name: 'El Impostor',
  emoji: '🕵️',
  color: '#C2255C',
  category: 'fiesta',
  tagline: '"Eh… algo que se usa… en lugares." Sí, sos vos, fiera.',
  players: { min: 3, max: 24 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [
    {
      id: 'impostors', label: 'Impostores por ronda', type: 'number', default: 1, min: 1, max: 4,
      choices: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }],
      help: 'Con más de 8 jugadores suele ir con 2 impostores.',
    },
    {
      id: 'guessToWin', label: 'El impostor puede robar la victoria adivinando la palabra', type: 'boolean', default: true,
      help: 'Si lo descubren, tiene una chance de decir la palabra secreta y ganar igual.',
    },
  ],
  events: [
    { id: 'caught', name: 'Descubierto', emoji: '🚨', type: 'count', help: 'Era impostor y lo votaron.' },
    { id: 'stoleWord', name: 'Adivinó la palabra', emoji: '🎯', type: 'count', help: 'Siendo impostor, adivinó la palabra secreta.' },
    { id: 'framed', name: 'Votado siendo inocente', emoji: '😤', type: 'count', help: 'Tenía la palabra y lo echaron igual por una pista rara.' },
    { id: 'sniffed', name: 'Lo olfateó', emoji: '👃', type: 'count', help: 'Fue el primero en votar (o acusar) al impostor de verdad.' },
    { id: 'tooObvious', name: 'Pista regalada', emoji: '🎁', type: 'count', help: 'Dio una pista tan obvia que el impostor se avivó de la palabra.' },
  ],
  stats: [],
  roles: ['Impostor', 'Tripulante'],
  awards: [
    {
      id: 'impWins', name: 'Lobo con piel de oveja', measures: 'Partidas ganadas siendo impostor', metric: { type: 'winsAsRole', role: 'Impostor' },
      unit: '{n} victorias como impostor', unitOne: '1 victoria como impostor',
      levels: [
        { at: 1, name: 'Cara de nada', description: 'Ganaste de impostor sin que se te moviera un músculo.' },
        { at: 5, name: 'Chamuyero', description: 'Cinco veces los convenciste de algo que no sabías. Tenés futuro en la política.' },
        { at: 12, name: 'Vendedor de buzones', description: 'Doce victorias de impostor: le vendés un buzón a cualquiera de este grupo.' },
      ],
    },
    {
      id: 'crewWins', name: 'Ojo de halcón', measures: 'Partidas ganadas con la palabra (tripulación)', metric: { type: 'winsAsRole', role: 'Tripulante' },
      unit: '{n} victorias con la palabra', unitOne: '1 victoria con la palabra',
      levels: [
        { at: 3, name: 'Perro guardián', description: 'Tres victorias del lado bueno. Olfateás al intruso desde la cucha.' },
        { at: 10, name: 'Detective Conan', description: 'Diez impostores cazados: siempre hay una sola verdad.' },
        { at: 25, name: 'Hércules Poirot', description: 'Veinticinco victorias. Te atusás el bigote y ya sabés quién es.' },
      ],
    },
    {
      id: 'stoleWord', name: 'Ladrón de palabras', measures: 'Veces que adivinó la palabra secreta siendo impostor', metric: { type: 'eventTotal', event: 'stoleWord' },
      unit: '{n} palabras robadas', unitOne: '1 palabra robada',
      levels: [
        { at: 1, name: 'Oreja parada', description: 'Escuchaste las pistas y sacaste la palabra. Antena de televisor.' },
        { at: 4, name: 'Pungista de pistas', description: 'Cuatro palabras afanadas en el colectivo de las pistas.' },
        { at: 10, name: 'Lector de mentes', description: 'Diez veces adivinaste la palabra. Te pusimos papel aluminio en la cabeza por las dudas.' },
      ],
    },
    {
      id: 'framed', name: 'Chivo expiatorio', measures: 'Veces que lo echaron siendo inocente', metric: { type: 'eventTotal', event: 'framed' },
      unit: '{n} veces echado sin culpa', unitOne: '1 vez echado sin culpa',
      levels: [
        { at: 2, name: 'Sospechoso de siempre', description: 'Dos veces te votaron sin ser. Es la cara, viste.' },
        { at: 6, name: 'Cara de culpable', description: 'Seis expulsiones injustas. Ni hablás y ya te miran feo.' },
        { at: 15, name: 'Preso de Alcatraz', description: 'Quince veces condenado siendo inocente. Pedí la revisión del caso.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Todos reciben la misma palabra secreta (en el celu o en un papelito) menos el impostor, que no sabe cuál es.',
    'Por turnos, cada uno dice UNA palabra relacionada: ni muy obvia (el impostor se aviva) ni muy rara (te votan a vos).',
    'Después de cada vuelta se vota a quién echar; no vale repetir pistas, hacer gestos ni decir la palabra.',
    'Si echan al impostor gana la tripulación (con la variante, el impostor puede adivinar la palabra y robar la victoria).',
    'Si quedan dos jugadores y el impostor sigue adentro, gana el impostor.',
  ],
  rulesUrl: 'https://www.lacapital.com.ar/informacion-general/el-fenomeno-viral-del-momento-como-se-juega-al-impostor-y-cuales-son-sus-reglas-n10238921.html',
  source: 'builtin',
}
