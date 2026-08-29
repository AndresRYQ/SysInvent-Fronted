import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosDestinos,
  type FiltrosDestinosValores,
} from '../../components/destinos/FiltrosDestinos'
import { TablaDestinos } from '../../components/destinos/TablaDestinos'
import { DestinoDeleteModal } from '../../components/destinos/DestinoDeleteModal'
import { DestinoFormModal } from '../../components/destinos/DestinoFormModal'
import type { Destino } from '../../types/destino'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosDestinosValores = {
  nombre: '',
  estado: '',
}

const DESTINOS_MOCK: Destino[] = [
  {
    id: 'DES-001',
    nombre: 'Almacén Central',
    estado: true,
    descripcion: 'Almacén principal de la empresa.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'DES-002',
    nombre: 'Planta de procesamiento',
    estado: true,
    descripcion: 'Planta donde se procesa la mercadería.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'DES-003',
    nombre: 'Sucursal Norte',
    estado: true,
    descripcion: 'Sucursal ubicada en la zona norte del país.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'DES-004',
    nombre: 'Punto de venta Sur',
    estado: true,
    descripcion: 'Punto de venta ubicado en la zona sur.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'DES-005',
    nombre: 'Depósito temporal',
    estado: false,
    descripcion: 'Depósito de almacenamiento temporal de productos.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarDestinos(destinos: Destino[], filtros: FiltrosDestinosValores) {
  const nombre = filtros.nombre.trim().toLowerCase()

  return destinos.filter((destino) => {
    const coincideNombre =
      nombre.length === 0 || destino.nombre.toLowerCase().includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && destino.estado) ||
      (filtros.estado === 'inactivo' && !destino.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(new Date())
}

export function DestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>(DESTINOS_MOCK)
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
                setModalFormOpen(true)
              }}
              onEditar={(destino) => {
                setDestinoEnEdicion(destino)
                setModalFormOpen(true)
              }}
              onEliminar={(destino) => {
                setDestinoAEliminar(destino)
                setModalDeleteOpen(true)
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
        onClose={() => {
          setModalFormOpen(false)
          setDestinoEnEdicion(null)
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
              const nextId = String(actual.length + 1).padStart(3, '0')

              return [
                {
                  id: `DES-${nextId}`,
                  fechaRegistro: crearFechaActual(),
                  estado: true,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setDestinoEnEdicion(null)
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
              actual.filter((destino) => destino.id !== destinoAEliminar.id),
            )
          }

          setModalDeleteOpen(false)
          setDestinoAEliminar(null)
        }}
      />
    </>
  )
}
