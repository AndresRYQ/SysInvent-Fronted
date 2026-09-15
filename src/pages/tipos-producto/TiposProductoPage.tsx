import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosTiposProducto,
  type FiltrosTiposProductoValores,
} from '../../components/tipos-productos/FiltrosTiposProducto'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { TablaTiposProducto } from '../../components/tipos-productos/TablaTiposProducto'
import { TipoProductoDeleteModal } from '../../components/tipos-productos/TipoProductoDeleteModal'
import { TipoProductoFormModal } from '../../components/tipos-productos/TipoProductoFormModal'
import {
  actualizarTipoProducto,
  crearTipoProducto,
  eliminarTipoProducto,
  obtenerTiposProducto,
  reactivarTipoProducto,
} from '../../services/tipoProductoService'
import type {
  TipoProducto,
  TipoProductoFormData,
} from '../../types/tipoProducto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposProductoValores = {
  nombre: '',
  estado: '',
}

function filtrarTiposProducto(
  tiposProducto: TipoProducto[],
  filtros: FiltrosTiposProductoValores,
): TipoProducto[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposProducto.filter((tipoProducto) => {
    const coincideNombre =
      !nombre ||
      tipoProducto.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        tipoProducto.activo === 1) ||
      (filtros.estado === 'inactivo' &&
        tipoProducto.activo === 0)

    return coincideNombre && coincideEstado
  })
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function TiposProductoPage() {
  const [tiposProducto, setTiposProducto] =
    useState<TipoProducto[]>(() =>
      obtenerTiposProducto(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosTiposProductoValores>(
      FILTROS_INICIALES,
    )

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosTiposProductoValores>(
      FILTROS_INICIALES,
    )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)

  const [tipoProductoEnEdicion, setTipoProductoEnEdicion] =
    useState<TipoProducto | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)

  const [tipoProductoAEliminar, setTipoProductoAEliminar] =
    useState<TipoProducto | null>(null)
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [tipoProductoAReactivar, setTipoProductoAReactivar] = useState<TipoProducto | null>(null)

  const tiposProductoFiltrados = useMemo(
    () =>
      filtrarTiposProducto(
        tiposProducto,
        filtrosAplicados,
      ),
    [tiposProducto, filtrosAplicados],
  )

  const totalItems = tiposProductoFiltrados.length

  const tiposProductoPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return tiposProductoFiltrados.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    tiposProductoFiltrados,
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

  function recargarTiposProducto(): void {
    setTiposProducto(obtenerTiposProducto())
  }

  function abrirFormularioNuevo(): void {
    setErrorFormulario('')
    setTipoProductoEnEdicion(null)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    tipoProducto: TipoProducto,
  ): void {
    setErrorFormulario('')
    setTipoProductoEnEdicion(tipoProducto)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirVisualizacion(tipoProducto: TipoProducto): void {
    setErrorFormulario('')
    setTipoProductoEnEdicion(tipoProducto)
    setModoVisualizacion(true)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setTipoProductoEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  function guardarTipoProducto(
    datos: TipoProductoFormData,
  ): void {
    try {
      if (tipoProductoEnEdicion) {
        actualizarTipoProducto(
          tipoProductoEnEdicion.id,
          datos,
        )
      } else {
        crearTipoProducto(datos)
      }

      recargarTiposProducto()
      cerrarFormulario()
      setPage(1)
      mostrarAlerta('success', tipoProductoEnEdicion ? 'Tipo de producto actualizado correctamente.' : 'Tipo de producto registrado correctamente.')
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    tipoProducto: TipoProducto,
  ): void {
    setTipoProductoAEliminar(tipoProducto)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setTipoProductoAEliminar(null)
  }

  function abrirConfirmacionReactivar(tipoProducto: TipoProducto): void {
    setTipoProductoAReactivar(tipoProducto)
    setModalReactivarOpen(true)
  }

  function confirmarReactivacion(): void {
    if (!tipoProductoAReactivar) return
    try {
      reactivarTipoProducto(tipoProductoAReactivar.id)
      recargarTiposProducto()
      mostrarAlerta('success', 'Tipo de producto reactivado correctamente.')
    } catch (error) {
      mostrarAlerta('error', obtenerMensajeError(error))
    } finally {
      setModalReactivarOpen(false)
      setTipoProductoAReactivar(null)
    }
  }

  function confirmarEliminacion(): void {
    if (!tipoProductoAEliminar) {
      return
    }

    try {
      eliminarTipoProducto(
        tipoProductoAEliminar.id,
      )

      recargarTiposProducto()
      cerrarConfirmacionEliminar()
      mostrarAlerta('success', 'Tipo de producto eliminado correctamente.')
    } catch (error) {
      cerrarConfirmacionEliminar()
      mostrarAlerta('error', obtenerMensajeError(error))
    }
  }

  return (
    <div className="tipos-producto-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Tipos de producto</h1>
              <p>
                Administración de los tipos de producto
                utilizados en el inventario.
              </p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosTiposProducto
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
            <TablaTiposProducto
              tiposProducto={
                tiposProductoPaginados
              }
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={abrirFormularioNuevo}
              onEditar={abrirFormularioEdicion}
              onVisualizar={abrirVisualizacion}
              onEliminar={
                abrirConfirmacionEliminar
              }
              onReactivar={abrirConfirmacionReactivar}
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

      <TipoProductoFormModal
        abierto={modalFormOpen}
        tipoProducto={tipoProductoEnEdicion}
        error={errorFormulario}
        soloLectura={modoVisualizacion}
        onClose={cerrarFormulario}
        onSubmit={guardarTipoProducto}
      />

      <SnackbarAlert
        mensaje={mensaje}
        abierta={abierta}
        onClose={cerrarAlerta}
        onExited={limpiarAlerta}
      />

      <TipoProductoDeleteModal
        abierto={modalDeleteOpen}
        tipoProducto={
          tipoProductoAEliminar
        }
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
      <TipoProductoDeleteModal
        abierto={modalReactivarOpen}
        tipoProducto={tipoProductoAReactivar}
        modo="reactivar"
        onClose={() => { setModalReactivarOpen(false); setTipoProductoAReactivar(null) }}
        onConfirm={confirmarReactivacion}
      />
    </div>
  )
}
