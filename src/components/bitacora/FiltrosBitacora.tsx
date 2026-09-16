import { Placeholder } from '../../constants/placeholders'
import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'
import Select from 'react-select'

import type { AccionBitacora } from '../../types/bitacora'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'
import { DatePickerInput } from '../ui/DatePickerInput'

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
          <div className="col-12 col-xl-4">
            <label
              className="form-label"
              htmlFor="buscarBitacora"
            >
              Usuario o detalle
            </label>

            <input
              id="buscarBitacora"
              className="form-control"
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

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label"
              htmlFor="moduloBitacora"
            >
              Módulo
            </label>

            <Select
              inputId="moduloBitacora"
              classNamePrefix="maestro-select"
              options={modulos.map((modulo) => ({ value: modulo, label: modulo }))}
              value={modulos.map((modulo) => ({ value: modulo, label: modulo })).find((opcion) => opcion.value === valores.modulo) ?? null}
              onChange={(opcion) => onChange('modulo', opcion?.value ?? '')}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable


              menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label"
              htmlFor="accionBitacora"
            >
              Acción
            </label>

            <Select
              inputId="accionBitacora"
              classNamePrefix="maestro-select"
              options={ACCIONES.map((accion) => ({ value: accion.valor, label: accion.etiqueta }))}
              value={ACCIONES.map((accion) => ({ value: accion.valor, label: accion.etiqueta })).find((opcion) => opcion.value === valores.accion) ?? null}
              onChange={(opcion) => onChange('accion', opcion?.value ?? '')}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable={false}


              menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label"
              htmlFor="fechaDesdeBitacora"
            >
              Fecha desde
            </label>

            <DatePickerInput
              id="fechaDesdeBitacora"
              value={valores.fechaDesde}
              maxValue={valores.fechaHasta}
              rangoEstricto
              className="form-control"
              onChange={(value) => onChange('fechaDesde', value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label
              className="form-label"
              htmlFor="fechaHastaBitacora"
            >
              Fecha hasta
            </label>

            <DatePickerInput
              id="fechaHastaBitacora"
              value={valores.fechaHasta}
              minValue={valores.fechaDesde}
              rangoEstricto
              className="form-control"
              onChange={(value) => onChange('fechaHasta', value)}
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
