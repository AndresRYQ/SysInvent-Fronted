import { Placeholder } from '../../constants/placeholders'
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import { Package, Save, X } from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  Producto,
  ProductoFormData,
} from '../../types/producto'

interface FormularioProductoProps {
  producto?: Producto | null
  soloLectura?: boolean
  error: string
  onSubmit: (
    datos: ProductoFormData,
  ) => void
  onCancelar: () => void
}

interface OpcionMaestro {
  id: string
  nombre: string
  estado: boolean
}

interface ErroresFormulario {
  codigo: string
  nombre: string
  descripcion: string
  tipoProductoId: string
  categoriaId: string
  unidadMedidaId: string
  proveedorId: string
  stockMinimo: string
  precioUnitario: string
}

const CATEGORIAS_INICIALES: OpcionMaestro[] = [
  {
    id: 'CAT-001',
    nombre: 'Herramientas',
    estado: true,
  },
  {
    id: 'CAT-002',
    nombre: 'Seguridad Industrial',
    estado: true,
  },
  {
    id: 'CAT-003',
    nombre: 'Ferretería',
    estado: true,
  },
  {
    id: 'CAT-004',
    nombre: 'Repuestos',
    estado: true,
  },
  {
    id: 'CAT-005',
    nombre: 'Limpieza',
    estado: false,
  },
]

const UNIDADES_INICIALES: OpcionMaestro[] = [
  {
    id: 'UM-001',
    nombre: 'Unidad',
    estado: true,
  },
  {
    id: 'UM-002',
    nombre: 'Kilogramo',
    estado: true,
  },
  {
    id: 'UM-003',
    nombre: 'Litro',
    estado: true,
  },
  {
    id: 'UM-004',
    nombre: 'Metro',
    estado: true,
  },
  {
    id: 'UM-005',
    nombre: 'Caja',
    estado: true,
  },
]

const FORM_INICIAL: ProductoFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  tipoProductoId: '',
  categoriaId: '',
  unidadMedidaId: '',
  proveedorId: '',
  stockMinimo: 0,
  precioUnitario: 0,
}

const ERRORES_INICIALES: ErroresFormulario = {
  codigo: '',
  nombre: '',
  descripcion: '',
  tipoProductoId: '',
  categoriaId: '',
  unidadMedidaId: '',
  proveedorId: '',
  stockMinimo: '',
  precioUnitario: '',
}

function obtenerOpcionesLocales(
  storageKey: string,
  valoresIniciales: OpcionMaestro[],
): OpcionMaestro[] {
  try {
    const datosGuardados =
      localStorage.getItem(storageKey)

    if (!datosGuardados) {
      return valoresIniciales
    }

    const datos = JSON.parse(datosGuardados)

    return Array.isArray(datos)
      ? (datos as OpcionMaestro[])
      : valoresIniciales
  } catch {
    return valoresIniciales
  }
}

export function FormularioProducto({
  producto,
  soloLectura = false,
  error,
  onSubmit,
  onCancelar,
}: FormularioProductoProps) {
  const [form, setForm] =
    useState<ProductoFormData>(
      FORM_INICIAL,
    )

  const [errores, setErrores] =
    useState<ErroresFormulario>(
      ERRORES_INICIALES,
    )

  const tiposProducto = useMemo(
    () =>
      obtenerTiposProducto().filter(
        (tipo) =>
          tipo.estado ||
          String(tipo.id) ===
            String(producto?.tipoProductoId),
      ),
    [producto],
  )

  const proveedores = useMemo(
    () =>
      obtenerProveedores().filter(
        (proveedor) =>
          proveedor.estado ||
          String(proveedor.id) ===
            producto?.proveedorId,
      ),
    [producto],
  )

  const categorias = useMemo(
    () =>
      obtenerOpcionesLocales(
        'agrihusac_categorias',
        CATEGORIAS_INICIALES,
      ).filter(
        (categoria) =>
          categoria.estado ||
          categoria.id ===
            producto?.categoriaId,
      ),
    [producto],
  )

  const unidadesMedida = useMemo(
    () =>
      obtenerOpcionesLocales(
        'agrihusac_unidades_medida',
        UNIDADES_INICIALES,
      ).filter(
        (unidad) =>
          unidad.estado ||
          unidad.id ===
            producto?.unidadMedidaId,
      ),
    [producto],
  )

  useEffect(() => {
    if (producto) {
      setForm({
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        tipoProductoId:
          producto.tipoProductoId,
        categoriaId:
          producto.categoriaId,
        unidadMedidaId:
          producto.unidadMedidaId,
        proveedorId:
          producto.proveedorId,
        stockMinimo:
          producto.stockMinimo,
        precioUnitario:
          producto.precioUnitario,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [producto])

  function limpiarError(
    campo: keyof ErroresFormulario,
  ): void {
    setErrores((actual) => ({
      ...actual,
      [campo]: '',
    }))
  }

  function validarFormulario(): boolean {
    const nuevosErrores: ErroresFormulario = {
      ...ERRORES_INICIALES,
    }

    const codigo = form.codigo
      .trim()
      .toUpperCase()

    const nombre = form.nombre.trim()
    const descripcion =
      form.descripcion.trim()

    if (
      !/^[A-Z0-9-]{3,30}$/.test(codigo)
    ) {
      nuevosErrores.codigo =
        'Utiliza entre 3 y 30 letras, números o guiones'
    }

    if (nombre.length < 2) {
      nuevosErrores.nombre =
        'Debe tener al menos 2 caracteres'
    } else if (nombre.length > 120) {
      nuevosErrores.nombre =
        'No puede superar los 120 caracteres'
    }

    if (descripcion.length < 5) {
      nuevosErrores.descripcion =
        'Debe tener al menos 5 caracteres'
    } else if (descripcion.length > 250) {
      nuevosErrores.descripcion =
        'No puede superar los 250 caracteres'
    }

    if (!form.tipoProductoId) {
      nuevosErrores.tipoProductoId =
        'Selecciona un tipo de producto'
    }

    if (!form.categoriaId) {
      nuevosErrores.categoriaId =
        'Selecciona una categoría'
    }

    if (!form.unidadMedidaId) {
      nuevosErrores.unidadMedidaId =
        'Selecciona una unidad de medida'
    }

    if (!form.proveedorId) {
      nuevosErrores.proveedorId =
        'Selecciona un proveedor'
    }

    if (
      !Number.isFinite(form.stockMinimo) ||
      form.stockMinimo < 0
    ) {
      nuevosErrores.stockMinimo =
        'Ingresa un stock mínimo válido'
    }

    if (
      !Number.isFinite(
        form.precioUnitario,
      ) ||
      form.precioUnitario < 0
    ) {
      nuevosErrores.precioUnitario =
        'Ingresa un precio válido'
    }

    setErrores(nuevosErrores)

    return Object.values(
      nuevosErrores,
    ).every((mensaje) => !mensaje)
  }

  function manejarEnvio(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()

    if (!validarFormulario()) {
      return
    }

    onSubmit({
      ...form,
      codigo: form.codigo
        .trim()
        .toUpperCase(),
      nombre: form.nombre.trim(),
      descripcion:
        form.descripcion.trim(),
    })
  }

  return (
    <form
      className={`card border-0 shadow-sm${soloLectura ? ' modo-visualizacion' : ''}`}
      noValidate
      onSubmit={manejarEnvio}
    >
      <div className="card-header bg-white border-bottom p-4">
        <div className="d-flex align-items-center gap-3">
          <span className="maestro-cell-icon">
            <Package size={20} />
          </span>

          <div>
            <h2 className="h5 mb-1">
              Información del producto
            </h2>

            <p className="text-muted mb-0">
              Registra la información general y
              configuración de inventario.
            </p>
          </div>
        </div>
      </div>

      <div className="maestro-modal-body">
        <fieldset disabled={soloLectura}>
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <label
              className="form-label required"
              htmlFor="productoCodigo"
            >
              Código

            </label>

            <input
              id="productoCodigo"
              className={`form-control${
                errores.codigo
                  ? ' maestro-control--error'
                  : ''
              }`}
              maxLength={30}
              placeholder={Placeholder.Ingresar}
              value={form.codigo}
              onChange={(event) => {
                const value =
                  event.target.value
                    .toUpperCase()
                    .replace(
                      /[^A-Z0-9-]/g,
                      '',
                    )

                setForm((actual) => ({
                  ...actual,
                  codigo: value,
                }))

                limpiarError('codigo')
              }}
            />

            {errores.codigo && (
              <div className="maestro-field-error">
                {errores.codigo}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-8">
            <label
              className="form-label required"
              htmlFor="productoNombre"
            >
              Nombre

            </label>

            <input
              id="productoNombre"
              className={`form-control${
                errores.nombre
                  ? ' maestro-control--error'
                  : ''
              }`}
              maxLength={120}
              value={form.nombre}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  nombre: event.target.value,
                }))

                limpiarError('nombre')
              }}
            />

            {errores.nombre && (
              <div className="maestro-field-error">
                {errores.nombre}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoTipo"
            >
              Tipo de producto

            </label>

            <Select
              inputId="productoTipo"
              options={tiposProducto.map((tipo) => ({
                value: String(tipo.id),
                label: tipo.nombre,
              }))}
              value={
                tiposProducto
                  .map((tipo) => ({
                    value: String(tipo.id),
                    label: tipo.nombre,
                  }))
                  .find((opcion) => opcion.value === form.tipoProductoId) ?? null
              }
              onChange={(opcion) => {
                setForm((actual) => ({
                  ...actual,
                  tipoProductoId:
                    opcion?.value ?? '',
                }))

                limpiarError(
                  'tipoProductoId',
                )
              }}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable
              styles={estilosSelect(Boolean(errores.tipoProductoId))}
            />

            {errores.tipoProductoId && (
              <div className="maestro-field-error">
                {errores.tipoProductoId}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoCategoria"
            >
              Categoría

            </label>

            <Select
              inputId="productoCategoria"
              options={categorias.map((categoria) => ({
                value: String(categoria.id),
                label: categoria.nombre,
              }))}
              value={
                categorias
                  .map((categoria) => ({
                    value: String(categoria.id),
                    label: categoria.nombre,
                  }))
                  .find((opcion) => opcion.value === form.categoriaId) ?? null
              }
              onChange={(opcion) => {
                setForm((actual) => ({
                  ...actual,
                  categoriaId:
                    opcion?.value ?? '',
                }))

                limpiarError('categoriaId')
              }}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable
              styles={estilosSelect(Boolean(errores.categoriaId))}
            />

            {errores.categoriaId && (
              <div className="maestro-field-error">
                {errores.categoriaId}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoUnidad"
            >
              Unidad de medida

            </label>

            <Select
              inputId="productoUnidad"
              options={unidadesMedida.map((unidad) => ({
                value: String(unidad.id),
                label: unidad.nombre,
              }))}
              value={
                unidadesMedida
                  .map((unidad) => ({
                    value: String(unidad.id),
                    label: unidad.nombre,
                  }))
                  .find((opcion) => opcion.value === form.unidadMedidaId) ?? null
              }
              onChange={(opcion) => {
                setForm((actual) => ({
                  ...actual,
                  unidadMedidaId:
                    opcion?.value ?? '',
                }))

                limpiarError(
                  'unidadMedidaId',
                )
              }}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable
              styles={estilosSelect(Boolean(errores.unidadMedidaId))}
            />

            {errores.unidadMedidaId && (
              <div className="maestro-field-error">
                {errores.unidadMedidaId}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoProveedor"
            >
              Proveedor

            </label>

            <Select
              inputId="productoProveedor"
              options={proveedores.map((proveedor) => ({
                value: String(proveedor.id),
                label: proveedor.razonSocial,
              }))}
              value={
                proveedores
                  .map((proveedor) => ({
                    value: String(proveedor.id),
                    label: proveedor.razonSocial,
                  }))
                  .find((opcion) => opcion.value === String(form.proveedorId)) ?? null
              }
              onChange={(opcion) => {
                setForm((actual) => ({
                  ...actual,
                  proveedorId:
                    opcion?.value ?? '',
                }))

                limpiarError('proveedorId')
              }}
              placeholder={Placeholder.Seleccionar}
              isClearable
              isSearchable
              styles={estilosSelect(Boolean(errores.proveedorId))}
            />

            {errores.proveedorId && (
              <div className="maestro-field-error">
                {errores.proveedorId}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoStockMinimo"
            >
              Stock mínimo

            </label>

            <input
              id="productoStockMinimo"
              className={`form-control${
                errores.stockMinimo
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="number"
              min="0"
              step="0.001"
              value={form.stockMinimo}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  stockMinimo:
                    event.target.value === ''
                      ? 0
                      : Number(
                          event.target.value,
                        ),
                }))

                limpiarError('stockMinimo')
              }}
            />

            {errores.stockMinimo && (
              <div className="maestro-field-error">
                {errores.stockMinimo}
              </div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label
              className="form-label required"
              htmlFor="productoPrecio"
            >
              Precio unitario

            </label>

            <div className="input-group">
              <span className="input-group-text">
                S/
              </span>

              <input
                id="productoPrecio"
                className={`form-control${
                  errores.precioUnitario
                    ? ' maestro-control--error'
                    : ''
                }`}
                type="number"
                min="0"
                step="0.01"
                value={form.precioUnitario}
                onChange={(event) => {
                  setForm((actual) => ({
                    ...actual,
                    precioUnitario:
                      event.target.value === ''
                        ? 0
                        : Number(
                            event.target.value,
                          ),
                  }))

                  limpiarError(
                    'precioUnitario',
                  )
                }}
              />
            </div>

            {errores.precioUnitario && (
              <div className="maestro-field-error">
                {errores.precioUnitario}
              </div>
            )}
          </div>

          {producto && (
            <div className="col-12 col-lg-4">
              <label className="form-label">
                Stock actual
              </label>

              <input
                className="form-control"
                value={producto.stockActual}
                readOnly
              />

              <small className="text-muted">
                Se actualiza mediante ingresos y vales.
              </small>
            </div>
          )}

          <div className="col-12">
            <label
              className="form-label required"
              htmlFor="productoDescripcion"
            >
              Descripción

            </label>

            <textarea
              id="productoDescripcion"
              className={`form-control${
                errores.descripcion
                  ? ' maestro-control--error'
                  : ''
              }`}
              rows={4}
              maxLength={250}
              value={form.descripcion}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  descripcion:
                    event.target.value,
                }))

                limpiarError('descripcion')
              }}
            />

            <div className="d-flex justify-content-between">
              <div>
                {errores.descripcion && (
                  <span className="maestro-field-error">
                    {errores.descripcion}
                  </span>
                )}
              </div>

              <small className="text-muted">
                {form.descripcion.length}/250
              </small>
            </div>
          </div>
        </div>
        </fieldset>
      </div>

      {!soloLectura && <div className="maestro-modal-footer">
        <div className="d-flex flex-wrap justify-content-end gap-2">
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

            {producto
              ? 'Guardar cambios'
              : 'Registrar producto'}
          </button>
        </div>
      </div>}
    </form>
  )
}

const estilosSelect = (tieneError: boolean) =>
  crearEstilosSelect({
    tieneError,
    altura: 38,
    zIndex: 20,
  })
