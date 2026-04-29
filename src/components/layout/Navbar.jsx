import { useSales } from '../../context/SalesContext'

const titles = {
  dashboard: 'Dashboard de Control',
  sales: 'Ventas',
  new: 'Nueva venta',
}

export const Navbar = ({ current, onNav, onLogout }) => {
  const { sales, user } = useSales()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-surface-950/80 backdrop-blur border-b border-white/5">
      <div>
        <h1 className="font-display font-bold text-xl text-white">{titles[current]}</h1>
        <p className="text-xs text-gray-500">{sales.length} Ventas registradas</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 hidden sm:block">{user?.email}</span>
        <button
          onClick={() => onNav('new')}
          className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <span>⊕</span> Nueva venta
        </button>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-gray-300 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          title="Cerrar sesión"
        >
          ⎋ Salir
        </button>
      </div>
    </header>
  )
}
