import { CalendarDays, Eye, FileInput, PackageCheck } from 'lucide-react'
import type { ReporteIngreso } from '../../../types/reporteIngreso'

interface TablaReporteIngresosProps {
  registros: ReporteIngreso[]
  totalItems: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onVerDetalle: (ingreso: ReporteIngreso) => void
}

export function TablaReporteIngresos({
  registros,
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onVerDetalle,
}: TablaReporteIngresosProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  return (
    <section className="income-report-table-card">
      <div className="income-report-table-card__header">
        <div><span className="income-report-kicker"><FileInput size={16} /> Listado de ingresos</span><p>Entradas de productos registradas en el almacén.</p></div>
        <span className="income-report-total"><PackageCheck size={16} /> {totalItems} registros</span>
      </div>
      <div className="table-responsive">
        <table className="income-report-table">
          <thead><tr><th>N° documento</th><th>Fecha</th><th>Proveedor</th><th>Comprobante</th><th className="text-center">Total de ítems</th><th className="text-center">Unidades</th><th>Usuario responsable</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
          <tbody>
            {registros.length > 0 ? registros.map((ingreso) => (
              <tr key={ingreso.id}>
                <td><strong className="income-report-code">{ingreso.numeroDocumento}</strong></td>
                <td><span className="income-report-date"><CalendarDays size={14} />{new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(`${ingreso.fecha}T12:00:00`))}</span></td>
                <td><strong>{ingreso.proveedor}</strong></td>
                <td>{ingreso.tipoComprobante}</td>
                <td className="text-center">{ingreso.totalItems}</td>
                <td className="text-center"><strong>{ingreso.unidades}</strong></td>
                <td>{ingreso.responsable}</td>
                <td><span className={`income-report-status income-report-status--${ingreso.estado === 'Registrado' ? 'success' : 'danger'}`}>{ingreso.estado}</span></td>
                <td><button type="button" className="income-report-icon-button" aria-label={`Ver detalle de ${ingreso.numeroDocumento}`} onClick={() => onVerDetalle(ingreso)}><Eye size={17} /></button></td>
              </tr>
            )) : <tr><td colSpan={9}><div className="income-report-empty"><FileInput size={30} /><strong>No se encontraron ingresos</strong><span>Prueba cambiando los filtros de consulta.</span></div></td></tr>}
          </tbody>
        </table>
      </div>
      {totalItems > 0 && <div className="income-report-pagination"><label>Filas <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}><option value={8}>8</option><option value={12}>12</option><option value={20}>20</option></select></label><span>{(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} de {totalItems}</span><div><button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Siguiente</button></div></div>}
    </section>
  )
}