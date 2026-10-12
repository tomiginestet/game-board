// Regenera los SVG del logo que viven en public/ a partir de src/lib/logo.ts.
// Uso: npm run logo
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logoSvg } from '../src/lib/logo.ts'

const pub = resolve(import.meta.dirname, '../public')
for (const [file, svg] of Object.entries({
  'favicon.svg': logoSvg('quieto', { bg: true, title: 'Game Board' }),
  'logo-secuencia.svg': logoSvg('secuencia', { title: 'Game Board' }),
})) {
  writeFileSync(resolve(pub, file), svg)
  console.log('public/' + file)
}
