import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const navLinks = [
  { to: '/', label: 'Inicio', icon: '🏠', exact: true },
  { to: '/estudiar', label: 'Estudiar', icon: '📖' },
  { to: '/senales', label: 'Señales', icon: '🛑' },
  { to: '/examenes/historial', label: 'Exámenes', icon: '📝' },
  { to: '/progreso', label: 'Progreso', icon: '📊' },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClase = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-blue-100 text-blue-700 shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  const mobileLinkClase = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">
      {/* Header */}
      <header className={`sticky top-0 z-20 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      } border-b border-gray-200/70`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Desktop Nav */}
            <div className="flex items-center gap-1 lg:gap-8">
              <NavLink to="/" className="text-xl font-bold text-blue-600 flex-shrink-0 mr-2 lg:mr-0">
                🚗 <span className="hidden sm:inline">Autoescuela</span>
              </NavLink>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={linkClase}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-600">{usuario?.nombre}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                {menuAbierto ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {menuAbierto && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={mobileLinkClase}
                  onClick={() => setMenuAbierto(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </div>
                <span>{usuario?.nombre}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10 w-full">
        <Outlet />
      </main>
    </div>
  )
}
