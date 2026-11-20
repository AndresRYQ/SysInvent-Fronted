import { type ReactNode } from 'react'
import { Leaf, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

export type HeaderNavItem = {
  label: string
  to: string
  icon?: ReactNode
  active?: boolean
}

type HeaderProps = {
  navItems?: HeaderNavItem[]
  brandHref?: string
  brandMark?: ReactNode
  notifications?: number
  menuAbierto?: boolean
  onMenuToggle?: () => void
  modoOscuro?: boolean
  onModoOscuroToggle?: () => void
}

export function Header({
  navItems = [],
  brandHref = '/',
  brandMark = <Leaf size={20} />,
  menuAbierto = false,
  onMenuToggle,
  modoOscuro = false,
  onModoOscuroToggle,
}: HeaderProps) {
  const { sesion, logout } = useAuth()
  const { pathname } = useLocation()

  const nombreCompleto =
    sesion?.nombreCompleto ?? 'Usuario sin sesión'
  const rolUsuario = sesion?.rol ?? 'Sin rol'
  const iniciales =
    nombreCompleto
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? '')
      .join('') || 'US'

  const esActivo = (item: HeaderNavItem) =>
    item.active ??
    (item.to === '/'
      ? pathname === item.to
      : pathname.startsWith(item.to))

  return (
    <nav className="topbar" aria-label="Navegacion principal">
      {onMenuToggle && (
        <button
          className="mobile-menu-button"
          type="button"
          onClick={onMenuToggle}
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <Link className="brand" to={brandHref}>
        <span className="brand-mark">{brandMark}</span>
        <span className="brand-name">AGRIHUSA</span>
        <span className="brand-system">FFPMS</span>
      </Link>

      {navItems.length > 0 && (
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              className={`nav-link ${esActivo(item) ? 'is-active' : ''}`}
              to={item.to}
              key={item.to + item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="topbar-actions">
        {/* Notificaciones deshabilitadas temporalmente.
        <button
          className="notification-button"
          type="button"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span>{notifications}</span>
        </button>
        */}

        {onModoOscuroToggle && (
          <button
            className="theme-toggle"
            type="button"
            onClick={onModoOscuroToggle}
            aria-label={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
            aria-pressed={modoOscuro}
            title={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {modoOscuro ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        <Link
          className="user-menu"
          to="/perfil"
          aria-label="Ir al perfil de usuario"
        >
          <span className="avatar">{iniciales}</span>
          <span>
            <strong>{nombreCompleto}</strong>
            <small>{rolUsuario}</small>
          </span>
        </Link>

        <button
          className="logout-button"
          type="button"
          onClick={logout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}
