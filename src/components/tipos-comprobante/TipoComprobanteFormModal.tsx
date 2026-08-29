import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { TipoComprobante } from '../../types/tipoComprobante'

interface TipoComprobanteFormModalProps {
  abierto: boolean
  tipoComprobante: TipoComprobante | null
  onClose: () => void
  onSubmit: (
    tipoComprobante: Pick<
      TipoComprobante,
      'nombre' | 'descripcion'
    >,
  ) => void
}

interface TipoComprobanteFormState {
  nombre: string
  descripcion: string
}

interface TipoComprobanteFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: TipoComprobanteFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: TipoComprobanteFormErrores = {
  nombre: false,
  descripcion: false,
}

export function TipoComprobanteFormModal({
  abierto,
  tipoComprobante,
  onClose,
  onSubmit,
}: TipoComprobanteFormModalProps) {
  const [form, setForm] =
    useState<TipoComprobanteFormState>(FORM_INICIAL)
  const [errores, setErrores] =
    useState<TipoComprobanteFormErrores>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (tipoComprobante) {
      setForm({
        nombre: tipoComprobante.nombre,
        descripcion: tipoComprobante.descripcion,
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
  }, [abierto, tipoComprobante])

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
        aria-labelledby="tipo-comprobante-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="tipo-comprobante-form-title"
              className="maestro-modal-title"
            >
              {tipoComprobante
                ? 'Editar tipo de comprobante'
                : 'Registrar tipo de comprobante'}
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
            <div className="mb-2">
              <label
                className="form-label maestro-label"
                htmlFor="tipoComprobanteNombreModal"
              >
                Nombre de tipo de comprobante
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="tipoComprobanteNombreModal"
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
                    ? 'tipoComprobanteNombreModalError'
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
                  id="tipoComprobanteNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="tipoComprobanteDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <textarea
                id="tipoComprobanteDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'tipoComprobanteDescripcionModalError'
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
                  id="tipoComprobanteDescripcionModalError"
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
