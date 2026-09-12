import {
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

import type { Proveedor } from '../../types/proveedor'

export interface FiltrosContactosValores {
  busqueda: string
  proveedorId: string
  estado: string
}

interface FiltrosContactosProps {
  valores: FiltrosContactosValores
  proveedores: Proveedor[]
  onChange: (
    campo: keyof FiltrosContactosValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosContactos({
  valores,
  proveedores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosContactosProps) {
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
          <div className="col-12 col-lg-5">
            <label
              className="form-label maestro-label"
              htmlFor="buscarContacto"
            >
              Contacto
            </label>

            <input
              id="buscarContacto"
              className="form-control maestro-control"
              type="text"
              value={valores.busqueda}
              placeholder="Nombre, cargo, teléfono o correo"
              onChange={(event) =>
                onChange(
                  'busqueda',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorContacto"
            >
              Proveedor
            </label>

            <div className="maestro-select-wrap">
              <select
                id="proveedorContacto"
                className="form-select maestro-control maestro-select-control"
                value={valores.proveedorId}
                onChange={(event) =>
                  onChange(
                    'proveedorId',
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Todos los proveedores
                </option>

                {proveedores.map(
                  (proveedor) => (
                    <option
                      key={proveedor.id}
                      value={proveedor.id}
                    >
                      {proveedor.razonSocial}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown size={16} />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label
              className="form-label maestro-label"
              htmlFor="estadoContacto"
            >
              Estado
            </label>

            <div className="maestro-select-wrap">
              <select
                id="estadoContacto"
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