import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosTiposProducto,
  type FiltrosTiposProductoValores,
} from '../../components/tipos-productos/FiltrosTiposProducto'
import { TablaTiposProducto } from '../../components/tipos-productos/TablaTiposProducto'
import { TipoProductoDeleteModal } from '../../components/tipos-productos/TipoProductoDeleteModal'
import { TipoProductoFormModal } from '../../components/tipos-productos/TipoProductoFormModal'
import {
  actualizarTipoProducto,
  crearTipoProducto,
  eliminarTipoProducto,
  obtenerTiposProducto,
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

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
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
        tipoProducto.estado) ||
      (filtros.estado === 'inactivo' &&
        !tipoProducto.estado)

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

  const [tipoProductoEnEdicion, setTipoProductoEnEdicion] =
    useState<TipoProducto | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)

  const [tipoProductoAEliminar, setTipoProductoAEliminar] =
    useState<TipoProducto | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

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
    setMensaje(null)
    setErrorFormulario('')
    setTipoProductoEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    tipoProducto: TipoProducto,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setTipoProductoEnEdicion(tipoProducto)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setTipoProductoEnEdicion(null)
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

        setMensaje({
          tipo: 'success',
          texto:
            'Tipo de producto actualizado correctamente.',
        })
      } else {
        crearTipoProducto(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Tipo de producto registrado correctamente.',
        })
      }

      recargarTiposProducto()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    tipoProducto: TipoProducto,
  ): void {
    setMensaje(null)
    setTipoProductoAEliminar(tipoProducto)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setTipoProductoAEliminar(null)
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

      setMensaje({
        tipo: 'success',
        texto:
          'Tipo de producto eliminado correctamente.',
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
              <h1>Tipos de producto</h1>
              <p>
                Administración de los tipos de producto
                utilizados en el inventario.
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

      <TipoProductoFormModal
        abierto={modalFormOpen}
        tipoProducto={tipoProductoEnEdicion}
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarTipoProducto}
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
    </>
  )
}