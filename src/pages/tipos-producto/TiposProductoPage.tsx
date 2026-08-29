import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosTiposProducto,
  type FiltrosTiposProductoValores,
} from '../../components/tipos-productos/FiltrosTiposProducto'
import { TablaTiposProducto } from '../../components/tipos-productos/TablaTiposProducto'
import { TipoProductoDeleteModal } from '../../components/tipos-productos/TipoProductoDeleteModal'
import { TipoProductoFormModal } from '../../components/tipos-productos/TipoProductoFormModal'
import type { TipoProducto } from '../../types/tipoProducto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposProductoValores = {
  nombre: '',
  estado: '',
}

const TIPOS_PRODUCTO_MOCK: TipoProducto[] = [
  {
    id: 'TP-001',
    nombre: 'Insumo',
    estado: true,
    descripcion: 'Materia prima utilizada en los procesos.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'TP-002',
    nombre: 'Producto terminado',
    estado: true,
    descripcion: 'Artículos listos para su comercialización.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'TP-003',
    nombre: 'Material de empaque',
    estado: true,
    descripcion: 'Insumos para el embalaje de los productos.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'TP-004',
    nombre: 'Repuesto',
    estado: true,
    descripcion: 'Piezas de reemplazo para mantenimiento.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'TP-005',
    nombre: 'Material de oficina',
    estado: false,
    descripcion: 'Útiles y suministros para labores administrativas.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarTiposProducto(
  tiposProducto: TipoProducto[],
  filtros: FiltrosTiposProductoValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposProducto.filter((tipoProducto) => {
    const coincideNombre =
      nombre.length === 0 ||
      tipoProducto.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        tipoProducto.estado) ||
      (filtros.estado === 'inactivo' &&
        !tipoProducto.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(
    new Date(),
  )
}

export function TiposProductoPage() {
  const [tiposProducto, setTiposProducto] =
    useState<TipoProducto[]>(TIPOS_PRODUCTO_MOCK)
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
                setModalFormOpen(true)
              }}
              onEditar={(tipoProducto) => {
                setTipoProductoEnEdicion(tipoProducto)
                setModalFormOpen(true)
              }}
              onEliminar={(tipoProducto) => {
                setTipoProductoAEliminar(tipoProducto)
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

      <TipoProductoFormModal
        abierto={modalFormOpen}
        tipoProducto={tipoProductoEnEdicion}
        onClose={() => {
          setModalFormOpen(false)
          setTipoProductoEnEdicion(null)
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
              const nextId = String(
                actual.length + 1,
              ).padStart(3, '0')

              return [
                {
                  id: `TP-${nextId}`,
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
          setTipoProductoEnEdicion(null)
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
              actual.filter(
                (tipoProducto) =>
                  tipoProducto.id !==
                  tipoProductoAEliminar.id,
              ),
            )
          }

          setModalDeleteOpen(false)
          setTipoProductoAEliminar(null)
        }}
      />
    </>
  )
}
