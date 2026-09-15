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
          producto.tipoProductoId ===
            valores.tipoProductoId,
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
      productoSeleccionado.tipoProductoId !==
        tipoProductoId
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
            Filtros del reporte
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
              className="form-label maestro-label"
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
              className="form-label maestro-label"
              htmlFor="reporteValeDesde"
            >
              Fecha desde
            </label>

            <input
              id="reporteValeDesde"
              type="date" placeholder={Placeholder.Fecha}
              className="form-control maestro-control"
              value={valores.fechaDesde}
              max={
                valores.fechaHasta ||
                undefined
              }
              onChange={(event) =>
                onChange(
                  'fechaDesde',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeHasta"
            >
              Fecha hasta
            </label>

            <input
              id="reporteValeHasta"
              type="date" placeholder={Placeholder.Fecha}
              className="form-control maestro-control"
              value={valores.fechaHasta}
              min={
                valores.fechaDesde ||
                undefined
              }
              onChange={(event) =>
                onChange(
                  'fechaHasta',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeCentroCosto"
            >
              Centro de costo
            </label>

            <Select inputId="reporteValeCentroCosto" classNamePrefix="maestro-select" options={centrosCosto.map((item) => ({ value: item.id, label: item.nombre }))} value={centrosCosto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.centroCostoId) ?? null} onChange={(opcion) => onChange('centroCostoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeDestino"
            >
              Destino
            </label>

            <Select inputId="reporteValeDestino" classNamePrefix="maestro-select" options={destinos.map((item) => ({ value: item.id, label: item.nombre }))} value={destinos.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.destinoId) ?? null} onChange={(opcion) => onChange('destinoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeParteEquipo"
            >
              Parte de equipo
            </label>

            <Select inputId="reporteValeParteEquipo" classNamePrefix="maestro-select" options={partesEquipo.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre }))} value={partesEquipo.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre })).find((item) => item.value === valores.parteEquipoId) ?? null} onChange={(opcion) => onChange('parteEquipoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeEstado"
            >
              Estado
            </label>

            <Select inputId="reporteValeEstado" classNamePrefix="maestro-select" options={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }]} value={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }].find((item) => item.value === valores.estado) ?? null} onChange={(opcion) => onChange('estado', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable={false} menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeTipoProducto"
            >
              Tipo de producto
            </label>

            <Select inputId="reporteValeTipoProducto" classNamePrefix="maestro-select" options={tiposProducto.map((item) => ({ value: item.id, label: item.nombre }))} value={tiposProducto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.tipoProductoId) ?? null} onChange={(opcion) => cambiarTipoProducto(opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
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
