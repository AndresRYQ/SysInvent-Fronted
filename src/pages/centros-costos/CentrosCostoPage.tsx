import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CentroCostoDeleteModal } from '../../components/centros-costo/CentroCostoDeleteModal'
import { CentroCostoFormModal } from '../../components/centros-costo/CentroCostoFormModal'

import {
  FiltrosCentrosCosto,
  type FiltrosCentrosCostoValores,
} from '../../components/centros-costo/FiltrosCentrosCosto'

import { TablaCentrosCosto } from '../../components/centros-costo/TablaCentrosCosto'

import {
  actualizarCentroCosto,
  crearCentroCosto,
  eliminarCentroCosto,
  obtenerCentrosCosto,
  reactivarCentroCosto,
} from '../../services/centroCostoService'

import type {
  CentroCosto,
  CentroCostoFormData,
} from '../../types/centroCosto'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCentrosCostoValores = {
  nombre: '',
  estado: '',
}

function filtrarCentrosCosto(
  centrosCosto: CentroCosto[],
  filtros: FiltrosCentrosCostoValores,
): CentroCosto[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return centrosCosto.filter(
    (centroCosto) => {
      const coincideNombre =
        !nombre ||
        centroCosto.nombre
          .toLowerCase()
          .includes(nombre)

      const coincideEstado =
        !filtros.estado ||
        (filtros.estado === 'activo' &&
          centroCosto.activo === 1) ||
        (filtros.estado === 'inactivo' &&
          centroCosto.activo === 0)

      return coincideNombre && coincideEstado
    },
  )
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function CentrosCostoPage() {
  const [
    centrosCosto,
    setCentrosCosto,
  ] = useState<CentroCosto[]>(() =>
    obtenerCentrosCosto(),
  )

  const [filtros, setFiltros] =
    useState<FiltrosCentrosCostoValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosCentrosCostoValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)

  const [
    centroCostoEnEdicion,
    setCentroCostoEnEdicion,
  ] = useState<CentroCosto | null>(null)
  const [centroCostoAReactivar, setCentroCostoAReactivar] = useState<CentroCosto | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    centroCostoAEliminar,
    setCentroCostoAEliminar,
  ] = useState<CentroCosto | null>(null)

  const centrosCostoFiltrados = useMemo(
    () =>
      filtrarCentrosCosto(
        centrosCosto,
        filtrosAplicados,
      ),
    [centrosCosto, filtrosAplicados],
  )

  const totalItems =
    centrosCostoFiltrados.length

  const centrosCostoPaginados = useMemo(
    () => {
      const startIndex =
        (page - 1) * pageSize

      return centrosCostoFiltrados.slice(
        startIndex,
        startIndex + pageSize,
      )
    },
    [
      centrosCostoFiltrados,
      page,
      pageSize,
    ],
  )

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  function recargarCentrosCosto(): void {
    setCentrosCosto(
      obtenerCentrosCosto(),
    )
  }

  function abrirFormularioNuevo(): void {
    setErrorFormulario('')
    setCentroCostoEnEdicion(null)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    centroCosto: CentroCosto,
  ): void {
    setErrorFormulario('')
    setCentroCostoEnEdicion(centroCosto)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirVisualizacion(centroCosto: CentroCosto): void {
    setErrorFormulario('')
    setCentroCostoEnEdicion(centroCosto)
    setModoVisualizacion(true)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setCentroCostoEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  function guardarCentroCosto(
    datos: CentroCostoFormData,
  ): void {
    try {
      if (centroCostoEnEdicion) {
        actualizarCentroCosto(
          centroCostoEnEdicion.id,
          datos,
        )

      } else {
        crearCentroCosto(datos)

      }

      recargarCentrosCosto()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    centroCosto: CentroCosto,
  ): void {
    setCentroCostoAEliminar(centroCosto)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setCentroCostoAEliminar(null)
  }

  function confirmarReactivacion(): void {
    if (!centroCostoAReactivar) return
    try {
      reactivarCentroCosto(centroCostoAReactivar.id)
      recargarCentrosCosto()
    } catch (error) {
      console.error(obtenerMensajeError(error))
    }
    setCentroCostoAReactivar(null)
  }

  function confirmarEliminacion(): void {
    if (!centroCostoAEliminar) {
      return
    }

    try {
      eliminarCentroCosto(
        centroCostoAEliminar.id,
      )

      recargarCentrosCosto()
      cerrarConfirmacionEliminar()

    } catch (error) {
      cerrarConfirmacionEliminar()

      console.error(obtenerMensajeError(error))
    }
  }

  return (
    <div className="centro-costo-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Centros de costo</h1>

              <p>
                Administración de áreas responsables
                del consumo de materiales.
              </p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosCentrosCosto
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
            <TablaCentrosCosto
              centrosCosto={
                centrosCostoPaginados
              }
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={
                abrirFormularioNuevo
              }
              onEditar={
                abrirFormularioEdicion
              }
              onVisualizar={abrirVisualizacion}
              onEliminar={
                abrirConfirmacionEliminar
              }
              onReactivar={(centroCosto) => setCentroCostoAReactivar(centroCosto)}
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

      <CentroCostoFormModal
        abierto={modalFormOpen}
        centroCosto={
          centroCostoEnEdicion
        }
        error={errorFormulario}
        soloLectura={modoVisualizacion}
        onClose={cerrarFormulario}
        onSubmit={guardarCentroCosto}
      />
      <CentroCostoDeleteModal
        abierto={Boolean(centroCostoAReactivar)}
        centroCosto={centroCostoAReactivar}
        modo="reactivar"
        onClose={() => setCentroCostoAReactivar(null)}
        onConfirm={confirmarReactivacion}
      />

      <CentroCostoDeleteModal
        abierto={modalDeleteOpen}
        centroCosto={
          centroCostoAEliminar
        }
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
    </div>
  )
}
