import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSales } from '../../context/SalesContext'

const titles = {
  '/':       'Dashboard de Control',
  '/ventas': 'Ventas',
  '/nueva':  'Nueva venta',
}

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const { sales, fetchSales } = useSales()
  const location = useLocation()
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const title = titles[location.pathname] || 'Streaming Chopper'

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-surface-950/80 backdrop-blur border-b border-white/5">
      <div>
        <h1 className="font-display font-bold text-xl text-white">{title}</h1>
        <p className="text-xs text-gray-500">{sales.length} Ventas registradas</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 hidden sm:block">{user?.email}</span>
        <button
          onClick={async () => { setRefreshing(true); await fetchSales(); setRefreshing(false) }}
          className="text-gray-500 hover:text-gray-300 text-sm px-2 py-2 rounded-lg hover:bg-white/5 transition-all"
          title="Actualizar datos"
          disabled={refreshing}
        >
          <span className={`inline-block ${refreshing ? 'animate-spin' : ''}`}>↻</span>
        </button>
        <button
          onClick={() => navigate('/nueva')}
          className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <span>⊕</span> Nueva venta
        </button>
        <button
          onClick={signOut}
          className="text-gray-500 hover:text-gray-300 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          title="Cerrar sesión"
        >
          ⎋ Salir
        </button>
      </div>
    </header>
  )
}
