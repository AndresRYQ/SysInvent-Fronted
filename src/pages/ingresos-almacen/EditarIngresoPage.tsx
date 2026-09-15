import {
  ArrowLeft,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { IngresoAlmacenForm } from '../../components/ingresos-almacen/IngresoAlmacenForm'

import {
  actualizarIngresoAlmacen,
  obtenerIngresoAlmacenPorId,
} from '../../services/ingresoAlmacenService'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

export function EditarIngresoPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const ingreso =
    obtenerIngresoAlmacenPorId(id)

  if (!ingreso) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Ingreso no encontrado</h1>

              <p>
                El ingreso solicitado no existe
                o ya no estÃ¡ disponible.
              </p>
            </div>
          </section>

          <div
            className="alert alert-danger"
            role="alert"
          >
            No se encontrÃ³ el ingreso con
            identificador â€œ{id}â€.
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/ingresos-almacen')
            }
          >
            <ArrowLeft size={18} />
            Volver a ingresos
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="maestro-topbar__copy">
            <h1>Editar ingreso</h1>

            <p>
              Actualiza los datos y productos
              del ingreso seleccionado.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/ingresos-almacen')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        <IngresoAlmacenForm
          ingreso={ingreso}
          onCancelar={() =>
            navigate('/ingresos-almacen')
          }
          onSubmit={(datos) => {
            const ingresoActualizado =
              actualizarIngresoAlmacen(
                ingreso.id,
                datos,
              )

            navigate('/ingresos-almacen', {
              replace: true,
              state: {
                mensaje:
                  `Ingreso ${ingresoActualizado.numeroIngreso} actualizado correctamente.`,
              },
            })
          }}
        />
      </div>
    </main>
  )
}


