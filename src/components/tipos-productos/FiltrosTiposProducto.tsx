import { Placeholder } from '../../constants/placeholders'
import { Filter, RotateCcw, Search } from 'lucide-react'
import { MaestroEstadoSelect } from '../common/MaestroEstadoSelect'

export interface FiltrosTiposProductoValores {
  nombre: string
  estado: string
}

interface FiltrosTiposProductoProps {
  valores: FiltrosTiposProductoValores
  onChange: (
    campo: keyof FiltrosTiposProductoValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosTiposProducto({
  valores,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosTiposProductoProps) {
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
            <label className="form-label" htmlFor="nombreTipoProducto">
              Nombre de tipo de producto
            </label>

            <input
              id="nombreTipoProducto"
              className="form-control"
              type="text"
              value={valores.nombre}
              placeholder={Placeholder.Buscar}
              onChange={(event) =>
                onChange('nombre', event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label" htmlFor="estadoTipoProducto">
              Estado
            </label>

            <MaestroEstadoSelect
              inputId="estadoTipoProducto"
              value={valores.estado}
              onChange={(value) => onChange('estado', value)}
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
