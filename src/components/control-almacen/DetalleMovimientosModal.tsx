import {
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from 'lucide-react'

import { obtenerCentrosCosto } from '../../services/centroCostoService'
import { obtenerDestinos } from '../../services/destinoService'
import { obtenerPartesEquipo } from '../../services/parteEquipoService'
import { obtenerUnidadesMedida } from '../../services/unidadMedidaService'

import type { ControlAlmacenProducto } from '../../types/kardex'

interface DetalleMovimientosModalProps {
  abierto: boolean
  producto:
    ControlAlmacenProducto | null
  onClose: () => void
}

function formatearFecha(
  fecha: string,
): string {
  if (!fecha) {
    return '-'
  }

  const fechaLocal = new Date(
    `${fecha}T00:00:00`,
  )

  if (
    Number.isNaN(fechaLocal.getTime())
  ) {
    return fecha
  }

  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(fechaLocal)
}

export function DetalleMovimientosModal({
  abierto,
  producto,
  onClose,
}: DetalleMovimientosModalProps) {
  if (!abierto || !producto) {
    return null
  }

  const destinos = obtenerDestinos()
  const partesEquipo =
    obtenerPartesEquipo()

  const centrosCosto =
    obtenerCentrosCosto()

  const unidadesMedida =
    obtenerUnidadesMedida()

  const unidad =
    unidadesMedida.find(
      (item) =>
        String(item.id) === String(
        producto.unidadMedidaId),
    )?.nombre ?? 'Sin unidad'

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
        aria-labelledby="movimientos-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          width: 'min(1200px, 96vw)',
          maxWidth: '1200px',
        }}
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="movimientos-title"
              className="maestro-modal-title"
            >
              Movimientos de {producto.nombre}
            </h3>

            <p className="maestro-modal-copy mb-0">
              {producto.codigo} · {unidad}
            </p>
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
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 bg-light h-100">
                <div className="card-body">
                  <span className="small text-secondary">
                    Total de entradas
                  </span>

                  <strong className="d-block fs-4 text-success mt-1">
                    {producto.totalEntradas}{' '}
                    {unidad}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 bg-light h-100">
                <div className="card-body">
                  <span className="small text-secondary">
                    Total de salidas
                  </span>

                  <strong className="d-block fs-4 text-danger mt-1">
                    {producto.totalSalidas}{' '}
                    {unidad}
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 bg-light h-100">
                <div className="card-body">
                  <span className="small text-secondary">
                    Stock disponible
                  </span>

                  <strong className="d-block fs-4 mt-1">
                    {producto.stockDisponible}{' '}
                    {unidad}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table maestro-table align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Movimiento</th>
                  <th>Documento</th>
                  <th>Cantidad</th>
                  <th>Destino</th>
                  <th>Parte de equipo</th>
                  <th>Centro de costo</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {producto.movimientos.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center text-secondary py-4"
                    >
                      Este producto todavía no
                      tiene movimientos.
                    </td>
                  </tr>
                ) : (
                  producto.movimientos.map(
                    (movimiento) => {
                      const destino =
                        destinos.find(
                          (item) =>
                            String(item.id) === String(
                            movimiento.destinoId),
                        )

                      const parteEquipo =
                        partesEquipo.find(
                          (item) =>
                            String(item.id) === String(
                            movimiento.parteEquipoId),
                        )

                      const centroCosto =
                        centrosCosto.find(
                          (item) =>
                            String(item.id) === String(
                            movimiento.centroCostoId),
                        )

                      return (
                        <tr
                          key={movimiento.id}
                          className={
                            movimiento.afectaStock
                              ? ''
                              : 'opacity-50'
                          }
                        >
                          <td>
                            {formatearFecha(
                              movimiento.fecha,
                            )}
                          </td>

                          <td>
                            <span
                              className={
                                movimiento.tipo ===
                                'ENTRADA'
                                  ? 'text-success fw-semibold'
                                  : 'text-danger fw-semibold'
                              }
                            >
                              {movimiento.tipo ===
                              'ENTRADA' ? (
                                <ArrowDownToLine
                                  size={15}
                                  className="me-1"
                                />
                              ) : (
                                <ArrowUpFromLine
                                  size={15}
                                  className="me-1"
                                />
                              )}

                              {movimiento.tipo ===
                              'ENTRADA'
                                ? 'Entrada'
                                : 'Salida'}
                            </span>
                          </td>

                          <td>
                            <span className="maestro-id-chip">
                              {
                                movimiento.numeroDocumento
                              }
                            </span>
                          </td>

                          <td>
                            {movimiento.cantidad}{' '}
                            {unidad}
                          </td>

                          <td>
                            {destino?.nombre ?? '-'}
                          </td>

                          <td>
                            {parteEquipo?.nombre ??
                              'No aplica'}
                          </td>

                          <td>
                            {centroCosto?.nombre ??
                              '-'}
                          </td>

                          <td>
                            {
                              movimiento.responsable
                            }
                          </td>

                          <td>
                            <span
                              className={
                                movimiento.afectaStock
                                  ? 'maestro-status maestro-status--active'
                                  : 'maestro-status maestro-status--inactive'
                              }
                            >
                              {movimiento.afectaStock
                                ? 'Registrado'
                                : 'Anulado'}
                            </span>
                          </td>
                        </tr>
                      )
                    },
                  )
                )}
              </tbody>
            </table>
          </div>
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




