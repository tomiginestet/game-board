// Graba la animación promocional (promo/) como video vertical 1080×1920.
// Uso: node scripts/render-promo.mjs [salida.mp4] [fps]
// Levanta Vite, dibuja cada cuadro con Playwright (la animación es una función del tiempo) y lo pasa a ffmpeg.
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { createServer } from 'vite'

const [out = 'promo/game-board-promo.mp4', fpsArg = '30'] = process.argv.slice(2)
const fps = Number(fpsArg)
const root = resolve(import.meta.dirname, '..')

const require = createRequire(import.meta.url)
const { chromium } = await import('playwright').catch(() => require('/opt/node22/lib/node_modules/playwright'))

const server = await createServer({ root, logLevel: 'error', server: { port: 5199 } })
await server.listen()
const url = server.resolvedUrls.local[0] + 'promo/index.html?render'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.error('Error en la página:', e.message))
await page.goto(url)
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60_000 })
const duration = await page.evaluate(() => window.__duration)
const frames = Math.round(duration * fps)

const ffmpeg = spawn(
  'ffmpeg',
  ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', resolve(root, out)],
  { stdio: ['pipe', 'inherit', 'inherit'] },
)
const done = new Promise((ok, fail) => ffmpeg.on('close', (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg terminó con ${code}`)))))

const started = Date.now()
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__seek(t), i / fps)
  const png = await page.screenshot({ type: 'png' })
  if (!ffmpeg.stdin.write(png)) await new Promise((ok) => ffmpeg.stdin.once('drain', ok))
  if (i % fps === 0) process.stdout.write(`\r${i}/${frames} cuadros (${Math.round((Date.now() - started) / 1000)} s)`)
}
ffmpeg.stdin.end()
await done
await browser.close()
await server.close()
console.log(`\n${frames} cuadros, ${duration} s a ${fps} fps → ${out}`)
