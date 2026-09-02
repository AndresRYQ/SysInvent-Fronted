import { useState } from 'react'
import { ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

export interface FiltrosUsuariosValores {
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
  const [rolAbierto, setRolAbierto] = useState(false)
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
          <div className="col-12 col-lg-6">
            <label className="form-label maestro-label" htmlFor="busquedaUsuario">
              Buscar usuario
            </label>

            <input
              id="busquedaUsuario"
              className="form-control maestro-control"
              type="text"
              value={valores.busqueda}
              placeholder="Ej. admin o Administrador del Sistema"
              onChange={(event) =>
                onChange('busqueda', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label maestro-label" htmlFor="rolUsuario">
              Rol
            </label>

            <div
              className={`maestro-select-wrap${rolAbierto ? ' is-open' : ''}`}
            >
              <select
                id="rolUsuario"
                className="form-select maestro-control maestro-select-control"
                value={valores.rol}
                onMouseDown={() => setRolAbierto(true)}
                onKeyDown={() => setRolAbierto(true)}
                onFocus={() => setRolAbierto(true)}
                onBlur={() => setRolAbierto(false)}
                onChange={(event) => {
                  onChange('rol', event.target.value)
                  setRolAbierto(false)
                }}
              >
                <option value="">Todos</option>
                <option value="Administrador">Administrador</option>
                <option value="Almacenero">Almacenero</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label maestro-label" htmlFor="estadoUsuario">
              Estado
            </label>

            <div
              className={`maestro-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoUsuario"
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

export type { FiltrosUsuariosValores }
