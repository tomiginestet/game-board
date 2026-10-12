// Copia a la función de Supabase `generate-game` el armado del pedido (src/lib/aiPrompt.ts),
// para que el servidor use el mismo pedido que el modo "copiar y pegar".
// El esquema y el ejemplo van resumidos a mano en supabase/functions/generate-game/sources.ts
// (más barato por llamada): si cambia el esquema de las fichas, actualizarlo ahí también.
// Correr después de cambiar src/lib/aiPrompt.ts: npm run build:ai
import { copyFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
copyFileSync(join(root, 'src/lib/aiPrompt.ts'), join(root, 'supabase/functions/generate-game/aiPrompt.ts'))
console.log('generate-game: listo')
