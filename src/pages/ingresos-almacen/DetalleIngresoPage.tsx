import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  PackageSearch,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { consultarIngresoAlmacenPorId } from '../../services/ingresoAlmacenService'

import type { IngresoAlmacenDetalle } from '../../types/ingresoAlmacen'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function formatearFecha(valor: string): string {
  if (!valor) {
    return '-'
  }

  const fecha = new Date(
    valor.includes('T')
      ? valor
      : `${valor}T00:00:00`,
  )

  if (Number.isNaN(fecha.getTime())) {
    return valor
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha)
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

export function DetalleIngresoPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const [ingreso, setIngreso] =
    useState<IngresoAlmacenDetalle | null>(null)

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let componenteActivo = true

    consultarIngresoAlmacenPorId(id)
      .then((resultado) => {
        if (!componenteActivo) {
          return
        }

        setIngreso(resultado)
        setError('')
      })
      .catch((errorConsulta: unknown) => {
        if (!componenteActivo) {
          return
        }

        setIngreso(null)
        setError(
          errorConsulta instanceof Error
            ? errorConsulta.message
            : 'No se pudo consultar el ingreso.',
        )
      })
      .finally(() => {
        if (componenteActivo) {
          setCargando(false)
        }
      })

    return () => {
      componenteActivo = false
    }
  }, [id])

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="maestro-topbar__copy">
            <h1>Detalle de ingreso</h1>

            <p>
              Consulta la mercadería registrada,
              el stock resultante y el documento
              de origen.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-maestro-info"
            onClick={() =>
              navigate('/ingresos-almacen')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        {cargando && (
          <div
            className="alert alert-info"
            role="status"
          >
            Cargando detalle del ingreso...
          </div>
        )}

        {!cargando && error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        {!cargando && ingreso && (
          <>
            <div className="maestro-panel">
              <section className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <span className="maestro-kicker">
                    <PackageSearch size={16} />
                    Información del ingreso
                  </span>

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label">
                        Número de ingreso
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.numeroIngreso}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Fecha de ingreso
                      </label>

                      <div className="form-control bg-light">
                        {formatearFecha(
                          ingreso.fechaIngreso,
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Estado
                      </label>

                      <div>
                        <span
                          className={
                            ingreso.estado ===
                            'REGISTRADO'
                              ? 'status-label status-label--active'
                              : 'status-label status-label--inactive'
                          }
                        >
                          {ingreso.estado ===
                          'REGISTRADO'
                            ? 'Registrado'
                            : 'Anulado'}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Proveedor
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.proveedor}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Contacto
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.contacto}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Tipo de documento
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.tipoDocumento}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Número de documento
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.numeroDocumento}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Total
                      </label>

                      <div className="form-control bg-light fw-bold">
                        S/ {formatearMoneda(ingreso.total)}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Observación
                      </label>

                      <div className="form-control bg-light">
                        {ingreso.observacion || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="maestro-panel mt-3">
              <section className="table-card card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-header">
                    <span className="maestro-kicker">
                      <PackageSearch size={16} />
                      Productos ingresados
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table standard-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Producto</th>
                          <th>Unidad</th>
                          <th>Cantidad</th>
                          <th>Precio unitario</th>
                          <th>Subtotal</th>
                          <th>Stock resultante</th>
                        </tr>
                      </thead>

                      <tbody>
                        {ingreso.detalles.map(
                          (detalle) => (
                            <tr key={detalle.id}>
                              <td>
                                <span className="table-id-chip">
                                  {detalle.codigoProducto}
                                </span>
                              </td>

                              <td>
                                {detalle.nombreProducto}
                              </td>

                              <td>
                                {detalle.unidadMedida}
                              </td>

                              <td>
                                {detalle.cantidad}
                              </td>

                              <td>
                                S/{' '}
                                {formatearMoneda(
                                  detalle.precioUnitario,
                                )}
                              </td>

                              <td>
                                S/{' '}
                                {formatearMoneda(
                                  detalle.subtotal,
                                )}
                              </td>

                              <td>
                                {detalle.stockResultante}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  )
}