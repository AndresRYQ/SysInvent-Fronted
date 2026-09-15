import { PackageSearch } from 'lucide-react'

import { EmptyState } from '../../common/EmptyState'

import type {
  FilaReporteVale,
} from '../../../types/reporteVale'

interface TablaReporteValesProps {
  filas: FilaReporteVale[]
}

function formatearFecha(
  fecha: string,
): string {
  if (!fecha) {
    return 'Sin fecha'
  }

  const [anio, mes, dia] =
    fecha.split('-')

  if (!anio || !mes || !dia) {
    return fecha
  }

  return `${dia}/${mes}/${anio}`
}

function formatearCantidad(
  valor: number,
): string {
  return new Intl.NumberFormat(
    'es-PE',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    },
  ).format(valor)
}

function formatearMoneda(
  valor: number,
): string {
  return new Intl.NumberFormat(
    'es-PE',
    {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    },
  ).format(valor)
}

export function TablaReporteVales({
  filas,
}: TablaReporteValesProps) {
  return (
    <div className="table-responsive">
      <table className="table standard-table align-middle mb-0">
        <thead>
          <tr>
            <th>Nro. vale</th>
            <th>Fecha</th>
            <th>Centro / solicitante</th>
            <th>Producto</th>
            <th>Destino</th>
            <th>Parte de equipo</th>
            <th className="text-end">
              Cantidad
            </th>
            <th>Unidad</th>
            <th className="text-end">
              Precio
            </th>
            <th className="text-end">
              Subtotal
            </th>
            <th className="text-center">
              Estado
            </th>
          </tr>
        </thead>

        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={11}>
                <EmptyState icon={PackageSearch} title="No se encontraron vales" description="Cambia los filtros o registra un vale de consumo." />
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr
                key={
                  fila.distribucionId
                }
              >
                <td>
                  <span className="table-id-chip">
                    {fila.numeroVale}
                  </span>
                </td>

                <td>
                  {formatearFecha(
                    fila.fechaVale,
                  )}
                </td>

                <td>
                  <strong className="d-block">
                    {fila.centroCosto}
                  </strong>

                  <small className="text-secondary">
                    {fila.solicitante}
                  </small>
                </td>

                <td>
                  <strong className="d-block">
                    {fila.producto}
                  </strong>

                  <small className="text-secondary">
                    {fila.codigoProducto}
                    {' · '}
                    {fila.tipoProducto}
                  </small>
                </td>

                <td>
                  {fila.destino}
                </td>

                <td>
                  <span className="d-block">
                    {fila.parteEquipo}
                  </span>

                  {fila.codigoParteEquipo && (
                    <small className="text-secondary">
                      {
                        fila.codigoParteEquipo
                      }
                    </small>
                  )}
                </td>

                <td className="text-end fw-semibold">
                  {formatearCantidad(
                    fila.cantidad,
                  )}
                </td>

                <td>
                  {fila.unidadMedida}
                </td>

                <td className="text-end">
                  {formatearMoneda(
                    fila.precioUnitario,
                  )}
                </td>

                <td className="text-end fw-bold">
                  {formatearMoneda(
                    fila.subtotal,
                  )}
                </td>

                <td className="text-center">
                  <span
                    className={
                      fila.estado ===
                      'REGISTRADO'
                        ? 'status-label status-label--active'
                        : 'status-label status-label--inactive'
                    }
                  >
                    {fila.estado ===
                    'REGISTRADO'
                      ? 'Registrado'
                      : 'Anulado'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

