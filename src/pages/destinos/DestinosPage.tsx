import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosDestinos,
  type FiltrosDestinosValores,
} from '../../components/destinos/FiltrosDestinos'

import { TablaDestinos } from '../../components/destinos/TablaDestinos'
import { DestinoDeleteModal } from '../../components/destinos/DestinoDeleteModal'
import { DestinoFormModal } from '../../components/destinos/DestinoFormModal'

import {
  actualizarDestino,
  crearDestino,
  eliminarDestino,
  obtenerDestinos,
} from '../../services/destinoService'

import type {
  Destino,
  DestinoFormData,
} from '../../types/destino'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosDestinosValores = {
  nombre: '',
  estado: '',
}

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

function filtrarDestinos(
  destinos: Destino[],
  filtros: FiltrosDestinosValores,
): Destino[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return destinos.filter((destino) => {
    const coincideNombre =
      !nombre ||
      destino.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        destino.estado) ||
      (filtros.estado === 'inactivo' &&
        !destino.estado)

    return coincideNombre && coincideEstado
  })
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function DestinosPage() {
  const [destinos, setDestinos] =
    useState<Destino[]>(() =>
      obtenerDestinos(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosDestinosValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosDestinosValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)

  const [
    destinoEnEdicion,
    setDestinoEnEdicion,
  ] = useState<Destino | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    destinoAEliminar,
    setDestinoAEliminar,
  ] = useState<Destino | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  const destinosFiltrados = useMemo(
    () =>
      filtrarDestinos(
        destinos,
        filtrosAplicados,
      ),
    [destinos, filtrosAplicados],
  )

  const totalItems = destinosFiltrados.length

  const destinosPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return destinosFiltrados.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    destinosFiltrados,
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

  function recargarDestinos(): void {
    setDestinos(obtenerDestinos())
  }

  function abrirFormularioNuevo(): void {
    setMensaje(null)
    setErrorFormulario('')
    setDestinoEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    destino: Destino,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setDestinoEnEdicion(destino)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setDestinoEnEdicion(null)
    setErrorFormulario('')
  }

  function guardarDestino(
    datos: DestinoFormData,
  ): void {
    try {
      if (destinoEnEdicion) {
        actualizarDestino(
          destinoEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Destino actualizado correctamente.',
        })
      } else {
        crearDestino(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Destino registrado correctamente.',
        })
      }

      recargarDestinos()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    destino: Destino,
  ): void {
    setMensaje(null)
    setDestinoAEliminar(destino)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setDestinoAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!destinoAEliminar) {
      return
    }

    try {
      eliminarDestino(
        destinoAEliminar.id,
      )

      recargarDestinos()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Destino eliminado correctamente.',
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
              <h1>Destinos</h1>

              <p>
                Administración de los destinos
                utilizados en las operaciones del almacén.
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
            <FiltrosDestinos
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
            <TablaDestinos
              destinos={destinosPaginados}
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

      <DestinoFormModal
        abierto={modalFormOpen}
        destino={destinoEnEdicion}
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarDestino}
      />

      <DestinoDeleteModal
        abierto={modalDeleteOpen}
        destino={destinoAEliminar}
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
    </>
  )
}