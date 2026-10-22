import { Placeholder } from '../../constants/placeholders'
import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'
import { MaestroEstadoSelect } from '../common/MaestroEstadoSelect'

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
              className="form-label"
              htmlFor="buscarProveedor"
            >
              RUC o razón social
            </label>

            <input
              id="buscarProveedor"
              className="form-control"
              type="text"
              value={valores.busqueda}
              placeholder={Placeholder.Buscar}
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
              className="form-label"
              htmlFor="estadoProveedor"
            >
              Estado
            </label>

            <MaestroEstadoSelect
              inputId="estadoProveedor"
              value={valores.estado}
              onChange={(value) => onChange('estado', value)}
            />
          </div>

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
                type="submit"
                className="btn btn-maestro-primary"
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
