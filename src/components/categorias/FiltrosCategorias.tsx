import { useState } from 'react'
import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosCategoriasValores {
  nombre: string
  estado: string
}

interface FiltrosCategoriasProps {
  valores: FiltrosCategoriasValores
  onChange: (
    campo: keyof FiltrosCategoriasValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosCategorias({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosCategoriasProps) {
  const [estadoAbierto, setEstadoAbierto] = useState(false)

  return (
    <section className="categories-filter-card card border-0 shadow-sm">
      <div className="card-body p-3 p-lg-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          <div>
            <span className="categories-kicker">
              <Filter size={16} />
              Filtros
            </span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <label className="form-label categories-label" htmlFor="nombreCategoria">
              Nombre de categoría
            </label>

            <input
              id="nombreCategoria"
              className="form-control categories-control"
              type="text"
              value={valores.nombre}
              placeholder="Ej. Herramientas, Seguridad, Repuestos"
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label categories-label" htmlFor="estadoCategoria">
              Estado
            </label>

            <div
              className={`categories-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoCategoria"
                className="form-select categories-control categories-select-control"
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
            <div className="categories-filter-actions">
              <button
                type="button"
                className="btn categories-btn-secondary categories-filter-btn"
                onClick={onLimpiar}
              >
                <RotateCcw size={18} />
                Limpiar
              </button>
              
              <button
                type="button"
                className="btn categories-btn-primary categories-filter-btn"
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
