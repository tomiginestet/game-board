import { LOGO_PALETTE } from '../../lib/logo.ts'
import type { SkinBrand } from '../brands.ts'

export const brand: SkinBrand = {
  id: 'gameboard',
  name: 'Game Board',
  shortName: 'Game Board',
  tagline: 'Partidas, torneos y quién manda en cada juego.',
  description: 'Partidas, torneos y quién manda en cada juego. Rankings y medallas de cualquier juego con tu club.',
  background: '#0d1117',
  text: '#f0f3f8',
  font: { family: 'Lilita One', href: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap' },
  logo: LOGO_PALETTE,
}
