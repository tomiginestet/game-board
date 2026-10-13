// Frases de sabor para el resumen de una partida: una por partida, elegida a partir de su id
// para que no cambie al volver a mirarla. Sirven para cualquier juego, no nombran a nadie,
// no se burlan de quien perdió y evitan palabras con género.

export type Outcome = 'win' | 'lowWin' | 'draw' | 'coopWin' | 'coopLoss'

const CHEERS: Record<Outcome, string[]> = {
  win: [
    'Barrilete cósmico.',
    'La copa y el termo, para casa.',
    'Vuelta olímpica alrededor de la mesa.',
    'Que alguien le avise al diario del barrio.',
    'Esto se festeja con facturas.',
    'Dale campeón, dale campeón.',
    'Golazo de media cancha.',
    'Ni el VAR lo discute.',
    'Para enmarcar y colgar en el living.',
    'Que suene el bombo.',
    'Gloria eterna. O hasta la próxima, que es casi lo mismo.',
    'Partida redonda, de punta a punta.',
    'Con el mate en la mano y la sonrisa de oreja a oreja.',
    'Esto va directo al grupo de WhatsApp.',
    'Hoy los platos los lava otra persona.',
    'Pasen a saludar por la cabecera.',
  ],
  lowWin: [
    'Menos es más, y quedó demostrado.',
    'El marcador más flaco se lleva la copa.',
    'Puntaje a dieta, copa en la mano.',
    'Ni un punto de más: precisión de relojero.',
    'Ahorro de puntos nivel experto.',
    'Contar poco nunca fue tan glorioso.',
    'Austeridad de campeonato.',
    'La planilla, impecable de tan vacía.',
    'Puntos contados con cuentagotas.',
    'Cero ostentación, toda la gloria.',
    'Cada punto rindió como el último billete del mes.',
    'La planilla casi en blanco y la copa llena.',
  ],
  draw: [
    'Empate técnico: nadie paga el asado.',
    'Tablas, como en el ajedrez de la plaza.',
    'La gloria se reparte en partes iguales.',
    'Cada cual con su porción de torta.',
    'Mano a mano y sin vuelto.',
    'Nadie se va con las manos vacías.',
    'Ni el VAR se anima a desempatar.',
    'Iguales, como dos gotas de mate.',
    'El termo queda en el medio de la mesa.',
    'Abrazo y cambio de camisetas.',
    'Esto se define por penales: ¿revancha?',
    'Empatar también es un arte.',
    'Los platos se lavan entre todos.',
    'Paridad total. El desempate queda pendiente.',
  ],
  coopWin: [
    'Mano sobre mano y adentro.',
    'Equipo que gana no se toca.',
    'Uno para todos y todos para el festejo.',
    'Trabajo en equipo de manual.',
    'Esta la ganó la mesa entera.',
    'Abrazo grupal, que nadie quede afuera.',
    'Ni el reglamento pudo con ustedes.',
    'Coordinación de murga en carnaval.',
    'Foto grupal para la posteridad.',
    'El juego pidió el cambio.',
    'Rescate completo: todo el mundo a salvo.',
    'Salió como en la charla técnica.',
    'Se festeja en ronda.',
    'La banca quebró.',
  ],
  coopLoss: [
    'Hoy ganó la banca.',
    'Se perdió una batalla, no la guerra.',
    'Perder en equipo duele la mitad.',
    'El juego tuvo su noche.',
    'Mate de consuelo para la mesa entera.',
    'Nadie tuvo la culpa. Bueno, quizás los dados.',
    'Hasta los mejores equipos tienen un mal día.',
    'El reglamento se puso duro.',
    'Revancha ya, que el juego no se agrande.',
    'Abrazo grupal igual.',
    'Unidos en la derrota, unidos en la revancha.',
    'La próxima, el juego no la ve venir.',
    'Se aprende más perdiendo. Eso dicen.',
  ],
}

/** Número estable a partir de un texto (FNV-1a): la misma partida da siempre la misma frase. */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** La frase de festejo (o de consuelo) para una partida. */
export function cheerFor(outcome: Outcome, seed: string): string {
  const list = CHEERS[outcome]
  return list[hash(seed) % list.length]
}

/** Todas las frases de un tipo (para pruebas y para revisar el tono). */
export function cheersOf(outcome: Outcome): readonly string[] {
  return CHEERS[outcome]
}
