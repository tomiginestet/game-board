import { lv } from '../kit'
import type { GameDef } from '../schema'

export const bowling: GameDef = {
  id: 'bowling',
  name: 'Bowling',
  emoji: '🎳',
  color: '#5F3DC4',
  category: 'deporte',
  tagline: 'Zapatos alquilados, bola de 12 libras y la canaleta como mejor amiga.',
  players: { min: 1, max: 8 },
  sides: 'individual',
  mode: 'result',
  weight: 1,
  scoring: { finalScores: true, pointsName: 'pinos', maxScore: 300 },
  options: [],
  events: [],
  stats: [
    { id: 'strikes', label: 'Strikes', type: 'number', help: 'Los diez pinos de una.' },
    { id: 'spares', label: 'Spares', type: 'number', help: 'Los diez pinos en dos tiros.' },
  ],
  awards: [
    {
      id: 'score', name: 'Línea perfecta', measures: 'Mejor puntaje en una línea', metric: { type: 'scoreMax' },
      unit: '{n} pinos', unitOne: '1 pino',
      levels: [
        lv(100, 'Sin canaleta', 'Pasaste los cien. Sin las barandas de los chicos.'),
        lv(150, 'Zapatos propios', 'Ciento cincuenta: ya no alquilás los zapatos.'),
        lv(200, 'El Gran Lebowski', 'Doscientos pinos. El Dude estaría orgulloso. Una de ruso blanco.'),
      ],
    },
    {
      id: 'strikes', name: 'Chuza', measures: 'Strikes en total', metric: { type: 'statTotal', stat: 'strikes' },
      unit: '{n} strikes', unitOne: '1 strike',
      levels: [
        lv(5, 'Bolo volador', 'Cinco strikes. Un pino salió volando a la pista de al lado.'),
        lv(25, 'Pista de fuego', 'Veinticinco strikes: la bola deja humo.'),
        lv(80, 'Demoledor de pinos', 'Ochenta strikes. El que acomoda los pinos te odia.'),
      ],
    },
  ],
  formats: ['knockout', 'series'],
  rules: [
    'Diez cuadros por línea, hasta dos tiros por cuadro para voltear los diez pinos.',
    'Strike (todos de una) suma 10 más los dos tiros siguientes; spare (en dos) suma 10 más el siguiente.',
    'Cargá el puntaje final de cada uno, como lo dice la pantalla de la pista. Máximo: 300.',
  ],
  source: 'builtin',
}
