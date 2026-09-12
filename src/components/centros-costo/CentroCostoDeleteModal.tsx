import { AlertTriangle, Check, X } from 'lucide-react'
import type { CentroCosto } from '../../types/centroCosto'

interface Props {
  abierto: boolean
  centroCosto: CentroCosto | null
  onClose: () => void
  onConfirm: () => void
  modo?: 'eliminar' | 'reactivar'
}

export function CentroCostoDeleteModal({ abierto, centroCosto, onClose, onConfirm, modo = 'eliminar' }: Props) {
  if (!abierto || !centroCosto) return null
  const reactivar = modo === 'reactivar'

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card maestro-modal-card--sm" role="dialog" aria-modal="true" aria-labelledby="centro-costo-confirm-title">
        <div className="maestro-delete-icon"><AlertTriangle size={24} /></div>
        <h3 id="centro-costo-confirm-title" className="maestro-modal-title text-center">
          {reactivar ? 'Confirmar reactivación' : 'Confirmar eliminación'}
        </h3>
        <p className="maestro-modal-copy text-center mb-0">
          {reactivar ? '¿Desea reactivar este registro?' : '¿Seguro que desea eliminar este registro?'}
        </p>
        <p className="maestro-delete-name">{centroCosto.nombre}</p>
        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button type="button" className="btn maestro-btn-danger" onClick={onClose}><X size={18} />Cancelar</button>
          <button type="button" className="btn maestro-btn-primary" onClick={onConfirm}><Check size={18} />{reactivar ? 'Reactivar' : 'Aceptar'}</button>
        </div>
      </div>
    </div>
  )
}
