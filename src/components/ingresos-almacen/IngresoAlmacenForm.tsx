import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'

import { obtenerContactos } from '../../services/contactoService'
import { obtenerProductos } from '../../services/productoService'
import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposDocumento } from '../../services/tipoDocumentoService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'
import { obtenerUnidadesMedida } from '../../services/unidadMedidaService'

import type {
  DetalleIngresoAlmacenFormData,
  IngresoAlmacenFormData,
  IngresoAlmacenRegistro,
} from '../../types/ingresoAlmacen'

interface IngresoAlmacenFormProps {
  ingreso?: IngresoAlmacenRegistro | null
  onSubmit: (
    datos: IngresoAlmacenFormData,
  ) => void
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

  const tiposProducto = useMemo(
    () => obtenerTiposProducto(),
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

  const [fechaIngreso, setFechaIngreso] =
    useState(obtenerFechaActual())

  const [proveedorId, setProveedorId] =
    useState('')

  const [contactoId, setContactoId] =
    useState('')

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

  const [detalle, setDetalle] =
    useState<DetalleTemporal>(
      DETALLE_INICIAL,
    )

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!ingreso) {
      setFechaIngreso(obtenerFechaActual())
      setProveedorId('')
      setContactoId('')
      setTipoComprobanteId('')
      setNumeroDocumento('')
      setObservacion('')
      setDetalles([])
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

  const contactosFiltrados =
    useMemo(
      () =>
        contactos.filter(
          (contacto) =>
            contacto.estado &&
            contacto.proveedorId ===
              proveedorId,
        ),
      [contactos, proveedorId],
    )

  const productosFiltrados =
    useMemo(
      () =>
        productos.filter(
          (producto) =>
            producto.estado &&
            producto.proveedorId ===
              proveedorId &&
            producto.tipoProductoId ===
              detalle.tipoProductoId,
        ),
      [
        productos,
        proveedorId,
        detalle.tipoProductoId,
      ],
    )

  const productoSeleccionado =
    useMemo(
      () =>
        productos.find(
          (producto) =>
            producto.id ===
            detalle.productoId,
        ) ?? null,
      [productos, detalle.productoId],
    )

  const unidadSeleccionada =
    useMemo(
      () =>
        unidadesMedida.find(
          (unidad) =>
            String(unidad.id) ===
            String(
              productoSeleccionado
                ?.unidadMedidaId,
            ),
        ) ?? null,
      [
        unidadesMedida,
        productoSeleccionado,
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
      (item) => item.id === productoId,
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
          item.productoId ===
          detalle.productoId,
      )

    if (productoYaAgregado) {
      setError(
        'Este producto ya fue agregado al ingreso.',
      )
      return
    }

    setDetalles((actuales) => [
      ...actuales,
      {
        productoId: detalle.productoId,
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
    productoId: string,
  ): void {
    setDetalles((actuales) =>
      actuales.filter(
        (item) =>
          item.productoId !== productoId,
      ),
    )
  }

  function guardar(
    event: FormEvent<HTMLFormElement>,
  ): void {
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

    if (!numeroDocumento.trim()) {
      setError(
        'Ingresa el número del documento.',
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
      onSubmit({
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
            className="form-label maestro-label"
            htmlFor="ingresoFecha"
          >
            Fecha de ingreso *
          </label>

          <input
            id="ingresoFecha"
            className="form-control maestro-control"
            type="date"
            value={fechaIngreso}
            onChange={(event) =>
              setFechaIngreso(
                event.target.value,
              )
            }
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label maestro-label"
            htmlFor="ingresoProveedor"
          >
            Proveedor *
          </label>

          <select
            id="ingresoProveedor"
            className="form-select maestro-control"
            value={proveedorId}
            onChange={(event) =>
              cambiarProveedor(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {proveedores
              .filter(
                (proveedor) =>
                  proveedor.estado ||
                  String(proveedor.id) ===
                    String(proveedorId),
              )
              .map((proveedor) => (
                <option
                  key={proveedor.id}
                  value={proveedor.id}
                >
                  {proveedor.razonSocial}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label maestro-label"
            htmlFor="ingresoContacto"
          >
            Contacto *
          </label>

          <select
            id="ingresoContacto"
            className="form-select maestro-control"
            value={contactoId}
            disabled={!proveedorId}
            onChange={(event) =>
              setContactoId(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {contactosFiltrados.map(
              (contacto) => (
                <option
                  key={contacto.id}
                  value={contacto.id}
                >
                  {contacto.nombreCompleto}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label maestro-label"
            htmlFor="ingresoTipoDocumento"
          >
            Tipo de documento *
          </label>

          <select
            id="ingresoTipoDocumento"
            className="form-select maestro-control"
            value={tipoDocumentoId}
            onChange={(event) =>
              setTipoComprobanteId(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {tiposDocumento
              .filter(
                (tipo) =>
                  tipo.estado ||
                  String(tipo.id) ===
                    String(tipoDocumentoId),
              )
              .map((tipo) => (
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
            className="form-label maestro-label"
            htmlFor="ingresoNumeroDocumento"
          >
            Número de documento *
          </label>

          <input
            id="ingresoNumeroDocumento"
            className="form-control maestro-control"
            type="text"
            maxLength={50}
            value={numeroDocumento}
            onChange={(event) =>
              setNumeroDocumento(
                event.target.value,
              )
            }
          />
        </div>

        <div className="col-12">
          <label
            className="form-label maestro-label"
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
            className="form-label maestro-label"
            htmlFor="detalleTipoProducto"
          >
            Tipo de producto *
          </label>

          <select
            id="detalleTipoProducto"
            className="form-select maestro-control"
            value={detalle.tipoProductoId}
            disabled={!proveedorId}
            onChange={(event) =>
              cambiarTipoProducto(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {tiposProducto
              .filter((tipo) => tipo.estado)
              .map((tipo) => (
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
            className="form-label maestro-label"
            htmlFor="detalleProducto"
          >
            Producto *
          </label>

          <select
            id="detalleProducto"
            className="form-select maestro-control"
            value={detalle.productoId}
            disabled={
              !proveedorId ||
              !detalle.tipoProductoId
            }
            onChange={(event) =>
              cambiarProducto(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {productosFiltrados.map(
              (producto) => (
                <option
                  key={producto.id}
                  value={producto.id}
                >
                  {producto.codigo} -{' '}
                  {producto.nombre}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="col-12 col-md-3">
          <label
            className="form-label maestro-label"
            htmlFor="detalleUnidad"
          >
            Unidad
          </label>

          <input
            id="detalleUnidad"
            className="form-control maestro-control"
            value={
              unidadSeleccionada?.nombre ?? ''
            }
            placeholder="Automático"
            readOnly
          />
        </div>

        <div className="col-12 col-md-3">
          <label
            className="form-label maestro-label"
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
            className="form-label maestro-label"
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
              const producto =
                productos.find(
                  (productoActual) =>
                    productoActual.id ===
                    item.productoId,
                )

              const tipoProducto =
                tiposProducto.find(
                  (tipo) =>
                    String(tipo.id) ===
                    producto
                      ?.tipoProductoId,
                )

              return (
                <tr key={item.productoId}>
                  <td>
                    <strong>
                      {producto?.nombre ??
                        'Producto no disponible'}
                    </strong>

                    <div className="small text-secondary">
                      {producto?.codigo}
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
                      className="btn btn-sm btn-outline-danger"
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
