import { AlertTriangle } from 'lucide-react'

import type { ParteEquipo } from '../../types/parteEquipo'

interface ParteEquipoDeleteModalProps {
  abierto: boolean
  parteEquipo: ParteEquipo | null
  onClose: () => void
  onConfirm: () => void
}

export function ParteEquipoDeleteModal({
  abierto,
  parteEquipo,
  onClose,
  onConfirm,
}: ParteEquipoDeleteModalProps) {
  if (!abierto || !parteEquipo) {
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
          Confirmar eliminación
        </h3>

        <p className="maestro-modal-copy text-center mb-0">
          ¿Seguro que quieres eliminar esta
          parte de equipo?
        </p>

        <p className="maestro-delete-name">
          {parteEquipo.codigo} —{' '}
          {parteEquipo.nombre}
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