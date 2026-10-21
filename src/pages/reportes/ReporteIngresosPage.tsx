import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FileSpreadsheet,
} from 'lucide-react'

import { ExportarIngresosExcelButton } from '../../components/reportes/ingresos/ExportarIngresosExcelButton'
import { FiltrosReporteIngresos } from '../../components/reportes/ingresos/FiltrosReporteIngresos'
import { ResumenReporteIngresos } from '../../components/reportes/ingresos/ResumenReporteIngresos'
import { TablaReporteIngresos } from '../../components/reportes/ingresos/TablaReporteIngresos'
import { TablePagination } from '../../components/ui/TablePagination'

import { obtenerProductos } from '../../services/productoService'
import { obtenerProveedores } from '../../services/proveedorService'

import {
  obtenerFilasReporteIngresos,
  obtenerResumenReporteIngresos,
} from '../../services/reporteIngresoService'
import { listarReporteIngresosApi } from '../../services/reportesApiService'

import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  FiltrosReporteIngresos as Filtros,
} from '../../types/reporteIngreso'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  proveedorId: '',
  tipoProductoId: '',
  productoId: '',
  estado: '',
}

export function ReporteIngresosPage() {
  const [filas, setFilas] = useState<ReturnType<typeof obtenerFilasReporteIngresos>>([])
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

  useEffect(() => {
    let activo = true

    listarReporteIngresosApi({
      ...filtrosAplicados,
      pagina: page,
      tamPagina: pageSize,
    })
      .then((resultado) => {
        if (!activo) return
        setFilas(resultado.datos)
        setTotalApi(resultado.totalElementos)
        setErrorCarga(null)
      })
      .catch((error: unknown) => {
        if (!activo) return
        setErrorCarga(error instanceof Error ? error.message : 'No se pudo cargar el reporte de ingresos.')
        setFilas([])
        setTotalApi(0)
      })

    return () => { activo = false }
  }, [filtrosAplicados, page, pageSize])

  const proveedores = useMemo(
    () =>
      obtenerProveedores()
        .map((proveedor) => ({
          id: String(proveedor.id),
          nombre:
            proveedor.razonSocial,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

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

  const productos = useMemo(
    () =>
      obtenerProductos()
        .map((producto) => ({
          id: String(producto.productoId),
          codigo: producto.codigo,
          nombre: producto.nombre,
          tipoProductoId: String(
            producto.tipoProductoId,
          ).replace(/^TP-0*/, ''),
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const filasFiltradas = filas

  const resumen = useMemo(
    () =>
      obtenerResumenReporteIngresos(
        filasFiltradas,
      ),
    [filasFiltradas],
  )

  const totalItems = totalApi

  const filasPaginadas = useMemo(
    () => {
      return filasFiltradas
    },
    [
      filasFiltradas,
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
              <h1>Reporte de ingresos</h1>

              <p>
                Consulta los productos ingresados
                al almacén y exporta los resultados
                a Excel.
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

        <div className="maestro-panel">
          <ResumenReporteIngresos
            resumen={resumen}
          />
        </div>

        <div className="maestro-panel">
          <FiltrosReporteIngresos
            valores={filtros}
            proveedores={proveedores}
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

                    Detalle de ingresos
                  </span>

                  <p className="maestro-section-copy small mb-0 mt-1">
                    {totalItems}{' '}
                    resultado(s) encontrado(s)
                  </p>
                </div>

                <ExportarIngresosExcelButton
                  filas={filasFiltradas}
                />
              </div>

              <TablaReporteIngresos
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
