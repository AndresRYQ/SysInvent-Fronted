import { Placeholder } from '../../constants/placeholders'
import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

export interface FiltrosRolesValores {
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
          <div className="col-12 col-lg-8">
            <label className="form-label" htmlFor="busquedaRol">
              Buscar rol
            </label>

            <input
              id="busquedaRol"
              className="form-control"
              type="text"
              value={valores.busqueda}
              placeholder={Placeholder.Buscar}
              onChange={(event) => onChange('busqueda', event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label" htmlFor="estadoRol">
              Estado
            </label>

            <Select
              inputId="estadoRol" classNamePrefix="maestro-select"
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

