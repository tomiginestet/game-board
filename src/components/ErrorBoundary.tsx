import { Component, type ReactNode } from 'react'

/** Si una pantalla se rompe, muestra un aviso en vez de dejar todo en blanco. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="page">
        <h1>Uy, algo se rompió 🫠</h1>
        <p className="muted">Los datos están a salvo. Probá volver al inicio.</p>
        <p className="muted small mono">{this.state.error.message}</p>
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
