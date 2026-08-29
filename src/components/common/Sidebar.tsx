import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Coins,
  LayoutDashboard,
  ReceiptText,
  Ruler,
  Tags,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const ENLACES = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { to: '/categorias', label: 'Categorías', icon: Boxes },
  { to: '/centros-costo', label: 'Centros de costo', icon: Coins },
  { to: '/tipos-producto', label: 'Tipos de producto', icon: Tags },
  {
    to: '/tipos-comprobante',
    label: 'Tipos de comprobante',
    icon: ReceiptText,
  },
  {
    to: '/unidades-medida',
    label: 'Unidades de medida',
    icon: Ruler,
  },
  {
    to: '/vales-consumo',
    label: 'Vales de consumo',
    icon: ClipboardList,
  },
]

type SidebarProps = {
  abierto: boolean
  onToggle: () => void
}

export function Sidebar({ abierto, onToggle }: SidebarProps) {
  const { pathname } = useLocation()

  const activo = (to: string) =>
    to === '/dashboard' ? pathname === to : pathname.startsWith(to)

  return (
    <aside
      className={`sidebar ${abierto ? 'sidebar--abierto' : ''}`}
      aria-hidden={!abierto}
    >
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={abierto ? 'Contraer menú' : 'Expandir menú'}
        title={abierto ? 'Contraer menú' : 'Expandir menú'}
      >
        {abierto ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="sidebar-inner">
        <div className={`sidebar-head ${abierto ? '' : 'sidebar-head--cerrado'}`}>
          <span className="sidebar-title">Menú</span>
        </div>

        <nav className="sidebar-nav">
          {ENLACES.map((enlace) => {
            const Icon = enlace.icon
            const esActivo = activo(enlace.to)

            return (
              <Link
                key={enlace.to}
                to={enlace.to}
                className={`sidebar-link ${esActivo ? 'is-active' : ''}`}
                title={!abierto ? enlace.label : undefined}
              >
                <Icon size={18} />
                {abierto && <span>{enlace.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
