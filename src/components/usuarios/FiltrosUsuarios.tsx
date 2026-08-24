import { Filter, RotateCcw, Search } from 'lucide-react'

interface FiltrosUsuariosValores {
  busqueda: string
  rol: string
  estado: string
}

interface FiltrosUsuariosProps {
  valores: FiltrosUsuariosValores
  onChange: (
    campo: keyof FiltrosUsuariosValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosUsuarios({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosUsuariosProps) {
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
              Encuentra el registro que necesitas
            </h2>

            <p className="users-section-copy mb-0">
              Filtra por nombre, usuario, rol o estado.
            </p>
          </div>
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <label className="form-label users-label" htmlFor="busqueda">
              Buscar usuario
            </label>

            <input
              id="busqueda"
              className="form-control users-control"
              type="text"
              value={valores.busqueda}
              placeholder="Ej. admin o Administrador del Sistema"
              onChange={(event) =>
                onChange('busqueda', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label users-label" htmlFor="rol">
              Rol
            </label>

            <select
              id="rol"
              className="form-select users-control"
              value={valores.rol}
              onChange={(event) =>
                onChange('rol', event.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="Administrador">Administrador</option>
              <option value="Almacenero">Almacenero</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-2">
            <label className="form-label users-label" htmlFor="estado">
              Estado
            </label>

            <select
              id="estado"
              className="form-select users-control"
              value={valores.estado}
              onChange={(event) =>
                onChange('estado', event.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="col-12 col-lg-2">
            <div className="d-grid gap-2 d-sm-flex d-lg-grid">
              <button
                type="button"
                className="btn users-btn-primary"
                onClick={onBuscar}
              >
                <Search size={18} />
                Buscar
              </button>

              <button
                type="button"
                className="btn users-btn-secondary"
                onClick={onLimpiar}
              >
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
