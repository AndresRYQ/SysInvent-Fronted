import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosTiposComprobante,
  type FiltrosTiposComprobanteValores,
} from '../../components/tipos-comprobante/FiltrosTiposComprobante'

import { TablaTiposComprobante } from '../../components/tipos-comprobante/TablaTiposComprobante'
import { TipoComprobanteDeleteModal } from '../../components/tipos-comprobante/TipoComprobanteDeleteModal'
import { TipoComprobanteFormModal } from '../../components/tipos-comprobante/TipoComprobanteFormModal'

import {
  actualizarTipoDocumento,
  crearTipoDocumento,
  eliminarTipoDocumento,
  obtenerTiposDocumento,
} from '../../services/tipoComprobanteService'

import type {
  TipoComprobante,
  TipoComprobanteFormData,
} from '../../types/tipoComprobante'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposComprobanteValores = {
  nombre: '',
  estado: '',
}

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

function filtrarTiposDocumento(
  tiposDocumento: TipoComprobante[],
  filtros: FiltrosTiposComprobanteValores,
): TipoComprobante[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposDocumento.filter(
    (tipoDocumento) => {
      const coincideNombre =
        !nombre ||
        tipoDocumento.nombre
          .toLowerCase()
          .includes(nombre)

      const coincideEstado =
        !filtros.estado ||
        (filtros.estado === 'activo' &&
          tipoDocumento.estado) ||
        (filtros.estado === 'inactivo' &&
          !tipoDocumento.estado)

      return coincideNombre && coincideEstado
    },
  )
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function TiposComprobantePage() {
  const [
    tiposDocumento,
    setTiposDocumento,
  ] = useState<TipoComprobante[]>(() =>
    obtenerTiposDocumento(),
  )

  const [filtros, setFiltros] =
    useState<FiltrosTiposComprobanteValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosTiposComprobanteValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)

  const [
    tipoDocumentoEnEdicion,
    setTipoDocumentoEnEdicion,
  ] = useState<TipoComprobante | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    tipoDocumentoAEliminar,
    setTipoDocumentoAEliminar,
  ] = useState<TipoComprobante | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  const tiposDocumentoFiltrados = useMemo(
    () =>
      filtrarTiposDocumento(
        tiposDocumento,
        filtrosAplicados,
      ),
    [tiposDocumento, filtrosAplicados],
  )

  const totalItems =
    tiposDocumentoFiltrados.length

  const tiposDocumentoPaginados = useMemo(
    () => {
      const startIndex =
        (page - 1) * pageSize

      return tiposDocumentoFiltrados.slice(
        startIndex,
        startIndex + pageSize,
      )
    },
    [
      tiposDocumentoFiltrados,
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

  function recargarTiposDocumento(): void {
    setTiposDocumento(
      obtenerTiposDocumento(),
    )
  }

  function abrirFormularioNuevo(): void {
    setMensaje(null)
    setErrorFormulario('')
    setTipoDocumentoEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    tipoDocumento: TipoComprobante,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setTipoDocumentoEnEdicion(
      tipoDocumento,
    )
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setTipoDocumentoEnEdicion(null)
    setErrorFormulario('')
  }

  function guardarTipoDocumento(
    datos: TipoComprobanteFormData,
  ): void {
    try {
      if (tipoDocumentoEnEdicion) {
        actualizarTipoDocumento(
          tipoDocumentoEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Tipo de documento actualizado correctamente.',
        })
      } else {
        crearTipoDocumento(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Tipo de documento registrado correctamente.',
        })
      }

      recargarTiposDocumento()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    tipoDocumento: TipoComprobante,
  ): void {
    setMensaje(null)
    setTipoDocumentoAEliminar(
      tipoDocumento,
    )
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setTipoDocumentoAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!tipoDocumentoAEliminar) {
      return
    }

    try {
      eliminarTipoDocumento(
        tipoDocumentoAEliminar.id,
      )

      recargarTiposDocumento()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Tipo de documento eliminado correctamente.',
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
              <h1>Tipos de documento</h1>

              <p>
                Administración de los documentos
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
            <FiltrosTiposComprobante
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
            <TablaTiposComprobante
              tiposComprobante={
                tiposDocumentoPaginados
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

      <TipoComprobanteFormModal
        abierto={modalFormOpen}
        tipoComprobante={
          tipoDocumentoEnEdicion
        }
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarTipoDocumento}
      />

      <TipoComprobanteDeleteModal
        abierto={modalDeleteOpen}
        tipoComprobante={
          tipoDocumentoAEliminar
        }
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
    </>
  )
}