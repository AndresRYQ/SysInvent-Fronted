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
      className="categories-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="categories-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="categories-modal-header">
          <div>
            <h3
              id="categoria-form-title"
              className="categories-modal-title"
            >
              {categoria
                ? 'Editar categoria'
                : 'Registrar categoria'}
            </h3>

            <p className="categories-modal-copy">
              Completa los datos de la categoria.
            </p>
          </div>

          <button
            type="button"
            className="btn categories-modal-close"
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
          <div className="categories-modal-body">
            <div className="mb-3">
              <label
                className="form-label categories-label"
                htmlFor="categoriaNombreModal"
              >
                Nombre de categoria
              </label>

              <input
                id="categoriaNombreModal"
                className="form-control categories-control"
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
                className="form-label categories-label"
                htmlFor="categoriaDescripcionModal"
              >
                Descripcion
              </label>

              <textarea
                id="categoriaDescripcionModal"
                className="form-control categories-control categories-control--textarea"
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

          <div className="categories-modal-footer">
            <button
              type="button"
              className="btn categories-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn categories-btn-primary"
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
