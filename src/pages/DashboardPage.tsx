import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

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
  suffix?: string
  trend: string
  trendType: 'up' | 'down'
  icon: IconName
  tone: string
}

type Module = {
  title: string
  description: string
  icon: IconName
  tone: string
  category: string
}

const metrics: Metric[] = [
  {
    label: 'Inventario total',
    value: 2450,
    trend: '8% vs mes anterior',
    trendType: 'up',
    icon: 'box',
    tone: 'green',
  },
  {
    label: 'Entradas (mes)',
    value: 35,
    trend: '12% vs mes anterior',
    trendType: 'up',
    icon: 'entry',
    tone: 'blue',
  },
  {
    label: 'Salidas (mes)',
    value: 22,
    trend: '5% vs mes anterior',
    trendType: 'down',
    icon: 'exit',
    tone: 'orange',
  },
  {
    label: 'Ordenes pendientes',
    value: 24,
    trend: '4% vs mes anterior',
    trendType: 'up',
    icon: 'clipboard',
    tone: 'violet',
  },
  {
    label: 'Proveedores',
    value: 40,
    trend: '2% vs mes anterior',
    trendType: 'up',
    icon: 'users',
    tone: 'teal',
  },
]

const categories = [
  'Todos',
  'Operaciones',
  'Inventario',
  'Reportes',
  'Maestros',
  'Seguridad',
]

const modules: Module[] = [
  {
    title: 'Registro de Guías',
    description: 'Gestionar guías de recepción.',
    icon: 'clipboard',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Registro de Plantillas',
    description: 'Administrar plantillas de producción.',
    icon: 'clipboard',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Registro de Fucs',
    description: 'Control de FUCs del proceso.',
    icon: 'clipboard',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Calidad en Recepción',
    description: 'Control de calidad de ingreso.',
    icon: 'audit',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Calidad en Proceso',
    description: 'Seguimiento de calidad.',
    icon: 'audit',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Control de Desverdizado',
    description: 'Gestión del proceso de desverdizado.',
    icon: 'box',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Control de Proceso',
    description: 'Supervisión operacional.',
    icon: 'chart',
    tone: 'green',
    category: 'Operaciones',
  },
  {
    title: 'Túnel y Cámara de Frío',
    description: 'Control de cámaras y túneles.',
    icon: 'box',
    tone: 'blue',
    category: 'Operaciones',
  },
  {
    title: 'Registro de Packing List',
    description: 'Administración de packing list.',
    icon: 'clipboard',
    tone: 'blue',
    category: 'Operaciones',
  },
  {
    title: 'Mercado Local',
    description: 'Gestión de ventas locales.',
    icon: 'chart',
    tone: 'blue',
    category: 'Operaciones',
  },
  {
    title: 'Req. de Mantenimiento',
    description: 'Solicitudes de mantenimiento.',
    icon: 'order',
    tone: 'orange',
    category: 'Inventario',
  },
  {
    title: 'Req. de Materiales',
    description: 'Requerimientos de materiales.',
    icon: 'order',
    tone: 'orange',
    category: 'Inventario',
  },
  {
    title: 'Req. de Personal',
    description: 'Solicitudes de personal.',
    icon: 'users',
    tone: 'orange',
    category: 'Inventario',
  },
  {
    title: 'Compras Mantenimiento',
    description: 'Gestión de compras de mantenimiento.',
    icon: 'cart',
    tone: 'red',
    category: 'Inventario',
  },
  {
    title: 'Compras Materiales',
    description: 'Gestión de compras de materiales.',
    icon: 'cart',
    tone: 'red',
    category: 'Inventario',
  },
  {
    title: 'Personal',
    description: 'Administración del personal.',
    icon: 'users',
    tone: 'blue',
    category: 'Inventario',
  },
  {
    title: 'Contabilidad',
    description: 'Procesos contables.',
    icon: 'chart',
    tone: 'violet',
    category: 'Inventario',
  },
  {
    title: 'Ingresos de Almacén',
    description: 'Registro de ingresos.',
    icon: 'entry',
    tone: 'green',
    category: 'Inventario',
  },
  {
    title: 'Vales de Consumo',
    description: 'Administrar vales.',
    icon: 'order',
    tone: 'amber',
    category: 'Inventario',
  },
  {
    title: 'Control de Almacén',
    description: 'Control de inventario.',
    icon: 'box',
    tone: 'green',
    category: 'Inventario',
  },
  {
    title: 'Registro de Ventas',
    description: 'Registro de ventas.',
    icon: 'cart',
    tone: 'orange',
    category: 'Inventario',
  },
  {
    title: 'Reporte de Recepción',
    description: 'Reportes de recepción.',
    icon: 'report',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte de Fucs',
    description: 'Reportería FUCs.',
    icon: 'report',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte de Producción',
    description: 'Indicadores de producción.',
    icon: 'chart',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte de Trazabilidad',
    description: 'Seguimiento de trazabilidad.',
    icon: 'report',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte Stock Frío',
    description: 'Stock en cámaras.',
    icon: 'box',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte Stock Detallado',
    description: 'Detalle de inventario.',
    icon: 'box',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte de Calidad',
    description: 'Control de calidad.',
    icon: 'audit',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte Stock Pallets',
    description: 'Stock de pallets.',
    icon: 'qr',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Reporte Kardex',
    description: 'Movimientos de almacén.',
    icon: 'chart',
    tone: 'blue',
    category: 'Reportes',
  },
  {
    title: 'Centros de costo',
    description: 'Mantenimiento de centros de costo.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Categorías',
    description: 'Gestión de categorías.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Tipos de producto',
    description: 'Administración de tipos de producto.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Modelos de Caja',
    description: 'Configuración de modelos.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Cámaras de Frío',
    description: 'Administración de cámaras.',
    icon: 'box',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Acopiadores',
    description: 'Gestión de acopiadores.',
    icon: 'users',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Clientes',
    description: 'Administración de clientes.',
    icon: 'users',
    tone: 'green',
    category: 'Maestros',
  },
  {
    title: 'Usuarios',
    description: 'Administración de usuarios.',
    icon: 'users',
    tone: 'violet',
    category: 'Seguridad',
  },
  {
    title: 'Roles',
    description: 'Gestión de roles.',
    icon: 'users',
    tone: 'violet',
    category: 'Seguridad',
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
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const nombreUsuario = sesion?.nombreCompleto ?? 'Frank Arone'
  const nombreSaludo = nombreUsuario.split(' ')[0] || 'Frank'

  const filteredModules =
    selectedCategory === 'Todos'
      ? modules
      : modules.filter((module) => module.category === selectedCategory)

  const manejarAbrirModulo = (moduleTitle: string) => {
    if (moduleTitle === 'Categorías') {
      navigate('/categorias')
    }

    if (moduleTitle === 'Centros de costo') {
      navigate('/centros-costo')
    }

    if (moduleTitle === 'Tipos de producto') {
      navigate('/tipos-producto')
    }

    if (moduleTitle === 'Vales de Consumo') {
      navigate('/vales-consumo')
    }
  }

  return (
    <main className="dashboard-shell">

      <section className="hero-panel">
        <div className="hero-copy">
          <AnimatedContent>
            <span className="hero-line" />
            <h1>Bienvenido, {nombreSaludo}!</h1>
            <p className="hero-subtitle">Sistema de Control de Almacen - FFPMS</p>
            <p className="hero-description">
              Administra inventarios, ordenes, entradas, salidas y reportes de tu almacen.
            </p>
          </AnimatedContent>
        </div>

        <AnimatedContent className="warehouse-illustration" delay={120}>
          <div className="orb" />
          <div className="warehouse">
            <div className="roof" />
            <div className="building">
              <span className="shield" />
              <span className="door" />
              <span className="window left" />
              <span className="window right" />
            </div>
            <div className="boxes">
              <span />
              <span />
              <span />
            </div>
            <div className="forklift">
              <span className="forklift-body" />
              <span className="forklift-wheel one" />
              <span className="forklift-wheel two" />
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
                <small className={metric.trendType === 'down' ? 'trend-down' : 'trend-up'}>
                  {metric.trendType === 'down' ? '↓' : '↑'} {metric.trend}
                </small>
              </div>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </section>

      <section className="categories-bar">
        {categories.map((category) => (
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
                onClick={() => manejarAbrirModulo(module.title)}
              >
                Abrir modulo
                <span aria-hidden="true">→</span>
              </button>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </section>

      <footer className="dashboard-footer">© 2024 Agrihuasa. Todos los derechos reservados.</footer>
    </main>
  )
}

export default DashboardPage
