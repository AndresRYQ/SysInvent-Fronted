import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosDestinos,
  type FiltrosDestinosValores,
} from '../../components/destinos/FiltrosDestinos'
import { TablaDestinos } from '../../components/destinos/TablaDestinos'
import { DestinoDeleteModal } from '../../components/destinos/DestinoDeleteModal'
import { DestinoFormModal } from '../../components/destinos/DestinoFormModal'
import type { Destino } from '../../types/destino'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosDestinosValores = {
  nombre: '',
  estado: '',
}

function filtrarDestinos(destinos: Destino[], filtros: FiltrosDestinosValores) {
  const nombre = filtros.nombre.trim().toLowerCase()

  return destinos
    .filter((destino) => {
    const coincideNombre =
      nombre.length === 0 || destino.nombre.toLowerCase().includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && destino.activo === 1) ||
      (filtros.estado === 'inactivo' && destino.activo === 0)

    return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function DestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>(() =>
    obtenerStorage<Destino[]>(STORAGE_KEYS.destinos, []).map((destino) => ({
      ...destino,
      id: Number(String(destino.id).replace('DES-', '')),
    })),
  )
  const [filtros, setFiltros] =
    useState<FiltrosDestinosValores>(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosDestinosValores>(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [destinoEnEdicion, setDestinoEnEdicion] =
    useState<Destino | null>(null)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [destinoAEliminar, setDestinoAEliminar] = useState<Destino | null>(null)
  const [modalSoloLectura, setModalSoloLectura] = useState(false)
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [destinoAReactivar, setDestinoAReactivar] = useState<Destino | null>(null)

  const destinosFiltrados = useMemo(
    () => filtrarDestinos(destinos, filtrosAplicados),
    [destinos, filtrosAplicados],
  )

  const totalItems = destinosFiltrados.length

  const destinosPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return destinosFiltrados.slice(startIndex, endIndex)
  }, [destinosFiltrados, page, pageSize])

  useEffect(() => {
    guardarStorage(STORAGE_KEYS.destinos, destinos)
  }, [destinos])

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
              <h1>Destinos</h1>
              <p>Mantenimiento de destinos</p>
            </div>
          </section>

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
            <TablaDestinos
              destinos={destinosPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setDestinoEnEdicion(null)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onEditar={(destino) => {
                setDestinoEnEdicion(destino)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(destino) => {
                setDestinoEnEdicion(destino)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(destino) => {
                setDestinoAEliminar(destino)
                setModalDeleteOpen(true)
              }}
              onReactivar={(destino) => {
                setDestinoAReactivar(destino)
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

      <DestinoFormModal
        abierto={modalFormOpen}
        destino={destinoEnEdicion}
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setDestinoEnEdicion(null)
          setModalSoloLectura(false)
        }}
        onSubmit={(payload) => {
          if (destinoEnEdicion) {
            setDestinos((actual) =>
              actual.map((destino) =>
                destino.id === destinoEnEdicion.id
                  ? { ...destino, ...payload }
                  : destino,
              ),
            )
          } else {
            setDestinos((actual) => {
              const ultimoId = actual.reduce(
                (maximo, destino) =>
                  Number.isNaN(destino.id)
                    ? maximo
                    : Math.max(maximo, destino.id),
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
          setDestinoEnEdicion(null)
          setModalSoloLectura(false)
        }}
      />

      <DestinoDeleteModal
        abierto={modalDeleteOpen}
        destino={destinoAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setDestinoAEliminar(null)
        }}
        onConfirm={() => {
          if (destinoAEliminar) {
            setDestinos((actual) =>
              actual.map((destino) =>
                destino.id !== destinoAEliminar.id
                  ? destino
                  : { ...destino, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setDestinoAEliminar(null)
        }}
      />

      <DestinoDeleteModal
        abierto={modalReactivarOpen}
        destino={destinoAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setDestinoAReactivar(null)
        }}
        onConfirm={() => {
          if (destinoAReactivar) {
            setDestinos((actual) =>
              actual.map((destino) =>
                destino.id === destinoAReactivar.id
                  ? { ...destino, activo: 1 }
                  : destino,
              ),
            )
          }
          setModalReactivarOpen(false)
          setDestinoAReactivar(null)
        }}
      />
    </>
  )
}
