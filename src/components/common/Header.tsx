import { type ReactNode } from 'react'
import { Bell, Leaf, Menu, X } from 'lucide-react'
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
  onMenuClick?: () => void
}

export function Header({
  navItems = [],
  brandHref = '/',
  brandMark = <Leaf size={20} />,
  notifications = 3,
  menuAbierto = false,
  onMenuClick,
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
      {onMenuClick && (
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuAbierto ? 'Ocultar menú' : 'Mostrar menú'}
          aria-expanded={menuAbierto}
          onClick={onMenuClick}
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
        <button
          className="notification-button"
          type="button"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span>{notifications}</span>
        </button>

        <button className="user-menu" type="button" onClick={logout}>
          <span className="avatar">{iniciales}</span>
          <span>
            <strong>{nombreCompleto}</strong>
            <small>{rolUsuario}</small>
          </span>
        </button>
      </div>
    </nav>
  )
}
