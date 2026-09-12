import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosUnidadesMedida,
  type FiltrosUnidadesMedidaValores,
} from '../../components/unidades-medida/FiltrosUnidadesMedida'

import { TablaUnidadesMedida } from '../../components/unidades-medida/TablaUnidadesMedida'
import { UnidadMedidaDeleteModal } from '../../components/unidades-medida/UnidadMedidaDeleteModal'
import { UnidadMedidaFormModal } from '../../components/unidades-medida/UnidadMedidaFormModal'

import {
  actualizarUnidadMedida,
  crearUnidadMedida,
  eliminarUnidadMedida,
  obtenerUnidadesMedida,
} from '../../services/unidadMedidaService'

import type {
  UnidadMedida,
  UnidadMedidaFormData,
} from '../../types/unidadMedida'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosUnidadesMedidaValores = {
  nombre: '',
  estado: '',
}

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

function filtrarUnidades(
  unidades: UnidadMedida[],
  filtros: FiltrosUnidadesMedidaValores,
): UnidadMedida[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return unidades.filter((unidad) => {
    const coincideNombre =
      !nombre ||
      unidad.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        unidad.estado) ||
      (filtros.estado === 'inactivo' &&
        !unidad.estado)

    return coincideNombre && coincideEstado
  })
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function UnidadesMedidaPage() {
  const [unidades, setUnidades] =
    useState<UnidadMedida[]>(() =>
      obtenerUnidadesMedida(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosUnidadesMedidaValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosUnidadesMedidaValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)

  const [
    unidadEnEdicion,
    setUnidadEnEdicion,
  ] = useState<UnidadMedida | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    unidadAEliminar,
    setUnidadAEliminar,
  ] = useState<UnidadMedida | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  const unidadesFiltradas = useMemo(
    () =>
      filtrarUnidades(
        unidades,
        filtrosAplicados,
      ),
    [unidades, filtrosAplicados],
  )

  const totalItems = unidadesFiltradas.length

  const unidadesPaginadas = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return unidadesFiltradas.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    unidadesFiltradas,
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

  function recargarUnidades(): void {
    setUnidades(obtenerUnidadesMedida())
  }

  function abrirFormularioNuevo(): void {
    setMensaje(null)
    setErrorFormulario('')
    setUnidadEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    unidad: UnidadMedida,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setUnidadEnEdicion(unidad)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setUnidadEnEdicion(null)
    setErrorFormulario('')
  }

  function guardarUnidad(
    datos: UnidadMedidaFormData,
  ): void {
    try {
      if (unidadEnEdicion) {
        actualizarUnidadMedida(
          unidadEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Unidad de medida actualizada correctamente.',
        })
      } else {
        crearUnidadMedida(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Unidad de medida registrada correctamente.',
        })
      }

      recargarUnidades()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    unidad: UnidadMedida,
  ): void {
    setMensaje(null)
    setUnidadAEliminar(unidad)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setUnidadAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!unidadAEliminar) {
      return
    }

    try {
      eliminarUnidadMedida(
        unidadAEliminar.id,
      )

      recargarUnidades()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Unidad de medida eliminada correctamente.',
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
              <h1>Unidades de medida</h1>

              <p>
                Administración de unidades utilizadas
                para controlar las existencias.
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
            <FiltrosUnidadesMedida
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
            <TablaUnidadesMedida
              unidades={unidadesPaginadas}
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

      <UnidadMedidaFormModal
        abierto={modalFormOpen}
        unidadMedida={unidadEnEdicion}
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarUnidad}
      />

      <UnidadMedidaDeleteModal
        abierto={modalDeleteOpen}
        unidadMedida={unidadAEliminar}
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
    </>
  )
}