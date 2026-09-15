import { Placeholder } from '../../../constants/placeholders'
import { useMemo } from 'react'

import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'
import Select from 'react-select'

import type {
  FiltrosReporteIngresos as FiltrosValores,
} from '../../../types/reporteIngreso'
import { crearEstilosSelect } from '../../../styles/reactSelectStyles'

interface OpcionFiltro {
  id: string
  nombre: string
}

interface OpcionProducto extends OpcionFiltro {
  codigo: string
  tipoProductoId: string
}

interface FiltrosReporteIngresosProps {
  valores: FiltrosValores
  proveedores: OpcionFiltro[]
  tiposProducto: OpcionFiltro[]
  productos: OpcionProducto[]
  onChange: (
    campo: keyof FiltrosValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosReporteIngresos({
  valores,
  proveedores,
  tiposProducto,
  productos,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosReporteIngresosProps) {
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
          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="buscarReporteIngreso"
            >
              Buscar
            </label>

            <input
              id="buscarReporteIngreso"
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

          <div className="col-12 col-md-6 col-lg-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoDesde"
            >
              Fecha desde
            </label>

            <input
              id="reporteIngresoDesde"
              type="date" placeholder={Placeholder.Fecha}
              className="form-control maestro-control"
              value={valores.fechaDesde}
              max={valores.fechaHasta || undefined}
              onChange={(event) =>
                onChange(
                  'fechaDesde',
                  event.target.value,
                )
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoHasta"
            >
              Fecha hasta
            </label>

            <input
              id="reporteIngresoHasta"
              type="date" placeholder={Placeholder.Fecha}
              className="form-control maestro-control"
              value={valores.fechaHasta}
              min={valores.fechaDesde || undefined}
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
              htmlFor="reporteIngresoProveedor"
            >
              Proveedor
            </label>

            <Select inputId="reporteIngresoProveedor" classNamePrefix="maestro-select" options={proveedores.map((item) => ({ value: item.id, label: item.nombre }))} value={proveedores.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.proveedorId) ?? null} onChange={(opcion) => onChange('proveedorId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoTipo"
            >
              Tipo de producto
            </label>

            <Select inputId="reporteIngresoTipo" classNamePrefix="maestro-select" options={tiposProducto.map((item) => ({ value: item.id, label: item.nombre }))} value={tiposProducto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.tipoProductoId) ?? null} onChange={(opcion) => cambiarTipoProducto(opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoProducto"
            >
              Producto
            </label>

            <Select inputId="reporteIngresoProducto" classNamePrefix="maestro-select" options={productosFiltrados.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre }))} value={productosFiltrados.map((item) => ({ value: item.id, label: item.codigo + ' — ' + item.nombre })).find((item) => item.value === valores.productoId) ?? null} onChange={(opcion) => onChange('productoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoEstado"
            >
              Estado
            </label>

            <Select inputId="reporteIngresoEstado" classNamePrefix="maestro-select" options={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }]} value={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }].find((item) => item.value === valores.estado) ?? null} onChange={(opcion) => onChange('estado', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable={false} menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
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
