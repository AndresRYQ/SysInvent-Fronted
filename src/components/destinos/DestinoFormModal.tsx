import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { Destino } from '../../types/destino'

interface DestinoFormModalProps {
  abierto: boolean
  destino: Destino | null
  onClose: () => void
  onSubmit: (destino: Pick<Destino, 'nombre' | 'descripcion'>) => void
}

interface DestinoFormState {
  nombre: string
  descripcion: string
}

interface DestinoFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: DestinoFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: DestinoFormErrores = {
  nombre: false,
  descripcion: false,
}

export function DestinoFormModal({
  abierto,
  destino,
  onClose,
  onSubmit,
}: DestinoFormModalProps) {
  const [form, setForm] = useState<DestinoFormState>(FORM_INICIAL)
  const [errores, setErrores] =
    useState<DestinoFormErrores>(
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
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
  }, [abierto, destino])

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
        aria-labelledby="destino-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3 id="destino-form-title" className="maestro-modal-title">
              {destino ? 'Editar destino' : 'Registrar destino'}
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
                htmlFor="destinoNombreModal"
              >
                Nombre de destino
                <span className="maestro-required" aria-hidden="true">
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
                value={form.nombre}
                aria-invalid={errores.nombre}
                aria-describedby={
                  errores.nombre
                    ? 'destinoNombreModalError'
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
                placeholder="Ej. Almacén Central, Planta, Sucursal"
                required
              />

              {errores.nombre && (
                <div
                  id="destinoNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="destinoDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
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
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'destinoDescripcionModalError'
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
                  id="destinoDescripcionModalError"
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

            <button type="submit" className="btn maestro-btn-primary">
              <Save size={18} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
