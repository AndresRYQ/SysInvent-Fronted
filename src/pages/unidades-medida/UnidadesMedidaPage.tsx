import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosUnidadesMedida,
  type FiltrosUnidadesMedidaValores,
} from '../../components/unidades-medida/FiltrosUnidadesMedida'
import { TablaUnidadesMedida } from '../../components/unidades-medida/TablaUnidadesMedida'
import { UnidadMedidaDeleteModal } from '../../components/unidades-medida/UnidadMedidaDeleteModal'
import { UnidadMedidaFormModal } from '../../components/unidades-medida/UnidadMedidaFormModal'
import type { UnidadMedida } from '../../types/unidadMedida'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosUnidadesMedidaValores = {
  nombre: '',
  estado: '',
}

const UNIDADES_MEDIDA_MOCK: UnidadMedida[] = [
  {
    id: 'UM-001',
    nombre: 'Unidad',
    estado: true,
    descripcion: 'Unidad individual de un producto o servicio.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'UM-002',
    nombre: 'Kilogramo',
    estado: true,
    descripcion: 'Unidad de masa equivalente a mil gramos.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'UM-003',
    nombre: 'Litro',
    estado: true,
    descripcion: 'Unidad de volumen equivalente a un decímetro cúbico.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'UM-004',
    nombre: 'Metro',
    estado: true,
    descripcion: 'Unidad de longitud del Sistema Internacional.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'UM-005',
    nombre: 'Caja',
    estado: false,
    descripcion: 'Embalaje que contiene una cantidad determinada de unidades.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarUnidadesMedida(
  unidades: UnidadMedida[],
  filtros: FiltrosUnidadesMedidaValores,
) {
  const nombre = filtros.nombre.trim().toLowerCase()

  return unidades.filter((unidad) => {
    const coincideNombre =
      nombre.length === 0 ||
      unidad.nombre.toLowerCase().includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && unidad.estado) ||
      (filtros.estado === 'inactivo' && !unidad.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(new Date())
}

export function UnidadesMedidaPage() {
  const [unidades, setUnidades] =
    useState<UnidadMedida[]>(UNIDADES_MEDIDA_MOCK)
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
                setModalFormOpen(true)
              }}
              onEditar={(unidad) => {
                setUnidadEnEdicion(unidad)
                setModalFormOpen(true)
              }}
              onEliminar={(unidad) => {
                setUnidadAEliminar(unidad)
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

      <UnidadMedidaFormModal
        abierto={modalFormOpen}
        unidadMedida={unidadEnEdicion}
        onClose={() => {
          setModalFormOpen(false)
          setUnidadEnEdicion(null)
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
              const nextId = String(actual.length + 1).padStart(3, '0')

              return [
                {
                  id: `UM-${nextId}`,
                  fechaRegistro: crearFechaActual(),
                  estado: true,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setUnidadEnEdicion(null)
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
              actual.filter((unidad) => unidad.id !== unidadAEliminar.id),
            )
          }

          setModalDeleteOpen(false)
          setUnidadAEliminar(null)
        }}
      />
    </>
  )
}
