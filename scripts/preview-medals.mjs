// Genera una hoja de contactos con medallas para revisarlas a ojo.
// Uso: node scripts/preview-medals.mjs salida.png [archivo-de-arte...]
//   Sin archivos: todas las ilustraciones. Con archivos (p. ej. general catan): sólo las de esos módulos de src/lib/art/.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const [out = 'medals.png', ...args] = process.argv.slice(2)
const dir = mkdtempSync(join(tmpdir(), 'medals-'))
const entry = join(dir, 'entry.ts')
const root = resolve(import.meta.dirname, '..')
// Sin módulos: todos los de src/lib/art (salvo los que no son ilustraciones).
const mods = args.length
  ? args
  : readdirSync(join(root, 'src/lib/art'))
      .filter((f) => f.endsWith('.ts') && !['index.ts', 'helpers.ts', 'glyphs.ts', 'kit.ts'].includes(f))
      .map((f) => f.replace(/\.ts$/, ''))
// El registro real usa import.meta.glob (de Vite); acá se completa a mano con los módulos pedidos.
const imports =
  mods.map((m, i) => `import * as m${i} from '${root}/src/lib/art/${m}'`).join('\n') +
  `\nimport { ART_REGISTRY } from '${root}/src/lib/art'` +
  `\nconst maps = [${mods.map((_, i) => `...Object.values(m${i}).filter((v) => v && typeof v === 'object')`).join(',')}]` +
  `\nfor (const m of maps) Object.assign(ART_REGISTRY, m)` +
  `\nexport const names = maps.flatMap((m) => Object.keys(m))`
writeFileSync(entry, `${imports}\nexport { medalSvg } from '${root}/src/lib/medalArt'\n`)
const bundle = join(dir, 'bundle.mjs')
execFileSync(join(root, 'node_modules/.bin/rolldown'), [entry, '--file', bundle, '--format', 'esm'], { stdio: 'inherit' })
writeFileSync(bundle, readFileSync(bundle, 'utf8').replaceAll('import.meta.glob(', '(() => ({}))('))
const { names, medalSvg } = await import(bundle)
const css = readFileSync(join(root, 'src/index.css'), 'utf8').match(/\.m-ol[^}]*\}/g)?.join('\n') ?? ''
const cells = names
  .map((n, i) => `<figure>${medalSvg(n, i % 6)}<figcaption>${n}</figcaption></figure>`)
  .join('')
const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"><style>
body{margin:0;padding:12px;background:#161b22;font:12px sans-serif;color:#e6edf3;display:grid;grid-template-columns:repeat(6,150px);gap:10px}
figure{margin:0;text-align:center}svg{width:140px;height:auto}${css}</style>${cells}`
writeFileSync(join(dir, 'p.html'), html)
const require = createRequire(import.meta.url)
const { chromium } = require('/opt/node22/lib/node_modules/playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 980, height: 400 } })
await page.goto('file://' + join(dir, 'p.html'))
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(`${names.length} medallas → ${out}`)
