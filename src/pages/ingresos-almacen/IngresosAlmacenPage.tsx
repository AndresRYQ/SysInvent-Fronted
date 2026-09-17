import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CalendarDays,
  PackagePlus,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { TablePagination } from '../../components/ui/TablePagination'

import {
  anularIngresoAlmacen,
  calcularTotalIngreso,
  obtenerIngresosAlmacen,
} from '../../services/ingresoAlmacenService'

import { obtenerContactos } from '../../services/contactoService'
import { obtenerProductos } from '../../services/productoService'
import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposDocumento } from '../../services/tipoComprobanteService'
import { obtenerUnidadesMedida } from '../../services/unidadMedidaService'
import type { IngresoAlmacenRegistro } from '../../types/ingresoAlmacen'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

interface FiltrosIngresos {
  busqueda: string
  proveedorId: string
  estado: string
  fechaDesde: string
  fechaHasta: string
}

interface EstadoNavegacion {
  mensaje?: string
}

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

const FILTROS_INICIALES: FiltrosIngresos = {
  busqueda: '',
  proveedorId: '',
  estado: '',
  fechaDesde: '',
  fechaHasta: '',
}

function obtenerMensajeError(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

function formatearFecha(
  fecha: string,
): string {
  if (!fecha) {
    return '-'
  }

  const fechaLocal = new Date(
    `${fecha}T00:00:00`,
  )

  if (
    Number.isNaN(fechaLocal.getTime())
  ) {
    return fecha
  }

  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(fechaLocal)
}

export function IngresosAlmacenPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [ingresos, setIngresos] =
    useState<IngresoAlmacenRegistro[]>(
      () => obtenerIngresosAlmacen(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosIngresos>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosIngresos>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(10)

  const [
    ingresoAAnular,
    setIngresoAAnular,
  ] =
    useState<IngresoAlmacenRegistro | null>(
      null,
    )

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  const proveedores = useMemo(
    () => obtenerProveedores(),
    [],
  )

  const contactos = useMemo(
    () => obtenerContactos(),
    [],
  )

  const tiposDocumento = useMemo(
    () => obtenerTiposDocumento(),
    [],
  )

  const productos = useMemo(
    () => obtenerProductos(),
    [],
  )

  const unidadesMedida = useMemo(
    () => obtenerUnidadesMedida(),
    [],
  )
  useEffect(() => {
    const estado =
      location.state as EstadoNavegacion | null

    if (!estado?.mensaje) {
      return
    }

    setMensaje({
      tipo: 'success',
      texto: estado.mensaje,
    })

    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }, [
    location.pathname,
    location.state,
    navigate,
  ])

  const ingresosConDetalle = useMemo(
    () =>
      ingresos.map((ingreso) => {
        const proveedor =
          proveedores.find(
            (item) =>
              item.id ===
              ingreso.proveedorId,
          )

        const contacto = contactos.find(
          (item) =>
            item.id ===
            ingreso.contactoId,
        )

        const tipoDocumento =
          tiposDocumento.find(
            (item) =>
              item.id ===
              ingreso.tipoComprobanteId,
          )

        const detallesProductos =
        ingreso.detalles.map((detalle) => {
          const producto = productos.find(
            (item) =>
              item.id === detalle.productoId,
          )

          const unidad = unidadesMedida.find(
            (item) =>
              item.id ===
              producto?.unidadMedidaId,
          )

            return {
              nombre:
                producto?.nombre ??
                'Producto no disponible',
              cantidad: detalle.cantidad,
              unidad:
                unidad?.nombre ?? 'Sin unidad',
            }
          })

        const nombresProductos =
          detallesProductos.map(
            (detalle) => detalle.nombre,
          )

        const cantidadesResumen =
          detallesProductos
            .map(
              (detalle) =>
                `${detalle.nombre}: ${detalle.cantidad} ${detalle.unidad}`,
            )
            .join(' | ')

        return {
          ...ingreso,
          proveedorNombre:
            proveedor?.razonSocial ??
            'Proveedor no disponible',
          contactoNombre:
            contacto?.nombreCompleto ??
            'Contacto no disponible',
          tipoDocumentoNombre:
            tipoDocumento?.nombre ??
            'Documento no disponible',
          productosResumen:
            nombresProductos.join(', '),
            cantidadesResumen,
          total:
            calcularTotalIngreso(ingreso),
        }
      }),
    [
      ingresos,
      proveedores,
      contactos,
      tiposDocumento,
      productos,
      unidadesMedida,
    ],
  )

  const ingresosFiltrados = useMemo(
    () => {
      const busqueda =
        filtrosAplicados.busqueda
          .trim()
          .toLowerCase()

      return ingresosConDetalle.filter(
        (ingreso) => {
          const coincideBusqueda =
            !busqueda ||
            ingreso.numeroIngreso
              .toLowerCase()
              .includes(busqueda) ||
            ingreso.numeroDocumento
              .toLowerCase()
              .includes(busqueda) ||
            ingreso.proveedorNombre
              .toLowerCase()
              .includes(busqueda) ||
            ingreso.productosResumen
              .toLowerCase()
              .includes(busqueda)

          const coincideProveedor =
            !filtrosAplicados.proveedorId ||
            ingreso.proveedorId ===
              filtrosAplicados.proveedorId

          const coincideEstado =
            !filtrosAplicados.estado ||
            ingreso.estado ===
              filtrosAplicados.estado

          const coincideDesde =
            !filtrosAplicados.fechaDesde ||
            ingreso.fechaIngreso >=
              filtrosAplicados.fechaDesde

          const coincideHasta =
            !filtrosAplicados.fechaHasta ||
            ingreso.fechaIngreso <=
              filtrosAplicados.fechaHasta

          return (
            coincideBusqueda &&
            coincideProveedor &&
            coincideEstado &&
            coincideDesde &&
            coincideHasta
          )
        },
      )
    },
    [
      ingresosConDetalle,
      filtrosAplicados,
    ],
  )

  const totalItems =
    ingresosFiltrados.length

  const ingresosPaginados = useMemo(
    () => {
      const inicio =
        (page - 1) * pageSize

      return ingresosFiltrados.slice(
        inicio,
        inicio + pageSize,
      )
    },
    [
      ingresosFiltrados,
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

  function confirmarAnulacion(): void {
    if (!ingresoAAnular) {
      return
    }

    try {
      const ingresoAnulado =
        anularIngresoAlmacen(
          ingresoAAnular.id,
        )

      setIngresos(
        obtenerIngresosAlmacen(),
      )

      setMensaje({
        tipo: 'success',
        texto:
          `Ingreso ${ingresoAnulado.numeroIngreso} anulado correctamente.`,
      })
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: obtenerMensajeError(error),
      })
    } finally {
      setIngresoAAnular(null)
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Ingresos de almacén</h1>

              <p>
                Registro de mercadería y
                actualización de existencias.
              </p>
            </div>
          </section>

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}
              role="alert"
            >
              {mensaje.texto}

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() =>
                  setMensaje(null)
                }
              />
            </div>
          )}

          <div className="maestro-panel">
            <section className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <label
                      className="form-label maestro-label"
                      htmlFor="ingresoBusqueda"
                    >
                      Buscar
                    </label>

                    <input
                      id="ingresoBusqueda"
                      className="form-control maestro-control"
                      placeholder="Ingreso, documento, proveedor o producto"
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

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label maestro-label"
                      htmlFor="ingresoProveedorFiltro"
                    >
                      Proveedor
                    </label>

                    <select
                      id="ingresoProveedorFiltro"
                      className="form-select maestro-control"
                      value={
                        filtros.proveedorId
                      }
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            proveedorId:
                              event.target
                                .value,
                          }),
                        )
                      }
                    >
                      <option value="">
                        Todos
                      </option>

                      {proveedores.map(
                        (proveedor) => (
                          <option
                            key={
                              proveedor.id
                            }
                            value={
                              proveedor.id
                            }
                          >
                            {
                              proveedor.razonSocial
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label maestro-label"
                      htmlFor="ingresoEstadoFiltro"
                    >
                      Estado
                    </label>

                    <select
                      id="ingresoEstadoFiltro"
                      className="form-select maestro-control"
                      value={filtros.estado}
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            estado:
                              event.target
                                .value,
                          }),
                        )
                      }
                    >
                      <option value="">
                        Todos
                      </option>
                      <option value="REGISTRADO">
                        Registrado
                      </option>
                      <option value="ANULADO">
                        Anulado
                      </option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label maestro-label"
                      htmlFor="ingresoDesde"
                    >
                      Desde
                    </label>

                    <input
                      id="ingresoDesde"
                      className="form-control maestro-control"
                      type="date"
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

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label maestro-label"
                      htmlFor="ingresoHasta"
                    >
                      Hasta
                    </label>

                    <input
                      id="ingresoHasta"
                      className="form-control maestro-control"
                      type="date"
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
                    className="btn maestro-btn-secondary"
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
                    className="btn maestro-btn-primary"
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
            <section className="maestro-table-card card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="maestro-table-header">
                  <span className="maestro-kicker">
                    <PackagePlus size={16} />
                    Listado de ingresos
                  </span>

                  <button
                    type="button"
                    className="btn maestro-toolbar-btn"
                    onClick={() =>
                      navigate(
                        '/ingresos-almacen/nuevo',
                      )
                    }
                  >
                    <Plus size={18} />
                    Registrar ingreso
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table maestro-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Proveedor</th>
                        <th>Contacto</th>
                        <th>Documento</th>
                        <th>Productos</th>
                        <th>Cantidad ingresada</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th className="text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {ingresosPaginados.length ===
                      0 ? (
                        <tr>
                          <td colSpan={10}>
                            <div className="maestro-empty-state">
                              <PackagePlus
                                size={28}
                              />
                              <p className="mb-1">
                                No se encontraron
                                ingresos
                              </p>
                              <span>
                                Registra el primer
                                ingreso de mercadería.
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        ingresosPaginados.map(
                          (ingreso) => (
                            <tr key={ingreso.id}>
                              <td>
                                <span className="maestro-id-chip">
                                  {
                                    ingreso.numeroIngreso
                                  }
                                </span>
                              </td>

                              <td>
                                <CalendarDays
                                  size={15}
                                  className="me-1"
                                />
                                {formatearFecha(
                                  ingreso.fechaIngreso,
                                )}
                              </td>

                              <td>
                                {
                                  ingreso.proveedorNombre
                                }
                              </td>

                              <td>
                                {
                                  ingreso.contactoNombre
                                }
                              </td>

                              <td>
                                <strong>
                                  {
                                    ingreso.tipoDocumentoNombre
                                  }
                                </strong>
                                <div className="small text-secondary">
                                  {
                                    ingreso.numeroDocumento
                                  }
                                </div>
                              </td>

                              <td
                                title={
                                  ingreso.productosResumen
                                }
                              >
                                {
                                  ingreso.detalles
                                    .length
                                }{' '}
                                producto(s)
                              </td>
                              <td
                                title={
                                  ingreso.cantidadesResumen
                                }
                              >
                                {ingreso.cantidadesResumen}
                              </td>

                              <td>
                                S/{' '}
                                {ingreso.total.toFixed(
                                  2,
                                )}
                              </td>

                              <td>
                                <span
                                  className={
                                    ingreso.estado ===
                                    'REGISTRADO'
                                      ? 'maestro-status maestro-status--active'
                                      : 'maestro-status maestro-status--inactive'
                                  }
                                >
                                  <ShieldCheck
                                    size={14}
                                  />
                                  {ingreso.estado ===
                                  'REGISTRADO'
                                    ? 'Registrado'
                                    : 'Anulado'}
                                </span>
                              </td>

                              <td>
                                <div className="maestro-actions">
                                  <button
                                    type="button"
                                    className="btn maestro-action-btn"
                                    title="Editar"
                                    disabled={
                                      ingreso.estado ===
                                      'ANULADO'
                                    }
                                    onClick={() =>
                                      navigate(
                                        `/ingresos-almacen/${ingreso.id}/editar`,
                                      )
                                    }
                                  >
                                    <Pencil
                                      size={16}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    className="btn maestro-action-btn maestro-action-btn--danger"
                                    title="Anular"
                                    disabled={
                                      ingreso.estado ===
                                      'ANULADO'
                                    }
                                    onClick={() =>
                                      setIngresoAAnular(
                                        ingreso,
                                      )
                                    }
                                  >
                                    <Trash2
                                      size={16}
                                    />
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

      {ingresoAAnular && (
        <div
          className="maestro-modal-backdrop"
          role="presentation"
          onClick={() =>
            setIngresoAAnular(null)
          }
        >
          <div
            className="maestro-modal-card maestro-modal-card--sm"
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <h3 className="maestro-modal-title text-center">
              Anular ingreso
            </h3>

            <p className="maestro-modal-copy text-center">
              Se descontarán del stock todos
              los productos registrados en:
            </p>

            <p className="maestro-delete-name">
              {
                ingresoAAnular.numeroIngreso
              }
            </p>

            <div className="maestro-modal-footer maestro-modal-footer--center">
              <button
                type="button"
                className="btn maestro-btn-secondary"
                onClick={() =>
                  setIngresoAAnular(null)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn maestro-btn-danger"
                onClick={
                  confirmarAnulacion
                }
              >
                Anular ingreso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}