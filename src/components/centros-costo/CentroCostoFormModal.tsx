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

const FORM_INICIAL: CentroCostoFormState = {
  nombre: '',
  descripcion: '',
}

export function CentroCostoFormModal({
  abierto,
  centroCosto,
  onClose,
  onSubmit,
}: CentroCostoFormModalProps) {
  const [form, setForm] =
    useState<CentroCostoFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (centroCosto) {
      setForm({
        nombre: centroCosto.nombre,
        descripcion: centroCosto.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
  }, [abierto, centroCosto])

  if (!abierto) {
    return null
  }

  return (
    <div
      className="centros-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="centros-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="centro-costo-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="centros-modal-header">
          <div>
            <h3
              id="centro-costo-form-title"
              className="centros-modal-title"
            >
              {centroCosto
                ? 'Editar centro de costo'
                : 'Registrar centro de costo'}
            </h3>

            <p className="centros-modal-copy">
              Completa los datos del centro de costo.
            </p>
          </div>

          <button
            type="button"
            className="btn centros-modal-close"
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
              descripcion:
                form.descripcion.trim(),
            })
          }}
        >
          <div className="centros-modal-body">
            <div className="mb-3">
              <label
                className="form-label centros-label"
                htmlFor="centroCostoNombreModal"
              >
                Nombre de centro de costo
              </label>

              <input
                id="centroCostoNombreModal"
                className="form-control centros-control"
                type="text"
                value={form.nombre}
                onChange={(event) =>
                  setForm((actual) => ({
                    ...actual,
                    nombre: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label centros-label"
                htmlFor="centroCostoDescripcionModal"
              >
                Descripcion
              </label>

              <textarea
                id="centroCostoDescripcionModal"
                className="form-control centros-control centros-control--textarea"
                value={form.descripcion}
                onChange={(event) =>
                  setForm((actual) => ({
                    ...actual,
                    descripcion:
                      event.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>
          </div>

          <div className="centros-modal-footer">
            <button
              type="button"
              className="btn centros-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn centros-btn-primary"
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
