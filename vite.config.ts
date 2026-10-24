import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { logoSvg } from './src/lib/logo.ts'
import { brandFor, type SkinBrand } from './src/skins/brands.ts'

// Versión de este build: el commit en Vercel, o la hora si se arma a mano. La app la compara con `version.json`
// para darse cuenta de que hay un deploy nuevo (ver `src/lib/appUpdate.ts`).
const version = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || String(Date.now())

function versionFile(): Plugin {
  return {
    name: 'version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version }) })
    },
  }
}

/**
 * La marca del skin en el `index.html` (`%SKIN_NAME%`, `%SKIN_BG%`...), el manifest de la PWA y los SVG del logo
 * (ícono y animación de la pantalla de inicio), que se arman acá en vez de vivir en `public/` para que cada skin
 * se instale con su nombre, sus colores y su logo.
 */
function skinFiles(brand: SkinBrand): Plugin {
  const manifest = JSON.stringify(
    {
      name: brand.name,
      short_name: brand.shortName,
      description: brand.tagline,
      start_url: './',
      display: 'standalone',
      background_color: brand.background,
      theme_color: brand.background,
      icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    },
    null,
    2,
  )
  const files: Record<string, { type: string; source: string }> = {
    'manifest.webmanifest': { type: 'application/manifest+json', source: manifest },
    'favicon.svg': { type: 'image/svg+xml', source: logoSvg('quieto', { bg: true, title: brand.name, palette: brand.logo }) },
    'logo-secuencia.svg': { type: 'image/svg+xml', source: logoSvg('secuencia', { title: brand.name, palette: brand.logo }) },
  }
  const vars: Record<string, string> = {
    SKIN_ID: brand.id,
    SKIN_NAME: brand.name,
    SKIN_DESCRIPTION: brand.description,
    SKIN_BG: brand.background,
    SKIN_TEXT: brand.text,
    SKIN_FONT: brand.font.family,
    SKIN_FONT_HREF: brand.font.href,
  }
  return {
    name: 'skin-files',
    transformIndexHtml: (html) => html.replace(/%(SKIN_[A-Z_]+)%/g, (all, key: string) => vars[key] ?? all),
    configureServer(server) {
      for (const [name, file] of Object.entries(files)) {
        server.middlewares.use('/' + name, (_req, res) => {
          res.setHeader('Content-Type', file.type)
          res.end(file.source)
        })
      }
    },
    generateBundle() {
      for (const [fileName, file] of Object.entries(files)) this.emitFile({ type: 'asset', fileName, source: file.source })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), versionFile(), skinFiles(brandFor(loadEnv(mode, process.cwd(), 'VITE_').VITE_SKIN))],
  define: { __APP_VERSION__: JSON.stringify(version) },
  // Rutas relativas para poder publicarla en cualquier hosting estático (GitHub Pages, Vercel, Netlify...).
  base: './',
}))
