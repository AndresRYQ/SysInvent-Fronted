import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'

import type {
  FiltrosProductosMasPedidos as FiltrosValores,
} from '../../../types/reporteProductoMasPedido'

interface OpcionFiltro {
  id: string
  nombre: string
}

interface FiltrosProductosMasPedidosProps {
  valores: FiltrosValores
  tiposProducto: OpcionFiltro[]
  categorias: OpcionFiltro[]
  destinos: OpcionFiltro[]
  onChange: (
    campo: keyof FiltrosValores,
    valor: string,
  ) => void
  onBuscar: () => void
  onLimpiar: () => void
}

export function FiltrosProductosMasPedidos({
  valores,
  tiposProducto,
  categorias,
  destinos,
  onChange,
  onBuscar,
  onLimpiar,
}: FiltrosProductosMasPedidosProps) {
  return (
    <section className="maestro-filter-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="mb-3">
          <span className="maestro-kicker">
            <Filter size={16} />
            Filtros del ranking
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
              htmlFor="buscarProductoPedido"
            >
              Buscar producto
            </label>

            <input
              id="buscarProductoPedido"
              type="search"
              className="form-control"
              value={valores.busqueda}
              placeholder="Código, producto, tipo o categoría"
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
              htmlFor="productoPedidoDesde"
            >
              Fecha desde
            </label>

            <input
              id="productoPedidoDesde"
              type="date"
              className="form-control"
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
              className="form-label"
              htmlFor="productoPedidoHasta"
            >
              Fecha hasta
            </label>

            <input
              id="productoPedidoHasta"
              type="date"
              className="form-control"
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

          <div className="col-12 col-md-4">
            <label
              className="form-label"
              htmlFor="productoPedidoTipo"
            >
              Tipo de producto
            </label>

            <select
              id="productoPedidoTipo"
              className="form-select"
              value={
                valores.tipoProductoId
              }
              onChange={(event) =>
                onChange(
                  'tipoProductoId',
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

          <div className="col-12 col-md-4">
            <label
              className="form-label"
              htmlFor="productoPedidoCategoria"
            >
              Categoría
            </label>

            <select
              id="productoPedidoCategoria"
              className="form-select"
              value={valores.categoriaId}
              onChange={(event) =>
                onChange(
                  'categoriaId',
                  event.target.value,
                )
              }
            >
              <option value="">
                Todas las categorías
              </option>

              {categorias.map(
                (categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label"
              htmlFor="productoPedidoDestino"
            >
              Destino
            </label>

            <select
              id="productoPedidoDestino"
              className="form-select"
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
                Generar ranking
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

