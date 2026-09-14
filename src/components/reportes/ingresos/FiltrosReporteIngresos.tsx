import { useMemo } from 'react'

import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

import type {
  FiltrosReporteIngresos as FiltrosValores,
} from '../../../types/reporteIngreso'

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
              placeholder="Ingreso, documento, proveedor o producto"
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
              type="date"
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
              type="date"
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

            <select
              id="reporteIngresoProveedor"
              className="form-select maestro-control"
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
                    {proveedor.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoTipo"
            >
              Tipo de producto
            </label>

            <select
              id="reporteIngresoTipo"
              className="form-select maestro-control"
              value={valores.tipoProductoId}
              onChange={(event) =>
                cambiarTipoProducto(
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos los tipos
              </option>

              {tiposProducto.map((tipo) => (
                <option
                  key={tipo.id}
                  value={tipo.id}
                >
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoProducto"
            >
              Producto
            </label>

            <select
              id="reporteIngresoProducto"
              className="form-select maestro-control"
              value={valores.productoId}
              onChange={(event) =>
                onChange(
                  'productoId',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos los productos
              </option>

              {productosFiltrados.map(
                (producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.codigo} —{' '}
                    {producto.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteIngresoEstado"
            >
              Estado
            </label>

            <select
              id="reporteIngresoEstado"
              className="form-select maestro-control"
              value={valores.estado}
              onChange={(event) =>
                onChange(
                  'estado',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos los estados
              </option>

              <option value="REGISTRADO">
                Registrado
              </option>

              <option value="ANULADO">
                Anulado
              </option>
            </select>
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


