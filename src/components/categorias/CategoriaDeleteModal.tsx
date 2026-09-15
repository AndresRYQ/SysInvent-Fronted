import { AlertTriangle, Check, X } from 'lucide-react'
import type { Categoria } from '../../types/categoria'

interface Props {
  abierto: boolean
  categoria: Categoria | null
  onClose: () => void
  onConfirm: () => void
  modo?: 'desactivar' | 'reactivar'
}

export function CategoriaDeleteModal({ abierto, categoria, onClose, onConfirm, modo = 'desactivar' }: Props) {
  if (!abierto || !categoria) return null
  const reactivar = modo === 'reactivar'
  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card maestro-modal-card--sm" role="dialog" aria-modal="true" aria-labelledby="categoria-confirm-title">
        <div className="maestro-delete-icon"><AlertTriangle size={24} /></div>
        <h3 id="categoria-confirm-title" className="maestro-modal-title text-center">{reactivar ? 'Confirmar reactivación' : 'Confirmar desactivación'}</h3>
        <p className="maestro-modal-copy text-center mb-0">{reactivar ? '¿Desea reactivar este registro?' : '¿Seguro que desea desactivar este registro?'}</p>
        <p className="maestro-delete-name">{categoria.nombre}</p>
        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button type="button" className="btn maestro-btn-danger" onClick={onClose}><X size={18} />Cancelar</button>
          <button type="button" className="btn maestro-btn-primary" onClick={onConfirm}><Check size={18} />{reactivar ? 'Reactivar' : 'Aceptar'}</button>
        </div>
      </div>
    </div>
  )
}
