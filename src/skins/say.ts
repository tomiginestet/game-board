// Textos de la interfaz que cambian según el skin. Se escribe la frase de Game Board tal cual
// (`say('Últimas partidas')`) y el skin puede tener la suya ("Últimos partidos") en `skin.copy`.
// Frases enteras y no palabras sueltas: así cada skin las arma con su género y su tono.
// Las partes que cambian van entre llaves: `say('Descartaste la partida de {juego}.', { juego })`.

import { skin } from '.'

export function say(text: string, vars?: Record<string, string | number>): string {
  const t = skin.copy?.[text] ?? text
  return vars ? t.replace(/\{(\w+)\}/g, (all, key: string) => (key in vars ? String(vars[key]) : all)) : t
}
