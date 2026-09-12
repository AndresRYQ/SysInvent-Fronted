import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'

import {
  Package,
  Save,
  X,
} from 'lucide-react'

import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  Producto,
  ProductoFormData,
} from '../../types/producto'

interface FormularioProductoProps {
  producto?: Producto | null
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
  estado: true,
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
          proveedor.id ===
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
        estado: producto.estado,
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
      className="card border-0 shadow-sm"
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

      <div className="card-body p-4">
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
              className="form-label maestro-label"
              htmlFor="productoCodigo"
            >
              Código
              <span className="maestro-required">*</span>
            </label>

            <input
              id="productoCodigo"
              className={`form-control maestro-control${
                errores.codigo
                  ? ' maestro-control--error'
                  : ''
              }`}
              maxLength={30}
              placeholder="Ej. HER-001"
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
              className="form-label maestro-label"
              htmlFor="productoNombre"
            >
              Nombre
              <span className="maestro-required">*</span>
            </label>

            <input
              id="productoNombre"
              className={`form-control maestro-control${
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

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="productoTipo"
            >
              Tipo de producto
              <span className="maestro-required">*</span>
            </label>

            <select
              id="productoTipo"
              className={`form-select maestro-control${
                errores.tipoProductoId
                  ? ' maestro-control--error'
                  : ''
              }`}
              value={form.tipoProductoId}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  tipoProductoId:
                    event.target.value,
                }))

                limpiarError(
                  'tipoProductoId',
                )
              }}
            >
              <option value="">
                Seleccionar
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

            {errores.tipoProductoId && (
              <div className="maestro-field-error">
                {errores.tipoProductoId}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="productoCategoria"
            >
              Categoría
              <span className="maestro-required">*</span>
            </label>

            <select
              id="productoCategoria"
              className={`form-select maestro-control${
                errores.categoriaId
                  ? ' maestro-control--error'
                  : ''
              }`}
              value={form.categoriaId}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  categoriaId:
                    event.target.value,
                }))

                limpiarError('categoriaId')
              }}
            >
              <option value="">
                Seleccionar
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>

            {errores.categoriaId && (
              <div className="maestro-field-error">
                {errores.categoriaId}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="productoUnidad"
            >
              Unidad de medida
              <span className="maestro-required">*</span>
            </label>

            <select
              id="productoUnidad"
              className={`form-select maestro-control${
                errores.unidadMedidaId
                  ? ' maestro-control--error'
                  : ''
              }`}
              value={form.unidadMedidaId}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  unidadMedidaId:
                    event.target.value,
                }))

                limpiarError(
                  'unidadMedidaId',
                )
              }}
            >
              <option value="">
                Seleccionar
              </option>

              {unidadesMedida.map((unidad) => (
                <option
                  key={unidad.id}
                  value={unidad.id}
                >
                  {unidad.nombre}
                </option>
              ))}
            </select>

            {errores.unidadMedidaId && (
              <div className="maestro-field-error">
                {errores.unidadMedidaId}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="productoProveedor"
            >
              Proveedor
              <span className="maestro-required">*</span>
            </label>

            <select
              id="productoProveedor"
              className={`form-select maestro-control${
                errores.proveedorId
                  ? ' maestro-control--error'
                  : ''
              }`}
              value={form.proveedorId}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  proveedorId:
                    event.target.value,
                }))

                limpiarError('proveedorId')
              }}
            >
              <option value="">
                Seleccionar
              </option>

              {proveedores.map(
                (proveedor) => (
                  <option
                    key={proveedor.id}
                    value={proveedor.id}
                  >
                    {proveedor.razonSocial}
                  </option>
                ),
              )}
            </select>

            {errores.proveedorId && (
              <div className="maestro-field-error">
                {errores.proveedorId}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoStockMinimo"
            >
              Stock mínimo
              <span className="maestro-required">*</span>
            </label>

            <input
              id="productoStockMinimo"
              className={`form-control maestro-control${
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

          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoPrecio"
            >
              Precio unitario
              <span className="maestro-required">*</span>
            </label>

            <div className="input-group">
              <span className="input-group-text">
                S/
              </span>

              <input
                id="productoPrecio"
                className={`form-control maestro-control${
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

          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="productoEstado"
            >
              Estado
            </label>

            <select
              id="productoEstado"
              className="form-select maestro-control"
              value={
                form.estado
                  ? 'activo'
                  : 'inactivo'
              }
              onChange={(event) =>
                setForm((actual) => ({
                  ...actual,
                  estado:
                    event.target.value ===
                    'activo',
                }))
              }
            >
              <option value="activo">
                Activo
              </option>

              <option value="inactivo">
                Inactivo
              </option>
            </select>
          </div>

          {producto && (
            <div className="col-12 col-lg-4">
              <label className="form-label maestro-label">
                Stock actual
              </label>

              <input
                className="form-control maestro-control"
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
              className="form-label maestro-label"
              htmlFor="productoDescripcion"
            >
              Descripción
              <span className="maestro-required">*</span>
            </label>

            <textarea
              id="productoDescripcion"
              className={`form-control maestro-control maestro-control--textarea${
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
      </div>

      <div className="card-footer bg-white border-top p-4">
        <div className="d-flex flex-wrap justify-content-end gap-2">
          <button
            type="button"
            className="btn maestro-btn-secondary"
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

            {producto
              ? 'Guardar cambios'
              : 'Registrar producto'}
          </button>
        </div>
      </div>
    </form>
  )
}
