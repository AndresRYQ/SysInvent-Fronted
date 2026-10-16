import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ValeConsumoForm } from '../../components/vales-consumo/ValeConsumoForm'
import { crearVale } from '../../services/valeConsumoService'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

export function NuevoValePage() {
  const navigate = useNavigate()

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="maestro-topbar__copy">
            <h1>Nuevo vale de consumo</h1>

            <p>
              Registra la salida y distribución
              de productos del almacén.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-maestro-info"
            onClick={() =>
              navigate('/vales-consumo')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        <ValeConsumoForm
          onCancelar={() =>
            navigate('/vales-consumo')
          }
          onSubmit={async (datos) => {
            const vale = await crearVale(datos)

            navigate('/vales-consumo', {
              replace: true,
              state: {
                mensaje:
                  `Vale ${vale.numeroVale} registrado correctamente.`,
              },
            })
          }}
        />
      </div>
    </main>
  )
}

