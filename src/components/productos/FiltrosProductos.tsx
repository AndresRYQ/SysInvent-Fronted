import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

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

const opcionesEstado = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function FiltrosProductos({ valores, tiposProducto, categorias, onChange, onBuscar, onLimpiar }: Props) {
  const opcionesTipoProducto = tiposProducto.map((tipo) => ({ value: String(tipo.id), label: tipo.nombre }))
  const opcionesCategoria = categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nombre }))

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
            <Select
              inputId="filtroTipoProducto"
              classNamePrefix="maestro-select"
              options={opcionesTipoProducto}
              value={opcionesTipoProducto.find((opcion) => opcion.value === valores.tipoProductoId) ?? null}
              onChange={(opcion) => onChange('tipoProductoId', opcion?.value ?? '')}
              placeholder="Todos"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <label className="form-label maestro-label" htmlFor="filtroCategoriaProducto">Categoría</label>
            <Select
              inputId="filtroCategoriaProducto"
              classNamePrefix="maestro-select"
              options={opcionesCategoria}
              value={opcionesCategoria.find((opcion) => opcion.value === valores.categoriaId) ?? null}
              onChange={(opcion) => onChange('categoriaId', opcion?.value ?? '')}
              placeholder="Todas"
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <label className="form-label maestro-label" htmlFor="filtroEstadoProducto">Estado</label>
            <Select
              inputId="filtroEstadoProducto"
              classNamePrefix="maestro-select"
              options={opcionesEstado}
              value={opcionesEstado.find((opcion) => opcion.value === valores.estado) ?? null}
              onChange={(opcion) => onChange('estado', opcion?.value ?? '')}
              placeholder="Todos"
              isClearable
              isSearchable={false}
              menuPortalTarget={document.body}
              styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>
          <div className="col-12"><div className="maestro-filter-actions">
            <button type="button" className="btn btn-maestro-secondary" onClick={onLimpiar}><RotateCcw size={18} />Limpiar</button>
            <button type="submit" className="btn btn-maestro-primary"><Search size={18} />Buscar</button>
          </div></div>
        </form>
      </div>
    </section>
  )
}
