import {
  Ban,
  Boxes,
  CircleCheckBig,
  ClipboardList,
  WalletCards,
} from 'lucide-react'

import type {
  ResumenReporteIngresos as Resumen,
} from '../../../types/reporteIngreso'

interface ResumenReporteIngresosProps {
  resumen: Resumen
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

export function ResumenReporteIngresos({
  resumen,
}: ResumenReporteIngresosProps) {
  return (
    <section className="mb-3">
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-primary">
                  <ClipboardList size={26} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Total de ingresos
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {resumen.totalIngresos}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-success">
                  <CircleCheckBig size={26} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Registrados
                  </span>

                  <strong className="d-block fs-3 text-success mt-1">
                    {resumen.ingresosRegistrados}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-danger">
                  <Ban size={26} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Anulados
                  </span>

                  <strong className="d-block fs-3 text-danger mt-1">
                    {resumen.ingresosAnulados}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-warning">
                  <Boxes size={26} />
                </div>

                <div>
                  <span className="text-secondary small">
                    Líneas de productos
                  </span>

                  <strong className="d-block fs-3 mt-1">
                    {resumen.lineasProductos}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="text-success">
                  <WalletCards size={26} />
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