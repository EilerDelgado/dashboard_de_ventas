import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSales } from '../../context/SalesContext'

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
          className="lg:hidden text-gray-400 hover:text-white text-xl p-1 focus:outline-none"
          aria-label="Abrir menú"
        >
          ☰
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
            <svg className={`w-4.5 h-4.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/nueva')}
            className="bg-accent hover:bg-accent-dark text-white p-2 rounded-xl transition-all flex items-center justify-center w-9 h-9 shadow-lg shadow-accent/20"
            title="Nueva venta"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-red-400 p-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center w-9 h-9"
            title="Cerrar sesión"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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
            <svg className={`w-4.5 h-4.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 3v5h-5" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/nueva')}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva venta</span>
          </button>
          <button
            onClick={signOut}
            className="text-gray-500 hover:text-red-400 text-sm px-3 py-2 rounded-xl bg-surface-900 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center gap-2"
            title="Cerrar sesión"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
