import {
  useEffect,
  useState,
} from 'react'

import { ArrowLeft } from 'lucide-react'

import {
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom'

import { FormularioProveedor } from '../../components/proveedores/FormularioProveedor'

import {
  actualizarProveedor,
  obtenerProveedorPorId,
} from '../../services/proveedorService'

import type { ProveedorFormData } from '../../types/proveedor'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function EditarProveedorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const soloLectura = Boolean((location.state as { soloLectura?: boolean } | null)?.soloLectura)

  const [error, setError] = useState('')

  const proveedor = id
    ? obtenerProveedorPorId(id)
    : null

  useEffect(() => {
    document.title = soloLectura ? 'Visualizar proveedor | AGRIHUSAC' : 'Editar proveedor | AGRIHUSAC'
  }, [])

  function guardarCambios(
    datos: ProveedorFormData,
  ): void {
    if (!id) {
      setError(
        'No se encontró el identificador del proveedor.',
      )
      return
    }

    try {
      actualizarProveedor(id, datos)

      navigate('/proveedores', { replace: true })
    } catch (errorGuardado) {
      setError(
        obtenerMensajeError(errorGuardado),
      )
    }
  }

  if (!proveedor) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Proveedor no encontrado</h1>

              <p>
                El proveedor solicitado no existe
                o fue eliminado.
              </p>
            </div>
          </section>

          <div
            className="alert alert-warning"
            role="alert"
          >
            No se encontró información para el
            proveedor solicitado.
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/proveedores')
            }
          >
            <ArrowLeft size={18} />
            Volver a proveedores
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
            <h1>{soloLectura ? 'Visualizar proveedor' : 'Editar proveedor'}</h1>

            <p>
              Actualiza los datos fiscales y de
              contacto del proveedor.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/proveedores')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        <div className="maestro-panel">
          <FormularioProveedor
            proveedor={proveedor}
            soloLectura={soloLectura}
            error={error}
            onSubmit={guardarCambios}
            onCancelar={() =>
              navigate('/proveedores')
            }
          />
        </div>
      </div>
    </main>
  )
}
