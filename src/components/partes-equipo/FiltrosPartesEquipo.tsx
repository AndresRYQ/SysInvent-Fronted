import {
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

export interface FiltrosPartesEquipoValores {
  busqueda: string
  estado: string
}

interface FiltrosPartesEquipoProps {
  valores: FiltrosPartesEquipoValores
  onChange: (
    campo: keyof FiltrosPartesEquipoValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosPartesEquipo({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosPartesEquipoProps) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3">
          <span className="maestro-kicker">
            <Filter size={16} />
            Filtros
          </span>
        </div>

        <form
          className="row g-3"
          onSubmit={(event) => {
            event.preventDefault()
            onBuscar()
          }}
        >
          <div className="col-12 col-lg-8">
            <label
              className="form-label maestro-label"
              htmlFor="buscarParteEquipo"
            >
              Código o nombre
            </label>

            <input
              id="buscarParteEquipo"
              className="form-control maestro-control"
              type="text"
              value={valores.busqueda}
              placeholder="Ej. MOT-001 o Motor principal"
              onChange={(event) =>
                onChange(
                  'busqueda',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="estadoParteEquipo"
            >
              Estado
            </label>

            <div className="maestro-select-wrap">
              <select
                id="estadoParteEquipo"
                className="form-select maestro-control maestro-select-control"
                value={valores.estado}
                onChange={(event) =>
                  onChange(
                    'estado',
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Todos
                </option>

                <option value="activo">
                  Activo
                </option>

                <option value="inactivo">
                  Inactivo
                </option>
              </select>

              <ChevronDown size={16} />
            </div>
          </div>

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
                type="submit"
                className="btn maestro-btn-primary maestro-filter-btn"
              >
                <Search size={18} />
                Buscar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}