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
      className="maestro-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="maestro-modal-card maestro-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="categoria-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quiere eliminar este registro?
        </p>

        <p className="maestro-delete-name">
          {categoria.nombre}
        </p>

        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn maestro-btn-danger"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

