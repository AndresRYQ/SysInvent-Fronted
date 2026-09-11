import { AlertTriangle } from 'lucide-react'

import type { IngresoAlmacen } from '../../types/ingresoAlmacen'

interface IngresoDeleteModalProps {
  abierto: boolean
  ingreso: IngresoAlmacen | null
  onClose: () => void
  onConfirm: () => void
}

export function IngresoDeleteModal({
  abierto,
  ingreso,
  onClose,
  onConfirm,
}: IngresoDeleteModalProps) {
  if (!abierto || !ingreso) {
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
        aria-labelledby="ingreso-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="ingreso-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar anulación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quiere anular este ingreso?
        </p>

        <p className="maestro-delete-name">
          {ingreso.numeroIngreso}
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
