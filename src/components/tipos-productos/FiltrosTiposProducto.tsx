import { useState } from 'react'
import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosTiposProductoValores {
  nombre: string
  estado: string
}

interface FiltrosTiposProductoProps {
  valores: FiltrosTiposProductoValores
  onChange: (
    campo: keyof FiltrosTiposProductoValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosTiposProducto({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosTiposProductoProps) {
  const [estadoAbierto, setEstadoAbierto] = useState(false)

  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3 p-lg-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          <div>
            <span className="maestro-kicker">
              <Filter size={16} />
              Filtros
            </span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <label className="form-label maestro-label" htmlFor="nombreTipoProducto">
              Nombre de tipo de producto
            </label>

            <input
              id="nombreTipoProducto"
              className="form-control maestro-control"
              type="text"
              value={valores.nombre}
              placeholder="Ej. Insumo, Producto terminado, Material"
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label maestro-label" htmlFor="estadoTipoProducto">
              Estado
            </label>

            <div
              className={`maestro-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoTipoProducto"
                className="form-select maestro-control maestro-select-control"
                value={valores.estado}
                onMouseDown={() => setEstadoAbierto(true)}
                onKeyDown={() => setEstadoAbierto(true)}
                onFocus={() => setEstadoAbierto(true)}
                onBlur={() => setEstadoAbierto(false)}
                onChange={(event) => {
                  onChange('estado', event.target.value)
                  setEstadoAbierto(false)
                }}
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

        </div>

        <div className="row g-3 mt-1">
          <div className="col-12">
            <div className="maestro-filter-actions">
              <button
                type="button"
                className="btn maestro-btn-secondary maestro-filter-btn"
                onClick={onLimpiar}
              >
                <RotateCcw size={18} />
                Limpiar
              </button>
              
              <button
                type="button"
                className="btn maestro-btn-primary maestro-filter-btn"
                onClick={onBuscar}
              >
                <Search size={18} />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
