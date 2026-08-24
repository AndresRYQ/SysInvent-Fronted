import { AlertTriangle } from 'lucide-react'

import type { Categoria } from '../../types/categoria'

interface CategoriaDeleteModalProps {
  abierto: boolean
  categoria: Categoria | null
  onClose: () => void
  onConfirm: () => void
}

export function CategoriaDeleteModal({
  abierto,
  categoria,
  onClose,
  onConfirm,
}: CategoriaDeleteModalProps) {
  if (!abierto || !categoria) {
    return null
  }

  return (
    <div
      className="categories-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="categories-modal-card categories-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="categories-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="categoria-delete-title"
          className="categories-modal-title text-center"
        >
          Confirmar eliminacion
        </h3>

        <p className="categories-modal-copy text-center mb-0">
          ¿Seguro que quiere eliminar este registro?
        </p>

        <p className="categories-delete-name">
          {categoria.nombre}
        </p>

        <div className="categories-modal-footer categories-modal-footer--center">
          <button
            type="button"
            className="btn categories-btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn categories-btn-danger"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
