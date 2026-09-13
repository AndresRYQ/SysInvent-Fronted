import { useMemo, useState } from 'react'
import { BarChart3, CalendarDays, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { obtenerProductos } from '../../services/productoService'
import '../../styles/DashboardPage.css'
import './ProductosMasPedidosPage.css'

type Periodo = 'semanal' | 'mensual' | 'rango'
type RankingProducto = { id: string; nombre: string; codigo: string; categoria: string; cantidad: number; vales: number }

const CATEGORIAS: Record<string, string> = {
  'CAT-001': 'Herramientas',
  'CAT-002': 'Seguridad Industrial',
  'CAT-003': 'Ferretería',
  'CAT-004': 'Repuestos',
  'CAT-005': 'Limpieza',
}

const DEMANDA_INICIAL: Record<string, { cantidad: number; vales: number }> = {
  'PROD-001': { cantidad: 42, vales: 16 },
  'PROD-002': { cantidad: 68, vales: 24 },
  'PROD-003': { cantidad: 31, vales: 12 },
  'PROD-004': { cantidad: 24, vales: 9 },
}

function obtenerRanking(): RankingProducto[] {
  return obtenerProductos().filter((producto) => producto.estado).map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    codigo: producto.codigo,
    categoria: CATEGORIAS[producto.categoriaId] ?? 'Sin categoría',
    ...(DEMANDA_INICIAL[producto.id] ?? { cantidad: 8, vales: 3 }),
  })).sort((a, b) => b.cantidad - a.cantidad)
}

export function ProductosMasPedidosPage() {
  const [periodo, setPeriodo] = useState<Periodo>('mensual')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const ranking = useMemo(() => obtenerRanking(), [])
  const totalSolicitado = ranking.reduce((total, item) => total + item.cantidad, 0)
  const totalVales = ranking.reduce((total, item) => total + item.vales, 0)
  const maxCantidad = ranking[0]?.cantidad ?? 1

  return (
    <main className="dashboard-shell reporte-productos-page">
      <div className="reporte-productos-page__body">
        <section className="reporte-productos-hero">
          <div>
            <span className="reporte-kicker">Reportes del inventario</span>
            <h1>Productos más pedidos</h1>
            <p>Identifica los productos con mayor rotación y demanda en los vales de consumo.</p>
          </div>
          <div className="reporte-period-status"><TrendingUp size={18} />Ranking actualizado</div>
        </section>

        <section className="reporte-filter-card">
          <div className="reporte-filter-title"><CalendarDays size={19} /><div><strong>Periodo de consulta</strong><span>Selecciona el rango que deseas analizar.</span></div></div>
          <div className="reporte-period-options">
            {([['semanal', 'Esta semana'], ['mensual', 'Este mes'], ['rango', 'Rango de fechas']] as const).map(([value, label]) => (
              <button type="button" key={value} className={periodo === value ? 'is-active' : ''} onClick={() => setPeriodo(value)}>{label}</button>
            ))}
          </div>
          {periodo === 'rango' && <div className="reporte-date-fields"><label>Desde<input type="date" value={fechaInicio} onChange={(event) => setFechaInicio(event.target.value)} /></label><label>Hasta<input type="date" value={fechaFin} onChange={(event) => setFechaFin(event.target.value)} /></label></div>}
        </section>

        <section className="reporte-summary-grid" aria-label="Resumen del reporte">
          <article><span className="reporte-summary-icon reporte-summary-icon--green"><Package size={20} /></span><div><small>Productos analizados</small><strong>{ranking.length}</strong></div></article>
          <article><span className="reporte-summary-icon reporte-summary-icon--blue"><ShoppingCart size={20} /></span><div><small>Unidades solicitadas</small><strong>{totalSolicitado}</strong></div></article>
          <article><span className="reporte-summary-icon reporte-summary-icon--orange"><BarChart3 size={20} /></span><div><small>Vales asociados</small><strong>{totalVales}</strong></div></article>
        </section>

        <section className="reporte-ranking-layout">
          <article className="reporte-card reporte-top-card">
            <div className="reporte-card-header"><div><span className="reporte-kicker">Mayor rotación</span><h2>Productos top</h2></div><BarChart3 size={22} /></div>
            <div className="reporte-bars">{ranking.slice(0, 5).map((item, index) => <div className="reporte-bar-item" key={item.id}><div className="reporte-bar-label"><span className={`reporte-rank reporte-rank--${index + 1}`}>{index + 1}</span><strong>{item.nombre}</strong><b>{item.cantidad}</b></div><div className="reporte-bar-track"><span style={{ width: `${(item.cantidad / maxCantidad) * 100}%` }} /></div></div>)}</div>
          </article>
          <article className="reporte-card reporte-highlight-card">
            <span className="reporte-highlight-icon"><TrendingUp size={24} /></span><span className="reporte-kicker">Producto con mayor demanda</span><h2>{ranking[0]?.nombre ?? 'Sin datos'}</h2><p>{ranking[0]?.categoria ?? 'No disponible'}</p><strong>{ranking[0]?.cantidad ?? 0} unidades solicitadas</strong><small>{ranking[0]?.vales ?? 0} vales asociados en el periodo</small>
          </article>
        </section>

        <section className="reporte-card reporte-table-card">
          <div className="reporte-card-header"><div><span className="reporte-kicker">Detalle del ranking</span><h2>Productos más solicitados</h2></div><span className="reporte-count">{ranking.length} productos</span></div>
          <div className="reporte-table-wrap"><table className="reporte-ranking-table"><thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Cantidad total solicitada</th><th>Vales asociados</th></tr></thead><tbody>{ranking.map((item, index) => <tr key={item.id}><td><span className={`reporte-rank reporte-rank--${index + 1}`}>{index + 1}</span></td><td><strong>{item.nombre}</strong><small>{item.codigo}</small></td><td>{item.categoria}</td><td><strong>{item.cantidad}</strong> unidades</td><td><span className="reporte-voucher-badge">{item.vales} vales</span></td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
  )
}
