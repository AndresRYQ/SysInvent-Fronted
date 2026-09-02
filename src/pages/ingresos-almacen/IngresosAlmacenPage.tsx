
import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosIngreso,
  type FiltrosIngresoValores,
} from '../../components/ingresos-almacen/FiltrosIngreso'
import {
  FormularioIngreso,
  type IngresoFormPayload,
} from '../../components/ingresos-almacen/FormularioIngreso'
import { IngresoDeleteModal } from '../../components/ingresos-almacen/IngresoDeleteModal'
import { TablaIngresos } from '../../components/ingresos-almacen/TablaIngresos'
import type { IngresoAlmacen } from '../../types/ingresoAlmacen'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosIngresoValores = {
  numeroIngreso: '',
  proveedor: '',
  estado: '',
}

const INGRESOS_MOCK: IngresoAlmacen[] = [
  {
    id: 'ING-001',
    numeroIngreso: 'ING-2026-0001',
    fechaRegistro: '2026-08-05',
    proveedor: 'Ferreteria Industrial SAC',
    producto: 'Guantes de nitrilo',
    cantidad: 50,
    unidadMedida: 'Caja',
    almacen: 'Almacén Central',
    observacion: 'Ingreso por reposición de stock.',
    estado: true,
  },
  {
    id: 'ING-002',
    numeroIngreso: 'ING-2026-0002',
    fechaRegistro: '2026-08-08',
    proveedor: 'Distribuidora Lima Norte',
    producto: 'Mascarillas N95',
    cantidad: 100,
    unidadMedida: 'Paquete',
    almacen: 'Almacén Central',
    observacion: 'Material para seguridad industrial.',
    estado: true,
  },
  {
    id: 'ING-003',
    numeroIngreso: 'ING-2026-0003',
    fechaRegistro: '2026-08-10',
    proveedor: 'Importaciones del Sur',
    producto: 'Cinta de embalaje',
    cantidad: 200,
    unidadMedida: 'Rollo',
    almacen: 'Almacén Secundario',
    observacion: 'Ingreso de materiales para despacho.',
    estado: true,
  },
  {
    id: 'ING-004',
    numeroIngreso: 'ING-2026-0004',
    fechaRegistro: '2026-08-12',
    proveedor: 'Comercial Huaral EIRL',
    producto: 'Lentes de seguridad',
    cantidad: 75,
    unidadMedida: 'Unidad',
    almacen: 'Almacén Central',
    observacion: 'Entrega parcial del proveedor.',
    estado: true,
  },
  {
    id: 'ING-005',
    numeroIngreso: 'ING-2026-0005',
    fechaRegistro: '2026-08-15',
    proveedor: 'Ferreteria Industrial SAC',
    producto: 'Tornillos hexagonales',
    cantidad: 500,
    unidadMedida: 'Bolsa',
    almacen: 'Almacén Secundario',
    observacion: 'Registro anulado para maqueta.',
    estado: false,
  },
  {
    id: 'ING-006',
    numeroIngreso: 'ING-2026-0006',
    fechaRegistro: '2026-08-18',
    proveedor: 'Distribuidora Lima Norte',
    producto: 'Desinfectante industrial',
    cantidad: 30,
    unidadMedida: 'Galon',
    almacen: 'Almacén Central',
    observacion: 'Ingreso para limpieza general.',
    estado: true,
  },
  {
    id: 'ING-007',
    numeroIngreso: 'ING-2026-0007',
    fechaRegistro: '2026-08-22',
    proveedor: 'Importaciones del Sur',
    producto: 'Casco de seguridad',
    cantidad: 40,
    unidadMedida: 'Unidad',
    almacen: 'Almacén Central',
    observacion: 'Stock inicial para operaciones.',
    estado: true,
  },
  {
    id: 'ING-008',
    numeroIngreso: 'ING-2026-0008',
    fechaRegistro: '2026-08-25',
    proveedor: 'Comercial Huaral EIRL',
    producto: 'Aceite lubricante',
    cantidad: 20,
    unidadMedida: 'Litro',
    almacen: 'Almacén Secundario',
    observacion: 'Material para mantenimiento.',
    estado: true,
  },
]

function filtrarIngresos(
  ingresos: IngresoAlmacen[],
  filtros: FiltrosIngresoValores,
) {
  const numeroIngreso = filtros.numeroIngreso.trim().toLowerCase()
  const proveedor = filtros.proveedor.trim().toLowerCase()

  return ingresos.filter((ingreso) => {
    const coincideNumero =
      numeroIngreso.length === 0 ||
      ingreso.numeroIngreso.toLowerCase().includes(numeroIngreso)

    const coincideProveedor =
      proveedor.length === 0 ||
      ingreso.proveedor.toLowerCase().includes(proveedor)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && ingreso.estado) ||
      (filtros.estado === 'anulado' && !ingreso.estado)

    return coincideNumero && coincideProveedor && coincideEstado
  })
}

function crearCodigoIngreso(total: number) {
  return String(total + 1).padStart(3, '0')
}

function crearNumeroIngreso(total: number) {
  return `ING-2026-${String(total + 1).padStart(4, '0')}`
}

export function IngresosAlmacenPage() {
  const [ingresos, setIngresos] =
    useState<IngresoAlmacen[]>(INGRESOS_MOCK)
  const [filtros, setFiltros] =
    useState<FiltrosIngresoValores>(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosIngresoValores>(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [ingresoEnEdicion, setIngresoEnEdicion] =
    useState<IngresoAlmacen | null>(null)
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [ingresoAEliminar, setIngresoAEliminar] =
    useState<IngresoAlmacen | null>(null)

  const ingresosFiltrados = useMemo(
    () =>
      filtrarIngresos(
        ingresos,
        filtrosAplicados,
      ),
    [ingresos, filtrosAplicados],
  )

  const totalItems = ingresosFiltrados.length

  const ingresosPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return ingresosFiltrados.slice(
      startIndex,
      endIndex,
    )
  }, [
    ingresosFiltrados,
    page,
    pageSize,
  ])

  const numeroIngresoSugerido = useMemo(
    () => crearNumeroIngreso(ingresos.length),
    [ingresos.length],
  )

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  const guardarIngreso = (payload: IngresoFormPayload) => {
    if (ingresoEnEdicion) {
      setIngresos((actual) =>
        actual.map((ingreso) =>
          ingreso.id === ingresoEnEdicion.id
            ? {
                ...ingreso,
                ...payload,
              }
            : ingreso,
        ),
      )
    } else {
      setIngresos((actual) => [
        {
          id: `ING-${crearCodigoIngreso(actual.length)}`,
          estado: true,
          ...payload,
        },
        ...actual,
      ])
    }

    setModalFormOpen(false)
    setIngresoEnEdicion(null)
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Ingresos de Almacén</h1>
              <p>Registro de entradas de productos al almacén</p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosIngreso
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
            <TablaIngresos
              ingresos={ingresosPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setIngresoEnEdicion(null)
                setModalFormOpen(true)
              }}
              onEditar={(ingreso) => {
                setIngresoEnEdicion(ingreso)
                setModalFormOpen(true)
              }}
              onEliminar={(ingreso) => {
                setIngresoAEliminar(ingreso)
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

      <FormularioIngreso
        abierto={modalFormOpen}
        ingreso={ingresoEnEdicion}
        numeroIngresoSugerido={numeroIngresoSugerido}
        onClose={() => {
          setModalFormOpen(false)
          setIngresoEnEdicion(null)
        }}
        onSubmit={guardarIngreso}
      />

      <IngresoDeleteModal
        abierto={modalDeleteOpen}
        ingreso={ingresoAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setIngresoAEliminar(null)
        }}
        onConfirm={() => {
          if (ingresoAEliminar) {
            setIngresos((actual) =>
              actual.map((ingreso) =>
                ingreso.id === ingresoAEliminar.id
                  ? {
                      ...ingreso,
                      estado: false,
                    }
                  : ingreso,
              ),
            )
          }

          setModalDeleteOpen(false)
          setIngresoAEliminar(null)
        }}
      />
    </>
  )
}
