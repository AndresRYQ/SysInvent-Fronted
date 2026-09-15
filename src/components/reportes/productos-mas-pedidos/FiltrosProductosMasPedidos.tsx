import { Placeholder } from '../../../constants/placeholders'
import {
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react'
import Select from 'react-select'

import type {
  FiltrosProductosMasPedidos as FiltrosValores,
} from '../../../types/reporteProductoMasPedido'
import { crearEstilosSelect } from '../../../styles/reactSelectStyles'

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
              className="form-label maestro-label"
              htmlFor="buscarProductoPedido"
            >
              Buscar producto
            </label>

            <input
              id="buscarProductoPedido"
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
              htmlFor="productoPedidoDesde"
            >
              Fecha desde
            </label>

            <input
              id="productoPedidoDesde"
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
              htmlFor="productoPedidoHasta"
            >
              Fecha hasta
            </label>

            <input
              id="productoPedidoHasta"
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

          <div className="col-12 col-md-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoPedidoTipo"
            >
              Tipo de producto
            </label>

            <Select inputId="productoPedidoTipo" classNamePrefix="maestro-select" options={tiposProducto.map((item) => ({ value: item.id, label: item.nombre }))} value={tiposProducto.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.tipoProductoId) ?? null} onChange={(opcion) => onChange('tipoProductoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoPedidoCategoria"
            >
              Categoría
            </label>

            <Select inputId="productoPedidoCategoria" classNamePrefix="maestro-select" options={categorias.map((item) => ({ value: item.id, label: item.nombre }))} value={categorias.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.categoriaId) ?? null} onChange={(opcion) => onChange('categoriaId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoPedidoDestino"
            >
              Destino
            </label>

            <Select inputId="productoPedidoDestino" classNamePrefix="maestro-select" options={destinos.map((item) => ({ value: item.id, label: item.nombre }))} value={destinos.map((item) => ({ value: item.id, label: item.nombre })).find((item) => item.value === valores.destinoId) ?? null} onChange={(opcion) => onChange('destinoId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ zIndex: 20 })} />
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
                Generar ranking
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
