import type { GameDef } from '../src/lib/games/schema'

// Ficha de ejemplo para la animación: un juego que no viene de fábrica, como la armaría la IA.
// Las medallas usan los dibujos genéricos (glyph + color), igual que cualquier juego agregado por el grupo.
export const bang: GameDef = {
  id: 'bang',
  name: 'Bang!',
  emoji: '🤠',
  color: '#D9480F',
  category: 'cartas',
  tagline: 'Desenfundá rápido: el Sheriff no perdona.',
  players: { min: 4, max: 7 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: {},
  options: [],
  roles: ['Sheriff', 'Alguacil', 'Forajido', 'Renegado'],
  events: [
    { id: 'bang', name: 'Bang!', emoji: '🔫', type: 'count' },
    { id: 'beer', name: 'Cerveza', emoji: '🍺', type: 'count' },
    { id: 'dynamite', name: 'Dinamita', emoji: '🧨', type: 'count' },
    { id: 'kill', name: 'Eliminó a alguien', emoji: '💀', type: 'count' },
    { id: 'jail', name: 'Cárcel', emoji: '⛓️', type: 'count', hidden: true },
  ],
  stats: [],
  awards: [
    {
      id: 'outlaw', name: 'Forajido', measures: 'Victorias como Forajido', metric: { type: 'winsAsRole', role: 'Forajido' },
      unit: '{n} victorias fuera de la ley', unitOne: '1 victoria fuera de la ley',
      levels: [
        { at: 1, name: 'Ladrón de gallinas', description: 'Primera victoria como forajido. Empezaste por lo chico.', glyph: 'coin', color: '#FAB005' },
        { at: 3, name: 'Bandido rural', description: 'Tres golpes y el pueblo ya te tiene en un cartel.', glyph: 'skull', color: '#E8590C' },
        { at: 7, name: 'Butch Cassidy', description: 'Siete victorias como forajido. Te esperan en Cholila.', glyph: 'gem', color: '#BE4BDB' },
      ],
    },
    {
      id: 'sheriff', name: 'Ley del Oeste', measures: 'Victorias como Sheriff', metric: { type: 'winsAsRole', role: 'Sheriff' },
      unit: '{n} victorias con la estrella', unitOne: '1 victoria con la estrella',
      levels: [
        { at: 1, name: 'Comisario de pueblo', description: 'Ganaste con la estrella en el pecho.', glyph: 'shield', color: '#4DABF7' },
        { at: 3, name: 'Sheriff de ley', description: 'Tres victorias: ya nadie escupe en tu saloon.', glyph: 'star', color: '#FFD43B' },
        { at: 7, name: 'Wyatt Earp', description: 'Siete victorias. El pueblo te hace una estatua.', glyph: 'crown', color: '#FCC419' },
      ],
    },
    {
      id: 'kills', name: 'Gatillo fácil', measures: 'Jugadores eliminados en total', metric: { type: 'eventTotal', event: 'kill' },
      unit: '{n} eliminados', unitOne: '1 eliminado',
      levels: [
        { at: 3, name: 'Pistolita de agua', description: 'Tres eliminados. Moja, pero duele.', glyph: 'bolt', color: '#74C0FC' },
        { at: 10, name: 'Llanero solitario', description: 'Diez eliminados y ni un amigo en la mesa.', glyph: 'flame', color: '#FF922B' },
        { at: 25, name: 'Clint Eastwood', description: 'Veinticinco eliminados con cara de nada.', glyph: 'sword', color: '#ADB5BD' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada uno tiene un rol secreto, menos el Sheriff, que se muestra.',
    'El Sheriff y los alguaciles ganan si eliminan a forajidos y renegado.',
    'Los forajidos ganan si eliminan al Sheriff; el renegado, si queda último.',
    'Con Bang! se dispara, con Cerveza se recupera una vida.',
  ],
  source: 'ai',
}
