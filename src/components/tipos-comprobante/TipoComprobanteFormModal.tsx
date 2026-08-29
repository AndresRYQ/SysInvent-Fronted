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

const FORM_INICIAL: TipoComprobanteFormState = {
  nombre: '',
  descripcion: '',
}

export function TipoComprobanteFormModal({
  abierto,
  tipoComprobante,
  onClose,
  onSubmit,
}: TipoComprobanteFormModalProps) {
  const [form, setForm] =
    useState<TipoComprobanteFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (tipoComprobante) {
      setForm({
        nombre: tipoComprobante.nombre,
        descripcion: tipoComprobante.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
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
          <div>
            <h3
              id="tipo-comprobante-form-title"
              className="maestro-modal-title"
            >
              {tipoComprobante
                ? 'Editar tipo de comprobante'
                : 'Registrar tipo de comprobante'}
            </h3>

            <p className="maestro-modal-copy">
              Completa los datos del tipo de comprobante.
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
              descripcion:
                form.descripcion.trim(),
            })
          }}
        >
          <div className="maestro-modal-body">
            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="tipoComprobanteNombreModal"
              >
                Nombre de tipo de comprobante
              </label>

              <input
                id="tipoComprobanteNombreModal"
                className="form-control maestro-control"
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
                className="form-label maestro-label"
                htmlFor="tipoComprobanteDescripcionModal"
              >
                Descripción
              </label>

              <textarea
                id="tipoComprobanteDescripcionModal"
                className="form-control maestro-control maestro-control--textarea"
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
