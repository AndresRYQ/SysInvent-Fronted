import { AlertTriangle, Check, X } from 'lucide-react'

import type { Contacto } from '../../types/contacto'

interface ContactoDeleteModalProps {
  abierto: boolean
  contacto: Contacto | null
  onClose: () => void
  onConfirm: () => void
  modo?: 'desactivar' | 'reactivar'
}

export function ContactoDeleteModal({
  abierto,
  contacto,
  onClose,
  onConfirm,
  modo = 'desactivar',
}: ContactoDeleteModalProps) {
  if (!abierto || !contacto) {
    return null
  }

  return (
    <div
      className="maestro-modal-backdrop contactos-page"
      role="presentation"
    >
      <div
        className="maestro-modal-card maestro-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contacto-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="contacto-delete-title"
          className="maestro-modal-title text-center"
        >
          {modo === 'reactivar' ? 'Confirmar reactivación' : 'Confirmar desactivación'}
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          {modo === 'reactivar' ? '¿Desea reactivar este contacto?' : '¿Desea desactivar este contacto?'}
        </p>

        <p className="maestro-delete-name">
          {contacto.nombreCompleto}
        </p>

        <div className="maestro-modal-footer maestro-modal-footer--center">
          <button
            type="button"
            className="btn maestro-btn-danger"
            onClick={onClose}
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            type="button"
            className="btn maestro-btn-primary"
            onClick={onConfirm}
          >
            <Check size={18} />
            {modo === 'reactivar' ? 'Reactivar' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  )
}
