import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Boxes, Download, ListFilter } from 'lucide-react'
import { TablePagination } from '../../components/ui/TablePagination'
import { movimientosKardex, productosKardex, stockActualKardex } from '../../data/kardex'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import './ReportesKardexPage.css'

const filtrosIniciales = { producto: '', tipo: '', desde: '', hasta: '' }
const fechaVisible = (fecha: string) => fecha.split('-').reverse().join('/')

export function ReportesKardexPage() {
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const rangoInvalido = Boolean(filtros.desde && filtros.hasta && filtros.desde > filtros.hasta)
  const movimientos = rangoInvalido ? [] : movimientosKardex.filter((m) =>
    (!filtros.producto || m.productoId === filtros.producto) &&
    (!filtros.tipo || m.tipo === filtros.tipo) &&
    (!filtros.desde || m.fecha >= filtros.desde) &&
    (!filtros.hasta || m.fecha <= filtros.hasta),
  ).slice().reverse()
  const productos = stockActualKardex.filter((p) => !filtros.producto || p.id === filtros.producto)
  const cambiarFiltro = (campo: keyof typeof filtros, valor: string) => {
    setFiltros((actual) => ({ ...actual, [campo]: valor }))
    setPage(1)
  }
  const exportar = () => {
    const filas = movimientos.map((m) => {
      const producto = productosKardex.find((p) => p.id === m.productoId)!
      return [m.id, producto.nombre, producto.unidad, fechaVisible(m.fecha), m.tipo, m.ingreso, m.salida, m.stock, m.responsable]
    })
    const csv = [['Movimiento', 'Producto', 'Unidad', 'Fecha', 'Tipo', 'Ingreso', 'Salida', 'Stock tras movimiento', 'Responsable'], ...filas]
      .map((fila) => fila.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }))
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = 'reporte-kardex.csv'
    enlace.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="dashboard-shell maestro-page-shell kardex-page">
      <header className="maestro-topbar kardex-heading">
        <div className="maestro-topbar__copy">
          <span className="maestro-kicker">Reportes / Almacén</span>
          <h1>Reportes y Kardex</h1>
          <p>Consulta las entradas, salidas y existencias de tus productos.</p>
        </div>
        <button className="btn maestro-btn-primary" onClick={exportar} disabled={!movimientos.length}>
          <Download size={18} /> Exportar CSV
        </button>
      </header>
      <p className="kardex-demo">Vista de demostración · Almacén Central · Datos del 05/08/2026 al 04/09/2026</p>

      <section className="kardex-summary" aria-label="Resumen de la consulta">
        {[
          { label: 'Movimientos encontrados', valor: movimientos.length, Icon: ListFilter },
          { label: 'Movimientos de entrada', valor: movimientos.filter((m) => m.tipo === 'Entrada').length, Icon: ArrowDownToLine },
          { label: 'Movimientos de salida', valor: movimientos.filter((m) => m.tipo === 'Salida').length, Icon: ArrowUpFromLine },
        ].map(({ label, valor, Icon }) => <article className="maestro-table-card kardex-stat" key={label}>
          <Icon size={22} aria-hidden="true" /><div><span>{label}</span><strong>{valor}</strong></div>
        </article>)}
      </section>

      <section className="maestro-filter-card kardex-panel" aria-labelledby="kardex-filtros">
        <h2 id="kardex-filtros">Filtrar movimientos</h2>
        <div className="kardex-filters">
          <label>Producto<select className="form-select maestro-control" value={filtros.producto} onChange={(e) => cambiarFiltro('producto', e.target.value)}>
            <option value="">Todos los productos</option>
            {productosKardex.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select></label>
          <label>Tipo de movimiento<select className="form-select maestro-control" value={filtros.tipo} onChange={(e) => cambiarFiltro('tipo', e.target.value)}>
            <option value="">Todos los movimientos</option><option>Entrada</option><option>Salida</option>
          </select></label>
          <label>Desde<input className="form-control maestro-control" type="date" value={filtros.desde} onChange={(e) => cambiarFiltro('desde', e.target.value)} aria-invalid={rangoInvalido} aria-describedby={rangoInvalido ? 'error-fechas' : undefined} /></label>
          <label>Hasta<input className="form-control maestro-control" type="date" value={filtros.hasta} onChange={(e) => cambiarFiltro('hasta', e.target.value)} aria-invalid={rangoInvalido} aria-describedby={rangoInvalido ? 'error-fechas' : undefined} /></label>
          <button className="btn maestro-btn-secondary" onClick={() => { setFiltros(filtrosIniciales); setPage(1) }}>Limpiar filtros</button>
        </div>
        {rangoInvalido && <p id="error-fechas" className="text-danger mt-3 mb-0" role="alert">La fecha desde debe ser anterior o igual a la fecha hasta.</p>}
      </section>

      <section className="maestro-table-card kardex-panel" aria-labelledby="stock-actual">
        <h2 id="stock-actual"><Boxes size={20} aria-hidden="true" /> Stock actual por producto</h2>
        <p className="kardex-note">Saldo al 04/09/2026. Los filtros de fecha y movimiento no modifican el stock actual.</p>
        <div className="kardex-stock-grid">{productos.map((p) => <article className="kardex-stock" key={p.id}>
          <span>{p.nombre}<small>{p.id}</small></span><strong>{p.stock} <small>{p.unidad}</small></strong>
        </article>)}</div>
      </section>

      <section className="maestro-table-card kardex-panel" aria-labelledby="movimientos-titulo">
        <h2 id="movimientos-titulo">Kardex de movimientos</h2>
        <p className="kardex-note" aria-live="polite">{movimientos.length} movimientos · Más recientes primero. El stock corresponde al saldo después de cada movimiento.</p>
        <div className="table-responsive">
          <table className="table align-middle kardex-table">
            <caption className="visually-hidden">Entradas, salidas y saldo por producto del Almacén Central</caption>
            <thead><tr>{['Producto', 'Fecha', 'Tipo de movimiento', 'Ingreso', 'Salida', 'Stock', 'Responsable'].map((titulo) => <th scope="col" key={titulo}>{titulo}</th>)}</tr></thead>
            <tbody>{movimientos.slice((page - 1) * pageSize, page * pageSize).map((m) => {
              const producto = productosKardex.find((p) => p.id === m.productoId)!
              return <tr key={m.id}>
                <td><strong>{producto.nombre}</strong><small>{producto.id} · {producto.unidad}</small></td>
                <td>{fechaVisible(m.fecha)}<small>{m.id}</small></td>
                <td><span className={`kardex-badge ${m.tipo === 'Entrada' ? 'kardex-badge--entrada' : 'kardex-badge--salida'}`}>{m.tipo === 'Entrada' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}{m.tipo}</span></td>
                <td className="kardex-number">{m.ingreso || '—'}</td><td className="kardex-number">{m.salida || '—'}</td><td className="kardex-number"><strong>{m.stock}</strong></td><td>{m.responsable}</td>
              </tr>
            })}</tbody>
          </table>
        </div>
        {!movimientos.length && <div className="kardex-empty" role="status"><ListFilter size={30} /><h3>No hay movimientos para mostrar</h3><p>{rangoInvalido ? 'Corrige el rango de fechas para consultar el Kardex.' : 'Prueba con otro producto o ajusta los filtros de la consulta.'}</p></div>}
        <TablePagination totalItems={movimientos.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
      </section>
    </div>
  )
}
