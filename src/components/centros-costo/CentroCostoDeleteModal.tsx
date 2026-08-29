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
      className="centros-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="centros-modal-card centros-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="centro-costo-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="centros-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="centro-costo-delete-title"
          className="centros-modal-title text-center"
        >
          Confirmar eliminacion
        </h3>

        <p className="centros-modal-copy text-center mb-0">
          ¿Seguro que quiere eliminar este registro?
        </p>

        <p className="centros-delete-name">
          {centroCosto.nombre}
        </p>

        <div className="centros-modal-footer centros-modal-footer--center">
          <button
            type="button"
            className="btn centros-btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn centros-btn-danger"
            onClick={onConfirm}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
