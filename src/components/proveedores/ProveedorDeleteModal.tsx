import { AlertTriangle } from 'lucide-react'

import type { Proveedor } from '../../types/proveedor'

interface ProveedorDeleteModalProps {
  abierto: boolean
  proveedor: Proveedor | null
  onClose: () => void
  onConfirm: () => void
}

export function ProveedorDeleteModal({
  abierto,
  proveedor,
  onClose,
  onConfirm,
}: ProveedorDeleteModalProps) {
  if (!abierto || !proveedor) {
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
        aria-labelledby="proveedor-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="proveedor-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quieres eliminar este proveedor?
        </p>

        <p className="maestro-delete-name">
          {proveedor.razonSocial}
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
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}