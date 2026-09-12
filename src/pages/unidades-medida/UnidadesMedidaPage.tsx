import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosUnidadesMedida,
  type FiltrosUnidadesMedidaValores,
} from '../../components/unidades-medida/FiltrosUnidadesMedida'
import { TablaUnidadesMedida } from '../../components/unidades-medida/TablaUnidadesMedida'
import { UnidadMedidaDeleteModal } from '../../components/unidades-medida/UnidadMedidaDeleteModal'
import { UnidadMedidaFormModal } from '../../components/unidades-medida/UnidadMedidaFormModal'
import type { UnidadMedida } from '../../types/unidadMedida'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosUnidadesMedidaValores = {
  nombre: '',
  estado: '',
}

function filtrarUnidadesMedida(
  unidades: UnidadMedida[],
  filtros: FiltrosUnidadesMedidaValores,
) {
  const nombre = filtros.nombre.trim().toLowerCase()

  return unidades
    .filter((unidad) => {
    const coincideNombre =
      nombre.length === 0 ||
      unidad.nombre.toLowerCase().includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && unidad.activo === 1) ||
      (filtros.estado === 'inactivo' && unidad.activo === 0)

    return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function UnidadesMedidaPage() {
  const [unidades, setUnidades] =
    useState<UnidadMedida[]>(() =>
      obtenerStorage<UnidadMedida[]>(
        STORAGE_KEYS.unidadesMedida,
        [],
      ).map((unidad) => ({
        ...unidad,
        id: Number(String(unidad.id).replace('UM-', '')),
      })),
    )
  const [filtros, setFiltros] =
    useState<FiltrosUnidadesMedidaValores>(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosUnidadesMedidaValores>(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [unidadEnEdicion, setUnidadEnEdicion] =
    useState<UnidadMedida | null>(null)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [unidadAEliminar, setUnidadAEliminar] =
    useState<UnidadMedida | null>(null)
  const [modalSoloLectura, setModalSoloLectura] = useState(false)
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [unidadAReactivar, setUnidadAReactivar] = useState<UnidadMedida | null>(null)

  const unidadesFiltradas = useMemo(
    () => filtrarUnidadesMedida(unidades, filtrosAplicados),
    [unidades, filtrosAplicados],
  )

  const totalItems = unidadesFiltradas.length

  const unidadesPaginadas = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return unidadesFiltradas.slice(startIndex, endIndex)
  }, [unidadesFiltradas, page, pageSize])

  useEffect(() => {
    guardarStorage(STORAGE_KEYS.unidadesMedida, unidades)
  }, [unidades])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

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
              <h1>Unidades de medida</h1>
              <p>Mantenimiento de unidades de medida</p>
            </div>
          </section>

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
            <TablaUnidadesMedida
              unidades={unidadesPaginadas}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setUnidadEnEdicion(null)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onEditar={(unidad) => {
                setUnidadEnEdicion(unidad)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(unidad) => {
                setUnidadEnEdicion(unidad)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(unidad) => {
                setUnidadAEliminar(unidad)
                setModalDeleteOpen(true)
              }}
              onReactivar={(unidad) => {
                setUnidadAReactivar(unidad)
                setModalReactivarOpen(true)
              }}
              onPageChange={(nextPage) => setPage(nextPage)}
              onPageSizeChange={(nextPageSize) => {
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
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setUnidadEnEdicion(null)
          setModalSoloLectura(false)
        }}
        onSubmit={(payload) => {
          if (unidadEnEdicion) {
            setUnidades((actual) =>
              actual.map((unidad) =>
                unidad.id === unidadEnEdicion.id
                  ? { ...unidad, ...payload }
                  : unidad,
              ),
            )
          } else {
            setUnidades((actual) => {
              const ultimoId = actual.reduce(
                (maximo, unidad) =>
                  Number.isNaN(unidad.id)
                    ? maximo
                    : Math.max(maximo, unidad.id),
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
          setUnidadEnEdicion(null)
          setModalSoloLectura(false)
        }}
      />

      <UnidadMedidaDeleteModal
        abierto={modalDeleteOpen}
        unidadMedida={unidadAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setUnidadAEliminar(null)
        }}
        onConfirm={() => {
          if (unidadAEliminar) {
            setUnidades((actual) =>
              actual.map((unidad) =>
                unidad.id !== unidadAEliminar.id
                  ? unidad
                  : { ...unidad, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setUnidadAEliminar(null)
        }}
      />

      <UnidadMedidaDeleteModal
        abierto={modalReactivarOpen}
        unidadMedida={unidadAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setUnidadAReactivar(null)
        }}
        onConfirm={() => {
          if (unidadAReactivar) {
            setUnidades((actual) =>
              actual.map((unidad) =>
                unidad.id === unidadAReactivar.id
                  ? { ...unidad, activo: 1 }
                  : unidad,
              ),
            )
          }
          setModalReactivarOpen(false)
          setUnidadAReactivar(null)
        }}
      />
    </>
  )
}
