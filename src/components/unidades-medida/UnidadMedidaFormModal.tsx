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

const FORM_INICIAL: UnidadMedidaFormState = {
  nombre: '',
  descripcion: '',
}

export function UnidadMedidaFormModal({
  abierto,
  unidadMedida,
  onClose,
  onSubmit,
}: UnidadMedidaFormModalProps) {
  const [form, setForm] =
    useState<UnidadMedidaFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (unidadMedida) {
      setForm({
        nombre: unidadMedida.nombre,
        descripcion: unidadMedida.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
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
          <div>
            <h3
              id="unidad-medida-form-title"
              className="maestro-modal-title"
            >
              {unidadMedida
                ? 'Editar unidad de medida'
                : 'Registrar unidad de medida'}
            </h3>

            <p className="maestro-modal-copy">
              Completa los datos de la unidad de medida.
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
          onSubmit={(event) => {
            event.preventDefault()

            onSubmit({
              nombre: form.nombre.trim(),
              descripcion: form.descripcion.trim(),
            })
          }}
        >
          <div className="maestro-modal-body">
            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="unidadMedidaNombreModal"
              >
                Nombre de unidad de medida
              </label>

              <input
                id="unidadMedidaNombreModal"
                className="form-control maestro-control"
                type="text"
                value={form.nombre}
                onChange={(event) =>
                  setForm((actual) => ({
                    ...actual,
                    nombre: event.target.value,
                  }))
                }
                placeholder="Ej. Unidad, Kilogramo, Litro, Metro"
                required
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="unidadMedidaDescripcionModal"
              >
                Descripción
              </label>

              <textarea
                id="unidadMedidaDescripcionModal"
                className="form-control maestro-control maestro-control--textarea"
                value={form.descripcion}
                onChange={(event) =>
                  setForm((actual) => ({
                    ...actual,
                    descripcion: event.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>
          </div>

          <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn maestro-btn-secondary"
              onClick={onClose}
            >
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
