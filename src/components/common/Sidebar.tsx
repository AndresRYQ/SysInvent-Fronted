import {
  Archive,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Coins,
  FileText,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  Ruler,
  Tags,
  Users,
  Shield,
  UserCircle,
} from 'lucide-react'
import { useRef, type PointerEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

import {
  tienePermisoModulo,
} from '../../services/rolService'

type SidebarItem = {
  label: string
  icon: typeof LayoutDashboard
  to?: string
  moduleId?: string
}

type SidebarSection = {
  label: string
  items: SidebarItem[]
}

const SECCIONES: SidebarSection[] = [
  {
    label: 'General',
    items: [
      {
        to: '/dashboard',
        label: 'Inicio',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Inventario',
    items: [
      {
        label: 'Control de almacén',
        icon: Archive,
        moduleId: 'control-almacen',
      },
      {
        to: '/vales-consumo',
        label: 'Vales de consumo',
        icon: ClipboardList,
        moduleId: 'vales-consumo',
      },
      {
        to: '/ingresos-almacen',
        label: 'Ingresos de almacén',
        icon: PackagePlus,
        moduleId: 'ingresos-almacen',
      },
    ],
  },
  {
    label: 'Reportes',
    items: [
      {
        label: 'Reporte de ingreso',
        icon: FileText,
        moduleId: 'reporte-ingresos',
      },
      {
        label: 'Reporte de vale',
        icon: FileText,
        moduleId: 'reporte-vales',
      },
      {
        label:
          'Reporte de producto más pedido',
        icon: FileText,
        moduleId: 'reporte-productos',
      },
    ],
  },
  {
    label: 'Maestros',
    items: [
      {
        to: '/proveedores',
        label: 'Proveedores',
        icon: Users,
        moduleId: 'proveedores',
      },
      {
        to: '/productos',
        label: 'Productos',
        icon: Boxes,
        moduleId: 'productos',
      },
      {
        label: 'Contactos',
        icon: Users,
        moduleId: 'contactos',
      },
      {
        label: 'Partes de equipo',
        icon: Archive,
        moduleId: 'partes-equipo',
      },
      {
        to: '/centros-costo',
        label: 'Centros de costo',
        icon: Coins,
        moduleId: 'centros-costo',
      },
      {
        to: '/categorias',
        label: 'Categorías',
        icon: Boxes,
        moduleId: 'categorias',
      },
      {
        to: '/tipos-producto',
        label: 'Tipos de producto',
        icon: Tags,
        moduleId: 'tipos-producto',
      },
      {
        to: '/tipos-documento',
        label: 'Tipos de documento',
        icon: FileText,
        moduleId: 'tipos-documento',
      },
      {
        to: '/unidades-medida',
        label: 'Unidades de medida',
        icon: Ruler,
        moduleId: 'unidades-medida',
      },
      {
        to: '/destinos',
        label: 'Destinos',
        icon: MapPin,
        moduleId: 'destinos',
      },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      {
        label: 'Bitácora',
        icon: FileText,
        moduleId: 'bitacora',
      },
      {
        to: '/usuarios',
        label: 'Usuarios',
        icon: Users,
        moduleId: 'usuarios',
      },
      {
        to: '/roles',
        label: 'Roles',
        icon: Shield,
        moduleId: 'roles',
      },
      {
        label: 'Perfil de usuario',
        icon: UserCircle,
        moduleId: 'perfil-usuario',
      },
    ],
  },
]


type SidebarProps = {
  abierto: boolean
  onToggle: () => void
}

export function Sidebar({ abierto, onToggle }: SidebarProps) {
  const { pathname } = useLocation()
  const { sesion } = useAuth()

const seccionesPermitidas =
  SECCIONES.map((seccion) => ({
    ...seccion,
    items: seccion.items.filter(
      (item) =>
        !item.moduleId ||
        tienePermisoModulo(
          sesion?.rol,
          item.moduleId,
        ),
    ),
  })).filter(
    (seccion) => seccion.items.length > 0,
  )
  const sidebarRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    active: false,
    dragged: false,
    startY: 0,
    startScrollTop: 0,
  })

  const activo = (to: string) =>
    to === '/dashboard' ? pathname === to : pathname.startsWith(to)

  const manejarPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !sidebarRef.current) {
      return
    }

    dragRef.current = {
      active: true,
      dragged: false,
      startY: event.clientY,
      startScrollTop: sidebarRef.current.scrollTop,
    }
    sidebarRef.current.setPointerCapture(event.pointerId)
  }

  const manejarPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !sidebarRef.current) {
      return
    }

    const desplazamiento = event.clientY - dragRef.current.startY
    if (Math.abs(desplazamiento) > 5) {
      dragRef.current.dragged = true
    }

    if (dragRef.current.dragged) {
      sidebarRef.current.scrollTop = Math.max(
        0,
        Math.min(
          sidebarRef.current.scrollHeight - sidebarRef.current.clientHeight,
          dragRef.current.startScrollTop - desplazamiento,
        ),
      )
    }
  }

  const finalizarArrastre = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !sidebarRef.current) {
      return
    }

    dragRef.current.active = false
    sidebarRef.current.releasePointerCapture(event.pointerId)
  }

  const evitarClickTrasArrastre = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.dragged) {
      event.preventDefault()
      event.stopPropagation()
      dragRef.current.dragged = false
    }
  }

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

      <div
        ref={sidebarRef}
        className="sidebar-inner"
        onPointerDown={manejarPointerDown}
        onPointerMove={manejarPointerMove}
        onPointerUp={finalizarArrastre}
        onPointerCancel={finalizarArrastre}
        onClickCapture={evitarClickTrasArrastre}
      >
        <div className={`sidebar-head ${abierto ? '' : 'sidebar-head--cerrado'}`}>
          <span className="sidebar-title">Menú</span>
        </div>

        <nav
          className="sidebar-nav"
          tabIndex={0}
          aria-label="Navegación principal"
        >
         {seccionesPermitidas.map((seccion) => (
            <div className="sidebar-section" key={seccion.label}>
              {abierto && <span className="sidebar-section-label">{seccion.label}</span>}
              {seccion.items.map((enlace) => {
                const Icon = enlace.icon
                const esActivo = enlace.to ? activo(enlace.to) : false
                const className = `sidebar-link ${esActivo ? 'is-active' : ''} ${
                  enlace.to ? '' : 'sidebar-link--disabled'
                }`

                return enlace.to ? (
                  <Link
                    key={enlace.label}
                    to={enlace.to}
                    className={className}
                    title={!abierto ? enlace.label : undefined}
                  >
                    <Icon size={18} />
                    {abierto && <span>{enlace.label}</span>}
                  </Link>
                ) : (
                  <span
                    key={enlace.label}
                    className={className}
                    title={!abierto ? `${enlace.label} (En desarrollo)` : `${enlace.label} (En desarrollo)`}
                    aria-disabled="true"
                  >
                    <Icon size={18} />
                    {abierto && <span>{enlace.label}</span>}
                  </span>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
