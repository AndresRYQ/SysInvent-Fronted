import AnimatedContent from '../components/ui/AnimatedContent'
import CountUp from '../components/ui/CountUp'
import SpotlightCard from '../components/ui/SpotlightCard'
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

type NavItem = {
  label: string
  icon: IconName
  active?: boolean
}

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
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: 'home', active: true },
  { label: 'Productos', icon: 'box' },
  { label: 'Entradas', icon: 'entry' },
  { label: 'Salidas', icon: 'exit' },
  { label: 'Reportes', icon: 'report' },
  { label: 'Ordenes', icon: 'order' },
  { label: 'Auditoria', icon: 'audit' },
]

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

const modules: Module[] = [
  {
    title: 'Pallet - QR',
    description: 'Generar y escanear codigos QR de pallets.',
    icon: 'qr',
    tone: 'green',
  },
  {
    title: 'Registro personal',
    description: 'Gestionar informacion del personal.',
    icon: 'users',
    tone: 'blue',
  },
  {
    title: 'Estado de orden',
    description: 'Consultar estado de las ordenes.',
    icon: 'clipboard',
    tone: 'orange',
  },
  {
    title: 'Auditoria',
    description: 'Revisar logs y auditorias del sistema.',
    icon: 'audit',
    tone: 'violet',
  },
  {
    title: 'Orden de compra',
    description: 'Generar y gestionar ordenes de compra.',
    icon: 'cart',
    tone: 'red',
  },
  {
    title: 'Vale de consumo',
    description: 'Crear y administrar vales de consumo.',
    icon: 'order',
    tone: 'amber',
  },
  {
    title: 'Productos',
    description: 'Gestionar productos del almacen.',
    icon: 'box',
    tone: 'green',
  },
  {
    title: 'Reportes y Kardex',
    description: 'Ver reportes y kardex de productos.',
    icon: 'chart',
    tone: 'blue',
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

  const paths: Record<IconName, JSX.Element> = {
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
  return (
    <main className="dashboard-shell">
      <nav className="topbar" aria-label="Navegacion principal">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Icon name="leaf" />
          </span>
          <span className="brand-name">AGRIHUASA</span>
          <span className="brand-system">FFPMS</span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a className={`nav-link ${item.active ? 'is-active' : ''}`} href="/" key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="topbar-actions">
          <button className="notification-button" type="button" aria-label="Notificaciones">
            <Icon name="bell" />
            <span>3</span>
          </button>
          <button className="user-menu" type="button">
            <span className="avatar">FA</span>
            <span>
              <strong>Frank Arone</strong>
              <small>Administrador</small>
            </span>
          </button>
        </div>
      </nav>

      <section className="hero-panel">
        <div className="hero-copy">
          <AnimatedContent>
            <span className="hero-line" />
            <h1>Bienvenido, Frank!</h1>
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

      <section className="modules-grid" aria-label="Modulos del sistema">
        {modules.map((module, index) => (
          <AnimatedContent delay={140 + index * 70} key={module.title}>
            <SpotlightCard className="module-card" color={`var(--tone-${module.tone}-soft)`}>
              <div className={`module-icon tone-${module.tone}`}>
                <Icon name={module.icon} />
              </div>
              <div className="module-content">
                <h2>{module.title}</h2>
                <p>{module.description}</p>
              </div>
              <button className={`module-action tone-${module.tone}`} type="button">
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
