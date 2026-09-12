import {
  useEffect,
  useState,
} from 'react'

import { Save, X } from 'lucide-react'

import type {
  UnidadMedida,
  UnidadMedidaFormData,
} from '../../types/unidadMedida'

interface UnidadMedidaFormModalProps {
  abierto: boolean
  unidadMedida: UnidadMedida | null
  error: string
  onClose: () => void
  onSubmit: (
    datos: UnidadMedidaFormData,
  ) => void
}

interface ErroresFormulario {
  nombre: string
  descripcion: string
}

const FORM_INICIAL: UnidadMedidaFormData = {
  nombre: '',
  descripcion: '',
  estado: true,
}

const ERRORES_INICIALES: ErroresFormulario = {
  nombre: '',
  descripcion: '',
}

export function UnidadMedidaFormModal({
  abierto,
  unidadMedida,
  error,
  onClose,
  onSubmit,
}: UnidadMedidaFormModalProps) {
  const [form, setForm] =
    useState<UnidadMedidaFormData>(
      FORM_INICIAL,
    )

  const [errores, setErrores] =
    useState<ErroresFormulario>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (unidadMedida) {
      setForm({
        nombre: unidadMedida.nombre,
        descripcion:
          unidadMedida.descripcion,
        estado: unidadMedida.estado,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [abierto, unidadMedida])

  if (!abierto) {
    return null
  }

  function validarFormulario(): boolean {
    const nuevosErrores: ErroresFormulario = {
      nombre: '',
      descripcion: '',
    }

    const nombre = form.nombre.trim()
    const descripcion =
      form.descripcion.trim()

    if (!nombre) {
      nuevosErrores.nombre =
        'Campo requerido'
    } else if (nombre.length < 2) {
      nuevosErrores.nombre =
        'Debe tener al menos 2 caracteres'
    } else if (nombre.length > 60) {
      nuevosErrores.nombre =
        'No puede superar los 60 caracteres'
    }

    if (!descripcion) {
      nuevosErrores.descripcion =
        'Campo requerido'
    } else if (descripcion.length > 200) {
      nuevosErrores.descripcion =
        'No puede superar los 200 caracteres'
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
        aria-labelledby="unidad-medida-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="unidad-medida-form-title"
              className="maestro-modal-title"
            >
              {unidadMedida
                ? 'Editar unidad de medida'
                : 'Registrar unidad de medida'}
            </h3>

            <p className="maestro-modal-copy mb-0">
              Completa los datos solicitados.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
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
                htmlFor="unidadMedidaNombreModal"
              >
                Nombre de la unidad
                <span className="maestro-required">
                  *
                </span>
              </label>

              <input
                id="unidadMedidaNombreModal"
                className={`form-control maestro-control${
                  errores.nombre
                    ? ' maestro-control--error'
                    : ''
                }`}
                type="text"
                maxLength={60}
                placeholder="Ej. Unidad, kilogramo, litro"
                value={form.nombre}
                aria-invalid={Boolean(
                  errores.nombre,
                )}
                onChange={(event) => {
                  setForm((actual) => ({
                    ...actual,
                    nombre: event.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    nombre: '',
                  }))
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
                htmlFor="unidadMedidaDescripcionModal"
              >
                Descripción
                <span className="maestro-required">
                  *
                </span>
              </label>

              <textarea
                id="unidadMedidaDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                rows={4}
                maxLength={200}
                value={form.descripcion}
                aria-invalid={Boolean(
                  errores.descripcion,
                )}
                onChange={(event) => {
                  setForm((actual) => ({
                    ...actual,
                    descripcion:
                      event.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    descripcion: '',
                  }))
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
                  {form.descripcion.length}/200
                </small>
              </div>
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="unidadMedidaEstadoModal"
              >
                Estado
              </label>

              <select
                id="unidadMedidaEstadoModal"
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

              {unidadMedida
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}