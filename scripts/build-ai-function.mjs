// Copia a la función de Supabase `generate-game` el armado del pedido y el esquema de las fichas,
// para que el servidor use exactamente el mismo pedido que el modo "copiar y pegar".
// Correr después de cambiar src/lib/aiPrompt.ts, el esquema o la ficha de ejemplo: npm run build:ai
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dir = join(root, 'supabase/functions/generate-game')
copyFileSync(join(root, 'src/lib/aiPrompt.ts'), join(dir, 'aiPrompt.ts'))
const schema = readFileSync(join(root, 'src/lib/games/schema.ts'), 'utf8')
const example = readFileSync(join(root, 'src/lib/games/catalog/catan.ts'), 'utf8')
writeFileSync(
  join(dir, 'sources.ts'),
  `// Generado por scripts/build-ai-function.mjs: no editar a mano.\nexport const SCHEMA = ${JSON.stringify(schema)}\nexport const EXAMPLE = ${JSON.stringify(example)}\n`,
)
console.log('generate-game: listo')
