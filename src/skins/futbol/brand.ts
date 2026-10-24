import type { SkinBrand } from '../brands.ts'

export const brand: SkinBrand = {
  id: 'futbol',
  name: 'Fulbito',
  shortName: 'Fulbito',
  tagline: 'Partidos, torneos y la tabla del grupo.',
  description: 'El fútbol de tu grupo: partidos, convocatorias, goleadores, torneos y medallas. Del fútbol 5 de los jueves a la liga del barrio.',
  background: '#06100b',
  text: '#f1f7f2',
  font: { family: 'Anton', href: 'https://fonts.googleapis.com/css2?family=Anton&display=swap' },
  // Los cuatro cuadraditos en clave de cancha: el lima de la marca, el pasto, la cal y el arco del rival.
  logo: { a: '#c6ff3d', b: '#2bb673', c: '#f1f7f2', d: '#1f8a5b', ink: '#06100b', tile: '#123021', dim: '#1d3a2a' },
}
