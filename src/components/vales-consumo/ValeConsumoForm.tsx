import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'

import { obtenerCentrosCosto } from '../../services/centroCostoService'
import { obtenerDestinos } from '../../services/destinoService'
import { obtenerPartesEquipo } from '../../services/parteEquipoService'
import { obtenerProductos } from '../../services/productoService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'
import { obtenerUnidadesMedida } from '../../services/unidadMedidaService'

import type {
  DetalleValeConsumoFormData,
  DistribucionValeConsumoFormData,
  ValeConsumo,
  ValeConsumoFormData,
} from '../../types/valeConsumo'

interface ValeConsumoFormProps {
  vale?: ValeConsumo | null
  onSubmit: (
    datos: ValeConsumoFormData,
  ) => void
  onCancelar: () => void
}

interface BorradorProducto {
  tipoProductoId: string
  productoId: string
  destinoId: string
  parteEquipoId: string
  cantidad: string
}

const BORRADOR_INICIAL:
  BorradorProducto = {
    tipoProductoId: '',
    productoId: '',
    destinoId: '',
    parteEquipoId: '',
    cantidad: '',
  }

function obtenerFechaActual(): string {
  const fecha = new Date()
  const diferencia =
    fecha.getTimezoneOffset() * 60_000

  return new Date(
    fecha.getTime() - diferencia,
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

function calcularCantidadDistribuida(
  distribuciones:
    DistribucionValeConsumoFormData[],
): number {
  return Number(
    distribuciones
      .reduce(
        (total, distribucion) =>
          total + distribucion.cantidad,
        0,
      )
      .toFixed(3),
  )
}

export function ValeConsumoForm({
  vale = null,
  onSubmit,
  onCancelar,
}: ValeConsumoFormProps) {
  const centrosCosto = useMemo(
    () => obtenerCentrosCosto(),
    [],
  )

  const destinos = useMemo(
    () => obtenerDestinos(),
    [],
  )

  const partesEquipo = useMemo(
    () => obtenerPartesEquipo(),
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

  const [fechaVale, setFechaVale] =
    useState(obtenerFechaActual())

  const [
    centroCostoId,
    setCentroCostoId,
  ] = useState('')

  const [solicitante, setSolicitante] =
    useState('')

  const [motivo, setMotivo] =
    useState('')

  const [detalles, setDetalles] =
    useState<
      DetalleValeConsumoFormData[]
    >([])

  const [
    distribucionesBorrador,
    setDistribucionesBorrador,
  ] = useState<
    DistribucionValeConsumoFormData[]
  >([])

  const [borrador, setBorrador] =
    useState<BorradorProducto>(
      BORRADOR_INICIAL,
    )

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!vale) {
      setFechaVale(obtenerFechaActual())
      setCentroCostoId('')
      setSolicitante('')
      setMotivo('')
      setDetalles([])
      setDistribucionesBorrador([])
      setBorrador(BORRADOR_INICIAL)
      setError(null)
      return
    }

    setFechaVale(vale.fechaVale)
    setCentroCostoId(
      vale.centroCostoId,
    )
    setSolicitante(vale.solicitante)
    setMotivo(vale.motivo)

    setDetalles(
      vale.detalles.map((detalle) => ({
        productoId: detalle.productoId,
        precioUnitario:
          detalle.precioUnitario,
        distribuciones:
          detalle.distribuciones.map(
            ({
              destinoId,
              parteEquipoId,
              cantidad,
            }) => ({
              destinoId,
              parteEquipoId,
              cantidad,
            }),
          ),
      })),
    )

    setDistribucionesBorrador([])
    setBorrador(BORRADOR_INICIAL)
    setError(null)
  }, [vale])

  const productosFiltrados =
    useMemo(
      () =>
        productos.filter((producto) => {
          if (
            !producto.estado ||
            producto.tipoProductoId !==
              borrador.tipoProductoId
          ) {
            return false
          }

          const cantidadOriginal =
            vale?.detalles
              .find(
                (detalle) =>
                  detalle.productoId ===
                  producto.id,
              )
              ?.distribuciones.reduce(
                (total, distribucion) =>
                  total +
                  distribucion.cantidad,
                0,
              ) ?? 0

          return (
            producto.stockActual +
              cantidadOriginal >
            0
          )
        }),
      [
        productos,
        borrador.tipoProductoId,
        vale,
      ],
    )

  const productoSeleccionado =
    useMemo(
      () =>
        productos.find(
          (producto) =>
            producto.id ===
            borrador.productoId,
        ) ?? null,
      [productos, borrador.productoId],
    )

  const unidadSeleccionada =
    useMemo(
      () =>
        unidadesMedida.find(
          (unidad) =>
            unidad.id ===
            productoSeleccionado
              ?.unidadMedidaId,
        ) ?? null,
      [
        unidadesMedida,
        productoSeleccionado,
      ],
    )

  const cantidadOriginal =
    useMemo(
      () =>
        vale?.detalles
          .find(
            (detalle) =>
              detalle.productoId ===
              borrador.productoId,
          )
          ?.distribuciones.reduce(
            (total, distribucion) =>
              total +
              distribucion.cantidad,
            0,
          ) ?? 0,
      [vale, borrador.productoId],
    )

  const stockDisponible =
    productoSeleccionado
      ? Number(
          (
            productoSeleccionado.stockActual +
            cantidadOriginal
          ).toFixed(3),
        )
      : 0

  const totalVale = useMemo(
    () =>
      detalles.reduce(
        (total, detalle) =>
          total +
          calcularCantidadDistribuida(
            detalle.distribuciones,
          ) *
            detalle.precioUnitario,
        0,
      ),
    [detalles],
  )

  function cambiarTipoProducto(
    tipoProductoId: string,
  ): void {
    setBorrador({
      ...BORRADOR_INICIAL,
      tipoProductoId,
    })

    setDistribucionesBorrador([])
    setError(null)
  }

  function cambiarProducto(
    productoId: string,
  ): void {
    setBorrador((actual) => ({
      ...actual,
      productoId,
      destinoId: '',
      parteEquipoId: '',
      cantidad: '',
    }))

    setDistribucionesBorrador([])
    setError(null)
  }

  function agregarDistribucion(): void {
    if (!borrador.productoId) {
      setError(
        'Selecciona primero un producto.',
      )
      return
    }

    if (!borrador.destinoId) {
      setError('Selecciona un destino.')
      return
    }

    const cantidad = Number(
      borrador.cantidad,
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

    const repetida =
      distribucionesBorrador.some(
        (distribucion) =>
          distribucion.destinoId ===
            borrador.destinoId &&
          distribucion.parteEquipoId ===
            (borrador.parteEquipoId ||
              null),
      )

    if (repetida) {
      setError(
        'Ese destino y parte de equipo ya fueron agregados.',
      )
      return
    }

    const cantidadAcumulada =
      calcularCantidadDistribuida(
        distribucionesBorrador,
      ) + cantidad

    if (
      cantidadAcumulada >
      stockDisponible
    ) {
      setError(
        `Stock insuficiente. Disponible: ${stockDisponible} ${unidadSeleccionada?.nombre ?? ''}.`,
      )
      return
    }

    setDistribucionesBorrador(
      (actuales) => [
        ...actuales,
        {
          destinoId:
            borrador.destinoId,
          parteEquipoId:
            borrador.parteEquipoId ||
            null,
          cantidad: Number(
            cantidad.toFixed(3),
          ),
        },
      ],
    )

    setBorrador((actual) => ({
      ...actual,
      destinoId: '',
      parteEquipoId: '',
      cantidad: '',
    }))

    setError(null)
  }

  function quitarDistribucion(
    indice: number,
  ): void {
    setDistribucionesBorrador(
      (actuales) =>
        actuales.filter(
          (_, posicion) =>
            posicion !== indice,
        ),
    )
  }

  function agregarProducto(): void {
    if (!productoSeleccionado) {
      setError('Selecciona un producto.')
      return
    }

    if (
      distribucionesBorrador.length === 0
    ) {
      setError(
        'Agrega al menos una distribución.',
      )
      return
    }

    const productoRepetido =
      detalles.some(
        (detalle) =>
          detalle.productoId ===
          productoSeleccionado.id,
      )

    if (productoRepetido) {
      setError(
        'Este producto ya está agregado. Usa Editar para cambiar sus distribuciones.',
      )
      return
    }

    setDetalles((actuales) => [
      ...actuales,
      {
        productoId:
          productoSeleccionado.id,
        precioUnitario:
          productoSeleccionado
            .precioUnitario,
        distribuciones:
          distribucionesBorrador.map(
            (distribucion) => ({
              ...distribucion,
            }),
          ),
      },
    ])

    setBorrador(BORRADOR_INICIAL)
    setDistribucionesBorrador([])
    setError(null)
  }

  function editarProducto(
    detalle:
      DetalleValeConsumoFormData,
  ): void {
    const producto = productos.find(
      (item) =>
        item.id === detalle.productoId,
    )

    if (!producto) {
      setError(
        'El producto ya no está disponible.',
      )
      return
    }

    setDetalles((actuales) =>
      actuales.filter(
        (item) =>
          item.productoId !==
          detalle.productoId,
      ),
    )

    setBorrador({
      tipoProductoId:
        producto.tipoProductoId,
      productoId: producto.id,
      destinoId: '',
      parteEquipoId: '',
      cantidad: '',
    })

    setDistribucionesBorrador(
      detalle.distribuciones.map(
        (distribucion) => ({
          ...distribucion,
        }),
      ),
    )

    setError(null)
  }

  function guardar(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()
    setError(null)

    if (!fechaVale) {
      setError('Selecciona la fecha.')
      return
    }

    if (!centroCostoId) {
      setError(
        'Selecciona un centro de costo.',
      )
      return
    }

    if (solicitante.trim().length < 3) {
      setError(
        'Ingresa el nombre del solicitante.',
      )
      return
    }

    if (motivo.trim().length < 5) {
      setError(
        'Describe el motivo de la salida.',
      )
      return
    }

    if (detalles.length === 0) {
      setError(
        'Agrega al menos un producto al vale.',
      )
      return
    }

    try {
      onSubmit({
        fechaVale,
        centroCostoId,
        solicitante:
          solicitante.trim(),
        motivo: motivo.trim(),
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
            {vale
              ? 'Editar vale'
              : 'Nuevo vale de consumo'}
          </h2>

          <p className="text-secondary mb-0">
            Registra productos y distribúyelos
            entre destinos y partes de equipo.
          </p>
        </div>

        {vale && (
          <span className="badge text-bg-light">
            {vale.numeroVale}
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
            htmlFor="valeFecha"
          >
            Fecha *
          </label>

          <input
            id="valeFecha"
            className="form-control maestro-control"
            type="date"
            value={fechaVale}
            onChange={(event) =>
              setFechaVale(
                event.target.value,
              )
            }
          />
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label maestro-label"
            htmlFor="valeCentroCosto"
          >
            Centro de costo *
          </label>

          <select
            id="valeCentroCosto"
            className="form-select maestro-control"
            value={centroCostoId}
            onChange={(event) =>
              setCentroCostoId(
                event.target.value,
              )
            }
          >
            <option value="">
              Seleccione
            </option>

            {centrosCosto
              .filter(
                (centro) =>
                  centro.estado ||
                  centro.id ===
                    centroCostoId,
              )
              .map((centro) => (
                <option
                  key={centro.id}
                  value={centro.id}
                >
                  {centro.nombre}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label
            className="form-label maestro-label"
            htmlFor="valeSolicitante"
          >
            Solicitante *
          </label>

          <input
            id="valeSolicitante"
            className="form-control maestro-control"
            maxLength={120}
            value={solicitante}
            onChange={(event) =>
              setSolicitante(
                event.target.value,
              )
            }
          />
        </div>

        <div className="col-12">
          <label
            className="form-label maestro-label"
            htmlFor="valeMotivo"
          >
            Motivo de la salida *
          </label>

          <textarea
            id="valeMotivo"
            className="form-control maestro-control"
            rows={3}
            maxLength={500}
            value={motivo}
            onChange={(event) =>
              setMotivo(
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <hr className="my-4" />

      <h3 className="h6 mb-3">
        Seleccionar producto
      </h3>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label maestro-label">
            Tipo de producto *
          </label>

          <select
            className="form-select maestro-control"
            value={borrador.tipoProductoId}
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

        <div className="col-12 col-md-5">
          <label className="form-label maestro-label">
            Producto *
          </label>

          <select
            className="form-select maestro-control"
            value={borrador.productoId}
            disabled={
              !borrador.tipoProductoId
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
          <label className="form-label maestro-label">
            Stock disponible
          </label>

          <input
            className="form-control maestro-control"
            readOnly
            value={
              productoSeleccionado
                ? `${stockDisponible} ${unidadSeleccionada?.nombre ?? ''}`
                : ''
            }
            placeholder="Automático"
          />
        </div>
      </div>

      <div className="row g-3 align-items-end mt-1">
        <div className="col-12 col-md-4">
          <label className="form-label maestro-label">
            Destino *
          </label>

          <select
            className="form-select maestro-control"
            value={borrador.destinoId}
            disabled={!borrador.productoId}
            onChange={(event) =>
              setBorrador((actual) => ({
                ...actual,
                destinoId:
                  event.target.value,
              }))
            }
          >
            <option value="">
              Seleccione
            </option>

            {destinos
              .filter(
                (destino) =>
                  destino.estado,
              )
              .map((destino) => (
                <option
                  key={destino.id}
                  value={destino.id}
                >
                  {destino.nombre}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label maestro-label">
            Parte de equipo
          </label>

          <select
            className="form-select maestro-control"
            value={borrador.parteEquipoId}
            disabled={!borrador.productoId}
            onChange={(event) =>
              setBorrador((actual) => ({
                ...actual,
                parteEquipoId:
                  event.target.value,
              }))
            }
          >
            <option value="">
              No aplica
            </option>

            {partesEquipo
              .filter((parte) => parte.estado)
              .map((parte) => (
                <option
                  key={parte.id}
                  value={parte.id}
                >
                  {parte.codigo} -{' '}
                  {parte.nombre}
                </option>
              ))}
          </select>
        </div>

        <div className="col-12 col-md-2">
          <label className="form-label maestro-label">
            Cantidad *
          </label>

          <input
            className="form-control maestro-control"
            type="number"
            min="0.001"
            step="0.001"
            value={borrador.cantidad}
            disabled={!borrador.productoId}
            onChange={(event) =>
              setBorrador((actual) => ({
                ...actual,
                cantidad:
                  event.target.value,
              }))
            }
          />
        </div>

        <div className="col-12 col-md-2">
          <button
            type="button"
            className="btn maestro-btn-primary w-100"
            onClick={agregarDistribucion}
          >
            <Plus size={18} />
            Distribuir
          </button>
        </div>
      </div>

      {distribucionesBorrador.length >
        0 && (
        <div className="table-responsive mt-3">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Destino</th>
                <th>Parte de equipo</th>
                <th className="text-end">
                  Cantidad
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              {distribucionesBorrador.map(
                (distribucion, indice) => {
                  const destino =
                    destinos.find(
                      (item) =>
                        item.id ===
                        distribucion.destinoId,
                    )

                  const parte =
                    partesEquipo.find(
                      (item) =>
                        item.id ===
                        distribucion.parteEquipoId,
                    )

                  return (
                    <tr
                      key={`${distribucion.destinoId}-${distribucion.parteEquipoId}-${indice}`}
                    >
                      <td>
                        {destino?.nombre}
                      </td>

                      <td>
                        {parte?.nombre ??
                          'No aplica'}
                      </td>

                      <td className="text-end">
                        {
                          distribucion.cantidad
                        }{' '}
                        {
                          unidadSeleccionada?.nombre
                        }
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            quitarDistribucion(
                              indice,
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                },
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-end mt-3">
        <button
          type="button"
          className="btn maestro-btn-primary"
          onClick={agregarProducto}
        >
          <Plus size={18} />
          Agregar producto al vale
        </button>
      </div>

      <hr className="my-4" />

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Distribuciones</th>
              <th className="text-end">
                Total retirado
              </th>
              <th className="text-end">
                Importe
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            {detalles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-secondary py-4"
                >
                  No agregaste productos.
                </td>
              </tr>
            )}

            {detalles.map((detalle) => {
              const producto =
                productos.find(
                  (item) =>
                    item.id ===
                    detalle.productoId,
                )

              const cantidad =
                calcularCantidadDistribuida(
                  detalle.distribuciones,
                )

              return (
                <tr key={detalle.productoId}>
                  <td>
                    <strong>
                      {producto?.nombre}
                    </strong>

                    <div className="small text-secondary">
                      {producto?.codigo}
                    </div>
                  </td>

                  <td>
                    {
                      detalle.distribuciones
                        .length
                    }{' '}
                    destino(s)
                  </td>

                  <td className="text-end">
                    {cantidad}
                  </td>

                  <td className="text-end">
                    S/{' '}
                    {(
                      cantidad *
                      detalle.precioUnitario
                    ).toFixed(2)}
                  </td>

                  <td>
                    <div className="d-flex justify-content-end gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          editarProducto(
                            detalle,
                          )
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setDetalles(
                            (actuales) =>
                              actuales.filter(
                                (item) =>
                                  item.productoId !==
                                  detalle.productoId,
                              ),
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            <tr>
              <th
                colSpan={3}
                className="text-end"
              >
                Total valorizado
              </th>

              <th className="text-end">
                S/ {totalVale.toFixed(2)}
              </th>

              <th />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn maestro-btn-danger"
          onClick={onCancelar}
        >
          <X size={18} />
          Cancelar
        </button>

        <button
          type="submit"
          className="btn maestro-btn-primary"
        >
          <Save size={18} />
          Guardar vale
        </button>
      </div>
    </form>
  )
}