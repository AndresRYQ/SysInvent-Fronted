import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { CentroCosto } from '../../types/centroCosto'

interface CentroCostoFormModalProps {
  abierto: boolean
  centroCosto: CentroCosto | null
  onClose: () => void
  onSubmit: (
    centroCosto: Pick<
      CentroCosto,
      'nombre' | 'descripcion'
    >,
  ) => void
}

interface CentroCostoFormState {
  nombre: string
  descripcion: string
}

interface CentroCostoFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: CentroCostoFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: CentroCostoFormErrores = {
  nombre: false,
  descripcion: false,
}

export function CentroCostoFormModal({
  abierto,
  centroCosto,
  onClose,
  onSubmit,
}: CentroCostoFormModalProps) {
  const [form, setForm] =
    useState<CentroCostoFormState>(FORM_INICIAL)
  const [errores, setErrores] =
    useState<CentroCostoFormErrores>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (centroCosto) {
      setForm({
        nombre: centroCosto.nombre,
        descripcion: centroCosto.descripcion,
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
  }, [abierto, centroCosto])

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
        aria-labelledby="centro-costo-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="centro-costo-form-title"
              className="maestro-modal-title"
            >
              {centroCosto
                ? 'Editar centro de costo'
                : 'Registrar centro de costo'}
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
              descripcion:
                form.descripcion.trim(),
            })
          }}
        >
          <div className="maestro-modal-body">
            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="centroCostoNombreModal"
              >
                Nombre de centro de costo
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="centroCostoNombreModal"
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
                    ? 'centroCostoNombreModalError'
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
                required
              />

              {errores.nombre && (
                <div
                  id="centroCostoNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="centroCostoDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <textarea
                id="centroCostoDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'centroCostoDescripcionModalError'
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
                  id="centroCostoDescripcionModalError"
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
