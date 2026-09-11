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

interface CategoriaFormErrores {
  nombre: boolean
  descripcion: boolean
}

const FORM_INICIAL: CategoriaFormState = {
  nombre: '',
  descripcion: '',
}

const ERRORES_INICIALES: CategoriaFormErrores = {
  nombre: false,
  descripcion: false,
}

export function CategoriaFormModal({
  abierto,
  categoria,
  onClose,
  onSubmit,
}: CategoriaFormModalProps) {
  const [form, setForm] =
    useState<CategoriaFormState>(FORM_INICIAL)
  const [errores, setErrores] =
    useState<CategoriaFormErrores>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (categoria) {
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(FORM_INICIAL)
    setErrores(ERRORES_INICIALES)
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
          <div className="maestro-modal-header__content">
            <h3
              id="categoria-form-title"
              className="maestro-modal-title"
            >
              {categoria
                ? 'Editar categoría'
                : 'Registrar categoría'}
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
                htmlFor="categoriaNombreModal"
              >
                Nombre de categoría
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="categoriaNombreModal"
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
                    ? 'categoriaNombreModalError'
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
                  id="categoriaNombreModalError"
                  className="maestro-field-error"
                >
                  Campo requerido
                </div>
              )}
            </div>

            <div>
              <label
                className="form-label maestro-label"
                htmlFor="categoriaDescripcionModal"
              >
                Descripción
                <span className="maestro-required" aria-hidden="true">
                  *
                </span>
              </label>

              <textarea
                id="categoriaDescripcionModal"
                className={`form-control maestro-control maestro-control--textarea${
                  errores.descripcion
                    ? ' maestro-control--error'
                    : ''
                }`}
                value={form.descripcion}
                aria-invalid={errores.descripcion}
                aria-describedby={
                  errores.descripcion
                    ? 'categoriaDescripcionModalError'
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
                  id="categoriaDescripcionModalError"
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

