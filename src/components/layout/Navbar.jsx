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
  const { sales, fetchSales, searchQuery, setSearchQuery } = useSales()
  const location = useLocation()
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const title = titles[location.pathname] || 'Streaming Chopper'

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (location.pathname !== '/ventas') {
      navigate('/ventas')
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-surface-950/80 backdrop-blur border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Fila superior: Hamburguesa + Título + Botones de acción móviles */}
      <div className="flex items-center justify-between w-full sm:w-auto">
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

        {/* Botones de acción rápidos para celular */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={async () => { setRefreshing(true); await fetchSales(); setRefreshing(false) }}
            className="text-gray-400 hover:text-white text-sm p-2 rounded-lg bg-surface-900 border border-white/5 transition-all"
            title="Actualizar datos"
            disabled={refreshing}
          >
            <span className={`inline-block ${refreshing ? 'animate-spin' : ''}`}>↻</span>
          </button>
          <button
            onClick={() => navigate('/nueva')}
            className="bg-accent hover:bg-accent-dark text-white text-sm p-2 rounded-lg transition-all"
            title="Nueva venta"
          >
            ⊕
          </button>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-red-400 text-sm p-2 rounded-lg bg-surface-900 border border-white/5 transition-all"
            title="Cerrar sesión"
          >
            ⎋
          </button>
        </div>
      </div>

      {/* Barra de búsqueda: Segunda fila en móviles, Centro en escritorio */}
      <div className="w-full sm:w-auto sm:flex-1 sm:mx-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          className="bg-surface-900 border border-white/5 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-accent w-full sm:max-w-xs placeholder-gray-500 transition-all"
        />
      </div>

      {/* Botones de acción completos para pantallas medianas/grandes */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-xs text-gray-600 hidden md:block">{user?.email}</span>
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
          className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span>⊕</span> Nueva venta
        </button>
        <button
          onClick={signOut}
          className="text-gray-500 hover:text-gray-300 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all whitespace-nowrap"
          title="Cerrar sesión"
        >
          ⎋ Salir
        </button>
      </div>
    </header>
  )
}
