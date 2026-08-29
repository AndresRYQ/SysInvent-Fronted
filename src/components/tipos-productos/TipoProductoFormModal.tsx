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

const FORM_INICIAL: TipoProductoFormState = {
  nombre: '',
  descripcion: '',
}

export function TipoProductoFormModal({
  abierto,
  tipoProducto,
  onClose,
  onSubmit,
}: TipoProductoFormModalProps) {
  const [form, setForm] =
    useState<TipoProductoFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (tipoProducto) {
      setForm({
        nombre: tipoProducto.nombre,
        descripcion: tipoProducto.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
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
          <div>
            <h3
              id="tipo-producto-form-title"
              className="maestro-modal-title"
            >
              {tipoProducto
                ? 'Editar tipo de producto'
                : 'Registrar tipo de producto'}
            </h3>

            <p className="maestro-modal-copy">
              Completa los datos del tipo de producto.
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
                htmlFor="tipoProductoNombreModal"
              >
                Nombre de tipo de producto
              </label>

              <input
                id="tipoProductoNombreModal"
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
                htmlFor="tipoProductoDescripcionModal"
              >
                Descripción
              </label>

              <textarea
                id="tipoProductoDescripcionModal"
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
