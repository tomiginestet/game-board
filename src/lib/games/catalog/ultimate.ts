import { lv } from '../kit'
import type { GameDef } from '../schema'

export const ultimate: GameDef = {
  id: 'ultimate',
  name: 'Ultimate frisbee',
  emoji: '🥏',
  color: '#0CA678',
  category: 'deporte',
  tagline: 'Sin árbitro: acá el espíritu de juego se cobra solo.',
  players: { min: 4, max: 20 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 2,
  scoring: { target: 15, targetOption: 'target', quick: [1], quickLabel: 'Punto', pointsName: 'puntos' },
  perPlayer: { scorer: true, unit: 'puntos', unitOne: 'punto', assists: true, mvp: true },
  options: [{ id: 'target', label: 'A cuántos', type: 'number', default: 15, choices: [{ value: 11, label: 'A 11' }, { value: 13, label: 'A 13' }, { value: 15, label: 'A 15' }], min: 5, max: 21 }],
  events: [{ id: 'layout', name: 'Layout', emoji: '🦅', type: 'count', byPlayer: true, help: 'Se tiró en el aire para agarrar o bloquear el disco.' }],
  stats: [],
  awards: [
    {
      id: 'recepciones', name: 'Receptor', measures: 'Puntos recibidos en la zona de gol', metric: { type: 'scored' },
      unit: '{n} puntos', unitOne: '1 punto',
      levels: [
        lv(5, 'Manos de velcro', 'Cinco puntos agarrados en la zona.', 'heart', '#63E6BE'),
        lv(25, 'Imán de discos', 'Veinticinco puntos: el disco te busca solo.', 'gem', '#20C997'),
        lv(80, 'Platillo volador', 'Ochenta puntos. Te confunden con un OVNI.', 'rocket', '#087F5B'),
      ],
    },
    {
      id: 'pases', name: 'Lanzador', measures: 'Pases de gol (asistencias)', metric: { type: 'assists' },
      unit: '{n} pases de gol', unitOne: '1 pase de gol',
      levels: [
        lv(5, 'Revés de playa', 'Cinco pases de gol. El revés te sale derechito.', 'eye', '#96F2D7'),
        lv(25, 'Martillo', 'Veinticinco asistencias: tirás por arriba de todos.', 'bolt', '#38D9A9'),
        lv(80, 'Mariscal del disco', 'Ochenta asistencias. Ves la cancha desde un dron.', 'crown', '#0CA678'),
      ],
    },
  ],
  formats: ['knockout', 'league'],
  rules: [
    'Dos equipos y un disco. Se avanza pasándolo: con el disco en la mano no se puede caminar.',
    'Se hace punto al recibir un pase dentro de la zona de gol rival. Anotamos quién recibió y quién tiró.',
    'Sin árbitro: las faltas se cantan y se resuelven entre los jugadores. Gana el primero a 15.',
  ],
  rulesUrl: 'https://rules.wfdf.sport/',
  source: 'builtin',
}
