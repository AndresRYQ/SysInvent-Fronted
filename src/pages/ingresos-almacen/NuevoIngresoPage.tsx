import {
  ArrowLeft,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { IngresoAlmacenForm } from '../../components/ingresos-almacen/IngresoAlmacenForm'

import { crearIngresoAlmacen } from '../../services/ingresoAlmacenService'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

export function NuevoIngresoPage() {
  const navigate = useNavigate()

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="maestro-topbar__copy">
            <h1>Nuevo ingreso</h1>

            <p>
              Registra la mercadería recibida
              y actualiza el stock del almacén.
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

        <IngresoAlmacenForm
          onCancelar={() =>
            navigate('/ingresos-almacen')
          }
          onSubmit={(datos) => {
            const ingreso =
              crearIngresoAlmacen(datos)

            navigate('/ingresos-almacen', {
              replace: true,
              state: {
                mensaje:
                  `Ingreso ${ingreso.numeroIngreso} registrado correctamente.`,
              },
            })
          }}
        />
      </div>
    </main>
  )
}


