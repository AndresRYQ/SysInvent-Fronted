import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CalendarDays,
  ClipboardList,
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

import { obtenerCentrosCosto } from '../../services/centroCostoService'
import { obtenerDestinos } from '../../services/destinoService'
import { obtenerProductos } from '../../services/productoService'

import {
  anularValeConsumo,
  calcularCantidadDetalle,
  calcularTotalVale,
  obtenerValesConsumo,
} from '../../services/valeConsumoService'

import type { ValeConsumo } from '../../types/valeConsumo'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

interface FiltrosVales {
  busqueda: string
  centroCostoId: string
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

const FILTROS_INICIALES: FiltrosVales = {
  busqueda: '',
  centroCostoId: '',
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

export function ValesConsumoPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [vales, setVales] =
    useState<ValeConsumo[]>(
      () => obtenerValesConsumo(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosVales>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosVales>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(10)

  const [
    valeAAnular,
    setValeAAnular,
  ] = useState<ValeConsumo | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  const centrosCosto = useMemo(
    () => obtenerCentrosCosto(),
    [],
  )

  const destinos = useMemo(
    () => obtenerDestinos(),
    [],
  )

  const productos = useMemo(
    () => obtenerProductos(),
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

  const valesConDetalle = useMemo(
    () =>
      vales.map((vale) => {
        const centroCosto =
          centrosCosto.find(
            (item) =>
              String(item.id) ===
              String(vale.centroCostoId),
          )

        const nombresProductos =
          vale.detalles.map(
            (detalle) =>
              productos.find(
                (producto) =>
                  producto.id ===
                  detalle.productoId,
              )?.nombre ??
              'Producto no disponible',
          )

        const destinosIds = new Set(
          vale.detalles.flatMap(
            (detalle) =>
              detalle.distribuciones.map(
                (distribucion) =>
                  distribucion.destinoId,
              ),
          ),
        )

        const nombresDestinos =
          Array.from(destinosIds).map(
            (destinoId) =>
              destinos.find(
                (destino) =>
                  String(destino.id) ===
                  String(destinoId),
              )?.nombre ??
              'Destino no disponible',
          )

        const cantidadTotal =
          vale.detalles.reduce(
            (total, detalle) =>
              total +
              calcularCantidadDetalle(
                detalle,
              ),
            0,
          )

        return {
          ...vale,
          centroCostoNombre:
            centroCosto?.nombre ??
            'Centro no disponible',
          productosResumen:
            nombresProductos.join(', '),
          destinosResumen:
            nombresDestinos.join(', '),
          totalDestinos:
            destinosIds.size,
          cantidadTotal: Number(
            cantidadTotal.toFixed(3),
          ),
          total: calcularTotalVale(vale),
        }
      }),
    [
      vales,
      centrosCosto,
      destinos,
      productos,
    ],
  )

  const valesFiltrados = useMemo(
    () => {
      const busqueda =
        filtrosAplicados.busqueda
          .trim()
          .toLowerCase()

      return valesConDetalle.filter(
        (vale) => {
          const coincideBusqueda =
            !busqueda ||
            vale.numeroVale
              .toLowerCase()
              .includes(busqueda) ||
            vale.solicitante
              .toLowerCase()
              .includes(busqueda) ||
            vale.productosResumen
              .toLowerCase()
              .includes(busqueda) ||
            vale.destinosResumen
              .toLowerCase()
              .includes(busqueda)

          const coincideCentro =
            !filtrosAplicados.centroCostoId ||
            vale.centroCostoId ===
              filtrosAplicados.centroCostoId

          const coincideEstado =
            !filtrosAplicados.estado ||
            vale.estado ===
              filtrosAplicados.estado

          const coincideDesde =
            !filtrosAplicados.fechaDesde ||
            vale.fechaVale >=
              filtrosAplicados.fechaDesde

          const coincideHasta =
            !filtrosAplicados.fechaHasta ||
            vale.fechaVale <=
              filtrosAplicados.fechaHasta

          return (
            coincideBusqueda &&
            coincideCentro &&
            coincideEstado &&
            coincideDesde &&
            coincideHasta
          )
        },
      )
    },
    [
      valesConDetalle,
      filtrosAplicados,
    ],
  )

  const totalItems =
    valesFiltrados.length

  const valesPaginados = useMemo(
    () => {
      const inicio =
        (page - 1) * pageSize

      return valesFiltrados.slice(
        inicio,
        inicio + pageSize,
      )
    },
    [
      valesFiltrados,
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
    if (!valeAAnular) {
      return
    }

    try {
      const valeAnulado =
        anularValeConsumo(
          valeAAnular.id,
        )

      setVales(obtenerValesConsumo())

      setMensaje({
        tipo: 'success',
        texto:
          `Vale ${valeAnulado.numeroVale} anulado correctamente.`,
      })
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto: obtenerMensajeError(error),
      })
    } finally {
      setValeAAnular(null)
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Vales de consumo</h1>

              <p>
                Salidas y distribución de productos
                hacia destinos y partes de equipo.
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
                      htmlFor="valeBusqueda"
                    >
                      Buscar
                    </label>

                    <input
                      id="valeBusqueda"
                      className="form-control maestro-control"
                      placeholder="Vale, solicitante, producto o destino"
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
                      htmlFor="valeCentroFiltro"
                    >
                      Centro de costo
                    </label>

                    <select
                      id="valeCentroFiltro"
                      className="form-select maestro-control"
                      value={
                        filtros.centroCostoId
                      }
                      onChange={(event) =>
                        setFiltros(
                          (actual) => ({
                            ...actual,
                            centroCostoId:
                              event.target
                                .value,
                          }),
                        )
                      }
                    >
                      <option value="">
                        Todos
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

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label maestro-label"
                      htmlFor="valeEstadoFiltro"
                    >
                      Estado
                    </label>

                    <select
                      id="valeEstadoFiltro"
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
                      htmlFor="valeDesde"
                    >
                      Desde
                    </label>

                    <input
                      id="valeDesde"
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
                      htmlFor="valeHasta"
                    >
                      Hasta
                    </label>

                    <input
                      id="valeHasta"
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
                    <ClipboardList size={16} />
                    Listado de vales
                  </span>

                  <button
                    type="button"
                    className="btn maestro-toolbar-btn"
                    onClick={() =>
                      navigate(
                        '/vales-consumo/nuevo',
                      )
                    }
                  >
                    <Plus size={18} />
                    Registrar vale
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table maestro-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Fecha</th>
                        <th>Centro de costo</th>
                        <th>Solicitante</th>
                        <th>Productos</th>
                        <th>Destinos</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th className="text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {valesPaginados.length ===
                      0 ? (
                        <tr>
                          <td colSpan={10}>
                            <div className="maestro-empty-state">
                              <ClipboardList
                                size={28}
                              />

                              <p className="mb-1">
                                No se encontraron
                                vales
                              </p>

                              <span>
                                Registra el primer
                                vale de consumo.
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        valesPaginados.map(
                          (vale) => (
                            <tr key={vale.id}>
                              <td>
                                <span className="maestro-id-chip">
                                  {
                                    vale.numeroVale
                                  }
                                </span>
                              </td>

                              <td>
                                <CalendarDays
                                  size={15}
                                  className="me-1"
                                />

                                {formatearFecha(
                                  vale.fechaVale,
                                )}
                              </td>

                              <td>
                                {
                                  vale.centroCostoNombre
                                }
                              </td>

                              <td>
                                {vale.solicitante}
                              </td>

                              <td
                                title={
                                  vale.productosResumen
                                }
                              >
                                {
                                  vale.detalles
                                    .length
                                }{' '}
                                producto(s)
                              </td>

                              <td
                                title={
                                  vale.destinosResumen
                                }
                              >
                                {
                                  vale.totalDestinos
                                }{' '}
                                destino(s)
                              </td>

                              <td>
                                {
                                  vale.cantidadTotal
                                }
                              </td>

                              <td>
                                S/{' '}
                                {vale.total.toFixed(
                                  2,
                                )}
                              </td>

                              <td>
                                <span
                                  className={
                                    vale.estado ===
                                    'REGISTRADO'
                                      ? 'maestro-status maestro-status--active'
                                      : 'maestro-status maestro-status--inactive'
                                  }
                                >
                                  <ShieldCheck
                                    size={14}
                                  />

                                  {vale.estado ===
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
                                      vale.estado ===
                                      'ANULADO'
                                    }
                                    onClick={() =>
                                      navigate(
                                        `/vales-consumo/${vale.id}/editar`,
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
                                      vale.estado ===
                                      'ANULADO'
                                    }
                                    onClick={() =>
                                      setValeAAnular(
                                        vale,
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

      {valeAAnular && (
        <div
          className="maestro-modal-backdrop"
          role="presentation"
          onClick={() =>
            setValeAAnular(null)
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
              Anular vale
            </h3>

            <p className="maestro-modal-copy text-center">
              Las cantidades del vale se
              devolverán al stock:
            </p>

            <p className="maestro-delete-name">
              {valeAAnular.numeroVale}
            </p>

            <div className="maestro-modal-footer maestro-modal-footer--center">
              <button
                type="button"
                className="btn maestro-btn-secondary"
                onClick={() =>
                  setValeAAnular(null)
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
                Anular vale
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
