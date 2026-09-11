import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type {
  TipoProducto,
  TipoProductoFormData,
} from '../../types/tipoProducto'

interface TipoProductoFormModalProps {
  abierto: boolean
  tipoProducto: TipoProducto | null
  error: string
  onClose: () => void
  onSubmit: (
    datos: TipoProductoFormData,
  ) => void
}

interface TipoProductoFormErrores {
  nombre: string
  descripcion: string
}

const FORM_INICIAL: TipoProductoFormData = {
  nombre: '',
  descripcion: '',
  estado: true,
}

const ERRORES_INICIALES: TipoProductoFormErrores = {
  nombre: '',
  descripcion: '',
}

export function TipoProductoFormModal({
  abierto,
  tipoProducto,
  error,
  onClose,
  onSubmit,
}: TipoProductoFormModalProps) {
  const [form, setForm] =
    useState<TipoProductoFormData>(FORM_INICIAL)

  const [errores, setErrores] =
    useState<TipoProductoFormErrores>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (tipoProducto) {
      setForm({
        nombre: tipoProducto.nombre,
        descripcion: tipoProducto.descripcion,
        estado: tipoProducto.estado,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [abierto, tipoProducto])

  if (!abierto) {
    return null
  }

  function validarFormulario(): boolean {
    const nuevosErrores: TipoProductoFormErrores = {
      nombre: '',
      descripcion: '',
    }

    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()

    if (!nombre) {
      nuevosErrores.nombre = 'Campo requerido'
    } else if (nombre.length < 2) {
      nuevosErrores.nombre =
        'Debe tener al menos 2 caracteres'
    } else if (nombre.length > 80) {
      nuevosErrores.nombre =
        'No puede superar los 80 caracteres'
    }

    if (!descripcion) {
      nuevosErrores.descripcion =
        'Campo requerido'
    } else if (descripcion.length > 250) {
      nuevosErrores.descripcion =
        'No puede superar los 250 caracteres'
    }

    setErrores(nuevosErrores)

    return (
      !nuevosErrores.nombre &&
      !nuevosErrores.descripcion
    )
  }

  return (
    <div
      className="maestro-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="maestro-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tipo-producto-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="tipo-producto-form-title"
              className="maestro-modal-title"
            >
              {tipoProducto
                ? 'Editar tipo de producto'
                : 'Registrar tipo de producto'}
            </h3>

            <p className="maestro-modal-copy mb-0">
              Completa los datos solicitados.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()

            if (!validarFormulario()) {
              return
            }

            onSubmit({
              nombre: form.nombre.trim(),
              descripcion:
                form.descripcion.trim(),
              estado: form.estado,
            })
          }}
        >
          <div className="maestro-modal-body">
            {error && (
              <div
                className="alert alert-danger py-2"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="tipoProductoNombreModal"
              >
                Nombre de tipo de producto
                <span
                  className="maestro-required"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="tipoProductoNombreModal"
                className={`form-control maestro-control${
                  errores.nombre
                    ? ' maestro-control--error'
                    : ''
                }`}
                type="text"
                maxLength={80}
                value={form.nombre}
                aria-invalid={Boolean(
                  errores.nombre,
                )}
                onChange={(event) => {
                  const value = event.target.value

                  setForm((actual) => ({
                    ...actual,
                    nombre: value,
                  }))

                  if (errores.nombre) {
                    setErrores((actual) => ({
                      ...actual,
                      nombre: '',
                    }))
                  }
                }}
              />

              {errores.nombre && (
                <div className="maestro-field-error">
                  {errores.nombre}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="tipoProductoDescripcionModal"
              >
                Descripción
                <span
                  className="maestro-required"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <textarea
                id="tipoProductoDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                maxLength={250}
                rows={4}
                value={form.descripcion}
                aria-invalid={Boolean(
                  errores.descripcion,
                )}
                onChange={(event) => {
                  const value = event.target.value

                  setForm((actual) => ({
                    ...actual,
                    descripcion: value,
                  }))

                  if (errores.descripcion) {
                    setErrores((actual) => ({
                      ...actual,
                      descripcion: '',
                    }))
                  }
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

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="tipoProductoEstadoModal"
              >
                Estado
              </label>

              <select
                id="tipoProductoEstadoModal"
                className="form-select maestro-control"
                value={
                  form.estado ? 'activo' : 'inactivo'
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
          </div>

          <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn maestro-btn-secondary"
              onClick={onClose}
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="submit"
              className="btn maestro-btn-primary"
            >
              <Save size={18} />
              {tipoProducto
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}