import { lv } from '../kit'
import type { GameDef } from '../schema'

export const ciclismo: GameDef = {
  id: 'ciclismo',
  name: 'Ciclismo',
  emoji: '🚴',
  color: '#E67700',
  category: 'deporte',
  tagline: 'Calzas, café en la parada y una subida que nadie te avisó.',
  players: { min: 2, max: 30 },
  sides: 'individual',
  mode: 'result',
  weight: 2,
  scoring: { finalScores: true, time: true, lowWins: true, pointsName: 'tiempo' },
  options: [{ id: 'kind', label: 'Tipo', type: 'select', default: 'ruta', choices: [{ value: 'ruta', label: 'Ruta' }, { value: 'mtb', label: 'Montaña' }, { value: 'crono', label: 'Contrarreloj' }] }],
  events: [],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Maillot amarillo', measures: 'Carreras de ciclismo ganadas', metric: { type: 'wins' },
      unit: '{n} carreras', unitOne: '1 carrera',
      levels: [
        lv(3, 'Rueditas sacadas', 'Tres carreras ganadas. Ya no hacen falta las rueditas.'),
        lv(10, 'Rey de la montaña', 'Diez victorias: las subidas te dan risa.'),
        lv(30, 'Gran vuelta del barrio', 'Treinta ganadas. Te esperan con banderitas en cada esquina.'),
      ],
    },
  ],
  formats: ['series'],
  rules: [
    'Se larga junto (o de a uno en contrarreloj). Se carga el tiempo de cada uno al llegar.',
    'Gana el más rápido; en partida acumulada se suman los tiempos de las etapas.',
  ],
  source: 'builtin',
}
