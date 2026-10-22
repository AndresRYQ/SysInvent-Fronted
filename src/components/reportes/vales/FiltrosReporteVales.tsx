import { Placeholder } from '../../../constants/placeholders'
import { useMemo } from 'react'

import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'
import Select from 'react-select'

import type {
  FiltrosReporteVales as FiltrosValores,
} from '../../../types/reporteVale'
import { crearEstilosSelect } from '../../../styles/reactSelectStyles'
import { coincidenIds } from '../../../utils/identificadores'
import { DatePickerInput } from '../../ui/DatePickerInput'

interface OpcionFiltro {
  id: string
  nombre: string
}

interface OpcionParteEquipo
  extends OpcionFiltro {
  codigo: string
}

interface OpcionProducto
  extends OpcionFiltro {
  codigo: string
  tipoProductoId: string
}

interface FiltrosReporteValesProps {
  valores: FiltrosValores
  centrosCosto: OpcionFiltro[]
  destinos: OpcionFiltro[]
  partesEquipo: OpcionParteEquipo[]
  tiposProducto: OpcionFiltro[]
  productos: OpcionProducto[]
  onChange: (
    campo: keyof FiltrosValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosReporteVales({
  valores,
  centrosCosto,
  destinos,
  partesEquipo,
  tiposProducto,
  productos,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosReporteValesProps) {
  const productosFiltrados = useMemo(
    () =>
      productos.filter(
        (producto) =>
          !valores.tipoProductoId ||
          coincidenIds(
            producto.tipoProductoId,
            valores.tipoProductoId,
            'TP-',
          ),
      ),
    [
      productos,
      valores.tipoProductoId,
    ],
  )

  function cambiarTipoProducto(
    tipoProductoId: string,
  ): void {
    onChange(
      'tipoProductoId',
      tipoProductoId,
    )

    const productoSeleccionado =
      productos.find(
        (producto) =>
          producto.id ===
          valores.productoId,
      )

    if (
      productoSeleccionado &&
      !coincidenIds(
        productoSeleccionado.tipoProductoId,
        tipoProductoId,
        'TP-',
      )
    ) {
      onChange('productoId', '')
    }
  }

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
          <div className="col-12 col-xl-6">
            <label
              className="form-label"
              htmlFor="buscarReporteVale"
            >
              Buscar
            </label>

            <input
              id="buscarReporteVale"
              type="search"
              className="form-control maestro-control"
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

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeDesde"
            >
              Fecha desde
            </label>

            <DatePickerInput
              id="reporteValeDesde"
              value={valores.fechaDesde}
              maxValue={valores.fechaHasta}
              rangoEstricto
              onChange={(value) => onChange('fechaDesde', value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeHasta"
            >
              Fecha hasta
            </label>

            <DatePickerInput
              id="reporteValeHasta"
              value={valores.fechaHasta}
              minValue={valores.fechaDesde}
              rangoEstricto
              onChange={(value) => onChange('fechaHasta', value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeCentroCosto"
            >
              Centro de costo
            </label>

            <Select inputId="reporteValeCentroCosto" classNamePrefix="maestro-select" options={centrosCosto.map((item) => ({ value: item.id, label: item.nombre }))} value={centrosCosto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.centroCostoId) ?? null} onChange={(opcion) => onChange('centroCostoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeDestino"
            >
              Destino
            </label>

            <Select inputId="reporteValeDestino" classNamePrefix="maestro-select" options={destinos.map((item) => ({ value: item.id, label: item.nombre }))} value={destinos.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.destinoId) ?? null} onChange={(opcion) => onChange('destinoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeParteEquipo"
            >
              Parte de equipo
            </label>

            <Select inputId="reporteValeParteEquipo" classNamePrefix="maestro-select" options={partesEquipo.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre }))} value={partesEquipo.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre })).find((item) => item.value === valores.parteEquipoId) ?? null} onChange={(opcion) => onChange('parteEquipoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeEstado"
            >
              Estado
            </label>

            <Select inputId="reporteValeEstado" classNamePrefix="maestro-select" options={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }]} value={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }].find((item) => item.value === valores.estado) ?? null} onChange={(opcion) => onChange('estado', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable={false} menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeTipoProducto"
            >
              Tipo de producto
            </label>

            <Select inputId="reporteValeTipoProducto" classNamePrefix="maestro-select" options={tiposProducto.map((item) => ({ value: item.id, label: item.nombre }))} value={tiposProducto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.tipoProductoId) ?? null} onChange={(opcion) => cambiarTipoProducto(opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label"
              htmlFor="reporteValeProducto"
            >
              Producto
            </label>

            <Select inputId="reporteValeProducto" classNamePrefix="maestro-select" options={productosFiltrados.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre }))} value={productosFiltrados.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre })).find((item) => item.value === valores.productoId) ?? null} onChange={(opcion) => onChange('productoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
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
