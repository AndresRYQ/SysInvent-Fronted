import { AlertTriangle, Check, X } from 'lucide-react'

import type { TipoProducto } from '../../types/tipoProducto'

interface TipoProductoDeleteModalProps {
  abierto: boolean
  tipoProducto: TipoProducto | null
  accion?: 'eliminar' | 'reactivar'
  onClose: () => void
  onConfirm: () => void
}

export function TipoProductoDeleteModal({
  abierto,
  tipoProducto,
  accion = 'eliminar',
  onClose,
  onConfirm,
}: TipoProductoDeleteModalProps) {
  if (!abierto || !tipoProducto) return null

  const esReactivacion = accion === 'reactivar'

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div
        className="maestro-modal-card maestro-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tipo-producto-delete-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3 id="tipo-producto-delete-title" className="maestro-modal-title text-center">
          {esReactivacion ? 'Confirmar reactivación' : 'Confirmar eliminación'}
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          {esReactivacion
            ? '¿Seguro que quiere reactivar este registro?'
            : '¿Seguro que quiere eliminar este registro?'}
        </p>

        <p className="maestro-delete-name">{tipoProducto.nombre}</p>

        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button type="button" className="btn maestro-btn-danger" onClick={onClose}>
            <X size={18} />
            Cancelar
          </button>
          <button type="button" className="btn maestro-btn-primary" onClick={onConfirm}>
            <Check size={18} />
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
