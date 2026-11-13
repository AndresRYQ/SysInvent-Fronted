import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FileSpreadsheet,
} from 'lucide-react'

import { ExportarValesExcelButton } from '../../components/reportes/vales/ExportarValesExcelButton'
import { FiltrosReporteVales } from '../../components/reportes/vales/FiltrosReporteVales'
import { ResumenReporteVales } from '../../components/reportes/vales/ResumenReporteVales'
import { TablaReporteVales } from '../../components/reportes/vales/TablaReporteVales'
import { TablePagination } from '../../components/ui/TablePagination'

import {
  obtenerResumenReporteVales,
} from '../../services/reporteValeService'
import { listarReporteValesApi } from '../../services/reportesApiService'
import { useFiltrosReporte } from '../../hooks/useFiltrosReporte'

import type { FilaReporteVale } from '../../types/reporteVale'

import type {
  FiltrosReporteVales as Filtros,
} from '../../types/reporteVale'

import '../../styles/DashboardPage.css'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'
import '../../styles/maestros.css'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  centroCostoId: '',
  destinoId: '',
  parteEquipoId: '',
  tipoProductoId: '',
  productoId: '',
  estado: '',
}

export function ReporteValesPage() {
  const [filasApi, setFilasApi] = useState<FilaReporteVale[]>([])
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

    listarReporteValesApi({
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
        setErrorCarga(error instanceof Error ? error.message : 'No se pudo cargar el reporte de vales.')
        setCargando(false)
      })

    return () => { activo = false }
  }, [filtrosAplicados, page, pageSize])

  const filas = filasApi

  const { catalogos, errorCatalogos } = useFiltrosReporte()
  const centrosCosto = catalogos.centrosCosto
  const destinos = catalogos.destinos
  const partesEquipo = catalogos.partesEquipo
  const tiposProducto = catalogos.tiposProducto
  const productos = catalogos.productos

  const filasFiltradas = filas

  const resumen = useMemo(
    () =>
      obtenerResumenReporteVales(
        filasFiltradas,
      ),
    [filasFiltradas],
  )

  const totalItems = totalApi

  // El backend ya devuelve la página solicitada.
  const filasPaginadas = filasFiltradas

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
      <PageLoadingOverlay visible={cargando} mensaje="Cargando reporte de vales..." />
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div className="maestro-topbar__copy">
              <h1>Reporte de vales</h1>

              <p>
                Consulta las salidas, destinos,
                partes de equipo y productos
                entregados mediante vales de
                consumo.
              </p>
            </div>

            <FileSpreadsheet
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
          <ResumenReporteVales
            resumen={resumen}
          />
        </div>

        <div className="maestro-panel">
          <FiltrosReporteVales
            valores={filtros}
            centrosCosto={centrosCosto}
            destinos={destinos}
            partesEquipo={partesEquipo}
            tiposProducto={tiposProducto}
            productos={productos}
            onChange={cambiarFiltro}
            onBuscar={buscar}
            onLimpiar={limpiar}
          />
        </div>

        <div className="maestro-panel">
          <section className="table-card card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-header">
                <div>
                  <span className="maestro-kicker">
                    <FileSpreadsheet
                      size={16}
                    />

                    Detalle de vales
                  </span>

                  <p className="maestro-section-copy small mb-0 mt-1">
                    {totalItems}{' '}
                    distribución(es)
                    encontrada(s)
                  </p>
                </div>

                <ExportarValesExcelButton
                  filas={filasFiltradas}
                />
              </div>

              <TablaReporteVales
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
