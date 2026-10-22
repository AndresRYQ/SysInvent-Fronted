import {
  Ban,
  Boxes,
  CircleCheckBig,
  ClipboardList,
  PackageCheck,
  WalletCards,
} from 'lucide-react'

import type {
  ResumenReporteVales as Resumen,
} from '../../../types/reporteVale'

interface ResumenReporteValesProps {
  resumen: Resumen
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

export function ResumenReporteVales({
  resumen,
}: ResumenReporteValesProps) {
  return (
    <section className="mb-3">
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary">
                  <ClipboardList size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Total de vales
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {resumen.totalVales}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-success">
                  <CircleCheckBig size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Registrados
                  </span>

                  <strong className="d-block fs-3 text-success mt-1">
                    {resumen.valesRegistrados}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-danger">
                  <Ban size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Anulados
                  </span>

                  <strong className="d-block fs-3 text-danger mt-1">
                    {resumen.valesAnulados}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary">
                  <Boxes size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Distribuciones
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {
                      resumen.totalDistribuciones
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-warning">
                  <PackageCheck size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Cantidad entregada
                  </span>

                  <strong className="d-block fs-4 mt-1">
                    {formatearCantidad(
                      resumen.cantidadTotal,
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-success">
                  <WalletCards size={25} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Total valorizado
                  </span>

                  <strong className="d-block fs-5 text-success mt-1">
                    {formatearMoneda(
                      resumen.totalValorizado,
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

