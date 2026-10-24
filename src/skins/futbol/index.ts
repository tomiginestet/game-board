// Fulbito: el skin de fútbol. Referencias: EA Sports FC y las transmisiones de TV (marcador tipo zócalo,
// letra condensada, verde lima sobre negro). Ver docs/motor.md.

import type { Skin } from '../types'
import { brand } from './brand'
import './theme.css'

const FUTBOL = ['futbol5', 'futbol', 'futsal', 'futboltenis', 'penales', 'travesano', 'metegol', 'eafc']

export const futbol: Skin = {
  ...brand,
  catalog: {
    include: (g) => FUTBOL.includes(g.id),
    featured: FUTBOL,
    hero: ['futbol5', 'futbol', 'futsal', 'penales', 'eafc'],
  },
  modules: { tournaments: true, ranking: true },
  words: { games: 'Modalidades', play: 'Partido', tournaments: 'Torneos', ranking: 'Tabla', players: 'Jugadores' },
  home: { greeting: '¿Quién juega hoy?', recent: 'Últimos partidos' },
}
