import { Placeholder } from '../../constants/placeholders'
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { createPortal } from 'react-dom'

import {
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'

import {
  listarProductosCombo,
  obtenerProductos,
  type ProductoCombo,
} from '../../services/productoService'
import {
  listarContactosCombo,
  listarProveedoresCombo,
  listarTiposDocumentoCombo,
  listarTiposProductoCombo,
} from '../../services/comboService'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

import type {
  DetalleIngresoAlmacenFormData,
  IngresoAlmacenFormData,
  IngresoAlmacenRegistro,
} from '../../types/ingresoAlmacen'
import type { Contacto } from '../../types/contacto'
import type { Proveedor } from '../../types/proveedor'
import type { TipoDocumento } from '../../types/tipoDocumento'
import type { TipoProducto } from '../../types/tipoProducto'

interface IngresoAlmacenFormProps {
  ingreso?: IngresoAlmacenRegistro | null
  onSubmit: (
    datos: IngresoAlmacenFormData,
  ) => void | Promise<void>
  onCancelar: () => void
}

interface DetalleTemporal {
  tipoProductoId: string
  productoId: string
  cantidad: string
  precioUnitario: string
}

const DETALLE_INICIAL: DetalleTemporal = {
  tipoProductoId: '',
  productoId: '',
  cantidad: '',
  precioUnitario: '',
}

function obtenerFechaActual(): string {
  const fecha = new Date()
  const diferenciaZona =
    fecha.getTimezoneOffset() * 60_000

  return new Date(
    fecha.getTime() - diferenciaZona,
  )
    .toISOString()
    .slice(0, 10)
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

function obtenerMensajeError(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function IngresoAlmacenForm({
  ingreso = null,
  onSubmit,
  onCancelar,
}: IngresoAlmacenFormProps) {
  const [proveedores, setProveedores] =
    useState<Proveedor[]>([])

  const [cargandoProveedores, setCargandoProveedores] =
    useState(false)

  const [tiposDocumento, setTiposDocumento] =
    useState<TipoDocumento[]>([])

  const [cargandoTiposDocumento, setCargandoTiposDocumento] =
    useState(false)

  const [tiposProducto, setTiposProducto] =
    useState<TipoProducto[]>([])

  const [cargandoTiposProducto, setCargandoTiposProducto] =
    useState(false)

  const productos = useMemo(() => obtenerProductos(), [])

  const [productosFiltrados, setProductosFiltrados] =
    useState<ProductoCombo[]>([])

  const [cargandoProductos, setCargandoProductos] =
    useState(false)

  const [fechaIngreso, setFechaIngreso] =
    useState(obtenerFechaActual())

  const [proveedorId, setProveedorId] =
    useState('')

  const [contactoId, setContactoId] =
    useState('')

  const [contactosFiltrados, setContactosFiltrados] =
    useState<Contacto[]>([])

  const [cargandoContactos, setCargandoContactos] =
    useState(false)

  const [
    tipoDocumentoId,
    setTipoComprobanteId,
  ] = useState('')

  const [
    numeroDocumento,
    setNumeroDocumento,
  ] = useState('')

  const [observacion, setObservacion] =
    useState('')

  const [detalles, setDetalles] =
    useState<
      DetalleIngresoAlmacenFormData[]
    >([])

  const [productosComboSeleccionados, setProductosComboSeleccionados] =
    useState<Record<number, ProductoCombo & { tipoProductoId: string }>>({})

  const [detalle, setDetalle] =
    useState<DetalleTemporal>(
      DETALLE_INICIAL,
    )

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    setCargandoProveedores(true)

    listarProveedoresCombo()
      .then((respuesta) => {
        if (!cancelado) {
          setProveedores(respuesta
            .filter((proveedor) => proveedor.id != null)
            .map((proveedor) => ({
              id: proveedor.id as number,
              ruc: '',
              razonSocial: proveedor.descripcion ?? '',
              correo: '',
              telefono: '',
              direccion: '',
              activo: 1,
              fechaRegistro: '',
            })))
        }
      })
      .catch((errorProveedor: unknown) => {
        if (cancelado) return
        setProveedores([])
        setError(
          errorProveedor instanceof Error
            ? errorProveedor.message
            : 'No se pudieron cargar los proveedores.',
        )
      })
      .finally(() => {
        if (!cancelado) setCargandoProveedores(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    setCargandoTiposProducto(true)

    listarTiposProductoCombo()
      .then((respuesta) => {
        if (!cancelado) {
          setTiposProducto(respuesta
            .filter((tipo) => tipo.id != null)
            .map((tipo) => ({
              id: tipo.id as number,
              nombre: tipo.descripcion ?? '',
              descripcion: '',
              activo: 1,
              fechaRegistro: '',
            })))
        }
      })
      .catch((errorTipoProducto: unknown) => {
        if (cancelado) return
        setTiposProducto([])
        setError(
          errorTipoProducto instanceof Error
            ? errorTipoProducto.message
            : 'No se pudieron cargar los tipos de producto.',
        )
      })
      .finally(() => {
        if (!cancelado) setCargandoTiposProducto(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    setCargandoTiposDocumento(true)

    listarTiposDocumentoCombo()
      .then((respuesta) => {
        if (!cancelado) {
          setTiposDocumento(respuesta
            .filter((tipo) => tipo.id != null)
            .map((tipo) => ({
              id: tipo.id as number,
              nombre: tipo.descripcion ?? '',
              descripcion: '',
              activo: 1,
              fechaRegistro: '',
            })))
        }
      })
      .catch((errorTipoDocumento: unknown) => {
        if (cancelado) return
        setTiposDocumento([])
        setError(
          errorTipoDocumento instanceof Error
            ? errorTipoDocumento.message
            : 'No se pudieron cargar los tipos de documento.',
        )
      })
      .finally(() => {
        if (!cancelado) setCargandoTiposDocumento(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    if (!ingreso) {
      setFechaIngreso(obtenerFechaActual())
      setProveedorId('')
      setContactoId('')
      setTipoComprobanteId('')
      setNumeroDocumento('')
      setObservacion('')
      setDetalles([])
      setProductosComboSeleccionados({})
      setDetalle(DETALLE_INICIAL)
      setError(null)
      return
    }

    setFechaIngreso(ingreso.fechaIngreso)
    setProveedorId(ingreso.proveedorId)
    setContactoId(ingreso.contactoId)
    setTipoComprobanteId(
      ingreso.tipoDocumentoId,
    )
    setNumeroDocumento(
      ingreso.numeroDocumento,
    )
    setObservacion(ingreso.observacion)

    setDetalles(
      ingreso.detalles.map(
        ({
          productoId,
          cantidad,
          precioUnitario,
        }) => ({
          productoId,
          cantidad,
          precioUnitario,
        }),
      ),
    )

    setDetalle(DETALLE_INICIAL)
    setError(null)
  }, [ingreso])

  useEffect(() => {
    if (!proveedorId) {
      setContactosFiltrados([])
      setCargandoContactos(false)
      return
    }

    let cancelado = false
    setCargandoContactos(true)

    listarContactosCombo(Number(String(proveedorId).replace(/^PROV-0*/i, '')))
      .then((respuesta) => {
        if (cancelado) return

        const contactosActivos = respuesta
          .filter((contacto) => contacto.id != null)
          .map((contacto) => ({
            id: contacto.id as number,
            proveedorId: Number(String(proveedorId).replace(/^PROV-0*/i, '')),
            nombreCompleto: contacto.descripcion ?? '',
            cargo: '',
            telefono: '',
            correo: '',
            activo: 1 as const,
            fechaRegistro: '',
          }))
        setContactosFiltrados(contactosActivos)

        if (
          contactoId &&
          !contactosActivos.some(
            (contacto) => String(contacto.id) === String(contactoId),
          )
        ) {
          setContactoId('')
        }
      })
      .catch(() => {
        if (!cancelado) {
          setContactosFiltrados([])
          setContactoId('')
        }
      })
      .finally(() => {
        if (!cancelado) setCargandoContactos(false)
      })

    return () => {
      cancelado = true
    }
  }, [proveedorId])

  useEffect(() => {
    if (!proveedorId || !detalle.tipoProductoId) {
      setProductosFiltrados([])
      setCargandoProductos(false)
      return
    }

    let cancelado = false
    setCargandoProductos(true)

    listarProductosCombo({
      proveedorId,
      tipoProductoId: detalle.tipoProductoId,
    })
      .then((respuesta) => {
        if (cancelado) return
        setProductosFiltrados(respuesta)

        if (
          detalle.productoId &&
          !respuesta.some(
            (producto) => String(producto.id) === String(detalle.productoId),
          )
        ) {
          setDetalle((actual) => ({
            ...actual,
            productoId: '',
            precioUnitario: '',
          }))
        }
      })
      .catch(() => {
        if (!cancelado) {
          setProductosFiltrados([])
          setDetalle((actual) => ({
            ...actual,
            productoId: '',
            precioUnitario: '',
          }))
        }
      })
      .finally(() => {
        if (!cancelado) setCargandoProductos(false)
      })

    return () => {
      cancelado = true
    }
  }, [proveedorId, detalle.tipoProductoId])

  const unidadSeleccionada =
    useMemo(
      () =>
        productosFiltrados.find(
          (producto) => String(producto.id) === String(detalle.productoId),
        )?.unidadMedida ?? '',
      [
        productosFiltrados,
        detalle.productoId,
      ],
    )

  const totalIngreso = useMemo(
    () =>
      detalles.reduce(
        (total, item) =>
          total +
          item.cantidad *
            item.precioUnitario,
        0,
      ),
    [detalles],
  )

  function cambiarProveedor(
    nuevoProveedorId: string,
  ): void {
    setProveedorId(nuevoProveedorId)
    setContactoId('')
    setDetalles([])
    setProductosComboSeleccionados({})
    setDetalle(DETALLE_INICIAL)
    setError(null)
  }

  function cambiarTipoProducto(
    nuevoTipoId: string,
  ): void {
    setDetalle((actual) => ({
      ...actual,
      tipoProductoId: nuevoTipoId,
      productoId: '',
      cantidad: '',
      precioUnitario: '',
    }))

    setError(null)
  }

  function cambiarProducto(
    productoId: string,
  ): void {
    const producto = productos.find(
      (item) => String(item.productoId) === productoId,
    )

    setDetalle((actual) => ({
      ...actual,
      productoId,
      precioUnitario: producto
        ? String(producto.precioUnitario)
        : '',
    }))

    setError(null)
  }

  function agregarDetalle(): void {
    if (!proveedorId) {
      setError(
        'Selecciona primero un proveedor.',
      )
      return
    }

    if (!detalle.tipoProductoId) {
      setError(
        'Selecciona un tipo de producto.',
      )
      return
    }

    if (!detalle.productoId) {
      setError('Selecciona un producto.')
      return
    }

    const cantidad = Number(
      detalle.cantidad,
    )

    const precioUnitario = Number(
      detalle.precioUnitario,
    )

    if (
      !Number.isFinite(cantidad) ||
      cantidad <= 0
    ) {
      setError(
        'La cantidad debe ser mayor que cero.',
      )
      return
    }

    if (
      !Number.isFinite(precioUnitario) ||
      precioUnitario < 0
    ) {
      setError(
        'El precio unitario no es válido.',
      )
      return
    }

    const productoYaAgregado =
      detalles.some(
        (item) =>
          String(item.productoId) ===
          detalle.productoId,
      )

    if (productoYaAgregado) {
      setError(
        'Este producto ya fue agregado al ingreso.',
      )
      return
    }

    const productoCombo = productosFiltrados.find(
      (producto) => String(producto.id) === detalle.productoId,
    )

    if (productoCombo) {
      setProductosComboSeleccionados((actuales) => ({
        ...actuales,
        [productoCombo.id]: {
          ...productoCombo,
          tipoProductoId: detalle.tipoProductoId,
        },
      }))
    }

    setDetalles((actuales) => [
      ...actuales,
      {
        productoId: Number(detalle.productoId),
        cantidad: Number(
          cantidad.toFixed(3),
        ),
        precioUnitario: Number(
          precioUnitario.toFixed(2),
        ),
      },
    ])

    setDetalle((actual) => ({
      ...DETALLE_INICIAL,
      tipoProductoId:
        actual.tipoProductoId,
    }))

    setError(null)
  }

  function eliminarDetalle(
    productoId: number,
  ): void {
    setDetalles((actuales) =>
      actuales.filter(
        (item) =>
          item.productoId !== productoId,
      ),
    )
  }

  async function guardar(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault()
    setError(null)

    if (!fechaIngreso) {
      setError(
        'Selecciona la fecha del ingreso.',
      )
      return
    }

    if (!proveedorId) {
      setError('Selecciona un proveedor.')
      return
    }

    if (!contactoId) {
      setError('Selecciona un contacto.')
      return
    }

    if (!tipoDocumentoId) {
      setError(
        'Selecciona un tipo de documento.',
      )
      return
    }

    if (!/^\d{7}$/.test(numeroDocumento)) {
      setError(
        'El número de documento debe tener exactamente 7 dígitos.',
      )
      return
    }

    if (detalles.length === 0) {
      setError(
        'Agrega al menos un producto.',
      )
      return
    }

    try {
      await onSubmit({
        fechaIngreso,
        proveedorId,
        contactoId,
        tipoDocumentoId,
        numeroDocumento:
          numeroDocumento.trim(),
        observacion: observacion.trim(),
        detalles,
      })
    } catch (errorGuardado) {
      setError(
        obtenerMensajeError(
          errorGuardado,
        ),
      )
    }
  }

  return (
    <form
      className="maestro-panel p-4"
      onSubmit={guardar}
      noValidate
    >
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="h5 mb-1">
            {ingreso
              ? 'Editar ingreso'
              : 'Nuevo ingreso'}
          </h2>

          <p className="text-secondary mb-0">
            Registra la mercadería recibida
            en el almacén.
          </p>
        </div>

        {ingreso && (
          <span className="badge text-bg-light">
            {ingreso.numeroIngreso}
          </span>
        )}
      </div>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="ingresoFecha"
          >
            Fecha de ingreso *
          </label>

          <DatePicker
            id="ingresoFecha"
            className="form-control maestro-control"
            selected={convertirFechaASeleccion(fechaIngreso)}
            onChange={(fecha: Date | null) => setFechaIngreso(convertirSeleccionAFecha(fecha))}
            dateFormat="dd/MM/yyyy"
            locale="es"
            placeholderText={Placeholder.Fecha}
            popperClassName="ingreso-datepicker-popper"
            popperContainer={(props) =>
              createPortal(props.children, document.body)
            }
            autoComplete="off"
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="ingresoProveedor"
          >
            Proveedor *
          </label>

          <Select
            inputId="ingresoProveedor"
            classNamePrefix="maestro-select"
            styles={crearEstilosSelect()}
            placeholder={cargandoProveedores ? 'Cargando proveedores...' : 'Seleccione'}
            isLoading={cargandoProveedores}
            isClearable
            isDisabled={cargandoProveedores}
            options={proveedores
              .filter(
                (proveedor) =>
                  proveedor.activo === 1 ||
                  String(proveedor.id) === String(proveedorId),
              )
              .map((proveedor) => ({
                value: String(proveedor.id),
                label: proveedor.razonSocial,
              }))}
            value={proveedores
              .filter((proveedor) => String(proveedor.id) === String(proveedorId))
              .map((proveedor) => ({
                value: String(proveedor.id),
                label: proveedor.razonSocial,
              }))[0] ?? null}
            onChange={(option) => cambiarProveedor(option?.value ?? '')}
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="ingresoContacto"
          >
            Contacto *
          </label>

          <Select
            inputId="ingresoContacto"
            classNamePrefix="maestro-select"
            styles={crearEstilosSelect()}
            placeholder={cargandoContactos ? 'Cargando contactos...' : 'Seleccione'}
            isClearable
            isLoading={cargandoContactos}
            isDisabled={!proveedorId || cargandoContactos}
            options={contactosFiltrados.map((contacto) => ({
              value: String(contacto.id),
              label: contacto.nombreCompleto,
            }))}
            value={contactosFiltrados
              .filter((contacto) => String(contacto.id) === String(contactoId))
              .map((contacto) => ({
                value: String(contacto.id),
                label: contacto.nombreCompleto,
              }))[0] ?? null}
            onChange={(option) => setContactoId(option?.value ?? '')}
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="ingresoTipoDocumento"
          >
            Tipo de documento *
          </label>

          <Select
            inputId="ingresoTipoDocumento"
            classNamePrefix="maestro-select"
            styles={crearEstilosSelect()}
            placeholder={cargandoTiposDocumento ? 'Cargando tipos de documento...' : 'Seleccione'}
            isLoading={cargandoTiposDocumento}
            isClearable
            isDisabled={cargandoTiposDocumento}
            options={tiposDocumento
              .filter(
                (tipo) =>
                  tipo.activo === 1 ||
                  String(tipo.id) === String(tipoDocumentoId),
              )
              .map((tipo) => ({
                value: String(tipo.id),
                label: tipo.nombre,
              }))}
            value={tiposDocumento
              .filter((tipo) => String(tipo.id) === String(tipoDocumentoId))
              .map((tipo) => ({
                value: String(tipo.id),
                label: tipo.nombre,
              }))[0] ?? null}
            onChange={(option) => setTipoComprobanteId(option?.value ?? '')}
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="ingresoNumeroDocumento"
          >
            Número de documento *
          </label>

          <input
            id="ingresoNumeroDocumento"
            className="form-control maestro-control"
            type="text"
            maxLength={7}
            inputMode="numeric"
            pattern="[0-9]{7}"
            value={numeroDocumento}
            onChange={(event) =>
              setNumeroDocumento(
                event.target.value
                  .replace(/\D/g, '')
                  .slice(0, 7),
              )
            }
          />
        </div>

        <div className="col-12">
          <label
            className="form-label"
            htmlFor="ingresoObservacion"
          >
            Observación
          </label>

          <textarea
            id="ingresoObservacion"
            className="form-control maestro-control"
            rows={3}
            maxLength={500}
            value={observacion}
            onChange={(event) =>
              setObservacion(
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <hr className="my-4" />

      <h3 className="h6 mb-3">
        Agregar productos
      </h3>

      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="detalleTipoProducto"
          >
            Tipo de producto *
          </label>

          <Select
            inputId="detalleTipoProducto"
            classNamePrefix="maestro-select"
            styles={crearEstilosSelect()}
            placeholder="Seleccione"
            isClearable
            isLoading={cargandoTiposProducto}
            isDisabled={!proveedorId || cargandoTiposProducto}
            options={tiposProducto
              .filter((tipo) => tipo.activo === 1)
              .map((tipo) => ({
                value: String(tipo.id),
                label: tipo.nombre,
              }))}
            value={tiposProducto
              .filter((tipo) => String(tipo.id) === String(detalle.tipoProductoId))
              .map((tipo) => ({
                value: String(tipo.id),
                label: tipo.nombre,
              }))[0] ?? null}
            onChange={(option) => cambiarTipoProducto(option?.value ?? '')}
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label"
            htmlFor="detalleProducto"
          >
            Producto *
          </label>

          <Select
            inputId="detalleProducto"
            classNamePrefix="maestro-select"
            styles={crearEstilosSelect()}
            placeholder="Seleccione"
            isClearable
            isLoading={cargandoProductos}
            isDisabled={!proveedorId || !detalle.tipoProductoId || cargandoProductos}
            options={productosFiltrados.map((producto) => ({
              value: String(producto.id),
              label: producto.descripcion,
            }))}
            value={productosFiltrados
              .filter((producto) => String(producto.id) === String(detalle.productoId))
              .map((producto) => ({
                value: String(producto.id),
                label: producto.descripcion,
              }))[0] ?? null}
            onChange={(option) => cambiarProducto(option?.value ?? '')}
          />
        </div>

        <div className="col-12 col-md-3">
          <label
            className="form-label"
            htmlFor="detalleUnidad"
          >
            Unidad
          </label>

          <input
            id="detalleUnidad"
            className="form-control maestro-control"
            value={unidadSeleccionada}
            placeholder="Automático"
            readOnly
          />
        </div>

        <div className="col-12 col-md-3">
          <label
            className="form-label"
            htmlFor="detalleCantidad"
          >
            Cantidad *
          </label>

          <input
            id="detalleCantidad"
            className="form-control maestro-control"
            type="number"
            min="0.001"
            step="0.001"
            value={detalle.cantidad}
            onChange={(event) =>
              setDetalle((actual) => ({
                ...actual,
                cantidad:
                  event.target.value,
              }))
            }
          />
        </div>

        <div className="col-12 col-md-3">
          <label
            className="form-label"
            htmlFor="detallePrecio"
          >
            Precio unitario *
          </label>

          <input
            id="detallePrecio"
            className="form-control maestro-control"
            type="number"
            min="0"
            step="0.01"
            value={detalle.precioUnitario}
            onChange={(event) =>
              setDetalle((actual) => ({
                ...actual,
                precioUnitario:
                  event.target.value,
              }))
            }
          />
        </div>

        <div className="col-12 col-md-3">
          <button
            type="button"
            className="btn btn-maestro-primary w-100"
            onClick={agregarDetalle}
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>
      </div>

      <div className="table-responsive mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th className="text-end">
                Cantidad
              </th>
              <th className="text-end">
                Precio
              </th>
              <th className="text-end">
                Subtotal
              </th>
              <th aria-label="Acciones" />
            </tr>
          </thead>

          <tbody>
            {detalles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-secondary py-4"
                >
                  Todavía no agregaste productos.
                </td>
              </tr>
            )}

            {detalles.map((item) => {
              const productoCombo =
                productosComboSeleccionados[item.productoId]

              const producto =
                productos.find(
                  (productoActual) =>
                    productoActual.productoId ===
                    item.productoId,
                )

              const tipoProducto =
                tiposProducto.find(
                  (tipo) =>
                    String(tipo.id) ===
                    String(
                      producto?.tipoProductoId ??
                        productoCombo?.tipoProductoId,
                    ),
                )

              return (
                <tr key={item.productoId}>
                  <td>
                    <strong>
                      {productoCombo?.descripcion ??
                        producto?.nombre ??
                        'Producto no disponible'}
                    </strong>

                    <div className="small text-secondary">
                      {producto?.codigo ?? ''}
                    </div>
                  </td>

                  <td>
                    {tipoProducto?.nombre ??
                      'Sin tipo'}
                  </td>

                  <td className="text-end">
                    {item.cantidad}
                  </td>

                  <td className="text-end">
                    S/ {item.precioUnitario.toFixed(2)}
                  </td>

                  <td className="text-end">
                    S/{' '}
                    {(
                      item.cantidad *
                      item.precioUnitario
                    ).toFixed(2)}
                  </td>

                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-maestro-danger"
                      aria-label="Quitar producto"
                      onClick={() =>
                        eliminarDetalle(
                          item.productoId,
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            <tr>
              <th
                colSpan={5}
                className="text-end"
              >
                Total
              </th>

              <th className="text-end">
                S/ {totalIngreso.toFixed(2)}
              </th>

              <th />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-maestro-danger"
          onClick={onCancelar}
        >
          <X size={18} />
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-maestro-primary"
        >
          <Save size={18} />
          Guardar ingreso
        </button>
      </div>
    </form>
  )
}
