import {
  Medal,
  PackageSearch,
} from 'lucide-react'

import { EmptyState } from '../../common/EmptyState'

import type {
  FilaProductoMasPedido,
} from '../../../types/reporteProductoMasPedido'

interface TablaProductosMasPedidosProps {
  filas: FilaProductoMasPedido[]
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

export function TablaProductosMasPedidos({
  filas,
}: TablaProductosMasPedidosProps) {
  return (
    <div className="table-responsive">
      <table className="table maestro-table align-middle mb-0">
        <thead>
          <tr>
            <th className="text-center">
              Posición
            </th>
            <th>Producto</th>
            <th>Clasificación</th>
            <th className="text-end">
              Cantidad
            </th>
            <th>Unidad</th>
            <th className="text-center">
              Vales
            </th>
            <th className="text-center">
              Distribuciones
            </th>
            <th className="text-center">
              Destinos
            </th>
            <th className="text-end">
              Participación
            </th>
            <th className="text-end">
              Valorizado
            </th>
          </tr>
        </thead>

        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={10}>
                <EmptyState
                  icon={PackageSearch}
                  title="No existen productos solicitados"
                  description="Cambia los filtros o registra vales de consumo."
                />
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr key={fila.productoId}>
                <td className="text-center">
                  <span
                    className={
                      fila.posicion === 1
                        ? 'badge text-bg-warning'
                        : fila.posicion <= 3
                          ? 'badge text-bg-success'
                          : 'badge text-bg-light'
                    }
                  >
                    {fila.posicion <= 3 && (
                      <Medal
                        size={13}
                        className="me-1"
                      />
                    )}

                    {fila.posicion}
                  </span>
                </td>

                <td>
                  <strong className="d-block">
                    {fila.producto}
                  </strong>

                  <small className="text-secondary">
                    {fila.codigoProducto}
                  </small>
                </td>

                <td>
                  <span className="d-block">
                    {fila.tipoProducto}
                  </span>

                  <small className="text-secondary">
                    {fila.categoria}
                  </small>
                </td>

                <td className="text-end fw-bold text-success">
                  {formatearCantidad(
                    fila.cantidadSolicitada,
                  )}
                </td>

                <td>
                  {fila.unidadMedida}
                </td>

                <td className="text-center">
                  {fila.numeroVales}
                </td>

                <td className="text-center">
                  {
                    fila.numeroDistribuciones
                  }
                </td>

                <td className="text-center">
                  {fila.destinosAtendidos}
                </td>

                <td className="text-end">
                  {fila.participacion.toFixed(
                    2,
                  )}
                  %
                </td>

                <td className="text-end fw-semibold">
                  {formatearMoneda(
                    fila.totalValorizado,
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

