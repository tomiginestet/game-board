import type { GameDef } from '../schema'

export const amongus: GameDef = {
  id: 'amongus',
  name: 'Among Us',
  emoji: '🧑‍🚀',
  color: '#C92A6E',
  category: 'video',
  tagline: 'Rojo es re sus. Lo vi salir de la ventilación como el gato de la vecina.',
  players: { min: 4, max: 15 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: {},
  options: [],
  events: [
    { id: 'kill', name: 'Asesinato', emoji: '🔪', type: 'count', help: 'Siendo impostor, eliminó a un tripulante.' },
    { id: 'ejectedInnocent', name: 'Eyectado siendo inocente', emoji: '🚀', type: 'count', help: 'Era tripulante y lo tiraron al espacio igual.' },
    { id: 'caughtImp', name: 'Descubrió al impostor', emoji: '🔍', type: 'count', help: 'Reportó o acusó al impostor y lo echaron.' },
    { id: 'ghostTasks', name: 'Terminó tareas de fantasma', emoji: '👻', type: 'count', help: 'Muerto y todo, siguió haciendo tareas.' },
  ],
  stats: [],
  roles: ['Impostor', 'Tripulante'],
  awards: [
    {
      id: 'impWins', name: 'Sus', measures: 'Partidas ganadas siendo impostor', metric: { type: 'winsAsRole', role: 'Impostor' },
      unit: '{n} victorias de impostor', unitOne: '1 victoria de impostor',
      levels: [
        { at: 1, name: 'Ventilación', description: 'Ganaste de impostor. Saliste del ducto como si nada.' },
        { at: 5, name: 'Sabotaje', description: 'Cinco victorias: apagaste las luces y aprovechaste.' },
        { at: 12, name: 'Alien de la nave', description: 'Doce victorias de impostor. Tentáculos y cara de "yo estaba en electricidad".' },
      ],
    },
    {
      id: 'crewWins', name: 'Tripulación', measures: 'Partidas ganadas siendo tripulante', metric: { type: 'winsAsRole', role: 'Tripulante' },
      unit: '{n} victorias de tripulante', unitOne: '1 victoria de tripulante',
      levels: [
        { at: 3, name: 'Escaneo médico', description: 'Tres victorias de tripulante. Te escaneaste para demostrarlo.' },
        { at: 10, name: 'Cables conectados', description: 'Diez victorias: todos los colores en su lugar.' },
        { at: 25, name: 'Capitán de la nave', description: 'Veinticinco victorias. Gorra de capitán y botón de emergencia propio.' },
      ],
    },
    {
      id: 'kills', name: 'Asesino serial', measures: 'Eliminaciones como impostor', metric: { type: 'eventTotal', event: 'kill' },
      unit: '{n} eliminaciones', unitOne: '1 eliminación',
      levels: [
        { at: 5, name: 'Cuchillito', description: 'Cinco eliminaciones. Discreto, pero efectivo.' },
        { at: 20, name: 'Ninja del ducto', description: 'Veinte eliminaciones: entrás y salís de la ventilación como Pedro por su casa.' },
        { at: 50, name: 'Pesadilla espacial', description: 'Cincuenta eliminaciones. En el espacio nadie te escucha gritar.' },
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Tripulantes hacen tareas por la nave; uno o más impostores, disfrazados de tripulantes, los eliminan y sabotean.',
    'Si alguien encuentra un cuerpo o aprieta el botón de emergencia, se arma una reunión: se debate y se vota a quién eyectar.',
    'Los tripulantes ganan si terminan todas las tareas o eyectan a todos los impostores.',
    'Los impostores ganan si igualan en número a los tripulantes o si un sabotaje crítico no se arregla a tiempo.',
    'Los muertos siguen como fantasmas: pueden hacer tareas pero no hablar.',
  ],
  rulesUrl: 'https://www.innersloth.com/games/among-us/',
  source: 'builtin',
}
