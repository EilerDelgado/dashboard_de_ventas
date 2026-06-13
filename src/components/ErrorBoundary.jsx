import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center font-body selection:bg-accent/30 selection:text-white">
          <div className="max-w-md w-full bg-surface-900 border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Error symbol */}
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ⚠
            </div>

            <h1 className="font-display font-bold text-2xl text-white mb-2">
              Algo salió mal
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Ocurrió un error inesperado en la aplicación. Por favor, intenta recargar la página.
            </p>

            {this.state.error && (
              <div className="bg-surface-950 border border-white/5 rounded-lg p-4 mb-6 text-left overflow-x-auto max-h-32 text-xs font-mono text-red-400/80">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
            >
              <span>↻</span> Recargar aplicación
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
