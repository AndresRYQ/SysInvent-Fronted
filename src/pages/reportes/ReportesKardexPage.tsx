import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Boxes, Download, ListFilter } from 'lucide-react'
import Select from 'react-select'
import { Placeholder } from '../../constants/placeholders'
import { TablePagination } from '../../components/ui/TablePagination'
import { DatePickerInput } from '../../components/ui/DatePickerInput'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'
import { useFiltrosReporte } from '../../hooks/useFiltrosReporte'
import {
  obtenerReporteKardexApi,
  type ReporteKardex,
} from '../../services/reportesApiService'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import './ReportesKardexPage.css'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

interface FiltrosKardex {
  producto: string
  tipo: string
  desde: string
  hasta: string
}

const filtrosIniciales: FiltrosKardex = { producto: '', tipo: '', desde: '', hasta: '' }

const REPORTE_VACIO: ReporteKardex = {
  mensaje: '',
  resumen: {
    totalMovimientos: 0,
    movimientosEntrada: 0,
    movimientosSalida: 0,
    cantidadEntrada: 0,
    cantidadSalida: 0,
  },
  movimientos: [],
  stock: [],
}

const opcionesTipo = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SALIDA', label: 'Salida' },
]

const formatoCantidad = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 4 })
const cantidad = (valor: number) => formatoCantidad.format(valor)

export function ReportesKardexPage() {
  const [filtros, setFiltros] = useState<FiltrosKardex>(filtrosIniciales)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reporte, setReporte] = useState<ReporteKardex>(REPORTE_VACIO)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const { catalogos, errorCatalogos } = useFiltrosReporte()

  // Se permite consultar un solo día (desde = hasta), igual que el backend.
  const rangoInvalido = Boolean(filtros.desde && filtros.hasta && filtros.desde > filtros.hasta)

  useEffect(() => {
    if (rangoInvalido) return
    let activo = true

    obtenerReporteKardexApi({
      productoId: filtros.producto,
      tipoMovimiento: filtros.tipo,
      desde: filtros.desde,
      hasta: filtros.hasta,
    })
      .then((resultado) => {
        if (!activo) return
        setReporte(resultado)
        setErrorCarga(null)
      })
      .catch((error: unknown) => {
        if (!activo) return
        setReporte(REPORTE_VACIO)
        setErrorCarga(error instanceof Error ? error.message : 'No se pudo generar el reporte de Kardex.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => { activo = false }
  }, [filtros, rangoInvalido])

  const opcionesProducto = useMemo(
    () => catalogos.productos.map((producto) => ({
      value: producto.id,
      label: producto.codigo ? `${producto.codigo} · ${producto.nombre}` : producto.nombre,
    })),
    [catalogos.productos],
  )

  const movimientos = rangoInvalido ? [] : reporte.movimientos
  const movimientosPagina = movimientos.slice((page - 1) * pageSize, page * pageSize)

  const cambiarFiltro = (campo: keyof FiltrosKardex, valor: string) => {
    const siguientes = { ...filtros, [campo]: valor }
    const rangoValido = !(siguientes.desde && siguientes.hasta && siguientes.desde > siguientes.hasta)
    // Solo se consulta (y se muestra la carga) cuando el rango es válido.
    if (rangoValido) setCargando(true)
    setFiltros(siguientes)
    setPage(1)
  }

  const limpiar = () => {
    setCargando(true)
    setFiltros(filtrosIniciales)
    setPage(1)
  }

  const exportar = () => {
    const filas = movimientos.map((m) => [
      m.numeroDocumento, m.codigoProducto, m.producto, m.unidadMedida, `${m.fecha} ${m.hora}`,
      m.descripcionMovimiento, m.entrada, m.salida, m.saldoNuevo, m.responsable,
    ])
    const csv = [['Documento', 'Código', 'Producto', 'Unidad', 'Fecha', 'Tipo de movimiento', 'Ingreso', 'Salida', 'Stock tras movimiento', 'Responsable'], ...filas]
      .map((fila) => fila.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' }))
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = 'reporte-kardex.csv'
    enlace.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const mensajeVacio = rangoInvalido
    ? 'Corrige el rango de fechas para consultar el Kardex.'
    : errorCarga
      ? 'No se pudo obtener la información. Intenta nuevamente.'
      : reporte.mensaje || 'Prueba con otro producto o ajusta los filtros de la consulta.'

  return (
    <div className="dashboard-shell maestro-page-shell kardex-page">
      <PageLoadingOverlay visible={cargando} mensaje="Generando reporte de Kardex..." />
      <header className="maestro-topbar kardex-heading">
        <div className="maestro-topbar__copy">
          <span className="maestro-kicker">Reportes / Kardex</span>
          <h1>Reporte de Kardex</h1>
          <p>Consulta las entradas, salidas y existencias de tus productos.</p>
        </div>
        <button className="btn btn-maestro-primary" onClick={exportar} disabled={!movimientos.length}>
          <Download size={18} /> Exportar CSV
        </button>
      </header>

      {errorCarga && <div className="alert alert-danger mt-3" role="alert">{errorCarga}</div>}
      {errorCatalogos && <div className="alert alert-warning mt-3" role="alert">{errorCatalogos}</div>}

      <section className="kardex-summary mt-3" aria-label="Resumen de la consulta">
        {[
          { label: 'Movimientos encontrados', valor: reporte.resumen.totalMovimientos, detalle: '', Icon: ListFilter },
          { label: 'Movimientos de entrada', valor: reporte.resumen.movimientosEntrada, detalle: `${cantidad(reporte.resumen.cantidadEntrada)} unidades`, Icon: ArrowDownToLine },
          { label: 'Movimientos de salida', valor: reporte.resumen.movimientosSalida, detalle: `${cantidad(reporte.resumen.cantidadSalida)} unidades`, Icon: ArrowUpFromLine },
        ].map(({ label, valor, detalle, Icon }) => <article className="table-card kardex-stat" key={label}>
          <Icon size={22} aria-hidden="true" /><div><span>{label}</span><strong>{rangoInvalido ? 0 : valor}</strong>{detalle && !rangoInvalido && <span>{detalle}</span>}</div>
        </article>)}
      </section>

      <section className="maestro-filter-card kardex-panel" aria-labelledby="kardex-filtros">
        <h2 id="kardex-filtros">Filtrar movimientos</h2>
        <div className="kardex-filters">
          <label>Producto<Select inputId="kardexProducto" classNamePrefix="maestro-select" options={opcionesProducto} value={opcionesProducto.find((option) => option.value === filtros.producto) ?? null} onChange={(option) => cambiarFiltro('producto', option?.value ?? '')} placeholder={Placeholder.Seleccionar} noOptionsMessage={() => 'No hay productos registrados'} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} /></label>
          <label>Tipo de movimiento<Select inputId="kardexTipoMovimiento" classNamePrefix="maestro-select" options={opcionesTipo} value={opcionesTipo.find((option) => option.value === filtros.tipo) ?? null} onChange={(option) => cambiarFiltro('tipo', option?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable={false} menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} /></label>
          <label>Fecha desde<DatePickerInput id="kardexDesde" value={filtros.desde} maxValue={filtros.hasta} onChange={(value) => cambiarFiltro('desde', value)} /></label>
          <label>Fecha hasta<DatePickerInput id="kardexHasta" value={filtros.hasta} minValue={filtros.desde} onChange={(value) => cambiarFiltro('hasta', value)} /></label>
          <button className="btn btn-maestro-info" onClick={limpiar}>Limpiar filtros</button>
        </div>
        {rangoInvalido && <p id="error-fechas" className="text-danger mt-3 mb-0" role="alert">La fecha desde no puede ser posterior a la fecha hasta.</p>}
      </section>

      <section className="table-card kardex-panel" aria-labelledby="stock-actual">
        <h2 id="stock-actual"><Boxes size={20} aria-hidden="true" /> Stock actual por producto</h2>
        <p className="kardex-note">Saldo actual del inventario. Los filtros de fecha y movimiento no modifican el stock actual.</p>
        {reporte.stock.length === 0
          ? <div className="kardex-empty" role="status"><Boxes size={30} /><h3>No hay productos para mostrar</h3><p>Registra productos activos para consultar su stock.</p></div>
          : <div className="kardex-stock-grid">{reporte.stock.map((p) => <article className="kardex-stock" key={p.productoId}>
            <span>{p.nombre}<small>{p.codigo}{p.requiereReposicion && ' · Requiere reposición'}</small></span><strong>{cantidad(p.stockActual)} <small>{p.unidadMedida}</small></strong>
          </article>)}</div>}
      </section>

      <section className="table-card kardex-panel" aria-labelledby="movimientos-titulo">
        <h2 id="movimientos-titulo">Kardex de movimientos</h2>
        <p className="kardex-note" aria-live="polite">{movimientos.length} movimientos · Más recientes primero. El stock corresponde al saldo después de cada movimiento.</p>
        <div className="table-responsive">
          <table className="table align-middle kardex-table">
            <caption className="visually-hidden">Entradas, salidas y saldo por producto</caption>
            <thead><tr>{['Producto', 'Fecha', 'Tipo de movimiento', 'Documento', 'Ingreso', 'Salida', 'Stock', 'Responsable'].map((titulo) => <th scope="col" key={titulo}>{titulo}</th>)}</tr></thead>
            <tbody>{movimientosPagina.map((m) => <tr key={m.id}>
              <td><strong>{m.producto}</strong><small>{m.codigoProducto}{m.unidadMedida && ` · ${m.unidadMedida}`}</small></td>
              <td>{m.fecha}<small>{m.hora}</small></td>
              <td><span className={`kardex-badge ${m.naturaleza === 'ENTRADA' ? 'kardex-badge--entrada' : 'kardex-badge--salida'}`}>{m.naturaleza === 'ENTRADA' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}{m.descripcionMovimiento}</span></td>
              <td>{m.numeroDocumento}</td>
              <td className="kardex-number">{m.entrada ? cantidad(m.entrada) : '—'}</td><td className="kardex-number">{m.salida ? cantidad(m.salida) : '—'}</td><td className="kardex-number"><strong>{cantidad(m.saldoNuevo)}</strong></td><td>{m.responsable}</td>
            </tr>)}</tbody>
          </table>
        </div>
        {!movimientos.length && !cargando && <div className="kardex-empty" role="status"><ListFilter size={30} /><h3>No hay movimientos para mostrar</h3><p>{mensajeVacio}</p></div>}
        <TablePagination totalItems={movimientos.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
      </section>
    </div>
  )
}
