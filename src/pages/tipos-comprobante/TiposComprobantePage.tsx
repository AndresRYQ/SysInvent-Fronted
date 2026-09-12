import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosTiposComprobante,
  type FiltrosTiposComprobanteValores,
} from '../../components/tipos-comprobante/FiltrosTiposComprobante'
import { TablaTiposComprobante } from '../../components/tipos-comprobante/TablaTiposComprobante'
import { TipoComprobanteDeleteModal } from '../../components/tipos-comprobante/TipoComprobanteDeleteModal'
import { TipoComprobanteFormModal } from '../../components/tipos-comprobante/TipoComprobanteFormModal'
import type { TipoComprobante } from '../../types/tipoComprobante'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposComprobanteValores = {
  nombre: '',
  estado: '',
}

function filtrarTiposComprobante(
  tiposComprobante: TipoComprobante[],
  filtros: FiltrosTiposComprobanteValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposComprobante
    .filter((tipoComprobante) => {
    const coincideNombre =
      nombre.length === 0 ||
      tipoComprobante.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        tipoComprobante.activo === 1) ||
      (filtros.estado === 'inactivo' &&
        tipoComprobante.activo === 0)

    return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function TiposComprobantePage() {
  const [tiposComprobante, setTiposComprobante] =
    useState<TipoComprobante[]>(() =>
      obtenerStorage<TipoComprobante[]>(
        STORAGE_KEYS.tiposComprobante,
        [],
      ).map((tipoComprobante) => ({
        ...tipoComprobante,
        id: Number(
          String(tipoComprobante.id).replace('TC-', ''),
        ),
      })),
    )
  const [filtros, setFiltros] =
    useState<FiltrosTiposComprobanteValores>(
      FILTROS_INICIALES,
    )
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosTiposComprobanteValores>(
      FILTROS_INICIALES,
    )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [tipoComprobanteEnEdicion, setTipoComprobanteEnEdicion] =
    useState<TipoComprobante | null>(null)
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [tipoComprobanteAEliminar, setTipoComprobanteAEliminar] =
    useState<TipoComprobante | null>(null)
  const [modalSoloLectura, setModalSoloLectura] =
    useState(false)
  const [modalReactivarOpen, setModalReactivarOpen] =
    useState(false)
  const [tipoComprobanteAReactivar, setTipoComprobanteAReactivar] =
    useState<TipoComprobante | null>(null)

  const tiposComprobanteFiltrados = useMemo(
    () =>
      filtrarTiposComprobante(
        tiposComprobante,
        filtrosAplicados,
      ),
    [tiposComprobante, filtrosAplicados],
  )

  const totalItems = tiposComprobanteFiltrados.length

  const tiposComprobantePaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return tiposComprobanteFiltrados.slice(
      startIndex,
      endIndex,
    )
  }, [
    tiposComprobanteFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    guardarStorage(
      STORAGE_KEYS.tiposComprobante,
      tiposComprobante,
    )
  }, [tiposComprobante])

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Tipos de comprobante</h1>
              <p>Mantenimiento de tipos de comprobante</p>
            </div>
          </section>

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
                setFiltrosAplicados(filtros)
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(FILTROS_INICIALES)
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaTiposComprobante
              tiposComprobante={tiposComprobantePaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setTipoComprobanteEnEdicion(null)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onEditar={(tipoComprobante) => {
                setTipoComprobanteEnEdicion(tipoComprobante)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(tipoComprobante) => {
                setTipoComprobanteEnEdicion(tipoComprobante)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(tipoComprobante) => {
                setTipoComprobanteAEliminar(tipoComprobante)
                setModalDeleteOpen(true)
              }}
              onReactivar={(tipoComprobante) => {
                setTipoComprobanteAReactivar(tipoComprobante)
                setModalReactivarOpen(true)
              }}
              onPageChange={(nextPage) =>
                setPage(nextPage)
              }
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      <TipoComprobanteFormModal
        abierto={modalFormOpen}
        tipoComprobante={tipoComprobanteEnEdicion}
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setTipoComprobanteEnEdicion(null)
          setModalSoloLectura(false)
        }}
        onSubmit={(payload) => {
          if (tipoComprobanteEnEdicion) {
            setTiposComprobante((actual) =>
              actual.map((tipoComprobante) =>
                tipoComprobante.id ===
                tipoComprobanteEnEdicion.id
                  ? {
                      ...tipoComprobante,
                      ...payload,
                    }
                  : tipoComprobante,
              ),
            )
          } else {
            setTiposComprobante((actual) => {
              const ultimoId = actual.reduce(
                (maximo, tipoComprobante) =>
                  Number.isNaN(tipoComprobante.id)
                    ? maximo
                    : Math.max(maximo, tipoComprobante.id),
                0,
              )

              return [
                {
                  id: ultimoId + 1,
                  activo: 1,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setTipoComprobanteEnEdicion(null)
          setModalSoloLectura(false)
        }}
      />

      <TipoComprobanteDeleteModal
        abierto={modalDeleteOpen}
        tipoComprobante={tipoComprobanteAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setTipoComprobanteAEliminar(null)
        }}
        onConfirm={() => {
          if (tipoComprobanteAEliminar) {
            setTiposComprobante((actual) =>
              actual.map((tipoComprobante) =>
                tipoComprobante.id !== tipoComprobanteAEliminar.id
                  ? tipoComprobante
                  : { ...tipoComprobante, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setTipoComprobanteAEliminar(null)
        }}
      />

      <TipoComprobanteDeleteModal
        abierto={modalReactivarOpen}
        tipoComprobante={tipoComprobanteAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setTipoComprobanteAReactivar(null)
        }}
        onConfirm={() => {
          if (tipoComprobanteAReactivar) {
            setTiposComprobante((actual) =>
              actual.map((tipoComprobante) =>
                tipoComprobante.id === tipoComprobanteAReactivar.id
                  ? { ...tipoComprobante, activo: 1 }
                  : tipoComprobante,
              ),
            )
          }

          setModalReactivarOpen(false)
          setTipoComprobanteAReactivar(null)
        }}
      />
    </>
  )
}
