import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

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
  const opcionesEstado = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ]

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
            <label className="form-label maestro-label" htmlFor="nombreCentroCosto">
              Nombre de centro de costo
            </label>

            <input
              id="nombreCentroCosto"
              className="form-control"
              type="text"
              value={valores.nombre}
              placeholder="Buscar"
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label maestro-label" htmlFor="estadoCentroCosto">
              Estado
            </label>

            <Select
              inputId="estadoCentroCosto"
              options={opcionesEstado}
              value={
                opcionesEstado.find(
                  (opcion) => opcion.value === valores.estado,
                ) ?? null
              }
              onChange={(opcion) =>
                onChange('estado', opcion?.value ?? '')
              }
              placeholder="Seleccionar"
              isClearable
              isSearchable={false}
              styles={crearEstilosSelect({ zIndex: 10 })}
            />
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

