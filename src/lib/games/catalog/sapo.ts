import { lv } from '../kit'
import type { GameDef } from '../schema'

export const sapo: GameDef = {
  id: 'sapo',
  name: 'Juego del sapo',
  emoji: '🐸',
  color: '#2F9E44',
  category: 'deporte',
  tagline: 'Meterle una ficha en la boca al sapo de bronce. Deporte nacional de quinta.',
  players: { min: 2, max: 8 },
  sides: 'individual',
  mode: 'rounds',
  weight: 1,
  scoring: { target: 1500, targetOption: 'target', scorer: 'sum', pointsName: 'puntos' },
  options: [{ id: 'target', label: 'A cuántos puntos', type: 'number', default: 1500, choices: [{ value: 1000, label: 'A 1000' }, { value: 1500, label: 'A 1500' }, { value: 3000, label: 'A 3000' }], min: 100, max: 10000 }],
  events: [{ id: 'boca', name: 'En la boca', emoji: '👄', type: 'count', help: 'Ficha adentro de la boca del sapo.' }],
  stats: [],
  awards: [
    {
      id: 'boca', name: 'Beso de sapo', measures: 'Fichas en la boca del sapo', metric: { type: 'eventTotal', event: 'boca' },
      unit: '{n} fichas en la boca', unitOne: '1 ficha en la boca',
      levels: [
        lv(1, 'Renacuajo', 'Tu primera ficha en la boca. El sapo hizo "croac".', 'clover', '#B2F2BB'),
        lv(10, 'Príncipe encantado', 'Diez fichas en la boca: el sapo ya te quiere besar.', 'heart', '#69DB7C'),
        lv(40, 'Rey de la laguna', 'Cuarenta fichas en la boca. Los sapos te hacen reverencia.', 'crown', '#2B8A3E'),
      ],
    },
    {
      id: 'wins', name: 'Patio de quinta', measures: 'Partidas de sapo ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        lv(5, 'Mesa de quinta', 'Cinco ganadas, entre el asado y el postre.', 'house', '#8CE99A'),
        lv(20, 'Ficha de bronce', 'Veinte victorias. Tus fichas brillan de tanto uso.', 'coin', '#40C057'),
        lv(50, 'Sapo de oro', 'Cincuenta ganadas. Te regalan el sapo cuando se muden.', 'trophy', '#2F9E44'),
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Desde unos metros se tiran fichas de bronce a la mesa del sapo: cada agujero tiene su puntaje.',
    'La boca del sapo es lo que más vale. Cada ronda se carga lo que sumó cada uno.',
    'Gana el primero que llega al total acordado.',
  ],
  source: 'builtin',
}
