import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { FormularioProveedor } from '../../components/proveedores/FormularioProveedor'
import { crearProveedor } from '../../services/proveedorService'
import type { ProveedorFormData } from '../../types/proveedor'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function NuevoProveedorPage() {
  const navigate = useNavigate()

  const [error, setError] = useState('')

  useEffect(() => {
    document.title =
      'Nuevo proveedor | AGRIHUSAC'
  }, [])

  function guardarProveedor(
    datos: ProveedorFormData,
  ): void {
    try {
      crearProveedor(datos)

      navigate('/proveedores', { replace: true })
    } catch (errorGuardado) {
      setError(
        obtenerMensajeError(errorGuardado),
      )
    }
  }

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="maestro-topbar__copy">
            <h1>Nuevo proveedor</h1>

            <p>
              Registra un nuevo proveedor para
              las operaciones del almacén.
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
            error={error}
            onSubmit={guardarProveedor}
            onCancelar={() =>
              navigate('/proveedores')
            }
          />
        </div>
      </div>
    </main>
  )
}
