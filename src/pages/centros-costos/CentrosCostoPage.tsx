import { useEffect, useMemo, useState } from 'react'

import { CentroCostoDeleteModal } from '../../components/centros-costo/CentroCostoDeleteModal'
import { CentroCostoFormModal } from '../../components/centros-costo/CentroCostoFormModal'
import {
  FiltrosCentrosCosto,
  type FiltrosCentrosCostoValores,
} from '../../components/centros-costo/FiltrosCentrosCosto'
import { TablaCentrosCosto } from '../../components/centros-costo/TablaCentrosCosto'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import type { CentroCosto } from '../../types/centroCosto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCentrosCostoValores = {
  nombre: '',
  estado: '',
}

function filtrarCentrosCosto(
  centrosCosto: CentroCosto[],
  filtros: FiltrosCentrosCostoValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return centrosCosto
    .filter((centroCosto) => {
      const coincideNombre =
        nombre.length === 0 ||
        centroCosto.nombre
          .toLowerCase()
          .includes(nombre)

      const coincideEstado =
        filtros.estado.length === 0 ||
        (filtros.estado === 'activo' &&
          centroCosto.activo === 1) ||
        (filtros.estado === 'inactivo' &&
          centroCosto.activo === 0)

      return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function CentrosCostoPage() {
  const [centrosCosto, setCentrosCosto] =
    useState<CentroCosto[]>(() =>
      obtenerStorage<CentroCosto[]>(
        STORAGE_KEYS.centrosCosto,
        [],
      ).map((centroCosto) => ({
        ...centroCosto,
        id: Number(
          String(centroCosto.id).replace('CC-', ''),
        ),
      })),
    )
  const [filtros, setFiltros] =
    useState<FiltrosCentrosCostoValores>(
      FILTROS_INICIALES,
    )
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosCentrosCostoValores>(
      FILTROS_INICIALES,
    )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [centroCostoEnEdicion, setCentroCostoEnEdicion] =
    useState<CentroCosto | null>(null)
  const [modalSoloLectura, setModalSoloLectura] =
    useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [centroCostoAEliminar, setCentroCostoAEliminar] =
    useState<CentroCosto | null>(null)
  const [modalReactivarOpen, setModalReactivarOpen] =
    useState(false)
  const [centroCostoAReactivar, setCentroCostoAReactivar] =
    useState<CentroCosto | null>(null)

  const centrosCostoFiltrados = useMemo(
    () =>
      filtrarCentrosCosto(
        centrosCosto,
        filtrosAplicados,
      ),
    [centrosCosto, filtrosAplicados],
  )

  const totalItems = centrosCostoFiltrados.length

  const centrosCostoPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return centrosCostoFiltrados.slice(
      startIndex,
      endIndex,
    )
  }, [
    centrosCostoFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    guardarStorage(
      STORAGE_KEYS.centrosCosto,
      centrosCosto,
    )
  }, [centrosCosto])

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
              <h1>Centros de costo</h1>
              <p>Mantenimiento de centros de costo</p>
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
            <TablaCentrosCosto
              centrosCosto={centrosCostoPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setCentroCostoEnEdicion(null)
                setModalFormOpen(true)
              }}
              onEditar={(centroCosto) => {
                setCentroCostoEnEdicion(centroCosto)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(centroCosto) => {
                setCentroCostoEnEdicion(centroCosto)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(centroCosto) => {
                setCentroCostoAEliminar(centroCosto)
                setModalDeleteOpen(true)
              }}
              onReactivar={(centroCosto) => {
                setCentroCostoAReactivar(centroCosto)
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

      <CentroCostoFormModal
        abierto={modalFormOpen}
        centroCosto={centroCostoEnEdicion}
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setCentroCostoEnEdicion(null)
          setModalSoloLectura(false)
        }}
        onSubmit={(payload) => {
          if (centroCostoEnEdicion) {
            setCentrosCosto((actual) =>
              actual.map((centroCosto) =>
                centroCosto.id ===
                centroCostoEnEdicion.id
                  ? {
                      ...centroCosto,
                      ...payload,
                    }
                  : centroCosto,
              ),
            )
          } else {
            setCentrosCosto((actual) => {
              const ultimoId = actual.reduce(
                (maximo, centroCosto) => {
                  return Number.isNaN(centroCosto.id)
                    ? maximo
                    : Math.max(maximo, centroCosto.id)
                },
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
          setCentroCostoEnEdicion(null)
          setModalSoloLectura(false)
        }}
      />

      <CentroCostoDeleteModal
        abierto={modalDeleteOpen}
        centroCosto={centroCostoAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setCentroCostoAEliminar(null)
        }}
        onConfirm={() => {
          if (centroCostoAEliminar) {
            setCentrosCosto((actual) =>
              actual.map((centroCosto) =>
                centroCosto.id !== centroCostoAEliminar.id
                  ? centroCosto
                  : { ...centroCosto, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setCentroCostoAEliminar(null)
        }}
      />

      <CentroCostoDeleteModal
        abierto={modalReactivarOpen}
        centroCosto={centroCostoAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setCentroCostoAReactivar(null)
        }}
        onConfirm={() => {
          if (centroCostoAReactivar) {
            setCentrosCosto((actual) =>
              actual.map((registro) =>
                registro.id === centroCostoAReactivar.id
                  ? { ...registro, activo: 1 }
                  : registro,
              ),
            )
          }

          setModalReactivarOpen(false)
          setCentroCostoAReactivar(null)
        }}
      />
    </>
  )
}

