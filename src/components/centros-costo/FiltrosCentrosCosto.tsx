import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'

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
              className="form-control maestro-control"
              type="text"
              value={valores.nombre}
              placeholder="Ej. Producción, Mantenimiento, Administración"
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label maestro-label" htmlFor="estadoCentroCosto">
              Estado
            </label>

<<<<<<< HEAD
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
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid rgb(17 24 39 / 10%)',
                  borderColor: state.isFocused
                    ? 'rgb(51 143 60 / 55%)'
                    : 'rgb(17 24 39 / 10%)',
                  backgroundColor: state.isFocused
                    ? '#fff'
                    : '#f9fbfa',
                  boxShadow: state.isFocused
                    ? '0 0 0 0.22rem rgb(51 143 60 / 12%)'
                    : 'none',
                  '&:hover': {
                    borderColor: state.isFocused
                      ? 'rgb(51 143 60 / 55%)'
                      : 'rgb(17 24 39 / 10%)',
                  },
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  padding: '0 12px',
                  fontSize: '0.8rem',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: '#344054',
                  fontSize: '0.8rem',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#667085',
                  fontSize: '0.8rem',
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  height: '34px',
                }),
                menu: (provided) => ({ ...provided, zIndex: 10 }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: '0.8rem',
                  backgroundColor: state.isSelected
                    ? '#e9f8ee'
                    : state.isFocused
                      ? '#f3faf5'
                      : '#fff',
                  color: '#344054',
                }),
              }}
            />
=======
            <div
              className={`maestro-select-wrap${estadoAbierto ? ' is-open' : ''}`}
            >
              <select
                id="estadoCentroCosto"
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
>>>>>>> 62b19fcf30321b21ea7cf9198aa091470de57ac8
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

