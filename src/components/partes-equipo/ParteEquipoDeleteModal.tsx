import { AlertTriangle, Check, X } from 'lucide-react'

import type { ParteEquipo } from '../../types/parteEquipo'

interface ParteEquipoDeleteModalProps {
  abierto: boolean
  parteEquipo: ParteEquipo | null
  onClose: () => void
  onConfirm: () => void
  modo?: 'desactivar' | 'reactivar'
}

export function ParteEquipoDeleteModal({
  abierto,
  parteEquipo,
  onClose,
  onConfirm,
  modo = 'desactivar',
}: ParteEquipoDeleteModalProps) {
  if (!abierto || !parteEquipo) {
    return null
  }

  return (
    <div
      className="maestro-modal-backdrop partes-equipo-page"
      role="presentation"
    >
      <div
        className="maestro-modal-card maestro-modal-card--sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parte-equipo-delete-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-delete-icon">
          <AlertTriangle size={24} />
        </div>

        <h3
          id="parte-equipo-delete-title"
          className="maestro-modal-title text-center"
        >
          {modo === 'reactivar' ? 'Confirmar reactivación' : 'Confirmar desactivación'}
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          {modo === 'reactivar' ? '¿Desea reactivar esta parte de equipo?' : '¿Desea desactivar esta parte de equipo?'}
        </p>

        <p className="maestro-delete-name">
          {parteEquipo.codigo} —{' '}
          {parteEquipo.nombre}
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
            {modo === 'reactivar' ? 'Reactivar' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  )
}
