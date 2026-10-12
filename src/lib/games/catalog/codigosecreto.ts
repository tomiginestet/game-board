import type { GameDef } from '../schema'

export const codigosecreto: GameDef = {
  id: 'codigosecreto',
  name: 'Código Secreto',
  emoji: '🕶️',
  color: '#5F3DC4',
  category: 'fiesta',
  tagline: '"Asado, 3." Y tu compañero toca "vaca", "parrilla"… y el asesino.',
  players: { min: 4, max: 12 },
  sides: 'teams',
  teamSize: 2,
  mode: 'result',
  weight: 2,
  scoring: {},
  options: [],
  events: [
    { id: 'assassin', name: 'Tocaron al asesino', emoji: '💀', type: 'count', help: 'El equipo tocó la carta del asesino y perdió en el acto.' },
    { id: 'bigClue', name: 'Pista de 4 o más', emoji: '🎯', type: 'count', help: 'Acertaron una pista que juntaba 4 palabras o más.' },
    { id: 'allInOne', name: 'Todo en un turno', emoji: '⚡', type: 'count', help: 'Adivinaron todos sus agentes que quedaban en un solo turno.' },
    { id: 'gaveAway', name: 'Regalaron un agente', emoji: '🎁', type: 'count', help: 'Tocaron una carta del equipo rival.' },
  ],
  stats: [
    { id: 'left', label: 'Agentes que le quedaban al rival', type: 'number', help: 'Cuántas cartas le faltaban al otro equipo cuando terminó.' },
  ],
  awards: [
    {
      id: 'wins', name: 'Agencia de inteligencia', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} misiones cumplidas', unitOne: '1 misión cumplida',
      levels: [
        { at: 3, name: 'Agente encubierto', description: 'Tres misiones cumplidas con anteojos negros y piloto.' },
        { at: 10, name: 'Superagente 86', description: 'Diez victorias: "¿Y si le digo que…?". Zapatófono incluido.' },
        { at: 25, name: 'Jefe de la SIDE', description: 'Veinticinco misiones. Tenés carpeta de todos los de la mesa.' },
      ],
    },
    {
      id: 'bigClue', name: 'Pista maestra', measures: 'Pistas de 4 o más palabras acertadas', metric: { type: 'eventTotal', event: 'bigClue' },
      unit: '{n} pistas maestras', unitOne: '1 pista maestra',
      levels: [
        { at: 1, name: 'Tejedor', description: 'Juntaste cuatro palabras con un solo hilo. Pulóver de la abuela.' },
        { at: 5, name: 'Pulpo Paul', description: 'Cinco pistas gigantes: ocho tentáculos, ocho palabras.' },
        { at: 12, name: 'Telaraña', description: 'Doce pistas maestras. Todo el tablero está enredado en tu tela.' },
      ],
    },
    {
      id: 'sweep', name: 'Barrida', measures: 'Veces que adivinaron todo lo que quedaba en un turno', metric: { type: 'eventTotal', event: 'allInOne' },
      unit: '{n} barridas', unitOne: '1 barrida',
      levels: [
        { at: 1, name: 'Lampazo', description: 'Pasaste el lampazo y te llevaste todo el tablero de una.' },
        { at: 4, name: 'Sopladora de hojas', description: 'Cuatro barridas: soplaste y no quedó ni una hojita de agente.' },
        { at: 10, name: 'Tornado', description: 'Diez turnos perfectos. Pasaste y no quedó nada en pie.' },
      ],
    },
    {
      id: 'assassin', name: 'Kamikaze', measures: 'Veces que tocaron al asesino', metric: { type: 'eventTotal', event: 'assassin' },
      unit: '{n} visitas al asesino', unitOne: '1 visita al asesino',
      levels: [
        { at: 1, name: 'Pisó el palito', description: 'Tocaste al asesino. Te avisaron, eh.' },
        { at: 4, name: 'Imán de balas', description: 'Cuatro veces al asesino: el tablero te llama.' },
        { at: 10, name: 'Dedo nuclear', description: 'Diez veces al asesino: tocás el botón rojo sin leer el cartel.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Dos equipos (rojo y azul); cada uno tiene un jefe de espías que ve el mapa secreto de las 25 palabras.',
    'El jefe da UNA palabra y un número ("Asado, 2"): sus compañeros tocan cartas; pueden tocar hasta número + 1.',
    'Si tocan una carta propia siguen; si es neutral o del rival, se corta el turno.',
    'Si tocan al asesino pierden en el acto.',
    'Gana el primer equipo en encontrar a todos sus agentes (9 el que empieza, 8 el otro).',
  ],
  rulesUrl: 'https://czechgames.com/files/rules/codenames-rules-en.pdf',
  source: 'builtin',
}
