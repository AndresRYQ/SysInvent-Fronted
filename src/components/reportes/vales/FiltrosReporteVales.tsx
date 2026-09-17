import { useMemo } from 'react'

import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

import type {
  FiltrosReporteVales as FiltrosValores,
} from '../../../types/reporteVale'

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
              placeholder="Vale, solicitante, producto, destino o equipo"
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
              type="date"
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
              type="date"
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

            <select
              id="reporteValeCentroCosto"
              className="form-select maestro-control"
              value={valores.centroCostoId}
              onChange={(event) =>
                onChange(
                  'centroCostoId',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos los centros
              </option>

              {centrosCosto.map(
                (centro) => (
                  <option
                    key={centro.id}
                    value={centro.id}
                  >
                    {centro.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeDestino"
            >
              Destino
            </label>

            <select
              id="reporteValeDestino"
              className="form-select maestro-control"
              value={valores.destinoId}
              onChange={(event) =>
                onChange(
                  'destinoId',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todos los destinos
              </option>

              {destinos.map((destino) => (
                <option
                  key={destino.id}
                  value={destino.id}
                >
                  {destino.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeParteEquipo"
            >
              Parte de equipo
            </label>

            <select
              id="reporteValeParteEquipo"
              className="form-select maestro-control"
              value={valores.parteEquipoId}
              onChange={(event) =>
                onChange(
                  'parteEquipoId',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todas las partes
              </option>

              {partesEquipo.map(
                (parte) => (
                  <option
                    key={parte.id}
                    value={parte.id}
                  >
                    {parte.codigo} —{' '}
                    {parte.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeEstado"
            >
              Estado
            </label>

            <select
              id="reporteValeEstado"
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

          <div className="col-12 col-md-6 col-xl-3">
            <label
              className="form-label maestro-label"
              htmlFor="reporteValeTipoProducto"
            >
              Tipo de producto
            </label>

            <select
              id="reporteValeTipoProducto"
              className="form-select maestro-control"
              value={
                valores.tipoProductoId
              }
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
              htmlFor="reporteValeProducto"
            >
              Producto
            </label>

            <select
              id="reporteValeProducto"
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