import { Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosReporteValesValores {
  fechaDesde: string
  fechaHasta: string
  centroCosto: string
  destino: string
  solicitante: string
}

interface FiltrosReporteValesProps {
  valores: FiltrosReporteValesValores
  centrosCosto: string[]
  destinos: string[]
  onChange: (campo: keyof FiltrosReporteValesValores, valor: string) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosReporteVales({
  valores,
  centrosCosto,
  destinos,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosReporteValesProps) {
  return (
    <section className="vale-report-filter">
      <div className="vale-report-filter__heading">
        <span className="report-kicker"><Filter size={16} /> Criterios de consulta</span>
        <span className="report-filter-hint">Filtra los vales generados por periodo y responsable</span>
      </div>

      <form className="vale-report-filter__grid" onSubmit={(event) => { event.preventDefault(); onBuscar() }}>
        <label className="report-field">
          <span>Fecha desde</span>
          <input type="date" value={valores.fechaDesde} onChange={(event) => onChange('fechaDesde', event.target.value)} />
        </label>
        <label className="report-field">
          <span>Fecha hasta</span>
          <input type="date" value={valores.fechaHasta} onChange={(event) => onChange('fechaHasta', event.target.value)} />
        </label>
        <label className="report-field">
          <span>Centro de costo</span>
          <select value={valores.centroCosto} onChange={(event) => onChange('centroCosto', event.target.value)}>
            <option value="">Todos los centros</option>
            {centrosCosto.map((centro) => <option key={centro} value={centro}>{centro}</option>)}
          </select>
        </label>
        <label className="report-field">
          <span>Destino</span>
          <select value={valores.destino} onChange={(event) => onChange('destino', event.target.value)}>
            <option value="">Todos los destinos</option>
            {destinos.map((destino) => <option key={destino} value={destino}>{destino}</option>)}
          </select>
        </label>
        <label className="report-field report-field--wide">
          <span>Solicitante</span>
          <input value={valores.solicitante} placeholder="Buscar por nombre" onChange={(event) => onChange('solicitante', event.target.value)} />
        </label>
        <div className="report-filter-actions">
          <button type="button" className="report-button report-button--light" onClick={onLimpiar}><RotateCcw size={17} /> Limpiar</button>
          <button type="submit" className="report-button report-button--primary"><Search size={17} /> Consultar reporte</button>
        </div>
      </form>
    </section>
  )
}