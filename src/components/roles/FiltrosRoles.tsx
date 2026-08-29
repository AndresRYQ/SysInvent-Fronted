import { Filter, RotateCcw, Search } from 'lucide-react'

interface FiltrosRolesValores {
  busqueda: string
  estado: string
}

interface FiltrosRolesProps {
  valores: FiltrosRolesValores
  onChange: (campo: keyof FiltrosRolesValores, valor: string) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosRoles({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosRolesProps) {
  return (
    <section className="users-filter-card card border-0 shadow-sm">
      <div className="card-body p-4 p-lg-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="users-kicker">
              <Filter size={16} />
              Filtros
            </span>

            <h2 className="users-section-title mb-1">
              Busca y administra roles
            </h2>

            <p className="users-section-copy mb-0">
              Filtra por nombre del rol o su estado.
            </p>
          </div>
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-7">
            <label className="form-label users-label" htmlFor="busqueda-rol">
              Buscar rol
            </label>

            <input
              id="busqueda-rol"
              className="form-control users-control"
              type="text"
              value={valores.busqueda}
              placeholder="Ej. Administrador, Almacenero"
              onChange={(event) => onChange('busqueda', event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label users-label" htmlFor="estado-rol">
              Estado
            </label>

            <select
              id="estado-rol"
              className="form-select users-control"
              value={valores.estado}
              onChange={(event) => onChange('estado', event.target.value)}
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="col-12 col-lg-2">
            <div className="d-grid gap-2 d-sm-flex d-lg-grid">
              <button type="button" className="btn users-btn-primary" onClick={onBuscar}>
                <Search size={18} />
                Buscar
              </button>

              <button type="button" className="btn users-btn-secondary" onClick={onLimpiar}>
                <RotateCcw size={18} />
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export type { FiltrosRolesValores }
