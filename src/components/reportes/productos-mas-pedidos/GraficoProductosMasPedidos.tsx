import {
  BarChart3,
  PackageSearch,
  Trophy,
} from 'lucide-react'

import { EmptyState } from '../../common/EmptyState'

import type {
  FilaProductoMasPedido,
} from '../../../types/reporteProductoMasPedido'

interface GraficoProductosMasPedidosProps {
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

export function GraficoProductosMasPedidos({
  filas,
}: GraficoProductosMasPedidosProps) {
  const productos = filas.slice(0, 10)

  const cantidadMayor =
    productos[0]?.cantidadSolicitada ??
    0

  return (
    <section className="table-card card border-0 shadow-sm h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
          <span className="maestro-kicker">
            <BarChart3 size={17} />
            Top 10 productos
          </span>

          <small className="text-secondary">
            Por cantidad solicitada
          </small>
        </div>

        {productos.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No existen consumos"
            description="Registra vales o cambia los filtros del reporte."
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {productos.map((producto) => {
              const porcentajeBarra =
                cantidadMayor > 0
                  ? Math.max(
                      3,
                      (producto
                        .cantidadSolicitada /
                        cantidadMayor) *
                        100,
                    )
                  : 0

              return (
                <div
                  key={producto.productoId}
                >
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-1">
                    <div className="d-flex align-items-start gap-2">
                      <span
                        className={
                          producto.posicion === 1
                            ? 'badge text-bg-warning'
                            : 'badge text-bg-light'
                        }
                      >
                        {producto.posicion}
                      </span>

                      <div>
                        <strong className="d-block small">
                          {producto.producto}
                        </strong>

                        <span className="text-secondary small">
                          {
                            producto.codigoProducto
                          }
                          {' · '}
                          {
                            producto.tipoProducto
                          }
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <strong className="d-block text-success">
                        {formatearCantidad(
                          producto
                            .cantidadSolicitada,
                        )}
                      </strong>

                      <small className="text-secondary">
                        {
                          producto.unidadMedida
                        }
                      </small>
                    </div>
                  </div>

                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={
                      producto.producto
                    }
                    aria-valuenow={
                      porcentajeBarra
                    }
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{
                      height: '10px',
                      backgroundColor:
                        '#e9f2ed',
                    }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width:
                          `${porcentajeBarra}%`,
                        background:
                          producto.posicion ===
                          1
                            ? 'linear-gradient(90deg, #d69e00, #f4c430)'
                            : 'linear-gradient(90deg, #0f5132, #198754)',
                      }}
                    />
                  </div>

                  {producto.posicion === 1 && (
                    <div className="d-flex align-items-center gap-1 mt-1 text-warning small">
                      <Trophy size={13} />
                      Producto líder
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

