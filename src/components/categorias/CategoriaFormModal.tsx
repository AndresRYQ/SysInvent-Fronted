import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'

import type { Categoria } from '../../types/categoria'

interface CategoriaFormModalProps {
  abierto: boolean
  categoria: Categoria | null
  onClose: () => void
  onSubmit: (
    categoria: Pick<
      Categoria,
      'nombre' | 'descripcion'
    >,
  ) => void
}

interface CategoriaFormState {
  nombre: string
  descripcion: string
}

const FORM_INICIAL: CategoriaFormState = {
  nombre: '',
  descripcion: '',
}

export function CategoriaFormModal({
  abierto,
  categoria,
  onClose,
  onSubmit,
}: CategoriaFormModalProps) {
  const [form, setForm] =
    useState<CategoriaFormState>(FORM_INICIAL)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      })
      return
    }

    setForm(FORM_INICIAL)
  }, [abierto, categoria])

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
        aria-labelledby="categoria-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div>
            <h3
              id="categoria-form-title"
              className="maestro-modal-title"
            >
              {categoria
                ? 'Editar categoría'
                : 'Registrar categoría'}
            </h3>

            <p className="maestro-modal-copy">
              Completa los datos de la categoría.
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
                htmlFor="categoriaNombreModal"
              >
                Nombre de categoría
              </label>

              <input
                id="categoriaNombreModal"
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
                htmlFor="categoriaDescripcionModal"
              >
                Descripción
              </label>

              <textarea
                id="categoriaDescripcionModal"
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

