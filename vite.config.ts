import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionFile()],
  define: { __APP_VERSION__: JSON.stringify(version) },
  // Rutas relativas para poder publicarla en cualquier hosting estático (GitHub Pages, Vercel, Netlify...).
  base: './',
})
