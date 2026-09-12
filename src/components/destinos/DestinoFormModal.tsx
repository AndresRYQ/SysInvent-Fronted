import {
  useEffect,
  useState,
} from 'react'

import { Save, X } from 'lucide-react'

import type {
  Destino,
  DestinoFormData,
} from '../../types/destino'

interface DestinoFormModalProps {
  abierto: boolean
  destino: Destino | null
  error: string
  onClose: () => void
  onSubmit: (
    datos: DestinoFormData,
  ) => void
}

interface ErroresFormulario {
  nombre: string
  descripcion: string
}

const FORM_INICIAL: DestinoFormData = {
  nombre: '',
  descripcion: '',
  estado: true,
}

const ERRORES_INICIALES: ErroresFormulario = {
  nombre: '',
  descripcion: '',
}

export function DestinoFormModal({
  abierto,
  destino,
  error,
  onClose,
  onSubmit,
}: DestinoFormModalProps) {
  const [form, setForm] =
    useState<DestinoFormData>(
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

    if (destino) {
      setForm({
        nombre: destino.nombre,
        descripcion: destino.descripcion,
        estado: destino.estado,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [abierto, destino])

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
    } else if (nombre.length > 100) {
      nuevosErrores.nombre =
        'No puede superar los 100 caracteres'
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
        aria-labelledby="destino-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="destino-form-title"
              className="maestro-modal-title"
            >
              {destino
                ? 'Editar destino'
                : 'Registrar destino'}
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
                htmlFor="destinoNombreModal"
              >
                Nombre del destino
                <span className="maestro-required">
                  *
                </span>
              </label>

              <input
                id="destinoNombreModal"
                className={`form-control maestro-control${
                  errores.nombre
                    ? ' maestro-control--error'
                    : ''
                }`}
                type="text"
                maxLength={100}
                placeholder="Ej. Almacén Central"
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
                htmlFor="destinoDescripcionModal"
              >
                Descripción
                <span className="maestro-required">
                  *
                </span>
              </label>

              <textarea
                id="destinoDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                rows={4}
                maxLength={250}
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
                  {form.descripcion.length}/250
                </small>
              </div>
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="destinoEstadoModal"
              >
                Estado
              </label>

              <select
                id="destinoEstadoModal"
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

              {destino
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}