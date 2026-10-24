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
import { Link, useLocation } from 'react-router-dom'
import { ModuloCodigo } from '../../constants/modulos'
import { useAuth } from '../../hooks/useAuth'

type SidebarItem = {
  label: string
  icon: typeof LayoutDashboard
  to?: string
  moduleId?: ModuloCodigo
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
        to: '/control-almacen',
        label: 'Control de almacén',
        icon: Archive,
        moduleId: ModuloCodigo.CONTROL_ALMACEN,
      },
      {
        to: '/vales-consumo',
        label: 'Vales de consumo',
        icon: ClipboardList,
        moduleId: ModuloCodigo.VALES_CONSUMO,
      },
      {
        to: '/ingresos-almacen',
        label: 'Ingresos de almacén',
        icon: PackagePlus,
        moduleId: ModuloCodigo.INGRESOS_ALMACEN,
      },
    ],
  },
  {
    label: 'Reportes',
    items: [
      {
        to: '/reportes/ingresos',
        label: 'Reporte de ingreso',
        icon: FileText,
        moduleId: ModuloCodigo.REPORTE_INGRESOS,
      },
      {
        to: '/reportes/vales',
        label: 'Reporte de vale',
        icon: FileText,
        moduleId: ModuloCodigo.REPORTE_VALES,
      },
      {
        to:
        '/reportes/productos-mas-pedidos',
        label:
          'Reporte de producto más pedido',
        icon: FileText,
        moduleId: ModuloCodigo.REPORTE_PRODUCTOS,
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
        moduleId: ModuloCodigo.PROVEEDORES,
      },
      {
        to: '/productos',
        label: 'Productos',
        icon: Boxes,
        moduleId: ModuloCodigo.PRODUCTOS,
      },
      {
        to: '/contactos',
        label: 'Contactos',
        icon: Users,
        moduleId: ModuloCodigo.CONTACTOS,
      },
      {
        to: '/partes-equipo',
        label: 'Partes de equipo',
        icon: Archive,
        moduleId: ModuloCodigo.PARTES_EQUIPO,
      },
      {
        to: '/centros-costo',
        label: 'Centros de costo',
        icon: Coins,
        moduleId: ModuloCodigo.CENTROS_COSTO,
      },
      {
        to: '/categorias',
        label: 'Categorías',
        icon: Boxes,
        moduleId: ModuloCodigo.CATEGORIAS,
      },
      {
        to: '/tipos-producto',
        label: 'Tipos de producto',
        icon: Tags,
        moduleId: ModuloCodigo.TIPOS_PRODUCTO,
      },
      {
        to: '/tipos-documento',
        label: 'Tipos de documento',
        icon: FileText,
        moduleId: ModuloCodigo.TIPOS_DOCUMENTO,
      },
      {
        to: '/unidades-medida',
        label: 'Unidades de medida',
        icon: Ruler,
        moduleId: ModuloCodigo.UNIDADES_MEDIDA,
      },
      {
        to: '/destinos',
        label: 'Destinos',
        icon: MapPin,
        moduleId: ModuloCodigo.DESTINOS,
      },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      {
        to: '/bitacora',
        label: 'Bitácora',
        icon: FileText,
        moduleId: ModuloCodigo.BITACORA,
      },
      {
        to: '/usuarios',
        label: 'Usuarios',
        icon: Users,
        moduleId: ModuloCodigo.USUARIOS,
      },
      {
        to: '/roles',
        label: 'Roles',
        icon: Shield,
        moduleId: ModuloCodigo.ROLES,
      },
      {
        to: '/perfil',
        label: 'Perfil de usuario',
        icon: UserCircle,
        moduleId: ModuloCodigo.PERFIL_USUARIO,
      },
    ],
  },
]


type SidebarProps = {
  abierto: boolean
  onNavigate?: () => void
  onToggle: () => void
}

export function Sidebar({
  abierto,
  onNavigate,
  onToggle,
}: SidebarProps) {
  const { pathname } = useLocation()
  const { sesion } = useAuth()

  const mostrarTodosLosModulos = sesion?.rolId === 1
  const rutasPermitidas = new Set(sesion?.modulos ?? [])
  const seccionesPermitidas = SECCIONES.map((seccion) => ({
    ...seccion,
    items: seccion.items.filter(
      (item) =>
        !item.moduleId ||
        mostrarTodosLosModulos ||
        (item.to && rutasPermitidas.has(item.to)),
    ),
  })).filter((seccion) => seccion.items.length > 0)
 
  const activo = (to: string) =>
    to === '/dashboard' ? pathname === to : pathname.startsWith(to)

  

  return (
    <aside
        className={
          `sidebar ${
            abierto
              ? 'sidebar--abierto'
              : ''
          }`
        }
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
                    onClick={onNavigate}
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

