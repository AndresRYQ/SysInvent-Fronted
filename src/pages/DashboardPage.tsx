import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  tienePermisoModulo,
} from '../services/rolService'
import {
  obtenerResumenDashboard,
} from '../services/dashboardService'
import AnimatedContent from '../components/ui/AnimatedContent'
import CountUp from '../components/ui/CountUp'
import SpotlightCard from '../components/ui/SpotlightCard'
import { useAuth } from '../hooks/useAuth'
import '../styles/react-bits.css'
import '../styles/DashboardPage.css'

type IconName =
  | 'leaf'
  | 'home'
  | 'box'
  | 'entry'
  | 'exit'
  | 'report'
  | 'order'
  | 'audit'
  | 'bell'
  | 'users'
  | 'qr'
  | 'clipboard'
  | 'cart'
  | 'chart'

type Metric = {
  label: string
  value: number
  detail: string
  status: 'positive' | 'alert' | 'neutral'
  icon: IconName
  tone: string
}

type Module = {
  id: string
  title: string
  description: string
  icon: IconName
  tone: string
  category: string
  route?: string
}

const categories = [
  'Todos',
  'Inventario',
  'Reportes',
  'Maestros',
  'Seguridad',
  'Perfil',
]

const modules: Module[] = [
  {
    id: 'proveedores',
    title: 'Proveedores',
    description: 'Administración de proveedores.',
    icon: 'users',
    tone: 'green',
    category: 'Maestros',
    route: '/proveedores',
  },
  {
    id: 'productos',
    title: 'Productos',
    description: 'Administración de productos.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/productos',
  },
  {
    id: 'bitacora',
    title: 'Bitácora',
    description: 'Consulta de actividades y cambios.',
    icon: 'audit',
    tone: 'violet',
    category: 'Seguridad',
    route: '/bitacora',
  },
  {
    id: 'contactos',
    title: 'Contactos',
    description: 'Administración de contactos.',
    icon: 'users',
    tone: 'green',
    category: 'Maestros',
    route: '/contactos',
  },
  {
    id: 'partes-equipo',
    title: 'Partes de equipo',
    description: 'Administración de partes de equipo.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/partes-equipo',
  },
  {
    id: 'control-almacen',
    title: 'Control de almacén',
    description: 'Control de inventario y movimientos.',
    icon: 'box',
    tone: 'green',
    category: 'Inventario',
    route: '/control-almacen',
  },
  {
    id: 'vales-consumo',
    title: 'Vales de consumo',
    description: 'Administración de vales de consumo.',
    icon: 'order',
    tone: 'green',
    category: 'Inventario',
    route: '/vales-consumo',
  },
  {
    id: 'ingresos-almacen',
    title: 'Ingresos de Almacén',
    description: 'Registro de ingresos.',
    icon: 'entry',
    tone: 'green',
    category: 'Inventario',
    route: '/ingresos-almacen',
  },
  {
    id: 'reporte-ingresos',
    title: 'Reporte de ingreso',
    description: 'Consulta de reportes de ingresos.',
    icon: 'report',
    tone: 'blue',
    category: 'Reportes',
    route: '/reportes/ingresos',
  },
  {
    id: 'reporte-vales',
    title: 'Reporte de vale',
    description: 'Consulta de reportes de vales.',
    icon: 'report',
    tone: 'blue',
    category: 'Reportes',
    route: '/reportes/vales',
  },
  {
    id: 'reporte-productos',
    title: 'Reporte acumulado',
    description: 'Consulta de productos más solicitados.',
    icon: 'chart',
    tone: 'blue',
    category: 'Reportes',
     route:
    '/reportes/productos-mas-pedidos',
  },
  {
    id: 'centros-costo',
    title: 'Centros de costo',
    description: 'Mantenimiento de centros de costo.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/centros-costo',
  },
  {
    id: 'categorias',
    title: 'Categorías',
    description: 'Gestión de categorías.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/categorias',
  },
  {
    id: 'tipos-producto',
    title: 'Tipos de producto',
    description: 'Administración de tipos de producto.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/tipos-producto',
  },
  {
    id: 'tipos-documento',
    title: 'Tipos de documento',
    description: 'Administración de tipos de documento.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/tipos-documento',
  },
  {
    id: 'unidades-medida',
    title: 'Unidades de medida',
    description: 'Administración de unidades de medida.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/unidades-medida',
  },
  {
    id: 'destinos',
    title: 'Destinos',
    description: 'Administración de destinos.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
    route: '/destinos',
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    description: 'Administración de usuarios.',
    icon: 'users',
    tone: 'violet',
    category: 'Seguridad',
    route: '/usuarios',
  },
  {
    id: 'roles',
    title: 'Roles',
    description: 'Gestión de roles.',
    icon: 'users',
    tone: 'violet',
    category: 'Seguridad',
    route: '/roles',
  },
  {
    id: 'perfil-usuario',
    title: 'Perfil de usuario',
    description: 'Consulta y edición del perfil del usuario.',
    icon: 'users',
    tone: 'teal',
    category: 'Perfil',
    route: '/perfil',
  },
]

function Icon({ name }: { name: IconName }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  }

  const paths: Record<IconName, ReactNode> = {
    leaf: (
      <>
        <path d="M20 4c-8.2.2-14.5 3.4-16 12.4 5.8 1.2 12.4-1.9 16-12.4Z" />
        <path d="M4 20c4-7.2 8-10 16-16" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    box: (
      <>
        <path d="m12 3 8 4.4v9.2L12 21l-8-4.4V7.4L12 3Z" />
        <path d="M4 7.5 12 12l8-4.5" />
        <path d="M12 12v9" />
      </>
    ),
    entry: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    exit: (
      <>
        <path d="M12 21V9" />
        <path d="m7 14 5-5 5 5" />
        <path d="M5 21h14" />
      </>
    ),
    report: (
      <>
        <path d="M5 19V5" />
        <path d="M5 19h14" />
        <path d="M9 15v-4" />
        <path d="M13 15V8" />
        <path d="M17 15v-7" />
      </>
    ),
    order: (
      <>
        <path d="M8 6h8" />
        <path d="M9 3h6l1 3H8l1-3Z" />
        <path d="M6 6h12v15H6z" />
        <path d="m9 14 2 2 4-5" />
      </>
    ),
    audit: (
      <>
        <path d="M7 3h10v18H7z" />
        <path d="M10 8h4" />
        <path d="M10 12h4" />
        <path d="M10 16h2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M2 21v-2a4 4 0 0 1 3-3.87" />
      </>
    ),
    qr: (
      <>
        <path d="M4 4h6v6H4z" />
        <path d="M14 4h6v6h-6z" />
        <path d="M4 14h6v6H4z" />
        <path d="M14 14h2v2h-2z" />
        <path d="M18 14h2v6h-4v-2" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4h6l1 3H8l1-3Z" />
        <path d="M6 6h12v15H6z" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    ),
    cart: (
      <>
        <path d="M6 6h15l-2 8H8L6 3H3" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-7" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  )
}

function DashboardPage() {
  const navigate = useNavigate()
  const { sesion } = useAuth()

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Todos')

  const resumenDashboard = useMemo(
    () => obtenerResumenDashboard(),
    [],
  )

  const metrics: Metric[] = [
    {
      label: 'Productos activos',
      value:
        resumenDashboard.productosActivos,
      detail:
        'Productos registrados',
      status: 'neutral',
      icon: 'box',
      tone: 'green',
    },
    {
      label: 'Stock crítico',
      value:
        resumenDashboard
          .productosStockBajo +
        resumenDashboard
          .productosSinStock,
      detail:
        'Requieren reposición',
      status: 'alert',
      icon: 'clipboard',
      tone: 'orange',
    },
    {
      label: 'Ingresos del mes',
      value:
        resumenDashboard.ingresosDelMes,
      detail:
        'Documentos registrados',
      status: 'positive',
      icon: 'entry',
      tone: 'blue',
    },
    {
      label: 'Vales del mes',
      value:
        resumenDashboard.valesDelMes,
      detail:
        'Documentos registrados',
      status: 'neutral',
      icon: 'order',
      tone: 'violet',
    },
    {
      label: 'Movimientos de hoy',
      value:
        resumenDashboard.movimientosHoy,
      detail:
        'Entradas y salidas',
      status: 'neutral',
      icon: 'audit',
      tone: 'teal',
    },
  ]

  const dashboardAlerts =
    resumenDashboard.alertas.map(
      (alerta) => ({
        id: alerta.id,
        title: alerta.titulo,
        detail: alerta.detalle,
        tone: alerta.tono,
      }),
    )

  const recentMovements =
    resumenDashboard
      .movimientosRecientes
      .map((movimiento) => ({
        id: movimiento.id,
        date: movimiento.fecha,
        type: movimiento.tipo,
        document:
          movimiento.documento,
        product:
          movimiento.producto,
        quantity:
          movimiento.cantidad,
        responsible:
          movimiento.responsable,
      }))

  const nombreUsuario =
    sesion?.nombreCompleto ??
    'Usuario'

  const nombreSaludo =
    nombreUsuario.split(' ')[0] ||
    'Usuario'

  const fechaActual =
    new Intl.DateTimeFormat(
      'es-PE',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ).format(new Date())

 const modulosPermitidos = useMemo(
  () =>
    modules.filter((module) =>
      tienePermisoModulo(
        sesion?.rol,
        module.id,
      ),
    ),
  [sesion?.rol],
)

const categoriasPermitidas = useMemo(
  () =>
    categories.filter(
      (category) =>
        category === 'Todos' ||
        modulosPermitidos.some(
          (module) =>
            module.category === category,
        ),
    ),
  [modulosPermitidos],
)

const filteredModules =
  selectedCategory === 'Todos'
    ? modulosPermitidos
    : modulosPermitidos.filter(
        (module) =>
          module.category ===
          selectedCategory,
      )

  const manejarAbrirModulo = (module: Module) => {
    if (module.route) {
      navigate(module.route)
    }
  }

  return (
    <main className="dashboard-shell">

      <section className="hero-panel">
        <div className="hero-copy">
          <AnimatedContent>
            <span className="hero-eyebrow">
              Panel de control
            </span>
            <h1>Bienvenido, {nombreSaludo}</h1>

            <p className="hero-subtitle">
              Sistema de Control de Almacén
            </p>

            <p className="hero-description">
              Consulta y administra el inventario,
              los ingresos, los vales de consumo
              y los reportes del almacén.
            </p>
            <p className="hero-date">
              {fechaActual}
            </p>
          </AnimatedContent>
        </div>

        <AnimatedContent
          className="system-status"
          delay={120}
        >
          <div className="system-status__header">
            <span
              className="system-status__indicator"
              aria-hidden="true"
            />

            <div>
              <small>Estado del sistema</small>
              <strong>Operación normal</strong>
            </div>
          </div>

          <div className="system-status__details">
            <div>
              <span>Entorno</span>
              <strong>Localhost</strong>
            </div>

            <div>
              <span>Sesión</span>
              <strong>Activa</strong>
            </div>

            <div>
              <span>Rol</span>
              <strong>
                {sesion?.rol ?? 'Sin rol'}
              </strong>
            </div>
          </div>
        </AnimatedContent>
      </section>

      <section className="metrics-grid" aria-label="Indicadores principales">
        {metrics.map((metric, index) => (
          <AnimatedContent delay={index * 80} key={metric.label}>
            <SpotlightCard className="metric-card" color={`var(--tone-${metric.tone}-soft)`}>
              <span className={`icon-bubble tone-${metric.tone}`}>
                <Icon name={metric.icon} />
              </span>
              <div>
                <p>{metric.label}</p>
                <strong>
                  <CountUp end={metric.value} />
                </strong>
                <small
                  className={`metric-detail metric-detail--${metric.status}`}
                >
                  {metric.detail}
                </small>
              </div>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </section>

      <section
        className="dashboard-section operational-grid"
        aria-label="Resumen operativo"
      >
        <article className="operational-panel">
          <header className="operational-panel__header">
            <div>
              <span className="section-eyebrow">
                Seguimiento
              </span>

              <h2>Alertas del inventario</h2>
            </div>

            <span className="local-badge">
              Datos locales
            </span>
          </header>

          <div className="alerts-list">
            {dashboardAlerts.map((alert) => (
              <div
                className="alert-item"
                key={alert.id}
              >
                <span
                  className={`alert-dot alert-dot--${alert.tone}`}
                  aria-hidden="true"
                />

                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="operational-panel">
          <header className="operational-panel__header">
            <div>
              <span className="section-eyebrow">
                Actividad reciente
              </span>

              <h2>Últimos movimientos</h2>
            </div>
          </header>

          <div className="movement-table-wrap">
            <table className="movement-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Documento</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Responsable</th>
                </tr>
              </thead>

              <tbody>
                {recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.date}</td>

                    <td>
                      <span
                        className={
                          movement.type === 'Ingreso'
                            ? 'movement-badge movement-badge--entry'
                            : 'movement-badge movement-badge--voucher'
                        }
                      >
                        {movement.type}
                      </span>
                    </td>

                    <td>
                      <strong>{movement.document}</strong>
                    </td>

                    <td>{movement.product}</td>

                    <td>{movement.quantity}</td>

                    <td>{movement.responsible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
      <section className="modules-heading">
        <div>
          <span className="section-eyebrow">
            Accesos del sistema
          </span>

          <h2>Módulos del sistema</h2>

          <p>
            Selecciona una categoría para consultar
            los módulos disponibles.
          </p>
        </div>

        <span className="modules-count">
          {filteredModules.length}{' '}
          {filteredModules.length === 1
            ? 'módulo'
            : 'módulos'}
        </span>
      </section>

      <section className="categories-bar">
        {categoriasPermitidas.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="modules-grid" aria-label="Modulos del sistema">
        {filteredModules.map((module, index) => (
          <AnimatedContent delay={140 + index * 70} key={module.title}>
            <SpotlightCard className="module-card" color={`var(--tone-${module.tone}-soft)`}>
              <div className={`module-icon tone-${module.tone}`}>
                <Icon name={module.icon} />
              </div>
              <div className="module-content">
                <h2>{module.title}</h2>
                <p>{module.description}</p>
              </div>
              <button
                className={`module-action tone-${module.tone}`}
                type="button"
                disabled={!module.route}
                title={!module.route ? 'Módulo en desarrollo' : undefined}
                onClick={() => manejarAbrirModulo(module)}
              >
                {module.route ? 'Abrir módulo' : 'En desarrollo'}
                {module.route && <span aria-hidden="true">→</span>}
              </button>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </section>
      <footer className="dashboard-footer">
        © 2026 AGRIHUSAC. Todos los derechos reservados.
      </footer>
    </main>
  )
}

export default DashboardPage
