import { useState } from 'react'
import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosDestinosValores {
  nombre: string
  estado: string
}

interface FiltrosDestinosProps {
  valores: FiltrosDestinosValores
  onChange: (campo: keyof FiltrosDestinosValores, valor: string) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosDestinos({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosDestinosProps) {
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
            <label className="form-label maestro-label" htmlFor="nombreDestino">
              Nombre de destino
            </label>

            <input
              id="nombreDestino"
              className="form-control maestro-control"
              type="text"
              value={valores.nombre}
              placeholder="Ej. Almacén Central, Planta, Sucursal"
              onChange={(event) => onChange('nombre', event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label maestro-label" htmlFor="estadoDestino">
              Estado
            </label>

            <div
              className={`maestro-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoDestino"
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
