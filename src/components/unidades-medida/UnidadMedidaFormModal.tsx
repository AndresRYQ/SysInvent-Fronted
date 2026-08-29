import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { UnidadMedida } from '../../types/unidadMedida'

interface UnidadMedidaFormModalProps {
  abierto: boolean
  unidadMedida: UnidadMedida | null
  onClose: () => void
  onSubmit: (
    unidadMedida: Pick<UnidadMedida, 'nombre' | 'descripcion'>,
  ) => void
}

interface UnidadMedidaFormState {
  nombre: string
  descripcion: string
}

interface UnidadMedidaFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: UnidadMedidaFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: UnidadMedidaFormErrores = {
  nombre: false,
  descripcion: false,
}

export function UnidadMedidaFormModal({
  abierto,
  unidadMedida,
  onClose,
  onSubmit,
}: UnidadMedidaFormModalProps) {
  const [form, setForm] =
    useState<UnidadMedidaFormState>(FORM_INICIAL)
  const [errores, setErrores] =
    useState<UnidadMedidaFormErrores>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (unidadMedida) {
      setForm({
        nombre: unidadMedida.nombre,
        descripcion: unidadMedida.descripcion,
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
  }, [abierto, unidadMedida])

  if (!abierto) {
    return null
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

            const nuevosErrores = {
              nombre:
                form.nombre.trim().length === 0,
              descripcion:
                form.descripcion.trim().length === 0,
            }

            setErrores(nuevosErrores)

            if (
              nuevosErrores.nombre ||
              nuevosErrores.descripcion
            ) {
              return
            }

            onSubmit({
              nombre: form.nombre.trim(),
              descripcion: form.descripcion.trim(),
            })
          }}
        >
          <div className="maestro-modal-body">
            <div className="mb-2">
              <label
                className="form-label maestro-label"
                htmlFor="unidadMedidaNombreModal"
              >
                Nombre de unidad de medida
                <span className="maestro-required" aria-hidden="true">
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
                value={form.nombre}
                aria-invalid={errores.nombre}
                aria-describedby={
                  errores.nombre
                    ? 'unidadMedidaNombreModalError'
                    : undefined
                }
                onChange={(event) => {
                  const value = event.target.value

                  setForm((actual) => ({
                    ...actual,
                    nombre: value,
                  }))

                  if (
                    errores.nombre &&
                    value.trim().length > 0
                  ) {
                    setErrores((actual) => ({
                      ...actual,
                      nombre: false,
                    }))
                  }
                }}
                placeholder="Ej. Unidad, Kilogramo, Litro, Metro"
                required
              />

              {errores.nombre && (
                <div
                  id="unidadMedidaNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="unidadMedidaDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
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
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'unidadMedidaDescripcionModalError'
                    : undefined
                }
                onChange={(event) => {
                  const value = event.target.value

                  setForm((actual) => ({
                    ...actual,
                    descripcion: value,
                  }))

                  if (
                    errores.descripcion &&
                    value.trim().length > 0
                  ) {
                    setErrores((actual) => ({
                      ...actual,
                      descripcion: false,
                    }))
                  }
                }}
                rows={4}
                required
              />

              {errores.descripcion && (
                <div
                  id="unidadMedidaDescripcionModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>
          </div>

          <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn maestro-btn-danger"
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
