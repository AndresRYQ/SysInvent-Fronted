import { Placeholder } from '../../constants/placeholders'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Eye,
  Search,
} from 'lucide-react'
import Select from 'react-select'

import { DetalleMovimientosModal } from '../../components/control-almacen/DetalleMovimientosModal'
import { EmptyState } from '../../components/common/EmptyState'
import { TablePagination } from '../../components/ui/TablePagination'

import { obtenerCategorias } from '../../services/categoriaService'

import {
  obtenerControlAlmacen,
  obtenerDiferenciasStock,
} from '../../services/kardexService'

import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'
import { obtenerUnidadesMedida } from '../../services/unidadMedidaService'

import type {
  ControlAlmacenProducto,
  FiltrosControlAlmacen,
} from '../../types/kardex'

import '../../styles/DashboardPage.css'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'
import '../../styles/maestros.css'

const FILTROS_INICIALES:
  FiltrosControlAlmacen = {
    busqueda: '',
    tipoProductoId: '',
    categoriaId: '',
    estadoStock: '',
    fechaDesde: '',
    fechaHasta: '',
  }

export function ControlAlmacenPage() {
  const [control] = useState<
    ControlAlmacenProducto[]
  >(() => obtenerControlAlmacen())

  const [filtros, setFiltros] =
    useState<FiltrosControlAlmacen>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosControlAlmacen>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(10)

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] =
    useState<ControlAlmacenProducto | null>(
      null,
    )

  const tiposProducto = useMemo(
    () => obtenerTiposProducto(),
    [],
  )

  const categorias = useMemo(
    () => obtenerCategorias(),
    [],
  )

  const unidadesMedida = useMemo(
    () => obtenerUnidadesMedida(),
    [],
  )

  const proveedores = useMemo(
    () => obtenerProveedores(),
    [],
  )

  const diferenciasStock = useMemo(
    () => obtenerDiferenciasStock(),
    [],
  )

  const filas = useMemo(
    () =>
      control.map((producto) => ({
        ...producto,

        tipoProductoNombre:
          tiposProducto.find(
            (tipo) =>
              String(tipo.id) === String(
              producto.tipoProductoId),
          )?.nombre ?? 'Sin tipo',

        categoriaNombre:
          categorias.find(
            (categoria) =>
              String(categoria.id) === String(
              producto.categoriaId),
          )?.nombre ?? 'Sin categoría',

        unidadNombre:
          unidadesMedida.find(
            (unidad) =>
              String(unidad.id) === String(
              producto.unidadMedidaId),
          )?.nombre ?? 'Sin unidad',

        proveedorNombre:
          proveedores.find(
            (proveedor) =>
              String(proveedor.id) === String(
              producto.proveedorId),
          )?.razonSocial ??
          'Sin proveedor',
      })),
    [
      control,
      tiposProducto,
      categorias,
      unidadesMedida,
      proveedores,
    ],
  )

  const filasFiltradas = useMemo(
    () => {
      const busqueda =
        filtrosAplicados.busqueda
          .trim()
          .toLowerCase()

      return filas.filter((producto) => {
        const coincideBusqueda =
          !busqueda ||
          producto.codigo
            .toLowerCase()
            .includes(busqueda) ||
          producto.nombre
            .toLowerCase()
            .includes(busqueda) ||
          producto.proveedorNombre
            .toLowerCase()
            .includes(busqueda)

        const coincideTipo =
          !filtrosAplicados.tipoProductoId ||
          producto.tipoProductoId ===
            filtrosAplicados.tipoProductoId

        const coincideCategoria =
          !filtrosAplicados.categoriaId ||
          producto.categoriaId ===
            filtrosAplicados.categoriaId

        const coincideEstado =
          !filtrosAplicados.estadoStock ||
          producto.estadoStock ===
            filtrosAplicados.estadoStock

        const requiereFiltroFecha =
          Boolean(
            filtrosAplicados.fechaDesde ||
              filtrosAplicados.fechaHasta,
          )

        const coincideFecha =
          !requiereFiltroFecha ||
          producto.movimientos.some(
            (movimiento) => {
              const coincideDesde =
                !filtrosAplicados.fechaDesde ||
                movimiento.fecha >=
                  filtrosAplicados.fechaDesde

              const coincideHasta =
                !filtrosAplicados.fechaHasta ||
                movimiento.fecha <=
                  filtrosAplicados.fechaHasta

              return (
                coincideDesde &&
                coincideHasta
              )
            },
          )

        return (
          coincideBusqueda &&
          coincideTipo &&
          coincideCategoria &&
          coincideEstado &&
          coincideFecha
        )
      })
    },
    [filas, filtrosAplicados],
  )

  const totalItems =
    filasFiltradas.length

  const filasPaginadas = useMemo(
    () => {
      const inicio =
        (page - 1) * pageSize

      return filasFiltradas.slice(
        inicio,
        inicio + pageSize,
      )
    },
    [
      filasFiltradas,
      page,
      pageSize,
    ],
  )

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  const productosConStock =
    control.filter(
      (producto) =>
        producto.stockDisponible > 0,
    ).length

  const productosSinStock =
    control.length - productosConStock

  const movimientosActivos =
    control.reduce(
      (total, producto) =>
        total +
        producto.movimientos.filter(
          (movimiento) =>
            movimiento.afectaStock,
        ).length,
      0,
    )

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Control de almacén</h1>

              <p>
                Entradas, salidas, saldo y
                trazabilidad de productos.
              </p>
            </div>
          </section>

          {diferenciasStock.length > 0 && (
            <div
              className="alert alert-warning"
              role="alert"
            >
              Se detectaron{' '}
              {diferenciasStock.length}{' '}
              producto(s) con diferencias entre
              el saldo calculado y el stock
              técnico.
            </div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="text-secondary small">
                    Productos controlados
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {control.length}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="text-secondary small">
                    Productos con stock
                  </span>

                  <strong className="d-block fs-3 text-success mt-1">
                    {productosConStock}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="text-secondary small">
                    Productos sin stock
                  </span>

                  <strong className="d-block fs-3 text-danger mt-1">
                    {productosSinStock}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="text-secondary small">
                    Movimientos activos
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {movimientosActivos}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="maestro-panel">
            <section className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Search size={17} />

                  <strong>
                    Filtros del control
                  </strong>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <label className="form-label maestro-label">
                      Producto
                    </label>

                    <input
                      className="form-control maestro-control"
                      placeholder={Placeholder.Buscar}
                      value={filtros.busqueda}
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            busqueda:
                              event.target
                                .value,
                          }),
                        )
                      }
                    />
                  </div>

                  <div className="col-12 col-md-4 col-lg-2">
                    <label className="form-label maestro-label">
                      Tipo
                    </label>

                    <Select
                      inputId="controlTipoProductoFiltro"
                      classNamePrefix="maestro-select"
                      options={tiposProducto.map((tipo) => ({ value: String(tipo.id), label: tipo.nombre }))}
                      value={tiposProducto.map((tipo) => ({ value: String(tipo.id), label: tipo.nombre })).find((option) => option.value === filtros.tipoProductoId) ?? null}
                      onChange={(option) => setFiltros((actual) => ({ ...actual, tipoProductoId: option?.value ?? '' }))}
                      placeholder={Placeholder.Seleccionar}
                      isClearable
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={crearEstilosSelect({ zIndex: 20 })}
                    />
                  </div>

                  <div className="col-12 col-md-4 col-lg-2">
                    <label className="form-label maestro-label">
                      Categoría
                    </label>

                    <Select
                      inputId="controlCategoriaFiltro"
                      classNamePrefix="maestro-select"
                      options={categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nombre }))}
                      value={categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nombre })).find((option) => option.value === filtros.categoriaId) ?? null}
                      onChange={(option) => setFiltros((actual) => ({ ...actual, categoriaId: option?.value ?? '' }))}
                      placeholder={Placeholder.Seleccionar}
                      isClearable
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={crearEstilosSelect({ zIndex: 20 })}
                    />
                  </div>

                  <div className="col-12 col-md-4 col-lg-2">
                    <label className="form-label maestro-label">
                      Estado
                    </label>

                    <Select
                      inputId="controlEstadoStockFiltro"
                      classNamePrefix="maestro-select"
                      options={[{ value: 'CON_STOCK', label: 'Con stock' }, { value: 'SIN_STOCK', label: 'Sin stock' }]}
                      value={[{ value: 'CON_STOCK', label: 'Con stock' }, { value: 'SIN_STOCK', label: 'Sin stock' }].find((option) => option.value === filtros.estadoStock) ?? null}
                      onChange={(option) => setFiltros((actual) => ({ ...actual, estadoStock: option?.value ?? '' }))}
                      placeholder={Placeholder.Seleccionar}
                      isClearable
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={crearEstilosSelect({ zIndex: 20 })}
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label className="form-label maestro-label">
                      Desde
                    </label>

                    <input
                      className="form-control maestro-control"
                      type="date" placeholder={Placeholder.Fecha}
                      value={filtros.fechaDesde}
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            fechaDesde:
                              event.target
                                .value,
                          }),
                        )
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-2 ms-lg-auto">
                    <label className="form-label maestro-label">
                      Hasta
                    </label>

                    <input
                      className="form-control maestro-control"
                      type="date" placeholder={Placeholder.Fecha}
                      value={filtros.fechaHasta}
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            fechaHasta:
                              event.target
                                .value,
                          }),
                        )
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-maestro-secondary"
                    onClick={() => {
                      setFiltros(
                        FILTROS_INICIALES,
                      )
                      setFiltrosAplicados(
                        FILTROS_INICIALES,
                      )
                      setPage(1)
                    }}
                  >
                    Limpiar
                  </button>

                  <button
                    type="button"
                    className="btn btn-maestro-primary"
                    onClick={() => {
                      setFiltrosAplicados({
                        ...filtros,
                      })
                      setPage(1)
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="maestro-panel">
            <section className="table-card card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-header">
                  <span className="maestro-kicker">
                    <Boxes size={16} />
                    Existencias por producto
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table standard-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Clasificación</th>
                        <th>Proveedor</th>
                        <th>Entradas</th>
                        <th>Salidas</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th className="text-center">
                          Detalle
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filasPaginadas.length ===
                      0 ? (
                        <tr>
                          <td colSpan={9}>
                            <EmptyState icon={Boxes} iconSize={28} title="No se encontraron productos" description="Ajusta los filtros del control." />
                          </td>
                        </tr>
                      ) : (
                        filasPaginadas.map(
                          (producto) => (
                            <tr
                              key={
                                producto.productoId
                              }
                            >
                              <td>
                                <span className="table-id-chip">
                                  {
                                    producto.codigo
                                  }
                                </span>
                              </td>

                              <td>
                                <strong>
                                  {
                                    producto.nombre
                                  }
                                </strong>

                                <div className="small text-secondary">
                                  {
                                    producto.unidadNombre
                                  }
                                </div>
                              </td>

                              <td>
                                {
                                  producto.tipoProductoNombre
                                }

                                <div className="small text-secondary">
                                  {
                                    producto.categoriaNombre
                                  }
                                </div>
                              </td>

                              <td>
                                {
                                  producto.proveedorNombre
                                }
                              </td>

                              <td className="text-success fw-semibold">
                                <ArrowDownToLine
                                  size={15}
                                  className="me-1"
                                />

                                {
                                  producto.totalEntradas
                                }
                              </td>

                              <td className="text-danger fw-semibold">
                                <ArrowUpFromLine
                                  size={15}
                                  className="me-1"
                                />

                                {
                                  producto.totalSalidas
                                }
                              </td>

                              <td className="fw-bold">
                                {
                                  producto.stockDisponible
                                }{' '}
                                {
                                  producto.unidadNombre
                                }
                              </td>

                              <td>
                                <span
                                  className={
                                    producto.estadoStock ===
                                    'CON_STOCK'
                                      ? 'status-label status-label--active'
                                      : 'status-label status-label--inactive'
                                  }
                                >
                                  {producto.estadoStock ===
                                  'CON_STOCK'
                                    ? 'Con stock'
                                    : 'Sin stock'}
                                </span>
                              </td>

                              <td>
                                <div className="table-actions">
                                  <button
                                    type="button"
                                    className="btn table-action-btn"
                                    title="Ver movimientos"
                                    onClick={() =>
                                      setProductoSeleccionado(
                                        producto,
                                      )
                                    }
                                  >
                                    <Eye size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ),
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <TablePagination
                  totalItems={totalItems}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(
                    nuevoTamano,
                  ) => {
                    setPageSize(
                      nuevoTamano,
                    )
                    setPage(1)
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <DetalleMovimientosModal
        abierto={
          productoSeleccionado !== null
        }
        producto={productoSeleccionado}
        onClose={() =>
          setProductoSeleccionado(null)
        }
      />
    </>
  )
}





