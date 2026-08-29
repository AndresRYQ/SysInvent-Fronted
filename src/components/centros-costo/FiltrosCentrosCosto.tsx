import { useState } from 'react'
import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosCentrosCostoValores {
  nombre: string
  estado: string
}

interface FiltrosCentrosCostoProps {
  valores: FiltrosCentrosCostoValores
  onChange: (
    campo: keyof FiltrosCentrosCostoValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosCentrosCosto({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosCentrosCostoProps) {
  const [estadoAbierto, setEstadoAbierto] = useState(false)

  return (
    <section className="centros-filter-card card border-0 shadow-sm">
      <div className="card-body p-3 p-lg-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          <div>
            <span className="centros-kicker">
              <Filter size={16} />
              Filtros
            </span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <label className="form-label centros-label" htmlFor="nombreCentroCosto">
              Nombre de centro de costo
            </label>

            <input
              id="nombreCentroCosto"
              className="form-control centros-control"
              type="text"
              value={valores.nombre}
              placeholder="Ej. Producción, Mantenimiento, Administración"
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label centros-label" htmlFor="estadoCentroCosto">
              Estado
            </label>

            <div
              className={`centros-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoCentroCosto"
                className="form-select centros-control centros-select-control"
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
            <div className="centros-filter-actions">
              <button
                type="button"
                className="btn centros-btn-secondary centros-filter-btn"
                onClick={onLimpiar}
              >
                <RotateCcw size={18} />
                Limpiar
              </button>
              
              <button
                type="button"
                className="btn centros-btn-primary centros-filter-btn"
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
