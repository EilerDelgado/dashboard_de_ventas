import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/perfil_chopper.png'
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const NAV = [
  { to: '/',       label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/ventas', label: 'Ventas',      icon: Receipt },
  { to: '/nueva',  label: 'Nueva venta',  icon: PlusCircle },
]

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-surface-900 border-r border-white/5 transition-all duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-16' : 'w-56'}`}
      >
        {/* Logo */}
        <NavLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-5 border-b border-white/5 flex-shrink-0">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain rounded-full flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Streaming</p>
              <p className="font-display font-bold text-accent-light text-sm leading-tight">Chopper</p>
            </div>
          )}
        </NavLink>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${
                  isActive
                    ? 'bg-accent/20 text-accent-light border border-accent/20'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="border-t border-white/5 p-2 flex flex-col gap-1 mt-auto flex-shrink-0">
          {/* Cerrar Sesión */}
          <button
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>

          {/* Colapsar Menú (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors w-full text-left border-t border-white/5 pt-3 mt-1"
            title="Colapsar menú"
          >
            {collapsed ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
            {!collapsed && <span>Colapsar menú</span>}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`} />
    </>
  )
}
