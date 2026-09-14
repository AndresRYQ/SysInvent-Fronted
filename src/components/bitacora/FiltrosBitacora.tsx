import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

import type { AccionBitacora } from '../../types/bitacora'

export interface FiltrosBitacoraValores {
  busqueda: string
  modulo: string
  accion: '' | AccionBitacora
  fechaDesde: string
  fechaHasta: string
}

interface FiltrosBitacoraProps {
  valores: FiltrosBitacoraValores
  modulos: string[]
  onChange: (
    campo: keyof FiltrosBitacoraValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

const ACCIONES: Array<{
  valor: AccionBitacora
  etiqueta: string
}> = [
  {
    valor: 'INICIO_SESION',
    etiqueta: 'Inicio de sesión',
  },
  {
    valor: 'CIERRE_SESION',
    etiqueta: 'Cierre de sesión',
  },
  {
    valor: 'CREAR',
    etiqueta: 'Creación',
  },
  {
    valor: 'EDITAR',
    etiqueta: 'Edición',
  },
  {
    valor: 'ELIMINAR',
    etiqueta: 'Eliminación',
  },
  {
    valor: 'ACCESO_DENEGADO',
    etiqueta: 'Acceso denegado',
  },
  {
    valor: 'BLOQUEO_LOGIN',
    etiqueta: 'Bloqueo de acceso',
  },
]

export function FiltrosBitacora({
  valores,
  modulos,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosBitacoraProps) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3">
          <span className="maestro-kicker">
            <Filter size={16} />
            Filtros de auditoría
          </span>
        </div>

        <form
          className="row g-3"
          onSubmit={(event) => {
            event.preventDefault()
            onBuscar()
          }}
        >
          <div className="col-12 col-xl-4">
            <label
              className="form-label maestro-label"
              htmlFor="buscarBitacora"
            >
              Usuario o detalle
            </label>

            <input
              id="buscarBitacora"
              className="form-control maestro-control"
              value={valores.busqueda}
              placeholder="Buscar registro"
              onChange={(event) =>
                onChange(
                  'busqueda',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label maestro-label"
              htmlFor="moduloBitacora"
            >
              Módulo
            </label>

            <select
              id="moduloBitacora"
              className="form-select maestro-control"
              value={valores.modulo}
              onChange={(event) =>
                onChange(
                  'modulo',
                  event.target.value,
                )
              }
            >
              <option value="">Todos</option>

              {modulos.map((modulo) => (
                <option
                  key={modulo}
                  value={modulo}
                >
                  {modulo}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label maestro-label"
              htmlFor="accionBitacora"
            >
              Acción
            </label>

            <select
              id="accionBitacora"
              className="form-select maestro-control"
              value={valores.accion}
              onChange={(event) =>
                onChange(
                  'accion',
                  event.target.value,
                )
              }
            >
              <option value="">Todas</option>

              {ACCIONES.map((accion) => (
                <option
                  key={accion.valor}
                  value={accion.valor}
                >
                  {accion.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label maestro-label"
              htmlFor="fechaDesdeBitacora"
            >
              Desde
            </label>

            <input
              id="fechaDesdeBitacora"
              className="form-control maestro-control"
              type="date"
              value={valores.fechaDesde}
              onChange={(event) =>
                onChange(
                  'fechaDesde',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label maestro-label"
              htmlFor="fechaHastaBitacora"
            >
              Hasta
            </label>

            <input
              id="fechaHastaBitacora"
              className="form-control maestro-control"
              type="date"
              value={valores.fechaHasta}
              onChange={(event) =>
                onChange(
                  'fechaHasta',
                  event.target.value,
                )
              }
            />
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