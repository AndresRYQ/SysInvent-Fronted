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

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
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
          centroCosto.estado) ||
        (filtros.estado === 'inactivo' &&
          !centroCosto.estado)

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

  const [
    centroCostoEnEdicion,
    setCentroCostoEnEdicion,
  ] = useState<CentroCosto | null>(null)

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

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

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
    setMensaje(null)
    setErrorFormulario('')
    setCentroCostoEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    centroCosto: CentroCosto,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setCentroCostoEnEdicion(centroCosto)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setCentroCostoEnEdicion(null)
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

        setMensaje({
          tipo: 'success',
          texto:
            'Centro de costo actualizado correctamente.',
        })
      } else {
        crearCentroCosto(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Centro de costo registrado correctamente.',
        })
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
    setMensaje(null)
    setCentroCostoAEliminar(centroCosto)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setCentroCostoAEliminar(null)
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

      setMensaje({
        tipo: 'success',
        texto:
          'Centro de costo eliminado correctamente.',
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
              <h1>Centros de costo</h1>

              <p>
                Administración de áreas responsables
                del consumo de materiales.
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

      <CentroCostoFormModal
        abierto={modalFormOpen}
        centroCosto={
          centroCostoEnEdicion
        }
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarCentroCosto}
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
    </>
  )
}