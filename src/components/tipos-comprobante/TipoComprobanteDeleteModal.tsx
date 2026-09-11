import { AlertTriangle } from 'lucide-react'

import type { TipoComprobante } from '../../types/tipoComprobante'

interface TipoComprobanteDeleteModalProps {
  abierto: boolean
  tipoComprobante: TipoComprobante | null
  onClose: () => void
  onConfirm: () => void
}

export function TipoComprobanteDeleteModal({
  abierto,
  tipoComprobante,
  onClose,
  onConfirm,
}: TipoComprobanteDeleteModalProps) {
  if (!abierto || !tipoComprobante) {
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
        aria-labelledby="tipo-comprobante-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="tipo-comprobante-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quiere eliminar este registro?
        </p>

        <p className="maestro-delete-name">
          {tipoComprobante.nombre}
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
