import { ClipboardList, Eye, PackageCheck } from 'lucide-react'
import type { ReporteVale } from '../../../types/reporteVale'

interface TablaReporteValesProps {
  registros: ReporteVale[]
  totalItems: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onVerDetalle: (vale: ReporteVale) => void
}

const ESTADO_CLASE: Record<ReporteVale['estado'], string> = {
  Atendido: 'report-status report-status--success',
  Pendiente: 'report-status report-status--warning',
  Anulado: 'report-status report-status--danger',
}

export function TablaReporteVales({
  registros,
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onVerDetalle,
}: TablaReporteValesProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <section className="vale-report-table-card">
      <div className="vale-report-table-card__header">
        <div><span className="report-kicker"><ClipboardList size={16} /> Detalle de vales</span><p>Resumen de salidas de productos por centro de costo y destino.</p></div>
        <span className="report-total-badge"><PackageCheck size={16} /> {totalItems} registros</span>
      </div>
      <div className="table-responsive">
        <table className="vale-report-table">
          <thead><tr><th>Vale</th><th>Fecha</th><th>Solicitante</th><th>Centro de costo</th><th>Destino</th><th className="text-center">Productos</th><th className="text-center">Unidades</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
          <tbody>
            {registros.length > 0 ? registros.map((vale) => (
              <tr key={vale.id}>
                <td><strong className="report-code">{vale.id}</strong></td>
                <td>{new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${vale.fecha}T12:00:00`))}</td>
                <td><strong>{vale.solicitante}</strong></td>
                <td>{vale.centroCosto}</td>
                <td>{vale.destino}</td>
                <td className="text-center">{vale.productos}</td>
                <td className="text-center"><strong>{vale.unidades}</strong></td>
                <td><span className={ESTADO_CLASE[vale.estado]}>{vale.estado}</span></td>
                <td><button type="button" className="report-icon-button" aria-label={`Ver detalle de ${vale.id}`} onClick={() => onVerDetalle(vale)}><Eye size={17} /></button></td>
              </tr>
            )) : <tr><td colSpan={9}><div className="report-empty"><ClipboardList size={30} /><strong>No se encontraron vales</strong><span>Prueba cambiando los filtros de consulta.</span></div></td></tr>}
          </tbody>
        </table>
      </div>
      {totalItems > 0 && <div className="report-pagination">
        <label>Filas <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}><option value={8}>8</option><option value={12}>12</option><option value={20}>20</option></select></label>
        <span>{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} de {totalItems}</span>
        <div className="report-pagination__buttons"><button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Siguiente</button></div>
      </div>}
    </section>
  )
}