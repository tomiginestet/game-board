import type { GameDef } from '../schema'

export const wavelength: GameDef = {
  id: 'wavelength',
  name: 'Wavelength (Onda)',
  emoji: '📡',
  color: '#E64980',
  category: 'fiesta',
  tagline: '¿El dulce de leche es "sobrevalorado" o "subestimado"? Se pudrió todo.',
  players: { min: 2, max: 12 },
  sides: 'teams',
  teamSize: 2,
  mode: 'counter',
  weight: 1,
  scoring: { target: 10, targetOption: 'target', pointsName: 'puntos' },
  options: [
    { id: 'target', label: 'Puntos para ganar', type: 'number', default: 10, min: 5, max: 20 },
  ],
  events: [
    { id: 'bullseye', name: 'Al centro (4)', emoji: '🎯', type: 'count', points: 4, help: 'Cayeron justo en el centro del blanco.' },
    { id: 'close', name: 'Cerquita (3)', emoji: '🟠', type: 'count', points: 3 },
    { id: 'edge', name: 'En el borde (2)', emoji: '🟡', type: 'count', points: 2 },
    { id: 'leftRight', name: 'Acertó izquierda/derecha', emoji: '↔️', type: 'count', points: 1, help: 'El equipo rival adivinó para qué lado quedaba el blanco (+1 para ellos).' },
  ],
  stats: [],
  awards: [
    {
      id: 'bullseye', name: 'Tiro al blanco', measures: 'Veces que dieron justo en el centro', metric: { type: 'eventTotal', event: 'bullseye' },
      unit: '{n} al centro', unitOne: '1 al centro',
      levels: [
        { at: 3, name: 'Dardo en la diana', description: 'Tres veces al centro. Como en el bar del barrio.' },
        { at: 10, name: 'Guillermo Tell', description: 'Diez blancos perfectos: la manzana partida al medio.' },
        { at: 25, name: 'Antena parabólica', description: 'Veinticinco al centro. Captan todas las señales del satélite.' },
      ],
    },
    {
      id: 'wins', name: 'En la misma onda', measures: 'Partidas ganadas', metric: { type: 'wins' },
      unit: '{n} victorias', unitOne: '1 victoria',
      levels: [
        { at: 3, name: 'Walkie-talkie', description: 'Tres victorias. Cambio y fuera.' },
        { at: 10, name: 'Radio AM', description: 'Diez victorias: se escuchan clarito hasta en Tandil.' },
        { at: 25, name: 'Torre de transmisión', description: 'Veinticinco victorias. Emiten para todo el país.' },
      ],
    },
  ],
  formats: ['knockout', 'league', 'series'],
  rules: [
    'Dos equipos. El psíquico de turno ve dónde está el blanco escondido en una ruleta entre dos extremos (p. ej. "frío ↔ caliente").',
    'Da una pista que, según él, cae en ese punto del espectro ("el mate recién cebado").',
    'Su equipo discute y gira el dial; el rival apuesta si el blanco quedó más a la izquierda o a la derecha.',
    'Según qué tan cerca quedó: 4, 3 o 2 puntos. Si el rival acertó el lado, se lleva 1.',
    'Gana el primer equipo que llega a 10 puntos.',
  ],
  rulesUrl: 'https://boardgamegeek.com/boardgame/262543/wavelength',
  source: 'builtin',
}
