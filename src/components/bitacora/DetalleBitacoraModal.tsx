import {
  History,
  X,
} from 'lucide-react'

import type { RegistroBitacora } from '../../types/bitacora'

interface DetalleBitacoraModalProps {
  registro: RegistroBitacora | null
  onClose: () => void
}

function formatearFecha(
  fechaHora: string,
): string {
  const fecha = new Date(fechaHora)

  if (Number.isNaN(fecha.getTime())) {
    return fechaHora
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(fecha)
}

export function DetalleBitacoraModal({
  registro,
  onClose,
}: DetalleBitacoraModalProps) {
  if (!registro) {
    return null
  }

  return (
    <div
      className="maestro-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="maestro-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bitacora-detail-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="bitacora-detail-title"
              className="maestro-modal-title"
            >
              <History
                size={20}
                className="me-2"
              />
              Detalle de auditoría
            </h3>
          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="maestro-modal-body">
          <dl className="row mb-0">
            <dt className="col-sm-4 mb-2">
              Fecha y hora
            </dt>
            <dd className="col-sm-8 mb-2">
              {formatearFecha(
                registro.fechaHora,
              )}
            </dd>

            <dt className="col-sm-4 mb-2">
              Usuario
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.usuario}
            </dd>

            <dt className="col-sm-4 mb-2">
              Nombre completo
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.nombreCompleto}
            </dd>

            <dt className="col-sm-4 mb-2">
              Rol
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.rol}
            </dd>

            <dt className="col-sm-4 mb-2">
              Módulo
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.modulo}
            </dd>

            <dt className="col-sm-4 mb-2">
              Acción
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.accion}
            </dd>

            <dt className="col-sm-4 mb-2">
              Registro afectado
            </dt>
            <dd className="col-sm-8 mb-2">
              {registro.registroId ?? 'No aplica'}
            </dd>

            <dt className="col-sm-4">
              Detalle
            </dt>
            <dd className="col-sm-8">
              {registro.detalle}
            </dd>
          </dl>
        </div>

        <div className="maestro-modal-footer">
          <button
            type="button"
            className="btn btn-maestro-info"
            onClick={onClose}
          >
            <X size={18} />
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}