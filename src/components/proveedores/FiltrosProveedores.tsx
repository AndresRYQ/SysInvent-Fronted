import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

export interface FiltrosProveedoresValores {
  busqueda: string
  estado: string
}

interface FiltrosProveedoresProps {
  valores: FiltrosProveedoresValores
  onChange: (
    campo: keyof FiltrosProveedoresValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosProveedores({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosProveedoresProps) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3">
          <span className="maestro-kicker">
            <Filter size={16} />
            Filtros de búsqueda
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
              htmlFor="buscarProveedor"
            >
              RUC o razón social
            </label>

            <input
              id="buscarProveedor"
              className="form-control maestro-control"
              type="text"
              value={valores.busqueda}
              placeholder="Buscar proveedor"
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
              htmlFor="estadoProveedor"
            >
              Estado
            </label>

            <select
              id="estadoProveedor"
              className="form-select maestro-control"
              value={valores.estado}
              onChange={(event) =>
                onChange(
                  'estado',
                  event.target.value,
                )
              }
            >
              <option value="">Todos</option>
              <option value="activo">
                Activo
              </option>
              <option value="inactivo">
                Inactivo
              </option>
            </select>
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