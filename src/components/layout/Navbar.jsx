import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSales } from '../../context/SalesContext'
import { Menu, RotateCw, Plus, LogOut } from 'lucide-react'

const titles = {
  '/':       'Dashboard de Control',
  '/ventas': 'Ventas',
  '/nueva':  'Nueva venta',
}

export const Navbar = ({ onMenuClick }) => {
  const { user, signOut } = useAuth()
  const { sales, fetchSales } = useSales()
  const location = useLocation()
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const title = titles[location.pathname] || 'Streaming Chopper'

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-surface-950/80 backdrop-blur border-b border-white/5">
      {/* Sección Izquierda: Hamburguesa + Título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-1 focus:outline-none flex items-center justify-center"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-display font-bold text-lg sm:text-xl text-white whitespace-nowrap">{title}</h1>
          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">{sales.length} Ventas registradas</p>
        </div>
      </div>

      {/* Sección Derecha: Botones de Acción (Mobile & Desktop) */}
      <div className="flex items-center gap-2">
        {/* Botones para Móvil (sm:hidden) */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={async () => { setRefreshing(true); await fetchSales(); setRefreshing(false) }}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-white/5 active:bg-white/10 transition-all flex items-center justify-center w-9 h-9"
            title="Actualizar datos"
            disabled={refreshing}
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/nueva')}
            className="bg-accent hover:bg-accent-dark text-white p-2 rounded-xl transition-all flex items-center justify-center w-9 h-9 shadow-lg shadow-accent/20"
            title="Nueva venta"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-red-400 p-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center w-9 h-9"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Botones para Desktop (hidden sm:flex) */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-gray-600 hidden md:block">{user?.email}</span>
          <button
            onClick={async () => { setRefreshing(true); await fetchSales(); setRefreshing(false) }}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-white/5 transition-all flex items-center justify-center w-9 h-9"
            title="Actualizar datos"
            disabled={refreshing}
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/nueva')}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva venta</span>
          </button>
          <button
            onClick={signOut}
            className="text-gray-500 hover:text-red-400 text-sm px-3 py-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-2"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
