import { useMemo, useState } from 'react'
import { Download, FileInput, XCircle } from 'lucide-react'
import { FiltrosReporteIngresos, type FiltrosReporteIngresosValores } from '../../components/reportes/ingresos/FiltrosReporteIngresos'
import { ResumenReporteIngresos } from '../../components/reportes/ingresos/ResumenReporteIngresos'
import { TablaReporteIngresos } from '../../components/reportes/ingresos/TablaReporteIngresos'
import type { ReporteIngreso } from '../../types/reporteIngreso'
import './ReporteIngresosPage.css'

const INGRESOS: ReporteIngreso[] = [
  { id: 'ING-001', numeroDocumento: 'FC-2026-0001', fecha: '2026-08-05', proveedor: 'Ferretería Industrial SAC', tipoComprobante: 'Factura', totalItems: 4, unidades: 50, responsable: 'Carlos Mendoza', estado: 'Registrado' },
  { id: 'ING-002', numeroDocumento: 'GR-2026-0002', fecha: '2026-08-08', proveedor: 'Distribuidora Lima Norte', tipoComprobante: 'Guía de remisión', totalItems: 3, unidades: 100, responsable: 'María López', estado: 'Registrado' },
  { id: 'ING-003', numeroDocumento: 'FC-2026-0003', fecha: '2026-08-10', proveedor: 'Importaciones del Sur', tipoComprobante: 'Factura', totalItems: 5, unidades: 200, responsable: 'Carlos Mendoza', estado: 'Registrado' },
  { id: 'ING-004', numeroDocumento: 'BO-2026-0004', fecha: '2026-08-12', proveedor: 'Comercial Huaral EIRL', tipoComprobante: 'Boleta', totalItems: 2, unidades: 75, responsable: 'Ana Torres', estado: 'Registrado' },
  { id: 'ING-005', numeroDocumento: 'FC-2026-0005', fecha: '2026-08-15', proveedor: 'Ferretería Industrial SAC', tipoComprobante: 'Factura', totalItems: 6, unidades: 500, responsable: 'Carlos Mendoza', estado: 'Anulado' },
  { id: 'ING-006', numeroDocumento: 'GR-2026-0006', fecha: '2026-08-18', proveedor: 'Distribuidora Lima Norte', tipoComprobante: 'Guía de remisión', totalItems: 2, unidades: 30, responsable: 'María López', estado: 'Registrado' },
  { id: 'ING-007', numeroDocumento: 'FC-2026-0007', fecha: '2026-08-22', proveedor: 'Importaciones del Sur', tipoComprobante: 'Factura', totalItems: 4, unidades: 120, responsable: 'Jorge Ramírez', estado: 'Registrado' },
  { id: 'ING-008', numeroDocumento: 'FC-2026-0008', fecha: '2026-08-25', proveedor: 'Comercial Huaral EIRL', tipoComprobante: 'Factura', totalItems: 3, unidades: 64, responsable: 'Ana Torres', estado: 'Registrado' },
]

const FILTROS_INICIALES: FiltrosReporteIngresosValores = { fechaDesde: '', fechaHasta: '', proveedor: '', tipoComprobante: '' }

function coincideFiltro(ingreso: ReporteIngreso, filtros: FiltrosReporteIngresosValores) {
  return (!filtros.fechaDesde || ingreso.fecha >= filtros.fechaDesde)
    && (!filtros.fechaHasta || ingreso.fecha <= filtros.fechaHasta)
    && (!filtros.proveedor || ingreso.proveedor === filtros.proveedor)
    && (!filtros.tipoComprobante || ingreso.tipoComprobante === filtros.tipoComprobante)
}

export function ReporteIngresosPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [aplicados, setAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState<ReporteIngreso | null>(null)
  const filtrados = useMemo(() => INGRESOS.filter((ingreso) => coincideFiltro(ingreso, aplicados)), [aplicados])
  const paginados = filtrados.slice((page - 1) * pageSize, page * pageSize)
  const totalUnidades = filtrados.reduce((total, ingreso) => total + ingreso.unidades, 0)
  const proveedores = new Set(filtrados.map((ingreso) => ingreso.proveedor)).size

  return <main className="dashboard-shell income-report-page-shell"><div className="income-report-page">
    <header className="income-report-hero"><div><span className="income-report-eyebrow"><FileInput size={15} /> Módulo de reportes / Ingresos</span><h1>Reporte de ingresos</h1><p>Consulta y filtra las entradas de productos registradas en el almacén.</p></div><button type="button" className="income-report-button income-report-button--export"><Download size={17} /> Exportar reporte</button></header>
    <ResumenReporteIngresos totalIngresos={filtrados.length} ingresosRegistrados={filtrados.filter((ingreso) => ingreso.estado === 'Registrado').length} proveedores={proveedores} unidades={totalUnidades} />
    <FiltrosReporteIngresos valores={filtros} proveedores={Array.from(new Set(INGRESOS.map((ingreso) => ingreso.proveedor)))} tiposComprobante={Array.from(new Set(INGRESOS.map((ingreso) => ingreso.tipoComprobante)))} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(FILTROS_INICIALES); setAplicados(FILTROS_INICIALES); setPage(1) }} />
    <TablaReporteIngresos registros={paginados} totalItems={filtrados.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} onVerDetalle={setIngresoSeleccionado} />
    {ingresoSeleccionado && <div className="income-report-detail" role="dialog" aria-modal="true"><div className="income-report-detail__card"><button type="button" className="income-report-detail__close" aria-label="Cerrar detalle" onClick={() => setIngresoSeleccionado(null)}><XCircle size={20} /></button><span className="income-report-eyebrow">Detalle de ingreso</span><h2>{ingresoSeleccionado.numeroDocumento}</h2><p>Ingreso registrado por <strong>{ingresoSeleccionado.responsable}</strong> para el proveedor <strong>{ingresoSeleccionado.proveedor}</strong>.</p><div className="income-report-detail__grid"><span>Fecha<strong>{ingresoSeleccionado.fecha}</strong></span><span>Comprobante<strong>{ingresoSeleccionado.tipoComprobante}</strong></span><span>Ítems<strong>{ingresoSeleccionado.totalItems}</strong></span><span>Unidades<strong>{ingresoSeleccionado.unidades}</strong></span></div></div></div>}
  </div></main>
}