import { Filter, RotateCcw, Search } from 'lucide-react'

export interface OpcionFiltroProducto {
  id: string | number
  nombre: string
}

export interface FiltrosProductosValores {
  busqueda: string
  tipoProductoId: string
  categoriaId: string
  estado: string
}

interface Props {
  valores: FiltrosProductosValores
  tiposProducto: OpcionFiltroProducto[]
  categorias: OpcionFiltroProducto[]
  onChange: (campo: keyof FiltrosProductosValores, valor: string) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosProductos({ valores, tiposProducto, categorias, onChange, onBuscar, onLimpiar }: Props) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3"><span className="maestro-kicker"><Filter size={16} />Filtros de productos</span></div>
        <form className="row g-3" onSubmit={(event) => { event.preventDefault(); onBuscar() }}>
          <div className="col-12 col-xl-6">
            <label className="form-label maestro-label" htmlFor="buscarProducto">Código o nombre</label>
            <input id="buscarProducto" className="form-control maestro-control" value={valores.busqueda} placeholder="Buscar producto" onChange={(event) => onChange('busqueda', event.target.value)} />
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <label className="form-label maestro-label" htmlFor="filtroTipoProducto">Tipo</label>
            <select id="filtroTipoProducto" className="form-select maestro-control" value={valores.tipoProductoId} onChange={(event) => onChange('tipoProductoId', event.target.value)}>
              <option value="">Todos</option>
              {tiposProducto.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <label className="form-label maestro-label" htmlFor="filtroCategoriaProducto">Categoría</label>
            <select id="filtroCategoriaProducto" className="form-select maestro-control" value={valores.categoriaId} onChange={(event) => onChange('categoriaId', event.target.value)}>
              <option value="">Todas</option>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <label className="form-label maestro-label" htmlFor="filtroEstadoProducto">Estado</label>
            <select id="filtroEstadoProducto" className="form-select maestro-control" value={valores.estado} onChange={(event) => onChange('estado', event.target.value)}>
              <option value="">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="col-12"><div className="maestro-filter-actions">
            <button type="button" className="btn maestro-btn-secondary maestro-filter-btn" onClick={onLimpiar}><RotateCcw size={18} />Limpiar</button>
            <button type="submit" className="btn maestro-btn-primary maestro-filter-btn"><Search size={18} />Buscar</button>
          </div></div>
        </form>
      </div>
    </section>
  )
}
