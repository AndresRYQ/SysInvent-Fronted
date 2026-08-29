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

const FORM_INICIAL: DestinoFormState = {
  nombre: '',
  descripcion: '',
}

export function DestinoFormModal({
  abierto,
  destino,
  onClose,
  onSubmit,
}: DestinoFormModalProps) {
  const [form, setForm] = useState<DestinoFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (destino) {
      setForm({
        nombre: destino.nombre,
        descripcion: destino.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
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
          <div>
            <h3 id="destino-form-title" className="maestro-modal-title">
              {destino ? 'Editar destino' : 'Registrar destino'}
            </h3>

            <p className="maestro-modal-copy">
              Completa los datos del destino.
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
                htmlFor="destinoNombreModal"
              >
                Nombre de destino
              </label>

              <input
                id="destinoNombreModal"
                className="form-control maestro-control"
                type="text"
                value={form.nombre}
                onChange={(event) =>
                  setForm((actual) => ({
                    ...actual,
                    nombre: event.target.value,
                  }))
                }
                placeholder="Ej. Almacén Central, Planta, Sucursal"
                required
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label maestro-label"
                htmlFor="destinoDescripcionModal"
              >
                Descripción
              </label>

              <textarea
                id="destinoDescripcionModal"
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
