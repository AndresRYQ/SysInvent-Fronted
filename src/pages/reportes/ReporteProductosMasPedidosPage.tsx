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

import { listarReporteProductosApi } from '../../services/reportesApiService'
import { useFiltrosReporte } from '../../hooks/useFiltrosReporte'

import type { FilaProductoMasPedido } from '../../types/reporteProductoMasPedido'

import type {
  FiltrosProductosMasPedidos as Filtros,
} from '../../types/reporteProductoMasPedido'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  tipoProductoId: '',
  categoriaId: '',
  destinoId: '',
}

export function ReporteProductosMasPedidosPage() {
  const [filasApi, setFilasApi] = useState<FilaProductoMasPedido[]>([])
  const [totalApi, setTotalApi] = useState(0)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

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
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    setCargando(true)

    listarReporteProductosApi({
      ...filtrosAplicados,
      pagina: page,
      tamPagina: pageSize,
    })
      .then((resultado) => {
        if (!activo) return
        setFilasApi(resultado.datos)
        setTotalApi(resultado.totalElementos)
        setErrorCarga(null)
        setCargando(false)
      })
      .catch((error: unknown) => {
        if (!activo) return
        setFilasApi([])
        setTotalApi(0)
        setErrorCarga(error instanceof Error ? error.message : 'No se pudo cargar el reporte de productos.')
        setCargando(false)
      })

    return () => { activo = false }
  }, [filtrosAplicados, page, pageSize])

  const { catalogos, errorCatalogos } = useFiltrosReporte()
  const tiposProducto = catalogos.tiposProducto
  const categorias = catalogos.categorias
  const destinos = catalogos.destinos

  const filas = filasApi

  // El producto más pedido es el de posición 1 del ranking (primera página).
  const lider = filas.find((fila) => fila.posicion === 1)

  const resumen = useMemo(() => ({
    totalProductos: totalApi,
    totalVales: filas.reduce((total, fila) => total + fila.numeroVales, 0),
    totalDistribuciones: filas.reduce((total, fila) => total + fila.numeroDistribuciones, 0),
    totalValorizado: filas.reduce((total, fila) => total + fila.totalValorizado, 0),
    productoMasPedido: lider?.producto ?? (filas.length ? 'Ver primera página' : 'Sin registros'),
    cantidadProductoMasPedido: lider?.cantidadSolicitada ?? 0,
    unidadProductoMasPedido: lider?.unidadMedida ?? '',
  }), [filas, lider, totalApi])

  const totalItems = totalApi

  // El backend ya devuelve la página solicitada.
  const filasPaginadas = filas

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
      <PageLoadingOverlay visible={cargando} mensaje="Cargando reporte de productos..." />
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

        {errorCarga && (
          <div className="alert alert-danger" role="alert">
            {errorCarga}
          </div>
        )}

        {errorCatalogos && (
          <div className="alert alert-warning" role="alert">
            {errorCatalogos}
          </div>
        )}

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
          <section className="table-card card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-header">
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
