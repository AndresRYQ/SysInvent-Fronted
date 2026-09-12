import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosTiposProducto,
  type FiltrosTiposProductoValores,
} from '../../components/tipos-productos/FiltrosTiposProducto'
import { TablaTiposProducto } from '../../components/tipos-productos/TablaTiposProducto'
import { TipoProductoDeleteModal } from '../../components/tipos-productos/TipoProductoDeleteModal'
import { TipoProductoFormModal } from '../../components/tipos-productos/TipoProductoFormModal'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import type { TipoProducto } from '../../types/tipoProducto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposProductoValores = {
  nombre: '',
  estado: '',
}

function filtrarTiposProducto(
  tiposProducto: TipoProducto[],
  filtros: FiltrosTiposProductoValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposProducto
    .filter((tipoProducto) => {
    const coincideNombre =
      nombre.length === 0 ||
      tipoProducto.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        tipoProducto.activo === 1) ||
      (filtros.estado === 'inactivo' &&
        tipoProducto.activo === 0)

    return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function TiposProductoPage() {
  const [tiposProducto, setTiposProducto] =
    useState<TipoProducto[]>(() =>
      obtenerStorage<TipoProducto[]>(
        STORAGE_KEYS.tiposProducto,
        [],
      ).map((tipoProducto) => ({
        ...tipoProducto,
        id: Number(
          String(tipoProducto.id).replace('TP-', ''),
        ),
      })),
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
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [tipoProductoAEliminar, setTipoProductoAEliminar] =
    useState<TipoProducto | null>(null)
  const [modalSoloLectura, setModalSoloLectura] =
    useState(false)
  const [modalReactivarOpen, setModalReactivarOpen] =
    useState(false)
  const [tipoProductoAReactivar, setTipoProductoAReactivar] =
    useState<TipoProducto | null>(null)

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
    const endIndex = startIndex + pageSize

    return tiposProductoFiltrados.slice(
      startIndex,
      endIndex,
    )
  }, [
    tiposProductoFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    guardarStorage(
      STORAGE_KEYS.tiposProducto,
      tiposProducto,
    )
  }, [tiposProducto])

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
              <h1>Tipos de producto</h1>
              <p>Mantenimiento de tipos de producto</p>
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
            <TablaTiposProducto
              tiposProducto={tiposProductoPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setTipoProductoEnEdicion(null)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onEditar={(tipoProducto) => {
                setTipoProductoEnEdicion(tipoProducto)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(tipoProducto) => {
                setTipoProductoEnEdicion(tipoProducto)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(tipoProducto) => {
                setTipoProductoAEliminar(tipoProducto)
                setModalDeleteOpen(true)
              }}
              onReactivar={(tipoProducto) => {
                setTipoProductoAReactivar(tipoProducto)
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

      <TipoProductoFormModal
        abierto={modalFormOpen}
        tipoProducto={tipoProductoEnEdicion}
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setTipoProductoEnEdicion(null)
          setModalSoloLectura(false)
        }}
        onSubmit={(payload) => {
          if (tipoProductoEnEdicion) {
            setTiposProducto((actual) =>
              actual.map((tipoProducto) =>
                tipoProducto.id ===
                tipoProductoEnEdicion.id
                  ? {
                      ...tipoProducto,
                      ...payload,
                    }
                  : tipoProducto,
              ),
            )
          } else {
            setTiposProducto((actual) => {
              const ultimoId = actual.reduce(
                (maximo, tipoProducto) =>
                  Number.isNaN(tipoProducto.id)
                    ? maximo
                    : Math.max(maximo, tipoProducto.id),
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
          setTipoProductoEnEdicion(null)
          setModalSoloLectura(false)
        }}
      />

      <TipoProductoDeleteModal
        abierto={modalDeleteOpen}
        tipoProducto={tipoProductoAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setTipoProductoAEliminar(null)
        }}
        onConfirm={() => {
          if (tipoProductoAEliminar) {
            setTiposProducto((actual) =>
              actual.map((tipoProducto) =>
                tipoProducto.id !== tipoProductoAEliminar.id
                  ? tipoProducto
                  : { ...tipoProducto, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setTipoProductoAEliminar(null)
        }}
      />

      <TipoProductoDeleteModal
        abierto={modalReactivarOpen}
        tipoProducto={tipoProductoAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setTipoProductoAReactivar(null)
        }}
        onConfirm={() => {
          if (tipoProductoAReactivar) {
            setTiposProducto((actual) =>
              actual.map((tipoProducto) =>
                tipoProducto.id === tipoProductoAReactivar.id
                  ? { ...tipoProducto, activo: 1 }
                  : tipoProducto,
              ),
            )
          }

          setModalReactivarOpen(false)
          setTipoProductoAReactivar(null)
        }}
      />
    </>
  )
}
