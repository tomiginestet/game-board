// Pedido para que una IA arme la ficha de un juego. Se usa igual en el modo
// "copiar y pegar" (gratis, en cualquier chat) y en la generación automática por API.
// Sin dependencias: lo importa también la función de Supabase `generate-game`.

export interface PromptInput {
  /** Nombre del juego. */
  name: string
  /** Reglas pegadas (opcional): mientras más completas, mejor la ficha. */
  rules?: string
  /** Aclaraciones del grupo ("lo jugamos sin flor", "a 5000 puntos"). */
  notes?: string
}

export const MAX_RULES_CHARS = 60_000

export function systemPrompt(schemaSource: string, exampleSource: string): string {
  return `Sos el asistente de "Game Board", una app donde grupos de amigos argentinos anotan partidas, torneos, rankings y medallas de cualquier juego.

Tu tarea: armar la FICHA de un juego (un objeto JSON del tipo GameDef) para que la app pueda llevar sus partidas, torneos y premios.

Reglas para la ficha:
- Respondé SOLAMENTE con el objeto JSON (sin texto antes ni después, sin comentarios). Puede ir dentro de un bloque \`\`\`json.
- Respetá exactamente el tipo GameDef del esquema de abajo: sólo esos campos y esos valores posibles.
- Elegí el \`mode\` que mejor se adapte a cómo se juega y se anota:
  · counter: se suman puntos en vivo tocando botones (truco, ta-te-ti al mejor de N).
  · rounds: al terminar cada mano se carga el puntaje de cada uno (buraco, generala, chinchón).
  · turns: hay turnos y conviene registrar eventos durante la partida, pero el puntaje real se confirma al final (Catán).
  · result: sólo importa quién ganó o el orden de llegada, con puntaje final opcional.
  · coop: todos juntos contra el juego; se gana o se pierde en equipo.
  · sets: deportes de raqueta o red, punto a punto y por sets, de a dos lados (tenis y pádel con \`scoring.sets.kind\` "tennis"; vóley o fútbol tenis con "points").
- Deportes de equipo (fútbol, básquet, hockey): \`perPlayer\` para anotar quién hizo cada gol, las asistencias y la figura; los eventos de un jugador (tarjetas, atajadas) llevan \`byPlayer\`.
- Carreras y marcas por tiempo: mode result con \`scoring.finalScores\`, \`scoring.time\` y \`scoring.lowWins\`.
- \`events\`: los momentos importantes y registrables del juego (3 a 8). Usá \`points\` si suman al marcador en ese modo.
- \`stats\`: datos que se preguntan al final de la partida, sólo si sirven para algún premio.
- \`awards\`: de 2 a 4 familias de medallas propias del juego, cada una con 3 niveles (bronce, plata, oro) con \`at\` creciente.
  Cada \`metric\` tiene que usar eventos, datos o roles que existan en la misma ficha.
  Los nombres de los niveles son cortos (1 a 3 palabras), graciosos, con humor y referencias argentinas, y evocan una imagen concreta.
  Las descripciones son de una oración, con gracia, en voseo ("ganaste", "tenés").
  Elegí para cada nivel un \`glyph\` (dibujo genérico) y un \`color\` (hex) que combinen con el chiste.
- \`formats\`: sólo los formatos de torneo que tengan sentido (knockout y league necesitan partidas de exactamente 2 lados; tables para juegos de 3 a 6; series para juegos que se suman en varias partidas).
- \`rules\`: 4 a 6 renglones cortos que resuman las reglas reales. \`tagline\`: una frase graciosa.
- \`id\`: en minúsculas y sin espacios. \`source\`: "ai".
- Si no conocés bien el juego y no te pasaron las reglas, hacé la mejor ficha posible con lo que sabés y mantenela simple.
- Todo el texto en español rioplatense.

=== ESQUEMA (TypeScript) ===
${schemaSource}

=== EJEMPLO (ficha del Catán) ===
${exampleSource}`
}

export function userPrompt(input: PromptInput): string {
  const parts = [`Armá la ficha del juego: ${input.name.trim()}`]
  if (input.notes?.trim()) parts.push(`Cómo lo juega el grupo: ${input.notes.trim()}`)
  if (input.rules?.trim()) parts.push(`Reglas:\n${input.rules.trim().slice(0, MAX_RULES_CHARS)}`)
  return parts.join('\n\n')
}

/** Todo junto, para pegar en un chat. */
export function fullPrompt(schemaSource: string, exampleSource: string, input: PromptInput): string {
  return `${systemPrompt(schemaSource, exampleSource)}\n\n=== PEDIDO ===\n${userPrompt(input)}`
}
