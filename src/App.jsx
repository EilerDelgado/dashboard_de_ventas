import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SalesProvider } from './context/SalesContext'
import { useAuth } from './hooks/useAuth'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { Toast } from './components/ui/Toast'
import { Dashboard } from './pages/Dashboard'
import { Sales } from './pages/Sales'
import { NewSale } from './pages/NewSale'
import { Login } from './pages/Login'
import ErrorBoundary from './components/ErrorBoundary'
import { isSupabaseConfigured } from './lib/supabase'

const ProtectedLayout = () => {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm">Cargando...</div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <SalesProvider>
      <div className="flex min-h-screen bg-surface-950">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="ventas" element={<Sales />} />
              <Route path="nueva" element={<NewSale />} />
            </Routes>
          </main>
        </div>
        <Toast />
      </div>
    </SalesProvider>
  )
}

const PublicRoute = () => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm">Cargando...</div>
    </div>
  )

  if (user) return <Navigate to="/" replace />

  return <Login />
}

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 text-center font-body selection:bg-accent/30 selection:text-white">
        <div className="max-w-xl w-full bg-surface-900 border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-left">
          {/* Background decorative glow */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none" />

          {/* Config Icon */}
          <div className="w-14 h-14 bg-accent/10 border border-accent/20 text-accent-light rounded-xl flex items-center justify-center text-2xl mb-6">
            ⚙
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-2">
            Configuración Requerida
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Para que la aplicación funcione, es necesario conectar la base de datos de Supabase. Sigue los pasos a continuación para configurarla.
          </p>

          <div className="bg-surface-950 border border-white/5 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-accent-light uppercase tracking-wider mb-3">
              Instrucciones de configuración
            </h3>
            <ol className="list-decimal list-inside text-gray-300 text-xs space-y-2 leading-relaxed">
              <li>Crea un archivo llamado <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-white">.env</code> en la raíz del proyecto.</li>
              <li>Añade las siguientes variables de entorno con los valores correspondientes de tu proyecto de Supabase:</li>
            </ol>

            <div className="relative mt-4">
              <pre className="bg-surface-900 border border-white/5 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto select-all">
{`VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui`}
              </pre>
              <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono uppercase bg-surface-950 px-2 py-0.5 rounded border border-white/5">
                Copiar ejemplo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-xl p-4 text-xs text-accent-light">
            <span className="text-lg">ℹ</span>
            <p>
              Una vez configurado el archivo <code className="font-mono bg-white/5 px-1 py-0.5 rounded">.env</code>, reinicia el servidor de desarrollo para aplicar los cambios.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
