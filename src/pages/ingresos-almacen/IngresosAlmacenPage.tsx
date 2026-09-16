import { Placeholder } from '../../constants/placeholders'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import {
  CalendarDays,
  Filter,
  PackagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { TablePagination } from '../../components/ui/TablePagination'
import { EmptyState } from '../../components/common/EmptyState'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'
import { ValidadorRangoFechas } from '../../utils/ValidadorRangoFechas'

import {
  anularIngresoAlmacen,
  calcularTotalIngreso,
  obtenerIngresosAlmacen,
} from '../../services/ingresoAlmacenService'

import { obtenerContactos } from '../../services/contactoService'
import { obtenerProductos } from '../../services/productoService'
import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposDocumento } from '../../services/tipoDocumentoService'
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

function convertirFechaASeleccion(fecha: string): Date | null {
  if (!fecha) {
    return null
  }

  const [anio, mes, dia] = fecha.split('-').map(Number)
  const seleccion = new Date(anio, mes - 1, dia)

  return Number.isNaN(seleccion.getTime()) ? null : seleccion
}

function convertirSeleccionAFecha(fecha: Date | null): string {
  if (!fecha) {
    return ''
  }

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function desplazarFecha(
  fecha: Date | null,
  dias: number,
): Date | undefined {
  if (!fecha) {
    return undefined
  }

  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + dias)
  return resultado
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
              String(item.id) ===
              String(ingreso.proveedorId),
          )

        const contacto = contactos.find(
          (item) =>
            String(item.id) ===
            String(ingreso.contactoId),
        )

        const tipoDocumento =
          tiposDocumento.find(
            (item) =>
              String(item.id) ===
              String(ingreso.tipoDocumentoId),
          )

        const detallesProductos =
        ingreso.detalles.map((detalle) => {
          const producto = productos.find(
            (item) =>
              item.id === detalle.productoId,
          )

          const unidad = unidadesMedida.find(
            (item) =>
              String(item.id) ===
              String(producto?.unidadMedidaId),
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

  function aplicarFiltros(): void {
    const errorRango = ValidadorRangoFechas.validar(
      filtros.fechaDesde,
      filtros.fechaHasta,
    )

    if (errorRango) {
      setMensaje({
        tipo: 'danger',
        texto: errorRango,
      })
      return
    }

    setFiltrosAplicados({ ...filtros })
    setPage(1)
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
            <section className="maestro-filter-card card border-0 shadow-sm">
              <div className="card-body p-3 p-lg-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                  <div>
                    <span className="maestro-kicker">
                      <Filter size={16} />
                      Filtros de búsqueda
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-lg-4">
                    <label
                      className="form-label"
                      htmlFor="ingresoBusqueda"
                    >
                      Buscar
                    </label>

                    <input
                      id="ingresoBusqueda"
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

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label"
                      htmlFor="ingresoProveedorFiltro"
                    >
                      Proveedor
                    </label>

                    <Select
                      inputId="ingresoProveedorFiltro"
                      classNamePrefix="maestro-select"
                      options={proveedores.map((proveedor) => ({ value: String(proveedor.id), label: proveedor.razonSocial }))}
                      value={proveedores.map((proveedor) => ({ value: String(proveedor.id), label: proveedor.razonSocial })).find((option) => option.value === filtros.proveedorId) ?? null}
                      onChange={(option) => setFiltros((actual) => ({ ...actual, proveedorId: option?.value ?? '' }))}
                      placeholder={Placeholder.Seleccionar}
                      isClearable
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={crearEstilosSelect({ zIndex: 20 })}
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label"
                      htmlFor="ingresoEstadoFiltro"
                    >
                      Estado
                    </label>

                    <Select
                      inputId="ingresoEstadoFiltro"
                      classNamePrefix="maestro-select"
                      options={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }]}
                      value={[{ value: 'REGISTRADO', label: 'Registrado' }, { value: 'ANULADO', label: 'Anulado' }].find((option) => option.value === filtros.estado) ?? null}
                      onChange={(option) => setFiltros((actual) => ({ ...actual, estado: option?.value ?? '' }))}
                      placeholder={Placeholder.Seleccionar}
                      isClearable
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={crearEstilosSelect({ zIndex: 20 })}
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label"
                      htmlFor="ingresoDesde"
                    >
                      Fecha desde
                    </label>

                    <DatePicker
                      id="ingresoDesde"
                      className="form-control maestro-control"
                      selected={convertirFechaASeleccion(filtros.fechaDesde)}
                      maxDate={desplazarFecha(
                        convertirFechaASeleccion(filtros.fechaHasta),
                        -1,
                      )}
                      onChange={(fecha: Date | null) =>
                        setFiltros((actual) => ({
                          ...actual,
                          fechaDesde: convertirSeleccionAFecha(fecha),
                        }))
                      }
                      dateFormat="dd/MM/yyyy"
                      locale="es"
                      placeholderText={Placeholder.Fecha}
                      popperClassName="ingreso-datepicker-popper"
                      popperContainer={(props) =>
                        createPortal(props.children, document.body)
                      }
                      isClearable
                      autoComplete="off"
                    />
                  </div>

                  <div className="col-12 col-md-6 col-lg-2">
                    <label
                      className="form-label"
                      htmlFor="ingresoHasta"
                    >
                      Fecha hasta
                    </label>

                    <DatePicker
                      id="ingresoHasta"
                      className="form-control maestro-control"
                      selected={convertirFechaASeleccion(filtros.fechaHasta)}
                      minDate={desplazarFecha(
                        convertirFechaASeleccion(filtros.fechaDesde),
                        1,
                      )}
                      onChange={(fecha: Date | null) =>
                        setFiltros((actual) => ({
                          ...actual,
                          fechaHasta: convertirSeleccionAFecha(fecha),
                        }))
                      }
                      dateFormat="dd/MM/yyyy"
                      locale="es"
                      placeholderText={Placeholder.Fecha}
                      popperClassName="ingreso-datepicker-popper"
                      popperContainer={(props) =>
                        createPortal(props.children, document.body)
                      }
                      isClearable
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="maestro-filter-actions mt-3">
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
                    <RotateCcw size={18} />
                    Limpiar
                  </button>

                  <button
                    type="button"
                    className="btn btn-maestro-primary"
                    onClick={aplicarFiltros}
                  >
                    <Search size={18} />
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
                    <PackagePlus size={16} />
                    Listado de ingresos
                  </span>

                  <button
                    type="button"
                    className="btn btn-maestro-primary"
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
                  <table className="table standard-table align-middle mb-0">
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
                            <EmptyState icon={PackagePlus} iconSize={28} title="No se encontraron ingresos" description="Registra el primer ingreso de mercadería." />
                          </td>
                        </tr>
                      ) : (
                        ingresosPaginados.map(
                          (ingreso) => (
                            <tr key={ingreso.id}>
                              <td>
                                <span className="table-id-chip">
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
                                      ? 'status-label status-label--active'
                                      : 'status-label status-label--inactive'
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
                                <div className="table-actions">
                                  <button
                                    type="button"
                                    className="btn table-action-btn"
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
                                    className="btn table-action-btn table-action-btn--danger"
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
                className="btn btn-maestro-danger"
                onClick={() =>
                  setIngresoAAnular(null)
                }
              >
                <X size={18} />
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-maestro-danger"
                onClick={
                  confirmarAnulacion
                }
              >
                <Trash2 size={18} />
                Anular ingreso
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
