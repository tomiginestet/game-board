import type { GameDef } from '../schema'

export const loveletter: GameDef = {
  id: 'loveletter',
  name: 'Love Letter',
  emoji: '💌',
  color: '#C2185B',
  category: 'cartas',
  tagline: 'Dieciséis cartas, una princesa y cero chances de que te conteste el mensaje.',
  players: { min: 2, max: 6 },
  sides: 'individual',
  mode: 'counter',
  weight: 1,
  scoring: { target: 4, targetOption: 'target', quick: [1], quickLabel: 'Ganó la ronda', pointsName: 'fichas de afecto' },
  options: [
    {
      id: 'target', label: 'Fichas para ganar', type: 'number', default: 4,
      choices: [{ value: 6, label: '6 (2 jugadores)' }, { value: 5, label: '5 (3 jugadores)' }, { value: 4, label: '4 (4 jugadores)' }, { value: 3, label: '3 (5 o 6 jugadores)' }],
      min: 1, max: 10, help: 'Edición 2019: 6, 5, 4 o 3 según cuántos juegan (la clásica de 2 era a 7).',
    },
  ],
  events: [
    { id: 'guardiaAcierto', name: 'Adivinó con la Guardia', emoji: '💂', type: 'count', help: 'Nombró la carta del rival con la Guardia y lo sacó de la ronda.' },
    { id: 'princesaGano', name: 'Ganó con la Princesa', emoji: '👸', type: 'count', help: 'Llegó al final de la ronda con la Princesa en la mano.' },
    { id: 'princesaDescartada', name: 'Descartó a la Princesa', emoji: '💔', type: 'count', help: 'Tuvo que tirar la Princesa (o se la hicieron tirar) y quedó afuera.' },
  ],
  stats: [],
  awards: [
    {
      id: 'wins', name: 'Enamorado', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} partidas', unitOne: '1 partida',
      levels: [
        { at: 3, name: 'Carta perfumada', description: 'Tres partidas ganadas. Tu carta llegó oliendo a colonia de abuelo.' },
        { at: 12, name: 'Serenata al balcón', description: 'Doce victorias: guitarra, luna y la princesa asomándose.' },
        { at: 35, name: 'Casamiento real', description: 'Treinta y cinco partidas ganadas. Fiesta con carroza y vals.' },
      ],
    },
    {
      id: 'guardia', name: 'Ojo de guardia', measures: 'Aciertos con la Guardia en total', metric: { type: 'eventTotal', event: 'guardiaAcierto' },
      unit: '{n} aciertos', unitOne: '1 acierto',
      levels: [
        { at: 5, name: 'Vigilante de esquina', description: 'Cinco aciertos con la Guardia. Silbato y gorra, nadie se te escapa.' },
        { at: 20, name: 'Sereno con linterna', description: 'Veinte aciertos: de noche alumbrás todas las manos ajenas.' },
        { at: 60, name: 'Sherlock de barrio', description: 'Sesenta aciertos. Deducís la carta por cómo el otro toma el mate.' },
      ],
    },
    {
      id: 'desamor', name: 'Corazón roto', measures: 'Veces que perdió a la Princesa', metric: { type: 'eventTotal', event: 'princesaDescartada' },
      unit: '{n} princesas perdidas', unitOne: '1 princesa perdida',
      levels: [
        { at: 1, name: 'Mensaje en visto', description: 'Perdiste a la Princesa. Te dejó en visto, como era de esperar.' },
        { at: 5, name: 'Bolero en la rocola', description: 'Cinco princesas perdidas: llorás con un bolero en el bar.' },
        { at: 15, name: 'Plantado en el altar', description: 'Quince desamores. Ya tenés el traje alquilado de por vida.' },
      ],
    },
  ],
  formats: ['tables', 'series'],
  rules: [
    'Cada uno tiene una carta; en tu turno robás otra y jugás una de las dos, aplicando su efecto.',
    'Guardia: nombrás una carta y si el otro la tiene, queda afuera. Barón compara manos; Príncipe hace descartar; Rey intercambia; Condesa y Princesa tienen reglas especiales.',
    'Si descartás a la Princesa, quedás afuera de la ronda.',
    'Gana la ronda el último en pie o quien tenga la carta más alta cuando se acaba el mazo; se lleva una ficha de afecto.',
    'Gana la partida quien junta las fichas necesarias según la cantidad de jugadores.',
  ],
  rulesUrl: 'https://en.wikipedia.org/wiki/Love_Letter_(card_game)',
  source: 'builtin',
}
