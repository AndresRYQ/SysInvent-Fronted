import { AlertTriangle, Check, X } from 'lucide-react'

interface ConfirmacionModalProps {
  abierto: boolean
  titulo: string
  mensaje: string
  onClose: () => void
  onConfirm: () => void
  confirmando?: boolean
}

export function ConfirmacionModal({
  abierto,
  titulo,
  mensaje,
  onClose,
  onConfirm,
  confirmando = false,
}: ConfirmacionModalProps) {
  if (!abierto) return null

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card maestro-modal-card--sm" role="dialog" aria-modal="true" aria-labelledby="confirmacion-modal-titulo">
        <div className="maestro-delete-icon"><AlertTriangle size={24} /></div>
        <h3 id="confirmacion-modal-titulo" className="maestro-modal-title text-center">{titulo}</h3>
        <p className="maestro-modal-copy text-center mb-0">{mensaje}</p>
        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button type="button" className="btn btn-maestro-danger" onClick={onClose} disabled={confirmando}>
            <X size={18} />Cancelar
          </button>
          <button type="button" className="btn btn-maestro-primary" onClick={onConfirm} disabled={confirmando}>
            <Check size={18} />{confirmando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
