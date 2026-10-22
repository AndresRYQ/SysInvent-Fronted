import { AlertTriangle, Check, X } from 'lucide-react'
import type { Rol } from '../../types/rol'

interface Props {
  abierto: boolean
  rol: Rol | null
  onClose: () => void
  onConfirm: () => void
}

export function RolDeleteModal({ abierto, rol, onClose, onConfirm }: Props) {
  if (!abierto || !rol) return null

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card maestro-modal-card--sm" role="dialog" aria-modal="true" aria-labelledby="rol-confirm-title">
        <div className="maestro-delete-icon"><AlertTriangle size={24} /></div>
        <h3 id="rol-confirm-title" className="maestro-modal-title text-center">Confirmar eliminación</h3>
        <p className="maestro-modal-copy text-center mb-0">¿Seguro que deseas eliminar este rol?</p>
        <p className="maestro-delete-name">{rol.nombre}</p>
        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button type="button" className="btn btn-maestro-danger" onClick={onClose}><X size={18} />Cancelar</button>
          <button type="button" className="btn btn-maestro-primary" onClick={onConfirm}><Check size={18} />Aceptar</button>
        </div>
      </div>
    </div>
  )
}
