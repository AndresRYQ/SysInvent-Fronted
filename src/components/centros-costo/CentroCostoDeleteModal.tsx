import { AlertTriangle } from 'lucide-react'

import type { CentroCosto } from '../../types/centroCosto'

interface CentroCostoDeleteModalProps {
  abierto: boolean
  centroCosto: CentroCosto | null
  onClose: () => void
  onConfirm: () => void
}

export function CentroCostoDeleteModal({
  abierto,
  centroCosto,
  onClose,
  onConfirm,
}: CentroCostoDeleteModalProps) {
  if (!abierto || !centroCosto) {
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
        aria-labelledby="centro-costo-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="centro-costo-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quiere eliminar este registro?
        </p>

        <p className="maestro-delete-name">
          {centroCosto.nombre}
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

