import { AlertTriangle, Check, X } from 'lucide-react'

import type { Producto } from '../../types/producto'

interface ProductoDeleteModalProps {
  abierto: boolean
  producto: Producto | null
  onClose: () => void
  onConfirm: () => void
}

export function ProductoDeleteModal({
  abierto,
  producto,
  onClose,
  onConfirm,
}: ProductoDeleteModalProps) {
  if (!abierto || !producto) {
    return null
  }

  return (
    <div
      className="maestro-modal-backdrop productos-page"
      role="presentation"
    >
      <div
        className="maestro-modal-card maestro-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="producto-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="producto-delete-title"
          className="maestro-modal-title text-center"
        >
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quieres eliminar este producto?
        </p>

        <p className="maestro-delete-name">
          {producto.codigo} — {producto.nombre}
        </p>

        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button
            type="button"
            className="btn btn-maestro-danger"
            onClick={onClose}
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-maestro-primary"
            onClick={onConfirm}
          >
            <Check size={18} />
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
