import { Filter, RotateCcw, Search } from 'lucide-react'

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
  return (
    <section className="categories-filter-card card border-0 shadow-sm">
      <div className="card-body p-4 p-lg-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="categories-kicker">
              <Filter size={16} />
              Filtros
            </span>

            <h2 className="categories-section-title mb-1">
              Filtra el listado de categorías
            </h2>

            <p className="categories-section-copy mb-0">
              Busca por nombre y estado.
            </p>
          </div>
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-6">
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

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label categories-label" htmlFor="estadoCategoria">
              Estado
            </label>

            <select
              id="estadoCategoria"
              className="form-select categories-control"
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

          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-grid gap-2 d-sm-flex d-lg-grid">
              <button
                type="button"
                className="btn categories-btn-primary"
                onClick={onBuscar}
              >
                <Search size={18} />
                Buscar
              </button>

              <button
                type="button"
                className="btn categories-btn-secondary"
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
