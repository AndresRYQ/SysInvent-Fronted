import { PackageSearch } from 'lucide-react'

import { EmptyState } from '../../common/EmptyState'

import type {
  FilaReporteIngreso,
} from '../../../types/reporteIngreso'

interface TablaReporteIngresosProps {
  filas: FilaReporteIngreso[]
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

function formatearNumero(
  valor: number,
): string {
  return new Intl.NumberFormat(
    'es-PE',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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

export function TablaReporteIngresos({
  filas,
}: TablaReporteIngresosProps) {
  return (
    <div className="table-responsive">
      <table className="table standard-table align-middle mb-0">
        <thead>
          <tr>
            <th>Nro. ingreso</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Documento</th>
            <th>Tipo</th>
            <th>Producto</th>
            <th className="text-end">
              Cantidad
            </th>
            <th>Unidad</th>
            <th className="text-end">
              Precio unitario
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
                <EmptyState icon={PackageSearch} title="No se encontraron ingresos" description="Cambia los filtros o registra un ingreso de almacén." />
              </td>
            </tr>
          ) : (
            filas.map((fila) => (
              <tr
                key={`${fila.ingresoId}-${fila.productoId}`}
              >
                <td>
                  <span className="table-id-chip">
                    {fila.numeroIngreso}
                  </span>
                </td>

                <td>
                  {formatearFecha(
                    fila.fechaIngreso,
                  )}
                </td>

                <td>
                  <strong className="d-block">
                    {fila.proveedor}
                  </strong>

                  <small className="text-secondary">
                    {fila.contacto}
                  </small>
                </td>

                <td>
                  <span className="d-block">
                    {fila.tipoDocumento}
                  </span>

                  <small className="text-secondary">
                    {fila.numeroDocumento}
                  </small>
                </td>

                <td>
                  {fila.tipoProducto}
                </td>

                <td>
                  <strong className="d-block">
                    {fila.producto}
                  </strong>

                  <small className="text-secondary">
                    {fila.codigoProducto}
                  </small>
                </td>

                <td className="text-end fw-semibold">
                  {formatearNumero(
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

