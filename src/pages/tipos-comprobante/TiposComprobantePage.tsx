import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosTiposComprobante,
  type FiltrosTiposComprobanteValores,
} from '../../components/tipos-comprobante/FiltrosTiposComprobante'
import { TablaTiposComprobante } from '../../components/tipos-comprobante/TablaTiposComprobante'
import { TipoComprobanteDeleteModal } from '../../components/tipos-comprobante/TipoComprobanteDeleteModal'
import { TipoComprobanteFormModal } from '../../components/tipos-comprobante/TipoComprobanteFormModal'
import type { TipoComprobante } from '../../types/tipoComprobante'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposComprobanteValores = {
  nombre: '',
  estado: '',
}

const TIPOS_COMPROBANTE_MOCK: TipoComprobante[] = [
  {
    id: 'TC-001',
    nombre: 'Factura',
    estado: true,
    descripcion: 'Comprobante de venta con derecho a crédito fiscal.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'TC-002',
    nombre: 'Boleta',
    estado: true,
    descripcion: 'Comprobante de venta sin derecho a crédito fiscal.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'TC-003',
    nombre: 'Nota de crédito',
    estado: true,
    descripcion: 'Documento que anula parcial o totalmente una operación.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'TC-004',
    nombre: 'Nota de débito',
    estado: true,
    descripcion: 'Documento que incrementa el monto de una operación.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'TC-005',
    nombre: 'Guía de remisión',
    estado: false,
    descripcion: 'Documento que sustenta el traslado de mercadería.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarTiposComprobante(
  tiposComprobante: TipoComprobante[],
  filtros: FiltrosTiposComprobanteValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return tiposComprobante.filter((tipoComprobante) => {
    const coincideNombre =
      nombre.length === 0 ||
      tipoComprobante.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        tipoComprobante.estado) ||
      (filtros.estado === 'inactivo' &&
        !tipoComprobante.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(
    new Date(),
  )
}

export function TiposComprobantePage() {
  const [tiposComprobante, setTiposComprobante] =
    useState<TipoComprobante[]>(TIPOS_COMPROBANTE_MOCK)
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
                setModalFormOpen(true)
              }}
              onEditar={(tipoComprobante) => {
                setTipoComprobanteEnEdicion(tipoComprobante)
                setModalFormOpen(true)
              }}
              onEliminar={(tipoComprobante) => {
                setTipoComprobanteAEliminar(tipoComprobante)
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

      <TipoComprobanteFormModal
        abierto={modalFormOpen}
        tipoComprobante={tipoComprobanteEnEdicion}
        onClose={() => {
          setModalFormOpen(false)
          setTipoComprobanteEnEdicion(null)
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
              const nextId = String(
                actual.length + 1,
              ).padStart(3, '0')

              return [
                {
                  id: `TC-${nextId}`,
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
          setTipoComprobanteEnEdicion(null)
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
              actual.filter(
                (tipoComprobante) =>
                  tipoComprobante.id !==
                  tipoComprobanteAEliminar.id,
              ),
            )
          }

          setModalDeleteOpen(false)
          setTipoComprobanteAEliminar(null)
        }}
      />
    </>
  )
}
