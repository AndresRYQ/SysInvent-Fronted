import {
  Eye,
  History,
  UserRound,
} from 'lucide-react'

import type {
  AccionBitacora,
  RegistroBitacora,
} from '../../types/bitacora'

import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

interface TablaBitacoraProps {
  registros: RegistroBitacora[]
  totalItems: number
  page: number
  pageSize: number
  onVerDetalle: (
    registro: RegistroBitacora,
  ) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (
    pageSize: number,
  ) => void
}

function formatearFecha(
  fechaHora: string,
): string {
  const fecha = new Date(fechaHora)

  if (Number.isNaN(fecha.getTime())) {
    return fechaHora
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(fecha)
}

function obtenerEtiquetaAccion(
  accion: AccionBitacora,
): string {
  const etiquetas: Record<
    AccionBitacora,
    string
  > = {
    INICIO_SESION: 'Inicio de sesión',
    CIERRE_SESION: 'Cierre de sesión',
    CREAR: 'Creación',
    EDITAR: 'Edición',
    ELIMINAR: 'Eliminación',
    ACCESO_DENEGADO: 'Acceso denegado',
    BLOQUEO_LOGIN: 'Bloqueo',
  }

  return etiquetas[accion]
}

function obtenerClaseAccion(
  accion: AccionBitacora,
): string {
  if (accion === 'CREAR') {
    return 'bg-success'
  }

  if (accion === 'EDITAR') {
    return 'bg-primary'
  }

  if (accion === 'ELIMINAR') {
    return 'bg-danger'
  }

  if (
    accion === 'ACCESO_DENEGADO' ||
    accion === 'BLOQUEO_LOGIN'
  ) {
    return 'bg-warning text-dark'
  }

  return 'bg-secondary'
}

export function TablaBitacora({
  registros,
  totalItems,
  page,
  pageSize,
  onVerDetalle,
  onPageChange,
  onPageSizeChange,
}: TablaBitacoraProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <span className="maestro-kicker">
            <History size={16} />
            Registros de auditoría
          </span>
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Módulo</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th className="text-center">
                  Ver
                </th>
              </tr>
            </thead>

            <tbody>
              {registros.length > 0 ? (
                registros.map((registro) => (
                  <tr key={registro.id}>
                    <td>
                      {formatearFecha(
                        registro.fechaHora,
                      )}
                    </td>

                    <td>
                      <div className="table-cell-main">
                        <span className="table-cell-icon">
                          <UserRound size={16} />
                        </span>

                        <div>
                          <strong>
                            {registro.usuario}
                          </strong>

                          <div className="small text-muted">
                            {registro.nombreCompleto}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{registro.rol}</td>
                    <td>{registro.modulo}</td>

                    <td>
                      <span
                        className={`badge ${obtenerClaseAccion(
                          registro.accion,
                        )}`}
                      >
                        {obtenerEtiquetaAccion(
                          registro.accion,
                        )}
                      </span>
                    </td>

                    <td>
                      <span title={registro.detalle}>
                        {registro.detalle.length > 70
                          ? `${registro.detalle.slice(
                              0,
                              70,
                            )}…`
                          : registro.detalle}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn table-action-btn"
                          title="Ver detalle"
                          aria-label="Ver detalle del registro"
                          onClick={() =>
                            onVerDetalle(
                              registro,
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={History} iconSize={28} title="No hay registros de bitácora" description="Las acciones del sistema aparecerán aquí." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={totalItems}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={
            onPageSizeChange
          }
        />
      </div>
    </section>
  )
}
