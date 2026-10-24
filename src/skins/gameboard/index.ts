// Game Board: el skin original, para juegos de mesa, cartas, videojuegos y deportes con amigos.
// Los colores están en `src/index.css` (es el tema base); otro skin los pisa con su propio CSS.

import type { Skin } from '../types'
import { brand } from './brand'

export const gameboard: Skin = {
  ...brand,
  catalog: {
    featured: ['truco', 'catan', 'pingpong', 'skullking', 'buraco', 'impostor', 'codigosecreto', 'pistascruzadas', 'generala', 'sushigo', 'tateti'],
    hero: ['truco', 'catan', 'pingpong', 'skullking', 'impostor', 'pistascruzadas'],
  },
  modules: { tournaments: true, ranking: true },
  words: { games: 'Juegos', play: 'Partida', tournaments: 'Torneos', ranking: 'Ranking', players: 'Jugadores' },
}
