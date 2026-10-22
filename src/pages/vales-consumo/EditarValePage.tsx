import { ArrowLeft } from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { ValeConsumoForm } from '../../components/vales-consumo/ValeConsumoForm'

import {
  actualizarVale,
  obtenerMensajeErrorVale,
  obtenerValePorId,
} from '../../services/valeConsumoService'
import type { ValeConsumo } from '../../types/valeConsumo'
import type { ApiError } from '../../services/api'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

export function EditarValePage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const [resultadoCarga, setResultadoCarga] =
    useState<{
      id: string
      vale: ValeConsumo | null
      error: string | null
      noEncontrado: boolean
    } | null>(null)

  useEffect(() => {
    let activo = true

    obtenerValePorId(id)
      .then((resultado) => {
        if (activo) {
          setResultadoCarga({
            id,
            vale: resultado,
            error: null,
            noEncontrado: false,
          })
        }
      })
      .catch((errorConsulta: unknown) => {
        if (!activo) {
          return
        }
        const noEncontrado =
          (errorConsulta as ApiError)?.status === 404
        setResultadoCarga({
          id,
          vale: null,
          error: noEncontrado
            ? null
            : obtenerMensajeErrorVale(errorConsulta),
          noEncontrado,
        })
      })

    return () => {
      activo = false
    }
  }, [id])

  const estadoCarga =
    resultadoCarga?.id === id
      ? resultadoCarga
      : null
  const cargando = estadoCarga === null
  const vale = estadoCarga?.vale ?? null
  const error = estadoCarga?.error ?? null
  const noEncontrado =
    estadoCarga?.noEncontrado ?? false

  if (cargando) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <div className="alert alert-info" role="status">
            Cargando vale…
          </div>
        </div>
      </main>
    )
  }

  if (!vale || noEncontrado || error) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>{noEncontrado ? 'Vale no encontrado' : 'No se pudo cargar el vale'}</h1>

              <p>
                {noEncontrado
                  ? 'El vale solicitado no existe o ya no está disponible.'
                  : 'Inténtalo nuevamente más tarde.'}
              </p>
            </div>
          </section>

          <div
            className="alert alert-danger"
            role="alert"
          >
            {error ??
              `No se encontró el vale con identificador “${id}”.`}
          </div>

          <button
            type="button"
            className="btn btn-maestro-info"
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
          vale={vale}
          onCancelar={() =>
            navigate('/vales-consumo')
          }
          onSubmit={async (datos) => {
            const valeActualizado = await actualizarVale(vale.id, datos)

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
