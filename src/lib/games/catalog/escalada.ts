import { lv } from '../kit'
import type { GameDef } from '../schema'

export const escalada: GameDef = {
  id: 'escalada',
  name: 'Escalada (boulder)',
  emoji: '🧗',
  color: '#AE3EC9',
  category: 'deporte',
  tagline: 'Magnesio en las manos, la cara contra la pared y el "¡dale que llegás!".',
  players: { min: 2, max: 12 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, pointsName: 'bloques' },
  options: [],
  events: [],
  stats: [{ id: 'flash', label: 'Bloques al primer intento', type: 'number', help: 'Encadenados de una (flash).' }],
  awards: [
    {
      id: 'max', name: 'Encadenador', measures: 'Más bloques encadenados en una sesión', metric: { type: 'scoreMax' },
      unit: '{n} bloques', unitOne: '1 bloque',
      levels: [
        lv(5, 'Manos de magnesio', 'Cinco bloques en una sesión. Dejaste huellas blancas por todos lados.'),
        lv(10, 'Lagartija', 'Diez bloques: te pegás a la pared como lagartija.'),
        lv(20, 'Hombre araña del muro', 'Veinte bloques en una sesión. Peter Parker te pide la técnica.'),
      ],
    },
    {
      id: 'flash', name: 'Flash', measures: 'Bloques al primer intento', metric: { type: 'statTotal', stat: 'flash' },
      unit: '{n} flashes', unitOne: '1 flash',
      levels: [
        lv(5, 'A la primera', 'Cinco bloques de una. Ni lo pensaste.'),
        lv(25, 'Lectura de vía', 'Veinticinco flashes: leés la pared como un libro.'),
        lv(80, 'Cabra de montaña', 'Ochenta flashes. Escalás como en el Fitz Roy, pero indoor.'),
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Sesión de boulder: cada uno intenta los bloques que pueda en el tiempo acordado.',
    'Al terminar se carga cuántos bloques encadenó cada uno (y cuántos al primer intento).',
    'Gana el que más bloques encadenó.',
  ],
  source: 'builtin',
}
