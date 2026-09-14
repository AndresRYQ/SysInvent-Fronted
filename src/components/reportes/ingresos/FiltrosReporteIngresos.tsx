import { Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosReporteIngresosValores {
  fechaDesde: string
  fechaHasta: string
  proveedor: string
  tipoComprobante: string
}

interface FiltrosReporteIngresosProps {
  valores: FiltrosReporteIngresosValores
  proveedores: string[]
  tiposComprobante: string[]
  onChange: (campo: keyof FiltrosReporteIngresosValores, valor: string) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosReporteIngresos({
  valores,
  proveedores,
  tiposComprobante,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosReporteIngresosProps) {
  return (
    <section className="income-report-filter">
      <div className="income-report-filter__heading">
        <span className="income-report-kicker"><Filter size={16} /> Criterios de consulta</span>
        <span>Filtra las entradas registradas por periodo y proveedor</span>
      </div>
      <form className="income-report-filter__grid" onSubmit={(event) => { event.preventDefault(); onBuscar() }}>
        <label><span>Fecha desde</span><input type="date" value={valores.fechaDesde} onChange={(event) => onChange('fechaDesde', event.target.value)} /></label>
        <label><span>Fecha hasta</span><input type="date" value={valores.fechaHasta} onChange={(event) => onChange('fechaHasta', event.target.value)} /></label>
        <label><span>Proveedor</span><select value={valores.proveedor} onChange={(event) => onChange('proveedor', event.target.value)}><option value="">Todos los proveedores</option>{proveedores.map((proveedor) => <option key={proveedor} value={proveedor}>{proveedor}</option>)}</select></label>
        <label><span>Tipo de comprobante</span><select value={valores.tipoComprobante} onChange={(event) => onChange('tipoComprobante', event.target.value)}><option value="">Todos los comprobantes</option>{tiposComprobante.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}</select></label>
        <div className="income-report-filter__actions"><button type="button" className="income-report-button income-report-button--light" onClick={onLimpiar}><RotateCcw size={17} /> Limpiar</button><button type="submit" className="income-report-button income-report-button--primary"><Search size={17} /> Consultar reporte</button></div>
      </form>
    </section>
  )
}