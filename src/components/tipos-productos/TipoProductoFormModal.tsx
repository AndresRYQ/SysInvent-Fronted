import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { TipoProducto } from '../../types/tipoProducto'

interface TipoProductoFormModalProps {
  abierto: boolean
  tipoProducto: TipoProducto | null
  onClose: () => void
  onSubmit: (
    tipoProducto: Pick<
      TipoProducto,
      'nombre' | 'descripcion'
    >,
  ) => void
}

interface TipoProductoFormState {
  nombre: string
  descripcion: string
}

interface TipoProductoFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: TipoProductoFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: TipoProductoFormErrores = {
  nombre: false,
  descripcion: false,
}

export function TipoProductoFormModal({
  abierto,
  tipoProducto,
  onClose,
  onSubmit,
}: TipoProductoFormModalProps) {
  const [form, setForm] =
    useState<TipoProductoFormState>(FORM_INICIAL)
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
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
  }, [abierto, tipoProducto])

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
                htmlFor="tipoProductoNombreModal"
              >
                Nombre de tipo de producto
                <span className="maestro-required" aria-hidden="true">
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
                value={form.nombre}
                aria-invalid={errores.nombre}
                aria-describedby={
                  errores.nombre
                    ? 'tipoProductoNombreModalError'
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
                  id="tipoProductoNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="tipoProductoDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
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
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'tipoProductoDescripcionModalError'
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
                  id="tipoProductoDescripcionModalError"
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
