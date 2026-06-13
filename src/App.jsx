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

const ProtectedLayout = () => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm">Cargando...</div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <SalesProvider>
      <div className="flex min-h-screen bg-surface-950">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
