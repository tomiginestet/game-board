import { IconContext } from '@phosphor-icons/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './game-board.css'
import './catalog.css'
import './social.css'
import App from './App.tsx'
import { loadArt } from './lib/art'
import { startAuth } from './lib/auth'
import { startSync } from './lib/sync'
import { hashRedirect } from './lib/clubLink'

// El link corto de un QR puede llegar sin `#` (`/c/lasartes` o `?c=lasartes`): se pasa a la ruta de la app.
const redirect = hashRedirect(window.location)
if (redirect) history.replaceState(null, '', redirect)

startSync()
startAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Íconos por defecto: del tamaño del texto que acompañan y con trazo marcado. */}
    <IconContext.Provider value={{ size: '1.2em', weight: 'bold' }}>
      <App />
    </IconContext.Provider>
  </StrictMode>,
)

// Deja ver al menos la primera ronda del logo y después desvanece la pantalla de inicio.
const splash = document.getElementById('splash')
if (splash) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const wait = reduce ? 0 : Math.max(0, 1300 - performance.now())
  setTimeout(() => {
    splash.classList.add('out')
    setTimeout(() => splash.remove(), 300)
  }, wait)
}

// Las ilustraciones de las medallas van en un archivo aparte: se traen cuando la app ya arrancó.
setTimeout(() => void loadArt(), 2500)
