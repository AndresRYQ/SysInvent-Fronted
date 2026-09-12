import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiltrosProveedores,
  type FiltrosProveedoresValores,
} from '../../components/proveedores/FiltrosProveedores'

import { ProveedorDeleteModal } from '../../components/proveedores/ProveedorDeleteModal'
import { TablaProveedores } from '../../components/proveedores/TablaProveedores'

import {
  eliminarProveedor,
  obtenerProveedores,
} from '../../services/proveedorService'

import type { Proveedor } from '../../types/proveedor'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosProveedoresValores = {
  busqueda: '',
  estado: '',
}

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

interface EstadoNavegacion {
  mensaje?: string
}

function filtrarProveedores(
  proveedores: Proveedor[],
  filtros: FiltrosProveedoresValores,
): Proveedor[] {
  const busqueda = filtros.busqueda
    .trim()
    .toLowerCase()

  return proveedores.filter((proveedor) => {
    const coincideBusqueda =
      !busqueda ||
      proveedor.ruc.includes(busqueda) ||
      proveedor.razonSocial
        .toLowerCase()
        .includes(busqueda) ||
      proveedor.correo
        .toLowerCase()
        .includes(busqueda)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        proveedor.estado) ||
      (filtros.estado === 'inactivo' &&
        !proveedor.estado)

    return coincideBusqueda && coincideEstado
  })
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function ProveedoresPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [proveedores, setProveedores] =
    useState<Proveedor[]>(() =>
      obtenerProveedores(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosProveedoresValores>(
      FILTROS_INICIALES,
    )

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosProveedoresValores>(
      FILTROS_INICIALES,
    )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [proveedorAEliminar, setProveedorAEliminar] =
    useState<Proveedor | null>(null)

  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  useEffect(() => {
    const estado =
      location.state as EstadoNavegacion | null

    if (!estado?.mensaje) {
      return
    }

    setMensaje({
      tipo: 'success',
      texto: estado.mensaje,
    })

    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }, [
    location.pathname,
    location.state,
    navigate,
  ])

  const proveedoresFiltrados = useMemo(
    () =>
      filtrarProveedores(
        proveedores,
        filtrosAplicados,
      ),
    [proveedores, filtrosAplicados],
  )

  const totalItems = proveedoresFiltrados.length

  const proveedoresPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return proveedoresFiltrados.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    proveedoresFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  function recargarProveedores(): void {
    setProveedores(obtenerProveedores())
  }

  function abrirConfirmacionEliminar(
    proveedor: Proveedor,
  ): void {
    setMensaje(null)
    setProveedorAEliminar(proveedor)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setProveedorAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!proveedorAEliminar) {
      return
    }

    try {
      eliminarProveedor(
        proveedorAEliminar.id,
      )

      recargarProveedores()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Proveedor eliminado correctamente.',
      })
    } catch (error) {
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'danger',
        texto: obtenerMensajeError(error),
      })
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Proveedores</h1>

              <p>
                Administración de proveedores y
                datos de contacto comercial.
              </p>
            </div>
          </section>

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}
              role="alert"
            >
              {mensaje.texto}

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() => setMensaje(null)}
              />
            </div>
          )}

          <div className="maestro-panel">
            <FiltrosProveedores
              valores={filtros}
              onChange={(campo, valor) =>
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }))
              }
              onBuscar={() => {
                setFiltrosAplicados({
                  ...filtros,
                })
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(
                  FILTROS_INICIALES,
                )
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaProveedores
              proveedores={
                proveedoresPaginados
              }
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() =>
                navigate('/proveedores/nuevo')
              }
              onEditar={(proveedor) =>
                navigate(
                  `/proveedores/${proveedor.id}/editar`,
                )
              }
              onEliminar={
                abrirConfirmacionEliminar
              }
              onPageChange={setPage}
              onPageSizeChange={(
                nextPageSize,
              ) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      <ProveedorDeleteModal
        abierto={modalDeleteOpen}
        proveedor={proveedorAEliminar}
        onClose={cerrarConfirmacionEliminar}
        onConfirm={confirmarEliminacion}
      />
    </>
  )
}