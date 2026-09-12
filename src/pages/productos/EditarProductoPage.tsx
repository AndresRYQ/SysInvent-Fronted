import {
  useEffect,
  useState,
} from 'react'

import { ArrowLeft } from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { FormularioProducto } from '../../components/productos/FormularioProducto'

import {
  actualizarProducto,
  obtenerProductoPorId,
} from '../../services/productoService'

import type { ProductoFormData } from '../../types/producto'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function EditarProductoPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [error, setError] = useState('')

  const producto = id
    ? obtenerProductoPorId(id)
    : null

  useEffect(() => {
    document.title =
      'Editar producto | AGRIHUSAC'
  }, [])

  function guardarCambios(
    datos: ProductoFormData,
  ): void {
    if (!id) {
      setError(
        'No se encontró el identificador del producto.',
      )
      return
    }

    try {
      actualizarProducto(id, datos)

      navigate('/productos', {
        replace: true,
        state: {
          mensaje:
            'Producto actualizado correctamente.',
        },
      })
    } catch (errorGuardado) {
      setError(
        obtenerMensajeError(errorGuardado),
      )
    }
  }

  if (!producto) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Producto no encontrado</h1>

              <p>
                El producto solicitado no existe
                o fue eliminado.
              </p>
            </div>
          </section>

          <div
            className="alert alert-warning"
            role="alert"
          >
            No se encontró información del producto.
          </div>

          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={() =>
              navigate('/productos')
            }
          >
            <ArrowLeft size={18} />
            Volver a productos
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
            <h1>Editar producto</h1>

            <p>
              Actualiza la información y configuración
              de inventario del producto.
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
            producto={producto}
            error={error}
            onSubmit={guardarCambios}
            onCancelar={() =>
              navigate('/productos')
            }
          />
        </div>
      </div>
    </main>
  )
}