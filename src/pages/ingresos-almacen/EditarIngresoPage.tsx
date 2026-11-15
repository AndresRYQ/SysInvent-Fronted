import {
  useEffect,
  useState,
} from 'react'

import { ArrowLeft } from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { IngresoAlmacenForm } from '../../components/ingresos-almacen/IngresoAlmacenForm'

import {
  actualizarIngresoAlmacen,
  consultarIngresoAlmacenPorId,
} from '../../services/ingresoAlmacenService'

import type {
  IngresoAlmacenDetalle,
  IngresoAlmacenRegistro,
} from '../../types/ingresoAlmacen'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function convertirParaFormulario(
  ingreso: IngresoAlmacenDetalle,
): IngresoAlmacenRegistro {
  return {
    id: String(ingreso.id),
    numeroIngreso: ingreso.numeroIngreso,
    fechaIngreso:
      ingreso.fechaIngreso.slice(0, 10),
    proveedorId: String(
      ingreso.proveedorId,
    ),
    contactoId: String(
      ingreso.contactoId,
    ),
    tipoDocumentoId: String(
      ingreso.tipoDocumentoId,
    ),
    numeroDocumento:
      ingreso.numeroDocumento,
    observacion: ingreso.observacion,
    estado: ingreso.estado,
    fechaRegistro: ingreso.fechaRegistro,
    detalles: ingreso.detalles.map(
      (detalle) => ({
        id: String(detalle.id),
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario:
          detalle.precioUnitario,
      }),
    ),
  }
}

export function EditarIngresoPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const [ingreso, setIngreso] =
    useState<IngresoAlmacenRegistro | null>(
      null,
    )

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

        setIngreso(
          convertirParaFormulario(resultado),
        )

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
            <h1>Editar ingreso</h1>

            <p>
              Corrige los datos del ingreso.
              Los cambios de cantidades
              actualizarán el stock y Kardex.
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
            Cargando ingreso...
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
          <IngresoAlmacenForm
            ingreso={ingreso}
            onCancelar={() =>
              navigate('/ingresos-almacen')
            }
            onSubmit={async (datos) => {
              const respuesta =
                await actualizarIngresoAlmacen(
                  ingreso.id,
                  datos,
                )

              navigate('/ingresos-almacen', {
                replace: true,
                state: {
                  mensaje:
                    respuesta.message ??
                    `Ingreso ${ingreso.numeroIngreso} actualizado correctamente.`,
                },
              })
            }}
          />
        )}
      </div>
    </main>
  )
}