import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  BarChart3,
} from 'lucide-react'

import { ExportarProductosMasPedidosButton } from '../../components/reportes/productos-mas-pedidos/ExportarProductosMasPedidosButton'
import { FiltrosProductosMasPedidos } from '../../components/reportes/productos-mas-pedidos/FiltrosProductosMasPedidos'
import { GraficoProductosMasPedidos } from '../../components/reportes/productos-mas-pedidos/GraficoProductosMasPedidos'
import { ResumenProductosMasPedidos } from '../../components/reportes/productos-mas-pedidos/ResumenProductosMasPedidos'
import { TablaProductosMasPedidos } from '../../components/reportes/productos-mas-pedidos/TablaProductosMasPedidos'
import { TablePagination } from '../../components/ui/TablePagination'

import { obtenerCategorias } from '../../services/categoriaService'
import { obtenerDestinos } from '../../services/destinoService'

import {
  obtenerProductosMasPedidos,
  obtenerResumenProductosMasPedidos,
} from '../../services/reporteProductoMasPedidoService'

import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  FiltrosProductosMasPedidos as Filtros,
} from '../../types/reporteProductoMasPedido'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  tipoProductoId: '',
  categoriaId: '',
  destinoId: '',
}

export function ProductosMasPedidosPage() {
  const [filtros, setFiltros] =
    useState<Filtros>({
      ...FILTROS_INICIALES,
    })

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<Filtros>({
    ...FILTROS_INICIALES,
  })

  const [page, setPage] = useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const tiposProducto = useMemo(
    () =>
      obtenerTiposProducto()
        .map((tipo) => ({
          id: String(tipo.id),
          nombre: tipo.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const categorias = useMemo(
    () =>
      obtenerCategorias()
        .map((categoria) => ({
          id: String(categoria.id),
          nombre: categoria.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const destinos = useMemo(
    () =>
      obtenerDestinos()
        .map((destino) => ({
          id: String(destino.id),
          nombre: destino.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const filas = useMemo(
    () =>
      obtenerProductosMasPedidos(
        filtrosAplicados,
      ),
    [filtrosAplicados],
  )

  const resumen = useMemo(
    () =>
      obtenerResumenProductosMasPedidos(
        filas,
        filtrosAplicados,
      ),
    [
      filas,
      filtrosAplicados,
    ],
  )

  const totalItems = filas.length

  const filasPaginadas = useMemo(
    () => {
      const inicio =
        (page - 1) * pageSize

      return filas.slice(
        inicio,
        inicio + pageSize,
      )
    },
    [
      filas,
      page,
      pageSize,
    ],
  )

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(
        totalItems / pageSize,
      ),
    )

    if (page > totalPaginas) {
      setPage(totalPaginas)
    }
  }, [
    page,
    pageSize,
    totalItems,
  ])

  function cambiarFiltro(
    campo: keyof Filtros,
    valor: string,
  ): void {
    setFiltros((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  function buscar(): void {
    setFiltrosAplicados({
      ...filtros,
    })

    setPage(1)
  }

  function limpiar(): void {
    setFiltros({
      ...FILTROS_INICIALES,
    })

    setFiltrosAplicados({
      ...FILTROS_INICIALES,
    })

    setPage(1)
  }

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div className="maestro-topbar__copy">
              <h1>
                Productos más pedidos
              </h1>

              <p>
                Ranking de productos según las
                cantidades entregadas mediante
                vales de consumo registrados.
              </p>
            </div>

            <BarChart3
              size={36}
              className="text-success"
            />
          </div>
        </section>

        <div className="maestro-panel">
          <ResumenProductosMasPedidos
            resumen={resumen}
          />
        </div>

        <div className="maestro-panel">
          <FiltrosProductosMasPedidos
            valores={filtros}
            tiposProducto={tiposProducto}
            categorias={categorias}
            destinos={destinos}
            onChange={cambiarFiltro}
            onBuscar={buscar}
            onLimpiar={limpiar}
          />
        </div>

        <div className="maestro-panel">
          <GraficoProductosMasPedidos
            filas={filas}
          />
        </div>

        <div className="maestro-panel">
          <section className="maestro-table-card card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="maestro-table-header">
                <div>
                  <span className="maestro-kicker">
                    <BarChart3 size={16} />
                    Ranking completo
                  </span>

                  <p className="maestro-section-copy small mb-0 mt-1">
                    {totalItems}{' '}
                    producto(s) encontrado(s)
                  </p>
                </div>

                <ExportarProductosMasPedidosButton
                  filas={filas}
                  resumen={resumen}
                />
              </div>

              <TablaProductosMasPedidos
                filas={filasPaginadas}
              />

              <TablePagination
                totalItems={totalItems}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(
                  nuevoTamano,
                ) => {
                  setPageSize(nuevoTamano)
                  setPage(1)
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

