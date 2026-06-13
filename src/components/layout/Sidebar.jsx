import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/perfil_chopper.png'

const NAV = [
  { to: '/',       label: 'Dashboard', icon: '◈' },
  { to: '/ventas', label: 'Ventas',    icon: '◉' },
  { to: '/nueva',  label: 'Nueva venta', icon: '⊕' },
]

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const [collapsed, setCollapsed] = useState(false)

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
        <NavLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain rounded-full flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Streaming</p>
              <p className="font-display font-bold text-accent-light text-sm leading-tight">Chopper</p>
            </div>
          )}
        </NavLink>
        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {NAV.map(({ to, label, icon }) => (
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
              <span className="text-lg flex-shrink-0">{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 text-gray-600 hover:text-gray-300 border-t border-white/5 text-xs transition-colors"
        >
          {collapsed ? '▶' : '◀ Colapsar'}
        </button>
      </aside>

      {/* Spacer */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`} />
    </>
  )
}
