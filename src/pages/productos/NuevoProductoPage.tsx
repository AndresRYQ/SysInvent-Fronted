import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { FormularioProducto } from '../../components/productos/FormularioProducto'
import { crearProducto } from '../../services/productoService'
import type { ProductoFormData } from '../../types/producto'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function NuevoProductoPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    document.title =
      'Nuevo producto | AGRIHUSAC'
  }, [])

  function guardarProducto(
    datos: ProductoFormData,
  ): void {
    try {
      crearProducto(datos)

      navigate('/productos', {
        replace: true,
        state: {
          mensaje:
            'Producto registrado correctamente. Su stock inicial es 0.',
        },
      })
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
            <h1>Nuevo producto</h1>

            <p>
              Registra un producto para utilizarlo
              en las operaciones del almacén.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/productos')
            }
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </section>

        <div className="maestro-panel">
          <FormularioProducto
            error={error}
            onSubmit={guardarProducto}
            onCancelar={() =>
              navigate('/productos')
            }
          />
        </div>
      </div>
    </main>
  )
}