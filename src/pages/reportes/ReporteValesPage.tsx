import { useMemo, useState } from 'react'
import { BarChart3, CheckCircle2, Clock3, Download, FileText, XCircle } from 'lucide-react'
import { FiltrosReporteVales, type FiltrosReporteValesValores } from '../../components/reportes/vales/FiltrosReporteVales'
import { TablaReporteVales } from '../../components/reportes/vales/TablaReporteVales'
import type { ReporteVale } from '../../types/reporteVale'
import './ReporteValesPage.css'

const VALES: ReporteVale[] = [
  { id: 'VC-2026-0087', fecha: '2026-08-26', solicitante: 'María Fernanda López', centroCosto: 'Producción agrícola', destino: 'Fundo Santa Rosa', productos: 4, unidades: 38, estado: 'Atendido' },
  { id: 'VC-2026-0086', fecha: '2026-08-25', solicitante: 'Carlos Mendoza', centroCosto: 'Mantenimiento', destino: 'Taller central', productos: 2, unidades: 8, estado: 'Atendido' },
  { id: 'VC-2026-0085', fecha: '2026-08-25', solicitante: 'Ana Torres', centroCosto: 'Administración', destino: 'Oficina principal', productos: 3, unidades: 15, estado: 'Pendiente' },
  { id: 'VC-2026-0084', fecha: '2026-08-24', solicitante: 'Jorge Ramírez', centroCosto: 'Producción agrícola', destino: 'Fundo La Esperanza', productos: 6, unidades: 74, estado: 'Atendido' },
  { id: 'VC-2026-0083', fecha: '2026-08-23', solicitante: 'Lucía Salazar', centroCosto: 'Logística', destino: 'Almacén secundario', productos: 1, unidades: 12, estado: 'Anulado' },
  { id: 'VC-2026-0082', fecha: '2026-08-22', solicitante: 'Diego Castillo', centroCosto: 'Mantenimiento', destino: 'Taller central', productos: 5, unidades: 29, estado: 'Atendido' },
  { id: 'VC-2026-0081', fecha: '2026-08-21', solicitante: 'Rosa Quispe', centroCosto: 'Producción agrícola', destino: 'Fundo Santa Rosa', productos: 3, unidades: 41, estado: 'Atendido' },
  { id: 'VC-2026-0080', fecha: '2026-08-20', solicitante: 'Pedro Vargas', centroCosto: 'Administración', destino: 'Oficina principal', productos: 2, unidades: 6, estado: 'Pendiente' },
]

const FILTROS_INICIALES: FiltrosReporteValesValores = { fechaDesde: '', fechaHasta: '', centroCosto: '', destino: '', solicitante: '' }

function coincideFiltro(vale: ReporteVale, filtros: FiltrosReporteValesValores) {
  const solicitante = filtros.solicitante.trim().toLowerCase()
  return (!filtros.fechaDesde || vale.fecha >= filtros.fechaDesde)
    && (!filtros.fechaHasta || vale.fecha <= filtros.fechaHasta)
    && (!filtros.centroCosto || vale.centroCosto === filtros.centroCosto)
    && (!filtros.destino || vale.destino === filtros.destino)
    && (!solicitante || vale.solicitante.toLowerCase().includes(solicitante))
}

export function ReporteValesPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [aplicados, setAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [valeSeleccionado, setValeSeleccionado] = useState<ReporteVale | null>(null)
  const filtrados = useMemo(() => VALES.filter((vale) => coincideFiltro(vale, aplicados)), [aplicados])
  const paginados = filtrados.slice((page - 1) * pageSize, page * pageSize)
  const actualizarFiltro = (campo: keyof FiltrosReporteValesValores, valor: string) => setFiltros((actual) => ({ ...actual, [campo]: valor }))
  const totalUnidades = filtrados.reduce((total, vale) => total + vale.unidades, 0)
  const mostrarDetalle = (vale: ReporteVale) => setValeSeleccionado(vale)

  return <main className="dashboard-shell report-page-shell"><div className="report-page">
    <header className="report-page__hero">
      <div><span className="report-eyebrow"><BarChart3 size={15} /> Módulo de reportes / Vales</span><h1>Reporte de vales de consumo</h1><p>Consulta y analiza las salidas de productos según centro de costo y destino.</p></div>
      <button type="button" className="report-button report-button--export"><Download size={17} /> Exportar reporte</button>
    </header>
    <div className="report-summary">
      <article><span className="summary-icon summary-icon--green"><FileText size={20} /></span><div><small>Total de vales</small><strong>{filtrados.length}</strong><span>En el periodo consultado</span></div></article>
      <article><span className="summary-icon summary-icon--blue"><CheckCircle2 size={20} /></span><div><small>Vales atendidos</small><strong>{filtrados.filter((vale) => vale.estado === 'Atendido').length}</strong><span>Salidas completadas</span></div></article>
      <article><span className="summary-icon summary-icon--amber"><Clock3 size={20} /></span><div><small>Por atender</small><strong>{filtrados.filter((vale) => vale.estado === 'Pendiente').length}</strong><span>Requieren seguimiento</span></div></article>
      <article><span className="summary-icon summary-icon--violet"><PackageUnitsIcon /></span><div><small>Unidades entregadas</small><strong>{totalUnidades}</strong><span>Productos retirados</span></div></article>
    </div>
    <FiltrosReporteVales valores={filtros} centrosCosto={Array.from(new Set(VALES.map((vale) => vale.centroCosto)))} destinos={Array.from(new Set(VALES.map((vale) => vale.destino)))} onChange={actualizarFiltro} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(FILTROS_INICIALES); setAplicados(FILTROS_INICIALES); setPage(1) }} />
    <TablaReporteVales registros={paginados} totalItems={filtrados.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} onVerDetalle={mostrarDetalle} />
    {valeSeleccionado && <div className="report-detail" role="dialog" aria-modal="true"><div className="report-detail__card"><button type="button" className="report-detail__close" onClick={() => setValeSeleccionado(null)} aria-label="Cerrar detalle"><XCircle size={20} /></button><span className="report-eyebrow">Detalle de vale</span><h2>{valeSeleccionado.id}</h2><p>{valeSeleccionado.solicitante} registró una salida para <strong>{valeSeleccionado.destino}</strong>.</p><div className="report-detail__grid"><span>Fecha<strong>{valeSeleccionado.fecha}</strong></span><span>Centro de costo<strong>{valeSeleccionado.centroCosto}</strong></span><span>Productos<strong>{valeSeleccionado.productos} productos / {valeSeleccionado.unidades} unidades</strong></span><span>Estado<strong>{valeSeleccionado.estado}</strong></span></div></div></div>}
  </div></main>
}

function PackageUnitsIcon() {
  return <span className="report-package-icon">U</span>
}