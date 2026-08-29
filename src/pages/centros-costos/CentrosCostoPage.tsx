import { useEffect, useMemo, useState } from 'react'

import { CentroCostoDeleteModal } from '../../components/centros-costo/CentroCostoDeleteModal'
import { CentroCostoFormModal } from '../../components/centros-costo/CentroCostoFormModal'
import {
  FiltrosCentrosCosto,
  type FiltrosCentrosCostoValores,
} from '../../components/centros-costo/FiltrosCentrosCosto'
import { TablaCentrosCosto } from '../../components/centros-costo/TablaCentrosCosto'
import type { CentroCosto } from '../../types/centroCosto'
import '../../styles/DashboardPage.css'
import './CentrosCostoPage.css'

const FILTROS_INICIALES: FiltrosCentrosCostoValores = {
  nombre: '',
  estado: '',
}

const CENTROS_COSTO_MOCK: CentroCosto[] = [
  {
    id: 'CC-001',
    nombre: 'Administración',
    estado: true,
    descripcion: 'Gestión general y dirección de la organización.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'CC-002',
    nombre: 'Producción',
    estado: true,
    descripcion: 'Procesos de fabricación y ensamblaje.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'CC-003',
    nombre: 'Mantenimiento',
    estado: true,
    descripcion: 'Conservación de equipos e instalaciones.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'CC-004',
    nombre: 'Logística',
    estado: true,
    descripcion: 'Almacenamiento y distribución de materiales.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'CC-005',
    nombre: 'Ventas',
    estado: false,
    descripcion: 'Comercialización de productos y servicios.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarCentrosCosto(
  centrosCosto: CentroCosto[],
  filtros: FiltrosCentrosCostoValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return centrosCosto.filter((centroCosto) => {
    const coincideNombre =
      nombre.length === 0 ||
      centroCosto.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        centroCosto.estado) ||
      (filtros.estado === 'inactivo' &&
        !centroCosto.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(
    new Date(),
  )
}

export function CentrosCostoPage() {
  const [centrosCosto, setCentrosCosto] =
    useState<CentroCosto[]>(CENTROS_COSTO_MOCK)
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
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [centroCostoAEliminar, setCentroCostoAEliminar] =
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
      <main className="dashboard-shell centros-page-shell">
        <div className="container-xl px-0 centros-page-body">
          <section className="centros-topbar">
            <div className="centros-topbar__copy">
              <h1>Centros de costo</h1>
              <p>Mantenimiento de centros de costo</p>
            </div>
          </section>

          <div className="centros-panel">
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

          <div className="centros-panel">
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
                setModalFormOpen(true)
              }}
              onEliminar={(centroCosto) => {
                setCentroCostoAEliminar(centroCosto)
                setModalDeleteOpen(true)
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
        onClose={() => {
          setModalFormOpen(false)
          setCentroCostoEnEdicion(null)
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
              const nextId = String(
                actual.length + 1,
              ).padStart(3, '0')

              return [
                {
                  id: `CC-${nextId}`,
                  fechaRegistro:
                    crearFechaActual(),
                  estado: true,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setCentroCostoEnEdicion(null)
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
              actual.filter(
                (centroCosto) =>
                  centroCosto.id !==
                  centroCostoAEliminar.id,
              ),
            )
          }

          setModalDeleteOpen(false)
          setCentroCostoAEliminar(null)
        }}
      />
    </>
  )
}
