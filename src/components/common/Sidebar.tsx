import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const ENLACES = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/categorias', label: 'Categorías', icon: Boxes },
  {
    to: '/vales-consumo',
    label: 'Vales de consumo',
    icon: ClipboardList,
  },
]

type SidebarProps = {
  abierto: boolean
}

export function Sidebar({ abierto }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <aside
      className={`sidebar ${abierto ? 'sidebar--abierto' : ''}`}
      aria-hidden={!abierto}
    >
      <div className="sidebar-inner">
        <div className="sidebar-head">
          <span className="sidebar-title">Menú</span>
        </div>

        <nav className="sidebar-nav">
          {ENLACES.map((enlace) => {
            const Icon = enlace.icon
            const activo =
              enlace.to === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(enlace.to)

            return (
              <Link
                key={enlace.to}
                to={enlace.to}
                className={`sidebar-link ${activo ? 'is-active' : ''}`}
              >
                <Icon size={18} />
                <span>{enlace.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
