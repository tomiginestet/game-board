import type { GameDef } from '../schema'

export const hombreslobo: GameDef = {
  id: 'hombreslobo',
  name: 'Los Hombres Lobo de Castronegro',
  emoji: '🐺',
  color: '#364FC7',
  category: 'fiesta',
  tagline: '"Yo dormí toda la noche, lo juro por mi vieja." Tiene pelo en las orejas.',
  players: { min: 6, max: 18 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'firstNight', name: 'Muerto la primera noche', emoji: '🌕', type: 'count', help: 'Lo comieron apenas arrancó.' },
    { id: 'lynchedWolf', name: 'Mandó a la hoguera a un lobo', emoji: '🔥', type: 'count', help: 'Acusó o votó a un lobo que terminó linchado.' },
    { id: 'survived', name: 'Sobrevivió hasta el final', emoji: '🌅', type: 'count' },
    { id: 'special', name: 'Rol especial', emoji: '🔮', type: 'count', help: 'Le tocó vidente, bruja, cazador, Cupido o niña.' },
  ],
  stats: [],
  roles: ['Lobo', 'Aldeano'],
  awards: [
    {
      id: 'wolfWins', name: 'Manada', measures: 'Partidas ganadas siendo lobo', metric: { type: 'winsAsRole', role: 'Lobo' },
      unit: '{n} victorias de lobo', unitOne: '1 victoria de lobo',
      levels: [
        { at: 1, name: 'Caperucita engañada', description: 'Ganaste de lobo. "¡Qué dientes tan grandes tenés!"' },
        { at: 4, name: 'Aullido a la luna', description: 'Cuatro victorias lobunas. Se te escucha desde el cerro.' },
        { at: 10, name: 'Lobizón', description: 'Diez victorias: séptimo hijo varón y luna llena. Que tu padrino sea el presidente.' },
      ],
    },
    {
      id: 'villagerWins', name: 'Pueblo unido', measures: 'Partidas ganadas siendo aldeano', metric: { type: 'winsAsRole', role: 'Aldeano' },
      unit: '{n} victorias de aldeano', unitOne: '1 victoria de aldeano',
      levels: [
        { at: 3, name: 'Horquilla en mano', description: 'Tres victorias del pueblo. Antorchas y horquillas a la plaza.' },
        { at: 10, name: 'Bala de plata', description: 'Diez victorias: cargaste el arma con lo único que funciona.' },
        { at: 25, name: 'Intendente de Castronegro', description: 'Veinticinco victorias. Te ganaste el sillón municipal.' },
      ],
    },
    {
      id: 'firstNight', name: 'Bocadito', measures: 'Veces que murió la primera noche', metric: { type: 'eventTotal', event: 'firstNight' },
      unit: '{n} muertes tempranas', unitOne: '1 muerte temprana',
      levels: [
        { at: 2, name: 'Picadita', description: 'Dos veces te comieron primero. Sos la entrada.' },
        { at: 6, name: 'Choripán de lobo', description: 'Seis veces devorado de arranque: el chori antes del asado.' },
        { at: 15, name: 'Plato principal', description: 'Quince veces el primero en caer. Los lobos te esperan con servilleta.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Mejor de 8 a 18 (con 6 ya se puede). Cada uno recibe un personaje secreto: lobos o aldeanos (algunos con poderes: vidente, bruja, cazador, Cupido…). Un narrador conduce.',
    'De noche todos cierran los ojos; los lobos se despiertan y eligen una víctima. Los roles especiales actúan cuando los llama el narrador.',
    'De día se revela quién murió, se debate y se vota a un sospechoso, que es eliminado y muestra su carta.',
    'Los aldeanos ganan si eliminan a todos los lobos.',
    'Los lobos ganan si se comen a todos los aldeanos.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/25821/the-werewolves-of-millers-hollow',
  source: 'builtin',
}
