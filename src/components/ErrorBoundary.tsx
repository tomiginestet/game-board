import { Component, type ReactNode } from 'react'
import { isStaleChunkError, reloadForStaleCode } from '../lib/appUpdate'

/** Si una pantalla se rompe, muestra un aviso en vez de dejar todo en blanco. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Una pantalla que no se pudo bajar es casi siempre un deploy nuevo: se recarga sola para traerlo.
    if (isStaleChunkError(error)) reloadForStaleCode()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    // Volver al inicio no alcanza: la pantalla que falló queda marcada como rota hasta recargar la página.
    if (isStaleChunkError(error)) {
      return (
        <div className="page">
          <h1>Hay una versión nueva 🎉</h1>
          <p className="muted">Los datos están a salvo. Recargá para seguir con la app actualizada.</p>
          <button type="button" className="btn primary" onClick={() => location.reload()}>
            Recargar
          </button>
        </div>
      )
    }
    return (
      <div className="page">
        <h1>Uy, algo se rompió 🫠</h1>
        <p className="muted">Los datos están a salvo. Probá volver al inicio.</p>
        <p className="muted small mono">{error.message}</p>
        <a
          className="btn primary"
          href="#/"
          onClick={() => {
            this.setState({ error: null })
          }}
        >
          Volver al inicio
        </a>
      </div>
    )
  }
}
