import { useState } from 'react'
import { SalesProvider, useSales } from './context/SalesContext'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { Toast } from './components/ui/Toast'
import { Dashboard } from './pages/Dashboard'
import { Sales } from './pages/Sales'
import { NewSale } from './pages/NewSale'
import { Login } from './pages/Login'
import { supabase } from './lib/supabase'

const AppShell = () => {
  const { user, loading } = useSales()
  const [page, setPage] = useState('dashboard')

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm">Cargando...</div>
    </div>
  )

  if (!user) return <Login />

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar current={page} onNav={setPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar current={page} onNav={setPage} onLogout={() => supabase.auth.signOut()} />
        <main className="flex-1">
          {page === 'dashboard' && <Dashboard />}
          {page === 'sales'     && <Sales />}
          {page === 'new'       && <NewSale onAfterSave={() => setPage('sales')} />}
        </main>
      </div>
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <SalesProvider>
      <AppShell />
    </SalesProvider>
  )
}
