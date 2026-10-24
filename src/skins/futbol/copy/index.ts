// Las frases de Game Board dichas en fútbol: partido (no partida), modalidad (no juego), tabla (no ranking).
// La clave es la frase de Game Board tal como está en `say(...)`; el test de skins avisa si alguna deja de existir.
// Un archivo por área de la app.

import { club } from './club'
import { inicio } from './inicio'
import { juegos } from './juegos'
import { jugadores } from './jugadores'
import { partidos } from './partidos'

export const copy: Record<string, string> = { ...inicio, ...juegos, ...jugadores, ...partidos, ...club }
