import { Placeholder } from '../../constants/placeholders'
import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import type { Rol } from '../../types/rol'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

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
  roles: Rol[]
}

export function FiltrosUsuarios({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
  roles,
}: FiltrosUsuariosProps) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3 p-lg-3">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
          <div>
            <span className="maestro-kicker">
              <Filter size={16} />
              Filtros de búsqueda
            </span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <label className="form-label" htmlFor="busquedaUsuario">
              Buscar usuario
            </label>

            <input
              id="busquedaUsuario"
              className="form-control"
              type="text"
              value={valores.busqueda}
              placeholder={Placeholder.Buscar}
              onChange={(event) =>
                onChange('busqueda', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label" htmlFor="rolUsuario">
              Rol
            </label>

            <Select
              inputId="rolUsuario" classNamePrefix="maestro-select"
              options={roles.map((rol) => ({ value: rol.nombre, label: rol.nombre }))}
              value={roles.map((rol) => ({ value: rol.nombre, label: rol.nombre })).find((opcion) => opcion.value === valores.rol) ?? null}
              onChange={(opcion) => onChange('rol', opcion?.value ?? '')}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable

              menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label" htmlFor="estadoUsuario">
              Estado
            </label>

            <Select
              inputId="estadoUsuario" classNamePrefix="maestro-select"
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
              value={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ].find((opcion) => opcion.value === valores.estado) ?? null}
              onChange={(opcion) => onChange('estado', opcion?.value ?? '')}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable={false}

              menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-12">
            <div className="maestro-filter-actions">
              <button
                type="button"
                className="btn btn-maestro-secondary"
                onClick={onLimpiar}
              >
                <RotateCcw size={18} />
                Limpiar
              </button>

              <button
                type="button"
                className="btn btn-maestro-primary"
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

