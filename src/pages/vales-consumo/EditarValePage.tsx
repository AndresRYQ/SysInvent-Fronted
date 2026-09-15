import { ArrowLeft } from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { ValeConsumoForm } from '../../components/vales-consumo/ValeConsumoForm'

import {
  actualizarValeConsumo,
  obtenerValeConsumoPorId,
} from '../../services/valeConsumoService'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

export function EditarValePage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const vale =
    obtenerValeConsumoPorId(id)

  if (!vale) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Vale no encontrado</h1>

              <p>
                El vale solicitado no existe
                o ya no está disponible.
              </p>
            </div>
          </section>

          <div
            className="alert alert-danger"
            role="alert"
          >
            No se encontró el vale con
            identificador “{id}”.
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/vales-consumo')
            }
          >
            <ArrowLeft size={18} />
            Volver a vales
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
            <h1>Editar vale de consumo</h1>

            <p>
              Modifica los productos y sus
              distribuciones.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/vales-consumo')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        <ValeConsumoForm
          vale={vale}
          onCancelar={() =>
            navigate('/vales-consumo')
          }
          onSubmit={(datos) => {
            const valeActualizado =
              actualizarValeConsumo(
                vale.id,
                datos,
              )

            navigate('/vales-consumo', {
              replace: true,
              state: {
                mensaje:
                  `Vale ${valeActualizado.numeroVale} actualizado correctamente.`,
              },
            })
          }}
        />
      </div>
    </main>
  )
}


